// src/components/Projects.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { ExternalLink, Github, Smartphone, Globe } from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "projects"));
                const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProjects(projectsData);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const getIconComponent = (type) => {
        return type === "mobile" ? Smartphone : Globe;
    };

    return (
        <section id="projects" className="min-h-screen py-20 bg-gray-900 relative overflow-hidden">
            {/* خلفية زخرفية */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-400 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-green-400 rounded-full filter blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* العنوان */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        المشاريع <span className="text-cyan-400">المميزة</span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto mb-4"></div>
                    <p className="text-gray-400 text-lg">
                        مجموعة من أفضل مشاريع الويب والموبايل التي عملت عليها
                    </p>
                </motion.div>

                {/* شبكة المشاريع */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {loading ? (
                        <p className="text-gray-400 col-span-full text-center">... يتم تحميل المشاريع ...</p>
                    ) : projects.length === 0 ? (
                        <p className="text-gray-400 col-span-full text-center">
                            لا توجد مشاريع لعرضها حالياً. قم بإضافة بعض المشاريع من لوحة التحكم!
                        </p>
                    ) : (
                        projects.map((project, index) => {
                            const IconComponent = getIconComponent(project.type);

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
                                    {/* الخلفية المتدرجة */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient || "from-cyan-400 to-green-400"} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                                    {/* شارة النوع */}
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${project.type === 'mobile'
                                                ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                                                : 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                                            }`}>
                                            <IconComponent className="w-3 h-3" />
                                            {project.type === 'mobile' ? 'موبايل' : 'ويب'}
                                        </div>
                                    </div>

                                    <div className="p-6 relative z-10 flex flex-col">
                                        {/* صورة المشروع */}
                                        {project.image && (
                                            <img
                                                src={project.image}
                                                alt={project.title_ar}
                                                className="w-full h-48 object-cover rounded-lg mb-4"
                                            />
                                        )}

                                        {/* الأيقونة */}
                                        <div className="mb-4 inline-block p-3 bg-cyan-400/10 rounded-lg group-hover:bg-cyan-400/20 transition-all duration-300">
                                            <IconComponent className="w-8 h-8 text-cyan-400" />
                                        </div>

                                        {/* العنوان */}
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                                            {project.title_ar}
                                        </h3>

                                        {/* الوصف */}
                                        <p className="text-gray-400 mb-4 leading-relaxed flex-grow">
                                            {project.desc_ar}
                                        </p>

                                        {/* التقنيات */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.tech?.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1 text-xs font-semibold bg-gray-700/50 text-cyan-400 rounded-full border border-gray-600"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* الأزرار */}
                                        <div className="flex gap-3 mt-auto">
                                            <motion.a
                                                href={project.demo_url || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 text-sm font-semibold"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                معاينة
                                            </motion.a>
                                            <motion.a
                                                href={project.github_url || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-300 text-sm font-semibold"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Github className="w-4 h-4" />
                                                الكود
                                            </motion.a>
                                        </div>
                                    </div>

                                    {/* تأثير الإضاءة */}
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
