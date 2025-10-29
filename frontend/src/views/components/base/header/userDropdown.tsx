import { useEffect, useState } from "react";
import { Dropdown } from "../header/componets_user_header/dropdown";
import { DropdownItem } from "../header/componets_user_header/dropdownItem";
import { Link } from "react-router-dom";
import { getUtilizadorbyID } from "../../../../api/utilizadores";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [utilizador, setUtilizador] = useState<any>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleUser = async (userId: number) => {
    try {
      const response = await getUtilizadorbyID(userId);
      setUtilizador(response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem("id_user");
    const parsed = raw && raw !== "null" && raw !== "undefined" ? parseInt(raw, 10) : NaN;
    setUserId(Number.isNaN(parsed) ? null : parsed);
  }, []);

  useEffect(() => {
    if (userId) handleUser(userId);
  }, [userId]);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img
            src={utilizador?.path_imagem ? `/${utilizador.path_imagem}` : "/gua1.png"}
            alt="user"
            className="object-contain w-full h-full"
          />
        </span>

        <span className="hidden lg:block mr-1 font-medium text-theme-sm">
          {utilizador?.nome_utilizador || "Carregando..."}
        </span>

        <svg
          className={`hidden lg:block stroke-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-7 mt-[8px] flex w-[260px] flex-col rounded-tr-none rounded-b-3xl border border-gray-200 bg-white p-3 shadow-theme-lg"
      >
        <div className="mb-3">
          <span className="block font-medium text-gray-700 text-theme-sm">
            {utilizador?.nome_utilizador || "Carregando..."}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500">
            {utilizador?.email_utilizador || ""}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/definicoes"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700"
            >
              Definições
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700"
            >
              Termos & Condições
            </DropdownItem>
          </li>
        </ul>

        <Link
          to="/login"
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-red-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-red-700"
        >
          Sair
        </Link>
      </Dropdown>
    </div>
  );
}