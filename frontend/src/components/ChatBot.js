import React, { useState } from 'react';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { content: 'Hey there! 🍕 I\'m Pizzabot. How can I help you today?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    setMessages(msgs => [...msgs, { content: text, sender: 'user' }]);
    setInputValue('');
    
    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const { content } = await res.json();
      setMessages(msgs => [...msgs, { content, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(msgs => [...msgs, { content: 'Sorry, I encountered an error. Please try again.', sender: 'bot' }]);
    }
  };

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-orange-500/80 text-white py-3 px-6 rounded-full shadow-lg hover:bg-orange-600/85 transition-colors z-50"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white/30 backdrop-blur-md border border-white/40 rounded-lg shadow-lg z-50 flex flex-col">
          {/* Header */}
          <div className="bg-orange-500/75 backdrop-blur-md text-white p-3 rounded-t-lg flex justify-between items-center border-b border-white/30">
            <h3 className="font-bold">Chat with Pizzabot</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={`mb-2 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-2 rounded-lg max-w-xs shadow-md backdrop-blur-md ${
                  m.sender === 'user' 
                    ? 'bg-blue-500/80 text-white' 
                    : 'bg-white/50 text-gray-800 border border-white/30'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          
          {/* Input */}
          <div className="p-3 border-t border-white/30 bg-white/20 backdrop-blur-md rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-white/30 rounded-md bg-white/30 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500 text-gray-800 shadow-sm"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-orange-500/75 text-white rounded-md hover:bg-orange-600 transition-colors shadow-md backdrop-blur-md border border-white/30"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}