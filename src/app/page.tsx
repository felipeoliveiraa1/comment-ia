"use client";

import { useState, useCallback, useRef } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import ProductForm from "@/components/product-form";
import CaptionResult from "@/components/caption-result";
import CaptionHistory from "@/components/caption-history";
import type { CaptionOutput, GenerateResponse, GenerateErrorResponse } from "@/types/caption";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [caption, setCaption] = useState<string | null>(null);
  const [latestEntry, setLatestEntry] = useState<CaptionOutput | null>(null);
  const lastDescriptionRef = useRef<string>("");
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(async (description: string) => {
    setIsLoading(true);
    setCaption(null);
    lastDescriptionRef.current = description;
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = (await response.json()) as GenerateResponse | GenerateErrorResponse;
      if ("error" in data) {
        toast.error(data.error);
        return;
      }
      setCaption(data.caption);
      const preview = description.slice(0, 50) + (description.length > 50 ? "..." : "");
      const entry: CaptionOutput = {
        id: generateId(),
        caption: data.caption,
        preview,
        createdAt: new Date().toISOString(),
      };
      setLatestEntry(entry);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      toast.error("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleRegenerate(): void {
    if (lastDescriptionRef.current) {
      handleGenerate(lastDescriptionRef.current);
    }
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "#1a1a1a",
            color: "#fff",
            fontSize: "14px",
            maxWidth: "90vw",
          },
        }}
      />

      <header className="border-b border-foreground/10 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 py-3 sm:py-4 flex items-center gap-3">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              Comment<span className="text-amber-500">IA</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-foreground/50 truncate">
              Legendas inteligentes para seu bazar
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 sm:py-8">
        <section className="mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5">
            Crie legendas que vendem
          </h2>
          <p className="text-foreground/60 text-[13px] sm:text-sm leading-relaxed">
            Descreva o produto do seu jeito e a IA transforma em uma legenda
            pronta para colar no WhatsApp.
          </p>
        </section>

        <section className="card">
          <ProductForm onSubmit={handleGenerate} isLoading={isLoading} />
        </section>

        {caption && (
          <section ref={resultRef} className="card mt-4 sm:mt-6">
            <CaptionResult
              caption={caption}
              onRegenerate={handleRegenerate}
              isLoading={isLoading}
            />
          </section>
        )}

        <CaptionHistory latestCaption={latestEntry} />
      </main>

      <footer className="border-t border-foreground/10 py-4" style={{ paddingBottom: "calc(16px + var(--safe-bottom, 0px))" }}>
        <p className="text-center text-xs text-foreground/40">
          CommentIA &mdash; Gerador de legendas com inteligência artificial
        </p>
      </footer>
    </>
  );
}
