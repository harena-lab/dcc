/* Development Mode - Store and Retrieve Space State */

class AuthorCellManagerDev {
  constructor () {
    MessageBus.i.subscribe('control/editor/save',
      this.saveSpaceScripts.bind(this))
    MessageBus.i.subscribe('control/editor/load',
      this.loadSpaceScripts.bind(this))
  }

  get serializer () {
    if (!this._serializer)
      this._serializer = new Blockly.serialization.blocks.BlockSerializer()
    return this._serializer
  }

  async saveSpaceScripts () {
    const playground = AuthorCellManager.instance.playground
    const label = document.querySelector('#record-label').value
    const space = await MessageBus.i.request(
      'dcc-space-cellular/request/state')
    const serial = this.serializer.save(playground)

    localStorage.setItem('harena-cell-space-dev-' + label,
      JSON.stringify(space.message))
    localStorage.setItem('harena-cell-script-dev-' + label,
      JSON.stringify(serial))
  }

  async loadSpaceScripts () {
    const playground = AuthorCellManager.instance.playground
    const label = document.querySelector('#record-label').value
    const space = localStorage.getItem('harena-cell-space-dev-' + label)
    const serial = localStorage.getItem('harena-cell-script-dev-' + label)

    MessageBus.i.publish('dcc-space-cellular/update/state', JSON.parse(space))
    this.serializer.load(JSON.parse(serial), playground)
  }
}

(function () {
  AuthorCellManagerDev.i = new AuthorCellManagerDev()
})()