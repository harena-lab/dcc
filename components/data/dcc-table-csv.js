/* Proccess an CSV Content
  ************************/

class DCCTableCSV extends DCCVisual {
  constructor() {
    super()
    this._tableUpdated = this._tableUpdated.bind(this)
    this._tableDrag = this._tableDrag.bind(this)
    this._tableDropped = this._tableDropped.bind(this)
  }

  connectedCallback () {
    super.connectedCallback()

    this._observer = new MutationObserver(this._tableUpdated)
    this._observer.observe(this,
                           {attributes: true, childList: true, subtree: true})

    this.render()
    this._tableUpdated()
  }

  render() {
    if (!this.shadowRoot) {
      const template = document.createElement('template')
      template.innerHTML = DCCTableCSV.templateHTML
        .replace(/{width}/igm, this.hasAttribute('width') ?
          'width: ' + this.getAttribute('width') + ';' : '')
        .replace(/{height}/igm, this.hasAttribute('height') ?
          'height: ' + this.getAttribute('height') + ';' : '')
      const shadow = this.attachShadow({ mode: 'open' })
      shadow.appendChild(template.content.cloneNode(true))
      this._tableContent = shadow.querySelector('#table-content')
      this._tableView = shadow.querySelector('#presentation-dcc')

      this._dropZone = shadow.querySelector('#drop-zone')
      this._dropZone.addEventListener('drop', this._tableDropped)
      this._dropZone.addEventListener('dragover', this._tableDrag)
    }
  }

  static get observedAttributes () {
    return DCCVisual.observedAttributes.concat(
      ['drop', 'view', 'schema', 'content', 'separator'])
  }

  get drop () {
    return this.hasAttribute('drop')
  }

  set drop (hasDrop) {
    if (hasDrop) { this.setAttribute('drop', '') }
    else { this.removeAttribute('drop') }
  }

  get view () {
    return this.hasAttribute('view')
  }

  set view (hasView) {
    if (hasView) { this.setAttribute('view', '') }
    else { this.removeAttribute('view') }
  }

  get schema () {
    return this.getAttribute('schema')
  }

  set schema (newValue) {
    this.setAttribute('schema', newValue)
  }

  get content () {
    return this.getAttribute('content')
  }

  set content (newValue) {
    this.setAttribute('content', newValue)
  }

  get separator () {
    return this.getAttribute('separator')
  }

  set separator (newValue) {
    this.setAttribute('separator', newValue)
  }

  _tableDrag (event) {
    this._dropZone.innerHTML = 'Drop your file here'
    event.preventDefault()
  }

  async _tableDropped (event) {
    event.preventDefault();

    let file = null
    if (event.dataTransfer.items) {
      for (let item of event.dataTransfer.items) {
        if (item.kind === 'file')
          file = item.getAsFile()
      }
    } else
      file = event.dataTransfer.files[0]
    const content = await file.text()

    this._hideDropZone()
    this._processTable(content)
  }

  _tableUpdated (mutationsList, observer) {
    let content = (this.hasAttribute('content'))
      ? this.content.replace(/;/g, '\n') : this.innerHTML.trim()
    if (content.length > 0) {
      this._hideDropZone()
      this._processTable(content)
    }
  }

  _processTable (csv) {
    const sep = (this.hasAttribute('separator')) ? this.separator : ','

    this._table = {
    }

    if (this.hasAttribute('schema') && this.schema.length > 0)
      csv = this.schema + '\n' + csv
    let csvp = csv.slice()

    let prSchema = false
    let table = []
    while (csvp.length > 0) {
      const line = []
      while (csvp.length > 0 && csvp[0] != '\n' && csvp[0] != '\r') {
        let open = 0
        let close = -1
        let quotation = (csvp[0] == '"')
        if (quotation) {
          open = 1
          do {
            close += 2
            close = csvp.indexOf('"', close)
          } while (close+1 < csvp.length && csvp[close+1] == '"')
        } else {
          close = csvp.indexOf(sep)
          if (close == -1 || csvp.substring(0, close).includes('\n'))
            close = csvp.indexOf('\n')
          if (close == -1 || csvp.substring(0, close).includes('\r'))
            close = csvp.indexOf('\r')
          if (close == -1)
            close = csvp.length + 1
        }
        let content = csvp.substring(open, close)
        if (quotation) {
          content = content.replace(/""/g, '"')
          close++
        }
        line.push(content)
        if (close < csvp.length && csvp[close] == sep)
          close++
        csvp = csvp.substring(close)
      }
      if (!prSchema) {
        this._table.schema = line
        prSchema = true
      } else
        table.push(line)
      if (csvp.length > 0 && (csvp[0] == '\n' || csvp[0] == '\r'))
        csvp = csvp.substring(1)
      if (csvp.length > 0 && (csvp[0] == '\n' || csvp[0] == '\r'))
        csvp = csvp.substring(1)
    }

    this._table.content = table

    if (this.view) {
      let htmlTable = '<table>'
      if (this._table.schema) {
        htmlTable += '<tr>'
        for (const c of this._table.schema)
          htmlTable += '<th>' + c + '</th>'
        htmlTable += '</tr>'
      }
      for (const l of this._table.content) {
        htmlTable += '<tr>'
        for (const c of l)
          htmlTable += '<td>' + c + '</td>'
        htmlTable += '</tr>'
      }
      htmlTable += '</table>'
      this._tableView.innerHTML = htmlTable
    }

    this._publish('table/updated',
      {
        table: this._table,
        csv: csv
      })
  }

  _hideDropZone () {
    this._dropZone.removeEventListener('drop', this._tableDropped)
    this._dropZone.removeEventListener('dragover', this._tableDrag)
    this._dropZone.style.display = 'none'
  }

  retrieve(field, index) {
    if (this._table && this._table.schema) {
      const column = this._table.schema.indexOf(field)
      if (column > -1 && this._table.content[index-1]) {
        console.log('=== ' + field.replace(/\./g, '/'))
        console.log(this._table.content[index-1][column])
        this._publish('var/set/' + field.replace(/\./g, '/'),
                      this._table.content[index-1][column])
      }
    }
  }

  async notify (topic, message) {
    const tp = topic.toLowerCase()
    if (tp.startsWith('table/retrieve/'))
      this.retrieve(tp.substring(15), PrimitiveDCC.messageValue(message))
  }
}

(function () {
  DCC.webComponent('dcc-table-csv', DCCTableCSV)

  DCCTableCSV.templateHTML =
`<style>
#drop-zone {
  border: 5px solid;
  {width}
  {height}
}
#presentation-dcc {
  overflow: scroll;
  {width}
  {height}
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
}
td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
<div id="table-content" style="display:none"><slot></slot></div>
<div id="drop-zone">Drop Zone</div>
<div id="presentation-dcc"></div>`
})()
