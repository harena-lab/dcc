/* Compute DCC
 *************/
class DCCCompute extends DCCBase {
  constructor () {
    super()
    this._updated = false
  }

  async connectedCallback () {
    super.connectedCallback()

    this.update = this.update.bind(this)

    if (this.hasAttribute('id')) {
      this.computeStatus = this.computeStatus.bind(this)
      this._subscribe('compute/status/' + this.id, this.computeStatus)
    }

    this._condition = (this.hasAttribute('condition'))
      ? DCCCompute.compileStatementSet(this.condition.toLowerCase()) : null

    this._compiled = null
    if (this.hasAttribute('expression')) {
      this._compiled =
        DCCCompute.compileStatementSet(this.expression.toLowerCase())
      if (this.hasAttribute('dependency')) {
        this._dependencyCompleted = this._dependencyCompleted.bind(this)
        this._subscribe('compute/updated/' + this.dependency,
                        this._dependencyCompleted)
        this._publish('compute/status/' + this.dependency)
      } else if (this._compiled != null && (this.active || this.autorun))
        await this._newExpressionUpdate()
    }

    if (this.hasAttribute('id')) {
      this._provides(this.id, 'compute/update', this.update)
      this._provides(this.id, 'update', this.update)
      this.calculate = this.calculate.bind(this)
      this._provides(this.id, 'compute/calculate', this.calculate)
    }
  }

  async disconnectedCallback() {
    await this._unsubscribeVariables()
    this._unsubscribe('compute/status/' + this.id, this.computeStatus)
    if (this.hasAttribute('id')) {
      this._withhold(this.id, 'compute/update')
      this._withhold(this.id, 'compute/calculate')
    }
  }

  async _subscribeVariables () {
    await this._unsubscribeVariables()
    this._subsVariables =
      DCCCompute.filterVariables(this._compiled, false, null)
    if (this._condition != null) {
      const condition = DCCCompute.
        filterVariables(this._condition, false, this._compiled)
      for (const c of condition)
        if (!this._subsVariables.includes(c))
          this._subsVariables.push(c)
    }
    for (let v of this._subsVariables)
      this._subscribe('var/set/' + v.replace(/\./g, '/'), this.update)
  }

  async _unsubscribeVariables () {
    if (this._subsVariables != null) {
      for (let v of this._subsVariables)
        this._subscribe('var/set/' + v.replace(/\./g, '/'), this.update)
      this._subsVariables = null
    }
  }

  _dependencyCompleted () {
    this._unsubscribe('compute/updated/' + this.dependency,
                      this._dependencyCompleted)
    if (this.active || this.autorun)
      this._newExpressionUpdate()
  }

  async _newExpressionUpdate () {
    await this.update()
    if (this.active)
      await this._subscribeVariables()
  }

  /*
    * Property handling
    */

  static get observedAttributes () {
    return DCCBase.observedAttributes.concat(
      ['condition', 'expression', 'active', 'autorun', 'dependency'])
  }

  get condition () {
    return this.getAttribute('condition')
  }

  set condition (newValue) {
    this.setAttribute('condition', newValue)
    this._condition = (newValue != null)
      ? DCCCompute.compileStatementSet(newValue.toLowerCase()) : null
  }

  get expression () {
    return this.getAttribute('expression')
  }

  set expression (newValue) {
    this.setAttribute('expression', newValue)
    this._compiled = (newValue != null)
      ? DCCCompute.compileStatementSet(newValue.toLowerCase()) : null
    this._newExpressionUpdate()
  }

  // defines if the expression is activelly updated
  get active () {
    return this.hasAttribute('active')
  }

  set active (isActive) {
    if (isActive) {
      this.setAttribute('active', '')
    } else {
      this.removeAttribute('active')
    }
  }

  // defines if the expression run at start
  get autorun () {
    return this.hasAttribute('autorun')
  }

  set autorun (isActive) {
    if (isActive) {
      this.setAttribute('autorun', '')
    } else {
      this.removeAttribute('autorun')
    }
  }

  get dependency () {
    return this.getAttribute('dependency')
  }

  set dependency (newValue) {
    this.setAttribute('dependency', newValue)
  }

  async notify (topic, message) {
    const tp = topic.toLowerCase()
    if (tp == 'update')
      this.update()
    else if (tp.startsWith('var/')) {
      await this._request('var/set/' + tp.substring(4).replace(/\./g, '/'),
                          message.value)
      this.update()
    }
  }

  async update () {
    let result = null
    if (this._condition == null ||
        await DCCCompute.computeExpression(this._condition, this._bus)) {
      result = await DCCCompute.computeExpression(
        this._compiled, this._bus, true)
      if (result._final)
        await this.multiRequest('true', null)
      else
        await this.multiRequest('false', null)
    }
    this._updated = true
    await this._publish('compute/updated/' + this.id, result)
  }

  computeStatus () {
    if (this._updated)
      this.publish('compute/updated/' + this.id)
  }

  async calculate () {
    return await DCCCompute.computeExpression(this._compiled, this._bus, true)
  }

