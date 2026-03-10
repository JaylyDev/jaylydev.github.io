const GA_MEASUREMENT_ID = "G-Q3X0X9VRB2";
const script = document.createElement("script");
script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
script.async = true;
document.head.appendChild(script);

window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());

const screenResolution = window.screen.width + "x" + window.screen.height;
const blockedResolutions = new Set([
  "1280x1200",
  "800x600",
  "3840x2160",
  "0x0",
  "1024x1024",
]);
if (!blockedResolutions.has(screenResolution)) {
  gtag("config", GA_MEASUREMENT_ID);
}
