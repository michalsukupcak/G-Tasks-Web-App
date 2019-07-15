import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-spinner/paper-spinner';
import '@polymer/paper-styles/shadow';
import './gt-app.js';

setPassiveTouchGestures(true);

/**
 * GTApp element.
 *
 * @polymer
 * @customElement
 */
class GTInit extends PolymerElement {

  static get template() { return html`

    <!-- CSS -->
    <style>

      :host {

        /* Colors */
        --primary-color: #4285F4;
        --accent-color: red;
        --highlight-color: #E8F0FE;
        --hover-color: #FAFAFA;
        --focused-color: #F2F2F2;
        --separator-color: #E5E5E5;

        /* Background colors */
        --primary-background-color: white;
        --secondary-background-color: #FAFAFA;
        --base-background-color: #EEE;

        /* Text colors */
        --primary-text-color: #333;
        --secondary-text-color: #757575;
        --disabled-text-color: #AFAFAF;

        /* Font */
        --title-font: 'Product Sans', sans-serif;

      }

      div.overlay { background: var(--base-background-color); bottom: 0; left: 0; position: fixed; right: 0; text-align: center; top: 40%; z-index: 1; }
      div.overlay p { font-family: var(--title-font); font-weight: normal; }

      main { color: var(--primary-text-color); text-align: center; }
      main section { @apply --shadow-elevation-2dp; background: white; border-radius: 12px; margin: 10% auto auto auto; padding: 24px; width: 512px; }
      main section img { display: block; margin: auto auto 12px auto; max-width: 256px; width: 100%; }
      main section h1 { font-family: var(--title-font); font-size: 2.6em; font-weight: lighter; margin: 0; }
      main section h2 { font-size: 1.4em; font-weight: lighter; margin: 0; }
      main section p { margin: 26px 0 6px 0; }
      main section paper-button { background: var(--primary-color); border-radius: 6px; color: var(--primary-background-color); display: block; font-family: var(--product-sans); }
      main footer { color: var(--disabled-text-color); margin: 24px 0; }

    </style>

    <template is="dom-if" if="[[__showLoadingOverlay(loaded)]]" restamp="">
      <div class="overlay">
        <p>Loading ...</p>
        <paper-spinner active=""></paper-spinner>
      </div>
    </template>

    <template is="dom-if" if="[[__showLoginForm(loaded, user)]]" restamp="">
      <main>
        <section>
          <img src="/images/logo.webp">
          <h1>Google Tasks</h1>
          <h2>The (Unofficial) Web App</h2>
          <p>To continue, please sign in with your Google account:</p>
          <paper-button id="signInButton" raised="" on-click="__onClickInitializeSignIn">Authorize</paper-button>
        </section>
        <footer>
          Lorem ipsum
        </footer>
      </main>
    </template>

    <template is="dom-if" if="[[__showApp(loaded, user)]]" restamp="">
      <gt-app user="[[user]]"></gt-app>
    </template>
    
  `; }

  /** Client ID. */
  static get __CLIENT_ID() {
    return '1026378499011-5kj13phb608gjueo2l50h1r9lce92q95.apps.googleusercontent.com';
  }

  /** API key. */
  static get __API_KEY() {
    return 'AIzaSyCtNtfh2roQHrD7G_pjOV9gRma-ZPQktUo';
  }

  /** Google Tasks API read/write scope. */
  static get __SCOPES() {
    return 'https://www.googleapis.com/auth/tasks';
  }

  /** Define element name */
  static get is() { return 'gt-init'; }

  /** Element properties. */
  static get properties() {
    return {

      /**
       * Determines if app is loaded (true) or not (false).
       */
      loaded: {
        type: Boolean,
        value: false
      },

      /**
       * Logged in user object.
       */
      user: {
        type: Object,
        value: null
      }

    }
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Element lifecycle */

  /**
   * Initializes Google Client Library and then initializes Google OAuth2 connection.
   * @see https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiloadlibraries-callbackorconfig
   * @see https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiclientinitargs
   */
  connectedCallback() {
    super.connectedCallback();
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: GTInit.__API_KEY,
        clientId: GTInit.__CLIENT_ID,
        scope: GTInit.__SCOPES
      }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.__handleSignInStatusChange.bind(this));
        this.__handleSignInStatusChange(gapi.auth2.getAuthInstance().isSignedIn.get());
        this.set('loaded', true);
      });
    });
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Observers and event listeners */

  __onClickInitializeSignIn() {
    this.__initializeSignIn();
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
   * Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
   * @see https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetid
   */
  __handleSignInStatusChange(isSignedIn) {
    if (isSignedIn) {
      let currentUser = gapi.auth2.getAuthInstance().currentUser.get();
      this.set('user', {
        id: currentUser.getId(),
        email: currentUser.getBasicProfile().getEmail(),
        name: currentUser.getBasicProfile().getName(),
        image: currentUser.getBasicProfile().getImageUrl()
      });
    } else {
      this.set('user', null);
    }
  }

  /**
   * Initialize client sign in OAuth2 flow.
   * @see https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleauthsignin
   *
   * @private
   */
  __initializeSignIn() {
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   * Shows app element if app is loaded and user is signed in.
   *
   * @private
   */
  __showApp(loaded, user) {
    return loaded && user;
  }

  /**
   * Shows loading overlay while app is not loaded.
   *
   * @private
   */
  __showLoadingOverlay(loaded) {
    return !loaded;
  }

  /**
   * Shows login form if app is loaded but user is not signed it.
   *
   * @private
   */
  __showLoginForm(loaded, user) {
    return loaded && !user;
  }

}

/** Register element */
customElements.define(GTInit.is, GTInit);
