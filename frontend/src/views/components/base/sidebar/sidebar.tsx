import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import { ImMenu } from "react-icons/im";
import { GiPodiumWinner } from "react-icons/gi";
import { FaHouse } from "react-icons/fa6";
import { FaBook, FaSignOutAlt } from "react-icons/fa";
import { IoIosArrowDown, IoIosSettings } from "react-icons/io";
import { IoPersonCircleSharp } from "react-icons/io5";
import { BiWorld, BiSolidFlag } from "react-icons/bi";
import { useSidebar } from "./sidebarContext";



type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems1: NavItem[] = [
    {
        icon: <FaHouse />,
        name: "Home",
        path: "/home",
    },
    {
        icon: <FaBook />,
        name: "Jogos",
        path: "/jogos",
    },
];

const navItems2: NavItem[] = [
    {
        name: "Classificações Mundias",
        icon: <BiWorld />,
        path: "/classificacoes/mundiais",
    },
    {
        name: "Classificações Regionais",
        icon: <BiSolidFlag />,
        path: "/classificacoes/mundiais",
    },
];

const othersItems: NavItem[] = [
    {
        icon: <IoIosSettings />,
        name: "Definições",
        path: "/definicoes",
    },
    {
        icon: <FaSignOutAlt />,
        name: "Sign Out",
        path: "/login",
    },
];

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const location = useLocation();

    const [openSubmenu, setOpenSubmenu] = useState<{
        type: "main" | "rankings" | "others";
        index: number;
    } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
        {}
    );
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // const isActive = (path: string) => location.pathname === path;
    const isActive = useCallback(
        (path: string) => location.pathname === path,
        [location.pathname]
    );

    useEffect(() => {
        let submenuMatched = false;
        ["main", "rankings", "others"].forEach((menuType) => {
            const items = menuType === "main" ? navItems1 : othersItems;
            items.forEach((nav, index) => {
                if (nav.subItems) {
                    nav.subItems.forEach((subItem) => {
                        if (isActive(subItem.path)) {
                            setOpenSubmenu({
                                type: menuType as "main" | "rankings" | "others",
                                index,
                            });
                            submenuMatched = true;
                        }
                    });
                }
            });
        });

        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [location, isActive]);

    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (index: number, menuType: "main" | "rankings" | "others") => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (
                prevOpenSubmenu &&
                prevOpenSubmenu.type === menuType &&
                prevOpenSubmenu.index === index
            ) {
                return null;
            }
            return { type: menuType, index };
        });
    };

    const renderMenuItems = (items: NavItem[], menuType: "main" | "rankings" | "others") => (
        <ul className="flex flex-col gap-4">
            {items.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <button
                            onClick={() => handleSubmenuToggle(index, menuType)}
                            className={`menu-item group flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 rounded-md px-2 py-1 ${openSubmenu?.type === menuType && openSubmenu?.index === index
                                ? "menu-item-active"
                                : "menu-item-inactive"
                                } cursor-pointer ${!isExpanded && !isHovered
                                    ? "lg:justify-center"
                                    : "lg:justify-start"
                                }`}
                        >
                            <span
                                className={`menu-item-icon-size flex items-center justify-center flex-shrink-0 text-xl lg:text-2xl ${!isExpanded && !isHovered ? 'lg:mx-auto' : ''} ${openSubmenu?.type === menuType && openSubmenu?.index === index
                                    ? "menu-item-icon-active"
                                    : "menu-item-icon-inactive"
                                    } group-hover:text-brand-500 transition-colors duration-150`}
                            >
                                {nav.icon}
                            </span>
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <span className="menu-item-text group-hover:text-brand-500 transition-colors duration-150">{nav.name}</span>
                            )}
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <IoIosArrowDown
                                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                                        openSubmenu?.index === index
                                        ? "rotate-180 text-brand-500"
                                        : ""
                                        } group-hover:text-brand-500`}
                                />
                            )}
                        </button>
                    ) : (
                        nav.path && (
                            <Link
                                to={nav.path}
                                className={`menu-item group flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors duration-150 rounded-md px-2 py-1 ${nav.name === "Sign Out"
                                    ? "text-red-500 hover:text-red-600"
                                    : isActive(nav.path)
                                        ? "menu-item-active"
                                        : "menu-item-inactive"
                                    }`}
                            >
                                <span
                                    className={`menu-item-icon-size flex items-center justify-center flex-shrink-0 text-xl lg:text-2xl ${!isExpanded && !isHovered ? 'lg:mx-auto' : ''} ${nav.name === "Sign Out"
                                        ? "text-red-500"
                                        : isActive(nav.path)
                                            ? "menu-item-icon-active"
                                            : "menu-item-icon-inactive"
                                        } group-hover:text-brand-500 transition-colors duration-150`}
                                >
                                    {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <span className="menu-item-text group-hover:text-brand-500 transition-colors duration-150">{nav.name}</span>
                                )}
                            </Link>
                        )
                    )}
                    {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                        <div
                            ref={(el) => {
                                subMenuRefs.current[`${menuType}-${index}`] = el;
                            }}
                            className="overflow-hidden transition-all duration-300"
                            style={{
                                height:
                                    openSubmenu?.type === menuType && openSubmenu?.index === index
                                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                                        : "0px",
                            }}
                        >
                            <ul className="mt-2 space-y-1 ml-9">
                                {nav.subItems.map((subItem) => (
                                    <li key={subItem.name}>
                                        <Link
                                            to={subItem.path}
                                            className={`menu-dropdown-item ${isActive(subItem.path)
                                                ? "menu-dropdown-item-active"
                                                : "menu-dropdown-item-inactive"
                                                }`}
                                        >
                                            {subItem.name}
                                            <span className="flex items-center gap-1 ml-auto">
                                                {subItem.new && (
                                                    <span
                                                        className={`ml-auto ${isActive(subItem.path)
                                                            ? "menu-dropdown-badge-active"
                                                            : "menu-dropdown-badge-inactive"
                                                            } menu-dropdown-badge`}
                                                    >
                                                        new
                                                    </span>
                                                )}
                                                {subItem.pro && (
                                                    <span
                                                        className={`ml-auto ${isActive(subItem.path)
                                                            ? "menu-dropdown-badge-active"
                                                            : "menu-dropdown-badge-inactive"
                                                            } menu-dropdown-badge`}
                                                    >
                                                        pro
                                                    </span>
                                                )}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-verdeSuave-300 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 
        ${isExpanded || isMobileOpen
                    ? "w-[290px]"
                    : isHovered
                        ? "w-[290px]"
                        : "w-[90px]"
                }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                    }`}
            >
                <Link to="/">
                    {isExpanded || isHovered || isMobileOpen ? (
                        <>
                            <img
                                className="dark:hidden"
                                src="/LQ.png"
                                alt="Logo"
                                width={150}
                                height={40}
                            />
                            <img
                                className="hidden dark:block"
                                src="/LQ.png"
                                alt="Logo"
                                width={150}
                                height={40}
                            />
                        </>
                    ) : (
                        <img
                            src="/logoLearningQuest-NoBG.png"
                            alt="Logo"
                            width={50}
                            height={32}
                        />
                    )}
                </Link>
            </div>
            <div className="flex flex-col h-full">
                {/* Parte rolável */}
                <div className="flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
                    <div className="flex flex-col gap-5">
                        {/* MENU PRINCIPAL */}
                        <div>
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-600 ${!isExpanded && !isHovered
                                    ? "lg:justify-center"
                                    : "justify-start"
                                    }`}
                            >
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    "Menu Principal"
                                )}
                            </h2>
                            {renderMenuItems(navItems1, "main")}
                        </div>

                        {/* RANKINGS */}
                        <div className="border-t border-gray-200 pt-4">
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-600 ${!isExpanded && !isHovered
                                    ? "lg:justify-center"
                                    : "justify-start"
                                    }`}
                            >
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    "Rankings"
                                )}
                            </h2>
                            {renderMenuItems(navItems2, "rankings")}
                        </div>
                    </div>
                </div>

                {/* Parte fixa no fundo */}
                <div className="border-t border-gray-200 pt-4 mb-20 lg:mb-4">
                    <h2
                        className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-600 ${!isExpanded && !isHovered
                            ? "lg:justify-center"
                            : "justify-start"
                            }`}
                    >
                        {(isExpanded || isHovered || isMobileOpen) && (
                            "Ferramentas"
                        )}
                    </h2>
                    {renderMenuItems(othersItems, "others")}
                </div>
            </div>
        </aside>
    );
};

export default AppSidebar;

