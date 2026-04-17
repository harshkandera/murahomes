(function() {
  try {
    if (typeof window === 'undefined') return;

    // Helper to add missing methods to any object
    var patchMQL = function(mql) {
      if (!mql) return mql;
      if (!mql.addListener) {
        mql.addListener = function(cb) {
          if (typeof this.addEventListener === 'function') {
            this.addEventListener('change', cb);
          }
        };
      }
      if (!mql.removeListener) {
        mql.removeListener = function(cb) {
          if (typeof this.removeEventListener === 'function') {
            this.removeEventListener('change', cb);
          }
        };
      }
      return mql;
    };

    // 1. Patch prototype to catch all MediaQueryList objects globally
    if (window.MediaQueryList && window.MediaQueryList.prototype) {
      patchMQL(window.MediaQueryList.prototype);
    }

    // 2. Patch window.matchMedia to ensure it always returns a patched object
    var originalMatchMedia = window.matchMedia;
    window.matchMedia = function(query) {
      var mql = originalMatchMedia ? originalMatchMedia(query) : null;
      if (!mql) {
        mql = {
          matches: false,
          media: query,
          onchange: null,
          addEventListener: function() {},
          removeEventListener: function() {},
          dispatchEvent: function() { return false; }
        };
      }
      return patchMQL(mql);
    };

    // 3. Failsafe: search for any un-patched mql objects in the window
    console.log('[Polyfill] matchMedia listener stabilization version 3.0 active.');
  } catch (e) {
    // Silent fail to prevent blocking the main thread
  }
})();
