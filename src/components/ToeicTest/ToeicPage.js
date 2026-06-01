import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header'; // Import Header
import './ToeicPage.scss';
import { 
  FaHeadphones, FaBookOpen, FaPen, FaMicrophone, 
  FaClipboardList, FaImage, FaComments, FaQuestionCircle,
  FaArrowLeft 
} from 'react-icons/fa';

const ToeicPage = () => {
  const getIcon = (iconName) => {
    switch(iconName) {
        case "Photo": return <FaImage />;
        case "Q&A": return <FaQuestionCircle />;
        case "Chat": return <FaComments />;
        case "Mic": return <FaMicrophone />;
        case "Pen": return <FaPen />;
        case "List": return <FaClipboardList />;
        case "Book": return <FaBookOpen />;
        case "Headphones": return <FaHeadphones />;
        case "Test": return <FaClipboardList />;
        default: return <FaBookOpen />;
    }
  };

  const toeicData = [
    {
      title: "Luyện Nghe",
      items: [
        { id: 1, name: "Luyện Part 1", action: "Mô Tả Hình Ảnh", icon: "Photo", link: "/toeic/part1" },
        { id: 2, name: "Luyện Part 2", action: "Hỏi Và Trả Lời", icon: "Q&A", link: "/toeic/part2" },
        { id: 3, name: "Luyện Part 3", action: "Đoạn Hội Thoại", icon: "Chat", link: "/toeic/part3" },
        { id: 4, name: "Luyện Part 4", action: "Bài Nói Chuyện", icon: "Mic", link: "/toeic/part4" },
      ]
    },
    {
      title: "Luyện Đọc",
      items: [
        { id: 5, name: "Luyện Part 5", action: "Hoàn Thành Câu", icon: "Pen", link: "/toeic/part5" },
        { id: 6, name: "Luyện Part 6", action: "Hoàn Thành Đoạn Văn", icon: "List", link: "/toeic/part6" },
        { id: 7, name: "Luyện Part 7", action: "Đọc Hiểu", icon: "Book", link: "/toeic/part7" },
      ]
    },
    {
      title: "Luyện Nói & Viết",
      items: [
        { id: 8, name: "Luyện Nói", action: "Nói", icon: "Mic", link: "/speaking" },
        { id: 9, name: "Luyện Viết", action: "Viết", icon: "Pen", link: "/writting" },
      ]
    },
    {
      title: "Thi Thử",
      items: [
        { id: 10, name: "Thi Thử Phần Nghe", action: "Nghe", icon: "Headphones", link: "/test-listening" },
        { id: 11, name: "Thi Thử Phần Đọc", action: "Đọc", icon: "Book", link: "/test-reading" },
        { id: 12, name: "Thi Thử Toàn Bài", action: "Toàn Bài", icon: "Test", link: "/test-full" },
      ]
    }
  ];

  return (
    <div className="toeic-page">
      {/* Thêm Header vào đây */}
      <Header />

      <div className="toeic-container">
        
        {/* --- NÚT QUAY LẠI --- */}
        <div className="back-button-wrapper">
            <Link to="/" className="btn-back">
                <FaArrowLeft className="icon" />
                <span>Trang chủ</span>
            </Link>
        </div>
        {/* ------------------- */}

        {toeicData.map((section, index) => (
          <div key={index} className="toeic-section">
            <h2 className="section-title">{section.title}</h2>
            <div className="card-grid">
              {section.items.map((item) => (
                <div key={item.id} className="course-card">
                  <h3 className="course-name">{item.name}</h3>
                  <Link to={item.link} className="action-btn" style={{textDecoration: 'none'}}>
                    <span className="btn-icon">{getIcon(item.icon)}</span>
                    <span className="btn-text">{item.action}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToeicPage;