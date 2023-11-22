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

  constructor() {
    super();

    this.renderProfile = this.renderProfile.bind(this);
    this.createRemoveProfileHandler =
      this.createRemoveProfileHandler.bind(this);
    this.handleAddProfile = this.handleAddProfile.bind(this);
  }

  render() {
    return html`
      <link rel="stylesheet" href="./src/index.css" />
      ${this.profiles.map(this.renderProfile)}
      <button
        class="user"
        aria-label="Add user"
        @click="${this.handleAddProfile}"
      >
        <svg
          style="pointer-events: none"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor"></line>
          <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor"></line>
        </svg>
      </button>
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
        <img src="${profile.avatar}" alt="Profile avatar" />
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

  async handleAddProfile() {
    try {
      const { id, formData } = await dialog(renderAddUserDialogContent());

      const file = formData.userimage as File;
      if (!file.size) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      const { target }: ProgressEvent<FileReader> = await new Promise(
        (resolve) => (reader.onload = resolve)
      );

      if (target) {
        this.profiles = [
          ...this.profiles,
          {
            id: `profile-${Date.now()}`,
            avatar: target.result as string,
          },
        ];
      }
      console.info(`Dialog id="${id}" resolved`, formData);
    } catch (result) {
      console.error(`Dialog rejected`, result);
    }
  }

  createRemoveProfileHandler = (id: string) => {
    return async (event: MouseEvent) => {
      try {
        await dialog(renderRemoveUserDialogContent(), {
          relativePlacementElement: event.target as HTMLElement,
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
