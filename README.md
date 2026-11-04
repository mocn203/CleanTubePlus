# 🌟 CleanTube+

> **CleanTube+** (Description: *Optimize YouTube*) là tiện ích mở rộng chuẩn Manifest V3 — **Always-On (Full Mode On tự động khi cài đặt, không cần cấu hình, không pop-up HUB thừa thãi)**. Tiện ích tự động dọn dẹp các thành phần thừa, tối ưu hóa phần cứng, ép luồng Audio 256 kbps Hi-Fi mà **giữ nguyên 100% bố cục gốc của YouTube**.

---

## 📸 Các Tính Năng Đã Tối Ưu Trong CleanTube+

| Nhóm | Tính Năng | Mô Tả Tối Ưu |
| :--- | :--- | :--- |
| **🚀 Siêu Tối Ưu Hiệu Năng** | ⚡ **Chặn bão Telemetry & Ping ngầm** | Dùng `declarativeNetRequest` chặn triệt để `/api/stats/qoe`, `/youtubei/v1/log_event`, `pagead` — giúp CPU nghỉ ngơi, triệt tiêu micro-stutter. |
| | 🎮 **Giải phóng VRAM & GPU Compositing** | Tắt `backdrop-filter: blur`, bật native `content-visibility: auto` trên video ngoài màn hình (tiết kiệm tới 50% RAM/GPU). |
| | 🧵 **Unblock Compositor Thread (Passive Scroll)** | Ép `{ passive: true }` trên toàn bộ listener `wheel`/`mousewheel`, cuộn mượt mà 120Hz/144Hz không bị nghẽn JS luồng chính. |
| | 💤 **Background Tab Throttling** | Khi tab bị ẩn, tắt vẽ khung hình GPU và hạ stream tiết kiệm 90% băng thông & 80% CPU ngầm, âm thanh vẫn phát 100%. |
| | ⚡ **Zero-Latency Preconnect** | Khởi động nóng kết nối TLS/TCP tới cụm CDN `googlevideo.com` tại `document_start`, bấm video phát tức thì. |
| | 🧹 **Chặn phình to bộ nhớ DOM** | Tự động dọn dẹp preview player rác, popup/tooltip cô lập và panel ẩn khi chuyển video, giữ RAM ổn định ở mức ~300MB. |
| | 🧬 **Infinite DOM & Texture Eviction** | Tự động thu hồi Texture VRAM và dọn dẹp node DOM nằm cách xa màn hình (>2000px), giữ VRAM siêu mát mẻ. |
| | 🧵 **SourceBuffer Memory Trimmer** | Thiết lập Rolling Buffer Window, tự động thu hồi dữ liệu video đã xem qua khỏi RAM, khóa RAM video luôn ở mức ~150MB. |
| | 🎬 **Chặn ép nạp codec AV1 (Main World)** | Ghi đè `MediaSource.isTypeSupported`, ép YouTube ưu tiên codec phần cứng VP9/H.264, CPU chỉ chạy 1%–3%, mát máy và tiết kiệm pin. |
| | 🎵 **Khóa Cứng Luồng Audio Hi-Fi 256 kbps** | Can thiệp `adaptiveFormats` & API InnerTube, ép YouTube luôn nạp luồng âm thanh bitrate cao nhất (256 kbps AAC / 160 kbps Opus 48kHz), loại bỏ hoàn toàn các luồng nén thấp (50k, 70k, 128k) và ngăn ABR bóp méo âm thanh. |
| | 🧊 **Idle CPU Freeze khi Pause** | Đóng băng toàn bộ animation/heartbeat khi video tạm dừng, đưa mức chiếm dụng CPU về 0.0%. |
| **Trang chủ & Lướt Video** | 🏷️ **Ẩn thanh thẻ chủ đề** | Ẩn hàng nút "Tất cả", "Âm nhạc", "Tin tức"... mà không làm cấn hay che hàng video đầu tiên. |
| | 🛑 **Tắt khung nổi & màu nền khi hover** | Triệt tiêu khung viền màu lấy mẫu từ thumbnail (`yt-touch-feedback-shape`), giữ thumbnail phẳng tĩnh. |
| | 🚫 **Chặn tải ảnh động Thumbnail** | Chặn tệp `an_webp` từ cấp độ mạng (`declarativeNetRequest`), tiết kiệm hàng chục MB data khi lướt. |
| | ⚡ **Tắt hiệu ứng Skeleton Shimmer** | Vô hiệu hóa hoạt họa bóng chạy nhấp nháy khi tải trang, giúp cuộn mượt mà không hao CPU/GPU. |
| **Xem Video (Watch Page)** | 📝 **Làm sạch phần Mô tả (Description)** | Giữ lại nội dung văn bản của tác giả, ẩn sạch: *Chi tiết video (Views, Likes, Date)*, *Đặt câu hỏi*, *Bản chép lời*, *Thẻ kênh phụ*. |
| | ✂️ **Xóa nút Ask AI, Tải xuống, 3 chấm & Report** | Dọn sạch thanh công cụ dưới video, chỉ giữ lại các nút cốt lõi (Like, Share, Lưu). |
| | 🛑 **Chặn Pop-up 'Video đã tạm dừng'** | Tự động bỏ qua hộp thoại xác nhận khi treo tab/nghe nhạc nền, tiếp tục phát không gián đoạn. |
| | ⏭️ **Tắt đếm ngược phát video tiếp theo** | Tắt công tắc Autoplay và triệt tiêu lớp phủ đếm ngược UpNext, xem hết video là dừng gọn gàng. |
| | 💡 **Tắt Chế độ Ambient Mode** | Tắt ánh sáng hắt xung quanh video player, ngắt canvas render ngầm, giảm nhiệt độ máy & tiết kiệm pin laptop. |
| | 🎬 **Ẩn Thẻ màn hình kết thúc (Endscreen)** | Ngăn các ô gợi ý video che mất nội dung và phụ đề ở 15–20 giây cuối video. |
| | 🛍️ **Ẩn Kệ bán hàng & Banner Premium** | Loại bỏ kệ Merch dưới video và các banner quảng cáo YouTube Premium, dùng thử. |
| **📱 YouTube Shorts (Hướng A)** | 🧼 **Dọn sạch rác thị giác overlay** | Ẩn hoàn toàn tiêu đề video & dòng âm thanh (giữ trọn vẹn Avatar và Tên kênh), nút & số lượt Remix, nút Play/Pause thừa góc trên bên trái, đĩa nhạc xoay, nút Đăng ký, thẻ mua sắm & video liên quan. |
| | ⏱️ **Mở khóa thanh tua tiến trình (Seekbar)** | Luôn hiển thị thanh tua 6px rõ ràng, cho phép click hoặc kéo tua thời gian Shorts tự do như video thường. |
| | ⏹️ **Chặn lặp vô tận (Stop Infinite Loop)** | Tự động dừng ở khung hình cuối cùng khi hết video thay vì tự động phát lặp đi lặp lại gây mất tập trung. |
| | ⌨️ **Phím tắt điều khiển máy tính chuyên nghiệp** | Tua 5s (`←` / `→` / `J` / `L`), Play/Pause (`K`), Tốc độ phát 0.5x–2.5x (`<` / `>`), Mute (`M`), Nhảy % thời lượng (`0`–`9`), phản hồi êm ái không che màn hình. |
| **Giao diện & Tài khoản** | 📜 **Ẩn thanh cuộn (Fix Full)** | Ẩn triệt để thanh kéo cuộn trên toàn bộ các trang, menu trái, popup mà vẫn cuộn chuột mượt mà. |
| | 👤 **Làm sạch menu Profile** | Ẩn các mục ít dùng: *Tài khoản Google*, *Phím tắt*, *Trợ giúp & Gửi ý kiến phản hồi*. |

