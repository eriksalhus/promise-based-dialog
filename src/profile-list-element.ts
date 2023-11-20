import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { dialog } from './components/dialog';
import { renderAddUserDialogContent } from './components/add-user-dialog';
import { renderRemoveUserDialogContent } from './components/remove-user-dialog';

export interface Profile {
  id: string;
  avatar: string;
}

@customElement('profile-list-element')
export class ProfileListElement extends LitElement {
  @property({ type: Array })
  profiles: Profile[] = [];
  @property({ type: Array })
  removedProfileIds: string[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.renderProfile = this.renderProfile.bind(this);
    this.removeProfile = this.removeProfile.bind(this);
    this.handleAddProfile = this.handleAddProfile.bind(this);
    this.addEventListener('click', this);
  }

  handleEvent(event: Event) {
    if (event.target instanceof HTMLButtonElement) {
      if (event.target.hasAttribute('add-user')) {
        this.handleAddProfile();
      }
    }
  }

  render() {
    return html`
      ${this.profiles.map(this.renderProfile)}
      <slot></slot>
    `;
  }

  renderProfile(profile: Profile) {
    const isNew = !(this.renderRoot as ShadowRoot).getElementById(profile.id);

    return html`
      <div
        class="user ${isNew ? 'new' : ''}"
        id="${profile.id}"
        ?removing="${this.removedProfileIds.includes(profile.id)}"
        @animationend="${(event: AnimationEvent) => {
          if (event.animationName !== 'fade-out') {
            //throw new Error('Unexpected animation name');
            console.log('Unexpected animation name');

            return;
          }

          this.profiles = this.profiles.filter(
            (_profile) => _profile.id !== profile.id
          );
          this.removedProfileIds = this.removedProfileIds.filter(
            (id) => id !== profile.id
          );
        }}"
      >
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
          id: `profile-${Date.now()}`,
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
      this.removedProfileIds = [...this.removedProfileIds, id];
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

    .user > button {
      position: absolute;
      inset-block-start: 0;
      inset-inline-end: 0;
      border-radius: var(--radius-round);
      padding: 0.75ch;
      aspect-ratio: 1;
      flex-shrink: 0;
    }

    .new {
      animation-name: fade-in;
      animation-direction: forwards;
      animation-timing-function: ease-out;
      animation-duration: 250ms;
    }
    [removing] {
      animation-name: fade-out;
      animation-direction: forwards;
      animation-timing-function: ease-out;
      animation-duration: 250ms;
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

    @keyframes fade-in {
      0% {
        opacity: 0;
        transform: scale(0);
      }
      90% {
        opacity: 1;
        transform: scale(1.1);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes fade-out {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      10% {
        opacity: 1;
        transform: scale(1.1);
      }
      100% {
        opacity: 0;
        transform: scale(0);
      }
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }
  `;
}
