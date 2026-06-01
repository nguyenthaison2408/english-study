import VideoBG from "../../assets/videobg.mp4"; // Import video của bạn
import React, { useEffect } from 'react';
import Footer from '../Footer/Footer';
import './Home.scss';
import { Link } from "react-router-dom";

// Import thư viện AOS
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import CSS cần thiết cho AOS

const Home = () => {
  useEffect(() => {
    // Khởi tạo AOS với cấu hình mới
    AOS.init({
      duration: 500,
      once: false,
      easing: 'ease-in-out',
    });

    const handleSmoothScroll = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const element = document.querySelector(target.getAttribute('href'));
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  return (
    <main className="home">
      {/* Hero Section */}
      <section id="home" className="hero">
        <video autoPlay loop muted className="hero__video-bg">
          <source src={VideoBG} type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
        <div className="hero__overlay"></div>
        <div className="hero__container">
          <div className="hero__content" data-aos="fade-up" data-aos-duration="2000">
            <h1 className="hero__title">
              Chào mừng đến với
              <span className="hero__title-highlight"> Website Toeic của chúng tôi</span>
            </h1>
            <p className="hero__description">
              Chúng tôi cung cấp các dịch vụ chất lượng cao với trải nghiệm tuyệt vời
            </p>
            <div className="hero__actions">
              <button className="hero__cta-btn">Khám phá ngay</button>
              <button className="hero__secondary-btn">Tìm hiểu thêm</button>
            </div>
          </div>
        </div>
        <div className="hero__scroll-indicator">
          <div className="hero__scroll-text">Cuộn xuống</div>
          <div className="hero__scroll-arrow">↓</div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="services__container">
          <div className="services__header" data-aos="fade-right" data-aos-duration="500">
            <h2 className="services__title">Nền tảng luyện tập các chứng chỉ ngoại ngữ online</h2>
            <p className="services__description">
              Chào mừng bạn đến với nền tảng THS, một trong những trang web học tập trực tuyến hàng đầu nơi bạn có thể tìm thấy tất cả các giải pháp luyện thi miễn phí và hiệu quả.
            </p>
          </div>
          <div className="services__grid">
            <div className="service-card" data-aos="fade-up" data-aos-duration="500" data-aos-delay="300">
              <div className="service-card__icon"><span className="service-card__icon-symbol">🎧</span></div>
              <h3 className="service-card__title">Listening</h3>
              <p className="service-card__description">Đánh giá khả năng nghe và hiểu tiếng Anh trong hội thoại, thông báo và bài nói trong môi trường làm việc quốc tế.</p>
              <Link to="/listening" className="service-card__link-button">Xem chi tiết →</Link>
            </div>
            <div className="service-card" data-aos="fade-up" data-aos-duration="500" data-aos-delay="600">
              <div className="service-card__icon"><span className="service-card__icon-symbol">📖</span></div>
              <h3 className="service-card__title">Reading</h3>
              <p className="service-card__description">Kiểm tra khả năng đọc hiểu văn bản, email, thông báo, và tài liệu công việc bằng tiếng Anh một cách chính xác và nhanh chóng.</p>
              <Link to="/reading" className="service-card__link-button">Xem chi tiết →</Link>
            </div>
            <div className="service-card" data-aos="fade-up" data-aos-duration="500" data-aos-delay="900">
              <div className="service-card__icon"><span className="service-card__icon-symbol">🗣️</span></div>
              <h3 className="service-card__title">Speaking</h3>
              <p className="service-card__description">Đánh giá khả năng phát âm, diễn đạt và phản xạ trong giao tiếp tiếng Anh, giúp thể hiện ý tưởng rõ ràng và tự tin.</p>
              <Link to="/speaking" className="service-card__link-button">Xem chi tiết →</Link>
            </div>
            <div className="service-card" data-aos="fade-up" data-aos-duration="500" data-aos-delay="1200">
              <div className="service-card__icon"><span className="service-card__icon-symbol">✍️</span></div>
              <h3 className="service-card__title">Writing</h3>
              <p className="service-card__description">Kiểm tra kỹ năng viết câu, soạn email và trình bày ý kiến bằng tiếng Anh một cách logic, chuyên nghiệp và tự nhiên.</p>
              <Link to="/writting" className="service-card__link-button">Xem chi tiết →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about__container">
          <div className="about__header" data-aos="fade-right" data-aos-duration="500">
            <h2 className="about__title">Chương Trình Của Tất Cả Những Gì Bạn Đang Tìm Kiếm</h2>
            <p className="about__description">
              Chúng tôi đang tạo ra các khóa học trực tuyến và các bài kiểm tra giúp bạn cải thiện kỹ năng ngoại ngữ của mình.
            </p>
          </div>
          <div className="about__grid">
            <div className="about-card" data-aos="fade-up" data-aos-duration="500" data-aos-delay="300">
              <div className="about-card__icon"><span className="about-card__icon-symbol">💻</span></div>
              <h3 className="about-card__title">Mô phỏng đề thi thật</h3>
              <p className="about-card__description">
                Chúng tôi cung cấp các khóa học trực tuyến giúp bạn cải thiện kỹ năng ngoại ngữ của mình và thành công trong các kỳ thi quốc tế.
              </p>
            </div>
            <div className="about-card" data-aos="fade-up" data-aos-duration="500" data-aos-delay="600">
              <div className="about-card__icon"><span className="about-card__icon-symbol">📊</span></div>
              <h3 className="about-card__title">Cá nhân hóa người dùng</h3>
              <p className="about-card__description">
                Ngay sau khi hoàn thành bài thi, các thông số đánh giá chi tiết sẽ được hiển thị để bạn có thể dễ dàng theo dõi quá trình học của mình.
              </p>
            </div>
            <div className="about-card" data-aos="fade-up" data-aos-duration="500" data-aos-delay="900">
              <div className="about-card__icon"><span className="about-card__icon-symbol">📱</span></div>
              <h3 className="about-card__title">Hệ thống ứng dụng thông minh</h3>
              <p className="about-card__description">
                THS phát triển hệ thống ứng dụng học tập phong phú, người dùng có thể tải về để học tập nâng cao điểm số

              </p>
            </div>
            <div className="about-card" data-aos="fade-up" data-aos-duration="500" data-aos-delay="1200">
              <div className="about-card__icon"><span className="about-card__icon-symbol">👥</span></div>
              <h3 className="about-card__title">Hỗ trợ nhanh chóng</h3>
              <p className="about-card__description">
                Chúng tôi cung cấp đội ngũ chuyên gia hỗ trợ bạn trong suốt quá trình học tập của mình.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="contact__container">
          <div className="contact__content" data-aos="fade-up" data-aos-duration="500">
            <h2 className="contact__title">Liên hệ với chúng tôi</h2>
            <p className="contact__description">
              Hãy liên hệ để được tư vấn và hỗ trợ tốt nhất
            </p>
            <div className="contact__info">
              <div className="contact__info-item" data-aos="fade-up" data-aos-duration="500" data-aos-delay="300">
                <span className="contact__info-icon">📞</span>
                <span className="contact__info-text">+84 123 456 789</span>
              </div>
              <div className="contact__info-item" data-aos="fade-up" data-aos-duration="500" data-aos-delay="600">
                <span className="contact__info-icon">📧</span>
                <span className="contact__info-text">info@example.com</span>
              </div>
              <div className="contact__info-item" data-aos="fade-up" data-aos-duration="500" data-aos-delay="900">
                <span className="contact__info-icon">📍</span>
                <span className="contact__info-text">123 Đường ABC, TP.HCM</span>
              </div>
            </div>
          </div>
          <div className="contact__form" data-aos="fade-left" data-aos-duration="500" data-aos-delay="500">
            <form className="contact-form">
              <div className="contact-form__group">
                <label className="contact-form__label" htmlFor="name">Họ tên</label>
                <input type="text" id="name" name="name" className="contact-form__input" required />
              </div>
              <div className="contact-form__group">
                <label className="contact-form__label" htmlFor="email">Email</label>
                <input type="email" id="email" name="email" className="contact-form__input" required />
              </div>
              <div className="contact-form__group">
                <label className="contact-form__label" htmlFor="message">Tin nhắn</label>
                <textarea id="message" name="message" rows="5" className="contact-form__textarea" required></textarea>
              </div>
              <button type="submit" className="contact-form__submit-btn">Gửi tin nhắn</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;