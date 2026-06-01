import React from "react";
import "./PageStyle.scss";
import "bootstrap/dist/css/bootstrap.min.css";

const SkillCard = ({ title, color, description, structure, goals, examples }) => {
  return (
    <div className="page">
      <div className="container py-5">
        <div className="card shadow-lg p-5 border-0 rounded-5 skill-card" style={{ borderTop: `5px solid ${color}` }}>
          <h1 className="text-center mb-4 fw-bold" style={{ color }}>
            {title}
          </h1>

          <p className="lead text-center text-dark mb-5">
            {description}
          </p>

          <div className="row justify-content-center text-start">
            <div className="col-md-8">
              {structure && (
                <>
                  <h3 className="text-secondary fw-semibold mb-3">📘 Cấu trúc:</h3>
                  <ul className="list-group list-group-flush mb-4">
                    {structure.map((item, idx) => (
                      <li key={idx} className="list-group-item">{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {goals && (
                <>
                  <h3 className="text-secondary fw-semibold mb-3">🎯 Mục tiêu luyện tập:</h3>
                  <ul className="mb-4">
                    {goals.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {examples && (
                <>
                  <h3 className="text-secondary fw-semibold mb-3">📝 Bài luyện mẫu:</h3>
                  <ul className="mb-5">
                    {examples.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              <div className="text-center">
                <button
                  className="btn btn-outline-dark btn-lg px-4 rounded-pill shadow-sm"
                  onClick={() => window.history.back()}
                >
                  ← Quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
