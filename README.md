# HỆ THỐNG ĐIỀU PHỐI VÀ GIÁM SÁT QUY TRÌNH SẢN XUẤT XƯỞNG GỐM BÁT TRÀNG
## BÁO CÁO MÃ NGUỒN GIAO DIỆN WEB FRONTEND (REACT 18 + VITE)

Tài liệu hướng dẫn và giải thích mã nguồn phần giao diện Web Frontend của Hệ thống điều phối sản xuất xưởng gốm Bát Tràng. Giao diện được xây dựng bằng thư viện React 18, Vite và Bootstrap 5, giúp quản lý xưởng và thợ theo dõi tiến độ sản xuất 6 công đoạn liên hoàn, tiếp nhận đơn hàng tự nhiên qua AI và phát cảnh báo sự cố khẩn cấp.

---

## 1. TỔNG QUAN VỀ GIAO DIỆN VÀ Ý TƯỞNG THIẾT KẾ

```
+-----------------------------------------------------------------------------------+
|                           MÔ HÌNH TỔNG QUAN HỆ THỐNG WEB                          |
|                                                                                   |
|  [Trình Duyệt Web UI]  <===>  [API Axios Service]  <===>  [Spring Boot Server]   |
|  (React 18 / Bảng Kanban)     (services/api.js)           (Port 8080 Backend)     |
+-----------------------------------------------------------------------------------+
```

### Lựa Chọn Màu Sắc Và Bố Cục
- Giao diện sử dụng bảng màu mô phỏng làng nghề gốm sứ Bát Tràng với tông màu đất nung Terracotta `#C85A32` làm chủ đạo cho các nút bấm chính và nhãn hiển thị.
- Tông màu cát nhẹ `#F7F4EE` làm màu nền tổng thể giúp không bị chói mắt khi theo dõi màn hình lâu tại xưởng.
- Bố cục màn hình rộng hiển thị trọn vẹn Bảng Kanban 7 cột, giúp quan sát toàn bộ vị trí mẻ gốm từ khâu tạo hình đến khâu xuất xưởng mà không bị đè chữ.

---

## 2. QUY TRÌNH HOẠT ĐỘNG VÀ CÁC NÚT THAO TÁC THỰC TẾ

```
+-----------------------------------------------------------------------------------+
|                          LUỒNG CHẠY NGHIỆP VỤ THỰC TẾ                             |
|                                                                                   |
|  [BƯỚC 1: TIẾP NHẬN ĐƠN HÀNG VĂN BẢN]                                              |
|  Quản lý nhập: "Đơn 200 Bình gốm họa tiết sen men lam cao 35cm, nung 1280°C..."   |
|                                  |                                                |
|                                  v                                                |
|  [BƯỚC 2: AI BÓC TÁCH THÔNG SỐ]                                                   |
|  Phân tích ra 10 thông số kỹ thuật + Ước tính 300kg đất sét + Độ ưu tiên HIGH    |
|                                  |                                                |
|                                  v                                                |
|  [BƯỚC 3: TỰ ĐỘNG KHỞI TẠO MẺ GỐM VÀ 6 CÔNG ĐOẠN LIÊN HOÀN]                       |
|  Tạo mẻ #GOM-... -> Gán 6 trạm: Tạo hình -> Phơi sấy -> Vẽ -> Tráng men -> Nung    |
|                                  |                                                |
|                                  v                                                |
|  [BƯỚC 4: THỰC HIỆN ĐIỀU PHỐI KANBAN HOẶC TƯƠNG TÁC SLACK / ZALO]                 |
|  - Thợ bấm nút [Chuyển bước] trên Web Kanban (Cập nhật realtime 8s)              |
|  - Hoặc Thợ bấm nút [Xác nhận hoàn thành] trực tiếp trên ứng dụng Slack/Zalo     |
|                                  |                                                |
|                                  v                                                |
|  [BƯỚC 5: KIỂM ĐỊNH QC VÀ TÍNH TỶ LỆ LỖI (%)]                                     |
|  Tỷ lệ lỗi (%) = (Số sản phẩm lỗi / Tổng kiểm định) * 100                        |
|                                  |                                                |
|         +------------------------+------------------------+                       |
|         |                                                 |                       |
|         v                                                 v                       |
|  [NẾU TỶ LỆ LỖI <= 3%]                           [NẾU TỶ LỆ LỖI > 3%]             |
|  - Đạt chuẩn chất lượng xưởng                    - Kích hoạt CẢNH BÁO ĐỎ khẩn cấp |
|  - Cho phép xuất xưởng bình thường              - Bật Toast cảnh báo đỏ trên Web  |
|                                                  - Bắn tin CẢNH BÁO ĐỎ sang       |
|                                                    Slack & Zalo dừng lò xử lý ngay|
+-----------------------------------------------------------------------------------+
```

