import React from 'react';
import { FaArrowLeft, FaClock, FaListUl, FaCrown } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom';
import './Part6Page.scss'; // Link tới file SCSS của Part 6

const Part6Page = () => {
  const navigate = useNavigate();

  // Tạo dữ liệu giả lập 12 bài Text Completion
  const lessons = Array.from({ length: 12 }, (_, i) => {
    const id = i + 1;
    return {
      id: id,
      // Đổi tên thành Text Completion
      name: `Text Completion ${String(id).padStart(2, '0')}`,
      isPro: id >= 4, 
      format: "2025 Format",
      status: "Chưa làm"
    };
  });

  const handleLessonClick = (lessonId) => {
    // Chuyển hướng sang trang chi tiết Part 6
    navigate(`/part6/detail/${lessonId}`);
  };

  return (
    <div className="part6-page">
      {/* Header - Tôi sẽ dùng màu Teal cho Part 6 */}
      <div className="part6-header">
        <div className="header-content">
          <Link to="/toeic-prep" className="back-btn">
            <FaArrowLeft />
          </Link>
          <h1 className="header-title">Part 6: Text Completion</h1>
        </div>
      </div>

      <div className="part6-container">
        <div className="part6-grid">
          {lessons.map((lesson) => (
            <div 
                key={lesson.id} 
                className="lesson-card"
                onClick={() => handleLessonClick(lesson.id)}
                style={{ cursor: 'pointer' }}
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

export default Part6Page;