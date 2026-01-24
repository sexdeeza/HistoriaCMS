import React, { useEffect, useState } from 'react';

interface Blossom {
  id: number;
  image: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

const FallingBlossoms: React.FC = () => {
  const [blossoms, setBlossoms] = useState<Blossom[]>([]);

  useEffect(() => {
    const images = ['/assets/blossom/1.png', '/assets/blossom/2.png', '/assets/blossom/3.png'];
    const initialBlossoms: Blossom[] = [];

    // Create 15 blossoms with random properties
    for (let i = 0; i < 15; i++) {
      initialBlossoms.push({
        id: i,
        image: images[Math.floor(Math.random() * images.length)],
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 10,
        size: 15 + Math.random() * 20,
      });
    }

    setBlossoms(initialBlossoms);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {blossoms.map((blossom) => (
        <div
          key={blossom.id}
          className="absolute animate-fall"
          style={{
            left: `${blossom.left}%`,
            animationDelay: `${blossom.delay}s`,
            animationDuration: `${blossom.duration}s`,
          }}
        >
          <img
            src={blossom.image}
            alt=""
            className="animate-sway"
            style={{
              width: `${blossom.size}px`,
              height: `${blossom.size}px`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FallingBlossoms;
