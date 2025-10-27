import React from "react";

const LevelPath = () => {
  const levels = Array.from({ length: 10 }, (_, i) => i + 1); // 10 níveis (1 a 10)

  return (
    <div
      style={{
        backgroundColor: "#fff",
        minHeight: "100vh", // altura mínima da janela
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        overflowY: "auto", // ativa scroll vertical
      }}
    >
      {levels.map((lvl) => (
        <div
          key={lvl}
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            backgroundColor: "#4caf50",
            border: "4px solid #2e7d32",
            margin: "40px 0", // espaçamento entre bolas
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        ></div>
      ))}
    </div>
  );
};

export default LevelPath;
