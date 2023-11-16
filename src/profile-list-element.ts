import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { dialog } from './components/dialog';
import { renderAddUserDialogContent } from './components/add-user-dialog';
import { renderRemoveUserDialogContent } from './components/remove-user-dialog';

export interface Profile {
  id: string;
  name: string;
  avatar: string;
}

@customElement('profile-list-element')
export class ProfileListElement extends LitElement {
  @property({ type: Array })
  profiles: Profile[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.renderProfile = this.renderProfile.bind(this);
    this.removeProfile = this.removeProfile.bind(this);
  }

  render() {
    return html`
      ${this.profiles.map(this.renderProfile)}

      <button
        class="user"
        add-user
        @click=${() => this.handleAddProfile()}
        aria-label="Add user"
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor"></line>
          <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor"></line>
        </svg>
      </button>
    `;
  }

  renderProfile(profile: Profile) {
    return html`
      <div class="user">
        <img
          src="https://doodleipsum.com/700x700/avatar-5?i=${profile.avatar}"
          alt=""
        />
        <button
          aria-label="Remove user 1"
          @click="${() => this.removeProfile(profile.id)}"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    `;
  }

  private async handleAddProfile() {
    try {
      const result = await dialog({
        content: renderAddUserDialogContent(),
      });
      this.profiles = [
        ...this.profiles,
        {
          id: this.profiles.length.toString(),
          name: result.formData.username,
          avatar: result.formData.avatar,
        },
      ];
      console.info(`Dialog id="${result.id}" resolved`, result);
    } catch (result) {
      console.error(`Dialog rejected`, result);
    }
  }

  private async removeProfile(id: string) {
    try {
      await dialog({ content: renderRemoveUserDialogContent() });
      this.profiles = this.profiles.filter((profile) => profile.id !== id);
    } catch (error) {
      console.log('error', error);
    }
  }

  static styles = css`
    :host {
      --ratio-square: 1;
      --radius-round: 1e5px;
      --size-m: 1.5rem;
      --border-xs: 1px;
      --color-purple: #9c27b0;
      --color-white: #fff;
      --avatar-width: clamp(7.5rem, 10vw, 10rem);

      display: flex;
      flex-wrap: wrap;
      place-content: center;
      gap: var(--size-5);
      transition: all 250ms ease-in-out;
    }

    .user {
      width: var(--avatar-width);
      aspect-ratio: var(--ratio-square);
      border-radius: var(--radius-round);
      border: var(--border-size-1) solid var(--surface-4);
      display: flex;
      align-items: stretch;
      justify-content: stretch;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .user &button > svg {
      --_icon-size: var(--size-fluid-4);
    }
    .user > button {
      position: absolute;
      inset-block-start: 0;
      inset-inline-end: 0;
      border-radius: var(--radius-round);
      padding: 0.75ch;
      aspect-ratio: 1;
      flex-shrink: 0;
    }

    button[add-user] svg {
      width: 50px;
      height: 50px;
    }

    .user img {
      border-radius: inherit;
      width: 100%;
    }
    line {
      stroke: currentColor;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }
  `;
}
