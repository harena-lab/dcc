(function () {
  AuthorCellManager.instance.insertSource(
    'Micromundos',
    [],
`<block type="neighbor"></block>
<block type="action"></block>`,
`<dcc-space-cellular-editor id="cellular-space" rows="28" cols="40"
  cell-width="16" cell-height="16" background-color="#d6f0ff" grid>
</dcc-space-cellular-editor>

<dcc-cell-image type="p" label="alga" image="images/cell/alga.svg"></dcc-cell-image>
<dcc-cell-image type="h" label="nematode" image="images/cell/nematode.svg"></dcc-cell-image>
<dcc-cell-image type="c" label="tardigrade" image="images/cell/tardigrade.svg"></dcc-cell-image>

<rule-dcc-cell-pair id="alga-dies" label="alga dies" probability="0" transition="pp>__">
   ___
   _*_
   ___
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="alga-replicates" label="alga replicates" probability="0" transition="p_>pp">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="nematode-dies" label="nematode dies" probability="0" transition="hh>__">
   ___
   _*_
   ___
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="nematode-replicates" label="nematode eat and replicates"
                    probability="0" transition="hp>hh">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair label="nematode moves" probability="50" transition="h_>_h">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="tardigrade-dies" label="tardigrade dies" probability="0" transition="cc>__">
   ___
   _*_
   ___
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="tardigrade-replicates" label="tardigrade eat and replicates"
                    probability="0" transition="ch>cc">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair label="tardigrade moves" probability="50" transition="c_>_c">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair label="tardigrade moves" probability="50" transition="cp>pc">
   ***
   *_*
   ***
</rule-dcc-cell-pair>

<dcc-timer cycles="100000" interval="1000" topic="state/next">
   <subscribe-dcc topic="timer/start" map="start"></subscribe-dcc>
   <subscribe-dcc topic="timer/stop" map="stop"></subscribe-dcc>
</dcc-timer>

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
      <dcc-button label="alga" topic="type/alga"
                   image="images/cell/alga.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="nematóide" topic="type/nematode"
                   image="images/cell/nematode.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="tardígrado" topic="type/tardigrade"
                   image="images/cell/tardigrade.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Nada" topic="type/empty"
                   image="images/cell/cell-blue.svg">
      </dcc-button>
   </div>
</div>
Selecione abaixo a chance de cada um dos eventos:
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <img src="images/cell/alga.svg" style="flex:10%; max-width:48px; max-height:48px">
   <img src="images/cell/alga.svg" style="flex:10%; max-width:48px; max-height:48px">
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="alga_replicates" value="0" index></dcc-slider>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <div style="flex:20%; max-width:96px; max-height:48px">
      <img style="max-width:96px; max-height:48px; margin-left:24px; margin-right:24px"
           src="images/cell/alga-dies.svg">
   </div>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="alga_dies" value="0" index></dcc-slider>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <img src="images/cell/nematode.svg" style="flex:10%; max-width:48px; max-height:48px">
   <img src="images/cell/nematode.svg" style="flex:10%; max-width:48px; max-height:48px">
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="nematode_replicates" value="0" index></dcc-slider>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <div style="flex:20%; max-width:96px; max-height:48px">
      <img style="max-width:96px; max-height:48px; margin-left:24px; margin-right:24px"
           src="images/cell/nematode-dies.svg" style="flex:10%; max-width:48px; max-height:48px">
   </div>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="nematode_dies" value="0" index></dcc-slider>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <img src="images/cell/tardigrade.svg" style="flex:10%; max-width:48px; max-height:48px">
   <img src="images/cell/tardigrade.svg" style="flex:10%; max-width:48px; max-height:48px">
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="tardigrade_replicates" value="0" index></dcc-slider>
   </div>
</div>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <div style="flex:20%; max-width:96px; max-height:48px">
      <img style="max-width:96px; max-height:48px; margin-left:24px; margin-right:24px"
           src="images/cell/tardigrade-dies.svg" style="flex:10%; max-width:48px; max-height:48px">
   </div>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="tardigrade_dies" value="0" index></dcc-slider>
   </div>
</div>

<subscribe-dcc target="alga-replicates" topic="input/changed/alga_replicates" map="probability">
</subscribe-dcc>
<subscribe-dcc target="alga-dies" topic="input/changed/alga_dies" map="probability"></subscribe-dcc>
<subscribe-dcc target="nematode-replicates" topic="input/changed/nematode_replicates" map="probability">
</subscribe-dcc>
<subscribe-dcc target="nematode-dies" topic="input/changed/nematode_dies" map="probability">
</subscribe-dcc>
<subscribe-dcc target="tardigrade-replicates" topic="input/changed/tardigrade_replicates" map="probability">
</subscribe-dcc>
<subscribe-dcc target="tardigrade-dies" topic="input/changed/tardigrade_dies" map="probability">
</subscribe-dcc>`
  )
})()
