import React from "react";
import SkillCard from "./SkillCard";

const Reading = () => (
  <SkillCard
    title="📖 TOEIC Reading Practice"
    color="#198754"
    description="Phần luyện Đọc (Reading) giúp nâng cao kỹ năng hiểu bài, từ vựng, ngữ pháp và tốc độ đọc."
    structure={[
      "📄 Part 5: Hoàn thành câu (Incomplete Sentences)",
      "📄 Part 6: Hoàn thành đoạn văn (Text Completion)",
      "📄 Part 7: Đọc hiểu (Reading Comprehension)"
    ]}
    goals={[
      "✅ Nắm được ý chính và chi tiết của đoạn văn.",
      "✅ Phân tích ngữ pháp và từ vựng trong ngữ cảnh.",
      "✅ Tăng tốc độ đọc và phản xạ với bài thi TOEIC."
    ]}
    examples={[
      "📝 Hoàn thành câu bằng từ thích hợp.",
      "📚 Hoàn thiện đoạn văn dựa trên ngữ cảnh.",
      "💡 Trả lời câu hỏi về bài đọc dài."
    ]}
  />
);

export default Reading;
