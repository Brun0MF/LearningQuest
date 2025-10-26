import { useRef } from "react";

const CodigoInput = ({ onComplete }) => {
    const length = 5;
    const inputsRef = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, "");
        e.target.value = value;

        if (value && index < length - 1) {
            inputsRef.current[index + 1].focus();
        }

        const codigo = inputsRef.current.map((input) => input.value).join("");
        if (codigo.length === length && onComplete) {
            onComplete(codigo);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputsRef.current[index - 1].focus(); 
        }
    };

    return (
        <div className="flex justify-center gap-3 mb-4">
            {Array.from({ length }).map((_, i) => (
                <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="w-1/5 h-12 text-center text-xl border border-gray-300 rounded-lg focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all"
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    ref={(el) => (inputsRef.current[i] = el)}
                />
            ))}
        </div>
    );
};

export default CodigoInput;
