import React from 'react';
import Link from 'next/link';

const RegisterPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2 style={{ marginBottom: '20px' }}>Register</h2>
      <form style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <input type="text" placeholder="Username" style={{ marginBottom: '10px', padding: '10px' }} />
        <input type="email" placeholder="Email" style={{ marginBottom: '10px', padding: '10px' }} />
        <input type="password" placeholder="Password" style={{ marginBottom: '20px', padding: '10px' }} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4A90E2', color: 'white', border: 'none', cursor: 'pointer' }}>Register</button>
      </form>
      <Link href="/login">Already have an account? Login here</Link>
    </div>
  );
};

export default RegisterPage;