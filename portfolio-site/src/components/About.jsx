// src/components/About.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { db } from '../firebaseConfig'; // استيراد قاعدة البيانات
import { doc, getDoc } from 'firebase/firestore';

function About() {
    const { t, i18n } = useTranslation();
    const [data, setData] = useState({
        desc_ar: t('about_desc'),
        projects: '50', clients: '30', experience: '3', commitment: '100%'
    });
    const [loading, setLoading] = useState(true);

    // تحميل البيانات من Firestore
    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "settings", "portfolioAbout");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setData(prevData => ({ ...prevData, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching About data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getLocalizedDesc = () => {
        const lang = i18n.language;
        if (lang === 'ar') return data.desc_ar || t('about_desc');
        if (lang === 'en') return data.desc_en || t('about_desc');
        if (lang === 'de') return data.desc_de || t('about_desc');
        return t('about_desc');
    };

    return (
        <section id="about" className="relative py-24 min-h-screen overflow-hidden">

            {/* الخلفية: النقاط المتحركة */}
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

            <div className="container mx-auto px-6 relative z-10 text-center">
                <h2 className="text-4xl font-bold mb-12 text-white">{t('about_title')}</h2>

                <p className="text-lg leading-relaxed text-gray-400 max-w-3xl mx-auto mb-16">
                    {loading ? t('about_desc') : getLocalizedDesc()}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    <div className="gradient-border-card p-6 flex flex-col items-center justify-center">
                        <i className="fa-solid fa-rocket text-4xl text-[#00f0ff] mb-4"></i>
                        <h3 className="text-3xl font-bold mb-1">+{loading ? '...' : data.projects}</h3>
                        <p className="text-gray-400">{t('stat_projects')}</p>
                    </div>
                    <div className="gradient-border-card p-6 flex flex-col items-center justify-center">
                        <i className="fa-solid fa-users text-4xl text-[#00f0ff] mb-4"></i>
                        <h3 className="text-3xl font-bold mb-1">+{loading ? '...' : data.clients}</h3>
                        <p className="text-gray-400">{t('stat_clients')}</p>
                    </div>
                    <div className="gradient-border-card p-6 flex flex-col items-center justify-center">
                        <i className="fa-solid fa-award text-4xl text-[#00f0ff] mb-4"></i>
                        <h3 className="text-3xl font-bold mb-1">+{loading ? '...' : data.experience}</h3>
                        <p className="text-gray-400">{t('stat_experience')}</p>
                    </div>
                    <div className="gradient-border-card p-6 flex flex-col items-center justify-center">
                        <i className="fa-solid fa-check-double text-4xl text-[#00f0ff] mb-4"></i>
                        <h3 className="text-3xl font-bold mb-1">{loading ? '...' : data.commitment}%</h3>
                        <p className="text-gray-400">{t('stat_commitment')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
