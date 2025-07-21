"use client";
import React, { useState, useCallback } from "react";
import { recordFileOnBlockchain } from "../lib/blockchain";
import { FileUpload } from "./ui/file-upload";
import { Check, Copy, Loader2, Upload } from "lucide-react";
import axios from "axios";
import toast from 'react-hot-toast';
import crypto from 'crypto-js';
import { useAuth } from "../context/AuthContext";
import { Modal } from "antd";
import { ethers } from "ethers";

const Toast = ({ title, message, type = 'success' }) => (
  <div className="flex items-start space-x-4 bg-white shadow-lg rounded-lg p-4 max-w-md">
    <div className={`flex-shrink-0 ${type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
      {type === 'success' ? (
        <Check className="h-6 w-6" />
      ) : (
        <X className="h-6 w-6" />
      )}
    </div>
    <div className="flex-1 pt-0.5">
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  </div>
);

const UploadButton = ({ onClick, disabled, uploading, uploadProgress, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
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
        ${className}
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
  );
};

export function FileUploadDemo() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [unlockTime, setUnlockTime] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [aesKey, setAesKey] = useState('');
  const [keyCopied, setKeyCopied] = useState(false);

  const handleFileChange = useCallback((files) => {
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || !recipient || !unlockTime) {
      toast.custom((t) => (
        <Toast
          title="Missing Information"
          message="Please fill in all required fields"
          type="error"
        />
      ));
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

      // Show success message and AES key
      toast.custom((t) => (
        <Toast
          title="Success"
          message="File uploaded successfully"
          type="success"
        />
      ));

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
        toast.custom(() => (
          <Toast title="Blockchain Error" message={blockchainResult.error} type="error" />
        ));
      } else {
        toast.custom(() => (
          <Toast title="Blockchain Tx Success" message={`Tx Hash: ${blockchainResult.txHash}`} />
        ));
      }

      // Reset form
      setSelectedFile(null);
      setRecipient('');
      setUnlockTime('');
      setUploadProgress(0);

    } catch (error) {
      console.error('Upload error:', error);
      toast.custom((t) => (
        <Toast
          title="Upload Failed"
          message={error.response?.data?.message || "Failed to upload file"}
          type="error"
        />
      ));
    } finally {
      setUploading(false);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(aesKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
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
      <UploadButton
        onClick={handleUpload}
        disabled={!selectedFile || !recipient || !unlockTime || uploading}
        uploading={uploading}
        uploadProgress={uploadProgress}
      />

      {/* AES Key Modal */}
      <Modal
        title="File Uploaded Successfully"
        open={showKeyModal}
        onOk={() => setShowKeyModal(false)}
        onCancel={() => setShowKeyModal(false)}
        okText="Close"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Please save this decryption key and share it with the recipient. They will need it to access the file.
          </p>
          <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg">
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
    </div>
  );
}
