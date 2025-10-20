// admin-panel/src/pages/DashboardPage.jsx
import { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signOut } from "firebase/auth";
import ProjectManager from '../components/ProjectManager';
import AboutManager from '../components/AboutManager';
import SkillsManager from '../components/SkillsManager';
import ExperienceManager from '../components/ExperienceManager';
import GeneralSettingsManager from '../components/GeneralSettingsManager';
import HeaderManager from '../components/HeaderManager';
import NavbarManager from '../components/NavbarManager';

function DashboardPage() {
    const [activeTab, setActiveTab] = useState('header');

    const handleLogout = () => {
        signOut(auth).catch(error => console.error("Logout failed:", error));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'header': return <HeaderManager />;
            case 'navbar': return <NavbarManager />;
            case 'projects': return <ProjectManager />;
            case 'about': return <AboutManager />;
            case 'skills': return <SkillsManager />;
            case 'experience': return <ExperienceManager />;
            case 'settings': return <GeneralSettingsManager />;
            default: return <HeaderManager />;
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
                <div className="flex border-b border-gray-700 mb-8 overflow-x-auto whitespace-nowrap">
                    <button onClick={() => setActiveTab('header')} className={getTabClass('header')}>
                        إدارة الواجهة
                    </button>
                    <button onClick={() => setActiveTab('navbar')} className={getTabClass('navbar')}>
                        إدارة شريط التنقل
                    </button>
                    <button onClick={() => setActiveTab('projects')} className={getTabClass('projects')}>
                        إدارة المشاريع
                    </button>
                    <button onClick={() => setActiveTab('about')} className={getTabClass('about')}>
                        إدارة من أنا
                    </button>
                    <button onClick={() => setActiveTab('skills')} className={getTabClass('skills')}>
                        إدارة المهارات
                    </button>
                    <button onClick={() => setActiveTab('experience')} className={getTabClass('experience')}>
                        إدارة الخبرات
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={getTabClass('settings')}>
                        الإعدادات العامة
                    </button>
                </div>
                {renderContent()}
            </main>
        </div>
    );
}

export default DashboardPage;

