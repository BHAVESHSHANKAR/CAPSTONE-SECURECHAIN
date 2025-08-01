"use client";
import React, { useState, useCallback } from "react";
import { recordFileOnBlockchain } from "../lib/blockchain";
import { FileUpload } from "./ui/file-upload";
import { Check, Copy, Loader2, Upload, X, Search } from "lucide-react";
import axios from 'axios';
import crypto from 'crypto-js';
import { useAuth } from "../context/AuthContext";
import { Modal, Spin } from "antd";
import debounce from 'lodash/debounce';
import { ethers } from "ethers";

export function FileUploadDemo() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [unlockTime, setUnlockTime] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [aesKey, setAesKey] = useState('');
  const [keyCopied, setKeyCopied] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [txCopied, setTxCopied] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleFileChange = useCallback((files) => {
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || !recipient || !unlockTime) {
      setErrorMessage("Please fill in all required fields");
      setErrorModalVisible(true);
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Generate random AES key
      const aesKey = crypto.lib.WordArray.random(32).toString();
      const aesKeyHash = crypto.SHA256(aesKey).toString();

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('recipient', recipient);
      formData.append('aesKeyHash', aesKeyHash);
      formData.append('unlockTime', new Date(unlockTime).toISOString());

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5050/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      // Store AES key (but don't show modal yet)
      setAesKey(aesKey);

      // Record on Blockchain
      const fileUrl = response.data.file.fileUrl;
      const fileName = selectedFile.name;

      const blockchainResult = await recordFileOnBlockchain({
        fileUrl,
        fileName,
        recipient,
        unlockTime
      });

      if (!blockchainResult.success) {
        // Enhanced error message for "File ID already used" error
        let enhancedError = blockchainResult.error;
        if (blockchainResult.error.includes("File ID already used")) {
          enhancedError = "🔒 This file has already been recorded on the blockchain! Our secure blockchain technology prevents duplicate file uploads to maintain data integrity and prevent conflicts. Each file gets a unique identifier that cannot be reused, ensuring your data remains secure and tamper-proof. Please try uploading a different file or rename your current file to create a new unique record.";
        } else if (blockchainResult.error.includes("execution reverted")) {
          enhancedError = "⛓️ Blockchain transaction was rejected. This could be due to network congestion, insufficient gas fees, or smart contract validation. Please check your wallet connection and try again.";
        } else if (blockchainResult.error.includes("user rejected")) {
          enhancedError = "❌ Transaction was cancelled by user. Please approve the transaction in your wallet to complete the file upload to the blockchain.";
        } else if (blockchainResult.error.includes("insufficient funds")) {
          enhancedError = "💰 Insufficient funds for gas fees. Please ensure you have enough ETH in your wallet to cover the transaction costs on the Sepolia network.";
        }
        
        setErrorMessage(enhancedError);
        setErrorModalVisible(true);
        resetForm();
        return;
      }

      // If blockchain transaction succeeded, store the hash and show AES key modal
      setTxHash(blockchainResult.txHash);
      setShowKeyModal(true);

      // Send email to recipient
      try {
        await axios.post('http://localhost:5050/api/files/notify', {
          recipient,
          fileName: selectedFile.name,
          aesKey,
          txHash: blockchainResult.txHash,
          unlockTime: new Date(unlockTime).toLocaleString(),
          sender: user.username || user.email
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Show modals in sequence
        setShowKeyModal(true);

        // Reset form after successful upload and notification
        resetForm();
      } catch (error) {
        console.error('Failed to send email notification:', error);
        
        // Show AES key modal first
        setShowKeyModal(true);
        
        // Show email error after a delay
        setTimeout(() => {
          setErrorMessage("The file was shared successfully on the blockchain, but we couldn't send the email notification. Please share the decryption key and transaction hash with the recipient manually.");
          setErrorModalVisible(true);
        }, 1000);
        
        resetForm();
      }

    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error.response?.data?.message || "Failed to upload file");
      setErrorModalVisible(true);
      resetForm();
    } finally {
      setUploading(false);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(aesKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const handleCopyTx = () => {
    navigator.clipboard.writeText(txHash);
    setTxCopied(true);
    setTimeout(() => setTxCopied(false), 2000);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setRecipient('');
    setUnlockTime('');
    setUploadProgress(0);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Handle user search
  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5050/api/auth/search?query=${value}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setSearchResults(response.data.users);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounce search
  const debouncedSearch = useCallback(
    debounce((value) => handleSearch(value), 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleSelectUser = (user) => {
    setRecipient(user.walletAddress);
    setSearchQuery(user.username);
    setSearchResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - File Upload */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload File</h3>
          <FileUpload
            onChange={handleFileChange}
            disabled={uploading}
            uploadProgress={uploadProgress}
          />
        </div>

        {/* Right Side - Recipient Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recipient Details</h3>
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Recipient
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by username or wallet address..."
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={uploading}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {searchLoading ? (
                    <Spin size="small" />
                  ) : (
                    <Search className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                  <ul className="py-1 max-h-60 overflow-auto">
                    {searchResults.map((user, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelectUser(user)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">{user.username}</span>
                          <span className="text-sm text-gray-500 font-mono">{user.walletAddress}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient's Wallet Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                disabled={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unlock Time
              </label>
              <input
                type="datetime-local"
                value={unlockTime}
                onChange={(e) => setUnlockTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={uploading}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || !recipient || !unlockTime || uploading}
        className={`
          relative overflow-hidden
          w-full flex items-center justify-center
          px-4 py-3 rounded-lg
          text-sm font-medium text-white
          bg-gradient-to-r from-blue-500 to-purple-500
          hover:opacity-90
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transform transition-all duration-200 ease-in-out
          hover:scale-[1.02] active:scale-[0.98]
        `}
      >
        {uploading ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500">
              <div
                className="h-full bg-white/20 transition-all duration-300 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 relative z-10" />
            <span className="relative z-10 font-semibold">
              {uploadProgress < 100 ? `Uploading (${uploadProgress}%)` : 'Encrypting...'}
            </span>
          </>
        ) : (
          <>
            <Upload className="-ml-1 mr-2 h-5 w-5" />
            <span className="font-semibold">Upload File</span>
          </>
        )}
      </button>

      {/* AES Key Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2 text-green-600">
            <Check className="h-5 w-5" />
            <span>Encryption Key</span>
          </div>
        }
        open={showKeyModal}
        onCancel={() => {
          setShowKeyModal(false);
          // Show transaction hash modal after AES key modal is closed
          setTimeout(() => {
            setShowTxModal(true);
          }, 300);
        }}
        footer={null}
        width={500}
        closable={true}
      >
        <div className="mt-4">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-red-500 text-sm mb-4">
              ⚠️ Save this encryption key! You'll need it to decrypt the file.
            </p>
            <div className="bg-white p-3 rounded border border-yellow-300 flex items-center space-x-2">
              <code className="flex-1 font-mono text-sm break-all">{aesKey}</code>
              <button
                onClick={handleCopyKey}
                className="p-2 hover:bg-yellow-100 rounded-md transition-colors"
                title="Copy to clipboard"
              >
                {keyCopied ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5 text-yellow-600" />
                )}
              </button>
            </div>
            <div className="mt-2 text-sm text-yellow-700">
              <p>• Share this key securely with the recipient</p>
              <p>• The key will not be shown again</p>
              <p>• Keep it safe until the file is decrypted</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Transaction Hash Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2 text-blue-600">
            <Check className="h-5 w-5" />
            <span>Transaction Hash</span>
          </div>
        }
        open={showTxModal}
        onOk={() => setShowTxModal(false)}
        onCancel={() => setShowTxModal(false)}
        okText="Close"
        width={500}
      >
        <div className="mt-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="bg-white p-3 rounded border border-blue-300 flex items-center space-x-2">
              <code className="flex-1 font-mono text-sm break-all">{txHash}</code>
              <button
                onClick={handleCopyTx}
                className="p-2 hover:bg-blue-100 rounded-md transition-colors"
                title="Copy to clipboard"
              >
                {txCopied ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5 text-blue-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2 text-red-600">
            <X className="h-5 w-5" />
            <span>{errorMessage.includes("blockchain") ? "Blockchain Transaction Failed" : 
                   errorMessage.includes("email") ? "Email Notification Failed" : 
                   "Upload Failed"}</span>
          </div>
        }
        open={errorModalVisible}
        onOk={() => setErrorModalVisible(false)}
        onCancel={() => setErrorModalVisible(false)}
        okText="Close"
        width={500}
      >
        <div className="space-y-4 mt-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">Error Details</h4>
            <p className="text-red-700 font-medium mb-2">{errorMessage}</p>
          </div>
          
          {errorMessage.includes("blockchain") ? (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Blockchain Troubleshooting</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Make sure MetaMask is installed and unlocked</li>
                <li>Check if you have sufficient funds for gas fees</li>
                <li>Verify the recipient's wallet address is correct</li>
                <li>Ensure you're connected to the Sepolia test network</li>
                <li>Try refreshing the page and attempting again</li>
              </ul>
            </div>
          ) : errorMessage.includes("email") ? (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Important Note</h4>
              <p className="text-sm text-gray-600 mb-2">
                Your file has been successfully shared on the blockchain. However, the automatic email notification failed.
              </p>
              <p className="text-sm text-gray-600 font-medium">Please ensure you:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mt-2">
                <li>Copy and save the decryption key from the previous popup</li>
                <li>Copy the transaction hash that will be shown next</li>
                <li>Share these details with the recipient through a secure channel</li>
              </ul>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Upload Troubleshooting</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Check your internet connection</li>
                <li>Ensure the file size is within limits</li>
                <li>Verify you're logged in</li>
                <li>Try refreshing the page and uploading again</li>
              </ul>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
