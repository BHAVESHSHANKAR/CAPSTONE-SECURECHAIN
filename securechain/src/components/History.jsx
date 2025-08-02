import React, { useState, useEffect } from 'react';
import { message, Calendar, Popover } from 'antd';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Loader2,
  User,
  Clock,
  Calendar as CalendarIcon,
  Search
} from 'lucide-react';
import Lottie from 'lottie-react';
import noResultsAnimation from '../assets/animations/NO RESULTS.json';
import dayjs from 'dayjs';

function History() {
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [fileHistory, setFileHistory] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [allFiles, setAllFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            filterFilesByDate(allFiles, selectedDate);
            return;
        }

        const searchResults = allFiles.filter(file => {
            const searchTerms = query.toLowerCase();
            const fileName = file.fileName.toLowerCase();
            const senderName = file.sender?.username?.toLowerCase() || '';
            const recipientName = file.recipient?.username?.toLowerCase() || '';
            const senderAddress = file.sender?.address?.toLowerCase() || '';
            const recipientAddress = file.recipient?.address?.toLowerCase() || '';

            return fileName.includes(searchTerms) ||
                   senderName.includes(searchTerms) ||
                   recipientName.includes(searchTerms) ||
                   senderAddress.includes(searchTerms) ||
                   recipientAddress.includes(searchTerms);
        });

        setFileHistory(searchResults);
    };

    const fetchFileHistory = async () => {
        if (!user?.walletAddress) return;
        try {
            setLoadingHistory(true);
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token not found");
            }
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/files/history/${user.walletAddress}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const files = response.data.files || [];
            setAllFiles(files);
            filterFilesByDate(files, selectedDate);
        } catch (error) {
            console.error("Error fetching file history:", error);
            message.error("Failed to fetch file history");
        } finally {
            setLoadingHistory(false);
        }
    };

    const filterFilesByDate = (files, date) => {
        const selectedDay = dayjs(date).startOf('day');
        
        const filteredFiles = files.filter(file => {
            const fileDate = dayjs(file.createdAt).startOf('day');
            return fileDate.isSame(selectedDay, 'day');
        });
        
        setFileHistory(filteredFiles);
    };

    const handleDateChange = (date) => {
        if (date) {
            setSelectedDate(date);
            filterFilesByDate(allFiles, date);
        }
    };

    useEffect(() => {
        fetchFileHistory();
    }, [user?.walletAddress]);

    const dateCellRender = (date) => {
        const dayFiles = allFiles.filter(file => {
            const fileDate = dayjs(file.createdAt).startOf('day');
            return fileDate.isSame(date, 'day');
        });

        if (dayFiles.length > 0) {
            return (
                <div className="text-xs">
                    <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mx-auto"></div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm card-scrollbar">
            <div className="p-4">
                <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">File History</h2>
                        <Popover 
                            content={
                                <div className="w-[300px]">
                                    <Calendar 
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        cellRender={dateCellRender}
                                        fullscreen={false}
                                    />
                                </div>
                            }
                            trigger="click"
                            placement="bottom"
                        >
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <CalendarIcon className="h-4 w-4" />
                                {selectedDate.format('MMMM D, YYYY')}
                            </button>
                        </Popover>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search by file name, sender, or recipient..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                </div>
                {loadingHistory ? (
                    <div className="flex justify-center items-center py-6">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="max-h-96 overflow-y-auto card-scrollbar">
                        {fileHistory.length > 0 ? (
                            <div className="space-y-4 pr-2">
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
                                                    {dayjs(file.createdAt).format('hh:mm A')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="w-48 h-48">
                                    <Lottie
                                        animationData={noResultsAnimation}
                                        loop={true}
                                        style={{ width: "100%", height: "100%" }}
                                    />
                                </div>
                                <p className="text-gray-500 text-center">
                                    No files were shared on this date
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default History;