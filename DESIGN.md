# Light Human Design Language

> Website của Light Human (headhunting + tuyển dụng số lượng lớn) cho chủ doanh nghiệp và trưởng phòng nhân sự tại Việt Nam.
> **Nguồn chân lý giao diện:** bản mẫu tĩnh đã duyệt ở `E:\ClaudeMD\website\LightHuman` (xem `DESIGN.md`, `README.md` trong đó). Site Next.js port nguyên CSS của mẫu vào `src/styles/mk/` (layer `mk`) và dựng lại markup của mẫu bằng component React.

## 1. Visual Theme

**Theme statement:** điềm tĩnh, tự tin, điện ảnh — "Ánh sáng".

**Character:** Light Human = Ánh Sáng. Navy là nền; vàng logo chỉ xuất hiện như nguồn sáng: chữ được "chiếu sáng" khi cuộn tới, quầng sáng theo con trỏ trên khối tối, ảnh lộ ra như được rọi đèn, gạch chân vàng chạy dưới link. Không rải vàng làm nền trang trí (ngoại lệ: một dải CTA vàng cuối trang).

**References:** quiet-luxury đẩy sang agency; editorial; hero full-bleed.

---

## 2. Color Palette (60 / 30 / 10)

| Token | Value | Usage |
| --- | --- | --- |
| `--navy-950` | #0a1430 | Nền tối sâu nhất (logo band, footer) |
| `--navy-900` | #0d1a3d | Nền tối chính (manifesto, quy trình, header khi đặc) |
| `--navy-800` | #14285a | Navy logo, chữ đậm trên nền sáng |
| `--navy-600` | #1f3576 | Link trong bài viết |
| `--mist` | #e7ebf3 | Nền tint lạnh (toolkit), hover menu |
| `--paper` | #f7f5ef | Nền sáng chính, hơi ấm |
| `--cream` | #fbf3d8 | Nền sáng nhấn (case, stats) |
| `--ink` | #101a33 | Chữ chính |
| `--muted` | #4c5672 | Chữ phụ trên nền sáng |
| `--muted-on-dark` | #a9b3cc | Chữ phụ trên nền tối |
| `--gold` | #f2cf63 | Vàng logo: nguồn sáng, CTA chính trên nền tối |
| `--amber` / `--amber-deep` | #dca54b / #b88436 | Vàng đậm; chữ vàng trên nền sáng chỉ ≥ 18px đậm |
| `--line` / `--line-dark` | rgba(20,40,90,.12) / rgba(231,235,243,.12) | Hairline |

Mỗi section chọn một tông bằng class `.tone-paper | .tone-cream | .tone-mist | .tone-navy | .tone-deep | .tone-gold`; thành phần bên trong đọc `--fg`, `--fg-2`, `--rule`, `--accent`.
Tailwind có token cùng giá trị (`navy-*`, `paper`, `cream`, `mist`, `gold*`, `ink*`) cho code mới viết bằng utility.

---

## 3. Typography

- Display + body: **Archivo** (trục `wdth`), tải bằng `next/font` (`--font-archivo`). Tiêu đề dùng bản rộng `font-stretch: 108–125%`, đậm 650–800, `letter-spacing` âm. Nhấn bằng *nghiêng* cùng font (màu `--accent`).
- Số, nhãn: **JetBrains Mono** 400–500 (`--font-jetbrains-mono`), chữ hoa giãn cho kicker/eyebrow.
- Thang: `.h1` clamp(2.5rem, 6.2vw, 5.9rem) · `.h2` clamp(2rem, 4.4vw, 3.9rem) · `.h3` clamp(1.3rem, 1.9vw, 1.7rem) · `.display` clamp(2.4rem, 6vw, 5.4rem) · body 1.0625rem / 1.62.
- Từ 1025px: `html { font-size: 90% }`; hero và header giữ cỡ đã duyệt bằng `zoom: .8889` (`--hz`).
- Archivo bản rộng vẽ "&" rất lạ: nội dung hiển thị đổi " & " thành " và " (`fixCopy` trong `src/lib/mk.ts`).

---

## 4. Components (đã port, `src/components/mk/`)

| Mẫu (`tools/build.js`) | React | Ghi chú |
| --- | --- | --- |
| `ico()` | `Ico` | Phosphor Light, `src/content/mk/icons.json` |
| `img()` | `MkImg` | CMS URL → `/img/...` (webp cục bộ) qua `img-map.json`, kích thước thật từ `img-dims.json` |
| `btn()` / `.link-line` | `Btn`, `LinkLine` | Nút bo tròn, mũi tên trong vòng tròn riêng (`.btn-ico`) |
| `head()` | `SecHead` | eyebrow + h2 (chữ trồi lên) + lede |
| `ctaBand()` / `quoteCta()` | `CtaBand`, `QuoteCta` | Dải vàng cuối mọi trang |
| header / footer / rail partials | `layout/Header`, `layout/Footer`, `mk/Overlays` | Header trong suốt trên hero ảnh, đặc navy-900 khi qua hero; thanh liên hệ nổi; panel nhận bài; hộp video |
| trang chủ | `mk/home/HomeSections` | hero + số liệu quay quanh ảnh, logo band, manifesto, dải dịch vụ co giãn, quy trình ngang, sân khấu khách hàng, nhiều lớp, lợi thế, testimonials, toolkit, Góc nhìn |

