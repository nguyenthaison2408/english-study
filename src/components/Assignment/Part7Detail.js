import React, { useState, useRef, useEffect } from 'react';
import { 
  FaArrowLeft, FaClock, FaCog, FaListUl, 
  FaHeart, FaPen, FaExclamationTriangle, FaChevronDown,
  FaStepBackward, FaStepForward 
} from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom'; 
import { motion, AnimatePresence } from "framer-motion"; 
import './Part7Detail.scss'; 

// --- DỮ LIỆU GIẢ LẬP PART 7 ---
const generatePart7Data = () => {
  const groups = [];
  let qIdCounter = 147; 

  // Tạo 2 nhóm bài để demo
  // Nhóm 1: Single Passage (1 văn bản)
  const questions1 = [];
  for (let j = 0; j < 3; j++) {
    questions1.push({ qId: qIdCounter++, text: "What is suggested about the product?", options: [{key:"A", text:"It is new"}, {key:"B", text:"It is cheap"}, {key:"C", text:"It is popular"}, {key:"D", text:"It is broken"}], correctAnswer: "A" });
  }
  groups.push({
    groupId: 1,
    type: "Single Passage",
    documents: [
      {
        title: "Advertisement",
        content: `<h3>New Smart Watch Launch</h3><p>We are excited to introduce the latest version of our smart watch. It features a battery life of up to 7 days and is water-resistant up to 50 meters.</p><p>Pre-order now to receive a 20% discount.</p>`
      }
    ],
    questions: questions1
  });

  // Nhóm 2: Double Passage (2 văn bản: Email & Form)
  const questions2 = [];
  for (let j = 0; j < 5; j++) {
    questions2.push({ qId: qIdCounter++, text: "Why did Ms. Johnson write the email?", options: [{key:"A", text:"To complain"}, {key:"B", text:"To inquire"}, {key:"C", text:"To apply"}, {key:"D", text:"To confirm"}], correctAnswer: "B" });
  }
  groups.push({
    groupId: 2,
    type: "Double Passage",
    documents: [
      {
        title: "E-mail",
        content: `<p><strong>To:</strong> Customer Service<br/><strong>From:</strong> Sarah Johnson</p><p>I recently purchased an order #12345 but received the wrong size.</p>`
      },
      {
        title: "Return Form",
        content: `<p><strong>Order ID:</strong> 12345<br/><strong>Reason:</strong> Wrong Item Sent<br/><strong>Action:</strong> Refund Requested</p>`
      }
    ],
    questions: questions2
  });

  return groups;
};

const PART7_DATA = generatePart7Data();

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 500 : -500, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 500 : -500, opacity: 0 })
};

const Part7Detail = () => {
  const { id } = useParams();
  const [[currentGroupIdx, direction], setPage] = useState([0, 0]); 
  const [userAnswers, setUserAnswers] = useState({}); 
  const [showSidebar, setShowSidebar] = useState(false);
  const cardScrollRef = useRef(null);

  const currentGroup = PART7_DATA[currentGroupIdx];

  useEffect(() => {
    if (cardScrollRef.current) cardScrollRef.current.scrollTop = 0;
  }, [currentGroupIdx]);

  const paginate = (newDirection) => {
    const nextIndex = currentGroupIdx + newDirection;
    if (nextIndex >= 0 && nextIndex < PART7_DATA.length) {
        setPage([nextIndex, newDirection]);
    }
  };

  const handleSelect = (qId, key) => {
    setUserAnswers(prev => ({ ...prev, [qId]: key }));
  };

  return (
    <div className="part7-detail-page">
      {/* HEADER */}
      <header className="quiz-header">
        <div className="header-left">
          <Link to="/toeic/part7" className="back-icon"><FaArrowLeft /></Link>
          <span className="question-title">Reading Comprehension {String(id).padStart(2,'0')}</span>
        </div>
        <div className="header-right">
          <div className="timer"><FaClock /> <span>54:00</span></div>
          <FaListUl className="icon-btn" onClick={() => setShowSidebar(!showSidebar)} />
        </div>
      </header>

      {/* BODY */}
      <div className="quiz-body">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div 
                key={currentGroupIdx}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="layout-split"
            >
                {/* --- CỘT TRÁI: HIỂN THỊ CÁC VĂN BẢN (1, 2 HOẶC 3) --- */}
                <div className="left-panel-passages">
                    <div className="passage-scroll-area">
                        {currentGroup.documents.map((doc, idx) => (
                            <div key={idx} className="document-block">
                                <div className="panel-header green-header">
                                    <span>{doc.title}</span>
                                    <FaChevronDown />
                                </div>
                                <div className="document-content" dangerouslySetInnerHTML={{ __html: doc.content }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- CỘT PHẢI: CARD CÂU HỎI (CUỘN BÊN TRONG) --- */}
                <div className="right-panel-questions">
                    <div className="questions-card">
                        <div className="card-header blue-header">
                            <span>Questions {currentGroup.questions[0].qId}-{currentGroup.questions[currentGroup.questions.length-1].qId}</span>
                        </div>
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
                                                    <div className="radio-circle">{isSelected && <div className="dot"></div>}</div>
                                                    <span className="opt-text"><b>{opt.key}.</b> {opt.text}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
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
               <div className="sidebar-title">Questions</div>
               <div className="palette-grid">
                    {PART7_DATA.flatMap(g => g.questions).map((q) => (
                        <div key={q.qId} className={`palette-item ${userAnswers[q.qId] ? 'filled' : ''}`}>
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
            <button className="nav-arrow" onClick={() => paginate(-1)} disabled={currentGroupIdx === 0}>
                <FaStepBackward /> Prev
            </button>
            <div className="center-icons"><FaHeart /> <FaPen /></div>
            <button className="nav-arrow" onClick={() => paginate(1)} disabled={currentGroupIdx === PART7_DATA.length - 1}>
                Next <FaStepForward />
            </button>
         </div>
      </footer>
    </div>
  );
};

export default Part7Detail;