import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Button, Drawer, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Lottie from 'lottie-react';
import BitcoinAnimation from '../assets/animations/crypto  bitcoin.json';
import { 
  Share2, 
  Download, 
  History as HistoryIcon, 
  Wallet as WalletIcon, 
  MessageSquareMore, 
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  X,
  Search
} from 'lucide-react';
import StatsCard from '../components/Statscard';
import { ChatWithAI } from '../components/ChatWithAi';
import Wallet from '../components/Wallet';
import Received from '../components/Received';
import History from '../components/History';
import { FileUploadDemo } from '../components/FileUploadDemo';
import { TransactionChecker } from '../components/TransactionChecker';

const { Content, Sider } = Layout;

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileDrawerOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard'
    },
    {
      key: 'share',
      icon: <Share2 size={20} />,
      label: 'Share'
    },
    {
      key: 'received',
      icon: <Download size={20} />,
      label: 'Received'
    },
    {
      key: 'history',
      icon: <HistoryIcon size={20} />,
      label: 'History'
    },
    {
      key: 'wallet',
      icon: <WalletIcon size={20} />,
      label: 'Wallet'
    },
    {
      key: 'chat',
      icon: <MessageSquareMore size={20} />,
      label: 'Chat With AI'
    },
    {
      key: 'check-tx',
      icon: <Search size={20} />,
      label: 'Check Your Tx'
    }
  ];

  const handleMenuClick = (item) => {
    setSelectedMenu(item.key);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderMenu = () => (
    <div className="flex flex-col h-full">
      {!isMobile && (
        <div className={`py-4 px-4 flex items-center ${collapsed ? 'justify-center' : 'justify-start'} border-b border-gray-100`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            {!collapsed && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SecureChain
              </h1>
            )}
          </div>
        </div>
      )}
      <Menu
        mode="inline"
        selectedKeys={[selectedMenu]}
        className="border-r-0 py-4"
        items={menuItems}
        onClick={handleMenuClick}
      />
      <div className="mt-auto border-t border-gray-100">
        <div className={`p-4 flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-6'}`}>
          <Avatar 
            size={40}
            className="bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0"
          >
            {user.username[0].toUpperCase()}
          </Avatar>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="font-medium truncate">{user.username}</div>
              <div className="text-sm text-gray-500 truncate">{user.email}</div>
            </div>
          )}
        </div>
        <Menu
          mode="inline"
          className="border-r-0"
          items={[
            {
              key: 'logout',
              icon: <LogOut size={20} className="text-red-500" />,
              label: 'Logout',
              onClick: handleLogout,
              danger: true
            }
          ]}
        />
      </div>
    </div>
  );

  const mobileNav = (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-lg">SecureChain</span>
          </div>
          <Button 
            type="text"
            className="hover:bg-gray-50 border-none"
            onClick={() => setMobileDrawerOpen(false)}
            icon={<X size={20} />}
          />
        </div>
      }
      closeIcon={null}
      placement="left"
      onClose={() => setMobileDrawerOpen(false)}
      open={mobileDrawerOpen}
      width={280}
      bodyStyle={{ padding: 0 }}
      headerStyle={{ 
        borderBottom: '1px solid #f0f0f0',
        padding: '12px 16px'
      }}
    >
      {renderMenu()}
    </Drawer>
  );

  const getPageTitle = () => {
    const item = menuItems.find(item => item.key === selectedMenu);
    return item ? item.label : '';
  };

  const renderContent = () => {
    switch(selectedMenu) {
      case 'dashboard':
        return (
          <div className="p-6">
            <StatsCard />
            <div className="mt-12 flex justify-center">
              <div className="w-64 h-64">
                <Lottie 
                  animationData={BitcoinAnimation} 
                  loop={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>
        );
      case 'share':
        return (
          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-xl">
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Share Files Securely</h2>
                <FileUploadDemo />
              </div>
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-xl">
              <ChatWithAI />
            </div>
          </div>
        );
      case 'wallet':
        return (
          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-xl">
              <Wallet />
            </div>
          </div>
        );
      case 'received':
        return (
          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-xl">
              <Received />
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-xl">
              <History />
            </div>
          </div>
        );
      case 'check-tx':
        return (
          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-xl">
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Check Transaction Status</h2>
                <TransactionChecker />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="min-h-[calc(100vh-200px)] flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">{menuItems.find(item => item.key === selectedMenu)?.icon}</div>
              <p>Select an option from the menu to get started</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }} className="bg-gray-50">
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
          className="hidden md:block shadow-lg"
          width={280}
          collapsedWidth={80}
        >
          {renderMenu()}
        </Sider>
      )}

      <Layout>
        {isMobile && (
          <Button
            type="text"
            icon={<MenuIcon size={24} />}
            onClick={() => setMobileDrawerOpen(true)}
            className="fixed top-4 left-4 z-50 bg-white shadow-md hover:bg-gray-50 rounded-full w-10 h-10 flex items-center justify-center"
          />
        )}

        <Content 
          style={{ 
            margin: isMobile ? '16px 8px' : '24px 16px',
            padding: isMobile ? 16 : 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280
          }}
          className="overflow-auto shadow-sm border-2 border-black"
        >
          {renderContent()}
        </Content>
      </Layout>

      {isMobile && mobileNav}
    </Layout>
  );
}

export default Dashboard;