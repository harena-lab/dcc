/*
 * Main Author Environment
 *
 * Main authoring environment, which presents the visual interface and
 * coordinates the authoring activities.
 */

class AuthorCellManager {
  constructor () {
   	this.source = null
   	this._playground = null
   	this._editMode = true
   	this._pĺaySpace = false
    this._analysis = {}

   	// MessageBus.page = new MessageBus(false)
    PrimitiveDCC.rootPath = '../../'
  }

  // optional parameters - without parameters it gets from the URL
  start (setup, mode, caseId, askReset, dccPath) {
    this.switchEditor = this.switchEditor.bind(this)
    this.playSpace = this.playSpace.bind(this)
    this.stopSpace = this.stopSpace.bind(this)
    this.restartSpace = this.restartSpace.bind(this)
    this.scriptExpand = this.scriptExpand.bind(this)
    this.scriptRetract = this.scriptRetract.bind(this)
    this.cellsExpand = this.cellsExpand.bind(this)
    this.cellsRetract = this.cellsRetract.bind(this)
    this.updateInputTrack = this.updateInputTrack.bind(this)
    this.updateAnalysis = this.updateAnalysis.bind(this)
    this.saveSpace = this.saveSpace.bind(this)
    this.editorFinish = this.editorFinish.bind(this)

    this._inputTrack = {}

    MessageBus.i.subscribe('control/editor/switch', this.switchEditor)
    MessageBus.i.subscribe('control/space/play', this.playSpace)
    MessageBus.i.subscribe('control/space/stop', this.stopSpace)
    MessageBus.i.subscribe('control/space/save', this.saveSpace)
    MessageBus.i.subscribe('control/space/restart', this.restartSpace)
    MessageBus.i.subscribe('control/script/expand', this.scriptExpand)
    MessageBus.i.subscribe('control/script/retract', this.scriptRetract)
    MessageBus.i.subscribe('control/cells/expand', this.cellsExpand)
    MessageBus.i.subscribe('control/cells/retract', this.cellsRetract)
    MessageBus.i.subscribe('control/editor/finish', this.editorFinish)

    this._activePanel = 1
    MessageBus.i.subscribe('control/editor/switch-panel', this.switchPanel.bind(this))

    MessageBus.i.subscribe('input/changed/#', this.updateInputTrack)
    MessageBus.i.subscribe('dcc/analysis/data', this.updateAnalysis)

    this._dccPath = dccPath || AuthorCellManager.defaultDCCPath

    this._scriptActive = true
    this._caseId = null

    this._serializer = new Blockly.serialization.blocks.BlockSerializer()

    const parameters = (new URL(document.location)).searchParams

    const md = mode || parameters.get('mode')
    if (md != null) {
      if (md.includes('no-script')) {
        this._scriptActive = false
        AuthorCellManager.stateVis['script-panel'][0] = 0
      }
      if (md.includes('no-hide'))
        AuthorCellManager.stateVis['types-panel'][1] = 1
      if (md.includes('mobile')) {
        this._mobileMode = true
        AuthorCellManager.stateVis['play-button'][0] = 1
        AuthorCellManager.stateVis['restart-button'][0] = 1
        AuthorCellManager.stateVis['next-button'][0] = 1
      } else
        this._mobileMode = false
    }

    if (setup != null) {
      const stypes = []
      let sbuttons = ''
      if (setup.types) {
        for (const s in setup.types) {
          const st = setup.types[s]
          stypes.push([s, st.symbol,
            {src: st.image, width: st.width, height: st.height, alt: st.title}])
          sbuttons += AuthorCellManager.singleButtonTemplate
            .replace('{title}', st.title)
            .replace('{type}', s)
            .replace('{image}', st.image)
        }
      }
      let scats = ''
      if (setup.blocks) {
        let color = 210
        for (const c in setup.blocks) {
          let sblocks = ''
          for (const b in setup.blocks[c]) {
            sblocks += AuthorCellManager.blockTemplate.replace('{type}', b)
          }
          scats += AuthorCellManager.blockCategoryTemplate
                     .replace('{name}', c)
                     .replace('{color}', color)
                     .replace('{blocks}', sblocks)
          color += 100
        }
      }
      let ssliders = ''
      if (setup.sliders) {
        for (const s in setup.sliders) {
          const sl = setup.sliders[s]
          ssliders += AuthorCellManager.singleSliderTemplate
            .replace('{variable}', s)
            .replace('{initial}', sl.initial)
            .replace('{pre-image}', sl.pre_image)
            .replace('{pre-width}', sl.pre_width)
            .replace('{pre-height}', sl.pre_height)
            .replace('{pos-image}', sl.pos_image)
            .replace('{pos-width}', sl.pos_width)
            .replace('{pos-height}', sl.pos_height)
        }
      }
      let sradio = ''
      if (setup.radio) {
        for (const r in setup.radio) {
          const rl = setup.radio[r]
          let options = ''
          for (const o in rl.options) {
            options += AuthorCellManager.singleRadioTemplate
              .replace('{value}', rl.options[o])
              .replace('{label}', o)
          }
          sradio += AuthorCellManager.radioSetTemplate
            .replace('{variable}', r)
            .replace('{pre-image}', rl.pre_image)
            .replace('{pre-width}', rl.pre_width)
            .replace('{pre-height}', rl.pre_height)
            .replace('{pos-image}', rl.pos_image)
            .replace('{pos-width}', rl.pos_width)
            .replace('{pos-height}', rl.pos_height)
            .replace('{options}', options)
        }
      }

      document.querySelector('#player-panel').innerHTML = setup.source
      this._insertHTML(setup.name, stypes, scats, setup.source,
        AuthorCellManager.buttonsTemplate.replace('{buttons}', sbuttons) +
        AuthorCellManager.slidersTemplate
          .replace('{sliders}', ssliders)
          .replace('{radios}', sradio))
    } else {
      document.querySelector('#action-panels').innerHTML = 
        (this._mobileMode) ? AuthorCellManager.mobilePanel :
          (this._scriptActive)
            ? AuthorCellManager.scriptPanel : AuthorCellManager.noScriptPanel
      this.source = parameters.get('source')
      if (this.source != null) {
        const caseScript = document.createElement('script')
        caseScript.src = ((this.source[0] == '/') ? '' : 'gallery/') +
                         this.source + '.js'
        document.head.appendChild(caseScript)
      }
    }

    if (this._scriptActive) {
      document.querySelector('#button-retract-script').hide()
      document.querySelector('#button-retract-cells').hide()
    }

    this._caseId = caseId || parameters.get('case')
    this._askReset = (askReset != null) ? askReset : (parameters.get('ask') != null)
  }

