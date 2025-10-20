// admin-panel/src/components/NavbarManager.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const NAVBAR_DOC_ID = 'navbarContent';

function NavbarManager() {
    const [navSettings, setNavSettings] = useState({
        // إعدادات الشعار
        logoIconClass: 'fa-solid fa-layer-group',
        logoText_ar: 'معرض أعمالي',
        logoText_en: 'My Portfolio',
        logoText_de: 'Mein Portfolio',

        // إعدادات روابط التنقل
        showHome: true,
        label_home_ar: 'الرئيسية', label_home_en: 'Home', label_home_de: 'Startseite',
        showAbout: true,
        label_about_ar: 'من أنا', label_about_en: 'About Me', label_about_de: 'Über mich',
        showExperience: true,
        label_experience_ar: 'الخبرات', label_experience_en: 'Experience', label_experience_de: 'Erfahrung',
        showSkills: true,
        label_skills_ar: 'المهارات', label_skills_en: 'Skills', label_skills_de: 'Fähigkeiten',
        showProjects: true,
        label_projects_ar: 'المشاريع', label_projects_en: 'Projects', label_projects_de: 'Projekte',
        showPlanner: true,
        label_planner_ar: 'مولد الأفكار', label_planner_en: 'Idea Generator', label_planner_de: 'Ideengenerator',
        showContact: true,
        label_contact_ar: 'تواصل معي', label_contact_en: 'Contact', label_contact_de: 'Kontakt',
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "settings", NAVBAR_DOC_ID);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setNavSettings(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching navbar settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNavSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');
        try {
            await setDoc(doc(db, "settings", NAVBAR_DOC_ID), navSettings, { merge: true });
            setMessage('تم حفظ إعدادات شريط التنقل بنجاح!');
        } catch (error) {
            console.error("Error saving navbar settings:", error);
            setMessage('فشل حفظ الإعدادات.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) return <p className="text-white">...جاري تحميل إعدادات شريط التنقل</p>;

    const navItems = ['home', 'about', 'experience', 'skills', 'projects', 'planner', 'contact'];
    const itemTranslations = {
        home: 'الرئيسية',
        about: 'من أنا',
        experience: 'الخبرات',
        skills: 'المهارات',
        projects: 'المشاريع',
        planner: 'مولد الأفكار',
        contact: 'تواصل معي'
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold mb-6">إدارة شريط التنقل (Navbar)</h3>
            {message && (
                <div className={`p-3 mb-4 rounded text-white ${message.includes('نجاح') ? 'bg-green-600' : 'bg-red-600'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* قسم إعدادات الشعار */}
                <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
                    <h4 className="text-xl font-bold text-cyan-400">إعدادات الشعار (Logo)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">أيقونة الشعار (Font Awesome Class)</label>
                            <input type="text" name="logoIconClass" value={navSettings.logoIconClass} onChange={handleChange} placeholder="fa-solid fa-code" className="w-full p-2.5 rounded-lg bg-gray-700 border-gray-600 text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">نص الشعار</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" name="logoText_ar" value={navSettings.logoText_ar} onChange={handleChange} placeholder="النص (عربي)" className="w-full p-2.5 rounded-lg bg-gray-700 border-gray-600 text-white" />
                            <input type="text" name="logoText_en" value={navSettings.logoText_en} onChange={handleChange} placeholder="النص (إنجليزي)" className="w-full p-2.5 rounded-lg bg-gray-700 border-gray-600 text-white" />
                            <input type="text" name="logoText_de" value={navSettings.logoText_de} onChange={handleChange} placeholder="النص (ألماني)" className="w-full p-2.5 rounded-lg bg-gray-700 border-gray-600 text-white" />
                        </div>
                    </div>
                </div>

                {/* قسم روابط التنقل */}
                {navItems.map(item => (
                    <div key={item} className="space-y-4 p-4 border border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xl font-bold text-cyan-400 capitalize">{itemTranslations[item]}</h4>
                            <label htmlFor={`show${item}`} className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id={`show${item}`}
                                    name={`show${item.charAt(0).toUpperCase() + item.slice(1)}`}
                                    checked={navSettings[`show${item.charAt(0).toUpperCase() + item.slice(1)}`]}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-300">إظهار في القائمة</span>
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" name={`label_${item}_ar`} value={navSettings[`label_${item}_ar`]} onChange={handleChange} placeholder="النص (عربي)" className="w-full p-2.5 rounded-lg bg-gray-700 border-gray-600 text-white" />
                            <input type="text" name={`label_${item}_en`} value={navSettings[`label_${item}_en`]} onChange={handleChange} placeholder="النص (إنجليزي)" className="w-full p-2.5 rounded-lg bg-gray-700 border-gray-600 text-white" />
                            <input type="text" name={`label_${item}_de`} value={navSettings[`label_${item}_de`]} onChange={handleChange} placeholder="النص (ألماني)" className="w-full p-2.5 rounded-lg bg-gray-700 border-gray-600 text-white" />
                        </div>
                    </div>
                ))}
                <button type="submit" disabled={isSaving} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-5 rounded-lg transition-colors disabled:bg-gray-500">
                    {isSaving ? '...جاري الحفظ' : 'حفظ كل التغييرات'}
                </button>
            </form>
        </div>
    );
}

export default NavbarManager;


