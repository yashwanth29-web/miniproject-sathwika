(function (window) {
  window.__env = window.__env || {};
  // Edit this value on your server or CI to point to the deployed API.
  // Example: window.__env.API_BASE = 'https://api.example.com';
  window.__env.API_BASE = window.__env.API_BASE || 'http://localhost:5000';
})(this);
