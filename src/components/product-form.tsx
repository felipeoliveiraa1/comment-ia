"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";

interface ProductFormProps {
  readonly onSubmit: (description: string) => void;
  readonly isLoading: boolean;
}

interface SpeechRecognitionEvent {
  readonly results: SpeechRecognitionResultList;
  readonly resultIndex: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

const PLACEHOLDER = `Ex: tenis nike air max tamanho 42 usado mas em bom estado só usei umas 3 vezes ta bem conservado vendo por 150 reais...`;

function isSpeechSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export default function ProductForm({ onSubmit, isLoading }: ProductFormProps) {
  const [description, setDescription] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [hasSpeech, setHasSpeech] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    setHasSpeech(isSpeechSupported());
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechAPI) {
      toast.error("Seu navegador não suporta reconhecimento de voz.");
      return;
    }
    const recognition = new SpeechAPI();
    recognition.lang = "pt-BR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;
    let finalTranscript = "";
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim = transcript;
        }
      }
      setDescription((prev) => {
        const base = prev.endsWith(" ") || prev.length === 0 ? prev : prev + " ";
        return (base + finalTranscript + interim).trimStart();
      });
    };
    recognition.onerror = (event) => {
      if (event.error !== "aborted") {
        toast.error("Erro no microfone. Verifique as permissões.");
      }
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    finalTranscript = "";
    recognition.start();
    setIsListening(true);
  }, []);

  function toggleVoice(): void {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (isListening) stopListening();
    if (description.trim().length > 0) {
      onSubmit(description);
    }
  }

  const isValid = description.trim().length >= 5;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="description" className="form-label mb-0!">
            Descreva o produto
          </label>
          {hasSpeech && (
            <button
              type="button"
              onClick={toggleVoice}
              className={`voice-btn ${isListening ? "voice-btn-active" : ""}`}
              aria-label={isListening ? "Parar gravação" : "Falar descrição"}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                />
              </svg>
              <span className="text-xs font-medium">
                {isListening ? "Parar" : "Voz"}
              </span>
            </button>
          )}
        </div>
        <div className="relative">
          <textarea
            id="description"
            placeholder={PLACEHOLDER}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`form-input min-h-[140px] sm:min-h-[160px] resize-y ${isListening ? "ring-2 ring-red-400/50 border-red-400" : ""}`}
            rows={5}
            required
          />
          {isListening && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-red-500 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[11px] font-medium">Ouvindo...</span>
            </div>
          )}
        </div>
        <p className="mt-1.5 text-[12px] sm:text-xs text-foreground/40">
          {hasSpeech
            ? "Escreva ou use o microfone para ditar. A IA corrige e monta a legenda."
            : "Escreva do seu jeito, com erros e tudo. A IA corrige e monta a legenda."}
        </p>
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Gerando legenda...
          </span>
        ) : (
          "Gerar Legenda"
        )}
      </button>
    </form>
  );
}
