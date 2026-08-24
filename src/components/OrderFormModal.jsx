import React, { useState, useEffect } from 'react';

const DEFAULT_DESC = 'Đơn 200 Bình gốm họa tiết sen men lam cao 35cm, yêu cầu nung nhiệt độ cao 1280°C, hoàn thành gấp trong 5 ngày';
const DEFAULT_CUST = 'Công ty Xuất Nhập Khẩu Bát Tràng';

export default function OrderFormModal({ isOpen, onClose, onSubmit, isLoading, aiResult, onGoToKanban }) {
  const [description, setDescription] = useState(DEFAULT_DESC);
  const [customerName, setCustomerName] = useState(DEFAULT_CUST);
  const [quantity, setQuantity] = useState(200);

  useEffect(() => {
    if (isOpen && !aiResult) {
      setDescription(DEFAULT_DESC);
      setCustomerName(DEFAULT_CUST);
      setQuantity(200);
    }
  }, [isOpen, aiResult]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !customerName.trim()) return;

    onSubmit({
      rawDescription: description,
      customerName,
      quantity: Number(quantity) || 200,
      createdBy: 1,
    });
  };

  return (
    <div className="modal show d-block tab-modal-backdrop" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content modal-content-ceramic">
          
          {/* Header */}
          <div className="modal-header modal-header-ceramic">
            <h5 className="modal-title fw-bold brand-font text-dark d-flex align-items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-warning fs-4"></i>
              <span>Tiếp Nhận Đơn Hàng & Gemini AI Phân Tích Thông Số</span>
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={isLoading}></button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">Tên Khách Hàng / Đơn Vị Đặt Hàng</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nhập tên đại lý, nhà hàng hoặc khách hàng..."
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">
                  Yêu Cầu Đơn Hàng (Văn Bản Tự Nhiên Để Gemini AI Bóc Tách)
                </label>
                <textarea
                  className="form-control rounded-3"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập văn bản mô tả tự nhiên..."
                  required
                ></textarea>
                <small className="text-muted">
                  <i className="fa-solid fa-lightbulb me-1 text-warning"></i>
                  Gemini AI sẽ tự động phân tích loại men, nhiệt độ nung, ước tính lượng đất sét và độ ưu tiên.
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">Số Lượng Sản Phẩm (Chiếc)</label>
                <input
                  type="number"
                  className="form-control rounded-3"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  required
                />
              </div>

              {/* KẾT QUẢ BÓC TÁCH CỦA GEMINI AI - SHOW LÊN KHI AI PHÂN TÍCH XONG */}
              {aiResult && (
                <div className="ai-preview-box mt-4 border-success bg-success bg-opacity-10 p-3 rounded-3">
                  <h6 className="fw-bold text-success d-flex align-items-center gap-2 mb-3 fs-5">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>KẾT QUẢ GEMINI AI BÓC TÁCH THÔNG SỐ TỰ ĐỘNG:</span>
                  </h6>

                  <div className="row g-3 small">
                    <div className="col-6 col-md-4">
                      <div className="p-2 bg-white rounded border">
                        <small className="text-muted d-block">Tên sản phẩm:</small>
                        <strong className="text-dark fs-6">{aiResult.product_name || 'Bình gốm sứ'}</strong>
                      </div>
                    </div>

                    <div className="col-6 col-md-4">
                      <div className="p-2 bg-white rounded border">
                        <small className="text-muted d-block">Họa tiết trang trí:</small>
                        <strong className="text-dark">{aiResult.pattern || 'Hoa sen'}</strong>
                      </div>
                    </div>

                    <div className="col-6 col-md-4">
                      <div className="p-2 bg-white rounded border">
                        <small className="text-muted d-block">Loại men nung:</small>
                        <strong className="text-terracotta">{aiResult.glaze_type || 'Men lam'}</strong>
                      </div>
                    </div>

                    <div className="col-6 col-md-4">
                      <div className="p-2 bg-white rounded border">
                        <small className="text-muted d-block">Nhiệt độ nung lò:</small>
                        <strong className="text-danger fs-6">{aiResult.firing_temp_celsius || 1280}°C</strong>
                      </div>
                    </div>

                    <div className="col-6 col-md-4">
                      <div className="p-2 bg-white rounded border">
                        <small className="text-muted d-block">Thời gian nung:</small>
                        <strong className="text-dark">{aiResult.firing_duration_hours || 24} giờ</strong>
                      </div>
                    </div>

                    <div className="col-6 col-md-4">
                      <div className="p-2 bg-white rounded border">
                        <small className="text-muted d-block">Ước tính đất sét:</small>
                        <strong className="text-dark">{aiResult.estimated_clay_kg || 300} kg</strong>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="p-2 bg-white rounded border d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted me-2">Đánh giá AI:</small>
                          <span className="text-success fw-semibold">{aiResult.confidence_note || 'Trích xuất chính xác bởi Gemini AI'}</span>
                        </div>
                        <span className="badge bg-danger fs-6">ĐỘ ƯU TIÊN: {aiResult.priority_level || 'HIGH'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Buttons */}
            <div className="modal-footer border-top-0 px-4 pb-4">
              {aiResult ? (
                <>
                  <button type="button" className="btn btn-outline-secondary rounded-3 px-4" onClick={onClose}>
                    Đóng Modal
                  </button>
                  <button
                    type="button"
                    className="btn btn-success rounded-3 px-4 shadow-sm fw-bold"
                    onClick={() => {
                      onClose();
                      if (onGoToKanban) onGoToKanban();
                    }}
                  >
                    <i className="fa-solid fa-kanban-board me-2"></i>
                    Xem Bảng Kanban Quy Trình
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={onClose} disabled={isLoading}>
                    Hủy Bỏ
                  </button>

                  <button type="submit" className="btn btn-terracotta rounded-3 px-4 shadow-sm" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Gemini AI Đang Phân Tích...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane me-2"></i>
                        Gửi AI Phân Tích & Tạo Quy Trình
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
