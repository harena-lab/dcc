/* Button DCC
 *
 * xstyle - controls the behavior of the style
 *   * "in" or not defined -> uses the internal trigger-button style
 *   * "none" ->  apply a minimal styling (just changes cursor to pointer)
 *   * "out"  -> apply an style externally defined with the name "trigger-button-template"
**************************************************************************/

class DCCButton extends DCCBlock {
  constructor () {
    super()
    this._computeTrigger = this._computeTrigger.bind(this)
  }

  connectedCallback () {
    super.connectedCallback()

    this._active = !this.disabled

    if (this.hasAttribute('topic') &&
        MessageBus.extractLevel(this.topic, 2) == 'navigate') {
      this.navigationBlocked = this.navigationBlocked.bind(this)
      this._subscribe(MessageBus.extractLevelsSegment(this.topic, 1, 2) + '/!',
                      this.navigationBlocked)
    }

    this._publish('control/button/' +
      (this.hasAttribute('id')
        ? this.id
        : (this.hasAttribute('label') ? this.label : '')
      ) + '/ready', this.elementTag())
  }

  /* Attribute Handling */

  static get observedAttributes () {
    return DCCBlock.observedAttributes.concat(
      ['link', 'topic', 'message', 'variable', 'inline', 'disabled'])
  }

  get link () {
    return this.getAttribute('link')
  }

  set link (newValue) {
    this.setAttribute('link', newValue)
  }

  get topic () {
    return this.getAttribute('topic')
  }

  set topic (newValue) {
    this.setAttribute('topic', newValue)
  }

  get message () {
    return this.getAttribute('message')
  }

  set message (newValue) {
    this.setAttribute('message', newValue)
  }

  get variable () {
    return this.getAttribute('variable')
  }

  set variable (newValue) {
    this.setAttribute('variable', newValue)
  }

  get inline () {
    return this.hasAttribute('inline')
  }

  set inline (isInline) {
    if (isInline)
      this.setAttribute('inline', '')
    else
      this.removeAttribute('inline')
  }

  get disabled () {
    return this.hasAttribute('disabled')
  }

  set disabled (isDisabled) {
    if (isDisabled) {
      this._active = false
      this.setAttribute('disabled', '')
    } else {
      this._active = true
      this.removeAttribute('disabled')
    }
    this._lockUnlock()
  }

  notify (topic, message) {
    switch (topic.toLowerCase()) {
      case 'enable': this.disabled = false; break
      case 'disable': this.disabled = true;
    }
  }

  changeDisplay(topic, message) {
    super.changeDisplay(topic, message)
    if (this._presentation != null) {
      if (topic == 'style/display/none') {
        this.display = 'none'
        this._active = false
      } else {
        this.display = 'initial'
        this._active = true
      }
    }
  }

  /* Rendering */

  async _renderInterface () {
    // === pre presentation setup
    let html
    if (this.hasAttribute('location') && this.location != '#in')
      html = this.label
    else {
      const bsty = this._renderStyle() + ((this.inline) ? '-inline' : '')
      if (this.hasAttribute('image')) {
        html = DCCButton.templateElements.image
          .replace('[render]', bsty)
          .replace('[label]', this.label)
          .replace('[image]', this.image)
      } else {
        html = DCCButton.templateElements.regular
          .replace('[render]', bsty)
          .replace('[label]', this.label)
      }
    }

    // === presentation setup (DCC Block)
    await this._applyRender(html,
      (this._xstyle == 'out-image') ? 'title' : 'innerHTML', null, null,
      true)
 
    // === post presentation setup
    // <TODO> provisory
    if (this.hasAttribute('image'))
      this._imageElement = this._presentation.querySelector('#pres-image-dcc')

    let wrapperListener = false
    if (this.location && this.location[0] != '#') {
      const wrapper = document.querySelector('#' + this.location + '-wrapper')
      if (wrapper != null) {
        wrapper.style.cursor = 'pointer'
        if (!this.author) {
          wrapper.addEventListener('click', this._computeTrigger)
          wrapperListener = true
        }
      }
    }

    if (this._presentation != null && !wrapperListener) {
      this._presentation.style.cursor = 'pointer'
      if (!this.author) this._presentation.addEventListener('click', this._computeTrigger)
    }

    this._lockUnlock()

    this._presentationIsReady()
  }

  /* Rendering */

  elementTag () {
    return DCCButton.elementTag
  }

  externalLocationType () {
    return 'action'
  }

  _lockUnlock () {
    if (this._presentation != null) {
      // const lock = this._presentation.querySelector('#lock')
      if (this.disabled) {
        this._oldStyle = this._presentation.style
        this._presentation.style =
          `background:black;color:black;${this._oldStyle || ''}`
      } else if (this._oldStyle != null)
        this._presentation.style = this._oldStyle
    }
  }

  async _computeTrigger () {
    if (this._active && this._checkPre()) {
      const message = { sourceType: DCCButton.elementTag }
      if (this.hasAttribute('variable')) {
        const v = (this.variable.includes(':'))
          ? this.variable.substring(0, this.variable.indexOf(':')) : this.variable
        message.value = (this.variable.endsWith(':label')) ? this.label : this.message
        this._publish('input/changed/' + v.replace(/\./g, '/'), message, true)
      }
      if (this.hasAttribute('label') || this.hasAttribute('topic')) {
        if (this.hasAttribute('topic') &&
            MessageBus.extractLevel(this.topic, 2) == 'navigate')
          this._active = false
        const topic = (this.hasAttribute('topic'))
          ? this.topic : 'button/' + this.label + '/clicked'
        if (this.hasAttribute('message')) { message.value = this.message }
        this._publish(topic, message, true)
      }
      await this.multiRequest('click', message)
    }
  }

  _checkPre() {
    let result = true
    if (this._setup != null && this._setup.pre != null)
      result = this._setup.pre()
    return result
  }

  navigationBlocked () {
    this._active = true
  }

  // <TODO> provisory - deactivate button edit
  _activateAuthorPresentation (presentation, listener) {}
}

(function () {
  DCCButton.templateElements = {
    regular:
   '<span id=\'presentation-dcc\' class=\'[render]\'>[label]</span>',
    image:
   `<span id='presentation-dcc' style='cursor:pointer'>
      <img id='pres-image-dcc' width='100%' height='100%' class='[render]' src='[image]' title='[label]'>
   </span>`
  }

  DCCButton.elementTag = 'dcc-button'

  customElements.define(DCCButton.elementTag, DCCButton)
})()
