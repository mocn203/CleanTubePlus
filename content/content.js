/**
 * CleanTube+ - Content Script
 */

(function () {
  let settings = { ...DEFAULT_SETTINGS };

  // Dọn sạch menu profile khi người dùng mở menu
  function cleanProfileMenuElements() {
    if (!settings.masterEnabled || !settings.cleanProfileMenu) return;

    const menu = document.querySelector('ytd-multi-page-menu-renderer');
    if (!menu) return;

    const items = menu.querySelectorAll('ytd-compact-link-renderer');
    items.forEach((item) => {
      const text = item.textContent.trim().toLowerCase();
      if (text.includes('tài khoản google') || text.includes('google account')) {
        item.setAttribute('data-ct-hide', 'google-account');
      } else if (text.includes('phím tắt') || text.includes('keyboard shortcut')) {
        item.setAttribute('data-ct-hide', 'shortcuts');
      } else if (
        text.includes('trợ giúp') ||
        text.includes('help') ||
        text.includes('phản hồi') ||
        text.includes('feedback')
      ) {
        item.setAttribute('data-ct-hide', 'help-feedback');
      }
    });
  }

  // Xóa nút Ask AI, Tải xuống, Nút 3 chấm & Report bên dưới video
  function cleanVideoActionButtons() {
    if (!settings.masterEnabled || settings.cleanActionButtons === false) return;

    const actionContainers = document.querySelectorAll(
      '#actions, #top-level-buttons-computed, #flexible-item-buttons, ytd-menu-renderer.ytd-watch-metadata'
    );
    actionContainers.forEach((container) => {
      // 1. Tải xuống (Download)
      const downloadElements = container.querySelectorAll(
        'ytd-download-button-renderer, [aria-label*="Tải xuống"], [aria-label*="Download"]'
      );
      downloadElements.forEach((el) => {
        const btn = el.closest('yt-button-view-model, ytd-button-renderer, ytd-download-button-renderer') || el;
        btn.setAttribute('data-ct-hide', 'download-button');
      });

      // 2. Ask AI (Đặt câu hỏi / Biểu tượng ngôi sao 4 cánh)
      const aiElements = container.querySelectorAll(
        '[aria-label*="Ask"], [aria-label*="Đặt câu hỏi"], [chip-style*="AI"], .you-chat-entrypoint-button'
      );
      aiElements.forEach((el) => {
        const btn = el.closest('yt-button-view-model, ytd-button-renderer') || el;
        btn.setAttribute('data-ct-hide', 'ask-ai');
      });

      // 3. Nút 3 chấm (More actions / Tác vụ khác dưới video)
      const moreButtons = container.querySelectorAll(
        'yt-icon-button.dropdown-trigger, #button.dropdown-trigger, yt-icon-button#button, [aria-label*="More actions"], [aria-label*="Tác vụ khác"]'
      );
      moreButtons.forEach((el) => {
        const btn = el.closest('yt-button-view-model, ytd-button-renderer, yt-icon-button, yt-button-shape') || el;
        btn.setAttribute('data-ct-hide', 'more-actions');
      });

      // Quét text trên button
      const allButtons = container.querySelectorAll('yt-button-view-model, ytd-button-renderer');
      allButtons.forEach((btn) => {
        const text = btn.textContent.trim().toLowerCase();
        if (text.includes('đặt câu hỏi') || text === 'ask' || text.startsWith('ask ')) {
          btn.setAttribute('data-ct-hide', 'ask-ai');
        } else if (text.includes('tải xuống') || text === 'download') {
          btn.setAttribute('data-ct-hide', 'download-button');
        } else if (text.includes('remix') || text.includes('phối lại')) {
          btn.setAttribute('data-ct-hide', 'remix-button');
          btn.style.setProperty('display', 'none', 'important');
        }
      });

      // 5. Nút Remix (Phối lại) dưới video thường
      const remixElements = container.querySelectorAll(
        '[aria-label*="Remix" i], [aria-label*="Phối lại" i], [title*="Remix" i], [title*="Phối lại" i]'
      );
      remixElements.forEach((el) => {
        const btn = el.closest('yt-button-view-model, ytd-button-renderer') || el;
        btn.setAttribute('data-ct-hide', 'remix-button');
        btn.style.setProperty('display', 'none', 'important');
      });
    });

    // 4. Quét menu popup: Ẩn mục Báo cáo vi phạm (Report) & Remix
    const popupItems = document.querySelectorAll('ytd-menu-service-item-renderer, tp-yt-paper-item');
    popupItems.forEach((item) => {
      const text = item.textContent.trim().toLowerCase();
      if (text.includes('báo cáo') || text.includes('report')) {
        item.setAttribute('data-ct-hide', 'report');
      } else if (text.includes('remix') || text.includes('phối lại')) {
        item.setAttribute('data-ct-hide', 'remix-button');
        item.style.setProperty('display', 'none', 'important');
      }
    });
  }

  function applySettings(s) {
    const html = document.documentElement;
    if (!html) return;

    const isMaster = s.masterEnabled !== false;

    // 1. Ẩn thanh thẻ chủ đề trang chủ
    const hideChips = isMaster && s.hideTopicChips !== false;
    html.setAttribute('data-ct-hide-chips', hideChips ? 'true' : 'false');

    // 2. Làm sạch phần mô tả video (Description)
    const cleanDesc = isMaster && s.cleanDescription !== false;
    html.setAttribute('data-ct-clean-desc', cleanDesc ? 'true' : 'false');

    // 3. Ẩn thanh cuộn (Scrollbar) - Fix Full
    const hideScroll = isMaster && s.hideScrollbar !== false;
    html.setAttribute('data-ct-hide-scrollbar', hideScroll ? 'true' : 'false');

    // 4. Làm sạch menu profile
    const cleanProfile = isMaster && s.cleanProfileMenu !== false;
    html.setAttribute('data-ct-clean-profile', cleanProfile ? 'true' : 'false');

    // 5. Tắt hiệu ứng nổi khung và video preview khi rê chuột
    const disableHover = isMaster && s.disableHoverPreview !== false;
    html.setAttribute('data-ct-disable-hover', disableHover ? 'true' : 'false');

    // 6. Chặn tải ảnh động Thumbnail (Animated WebP)
    const blockWebp = isMaster && s.blockAnimatedThumbnails !== false;
    html.setAttribute('data-ct-block-animated-thumbs', blockWebp ? 'true' : 'false');

    // 7. Tắt Ambient Mode (Ánh sáng hắt xung quanh player)
    const disableAmbient = isMaster && s.disableAmbientMode !== false;
    html.setAttribute('data-ct-disable-ambient', disableAmbient ? 'true' : 'false');

    // 8. Ẩn Thẻ màn hình kết thúc che video (Endscreen)
    const hideEndscreen = isMaster && s.hideEndscreenCards !== false;
    html.setAttribute('data-ct-hide-endscreen', hideEndscreen ? 'true' : 'false');

    // 9. Tắt hiệu ứng Skeleton Shimmer khi cuộn trang
    const disableShimmer = isMaster && s.disableShimmer !== false;
    html.setAttribute('data-ct-disable-shimmer', disableShimmer ? 'true' : 'false');

    // 10. Ẩn Kệ bán hàng & Banner quảng cáo Premium
    const hideMerch = isMaster && s.hideMerchAndPromo !== false;
    html.setAttribute('data-ct-hide-merch-promo', hideMerch ? 'true' : 'false');

    // 11. Xóa nút Ask AI (Đặt câu hỏi) & Tải xuống (Download) dưới video
    const cleanActions = isMaster && s.cleanActionButtons !== false;
    html.setAttribute('data-ct-clean-actions', cleanActions ? 'true' : 'false');

    // 12. Giải phóng VRAM / GPU Compositing Layers
    const optGpu = isMaster && s.optimizeGpuLayers !== false;
    html.setAttribute('data-ct-optimize-gpu', optGpu ? 'true' : 'false');

    // 13. Chặn pop-up "Video đã tạm dừng" & Tắt tự động đếm ngược phát video
    const autoConfirm = isMaster && s.autoConfirmPaused !== false;
    html.setAttribute('data-ct-autoconfirm', autoConfirm ? 'true' : 'false');

    const noAutonav = isMaster && s.disableAutoplayNext !== false;
    html.setAttribute('data-ct-disable-autonav', noAutonav ? 'true' : 'false');

    // 14. Clean YouTube Shorts (Dọn rác overlay & mở khóa điều khiển)
    const cleanShorts = isMaster && s.cleanShorts !== false;
    html.setAttribute('data-ct-clean-shorts', cleanShorts ? 'true' : 'false');

    // 15. Engine Zero-Fatigue: Tự động thu hồi Texture VRAM & DOM ngoài màn hình
    const zeroFatigue = isMaster && s.engineZeroFatigue !== false;
    html.setAttribute('data-ct-zero-fatigue', zeroFatigue ? 'true' : 'false');

    if (cleanProfile) {
      cleanProfileMenuElements();
    }
    if (cleanActions) {
      cleanVideoActionButtons();
    }
    if (noAutonav) {
      disableAutoplayNextVideo();
    }
    if (cleanShorts) {
      cleanShortsElements();
      manageShortsLoop();
    }
    if (zeroFatigue) {
      initTextureMemoryRecycler();
    }
    if (isMaster && s.preventDomLeak !== false) {
      cleanupDomMemory();
    }
  }

  // Khởi tạo từ storage
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(null, (data) => {
      settings = { ...DEFAULT_SETTINGS, ...data };
      applySettings(settings);
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'sync') {
        for (const [key, value] of Object.entries(changes)) {
          settings[key] = value.newValue;
        }
        applySettings(settings);
      }
    });
  } else {
    applySettings(settings);
  }

  // Lắng nghe mouseover/mouseenter ở capture phase để triệt tiêu mọi style nền/khung mà YouTube gán động
  document.addEventListener(
    'mouseover',
    (e) => {
      if (!settings.masterEnabled || !settings.disableHoverPreview) return;
      const target = e.target;
      if (!target) return;

      // 1. Nếu là yt-touch-feedback-shape hoặc nằm bên trong nó -> ẩn ngay
      if (target.closest) {
        const feedback = target.closest('yt-touch-feedback-shape, [class*="TouchFeedbackShape"], [class*="touch-feedback"]');
        if (feedback) {
          feedback.style.setProperty('display', 'none', 'important');
          feedback.style.setProperty('opacity', '0', 'important');
          feedback.style.setProperty('background', 'transparent', 'important');
        }

        // 2. Tìm thẻ video cha nếu có (Trang chủ, Cột gợi ý Watch page, Tìm kiếm)
        const videoCard = target.closest(
          'ytd-rich-item-renderer, ytd-compact-video-renderer, yt-lockup-view-model, compact-landscape-no-button-layout-view-model, ytd-video-renderer, ytd-grid-video-renderer'
        );
        if (videoCard) {
          // Xóa ngay các feedback shape bên trong
          const innerFeedbacks = videoCard.querySelectorAll(
            'yt-touch-feedback-shape, [class*="ytSpecTouchFeedbackShape"], [class*="TouchFeedbackShape"]'
          );
          innerFeedbacks.forEach((f) => {
            f.style.setProperty('display', 'none', 'important');
            f.style.setProperty('opacity', '0', 'important');
            f.style.setProperty('background', 'transparent', 'important');
          });

          // Xóa inline background hoặc box-shadow nếu YouTube vừa gán động
          if (videoCard.style && (videoCard.style.backgroundColor || videoCard.style.background || videoCard.style.boxShadow)) {
            videoCard.style.backgroundColor = 'transparent';
            videoCard.style.background = 'transparent';
            videoCard.style.boxShadow = 'none';
          }
        }
      }
    },
    { passive: true, capture: true }
  );

  // Tự động bỏ qua pop-up "Video đã tạm dừng. Bạn có muốn tiếp tục xem?"
  function autoConfirmContinueWatching() {
    if (!settings.masterEnabled || settings.autoConfirmPaused === false) return;

    const dialog = document.querySelector('yt-confirm-dialog-renderer');
    if (dialog) {
      const confirmBtn = dialog.querySelector('#confirm-button, yt-button-shape button');
      if (confirmBtn) {
        confirmBtn.click();
      }
      const video = document.querySelector('video');
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    }

    const paperDialog = document.querySelector('tp-yt-paper-dialog:has(yt-confirm-dialog-renderer)');
    if (paperDialog && paperDialog.style.display !== 'none') {
      const btn = paperDialog.querySelector('#confirm-button, button');
      if (btn) btn.click();
      const video = document.querySelector('video');
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    }
  }

  // Tắt tự động đếm ngược phát video tiếp theo (Autonav toggle & Upnext countdown)
  function disableAutoplayNextVideo() {
    if (!settings.masterEnabled || settings.disableAutoplayNext === false) return;

    // 1. Tắt công tắc Autoplay trên thanh điều khiển player nếu đang Bật
    const autonavToggle = document.querySelector('.ytp-autonav-toggle-button');
    if (autonavToggle && autonavToggle.getAttribute('aria-checked') === 'true') {
      autonavToggle.click();
    }

    // 2. Nếu đếm ngược UpNext xuất hiện -> Hủy ngay lập tức
    const cancelBtn = document.querySelector(
      '.ytp-autonav-endscreen-button-cancel, .ytp-upnext-cancel-button'
    );
    if (cancelBtn) {
      cancelBtn.click();
    }
  }

  // ==========================================================================
  // 14. CLEAN YOUTUBE SHORTS (HƯỚNG A: TINH GỌN & MỞ KHÓA ĐIỀU KHIỂN)
  // ==========================================================================

  // Lấy thẻ video Shorts đang hoạt động
  function getActiveShortsVideo() {
    if (!window.location.pathname.startsWith('/shorts/')) return null;

    // 1. Reel đang active
    const activeReel = document.querySelector(
      'ytd-reel-video-renderer[is-active], ytd-reel-video-renderer.ytd-shorts[is-active]'
    );
    if (activeReel) {
      const v = activeReel.querySelector('video');
      if (v) return v;
    }

    // 2. Video đang phát trong ytd-shorts
    const shortsContainer = document.querySelector('ytd-shorts');
    if (shortsContainer) {
      const videos = shortsContainer.querySelectorAll('video');
      for (const v of videos) {
        if (!v.paused || v.currentTime > 0) return v;
      }
      if (videos.length > 0) return videos[0];
    }
    return null;
  }

  // Quét và xóa dứt điểm nút Remix, số lượt remix (ví dụ 160K), và mọi thứ sau nút Share
  function purgeRemixAndAfterShare() {
    if (!settings.masterEnabled || settings.cleanShorts === false) return;
    if (!window.location.pathname.startsWith('/shorts/')) return;

    // 1. Quét thẳng cột #actions bên phải Shorts: Xóa sạch toàn bộ mục nằm sau nút Share
    const actionBars = document.querySelectorAll(
      '#actions, ytd-reel-player-overlay-renderer #actions, ytd-shorts #actions'
    );
    actionBars.forEach((bar) => {
      let afterShare = false;
      Array.from(bar.children).forEach((child) => {
        const text = (child.textContent || '').trim().toLowerCase();
        const label = (child.getAttribute('aria-label') || '').toLowerCase();
        const id = (child.id || '').toLowerCase();
        const html = (child.innerHTML || '').toLowerCase();

        // Nhận diện nút Share (Chia sẻ)
        if (
          id.includes('share') ||
          label.includes('share') ||
          label.includes('chia sẻ') ||
          child.querySelector('#share-button, [aria-label*="Share" i], [aria-label*="Chia sẻ" i]')
        ) {
          afterShare = true;
          return;
        }

        // Nhận diện trực tiếp nút Remix
        const isRemix =
          id.includes('remix') ||
          label.includes('remix') ||
          label.includes('phối lại') ||
          html.includes('remix') ||
          html.includes('phối lại');

        // Bất kỳ mục nào nằm sau nút Share (như số 160K, Remix, đĩa nhạc) đều bị loại bỏ ngay
        if (afterShare || isRemix) {
          const isMenu =
            id.includes('menu') ||
            label.includes('more') ||
            label.includes('tác vụ') ||
            child.querySelector('ytd-menu-renderer, [aria-label*="More" i], [aria-label*="Tác vụ" i]');
          if (!isMenu) {
            child.style.setProperty('display', 'none', 'important');
            child.style.setProperty('visibility', 'hidden', 'important');
            child.style.setProperty('height', '0', 'important');
            child.setAttribute('data-ct-hide', 'shorts-after-share');
          }
        }
      });
    });

    // 2. Quét sâu mọi leaf element chứa text "Remix" hoặc "Phối lại"
    const leafNodes = document.querySelectorAll(
      'ytd-shorts span, ytd-shorts yt-formatted-string, ytd-shorts label, ytd-shorts div, ytd-reel-player-overlay-renderer span, ytd-reel-player-overlay-renderer yt-formatted-string'
    );
    leafNodes.forEach((node) => {
      if (node.childElementCount === 0 && node.textContent) {
        const txt = node.textContent.trim().toLowerCase();
        if (txt === 'remix' || txt === 'phối lại') {
          node.style.setProperty('display', 'none', 'important');
          node.style.setProperty('visibility', 'hidden', 'important');
          node.style.setProperty('font-size', '0', 'important');
          node.setAttribute('data-ct-hide', 'shorts-remix-text');

          const parentWrapper = node.closest('#actions > *, ytd-button-renderer, yt-button-view-model, yt-button-shape');
          if (parentWrapper && parentWrapper.id !== 'actions') {
            parentWrapper.style.setProperty('display', 'none', 'important');
            parentWrapper.style.setProperty('visibility', 'hidden', 'important');
            parentWrapper.setAttribute('data-ct-hide', 'shorts-remix');
          }
        }
      }
    });

    // 3. Quét trực tiếp các selector ID #remix-button
    const directRemixElements = document.querySelectorAll(
      '#remix-button, [id*="remix-button"], ytd-button-renderer[is-remix], ytd-shorts [aria-label*="Remix" i], ytd-shorts [aria-label*="Phối lại" i]'
    );
    directRemixElements.forEach((el) => {
      const target = el.closest('#actions > *, ytd-button-renderer, yt-button-view-model, yt-button-shape') || el;
      target.style.setProperty('display', 'none', 'important');
      target.style.setProperty('visibility', 'hidden', 'important');
      target.setAttribute('data-ct-hide', 'shorts-remix');
    });
  }

  // Ẩn dứt điểm nút Play / Pause overlay góc trên bên trái Shorts (.ytp-play-button)
  function cleanShortsPlayButton() {
    if (!settings.masterEnabled || settings.cleanShorts === false) return;
    if (!window.location.pathname.startsWith('/shorts/')) return;

    // 1. Quét trực tiếp lớp điều khiển của YouTube HTML5 Player (.ytp-play-button)
    const ytpPlayButtons = document.querySelectorAll(
      'ytd-shorts .ytp-play-button, ytd-shorts .ytp-large-play-button, ytd-reel-video-renderer .ytp-play-button, ytd-reel-video-renderer .ytp-large-play-button'
    );
    ytpPlayButtons.forEach((btn) => {
      btn.style.setProperty('display', 'none', 'important');
      btn.style.setProperty('visibility', 'hidden', 'important');
      btn.style.setProperty('opacity', '0', 'important');
      btn.style.setProperty('pointer-events', 'none', 'important');
      btn.setAttribute('data-ct-hide', 'shorts-play-button');
    });

    // 2. Quét các nút có nhãn Play/Pause trong giao diện Shorts
    const playButtons = document.querySelectorAll(
      'ytd-shorts button[aria-label*="Play" i], ytd-shorts button[aria-label*="Pause" i], ytd-shorts button[aria-label*="Phát" i], ytd-shorts button[aria-label*="Tạm dừng" i], ytd-shorts yt-icon-button, ytd-reel-player-overlay-renderer yt-icon-button'
    );
    playButtons.forEach((btn) => {
      const label = (btn.getAttribute('aria-label') || '').toLowerCase();
      const innerBtn = btn.querySelector('button');
      const innerLabel = innerBtn ? (innerBtn.getAttribute('aria-label') || '').toLowerCase() : '';
      const hasPlayPausePath = btn.querySelector('path[d*="M8 5v14l11-7z"], path[d*="M6 19h4"], path[d*="m 10,8"]');
      if (
        hasPlayPausePath ||
        label.includes('play') ||
        label.includes('phát') ||
        label.includes('pause') ||
        label.includes('tạm dừng') ||
        innerLabel.includes('play') ||
        innerLabel.includes('phát') ||
        innerLabel.includes('pause') ||
        innerLabel.includes('tạm dừng')
      ) {
        const isSafeToHide =
          !label.includes('mute') &&
          !label.includes('tiếng') &&
          !label.includes('volume') &&
          !label.includes('âm') &&
          !label.includes('more') &&
          !label.includes('khác') &&
          !label.includes('list') &&
          !innerLabel.includes('mute') &&
          !innerLabel.includes('tiếng') &&
          !innerLabel.includes('volume') &&
          !innerLabel.includes('âm') &&
          !innerLabel.includes('more') &&
          !innerLabel.includes('khác') &&
          !innerLabel.includes('list');
        if (isSafeToHide) {
          btn.style.setProperty('display', 'none', 'important');
          btn.style.setProperty('visibility', 'hidden', 'important');
          btn.style.setProperty('opacity', '0', 'important');
          btn.style.setProperty('pointer-events', 'none', 'important');
          btn.setAttribute('data-ct-hide', 'shorts-play-button');
        }
      }
    });
  }

  // Ẩn tiêu đề video Shorts & dòng âm thanh dưới tiêu đề (giữ nguyên Avatar logo & Tên kênh)
  function cleanShortsTitle() {
    if (!settings.masterEnabled || settings.cleanShorts === false) return;
    if (!window.location.pathname.startsWith('/shorts/')) return;

    // 1. Quét các phần tử tiêu đề Shorts
    const titles = document.querySelectorAll(
      'ytd-shorts yt-shorts-video-title-view-model, ytd-reel-player-overlay-renderer yt-shorts-video-title-view-model, ytd-reel-player-overlay-renderer #title, ytd-reel-player-overlay-renderer .title, ytd-reel-player-overlay-renderer h3.title, ytd-reel-player-overlay-renderer yt-formatted-string.title, ytd-shorts #title, ytd-shorts h3.title, ytd-shorts h2.title'
    );
    titles.forEach((el) => {
      // Đảm bảo không bao giờ đụng vào tên kênh và avatar logo của kênh
      if (!el.closest('ytd-channel-name, #channel-name, ytd-reel-player-header-renderer, yt-avatar-shape, #channel-thumbnail')) {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.setAttribute('data-ct-hide', 'shorts-title');
      }
    });

    // 2. Ẩn dòng audio / sound marquee dưới tiêu đề
    const soundMetadata = document.querySelectorAll(
      'ytd-reel-player-overlay-renderer #sound-metadata, ytd-reel-player-overlay-renderer .sound-title, ytd-reel-player-overlay-renderer [class*="sound-metadata"], ytd-reel-player-overlay-renderer [class*="sound-title"], ytd-shorts [class*="sound-title"], ytd-shorts [class*="sound-metadata"]'
    );
    soundMetadata.forEach((el) => {
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
      el.setAttribute('data-ct-hide', 'shorts-sound');
    });
  }

  // Dọn rác overlay trên Shorts (Remix, Sound button, Shopping, Related video, v.v.)
  function cleanShortsElements() {
    if (!settings.masterEnabled || settings.cleanShorts === false) return;
    if (!window.location.pathname.startsWith('/shorts/')) return;

    purgeRemixAndAfterShare();
    cleanShortsPlayButton();
    cleanShortsTitle();

    const overlays = document.querySelectorAll(
      'ytd-reel-player-overlay-renderer, ytd-reel-video-renderer'
    );
    overlays.forEach((overlay) => {
      // 3. Đĩa xoay nhạc / Sound button & marquee title
      const soundBtns = overlay.querySelectorAll(
        'ytd-reel-channel-with-sound-button-renderer, [aria-label*="Sound" i], [aria-label*="Âm thanh" i], .sound-title, #sound-metadata'
      );
      soundBtns.forEach((b) => {
        b.setAttribute('data-ct-hide', 'shorts-sound');
      });

      // 4. Nút đăng ký kênh trên video Shorts
      const subBtns = overlay.querySelectorAll(
        'ytd-subscribe-button-renderer, yt-subscribe-button-view-model'
      );
      subBtns.forEach((b) => {
        b.setAttribute('data-ct-hide', 'shorts-subscribe');
      });

      // 5. Thẻ bán hàng & Shopping banner
      const shopCards = overlay.querySelectorAll(
        'ytd-shopping-card-renderer, ytd-shopping-companion-renderer, [class*="shopping"], [class*="product-tag"]'
      );
      shopCards.forEach((b) => {
        b.setAttribute('data-ct-hide', 'shorts-shopping');
      });

      // 6. Thẻ video liên quan
      const relCards = overlay.querySelectorAll(
        'ytd-reel-related-video-renderer, [class*="related-video"]'
      );
      relCards.forEach((b) => {
        b.setAttribute('data-ct-hide', 'shorts-related');
      });
    });
  }

  // Quản lý loop Shorts: Ngăn lặp vô tận, tự động dừng ở cuối video
  function manageShortsLoop() {
    if (!settings.masterEnabled || settings.cleanShorts === false) return;
    if (!window.location.pathname.startsWith('/shorts/')) return;

    const shortsContainer = document.querySelector('ytd-shorts');
    if (!shortsContainer) return;

    const videos = shortsContainer.querySelectorAll('video');
    videos.forEach((video) => {
      if (video.loop) {
        video.loop = false;
      }
      if (!video.dataset.ctLoopAttached) {
        video.dataset.ctLoopAttached = 'true';
        video.addEventListener('ended', () => {
          if (!settings.masterEnabled || settings.cleanShorts === false) return;
          video.pause();
        });
        video.addEventListener('play', () => {
          if (settings.masterEnabled && settings.cleanShorts !== false) {
            video.loop = false;
          }
        });
      }
    });
  }

  // Xử lý phím tắt cho Shorts (Tua thời gian, Play/Pause, Tốc độ, Âm lượng)
  function handleShortsKeydown(e) {
    if (!settings.masterEnabled || settings.cleanShorts === false) return;
    if (!window.location.pathname.startsWith('/shorts/')) return;

    const target = e.target;
    if (target) {
      const tagName = target.tagName ? target.tagName.toLowerCase() : '';
      if (
        target.isContentEditable ||
        tagName === 'input' ||
        tagName === 'textarea' ||
        tagName === 'select' ||
        (target.closest && target.closest('#comments, ytd-commentbox, ytd-comments'))
      ) {
        return;
      }
    }

    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const v = getActiveShortsVideo();
    if (!v) return;

    const key = e.key;

    // 1. Tua lùi 5s: ArrowLeft hoặc j/J
    if (key === 'ArrowLeft' || key === 'j' || key === 'J') {
      e.preventDefault();
      e.stopPropagation();
      v.currentTime = Math.max(0, v.currentTime - 5);
      return;
    }

    // 2. Tua tới 5s: ArrowRight hoặc l/L
    if (key === 'ArrowRight' || key === 'l' || key === 'L') {
      e.preventDefault();
      e.stopPropagation();
      v.currentTime = Math.min(v.duration || Infinity, v.currentTime + 5);
      return;
    }

    // 3. Play / Pause: k/K
    if (key === 'k' || key === 'K') {
      e.preventDefault();
      e.stopPropagation();
      if (v.paused) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
      return;
    }

    // 4. Tăng tốc độ: Shift + > hoặc > hoặc .
    if (key === '>' || (e.shiftKey && key === '.')) {
      e.preventDefault();
      e.stopPropagation();
      const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5];
      const curSpeed = v.playbackRate || 1;
      const nextSpeed = speeds.find((s) => s > curSpeed + 0.01) || 2.5;
      v.playbackRate = nextSpeed;
      return;
    }

    // 5. Giảm tốc độ: Shift + < hoặc < hoặc ,
    if (key === '<' || (e.shiftKey && key === ',')) {
      e.preventDefault();
      e.stopPropagation();
      const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5];
      const curSpeed = v.playbackRate || 1;
      const prevSpeed = [...speeds].reverse().find((s) => s < curSpeed - 0.01) || 0.5;
      v.playbackRate = prevSpeed;
      return;
    }

    // 6. Bật / Tắt tiếng: m/M
    if (key === 'm' || key === 'M') {
      e.preventDefault();
      e.stopPropagation();
      v.muted = !v.muted;
      return;
    }

    // 7. Nhảy đến vị trí 0%-90%: phím số 0-9
    if (/^[0-9]$/.test(key) && !e.shiftKey) {
      if (v.duration && isFinite(v.duration)) {
        e.preventDefault();
        e.stopPropagation();
        const frac = parseInt(key, 10) / 10;
        v.currentTime = frac * v.duration;
        return;
      }
    }
  }

  // Đăng ký sự kiện bàn phím phím tắt Shorts
  document.addEventListener('keydown', handleShortsKeydown, { capture: true });

  // Lên lịch dọn dẹp bằng requestAnimationFrame để không bao giờ tụt fps khi cuộn Shorts
  let cleanTaskScheduled = false;
  function scheduleCleanTasks() {
    if (cleanTaskScheduled) return;
    cleanTaskScheduled = true;
    requestAnimationFrame(() => {
      cleanTaskScheduled = false;
      cleanProfileMenuElements();
      cleanVideoActionButtons();
      autoConfirmContinueWatching();
      disableAutoplayNextVideo();
      cleanShortsElements();
      manageShortsLoop();
    });
  }

  // Theo dõi mở popup menu profile & ngăn chặn hiệu ứng highlight video & dọn nút video
  const observer = new MutationObserver((mutations) => {
    scheduleCleanTasks();

    if (settings.masterEnabled && settings.disableHoverPreview) {
      for (const m of mutations) {
        if (m.type === 'attributes') {
          const target = m.target;
          if (!target) continue;

          if (m.attributeName === 'class' && target.classList) {
            if (target.classList.contains('ytd-rich-item-renderer-highlight')) {
              target.classList.remove('ytd-rich-item-renderer-highlight');
            }
            if (target.classList.contains('ytd-rich-item-renderer-highlight-border')) {
              target.classList.remove('ytd-rich-item-renderer-highlight-border');
            }
            if (target.classList.contains('ytSpecTouchFeedbackShapeHovered')) {
              target.classList.remove('ytSpecTouchFeedbackShapeHovered');
            }
          }

          if (m.attributeName === 'rich-grid-hover-highlight' && target.removeAttribute) {
            target.removeAttribute('rich-grid-hover-highlight');
          }

          if (m.attributeName === 'style' && target.style) {
            const tagName = target.tagName ? target.tagName.toLowerCase() : '';
            if (
              tagName === 'yt-touch-feedback-shape' ||
              (target.classList && target.classList.contains('yt-spec-touch-feedback-shape'))
            ) {
              target.style.setProperty('display', 'none', 'important');
              target.style.setProperty('opacity', '0', 'important');
            }
            if (target.style.boxShadow) {
              target.style.boxShadow = 'none';
            }
          }
        }
      }
    }
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'rich-grid-hover-highlight', 'style']
  });

  // Dọn dẹp DOM khi chuyển video / chuyển trang (Ngăn ngừa rò rỉ bộ nhớ DOM)
  function cleanupDomMemory() {
    if (!settings.masterEnabled || settings.preventDomLeak === false) return;

    // 1. Dọn dẹp các preview player thừa bị bỏ quên
    const orphanPreviews = document.querySelectorAll(
      'ytd-inline-preview-renderer:not([aria-hidden="false"]), #inline-preview-player'
    );
    orphanPreviews.forEach((el) => {
      const isMainPlayer = el.closest('ytd-watch-flexy #player') || el.closest('#movie_player');
      if (!isMainPlayer && el.parentNode) {
        el.remove();
      }
    });

    // 2. Dọn dẹp các tooltip / popup bị cô lập
    const orphanPopups = document.querySelectorAll(
      'tp-yt-paper-tooltip[aria-hidden="true"], yt-tooltip-renderer[aria-hidden="true"]'
    );
    orphanPopups.forEach((p) => {
      p.remove();
    });

    // 3. Dọn dẹp các engagement panel shopping/merch bị ẩn
    const hiddenPanels = document.querySelectorAll(
      'ytd-engagement-panel-section-list-renderer[visibility="ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"]'
    );
    hiddenPanels.forEach((panel) => {
      const targetId = panel.getAttribute('target-id') || '';
      if (targetId.includes('shopping') || targetId.includes('merch')) {
        panel.remove();
      }
    });

    // 4. Engine Zero-Fatigue: Dọn dẹp DOM của các trang cũ bị YouTube ẩn trong ytd-page-manager
    const inactivePages = document.querySelectorAll(
      'ytd-page-manager > [hidden], ytd-page-manager > [style*="display: none"]'
    );
    inactivePages.forEach((page) => {
      const oldContents = page.querySelectorAll(
        '#contents.ytd-rich-grid-renderer > ytd-rich-item-renderer:nth-child(n+30)'
      );
      oldContents.forEach((el) => el.remove());
    });

    // 5. Engine Zero-Fatigue: Giới hạn số lượng thread bình luận tích tụ khi đọc comment quá sâu
    const commentThreads = document.querySelectorAll(
      '#comments #contents.ytd-item-section-renderer > ytd-comment-thread-renderer'
    );
    if (commentThreads.length > 250) {
      for (let i = 0; i < commentThreads.length - 200; i++) {
        const ct = commentThreads[i];
        if (ct && ct.getBoundingClientRect().bottom < -3000) {
          ct.remove();
        }
      }
    }
  }

  // ==========================================================================
  // 15. ENGINE ZERO-FATIGUE: INFINITE DOM RECYCLER & GPU TEXTURE EVICTION
  // - Tự động thu hồi Texture VRAM và dọn dẹp các node DOM quá xa tầm nhìn (>2000px)
  // - Giữ mức chiếm dụng VRAM của card đồ họa luôn mát mẻ và nhẹ bẫng
  // ==========================================================================
  let textureObserver = null;
  const BLANK_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  function initTextureMemoryRecycler() {
    if (!settings.masterEnabled || settings.engineZeroFatigue === false) return;
    if (typeof IntersectionObserver === 'undefined') return;

    if (!textureObserver) {
      textureObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const target = entry.target;
            if (!target) return;

            if (entry.isIntersecting) {
              // 1. Node quay trở lại vùng nhìn: Khôi phục ảnh gốc
              if (target.dataset.ctEvictedSrc) {
                target.src = target.dataset.ctEvictedSrc;
                delete target.dataset.ctEvictedSrc;
              }
              if (target.dataset.ctEvictedSrcset) {
                target.srcset = target.dataset.ctEvictedSrcset;
                delete target.dataset.ctEvictedSrcset;
              }
            } else {
              // 2. Node đã cuộn ra xa khỏi vùng nhìn (>2000px):
              // Tạm giải phóng Texture Bitmap khỏi VRAM GPU nếu là ảnh thumbnail đã xem qua
              if (
                target.tagName === 'IMG' &&
                target.src &&
                !target.src.startsWith('data:') &&
                !target.dataset.ctEvictedSrc
              ) {
                target.dataset.ctEvictedSrc = target.src;
                if (target.srcset) {
                  target.dataset.ctEvictedSrcset = target.srcset;
                  target.removeAttribute('srcset');
                }
                target.src = BLANK_PIXEL;
              }
            }
          });
        },
        { rootMargin: '2000px 0px 2000px 0px' }
      );
    }

    // Đăng ký theo dõi các ảnh thumbnail trong feed, watch sidebar và comment
    const thumbnails = document.querySelectorAll(
      'ytd-rich-item-renderer yt-image img:not([data-ct-observed]), ytd-compact-video-renderer yt-image img:not([data-ct-observed]), ytd-comment-thread-renderer yt-img-shadow img:not([data-ct-observed])'
    );
    thumbnails.forEach((img) => {
      img.setAttribute('data-ct-observed', 'true');
      textureObserver.observe(img);
    });
  }

  // Dọn nút & dọn DOM & Shorts khi chuyển video trên YouTube SPA
  document.addEventListener('yt-navigate-finish', () => {
    cleanVideoActionButtons();
    cleanupDomMemory();
    disableAutoplayNextVideo();
    cleanShortsElements();
    manageShortsLoop();
    initTextureMemoryRecycler();
  });
  document.addEventListener('DOMContentLoaded', () => {
    cleanVideoActionButtons();
    cleanupDomMemory();
    disableAutoplayNextVideo();
    cleanShortsElements();
    manageShortsLoop();
    initTextureMemoryRecycler();
  });

  // Lắng nghe scroll để dọn sạch ngay khi cuộn reel hoặc feed
  window.addEventListener(
    'scroll',
    () => {
      if (window.location.pathname.startsWith('/shorts/')) {
        scheduleCleanTasks();
      } else if (settings.masterEnabled && settings.engineZeroFatigue !== false) {
        initTextureMemoryRecycler();
      }
    },
    { passive: true }
  );

  // Quét nhanh liên tục mỗi 250ms khi đang ở trang Shorts để xóa rác tức thì
  setInterval(() => {
    if (window.location.pathname.startsWith('/shorts/')) {
      purgeRemixAndAfterShare();
      cleanShortsPlayButton();
      cleanShortsTitle();
    }
  }, 250);

  // Định kỳ mỗi 1s kiểm tra pop-up tạm dừng, loop & overlay của Shorts
  setInterval(() => {
    autoConfirmContinueWatching();
    manageShortsLoop();
    cleanShortsElements();
  }, 1000);

  // Định kỳ mỗi 60s dọn dẹp các node rác tích tụ khi xem video lâu
  setInterval(cleanupDomMemory, 60000);
})();
