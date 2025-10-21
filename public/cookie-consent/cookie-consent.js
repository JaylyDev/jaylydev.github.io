(function () {
  const GA_ID = "G-Q3X0X9VRB2";

  const addGAScript = () => {
    if (window.gtag) return; // already loaded

    const gtagScript = document.createElement("script");
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag("js", new Date());

    // Default: all denied until consent
    gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });

    gtag("config", GA_ID, { anonymize_ip: true });
  };

  addGAScript();

  // Helper: Update Consent
  function updateConsent(granted) {
    if (!window.gtag) return;
    if (granted) {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      });
    } else {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
    }
  }

  // Check Stored Consent
  const storedConsent = localStorage.getItem("cookieConsent");
  if (storedConsent) {
    updateConsent(storedConsent === "accepted");
    return;
  }

  // Create Banner
  const bar = document.createElement("div");
  bar.innerHTML = `
    <style>
      @font-face {
        font-family: Inter;
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
        src: url(/fonts/Inter-VariableFont_opsz,wght.ttf);
      }
        
      .cookie-banner {
        position:fixed;
        bottom:0;
        left:0;
        width:100%;
        padding:1rem;
        font-family:sans-serif;
        z-index:9999;
        /* Dark theme (default) */
        background:#111;
        color:#fff;
        box-shadow:0 -2px 10px rgba(0,0,0,0.3);
        border-top:2px solid #333;
        font-family:"Inter","Inter Fallback",-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
      }
      
      /* Light theme */
      @media (prefers-color-scheme: light) {
        .cookie-banner {
          background:#f5f5f5;
          color:#1a1a1a;
          box-shadow:0 -2px 10px rgba(0,0,0,0.1);
          border-top:2px solid #ddd;
        }
        .cookie-banner a {
          color:#0056b3 !important;
        }
        .cookie-banner #cookie-reject {
          color:#666 !important;
          border-color:#ccc !important;
        }
      }
      
      .cookie-banner-title {
        font-size:1.1rem;
        font-weight:700;
        margin:0 0 0.5rem 0;
      }
      
      .cookie-banner-container {
        display:flex;
        flex-direction:row;
        align-items:center;
        gap:1rem;
        width:100%;
      }
      .cookie-banner-buttons {
        display:flex;
        gap:0.75rem;
        flex-shrink:0;
      }
      @media (max-width: 768px) {
        .cookie-banner-container {
          flex-direction:column;
          align-items:stretch;
        }
        .cookie-banner-buttons {
          flex-direction:column;
          width:100%;
        }
        .cookie-banner-buttons button {
          width:100%;
        }
      }
    </style>
    <div class="cookie-banner">
      <div style="
        display:flex;
        flex-direction:column;
        gap:1rem;
        max-width:1050px;
        margin:0 auto;
      ">
        <h2 class="cookie-banner-title">🍪 Cookies!</h2>
        <div class="cookie-banner-container">
          <p style="
            font-size:0.95rem;
            margin:0;
            flex:1;
          ">
            We use optional cookies from Google to improve your experience and support our site, such as analyzing traffic and keeping our content free through ads. By clicking Reject, only cookies necessary for the basic functioning of the site will be used.
            <a href="/privacy-policy/" style="color:#4ea3ff;text-decoration:underline;">Learn more</a>.
          </p>
          <div class="cookie-banner-buttons">
            <button id="cookie-accept" style="
              background:#0070f3;
              color:white;
              border:none;
              padding:0.5rem 4rem;
              border-radius:4px;
              cursor:pointer;
              font-weight:600;
              white-space:nowrap;
            ">Accept</button>
            <button id="cookie-reject" style="
              background:transparent;
              color:#bbb;
              border:1px solid #555;
              padding:0.5rem 4rem;
              border-radius:4px;
              cursor:pointer;
              white-space:nowrap;
            ">Reject</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(bar);

  // Button Logic
  document.getElementById("cookie-accept").addEventListener("click", function () {
    localStorage.setItem("cookieConsent", "accepted");
    updateConsent(true);
    bar.remove();
  });

  document.getElementById("cookie-reject").addEventListener("click", function () {
    localStorage.setItem("cookieConsent", "rejected");
    updateConsent(false);
    bar.remove();
  });
})();
