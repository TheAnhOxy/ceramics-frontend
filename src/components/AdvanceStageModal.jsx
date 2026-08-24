import React, { useState } from 'react';

export default function AdvanceStageModal({ isOpen, onClose, batch, onSubmit, isLoading }) {
  const [note, setNote] = useState('');
  const [performerId, setPerformerId] = useState(2);
  const [forceSkip, setForceSkip] = useState(false);

  if (!isOpen || !batch) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(batch.id, {
      performedBy: performerId,
      note: note || `Đã hoàn thành công đoạn ${batch.currentStage?.name}`,
      forceSkip,
    });
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content modal-content-ceramic">
          
          <div className="modal-header modal-header-ceramic">
            <h5 className="modal-title fw-bold brand-font text-dark d-flex align-items-center gap-2">
              <i className="fa-solid fa-right-to-bracket text-warning"></i>
              <span>Chuyển Công Đoạn Sản Xuất Mẻ Gốm #{batch.batchCode}</span>
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={isLoading}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              
              <div className="p-3 bg-light rounded-3 mb-3 border">
                <div className="small text-muted mb-1">Mẻ gốm: <strong>{batch.productName}</strong> ({batch.quantity} chiếc)</div>
                <div className="fw-bold text-dark">
                  Công đoạn hiện tại: <span className="text-warning">{batch.currentStage?.name}</span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">Thợ / Người Thực Hiện</label>
                <select
                  className="form-select rounded-3"
                  value={performerId}
                  onChange={(e) => setPerformerId(Number(e.target.value))}
                >
                  <option value={2}>Thợ Bát Tràng (Nguyễn Văn Thợ)</option>
                  <option value={1}>Quản Lý Xưởng (Trần Văn Quản Lý)</option>
                  <option value={3}>Kiểm Định Viên QC (Lê Thị QC)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">Ghi Chú Công Đoạn</label>
                <textarea
                  className="form-control rounded-3"
                  rows="2"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập tình trạng hoặc ghi chú khi chuyển bước..."
                ></textarea>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="forceSkipCheck"
                  checked={forceSkip}
                  onChange={(e) => setForceSkip(e.target.checked)}
                />
                <label className="form-check-label small text-muted" htmlFor="forceSkipCheck">
                  Bỏ qua công đoạn này (Chỉ dùng khi sản phẩm không cần vẽ/tráng men)
                </label>
              </div>

            </div>

            <div className="modal-footer border-top-0 px-4 pb-4">
              <button type="button" className="btn btn-light rounded-3 px-4" onClick={onClose} disabled={isLoading}>
                Hủy
              </button>
              <button type="submit" className="btn btn-terracotta rounded-3 px-4 shadow-sm" disabled={isLoading}>
                {isLoading ? 'Đang Xử Lý...' : 'Xác Nhận Chuyển Bước'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