  async connectionReady (id, topic) {
    super.connectionReady (id, topic)
    if (this._compiled != null)
      this.update()
  }

  /*
    * Static Expression Processing Methods
    */

  /*
    * Computes a expression that comes as object
    *
    * {
    *   type: <type of the expression>,
    *   <properties according to the type>
    * }
    */
  static computeExpressionObj (expression, bus) {
    switch (expression.type) {
      case 'divert-script':
        let message
        if (expression.target.startsWith('Case.'))
          { message = 'case/navigate/' + expression.target.substring(5) }
        else
          { message = 'knot/navigate/' + expression.target.replace(/\./g, '/') }
        let cBus = (bus != null) ? bus : MessageBus.i
        if (expression.parameter) {
          bus.publish(message, expression.parameter, true)
        } else {
          bus.publish(message, null, true) }
        break
    }
  }

  static compileStatementSet (statementSet) {
    const statementLines = statementSet.split(/;\r?\n?|\r?\n/)
    const compiledSet = []
    for (const l of statementLines) { compiledSet.push(DCCCompute.compileStatement(l)) }
    return compiledSet
  }

  static compileStatement (statement) {
    const compiled = []
    const assign = statement.match(DCCCompute.assignment)
    if (assign != null) {
      compiled[0] = assign[1].trim()
      compiled[1] =
            DCCCompute.compileExpression(statement.substring(assign[0].length))
    } else {
      compiled[0] = null
      compiled[1] = DCCCompute.compileExpression(statement)
    }
    return compiled
  }

  /*
   * Compiles an expression and converts it to a polish reverse notation
   * * caseSensitive - converts all field in lower case
   *                   (avoid transformations during its execution)
   */
  static compileExpression (expression) {
    const compiled = []
    const stack = []
    let mdfocus = expression
    let matchStart
    do {
      matchStart = -1
      let selected = ''
      for (const el in DCCCompute.element) {
        const pos = mdfocus.search(DCCCompute.element[el])
        if (pos > -1 && (matchStart == -1 || pos < matchStart)) {
          selected = el
          matchStart = pos
        }
      }
      if (matchStart > -1) {
        let matchContent = mdfocus.match(DCCCompute.element[selected])[0]
        const matchSize = matchContent.length
        matchContent = matchContent.trim()

        switch (selected) {
          case 'number':
            compiled.push([DCCCompute.role.number, Number(matchContent)])
              // (matchContent.includes('.'))
                // ? parseFloat(matchContent) : parseInt(matchContent)])
            break
          case 'arithmetic':
          case 'power':
          case 'logic':
          case 'not':
          case 'comparison':
            const pri = DCCCompute.precedence[matchContent]
            while (stack.length > 0 && pri <= stack[stack.length - 1][1]) {
              compiled.push([DCCCompute.role.operator, stack.pop()[0]]) }
            stack.push([matchContent, pri])
            break
          // case 'power':
          //   stack.push([matchContent, DCCCompute.precedence[matchContent]])
          //   break
          case 'openParentheses':
            stack.push([matchContent, DCCCompute.precedence[matchContent]])
            break
          case 'closeParentheses':
            while (stack.length > 0 && stack[stack.length - 1][0] != '(')
              compiled.push([DCCCompute.role.operator, stack.pop()[0]])
            if (stack.length > 0) {
              stack.pop()
              if (stack.length > 0 && stack[stack.length - 1][1] ==
                           DCCCompute.precedence.function) {
                const label = stack.pop()[0]
                compiled.push([DCCCompute.role.function, label])
              }
            }
            break
          case 'variable':
            compiled.push([DCCCompute.role.variable, matchContent, 0])
            break
          case 'function':
            stack.push([matchContent, DCCCompute.precedence.function])
            break
        }

        if (matchStart + matchSize >= mdfocus.length) {
          matchStart = -1
        } else {
          mdfocus = mdfocus.substring(matchStart + matchSize)
        }
      }
    } while (matchStart > -1)
    const size = stack.length
    for (let s = 0; s < size; s++) {
      const op = stack.pop()
      compiled.push([(op[1] == DCCCompute.precedence.function)
        ? DCCCompute.role.function : DCCCompute.role.operator, op[0]])
    }
    return compiled
  }

  /*
   * Computes a set of expressions, updating variables.
   * It returns the value of the last variable as default.
   * - allResults: indicates that all results will be returned
   */
  static async computeExpression (compiledSet, bus, allResults) {
    let result = null
    let all = {}
    for (let s of compiledSet) {
      await DCCCompute.updateVariables(s[1], bus)
      const r = DCCCompute.computeCompiled(s[1])
      if (s[0] != null) {
        all[s[0]] = r
        result = r
        let cBus = (bus != null) ? bus : MessageBus.i
        await cBus.request('var/set/' + s[0].replace(/\./g, '/'),
                           r, null, true)
      } else if (compiledSet.length == 1) {
        all['value'] = r
        result = r
        // looks for a variable inside the expression
        /*
        if (autoAssign) {
          let variable = s[1].find(el => el[0] == 3)
          if (variable)
            await this._request('var/set/' + variable[1].replace(/\./g, '/'), result, null, true)
        }
        */
      }
    }
    if (allResults) {
      all._final = result
      result = all
    }
    return result
  }

