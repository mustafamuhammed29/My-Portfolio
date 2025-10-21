// admin-panel/src/components/ThemeManager.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const THEME_DOC_ID = 'themeSettings';

function ThemeManager() {
    const [settings, setSettings] = useState({
        primaryColor: '#00f0ff', // سيان افتراضي
        defaultTheme: 'dark',
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "settings", THEME_DOC_ID);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching theme settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');
        try {
            await setDoc(doc(db, "settings", THEME_DOC_ID), settings, { merge: true });
            setMessage('تم حفظ إعدادات المظهر بنجاح!');
        } catch (error) {
            console.error("Error saving theme settings:", error);
            setMessage('فشل حفظ الإعدادات.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) return <p className="text-white">...جاري تحميل إعدادات المظهر</p>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold mb-6">إدارة المظهر</h3>
            {message && (
                <div className={`p-3 mb-4 rounded text-white ${message.includes('نجاح') ? 'bg-green-600' : 'bg-red-600'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* قسم الألوان */}
                <div>
                    <h4 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">الألوان</h4>
                    <div className="flex items-center gap-4">
                        <label htmlFor="primaryColor" className="text-sm font-medium text-gray-300">اللون الرئيسي:</label>
                        <input
                            type="color"
                            id="primaryColor"
                            name="primaryColor"
                            value={settings.primaryColor}
                            onChange={handleChange}
                            className="p-1 h-10 w-14 block bg-gray-700 border border-gray-600 cursor-pointer rounded-lg"
                        />
                        <span className="font-mono text-cyan-400">{settings.primaryColor}</span>
                    </div>
                </div>

                {/* قسم الوضع الافتراضي */}
                <div>
                    <h4 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">الوضع الافتراضي</h4>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="defaultTheme"
                                value="dark"
                                checked={settings.defaultTheme === 'dark'}
                                onChange={handleChange}
                                className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500"
                            />
                            <span className="text-sm font-medium text-gray-300">الوضع المظلم (Dark)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="defaultTheme"
                                value="light"
                                checked={settings.defaultTheme === 'light'}
                                onChange={handleChange}
                                className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500"
                            />
                            <span className="text-sm font-medium text-gray-300">الوضع الفاتح (Light)</span>
                        </label>
                    </div>
                </div>

                <button type="submit" disabled={isSaving} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-5 rounded-lg transition-colors disabled:bg-gray-500">
                    {isSaving ? '...جاري الحفظ' : 'حفظ إعدادات المظهر'}
                </button>
            </form>
        </div>
    );
}

export default ThemeManager;

