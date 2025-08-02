import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, message, Modal } from 'antd';
import { MailOutlined, LockOutlined, StarFilled, SafetyOutlined, EyeInvisibleOutlined, EyeTwoTone, RightOutlined, CheckCircleOutlined, InfoCircleOutlined, UpOutlined, DownOutlined, ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { defaultGuest } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, user, isGuest } = useAuth();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validatedFields, setValidatedFields] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isGuest) {
      navigate('/dashboard');
    }
  }, [isGuest, navigate]);

  const handleNext = async () => {
    try {
      // Validate current field
      const currentField = steps[currentStep].field;
      await form.validateFields([currentField]);

      // Mark field as validated
      setValidatedFields(prev => ({
        ...prev,
        [currentField]: true
      }));

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Validation failed:', error);
      // Remove validation status if validation fails
      setValidatedFields(prev => ({
        ...prev,
        [steps[currentStep].field]: false
      }));
    }
  };

  // Handle field validation status
  const handleFieldValidation = async (fieldName, value) => {
    try {
      await form.validateFields([fieldName]);
      setValidatedFields(prev => ({
        ...prev,
        [fieldName]: true
      }));
    } catch (error) {
      setValidatedFields(prev => ({
        ...prev,
        [fieldName]: false
      }));
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState({ title: '', message: '' });

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Show loading message
      const loadingMessage = message.loading({
        content: 'Signing in...',
        duration: 0,
        style: {
          marginTop: '20vh',
        },
      });

      try {
        // Validate all fields
        await form.validateFields();

        // Get form values
        const formValues = form.getFieldsValue();

        // Prepare data for submission
        const submitData = {
          email: formValues.email?.trim(),
          password: formValues.password,
        };

        // Make API call to login endpoint
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, submitData);

        if (response.data) {
          const { token, user } = response.data;

          // Clear loading message
          loadingMessage();

          // Show success message
          message.success({
            content: 'Successfully signed in!',
            duration: 3,
            style: {
              marginTop: '20vh',
            },
          });

          // Store token
          localStorage.setItem('token', token);

          // Update user context with isGuest flag
          const updatedUser = { ...user, isGuest: false };
          setUser(updatedUser);

          setShowSuccessModal(true);
        }
      } catch (error) {
        // Clear loading message
        loadingMessage();

        let errorTitle = 'Login Failed';
        let errorMessage = 'An unexpected error occurred. Please try again.';

        // Handle different error types
        if (error.response?.data) {
          const { message: serverMessage, type } = error.response.data;

          switch (type) {
            case 'VALIDATION_ERROR':
              errorTitle = 'Invalid Input';
              errorMessage = serverMessage;
              break;
            case 'AUTH_ERROR':
              errorTitle = 'Authentication Failed';
              errorMessage = serverMessage;
              break;
            case 'DEVICE_RESTRICTION':
              errorTitle = 'Security Restriction';
              errorMessage = serverMessage;
              // Clear any stored auth data for security
              localStorage.removeItem('token');
              setUser(defaultGuest); // Use the default guest user
              setShowDeviceWarningModal(true);
              return; // Exit early to show device warning instead
            case 'SERVER_ERROR':
              errorTitle = 'Server Error';
              errorMessage = 'An error occurred on our servers. Please try again later.';
              break;
            default:
              if (serverMessage) {
                errorMessage = serverMessage;
              }
          }
        } else if (error.response?.status === 403) {
          errorTitle = 'Access Denied';
          errorMessage = 'This device is not authorized to access the dashboard for security reasons.';
          localStorage.removeItem('token');
          setUser(defaultGuest);
          setShowDeviceWarningModal(true);
          return;
        } else if (error.message) {
          errorMessage = error.message;
        }

        // Set error details and show modal
        setErrorDetails({
          title: errorTitle,
          message: errorMessage
        });
        setShowErrorModal(true);

        console.error('Login error:', error);
      }
    } catch (validationError) {
      // Show validation error in modal
      setErrorDetails({
        title: 'Form Validation Error',
        message: 'Please check your input and try again. Make sure all required fields are filled correctly.'
      });
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const [showDeviceWarningModal, setShowDeviceWarningModal] = useState(false);

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  // Handle device restriction response
  useEffect(() => {
    const handleDeviceRestriction = (error) => {
      if (error?.response?.data?.type === 'DEVICE_RESTRICTION') {
        setShowDeviceWarningModal(true);
        // Clear any stored auth data
        localStorage.removeItem('token');
        setUser(null);
      }
    };

    // Add axios response interceptor
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        handleDeviceRestriction(error);
        return Promise.reject(error);
      }
    );

    return () => {
      // Remove interceptor on cleanup
      axios.interceptors.response.eject(interceptor);
    };
  }, [setUser]);

  const handleStepAction = async () => {
    if (currentStep === steps.length - 1) {
      await handleSubmit();
    } else {
      await handleNext();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[350px]">

          {/* Left Side - Login Form */}
          <div className="p-6 flex flex-col justify-center overflow-hidden">
            <div className="max-w-md mx-auto w-full">

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Sign in to <span className="text-blue-600">SecureChain</span>
                </h2>
              </div>

              {/* Custom Steps Progress */}
              <div className="mb-6 relative">
                <div className="flex items-center justify-between">
                  {/* Current Step Info */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-semibold">
                      {currentStep + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Step {currentStep + 1} of {steps.length}
                      </div>
                      <div className="text-xs text-gray-500">
                        {steps[currentStep].title}
                      </div>
                    </div>
                  </div>

                  {/* Remaining Steps Indicator */}
                  {currentStep < steps.length - 1 && (
                    <div className="flex items-center space-x-1 text-gray-400">
                      <span className="text-xs">
                        {steps.length - currentStep - 1} more
                      </span>
                      <RightOutlined className="text-xs" />
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Form */}
              <Form
                form={form}
                layout="vertical"
                onFinish={(e) => e.preventDefault()}
                className="space-y-4"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleStepAction();
                  }
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[120px] flex flex-col justify-center"
                  >
                    {/* Hidden form items to maintain values */}
                    {steps.map((step, index) => (
                      index !== currentStep && (
                        <Form.Item
                          key={step.field}
                          name={step.field}
                          style={{ display: 'none' }}
                          rules={step.rules}
                        >
                          <Input type={step.inputType || 'text'} />
                        </Form.Item>
                      )
                    ))}

                    {/* Current step form item */}
                    <Form.Item
                      label={steps[currentStep].title}
                      name={steps[currentStep].field}
                      rules={steps[currentStep].rules}
                      className="mb-6"
                      validateTrigger={['onChange', 'onBlur']}
                    >
                      {steps[currentStep].inputType === 'password' ? (
                        <Input.Password
                          prefix={steps[currentStep].icon}
                          suffix={validatedFields[steps[currentStep].field] && (
                            <CheckCircleOutlined className="text-green-500" />
                          )}
                          placeholder={steps[currentStep].placeholder}
                          size="large"
                          className={`rounded-lg py-3 text-base border-gray-300 focus:border-blue-500 ${validatedFields[steps[currentStep].field] ? 'border-green-500' : ''
                            }`}
                          autoComplete="current-password"
                          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                          onChange={(e) => handleFieldValidation(steps[currentStep].field, e.target.value)}
                        />
                      ) : (
                        <Input
                          prefix={steps[currentStep].icon}
                          suffix={validatedFields[steps[currentStep].field] && (
                            <CheckCircleOutlined className="text-green-500" />
                          )}
                          placeholder={steps[currentStep].placeholder}
                          type={steps[currentStep].inputType || 'text'}
                          size="large"
                          className={`rounded-lg py-3 text-base border-gray-300 focus:border-blue-500 ${validatedFields[steps[currentStep].field] ? 'border-green-500' : ''
                            }`}
                          autoComplete={steps[currentStep].inputType === 'password' ? 'current-password' : 'off'}
                          onChange={(e) => handleFieldValidation(steps[currentStep].field, e.target.value)}
                        />
                      )}
                    </Form.Item>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mb-4">
                  {currentStep > 0 && (
                    <Button
                      onClick={handleBack}
                      size="large"
                      className="px-6 py-2 h-10 rounded-lg border-gray-300"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="primary"
                    onClick={handleStepAction}
                    loading={loading}
                    size="large"
                    className={`px-6 py-2 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 border-0 font-semibold ${!currentStep && 'ml-auto'}`}
                  >
                    {currentStep === steps.length - 1 ? 'Sign In' : 'Next'}
                  </Button>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Don't have an account?{' '}
                    <button
                      onClick={() => navigate('/register')}
                      className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                    >
                      Create an account
                    </button>
                  </p>
                </div>

                {/* Home Button */}
                <div className="text-center mt-4">
                  <button
                    onClick={() => navigate('/')}
                    className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors duration-200 cursor-pointer"
                  >
                    ← Back to Home
                  </button>
                </div>

              </Form>
            </div>
          </div>

          {/* Mobile Security Info Toggle */}
          <div className="lg:hidden">
            <motion.div
              initial={false}
              animate={{ height: showContent ? 'auto' : '60px' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-16 h-16 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-12 h-12 border-2 border-white rounded-full"></div>
                <div className="absolute top-1/2 right-1/4 w-8 h-8 border-2 border-white rounded-full"></div>
              </div>

              {/* Toggle Button */}
              <motion.button
                onClick={() => setShowContent(!showContent)}
                className="w-full p-4 flex items-center justify-between text-white hover:bg-white/10 transition-colors duration-200 relative z-10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <InfoCircleOutlined className="text-xl" />
                  <span className="font-semibold">
                    {showContent ? 'Hide Security Info' : 'Know More About Security'}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: showContent ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <DownOutlined className="text-sm" />
                </motion.div>
              </motion.button>

              {/* Animated Content */}
              <AnimatePresence>
                {showContent && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="px-4 pb-6 relative z-10"
                  >
                    {/* Logo and Title */}
                    <div className="mb-4">
                      <div className="flex items-center mb-3">
                        <SafetyOutlined className="text-2xl mr-2" />
                        <span className="text-lg font-bold">SecureChain</span>
                      </div>
                      <h3 className="text-xl font-bold leading-tight mb-2">
                        Your Fortress of Digital Security Awaits!
                      </h3>
                      <p className="text-sm text-blue-100 leading-relaxed">
                        Enter your secure vault protected by quantum-resistant encryption,
                        blockchain immutability, and zero-knowledge architecture.
                      </p>
                    </div>

                    {/* Security Features List */}
                    <div className="space-y-2 mb-4">
                      {[
                        { icon: '🔐', text: 'End-to-End AES-256 Encryption' },
                        { icon: '⏰', text: 'Smart Contract Time-Lock Protection' },
                        { icon: '🛡️', text: 'Zero-Knowledge Authentication' },
                        { icon: '⚡', text: 'Immutable Blockchain Audit Trail' },
                        { icon: '🔒', text: 'Multi-Signature Wallet Security' }
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{feature.icon}</span>
                          </div>
                          <span className="text-blue-100 text-sm font-medium">{feature.text}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Testimonial */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      className="border-t border-white/20 pt-4"
                    >
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <StarFilled key={i} className="text-yellow-400 text-xs" />
                        ))}
                      </div>
                      <blockquote className="text-xs mb-2 italic text-blue-100">
                        "SecureChain's login experience is seamless and secure. I trust it completely
                        with my most sensitive blockchain transactions."
                      </blockquote>
                      <div className="flex items-center">
                        {/* <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-2">
                          <span className="text-white font-bold text-xs">M</span>
                        </div>
                        <div>
                          <div className="font-semibold text-xs">Maria Rodriguez</div>
                          <div className="text-blue-200 text-xs">Security Engineer, CryptoTech</div>
                        </div> */}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Side - SecureChain Branding */}
          <div className="hidden lg:flex bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 flex-col justify-between text-white relative overflow-hidden">

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-32 right-20 w-24 h-24 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
            </div>

            <div className="relative z-10">
              {/* Logo and Title */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <SafetyOutlined className="text-3xl mr-3" />
                  <span className="text-xl font-bold">SecureChain</span>
                </div>
                <h1 className="text-3xl font-bold leading-tight mb-4">
                  Your Fortress of Digital Security Awaits!
                </h1>
                <p className="text-base text-blue-100 leading-relaxed">
                  Enter your secure vault protected by quantum-resistant encryption,
                  blockchain immutability, and zero-knowledge architecture. Your data
                  remains private, even from us.
                </p>
              </div>

              {/* Security Features List */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🔐</span>
                  </div>
                  <span className="text-blue-100 text-sm font-medium">End-to-End AES-256 Encryption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">⏰</span>
                  </div>
                  <span className="text-blue-100 text-sm font-medium">Smart Contract Time-Lock Protection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🛡️</span>
                  </div>
                  <span className="text-blue-100 text-sm font-medium">Zero-Knowledge Authentication</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">⚡</span>
                  </div>
                  <span className="text-blue-100 text-sm font-medium">Immutable Blockchain Audit Trail</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🔒</span>
                  </div>
                  <span className="text-blue-100 text-sm font-medium">Multi-Signature Wallet Security</span>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="relative z-10">
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarFilled key={i} className="text-yellow-400 text-sm" />
                ))}
              </div>
              <blockquote className="text-sm mb-3 italic">
                "SecureChain's login experience is seamless and secure. I trust it completely
                with my most sensitive blockchain transactions and file storage."
              </blockquote>
              <div className="flex items-center">
                {/* <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">M</span>
                </div> */}
                {/* <div>
                  <div className="font-semibold text-sm">Maria Rodriguez</div>
                  <div className="text-blue-200 text-xs">Security Engineer, CryptoTech</div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        open={showSuccessModal}
        onCancel={handleSuccessModalClose}
        footer={null}
        centered
        closable={false}
        width={400}
        className="success-modal"
      >
        <div className="text-center py-6">
          <div className="mb-4">
            <CheckCircleOutlined className="text-6xl text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h3>
          <p className="text-gray-600 mb-6">
            You have successfully signed in to SecureChain. Access your secure files and blockchain features now.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={handleSuccessModalClose}
            className="px-8 py-2 h-12 rounded-lg bg-blue-600 hover:bg-blue-700 border-0 font-semibold"
          >
            Go to Dashboard
          </Button>
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal
        open={showErrorModal}
        onCancel={() => setShowErrorModal(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setShowErrorModal(false)}
            className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 border-0 font-semibold"
          >
            Try Again
          </Button>
        ]}
        centered
        width={400}
        className="error-modal"
      >
        <div className="text-center py-6">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <ExclamationCircleOutlined className="text-4xl text-red-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {errorDetails.title}
          </h3>
          <p className="text-gray-600 mb-6">
            {errorDetails.message}
          </p>
        </div>
      </Modal>

      {/* Device Warning Modal */}
      <Modal
        open={showDeviceWarningModal}
        onCancel={() => {
          setShowDeviceWarningModal(false);
          navigate('/');
        }}
        footer={[
          <Button
            key="back"
            type="primary"
            onClick={() => {
              setShowDeviceWarningModal(false);
              navigate('/');
            }}
            className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 border-0 font-semibold"
          >
            Return to Home
          </Button>
        ]}
        centered
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
            For enhanced security and data protection, the SecureChain dashboard is only accessible from desktop or laptop computers. Mobile devices and tablets are not supported due to security protocols.
          </p>
          <div className="text-sm text-gray-500 mb-4">
            <p className="font-medium mb-3">Why this restriction?</p>
            <ul className="list-none space-y-2">
              <li>🔒 Enhanced Security Controls</li>
              <li>🛡️ Advanced Encryption Features</li>
              <li>⚡ Secure File Processing</li>
              <li>🔐 Hardware Security Requirements</li>
            </ul>
            <div className="mt-4">
              <p className="font-medium mb-2">Device Support:</p>
              <div className="space-y-1">
                <p className="text-green-600">✓ Desktop Computers</p>
                <p className="text-green-600">✓ Laptop Computers</p>
                <p className="text-red-500 mt-2">✗ Mobile Phones</p>
                <p className="text-red-500">✗ Tablets</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg mt-4">
            <p className="text-sm text-blue-800">
              <strong>Security Note:</strong> For the safety of your blockchain assets and encrypted files, please access your account from a desktop or laptop computer.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Steps configuration
const steps = [
  {
    title: 'Email',
    field: 'email',
    icon: <MailOutlined />,
    placeholder: 'Enter your email',
    description: 'Enter your registered email address',
    rules: [
      { required: true, message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email' },
      { whitespace: true, message: 'Email cannot be empty spaces' }
    ]
  },
  {
    title: 'Password',
    field: 'password',
    icon: <LockOutlined />,
    placeholder: 'Enter your password',
    description: 'Enter your password to sign in',
    inputType: 'password',
    rules: [
      { required: true, message: 'Password is required' },
      { whitespace: true, message: 'Password cannot be empty spaces' }
    ]
  }
];

export default Login;