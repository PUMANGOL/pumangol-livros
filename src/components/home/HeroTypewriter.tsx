import { useEffect, useState } from 'react';
import './HeroTypewriter.css';

const MESSAGES: [string, string][] = [
  ['Férias a aprender', 'na Super7'],
  ['Livros Escolares', 'com Qualidade'],
  ['Encomende Já', 'e Levante Fácil'],
];

const TYPE_DELAY = 55;
const DELETE_DELAY = 35;
const PAUSE_MS = 2200;

function wait(ms: number, cancelled: () => boolean) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      if (!cancelled()) resolve();
    }, ms);
  });
}

export function HeroTypewriter() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const [fullLine1, fullLine2] = MESSAGES[messageIndex];
  const showSecondLine = line1.length === fullLine1.length || line2.length > 0;

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((value) => !value);
    }, 800);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;

    const run = async () => {
      setLine1('');
      setLine2('');

      for (let i = 1; i <= fullLine1.length; i++) {
        if (isCancelled()) return;
        setLine1(fullLine1.slice(0, i));
        await wait(TYPE_DELAY, isCancelled);
      }

      for (let i = 1; i <= fullLine2.length; i++) {
        if (isCancelled()) return;
        setLine2(fullLine2.slice(0, i));
        await wait(TYPE_DELAY, isCancelled);
      }

      await wait(PAUSE_MS, isCancelled);

      for (let i = fullLine2.length; i >= 0; i--) {
        if (isCancelled()) return;
        setLine2(fullLine2.slice(0, i));
        await wait(DELETE_DELAY, isCancelled);
      }

      for (let i = fullLine1.length; i >= 0; i--) {
        if (isCancelled()) return;
        setLine1(fullLine1.slice(0, i));
        await wait(DELETE_DELAY, isCancelled);
      }

      if (!isCancelled()) {
        setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [messageIndex, fullLine1, fullLine2]);

  return (
    <h1 className="hero-title" aria-label="Campanha escolar Pumangol">
      <span className="hero-typewriter-lines">
        <span className="hero-typewriter-line1">
          <span className="hero-typewriter-accent">{line1}</span>
          {!showSecondLine && (
            <span
              className={`hero-typewriter-cursor${showCursor ? ' is-visible' : ''}`}
              aria-hidden="true"
            >
              |
            </span>
          )}
        </span>
        {showSecondLine && (
          <span className="hero-typewriter-line2">
            {line2}
            <span
              className={`hero-typewriter-cursor${showCursor ? ' is-visible' : ''}`}
              aria-hidden="true"
            >
              |
            </span>
          </span>
        )}
      </span>
    </h1>
  );
}
