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
    this.createRemoveProfileHandler =
      this.createRemoveProfileHandler.bind(this);
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
      <link rel="stylesheet" href="./src/index.css" />
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
          @click="${this.createRemoveProfileHandler(profile.id)}"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style="pointer-events: none;"
          >
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" />
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" />
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

  createRemoveProfileHandler = (id: string) => {
    return async (event: MouseEvent) => {
      try {
        await dialog({
          content: renderRemoveUserDialogContent(),
          options: {
            relativePlacementElement: event.target as HTMLElement,
          },
        });
        this.removedProfileIds = [...this.removedProfileIds, id];
      } catch (error) {
        console.log('error', error);
      }
    };
  };

  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
      place-content: center;
      gap: var(--size-5);
      transition: all 250ms ease-in-out;
    }
  `;
}
