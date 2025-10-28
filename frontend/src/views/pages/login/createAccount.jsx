import { register } from "../../../api/utilizadores";
import { useState } from "react";

const CreateAccount = () => {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await register({ nome, email, password });
            console.log("Conta criada com sucesso:", data);

        } catch (err) {
            setError(err.response?.data?.error || "Erro ao criar conta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <small className="mb-4 text-gray-700 text-center">Preencha os campos para criação da conta</small>
            <div className="flex flex-col mb-4">
                <label htmlFor="" className="mb-2 text-sm font-medium text-gray-700">Nome</label>
                <input value={nome} onChange={(e) => setNome(e.target.value)} type="text" placeholder="Ex: Catarina Costa" className="px-4 py-2 border border-gray-300 rounded-lg focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all" />
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor="" className="mb-2 text-sm font-medium text-gray-700">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="email@example.com" className="px-4 py-2 border border-gray-300 rounded-lg focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all" />
            </div>
            <div className="flex flex-col w-full mb-6">
                <label htmlFor="" className="mb-2 text-sm font-medium text-gray-700">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" placeholder="******" className="px-4 py-2 border border-gray-300 rounded-lg focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all" />
            </div>
            <button className="bg-verdeSuave-600 text-white font-medium min-w-full px-4 py-2 rounded-lg mb-4 hover:bg-verdeSuave-700">
                Seguinte
            </button>
        </form>
    );
}

export default CreateAccount