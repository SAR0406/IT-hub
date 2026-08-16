import type { SVGProps } from "react";

type SketchProps = SVGProps<SVGSVGElement>;

const INK = "#1e293b";
const SUN = "#fcd34d";
const MINT = "#86efac";
const AQUA = "#7dd3d3";
const BLUSH = "#f4a4d4";
const SKY = "#e0f2fe";
const PAPER = "#faf8f6";

function sketchBase(props: SketchProps, viewBox: string): SketchProps {
  return {
    viewBox,
    fill: "none",
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

/* ---------------------------------- icons --------------------------------- */

/** Hand-drawn open book — "Learn Anywhere". */
export function BookSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <path
        d="M12 5.5 q -2.5 -2 -6 0 l 0 12 q 3.5 -2 6 0 z"
        fill={AQUA}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 5.5 q 2.5 -2 6 0 l 0 12 q -3.5 -2 -6 0 z"
        fill={MINT}
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
        fill={SKY}
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

/** Quiz paper with A–D options. */
export function QuizSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <path
        d="M5.5 3.5 H 15 L 18.5 7 V 20.5 H 5.5 Z"
        fill={SKY}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M15 3.5 V 7 H 18.5" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 10.6 l 1.2 -0.9 l 1.2 1.2 l 2.6 -3" stroke="#0891b2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.2 14.6 h 6.4 M8.2 17.4 h 4.6" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5.5 3.8 l -1.2 -1.2" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Speech bubble — Employability Skills. */
export function ChatSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <path
        d="M4 4.5 C 4 3.1 5.2 2 6.8 2 H 17.2 C 18.8 2 20 3.1 20 4.5 V 13.5 C 20 14.9 18.8 16 17.2 16 H 11.2 L 7 19.5 V 16 H 6.8 C 5.2 16 4 14.9 4 13.5 Z"
        fill={SKY}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="8.4" cy="9" r="1.4" fill={INK} />
      <circle cx="12" cy="9" r="1.4" fill={INK} />
      <circle cx="15.6" cy="9" r="1.4" fill={INK} />
      <path d="M6.5 3.2 l 0.8 -1.4 M17.8 3.2 l -0.8 -1.4" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Desktop monitor with code — Computer Organization. */
export function MonitorSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <rect x="3.5" y="3" width="17" height="12.5" rx="2" fill={SKY} stroke={INK} strokeWidth="1.8" />
      <path
        d="M6.5 6.5 l 1.6 1.6 l 2.2 -2.6 M6.5 10.5 l 1.6 1.6 l 2.2 -2.6"
        stroke="#0891b2"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 15.5 V 18 M9 18 h 6.5 M7.5 20.5 C 10 21.4, 14 21.4, 16.8 20.4" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17.5 4.5 l 0.9 -1.5" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Globe with nodes — Networking & Internet. */
export function GlobeSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <circle cx="12" cy="12" r="8.5" fill={SKY} stroke={INK} strokeWidth="1.8" />
      <path d="M3.5 12 h 17" stroke={INK} strokeWidth="1.6" />
      <path d="M6.4 6.6 C 9 4.9 15 4.9 17.6 6.6 C 15 8.3 9 8.3 6.4 6.6 Z" stroke={INK} strokeWidth="1.6" fill="none" />
      <path d="M5 17.4 C 7.5 15.7 16.5 15.7 19 17.4" stroke={INK} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <circle cx="7.2" cy="7.4" r="1.3" fill={MINT} stroke={INK} strokeWidth="1.2" />
      <circle cx="16.8" cy="16.6" r="1.3" fill={MINT} stroke={INK} strokeWidth="1.2" />
      <circle cx="17.4" cy="8" r="1.1" fill={SUN} stroke={INK} strokeWidth="1.2" />
      <path d="M4.8 5.2 l -1 -1.6" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Database cylinder — RDBMS. */
export function DatabaseSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <path
        d="M4.5 7 C 4.5 5 8.5 3.8 12 3.8 C 15.5 3.8 19.5 5 19.5 7 C 19.5 9 15.5 10.2 12 10.2 C 8.5 10.2 4.5 9 4.5 7 Z"
        fill={SUN}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 7 V 16 C 4.5 18 8.5 19.2 12 19.2 C 15.5 19.2 19.5 18 19.5 16 V 7"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M4.5 16 C 4.5 18 8.5 19.2 12 19.2 C 15.5 19.2 19.5 18 19.5 16" stroke={INK} strokeWidth="1.8" fill="none" />
      <path d="M7.5 8.8 C 9 9.6 10.5 10 12 10 C 13.5 10 15 9.6 16.5 8.8" stroke={INK} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M16.8 4.2 l 0.9 -1.5" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Coffee cup with steam — Fundamentals of Java. */
export function JavaCupSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <path
        d="M5 5.5 H 15 V 11 C 15 14.5 12.6 16.6 10 16.6 C 7.4 16.6 5 14.5 5 11 Z"
        fill={SUN}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M15 7 H 17.2 C 18.7 7 19.4 8.4 18.4 9.6 C 17.7 10.4 16.4 10.6 15.4 10.2"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M8.6 3.6 C 7.6 2.4 9.6 1.4 8.6 0.2 M11.6 3.6 C 10.6 2.4 12.6 1.4 11.6 0.2" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M5.5 3.8 l -0.8 -1.3" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Document with a check — Office Automation Tools. */
export function PaperSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <path
        d="M6 3.5 H 15 L 18.5 7 V 20.5 H 6 Z"
        fill={PAPER}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M15 3.5 V 7 H 18.5" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8.4 10.5 H 15.2 M8.4 13.5 H 15.8 M8.4 16.5 H 12.6" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.4 13.5 l 1.3 1.3 l 2.2 -2.4" stroke="#10b981" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Four-point sparkle. */
export function SparkleSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <path
        d="M12 2.5 C 13 8, 13.8 9.4, 21.5 12 C 13.8 14.6, 13 16, 12 21.5 C 11 16, 10.2 14.6, 2.5 12 C 10.2 9.4, 11 8, 12 2.5 Z"
        fill={SUN}
        stroke={INK}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Hand-drawn five-point star. */
export function StarSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <path
        d="M12 3 L 14.6 9.4 L 21.4 10 L 16.2 14.6 L 17.8 21.2 L 12 17.6 L 6.2 21.2 L 7.8 14.6 L 2.6 10 L 9.4 9.4 Z"
        fill={SUN}
        stroke={INK}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pencil. */
export function PencilSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <path d="M9 2.8 H 15 V 4.6 H 9 Z" fill={BLUSH} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 4.6 H 15 V 14.5 H 9 Z" fill={SUN} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.2 14.5 H 14.8 L 12 20.6 Z" fill="#fcd9b8" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 4.6 H 15" stroke={INK} strokeWidth="1.4" />
      <path d="M12 7.4 l 0 3.2 M10.6 9 l 2.8 0" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/** Graduation cap. */
export function CapSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <path d="M12 3.2 L 22 8 L 12 12.8 L 2 8 Z" fill={AQUA} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M5.4 10.2 V 13.8 C 5.4 15.6 9.6 16.8 12 16.8 C 14.4 16.8 18.6 15.6 18.6 13.8 V 10.2" stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M22 8 V 13.4" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="20.8" cy="14.8" r="1.2" fill={SUN} stroke={INK} strokeWidth="1.3" />
      <path d="M3.4 5.8 l 0.9 -1.5" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Circle with a check — approved / done. */
export function CheckSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <circle cx="12" cy="12" r="9" fill={MINT} stroke={INK} strokeWidth="1.8" />
      <path d="M7.2 12.4 l 3.2 3.2 l 6.4 -7" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.2 4.2 l -1.2 -1.2 M19.8 4.2 l 1.2 -1.2" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* --------------------------------- scenes --------------------------------- */

/** Hero scene — a student at their desk with laptop, books, coffee and ideas. */
export function HeroSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 360 300")}>
      {/* Floor shadow */}
      <ellipse cx="180" cy="280" rx="132" ry="7" fill={INK} opacity="0.05" />

      {/* Wall clock */}
      <circle cx="54" cy="52" r="19" fill="#ffffff" stroke={INK} strokeWidth="2.4" />
      <path d="M54 52 L 54 41 M54 52 L 62 56" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="54" cy="52" r="2.2" fill={INK} />
      <path d="M54 35 v 3 M54 66 v 3 M37 52 h 3 M68 52 h 3" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />

      {/* Student — behind the laptop */}
      <path
        d="M146 132 q -6 44 6 86 h 56 q 12 -42 6 -86 q -17 12 -34 12 q -17 0 -34 -12 z"
        fill={BLUSH}
        fillOpacity="0.45"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M150 136 q 10 48 4 80 M210 136 q -10 48 -4 80" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="180" cy="98" r="27" fill={BLUSH} stroke={INK} strokeWidth="2.4" />
      <path
        d="M153 94 a 27 27 0 0 1 54 0 q -4 -14 -16 -17 a 20 20 0 0 0 -6 -12 q 0 10 -8 13 q -4 -7 -10 -9 q 8 7 4 13 q -10 -1 -18 0 z"
        fill={INK}
        stroke={INK}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="170" cy="97" r="2.3" fill={INK} />
      <circle cx="190" cy="97" r="2.3" fill={INK} />
      <path d="M170 110 q 10 8 20 0" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="163" cy="105" r="3.2" fill="#ec4899" fillOpacity="0.35" />
      <circle cx="197" cy="105" r="3.2" fill="#ec4899" fillOpacity="0.35" />

      {/* Laptop */}
      <path d="M134 150 L 226 150 L 232 218 L 128 218 Z" fill={SKY} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path
        d="M142 178 l 16 13 l 20 -24 l 15 17 l 19 -13 l 16 9"
        stroke="#0891b2"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M142 202 h 52" stroke="#db2777" strokeWidth="3" strokeLinecap="round" />
      <path d="M142 213 h 38" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M120 218 L 240 218 L 236 232 L 124 232 Z" fill={PAPER} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M132 225 h 96" stroke={INK} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
      <path d="M170 218 v -6" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />

      {/* Desk */}
      <path d="M14 232 q 80 -6 166 -2 q 86 4 166 2" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M20 242 h 320" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
      <path d="M52 242 l -6 28 M308 242 l 6 28" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M40 270 h 14 M308 270 h 14" stroke={INK} strokeWidth="3" strokeLinecap="round" />

      {/* Books */}
      <path d="M34 226 h 48 q 4 4 0 8 h -48 q -4 -4 0 -8 z" fill={AQUA} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <g transform="rotate(-4 52 216)">
        <path d="M28 212 h 48 q 4 4 0 8 h -48 q -4 -4 0 -8 z" fill={SUN} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      </g>
      <g transform="rotate(3 62 202)">
        <path d="M38 198 h 48 q 4 4 0 8 h -48 q -4 -4 0 -8 z" fill={MINT} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      </g>
      <path d="M60 198 v 10 l -3.5 -3.5 l -3.5 3.5 v -10 z" fill={BLUSH} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />

      {/* Coffee mug */}
      <path
        d="M262 202 h 34 v 22 a 9 9 0 0 1 -9 9 h -16 a 9 9 0 0 1 -9 -9 z"
        fill={SUN}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M296 210 h 10 a 8 8 0 0 1 0 16 h -8" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M270 194 q 6 -6 0 -12 q -6 -6 0 -12 M284 194 q 6 -6 0 -12" stroke={INK} strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* Plant */}
      <path d="M316 246 h 34 l -6 16 h -22 z" fill={BLUSH} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M333 246 q -4 -22 6 -38 q 8 16 2 38" fill={MINT} stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M333 246 q 2 -24 -6 -34 q -6 14 -2 34" fill={MINT} stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M333 238 q 3 -12 -2 -16 q -2 8 0 12" fill={MINT} stroke={INK} strokeWidth="2" strokeLinecap="round" />

      {/* Speech bubble */}
      <path
        d="M210 38 c 0 -11 9 -19 21 -19 h 78 c 12 0 21 8 21 19 v 28 c 0 11 -9 19 -21 19 h -56 l -12 15 v -15 h -10 c -12 0 -21 -8 -21 -19 z"
        fill="#ffffff"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <text
        x="222"
        y="63"
        fontSize="12.5"
        fontWeight="700"
        fill={INK}
        style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
      >
        <tspan fill="#db2777">6/6 </tspan>
        units done!
      </text>

      {/* Sparkles */}
      <path d="M120 44 l 2.2 4.6 4.8 2 -4.8 2 -2.2 4.6 -2.2 -4.6 -4.8 -2 4.8 -2 z" fill={SUN} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M300 120 l 1.9 4 4.2 1.8 -4.2 1.8 -1.9 4 -1.9 -4 -4.2 -1.8 4.2 -1.8 z" fill={BLUSH} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M152 192 l 1.6 3.4 3.6 1.5 -3.6 1.5 -1.6 3.4 -1.6 -3.4 -3.6 -1.5 3.6 -1.5 z" fill={MINT} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/** Teacher at the blackboard — the admin side of the hub. */
export function TeacherSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 320 260")}>
      {/* Floor + shadow */}
      <path d="M16 218 q 70 -4 144 -2 q 72 2 144 2" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      <ellipse cx="246" cy="220" rx="72" ry="6" fill={INK} opacity="0.05" />

      {/* Blackboard */}
      <rect x="24" y="24" width="196" height="146" rx="8" fill={INK} stroke={INK} strokeWidth="3" />
      <path d="M32 32 h 180 M32 162 h 180" stroke="#334155" strokeWidth="1.4" />
      <text
        x="38"
        y="70"
        fontSize="17"
        fontWeight="500"
        fill="#e2e8f0"
        style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
      >
        select *
      </text>
      <text
        x="38"
        y="98"
        fontSize="17"
        fontWeight="500"
        fill="#e2e8f0"
        style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
      >
        from syllabus
      </text>
      <text
        x="38"
        y="126"
        fontSize="17"
        fontWeight="500"
        fill={BLUSH}
        style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
      >
        where exam;
      </text>
      <path
        d="M38 138 q 10 5 20 0 q 10 -5 20 0 q 10 5 20 0 q 10 -5 20 0"
        stroke={BLUSH}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Sun doodle on the board */}
      <circle cx="188" cy="58" r="11" stroke={SUN} strokeWidth="2.4" fill="none" />
      <path
        d="M188 40 v -6 M188 76 v 6 M170 58 h -6 M206 58 h 6 M175 45 l -5 -4 M201 45 l 5 -4 M175 71 l -5 4 M201 71 l 5 4"
        stroke={SUN}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Chalk tray */}
      <path d="M28 176 h 188" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M52 170 v 6 M64 169 v 6 M76 171 v 6" stroke="#f1f5f9" strokeWidth="2.4" strokeLinecap="round" />

      {/* Teacher */}
      <path
        d="M232 128 q -4 40 4 88 h 40 q 8 -48 4 -88 q -12 8 -24 8 q -12 0 -24 -8 z"
        fill={AQUA}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M242 216 v 4 M268 216 v 4" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="256" cy="100" r="23" fill={AQUA} stroke={INK} strokeWidth="2.4" />
      <path
        d="M233 96 a 23 23 0 0 1 46 0 q -3 -12 -13 -15 a 17 17 0 0 0 -4 -10 q 1 9 -6 11 q -3 -6 -9 -7 q 6 6 2 11 q -9 -1 -16 0 z"
        fill={INK}
        stroke={INK}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="249" cy="98" r="2.2" fill={INK} />
      <circle cx="263" cy="98" r="2.2" fill={INK} />
      <path d="M249 110 q 7 7 14 0" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="242" cy="106" r="3" fill="#ec4899" fillOpacity="0.3" />
      <circle cx="270" cy="106" r="3" fill="#ec4899" fillOpacity="0.3" />

      {/* Arms + pointer */}
      <path d="M236 132 q 12 14 18 24" stroke={INK} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M272 134 q 14 8 18 22" stroke={INK} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M258 156 L 150 84" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M146 81 l 6 3 l -2 -7 z" fill={BLUSH} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />

      {/* Plant */}
      <path d="M296 200 h 16 l -3.5 16 h -9 z" fill={BLUSH} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M304 200 q -2 -14 4 -22 q 5 10 1 22" fill={MINT} stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M304 200 q 2 -16 -3 -20 q -4 9 -1 20" fill={MINT} stroke={INK} strokeWidth="2" strokeLinecap="round" />

      {/* Floating bits */}
      <path d="M44 196 l 2 4.2 4.4 1.8 -4.4 1.8 -2 4.2 -2 -4.2 -4.4 -1.8 4.4 -1.8 z" fill={BLUSH} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M288 58 l 1.7 3.6 3.8 1.6 -3.8 1.6 -1.7 3.6 -1.7 -3.6 -3.8 -1.6 3.8 -1.6 z" fill={MINT} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M302 128 l 1.4 3 3.2 1.3 -3.2 1.3 -1.4 3 -1.4 -3 -3.2 -1.3 3.2 -1.3 z" fill={SUN} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------- decorations ------------------------------ */

