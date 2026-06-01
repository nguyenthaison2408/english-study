import React, { useState, useMemo } from "react";
import WordsList from "./WordsList";
import vocabData from '../../data/toeic_vocab.json'; // Đảm bảo đường dẫn đúng tới file json của bạn
import "./VocabDetail.scss";

// --- KHAI BÁO DANH SÁCH CHỦ ĐỀ (STATIC DATA) ---
const BASIC_TOPICS = [
  "Biển & Đại Dương",
  "Trường Học & Giáo Dục",
  "Động Vật & Tự Nhiên",
  "Quần Áo & Thời Trang",
  "Giao Thông & Đường Phố",
  "Thể Thao & Thi Đấu",
  "Cơ Thể & Sức Khỏe",
  "Gia Đình & Mối Quan Hệ"
];

const TOEIC_TOPICS = [
  "Hợp Đồng",
  "Kế Hoạch Kinh Doanh",
  "Các Quy Trình Trong Công Sở",
  "Hội Nghị",
  "Thị Trường",
  "Sự Bảo Hành",
  "Ẩm Thực & Ăn Uống",
  "Công Nghệ Cho Công Sở",
  "Nhà Cửa & Kiến Trúc",
  "Máy Vi Tính",
  "Chủ đề khác"
];

export default function VocabDetail({ topic, onBack }) {
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Xử lý logic lọc và nhóm dữ liệu
  const lessons = useMemo(() => {
    // 1. Xác định bộ chủ đề dựa trên title từ trang chủ
    let allowedTopics = [];
    if (topic.title === "Tiếng Anh Cơ Bản") {
      allowedTopics = BASIC_TOPICS;
    } else if (topic.title === "Tiếng Anh Toeic") {
      allowedTopics = TOEIC_TOPICS;
    } else {
      // Mặc định gộp cả hai nếu không khớp (hoặc cho các bộ khác)
      allowedTopics = [...BASIC_TOPICS, ...TOEIC_TOPICS]; 
    }

    const groups = {};
    
    vocabData.forEach(item => {
      const topicName = item.topic || "Chủ đề khác";

      // 2. Chỉ lấy các từ thuộc chủ đề cho phép
      if (allowedTopics.includes(topicName)) {
        
        if (!groups[topicName]) {
          groups[topicName] = {
            id: Object.keys(groups).length + 1,
            title: topicName,
            icon: getIcon(topicName),
            learned: 0, 
            total: 0,
            review: 0,
            words: []
          };
        }
        
        groups[topicName].total++;
        
        // 3. Đẩy dữ liệu vào mảng words
        groups[topicName].words.push({
          ...item, // <--- QUAN TRỌNG: Copy toàn bộ thuộc tính gốc (phonetic, image, meanings...) để Modal dùng
          id: groups[topicName].words.length + 1,
          // Các trường phụ trợ để hiển thị list bên ngoài cho nhanh
          type: item.meanings[0]?.partOfSpeech || "noun",
          meaning: item.meanings[0]?.meaning_vi || ""
        });
      }
    });

    return Object.values(groups);
  }, [topic]);

  // Hàm lấy icon emoji
  function getIcon(topicName) {
    const map = {
      "Hợp Đồng": "📝", "Thị Trường": "📈", "Sự Bảo Hành": "🛡️", "Kế Hoạch Kinh Doanh": "📊",
      "Hội Nghị": "🤝", "Máy Vi Tính": "💻", "Công Nghệ Cho Công Sở": "🖨️", "Các Quy Trình Trong Công Sở": "📋",
      "Cơ Thể & Sức Khỏe": "🏥", "Động Vật & Tự Nhiên": "🌿", "Quần Áo & Thời Trang": "👗", "Ẩm Thực & Ăn Uống": "🍔",
      "Nhà Cửa & Kiến Trúc": "🏠", "Trường Học & Giáo Dục": "🎓", "Biển & Đại Dương": "🌊", "Giao Thông & Đường Phố": "🚦",
      "Gia Đình & Mối Quan Hệ": "👨‍👩‍👧", "Thể Thao & Thi Đấu": "⚽", "Chủ đề khác": "📚"
    };
    return map[topicName] || "📖";
  }

  // Nếu đã chọn bài học thì hiển thị danh sách từ
  if (selectedLesson) {
    return <WordsList lesson={selectedLesson} onBack={() => setSelectedLesson(null)} />;
  }

  // Màn hình danh sách các chủ đề (Grid)
  return (
    <div className="vocab-detail-container">
      <div className="top-nav">
        <button onClick={onBack} className="back-link">← Quay lại thư viện</button>
        <span className="current-topic-title" style={{marginLeft: '15px', fontWeight: 'bold', color: '#555'}}>
          {topic.title}
        </span>
      </div>

      <div className="lessons-grid">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <div key={lesson.id} className="lesson-item" onClick={() => setSelectedLesson(lesson)}>
              <div className="icon-circle">
                <span className="emoji-icon">{lesson.icon}</span>
              </div>
              <h3 className="lesson-title">{lesson.title}</h3>
              <div className="lesson-stats">
                <div className="stat-group check">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  <span>{lesson.learned}/{lesson.total}</span>
                </div>
                <div className="stat-group time">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                  <span>{lesson.review}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{gridColumn: "1/-1", textAlign: "center", padding: "20px"}}>
            <p>Không tìm thấy chủ đề nào cho mục này.</p>
          </div>
        )}
      </div>

      <div className="footer-action">
        <button className="btn-learn-new">
          <span className="btn-icon">cards</span> Học từ mới
        </button>
      </div>
    </div>
  );
}