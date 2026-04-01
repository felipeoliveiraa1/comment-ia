"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import type { CaptionOutput } from "@/types/caption";

const STORAGE_KEY = "comment-ia-history";
const MAX_HISTORY_ITEMS = 20;

function loadHistory(): CaptionOutput[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CaptionOutput[]) : [];
  } catch {
    return [];
  }
}

function persistHistory(items: CaptionOutput[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

interface CaptionHistoryProps {
  readonly latestCaption: CaptionOutput | null;
}

export default function CaptionHistory({ latestCaption }: CaptionHistoryProps) {
  const [history, setHistory] = useState<CaptionOutput[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addToHistory = useCallback((item: CaptionOutput) => {
    setHistory((prev) => {
      const isDuplicate = prev.some((h) => h.id === item.id);
      if (isDuplicate) return prev;
      const updated = [item, ...prev].slice(0, MAX_HISTORY_ITEMS);
      persistHistory(updated);
      return updated;
    });
  }, []);

  useEffect(() => {
    if (latestCaption) {
      addToHistory(latestCaption);
    }
  }, [latestCaption, addToHistory]);

  function handleClearHistory(): void {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Histórico limpo!");
  }

  async function handleCopyItem(caption: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(caption);
      toast.success("Legenda copiada!");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  }

  if (history.length === 0) return null;

  return (
    <div className="mt-6 sm:mt-8">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground active:text-foreground transition-colors min-h-[44px]"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
        Histórico ({history.length})
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3 animate-fade-in">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-xs text-red-500 hover:text-red-700 active:text-red-700 transition-colors min-h-[44px] flex items-center"
            >
              Limpar histórico
            </button>
          </div>

          {history.map((item) => (
            <div
              key={item.id}
              className="history-item relative bg-background border border-foreground/10 rounded-xl p-3 sm:p-4 active:border-foreground/20 sm:hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2 pr-10">
                <span className="text-xs font-medium text-foreground/50 truncate">
                  {item.productName}
                </span>
                <span className="text-[11px] sm:text-xs text-foreground/40 shrink-0 ml-2">
                  {new Date(item.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-[13px] sm:text-sm text-foreground/70 line-clamp-3 whitespace-pre-wrap wrap-break-word pr-6 sm:pr-0">
                {item.caption}
              </p>
              <button
                type="button"
                onClick={() => handleCopyItem(item.caption)}
                className="history-copy-btn"
                aria-label="Copiar legenda"
              >
                <svg
                  className="w-4 h-4 text-foreground/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" />
                  <path
                    d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
