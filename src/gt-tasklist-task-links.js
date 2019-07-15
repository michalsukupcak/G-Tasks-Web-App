import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import './gt-styles.js';

/**
 * GTTasklistTaskLinks element.
 *
 * @polymer
 * @customElement
 */
/**
// TODO Since task.links field is read-only, this doesn't work right now, maybe could be enabled later.
// @see https://developers.google.com/tasks/v1/reference/tasks
<link rel="import" href="../bower_components/paper-dialog/paper-dialog.html">
*/
/* Element */
class GTTasklistTaskLinks extends PolymerElement {

  static get template() { return html`

    <!-- CSS -->
    <style include="gt-styles"></style>
    <style>

      /* Element */
      :host { display: block; }

      /* Wrapper */
      div.wrapper { @apply --layout-horizontal; @apply --layout-center; @apply --layout-wrap; }

      /* Title */
      div.wrapper div.link { @apply --layout-horizontal; @apply --layout-center; background: var(--secondary-background-color); border: 1px solid var(--separator-color); border-radius: 6px; color: var(--primary-color); cursor: pointer; font-size: .9em; padding: 3px 9px; transition: .2s ease; }
      div.wrapper div.link:hover { background: var(--highlight-color); }
      div.wrapper div.link iron-icon { --iron-icon-height: 18px; --iron-icon-width: 18px; margin: 0 6px 0 0; }
      div.wrapper div.link span { margin: 2px 0 0 0; max-width: 128px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

      /*
      // TODO Since task.links field is read-only, this doesn't work right now, maybe could be enabled later.
      // @see https://developers.google.com/tasks/v1/reference/tasks
      div.wrapper div.add-link { color: var(--secondary-text-color); cursor: pointer; display: none; font-size: .9em; margin: 3px 0 0 12px; }
      div.wrapper div.add-link:hover { color: var(--primary-color); }
      div.wrapper:hover > div.add-link { display: block; }
      */

    </style>

    <div class="wrapper">

      <!-- List of links -->
      <template is="dom-repeat" items="[[links]]" as="link">
        <div title="Click to open (in new tab)" class="link" on-click="__openLink">
          <iron-icon icon\$="[[__getIcon(link.type)]]"></iron-icon>
          <span>[[link.description]]</span>
        </div>
      </template>

      <!--
      // TODO Since task.links field is read-only, this doesn't work right now, maybe could be enabled later.
      // @see https://developers.google.com/tasks/v1/reference/tasks
      <div class="add-link" on-click="__openAddLinkDialog">+ Add link</div>
      -->

    </div>

    <!--
    // TODO Since task.links field is read-only, this doesn't work right now, maybe could be enabled later.
    // @see https://developers.google.com/tasks/v1/reference/tasks
    <paper-dialog
        id="addLinkDialog"
        entry-animation="scale-up-animation"
        exit-animation="fade-out-animation"
        on-iron-overlay-closed="__clearAddLinkDialogInputs">
      <h2>Add link to task</h2>
      <div>
        <paper-input label="Description (optional)" id="linkDescription"></paper-input>
        <paper-input label="URL" id="linkUrl" auto-validate></paper-input>
      </div>
      <div class="buttons">
        <paper-button on-click="__addLink">Add link</paper-button>
        <paper-button dialog-dismiss>Cancel</paper-button>
      </div>
    </paper-dialog>
    -->
    
  `; }

  /** Define element name */
  static get is() { return 'gt-tasklist-task-links'; }

  /** Element properties */
  static get properties() {
    return {

      /**
       * Indicates if task is completed (true) or not (false).
       */
      completed: {
        type: Boolean,
        value: false
      },

      /**
       * Tasks's due date (task.due).
       */
      links: {
        type: Array,
        notify: true
      },

      /**
       * Shows input (true) or text (false) representation of notes.
       */
      showInput: {
        type: Boolean,
        value: false
      }

    }
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Element lifecycle */

  //Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Observers and event listeners */

  //Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Public API */

  // Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Protected API */

  //Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Private API */

  // TODO Since task.links field is read-only, this doesn't work right now, maybe could be enabled later.
  // @see https://developers.google.com/tasks/v1/reference/tasks
  /*
  __addLink() {
    let linkUrlInput = this.$.linkUrl;
    if (linkUrlInput.value) {
      this.push('links', {
        type: 'link',
        description: this.$.linkDescription.value,
        link: linkUrlInput.value
      });
      this.dispatchEvent(new Event('update-task'));
    } else {
      this.$.linkUrl.invalid = true;
    }
  }
  */

  /*
  // TODO Since task.links field is read-only, this doesn't work right now, maybe could be enabled later.
  // @see https://developers.google.com/tasks/v1/reference/tasks
  __clearAddLinkDialogInputs() {
    this.$.linkUrl.invalid = false;
    this.$.linkDescription.value = '';
    this.$.linkUrl.value = '';
  }
  */

  __getIcon(type) {
    if (type === 'email') {
      return 'icons:mail';
    } else {
      return null;
    }
  }

  // TODO Since task.links field is read-only, this doesn't work right now, maybe could be enabled later.
  // @see https://developers.google.com/tasks/v1/reference/tasks
  /*
  __openAddLinkDialog() {
    this.$.addLinkDialog.open();
  }
  */

  __openLink(event) {
    window.open(event.model.link.link, '_blank');
  }

}

/** Register element */
window.customElements.define(GTTasklistTaskLinks.is, GTTasklistTaskLinks);
