import FiltrosHome from "../../components/home/filtros_home";
import CardHome from "../../components/home/cards_home";

const Home = () => {
    return (
        <div className="flex flex-col mx-[15%] gap-4">
            <FiltrosHome />
            <div className="flex flex-col gap-4 justify-center ">
                <CardHome />
                <CardHome />
                <CardHome />
                <CardHome />
                <CardHome />
                <CardHome />
                <CardHome />
                <CardHome />
                <CardHome />
            </div>
        </div>
    )
}

export default Home;