  get playground () {
    return this._playground
  }

  insertSource (name, types, blocks, source, buttonTypes) {
    document.querySelector('#render-panel').innerHTML = source
    this._insertHTML(name, types, blocks, source, buttonTypes)
  }

  _insertHTML (name, types, blocks, source, buttonTypes) {
    document.querySelector('#source-name').innerHTML = name
    document.querySelector('#types-panel').innerHTML = buttonTypes
    if (this._scriptActive) {
      ScriptBlocksCell.create(types, this._dccPath + 'scripts/icons/')

      document.querySelector('#xml-toolbox').innerHTML =
             '<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">' +
             blocks +
             '</xml>'

      this._playground = Blockly.inject('script-panel',
        {
          scrollbars: true,
          trashcan: true,
          zoom:
            {controls: true,
             wheel: true,
             startScale: 1.0,
             maxScale: 3,
             minScale: 0.3,
             scaleSpeed: 1.2,
             pinch: true},
          media: this._dccPath + 'lib/blockly-9.2.0/media/',
          toolbox: document.getElementById('toolbox')
        })

       const zoomToFit = new ZoomToFitControl(this._playground);
       zoomToFit.init();
    }

    this._updateVisibility()
  }

  _updateVisibility () {
    for (const sv in AuthorCellManager.stateVis) {
      const s = document.querySelector('#' + sv)
      if (s != null) {
        const vis =
              AuthorCellManager.stateVis[sv][(this._editMode) ? 0 : 1]
        s.style.display = ((vis == 0) ? 'none' : 'initial')
      }
    }
  }

  async switchEditor () {
    MessageBus.i.publish('timer/stop', null, true)
    this._editMode = !this._editMode
    this._updateVisibility()

    if (this._editMode) {
      MessageBus.i.publish('control/finish/disable', null, true)
      if (this._playTriggered) {
         this._playTriggered = false
         if (this._askReset) {
           const decision = await DCCNoticeInput.displayNotice(
               'Você quer retornar ao cenário original ou editar esse novo cenário que você está vendo?',
               'message', 'Voltar ao Original', 'Este Cenário')
           if (decision == 'Voltar ao Original') MessageBus.i.publish('state/reset', null, true)
         } else
           MessageBus.i.publish('state/reset', null, true)
      }
      await MessageBus.i.publish('input/changed/space_updates',
                                 {value: this._analysis}, false)
      this._analysis = {}
      MessageBus.i.publish('space/edit', null, true)
	  } else {
      MessageBus.i.publish('state/save', null, true)
      const stg = document.querySelector('#stage-field')
      if (stg != null) {
        const stage = stg.value
        if (stage != null)
          MessageBus.i.publish('input/changed/space_stage',
                               {value: stage}, true)
      }
      const space =
        await MessageBus.i.request('dcc-space-cellular/request/state')
      MessageBus.i.publish('input/changed/space_state',
                           {value: space.message}, true)
      if (this._scriptActive) {
        await MessageBus.i.request('dcc/rules/clear')
        const code = Blockly.JavaScript.workspaceToCode(this._playground)
        document.querySelector('#rules-panel').innerHTML = code
        const serial = this._serializer.save(this._playground)
        MessageBus.i.publish('input/changed/block_code', {value: serial}, true)
      }
      MessageBus.i.publish('space/view', null, true)
      MessageBus.i.publish('control/finish/enable', null, true)
	  }
  }

