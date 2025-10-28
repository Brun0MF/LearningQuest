
import UserMetaCard from "../../components/definicoes/definicoes";
import MiniGameRaccoon from "../../components/definicoes/minigame";

export default function Definicoes() {
    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6">
                <h2 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7">
                    Perfil
                </h2>
                <div className="space-y-6">
                    <UserMetaCard />
                </div>
                <h2 className="mt-6 mb-5 text-lg font-semibold text-gray-800 lg:mb-7">
                    Mini-Game
                </h2>
                <p className="text-gray-600 mb-5">
                    Aqui disponibilizamos um jogo simples e interativo, criado para te ajudar a
                    passar o tempo e te entreteres enquanto exploras o site.
                </p>
                <div className="space-y-6">
                    <MiniGameRaccoon />
                </div>
            </div>
        </>
    );
}
