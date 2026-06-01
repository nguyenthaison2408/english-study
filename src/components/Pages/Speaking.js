import React from "react";
import SkillCard from "./SkillCard";

const Speaking = () => (
  <SkillCard
    title="🗣️ TOEIC Speaking Practice"
    color="#0dcaf0"
    description="Phần luyện Nói (Speaking) giúp rèn phát âm, phản xạ và trình bày ý kiến bằng tiếng Anh."
    structure={[
      "📄 Task 1-2: Đọc to đoạn văn.",
      "🖼️ Task 3-4: Mô tả hình ảnh.",
      "🎤 Task 5-7: Trả lời câu hỏi.",
      "💬 Task 8-10: Trình bày quan điểm cá nhân."
    ]}
    goals={[
      "✅ Phát âm chuẩn, ngữ điệu tự nhiên.",
      "✅ Biết tổ chức ý khi nói và dùng từ nối hợp lý.",
      "✅ Giữ tốc độ và sự tự tin khi trả lời."
    ]}
    examples={[
      "📚 Đọc một đoạn giới thiệu công ty bằng tiếng Anh.",
      "🖼️ Mô tả bức ảnh về cuộc họp hoặc lớp học.",
      "💭 Trả lời câu hỏi “Bạn thích làm việc nhóm hay độc lập hơn?”."
    ]}
  />
);

export default Speaking;
