import './types/global.d.ts';
import './vite-env.d.ts';

declare global {
  interface HTMLElement {
    formData?: unknown;
  }
}
