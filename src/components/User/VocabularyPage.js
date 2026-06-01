import React, { useCallback, useEffect, useState } from "react";
import "./VocabularyPage.scss";
import VocabularyModal from "./VocabularyModal";
import { useAuth } from "../../hooks/useAuth";
import { useVoc } from "../../hooks/useVoc";
import { toast } from "react-toastify";
import PracticePage from "./learnVocal/PracticePage";
// 1. Thêm useNavigate vào import
import { useLocation, useNavigate } from "react-router-dom"; 

const VocabularyPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { voc, loading, error, getAllVoc } = useVoc();
  const [selectedWord, setSelectedWord] = useState(null);
  const [showPractice, setShowPractice] = useState(false);
  const [isLearned, setIsLearned] = useState(false);

  // 2. Khởi tạo navigate
  const navigate = useNavigate(); 
  const location = useLocation();
  const { level, lesson } = location.state || {};

  const [filteredVoc, setFilteredVoc] = useState([]);

  useEffect(() => {
    loadVocabularies();
  }, []);

  const loadVocabularies = async () => {
    const result = await getAllVoc();
    if (!result.success && result.error) {
      toast.error(result.error);
    }
  };

  useEffect(() => {
    if (voc.length > 0 && level) {
      const filtered = voc.filter(item => item.level === level);
      setFilteredVoc(filtered);
    } else {
      setFilteredVoc(voc);
    }
  }, [voc, level]);

  return (
    <div className="vocab-page-container">
      {/* HEADER */}
      <header className="page-header">
        {/* 3. Thêm sự kiện onClick để quay lại trang trước */}
        <button className="btn-back" onClick={() => navigate(-1)}>❮</button>
        
        <div className="header-info">
          <div className="icon-header">📚</div>
          <div className="header-text">
            <h2>Từ Vựng </h2>
            <div className="progress-badge">
              <span>
                ✔ {filteredVoc.filter(item => item.isLearned).length}/{filteredVoc.length} từ
              </span>
              <span>
                ◐ {filteredVoc.filter(item => !item.isLearned).length} cần học
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Thông báo lỗi */}
      {error && (
        <div className="error-alert">
          <i className="fa-solid fa-triangle-exclamation"></i>
          <span>{error}</span>
        </div>
      )}

      {/* BODY */}
      <div className="vocab-body">
        {/* Loading Skeleton */}
        {loading && voc.length === 0 && (
          <div className="loading-skeleton">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton-word-card">
                <div className="sk-icon"></div>
                <div className="sk-content">
                  <div className="sk-word"></div>
                  <div className="sk-meaning"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DANH SÁCH TỪ */}
        <div className="word-grid">
          {!loading && voc.length === 0 ? (
            <div className="empty-state">
              <p>Chưa có từ vựng nào</p>
            </div>
          ) : (
            filteredVoc.map((item) => (
              <div 
                key={item._id} 
                className="word-card" 
                onClick={() => setSelectedWord(item)}
              >
                <div className="card-icon">
                  <div className="inner-icon">
                    <img 
                      src={item.image || `https://source.unsplash.com/featured/150x150/?${item.word}`} 
                      alt={item.word}
                      className="word-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '📚';
                      }}
                    />
                  </div>
                </div>
                <div className="card-content">
                  <div className="word-top">
                    <span className="word-text">{item.word}</span>
                  </div>
                </div>
                <div className="card-action">
                  <button 
                    className="btn-save"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success(`Đã lưu từ "${item.word}"`);
                    }}
                  >
                    💾
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* NÚT DƯỚI CÙNG */}
        <div className="bottom-action-bar">
          <button 
            className="btn-large btn-practice"
            onClick={() => setShowPractice(true)}
          >
            🔥 Luyện tập
          </button>
        </div>
      </div>

      {/* POPUP */}
      {selectedWord && (
        <VocabularyModal 
          word={selectedWord} 
          wordId={selectedWord._id} 
          onClose={() => setSelectedWord(null)} 
        />
      )}

      {showPractice && (
        <PracticePage
          words={filteredVoc}     
          level={level}
          lesson={lesson}
          onClose={() => setShowPractice(false)}
        />
      )}   
    </div>
  );
};

export default VocabularyPage;