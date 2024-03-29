/**
 * Customized blocks for Blockly
 */

class ScriptBlocksCell {
  static create (types, iconPath) {
    ScriptBlocksCell.s = new ScriptBlocksCell(
      types, (iconPath || ScriptBlocksCell.defaultIconPath))
  }

  constructor (types, iconPath) {
    this._iconPath = iconPath

    this._arrowsHorizontal = [
      [{src: iconPath + 'arrow-right-solid.svg',
        width: 25, height: 25, alt: 'direita'}, 'right'],
      [{src: iconPath + 'arrow-left-solid.svg',
        width: 25, height: 25, alt: 'esquerda'}, 'left']
    ]
    this._arrowsVertical = [
      [{src: iconPath + 'arrow-up-solid.svg',
        width: 25, height: 25, alt: 'cima'}, 'up'],
      [{src: iconPath + 'arrow-down-solid.svg',
        width: 25, height: 25, alt: 'baixo'}, 'down']
    ]

    this._selectTypes = []
    let emptyPos = -1
    for (const t in types) {
      if (types[t][0] == 'empty')
        emptyPos = t
      else
        this._selectTypes.push([types[t][2], types[t][0]])
    }
    this._allSelectTypes = this._selectTypes.slice()
    this._allSelectTypes.unshift(
      (emptyPos > -1)
        ? [types[emptyPos][2], types[emptyPos][0]]
        : [ScriptBlocksCell.emptyType[2], ScriptBlocksCell.emptyType[0]])

    console.log('=== all select types')
    console.log(this._allSelectTypes)

    this._types = {}
    if (emptyPos == -1)
      this._types[ScriptBlocksCell.emptyType[0]] = ScriptBlocksCell.emptyType[1]
    for (const t of types) { this._types[t[0]] = t[1] }

    this._buildBlocks()
    this._codeGenerator()
  }

  static _invertDirection (state) {
    if (state.endsWith('l'))
      return state.substring(0, state.length - 1) + 'r'
    else if (state.endsWith('r'))
      return state.substring(0, state.length - 1) + 'l'

    if (state.endsWith('u'))
      return state.substring(0, state.length - 1) + 'd'
    else if (state.endsWith('d'))
      return state.substring(0, state.length - 1) + 'u'

    return state
  }

