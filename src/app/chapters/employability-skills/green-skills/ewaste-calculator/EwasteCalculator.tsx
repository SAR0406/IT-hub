"use client";

import { useState } from "react";

const EWASTE_FACTORS: Record<string, { co2PerKg: number; label: string }> = {
  smartphone: { co2PerKg: 16, label: "Smartphone (~0.2 kg)" },
  laptop: { co2PerKg: 30, label: "Laptop (~2.5 kg)" },
  desktop: { co2PerKg: 25, label: "Desktop PC (~5 kg)" },
  monitor: { co2PerKg: 20, label: "Monitor (~5 kg)" },
  tablet: { co2PerKg: 18, label: "Tablet (~0.5 kg)" },
  printer: { co2PerKg: 15, label: "Printer (~8 kg)" },
  router: { co2PerKg: 12, label: "Router/Modem (~0.3 kg)" },
  cables: { co2PerKg: 8, label: "Cables/Accessories (~0.5 kg)" },
};

const WEIGHTS: Record<string, number> = {
  smartphone: 0.2,
  laptop: 2.5,
  desktop: 5,
  monitor: 5,
  tablet: 0.5,
  printer: 8,
  router: 0.3,
  cables: 0.5,
};

const RECYCLING_BENEFITS: Record<string, number> = {
  gold: 97,
  silver: 95,
  copper: 85,
  aluminum: 95,
  plastic: 75,
  glass: 80,
};

const GREEN_TIPS = [
  "Extend device lifespan — repair before replace",
  "Donate working devices to schools/NGOs",
  "Use certified e-waste recyclers (R2, e-Stewards)",
  "Enable power management — sleep/hibernate modes",
  "Virtualize servers — reduce hardware count",
  "Choose ENERGY STAR certified equipment",
  "Recycle batteries separately — toxic materials",
  "Wipe data securely before recycling",
];

const GREEN_CONCEPTS = [
  {
    title: "Sustainable Development Goals (SDGs)",
    body: "UN's 17 goals including Climate Action (#13), Responsible Consumption (#12), and Life on Land (#15). IT directly impacts these through energy use and e-waste.",
  },
  {
    title: "Circular Economy",
    body: "Design out waste → keep products in use → regenerate natural systems. For IT: modular design, repairability, refurbishment, recycling.",
  },
  {
    title: "Carbon Footprint",
    body: "Total GHG emissions caused directly/indirectly. ICT sector: ~2-4% of global emissions (comparable to aviation). Data centers, networks, devices all contribute.",
  },
  {
    title: "Extended Producer Responsibility (EPR)",
    body: "Manufacturers responsible for end-of-life disposal. Drives design for recyclability. India's E-Waste (Management) Rules 2022 enforce this.",
  },
];

