import React, { useState, useEffect } from 'react';
import { 
  BarChart2, Clock, BookOpen, Play, Loader, AlertCircle, ArrowLeft,
  History, Calendar, CheckCircle, XCircle, Lock
} from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import { motion, AnimatePresence } from "framer-motion"; 
import { toast } from 'react-toastify';

import './ExamPage.scss'; 
import { getAllQuiz, getQuizHistory } from '../../services/quizService'; 
import { usePayment } from '../../hooks/usePayment';
import { useAuth } from '../../hooks/useAuth';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const ExamPage = () => {
  const navigate = useNavigate();
  const { initiatePayment, checkPaymentStatus } = usePayment();
  const { isAuthenticated, user} = useAuth();
  const userId = user?.userId;

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('exams');
  const [exams, setExams] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [paymentStatuses, setPaymentStatuses] = useState({});

  // --- FETCH DANH SÁCH ĐỀ THI ---
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const res = await getAllQuiz();
        let data = res?.DT || res?.data || res || [];
        if (!Array.isArray(data)) data = [];
        setExams(data);
        
        // KHÔNG check payment ngay khi load trang
        // Chỉ check khi user click vào bài thi
      } catch (err) {
        console.error("Lỗi tải đề thi:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (activeTab === 'exams') fetchExams();
  }, [activeTab]);

  // --- FETCH LỊCH SỬ LÀM BÀI ---
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await getQuizHistory();
        let data = res?.DT || res?.data || res || [];
        if (!Array.isArray(data)) data = [];
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setHistoryList(data);
      } catch (err) {
        console.error("Lỗi tải lịch sử:", err);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'history') fetchHistory();
  }, [activeTab]);

  // --- HELPERS ---
  const partStats = [0, 1, 2, 3, 4, 5, 6, 7].map(partNum => ({
    part: partNum,
    count: exams.filter(exam => exam.part === partNum).length
  }));

  const filteredExams = selectedPart === null 
    ? exams 
    : exams.filter(exam => exam.part === selectedPart);

  const handleStartExam = async (quiz) => {
    const quizId = quiz.id || quiz._id;
    const part = quiz.part || 0;
    const isVip = quiz.vip === "1";
    
    if (!quizId) return;

    // Nếu là bài VIP
    if (isVip) {
      if (!isAuthenticated) {
        toast.error('Vui lòng đăng nhập để làm bài thi VIP');
        return;
      }

      // CHECK payment status CHỈ KHI CLICK vào bài thi
      let hasPaid = paymentStatuses[quizId];
      
      // Nếu chưa check lần nào, check ngay bây giờ
      if (hasPaid === undefined) {
        try {
          const result = await checkPaymentStatus(quizId);
          hasPaid = result.hasPaid;
          
          // Lưu vào state để lần sau không phải check lại
          setPaymentStatuses(prev => ({
            ...prev,
            [quizId]: hasPaid
          }));
        } catch (error) {
          console.error('Error checking payment:', error);
          toast.error('Không thể kiểm tra trạng thái thanh toán');
          return;
        }
      }
      
      if (!hasPaid) {
        // Chuyển đến thanh toán
        const result = await initiatePayment(quizId, quiz.title || quiz.name);
        if (!result.success) {
          toast.error('Không thể khởi tạo thanh toán');
        }
        return;
      }
    }

    // Chuyển hướng theo part
    if (part === 0) navigate(`/test-full/${quizId}`);
    else navigate(`/test-part${part}/${quizId}`);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0s";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}p ${s}s`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // --- RENDER COMPONENTS ---
  const renderExamCard = (exam, index) => {
    const level = exam.level || (["Dễ", "Trung bình", "Khó"][index % 3]);
    const partLabel = exam.part === 0 ? "Full Test" : `Part ${exam.part}`;
    const isVip = exam.vip === "1";
    const quizId = exam._id || exam.id;
    // const hasPaid = paymentStatuses[quizId];
    // const needPayment = isVip && !hasPaid;

    const hasPaidFromQuiz =Array.isArray(exam.userPay) && userId ? exam.userPay.includes(userId): false;
// fallback từ state (sau khi check API)
     const hasPaid = hasPaidFromQuiz || paymentStatuses[quizId];
     const needPayment = isVip && !hasPaid;

    return (
      <motion.div 
        key={exam._id || index} 
        variants={itemVariants} 
        className={`exam-card ${needPayment ? 'vip-locked' : ''}`}
        whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      >
        <div className="card-tags">
          {isVip && <span className="tag red">Hot</span>}
          <span className="tag blue">{partLabel}</span>
          {hasPaid && <span className="tag green">Đã mua</span>}
        </div>
        
        <div className="card-top">
          <div className={`level-badge ${level === "Khó" ? "hard" : level === "Trung bình" ? "medium" : "easy"}`}>
            <BarChart2 size={14} /> {level}
          </div>
          <span className="participants">👥 {1200 + index * 45}</span>
        </div>
        
        <h3 className="exam-title">{exam.name || exam.title}</h3>
        
        <div className="exam-meta">
          <div className="meta-item"><Clock size={16} /> {exam.timeLimit || 120} phút</div>
          <div className="meta-item"><BookOpen size={16} /> {exam.questions?.length || "?"} câu</div>
        </div>
        
        <button 
          className={`start-btn ${needPayment ? 'payment-btn' : ''}`}
          onClick={() => handleStartExam(exam)}
        >
          <span>{needPayment ? 'Mua ngay - 50.000đ' : 'Làm bài ngay'}</span>
          <div className="icon-circle">
            {needPayment ? <Lock size={14} /> : <Play size={14} fill="currentColor" />}
          </div>
        </button>
      </motion.div>
    );
  };

  const renderHistoryTable = () => {
    if (historyList.length === 0) {
      return (
        <div className="empty-state text-center py-5">
          <History size={64} className="text-muted mb-3 opacity-50"/>
          <h5 className="text-muted">Bạn chưa làm bài thi nào</h5>
          <button className="btn btn-primary mt-3 px-4 rounded-pill" onClick={() => setActiveTab('exams')}>
            Làm bài ngay
          </button>
        </div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="history-container">
        <div className="history-table-wrapper">
          <table className="custom-history-table">
            <thead>
              <tr>
                <th className="text-left pl-4">Đề thi</th>
                <th>Ngày làm</th>
                <th>Thời gian</th>
                <th className="text-center">Kết quả</th>
                <th className="text-center">Điểm số</th>
                <th className="text-right pr-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {historyList.map((item, idx) => {
                const quizName = item.quizData?.title || item.quizId?.title || item.quizTitle || `Bài thi #${idx + 1}`;
                const totalQ = item.answers?.length || item.totalQuestions || 0;
                const correctQ = item.answers 
                  ? item.answers.filter(a => a.isCorrect === true).length 
                  : (item.totalCorrect || 0);
                const isPass = totalQ > 0 ? (correctQ / totalQ) >= 0.5 : false;

                return (
                  <tr key={item._id || idx}>
                    <td className="pl-4">
                      <div className="quiz-name">{quizName}</div>
                      <small className="quiz-id">ID: {item._id?.substring(0,8)}...</small>
                    </td>
                    <td>
                      <div className="cell-content">
                        <Calendar size={14}/> {formatDate(item.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className="cell-content highlight">
                        <Clock size={14}/> {formatDuration(item.timeSpent)}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`status-badge ${isPass ? 'pass' : 'fail'}`}>
                        {isPass ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                        {isPass ? 'Đạt' : 'Chưa đạt'}
                      </span>
                    </td>
                    <td className="text-center score-cell">
                      <span className="score-highlight">{correctQ}</span> / {totalQ}
                    </td>
                    <td className="text-right pr-4">
                      <button 
                        className="action-btn"
                        onClick={() => navigate(`/quiz-result/${item._id}`)} 
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="exam-page-container">
      {activeTab === 'exams' && (
        <aside className="exam-sidebar">
          <div className="sidebar-header"><h3>DANH SÁCH PHẦN</h3></div>
          <div className="sidebar-content">
            <button 
              className={`part-btn all-btn ${selectedPart === null ? 'active' : ''}`} 
              onClick={() => setSelectedPart(null)}
            >
              <span className="part-label">🎯 Tất cả</span>
              <span className="badge-count">{exams.length}</span>
            </button>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(num => {
              const count = partStats.find(s => s.part === num)?.count || 0;
              return (
                <button 
                  key={num} 
                  className={`part-btn ${selectedPart === num ? 'active' : ''}`} 
                  onClick={() => setSelectedPart(num)}
                >
                  <span className="part-label">{num === 0 ? "Full Test" : `Part ${num}`}</span>
                  <span className="badge-count">{count}</span>
                </button>
              );
            })}
          </div>
        </aside>
      )}

      <main className={`exam-main-content ${activeTab === 'history' ? 'w-100 px-lg-5' : ''}`}>
        <div className="exam-header d-block mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <button className="btn-back" onClick={() => navigate('/userprofile')}>
              <ArrowLeft size={24} />
            </button>
            
            <div className="custom-tabs-wrapper">
              <button 
                className={`tab-item ${activeTab === 'exams' ? 'active' : ''}`}
                onClick={() => setActiveTab('exams')}
              >
                Kho Đề Thi
              </button>
              <button 
                className={`tab-item ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Lịch Sử
              </button>
            </div>
          </div>

          <div className="header-info text-center text-md-start">
            {activeTab === 'exams' ? (
              <>
                <h1 className="fw-bold text-primary">Thư viện đề thi TOEIC</h1>
                <p className="text-muted">Luyện tập mỗi ngày để nâng cao kỹ năng</p>
              </>
            ) : (
              <>
                <h1 className="fw-bold text-primary">Lịch sử làm bài</h1>
                <p className="text-muted">Theo dõi quá trình tiến bộ của bạn</p>
              </>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-5 mt-5">
            <Loader className="animate-spin mx-auto text-primary" size={40} />
            <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
          </div>
        )}
        
        {!loading && (
          <div className="fade-in-up">
            {activeTab === 'exams' ? (
              filteredExams.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={selectedPart} 
                    className="exam-list" 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="visible"
                  >
                    {filteredExams.map((exam, index) => renderExamCard(exam, index))}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="text-center py-5">
                  <AlertCircle size={48} className="text-muted mb-3 opacity-50"/>
                  <p className="text-muted">Không tìm thấy đề thi nào.</p>
                </div>
              )
            ) : (
              renderHistoryTable()
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExamPage;