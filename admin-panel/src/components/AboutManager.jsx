// admin-panel/src/components/AboutManager.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// اسم المستند في Firestore لتخزين بيانات About
const ABOUT_DOC_ID = 'portfolioAbout';

function AboutManager() {
    const [data, setData] = useState({
        desc_ar: '', desc_en: '', desc_de: '',
        projects: '', clients: '', experience: '', commitment: ''
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    // 1. تحميل البيانات الحالية عند بدء التشغيل
    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "settings", ABOUT_DOC_ID);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setData(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching About data:", error);
                setMessage('فشل في تحميل البيانات.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. معالجة حفظ البيانات
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');

        try {
            // حفظ البيانات في مجموعة "settings" ومستند "portfolioAbout"
            await setDoc(doc(db, "settings", ABOUT_DOC_ID), data);
            setMessage('تم حفظ البيانات بنجاح!');
        } catch (error) {
            console.error("Error saving About data:", error);
            setMessage('فشل في الحفظ. يرجى مراجعة الصلاحيات.');
        } finally {
            setIsSaving(false);
        }

        setTimeout(() => setMessage(''), 3000);
    };

    if (loading) {
        return <div className="text-white text-center py-8">... جاري تحميل بيانات قسم "من أنا"</div>;
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold mb-4">إدارة قسم: من أنا</h3>

            {message && (
                <div className={`p-3 mb-4 rounded ${message.includes('نجاح') ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="text-xl font-bold pt-4 border-t border-gray-700">1. الفقرة التعريفية (الوصف)</h4>

                {/* الوصف باللغات الثلاث */}
                <textarea placeholder="الوصف (العربية)" value={data.desc_ar} onChange={(e) => setData({ ...data, desc_ar: e.target.value })} rows="4" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500"></textarea>
                <textarea placeholder="الوصف (الإنجليزية)" value={data.desc_en} onChange={(e) => setData({ ...data, desc_en: e.target.value })} rows="4" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr"></textarea>
                <textarea placeholder="الوصف (الألمانية)" value={data.desc_de} onChange={(e) => setData({ ...data, desc_de: e.target.value })} rows="4" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr"></textarea>

                <h4 className="text-xl font-bold pt-4 border-t border-gray-700">2. الأرقام الإحصائية</h4>

                {/* أرقام الإحصائيات (Projects, Clients, etc.) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <input type="text" placeholder="المشاريع (+50)" value={data.projects} onChange={(e) => setData({ ...data, projects: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" />
                    <input type="text" placeholder="العملاء (+30)" value={data.clients} onChange={(e) => setData({ ...data, clients: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" />
                    <input type="text" placeholder="الخبرة (+3)" value={data.experience} onChange={(e) => setData({ ...data, experience: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" />
                    <input type="text" placeholder="الالتزام (100%)" value={data.commitment} onChange={(e) => setData({ ...data, commitment: e.target.value })} className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" />
                </div>

                <button type="submit" disabled={isSaving} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-5 rounded-lg transition-colors disabled:bg-gray-500">
                    {isSaving ? '... جاري الحفظ' : 'حفظ التغييرات'}
                </button>
            </form>
        </div>
    );
}

export default AboutManager;
