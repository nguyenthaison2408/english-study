import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
// Import đủ các service: Create, GetDetail, Update
import { postCreateNewQuiz, getQuizById, putUpdateQuiz } from '../../../../services/quizService'; 
import './CreateQuizPart5.scss'; 

const CreateQuizPart5 = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy ID từ URL để check chế độ Edit

    // 1. Config Quiz Part 5
    const [quizInfo, setQuizInfo] = useState({
        title: '',
        description: '',
        level: 'Medium',
        timeLimit: 15, // Part 5 thường làm nhanh (khoảng 15-20p)
        part: 5,       // <--- Fixed Part 5
    });

    // 2. Init 30 Questions (Q.101 -> Q.130)
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
                    timeLimit: data.timeLimit || 15,
                    part: 5,
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

    // --- SUBMIT ---
    const handleSubmit = async () => {
        if (!quizInfo.title) return toast.error("Vui lòng nhập tên bài thi!");
        
        // Validate Questions (101 -> 130)
        for (let i = 0; i < questions.length; i++) {
            const qNum = i + 101; 
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
                    toast.success("Cập nhật Part 5 thành công!");
                    navigate('/admin/manage-quiz/part/5');
                }
            } else {
                // CREATE
                res = await postCreateNewQuiz(payload);
                if (res && res.data) {
                    toast.success("Tạo Part 5 thành công!");
                    navigate('/admin/manage-quiz/part/5'); 
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi server");
        }
    };

    return (
        <div className="create-quiz-part5-container"> 
            <div className="container pt-4">
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary fw-bold m-0">
                        {id ? `Cập nhật Part 5 (ID: ${id})` : "Tạo đề Part 5 (Incomplete Sentences)"}
                    </h2>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/manage-quiz/part/5')}>
                        <i className="fa fa-arrow-left me-2"></i> Quay lại
                    </button>
                </div>
                
                {/* SETTING INFO */}
                <div className="card border-0 shadow-sm mb-4 p-4 bg-white" style={{borderRadius: '12px'}}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-secondary">Tên bài thi</label>
                            <input 
                                className="form-control form-control-lg" 
                                value={quizInfo.title} 
                                name="title" 
                                onChange={handleInfoChange} 
                                placeholder="VD: ETS 2024 Test 1 - Part 5" 
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold text-secondary">Mức độ</label>
                            <select 
                                className="form-select form-select-lg" 
                                name="level" 
                                value={quizInfo.level} 
                                onChange={handleInfoChange}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold text-secondary">Thời gian (phút)</label>
                            <input 
                                type="number" 
                                className="form-control form-control-lg" 
                                value={quizInfo.timeLimit} 
                                name="timeLimit" 
                                onChange={handleInfoChange} 
                            />
                        </div>
                    </div>
                </div>

                {/* DANH SÁCH CÂU HỎI */}
                <div className="row g-4">
                    {questions.map((q, index) => {
                        const qNum = index + 101;
                        return (
                            <div key={index} className="col-12 col-md-6"> 
                                <div className="question-card h-100 shadow-sm border-0" style={{background: '#f8f9fa', padding: '20px', borderRadius:'8px'}}>
                                    <div className="d-flex justify-content-between mb-2">
                                        <h5 className="fw-bold text-primary">Question {qNum}</h5>
                                    </div>
                                    
                                    <div className="card-body p-0">
                                        {/* Câu hỏi */}
                                        <div className="mb-3">
                                            <input 
                                                type="text" 
                                                className="form-control fw-bold" 
                                                style={{borderLeft: '4px solid #0d6efd'}}
                                                placeholder="Nhập câu hỏi (VD: The meeting was _____ due to...)"
                                                value={q.questionText[0]}
                                                onChange={(e) => handleQuestionTextChange(index, e.target.value)}
                                            />
                                        </div>

                                        {/* 4 Đáp án */}
                                        <div className="options-list">
                                            {q.options.map((opt, oIdx) => {
                                                const label = ['A', 'B', 'C', 'D'][oIdx];
                                                const isSelected = q.correctAnswer === label;
                                                return (
                                                    <div key={oIdx} className="input-group mb-2">
                                                        <span 
                                                            className={`input-group-text cursor-pointer fw-bold ${isSelected ? 'bg-success text-white border-success' : 'bg-white'}`}
                                                            style={{width: '40px', justifyContent: 'center', cursor: 'pointer'}}
                                                            onClick={() => handleCorrectAnswer(index, label)}
                                                            title="Click chọn đáp án đúng"
                                                        >
                                                            {label}
                                                        </span>
                                                        <input 
                                                            type="text" 
                                                            className={`form-control ${isSelected ? 'border-success' : ''}`}
                                                            placeholder={`Đáp án ${label}`}
                                                            value={opt.text}
                                                            onChange={(e) => handleOptionChange(index, oIdx, e.target.value)}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Giải thích */}
                                        <div className="mt-3">
                                            <textarea 
                                                className="form-control form-control-sm bg-white text-secondary" 
                                                rows="2"
                                                placeholder="Giải thích chi tiết..."
                                                value={q.explanation}
                                                onChange={(e) => handleExplanationChange(index, e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* NÚT LƯU */}
                <div className="mt-5 mb-5 text-center">
                    <button 
                        className={`btn btn-lg shadow px-5 py-3 ${id ? 'btn-warning text-white' : 'btn-primary'}`}
                        onClick={handleSubmit}
                        style={{borderRadius: '50px', fontSize: '1.2rem'}}
                    >
                        <i className={`fa ${id ? 'fa-pencil' : 'fa-save'} me-2`}></i> 
                        {id ? "CẬP NHẬT BÀI THI PART 5" : "LƯU BÀI THI PART 5"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuizPart5;