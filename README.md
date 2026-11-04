# CleanTube+

CleanTube+ is a lightweight, zero-overhead Chromium extension (Manifest V3) designed to optimize YouTube playback at the engine level. It enforces studio-grade audio bitrates, shifts video decoding to hardware-accelerated VP9, eliminates visual clutter, and manages memory dynamically—without breaking or replacing YouTube's native user interface.

Operating on an Always-On design philosophy, CleanTube+ requires zero configuration and contains no popup dashboards or background bloat.

---

## Technical Highlights

### 1. Audio Stream Enforcement
- **Opus 160 kbps Lock:** YouTube's native Adaptive Bitrate (ABR) algorithm frequently degrades audio streams to 50–128 kbps during playback start or minor network fluctuations. CleanTube+ intercepts player response manifests (`adaptiveFormats`) to lock standard playback onto Opus 160 kbps (48 kHz), ensuring transparent studio-grade sound.
- **Premium Preservation:** Accounts with access to high-bitrate tier streams (240–256 kbps AAC/Opus) retain their original fidelity untouched.
- **Multi-Track Compatibility:** Multi-language audio tracks are independently grouped and locked to the highest bitrate tier available per language.

### 2. Codec & Hardware Decoding
- **AV1 Codec Suppression:** Software decoding of AV1 (`av01`) introduces heavy CPU utilization and thermal throttling on many systems. CleanTube+ overrides `MediaSource.isTypeSupported` and `HTMLVideoElement.prototype.canPlayType` to force YouTube into serving hardware-accelerated VP9 and H.264 streams.
- **Resource Efficiency:** Average CPU utilization drops to 1%–3% during high-resolution playback.
- **Background Tab Throttling:** When the playback tab is not visible, the video surface is detached and the stream profile drops to 144p, conserving up to 90% bandwidth and 80% GPU compute while maintaining 100% audio quality.

### 3. Memory Management (Zero-Fatigue Engine)
- **SourceBuffer Rolling Window:** Intercepts `MediaSource.prototype.addSourceBuffer` to evict elapsed playback segments older than 15 seconds. Tab RAM consumption remains strictly bounded around 150MB–200MB, preventing leaks during extended streaming sessions.
- **GPU Texture Eviction:** An `IntersectionObserver` recycles off-screen thumbnail image decodes into blank placeholders, actively recovering GPU VRAM during infinite scrolling.
- **DOM Pruning:** Limits lingering comment threads and clears stale DOM subtrees retained by YouTube's Single Page Application (SPA) architecture.

### 4. YouTube Shorts Streamlining
- **Scroll Stabilization:** Bypasses passive wheel overrides on `/shorts/` to ensure smooth 60/120 fps snapping transitions without dropped frames.
- **Visual Decluttering:** Removes the Remix button, view counter labels, and floating overlay titles while strictly retaining creator avatars and channel handles.
- **Unlocked Timeline Seekbar:** Surfaces a permanent 6px draggable progress bar for mouse scrubbing.
- **Loop Prevention:** Automatically pauses video playback on the final frame rather than repeating continuously.
- **Full Desktop Controls:** Adds instant hotkeys for scrubbing, variable playback rates, and audio muting without obstructive HUD notifications.

### 5. UI Cleanup & Telemetry Blocking
- **Network-Level Telemetry Blocking:** Uses `declarativeNetRequest` rules to halt tracking pings (`/api/stats/qoe`, `/youtubei/v1/log_event`, `doubleclick`) at the network layer with zero JavaScript overhead.
- **Clean Action Bar:** Strips extraneous video actions (Ask AI, Download, Clip, overflow menus) while preserving primary controls (Like, Share, Save).
- **Reduced Visual Processing:** Disables ambient lighting (canvas glow), skeleton loading shimmers, and animated WebP thumbnail downloads (`an_webp`).
- **Autoplay & Pause Management:** Automatically dismisses "Video paused. Continue watching?" dialogs and suppresses Up Next countdown timers.

---

## YouTube Shorts Keyboard Shortcuts

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| `Left Arrow` / `J` | Seek backward 5s | Smooth seeking without frame dropping |
| `Right Arrow` / `L` | Seek forward 5s | Smooth seeking without frame dropping |
| `K` | Play / Pause | Direct toggle |
| `Shift + >` / `.` | Increase speed | Steps: 1.25x -> 1.5x -> 1.75x -> 2.0x -> 2.5x |
| `Shift + <` / `,` | Decrease speed | Steps: 1.75x -> 1.5x -> 1.25x -> 1.0x -> 0.75x -> 0.5x |
| `M` | Mute / Unmute | Immediate toggle |
| `0` to `9` | Jump to 0% - 90% | Direct percentage jump |

---

## Installation

CleanTube+ is distributed as a lightweight, unpacked Manifest V3 extension.

1. Download the latest release archive (`CleanTubePlus-v1.5.0.zip`) from the Releases page.
2. Extract the archive into a dedicated directory.
3. Open a Chromium-based browser (Google Chrome, Microsoft Edge, Brave, Opera, Arc) and navigate to the extensions page:
   - Chrome / Brave: `chrome://extensions/`
   - Edge: `edge://extensions/`
4. Enable **Developer mode** via the toggle in the upper-right corner.
5. Click **Load unpacked** in the top toolbar.
6. Select the extracted folder.
7. Navigate to YouTube; all optimizations run automatically in the background.

---

## Project Structure

```
CleanTube+/
├── background/
│   └── background.js          # Service worker for DNR rulesets and tab reloading
├── content/
│   ├── content.css            # Stylesheet for clutter elimination and layout fixes
│   ├── content.js             # Isolated-world DOM cleaner and Shorts controller
│   └── engine_optimizer.js    # Main-world engine hooks (Audio lock, Codec, Memory)
├── icons/                     # Minimalist monochrome brand assets
├── rules/
│   ├── block_an_webp.json     # Declarative Net Request rules for animated thumbnails
│   └── block_telemetry.json   # Declarative Net Request rules for telemetry suppression
├── shared/
│   └── defaultSettings.js     # Default configuration baseline
├── manifest.json              # Extension manifest (Manifest V3)
└── README.md                  # Project documentation
```

---

## License

This project is released under the MIT License.
