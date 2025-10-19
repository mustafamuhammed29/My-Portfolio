// src/components/Skills.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

// بيانات الفئات الثابتة مع مفاتيح الترجمة
const CATEGORIES = [
    { id: 'mobile', name_key: "skills_mobile_title", color: "text-green-400" },
    { id: 'web', name_key: "skills_web_title", color: "text-yellow-400" },
    { id: 'data', name_key: "skills_data_title", color: "text-blue-400" },
    { id: 'tools', name_key: "skills_tools_title", color: "text-purple-400" },
];

const Skills = () => {
    const { t } = useTranslation();
    const [skillData, setSkillData] = useState([]);
    const [loading, setLoading] = useState(true);

    // جلب المهارات من Firestore في الوقت الفعلي
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "skills"), (snapshot) => {
            const skillsFromDb = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // تجميع المهارات حسب الفئة
            const groupedSkills = CATEGORIES.map(category => {
                return {
                    ...category,
                    skills: skillsFromDb.filter(skill => skill.category === category.id)
                }
            }).filter(category => category.skills.length > 0);

            setSkillData(groupedSkills);
            setLoading(false);
        });
        return () => unsubscribe(); // تنظيف المستمع عند إزالة المكون
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <section id="skills" className="min-h-screen py-20 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">

                {/* العنوان */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
                        {t('skills_title')}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto rounded-full"></div>
                </motion.div>

                {/* شبكة المهارات */}
                {loading ? <div className="text-center text-gray-400">{t('skills_loading', '...جاري تحميل المهارات')}</div> :
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {skillData.map((category, categoryIndex) => (
                            <motion.div
                                key={category.id}
                                className="bg-gray-900/60 backdrop-blur-md p-8 rounded-3xl border border-gray-800 shadow-2xl hover:border-cyan-400 transition-all duration-300"
                                variants={itemVariants}
                            >
                                <h3 className={`text-3xl font-bold mb-8 flex items-center ${category.color}`}>
                                    <span className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-green-400 rounded-full me-3"></span>
                                    {t(category.name_key)}
                                </h3>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {category.skills.map((skill, skillIndex) => (
                                        <motion.div
                                            key={skill.id}
                                            className="group relative cursor-pointer"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true, amount: 0.5 }}
                                            transition={{ duration: 0.5, delay: (skillIndex * 0.05) }}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                        >
                                            <div className={`absolute -inset-0.5 bg-gradient-to-br ${skill.color} rounded-2xl blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10`}></div>
                                            <div className="relative bg-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 h-28 border border-gray-700 hover:border-transparent transition-colors duration-300">
                                                {/* استخدام الصورة من الرابط */}
                                                <img
                                                    src={skill.icon_url}
                                                    alt={`${skill.name} icon`}
                                                    className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <div className="text-white text-sm font-semibold text-center leading-tight mt-1">
                                                    {skill.name}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                }
            </div>
        </section>
    );
};

export default Skills;

