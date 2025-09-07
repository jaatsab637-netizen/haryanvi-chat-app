import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Chat({ token, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get('/api/chat/messages', { headers: { Authorization: token } })
      .then(res => setMessages(res.data));
  }, [token]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        '/api/chat/messages',
        { text },
        { headers: { Authorization: token } }
      );
      setMessages([...messages, ...data]);
      setText('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={onLogout}>Logout</button>
      <h2>Chat with Haryanvi Girl AI</h2>
      <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #ccc', padding: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: '8px 0' }}>
            <b>{msg.sender}:</b> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
}

export default Chat;