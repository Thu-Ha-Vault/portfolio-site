# Nguồn tài nguyên ngoài (assets/)

Chỉ dùng tài nguyên giấy phép CC0, ghi nguồn từng file. Giới hạn tổng dung lượng `assets/` là 8 MB (đo bằng `du -sh assets`).

| File | Nguồn | Tác giả | Giấy phép | Cách đổi |
|---|---|---|---|---|
| `hdri/hospital_room_2.png` | Poly Haven, "Hospital Room 2", https://polyhaven.com/a/hospital_room_2 (bản HDR 1K) | Dimitrios Savva (chụp), Jarod Guest (xử lý) | CC0 | `python3 tools/hdri/to_rgbm.py hospital_room_2_1k.hdr assets/hdri/hospital_room_2.png 1024`: ảnh HDR đổi sang PNG mã hoá RGBM (khoảng 0–8), giải mã trong `src/scene/quality.js` |
