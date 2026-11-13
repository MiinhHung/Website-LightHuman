# Mã Mẫu Các Component Cốt Lõi (Next.js + Tailwind + shadcn/ui)

Tài liệu này cung cấp mã nguồn TypeScript / React hoàn chỉnh cho các component đặc trưng nhất của Light Human để cắm ngay vào dự án Next.js App Router.

---

## 1. StepsHorizontal: "Làm như thế nào" (01 - 06 So le)

```tsx
// components/sections/steps-horizontal.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Search, Target, Users, Award, ShieldCheck, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepItem {
  num: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const STEPS: StepItem[] = [
  { num: "01", title: "Lắng nghe và thấu hiểu", desc: "Nắm bắt trọn vẹn nhu cầu, mục tiêu cốt lõi của doanh nghiệp.", icon: <Users className="w-5 h-5" /> },
  { num: "02", title: "Phân tích chuyên sâu", desc: "Đánh giá đặc thù ngành, văn hóa và đội ngũ hiện tại.", icon: <Search className="w-5 h-5" /> },
  { num: "03", title: "Xây dựng giải pháp", desc: "Thiết kế giải pháp 'may đo', tối ưu theo đặc thù doanh nghiệp.", icon: <Target className="w-5 h-5" /> },
  { num: "04", title: "Triển khai và đồng hành", desc: "Cùng bạn triển khai, đảm bảo quá trình hiệu quả, suôn sẻ.", icon: <HeartHandshake className="w-5 h-5" /> },
  { num: "05", title: "Đo lường và đánh giá", desc: "Theo dõi KPIs, đánh giá minh bạch hiệu quả giải pháp.", icon: <ShieldCheck className="w-5 h-5" /> },
  { num: "06", title: "Tối ưu và phát triển", desc: "Liên tục cải tiến, hỗ trợ doanh nghiệp phát triển bền vững.", icon: <Award className="w-5 h-5" /> },
];

export function StepsHorizontal() {
  return (
    <section className="bg-navy-950 text-white py-24 md:py-32 relative overflow-hidden" aria-labelledby="steps-title">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <h2 id="steps-title" className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
              Làm <span className="text-gold italic font-normal">như thế nào</span>
            </h2>
            <p className="text-slate-400 mt-4 text-lg max-w-xl">
              Sáu bước lặp lại cho mọi dự án, từ một vị trí giám đốc đến một nghìn công nhân.
            </p>
          </div>
          <Button asChild className="rounded-full bg-gold hover:bg-gold-hover text-navy-950 font-semibold px-6 py-6 text-base group">
            <Link href="/bao-gia">
              Nhận báo giá
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Timeline Grid */}
        <div className="relative">
          {/* Đường line kết nối chạy ngang trên Desktop */}
          <div className="hidden lg:block absolute top-[98px] left-0 right-0 h-[2px] bg-slate-800" aria-hidden="true" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-4">
            {STEPS.map((step, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div key={step.num} className="relative flex flex-col group">
                  {/* Số lớn */}
                  <div className={`transition-transform duration-300 group-hover:-translate-y-1 ${isEven ? "lg:mt-3" : "lg:mb-3"}`}>
                    <span className="font-display font-extrabold text-5xl md:text-6xl text-transparent [-webkit-text-stroke:1.5px_#f2cf63] select-none block">
                      {step.num}
                    </span>
                  </div>

                  {/* Nốt tròn trên đường line */}
                  <div className="hidden lg:flex items-center my-4" aria-hidden="true">
                    <div className="w-3.5 h-3.5 rounded-full bg-gold ring-4 ring-navy-950 transition-transform duration-300 group-hover:scale-125" />
                  </div>

                  {/* Icon & Nội dung */}
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold border border-gold/25 flex items-center justify-center transition-colors group-hover:bg-gold/25">
                      {step.icon}
                    </div>
                    <h3 className="font-display font-bold text-base text-white group-hover:text-gold transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## 2. SxParallax: "Quy trình vận hành nhiều lớp phía sau" (Nền Sáng + Thẻ Đối Nghịch)

```tsx
// components/sections/sx-parallax.tsx
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Megaphone, FileCheck2, Award } from "lucide-react";

