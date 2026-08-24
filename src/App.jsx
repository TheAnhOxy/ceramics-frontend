import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ceramicsApi } from './services/api';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import KanbanBoard from './components/KanbanBoard';
import OrderFormModal from './components/OrderFormModal';
import AdvanceStageModal from './components/AdvanceStageModal';
import QcModal from './components/QcModal';
import OrderList from './components/OrderList';
import OrderDetailModal from './components/OrderDetailModal';
import './styles/ceramic.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban', 'dashboard', 'orders'
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // States Dữ Liệu
  const [stats, setStats] = useState(null);
  const [kanbanData, setKanbanData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [lastAiResult, setLastAiResult] = useState(null);

  // States Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedBatchForAdvance, setSelectedBatchForAdvance] = useState(null);
  const [selectedBatchForQc, setSelectedBatchForQc] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  // Tải dữ liệu từ Backend
  const loadData = useCallback(async () => {
    try {
      const [statsRes, kanbanRes, ordersRes] = await Promise.all([
        ceramicsApi.getDashboardStats(),
        ceramicsApi.getKanbanBoard(),
        ceramicsApi.getAllOrders(),
      ]);

      setStats(statsRes.data);
      setKanbanData(kanbanRes.data);
      setOrders(ordersRes.data || []);
      setIsConnected(true);
    } catch (error) {
      console.error('Lỗi kết nối Backend:', error);
      setIsConnected(false);
    }
  }, []);

  // Polling tự động làm mới dữ liệu realtime mỗi 8 giây
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Handler: Tạo đơn hàng mới & Phân tích Gemini AI
  const handleCreateOrder = async (orderPayload) => {
    setIsLoading(true);
    setLastAiResult(null);
    try {
      const res = await ceramicsApi.createOrder(orderPayload);
      toast.success('🎉 Tiếp nhận đơn hàng và Gemini AI bóc tách thông số thành công!', { duration: 4000 });
      setLastAiResult(res.data?.aiExtraction);
      loadData();
      // Không tự đóng modal để người dùng xem kết quả bóc tách ngay tại Popup!
    } catch (error) {
      toast.error(error.message || 'Lỗi khi tạo đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Chuyển công đoạn mẻ gốm
  const handleAdvanceStage = async (batchId, advancePayload) => {
    setIsLoading(true);
    try {
      const res = await ceramicsApi.advanceBatchStage(batchId, advancePayload);
      toast.success(`✅ Mẻ gốm #${res.data?.batchCode} đã chuyển sang công đoạn: ${res.data?.currentStage?.name || 'Hoàn thành'}`);
      setSelectedBatchForAdvance(null);
      loadData();
    } catch (error) {
      toast.error(error.message || 'Lỗi khi chuyển công đoạn');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Kiểm định QC
  const handleRecordQc = async (qcPayload) => {
    setIsLoading(true);
    try {
      const res = await ceramicsApi.recordQc(qcPayload);
      if (res.data?.isCritical) {
        toast.error(`🚨 CẢNH BÁO ĐỎ! Mẻ gốm lỗi ${res.data?.defectRatePercent}% vượt 3%. Đã bắn cảnh báo tới Slack/Zalo!`, {
          duration: 6000,
        });
      } else {
        toast.success(`✅ Ghi nhận QC thành công! Tỷ lệ đạt ${100 - res.data?.defectRatePercent}%`);
      }
      setSelectedBatchForQc(null);
      loadData();
    } catch (error) {
      toast.error(error.message || 'Lỗi khi lưu QC');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-100 min-vh-100 d-flex flex-column">
      {/* Toast Notification */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isConnected={isConnected}
        onOpenCreateModal={() => {
          setLastAiResult(null);
          setIsOrderModalOpen(true);
        }}
      />

      {/* Main Full-Width Content Container */}
      <div className="container-fluid px-3 px-md-4 px-xl-5 py-4 flex-grow-1 w-100">
        
        {/* TAB 1: BẢNG KANBAN TIẾN ĐỘ SẢN XUẤT */}
        {activeTab === 'kanban' && (
          <div className="w-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="fw-bold brand-font text-dark mb-0 fs-3">Bảng Kanban Tiến Độ Chế Tác Gốm Sứ Bát Tràng</h4>
                <p className="text-muted mb-0 small">
                  Theo dõi thời gian thực vị trí của từng mẻ gốm tại 6 trạm sản xuất liên hoàn
                </p>
              </div>
              <button
                className="btn btn-outline-secondary btn-sm rounded-3 d-inline-flex align-items-center gap-1.5 px-3 py-1.5"
                onClick={loadData}
              >
                <i className="fa-solid fa-arrows-rotate"></i>
                <span>Làm Mới Realtime</span>
              </button>
            </div>

            <KanbanBoard
              kanbanData={kanbanData}
              onOpenAdvanceModal={(batch) => setSelectedBatchForAdvance(batch)}
              onOpenQcModal={(batch) => setSelectedBatchForQc(batch)}
            />
          </div>
        )}

        {/* TAB 2: DASHBOARD THỐNG KÊ & BÁO CÁO KPI */}
        {activeTab === 'dashboard' && (
          <div className="w-100">
            <div className="mb-4">
              <h4 className="fw-bold brand-font text-dark mb-0 fs-3">Báo Cáo Bán Hàng & KPI Xưởng Gốm</h4>
              <p className="text-muted mb-0 small">
                Thống kê tổng thể đơn hàng, công suất chế tác và theo dõi cảnh báo khẩn cấp QC
              </p>
            </div>

            <DashboardStats stats={stats} />
          </div>
        )}

        {/* TAB 3: QUẢN LÝ ĐƠN HÀNG */}
        {activeTab === 'orders' && (
          <div className="w-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold brand-font text-dark mb-0 fs-3">Danh Sách Đơn Hàng & Thông Số Gemini AI</h4>
                <p className="text-muted mb-0 small">
                  Quản lý đơn hàng tiếp nhận và xem chi tiết thông số kỹ thuật AI bóc tách
                </p>
              </div>
              <button
                className="btn btn-terracotta rounded-3 px-3 py-2"
                onClick={() => setIsOrderModalOpen(true)}
              >
                <i className="fa-solid fa-plus me-1.5"></i> Tạo Đơn Hàng Mới
              </button>
            </div>

            <OrderList
              orders={orders}
              onSelectOrder={(order) => setSelectedOrderDetail(order)}
            />
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="bg-dark text-light py-3 text-center border-top border-secondary small w-100">
        <span>Xưởng Gốm Bát Tràng &copy; 2026 - Hệ Thống Điều Phối & Giám Sát Quy Trình Sản Xuất Tự Động Với AI</span>
      </footer>

      {/* Modals */}
      <OrderFormModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSubmit={handleCreateOrder}
        isLoading={isLoading}
        aiResult={lastAiResult}
        onGoToKanban={() => setActiveTab('kanban')}
      />

      <AdvanceStageModal
        isOpen={Boolean(selectedBatchForAdvance)}
        onClose={() => setSelectedBatchForAdvance(null)}
        batch={selectedBatchForAdvance}
        onSubmit={handleAdvanceStage}
        isLoading={isLoading}
      />

      <QcModal
        isOpen={Boolean(selectedBatchForQc)}
        onClose={() => setSelectedBatchForQc(null)}
        batch={selectedBatchForQc}
        onSubmit={handleRecordQc}
        isLoading={isLoading}
      />

      {/* Modal Xem Chi Tiết Đơn Hàng Đầy Đủ */}
      <OrderDetailModal
        isOpen={Boolean(selectedOrderDetail)}
        onClose={() => setSelectedOrderDetail(null)}
        order={selectedOrderDetail}
      />

    </div>
  );
}