### Các Bước Thao Tác Chi Tiết Trên Web:
1. **Tạo đơn hàng bằng AI**: Nhấn nút `Tạo Đơn Hàng AI`, nhập mô tả tự nhiên. Hệ thống tự đọc số lượng từ câu văn và hiển thị kết quả phân tích 10 thông số kỹ thuật ngay trong Popup.
2. **Theo dõi Bảng Kanban**: Hiển thị 6 công đoạn sản xuất liên hoàn (Tạo hình mộc, Phơi sấy sửa mộc, Vẽ họa tiết, Tráng men, Vào lò nung, Kiểm định QC đóng gói) và 1 cột Hoàn thành.
3. **Cập nhật tiến độ**: Trên mỗi thẻ mẻ gốm có nút `Chuyển Bước` và nút `QC`. Thợ xưởng có thể bấm chuyển bước trên Web hoặc bấm nút trực tiếp trong chat Slack/Zalo. Trang Web tự động tải lại dữ liệu định kỳ mỗi 8 giây.
4. **Kiểm định QC và Báo động lỗi**: Nhấn nút `QC` trên mẻ gốm để nhập số lượng sản phẩm kiểm tra và số lỗi. Hệ thống tự tính tỷ lệ lỗi theo công thức `(Số lỗi / Tổng kiểm tra) * 100`. Nếu tỷ lệ lỗi vượt quá 3%, giao diện sẽ bật thông báo đỏ khẩn cấp.
5. **Xem lịch sử và thống kê**: Tab Quản lý đơn hàng hỗ trợ ô tìm kiếm, phân trang và xem lại lịch sử 6 công đoạn thực tế. Tab Báo cáo cung cấp 5 thẻ thống kê tổng quan xưởng.

---

## 3. CẤU TRÚC THƯ MỤC MÃ NGUỒN FRONTEND

```
ceramics-frontend/
├── index.html                          (Trang HTML gốc của ứng dụng)
├── package.json                        (Khai báo thư viện phụ thuộc: React, Vite, Axios, Bootstrap 5)
├── vite.config.js                      (File cấu hình biên dịch Vite)
└── src/
    ├── main.jsx                        (Điểm khởi chạy ứng dụng React)
    ├── App.jsx                         (Component chính quản lý state, chuyển tab và tự cập nhật 8s)
    ├── services/
    │   └── api.js                      (Cấu hình Axios gọi API kết nối tới Server Backend 8080)
    ├── styles/
    │   └── ceramic.css                 (File định kiểu giao diện giao diện xưởng gốm)
    └── components/
        ├── Navbar.jsx                  (Thanh điều hướng tiêu đề và nút tạo đơn)
        ├── KanbanBoard.jsx             (Bảng Kanban hiển thị mẻ gốm ở 7 cột)
        ├── OrderFormModal.jsx          (Popup tiếp nhận đơn hàng và preview thông số AI)
        ├── OrderDetailModal.jsx        (Popup xem chi tiết đơn hàng và lịch sử 6 công đoạn)
        ├── AdvanceStageModal.jsx       (Popup thao tác chuyển mẻ gốm sang bước tiếp theo)
        ├── QcModal.jsx                 (Popup nhập số liệu kiểm định QC)
        ├── DashboardStats.jsx          (Bảng hiển thị 5 thẻ thống kê KPI xưởng)
        └── OrderList.jsx               (Danh sách đơn hàng có tìm kiếm và phân trang)
```

---

## 4. HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN (SETUP GUIDE)

### Yêu Cầu Tiền Đề
- Cần cài sẵn Node.js phiên bản 18 trở lên trên máy tính.
- Server Backend Spring Boot chạy ở địa chỉ `http://localhost:8080`.

### Bước 1: Mở Cửa Sổ Dòng Lệnh
Mở PowerShell hoặc Command Prompt và di chuyển vào thư mục giao diện frontend:
```bash
cd ceramics-frontend
```

### Bước 2: Cài Đặt Thư Viện
Chạy lệnh sau để tải toàn bộ các thư viện cần thiết:
```bash
npm install
```

### Bước 3: Khởi Chạy Web ở Chế Độ Thử Nghiệm
Chạy lệnh bên dưới để mở giao diện Web:
```bash
npm run dev
```
Sau khi dòng chữ thông báo hiện ra, mở trình duyệt web truy cập địa chỉ: `http://localhost:5173`

### Bước 4: Đóng Gói Ứng Dụng (Nộp Bài)
Khi cần đóng gói sản phẩm hoàn chỉnh:
```bash
npm run build
```
File sản phẩm sau khi đóng gói sẽ nằm trong thư mục `dist`.
