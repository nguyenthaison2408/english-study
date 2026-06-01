import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../User/SideBar";
import "./CourseDetailPage.scss";

export default function CourseDetailPage() {
  const navigate = useNavigate();


  const [lessons, setLessons] = useState([]);

  // 🔹 State loading (mở rộng cho sau này)
  const [loading, setLoading] = useState(true);

  // 🔹 useEffect: chạy khi component mount
  useEffect(() => {
   
    const fetchLessons = () => {
      const lessonData = [
        { id: 1, title: "Bài học cơ bản 1", level: "A1" },
        { id: 2, title: "Bài học cơ bản 2", level: "A2" },
        { id: 3, title: "Bài học cơ bản 3", level: "B1" },
        { id: 4, title: "Bài học cơ bản 4", level: "B2" },
        { id: 5, title: "Bài học cơ bản 5", level: "C1" },
        { id: 5, title: "Bài học cơ bản 5", level: "C1" },
        { id: 5, title: "Bài học cơ bản 6", level: "C2" },

        { id: 6, title: "Bài học nâng cao 1", level: "IELTS" },
        { id: 7, title: "Bài học nâng cao 2", level: "TOEIC" },
        { id: 8, title: "Bài học nâng cao 3", level: "TOEFL" },
        { id: 9, title: "Bài học nâng cao 4", level: "General" },
      
      ];

      setLessons(lessonData);
      setLoading(false);
    };

    fetchLessons();
  }, []);


  const handleNext = (lesson) => {
    navigate("/vocab-page", {
      state: {
        level: lesson.level,
        lesson: lesson,
      },
    });
  };

  return (
    <div className="course-detail-page">
      <SideBar active="Trang chủ" />

      <main className="course-main">
        <div className="course-header">
          <div className="avatar-block">
            <img
              src="https://i.pravatar.cc/150"
              className="teacher-avatar"
              alt="avatar"
            />
           
          </div>
        </div>

        <div className="lesson-container">
          {loading ? (
            <p>Đang tải bài học...</p>
          ) : (
            lessons.map((lesson) => (
              <div key={lesson.id} className="vocab-card">
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>
                <button
                  className="next-btn"
                  onClick={() => handleNext(lesson)}
                >
                  Bài học tiếp theo
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
