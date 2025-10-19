// admin-panel/src/components/HeaderManager.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const HEADER_DOC_ID = 'headerContent';

function HeaderManager() {
    const [data, setData] = useState({
        hero_title_ar: '', hero_title_en: '', hero_title_de: '',
        hero_subtitle_ar: '', hero_subtitle_en: '', hero_subtitle_de: '',
        badges: '', // سيتم تخزينها كنص مفصول بفاصلة
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "settings", HEADER_DOC_ID);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching Header data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');
        try {
            await setDoc(doc(db, "settings", HEADER_DOC_ID), data);
            setMessage('تم حفظ التغييرات بنجاح!');
        } catch (error) {
            console.error("Error saving Header data:", error);
            setMessage('فشل حفظ التغييرات.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) return <p className="text-white">...جاري تحميل بيانات الواجهة</p>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold mb-6">إدارة الواجهة الرئيسية (Header)</h3>
            {message && <div className="p-3 mb-4 rounded bg-green-600 text-white">{message}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-300 mb-2">العنوان الرئيسي</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" name="hero_title_ar" value={data.hero_title_ar} onChange={handleChange} placeholder="العنوان (عربي)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" />
                        <input type="text" name="hero_title_en" value={data.hero_title_en} onChange={handleChange} placeholder="العنوان (إنجليزي)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr" />
                        <input type="text" name="hero_title_de" value={data.hero_title_de} onChange={handleChange} placeholder="العنوان (ألماني)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr" />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">الوصف الفرعي</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" name="hero_subtitle_ar" value={data.hero_subtitle_ar} onChange={handleChange} placeholder="الوصف (عربي)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" />
                        <input type="text" name="hero_subtitle_en" value={data.hero_subtitle_en} onChange={handleChange} placeholder="الوصف (إنجليزي)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr" />
                        <input type="text" name="hero_subtitle_de" value={data.hero_subtitle_de} onChange={handleChange} placeholder="الوصف (ألماني)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr" />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">الشارات (Badges) - افصل بينها بفاصلة</label>
                    <input type="text" name="badges" value={data.badges} onChange={handleChange} placeholder="UI/UX Design, Mobile Apps, Web Development" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr" />
                </div>
                <button type="submit" disabled={isSaving} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-5 rounded-lg disabled:bg-gray-500">
                    {isSaving ? '...جاري الحفظ' : 'حفظ التغييرات'}
                </button>
            </form>
        </div>
    );
}

export default HeaderManager;

