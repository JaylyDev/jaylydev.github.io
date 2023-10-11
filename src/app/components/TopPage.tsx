import React from "react";
import Image from "next/image";
import ContactList from "./ContactList";
import SkinRenderer from "./SkinRenderer";

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
  return (
    <>
      <div className="hidden md:block">
        <Image
          src="/images/jayly-camera.png"
          alt="Jayly Camera"
          width={250}
          height={250}
          style={{
            position: "absolute",
            bottom: "29.5%",
            left: "1%",
            minHeight: "35%",
            minWidth: "35%",
          }}
        />

        <div
          className="flex items-center justify-center absolute lg:pd-0"
          style={{
            left: "35%",
          }}
        >
          <ContactList />
        </div>
      </div>
      <div className="flex min-h-content flex-col sm:flex-row items-stretch justify-center block md:hidden">
        <ContactList />
      </div>
    </>
  );
};

export default WebComponent;
