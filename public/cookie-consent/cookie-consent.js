// Cookie consent with Google Analytics integration
(function() {
    const GA_MEASUREMENT_ID = 'G-Q3X0X9VRB2';
    let notice;
    
    // Initialize Google Analytics and AdSense with full consent
    function initializeGoogleAnalytics() {
        // Always ensure gtag is properly initialized
        globalThis.dataLayer = globalThis.dataLayer || [];
        if (!globalThis.gtag) {
            function gtag(){globalThis.dataLayer.push(arguments);}
            globalThis.gtag = gtag;
        }
        
        // Load gtag script if not already loaded
        if (!document.querySelector(`script[src*="${GA_MEASUREMENT_ID}"]`)) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
            document.head.appendChild(script);
            
            globalThis.gtag('js', new Date());
        }
        
        gtag('consent', 'update', {
            'ad_storage': 'granted',
            'analytics_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted'
        });
        
        gtag('config', GA_MEASUREMENT_ID, {
            'anonymize_ip': true,
            'allow_google_signals': true,
            'allow_ad_personalization_signals': true,
            'client_storage': 'localStorage',
            'send_page_view': true
        });
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
        }, 500);
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

    function appendNotice() {
        if (document.body) {
            document.body.appendChild(notice);
        } else {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(notice);
                });
            } else {
                // DOM is ready but body might not exist yet, wait a bit
                setTimeout(() => {
                    if (document.body) {
                        document.body.appendChild(notice);
                    }
                }, 10);
            }
        }
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
    
    // Initialize gtag with default consent settings for basic analytics
    globalThis.dataLayer = globalThis.dataLayer || [];
    function gtag(){globalThis.dataLayer.push(arguments);}
    globalThis.gtag = gtag;
    
    // Load gtag script for basic analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    if (!document.head) {
        document.head = document.createElement('head');
    }
    document.head.appendChild(script);
    
    gtag('js', new Date());
    
    gtag('consent', 'default', {
        'ad_storage': 'denied',
        'analytics_storage': 'granted',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
    });

    gtag('config', GA_MEASUREMENT_ID, {
        'anonymize_ip': true,
        'allow_google_signals': false,
        'allow_ad_personalization_signals': false,
        'client_storage': 'none',
        'send_page_view': true
    });

    // Show the cookie notice
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
            This site collects basic analytics. Click "Accept" to allow cookies from Google to improve your experience.
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
            ">Accept Cookies</button>
        </div>
    `;
    
    // Add event listener to button
    const button = notice.querySelector('#cookie-accept-btn');
    button.addEventListener('click', acceptCookies);
    
    appendNotice();
})();