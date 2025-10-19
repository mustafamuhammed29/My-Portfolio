// src/components/Experience.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import ExperienceItemSkeleton from './ExperienceItemSkeleton'; // 1. استيراد هيكل التحميل

function Experience() {
    const { t, i18n } = useTranslation();
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "experiences"), (snapshot) => {
            const expData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setExperiences(expData.sort((a, b) => (b.isCurrent ? 1 : -1) || new Date(b.startDate) - new Date(a.startDate)));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching experiences:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getLocalized = (item, field) => {
        const lang = i18n.language;
        return item[`${field}_${lang}`] || item[`${field}_en`] || item[`${field}_ar`];
    };

    return (
        <section id="experience" className="py-24 bg-transparent text-white">
            <div className="container mx-auto px-6 text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('experience_title')}</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto rounded-full mb-16"></div>
                </motion.div>

                <div className="max-w-3xl mx-auto text-left">
                    <div className={`relative ${i18n.language === 'ar' ? 'border-r-2' : 'border-l-2'} border-gray-700 space-y-12 pb-4`}>
                        {/* 2. عرض هياكل التحميل أثناء فترة الانتظار */}
                        {loading ? (
                            [...Array(2)].map((_, i) => <ExperienceItemSkeleton key={i} />)
                        ) : experiences.length === 0 ? (
                            <p className="text-gray-400 text-center">{t('no_experiences')}</p>
                        ) : (
                            experiences.map((exp, index) => (
                                <motion.div
                                    key={exp.id}
                                    className={`relative ${i18n.language === 'ar' ? 'pr-8' : 'pl-8'}`}
                                    dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                                    initial={{ opacity: 0, x: i18n.language === 'ar' ? 50 : -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                >
                                    <div className={`absolute top-1 w-5 h-5 rounded-full ${exp.isCurrent ? 'bg-[#00f0ff] animate-pulse' : 'bg-gray-700'} ${i18n.language === 'ar' ? 'right-[-11px]' : 'left-[-11px]'} border-4 border-black`}></div>
                                    <div className="gradient-border-card p-6 rounded-lg">
                                        <h3 className="text-xl font-bold text-cyan-400 mb-1">
                                            {getLocalized(exp, 'title')}
                                            {exp.isCurrent && <span className={`text-xs px-2 py-0.5 rounded-full ${i18n.language === 'ar' ? 'mr-2' : 'ml-2'} bg-green-600/30 text-green-300`}>{t('current_job')}</span>}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-3">{exp.company} | {exp.startDate} - {exp.isCurrent ? t('current_job') : exp.endDate}</p>
                                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{getLocalized(exp, 'desc')}</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Experience;

