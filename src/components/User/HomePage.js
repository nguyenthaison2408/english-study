import React from "react";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import "./HomePage.scss";

const courses = [
  { title: "Khoá học Giao tiếp A1", desc: "Bắt đầu với chào hỏi..." },
  { title: "Khoá học Giao tiếp A2", desc: "Mở rộng từ vựng..." },
  { title: "Khoá học Giao tiếp B1", desc: "Thảo luận ý kiến..." },
  { title: "Khoá học Giao tiếp B2", desc: "Nói chuyện tự nhiên..." },
  { title: "Khoá học Tiếng Anh Thương mại", desc: "Nói chuyện với đồng nghiệp..." },
];

function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleSelect = () => {
    navigate("/course"); // Không cần id
  };

  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>{course.desc}</p>
      <button className="select-btn" onClick={handleSelect}>
        Chọn
      </button>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="homepage">
      <SideBar active="Trang chủ" />
      <main className="main-content">
        <h1>Chọn khoá học</h1>
        <div className="course-grid">
          {courses.map((course, idx) => (
            <CourseCard key={idx} course={course} />
          ))}
        </div>
      </main>
    </div>
  );
}
