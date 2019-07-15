import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-route/app-location';
import '@polymer/app-route/app-route';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-toast/paper-toast';
import './gt-app-drawer.js';
import './gt-tasklist.js';

/**
 * GTApp element.
 *
 * @polymer
 * @customElement
 */
class GTApp extends PolymerElement {

  static get template() { return html`

    <!-- CSS -->
    <style>

      :host { display: block; }

      app-drawer-layout {}
      app-drawer-layout:not([narrow]) [drawer-toggle] { display: none; }
      app-drawer-layout app-drawer {}
      app-drawer-layout app-drawer div.toolbar { @apply --layout-vertical; padding: 24px 0 6px 24px; }
      app-drawer-layout app-drawer div.toolbar div.image {}
      app-drawer-layout app-drawer div.toolbar div.image img { border: 1px solid var(--secondary-text-color); border-radius: 50%; height: 96px; width: 96px; }
      app-drawer-layout app-drawer div.toolbar div.user { margin: 7px 0 0 0; }
      app-drawer-layout app-drawer div.toolbar div.user div.name {}
      app-drawer-layout app-drawer div.toolbar div.user div.email { color: var(--secondary-text-color); font-size: .8em; }
      app-drawer-layout app-drawer gt-app-drawer { margin: 12px 0 0 0; }
      app-drawer-layout app-header-layout { background: var(--primary-background-color); }
      app-drawer-layout app-header-layout app-header { background: var(--primary-background-color); }
      app-drawer-layout app-header-layout app-header app-toolbar {}
      app-drawer-layout app-header-layout app-header app-toolbar h1 { font-family: var(--title-font); font-weight: lighter; }
      app-drawer-layout app-header-layout app-header app-toolbar h1[condensed-title] { font-size: 1.2em; padding-left: 32px; }
      app-drawer-layout app-header-layout app-header app-toolbar h1[main-title] { font-size: 2em; padding-left: 32px; }
      app-drawer-layout app-header-layout main { margin: 0 0 24px 0; padding: 0 24px 24px 0; }
      app-drawer-layout app-header-layout footer { background: var(--primary-background-color); bottom: 0; color: var(--disabled-text-color); font-family: var(--title-font); font-size: .9em; left: 256px; padding: 12px 0; position: fixed; right: 0; text-align: center; }
      app-drawer-layout app-header-layout footer span { padding: 0 6px; }
      app-drawer-layout app-header-layout footer span a { color: var(--disabled-text-color); }
      
      paper-toast paper-button { color: yellow; }

    </style>

    <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
    </app-location>

    <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
    </app-route>

    <app-drawer-layout fullbleed="" narrow="{{narrow}}">
      <app-drawer slot="drawer" swipe-open="[[narrow]]">
        <div class="toolbar">
          <div class="image">
            <img src="[[user.image]]">
          </div>
          <div class="user">
            <div class="name">[[user.name]]</div>
            <div class="email">[[user.email]]</div>
          </div>
        </div>
        <gt-app-drawer id="drawer" opened-tasklist="{{openedTasklist}}" tasklists="{{tasklists}}">
        </gt-app-drawer>
      </app-drawer>

      <!-- Main content -->
      <app-header-layout has-scrolling-region="">

        <app-header slot="header" effects="waterfall resize-title" fixed="" condenses="">
          <app-toolbar>
            <h1 condensed-title="">[[openedTasklist.title]]</h1>
          </app-toolbar>
          <app-toolbar>
            <h1 main-title="">[[openedTasklist.title]]</h1>
          </app-toolbar>
        </app-header>

        <main>

          <template is="dom-if" if="[[openedTasklist]]">

            <gt-tasklist id="tasklist" tasklist="{{openedTasklist}}"></gt-tasklist>

          </template>

        </main>

        <footer>
          <span>(Unofficial) Google Tasks Web App v1.0</span>
          &nbsp;|&nbsp;
          <span>Made by <a href="#">WDS Solutions s.r.o.</a></span>
          &nbsp;|&nbsp;
          <span><a href="#">Privacy policy</a></span>
          &nbsp;|&nbsp;
          <span><a href="#">License</a></span>
          &nbsp;|&nbsp;
          <span><a href="#">Source code</a></span>
        </footer>

      </app-header-layout>
    </app-drawer-layout>
    
    <paper-toast id="toast" duration="4000" text="The task [[task.title]] was removed!">
      <paper-button on-click="__onClickUndo">Undo</paper-button>
    </paper-toast>

  `; }

  /** Define element name */
  static get is() { return 'gt-app'; }

  static get properties() {
    return {

      /**
       * Opened tasklist.
       * @see https://developers.google.com/tasks/v1/reference/tasklists#resource
       */
      openedTasklist: {
        type: Object
      },

      task: {
        type: Object
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
       * Logged in user object.
       */
      user: {
        type: Object
      }

    }
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Element lifecycle */

  /**
   * Loads array of tasklists.
   *
   * @see https://developers.google.com/tasks/v1/reference/tasklists/list
   * @see https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiclientrequestargs
   */
  connectedCallback() {
    super.connectedCallback();
    this.$.drawer.showLoader = true;
    gapi.client.request({
      path: 'https://www.googleapis.com/tasks/v1/users/@me/lists',
      method: 'GET'
    }).then(response => {
      this.set('tasklists', response.result.items);
      this.$.drawer.showLoader = false;
    });

    EVENTS.addGlobalEventListener(EVENTS.DELETE_TASK_EVENT, this.__onDeleteClickTask.bind(this));
    EVENTS.addGlobalEventListener(EVENTS.DELETE_ALL_COMPLETED_TASKS_EVENT, this.__onDeleteAllCompletedTasks.bind(this));
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Observers and event listeners */

  __onClickUndo() {
    this.__undoDelete();
  }

  __onDeleteClickTask(event) {
    this.set('task', event.detail.task);
    this.__openDeleteToast();
  }

  __onDeleteAllCompletedTasks() {
    this.__deleteAllCompletedTasks();
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
   * Inform tasklist about deletion of the completed tasks
   *
   * @private
   */
  __deleteAllCompletedTasks() {
    this.shadowRoot.querySelector('#tasklist').tasklistChanged(this.openedTasklist);
  }

  /**
   * Shows date picker
   *
   * @private
   */
  __openDeleteToast() {
    this.$.toast.open();
  }

  /**
   * Undo task deletion
   *
   * @private
   */
  __undoDelete() {
    this.$.toast.toggle();
    this.shadowRoot.querySelector('#tasklist').undoDelete();
  }

}

/** Register element */
window.customElements.define(GTApp.is, GTApp);
