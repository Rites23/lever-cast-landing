import * as React from 'react';

interface EmailTemplateProps {
  email: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({ email }) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ color: '#5B5BFF' }}>New Waitlist Signup</h1>
      <p>Someone has joined the Levercast waitlist!</p>
      <p><strong>Email:</strong> {email}</p>
      <hr style={{ border: '1px solid #eee', margin: '20px 0' }} />
      <p style={{ color: '#666', fontSize: '14px' }}>This message was sent from the Levercast landing page.</p>
    </div>
  );
}; 