import { useEffect, useState } from 'react';

function TestServer() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/message')
      .then(response => response.json())
      .then(data => setMessage(data.message));
  }, []);

  return <div>{message}</div>;
}

export default TestServer;