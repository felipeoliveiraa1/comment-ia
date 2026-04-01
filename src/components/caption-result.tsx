"use client";

import toast from "react-hot-toast";

interface CaptionResultProps {
  readonly caption: string;
  readonly onRegenerate: () => void;
  readonly isLoading: boolean;
}

export default function CaptionResult({
  caption,
  onRegenerate,
  isLoading,
}: CaptionResultProps) {
  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(caption);
      toast.success("Legenda copiada!");
    } catch {
      toast.error("Não foi possível copiar. Tente manualmente.");
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">
          Legenda Gerada
        </h2>
        <span className="self-start sm:self-auto text-[11px] sm:text-xs text-green-600 bg-green-50 px-2 py-0.5 sm:py-1 rounded-full font-medium">
          Pronta para WhatsApp
        </span>
      </div>

      <div className="whatsapp-preview">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#e2d8cc]">
          <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-[#25D366] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.389 0-4.636-.828-6.438-2.273l-.377-.307-2.596.87.87-2.596-.307-.377A9.953 9.953 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm font-medium text-[#54656f]">Preview WhatsApp</span>
        </div>
        <p className="whitespace-pre-wrap text-[13px] sm:text-sm leading-relaxed text-[#111b21] wrap-break-word">
          {caption}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
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
          Copiar Legenda
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isLoading}
          className="btn-secondary flex-1 sm:flex-none flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Gerar outra versão
        </button>
      </div>
    </div>
  );
}
