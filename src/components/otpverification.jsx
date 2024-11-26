import React, { useState } from 'react';
import axios from 'axios';

const OtpVerification = ({ email, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      await axios.post('http://localhost:5000/verify-otp', { email, otp });
      onVerified();
    } catch (err) {
      setError('Invalid OTP');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Enter OTP</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-4"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleVerify} className="bg-blue-500 text-white px-4 py-2 rounded">
          Verify
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
