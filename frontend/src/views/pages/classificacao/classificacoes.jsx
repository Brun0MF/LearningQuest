import { FaTrophy } from "react-icons/fa";
import FiltrosClass from "../../components/classificacao/filtros_classificacao";
import { getCategorias, getTopicos_categoria } from "../../../api/categoria";
import { useState, useEffect } from "react";
import { getPontuacaoUtilizador, getUtilizadores } from "../../../api/utilizadores";
import PontuacaoList from "../../components/classificacao/list_pontuacao";
import { getPontuacaoTopico } from "../../../api/topico";

const Classificacao = () => {
    const [activeTab, setActiveTab] = useState("geral");

    const [pontuacaoGeral, setPontuacaoGeral] = useState([]);
    const [pontuacaoCategoria, setPontuacaoCategoria] = useState([]);

    const [categorias, setCategorias] = useState([]);
    const [categoriaId, setCategoriaId] = useState("");

    const [topicosCategoria, setTopicosCategoria] = useState([]);
    const [topicoId, setTopicoId] = useState("");

    const [loadingTopicos, setLoadingTopicos] = useState(false);
    const [loadingPontuacao, setLoadingPontuacao] = useState(false);

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

    const handlePontuacaoGeral = async () => {
        try {
            setLoadingPontuacao(true);
            const response = await getPontuacaoUtilizador();
            setPontuacaoGeral(response);
        } catch (e) {
            console.log(e);
        } finally {
            setLoadingPontuacao(false);
        }
    }

    const handlePontuacaoCategoria = async (id_topico) => {
        try {
            setLoadingPontuacao(true);
            const response = await getPontuacaoTopico(id_topico);
            setPontuacaoCategoria(response);
            console.log(pontuacaoCategoria);
        } catch (e) {
            console.log(e);
        } finally {
            setLoadingPontuacao(false);
        }
    }

    const onChangeTopico = (e) => {
        const id = e.target.value;
        setTopicoId(id);
    }

    const onChangeCategoria = (e) => {
        const id = e.target.value;
        setCategoriaId(id);
        setTopicoId("");
        setTopicosCategoria([]);
    }

    const onApply = () => {
        try {
            if (!topicoId) {
                alert("Por favor, selecione um tópico antes de aplicar.");
                return;
            }
            handlePontuacaoCategoria(topicoId);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        handlePontuacaoGeral();
    }, [])

    useEffect(() => {
        handleCategorias();
    }, [])

    useEffect(() => {
        if (categoriaId !== "") handleTopicosCategoria(categoriaId);
    }, [categoriaId])

    return (
        <div className="flex flex-col mx-[15%] gap-4 p-4">
            <ul id="tabs" className="flex flex-wrap text-sm font-medium text-center text-verdeSuave-500 border-b border-verdeSuave-200">
                <li className="me-2">
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
                <li className="me-2">
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
                        <PontuacaoList pontuacao={pontuacaoGeral} />
                    </div>
                )}
                {activeTab === "categoria" && (
                    <div id="categoria" className="flex flex-col gap-5">
                        <FiltrosClass
                            categorias={categorias}
                            categoriaId={categoriaId}
                            topicosCategoria={topicosCategoria}
                            topicoId={topicoId}
                            topicoDisabled={topicoDisabled}
                            onChangeCategoria={onChangeCategoria}
                            onChangeTopico={onChangeTopico}
                            onApply={onApply}
                        />
                        <PontuacaoList pontuacao={pontuacaoCategoria} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Classificacao;