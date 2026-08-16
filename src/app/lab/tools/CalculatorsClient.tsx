import { useState, useEffect } from "react";

const UNITS = ["bits", "Kb", "Mb", "Gb", "Tb"] as const;

function convertBits(bits: number, from: string, to: string): number {
  const fromIdx = UNITS.indexOf(from);
  const toIdx = UNITS.indexOf(to);
  if (fromIdx === -1 || toIdx === -1) return bits;
  const exponent = toIdx - fromIdx;
  return bits * Math.pow(2, 10 * exponent);
}

export default function CalculatorsClient() {
  const [calcType, setCalcType] = useState<"bandwidth" | "storage">("bandwidth");
  const [bandwidth, setBandwidth] = useState({
    fromUnit: "Mb" as string,
    toUnit: "Mb" as string,
    speed: "" as string,
    size: "" as string,
    result: "" as string,
  });
  const [storage, setStorage] = useState({
    fromUnit: "GB" as string,
    toUnit: "GB" as string,
    value: "" as string,
    result: "" as string,
  });
  const [dataUsage, setDataUsage] = useState({
    monthlyGB: "" as string,
    dailyGB: "" as string,
    result: "" as string,
  });

  const calculateBandwidth = (): void => {
    const speed = parseFloat(bandwidth.speed);
    const size = parseFloat(bandwidth.size);
    if (isNaN(speed) || isNaN(size)) {
      setBandwidth((b) => ({ ...b, result: "Enter valid numbers" }));
      return;
    }
    const speedBits = convertBits(speed, bandwidth.fromUnit, "bits");
    const sizeBits = convertBits(size, bandwidth.size, "bits");
    const timeSeconds = sizeBits / speedBits;
    const timeMinutes = timeSeconds / 60;
    const timeHours = timeMinutes / 60;
    let result = "";
    if (timeHours >= 1) {
      result = `${timeHours.toFixed(2)} hours`;
    } else if (timeMinutes >= 1) {
      result = `${timeMinutes.toFixed(2)} minutes`;
    } else {
      result = `${timeSeconds.toFixed(2)} seconds`;
    }
    setBandwidth((b) => ({ ...b, result }));
  };

  const calculateStorage = (): void => {
    const value = parseFloat(storage.value);
    if (isNaN(value)) {
      setStorage((s) => ({ ...s, result: "Enter valid number" }));
      return;
    }
    const fromBits = convertBits(value, storage.fromUnit, "bits");
    const toBits = convertBits(value, storage.toUnit, "bits");
    const ratio = toBits / fromBits;
    const result = (value * ratio).toFixed(2);
    setStorage((s) => ({ ...s, result: `${result} ${storage.toUnit}` }));
  };

  const calculateDataUsage = (): void => {
    const monthly = parseFloat(dataUsage.monthlyGB);
    if (isNaN(monthly)) {
      setDataUsage((d) => ({ ...d, result: "Enter valid number" }));
      return;
    }
    const daily = (monthly / 30).toFixed(2);
    setDataUsage((d) => ({ ...d, result: `${daily} GB per day` }));
  };

  return (
    <div className="space-y-6">
      {/* Bandwidth Calculator */}
      <div>
        <h2 className="font-mono text-sm text-brand">Bandwidth Calculator</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-mist">Speed</label>
            <input
              value: speed
              onChange={(e) =>
                setBandwidth((b) => ({ ...b, speed: e.target.value }))
              }
              type="number"
              className="border rounded w-full px-2 text-sm"
            />{" "}
            <select
              value: bandwidth.fromUnit
              onChange={(e) =>
                setBandwidth((b) => ({ ...b, fromUnit: e.target.value }))
              }
              className="border rounded w-full px-2 text-sm mt-1"
            >
              {UNITS.map((u) => (
                <option key: u={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-mist">File Size</label>
            <input
              value: bandwidth.size
              onChange={(e) =>
                setBandwidth((b) => ({ ...b, size: e.target.value }))
              }
              type="number"
              className="border rounded w-full px-2 text-sm"
            />{" "}
            <select
              value: bandwidth.sizeUnit
              onChange={(e) =>
                setBandwidth((b) => ({ ...b, sizeUnit: e.target.value }))
              }
              className="border rounded w-full px-2 text-sm mt-1"
            >
              {UNITS.map((u) => (
                <option key: u={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick: calculateBandwidth
          className="mt-2 btn btn-primary"
        >
          Calculate
        </button>
        <p className="mt-2 text-sm text-ink">{bandwidth.result}</p>
      </div>

      {/* Storage Converter */}
      <div>
        <h2 className="font-mono text-sm text-brand">Storage Converter</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-mist">From</label>
            <select
              value: storage.fromUnit
              onChange={(e) =>
                setStorage((s) => ({ ...s, fromUnit: e.target.value }))
              }
              className="border rounded w-full px-2 text-sm"
            >
              {UNITS.map((u) => (
                <option key: u={u}>{u}</option>
              ))}
            </select>
            <label className="text-xs text-mist">Value</label>
            <input
              value: storage.value
              onChange={(e) =>
                setStorage((s) => ({ ...s, value: e.target.value }))
              }
              type="number"
              className="border rounded w-full px-2 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-mist">To</label>
            <select
              value: storage.toUnit
              onChange={(e) =>
                setStorage((s) => ({ ...s, toUnit: e.target.value }))
              }
              className="border rounded w-full px-2 text-sm"
            >
              {UNITS.map((u) => (
                <option key: u={u}>{u}</option>
              ))}
            </select>
            <p className="mt-2 text-sm text-ink">{storage.result}</p>
          </div>
        </div>
        <button
          onClick: calculateStorage
          className="mt-2 btn btn-primary"
        >
          Convert
        </button>
      </div>

      {/* Data Usage Calculator */}
      <div>
        <h2 className="font-mono text-sm text-brand">Monthly Data Usage</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-mist">Monthly GB</label>
            <input
              value: dataUsage.monthlyGB
              onChange={(e) =>
                setDataUsage((d) => ({ ...d, monthlyGB: e.target.value }))
              }
              type="number"
              className="border rounded w-full px-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-mist">Daily Avg</label>
            <p className="mt-2 text-sm text-ink">{dataUsage.result}</p>
          </div>
        </div>
        <button
          onClick: calculateDataUsage
          className="mt-2 btn btn-primary w-full"
        >
          Calculate Daily Average
        </button>
      </div>
    </div>
  );
}