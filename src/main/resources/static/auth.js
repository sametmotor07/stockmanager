const API_BASE = 'http://localhost:8080/products';
const AUTH_USER = 'samet';
const AUTH_PASS = 'samet07';

function getAuthHeaders() {
  return {
    'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
    'Content-Type': 'application/json',
  };
}

function getApiUrl(path = '') {
  return `${API_BASE}${path}`;
}

async function fetchWithAuth(path = '', options = {}) {
  const request = {
    method: options.method || 'GET',
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  };
  const response = await fetch(getApiUrl(path), request);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API hatası: ${response.status} ${response.statusText} ${errorText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

window.auth = {
  getAuthHeaders,
  getApiUrl,
  fetchWithAuth,
};
