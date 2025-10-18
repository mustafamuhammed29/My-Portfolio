// src/components/ProjectManager.jsx
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
    });

    // 1. Fetch projects in real-time from Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(projectsData);
            setLoading(false);
        });
        return () => unsubscribe(); // Cleanup listener on component unmount
    }, []);

    const resetForm = () => {
        setCurrentProject({
            id: null, title_ar: '', title_en: '', desc_ar: '', desc_en: '', image: '', tech: '',
        });
    };

    // 2. Handle form submission (Add or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentProject.title_ar || !currentProject.title_en || !currentProject.desc_ar) {
            alert('الرجاء ملء الحقول الأساسية على الأقل.');
            return;
        }

        const projectData = {
            title_ar: currentProject.title_ar,
            title_en: currentProject.title_en,
            desc_ar: currentProject.desc_ar,
            desc_en: currentProject.desc_en,
            image: currentProject.image,
            tech: currentProject.tech.split(',').map(t => t.trim()), // Convert string to array
        };

        if (currentProject.id) {
            // Update existing project
            await setDoc(doc(db, "projects", currentProject.id), projectData);
        } else {
            // Add new project
            await addDoc(collection(db, "projects"), projectData);
        }
        resetForm();
    };

    // 3. Handle project deletion
    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.')) {
            await deleteDoc(doc(db, "projects", id));
        }
    };

    // 4. Handle project editing
    const handleEdit = (project) => {
        setCurrentProject({
            id: project.id,
            title_ar: project.title_ar,
            title_en: project.title_en,
            desc_ar: project.desc_ar,
            desc_en: project.desc_en,
            image: project.image,
            tech: project.tech.join(', '), // Convert array back to string for input
        });
        window.scrollTo(0, 0); // Scroll to top to see the form
    };

    return (
        <div>
            {/* Form Section */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
                <h3 className="text-2xl font-bold mb-4">{currentProject.id ? 'تعديل المشروع' : 'إضافة مشروع جديد'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="عنوان المشروع (عربي)" value={currentProject.title_ar} onChange={(e) => setCurrentProject({ ...currentProject, title_ar: e.target.value })} className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        <input type="text" placeholder="عنوان المشروع (إنجليزي)" value={currentProject.title_en} onChange={(e) => setCurrentProject({ ...currentProject, title_en: e.target.value })} className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <textarea placeholder="وصف المشروع (عربي)" value={currentProject.desc_ar} onChange={(e) => setCurrentProject({ ...currentProject, desc_ar: e.target.value })} rows="3" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"></textarea>
                    <textarea placeholder="وصف المشروع (إنجليزي)" value={currentProject.desc_en} onChange={(e) => setCurrentProject({ ...currentProject, desc_en: e.target.value })} rows="3" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"></textarea>
                    <input type="url" placeholder="رابط صورة المشروع" value={currentProject.image} onChange={(e) => setCurrentProject({ ...currentProject, image: e.target.value })} className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    <input type="text" placeholder="التقنيات (مفصولة بفاصلة: React, Firebase)" value={currentProject.tech} onChange={(e) => setCurrentProject({ ...currentProject, tech: e.target.value })} className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
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
                        <h4 className="text-xl font-bold mb-2">{project.title_ar}</h4>
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
