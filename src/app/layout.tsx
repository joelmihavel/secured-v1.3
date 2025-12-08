import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";


const zin = localFont({
  src: "../../font/ZinDisplayCondensed.otf",
  variable: "--font-zin",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const title = "Flent | India's New Standard of Renting";
const description =
  "Unlock India's top 1% rental homes with Flent. Fully furnished, designer homes with no broker hassles and minimal security deposit. Just bring your clothes, and you're home.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: "/images/og-image.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: "/images/og-image.jpg",
  },
};

import { BreadcrumbProvider } from "@/context/BreadcrumbContext";

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${zin.variable} ${plusJakartaSans.variable} antialiased font-body bg-bg-white overscroll-none`}
      >
        {/* HubSpot Tracking Code */}
        <Script
          type="text/javascript"
          id="hs-script-loader"
          src="//js-na2.hs-scripts.com/45469632.js"
          strategy="afterInteractive"
        />

        {/* WAX Attribution Tracking Script */}
        <Script
          id="wax-attribution-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                'use strict';

                // Configuration
                const CONFIG = {
                  // Use Cloudflare Pages URL (or your custom domain if configured)
                  apiUrl: 'https://flent-attribution-api.pages.dev/api/attrib/click',
                  calComUrls: [
                    'cal.com/flent/reserve',
                    'cal.com/flent/home-visit',
                    'https://cal.com/flent/reserve',
                    'https://cal.com/flent/home-visit'
                  ],
                  storageKey: 'wax_attribution',
                  debug: false
                };

                // Debug logging
                function log(...args) {
                  if (CONFIG.debug) {
                    console.log('[WAX Attribution]', ...args);
                  }
                }

                // Generate random session code (WAX-XXXX)
                function generateSessionCode() {
                  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                  let code = 'WAX-';
                  for (let i = 0; i < 4; i++) {
                    code += chars.charAt(Math.floor(Math.random() * chars.length));
                  }
                  return code;
                }

                // Parse URL parameters
                function getUrlParams() {
                  const params = new URLSearchParams(window.location.search);
                  return {
                    utm_source: params.get('utm_source'),
                    utm_medium: params.get('utm_medium'),
                    utm_campaign: params.get('utm_campaign'),
                    utm_term: params.get('utm_term'),
                    utm_content: params.get('utm_content'),
                    gclid: params.get('gclid'),
                    gbraid: params.get('gbraid'),
                    wbraid: params.get('wbraid'),
                    fbclid: params.get('fbclid')
                  };
                }

                // Get or create attribution data
                function getAttributionData() {
                  try {
                    const stored = localStorage.getItem(CONFIG.storageKey);
                    if (stored) {
                      const data = JSON.parse(stored);
                      log('Found existing attribution data:', data);
                      return data;
                    }
                  } catch (error) {
                    console.error('Error reading attribution data:', error);
                  }
                  return null;
                }

                // Save attribution data
                function saveAttributionData(data) {
                  try {
                    localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
                    log('Saved attribution data:', data);
                  } catch (error) {
                    console.error('Error saving attribution data:', error);
                  }
                }

                // Send attribution data to API
                async function sendToApi(data) {
                  try {
                    const response = await fetch(CONFIG.apiUrl, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        sessionCode: data.sessionCode,
                        page: data.landingPage,
                        utmPayload: data.utm
                      })
                    });

                    if (!response.ok) {
                      throw new Error(\`API error: \${response.status}\`);
                    }

                    const result = await response.json();
                    log('API response:', result);
                    return result.ok;
                  } catch (error) {
                    console.error('Error sending to API:', error);
                    return false;
                  }
                }

                // Check if URL is a Cal.com link
                function isCalComLink(url) {
                  if (!url) return false;
                  const href = url.toLowerCase();
                  return CONFIG.calComUrls.some(calUrl => href.includes(calUrl));
                }

                // Append WAX code to Cal.com URLs
                function appendWaxToCalComLinks() {
                  const attribution = getAttributionData();
                  if (!attribution || !attribution.sessionCode) {
                    log('No WAX code available to append');
                    return;
                  }

                  const waxCode = attribution.sessionCode;
                  log('Appending WAX code to Cal.com links:', waxCode);

                  // Find all links on the page
                  const links = document.querySelectorAll('a[href]');

                  links.forEach(link => {
                    const href = link.getAttribute('href');

                    if (isCalComLink(href)) {
                      try {
                        const url = new URL(href, window.location.origin);

                        // Add wax_code parameter
                        url.searchParams.set('wax_code', waxCode);

                        // Update the link
                        link.setAttribute('href', url.toString());
                        log('Updated Cal.com link:', link.href);
                      } catch (error) {
                        console.error('Error updating Cal.com link:', error);
                      }
                    }
                  });
                }

                // Create floating WhatsApp button
                function createFloatingWhatsAppButton() {
                  // Check if button already exists
                  if (document.querySelector('.whatsapp-float')) {
                    return;
                  }

                  const attribution = getAttributionData();
                  const waxCode = attribution?.sessionCode || '';

                  // Create button element
                  const button = document.createElement('a');
                  button.className = 'whatsapp-float';
                  button.href = 'https://wa.me/918904695925?text=Curious%20to%20know%20more%20about%20Flent%E2%80%94tell%20me%20everything%21';
                  button.target = '_blank';
                  button.rel = 'noopener noreferrer';
                  button.setAttribute('aria-label', 'Chat with us on WhatsApp');
                  
                  // Add WhatsApp icon SVG
                  button.innerHTML = \`
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.977 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
                    </svg>
                  \`;

                  // Add styles
                  const style = document.createElement('style');
                  style.textContent = \`
                    .whatsapp-float {
                      position: fixed;
                      width: 60px;
                      height: 60px;
                      bottom: 24px;
                      right: 24px;
                      background: #000;
                      color: #fff;
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      box-shadow: 2px 2px 8px rgba(0,0,0,0.15);
                      z-index: 9999;
                      transition: background 0.3s;
                      text-decoration: none;
                    }
                    .whatsapp-float:hover {
                      background: #222;
                    }
                    @media (max-width: 600px) {
                      .whatsapp-float {
                        width: 48px;
                        height: 48px;
                        bottom: 16px;
                        right: 16px;
                      }
                      .whatsapp-float svg {
                        width: 24px;
                        height: 24px;
                      }
                    }
                  \`;

                  // Append to document
                  document.head.appendChild(style);
                  document.body.appendChild(button);

                  // Enhance the floating button with WAX code if available
                  if (waxCode) {
                    try {
                      const url = new URL(button.href);
                      const text = url.searchParams.get('text') || '';
                      if (!text.includes('[WAX-')) {
                        const newText = text + (text ? ' ' : '') + \`[\${waxCode}]\`;
                        url.searchParams.set('text', newText);
                        button.href = url.toString();
                      }
                    } catch (error) {
                      console.error('Error updating floating button with WAX code:', error);
                    }
                  }
                }

                // Add WAX code to WhatsApp messages
                function enhanceWhatsAppLinks() {
                  const attribution = getAttributionData();
                  if (!attribution || !attribution.sessionCode) {
                    return;
                  }

                  const waxCode = attribution.sessionCode;

                  // Find all WhatsApp links
                  const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]');

                  whatsappLinks.forEach(link => {
                    try {
                      const url = new URL(link.href);
                      const text = url.searchParams.get('text') || '';

                      // Add WAX code to message if not already present
                      if (!text.includes('[WAX-')) {
                        const newText = text + (text ? ' ' : '') + \`[\${waxCode}]\`;
                        url.searchParams.set('text', newText);
                        link.setAttribute('href', url.toString());
                        log('Enhanced WhatsApp link with WAX code');
                      }
                    } catch (error) {
                      console.error('Error enhancing WhatsApp link:', error);
                    }
                  });
                }

                // Initialize attribution tracking
                function init() {
                  log('Initializing attribution tracking...');

                  const urlParams = getUrlParams();
                  let attribution = getAttributionData();

                  // Check if we have any UTM parameters or click IDs in the URL
                  const hasAttribution = Object.values(urlParams).some(value => value !== null);

                  if (hasAttribution || !attribution) {
                    // Create new attribution data
                    const sessionCode = attribution?.sessionCode || generateSessionCode();

                    attribution = {
                      sessionCode: sessionCode,
                      landingPage: window.location.href,
                      firstTouch: attribution?.firstTouch || Date.now(),
                      lastTouch: Date.now(),
                      utm: {
                        ...attribution?.utm,
                        ...Object.fromEntries(
                          Object.entries(urlParams).filter(([_, v]) => v !== null)
                        )
                      }
                    };

                    // Save to localStorage
                    saveAttributionData(attribution);

                    // Send to API (if we have new attribution data)
                    if (hasAttribution) {
                      sendToApi(attribution);
                    }
                  }

                  // Create floating WhatsApp button
                  createFloatingWhatsAppButton();

                  // Enhance Cal.com and WhatsApp links
                  enhanceWhatsAppLinks();
                  appendWaxToCalComLinks();

                  // Re-enhance links when DOM changes (for dynamically loaded content)
                  const observer = new MutationObserver(() => {
                    createFloatingWhatsAppButton();
                    enhanceWhatsAppLinks();
                    appendWaxToCalComLinks();
                  });

                  observer.observe(document.body, {
                    childList: true,
                    subtree: true
                  });

                  log('Attribution tracking initialized with code:', attribution.sessionCode);
                }

                // Run on DOM ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', init);
                } else {
                  init();
                }

                // Also run on page load to catch any late-loaded links
                window.addEventListener('load', () => {
                  enhanceWhatsAppLinks();
                  appendWaxToCalComLinks();
                });
              })();
            `,
          }}
        />
        
        <BreadcrumbProvider>
          <Navbar />
          {children}
          <Footer />
        </BreadcrumbProvider>
      </body>
    </html>
  );
}
