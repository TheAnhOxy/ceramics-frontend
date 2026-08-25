import React from 'react';

export default function Navbar({ activeTab, setActiveTab, isConnected, onOpenCreateModal }) {
  return (
    <nav className="ceramic-navbar sticky-top">
      <div className="container-fluid px-2 px-md-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
        
        {/* Brand Logo */}
        <a href="#home" onClick={() => setActiveTab('kanban')} className="ceramic-brand">
          <i className="fa-solid fa-fire-burner text-warning fs-3"></i>
          <div>
            <span className="brand-font d-block leading-none">Xưởng Gốm Bát Tràng</span>
            <small className="text-white-50 fw-normal fs-7">Hệ Thống Điều Phối Sản Xuất</small>
          </div>
          <span className="ceramic-brand-badge ms-2">
            <i className="fa-solid fa-robot me-1"></i>AI Engine
          </span>
        </a>

        {/* Navigation Tabs */}
        <div className="d-flex align-items-center gap-1 bg-white bg-opacity-10 p-1 rounded-3">
          <button
            className={`nav-link-custom border-0 bg-transparent ${activeTab === 'kanban' ? 'active' : ''}`}
            onClick={() => setActiveTab('kanban')}
          >
            <i className="fa-solid fa-kanban-board"></i>
            <span>Bảng Kanban Quy Trình</span>
          </button>

          <button
            className={`nav-link-custom border-0 bg-transparent ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="fa-solid fa-chart-pie"></i>
            <span>Báo Cáo & KPI</span>
          </button>

          <button
            className={`nav-link-custom border-0 bg-transparent ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fa-solid fa-boxes-packing"></i>
            <span>Quản Lý Đơn Hàng</span>
          </button>
        </div>

        {/* Action Button & Status */}
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2 bg-black bg-opacity-30 px-3 py-1.5 rounded-pill border border-white border-opacity-10">
            <span
              className={`spinner-grow spinner-grow-sm ${isConnected ? 'text-success' : 'text-danger'}`}
              role="status"
            ></span>
            <small className="text-light fw-semibold">
              {isConnected ? 'Hệ Thống Sẵn Sàng' : 'Mất Kết Nối Server'}
            </small>
          </div>

          <button
            className="btn btn-terracotta shadow-sm d-inline-flex align-items-center gap-2 px-3 py-2"
            onClick={onOpenCreateModal}
          >
            <i className="fa-solid fa-wand-magic-sparkles text-warning fs-5"></i>
            <span className="fw-bold">Tạo Đơn Hàng AI</span>
          </button>
        </div>

      </div>
    </nav>
  );
}
