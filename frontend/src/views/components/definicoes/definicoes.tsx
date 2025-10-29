import { useEffect, useState } from "react";
import { editarPerfil, getUtilizadorbyID } from "../../../api/utilizadores";

export default function UserMetaCard() {
    const profileImages = [
        "gua1.png",
        "gua2.png",
        "gua3.png",
        "gua4.png",
        "gua5.png",
        "gua6.png",
    ];

    const [selectedImage, setSelectedImage] = useState<string>("");
    const [userId, setUserId] = useState<number | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [utilizador, setUtilizador] = useState<any>([]);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleUser = async (userId: number) => {
        try {
            console.log(userId);
            const response = await getUtilizadorbyID(userId);
            setUtilizador(response);
            setName(response?.nome_utilizador ?? "");
            setEmail(response?.email_utilizador ?? "");
            console.log(name);
            return response;
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (utilizador?.path_imagem) {
            setSelectedImage(utilizador.path_imagem);
        }
    }, [utilizador]);

    // definicoes.tsx
    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (userId == null) {
                console.error("ID do utilizador inexistente");
                return;
            }

            const formattedImage = selectedImage.replace(/^\/+/, "");
            await editarPerfil(name, email, formattedImage, userId);

            setUtilizador((prev: any) =>
                prev
                    ? {
                        ...prev,
                        nome_utilizador: name,
                        email_utilizador: email,
                        path_imagem: formattedImage,
                    }
                    : prev
            );

            closeModal();
        } catch (error) {
            console.log("Erro ao editar perfil: " + error);
        }
    };


    useEffect(() => {
        const raw = localStorage.getItem("id_user");
        const parsed = raw && raw !== "null" && raw !== "undefined" ? parseInt(raw, 10) : NaN;
        setUserId(Number.isNaN(parsed) ? null : parsed);
        console.log(userId);
    }, [])

    useEffect(() => {
        if (userId) handleUser(userId);
    }, [userId])

    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl lg:p-6">

                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full">
                            <img
                                src={utilizador?.path_imagem ? `/${utilizador.path_imagem}` : "/gua1.png"}
                                alt="user"
                                className="object-contain w-full h-full"
                            />
                        </div>
                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 xl:text-left">
                                {name}
                            </h4>
                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p className="text-sm text-gray-500 ">{email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <img src='/astronauta_0.png' width={50} alt="" className="-mb-4" />
                        <button onClick={openModal} className="flex items-center justify-center gap-1 bg-verdeSuave-600 font-medium text-white py-2 px-5 rounded-xl hover:bg-verdeSuave-700">
                            <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                />
                            </svg>
                            Editar
                        </button>
                    </div>

                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between mt-5">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800  lg:mb-6">
                            Informação Pessoal
                        </h4>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 ">
                                    Nome
                                </p>
                                <p className="text-sm font-medium text-gray-800 ">
                                    {name}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 ">
                                    Email
                                </p>
                                <p className="text-sm font-medium text-gray-800 ">
                                    {email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal nativo */}
            {isOpen && (
                <div className="fixed -top-6 inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="w-full max-w-[700px] m-4 rounded-3xl bg-white p-6">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 ">
                            Editar Informação Pessoal
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                            Atualiza o teu perfil sempre que quiseres.
                        </p>

                        <form onSubmit={handleSave}>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div className="col-span-2 lg:col-span-1">
                                    <label className="block mb-1 text-sm font-medium text-gray-700 ">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm "
                                    />
                                </div>
                                <div className="col-span-2 lg:col-span-1">
                                    <label className="block mb-1 text-sm font-medium text-gray-700 ">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                        disabled />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Escolhe uma imagem de perfil
                                </label>
                                <div className="grid grid-cols-6 lg:grid-cols-3 gap-10">
                                    {profileImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`w-[90px] h-[90px] border-2 rounded-full p-2 cursor-pointer transition ${selectedImage === img
                                                ? "border-verdeSuave-600"
                                                : "border-transparent"
                                                }`}
                                            onClick={() => setSelectedImage(img)}
                                        >
                                            <img
                                                src={img}
                                                alt={`Profile ${index}`}
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-6 justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 "
                                >
                                    Fechar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-verdeSuave-700 text-white rounded-lg text-sm font-medium hover:bg-verdeSuave-800"
                                >
                                    Guardar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
