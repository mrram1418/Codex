import { GenerationInput, GeneratedPayload } from "@/lib/generation/types";

export interface TemplateRenderer {
  render(input: GenerationInput): GeneratedPayload;
}
