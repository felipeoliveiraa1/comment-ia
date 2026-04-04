"use client";

import { useState } from "react";

interface ProductFormProps {
  readonly onSubmit: (description: string) => void;
  readonly isLoading: boolean;
}

const PLACEHOLDER = `Ex: tenis nike air max tamanho 42 usado mas em bom estado só usei umas 3 vezes ta bem conservado vendo por 150 reais...`;

export default function ProductForm({ onSubmit, isLoading }: ProductFormProps) {
  const [description, setDescription] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (description.trim().length > 0) {
      onSubmit(description);
    }
  }

  const isValid = description.trim().length >= 5;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="form-label">
          Descreva o produto
        </label>
        <textarea
          id="description"
          placeholder={PLACEHOLDER}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input min-h-[140px] sm:min-h-[160px] resize-y"
          rows={5}
          required
        />
        <p className="mt-1.5 text-[12px] sm:text-xs text-foreground/40">
          Escreva do seu jeito, com erros e tudo. A IA corrige e monta a legenda.
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
