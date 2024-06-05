(function () {
  AuthorCellManager.instance.insertSource(
    'Mutantes',
    [['empty', '_', { src: 'images/cell/cell-gray.svg', width: 25, height: 25, alt: 'vazio' }],
     ['cell1', '1', { src: 'images/cell/cell-1.png', width: 25, height: 25, alt: 'célula 1' }],
     ['cell3', '3', { src: 'images/cell/cell-3.png', width: 25, height: 25, alt: 'célula 3' }],
     ['cell5', '5', { src: 'images/cell/cell-5.png', width: 25, height: 25, alt: 'célula 5' }],
     ['yellow','y', { src: 'images/cell/cell-yellow.svg', width: 25, height: 25, alt: 'yellow' }],
     ['brown', 'b', { src: 'images/cell/cell-brown.svg', width: 25, height: 25, alt: 'brown' }],
     ['red',   'r', { src: 'images/cell/cell-red.svg', width: 25, height: 25, alt: 'red' }]
    ],
``,
`<dcc-space-cellular-editor id="cellular-space" rows="28" cols="40"
cell-width="20" cell-height="20" background-color="#dddddd" grid analysis>
</dcc-space-cellular-editor>

<div style="flex:48px; max-height:48px; display:flex; flex-direction:row; border:2px">
<div style="flex:10%; max-width:40px; max-height:40px; margin-right:10px">
  <dcc-button label="vazio" topic="type/empty"
               image="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-gray.svg">
  </dcc-button>
</div><div style="flex:10%; max-width:40px; max-height:40px; margin-right:10px">
  <dcc-button label="célula 1" topic="type/cell1"
               image="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-1.png">
  </dcc-button>
</div><div style="flex:10%; max-width:40px; max-height:40px; margin-right:10px">
  <dcc-button label="célula 3" topic="type/cell3"
               image="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-3.png">
  </dcc-button>
</div><div style="flex:10%; max-width:40px; max-height:40px; margin-right:10px">
  <dcc-button label="célula 5" topic="type/cell5"
               image="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-5.png">
  </dcc-button>
</div><div style="flex:10%; max-width:40px; max-height:40px; margin-right:10px">
  <dcc-button label="yellow" topic="type/yellow"
               image="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-yellow.svg">
  </dcc-button>
</div><div style="flex:10%; max-width:40px; max-height:40px; margin-right:10px">
  <dcc-button label="brown" topic="type/brown"
               image="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-brown.svg">
  </dcc-button>
</div><div style="flex:10%; max-width:40px; max-height:40px; margin-right:10px">
  <dcc-button label="red" topic="type/red"
               image="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-red.svg">
  </dcc-button>
</div>
</div>

<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
 <div style="flex:20%; max-width:96px; max-height:48px">
    <img style="max-width:48px; max-height:48px; margin-left:24px; margin-right:24px"
         src="images/icon/clock.svg">
 </div>
 <div style="flex:50%; max-height:48px; margin-right:10px; padding-top: 15px">
   <dcc-input-choice variable="timer_interval" reveal="horizontal" exclusive><dcc-input-option value="1000" checked>1</dcc-input-option><dcc-input-option value="500">2</dcc-input-option><dcc-input-option value="200">3</dcc-input-option><dcc-input-option value="100">4</dcc-input-option><dcc-input-option value="1">5</dcc-input-option></dcc-input-choice>
 </div>
</div>

<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
 <div style="flex:20%; max-width:96px; max-height:48px">
    <img style="max-width:48px; max-height:48px; margin-left:24px; margin-right:24px"
         src="images/icon/zoom.svg">
 </div>
 <div style="flex:50%; max-height:48px; margin-right:10px; padding-top: 15px">
   <dcc-input-choice variable="space_scale" reveal="horizontal" exclusive><dcc-input-option checked>1</dcc-input-option><dcc-input-option>2</dcc-input-option><dcc-input-option>3</dcc-input-option></dcc-input-choice>
 </div>
</div>

<dcc-cell-image type="." label="vazio" image="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-gray.svg"></dcc-cell-image>
<dcc-cell-image type="1" label="cell1" image="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-1.png"></dcc-cell-image>
<dcc-cell-image type="3" label="cell3" image="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-3.png"></dcc-cell-image>
<dcc-cell-image type="5" label="cell5" image="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-5.png"></dcc-cell-image>
<dcc-cell-image type="y" label="yellow" image="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-yellow.svg"></dcc-cell-image>
<dcc-cell-image type="b" label="brown" image="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-brown.svg"></dcc-cell-image>
<dcc-cell-image type="r" label="red" image="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-red.svg"></dcc-cell-image>

<rule-dcc-cell-pair id="c1-duplicates" label="duplicates" probability="0" transition="1_>11">
 ***
 *_*
 ***
</rule-dcc-cell-pair>
<subscribe-dcc target="c1-duplicates" topic="input/changed/c1duplicates" map="probability">
</subscribe-dcc>
<rule-dcc-cell-pair id="c1-dies" label="dies" probability="0" transition="11>__">
 ___
 _*_
 ___
</rule-dcc-cell-pair>
<subscribe-dcc target="c1-dies" topic="input/changed/c1dies" map="probability">
</subscribe-dcc>
<rule-dcc-cell-pair id="c1-mutant" label="mutant" probability="0" transition="11>33">
 ___
 _*_
 ___
</rule-dcc-cell-pair>
<subscribe-dcc target="c1-mutant" topic="input/changed/c1mutant" map="probability">
</subscribe-dcc>

<rule-dcc-cell-pair id="c3-duplicates" label="duplicates" probability="0" transition="3_>33">
 ***
 *_*
 ***
</rule-dcc-cell-pair>
<subscribe-dcc target="c3-duplicates" topic="input/changed/c3duplicates" map="probability">
</subscribe-dcc>
<rule-dcc-cell-pair id="c3-dies" label="dies" probability="0" transition="33>__">
 ___
 _*_
 ___
</rule-dcc-cell-pair>
<subscribe-dcc target="c3-dies" topic="input/changed/c3dies" map="probability">
</subscribe-dcc>
<rule-dcc-cell-pair id="c3-mutant" label="mutant" probability="0" transition="33>55">
 ___
 _*_
 ___
</rule-dcc-cell-pair>
<subscribe-dcc target="c3-mutant" topic="input/changed/c3mutant" map="probability">
</subscribe-dcc>

<rule-dcc-cell-pair id="c5-duplicates" label="duplicates" probability="0" transition="5_>55">
 ***
 *_*
 ***
</rule-dcc-cell-pair>
<subscribe-dcc target="c5-duplicates" topic="input/changed/c5duplicates" map="probability">
</subscribe-dcc>
<rule-dcc-cell-pair id="c5-dies" label="dies" probability="0" transition="55>__">
 ___
 _*_
 ___
</rule-dcc-cell-pair>
<subscribe-dcc target="c5-dies" topic="input/changed/c5dies" map="probability">
</subscribe-dcc>
<rule-dcc-cell-pair id="c5-barrier" label="barrier" probability="0" transition="5b>55">
 ***
 *_*
 ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="c5-blood" label="blood" probability="0" transition="5r>55">
 ***
 *_*
 ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="c5-moves" label="moves" probability="0" transition="5y>y5">
 ***
 *_*
 ***
</rule-dcc-cell-pair>
<subscribe-dcc target="c5-barrier" topic="input/changed/c5moves" map="probability">
</subscribe-dcc>
<subscribe-dcc target="c5-blood" topic="input/changed/c5moves" map="probability">
</subscribe-dcc>
<subscribe-dcc target="c5-moves" topic="input/changed/c5moves" map="probability">
</subscribe-dcc>

<dcc-timer cycles="100000" interval="1000" topic="state/next">
 <subscribe-dcc topic="timer/start" map="start"></subscribe-dcc>
 <subscribe-dcc topic="timer/stop" map="stop"></subscribe-dcc>
 <subscribe-dcc topic="input/changed/timer_interval" map="interval"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" topic="type/#"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/next" map="next"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/save" map="save"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/reset" map="reset"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="input/changed/space_scale" map="scale"></subscribe-dcc>`,
`<div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-1-double.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c1duplicates" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="5">1</dcc-input-option><dcc-input-option value="20">2</dcc-input-option><dcc-input-option value="30">3</dcc-input-option><dcc-input-option value="60">4</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-1-dies.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c1dies" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="5">1</dcc-input-option><dcc-input-option value="20">2</dcc-input-option><dcc-input-option value="30">3</dcc-input-option><dcc-input-option value="60">4</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-1-mutate-cell-3.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c1mutant" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="0.5">1</dcc-input-option><dcc-input-option value="2">3</dcc-input-option><dcc-input-option value="5">5</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-3-double.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c3duplicates" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="5">1</dcc-input-option><dcc-input-option value="20">2</dcc-input-option><dcc-input-option value="30">3</dcc-input-option><dcc-input-option value="60">4</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-3-dies.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c3dies" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="5">1</dcc-input-option><dcc-input-option value="20">2</dcc-input-option><dcc-input-option value="30">3</dcc-input-option><dcc-input-option value="60">4</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-3-mutate-cell-5.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c3mutant" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="0.5">1</dcc-input-option><dcc-input-option value="2">3</dcc-input-option><dcc-input-option value="5">5</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-5-double.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c5duplicates" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="5">1</dcc-input-option><dcc-input-option value="20">2</dcc-input-option><dcc-input-option value="30">3</dcc-input-option><dcc-input-option value="60">4</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-5-dies.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c5dies" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="5">1</dcc-input-option><dcc-input-option value="20">2</dcc-input-option><dcc-input-option value="30">3</dcc-input-option><dcc-input-option value="60">4</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="https://mc-unicamp.github.io/oficinas/simula/mutant/image/cell-5-moves.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c5moves" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="5">1</dcc-input-option><dcc-input-option value="30">3</dcc-input-option><dcc-input-option value="80">5</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr>`
  )
})()
