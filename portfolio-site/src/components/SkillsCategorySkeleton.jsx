// src/components/SkillsCategorySkeleton.jsx

function SkillsCategorySkeleton() {
    return (
        <div className="gradient-border-card p-8 rounded-3xl animate-pulse">
            {/* هيكل عنوان الفئة */}
            <div className="h-8 w-1/2 bg-gray-700 rounded-lg mb-8"></div>

            {/* هيكل بطاقات المهارات */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center h-28">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg mb-3"></div>
                        <div className="w-20 h-4 bg-gray-700 rounded-lg"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SkillsCategorySkeleton;

