import React from 'react';
import { motion } from 'framer-motion';

// --- بيانات المهارات المدمجة ---
const SKILL_DATA = [
    {
        category: "تطوير تطبيقات الموبايل",
        categoryColor: "text-green-400",
        skills: [
            { name: "Android", icon: "🤖", color: "from-green-500 to-lime-500" },
            { name: "iOS", icon: "🍎", color: "from-gray-300 to-gray-500" },
            { name: "React Native", icon: "⚛️", color: "from-cyan-400 to-blue-600" },
            { name: "Flutter", icon: "🐦", color: "from-sky-400 to-blue-400" },
        ]
    },
    {
        category: "تطوير الويب",
        categoryColor: "text-yellow-400",
        skills: [
            { name: "React", icon: "⚛️", color: "from-cyan-400 to-blue-600" },
            { name: "Node.js", icon: "🟢", color: "from-green-500 to-green-700" },
            { name: "JavaScript", icon: "🟡", color: "from-yellow-400 to-amber-600" },
            { name: "Python", icon: "🐍", color: "from-blue-500 to-indigo-700" },
        ]
    },
];

const App = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <section id="skills" className="min-h-screen py-20 bg-black text-white relative overflow-hidden">

            {/* خلفية متحركة */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-400/10 rounded-full filter blur-3xl opacity-30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-400/10 rounded-full filter blur-3xl opacity-30"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">

                {/* العنوان */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                        المهارات <span className="text-cyan-400">التقنية</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto rounded-full"></div>
                </motion.div>

                {/* شبكة المهارات */}
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {SKILL_DATA.map((category, categoryIndex) => (
                        <motion.div
                            key={categoryIndex}
                            className="bg-gray-900/60 backdrop-blur-md p-8 rounded-3xl border border-gray-800 shadow-2xl hover:border-cyan-400 transition-all duration-300"
                            variants={itemVariants}
                        >
                            <h3 className={`text-3xl font-bold mb-8 flex items-center ${category.categoryColor}`}>
                                <span className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-green-400 rounded-full ml-3"></span>
                                {category.category}
                            </h3>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {category.skills.map((skill, skillIndex) => (
                                    <motion.div
                                        key={skillIndex}
                                        className="group relative cursor-pointer"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true, amount: 0.5 }}
                                        transition={{ duration: 0.5, delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                    >
                                        {/* الحدود المتوهجة */}
                                        <div className={`absolute -inset-0.5 bg-gradient-to-br ${skill.color} rounded-2xl blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10`}></div>

                                        {/* محتوى البطاقة */}
                                        <div className="relative bg-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 h-28 border border-gray-700 hover:border-transparent transition-colors duration-300">
                                            <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                                                {skill.icon}
                                            </div>
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

                {/* نص إضافي */}
                <motion.div
                    className="text-center mt-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <p className="text-gray-400 text-lg font-medium">
                        وأكثر من ذلك بكثير... <span className="text-cyan-400">دائماً في تعلم مستمر</span> واكتشاف لتقنيات جديدة 💡
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default App;
