import FiltrosHome from "../../components/home/filtros_home";
import CardHome from "../../components/home/cards_home";
import { useEffect, useState } from "react";
import { getCategorias, getTopicos_categoria } from "../../../api/categoria";
import { getTopicos } from "../../../api/topico";

const Home = () => {
    const [categorias, setCategorias] = useState([]);
    const [categoriaId, setCategoriaId] = useState("");
    
    const [topicosCategoria, setTopicosCategoria] = useState([]);


    const [loadingTopicos, setLoadingTopicos] = useState(false);
    
    const handleCategorias = async () => {
        try {
            const response = await getCategorias();
            setCategorias(response);
        } catch(e) {
            console.log(e);
        }
    }

    const handleTopicosCategoria = async (id_categoria) => {
        try {
            setLoadingTopicos(true);
            const response = await getTopicos_categoria(id_categoria);
            setTopicosCategoria(response);
            console.log(response);
        } catch(e) {
            console.log(e);
        } finally {
            setLoadingTopicos(false);
        }
    }

    const handleTopicos = async () => {
        try {
            setLoadingTopicos(true);
            const response = await getTopicos();
            setTopicosCategoria(response);
            console.log(response);
        } catch(e) {
            console.log(e);
        } finally {
            setLoadingTopicos(false);
        }
    }

    const onChangeCategoria = (e) => {
        const id = e.target.value;
        setCategoriaId(id);
        setTopicosCategoria([]);
    }

    useEffect(() => {
        handleCategorias();
        handleTopicos();
    }, [])

    useEffect(() => {
        if(categoriaId === "") handleTopicos();
        handleTopicosCategoria(categoriaId);
    }, [categoriaId])

    return (
        <div className="flex flex-col mx-[15%] gap-4 p-4">
            <FiltrosHome categorias={categorias} categoriaId={categoriaId} onChangeCategoria={onChangeCategoria} />
            <div className="flex flex-col gap-4 justify-center ">
                {topicosCategoria.map((top) => (
                    <CardHome topicos={top} />
                ))}
            </div>
        </div>
    )
}

export default Home;