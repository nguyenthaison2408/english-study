import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
// Import đầy đủ các API services
import { postCreateNewQuiz, getQuizById, putUpdateQuiz } from '../../../../services/quizService'; 
// Bạn có thể dùng chung file SCSS của Part 3 hoặc tạo file mới import vào đây
import './CreateQuizPart3.scss'; 

const CreateQuizPart4 = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy ID để check chế độ Edit

    // 1. Config Quiz Part 4
    const [quizInfo, setQuizInfo] = useState({
        title: '',
        description: '',
        level: 'Medium',
        timeLimit: 30, // Part 4 thường ngắn hơn Part 3 một chút
        part: 4,       // <--- QUAN TRỌNG: PART 4
        audio: '', 
    });

    // 2. Init 30 Questions (Part 4 có 30 câu: 71 -> 100)
    const initQuestions = Array.from({ length: 30 }, (_, i) => ({
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

    // --- FETCH DATA (EDIT MODE) ---
    const fetchQuizDetail = useCallback(async () => {
        try {
            let res = await getQuizById(id);
            if (res && res.data) {
                const data = res.data;
                setQuizInfo({
                    title: data.title,
                    description: data.description || '',
                    level: data.level || 'Medium',
                    timeLimit: data.timeLimit || 30,
                    part: 4,
                    audio: data.audio || ''
                });

                if (data.questions && data.questions.length > 0) {
                    setQuestions(data.questions);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Không thể tải dữ liệu bài thi!");
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchQuizDetail();
        }
    }, [id, fetchQuizDetail]);

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
        // Gán ảnh cho cả 3 câu trong cùng 1 bài nói (Short Talk)
        if(newQuestions[startIndex]) newQuestions[startIndex].questionImage = value;
        if(newQuestions[startIndex+1]) newQuestions[startIndex + 1].questionImage = value;
        if(newQuestions[startIndex+2]) newQuestions[startIndex + 2].questionImage = value;
        setQuestions(newQuestions);
    };

    // --- SUBMIT ---
    const handleSubmit = async () => {
        if (!quizInfo.title) return toast.error("Vui lòng nhập tên bài thi!");
        if (!quizInfo.audio) return toast.error("Chưa có Audio bài nói!");

        // Validate Part 4 bắt đầu từ câu 71
        for (let i = 0; i < questions.length; i++) {
            const qNum = i + 71; 
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
                // UPDATE
                res = await putUpdateQuiz(id, payload);
                if (res) {
                    toast.success("Cập nhật Part 4 thành công!");
                    navigate('/admin/manage-quiz/part/4');
                }
            } else {
                // CREATE
                res = await postCreateNewQuiz(payload);
                if (res && res.data) {
                    toast.success("Tạo Part 4 thành công!");
                    navigate('/admin/manage-quiz/part/4'); 
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi server");
        }
    };

    // --- RENDER ---
    const renderGroups = () => {
        const groups = [];
        // Part 4 có 10 bài nói (Short Talks) -> Loop 10 lần
        // Mỗi bài nói ứng với 3 câu hỏi
        for (let i = 0; i < 10; i++) {
            const startIndex = i * 3;
            
            // Logic Graphic: Thường 2-3 bài cuối có hình ảnh
            const hasGraphic = i >= 7; 

            // Part 4 bắt đầu từ câu 71
            const startQ = 71 + (i * 3);
            const endQ = startQ + 2;
            const groupQs = questions.slice(startIndex, startIndex + 3);
            const currentGroupImage = questions[startIndex]?.questionImage;

            groups.push(
                <div key={i} className="card-group-conversation">
                    <div className="group-header">
                        <span><i className="fa fa-microphone me-2"></i>Talk {i + 1} (Q.{startQ} - Q.{endQ})</span>
                        {hasGraphic && <span className="badge bg-warning text-dark"><i className="fa fa-image"></i> Có biểu đồ</span>}
                    </div>

                    <div className="group-body">
                        {hasGraphic && (
                            <div className="graphic-area">
                                <label className="form-label fw-bold">Link Biểu đồ/Bảng tin (Graphic):</label>
                                <div className="input-group">
                                    <input 
                                        type="text" className="form-control" placeholder="Link ảnh..."
                                        value={currentGroupImage || ''}
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
                                            {/* Header câu hỏi: 71 trở đi */}
                                            <div className="q-header">Question {realIndex + 71}</div>
                                            <div className="q-body">
                                                <input 
                                                    type="text" 
                                                    className="form-control question-input" 
                                                    placeholder="Nhập câu hỏi..."
                                                    value={q.questionText[0]}
                                                    onChange={(e) => handleQuestionTextChange(realIndex, e.target.value)}
                                                />

                                                {/* OPTION A/B/C/D */}
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
        <div className="create-quiz-part3-container"> {/* Tận dụng class CSS của Part 3 */}
            <div className="container pt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary fw-bold m-0">
                        {id ? `Cập nhật Part 4 (ID: ${id})` : "Tạo đề Part 4 (Short Talks)"}
                    </h2>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/manage-quiz/part/4')}>
                        <i className="fa fa-arrow-left me-2"></i> Quay lại
                    </button>
                </div>
                
                {/* SETTING BÀI THI */}
                <div className="card shadow-sm mb-4 p-3 bg-white border-0">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Tên bài thi:</label>
                            <input className="form-control" value={quizInfo.title} name="title" onChange={handleInfoChange} placeholder="ETS 2024 Test 1 - Part 4" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-danger">Audio File (Link MP3):</label>
                            <input className="form-control" value={quizInfo.audio} name="audio" onChange={handleInfoChange} placeholder="https://..." />
                        </div>
                    </div>
                </div>

                {/* DANH SÁCH CÂU HỎI */}
                {renderGroups()}

                {/* NÚT LƯU */}
                <div className="mt-5 mb-5 text-center">
                    <button 
                        className={`btn btn-lg shadow px-5 py-3 ${id ? 'btn-warning text-white' : 'btn-primary'}`}
                        onClick={handleSubmit}
                        style={{borderRadius: '50px', fontSize: '1.2rem'}}
                    >
                        <i className={`fa ${id ? 'fa-pencil' : 'fa-save'} me-2`}></i> 
                        {id ? "CẬP NHẬT BÀI THI PART 4" : "LƯU BÀI THI PART 4"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuizPart4;