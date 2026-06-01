import React, { useState, useMemo } from "react";
import "./PracticePage.scss";
import { useAuth } from "../../../hooks/useAuth";
import { useVoc } from "../../../hooks/useVoc";
import { toast } from "react-toastify";


const PracticePage = ({ onClose, words = [] }) => {

 
  const { user, isAuthenticated , addXp} = useAuth();
  const { updateVoc } = useVoc();


  const [currentWordIndex, setCurrentWordIndex] = useState(0); // vị trí từ hiện tại
  const [userInput, setUserInput] = useState(""); // từ người dùng nhập
  const [score, setScore] = useState(0); // số câu trả lời đúng
  const [showResult, setShowResult] = useState(false); // hiển thị màn hình kết quả
  const [isCorrect, setIsCorrect] = useState(null); // trạng thái đúng / sai

  
  const currentUserName = user?.name || user?.username;

//danh sách chjaw học
  const unlearnedWords = useMemo(() => {
    if (!Array.isArray(words)) return [];

    // Nếu chưa đăng nhập → coi như chưa học từ nào
    if (!isAuthenticated || !currentUserName) {
      return words;
    }

    // Lọc các từ user chưa có trong user_learned
    return words.filter(word => {
      const learned = word.user_learned || [];

      return !learned.some(u => {
        if (!u) return false;

        // user_learned là string
        if (typeof u === "string") {
          return u.toLowerCase() === currentUserName.toLowerCase();
        }

        // user_learned là object
        if (typeof u === "object") {
          const name = u.username || u.name || u._id;
          return (
            typeof name === "string" &&
            name.toLowerCase() === currentUserName.toLowerCase()
          );
        }

        return false;
      });
    });
  }, [words, isAuthenticated, currentUserName]);

 //từ hiện tại
  const currentWord = unlearnedWords[currentWordIndex] || null;

 //check đá án
  const checkAnswer = async () => {
    if (!currentWord || !userInput.trim()) return;

    // So sánh đáp án (không phân biệt hoa thường)
    const correct =
      userInput.trim().toLowerCase() ===
      currentWord.word.toLowerCase();

    setIsCorrect(correct);

    // Sai → báo lỗi và dừng
    if (!correct) {
      toast.error("Sai rồi! Thử lại nhé!");
      return;
    }

    // Đúng → cộng điểm
    setScore(prev => prev + 1);
    try {
        await addXp(user._id,1);
      } catch (err) {
        console.error(err);
      }
   

    // Nếu đã đăng nhập → lưu trạng thái đã học lên backend
    if (isAuthenticated && currentUserName) {
      try {
        await updateVoc(currentWord._id, {
          user_learned: [currentUserName],
        });
      } catch (err) {
        console.error(err);
      }
    }

    toast.success(" Chính xác!");

    // Chuyển sang từ tiếp theo sau 0.8s
    setTimeout(moveToNextWord, 800);
  };


  const moveToNextWord = () => {
    if (currentWordIndex < unlearnedWords.length - 1) {
      setCurrentWordIndex(i => i + 1);
      setUserInput("");
      setIsCorrect(null);
    } else {
      // Hết từ → hiện màn hình kết quả
      setShowResult(true);
    }
  };

//bỏ qua từ hiện tại
  const skipWord = () => {
    moveToNextWord();
  };


  const restartPractice = () => {
    setCurrentWordIndex(0);
    setScore(0);
    setUserInput("");
    setShowResult(false);
    setIsCorrect(null);
  };


  const resetLearnedUser = async () => {
    if (!isAuthenticated || !currentUserName) {
      toast.info("Vui lòng đăng nhập để sử dụng tính năng này");
      return;
    }

    try {
      toast.info("Đang reset tiến độ học...");
      
      for (const word of words) {
        const learned = word.user_learned || [];

        // Loại bỏ user hiện tại khỏi danh sách đã học
        const newLearned = learned.filter(u => {
          if (!u) return false;

          if (typeof u === "string") {
            return u.toLowerCase() !== currentUserName.toLowerCase();
          }

          if (typeof u === "object") {
            const name = u.username || u.name || u._id;
            return (
              typeof name === "string" &&
              name.toLowerCase() !== currentUserName.toLowerCase()
            );
          }
          return true;
        });

        // Chỉ update backend khi có thay đổi
        if (newLearned.length !== learned.length) {
          await updateVoc(word._id, {
            user_learned: newLearned,
          });
        }
      }

      toast.success("Đã reset tiến độ học thành công!");
      restartPractice();
    } catch (error) {
      console.error(error);
      toast.error("Không thể reset tiến độ. Vui lòng thử lại!");
    }
  };


  if (showResult) {
    return (
      <div className="practice-overlay">
        <div className="practice-modal">
          <div className="result-screen">
            <h2>🎯 Kết quả luyện tập</h2>
            <p>{score}/{unlearnedWords.length} từ đúng</p>

            <div className="result-actions">
            
            

              {/* Reset toàn bộ tiến độ học - CHỈ KHI NGƯỜI DÙNG CLICK */}
              <button
                className="btn-reset-progress"
                onClick={resetLearnedUser}
              >
                🧹 Học lại từ đầu
              </button>

              <button className="btn-close-practice" onClick={onClose}>
                ✅ Hoàn thành
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (unlearnedWords.length === 0) {
    return (
      <div className="practice-overlay">
        <div className="practice-modal">
          <div className="no-words">
            <h3>🎉 Xin chúc mừng!</h3>
            <p>Bạn đã học tất cả {words.length} từ vựng!</p>

            <div className="no-words-actions">
              <button
                className="btn-reset-progress"
                onClick={resetLearnedUser}
              >
                🧹 Học lại từ đầu
              </button>

              <button className="btn-close-practice" onClick={onClose}>
                ✅ Hoàn thành
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

 
  return (
    <div className="practice-overlay">
      <div className="practice-modal">

        {/* HEADER */}
        <div className="practice-header">
          <div className="score-info">
            <span className="score-label">Điểm:</span>
            <span className="score-value">{score}</span>
          </div>

          {isAuthenticated && currentUserName && (
            <div className="user-info-header">
              <span className="user-name">{currentUserName} </span>
           
            </div>
          )}

          <button className="btn-close-practice" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="practice-content">

          {/* HÌNH ẢNH */}
          <div className="practice-image-container">
            {currentWord?.image ? (
              <img
                src={currentWord.image}
                alt={currentWord.word}
                className="practice-image"
              />
            ) : (
              <div className="image-placeholder">
                {currentWord?.word?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          {/* CÂU HỎI */}
          <div className="question-section">
            <p className="question-text">
              Hãy nhập từ tiếng Anh cho hình ảnh này:
            </p>

            <div
              className={`input-container ${
                isCorrect === true
                  ? "correct"
                  : isCorrect === false
                  ? "incorrect"
                  : ""
              }`}
            >
              <input
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Nhập từ tiếng Anh..."
                className="answer-input"
                disabled={isCorrect === true}
                onKeyDown={e => e.key === "Enter" && checkAnswer()}
              />

              {isCorrect === true && (
                <div className="feedback correct-feedback">
                  ✓ Chính xác!
                </div>
              )}

              {isCorrect === false && (
                <div className="feedback incorrect-feedback">
                  ✗ Sai rồi! Từ đúng là:{" "}
                  <strong>{currentWord.word}</strong>
                </div>
              )}
            </div>
          </div>

          {/* NÚT ĐIỀU KHIỂN */}
          <div className="control-buttons">
            <button className="btn-skip" onClick={skipWord}>
              ⏭️ Bỏ qua
            </button>

            <button
              className="btn-submit"
              onClick={checkAnswer}
              disabled={!userInput.trim() || isCorrect === true}
            >
              {isCorrect === true ? "✅ Đã học" : "📤 Kiểm tra"}
            </button>
          </div>

          {/* THANH TIẾN TRÌNH */}
          {/* <div className="progress-section">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    ((words.length - unlearnedWords.length) /
                      (words.length || 1)) *
                    100
                  }%`,
                }}
              />
            </div>
            <p className="progress-text">
              Đã học <strong>{words.length - unlearnedWords.length}</strong> / {words.length} từ
            </p>
          </div> */}

        </div>
      </div>
    </div>
  );
};

export default PracticePage;