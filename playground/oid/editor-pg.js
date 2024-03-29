import { Sphere, Bus } from '../../lib/oid/oid-full-dev.js'

export class EditorPg {
  start () {
    Sphere.get('control').bus.subscribe(
      'control/render', this._renderOids.bind(this))
    Bus.i.subscribe('#', this._busMonitor.bind(this))
  }

  _renderOids () {
    document.querySelector("#pg-render").innerHTML =
        document.querySelector("#pg-editor").value
  }

  _busMonitor (topic, message) {
    Sphere.get('control').bus.
      publish('control/monitor', {value: `[${topic}] ${JSON.stringify(message)}`})
  }
}

EditorPg.i = new EditorPg()