import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Thêm useParams
import { toast } from 'react-toastify';
// Import thêm api get và put
import { postCreateNewQuiz, getQuizById, putUpdateQuiz } from '../../../../services/quizService'; 

import './CreateQuizPart2.scss'; 

const CreateQuizPart2 = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy ID từ URL (nếu có)
    const isEdit = !!id; // Biến cờ kiểm tra đang là Mode Edit hay Create

    const [quizInfo, setQuizInfo] = useState({
        title: '',
        description: '',
        level: 'Easy',
        timeLimit: 12,
        part: 2, 
        audio: '', // Audio chung cho cả bài
    });

    // --- KHỞI TẠO 25 CÂU HỎI ---
    const initQuestions = Array.from({ length: 25 }, (_, i) => ({
        questionText: ["Mark your answer on your answer sheet."], 
        questionImage: '', 
        point: 5,
        correctAnswer: '', 
        explanation: '', 
        options: [
            { text: 'A', image: '' },
            { text: 'B', image: '' },
            { text: 'C', image: '' }
        ]
    }));

    const [questions, setQuestions] = useState(initQuestions);

    // --- LOGIC FETCH DATA KHI EDIT ---
    const fetchQuizDetail = useCallback(async () => {
        try {
            let res = await getQuizById(id);
            if (res && res.data) {
                const data = res.data;
                
                // 1. Fill thông tin chung
                setQuizInfo({
                    title: data.title || '',
                    description: data.description || '',
                    level: data.level || 'Easy',
                    timeLimit: data.timeLimit || 12,
                    part: 2,
                    // Quan trọng: Lấy audio từ DB hiển thị lên input
                    audio: data.audio || '', 
                });

                // 2. Fill danh sách câu hỏi
                if (data.questions && data.questions.length > 0) {
                    const formattedQuestions = data.questions.map(q => ({
                        // Nếu DB có text thì lấy, không thì dùng text mặc định của Part 2
                        questionText: (q.questionText && q.questionText.length > 0) 
                                      ? q.questionText 
                                      : ["Mark your answer on your answer sheet."],
                        questionImage: '', // Part 2 ko có ảnh
                        point: q.point || 1,
                        correctAnswer: q.correctAnswer || '',
                        explanation: q.explanation || '',
                        // Part 2 có 3 đáp án
                        options: (q.options && q.options.length > 0) 
                                 ? q.options 
                                 : [{ text: 'A' }, { text: 'B' }, { text: 'C' }]
                    }));
                    setQuestions(formattedQuestions);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Lỗi tải dữ liệu bài thi!");
        }
    }, [id]);

    useEffect(() => {
        if (isEdit) {
            fetchQuizDetail();
        }
    }, [id, isEdit, fetchQuizDetail]);


    // --- CÁC HÀM XỬ LÝ FORM ---
    const handleInfoChange = (e) => setQuizInfo({ ...quizInfo, [e.target.name]: e.target.value });
    
    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].explanation = value;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswer = (qIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = value;
        setQuestions(newQuestions);
    };

    // --- SUBMIT (CREATE & UPDATE) ---
    const handleSubmit = async () => {
        // 1. Validate
        if (!quizInfo.title) return toast.error("Vui lòng nhập tên bài thi!");
        if (!quizInfo.audio) return toast.error("Vui lòng nhập link Audio!");

        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].correctAnswer) {
                return toast.error(`Câu ${i + 7} chưa chọn đáp án đúng!`);
            }
        }

        // 2. Prepare Payload
        const payload = {
            title: quizInfo.title,
            description: quizInfo.description,
            part: 2, // Hardcode Part 2
            level: quizInfo.level,
            timeLimit: Number(quizInfo.timeLimit),
            audio: quizInfo.audio, // Gửi audio ở root level (Backend đã fix để nhận cái này)
            questions: questions
        };

        try {
            let res;
            if (isEdit) {
                // Gọi API Update
                res = await putUpdateQuiz(id, payload);
            } else {
                // Gọi API Create
                res = await postCreateNewQuiz(payload);
            }

            if (res) {
                toast.success(isEdit ? "Cập nhật thành công!" : "Tạo bài thi Part 2 thành công!");
                navigate('/admin/manage-quiz/part/2'); 
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Có lỗi xảy ra!");
            }
        }
    };

    return (
        <div className="create-quiz-container container-fluid py-4">
            <div className="container">
                <h2 className="text-primary mb-4 text-center fw-bold">
                    {isEdit ? `CẬP NHẬT QUIZ: ${quizInfo.title}` : "TẠO QUIZ PART 2 (Question - Response)"}
                </h2>

                {/* --- PHẦN 1: THÔNG TIN CHUNG --- */}
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-primary text-white">
                        <i className="fa fa-info-circle me-2"></i>Thông tin bài thi (Câu 7 - 31)
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Tên bài thi</label>
                                <input 
                                    type="text" className="form-control" name="title"
                                    value={quizInfo.title} onChange={handleInfoChange} 
                                    placeholder="VD: ETS 2024 Test 1 - Part 2" 
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Độ khó</label>
                                <select className="form-select" name="level" value={quizInfo.level} onChange={handleInfoChange}>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Thời gian (phút)</label>
                                <input 
                                    type="number" className="form-control" name="timeLimit" 
                                    value={quizInfo.timeLimit} onChange={handleInfoChange} 
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold text-danger">Link Audio URL</label>
                                <input 
                                    type="text" className="form-control" name="audio" 
                                    placeholder="https://example.com/audio-part2.mp3" 
                                    value={quizInfo.audio} onChange={handleInfoChange}
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold">Mô tả</label>
                                <textarea 
                                    className="form-control" name="description" rows="1" 
                                    value={quizInfo.description} onChange={handleInfoChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- PHẦN 2: DANH SÁCH CÂU HỎI --- */}
                <h5 className="mb-3 text-primary border-bottom pb-2">Danh sách câu hỏi (Key)</h5>
                
                <div className="row">
                    {questions.map((q, index) => (
                        <div key={index} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100">
                                <div className="card-header d-flex justify-content-between align-items-center bg-light">
                                    <span>Question <strong>{index + 7}</strong></span>
                                    {q.correctAnswer ? 
                                        <span className="badge bg-success">Key: {q.correctAnswer}</span> : 
                                        <span className="badge bg-secondary">Chưa chọn</span>
                                    }
                                </div>
                                <div className="card-body text-center">
                                    <p className="static-text mb-3" style={{ fontStyle: 'italic', color: '#666' }}>
                                        "{q.questionText[0]}"
                                    </p>
                                    
                                    {/* 3 Nút tròn chọn đáp án */}
                                    <div className="answer-selection">
                                        {q.options.map((opt, i) => (
                                            <div 
                                                key={i}
                                                className={`btn-answer ${q.correctAnswer === opt.text ? 'active' : ''}`}
                                                onClick={() => handleCorrectAnswer(index, opt.text)}
                                            >
                                                {opt.text}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Input nhập Transcript */}
                                    <div className="mt-3">
                                        <input 
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Nhập transcript/giải thích..."
                                            value={q.explanation || ''}
                                            onChange={(e) => handleQuestionChange(index, e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- NÚT SUBMIT --- */}
                <div className="d-grid gap-2 col-md-4 mx-auto mt-4 pb-5">
                    <button 
                        className={`btn btn-lg shadow ${isEdit ? 'btn-warning' : 'btn-primary'}`} 
                        onClick={handleSubmit}
                    >
                        <i className="fa fa-save me-2"></i> 
                        {isEdit ? "LƯU CẬP NHẬT" : "LƯU BÀI THI"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuizPart2;