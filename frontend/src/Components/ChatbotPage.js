import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../Styles/ChatbotPage.css"; // Import the CSS file

const ChatbotPage = ({ onClose }) => {
  const [userInput, setUserInput] = useState(""); // Store user input
  const [messages, setMessages] = useState([]); // Store chat messages
  const [botIsTyping, setBotIsTyping] = useState(false); // State to control bot typing
  const [isSendingMessage, setIsSendingMessage] = useState(false); // State to track if message is being sent
  const chatbotRef = useRef(null); // Reference to chatbot container to detect clicks outside

  // Handle text input changes
  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  // Function to handle sending messages
  const handleSendMessage = async () => {
    if (userInput.trim() === "") return; // Don't send empty messages

    // Send user message
    const newMessage = { text: userInput, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Start showing "bot is typing..."
    setBotIsTyping(true);

    // Set the message sending state to true (hide input box)
    setIsSendingMessage(true);

    try {
      // Simulate sending user input to a backend (replace with your own API)
      const response = await axios.post("http://127.0.0.1:5000/generate-content", {
        content: userInput, // Sending the input text
      });

      // Bot's message after processing
      const botMessage = { text: response.data.response, sender: "bot" };

      // Add bot message to the chat and stop typing animation
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setBotIsTyping(false);

      // Reset the message sending state after response is received
      setIsSendingMessage(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      const botMessage = {
        text: "Sorry, I could not get a response. Please try again later.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setBotIsTyping(false);
      setIsSendingMessage(false);
    }

    // Clear the input field after sending the message
    setUserInput("");
  };

  // Handle the Enter key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  // Close chatbot when clicking outside the chatbot window
  const handleClickOutside = (event) => {
    if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
      if (typeof onClose === "function") {
        onClose(); // Close the chatbot by calling the parent `onClose` function
      }
    }
  };

  // Add event listener for detecting clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup the event listener
    };
  }, []);

  return (
    <div className="chatbot-container" ref={chatbotRef}>
      <div className="chatbot-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <p>{message.text}</p>
          </div>
        ))}
        
        {/* Display bot typing message */}
        {botIsTyping && (
          <div className="message bot typing">
            <p>Bot is typing...</p>
          </div>
        )}
      </div>

      {/* Conditionally render input field only when the message is not being sent */}
      {!isSendingMessage && (
        <div className="input-container">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress} // Handle Enter key press
            placeholder="Enter your query (start with 'cause' or a health query)"
          />
        </div>
      )}
    </div>
  );
};

export default ChatbotPage;
