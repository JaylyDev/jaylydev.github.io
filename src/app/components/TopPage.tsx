import React, { useState, useEffect } from "react";
import ContactList from "./ContactList"; // Import your ContactList component
import SkinRenderer from "./SkinRenderer"; // Import your SkinRenderer component

const widthMinSize = 500;

function MinecraftNameTag({ playerName }: { playerName: string }) {
  return (
    <div className="bg-black bg-opacity-50 p-2 rounded-lg">
      <h2 className="text-2xl text-white" style={{ textAlign: "center" }}>
        {playerName}
      </h2>
    </div>
  );
}

const WebComponent = () => {
  // Initialize isLargeScreen using a function to evaluate it immediately
  const [isLargeScreen, setIsLargeScreen] = useState(() => window.innerWidth >= widthMinSize);

  useEffect(() => {
    // Function to handle window resize and update isLargeScreen
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= widthMinSize);
    };

    // Add a listener to update isLargeScreen when the window is resized
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Include widthMinSize in the dependency array to handle changes

  return (
    <div className="flex min-h-content flex-col items-center justify-between">
      <div className={`flex min-h-content ${isLargeScreen ? "flex-row" : "flex-col"} items-stretch`}>
        <div className="mt-4">
          <ContactList />
        </div>
        {/* make object center */}
        <div className="mt-4" style={{ maxWidth: "200px", margin: "auto" }}>
          <MinecraftNameTag playerName="JaylyPlays" />
          <SkinRenderer />
        </div>
      </div>
    </div>
  );
};

export default WebComponent;
