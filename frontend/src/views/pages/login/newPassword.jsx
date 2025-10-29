import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { mudarPassword } from "../../../api/utilizadores";
import Swal from 'sweetalert2'

const NewPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [repPassword, setRepPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== repPassword) {
            Swal.fire({
                icon: "warning",
                title: "Passwords não coincidem",
                text: "Por favor, digite a mesma password nos dois campos.",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        setLoading(true);

        try {
            const data = await mudarPassword(password);
            console.log("Password alterada com sucesso:", data);
            setPassword("");
            setRepPassword("");

            Swal.fire({
                icon: "success",
                title: "Password alterada!",
                text: "Pode agora iniciar sessão com a nova password.",
                timer: 2000,
                showConfirmButton: false
            });

            navigate("/login");
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Erro ao alterar a password";

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
                <label className="mb-2 text-sm font-medium text-gray-700">Nova Password</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="******"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all"
                />
            </div>
            <div className="flex flex-col mb-4">
                <label className="mb-2 text-sm font-medium text-gray-700">Repita a Password</label>
                <input
                    value={repPassword}
                    onChange={(e) => setRepPassword(e.target.value)}
                    type="password"
                    placeholder="******"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center bg-verdeSuave-600 text-white font-medium min-w-full px-4 py-2 rounded-lg mb-4 hover:bg-verdeSuave-700 disabled:opacity-50"
            >
                {loading ? (
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    "Mudar Password"
                )}
            </button>
        </form>
    );
}

export default NewPassword;
