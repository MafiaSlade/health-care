import React, { useState, useRef } from 'react';
import { DialogContent, DialogTitle, IconButton } from '@mui/material'; // MUI Dialog components
import ChatbotPage from './ChatbotPage'; // Import the ChatbotPage component
import anime from 'animejs'; // Import anime.js for animation
import '../Styles/ChatbotModal.css'; // Import custom styles for the chatbot button
import CloseIcon from '@mui/icons-material/Close'; // MUI Close Icon (Multiply Icon)

const ChatbotModal = ({ toggleChatbot }) => {
  const [openChatbox, setOpenChatbox] = useState(false); // State to control chatbox visibility
  const chatboxRef = useRef(null); // Ref to detect clicks outside the chatbox

  // Toggle chatbox visibility with animation
  const handleToggleChatbox = () => {
    toggleChatbot(); // Call the toggle function passed from the parent (Home)
    const chatbox = document.getElementById('chatbox');
    const button = document.querySelector('.chatbot-button');

    if (!openChatbox) {
      anime({
        targets: chatbox,
        opacity: [0, 1], // Fade in
        translateY: [100, 0], // Slide up
        duration: 500,
        easing: 'easeOutQuad',
      });
      chatbox.style.display = 'block';
      button.style.display = 'none';
      setOpenChatbox(true);
    } else {
      anime({
        targets: chatbox,
        opacity: [1, 0], // Fade out
        translateY: [0, 100], // Slide down
        duration: 500,
        easing: 'easeInQuad',
        complete: function () {
          chatbox.style.display = 'none';
          button.style.display = 'block';
          setOpenChatbox(false);
        }
      });
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Custom animated message-shaped button */}
      <div className="chatbot-button" onClick={handleToggleChatbox}>
        <span>💬</span>
      </div>

      {/* Dialog to display ChatbotPage */}
      <div id="chatbox" className="chatbox" ref={chatboxRef}>
        <DialogTitle className="chatbox-header">
          {/* Multiply (×) Icon for closing */}
          WellNessAI
          <IconButton onClick={handleToggleChatbox} edge="end" color="inherit" aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ padding: 0 }}>
          <ChatbotPage /> {/* Render the ChatbotPage here */}
        </DialogContent>
      </div>
    </div>
  );
};

export default ChatbotModal;
