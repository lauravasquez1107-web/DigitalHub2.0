/**
 * Vercel Speed Insights utility for Express backend
 * 
 * This module provides Speed Insights integration for the backend API.
 * Since this is primarily a JSON API backend, Speed Insights is configured
 * to be available for any HTML responses that might be served.
 * 
 * For the main frontend application, Speed Insights should be configured
 * separately in the React/Vite frontend.
 */

/**
 * Returns the Speed Insights script tag that can be injected into HTML responses
 * @returns {string} HTML script tag for Speed Insights
 */
function getSpeedInsightsScript() {
  // Only inject in production environment on Vercel
  if (process.env.VERCEL !== '1' || process.env.NODE_ENV !== 'production') {
    return '';
  }

  return `
    <script>
      window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
    </script>
    <script defer src="/_vercel/speed-insights/script.js"></script>
  `;
}

/**
 * Middleware to inject Speed Insights into HTML responses
 * This is optional and only useful if your API serves HTML pages
 */
function speedInsightsMiddleware(req, res, next) {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Only modify HTML responses
    if (res.get('Content-Type')?.includes('text/html') && typeof data === 'string') {
      const script = getSpeedInsightsScript();
      if (script && data.includes('</body>')) {
        data = data.replace('</body>', `${script}</body>`);
      }
    }
    
    originalSend.call(this, data);
  };
  
  next();
}

module.exports = {
  getSpeedInsightsScript,
  speedInsightsMiddleware
};
