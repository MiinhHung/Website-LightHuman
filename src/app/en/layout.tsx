// English section. The root layout owns <html lang="vi">; this wrapper (plus the
// header's effect on document.documentElement.lang) marks the content as English.
export default function EnglishLayout({ children }: LayoutProps<"/en">) {
  return <div lang="en">{children}</div>;
}
