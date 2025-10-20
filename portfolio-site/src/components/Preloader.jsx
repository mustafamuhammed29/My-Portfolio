// portfolio-site/src/components/Preloader.jsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore';

function Preloader() {
    const { t, i18n } = useTranslation();
    const [content, setContent] = useState({
        icon_class: 'fa-solid fa-layer-group',
        text: t('loading_text'),
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const docRef = doc(db, "settings", "preloaderContent");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const lang = i18n.language;
                    setContent({
                        icon_class: data.icon_class || 'fa-solid fa-layer-group',
                        text: data[`text_${lang}`] || data.text_en || t('loading_text'),
                    });
                }
            } catch (error) {
                console.error("Error fetching preloader content:", error);
            }
        };
        fetchContent();
    }, [i18n.language, t]);

    return (
        <div className="fixed inset-0 bg-[#0d1117] z-[101] flex flex-col items-center justify-center">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
            >
                <i className={`${content.icon_class} text-5xl text-cyan-400`}></i>
            </motion.div>
            <motion.p
                className="text-gray-400 mt-6 text-lg font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                {content.text}
            </motion.p>
        </div>
    );
}

export default Preloader;


