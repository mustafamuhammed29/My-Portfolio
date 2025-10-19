// src/components/Projects.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebaseConfig';
// 1. استيراد onSnapshot بدلاً من getDocs
import { collection, onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github, Smartphone, Globe } from 'lucide-react';

const Projects = () => {
    const { t, i18n } = useTranslation();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. استخدام onSnapshot للتحديثات الفورية والقضاء على التأخير
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(projectsData);
            setLoading(false);
        });

        // 3. تنظيف المستمع عند إغلاق المكون لمنع تسرب الذاكرة
        return () => unsubscribe();
    }, []);

    const getIconComponent = (type) => {
        return type === "mobile" ? Smartphone : Globe;
    };

    return (
        <section id="projects" className="min-h-screen py-20 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {t('projects_title')}
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto mb-4"></div>
                    <p className="text-gray-400 text-lg">
                        {t('projects_subtitle', 'مجموعة من أفضل مشاريع الويب والموبايل التي عملت عليها')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {loading ? (
                        <p className="text-gray-400 col-span-full text-center">{t('projects_loading')}</p>
                    ) : projects.length === 0 ? (
                        <p className="text-gray-400 col-span-full text-center">{t('projects_empty')}</p>
                    ) : (
                        projects.map((project, index) => {
                            const IconComponent = getIconComponent(project.type);
                            const title = i18n.language === 'ar' ? project.title_ar : project.title_en;
                            const desc = i18n.language === 'ar' ? project.desc_ar : project.desc_en;
                            const projectType = project.type === 'mobile' ? t('project_type_mobile', 'Mobile') : t('project_type_web', 'Web');

                            return (
                                <motion.div
                                    key={project.id}
                                    className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-cyan-400/50 transition-all duration-300"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -10 }}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient || "from-cyan-400 to-green-400"} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${project.type === 'mobile' ? 'bg-green-400/20 text-green-400 border border-green-400/30' : 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'}`}>
                                            <IconComponent className="w-3 h-3" />
                                            {projectType}
                                        </div>
                                    </div>
                                    <div className="p-6 relative z-10 flex flex-col h-full">
                                        {project.image && <img src={project.image} alt={title} className="w-full h-48 object-cover rounded-lg mb-4" />}
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">{title}</h3>
                                        <p className="text-gray-400 mb-4 leading-relaxed flex-grow">{desc}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.tech?.map((tag) => <span key={tag} className="px-3 py-1 text-xs font-semibold bg-gray-700/50 text-cyan-400 rounded-full border border-gray-600">{tag}</span>)}
                                        </div>
                                        <div className="flex gap-3 mt-auto pt-4 border-t border-gray-700/50">
                                            <motion.a href={project.demo_url || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <ExternalLink className="w-4 h-4" />
                                                {t('project_btn_preview')}
                                            </motion.a>
                                            <motion.a href={project.github_url || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Github className="w-4 h-4" />
                                                {t('project_btn_code')}
                                            </motion.a>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-400/20 rounded-full filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
};

export default Projects;

