# HỆ THỐNG ĐIỀU PHỐI VÀ GIÁM SÁT QUY TRÌNH SẢN XUẤT XƯỞNG GỐM BÁT TRÀNG

## 1. GIỚI THIỆU BÀI TOÁN THỰC TẾ XƯỞNG GỐM BÁT TRÀNG

### Bối Cảnh Nghiệp Vụ Thực Tế
Xưởng gốm sứ Bát Tràng tiếp nhận hàng trăm đơn hàng gia công chế tác gốm sứ thủ công và công nghiệp mỗi tháng. Các đơn hàng gửi về từ các đại lý, nhà hàng, khách sạn thường ở dạng câu văn mô tả tự nhiên (Ví dụ: *"Đơn 500 Bộ ấm trà tử sa họa tiết men rạn cổ cao 18cm, nung lò 1250°C trong 20 giờ, giao gấp trong 7 ngày"*).

### Các Thách Thức Đặt Ra Cho Giao Diện Web
1. **Theo dõi trực quan 6 công đoạn**: Quá trình sản xuất trải qua 6 trạm liên hoàn (*Tạo hình mộc --> Phơi sấy & Sửa mộc --> Vẽ họa tiết --> Tráng men --> Vào lò nung --> QC & Đóng gói*). Thợ xưởng và quản lý cần một màn hình rộng trực quan hóa vị trí của từng mẻ gốm mà không bị che khuất chữ hay đè icon.
2. **Tiếp nhận đơn hàng tự nhiên**: Tránh việc thợ phải gõ tay nhập liệu rườm rà. Giao diện tích hợp AI bóc tách tự động 10 thông số kỹ thuật và hiển thị bảng xem trước (preview) ngay trong Popup.
3. **Cảnh báo lỗi khẩn cấp tức thì**: Khi thợ QC kiểm định và phát hiện tỷ lệ lỗi vượt quá 3%, giao diện Web lập tức bật thông báo đỏ khẩn cấp và hiển thị viền báo động trực quan.

### Mục Tiêu Giải Pháp Của Frontend
- Xây dựng giao diện Web màn hình rộng co giãn linh hoạt bằng React 18, Vite và Bootstrap 5.
- Thiết kế Bảng Kanban 7 cột hiển thị danh sách mẻ gốm với đầy đủ nút bấm `Chuyển Bước` và `QC` phẳng đẹp.
- Áp dụng cơ chế tự động đồng bộ dữ liệu thời gian thực (Realtime Auto Polling 8 giây).
- Tối ưu trải nghiệm người dùng: Tự động tách số lượng từ văn bản mô tả (Auto-sync) và tự làm sạch Modal state khi đóng.

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