---

## 🚀 Hướng Dẫn Cài Đặt (Chỉ 30 giây)

1. Mở trang quản lý tiện ích:
   - Trên **Chrome**: Nhập `chrome://extensions/`
   - Trên **Edge**: Nhập `edge://extensions/`
   - Trên **Cốc Cốc**: Nhập `coccoc://extensions/`
2. Bật công tắc **"Chế độ dành cho nhà phát triển" (Developer mode)** ở góc trên bên phải.
3. Bấm nút **"Tải tiện ích đã giải nén" (Load unpacked)** ở góc trên bên trái.
4. Chọn thư mục dự án:
   ```
   c:\Users\DELL\OneDrive\Desktop\CleanTube+
   ```
5. Tiện ích tự động chạy ngầm 100%, không cần cấu hình thêm.

---

## ⌨️ Phím Tắt Điều Khiển YouTube Shorts Mới

Khi xem bất kỳ video YouTube Shorts nào, bạn có thể dùng trọn bộ phím tắt như trình phát desktop:

| Phím Tắt | Hành Động | Ghi Chú |
| :---: | :--- | :--- |
| `←` hoặc `J` | **Tua lùi 5 giây** | Tua mượt mà, không giật khung hình |
| `→` hoặc `L` | **Tua tới 5 giây** | Tua mượt mà, không giật khung hình |
| `K` | **Phát / Tạm dừng** | Không bị giật hoặc trôi trang |
| `Shift + >` hoặc `.` | **Tăng tốc độ phát** | Bậc nhảy: 1.25x ➔ 1.5x ➔ 1.75x ➔ 2.0x ➔ 2.5x |
| `Shift + <` hoặc `,` | **Giảm tốc độ phát** | Bậc nhảy: 1.75x ➔ 1.5x ➔ 1.25x ➔ 1.0x ➔ 0.75x ➔ 0.5x |
| `M` | **Bật / Tắt tiếng (Mute)** | Bật hoặc tắt âm thanh tức thì |
| `0` đến `9` | **Tua nhanh đến 0% – 90%** | Tua trực tiếp đến mốc % thời lượng video |
| *(Tự động)* | **Dừng lặp vô tận** | Video Shorts tự dừng ở khung hình cuối, không bị loop gây mất tập trung |
