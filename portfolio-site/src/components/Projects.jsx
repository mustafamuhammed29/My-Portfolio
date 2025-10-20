// src/components/Projects.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github, Smartphone, Globe } from 'lucide-react';
import ProjectCardSkeleton from './ProjectCardSkeleton';

const Projects = () => {
    const { t, i18n } = useTranslation();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(projectsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getIconComponent = (type) => (type === "mobile" ? Smartphone : Globe);
    const getLocalized = (item, field) => {
        const lang = i18n.language;
        return item[`${field}_${lang}`] || item[`${field}_en`] || item[`${field}_ar`];
    };

    // 1. تعريف حركات الحاوية والعناصر لتأثير التدرج
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // التأخير بين ظهور كل بطاقة
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('projects_title')}</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto mb-4"></div>
                    <p className="text-gray-400 text-lg">{t('projects_subtitle')}</p>
                </motion.div>

                {/* 2. تطبيق حركة الحاوية على الشبكة */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }} // يبدأ التأثير عند ظهور 20% من القسم
                >
                    {loading ? (
                        [...Array(3)].map((_, i) => <ProjectCardSkeleton key={i} />)
                    ) : projects.length === 0 ? (
                        <p className="text-gray-400 col-span-full text-center">{t('projects_empty')}</p>
                    ) : (
                        projects.map((project) => {
                            const IconComponent = getIconComponent(project.type);
                            const projectType = project.type === 'mobile' ? t('project_type_mobile') : t('project_type_web');

                            return (
                                // 3. تطبيق حركة العنصر على كل بطاقة
                                <motion.div
                                    key={project.id}
                                    className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-cyan-400/50 transition-all duration-300"
                                    variants={itemVariants} // استخدام حركة العنصر
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
                                        {project.image && <img src={project.image} alt={getLocalized(project, 'title')} className="w-full h-48 object-cover rounded-lg mb-4" />}
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">{getLocalized(project, 'title')}</h3>
                                        <p className="text-gray-400 mb-4 leading-relaxed flex-grow">{getLocalized(project, 'desc')}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.tech?.map((tag) => (
                                                <span key={tag} className="px-3 py-1 text-xs font-semibold bg-gray-700/50 text-cyan-400 rounded-full border border-gray-600">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="flex gap-3 mt-auto pt-4 border-t border-gray-700/50">
                                            <motion.a href={project.demo_url || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <ExternalLink className="w-4 h-4" />{t('project_btn_preview')}
                                            </motion.a>
                                            <motion.a href={project.github_url || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Github className="w-4 h-4" />{t('project_btn_code')}
                                            </motion.a>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-400/20 rounded-full filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </motion.div>
                            );
                        })
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;

