/**
 * CleanTube+ - Settings
 */

var DEFAULT_SETTINGS = {
  masterEnabled: true,
  hideTopicChips: true,            // Ẩn thanh thẻ chủ đề ở trang chủ
  cleanDescription: true,          // Làm sạch mô tả video (Chi tiết video, Đặt câu hỏi, Bản chép lời, Thẻ gợi ý)
  hideScrollbar: true,             // Ẩn triệt để thanh cuộn (scrollbar) trên toàn bộ trang
  cleanProfileMenu: true,          // Làm sạch menu Profile (Tài khoản Google, Phím tắt, Trợ giúp, Phản hồi)
  disableHoverPreview: true,       // Tắt hiệu ứng nổi khung và nền màu khi rê chuột
  blockAnimatedThumbnails: true,   // Chặn tải ảnh động Thumbnail (tiết kiệm data WebP ngầm)
  disableAmbientMode: true,        // Tắt Ambient Mode (ánh sáng hắt xung quanh player, giảm tải GPU)
  hideEndscreenCards: true,        // Ẩn Thẻ màn hình kết thúc che video (20 giây cuối)
  disableShimmer: true,            // Tắt hoạt họa Skeleton / Shimmer khi cuộn trang
  hideMerchAndPromo: true,         // Ẩn Kệ bán hàng & Banner quảng cáo Premium
  cleanActionButtons: true,        // Xóa nút Ask AI (Đặt câu hỏi) & Tải xuống (Download) dưới video
  blockTelemetry: true,            // Chặn bão Telemetry & Ping đo lường ngầm (QoE, log_event)
  optimizeGpuLayers: true,         // Giải phóng VRAM / GPU Compositing Layers (Tắt blur, content-visibility)
  preventDomLeak: true,            // Chặn phình to bộ nhớ DOM khi lướt lâu
  blockAv1Codec: true,             // Chặn ép nạp codec AV1, ưu tiên giải mã phần cứng VP9/H.264
  autoConfirmPaused: true,         // Chặn pop-up "Video đã tạm dừng. Bạn vẫn đang xem chứ?"
  disableAutoplayNext: true,       // Tắt tự động đếm ngược phát video tiếp theo
  cleanShorts: true,               // Dọn sạch rác Shorts & mở khóa phím tắt, tua thời gian, chỉnh tốc độ
  engineZeroFatigue: true,         // Engine Zero-Fatigue: Tự động thu hồi Texture VRAM & DOM ngoài màn hình
  trimSourceBuffer: true,          // SourceBuffer Trimmer: Cắt gọt buffer video trong RAM (Rolling Window)
  forceHiFiAudio: true             // Khóa cứng luồng Audio cao cấp nhất (256 kbps AAC / 160 kbps Opus Hi-Fi)
};

if (typeof self !== 'undefined') self.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
if (typeof window !== 'undefined') window.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
if (typeof module !== 'undefined' && module.exports) module.exports = { DEFAULT_SETTINGS };
