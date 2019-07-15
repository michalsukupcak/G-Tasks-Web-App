import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-selector/iron-selector';
import '@polymer/neon-animation/animations/fade-out-animation';
import '@polymer/neon-animation/animations/scale-up-animation';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable';
import '@polymer/paper-ripple/paper-ripple';
import '@polymer/paper-spinner/paper-spinner';
import './gt-app-drawer-tasklist.js';

/**
 * GTTAppDrawer element.
 *
 * @polymer
 * @customElement
 */
class GTTAppDrawer extends PolymerElement {

  static get template() { return html`

    <!-- CSS -->
    <style include="gt-styles"></style>
    <style>

      :host { display: block; }

      hr { border: none; border-top: 1px solid var(--separator-color); margin: 6px 24px 6px 0; }

      div.loader {}
      div.loader paper-spinner { margin: 9px 0 6px 24px; }

      iron-selector div.tasklist { border-radius: 0 36px 36px 0; margin: 0 24px 0 0; position: relative; }
      iron-selector div.tasklist:hover { background: var(--hover-color); }
      iron-selector div.tasklist.iron-selected { background: var(--highlight-color); color: var(--primary-color); font-weight: bold; }

      paper-button.drawer-button { border-radius: 24px; display: block; font-size: .8em; margin: 6px 24px 6px 14px; translate: .2s ease; }
      paper-button.drawer-button:hover { background: var(--hover-color); }
      paper-button.drawer-button.new { --paper-button-ink-color: var(--primary-color); color: var(--primary-color) }
      paper-button.drawer-button iron-icon { --iron-icon-height: 16px; --iron-icon-width: 16px; margin: 0 6px 0 0; }
      paper-button.drawer-button span { margin: 0 9px 0 0; }

    </style>

    <!-- Separator -->
    <hr>

    <!-- Loading spinner -->
    <template is="dom-if" if="[[showLoader]]">
      <div id="loader" class="loader">
        <paper-spinner active=""></paper-spinner>
      </div>
    </template>

    <!-- List of tasks lists -->
    <iron-selector fallback-selection="0" selected="{{selectedTasklist}}">
      <template is="dom-repeat" items="{{tasklists}}" as="tasklist">
        <div class="tasklist">
          <gt-app-drawer-tasklist tasklist="{{tasklist}}" on-tasklist-deleted="__onTasklistDeleted"></gt-app-drawer-tasklist>
          <!--<paper-ripple></paper-ripple>-->
        </div>
      </template>
    </iron-selector>

    <!-- Create new task button -->
    <template is="dom-if" if="[[!showLoader]]">
      <paper-button class="drawer-button new" on-click="__onClickOpenCreateNewTasklistDialog">
        <iron-icon icon="icons:add"></iron-icon>
        <span>New list</span>
      </paper-button>
    </template>

    <!-- Separator -->
    <hr>

    <!-- About button -->
    <paper-button class="drawer-button">
      <iron-icon icon="icons:help-outline"></iron-icon>
      <span>About</span>
    </paper-button>

    <!-- Logout button -->
    <paper-button class="drawer-button" on-click="__onClickLogout">
      <iron-icon icon="icons:power-settings-new"></iron-icon>
      <span>Logout</span>
    </paper-button>

    <!-- Create new task list dialog box -->
    <paper-dialog id="createNewTasklistDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="__clearCreateNewTasklistTitleInput" on-iron-overlay-opened="__focusCreateNewTasklistTitleInput">
      <h2>Create new task list</h2>
      <paper-dialog-scrollable>
        <paper-input label="List name" id="createNewTasklistTitleInput" on-keyup="__onKeyUpCreateNewTasklistTitleInput">
        </paper-input>
      </paper-dialog-scrollable>
      <div class="buttons">
        <paper-button dialog-confirm="" on-click="__onClickCreateNewTasklist">Create new list</paper-button>
        <paper-button dialog-dismiss="">Cancel</paper-button>
      </div>
    </paper-dialog>
    
  `; }

