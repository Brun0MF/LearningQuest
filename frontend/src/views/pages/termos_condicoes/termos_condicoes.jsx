import React, { useEffect, useState } from 'react';

const TermosCondicoes = () => {
    const [open, setOpen] = useState(null);

    const toggleItem = (id) => {
        setOpen(open === id ? null : id);
    };

    const faqData = [
        {
            id: 1,
            question: "Uso do Serviço",
            answer: "Este serviço é fornecido apenas para fins informativos e educacionais. O utilizador concorda em usar a plataforma de acordo com os termos aqui estabelecidos."
        },
        {
            id: 2,
            question: "Responsabilidades do Utilizador",
            answer: "O utilizador é responsável por manter a confidencialidade das suas credenciais e por todas as atividades que ocorrem na sua conta."
        },
        {
            id: 3,
            question: "Conteúdo do Utilizador",
            answer: "O utilizador é responsável pelo conteúdo que submete à plataforma. Não nos responsabilizamos por materiais enviados que violem leis ou direitos de terceiros."
        },
        {
            id: 4,
            question: "Modificações no Serviço",
            answer: "Reservamo-nos o direito de modificar, suspender ou encerrar o serviço a qualquer momento sem aviso prévio."
        },
        {
            id: 5,
            question: "Privacidade e Segurança",
            answer: "Coletamos apenas os dados necessários para o funcionamento do serviço e os tratamos com confidencialidade, seguindo boas práticas de segurança."
        },
        {
            id: 6,
            question: "Propriedade Intelectual",
            answer: "Todo o conteúdo fornecido pela plataforma é protegido por direitos de autor e não pode ser reproduzido sem autorização."
        },
        {
            id: 7,
            question: "Isenção de Garantias",
            answer: "O serviço é fornecido 'tal como está'. Não garantimos a disponibilidade contínua, nem a ausência de erros."
        },
        {
            id: 8,
            question: "Limitação de Responsabilidade",
            answer: "Não seremos responsáveis por quaisquer danos diretos, indiretos ou consequenciais decorrentes do uso da plataforma."
        },
        {
            id: 9,
            question: "Alterações aos Termos",
            answer: "Podemos atualizar estes termos periodicamente. Recomendamos que consulte esta página regularmente para se manter informado."
        }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="px-4 py-8 mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Termos e Condições</h2>
            </div>
            <div className="space-y-4">
                {faqData.map((faq) => (
                    <div
                        key={faq.id}
                        className="border border-gray-200 rounded-xl shadow-sm"
                    >
                        <button
                            onClick={() => toggleItem(faq.id)}
                            className={`w-full text-left px-6 py-4 flex items-center gap-4 font-medium text-gray-900 rounded-xl 
                                ${open === faq.id ? 'bg-gray-100' : 'bg-white'} transition-all`}
                        >
                            <span className="font-bold">{faq.id}.</span>
                            {faq.question}
                        </button>
                        {open === faq.id && (
                            <div className="px-8 py-4 bg-gray-50 text-gray-700">
                                <p className="leading-relaxed">{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TermosCondicoes;
