import React from 'react';

export default function DashboardStats({ stats }) {
  if (!stats) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-2 text-muted">Đang tải dữ liệu thống kê xưởng gốm...</p>
      </div>
    );
  }

  const {
    totalOrders = 0,
    totalBatches = 0,
    activeBatches = 0,
    completedBatches = 0,
    onHoldBatches = 0,
    criticalAlerts = 0,
    overallPassRatePercent = 100,
    batchesPerStage = {},
  } = stats;

  return (
    <div className="w-100">
      
      {/* Banner Cảnh Báo Khẩn Cấp */}
      {criticalAlerts > 0 && (
        <div className="critical-alert-banner shadow-sm">
          <i className="fa-solid fa-triangle-exclamation fa-2x"></i>
          <div>
            <h6 className="fw-bold mb-1">CẢNH BÁO SỰ CỐ KHẨN CẤP XƯỞNG GỐM ({criticalAlerts} Sự cố)</h6>
            <p className="mb-0 small">
              Phát hiện công đoạn QC có mẻ gốm vượt ngưỡng lỗi 3%. Hệ thống đã tự động gửi cảnh báo khẩn cấp tới nhóm chat Slack / Zalo của Quản lý xưởng!
            </p>
          </div>
        </div>
      )}

      {/* 5 Thẻ KPI */}
      <div className="row g-3 mb-4">
        
        {/* Total Orders */}
        <div className="col">
          <div className="kpi-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-semibold">TỔNG ĐƠN HÀNG</small>
                <div className="kpi-value">{totalOrders}</div>
                <small className="text-muted">Đã tiếp nhận</small>
              </div>
              <div className="kpi-icon bg-clay">
                <i className="fa-solid fa-boxes-packing"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Active Batches */}
        <div className="col">
          <div className="kpi-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-semibold">ĐANG CHẾ TÁC</small>
                <div className="kpi-value text-warning">{activeBatches}</div>
                <small className="text-muted">Tại các trạm xưởng</small>
              </div>
              <div className="kpi-icon bg-fire">
                <i className="fa-solid fa-fire-burner"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Batches */}
        <div className="col">
          <div className="kpi-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-semibold">HOÀN THÀNH XUẤT XƯỞNG</small>
                <div className="kpi-value text-success">{completedBatches}</div>
                <small className="text-muted">Mẻ gốm thành phẩm</small>
              </div>
              <div className="kpi-icon bg-glaze">
                <i className="fa-solid fa-circle-check"></i>
              </div>
            </div>
          </div>
        </div>

        {/* QC Pass Rate */}
        <div className="col">
          <div className="kpi-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-semibold">TỶ LỆ ĐẠT QC</small>
                <div className="kpi-value text-primary">{overallPassRatePercent}%</div>
                <small className="text-muted">Tiêu chuẩn Bát Tràng</small>
              </div>
              <div className="kpi-icon bg-blue">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="col">
          <div className="kpi-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-semibold">SỰ CỐ CẢNH BÁO ĐỎ</small>
                <div className={`kpi-value ${criticalAlerts > 0 ? 'text-danger' : 'text-secondary'}`}>
                  {criticalAlerts}
                </div>
                <small className="text-muted">Gửi Slack / Zalo</small>
              </div>
              <div className="kpi-icon bg-red">
                <i className="fa-solid fa-bell"></i>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Phân Bổ Công Đoạn */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <h6 className="fw-bold mb-3 brand-font text-dark d-flex align-items-center gap-2 fs-5">
          <i className="fa-solid fa-layer-group text-warning"></i>
          <span>Phân Bổ Mẻ Gốm Tại 6 Trạm Công Đoạn Chế Tác</span>
        </h6>
        
        <div className="row g-3">
          {Object.entries(batchesPerStage).map(([stageName, count]) => (
            <div key={stageName} className="col">
              <div className="p-3 rounded-3 border border-light-subtle bg-light text-center h-100">
                <small className="text-muted d-block text-truncate fw-medium" title={stageName}>
                  {stageName}
                </small>
                <span className="fs-3 fw-bold text-dark">{count}</span>
                <small className="text-muted ms-1">mẻ</small>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
