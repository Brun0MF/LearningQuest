

const FiltrosClass = ({categorias = [], categoriaId = "", topicosCategoria = [], topicoDisabled = true, onChangeCategoria, onApply}) => {
    
    return(
        <div className="flex flex-row gap-3 justify-between">
            <select onChange={onChangeCategoria} value={categoriaId} id="" className="w-6/12 rounded-xl border border-verdeSuave-600 px-2 focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all">
                <option value="" selected disabled>Categoria</option>
                {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>{cat.titulo_categoria}</option>
                ))}
            </select>
            <select disabled={topicoDisabled} defaultValue="" className="w-3/6 rounded-xl border border-verdeSuave-600 px-2 focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all">
                <option value="" selected disabled>Tópico</option>
                {topicosCategoria.map((top) => (
                    <option key={top.id_topico} value={top.id_topico}>{top.titulo_topico}</option>
                ))}
            </select>
            <button onClick={onApply} className="rounded-xl py-2 px-5 text-white font-medium bg-verdeSuave-600 hover:bg-verdeSuave-700">Aplicar</button>
        </div>
    );
}

export default FiltrosClass;