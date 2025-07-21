
/**
 * ZWAP! Security Protection System
 * ©️ 2025 XOCLON HOLDINGS INC.™ - All Rights Reserved
 * 
 * Multi-layered security framework to prevent code corruption and malicious attacks
 */

class ZwapSecurity {
  constructor() {
    this.isInitialized = false;
    this.securityViolations = [];
    this.trustedDomains = [
      window.location.origin,
      'https://cdn.jsdelivr.net',
      'https://unpkg.com',
      'https://walletconnect.com',
      'https://metamask.io',
      'https://auth.util.repl.co'
    ];
    this.originalConsole = { ...console };
    this.protectedElements = new Set();
    this.initialize();
  }

  initialize() {
    this.setupCSP();
    this.protectConsole();
    this.setupDOMProtection();
    this.setupXSSProtection();
    this.setupClickjackingProtection();
    this.monitorNetworkRequests();
    this.protectLocalStorage();
    this.setupIntegrityChecks();
    this.isInitialized = true;
    console.log('🛡️ ZWAP Security System Active');
  }

  // Content Security Policy enforcement
  setupCSP() {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://auth.util.repl.co;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https: blob:;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https: wss:;
      frame-src 'self' https://auth.util.repl.co;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s+/g, ' ').trim();
    
    document.head.appendChild(meta);
  }

  // Protect console from tampering
  protectConsole() {
    const securityInstance = this;
    
    // Create secure console wrapper
    const secureConsole = {
      log: (...args) => {
        if (securityInstance.validateConsoleAccess()) {
          securityInstance.originalConsole.log(...args);
        }
      },
      warn: (...args) => {
        if (securityInstance.validateConsoleAccess()) {
          securityInstance.originalConsole.warn(...args);
        }
      },
      error: (...args) => {
        if (securityInstance.validateConsoleAccess()) {
          securityInstance.originalConsole.error(...args);
        }
      }
    };

    // Prevent console redefinition
    Object.defineProperty(window, 'console', {
      value: secureConsole,
      writable: false,
      configurable: false
    });
  }

  validateConsoleAccess() {
    const stack = new Error().stack;
    return !stack.includes('eval') && !stack.includes('<anonymous>');
  }

