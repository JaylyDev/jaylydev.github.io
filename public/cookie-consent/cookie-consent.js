// Cookie consent with Google Analytics integration
(function() {
    const GA_MEASUREMENT_ID = 'G-Q3X0X9VRB2';
    let notice;
    
    // Initialize Google Analytics and AdSense with consent
    function initializeGoogleAnalytics() {
        // Load gtag script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);
        
        // Initialize gtag
        globalThis.dataLayer = globalThis.dataLayer || [];
        function gtag(){globalThis.dataLayer.push(arguments);}
        globalThis.gtag = gtag;
        
        gtag('js', new Date());
        
        // Set consent for AdSense and Analytics
        gtag('consent', 'update', {
            'ad_storage': 'granted',
            'analytics_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted'
        });
        
        gtag('config', GA_MEASUREMENT_ID);
    }
    
    // Check if visitor is a known web crawler and return details
    function getCrawlerInfo() {
        const userAgent = navigator.userAgent.toLowerCase();
        const crawlerMap = {
            // Search Engines
            'googlebot': 'Googlebot',
            'bingbot': 'BingBot',
            'slurp': 'Slurp',
            'duckduckbot': 'DuckDuckBot',
            'baiduspider': 'BaiduSpider',
            'yandexbot': 'YandexBot',
            
            // Social Media
            'facebookexternalhit': 'FacebookExternalHit',
            'facebookbot': 'FacebookBot',
            'twitterbot': 'Twitterbot',
            'linkedinbot': 'LinkedInBot',
            'whatsapp': 'WhatsApp',
            'telegrambot': 'TelegramBot',
            'tiktokspider': 'TikTokSpider',
            
            // AI Crawlers
            'claudebot': 'ClaudeBot',
            'chatgpt-user': 'ChatGPT-User',
            'gptbot': 'GPTBot',
            'anthropic-ai': 'Anthropic-AI',
            'claude-web': 'Claude-Web',
            'oai-searchbot': 'OAI-SearchBot',
            'perplexitybot': 'PerplexityBot',
            'perplexity-user': 'Perplexity-User',
            
            // Other AI/ML
            'meta-externalagent': 'Meta-ExternalAgent',
            'meta-externalfetcher': 'Meta-ExternalFetcher',
            'amazonbot': 'Amazonbot',
            'applebot': 'Applebot',
            'bytespider': 'Bytespider',
            'ai2bot': 'AI2Bot',
            'ccbot': 'CCBot',
            'diffbot': 'Diffbot',
            'youbot': 'YouBot',
            
            // Specialized Crawlers
            'timpubot': 'Timpubot',
            'imgproxy': 'ImgProxy',
            'iaskspider': 'iAskSpider',
            'sidetrade': 'Sidetrade',
            'pangubot': 'PanguBot',
            'omgili': 'Omgili',
            'cohere-ai': 'Cohere-AI',
            'isscyberriskcrawler': 'ISSCyberRiskCrawler',
            'novaact': 'NovaAct',
            'friendlycrawler': 'FriendlyCrawler',
            'img2dataset': 'img2dataset',
            'aihitbot': 'aiHitBot',
            'digitaloceangenaicrawler': 'DigitalOceanGenAICrawler',
            'cotoyogi': 'Cotoyogi',
            'google-cloudvertexbot': 'Google-CloudVertexBot',
            'mistralai-user': 'MistralAI-User',
            
            // Generic patterns (keep at end for fallback)
            'crawler': 'Generic Crawler',
            'spider': 'Generic Spider',
            'bot': 'Generic Bot',
            'scraper': 'Generic Scraper'
        };
        
        for (const [pattern, name] of Object.entries(crawlerMap)) {
            if (userAgent.includes(pattern)) {
                return {
                    isCrawler: true,
                    name: name,
                    pattern: pattern,
                    userAgent: navigator.userAgent
                };
            }
        }
        
        return { isCrawler: false };
    }
    
    // Send crawler information to Google Analytics
    function trackCrawlerVisit(crawlerInfo) {
        // Wait for gtag to be ready
        setTimeout(() => {
            if (typeof globalThis.gtag === 'function') {
                globalThis.gtag('event', 'crawler_visit', {
                    'crawler_name': crawlerInfo.name,
                    'crawler_pattern': crawlerInfo.pattern,
                    'user_agent': crawlerInfo.userAgent,
                    'page_location': location.href,
                    'page_title': document.title
                });
            }
        }, 1000);
    }
    
    // Function to accept cookies and initialize GA
    function acceptCookies() {
        localStorage.setItem('cookieConsent', 'accepted');
        if (notice && notice.parentNode) {
            notice.parentNode.removeChild(notice);
        }
        
        // Initialize Google Analytics after consent
        initializeGoogleAnalytics();
    }
    
    // Check if visitor is a crawler - if so, assume consent and track
    const crawlerInfo = getCrawlerInfo();
    if (crawlerInfo.isCrawler) {
        initializeGoogleAnalytics();
        trackCrawlerVisit(crawlerInfo);
        return;
    }
    
    // Check if user has already given consent
    if (localStorage.getItem('cookieConsent') === 'accepted') {
        initializeGoogleAnalytics();
        return;
    }
    
    // Initialize gtag with default consent settings (denied)
    globalThis.dataLayer = globalThis.dataLayer || [];
    function gtag(){globalThis.dataLayer.push(arguments);}
    globalThis.gtag = gtag;
    
    // Set default consent to denied for AdSense and Analytics
    gtag('consent', 'default', {
        'ad_storage': 'denied',
        'analytics_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
    });

    // Create and show the cookie notice
    notice = document.createElement('div');
    notice.innerHTML = `
        <div style="
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #333;
            color: white;
            padding: 10px 15px;
            text-align: center;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
        ">
            This site uses cookies from Google to deliver and enhance the quality of its services and to analyze traffic.
            <button onclick="window.location.href='/privacy-policy/'" style="
                margin-left: 5px;
                padding: 4px 8px;
                cursor: pointer;
                background: #0077CC;
                color: white;
                border: 1px solid #0077CC;
                border-radius: 2px;
                cursor: pointer;
                font-size: 14px;
                text-decoration: underline;
            ">Privacy Policy</button>
            <button id="cookie-accept-btn" style="
                margin-left: 5px;
                padding: 4px 8px;
                cursor: pointer;
                background: #4CAF50;
                color: white;
                border: 1px solid #4CAF50;
                border-radius: 2px;
                cursor: pointer;
                font-size: 14px;
            ">OK, got it</button>
        </div>
    `;
    
    // Add event listener to button
    const button = notice.querySelector('#cookie-accept-btn');
    button.addEventListener('click', acceptCookies);
    
    document.body.appendChild(notice);
})();