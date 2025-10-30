import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const QuizPopUp = ({
  perguntas = [],
  onTerminar,
  incrementa = false,
  pontos = 0,
  pontosMax = 0,
  onPontuacaoChange,
}) => {
  const lista = useMemo(() => (Array.isArray(perguntas) ? perguntas : []), [perguntas]);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [validated, setValidated] = useState(false);

  // SWAL: guarda para não repetir o popup de conclusão
  const [finalizado, setFinalizado] = useState(false);

  // ⚡ Atualiza quando perguntas mudam
  useEffect(() => {
    setCurrent(0);
    setSelected(null);
    setValidated(false);
    // SWAL: reset do guarda quando muda a lista
    setFinalizado(false);
  }, [lista]);

  const question = lista[current];
  const opcoes = Array.isArray(question?.opcoes) ? question.opcoes : [];

  const handleValidate = () => {
    if (selected === null || !question) return;

    const corretaIndex = Number(question.correta);
    const acertou = selected === corretaIndex;

    // Atualiza XP global
    if (incrementa && typeof onPontuacaoChange === "function") {
      onPontuacaoChange(acertou ? 2 : -2);
    }

    setValidated(true);
  };

  const handleNext = () => {
    if (lista.length === 0) return;

    // Vai para a próxima pergunta (loop infinito)
    const next = (current + 1) % lista.length;
    setCurrent(next);
    setSelected(null);
    setValidated(false);
  };

  // ⚡ Efeito: se atingir o máximo de pontos, mostra popup de sucesso
  useEffect(() => {
    // SWAL: dispara só uma vez e apenas com alvo válido
    if (finalizado) return;
    if (incrementa && pontos >= pontosMax && pontosMax > 0) {
      setFinalizado(true);
      Swal.fire({
        icon: "success",
        title: "🎉 Nível concluído!",
        text: "Parabéns! Conquistou todos os pontos deste nível.",
        confirmButtonColor: "#16a34a",
      }).then(() => {
        onTerminar();
      });
    }
  }, [pontos, pontosMax, incrementa, onTerminar, finalizado]);

  return (
    <div className="flex flex-col gap-5">
      {!incrementa && (
        <span className="flex flex-row items-center justify-center gap-2 rounded-lg py-1 px-3 text-center mt-2 text-sm text-gray-800 border border-blue-400 ring-1 ring-blue-200 bg-blue-100">
          <AiOutlineExclamationCircle className="text-blue-500" />
          Nível ultrapassado! Este questionário não vai alterar o seu XP atual.
        </span>
      )}

      <h2 className="text-lg font-semibold">
        {question?.pergunta ?? "Pergunta indisponível"}
      </h2>

      <div className="text-sm text-gray-600">
        Pontos: <span className="font-bold">{pontos}</span> / {pontosMax}
      </div>

      <div className="flex flex-col gap-2">
        {opcoes.map((opcao, index) => {
          const isSelected = selected === index;
          let classes =
            "w-full p-2 rounded-xl border transition disabled:cursor-not-allowed";

          if (!validated) {
            classes +=
              " border-gray-600 hover:text-white hover:bg-gray-400" +
              (isSelected
                ? " border border-0 ring-2 ring-gray-400 bg-gray-300"
                : "");
          } else {
            const corretaIndex = Number(question.correta);
            if (index === selected) {
              classes +=
                selected === corretaIndex
                  ? " border-green-600 bg-green-100 text-green-800"
                  : " border-red-600 bg-red-100 text-red-800";
            } else if (index === corretaIndex) {
              classes += " border-green-600 bg-green-50";
            } else {
              classes += " opacity-60";
            }
          }

          return (
            <button
              key={index}
              disabled={validated}
              onClick={() => setSelected(index)}
              className={classes}
            >
              {opcao}
            </button>
          );
        })}
      </div>

      <div className="flex flex-row justify-between gap-4">
        <button
          onClick={onTerminar}
          className="rounded-xl px-3 py-2 text-white font-medium bg-red-600 hover:bg-red-700"
        >
          Terminar
        </button>

        {!validated ? (
          <button
            onClick={handleValidate}
            disabled={selected === null}
            className="rounded-xl px-3 py-2 text-white font-medium bg-verdeSuave-600 hover:bg-verdeSuave-700 disabled:opacity-50"
          >
            Validar
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="rounded-xl px-3 py-2 text-white font-medium bg-verdeSuave-600 hover:bg-verdeSuave-700"
          >
            Próxima
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPopUp;