  // only for mobile
  switchPanel () {
    if (this._activePanel == 1) {
      document.querySelector('#panel1-button').style.display = 'none'
      document.querySelector('#panel2-button').style.display = 'initial'
      document.querySelector('#space-block').style.display = 'none'
      document.querySelector('#configuration-block').style.display = 'initial'
    } else {
      document.querySelector('#panel1-button').style.display = 'initial'
      document.querySelector('#panel2-button').style.display = 'none'
      document.querySelector('#space-block').style.display = 'initial'
      document.querySelector('#configuration-block').style.display = 'none'
    }
    this._activePanel = 3 - this._activePanel
  }

  playSpace () {
    document.querySelector('#play-button').style.display = 'none'
    document.querySelector('#stop-button').style.display = 'initial'
    this._playTriggered = true
    MessageBus.i.publish('timer/start', null, true)
  }

  stopSpace () {
    document.querySelector('#play-button').style.display = 'initial'
    document.querySelector('#stop-button').style.display = 'none'
    MessageBus.i.publish('timer/stop', null, true)
  }

  restartSpace () {
    MessageBus.i.publish('timer/stop', null, true)
    MessageBus.i.publish('state/reset', null, true)
  }

  scriptExpand () {
    document.querySelector('#render-panel').style.display = 'none'
    document.querySelector('#types-panel').style.display = 'none'
    document.querySelector('#composition-block').classList.remove('col-6')
    const sb = document.querySelector('#script-block')
    sb.classList.remove('col-6')
    sb.classList.add('col-12')
    document.querySelector('#button-retract-script').show()
    document.querySelector('#button-expand-script').hide()
    document.querySelector('#button-expand-cells').hide()
    this.resizeWorkspace()
  }

  cellsExpand () {
    document.querySelector('#script-block').classList.remove('col-6')
    const cb = document.querySelector('#composition-block')
    cb.classList.remove('col-6')
    cb.classList.add('col-12')
    document.querySelector('#button-retract-cells').show()
    document.querySelector('#button-expand-script').hide()
    document.querySelector('#button-expand-cells').hide()
    this.resizeWorkspace()
  }

  scriptRetract () {
    document.querySelector('#render-panel').style.display = 'initial'
    document.querySelector('#types-panel').style.display = 'initial'
    document.querySelector('#composition-block').classList.add('col-6')
    const sb = document.querySelector('#script-block')
    sb.classList.remove('col-12')
    sb.classList.add('col-6')
    document.querySelector('#button-retract-script').hide()
    document.querySelector('#button-expand-script').show()
    document.querySelector('#button-expand-cells').show()
    this.resizeWorkspace()
  }

  cellsRetract () {
    document.querySelector('#script-block').classList.add('col-6')
    const cb = document.querySelector('#composition-block')
    cb.classList.remove('col-12')
    cb.classList.add('col-6')
    document.querySelector('#button-retract-cells').hide()
    document.querySelector('#button-expand-script').show()
    document.querySelector('#button-expand-cells').show()
    this.resizeWorkspace()
  }

  resizeWorkspace () {
    const toolbox = document.getElementById('toolbox')
    let sp = document.querySelector('#script-panel')
    let x = 0
    let y = 0
    do {
      x += sp.offsetLeft
      y += sp.offsetTop
      sp = sp.offsetParent
    } while (sp)
    toolbox.style.left = x + 'px'
    toolbox.style.top = y + 'px'
    toolbox.style.width = toolbox.offsetWidth + 'px'
    toolbox.style.height = toolbox.offsetHeight + 'px'
    Blockly.svgResize(this._playground)
  }

  updateInputTrack (topic, message) {
    const varid = MessageBus.extractLevel(topic, 3)
    this._inputTrack[varid] = message.value
  }

  updateAnalysis (topic, message) {
    const value = PrimitiveDCC.messageValue(message)
    for (const v in value) {
      if (this._analysis[v] != null)
        this._analysis[v].push(value[v])
      else
        this._analysis[v] = [value[v]]
    }
  }

  async editorFinish () {
    await MessageBus.i.publish('input/changed/space_updates',
                            {value: this._analysis}, false)
    this._analysis = {}
    const space =
        await MessageBus.i.request('dcc-space-cellular/request/state')
    MessageBus.i.publish('input/changed/space_state',
                         {value: space.message}, true)
    MessageBus.i.publish('flow/navigate/>', null, true)
  }

