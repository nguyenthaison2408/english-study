import React from 'react';
import logo from '../../assets/logo5.png'; 

const VocabModal = ({ word, onClose }) => {
  if (!word) return null;
  const { word: term, phonetic, meanings } = word;

  return (
    // 1. CONTAINER CHÍNH: Dùng Flexbox để căn giữa tuyệt đối
    <div 
        className="modal fade show" 
        style={{ 
            display: 'flex',           
            alignItems: 'center',      /* Căn giữa chiều dọc */
            justifyContent: 'center',  /* Căn giữa chiều ngang */
            backgroundColor: 'rgba(0,0,0,0.5)', 
            zIndex: 1050,
            padding: 0 /* Xóa padding mặc định của bootstrap modal nếu có */
        }} 
        tabIndex="-1"
    >
      
      {/* --- CSS STYLE GIỮ NGUYÊN NHƯ CŨ --- */}
      <style>{`
        .example-en {
            display: flex;
            align-items: center; 
            gap: 10px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 4px;
            line-height: 1.5;
            text-align: left;
        }
        .example-en::before {
            content: '';
            display: block;
            width: 6px;
            height: 6px;
            background-color: #2c3e50;
            border-radius: 50%;
            flex-shrink: 0;
        }
        .example-vn {
            color: #666;
            font-style: italic;
            padding-left: 16px;
            margin-bottom: 0;
            text-align: left;
        }
      `}</style>

      {/* 2. MODAL DIALOG: Xóa margin để không bị lệch khỏi tâm */}
      <div 
        className="modal-dialog modal-lg modal-dialog-scrollable" 
        style={{ 
            margin: 0,         /* BẮT BUỘC: Xóa margin mặc định của Bootstrap */
            maxWidth: '800px', /* Giới hạn chiều rộng tối đa cho đẹp */
            width: '90%',      /* Trên mobile thì lấy 90% màn hình */
            maxHeight: '90vh',  /* Giới hạn chiều cao để không bị tràn màn hình */
            marginLeft: '450px',
        }} 
      >
        <div className="modal-content rounded-4 shadow-lg" style={{ maxHeight: '100%' }}>
          
          {/* Header */}
          <div className="modal-header bg-primary text-white">
            <h3 className="modal-title fw-bold text-uppercase">{term}</h3>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            
            {/* Phiên âm */}
            <div className="d-flex gap-3 mb-4 flex-wrap">
              {phonetic?.us && <span className="badge bg-success fs-6 px-3 py-2">US {phonetic.us}</span>}
              {phonetic?.uk && <span className="badge bg-info fs-6 px-3 py-2">UK {phonetic.uk}</span>}
            </div>

            {/* Ảnh */}
            <div className="text-center mb-4">
              <div className="bg-light border rounded-3 p-3 d-inline-block w-100">
                {word.image && (
                  <div className="text-center mb-3">
                    <img
                      rc={word.image === "logo" ? logo : word.image}
                      alt={term}
                      className="img-fluid rounded"
                      style={{ maxHeight: "250px", objectFit: "contain" }}
                      onError={(e) => {e.target.onerror = null; e.target.src = logo}}
                    />
                  </div>
                )}
                <div className="text-muted mt-2 fst-italic"><small>Ảnh minh họa cho "{term}"</small></div>
              </div>
            </div>

            {/* Nghĩa & Ví dụ */}
            {meanings && meanings.map((m, idx) => (
              <div key={idx} className="mb-4 pb-3 border-bottom">
                <h5 className="text-primary fw-bold text-capitalize mb-2">• {m.partOfSpeech}</h5>

                <ol className="ps-4 mb-3">
                  {m.meaning_vi?.split(', ').map((vi, i) => (
                    <li key={i} className="mb-2 fs-5"><strong>{vi}</strong></li>
                  ))}
                </ol>

                <p className="text-muted fst-italic mb-3 ms-3 border-start ps-2 border-3 border-secondary">
                  Definition: {m.definition_en}
                </p>

                {/* Phần ví dụ */}
                {m.examples && m.examples.length > 0 && (
                  <div className="bg-light rounded p-3 mb-3 ms-2">
                    <strong className="text-success d-block mb-3">Ví dụ:</strong>
                    {m.examples.map((ex, i) => (
                      <div key={i} className="mb-3">
                        <div className="example-en">{ex.en}</div>
                        <div className="example-vn">{ex.vi}</div>
                      </div>
                    ))}
                  </div>
                )}

                {m.synonyms && m.synonyms.length > 0 && (
                  <p className="ms-2">
                    <strong className="text-warning">Từ đồng nghĩa: </strong>
                    <span className="text-muted fst-italic">{m.synonyms.join(', ')}</span>
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabModal;