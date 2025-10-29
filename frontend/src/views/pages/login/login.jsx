import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../../api/utilizadores";
import Swal from 'sweetalert2'

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const data = await login(email, password);
            console.log("Login efetuado com sucesso:", data);
            setEmail("");
            setPassword("");
            navigate("/jogos");
            Swal.fire({
                icon: "success",
                title: "Login efetuado com sucesso!",
                text: "Bem-vindo(a)!",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Erro ao efetuar login";

            Swal.fire({
                icon: "error",
                title: "Erro!",
                text: errorMsg,
                timer: 2000,
                showConfirmButton: false
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <div className="flex flex-col mb-4">
                <label htmlFor="" className="mb-2 text-sm font-medium text-gray-700">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email@example.com" className="px-4 py-2 border border-gray-300 rounded-lg focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all" required />
            </div>
            <div className="flex flex-col mb-0 w-full">
                <label htmlFor="" className="mb-2 text-sm font-medium text-gray-700">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="******" className="px-4 py-2 border border-gray-300 rounded-lg focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all" required />
            </div>
            <div className="mb-4">
                <Link to={'/forgot'} className="text-sm text-verdeSuave-600 font-medium underline">Recuperar password</Link>
            </div>
            <button className="flex items-center justify-center bg-verdeSuave-600 text-white font-medium min-w-full px-4 py-2 rounded-lg mb-4 hover:bg-verdeSuave-700">
                {loading ?
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin mr-2"></div> :
                    "Login"}
            </button>
            <Link
                to="/createaccount"
                className="bg-white text-verdeSuave-600 font-medium min-w-full px-4 py-2 rounded-lg border border-verdeSuave-600 hover:bg-verdeSuave-100 text-center"
            >
                Criar conta
            </Link>
        </form>
    );
}

export default Login;