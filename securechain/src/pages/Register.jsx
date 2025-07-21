import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, message, Modal } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, WalletOutlined, StarFilled, SafetyOutlined, EyeInvisibleOutlined, EyeTwoTone, RightOutlined, CheckCircleOutlined, InfoCircleOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validatedFields, setValidatedFields] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showContent, setShowContent] = useState(false);

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

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // First validate all fields at once
      await form.validateFields();

      // Get all form values
      const formValues = form.getFieldsValue();

      // Prepare the data for submission
      const submitData = {
        username: formValues.username?.trim(),
        email: formValues.email?.trim(),
        password: formValues.password,
        walletAddress: formValues.walletAddress?.trim()
      };

      console.log('Submitting data:', submitData); // Debug log

      // Make the API call
      const response = await axios.post('http://localhost:5050/api/auth/register', submitData);

      if (response.data) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

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

          {/* Left Side - SecureChain Branding */}
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
                  Join Us and Unlock Decentralized Security!
                </h1>
                <p className="text-base text-blue-100 leading-relaxed">
                  Welcome to SecureChain, where your blockchain journey begins. Sign up
                  now to access time-locked file sharing, military-grade encryption,
                  and seamless MetaMask integration.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-blue-100 text-sm">AES-256 Military-Grade Encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-blue-100 text-sm">Ethereum Smart Contract Integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-blue-100 text-sm">Time-Locked File Access Control</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-blue-100 text-sm">Decentralized Cloud Storage</span>
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
                "SecureChain revolutionized how we handle sensitive data. The blockchain
                integration gives us complete control over file access."
              </blockquote>
              <div className="flex items-center">
                {/* <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">A</span>
                </div> */}
                {/* <div>
                  <div className="font-semibold text-sm">Alex Chen</div>
                  <div className="text-blue-200 text-xs">CTO, BlockTech Solutions</div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="p-6 flex flex-col justify-center overflow-hidden">
            <div className="max-w-md mx-auto w-full">

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Sign up to <span className="text-blue-600">SecureChain</span>
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
                onFinish={handleSubmit}
                className="space-y-4"
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
                          autoComplete="new-password"
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
                          autoComplete={steps[currentStep].inputType === 'password' ? 'new-password' : 'off'}
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
                    {currentStep === steps.length - 1 ? 'Create Account' : 'Next'}
                  </Button>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Already a member?{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                    >
                      Log in here
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
                    {showContent ? 'Hide Platform Info' : 'Know More About SecureChain'}
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
                        Join Us and Unlock Decentralized Security!
                      </h3>
                      <p className="text-sm text-blue-100 leading-relaxed">
                        Welcome to SecureChain, where your blockchain journey begins. Sign up
                        now to access time-locked file sharing and military-grade encryption.
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 mb-4">
                      {[
                        { icon: '🔐', text: 'AES-256 Military-Grade Encryption' },
                        { icon: '⚡', text: 'Ethereum Smart Contract Integration' },
                        { icon: '⏰', text: 'Time-Locked File Access Control' },
                        { icon: '☁️', text: 'Decentralized Cloud Storage' },
                        { icon: '🛡️', text: 'MetaMask Integration Support' }
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
                        "SecureChain revolutionized how we handle sensitive data. The blockchain
                        integration gives us complete control over file access."
                      </blockquote>
                      <div className="flex items-center">
                        {/* <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-2">
                          <span className="text-white font-bold text-xs">A</span>
                        </div> */}
                        {/* <div>
                          <div className="font-semibold text-xs">Alex Chen</div>
                          <div className="text-blue-200 text-xs">CTO, BlockTech Solutions</div>
                        </div> */}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
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
            Account Created Successfully!
          </h3>
          <p className="text-gray-600 mb-6">
            Welcome to SecureChain! Your account has been created and you can now log in to start using our secure blockchain platform.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={handleSuccessModalClose}
            className="px-8 py-2 h-12 rounded-lg bg-blue-600 hover:bg-blue-700 border-0 font-semibold"
          >
            Continue to Login
          </Button>
        </div>
      </Modal>
    </div>
  );
};

// Steps configuration
const steps = [
  {
    title: 'Username',
    field: 'username',
    icon: <UserOutlined className="text-gray-400" />,
    placeholder: 'Enter your username',
    description: 'Choose a unique username for your account',
    rules: [
      { required: true, message: 'Username is required' },
      { min: 3, message: 'Username must be at least 3 characters' },
      { whitespace: true, message: 'Username cannot be empty spaces' }
    ]
  },
  {
    title: 'Email Address',
    field: 'email',
    icon: <MailOutlined className="text-gray-400" />,
    placeholder: 'Enter your email address',
    description: 'Enter your email address for account verification',
    rules: [
      { required: true, message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email' },
      { whitespace: true, message: 'Email cannot be empty spaces' }
    ]
  },
  {
    title: 'Create a Password',
    field: 'password',
    icon: <LockOutlined className="text-gray-400" />,
    placeholder: 'Create a password',
    description: 'Create a strong password with at least 6 characters',
    inputType: 'password',
    rules: [
      { required: true, message: 'Password is required' },
      { min: 6, message: 'Password must be at least 6 characters' },
      { whitespace: true, message: 'Password cannot be empty spaces' }
    ]
  },
  {
    title: 'Confirm Your Password',
    field: 'confirmPassword',
    icon: <LockOutlined className="text-gray-400" />,
    placeholder: 'Confirm your password',
    description: 'Re-enter your password to confirm',
    inputType: 'password',
    rules: [
      { required: true, message: 'Please confirm your password' },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error('Passwords do not match'));
        },
      })
    ]
  },
  {
    title: 'Wallet Address',
    field: 'walletAddress',
    icon: <WalletOutlined className="text-gray-400" />,
    placeholder: 'Enter your Ethereum wallet address (0x...)',
    description: 'Enter your Ethereum wallet address for blockchain transactions',
    rules: [
      { required: true, message: 'Wallet address is required' },
      { whitespace: true, message: 'Wallet address cannot be empty spaces' },
      {
        validator: (_, value) => {
          if (!value) return Promise.resolve();

          // Remove whitespace and convert to lowercase for validation
          const cleanAddress = value.trim();

          // Check if it starts with 0x
          if (!cleanAddress.startsWith('0x')) {
            return Promise.reject(new Error('Ethereum address must start with 0x'));
          }

          // Check if it has exactly 42 characters (0x + 40 hex chars)
          if (cleanAddress.length !== 42) {
            return Promise.reject(new Error('Ethereum address must be exactly 42 characters long'));
          }

          // Check if it contains only valid hexadecimal characters
          const hexPattern = /^0x[a-fA-F0-9]{40}$/;
          if (!hexPattern.test(cleanAddress)) {
            return Promise.reject(new Error('Ethereum address contains invalid characters. Use only 0-9, a-f, A-F'));
          }

          // Additional check for common mistakes
          if (cleanAddress === '0x0000000000000000000000000000000000000000') {
            return Promise.reject(new Error('Please enter a valid wallet address, not the zero address'));
          }

          return Promise.resolve();
        }
      }
    ]
  }
];

export default Register;