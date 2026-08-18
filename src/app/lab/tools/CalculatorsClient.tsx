"use client";

import { useState } from "react";

const UNITS = ["bits", "Kb", "Mb", "Gb", "Tb"] as const;

function unitIndex(unit: string): number {
  return UNITS.findIndex((u) => u.toLowerCase() === unit.trim().toLowerCase());
}

/** Converts a value from one unit to another using binary steps of 1024. */
function convert(value: number, from: string, to: string): number | null {
  const fromIndex = unitIndex(from);
  const toIndex = unitIndex(to);
  if (fromIndex === -1 || toIndex === -1) return null;
  return value * Math.pow(2, 10 * (toIndex - fromIndex));
}

type TransferState = {
  size: string;
  sizeUnit: string;
  speed: string;
  speedUnit: string;
  result: string | null;
};

type StorageState = {
  value: string;
  from: string;
  to: string;
  result: string | null;
};

type DataUsageState = {
  monthly: string;
  result: string | null;
};

function formatTime(seconds: number): string {
  if (seconds >= 86400) {
    return `${seconds / 86400 >= 10 ? Math.round(seconds / 86400) : (seconds / 86400).toFixed(2)} days`;
  }
  if (seconds >= 3600) return `${(seconds / 3600).toFixed(2)} hours`;
  if (seconds >= 60) return `${(seconds / 60).toFixed(2)} minutes`;
  return `${seconds.toFixed(2)} seconds`;
}

function parsePositive(value: string): number | null {
  const number = parseFloat(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

export function CalculatorsClient() {
  const [transfer, setTransfer] = useState<TransferState>({
    size: "",
    sizeUnit: "Mb",
    speed: "",
    speedUnit: "Mb",
    result: null,
  });
  const [storage, setStorage] = useState<StorageState>({
    value: "",
    from: "Mb",
    to: "Gb",
    result: null,
  });
  const [dataUsage, setDataUsage] = useState<DataUsageState>({
    monthly: "",
    result: null,
  });

  function calculateTransfer() {
    const size = parsePositive(transfer.size);
    if (size === null) {
      setTransfer((t) => ({ ...t, result: "Enter a file size above zero." }));
      return;
    }
    const speed = parsePositive(transfer.speed);
    if (speed === null) {
      setTransfer((t) => ({ ...t, result: "Enter a speed above zero." }));
      return;
    }
    const sizeBits = convert(size, transfer.sizeUnit, "bits");
    const speedBits = convert(speed, transfer.speedUnit, "bits");
    if (sizeBits === null || speedBits === null || speedBits <= 0) {
      setTransfer((t) => ({ ...t, result: "Those units aren't recognised." }));
      return;
    }
    setTransfer((t) => ({ ...t, result: `Transfer time ≈ ${formatTime(sizeBits / speedBits)}` }));
  }

  function calculateStorage() {
    const value = parsePositive(storage.value);
    if (value === null) {
      setStorage((s) => ({ ...s, result: "Enter a value above zero." }));
      return;
    }
    const result = convert(value, storage.from, storage.to);
    if (result === null) {
      setStorage((s) => ({ ...s, result: "Those units aren't recognised." }));
      return;
    }
    setStorage((s) => ({ ...s, result: `${result.toFixed(2)} ${s.to}` }));
  }

  function calculateDataUsage() {
    const monthly = parsePositive(dataUsage.monthly);
    if (monthly === null) {
      setDataUsage((d) => ({ ...d, result: "Enter your monthly data above zero." }));
      return;
    }
    setDataUsage((d) => ({ ...d, result: `${(monthly / 30).toFixed(2)} GB per day` }));
  }

  const inputClass =
    "h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none";
  const labelClass = "mb-1.5 block text-sm font-semibold text-ink";
  const unitSelectClass =
    "h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-base text-ink focus:border-brand focus:outline-none";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
          Bandwidth / transfer time
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-mist">
          How long will a download take? Transfer time = file size ÷ speed.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="calc-transfer-size" className={labelClass}>
              File size
            </label>
            <div className="flex gap-2">
              <input
                id="calc-transfer-size"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={transfer.size}
                onChange={(event) =>
                  setTransfer((t) => ({ ...t, size: event.target.value, result: null }))
                }
                className={inputClass}
                placeholder="e.g. 700"
              />
              <select
                aria-label="File size unit"
                value={transfer.sizeUnit}
                onChange={(event) =>
                  setTransfer((t) => ({ ...t, sizeUnit: event.target.value, result: null }))
                }
                className={`${unitSelectClass} w-24 shrink-0`}
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="calc-transfer-speed" className={labelClass}>
              Speed
            </label>
            <div className="flex gap-2">
              <input
                id="calc-transfer-speed"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={transfer.speed}
                onChange={(event) =>
                  setTransfer((t) => ({ ...t, speed: event.target.value, result: null }))
                }
                className={inputClass}
                placeholder="e.g. 2"
              />
              <select
                aria-label="Speed unit"
                value={transfer.speedUnit}
                onChange={(event) =>
                  setTransfer((t) => ({ ...t, speedUnit: event.target.value, result: null }))
                }
                className={`${unitSelectClass} w-24 shrink-0`}
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={calculateTransfer}
          className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-strong sm:w-auto sm:px-8"
        >
          Calculate
        </button>

        {transfer.result !== null && (
          <p role="status" className="mt-3 font-mono text-sm font-semibold text-brand-strong">
            {transfer.result}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
          Storage converter
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-mist">
          Convert between bits, Kb, Mb, Gb and Tb (1 Kb = 1024 bits).
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="calc-storage-value" className={labelClass}>
              Value
            </label>
            <input
              id="calc-storage-value"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={storage.value}
              onChange={(event) =>
                setStorage((s) => ({ ...s, value: event.target.value, result: null }))
              }
              className={inputClass}
              placeholder="e.g. 1"
            />
          </div>
          <div>
            <label htmlFor="calc-storage-from" className={labelClass}>
              From
            </label>
            <select
              id="calc-storage-from"
              value={storage.from}
              onChange={(event) =>
                setStorage((s) => ({ ...s, from: event.target.value, result: null }))
              }
              className={unitSelectClass}
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="calc-storage-to" className={labelClass}>
              To
            </label>
            <select
              id="calc-storage-to"
              value={storage.to}
              onChange={(event) =>
                setStorage((s) => ({ ...s, to: event.target.value, result: null }))
              }
              className={unitSelectClass}
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={calculateStorage}
          className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-strong sm:w-auto sm:px-8"
        >
          Convert
        </button>

        {storage.result !== null && (
          <p role="status" className="mt-3 font-mono text-sm font-semibold text-brand-strong">
            {storage.result}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
          Monthly data usage
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-mist">
          What does a monthly data plan allow per day? Monthly ÷ 30 days.
        </p>

        <div className="mt-4 max-w-xs">
          <label htmlFor="calc-data-monthly" className={labelClass}>
            Monthly data (GB)
          </label>
          <input
            id="calc-data-monthly"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            value={dataUsage.monthly}
            onChange={(event) =>
              setDataUsage((d) => ({ ...d, monthly: event.target.value, result: null }))
            }
            className={inputClass}
            placeholder="e.g. 5"
          />
        </div>

        <button
          type="button"
          onClick={calculateDataUsage}
          className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-strong sm:w-auto sm:px-8"
        >
          Calculate daily average
        </button>

        {dataUsage.result !== null && (
          <p role="status" className="mt-3 font-mono text-sm font-semibold text-brand-strong">
            {dataUsage.result}
          </p>
        )}
      </section>
    </div>
  );
}
