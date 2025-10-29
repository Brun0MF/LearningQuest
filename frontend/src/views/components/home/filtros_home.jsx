

const FiltrosHome = ({categorias = [], categoriaId = "", onChangeCategoria}) => {
    
    return(
        <div className="flex flex-row gap-3 items-center">
            <label htmlFor="" className="font-medium">Categoria:</label>
            <select onChange={onChangeCategoria} value={categoriaId} id="" className="w-6/12 rounded-xl border border-verdeSuave-600 px-2 py-2 focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all">
                <option value="" selected>Todas</option>
                {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>{cat.titulo_categoria}</option>
                ))}
            </select>
        </div>
    );
}

export default FiltrosHome;