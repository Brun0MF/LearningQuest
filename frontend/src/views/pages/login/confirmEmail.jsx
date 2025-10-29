import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CodigoInput from "../../components/login/codeInput";

const ConfirmEmail = () => {
    const [codigo, setCodigo] = useState("");
    const navigate = useNavigate();

    const code = localStorage.getItem("codigo_2FA");

    const handleCodigoCompleto = (codigoDigitado) => {
        setCodigo(codigoDigitado);
    };

    const handleConfirmar = () => {
        console.log("Confirmar com código:", codigo);

        if (code && code === codigo) {
            Swal.fire({
                icon: "success",
                title: "Código confirmado!",
                text: "Pode agora definir uma nova palavra-passe.",
                timer: 2000,
                showConfirmButton: false
            });

            navigate("/newpassword");
        } else {
            Swal.fire({
                icon: "error",
                title: "Erro!",
                text: "Código incorreto. Tente novamente.",
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    return (
        <div className="flex flex-col w-full">
            <small className="mb-4 text-gray-700 text-center">
                Digite o código que recebeu no seu email para confirmar a identidade.
            </small>

            <CodigoInput onComplete={handleCodigoCompleto} />

            <button
                onClick={handleConfirmar}
                disabled={!codigo}
                className="bg-verdeSuave-600 text-white font-medium min-w-full px-4 py-2 rounded-lg mb-4 hover:bg-verdeSuave-700 disabled:opacity-50"
            >
                Confirmar
            </button>
        </div>
    );
};

export default ConfirmEmail;
