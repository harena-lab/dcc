(function () {
  AuthorCellManager.instance.insertSource(
    'Colors',
    [['empty', '_', { src: 'images/cell/cell-yellow-green.png', width: 25, height: 25, alt: 'empty' }],
     ['healthy', '1', { src: 'images/cell/person-healthy.svg', width: 25, height: 25, alt: 'healthy' }],
     ['vaccinated', '2', { src: 'images/cell/person-vaccinated.svg', width: 25, height: 25, alt: 'vaccinated' }],
     ['disease', '3', { src: 'images/cell/person-disease.svg', width: 25, height: 25, alt: 'disease' }],
     ['recovered', '4', { src: 'images/cell/person-recovered.svg', width: 25, height: 25, alt: 'recovered' }],
     ['ghost', '5', { src: 'images/cell/ghost.svg', width: 25, height: 25, alt: 'ghost' }],
     ['purple', '6', { src: 'images/cell/cell-purple.svg', width: 25, height: 25, alt: 'purple' }],
     ['tile', '7', { src: 'images/cell/cell-tile.svg', width: 25, height: 25, alt: 'tile' }],
     ['yellow', '8', { src: 'images/cell/cell-yellow.svg', width: 25, height: 25, alt: 'yellow' }],
     ['brown', '9', { src: 'images/cell/cell-brown.svg', width: 25, height: 25, alt: 'brown' }],
     ['gray-darker', 'z', { src: 'images/cell/cell-gray-darker.svg', width: 25, height: 25, alt: 'darker gray' }]
    ],
`<category name="Ação" colour="210">
  <block type="transform"></block>
  <block type="single"></block>
</category>`,
`<dcc-space-cellular-editor id="cellular-space" rows="28" cols="40"
  cell-width="16" cell-height="16" background-color="#dddddd" grid analysis policy="crescent">
</dcc-space-cellular-editor>

<dcc-cell-image type="1" label="healthy" image="images/cell/person-healthy.svg"></dcc-cell-image>
<dcc-cell-image type="2" label="vaccinated" image="images/cell/person-vaccinated.svg"></dcc-cell-image>
<dcc-cell-image type="3" label="disease" image="images/cell/person-disease.svg"></dcc-cell-image>
<dcc-cell-image type="4" label="recovered" image="images/cell/person-recovered.svg"></dcc-cell-image>
<dcc-cell-image type="5" label="ghost" image="images/cell/ghost.svg"></dcc-cell-image>
<dcc-cell-image type="6" label="purple" image="images/cell/cell-purple.svg"></dcc-cell-image>
<dcc-cell-image type="7" label="tile" image="images/cell/cell-tile.svg"></dcc-cell-image>
<dcc-cell-image type="8" label="yellow" image="images/cell/cell-yellow.svg"></dcc-cell-image>
<dcc-cell-image type="9" label="brown" image="images/cell/cell-brown.svg"></dcc-cell-image>
<dcc-cell-image type="z" label="gray-darker" image="images/cell/cell-gray-darker.svg"></dcc-cell-image>

<dcc-timer cycles="100000" interval="1000" topic="state/next">
   <subscribe-dcc topic="timer/start" map="start"></subscribe-dcc>
   <subscribe-dcc topic="timer/stop" map="stop"></subscribe-dcc>
   <subscribe-dcc topic="input/changed/timer_interval" map="interval"></subscribe-dcc>
</dcc-timer>

<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <div style="flex:20%; max-width:96px; max-height:48px">
      <img style="max-width:48px; max-height:48px; margin-left:24px; margin-right:24px"
           src="images/icon/clock.svg">
   </div>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="timer_interval" min="1" max="1000" value="1000" index></dcc-slider>
   </div>
</div>

<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <div style="flex:20%; max-width:96px; max-height:48px">
      <img style="max-width:48px; max-height:48px; margin-left:24px; margin-right:24px"
           src="images/icon/zoom.svg">
   </div>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="space_scale" min="1" max="100" value="1" index></dcc-slider>
   </div>
</div>

<subscribe-dcc target="cellular-space" topic="type/#"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/next" map="next"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/save" map="save"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/reset" map="reset"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="input/changed/space_scale" map="scale"></subscribe-dcc>`,
`Selecione um dos ícones abaixo para editar o ambiente:
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row; border:2px">
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Healthy" topic="type/healthy"
                   image="images/cell/person-healthy.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Vaccinated" topic="type/vaccinated"
                   image="images/cell/person-vaccinated.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Disease" topic="type/disease"
                   image="images/cell/person-disease.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Recovered" topic="type/recovered"
                   image="images/cell/person-recovered.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Ghost" topic="type/ghost"
                   image="images/cell/ghost.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Purple" topic="type/purple"
                   image="images/cell/cell-purple.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Red" topic="type/tile"
                   image="images/cell/cell-tile.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Yellow" topic="type/yellow"
                   image="images/cell/cell-yellow.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Yellow-Green" topic="type/brown"
                   image="images/cell/cell-brown.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Darker Gray" topic="type/gray-darker"
                   image="images/cell/cell-gray-darker.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Gray" topic="type/empty"
                   image="images/cell/cell-gray.svg">
      </dcc-button>
   </div>
</div>`
  )
})()
