import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Github, Linkedin, Twitter, Send, User, AtSign, MessageSquare, Sparkles } from 'lucide-react';

function Contact() {
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState({ submitting: false, success: false, error: false });
    const [focusedField, setFocusedField] = useState(null);
    const isRtl = i18n.language === 'ar';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus({ submitting: true, success: false, error: false });

        const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mgvnqwep'; // ← ضع رابطك هنا

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setFormStatus({ submitting: false, success: true, error: false });
                setFormData({ name: '', email: '', message: '' });
            } else {
                setFormStatus({ submitting: false, success: false, error: true });
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setFormStatus({ submitting: false, success: false, error: true });
        }
    };

    return (
        <section id="contact" className="min-h-screen py-20 bg-black relative overflow-hidden">
            {/* خلفية متحركة */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full filter blur-3xl"
                    animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-96 h-96 bg-green-400/10 rounded-full filter blur-3xl"
                    animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1.2, 1, 1.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* العنوان */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="inline-block mb-4"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Sparkles className="w-12 h-12 text-cyan-400 mx-auto" />
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {t('contact_title')}
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto mb-4"></div>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {t('contact_desc')}
                    </p>
                </motion.div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* معلومات التواصل */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="h-full flex flex-col gap-6">
                            {/* معلومات الاتصال */}
                            <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-cyan-400/50 transition-all duration-300">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <MessageSquare className="w-6 h-6 text-cyan-400" />
                                    {t('contact_info_title')}
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <Mail className="text-cyan-400 w-6 h-6" />
                                        <span dir="ltr">{t('contact_email')}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <Phone className="text-green-400 w-6 h-6" />
                                        <span dir="ltr">{t('contact_phone')}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <MapPin className="text-purple-400 w-6 h-6" />
                                        <span>{t('contact_location')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* روابط التواصل */}
                            <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-green-400/50 transition-all duration-300">
                                <h4 className="text-lg font-semibold text-white mb-4">{t('contact_follow')}</h4>
                                <div className="flex gap-3">
                                    <a href="#" className="p-4 bg-gray-800 rounded-xl text-gray-400 hover:bg-gray-700 hover:text-white transition-all">
                                        <Github className="w-6 h-6" />
                                    </a>
                                    <a href="#" className="p-4 bg-gray-800 rounded-xl text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                                        <Linkedin className="w-6 h-6" />
                                    </a>
                                    <a href="#" className="p-4 bg-gray-800 rounded-xl text-gray-400 hover:bg-cyan-500 hover:text-white transition-all">
                                        <Twitter className="w-6 h-6" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* نموذج التواصل */}
                    <motion.div
                        className="lg:col-span-3"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-cyan-400/50 transition-all duration-300">
                            {formStatus.success ? (
                                <motion.div
                                    className="text-center py-16"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <motion.div
                                        className="w-24 h-24 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6"
                                        animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
                                        transition={{ duration: 2, ease: "easeInOut" }}
                                    >
                                        <Send className="w-12 h-12 text-black" />
                                    </motion.div>
                                    <h4 className="text-3xl font-bold text-white mb-3">{t('form_success_msg')}</h4>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* الاسم */}
                                    <div className="relative">
                                        <label className="block text-gray-300 mb-2 font-semibold flex items-center gap-2">
                                            <User className="w-4 h-4 text-cyan-400" />
                                            {t('form_name_placeholder')}
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                            className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all duration-300 placeholder-gray-500"
                                            placeholder={t('form_name_placeholder')}
                                        />
                                        {focusedField === 'name' && (
                                            <motion.div
                                                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}
                                    </div>

                                    {/* البريد */}
                                    <div className="relative">
                                        <label className="block text-gray-300 mb-2 font-semibold flex items-center gap-2">
                                            <AtSign className="w-4 h-4 text-green-400" />
                                            {t('form_email_placeholder')}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                            className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-400 transition-all duration-300 placeholder-gray-500"
                                            placeholder={t('form_email_placeholder')}
                                        />
                                    </div>

                                    {/* الرسالة */}
                                    <div className="relative">
                                        <label className="block text-gray-300 mb-2 font-semibold flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-purple-400" />
                                            {t('form_message_placeholder')}
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="6"
                                            onFocus={() => setFocusedField('message')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                            className="w-full px-4 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-400 transition-all duration-300 placeholder-gray-500 resize-none"
                                            placeholder={t('form_message_placeholder')}
                                        ></textarea>
                                    </div>

                                    {/* حالة الخطأ */}
                                    {formStatus.error && (
                                        <p className="text-red-400 text-center">{t('form_error_msg')}</p>
                                    )}

                                    {/* زر الإرسال */}
                                    <motion.button
                                        type="submit"
                                        disabled={formStatus.submitting}
                                        className="w-full px-8 py-4 bg-gradient-to-r from-cyan-400 to-green-400 text-black font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/50 flex items-center justify-center gap-2 disabled:opacity-50"
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {formStatus.submitting ? t('form_submitting_msg') : t('form_send_btn')}
                                        <Send className="w-5 h-5" />
                                    </motion.button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default Contact;
