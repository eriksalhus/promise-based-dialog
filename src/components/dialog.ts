import { type TemplateResult, html, render } from 'lit';

export interface DialogResult {
  id: number;
  type: 'cancel' | 'close' | 'reset' | 'submit';
  [key: string]: any;
}

export interface DialogOptions {
  content: TemplateResult;
  root?: ShadowRoot | Document | HTMLElement;
}

export function renderDialog({
  resolve,
  reject,
  content,
}: {
  content: TemplateResult;
  resolve: (result: DialogResult) => void;
  reject: (result: DialogResult) => void;
}) {
  const id = Date.now();
  return html`
    <dialog
      id="${id}"
      inert
      loading
      @submit="${function (this: HTMLDialogElement, event: Event) {
        resolve({
          id,
          type: 'submit',
          formData: Object.fromEntries(
            new FormData(event.target as HTMLFormElement)
          ),
        });
      }}"
      @reset="${function (this: HTMLDialogElement, _event: Event) {
        reject({ id, type: 'reset' });
      }}"
      @close="${async function (this: HTMLDialogElement, _event: Event) {
        await animationsComplete(this);
        this.remove();
      }}"
    >
      ${content}
    </dialog>
  `;
}

// wait for all dialog animations to complete their promises
const animationsComplete = (element: HTMLElement) =>
  Promise.allSettled(
    element.getAnimations().map((animation) => animation.finished)
  );

export async function dialog({
  content,
  root = document.body,
}: DialogOptions): Promise<DialogResult> {
  return new Promise<DialogResult>((resolve, reject) => {
    const renderBuffer = document.createDocumentFragment();

    render(renderDialog({ content, resolve, reject }), renderBuffer);
    root.appendChild(renderBuffer);

    const dialogElements = root.querySelectorAll('dialog');
    const dialogElement = dialogElements[dialogElements.length - 1];

    dialogElement?.removeAttribute('inert');
    dialogElement?.removeAttribute('loading');

    dialogElement?.showModal();
  });
}
