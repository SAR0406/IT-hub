"use client";

import { useLayoutEffect, useRef, useState } from "react";

export type Tab = {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

type Props = {
  tabs: Tab[];
};

/**
 * Pattern 2 — Learn / Practice / Quiz tabs. Underline indicator (easier to
 * scan than a top border), keyed with transform so it slides between tabs.
 * Icon roles stay geometric SVGs — no emoji (project convention).
 */
export function ChapterTabs({ tabs }: Props) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === active)
  );
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => {
    const button = buttonRefs.current[activeIndex];
    if (!button) return;
    setUnderline({ left: button.offsetLeft, width: button.offsetWidth });
  }, [activeIndex, tabs]);

  useLayoutEffect(() => {
    function measure() {
      const button = buttonRefs.current[activeIndex];
      if (!button) return;
      setUnderline({ left: button.offsetLeft, width: button.offsetWidth });
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  return (
    <div>
      <div
        className="relative border-b-2 border-pm-line"
        role="tablist"
        aria-label="Chapter modes"
      >
        {tabs.map((tab, i) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                buttonRefs.current[i] = el;
              }}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.id)}
              className={`relative inline-flex items-center gap-2 px-5 py-4 text-base font-medium transition-colors duration-200 ${
                isActive ? "text-pm-teal" : "text-pm-text2 hover:text-pm-ink"
              }`}
            >
              <span className="[&_svg]:h-[18px] [&_svg]:w-[18px]" aria-hidden>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
        <span
          className="ds-tab-underline absolute bottom-[-2px] h-[3px] rounded-sm bg-pm-teal"
          style={{
            left: underline.left,
            width: underline.width,
          }}
          aria-hidden
        />
      </div>
      <div
        role="tabpanel"
        className="pt-6"
        key={active}
        id={`panel-${active}`}
      >
        {tabs[activeIndex]?.content}
      </div>
    </div>
  );
}