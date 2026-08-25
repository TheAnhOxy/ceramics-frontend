# HỆ THỐNG ĐIỀU PHỐI VÀ GIÁM SÁT QUY TRÌNH SẢN XUẤT XƯỞNG GỐM BÁT TRÀNG
## ỨNG DỤNG GIAO DIỆN WEB FRONTEND (REACT 18 + VITE)

Mã nguồn ứng dụng giao diện Web Frontend xây dựng bằng React 18 và Vite, đóng vai trò trực quan hóa tiến độ chế tác gốm sứ Bát Tràng theo 6 công đoạn liên hoàn. Giao diện được thiết kế phẳng theo ngôn ngữ mỹ thuật màu đất nung truyền thống Bát Tràng, hỗ trợ Bảng điều phối Kanban 7 cột màn hình rộng, tiếp nhận đơn hàng tự nhiên với sự hỗ trợ của AI Agent và hiển thị cảnh báo lỗi QC khẩn cấp thời gian thực.

---

## I. GIỚI THIỆU BÀI TOÁN GIAO DIỆN VÀ GIẢI PHÁP MỸ THUẬT FRONTEND

### 1. Bài Toán Trải Nghiệm Người Dùng (UX Challenges) Tại Xưởng Gốm
- **Môi trường thao tác màn hình rộng xưởng sản xuất**: Thợ xưởng và quản lý cần quan sát vị trí của hàng chục mẻ gốm trên một giao diện trực quan, không bị đè nén hay che khuất chữ.
- **Trải nghiệm nhập liệu thông minh**: Tránh việc thợ phải gõ lại số lượng sản phẩm thủ công khi câu văn mô tả đã chứa thông tin con số (Ví dụ: *"Đơn 500 Bộ ấm trà..."*).
- **Lưu vết dữ liệu cũ khi đóng Popup**: Khi tạo xong một đơn hàng và đóng Modal, dữ liệu bóc tách của đơn trước không được tồn đọng khi mở tạo đơn mới.

### 2. Giải Pháp Ngôn Ngữ Thiết Kế & Mỹ Thuật Bát Tràng (Ceramic Craft Palette)
- **Terracotta (Màu Đất Nung `#C85A32`)**: Màu chủ đạo đại diện cho phôi đất và lò nung Bát Tràng, áp dụng cho các nút bấm thao tác chính, viền điểm nhấn và nhãn mẻ gốm.
- **Glaze Green (Màu Men Lá `#3F6212`)**: Màu đại diện cho công đoạn tráng men và mẻ gốm đạt chuẩn chất lượng xuất xưởng.
- **Soft Sand (Màu Cát Mịn `#F7F4EE`)**: Màu nền dịu mắt giúp người quản lý quan sát màn hình liên tục tại xưởng không bị mỏi mắt.
- **Critical Red (Màu Đỏ Khẩn Cấp `#DC2626`)**: Bật Toast màu đỏ khẩn cấp và viền cảnh báo khi tỷ lệ sản phẩm lỗi QC vượt ngưỡng 3%.

---

## II. KIẾN TRÚC MÃ NGUỒN VÀ COMPONENT TREE FRONTEND

```
+-----------------------------------------------------------------------------------+
|                        MÔ HÌNH CÂY COMPONENT VÀ STATE DỮ LIỆU                     |
|                                                                                   |
|                                     [App.jsx]                                     |
|                      (State Trung Tâm, ActiveTab & Polling 8s)                    |
|                                         |                                         |
|      +----------------------------------+----------------------------------+      |
|      |                                  |                                  |      |
|      v                                  v                                  v      |
| [Navbar.jsx]                   [KanbanBoard.jsx]                 [DashboardStats] |
| (Header & Brand)               (Bảng 7 Cột Rộng)                 (5 Thẻ KPI Xưởng)|
|                                         |                                         |
|                                         v                                         |
|                                [OrderFormModal.jsx]                               |
|                                (Popup Nhập AI & Preview)                          |
|                                         |                                         |
|      +----------------------------------+----------------------------------+      |
|      |                                  |                                  |      |
|      v                                  v                                  v      |
| [OrderDetailModal.jsx]        [AdvanceStageModal.jsx]               [QcModal.jsx] |
| (Chi Tiết & Timeline)         (Popup Chuyển Bước)                   (Popup QC Lỗi)|
+-----------------------------------------------------------------------------------+
```

### 1. Cấu Trúc Thư Mục Dự Án (Directory Architecture)
```
ceramics-frontend/
├── index.html                          (File HTML gốc của ứng dụng)
├── package.json                        (Khai báo danh sách phụ thuộc React 18, Vite, Axios, Bootstrap 5)
├── vite.config.js                      (Cấu hình cổng khởi chạy 5173 và đóng gói sản phẩm)
└── src/
    ├── main.jsx                        (Điểm khởi chạy ứng dụng React)
    ├── App.jsx                         (Component quản lý state trung tâm, điều hướng Tab & Realtime Polling)
    ├── services/
    │   └── api.js                      (Thư viện Axios cấu hình gọi API RESTful kết nối Server Backend)
    ├── styles/
    │   └── ceramic.css                 (Hệ thống định kiểu màu sắc di sản gốm sứ Bát Tràng)
    └── components/
        ├── Navbar.jsx                  (Thanh điều hướng tiêu đề ứng dụng)
        ├── KanbanBoard.jsx             (Component Bảng Kanban 7 cột màn hình rộng)
        ├── OrderFormModal.jsx          (Popup tiếp nhận đơn hàng & hiển thị thông số AI)
        ├── OrderDetailModal.jsx        (Popup chi tiết đơn hàng & lịch sử 6 công đoạn)
        ├── AdvanceStageModal.jsx       (Popup thao tác chuyển mẻ gốm sang bước mới)
        ├── QcModal.jsx                 (Popup kiểm định chất lượng & tính tỷ lệ lỗi)
        ├── DashboardStats.jsx          (Component hiển thị các thẻ thống kê KPI xưởng)
        └── OrderList.jsx               (Component danh sách đơn hàng có phân trang & tìm kiếm)
```

