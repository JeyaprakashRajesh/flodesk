import React, { useEffect, useState } from 'react';

export default function ClockWidget({ x, y, location }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (t) =>
    `${t.getHours().toString().padStart(2, '0')}:${t
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}`;

  return (
    <div
      className="bg-white text-black rounded-xl shadow-xl font-mono flex flex-col items-center justify-center"
      style={{
        width: 200,
        height: 200,
        textAlign: 'center',
      }}
    >
      <div className="text-xl">{formatTime(time)}</div>
      <div className="text-sm text-gray-600 mt-2">{location}</div>
    </div>
  );
}
