import { FaTrophy } from "react-icons/fa";
import FiltrosClass from "../../components/classificacao/filtros_classificacao";
import { getCategorias, getTopicos_categoria } from "../../../api/categoria";
import { useState, useEffect } from "react";
import { getPontuacaoUtilizador, getUtilizadores } from "../../../api/utilizadores";

const Classificacao = () => {
    const [activeTab, setActiveTab] = useState("geral");

    const [pontuacaoGeral, setPontuacaoGeral] = useState([]);
    const [pontuacaoCategoria, setPontuacaoCategoria] = useState([]);

    const [categorias, setCategorias] = useState([]);
    const [categoriaId, setCategoriaId] = useState("");

    const [topicosCategoria, setTopicosCategoria] = useState([]);

    const [loadingTopicos, setLoadingTopicos] = useState(false);

    const topicoDisabled = !categoriaId || loadingTopicos || topicosCategoria.length === 0;

    const handleCategorias = async () => {
        try {
            const response = await getCategorias();
            setCategorias(response);
        } catch (e) {
            console.log(e);
        }
    }

    const handleTopicosCategoria = async (id_categoria) => {
        try {
            setLoadingTopicos(true);
            const response = await getTopicos_categoria(id_categoria);
            setTopicosCategoria(response);
            console.log(response);
        } catch (e) {
            console.log(e);
        } finally {
            setLoadingTopicos(false);
        }
    }

    const handleUtilizadores = async () => {
        try {
            const response = await getPontuacaoUtilizador();
            setPontuacaoGeral(response);
        } catch(e) {
            console.log(e);
        }
    }

    const onChangeCategoria = (e) => {
        const id = e.target.value;
        setCategoriaId(id);
        setTopicosCategoria([]);
    }

    const onApply = () => {
        try {

        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        handleUtilizadores();
    }, [])

    useEffect(() => {
        handleCategorias();
    }, [])

    useEffect(() => {
        handleTopicosCategoria(categoriaId);
    }, [categoriaId])

    return (
        <div className="flex flex-col mx-[15%] gap-4 p-4">
            <ul id="tabs" className="flex flex-wrap text-sm font-medium text-center text-verdeSuave-500 border-b border-verdeSuave-200">
                <li class="me-2">
                    <button
                        onClick={() => setActiveTab("geral")}
                        className={`p-4 rounded-t-lg ${activeTab === "geral"
                            ? "text-verdeSuave-800 bg-gradient-to-t from-verdeSuave-200 to-verdeSuave-50"
                            : "hover:bg-gradient-to-t hover:from-verdeSuave-100 to-verdeSuave-50 text-verdeSuave-600"
                        }`}
                    >
                        Pontuação Geral
                    </button>
                </li>
                <li class="me-2">
                    <button
                        onClick={() => setActiveTab("categoria")}
                        className={`p-4 rounded-t-lg ${activeTab === "categoria"
                            ? "text-verdeSuave-800 bg-gradient-to-t from-verdeSuave-200 to-verdeSuave-50"
                            : "hover:bg-gradient-to-t hover:from-verdeSuave-100 to-verdeSuave-50 text-verdeSuave-600"
                        }`}
                    >
                        Pontuação por tópico
                    </button>
                </li>
            </ul>
            <div id="tab-contents">
                {activeTab === "geral" && (
                    <div id="geral" className="flex flex-col gap-5">
                        <div className="flex flex-col gap-4 justify-center items-center">
                            {/* {pontuacaoGeral.map((geral) => (
                                return(
                                    <div>

                                    </div>
                                )
                            ))} */}
                            <div className="flex flex-row gap-6 items-center justify-center">
                                <div
                                    className="relative flex flex-col items-center justify-between w-1/4 max-w-md
                                        rounded-2xl p-7 border border-gray-400 
                                        bg-gradient-to-b from-gray-200 via-gray-100 to-gray-50
                                        text-gray-700 shadow-md">
                                    <FaTrophy className="text-gray-400 size-3/4" />
                                    <span className="mt-2 font-semibold text-center text-gray-800 text-lg">
                                        Ana Silva
                                    </span>
                                    <span className="mt-1 text-sm font-bold text-gray-700 bg-gray-100 p-1 rounded-lg">
                                        1900 XP
                                    </span>
                                </div>
                                <div className="relative flex flex-col items-center justify-between w-1/4 max-w-md
                                    rounded-2xl p-7 border border-yellow-300 bg-gradient-to-b from-yellow-50 
                                    via-yellow-50 to-yellow-100 shadow-md">
                                    <FaTrophy className="text-yellow-500 size-full" />
                                    <span className="mt-2 font-semibold text-center text-yellow-800 text-lg">Antonio Costa</span>
                                    <span className="mt-1 text-sm font-bold text-yellow-700 bg-yellow-100 p-1 rounded-lg">
                                        2000 XP
                                    </span>
                                </div>
                                <div
                                    className="relative flex flex-col items-center justify-between w-1/4 max-w-md
                                        rounded-2xl p-7 border border-orange-800 
                                        bg-gradient-to-b from-orange-300 via-orange-200 to-orange-100 
                                        text-orange-900 shadow-md">
                                    <FaTrophy className="text-orange-700 size-1/2" />
                                    <span className="mt-2 font-semibold text-center text-orange-900 text-lg">
                                        Antonio Costa
                                    </span>
                                    <span className="mt-1 text-sm font-bold text-orange-800 bg-orange-100 p-1 rounded-lg">
                                        2000 XP
                                    </span>
                                </div>

                            </div>

                            <div className="flex flex-col w-full gap-3">
                                {frutas.map((fruta, index) => {
                                    let cor = '';
                                    cor = 'border-verdeSuave-300 bg-gradient-to-b from-verdeSuave-200 to-verdeSuave-50 text-orange-900 shadow-md';
                                    return (
                                        <div key={index} className={`flex flex-row items-center justify-between w-full py-3 px-5 
                                                            rounded-xl border border-verdeSuave-200 bg-gradient-to-b 
                                                            from-white to-verdeSuave-50 hover:from-verdeSuave-50 
                                                            hover:to-white transition-all shadow-sm`}>
                                            <div className="flex flex-row items-center gap-6">
                                                <span className="text-verdeSuave-700 font-bold text-lg w-6 text-right">{index + 4}</span>
                                                <span className="font-medium text-gray-800 text-base">{fruta}</span>
                                            </div>
                                            <div className="text-sm font-semibold text-verdeSuave-700 bg-verdeSuave-100 px-3 py-1 rounded-lg">
                                                1000 XP
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "categoria" && (
                    <div id="categoria" className="flex flex-col gap-5">
                        <FiltrosClass
                            categorias={categorias}
                            categoriaId={categoriaId}
                            topicosCategoria={topicosCategoria}
                            topicoDisabled={topicoDisabled}
                            onChangeCategoria={onChangeCategoria}
                            onApply={onApply}
                        />
                        <div className="flex flex-col gap-4 justify-center items-center">
                            <div className="flex flex-row gap-6 items-center justify-center">
                                <div
                                    className="relative flex flex-col items-center justify-between w-1/4 max-w-md
                                        rounded-2xl p-7 border border-gray-400 
                                        bg-gradient-to-b from-gray-200 via-gray-100 to-gray-50
                                        text-gray-700 shadow-md">
                                    <FaTrophy className="text-gray-400 size-3/4" />
                                    <span className="mt-2 font-semibold text-center text-gray-800 text-lg">
                                        Ana Silva
                                    </span>
                                    <span className="mt-1 text-sm font-bold text-gray-700 bg-gray-100 p-1 rounded-lg">
                                        1900 XP
                                    </span>
                                </div>
                                <div className="relative flex flex-col items-center justify-between w-1/4 max-w-md
                                    rounded-2xl p-7 border border-yellow-300 bg-gradient-to-b from-yellow-50 
                                    via-yellow-50 to-yellow-100 shadow-md">
                                    <FaTrophy className="text-yellow-500 size-full" />
                                    <span className="mt-2 font-semibold text-center text-yellow-800 text-lg">Antonio Costa</span>
                                    <span className="mt-1 text-sm font-bold text-yellow-700 bg-yellow-100 p-1 rounded-lg">
                                        2000 XP
                                    </span>
                                </div>
                                <div
                                    className="relative flex flex-col items-center justify-between w-1/4 max-w-md
                                        rounded-2xl p-7 border border-orange-800 
                                        bg-gradient-to-b from-orange-300 via-orange-200 to-orange-100 
                                        text-orange-900 shadow-md">
                                    <FaTrophy className="text-orange-700 size-1/2" />
                                    <span className="mt-2 font-semibold text-center text-orange-900 text-lg">
                                        Antonio Costa
                                    </span>
                                    <span className="mt-1 text-sm font-bold text-orange-800 bg-orange-100 p-1 rounded-lg">
                                        2000 XP
                                    </span>
                                </div>

                            </div>

                            <div className="flex flex-col w-full gap-3">
                                {frutas.map((fruta, index) => {
                                    let cor = '';
                                    cor = 'border-verdeSuave-300 bg-gradient-to-b from-verdeSuave-200 to-verdeSuave-50 text-orange-900 shadow-md';
                                    return (
                                        <div key={index} className={`flex flex-row items-center justify-between w-full py-3 px-5 
                                                            rounded-xl border border-verdeSuave-200 bg-gradient-to-b 
                                                            from-white to-verdeSuave-50 hover:from-verdeSuave-50 
                                                            hover:to-white transition-all shadow-sm`}>
                                            <div className="flex flex-row items-center gap-6">
                                                <span className="text-verdeSuave-700 font-bold text-lg w-6 text-right">{index + 4}</span>
                                                <span className="font-medium text-gray-800 text-base">{fruta}</span>
                                            </div>
                                            <div className="text-sm font-semibold text-verdeSuave-700 bg-verdeSuave-100 px-3 py-1 rounded-lg">
                                                1000 XP
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Classificacao;