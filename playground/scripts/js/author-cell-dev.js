/* Development Mode - Store and Retrieve Space State */

class AuthorCellManagerDev {
  constructor () {
    MessageBus.i.subscribe('control/editor/save',
      this.saveSpaceScripts.bind(this))
    MessageBus.i.subscribe('control/editor/load',
      this.loadSpaceScripts.bind(this))
    MessageBus.i.subscribe('control/editor/export',
      this.exportSpaceScripts.bind(this))
    MessageBus.i.subscribe('control/editor/import',
      this.importSpaceScripts.bind(this))
  }

  start () {
    AuthorCellManager.instance.start()
    this.dropZone = document.querySelector('#drop-zone')
    this.dropZone.addEventListener('dragover', this.fileDrag.bind(this))
    this.dropZone.addEventListener('drop', this.fileDropped.bind(this))
  }

  fileDrag (event) {
    this.dropZone.innerHTML = '...Solte...'
    event.preventDefault()
  }

  get serializer () {
    if (!this._serializer)
      this._serializer = new Blockly.serialization.blocks.BlockSerializer()
    return this._serializer
  }

  async serializeSpaceScripts () {
    const playground = AuthorCellManager.instance.playground
    const space = await MessageBus.i.request(
      'dcc-space-cellular/request/state')
    const scripts = this.serializer.save(playground)
    return {
      label: document.querySelector('#record-label').value,
      space: JSON.stringify(space.message),
      scripts: JSON.stringify(scripts)
    }
  }

  async saveSpaceScripts () {
    const { label, space, scripts } = await this.serializeSpaceScripts()
    localStorage.setItem('harena-cell-space-dev-' + label, space)
    localStorage.setItem('harena-cell-script-dev-' + label, scripts)
  }

  async exportSpaceScripts () {
    const { label, space, scripts } = await this.serializeSpaceScripts()
    const a = document.createElement('a')
    a.style.display = 'none'
    document.body.appendChild(a)
    a.href = window.URL.createObjectURL(
      new Blob([space, '[[[scripts]]]', scripts], {type: 'text/plain'}))
    a.setAttribute('download', label + '.space')
    a.click()
    window.URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
  }

  async importSpaceScripts () {
  }

  async loadSpaceScripts () {
    const playground = AuthorCellManager.instance.playground
    const label = document.querySelector('#record-label').value
    const space = localStorage.getItem('harena-cell-space-dev-' + label)
    const scripts = localStorage.getItem('harena-cell-script-dev-' + label)

    MessageBus.i.publish('dcc-space-cellular/update/state', JSON.parse(space))
    this.serializer.load(JSON.parse(scripts), playground)
  }

  async fileDropped (event) {
    event.preventDefault()

    const playground = AuthorCellManager.instance.playground

    let file = null
    if (event.dataTransfer.items) {
      for (let item of event.dataTransfer.items) {
        if (item.kind === 'file')
          file = item.getAsFile()
      }
    } else
      file = event.dataTransfer.files[0]
    const content = await file.text()

    const [space, scripts] = content.split('[[[scripts]]]')
    MessageBus.i.publish('dcc-space-cellular/update/state', JSON.parse(space))
    this.serializer.load(JSON.parse(scripts), playground)
    
    this.dropZone.innerHTML = 'IMPORTAR'
  }
}

(function () {
  AuthorCellManagerDev.i = new AuthorCellManagerDev()
})()