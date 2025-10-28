import { useEffect } from "react";
import "./notFound.css";
import { Link } from "react-router-dom";
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';


const NotFound = () => {
    useEffect(() => {
        const page = document.querySelector(".not-found-page");

        const createStar = () => {
            const right = Math.random() * 500;
            const top = Math.random() * window.innerHeight;
            const star = document.createElement("div");
            star.classList.add("star");
            page.appendChild(star);

            let pos = right;
            const runStar = () => {
                if (pos >= window.innerWidth) {
                    star.remove();
                    clearInterval(interval);
                }
                pos += 3;
                star.style.right = `${pos}px`;
            };

            star.style.top = `${top}px`;
            const interval = setInterval(runStar, 10);
        };

        const interval = setInterval(createStar, 100);

        return () => {
            clearInterval(interval);
            document.querySelectorAll(".star").forEach((el) => el.remove());
        };
    }, []);

    return (
        <div className="not-found-page">
            <div className="text flex flex-col justify-between h-4/5">
                <div>
                    <div>ERROR</div>
                    <h1>
                        4
                        <img
                            src="/astronauta_0.png"
                            alt="cabeca_astronauta"
                            className="zero-img"
                        />
                        4
                    </h1>

                    <hr />
                    <div>Page Not Found</div>
                </div>
                <Link to="/jogos" className="home-button rounded-lg">
                    Home
                </Link>
            </div>

            <div className="astronaut">
                <img src="/astronauta_XL.png" alt="astronaut" />
            </div>

        </div>
    );
};

export default NotFound;
