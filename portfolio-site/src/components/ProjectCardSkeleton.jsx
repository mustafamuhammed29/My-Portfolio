// src/components/ProjectCardSkeleton.jsx

function ProjectCardSkeleton() {
    return (
        // نستخدم animate-pulse من Tailwind CSS لإضافة حركة تحميل خافتة
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 p-6 animate-pulse">
            {/* هيكل الصورة */}
            <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>

            {/* هيكل العنوان */}
            <div className="w-3/4 h-8 bg-gray-700 rounded-lg mb-3"></div>

            {/* هيكل الوصف */}
            <div className="w-full h-4 bg-gray-700 rounded-lg mb-2"></div>
            <div className="w-full h-4 bg-gray-700 rounded-lg mb-4"></div>
            <div className="w-1/2 h-4 bg-gray-700 rounded-lg mb-4"></div>

            {/* هيكل التقنيات والأزرار */}
            <div className="flex flex-wrap gap-2 mb-4">
                <div className="w-16 h-6 bg-gray-700 rounded-full"></div>
                <div className="w-20 h-6 bg-gray-700 rounded-full"></div>
            </div>
            <div className="flex gap-3 mt-auto pt-4 border-t border-gray-700/50">
                <div className="flex-1 h-10 bg-gray-700 rounded-lg"></div>
                <div className="flex-1 h-10 bg-gray-700 rounded-lg"></div>
            </div>
        </div>
    );
}

export default ProjectCardSkeleton;
