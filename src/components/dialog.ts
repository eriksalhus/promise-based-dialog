import { type TemplateResult, html, render } from 'lit';

type DialogResultType = 'button' | 'reset' | 'submit';
export interface DialogResult {
  id: number;
  type: DialogResultType;
  [key: string]: any;
}

export interface DialogOptions {
  content: TemplateResult;
  options?: {
    root?: ShadowRoot | Document | HTMLElement;
    relativePlacementElement?: HTMLElement;
  };
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
      id="dialog-${id}"
      inert
      @click="${async function (this: HTMLDialogElement, event: MouseEvent) {
        if ((event.target as HTMLButtonElement).type === 'button') {
          this.dataset.resolution = event.type;
          this.close('Cancelled by user');
        }
      }}"
      @submit="${async function (this: HTMLDialogElement, event: Event) {
        this.dataset.resolution = event.type;
        this.formData = Object.fromEntries(
          new FormData(event.target as HTMLFormElement)
        );
      }}"
      @reset="${async function (this: HTMLDialogElement, _event: Event) {
        this.querySelector('form')?.reset();
      }}"
      @close="${async function (this: HTMLDialogElement, _event: Event) {
        const resolutionType = (this.dataset.resolution ??
          'button') as DialogResultType;

        this.setAttribute('inert', '');

        this.dispatchEvent(dialogClosingEvent);

        if (resolutionType === 'submit') {
          resolve({ id, type: resolutionType, formData: this.formData });
        } else {
          reject({ id, type: resolutionType });
        }

        await animationsComplete(this);

        this.dispatchEvent(dialogClosedEvent);

        this.dispatchEvent(dialogRemovedEvent);
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
  options: { root = document.body, relativePlacementElement } = {},
}: DialogOptions): Promise<DialogResult> {
  return new Promise<DialogResult>(async (resolve, reject) => {
    const renderBuffer = document.createDocumentFragment();

    render(renderDialog({ content, resolve, reject }), renderBuffer);
    root.appendChild(renderBuffer);

    const dialogElements = root.querySelectorAll('dialog');
    const dialogElement = dialogElements[dialogElements.length - 1];

    dialogElement.dispatchEvent(dialogOpeningEvent);

    const dialogPosition = getDialogPosition(
      dialogElement,
      relativePlacementElement
    );

    if (dialogPosition) {
      dialogElement.style.top = dialogPosition.top;
      dialogElement.style.left = dialogPosition.left;
      // Dialogs are usually positioned in the center of the screen,
      // so we need to remove the margin to avoid the dialog being centered
      dialogElement.style.margin = 'unset';
      dialogElement.setAttribute('relative-placement', '');
    }

    dialogElement?.showModal();
    dialogElement?.removeAttribute('inert');

    await animationsComplete(dialogElement);

    const autofocusElement =
      dialogElement.querySelector<HTMLElement>('[autofocus]');

    if (autofocusElement) {
      autofocusElement.focus();
    }
    dialogElement.dispatchEvent(dialogOpenedEvent);
  });
}

function getDialogPosition(
  dialogElement: HTMLDialogElement,
  element?: HTMLElement
): { top: string; left: string } | undefined {
  if (element === undefined) {
    return;
  }

  const dialogBounds = dialogElement.getBoundingClientRect();
  const bounds = element.getBoundingClientRect();

  const top = bounds.top - dialogBounds.height;
  const left = bounds.left - dialogBounds.width / 2;

  return { top: `${top > 0 ? top : 10}px`, left: `${left > 0 ? left : 10}px` };
}
