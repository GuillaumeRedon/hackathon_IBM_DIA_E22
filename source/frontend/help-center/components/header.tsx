'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Header() {
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4">
                <div className="flex items-center justify-between h-16">

                    {/* Logo and Title */}
                    <div className="flex items-center flex-1 lg:flex-none">
                        <Link href="/" className="flex items-center space-x-10">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={70}
                                height={35}
                                className="dark:hidden"
                                title="logo"
                            />
                            <h2 className="strong-blue text-xl font-semibold hidden md:block mb-0">
                                Help Center
                            </h2>
                        </Link>
                    </div>

                    {/* Right Side Navigation */}
                    <div className="flex items-center space-x-2">

                        {/* Theme Toggle */}
                        {/* <div className="relative">
                            <button
                                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                                className="grey-button p-2 rounded-lg hover:opacity-80 transition-opacity w-10 h-10 flex items-center justify-center"
                                aria-label="Change theme"
                            >
                                {currentTheme === 'light' ? (
                                    <i className="bi bi-sun-fill text-lg"></i>
                                ) : (
                                    <i className="bi bi-moon-fill text-lg"></i>
                                )}
                            </button>
                        </div> */}

                        {/* Language Selector */}
                        {/* <div className="relative rounded-2xl">
                            <button
                                className=""
                                aria-label="Language menu"
                            >
                                <Image
                                    src={currentLang === 'fr' ? '/assets/french.svg' : '/assets/french.svg'}
                                    alt="Language flag"
                                    width={20}
                                    height={15}
                                    className="rounded-sm"
                                />
                            </button>
                        </div> */}

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="grey-button px-3 py-2 rounded-lg hover:opacity-80"
                                aria-label="User menu"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-gray-600 font-medium hidden md:inline">Lucas BARREZ</span>
                                    <GraduationCap />
                                    <span className="font-medium md:hidden">Menu</span>
                                </div>
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-4 z-50">
                                    <div className="px-4 pb-4 border-b border-gray-200">
                                        <div className="flex flex-col">
                                            <div className="flex items-center text-lg font-semibold strong-blue">
                                                Lucas BARREZ
                                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                    Étudiant
                                                </span>
                                            </div>
                                            <a
                                                href="mailto:lucas.barrez@edu.devinci.fr"
                                                className="text-gray-600 hover:text-blue-600 text-sm mt-1"
                                            >
                                                lucas.barrez@edu.devinci.fr
                                            </a>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-grey transition-colors">
                                            Déconnexion
                                        </button>
                                    </div>
                                    <div className="pt-2">
                                        <Link href="/admin" className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-grey transition-colors">
                                            Questions en attentes
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
