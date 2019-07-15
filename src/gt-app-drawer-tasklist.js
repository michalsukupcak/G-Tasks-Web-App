import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/neon-animation/animations/fade-out-animation';
import '@polymer/neon-animation/animations/scale-up-animation';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-menu-button/paper-menu-button';
import './gt-styles.js';

/**
 * GTTAppDrawerTasklist element.
 *
 * @polymer
 * @customElement
 */
class GTTAppDrawerTasklist extends PolymerElement {

  static get template() { return html`

    <!-- CSS -->
    <style include="gt-styles"></style>
    <style>

      /* Element */
      :host { display: block; }

      /* Tasklist */
      div.tasklist { @apply --layout-horizontal; @apply --layout-center; cursor: pointer; font-family: var(--title-font); line-height: 40px; padding: 0 12px 0 24px; position: relative; text-decoration: none; transition: .2s ease; }
      div.tasklist span { @apply --layout-flex; }
      div.tasklist paper-menu-button { color: transparent; padding: 0;  --paper-menu-button-content: { border-radius: 12px; padding: 0 12px; } }
      div.tasklist paper-menu-button paper-icon-button {}
      div.tasklist paper-menu-button div.dropdown-content { @apply --layout-vertical; border-radius: 36px; padding: 12px 0; }
      div.tasklist paper-menu-button div.dropdown-content div { border-radius: 12px; color: var(--primary-text-color); font-weight: normal; margin: 0; padding: 0 9px; position: relative; width: 256px; }
      div.tasklist paper-menu-button div.dropdown-content div:hover { background: var(--hover-color); }
      div.tasklist:hover paper-menu-button { color: var(--primary-text-color); }

    </style>

    <!-- Tasklist -->
    <div class="tasklist">

      <!-- Title -->
      <span>[[tasklist.title]]</span>

      <!-- Menu (rename, delete) -->
      <paper-menu-button id="dropdown">
        <paper-icon-button icon="icons:more-vert" slot="dropdown-trigger"></paper-icon-button>
        <div slot="dropdown-content" class="dropdown-content">

          <!-- Rename button -->
          <div on-click="__onClickOpenRenameTasklistDialog">
            Rename list
            <paper-ripple></paper-ripple>
          </div>

          <!-- Delete button -->
          <div on-click="__onClickOpenDeleteTasklistDialog">
            Delete list
            <paper-ripple></paper-ripple>
          </div>
          
          <!-- Delete all completed tasks button -->
          <div on-click="__onClickOpenDeleteAllCompletedTasksDialog">
            Delete all completed tasks
            <paper-ripple></paper-ripple>
          </div>

        </div>
      </paper-menu-button>

    </div>

    <!-- Rename task list dialog box -->
    <paper-dialog id="renameTasklistDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="__focusRenameTasklistTitleInput">
      <h2>Rename tasklist</h2>
      <div>
        <paper-input label="Title" value="[[tasklist.title]]" id="renameTasklistTitleInput" on-keyup="__onKeyUpRenameTasklistTitleInput">
        </paper-input>
      </div>
      <div class="buttons">
        <paper-button dialog-confirm="" on-click="__onClickRenameTasklist">Rename</paper-button>
        <paper-button dialog-dismiss="">Cancel</paper-button>
      </div>
    </paper-dialog>

    <!-- Delete task list dialog box -->
    <paper-dialog id="deleteTasklistDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation">
      <h2>Delete tasklist?</h2>
      <div>
        Are you sure you want to delete tasklist <strong>[[tasklist.title]]</strong>? This operation cannot be undone!
      </div>
      <div class="buttons">
        <paper-button dialog-confirm="" class="warning" on-click="__onClickDeleteTasklist">Yes, delete the tasklist</paper-button>
        <paper-button dialog-dismiss="">No, keep the tasklist</paper-button>
      </div>
    </paper-dialog>
    
    <!-- Delete all completed tasks dialog box -->
    <paper-dialog id="deleteAllCompletedTasksDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation">
      <h2>Delete completed tasks?</h2>
      <div>
        Are you sure you want to delete all completed tasks in <strong>[[tasklist.title]]</strong>? This operation cannot be undone!
      </div>
      <div class="buttons">
        <paper-button dialog-confirm="" class="warning" on-click="__onClickDeleteAllCompletedTasks">Yes, delete the tasks</paper-button>
        <paper-button dialog-dismiss="">No, keep the tasks</paper-button>
      </div>
    </paper-dialog>
 
  `; }

