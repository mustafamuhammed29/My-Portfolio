// admin-panel/src/components/ProjectManager.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';

function ProjectManager() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for the form
    const [currentProject, setCurrentProject] = useState({
        id: null,
        title_ar: '',
        title_en: '',
        desc_ar: '',
        desc_en: '',
        image: '',
        tech: '',
        type: 'web',
        icon_class: 'fa-solid fa-code',
        github_url: '', // رابط GitHub
        demo_url: '', // رابط المعاينة
        gradient: 'from-cyan-400 to-green-400', // لون الخلفية المتدرجة
    });

    // Fetch projects in real-time from Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(projectsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const resetForm = () => {
        setCurrentProject({
            id: null, title_ar: '', title_en: '', desc_ar: '', desc_en: '', image: '', tech: '', type: 'web', icon_class: 'fa-solid fa-code', github_url: '', demo_url: '', gradient: 'from-cyan-400 to-green-400'
        });
    };

    // Handle form submission (Add or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentProject.title_ar || !currentProject.title_en) {
            alert('الرجاء ملء حقلي العنوان (عربي وإنجليزي) على الأقل.');
            return;
        }

        const projectData = {
            title_ar: currentProject.title_ar,
            title_en: currentProject.title_en,
            desc_ar: currentProject.desc_ar,
            desc_en: currentProject.desc_en,
            image: currentProject.image,
            tech: currentProject.tech.split(',').map(t => t.trim()),
            type: currentProject.type,
            icon_class: currentProject.icon_class,
            github_url: currentProject.github_url,
            demo_url: currentProject.demo_url,
            gradient: currentProject.gradient,
        };

        if (currentProject.id) {
            await setDoc(doc(db, "projects", currentProject.id), projectData);
        } else {
            await addDoc(collection(db, "projects"), projectData);
        }
        resetForm();
    };

    // Handle project deletion
    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
            await deleteDoc(doc(db, "projects", id));
        }
    };

    // Handle project editing
    const handleEdit = (project) => {
        setCurrentProject({
            ...project,
            tech: project.tech.join(', '),
        });
        window.scrollTo(0, 0);
    };

    return (
        <div>
            {/* Form Section */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
                <h3 className="text-2xl font-bold mb-4">{currentProject.id ? 'تعديل المشروع' : 'إضافة مشروع جديد'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="عنوان المشروع (عربي)" value={currentProject.title_ar} onChange={(e) => setCurrentProject({ ...currentProject, title_ar: e.target.value })} className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        <input type="text" placeholder="عنوان المشروع (إنجليزي)" value={currentProject.title_en} onChange={(e) => setCurrentProject({ ...currentProject, title_en: e.target.value })} className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <textarea placeholder="وصف المشروع (عربي)" value={currentProject.desc_ar} onChange={(e) => setCurrentProject({ ...currentProject, desc_ar: e.target.value })} rows="3" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"></textarea>
                    <input type="url" placeholder="رابط صورة المشروع" value={currentProject.image} onChange={(e) => setCurrentProject({ ...currentProject, image: e.target.value })} className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    <input type="text" placeholder="التقنيات (مفصولة بفاصلة: React, Firebase)" value={currentProject.tech} onChange={(e) => setCurrentProject({ ...currentProject, tech: e.target.value })} className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select value={currentProject.type} onChange={(e) => setCurrentProject({ ...currentProject, type: e.target.value })} className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                            <option value="web">ويب</option>
                            <option value="mobile">موبايل</option>
                        </select>
                        <input type="text" placeholder="لون الخلفية (مثال: from-purple-400 to-pink-400)" value={currentProject.gradient} onChange={(e) => setCurrentProject({ ...currentProject, gradient: e.target.value })} className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="url" placeholder="رابط GitHub" value={currentProject.github_url} onChange={(e) => setCurrentProject({ ...currentProject, github_url: e.target.value })} className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        <input type="url" placeholder="رابط المعاينة (Demo)" value={currentProject.demo_url} onChange={(e) => setCurrentProject({ ...currentProject, demo_url: e.target.value })} className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>

                    <div className="flex gap-4">
                        <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-5 rounded-lg transition-colors">{currentProject.id ? 'حفظ التعديلات' : 'إضافة المشروع'}</button>
                        {currentProject.id && <button type="button" onClick={resetForm} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-5 rounded-lg transition-colors">إلغاء التعديل</button>}
                    </div>
                </form>
            </div>

            {/* Projects List Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <p>جاري تحميل المشاريع...</p> : projects.map(project => (
                    <div key={project.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col">
                        <img src={project.image} alt={project.title_ar} className="w-full h-40 object-cover rounded-md mb-4" />
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xl font-bold">{project.title_ar}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span>{project.type === 'mobile' ? 'موبايل' : 'ويب'}</span>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 flex-grow">{project.desc_ar}</p>
                        <div className="flex justify-end gap-2 mt-auto">
                            <button onClick={() => handleEdit(project)} className="text-blue-400 hover:text-blue-300">تعديل</button>
                            <button onClick={() => handleDelete(project.id)} className="text-red-400 hover:text-red-300">حذف</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectManager;