  async saveSpace () {
    const space = await MessageBus.i.request(
      'dcc-space-cellular/request/state')
    if (this._caseId != null)
      MessageBus.i.publish('case/summary/' + Basic.service.generateUID(),
        {
          caseId: this._caseId,
          participantName: document.querySelector('#participant-name').value,
          state: space.message,
          updates: this._analysis,
          inputs: this._inputTrack
        }, true)
  }
}

(function () {
AuthorCellManager.instance = new AuthorCellManager()

AuthorCellManager.defaultDCCPath = '../../'

AuthorCellManager.stateVis = {
    'play-button': [0, 1],
    'stop-button': [0, 0],
    'restart-button': [0, 1],
    'next-button': [0, 1],
    'types-panel': [1, 0],
    'script-panel': [1, 0],
    'editor-button': [0, 1],
    'execute-button': [1, 0]
  }

AuthorCellManager.scriptPanel =
`<div id="composition-block" class="d-flex col-6 flex-column align-items-stretch">
   <div>
      <div id="render-panel"></div>
      <div id="types-panel"></div>
   </div>
   <div id="rules-panel"></div>
</div>
<div id="script-block" class="d-flex col-6 flex-column align-items-stretch">
   <div class="sty-navigation-expansion">
       <dcc-button id="button-expand-script" topic="control/script/expand" label="Expand" image="images/icon/icon-expansion-left.svg"></dcc-button>
       <dcc-button id="button-retract-script" topic="control/script/retract" label="Retract" image="images/icon/icon-expansion-right.svg"></dcc-button>
   </div>
   <div class="sty-navigation-expansion">
       <dcc-button id="button-retract-cells" topic="control/cells/retract" label="Expand" image="images/icon/icon-expansion-left.svg"></dcc-button>
       <dcc-button id="button-expand-cells" topic="control/cells/expand" label="Retract" image="images/icon/icon-expansion-right.svg"></dcc-button>
   </div>
   <div class="h-100 w-100" style="padding-left:.800rem">
      <div class="h-100 w-100" id="script-panel"></div>
   </div>
</div>`

AuthorCellManager.noScriptPanel =
`<div class="d-flex col-6 flex-column align-items-stretch">
   <div id="render-panel"></div>
</div>
<div class="d-flex col-6 flex-column align-items-stretch">
   <div id="types-panel" class="h-100 w-100"></div>
   <div id="script-panel"></div>
   <div id="rules-panel"></div>
</div>`

AuthorCellManager.mobilePanel =
`<div id="space-block">
<div class="d-flex col-12 flex-column align-items-stretch">
   <div id="render-panel"></div>
</div>
</div>
<div id="configuration-block" style="display:none">
<div class="d-flex col-12 flex-column align-items-stretch">
   <div id="types-panel" class="h-100 w-100"></div>
   <div id="script-panel"></div>
   <div id="rules-panel"></div>
</div>
</div>`

AuthorCellManager.blockCategoryTemplate =
`<category name="{name}" colour="{color}">
{blocks}
</category>`

AuthorCellManager.blockTemplate = '<block type="{type}"></block>\n'

AuthorCellManager.buttonsTemplate =
`<p>Selecione um dos ícones abaixo para editar o ambiente:</p>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row; border:2px">
{buttons}
</div>`

AuthorCellManager.singleButtonTemplate =
`<div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
  <dcc-button label="{title}" topic="type/{type}"
               image="{image}">
  </dcc-button>
</div>`

AuthorCellManager.slidersTemplate =
`<hr style="height:4px;border-width:0;color:gray;background-color:gray">
<p>Selecione abaixo a chance de cada acontecimento:</p>
{sliders}{radios}`

AuthorCellManager.singleSliderTemplate =
`<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <img src="{pre-image}" style="flex:10%; max-width:{pre-width}px; max-height:{pre-height}px">
   <span style="border-left:6px solid gray; height: 48px;"></span>
   <img src="{pos-image}" style="flex:10%; max-width:{pos-width}px; max-height:{pos-height}px">
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-slider variable="{variable}" value="{initial}" index></dcc-slider>
   </div>
</div>
<hr>`

AuthorCellManager.radioSetTemplate =
`<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <img src="{pre-image}" style="flex:10%; max-width:{pre-width}px; max-height:{pre-height}px">
   <span style="border-left:6px solid gray; height: 48px;"></span>
   <img src="{pos-image}" style="flex:10%; max-width:{pos-width}px; max-height:{pos-height}px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="{variable}" reveal="horizontal" exclusive>{options}</dcc-input-choice>
   </div>
</div>
<hr>`

AuthorCellManager.singleRadioTemplate =
`<dcc-input-option value="{value}">{label}</dcc-input-option>`

})()
