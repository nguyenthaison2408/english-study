import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { postCreateNewQuiz, getQuizById, putUpdateQuiz } from '../../../../services/quizService';

const CreateQuizPart1 = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy ID từ URL nếu đang Edit
    const isEdit = !!id; // Biến kiểm tra chế độ

    // State thông tin chung
    const [quizInfo, setQuizInfo] = useState({
        title: '',
        description: '',
        level: 'Easy',
        timeLimit: 10,
        part: 1,
        audio: '', 
    });

    // State danh sách câu hỏi
    const initQuestions = Array.from({ length: 6 }, () => ({
        questionText: ["Listen to the audio and choose the best description."], 
        questionImage: '', 
        point: 5,
        correctAnswer: '', 
        explanation: '',
        options: [
            { text: '(A)', image: '' },
            { text: '(B)', image: '' },
            { text: '(C)', image: '' },
            { text: '(D)', image: '' }
        ]
    }));

    const [questions, setQuestions] = useState(initQuestions);

    // SỬA LỖI: Bọc hàm này trong useCallback
    const fetchQuizDetail = useCallback(async () => {
        try {
            let res = await getQuizById(id);
            if (res && res.data) {
                const data = res.data;
                
                // Debug xem có audio về không
                console.log("Check data detail:", data);

                // Fill data vào form
                setQuizInfo({
                    title: data.title || '',
                    description: data.description || '',
                    level: data.level || 'Easy',
                    timeLimit: data.timeLimit || 10,
                    part: 1,
                    // Lấy audio từ server, nếu không có thì để rỗng
                    audio: data.audio || '', 
                });

                if (data.questions && data.questions.length > 0) {
                    const formattedQuestions = data.questions.map(q => ({
                        questionText: q.questionText || ["Listen to the audio..."],
                        questionImage: q.questionImage || '',
                        point: q.point || 1,
                        correctAnswer: q.correctAnswer || '',
                        explanation: q.explanation || '',
                        options: q.options && q.options.length > 0 ? q.options : [
                            { text: '(A)' }, { text: '(B)' }, { text: '(C)' }, { text: '(D)' }
                        ]
                    }));
                    setQuestions(formattedQuestions);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Lỗi tải dữ liệu bài thi!");
        }
    }, [id]); // Hàm này phụ thuộc vào ID

    // --- EFFECT: Load dữ liệu khi Edit ---
    useEffect(() => {
        if (isEdit) {
            fetchQuizDetail();
        }
    }, [id, isEdit, fetchQuizDetail]); // Thêm fetchQuizDetail vào đây là an toàn

    // --- CÁC HÀM XỬ LÝ FORM ---
    const handleInfoChange = (e) => {
        setQuizInfo({ ...quizInfo, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswer = (qIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = value;
        setQuestions(newQuestions);
    };

    // --- SUBMIT ---
    const handleSubmit = async () => {
        // Validate
        if (!quizInfo.title) return toast.error("Vui lòng nhập tên bài thi!");
        if (!quizInfo.audio) return toast.error("Vui lòng nhập link Audio!");

        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].questionImage) return toast.warning(`Câu ${i + 1} thiếu ảnh!`);
            if (!questions[i].correctAnswer) return toast.error(`Câu ${i + 1} chưa chọn đáp án đúng!`);
        }

        const payload = {
            title: quizInfo.title,
            description: quizInfo.description,
            part: 1,
            level: quizInfo.level,
            timeLimit: Number(quizInfo.timeLimit),
            audio: quizInfo.audio,
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
                toast.success(isEdit ? "Cập nhật thành công!" : "Tạo mới thành công!");
                navigate('/admin/manage-quiz/part/1'); 
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi lưu!");
            console.log(error);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="text-primary mb-4 text-center">
                {isEdit ? `Cập nhật Bài Thi: ${quizInfo.title}` : "Tạo Quiz Mới - Part 1"}
            </h2>

            {/* Thông tin chung */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Thông tin chung & Audio</h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Tên bài thi</label>
                            <input 
                                type="text" className="form-control" name="title"
                                value={quizInfo.title} onChange={handleInfoChange} 
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
                                value={quizInfo.audio} onChange={handleInfoChange}
                                placeholder="https://example.com/audio.mp3"
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Mô tả</label>
                            <textarea className="form-control" name="description" value={quizInfo.description} onChange={handleInfoChange} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách câu hỏi */}
            {questions.map((q, index) => (
                <div key={index} className="card mb-4 border-secondary">
                    <div className="card-header bg-light"><strong>Question {index + 1}</strong></div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <label className="form-label">Link Ảnh</label>
                                <input 
                                    type="text" className="form-control mb-2" 
                                    value={q.questionImage}
                                    onChange={(e) => handleQuestionChange(index, 'questionImage', e.target.value)} 
                                />
                                {q.questionImage && <img src={q.questionImage} alt="Preview" style={{maxHeight: '150px'}} />}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Đáp án đúng:</label>
                                <div className="d-flex gap-3 mb-3">
                                    {q.options.map((opt, i) => (
                                        <div key={i} className="form-check">
                                            <input 
                                                className="form-check-input" type="radio" 
                                                name={`q-${index}`} 
                                                checked={q.correctAnswer === opt.text}
                                                onChange={() => handleCorrectAnswer(index, opt.text)}
                                            />
                                            <label className="form-check-label fw-bold">{opt.text}</label>
                                        </div>
                                    ))}
                                </div>
                                <input 
                                    type="text" className="form-control" placeholder="Giải thích đáp án..."
                                    value={q.explanation}
                                    onChange={(e) => handleQuestionChange(index, 'explanation', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button className={`btn w-100 btn-lg ${isEdit ? 'btn-warning' : 'btn-success'}`} onClick={handleSubmit}>
                {isEdit ? "LƯU CẬP NHẬT" : "TẠO MỚI"}
            </button>
        </div>
    );
};

export default CreateQuizPart1;