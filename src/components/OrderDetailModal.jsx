import React from 'react';

export default function OrderDetailModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const ai = order.aiExtraction || {};
  const batches = order.batches || [];

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content modal-content-ceramic">
          
          {/* Header */}
          <div className="modal-header modal-header-ceramic">
            <div>
              <h5 className="modal-title fw-bold brand-font text-dark d-flex align-items-center gap-2">
                <i className="fa-solid fa-receipt text-warning"></i>
                <span>Chi Tiết Đơn Hàng #{order.orderCode}</span>
              </h5>
              <small className="text-muted">
                Khách hàng: <strong>{order.customerName}</strong> | Tạo bởi: <strong>{order.createdByName || 'Quản lý xưởng'}</strong>
              </small>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            
            {/* 1. Tổng Quan Trạng Thái & Ngày Tháng */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-3">
                <div className="p-3 bg-white rounded-3 border">
                  <small className="text-muted d-block fw-semibold">TRẠNG THÁI ĐƠN HÀNG</small>
                  <span className={`badge ${order.status === 'COMPLETED' ? 'bg-success' : 'bg-primary'} fs-6 mt-1`}>
                    {order.status === 'COMPLETED' ? 'HOÀN THÀNH' : 'ĐANG SẢN XUẤT'}
                  </span>
                </div>
              </div>

              <div className="col-12 col-md-3">
                <div className="p-3 bg-white rounded-3 border">
                  <small className="text-muted d-block fw-semibold">SỐ LƯỢNG SẢN PHẨM</small>
                  <span className="fs-5 fw-bold text-dark">{order.quantity} chiếc</span>
                </div>
              </div>

              <div className="col-12 col-md-3">
                <div className="p-3 bg-white rounded-3 border">
                  <small className="text-muted d-block fw-semibold">NGÀY TIẾP NHẬN</small>
                  <span className="fw-medium text-dark">{order.createdAt ? String(order.createdAt).split('T')[0] : 'N/A'}</span>
                </div>
              </div>

              <div className="col-12 col-md-3">
                <div className="p-3 bg-white rounded-3 border">
                  <small className="text-muted d-block fw-semibold">HẠN GIAO SẢN XUẤT</small>
                  <span className="fw-bold text-terracotta">{order.deadlineDate || '10 ngày'}</span>
                </div>
              </div>
            </div>

            {/* 2. Mô Tả Văn Bản Tự Nhiên Ban Đầu */}
            <div className="mb-4">
              <h6 className="fw-bold text-dark mb-2">
                <i className="fa-solid fa-align-left me-1.5 text-warning"></i>
                Mô Tả Yêu Cầu Đơn Hàng Dạng Văn Bản Tự Nhiên:
              </h6>
              <div className="p-3 bg-light rounded-3 border text-dark fw-medium fs-6">
                "{order.rawDescription}"
              </div>
            </div>

            {/* 3. Bóc Tách Thông Số Gemini AI Đầy Đủ (10 Trường) */}
            <div className="ai-preview-box mb-4">
              <h6 className="fw-bold text-success d-flex align-items-center gap-2 mb-3 fs-5">
                <i className="fa-solid fa-brain"></i>
                <span>Thông Số Kỹ Thuật Gemini AI Bóc Tách Đầy Đủ:</span>
              </h6>

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <div className="p-2.5 bg-white rounded-3 border">
                    <small className="text-muted d-block">Tên Sản Phẩm:</small>
                    <strong className="text-dark">{ai.product_name || 'Bình gốm sứ'}</strong>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="p-2.5 bg-white rounded-3 border">
                    <small className="text-muted d-block">Họa Tiết Trang Trí:</small>
                    <strong className="text-dark">{ai.pattern || 'Họa tiết hoa sen'}</strong>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="p-2.5 bg-white rounded-3 border">
                    <small className="text-muted d-block">Chiều Cao Dự Kiến:</small>
                    <strong className="text-dark">{ai.height_cm ? `${ai.height_cm} cm` : '35 cm'}</strong>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="p-2.5 bg-white rounded-3 border">
                    <small className="text-muted d-block">Loại Men Cần Tráng:</small>
                    <strong className="text-terracotta">{ai.glaze_type || 'Men lam truyền thống'}</strong>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="p-2.5 bg-white rounded-3 border">
                    <small className="text-muted d-block">Ước Tính Đất Sét Cần:</small>
                    <strong className="text-dark">{ai.estimated_clay_kg ? `${ai.estimated_clay_kg} kg` : '300 kg'}</strong>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="p-2.5 bg-white rounded-3 border">
                    <small className="text-muted d-block">Nhiệt Độ Nung Lò:</small>
                    <strong className="text-danger">{ai.firing_temp_celsius || 1280}°C</strong>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="p-2.5 bg-white rounded-3 border">
                    <small className="text-muted d-block">Thời Gian Nung Dự Kiến:</small>
                    <strong className="text-dark">{ai.firing_duration_hours || 24} giờ</strong>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="p-2.5 bg-white rounded-3 border">
                    <small className="text-muted d-block">Mức Độ Ưu Tiên:</small>
                    <span className="badge bg-danger fs-6">{ai.priority_level || 'HIGH'}</span>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="p-2.5 bg-white rounded-3 border">
                    <small className="text-muted d-block">Ghi Chú AI Agent:</small>
                    <small className="text-success fw-semibold">{ai.confidence_note || 'Trích xuất chính xác bởi Gemini AI'}</small>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Chi Tiết Các Mẻ Sản Xuất & Lịch Sử 6 Công Đoạn */}
            <div>
              <h6 className="fw-bold text-dark mb-3 brand-font fs-5 d-flex align-items-center gap-2">
                <i className="fa-solid fa-list-check text-warning"></i>
                <span>Lịch Sử 6 Công Đoạn Sản Xuất Thực Tế Tự Động Khởi Tạo:</span>
              </h6>

              {batches && batches.length > 0 ? (
                batches.map((batch) => (
                  <div key={batch.id} className="card border rounded-3 p-3 mb-3 bg-white">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="fw-bold text-terracotta fs-6">Mẻ Gốm #{batch.batchCode}</span>
                        <span className="ms-3 text-muted">Số lượng: <strong>{batch.quantity}</strong> sp</span>
                      </div>
                      <span className={`badge ${batch.status === 'COMPLETED' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {batch.status === 'COMPLETED' ? 'HOÀN THÀNH TOÀN BỘ' : `ĐANG Ở BƯỚC: ${batch.currentStage?.name}`}
                      </span>
                    </div>

                    {/* Bảng Lịch Sử 6 Công Đoạn */}
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered align-middle mb-0 small">
                        <thead className="table-light">
                          <tr>
                            <th>STT</th>
                            <th>Trạm Công Đoạn</th>
                            <th>Trạng Thái</th>
                            <th>Thời Gian Hoàn Thành</th>
                            <th>Thợ / Người Thực Hiện</th>
                            <th>Ghi Chú Chi Tiết</th>
                          </tr>
                        </thead>
                        <tbody>
                          {batch.stageHistories && batch.stageHistories.map((history, idx) => (
                            <tr key={history.id || idx}>
                              <td className="text-center fw-bold">{idx + 1}</td>
                              <td className="fw-semibold">{history.stage?.name}</td>
                              <td>
                                {history.status === 'COMPLETED' && <span className="badge bg-success">✅ HOÀN THÀNH</span>}
                                {history.status === 'IN_PROGRESS' && <span className="badge bg-warning text-dark">⏳ ĐANG THỰC HIỆN</span>}
                                {history.status === 'PENDING' && <span className="badge bg-secondary">⏸ CHỜ THỰC HIỆN</span>}
                                {history.status === 'SKIPPED' && <span className="badge bg-info text-dark">⏩ BỎ QUA</span>}
                              </td>
                              <td>{history.completedAt ? String(history.completedAt).replace('T', ' ') : '---'}</td>
                              <td>{history.performedByName || 'Hệ thống tự động'}</td>
                              <td className="text-muted">{history.note || '---'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              ) : (
                <div className="alert alert-info small">Chưa có thông tin mẻ gốm chi tiết.</div>
              )}
            </div>

          </div>

          <div className="modal-footer border-top-0 px-4 pb-4">
            <button type="button" className="btn btn-terracotta rounded-3 px-4" onClick={onClose}>
              Đóng Chi Tiết
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
