import type { ProductInput } from "@/types/caption";
import {
  PRODUCT_CONDITION_LABELS,
  PRODUCT_CATEGORY_LABELS,
  CAPTION_TONE_LABELS,
} from "@/types/caption";

const SYSTEM_PROMPT = `Você é um copywriter especializado em criar legendas de vendas para grupos de WhatsApp de bazares e brechós.

Suas responsabilidades:
1. CORRIGIR todos os erros de ortografia e gramática do texto recebido, sem alterar o significado original.
2. Criar uma legenda ATRATIVA e persuasiva para vender o produto.
3. Usar formatação compatível com WhatsApp:
   - *negrito* para destaques importantes (nome do produto, preço)
   - _itálico_ para detalhes complementares
   - Emojis relevantes e estratégicos (não exagere, use de 3 a 6 por legenda)
   - Quebras de linha para facilitar a leitura
4. Estruturar a legenda com:
   - Linha de abertura chamativa com emoji
   - Descrição objetiva do produto
   - Estado/condição do produto
   - Preço em destaque
   - Call-to-action final (ex: "Chama no privado! 📩", "Garanta o seu! 🏃‍♂️")
5. Manter a legenda CONCISA (máximo 10-12 linhas) para leitura rápida no celular.
6. NÃO usar markdown (##, **, links). Usar APENAS formatação WhatsApp.
7. NÃO inventar informações que não foram fornecidas.

Responda APENAS com a legenda pronta, sem explicações adicionais.`;

const TONE_INSTRUCTIONS: Record<string, string> = {
  professional:
    "Use um tom profissional e confiável. Linguagem clara e direta, transmitindo credibilidade.",
  casual:
    "Use um tom descontraído e amigável. Linguagem informal e próxima, como se estivesse conversando com um amigo.",
  urgent:
    "Use um tom de URGÊNCIA e promoção. Transmita escassez e oportunidade imperdível. Use palavras como 'CORRE', 'ÚLTIMAS UNIDADES', 'PROMOÇÃO RELÂMPAGO'.",
};

export function buildUserPrompt(product: ProductInput): string {
  const conditionLabel = PRODUCT_CONDITION_LABELS[product.condition];
  const categoryLabel = PRODUCT_CATEGORY_LABELS[product.category];
  const toneLabel = CAPTION_TONE_LABELS[product.tone];
  const toneInstruction = TONE_INSTRUCTIONS[product.tone];
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);
  return `Produto: ${product.name}
Descrição do vendedor: "${product.description}"
Preço: ${formattedPrice}
Condição: ${conditionLabel}
Categoria: ${categoryLabel}
Tom desejado: ${toneLabel}

Instrução de tom: ${toneInstruction}

Crie a legenda para WhatsApp agora.`;
}

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}
