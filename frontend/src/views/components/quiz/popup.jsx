import { useState } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const QuizPopUp = ({onTerminar, incrementa = false, pontos = "", onPontuacaoChange}) => {
  const quizQuestions = [
    {
      pergunta:
        "Qual das seguintes opções declara corretamente um ponteiro para um inteiro em linguagem C?",
      opcoes: ["int p", "int *p", "int& p", "pointer int p"],
      correta: 1,
    },
    {
      pergunta: "Qual biblioteca deve ser incluída para usar a função printf()?",
      opcoes: [
        "#include <stdlib.h>",
        "#include <stdio.h>",
        "#include <string.h>",
        "#include <math.h>",
      ],
      correta: 1,
    },
    {
      pergunta: "Qual operador é usado para comparar igualdade em C?",
      opcoes: ["=", "==", "===", "!="],
      correta: 1,
    },
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [validated, setValidated] = useState(false); 
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quizQuestions[current];

  const handleValidate = () => {
    if (selected === null) return;
    if(incrementa) {
      if (selected === question.correta) {
        onPontuacaoChange(2);
      } else {
        onPontuacaoChange(-2);
      }  
    }
    
    setValidated(true);
  };

  const handleNext = () => {
    if (current < quizQuestions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setValidated(false);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setValidated(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold">Resultado</h2>
        <p className="text-lg">
          Pontuação: <span className="font-bold">{score}</span> / {quizQuestions.length}
        </p>
        <button
          onClick={restart}
          className="rounded-xl px-4 py-2 text-white font-medium bg-verdeSuave-600 hover:bg-verdeSuave-700"
        >
          Recomeçar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {incrementa === false &&
        <span className="flex flex-row items-center justify-center gap-2 rounded-lg py-1 px-3 text-center mt-5 text-sm text-gray-800 border border-blue-400 ring-1 ring-blue-200 bg-blue-100">
          <AiOutlineExclamationCircle className="text-blue-500" /> Nível ultrapassado! Este questionário não vai alterar o seu xp atual.
        </span>
      }
      <h2 className="text-lg font-semibold">{question.pergunta}</h2>
      {pontos}
      <div className="flex flex-col gap-2">
        {question.opcoes.map((opcao, index) => {
          const isSelected = selected === index;

          let classes =
            "w-full p-2 rounded-xl border transition disabled:cursor-not-allowed";

          if (!validated) {
            classes +=
              " border-gray-600 hover:text-white hover:bg-gray-400" +
              (isSelected ? "border border-0 ring-2 ring-gray-400 bg-gray-300" : "");
          } else {
            if (index === selected) {
              classes +=
                selected === question.correta
                  ? " border-green-600 bg-green-100 text-green-800"
                  : " border-red-600 bg-red-100 text-red-800";
            } else if (index === question.correta) {
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
        <button onClick={onTerminar} className="rounded-xl px-3 py-2 text-white font-medium bg-red-600 hover:bg-red-700">
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
