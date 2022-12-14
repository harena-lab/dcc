(function () {
  AuthorCellManager.instance.insertSource(
    'Simulando Vírus',
    [],
`<block type="neighbor"></block>
<block type="action"></block>`,
`<dcc-space-cellular-editor id="cellular-space" rows="28" cols="40"
  cell-width="16" cell-height="16" background-color="#ebeba2" grid>
</dcc-space-cellular-editor>

<dcc-cell-image type="h" label="healthy" image="images/cell/person-healthy.svg"></dcc-cell-image>
<dcc-cell-image type="v" label="vaccinated" image="images/cell/person-vaccinated.svg"></dcc-cell-image>
<dcc-cell-image type="d" label="disease" image="images/cell/person-disease.svg"></dcc-cell-image>
<dcc-cell-image type="r" label="recovered" image="images/cell/person-recovered.svg"></dcc-cell-image>
<dcc-cell-image type="n" label="nurse" image="images/cell/nurse.svg"></dcc-cell-image>
<dcc-cell-image type="g" label="ghost" image="images/cell/ghost.svg"></dcc-cell-image>
<dcc-cell-image type="w" label="wall" image="images/cell/wall.svg"></dcc-cell-image>
<dcc-cell-image type="t" label="tombstone" image="images/cell/tombstone.svg"></dcc-cell-image>

<rule-dcc-cell-pair label="healthy moves" probability="50" transition="h_>_h">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair label="vaccinated moves" probability="50" transition="v_>_v">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair label="sick moves" probability="50" transition="d_>_d">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair label="recovered moves" probability="50" transition="r_>_r">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair label="nurse moves" probability="50" transition="n_>_n">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="contagion" label="contagion" probability="0" transition="dh>dd">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="contagion-vaccinated" label="contagion vaccinated" probability="0" transition="dv>dd">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="contagion-recovered" label="contagion recovered" probability="0" transition="dr>rr">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="nurse-vaccinate" label="nurse vaccinate" probability="0" transition="nh>nv">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="sick-cured" label="sick cured" probability="0" transition="dd>rr">
   ___
   _*_
   ___
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="sick-dies" label="sick dies" probability="0" transition="dd>gg">
   ___
   _*_
   ___
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="ghost-dies" label="ghost dies" probability="40" transition="gg>tt">
   ___
   _*_
   ___
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
      <dcc-button label="Healthy" topic="type/healthy"
                  image="images/cell/person-healthy.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="vaccinated" topic="type/vaccinated"
                   image="images/cell/person-vaccinated.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="disease" topic="type/disease"
                   image="images/cell/person-disease.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="wall" topic="type/wall"
                   image="images/cell/wall.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="nurse" topic="type/nurse"
                   image="images/cell/nurse.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Nada" topic="type/empty"
                   image="images/cell/cell-yellow-green.svg">
      </dcc-button>
   </div>
</div>
Selecione abaixo a chance de cada um dos eventos:
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <img src="images/cell/person-healthy.svg" style="flex:10%; max-width:48px; max-height:48px">
   <img src="images/cell/person-disease.svg" style="flex:10%; max-width:48px; max-height:48px">
   <span style="border-left:6px solid gray; height: 48px;"></span>
   <img src="images/cell/person-disease.svg" style="flex:10%; max-width:48px; max-height:48px">
   <img src="images/cell/person-disease.svg" style="flex:10%; max-width:48px; max-height:48px">
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="contagion" value="0" index></dcc-slider>
   </div>
</div>
<hr>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <img src="images/cell/person-vaccinated.svg" style="flex:10%; max-width:48px; max-height:48px">
   <img src="images/cell/person-disease.svg" style="flex:10%; max-width:48px; max-height:48px">
   <span style="border-left:6px solid gray; height: 48px;"></span>
   <img src="images/cell/person-disease.svg" style="flex:10%; max-width:48px; max-height:48px">
   <img src="images/cell/person-disease.svg" style="flex:10%; max-width:48px; max-height:48px">
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="contagion_vaccinated" value="0" index></dcc-slider>
   </div>
</div>
<hr>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <img src="images/cell/person-healthy.svg" style="flex:10%; max-width:48px; max-height:48px">
   <img src="images/cell/nurse.svg" style="flex:10%; max-width:48px; max-height:48px">
   <span style="border-left:6px solid gray; height: 48px;"></span>
   <img src="images/cell/person-vaccinated.svg" style="flex:10%; max-width:48px; max-height:48px">
   <img src="images/cell/nurse.svg" style="flex:10%; max-width:48px; max-height:48px">
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="nurse_vaccinate" value="0" index></dcc-slider>
   </div>
</div>
<hr>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <span style="flex:5%; max-width:24px; max-height:48px"></span>
   <img src="images/cell/person-disease.svg" style="flex:10%; max-width:48px; max-height:48px">
   <span style="flex:5%; max-width:24px; max-height:48px"></span>
   <span style="border-left:6px solid gray; height: 48px;"></span>
   <span style="flex:5%; max-width:24px; max-height:48px"></span>
   <img src="images/cell/person-recovered.svg" style="flex:10%; max-width:48px; max-height:48px">
   <span style="flex:5%; max-width:24px; max-height:48px"></span>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="sick_cured" value="0" index></dcc-slider>
   </div>
</div>
<hr>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   <span style="flex:5%; max-width:24px; max-height:48px"></span>
   <img src="images/cell/person-disease.svg" style="flex:10%; max-width:48px; max-height:48px">
   <span style="flex:5%; max-width:24px; max-height:48px"></span>
   <span style="border-left:6px solid gray; height: 48px;"></span>
   <span style="flex:5%; max-width:24px; max-height:48px"></span>
   <img src="images/cell/ghost.svg" style="flex:10%; max-width:48px; max-height:48px">
   <span style="flex:5%; max-width:24px; max-height:48px"></span>
   <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="sick_dies" value="0" index></dcc-slider>
   </div>
</div>

<subscribe-dcc target="contagion" topic="input/changed/contagion" map="probability">
</subscribe-dcc>
<subscribe-dcc target="contagion-vaccinated" topic="input/changed/contagion_vaccinated" map="probability">
</subscribe-dcc>
<subscribe-dcc target="contagion-vaccinated" topic="input/changed/contagion_recovered" map="probability">
</subscribe-dcc>
<subscribe-dcc target="nurse-vaccinate" topic="input/changed/nurse_vaccinate" map="probability">
</subscribe-dcc>
<subscribe-dcc target="sick-cured" topic="input/changed/sick_cured" map="probability">
</subscribe-dcc>
<subscribe-dcc target="sick-dies" topic="input/changed/sick_dies" map="probability">
</subscribe-dcc>`
  )
})()
