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

/** Hero scene — student at a laptop, coffee at hand, ideas floating around. */
export function HeroSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 360 300")}>
      {/* Desk */}
      <path d="M18 236 C 60 228, 150 228, 200 236" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M46 236 L 38 268" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M174 236 L 182 268" stroke={INK} strokeWidth="3" strokeLinecap="round" />

      {/* Coffee mug */}
      <path
        d="M52 186 h 34 v 26 a 8 8 0 0 1 -8 8 h -18 a 8 8 0 0 1 -8 -8 z"
        fill={SUN}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M86 192 h 12 a 6 6 0 0 1 0 12 h -10" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 176 c 3 -6 -3 -10 0 -16 M72 176 c 3 -6 -3 -10 0 -16" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />

      {/* Laptop */}
      <path d="M108 140 L 216 146 L 212 182 L 104 176 Z" fill={SKY} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M126 156 l 12 10 l 14 -16 l 16 20 l 18 -14 l 12 8" stroke="#0891b2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M104 176 C 140 186, 180 186, 212 182 L 206 190 C 174 194, 138 194, 112 184 Z"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Student */}
      <circle cx="266" cy="126" r="26" fill={BLUSH} stroke={INK} strokeWidth="2.5" />
      <path d="M244 112 c 0 -16 18 -22 30 -12 c -4 -2 -12 -2 -16 2" fill={INK} stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <circle cx="258" cy="124" r="2.4" fill={INK} />
      <circle cx="274" cy="124" r="2.4" fill={INK} />
      <path d="M258 138 q 8 8 16 0" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path
        d="M242 158 c -4 26 2 44 6 58 h 36 c 4 -14 10 -32 6 -58 c -8 6 -16 6 -24 4 c -8 2 -16 2 -24 -4 z"
        fill={BLUSH}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M246 178 c -10 8 -14 18 -16 28" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M280 178 c 6 4 10 10 12 18 c -14 4 -26 6 -36 8" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Speech bubble */}
      <path
        d="M196 44 C 196 34 204 27 215 27 H 282 C 293 27 301 34 301 44 V 78 C 301 88 293 95 282 95 H 246 L 230 108 L 233 95 H 215 C 204 95 196 88 196 78 Z"
        fill="#ffffff"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <text x="215" y="62" className="font-mono" fontSize="15" fontWeight="600" fill={INK}>
        SQL done!
      </text>
      <path d="M239 96 l -4 10 l 10 -8" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" fill="none" />

      {/* Floating book */}
      <g transform="rotate(-8 66 52)">
        <path d="M46 30 q 10 -6 20 0 l 0 34 q -10 -6 -20 0 z" fill={AQUA} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M66 30 q 10 -6 20 0 l 0 34 q -10 -6 -20 0 z" fill={MINT} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path
          d="M50 36 q 6 -3 12 0 M50 42 q 6 -3 12 0 M70 36 q 6 -3 12 0 M70 42 q 6 -3 12 0"
          stroke={INK}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Graduation cap */}
      <g transform="rotate(8 316 30)">
        <path d="M304 18 L 316 23 L 328 18 L 316 13 Z" fill={AQUA} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M307 24 V 27.4 C 307 29.4 311.5 30.6 316 30.6 C 320.5 30.6 325 29.4 325 27.4 V 24" stroke={INK} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M328 23 V 28.4" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="326.8" cy="29.8" r="1.4" fill={SUN} stroke={INK} strokeWidth="1.6" />
      </g>

      {/* Lightbulb */}
      <g transform="rotate(10 300 150)">
        <circle cx="300" cy="140" r="15" fill={SUN} stroke={INK} strokeWidth="2.5" />
        <path d="M300 155 l 0 5 M294 163 h 12" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M281 132 l -7 -5 M319 132 l 7 -5 M277 145 l -9 2 M323 145 l 9 2" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M293 136 q 3 -4 7 0 M293 144 q 3 -4 7 0" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Pencil */}
      <g transform="rotate(24 330 235)">
        <path d="M322 230 h 8 v 2.6 h -8 z" fill={BLUSH} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M322 232.6 h 8 v 7.4 h -8 z" fill={SUN} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M322.4 240 h 7.2 l -3.6 5.4 z" fill="#fcd9b8" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      </g>

      {/* Plant */}
      <g transform="rotate(-6 320 250)">
        <path d="M302 262 h 36 l -6 16 h -24 z" fill={BLUSH} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M320 262 c 0 -10 6 -18 12 -24 c -2 10 -4 20 -8 26" fill={MINT} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M320 262 c 0 -12 -8 -20 -16 -26 c 4 10 8 20 12 28" fill={MINT} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M320 250 c 0 -8 2 -12 6 -16 c 0 8 -2 14 -6 20" fill={MINT} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Sparkles */}
      <path d="M52 130 l 2.2 4.6 l 4.8 2 l -4.8 2 l -2.2 4.6 l -2.2 -4.6 l -4.8 -2 l 4.8 -2 Z" fill={SUN} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M140 40 l 1.7 3.6 l 3.8 1.6 l -3.8 1.6 l -1.7 3.6 l -1.7 -3.6 l -3.8 -1.6 l 3.8 -1.6 Z" fill={BLUSH} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M336 120 l 1.5 3.2 l 3.4 1.4 l -3.4 1.4 l -1.5 3.2 l -1.5 -3.2 l -3.4 -1.4 l 3.4 -1.4 Z" fill={MINT} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/** Teacher at the blackboard — the admin side of the hub. */
