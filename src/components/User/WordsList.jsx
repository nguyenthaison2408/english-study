import React, { useState } from "react";
import VocabModal from "./VocabModal"; // Import Modal
import "./WordsList.scss";

export default function WordsList({ lesson, onBack }) {
  // State lưu từ đang chọn để hiển thị Modal
  const [selectedWord, setSelectedWord] = useState(null);

  return (
    <div className="words-view">
      {/* Header */}
      <div className="words-header">
        <button onClick={onBack} className="back-arrow">←</button>
        <div className="header-icon">{lesson.icon}</div>
        <div className="header-info">
          <h2>{lesson.title}</h2>
          <div className="header-stats">
            <span className="stat">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              {lesson.learned}/{lesson.total} đã học
            </span>
            <span className="stat">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
              {lesson.review} cần luyện tập
            </span>
          </div>
        </div>
      </div>

      {/* Danh sách từ vựng */}
      <div className="words-list">
        {lesson.words.map((item) => (
          <div 
            key={item.id} 
            className="word-card"
            // SỰ KIỆN CLICK MỞ MODAL
            onClick={() => setSelectedWord(item)}
            style={{ cursor: "pointer" }}
          >
            <div className="word-icon">
              {/* Icon loa tượng trưng */}
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            </div>
            
            <div className="word-content">
              <h3 className="word-title">{item.word}</h3>
              <p className="word-detail">
                <span className="word-type">({item.type})</span> {item.meaning}
              </p>
            </div>
            
            {/* Nút Save (Dùng e.stopPropagation để không kích hoạt modal khi bấm nút này) */}
            <button 
              className="word-save-btn"
              onClick={(e) => {
                e.stopPropagation();
                // Logic lưu từ vựng của bạn ở đây
                console.log("Saved", item.word);
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
            </button>
          </div>
        ))}
      </div>

      {/* COMPONENT MODAL CHI TIẾT */}
      {selectedWord && (
        <VocabModal 
          word={selectedWord} 
          onClose={() => setSelectedWord(null)} 
        />
      )}
    </div>
  );
}