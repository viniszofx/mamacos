interface FetchOptions extends RequestInit {
  credentials?: RequestCredentials;
}

async function fetchClient(url: string, options: FetchOptions = {}) {
  // Ensure credentials are included
  const finalOptions = {
    ...options,
    credentials: 'include' as RequestCredentials,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, finalOptions);

    // If response is 401, try to refresh token
    if (response.status === 401) {
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        // Retry original request
        return fetch(url, finalOptions);
      } else {
        // Redirect to login if refresh failed
        window.location.href = '/auth/login';
        throw new Error('Session expired');
      }
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export default fetchClient;