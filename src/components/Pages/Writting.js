import React from "react";
import SkillCard from "./SkillCard";

const Writing = () => (
  <SkillCard
    title="✍️ TOEIC Writing Practice"
    color="#dc3545"
    description="Phần luyện Viết (Writing) giúp luyện kỹ năng viết câu, mô tả hình ảnh và viết bài luận ngắn."
    structure={[
      "🖼️ Task 1-5: Viết câu mô tả hình ảnh.",
      "📧 Task 6-7: Viết câu phản hồi email.",
      "📝 Task 8: Viết đoạn văn thể hiện quan điểm cá nhân."
    ]}
    goals={[
      "✅ Viết đúng ngữ pháp và cấu trúc câu.",
      "✅ Dùng từ vựng trang trọng, phù hợp bối cảnh công sở.",
      "✅ Diễn đạt ý rõ ràng, mạch lạc, có kết nối giữa các câu."
    ]}
    examples={[
      "🖼️ Mô tả một bức ảnh trong 3 câu.",
      "📧 Viết phản hồi cho email khách hàng.",
      "💡 Trình bày ý kiến về “Làm việc tại nhà có lợi không?”."
    ]}
  />
);

export default Writing;
