import { CSSProperties } from "react";

export const containerStyle: CSSProperties = {
  background: `url("/assets/background.png")`,
  position: "relative",
  width: "100%",
  height: "50%",
  minHeight: "320px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  overflow: "hidden",
  justifyContent: "center",
  alignItems: "flex-end",
};

export const shadowStyle: CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: "5%",
  background: "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
};

export const jaylyCharStyle: CSSProperties = {
  backgroundImage: "url(/assets/jayly.png)",
  width: "100%",
  height: "100%",
  backgroundSize: "contain",
  backgroundPosition: "bottom",
  position: "absolute",
  bottom: "10%",
  backgroundRepeat: "no-repeat",
};
