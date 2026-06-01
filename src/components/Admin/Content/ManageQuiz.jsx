import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageQuiz.scss';
import { 
    FaImage, FaQuestionCircle, FaComments, FaMicrophone, 
    FaPenFancy, FaFileAlt, FaBookOpen, FaLayerGroup // [NEW] Icon cho Full Test
} from 'react-icons/fa';

const ManageQuiz = () => {
    const navigate = useNavigate();

    // [NEW] Dữ liệu Full Test (ID = 0)
    const fullTestPart = { 
        id: 0, 
        title: "Full Test", 
        label: "Mô Phỏng Thi Thật (2H)", 
        icon: <FaLayerGroup />, 
        color: "#28a745" // Màu xanh lá nổi bật
    };

    const listeningParts = [
        { id: 1, title: "Part 1", label: "Mô Tả Hình Ảnh", icon: <FaImage />, color: "#f0ad4e" },
        { id: 2, title: "Part 2", label: "Hỏi & Trả Lời", icon: <FaQuestionCircle />, color: "#f0ad4e" },
        { id: 3, title: "Part 3", label: "Đoạn Hội Thoại", icon: <FaComments />, color: "#f0ad4e" },
        { id: 4, title: "Part 4", label: "Bài Nói Chuyện", icon: <FaMicrophone />, color: "#f0ad4e" }
    ];

    const readingParts = [
        { id: 5, title: "Part 5", label: "Hoàn Thành Câu", icon: <FaPenFancy />, color: "#f0ad4e" },
        { id: 6, title: "Part 6", label: "Hoàn Thành Đoạn", icon: <FaFileAlt />, color: "#f0ad4e" },
        { id: 7, title: "Part 7", label: "Đọc Hiểu", icon: <FaBookOpen />, color: "#f0ad4e" }
    ];

    const handleSelectPart = (partNumber) => {
        // Nếu partNumber = 0 -> URL là /admin/manage-quiz/part/0
        navigate(`/admin/manage-quiz/part/${partNumber}`, { 
            state: { part: partNumber } 
        });
    };

    return (
        <div className="manage-quiz-container">
            <h2 className="page-title">Quản lý Bài Quiz</h2>
            
            {/* [NEW] Section Full Test */}
            <div className="quiz-section">
                <h3 className="section-title text-success">Thi Thử (Simulation)</h3>
                <div className="quiz-grid">
                    <div 
                        className="quiz-card full-test-card" // Thêm class riêng nếu muốn CSS to hơn
                        onClick={() => handleSelectPart(fullTestPart.id)}
                    >
                        <div className="card-content">
                            <h4 className="part-title">{fullTestPart.title}</h4>
                            <div className="action-btn" style={{ backgroundColor: fullTestPart.color }}>
                                <span className="icon">{fullTestPart.icon}</span>
                                <span className="text">{fullTestPart.label}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Luyện Nghe */}
            <div className="quiz-section">
                <h3 className="section-title">Luyện Nghe (Listening)</h3>
                <div className="quiz-grid">
                    {listeningParts.map((item) => (
                        <div 
                            key={item.id} 
                            className="quiz-card"
                            onClick={() => handleSelectPart(item.id)}
                        >
                            <div className="card-content">
                                <h4 className="part-title">Luyện {item.title}</h4>
                                <div className="action-btn" style={{ backgroundColor: item.color }}>
                                    <span className="icon">{item.icon}</span>
                                    <span className="text">{item.label}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section Luyện Đọc */}
            <div className="quiz-section">
                <h3 className="section-title">Luyện Đọc (Reading)</h3>
                <div className="quiz-grid">
                    {readingParts.map((item) => (
                        <div 
                            key={item.id} 
                            className="quiz-card"
                            onClick={() => handleSelectPart(item.id)}
                        >
                            <div className="card-content">
                                <h4 className="part-title">Luyện {item.title}</h4>
                                <div className="action-btn" style={{ backgroundColor: item.color }}>
                                    <span className="icon">{item.icon}</span>
                                    <span className="text">{item.label}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageQuiz;