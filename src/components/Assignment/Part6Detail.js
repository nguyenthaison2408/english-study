import React, { useState, useRef, useEffect } from 'react';
import { 
  FaArrowLeft, FaClock, FaCog, FaListUl, 
  FaHeart, FaPen, FaExclamationTriangle, FaChevronDown,
  FaStepBackward, FaStepForward 
} from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom'; 
import { motion, AnimatePresence } from "framer-motion"; 
import './Part6Detail.scss'; 

// --- DỮ LIỆU GIẢ LẬP PART 6 (4 Bài đọc, mỗi bài 4 câu) ---
const generatePart6Data = () => {
  const groups = [];
  let qIdCounter = 131; 

  for (let i = 1; i <= 4; i++) { // 4 Bài đọc
    const questions = [];
    for (let j = 0; j < 4; j++) { // Mỗi bài 4 câu
      questions.push({
        qId: qIdCounter,
        text: `Question ${qIdCounter}: Select the best answer to complete the text.`, 
        options: [
          { key: "A", text: "allowance" },
          { key: "B", text: "permission" },
          { key: "C", text: "access" },
          { key: "D", text: "approach" }
        ],
        correctAnswer: "C"
      });
      qIdCounter++;
    }

    groups.push({
      groupId: i,
      title: `Text Completion ${i} (Questions ${questions[0].qId}-${questions[3].qId})`,
      content: `
        <p><strong>To:</strong> All Staff<br/><strong>From:</strong> Management</p>
        <p>We are pleased to announce that the office renovation project is nearly complete. The contractors have finished painting the lobby and are now installing the new <strong>[${questions[0].qId}]</strong>.</p>
        <p>Please note that the main entrance will be closed for <strong>[${questions[1].qId}]</strong> while the flooring is being polished. Employees should use the side door entrance until further notice.</p>
        <p>We appreciate your patience and <strong>[${questions[2].qId}]</strong> during this time. If you have any questions, please contact the facilities manager.</p>
        <p>Thank you,<br/>The Management Team <strong>[${questions[3].qId}]</strong></p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non neque ac velit suscipit posuere. Curabitur vitae bibendum risus. Nam aliquam sem ut urna ultricies, sed gravida eros viverra.</p>
      `,
      questions: questions
    });
  }
  return groups;
};

const PART6_DATA = generatePart6Data();

// Config Animation (Trượt ngang)
const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 500 : -500, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 500 : -500, opacity: 0 })
};

const Part6Detail = () => {
  const { id } = useParams();
  
  // State: Quản lý đang ở ĐOẠN VĂN số mấy (0 -> 3)
  const [[currentGroupIdx, direction], setPage] = useState([0, 0]); 
  const [userAnswers, setUserAnswers] = useState({}); 
  const [showSidebar, setShowSidebar] = useState(false);
  const cardScrollRef = useRef(null);

  const currentGroup = PART6_DATA[currentGroupIdx];

  // Reset scroll card lên đầu khi chuyển bài
  useEffect(() => {
    if (cardScrollRef.current) {
        cardScrollRef.current.scrollTop = 0;
    }
  }, [currentGroupIdx]);

  // Chuyển sang Bài đọc tiếp theo (Next Passage)
  const paginate = (newDirection) => {
    const nextIndex = currentGroupIdx + newDirection;
    if (nextIndex >= 0 && nextIndex < PART6_DATA.length) {
        setPage([nextIndex, newDirection]);
    }
  };

  const handleSelect = (qId, key) => {
    setUserAnswers(prev => ({ ...prev, [qId]: key }));
  };

  return (
    <div className="part6-detail-page">
      {/* HEADER */}
      <header className="quiz-header">
        <div className="header-left">
          <Link to="/toeic/part6" className="back-icon"><FaArrowLeft /></Link>
          <span className="question-title">
             Part 6: Text Completion {String(id).padStart(2,'0')}
          </span>
        </div>
        <div className="header-right">
          <div className="timer"><FaClock /> <span>20:00</span></div>
          <FaCog className="icon-btn" />
          <FaListUl className="icon-btn" onClick={() => setShowSidebar(!showSidebar)} />
        </div>
      </header>

      {/* BODY */}
      <div className="quiz-body">
        
        {/* CONTAINER CHÍNH */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div 
                key={currentGroupIdx} // Key đổi theo Group -> Animation chạy cả 2 cột
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="layout-split"
            >
                {/* --- CỘT TRÁI: BÀI ĐỌC (PASSAGE) --- */}
                <div className="left-panel-passage">
                    <div className="panel-header green-header">
                        <span>{currentGroup.title}</span>
                    </div>
                    <div className="passage-scroll-area">
                        <div className="passage-content" dangerouslySetInnerHTML={{ __html: currentGroup.content }} />
                    </div>
                </div>

                {/* --- CỘT PHẢI: CARD CHỨA TẤT CẢ CÂU HỎI --- */}
                <div className="right-panel-questions">
                    <div className="questions-card">
                        
                        {/* Header của Card */}
                        <div className="card-header blue-header">
                            <span>Questions {currentGroup.questions[0].qId} - {currentGroup.questions[3].qId}</span>
                            <FaChevronDown />
                        </div>

                        {/* Nội dung Card: Cuộn để xem hết 4 câu */}
                        <div className="card-scroll-content" ref={cardScrollRef}>
                            {currentGroup.questions.map((q, index) => (
                                <div key={q.qId} className="question-item-block">
                                    <div className="q-title">
                                        <span className="q-num">{q.qId}.</span> {q.text}
                                    </div>
                                    <div className="options-list">
                                        {q.options.map((opt) => {
                                            const isSelected = userAnswers[q.qId] === opt.key;
                                            return (
                                                <div 
                                                    key={opt.key} 
                                                    className={`option-item ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => handleSelect(q.qId, opt.key)}
                                                >
                                                    <div className="radio-circle">
                                                        {isSelected && <div className="dot"></div>}
                                                    </div>
                                                    <span className="opt-text"><b>{opt.key}.</b> {opt.text}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {/* Kẻ ngang phân cách trừ câu cuối */}
                                    {index < currentGroup.questions.length - 1 && <div className="divider"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </motion.div>
        </AnimatePresence>

        {/* Sidebar */}
        {showSidebar && (
            <div className="column-sidebar">
               <div className="sidebar-title">Question Palette</div>
               <div className="palette-grid">
                    {PART6_DATA.flatMap(g => g.questions).map((q) => (
                        <div 
                            key={q.qId} 
                            className={`palette-item ${userAnswers[q.qId] ? 'filled' : ''}`}
                        >
                            {q.qId}
                        </div>
                    ))}
               </div>
            </div>
        )}
      </div>

      {/* FOOTER - Nút chuyển Bài đọc */}
      <footer className="quiz-footer">
         <div className="nav-row">
            <button className="nav-arrow" onClick={() => paginate(-1)} disabled={currentGroupIdx === 0}>
                <FaStepBackward /> Prev Passage
            </button>
            <div className="center-icons"><FaHeart /> <FaPen /> <FaExclamationTriangle /></div>
            <button className="nav-arrow" onClick={() => paginate(1)} disabled={currentGroupIdx === PART6_DATA.length - 1}>
                Next Passage <FaStepForward />
            </button>
         </div>
      </footer>
    </div>
  );
};

export default Part6Detail;