import React from 'react';
import { Upload, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function StatsCard() {
    const { user } = useAuth();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Files Shared
                        </h3>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {user?.filesShared || 0}
                        </p>
                    </div>
                    <div className="p-3 bg-blue-600 rounded-lg shadow-sm group-hover:bg-blue-700 transition-colors duration-300">
                        <Upload className="h-6 w-6 text-white" />
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total files uploaded and shared securely
                </p>
            </div>

            <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Files Received
                        </h3>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {user?.filesReceived || 0}
                        </p>
                    </div>
                    <div className="p-3 bg-blue-600 rounded-lg shadow-sm group-hover:bg-blue-700 transition-colors duration-300">
                        <Download className="h-6 w-6 text-white" />
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Files received from other users
                </p>
            </div>
        </div>
    );
}

export default StatsCard;