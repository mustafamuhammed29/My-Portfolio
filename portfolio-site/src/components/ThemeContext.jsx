// portfolio-site/src/context/ThemeContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore';

const ThemeContext = createContext();

// دالة لتحويل hex إلى HSL
const hexToHsl = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '194 98% 49%'; // قيمة سيان افتراضية
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};


export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');
    const [isThemeLoading, setIsThemeLoading] = useState(true);

    useEffect(() => {
        const applyTheme = async () => {
            // 1. جلب الإعدادات من Firestore
            const docRef = doc(db, "settings", "themeSettings");
            const docSnap = await getDoc(docRef);
            let defaultTheme = 'dark';
            let primaryColor = '#00f0ff'; // سيان افتراضي

            if (docSnap.exists()) {
                const data = docSnap.data();
                defaultTheme = data.defaultTheme || 'dark';
                primaryColor = data.primaryColor || '#00f0ff';
            }

            // 2. تطبيق اللون الرئيسي
            document.documentElement.style.setProperty('--primary-color-hsl', hexToHsl(primaryColor));

            // 3. تحديد المظهر
            const storedTheme = localStorage.getItem('theme');
            const initialTheme = storedTheme || defaultTheme;
            setTheme(initialTheme);

            setIsThemeLoading(false);
        };
        applyTheme();
    }, []);

    useEffect(() => {
        if (!isThemeLoading) {
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(theme);
            localStorage.setItem('theme', theme);
        }
    }, [theme, isThemeLoading]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isThemeLoading }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

