import React, { useState, useEffect } from 'react';
import '../styles/AIAssistant.css';

interface AIAssistantProps {
  organizationId: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ organizationId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Hello! I\'m ShopMate AI. I\'m here to help you stay organized and productive. How can I assist you today?' }
  ]);
  const [currentMood, setCurrentMood] = useState<'happy' | 'thinking' | 'supportive'>('happy');
  const [isListening, setIsListening] = useState(false);

  const moods = {
    happy: '😊',
    thinking: '🤔',
    supportive: '🤝'
  };

  const handleSendMessage = (text: string) => {
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setCurrentMood('thinking');

    // Simulate AI response
    setTimeout(() => {
      const response = 'Great question! I\'m analyzing your request and will provide helpful insights.';
      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
      setCurrentMood('happy');
    }, 1000);
  };

  const handlePlayMusic = () => {
    setIsListening(true);
    handleSendMessage('🎵 Playing ambient music...');
    setTimeout(() => setIsListening(false), 2000);
  };

  const handleDailyBrief = () => {
    handleSendMessage('📊 Generating daily brief...');
  };

  return (
    <div className="ai-assistant">
      <div className={`ai-avatar ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <div className="mood">{moods[currentMood]}</div>
        <div className="pulse"></div>
      </div>

      {isOpen && (
        <div className="ai-panel">
          <div className="panel-header">
            <h3>ShopMate AI Assistant</h3>
            <button className="close" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="quick-actions">
            <button onClick={handleDailyBrief} className="action-btn">📊 Brief</button>
            <button onClick={handlePlayMusic} className={`action-btn ${isListening ? 'playing' : ''}`}>
              🎵 Music
            </button>
            <button onClick={() => handleSendMessage('Help!')} className="action-btn">❓ Help</button>
          </div>

          <div className="input-area">
            <input
              type="text"
              placeholder="Ask me anything..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                  handleSendMessage((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