/** Small floating open book. */
export function FloatBook(props: SketchProps) {
  return <BookSketch {...props} />;
}

/** Small floating lightbulb. */
export function FloatBulb(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <circle cx="12" cy="10" r="7.5" fill={SUN} stroke={INK} strokeWidth="1.8" />
      <path d="M12 17.5 l 0 2.5 M9 21 h 6" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2.5 10 l -1.8 0 M23.3 10 l -1.8 0 M5.4 3.6 l -1.2 -1.2 M19.8 2.4 l -1.2 1.2" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.5 8 q 1 -1.6 2.5 0 M9.5 12 q 1 -1.6 2.5 0" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Small floating plant in a pot. */
export function FloatPlant(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 24 24")}>
      <path d="M6 16 h 12 l -2.2 5 h -7.6 z" fill={BLUSH} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M5 16 h 14" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 16 q -4 -9 1 -13 q 5 7 1 13" fill={MINT} stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 16 q 4 -9 -1 -13 q -5 7 -1 13" fill={MINT} stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 16 q 0 -7 -3 -9 q -1 6 3 9" fill={MINT} stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Hand-drawn circle portrait for the testimonial. */
export function TestimonialAvatar(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 64 64")}>
      <circle cx="32" cy="32" r="28" fill={BLUSH} opacity="0.35" stroke={INK} strokeWidth="2.5" />
      <circle cx="32" cy="30" r="13" fill={BLUSH} stroke={INK} strokeWidth="2.5" />
      <path d="M19 30 a 13 13 0 0 1 26 0 z" fill={BLUSH} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M17 30 h 30 v 3.2 h -30 z" fill={INK} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="32" cy="17" r="3.4" fill={SUN} stroke={INK} strokeWidth="1.8" />
      <circle cx="27.5" cy="30" r="1.8" fill={INK} />
      <circle cx="36.5" cy="30" r="1.8" fill={INK} />
      <path d="M27.5 36 q 4.5 4.5 9 0" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="34" r="2.4" fill="#ec4899" fillOpacity="0.4" />
      <circle cx="40" cy="34" r="2.4" fill="#ec4899" fillOpacity="0.4" />
    </svg>
  );
}