import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import {
  Shield,
  Clock,
  Share2,
  Lock,
  CheckCircle,
  Users,
  Zap,
  ArrowRight,
  Play,
  Upload,
  Eye,
  Settings,
  Menu,
  X,
  TrendingUp,
  Award,
  Layers,
  FileText,
  BarChart3,
  Wallet,
  Cloud,
  Key
} from 'lucide-react';
import technologyAnimation from '../assets/animations/TEchnology.json';

function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100'
        : 'bg-white/90 backdrop-blur-sm shadow-sm'
        }`}>
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="h-9 w-9 text-blue-600 transition-colors duration-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold text-gray-900 transition-colors duration-300">Secure Chain</span>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <button
                className="font-medium text-gray-700 hover:text-blue-600 transition-all duration-300"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>

          <button
            className="lg:hidden text-gray-900 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="container mx-auto px-6 py-4 space-y-4">
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <button className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium">
                  Login
                </button>
                <button
                  onClick={handleGetStarted}
                  className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-center"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          {/* Primary gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-blue-50/60 to-indigo-50/80"></div>

          {/* Animated background shapes */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-r from-indigo-200/25 to-purple-200/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/10 to-indigo-100/10 rounded-full blur-3xl"></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto min-h-[80vh]">

            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">

              {/* Enhanced Trust Badge */}
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-full px-8 py-3 shadow-lg shadow-blue-500/10 backdrop-blur-sm">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-blue-800 tracking-wide">Built on Ethereum Blockchain</span>
              </div>

              {/* Enhanced Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.9] tracking-tight">
                  <span className="block text-gray-900 mb-2">Decentralized</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x">
                    Time-Locked
                  </span>
                  <span className="block text-gray-800 text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mt-2">
                    Security
                  </span>
                </h1>
              </div>

              {/* Enhanced Description */}
              <div className="space-y-4">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                  Experience the future of secure file sharing with blockchain-powered time-lock smart contracts,
                  military-grade AES-256 encryption, and seamless MetaMask integration.
                </p>
                <p className="text-base text-gray-600 leading-relaxed">
                  Your files, your rules, enforced by the blockchain.
                </p>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex flex-col items-center lg:items-start space-y-6">
              {/* Buttons Side by Side */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <button
                  onClick={handleGetStarted}
                  className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 overflow-hidden flex-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="relative z-10 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                <button className="group border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50/50 transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm flex-1">
                  <Play className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>Demo</span>
                </button>
              </div>

              {/* Additional Content Below Buttons */}
              <div className="text-center lg:text-left space-y-3 max-w-md">
                <div className="flex items-center justify-center lg:justify-start space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-blue-500" />
                    <span>Blockchain Secured</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Lock className="h-3 w-3 text-green-500" />
                    <span>AES-256 Encrypted</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Secure Chain leverages Ethereum smart contracts for time-locked file access control.
                  Files are encrypted client-side before storage, ensuring maximum security and privacy.
                </p>
              </div>
            </div>

          </div>
        </div>


      </section>

      {/* How Blockchain Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">

            {/* Left Content */}
            <div className="space-y-8">
              {/* Section Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/60 rounded-full px-6 py-2 shadow-sm">
                <Layers className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800 tracking-wide">BLOCKCHAIN TECHNOLOGY</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  How Blockchain
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                    Powers Security
                  </span>
                </h2>
              </div>

              {/* Description */}
              <div className="space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  Secure Chain leverages Ethereum's decentralized network to create an immutable,
                  trustless system for file access control that no single entity can compromise.
                </p>

                {/* Key Points */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mt-1">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Contract Security</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Time-lock conditions are enforced by Ethereum smart contracts, creating unbreakable rules
                        that automatically execute when predetermined conditions are met.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mt-1">
                      <Lock className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Decentralized Control</h3>
                      <p className="text-gray-600 leading-relaxed">
                        No central authority can override access permissions. The blockchain network
                        validates and enforces all file access requests through consensus.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mt-1">
                      <BarChart3 className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Immutable Audit Trail</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Every file interaction is permanently recorded on the blockchain, creating
                        a transparent and tamper-proof history of all access events.
                      </p>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            {/* Right Side - Technology Lottie Animation */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[500px] aspect-square">
                {/* Lottie Animation Container */}
                <div className="relative w-full h-full bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-indigo-50/30 rounded-3xl flex items-center justify-center overflow-hidden backdrop-blur-sm border border-blue-200/20 shadow-2xl">
                  <Lottie
                    animationData={technologyAnimation}
                    loop={true}
                    autoplay={true}
                    className="w-full h-full object-contain"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      filter: 'drop-shadow(0 10px 30px rgba(59, 130, 246, 0.15))'
                    }}
                  />

                  {/* Subtle decorative elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-purple-400/8 to-indigo-400/8 rounded-full blur-xl animate-pulse delay-700"></div>
                  <div className="absolute top-1/4 -left-2 w-12 h-12 bg-gradient-to-r from-indigo-400/10 to-blue-400/10 rounded-full blur-lg animate-pulse delay-1000"></div>
                  <div className="absolute bottom-1/4 -right-2 w-16 h-16 bg-gradient-to-r from-purple-400/8 to-pink-400/8 rounded-full blur-lg animate-pulse delay-500"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 rounded-full px-4 py-2 mb-6">
              <Layers className="h-4 w-4" />
              <span className="text-sm font-semibold">BLOCKCHAIN POWERED</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Secure Chain?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Built on Ethereum blockchain technology, Secure Chain combines smart contracts,
              advanced encryption, and decentralized identity to revolutionize secure file sharing.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Lock,
                title: 'AES-256 Encryption',
                description: 'Client-side encryption ensures your files are secured with military-grade AES-256 encryption before they leave your device. Even if storage is breached, your data remains protected.',
                gradient: 'from-blue-500 to-blue-600'
              },
              {
                icon: Clock,
                title: 'Time-Lock Smart Contracts',
                description: 'Ethereum-based smart contracts control file access with precise time-based permissions. Files automatically become accessible only when the specified time conditions are met.',
                gradient: 'from-purple-500 to-purple-600'
              },
              {
                icon: Wallet,
                title: 'MetaMask Integration',
                description: 'Seamless integration with MetaMask for secure blockchain identity verification. Your Ethereum wallet acts as your decentralized identity for accessing shared files.',
                gradient: 'from-orange-500 to-orange-600'
              },
              {
                icon: Cloud,
                title: 'Secure Cloud Storage',
                description: 'Encrypted files are securely stored on Cloudinary or IPFS, with access controlled by smart contracts. Your data is distributed and protected across reliable cloud infrastructure.',
                gradient: 'from-green-500 to-green-600'
              },
              {
                icon: Shield,
                title: 'Zero-Trust Architecture',
                description: 'No central authority can override access rules. Smart contracts enforce permissions independently, ensuring complete control remains with file owners.',
                gradient: 'from-red-500 to-red-600'
              },
              {
                icon: BarChart3,
                title: 'Blockchain Audit Logs',
                description: 'Every file access and permission change is recorded on the blockchain, creating an immutable audit trail for compliance and security verification.',
                gradient: 'from-indigo-500 to-indigo-600'
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-black/10 hover:border-black/20 h-full relative overflow-hidden">
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`bg-gradient-to-r ${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border-2 border-black/5`}>
                      <feature.icon className="h-8 w-8 text-white drop-shadow-sm" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-purple-100/15 to-indigo-100/15 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden" id="how-it-works">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-200/15 to-indigo-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-full px-6 py-3 mb-8 shadow-lg backdrop-blur-sm border border-purple-200/50">
              <Settings className="h-5 w-5" />
              <span className="text-sm font-bold tracking-wide">WORKFLOW PROCESS</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              How Secure Chain
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
                Works for You
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Experience seamless blockchain-secured file sharing in three intuitive steps.
              From upload to access, every action is protected by smart contracts.
            </p>
          </div>

          {/* Enhanced Workflow Steps */}
          <div className="max-w-7xl mx-auto">
            {/* Step 1 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
              <div className="order-2 lg:order-1">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-2 border-purple-200/30 relative overflow-hidden">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl transform rotate-12 border-2 border-gray-200">
                    <span className="text-black font-bold text-xl">01</span>
                  </div>

                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30"></div>

                  {/* Content */}
                  <div className="relative z-10 pt-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Connect & Upload</h3>
                        <p className="text-purple-600 font-semibold">MetaMask Integration</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        Start by connecting your MetaMask wallet to establish your blockchain identity.
                        Upload your files through our secure interface.
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>MetaMask Connection</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Secure File Upload</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Client-side Encryption</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>AES-256 Protection</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative">
                  <div className="w-80 h-80 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-blue-300/50">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <Wallet className="h-12 w-12 text-white" />
                      </div>
                      <p className="text-lg font-semibold text-gray-800">MetaMask Wallet</p>
                      <p className="text-gray-600">Secure Connection</p>
                    </div>
                  </div>
                  {/* Connecting Arrow */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <ArrowRight className="h-8 w-8 text-purple-400 rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-80 h-80 bg-gradient-to-br from-purple-100 via-pink-100 to-purple-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-purple-300/50">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <Clock className="h-12 w-12 text-white" />
                      </div>
                      <p className="text-lg font-semibold text-gray-800">Smart Contract</p>
                      <p className="text-gray-600">Time-Lock Setup</p>
                    </div>
                  </div>
                  {/* Connecting Arrow */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 hidden lg:block">
                    <div className="flex flex-col items-center">
                      <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-green-400"></div>
                      <ArrowRight className="h-6 w-6 text-green-500 rotate-90 bg-white rounded-full p-1 shadow-lg border border-green-200" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-2 border-purple-200/30 relative overflow-hidden">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl transform rotate-12 border-2 border-gray-200">
                    <span className="text-black font-bold text-xl">02</span>
                  </div>

                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/30"></div>

                  {/* Content */}
                  <div className="relative z-10 pt-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Clock className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Configure Time-Lock</h3>
                        <p className="text-purple-600 font-semibold">Smart Contract Setup</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        Set up your smart contract parameters including recipient addresses,
                        time-lock duration, and access conditions. The blockchain enforces these rules automatically.
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Recipient Addresses</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Time-Lock Duration</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Access Conditions</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Blockchain Deployment</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-2 border-green-200/30 relative overflow-hidden">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl transform rotate-12 border-2 border-gray-200">
                    <span className="text-black font-bold text-xl">03</span>
                  </div>

                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-white to-teal-50/30"></div>

                  {/* Content */}
                  <div className="relative z-10 pt-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Key className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Secure Access</h3>
                        <p className="text-green-600 font-semibold">Time-Based Unlock</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        Recipients can access files only after the time-lock expires by connecting their MetaMask wallet.
                        All access attempts are recorded on the blockchain for complete transparency.
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Automatic Unlock</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Wallet Verification</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Blockchain Audit</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Secure Download</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative">
                  <div className="w-80 h-80 bg-gradient-to-br from-green-100 via-teal-100 to-green-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-green-300/50">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <Shield className="h-12 w-12 text-white" />
                      </div>
                      <p className="text-lg font-semibold text-gray-800">Secure Access</p>
                      <p className="text-gray-600">File Unlocked</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-blue-200/30 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
              <p className="text-gray-600 mb-6">Experience the future of secure file sharing with blockchain technology.</p>
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PlayStation Symbols Animation Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden" id="playstation">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gray-200/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gray-300/15 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          {/* PlayStation Symbols Animation */}
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="relative w-96 h-96">

              {/* Triangle Symbol */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>
                <div className="w-0 h-0 border-l-[28px] border-r-[28px] border-b-[48px] border-l-transparent border-r-transparent border-b-gray-700 shadow-xl"></div>
              </div>

              {/* Square Symbol */}
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2s' }}>
                <div className="w-14 h-14 bg-gray-700 shadow-xl"></div>
              </div>

              {/* Circle Symbol */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-bounce" style={{ animationDelay: '1s', animationDuration: '2s' }}>
                <div className="w-14 h-14 border-[5px] border-gray-700 rounded-full shadow-xl"></div>
              </div>

              {/* Cross Symbol */}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2s' }}>
                <div className="relative w-14 h-14">
                  <div className="absolute top-1/2 left-0 w-14 h-1.5 bg-gray-700 transform -translate-y-1/2 shadow-xl"></div>
                  <div className="absolute top-0 left-1/2 w-1.5 h-14 bg-gray-700 transform -translate-x-1/2 shadow-xl"></div>
                </div>
              </div>

              {/* Connecting Lines Between Symbols */}
              {/* Triangle to Square */}
              <div className="absolute top-1/4 right-1/4 w-32 h-0.5 bg-gray-400/60 transform rotate-45 origin-left"></div>

              {/* Square to Circle */}
              <div className="absolute bottom-1/4 right-1/4 w-32 h-0.5 bg-gray-400/60 transform -rotate-45 origin-left"></div>

              {/* Circle to Cross */}
              <div className="absolute bottom-1/4 left-1/4 w-32 h-0.5 bg-gray-400/60 transform rotate-45 origin-right"></div>

              {/* Cross to Triangle */}
              <div className="absolute top-1/4 left-1/4 w-32 h-0.5 bg-gray-400/60 transform -rotate-45 origin-right"></div>

              {/* Pulsing Center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-600 rounded-full animate-pulse"></div>

            </div>
          </div>

          {/* Optional Text Below Animation */}
          <div className="mt-12">
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Secure Chain - Where Innovation Meets Security
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;