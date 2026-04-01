export const PRODUCT_CONDITIONS = ["new", "semi-new", "used"] as const;
export type ProductCondition = (typeof PRODUCT_CONDITIONS)[number];

export const PRODUCT_CONDITION_LABELS: Record<ProductCondition, string> = {
  new: "Novo",
  "semi-new": "Seminovo",
  used: "Usado",
};

export const PRODUCT_CATEGORIES = [
  "clothing",
  "electronics",
  "home",
  "toys",
  "accessories",
  "other",
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  clothing: "Roupas",
  electronics: "Eletrônicos",
  home: "Casa e Decoração",
  toys: "Brinquedos",
  accessories: "Acessórios",
  other: "Outros",
};

export const CAPTION_TONES = ["professional", "casual", "urgent"] as const;
export type CaptionTone = (typeof CAPTION_TONES)[number];

export const CAPTION_TONE_LABELS: Record<CaptionTone, string> = {
  professional: "Profissional",
  casual: "Descontraído",
  urgent: "Urgente / Promoção",
};

export interface ProductInput {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly condition: ProductCondition;
  readonly category: ProductCategory;
  readonly tone: CaptionTone;
}

export interface CaptionOutput {
  readonly id: string;
  readonly caption: string;
  readonly productName: string;
  readonly createdAt: string;
}

export interface GenerateRequest {
  readonly product: ProductInput;
}

export interface GenerateResponse {
  readonly caption: string;
}

export interface GenerateErrorResponse {
  readonly error: string;
}
