import React from 'react';
import { FaArrowLeft, FaClock, FaListUl, FaCrown } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import './Part3Page.scss'; 

const Part3Page = () => {
  const navigate = useNavigate(); // 2. Khai báo hook

  // Tạo dữ liệu giả lập
  const lessons = Array.from({ length: 12 }, (_, i) => {
    const id = i + 1;
    return {
      id: id,
      name: `Short Conversations ${String(id).padStart(2, '0')}`, // Tên chuẩn Lingoland
      isPro: id >= 4, 
      format: "2025 Format",
      status: "Chưa làm"
    };
  });

  // 3. Hàm xử lý khi click vào bài học
  const handleLessonClick = (lessonId) => {
    navigate(`/part3/detail/${lessonId}`);
  };

  return (
    <div className="part3-page">
      {/* Header (Bạn có thể đổi màu background trong SCSS) */}
      <div className="part3-header">
        <div className="header-content">
          <Link to="/toeic-prep" className="back-btn">
            <FaArrowLeft />
          </Link>
          <h1 className="header-title">Part 3</h1>
        </div>
      </div>

      {/* Grid Danh Sách Bài Học */}
      <div className="part3-container">
        <div className="part3-grid">
          {lessons.map((lesson) => (
            <div 
                key={lesson.id} 
                className="lesson-card"
                // 4. Thêm sự kiện onClick vào đây
                onClick={() => handleLessonClick(lesson.id)}
                style={{ cursor: 'pointer' }} // Thêm con trỏ chuột
            >
              <div className="card-top">
                <h3 className="lesson-name">
                  {lesson.name}
                  {lesson.isPro && <FaCrown className="icon-crown" title="Premium" />}
                </h3>
                <FaClock className="icon-history" />
              </div>
              
              <div className="card-bottom">
                <span className="tag-format">{lesson.format}</span>
                <div className="status">
                  <FaListUl className="icon-list" />
                  <span>{lesson.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Part3Page;