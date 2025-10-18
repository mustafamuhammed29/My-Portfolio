// src/components/ContentManager.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CONTENT_DOC_ID = 'portfolioContent';

function ContentManager() {
    const [data, setData] = useState({
        hero_title: '',
        hero_subtitle: '',
        hero_description: '',
        contact_email: '',
        contact_phone: '',
        contact_location: '',
        github_url: '',
        linkedin_url: '',
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    // تحميل البيانات عند بدء التشغيل
    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "settings", CONTENT_DOC_ID);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setData(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching content data:", error);
                setMessage('فشل في تحميل البيانات.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // معالجة حفظ البيانات
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');

        try {
            await setDoc(doc(db, "settings", CONTENT_DOC_ID), data);
            setMessage('تم حفظ البيانات بنجاح!');
        } catch (error) {
            console.error("Error saving content data:", error);
            setMessage('فشل في الحفظ. يرجى مراجعة الصلاحيات.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) {
        return <div className="text-white text-center py-8">... جاري تحميل بيانات المحتوى</div>;
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold mb-4">إدارة محتوى الموقع</h3>

            {message && (
                <div className={`p-3 mb-4 rounded ${message.includes('نجاح') ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* قسم البطل (Hero Section) */}
                <div className="border-b border-gray-700 pb-6">
                    <h4 className="text-xl font-bold mb-4 text-cyan-400">📌 قسم البطل (Hero Section)</h4>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="عنوان البطل الرئيسي"
                            value={data.hero_title}
                            onChange={(e) => setData({ ...data, hero_title: e.target.value })}
                            className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500"
                        />
                        <input
                            type="text"
                            placeholder="العنوان الفرعي"
                            value={data.hero_subtitle}
                            onChange={(e) => setData({ ...data, hero_subtitle: e.target.value })}
                            className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500"
                        />
                        <textarea
                            placeholder="وصف قسم البطل"
                            value={data.hero_description}
                            onChange={(e) => setData({ ...data, hero_description: e.target.value })}
                            rows="3"
                            className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500"
                        />
                    </div>
                </div>

                {/* قسم الاتصال */}
                <div className="border-b border-gray-700 pb-6">
                    <h4 className="text-xl font-bold mb-4 text-cyan-400">📞 معلومات الاتصال</h4>
                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="البريد الإلكتروني"
                            value={data.contact_email}
                            onChange={(e) => setData({ ...data, contact_email: e.target.value })}
                            className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500"
                        />
                        <input
                            type="tel"
                            placeholder="رقم الهاتف"
                            value={data.contact_phone}
                            onChange={(e) => setData({ ...data, contact_phone: e.target.value })}
                            className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500"
                        />
                        <input
                            type="text"
                            placeholder="الموقع الجغرافي"
                            value={data.contact_location}
                            onChange={(e) => setData({ ...data, contact_location: e.target.value })}
                            className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500"
                        />
                    </div>
                </div>

                {/* قسم وسائل التواصل الاجتماعي */}
                <div className="pb-6">
                    <h4 className="text-xl font-bold mb-4 text-cyan-400">🔗 وسائل التواصل الاجتماعي</h4>
                    <div className="space-y-4">
                        <input
                            type="url"
                            placeholder="رابط GitHub"
                            value={data.github_url}
                            onChange={(e) => setData({ ...data, github_url: e.target.value })}
                            className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500"
                            dir="ltr"
                        />
                        <input
                            type="url"
                            placeholder="رابط LinkedIn"
                            value={data.linkedin_url}
                            onChange={(e) => setData({ ...data, linkedin_url: e.target.value })}
                            className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500"
                            dir="ltr"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-5 rounded-lg transition-colors disabled:bg-gray-500"
                >
                    {isSaving ? '... جاري الحفظ' : 'حفظ التغييرات'}
                </button>
            </form>
        </div>
    );
}

export default ContentManager;

