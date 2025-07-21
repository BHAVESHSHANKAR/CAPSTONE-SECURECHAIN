"use client";
import React, { useState, useCallback } from "react";
import { recordFileOnBlockchain } from "../lib/blockchain";
import { FileUpload } from "./ui/file-upload";
import { Check, Copy, Loader2, Upload, X } from "lucide-react";
import axios from 'axios';
import crypto from 'crypto-js';
import { useAuth } from "../context/AuthContext";
import { Modal } from "antd";
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

      // Store AES key and show modal
      setAesKey(aesKey);
      setShowKeyModal(true);

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
        setErrorMessage(blockchainResult.error);
        setErrorModalVisible(true);
      } else {
        setTxHash(blockchainResult.txHash);
        setShowTxModal(true);
      }

      // Reset form
      setSelectedFile(null);
      setRecipient('');
      setUnlockTime('');
      setUploadProgress(0);

    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error.response?.data?.message || "Failed to upload file");
      setErrorModalVisible(true);
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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FileUpload
          onChange={handleFileChange}
          disabled={uploading}
          uploadProgress={uploadProgress}
        />
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient's Wallet Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={uploading}
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
            />
          </div>
        </div>
      </div>
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

      {/* Success Modal with AES Key */}
      <Modal
        title={
          <div className="flex items-center space-x-2 text-green-600">
            <Check className="h-5 w-5" />
            <span>File Uploaded Successfully</span>
          </div>
        }
        open={showKeyModal}
        onOk={() => setShowKeyModal(false)}
        onCancel={() => setShowKeyModal(false)}
        okText="Continue"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div className="space-y-4 mt-4">
          <p className="text-gray-600">
            Please save this decryption key and share it with the recipient. They will need it to access the file.
          </p>
          <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-lg">
            <code className="flex-1 font-mono text-sm break-all">{aesKey}</code>
            <button
              onClick={handleCopyKey}
              className="p-2 hover:bg-gray-200 rounded-md transition-colors"
              title="Copy to clipboard"
            >
              {keyCopied ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Transaction Hash Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2 text-blue-600">
            <Check className="h-5 w-5" />
            <span>Blockchain Transaction Successful</span>
          </div>
        }
        open={showTxModal}
        onOk={() => setShowTxModal(false)}
        onCancel={() => setShowTxModal(false)}
        okText="Close"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div className="space-y-4 mt-4">
          <p className="text-gray-600">
            Your file has been successfully recorded on the blockchain. You can use this transaction hash to track your file.
          </p>
          <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-lg">
            <code className="flex-1 font-mono text-sm break-all">{txHash}</code>
            <button
              onClick={handleCopyTx}
              className="p-2 hover:bg-gray-200 rounded-md transition-colors"
              title="Copy to clipboard"
            >
              {txCopied ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2 text-red-600">
            <X className="h-5 w-5" />
            <span>Error</span>
          </div>
        }
        open={errorModalVisible}
        onOk={() => setErrorModalVisible(false)}
        onCancel={() => setErrorModalVisible(false)}
        okText="Close"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div className="mt-4">
          <p className="text-gray-600">{errorMessage}</p>
        </div>
      </Modal>
    </div>
  );
}
