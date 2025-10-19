// Cookie consent with Google Analytics integration
(function() {
    const GA_MEASUREMENT_ID = 'G-Q3X0X9VRB2';
    let notice;
    
    // Initialize Google Analytics and AdSense with full consent
    function initializeGoogleAnalytics() {
        // Always ensure gtag is properly initialized
        window.dataLayer = window.dataLayer || [];
        if (!window.gtag) {
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;
        }
        
        // Load gtag script if not already loaded
        if (!document.querySelector(`script[src*="${GA_MEASUREMENT_ID}"]`)) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
            document.head.appendChild(script);
            
            window.gtag('js', new Date());
        }
        
        window.gtag('consent', 'update', {
            'ad_storage': 'granted',
            'analytics_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted'
        });
        
        window.gtag('config', GA_MEASUREMENT_ID, {
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
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'crawler_visit', {
                    'crawler_name': crawlerInfo.name,
                    'crawler_pattern': crawlerInfo.pattern,
                    'user_agent': crawlerInfo.userAgent,
                    'page_location': location.href,
                    'page_title': document.title
                });
            }
        }, 500);
    }
    
    function acceptCookies() {
        localStorage.setItem('cookieConsent', 'accepted');
        if (notice && notice.parentNode) {
            notice.parentNode.removeChild(notice);
        }
        
        initializeGoogleAnalytics();
    }

    function rejectCookies() {
        localStorage.setItem('cookieConsent', 'rejected');
        if (notice && notice.parentNode) {
            notice.parentNode.removeChild(notice);
        }
        
        // Update to denied for ad/personalization, but keep anonymous analytics
        window.gtag('consent', 'update', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
        });
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
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;
    
    // Load gtag script for basic analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    if (!document.head) {
        document.head = document.createElement('head');
    }
    document.head.appendChild(script);
    
    window.gtag('js', new Date());
    
    window.gtag('consent', 'default', {
        'ad_storage': 'denied',
        'analytics_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
    });

    window.gtag('config', GA_MEASUREMENT_ID, {
        'anonymize_ip': true,
        'allow_google_signals': false,
        'allow_ad_personalization_signals': false,
        'client_storage': 'none',
        'send_page_view': true
    });

    // Show the cookie notice
    notice = document.createElement('div');
    notice.id = 'cookie-consent-notice';
    notice.innerHTML = `
        <div style="
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #333;
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        ">
            <div style="
                color: white;
                padding: 10px 15px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                font-weight: bold;
                text-align: left;
            ">
                <p>This site uses analytics to understand how you use it and ads to help support it.</p>
                <span style="display: inline-block; margin-top: 5px;">By accepting, you help us improve your experience.</span>
                <button onclick="window.location.href='/privacy-policy/'" style="
                    margin-left: 5px;
                    margin-top: 5px;
                    padding: 6px 8px;
                    cursor: pointer;
                    background: #666;
                    color: white;
                    border: 1px solid #666;
                    border-radius: 2px;
                    font-size: 14px;
                    text-decoration: underline;
                ">Privacy Policy</button>
                <button id="cookie-reject-btn" style="
                    margin-left: 5px;
                    margin-top: 5px;
                    padding: 6px 8px;
                    cursor: pointer;
                    background: #777;
                    color: white;
                    border: 1px solid #777;
                    border-radius: 2px;
                    font-size: 14px;
                ">Reject</button>
                <button id="cookie-accept-btn" style="
                    margin-left: 5px;
                    margin-top: 5px;
                    padding: 6px 8px;
                    cursor: pointer;
                    background: #4CAF50;
                    color: white;
                    border: 1px solid #4CAF50;
                    border-radius: 2px;
                    font-size: 14px;
                ">Accept</button>
            </div>
        </div>
    `;
    
    // Add event listeners to buttons
    const acceptBtn = notice.querySelector('#cookie-accept-btn');
    const rejectBtn = notice.querySelector('#cookie-reject-btn');
    acceptBtn.addEventListener('click', acceptCookies);
    rejectBtn.addEventListener('click', rejectCookies);
    
    appendNotice();
})();