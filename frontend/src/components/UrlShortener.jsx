import React, { useState } from 'react';
import axios from 'axios';

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Simple client-side URL validation regex
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setCopied(false);

    if (!longUrl.trim()) {
      setError('Please enter a URL.');
      return;
    }

    if (!isValidUrl(longUrl)) {
      setError('Please enter a valid absolute URL (including http:// or https://).');
      return;
    }

    setLoading(true);

    try {
      // Replace with your actual backend API endpoint
      const response = await axios.post('http://localhost:5000/api/url/shorten', {
        longUrl: longUrl
      });

      // Assuming your backend returns { shortUrl: "http://localhost:5000/xyz123" }
      setShortUrl(response.data.shortUrl);
      setLongUrl(''); // Clear input on success
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Something went wrong. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copy status after 2 seconds
    } catch (err) {
      setError('Failed to copy to clipboard.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>URL Shortener</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="url"
          placeholder="Paste your long link here (e.g., https://example.com)..."
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          disabled={loading}
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {shortUrl && (
        <div style={styles.resultContainer}>
          <p style={styles.resultLabel}>Your short link:</p>
          <div style={styles.resultBox}>
            <a 
              href={shortUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.shortLink}
            >
              {shortUrl}
            </a>
            <button onClick={handleCopy} style={styles.copyButton}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Basic inline styling for out-of-the-box UI
const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    fontFamily: 'system-ui, sans-serif',
    backgroundColor: '#fff',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    outline: 'none',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  error: {
    color: '#ff0000',
    marginTop: '12px',
    fontSize: '14px',
  },
  resultContainer: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f7f7f7',
    borderRadius: '8px',
  },
  resultLabel: {
    margin: '0 0 8px 0',
    fontWeight: '600',
    color: '#555',
  },
  resultBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  },
  shortLink: {
    color: '#0070f3',
    textDecoration: 'none',
    wordBreak: 'break-all',
    fontWeight: '500',
  },
  copyButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};

export default UrlShortener;