# Giao Diện Quản Lý Và Điều Phối Xưởng Gốm Bát Tràng

Dự án giao diện Web phục vụ việc quản lý, tiếp nhận đơn hàng và theo dõi tiến độ sản xuất gốm sứ theo từng công đoạn liên hoàn tại xưởng.

## 1. Giới Thiệu

```
+-----------------------------------------------------------------------------------+
|                           MÔ HÌNH TỔNG QUAN HỆ THỐNG                              |
|                                                                                   |
|  [Trình Duyệt Web UI]  <===>  [API Axios Service]  <===>  [Spring Boot Server]   |
|  (Bảng Kanban / Modal)        (api.js / Port 8080)        (REST API Backend)      |
+-----------------------------------------------------------------------------------+
```

Giao diện được xây dựng bằng React và Bootstrap 5 với bố cục màn hình rộng, giúp người quản lý và thợ xưởng dễ dàng theo dõi vị trí của từng mẻ gốm qua các trạm sản xuất. Hệ thống hỗ trợ bóc tách thông số kỹ thuật đơn hàng từ mô tả tự nhiên, quản lý tiến độ dạng bảng Kanban và phát cảnh báo khi tỷ lệ sản phẩm lỗi vượt quá mức cho phép.

## 2. Các Chức Năng Chính

```
+-----------------------------------------------------------------------------------+
| 1. BẢNG KANBAN TIẾN ĐỘ SẢN XUẤT (7 CỘT)                                            |
|                                                                                   |
| [Tạo hình mộc] -> [Phơi sấy & sửa] -> [Vẽ họa tiết] -> [Tráng men] -> [Vào lò]   |
|                                                                        |          |
| [Xuất xưởng]   <- [Kiểm định QC & đóng gói] <--------------------------+          |
+-----------------------------------------------------------------------------------+
| 2. TIẾP NHẬN & PHÂN TÍCH ĐƠN HÀNG                                                 |
|                                                                                   |
|  (Mô tả văn bản tự nhiên)  --->  (Tự động phân tích bóc tách thông số)            |
|                                                |                                  |
|                                                v                                  |
|  [Tên SP | Loại men | Nhiệt độ nung | Đất sét | Thời gian nung | Mức ưu tiên]      |
+-----------------------------------------------------------------------------------+
| 3. XEM CHI TIẾT ĐƠN HÀNG & LỊCH SỬ CÔNG ĐOẠN                                       |
|                                                                                   |
|  Thông tin đơn hàng -> Bảng timeline lịch sử 6 công đoạn thực tế                  |
|  (Trạm công đoạn | Trạng thái | Thời gian hoàn thành | Người thực hiện | Ghi chú) |
+-----------------------------------------------------------------------------------+
| 4. KIỂM ĐỊNH QC & CẢNH BÁO TỶ LỆ LỖI KHẨN CẤP                                     |
|                                                                                   |
|  Tỷ lệ lỗi (%) = (Số sản phẩm lỗi / Tổng kiểm định) * 100                        |
|  - Nếu Tỷ lệ lỗi > 3%: Kích hoạt Cảnh Báo Đỏ & Bắn thông báo khẩn tới nhóm chat    |
+-----------------------------------------------------------------------------------+
| 5. DANH SÁCH ĐƠN HÀNG & PHÂN TRANG NÂNG CAO                                       |
|                                                                                   |
|  - Ô tìm kiếm nhanh theo mã đơn, khách hàng hoặc tên sản phẩm.                    |
|  - Phân trang: Chọn hiển thị 5, 10, 20, 50 đơn/trang và nút điều hướng trang.      |
+-----------------------------------------------------------------------------------+
| 6. BÁO CÁO THỐNG KÊ KPI XƯỞNG                                                     |
|                                                                                   |
|  Tổng đơn hàng | Mẻ đang chế tác | Mẻ hoàn thành | Tỷ lệ đạt QC (%) | Cảnh báo đỏ |
+-----------------------------------------------------------------------------------+
```

### Bảng Kanban Theo Dõi Tiến Độ
Hiển thị danh sách các mẻ gốm phân chia theo 6 công đoạn sản xuất liên hoàn cùng cột hoàn thành xuất xưởng:
- Tạo hình mộc (Khởi tạo mẻ gốm ban đầu)
- Phơi sấy và sửa mộc (Sấy khô và chỉnh sửa dáng mộc)
- Vẽ họa tiết (Trang trí hoa văn thủ công)
- Tráng men (Phủ lớp men bảo vệ và tạo màu)
- Vào lò nung (Nung nhiệt độ cao trong lò)
- Kiểm định chất lượng và đóng gói (QC đánh giá tỷ lệ lỗi và đóng gói)
- Hoàn thành xuất xưởng (Mẻ gốm hoàn tất quy trình)

Dữ liệu trên bảng Kanban được cập nhật tự động định kỳ để phản ánh trạng thái thực tế tại xưởng. Trên mỗi mẻ gốm có nút thao tác chuyển công đoạn và ghi nhận kiểm định.

### Tiếp Nhận Và Phân Tích Đơn Hàng
Người dùng nhập thông tin khách hàng và mô tả yêu cầu đơn hàng dạng văn bản tự nhiên. Hệ thống tự động phân tích và đưa ra các thông số kỹ thuật như tên sản phẩm, loại men, nhiệt độ nung, thời gian nung, lượng đất sét ước tính và mức độ ưu tiên. Thông số sau khi phân tích sẽ được hiển thị ngay trong cửa sổ tiếp nhận để người quản lý kiểm tra trước khi chuyển sang bảng tiến độ.

