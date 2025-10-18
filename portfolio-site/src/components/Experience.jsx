// src/components/Experience.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

function Experience() {
    const { t, i18n } = useTranslation();
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    // جلب الخبرات في الوقت الفعلي
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "experiences"), (snapshot) => {
            const expData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // فرز الخبرات: الوظيفة الحالية أولاً، ثم حسب الفترة
            setExperiences(expData.sort((a, b) => b.is_current - a.is_current || b.period.localeCompare(a.period)));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching experiences:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getLocalizedTitle = (exp) => {
        return i18n.language === 'ar' ? exp.title_ar : exp.title_en;
    };

    const getLocalizedDesc = (exp) => {
        return i18n.language === 'ar' ? exp.description_ar : exp.description_en;
    };

    return (
        <section id="experience" className="py-24 bg-[#161b22]">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold mb-16 text-white">{t('experience_title')}</h2>

                {loading ? (
                    <p className="text-gray-400">... {t('loading_experiences')} ...</p>
                ) : experiences.length === 0 ? (
                    <p className="text-gray-400">{t('no_experiences')}</p>
                ) : (
                    <div className="max-w-3xl mx-auto text-left">
                        <div className={`relative ${i18n.language === 'ar' ? 'border-r' : 'border-l'} border-gray-700 space-y-12 pb-4`}>
                            {experiences.map((exp) => (
                                <div
                                    key={exp.id}
                                    className={`relative ${i18n.language === 'ar' ? 'pr-8' : 'pl-8'}`}
                                    dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                                >
                                    {/* الدائرة الزمنية */}
                                    <div className={`absolute top-0 w-4 h-4 rounded-full ${exp.is_current ? 'bg-[#00f0ff] animate-pulse' : 'bg-gray-700'} ${i18n.language === 'ar' ? 'right-[-8px]' : 'left-[-8px]'}`}></div>

                                    {/* البطاقة */}
                                    <div className="gradient-border-card p-6 rounded-lg shadow-lg hover:shadow-cyan-500/20">
                                        <h3 className="text-xl font-bold text-cyan-400 mb-1">
                                            {getLocalizedTitle(exp)}
                                            {exp.is_current && <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${i18n.language === 'ar' ? 'mr-2' : 'ml-2'} bg-green-600/30 text-green-300`}>{t('current_job')}</span>}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-2">{exp.company} | {exp.period}</p>
                                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{getLocalizedDesc(exp)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Experience;
