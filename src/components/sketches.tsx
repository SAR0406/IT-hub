import type { SVGProps } from "react";

type SketchProps = SVGProps<SVGSVGElement>;

const INK = "#1e293b";

function sketchBase(props: SketchProps, viewBox: string): SketchProps {
  return {
    viewBox,
    fill: "none",
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

/** Hero illustration — a student at a laptop, coffee at hand, ideas floating around. */
export function HeroSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 360 300")}>
      {/* Desk */}
      <path
        d="M18 236 C 60 228, 150 228, 200 236"
        stroke={INK}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M46 236 L 38 268" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M174 236 L 182 268" stroke={INK} strokeWidth="3" strokeLinecap="round" />

      {/* Coffee mug */}
      <path
        d="M52 186 h 34 v 26 a 8 8 0 0 1 -8 8 h -18 a 8 8 0 0 1 -8 -8 z"
        fill="#fcd34d"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M86 192 h 12 a 6 6 0 0 1 0 12 h -10"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M60 176 c 3 -6 -3 -10 0 -16 M72 176 c 3 -6 -3 -10 0 -16"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Laptop */}
      <path
        d="M108 140 L 216 146 L 212 182 L 104 176 Z"
        fill="#e0f2fe"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M126 156 l 12 10 l 14 -16 l 16 20 l 18 -14 l 12 8"
        stroke="#0891b2"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M104 176 C 140 186, 180 186, 212 182 L 206 190 C 174 194, 138 194, 112 184 Z"
        fill="#faf8f6"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Student */}
      <circle cx="266" cy="126" r="26" fill="#f4a4d4" stroke={INK} strokeWidth="2.5" />
      <path
        d="M244 112 c 0 -16 18 -22 30 -12 c -4 -2 -12 -2 -16 2"
        fill={INK}
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="258" cy="124" r="2.4" fill={INK} />
      <circle cx="274" cy="124" r="2.4" fill={INK} />
      <path
        d="M258 138 q 8 8 16 0"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M242 158 c -4 26 2 44 6 58 h 36 c 4 -14 10 -32 6 -58 c -8 6 -16 6 -24 4 c -8 2 -16 2 -24 -4 z"
        fill="#f4a4d4"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M246 178 c -10 8 -14 18 -16 28"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M280 178 c 6 4 10 10 12 18 c -14 4 -26 6 -36 8"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Floating book */}
      <g transform="rotate(-8 66 52)">
        <path
          d="M46 30 q 10 -6 20 0 l 0 34 q -10 -6 -20 0 z"
          fill="#7dd3d3"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M66 30 q 10 -6 20 0 l 0 34 q -10 -6 -20 0 z"
          fill="#86efac"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M50 36 q 6 -3 12 0 M50 42 q 6 -3 12 0 M70 36 q 6 -3 12 0 M70 42 q 6 -3 12 0"
          stroke={INK}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Lightbulb */}
      <g transform="rotate(10 300 48)">
        <circle cx="300" cy="38" r="16" fill="#fcd34d" stroke={INK} strokeWidth="2.5" />
        <path
          d="M300 54 l 0 6 M294 63 h 12"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M280 30 l -8 -6 M320 30 l 8 -6 M276 44 l -10 2 M324 44 l 10 2"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M293 34 q 3 -4 7 0 M293 42 q 3 -4 7 0"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Plant */}
      <g transform="rotate(-6 320 236)">
        <path
          d="M302 258 h 36 l -6 16 h -24 z"
          fill="#f4a4d4"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M320 258 c 0 -10 6 -18 12 -24 c -2 10 -4 20 -8 26"
          fill="#86efac"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M320 258 c 0 -12 -8 -20 -16 -26 c 4 10 8 20 12 28"
          fill="#86efac"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M320 246 c 0 -8 2 -12 6 -16 c 0 8 -2 14 -6 20"
          fill="#86efac"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** Hand-drawn open book — "Learn Anywhere". */
export function BookSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <path
        d="M12 5.5 q -2.5 -2 -6 0 l 0 12 q 3.5 -2 6 0 z"
        fill="#7dd3d3"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 5.5 q 2.5 -2 6 0 l 0 12 q -3.5 -2 -6 0 z"
        fill="#86efac"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.6 8 q 1.6 -1 3.2 0 M8.6 11 q 1.6 -1 3.2 0 M12.2 8 q 1.6 -1 3.2 0 M12.2 11 q 1.6 -1 3.2 0"
        stroke={INK}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Hand-drawn code brackets — "Practice & Build". */
export function CodeSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <path
        d="M8 6.5 L 3.5 11 L 8 15.5"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 6.5 L 20.5 11 L 16 15.5"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 4.5 l -3 14"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Hand-drawn robot head — "AI Help Anytime". */
export function RobotSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <rect
        x="4.5"
        y="7.5"
        width="15"
        height="12"
        rx="4"
        fill="#e0f2fe"
        stroke={INK}
        strokeWidth="1.8"
      />
      <circle cx="9.5" cy="13" r="1.6" fill={INK} />
      <circle cx="14.5" cy="13" r="1.6" fill={INK} />
      <path
        d="M9.5 17 q 2.5 2 5 0"
        stroke={INK}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M12 7.5 L 12 4.5 M 8.5 4.5 h 7" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Hand-drawn circle portrait for the testimonial. */
export function TestimonialAvatar(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 64 64")}>
      <circle cx="32" cy="32" r="28" fill="#fce7f3" stroke={INK} strokeWidth="2.5" />
      <circle cx="32" cy="30" r="13" fill="#f4a4d4" stroke={INK} strokeWidth="2.5" />
      <path
        d="M23 24 c 2 -8 12 -10 18 -4 c -3 -1 -8 -1 -11 1"
        fill={INK}
        stroke={INK}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="27" cy="30" r="1.8" fill={INK} />
      <circle cx="37" cy="30" r="1.8" fill={INK} />
      <path d="M27 36 q 5 5 10 0" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="21" cy="36" r="2.6" fill="#f4a4d4" opacity="0.7" />
      <circle cx="43" cy="36" r="2.6" fill="#f4a4d4" opacity="0.7" />
    </svg>
  );
}

/** Small floating decoration: open book. */
export function FloatBook(props: SketchProps) {
  return <BookSketch {...props} />;
}

/** Small floating decoration: lightbulb. */
export function FloatBulb(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <circle cx="12" cy="10" r="7.5" fill="#fcd34d" stroke={INK} strokeWidth="1.8" />
      <path
        d="M12 17.5 l 0 2.5 M9 21 h 6"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M2.5 10 l -1.8 0 M23.3 10 l -1.8 0 M5.4 3.6 l -1.2 -1.2 M19.8 2.4 l -1.2 1.2"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.5 8 q 1 -1.6 2.5 0 M9.5 12 q 1 -1.6 2.5 0"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Small floating decoration: plant in a pot. */
export function FloatPlant(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <path
        d="M6 16 h 12 l -2.2 5 h -7.6 z"
        fill="#f4a4d4"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 16 c 0 -5 3 -8 6 -11 c -1 5 -2 9 -4 12"
        fill="#86efac"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 16 c 0 -6 -4 -9 -8 -11 c 2 5 4 9 6 13"
        fill="#86efac"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 12.5 c 0 -3 1.5 -5 3.5 -7 c -0.5 3 -1.5 6 -3 8"
        fill="#86efac"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}