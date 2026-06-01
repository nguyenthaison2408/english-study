import React from "react";
import SkillCard from "./SkillCard";

const Listening = () => (
  <SkillCard
    title="🎧 TOEIC Listening Practice"
    color="#0d6efd"
    description="Phần luyện Nghe (Listening) giúp rèn khả năng nghe hiểu hội thoại, thông báo và các đoạn nói ngắn."
    structure={[
      "🎞 Part 1: Mô tả tranh (Photographs)",
      "💬 Part 2: Hỏi – Đáp (Question – Response)",
      "🗣 Part 3: Hội thoại ngắn (Short Conversations)",
      "📢 Part 4: Bài nói ngắn (Short Talks)"
    ]}
    goals={[
      "✅ Làm quen với giọng Mỹ, Anh, Úc.",
      "✅ Nghe ý chính, chi tiết, và suy luận nội dung.",
      "✅ Nâng cao tốc độ phản xạ tiếng Anh thực tế."
    ]}
    examples={[
      "🎤 Nghe đoạn hội thoại về công việc và chọn đáp án đúng.",
      "🛫 Nghe thông báo trong sân bay và ghi lại thông tin chính.",
      "🏫 Nghe phần hướng dẫn trong lớp học hoặc công ty."
    ]}
  />
);

export default Listening;
