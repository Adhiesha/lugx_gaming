(function () {
  const TRACKING_BASE_URL = window.__ENV__?.TRACKING_ENDPOINT || 'http://localhost:5003/track';


  const sendEvent = (eventType, payload) => {
    fetch(TRACKING_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        payload,
        timestamp: Date.now(),
      }),
    }).catch((e) => console.warn('Analytics error:', e));
  };

  // Generate a session ID
  const sessionId = localStorage.getItem('analytics_session_id') || `${Date.now()}-${Math.random()}`;
  localStorage.setItem('analytics_session_id', sessionId);

  // Page View
  window.addEventListener('load', () => {
    sendEvent('page_view', {
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      sessionId,
    });
  });

  // Clicks on buttons and links
  document.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) {
      const target = e.target.closest('a, button');
      sendEvent('click', {
        tag: target.tagName,
        text: target.innerText,
        href: target.href || '',
        sessionId,
        url: window.location.href,
      });
    }
  });

    // Track scroll depth
    let maxScrollPercent = 0;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight
      );
      const winHeight = window.innerHeight;
      const totalScrollable = docHeight - winHeight;

      if (totalScrollable > 0) {
        const percent = (scrollTop / totalScrollable) * 100;
        maxScrollPercent = Math.max(maxScrollPercent, percent);
      }
    });

  // Page Exit
  window.addEventListener('beforeunload', () => {
    const duration = Date.now() - performance.timing.navigationStart;
    sendEvent('page_exit', {
      durationMs: duration,
      scrollDepth: maxScroll.toFixed(2),
      sessionId,
      url: window.location.href,
    });
  });
})();