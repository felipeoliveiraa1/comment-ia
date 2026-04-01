"use client";

import { useState } from "react";
import type {
  ProductInput,
  ProductCondition,
  ProductCategory,
  CaptionTone,
} from "@/types/caption";
import {
  PRODUCT_CONDITIONS,
  PRODUCT_CONDITION_LABELS,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS,
  CAPTION_TONES,
  CAPTION_TONE_LABELS,
} from "@/types/caption";

interface ProductFormProps {
  readonly onSubmit: (product: ProductInput) => void;
  readonly isLoading: boolean;
}

const DEFAULT_FORM_STATE: ProductInput = {
  name: "",
  description: "",
  price: 0,
  condition: "used",
  category: "other",
  tone: "casual",
};

export default function ProductForm({ onSubmit, isLoading }: ProductFormProps) {
  const [form, setForm] = useState<ProductInput>(DEFAULT_FORM_STATE);

  function updateField<K extends keyof ProductInput>(
    field: K,
    value: ProductInput[K]
  ): void {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit(form);
  }

  const isFormValid =
    form.name.trim().length > 0 &&
    form.description.trim().length > 0 &&
    form.price > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <div>
        <label htmlFor="name" className="form-label">
          Nome do Produto
        </label>
        <input
          id="name"
          type="text"
          placeholder="Ex: Tênis Nike Air Max"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="form-input"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="form-label">
          Descrição
        </label>
        <textarea
          id="description"
          placeholder="Descreva o produto como quiser, pode ter erros que a gente corrige..."
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="form-input min-h-[100px] sm:min-h-[120px] resize-y"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label htmlFor="price" className="form-label">
            Preço (R$)
          </label>
          <input
            id="price"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0,00"
            value={form.price || ""}
            onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
            className="form-input"
            required
          />
        </div>

        <div>
          <label htmlFor="condition" className="form-label">
            Condição
          </label>
          <select
            id="condition"
            value={form.condition}
            onChange={(e) =>
              updateField("condition", e.target.value as ProductCondition)
            }
            className="form-input"
          >
            {PRODUCT_CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {PRODUCT_CONDITION_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label htmlFor="category" className="form-label">
            Categoria
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) =>
              updateField("category", e.target.value as ProductCategory)
            }
            className="form-input"
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {PRODUCT_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tone" className="form-label">
            Tom da Legenda
          </label>
          <select
            id="tone"
            value={form.tone}
            onChange={(e) =>
              updateField("tone", e.target.value as CaptionTone)
            }
            className="form-input"
          >
            {CAPTION_TONES.map((t) => (
              <option key={t} value={t}>
                {CAPTION_TONE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isFormValid || isLoading}
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
