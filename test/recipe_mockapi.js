function fetchFromServer(endpoint, payload) {
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  }).catch(error => {
    console.error('Failed to fetch:', error);
    throw error;
  });
}

module.exports = { fetchFromServer };
