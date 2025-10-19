// src/App.jsx
import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Header from './components/Header';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ExplosionAnimation from './components/ExplosionAnimation';
import GeminiPlanner from './components/GeminiPlanner';
import StarfieldBackground from './components/StarfieldBackground';
import MaintenancePage from './components/MaintenancePage';

function App() {
  const { i18n } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: -500, y: -500 });
  const [settings, setSettings] = useState({
    // قيم افتراضية لضمان عدم حدوث خطأ قبل التحميل
    showAbout: true, showExperience: true, showSkills: true,
    showProjects: true, showPlanner: true, showContact: true,
    maintenanceMode: false,
    defaultLang: 'ar',
  });
  const [loadingSettings, setLoadingSettings] = useState(true);

  // جلب الإعدادات عند تحميل التطبيق
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "generalSettings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedSettings = docSnap.data();
          setSettings(prev => ({ ...prev, ...fetchedSettings }));

          // تحديد اللغة الافتراضية إذا لم يقم المستخدم باختيار لغة من قبل
          if (!localStorage.getItem('i18nextLng')) {
            const langToSet = fetchedSettings.defaultLang || 'ar';
            i18n.changeLanguage(langToSet);
            document.documentElement.lang = langToSet;
            document.documentElement.dir = langToSet === 'ar' ? 'rtl' : 'ltr';
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchSettings();
  }, [i18n]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // شاشة تحميل أولية لمنع ظهور المحتوى قبل تحميل الإعدادات
  if (loadingSettings) {
    return <div className="bg-black min-h-screen"></div>;
  }

  // عرض صفحة الصيانة إذا كانت مفعلة
  if (settings.maintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <>
      <StarfieldBackground />
      <div
        id="cursor-glow"
        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) translate(-50%, -50%)` }}
      ></div>

      {isAnimating && <ExplosionAnimation onAnimationEnd={() => setIsAnimating(false)} />}

      <div className={!isAnimating ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'}>
        <Navbar settings={settings} />
        <main>
          <Header />
          {settings.showAbout && <About />}
          {settings.showExperience && <Experience />}
          {settings.showSkills && <Skills />}
          {settings.showProjects && <Projects />}
          {settings.showPlanner && <GeminiPlanner />}
          {settings.showContact && <Contact />}
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;

