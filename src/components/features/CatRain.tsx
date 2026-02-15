import { useState, useImperativeHandle, forwardRef } from 'react';
import { createPortal } from 'react-dom';

export const CatRain = forwardRef((_, ref) => {
  const [cats, setCats] = useState<{ id: number; left: number; delay: number }[]>([]);

  useImperativeHandle(ref, () => ({
    startRain: () => {
      const newCats = Array.from({ length: 25 }, () => ({
        id: Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setCats(newCats);
      setTimeout(() => setCats([]), 4500);
    },
  }));

  if (cats.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-9999 overflow-hidden">
      {cats.map((cat) => (
        <span
          key={cat.id}
          className="absolute -top-12.5 text-4xl select-none"
          style={{
            left: `${cat.left}%`,
            animation: `fall 3.5s linear forwards`,
            animationDelay: `${cat.delay}s`,
          }}
        >
          🐱
        </span>
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>,
    document.body
  );
});

CatRain.displayName = 'CatRain';
