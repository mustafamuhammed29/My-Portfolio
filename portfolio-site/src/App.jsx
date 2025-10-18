// src/App.jsx
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ExplosionAnimation from './components/ExplosionAnimation';
import GeminiPlanner from './components/GeminiPlanner';
import StarfieldBackground from './components/StarfieldBackground';
import Experience from './components/Experience'; // 1. استيراد المكون الجديد

function App() {
  const [isAnimating, setIsAnimating] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: -500, y: -500 });

  // تأثير لتتبع حركة الفأرة
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
          <About />
          <Experience /> {/* 2. إضافة المكون في مكانه الصحيح */}
          <Skills />
          <Projects />
          <GeminiPlanner />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
