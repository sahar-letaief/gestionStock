async function request(url, method = 'GET', body) {
  const res = await fetch('/api' + url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error('Erreur API');
  return res.status === 204 ? null : res.json();
}

export const api = {
  get: (url) => request(url),
  post: (url, data) => request(url, 'POST', data),
  put: (url, data) => request(url, 'PUT', data),
  del: (url) => request(url, 'DELETE'),
};
