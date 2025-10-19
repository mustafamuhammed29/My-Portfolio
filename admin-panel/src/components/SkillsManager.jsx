// admin-panel/src/components/SkillsManager.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';

const CATEGORIES = [
    { id: 'mobile', name: 'تطبيقات الموبايل', color: 'text-green-400' },
    { id: 'web', name: 'تطوير الويب', color: 'text-yellow-400' },
    { id: 'data', name: 'قواعد البيانات', color: 'text-blue-400' },
    { id: 'tools', name: 'أدوات وتقنيات', color: 'text-purple-400' },
];

function SkillsManager() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentSkill, setCurrentSkill] = useState({
        id: null,
        name: '',
        category: CATEGORIES[0].id,
        icon_url: '', // تم التغيير من icon إلى icon_url
        color: 'from-cyan-400 to-green-400',
    });

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "skills"), (snapshot) => {
            const skillsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSkills(skillsData.sort((a, b) => a.category.localeCompare(b.category)));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const resetForm = () => {
        setCurrentSkill({
            id: null, name: '', category: CATEGORIES[0].id, icon_url: '', color: 'from-cyan-400 to-green-400',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentSkill.name || !currentSkill.icon_url || !currentSkill.category) {
            alert('يرجى ملء جميع الحقول.');
            return;
        }

        const skillData = {
            name: currentSkill.name,
            category: currentSkill.category,
            icon_url: currentSkill.icon_url,
            color: currentSkill.color,
        };

        if (currentSkill.id) {
            await setDoc(doc(db, "skills", currentSkill.id), skillData);
        } else {
            await addDoc(collection(db, "skills"), skillData);
        }
        resetForm();
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`هل أنت متأكد من حذف المهارة: ${name}؟`)) {
            await deleteDoc(doc(db, "skills", id));
        }
    };

    const handleEdit = (skill) => {
        setCurrentSkill(skill);
        window.scrollTo(0, 0);
    };

    return (
        <div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
                <h3 className="text-2xl font-bold mb-4">{currentSkill.id ? 'تعديل المهارة' : 'إضافة مهارة جديدة'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="اسم المهارة (مثال: React)" value={currentSkill.name} onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" required />
                        <select value={currentSkill.category} onChange={(e) => setCurrentSkill({ ...currentSkill, category: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500">
                            {CATEGORIES.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="url" placeholder="رابط الأيقونة (SVG, PNG)" value={currentSkill.icon_url} onChange={(e) => setCurrentSkill({ ...currentSkill, icon_url: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" required />
                        <input type="text" placeholder="لون التدرج (مثال: from-cyan-400 to-blue-600)" value={currentSkill.color} onChange={(e) => setCurrentSkill({ ...currentSkill, color: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" required />
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-5 rounded-lg">{currentSkill.id ? 'حفظ التعديلات' : 'إضافة المهارة'}</button>
                        {currentSkill.id && <button type="button" onClick={resetForm} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-5 rounded-lg">إلغاء</button>}
                    </div>
                </form>
            </div>

            {/* قائمة المهارات الحالية */}
            <div className="space-y-4">
                {CATEGORIES.map(cat => {
                    const categorySkills = skills.filter(s => s.category === cat.id);
                    if (categorySkills.length === 0) return null;
                    return (
                        <div key={cat.id}>
                            <h4 className="text-xl font-bold mb-3 text-cyan-400">{cat.name}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {categorySkills.map(skill => (
                                    <div key={skill.id} className="bg-gray-900 p-3 rounded-lg flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <img src={skill.icon_url} alt={skill.name} className="w-5 h-5" />
                                            <span>{skill.name}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(skill)} className="text-blue-400">تعديل</button>
                                            <button onClick={() => handleDelete(skill.id, skill.name)} className="text-red-400">حذف</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SkillsManager;

