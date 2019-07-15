import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/iron-input/iron-input';
import '@polymer/paper-input/paper-input';
import '@vaadin/vaadin-date-picker/vaadin-date-picker-light';
import '@vaadin/vaadin-overlay/vaadin-overlay';

/**
 * GTTasklistTaskDateInput element.
 *
 * @polymer
 * @customElement
 */
class GTTasklistTaskDateInput extends PolymerElement {

  static get template() { return html`

    <!-- CSS -->
    <style>
      
      vaadin-date-picker-light iron-input { display: none; }
      vaadin-date-picker-light paper-input { margin-top="-20px"; --paper-input-container-input: { font-size: .9em } }
      vaadin-date-picker-light paper-input iron-icon { color: var(--secondary-text-color); --iron-icon-height: 16px; --iron-icon-width: 16px; }

    </style>

    <!-- Date picker wrapper -->
    <vaadin-date-picker-light id="datePicker" opened="{{opened}}" value="{{datePickerValue}}">
      
      <!--<iron-input bind-value="{{internalValue}}">-->
        <!--<input>-->
      <!--</iron-input>-->
      
      <paper-input id="datePickerInput" no-label-float="true" value="{{datePickerValue}}">
        <iron-icon icon="icons:event" slot="suffix"></iron-icon>
      </paper-input>
     
    </vaadin-date-picker-light>
    
  `; }

  /** Define element name */
  static get is() { return 'gt-tasklist-task-date-input'; }

  /** Element properties */
  static get properties() {
    return {

      datePickerValue: {
        observer: '__datePickerValueChanged',
        type: Number,
        notify: true
      },

      due: {
        type: String,
        notify: true
      },

      opened: {
        observer: '__openedChanged',
        type: Boolean,
        value: false,
        notify: true
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

  /**
   * Open date picker
   *
   * @public
   */
  openDatePicker() {
    this.$.datePicker.open();
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Protected API */

  //Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Private API */

  /**
   * Check picker value
   *
   * @private
   */
  __datePickerValueChanged(value) {
    if (value !== "") {
      this.set('due', moment.utc(value).format());
      this.dispatchEvent(new Event('update-task'));
    }
  }

  /**
   * Check picker opened state
   *
   * @private
   */
  __openedChanged() {
    this.dispatchEvent(new CustomEvent('opened-state-changed', { detail: { isOpened: this.opened }}));
  }

}

/** Register element */
window.customElements.define(GTTasklistTaskDateInput.is, GTTasklistTaskDateInput);
