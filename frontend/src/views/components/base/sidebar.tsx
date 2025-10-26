import React, { useState } from 'react';
import {
    FaTachometerAlt,
    FaBook,
    FaTrophy,
    FaGlobe,
    FaFlag,
    FaCog,
    FaChevronDown,
    FaChevronUp,
} from 'react-icons/fa';

const NAV_ITEMS = [
    { title: 'Home', icon: <FaTachometerAlt />, path: '/home' },
    {
        title: 'Rankings',
        icon: <FaTrophy />,
        children: [
            { title: 'Mundiais', icon: <FaGlobe />, path: '/rankings/mundiais' },
            { title: 'Regionais', icon: <FaFlag />, path: '/rankings/regionais' },
        ],
    },
    { title: 'Definições', icon: <FaCog />, path: '/definicoes' },
];

export default function Sidebar() {
    const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});

    const toggleSubmenu = (title: string) => {
        setOpenSubmenus((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const renderNavItem = (item: typeof NAV_ITEMS[0]) => {
        const hasChildren = !!item.children?.length;
        return (
            <li key={item.title}>
                {hasChildren ? (
                    <>
                        <button
                            onClick={() => toggleSubmenu(item.title)}
                            className="w-full flex items-center justify-between py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none dark:text-neutral-200 dark:hover:bg-neutral-700"
                        >
                            <span className="flex items-center gap-x-3.5">
                                {item.icon} {item.title}
                            </span>
                            {openSubmenus[item.title] ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {openSubmenus[item.title] && (
                            <ul className="pl-8 pt-1 space-y-1">
                                {item.children!.map((child) => (
                                    <li key={child.title}>
                                        <a
                                            href={child.path}
                                            className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                                        >
                                            {child.icon} {child.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                ) : (
                    <a
                        href={item.path}
                        className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                    >
                        {item.icon} {item.title}
                    </a>
                )}
            </li>
        );
    };

    return (
        <aside className="w-64 h-full fixed top-0 left-0 bg-white border-r border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
            <header className="p-4 text-xl font-semibold text-black dark:text-white">Brand</header>
            <nav className="overflow-y-auto h-full px-2">
                <ul className="space-y-1">{NAV_ITEMS.map(renderNavItem)}</ul>
            </nav>
        </aside>
    );
}