  /** Define element name */
  static get is() { return 'gt-app-drawer'; }

  static get properties() {
    return {

      /**
       * Opened tasklist.
       * @see https://developers.google.com/tasks/v1/reference/tasklists#resource
       */
      openedTasklist: {
        type: Object,
        notify: true
      },

      /**
       * Array of tasklists.
       * @see https://developers.google.com/tasks/v1/reference/tasklists#resource
       */
      tasklists: {
        type: Array,
        notify: true
      },

      /**
       * Array index of selected task in tasklists iron-selector.
       */
      selectedTasklist: {
        type: Number,
        observer: '',
        readonly: true
      },

      /**
       * Determines if tasklist loader should be visible (true) or not (false).
       */
      showLoader: {
        type: Boolean,
        value: false
      }

    }
  }

  static get observers() {
    return [
        '__selectedTasklistChanged(selectedTasklist, tasklists)'
    ]
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Element lifecycle */

  // Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Observers and event listeners */

  __onClickCreateNewTasklist() {
    this.__createNewTaskList();
  }

  __onClickLogout() {
    this.__logout();
  }

  __onClickOpenCreateNewTasklistDialog() {
    this.__openCreateNewTaskListDialog();
  }

  __onKeyUpCreateNewTasklistTitleInput(event) {
    if (event.keyCode === 13) {
      this.__createNewTasklistTitleInput();
    }
  }

  __onTasklistDeleted(event) {
    this.__removeTasklistByIndex(event.model.index);
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Public API */

  // Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Protected API */

  //Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Private API */

  /**
   * Clears createNewTasklistTitleInput's value.
   *
   * @private
   */
  __clearCreateNewTasklistTitleInput() {
    this.$.createNewTasklistTitleInput.value = '';
  }

  /**
   * Creates new tasklist.
   * @see https://developers.google.com/tasks/v1/reference/tasklists/insert
   *
   * @private
   */
  __createNewTaskList() {
    let title = this.$.createNewTasklistTitleInput.value;
    if (title) {
      this.set('showLoader', true);
      gapi.client.request({
        path: 'https://www.googleapis.com/tasks/v1/users/@me/lists',
        method: 'POST',
        body: {
          title: title
        }
      }).then(response => {
        this.set('showLoader', false);
        this.push('tasklists', response.result);
      });
    }
  }

  /**
   * Listens to keyUp events from createNewTasklistTitleInput and triggers __createNewTasklist on "enter" key.
   *
   * @private
   */
  __createNewTasklistTitleInput() {
      this.$.createNewTasklistDialog.close();
      this.__createNewTaskList();
  }


  /**
   * Focus createNewTasklistTitleInput's input.
   *
   * @private
   */
  __focusCreateNewTasklistTitleInput() {
    this.$.createNewTasklistTitleInput.focus();
  }

  /**
   * Log user out of the app.
   * @see https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleauthsignout
   *
   * @private
   */
  __logout() {
    gapi.auth2.getAuthInstance().signOut();
  }

  /**
   * Opens createNewTasklistDialog.
   *
   * @private
   */
  __openCreateNewTaskListDialog() {
    this.$.createNewTasklistDialog.open();
  }

  /**
   * Removes deleted task from tasklists array.
   *
   * @param index
   * @private
   */
  __removeTasklistByIndex(index) {
    this.splice('tasklists', index, 1);
  }

  /**
   * Reacts to selectedTasklist changes and sets openedTasklist according to selection.
   *
   * @private
   */
  __selectedTasklistChanged(selectedTasklist, tasklists) {
    if (selectedTasklist === undefined || tasklists === undefined) {
      return;
    }
    this.set('openedTasklist', tasklists[selectedTasklist]);
  }

}

/** Register element */
window.customElements.define(GTTAppDrawer.is, GTTAppDrawer);
