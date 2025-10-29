import { useEffect, useState } from "react";
import { FaMedal } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getPontuacaoTopico } from "../../../api/topico";

const CardHome = ({ topicos = [] }) => {
    const [pontuacao, setPontuacao] = useState([]);
    const id_topico = topicos.id_topico;
    const top3 = (pontuacao || []).slice(0, 3);
    const placeholders = Array.from(
        { length: Math.max(0, 3 - top3.length) },
        () => ({ nome_utilizador: "Por determinar", _fake: true })
    );
    const podium = [...top3, ...placeholders];

    const handlePontuacaoCategoria = async (id_topico) => {
        try {
            const response = await getPontuacaoTopico(id_topico);
            setPontuacao(response);
            console.log(pontuacao);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        console.log(id_topico)
        handlePontuacaoCategoria(id_topico);
    }, [id_topico])

    return (
        <div className="flex flex-col gap-4 p-2 w-full rounded-xl border border-verdeSuave-600 bg-verdeSuave-50">
            <div className="flex flex-row justify-between items-center p-2">
                <h1 className="font-semibold text-2xl">{topicos.titulo_topico}</h1>
                <div className="flex flex-col items-center justify-center">
                    <img src='/astronauta_0.png' width={50} alt="" className="-mb-4" />
                    <Link to={'/jogos_niveis'} className="bg-verdeSuave-600 font-medium text-white py-2 px-5 rounded-xl hover:bg-verdeSuave-700">
                        Jogar
                    </Link>
                </div>

            </div>
            {/* <div className="mb-3">
                Aprenda a programar em uma das linguagens mais poderosas e influentes da história da computação! O Curso de Programação em C foi criado para quem quer dominar a base da lógica de programação e compreender como os programas realmente funcionam “por dentro”.
            </div> */}
            {pontuacao.length === 0
                ? <span className="rounded-lg py-1 px-3 text-center mt-5 text-gray-900 border border-blue-400 ring-1 ring-blue-200 bg-blue-100">
                    Ainda não existe um pódio
                </span>
                : <div className="flex sm:flex-row flex-col gap-3">
                    {podium.map((pont, index) => {
                            let cor = '';
                            let corMedalha = '';
                            
                            if(pont.nome_utilizador === "Por determinar") {
                                cor = 'border-gray-200 bg-white text-gray-600';
                                corMedalha = 'text-gray-300';
                            }
                            else if (index === 0) {
                                cor = 'border-yellow-500 bg-gradient-to-b from-yellow-200 to-yellow-100 text-yellow-800 shadow-md';
                                corMedalha = 'text-yellow-500';
                            }
                            else if (index === 1) {
                                cor = 'border-gray-400 bg-gradient-to-b from-gray-200 to-gray-100 text-gray-700 shadow-md';
                                corMedalha = 'text-gray-400';
                            }
                            else if (index === 2) {
                                cor = 'border-orange-800 bg-gradient-to-b from-orange-300 to-orange-200 text-orange-900 shadow-md';
                                corMedalha = 'text-orange-700';
                            }
                            
                            return (
                                <div key={index} className={`flex flex-row items-center gap-3 
                                                            sm:w-1/3 w-full py-1 px-3 rounded-xl border 
                                                            ${cor}`}>
                                    <FaMedal className={`${corMedalha} text-lg`} />
                                    <span className="font-medium w-full text-center">{pont.nome_utilizador}</span>
                                </div>
                            );
                        })}
                </div>
            }
        </div>
    );
}

export default CardHome;