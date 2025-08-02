// lib/blockchain.js
import { ethers } from "ethers";

// ✅ Your deployed contract address
const CONTRACT_ADDRESS = import.meta.env.VITE_BLOCKCHAIN_ADDRESS;

// ✅ ABI (for uploadFile)
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "bytes32", "name": "fileId", "type": "bytes32" },
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "string", "name": "fileUrl", "type": "string" },
      { "internalType": "string", "name": "fileName", "type": "string" },
      { "internalType": "uint256", "name": "unlockTime", "type": "uint256" }
    ],
    "name": "uploadFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// 🔌 Connect to contract
export const connectToContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  return contract;
};

// ⛓️ Record file on-chain
export const recordFileOnBlockchain = async ({ fileUrl, fileName, recipient, unlockTime }) => {
  try {
    const contract = await connectToContract();

    const fileId = ethers.keccak256(ethers.toUtf8Bytes(fileUrl));
    const unlockTimestamp = Math.floor(new Date(unlockTime).getTime() / 1000); // to seconds

    const tx = await contract.uploadFile(fileId, recipient, fileUrl, fileName, unlockTimestamp);
    await tx.wait();

    return { success: true, txHash: tx.hash };
  } catch (err) {
    console.error("Blockchain error:", err);
    return { success: false, error: err.message };
  }
};
