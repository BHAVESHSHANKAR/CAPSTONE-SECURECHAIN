import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Search, ExternalLink, Loader2 } from 'lucide-react';
import { message } from 'antd';

export function TransactionChecker() {
    const [txHash, setTxHash] = useState('');
    const [loading, setLoading] = useState(false);
    const [txDetails, setTxDetails] = useState(null);

    const handleCheck = async () => {
        if (!txHash.trim()) {
            message.error('Please enter a transaction hash');
            return;
        }

        try {
            setLoading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const tx = await provider.getTransaction(txHash);
            
            if (!tx) {
                message.error('Transaction not found');
                return;
            }

            const receipt = await provider.getTransactionReceipt(txHash);
            
            setTxDetails({
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                status: receipt?.status ? 'Success' : 'Failed',
                blockNumber: tx.blockNumber,
                gasUsed: receipt?.gasUsed?.toString() || 'N/A',
                timestamp: new Date().toLocaleString(), // Ideally, get this from block
            });

        } catch (error) {
            console.error('Error checking transaction:', error);
            message.error('Failed to fetch transaction details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="Enter transaction hash"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleCheck}
                    disabled={loading || !txHash.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Checking...</span>
                        </>
                    ) : (
                        <>
                            <Search className="h-5 w-5" />
                            <span>Check</span>
                        </>
                    )}
                </button>
            </div>

            {txDetails && (
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
                    <div className="grid gap-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-500">Transaction Hash</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">{txDetails.hash}</span>
                                <a
                                    href={`https://sepolia.etherscan.io/tx/${txDetails.hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-gray-500">From</span>
                                <p className="font-mono text-sm truncate">{txDetails.from}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">To</span>
                                <p className="font-mono text-sm truncate">{txDetails.to}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Status</span>
                                <p className={`text-sm font-medium ${
                                    txDetails.status === 'Success' ? 'text-green-500' : 'text-red-500'
                                }`}>
                                    {txDetails.status}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Block Number</span>
                                <p className="text-sm">{txDetails.blockNumber}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Gas Used</span>
                                <p className="text-sm">{txDetails.gasUsed}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Timestamp</span>
                                <p className="text-sm">{txDetails.timestamp}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 