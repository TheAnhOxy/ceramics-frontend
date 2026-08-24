import React, { useState, useMemo } from 'react';

export default function OrderList({ orders = [], onSelectOrder }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 1. Lọc đơn hàng theo ô tìm kiếm
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter((order) => {
      const code = (order.orderCode || '').toLowerCase();
      const customer = (order.customerName || '').toLowerCase();
      const productName = (order.aiExtraction?.product_name || '').toLowerCase();
      return code.includes(term) || customer.includes(term) || productName.includes(term);
    });
  }, [orders, searchTerm]);

  // 2. Tính toán phân trang
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Đảm bảo currentPage không vượt quá totalPages khi lọc
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedOrders = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize;
    return filteredOrders.slice(startIndex, startIndex + pageSize);
  }, [filteredOrders, validCurrentPage, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
        <i className="fa-solid fa-folder-open fa-3x text-muted mb-3"></i>
        <h5 className="fw-bold text-dark">Chưa Có Đơn Hàng Nào</h5>
        <p className="text-muted">Nhấn nút "Tạo Đơn Hàng AI" ở góc trên để gửi yêu cầu cho AI bóc tách thông số.</p>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
      
      {/* Header & Thanh Tìm Kiếm / Phân Trang */}
      <div className="card-header bg-white p-4 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h5 className="fw-bold brand-font mb-0 text-dark d-flex align-items-center gap-2">
            <i className="fa-solid fa-boxes-packing text-warning"></i>
            <span>Danh Sách Đơn Hàng Xưởng Gốm Bát Tràng ({totalItems})</span>
          </h5>
          <small className="text-muted">Quản lý và theo dõi thông số đơn hàng bóc tách bởi Gemini AI</small>
        </div>

        <div className="d-flex align-items-center gap-3 flex-wrap">
          {/* Ô Tìm Kiếm */}
          <div className="input-group" style={{ width: '280px' }}>
            <span className="input-group-text bg-light border-end-0">
              <i className="fa-solid fa-magnifying-glass text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 bg-light rounded-end-3"
              placeholder="Tìm theo mã, khách hàng, SP..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset về trang 1 khi lọc
              }}
            />
          </div>

          {/* Chọn Số Lượng Hiển Thị Trên Trang */}
          <div className="d-flex align-items-center gap-2">
            <small className="text-muted fw-semibold">Hiển thị:</small>
            <select
              className="form-select form-select-sm rounded-3 fw-semibold"
              style={{ width: '75px' }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng Danh Sách Đơn Hàng */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="ps-4">Mã Đơn Hàng</th>
              <th>Khách Hàng</th>
              <th>Sản Phẩm (Gemini AI)</th>
              <th>Nhiệt Độ Nung</th>
              <th>Số Lượng</th>
              <th>Hạn Giao</th>
              <th>Trạng Thái</th>
              <th className="pe-4 text-end">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => {
                const ai = order.aiExtraction;
                return (
                  <tr key={order.id}>
                    <td className="ps-4 fw-bold text-terracotta">
                      #{order.orderCode}
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{order.customerName}</div>
                      <small className="text-muted">Tạo bởi: {order.createdByName || 'Quản lý xưởng'}</small>
                    </td>
                    <td>
                      <div className="fw-medium">{ai?.product_name || 'Bình gốm sứ'}</div>
                      <small className="text-muted">Men: {ai?.glaze_type || 'Men lam'}</small>
                    </td>
                    <td>
                      <span className="badge bg-warning text-dark fw-bold">
                        <i className="fa-solid fa-fire me-1"></i>
                        {ai?.firing_temp_celsius || 1280}°C
                      </span>
                    </td>
                    <td className="fw-bold text-dark">{order.quantity} sp</td>
                    <td>
                      <small className="text-muted">
                        <i className="fa-solid fa-calendar me-1"></i>
                        {order.deadlineDate}
                      </small>
                    </td>
                    <td>
                      <span className={`badge ${order.status === 'COMPLETED' ? 'bg-success' : 'bg-primary'}`}>
                        {order.status === 'COMPLETED' ? 'HOÀN THÀNH' : 'ĐANG SẢN XUẤT'}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button
                        className="btn btn-sm btn-outline-secondary rounded-3"
                        onClick={() => onSelectOrder(order)}
                      >
                        <i className="fa-solid fa-eye me-1"></i> Xem Chi Tiết
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  Không tìm thấy đơn hàng phù hợp với từ khóa "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Phân Trang (Pagination Controls) */}
      {totalItems > 0 && (
        <div className="card-footer bg-white p-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-2">
          
          <small className="text-muted">
            Hiển thị <strong>{Math.min((validCurrentPage - 1) * pageSize + 1, totalItems)}</strong> - <strong>{Math.min(validCurrentPage * pageSize, totalItems)}</strong> trên tổng số <strong>{totalItems}</strong> đơn hàng
          </small>

          <nav>
            <ul className="pagination pagination-sm mb-0 gap-1">
              
              {/* Trang Đầu & Trang Trước */}
              <li className={`page-item ${validCurrentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-item-btn btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(1)}>
                  <i className="fa-solid fa-angles-left"></i>
                </button>
              </li>
              <li className={`page-item ${validCurrentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-item-btn btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(validCurrentPage - 1)}>
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
              </li>

              {/* Số Trang */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <li key={pageNum} className="page-item">
                  <button
                    className={`btn btn-sm ${pageNum === validCurrentPage ? 'btn-terracotta fw-bold' : 'btn-outline-secondary'}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                </li>
              ))}

              {/* Trang Sau & Trang Cuối */}
              <li className={`page-item ${validCurrentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-item-btn btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(validCurrentPage + 1)}>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </li>
              <li className={`page-item ${validCurrentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-item-btn btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(totalPages)}>
                  <i className="fa-solid fa-angles-right"></i>
                </button>
              </li>

            </ul>
          </nav>

        </div>
      )}

    </div>
  );
}