---

## III. SƠ ĐỒ TƯƠNG TÁC NGƯỜI DÙNG TRÊN GIAO DIỆN (FRONTEND USER FLOW)

```
+-----------------------------------------------------------------------------------+
|                        SƠ ĐỒ TƯƠNG TÁC NGƯỜI DÙNG WEB                             |
|                                                                                   |
|  1. BẤM [✨ TẠO ĐƠN HÀNG AI] ---> Mở OrderFormModal                              |
|     - Gõ văn bản mô tả tự nhiên                                                   |
|     - Auto-Sync: Tự động tách con số điền vào ô Số lượng sản phẩm                 |
|     - Gửi AI phân tích ---> Hiện ngay bảng preview 10 thông số JSON màu xanh      |
|                                                                                   |
|  2. BẢNG KANBAN TIẾN ĐỘ (Realtime Polling 8 giây)                                 |
|     - 6 Cột công đoạn + 1 Cột Hoàn thành                                          |
|     - Mỗi thẻ mẻ gốm có cặp nút ép thẳng 1 dòng: [Chuyển Bước ➡️] và [🔍 QC]       |
|                                                                                   |
|  3. BẤM [🔍 QC] TRÊN BẢCH KANBAN ---> Mở QcModal                                  |
|     - Nhập Số sản phẩm kiểm tra & Số lỗi phát sinh                                |
|     - Tự động tính Tỷ lệ lỗi (%) = (Số lỗi / Tổng kiểm tra) * 100                 |
|     - Nếu Tỷ lệ lỗi > 3% ---> Nổi Toast ĐỎ khẩn cấp trên màn hình Web              |
|                                                                                   |
|  4. TAB [QUẢN LÝ ĐƠN HÀNG] & [BÁO CÁO KPI]                                        |
|     - Tìm kiếm nhanh theo mã đơn, khách hàng, tên SP                              |
|     - Phân trang linh hoạt: Chọn 5, 10, 20, 50 đơn/trang                           |
|     - Bấm xem chi tiết ---> Mở OrderDetailModal xem Bảng Lịch Sử 6 Công Đoạn       |
+-----------------------------------------------------------------------------------+
```

---

## IV. CÁC ĐIỂM TỐI ƯU TRẢI NGHIỆM VÀ KỸ THUẬT FRONTEND (UX HIGHLIGHTS)

1. **Giao Diện Nút Bấm 1 Dòng (`white-space: nowrap`)**:
   - Cặp nút bấm **`[ Chuyển Bước ➡️ ]`** và **`[ 🔍 QC ]`** trên từng thẻ mẻ gốm được cân chỉnh tỷ lệ phẳng đẹp, không bao giờ bị rớt dòng chữ hay đè nén icon.
2. **Auto-Sync Số Lượng Từ Văn Bản Tự Nhiên**:
   - Khi người dùng nhập mô tả đơn hàng (Ví dụ: *"Đơn 500 Bộ ấm trà tử sa..."*), hệ thống tự động trích xuất con số `500` và cập nhật trực tiếp vào ô *Số Lượng Sản Phẩm*, giảm bớt thao tác gõ tay.
3. **Reset Trạng Thái Modal Chuẩn Xác**:
   - Khi bấm đóng Popup tiếp nhận đơn hàng, hệ thống tự động làm sạch `lastAiResult = null` và xóa trắng các ô nhập liệu, đảm bảo lần mở tạo đơn tiếp theo luôn sẵn sàng 100%.
4. **Tự Động Đồng Bộ Cập Nhật Thời Gian Thực (Auto Polling)**:
   - `App.jsx` tự động thực hiện truy vấn làm mới dữ liệu Bảng Kanban định kỳ mỗi 8 giây. Khi thợ xác nhận tiến độ trên Slack/Zalo, Bảng Kanban trên Web lập tức cập nhật mẻ gốm sang cột mới.

---

## V. HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY DỰ ÁN FRONTEND (SETUP GUIDE)

### Yêu Cầu Môi Trường Máy Trạm
- Node.js phiên bản 18.0 trở lên.
- Trình quản lý gói `npm` (đi kèm sẵn với Node.js).
- Dịch vụ Backend Spring Boot đang khởi chạy tại địa chỉ `http://localhost:8080`.

### 1. Di Chuyển Vào Thư Mục Frontend
Mở cửa sổ dòng lệnh (Terminal / PowerShell) và di chuyển vào thư mục giao diện web:
```bash
cd ceramics-frontend
```

### 2. Cài Đặt Các Thư Viện Phụ Thuộc (Dependencies)
Chạy lệnh `npm install` để tải toàn bộ các thư viện React, Vite, Axios, Bootstrap 5, FontAwesome...:
```bash
npm install
```

### 3. Khởi Chạy Web Ở Chế Độ Phát Triển (Development Mode)
Thực hiện lệnh khởi chạy máy chủ phát triển Vite:
```bash
npm run dev
```
Sau khi lệnh thực thi thành công, trình duyệt web sẽ mở tại địa chỉ: `http://localhost:5173`

### 4. Đóng Gói Sản Phẩm (Production Build)
Khi cần biên dịch ứng dụng để đưa lên máy chủ thực tế:
```bash
npm run build
```
Sản phẩm đóng gói biên dịch hoàn chỉnh sẽ được tạo ra trong thư mục `dist/`.
