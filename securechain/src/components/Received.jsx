import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Modal, Calendar, Popover } from 'antd';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Loader2,
  Download,
  Lock,
  Check,
  User,
  Clock,
  Calendar as CalendarIcon,
  Search,
  RefreshCw
} from 'lucide-react';
import Lottie from 'lottie-react';
import noResultsAnimation from '../assets/animations/NO RESULTS.json';
import dayjs from 'dayjs';

function Received() {
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [receivedFiles, setReceivedFiles] = useState([]);
    const [allFiles, setAllFiles] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [searchQuery, setSearchQuery] = useState('');
    const [currentFile, setCurrentFile] = useState(null);
    const [keyModalVisible, setKeyModalVisible] = useState(false);
    const [decryptionKey, setDecryptionKey] = useState('');
    const [verifyingKey, setVerifyingKey] = useState(false);
    const [verifiedFiles, setVerifiedFiles] = useState(new Map());
    const [downloadingFileId, setDownloadingFileId] = useState(null);
    
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            filterFilesByDate(allFiles, selectedDate);
            return;
        }

        const searchResults = allFiles.filter(file => {
            const searchTerms = query.toLowerCase();
            const fileName = file.fileName?.toLowerCase() || '';
            const senderName = file.senderUsername?.toLowerCase() || '';
            const senderAddress = file.sender?.toLowerCase() || '';

            return fileName.includes(searchTerms) ||
                   senderName.includes(searchTerms) ||
                   senderAddress.includes(searchTerms);
        });

        setReceivedFiles(searchResults);
    };

    const fetchReceivedFiles = async () => {
        if (!user?.walletAddress) return;
        try {
            setLoadingFiles(true);
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token not found");
            }
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/files/received/${user.walletAddress}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const files = response.data.files || [];
            setAllFiles(files);
            filterFilesByDate(files, selectedDate);
        } catch (error) {
            console.error("Error fetching received files:", error);
            message.error("Failed to fetch received files");
        } finally {
            setLoadingFiles(false);
        }
    };

    const filterFilesByDate = (files, date) => {
        const selectedDay = dayjs(date).startOf('day');
        
        const filteredFiles = files.filter(file => {
            const fileDate = dayjs(file.createdAt).startOf('day');
            return fileDate.isSame(selectedDay, 'day');
        });
        
        setReceivedFiles(filteredFiles);
    };

    const handleDateChange = (date) => {
        if (date) {
            setSelectedDate(date);
            filterFilesByDate(allFiles, date);
        }
    };

    const handleKeyVerification = async (file) => {
        try {
            setCurrentFile(file);
            setKeyModalVisible(true);
        } catch (error) {
            console.error("Error:", error);
            message.error("Failed to process request");
        }
    };

    const handleKeySubmit = async () => {
        try {
            setVerifyingKey(true);
            const token = localStorage.getItem("token");
            if (!token) {
                message.error("Please login to download files");
                navigate("/login");
                return;
            }

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/files/verify-key/${currentFile.id}`,
                { aesKey: decryptionKey.trim() },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setVerifiedFiles((prev) => {
                const newMap = new Map(prev);
                newMap.set(currentFile.id, {
                    verified: true,
                    key: decryptionKey.trim(),
                    unlockTime: new Date(currentFile.unlockTime),
                    fileName: currentFile.fileName,
                    recipient: currentFile.recipient,
                });
                return newMap;
            });

            message.success("Key verified successfully!");
            setKeyModalVisible(false);
            setDecryptionKey("");
        } catch (error) {
            let errorMessage = "Failed to verify key";

            if (error.response) {
                const errorData = error.response.data;
                errorMessage = errorData.message || errorMessage;

                switch (error.response.status) {
                    case 401:
                        message.error("Your session has expired. Please login again.");
                        localStorage.removeItem("token");
                        navigate("/login");
                        break;
                    case 403:
                        if (errorData.details) {
                            errorMessage += "\n\n";
                            if (errorData.details.recipient && errorData.details.yourAddress) {
                                errorMessage += `Recipient: ${errorData.details.recipient}\nYour address: ${errorData.details.yourAddress}`;
                            }
                        }
                        Modal.error({
                            title: "Verification Failed",
                            content: errorMessage,
                            okText: "Close"
                        });
                        break;
                    default:
                        Modal.error({
                            title: "Verification Failed",
                            content: errorMessage,
                            okText: "Close"
                        });
                }
            } else if (error.request) {
                Modal.error({
                    title: "Connection Error",
                    content: "Could not connect to the server. Please check your internet connection.",
                    okText: "Close"
                });
            } else {
                message.error(errorMessage);
            }
        } finally {
            setVerifyingKey(false);
        }
    };

    const cleanupExpiredVerifications = useCallback(() => {
        const now = new Date();
        setVerifiedFiles((prev) => {
            const newMap = new Map(prev);
            let hasChanges = false;

            newMap.forEach((data, fileId) => {
                const unlockTime = new Date(data.unlockTime);
                if (now.getTime() - unlockTime.getTime() > 24 * 60 * 60 * 1000) {
                    newMap.delete(fileId);
                    hasChanges = true;
                }
            });

            return hasChanges ? newMap : prev;
        });
    }, []);

    useEffect(() => {
        cleanupExpiredVerifications();
        fetchReceivedFiles();
    }, [cleanupExpiredVerifications, user?.walletAddress]);

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

    const isFileLocked = (file) => {
        const now = new Date();
        const unlockTime = new Date(file.unlockTime);
        return now < unlockTime;
    };

    const getRemainingLockTime = (file) => {
        const now = new Date();
        const unlockTime = new Date(file.unlockTime);
        const timeLeft = Math.ceil((unlockTime - now) / (1000 * 60));
        return timeLeft;
    };

    const handleDownload = async (file, verifiedKey) => {
        try {
            setDownloadingFileId(file.id);
            const token = localStorage.getItem("token");
            if (!token) {
                message.error("Please login to download files");
                navigate("/login");
                return;
            }

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/files/download/${file.id}`,
                { aesKey: verifiedKey },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    responseType: "blob",
                }
            );

            const contentType = response.headers["content-type"];
            if (contentType && contentType.includes("application/json")) {
                const errorText = await response.data.text();
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.message || "Failed to download file");
            }

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = file.fileName.replace(".enc", "");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            message.success("File downloaded successfully!");
        } catch (error) {
            let errorMessage = "Failed to download file";

            if (error.response) {
                if (error.response.data instanceof Blob) {
                    try {
                        const text = await error.response.data.text();
                        const errorData = JSON.parse(text);
                        errorMessage = errorData.message;

                        if (errorData.details) {
                            if (errorData.details.recipient && errorData.details.yourAddress) {
                                errorMessage += `\n\nRecipient: ${errorData.details.recipient}\nYour address: ${errorData.details.yourAddress}`;
                            }
                        }
                    } catch (e) {
                        console.error("Error parsing error response:", e);
                    }
                } else {
                    errorMessage = error.response.data?.message || errorMessage;
                }

                switch (error.response.status) {
                    case 401:
                        message.error("Your session has expired. Please login again.");
                        localStorage.removeItem("token");
                        navigate("/login");
                        break;
                    case 403:
                        Modal.error({
                            title: "Download Failed",
                            content: errorMessage,
                            okText: "Close"
                        });
                        break;
                    case 404:
                        message.error("File not found");
                        break;
                    default:
                        message.error(errorMessage);
                }
            } else {
                message.error(errorMessage);
            }
        } finally {
            setDownloadingFileId(null);
        }
    };



    return (
        <div className="bg-white rounded-xl shadow-sm card-scrollbar">
            <div className="p-4">
                <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Received Files</h2>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={fetchReceivedFiles}
                                disabled={loadingFiles}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Refresh files"
                            >
                                <RefreshCw className={`h-4 w-4 ${loadingFiles ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
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
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search by file name, sender, or address..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                </div>
                {loadingFiles ? (
                    <div className="flex justify-center items-center py-6">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="max-h-96 overflow-y-auto card-scrollbar">
                        {receivedFiles.length > 0 ? (
                            <div className="space-y-4 pr-2">
                                {receivedFiles.map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {file.fileName || "Unnamed File"}
                                            </h3>
                                            <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
                                                <span className="flex items-center">
                                                    <User className="h-3.5 w-3.5 mr-1" />
                                                    From: {file.senderUsername ? (
                                                        <span title={file.sender}>
                                                            {file.senderUsername}
                                                        </span>
                                                    ) : (
                                                        <span className="font-mono">
                                                            {file.sender?.slice(0, 6)}...{file.sender?.slice(-4)}
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="flex items-center">
                                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                                    {isFileLocked(file) ? (
                                                        <span className="text-yellow-600">
                                                            Locked for {getRemainingLockTime(file)} minutes
                                                        </span>
                                                    ) : (
                                                        <span className="text-green-600">
                                                            Available now
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
                                        <div className="flex items-center space-x-2">
                                            {verifiedFiles.has(file.id) ? (
                                                <button
                                                    className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                                        ${downloadingFileId === file.id
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : isFileLocked(file)
                                                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white cursor-not-allowed'
                                                                : 'text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
                                                        }`}
                                                    onClick={() =>
                                                        isFileLocked(file)
                                                            ? null
                                                            : handleDownload(file, verifiedFiles.get(file.id).key)
                                                    }
                                                    disabled={downloadingFileId === file.id || isFileLocked(file)}
                                                >
                                                    {downloadingFileId === file.id ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                            Downloading...
                                                        </>
                                                    ) : isFileLocked(file) ? (
                                                        <>
                                                            <Lock className="h-4 w-4 mr-2" />
                                                            Locked
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Download
                                                        </>
                                                    )}
                                                </button>
                                            ) : isFileLocked(file) ? (
                                                <button
                                                    className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors bg-yellow-500 text-white cursor-not-allowed"
                                                    disabled={true}
                                                    onClick={() => {
                                                        Modal.info({
                                                            title: "File Locked",
                                                            content: `This file will be available in ${getRemainingLockTime(
                                                                file
                                                            )} minutes (${new Date(
                                                                file.unlockTime
                                                            ).toLocaleString()})`,
                                                            okText: "Got it"
                                                        });
                                                    }}
                                                >
                                                    <Lock className="h-4 w-4 mr-2" />
                                                    Locked
                                                </button>
                                            ) : (
                                                <button
                                                    className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                                        ${verifyingKey && currentFile?.id === file.id
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
                                                        }`}
                                                    onClick={() => handleKeyVerification(file)}
                                                    disabled={verifyingKey && currentFile?.id === file.id}
                                                >
                                                    {verifyingKey && currentFile?.id === file.id ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                            Verifying...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Check className="h-4 w-4 mr-2" />
                                                            Verify Key
                                                        </>
                                                    )}
                                                </button>
                                            )}
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
                                    No files were received on this date
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Modal
                title="Enter Decryption Key"
                open={keyModalVisible}
                onOk={handleKeySubmit}
                onCancel={() => {
                    setKeyModalVisible(false);
                    setDecryptionKey("");
                }}
                okText="Verify"
                cancelText="Cancel"
                confirmLoading={verifyingKey}
            >
                <div className="mt-4">
                    <input
                        type="text"
                        value={decryptionKey}
                        onChange={(e) => setDecryptionKey(e.target.value)}
                        placeholder="Enter the decryption key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </Modal>
        </div>
    );
}

export default Received;