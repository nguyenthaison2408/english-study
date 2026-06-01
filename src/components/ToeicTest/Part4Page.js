import React from 'react';
import { FaArrowLeft, FaClock, FaListUl, FaCrown } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import './Part4Page.scss'; 

const Part4Page = () => {
  const navigate = useNavigate(); // 2. Khai báo hook chuyển trang

  // Tạo dữ liệu giả lập 12 bài Short Talks
  const lessons = Array.from({ length: 12 }, (_, i) => {
    const id = i + 1;
    return {
      id: id,
      // Tên bài: "Short Talks 01", "Short Talks 02"...
      name: `Short Talks ${String(id).padStart(2, '0')}`,
      // Các bài từ 4 trở đi là bài Premium
      isPro: id >= 4, 
      format: "2025 Format",
      status: "Chưa làm"
    };
  });

  // 3. Hàm xử lý khi click vào bài học
  const handleLessonClick = (lessonId) => {
    // Chuyển sang trang chi tiết Part 4
    navigate(`/part4/detail/${lessonId}`);
  };

  return (
    <div className="part4-page">
      {/* Header - Mình đổi sang màu Tím cho khác biệt với Part 1 (Xanh lá) */}
      <div className="part4-header">
        <div className="header-content">
          <Link to="/toeic-prep" className="back-btn">
            <FaArrowLeft />
          </Link>
          <h1 className="header-title">Part 4: Short Talks</h1>
        </div>
      </div>

      {/* Grid Danh Sách Bài Học */}
      <div className="part4-container">
        <div className="part4-grid">
          {lessons.map((lesson) => (
            <div 
                key={lesson.id} 
                className="lesson-card"
                // 4. Thêm sự kiện click
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

export default Part4Page;