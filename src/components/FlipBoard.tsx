"use client";

import { useEffect, useRef, useState } from "react";

const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&?.";

function randChar(): string {
  return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
}

// A lightweight split-flap board. CSS handles the flip animation; the only JS
// is a timer that scrambles each tile toward its target character. No animation
// library, and it falls back to static text when reduced motion is requested.
export function FlipBoard({
  phrases,
  interval = 3400,
}: {
  phrases: string[];
  interval?: number;
}) {
  const width = Math.max(...phrases.map((phrase) => phrase.length));
  const targets = phrases.map((phrase) =>
    phrase.toUpperCase().padEnd(width, " ").slice(0, width).split("")
  );

  const [data, setData] = useState(() => ({
    display: targets[0],
    versions: new Array<number>(width).fill(0),
  }));
  const [phraseIdx, setPhraseIdx] = useState(0);

  const dataRef = useRef(data);
  const targetRef = useRef<string[]>(targets[0]);
  const spinsRef = useRef<number[]>(new Array<number>(width).fill(0));
  const reduceRef = useRef(false);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  // Advance through the phrases.
  useEffect(() => {
    if (phrases.length <= 1) return;
    const id = setInterval(
      () => setPhraseIdx((index) => (index + 1) % phrases.length),
      interval
    );
    return () => clearInterval(id);
  }, [phrases.length, interval]);

  // Set up the spin toward the new phrase.
  useEffect(() => {
    const target = targets[phraseIdx];
    targetRef.current = target;
    if (reduceRef.current) {
      setData((previous) => ({
        display: target,
        versions: previous.versions.map((version) => version + 1),
      }));
      return;
    }
    const current = dataRef.current.display;
    spinsRef.current = current.map((char, index) =>
      char === target[index] ? 0 : 4 + Math.floor(Math.random() * 8)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phraseIdx]);

  // One timer drives every tile so the cost stays flat.
  useEffect(() => {
    if (reduceRef.current) return;
    const id = setInterval(() => {
      const spins = spinsRef.current;
      if (spins.every((value) => value === 0)) return;
      setData((previous) => {
        const display = previous.display.slice();
        const versions = previous.versions.slice();
        const target = targetRef.current;
        for (let i = 0; i < width; i += 1) {
          if (spins[i] > 0) {
            spins[i] -= 1;
            display[i] = spins[i] === 0 ? target[i] : randChar();
            versions[i] += 1;
          }
        }
        return { display, versions };
      });
    }, 60);
    return () => clearInterval(id);
  }, [width]);

  return (
    <div
      className="flex flex-wrap justify-center gap-1.5"
      role="img"
      aria-label={phrases[phraseIdx]}
    >
      {data.display.map((char, index) => (
        <span key={index} className="flap-tile" aria-hidden="true">
          <span key={data.versions[index]} className="flap-char flip">
            {char === " " ? " " : char}
          </span>
        </span>
      ))}
    </div>
  );
}
