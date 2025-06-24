import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [navmod, setNavmod] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setNavmod(window.scrollY >= 64);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsNavOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isNavOpen && !event.target.closest('.navbar-container')) {
                setIsNavOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isNavOpen]);

    const handleClick = () => setIsNavOpen((prev) => !prev);

    // Navigation links data
    const navLinks = [
        { label: 'Home', href: '#home' },
        { label: 'About Us', href: '#about' },
        { label: 'Contact Us', href: '#contact' },
    ];

    return (
        <>
            <div className="fixed w-full z-50 top-0 left-0 pointer-events-none">
                <div
                    className={`navbar-container pointer-events-auto transition-all duration-500 w-full
                        ${navmod
                            ? 'bg-gradient-to-br from-white/90 via-blue-100/80 to-blue-50/80 backdrop-blur-xl border-b border-blue-200/60 shadow-lg'
                            : 'bg-transparent border-b border-transparent shadow-none'
                        }
                        flex items-center justify-between
                        px-4 md:px-12 py-3
                        w-full
                        rounded-none
                    `}
                >
                    <button
                        className="md:hidden flex flex-col justify-center items-center w-11 h-11 rounded-full hover:bg-blue-100/40 focus:outline-none transition-all duration-300 mr-2"
                        onClick={handleClick}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-7 h-1 rounded transition-all duration-300 ${isNavOpen ? 'rotate-45 translate-y-2' : 'mb-2'} bg-blue-500 shadow-[0_0_8px_1px_rgba(56,189,248,0.25)]`} />
                        <span className={`block w-7 h-1 rounded transition-all duration-300 ${isNavOpen ? 'opacity-0' : 'mb-2'} bg-blue-500 shadow-[0_0_8px_1px_rgba(56,189,248,0.25)]`} />
                        <span className={`block w-7 h-1 rounded transition-all duration-300 ${isNavOpen ? '-rotate-45 -translate-y-2' : ''} bg-blue-500 shadow-[0_0_8px_1px_rgba(56,189,248,0.25)]`} />
                    </button>
                    <Link to="/" className="flex items-center text-2xl md:text-3xl font-extrabold tracking-wide select-none whitespace-nowrap mr-6">
                        <span
                            className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-400 bg-clip-text text-transparent drop-shadow-md"
                            style={{ WebkitTextStroke: '0.5px rgba(0,0,0,0.08)' }}
                        >
                            MediQuick
                        </span>
                    </Link>
                    <nav className="hidden md:flex flex-1 justify-center">
                        <ul className="flex items-center gap-10 text-lg font-bold text-blue-900">
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="relative px-3 py-1 transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 hover:text-cyan-600 hover:scale-105"
                                    >
                                        <span className="z-10 relative">{link.label}</span>
                                        <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    </a>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="ml-4 px-5 py-2 bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 text-blue-900 rounded-full font-extrabold shadow hover:from-blue-300 hover:to-cyan-400 hover:scale-105 transition-all border border-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    Book an Appointment
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            {/* Mobile Menu */}
            <div
                className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-in-out
                    ${isNavOpen ? 'opacity-100 max-h-screen py-10' : 'opacity-0 max-h-0 py-0'}
                    bg-gradient-to-br from-white/95 via-blue-100/90 to-blue-50/90 backdrop-blur-xl border-b border-blue-200/60
                    rounded-b-none overflow-hidden shadow-2xl
                `}
            >
                <ul className="flex flex-col items-center gap-10 px-8 pt-28 pb-12 text-blue-900 text-2xl font-bold">
                    {navLinks.map((link) => (
                        <li key={link.label}>
                            <a
                                href={link.href}
                                className="relative px-4 py-2 rounded transition-all duration-200 hover:text-cyan-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                onClick={() => setIsNavOpen(false)}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => { setIsNavOpen(false); navigate('/register'); }}
                            className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 text-blue-900 rounded-full font-extrabold shadow hover:from-blue-300 hover:to-cyan-400 hover:scale-105 transition-all border border-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            Book an Appointment
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Navbar;
