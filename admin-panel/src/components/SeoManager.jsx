// admin-panel/src/components/SeoManager.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const SEO_DOC_ID = 'seoContent';

function SeoManager() {
    const [data, setData] = useState({
        meta_description_ar: '',
        meta_description_en: '',
        meta_description_de: '',
        meta_keywords: '',
        meta_author: '',
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "settings", SEO_DOC_ID);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching SEO data:", error);
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
            await setDoc(doc(db, "settings", SEO_DOC_ID), data);
            setMessage('تم حفظ إعدادات SEO بنجاح!');
        } catch (error) {
            console.error("Error saving SEO data:", error);
            setMessage('فشل حفظ الإعدادات.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) return <p className="text-white">...جاري تحميل إعدادات SEO</p>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold mb-6">إدارة محركات البحث (SEO)</h3>
            {message && <div className="p-3 mb-4 rounded bg-green-600 text-white">{message}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-300 mb-2 font-semibold">وصف الموقع (Meta Description)</label>
                    <div className="space-y-2">
                        <textarea name="meta_description_ar" value={data.meta_description_ar} onChange={handleChange} placeholder="الوصف (عربي)" rows="3" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500"></textarea>
                        <textarea name="meta_description_en" value={data.meta_description_en} onChange={handleChange} placeholder="الوصف (إنجليزي)" rows="3" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr"></textarea>
                        <textarea name="meta_description_de" value={data.meta_description_de} onChange={handleChange} placeholder="الوصف (ألماني)" rows="3" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr"></textarea>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-300 mb-2 font-semibold">الكلمات المفتاحية (Meta Keywords)</label>
                    <input type="text" name="meta_keywords" value={data.meta_keywords} onChange={handleChange} placeholder="برمجة, تطبيقات, مواقع, ... (افصل بينها بفاصلة)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr" />
                </div>

                <div>
                    <label className="block text-gray-300 mb-2 font-semibold">المؤلف (Meta Author)</label>
                    <input type="text" name="meta_author" value={data.meta_author} onChange={handleChange} placeholder="اسمك أو اسم شركتك" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" />
                </div>

                <button type="submit" disabled={isSaving} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-5 rounded-lg disabled:bg-gray-500">
                    {isSaving ? '...جاري الحفظ' : 'حفظ إعدادات SEO'}
                </button>
            </form>
        </div>
    );
}

export default SeoManager;

