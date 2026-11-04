/**
 * CleanTube+ - Background Service Worker
 */

try {
  importScripts('../shared/defaultSettings.js');
} catch (e) {
  console.error('[CleanTube+] Failed to import defaultSettings:', e);
}

// Đồng bộ quy tắc chặn mạng (declarativeNetRequest)
async function syncDeclarativeRules(settings) {
  if (!chrome.declarativeNetRequest || !chrome.declarativeNetRequest.updateEnabledRulesets) return;

  const isMaster = settings.masterEnabled !== false;
  const shouldBlockWebp = isMaster && settings.blockAnimatedThumbnails !== false;
  const shouldBlockTelemetry = isMaster && settings.blockTelemetry !== false;

  const enableIds = [];
  const disableIds = [];

  if (shouldBlockWebp) enableIds.push('ct_block_an_webp');
  else disableIds.push('ct_block_an_webp');

  if (shouldBlockTelemetry) enableIds.push('ct_block_telemetry');
  else disableIds.push('ct_block_telemetry');

  try {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: enableIds,
      disableRulesetIds: disableIds
    });
  } catch (err) {
    console.warn('[CleanTube+] Update ruleset error:', err);
  }
}

// Khởi tạo cài đặt & Tự động reload các tab YouTube khi extension được nạp lại
chrome.runtime.onInstalled.addListener(async () => {
  let settings = { ...self.DEFAULT_SETTINGS };
  if (chrome.storage && chrome.storage.sync) {
    const current = await chrome.storage.sync.get(null);
    settings = { ...self.DEFAULT_SETTINGS, ...current };
    await chrome.storage.sync.set(settings);
  }

  await syncDeclarativeRules(settings);

  // Tự động reload tất cả các tab YouTube đang mở
  if (chrome.tabs) {
    try {
      const tabs = await chrome.tabs.query({ url: '*://*.youtube.com/*' });
      tabs.forEach((t) => {
        if (t.id) chrome.tabs.reload(t.id);
      });
    } catch (err) {
      console.warn('[CleanTube+] Auto-reload tabs error:', err);
    }
  }
});

// Lắng nghe thay đổi cài đặt
if (chrome.storage && chrome.storage.onChanged) {
  chrome.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName === 'sync') {
      const current = await chrome.storage.sync.get(null);
      await syncDeclarativeRules(current);
    }
  });
}

// Click icon trên thanh công cụ: Mở YouTube hoặc Reload tab YouTube hiện tại (Không bật GUI Popup)
if (chrome.action && chrome.action.onClicked) {
  chrome.action.onClicked.addListener((tab) => {
    if (tab && tab.url && tab.url.includes('youtube.com')) {
      chrome.tabs.reload(tab.id);
    } else {
      chrome.tabs.create({ url: 'https://www.youtube.com' });
    }
  });
}
