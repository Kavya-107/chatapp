import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3000'); // backend URL

function App() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const endRef = useRef(null);

  useEffect(() => {
    socket.on('chat message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off('chat message');
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinChat = () => {
    if (username.trim() !== '') setJoined(true);
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('chat message', { user: username, text: message });
      setMessage('');
    }
  };

  return (
    <div className="chatContainer">
      <h2>Public Group Chat</h2>
      {!joined ? (
        <div id="nameSection">
          <input
            id="username"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={joinChat}>Join</button>
        </div>
      ) : (
        <div id="chatSection">
          <div id="messages">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <strong>{msg.user}: </strong>{msg.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <input
            id="messageInput"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
