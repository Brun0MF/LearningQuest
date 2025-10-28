

const FiltrosHome = () => {

    return (
        <div className="flex flex-row gap-3 justify-between">
            <select name="" id="" className="w-6/12 rounded-xl border border-verdeSuave-600 px-2 focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all">
                <option value="">Categoria</option>
            </select>
            <select name="" id="" className="w-3/6 rounded-xl border border-verdeSuave-600 px-2 focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all">
                <option value="">Tópico</option>
            </select>
            <button className="rounded-xl py-2 px-5 text-white font-medium bg-verdeSuave-600 hover:bg-verdeSuave-700">Aplicar</button>
        </div>
    );
}

export default FiltrosHome;