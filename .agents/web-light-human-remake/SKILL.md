---
name: web-light-human-remake
description: Toàn bộ đặc tả thiết kế, design tokens, component specs và hướng dẫn remake website Light Human sang Next.js App Router + Tailwind CSS + shadcn/ui.
---

# Skill: Light Human UI Architecture & Next.js Remake Guide

Bộ kỹ năng này chứa toàn bộ bản thiết kế hệ thống (Design System), tokens, cấu trúc trang, tương tác và mã mẫu component để remake toàn bộ website **Light Human** (công ty tư vấn nhân sự, headhunting và giải pháp nhân lực cao cấp) sang stack **Next.js 14+ (App Router) + Tailwind CSS v3/v4 + shadcn/ui + Framer Motion + Lucide/Phosphor Icons**.

---

## 1. Hệ thống Design Tokens & Theme Configuration

### 1.1. Bảng màu thương hiệu (Brand Palette)

Thiết kế kết hợp giữa **Deep Navy** (uy quyền, chuyên nghiệp) và **Paper/Ivory & Cream** (ấm áp, nhân bản), điểm xuyết bởi **Royal Amber / Gold** (tinh tế, giá trị cao).

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1360px",
      },
    },
    extend: {
      colors: {
        // Deep Navy Spectrum
        navy: {
          950: "#060c1d", // Nền tối sâu nhất (Hero, Footer)
          900: "#0b1533", // Nền Dark Card, Topbar, Subnav active
          800: "#132148", // Border tối, Card container hover
          700: "#1c2e63",
          600: "#274187", // Primary brand accent (Cool)
          500: "#3859b3",
        },
        // Warm Paper & Neutral Backgrounds
        paper: {
          DEFAULT: "#f7f5ef", // Nền giấy sáng chủ đạo (Light section)
          pure: "#ffffff",
          card: "#ffffff",
          muted: "#edf1f7",
        },
        cream: {
          DEFAULT: "#f5f3ec", // Nền ấm cho section Khác biệt & Lợi thế
          50: "#faf8f2",
          100: "#f5f3ec",
          200: "#ebe7dc",
        },
        // Amber Gold Accent Spectrum
        gold: {
          DEFAULT: "#f2cf63", // Vàng sáng (Icon badge, dark highlight)
          hover: "#e5be4e",
          amber: "#d4a017", // Vàng hổ phách chuẩn
          deep: "#b8860b",  // Điểm nhấn chữ <em>, badge viền nổi
          soft: "rgba(242, 207, 99, 0.18)",
        },
        // Typography Colors
        ink: {
          DEFAULT: "#0f172a", // Chữ chính trên nền sáng
          muted: "#475569",   // Chữ phụ (slate-600)
          subtle: "#64748b",  // Kicker, breadcrumb
          onDark: "#f4f6fb",  // Chữ chính trên nền tối
          mutedDark: "#94a3b8", // Chữ phụ trên nền tối
        },
        // Hairline Rules & Borders
        line: {
          light: "rgba(20, 40, 90, 0.14)", // Viền card chuẩn nền sáng
          dark: "rgba(231, 235, 243, 0.12)", // Viền card chuẩn nền tối
          gold: "rgba(212, 160, 23, 0.4)",  // Viền nhấn vàng
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Archivo", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Archivo", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "1.5rem",
        inner: "1.125rem",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 6px 20px -4px rgba(20, 40, 90, 0.08)",
        cardHover: "0 16px 36px -8px rgba(20, 40, 90, 0.14)",
        warm: "0 12px 30px -8px rgba(212, 160, 23, 0.2)",
        darkGlow: "0 16px 40px -12px rgba(0, 0, 0, 0.7)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
```

---

## 2. Danh mục Component Chuẩn & Đặc Tả Kỹ Thuật

### 2.1. Header & Mega Menu Dropdown

- **Đặc điểm:**
  - Sticky glass header (`sticky top-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-white/10`).
  - Brand Logo với tỷ lệ chiều cao đồng bộ `h-10 md:h-11`.
  - Dropdown dịch vụ dùng `<NavigationMenu>` của shadcn/ui kết hợp popover pointer arrow notch (`before:absolute before:-top-2 before:left-12 before:w-4 before:h-4 before:bg-navy-900 before:rotate-45 before:border-l before:border-t before:border-white/15`).
  - Active Indicator Pill (`rounded-full bg-gold/15 text-gold border border-gold/30 px-3 py-1`).
  - Nút CTA góc phải: "Nhận báo giá" (`bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-navy-950 font-semibold px-5 py-2.5 rounded-full shadow-md`).

### 2.2. Hero Section (2 Variants)

#### Variant A: HeroPhoto (`hero-page.tsx`)
Dùng cho: `index.html` (Hero chính), `dich-vu.html`, `case-studies.html`, `tin-tuc.html`, `gioi-thieu.html`.
- **Cấu trúc:**
  - Lớp nền ảnh: `next/image` với `fill priority sizes="100vw"` + object-cover.
  - Lớp Vignette Gradient Scrim: `bg-gradient-to-t from-navy-950 via-navy-950/75 to-navy-950/40`.
  - Điểm sáng radial trung tâm: `bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent`.
  - Kicker Pill (`uppercase font-mono tracking-wider text-xs text-gold border border-gold/30 bg-navy-900/60 rounded-full px-3.5 py-1`).
  - Headline `<h1>`: `font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white` kèm thẻ `<em>` màu `text-gold italic font-normal`.
  - Lede text: `text-slate-300 text-lg md:text-xl max-w-2xl font-normal leading-relaxed`.
  - Actions Row: Primary Button (Vàng) + Secondary Button (Ghost viền mờ hoặc Video Modal Trigger Button với icon Play).

#### Variant B: HeroText (`hero-text.tsx`)
Dùng cho các trang tra cứu công cụ hoặc bài viết con cần tập trung chữ.

---

### 2.3. Horizontal Alternating Timeline: "Làm như thế nào" (`steps-horizontal.tsx`)

Section 6 bước cốt lõi từ số 01 đến 06 với số so le trên/dưới độc đáo:
- **Nguyên lý Layout:**
  - Grid 6 cột trên Desktop (`lg:grid-cols-6`), kết nối bằng một đường kẻ ngang trung tâm `border-t-2 border-line-light relative`.
  - Nốt tròn (Pips): Điểm nối vàng tròn `w-3 h-3 rounded-full bg-gold ring-4 ring-navy-950 absolute top-1/2 -translate-y-1/2`.
  - Số hiển thị (`01` đến `06`): `font-display font-extrabold text-5xl md:text-6xl text-transparent stroke-gold [-webkit-text-stroke:1.5px_#f2cf63]`.
  - **So le nhịp điệu (Alternating Rhythm):**
    - Bước lẻ (01, 03, 05): Số nằm phía trên đường kẻ, icon + nội dung nằm phía dưới.
    - Bước chẵn (02, 04, 06): Số nằm phía dưới đường kẻ, icon + nội dung nằm phía trên (hoặc so le padding `pt-8` vs `pb-8`).
  - Trên Mobile (`< 768px`): Chuyển mượt về vertical timeline với thanh ray đứng bám mép trái (`border-l-2 border-gold/40 pl-6 space-y-8`).

---

### 2.4. Quy trình vận hành đa tầng: "Mỗi lần tuyển có nhiều lớp phía sau" (`sx-parallax.tsx`)

Section nền sáng thanh lịch (`bg-gradient-to-b from-[#eef3fa] to-paper py-24 md:py-32 relative overflow-hidden`).
- **4 Thẻ Đối Nghịch (Contrasting Layer Cards):**
  - **Lớp lẻ (01, 03) - Cool Pure White:**
    - Bo góc phi đối xứng: `rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-md rounded-bl-md`.
    - Nền: `bg-white border-1.5 border-navy-950/15 shadow-card hover:shadow-cardHover`.
    - Badge: `bg-navy-950/5 text-navy-800 border border-navy-950/10 font-mono text-xs uppercase px-2.5 py-1 rounded-full`.
    - Tiêu đề: `text-navy-950 font-display font-bold text-xl`.
    - Mô tả: `text-slate-600 text-sm leading-relaxed`.
    - Chân thẻ: `border-t border-navy-950/10 pt-4 font-mono text-xs text-navy-700 tracking-wider uppercase`.
  - **Lớp chẵn (02, 04) - Warm Amber Gold:**
    - Bo góc đối nghịch: `rounded-tr-[2rem] rounded-bl-[2rem] rounded-tl-md rounded-br-md`.
    - Độ lệch nhịp: `lg:mt-8` tạo bước so le động lực học.
    - Nền: `bg-gradient-to-br from-white via-[#fffdf4] to-[#fff8e8] border-1.5 border-amber-500/40 shadow-warm hover:border-amber-500`.
    - Badge: `bg-amber-400/20 text-amber-800 border border-amber-400/40 font-mono text-xs font-semibold px-2.5 py-1 rounded-full`.
    - Chân thẻ: `border-t border-amber-500/20 pt-4 font-mono text-xs text-amber-800 font-semibold uppercase`.

---

### 2.5. Lợi thế doanh nghiệp: "Vì sao chọn Light Human" (`sx-features.tsx`)

Section nền kem ấm áp (`bg-gradient-to-b from-paper to-cream py-24 md:py-32`).
- **6 Thẻ Lợi Thế (Features Cards Grid `grid md:grid-cols-2 lg:grid-cols-3 gap-8`):**
  - Thẻ `bg-white rounded-2xl p-8 border-1.5 border-navy-950/12 shadow-card hover:shadow-cardHover relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group`.
  - Đường line kim loại vàng phản chiếu trên đỉnh thẻ: `before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-amber-400 before:to-transparent before:opacity-60 group-hover:before:opacity-100`.
  - Icon container: `w-12 h-12 rounded-xl bg-amber-400/20 text-amber-700 border border-amber-400/30 flex items-center justify-center group-hover:scale-105 transition-transform`.
  - Số thứ tự: `font-display font-bold text-xl text-amber-700`.
  - Tiêu đề: `text-navy-950 font-display font-bold text-lg mt-4`.
  - Nội dung: `text-slate-600 text-sm leading-relaxed mt-2`.
  - Link dịch vụ chân thẻ: `mt-auto pt-5 border-t border-navy-950/10 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-navy-900 group-hover:text-amber-700 transition-colors`.

---

### 2.6. Trình tạo báo giá tương tác: "Kéo thả / Chọn thẻ vào tờ báo giá" (`quote-generator.tsx`)

Section gồm 2 cột:
1. **Bảng Chọn Thẻ Yêu Cầu (Left Panel / Selector):**
   - Bộ lọc tab: Vị trí, Chuyên ngành (16 ngành nghề), Kinh nghiệm, Khu vực (Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ...), Bằng cấp.
   - Thẻ Chip chọn (`<Badge variant="outline">`): Khi bấm kích hoạt hiệu ứng active vàng/navy kèm âm thanh haptic micro-feedback.
2. **Tờ Báo Giá Trực Quan (Right Panel / Realistic Paper Sheet):**
   - Thiết kế mô phỏng tờ văn bản A4 đặt trên bàn làm việc:
     - Nền: `bg-white rounded-lg shadow-2xl p-8 border border-slate-200 relative`.
     - Miếng băng dính dán đỉnh giấy: `absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-200/80 -rotate-1 rounded-sm shadow-sm`.
     - Header văn bản: Logo Light Human + "BÁO GIÁ TUYỂN DỤNG" + Mã số tự sinh `LH-BG-xxxxxx` + Ngày giờ thực.
     - Bảng danh mục chi tiết các điều kiện đã chọn.
     - Ô ghi chú SLA cam kết (3 ngày gửi CV, bảo hành 60 ngày).
     - Nút tải PDF (`jsPDF`) và gửi email trực tiếp cho bộ phận Business Development.
3. **Bản đồ văn phòng toàn trang (Full-Width Map):**
   - Nằm ngay dưới tờ báo giá, hiển thị bản đồ Google Maps tương tác 213 Chu Văn An, Bình Thạnh, TP.HCM với nút "Mở trong Maps" viền pill cao cấp.

---

### 2.7. Toolkit Bento Hub: Công cụ tính lương & thuế (`toolkit-bento.tsx`)

- **Thẻ Lớn: Tính lương Gross sang Net (`bento-salary` `col-span-12 lg:col-span-7`):**
  - Input số tiền Gross định dạng dấu chấm ngăn cách ngàn (`30.000.000 VNĐ`).
  - Stepper điều chỉnh số người phụ thuộc `(- / +)`.
  - Live calculation hiển thị ngay kết quả Net lớn nổi bật `text-4xl lg:text-5xl font-extrabold text-amber-500` kèm bảng khấu trừ BHXH (8%), BHYT (1.5%), BHTN (1%) và Thuế TNCN chi tiết.
- **Thẻ Nhỏ: Lãi kép (`bento-compound`):**
  - Tích hợp biểu đồ vector SVG Sparkline trực quan.
- **Thẻ Nhỏ: Biểu thuế TNCN 2026 mới (`bento-tax`):**
  - Thẻ nền Navy tương phản `bg-navy-900 text-white` tóm tắt 5 bậc thuế mới.
- **Thẻ Nhỏ: Báo giá nhanh (`bento-quote`):**
  - Chuyển hướng nhanh sang trang tạo báo giá chi tiết.

---

### 2.8. Service Scope Bento (`scope-bento.tsx`)

Dùng trên các trang chi tiết dịch vụ (`/dich-vu/[slug]`):
- Grid 6 cột:
  - Thẻ 1 (`col-span-6 lg:col-span-3`): Nền Navy tối `bg-gradient-to-br from-navy-900 to-navy-950 text-white border-1.5 border-amber-400/45 shadow-lg`.
  - Thẻ 2 (`col-span-6 lg:col-span-3`): Nền trắng tinh `bg-white border-1.5 border-navy-950/16 shadow-card`.
  - Thẻ 3, 4, 5 (`col-span-6 lg:col-span-2`): Nền trắng `bg-white border-1.5 border-navy-950/16 shadow-card`.
- Mọi thẻ đều có icon amber gold, tiêu đề `h4` đậm nét và mô tả súc tích.

---

## 3. Cấu Trúc Dự Án Next.js Khuyến Nghị

```text
my-light-human-app/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx              # Root Layout: Header + Footer + ScrollProgressBar
│   │   ├── page.tsx                # Trang chủ (Homepage)
│   │   ├── gioi-thieu/page.tsx     # Trang Giới thiệu & Sứ mệnh
│   │   ├── cau-chuyen/page.tsx     # Trang Câu chuyện thành lập & Timeline
│   │   ├── dich-vu/
│   │   │   ├── page.tsx            # Danh mục 6 dịch vụ
│   │   │   └── [slug]/page.tsx     # Chi tiết dịch vụ (Scope, Timeline, FAQ)
│   │   ├── du-an/
│   │   │   ├── page.tsx            # Case studies tổng hợp
│   │   │   └── [slug]/page.tsx     # Chi tiết dự án thực tế
│   │   ├── bao-gia/page.tsx        # Bàn tạo báo giá tương tác & Bản đồ
│   │   ├── cong-cu/
│   │   │   ├── page.tsx            # Hub 3 công cụ
│   │   │   ├── tinh-luong-gross-net/page.tsx
│   │   │   ├── tinh-lai-kep/page.tsx
│   │   │   └── tinh-thue-thu-nhap-ca-nhan/page.tsx
│   │   ├── tin-tuc/
│   │   │   ├── page.tsx            # Góc nhìn nhân sự & Insights
│   │   │   └── [slug]/page.tsx     # Chi tiết bài viết Markdown/CMS
│   │   └── lien-he/page.tsx        # Trang Liên hệ & Form tư vấn
│   ├── globals.css                 # CSS Variables & Tailwind directives
│   └── layout.tsx
├── components/
│   ├── ui/                         # shadcn/ui components (button, badge, dialog...)
│   ├── layout/
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   └── scroll-progress.tsx
│   ├── sections/
│   │   ├── hero-photo.tsx
│   │   ├── hero-text.tsx
│   │   ├── steps-horizontal.tsx    # Làm như thế nào (01-06)
│   │   ├── sx-parallax.tsx         # Quy trình nhiều lớp (Cards đối nghịch)
│   │   ├── sx-features.tsx         # Vì sao chọn Light Human (6 thẻ)
│   │   ├── quote-generator.tsx     # Báo giá tương tác
│   │   ├── toolkit-bento.tsx       # Bento công cụ tính
│   │   ├── testimonials-marquee.tsx
│   │   └── scope-bento.tsx
│   └── calculators/
│       ├── gross-net-calculator.tsx
│       └── tax-calculator.tsx
├── lib/
│   ├── data/                       # Dữ liệu JSON dịch vụ, case study, bài viết
│   ├── utils.ts                    # cn helper, format tiền tệ VNĐ
│   └── tax-formulas.ts             # Thuật toán tính thuế TNCN 2026 & lương Gross-Net
└── tailwind.config.ts
```

---

## 4. Hướng Dẫn Thực Thi Quy Trình Remake Từng Bước

Khi người dùng hoặc agent bắt đầu quy trình chuyển đổi, thực hiện theo thứ tự chuẩn sau:

1. **Khởi tạo & Cài đặt Thư viện:**
   ```bash
   npx create-next-app@latest light-human-next --typescript --tailwind --eslint --app --src-dir=false
   cd light-human-next
   npx shadcn-ui@latest init
   npx shadcn-ui@latest add button badge card accordion tabs dialog popover navigation-menu separator tooltip
   npm install framer-motion lucide-react canvas-confetti jspdf
   npm install -D @types/canvas-confetti
   ```

2. **Cấu hình Design Tokens (`tailwind.config.ts` & `globals.css`):**
   - Nhập toàn bộ mã màu `navy`, `paper`, `cream`, `gold`, `ink`, `line` như mục 1.1 vào `tailwind.config.ts`.
   - Cài đặt font `Archivo` từ `next/font/google` cho tiêu đề và nội dung.

3. **Chuyển giao Data JSON:**
   - Copy toàn bộ nội dung từ các file `src/data/*.json` của dự án gốc (`services.json`, `cases.json`, `posts.json`, `tools.json`, `site.json`) vào thư mục `lib/data/`.

4. **Triển khai Component theo thứ tự ưu tiên:**
   - **Giai đoạn 1:** `SiteHeader` + `SiteFooter` + `HeroPhoto`.
   - **Giai đoạn 2:** `StepsHorizontal` (So le 01-06) + `SxParallax` (Quy trình đa tầng nền sáng) + `SxFeatures` (Lợi thế 6 card).
   - **Giai đoạn 3:** `QuoteGenerator` (Tờ giấy báo giá + chip chọn + Map).
   - **Giai đoạn 4:** `ToolkitBento` và các trang tính công cụ lương.
   - **Giai đoạn 5:** Trang động `[slug]` cho dịch vụ, case studies và tin tức.

5. **Kiểm tra Pre-flight Checklist:**
   - Không còn class lỗi mờ viền (đảm bảo mọi card đều có `border-1.5` chuẩn).
   - Responsive hoàn chỉnh từ mobile 375px đến màn hình lớn 2K.
   - Các hiệu ứng hover (spring transition, elevation shadow) mượt mà 60fps.
   - Chế độ in/tải PDF tờ báo giá hoạt động ổn định.

