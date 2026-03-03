import React from 'react'

export default function LoaderSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse flex flex-col gap-4">
            {/* Image Skeleton */}
            <div className="w-full h-64 bg-gray-200 rounded-xl"></div>

            {/* Content Skeleton */}
            <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>

            {/* Footer Skeleton */}
            <div className="flex justify-between items-center pt-2 mt-auto">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-1/3"></div>
            </div>
        </div>
    )
}