const LAYERS = [
  {
    num: "01",
    title: "Phân tích & Chân dung",
    desc: "Xác định đặc tính dự án, văn hóa tổ chức và chân dung ứng viên mục tiêu chi tiết.",
    tag: "Chuyên môn ngành",
    icon: <Briefcase className="w-5 h-5" />,
    cool: true,
  },
  {
    num: "02",
    title: "Đăng tin đa kênh",
    desc: "Phân phối thông điệp tuyển dụng rộng rãi trên hệ thống đối tác và nguồn ứng viên sẵn có.",
    tag: "Tiếp cận đa tầng",
    icon: <Megaphone className="w-5 h-5" />,
    cool: false,
  },
  {
    num: "03",
    title: "Sàng lọc hồ sơ",
    desc: "Shortlist nhanh theo tiêu chí, kiểm tra tham chiếu và phỏng vấn hành vi độc lập.",
    tag: "Đánh giá 3 vòng",
    icon: <FileCheck2 className="w-5 h-5" />,
    cool: true,
  },
  {
    num: "04",
    title: "Bàn giao & Bảo hành",
    desc: "Bàn giao nhân sự hoàn chỉnh, cam kết bảo hành và đồng hành trong 60 ngày thử việc.",
    tag: "Cam kết văn bản",
    icon: <Award className="w-5 h-5" />,
    cool: false,
  },
];

