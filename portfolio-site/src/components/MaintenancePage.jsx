// src/components/MaintenancePage.jsx
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';

function MaintenancePage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center p-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
                <Settings className="w-24 h-24 text-cyan-400 mb-8" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">الموقع تحت الصيانة</h1>
            <p className="text-lg text-gray-400 max-w-md">
                نحن نقوم ببعض التحديثات والتحسينات حالياً. سنعود قريباً، شكراً لصبركم!
            </p>
        </div>
    );
}

export default MaintenancePage;
