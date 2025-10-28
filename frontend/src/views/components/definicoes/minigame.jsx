"use client";
import { useEffect, useRef, useState } from "react";

/**
 * MiniGameRaccoon.jsx
 *
 * Uso:
 *  - Coloque opcionalmente /public/images/raccoon.png
 *  - Importar e usar <MiniGameRaccoon />
 */

export default function MiniGameRaccoon() {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);

    // estados UI (só UI; re-renders deliberados)
    const [status, setStatus] = useState("idle"); // "idle" | "running" | "gameover"
    const [score, setScore] = useState(0);
    const [imgReady, setImgReady] = useState(false);

    // Refs mutáveis para o loop (evitam re-renders)
    const stateRef = useRef({
        width: 800,
        height: 240,
        scale: 1,
        raccoon: { x: 80, y: 0, size: 56, vy: 0, onGround: true },
        groundHeight: 48,
        gravity: 0.8,
        jumpPower: 14,
        obstacles: [],
        spawnTimer: 0,
        spawnInterval: 90, // frames
        speed: 6,
        baseSpeed: 6,
        speedIncreaseInterval: 300, // frames
        frames: 0,
        particles: [],
        crashed: false,
    });

    const raccoonImgRef = useRef(null);

    // Carrega imagem uma vez
    useEffect(() => {
        const img = new Image();
        img.src = "/astronauta_XL.png";
        img.onload = () => {
            raccoonImgRef.current = img;
            setImgReady(true);
        };
        img.onerror = () => {
            // fallback: sem imagem, usamos desenho nativo
            raccoonImgRef.current = null;
            setImgReady(true);
        };
    }, []);

    // Ajusta tamanho do canvas conforme container (responsivo)
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            // ajusta largura para o container width ou até 900
            const containerWidth = Math.min(canvas.parentElement.clientWidth || 800, 900);
            const baseW = 800;
            const scale = containerWidth / baseW;
            const baseH = 240;
            canvas.width = Math.floor(baseW * scale);
            canvas.height = Math.floor(baseH * scale);
            // guarda dimensões e scale
            stateRef.current.width = canvas.width;
            stateRef.current.height = canvas.height;
            stateRef.current.scale = scale;
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // teclado + touch handlers
    useEffect(() => {
        const onKey = (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                if (status === "running") doJump();
                else if (status === "idle") startGame();
                else if (status === "gameover") restartGame();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [status]); // re-register se status mudar

    // Funções de controle
    const startGame = () => {
        resetState();
        setScore(0);
        setStatus("running");
        stateRef.current.crashed = false;
        runLoop();
    };

    const restartGame = () => {
        resetState();
        setScore(0);
        setStatus("running");
        stateRef.current.crashed = false;
        runLoop();
    };

    const stopGame = () => {
        cancelAnimation();
        setStatus("gameover");
    };

    const cancelAnimation = () => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    };

    const resetState = () => {
        const s = stateRef.current;
        s.raccoon = { x: 80, y: 0, size: 56, vy: 0, onGround: true };
        s.obstacles = [];
        s.spawnTimer = 0;
        s.spawnInterval = 90;
        s.speed = s.baseSpeed;
        s.frames = 0;
        s.particles = [];
        s.crashed = false;
    };

    const doJump = () => {
        const r = stateRef.current.raccoon;
        if (r.onGround) {
            r.vy = -stateRef.current.jumpPower;
            r.onGround = false;
        }
    };

    // Botão mobile de pulo
    const handleMobileJump = () => {
        if (status === "idle") startGame();
        else if (status === "running") doJump();
        else if (status === "gameover") restartGame();
    };

    // Loop principal de animação (usa refs)
    const runLoop = () => {
        cancelAnimation(); // garantir que nao tem outro loop
        const ctx = canvasRef.current.getContext("2d");

        const loop = () => {
            rafRef.current = requestAnimationFrame(loop);
            const s = stateRef.current;
            s.frames++;

            // physics
            const r = s.raccoon;
            r.y += r.vy;
            r.vy += s.gravity;
            // chão
            const groundY = s.height - s.groundHeight;
            if (r.y + r.size >= groundY) {
                r.y = groundY - r.size;
                r.vy = 0;
                r.onGround = true;
            }

            // spawn obstáculos
            s.spawnTimer++;
            if (s.spawnTimer > s.spawnInterval) {
                s.spawnTimer = 0;
                // cria com variação
                const h = 28 + Math.random() * 46;
                const w = 18 + Math.random() * 30;
                s.obstacles.push({
                    x: s.width + 10,
                    y: groundY - h,
                    w,
                    h,
                    color: randomColorObstacle(),
                });
                // acelera levemente
                if (s.spawnInterval > 50 && Math.random() > 0.6) s.spawnInterval -= 1;
            }

            // move obstáculos
            s.obstacles.forEach((o) => (o.x -= s.speed));
            // remove fora da tela
            s.obstacles = s.obstacles.filter((o) => o.x + o.w > -50);

            // colisão simples AABB
            for (let o of s.obstacles) {
                if (
                    r.x + r.size - 6 > o.x &&
                    r.x + 6 < o.x + o.w &&
                    r.y + r.size > o.y
                ) {
                    // colisão
                    s.crashed = true;
                    createCrashParticles(r.x + r.size / 2, r.y + r.size / 2, s.particles);
                    stopGame();
                    break;
                }
            }

            // score e velocidade
            if (!s.crashed && s.frames % 6 === 0) {
                // atualiza placar no estado React a cada 6 frames para não spam
                setScore((prev) => prev + 1);
            }
            // velocidade aumenta com tempo
            if (s.frames % s.speedIncreaseInterval === 0) {
                s.speed += 0.6;
            }

            // partículas update
            s.particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.4; // gravidade das partículas
                p.life--;
            });
            s.particles = s.particles.filter((p) => p.life > 0);

            // draw
            drawScene(ctx, s, raccoonImgRef.current);
        };

        loop();
    };

    // util: cores para obstáculos
    const randomColorObstacle = () => {
        const arr = ["#10B981", "#06B6D4", "#F59E0B", "#EF4444"];
        return arr[Math.floor(Math.random() * arr.length)];
    };

    // particles simples na colisão
    const createCrashParticles = (x, y, particles) => {
        for (let i = 0; i < 18; i++) {
            particles.push({
                x: x + (Math.random() - 0.5) * 30,
                y: y + (Math.random() - 0.5) * 30,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 1.5) * 6,
                life: 30 + Math.floor(Math.random() * 30),
                size: 3 + Math.random() * 4,
                color: randomColorObstacle(),
            });
        }
    };

    // drawing routine
    const drawScene = (ctx, s, raccoonImg) => {
        const W = s.width;
        const H = s.height;
        // clear
        ctx.clearRect(0, 0, W, H);

        // background gradient
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, "#e6f7ff");
        grad.addColorStop(1, "#ffffff");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // decorative mountains / parallax
        drawMountains(ctx, W, H, s);

        // ground
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(0, H - s.groundHeight, W, s.groundHeight);

        // ground stripe for depth
        ctx.fillStyle = "#e5e7eb";
        ctx.fillRect(0, H - s.groundHeight - 6, W, 6);

        // obstacles
        s.obstacles.forEach((o) => {
            ctx.fillStyle = o.color;
            roundRect(ctx, o.x, o.y, o.w, o.h, 6);
            // top highlight
            ctx.fillStyle = "rgba(255,255,255,0.15)";
            ctx.fillRect(o.x, o.y, o.w, 6);
        });

        // raccoon (image or shape)
        const r = s.raccoon;
        const drawX = r.x;
        const drawY = r.y;

        if (raccoonImg) {
            // desenha imagem ajustando para scale
            const targetSize = r.size;
            ctx.drawImage(raccoonImg, drawX, drawY, targetSize, targetSize);
            // sombra
            ctx.fillStyle = "rgba(0,0,0,0.12)";
            ctx.beginPath();
            ctx.ellipse(drawX + targetSize / 2, H - s.groundHeight + 6, targetSize / 2, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // desenha guaxinim estilizado
            drawRaccoonShape(ctx, drawX, drawY, r.size);
        }

        // particles
        s.particles.forEach((p) => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // UI overlay: score
        ctx.fillStyle = "#111827";
        ctx.font = `${16 * s.scale}px Inter, system-ui, -apple-system, "Segoe UI", Roboto`;
        ctx.textAlign = "right";
        ctx.fillText(`Score: ${score}`, W - 14 * s.scale, 22 * s.scale);

        // if idle show big hint
        if (status === "idle") {
            ctx.fillStyle = "rgba(17,24,39,0.9)";
            ctx.font = `${22 * s.scale}px Inter, sans-serif`;
            ctx.textAlign = "center";
            ctx.fillText("Clique aqui para começar", W / 2, H / 2 - 12 * s.scale);
            ctx.font = `${14 * s.scale}px Inter, sans-serif`;
            ctx.fillText("Pressione Espaço ou toque no botão para pular", W / 2, H / 2 + 12 * s.scale);
        }

        // if gameover overlay
        if (status === "gameover") {
            ctx.fillStyle = "rgba(17,24,39,0.7)";
            ctx.fillRect(W / 2 - 160 * s.scale, H / 2 - 54 * s.scale, 320 * s.scale, 108 * s.scale);
            ctx.fillStyle = "#fff";
            ctx.font = `${20 * s.scale}px Inter, sans-serif`;
            ctx.textAlign = "center";
            ctx.fillText("Game Over", W / 2, H / 2 - 12 * s.scale);
            ctx.font = `${14 * s.scale}px Inter, sans-serif`;
            ctx.fillText(`Score final: ${score}`, W / 2, H / 2 + 12 * s.scale);
            ctx.fillStyle = "#10B981";
            ctx.fillRect(W / 2 - 50 * s.scale, H / 2 + 22 * s.scale, 100 * s.scale, 26 * s.scale);
            ctx.fillStyle = "#fff";
            ctx.font = `${12 * s.scale}px Inter, sans-serif`;
            ctx.fillText("Reiniciar", W / 2, H / 2 + 40 * s.scale);
        }
    };

    // pequenas funções de desenho reutilizáveis
    const roundRect = (ctx, x, y, w, h, r) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
    };

    const drawRaccoonShape = (ctx, x, y, size) => {
        // sombra
        ctx.fillStyle = "rgba(0,0,0,0.12)";
        ctx.beginPath();
        ctx.ellipse(x + size / 2, stateRef.current.height - stateRef.current.groundHeight + 6, size / 2, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        // body
        ctx.fillStyle = "#6b7280";
        roundRect(ctx, x + 6, y + 18, size - 12, size - 22, 10);
        // head
        ctx.fillStyle = "#9CA3AF";
        ctx.beginPath();
        ctx.arc(x + size / 2, y + 20, 16, 0, Math.PI * 2);
        ctx.fill();
        // eyes/marks
        ctx.fillStyle = "#111827";
        ctx.fillRect(x + size / 2 - 14, y + 16, 8, 6);
        ctx.fillRect(x + size / 2 + 6, y + 16, 8, 6);
    };

    const drawMountains = (ctx, W, H, s) => {
        // simples montanhas no fundo pra dar profundidade
        ctx.fillStyle = "#dbeafe";
        ctx.beginPath();
        ctx.moveTo(0, H - s.groundHeight - 20);
        ctx.lineTo(W * 0.12, H - s.groundHeight - 90);
        ctx.lineTo(W * 0.28, H - s.groundHeight - 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#bfdbfe";
        ctx.beginPath();
        ctx.moveTo(W * 0.2, H - s.groundHeight - 20);
        ctx.lineTo(W * 0.45, H - s.groundHeight - 130);
        ctx.lineTo(W * 0.7, H - s.groundHeight - 20);
        ctx.closePath();
        ctx.fill();
    };

    // clique no canvas começa / reinicia (UX)
    const handleCanvasClick = (e) => {
        if (status === "idle") startGame();
        else if (status === "gameover") restartGame();
        else {
            // while running, também pode pular ao clicar na tela
            doJump();
        }
    };

    // cleanup on unmount
    useEffect(() => {
        return () => cancelAnimation();
    }, []);

    // UI: botões e canvas
    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 lg:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">Mini-Game 🦝</h3>
                    <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-600">Score: <span className="font-medium">{score}</span></div>
                        {status !== "running" ? (
                            <button
                                onClick={() => {
                                    if (status === "idle") startGame();
                                    else if (status === "gameover") restartGame();
                                }}
                                className="px-3 py-1 rounded-md bg-green-500 text-white text-sm hover:bg-green-600 transition"
                            >
                                {status === "idle" ? "Clique aqui para começar" : "Reniciar"}
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    // pausar/parar
                                    stopGame();
                                }}
                                className="px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition"
                            >
                                Parar
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative">
                    <canvas
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        className="w-full rounded-lg border border-gray-200 cursor-pointer"
                        style={{ touchAction: "manipulation" }}
                    />
                    {/* Botão mobile de pulo */}
                    <div className="absolute right-4 bottom-4">
                        <button
                            onClick={handleMobileJump}
                            className="px-4 py-2 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
                        >
                            Pular
                        </button>
                    </div>
                </div>

                <div className="mt-3 text-sm text-gray-500">
                    <p>Use Espaço ou botões para pular. Objetivo: evitar obstáculos e bater o recorde!</p>
                </div>
            </div>
        </div>
    );
}
