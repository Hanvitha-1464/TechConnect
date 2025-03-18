import React, { useState, useEffect } from 'react';

const CipherChat = () => {
  const [messages, setMessages] = useState([]);
  const [adminReply, setAdminReply] = useState({});

  // 📍 Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/doubts/1/2');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // 📍 Handle input change for each message
  const handleAdminReplyChange = (e, messageId) => {
    setAdminReply({
      ...adminReply,
      [messageId]: e.target.value,
    });
  };

  // 📍 Handle sending admin reply
  const handleAdminReply = async (doubtId) => {
    try {
      const res = await fetch('/api/doubts/1/1/admin', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: adminReply[doubtId],
        }),
      });

      const newReply = await res.json();

      // 🛑 Prevent Admin from replying to his own messages
      setMessages((prev) => [...prev, newReply]);
      setAdminReply({ ...adminReply, [doubtId]: "" });
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  useEffect(() => {
    fetchMessages(); // Fetch messages when admin opens the page
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Cipher Doubts</h1>
  
      {messages.length === 0 ? (
        <p>No doubts asked yet!</p>
      ) : (
        messages.map((message) => (
          <div key={message._id} className="mb-4">
            <p className={`font-semibold ${message.senderName === "Admin" ? "text-blue-400" : "text-green-400"}`}>
              {message.senderName}:
            </p>
            <p>{message.text}</p>

            {/* ✅ Admin can reply only to student's doubt */}
            {message.senderName !== "Admin" && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Reply as Admin..."
                  className="bg-gray-700 text-white p-2 rounded w-full"
                  value={adminReply[message._id] || ""}
                  onChange={(e) => handleAdminReplyChange(e, message._id)}
                />
                <button
                  onClick={() => handleAdminReply(message._id)}
                  className="bg-blue-600 text-white p-2 mt-2 rounded"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CipherChat;