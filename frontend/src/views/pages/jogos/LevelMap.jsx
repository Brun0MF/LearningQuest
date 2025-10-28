import React, { useState } from "react";
import { Link } from "react-router-dom";

const LevelPath = () => {
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);
  const [score, setScore] = useState(5); // pontuação
  const [hoveredLevel, setHoveredLevel] = useState(null);

  const getHorizontalOffset = (index) => {
    const maxOffset = 200;
    const minOffset = -200;
    return minOffset + ((Math.sin(index * 0.8) + 1) / 2) * (maxOffset - minOffset);
  };

  const headerHeight = 80;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Nuvens animadas */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {[...Array(8)].map((_, i) => {
          const size = 60 + Math.random() * 40;
          const top = i * 300 + Math.random() * 200;
          const duration = 30 + Math.random() * 20;
          const delay = Math.random() * -20;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: `${size}px`,
                height: `${size * 0.4}px`,
                top: `${top}px`,
                background: "#d2dcf3ff",
                borderRadius: "100px",
                opacity: 0.7,
                animation: `driftCloud ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: `${size * 0.5}px`,
                  height: `${size * 0.5}px`,
                  top: `-${size * 0.2}px`,
                  left: `${size * 0.1}px`,
                  background: "#7c8da2ff",
                  borderRadius: "100px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: `${size * 0.6}px`,
                  height: `${size * 0.6}px`,
                  top: `-${size * 0.25}px`,
                  right: `${size * 0.1}px`,
                  background: "#d2dcf3ff",
                  borderRadius: "100px",
                }}
              />
            </div>
          );
        })}
      </div>

      <style>
        {`
          @keyframes floatUpDown {
            0% {
              transform: translateX(var(--offset-x)) translateY(0);
            }
            50% {
              transform: translateX(var(--offset-x)) translateY(-15px);
            }
            100% {
              transform: translateX(var(--offset-x)) translateY(0);
            }
          }
          
          @keyframes driftCloud {
            0% {
              transform: translateX(-100px);
            }
            100% {
              transform: translateX(100vw);
            }
          }
        `}
      </style>

      {/* Conteúdo das ilhas */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: `${headerHeight + 20}px`,
          paddingBottom: "40px",
          background: "transparent",
        }}
      >
        {levels.map((lvl, index) => {
          const offsetX = getHorizontalOffset(index);

          return (
            <div
              key={lvl}
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                marginTop: "50px",
                position: "relative",
              }}
            >
              {/* Ilha flutuante */}
              <Link to={`/nivel/${lvl}`}>
                <img
                  src="/flutua.png"
                  alt={`Ilha ${lvl}`}
                  style={{
                    width: "180px",
                    height: "auto",
                    objectFit: "contain",
                    cursor: "pointer",
                    "--offset-x": `${offsetX}px`,
                    transform: `translateX(${offsetX}px)`,
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.animation = `floatUpDown 1.5s ease-in-out infinite`)
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.animation = "none")}
                />
              </Link>

              {/* Imagem do nível sempre à frente */}
              <img
                src={`/nivel/${lvl}.png`}
                alt={`Pré-visualização do nível ${lvl}`}
                style={{
                  position: "absolute",
                  top: "90%",
                  left: "50%",
                  transform: `translate(calc(-50% + ${offsetX}px), -50%)`,
                  width: "150px",
                  height: "auto",
                  borderRadius: "10px",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelPath;