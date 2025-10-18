// src/App.jsx
import { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // هذا المستمع يعمل عندما تتغير حالة تسجيل الدخول (دخول أو خروج)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // هذه الدالة تعمل عند إغلاق المكون لتنظيف المستمع
    return () => unsubscribe();
  }, []);

  // عرض رسالة تحميل أثناء التحقق من حالة الدخول لأول مرة
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        جاري تحميل لوحة التحكم...
      </div>
    );
  }

  // إذا كان هناك مستخدم، اعرض لوحة التحكم، وإلا اعرض صفحة الدخول
  return user ? <DashboardPage /> : <LoginPage />;
}

export default App;

