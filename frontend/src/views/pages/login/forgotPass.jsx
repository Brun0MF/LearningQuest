import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enviarCodigo } from "../../../api/utilizadores";
import Swal from 'sweetalert2'

const Forgot = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const data = await enviarCodigo(email);
            console.log("Codigo enviado com sucesso:", data);
            setEmail("");
            navigate("/ConfirmEmail");
            Swal.fire({
                icon: "success",
                title: "Código enviado!",
                text: "Verifique o seu email para confirmar a identidade.",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Erro ao criar conta";

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
            <small className="mb-4 text-gray-700 text-center">Digite o seu email para receber um email para confirmar a identidade.</small>
            <div className="flex flex-col mb-4">
                <label htmlFor="" className="mb-2 text-sm font-medium text-gray-700">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email@example.com" className="px-4 py-2 border border-gray-300 rounded-lg focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all" required />
            </div>
            <button className="flex items-center justify-center bg-verdeSuave-600 text-white font-medium min-w-full px-4 py-2 rounded-lg mb-4 hover:bg-verdeSuave-700">
                {loading ?
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin mr-2"></div> :
                    "Seguinte"}
            </button>
        </form>
    );
}

export default Forgot;