  _buildBlocks () {
    Blockly.Blocks.neighbor = {
      init: function () {
        this.jsonInit({
          message0: 'se %1 encontra %2 então %3',
          args0: [
            {
              type: 'field_dropdown',
              name: 'origin',
              options: ScriptBlocksCell.s._allSelectTypes
            },
            {
              type: 'field_dropdown',
              name: 'target',
              options: ScriptBlocksCell.s._allSelectTypes
            },
            {
              type: 'input_value',
              name: 'action',
              check: 'Action'
            }
          ],
          message1: '%1 %2 %3',
          args1: [
            {
              type: 'field_checkbox',
              name: 'upLeft',
              check: 'Boolean'
            },
            {
              type: 'field_checkbox',
              name: 'up',
              check: 'Boolean'
            },
            {
              type: 'field_checkbox',
              name: 'upRight',
              check: 'Boolean'
            }
          ],
          message2: '%1 %2 %3 direção',
          args2: [
            {
              type: 'field_checkbox',
              name: 'left',
              check: 'Boolean'
            },
            {
              type: 'field_image',
              src: ScriptBlocksCell.s._iconPath + 'arrows.png',
              width: 22,
              height: 22
            },
            {
              type: 'field_checkbox',
              name: 'right',
              check: 'Boolean'
            }
          ],
          message3: '%1 %2 %3',
          args3: [
            {
              type: 'field_checkbox',
              name: 'downLeft',
              check: 'Boolean'
            },
            {
              type: 'field_checkbox',
              name: 'down',
              check: 'Boolean'
            },
            {
              type: 'field_checkbox',
              name: 'downRight',
              check: 'Boolean'
            }
          ],
          colour: 160,
          tooltip: 'Checks neighborhood.'
        })
      }
    }

    Blockly.Blocks.entity = {
      init: function () {
        this.jsonInit({
          message0: '%1 %2',
          args0: [
            {
              type: 'field_dropdown',
              name: 'entity',
              options: ScriptBlocksCell.s._allSelectTypes
            },
            {
              type: 'input_value',
              name: 'action1',
              check: 'Entity_action'
            }
          ],
          message1: ' %1',
          args1: [
            {
              type: 'input_value',
              name: 'action2',
              check: 'Entity_action'
            }
          ],
          message2: ' %1',
          args2: [
            {
              type: 'input_value',
              name: 'action3',
              check: 'Entity_action'
            }
          ],
          colour: 160,
          tooltip: 'Entidade'
        })
      }
    }

    Blockly.Blocks.entity_movement = {
      init: function () {
        this.jsonInit({
          message0: 'movimento %1',
          args0: [
            {
              type: 'field_slider',
              name: 'movement',
              value: 10,
              min: 0,
              max: 10
            }
          ],
          colour: 200,
          tooltip: 'Quantidade de movimento.',
          output: 'Entity_action'
        })
      }
    }

    Blockly.Blocks.entity_growth = {
      init: function () {
        this.jsonInit({
          message0: 'crescimento %1',
          args0: [
            {
              type: 'field_slider',
              name: 'growth',
              value: 4,
              min: 1,
              max: 8
            }
          ],
          colour: 300,
          tooltip: 'Taxa de crescimento.',
          output: 'Entity_action'
        })
      }
    }

    Blockly.Blocks.entity_mortality = {
      init: function () {
        this.jsonInit({
          message0: 'mortalidade %1',
          args0: [
            {
              type: 'field_slider',
              name: 'mortality',
              value: 4,
              min: 1,
              max: 8
            }
          ],
          colour: 400,
          tooltip: 'Taxa de mortalidade.',
          output: 'Entity_action'
        })
      }
    }

    Blockly.Blocks.entity_eat = {
      init: function () {
        this.jsonInit({
          message0: 'come %1',
          args0: [
            {
              type: 'field_dropdown',
              name: 'eat',
              options: ScriptBlocksCell.s._allSelectTypes
            },
          ],
          message1: 'crescimento %1',
          args1: [
            {
              type: 'field_slider',
              name: 'growth',
              value: 4,
              min: 1,
              max: 8
            }
          ],
          colour: 500,
          tooltip: 'Come outro ser e cresce.',
          output: 'Entity_action'
        })
      }
    }

    Blockly.Blocks.transform_horizontal = {
      init: function () {
        this.jsonInit({
          message0: '%1 %2 %3 antes',
          args0: [
            {
              type: 'field_dropdown',
              name: 'or1',
              options: ScriptBlocksCell.s._allSelectTypes
            },
            {
              type: 'field_dropdown',
              name: 'direction',
              options: ScriptBlocksCell.s._arrowsHorizontal
            },
            {
              type: 'field_dropdown',
              name: 'or2',
              options: ScriptBlocksCell.s._allSelectTypes
            }
          ],
          message1: '%1 %2 %3 depois',
          args1: [
            {
              type: 'field_dropdown',
              name: 'trans1',
              options: ScriptBlocksCell.s._allSelectTypes
            },
            {
              type: 'field_image',
              src: ScriptBlocksCell.s._iconPath + 'light-green-block.png',
              width: 57,
              height: 36
            },
            {
              type: 'field_dropdown',
              name: 'trans2',
              options: ScriptBlocksCell.s._allSelectTypes
            }
          ],
          message2: 'chance %1',
          args2: [
            {
              type: 'field_slider',
              name: 'probability',
              value: 100,
              min: 0,
              max: 100
            }
          ],
          message3: 'reflete %1',
          args3: [
            {
              type: 'field_checkbox',
              name: 'reflect',
              check: 'Boolean',
              "checked": true
            }
          ],
          colour: 160,
          tooltip: 'Transformação horizontal'
        })
      }
    }

    Blockly.Blocks.transform_vertical = {
      init: function () {
        this.jsonInit({
          message0: 'antes | depois',
          message1: '%1 %2',
          args1: [
            {
              type: 'field_dropdown',
              name: 'or1',
              options: ScriptBlocksCell.s._allSelectTypes
            },
            {
              type: 'field_dropdown',
              name: 'trans1',
              options: ScriptBlocksCell.s._allSelectTypes
            }
          ],
          message2: '%1',
          args2: [
            {
              type: 'field_dropdown',
              name: 'direction',
              options: ScriptBlocksCell.s._arrowsVertical
            }
          ],
          message3: '%1 %2',
          args3: [
            {
              type: 'field_dropdown',
              name: 'or2',
              options: ScriptBlocksCell.s._allSelectTypes
            },
            {
              type: 'field_dropdown',
              name: 'trans2',
              options: ScriptBlocksCell.s._allSelectTypes
            }
          ],
          message4: 'chance %1',
          args4: [
            {
              type: 'field_slider',
              name: 'probability',
              value: 100,
              min: 0,
              max: 100
            }
          ],
          message5: 'reflete %1',
          args5: [
            {
              type: 'field_checkbox',
              name: 'reflect',
              check: 'Boolean',
              "checked": true
            }
          ],
          colour: 160,
          tooltip: 'Transformação vertical'
        })
      }
    }

    Blockly.Blocks.transform = {
      init: function () {
        this.jsonInit({
          message0: '%1',
          args0: [
            {
              type: 'field_input',
              name: 'label',
              text: "rótulo",
              spellcheck: false
            }
          ],
          message1: '%1 %2 antes',
          args1: [
            {
              type: 'field_dropdown',
              name: 'or1',
              options: ScriptBlocksCell.s._allSelectTypes
            },
            {
              type: 'field_dropdown',
              name: 'or2',
              options: ScriptBlocksCell.s._allSelectTypes
            }
          ],
          message2: '%1 %2 depois',
          args2: [
            {
              type: 'field_dropdown',
              name: 'trans1',
              options: ScriptBlocksCell.s._allSelectTypes
            },
            {
              type: 'field_dropdown',
              name: 'trans2',
              options: ScriptBlocksCell.s._allSelectTypes
            }
          ],
          message3: '%1 %2 %3',
          args3: [
            {
              type: 'field_checkbox',
              name: 'upLeft',
              check: 'Boolean'
            },
            {
              type: 'field_checkbox',
              name: 'up',
              check: 'Boolean'
            },
            {
              type: 'field_checkbox',
              name: 'upRight',
              check: 'Boolean'
            }
          ],
          message4: '%1 %2 %3 direção',
          args4: [
            {
              type: 'field_checkbox',
              name: 'left',
              check: 'Boolean'
            },
            {
              type: 'field_image',
              src: ScriptBlocksCell.s._iconPath + 'arrows.png',
              width: 22,
              height: 22
            },
            {
              type: 'field_checkbox',
              name: 'right',
              check: 'Boolean'
            }
          ],
          message5: '%1 %2 %3',
          args5: [
            {
              type: 'field_checkbox',
              name: 'downLeft',
              check: 'Boolean'
            },
            {
              type: 'field_checkbox',
              name: 'down',
              check: 'Boolean'
            },
            {
              type: 'field_checkbox',
              name: 'downRight',
              check: 'Boolean'
            }
          ],
          message6: 'chance %1',
          args6: [
            {
              type: 'field_number',
              name: 'probability',
              value: 100,
              min: 0,
              max: 100,
              precision: .01
            }
          ],
          colour: 160,
          tooltip: 'Transformação'
        })
      }
    }

    Blockly.Blocks.single = {
      init: function () {
        this.jsonInit({
          message0: '%1',
          args0: [
            {
              type: 'field_input',
              name: 'label',
              text: "rótulo",
              spellcheck: false
            }
          ],
          message1: '%1 antes',
          args1: [
            {
              type: 'field_dropdown',
              name: 'or1',
              options: ScriptBlocksCell.s._allSelectTypes
            }
          ],
          message2: '%1 depois',
          args2: [
            {
              type: 'field_dropdown',
              name: 'trans1',
              options: ScriptBlocksCell.s._allSelectTypes
            }
          ],
          message3: 'chance %1',
          args3: [
            {
              type: 'field_number',
              name: 'probability',
              value: 100,
              min: 0,
              max: 100,
              precision: .01
            }
          ],
          colour: 160,
          tooltip: 'Transformação Simples'
        })
      }
    }

    Blockly.Blocks.expression = {
      init: function () {
        this.jsonInit({
          message0: 'se %1 encontra %2 então',
          args0: [
            {
              type: 'field_dropdown',
              name: 'origin',
              options: ScriptBlocksCell.s._allSelectTypes
            },
            {
              type: 'field_dropdown',
              name: 'target',
              options: ScriptBlocksCell.s._allSelectTypes
            }
          ],
          message1: 'expressão %1 %2',
          args1: [
            {
              type: 'field_input',
              name: 'expression'
            },
            {
              type: 'input_value',
              name: 'action',
              check: 'Action'
            }
          ],
          colour: 170,
          tooltip: 'Computes expression.'
        })
      }
    }

    Blockly.Blocks.boid = {
      init: function () {
        this.jsonInit({
          message0: 'se %1 encontra %2 então',
          args0: [
            {
              type: 'field_dropdown',
              name: 'origin',
              options: ScriptBlocksCell.s._allSelectTypes
            },
            {
              type: 'field_dropdown',
              name: 'target',
              options: ScriptBlocksCell.s._allSelectTypes
            }
          ],
          message1: 'ação %1',
          args1: [
            {
              type: 'input_value',
              name: 'action',
              check: 'Action'
            }
          ],
          colour: 170,
          tooltip: 'Boid agent.'
        })
      }
    }

    Blockly.Blocks.condition = {
      init: function () {
        this.jsonInit({
          message0: 'se %1 encontra %2 então',
          args0: [
            {
              type: 'field_dropdown',
              name: 'origin',
              options: ScriptBlocksCell.s._allSelectTypes
            },
            {
              type: 'field_dropdown',
              name: 'target',
              options: ScriptBlocksCell.s._allSelectTypes
            }
          ],
          message1: 'ângulo de inclinação %1',
          args1: [
            {
              type: 'field_number',
              name: 'angle',
              value: 90,
              min: 0,
              max: 360
            }
          ],
          message2: 'detalhe %1',
          args2: [
            {
              type: 'field_dropdown',
              name: 'time_rate',
              options: [
                ['Pouco', '1'],
                ['Médio', '0.5'],
                ['Muito', '0.1']
              ]
            }
          ],
          message3: 'velocidade inicial %1',
          args3: [
            {
              type: 'input_value',
              name: 'initial_velocity',
              check: 'Velocity',
              align: 'RIGHT'
            }
          ],
          message4: 'gravidade %1',
          args4: [
            {
              type: 'input_value',
              name: 'gravity',
              check: 'Acceleration',
              align: 'RIGHT'
            }
          ],
          message5: 'ação %1',
          args5: [
            {
              type: 'input_value',
              name: 'action',
              check: 'Action',
              align: 'RIGHT'
            }
          ],
          colour: 170,
          tooltip: 'Computes expression.'
        })
      }
    }

    Blockly.Blocks.velocity = {
      init: function () {
        this.jsonInit({
          message0: '%1 m/s',
          args0: [
            {
              type: 'field_number',
              name: 'velocity',
              value: 1,
              min: 0
            }
          ],
          colour: 200,
          tooltip: 'Velocity.',
          output: 'Velocity'
        })
      }
    }

    Blockly.Blocks.acceleration = {
      init: function () {
        this.jsonInit({
          message0: '%1 m/s²',
          args0: [
            {
              type: 'field_dropdown',
              name: 'acceleration',
              options: [
                ['Terra - 9,8 m/s²', '0.98'],
                ['Lua - 1,62 m/s²', '0.162'],
                ['Júpiter - 24,79', '2.479']
              ]
            }
          ],
          colour: 240,
          tooltip: 'Acceleration.',
          output: 'Acceleration'
        })
      }
    }

    Blockly.Blocks.action_agent = {
      init: function () {
        this.jsonInit({
          message0: 'ação %1',
          args0: [
            {
              type: 'field_dropdown',
              name: 'action',
              options: [
                ['rastro', 'trail'],
                ['movimenta', 'move']
              ]
            }
          ],
          colour: 260,
          tooltip: 'Action.',
          output: 'Action'
        })
      }
    }

    Blockly.Blocks.action_probability = {
      init: function () {
        this.jsonInit({
          message0: 'ação %1',
          args0: [
            {
              type: 'field_dropdown',
              name: 'action',
              options: [
                ['movimenta', 'move'],
                ['duplica', 'duplicate'],
                ['desaparece', 'vanish'],
                ['rastro', 'trail']
              ]
            }
          ],
          message1: 'chance %1',
          args1: [
            {
              type: 'field_slider',
              name: 'probability',
              value: 100,
              min: 0,
              max: 100
            }
          ],
          colour: 230,
          tooltip: 'Action.',
          output: 'Action'
        })
      }
    }

    Blockly.Blocks.action_step = {
      init: function () {
        this.jsonInit({
          message0: 'ação %1',
          args0: [
            {
              type: 'field_dropdown',
              name: 'action',
              options: [
                ['movimenta', 'move'],
                ['duplica', 'duplicate'],
                ['desaparece', 'vanish'],
                ['rastro', 'trail']
              ]
            }
          ],
          message1: 'passo %1',
          args1: [
            {
              type: 'field_slider',
              name: 'step',
              value: 1,
              min: 0,
              max: 10
            }
          ],
          colour: 230,
          tooltip: 'Action.',
          output: 'Action'
        })
      }
    }

    Blockly.Blocks.disapear = {
      init: function () {
        this.jsonInit({
          message0: '%1 desaparecer',
          args0: [
            {
              type: 'field_dropdown',
              name: 'action',
              options: ScriptBlocksCell.s._selectTypes
            }
          ],
          message1: 'chance %1',
          args1: [
            {
              type: 'field_number',
              name: 'probability',
              value: 100,
              min: 0,
              max: 100
            }
          ],
          colour: 200,
          tooltip: 'Disapear.'
        })
      }
    }
  }

