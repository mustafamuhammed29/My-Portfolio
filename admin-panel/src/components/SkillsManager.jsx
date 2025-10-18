// admin-panel/src/components/SkillsManager.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';

// قائمة التصنيفات الثابتة
const CATEGORIES = [
    { id: 'mobile', name: 'تطبيقات الموبايل' },
    { id: 'web', name: 'تطوير الويب' },
    { id: 'data', name: 'قواعد البيانات' },
    { id: 'tools', name: 'أدوات وتقنيات' },
];

function SkillsManager() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for the form (إضافة/تعديل مهارة)
    const [currentSkill, setCurrentSkill] = useState({
        id: null,
        name_ar: '', // اسم المهارة بالعربي
        name_en: '', // اسم المهارة بالإنجليزي
        category: CATEGORIES[0].id, // التصنيف الافتراضي
        icon_class: '', // كلاس أيقونة Font Awesome (مثال: fab fa-react)
        color: '#00f0ff', // اللون التفاعلي
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    // 1. جلب المهارات في الوقت الفعلي
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "skills"), (snapshot) => {
            const skillsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSkills(skillsData.sort((a, b) => a.category.localeCompare(b.category))); // فرز حسب التصنيف
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const resetForm = () => {
        setCurrentSkill({
            id: null, name_ar: '', name_en: '', category: CATEGORIES[0].id, icon_class: '', color: '#00f0ff',
        });
    };

    // 2. معالجة حفظ/تعديل المهارة
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentSkill.name_ar || !currentSkill.category || !currentSkill.icon_class) {
            alert('يرجى ملء جميع الحقول المطلوبة.');
            return;
        }

        setIsSaving(true);
        setMessage('');

        const skillData = {
            name_ar: currentSkill.name_ar,
            name_en: currentSkill.name_en,
            category: currentSkill.category,
            icon_class: currentSkill.icon_class,
            color: currentSkill.color,
        };

        try {
            if (currentSkill.id) {
                // تحديث مهارة موجودة
                await setDoc(doc(db, "skills", currentSkill.id), skillData);
                setMessage('تم تعديل المهارة بنجاح!');
            } else {
                // إضافة مهارة جديدة
                await addDoc(collection(db, "skills"), skillData);
                setMessage('تم إضافة المهارة بنجاح!');
            }
            resetForm();
        } catch (error) {
            console.error("Error saving skill:", error);
            setMessage('فشل في الحفظ. يرجى مراجعة الصلاحيات.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    // 3. معالجة حذف المهارة
    const handleDelete = async (id, name) => {
        if (window.confirm(`هل أنت متأكد من حذف المهارة: ${name}؟`)) {
            await deleteDoc(doc(db, "skills", id));
            setMessage('تم حذف المهارة بنجاح.');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    // 4. معالجة التعديل
    const handleEdit = (skill) => {
        setCurrentSkill(skill);
        window.scrollTo(0, 0); // للعودة إلى النموذج في الأعلى
    };

    const getCategoryName = (id) => {
        return CATEGORIES.find(cat => cat.id === id)?.name || id;
    };

    const currentCategory = CATEGORIES.find(cat => cat.id === currentSkill.category);

    return (
        <div>
            {/* رسالة الحالة */}
            {message && (
                <div className={`p-3 mb-4 rounded ${message.includes('نجاح') ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                    {message}
                </div>
            )}

            {/* نموذج الإضافة/التعديل */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
                <h3 className="text-2xl font-bold mb-4">{currentSkill.id ? 'تعديل المهارة' : 'إضافة مهارة جديدة'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="اسم المهارة (العربية)" value={currentSkill.name_ar} onChange={(e) => setCurrentSkill({ ...currentSkill, name_ar: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" required />
                        <input type="text" placeholder="اسم المهارة (الإنجليزية)" value={currentSkill.name_en} onChange={(e) => setCurrentSkill({ ...currentSkill, name_en: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" required dir="ltr" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* اختيار التصنيف */}
                        <select value={currentSkill.category} onChange={(e) => setCurrentSkill({ ...currentSkill, category: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500">
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        {/* كلاس الأيقونة */}
                        <input type="text" placeholder="كلاس أيقونة (مثال: fab fa-react)" value={currentSkill.icon_class} onChange={(e) => setCurrentSkill({ ...currentSkill, icon_class: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" required dir="ltr" />

                        {/* اختيار اللون */}
                        <input type="color" title="لون الأيقونة" value={currentSkill.color} onChange={(e) => setCurrentSkill({ ...currentSkill, color: e.target.value })} className="p-2.5 h-full rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" />
                    </div>

                    <div className="flex gap-4 items-center">
                        <button type="submit" disabled={isSaving} className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-5 rounded-lg transition-colors disabled:bg-gray-500">
                            {isSaving ? '... جاري الحفظ' : (currentSkill.id ? 'حفظ التعديلات' : 'إضافة المهارة')}
                        </button>
                        {currentSkill.id && <button type="button" onClick={resetForm} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-5 rounded-lg transition-colors">إلغاء التعديل</button>}

                        {/* معاينة الأيقونة */}
                        <div className="flex items-center gap-2 border-r pr-4 border-gray-700">
                            <span className="text-sm text-gray-400">معاينة:</span>
                            <i className={`${currentSkill.icon_class} text-xl`} style={{ color: currentSkill.color || '#00f0ff' }}></i>
                        </div>
                    </div>
                </form>
            </div>

            {/* قائمة المهارات الحالية */}
            <h2 className="text-3xl font-bold mb-4">المهارات الحالية</h2>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                {loading ? (
                    <p>جاري تحميل المهارات...</p>
                ) : skills.length === 0 ? (
                    <p>لا توجد مهارات مضافة حالياً.</p>
                ) : (
                    <div className="space-y-4">
                        {CATEGORIES.map(cat => {
                            const categorySkills = skills.filter(s => s.category === cat.id);
                            if (categorySkills.length === 0) return null;

                            return (
                                <div key={cat.id} className="border-b border-gray-700 pb-4">
                                    <h4 className="text-xl font-bold mb-3 text-cyan-400">{cat.name}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {categorySkills.map(skill => (
                                            <div key={skill.id} className="bg-gray-900 p-3 rounded-lg flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <i className={`${skill.icon_class} text-lg`} style={{ color: skill.color }}></i>
                                                    <span>{skill.name_ar}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEdit(skill)} className="text-blue-400 hover:text-blue-300">تعديل</button>
                                                    <button onClick={() => handleDelete(skill.id, skill.name_ar)} className="text-red-400 hover:text-red-300">حذف</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SkillsManager;