export function TeacherSketch(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 320 260")}>
      {/* Blackboard */}
      <rect x="22" y="24" width="190" height="140" rx="6" fill={INK} stroke={INK} strokeWidth="3" />
      <path d="M30 32 h 174 M30 156 h 174" stroke="#334155" strokeWidth="1.6" />
      <text x="40" y="66" className="font-mono" fontSize="18" fill="#e2e8f0">select *</text>
      <text x="40" y="92" className="font-mono" fontSize="18" fill="#e2e8f0">from syllabus</text>
      <text x="40" y="118" className="font-mono" fontSize="18" fill="#f4a4d4">where exam;</text>
      <path d="M160 48 c 8 0 14 6 14 13 c 0 9 -8 14 -16 11" fill="none" stroke={SUN} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M160 48 l 4 24 M160 48 l -8 22 M160 48 l 12 16" stroke={BLUSH} strokeWidth="2.2" strokeLinecap="round" />
      {/* Chalk tray */}
      <path d="M26 170 H 208" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M56 164 v 6 M66 163 v 6 M76 165 v 6" stroke="#f1f5f9" strokeWidth="2.4" strokeLinecap="round" />

      {/* Teacher */}
      <circle cx="248" cy="86" r="24" fill={AQUA} stroke={INK} strokeWidth="2.5" />
      <path d="M228 74 c 0 -15 16 -20 27 -11 c -4 -2 -11 -2 -15 2" fill={INK} stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <circle cx="241" cy="84" r="2.2" fill={INK} />
      <circle cx="256" cy="84" r="2.2" fill={INK} />
      <path d="M241 96 q 7 7 14 0" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path
        d="M225 116 c -3 22 2 38 5 50 h 36 c 3 -12 8 -28 5 -50 c -8 5 -15 5 -23 3 c -8 2 -15 2 -23 -3 z"
        fill={AQUA}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Pointer arm */}
      <path d="M228 130 c -12 4 -18 2 -24 -2" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M204 128 L 128 96" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M120 93 l 8 3 l 0 -8 z" fill={BLUSH} stroke={INK} strokeWidth="2" strokeLinejoin="round" />

      {/* Floating bits */}
      <path d="M52 44 l 2 4.2 l 4.4 1.8 l -4.4 1.8 l -2 4.2 l -2 -4.2 l -4.4 -1.8 l 4.4 -1.8 Z" fill={SUN} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M292 44 l 1.8 3.8 l 4 1.6 l -4 1.6 l -1.8 3.8 l -1.8 -3.8 l -4 -1.6 l 4 -1.6 Z" fill={MINT} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M284 128 c 0 -4 3 -7 7 -7 c 0 4 -3 7 -7 7 Z" fill={SUN} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M284 128 l -4 10 M284 128 l 4 10" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M36 208 l 2 4 l 4 1.6 l -4 1.6 l -2 4 l -2 -4 l -4 -1.6 l 4 -1.6 Z" fill={BLUSH} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M280 208 c 0 -5 3.6 -8.6 8.6 -8.6 c 0 5 -3.6 8.6 -8.6 8.6 Z" fill={AQUA} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
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
      <path d="M12 16 c 0 -5 3 -8 6 -11 c -1 5 -2 9 -4 12" fill={MINT} stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 16 c 0 -6 -4 -9 -8 -11 c 2 5 4 9 6 13" fill={MINT} stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 12.5 c 0 -3 1.5 -5 3.5 -7 c -0.5 3 -1.5 6 -3 8" fill={MINT} stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Hand-drawn circle portrait for the testimonial. */
export function TestimonialAvatar(props: SketchProps) {
  return (
    <svg {...sketchBase(props, "0 0 64 64")}>
      <circle cx="32" cy="32" r="28" fill={BLUSH} opacity="0.35" stroke={INK} strokeWidth="2.5" />
      <circle cx="32" cy="30" r="13" fill={BLUSH} stroke={INK} strokeWidth="2.5" />
      <path d="M23 24 c 2 -8 12 -10 18 -4 c -3 -1 -8 -1 -11 1" fill={INK} stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="27" cy="30" r="1.8" fill={INK} />
      <circle cx="37" cy="30" r="1.8" fill={INK} />
      <path d="M27 36 q 5 5 10 0" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="21" cy="36" r="2.6" fill={BLUSH} opacity="0.7" />
      <circle cx="43" cy="36" r="2.6" fill={BLUSH} opacity="0.7" />
    </svg>
  );
}