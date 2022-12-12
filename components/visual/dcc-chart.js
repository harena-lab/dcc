/* Chart DCC
  **********/
class DCCChart extends DCCVisual {
  constructor () {
    super()
  }

  connectedCallback () {
    const min = this._toIntPair(this.min)
    this._min = (min != null) ? min : DCCChart.defaultValueMin
    const max = this._toIntPair(this.max)
    this._max = (max != null) ? max : DCCChart.defaultValueMax
    this._value = (this.hasAttribute('value')) ? this.value : '0%'

    this._width = (this.hasAttribute('width')) ? parseInt(this.width) : 300
    this._height = (this.hasAttribute('height')) ? parseInt(this.height) : 300

    this._plotWidth = this._width - 20
    this._plotHeight = this._height - 20

    this._updateRatio()

    this._lastX = 0

    const html = DCCChart.svgTemplate
      .replace(/\[width\]/g, this._width)
      .replace(/\[height\]/g, this._height)
      .replace(/\[axis-y\]/g, this._height - 5)
      .replace(/\[axis-length\]/g, this._width - 14)
      .replace(/\[label-x-height\]/g, this._height - 15)

    let presentation = this._shadowHTML(html)
    this._plotArea = presentation.querySelector('#plot-area')
    this._xLabel =
      presentation.querySelector('#x-label').childNodes[0]
    this._yLabel =
      presentation.querySelector('#y-label').childNodes[0]

    this._setPresentation(presentation)
    super.connectedCallback()

    this._presentationIsReady()
  }

  /*
    * Property handling
    */

  static get observedAttributes () {
    return DCCVisual.observedAttributes.concat(
      ['value', 'min', 'max', 'index'])
  }

  get value () {
    return this.getAttribute('value')
  }

  set value (newValue) {
    this.setAttribute('value', newValue)
  }

  get min () {
    return this.getAttribute('min')
  }

  set min (newValue) {
    const convert = this._toIntPair(newValue)
    if (convert != null) {
      this._min = convert
      this._updateRatio()
    }
    this.setAttribute('min', newValue)
  }

  get max () {
    return this.getAttribute('max')
  }

  set max (newValue) {
    const convert = this._toIntPair(newValue)
    if (convert != null) {
      this._max = convert
      this._updateRatio()
    }
    this.setAttribute('max', newValue)
  }

  get index () {
    return this.hasAttribute('index')
  }

  set index (hasIndex) {
    if (hasIndex) { this.setAttribute('index', '') } else { this.removeAttribute('index') }
  }

  _toIntPair (value) {
    let result = null
    if (value != null) {
      const v = value.split(',')
      if (v.length > 1)
        result = [parseInt(v[0]), parseInt(v[1])]
    }
    return result
  }

  _updateRatio () {
    this._ratio = [this._plotWidth / (this._max[0] - this._min[0]),
                   this._plotHeight / (this._max[1] - this._min[1])]
  }

  notify (topic, message) {
    if (!topic.includes('/'))
      topic = 'action/' + topic
    switch (topic.toLowerCase()) {
      case 'action/update':
        this._value = this._messageValue(message)
        this._updateChart(this._value.table)
        break
      case 'action/include':
        this._value = this._messageValue(message)
        this._includeChart(this._value)
        break
    }
  }

  _includeChart (value) {
    this._lastX++
    let x = this._lastX
    let y = 0
    if (value != null) {
      if (Array.isArray(value)) {
        if (value.length > 1) {
          x = value[0]
          y = value[1]
        } else
          y = value[0]
      } else if (typeof value === 'object') {
        if (value.x) x = value.x
        if (value.y) y = value.y
      } else
        y = value
      if (!Number.isInteger(x)) x = parseInt(x)
      if (!Number.isInteger(y)) y = parseInt(y)
    }

    this.plot(x, y)
  }

  _updateChart (table) {
    if (table.content) {
      const dots = []
      const min = [parseFloat(table.content[0][0]),
                   parseFloat(table.content[0][1])]
      const max = [min[0], min[1]]
      for (const d of table.content) {
        const dt = [parseFloat(d[0]), parseFloat(d[1])]
        min[0] = (dt[0] < min[0]) ? dt[0] : min[0]
        min[1] = (dt[1] < min[1]) ? dt[1] : min[1]
        max[0] = (dt[0] > max[0]) ? dt[0] : max[0]
        max[1] = (dt[1] > max[1]) ? dt[1] : max[1]
        dots.push(dt)
      }

      if (!this.hasAttribute('min')) this._min = min
      if (!this.hasAttribute('max')) this._max = max

      this._updateRatio()

      for (const d of dots)
        this.plot(d[0], d[1])
    }

    if (table.schema) {
      this._xLabel.nodeValue = table.schema[0]
      this._yLabel.nodeValue = table.schema[1]
    }
  }

  plot (x, y) {
    const dot = document.createElementNS(
      'http://www.w3.org/2000/svg', 'circle')
    dot.setAttribute('cx', (x - this._min[0]) * this._ratio[0])
    dot.setAttribute('cy',
      this._plotHeight - ((y - this._min[1]) * this._ratio[1]))
    dot.setAttribute('r', 3)
    dot.classList.add('dcc-chart-plot')
    this._plotArea.appendChild(dot)
  }
}

(function () {
  customElements.define('dcc-chart', DCCChart)

  DCCChart.defaultValueMin = [0,0]
  DCCChart.defaultValueMax = [100,100]

  DCCChart.svgTemplate =
`<style>
  .dcc-chart-back {fill: var(--dcc-chart-back);}
  .dcc-chart-axis {stroke: var(--dcc-chart-axis);}
  .dcc-chart-plot {fill: var(--dcc-chart-plot);}
  .dcc-chart-label {fill: var(--dcc-chart-label);}
</style>
<div id="chart-wrapper">
<svg id="presentation-dcc" width="[width]" height="[height]" xmlns="http://www.w3.org/2000/svg">
  <marker id="arrowhead" markerWidth="7" markerHeight="5" refX="0" refY="2.5" orient="auto">
    <polygon points="0 0, 7 2.5, 0 5" />
  </marker>
  <rect class="dcc-chart-back" x="0" y="0" width="100%" height="100%"/>
  <g id="plot-area" class="dcc-chart-back" x="7" y="0" width="100%" height="100%"/>
  <line class="dcc-chart-axis" x1="0" y1="[axis-y]" x2="[axis-length]" y2="[axis-y]"
        stroke-width="2" marker-end="url(#arrowhead)" />
  <line class="dcc-chart-axis" x1="5" y1="100%" x2="5" y2="12"
        stroke-width="2" marker-end="url(#arrowhead)" />
  <text id="y-label" class="dcc-chart-label" dominant-baseline="hanging" x="12" y="0">y</text>
  <text id="x-label" class="dcc-chart-label" dominant-baseline="text-top" text-anchor="end" x="[axis-length]" y="[label-x-height]">x</text>
</svg>
</div>`
})()
