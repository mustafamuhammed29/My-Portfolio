// src/App.jsx
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Header from './components/Header';
const About = lazy(() => import('./components/About'));
const Experience = lazy(() => import('./components/Experience'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const GeminiPlanner = lazy(() => import('./components/GeminiPlanner'));
const Contact = lazy(() => import('./components/Contact'));
import Footer from './components/Footer';
import ExplosionAnimation from './components/ExplosionAnimation';
import StarfieldBackground from './components/StarfieldBackground';
import MaintenancePage from './components/MaintenancePage';

function App() {
  const { i18n } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: -500, y: -500 });
  const [settings, setSettings] = useState({
    // Default values to prevent errors before loading
    showAbout: true, showExperience: true, showSkills: true,
    showProjects: true, showPlanner: true, showContact: true,
    maintenanceMode: false,
    defaultLang: 'ar',
  });
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Fetch settings on app load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const generalSettingsRef = doc(db, "settings", "generalSettings");
        const navbarContentRef = doc(db, "settings", "navbarContent");

        const [generalSnap, navbarSnap] = await Promise.all([
          getDoc(generalSettingsRef),
          getDoc(navbarContentRef)
        ]);

        const fetchedGeneral = generalSnap.exists() ? generalSnap.data() : {};
        const fetchedNavbar = navbarSnap.exists() ? navbarSnap.data() : {};

        const combinedSettings = { ...fetchedGeneral, ...fetchedNavbar };
        setSettings(prev => ({ ...prev, ...combinedSettings }));

        // Set default language if the user hasn't chosen one
        if (!localStorage.getItem('i18nextLng')) {
          const langToSet = combinedSettings.defaultLang || 'ar';
          i18n.changeLanguage(langToSet);
          document.documentElement.lang = langToSet;
          document.documentElement.dir = langToSet === 'ar' ? 'rtl' : 'ltr';
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

  // Initial loading screen to prevent content flash
  if (loadingSettings) {
    return <div className="bg-black min-h-screen"></div>;
  }

  // Display maintenance page if activated
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
        <Navbar />
        <main>
          <Header />
          <Suspense fallback={<div className="text-white text-center p-10">Loading Section...</div>}>
            {settings.showAbout && <About />}
            {settings.showExperience && <Experience />}
            {settings.showSkills && <Skills />}
            {settings.showProjects && <Projects />}
            {settings.showPlanner && <GeminiPlanner />}
            {settings.showContact && <Contact />}
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;

