// admin-panel/src/components/GeneralSettingsManager.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const SETTINGS_DOC_ID = 'generalSettings';

function GeneralSettingsManager() {
    const [settings, setSettings] = useState({
        // القيم الافتراضية لجميع الحقول
        maintenanceMode: false,
        defaultLang: 'ar',
        email: '', phone: '', location_ar: '', location_en: '', location_de: '',
        github: '', linkedin: '', twitter: '', formspreeUrl: '',
        footer_ar: '', footer_en: '', footer_de: '',
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "settings", SETTINGS_DOC_ID);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSettings(prev => ({ ...prev, [name]: checked }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');
        try {
            await setDoc(doc(db, "settings", SETTINGS_DOC_ID), settings, { merge: true });
            setMessage('تم حفظ الإعدادات بنجاح!');
        } catch (error) {
            console.error("Error saving settings:", error);
            setMessage('فشل حفظ الإعدادات.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) return <p className="text-white">...جاري تحميل الإعدادات</p>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold mb-6">الإعدادات العامة</h3>
            {message && (
                <div className={`p-3 mb-4 rounded text-white ${message.includes('نجاح') ? 'bg-green-600' : 'bg-red-600'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* قسم إعدادات الموقع */}
                <div>
                    <h4 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">إعدادات الموقع</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* اللغة الافتراضية */}
                        <div>
                            <label htmlFor="defaultLang" className="block text-sm font-medium text-gray-300 mb-2">اللغة الافتراضية</label>
                            <select id="defaultLang" name="defaultLang" value={settings.defaultLang} onChange={handleChange} className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white">
                                <option value="ar">العربية</option>
                                <option value="en">الإنجليزية</option>
                                <option value="de">الألمانية</option>
                            </select>
                        </div>
                        {/* وضع الصيانة */}
                        <div className="flex items-center justify-start pt-8">
                            <label htmlFor="maintenanceModeToggle" className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="maintenanceModeToggle" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleCheckboxChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-300">تفعيل وضع الصيانة</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* معلومات التواصل */}
                <div>
                    <h4 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">معلومات التواصل</h4>
                    <div className="space-y-4">
                        <input type="email" name="email" value={settings.email} onChange={handleChange} placeholder="البريد الإلكتروني" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white" />
                        <input type="tel" name="phone" value={settings.phone} onChange={handleChange} placeholder="رقم الهاتف" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" name="location_ar" value={settings.location_ar} onChange={handleChange} placeholder="الموقع (عربي)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white" />
                            <input type="text" name="location_en" value={settings.location_en} onChange={handleChange} placeholder="الموقع (إنجليزي)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white" dir="ltr" />
                            <input type="text" name="location_de" value={settings.location_de} onChange={handleChange} placeholder="الموقع (ألماني)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white" dir="ltr" />
                        </div>
                    </div>
                </div>

                {/* الروابط الاجتماعية ونموذج التواصل */}
                <div>
                    <h4 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">الروابط الاجتماعية ونموذج التواصل</h4>
                    <div className="space-y-4">
                        <input type="url" name="github" value={settings.github} onChange={handleChange} placeholder="رابط GitHub" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white" />
                        <input type="url" name="linkedin" value={settings.linkedin} onChange={handleChange} placeholder="رابط LinkedIn" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white" />
                        <input type="url" name="twitter" value={settings.twitter} onChange={handleChange} placeholder="رابط Twitter" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white" />
                        <input type="url" name="formspreeUrl" value={settings.formspreeUrl} onChange={handleChange} placeholder="رابط Formspree" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white" />
                    </div>
                </div>

                {/* نص التذييل */}
                <div>
                    <h4 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">نص التذييل (Footer)</h4>
                    <div className="space-y-4">
                        <input type="text" name="footer_ar" value={settings.footer_ar} onChange={handleChange} placeholder="نص التذييل (عربي)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white" />
                        <input type="text" name="footer_en" value={settings.footer_en} onChange={handleChange} placeholder="نص التذييل (إنجليزي)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white" dir="ltr" />
                        <input type="text" name="footer_de" value={settings.footer_de} onChange={handleChange} placeholder="نص التذييل (ألماني)" className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white" dir="ltr" />
                    </div>
                </div>

                <button type="submit" disabled={isSaving} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-5 rounded-lg transition-colors disabled:bg-gray-500">
                    {isSaving ? '...جاري الحفظ' : 'حفظ كل الإعدادات'}
                </button>
            </form>
        </div>
    );
}

export default GeneralSettingsManager;

