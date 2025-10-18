// src/components/Header.jsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Header = () => {
    const { t } = useTranslation();

    const badges = ["UI/UX Design", "Mobile Apps", "Web Development"];

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header id="home" className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-6">

            {/* النقاط المتحركة */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                        transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                    />
                ))}
            </div>

            {/* المحتوى الرئيسي */}
            <div className="z-10 text-center pt-[120px] pb-24">
                {/* الشعار */}
                <div className="flex justify-center items-center gap-4 mb-6">
                    <div className="gradient-border-card w-16 h-16 flex items-center justify-center">
                        <i className="fa-solid fa-mobile-screen text-3xl text-[#00f0ff]"></i>
                    </div>
                    <div className="gradient-border-card w-16 h-16 flex items-center justify-center">
                        <i className="fa-solid fa-code text-3xl text-[#00f0ff]"></i>
                    </div>
                </div>

                {/* العنوان */}
                <motion.h1
                    className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] to-[#58a6ff]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {t('hero_title')}
                </motion.h1>

                {/* الوصف */}
                <motion.p
                    className="font-mono text-lg md:text-xl text-gray-400 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    {t('hero_subtitle')}
                </motion.p>

                {/* الأزرار */}
                <motion.div
                    className="flex justify-center gap-4 mb-8 flex-wrap"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <motion.a
                        href="#projects"
                        className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-green-400 text-black font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/50"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {t('hero_btn_projects')}
                    </motion.a>
                    <motion.a
                        href="#contact"
                        className="px-8 py-3 border-2 border-cyan-400 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {t('hero_btn_contact')}
                    </motion.a>
                </motion.div>

                {/* الشارات */}
                <motion.div
                    className="flex gap-3 justify-center flex-wrap mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                >
                    {badges.map((badge, index) => (
                        <motion.span
                            key={index}
                            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-gray-300 text-sm font-semibold backdrop-blur-sm"
                            whileHover={{ scale: 1.1, borderColor: '#22d3ee' }}
                            transition={{ duration: 0.2 }}
                        >
                            {badge}
                        </motion.span>
                    ))}
                </motion.div>
            </div>

            {/* سهم التمرير للأسفل */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                onClick={() => scrollToSection('about')}
            >
                <ChevronDown className="w-8 h-8 text-cyan-400" />
            </motion.div>
        </header>
    );
};

export default Header;
