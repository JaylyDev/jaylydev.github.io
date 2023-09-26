import React, { useState, useEffect } from "react";
import ContactList from "./ContactList"; // Import your ContactList component
import SkinRenderer from "./SkinRenderer"; // Import your SkinRenderer component

const widthMinSize = 512;

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
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    // Add a listener to update the isLargeScreen state when the window is resized
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= widthMinSize);
    };

    window.addEventListener("resize", handleResize);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-indigo-600 via-blue-600 dark:via-blue-900 to-transparent">
      <div className={`flex min-h-screen ${isLargeScreen ? "flex-row" : "flex-col"} items-stretch`}>
        <div className="mt-4">
          <ContactList />
        </div>
        <div className="mt-4">
          <MinecraftNameTag playerName="JaylyPlays" />
          <SkinRenderer />
        </div>
      </div>
    </div>
  );
};

export default WebComponent;
