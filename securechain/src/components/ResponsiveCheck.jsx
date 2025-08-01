import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const ResponsiveCheck = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check if current route should be protected
  const isProtectedRoute = () => {
    const protectedRoutes = ['/dashboard', '/files', '/profile'];
    return protectedRoutes.some(route => location.pathname.startsWith(route));
  };

  const checkScreenSize = () => {
    const isSmall = window.innerWidth < 1024;
    setIsSmallScreen(isSmall);
    
    if (isSmall && isProtectedRoute()) {
      setShowWarning(true);
      logout(); // Clear auth state
    }
  };

  useEffect(() => {
    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [location.pathname]);

  const handleWarningClose = () => {
    setShowWarning(false);
    navigate('/');
  };

  return (
    <>
      {children}
      
      <Modal
        open={showWarning}
        onCancel={handleWarningClose}
        footer={null}
        centered
        closable={false}
        width={400}
        className="device-warning-modal"
      >
        <div className="text-center py-6">
          <div className="mb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <WarningOutlined className="text-4xl text-yellow-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Security Restriction
          </h3>
          <p className="text-gray-600 mb-6">
            For security purposes, the SecureChain dashboard requires a larger screen size. Please use a device with a wider screen or maximize your browser window.
          </p>
          <div className="text-sm text-gray-500 mb-4">
            <p className="font-medium mb-2">Requirements:</p>
            <ul className="list-none space-y-1">
              <li>✓ Minimum screen width: 1024 pixels</li>
              <li>✓ Desktop or laptop computer</li>
              <li className="text-red-500">✗ Mobile devices</li>
              <li className="text-red-500">✗ Small browser windows</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg mt-4">
            <p className="text-sm text-blue-800">
              <strong>Security Note:</strong> You have been logged out for security purposes. Please access your account from a supported device.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ResponsiveCheck;