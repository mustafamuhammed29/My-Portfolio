// src/components/GeminiPlanner.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function GeminiPlanner() {
    const { t } = useTranslation();
    const [idea, setIdea] = useState('');
    const [plan, setPlan] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGeneratePlan = async () => {
        if (!idea) {
            setError(t('generator_error_empty'));
            return;
        }
        setLoading(true);
        setError('');
        setPlan('');

        // --- منطقة استدعاء Gemini API الحقيقية ---
        // اترك مفتاح API فارغاً، سيتم توفيره تلقائياً
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const systemPrompt = `
    أنت مساعد ذكاء اصطناعي متخصص في تخطيط المشاريع البرمجية.
    سيقوم المستخدم بتزويدك بفكرة مشروع. مهمتك هي إنشاء خطة مشروع أولية موجزة ومنظمة وقابلة للتنفيذ بناءً على تلك الفكرة.
    يجب أن تكون الخطة منسقة بلغة بسيطة (Markdown) ويجب أن تتضمن الأقسام التالية:
    1. **الميزات الأساسية (MVP):** قائمة نقطية بأهم الميزات الأساسية للنسخة الأولى.
    2. **التقنيات المقترحة:** توصيات للواجهة الأمامية، الواجهة الخلفية، وقاعدة البيانات، مع تبرير موجز لكل اختيار.
    3. **خارطة الطريق المقترحة:** قائمة مرقمة بالخطوات الرئيسية لبناء المشروع.
    `;

        const payload = {
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: [{
                parts: [{ text: idea }]
            }],
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`API error! status: ${response.status}`);
            }

            const result = await response.json();
            const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (generatedText) {
                setPlan(generatedText);
            } else {
                throw new Error("No content generated.");
            }

        } catch (err) {
            console.error("Gemini API call failed:", err);
            setError("حدث خطأ أثناء التواصل مع الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }
        // --- نهاية منطقة API ---
    };

    return (
        <section id="idea-generator" className="py-24 bg-[#161b22]">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold mb-4 text-white">✨ {t('generator_title', 'مولد خطط المشاريع')}</h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
                    هل لديك فكرة مشروع؟ صفها ببساطة أدناه، وسيقوم الذكاء الاصطناعي بوضع خطة عمل أولية لك!
                </p>
                <div className="max-w-3xl mx-auto bg-[#0d1117] p-8 rounded-lg border border-gray-700">
                    <textarea
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        rows="4"
                        className="w-full bg-[#161b22] p-4 rounded-lg border border-[#30363d] text-white focus:outline-none focus:ring-2 focus:ring-[#00f0ff] mb-6"
                        placeholder="مثال: تطبيق لتنظيم رحلات التخييم ومشاركة المواقع..."
                    ></textarea>
                    <button
                        onClick={handleGeneratePlan}
                        disabled={loading}
                        className="w-full bg-[#00f0ff] hover:bg-opacity-90 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {loading ? '...جاري التحليل بالذكاء الاصطناعي' : t('generator_btn', 'أنشئ الخطة الآن')}
                    </button>
                    {error && <p className="text-red-400 mt-4">{error}</p>}
                </div>

                {plan && (
                    <div className="max-w-3xl mx-auto mt-8 bg-[#0d1117] p-8 rounded-lg border border-cyan-400/50 text-right" dir="rtl">
                        <pre className="whitespace-pre-wrap font-sans text-gray-300">{plan}</pre>
                    </div>
                )}
            </div>
        </section>
    );
}

export default GeminiPlanner;

