import { useEffect, useState } from "react";
import QuizPopUp from "../../components/quiz/popup";
import { getPontuacao_user_topico, updatePontuacao } from "../../../api/pontuacao";
import { useParams } from "react-router-dom";
import { getPerguntasNivel } from "../../../api/perguntas";
import { getNivelTopico } from "../../../api/niveis";
import { editarPontuacaoTotal, getPontuacaoTotal } from "../../../api/utilizadores";

const LevelPath = () => {
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState(() => {
    const raw = localStorage.getItem("id_user");
    const parsed =
      raw && raw !== "null" && raw !== "undefined" ? parseInt(raw, 10) : NaN;
    return Number.isNaN(parsed) ? null : parsed;
  });
  const [pontuacao, setPontuacao] = useState([]);
  const closeModal = () => setIsOpen(false);
  const { id_topico } = useParams();
  const [incrementa, setIncrementa] = useState(false);
  const [perguntas, setPerguntas] = useState([]);
  const [nivelID, setNivelID] = useState("");

  const pontos = pontuacao?.pontos ?? 0;
  const nivelAtual = Math.min(10, Math.max(1, Math.floor(pontos / 10) + 1));
  const baseDoNivel = (nivelAtual - 1) * 10;
  const progresso = ((pontos - baseDoNivel) / 10) * 100;
  const [pontuacaoTotal, setPontuacaoTotal] = useState(0);
  const [deltaTotal, setDeltaTotal] = useState(0);
  const [pontosAlvo, setPontosAlvo] = useState(0);
  const [bloquearXP, setBloquearXP] = useState(false);

  const getHorizontalOffset = (index) => {
    const maxOffset = 200;
    const minOffset = -200;
    return minOffset + ((Math.sin(index * 0.8) + 1) / 2) * (maxOffset - minOffset);
  };

  const headerHeight = 80;

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        if (!userId) return;
        const total = await getPontuacaoTotal(userId);
        setPontuacaoTotal(Number.isFinite(total) ? total : 0);
      } catch (e) {
        console.log(e);
        setPontuacaoTotal(0);
      }
    };
    fetchTotal();
  }, [userId]);

  const handlePontuacaoUserTopico = async (id_user, id_topico) => {
    try {
      const response = await getPontuacao_user_topico(id_user, id_topico);
      setPontuacao(response.data);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  const handleNivelTopicoPont = async (nivelSelecionado) => {
    try {
      const pontosMax = nivelSelecionado * 10;
      const response = await getNivelTopico(id_topico, pontosMax);
      console.log(response);
      setNivelID(response.id_nivel);
    } catch (e) {
      console.log(e);
    }
  }

  const handlePerguntas = async () => {
    try {
      const response = getPerguntasNivel(id_topico, nivelID);
      setPerguntas(response?.data ?? response ?? []);
    } catch (e) {
      console.log(e);
      setPerguntas([]);
    }
  }

  const handleFim = async () => {
    try {
      await updatePontuacao(userId, id_topico, pontos);
      if (deltaTotal !== 0) {
        const novoTotal = Math.max(0, (pontuacaoTotal ?? 0) + deltaTotal);

        setPontuacaoTotal(novoTotal);

        await editarPontuacaoTotal(userId, novoTotal);

        setDeltaTotal(0);
      }
      closeModal();
    } catch (e) {
      console.log(e);
    }
  }

  const handlePontuacaoChange = (delta) => {
    if (!incrementa || bloquearXP) return;

    setPontuacao((prev) => {
      const atual = prev.pontos ?? 0;
      const novo = Math.max(0, Math.min(pontosAlvo, atual + delta)); // cap nos pontosAlvo

      // acumula delta total apenas se mudou
      if (novo !== atual) {
        setDeltaTotal((d) => d + (novo - atual));
      }

      // se atingiu o alvo, bloqueia novos incrementos (mas NÃO mexe no incrementa)
      if (novo >= pontosAlvo) {
        setBloquearXP(true);
      }

      return { ...prev, pontos: novo };
    });
  };

  useEffect(() => {
    if (userId && id_topico) handlePontuacaoUserTopico(userId, Number(id_topico))
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
          @keyframes floatUpDownKeepX {
            0%   { transform: translateX(var(--offset-x)) translateY(0); }
            50%  { transform: translateX(var(--offset-x)) translateY(-15px); }
            100% { transform: translateX(var(--offset-x)) translateY(0); }
          }
          @keyframes driftCloud {
            0% { transform: translateX(-100px); }
            100% { transform: translateX(100vw); }
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
        {/* PONTUACAO */}
        <div className="flex flex-col -mt-10 bg-verdeSuave-100 rounded-lg p-3 w-2/3 gap-2 border border-verdeSuave-200">
          <div className="flex flex-row justify-between">
            <span className="p-1 font-semibold">Nível {nivelAtual}</span>
            <span className="p-1 font-semibold">{pontuacao.pontos} XP</span>
          </div>
          <div className="w-full border border-verdeSuave-400 rounded-lg h-3">
            <div
              className="h-full bg-verdeSuave-400 transition-all duration-500"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>

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
              <button
                onClick={async () => {
                  try {
                    await handleNivelTopicoPont(lvl);
                    await handlePerguntas();
                    const alvo = (Math.floor(pontos / 10) + 1) * 10;
                    setPontosAlvo(alvo);
                    setBloquearXP(false);
                    setIsOpen(true);
                    console.log(nivelID)
                    if (lvl === nivelAtual) {
                      setIncrementa(true);
                    } else {
                      setIncrementa(false);
                    }
                  } catch (e) {
                    Swal.fire({
                      icon: "error",
                      title: "Erro",
                      text: "Não foi possível carregar os dados. Tente novamente.",
                      confirmButtonColor: "#dc2626",
                    });
                  }

                }}
                disabled={lvl > nivelAtual}
                style={{
                  "--offset-x": `${offsetX}px`,
                  transform: `translateX(var(--offset-x))`,
                  transition: "transform 0.3s ease",
                  background: "transparent",
                  border: "none",
                  cursor: lvl > nivelAtual ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (lvl <= nivelAtual) {
                    e.currentTarget.style.animation = "floatUpDownKeepX 1.5s ease-in-out infinite";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.animation = "none";
                }}
              >
                <img
                  src="/flutua.png"
                  alt={`Ilha ${lvl}`}
                  style={{
                    width: "180px",
                    height: "auto",
                    objectFit: "contain",
                    filter: lvl > nivelAtual ? "grayscale(100%) brightness(0.8)" : "none",
                    opacity: lvl > nivelAtual ? 0.7 : 1,
                    pointerEvents: "none",
                  }}
                />
              </button>

              {/* Imagem do nível sempre à frente */}
              <img src={`/nivel/${lvl}.png`}
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
                  transition: "filter 0.3s ease",
                  filter:
                    lvl < nivelAtual
                      ? "sepia(1) saturate(3) hue-rotate(40deg) brightness(1.25) contrast(1.1)"
                      : "none",

                }}
              />
            </div>
          );
        })}
        {isOpen && (
          <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full relative animate-fadeIn">
              <QuizPopUp
                perguntas={perguntas}
                onTerminar={handleFim}
                incrementa={incrementa}
                pontos={pontuacao.pontos}
                pontosMax={pontosAlvo}
                onPontuacaoChange={handlePontuacaoChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelPath;