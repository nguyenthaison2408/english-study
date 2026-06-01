import React from 'react';
import { FaArrowLeft, FaClock, FaListUl, FaCrown } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './Part1Page.scss';

const Part1Page = () => {
  const navigate = useNavigate(); // Hook chuyển trang

  const lessons = Array.from({ length: 12 }, (_, i) => {
    const id = i + 1;
    return {
      id: id,
      name: `Photographs ${String(id).padStart(2, '0')}`,
      isPro: id >= 4, 
      format: "2025 Format",
      status: "Chưa làm"
    };
  });

  // Hàm xử lý khi click vào bài học
  const handleLessonClick = (lessonId) => {
      console.log("Click bài số:", lessonId); // Kiểm tra log
      navigate(`/part1/detail/${lessonId}`);
  };

  return (
    <div className="part1-page">
      <div className="part1-header">
        <div className="header-content">
          <Link to="/toeic-prep" className="back-btn">
            <FaArrowLeft />
          </Link>
          <h1 className="header-title">Part 1</h1>
        </div>
      </div>

      <div className="part1-container">
        <div className="part1-grid">
          {lessons.map((lesson) => (
            <div 
                key={lesson.id} 
                className="lesson-card"
                // Sự kiện click ở đây
                onClick={() => handleLessonClick(lesson.id)}
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

export default Part1Page;