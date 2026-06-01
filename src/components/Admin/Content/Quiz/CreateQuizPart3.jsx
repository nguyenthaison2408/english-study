import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
// Đảm bảo bạn đã import đủ các hàm API này từ service
import { postCreateNewQuiz, getQuizById, putUpdateQuiz } from '../../../../services/quizService'; 
import './CreateQuizPart3.scss'; 

const CreateQuizPart3 = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy ID từ URL nếu đang ở chế độ Sửa

    // 1. Config Quiz
    const [quizInfo, setQuizInfo] = useState({
        title: '',
        description: '',
        level: 'Medium',
        timeLimit: 39,
        part: 3, 
        audio: '', 
    });

    // 2. Init 39 Questions (Cấu trúc dữ liệu rỗng ban đầu)
    const initQuestions = Array.from({ length: 39 }, (_, i) => ({
        questionText: [""], 
        questionImage: '', 
        point: 5,
        correctAnswer: '', 
        explanation: '', 
        options: [
            { text: '', image: '' },
            { text: '', image: '' },
            { text: '', image: '' },
            { text: '', image: '' }
        ]
    }));

    const [questions, setQuestions] = useState(initQuestions);

    // --- [FIXED] API CALL: LẤY CHI TIẾT BÀI THI ---
    // Sử dụng useCallback để tránh lỗi ESLint "missing dependency"
    const fetchQuizDetail = useCallback(async () => {
        try {
            let res = await getQuizById(id);
            if (res && res.data) {
                const data = res.data;
                // Fill thông tin cơ bản
                setQuizInfo({
                    title: data.title,
                    description: data.description || '',
                    level: data.level || 'Medium',
                    timeLimit: data.timeLimit || 39,
                    part: 3,
                    audio: data.audio || ''
                });

                // Fill danh sách câu hỏi
                // Chỉ set nếu có dữ liệu câu hỏi trả về
                if (data.questions && data.questions.length > 0) {
                    setQuestions(data.questions);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Không thể tải dữ liệu bài thi!");
        }
    }, [id]); // Hàm này sẽ được tạo lại khi ID thay đổi

    // --- USE EFFECT ---
    useEffect(() => {
        if (id) {
            fetchQuizDetail();
        }
    }, [id, fetchQuizDetail]); // Dependency đầy đủ, không còn warning

    // --- HANDLERS ---
    const handleInfoChange = (e) => setQuizInfo({ ...quizInfo, [e.target.name]: e.target.value });

    const handleQuestionTextChange = (qIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].questionText = [value];
        setQuestions(newQuestions);
    };

    const handleExplanationChange = (qIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].explanation = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[optIndex].text = value;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswer = (qIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = value;
        setQuestions(newQuestions);
    };

    const handleGroupImageChange = (groupIndex, value) => {
        const newQuestions = [...questions];
        const startIndex = groupIndex * 3;
        // Gán ảnh cho cả 3 câu trong nhóm conversation
        newQuestions[startIndex].questionImage = value;
        newQuestions[startIndex + 1].questionImage = value;
        newQuestions[startIndex + 2].questionImage = value;
        setQuestions(newQuestions);
    };

    // --- SUBMIT (CREATE OR UPDATE) ---
    const handleSubmit = async () => {
        // 1. Validation cơ bản
        if (!quizInfo.title) return toast.error("Vui lòng nhập tên bài thi!");
        if (!quizInfo.audio) return toast.error("Chưa có Audio hội thoại!");

        // 2. Validation từng câu hỏi
        for (let i = 0; i < questions.length; i++) {
            const qNum = i + 32; // Part 3 bắt đầu từ câu 32
            if (!questions[i].questionText[0]) return toast.error(`Câu ${qNum}: Thiếu nội dung câu hỏi`);
            if (!questions[i].correctAnswer) return toast.error(`Câu ${qNum}: Chưa chọn đáp án đúng`);
            for (let opt of questions[i].options) {
                if (!opt.text) return toast.error(`Câu ${qNum}: Thiếu nội dung đáp án`);
            }
        }

        const payload = { ...quizInfo, questions };

        try {
            let res;
            if (id) {
                // --- UPDATE MODE ---
                res = await putUpdateQuiz(id, payload);
                // Kiểm tra res tùy theo cách backend trả về (ví dụ res.data hoặc res.success)
                if (res) { 
                    toast.success("Cập nhật bài thi thành công!");
                    navigate('/admin/manage-quiz/part/3');
                }
            } else {
                // --- CREATE MODE ---
                res = await postCreateNewQuiz(payload);
                if (res && res.data) {
                    toast.success("Tạo Part 3 thành công!");
                    navigate('/admin/manage-quiz/part/3');
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Lỗi server");
        }
    };

    // --- RENDER HELPERS ---
    const renderGroups = () => {
        const groups = [];
        // Part 3 có 13 đoạn hội thoại (39 câu)
        for (let i = 0; i < 13; i++) {
            const startIndex = i * 3;
            // Giả định 3 đoạn cuối (10, 11, 12) có Graphic
            const hasGraphic = i >= 10; 
            const startQ = 32 + (i * 3);
            const endQ = startQ + 2;
            const groupQs = questions.slice(startIndex, startIndex + 3);

            // Lấy ảnh từ câu đầu tiên của nhóm để hiển thị input
            const currentGroupImage = questions[startIndex].questionImage;

            groups.push(
                <div key={i} className="card-group-conversation">
                    <div className="group-header">
                        <span><i className="fa fa-comments me-2"></i>Conversation {i + 1} (Q.{startQ} - Q.{endQ})</span>
                        {hasGraphic && <span className="badge bg-warning text-dark"><i className="fa fa-image"></i> Có biểu đồ</span>}
                    </div>

                    <div className="group-body">
                        {hasGraphic && (
                            <div className="graphic-area">
                                <label className="form-label fw-bold">Link Biểu đồ/Bảng tin (Graphic):</label>
                                <div className="input-group">
                                    <input 
                                        type="text" className="form-control" placeholder="Link ảnh..."
                                        value={currentGroupImage}
                                        onChange={(e) => handleGroupImageChange(i, e.target.value)}
                                    />
                                    {currentGroupImage && (
                                        <span className="input-group-text p-1 bg-white">
                                            <img src={currentGroupImage} alt="Preview" style={{height:'30px'}} />
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="row g-3">
                            {groupQs.map((q, idx) => {
                                const realIndex = startIndex + idx;
                                return (
                                    <div key={realIndex} className="col-12 col-xl-4">
                                        <div className="question-card">
                                            <div className="q-header">Question {realIndex + 32}</div>
                                            <div className="q-body">
                                                <input 
                                                    type="text" 
                                                    className="form-control question-input" 
                                                    placeholder="Nhập câu hỏi..."
                                                    value={q.questionText[0]}
                                                    onChange={(e) => handleQuestionTextChange(realIndex, e.target.value)}
                                                />

                                                {/* Options */}
                                                {q.options.map((opt, oIdx) => {
                                                    const label = ['A', 'B', 'C', 'D'][oIdx];
                                                    return (
                                                        <div key={oIdx} className="option-item">
                                                            <div 
                                                                className={`btn-option-label ${q.correctAnswer === label ? 'active' : ''}`}
                                                                onClick={() => handleCorrectAnswer(realIndex, label)}
                                                                title="Click để chọn đáp án đúng"
                                                            >
                                                                {label}
                                                            </div>
                                                            <input 
                                                                type="text" 
                                                                className="form-control"
                                                                placeholder={`Đáp án ${label}...`}
                                                                value={opt.text}
                                                                onChange={(e) => handleOptionChange(realIndex, oIdx, e.target.value)}
                                                            />
                                                        </div>
                                                    )
                                                })}

                                                <div className="mt-3 pt-2 border-top">
                                                    <textarea 
                                                        className="form-control form-control-sm bg-light" 
                                                        rows="2"
                                                        placeholder="Giải thích đáp án (Optional)..."
                                                        value={q.explanation}
                                                        onChange={(e) => handleExplanationChange(realIndex, e.target.value)}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            );
        }
        return groups;
    };

    return (
        <div className="create-quiz-part3-container">
            <div className="container pt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary fw-bold m-0">
                        {id ? `Cập nhật Part 3 (ID: ${id})` : "Tạo đề Part 3 (Short Conversations)"}
                    </h2>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/manage-quiz/part/3')}>
                        <i className="fa fa-arrow-left me-2"></i> Quay lại
                    </button>
                </div>
                
                {/* SETTING BÀI THI */}
                <div className="card shadow-sm mb-4 p-3 bg-white border-0">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Tên bài thi:</label>
                            <input className="form-control" value={quizInfo.title} name="title" onChange={handleInfoChange} placeholder="ETS 2024 Test 1 - Part 3" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-danger">Audio File (Link MP3):</label>
                            <input className="form-control" value={quizInfo.audio} name="audio" onChange={handleInfoChange} placeholder="https://..." />
                        </div>
                    </div>
                </div>

                {/* DANH SÁCH CÂU HỎI */}
                {renderGroups()}

                {/* NÚT SUBMIT */}
                <div className="mt-5 mb-5 text-center">
                    <button 
                        className={`btn btn-lg shadow px-5 py-3 ${id ? 'btn-warning text-white' : 'btn-primary'}`}
                        onClick={handleSubmit}
                        style={{borderRadius: '50px', fontSize: '1.2rem'}}
                    >
                        <i className={`fa ${id ? 'fa-pencil' : 'fa-save'} me-2`}></i> 
                        {id ? "CẬP NHẬT BÀI THI PART 3" : "LƯU BÀI THI PART 3"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuizPart3;