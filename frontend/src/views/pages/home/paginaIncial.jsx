import { useState } from "react";
import { Link } from "react-router";
import { HiArrowRight, HiPlay } from "react-icons/hi2";
import { FaBrain, FaTrophy, FaRoute, FaAward, FaBullseye } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { FiUserPlus } from "react-icons/fi";
import heroImage from "../../../../public/logoLearningQuest-NoBG.png";
import Footer from "../../components/base/footer/footer";


const PageInicial = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const features = [
        {
            icon: FaBrain,
            title: "IA Personalizada",
            description:
                "Algoritmos inteligentes adaptam o conteúdo ao seu ritmo e estilo de aprendizagem.",
        },
        {
            icon: FaTrophy,
            title: "Gamificação",
            description:
                "Ganhe pontos e suba no ranking enquanto aprende de forma divertida.",
        },
        {
            icon: FaBullseye,
            title: "Percursos Dinâmicos",
            description:
                "Escolha o seu caminho através de conteúdos interativos e progressivos.",
        },
        {
            icon: IoSparkles,
            title: "Perguntas Variadas",
            description:
                "Perguntas variadas e muito mais para uma experiência rica.",
        },
    ];

    const steps = [
        {
            icon: FiUserPlus,
            title: "1. Crie a sua Conta",
            description:
                "Registe-se a sua conta em segundos começe a sua experiência.",
        },
        {
            icon: FaRoute,
            title: "2. Escolha o seu Percurso",
            description:
                "Navegue por categorias e selecione tópicos do seu interesse. A IA adapta-se ao seu progresso.",
        },
        {
            icon: FaAward,
            title: "3. Aprenda e Conquiste",
            description:
                "Complete desafios, ganhe pontos e suba no ranking enquanto domina novos conhecimentos.",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            {/* HEADER */}
            <header className="sticky top-0 w-full bg-verdeSuave-300 z-50 lg:shadow-none shadow-[0_3px_8px_-2px_rgba(0,20,0,0.7)]">
                <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
                    <div className="flex items-center justify-between w-full gap-2 px-3 py-3 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">


                        <Link to="/">
                            <img
                                className="hidden dark:block"
                                src="/LQ.png"
                                alt="Logo"
                                width="125"
                            />
                        </Link>


                        <div className="flex items-center justify-end lg:w-full gap-4 px-2 py-2 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none">
                            {/* <!-- User Area --> */}
                            <Link to="/createaccount" className="text-white inline-flex items-center justify-center px-8 py-3 text-base font-semibold bg-verdeSuave-700   text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg transition-transform hover:-translate-y-1">
                                Criar Conta
                            </Link>
                            <Link to="/login" className="text-white inline-flex items-center justify-center px-8 py-3 text-base font-semibold bg-verdeSuave-800 text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg transition-transform hover:-translate-y-1">
                                Login
                            </Link>
                        </div>
                    </div>

                </div>
            </header >

            {/* MAIN CONTENT */}
            < main className="flex-1 text-gray-900 relative overflow-hidden" >

                {/* HERO SECTION */}
                <section className="relative py-24 md:py-32 overflow-hidden bg-verdeSuave-50">
                    {/* Fundo luminoso */}
                    < div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(255,255,255,0.6),transparent_70%)] -z-10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(122,221,179,0.25),transparent_70%)] -z-10" />

                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Texto */}
                            <div className="space-y-10">
                                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium shadow-sm">
                                    <IoSparkles className="h-4 w-4" />
                                    <span>Plataforma de Aprendizagem Inteligente</span>
                                </div>

                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                                    Aprenda de Forma
                                    <span className="text-primary"> Personalizada</span> e
                                    <span className="text-accent"> Divertida</span>
                                </h1>

                                <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                                    Combine IA, gamificação e conteúdos interativos para criar o seu percurso de aprendizagem único.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/jogos" className="text-white inline-flex items-center justify-center px-8 py-3 text-base font-semibold bg-verdeSuave-800 text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg transition-transform hover:-translate-y-1">
                                        Começar Agora
                                        <HiArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </div>
                            </div>

                            {/* Imagem */}
                            {/* Imagem */}
                            <div className="hidden lg:flex justify-end">
                                <div className="relative inline-block rounded-3xl overflow-hidden ">
                                    <img
                                        src={heroImage}
                                        alt="Estudantes aprendendo com tecnologia"
                                        width={400}
                                        className="h-auto object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section >

                {/* FEATURES SECTION */}
                <section id="features" className="py-24 bg-verdeSuave-50 relative overflow-hidden">

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4),transparent_70%)] -z-10" />
                    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-verdeSuave-200/30 rounded-full blur-[180px] opacity-50 -z-10" />

                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Funcionalidades que <span className="text-primary">Transformam</span> a Aprendizagem
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Descubra como o LearningQuest torna cada experiência de aprendizagem única e envolvente.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, i) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={i}
                                        className="bg-white group bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/50"
                                    >
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                <Icon className="h-10 w-10 text-primary" />
                                            </div>
                                            <h3 className="text-xl font-semibold">{feature.title}</h3>
                                            <p className="text-muted-foreground">{feature.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section >

                {/* HOW IT WORKS SECTION */}
                <section className="relative py-24 md:py-32 overflow-hidden bg-verdeSuave-50">

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.3),transparent_70%)] -z-10" />

                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Como <span className="text-accent">Funciona</span>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Três passos simples para começar a sua jornada de aprendizagem.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                            {steps.map((step, i) => {
                                const Icon = step.icon;
                                return (
                                    <div
                                        key={i}
                                        className=" bg-white relative bg-card border border-border rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                                    >
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="p-5 rounded-2xl bg-primary text-primary-foreground shadow-md">
                                                <Icon className="h-8 w-8" />
                                            </div>
                                            <h3 className="text-xl font-semibold">{step.title}</h3>
                                            <p className="text-muted-foreground">{step.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section >
            </main >

            {/* FOOTER */}
            < Footer />
        </div >
    );
};

export default PageInicial;
