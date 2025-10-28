

const CreateAccount = () => {
    return (
        <div className="flex flex-col w-full">
            <small className="mb-4 text-gray-700 text-center">Preencha os campos para criação da conta</small>
            <div className="flex flex-col mb-4">
                <label htmlFor="" className="mb-2 text-sm font-medium text-gray-700">Email</label>
                <input type="text" placeholder="email@example.com" className="px-4 py-2 border border-gray-300 rounded-lg focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all" />
            </div>
            <div className="flex flex-col w-full mb-6">
                <label htmlFor="" className="mb-2 text-sm font-medium text-gray-700">Password</label>
                <input type="text" placeholder="******" className="px-4 py-2 border border-gray-300 rounded-lg focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all" />
            </div>
            <button className="bg-verdeSuave-600 text-white font-medium min-w-full px-4 py-2 rounded-lg mb-4 hover:bg-verdeSuave-700">
                Seguinte
            </button>
        </div>
    );
}

export default CreateAccount