import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000, // 20s timeout cho Gemini AI extraction
});

// Interceptor xử lý response chung
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorResponse = error.response?.data || {
      status: 500,
      message: error.message || 'Không thể kết nối đến Backend Spring Boot (http://localhost:8080)',
      data: null,
    };
    return Promise.reject(errorResponse);
  }
);

export const ceramicsApi = {
  // 1. Tạo đơn hàng mới & Phân tích Gemini AI
  createOrder: (orderData) => {
    return apiClient.post('/orders', {
      rawDescription: orderData.rawDescription,
      customerName: orderData.customerName || 'Khách hàng xưởng gốm',
      quantity: Number(orderData.quantity) || 100,
      createdBy: orderData.createdBy || 1,
    });
  },

  // 2. Lấy danh sách tất cả đơn hàng
  getAllOrders: () => {
    return apiClient.get('/orders');
  },

  // 3. Lấy chi tiết đơn hàng theo ID
  getOrderById: (id) => {
    return apiClient.get(`/orders/${id}`);
  },

  // 4. Chuyển công đoạn mẻ gốm (Pipeline Engine)
  advanceBatchStage: (batchId, advanceData) => {
    return apiClient.patch(`/batches/${batchId}/advance`, {
      performedBy: advanceData?.performedBy || 2,
      note: advanceData?.note || 'Chuyển bước sản xuất',
      forceSkip: Boolean(advanceData?.forceSkip),
    });
  },

  // 5. Lấy chi tiết mẻ gốm
  getBatchById: (batchId) => {
    return apiClient.get(`/batches/${batchId}`);
  },

  // 6. Ghi nhận kiểm định QC & Phát Cảnh Báo Đỏ
  recordQc: (qcData) => {
    return apiClient.post('/qc', {
      batchId: Number(qcData.batchId),
      totalChecked: Number(qcData.totalChecked),
      passedCount: Number(qcData.passedCount),
      failedCount: Number(qcData.failedCount),
      defectType: qcData.defectType || 'Khuyết tật men / mộc',
      defectNote: qcData.defectNote || '',
      checkedBy: qcData.checkedBy || 3,
    });
  },

  // 7. Lấy báo cáo thống kê KPI Dashboard
  getDashboardStats: () => {
    return apiClient.get('/dashboard/stats');
  },

  // 8. Lấy bảng Kanban tiến độ realtime
  getKanbanBoard: () => {
    return apiClient.get('/dashboard/kanban');
  },
};

export default ceramicsApi;
