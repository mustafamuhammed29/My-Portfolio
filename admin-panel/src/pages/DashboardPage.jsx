// admin-panel/src/pages/DashboardPage.jsx
import { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signOut } from "firebase/auth";
import ProjectManager from '../components/ProjectManager';
import AboutManager from '../components/AboutManager'; // استيراد المكون الجديد

function DashboardPage() {
    const [activeTab, setActiveTab] = useState('projects'); // الحالة لتحديد علامة التبويب النشطة

    const handleLogout = () => {
        signOut(auth).catch(error => console.error("Logout failed:", error));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'projects':
                return <ProjectManager />;
            case 'about':
                return <AboutManager />;
            default:
                return <ProjectManager />;
        }
    };

    const getTabClass = (tabName) => {
        return `px-4 py-2 font-bold transition-colors border-b-2 ${activeTab === tabName
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">لوحة التحكم</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        تسجيل الخروج
                    </button>
                </div>
            </nav>
            <main className="container mx-auto p-6">
                {/* أزرار علامات التبويب */}
                <div className="flex border-b border-gray-700 mb-8">
                    <button onClick={() => setActiveTab('projects')} className={getTabClass('projects')}>
                        إدارة المشاريع
                    </button>
                    <button onClick={() => setActiveTab('about')} className={getTabClass('about')}>
                        إدارة من أنا
                    </button>
                </div>

                {/* عرض المحتوى النشط */}
                {renderContent()}
            </main>
        </div>
    );
}

export default DashboardPage;
