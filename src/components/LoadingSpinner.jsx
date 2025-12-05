// src/components/LoadingSpinner.jsx

import { Loader } from 'lucide-react'

function LoadingSpinner() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
            <div className="text-center">
                <Loader className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">Loading your data...</p>
            </div>
        </div>
    )
}

export default LoadingSpinner