import React from 'react';

// Component for rendering the markup for sleep/demo mode
export default function Demo() {
  return (
    <div style={{ textAlign: 'center' }}>
      <video src="./imgs/startdemo.mp4" autoPlay muted loop style={{ width: '100%' }} />
    </div>
  );
}
