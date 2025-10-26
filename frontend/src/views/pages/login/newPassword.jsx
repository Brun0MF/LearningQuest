

const NewPassword = () => {
    return(
        <div className="flex flex-col w-full">
            <div className="flex flex-col mb-4">
                <label htmlFor="" className="mb-2 text-sm font-medium text-gray-700">Nova Password</label>
                <input type="password" placeholder="******" className="px-4 py-2 border border-gray-300 rounded-lg focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all" />
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor="" className="mb-2 text-sm font-medium text-gray-700">Repita a Password</label>
                <input type="password" placeholder="******" className="px-4 py-2 border border-gray-300 rounded-lg focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all" />
            </div>
            <button className="bg-verdeSuave-600 text-white font-medium min-w-full px-4 py-2 rounded-lg mb-4 hover:bg-verdeSuave-700">
                Mudar Password
            </button>
        </div>
    );
}

export default NewPassword;