  /** Define element name */
  static get is() { return 'gt-app-drawer-tasklist'; }

  /** Element properties */
  static get properties() {
    return {

      /**
       * Tasklist resource.
       * @see https://developers.google.com/tasks/v1/reference/tasklists#resource
       */
      tasklist: {
        type: Object,
        notify: true
      }

    }
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Element lifecycle */

  // Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Observers and event listeners */

  __onClickDeleteAllCompletedTasks() {
    this.__deleteAllCompletedTasks();
  }

  __onClickDeleteTasklist() {
    this.__deleteTasklist();
  }

  __onClickRenameTasklist() {
    this.__renameTasklist();
  }

  __onClickOpenDeleteAllCompletedTasksDialog() {
    this.__openDeleteAllCompletedTasksDialog();
  }

  __onClickOpenDeleteTasklistDialog() {
    this.__openDeleteTasklistDialog();
  }

  __onClickOpenRenameTasklistDialog() {
    this.__openRenameTasklistDialog();
  }

  __onKeyUpRenameTasklistTitleInput(event) {
    if (event.keyCode === 13) {
      this.__renameTasklistTitleInput();
    }
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
   * Deletes all completed tasks.
   * @see https://developers.google.com/tasks/v1/reference/tasks/clear
   *
   * @private
   */
  __deleteAllCompletedTasks() {
    gapi.client.request({
      path: 'https://www.googleapis.com/tasks/v1/lists/' + this.tasklist.id + '/clear',
      method: 'POST'
    }).then(response => {
      if (response.body === "") {
        EVENTS.dispatchGlobalEvent(EVENTS.DELETE_ALL_COMPLETED_TASKS_EVENT);
      }
    });
  }

  /**
   * Deletes tasklist.
   * @see https://developers.google.com/tasks/v1/reference/tasklists/delete
   *
   * @private
   */
  __deleteTasklist() {
    gapi.client.request({
      path: this.tasklist.selfLink,
      method: 'DELETE'
    }).then(() => {
      this.dispatchEvent(new Event('tasklist-deleted'));
    });
  }

  /**
   * Focuses renameTasklistTitleInput when renameTasklistDialog is opened.
   *
   * @private
   */
  __focusRenameTasklistTitleInput() {
    this.$.renameTasklistTitleInput.focus();
    this.$.renameTasklistTitleInput.$.nativeInput.selectionStart = 0;
    this.$.renameTasklistTitleInput.$.nativeInput.selectionEnd = this.$.renameTasklistTitleInput.value ? this.$.renameTasklistTitleInput.value.length : 0;
  }

  /**
   * Opens deleteAllCompletedTasksDialog.
   * @private
   */
  __openDeleteAllCompletedTasksDialog() {
    this.$.dropdown.close();
    this.$.deleteAllCompletedTasksDialog.open();
  }

  /**
   * Opens deleteTasklistDialog.
   * @private
   */
  __openDeleteTasklistDialog() {
    this.$.dropdown.close();
    this.$.deleteTasklistDialog.open();
  }

  /**
   * Opens renameTaskListDialog.
   *
   * @private
   */
  __openRenameTasklistDialog() {
    this.$.dropdown.close();
    this.$.renameTasklistDialog.open();
  }

  /**
   * Renames tasklist.
   * @see https://developers.google.com/tasks/v1/reference/tasklists/update
   *
   * @private
   */
  __renameTasklist() {
    let value = this.$.renameTasklistTitleInput.value;
    if (value) {
      this.set('tasklist.title', value);
      gapi.client.request({
        path: this.tasklist.selfLink,
        method: 'PATCH',
        body: {
          title: value
        }
      });
    }
  }

  /**
   * Listens to keyUp events from renameTasklistTitleInput and triggers __renameTasklist on "enter" key.
   *
   * @param event
   * @private
   */
  __renameTasklistTitleInput() {
    this.$.renameTasklistDialog.close();
    this.__renameTasklist();
  }

}

/** Register element */
window.customElements.define(GTTAppDrawerTasklist.is, GTTAppDrawerTasklist);
