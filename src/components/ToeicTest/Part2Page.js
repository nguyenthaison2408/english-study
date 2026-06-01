import React from 'react';
import { FaArrowLeft, FaClock, FaListUl, FaCrown } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import './Part2Page.scss';

const Part2Page = () => {
  const navigate = useNavigate(); // Hook chuyển trang

  const lessons = Array.from({ length: 12 }, (_, i) => {
    const id = i + 1;
    return {
      id: id,
      name: `Question & Response ${String(id).padStart(2, '0')}`,
      isPro: id >= 4, 
      format: "2025 Format",
      status: "Chưa làm"
    };
  });

  // Hàm chuyển sang trang làm bài chi tiết
  const handleLessonClick = (lessonId) => {
    navigate(`/part2/detail/${lessonId}`);
  };

  return (
    <div className="part2-page">
      {/* Header Xanh Lá */}
      <div className="part2-header">
        <div className="header-content">
          <Link to="/toeic-prep" className="back-btn">
            <FaArrowLeft />
          </Link>
          <h1 className="header-title">Part 2</h1>
        </div>
      </div>

      {/* Grid Danh Sách Bài Học */}
      <div className="part2-container">
        <div className="part2-grid">
          {lessons.map((lesson) => (
            <div 
                key={lesson.id} 
                className="lesson-card"
                onClick={() => handleLessonClick(lesson.id)} // Sự kiện Click
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

export default Part2Page;