// admin-panel/src/components/PreloaderManager.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const PRELOADER_DOC_ID = 'preloaderContent';

function PreloaderManager() {
    const [data, setData] = useState({
        icon_class: 'fa-solid fa-layer-group',
        text_ar: 'جاري التحميل...',
        text_en: 'Loading...',
        text_de: 'Laden...',
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, "settings", PRELOADER_DOC_ID);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching preloader data:", error);
                setMessage('فشل في تحميل البيانات.');
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
            await setDoc(doc(db, "settings", PRELOADER_DOC_ID), data);
            setMessage('تم حفظ التغييرات بنجاح!');
        } catch (error) {
            console.error("Error saving preloader data:", error);
            setMessage('فشل حفظ التغييرات.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) return <p className="text-white text-center py-8">...جاري تحميل بيانات شاشة التحميل</p>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold mb-6">إدارة شاشة التحميل (Preloader)</h3>
            {message && <div className={`p-3 mb-4 rounded text-white ${message.includes('نجاح') ? 'bg-green-600' : 'bg-red-600'}`}>{message}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="icon_class" className="block text-gray-300 mb-2">
                        أيقونة التحميل (Font Awesome Class)
                        <a href="https://fontawesome.com/search?m=free" target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs ms-2 hover:underline">[ابحث عن أيقونات]</a>
                    </label>
                    <input
                        type="text"
                        id="icon_class"
                        name="icon_class"
                        value={data.icon_class}
                        onChange={handleChange}
                        placeholder="e.g., fa-solid fa-spinner"
                        className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500"
                        dir="ltr"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 mb-2">نص التحميل</label>
                    <div className="space-y-4">
                        <input type="text" name="text_ar" value={data.text_ar} onChange={handleChange} placeholder="النص (عربي)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" />
                        <input type="text" name="text_en" value={data.text_en} onChange={handleChange} placeholder="النص (إنجليزي)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr" />
                        <input type="text" name="text_de" value={data.text_de} onChange={handleChange} placeholder="النص (ألماني)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" dir="ltr" />
                    </div>
                </div>

                <button type="submit" disabled={isSaving} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-5 rounded-lg disabled:bg-gray-500">
                    {isSaving ? '...جاري الحفظ' : 'حفظ التغييرات'}
                </button>
            </form>
        </div>
    );
}

export default PreloaderManager;
