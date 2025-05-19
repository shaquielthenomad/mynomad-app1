import { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = () => {
    setSuccess('Message sent (mock)');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="text-center p-8">
      <h2 className="text-2xl mb-4">Contact Us</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="block mx-auto mb-2 p-2 text-black"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="block mx-auto mb-2 p-2 text-black"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
        className="block mx-auto mb-2 p-2 text-black w-64"
      ></textarea>
      <button onClick={handleSubmit}>Submit</button>
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
} 