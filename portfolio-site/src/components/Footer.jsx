// src/components/Footer.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

function Footer() {
  const { t, i18n } = useTranslation();
  const [footerText, setFooterText] = useState(t('footer_text'));
  const [loading, setLoading] = useState(true);

  // جلب الإعدادات العامة (التي تتضمن نص التذييل)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "generalSettings");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const lang = i18n.language;

          // تحديد اسم الحقل بناءً على اللغة الحالية (footer_ar, footer_en, footer_de)
          const localizedKey = `footer_${lang}`;

          if (data[localizedKey]) {
            setFooterText(data[localizedKey]);
          } else {
            // إذا لم يتم العثور على ترجمة، نستخدم النص الاحتياطي المترجم
            setFooterText(t('footer_text'));
          }
        } else {
          setFooterText(t('footer_text'));
        }
      } catch (error) {
        console.error("Error fetching footer settings:", error);
        setFooterText(t('footer_text')); // استخدام النص الاحتياطي عند الفشل
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [i18n.language, t]); // إعادة التشغيل عند تغيير اللغة

  return (
    <footer className="text-center py-6 border-t border-[#30363d]">
      <p className="text-gray-500 font-mono">
        {loading ? t('footer_text') : footerText}
      </p>
    </footer>
  );
}

export default Footer;
