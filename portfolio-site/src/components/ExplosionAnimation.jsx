// src/components/ExplosionAnimation.jsx
import { useEffect } from 'react';

// قائمة بمقتطفات الكود التي ستظهر في الحركة
const codeSnippets = [
    '<div>', '() =>', 'import React', 'SELECT *', 'git push', 'console.log()', '</div>', 'public class',
    'useEffect', 'const data =', 'await fetch()', '#include', 'sudo rm -rf', 'npm install',
    'FROM node:18', 'docker-compose up', 'WHERE id = ?', '<span>', 'if (true)', 'while (i < n)'
];
const fragmentCount = 500; // عدد الأجزاء المتناثرة

function ExplosionAnimation({ onAnimationEnd }) {

    // هذا التأثير يعمل مرة واحدة عند تحميل المكون
    useEffect(() => {
        // بعد 2.5 ثانية (مدة الحركة)، نخبر التطبيق الرئيسي أن الحركة انتهت
        const timer = setTimeout(() => {
            onAnimationEnd();
        }, 2500);

        // تنظيف المؤقت عند إزالة المكون
        return () => clearTimeout(timer);
    }, [onAnimationEnd]);

    return (
        <div className="fixed top-0 left-0 w-screen h-screen z-[100] bg-[#0d1117] pointer-events-none overflow-hidden">
            {/* إنشاء 100 جزء من الكود بشكل ديناميكي */}
            {Array.from({ length: fragmentCount }).map((_, i) => {
                // حساب زاوية ومسافة عشوائية لكل جزء
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * window.innerWidth * 1.2;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const rotation = Math.random() * 720 - 360;

                return (
                    <span
                        key={i}
                        className="code-fragment font-mono absolute top-1/2 left-1/2 text-cyan-400 bg-gray-800/50 p-1 rounded-md text-xs opacity-0 whitespace-nowrap"
                        style={{
                            // متغيرات CSS مخصصة لتمريرها إلى الحركة
                            '--translate-end': `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                            '--rotate-end': `${rotation}deg`,
                            animation: `explode 2.5s cubic-bezier(0.17, 0.82, 0.3, 1) ${Math.random() * 0.2}s forwards`,
                        }}
                    >
                        {codeSnippets[Math.floor(Math.random() * codeSnippets.length)]}
                    </span>
                );
            })}
        </div>
    );
}

export default ExplosionAnimation;

