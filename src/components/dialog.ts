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

// custom events to be added to <dialog>
const dialogClosingEvent = new Event('dialog:closing', { bubbles: true });
const dialogClosedEvent = new Event('dialog:closed', { bubbles: true });
const dialogOpeningEvent = new Event('dialog:opening', { bubbles: true });
const dialogOpenedEvent = new Event('dialog:opened', { bubbles: true });
const dialogRemovedEvent = new Event('dialog:removed', { bubbles: true });

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
      @submit="${async function (this: HTMLDialogElement, event: Event) {
        /* resolve({
          id,
          type: 'submit',
          formData: Object.fromEntries(
            new FormData(event.target as HTMLFormElement)
          ),
        }); */

        this.dataset.resolution = event.type;
        this.formData = Object.fromEntries(
          new FormData(event.target as HTMLFormElement)
        );
      }}"
      @reset="${async function (this: HTMLDialogElement, event: Event) {
        //reject({ id, type: 'reset' });
        this.dataset.resolution = event.type;
      }}"
      @close="${async function (this: HTMLDialogElement, _event: Event) {
        const resolutionType = this.dataset.resolution;
        this.setAttribute('inert', '');
        this.dispatchEvent(dialogClosingEvent);
        await animationsComplete(this);
        this.dispatchEvent(dialogClosedEvent);
        this.remove();
        if (resolutionType === 'submit') {
          resolve({ id, type: resolutionType, formData: this.formData });
        }
        dispatchEvent(dialogRemovedEvent);
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
  return new Promise<DialogResult>(async (resolve, reject) => {
    const renderBuffer = document.createDocumentFragment();

    render(renderDialog({ content, resolve, reject }), renderBuffer);
    root.appendChild(renderBuffer);

    const dialogElements = root.querySelectorAll('dialog');
    const dialogElement = dialogElements[dialogElements.length - 1];

    dialogElement.dispatchEvent(dialogOpeningEvent);
    dialogElement?.removeAttribute('loading');
    dialogElement?.showModal();
    await animationsComplete(dialogElement);
    dialogElement?.removeAttribute('inert');
    dialogElement.dispatchEvent(dialogOpenedEvent);
  });
}
