import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const LoginLayout = () => {
    
    useEffect(() => {
        const canvas = document.getElementById("bgCanvas");
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const shapes = ["triangle", "circle", "square", "cross"];

        const colors = {
            triangle: "rgba(0, 255, 128, 0.2)", 
            circle: "rgba(255, 70, 70, 0.2)", 
            square: "rgba(255, 100, 255, 0.2)",
            cross: "rgba(70, 140, 255, 0.2)",
        };

        const drawShape = (type, x, y, size) => {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = colors[type];

            switch (type) {
                case "triangle":
                    ctx.moveTo(x, y - size / 1.2);
                    ctx.lineTo(x - size / 1.2, y + size / 1.2);
                    ctx.lineTo(x + size / 1.2, y + size / 1.2);
                    ctx.closePath();
                    break;
                case "circle":
                    ctx.arc(x, y, size / 1.2, 0, Math.PI * 2);
                    break;
                case "square":
                    ctx.rect(x - size / 1.2, y - size / 1.2, size * 1.2, size * 1.2);
                    break;
                case "cross":
                    ctx.moveTo(x - size / 1.2, y - size / 1.2);
                    ctx.lineTo(x + size / 1.2, y + size / 1.2);
                    ctx.moveTo(x + size / 1.2, y - size / 1.2);
                    ctx.lineTo(x - size / 1.2, y + size / 1.2);
                    break;
            }

            ctx.stroke();
        };

        const symbols = Array.from({ length: 30 }).map(() => ({
            type: shapes[Math.floor(Math.random() * shapes.length)],
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 20 + Math.random() * 30,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
        }));

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const s of symbols) {
                drawShape(s.type, s.x, s.y, s.size);

                s.x += s.dx;
                s.y += s.dy;

                if (s.x < 0 || s.x > canvas.width) s.dx *= -1;
                if (s.y < 0 || s.y > canvas.height) s.dy *= -1;
            }
            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return(
        <div className="min-h-screen grid place-items-center bg-verdeSuave-100">
            <canvas id="bgCanvas" className="absolute inset-0"></canvas>
            <div className="flex items-center justify-center bg-white p-5 border-2 rounded-xl border-verdeSuave gap-10 w-2/4 h-2/4 z-10">
                <img src="/logoLearningQuest-NoBG.png" className="hidden md:block w-1/4" alt="" />
                <Outlet />
            </div>
        </div>
    );
}

export default LoginLayout;