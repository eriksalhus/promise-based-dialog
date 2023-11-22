import { html } from 'lit';

export function renderRemoveUserDialogContent() {
  return html`
    <form method="dialog">
      <article>
        <section class="warning-message">
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
            <title>A warning icon</title>
            <path
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            ></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="18"></line>
          </svg>
          <p>Are you sure you want to remove this user?</p>
        </section>
      </article>
      <footer>
        <menu>
          <button type="button" autofocus>Cancel</button>
          <button type="submit" value="confirm">Confirm</button>
        </menu>
      </footer>
    </form>
  `;
}
