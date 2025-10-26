import CodigoInput from "../../components/login/codeInput";

const ConfirmEmail = () => {
    return(
        <div className="flex flex-col w-full">
            <small className="mb-4 text-gray-700 text-center">Digite o seu email para receber um email para confirmar a identidade.</small>
            <CodigoInput />
            <button className="bg-verdeSuave-600 text-white font-medium min-w-full px-4 py-2 rounded-lg mb-4 hover:bg-verdeSuave-700">
                Confirmar
            </button>
        </div>
    );
}

export default ConfirmEmail;