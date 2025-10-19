// admin-panel/src/components/ExperienceManager.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';

function ExperienceManager() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    // حالة نموذج الإضافة/التعديل
    const [currentExperience, setCurrentExperience] = useState({
        id: null,
        title_ar: '',
        title_en: '',
        title_de: '',
        company: '',
        startDate: '',
        endDate: '', // يمكن أن تكون فارغة إذا كانت الوظيفة حالية
        desc_ar: '',
        desc_en: '',
        desc_de: '',
        isCurrent: false, // لتحديد ما إذا كانت الوظيفة حالية
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    // 1. جلب الخبرات في الوقت الفعلي
    useEffect(() => {
        // جلب البيانات وفرزها حسب تاريخ البداية تنازليًا (الأحدث أولاً)
        const unsubscribe = onSnapshot(collection(db, "experiences"), (snapshot) => {
            const expData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setExperiences(expData.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)));
            setLoading(false);
        });
        return () => unsubscribe(); // تنظيف المستمع
    }, []);

    const resetForm = () => {
        setCurrentExperience({
            id: null,
            title_ar: '', title_en: '', title_de: '',
            company: '', startDate: '', endDate: '',
            desc_ar: '', desc_en: '', desc_de: '',
            isCurrent: false,
        });
    };

    // 2. معالجة إرسال النموذج (إضافة/تعديل)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentExperience.title_ar || !currentExperience.company || !currentExperience.startDate) {
            alert('يرجى ملء الحقول المطلوبة (المسمى الوظيفي، الشركة، وتاريخ البداية).');
            return;
        }

        setIsSaving(true);
        setMessage('');

        // تجهيز البيانات للحفظ
        const expData = {
            ...currentExperience,
            // التأكد من أن endDate فارغ إذا كانت الوظيفة حالية
            endDate: currentExperience.isCurrent ? '' : currentExperience.endDate,
        };

        try {
            if (currentExperience.id) {
                // تحديث خبرة موجودة
                await setDoc(doc(db, "experiences", currentExperience.id), expData);
                setMessage('تم تعديل الخبرة بنجاح!');
            } else {
                // إضافة خبرة جديدة
                await addDoc(collection(db, "experiences"), expData);
                setMessage('تم إضافة الخبرة بنجاح!');
            }
            resetForm();
        } catch (error) {
            console.error("Error saving experience:", error);
            setMessage('فشل في الحفظ. يرجى مراجعة الصلاحيات.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    // 3. معالجة حذف الخبرة
    const handleDelete = async (id, title) => {
        if (window.confirm(`هل أنت متأكد من حذف الخبرة: ${title}؟`)) {
            await deleteDoc(doc(db, "experiences", id));
            setMessage('تم حذف الخبرة بنجاح.');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    // 4. معالجة التعديل (تم التحديث لضمان تحميل جميع حقول اللغة)
    const handleEdit = (experience) => {
        setCurrentExperience({
            id: experience.id,
            title_ar: experience.title_ar || '',
            title_en: experience.title_en || '',
            title_de: experience.title_de || '',
            company: experience.company || '',
            startDate: experience.startDate || '',
            endDate: experience.endDate || '',
            desc_ar: experience.desc_ar || '',
            desc_en: experience.desc_en || '',
            desc_de: experience.desc_de || '',
            isCurrent: experience.isCurrent || false,
        });
        window.scrollTo(0, 0); // للعودة إلى النموذج في الأعلى
    };


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
                <h3 className="text-2xl font-bold mb-4">{currentExperience.id ? 'تعديل الخبرة العملية' : 'إضافة خبرة جديدة'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* المسمى الوظيفي والشركة */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="المسمى الوظيفي (عربي)" value={currentExperience.title_ar} onChange={(e) => setCurrentExperience({ ...currentExperience, title_ar: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" required />
                        <input type="text" placeholder="اسم الشركة" value={currentExperience.company} onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" placeholder="المسمى الوظيفي (إنجليزي)" value={currentExperience.title_en} onChange={(e) => setCurrentExperience({ ...currentExperience, title_en: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr" />
                        <input type="text" placeholder="المسمى الوظيفي (ألماني)" value={currentExperience.title_de} onChange={(e) => setCurrentExperience({ ...currentExperience, title_de: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr" />
                    </div>

                    {/* التواريخ والحالة */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-400">تاريخ البداية</label>
                            <input type="date" value={currentExperience.startDate} onChange={(e) => setCurrentExperience({ ...currentExperience, startDate: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500 w-full" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-400">تاريخ النهاية</label>
                            <input type="date" value={currentExperience.endDate} onChange={(e) => setCurrentExperience({ ...currentExperience, endDate: e.target.value, isCurrent: false })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500 w-full" disabled={currentExperience.isCurrent} />
                        </div>
                        <div className="md:col-span-2 flex items-center justify-start h-full pt-4">
                            <input type="checkbox" id="isCurrent" checked={currentExperience.isCurrent} onChange={(e) => setCurrentExperience({ ...currentExperience, isCurrent: e.target.checked, endDate: '' })} className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500" />
                            <label htmlFor="isCurrent" className="ms-2 text-sm font-medium text-gray-300">المنصب الحالي</label>
                        </div>
                    </div>

                    {/* الوصف باللغات الثلاث */}
                    <textarea placeholder="وصف المسؤوليات (العربية)" value={currentExperience.desc_ar} onChange={(e) => setCurrentExperience({ ...currentExperience, desc_ar: e.target.value })} rows="3" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500"></textarea>
                    <textarea placeholder="الوصف (الإنجليزية)" value={currentExperience.desc_en} onChange={(e) => setCurrentExperience({ ...currentExperience, desc_en: e.target.value })} rows="3" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr"></textarea>
                    <textarea placeholder="الوصف (الألمانية)" value={currentExperience.desc_de} onChange={(e) => setCurrentExperience({ ...currentExperience, desc_de: e.target.value })} rows="3" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr"></textarea>


                    <div className="flex gap-4">
                        <button type="submit" disabled={isSaving} className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-5 rounded-lg transition-colors disabled:bg-gray-500">
                            {isSaving ? '... جاري الحفظ' : (currentExperience.id ? 'حفظ التعديلات' : 'إضافة الخبرة')}
                        </button>
                        {currentExperience.id && <button type="button" onClick={resetForm} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-5 rounded-lg transition-colors">إلغاء التعديل</button>}
                    </div>
                </form>
            </div>

            {/* قائمة الخبرات الحالية */}
            <h2 className="text-3xl font-bold mb-4">الخبرات الحالية</h2>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                {loading ? (
                    <p>جاري تحميل الخبرات...</p>
                ) : experiences.length === 0 ? (
                    <p>لا توجد خبرات مضافة حالياً.</p>
                ) : (
                    <div className="space-y-6">
                        {experiences.map(exp => (
                            <div key={exp.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-start border-l-4 border-cyan-500">
                                <div>
                                    <h4 className="text-xl font-bold text-white">{exp.title_ar} - {exp.company}</h4>
                                    <p className="text-sm text-gray-400 my-1">{exp.startDate} - {exp.isCurrent ? 'الآن' : exp.endDate}</p>
                                    <p className="text-sm text-gray-300 max-w-2xl">{exp.desc_ar}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(exp)} className="text-blue-400 hover:text-blue-300">تعديل</button>
                                    <button onClick={() => handleDelete(exp.id, exp.title_ar)} className="text-red-400 hover:text-red-300">حذف</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExperienceManager;