export function SxParallax() {
  return (
    <section className="bg-gradient-to-b from-[#eef3fa] via-paper to-paper py-24 md:py-32 relative overflow-hidden" aria-labelledby="sx-parallax-title">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <Badge variant="outline" className="border-navy-950/20 text-navy-800 bg-white shadow-sm font-mono text-xs uppercase px-3 py-1">
            Quy trình vận hành
          </Badge>
          <h2 id="sx-parallax-title" className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-navy-950">
            Mỗi lần tuyển có <span className="text-amber-600 italic font-normal">nhiều lớp phía sau</span>
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Từ chân dung ứng viên đến ngày nhận việc, mỗi lớp có đội ngũ chuyên gia phụ trách riêng và tiêu chuẩn kiểm soát chất lượng độc lập.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {LAYERS.map((layer) => (
            <article
              key={layer.num}
              className={`flex flex-col min-h-[360px] p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                layer.cool
                  ? "rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-md rounded-bl-md bg-white border-1.5 border-navy-950/15 shadow-card hover:shadow-cardHover hover:border-navy-600"
                  : "rounded-tr-[2rem] rounded-bl-[2rem] rounded-tl-md rounded-bl-md bg-gradient-to-br from-white via-[#fffdf4] to-[#fff8e8] border-1.5 border-amber-500/40 shadow-warm hover:shadow-xl hover:border-amber-500 lg:mt-8"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <span className={`font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full ${
                  layer.cool
                    ? "bg-navy-950/5 text-navy-800 border border-navy-950/10"
                    : "bg-amber-400/25 text-amber-800 border border-amber-400/40 font-semibold"
                }`}>
                  Lớp {layer.num}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  layer.cool
                    ? "bg-navy-950/5 text-navy-800 border border-navy-950/10"
                    : "bg-amber-400/20 text-amber-700 border border-amber-400/30"
                }`}>
                  {layer.icon}
                </div>
              </div>

              {/* Title & Desc */}
              <h3 className="font-display font-bold text-xl text-navy-950 mb-3">
                {layer.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {layer.desc}
              </p>

              {/* Card Foot */}
              <div className={`mt-auto pt-4 border-t font-mono text-xs uppercase tracking-wider ${
                layer.cool ? "border-navy-950/10 text-navy-800" : "border-amber-500/20 text-amber-800 font-semibold"
              }`}>
                {layer.tag}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 3. SxFeatures: "Vì sao doanh nghiệp chọn Light Human" (Nền Kem + Thẻ Line Vàng)

```tsx
// components/sections/sx-features.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Users2, Globe2, Clock, ShieldCheck, Target, GraduationCap, ArrowUpRight } from "lucide-react";

const FEATURES = [
  {
    num: "01",
    title: "Recruiter chuyên trách",
    desc: "Mỗi dự án có 1 PM + đội recruiter chuyên trách, không chia sẻ pipeline với khách khác.",
    serviceName: "Tuyển dụng nhân sự cấp cao",
    href: "/dich-vu/tuyen-dung-nhan-su-cao-cap",
    icon: <Users2 className="w-6 h-6" />,
  },
  {
    num: "02",
    title: "Mạng lưới ứng viên chất lượng",
    desc: "Tiếp cận ứng viên trực tiếp thông qua mạng lưới rộng khắp trong và ngoài nước.",
    serviceName: "Tuyển dụng nhân sự cấp cao",
    href: "/dich-vu/tuyen-dung-nhan-su-cao-cap",
    icon: <Globe2 className="w-6 h-6" />,
  },
  {
    num: "03",
    title: "Nguồn ứng viên đã sàng lọc sẵn",
    desc: "Ứng viên đã được phỏng vấn trước - gửi danh sách trong 48-72 giờ cho hầu hết vị trí.",
    serviceName: "Tuyển dụng nhân sự tạm thời",
    href: "/dich-vu/tuyen-dung-nhan-su-tam-thoi",
    icon: <Clock className="w-6 h-6" />,
  },
  {
    num: "04",
    title: "Cam kết SLA rõ ràng",
    desc: "Cam kết bằng văn bản về số lượng CV/tuần, tỷ lệ phỏng vấn và thời gian onboard vị trí.",
    serviceName: "Tuyển dụng số lượng lớn",
    href: "/dich-vu/tuyen-dung-nhan-su-so-luong-lon",
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  {
    num: "05",
    title: "Tích hợp ATS doanh nghiệp",
    desc: "Đẩy ứng viên trực tiếp vào ATS/HRIS của doanh nghiệp - không phát sinh thao tác thủ công.",
    serviceName: "Tuyển dụng số lượng lớn",
    href: "/dich-vu/tuyen-dung-nhan-su-so-luong-lon",
    icon: <Target className="w-6 h-6" />,
  },
  {
    num: "06",
    title: "Cố vấn 30-60 ngày sau khóa",
    desc: "Coaching theo công việc thực tế sau khóa học - đội ngũ áp dụng vào dự án thật, có chuyên gia review.",
    serviceName: "Đào tạo tuyển dụng",
    href: "/dich-vu/dao-tao-tuyen-dung",
    icon: <GraduationCap className="w-6 h-6" />,
  },
];

export function SxFeatures() {
  return (
    <section className="bg-gradient-to-b from-paper via-cream to-cream py-24 md:py-32" aria-labelledby="sx-features-title">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <Badge variant="outline" className="border-navy-950/20 text-navy-800 bg-white shadow-sm font-mono text-xs uppercase px-3 py-1">
            Lợi thế
          </Badge>
          <h2 id="sx-features-title" className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-navy-950">
            Vì sao doanh nghiệp chọn <span className="text-amber-600 italic font-normal">Light Human</span>
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Sáu điểm lấy từ cách chúng tôi vận hành từng dịch vụ: người phụ trách riêng, nguồn ứng viên sẵn có, tích hợp hệ thống và cam kết bằng văn bản.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feat) => (
            <article
              key={feat.num}
              className="group relative flex flex-col p-8 rounded-2xl bg-white border-1.5 border-navy-950/12 shadow-card hover:shadow-cardHover hover:border-amber-500 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
            >
              {/* Highlight Line trên đỉnh */}
              <div
                className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60 group-hover:opacity-100 group-hover:h-[3px] transition-all"
                aria-hidden="true"
              />

              {/* Head: Icon + Number */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-700 border border-amber-400/30 flex items-center justify-center group-hover:scale-105 group-hover:bg-amber-400/30 transition-all">
                  {feat.icon}
                </div>
                <span className="font-display font-bold text-xl text-amber-700">
                  {feat.num}
                </span>
              </div>

              {/* Body */}
              <h3 className="font-display font-bold text-lg text-navy-950 mb-2 group-hover:text-amber-800 transition-colors">
                {feat.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {feat.desc}
              </p>

              {/* Foot Link */}
              <Link
                href={feat.href}
                className="mt-auto pt-5 border-t border-navy-950/10 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-navy-900 group-hover:text-amber-700 transition-colors"
              >
                <span>{feat.serviceName}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

