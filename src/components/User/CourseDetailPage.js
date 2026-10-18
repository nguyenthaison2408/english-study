import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../User/SideBar";
import { useVoc } from "../../hooks/useVoc";
import "./CourseDetailPage.scss";
import { BookOpen, Sparkles, Award, ArrowRight } from "lucide-react";

export default function CourseDetailPage() {
  const navigate = useNavigate();
  const { voc, getAllVoc } = useVoc();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndBuildLessons = async () => {
      setLoading(true);
      let vocList = voc;
      if (!vocList || vocList.length === 0) {
        const res = await getAllVoc();
        if (res?.data) {
          vocList = res.data;
        }
      }

      // Đếm số từ theo level từ DB
      const countMap = {};
      if (Array.isArray(vocList)) {
        vocList.forEach((v) => {
          const lvl = v.level || "A1";
          countMap[lvl] = (countMap[lvl] || 0) + 1;
        });
      }

      const standardLessons = [
        {
          id: 1,
          title: "Từ vựng Cơ bản A1 - Starter",
          level: "A1",
          description: "Các từ vựng tiếng Anh cơ bản nhất dành cho người mới bắt đầu.",
          badge: "Cơ bản"
        },
        {
          id: 2,
          title: "Từ vựng Sơ cấp A2 - Elementary",
          level: "A2",
          description: "Mở rộng vốn từ mô tả cuộc sống hàng ngày, gia đình, công việc.",
          badge: "Sơ cấp"
        },
        {
          id: 3,
          title: "Từ vựng Trung cấp B1 - Intermediate",
          level: "B1",
          description: "Nắm vững vốn từ giao tiếp tự tin và làm việc trong môi trường văn phòng.",
          badge: "Trung cấp"
        },
        {
          id: 4,
          title: "Từ vựng Chuyên đề B2 - Upper Intermediate",
          level: "B2",
          description: "Từ vựng học thuật, viết luận và thuyết trình chuyên nghiệp.",
          badge: "Trung cấp cao"
        },
        {
          id: 5,
          title: "Từ vựng Luyện thi TOEIC 600+",
          level: "TOEIC",
          description: "Các từ vựng thường xuất hiện nhất trong Part 1 đến Part 7 đề thi TOEIC.",
          badge: "Luyện thi"
        },
        {
          id: 6,
          title: "Từ vựng Học thuật IELTS 6.5+",
          level: "IELTS",
          description: "Vốn từ cao cấp hỗ trợ kỹ năng Reading và Writing theo chủ đề khó.",
          badge: "Học thuật"
        }
      ];

      // Gắn số lượng từ thực tế từ database vào mỗi bài học
      const enrichedLessons = standardLessons.map((item) => ({
        ...item,
        wordCount: countMap[item.level] || (item.level === "A1" ? 6 : 0)
      }));

      setLessons(enrichedLessons);
      setLoading(false);
    };

    fetchAndBuildLessons();
  }, [getAllVoc, voc]);

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
            <div 
              style={{ 
                width: 50, 
                height: 50, 
                borderRadius: '50%', 
                backgroundColor: '#3b82f6', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#fff',
                fontSize: 22 
              }}
            >
              🎓
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                Lộ Trình Học Từ Vựng Tiếng Anh Chuẩn CEFR & TOEIC
              </h2>
              <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
                Chọn cấp độ phù hợp để học thẻ Flashcard và rèn luyện phát âm bản xứ
              </p>
            </div>
          </div>
        </div>

        <div className="lesson-container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Đang tải danh sách bài học...</p>
            </div>
          ) : (
            lessons.map((lesson) => (
              <div key={lesson.id} className="vocab-card">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge bg-primary" style={{ fontSize: '0.75rem' }}>
                    {lesson.badge}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>
                    📚 {lesson.wordCount > 0 ? `${lesson.wordCount} từ có sẵn` : 'Đang cập nhật'}
                  </span>
                </div>
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>
                <button
                  className="next-btn d-flex align-items-center justify-content-center gap-2"
                  onClick={() => handleNext(lesson)}
                >
                  Bắt đầu học <ArrowRight size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}