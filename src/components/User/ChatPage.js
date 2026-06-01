import React from "react";
import "./ChatPage.scss";
import Sidebar from "./SideBar";

const ChatPage = () => {
  const trendingChats = [
    { user: "bạn Emily", role: "học sinh", message: "2 người mới gặp và muốn làm quen..." },
    { user: "giám khảo", role: "janifer", message: "ielts speaking part 1" },
    { user: "AI teacher", role: "người học tiếng Anh", message: "hãy nói chuyện với tôi về các chủ đề..." },
    { user: "IELTS teacher", role: "Student", message: "Can you tell me about your hometown?" },
    { user: "người hỏi đường", role: "người hỏi đường", message: "bạn đang đi thi có người hỏi đường..." },
    { user: "giáo viên", role: "học sinh", message: "What's your name?" },
    { user: "người bạn lạ", role: "guess", message: "Bắt gặp nhau ngay trong quán cà phê..." },
  ];

  const a1Lessons = [
    { title: "Làm quen với đồng nghiệp mới", image: "/images/lesson1.jpg" },
    { title: "Tìm hiểu đối tượng hẹn hò", image: "/images/lesson2.jpg" },
    { title: "Chia sẻ về việc rèn luyện sức khoẻ", image: "/images/lesson3.jpg" },
    { title: "Trò chuyện về truyền thống gia đình", image: "/images/lesson4.jpg" },
    { title: "Hướng dẫn khách du lịch tới địa điểm địa phương", image: "/images/lesson5.jpg" },
    { title: "Thú cưng trong gia đình", image: "/images/lesson6.jpg" },
    { title: "Cùng nhau khám phá sở thích ngoài trời", image: "/images/lesson7.jpg" },
    { title: "Ốm li bì mấy ngày 😢", image: "/images/lesson8.jpg" },
  ];

  return (
    <div className="chatpage-wrapper">
      {/* Sidebar bên trái */}
      <Sidebar />

      {/* Nội dung chính */}
      <div className="chat-page">
        <div className="chat-header">
          <h2>Trending</h2>
          <button className="see-more">Xem chi tiết</button>
        </div>

        <div className="chat-trending">
          {trendingChats.map((chat, index) => (
            <div className="chat-card" key={index}>
              <div className="chat-user">
                <div className="avatar" />
                <div className="info">
                  <h4>{chat.user}</h4>
                  <span>{chat.role}</span>
                </div>
              </div>
              <p>{chat.message}</p>
              <div className="chat-actions">
                <button className="replay-btn">↩</button>
                <button className="copy-btn">📋</button>
              </div>
            </div>
          ))}
        </div>

        <h3 className="level-title">Cấp độ A1</h3>

        <div className="lesson-grid">
          {a1Lessons.map((lesson, i) => (
            <div className="lesson-card" key={i}>
              <img src={lesson.image} alt={lesson.title} />
              <div className="lesson-title">{lesson.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
