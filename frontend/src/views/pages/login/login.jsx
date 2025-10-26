import { Link } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col mb-4">
                <label htmlFor="" className="mb-2 text-sm font-medium text-gray-700">Email</label>
                <input type="text" placeholder="email@example.com" className="px-4 py-2 border border-gray-300 rounded-lg focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all" />
            </div>
            <div className="flex flex-col mb-0 w-full">
                <label htmlFor="" className="mb-2 text-sm font-medium text-gray-700">Password</label>
                <input type="password" placeholder="******" className="px-4 py-2 border border-gray-300 rounded-lg focus:border-verdeSuave focus:ring-2 focus:ring-verdeSuave outline-none transition-all" />
            </div>
            <div className="mb-4">
                <Link to={'/forgot'} className="text-sm text-verdeSuave-600 font-medium underline">Recuperar password</Link>
            </div>
            <button className="bg-verdeSuave-600 text-white font-medium min-w-full px-4 py-2 rounded-lg mb-4 hover:bg-verdeSuave-700">
                Login
            </button>
            <Link
                to="/create"
                className="bg-white text-verdeSuave-600 font-medium min-w-full px-4 py-2 rounded-lg border border-verdeSuave-600 hover:bg-verdeSuave-100 text-center"
            >
                Criar conta
            </Link>
        </div>
    );
}

export default Login;