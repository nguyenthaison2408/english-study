import React from 'react';
import { FaArrowLeft, FaClock, FaListUl, FaCrown } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom';
import './Part7Page.scss'; 

const Part7Page = () => {
  const navigate = useNavigate();

  const lessons = Array.from({ length: 15 }, (_, i) => {
    const id = i + 1;
    return {
      id: id,
      name: `Reading Comprehension ${String(id).padStart(2, '0')}`,
      isPro: id >= 4, 
      format: "2025 Format",
      status: "Chưa làm"
    };
  });

  const handleLessonClick = (lessonId) => {
    navigate(`/part7/detail/${lessonId}`);
  };

  return (
    <div className="part7-page">
      {/* Header Màu Cam Đậm */}
      <div className="part7-header">
        <div className="header-content">
          <Link to="/toeic-prep" className="back-btn"><FaArrowLeft /></Link>
          <h1 className="header-title">Part 7: Reading Comprehension</h1>
        </div>
      </div>

      <div className="part7-container">
        <div className="part7-grid">
          {lessons.map((lesson) => (
            <div 
                key={lesson.id} 
                className="lesson-card"
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
                <div className="status"><FaListUl className="icon-list" /><span>{lesson.status}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Part7Page;