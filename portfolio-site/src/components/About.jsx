// src/components/About.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Briefcase, Users, Zap, CheckCircle } from 'lucide-react';

function About() {
    const { t, i18n } = useTranslation();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "settings", "portfolioAbout");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData(docSnap.data());
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
        return data[`desc_${lang}`] || t('about_desc');
    };

    const stats = [
        { icon: Briefcase, value: data.projects, labelKey: 'stat_projects', color: 'text-cyan-400' },
        { icon: Users, value: data.clients, labelKey: 'stat_clients', color: 'text-green-400' },
        { icon: Zap, value: data.experience, labelKey: 'stat_experience', color: 'text-yellow-400' },
        { icon: CheckCircle, value: data.commitment, labelKey: 'stat_commitment', color: 'text-purple-400' }
    ];

    return (
        // تم تعديل الإزاحة وإزالة min-h-screen لفصل الأقسام بشكل أفضل
        <section id="about" className="relative py-24 sm:py-32 overflow-hidden bg-transparent text-white">
            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('about_title')}</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto rounded-full mb-12"></div>
                </motion.div>

                <motion.p
                    className="text-lg leading-relaxed text-gray-400 max-w-3xl mx-auto mb-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {loading ? t('about_desc') : getLocalizedDesc()}
                </motion.p>

                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ staggerChildren: 0.2 }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="gradient-border-card p-6 flex flex-col items-center justify-center gap-2"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                        >
                            <stat.icon className={`w-10 h-10 ${stat.color} mb-2`} />
                            <h3 className="text-3xl font-bold">
                                {loading ? '...' : stat.value}
                                {index < 3 ? '+' : '%'}
                            </h3>
                            <p className="text-gray-400">{t(stat.labelKey)}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default About;

