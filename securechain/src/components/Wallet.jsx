import React, { useState } from 'react';
import { X, Wallet as WalletIcon, Copy, Check } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { message } from 'antd';

function Wallet() {
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [otpError, setOtpError] = useState('');
    const [copied, setCopied] = useState(false);
    const { user, setUser } = useAuth();

    const handleCopyAddress = () => {
        if (user?.walletAddress) {
            navigator.clipboard.writeText(user.walletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            message.success('Wallet address copied to clipboard');
        }
    };

    const handleSendOTP = async () => {
        try {
            setLoading(true);
            setOtpError("");
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token not found");
            }
            const response = await axios.post(
                "http://localhost:5050/api/auth/generate-otp",
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setOtpSent(true);
            message.success("OTP sent to your email!");
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to send OTP";
            setOtpError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            setLoading(true);
            setOtpError("");
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token not found");
            }
            const response = await axios.post(
                "http://localhost:5050/api/auth/verify-otp",
                { otp: otpInput },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUser({ ...user, walletAddressVisible: true });
            setOtpInput("");
            setOtpSent(false);
            message.success("Wallet address verified!");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Invalid OTP";
            setOtpError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleHideWallet = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token not found");
            }
            const response = await axios.post(
                "http://localhost:5050/api/auth/hide-wallet",
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUser({ ...user, walletAddressVisible: false });
            message.success("Wallet address hidden");
        } catch (error) {
            message.error("Failed to hide wallet address");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-900">
                    Wallet
                </h1>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <label className="text-sm font-medium text-gray-500 block mb-2">
                        Connected Wallet
                    </label>
                    <div className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                        <WalletIcon className="h-5 w-5 text-gray-400 mt-1" />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <span className="font-mono text-sm text-gray-900 break-all">
                                    {user?.walletAddressVisible
                                        ? user?.walletAddress
                                        : user?.walletAddress?.replace(/./g, "*") || "No wallet address"}
                                </span>
                                {user?.walletAddressVisible && (
                                    <button
                                        onClick={handleCopyAddress}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </button>
                                )}
                            </div>
                            {!user?.walletAddressVisible ? (
                                <div className="mt-4">
                                    {!otpSent ? (
                                        <button
                                            onClick={handleSendOTP}
                                            disabled={loading}
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50"
                                        >
                                            {loading ? "Sending..." : "Send OTP to View"}
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={otpInput}
                                                onChange={(e) => setOtpInput(e.target.value)}
                                                placeholder="Enter OTP"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {otpError && (
                                                <p className="text-red-500 text-sm">{otpError}</p>
                                            )}
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={handleVerifyOTP}
                                                    disabled={loading || !otpInput}
                                                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50"
                                                >
                                                    {loading ? "Verifying..." : "Verify OTP"}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setOtpSent(false);
                                                        setOtpInput("");
                                                        setOtpError("");
                                                    }}
                                                    className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="mt-4">
                                    <button
                                        onClick={handleHideWallet}
                                        disabled={loading}
                                        className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300"
                                    >
                                        {loading ? "Hiding..." : "Hide Wallet Address"}
                                    </button>
                                </div>
                            )}

                            {/* Security Information Section */}
                            <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="font-medium text-gray-900">
                                    Wallet Security Guidelines
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-yellow-500 mt-0.5">⚠️</span>
                                        <span>Never share your wallet's private key or seed phrase with anyone.</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-blue-500 mt-0.5">🔒</span>
                                        <span>Your wallet address is public but keep your transactions private.</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        <span>Always verify recipient addresses before sending files or transactions.</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-purple-500 mt-0.5">🔐</span>
                                        <span>Enable two-factor authentication for additional security.</span>
                                    </li>
                                </ul>

                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <span className="font-medium">Tip:</span> Use the Hide Wallet
                                        feature when not actively sharing files to enhance privacy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Wallet;