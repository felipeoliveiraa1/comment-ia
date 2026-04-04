export interface ProductInput {
  readonly description: string;
}

export interface CaptionOutput {
  readonly id: string;
  readonly caption: string;
  readonly preview: string;
  readonly createdAt: string;
}

export interface GenerateRequest {
  readonly description: string;
}

export interface GenerateResponse {
  readonly caption: string;
}

export interface GenerateErrorResponse {
  readonly error: string;
}
