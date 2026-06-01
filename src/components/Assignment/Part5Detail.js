import React, { useState } from 'react';
import { 
  FaArrowLeft, FaClock, FaCog, FaListUl, 
  FaHeart, FaPen, FaExclamationTriangle, FaChevronDown,
  FaStepBackward, FaStepForward 
} from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom'; 
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import './Part5Detail.scss'; 

// --- DỮ LIỆU GIẢ LẬP PART 5 ---
const generatePart5Data = () => {
  const questions = [];
  for (let i = 101; i <= 130; i++) {
    questions.push({
      qId: i,
      text: `Question ${i}: The board of directors ______ the proposal for the new marketing strategy yesterday.`, 
      options: [
        { key: "A", text: "approve" },
        { key: "B", text: "approved" },
        { key: "C", text: "approves" },
        { key: "D", text: "approving" }
      ],
      correctAnswer: "B"
    });
  }
  return questions;
};

const MOCK_QUESTIONS = generatePart5Data();

// --- CẤU HÌNH HIỆU ỨNG SLIDE ---
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 500 : -500, // Nếu Next: từ phải (500) vào. Nếu Prev: từ trái (-500) vào.
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 500 : -500, // Nếu Next: bay ra trái (-500). Nếu Prev: bay ra phải (500).
    opacity: 0
  })
};

const Part5Detail = () => {
  const { id } = useParams();
  
  // State vị trí câu hỏi
  const [[currentQIdx, direction], setPage] = useState([0, 0]); 
  const [userAnswers, setUserAnswers] = useState({}); 
  const [showSidebar, setShowSidebar] = useState(false);

  const currentQuestion = MOCK_QUESTIONS[currentQIdx];

  // Hàm chuyển trang có điều hướng (newDirection: 1 là Next, -1 là Prev)
  const paginate = (newDirection) => {
    const nextIndex = currentQIdx + newDirection;
    if (nextIndex >= 0 && nextIndex < MOCK_QUESTIONS.length) {
        setPage([nextIndex, newDirection]);
    }
  };

  const handleSelect = (key) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestion.qId]: key }));
  };

  return (
    <div className="part5-detail-page">
      {/* HEADER */}
      <header className="quiz-header">
        <div className="header-left">
          <Link to="/toeic/part5" className="back-icon"><FaArrowLeft /></Link>
          <span className="question-title">Incomplete Sentences {String(id).padStart(2,'0')}</span>
        </div>
        <div className="header-right">
          <div className="timer"><FaClock /> <span>15:00</span></div>
          <FaListUl className="icon-btn" onClick={() => setShowSidebar(!showSidebar)} />
        </div>
      </header>

      {/* BODY */}
      <div className="quiz-body">
        
        {/* CONTAINER CHO ANIMATION */}
        <div className="card-container">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div 
                    key={currentQIdx} // Key thay đổi để kích hoạt animation
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="question-card-single"
                >
                    {/* Header Câu Hỏi */}
                    <div className="panel-header blue-header">
                        <span>{currentQuestion.qId}. {currentQuestion.text}</span>
                        <FaChevronDown />
                    </div>
                    
                    {/* Danh Sách Đáp Án */}
                    <div className="options-list">
                        {currentQuestion.options.map((opt) => {
                            const isSelected = userAnswers[currentQuestion.qId] === opt.key;
                            return (
                                <div 
                                    key={opt.key} 
                                    className={`option-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSelect(opt.key)}
                                >
                                    <div className="radio-circle">
                                        {isSelected && <div className="dot"></div>}
                                    </div>
                                    <span className="opt-text"><b>{opt.key}.</b> {opt.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Sidebar */}
        {showSidebar && (
            <div className="column-sidebar">
               <div className="sidebar-title">Palette</div>
               <div className="palette-grid">
                    {MOCK_QUESTIONS.map((q, idx) => (
                        <div 
                            key={q.qId} 
                            className={`palette-item ${userAnswers[q.qId] ? 'filled' : ''} ${currentQIdx === idx ? 'active' : ''}`}
                            onClick={() => setPage([idx, idx > currentQIdx ? 1 : -1])}
                        >
                            {q.qId}
                        </div>
                    ))}
               </div>
            </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="quiz-footer">
         <div className="nav-row">
            {/* Nút Prev: direction = -1 */}
            <button className="nav-arrow" onClick={() => paginate(-1)} disabled={currentQIdx === 0}>
                <FaStepBackward />
            </button>
            
            <div className="center-icons">
               <FaHeart /> <FaPen /> <FaExclamationTriangle />
            </div>
            
            {/* Nút Next: direction = 1 */}
            <button className="nav-arrow" onClick={() => paginate(1)} disabled={currentQIdx === MOCK_QUESTIONS.length - 1}>
                <FaStepForward />
            </button>
         </div>
      </footer>
    </div>
  );
};

export default Part5Detail;