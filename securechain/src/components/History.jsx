import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Loader2,
  User,
  Clock
} from 'lucide-react';
import Lottie from 'lottie-react';
import noResultsAnimation from '../assets/animations/NO RESULTS.json';

function History() {
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [fileHistory, setFileHistory] = useState([]);
    const { user } = useAuth();

    const fetchFileHistory = async () => {
        if (!user?.walletAddress) return;
        try {
            setLoadingHistory(true);
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token not found");
            }
            const response = await axios.get(
                `http://localhost:5050/api/files/history/${user.walletAddress}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setFileHistory(response.data.files || []);
        } catch (error) {
            console.error("Error fetching file history:", error);
            message.error("Failed to fetch file history");
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchFileHistory();
    }, [user?.walletAddress]);

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4">
                {loadingHistory ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : fileHistory.length > 0 ? (
                    <div className="space-y-4">
                        {fileHistory.map((file) => (
                            <div
                                key={file.id}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border transition-colors
                                    ${file.type === "sent"
                                        ? "bg-blue-50 border-blue-100"
                                        : "bg-green-50 border-green-100"
                                    }`}
                            >
                                <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full
                                                ${file.type === "sent"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {file.type === "sent" ? "Sent" : "Received"}
                                        </span>
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                            {file.fileName}
                                        </h3>
                                    </div>
                                    <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
                                        <span className="flex items-center">
                                            <User className="h-3.5 w-3.5 mr-1" />
                                            From:{" "}
                                            {file.sender?.username ? (
                                                <span title={file.sender.address} className="ml-1">
                                                    {file.sender.username}
                                                </span>
                                            ) : (
                                                <span className="font-mono ml-1">
                                                    {file.sender?.address?.slice(0, 6)}...
                                                    {file.sender?.address?.slice(-4)}
                                                </span>
                                            )}
                                        </span>
                                        <span className="hidden sm:inline">→</span>
                                        <span className="flex items-center">
                                            <User className="h-3.5 w-3.5 mr-1" />
                                            To:{" "}
                                            {file.recipient?.username ? (
                                                <span title={file.recipient.address} className="ml-1">
                                                    {file.recipient.username}
                                                </span>
                                            ) : (
                                                <span className="font-mono ml-1">
                                                    {file.recipient?.address?.slice(0, 6)}...
                                                    {file.recipient?.address?.slice(-4)}
                                                </span>
                                            )}
                                        </span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="flex items-center">
                                            <Clock className="h-3.5 w-3.5 mr-1" />
                                            {new Date(file.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-64 h-64">
                            <Lottie
                                animationData={noResultsAnimation}
                                loop={true}
                                style={{ width: "100%", height: "100%" }}
                            />
                        </div>
                        <p className="mt-4 text-gray-500 text-center">
                            No file history found
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default History;