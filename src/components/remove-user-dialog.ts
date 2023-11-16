import { html } from 'lit';

const avatars = [
  'a3bf6b1d5254a10808d64b52e71a3e5d',
  '801d583156a58dd471e49c3d6ebebc44',
  '728d77ce762eba95cce245a55dc94050',
  'c7c8fdafb02f85e5960dda582db1af88',
  'c12a582a7550d1658b287476ed66e6da',
  '30046aa5a7238a3ebf64f1396101c4dc',
  '945241ba2ddd23623c9c1934264f6ac2',
  '284470c11c380507f1085e2fde32d467',
];

export function renderRemoveUserDialogContent() {
  return html`
    <form method="dialog">
      <article>
        <section class="warning-message">
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
            <title>A warning icon</title>
            <path
              stroke="currentColor"
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            ></path>
            <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor"></line>
            <line
              x1="12"
              y1="17"
              x2="12.01"
              y2="17"
              stroke="currentColor"
            ></line>
          </svg>
          <p>Are you sure you want to remove this user?</p>
        </section>
      </article>
      <footer>
        <menu>
          <button
            autofocus
            type="reset"
            @click="${(event: MouseEvent) => {
              (event.target as HTMLElement).closest('dialog')?.close('cancel');
            }}"
          >
            Cancel
          </button>
          <button type="submit" value="confirm">Confirm</button>
        </menu>
      </footer>
    </form>
  `;
}
