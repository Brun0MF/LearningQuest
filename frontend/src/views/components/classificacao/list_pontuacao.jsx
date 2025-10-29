import { FaTrophy } from "react-icons/fa";

const PontuacaoList = ({ pontuacao = [] }) => {
    const top3 = pontuacao.slice(0, 3);
    const podiumOrder = [1, 0, 2]; 
    const podium = podiumOrder.map((i) => top3[i]).filter(Boolean);

    const restantes = pontuacao.slice(3);

    const getNome = (u) =>
        u?.nome_utilizador ?? u?.Nome_Utilizador ?? u?.nome ?? u?.Nome ?? "—";
    const getPontos = (u) =>
        u?.total_pontos ??
        u?.pontuacaogeral_utilizador ??
        u?.PontuacaoGeral_Utilizador ??
        u?.xp ??
        0;

    const stylesByPlace = {
        2: {
            card: "border border-gray-400 bg-gradient-to-b from-gray-200 via-gray-100 to-gray-50 text-gray-700",
            trophy: "text-gray-400 size-3/4",
            xp: "text-gray-700 bg-gray-100",
            text: "text-gray-800",
        },
        1: {
            card: "border border-yellow-300 bg-gradient-to-b from-yellow-50 via-yellow-50 to-yellow-100 text-yellow-800",
            trophy: "text-yellow-500 size-full",
            xp: "text-yellow-700 bg-yellow-100",
            text: "text-yellow-800",
        },
        3: {
            card: "border border-orange-800 bg-gradient-to-b from-orange-300 via-orange-200 to-orange-100 text-orange-900",
            trophy: "text-orange-700 size-1/2",
            xp: "text-orange-800 bg-orange-100",
            text: "text-orange-900",
        },
    };

    const placeByIndex = [2, 1, 3];

    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <div className="flex flex-row gap-6 items-center justify-center">
                {podium.map((user, idx) => {
                    const place = placeByIndex[idx];
                    const s = stylesByPlace[place];
                    return (
                        <div
                            key={user.id_utilizador ?? user.Id_Utilizador ?? idx}
                            className={`relative flex flex-col items-center justify-between w-1/4 max-w-md rounded-2xl p-7 shadow-md ${s.card}`}
                        >
                            <FaTrophy className={s.trophy} />
                            <span className={`mt-2 font-semibold text-center text-lg ${s.text}`}>
                                {getNome(user)}
                            </span>
                            <span className={`mt-1 text-sm font-bold ${s.xp} p-1 rounded-lg`}>
                                {getPontos(user)} XP
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col w-full gap-3">
                {restantes.map((user, index) => (
                    <div
                        key={user.id_utilizador ?? user.Id_Utilizador ?? `rest-${index}`}
                        className="flex flex-row items-center justify-between w-full py-3 px-5 
                       rounded-xl border border-verdeSuave-200 bg-gradient-to-b 
                       from-white to-verdeSuave-50 hover:from-verdeSuave-50 
                       hover:to-white transition-all shadow-sm"
                    >
                        <div className="flex flex-row items-center gap-6">
                            <span className="text-verdeSuave-700 font-bold text-lg w-6 text-right">
                                {index + 4}
                            </span>
                            <span className="font-medium text-gray-800 text-base">
                                {getNome(user)}
                            </span>
                        </div>
                        <div className="text-sm font-semibold text-verdeSuave-700 bg-verdeSuave-100 px-3 py-1 rounded-lg">
                            {getPontos(user)} XP
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PontuacaoList;
