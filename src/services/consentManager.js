const GTM_ID = 'GTM-MVQ9TPFQ';
const METRICOOL_HASH = 'c3328d42186834b908b372e541ac7c09';
const STORAGE_KEY = 'cleavenir_cookie_prefs';

let gtmLoaded = false;
let metricoolLoaded = false;

export const consentManager = {
  // Called on app start — reads saved preferences and loads trackers if consented
  initFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.applyConsent(JSON.parse(saved));
      }
    } catch (e) {
      // Corrupted storage — ignore
    }
  },

  // Called after the user saves preferences in the banner or preferences page
  applyConsent(prefs) {
    if (prefs?.analytics) {
      this.loadGTM();
      this.loadMetricool();
    }
  },

  loadGTM() {
    if (gtmLoaded) return;
    gtmLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(script);

    // noscript fallback
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.cssText = 'display:none;visibility:hidden';
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);
  },

  loadMetricool() {
    if (metricoolLoaded) return;
    metricoolLoaded = true;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://tracker.metricool.com/resources/be.js';
    script.onload = () => {
      if (window.beTracker) {
        window.beTracker.t({ hash: METRICOOL_HASH });
      }
    };
    document.head.appendChild(script);
  }
};
