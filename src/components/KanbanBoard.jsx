import React from 'react';

export default function KanbanBoard({ kanbanData, onOpenAdvanceModal, onOpenQcModal }) {
  if (!kanbanData || !kanbanData.columns) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-2 text-muted fw-medium">Đang tải dữ liệu quy trình xưởng gốm Bát Tràng...</p>
      </div>
    );
  }

  const getStageIcon = (code) => {
    switch (code) {
      case 'FORMING': return 'fa-shapes text-warning';
      case 'DRYING_TRIMMING': return 'fa-wind text-info';
      case 'PAINTING': return 'fa-palette text-primary';
      case 'GLAZING': return 'fa-droplet text-teal';
      case 'FIRING': return 'fa-fire-burner text-danger';
      case 'QC_PACKAGING': return 'fa-clipboard-check text-purple';
      case 'COMPLETED': return 'fa-flag-checkered text-success';
      default: return 'fa-cubes';
    }
  };

  return (
    <div className="kanban-wrapper">
      <div className="kanban-container">
        {kanbanData.columns.map((col) => (
          <div key={col.stageCode} className="kanban-col">
            
            {/* Header Cột */}
            <div className="kanban-col-header">
              <h6 className="kanban-col-title">
                <i className={`fa-solid ${getStageIcon(col.stageCode)} fs-5`}></i>
                <span>{col.stageName}</span>
              </h6>
              <span className="kanban-count-badge">{col.batches?.length || 0}</span>
            </div>

            {/* Danh Sách Mẻ Gốm */}
            <div className="kanban-col-body">
              {col.batches && col.batches.length > 0 ? (
                col.batches.map((batch) => (
                  <div key={batch.id} className="batch-card">
                    
                    {/* Mã Mẻ & Priority */}
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="batch-code">#{batch.batchCode}</span>
                      <span className={`priority-tag priority-${(batch.priorityLevel || 'NORMAL').toLowerCase()}`}>
                        {batch.priorityLevel || 'NORMAL'}
                      </span>
                    </div>

                    {/* Tên Sản Phẩm */}
                    <h6 className="batch-title">{batch.productName}</h6>
                    
                    <div className="batch-meta">
                      <span><i className="fa-solid fa-boxes-stacked me-1 text-terracotta"></i><strong>{batch.quantity}</strong> sp</span>
                      {batch.orderCode && (
                        <span className="text-truncate" style={{ maxWidth: '120px' }}>
                          <i className="fa-solid fa-receipt me-1"></i>{batch.orderCode}
                        </span>
                      )}
                    </div>

                    {/* Progress Step Bar (6 Công Đoạn) */}
                    <div className="mini-step-bar">
                      {[1, 2, 3, 4, 5, 6].map((seq) => {
                        const currentSeq = batch.currentStage?.sequenceOrder || 1;
                        let statusClass = '';
                        if (batch.status === 'COMPLETED' || seq < currentSeq) {
                          statusClass = 'completed';
                        } else if (seq === currentSeq) {
                          statusClass = 'in-progress';
                        }
                        return <div key={seq} className={`mini-step ${statusClass}`} />;
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2 mt-2">
                      {col.stageCode !== 'COMPLETED' && (
                        <button
                          className="btn btn-terracotta btn-sm flex-fill d-inline-flex align-items-center justify-content-center gap-1.5"
                          onClick={() => onOpenAdvanceModal(batch)}
                        >
                          <i className="fa-solid fa-arrow-right"></i>
                          <span>Chuyển Bước</span>
                        </button>
                      )}

                      {col.stageCode === 'QC_PACKAGING' && (
                        <button
                          className="btn btn-outline-danger btn-sm px-2.5 d-inline-flex align-items-center justify-content-center gap-1"
                          title="Nhập kết quả QC"
                          onClick={() => onOpenQcModal(batch)}
                        >
                          <i className="fa-solid fa-shield-cat"></i>
                          <span>QC</span>
                        </button>
                      )}
                    </div>

                  </div>
                ))
              ) : (
                <div className="text-center py-5 text-muted small border border-dashed rounded-3 bg-white bg-opacity-40">
                  <i className="fa-solid fa-box-open d-block fs-4 text-muted mb-2"></i>
                  Chưa có mẻ gốm ở bước này
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