  static filterVariables (compiledSet, includeAssigned, compiledAssignment) {
    let assigned = []
    if (!includeAssigned)
      assigned = DCCCompute.filterAssignedVariables(
        (compiledAssignment == null) ? compiledSet : compiledAssignment)
    let variables = []
    for (let s of compiledSet) {
      for (let c of s[1]) {
        if (c[0] == DCCCompute.role.variable) {
          const sub = c[1].indexOf('[')
          const vname = (sub == -1) ? c[1] : c[1].substring(0, sub)
          if (!variables.includes(vname) && !assigned.includes(vname))
            variables.push(vname)
        }
      }
    }
    return variables
  }

  static filterAssignedVariables (compiledSet) {
    let variables = []
    for (let s of compiledSet)
      if (s[0] != null && !variables.includes(s[0]))
        variables.push(s[0])
    return variables
  }

  static async updateVariables (compiled, bus) {
    for (let c of compiled)
      if (c[0] == DCCCompute.role.variable) {
        let cBus = (bus != null) ? bus : MessageBus.i
        if (cBus.hasSubscriber('var/get/' + c[1].replace(/\./g, '/'), true)) {
          let mess = await cBus.request('var/get/' + c[1].replace(/\./g, '/'),
                                        null, null, true)
          if (mess.message != null) {
            mess = mess.message
            let value = ((mess.body != null)
             ? ((mess.body.value != null) ? mess.body.value : mess.body)
             : ((mess.value != null) ? mess.value : mess))
            if (typeof value === 'string')
              value = value.replace(/,/gm, '.')
            c[2] = Number(value)
            if (isNaN(c[2]))
              c[2] = value
          }
        }
      }
  }

  /*
   Computes a single compiled expression - without updating variables.
   number: 1
   arithmetic: 2
   variable: 3
   function: 4
   */
  static computeCompiled (compiled) {
    const stack = []
    for (const c of compiled) {
      switch (c[0]) {
        case 1: stack.push(c[1]); break
        case 2:
          const b = stack.pop()
          if (c[1] == 'not')
            stack.push(!b)
          else {
            const a = stack.pop()
            switch (c[1]) {
              case '+': stack.push(a + b); break
              case '-': stack.push(a - b); break
              case '*': stack.push(a * b); break
              case '/': stack.push(a / b); break
              case '^': stack.push(Math.pow(a, b)); break
              case '=': stack.push(a == b); break;
              case '>': stack.push(a > b); break;
              case '<': stack.push(a < b); break;
              case '>=': stack.push(a >= b); break;
              case '<=': stack.push(a <= b); break;
              case '<>': stack.push(a != b); break;
              case 'or': stack.push(a || b); break;
              case 'and': stack.push(a && b); break;
            }
          }
          break
        case 3: stack.push(c[2]); break
        case 4: switch (c[1]) {
          case 'sin':
            stack.push(
              Math.round(
                Math.sin(stack.pop() / 180 * Math.PI) * 1000) / 1000)
            break
          case 'cos':
            stack.push(
              Math.round(
                Math.cos(stack.pop() / 180 * Math.PI) * 1000) / 1000)
            break
          case 'sqrt':
            stack.push(Math.sqrt(stack.pop()))
            break
          case 'random':
            stack.push(Math.floor(Math.random() * (stack.pop()+1)))
            break
          case 'abs':
            stack.push(Math.abs(stack.pop()))
            break
          case 'round':
            stack.push(Math.round(stack.pop()))
            break
        }
      }
    }
    return stack.pop()
  }
}

(function () {
  DCCCompute.elementTag = 'dcc-compute'
  customElements.define(DCCCompute.elementTag, DCCCompute)

  DCCCompute.role = {
    number: 1,
    operator: 2,
    variable: 3,
    function: 4
  }

  DCCCompute.precedence = {
    '(': 0,
    'or': 1,
    'and': 2,
    '=': 3,
    '>': 3,
    '<': 3,
    '>=': 3,
    '<=': 3,
    '<>': 3,
    '-': 4,
    '+': 4,
    '/': 5,
    '*': 5,
    '^': 6,
    'not': 7,
    function: 8
  }

  DCCCompute.element = {
    number: /([\d]*\.[\d]+)|([\d]+)/im,
    arithmetic: /[ \t]*[\+\-*/][ \t]*/im,
    logic: /[ \t]*and[ \t]*|[ \t]*or[ \t]*/im,
    power: /[ \t]*\^[ \t]*/im,
    not: /[ \t]*not[ \t]*/im,
    comparison: /[ \t]*(?:[<>=](?!=))|>=|<=|<>[ \t]*/im,
    openParentheses: /[ \t]*\([ \t]*/im,
    closeParentheses: /[ \t]*\)[ \t]*/im,
    function: /[\w \t\.]+(?=\()/im,
    variable: /[\w \t\.]+(?:\[\d+\])?(?!\()/im
  }

  DCCCompute.assignment = /([\w \t\.]+)\:=[ \t]*/im
})()
