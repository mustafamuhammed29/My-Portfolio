// src/pages/LoginPage.jsx
import { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('يرجى ملء جميع الحقول.');
            return;
        }
        setLoading(true);
        setError('');

        // تسجيل الدخول باستخدام Firebase
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // تم تسجيل الدخول بنجاح
                console.log('Logged in successfully:', userCredential.user);
            })
            .catch((error) => {
                setError("فشل تسجيل الدخول. تأكد من البريد وكلمة المرور.");
                console.error("Login error:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg border border-gray-700">
                <h1 className="text-3xl font-bold text-center mb-6 text-white">تسجيل الدخول للوحة التحكم</h1>

                {error && <p className="text-red-400 text-center mb-4">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
                            البريد الإلكتروني
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="email@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">
                            كلمة المرور
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-5 rounded-lg transition-colors disabled:bg-gray-500"
                    >
                        {loading ? '...جاري الدخول' : 'تسجيل الدخول'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;

