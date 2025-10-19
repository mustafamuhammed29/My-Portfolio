// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const navItems = [
        { id: 'home', label: t('nav_home') },
        { id: 'about', label: t('nav_about') },
        { id: 'skills', label: t('nav_skills') },
        { id: 'projects', label: t('nav_projects') },
        { id: 'contact', label: t('nav_contact') },
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        document.documentElement.lang = lng;
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    };

    const langButtonClasses = "font-mono border rounded-md px-3 py-1 text-sm transition-colors duration-300";
    const activeLangButtonClasses = "bg-cyan-400 text-black border-cyan-400";
    const inactiveLangButtonClasses = "text-cyan-400 border-cyan-400 hover:bg-cyan-400/20";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // تحديد القسم النشط
            const sections = navItems.map(item => item.id);
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [navItems]);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-lg border-b border-gray-800 shadow-lg' : 'bg-transparent'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* الشعار */}
                    <motion.a
                        href="#home"
                        className="text-2xl font-bold text-white flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <i className="fa-solid fa-layer-group text-[#00f0ff]"></i>
                        {t('portfolio_title')}
                    </motion.a>

                    {/* القائمة - سطح المكتب */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map(item => (
                            <motion.button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${activeSection === item.id
                                    ? 'text-cyan-400 bg-cyan-400/10'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {item.label}
                            </motion.button>
                        ))}

                        {/* أزرار اللغات */}
                        <div className="flex items-center gap-2 border-l border-gray-700 pl-6">
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`${langButtonClasses} ${i18n.language === 'en' ? activeLangButtonClasses : inactiveLangButtonClasses}`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => changeLanguage('de')}
                                className={`${langButtonClasses} ${i18n.language === 'de' ? activeLangButtonClasses : inactiveLangButtonClasses}`}
                            >
                                DE
                            </button>
                            <button
                                onClick={() => changeLanguage('ar')}
                                className={`${langButtonClasses} ${i18n.language === 'ar' ? activeLangButtonClasses : inactiveLangButtonClasses}`}
                            >
                                AR
                            </button>
                        </div>
                    </div>

                    {/* زر القائمة - الموبايل */}
                    <motion.button
                        className="md:hidden p-2 text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </motion.button>
                </div>
            </motion.nav>

            {/* القائمة المنسدلة - الموبايل */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* الخلفية */}
                        <motion.div
                            className="absolute inset-0 bg-black/95 backdrop-blur-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* القائمة */}
                        <motion.div
                            className="absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 shadow-2xl"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                                {navItems.map((item, index) => (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`w-full text-right px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${activeSection === item.id
                                            ? 'text-cyan-400 bg-cyan-400/10'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                                            }`}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        {item.label}
                                    </motion.button>
                                ))}

                                {/* أزرار اللغات */}
                                <div className="flex items-center gap-2 mt-4 border-t border-gray-700 pt-4">
                                    <button
                                        onClick={() => changeLanguage('en')}
                                        className={`${langButtonClasses} ${i18n.language === 'en' ? activeLangButtonClasses : inactiveLangButtonClasses}`}
                                    >
                                        EN
                                    </button>
                                    <button
                                        onClick={() => changeLanguage('de')}
                                        className={`${langButtonClasses} ${i18n.language === 'de' ? activeLangButtonClasses : inactiveLangButtonClasses}`}
                                    >
                                        DE
                                    </button>
                                    <button
                                        onClick={() => changeLanguage('ar')}
                                        className={`${langButtonClasses} ${i18n.language === 'ar' ? activeLangButtonClasses : inactiveLangButtonClasses}`}
                                    >
                                        AR
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