export function EwasteCalculator() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleChange = (device: string, value: string) => {
    const num = parseInt(value, 10) || 0;
    setQuantities((prev) => ({ ...prev, [device]: Math.max(0, Math.min(100, num)) }));
  };

  const totals = (() => {
    let totalWeight = 0;
    let totalCO2 = 0;
    const breakdown: Array<{ device: string; qty: number; weight: number; co2: number }> = [];

    for (const [device, qty] of Object.entries(quantities)) {
      if (qty <= 0) continue;
      const factor = EWASTE_FACTORS[device];
      const weight = qty * (WEIGHTS[device] ?? 1);
      const co2 = weight * factor.co2PerKg;
      totalWeight += weight;
      totalCO2 += co2;
      breakdown.push({ device: factor.label, qty, weight, co2 });
    }

    return { totalWeight, totalCO2, breakdown };
  })();
  const hasItems = Object.values(quantities).some((q) => q > 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="lg:col-span-1">
        <div className="p-4 rounded-lg border border-zinc-200 bg-white">
          <h2 className="font-mono text-sm text-brand mb-4">Your Devices</h2>
          <p className="text-sm text-slate-500 mb-4">
            Enter how many of each device you plan to dispose of or replace.
          </p>
          <div className="space-y-3">
            {Object.entries(EWASTE_FACTORS).map(([key, factor]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-zinc-100 hover:border-brand/30 transition-colors"
              >
                <div className="flex-1">
                  <label htmlFor={`device-${key}`} className="text-sm font-medium text-ink">
                    {factor.label}
                  </label>
                  <p className="text-xs text-slate-400">~{factor.co2PerKg} kg CO₂ per kg</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id={`device-${key}`}
                    type="number"
                    min="0"
                    max="100"
                    value={quantities[key] ?? ""}
                    onChange={(event) => handleChange(key, event.target.value)}
                    className="w-20 border rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <span className="text-sm text-slate-400">units</span>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowResults(true)}
            disabled={!hasItems}
            className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-50"
          >
            Calculate Impact
          </button>
        </div>

        <div className="mt-6 p-4 rounded-lg border border-zinc-200 bg-white">
          <h2 className="font-mono text-sm text-brand mb-4">Green IT Practices</h2>
          <div className="space-y-3">
            {GREEN_TIPS.map((tip, index) => (
              <div key={index} className="flex gap-2 text-sm text-slate-600">
                <span className="text-brand">✓</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lg:col-span-1">
        <div className="p-4 rounded-lg border border-zinc-200 bg-white">
          <h2 className="font-mono text-sm text-brand mb-4">Impact Assessment</h2>

          {showResults && hasItems ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 mb-6">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-center">
                  <div className="text-3xl font-bold text-green-700">
                    {totals.totalWeight.toFixed(1)}
                  </div>
                  <div className="text-sm text-green-600">Total Weight (kg)</div>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-center">
                  <div className="text-3xl font-bold text-amber-700">
                    {totals.totalCO2.toFixed(0)}
                  </div>
                  <div className="text-sm text-amber-600">CO₂ Equivalent (kg)</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-ink mb-3">Device Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200">
                        <th className="text-left pb-2 font-mono text-brand">Device</th>
                        <th className="text-right pb-2 font-mono text-brand">Qty</th>
                        <th className="text-right pb-2 font-mono text-brand">Weight (kg)</th>
                        <th className="text-right pb-2 font-mono text-brand">CO₂ (kg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {totals.breakdown.map((item) => (
                        <tr key={item.device}>
                          <td className="py-2">{item.device}</td>
                          <td className="py-2 text-right font-mono">{item.qty}</td>
                          <td className="py-2 text-right font-mono">{item.weight.toFixed(1)}</td>
                          <td className="py-2 text-right font-mono">{item.co2.toFixed(0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                <h3 className="font-medium text-blue-800 mb-2">💡 Recycling Potential</h3>
                <p className="text-sm text-blue-700 mb-2">
                  Proper recycling recovers valuable materials and reduces mining impact:
                </p>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                  {Object.entries(RECYCLING_BENEFITS).map(([material, recovery]) => (
                    <li key={material}>
                      <strong>{material.charAt(0).toUpperCase() + material.slice(1)}:</strong> ~
                      {recovery}% recovery rate vs mining
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 p-4 rounded-lg border border-zinc-200 bg-white">
                <h3 className="font-medium text-ink mb-2">Context</h3>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li>
                    {totals.totalCO2.toFixed(0)} kg CO₂ ≈ <strong>{(totals.totalCO2 / 2.3).toFixed(0)} km</strong>{" "}
                    driven by average car
                  </li>
                  <li>
                    Equivalent to <strong>{(totals.totalCO2 / 21).toFixed(1)}</strong> trees&rsquo;
                    yearly CO₂ absorption
                  </li>
                  <li>
                    Global e-waste: <strong>53.6 Mt/year</strong> (2019), only 17.4% recycled
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <div className="text-4xl mb-2">📱</div>
              <p>Enter device quantities and click &ldquo;Calculate Impact&rdquo;</p>
              <p className="text-sm mt-1">
                Results show weight, CO₂ footprint, and recycling potential
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 rounded-lg border border-zinc-200 bg-white">
          <h2 className="font-mono text-sm text-brand mb-4">Green Skills: Key Concepts</h2>
          <div className="space-y-3 text-sm text-slate-600">
            {GREEN_CONCEPTS.map((concept) => (
              <div key={concept.title} className="p-3 rounded-lg border border-zinc-100">
                <h4 className="font-medium text-ink mb-1">{concept.title}</h4>
                <p>{concept.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
