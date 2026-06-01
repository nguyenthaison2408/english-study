import React from 'react';
import { FaArrowLeft, FaClock, FaListUl, FaCrown } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import './TestFullPage.scss'; 

const TestFullPage = () => {
  const navigate = useNavigate(); // 2. Khai báo hook chuyển trang

  // 3. Tạo dữ liệu giả lập giống hệt cách làm ở Part 1
  // Tạo 10 đề thi "L&R Test 01" -> "L&R Test 10"
  const tests = Array.from({ length: 12 }, (_, i) => {
    const id = i + 1;
    return {
      id: id,
      name: `L&R Test ${String(id).padStart(2, '0')}`, // Tên chuẩn
      isPro: id >= 4, // Từ đề 4 trở đi là Premium
      format: "2025 Format",
      status: "Chưa làm"
    };
  });

  // 4. Hàm xử lý khi click vào đề thi
  const handleTestClick = (testId) => {
      console.log("Click đề số:", testId); // Log kiểm tra
      navigate(`/fulltest/detail/${testId}`); // Chuyển sang trang chi tiết
  };

  return (
    <div className="test-full-page">
      {/* Header */}
      <div className="test-header">
        <div className="header-content">
          <Link to="/toeic-prep" className="back-btn">
            <FaArrowLeft />
          </Link>
          <h1 className="header-title">Full Test Simulator</h1>
        </div>
      </div>

      {/* Grid Danh Sách Đề Thi */}
      <div className="test-container">
        <div className="test-grid">
          {tests.map((test) => (
            <div 
                key={test.id} 
                className="test-card"
                // 5. Sự kiện click giống hệt Part 1
                onClick={() => handleTestClick(test.id)}
                style={{cursor: 'pointer'}} 
            >
              <div className="card-top">
                <h3 className="test-name">
                  {test.name}
                  {test.isPro && <FaCrown className="icon-crown" title="Premium" />}
                </h3>
                <FaClock className="icon-history" />
              </div>
              
              <div className="card-bottom">
                <span className="tag-format">{test.format}</span>
                <div className="status">
                  <FaListUl className="icon-list" />
                  <span>{test.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestFullPage;