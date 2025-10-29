import { useEffect, useState } from "react";
import QuizPopUp from "../../components/quiz/popup";
import { getPontuacao_user_topico } from "../../../api/pontuacao";
import { useParams } from "react-router-dom";

const LevelPath = () => {
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [pontuacao, setPontuacao] = useState([]);
  const closeModal = () => setIsOpen(false);
  const { id_topico } = useParams();

  const getHorizontalOffset = (index) => {
    const maxOffset = 200;
    const minOffset = -200;
    return minOffset + ((Math.sin(index * 0.8) + 1) / 2) * (maxOffset - minOffset);
  };

  const headerHeight = 80;

  const handlePontuacaoUserTopico = async (id_user, id_topico) => {
    try {
      const response = await getPontuacao_user_topico(id_user, id_topico);
      setPontuacao(response);
    } catch (e) {
      console.log(e);
    }
  }

  const handleFim = () => {
    try {
      closeModal();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const raw = localStorage.getItem("id_user");
    const parsed = raw && raw !== "null" && raw !== "undefined" ? parseInt(raw, 10) : NaN;
    setUserId(Number.isNaN(parsed) ? null : parsed);
    console.log(userId);
  }, [])

  useEffect(() => {
    handlePontuacaoUserTopico(userId, Number(id_topico))
  }, [userId, id_topico])

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
          {/* ✅ Barra de pontuação no topo */}
      <div className="flex-col">
        <img src="/estrela.svg" alt="estrela" className="w-5 h-5" />
        <span>Pontuação: {pontuacao}</span>
      </div>
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
              <button onClick={() => setIsOpen(true)}>
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
              </button>

              {isOpen && (
                <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full relative animate-fadeIn">
                    <QuizPopUp onTerminar={handleFim} />
                  </div>
                </div>
              )}
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