### Xem Chi Tiết Đơn Hàng Và Lịch Sử Công Đoạn
Cho phép xem lại toàn bộ thông tin đơn hàng cùng bảng lịch sử ghi nhận chi tiết qua từng bước sản xuất. Bảng lịch sử hiển thị rõ trạng thái của từng công đoạn, thời gian hoàn thành, người thực hiện và ghi chú kèm theo.

### Kiểm Định Chất Lượng Và Đánh Giá Tỷ Lệ Lỗi
Cho phép thợ kiểm định nhập tổng số sản phẩm kiểm tra, số lượng bị lỗi và loại lỗi phát sinh. Hệ thống tự động tính tỷ lệ lỗi theo phần trăm. Nếu tỷ lệ lỗi vượt quá 3%, giao diện sẽ hiển thị cảnh báo đỏ và gửi thông báo khẩn cấp tới quản lý.

### Danh Sách Đơn Hàng Và Phân Trang
Trang quản lý đơn hàng hỗ trợ ô tìm kiếm nhanh theo mã đơn, tên khách hàng hoặc tên sản phẩm. Danh sách có bộ chọn số lượng hiển thị trên mỗi trang (5, 10, 20, 50 đơn hàng) và đầy đủ các nút chuyển trang.

### Báo Cáo Thống Kê KPI
Cung cấp các thẻ thống kê tổng quan về số lượng đơn hàng tiếp nhận, số mẻ gốm đang chế tác, số mẻ đã hoàn thành, tỷ lệ đạt chất lượng và các sự cố cảnh báo đỏ.

## 3. Cấu Trúc Thư Mục

```
ceramics-frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── services/
    │   └── api.js
    ├── styles/
    │   └── ceramic.css
    └── components/
        ├── Navbar.jsx
        ├── KanbanBoard.jsx
        ├── OrderFormModal.jsx
        ├── OrderDetailModal.jsx
        ├── AdvanceStageModal.jsx
        ├── QcModal.jsx
        ├── DashboardStats.jsx
        └── OrderList.jsx
```

- index.html: Trang HTML gốc của ứng dụng.
- package.json: File khai báo danh sách các thư viện phụ thuộc và kịch bản thực thi.
- vite.config.js: Cấu hình công cụ biên dịch và cổng khởi chạy dự án.
- src/main.jsx: Điểm khởi chạy chính ứng dụng React.
- src/App.jsx: Component trung tâm quản lý trạng thái, chuyển tab và hiển thị các cửa sổ thao tác.
- src/services/api.js: Thư viện xử lý gọi API kết nối với server backend.
- src/styles/ceramic.css: Định kiểu giao diện với bảng màu gốm sứ Bát Tràng.
- src/components/Navbar.jsx: Thanh điều hướng phía trên màn hình.
- src/components/KanbanBoard.jsx: Component hiển thị bảng Kanban 7 cột.
- src/components/OrderFormModal.jsx: Cửa sổ tiếp nhận đơn hàng và hiển thị thông số phân tích.
- src/components/OrderDetailModal.jsx: Cửa sổ xem chi tiết đơn hàng và lịch sử công đoạn.
- src/components/AdvanceStageModal.jsx: Cửa sổ thao tác chuyển mẻ gốm sang bước tiếp theo.
- src/components/QcModal.jsx: Cửa sổ ghi nhận kết quả kiểm định chất lượng.
- src/components/DashboardStats.jsx: Component hiển thị các thẻ thống kê KPI.
- src/components/OrderList.jsx: Component hiển thị danh sách đơn hàng có phân trang và tìm kiếm.

## 4. Sơ Đồ Kết Nối API

```
+-----------------------------------+-----------------------------------------------+
| ĐƯỜNG DẪN API (BACKEND)           | CHỨC NĂNG TÍCH HỢP TRÊN GIAO DIỆN WEB         |
+-----------------------------------+-----------------------------------------------+
| GET  /api/orders                  | Tải danh sách đơn hàng cho trang OrderList    |
| POST /api/orders                  | Gửi mô tả văn bản tự nhiên để phân tích & tạo |
| GET  /api/orders/{id}             | Tải thông tin chi tiết đơn hàng & mẻ gốm      |
| GET  /api/batches                 | Tải danh sách mẻ gốm cho Bảng Kanban          |
| PATCH /api/batches/{id}/advance   | Chuyển công đoạn sản xuất mẻ gốm sang bước mới |
| POST /api/qc                      | Lưu kết quả kiểm định & kiểm tra tỷ lệ lỗi >3%|
| GET  /api/dashboard/stats         | Tải các chỉ số thống kê KPI cho Dashboard     |
| GET  /api/dashboard/kanban        | Tải dữ liệu các cột trên Bảng Kanban          |
+-----------------------------------+-----------------------------------------------+
```

## 5. Hướng Dẫn Cài Đặt Và Chạy

```
+-----------------------------------------------------------------------------------+
| QUY TRÌNH THỰC THI                                                                |
|                                                                                   |
| (1) Mở Terminal  ---> (2) npm install  ---> (3) npm run dev  ---> (4) Web Open    |
|     (Thư mục FE)          (Tải thư viện)        (Khởi chạy)       (Cổng 5173)     |
+-----------------------------------------------------------------------------------+
```

### Yêu Cầu Môi Trường
- Node.js từ phiên bản 18 trở lên.
- Server backend đã được khởi chạy ở cổng 8080.

### Các Lệnh Thực Hiện
1. Cài đặt các thư viện phụ thuộc:
npm install

2. Khởi chạy giao diện ở chế độ phát triển:
npm run dev

3. Đóng gói ứng dụng cho môi trường thực tế:
npm run build
