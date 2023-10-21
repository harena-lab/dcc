import { Bus } from '../lib/oid/oid-full-dev.js'

export class BridgeBus {
  constructor () {
    Bus.i.subscribe('#', this.republish.bind(this))
  }

  republish (topic, message) {
    MessageBus.i.publish(topic, message)
  }
}

BridgeBus.i = new BridgeBus()