import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareMore, Send, Loader2, User } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_CHAT_BOT;

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0">
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500">
        <MessageSquareMore className="h-5 w-5 text-white" />
      </div>
    </div>
    <div className="bg-gray-100 rounded-2xl p-4">
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  </div>
);

export function ChatWithAI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      type: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios({
        method: 'POST',
        url: API_URL,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          question: input.trim()
        }
      });

      const aiMessage = {
        type: 'ai',
        content: response.data.answer || "I'm sorry, I couldn't process that request.",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      let errorContent = 'Sorry, there was an error connecting to the AI service. Please try again.';

      if (error.response && error.response.data && error.response.data.error) {
        errorContent = error.response.data.error;
      }

      const errorMessage = {
        type: 'error',
        content: errorContent,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm">
      {/* Welcome Message */}
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
                <MessageSquareMore className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Welcome to AI Assistant
            </h3>
            <p className="text-gray-600 max-w-md">
              I'm specialized in blockchain, security, cybersecurity, and technology. How can I help you today?
            </p>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 card-scrollbar">
        <div className="max-w-3xl mx-auto space-y-6 pr-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user'
                  ? 'bg-blue-500'
                  : message.type === 'error'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
                  }`}>
                  {message.type === 'user' ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <MessageSquareMore className="h-5 w-5 text-white" />
                  )}
                </div>
              </div>

              <div className={`rounded-2xl p-4 max-w-[80%] ${message.type === 'user'
                ? 'bg-blue-500 text-white'
                : message.type === 'error'
                  ? 'bg-red-50 text-red-600 border border-red-100'
                  : 'bg-gray-100 text-gray-800'
                }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <span className={`text-xs mt-2 block ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))}
          {/* Show typing indicator while loading */}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="p-4">
        <div className="max-w-3xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about blockchain, security, or technology..."
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 