  // DOM manipulation protection
  setupDOMProtection() {
    const securityInstance = this;
    
    // Protect critical elements
    const criticalSelectors = [
      '#connectBtn',
      '#xhiBalance',
      '#zBalance',
      '.header-nav',
      '#bangMenu'
    ];

    criticalSelectors.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        this.protectedElements.add(element);
        this.freezeElement(element);
      }
    });

    // Monitor DOM mutations
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        securityInstance.validateDOMChange(mutation);
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true
    });
  }

  freezeElement(element) {
    // Prevent modification of critical properties
    const originalInnerHTML = element.innerHTML;
    const originalClassName = element.className;
    
    Object.defineProperty(element, 'innerHTML', {
      get: () => originalInnerHTML,
      set: (value) => {
        if (this.validateElementChange(element, 'innerHTML', value)) {
          element.textContent = value;
        } else {
          this.logSecurityViolation('Unauthorized innerHTML modification attempted');
        }
      }
    });

    Object.defineProperty(element, 'className', {
      get: () => originalClassName,
      set: (value) => {
        if (this.validateElementChange(element, 'className', value)) {
          element.setAttribute('class', value);
        } else {
          this.logSecurityViolation('Unauthorized className modification attempted');
        }
      }
    });
  }

  validateElementChange(element, property, newValue) {
    // Allow changes from trusted sources only
    const stack = new Error().stack;
    const trustedSources = ['script.js', 'zed-copilot.js', 'zwapService.js'];
    
    return trustedSources.some(source => stack.includes(source));
  }

  validateDOMChange(mutation) {
    // Check for suspicious script injections
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'SCRIPT' && !this.validateScriptSource(node)) {
            this.blockMaliciousScript(node);
          }
          
          // Check for suspicious iframes
          if (node.tagName === 'IFRAME' && !this.validateIframeSource(node)) {
            this.blockMaliciousIframe(node);
          }
        }
      });
    }
  }

  validateScriptSource(scriptElement) {
    const src = scriptElement.src;
    if (!src) return false; // Block inline scripts from unknown sources
    
    return this.trustedDomains.some(domain => src.startsWith(domain));
  }

  validateIframeSource(iframeElement) {
    const src = iframeElement.src;
    if (!src) return false;
    
    return this.trustedDomains.some(domain => src.startsWith(domain));
  }

  blockMaliciousScript(scriptElement) {
    scriptElement.remove();
    this.logSecurityViolation('Malicious script injection blocked', {
      src: scriptElement.src,
      content: scriptElement.textContent.substring(0, 100)
    });
  }

  blockMaliciousIframe(iframeElement) {
    iframeElement.remove();
    this.logSecurityViolation('Suspicious iframe blocked', {
      src: iframeElement.src
    });
  }

  // XSS Protection
  setupXSSProtection() {
    // Sanitize user inputs
    const originalSetValue = HTMLInputElement.prototype.setAttribute;
    HTMLInputElement.prototype.setAttribute = function(name, value) {
      if (name === 'value' && typeof value === 'string') {
        value = this.sanitizeInput(value);
      }
      return originalSetValue.call(this, name, value);
    };

    // Protect against eval and Function constructor
    window.eval = () => {
      this.logSecurityViolation('eval() execution blocked');
      throw new Error('eval() is disabled for security');
    };

    window.Function = () => {
      this.logSecurityViolation('Function constructor blocked');
      throw new Error('Function constructor is disabled for security');
    };
  }

  sanitizeInput(input) {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/expression\s*\(/gi, '');
  }

  // Clickjacking protection
  setupClickjackingProtection() {
    if (window.self !== window.top) {
      // Prevent loading in iframe from unauthorized domains
      const parentOrigin = document.referrer;
      const isAuthorized = this.trustedDomains.some(domain => 
        parentOrigin.startsWith(domain)
      );
      
      if (!isAuthorized) {
        document.body.innerHTML = '<h1>Unauthorized Frame Access Blocked</h1>';
        this.logSecurityViolation('Clickjacking attempt blocked');
      }
    }

    // Set frame options
    const meta = document.createElement('meta');
    meta.httpEquiv = 'X-Frame-Options';
    meta.content = 'SAMEORIGIN';
    document.head.appendChild(meta);
  }

  // Network request monitoring
  monitorNetworkRequests() {
    const securityInstance = this;
    
    // Override fetch
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
      if (!securityInstance.validateNetworkRequest(url)) {
        securityInstance.logSecurityViolation('Suspicious network request blocked', { url });
        throw new Error('Network request blocked by security policy');
      }
      return originalFetch.call(this, url, options);
    };

    // Override XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      const xhr = new originalXHR();
      const originalOpen = xhr.open;
      
      xhr.open = function(method, url, ...args) {
        if (!securityInstance.validateNetworkRequest(url)) {
          securityInstance.logSecurityViolation('Suspicious XHR request blocked', { url });
          throw new Error('XHR request blocked by security policy');
        }
        return originalOpen.call(this, method, url, ...args);
      };
      
      return xhr;
    };
  }

  validateNetworkRequest(url) {
    // Allow relative URLs
    if (!url.startsWith('http')) return true;
    
    // Check against trusted domains
    return this.trustedDomains.some(domain => url.startsWith(domain)) ||
           url.includes('api.coingecko.com') ||
           url.includes('api.coinbase.com') ||
           url.includes('mainnet.infura.io');
  }

  // LocalStorage protection
  protectLocalStorage() {
    const securityInstance = this;
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    
    localStorage.setItem = function(key, value) {
      if (!securityInstance.validateStorageAccess(key)) {
        securityInstance.logSecurityViolation('Unauthorized localStorage write blocked', { key });
        return;
      }
      return originalSetItem.call(this, key, value);
    };

    localStorage.getItem = function(key) {
      if (!securityInstance.validateStorageAccess(key)) {
        securityInstance.logSecurityViolation('Unauthorized localStorage read blocked', { key });
        return null;
      }
      return originalGetItem.call(this, key);
    };
  }

  validateStorageAccess(key) {
    // Allow ZWAP-specific keys only
    const allowedPrefixes = ['zwap', 'ZWAP', 'swal', 'wallet'];
    return allowedPrefixes.some(prefix => key.startsWith(prefix));
  }

  // Code integrity checks
  setupIntegrityChecks() {
    // Verify critical function integrity
    setInterval(() => {
      this.verifyFunctionIntegrity();
    }, 30000); // Check every 30 seconds

    // Monitor for unexpected global variables
    this.originalGlobals = new Set(Object.keys(window));
    setInterval(() => {
      this.checkForSuspiciousGlobals();
    }, 10000);
  }

  verifyFunctionIntegrity() {
    const criticalFunctions = [
      'connectWallet',
      'updateBalances',
      'executeSwap'
    ];

    criticalFunctions.forEach(funcName => {
      if (window[funcName] && typeof window[funcName] !== 'function') {
        this.logSecurityViolation('Critical function compromised', { function: funcName });
        this.attemptRestore(funcName);
      }
    });
  }

  checkForSuspiciousGlobals() {
    const currentGlobals = new Set(Object.keys(window));
    const newGlobals = [...currentGlobals].filter(key => !this.originalGlobals.has(key));
    
    newGlobals.forEach(global => {
      if (this.isSuspiciousGlobal(global)) {
        this.logSecurityViolation('Suspicious global variable detected', { variable: global });
        delete window[global];
      }
    });
  }

  isSuspiciousGlobal(name) {
    const suspiciousPatterns = [
      /crypto.*miner/i,
      /bitcoin.*steal/i,
      /wallet.*hack/i,
      /private.*key/i,
      /seed.*phrase/i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(name));
  }

  logSecurityViolation(type, details = {}) {
    const violation = {
      timestamp: Date.now(),
      type,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      stack: new Error().stack
    };
    
    this.securityViolations.push(violation);
    this.originalConsole.warn('🚨 Security Violation:', violation);
    
    // Send to monitoring if available
    if (window.zwapAnalytics) {
      window.zwapAnalytics.trackSecurityEvent(violation);
    }
  }

  // Emergency lockdown
  emergencyLockdown() {
    // Disable all user interactions
    document.body.style.pointerEvents = 'none';
    
    // Clear sensitive data
    localStorage.clear();
    sessionStorage.clear();
    
    // Display security warning
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 0, 0, 0.9);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      z-index: 999999;
    `;
    overlay.textContent = '🛡️ SECURITY LOCKDOWN ACTIVATED - REFRESH PAGE';
    document.body.appendChild(overlay);
    
    this.logSecurityViolation('Emergency lockdown activated');
  }

  // Get security report
  getSecurityReport() {
    return {
      violations: this.securityViolations,
      protectedElements: this.protectedElements.size,
      isSecure: this.securityViolations.length === 0,
      lastCheck: Date.now()
    };
  }
}

// Initialize security system immediately
window.zwapSecurity = new ZwapSecurity();

// Prevent security system tampering
Object.freeze(window.zwapSecurity);
Object.freeze(ZwapSecurity.prototype);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ZwapSecurity;
}
