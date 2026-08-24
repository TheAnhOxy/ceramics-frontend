import React, { useState } from 'react';

export default function QcModal({ isOpen, onClose, batch, onSubmit, isLoading }) {
  const [totalChecked, setTotalChecked] = useState(batch?.quantity || 200);
  const [passedCount, setPassedCount] = useState(180);
  const [failedCount, setFailedCount] = useState(20);
  const [defectType, setDefectType] = useState('Nứt men do nhiệt độ lò tăng quá nhanh');
  const [defectNote, setDefectNote] = useState('Phát hiện rạn nứt chân chim ở đáy sản phẩm');

  if (!isOpen || !batch) return null;

  const defectRate = totalChecked > 0 ? (failedCount / totalChecked) * 100 : 0;
  const isCritical = defectRate > 3.0;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      batchId: batch.id,
      totalChecked: Number(totalChecked),
      passedCount: Number(passedCount),
      failedCount: Number(failedCount),
      defectType,
      defectNote,
      checkedBy: 3,
    });
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content modal-content-ceramic">
          
          <div className="modal-header modal-header-ceramic">
            <h5 className="modal-title fw-bold brand-font text-dark d-flex align-items-center gap-2">
              <i className="fa-solid fa-clipboard-check text-warning"></i>
              <span>Kiểm Định Chất Lượng (QC) - Mẻ Gốm #{batch.batchCode}</span>
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={isLoading}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              
              <div className="p-3 bg-light rounded-3 mb-3 border">
                <div className="fw-bold text-dark">{batch.productName}</div>
                <small className="text-muted">Tổng số lượng mẻ sản xuất: {batch.quantity} chiếc</small>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-4">
                  <label className="form-label fw-semibold text-dark">Tổng Kiểm Tra</label>
                  <input
                    type="number"
                    className="form-control rounded-3"
                    value={totalChecked}
                    onChange={(e) => setTotalChecked(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="col-4">
                  <label className="form-label fw-semibold text-success">Số Lượng Đạt</label>
                  <input
                    type="number"
                    className="form-control rounded-3 border-success"
                    value={passedCount}
                    onChange={(e) => setPassedCount(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="col-4">
                  <label className="form-label fw-semibold text-danger">Số Lượng Lỗi</label>
                  <input
                    type="number"
                    className="form-control rounded-3 border-danger"
                    value={failedCount}
                    onChange={(e) => setFailedCount(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              {/* Dynamic Defect Rate Banner */}
              <div className={`p-3 rounded-3 mb-3 border ${isCritical ? 'bg-danger bg-opacity-10 border-danger' : 'bg-success bg-opacity-10 border-success'}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold">Tỷ lệ sản phẩm lỗi: </span>
                    <span className={`fs-5 fw-extrabold ${isCritical ? 'text-danger' : 'text-success'}`}>
                      {defectRate.toFixed(2)}%
                    </span>
                  </div>
                  {isCritical ? (
                    <span className="badge bg-danger">🚨 KÍCH HOẠT CẢNH BÁO ĐỎ (&gt; 3%)</span>
                  ) : (
                    <span className="badge bg-success">✅ ĐẠT TIÊU CHUẨN (&le; 3%)</span>
                  )}
                </div>
                {isCritical && (
                  <small className="text-danger d-block mt-1">
                    <i className="fa-solid fa-triangle-exclamation me-1"></i>
                    Tỷ lệ lỗi vượt 3%! Hệ thống sẽ tự động bắn Cảnh Báo Đỏ Khẩn Cấp tới Slack & Zalo của Quản lý xưởng!
                  </small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">Loại Khuyết Tật / Lỗi Phát Hiện</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  value={defectType}
                  onChange={(e) => setDefectType(e.target.value)}
                  placeholder="Ví dụ: Nứt men, sứt mộc, lệch màu men..."
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">Mô Tả Nguyên Nhân Lỗi</label>
                <textarea
                  className="form-control rounded-3"
                  rows="2"
                  value={defectNote}
                  onChange={(e) => setDefectNote(e.target.value)}
                  placeholder="Mô tả chi tiết nguyên nhân sự cố..."
                ></textarea>
              </div>

            </div>

            <div className="modal-footer border-top-0 px-4 pb-4">
              <button type="button" className="btn btn-light rounded-3 px-4" onClick={onClose} disabled={isLoading}>
                Hủy
              </button>
              <button type="submit" className={`btn ${isCritical ? 'btn-danger' : 'btn-terracotta'} rounded-3 px-4 shadow-sm`} disabled={isLoading}>
                {isLoading ? 'Đang Ghi Nhận...' : 'Lưu Kiểm Định QC'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