  _codeGenerator () {
    Blockly.JavaScript.neighbor = function (block) {
      const rule = '<rule-dcc-cell-pair ' +
                Blockly.JavaScript.statementToCode(block, 'action')
                  .replace(/_o/g, ScriptBlocksCell.s._types[block.getFieldValue('origin')])
                  .replace(/_t/g, ScriptBlocksCell.s._types[block.getFieldValue('target')]) +
                '>\n' +
                ((block.getFieldValue('upLeft') == 'TRUE') ? '*' : '_') +
                ((block.getFieldValue('up') == 'TRUE') ? '*' : '_') +
                ((block.getFieldValue('upRight') == 'TRUE') ? '*' : '_') + '\n' +
                ((block.getFieldValue('left') == 'TRUE') ? '*' : '_') + '_' +
                ((block.getFieldValue('right') == 'TRUE') ? '*' : '_') + '\n' +
                ((block.getFieldValue('downLeft') == 'TRUE') ? '*' : '_') +
                ((block.getFieldValue('down') == 'TRUE') ? '*' : '_') +
                ((block.getFieldValue('downRight') == 'TRUE') ? '*' : '_') + '\n' +
                '</rule-dcc-cell-pair>'
      return rule
    }

    Blockly.JavaScript.entity = function (block) {
      return (Blockly.JavaScript.statementToCode(block, 'action1') + '\n' +
              Blockly.JavaScript.statementToCode(block, 'action2') + '\n' +
              Blockly.JavaScript.statementToCode(block, 'action3'))
        .replace(/\$/g, ScriptBlocksCell.s._types[block.getFieldValue('entity')])
    }

    Blockly.JavaScript.entity_movement = function (block) {
      return `<rule-dcc-cell-pair probability="{prob}" transition="$_>_$">
 ***
 *_*
 ***
</rule-dcc-cell-pair>`
             .replace('{prob}', block.getFieldValue('movement')*10)
    }

    Blockly.JavaScript.entity_growth = function (block) {
      return `<rule-dcc-cell-pair probability="{prob}" transition="$_>$$">
 ***
 *_*
 ***
</rule-dcc-cell-pair>`
             .replace('{prob}', block.getFieldValue('growth')*10)
    }

    Blockly.JavaScript.entity_mortality = function (block) {
      return `<rule-dcc-cell-pair probability="{prob}" transition="$$>__">
 ___
 _*_
 ___
</rule-dcc-cell-pair>`
            .replace('{prob}', block.getFieldValue('mortality')*10)
    }

    Blockly.JavaScript.entity_eat = function (block) {
      return `<rule-dcc-cell-pair probability="{prob}" transition="$!>$$">
      ***
      *_*
      ***
</rule-dcc-cell-pair>`
            .replace('!', ScriptBlocksCell.s._types[block.getFieldValue('eat')])
            .replace('{prob}', block.getFieldValue('growth')*10)
    }

    Blockly.JavaScript.transform_horizontal = function (block) {
      const direction = block.getFieldValue('direction')
      let origin = [block.getFieldValue('or1'), block.getFieldValue('or2')]
      let trans = [block.getFieldValue('trans1'), block.getFieldValue('trans2')]
      if (direction == 'left') {
        origin = [origin[1], origin[0]]
        trans = [trans[1], trans[0]]
      }
      const rule = '<rule-dcc-cell-pair ' +
                " probability='" + block.getFieldValue('probability') + "'" +
                " transition='" +
                  ScriptBlocksCell.s._types[origin[0]] +
                  ScriptBlocksCell.s._types[origin[1]] + '>' +
                  ScriptBlocksCell.s._types[trans[0]] +
                  ScriptBlocksCell.s._types[trans[1]] + "'" +
                '>\n' +
                '___\n' +
                ((direction == 'left') ? '*__\n' : '__*\n') +
                '___\n' +
                '</rule-dcc-cell-pair>'
      let rulei = ''
      if (block.getFieldValue('reflect') == 'TRUE') {
        rulei = '\n<rule-dcc-cell-pair ' +
                " probability='" + block.getFieldValue('probability') + "'" +
                " transition='" +
                  ScriptBlocksCell.s._types[ScriptBlocksCell._invertDirection(origin[0])] +
                  ScriptBlocksCell.s._types[ScriptBlocksCell._invertDirection(origin[1])] + '>' +
                  ScriptBlocksCell.s._types[ScriptBlocksCell._invertDirection(trans[0])] +
                  ScriptBlocksCell.s._types[ScriptBlocksCell._invertDirection(trans[1])] + "'" +
                '>\n' +
                '___\n' +
                ((direction == 'left') ? '__*\n' : '*__\n') +
                '___\n' +
                '</rule-dcc-cell-pair>'
      }
      return rule + rulei
    }

    Blockly.JavaScript.transform_vertical = function (block) {
      const direction = block.getFieldValue('direction')
      let origin = [block.getFieldValue('or1'), block.getFieldValue('or2')]
      let trans = [block.getFieldValue('trans1'), block.getFieldValue('trans2')]
      if (direction == 'up') {
        origin = [origin[1], origin[0]]
        trans = [trans[1], trans[0]]
      }
      const rule = '<rule-dcc-cell-pair ' +
                " probability='" + block.getFieldValue('probability') + "'" +
                " transition='" +
                  ScriptBlocksCell.s._types[origin[0]] +
                  ScriptBlocksCell.s._types[origin[1]] + '>' +
                  ScriptBlocksCell.s._types[trans[0]] +
                  ScriptBlocksCell.s._types[trans[1]] + "'" +
                '>\n' +
                ((direction == 'up') ? '_*_\n' : '___\n') +
                '___\n' +
                ((direction == 'down') ? '_*_\n' : '___\n') +
                '</rule-dcc-cell-pair>'
      let rulei = ''
      if (block.getFieldValue('reflect') == 'TRUE') {
        rulei = '\n<rule-dcc-cell-pair ' +
                " probability='" + block.getFieldValue('probability') + "'" +
                " transition='" +
                  ScriptBlocksCell.s._types[ScriptBlocksCell._invertDirection(origin[0])] +
                  ScriptBlocksCell.s._types[ScriptBlocksCell._invertDirection(origin[1])] + '>' +
                  ScriptBlocksCell.s._types[ScriptBlocksCell._invertDirection(trans[0])] +
                  ScriptBlocksCell.s._types[ScriptBlocksCell._invertDirection(trans[1])] + "'" +
                '>\n' +
                ((direction == 'down') ? '_*_\n' : '___\n') +
                '___\n' +
                ((direction == 'up') ? '_*_\n' : '___\n') +
                '</rule-dcc-cell-pair>'
      }
      return rule + rulei
    }
    Blockly.JavaScript.transform = function (block) {
      const rule = '<rule-dcc-cell-pair ' +
                " probability='" + block.getFieldValue('probability') + "'" +
                " transition='" +
                  ScriptBlocksCell.s._types[block.getFieldValue('or1')] +
                  ScriptBlocksCell.s._types[block.getFieldValue('or2')] + '>' +
                  ScriptBlocksCell.s._types[block.getFieldValue('trans1')] +
                  ScriptBlocksCell.s._types[block.getFieldValue('trans2')] + "'" +
                '>\n' +
                ((block.getFieldValue('upLeft') == 'TRUE') ? '*' : '_') +
                ((block.getFieldValue('up') == 'TRUE') ? '*' : '_') +
                ((block.getFieldValue('upRight') == 'TRUE') ? '*' : '_') + '\n' +
                ((block.getFieldValue('left') == 'TRUE') ? '*' : '_') + '_' +
                ((block.getFieldValue('right') == 'TRUE') ? '*' : '_') + '\n' +
                ((block.getFieldValue('downLeft') == 'TRUE') ? '*' : '_') +
                ((block.getFieldValue('down') == 'TRUE') ? '*' : '_') +
                ((block.getFieldValue('downRight') == 'TRUE') ? '*' : '_') + '\n' +
                '</rule-dcc-cell-pair>'
      return rule
    }

    Blockly.JavaScript.single = function (block) {
      const rule = '<rule-dcc-cell-pair ' +
                " probability='" + block.getFieldValue('probability') + "'" +
                " transition='" +
                  ScriptBlocksCell.s._types[block.getFieldValue('or1')] +
                  ScriptBlocksCell.s._types[block.getFieldValue('or1')] + '>' +
                  ScriptBlocksCell.s._types[block.getFieldValue('trans1')] +
                  ScriptBlocksCell.s._types[block.getFieldValue('trans1')] + "'" +
                '>\n' +
                '___\n' +
                '_*_\n' +
                '___\n' +
                '</rule-dcc-cell-pair>'
      return rule
    }

    Blockly.JavaScript.expression = function (block) {
      const result = '<rule-dcc-cell-expression ' +
                "expression='" + block.getFieldValue('expression') + "' " +
                Blockly.JavaScript.statementToCode(block, 'action')
                  .replace(/_o/g, ScriptBlocksCell.s._types[block.getFieldValue('origin')])
                  .replace(/_t/g, ScriptBlocksCell.s._types[block.getFieldValue('target')]) +
                '>\n' +
                '</rule-dcc-cell-expression>'
      return result
    }

    Blockly.JavaScript.boid = function (block) {
      const result = '<rule-dcc-cell-agent ' +
                Blockly.JavaScript.statementToCode(block, 'action')
                  .replace(/_o/g, ScriptBlocksCell.s._types[block.getFieldValue('origin')])
                  .replace(/_t/g, ScriptBlocksCell.s._types[block.getFieldValue('target')]) +
                '>\n' +
                '</rule-dcc-cell-agent>'
      return result
    }

    Blockly.JavaScript.condition = function (block) {
      let expX = 'x:=x0'
      let expY = 'y:=y0'
      const angle = block.getFieldValue('angle')
      const v0 = Blockly.JavaScript.statementToCode(block, 'initial_velocity').trim()
      if (v0.length > 0) {
        expX += '+' + v0 + '*cos(' + angle + ')*t'
        expY += '-' + v0 + '*sin(' + angle + ')*t'
      }
      const a = Blockly.JavaScript.statementToCode(block, 'gravity').trim()
      if (a.length > 0) { expY += '+' + a + '*(t^2/2)' }
      const result = '<rule-dcc-cell-expression ' +
                "expression='" + expX + ';' + expY + "' " +
                "time-rate='" + block.getFieldValue('time_rate') + "' " +
                Blockly.JavaScript.statementToCode(block, 'action')
                  .replace(/_o/g, ScriptBlocksCell.s._types[block.getFieldValue('origin')])
                  .replace(/_t/g, ScriptBlocksCell.s._types[block.getFieldValue('target')]) +
                '>\n' +
                '</rule-dcc-cell-expression>'
      return result
    }

    Blockly.JavaScript.velocity = function (block) {
      return '' + block.getFieldValue('velocity')
    }

    Blockly.JavaScript.acceleration = function (block) {
      return '' + block.getFieldValue('acceleration')
    }

    Blockly.JavaScript.action_probability = function (block) {
      return " probability='" + block.getFieldValue('probability') + "'" +
                " transition='" + ScriptBlocksCell.transitions[block.getFieldValue('action')] + "'"
    }

    Blockly.JavaScript.action_step = function (block) {
      return " step='" + block.getFieldValue('step') + "'" +
                " transition='" + ScriptBlocksCell.transitions[block.getFieldValue('action')] + "'"
    }

    Blockly.JavaScript.action_agent = function (block) {
      return " probability='100' " +
                " transition='" + ScriptBlocksCell.transitions[block.getFieldValue('action')] + "'"
    }

    /*
<rule-dcc-cell-pair label="fall vertical" probability="100" transition="._>_.">
___
___
_*_
</rule-dcc-cell-pair>
*/
  }
}

(function () {
  ScriptBlocksCell.defaultIconPath = '/scripts/icon/'

  ScriptBlocksCell.emptyType = ['empty', '_', 'vazio']

  ScriptBlocksCell.transitions = {
    move: '_o_t>_t_o',
    duplicate: '_o_t>_o_o',
    vanish: '_o_t>__t',
    trail: '_o_t>#_o'
  }
})()
