import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import Info from "../Components/Info";
import About from "../Components/About";
import Reviews from "../Components/Reviews";
import Doctors from "../Components/Doctors";
import Footer from "../Components/Footer";
import ChatbotModal from "../Components/ChatbotModel";
import { useNavigate } from "react-router-dom";
import Fab from "@mui/material/Fab";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

function Home() {
  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div className="home-section">
      {/* Camera Floating Button */}
      <Fab
        color="primary"
        aria-label="image-analysis"
        onClick={() => navigate("/image-analysis")}
        style={{
          position: "fixed",
          bottom: "100px",
          right: "20px",
          zIndex: 1000,
          animation: "bounce 1s infinite alternate",
        }}
      >
        <CameraAltIcon />
      </Fab>
      <Navbar />
      {/* Pass the toggleChatbot function as a prop to ChatbotModal */}
      <ChatbotModal toggleChatbot={toggleChatbot} />
      <Hero />
      <Info />
      <About />
      <Reviews />
      <Doctors />
      <Footer />
    </div>
  );
}

export default Home;
