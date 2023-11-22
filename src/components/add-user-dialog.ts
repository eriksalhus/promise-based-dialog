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
  '90fb430786896c76d8378d95926ee919',
  '4c274c32d30ad34a53313291cc7e77d8',
  '75dc525986b2aa8f2152d44e238b331a',
  '2f83202afd7333fd1f10f80714beef64',
];

export function renderAddUserDialogContent() {
  return html`
    <form method="dialog">
      <header>
        <section class="icon-headline">
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
          <h3>New User</h3>
        </section>
        <button title="Close dialog" type="button" value="Aborted by the user">
          <title>Close dialog icon</title>
          <svg
            style="pointer-events: none;"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>
      <article>
        <section class="labelled-input">
          <label for="userimage">Upload an image</label>
          <input id="userimage" name="userimage" type="file" />
        </section>
        <small><b>*</b> Maximum upload 1mb</small>
        <!-- <ul class="avatar-list">
          ${avatars.map((hash) => {
          return html` <li>
            <input type="radio" id="${hash}" name="avatar" value="${hash}" />
            <label
              for="${hash}"
              style="background-image: url(https://doodleipsum.com/700x700/avatar-5?i=${hash});"
            ></label>
          </li>`;
        })}
        </ul> -->
      </article>
      <footer>
        <menu>
          <button type="reset">Clear</button>
        </menu>
        <menu>
          <button type="button" autofocus>Cancel</button>
          <button type="submit">Confirm</button>
        </menu>
      </footer>
    </form>
  `;
}
