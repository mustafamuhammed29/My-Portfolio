// src/components/ExperienceItemSkeleton.jsx

function ExperienceItemSkeleton() {
    return (
        <div className="relative pl-8 animate-pulse">
            {/* الدائرة الزمنية الوهمية */}
            <div className="absolute top-1 left-[-11px] w-5 h-5 rounded-full bg-gray-700 border-4 border-black"></div>

            {/* البطاقة الوهمية */}
            <div className="bg-gray-800/50 p-6 rounded-lg">
                {/* هيكل العنوان */}
                <div className="h-6 w-3/4 bg-gray-700 rounded mb-2"></div>
                {/* هيكل اسم الشركة والتاريخ */}
                <div className="h-4 w-1/2 bg-gray-700 rounded mb-3"></div>
                {/* هيكل الوصف */}
                <div className="h-4 w-full bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
            </div>
        </div>
    );
}

export default ExperienceItemSkeleton;

