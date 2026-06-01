import React from 'react';
import { FaArrowLeft, FaClock, FaListUl, FaCrown } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom';
import './Part5Page.scss'; 

const Part5Page = () => {
  const navigate = useNavigate();

  const lessons = Array.from({ length: 10 }, (_, i) => {
    const id = i + 1;
    return {
      id: id,
      name: `Incomplete Sentences ${String(id).padStart(2, '0')}`,
      isPro: id >= 4, 
      format: "2025 Format",
      status: "Chưa làm"
    };
  });

  const handleLessonClick = (lessonId) => {
    navigate(`/part5/detail/${lessonId}`);
  };

  return (
    <div className="part5-page">
      {/* Header Cam */}
      <div className="part5-header">
        <div className="header-content">
          <Link to="/toeic-prep" className="back-btn"><FaArrowLeft /></Link>
          <h1 className="header-title">Part 5: Incomplete Sentences</h1>
        </div>
      </div>

      <div className="part5-container">
        <div className="part5-grid">
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
                <div className="status"><FaListUl className="icon-list" /><span>{lesson.status}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Part5Page;