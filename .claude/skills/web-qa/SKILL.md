---
name: web-qa
description: Kiểm tra thực tế một site trong website/ trước khi báo xong hoặc sau khi đưa lên ePod - chụp màn hình desktop 1440px và mobile 390px bằng Chrome headless (chụp được cả site ở máy và URL ePod), và chạy test hành vi JS (giỏ hàng, bộ lọc, form, tab) bằng jsdom không cần trình duyệt. Dùng ở bước 8 của quy trình trong frontend-themes/CLAUDE.md, khi sửa giao diện, khi người dùng gửi ảnh chụp lỗi, hoặc sau mỗi lần push ePod.
---

# web-qa

Bước 8 "Kiểm tra thực tế" của `frontend-themes/CLAUDE.md`. Chạy sau `build.js` + `check.js` + lint, trước khi báo xong.

## Chạy trong dự án Website-LH (Next.js)

```bash
pnpm build && pnpm start --port 3123   # chạy nền, rồi chụp:
node .claude/skills/web-qa/scripts/shots.js http://localhost:3123 --pages=/,/gioi-thieu,/dich-vu,/lien-he
node .claude/skills/web-qa/scripts/shots.js https://lighthuman.vn --pages=/,/gioi-thieu   # chụp bản gốc để so sánh
```

- Dự án này không có `website/` hay `tools/smoke.js`; test hành vi dùng Playwright MCP nếu đã kết nối.

## Chạy (repo gốc ClaudeMD)

```bash
# Chụp màn hình (ảnh ở thư mục tạm của máy, in đường dẫn; ảnh dài cắt thành -p1, -p2...)
node .agents/skills/web-qa/scripts/shots.js website/<Du-an> --pages=index.html,gio-hang.html
node .agents/skills/web-qa/scripts/shots.js https://<store>.epodsystem.com --pages=/,/pages/cua-hang

# Test hành vi JS của site (mỗi site tự viết tools/smoke.js dựa trên harness)
node website/<Du-an>/tools/smoke.js
```

- Xem ảnh bằng Read, đọc từng đoạn `-p1`, `-p2`; đừng đọc ảnh nguyên khổ (bị thu nhỏ, mất chi tiết).
- Ảnh chụp lúc animation chưa xong có thể mờ: đó không phải lỗi bố cục.
- Test lỗi thì phân biệt lỗi của site và lỗi của chính bài test trước khi sửa.

## Tài liệu (chỉ nạp file cần cho việc đang làm)

| Việc | File |
| --- | --- |
| Chụp màn hình, đọc ảnh, lỗi hay gặp khi soi giao diện | `references/chup-man-hinh.md` |
| Viết `tools/smoke.js` cho site mới, API của harness | `references/smoke-test.md` |

Ví dụ smoke test đầy đủ: `website/Mexung-anuong/tools/smoke.js` (giỏ, quy cách, lọc, tìm không dấu, hộp quà, đặt hàng).
