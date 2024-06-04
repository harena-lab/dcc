/*! For license information please see index.js.LICENSE.txt */
!function(e,r){if("object"==typeof exports&&"object"==typeof module)module.exports=r(require("blockly/core"));else if("function"==typeof define&&define.amd)define(["blockly/core"],r);else{var n="object"==typeof exports?r(require("blockly/core")):r(e.Blockly);for(var t in n)("object"==typeof exports?exports:e)[t]=n[t]}}(this,(function(e){return(()=>{"use strict";var r={573:r=>{r.exports=e}},n={};function t(e){var i=n[e];if(void 0!==i)return i.exports;var o=n[e]={exports:{}};return r[e](o,o.exports,t),o.exports}t.d=(e,r)=>{for(var n in r)t.o(r,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},t.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),t.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var i={};return(()=>{t.r(i),t.d(i,{FieldSlider:()=>r});var e=t(573);class r extends e.FieldNumber{constructor(e,r,n,t,i,o){super(e,r,n,t,i,o),this.boundEvents=[],this.sliderInput=null}static fromJson(e){return new r(e.value,void 0,void 0,void 0,void 0,e)}showEditor_(r,n){super.showEditor_(r,!0);const t=this.dropdownCreate_();e.DropDownDiv.getContentDiv().appendChild(t);const i=this.getSourceBlock(),o=i.getColour()||"",d=i.getColourTertiary()||"";e.DropDownDiv.setColour(o,d),e.DropDownDiv.showPositionedByField(this,this.dropdownDispose_.bind(this)),n||t.firstChild.focus({preventScroll:!0})}render_(){super.render_(),this.updateSlider_()}dropdownCreate_(){const r=document.createElement("div");r.className="fieldSliderContainer";const n=document.createElement("input");return n.setAttribute("type","range"),n.setAttribute("min",`${this.min_}`),n.setAttribute("max",`${this.max_}`),n.setAttribute("step",`${this.precision_}`),n.setAttribute("value",this.getValue()),n.setAttribute("tabindex","0"),n.className="fieldSlider",r.appendChild(n),this.sliderInput=n,this.boundEvents.push(e.browserEvents.conditionalBind(n,"input",this,this.onSliderChange_)),r}dropdownDispose_(){for(const r of this.boundEvents)e.browserEvents.unbind(r);this.boundEvents.length=0,this.sliderInput=null}onSliderChange_(){var e;this.setEditorValue_(null===(e=this.sliderInput)||void 0===e?void 0:e.value),this.resizeEditor_()}updateSlider_(){this.sliderInput&&this.sliderInput.setAttribute("value",this.getValue())}}e.fieldRegistry.register("field_slider",r),e.Css.register("\n.fieldSliderContainer {\n  align-items: center;\n  display: flex;\n  height: 32px;\n  justify-content: center;\n  width: 150px;\n}\n.fieldSlider {\n  -webkit-appearance: none;\n  background: transparent; /* override white in chrome */\n  margin: 4px;\n  padding: 0;\n  width: 100%;\n}\n.fieldSlider:focus {\n  outline: none;\n}\n/* Webkit */\n.fieldSlider::-webkit-slider-runnable-track {\n  background: #ddd;\n  border-radius: 5px;\n  height: 10px;\n}\n.fieldSlider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  background: #fff;\n  border-radius: 50%;\n  box-shadow: 0 0 0 4px rgba(255,255,255,.15);\n  cursor: pointer;\n  height: 24px;\n  margin-top: -7px;\n  width: 24px;\n}\n/* Firefox */\n.fieldSlider::-moz-range-track {\n  background: #ddd;\n  border-radius: 5px;\n  height: 10px;\n}\n.fieldSlider::-moz-range-thumb {\n  background: #fff;\n  border: none;\n  border-radius: 50%;\n  box-shadow: 0 0 0 4px rgba(255,255,255,.15);\n  cursor: pointer;\n  height: 24px;\n  width: 24px;\n}\n.fieldSlider::-moz-focus-outer {\n  /* override the focus border style */\n  border: 0;\n}\n/* IE */\n.fieldSlider::-ms-track {\n  /* IE wont let the thumb overflow the track, so fake it */\n  background: transparent;\n  border-color: transparent;\n  border-width: 15px 0;\n  /* remove default tick marks */\n  color: transparent;\n  height: 10px;\n  width: 100%;\n  margin: -4px 0;\n}\n.fieldSlider::-ms-fill-lower  {\n  background: #ddd;\n  border-radius: 5px;\n}\n.fieldSlider::-ms-fill-upper  {\n  background: #ddd;\n  border-radius: 5px;\n}\n.fieldSlider::-ms-thumb {\n  background: #fff;\n  border: none;\n  border-radius: 50%;\n  box-shadow: 0 0 0 4px rgba(255,255,255,.15);\n  cursor: pointer;\n  height: 24px;\n  width: 24px;\n}\n")})(),i})()}));
//# sourceMappingURL=field-slider.js.map