---

## 5. Layout

- `.wrap`: max 82.5rem + gutter clamp(1.25rem, 4vw, 3rem). `.wrap-narrow`: 47.5rem.
- `main > section { padding-block: var(--sec-y) }` với `--sec-y` clamp(5.5rem, 11vw, 10.5rem) — trang trả section trực tiếp dưới `<main>`.
- Header cao 4.75rem (`--header-h`), cố định.
- Mỗi kiểu bố cục chỉ một lần mỗi trang; nền xen kẽ: ảnh, navy-950, navy-900, paper, navy-900, paper, …, mist, paper, gold.

---

## 6. Depth

- Bo góc: nút/chip 999px; card 1.5rem (`--r-card`); ảnh 1.25rem; input 0.875rem. Khối full-bleed không bo.
- Bóng: chỉ bóng navy rất nhạt `--shadow: 0 1.875rem 3.75rem -2.25rem rgba(13,26,61,.45)`; không bóng đen.
- Card quan trọng dùng vỏ kép (`.shell > .core`).
- Lớp: header 40, page-wipe 90, video/notify trên cùng.

---

## 7. Do's and Don'ts

### Do

- Dựng đúng markup + class của mẫu; CSS đã có sẵn ở layer `mk`.
- Tiêu đề có hiệu ứng (`data-lines`, `data-split`) phải render tách từ sẵn bằng `<Rich split />` và gắn `data-split-done="1"`.
- Dùng data-attribute của mẫu cho hành vi (`data-tabs`, `data-acc`, `data-filter-*`, `data-count`, `data-clip-reveal`, `data-magnetic`, `data-video-open`, …); `Runtime` lo phần còn lại.
- Copy nằm trong `src/content/*.ts`; `fixCopy` áp các chỉnh sửa copy của mẫu.
- Ảnh: ưu tiên bản webp cục bộ trong `public/img`.

### Don't

- Không rải vàng làm nền trang trí; không bóng đen; không thêm font khác.
- Không bịa số liệu case study, bảng giá, năm thành lập; giữ `TODO(BA)`.
- Không sửa lời khách hàng hay thân bài viết bằng `fixCopy`.
- Không dùng `.prose` của Tailwind cho bài viết của mẫu (dùng `.mk-prose`).
- Không nghe `scroll` trực tiếp cho hiệu ứng mới; dùng IntersectionObserver / ScrollTrigger như Runtime.

---

## 8. Responsive

- ≤ 760px: dải dịch vụ thành thẻ xếp dọc; số liệu hero thành lưới 2×2; testimonials 1 hàng; quy trình thành đường dọc dưới 1025px.
- ≤ 1024px: menu burger toàn màn navy-950; nav panel ẩn.
- Từ 1025px: `html` 90%, hero/header `zoom`.
- `prefers-reduced-motion`: tắt GSAP, parallax, marquee, quầng sáng con trỏ, page-wipe; nội dung hiện ở trạng thái cuối.

---

## 9. Agent Prompt Guide

- So mọi thay đổi giao diện với bản mẫu (`python -m http.server` trong thư mục mẫu, hoặc file HTML đã build ở gốc thư mục mẫu).
- Đừng viết lại CSS của mẫu bằng Tailwind; thêm rule nhỏ vào cuối `src/styles/mk/*.css` khi thật cần.
- `Runtime.tsx` chạy lại mỗi lần đổi route và tự dọn dẹp; đừng thêm listener toàn cục ở nơi khác.
- Màu: chỉ các token ở mục 2.

## 10. Motion

| Hiệu ứng | Nơi |
| --- | --- |
| Ảnh hero zoom chậm, tiêu đề trồi từng từ, hero trôi khi cuộn | `[data-hero]` (GSAP) |
| Tiêu đề section trồi lên khi tới | `[data-split]` |
| Manifesto sáng dần từng từ theo thanh cuộn | `[data-scrub-words]` |
| Đường vàng quy trình dài ra; bước sáng lên | `[data-tl]`, `.tl-row.is-lit` |
| Nhóm thẻ trồi lần lượt | danh sách selector trong `Runtime` |
| Parallax nhiều lớp | `[data-speed]` (tắt < 768px) |
| Thanh tiến độ cuộn 3px vàng | `.sx-progress` |
| Quầng sáng theo con trỏ, nút hút, ảnh theo con trỏ | chỉ chuột |
| Chuyển trang: lớp navy kéo lên < 400ms | `.page-wipe` |
| Easing | `--ease-spring` cubic-bezier(.32,.72,0,1); `--ease-out` cubic-bezier(.16,1,.3,1) |

## 11. Voice & Tone

Tiếng Việt, xưng "chúng tôi", câu ngắn, cụ thể bằng số. Tránh "giải pháp toàn diện", "đồng hành cùng doanh nghiệp", "hàng đầu" (trừ khi trích nguyên văn có nguồn). Lời khách giữ nguyên văn.
