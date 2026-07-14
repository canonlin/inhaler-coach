function Ol(t,e){return e.forEach(function(n){n&&typeof n!="string"&&!Array.isArray(n)&&Object.keys(n).forEach(function(r){if(r!=="default"&&!(r in t)){var s=Object.getOwnPropertyDescriptor(n,r);Object.defineProperty(t,r,s.get?s:{enumerable:!0,get:function(){return n[r]}})}})}),Object.freeze(t)}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ll=1e-7,Wl=1e-4;class Ul{constructor(e,n){this.backend=e,this.dataMover=n,this.data=new WeakMap,this.dataIdsCount=0}get(e){return this.data.has(e)||this.dataMover.moveData(this.backend,e),this.data.get(e)}set(e,n){this.dataIdsCount++,this.data.set(e,n)}has(e){return this.data.has(e)}delete(e){return this.dataIdsCount--,this.data.delete(e)}numDataIds(){return this.dataIdsCount}}class Ls{refCount(e){return he("refCount")}incRef(e){return he("incRef")}timerAvailable(){return!0}time(e){return he("time")}read(e){return he("read")}readSync(e){return he("readSync")}readToGPU(e,n){return he("readToGPU")}numDataIds(){return he("numDataIds")}disposeData(e,n){return he("disposeData")}write(e,n,r){return he("write")}move(e,n,r,s,o){return he("move")}createTensorFromGPUData(e,n,r){return he("createTensorFromGPUData")}memory(){return he("memory")}floatPrecision(){return he("floatPrecision")}epsilon(){return this.floatPrecision()===32?Ll:Wl}dispose(){return he("dispose")}}function he(t){throw new Error(`'${t}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ws(t){let e=t.length,n=0;for(;e>0;)n=Math.random()*e|0,e--,wn(t,e,n)}function ql(t,e){if(t.length!==e.length)throw new Error(`Array sizes must match to be shuffled together First array length was ${t.length}Second array length was ${e.length}`);let n=t.length,r=0;for(;n>0;)r=Math.random()*n|0,n--,wn(t,n,r),wn(e,n,r)}function Ut(t,e,n){return Math.max(t,Math.min(e,n))}function Gl(t){return t%2===0?t:t+1}function wn(t,e,n){const r=t[e];t[e]=t[n],t[n]=r}function zl(t){let e=0;for(let n=0;n<t.length;n++)e+=t[n];return e}function Kl(t,e){const n=Math.random();return e*n+(1-n)*t}function Vl(t,e){let n=0;for(let r=0;r<t.length;r++){const s=Number(t[r])-Number(e[r]);n+=s*s}return n}function g(t,e){if(!t)throw new Error(typeof e=="string"?e:e())}function ce(t,e,n=""){g(Ce(t,e),()=>n+` Shapes ${t} and ${e} must match`)}function ft(t){g(t!=null,()=>"The input to the tensor constructor must be a non-null value.")}function W(t){if(t.length===0)return 1;let e=t[0];for(let n=1;n<t.length;n++)e*=t[n];return e}function Hl(t){return t.length===0}function Us(t,e){if(t===e)return!0;if(t==null||e==null||t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(t[n]!==null&&e[n]!==null&&t[n]!==e[n])return!1;return!0}function Ce(t,e){if(t===e)return!0;if(t==null||e==null||t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(t[n]!==e[n])return!1;return!0}function At(t){return t%1===0}function jl(t){if(Math.tanh!=null)return Math.tanh(t);if(t===1/0)return 1;if(t===-1/0)return-1;{const e=Math.exp(2*t);return(e-1)/(e+1)}}function Xl(t){const e=Math.ceil(Math.sqrt(t));return[e,Math.ceil(t/e)]}function Zl(t){const e=new Uint32Array(t);for(let n=0;n<t;++n)e[n]=n;return Ws(e),e}function Ot(t,e){return e<=t.length?t:t+" ".repeat(e-t.length)}function Jl(t,e=s=>0,n,r){return new Promise((s,o)=>{let a=0;const i=()=>{if(t()){s();return}a++;const c=e(a);if(n!=null&&a>=n){o();return}r!=null?r(i,c):setTimeout(i,c)};i()})}function Yl(t,e){let n=1,r=-1;for(let o=0;o<t.length;++o)if(t[o]>=0)n*=t[o];else if(t[o]===-1){if(r!==-1)throw Error(`Shapes can only have 1 implicit size. Found -1 at dim ${r} and dim ${o}`);r=o}else if(t[o]<0)throw Error(`Shapes can not be < 0. Found ${t[o]} at dim ${o}`);if(r===-1){if(e>0&&e!==n)throw Error(`Size(${e}) must match the product of shape ${t}`);return t}if(n===0)throw Error(`Cannot infer the missing size in [${t}] when there are 0 elements`);if(e%n!==0)throw Error(`The implicit shape can't be a fractional number. Got ${e} / ${n}`);const s=t.slice();return s[r]=e/n,s}function nn(t,e){const n=e.length;return t=t==null?e.map((r,s)=>s):[].concat(t),g(t.every(r=>r>=-n&&r<n),()=>`All values in axis param must be in range [-${n}, ${n}) but got axis ${t}`),g(t.every(r=>At(r)),()=>`All values in axis param must be integers but got axis ${t}`),t.map(r=>r<0?n+r:r)}function qs(t,e){const n=[],r=[],s=e!=null&&Array.isArray(e)&&e.length===0,o=e==null||s?null:nn(e,t).sort();let a=0;for(let i=0;i<t.length;++i){if(o!=null){if(o[a]===i&&t[i]!==1)throw new Error(`Can't squeeze axis ${i} since its dim '${t[i]}' is not 1`);(o[a]==null||o[a]>i)&&t[i]===1&&(n.push(t[i]),r.push(i)),o[a]<=i&&a++}t[i]!==1&&(n.push(t[i]),r.push(i))}return{newShape:n,keptDims:r}}function Gs(t,e){return Sr(t,e)}function Sr(t,e){let n=null;if(t==null||t==="float32")n=new Float32Array(e);else if(t==="int32")n=new Int32Array(e);else if(t==="bool")n=new Uint8Array(e);else if(t==="string")n=new Array(e);else throw new Error(`Unknown data type ${t}`);return n}function zs(t,e){for(let n=0;n<t.length;n++){const r=t[n];if(isNaN(r)||!isFinite(r))throw Error(`A tensor of type ${e} being uploaded contains ${r}.`)}}function Ks(t){return t==="bool"||t==="complex64"||t==="float32"||t==="int32"||t==="string"}function Ql(t,e){return!(e==="complex64"||e==="float32"&&t!=="complex64"||e==="int32"&&t!=="float32"&&t!=="complex64"||e==="bool"&&t==="bool")}function yn(t){if(t==="float32"||t==="int32")return 4;if(t==="complex64")return 8;if(t==="bool")return 1;throw new Error(`Unknown dtype ${t}`)}function Vs(t){if(t==null)return 0;let e=0;return t.forEach(n=>e+=n.length),e}function qe(t){return typeof t=="string"||t instanceof String}function Hs(t){return typeof t=="boolean"}function js(t){return typeof t=="number"}function rn(t){return Array.isArray(t)?rn(t[0]):t instanceof Float32Array?"float32":t instanceof Int32Array||t instanceof Uint8Array||t instanceof Uint8ClampedArray?"int32":js(t)?"float32":qe(t)?"string":Hs(t)?"bool":"float32"}function Ve(t){return!!(t&&t.constructor&&t.call&&t.apply)}function $n(t,e){for(let n=e;n<t;++n)if(t%n===0)return n;return t}function Ft(t){const e=t.length;if(e<2)return[];const n=new Array(e-1);n[e-2]=t[e-1];for(let r=e-3;r>=0;--r)n[r]=n[r+1]*t[r+1];return n}function Xs(t,e,n,r=!1){const s=new Array;if(e.length===1){const o=e[0]*(r?2:1);for(let a=0;a<o;a++)s[a]=n[t+a]}else{const o=e[0],a=e.slice(1),i=a.reduce((c,l)=>c*l)*(r?2:1);for(let c=0;c<o;c++)s[c]=Xs(t+c*i,a,n,r)}return s}function xt(t,e,n=!1){if(t.length===0)return e[0];const r=t.reduce((s,o)=>s*o)*(n?2:1);if(r===0)return[];if(r!==e.length)throw new Error(`[${t}] does not match the input size ${e.length}${n?" for a complex tensor":""}.`);return Xs(0,t,e,n)}function eu(t,e){if(Array.isArray(t))return t;if(e==="float32")return t instanceof Float32Array?t:new Float32Array(t);if(e==="int32")return t instanceof Int32Array?t:new Int32Array(t);if(e==="bool"||e==="string")return Uint8Array.from(new Int32Array(t));throw new Error(`Unknown dtype ${e}`)}function Ir(t,e){const n=Dn(t,e);for(let r=0;r<n.length;r++)n[r]=1;return n}function Dn(t,e){if(e==null||e==="float32"||e==="complex64")return new Float32Array(t);if(e==="int32")return new Int32Array(t);if(e==="bool")return new Uint8Array(t);throw new Error(`Unknown data type ${e}`)}function tu(t,e){const n=t.reduce((r,s)=>r*s,1);if(e==null||e==="float32")return xt(t,new Float32Array(n));if(e==="int32")return xt(t,new Int32Array(n));if(e==="bool")return xt(t,new Uint8Array(n));throw new Error(`Unknown data type ${e}`)}function pe(t){t.forEach(e=>{g(Number.isInteger(e)&&e>=0,()=>`Tensor must have a shape comprised of positive integers but got shape [${t}].`)})}function nu(t,e,n){if(e===0)return 0;if(e===1)return t[0];let r=t[t.length-1];for(let s=0;s<t.length-1;++s)r+=n[s]*t[s];return r}function ru(t,e,n){if(e===0)return[];if(e===1)return[t];const r=new Array(e);for(let s=0;s<r.length-1;++s)r[s]=Math.floor(t/n[s]),t-=r[s]*n[s];return r[r.length-1]=t,r}function Nn(t){return t&&t.then&&typeof t.then=="function"}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ws="tfjsflags";class Zs{constructor(e){this.global=e,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=su,this.populateURLFlags()}setPlatform(e,n){this.platform!=null&&(B().getBool("IS_TEST")||B().getBool("PROD")||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${e}.`)),this.platformName=e,this.platform=n}registerFlag(e,n,r){if(this.flagRegistry[e]={evaluationFn:n,setHook:r},this.urlFlags[e]!=null){const s=this.urlFlags[e];B().getBool("IS_TEST")||B().getBool("PROD")||console.warn(`Setting feature override from URL ${e}: ${s}.`),this.set(e,s)}}async getAsync(e){return e in this.flags?this.flags[e]:(this.flags[e]=await this.evaluateFlag(e),this.flags[e])}get(e){if(e in this.flags)return this.flags[e];const n=this.evaluateFlag(e);if(Nn(n))throw new Error(`Flag ${e} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[e]=n,this.flags[e]}getNumber(e){return this.get(e)}getBool(e){return this.get(e)}getString(e){return this.get(e)}getFlags(){return this.flags}get features(){return this.flags}set(e,n){if(this.flagRegistry[e]==null)throw new Error(`Cannot set flag ${e} as it has not been registered.`);this.flags[e]=n,this.flagRegistry[e].setHook!=null&&this.flagRegistry[e].setHook(n)}evaluateFlag(e){if(this.flagRegistry[e]==null)throw new Error(`Cannot evaluate flag '${e}': no evaluation function found.`);return this.flagRegistry[e].evaluationFn()}setFlags(e){this.flags=Object.assign({},e)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(typeof this.global>"u"||typeof this.global.location>"u"||typeof this.global.location.search>"u")return;const e=this.getQueryParams(this.global.location.search);ws in e&&e[ws].split(",").forEach(r=>{const[s,o]=r.split(":");this.urlFlags[s]=au(s,o)})}}function su(t){const e={};return t.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,(n,...r)=>(ou(e,r[0],r[1]),r.join("="))),e}function ou(t,e,n){t[decodeURIComponent(e)]=decodeURIComponent(n||"")}function au(t,e){const n=e.toLowerCase();return n==="true"||n==="false"?n==="true":`${+n}`===n?+n:e}function B(){return Tr}let Tr=null;function iu(t){Tr=t}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */let Hn;function Js(){if(Hn==null){let t;if(typeof window<"u")t=window;else if(typeof global<"u")t=global;else if(typeof process<"u")t=process;else if(typeof self<"u")t=self;else throw new Error("Could not find a global object");Hn=t}return Hn}function cu(){const t=Js();return t._tfGlobals==null&&(t._tfGlobals=new Map),t._tfGlobals}function Ar(t,e){const n=cu();if(n.has(t))return n.get(t);{const r=e();return n.set(t,r),n.get(t)}}const Ys="Abs",Qs="Acos",eo="Acosh",_r="Add",to="AddN",no="All",ro="Any",so="ArgMax",oo="ArgMin",ao="Asin",io="Asinh",co="Atan",lo="Atanh",uo="Atan2",ho="AvgPool",lu="AvgPoolGrad",fo="AvgPool3D",uu="AvgPool3DGrad",po="BatchMatMul",go="BatchToSpaceND",mo="Bincount",bo="BitwiseAnd",hu="BroadcastTo",wo="BroadcastArgs",Dr="Cast",yo="Ceil",$o="ClipByValue",Eo="Complex",xo="ComplexAbs",ko="Concat",vo="Conv2D",So="Conv2DBackpropFilter",Io="Conv2DBackpropInput",To="Conv3D",fu="Conv3DBackpropFilterV2",Ao="Conv3DBackpropInputV2",_o="Cos",Do="Cosh",No="Cumprod",Mo="Cumsum",Fo="CropAndResize",Ro="DenseBincount",Bo="DepthToSpace",Co="DepthwiseConv2dNative",Po="DepthwiseConv2dNativeBackpropFilter",Oo="DepthwiseConv2dNativeBackpropInput",Lo="Diag",Wo="Dilation2D",du="Dilation2DBackpropInput",pu="Dilation2DBackpropFilter",Nr="Draw",Uo="RealDiv",qo="Einsum",Go="Elu",gu="EluGrad",zo="Erf",Ko="Equal",Vo="Exp",Ho="ExpandDims",jo="Expm1",Xo="FFT",Zo="Fill",Jo="FlipLeftRight",Yo="Floor",Qo="FloorDiv",ea="FusedBatchNorm",ta="GatherV2",na="GatherNd",ra="Greater",sa="GreaterEqual",Mr="Identity",oa="IFFT",aa="Imag",ia="IsFinite",ca="IsInf",la="IsNan",ua="LeakyRelu",ha="Less",fa="LessEqual",da="LinSpace",pa="Log",ga="Log1p",ma="LogicalAnd",ba="LogicalNot",wa="LogicalOr",mu="LogicalXor",bu="LogSoftmax",wu="LowerBound",ya="LRN",yu="LRNGrad",$u="MatrixBandPart",$a="Max",Ea="Maximum",xa="MaxPool",Eu="MaxPoolGrad",ka="MaxPool3D",xu="MaxPool3DGrad",va="MaxPoolWithArgmax",Sa="Mean",Ia="Min",Ta="Minimum",Aa="MirrorPad",_a="Mod",Da="Multinomial",Na="Multiply",Ma="Neg",Fa="NotEqual",Ra="NonMaxSuppressionV3",Ba="NonMaxSuppressionV4",Ca="NonMaxSuppressionV5",Pa="OnesLike",Oa="OneHot",La="Pack",Wa="PadV2",ku="Pool",Ua="Pow",qa="Prelu",Ga="Prod",za="RaggedGather",Ka="RaggedRange",Va="RaggedTensorToTensor",Ha="Range",ja="Real",Xa="Reciprocal",Za="Relu",Ja="Reshape",Ya="ResizeNearestNeighbor",vu="ResizeNearestNeighborGrad",Qa="ResizeBilinear",Su="ResizeBilinearGrad",ei="Relu6",ti="Reverse",ni="Round",ri="Rsqrt",si="ScatterNd",oi="TensorScatterUpdate",ai="SearchSorted",ii="Select",ci="Selu",li="Slice",ui="Sin",hi="Sinh",fi="Sign",di="Sigmoid",pi="Softplus",gi="Sqrt",mi="Sum",bi="SpaceToBatchND",wi="SplitV",yi="Softmax",$i="SparseFillEmptyRows",Ei="SparseReshape",xi="SparseSegmentMean",ki="SparseSegmentSum",vi="SparseToDense",Si="SquaredDifference",Iu="Square",Ii="StaticRegexReplace",Ti="StridedSlice",Ai="StringNGrams",_i="StringSplit",Di="StringToHashBucketFast",Ni="Sub",Mi="Tan",Fi="Tanh",Fr="Tile",Ri="TopK",Bi="Transform",pn="Transpose",Ci="Unique",Pi="Unpack",Oi="UnsortedSegmentSum",Tu="UpperBound",Li="ZerosLike",Wi="Step",Qn="FromPixels",Ui="RotateWithOffset",er="_FusedMatMul",tr="FusedConv2D",nr="FusedDepthwiseConv2D";/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function We(...t){B().getBool("IS_TEST")||B().getBool("PROD")||console.warn(...t)}function Au(...t){B().getBool("IS_TEST")||B().getBool("PROD")||console.log(...t)}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const _t=Ar("kernelRegistry",()=>new Map),qt=Ar("gradRegistry",()=>new Map);function Gt(t,e){const n=Rr(t,e);return _t.get(n)}function rr(t){return qt.get(t)}function En(t){const e=_t.entries(),n=[];for(;;){const{done:r,value:s}=e.next();if(r)break;const[o,a]=s,[i]=o.split("_");i===t&&n.push(a)}return n}function qi(t){const{kernelName:e,backendName:n}=t,r=Rr(e,n);_t.has(r)&&We(`The kernel '${e}' for backend '${n}' is already registered`),_t.set(r,t)}function _u(t){const{kernelName:e}=t;qt.has(e)&&B().getBool("DEBUG")&&We(`Overriding the gradient for '${e}'`),qt.set(e,t)}function Du(t,e){const n=Rr(t,e);if(!_t.has(n))throw new Error(`The kernel '${t}' for backend '${e}' is not registered`);_t.delete(n)}function Nu(t){if(!qt.has(t))throw new Error(`The gradient '${t}' for backend is not registered`);qt.delete(t)}function Mu(t,e){En(t).forEach(r=>{const s=Object.assign({},r,{backendName:e});qi(s)})}function Rr(t,e){return`${e}_${t}`}/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gi(t){return t instanceof Float32Array||t instanceof Int32Array||t instanceof Uint8Array||t instanceof Uint8ClampedArray}var dt=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Fu(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function Ru(t){if(t.__esModule)return t;var e=t.default;if(typeof e=="function"){var n=function r(){return this instanceof r?Reflect.construct(e,arguments,this.constructor):e.apply(this,arguments)};n.prototype=e.prototype}else n={};return Object.defineProperty(n,"__esModule",{value:!0}),Object.keys(t).forEach(function(r){var s=Object.getOwnPropertyDescriptor(t,r);Object.defineProperty(n,r,s.get?s:{enumerable:!0,get:function(){return t[r]}})}),n}var zi=V,ye=null;try{ye=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}function V(t,e,n){this.low=t|0,this.high=e|0,this.unsigned=!!n}V.prototype.__isLong__;Object.defineProperty(V.prototype,"__isLong__",{value:!0});function ge(t){return(t&&t.__isLong__)===!0}V.isLong=ge;var ys={},$s={};function pt(t,e){var n,r,s;return e?(t>>>=0,(s=0<=t&&t<256)&&(r=$s[t],r)?r:(n=H(t,(t|0)<0?-1:0,!0),s&&($s[t]=n),n)):(t|=0,(s=-128<=t&&t<128)&&(r=ys[t],r)?r:(n=H(t,t<0?-1:0,!1),s&&(ys[t]=n),n))}V.fromInt=pt;function $e(t,e){if(isNaN(t))return e?tt:Ee;if(e){if(t<0)return tt;if(t>=Ki)return ji}else{if(t<=-xs)return fe;if(t+1>=xs)return Hi}return t<0?$e(-t,e).neg():H(t%Dt|0,t/Dt|0,e)}V.fromNumber=$e;function H(t,e,n){return new V(t,e,n)}V.fromBits=H;var xn=Math.pow;function Br(t,e,n){if(t.length===0)throw Error("empty string");if(t==="NaN"||t==="Infinity"||t==="+Infinity"||t==="-Infinity")return Ee;if(typeof e=="number"?(n=e,e=!1):e=!!e,n=n||10,n<2||36<n)throw RangeError("radix");var r;if((r=t.indexOf("-"))>0)throw Error("interior hyphen");if(r===0)return Br(t.substring(1),e,n).neg();for(var s=$e(xn(n,8)),o=Ee,a=0;a<t.length;a+=8){var i=Math.min(8,t.length-a),c=parseInt(t.substring(a,a+i),n);if(i<8){var l=$e(xn(n,i));o=o.mul(l).add($e(c))}else o=o.mul(s),o=o.add($e(c))}return o.unsigned=e,o}V.fromString=Br;function Ie(t,e){return typeof t=="number"?$e(t,e):typeof t=="string"?Br(t,e):H(t.low,t.high,typeof e=="boolean"?e:t.unsigned)}V.fromValue=Ie;var Es=65536,Bu=1<<24,Dt=Es*Es,Ki=Dt*Dt,xs=Ki/2,ks=pt(Bu),Ee=pt(0);V.ZERO=Ee;var tt=pt(0,!0);V.UZERO=tt;var Et=pt(1);V.ONE=Et;var Vi=pt(1,!0);V.UONE=Vi;var sr=pt(-1);V.NEG_ONE=sr;var Hi=H(-1,2147483647,!1);V.MAX_VALUE=Hi;var ji=H(-1,-1,!0);V.MAX_UNSIGNED_VALUE=ji;var fe=H(0,-2147483648,!1);V.MIN_VALUE=fe;var S=V.prototype;S.toInt=function(){return this.unsigned?this.low>>>0:this.low};S.toNumber=function(){return this.unsigned?(this.high>>>0)*Dt+(this.low>>>0):this.high*Dt+(this.low>>>0)};S.toString=function(e){if(e=e||10,e<2||36<e)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative())if(this.eq(fe)){var n=$e(e),r=this.div(n),s=r.mul(n).sub(this);return r.toString(e)+s.toInt().toString(e)}else return"-"+this.neg().toString(e);for(var o=$e(xn(e,6),this.unsigned),a=this,i="";;){var c=a.div(o),l=a.sub(c.mul(o)).toInt()>>>0,h=l.toString(e);if(a=c,a.isZero())return h+i;for(;h.length<6;)h="0"+h;i=""+h+i}};S.getHighBits=function(){return this.high};S.getHighBitsUnsigned=function(){return this.high>>>0};S.getLowBits=function(){return this.low};S.getLowBitsUnsigned=function(){return this.low>>>0};S.getNumBitsAbs=function(){if(this.isNegative())return this.eq(fe)?64:this.neg().getNumBitsAbs();for(var e=this.high!=0?this.high:this.low,n=31;n>0&&!(e&1<<n);n--);return this.high!=0?n+33:n+1};S.isZero=function(){return this.high===0&&this.low===0};S.eqz=S.isZero;S.isNegative=function(){return!this.unsigned&&this.high<0};S.isPositive=function(){return this.unsigned||this.high>=0};S.isOdd=function(){return(this.low&1)===1};S.isEven=function(){return(this.low&1)===0};S.equals=function(e){return ge(e)||(e=Ie(e)),this.unsigned!==e.unsigned&&this.high>>>31===1&&e.high>>>31===1?!1:this.high===e.high&&this.low===e.low};S.eq=S.equals;S.notEquals=function(e){return!this.eq(e)};S.neq=S.notEquals;S.ne=S.notEquals;S.lessThan=function(e){return this.comp(e)<0};S.lt=S.lessThan;S.lessThanOrEqual=function(e){return this.comp(e)<=0};S.lte=S.lessThanOrEqual;S.le=S.lessThanOrEqual;S.greaterThan=function(e){return this.comp(e)>0};S.gt=S.greaterThan;S.greaterThanOrEqual=function(e){return this.comp(e)>=0};S.gte=S.greaterThanOrEqual;S.ge=S.greaterThanOrEqual;S.compare=function(e){if(ge(e)||(e=Ie(e)),this.eq(e))return 0;var n=this.isNegative(),r=e.isNegative();return n&&!r?-1:!n&&r?1:this.unsigned?e.high>>>0>this.high>>>0||e.high===this.high&&e.low>>>0>this.low>>>0?-1:1:this.sub(e).isNegative()?-1:1};S.comp=S.compare;S.negate=function(){return!this.unsigned&&this.eq(fe)?fe:this.not().add(Et)};S.neg=S.negate;S.add=function(e){ge(e)||(e=Ie(e));var n=this.high>>>16,r=this.high&65535,s=this.low>>>16,o=this.low&65535,a=e.high>>>16,i=e.high&65535,c=e.low>>>16,l=e.low&65535,h=0,u=0,f=0,p=0;return p+=o+l,f+=p>>>16,p&=65535,f+=s+c,u+=f>>>16,f&=65535,u+=r+i,h+=u>>>16,u&=65535,h+=n+a,h&=65535,H(f<<16|p,h<<16|u,this.unsigned)};S.subtract=function(e){return ge(e)||(e=Ie(e)),this.add(e.neg())};S.sub=S.subtract;S.multiply=function(e){if(this.isZero())return Ee;if(ge(e)||(e=Ie(e)),ye){var n=ye.mul(this.low,this.high,e.low,e.high);return H(n,ye.get_high(),this.unsigned)}if(e.isZero())return Ee;if(this.eq(fe))return e.isOdd()?fe:Ee;if(e.eq(fe))return this.isOdd()?fe:Ee;if(this.isNegative())return e.isNegative()?this.neg().mul(e.neg()):this.neg().mul(e).neg();if(e.isNegative())return this.mul(e.neg()).neg();if(this.lt(ks)&&e.lt(ks))return $e(this.toNumber()*e.toNumber(),this.unsigned);var r=this.high>>>16,s=this.high&65535,o=this.low>>>16,a=this.low&65535,i=e.high>>>16,c=e.high&65535,l=e.low>>>16,h=e.low&65535,u=0,f=0,p=0,w=0;return w+=a*h,p+=w>>>16,w&=65535,p+=o*h,f+=p>>>16,p&=65535,p+=a*l,f+=p>>>16,p&=65535,f+=s*h,u+=f>>>16,f&=65535,f+=o*l,u+=f>>>16,f&=65535,f+=a*c,u+=f>>>16,f&=65535,u+=r*h+s*l+o*c+a*i,u&=65535,H(p<<16|w,u<<16|f,this.unsigned)};S.mul=S.multiply;S.divide=function(e){if(ge(e)||(e=Ie(e)),e.isZero())throw Error("division by zero");if(ye){if(!this.unsigned&&this.high===-2147483648&&e.low===-1&&e.high===-1)return this;var n=(this.unsigned?ye.div_u:ye.div_s)(this.low,this.high,e.low,e.high);return H(n,ye.get_high(),this.unsigned)}if(this.isZero())return this.unsigned?tt:Ee;var r,s,o;if(this.unsigned){if(e.unsigned||(e=e.toUnsigned()),e.gt(this))return tt;if(e.gt(this.shru(1)))return Vi;o=tt}else{if(this.eq(fe)){if(e.eq(Et)||e.eq(sr))return fe;if(e.eq(fe))return Et;var a=this.shr(1);return r=a.div(e).shl(1),r.eq(Ee)?e.isNegative()?Et:sr:(s=this.sub(e.mul(r)),o=r.add(s.div(e)),o)}else if(e.eq(fe))return this.unsigned?tt:Ee;if(this.isNegative())return e.isNegative()?this.neg().div(e.neg()):this.neg().div(e).neg();if(e.isNegative())return this.div(e.neg()).neg();o=Ee}for(s=this;s.gte(e);){r=Math.max(1,Math.floor(s.toNumber()/e.toNumber()));for(var i=Math.ceil(Math.log(r)/Math.LN2),c=i<=48?1:xn(2,i-48),l=$e(r),h=l.mul(e);h.isNegative()||h.gt(s);)r-=c,l=$e(r,this.unsigned),h=l.mul(e);l.isZero()&&(l=Et),o=o.add(l),s=s.sub(h)}return o};S.div=S.divide;S.modulo=function(e){if(ge(e)||(e=Ie(e)),ye){var n=(this.unsigned?ye.rem_u:ye.rem_s)(this.low,this.high,e.low,e.high);return H(n,ye.get_high(),this.unsigned)}return this.sub(this.div(e).mul(e))};S.mod=S.modulo;S.rem=S.modulo;S.not=function(){return H(~this.low,~this.high,this.unsigned)};S.and=function(e){return ge(e)||(e=Ie(e)),H(this.low&e.low,this.high&e.high,this.unsigned)};S.or=function(e){return ge(e)||(e=Ie(e)),H(this.low|e.low,this.high|e.high,this.unsigned)};S.xor=function(e){return ge(e)||(e=Ie(e)),H(this.low^e.low,this.high^e.high,this.unsigned)};S.shiftLeft=function(e){return ge(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?H(this.low<<e,this.high<<e|this.low>>>32-e,this.unsigned):H(0,this.low<<e-32,this.unsigned)};S.shl=S.shiftLeft;S.shiftRight=function(e){return ge(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?H(this.low>>>e|this.high<<32-e,this.high>>e,this.unsigned):H(this.high>>e-32,this.high>=0?0:-1,this.unsigned)};S.shr=S.shiftRight;S.shiftRightUnsigned=function(e){if(ge(e)&&(e=e.toInt()),e&=63,e===0)return this;var n=this.high;if(e<32){var r=this.low;return H(r>>>e|n<<32-e,n>>>e,this.unsigned)}else return e===32?H(n,0,this.unsigned):H(n>>>e-32,0,this.unsigned)};S.shru=S.shiftRightUnsigned;S.shr_u=S.shiftRightUnsigned;S.toSigned=function(){return this.unsigned?H(this.low,this.high,!1):this};S.toUnsigned=function(){return this.unsigned?this:H(this.low,this.high,!0)};S.toBytes=function(e){return e?this.toBytesLE():this.toBytesBE()};S.toBytesLE=function(){var e=this.high,n=this.low;return[n&255,n>>>8&255,n>>>16&255,n>>>24,e&255,e>>>8&255,e>>>16&255,e>>>24]};S.toBytesBE=function(){var e=this.high,n=this.low;return[e>>>24,e>>>16&255,e>>>8&255,e&255,n>>>24,n>>>16&255,n>>>8&255,n&255]};V.fromBytes=function(e,n,r){return r?V.fromBytesLE(e,n):V.fromBytesBE(e,n)};V.fromBytesLE=function(e,n){return new V(e[0]|e[1]<<8|e[2]<<16|e[3]<<24,e[4]|e[5]<<8|e[6]<<16|e[7]<<24,n)};V.fromBytesBE=function(e,n){return new V(e[4]<<24|e[5]<<16|e[6]<<8|e[7],e[0]<<24|e[1]<<16|e[2]<<8|e[3],n)};var Xi=Fu(zi),Cu=Ol({__proto__:null,default:Xi},[zi]);/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const et=Xi||Cu;function sn(t){return et.fromString(t,!0,16)}const Zi=sn("c3a5c85c97cb3127"),Qe=sn("b492b66fbe98f273"),ae=sn("9ae16a3b2f90404f");function or(t){return t.xor(t.shru(47))}function Ji(t,e,n){const r=t.slice(e,e+n);return et.fromBytes(Array.from(r),!0,!0)}function G(t,e){return Ji(t,e,8)}function vs(t,e){return Ji(t,e,4)}function re(t,e){return e===0?t:t.shru(e).or(t.shl(64-e))}function ze(t,e,n=sn("9ddfea08eb382d69")){let r=t.xor(e).mul(n);r=r.xor(r.shru(47));let s=e.xor(r).mul(n);return s=s.xor(s.shru(47)),s=s.mul(n),s}function Pu(t,e,n,r,s,o){s=s.add(t),o=re(o.add(s).add(r),21);const a=s;return s=s.add(e),s=s.add(n),o=o.add(re(s,44)),[s.add(r),o.add(a)]}function fn(t,e,n,r){return Pu(G(t,e),G(t,e+8),G(t,e+16),G(t,e+24),n,r)}function Ou(t,e=t.length){if(e>=8){const n=ae.add(e*2),r=G(t,0).add(ae),s=G(t,e-8),o=re(s,37).mul(n).add(r),a=re(r,25).add(s).mul(n);return ze(o,a,n)}if(e>=4){const n=ae.add(e*2),r=vs(t,0);return ze(r.shl(3).add(e),vs(t,e-4),n)}if(e>0){const n=t[0],r=t[e>>1],s=t[e-1],o=n+(r<<8),a=e+(s<<2);return or(ae.mul(o).xor(Zi.mul(a))).mul(ae)}return ae}function Lu(t,e=t.length){const n=ae.add(e*2),r=G(t,0).mul(Qe),s=G(t,8),o=G(t,e-8).mul(n),a=G(t,e-16).mul(ae);return ze(re(r.add(s),43).add(re(o,30)).add(a),r.add(re(s.add(ae),18)).add(o),n)}function Wu(t,e=t.length){const n=ae.add(e*2),r=G(t,0).mul(ae),s=G(t,8),o=G(t,e-8).mul(n),a=G(t,e-16).mul(ae),i=re(r.add(s),43).add(re(o,30)).add(a),c=ze(i,r.add(re(s.add(ae),18)).add(o),n),l=G(t,16).mul(n),h=G(t,24),u=i.add(G(t,e-32)).mul(n),f=c.add(G(t,e-24)).mul(n);return ze(re(l.add(h),43).add(re(u,30)).add(f),l.add(re(h.add(r),18)).add(u),n)}function Uu(t,e=t.length){const n=et.fromNumber(81,!0);if(e<=32)return e<=16?Ou(t,e):Lu(t,e);if(e<=64)return Wu(t,e);let r=n,s=n.mul(Qe).add(113),o=or(s.mul(ae).add(113)).mul(ae),a=[et.UZERO,et.UZERO],i=[et.UZERO,et.UZERO];r=r.mul(ae).add(G(t,0));let c=0;const l=(e-1>>6)*64,h=l+(e-1&63)-63;do r=re(r.add(s).add(a[0]).add(G(t,c+8)),37).mul(Qe),s=re(s.add(a[1]).add(G(t,c+48)),42).mul(Qe),r=r.xor(i[1]),s=s.add(a[0]).add(G(t,c+40)),o=re(o.add(i[0]),33).mul(Qe),a=fn(t,c,a[1].mul(Qe),r.add(i[0])),i=fn(t,c+32,o.add(i[1]),s.add(G(t,c+16))),[o,r]=[r,o],c+=64;while(c!==l);const u=Qe.add(o.and(255).shl(1));return c=h,i[0]=i[0].add(e-1&63),a[0]=a[0].add(i[0]),i[0]=i[0].add(a[0]),r=re(r.add(s).add(a[0]).add(G(t,c+8)),37).mul(u),s=re(s.add(a[1]).add(G(t,c+48)),42).mul(u),r=r.xor(i[1].mul(9)),s=s.add(a[0].mul(9).add(G(t,c+40))),o=re(o.add(i[0]),33).mul(u),a=fn(t,c,a[1].mul(u),r.add(i[0])),i=fn(t,c+32,o.add(i[1]),s.add(G(t,c+16))),[o,r]=[r,o],ze(ze(a[0],i[0],u).add(or(s).mul(Zi)).add(o),ze(a[1],i[1],u).add(r),u)}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qu(t,e){return e==="string"?on(t):Mn([t],e)}function Gu(t,e){return t instanceof Float32Array&&e==="float32"||t instanceof Int32Array&&e==="int32"||t instanceof Uint8Array&&e==="bool"}function Mn(t,e){if(e==="string")throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(t)&&(t=He(t)),B().getBool("DEBUG")&&zs(t,e),Gu(t,e))return t;if(e==null||e==="float32"||e==="complex64")return new Float32Array(t);if(e==="int32")return new Int32Array(t);if(e==="bool"){const n=new Uint8Array(t.length);for(let r=0;r<n.length;++r)Math.round(t[r])!==0&&(n[r]=1);return n}else throw new Error(`Unknown data type ${e}`)}function zt(){return B().platform.now()}function zu(t,e){return B().platform.fetch(t,e)}function on(t,e="utf-8"){return e=e||"utf-8",B().platform.encode(t,e)}function kn(t,e="utf-8"){return e=e||"utf-8",B().platform.decode(t,e)}function se(t){return B().platform.isTypedArray!=null?B().platform.isTypedArray(t):Gi(t)}function He(t,e=[],n=!1){if(e==null&&(e=[]),typeof t=="boolean"||typeof t=="number"||typeof t=="string"||Nn(t)||t==null||se(t)&&n)e.push(t);else if(Array.isArray(t)||se(t))for(let r=0;r<t.length;++r)He(t[r],e,n);else{let r=-1;for(const s of Object.keys(t))/^([1-9]+[0-9]*|0)$/.test(s)&&(r=Math.max(r,Number(s)));for(let s=0;s<=r;s++)He(t[s],e,n)}return e}var Ku=Object.freeze({__proto__:null,arraysEqual:Ce,arraysEqualWithNull:Us,assert:g,assertNonNegativeIntegerDimensions:pe,assertNonNull:ft,assertShapesMatch:ce,bytesFromStringArray:Vs,bytesPerElement:yn,checkConversionForErrors:zs,clamp:Ut,computeStrides:Ft,convertBackendValuesAndArrayBuffer:eu,createScalarValue:qu,createShuffledIndices:Zl,decodeString:kn,distSquared:Vl,encodeString:on,fetch:zu,fingerPrint64:Uu,flatten:He,getArrayFromDType:Sr,getTypedArrayFromDType:Gs,hasEncodingLoss:Ql,hexToLong:sn,indexToLoc:ru,inferDtype:rn,inferFromImplicitShape:Yl,isBoolean:Hs,isFunction:Ve,isInt:At,isNumber:js,isPromise:Nn,isScalarShape:Hl,isString:qe,isTypedArray:se,isValidDtype:Ks,locToIndex:nu,makeOnesTypedArray:Ir,makeZerosNestedTypedArray:tu,makeZerosTypedArray:Dn,nearestDivisor:$n,nearestLargerEven:Gl,now:zt,parseAxisParam:nn,randUniform:Kl,repeatedTry:Jl,rightPad:Ot,shuffle:Ws,shuffleCombo:ql,sizeFromShape:W,sizeToSquarishShape:Xl,squeezeShape:qs,sum:zl,swap:wn,tanh:jl,toNestedArray:xt,toTypedArray:Mn});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Vu{constructor(e,n){this.backendTimer=e,this.logger=n,n==null&&(this.logger=new ju)}profileKernel(e,n,r){let s;const o=()=>{s=r()};let a;const i=zt();if(this.backendTimer.timerAvailable())a=this.backendTimer.time(o);else{o();for(const l of s)l.dataSync();a=Promise.resolve({kernelMs:zt()-i})}if(B().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let l=0;l<s.length;l++){const h=s[l];h.data().then(u=>{Hu(u,h.dtype,e)})}return{kernelName:e,outputs:s,inputs:n,timeMs:a.then(l=>l.kernelMs),extraInfo:a.then(l=>l.getExtraProfileInfo!=null?l.getExtraProfileInfo():"")}}logKernelProfile(e){const{kernelName:n,outputs:r,timeMs:s,inputs:o,extraInfo:a}=e;r.forEach(i=>{Promise.all([i.data(),s,a]).then(c=>{this.logger.logKernelProfile(n,i,c[0],c[1],o,c[2])})})}}function Hu(t,e,n){if(e!=="float32")return!1;for(let r=0;r<t.length;r++){const s=t[r];if(isNaN(s)||!isFinite(s))return console.warn(`Found ${s} in the result of '${n}'`),!0}return!1}class ju{logKernelProfile(e,n,r,s,o,a){const i=typeof s=="number"?Ot(`${s}ms`,9):s.error,c=Ot(e,25),l=n.rank,h=n.size,u=Ot(n.shape.toString(),14);let f="";for(const p in o){const w=o[p];if(w!=null){const y=w.shape||n.shape,$=y.length;f+=`${p}: ${$}D ${$>0?y:""} `}}console.log(`%c${c}	%c${i}	%c${l}D ${u}	%c${h}	%c${f}	%c${a}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xu(t,e,n){const r={},s={};for(let c=0;c<e.length;c++)r[e[c].id]=!0;for(let c=0;c<t.length;c++){const l=t[c],h=l.inputs;for(const u in h){const f=h[u];let p=!1;for(let w=0;w<e.length;w++)if(r[f.id]){l.outputs.forEach(y=>r[y.id]=!0),p=!0,s[l.id]=!0;break}if(p)break}}const o={};o[n.id]=!0;const a={};for(let c=t.length-1;c>=0;c--){const l=t[c],h=l.inputs;for(let u=0;u<l.outputs.length;u++)if(o[l.outputs[u].id]){for(const f in h)o[h[f].id]=!0,a[l.id]=!0;break}}const i=[];for(let c=0;c<t.length;c++){const l=t[c];if(s[l.id]&&a[l.id]){const h={};for(const f in l.inputs){const p=l.inputs[f];r[p.id]&&(h[f]=p)}const u=Object.assign({},l);u.inputs=h,u.outputs=l.outputs,i.push(u)}}return i}function Zu(t,e,n,r){for(let s=e.length-1;s>=0;s--){const o=e[s],a=[];if(o.outputs.forEach(c=>{const l=t[c.id];l!=null?a.push(l):a.push(null)}),o.gradient==null)throw new Error(`Cannot compute gradient: gradient function not found for ${o.kernelName}.`);const i=o.gradient(a);for(const c in o.inputs){if(!(c in i))throw new Error(`Cannot backprop through input ${c}. Available gradients found: ${Object.keys(i)}.`);const l=n(()=>i[c]());if(l.dtype!=="float32")throw new Error(`Error in gradient for op ${o.kernelName}. The gradient of input ${c} must have 'float32' dtype, but has '${l.dtype}'`);const h=o.inputs[c];if(!Ce(l.shape,h.shape))throw new Error(`Error in gradient for op ${o.kernelName}. The gradient of input '${c}' has shape '${l.shape}', which does not match the shape of the input '${h.shape}'`);if(t[h.id]==null)t[h.id]=l;else{const u=t[h.id];t[h.id]=r(u,l),u.dispose()}}}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ss=20,Bt=3,jn=7;function Ju(t,e,n,r){const s=Ft(e),o=Yu(t,e,n,s),a=e.length,i=gn(t,e,n,s,o),c=["Tensor"];return r&&(c.push(`  dtype: ${n}`),c.push(`  rank: ${a}`),c.push(`  shape: [${e}]`),c.push("  values:")),c.push(i.map(l=>"    "+l).join(`
`)),c.join(`
`)}function Yu(t,e,n,r){const s=W(e),o=r[r.length-1],a=new Array(o).fill(0),i=e.length,c=n==="complex64"?Pt(t):t;if(i>1)for(let l=0;l<s/o;l++){const h=l*o;for(let u=0;u<o;u++)a[u]=Math.max(a[u],Ct(c[h+u],0,n).length)}return a}function Ct(t,e,n){let r;return Array.isArray(t)?r=`${parseFloat(t[0].toFixed(jn))} + ${parseFloat(t[1].toFixed(jn))}j`:qe(t)?r=`'${t}'`:n==="bool"?r=Yi(t):r=parseFloat(t.toFixed(jn)).toString(),Ot(r,e)}function Yi(t){return t===0?"false":"true"}function gn(t,e,n,r,s,o=!0){const a=n==="complex64"?2:1,i=e[0],c=e.length;if(c===0){if(n==="complex64"){const y=Pt(t);return[Ct(y[0],0,n)]}return n==="bool"?[Yi(t[0])]:[t[0].toString()]}if(c===1){if(i>Ss){const $=Bt*a;let k=Array.from(t.slice(0,$)),N=Array.from(t.slice((i-Bt)*a,i*a));return n==="complex64"&&(k=Pt(k),N=Pt(N)),["["+k.map((x,v)=>Ct(x,s[v],n)).join(", ")+", ..., "+N.map((x,v)=>Ct(x,s[i-Bt+v],n)).join(", ")+"]"]}return["["+(n==="complex64"?Pt(t):Array.from(t)).map(($,k)=>Ct($,s[k],n)).join(", ")+"]"]}const l=e.slice(1),h=r.slice(1),u=r[0]*a,f=[];if(i>Ss){for(let y=0;y<Bt;y++){const $=y*u,k=$+u;f.push(...gn(t.slice($,k),l,n,h,s,!1))}f.push("...");for(let y=i-Bt;y<i;y++){const $=y*u,k=$+u;f.push(...gn(t.slice($,k),l,n,h,s,y===i-1))}}else for(let y=0;y<i;y++){const $=y*u,k=$+u;f.push(...gn(t.slice($,k),l,n,h,s,y===i-1))}const p=c===2?",":"";f[0]="["+(i>0?f[0]+p:"");for(let y=1;y<f.length-1;y++)f[y]=" "+f[y]+p;let w=`,
`;for(let y=2;y<c;y++)w+=`
`;return f[f.length-1]=" "+f[f.length-1]+"]"+(o?"":w),f}function Pt(t){const e=[];for(let n=0;n<t.length;n+=2)e.push([t[n],t[n+1]]);return e}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class vn{constructor(e,n,r){if(this.dtype=n,this.shape=e.slice(),this.size=W(e),r!=null){const s=r.length;g(s===this.size,()=>`Length of values '${s}' does not match the size inferred by the shape '${this.size}'.`)}if(n==="complex64")throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=r||Sr(n,this.size),this.strides=Ft(e)}set(e,...n){n.length===0&&(n=[0]),g(n.length===this.rank,()=>`The number of provided coordinates (${n.length}) must match the rank (${this.rank})`);const r=this.locToIndex(n);this.values[r]=e}get(...e){e.length===0&&(e=[0]);let n=0;for(const s of e){if(s<0||s>=this.shape[n]){const o=`Requested out of range element at ${e}.   Buffer shape=${this.shape}`;throw new Error(o)}n++}let r=e[e.length-1];for(let s=0;s<e.length-1;++s)r+=this.strides[s]*e[s];return this.values[r]}locToIndex(e){if(this.rank===0)return 0;if(this.rank===1)return e[0];let n=e[e.length-1];for(let r=0;r<e.length-1;++r)n+=this.strides[r]*e[r];return n}indexToLoc(e){if(this.rank===0)return[];if(this.rank===1)return[e];const n=new Array(this.shape.length);for(let r=0;r<n.length-1;++r)n[r]=Math.floor(e/this.strides[r]),e-=n[r]*this.strides[r];return n[n.length-1]=e,n}get rank(){return this.shape.length}toTensor(){return ve().makeTensor(this.values,this.shape,this.dtype)}}let ve=null,wt=null;function Qu(t){ve=t}function eh(t){wt=t}class Q{constructor(e,n,r,s){this.kept=!1,this.isDisposedInternal=!1,this.shape=e.slice(),this.dtype=n||"float32",this.size=W(e),this.strides=Ft(e),this.dataId=r,this.id=s,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){const e=await this.data();return wt.buffer(this.shape,this.dtype,e)}bufferSync(){return wt.buffer(this.shape,this.dtype,this.dataSync())}async array(){const e=await this.data();return xt(this.shape,e,this.dtype==="complex64")}arraySync(){return xt(this.shape,this.dataSync(),this.dtype==="complex64")}async data(){this.throwIfDisposed();const e=ve().read(this.dataId);if(this.dtype==="string"){const n=await e;try{return n.map(r=>kn(r))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return e}dataToGPU(e){return this.throwIfDisposed(),ve().readToGPU(this.dataId,e)}dataSync(){this.throwIfDisposed();const e=ve().readSync(this.dataId);if(this.dtype==="string")try{return e.map(n=>kn(n))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return e}async bytes(){this.throwIfDisposed();const e=await ve().read(this.dataId);return this.dtype==="string"?e:new Uint8Array(e.buffer)}dispose(){this.isDisposed||(this.kerasMask&&this.kerasMask.dispose(),ve().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(e=!1){return wt.print(this,e)}clone(){return this.throwIfDisposed(),wt.clone(this)}toString(e=!1){const n=this.dataSync();return Ju(n,this.shape,this.dtype,e)}cast(e){return this.throwIfDisposed(),wt.cast(this,e)}variable(e=!0,n,r){return this.throwIfDisposed(),ve().makeVariable(this,e,n,r)}}Object.defineProperty(Q,Symbol.hasInstance,{value:t=>!!t&&t.data!=null&&t.dataSync!=null&&t.throwIfDisposed!=null});function Qi(){return Ar("Tensor",()=>Q)}Qi();class Kt extends Q{constructor(e,n,r,s){super(e.shape,e.dtype,e.dataId,s),this.trainable=n,this.name=r}assign(e){if(e.dtype!==this.dtype)throw new Error(`dtype of the new value (${e.dtype}) and previous value (${this.dtype}) must match`);if(!Ce(e.shape,this.shape))throw new Error(`shape of the new value (${e.shape}) and previous value (${this.shape}) must match`);ve().disposeTensor(this),this.dataId=e.dataId,ve().incRef(this,null)}dispose(){ve().disposeVariable(this),this.isDisposedInternal=!0}}Object.defineProperty(Kt,Symbol.hasInstance,{value:t=>t instanceof Q&&t.assign!=null&&t.assign instanceof Function});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var ar;(function(t){t.R0="R0",t.R1="R1",t.R2="R2",t.R3="R3",t.R4="R4",t.R5="R5",t.R6="R6"})(ar||(ar={}));var ir;(function(t){t.float32="float32",t.int32="int32",t.bool="int32",t.complex64="complex64"})(ir||(ir={}));var cr;(function(t){t.float32="float32",t.int32="int32",t.bool="bool",t.complex64="complex64"})(cr||(cr={}));var lr;(function(t){t.float32="float32",t.int32="float32",t.bool="float32",t.complex64="complex64"})(lr||(lr={}));var ur;(function(t){t.float32="complex64",t.int32="complex64",t.bool="complex64",t.complex64="complex64"})(ur||(ur={}));const th={float32:lr,int32:ir,bool:cr,complex64:ur};function Fn(t,e){if(t==="string"||e==="string"){if(t==="string"&&e==="string")return"string";throw new Error(`Can not upcast ${t} with ${e}`)}return th[t][e]}function nh(t){return Fn(t,"int32")}function ec(t){return t!=null&&typeof t=="object"&&"texture"in t&&t.texture instanceof WebGLTexture}function tc(t){return typeof GPUBuffer<"u"&&t!=null&&typeof t=="object"&&"buffer"in t&&t.buffer instanceof GPUBuffer}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Y(t,e){if(t.dtype===e.dtype)return[t,e];const n=Fn(t.dtype,e.dtype);return[t.cast(n),e.cast(n)]}function nc(t,e){g(t.dtype===e.dtype,()=>`The dtypes of the first(${t.dtype}) and second(${e.dtype}) input must match`)}function rh(t,e){return e.some(n=>n.id===t.id)}function Cr(t){const e=[];return rc(t,e,new Set),e}function rc(t,e,n){if(t==null)return;if(t instanceof Q){e.push(t);return}if(!sh(t))return;const r=t;for(const s in r){const o=r[s];n.has(o)||(n.add(o),rc(o,e,n))}}function sh(t){return Array.isArray(t)||typeof t=="object"}var oh=Object.freeze({__proto__:null,assertTypesMatch:nc,getTensorsInContainer:Cr,isTensorInList:rh,makeTypesMatch:Y});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xn(t){return t.kernelName!=null}class Is{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map(e=>e.name)))}}}dispose(){for(const e in this.registeredVariables)this.registeredVariables[e].dispose()}}class Nt{constructor(e){this.ENV=e,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new Is}async ready(){if(this.pendingBackendInit!=null)return this.pendingBackendInit.then(()=>{});if(this.backendInstance!=null)return;const e=this.getSortedBackends();for(let n=0;n<e.length;n++){const r=e[n];if(await this.initializeBackend(r).success){await this.setBackend(r);return}}throw new Error("Could not initialize any backends, all backend initializations failed.")}get backend(){if(this.pendingBackendInit!=null)throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(this.backendInstance==null){const{name:e,asyncInit:n}=this.initializeBackendsAndReturnBest();if(n)throw new Error(`The highest priority backend '${e}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(e)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(e){if(!(e in this.registry))if(e in this.registryFactory){const{asyncInit:n}=this.initializeBackend(e);if(n)return null}else return null;return this.registry[e]}findBackendFactory(e){return e in this.registryFactory?this.registryFactory[e].factory:null}registerBackend(e,n,r=1){return e in this.registryFactory?(We(`${e} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[e]={factory:n,priority:r},!0)}async setBackend(e){if(this.registryFactory[e]==null)throw new Error(`Backend name '${e}' not found in registry`);if(this.backendName=e,this.registry[e]==null){this.backendInstance=null;const{success:n,asyncInit:r}=this.initializeBackend(e);if(!(r?await n:n))return!1}return this.backendInstance=this.registry[e],this.setupRegisteredKernels(),this.profiler=new Vu(this.backendInstance),!0}setupRegisteredKernels(){En(this.backendName).forEach(n=>{n.setupFunc!=null&&n.setupFunc(this.backendInstance)})}disposeRegisteredKernels(e){En(e).forEach(r=>{r.disposeFunc!=null&&r.disposeFunc(this.registry[e])})}initializeBackend(e){const n=this.registryFactory[e];if(n==null)throw new Error(`Cannot initialize backend ${e}, no registration found.`);try{const r=n.factory();if(r&&!(r instanceof Ls)&&typeof r.then=="function"){const s=++this.pendingBackendInitId,o=r.then(a=>s<this.pendingBackendInitId?!1:(this.registry[e]=a,this.pendingBackendInit=null,!0)).catch(a=>(s<this.pendingBackendInitId||(this.pendingBackendInit=null,We(`Initialization of backend ${e} failed`),We(a.stack||a.message)),!1));return this.pendingBackendInit=o,{success:o,asyncInit:!0}}else return this.registry[e]=r,{success:!0,asyncInit:!1}}catch(r){return We(`Initialization of backend ${e} failed`),We(r.stack||r.message),{success:!1,asyncInit:!1}}}removeBackend(e){if(!(e in this.registryFactory))throw new Error(`${e} backend not found in registry`);this.backendName===e&&this.pendingBackendInit!=null&&this.pendingBackendInitId++,e in this.registry&&(this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e]),delete this.registryFactory[e],this.backendName===e&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(Object.keys(this.registryFactory).length===0)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort((e,n)=>this.registryFactory[n].priority-this.registryFactory[e].priority)}initializeBackendsAndReturnBest(){const e=this.getSortedBackends();for(let n=0;n<e.length;n++){const r=e[n],{success:s,asyncInit:o}=this.initializeBackend(r);if(o||s)return{name:r,asyncInit:o}}throw new Error("Could not initialize any backends, all backend initializations failed.")}moveData(e,n){const r=this.state.tensorInfo.get(n),s=r.backend,o=this.readSync(n),a=s.refCount(n);s.disposeData(n,!0),r.backend=e,e.move(n,o,r.shape,r.dtype,a),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(e,n){let r=null;if(n==null){if(typeof e!="function")throw new Error("Please provide a function to tidy()");n=e}else{if(typeof e!="string"&&!(e instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if(typeof n!="function")throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");r=e}let s;return this.scopedRun(()=>this.startScope(r),()=>this.endScope(s),()=>(s=n(),s instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),s))}scopedRun(e,n,r){e();try{const s=r();return n(),s}catch(s){throw n(),s}}nextTensorId(){return Nt.nextTensorId++}nextVariableId(){return Nt.nextVariableId++}clone(e){const n=b.runKernel(Mr,{x:e}),r={x:e},s=a=>({x:()=>{const i="float32",c={x:a},l={dtype:i};return b.runKernel(Dr,c,l)}}),o=[];return this.addTapeNode(this.state.activeScope.name,r,[n],s,o,{}),n}runKernel(e,n,r){if(this.backendName==null&&this.backend,!(Gt(e,this.backendName)!=null))throw new Error(`Kernel '${e}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:e,inputs:n,attrs:r})}shouldCheckForMemLeaks(){return this.ENV.getBool("IS_TEST")}checkKernelForMemLeak(e,n,r){const s=this.backend.numDataIds();let o=0;r.forEach(c=>{o+=c.dtype==="complex64"?3:1});const a=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],i=s-n-o-a;if(i>0)throw new Error(`Backend '${this.backendName}' has an internal memory leak (${i} data ids) after running '${e}'`)}runKernelFunc(e){let n,r=[];const s=this.isTapeOn(),o=this.state.numBytes,a=this.state.numTensors;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0);let i;this.backendName==null&&this.backend;let c;const l=Xn(e)?e.kernelName:this.state.activeScope!=null?this.state.activeScope.name:"";if(Xn(e)){const{kernelName:w,inputs:y,attrs:$}=e;this.backendName==null&&this.backend;const k=Gt(w,this.backendName);g(k!=null,()=>`Cannot find registered kernel '${w}' for backend '${this.backendName}'`),i=()=>{const N=this.backend.numDataIds();c=k.kernelFunc({inputs:y,attrs:$,backend:this.backend});const x=Array.isArray(c)?c:[c];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(w,N,x);const v=x.map(I=>I.rank!=null?I:this.makeTensorFromTensorInfo(I));if(s){const I=this.getTensorsForGradient(w,y,v);r=this.saveTensorsForBackwardMode(I)}return v}}else{const{forwardFunc:w}=e,y=$=>{s&&(r=$.map(k=>this.keep(this.clone(k))))};i=()=>{const $=this.backend.numDataIds();c=this.tidy(()=>w(this.backend,y));const k=Array.isArray(c)?c:[c];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(l,$,k),k}}const{inputs:h,attrs:u}=e,f=Xn(e)?null:e.backwardsFunc;let p;return this.scopedRun(()=>this.state.kernelDepth++,()=>this.state.kernelDepth--,()=>{!this.ENV.getBool("DEBUG")&&!this.state.profiling?n=i():(p=this.profiler.profileKernel(l,h,()=>i()),this.ENV.getBool("DEBUG")&&this.profiler.logKernelProfile(p),n=p.outputs)}),s&&this.addTapeNode(l,h,n,f,r,u),this.state.profiling&&this.state.activeProfile.kernels.push({name:l,bytesAdded:this.state.numBytes-o,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-a,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(h).map(w=>h[w]!=null?h[w].shape:null),outputShapes:n.map(w=>w.shape),kernelTimeMs:p.timeMs,extraInfo:p.extraInfo}),Array.isArray(c)?n:n[0]}saveTensorsForBackwardMode(e){return e.map(r=>this.keep(this.clone(r)))}getTensorsForGradient(e,n,r){const s=rr(e);if(s!=null){const o=s.inputsToSave||[],a=s.outputsToSave||[];let i;s.saveAllInputs?(g(Array.isArray(n),()=>"saveAllInputs is true, expected inputs to be an array."),i=Object.keys(n).map(l=>n[l])):i=o.map(l=>n[l]);const c=r.filter((l,h)=>a[h]);return i.concat(c)}return[]}makeTensor(e,n,r,s){if(e==null)throw new Error("Values passed to engine.makeTensor() are null");r=r||"float32",s=s||this.backend;let o=e;r==="string"&&qe(e[0])&&(o=e.map(c=>on(c)));const a=s.write(o,n,r),i=new Q(n,r,a,this.nextTensorId());if(this.trackTensor(i,s),r==="string"){const c=this.state.tensorInfo.get(a),l=Vs(o);this.state.numBytes+=l-c.bytes,c.bytes=l}return i}makeTensorFromDataId(e,n,r,s){r=r||"float32";const o={dataId:e,shape:n,dtype:r};return this.makeTensorFromTensorInfo(o,s)}makeTensorFromTensorInfo(e,n){const{dataId:r,shape:s,dtype:o}=e,a=new Q(s,o,r,this.nextTensorId());return this.trackTensor(a,n),a}makeVariable(e,n=!0,r,s){r=r||this.nextVariableId().toString(),s!=null&&s!==e.dtype&&(e=e.cast(s));const o=new Kt(e,n,r,this.nextTensorId());if(this.state.registeredVariables[o.name]!=null)throw new Error(`Variable with name ${o.name} was already registered`);return this.state.registeredVariables[o.name]=o,this.incRef(o,this.backend),o}trackTensor(e,n){this.state.numTensors++,e.dtype==="string"&&this.state.numStringTensors++;let r=0;e.dtype!=="complex64"&&e.dtype!=="string"&&(r=e.size*yn(e.dtype)),this.state.numBytes+=r,this.state.tensorInfo.has(e.dataId)||(this.state.numDataBuffers++,this.state.tensorInfo.set(e.dataId,{backend:n||this.backend,dtype:e.dtype,shape:e.shape,bytes:r})),e instanceof Kt||this.track(e)}incRef(e,n){this.trackTensor(e,n),this.backend.incRef(e.dataId)}removeDataId(e,n){this.state.tensorInfo.has(e)&&this.state.tensorInfo.get(e).backend===n&&(this.state.tensorInfo.delete(e),this.state.numDataBuffers--)}disposeTensor(e){if(!this.state.tensorInfo.has(e.dataId))return;const n=this.state.tensorInfo.get(e.dataId);if(this.state.numTensors--,e.dtype==="string"&&(this.state.numStringTensors--,this.state.numBytes-=n.bytes),e.dtype!=="complex64"&&e.dtype!=="string"){const r=e.size*yn(e.dtype);this.state.numBytes-=r}n.backend.disposeData(e.dataId)&&this.removeDataId(e.dataId,n.backend)}disposeVariables(){for(const e in this.state.registeredVariables){const n=this.state.registeredVariables[e];this.disposeVariable(n)}}disposeVariable(e){this.disposeTensor(e),this.state.registeredVariables[e.name]!=null&&delete this.state.registeredVariables[e.name]}memory(){const e=this.backend.memory();return e.numTensors=this.state.numTensors,e.numDataBuffers=this.state.numDataBuffers,e.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(e.unreliable=!0,e.reasons==null&&(e.reasons=[]),e.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),e}async profile(e){this.state.profiling=!0;const n=this.state.numBytes,r=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await e(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map(s=>s.totalBytesSnapshot)),this.state.activeProfile.newBytes=this.state.numBytes-n,this.state.activeProfile.newTensors=this.state.numTensors-r;for(const s of this.state.activeProfile.kernels)s.kernelTimeMs=await s.kernelTimeMs,s.extraInfo=await s.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&this.state.kernelDepth===0}addTapeNode(e,n,r,s,o,a){const i={id:this.state.nextTapeNodeId++,kernelName:e,inputs:n,outputs:r,saved:o},c=rr(e);c!=null&&(s=c.gradFunc),s!=null&&(i.gradient=l=>(l=l.map((h,u)=>{if(h==null){const f=r[u],p=Dn(f.size,f.dtype);return this.makeTensor(p,f.shape,f.dtype)}return h}),s(l.length>1?l:l[0],o,a))),this.state.activeTape.push(i)}keep(e){return e.kept=!0,e}startTape(){this.state.gradientDepth===0&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(e){const n={track:[],name:"unnamed scope",id:this.state.nextScopeId++};e&&(n.name=e),this.state.scopeStack.push(n),this.state.activeScope=n}endScope(e){const n=Cr(e),r=new Set(n.map(o=>o.id));for(let o=0;o<this.state.activeScope.track.length;o++){const a=this.state.activeScope.track[o];!a.kept&&!r.has(a.id)&&a.dispose()}const s=this.state.scopeStack.pop();this.state.activeScope=this.state.scopeStack.length===0?null:this.state.scopeStack[this.state.scopeStack.length-1],n.forEach(o=>{!o.kept&&o.scopeId===s.id&&this.track(o)})}gradients(e,n,r,s=!1){if(g(n.length>0,()=>"gradients() received an empty list of xs."),r!=null&&r.dtype!=="float32")throw new Error(`dy must have 'float32' dtype, but has '${r.dtype}'`);const o=this.scopedRun(()=>this.startTape(),()=>this.endTape(),()=>this.tidy("forward",e));g(o instanceof Q,()=>"The result y returned by f() must be a tensor.");const a=Xu(this.state.activeTape,n,o);if(!s&&a.length===0&&n.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",()=>{const i={};i[o.id]=r??ah(o.shape),Zu(i,a,l=>this.tidy(l),ih);const c=n.map(l=>i[l.id]);return this.state.gradientDepth===0&&(this.state.activeTape.forEach(l=>{for(const h of l.saved)h.dispose()}),this.state.activeTape=null),{value:o,grads:c}})}customGrad(e){return g(Ve(e),()=>"The f passed in customGrad(f) must be a function."),(...n)=>{g(n.every(i=>i instanceof Q),()=>"The args passed in customGrad(f)(x1, x2,...) must all be tensors");let r;const s={};n.forEach((i,c)=>{s[c]=i});const o=(i,c)=>(r=e(...n,c),g(r.value instanceof Q,()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor"),g(Ve(r.gradFunc),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function."),r.value),a=(i,c)=>{const l=r.gradFunc(i,c),h=Array.isArray(l)?l:[l];g(h.length===n.length,()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...)."),g(h.every(f=>f instanceof Q),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.");const u={};return h.forEach((f,p)=>{u[p]=()=>f}),u};return this.runKernelFunc({forwardFunc:o,backwardsFunc:a,inputs:s})}}readSync(e){return this.state.tensorInfo.get(e).backend.readSync(e)}read(e){return this.state.tensorInfo.get(e).backend.read(e)}readToGPU(e,n){return this.state.tensorInfo.get(e).backend.readToGPU(e,n)}async time(e){const n=zt(),r=await this.backend.time(e);return r.wallMs=zt()-n,r}track(e){return this.state.activeScope!=null&&(e.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(e)),e}get registeredVariables(){return this.state.registeredVariables}reset(){this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new Is;for(const e in this.registry)this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}}Nt.nextTensorId=0;Nt.nextVariableId=0;function ah(t){const e=Ir(W(t),"float32");return b.makeTensor(e,t,"float32")}function sc(){const t=Js();if(t._tfengine==null){const e=new Zs(t);t._tfengine=new Nt(e)}return iu(t._tfengine.ENV),Qu(()=>t._tfengine),t._tfengine}const b=sc();function ih(t,e){const n={a:t,b:e};return b.runKernel(_r,n)}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ch(){return typeof navigator<"u"&&navigator!=null}let hr;function lh(t){hr=t}function uh(t){if(hr!==void 0)return hr;if(t||ch()){if(t||(t=navigator),t.product==="ReactNative")return!0;const e=t.userAgent||t.vendor||(typeof window<"u"?window.opera:"");if(!e){const n=t;return n.userAgentData&&n.userAgentData.mobile}return/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4))}return!1}function oc(){return typeof window<"u"&&window.document!=null||typeof WorkerGlobalScope<"u"}var hh=Object.freeze({__proto__:null,isBrowser:oc,isMobile:uh,mockIsMobile:lh});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ue=B();ue.registerFlag("DEBUG",()=>!1,t=>{t&&console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.")});ue.registerFlag("IS_BROWSER",()=>oc());ue.registerFlag("IS_NODE",()=>typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u");ue.registerFlag("IS_CHROME",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor));ue.registerFlag("IS_SAFARI",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Safari/.test(navigator.userAgent)&&/Apple/.test(navigator.vendor));ue.registerFlag("PROD",()=>!1);ue.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY",()=>ue.getBool("DEBUG"));ue.registerFlag("DEPRECATION_WARNINGS_ENABLED",()=>!0);ue.registerFlag("IS_TEST",()=>!1);ue.registerFlag("CHECK_COMPUTATION_FOR_ERRORS",()=>ue.getBool("DEBUG"));ue.registerFlag("WRAP_TO_IMAGEBITMAP",()=>!1);ue.registerFlag("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU",()=>!1);ue.registerFlag("USE_SETTIMEOUTCUSTOM",()=>!1);/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function De(t,e){let n=t;if(se(t))return e==="string"?[]:[t.length];if(ec(t)){const s=t.channels||"RGBA";return[t.height,t.width*s.length]}else if(tc(t))return[t.buffer.size/(e==null?4:yn(e))];if(!Array.isArray(t))return[];const r=[];for(;Array.isArray(n)||se(n)&&e!=="string";)r.push(n.length),n=n[0];return Array.isArray(t)&&B().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&ac(t,r,[]),r}function ac(t,e,n){if(n=n||[],!Array.isArray(t)&&!se(t)){g(e.length===0,()=>`Element arr[${n.join("][")}] is a primitive, but should be an array/TypedArray of ${e[0]} elements`);return}g(e.length>0,()=>`Element arr[${n.join("][")}] should be a primitive, but is an array of ${t.length} elements`),g(t.length===e[0],()=>`Element arr[${n.join("][")}] should have ${e[0]} elements, but has ${t.length} elements`);const r=e.slice(1);for(let s=0;s<t.length;++s)ac(t[s],r,n.concat(s))}function Ts(t,e,n,r){if(t!=="string_or_numeric"){if(t==null)throw new Error("Expected dtype cannot be null.");if(t!=="numeric"&&t!==e||t==="numeric"&&e==="string")throw new Error(`Argument '${n}' passed to '${r}' must be ${t} tensor, but got ${e} tensor`)}}function d(t,e,n,r="numeric"){if(t instanceof Qi())return Ts(r,t.dtype,e,n),t;let s=rn(t);if(s!=="string"&&["bool","int32","float32"].indexOf(r)>=0&&(s=r),Ts(r,s,e,n),t==null||!se(t)&&!Array.isArray(t)&&typeof t!="number"&&typeof t!="boolean"&&typeof t!="string"){const c=t==null?"null":t.constructor.name;throw new Error(`Argument '${e}' passed to '${n}' must be a Tensor or TensorLike, but got '${c}'`)}const o=De(t,s);!se(t)&&!Array.isArray(t)&&(t=[t]);const i=s!=="string"?Mn(t,s):He(t,[],!0);return b.makeTensor(i,o,s)}function Vt(t,e,n,r="numeric"){if(!Array.isArray(t))throw new Error(`Argument ${e} passed to ${n} must be a \`Tensor[]\` or \`TensorLike[]\``);return t.map((o,a)=>d(o,`${e}[${a}]`,n,r))}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ic="__op";function m(t){const e=Object.keys(t);if(e.length!==1)throw new Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${e.length} keys.`);let n=e[0];const r=t[n];n.endsWith("_")&&(n=n.substring(0,n.length-1)),n=n+ic;const s=(...o)=>{b.startScope(n);try{const a=r(...o);return Nn(a)&&console.error("Cannot return a Promise inside of tidy."),b.endScope(a),a}catch(a){throw b.endScope(null),a}};return Object.defineProperty(s,"name",{value:n,configurable:!0}),s}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fh(t,e){const n=d(t,"real","complex"),r=d(e,"imag","complex");ce(n.shape,r.shape,`real and imag shapes, ${n.shape} and ${r.shape}, must match in call to tf.complex().`);const s={real:n,imag:r};return b.runKernel(Eo,s)}const je=m({complex_:fh});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ze(t,e,n,r){if(r==null)r=rn(t);else if(r==="complex64")throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(tc(t)||ec(t)){if(r!=="float32"&&r!=="int32")throw new Error(`Creating tensor from GPU data only supports 'float32'|'int32' dtype, while the dtype is ${r}.`);return b.backend.createTensorFromGPUData(t,e||n,r)}if(!se(t)&&!Array.isArray(t)&&typeof t!="number"&&typeof t!="boolean"&&typeof t!="string")throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(e!=null){pe(e);const s=W(e),o=W(n);g(s===o,()=>`Based on the provided shape, [${e}], the tensor should have ${s} values but has ${o}`);for(let a=0;a<n.length;++a){const i=n[a],c=a===n.length-1?i!==W(e.slice(a)):!0;g(n[a]===e[a]||!c,()=>`Error creating a new Tensor. Inferred shape (${n}) does not match the provided shape (${e}). `)}}return!se(t)&&!Array.isArray(t)&&(t=[t]),e=e||n,t=r!=="string"?Mn(t,r):He(t,[],!0),b.makeTensor(t,e,r)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function kt(t,e,n){const r=De(t,n);return Ze(t,e,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ot={float32:4,float16:2,int32:4,uint16:2,uint8:1,bool:1,complex64:8};class Te{static join(e){return new Te(e).slice()}constructor(e){if(this.shards=[],this.previousShardIndex=0,e==null||(e instanceof Array||(e=[e]),e=e.map(r=>se(r)?r.buffer:r),e.length===0))return;this.bufferUniformSize=e[0].byteLength;let n=0;for(let r=0;r<e.length;r++){const s=e[r];r!==e.length-1&&s.byteLength!==this.bufferUniformSize&&(this.bufferUniformSize=void 0);const o=n+s.byteLength;this.shards.push({buffer:s,start:n,end:o}),n=o}this.shards.length===0&&(this.byteLength=0),this.byteLength=this.shards[this.shards.length-1].end}slice(e=0,n=this.byteLength){if(this.shards.length===0)return new ArrayBuffer(0);if(e=isNaN(Number(e))?0:e,n=isNaN(Number(n))?0:n,e=Math.max(0,e),n=Math.min(this.byteLength,n),n<=e)return new ArrayBuffer(0);const r=this.findShardForByte(e);if(r===-1)throw new Error(`Could not find start shard for byte ${e}`);const s=n-e,o=new ArrayBuffer(s),a=new Uint8Array(o);let i=0;for(let c=r;c<this.shards.length;c++){const l=this.shards[c],u=e+i-l.start,f=i,w=Math.min(n,l.end)-l.start,y=new Uint8Array(l.buffer,u,w-u);if(a.set(y,f),i+=y.length,n<l.end)break}return o}findShardForByte(e){if(this.shards.length===0||e<0||e>=this.byteLength)return-1;if(this.bufferUniformSize!=null)return this.previousShardIndex=Math.floor(e/this.bufferUniformSize),this.previousShardIndex;function n(s){return e<s.start?-1:e>=s.end?1:0}if(n(this.shards[this.previousShardIndex])===0)return this.previousShardIndex;const r=dh(this.shards,n);return r===-1?-1:(this.previousShardIndex=r,this.previousShardIndex)}}function dh(t,e){let n=0,r=t.length;for(;n<=r;){const s=Math.floor((r-n)/2)+n,o=e(t[s]);if(o===0)return s;o<0?r=s:n=s+1}return-1}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ph(){B().set("PROD",!0)}function gh(){B().set("DEBUG",!0)}function mh(){B().set("DEPRECATION_WARNINGS_ENABLED",!1),console.warn("TensorFlow.js deprecation warnings have been disabled.")}function bh(t){B().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(t+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")}function wh(){b.disposeVariables()}function yh(){return b}function $h(){return b.memory()}function Eh(t){return b.profile(t)}function ee(t,e){return b.tidy(t,e)}function le(t){Cr(t).forEach(n=>n.dispose())}function cc(t){return b.keep(t)}function xh(t){return b.time(t)}function kh(t){return b.setBackend(t)}function vh(){return b.ready()}function lc(){return b.backendName}function Sh(t){b.removeBackend(t)}function Ih(t){return b.findBackend(t)}function Th(t){return b.findBackendFactory(t)}function Ah(t,e,n=1){return b.registerBackend(t,e,n)}function uc(){return b.backend}function _h(t,e){B().setPlatform(t,e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Xe=4;async function Dh(t,e){const n=[],r=[],s=Array.isArray(t)?t.map(a=>a.name):Object.keys(t);for(let a=0;a<s.length;++a){const i=s[a],c=Array.isArray(t)?t[a].tensor:t[i];if(c.dtype!=="float32"&&c.dtype!=="int32"&&c.dtype!=="bool"&&c.dtype!=="string"&&c.dtype!=="complex64")throw new Error(`Unsupported dtype in weight '${i}': ${c.dtype}`);const l={name:i,shape:c.shape,dtype:c.dtype};if(c.dtype==="string"){const h=new Promise(async u=>{const f=await c.bytes(),p=f.reduce(($,k)=>$+k.length,0)+Xe*f.length,w=new Uint8Array(p);let y=0;for(let $=0;$<f.length;$++){const k=f[$],N=new Uint8Array(new Uint32Array([k.length]).buffer);w.set(N,y),y+=Xe,w.set(k,y),y+=k.length}u(w)});r.push(h)}else r.push(c.data());e!=null&&(l.group=e),n.push(l)}const o=await Promise.all(r);return{data:Rh(o),specs:n}}function hc(t,e){const n=new Te(t),r={};let s=0;for(const o of e){const a=Nh(o,(i,c)=>n.slice(s+i,s+c));r[o.name]=fc(o,n.slice(s,s+a)),s+=a}return r}function Nh(t,e){const n=W(t.shape);let r;if("quantization"in t){const s=t.quantization;r=ot[s.dtype]}else if(t.dtype==="string"){let s=0;for(let o=0;o<n;o++)s+=Xe+new Uint32Array(e(s,s+Xe))[0];return s}else r=ot[t.dtype];return n*r}async function Mh(t,e){const n=W(t.shape);let r;if("quantization"in t){const s=t.quantization;r=ot[s.dtype]}else if(t.dtype==="string"){let s=0;for(let o=0;o<n;o++)s+=Xe+new Uint32Array(await e(s,s+Xe))[0];return s}else r=ot[t.dtype];return n*r}function fc(t,e){const n=t.name,r=t.dtype,s=t.shape,o=W(s);let a,i=0;if("quantization"in t){const c=t.quantization;if(c.dtype==="uint8"||c.dtype==="uint16"){if(!("min"in c&&"scale"in c))throw new Error(`Weight ${t.name} with quantization ${c.dtype} doesn't have corresponding metadata min and scale.`)}else if(c.dtype==="float16"){if(r!=="float32")throw new Error(`Weight ${t.name} is quantized with ${c.dtype} which only supports weights of type float32 not ${r}.`)}else throw new Error(`Weight ${t.name} has unknown quantization dtype ${c.dtype}. Supported quantization dtypes are: 'uint8', 'uint16', and 'float16'.`);const l=ot[c.dtype],h=c.dtype==="uint8"?new Uint8Array(e):new Uint16Array(e);if(r==="float32")if(c.dtype==="uint8"||c.dtype==="uint16"){a=new Float32Array(h.length);for(let u=0;u<h.length;u++){const f=h[u];a[u]=f*c.scale+c.min}}else if(c.dtype==="float16")a=Uh()(h);else throw new Error(`Unsupported quantization type ${c.dtype} for weight type float32.`);else if(r==="int32"){if(c.dtype!=="uint8"&&c.dtype!=="uint16")throw new Error(`Unsupported quantization type ${c.dtype} for weight type int32.`);a=new Int32Array(h.length);for(let u=0;u<h.length;u++){const f=h[u];a[u]=Math.round(f*c.scale+c.min)}}else throw new Error(`Unsupported dtype in weight '${n}': ${r}`);i+=o*l}else if(r==="string"){const c=W(t.shape);a=[];for(let l=0;l<c;l++){const h=new Uint32Array(e.slice(i,i+Xe))[0];i+=Xe;const u=new Uint8Array(e.slice(i,i+h));a.push(u),i+=h}}else{const c=ot[r];if(r==="float32")a=new Float32Array(e);else if(r==="int32")a=new Int32Array(e);else if(r==="bool")a=new Uint8Array(e);else if(r==="complex64"){a=new Float32Array(e);const l=new Float32Array(a.length/2),h=new Float32Array(a.length/2);for(let w=0;w<l.length;w++)l[w]=a[w*2],h[w]=a[w*2+1];const u=kt(l,s,"float32"),f=kt(h,s,"float32"),p=je(u,f);return u.dispose(),f.dispose(),p}else throw new Error(`Unsupported dtype in weight '${n}': ${r}`);i+=o*c}return kt(a,s,r)}async function As(t,e,n){let r=new Uint8Array(e);for(;r.byteLength<n;){const{done:s,value:o}=await t.read();if(s&&o==null){const i=n-r.byteLength;throw new Error(`Reader is done but ${i} bytes are still expected`)}const a=new Uint8Array(r.length+o.byteLength);a.set(r,0),a.set(new Uint8Array(o),r.length),r=a}return r.buffer}async function Fh(t,e){const n={},r=t.getReader();let s=new ArrayBuffer(0);for(const o of e){const a=await Mh(o,async(l,h)=>(s=await As(r,s,h),s.slice(l,h)));s=await As(r,s,a);const i=s.slice(0,a);s=s.slice(a);const c=fc(o,i);if(n[o.name]=c,lc()==="webgpu"){const l=uc();"uploadToGPU"in l&&W(c.shape)>=B().get("WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD")&&l.uploadToGPU(c.dataId)}}return n}function Rh(t){if(t===null)throw new Error(`Invalid input value: ${JSON.stringify(t)}`);let e=0;const n=[];t.forEach(o=>{if(e+=o.byteLength,n.push(o.byteLength===o.buffer.byteLength?o:new o.constructor(o)),!(o instanceof Float32Array||o instanceof Int32Array||o instanceof Uint8Array))throw new Error(`Unsupported TypedArray subtype: ${o.constructor.name}`)});const r=new Uint8Array(e);let s=0;return n.forEach(o=>{r.set(new Uint8Array(o.buffer),s),s+=o.byteLength}),r.buffer}const Pr=typeof Buffer<"u"&&(typeof Blob>"u"||typeof atob>"u"||typeof btoa>"u");function _s(t){return Pr?Buffer.byteLength(t,"utf8"):new Blob([t]).size}function Bh(t){if(Pr)return Buffer.from(t).toString("base64");const e=new Uint8Array(t);let n="";for(let r=0,s=e.length;r<s;r++)n+=String.fromCharCode(e[r]);return btoa(n)}function Ch(t){if(Pr){const r=Buffer.from(t,"base64");return r.buffer.slice(r.byteOffset,r.byteOffset+r.byteLength)}const e=atob(t),n=new Uint8Array(e.length);for(let r=0;r<e.length;++r)n.set([e.charCodeAt(r)],r);return n.buffer}function Ph(t){return Te.join(t)}function Ds(t){const e="/";for(t=t.trim();t.endsWith(e);)t=t.slice(0,t.length-1);const n=t.split(e);return n[n.length-1]}function dc(t,e){const n={modelTopology:t.modelTopology,format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy,weightsManifest:e};return t.signature!=null&&(n.signature=t.signature),t.userDefinedMetadata!=null&&(n.userDefinedMetadata=t.userDefinedMetadata),t.modelInitializer!=null&&(n.modelInitializer=t.modelInitializer),t.initializerSignature!=null&&(n.initializerSignature=t.initializerSignature),t.trainingConfig!=null&&(n.trainingConfig=t.trainingConfig),n}function pc(t,e,n){const r={modelTopology:t.modelTopology,format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy};if(t.trainingConfig!=null&&(r.trainingConfig=t.trainingConfig),t.weightsManifest!=null){if(!e)throw new Error("modelJSON has weightsManifest but weightSpecs is null");if(!n)throw new Error("modelJSON has weightsManifest but weightData is null");r.weightSpecs=e,r.weightData=n}return t.signature!=null&&(r.signature=t.signature),t.userDefinedMetadata!=null&&(r.userDefinedMetadata=t.userDefinedMetadata),t.modelInitializer!=null&&(r.modelInitializer=t.modelInitializer),t.initializerSignature!=null&&(r.initializerSignature=t.initializerSignature),r}async function Or(t,e){let n,r;return t.weightsManifest!=null&&([n,r]=await e(t.weightsManifest)),pc(t,n,r)}function an(t){if(t.modelTopology instanceof ArrayBuffer)throw new Error("Expected JSON model topology, received ArrayBuffer.");return{dateSaved:new Date,modelTopologyType:"JSON",modelTopologyBytes:t.modelTopology==null?0:_s(JSON.stringify(t.modelTopology)),weightSpecsBytes:t.weightSpecs==null?0:_s(JSON.stringify(t.weightSpecs)),weightDataBytes:t.weightData==null?0:new Te(t.weightData).byteLength}}function fr(t){const e=[];for(const n of t)e.push(...n.weights);return e}function Oh(){const t=n=>{let r=n<<13,s=0;for(;!(r&8388608);)s-=8388608,r<<=1;return r&=-8388609,s+=947912704,r|s},e=new Uint32Array(2048);e[0]=0;for(let n=1;n<1024;n++)e[n]=t(n);for(let n=1024;n<2048;n++)e[n]=939524096+(n-1024<<13);return e}function Lh(){const t=new Uint32Array(64);t[0]=0,t[31]=1199570944,t[32]=2147483648,t[63]=3347054592;for(let e=1;e<31;e++)t[e]=e<<23;for(let e=33;e<63;e++)t[e]=2147483648+(e-32<<23);return t}function Wh(){const t=new Uint32Array(64);for(let e=0;e<64;e++)t[e]=1024;return t[0]=t[32]=0,t}function Uh(){const t=Oh(),e=Lh(),n=Wh();return r=>{const s=new ArrayBuffer(4*r.length),o=new Uint32Array(s);for(let a=0;a<r.length;a++){const i=r[a],c=t[n[i>>10]+(i&1023)]+e[i>>10];o[a]=c}return new Float32Array(s)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class J{constructor(){this.saveRouters=[],this.loadRouters=[]}static getInstance(){return J.instance==null&&(J.instance=new J),J.instance}static registerSaveRouter(e){J.getInstance().saveRouters.push(e)}static registerLoadRouter(e){J.getInstance().loadRouters.push(e)}static getSaveHandlers(e){return J.getHandlers(e,"save")}static getLoadHandlers(e,n){return J.getHandlers(e,"load",n)}static getHandlers(e,n,r){const s=[];return(n==="load"?J.getInstance().loadRouters:J.getInstance().saveRouters).forEach(a=>{const i=a(e,r);i!==null&&s.push(i)}),s}}const qh=t=>J.registerSaveRouter(t),Gh=t=>J.registerLoadRouter(t),zh=t=>J.getSaveHandlers(t),Kh=(t,e)=>J.getLoadHandlers(t,e);/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const dr="tensorflowjs",pr=1,nt="models_store",Ge="model_info_store";function gc(){if(!B().getBool("IS_BROWSER"))throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");const t=typeof window>"u"?self:window,e=t.indexedDB||t.mozIndexedDB||t.webkitIndexedDB||t.msIndexedDB||t.shimIndexedDB;if(e==null)throw new Error("The current browser does not appear to support IndexedDB.");return e}function gr(t){const e=t.result;e.createObjectStore(nt,{keyPath:"modelPath"}),e.createObjectStore(Ge,{keyPath:"modelPath"})}class at{constructor(e){if(this.indexedDB=gc(),e==null||!e)throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");this.modelPath=e}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");return this.databaseAction(this.modelPath,e)}async load(){return this.databaseAction(this.modelPath)}databaseAction(e,n){return new Promise((r,s)=>{const o=this.indexedDB.open(dr,pr);o.onupgradeneeded=()=>gr(o),o.onsuccess=()=>{const a=o.result;if(n==null){const i=a.transaction(nt,"readonly"),l=i.objectStore(nt).get(this.modelPath);l.onsuccess=()=>{if(l.result==null)return a.close(),s(new Error(`Cannot find model with path '${this.modelPath}' in IndexedDB.`));r(l.result.modelArtifacts)},l.onerror=h=>(a.close(),s(l.error)),i.oncomplete=()=>a.close()}else{n.weightData=Te.join(n.weightData);const i=an(n),c=a.transaction(Ge,"readwrite");let l=c.objectStore(Ge),h;try{h=l.put({modelPath:this.modelPath,modelArtifactsInfo:i})}catch(f){return s(f)}let u;h.onsuccess=()=>{u=a.transaction(nt,"readwrite");const f=u.objectStore(nt);let p;try{p=f.put({modelPath:this.modelPath,modelArtifacts:n,modelArtifactsInfo:i})}catch(w){return s(w)}p.onsuccess=()=>r({modelArtifactsInfo:i}),p.onerror=w=>{l=c.objectStore(Ge);const y=l.delete(this.modelPath);y.onsuccess=()=>(a.close(),s(p.error)),y.onerror=$=>(a.close(),s(p.error))}},h.onerror=f=>(a.close(),s(h.error)),c.oncomplete=()=>{u==null?a.close():u.oncomplete=()=>a.close()}}},o.onerror=a=>s(o.error)})}}at.URL_SCHEME="indexeddb://";const mc=t=>B().getBool("IS_BROWSER")&&!Array.isArray(t)&&t.startsWith(at.URL_SCHEME)?Vh(t.slice(at.URL_SCHEME.length)):null;J.registerSaveRouter(mc);J.registerLoadRouter(mc);function Vh(t){return new at(t)}function Hh(t){return t.startsWith(at.URL_SCHEME)?t.slice(at.URL_SCHEME.length):t}class jh{constructor(){this.indexedDB=gc()}async listModels(){return new Promise((e,n)=>{const r=this.indexedDB.open(dr,pr);r.onupgradeneeded=()=>gr(r),r.onsuccess=()=>{const s=r.result,o=s.transaction(Ge,"readonly"),i=o.objectStore(Ge).getAll();i.onsuccess=()=>{const c={};for(const l of i.result)c[l.modelPath]=l.modelArtifactsInfo;e(c)},i.onerror=c=>(s.close(),n(i.error)),o.oncomplete=()=>s.close()},r.onerror=s=>n(r.error)})}async removeModel(e){return e=Hh(e),new Promise((n,r)=>{const s=this.indexedDB.open(dr,pr);s.onupgradeneeded=()=>gr(s),s.onsuccess=()=>{const o=s.result,a=o.transaction(Ge,"readwrite"),i=a.objectStore(Ge),c=i.get(e);let l;c.onsuccess=()=>{if(c.result==null)return o.close(),r(new Error(`Cannot find model with path '${e}' in IndexedDB.`));{const h=i.delete(e),u=()=>{l=o.transaction(nt,"readwrite");const p=l.objectStore(nt).delete(e);p.onsuccess=()=>n(c.result.modelArtifactsInfo),p.onerror=w=>r(c.error)};h.onsuccess=u,h.onerror=f=>(u(),o.close(),r(c.error))}},c.onerror=h=>(o.close(),r(c.error)),a.oncomplete=()=>{l==null?o.close():l.oncomplete=()=>o.close()}},s.onerror=o=>r(s.error)})}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Fe="/",yt="tensorflowjs_models",bc="info",Xh="model_topology",Zh="weight_specs",Jh="weight_data",Yh="model_metadata";function wc(t){return{info:[yt,t,bc].join(Fe),topology:[yt,t,Xh].join(Fe),weightSpecs:[yt,t,Zh].join(Fe),weightData:[yt,t,Jh].join(Fe),modelMetadata:[yt,t,Yh].join(Fe)}}function yc(t){for(const e of Object.values(t))window.localStorage.removeItem(e)}function Qh(t){const e=t.split(Fe);if(e.length<3)throw new Error(`Invalid key format: ${t}`);return e.slice(1,e.length-1).join(Fe)}function ef(t){return t.startsWith(it.URL_SCHEME)?t.slice(it.URL_SCHEME.length):t}class it{constructor(e){if(!B().getBool("IS_BROWSER")||typeof window>"u"||typeof window.localStorage>"u")throw new Error("The current environment does not support local storage.");if(this.LS=window.localStorage,e==null||!e)throw new Error("For local storage, modelPath must not be null, undefined or empty.");this.modelPath=e,this.keys=wc(this.modelPath)}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");{const n=JSON.stringify(e.modelTopology),r=JSON.stringify(e.weightSpecs),s=an(e),o=Te.join(e.weightData);try{this.LS.setItem(this.keys.info,JSON.stringify(s)),this.LS.setItem(this.keys.topology,n),this.LS.setItem(this.keys.weightSpecs,r),this.LS.setItem(this.keys.weightData,Bh(o));const a={format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,signature:e.signature!=null?e.signature:void 0,userDefinedMetadata:e.userDefinedMetadata!=null?e.userDefinedMetadata:void 0,modelInitializer:e.modelInitializer!=null?e.modelInitializer:void 0,initializerSignature:e.initializerSignature!=null?e.initializerSignature:void 0,trainingConfig:e.trainingConfig!=null?e.trainingConfig:void 0};return this.LS.setItem(this.keys.modelMetadata,JSON.stringify(a)),{modelArtifactsInfo:s}}catch{throw yc(this.keys),new Error(`Failed to save model '${this.modelPath}' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=${s.modelTopologyBytes}, weightSpecsBytes=${s.weightSpecsBytes}, weightDataBytes=${s.weightDataBytes}.`)}}}async load(){const e=JSON.parse(this.LS.getItem(this.keys.info));if(e==null)throw new Error(`In local storage, there is no model with name '${this.modelPath}'`);if(e.modelTopologyType!=="JSON")throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");const n={},r=JSON.parse(this.LS.getItem(this.keys.topology));if(r==null)throw new Error(`In local storage, the topology of model '${this.modelPath}' is missing.`);n.modelTopology=r;const s=JSON.parse(this.LS.getItem(this.keys.weightSpecs));if(s==null)throw new Error(`In local storage, the weight specs of model '${this.modelPath}' are missing.`);n.weightSpecs=s;const o=this.LS.getItem(this.keys.modelMetadata);if(o!=null){const i=JSON.parse(o);n.format=i.format,n.generatedBy=i.generatedBy,n.convertedBy=i.convertedBy,i.signature!=null&&(n.signature=i.signature),i.userDefinedMetadata!=null&&(n.userDefinedMetadata=i.userDefinedMetadata),i.modelInitializer!=null&&(n.modelInitializer=i.modelInitializer),i.initializerSignature!=null&&(n.initializerSignature=i.initializerSignature),i.trainingConfig!=null&&(n.trainingConfig=i.trainingConfig)}const a=this.LS.getItem(this.keys.weightData);if(a==null)throw new Error(`In local storage, the binary weight values of model '${this.modelPath}' are missing.`);return n.weightData=Ch(a),n}}it.URL_SCHEME="localstorage://";const $c=t=>B().getBool("IS_BROWSER")&&!Array.isArray(t)&&t.startsWith(it.URL_SCHEME)?tf(t.slice(it.URL_SCHEME.length)):null;J.registerSaveRouter($c);J.registerLoadRouter($c);function tf(t){return new it(t)}class nf{constructor(){g(B().getBool("IS_BROWSER"),()=>"Current environment is not a web browser"),g(typeof window>"u"||typeof window.localStorage<"u",()=>"Current browser does not appear to support localStorage"),this.LS=window.localStorage}async listModels(){const e={},n=yt+Fe,r=Fe+bc;for(let s=0;s<this.LS.length;++s){const o=this.LS.key(s);if(o.startsWith(n)&&o.endsWith(r)){const a=Qh(o);e[a]=JSON.parse(this.LS.getItem(o))}}return e}async removeModel(e){e=ef(e);const n=wc(e);if(this.LS.getItem(n.info)==null)throw new Error(`Cannot find model at path '${e}'`);const r=JSON.parse(this.LS.getItem(n.info));return yc(n),r}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const vt="://";class oe{constructor(){this.managers={}}static getInstance(){return oe.instance==null&&(oe.instance=new oe),oe.instance}static registerManager(e,n){g(e!=null,()=>"scheme must not be undefined or null."),e.endsWith(vt)&&(e=e.slice(0,e.indexOf(vt))),g(e.length>0,()=>"scheme must not be an empty string.");const r=oe.getInstance();g(r.managers[e]==null,()=>`A model store manager is already registered for scheme '${e}'.`),r.managers[e]=n}static getManager(e){const n=oe.getInstance().managers[e];if(n==null)throw new Error(`Cannot find model manager for scheme '${e}'`);return n}static getSchemes(){return Object.keys(oe.getInstance().managers)}}function mn(t){if(t.indexOf(vt)===-1)throw new Error(`The url string provided does not contain a scheme. Supported schemes are: ${oe.getSchemes().join(",")}`);return{scheme:t.split(vt)[0],path:t.split(vt)[1]}}async function Ec(t,e,n=!1){g(t!==e,()=>`Old path and new path are the same: '${t}'`);const r=J.getLoadHandlers(t);g(r.length>0,()=>`Copying failed because no load handler is found for source URL ${t}.`),g(r.length<2,()=>`Copying failed because more than one (${r.length}) load handlers for source URL ${t}.`);const s=r[0],o=J.getSaveHandlers(e);g(o.length>0,()=>`Copying failed because no save handler is found for destination URL ${e}.`),g(o.length<2,()=>`Copying failed because more than one (${r.length}) save handlers for destination URL ${e}.`);const a=o[0],i=mn(t).scheme,c=mn(t).path,l=i===mn(t).scheme,h=await s.load();n&&l&&await oe.getManager(i).removeModel(c);const u=await a.save(h);return n&&!l&&await oe.getManager(i).removeModel(c),u.modelArtifactsInfo}async function rf(){const t=oe.getSchemes(),e={};for(const n of t){const r=await oe.getManager(n).listModels();for(const s in r){const o=n+vt+s;e[o]=r[s]}}return e}async function sf(t){const e=mn(t);return oe.getManager(e.scheme).removeModel(e.path)}async function of(t,e){return Ec(t,e,!1)}async function af(t,e){return Ec(t,e,!0)}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class cf{constructor(){this.messageName="setTimeoutCustom",this.functionRefs=[],this.handledMessageCount=0,this.hasEventListener=!1}fetch(e,n){return fetch(e,n)}now(){return performance.now()}encode(e,n){if(n!=="utf-8"&&n!=="utf8")throw new Error(`Browser's encoder only supports utf-8, but got ${n}`);return this.textEncoder==null&&(this.textEncoder=new TextEncoder),this.textEncoder.encode(e)}decode(e,n){return new TextDecoder(n).decode(e)}setTimeoutCustom(e,n){if(typeof window>"u"||!B().getBool("USE_SETTIMEOUTCUSTOM")){setTimeout(e,n);return}this.functionRefs.push(e),setTimeout(()=>{window.postMessage({name:this.messageName,index:this.functionRefs.length-1},"*")},n),this.hasEventListener||(this.hasEventListener=!0,window.addEventListener("message",r=>{if(r.source===window&&r.data.name===this.messageName){r.stopPropagation();const s=this.functionRefs[r.data.index];s(),this.handledMessageCount++,this.handledMessageCount===this.functionRefs.length&&(this.functionRefs=[],this.handledMessageCount=0)}},!0))}isTypedArray(e){return Gi(e)}}if(B().get("IS_BROWSER")){B().setPlatform("browser",new cf);try{oe.registerManager(it.URL_SCHEME,new nf)}catch{}try{oe.registerManager(at.URL_SCHEME,new jh)}catch{}}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const lf={importFetch:()=>require("node-fetch")};let Zn;class uf{constructor(){this.util=require("util"),this.textEncoder=new this.util.TextEncoder}fetch(e,n){return B().global.fetch!=null?B().global.fetch(e,n):(Zn==null&&(Zn=lf.importFetch()),Zn(e,n))}now(){const e=process.hrtime();return e[0]*1e3+e[1]/1e6}encode(e,n){if(n!=="utf-8"&&n!=="utf8")throw new Error(`Node built-in encoder only supports utf-8, but got ${n}`);return this.textEncoder.encode(e)}decode(e,n){return e.length===0?"":new this.util.TextDecoder(n).decode(e)}isTypedArray(e){return this.util.types.isFloat32Array(e)||this.util.types.isInt32Array(e)||this.util.types.isUint8Array(e)||this.util.types.isUint8ClampedArray(e)}}B().get("IS_NODE")&&!B().get("IS_BROWSER")&&B().setPlatform("node",new uf);/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Re(t,e="float32",n){return e=e||"float32",pe(t),new vn(t,e,n)}/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hf(t,e){const n=d(t,"x","cast");if(!Ks(e))throw new Error(`Failed to cast to unknown dtype ${e}`);if(e==="string"&&n.dtype!=="string"||e!=="string"&&n.dtype==="string")throw new Error("Only strings can be casted to strings");const r={x:n},s={dtype:e};return b.runKernel(Dr,r,s)}const j=m({cast_:hf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ff(t){const n={x:d(t,"x","clone","string_or_numeric")};return b.runKernel(Mr,n)}const st=m({clone_:ff});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xc(t,e=!1){console.log(t.toString(e))}/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */sc();const df={buffer:Re,cast:j,clone:st,print:xc};eh(df);/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pf(t,e){let n=d(t,"a","add"),r=d(e,"b","add");[n,r]=Y(n,r);const s={a:n,b:r};return b.runKernel(_r,s)}const F=m({add_:pf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gf(t,e){let n=d(t,"a","floorDiv"),r=d(e,"b","floorDiv");[n,r]=Y(n,r);const s={a:n,b:r};return b.runKernel(Qo,s)}const kc=m({floorDiv_:gf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mf(t,e){let n=d(t,"a","div"),r=d(e,"b","div");if([n,r]=Y(n,r),n.dtype==="int32"&&r.dtype==="int32")return kc(n,r);const s={a:n,b:r},o={};return b.runKernel(Uo,s,o)}const K=m({div_:mf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bf(t,e){let n=d(t,"a","mul"),r=d(e,"b","mul");[n,r]=Y(n,r);const s={a:n,b:r};return b.runKernel(Na,s)}const T=m({mul_:bf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wf(t){const e=d(t,"x","abs");if(e.dtype==="complex64"){const n={x:e};return b.runKernel(xo,n)}else{const n={x:e};return b.runKernel(Ys,n)}}const me=m({abs_:wf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function yf(t){const n={x:d(t,"x","acos")};return b.runKernel(Qs,n)}const $f=m({acos_:yf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ef(t){const n={x:d(t,"x","acosh")};return b.runKernel(eo,n)}const xf=m({acosh_:Ef});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function kf(t){g(Array.isArray(t),()=>"The argument passed to tf.addN() must be a list of tensors"),g(t.length>=1,()=>`Must pass at least one tensor to tf.addN(), but got ${t.length}`);const e=t.map((s,o)=>d(s,`tensors${o}`,"addN")),n=e[0];e.forEach(s=>{if(s.dtype!==n.dtype)throw new Error("All tensors passed to tf.addN() must have the same dtype")}),e.forEach(s=>{if(!Ce(s.shape,n.shape))throw new Error("All tensors passed to tf.addN() must have the same shape")});const r=e;return b.runKernel(to,r)}const vf=m({addN_:kf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sf(t,e=null,n=!1){const s={x:d(t,"x","all","bool")},o={axis:e,keepDims:n};return b.runKernel(no,s,o)}const If=m({all_:Sf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Tf(t,e=null,n=!1){const s={x:d(t,"x","any","bool")},o={axis:e,keepDims:n};return b.runKernel(ro,s,o)}const Af=m({any_:Tf});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _f(t,e=0){const r={x:d(t,"x","argMax")},s={axis:e};return b.runKernel(so,r,s)}const Df=m({argMax_:_f});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Nf(t,e=0){const r={x:d(t,"x","argMin")},s={axis:e};return b.runKernel(oo,r,s)}const Mf=m({argMin_:Nf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ff(t){const n={x:d(t,"x","asin")};return b.runKernel(ao,n)}const Rf=m({asin_:Ff});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Bf(t){const n={x:d(t,"x","asinh")};return b.runKernel(io,n)}const Cf=m({asinh_:Bf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pf(t){const n={x:d(t,"x","atan")};return b.runKernel(co,n)}const Of=m({atan_:Pf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lf(t,e){let n=d(t,"a","atan2"),r=d(e,"b","atan2");[n,r]=Y(n,r);const s={a:n,b:r};return b.runKernel(uo,s)}const Wf=m({atan2_:Lf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Uf(t){const n={x:d(t,"x","atanh")};return b.runKernel(lo,n)}const qf=m({atanh_:Uf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gf(t,e,n,r,s="NHWC",o){const a=t[3],i=[...e,a],c=Ic(s);return cn(t,i,n,o,r,null,null,c)}function vc(t,e,n,r,s,o,a="channelsLast"){const[i,c]=Ht(e);let l;if(a==="channelsLast")l=[i,c,t[3],t[3]];else if(a==="channelsFirst")l=[i,c,t[1],t[1]];else throw new Error(`Unknown dataFormat ${a}`);return cn(t,l,n,r,s,o,!1,a)}function zf(t,e,n,r,s,o,a="NDHWC"){const[i,c,l]=mr(e);let h,u;if(a==="NDHWC")u="channelsLast",h=[i,c,l,t[4],t[4]];else if(a==="NCDHW")u="channelsFirst",h=[i,c,l,t[1],t[1]];else throw new Error(`Unknown dataFormat ${a}`);return Sc(t,h,n,r,s,!1,u,o)}function cn(t,e,n,r,s,o,a=!1,i="channelsLast"){let[c,l,h,u]=[-1,-1,-1,-1];if(i==="channelsLast")[c,l,h,u]=t;else if(i==="channelsFirst")[c,u,l,h]=t;else throw new Error(`Unknown dataFormat ${i}`);const[f,p,,w]=e,[y,$]=Ht(n),[k,N]=Ht(r),x=St(f,k),v=St(p,N),{padInfo:I,outHeight:A,outWidth:M}=Hf(s,l,h,y,$,x,v,o,i),_=a?w*u:w;let D;return i==="channelsFirst"?D=[c,_,A,M]:i==="channelsLast"&&(D=[c,A,M,_]),{batchSize:c,dataFormat:i,inHeight:l,inWidth:h,inChannels:u,outHeight:A,outWidth:M,outChannels:_,padInfo:I,strideHeight:y,strideWidth:$,filterHeight:f,filterWidth:p,effectiveFilterHeight:x,effectiveFilterWidth:v,dilationHeight:k,dilationWidth:N,inShape:t,outShape:D,filterShape:e}}function Sc(t,e,n,r,s,o=!1,a="channelsLast",i){let[c,l,h,u,f]=[-1,-1,-1,-1,-1];if(a==="channelsLast")[c,l,h,u,f]=t;else if(a==="channelsFirst")[c,f,l,h,u]=t;else throw new Error(`Unknown dataFormat ${a}`);const[p,w,y,,$]=e,[k,N,x]=mr(n),[v,I,A]=mr(r),M=St(p,v),_=St(w,I),D=St(y,A),{padInfo:C,outDepth:R,outHeight:O,outWidth:U}=jf(s,l,h,u,k,N,x,M,_,D,i),X=o?$*f:$;let ne;return a==="channelsFirst"?ne=[c,X,R,O,U]:a==="channelsLast"&&(ne=[c,R,O,U,X]),{batchSize:c,dataFormat:a,inDepth:l,inHeight:h,inWidth:u,inChannels:f,outDepth:R,outHeight:O,outWidth:U,outChannels:X,padInfo:C,strideDepth:k,strideHeight:N,strideWidth:x,filterDepth:p,filterHeight:w,filterWidth:y,effectiveFilterDepth:M,effectiveFilterHeight:_,effectiveFilterWidth:D,dilationDepth:v,dilationHeight:I,dilationWidth:A,inShape:t,outShape:ne,filterShape:e}}function Kf(t,e,n,r,s){r==null&&(r=Lr(t,e,n));const o=t[0],a=t[1],i=jt((o-e+2*r)/n+1,s),c=jt((a-e+2*r)/n+1,s);return[i,c]}function Vf(t,e,n,r,s,o){s==null&&(s=Lr(t,e[0],r[0]));const a=[0,0,0,n];for(let i=0;i<3;i++)t[i]+2*s>=e[i]&&(a[i]=jt((t[i]-e[i]+2*s)/r[i]+1,o));return a}function Lr(t,e,n,r=1){const s=St(e,r);return Math.floor((t[0]*(n-1)-n+s)/2)}function Ht(t){return typeof t=="number"?[t,t,t]:t.length===2?[t[0],t[1],1]:t}function mr(t){return typeof t=="number"?[t,t,t]:t}function St(t,e){return e<=1?t:t+(t-1)*(e-1)}function Hf(t,e,n,r,s,o,a,i,c){let l,h,u;if(typeof t=="number"){l={top:t,bottom:t,left:t,right:t,type:t===0?"VALID":"NUMBER"};const p=Kf([e,n],o,r,t,i);h=p[0],u=p[1]}else if(t==="same"){h=Math.ceil(e/r),u=Math.ceil(n/s);const f=Math.max(0,(h-1)*r+o-e),p=Math.max(0,(u-1)*s+a-n),w=Math.floor(f/2),y=f-w,$=Math.floor(p/2),k=p-$;l={top:w,bottom:y,left:$,right:k,type:"SAME"}}else if(t==="valid")l={top:0,bottom:0,left:0,right:0,type:"VALID"},h=Math.ceil((e-o+1)/r),u=Math.ceil((n-a+1)/s);else if(typeof t=="object"){const f=c==="channelsLast"?t[1][0]:t[2][0],p=c==="channelsLast"?t[1][1]:t[2][1],w=c==="channelsLast"?t[2][0]:t[3][0],y=c==="channelsLast"?t[2][1]:t[3][1];l={top:f,bottom:p,left:w,right:y,type:f===0&&p===0&&w===0&&y===0?"VALID":"EXPLICIT"},h=jt((e-o+f+p)/r+1,i),u=jt((n-a+w+y)/s+1,i)}else throw Error(`Unknown padding parameter: ${t}`);return{padInfo:l,outHeight:h,outWidth:u}}function jf(t,e,n,r,s,o,a,i,c,l,h){let u,f,p,w;if(t==="valid"&&(t=0),typeof t=="number"){u={top:t,bottom:t,left:t,right:t,front:t,back:t,type:t===0?"VALID":"NUMBER"};const $=Vf([e,n,r,1],[i,c,l],1,[s,o,a],t,h);f=$[0],p=$[1],w=$[2]}else if(t==="same"){f=Math.ceil(e/s),p=Math.ceil(n/o),w=Math.ceil(r/a);const y=(f-1)*s+i-e,$=(p-1)*o+c-n,k=(w-1)*a+l-r,N=Math.floor(y/2),x=y-N,v=Math.floor($/2),I=$-v,A=Math.floor(k/2),M=k-A;u={top:v,bottom:I,left:A,right:M,front:N,back:x,type:"SAME"}}else throw Error(`Unknown padding parameter: ${t}`);return{padInfo:u,outDepth:f,outHeight:p,outWidth:w}}function jt(t,e){if(!e)return Math.trunc(t);switch(e){case"round":return Math.round(t);case"ceil":return Math.ceil(t);case"floor":return Math.floor(t);default:throw new Error(`Unknown roundingMode ${e}`)}}function Xt(t){const[e,n,r]=Ht(t);return e===1&&n===1&&r===1}function Pe(t,e){return Xt(t)||Xt(e)}function ct(t){return Ht(t).every(e=>e>0)}function Ic(t){if(t==="NHWC")return"channelsLast";if(t==="NCHW")return"channelsFirst";throw new Error(`Unknown dataFormat ${t}`)}function ke(t,e,n){if(n!=null){if(typeof e=="string")throw Error(`Error in ${t}: pad must be an integer when using dimRoundingMode ${n} but got pad ${e}.`);if(typeof e=="number")g(At(e),()=>`Error in ${t}: pad must be an integer when using dimRoundingMode ${n} but got pad ${e}.`);else if(typeof e=="object")e.forEach(r=>{r.forEach(s=>{g(At(s),()=>`Error in ${t}: pad must be an integer when using dimRoundingMode ${n} but got pad ${s}.`)})});else throw Error(`Error in ${t}: Unknown padding parameter: ${e}`)}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xf(t,e){const r={x:d(t,"x","reshape","string_or_numeric")},s={shape:e};return b.runKernel(Ja,r,s)}const E=m({reshape_:Xf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zf(t,e,n,r,s){const o=d(t,"x","avgPool","float32"),a=1;g(Pe(n,a),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`);let i=o,c=!1;o.rank===3&&(c=!0,i=E(o,[1,o.shape[0],o.shape[1],o.shape[2]])),g(i.rank===4,()=>`Error in avgPool: x must be rank 4 but got rank ${i.rank}.`),ke("avgPool",r,s);const l={x:i},h={filterSize:e,strides:n,pad:r,dimRoundingMode:s};let u=b.runKernel(ho,l,h);return u=j(u,o.dtype),c?E(u,[u.shape[1],u.shape[2],u.shape[3]]):u}const Tc=m({avgPool_:Zf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jf(t,e,n,r,s,o="NDHWC"){const a=d(t,"x","avgPool3d","float32");let i=a,c=!1;a.rank===4&&(c=!0,i=E(a,[1,a.shape[0],a.shape[1],a.shape[2],a.shape[3]])),g(i.rank===5,()=>`Error in avgPool3d: x must be rank 5 but got rank ${i.rank}.`),g(o==="NDHWC",()=>`Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of ${o}`),g(typeof n=="number"&&n>0||Array.isArray(n)&&n[0]>0&&n[1]>0&&n[2]>0,()=>`Error in avgPool3d: Stride must be > 0, but got '${n}'`),ke("avgPool3d",r,s);const l={x:i},h={filterSize:e,strides:n,pad:r,dimRoundingMode:s,dataFormat:o};let u=b.runKernel(fo,l,h);return u=j(u,i.dtype),c?E(u,[u.shape[1],u.shape[2],u.shape[3],u.shape[4]]):u}const Yf=m({avgPool3d_:Jf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qf(t,e=0){g(t.length>=1,()=>"Pass at least one tensor to concat");const n=Vt(t,"tensors","concat","string_or_numeric");if(n[0].dtype==="complex64"&&n.forEach(o=>{if(o.dtype!=="complex64")throw new Error(`Cannot concatenate complex64 tensors with a tensor
          with dtype ${o.dtype}. `)}),n.length===1)return st(n[0]);const r=n,s={axis:e};return b.runKernel(ko,r,s)}const de=m({concat_:Qf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ed(t,e,n=!1,r=!1){let s=d(t,"a","matMul"),o=d(e,"b","matMul");[s,o]=Y(s,o);const a={a:s,b:o},i={transposeA:n,transposeB:r};return b.runKernel(po,a,i)}const L=m({matMul_:ed});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function td(t){const n={x:d(t,"x","sigmoid","float32")};return b.runKernel(di,n)}const It=m({sigmoid_:td});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function nd(t,e,n){const r=d(t,"x","slice","string_or_numeric");if(r.rank===0)throw new Error("Slicing scalar is not possible");const s={x:r},o={begin:e,size:n};return b.runKernel(li,s,o)}const Z=m({slice_:nd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rd(t){const n={x:d(t,"x","tanh","float32")};return b.runKernel(Fi,n)}const br=m({tanh_:rd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sd(t,e,n,r,s,o){const a=d(t,"forgetBias","basicLSTMCell"),i=d(e,"lstmKernel","basicLSTMCell"),c=d(n,"lstmBias","basicLSTMCell"),l=d(r,"data","basicLSTMCell"),h=d(s,"c","basicLSTMCell"),u=d(o,"h","basicLSTMCell"),f=de([l,u],1),p=L(f,i),w=F(p,c),y=w.shape[0],$=w.shape[1]/4,k=[y,$],N=Z(w,[0,0],k),x=Z(w,[0,$],k),v=Z(w,[0,$*2],k),I=Z(w,[0,$*3],k),A=F(T(It(N),br(x)),T(h,It(F(a,v)))),M=T(br(A),It(I));return[A,M]}const od=m({basicLSTMCell_:sd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ad(t,e,n){const r=d(t,"x","batchToSpaceND"),s=e.reduce((i,c)=>i*c);g(r.rank>=1+e.length,()=>`input rank is ${r.rank} but should be > than blockShape.length ${e.length}`),g(n.length===e.length,()=>`crops.length is ${n.length} but should be equal to blockShape.length  ${e.length}`),g(r.shape[0]%s===0,()=>`input tensor batch is ${r.shape[0]} but is not divisible by the product of the elements of blockShape ${e.join(" * ")} === ${s}`);const o={x:r},a={blockShape:e,crops:n};return b.runKernel(go,o,a)}const Ac=m({batchToSpaceND_:ad});function id(t){let e;return t.rank===0||t.rank===1?e=E(t,[1,1,1,t.size]):t.rank===2?e=E(t,[1,1,t.shape[0],t.shape[1]]):t.rank===3?e=E(t,[1,t.shape[0],t.shape[1],t.shape[2]]):e=t,e}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cd(t,e,n,r,s,o){o==null&&(o=.001);const a=d(t,"x","batchNorm"),i=d(e,"mean","batchNorm"),c=d(n,"variance","batchNorm");let l;s!=null&&(l=d(s,"scale","batchNorm"));let h;r!=null&&(h=d(r,"offset","batchNorm")),g(i.rank===c.rank,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),g(h==null||i.rank===h.rank,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),g(l==null||i.rank===l.rank,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");const f={x:id(a),scale:l,offset:h,mean:i,variance:c},p={varianceEpsilon:o},w=b.runKernel(ea,f,p);return E(w,a.shape)}const Rn=m({batchNorm_:cd});function ld(t,e,n,r,s,o){const a=d(t,"x","batchNorm"),i=d(e,"mean","batchNorm"),c=d(n,"variance","batchNorm");let l;s!=null&&(l=d(s,"scale","batchNorm"));let h;return r!=null&&(h=d(r,"offset","batchNorm")),g(a.rank===2,()=>`Error in batchNorm2D: x must be rank 2 but got rank ${a.rank}.`),g(i.rank===2||i.rank===1,()=>`Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank ${i.rank}.`),g(c.rank===2||c.rank===1,()=>`Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank ${c.rank}.`),l!=null&&g(l.rank===2||l.rank===1,()=>`Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank ${l.rank}.`),h!=null&&g(h.rank===2||h.rank===1,()=>`Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank ${h.rank}.`),Rn(a,i,c,h,l,o)}const ud=m({batchNorm2d_:ld});function hd(t,e,n,r,s,o){const a=d(t,"x","batchNorm"),i=d(e,"mean","batchNorm"),c=d(n,"variance","batchNorm");let l;s!=null&&(l=d(s,"scale","batchNorm"));let h;return r!=null&&(h=d(r,"offset","batchNorm")),g(a.rank===3,()=>`Error in batchNorm3D: x must be rank 3 but got rank ${a.rank}.`),g(i.rank===3||i.rank===1,()=>`Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank ${i.rank}.`),g(c.rank===3||c.rank===1,()=>`Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank ${c.rank}.`),l!=null&&g(l.rank===3||l.rank===1,()=>`Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank ${l.rank}.`),h!=null&&g(h.rank===3||h.rank===1,()=>`Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank ${h.rank}.`),Rn(a,i,c,h,l,o)}const fd=m({batchNorm3d_:hd});function dd(t,e,n,r,s,o){const a=d(t,"x","batchNorm"),i=d(e,"mean","batchNorm"),c=d(n,"variance","batchNorm");let l;s!=null&&(l=d(s,"scale","batchNorm"));let h;return r!=null&&(h=d(r,"offset","batchNorm")),g(a.rank===4,()=>`Error in batchNorm4D: x must be rank 4 but got rank ${a.rank}.`),g(i.rank===4||i.rank===1,()=>`Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank ${i.rank}.`),g(c.rank===4||c.rank===1,()=>`Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank ${c.rank}.`),l!=null&&g(l.rank===4||l.rank===1,()=>`Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank ${l.rank}.`),h!=null&&g(h.rank===4||h.rank===1,()=>`Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank ${h.rank}.`),Rn(a,i,c,h,l,o)}const pd=m({batchNorm4d_:dd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gd(t,e,n){const r=d(t,"x","bincount"),s=d(e,"weights","bincount");g(r.dtype==="int32",()=>`Error in bincount: input dtype must be int32, but got ${r.dtype}`),g(n>=0,()=>`size must be non-negative, but got ${n}.`),g(s.size===r.size||s.size===0,()=>`Error in bincount: weights must have the same size as input or0-length, but got input shape: ${r.shape}, weights shape: ${s.shape}.`);const o={x:r,weights:s},a={size:n};return b.runKernel(mo,o,a)}const _c=m({bincount_:gd});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function md(t,e){const n=d(t,"x","bitwiseAnd"),r=d(e,"y","bitwiseAnd");if(!Ce(n.shape,r.shape))throw new Error(`BitwiseAnd: Tensors must have the same shape. x: ${n.shape}, y: ${r.shape}`);if(n.dtype!=="int32"||r.dtype!=="int32")throw new Error(`BitwiseAnd: Only supports 'int32' values in tensor, found type of x: ${n.dtype} and type of y: ${r.dtype}`);const s={a:n,b:r};return b.runKernel(bo,s)}const bd=m({bitwiseAnd_:md});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wd(t,e){const n=d(t,"s0","broadcastArgs","int32"),r=d(e,"s1","broadcastArgs","int32");if(n.rank!==1)throw new Error(`broadcastArgs(): first input must be a vector (rank=1). Has rank ${n.rank}`);if(r.rank!==1)throw new Error(`broadcastArgs(): second input must be a vector (rank=1). Has rank ${r.rank}`);const s={s0:n,s1:r};return b.runKernel(wo,s)}const yd=m({broadcastArgs_:wd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $d(t,e){let n=d(t,"broadcastTo","x");const r=n.shape;if(pe(e),e.length<n.rank)throw new Error(`broadcastTo(): shape.length=${e.length} < input.rank=${n.rank}.`);if(e.length>n.rank){const l=n.shape.slice();for(;l.length<e.length;)l.unshift(1);n=E(n,l)}const s=n.shape,o=Array.from(e);for(let l=e.length-1;l>=0;l--)if(s[l]===e[l])o[l]=1;else if(n.shape[l]!==1)throw new Error(`broadcastTo(): [${r}] cannot be broadcast to [${e}].`);if(o.map((l,h)=>l>1?h:-1).filter(l=>l>=0).length===0)return st(n);const i={x:n},c={reps:o};return b.runKernel(Fr,i,c)}const bn=m({broadcastTo_:$d});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ed(t){const n={x:d(t,"x","ceil","float32")};return b.runKernel(yo,n)}const xd=m({ceil_:Ed});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ln(t,e,n){pe(t),n=n||rn(e);const r={shape:t,value:e,dtype:n};return b.runKernel(Zo,{},r)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function kd(t,e,n){const r=d(t,"x","clipByValue");if(g(e<=n,()=>`Error in clip: min (${e}) must be less than or equal to max (${n}).`),e===n)return ln(r.shape,e,r.dtype);const s={x:r},o={clipValueMin:e,clipValueMax:n};return b.runKernel($o,s,o)}const vd=m({clipByValue_:kd});function Sd(t){return de(t,0)}const Id=m({concat1d_:Sd});function Td(t,e){return de(t,e)}const Ad=m({concat2d_:Td});function _d(t,e){return de(t,e)}const Dd=m({concat3d_:_d});function Nd(t,e){return de(t,e)}const Md=m({concat4d_:Nd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fd(t,e,n,r,s="NHWC",o=[1,1],a){const i=d(t,"x","conv2d","float32"),c=d(e,"filter","conv2d","float32");let l=i,h=!1;i.rank===3&&(h=!0,l=E(i,[1,i.shape[0],i.shape[1],i.shape[2]])),g(l.rank===4,()=>`Error in conv2d: input must be rank 4, but got rank ${l.rank}.`),g(c.rank===4,()=>`Error in conv2d: filter must be rank 4, but got rank ${c.rank}.`),ke("conv2d",r,a);const u=s==="NHWC"?l.shape[3]:l.shape[1];g(u===c.shape[2],()=>`Error in conv2d: depth of input (${u}) must match input depth for filter ${c.shape[2]}.`),g(Pe(n,o),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`),g(ct(o),()=>"Error in conv2D: Dilated rates should be larger than 0."),g(ct(n),()=>"Error in conv2D: Strides should be larger than 0.");const f={x:l,filter:c},p={strides:n,pad:r,dataFormat:s,dilations:o,dimRoundingMode:a},w=b.runKernel(vo,f,p);return h?E(w,[w.shape[1],w.shape[2],w.shape[3]]):w}const Bn=m({conv2d_:Fd});function Rd(t,e,n,r,s="NWC",o=1,a){const i=d(t,"x","conv1d"),c=d(e,"filter","conv1d");let l=i,h=!1;i.rank===2&&(h=!0,l=E(i,[1,i.shape[0],i.shape[1]])),g(l.rank===3,()=>`Error in conv1d: input must be rank 3, but got rank ${l.rank}.`),g(c.rank===3,()=>`Error in conv1d: filter must be rank 3, but got rank ${c.rank}.`),ke("conv1d",r,a),g(l.shape[2]===c.shape[1],()=>`Error in conv1d: depth of input (${l.shape[2]}) must match input depth for filter ${c.shape[1]}.`),g(Pe(n,o),()=>`Error in conv1D: Either stride or dilation must be 1. Got stride ${n} and dilation '${o}'`),g(ct(o),()=>"Error in conv1D: Dilated rates should be larger than 0."),g(ct(n),()=>"Error in conv1D: Stride should be larger than 0."),g(s==="NWC",()=>`Error in conv1d: got dataFormat of ${s} but only NWC is currently supported.`);const u=E(c,[1,c.shape[0],c.shape[1],c.shape[2]]),f=E(l,[l.shape[0],1,l.shape[1],l.shape[2]]),$=Bn(f,u,[1,n],r,"NHWC",[1,o],a);return h?E($,[$.shape[2],$.shape[3]]):E($,[$.shape[0],$.shape[2],$.shape[3]])}const Bd=m({conv1d_:Rd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Cd(t,e,n,r,s,o="NHWC",a){g(t.length===e.rank,()=>`Length of inShape (${t.length}) and rank of dy (${e.rank}) must match`);let i=t,c=e,l=!1;e.rank===3&&(l=!0,c=E(e,[1,e.shape[0],e.shape[1],e.shape[2]]),i=[1,t[0],t[1],t[2]]),g(i.length===4,()=>`Error in conv2dDerInput: inShape must be length 4, but got length ${i.length}.`),g(c.rank===4,()=>`Error in conv2dDerInput: dy must be rank 4, but got rank ${c.rank}`),g(n.rank===4,()=>`Error in conv2dDerInput: filter must be rank 4, but got rank ${n.rank}`);const h=o==="NHWC"?i[3]:i[1],u=o==="NHWC"?c.shape[3]:c.shape[1];g(h===n.shape[2],()=>`Error in conv2dDerInput: depth of input (${h}) must match input depth for filter ${n.shape[2]}.`),g(u===n.shape[3],()=>`Error in conv2dDerInput: depth of output (${u}) must match output depth for filter ${n.shape[3]}.`),ke("conv2dDerInput",s,a);const f={dy:c,filter:n},p={strides:r,pad:s,dataFormat:o,dimRoundingMode:a,inputShape:i},w=b.runKernel(Io,f,p);return l?E(w,[w.shape[1],w.shape[2],w.shape[3]]):w}const Dc=m({conv2DBackpropInput_:Cd});function Pd(t,e,n,r,s,o){const a=d(t,"x","conv2dTranspose"),i=d(e,"filter","conv2dTranspose");return Dc(n,a,i,r,s,"NHWC",o)}const Od=m({conv2dTranspose_:Pd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ld(t,e,n,r,s="NDHWC",o=[1,1,1]){const a=d(t,"x","conv3d"),i=d(e,"filter","conv3d");let c=a,l=!1;a.rank===4&&(l=!0,c=E(a,[1,a.shape[0],a.shape[1],a.shape[2],a.shape[3]])),g(c.rank===5,()=>`Error in conv3d: input must be rank 5, but got rank ${c.rank}.`),g(i.rank===5,()=>`Error in conv3d: filter must be rank 5, but got rank ${i.rank}.`),g(c.shape[4]===i.shape[3],()=>`Error in conv3d: depth of input (${c.shape[4]}) must match input depth for filter ${i.shape[3]}.`),g(Pe(n,o),()=>`Error in conv3D: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`),g(s==="NDHWC",()=>`Error in conv3d: got dataFormat of ${s} but only NDHWC is currently supported.`),g(ct(o),()=>"Error in conv3D: Dilated rates should be larger than 0."),g(ct(n),()=>"Error in conv3D: Strides should be larger than 0.");const h={x:c,filter:i},u={strides:n,pad:r,dataFormat:s,dilations:o},f=b.runKernel(To,h,u);return l?E(f,[f.shape[1],f.shape[2],f.shape[3],f.shape[4]]):f}const Wd=m({conv3d_:Ld});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ud(t,e,n,r,s){g(t.length===e.rank,()=>`Length of inShape (${t.length}) and rank of dy (${e.rank}) must match`);let o=t,a=e,i=!1;e.rank===4&&(i=!0,a=E(e,[1,e.shape[0],e.shape[1],e.shape[2],e.shape[3]]),o=[1,t[0],t[1],t[2],t[3]]);const c=o[4],l=a.shape[4];g(o.length===5,()=>`Error in conv3dDerInput: inShape must be length 5, but got length ${o.length}.`),g(a.rank===5,()=>`Error in conv3dDerInput: dy must be rank 5, but got rank ${a.rank}`),g(n.rank===5,()=>`Error in conv3dDerInput: filter must be rank 5, but got rank ${n.rank}`),g(c===n.shape[3],()=>`Error in conv3dDerInput: depth of input (${c}) must match input depth for filter ${n.shape[3]}.`),g(l===n.shape[4],()=>`Error in conv3dDerInput: depth of output (${l}) must match output depth for filter ${n.shape[4]}.`);const h={dy:a,filter:n},u={pad:s,strides:r,inputShape:o},f=b.runKernel(Ao,h,u);return i?E(f,[f.shape[1],f.shape[2],f.shape[3],f.shape[4]]):f}const qd=m({conv3DBackpropInput_:Ud});function Gd(t,e,n,r,s){const o=d(t,"x","conv3dTranspose"),a=d(e,"filter","conv3dTranspose");return qd(n,o,a,r,s)}const zd=m({conv3dTranspose_:Gd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kd(t){const n={x:d(t,"x","cos","float32")};return b.runKernel(_o,n)}const Vd=m({cos_:Kd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hd(t){const n={x:d(t,"x","cosh","float32")};return b.runKernel(Do,n)}const jd=m({cosh_:Hd});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xd(t,e=0,n=!1,r=!1){const o={x:d(t,"x","cumprod")},a={axis:e,exclusive:n,reverse:r};return b.runKernel(No,o,a)}const Zd=m({cumprod_:Xd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jd(t,e=0,n=!1,r=!1){const o={x:d(t,"x","cumsum")},a={axis:e,exclusive:n,reverse:r};return b.runKernel(Mo,o,a)}const Yd=m({cumsum_:Jd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qd(t,e,n,r=!1){const s=d(t,"x","denseBincount"),o=d(e,"weights","denseBincount");g(s.dtype==="int32",()=>`Error in denseBincount: input dtype must be int32, but got ${s.dtype}`),g(s.rank<=2,()=>`Error in denseBincount: input must be at most rank 2, but got rank ${s.rank}.`),g(n>=0,()=>`size must be non-negative, but got ${n}.`),g(o.size===s.size||o.size===0,()=>`Error in denseBincount: weights must have the same shape as x or 0-length, but got x shape: ${s.shape}, weights shape: ${o.shape}.`);const a={x:s,weights:o},i={size:n,binaryOutput:r};return b.runKernel(Ro,a,i)}const ep=m({denseBincount_:Qd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function tp(t,e,n="NHWC"){const r=d(t,"x","depthToSpace","float32"),s=n==="NHWC"?r.shape[1]:r.shape[2],o=n==="NHWC"?r.shape[2]:r.shape[3],a=n==="NHWC"?r.shape[3]:r.shape[1];g(e>1,()=>`blockSize should be > 1 for depthToSpace, but was: ${e}`),g(s*e>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${s} and ${e}  for depthToSpace with input shape
    ${r.shape}`),g(o*e>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${o} and ${e} for depthToSpace with input shape
        ${r.shape}`),g(a%(e*e)===0,()=>`Dimension size must be evenly divisible by ${e*e} but is ${a} for depthToSpace with input shape ${r.shape}`);const i={x:r},c={blockSize:e,dataFormat:n};return b.runKernel(Bo,i,c)}const np=m({depthToSpace_:tp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rp(t,e,n,r,s="NHWC",o=[1,1],a){const i=d(t,"x","depthwiseConv2d","float32"),c=d(e,"filter","depthwiseConv2d","float32");let l=i,h=!1;i.rank===3&&(h=!0,l=E(i,[1,i.shape[0],i.shape[1],i.shape[2]])),g(l.rank===4,()=>`Error in depthwiseConv2d: input must be rank 4, but got rank ${l.rank}.`),g(c.rank===4,()=>`Error in depthwiseConv2d: filter must be rank 4, but got rank ${c.rank}.`);const u=s==="NHWC"?l.shape[3]:l.shape[1];g(u===c.shape[2],()=>`Error in depthwiseConv2d: number of input channels (${u}) must match the inChannels dimension in filter ${c.shape[2]}.`),ke("depthwiseConv2d",r,a);const f={x:l,filter:c},p={strides:n,pad:r,dataFormat:s,dilations:o,dimRoundingMode:a},w=b.runKernel(Co,f,p);return h?E(w,[w.shape[1],w.shape[2],w.shape[3]]):w}const Wr=m({depthwiseConv2d_:rp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sp(t){const n={x:d(t,"x","diag")};return b.runKernel(Lo,n)}const op=m({diag_:sp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ap(t,e,n,r,s=[1,1],o="NHWC"){const a=d(t,"x","dilation2d"),i=d(e,"filter","dilation2d");g(a.rank===3||a.rank===4,()=>`Error in dilation2d: input must be rank 3 or 4, but got rank ${a.rank}.`),g(i.rank===3,()=>`Error in dilation2d: filter must be rank 3, but got rank ${i.rank}.`),g(o==="NHWC",()=>`Error in dilation2d: Only NHWC is currently supported, but got dataFormat of ${o}`);let c=a,l=!1;a.rank===3&&(c=E(a,[1,a.shape[0],a.shape[1],a.shape[2]]),l=!0),g(c.shape[3]===i.shape[2],()=>`Error in dilation2d:  input and filter must have the same depth: ${c.shape[3]} vs ${i.shape[2]}`);const h={x:c,filter:i},u={strides:n,pad:r,dilations:s},f=b.runKernel(Wo,h,u);return l?E(f,[f.shape[1],f.shape[2],f.shape[3]]):f}const ip=m({dilation2d_:ap});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Nc(t,e){const n=t.length,r=[];for(let s=0;s<n;s++){const o=n-1-s,a=t[o]||1;(e[e.length-1-s]||1)>1&&a===1&&r.unshift(o)}return r}function Ur(t,e){const n=[];for(let r=0;r<e.length;r++){const s=t[t.length-r-1],o=e.length-r-1,a=e[o];(s==null||s===1&&a>1)&&n.unshift(o)}return n}function te(t,e){const n=Math.max(t.length,e.length),r=new Array(n);for(let s=0;s<n;s++){let o=t[t.length-s-1];o==null&&(o=1);let a=e[e.length-s-1];if(a==null&&(a=1),o===1)r[n-s-1]=a;else if(a===1)r[n-s-1]=o;else if(o!==a){const i=`Operands could not be broadcast together with shapes ${t} and ${e}.`;throw Error(i)}else r[n-s-1]=o}return r}var cp=Object.freeze({__proto__:null,assertAndGetBroadcastShape:te,getBroadcastDims:Nc,getReductionAxes:Ur});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function lp(t,e){let n=d(t,"a","equal","string_or_numeric"),r=d(e,"b","equal","string_or_numeric");[n,r]=Y(n,r),te(n.shape,r.shape);const s={a:n,b:r};return b.runKernel(Ko,s)}const Mc=m({equal_:lp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function up(t,e,n){const r=d(e,"a","where"),s=d(n,"b","where"),o=d(t,"condition","where","bool"),a=te(te(o.shape,r.shape),s.shape),i=bn(o,a),c=bn(r,a),l=bn(s,a),h={condition:i,t:c,e:l};return b.runKernel(ii,h)}const Ke=m({where_:up});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hp(t){const n={x:d(t,"x","zerosLike")};return b.runKernel(Li,n)}const be=m({zerosLike_:hp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fp(t,e){let n=d(t,"a","div"),r=d(e,"b","div");[n,r]=Y(n,r);const s=K(n,r),o=be(s),a=Mc(r,o);return Ke(a,o,s)}const dp=m({divNoNan_:fp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pp(t,e){const n=d(t,"t1","dot"),r=d(e,"t2","dot");g((n.rank===1||n.rank===2)&&(r.rank===1||r.rank===2),()=>`Error in dot: inputs must all be rank 1 or 2, but got ranks ${n.rank} and ${r.rank}.`);const s=n.rank===1?n.size:n.shape[1],o=r.rank===1?r.size:r.shape[0];if(g(s===o,()=>`Error in dot: inner dimensions of inputs must match, but got ${s} and ${o}.`),n.rank===1&&r.rank===1){const a=E(n,[1,-1]),i=E(r,[-1,1]),c=L(a,i);return E(c,[])}else if(n.rank===1&&r.rank===2){const a=E(n,[1,-1]),i=E(r,[r.shape[0],r.shape[1]]),c=L(a,i);return E(c,[c.size])}else if(n.rank===2&&r.rank===1){const a=E(r,[-1,1]),i=L(n,a);return E(i,[i.size])}else{const a=E(r,[r.shape[0],r.shape[1]]);return L(n,a)}}const gp=m({dot_:pp});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mp(t,...e){const n=e.map((s,o)=>d(s,`tensors${o}`,"einsum")),r={equation:t};return b.runKernel(qo,n,r)}const $t=m({einsum_:mp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bp(t){const n={x:d(t,"x","elu","float32")};return b.runKernel(Go,n)}const Fc=m({elu_:bp});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wp(t,e){const n=d(t,"x","ensureShape","string_or_numeric");if(!Us(n.shape,e))throw new Error(`EnsureShape: Shape of tensor ${n.shape} is not compatible with expected shape ${e}`);return t}const yp=m({ensureShape_:wp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $p(t){let e=d(t,"x","erf");g(e.dtype==="int32"||e.dtype==="float32",()=>"Input dtype must be `int32` or `float32`."),e.dtype==="int32"&&(e=j(e,"float32"));const n={x:e};return b.runKernel(zo,n)}const Ep=m({erf_:$p});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qr(t,e){for(let n=0;n<t.length;++n)if(t[t.length-n-1]!==e-1-n)return!1;return!0}function Rc(t,e,n){const r=t.length+e.length,s=[];let o=0,a=0;for(let i=0;i<r;i++)n.indexOf(i)===-1?s.push(t[o++]):s.push(e[a++]);return s}function xp(t,e){const n=[],r=t.length;for(let o=0;o<r;o++)e.indexOf(o)===-1&&n.push(t[o]);const s=e.map(o=>t[o]);return[n,s]}function un(t,e){const n=e.map(r=>1);return Rc(t,n,e)}function kp(t,e,n){g(qr(e,n),()=>`${t} supports only inner-most axes for now. Got axes ${e} and rank-${n} input.`)}function vp(t,e){if(qr(t,e))return null;const n=[];for(let r=0;r<e;++r)t.indexOf(r)===-1&&n.push(r);return t.forEach(r=>n.push(r)),n}function Sp(t){return t.map((e,n)=>[n,e]).sort((e,n)=>e[1]-n[1]).map(e=>e[0])}function Ip(t,e){const n=[];for(let r=e-t;r<e;++r)n.push(r);return n}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Tp(t,e=null,n=!1){const s={x:d(t,"x","max")},o={reductionIndices:e,keepDims:n};return b.runKernel($a,s,o)}const Tt=m({max_:Tp});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ap(t,e=null,n=!1){const s={x:d(t,"x","min")},o={axis:e,keepDims:n};return b.runKernel(Ia,s,o)}const wr=m({min_:Ap});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _p(t,e){let n=d(t,"base","pow"),r=d(e,"exp","pow");[n,r]=Y(n,r);const s={a:n,b:r};return b.runKernel(Ua,s)}const Zt=m({pow_:_p});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function q(t,e){if((se(t)&&e!=="string"||Array.isArray(t))&&e!=="complex64")throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if(e==="string"&&se(t)&&!(t instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return Ze(t,[],[],e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Dp(t){const n={x:d(t,"x","sqrt","float32")};return b.runKernel(gi,n)}const Be=m({sqrt_:Dp});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Np(t){const e=d(t,"x","square"),n={};return b.runKernel("Square",{x:e},n)}const Se=m({square_:Np});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Mp(t,e=null,n=!1){let r=d(t,"x","sum");r.dtype==="bool"&&(r=j(r,"int32"));const s={x:r},o={axis:e,keepDims:n};return b.runKernel(mi,s,o)}const z=m({sum_:Mp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fp(t,e="euclidean",n=null,r=!1){t=d(t,"x","norm");const s=Bc(t,e,n);let o=s.shape;if(r){const a=nn(n,t.shape);o=un(s.shape,a)}return E(s,o)}function Bc(t,e,n=null){if(t.rank===0)return me(t);if(t.rank!==1&&n===null)return Bc(E(t,[-1]),e,n);if(t.rank===1||typeof n=="number"||Array.isArray(n)&&n.length===1){if(e===1)return z(me(t),n);if(e===1/0)return Tt(me(t),n);if(e===-1/0)return wr(me(t),n);if(e==="euclidean"||e===2)return Be(z(Zt(me(t),q(2,"int32")),n));throw new Error(`Error in norm: invalid ord value: ${e}`)}if(Array.isArray(n)&&n.length===2){if(e===1)return Tt(z(me(t),n[0]),n[1]-1);if(e===1/0)return Tt(z(me(t),n[1]),n[0]);if(e===-1/0)return wr(z(me(t),n[1]),n[0]);if(e==="fro"||e==="euclidean")return Be(z(Se(t),n));throw new Error(`Error in norm: invalid ord value: ${e}`)}throw new Error(`Error in norm: invalid axis: ${n}`)}const Cn=m({norm_:Fp});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rp(t,e=null,n=!1){return Cn(t,"euclidean",e,n)}const Bp=m({euclideanNorm_:Rp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Cp(t){const n={x:d(t,"x","exp")};return b.runKernel(Vo,n)}const lt=m({exp_:Cp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pp(t,e=0){const n=d(t,"x","expandDims","string_or_numeric");g(e<=n.rank,()=>"Axis must be <= rank of the tensor");const r={input:n},s={dim:e};return b.runKernel(Ho,r,s)}const Le=m({expandDims_:Pp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Op(t){const n={x:d(t,"x","expm1")};return b.runKernel(jo,n)}const Lp=m({expm1_:Op});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Wp(t,e){const n=d(t,"x","tile","string_or_numeric");g(n.rank===e.length,()=>`Error in transpose: rank of input ${n.rank} must match length of reps ${e}.`);const r={x:n},s={reps:e};return b.runKernel(Fr,r,s)}const Lt=m({tile_:Wp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Up(t,e,n,r="float32"){e==null&&(e=t);const s=Re([t,e],r),o=t<=e?t:e;for(let i=0;i<o;++i)s.set(1,i,i);const a=E(s.toTensor(),[t,e]);if(n==null)return a;if(n.length===1)return Lt(Le(a,0),[n[0],1,1]);if(n.length===2)return Lt(Le(Le(a,0),0),[n[0],n[1],1,1]);if(n.length===3)return Lt(Le(Le(Le(a,0),0),0),[n[0],n[1],n[2],1,1]);throw new Error(`eye() currently supports only 1D and 2D batchShapes, but received ${n.length}D.`)}const Cc=m({eye_:Up});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qp(t){const n={x:d(t,"x","floor","float32")};return b.runKernel(Yo,n)}const Pc=m({floor_:qp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gp(t,e,n=0,r=0){const s=d(t,"x","gather"),o=d(e,"indices","gather","int32"),a={x:s,indices:o},i={axis:n,batchDims:r};return b.runKernel(ta,a,i)}const Oc=m({gather_:Gp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zp(t,e){let n=d(t,"a","greater","string_or_numeric"),r=d(e,"b","greater","string_or_numeric");[n,r]=Y(n,r),te(n.shape,r.shape);const s={a:n,b:r};return b.runKernel(ra,s)}const Pn=m({greater_:zp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kp(t,e){let n=d(t,"a","greaterEqual","string_or_numeric"),r=d(e,"b","greaterEqual","string_or_numeric");[n,r]=Y(n,r),te(n.shape,r.shape);const s={a:n,b:r};return b.runKernel(sa,s)}const Lc=m({greaterEqual_:Kp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vp(t){const n={input:d(t,"input","imag")};return b.runKernel(aa,n)}const On=m({imag_:Vp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hp(t){const n={x:d(t,"x","isFinite")};return b.runKernel(ia,n)}const jp=m({isFinite_:Hp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xp(t){const n={x:d(t,"x","isInf")};return b.runKernel(ca,n)}const Zp=m({isInf_:Xp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jp(t){const n={x:d(t,"x","isNaN")};return b.runKernel(la,n)}const Yp=m({isNaN_:Jp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qp(t,e=.2){const r={x:d(t,"x","leakyRelu")},s={alpha:e};return b.runKernel(ua,r,s)}const Wc=m({leakyRelu_:Qp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function eg(t,e){let n=d(t,"a","less","string_or_numeric"),r=d(e,"b","less","string_or_numeric");[n,r]=Y(n,r),te(n.shape,r.shape);const s={a:n,b:r};return b.runKernel(ha,s)}const yr=m({less_:eg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function tg(t,e){let n=d(t,"a","lessEqual","string_or_numeric"),r=d(e,"b","lessEqual","string_or_numeric");[n,r]=Y(n,r),te(n.shape,r.shape);const s={a:n,b:r};return b.runKernel(fa,s)}const Gr=m({lessEqual_:tg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ng(t,e,n){if(n<=0)throw new Error("The number of values should be positive.");const r={start:t,stop:e,num:n};return b.runKernel(da,{},r)}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rg(t,e=5,n=1,r=1,s=.5){const o=d(t,"x","localResponseNormalization");g(o.rank===4||o.rank===3,()=>`Error in localResponseNormalization: x must be rank 3 or 4 but got
               rank ${o.rank}.`),g(At(e),()=>`Error in localResponseNormalization: depthRadius must be an integer but got depthRadius ${e}.`);let a=o,i=!1;o.rank===3&&(i=!0,a=E(o,[1,o.shape[0],o.shape[1],o.shape[2]]));const c={x:a},l={depthRadius:e,bias:n,alpha:r,beta:s},h=b.runKernel(ya,c,l);return i?E(h,[h.shape[1],h.shape[2],h.shape[3]]):h}const sg=m({localResponseNormalization_:rg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function og(t){const n={x:d(t,"x","log","float32")};return b.runKernel(pa,n)}const Jt=m({log_:og});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ag(t){const n={x:d(t,"x","log1p")};return b.runKernel(ga,n)}const Uc=m({log1p_:ag});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ig(t){return g(Ve(t),()=>"The f passed in grad(f) must be a function"),(e,n)=>{const r=d(e,"x","tf.grad","string_or_numeric"),s=n!=null?d(n,"dy","tf.grad"):null;return b.tidy(()=>{const{value:o,grads:a}=b.gradients(()=>t(r),[r],s);return s!=null&&ce(o.shape,s.shape,"The shape of dy passed in grad(f)(x, dy) must match the shape returned by f(x)"),Ln(a),a[0]})}}function cg(t){return g(Ve(t),()=>"The f passed in grads(f) must be a function"),(e,n)=>{g(Array.isArray(e),()=>"The args passed in grads(f)(args) must be an array of `Tensor`s or `TensorLike`s");const r=Vt(e,"args","tf.grads","string_or_numeric"),s=n!=null?d(n,"dy","tf.grads"):null;return b.tidy(()=>{const{value:o,grads:a}=b.gradients(()=>t(...r),r,s);return s!=null&&ce(o.shape,s.shape,"The shape of dy passed in grads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),Ln(a),a})}}function lg(t){return g(Ve(t),()=>"The f passed in valueAndGrad(f) must be a function"),(e,n)=>{g(e instanceof Q,()=>"The x passed in valueAndGrad(f)(x) must be a tensor"),g(n==null||n instanceof Q,()=>"The dy passed in valueAndGrad(f)(x, dy) must be a tensor");const{grads:r,value:s}=b.gradients(()=>t(e),[e],n);return Ln(r),{grad:r[0],value:s}}}function ug(t){return g(Ve(t),()=>"The f passed in valueAndGrads(f) must be a function"),(e,n)=>{g(Array.isArray(e)&&e.every(s=>s instanceof Q),()=>"The args passed in valueAndGrads(f)(args) must be array of tensors"),g(n==null||n instanceof Q,()=>"The dy passed in valueAndGrads(f)(args, dy) must be a tensor");const r=b.gradients(()=>t(...e),e,n);return n!=null&&ce(r.value.shape,n.shape,"The shape of dy passed in valueAndGrads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),Ln(r.grads),r}}function qc(t,e){g(Ve(t),()=>"The f passed in variableGrads(f) must be a function"),g(e==null||Array.isArray(e)&&e.every(l=>l instanceof Kt),()=>"The varList passed in variableGrads(f, varList) must be an array of variables");const n=e!=null;if(!n){e=[];for(const l in b.registeredVariables)e.push(b.registeredVariables[l])}const r=n?e.filter(l=>!l.trainable):null,s=e.length;e=e.filter(l=>l.trainable),g(e.length>0,()=>`variableGrads() expects at least one of the input variables to be trainable, but none of the ${s} variables is trainable.`);const o=!0,{value:a,grads:i}=b.gradients(t,e,null,o);g(i.some(l=>l!=null),()=>"Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize()."),g(a.rank===0,()=>`The f passed in variableGrads(f) must return a scalar, but it returned a rank-${a.rank} tensor`);const c={};return e.forEach((l,h)=>{i[h]!=null&&(c[l.name]=i[h])}),r?.forEach(l=>c[l.name]=null),{value:a,grads:c}}function Ne(t){return b.customGrad(t)}function Ln(t){if(t.filter(n=>n==null).length>0)throw new Error(`Cannot compute gradient of y=f(x) with respect to x. Make sure that
    the f you passed encloses all operations that lead from x to y.`)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hg(t){const n={x:d(t,"x","neg")};return b.runKernel(Ma,n)}const _e=m({neg_:hg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fg(t){const n={x:d(t,"x","softplus")};return b.runKernel(pi,n)}const Gc=m({softplus_:fg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function dg(t){const e=d(t,"x","logSigmoid");return Ne(r=>({value:_e(Gc(_e(r))),gradFunc:a=>T(a,It(_e(r)))}))(e)}const pg=m({logSigmoid_:dg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gg(t,e){let n=d(t,"a","sub"),r=d(e,"b","sub");[n,r]=Y(n,r);const s={a:n,b:r};return b.runKernel(Ni,s)}const P=m({sub_:gg});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mg(t,e=-1){const n=d(t,"logits","logSoftmax");if(e===-1&&(e=n.rank-1),e!==n.rank-1)throw Error(`Log Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and axis was ${e}`);return Ne((s,o)=>{const i=Tt(s,e,!0),c=P(s,i),l=P(j(c,"float32"),Jt(z(lt(c),e,!0)));return o([l]),{value:l,gradFunc:(u,f)=>{const[p]=f,w=!0,y=lt(p);return P(u,T(z(u,e,w),y))}}})(n)}const bg=m({logSoftmax_:mg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wg(t,e=null,n=!1){const r=d(t,"x","logSumExp"),s=nn(e,r.shape),o=Tt(r,s,!0),a=P(r,o),i=lt(a),c=z(i,s),l=Jt(c),h=F(E(o,l.shape),l);if(n){const u=un(h.shape,s);return E(h,u)}return h}const zc=m({logSumExp_:wg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function yg(t,e){const n=d(t,"a","logicalAnd","bool"),r=d(e,"b","logicalAnd","bool");te(n.shape,r.shape);const s={a:n,b:r};return b.runKernel(ma,s)}const Sn=m({logicalAnd_:yg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $g(t){const n={x:d(t,"x","logicalNot","bool")};return b.runKernel(ba,n)}const Kc=m({logicalNot_:$g});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Eg(t,e){const n=d(t,"a","logicalOr","bool"),r=d(e,"b","logicalOr","bool");te(n.shape,r.shape);const s={a:n,b:r};return b.runKernel(wa,s)}const Vc=m({logicalOr_:Eg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xg(t,e){const n=d(t,"a","logicalXor","bool"),r=d(e,"b","logicalXor","bool");return te(n.shape,r.shape),Sn(Vc(t,e),Kc(Sn(t,e)))}const kg=m({logicalXor_:xg});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const dn=2147483648;function vg(t,e,n="left"){const r=d(t,"sortedSequence","searchSorted"),s=d(e,"values","searchSorted"),o=r.shape[r.shape.length-1],a=s.shape[s.shape.length-1],i=E(r,[-1,o]),c=E(s,[-1,a]);if(i.rank<2)throw new Error("Sorted input argument must be at least 2-dimensional");if(i.shape[0]!==c.shape[0])throw new Error("Leading dimension of 'sortedSequence' and 'values' must match.");if(W(c.shape)>=dn)throw new Error(`values tensor size must less than ${dn}`);if(i.shape[1]>=dn)throw new Error(`trailing dim_size must less than ${dn} for int32 output type, was ${i.shape[1]}`);const l={sortedSequence:i,values:c},h={side:n};return b.runKernel(ai,l,h)}const zr=m({searchSorted_:vg});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sg(t,e){return zr(t,e,"left")}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ig(t,e,n,r,s){const o=d(t,"x","maxPool"),a=1;let i=o,c=!1;o.rank===3&&(c=!0,i=E(o,[1,o.shape[0],o.shape[1],o.shape[2]])),g(i.rank===4,()=>`Error in maxPool: input must be rank 4 but got rank ${i.rank}.`),g(Pe(n,a),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`),ke("maxPool",r,s);const l={x:i},h={filterSize:e,strides:n,pad:r,dimRoundingMode:s},u=b.runKernel(xa,l,h);return c?E(u,[u.shape[1],u.shape[2],u.shape[3]]):u}const Hc=m({maxPool_:Ig});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Tg(t,e=[1,1,1],n,r,s,o="NDHWC"){const a=d(t,"x","maxPool3d");let i=a,c=!1;a.rank===4&&(c=!0,i=E(a,[1,a.shape[0],a.shape[1],a.shape[2],a.shape[3]])),g(i.rank===5,()=>`Error in maxPool3d: x must be rank 5 but got rank ${i.rank}.`),g(o==="NDHWC",()=>`Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of ${o}`),ke("maxPool3d",r,s);const l={x:i},h={filterSize:e,strides:n,pad:r,dimRoundingMode:s,dataFormat:o},u=b.runKernel(ka,l,h);return c?E(u,[u.shape[1],u.shape[2],u.shape[3],u.shape[4]]):u}const Ag=m({maxPool3d_:Tg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _g(t,e,n,r,s=!1){const a={x:d(t,"x","maxPoolWithArgmax")},i={filterSize:e,strides:n,pad:r,includeBatchInIndex:s},c=b.runKernel(va,a,i);return{result:c[0],indexes:c[1]}}const Dg=m({maxPoolWithArgmax_:_g});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ng(t,e){let n=d(t,"a","maximum"),r=d(e,"b","maximum");[n,r]=Y(n,r),n.dtype==="bool"&&(n=j(n,"int32"),r=j(r,"int32")),te(n.shape,r.shape);const s={a:n,b:r};return b.runKernel(Ea,s)}const jc=m({maximum_:Ng});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Mg(t,e=null,n=!1){const s={x:d(t,"x","mean")},o={axis:e,keepDims:n};return b.runKernel(Sa,s,o)}const In=m({mean_:Mg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Mt(t,e="float32"){if(pe(t),e==="complex64"){const r=Mt(t,"float32"),s=Mt(t,"float32");return je(r,s)}const n=Dn(W(t),e);return b.makeTensor(n,t,e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rt(t,e="float32"){if(pe(t),e==="complex64"){const r=rt(t,"float32"),s=Mt(t,"float32");return je(r,s)}const n=Ir(W(t),e);return b.makeTensor(n,t,e)}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fg(t,e,{indexing:n="xy"}={}){if(n!=="xy"&&n!=="ij")throw new TypeError(`${n} is not a valid third argument to meshgrid`);if(t===void 0)return[];let r=d(t,"x","meshgrid",t instanceof Q?t.dtype:"float32");if(e===void 0)return[r];let s=d(e,"y","meshgrid",e instanceof Q?e.dtype:"float32");const o=W(r.shape),a=W(s.shape);return n==="xy"?(r=E(r,[1,-1]),s=E(s,[-1,1]),[L(rt([a,1],r.dtype),r),L(s,rt([1,o],s.dtype))]):(r=E(r,[-1,1]),s=E(s,[1,-1]),[L(r,rt([1,a],r.dtype)),L(rt([o,1],s.dtype),s)])}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rg(t,e){let n=d(t,"a","minimum"),r=d(e,"b","minimum");[n,r]=Y(n,r),n.dtype==="bool"&&(n=j(n,"int32"),r=j(r,"int32")),te(n.shape,r.shape);const s={a:n,b:r};return b.runKernel(Ta,s)}const Tn=m({minimum_:Rg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Bg(t,e,n){g(n==="reflect"||n==="symmetric",()=>`Invalid mode. Mode must be either reflect or symmetric. Got ${n}.`);const r=d(t,"x","mirrorPad");if(r.rank===0)throw new Error("mirrorPad(scalar) is not defined. Pass non-scalar to mirrorPad");g(e.length===r.rank,()=>`Padding doesn't match input. Must be ${r.rank}. Got ${e.length}.`);const s=n==="reflect"?1:0;for(let i=0;i<r.rank;i++)g(e[i].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),g(e[i][0]>=0&&e[i][0]<=r.shape[i]-s&&e[i][1]>=0&&e[i][1]<=r.shape[i]-s,()=>`Padding in dimension ${i} cannot be greater than or equal to ${r.shape[i]-s} or less than 0 for input of shape ${r.shape}`);const o={paddings:e,mode:n},a={x:r};return b.runKernel(Aa,a,o)}const Cg=m({mirrorPad_:Bg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pg(t,e){let n=d(t,"a","mod"),r=d(e,"b","mod");[n,r]=Y(n,r);const s={a:n,b:r};return b.runKernel(_a,s)}const Og=m({mod_:Pg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lg(t,e=null,n=!1){t=d(t,"x","moments");const r=nn(e,t.shape),s=In(t,r,n);let o=s.shape;n||(o=un(s.shape,r));const a=Se(P(j(t,"float32"),E(s,o))),i=In(a,r,n);return{mean:s,variance:i}}const Wg=m({moments_:Lg});function Ug(t,e,n,r){const s=d(e,"data","multiRNNCell"),o=Vt(n,"c","multiRNNCell"),a=Vt(r,"h","multiRNNCell");let i=s;const c=[];for(let u=0;u<t.length;u++){const f=t[u](i,o[u],a[u]);c.push(f[0]),c.push(f[1]),i=f[1]}const l=[],h=[];for(let u=0;u<c.length;u+=2)l.push(c[u]),h.push(c[u+1]);return[l,h]}const qg=m({multiRNNCell_:Ug});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gg(t,e,n,r=!1){const s=d(t,"logits","multinomial"),o=s.size,a=s.rank;if(o<2)throw new Error(`Error in multinomial: you need at least 2 outcomes, but got ${o}.`);if(a>2)throw new Error(`Rank of probabilities must be 1 or 2, but is ${a}`);n=n||Math.random();const c={logits:a===1?E(s,[1,-1]):s},l={numSamples:e,seed:n,normalized:r},h=b.runKernel(Da,c,l);return a===1?E(h,[h.size]):h}const zg=m({multinomial_:Gg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kg(t,e){let n=d(t,"a","notEqual","string_or_numeric"),r=d(e,"b","notEqual","string_or_numeric");[n,r]=Y(n,r),te(n.shape,r.shape);const s={a:n,b:r};return b.runKernel(Fa,s)}const Xc=m({notEqual_:Kg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vg(t,e,n=1,r=0,s="int32"){if(e<2)throw new Error(`Error in oneHot: depth must be >=2, but it is ${e}`);const a={indices:d(t,"indices","oneHot","int32")},i={dtype:s,depth:e,onValue:n,offValue:r};return b.runKernel(Oa,a,i)}const $r=m({oneHot_:Vg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hg(t){const n={x:d(t,"x","onesLike")};return b.runKernel(Pa,n)}const jg=m({onesLike_:Hg});function Xg(t,e){const n=d(t,"v1","outerProduct"),r=d(e,"v2","outerProduct");g(n.rank===1&&r.rank===1,()=>`Error in outerProduct: inputs must be rank 1, but got ranks ${n.rank} and ${r.rank}.`);const s=E(n,[-1,1]),o=E(r,[1,-1]);return L(s,o)}const Zg=m({outerProduct_:Xg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jg(t,e,n=0){const r=d(t,"x","pad");if(r.rank===0)throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");const s={paddings:e,constantValue:n},o={x:r};return b.runKernel(Wa,o,s)}const hn=m({pad_:Jg});function Yg(t,e,n=0){return g(e.length===2,()=>"Invalid number of paddings. Must be length of 2."),hn(t,[e],n)}const Qg=m({pad1d_:Yg});function em(t,e,n=0){return g(e.length===2&&e[0].length===2&&e[1].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),hn(t,e,n)}const tm=m({pad2d_:em});function nm(t,e,n=0){return g(e.length===3&&e[0].length===2&&e[1].length===2&&e[2].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),hn(t,e,n)}const rm=m({pad3d_:nm});function sm(t,e,n=0){return g(e.length===4&&e[0].length===2&&e[1].length===2&&e[2].length===2&&e[3].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),hn(t,e,n)}const om=m({pad4d_:sm});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function am(t,e,n){const r=d(t,"x","spaceToBatchND");g(r.rank>=1+e.length,()=>`input rank ${r.rank} should be > than [blockShape] ${e.length}`),g(n.length===e.length,()=>`paddings.shape[0] ${n.length} must be equal to [blockShape] ${e.length}`),g(r.shape.reduce((a,i,c)=>c>0&&c<=e.length?a&&(i+n[c-1][0]+n[c-1][1])%e[c-1]===0:a,!0),()=>`input spatial dimensions ${r.shape.slice(1)} with paddings ${n.toString()} must be divisible by blockShapes ${e.toString()}`);const s={x:r},o={blockShape:e,paddings:n};return b.runKernel(bi,s,o)}const Zc=m({spaceToBatchND_:am});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function im(t,e,n,r,s,o,a){s==null&&(s=[1,1]),o==null&&(o=1),r===0&&(r="valid");const i=d(t,"x","maxPool");let c=i,l=!1;i.rank===3&&(l=!0,c=E(i,[1,i.shape[0],i.shape[1],i.shape[2]])),g(Pe(o,s),()=>`Error in pool: Either strides or dilations must be 1. Got strides ${o} and dilations '${s}'`);const h=vc(c.shape,e,o,s,r),u=[h.dilationHeight,h.dilationWidth];let f;r==="same"?f=lm([h.filterHeight,h.filterWidth],u):f=[[0,0],[0,0]];const p=u[0]===1&&u[1]===1,[w,y]=cm([h.inHeight,h.inWidth],u,f),$=p?r:"valid",k=p?c:Zc(c,u,w),x=(n==="avg"?()=>Tc(k,e,o,$,a):()=>Hc(k,e,o,$,a))(),v=p?x:Ac(x,u,y);return l?E(v,[v.shape[1],v.shape[2],v.shape[3]]):v}function cm(t,e,n){const r=n.map(h=>h[0]),s=n.map(h=>h[1]),o=t.concat(r,s),a=e.map((h,u)=>(h-o[u]%h)%h),i=s.map((h,u)=>h+a[u]),c=e.map((h,u)=>[r[u],i[u]]),l=e.map((h,u)=>[0,a[u]]);return[c,l]}function lm(t,e){const r=t.map((a,i)=>a+(a-1)*(e[i]-1)).map(a=>a-1),s=r.map(a=>Math.floor(a/2)),o=r.map((a,i)=>a-s[i]);return r.map((a,i)=>[s[i],o[i]])}const um=m({pool_:im});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hm(t,e){const n=d(t,"x","prelu"),r=d(e,"alpha","prelu"),s={x:n,alpha:r};return b.runKernel(qa,s)}const Jc=m({prelu_:hm});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fm(t,e=null,n=!1){let r=d(t,"x","prod");r.dtype==="bool"&&(r=j(r,"int32"));const s={x:r},o={axis:e,keepDims:n};return b.runKernel(Ga,s,o)}const dm=m({prod_:fm});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pm(t,e,n,r){const s=t.map((h,u)=>d(h,`tensors${u}`,"raggedGather","int32")),o=d(e,"paramsDenseValues","raggedGather"),a=d(n,"indices","raggedGather","int32"),i={paramsNestedSplits:s,paramsDenseValues:o,indices:a},c={outputRaggedRank:r},l=b.runKernel(za,i,c);return{outputNestedSplits:l.slice(0,l.length-1),outputDenseValues:l[l.length-1]}}const gm=m({raggedGather_:pm});/**
 * @license
 * Copyright 2022 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mm(t,e,n){const r=d(t,"starts","raggedRange"),s=d(e,"limits","raggedRange",r.dtype),o=d(n,"deltas","raggedRange",r.dtype),a={starts:r,limits:s,deltas:o},i=b.runKernel(Ka,a);return{rtNestedSplits:i[0],rtDenseValues:i[1]}}const bm=m({raggedRange_:mm});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wm(t,e,n,r,s){const o=d(t,"shape","raggedTensorToTensor","int32"),a=d(e,"values","raggedTensorToTensor"),i=d(n,"defaultValue","raggedTensorToTensor",a.dtype),c=r.map((u,f)=>d(u,`tensors${f}`,"raggedTensorToTensor","int32")),l={shape:o,values:a,defaultValue:i,rowPartitionTensors:c},h={rowPartitionTypes:s};return b.runKernel(Va,l,h)}const ym=m({raggedTensorToTensor_:wm});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $m(t,e,n){pe(t);const r=W(t);let s=null;if(n==null||n==="float32")s=new Float32Array(r);else if(n==="int32")s=new Int32Array(r);else if(n==="bool")s=new Uint8Array(r);else throw new Error(`Unknown data type ${n}`);for(let o=0;o<r;o++)s[o]=e();return b.makeTensor(s,t,n)}const Em=m({rand_:$m});var Kr={exports:{}};Kr.exports;(function(t){(function(e,n,r){function s(c){var l=this,h=i();l.next=function(){var u=2091639*l.s0+l.c*23283064365386963e-26;return l.s0=l.s1,l.s1=l.s2,l.s2=u-(l.c=u|0)},l.c=1,l.s0=h(" "),l.s1=h(" "),l.s2=h(" "),l.s0-=h(c),l.s0<0&&(l.s0+=1),l.s1-=h(c),l.s1<0&&(l.s1+=1),l.s2-=h(c),l.s2<0&&(l.s2+=1),h=null}function o(c,l){return l.c=c.c,l.s0=c.s0,l.s1=c.s1,l.s2=c.s2,l}function a(c,l){var h=new s(c),u=l&&l.state,f=h.next;return f.int32=function(){return h.next()*4294967296|0},f.double=function(){return f()+(f()*2097152|0)*11102230246251565e-32},f.quick=f,u&&(typeof u=="object"&&o(u,h),f.state=function(){return o(h,{})}),f}function i(){var c=4022871197,l=function(h){h=String(h);for(var u=0;u<h.length;u++){c+=h.charCodeAt(u);var f=.02519603282416938*c;c=f>>>0,f-=c,f*=c,c=f>>>0,f-=c,c+=f*4294967296}return(c>>>0)*23283064365386963e-26};return l}n&&n.exports?n.exports=a:this.alea=a})(dt,t)})(Kr);var xm=Kr.exports,Vr={exports:{}};Vr.exports;(function(t){(function(e,n,r){function s(i){var c=this,l="";c.x=0,c.y=0,c.z=0,c.w=0,c.next=function(){var u=c.x^c.x<<11;return c.x=c.y,c.y=c.z,c.z=c.w,c.w^=c.w>>>19^u^u>>>8},i===(i|0)?c.x=i:l+=i;for(var h=0;h<l.length+64;h++)c.x^=l.charCodeAt(h)|0,c.next()}function o(i,c){return c.x=i.x,c.y=i.y,c.z=i.z,c.w=i.w,c}function a(i,c){var l=new s(i),h=c&&c.state,u=function(){return(l.next()>>>0)/4294967296};return u.double=function(){do var f=l.next()>>>11,p=(l.next()>>>0)/4294967296,w=(f+p)/(1<<21);while(w===0);return w},u.int32=l.next,u.quick=u,h&&(typeof h=="object"&&o(h,l),u.state=function(){return o(l,{})}),u}n&&n.exports?n.exports=a:this.xor128=a})(dt,t)})(Vr);var km=Vr.exports,Hr={exports:{}};Hr.exports;(function(t){(function(e,n,r){function s(i){var c=this,l="";c.next=function(){var u=c.x^c.x>>>2;return c.x=c.y,c.y=c.z,c.z=c.w,c.w=c.v,(c.d=c.d+362437|0)+(c.v=c.v^c.v<<4^(u^u<<1))|0},c.x=0,c.y=0,c.z=0,c.w=0,c.v=0,i===(i|0)?c.x=i:l+=i;for(var h=0;h<l.length+64;h++)c.x^=l.charCodeAt(h)|0,h==l.length&&(c.d=c.x<<10^c.x>>>4),c.next()}function o(i,c){return c.x=i.x,c.y=i.y,c.z=i.z,c.w=i.w,c.v=i.v,c.d=i.d,c}function a(i,c){var l=new s(i),h=c&&c.state,u=function(){return(l.next()>>>0)/4294967296};return u.double=function(){do var f=l.next()>>>11,p=(l.next()>>>0)/4294967296,w=(f+p)/(1<<21);while(w===0);return w},u.int32=l.next,u.quick=u,h&&(typeof h=="object"&&o(h,l),u.state=function(){return o(l,{})}),u}n&&n.exports?n.exports=a:this.xorwow=a})(dt,t)})(Hr);var vm=Hr.exports,jr={exports:{}};jr.exports;(function(t){(function(e,n,r){function s(i){var c=this;c.next=function(){var h=c.x,u=c.i,f,p;return f=h[u],f^=f>>>7,p=f^f<<24,f=h[u+1&7],p^=f^f>>>10,f=h[u+3&7],p^=f^f>>>3,f=h[u+4&7],p^=f^f<<7,f=h[u+7&7],f=f^f<<13,p^=f^f<<9,h[u]=p,c.i=u+1&7,p};function l(h,u){var f,p=[];if(u===(u|0))p[0]=u;else for(u=""+u,f=0;f<u.length;++f)p[f&7]=p[f&7]<<15^u.charCodeAt(f)+p[f+1&7]<<13;for(;p.length<8;)p.push(0);for(f=0;f<8&&p[f]===0;++f);for(f==8?p[7]=-1:p[f],h.x=p,h.i=0,f=256;f>0;--f)h.next()}l(c,i)}function o(i,c){return c.x=i.x.slice(),c.i=i.i,c}function a(i,c){i==null&&(i=+new Date);var l=new s(i),h=c&&c.state,u=function(){return(l.next()>>>0)/4294967296};return u.double=function(){do var f=l.next()>>>11,p=(l.next()>>>0)/4294967296,w=(f+p)/(1<<21);while(w===0);return w},u.int32=l.next,u.quick=u,h&&(h.x&&o(h,l),u.state=function(){return o(l,{})}),u}n&&n.exports?n.exports=a:this.xorshift7=a})(dt,t)})(jr);var Sm=jr.exports,Xr={exports:{}};Xr.exports;(function(t){(function(e,n,r){function s(i){var c=this;c.next=function(){var h=c.w,u=c.X,f=c.i,p,w;return c.w=h=h+1640531527|0,w=u[f+34&127],p=u[f=f+1&127],w^=w<<13,p^=p<<17,w^=w>>>15,p^=p>>>12,w=u[f]=w^p,c.i=f,w+(h^h>>>16)|0};function l(h,u){var f,p,w,y,$,k=[],N=128;for(u===(u|0)?(p=u,u=null):(u=u+"\0",p=0,N=Math.max(N,u.length)),w=0,y=-32;y<N;++y)u&&(p^=u.charCodeAt((y+32)%u.length)),y===0&&($=p),p^=p<<10,p^=p>>>15,p^=p<<4,p^=p>>>13,y>=0&&($=$+1640531527|0,f=k[y&127]^=p+$,w=f==0?w+1:0);for(w>=128&&(k[(u&&u.length||0)&127]=-1),w=127,y=4*128;y>0;--y)p=k[w+34&127],f=k[w=w+1&127],p^=p<<13,f^=f<<17,p^=p>>>15,f^=f>>>12,k[w]=p^f;h.w=$,h.X=k,h.i=w}l(c,i)}function o(i,c){return c.i=i.i,c.w=i.w,c.X=i.X.slice(),c}function a(i,c){i==null&&(i=+new Date);var l=new s(i),h=c&&c.state,u=function(){return(l.next()>>>0)/4294967296};return u.double=function(){do var f=l.next()>>>11,p=(l.next()>>>0)/4294967296,w=(f+p)/(1<<21);while(w===0);return w},u.int32=l.next,u.quick=u,h&&(h.X&&o(h,l),u.state=function(){return o(l,{})}),u}n&&n.exports?n.exports=a:this.xor4096=a})(dt,t)})(Xr);var Im=Xr.exports,Zr={exports:{}};Zr.exports;(function(t){(function(e,n,r){function s(i){var c=this,l="";c.next=function(){var u=c.b,f=c.c,p=c.d,w=c.a;return u=u<<25^u>>>7^f,f=f-p|0,p=p<<24^p>>>8^w,w=w-u|0,c.b=u=u<<20^u>>>12^f,c.c=f=f-p|0,c.d=p<<16^f>>>16^w,c.a=w-u|0},c.a=0,c.b=0,c.c=-1640531527,c.d=1367130551,i===Math.floor(i)?(c.a=i/4294967296|0,c.b=i|0):l+=i;for(var h=0;h<l.length+20;h++)c.b^=l.charCodeAt(h)|0,c.next()}function o(i,c){return c.a=i.a,c.b=i.b,c.c=i.c,c.d=i.d,c}function a(i,c){var l=new s(i),h=c&&c.state,u=function(){return(l.next()>>>0)/4294967296};return u.double=function(){do var f=l.next()>>>11,p=(l.next()>>>0)/4294967296,w=(f+p)/(1<<21);while(w===0);return w},u.int32=l.next,u.quick=u,h&&(typeof h=="object"&&o(h,l),u.state=function(){return o(l,{})}),u}n&&n.exports?n.exports=a:this.tychei=a})(dt,t)})(Zr);var Tm=Zr.exports,Yc={exports:{}},Am={},_m=Object.freeze({__proto__:null,default:Am}),Dm=Ru(_m);(function(t){(function(e,n,r){var s=256,o=6,a=52,i="random",c=r.pow(s,o),l=r.pow(2,a),h=l*2,u=s-1,f;function p(v,I,A){var M=[];I=I==!0?{entropy:!0}:I||{};var _=k($(I.entropy?[v,x(n)]:v??N(),3),M),D=new w(M),C=function(){for(var R=D.g(o),O=c,U=0;R<l;)R=(R+U)*s,O*=s,U=D.g(1);for(;R>=h;)R/=2,O/=2,U>>>=1;return(R+U)/O};return C.int32=function(){return D.g(4)|0},C.quick=function(){return D.g(4)/4294967296},C.double=C,k(x(D.S),n),(I.pass||A||function(R,O,U,X){return X&&(X.S&&y(X,D),R.state=function(){return y(D,{})}),U?(r[i]=R,O):R})(C,_,"global"in I?I.global:this==r,I.state)}function w(v){var I,A=v.length,M=this,_=0,D=M.i=M.j=0,C=M.S=[];for(A||(v=[A++]);_<s;)C[_]=_++;for(_=0;_<s;_++)C[_]=C[D=u&D+v[_%A]+(I=C[_])],C[D]=I;(M.g=function(R){for(var O,U=0,X=M.i,ne=M.j,we=M.S;R--;)O=we[X=u&X+1],U=U*s+we[u&(we[X]=we[ne=u&ne+O])+(we[ne]=O)];return M.i=X,M.j=ne,U})(s)}function y(v,I){return I.i=v.i,I.j=v.j,I.S=v.S.slice(),I}function $(v,I){var A=[],M=typeof v,_;if(I&&M=="object")for(_ in v)try{A.push($(v[_],I-1))}catch{}return A.length?A:M=="string"?v:v+"\0"}function k(v,I){for(var A=v+"",M,_=0;_<A.length;)I[u&_]=u&(M^=I[u&_]*19)+A.charCodeAt(_++);return x(I)}function N(){try{var v;return f&&(v=f.randomBytes)?v=v(s):(v=new Uint8Array(s),(e.crypto||e.msCrypto).getRandomValues(v)),x(v)}catch{var I=e.navigator,A=I&&I.plugins;return[+new Date,e,A,e.screen,x(n)]}}function x(v){return String.fromCharCode.apply(0,v)}if(k(r.random(),n),t.exports){t.exports=p;try{f=Dm}catch{}}else r["seed"+i]=p})(typeof self<"u"?self:dt,[],Math)})(Yc);var Nm=Yc.exports,Mm=xm,Fm=km,Rm=vm,Bm=Sm,Cm=Im,Pm=Tm,gt=Nm;gt.alea=Mm;gt.xor128=Fm;gt.xorwow=Rm;gt.xorshift7=Bm;gt.xor4096=Cm;gt.tychei=Pm;var Jr=gt;/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Om=.001,Qc=.1;function Lm(t,e,n){return n==null&&(n=Yr()),Er(t,e,(r,s)=>Qr(r,s,n))}function Yr(){return b.backend.floatPrecision()===32?Om:Qc}function Er(t,e,n){let r=!0;if((se(t)||se(e))&&(r=!1),se(t)&&se(e)&&(r=!0),r){const a=t.constructor.name,i=e.constructor.name;if(a!==i)throw new Error(`Arrays are of different type. Actual: ${a}. Expected: ${i}`)}if(Array.isArray(t)&&Array.isArray(e)){const a=De(t),i=De(e);if(!Ce(a,i))throw new Error(`Arrays have different shapes. Actual: [${a}]. Expected: [${i}]`)}const s=se(t)?t:He(t),o=se(e)?e:He(e);if(s.length!==o.length)throw new Error(`Arrays have different lengths actual: ${s.length} vs expected: ${o.length}.
Actual:   ${s}.
Expected: ${o}.`);for(let a=0;a<o.length;++a){const i=s[a],c=o[a];if(!n(i,c))throw new Error(`Arrays differ: actual[${a}] = ${i}, expected[${a}] = ${c}.
Actual:   ${s}.
Expected: ${o}.`)}typeof expect<"u"&&expect().nothing()}function Wm(t,e){t().then(()=>e.fail(),()=>e()),typeof expect<"u"&&expect().nothing()}function Um(t,e){const n=typeof e=="string"||typeof e=="number"||typeof e=="boolean"?[e]:e;return qe(t)||qe(t[0])||qe(e)||qe(e[0])?Er(t,n,(r,s)=>r==s):Er(t,e,(r,s)=>Qr(r,s,0))}function qm(t,e,n){if(n==null&&(n=Yr()),!Qr(t,e,n))throw new Error(`Numbers differ: actual === ${t}, expected === ${e}`);typeof expect<"u"&&expect().nothing()}function Qr(t,e,n){return!isFinite(t)&&!isFinite(e)?!0:!(isNaN(t)||isNaN(e)||Math.abs(t-e)>n)}function Gm(t,e,n){for(let r=0;r<t.length;r++)if(t[r]<e||t[r]>n)throw new Error(`Value out of range:${t[r]} low: ${e}, high: ${n}`)}function zm(t,e){const n=new Float32Array(t),r=new Float32Array(e);if(n.length!==r.length)throw new Error(`Expected ArrayBuffer to be of length ${r.length}, but it was ${n.length}`);for(let s=0;s<r.length;s++)if(n[s]!==r[s])throw new Error(`Expected ArrayBuffer value at ${s} to be ${r[s]} but got ${n[s]} instead`)}function el(t){for(let e=0;e<t.length;e++){const n=t[e];Array.isArray(n)?el(n):t[e]=on(n)}return t}function Km(t){const e=document.createElement("video");return"playsInline"in e&&(e.playsInline=!0),e.muted=!0,e.loop=!0,e.style.position="fixed",e.style.left="0px",e.style.top="0px",e.preload="auto",e.appendChild(t),new Promise(n=>{e.addEventListener("loadeddata",r=>n(e)),e.load()})}async function Vm(t){await t.play(),"requestVideoFrameCallback"in t&&await new Promise(e=>{t.requestVideoFrameCallback(e)})}var Hm=Object.freeze({__proto__:null,TEST_EPSILON_FLOAT16:Qc,createVideoElement:Km,encodeStrings:el,expectArrayBuffersEqual:zm,expectArraysClose:Lm,expectArraysEqual:Um,expectNumbersClose:qm,expectPromiseToFail:Wm,expectValuesInRange:Gm,play:Vm,testEpsilon:Yr});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class es{constructor(e,n,r,s,o){this.mean=e,this.stdDev=n,this.dtype=r,this.nextVal=NaN,this.truncated=s,this.truncated&&(this.upper=this.mean+this.stdDev*2,this.lower=this.mean-this.stdDev*2);const a=o||Math.random();this.random=Jr.alea(a.toString())}nextValue(){if(!isNaN(this.nextVal)){const s=this.nextVal;return this.nextVal=NaN,s}let e,n,r=!1;for(;!r;){let s,o,a;do s=2*this.random()-1,o=2*this.random()-1,a=s*s+o*o;while(a>=1||a===0);const i=Math.sqrt(-2*Math.log(a)/a);e=this.mean+this.stdDev*s*i,n=this.mean+this.stdDev*o*i,(!this.truncated||this.isValidTruncated(e))&&(r=!0)}return(!this.truncated||this.isValidTruncated(n))&&(this.nextVal=this.convertValue(n)),this.convertValue(e)}convertValue(e){return this.dtype==null||this.dtype==="float32"?e:Math.round(e)}isValidTruncated(e){return e<=this.upper&&e>=this.lower}}class jm{constructor(e,n,r,s){this.alpha=e,this.beta=1/n,this.dtype=r;const o=s||Math.random();this.randu=Jr.alea(o.toString()),this.randn=new es(0,1,r,!1,this.randu()),e<1?this.d=e+2/3:this.d=e-1/3,this.c=1/Math.sqrt(9*this.d)}nextValue(){let e,n,r,s,o,a;for(;;){do s=this.randn.nextValue(),a=1+this.c*s;while(a<=0);if(a*=a*a,e=s*s,n=1-.331*e*e,r=.5*e+this.d*(1-a+Math.log(a)),o=this.randu(),o<n||Math.log(o)<r)break}return a=1/this.beta*this.d*a,this.alpha<1&&(a*=Math.pow(this.randu(),1/this.alpha)),this.convertValue(a)}convertValue(e){return this.dtype==="float32"?e:Math.round(e)}}class Xm{constructor(e=0,n=1,r,s){if(this.canReturnFloat=()=>this.dtype==null||this.dtype==="float32",this.min=e,this.range=n-e,this.dtype=r,s==null&&(s=Math.random()),typeof s=="number"&&(s=s.toString()),!this.canReturnFloat()&&this.range<=1)throw new Error(`The difference between ${e} - ${n} <= 1 and dtype is not float`);this.random=Jr.alea(s)}convertValue(e){return this.canReturnFloat()?e:Math.round(e)}nextValue(){return this.convertValue(this.min+this.range*this.random())}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zm(t,e,n=1,r="float32",s){if(pe(t),n==null&&(n=1),r==null&&(r="float32"),r!=="float32"&&r!=="int32")throw new Error(`Unsupported data type ${r}`);const o=new jm(e,n,r,s),a=Re(t,r);for(let i=0;i<a.values.length;i++)a.values[i]=o.nextValue();return a.toTensor()}const Jm=m({randomGamma_:Zm});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ym(t,e=0,n=1,r,s){if(pe(t),r!=null&&r==="bool")throw new Error(`Unsupported data type ${r}`);const o=new es(e,n,r,!1,s),a=Re(t,r);for(let i=0;i<a.values.length;i++)a.values[i]=o.nextValue();return a.toTensor()}const tl=m({randomNormal_:Ym});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qm(t,e,n){if(e!=null&&e==="bool")throw new Error(`Unsupported data type ${e}`);return tl(t,0,1,e,n)}const eb=m({randomStandardNormal_:Qm});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function tb(t,e=0,n=1,r="float32",s){pe(t);const o=Re(t,r),a=new Xm(e,n,null,s);for(let i=0;i<o.values.length;i++)o.values[i]=a.nextValue();return o.toTensor()}const ts=m({randomUniform_:tb});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function nb(t,e,n,r){return ts(t,e,n,"int32",r)}const rb=m({randomUniformInt_:nb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Yt(t,e,n=1,r="float32"){if(n===0)throw new Error("Cannot have a step of zero");const s={start:t,stop:e,step:n,dtype:r};return b.runKernel(Ha,{},s)}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sb(t){const n={input:d(t,"input","real")};return b.runKernel(ja,n)}const Qt=m({real_:sb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ob(t){const n={x:d(t,"x","reciprocal")};return b.runKernel(Xa,n)}const ab=m({reciprocal_:ob});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ib(t){const n={x:d(t,"x","relu")};return b.runKernel(Za,n)}const Wn=m({relu_:ib});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cb(t){const n={x:d(t,"x","relu6")};return b.runKernel(ei,n)}const nl=m({relu6_:cb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function lb(t,e){const r={x:d(t,"x","reverse")},s={dims:e};return b.runKernel(ti,r,s)}const ut=m({reverse_:lb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ub(t){const e=d(t,"x","reverse");return g(e.rank===1,()=>`Error in reverse1D: x must be rank 1 but got rank ${e.rank}.`),ut(e,0)}const hb=m({reverse1d_:ub});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fb(t,e){const n=d(t,"x","reverse");return g(n.rank===2,()=>`Error in reverse2D: x must be rank 2 but got rank ${n.rank}.`),ut(n,e)}const db=m({reverse2d_:fb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pb(t,e){const n=d(t,"x","reverse");return g(n.rank===3,()=>`Error in reverse3D: x must be rank 3 but got rank ${n.rank}.`),ut(n,e)}const gb=m({reverse3d_:pb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mb(t,e){const n=d(t,"x","reverse");return g(n.rank===4,()=>`Error in reverse4D: x must be rank 4 but got rank ${n.rank}.`),ut(n,e)}const bb=m({reverse4d_:mb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wb(t){const n={x:d(t,"x","round")};return b.runKernel(ni,n)}const rl=m({round_:wb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function yb(t){const n={x:d(t,"x","rsqrt","float32")};return b.runKernel(ri,n)}const $b=m({rsqrt_:yb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Eb(t){const n={x:d(t,"x","selu")};return b.runKernel(ci,n)}const xb=m({selu_:Eb});function kb(t,e,n,r,s,o=[1,1],a="NHWC"){const i=d(t,"x","separableConv2d"),c=d(e,"depthwiseFilter","separableConv2d"),l=d(n,"pointwiseFilter","separableConv2d");let h=i,u=!1;if(i.rank===3&&(u=!0,h=E(i,[1,i.shape[0],i.shape[1],i.shape[2]])),a==="NCHW")throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");g(h.rank===4,()=>`Error in separableConv2d: input must be rank 4, but got rank ${h.rank}.`),g(c.rank===4,()=>`Error in separableConv2d: depthwise filter must be rank 4, but got rank ${c.rank}.`),g(l.rank===4,()=>`Error in separableConv2d: pointwise filter must be rank 4, but got rank ${c.rank}.`),g(l.shape[0]===1,()=>`Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got ${l.shape[0]}.`),g(l.shape[1]===1,()=>`Error in separableConv2d: the second dimension of pointwise filter must be 1, but got ${l.shape[1]}.`);const f=c.shape[2],p=c.shape[3];g(l.shape[2]===f*p,()=>`Error in separableConv2d: the third dimension of pointwise filter must be ${f*p}, but got ${l.shape[2]}.`);const w=Wr(h,c,r,s,a,o),$=Bn(w,l,1,"valid",a);return u?E($,[$.shape[1],$.shape[2],$.shape[3]]):$}const vb=m({separableConv2d_:kb});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function Sb(t,e){const n=d(t,"x","setdiff1d"),r=d(e,"y","setdiff1d");g(n.dtype===r.dtype,()=>`x and y should have the same dtype, but got x (${n.dtype}) and y (${r.dtype}).`),g(n.rank===1,()=>`x should be 1D tensor, but got x (${n.shape}).`),g(r.rank===1,()=>`y should be 1D tensor, but got y (${r.shape}).`);const s=await n.data(),o=await r.data(),a=new Set(o);let i=0;for(let h=0;h<s.length;h++)a.has(s[h])||i++;const c=new vn([i],n.dtype),l=new vn([i],"int32");for(let h=0,u=0;h<s.length;h++)a.has(s[h])||(c.values[u]=s[h],l.values[u]=h,u++);return[c.toTensor(),l.toTensor()]}const Ib=Sb;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Tb(t){const n={x:d(t,"x","sign")};return b.runKernel(fi,n)}const Ab=m({sign_:Tb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _b(t){const n={x:d(t,"x","sin","float32")};return b.runKernel(ui,n)}const Db=m({sin_:_b});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Nb(t){const n={x:d(t,"x","sinh")};return b.runKernel(hi,n)}const Mb=m({sinh_:Nb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fb(t,e,n){const r=d(t,"x","slice1d");return g(r.rank===1,()=>`slice1d expects a rank-1 tensor, but got a rank-${r.rank} tensor`),Z(r,[e],[n])}const Rb=m({slice1d_:Fb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Bb(t,e,n){const r=d(t,"x","slice2d");return g(r.rank===2,()=>`slice2d expects a rank-2 tensor, but got a rank-${r.rank} tensor`),Z(r,e,n)}const Cb=m({slice2d_:Bb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pb(t,e,n){const r=d(t,"x","slice3d");return g(r.rank===3,()=>`slice3d expects a rank-3 tensor, but got a rank-${r.rank} tensor`),Z(r,e,n)}const Ob=m({slice3d_:Pb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lb(t,e,n){const r=d(t,"x","slice4d");return g(r.rank===4,()=>`slice4d expects a rank-4 tensor, but got a rank-${r.rank} tensor`),Z(r,e,n)}const Wb=m({slice4d_:Lb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ub(t,e=-1){const n=d(t,"logits","softmax","float32");if(e===-1&&(e=n.rank-1),e!==n.rank-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and dim was ${e}`);const r={logits:n},s={dim:e};return b.runKernel(yi,r,s)}const qb=m({softmax_:Ub});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gb(t){g(t.dtype==="complex64",()=>`The dtype for tf.spectral.fft() must be complex64 but got ${t.dtype}.`);const e={input:t};return b.runKernel(Xo,e)}const ns=m({fft_:Gb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zb(t){g(t.dtype==="complex64",()=>`The dtype for tf.spectral.ifft() must be complex64 but got ${t.dtype}.`);const e={input:t};return b.runKernel(oa,e)}const An=m({ifft_:zb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kb(t){const e=t.shape[t.shape.length-1],n=t.size/e;let r;if(e<=2){const s=E(t,[n,e]);r=An(s)}else{const s=[n,2*(e-1)],o=E(Qt(t),[n,e]),a=E(On(t),[n,e]),i=ut(Z(o,[0,1],[n,e-2]),1),c=T(ut(Z(a,[0,1],[n,e-2]),1),q(-1)),l=de([o,i],1),h=de([a,c],1),u=E(je(l,h),[s[0],s[1]]);r=An(u)}if(r=Qt(r),t.rank===3&&t.shape[0]!==0){const s=r,o=t.shape[0];r=E(r,[o,r.shape[0]/o,r.shape[1]]),s.dispose()}return r}const sl=m({irfft_:Kb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vb(t,e,n=0){const s={x:d(t,"x","split")},o={numOrSizeSplits:e,axis:n};return b.runKernel(wi,s,o)}const en=m({split_:Vb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hb(t,e){g(t.dtype==="float32",()=>`The dtype for rfft() must be real value but got ${t.dtype}`);let n=t.shape[t.shape.length-1];const r=t.size/n;let s;if(e!=null&&e<n){const w=t.shape.map($=>0),y=t.shape.map($=>$);y[t.shape.length-1]=e,s=Z(t,w,y),n=e}else if(e!=null&&e>n){const w=t.shape.map(y=>y);w[t.shape.length-1]=e-n,s=de([t,Mt(w)],t.shape.length-1),n=e}else s=t;const o=be(s),a=E(je(s,o),[r,n]),i=ns(a),c=Math.floor(n/2)+1,l=Qt(i),h=On(i),u=en(l,[c,n-c],l.shape.length-1),f=en(h,[c,n-c],h.shape.length-1),p=s.shape.slice();return p[s.shape.length-1]=c,E(je(u[0],f[0]),p)}const rs=m({rfft_:Hb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jb(t,e){let n=d(t,"a","squaredDifference"),r=d(e,"b","squaredDifference");[n,r]=Y(n,r),te(n.shape,r.shape);const s={a:n,b:r},o={};return b.runKernel(Si,s,o)}const ol=m({squaredDifference_:jb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xb(t,e){const n=d(t,"x","squeeze","string_or_numeric");return E(n,qs(n.shape,e).newShape)}const ss=m({squeeze_:Xb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zb(t,e=0){const n=Vt(t,"tensors","stack","string_or_numeric");g(n.length>=1,()=>"Pass at least one tensor to tf.stack"),n.length>0&&g(e<=n[0].rank,()=>"Axis must be <= rank of the tensor");const r=n,s={axis:e};return b.runKernel(La,r,s)}const tn=m({stack_:Zb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jb(t,e=0){const r={x:d(t,"x","step")},s={alpha:e};return b.runKernel(Wi,r,s)}const al=m({step_:Jb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Yb(t,e,n,r,s=0,o=0,a=0,i=0,c=0){const h={x:d(t,"x","stridedSlice","string_or_numeric")},u={begin:e,end:n,strides:r,beginMask:s,endMask:o,ellipsisMask:a,newAxisMask:i,shrinkAxisMask:c};return b.runKernel(Ti,h,u)}const Qb=m({stridedSlice_:Yb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ew(t){const n={x:d(t,"x","tan","float32")};return b.runKernel(Mi,n)}const tw=m({tan_:ew});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xe(t,e){ft(t);const n=De(t,e);if(n.length!==1)throw new Error("tensor1d() requires values to be a flat/TypedArray");return Ze(t,null,n,e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Wt(t,e,n){if(ft(t),e!=null&&e.length!==2)throw new Error("tensor2d() requires shape to have two numbers");const r=De(t,n);if(r.length!==2&&r.length!==1)throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");if(r.length===1&&e==null)throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");return Ze(t,e,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function il(t,e,n){if(ft(t),e!=null&&e.length!==3)throw new Error("tensor3d() requires shape to have three numbers");const r=De(t,n);if(r.length!==3&&r.length!==1)throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");if(r.length===1&&e==null)throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");return Ze(t,e,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function nw(t,e,n){if(ft(t),e!=null&&e.length!==4)throw new Error("tensor4d() requires shape to have four numbers");const r=De(t,n);if(r.length!==4&&r.length!==1)throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");if(r.length===1&&e==null)throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");return Ze(t,e,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rw(t,e,n){if(ft(t),e!=null&&e.length!==5)throw new Error("tensor5d() requires shape to have five numbers");const r=De(t,n);if(r.length!==5&&r.length!==1)throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");if(r.length===1&&e==null)throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");return Ze(t,e,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sw(t,e,n){if(ft(t),e!=null&&e.length!==6)throw new Error("tensor6d() requires shape to have six numbers");const r=De(t,n);if(r.length!==6&&r.length!==1)throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");if(r.length===1&&e==null)throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");return e=e||r,Ze(t,e,r,n)}function os(t,e,n){const r=e.rank>1?e.shape[e.rank-1]:1,s=e.rank>1?e.rank-1:1,o=`Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: ${n.shape}, indices.shape: ${e.shape}, shape: ${t}, sliceDim: ${r}, and batchDim: ${s}.`;if(n.rank<s)throw new Error(o+` update.rank < ${s}. `);if(t.length<r+(n.rank-s))throw new Error(o+` Output shape length < ${r+(n.rank-s)}`);if(n.rank!==s+t.length-r)throw new Error(o+` update.rank != ${s+t.length-r}`);for(let a=0;a<s;++a)if(n.shape[a]!==e.shape[a])throw new Error(o+` updates.shape[${a}] (${n.shape[a]}) != indices.shape[${a}] (${e.shape[a]}).`);for(let a=0;a<n.rank-s;++a)if(n.shape[a+s]!==t[a+r])throw new Error(o+` updates.shape[${a+s}] (${n.shape[a+s]}) != shape[${a+s}] (${t[a+s]})`)}function Un(t,e,n){if(e.rank<1)throw new Error(`tf.scatterND() expects the indices to be rank 1 or higher, but the rank was ${e.rank}.`);if(t.rank<1)throw new Error(`tf.scatterND() expects the updates to be rank 1 or higher, but the rank was ${t.rank}.`);if(e.dtype!=="int32")throw new Error(`The dtype of 'indices' should be int32, but got dtype: ${e.dtype}`);if(n.length<1)throw new Error(`Output rank must be greater or equal to 1, but got shape: ${n}`);if(n.length===0){if(e.size===0)throw new Error(`Indices specified for empty output. indices shape: ${e.shape}`);if(t.size===0)throw new Error(`Updates specified for empty output. updates shape: ${t.shape}`)}os(n,e,t)}function cl(t,e,n){const r=e.shape.length,s=r>1?e.shape[r-1]:1,o=n.length;let a=1;for(let u=s;u<o;++u)a*=n[u];const i=s<1?1:s,c=W(e.shape)/i,l=[...Ft(n.slice(0,s)),1],h=W(n);return{sliceRank:s,numUpdates:c,sliceSize:a,strides:l,outputSize:h}}var ow=Object.freeze({__proto__:null,calculateShapes:cl,validateInput:Un,validateUpdateShape:os});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function aw(t,e,n){const r=d(t,"tensor","tensorScatterupdate"),s=d(e,"indices","tensorScatterupdate","int32"),o=d(n,"updates","tensorScatterupdate");if(Un(o,s,r.shape),r.dtype!==o.dtype)throw new Error(`tensor and updates must have the same dtype, instead they are ${r.dtype} and ${o.dtype}.`);const a={tensor:r,indices:s,updates:o},i={};return b.runKernel(oi,a,i)}const iw=m({tensorScatterUpdate_:aw});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cw(t,e=1,n=!0){const r=d(t,"x","topk");if(r.rank===0)throw new Error("topk() expects the input to be of rank 1 or higher");const s=r.shape[r.shape.length-1];if(e<0)throw new Error(`'k' passed to topk() must be >= 0 but got ${e}`);if(e>s)throw new Error(`'k' passed to topk() must be <= the last dimension (${s}) but got ${e}`);const o={x:r},a={k:e,sorted:n},[i,c]=b.runKernel(Ri,o,a);return{values:i,indices:c}}const lw=m({topk_:cw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function uw(t,e=0,n=1,r,s){if(pe(t),r!=null&&r==="bool")throw new Error("Unsupported data type $ { dtype }");const o=new es(e,n,r,!0,s),a=Re(t,r);for(let i=0;i<a.values.length;i++)a.values[i]=o.nextValue();return a.toTensor()}const hw=m({truncatedNormal_:uw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fw(t,e=0){const n=d(t,"x","unique","string_or_numeric");g(n.rank>0,()=>"The input tensor must be at least 1D");const r={x:n},s={axis:e},[o,a]=b.runKernel(Ci,r,s);return{values:o,indices:a}}const dw=m({unique_:fw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pw(t,e,n){const r=d(t,"x","unsortedSegmentSum"),s=d(e,"segmentIds","unsortedSegmentSum","int32");g(At(n),()=>"numSegments must be of dtype int");const o={x:r,segmentIds:s},a={numSegments:n};return b.runKernel(Oi,o,a)}const gw=m({unsortedSegmentSum_:pw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mw(t,e=0){const n=d(t,"x","unstack","string_or_numeric");g(e>=-n.shape.length&&e<n.shape.length,()=>`Axis = ${e} is not in [-${n.shape.length}, ${n.shape.length})`);const r={value:n},s={axis:e};return b.runKernel(Pi,r,s)}const as=m({unstack_:mw});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bw(t,e){return zr(t,e,"right")}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ww(t,e=!0,n,r){return b.makeVariable(t,e,n,r)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ll(t,e){const n=[];for(let o=0;o<e.length;o++)e[o]&&n.push(o);const r=Re(t,"int32"),s=Re([n.length,t.length],"int32");for(let o=0;o<n.length;o++){const a=r.indexToLoc(n[o]),i=o*t.length;s.values.set(a,i)}return s.toTensor()}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function yw(t){const e=d(t,"condition","whereAsync","bool"),n=await e.data(),r=ll(e.shape,n);return t!==e&&e.dispose(),r}const ul=yw;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function $w(t,e,n){const r=d(t,"tensor","boolMask"),s=d(e,"mask","boolMask","bool"),o=n??0,a=s.rank,i=r.shape;g(a>0,()=>"mask cannot be scalar"),ce(i.slice(o,o+a),s.shape,"mask's shape must match the first K dimensions of tensor's shape,");let c=1;for(let y=o;y<o+a;y++)c*=i[y];const l=i.slice(0,o).concat([c],i.slice(o+a)),h=E(r,l),u=E(s,[-1]),f=await ul(u),p=ss(f,[1]),w=Oc(h,p,o);return t!==r&&r.dispose(),e!==s&&s.dispose(),p.dispose(),h.dispose(),u.dispose(),f.dispose(),w}const Ew=$w;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xw(t,e,n){const r=d(t,"x","transpose");if(e==null&&(e=r.shape.map((a,i)=>i).reverse()),g(r.rank===e.length,()=>`Error in transpose: rank of input ${r.rank} must match length of perm ${e}.`),e.forEach(a=>{g(a>=0&&a<r.rank,()=>`All entries in 'perm' must be between 0 and ${r.rank-1} but got ${e}`)}),r.rank<=1)return r.clone();const s={x:r},o={perm:e};return r.dtype==="complex64"?ee(()=>{let a=Qt(r),i=On(r);return a=b.runKernel(pn,{x:a},o),i=b.runKernel(pn,{x:i},o),n&&(i=_e(i)),je(a,i)}):b.runKernel(pn,s,o)}const _n=m({transpose_:xw});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function kw(t,e,n,r,s=!0){const o=d(t,"v","movingAverage"),a=d(e,"x","movingAverage"),i=d(n,"decay","movingAverage");nc(o,a),g(Ce(o.shape,a.shape),()=>"Shape mismatch in v and x");const c=q(1),l=P(c,i);let h=T(P(a,o),l);if(s){g(r!=null,()=>"When using zeroDebias: true, step is required.");const u=d(r,"step","movingAverage");h=K(h,P(c,Zt(i,u)))}return F(o,h)}const vw=m({movingAverage_:kw});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sw(t,e,n){pe(n);const r=d(t,"indices","scatterND","int32"),s=d(e,"updates","scatterND");Un(s,r,n);const o={indices:r,updates:s},a={shape:n};return b.runKernel(si,o,a)}const Iw=m({scatterND_:Sw});function Tw(t,e,n,r){if(t.dtype!=="int32")throw new Error(`tf.sparseToDense() expects the indices to be int32 type, but the dtype was ${t.dtype}.`);if(t.rank>2)throw new Error(`sparseIndices should be a scalar, vector, or matrix, but got shape ${t.shape}.`);const s=t.rank>0?t.shape[0]:1,o=t.rank>1?t.shape[1]:1;if(n.length!==o)throw new Error(`outputShape has incorrect number of elements:, ${n.length}, should be: ${o}.`);const a=e.size;if(!(e.rank===0||e.rank===1&&a===s))throw new Error(`sparseValues has incorrect shape ${e.shape}, should be [] or [${s}]`);if(e.dtype!==r.dtype)throw new Error("sparseValues.dtype must match defaultValues.dtype")}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Aw(t,e,n,r=0){pe(n);const s=d(t,"sparseIndices","sparseToDense","int32"),o=d(e,"sparseValues","sparseToDense","string_or_numeric"),a=d(r,"defaultValue","sparseToDense",o.dtype);Tw(s,o,n,a);const i={sparseIndices:s,sparseValues:o,defaultValue:a},c={outputShape:n};return b.runKernel(vi,i,c)}const _w=m({sparseToDense_:Aw});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Dw(t,e){const n=d(e,"indices","gatherND","int32"),s={params:d(t,"x","gatherND","string_or_numeric"),indices:n};return b.runKernel(na,s)}const Nw=m({gatherND_:Dw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Mw(t,e){if(e==null)return t.shape.slice();if(Ce(t.shape,e))return e;if(t.shape.length===e.length){const n=[];for(let r=0;r<t.shape.length;r++)e[r]==null&&t.shape[r]!=null?n.push(t.shape[r]):n.push(e[r]);return n}return e}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fw(t,e,n,r){const s=d(t,"x","dropout");if(g(s.dtype==="float32",()=>`x has to be a floating point tensor since it's going to be scaled, but got a ${s.dtype} tensor instead.`),g(e>=0&&e<1,()=>`rate must be a float in the range [0, 1), but got ${e}.`),e===0)return t instanceof Q?s.clone():s;const o=Mw(s,n),a=1-e,i=K(Pc(F(ts(o,0,1,"float32",r),a)),a);return T(s,i)}const Rw=m({dropout_:Fw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hl(t){return Math.floor(Math.pow(2,Math.ceil(Math.log(t)/Math.log(2))))}function is(t,e,n){const r=1-t%2,s=new Float32Array(t);for(let o=0;o<t;++o){const a=2*Math.PI*o/(t+r-1);s[o]=e-n*Math.cos(a)}return xe(s,"float32")}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function Bw(t,e,n=1){const r=d(t,"predictions","inTopK"),s=d(e,"targets","inTopK");g(r.rank>1,()=>`inTopK() expects the predictions to be of rank 2 or higher, but got ${r.rank}`),g(r.rank-1===s.rank,()=>`predictions rank should be 1 larger than targets rank, but got predictions rank ${r.rank} and targets rank ${s.rank}`),ce(r.shape.slice(0,r.shape.length-1),s.shape,"predictions's shape should be align with the targets' shape, except the last dimension.");const o=r.shape[r.shape.length-1];g(n>0&&n<=o,()=>`'k' passed to inTopK() must be > 0 && <= the predictions last dimension (${o}), but got ${n}`);const a=await r.data(),i=await s.data(),[c,l]=[a.length/o,o],h=Gs("bool",c);for(let u=0;u<c;u++){const f=u*l,p=a.subarray(f,f+l),w=[];for(let y=0;y<p.length;y++)w.push({value:p[y],index:y});w.sort((y,$)=>$.value-y.value),h[u]=0;for(let y=0;y<n;y++)if(w[y].index===i[u]){h[u]=1;break}}return t!==r&&r.dispose(),e!==s&&s.dispose(),kt(h,s.shape,"bool")}const Cw=Bw;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pw(t,e,n,r,s,o="NHWC",a){let i=t;t.rank===3&&(i=E(t,[1,t.shape[0],t.shape[1],t.shape[2]]));let c=e;c.rank===3&&(c=E(e,[1,e.shape[0],e.shape[1],e.shape[2]])),g(i.rank===4,()=>`Error in conv2dDerFilter: input must be rank 4, but got shape ${i.shape}.`),g(c.rank===4,()=>`Error in conv2dDerFilter: dy must be rank 4, but got shape ${c.shape}.`),g(n.length===4,()=>`Error in conv2dDerFilter: filterShape must be length 4, but got ${n}.`);const l=o==="NHWC"?i.shape[3]:i.shape[1],h=o==="NHWC"?c.shape[3]:c.shape[1];g(l===n[2],()=>`Error in conv2dDerFilter: depth of input ${l}) must match input depth in filter (${n[2]}.`),g(h===n[3],()=>`Error in conv2dDerFilter: depth of dy (${h}) must match output depth for filter (${n[3]}).`),ke("conv2dDerFilter",s,a);const u={x:i,dy:c},f={strides:r,pad:s,dataFormat:o,dimRoundingMode:a,filterShape:n};return b.runKernel(So,u,f)}const Ow=m({conv2DBackpropFilter_:Pw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qn(t,e,n){if(n==null||n==="linear")return t;if(n==="relu")return T(t,al(e));throw new Error(`Cannot compute gradient for fused activation ${n}.`)}function Gn(t,e){let n=e;const r=Ur(t.shape,e.shape);return r.length>0&&(n=z(n,r)),E(n,t.shape)}function zn(t,e,n,r){if(e==="linear")return t;if(e==="relu")return Wn(t);if(e==="elu")return Fc(t);if(e==="relu6")return nl(t);if(e==="prelu")return Jc(t,n);if(e==="leakyrelu")return Wc(t,r);if(e==="sigmoid")return It(t);throw new Error(`Unknown fused activation ${e}.`)}const Kn=(t,e)=>!(t>0)||e==="linear";/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lw({x:t,filter:e,strides:n,pad:r,dataFormat:s="NHWC",dilations:o=[1,1],dimRoundingMode:a,bias:i,activation:c="linear",preluActivationWeights:l,leakyreluAlpha:h}){if(c=c||"linear",Kn(b.state.gradientDepth,c)===!1){g(s==="NHWC",()=>`Error in fused conv2d: got dataFormat of ${s} but only NHWC is currently supported for the case of gradient depth is 0 and the activation is not linear.`);let A=Bn(t,e,n,r,s,o,a);return i!=null&&(A=F(A,i)),zn(A,c,l,h)}const u=d(t,"x","conv2d","float32"),f=d(e,"filter","conv2d","float32");let p=u,w=!1;u.rank===3&&(w=!0,p=E(u,[1,u.shape[0],u.shape[1],u.shape[2]])),g(p.rank===4,()=>`Error in fused conv2d: input must be rank 4, but got rank ${p.rank}.`),g(f.rank===4,()=>`Error in fused conv2d: filter must be rank 4, but got rank ${f.rank}.`),ke("fused conv2d",r,a);const y=s==="NHWC"?p.shape[3]:p.shape[1];g(f.shape[2]===y,()=>`Error in conv2d: depth of input (${y}) must match input depth for filter ${f.shape[2]}.`),g(Pe(n,o),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`);const $=cn(p.shape,f.shape,n,o,r,a);let k;i!=null&&(k=d(i,"bias","fused conv2d"),[k]=Y(k,u),s==="NHWC"?te($.outShape,k.shape):(g(k.shape.length<=1,()=>`Error in fused conv2d: only supports scalar or 1-D Tensor bias for NCHW format but got the bias of rank-${k.shape.length}.`),g(k.shape.length===0||k.shape[0]===$.outChannels||k.shape[0]===1,()=>`Error in fused conv2d: bias shape (${k.shape}) is not compatible with the number of output channels (${$.outChannels})`)));let N;if(l!=null){const A=l.shape;if(g(A.length<=1||A.length===3,()=>`Error in fused conv2d: only supports scalar, 1-D Tensor or 3-D Tensor PReLU activation weights but got a tensor of rank-${A.length}.`),A.length===1)g(A[0]===1||A[0]===$.outChannels,()=>`Error in fused conv2d: PReLU activation weights (${A}) is not compatible with the number of output channels (${$.outChannels}).`);else if(A.length===3)try{te(A,$.outShape)}catch{const _=`Error in fused conv2d: PReLU activation weights (${A}) is not compatible with the output shape of the conv2d (${$.outShape}).`;throw Error(_)}N=d(l,"prelu weights","fused conv2d")}const x=(A,M)=>{g(s==="NHWC",()=>`Error in gradient of fused conv2D: got dataFormat of ${s} but only NHWC is currently supported.`);const[_,D,C,R]=M,O=qn(A,C,c);g(Xt(o),()=>`Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${o}'`);const U=Dc(D.shape,O,_,n,r),X=Ow(D,O,_.shape,n,r),ne=[U,X];if(R!=null){const we=Gn(R,O);ne.push(we)}return ne},v={x:p,filter:f,bias:k,preluActivationWeights:N},I={strides:n,pad:r,dataFormat:s,dilations:o,dimRoundingMode:a,activation:c,leakyreluAlpha:h};return i==null?Ne((M,_,D)=>{let C=b.runKernel(tr,v,I);return D([_,M,C]),w&&(C=E(C,[C.shape[1],C.shape[2],C.shape[3]])),{value:C,gradFunc:x}})(p,f):Ne((M,_,D,C)=>{let R=b.runKernel(tr,v,I);return C([_,M,R,D]),w&&(R=E(R,[R.shape[1],R.shape[2],R.shape[3]])),{value:R,gradFunc:x}})(p,f,k)}const Ww=m({fusedConv2d_:Lw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Uw(t,e,n,r,s,o=[1,1],a){let i=t;t.rank===3&&(i=E(t,[1,t.shape[0],t.shape[1],t.shape[2]]));let c=e;c.rank===3&&(c=E(e,[1,e.shape[0],e.shape[1],e.shape[2]]));const l={x:i,dy:c},h={strides:r,pad:s,dimRoundingMode:a,dilations:o,filterShape:n};return b.runKernel(Po,l,h)}const qw=m({depthwiseConv2dNativeBackpropFilter_:Uw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gw(t,e,n,r,s,o=[1,1],a){let i=e,c=!1;e.rank===3&&(c=!0,i=E(e,[1,e.shape[0],e.shape[1],e.shape[2]]));const l={dy:i,filter:n},h={strides:r,pad:s,dimRoundingMode:a,dilations:o,inputShape:t},u=b.runKernel(Oo,l,h);return c?E(u,[u.shape[1],u.shape[2],u.shape[3]]):u}const zw=m({depthwiseConv2dNativeBackpropInput_:Gw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kw({x:t,filter:e,strides:n,pad:r,dataFormat:s="NHWC",dilations:o=[1,1],dimRoundingMode:a,bias:i,activation:c="linear",preluActivationWeights:l,leakyreluAlpha:h}){if(Kn(b.state.gradientDepth,c)===!1){let I=Wr(t,e,n,r,s,o,a);return i!=null&&(I=F(I,i)),zn(I,c,l,h)}const u=d(t,"x","depthwiseConv2d","float32"),f=d(e,"filter","depthwiseConv2d","float32");let p=u,w=!1;u.rank===3&&(w=!0,p=E(u,[1,u.shape[0],u.shape[1],u.shape[2]])),g(p.rank===4,()=>`Error in fused depthwiseConv2d: input must be rank 4, but got rank ${p.rank}.`),g(f.rank===4,()=>`Error in fused depthwiseConv2d: filter must be rank 4, but got rank ${f.rank}.`),g(p.shape[3]===f.shape[2],()=>`Error in fused depthwiseConv2d: number of input channels (${p.shape[3]}) must match the inChannels dimension in filter ${f.shape[2]}.`),o==null&&(o=[1,1]),g(Pe(n,o),()=>`Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`),ke("fused depthwiseConv2d",r,a);const y=cn(p.shape,f.shape,n,o,r,a,!0);let $;i!=null&&($=d(i,"bias","fused conv2d"),[$]=Y($,u),te(y.outShape,$.shape));let k;l!=null&&(k=d(l,"prelu weights","fused depthwiseConv2d"));const N=(I,A)=>{g(Xt(o),()=>`Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '${o}'`);const[M,_,D,C]=A,R=qn(I,D,c),O=zw(_.shape,R,M,n,r,o,a),U=qw(_,R,M.shape,n,r,o,a);if(C!=null){const X=Gn($,R);return[O,U,X]}return[O,U]},x={x:p,filter:f,bias:$,preluActivationWeights:k},v={strides:n,pad:r,dataFormat:s,dilations:o,dimRoundingMode:a,activation:c,leakyreluAlpha:h};return i==null?Ne((A,M,_)=>{let D=b.runKernel(nr,x,v);return _([M,A,D]),w&&(D=E(D,[D.shape[1],D.shape[2],D.shape[3]])),{value:D,gradFunc:N}})(p,f):Ne((A,M,_,D)=>{let C=b.runKernel(nr,x,v);return D([M,A,C,_]),w&&(C=E(C,[C.shape[1],C.shape[2],C.shape[3]])),{value:C,gradFunc:N}})(p,f,$)}const Vw=m({fusedDepthwiseConv2d_:Kw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hw({a:t,b:e,transposeA:n=!1,transposeB:r=!1,bias:s,activation:o="linear",preluActivationWeights:a,leakyreluAlpha:i=.2}){if(Kn(b.state.gradientDepth,o)===!1){let R=L(t,e,n,r);return s!=null&&(R=F(R,s)),zn(R,o,a,i)}let c=d(t,"a","fused matMul"),l=d(e,"b","fused matMul");[c,l]=Y(c,l);const h=n?c.shape[c.rank-2]:c.shape[c.rank-1],u=r?l.shape[l.rank-1]:l.shape[l.rank-2],f=n?c.shape[c.rank-1]:c.shape[c.rank-2],p=r?l.shape[l.rank-2]:l.shape[l.rank-1],w=c.shape.slice(0,-2),y=l.shape.slice(0,-2),$=W(w),k=W(y);g(h===u,()=>`Error in fused matMul: inner shapes (${h}) and (${u}) of Tensors with shapes ${c.shape} and ${l.shape} and transposeA=${n} and transposeB=${r} must match.`);const x=te(c.shape.slice(0,-2),l.shape.slice(0,-2)).concat([f,p]),v=n?E(c,[$,h,f]):E(c,[$,f,h]),I=r?E(l,[k,p,u]):E(l,[k,u,p]);let A;s!=null&&(A=d(s,"bias","fused matMul"),[A]=Y(A,c),te(x,A.shape));let M;a!=null&&(M=d(a,"prelu weights","fused matMul"));const _=(R,O)=>{const[U,X,ne,we]=O,Me=qn(E(R,ne.shape),ne,o);let mt,bt;if(!n&&!r?(mt=L(Me,X,!1,!0),bt=L(U,Me,!0,!1)):!n&&r?(mt=L(Me,X,!1,!1),bt=L(Me,U,!0,!1)):n&&!r?(mt=L(X,Me,!1,!0),bt=L(U,Me,!1,!1)):(mt=L(X,Me,!0,!0),bt=L(Me,U,!0,!0)),s!=null){const Pl=Gn(we,Me);return[mt,bt,Pl]}else return[mt,bt]},D={a:v,b:I,bias:A,preluActivationWeights:M},C={transposeA:n,transposeB:r,activation:o,leakyreluAlpha:i};return s==null?Ne((O,U,X)=>{const ne=b.runKernel(er,D,C);return X([O,U,ne]),{value:E(ne,x),gradFunc:_}})(v,I):Ne((O,U,X,ne)=>{const we=b.runKernel(er,D,C);return ne([O,U,we,X]),{value:E(we,x),gradFunc:_}})(v,I,A)}const jw=m({fusedMatMul_:Hw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Xw=Object.freeze({__proto__:null,conv2d:Ww,depthwiseConv2d:Vw,matMul:jw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zw(t){return is(t,.54,.46)}const Jw=m({hammingWindow_:Zw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Yw(t){return is(t,.5,.5)}const fl=m({hannWindow_:Yw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qw(t,e,n,r=!1,s=0){let o=0;const a=[];for(;o+e<=t.size;)a.push(Z(t,o,e)),o+=n;if(r)for(;o<t.size;){const i=o+e-t.size,c=de([Z(t,o,e-i),ln([i],s)]);a.push(c),o+=n}return a.length===0?Wt([],[0,e]):E(de(a),[a.length,e])}const dl=m({frame_:Qw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function e0(t,e,n,r,s=fl){r==null&&(r=hl(e));const o=dl(t,e,n),a=T(o,s(e));return rs(a,r)}const t0=m({stft_:e0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function n0(t,e,n,r,s="bilinear",o=0){const a=d(t,"image","cropAndResize"),i=d(e,"boxes","cropAndResize","float32"),c=d(n,"boxInd","cropAndResize","int32"),l=i.shape[0];g(a.rank===4,()=>`Error in cropAndResize: image must be rank 4,but got rank ${a.rank}.`),g(i.rank===2&&i.shape[1]===4,()=>`Error in cropAndResize: boxes must be have size [${l},4] but had shape ${i.shape}.`),g(c.rank===1&&c.shape[0]===l,()=>`Error in cropAndResize: boxInd must be have size [${l}] but had shape ${i.shape}.`),g(r.length===2,()=>`Error in cropAndResize: cropSize must be of length 2, but got length ${r.length}.`),g(r[0]>=1&&r[1]>=1,()=>`cropSize must be atleast [1,1], but was ${r}`),g(s==="bilinear"||s==="nearest",()=>`method must be bilinear or nearest, but was ${s}`);const h={image:a,boxes:i,boxInd:c},u={method:s,extrapolationValue:o,cropSize:r};return b.runKernel(Fo,h,u)}const r0=m({cropAndResize_:n0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function s0(t){const e=d(t,"image","flipLeftRight","float32");g(e.rank===4,()=>`Error in flipLeftRight: image must be rank 4,but got rank ${e.rank}.`);const n={image:e};return b.runKernel(Jo,n,{})}const o0=m({flipLeftRight_:s0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function a0(t){const e=d(t,"image","grayscaleToRGB"),n=e.rank-1,r=e.shape[n];g(e.rank>=2,()=>`Error in grayscaleToRGB: images must be at least rank 2, but got rank ${e.rank}.`),g(r===1,()=>`Error in grayscaleToRGB: last dimension of a grayscale image should be size 1, but got size ${r}.`);const s=new Array(e.rank);return s.fill(1,0,n),s[n]=3,Lt(e,s)}const i0=m({grayscaleToRGB_:a0});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function c0(t){const e=d(t,"image","RGBToGrayscale"),n=e.rank-1,r=e.shape[n];g(e.rank>=2,()=>`Error in RGBToGrayscale: images must be at least rank 2, but got rank ${e.rank}.`),g(r===3,()=>`Error in RGBToGrayscale: last dimension of an RGB image should be size 3, but got size ${r}.`);const s=e.dtype,o=j(e,"float32"),a=xe([.2989,.587,.114]);let i;switch(e.rank){case 2:i=$t("ij,j->i",o,a);break;case 3:i=$t("ijk,k->ij",o,a);break;case 4:i=$t("ijkl,l->ijk",o,a);break;case 5:i=$t("ijklm,m->ijkl",o,a);break;case 6:i=$t("ijklmn,n->ijklm",o,a);break;default:throw new Error("Not a valid tensor rank.")}return i=Le(i,-1),j(i,s)}const l0=m({rgbToGrayscale_:c0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function u0(t,e,n=0,r=.5){const s=d(t,"image","rotateWithOffset","float32");g(s.rank===4,()=>`Error in rotateWithOffset: image must be rank 4,but got rank ${s.rank}.`);const o={image:s},a={radians:e,fillValue:n,center:r};return b.runKernel(Ui,o,a)}const h0=m({rotateWithOffset_:u0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rt(t,e,n,r,s,o){r==null&&(r=.5),s==null&&(s=Number.NEGATIVE_INFINITY),o==null&&(o=0);const a=t.shape[0];return n=Math.min(n,a),g(0<=r&&r<=1,()=>`iouThreshold must be in [0, 1], but was '${r}'`),g(t.rank===2,()=>`boxes must be a 2D tensor, but was of rank '${t.rank}'`),g(t.shape[1]===4,()=>`boxes must have 4 columns, but 2nd dimension was ${t.shape[1]}`),g(e.rank===1,()=>"scores must be a 1D tensor"),g(e.shape[0]===a,()=>`scores has incompatible shape with boxes. Expected ${a}, but was ${e.shape[0]}`),g(0<=o&&o<=1,()=>`softNmsSigma must be in [0, 1], but was '${o}'`),{maxOutputSize:n,iouThreshold:r,scoreThreshold:s,softNmsSigma:o}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function f0(t,e,n,r=.5,s=Number.NEGATIVE_INFINITY){const o=d(t,"boxes","nonMaxSuppression","float32"),a=d(e,"scores","nonMaxSuppression","float32"),i=Rt(o,a,n,r,s);n=i.maxOutputSize,r=i.iouThreshold,s=i.scoreThreshold;const c={maxOutputSize:n,iouThreshold:r,scoreThreshold:s};return b.runKernel(Ra,{boxes:o,scores:a},c)}const d0=m({nonMaxSuppression_:f0});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function p0(t,e,n){const r=g0(t,e,n),s=r<0?-(r+1):r;t.splice(s,0,e)}function g0(t,e,n){return b0(t,e,n||m0)}function m0(t,e){return t>e?1:t<e?-1:0}function b0(t,e,n){let r=0,s=t.length,o=0,a=!1;for(;r<s;){o=r+(s-r>>>1);const i=n(e,t[o]);i>0?r=o+1:(s=o,a=!i)}return a?r:-r-1}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pl(t,e,n,r,s){return cs(t,e,n,r,s,0)}function gl(t,e,n,r,s,o){return cs(t,e,n,r,s,0,!1,o,!0)}function ml(t,e,n,r,s,o){return cs(t,e,n,r,s,o,!0)}function cs(t,e,n,r,s,o,a=!1,i=!1,c=!1){const l=[];for(let $=0;$<e.length;$++)e[$]>s&&l.push({score:e[$],boxIndex:$,suppressBeginIndex:0});l.sort(Ns);const h=o>0?-.5/o:0,u=[],f=[];for(;u.length<n&&l.length>0;){const $=l.pop(),{score:k,boxIndex:N,suppressBeginIndex:x}=$;if(k<s)break;let v=!1;for(let I=u.length-1;I>=x;--I){const A=w0(t,N,u[I]);if(A>=r){v=!0;break}if($.score=$.score*y0(r,h,A),$.score<=s)break}$.suppressBeginIndex=u.length,v||($.score===k?(u.push(N),f.push($.score)):$.score>s&&p0(l,$,Ns))}const p=u.length,w=n-p;i&&w>0&&(u.push(...new Array(w).fill(0)),f.push(...new Array(w).fill(0)));const y={selectedIndices:u};return a&&(y.selectedScores=f),c&&(y.validOutputs=p),y}function w0(t,e,n){const r=t.subarray(e*4,e*4+4),s=t.subarray(n*4,n*4+4),o=Math.min(r[0],r[2]),a=Math.min(r[1],r[3]),i=Math.max(r[0],r[2]),c=Math.max(r[1],r[3]),l=Math.min(s[0],s[2]),h=Math.min(s[1],s[3]),u=Math.max(s[0],s[2]),f=Math.max(s[1],s[3]),p=(i-o)*(c-a),w=(u-l)*(f-h);if(p<=0||w<=0)return 0;const y=Math.max(o,l),$=Math.max(a,h),k=Math.min(i,u),N=Math.min(c,f),x=Math.max(k-y,0)*Math.max(N-$,0);return x/(p+w-x)}function y0(t,e,n){const r=Math.exp(e*n*n);return n<=t?r:0}function Ns(t,e){return t.score-e.score||t.score===e.score&&e.boxIndex-t.boxIndex}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function $0(t,e,n,r=.5,s=Number.NEGATIVE_INFINITY){const o=d(t,"boxes","nonMaxSuppressionAsync"),a=d(e,"scores","nonMaxSuppressionAsync"),i=Rt(o,a,n,r,s);n=i.maxOutputSize,r=i.iouThreshold,s=i.scoreThreshold;const c=await Promise.all([o.data(),a.data()]),l=c[0],h=c[1],{selectedIndices:u}=pl(l,h,n,r,s);return o!==t&&o.dispose(),a!==e&&a.dispose(),xe(u,"int32")}const E0=$0;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function x0(t,e,n,r=.5,s=Number.NEGATIVE_INFINITY,o=0){const a=d(t,"boxes","nonMaxSuppression"),i=d(e,"scores","nonMaxSuppression"),c=Rt(a,i,n,r,s,o);n=c.maxOutputSize,r=c.iouThreshold,s=c.scoreThreshold,o=c.softNmsSigma;const l={boxes:a,scores:i},h={maxOutputSize:n,iouThreshold:r,scoreThreshold:s,softNmsSigma:o},u=b.runKernel(Ca,l,h);return{selectedIndices:u[0],selectedScores:u[1]}}const k0=m({nonMaxSuppressionWithScore_:x0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function v0(t,e,n,r=.5,s=Number.NEGATIVE_INFINITY,o=0){const a=d(t,"boxes","nonMaxSuppressionAsync"),i=d(e,"scores","nonMaxSuppressionAsync"),c=Rt(a,i,n,r,s,o);n=c.maxOutputSize,r=c.iouThreshold,s=c.scoreThreshold,o=c.softNmsSigma;const l=await Promise.all([a.data(),i.data()]),h=l[0],u=l[1],{selectedIndices:f,selectedScores:p}=ml(h,u,n,r,s,o);return a!==t&&a.dispose(),i!==e&&i.dispose(),{selectedIndices:xe(f,"int32"),selectedScores:xe(p)}}const S0=v0;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function I0(t,e,n,r=.5,s=Number.NEGATIVE_INFINITY,o=!1){const a=d(t,"boxes","nonMaxSuppression"),i=d(e,"scores","nonMaxSuppression"),c=Rt(a,i,n,r,s,null),l=c.maxOutputSize,h=c.iouThreshold,u=c.scoreThreshold,f={boxes:a,scores:i},p={maxOutputSize:l,iouThreshold:h,scoreThreshold:u,padToMaxOutputSize:o},w=b.runKernel(Ba,f,p);return{selectedIndices:w[0],validOutputs:w[1]}}const T0=m({nonMaxSuppressionPadded_:I0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function A0(t,e,n,r=.5,s=Number.NEGATIVE_INFINITY,o=!1){const a=d(t,"boxes","nonMaxSuppressionAsync"),i=d(e,"scores","nonMaxSuppressionAsync"),c=Rt(a,i,n,r,s,null),l=c.maxOutputSize,h=c.iouThreshold,u=c.scoreThreshold,[f,p]=await Promise.all([a.data(),i.data()]),{selectedIndices:w,validOutputs:y}=gl(f,p,l,h,u,o);return a!==t&&a.dispose(),i!==e&&i.dispose(),{selectedIndices:xe(w,"int32"),validOutputs:q(y,"int32")}}const _0=A0;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function D0(t,e,n=!1,r=!1){const s=d(t,"images","resizeBilinear");g(s.rank===3||s.rank===4,()=>`Error in resizeBilinear: x must be rank 3 or 4, but got rank ${s.rank}.`),g(e.length===2,()=>`Error in resizeBilinear: new shape must 2D, but got shape ${e}.`),g(r===!1||n===!1,()=>"Error in resizeBilinear: If halfPixelCenters is true, alignCorners must be false.");let o=s,a=!1;s.rank===3&&(a=!0,o=E(s,[1,s.shape[0],s.shape[1],s.shape[2]]));const i={images:o},c={alignCorners:n,halfPixelCenters:r,size:e},l=b.runKernel(Qa,i,c);return a?E(l,[l.shape[1],l.shape[2],l.shape[3]]):l}const N0=m({resizeBilinear_:D0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function M0(t,e,n=!1,r=!1){const s=d(t,"images","resizeNearestNeighbor");g(s.rank===3||s.rank===4,()=>`Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank ${s.rank}.`),g(e.length===2,()=>`Error in resizeNearestNeighbor: new shape must 2D, but got shape ${e}.`),g(s.dtype==="float32"||s.dtype==="int32",()=>"`images` must have `int32` or `float32` as dtype"),g(r===!1||n===!1,()=>"Error in resizeNearestNeighbor: If halfPixelCenters is true, alignCorners must be false.");let o=s,a=!1;s.rank===3&&(a=!0,o=E(s,[1,s.shape[0],s.shape[1],s.shape[2]]));const i={images:o},c={alignCorners:n,halfPixelCenters:r,size:e},l=b.runKernel(Ya,i,c);return a?E(l,[l.shape[1],l.shape[2],l.shape[3]]):l}const F0=m({resizeNearestNeighbor_:M0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function R0(t,e="binary",n=!1,r=.5){const s=d(t,"image","threshold"),o=.2989,a=.587,i=.114,c=s.shape[0]*s.shape[1];let l=T(xe([r]),255),h,u,f,p;if(g(s.rank===3,()=>`Error in threshold: image must be rank 3,but got rank ${s.rank}.`),g(s.shape[2]===3||s.shape[2]===1,()=>`Error in threshold: image color channel must be equal to 3 or 1but got ${s.shape[2]}.`),g(s.dtype==="int32"||s.dtype==="float32",()=>`Error in dtype: image dtype must be int32 or float32,but got dtype ${s.dtype}.`),g(e==="otsu"||e==="binary",()=>`Method must be binary or otsu, but was ${e}`),s.shape[2]===3){[h,u,f]=en(s,[1,1,1],-1);const $=T(h,o),k=T(u,a),N=T(f,i);p=F(F($,k),N)}else p=t;if(e==="otsu"){const $=_c(j(rl(p),"int32"),kt([]),256);l=B0($,c)}const w=n?Gr(p,l):Pn(p,l);return j(T(w,255),"int32")}function B0(t,e){let n=xe([-1]),r=xe([0]),s=xe([0]),o,a,i,c,l,h;for(let u=0;u<t.size-1;u++){o=Z(t,0,u+1),a=Z(t,u+1),l=K(z(o),e),h=K(z(a),e);const f=z(T(o,Yt(0,o.size)));i=K(f,z(o));const p=ln(a.shape,o.size),w=F(Yt(0,a.size),p),y=T(a,w);c=K(z(y),z(a));const $=P(i,c),k=P(i,c),N=T(l,h);s=T(T(N,$),k);const x=Pn(s,r);r=Ke(x,s,r),n=Ke(x,xe([u]),n)}return n}const C0=m({threshold_:R0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function P0(t,e,n="nearest",r="constant",s=0,o){const a=d(t,"image","transform","float32"),i=d(e,"transforms","transform","float32");g(a.rank===4,()=>`Error in transform: image must be rank 4,but got rank ${a.rank}.`),g(i.rank===2&&(i.shape[0]===a.shape[0]||i.shape[0]===1)&&i.shape[1]===8,()=>"Error in transform: Input transform should be batch x 8 or 1 x 8"),g(o==null||o.length===2,()=>`Error in transform: outputShape must be [height, width] or null, but got ${o}.`);const c={image:a,transforms:i},l={interpolation:n,fillMode:r,fillValue:s,outputShape:o};return b.runKernel(Bi,c,l)}const O0=m({transform_:P0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function L0(t,e,n){const r=d(t,"a","bandPart");g(r.rank>=2,()=>`bandPart(): Rank must be at least 2, got ${r.rank}.`);const s=r.shape,[o,a]=r.shape.slice(-2);let i,c;typeof e=="number"?(g(e%1===0,()=>`bandPart(): numLower must be an integer, got ${e}.`),g(e<=o,()=>`bandPart(): numLower (${e}) must not be greater than the number of rows (${o}).`),i=d(e<0?o:e,"numLower","bandPart")):(g(e.dtype==="int32",()=>"bandPart(): numLower's dtype must be an int32."),i=Ke(yr(e,0),o,Tn(e,o))),typeof n=="number"?(g(n%1===0,()=>`bandPart(): numUpper must be an integer, got ${n}.`),g(n<=a,()=>`bandPart(): numUpper (${n}) must not be greater than the number of columns (${a}).`),c=d(n<0?a:n,"numUpper","bandPart")):(g(n.dtype==="int32",()=>"bandPart(): numUpper's dtype must be an int32."),c=Ke(yr(n,0),a,Tn(n,a)));const l=E(Yt(0,o,1,"int32"),[-1,1]),h=Yt(0,a,1,"int32"),u=P(l,h),f=Sn(Gr(u,i),Lc(u,_e(c))),p=Mt([o,a],r.dtype);return E(tn(as(E(r,[-1,o,a])).map(w=>Ke(f,w,p))),s)}const W0=m({bandPart_:L0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function U0(t){let e;if(Array.isArray(t)){e=!1,g(t!=null&&t.length>0,()=>"Gram-Schmidt process: input must not be null, undefined, or empty");const s=t[0].shape[0];for(let o=1;o<t.length;++o)g(t[o].shape[0]===s,()=>`Gram-Schmidt: Non-unique lengths found in the input vectors: (${t[o].shape[0]} vs. ${s})`)}else e=!0,t=en(t,t.shape[0],0).map(s=>ss(s,[0]));g(t.length<=t[0].shape[0],()=>`Gram-Schmidt: Number of vectors (${t.length}) exceeds number of dimensions (${t[0].shape[0]}).`);const n=[],r=t;for(let s=0;s<t.length;++s)n.push(b.tidy(()=>{let o=r[s];if(s>0)for(let a=0;a<s;++a){const i=T(z(T(n[a],o)),n[a]);o=P(o,i)}return K(o,Cn(o,"euclidean"))}));return e?tn(n,0):n}const q0=m({gramSchmidt_:U0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function G0(t,e=!1){if(g(t.rank>=2,()=>`qr() requires input tensor to have a rank >= 2, but got rank ${t.rank}`),t.rank===2)return Ms(t,e);{const n=t.shape.slice(0,t.shape.length-2).reduce((c,l)=>c*l),r=as(E(t,[n,t.shape[t.shape.length-2],t.shape[t.shape.length-1]]),0),s=[],o=[];r.forEach(c=>{const[l,h]=Ms(c,e);s.push(l),o.push(h)});const a=E(tn(s,0),t.shape),i=E(tn(o,0),t.shape);return[a,i]}}function Ms(t,e=!1){return b.tidy(()=>{g(t.shape.length===2,()=>`qr2d() requires a 2D Tensor, but got a ${t.shape.length}D Tensor.`);const n=t.shape[0],r=t.shape[1];let s=Cc(n),o=st(t);const a=Wt([[1]],[1,1]);let i=st(a);const c=n>=r?r:n;for(let l=0;l<c;++l){const h=o,u=i,f=s;[i,o,s]=b.tidy(()=>{const p=Z(o,[l,l],[n-l,1]),w=Cn(p),y=Z(o,[l,l],[1,1]),$=Ke(Pn(y,0),Wt([[-1]]),Wt([[1]])),k=P(y,T($,w)),N=K(p,k);N.shape[0]===1?i=st(a):i=de([a,Z(N,[1,0],[N.shape[0]-1,N.shape[1]])],0);const x=_e(K(L($,k),w)),v=Z(o,[l,0],[n-l,r]),I=T(x,i),A=_n(i);if(l===0)o=P(v,L(I,L(A,v)));else{const D=P(v,L(I,L(A,v)));o=de([Z(o,[0,0],[l,r]),D],0)}const M=_n(I),_=Z(s,[0,l],[n,s.shape[1]-l]);if(l===0)s=P(_,L(L(_,i),M));else{const D=P(_,L(L(_,i),M));s=de([Z(s,[0,0],[n,l]),D],1)}return[i,o,s]}),le([h,u,f])}return!e&&n>r&&(s=Z(s,[0,0],[n,r]),o=Z(o,[0,0],[r,r])),[s,o]})}const z0=m({qr_:G0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var ie;(function(t){t[t.NONE=0]="NONE",t[t.MEAN=1]="MEAN",t[t.SUM=2]="SUM",t[t.SUM_BY_NONZERO_WEIGHTS=3]="SUM_BY_NONZERO_WEIGHTS"})(ie||(ie={}));function K0(t,e,n=ie.SUM_BY_NONZERO_WEIGHTS){const r=d(t,"losses","computeWeightedLoss");let s=null;e!=null&&(s=d(e,"weights","computeWeightedLoss"));const o=s==null?r:T(r,s);if(n===ie.NONE)return o;if(n===ie.SUM)return z(o);if(n===ie.MEAN){if(s==null)return In(o);{const a=r.size/s.size,i=K(z(o),z(s));return a>1?K(i,q(a)):i}}if(n===ie.SUM_BY_NONZERO_WEIGHTS){if(s==null)return K(z(o),q(r.size));{const a=T(s,rt(r.shape)),i=j(z(Xc(a,q(0))),"float32");return K(z(o),i)}}throw Error(`Unknown reduction: ${n}`)}const Oe=m({computeWeightedLoss_:K0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function V0(t,e,n,r=ie.SUM_BY_NONZERO_WEIGHTS){const s=d(t,"labels","absoluteDifference"),o=d(e,"predictions","absoluteDifference");let a=null;n!=null&&(a=d(n,"weights","absoluteDifference")),ce(s.shape,o.shape,"Error in absoluteDifference: ");const i=me(P(s,o));return Oe(i,a,r)}const H0=m({absoluteDifference_:V0});function j0(t,e,n,r,s=ie.SUM_BY_NONZERO_WEIGHTS){const o=d(t,"labels","cosineDistance"),a=d(e,"predictions","cosineDistance");let i=null;r!=null&&(i=d(r,"weights","cosineDistance")),ce(o.shape,a.shape,"Error in cosineDistance: ");const c=q(1),l=P(c,z(T(o,a),n,!0));return Oe(l,i,s)}const X0=m({cosineDistance_:j0});function Z0(t,e,n,r=ie.SUM_BY_NONZERO_WEIGHTS){let s=d(t,"labels","hingeLoss");const o=d(e,"predictions","hingeLoss");let a=null;n!=null&&(a=d(n,"weights","hingeLoss")),ce(s.shape,o.shape,"Error in hingeLoss: ");const i=q(1);s=P(T(q(2),s),i);const c=Wn(P(i,T(s,o)));return Oe(c,a,r)}const J0=m({hingeLoss_:Z0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Y0(t,e,n,r=1,s=ie.SUM_BY_NONZERO_WEIGHTS){const o=d(t,"labels","huberLoss"),a=d(e,"predictions","huberLoss");let i=null;n!=null&&(i=d(n,"weights","huberLoss")),ce(o.shape,a.shape,"Error in huberLoss: ");const c=q(r),l=me(P(a,o)),h=Tn(l,c),u=P(l,h),f=F(T(q(.5),Se(h)),T(c,u));return Oe(f,i,s)}const Q0=m({huberLoss_:Y0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function e1(t,e,n,r=1e-7,s=ie.SUM_BY_NONZERO_WEIGHTS){const o=d(t,"labels","logLoss"),a=d(e,"predictions","logLoss");let i=null;n!=null&&(i=d(n,"weights","logLoss")),ce(o.shape,a.shape,"Error in logLoss: ");const c=q(1),l=q(r),h=_e(T(o,Jt(F(a,l)))),u=T(P(c,o),Jt(F(P(c,a),l))),f=P(h,u);return Oe(f,i,s)}const t1=m({logLoss_:e1});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function n1(t,e,n,r=ie.SUM_BY_NONZERO_WEIGHTS){const s=d(t,"labels","meanSquaredError"),o=d(e,"predictions","meanSquaredError");let a=null;n!=null&&(a=d(n,"weights","meanSquaredError")),ce(s.shape,o.shape,"Error in meanSquaredError: ");const i=ol(s,o);return Oe(i,a,r)}const r1=m({meanSquaredError_:n1});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function s1(t,e){const n=d(t,"labels","sigmoidCrossEntropyWithLogits"),r=d(e,"logits","sigmoidCrossEntropyWithLogits");ce(n.shape,r.shape,"Error in sigmoidCrossEntropyWithLogits: ");const s=Wn(r),o=T(r,n),a=Uc(lt(_e(me(r))));return F(P(s,o),a)}function o1(t,e,n,r=0,s=ie.SUM_BY_NONZERO_WEIGHTS){let o=d(t,"multiClassLabels","sigmoidCrossEntropy");const a=d(e,"logits","sigmoidCrossEntropy");let i=null;if(n!=null&&(i=d(n,"weights","sigmoidCrossEntropy")),ce(o.shape,a.shape,"Error in sigmoidCrossEntropy: "),r>0){const l=q(r),h=q(1),u=q(.5);o=F(T(o,P(h,l)),T(u,l))}const c=s1(o,a);return Oe(c,i,s)}const a1=m({sigmoidCrossEntropy_:o1});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function i1(t,e,n=-1){if(n===-1&&(n=e.rank-1),n!==e.rank-1)throw Error(`Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank ${e.rank} and dim was ${n}`);return Ne((s,o,a)=>{const c=zc(o,[n],!0),l=P(j(o,"float32"),c);a([s,l]);const h=_e(T(l,s));return{value:z(h,[n]),gradFunc:(p,w)=>{const[y,$]=w,k=un(p.shape,[n]);return[T(E(p,k),P(j(y,"float32"),lt($))),T(E(p,k),P(lt($),j(y,"float32")))]}}})(t,e)}function c1(t,e,n,r=0,s=ie.SUM_BY_NONZERO_WEIGHTS){let o=d(t,"onehotLabels","softmaxCrossEntropy");const a=d(e,"logits","softmaxCrossEntropy");let i=null;if(n!=null&&(i=d(n,"weights","softmaxCrossEntropy")),ce(o.shape,a.shape,"Error in softmaxCrossEntropy: "),r>0){const l=q(r),h=q(1),u=q(o.shape[1]);o=F(T(o,P(h,l)),K(l,u))}const c=i1(o,a);return Oe(c,i,s)}const l1=m({softmaxCrossEntropy_:c1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function u1(t,e,n,r){const s=d(t,"indices","sparseFillEmptyRows","int32"),o=d(e,"values","sparseFillEmptyRows"),a=d(n,"denseShape","sparseFillEmptyRows","int32"),i=d(r,"defaultValue","sparseFillEmptyRows",o.dtype);if(s.rank!==2)throw new Error(`Indices should be Tensor2D but received shape
        ${s.shape}`);if(o.rank!==1)throw new Error(`Values should be Tensor1D but received shape ${o.shape}`);if(a.rank!==1)throw new Error(`Dense shape should be Tensor1D but received shape ${a.shape}`);if(i.rank!==0)throw new Error(`Default value should be a scalar but received shape ${i.shape}`);const c={indices:s,values:o,denseShape:a,defaultValue:i},l=b.runKernel($i,c);return{outputIndices:l[0],outputValues:l[1],emptyRowIndicator:l[2],reverseIndexMap:l[3]}}const h1=m({sparseFillEmptyRows_:u1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function f1(t,e,n){const r=d(t,"inputIndices","sparseReshape","int32"),s=d(e,"inputShape","sparseReshape","int32"),o=d(n,"newShape","sparseReshape","int32");if(r.rank!==2)throw new Error(`Input indices should be Tensor2D but received shape
        ${r.shape}`);if(s.rank!==1)throw new Error(`Input shape should be Tensor1D but received shape ${s.shape}`);if(o.rank!==1)throw new Error(`New shape should be Tensor1D but received shape ${o.shape}`);const a={inputIndices:r,inputShape:s,newShape:o},i=b.runKernel(Ei,a);return{outputIndices:i[0],outputShape:i[1]}}const d1=m({sparseReshape_:f1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function p1(t,e,n){const r=d(t,"data","sparseSegmentMean"),s=d(e,"indices","sparseSegmentMean","int32"),o=d(n,"segmentIds","sparseSegmentMean","int32");if(r.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(s.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
          ${s.shape}`);if(o.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
          ${o.shape}`);const a={data:r,indices:s,segmentIds:o};return b.runKernel(xi,a)}const g1=m({sparseSegmentMean_:p1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function m1(t,e,n){const r=d(t,"data","sparseSegmentSum"),s=d(e,"indices","sparseSegmentSum","int32"),o=d(n,"segmentIds","sparseSegmentSum","int32");if(r.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(s.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
         ${s.shape}`);if(o.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
         ${o.shape}`);const a={data:r,indices:s,segmentIds:o};return b.runKernel(ki,a)}const b1=m({sparseSegmentSum_:m1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function w1(t,e,n,r,s,o,a,i){const c=d(t,"data","stringNGrams","string");if(c.dtype!=="string")throw new Error("Data must be of datatype string");if(c.shape.length!==1)throw new Error(`Data must be a vector, saw: ${c.shape}`);const l=d(e,"dataSplits","stringNGrams");if(l.dtype!=="int32")throw new Error("Data splits must be of datatype int32");const h={separator:n,nGramWidths:r,leftPad:s,rightPad:o,padWidth:a,preserveShortSequences:i},u={data:c,dataSplits:l},f=b.runKernel(Ai,u,h);return{nGrams:f[0],nGramsSplits:f[1]}}const y1=m({stringNGrams_:w1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $1(t,e,n=!0){const r=d(t,"input","stringSplit","string"),s=d(e,"delimiter","stringSplit","string");if(r.rank!==1)throw new Error(`Input should be Tensor1D but received shape ${r.shape}`);if(s.rank!==0)throw new Error(`Delimiter should be a scalar but received shape ${s.shape}`);const o={skipEmpty:n},a={input:r,delimiter:s},i=b.runKernel(_i,a,o);return{indices:i[0],values:i[1],shape:i[2]}}const E1=m({stringSplit_:$1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function x1(t,e){const n=d(t,"input","stringToHashBucketFast","string"),r={numBuckets:e};if(e<=0)throw new Error("Number of buckets must be at least 1");const s={input:n};return b.runKernel(Di,s,r)}const k1=m({stringToHashBucketFast_:x1});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function v1(t,e,n,r=!0){const s=d(t,"input","staticRegexReplace","string"),o={pattern:e,rewrite:n,replaceGlobal:r};return b.runKernel(Ii,{x:s},o)}const S1=m({staticRegexReplace_:v1});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const I1={fft:ns,ifft:An,rfft:rs,irfft:sl},T1={hammingWindow:Jw,hannWindow:fl,frame:dl,stft:t0},A1={flipLeftRight:o0,grayscaleToRGB:i0,resizeNearestNeighbor:F0,resizeBilinear:N0,rgbToGrayscale:l0,rotateWithOffset:h0,cropAndResize:r0,nonMaxSuppression:d0,nonMaxSuppressionAsync:E0,nonMaxSuppressionWithScore:k0,nonMaxSuppressionWithScoreAsync:S0,nonMaxSuppressionPadded:T0,nonMaxSuppressionPaddedAsync:_0,threshold:C0,transform:O0},_1={bandPart:W0,gramSchmidt:q0,qr:z0},D1={absoluteDifference:H0,computeWeightedLoss:Oe,cosineDistance:X0,hingeLoss:J0,huberLoss:Q0,logLoss:t1,meanSquaredError:r1,sigmoidCrossEntropy:a1,softmaxCrossEntropy:l1},N1={sparseFillEmptyRows:h1,sparseReshape:d1,sparseSegmentMean:g1,sparseSegmentSum:b1},M1={stringNGrams:y1,stringSplit:E1,stringToHashBucketFast:k1,staticRegexReplace:S1};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const F1=new Map,xr=new Map;class bl{getClassName(){return this.constructor.className}static fromConfig(e,n){return new e(n)}}class Ue{constructor(){this.classNameMap={}}static getMap(){return Ue.instance==null&&(Ue.instance=new Ue),Ue.instance}static register(e){Ue.getMap().classNameMap[e.className]=[e,e.fromConfig]}}function wl(t,e,n){g(t.className!=null,()=>"Class being registered does not have the static className property defined."),g(typeof t.className=="string",()=>"className is required to be a string, but got type "+typeof t.className),g(t.className.length>0,()=>"Class being registered has an empty-string as its className, which is disallowed."),typeof e>"u"&&(e="Custom"),typeof n>"u"&&(n=t.className);const r=n,s=e+">"+r;return Ue.register(t),F1.set(s,t),xr.set(t,s),t}function R1(t){return xr.has(t)?xr.get(t):t.className}var B1=Object.freeze({__proto__:null,Serializable:bl,SerializationMap:Ue,getRegisteredName:R1,registerClass:wl});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Je extends bl{minimize(e,n=!1,r){const{value:s,grads:o}=this.computeGradients(e,r);if(r!=null){const a=r.map(i=>({name:i.name,tensor:o[i.name]}));this.applyGradients(a)}else this.applyGradients(o);return le(o),n?s:(s.dispose(),null)}get iterations(){return this.iterations_==null&&(this.iterations_=0),this.iterations_}incrementIterations(){this.iterations_=this.iterations+1}computeGradients(e,n){return qc(e,n)}dispose(){this.iterations_!=null&&le(this.iterations_)}async saveIterations(){return this.iterations_==null&&(this.iterations_=0),{name:"iter",tensor:q(this.iterations_,"int32")}}async getWeights(){throw new Error("getWeights() is not implemented for this optimizer yet.")}async setWeights(e){throw new Error(`setWeights() is not implemented for this optimizer class ${this.getClassName()}`)}async extractIterations(e){return this.iterations_=(await e[0].tensor.data())[0],e.slice(1)}}Object.defineProperty(Je,Symbol.hasInstance,{value:t=>t.minimize!=null&&t.computeGradients!=null&&t.applyGradients!=null});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class ls extends Je{static get className(){return"Adadelta"}constructor(e,n,r=null){super(),this.learningRate=e,this.rho=n,this.epsilon=r,this.accumulatedGrads=[],this.accumulatedUpdates=[],r==null&&(this.epsilon=b.backend.epsilon())}applyGradients(e){(Array.isArray(e)?e.map(r=>r.name):Object.keys(e)).forEach((r,s)=>{const o=b.registeredVariables[r],a=!1;this.accumulatedGrads[s]==null&&(this.accumulatedGrads[s]={originalName:`${r}/accum_grad`,variable:ee(()=>be(o).variable(a))}),this.accumulatedUpdates[s]==null&&(this.accumulatedUpdates[s]={originalName:`${r}/accum_var`,variable:ee(()=>be(o).variable(a))});const i=Array.isArray(e)?e[s].tensor:e[r];if(i==null)return;const c=this.accumulatedGrads[s].variable,l=this.accumulatedUpdates[s].variable;ee(()=>{const h=F(T(c,this.rho),T(Se(i),1-this.rho)),u=T(K(Be(F(l,this.epsilon)),Be(F(c,this.epsilon))),i),f=F(T(l,this.rho),T(Se(u),1-this.rho));c.assign(h),l.assign(f);const p=F(T(u,-this.learningRate),o);o.assign(p)})}),this.incrementIterations()}dispose(){this.accumulatedUpdates!=null&&(le(this.accumulatedGrads.map(e=>e.variable)),le(this.accumulatedUpdates.map(e=>e.variable)))}async getWeights(){const e=[...this.accumulatedGrads,...this.accumulatedUpdates];return[await this.saveIterations()].concat(e.map(n=>({name:n.originalName,tensor:n.variable})))}async setWeights(e){e=await this.extractIterations(e);const n=e.length/2,r=!1;this.accumulatedGrads=e.slice(0,n).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.accumulatedUpdates=e.slice(n,n*2).map(s=>({originalName:s.name,variable:s.tensor.variable(r)}))}getConfig(){return{learningRate:this.learningRate,rho:this.rho,epsilon:this.epsilon}}static fromConfig(e,n){return new e(n.learningRate,n.rho,n.epsilon)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class us extends Je{static get className(){return"Adagrad"}constructor(e,n=.1){super(),this.learningRate=e,this.initialAccumulatorValue=n,this.accumulatedGrads=[]}applyGradients(e){(Array.isArray(e)?e.map(r=>r.name):Object.keys(e)).forEach((r,s)=>{const o=b.registeredVariables[r];this.accumulatedGrads[s]==null&&(this.accumulatedGrads[s]={originalName:`${r}/accumulator`,variable:ee(()=>ln(o.shape,this.initialAccumulatorValue).variable(!1))});const a=Array.isArray(e)?e[s].tensor:e[r];if(a==null)return;const i=this.accumulatedGrads[s].variable;ee(()=>{const c=F(i,Se(a));i.assign(c);const l=F(T(K(a,Be(F(c,b.backend.epsilon()))),-this.learningRate),o);o.assign(l)})}),this.incrementIterations()}dispose(){this.accumulatedGrads!=null&&le(this.accumulatedGrads.map(e=>e.variable))}async getWeights(){return[await this.saveIterations()].concat(this.accumulatedGrads.map(e=>({name:e.originalName,tensor:e.variable})))}async setWeights(e){e=await this.extractIterations(e);const n=!1;this.accumulatedGrads=e.map(r=>({originalName:r.name,variable:r.tensor.variable(n)}))}getConfig(){return{learningRate:this.learningRate,initialAccumulatorValue:this.initialAccumulatorValue}}static fromConfig(e,n){return new e(n.learningRate,n.initialAccumulatorValue)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class hs extends Je{static get className(){return"Adam"}constructor(e,n,r,s=null){super(),this.learningRate=e,this.beta1=n,this.beta2=r,this.epsilon=s,this.accumulatedFirstMoment=[],this.accumulatedSecondMoment=[],ee(()=>{this.accBeta1=q(n).variable(),this.accBeta2=q(r).variable()}),s==null&&(this.epsilon=b.backend.epsilon())}applyGradients(e){const n=Array.isArray(e)?e.map(r=>r.name):Object.keys(e);ee(()=>{const r=P(1,this.accBeta1),s=P(1,this.accBeta2);n.forEach((o,a)=>{const i=b.registeredVariables[o],c=!1;this.accumulatedFirstMoment[a]==null&&(this.accumulatedFirstMoment[a]={originalName:`${o}/m`,variable:ee(()=>be(i).variable(c))}),this.accumulatedSecondMoment[a]==null&&(this.accumulatedSecondMoment[a]={originalName:`${o}/v`,variable:ee(()=>be(i).variable(c))});const l=Array.isArray(e)?e[a].tensor:e[o];if(l==null)return;const h=this.accumulatedFirstMoment[a].variable,u=this.accumulatedSecondMoment[a].variable,f=F(T(h,this.beta1),T(l,1-this.beta1)),p=F(T(u,this.beta2),T(Se(l),1-this.beta2)),w=K(f,r),y=K(p,s);h.assign(f),u.assign(p);const $=F(T(K(w,F(Be(y),this.epsilon)),-this.learningRate),i);i.assign($)}),this.accBeta1.assign(T(this.accBeta1,this.beta1)),this.accBeta2.assign(T(this.accBeta2,this.beta2))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.accBeta2.dispose(),this.accumulatedFirstMoment!=null&&le(this.accumulatedFirstMoment.map(e=>e.variable)),this.accumulatedSecondMoment!=null&&le(this.accumulatedSecondMoment.map(e=>e.variable))}async getWeights(){const e=[...this.accumulatedFirstMoment,...this.accumulatedSecondMoment];return[await this.saveIterations()].concat(e.map(n=>({name:n.originalName,tensor:n.variable})))}async setWeights(e){e=await this.extractIterations(e),ee(()=>{this.accBeta1.assign(Zt(this.beta1,this.iterations_+1)),this.accBeta2.assign(Zt(this.beta2,this.iterations_+1))});const n=e.length/2,r=!1;this.accumulatedFirstMoment=e.slice(0,n).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.accumulatedSecondMoment=e.slice(n,n*2).map(s=>({originalName:s.name,variable:s.tensor.variable(r)}))}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon}}static fromConfig(e,n){return new e(n.learningRate,n.beta1,n.beta2,n.epsilon)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class fs extends Je{static get className(){return"Adamax"}constructor(e,n,r,s=null,o=0){super(),this.learningRate=e,this.beta1=n,this.beta2=r,this.epsilon=s,this.decay=o,this.accumulatedFirstMoment=[],this.accumulatedWeightedInfNorm=[],ee(()=>{this.iteration=q(0).variable(),this.accBeta1=q(n).variable()}),s==null&&(this.epsilon=b.backend.epsilon())}applyGradients(e){const n=Array.isArray(e)?e.map(r=>r.name):Object.keys(e);ee(()=>{const r=P(1,this.accBeta1),s=K(-this.learningRate,F(T(this.iteration,this.decay),1));n.forEach((o,a)=>{const i=b.registeredVariables[o],c=!1;this.accumulatedFirstMoment[a]==null&&(this.accumulatedFirstMoment[a]={originalName:`${o}/m`,variable:be(i).variable(c)}),this.accumulatedWeightedInfNorm[a]==null&&(this.accumulatedWeightedInfNorm[a]={originalName:`${o}/v`,variable:be(i).variable(c)});const l=Array.isArray(e)?e[a].tensor:e[o];if(l==null)return;const h=this.accumulatedFirstMoment[a].variable,u=this.accumulatedWeightedInfNorm[a].variable,f=F(T(h,this.beta1),T(l,1-this.beta1)),p=T(u,this.beta2),w=me(l),y=jc(p,w);h.assign(f),u.assign(y);const $=F(T(K(s,r),K(f,F(y,this.epsilon))),i);i.assign($)}),this.iteration.assign(F(this.iteration,1)),this.accBeta1.assign(T(this.accBeta1,this.beta1))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.iteration.dispose(),this.accumulatedFirstMoment!=null&&le(this.accumulatedFirstMoment.map(e=>e.variable)),this.accumulatedWeightedInfNorm!=null&&le(this.accumulatedWeightedInfNorm.map(e=>e.variable))}async getWeights(){throw new Error("getWeights() is not implemented for Adamax yet.")}async setWeights(e){throw new Error("setWeights() is not implemented for Adamax yet.")}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon,decay:this.decay}}static fromConfig(e,n){return new e(n.learningRate,n.beta1,n.beta2,n.epsilon,n.decay)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Vn extends Je{static get className(){return"SGD"}constructor(e){super(),this.learningRate=e,this.setLearningRate(e)}applyGradients(e){(Array.isArray(e)?e.map(r=>r.name):Object.keys(e)).forEach((r,s)=>{const o=Array.isArray(e)?e[s].tensor:e[r];if(o==null)return;const a=b.registeredVariables[r];ee(()=>{const i=F(T(this.c,o),a);a.assign(i)})}),this.incrementIterations()}setLearningRate(e){this.learningRate=e,this.c!=null&&this.c.dispose(),this.c=cc(q(-e))}dispose(){this.c.dispose()}async getWeights(){return[await this.saveIterations()]}async setWeights(e){if(e=await this.extractIterations(e),e.length!==0)throw new Error("SGD optimizer does not have settable weights.")}getConfig(){return{learningRate:this.learningRate}}static fromConfig(e,n){return new e(n.learningRate)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class ds extends Vn{static get className(){return"Momentum"}constructor(e,n,r=!1){super(e),this.learningRate=e,this.momentum=n,this.useNesterov=r,this.accumulations=[],this.m=q(this.momentum)}applyGradients(e){(Array.isArray(e)?e.map(r=>r.name):Object.keys(e)).forEach((r,s)=>{const o=b.registeredVariables[r];this.accumulations[s]==null&&(this.accumulations[s]={originalName:`${r}/momentum`,variable:ee(()=>be(o).variable(!1))});const a=this.accumulations[s].variable,i=Array.isArray(e)?e[s].tensor:e[r];i!=null&&ee(()=>{let c;const l=F(T(this.m,a),i);this.useNesterov?c=F(T(this.c,F(i,T(l,this.m))),o):c=F(T(this.c,l),o),a.assign(l),o.assign(c)})}),this.incrementIterations()}dispose(){this.m.dispose(),this.accumulations!=null&&le(this.accumulations.map(e=>e.variable))}setMomentum(e){this.momentum=e}async getWeights(){return[await this.saveIterations()].concat(this.accumulations.map(e=>({name:e.originalName,tensor:e.variable})))}async setWeights(e){e=await this.extractIterations(e);const n=!1;this.accumulations=e.map(r=>({originalName:r.name,variable:r.tensor.variable(n)}))}getConfig(){return{learningRate:this.learningRate,momentum:this.momentum,useNesterov:this.useNesterov}}static fromConfig(e,n){return new e(n.learningRate,n.momentum,n.useNesterov)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class ps extends Je{static get className(){return"RMSProp"}constructor(e,n=.9,r=0,s=null,o=!1){if(super(),this.learningRate=e,this.decay=n,this.momentum=r,this.epsilon=s,this.accumulatedMeanSquares=[],this.accumulatedMoments=[],this.accumulatedMeanGrads=[],this.centered=o,s==null&&(this.epsilon=b.backend.epsilon()),e==null)throw new Error("learningRate for RMSPropOptimizer must be defined.")}applyGradients(e){(Array.isArray(e)?e.map(r=>r.name):Object.keys(e)).forEach((r,s)=>{const o=b.registeredVariables[r],a=!1;this.accumulatedMeanSquares[s]==null&&(this.accumulatedMeanSquares[s]={originalName:`${r}/rms`,variable:ee(()=>be(o).variable(a))}),this.accumulatedMoments[s]==null&&(this.accumulatedMoments[s]={originalName:`${r}/momentum`,variable:ee(()=>be(o).variable(a))}),this.accumulatedMeanGrads[s]==null&&this.centered&&(this.accumulatedMeanGrads[s]={originalName:`${r}/mg`,variable:ee(()=>be(o).variable(a))});const i=Array.isArray(e)?e[s].tensor:e[r];if(i==null)return;const c=this.accumulatedMeanSquares[s].variable,l=this.accumulatedMoments[s].variable;ee(()=>{const h=F(T(c,this.decay),T(Se(i),1-this.decay));if(this.centered){const u=this.accumulatedMeanGrads[s].variable,f=F(T(u,this.decay),T(i,1-this.decay)),p=K(T(i,this.learningRate),Be(P(h,F(Se(f),this.epsilon)))),w=F(T(l,this.momentum),p);c.assign(h),u.assign(f),l.assign(w);const y=P(o,w);o.assign(y)}else{const u=F(T(c,this.decay),T(Se(i),1-this.decay)),f=F(T(l,this.momentum),K(T(i,this.learningRate),Be(F(u,this.epsilon))));c.assign(u),l.assign(f);const p=P(o,f);o.assign(p)}})}),this.incrementIterations()}dispose(){this.accumulatedMeanSquares!=null&&le(this.accumulatedMeanSquares.map(e=>e.variable)),this.accumulatedMeanGrads!=null&&this.centered&&le(this.accumulatedMeanGrads.map(e=>e.variable)),this.accumulatedMoments!=null&&le(this.accumulatedMoments.map(e=>e.variable))}async getWeights(){const e=[...this.accumulatedMeanSquares,...this.accumulatedMoments];return this.centered&&e.push(...this.accumulatedMeanGrads),[await this.saveIterations()].concat(e.map(n=>({name:n.originalName,tensor:n.variable})))}async setWeights(e){e=await this.extractIterations(e);const n=this.centered?e.length/3:e.length/2,r=!1;this.accumulatedMeanSquares=e.slice(0,n).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.accumulatedMoments=e.slice(n,n*2).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.centered&&(this.accumulatedMeanGrads=e.slice(n*2,n*3).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})))}getConfig(){return{learningRate:this.learningRate,decay:this.decay,momentum:this.momentum,epsilon:this.epsilon,centered:this.centered}}static fromConfig(e,n){return new e(n.learningRate,n.decay,n.momentum,n.epsilon,n.centered)}}/**
 * @license
 * Copyright 2022 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const C1=[ls,us,hs,fs,ds,ps,Vn];function P1(){for(const t of C1)wl(t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const O1="model",L1=".json",W1=".weights.bin";function Fs(t){return new Promise(e=>setTimeout(e)).then(t)}class ht{constructor(e){if(!B().getBool("IS_BROWSER"))throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");e.startsWith(ht.URL_SCHEME)&&(e=e.slice(ht.URL_SCHEME.length)),(e==null||e.length===0)&&(e=O1),this.modelJsonFileName=e+L1,this.weightDataFileName=e+W1}async save(e){if(typeof document>"u")throw new Error("Browser downloads are not supported in this environment since `document` is not present");const n=Te.join(e.weightData),r=window.URL.createObjectURL(new Blob([n],{type:"application/octet-stream"}));if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");{const s=[{paths:["./"+this.weightDataFileName],weights:e.weightSpecs}],o=dc(e,s),a=window.URL.createObjectURL(new Blob([JSON.stringify(o)],{type:"application/json"})),i=this.modelJsonAnchor==null?document.createElement("a"):this.modelJsonAnchor;if(i.download=this.modelJsonFileName,i.href=a,await Fs(()=>i.dispatchEvent(new MouseEvent("click"))),e.weightData!=null){const c=this.weightDataAnchor==null?document.createElement("a"):this.weightDataAnchor;c.download=this.weightDataFileName,c.href=r,await Fs(()=>c.dispatchEvent(new MouseEvent("click")))}return{modelArtifactsInfo:an(e)}}}}ht.URL_SCHEME="downloads://";class U1{constructor(e){if(e==null||e.length<1)throw new Error(`When calling browserFiles, at least 1 file is required, but received ${e}`);this.jsonFile=e[0],this.weightsFiles=e.slice(1)}async load(){return new Promise((e,n)=>{const r=new FileReader;r.onload=s=>{const o=JSON.parse(s.target.result),a=o.modelTopology;if(a==null){n(new Error(`modelTopology field is missing from file ${this.jsonFile.name}`));return}if(o.weightsManifest==null){n(new Error(`weightManifest field is missing from file ${this.jsonFile.name}`));return}if(this.weightsFiles.length===0){e({modelTopology:a});return}const c=Or(o,l=>this.loadWeights(l));e(c)},r.onerror=s=>n(`Failed to read model topology and weights manifest JSON from file '${this.jsonFile.name}'. BrowserFiles supports loading Keras-style tf.Model artifacts only.`),r.readAsText(this.jsonFile)})}loadWeights(e){const n=[],r=[];for(const a of e)n.push(...a.weights),r.push(...a.paths);const s=this.checkManifestAndWeightFiles(e),o=r.map(a=>this.loadWeightsFile(a,s[a]));return Promise.all(o).then(a=>[n,a])}loadWeightsFile(e,n){return new Promise((r,s)=>{const o=new FileReader;o.onload=a=>{const i=a.target.result;r(i)},o.onerror=a=>s(`Failed to weights data from file of path '${e}'.`),o.readAsArrayBuffer(n)})}checkManifestAndWeightFiles(e){const n=[],r=this.weightsFiles.map(o=>Ds(o.name)),s={};for(const o of e)o.paths.forEach(a=>{const i=Ds(a);if(n.indexOf(i)!==-1)throw new Error(`Duplicate file basename found in weights manifest: '${i}'`);if(n.push(i),r.indexOf(i)===-1)throw new Error(`Weight file with basename '${i}' is not provided.`);s[a]=this.weightsFiles[r.indexOf(i)]});if(n.length!==this.weightsFiles.length)throw new Error(`Mismatch in the number of files in weights manifest (${n.length}) and the number of weight files provided (${this.weightsFiles.length}).`);return s}}const q1=t=>B().getBool("IS_BROWSER")&&!Array.isArray(t)&&t.startsWith(ht.URL_SCHEME)?G1(t.slice(ht.URL_SCHEME.length)):null;J.registerSaveRouter(q1);function G1(t="model"){return new ht(t)}function z1(t){return new U1(t)}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rs(t,e,n,r){a(t),n=n??0,r=r??1,i(n,r);let s=0;const o=c=>(c.then(l=>{const h=n+ ++s/t.length*(r-n);return e(h),l}),c);function a(c){g(c!=null&&Array.isArray(c)&&c.length>0,()=>"promises must be a none empty array")}function i(c,l){g(c>=0&&c<=1,()=>`Progress fraction must be in range [0, 1], but got startFraction ${c}`),g(l>=0&&l<=1,()=>`Progress fraction must be in range [0, 1], but got endFraction ${l}`),g(l>=c,()=>`startFraction must be no more than endFraction, but got startFraction ${c} and endFraction ${l}`)}return Promise.all(t.map(o))}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function yl(t,e){e==null&&(e={});const n=e.fetchFunc==null?B().platform.fetch:e.fetchFunc,r=t.map(u=>n(u,e.requestInit,{isBinary:!0})),i=(e.onProgress==null?await Promise.all(r):await Rs(r,e.onProgress,0,.5)).map(u=>u.arrayBuffer());return e.onProgress==null?await Promise.all(i):await Rs(i,e.onProgress,.5,1)}function K1(t,e){var n;const r=e.fetchFunc==null?B().platform.fetch:e.fetchFunc;let s=0,o;return(n=e.onProgress)===null||n===void 0||n.call(e,0),new ReadableStream({pull:async a=>{for(var i;s<t.length;){o||(o=(await r(t[s],e.requestInit,{isBinary:!0})).body.getReader());const{done:c,value:l}=await o.read();if(c){s++,o=void 0,(i=e.onProgress)===null||i===void 0||i.call(e,s/t.length);continue}a.enqueue(l);return}a.close()}})}async function V1(t,e="",n,r){return $l(a=>yl(a,{requestInit:r}))(t,e,n)}function $l(t){return async(e,n="",r)=>{const s=e.map(()=>!1),o={},a=r!=null?r.map(()=>!1):[],i=[];if(e.forEach((p,w)=>{let y=0;p.weights.forEach($=>{const k="quantization"in $?$.quantization.dtype:$.dtype,N=ot[k]*W($.shape),x=()=>{s[w]=!0,o[w]==null&&(o[w]=[]),o[w].push({manifestEntry:$,groupOffset:y,sizeBytes:N})};r!=null?r.forEach((v,I)=>{v===$.name&&(x(),a[I]=!0)}):x(),i.push($.name),y+=N})}),!a.every(p=>p)){const p=r.filter((w,y)=>!a[y]);throw new Error(`Could not find weights in manifest with names: ${p.join(", ")}. 
Manifest JSON has weights with names: ${i.join(", ")}.`)}const c=s.reduce((p,w,y)=>(w&&p.push(y),p),[]),l=[];c.forEach(p=>{e[p].paths.forEach(w=>{const y=n+(n.endsWith("/")?"":"/")+w;l.push(y)})});const h=await t(l),u={};let f=0;return c.forEach(p=>{const w=e[p].paths.length,y=new Te(h.slice(f,f+w));o[p].forEach(k=>{const N=y.slice(k.groupOffset,k.groupOffset+k.sizeBytes),x=hc(N,[k.manifestEntry]);for(const v in x)u[v]=x[v]}),f+=w}),u}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const H1="application/octet-stream",j1="application/json";class gs{constructor(e,n){if(this.DEFAULT_METHOD="POST",n==null&&(n={}),this.weightPathPrefix=n.weightPathPrefix,this.weightUrlConverter=n.weightUrlConverter,n.fetchFunc!=null?(g(typeof n.fetchFunc=="function",()=>"Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)"),this.fetch=n.fetchFunc):this.fetch=B().platform.fetch,g(e!=null&&e.length>0,()=>"URL path for http must not be null, undefined or empty."),Array.isArray(e)&&g(e.length===2,()=>`URL paths for http must have a length of 2, (actual length is ${e.length}).`),this.path=e,n.requestInit!=null&&n.requestInit.body!=null)throw new Error("requestInit is expected to have no pre-existing body, but has one.");this.requestInit=n.requestInit||{},this.loadOptions=n}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");const n=Object.assign({method:this.DEFAULT_METHOD},this.requestInit);n.body=new FormData;const r=[{paths:["./model.weights.bin"],weights:e.weightSpecs}],s=dc(e,r);if(n.body.append("model.json",new Blob([JSON.stringify(s)],{type:j1}),"model.json"),e.weightData!=null){const a=Te.join(e.weightData);n.body.append("model.weights.bin",new Blob([a],{type:H1}),"model.weights.bin")}const o=await this.fetch(this.path,n);if(o.ok)return{modelArtifactsInfo:an(e),responses:[o]};throw new Error(`BrowserHTTPRequest.save() failed due to HTTP response status ${o.status}.`)}async loadModelJSON(){const e=await this.fetch(this.path,this.requestInit);if(!e.ok)throw new Error(`Request to ${this.path} failed with status code ${e.status}. Please verify this URL points to the model JSON of the model to load.`);let n;try{n=await e.json()}catch{let a=`Failed to parse model JSON of response from ${this.path}.`;throw this.path.endsWith(".pb")?a+=" Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository.":a+=" Please make sure the server is serving valid JSON for this request.",new Error(a)}const r=n.modelTopology,s=n.weightsManifest;if(r==null&&s==null)throw new Error(`The JSON from HTTP path ${this.path} contains neither model topology or manifest for weights.`);return n}async load(){if(this.loadOptions.streamWeights)return this.loadStream();const e=await this.loadModelJSON();return Or(e,n=>this.loadWeights(n))}async loadStream(){const e=await this.loadModelJSON(),n=await this.getWeightUrls(e.weightsManifest),r=fr(e.weightsManifest),s=()=>K1(n,this.loadOptions);return Object.assign(Object.assign({},e),{weightSpecs:r,getWeightStream:s})}async getWeightUrls(e){const n=Array.isArray(this.path)?this.path[1]:this.path,[r,s]=X1(n),o=this.weightPathPrefix||r,a=[],i=[];for(const c of e)for(const l of c.paths)this.weightUrlConverter!=null?i.push(this.weightUrlConverter(l)):a.push(o+l+s);return this.weightUrlConverter&&a.push(...await Promise.all(i)),a}async loadWeights(e){const n=await this.getWeightUrls(e),r=fr(e),s=await yl(n,this.loadOptions);return[r,s]}}gs.URL_SCHEME_REGEX=/^https?:\/\//;function X1(t){const e=t.lastIndexOf("/"),n=t.lastIndexOf("?"),r=t.substring(0,e),s=n>e?t.substring(n):"";return[r+"/",s]}function kr(t){return t.match(gs.URL_SCHEME_REGEX)!=null}const El=(t,e)=>{if(typeof fetch>"u"&&(e==null||e.fetchFunc==null))return null;{let n=!0;if(Array.isArray(t)?n=t.every(r=>kr(r)):n=kr(t),n)return ms(t,e)}return null};J.registerSaveRouter(El);J.registerLoadRouter(El);function ms(t,e){return new gs(t,e)}function Z1(t,e){return ms(t,e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Jn{constructor(e){this.modelArtifacts=e}load(){return this.modelArtifacts}}class xl{constructor(e){this.saveHandler=e}save(e){return this.saveHandler(e)}}class J1{constructor(e){e.load&&(this.load=()=>Promise.resolve(e.load())),e.save&&(this.save=n=>Promise.resolve(e.save(n)))}}function Y1(t,e,n,r){const s=arguments;return new J1(kl(...s))}function kl(t,e,n,r){return arguments.length===1?t.modelTopology!=null||t.weightSpecs!=null?new Jn(t):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new Jn({modelTopology:t})):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new Jn({modelTopology:t,weightSpecs:e,weightData:n,trainingConfig:r}))}function Q1(t){return new xl(t)}function ey(t){return new xl(t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var ty=Object.freeze({__proto__:null,CompositeArrayBuffer:Te,browserFiles:z1,browserHTTPRequest:Z1,concatenateArrayBuffers:Ph,copyModel:of,decodeWeights:hc,decodeWeightsStream:Fh,encodeWeights:Dh,fromMemory:Y1,fromMemorySync:kl,getLoadHandlers:Kh,getModelArtifactsForJSON:Or,getModelArtifactsForJSONSync:pc,getModelArtifactsInfoForJSON:an,getSaveHandlers:zh,getWeightSpecs:fr,http:ms,isHTTPScheme:kr,listModels:rf,loadWeights:V1,moveModel:af,registerLoadRouter:Gh,registerSaveRouter:qh,removeModel:sf,weightsLoaderFactory:$l,withSaveHandler:Q1,withSaveHandlerSync:ey});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ny(t,e,n){const r=d(t,"labels","confusionMatrix"),s=d(e,"predictions","confusionMatrix");g(n==null||n>0&&Number.isInteger(n),()=>`If provided, numClasses must be a positive integer, but got ${n}`),g(r.rank===1,()=>`Expected the rank of labels to be 1, but got ${r.rank}`),g(s.rank===1,()=>`Expected the rank of predictions to be 1, but got ${s.rank}`),g(r.shape[0]===s.shape[0],()=>`Mismatch in the number of examples: ${r.shape[0]} vs. ${s.shape[0]}. Labels and predictions should have the same number of elements.`),g(n>0&&Number.isInteger(n),()=>`numClasses is required to be a positive integer, but got ${n}`);const o=$r(j(r,"int32"),n),a=$r(j(s,"int32"),n),i=_n(o),c=L(i,a);return j(c,"int32")}const ry=m({confusionMatrix_:ny});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var sy=Object.freeze({__proto__:null,confusionMatrix:ry});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */let Ye,Bs=!1;function vl(t,e=3){if(e>4)throw new Error("Cannot construct Tensor with more than 4 channels from pixels.");if(t==null)throw new Error("pixels passed to tf.browser.fromPixels() can not be null");let n=!1,r=!1,s=!1,o=!1,a=!1,i=!1;if(t.data instanceof Uint8Array)n=!0;else if(typeof ImageData<"u"&&t instanceof ImageData)r=!0;else if(typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement)s=!0;else if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement)o=!0;else if(t.getContext!=null)a=!0;else if(typeof ImageBitmap<"u"&&t instanceof ImageBitmap)i=!0;else throw new Error(`pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData in browser, or OffscreenCanvas, ImageData in webworker or {data: Uint32Array, width: number, height: number}, but was ${t.constructor.name}`);if(Gt(Qn,b.backendName)!=null){const w={pixels:t},y={numChannels:e};return b.runKernel(Qn,w,y)}const[l,h]=s?[t.videoWidth,t.videoHeight]:[t.width,t.height];let u;if(a)u=t.getContext("2d").getImageData(0,0,l,h).data;else if(r||n)u=t.data;else if(o||s||i){if(Ye==null)if(typeof document>"u")if(typeof OffscreenCanvas<"u"&&typeof OffscreenCanvasRenderingContext2D<"u")Ye=new OffscreenCanvas(1,1).getContext("2d");else throw new Error("Cannot parse input in current context. Reason: OffscreenCanvas Context2D rendering is not supported.");else Ye=document.createElement("canvas").getContext("2d",{willReadFrequently:!0});Ye.canvas.width=l,Ye.canvas.height=h,Ye.drawImage(t,0,0,l,h),u=Ye.getImageData(0,0,l,h).data}let f;if(e===4)f=new Int32Array(u);else{const w=l*h;f=new Int32Array(w*e);for(let y=0;y<w;y++)for(let $=0;$<e;++$)f[y*e+$]=u[y*4+$]}return il(f,[h,l,e],"int32")}function oy(t){return t!=null&&t.data instanceof Uint8Array}function ay(){return typeof window<"u"&&typeof ImageBitmap<"u"&&window.hasOwnProperty("createImageBitmap")}function iy(t){return t!=null&&t.width!==0&&t.height!==0}function cy(t){return ay()&&!(t instanceof ImageBitmap)&&iy(t)&&!oy(t)}async function ly(t,e=3){let n=null;if(B().getBool("WRAP_TO_IMAGEBITMAP")&&cy(t)){let r;try{r=await createImageBitmap(t,{premultiplyAlpha:"none"})}catch{r=null}r!=null&&r.width===t.width&&r.height===t.height?n=r:n=t}else n=t;return vl(n,e)}function Sl(t){if(t.rank!==2&&t.rank!==3)throw new Error(`toPixels only supports rank 2 or 3 tensors, got rank ${t.rank}.`);const e=t.rank===2?1:t.shape[2];if(e>4||e===2)throw new Error(`toPixels only supports depth of size 1, 3 or 4 but got ${e}`);if(t.dtype!=="float32"&&t.dtype!=="int32")throw new Error(`Unsupported type for toPixels: ${t.dtype}. Please use float32 or int32 tensors.`)}function uy(t){const e=t?.alpha||1;if(e>1||e<0)throw new Error(`Alpha value ${e} is suppoed to be in range [0 - 1].`)}async function hy(t,e){let n=d(t,"img","toPixels");if(!(t instanceof Q)){const l=n;n=j(l,"int32"),l.dispose()}Sl(n);const[r,s]=n.shape.slice(0,2),o=n.rank===2?1:n.shape[2],a=await n.data(),i=n.dtype==="float32"?255:1,c=new Uint8ClampedArray(s*r*4);for(let l=0;l<r*s;++l){const h=[0,0,0,255];for(let f=0;f<o;f++){const p=a[l*o+f];if(n.dtype==="float32"){if(p<0||p>1)throw new Error(`Tensor values for a float32 Tensor must be in the range [0 - 1] but encountered ${p}.`)}else if(n.dtype==="int32"&&(p<0||p>255))throw new Error(`Tensor values for a int32 Tensor must be in the range [0 - 255] but encountered ${p}.`);o===1?(h[0]=p*i,h[1]=p*i,h[2]=p*i):h[f]=p*i}const u=l*4;c[u+0]=Math.round(h[0]),c[u+1]=Math.round(h[1]),c[u+2]=Math.round(h[2]),c[u+3]=Math.round(h[3])}if(e!=null){Bs||Gt(Nr,b.backendName)!=null&&(console.warn("tf.browser.toPixels is not efficient to draw tensor on canvas. Please try tf.browser.draw instead."),Bs=!0),e.width=s,e.height=r;const l=e.getContext("2d"),h=new ImageData(c,s,r);l.putImageData(h,0,0)}return n!==t&&n.dispose(),c}function fy(t,e,n){let r=d(t,"img","draw");if(!(t instanceof Q)){const a=r;r=j(a,"int32"),a.dispose()}Sl(r),uy(n?.imageOptions);const s={image:r},o={canvas:e,options:n};b.runKernel(Nr,s,o)}const dy=m({fromPixels_:vl});var py=Object.freeze({__proto__:null,draw:fy,fromPixels:dy,fromPixelsAsync:ly,toPixels:hy});function Il(t,e){const n=t.shape.length,r=e.shape.length;if(n<1)throw new Error(`tf.gatherND() expects the input to be rank 1 or higher, but the rank was ${n}.`);if(r<1)throw new Error(`tf.gatherND() expects the indices to be rank 1 or higher, but the rank was ${r}.`);if(e.dtype!=="int32")throw new Error(`tf.gatherND() expects the indices to be int32 type, but the dtype was ${e.dtype}.`);if(e.shape[r-1]>n)throw new Error(`index innermost dimension length must be <= tensor rank; saw: ${e.shape[r-1]} vs. ${n}`);if(W(t.shape)===0)throw new Error(`Requested more than 0 entries, but input is empty. Input shape: ${t.shape}.`);const s=e.shape,o=s[s.length-1];let a=1;for(let u=0;u<s.length-1;++u)a*=s[u];const i=t.shape,c=s.slice();c.pop();let l=1;for(let u=o;u<n;++u)l*=i[u],c.push(i[u]);const h=[...Ft(t.shape).map(u=>u/l),1].slice(0,o);return[c,a,l,h]}var gy=Object.freeze({__proto__:null,prepareAndValidate:Il});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const vr=-2,my=-1;function by(t,e,n){const r=t.shape.length;g(r===e.length,()=>`Error in slice${r}D: Length of begin ${e} must match the rank of the array (${r}).`),g(r===n.length,()=>`Error in slice${r}D: Length of size ${n} must match the rank of the array (${r}).`);for(let s=0;s<r;++s)g(e[s]+n[s]<=t.shape[s],()=>`Error in slice${r}D: begin[${s}] + size[${s}] (${e[s]+n[s]}) would overflow input.shape[${s}] (${t.shape[s]})`)}function wy(t){const e=[];let n=0;for(;t>0;)t&1&&e.push(n),t/=2,n++;return e}function yy(t,e,n){const r=[];for(let s=0;s<t.length;s++)r[s]=Math.ceil((e[s]-t[s])/n[s]);return r}function Tl(t,e,n,r){const s=[...t];for(let o=s.length;o<r.length;o++)s.push(1);for(let o=0;o<n;o++)o===0?s[e]=1:(s.splice(e,0,1),s.pop());return s}function Al(t,e,n){return n<=t?n:n-(e-1)}function _l(t,e){const n=[];for(let r=0;r<t;r++)n.push(e+r);return n}function $y(t,e,n,r,s,o,a,i,c){const l=t.length;let h=new Array(l),u=new Array(l),f=new Array(l);if(e.length&&n>0){const p=e[0],w=n+1;h=Dl(a,p,w,r,t),u=Nl(i,p,w,s,t),f=Tl(o,p,w,t)}else for(let p=0;p<l;p++)h[p]=Fl(a,r,o,t,p,c),u[p]=Rl(i,s,o,t,p,c),f[p]=Ml(o,p,c);return{begin:h,end:u,strides:f}}function Dl(t,e,n,r,s){const o=[...s],a=_l(n,e);for(let i=0;i<o.length;i++)if(a.indexOf(i)>-1)o[i]=0;else{const c=Al(e,n,i);let l=r[c];t&1<<c&&(l=0),o[i]=l}return o}function Nl(t,e,n,r,s){const o=[...s],a=_l(n,e);for(let i=0;i<o.length;i++)if(a.indexOf(i)>-1)o[i]=Number.MAX_SAFE_INTEGER;else{const c=Al(e,n,i);let l=r[c];t&1<<c&&(l=Number.MAX_SAFE_INTEGER),o[i]=l}for(let i=0;i<o.length;i++){const c=s[i];o[i]<0&&(o[i]+=c),o[i]=Ut(0,o[i],s[i])}return o}function Ml(t,e,n){let r=t[e];return(n&1<<e||r==null)&&(r=1),r}function Fl(t,e,n,r,s,o){let a=e[s];const i=n[s]||1;(t&1<<s||o&1<<s||a==null)&&(i>0?a=Number.MIN_SAFE_INTEGER:a=Number.MAX_SAFE_INTEGER);const c=r[s];return a<0&&(a+=c),a=Ut(0,a,c-1),a}function Rl(t,e,n,r,s,o){let a=e[s];const i=n[s]||1;(t&1<<s||o&1<<s||a==null)&&(i>0?a=Number.MAX_SAFE_INTEGER:a=Number.MIN_SAFE_INTEGER);const c=r[s];return a<0&&(a+=c),i>0?a=Ut(0,a,c):a=Ut(-1,a,c-1),a}function Ey(t,e,n){let r=n.length;for(let s=0;s<n.length;s++)if(n[s]>1){r=s;break}for(let s=r+1;s<n.length;s++)if(e[s]>0||n[s]!==t[s])return!1;return!0}function xy(t,e){let n=t.length>0?t[t.length-1]:1;for(let r=0;r<t.length-1;r++)n+=t[r]*e[r];return n}function ky(t,e,n){let r;const s=t.shape.length;typeof e=="number"?r=[e,...new Array(s-1).fill(0)]:e.length<s?r=e.concat(new Array(s-e.length).fill(0)):r=e.slice(),r.forEach(a=>{g(a!==-1,()=>"slice() does not support negative begin indexing.")});let o;return n==null?o=new Array(s).fill(-1):typeof n=="number"?o=[n,...new Array(s-1).fill(-1)]:n.length<s?o=n.concat(new Array(s-n.length).fill(-1)):o=n,o=o.map((a,i)=>a>=0?a:(g(a===-1,()=>`Negative size values should be exactly -1 but got ${a} for the slice() size at index ${i}.`),t.shape[i]-r[i])),[r,o]}function vy(t,e,n,r,s,o,a,i,c){let l;if(r==null?(l=new Array(e.length),l.fill(1)):l=r,a!=null&&a&a-1)throw new Error("Multiple ellipses in slice is not allowed.");let h=!1;const u={dims:l.length,numAddAxisAfterEllipsis:0,begin:e.slice(),end:n.slice(),strides:l.slice(),beginMask:s,endMask:o,ellipsisMask:a,newAxisMask:i,shrinkAxisMask:c};for(let x=0;x<u.dims;x++)h&&1<<x&i&&u.numAddAxisAfterEllipsis++,1<<x&a&&(h=!0);h||(u.ellipsisMask|=1<<u.dims,u.dims++);const f={dims:t.length,beginMask:0,endMask:0,beginValid:!1,endValid:!1};Sy(u,f);let p=!0,w=!0,y=!0;const $=[],k=[];for(let x=0;x<t.length;++x){if(f.strides[x]===0)throw Error(`strides[${x}] must be non-zero`);const v=!!(f.shrinkAxisMask&1<<x),I=t[x];if(I===-1){$.push(v?1:-1);continue}const A=[f.beginMask&1<<x,f.endMask&1<<x],M=[f.strides[x]>0?0:-1,f.strides[x]>0?I:I-1];if(v&&f.strides[x]<=0)throw Error("only stride 1 allowed on non-range indexing.");y=y&&f.strides[x]===1;const _=!!(f.beginMask&1<<x&&f.endMask&1<<x);if(f.beginValid&&f.endValid){if(v){const O=f.begin[x]<0?I+f.begin[x]:f.begin[x];if(f.begin[x]=O,f.end[x]=f.begin[x]+1,O<0||O>=I)throw Error(`slice index ${f.begin[x]} of dimension ${x} out of bounds.`)}else f.begin[x]=Cs(f.begin[x],0,f.strides[x],I,A,M),f.end[x]=Cs(f.end[x],1,f.strides[x],I,A,M);const R=f.strides[x]===1&&f.begin[x]===0&&f.end[x]===I;p=p&&R,w=w&&(x===0&&f.strides[x]===1||R)}else p=p&&f.strides[x]===1&&_,w=w&&(x===0&&f.strides[x]===1||_);let D,C=!1;if(f.beginValid&&f.endValid?(D=f.end[x]-f.begin[x],C=!0):v?(D=1,C=!0):_&&I>=0&&(f.strides[x]<0?D=-I:D=I,C=!0),C){let R;D===0||D<0!=f.strides[x]<0?R=0:R=Math.trunc(D/f.strides[x])+(D%f.strides[x]!==0?1:0),$.push(R)}else $.push(-1)}for(let x=0;x<f.finalShapeGatherIndices.length;++x){const v=f.finalShapeGatherIndices[x];v>=0?k.push($[v]):v===vr&&k.push(1)}return{finalShapeSparse:k.filter((x,v)=>f.finalShapeGatherIndices[v]!==vr),finalShape:k,isIdentity:p,sliceDim0:w,isSimpleSlice:y,begin:f.begin,end:f.end,strides:f.strides}}function Sy(t,e){e.beginMask=0,e.endMask=0,e.shrinkAxisMask=0;let n=0;e.beginValid=t.begin!=null,e.endValid=t.end!=null,e.begin=new Array(e.dims),e.end=new Array(e.dims),e.strides=new Array(e.dims),e.finalShapeGatherIndices=[],e.finalShapeGatherIndicesSparse=[],e.inputShapeGatherIndicesSparse=new Array(e.dims);for(let r=0;r<t.dims;r++)if(1<<r&t.ellipsisMask){const s=Math.min(e.dims-(t.dims-r)+1+t.numAddAxisAfterEllipsis,e.dims);for(;n<s;n++)e.begin[n]=0,e.end[n]=0,e.strides[n]=1,e.beginMask|=1<<n,e.endMask|=1<<n,e.finalShapeGatherIndices.push(n),e.finalShapeGatherIndicesSparse.push(-1),e.inputShapeGatherIndicesSparse[n]=r}else if(1<<r&t.newAxisMask)e.finalShapeGatherIndices.push(vr),e.finalShapeGatherIndicesSparse.push(-1);else{if(n===e.begin.length)throw Error(`Index out of range using input dim ${n}; input has only ${e.dims} dims, ${e.begin.length}.`);t.begin!=null&&(e.begin[n]=t.begin[r]),t.end!=null&&(e.end[n]=t.end[r]),e.strides[n]=t.strides[r],t.beginMask&1<<r&&(e.beginMask|=1<<n),t.endMask&1<<r&&(e.endMask|=1<<n),t.shrinkAxisMask&1<<r?(e.finalShapeGatherIndices.push(my),e.finalShapeGatherIndicesSparse.push(-1),e.shrinkAxisMask|=1<<n):(e.finalShapeGatherIndices.push(n),e.finalShapeGatherIndicesSparse.push(r)),e.inputShapeGatherIndicesSparse[n]=r,n++}}function Cs(t,e,n,r,s,o){if(s[e])return n>0?o[e]:o[e+1&1];{const a=t<0?r+t:t;return a<o[0]?o[0]:a>o[1]?o[1]:a}}var Bl=Object.freeze({__proto__:null,assertParamsValid:by,computeFlatOffset:xy,computeOutShape:yy,getNormalizedAxes:$y,isSliceContinous:Ey,maskToAxes:wy,parseSliceParams:ky,sliceInfo:vy,startForAxis:Fl,startIndicesWithElidedDims:Dl,stopForAxis:Rl,stopIndicesWithElidedDims:Nl,stridesForAxis:Ml,stridesWithElidedDims:Tl});/** @license See the LICENSE file. */const Iy="4.22.0";/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Cl{static sgd(e){return new Vn(e)}static momentum(e,n,r=!1){return new ds(e,n,r)}static rmsprop(e,n=.9,r=0,s=null,o=!1){return new ps(e,n,r,s,o)}static adam(e=.001,n=.9,r=.999,s=null){return new hs(e,n,r,s)}static adadelta(e=.001,n=.95,r=null){return new ls(e,n,r)}static adamax(e=.002,n=.9,r=.999,s=null,o=0){return new fs(e,n,r,s,o)}static adagrad(e,n=.1){return new us(e,n)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ty=Cl;/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ay=typeof requestAnimationFrame<"u"?requestAnimationFrame:typeof setImmediate<"u"?setImmediate:t=>t();function _y(){return new Promise(t=>Ay(()=>t()))}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Dy(t,e){const n=t[0].length;t.forEach((s,o)=>{g(s.length===n,()=>`Error in concat${n}D: rank of tensors[${o}] must be the same as the rank of the rest (${n})`)}),g(e>=0&&e<n,()=>`Error in concat${n}D: axis must be between 0 and ${n-1}.`);const r=t[0];t.forEach((s,o)=>{for(let a=0;a<n;a++)g(a===e||s[a]===r[a],()=>`Error in concat${n}D: Shape of tensors[${o}] (${s}) does not match the shape of the rest (${r}) along the non-concatenated axis ${o}.`)})}function Ny(t,e){const n=t[0].slice();for(let r=1;r<t.length;r++)n[e]+=t[r][e];return n}/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Ae;(function(t){t[t.FIRST_DIM_SIZE=0]="FIRST_DIM_SIZE",t[t.VALUE_ROWIDS=1]="VALUE_ROWIDS",t[t.ROW_LENGTHS=2]="ROW_LENGTHS",t[t.ROW_SPLITS=3]="ROW_SPLITS",t[t.ROW_LIMITS=4]="ROW_LIMITS",t[t.ROW_STARTS=5]="ROW_STARTS"})(Ae||(Ae={}));function My(t,e,n){let r=new Array;if(n==null&&e==null)return r;if(e==null)for(;r.length<t+n.length;)r.push(-1);else r=e.slice();if(n==null)return r;if(t+n.length!==r.length)throw new Error(`rt input.shape and shape=${e} are incompatible: rt input.rank = ${t+n.length}, but shape.rank = ${r.length}`);for(let s=1;s<n.length;++s){const o=n[s],a=r[r.length-n.length+s],i=r[a];if(o>=0)if(i>=0){if(i!==o)throw new Error(`rt input.shape and shape=${e} are incompatible: rt input.shape[${s+t}] = ${o} but shape[${s+t}] = ${i}`)}else r[a]=o}return r}function Fy(t){const e={FIRST_DIM_SIZE:Ae.FIRST_DIM_SIZE,VALUE_ROWIDS:Ae.VALUE_ROWIDS,ROW_LENGTHS:Ae.ROW_LENGTHS,ROW_SPLITS:Ae.ROW_SPLITS,ROW_LIMITS:Ae.ROW_LIMITS,ROW_STARTS:Ae.ROW_STARTS},n=[];for(const r of t)if(r in e)n.push(e[r]);else break;return n}function Ry(t){return t.length===0?0:t[0]===Ae.FIRST_DIM_SIZE?t.length-1:t.length}function By(t,e){if(t==null||e==null)return;const n=t.length,r=e.length;if(n>=r)throw new Error(`defaultValue.shape=${t} and ragged tensor flatValues.shape=${e}, are incompatible: defaultValue.rank = ${n} must be less than ragged tensor input flatValues.rank = ${r})`);for(let s=0;s<Math.min(n,r-1);++s){const o=t[s],a=e[s+1];if(o>=0&&a>=0&&o!==1&&o!==a)throw new Error(`defaultValue.shape=${t}, and ragged tensor input flatValues.shape=${e} are incompatible: defaultValue.shape[${s-t.length}] = ${o} but ragged tensor input.flatValues.shape[${s-t.length}] = ${a}`)}}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const bs=30;function Cy(t){return t<=bs?t:$n(t,Math.floor(Math.sqrt(t)))}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Py(t,e,n){const r=n*(typeof t=="number"?t:t[0]),s=e*(typeof t=="number"?t:t[1]);return[r,s]}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Oy(t,e,n,r=!0){let s=[];if(r)s=s.concat(e.slice(0)),s.push(t[0]/n),s=s.concat(t.slice(1));else{s=s.concat(t[0]);const o=e.length;for(let a=0;a<o;++a)s=s.concat([t[a+1]/e[a],e[a]]);s=s.concat(t.slice(o+1))}return s}function Ly(t,e,n=!0){const r=[];if(n){r.push(e);for(let s=e+1;s<t;++s)s<=2*e?(r.push(s),r.push(s-(e+1))):r.push(s)}else{const s=[],o=[];for(let a=1;a<t;++a)a>=e*2+1||a%2===1?o.push(a):s.push(a);r.push(...s),r.push(0),r.push(...o)}return r}function Wy(t,e,n,r=!0){const s=[];r?s.push(t[0]/n):s.push(t[0]*n);for(let o=1;o<t.length;++o)o<=e.length?r?s.push(e[o-1]*t[o]):s.push(t[o]/e[o-1]):s.push(t[o]);return s}function Uy(t,e){const n=[0];for(let r=0;r<e;++r)n.push(t[r][0]);return n}function qy(t,e,n){const r=t.slice(0,1);for(let s=0;s<n;++s)r.push(t[s+1]-e[s][0]-e[s][1]);return r}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Gy=1.7580993408473768,zy=1.0507009873554805;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ky=.3275911,Vy=.254829592,Hy=-.284496736,jy=1.421413741,Xy=-1.453152027,Zy=1.061405429;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jy(t,e){if(t.length!==e.length)throw new Error(`Cannot merge real and imag arrays of different lengths. real:${t.length}, imag: ${e.length}.`);const n=new Float32Array(t.length*2);for(let r=0;r<n.length;r+=2)n[r]=t[r/2],n[r+1]=e[r/2];return n}function Yy(t){const e=new Float32Array(t.length/2),n=new Float32Array(t.length/2);for(let r=0;r<t.length;r+=2)e[r/2]=t[r],n[r/2]=t[r+1];return{real:e,imag:n}}function Qy(t){const e=Math.ceil(t.length/4),n=new Float32Array(e),r=new Float32Array(e);for(let s=0;s<t.length;s+=4)n[Math.floor(s/4)]=t[s],r[Math.floor(s/4)]=t[s+1];return{real:n,imag:r}}function e$(t){const e=Math.floor(t.length/4),n=new Float32Array(e),r=new Float32Array(e);for(let s=2;s<t.length;s+=4)n[Math.floor(s/4)]=t[s],r[Math.floor(s/4)]=t[s+1];return{real:n,imag:r}}function t$(t,e){const n=t[e*2],r=t[e*2+1];return{real:n,imag:r}}function n$(t,e,n,r){t[r*2]=e,t[r*2+1]=n}function r$(t,e){const n=new Float32Array(t/2),r=new Float32Array(t/2);for(let s=0;s<Math.ceil(t/2);s++){const o=(e?2:-2)*Math.PI*(s/t);n[s]=Math.cos(o),r[s]=Math.sin(o)}return{real:n,imag:r}}function s$(t,e,n){const r=(n?2:-2)*Math.PI*(t/e),s=Math.cos(r),o=Math.sin(r);return{real:s,imag:o}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Yn="->",o$=/->/g,Ps=",",Os="...";function a$(t,e){t=t.replace(/\s/g,"");const n=(t.length-t.replace(o$,"").length)/Yn.length;if(n<1)throw new Error("Equations without an arrow are not supported.");if(n>1)throw new Error(`Equation must contain exactly one arrow ("${Yn}").`);const[r,s]=t.split(Yn);g(r.indexOf(Os)===-1,()=>`The ellipsis notation ("${Os}") is not supported yet.`);const o=r.split(Ps),a=o.length;if(e!==a)throw new Error(`Expected ${a} input tensors, received ${e}`);if(a>2)throw new Error("Support for more than 2 input tensors is not implemented yet.");const i=[];for(let f=0;f<s.length;++f){const p=s[f];if(!o.some(w=>w.indexOf(p)!==-1))throw new Error(`Output subscripts contain the label ${p} not present in the input subscripts.`);i.indexOf(p)===-1&&i.push(p)}for(let f=0;f<r.length;++f){const p=r[f];i.indexOf(p)===-1&&p!==Ps&&i.push(p)}const c=new Array(o.length);for(let f=0;f<a;++f){if(new Set(o[f].split("")).size!==o[f].length)throw new Error(`Found duplicate axes in input component ${o[f]}. Support for duplicate axes in input is not implemented yet.`);c[f]=[];for(let p=0;p<o[f].length;++p)c[f].push(i.indexOf(o[f][p]))}const l=i.length,h=s.length,u=[];for(let f=h;f<l;++f)u.push(f);return{allDims:i,summedDims:u,idDims:c}}function i$(t,e){let n=new Array(t);n.fill(-1);for(let s=0;s<e.length;++s)n[e[s]]=s;const r=[];for(let s=0;s<t;++s)n[s]===-1&&r.push(s);return n=n.filter(s=>s!==-1),{permutationIndices:n,expandDims:r}}function c$(t,e,n){const r=new Array(t);for(let s=0;s<n.length;++s){const o=n[s].shape;for(let a=0;a<e[s].length;++a)r[e[s][a]]===void 0?r[e[s][a]]=o[a]:g(r[e[s][a]]===o[a],()=>`Expected dimension ${r[e[s][a]]} at axis ${a} of input shaped ${JSON.stringify(o)}, but got dimension ${o[a]}`)}}function l$(t,e){const n=t,r=[];let s=0;t.length===0&&n.push(-1),s=t.length+1;for(let a=0;a<s;++a)r.push([]);const o=[];for(let a=0;a<n.length;++a){const i=n[a],c=h$(e,i);for(const l of c)o.indexOf(l)===-1&&(r[a].push(l),o.push(l))}return{path:n,steps:r}}function u$(t){return t.every((e,n)=>e===n)}function h$(t,e){const n=[];for(let r=0;r<t.length;++r)(t[r].length===0||t[r].indexOf(e)!==-1||e===-1)&&n.push(r);return n}function f$(t,e,n=0){let r=[];if(typeof e=="number")g(t.shape[n]%e===0,()=>"Number of splits must evenly divide the axis."),r=new Array(e).fill(t.shape[n]/e);else{const s=e.reduce((a,i)=>(i===-1&&(a+=1),a),0);g(s<=1,()=>"There should be only one negative value in split array.");const o=e.indexOf(-1);if(o!==-1){const a=e.reduce((i,c)=>c>0?i+c:i);e[o]=t.shape[n]-a}g(t.shape[n]===e.reduce((a,i)=>a+i),()=>"The sum of sizes must match the size of the axis dimension."),r=e}return r}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function d$(t){return`Received SparseTensor with denseShape[0] = 0 but
  indices.shape[0] = ${t}`}function p$(t,e){return`indices(${t}, 0) is invalid: ${e} < 0`}function g$(t,e,n){return`indices(${t}, 0) is invalid: ${e} >= ${n}`}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function m$(t,e){return`only one output dimension may be -1, not both ${t} and ${e}`}function b$(t,e){return`size ${t} must be non-negative, not ${e}`}function w$(){return"reshape cannot infer the missing input size for an empty tensor unless all specified input sizes are non-zero"}function y$(t,e){const n=W(t),r=W(e);return`Input to reshape is a SparseTensor with ${n}
  dense values, but the requested shape requires a multiple of ${r}. inputShape=${t} outputShape= ${e}`}function $$(t,e){const n=W(t),r=W(e);return`Input to reshape is a tensor with ${n} dense values, but the requested shape has ${r}. inputShape=${t} outputShape=${e}`}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function E$(){return"segment ids must be >= 0"}function x$(){return"segment ids are not increasing"}function k$(t,e){return`Segment id ${t} out of range [0, ${e}), possibly because segmentIds input is not sorted.`}function v$(t,e,n){return`Bad: indices[${t}] == ${e} out of range [0, ${n})`}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function S$(t,e){let n=!1,r;for(t<=bs?(r=t,n=!0):r=$n(t,Math.floor(Math.sqrt(t)));!n;)r>e||r===t?n=!0:r=$n(t,r+1);return r}function I$(t,e,n){const r=[],s=t.length;for(let o=0;o<s;o++)o!==e?r.push(t[o]):r.push(n);return r}function T$(t,e,n,r){const s=e.shape.length,o=t.shape.length;if(r!==0&&(r<-s||r>s))throw new Error(`Expect batchDims in the range of [-${s}, ${s}], but got ${r}`);if(r<0&&(r+=s),r>o)throw new Error(`batchDims (${r}) must be less than rank(x) (
    ${o}).`);if(n<r)throw new Error(`batchDims (${r}) must be less than or equal to axis (${n}).`);for(let u=0;u<r;++u)if(t.shape[u]!==e.shape[u])throw new Error(`x.shape[${u}]: ${t.shape[u]} should be equal to indices.shape[${u}]: ${e.shape[u]}.`);const a=t.shape[n],i=[];let c=1,l=1,h=1;for(let u=0;u<r;++u)i.push(t.shape[u]),c*=t.shape[u];for(let u=r;u<n;u++)i.push(t.shape[u]),l*=t.shape[u];for(let u=r;u<s;u++)i.push(e.shape[u]);for(let u=n+1;u<o;u++)i.push(t.shape[u]),h*=t.shape[u];return{batchSize:c,sliceSize:h,outerSize:l,dimSize:a,outputShape:i}}var A$=Object.freeze({__proto__:null,collectGatherOpShapeInfo:T$,computeOutShape:I$,segOpComputeOptimalWindowSize:S$});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _$(t){try{return t.map(e=>kn(e))}catch(e){throw new Error(`Failed to decode encoded string bytes into utf-8, error: ${e}`)}}function D$(t){return t.map(e=>on(e))}var N$=Object.freeze({__proto__:null,ERF_A1:Vy,ERF_A2:Hy,ERF_A3:jy,ERF_A4:Xy,ERF_A5:Zy,ERF_P:Ky,PARALLELIZE_THRESHOLD:bs,get RowPartitionType(){return Ae},SELU_SCALE:zy,SELU_SCALEALPHA:Gy,applyActivation:zn,assertAndGetBroadcastShape:te,assertAxesAreInnerMostDims:kp,assertParamsConsistent:Dy,assignToTypedArray:n$,axesAreInnerMostDims:qr,calculateShapes:cl,checkEinsumDimSizes:c$,checkPadOnDimRoundingMode:ke,combineLocations:Rc,combineRaggedTensorToTensorShapes:My,complexWithEvenIndex:Qy,complexWithOddIndex:e$,computeConv2DInfo:cn,computeConv3DInfo:Sc,computeDefaultPad:Lr,computeDilation2DInfo:Gf,computeOptimalWindowSize:Cy,computeOutAndReduceShapes:xp,computeOutShape:Ny,computePool2DInfo:vc,computePool3DInfo:zf,convertConv2DDataFormat:Ic,decodeEinsumEquation:a$,eitherStridesOrDilationsAreOne:Pe,expandShapeToKeepDim:un,exponent:s$,exponents:r$,fromStringArrayToUint8:D$,fromUint8ToStringArray:_$,getAxesPermutation:vp,getBroadcastDims:Nc,getComplexWithIndex:t$,getEinsumComputePath:l$,getEinsumPermutation:i$,getFusedBiasGradient:Gn,getFusedDyActivation:qn,getImageCenter:Py,getInnerMostAxes:Ip,getPermuted:Ly,getRaggedRank:Ry,getReductionAxes:Ur,getReshaped:Oy,getReshapedPermuted:Wy,getRowPartitionTypesHelper:Fy,getSliceBeginCoords:Uy,getSliceSize:qy,getSparseFillEmptyRowsIndicesDenseShapeMismatch:d$,getSparseFillEmptyRowsNegativeIndexErrorMessage:p$,getSparseFillEmptyRowsOutOfRangeIndexErrorMessage:g$,getSparseReshapeEmptyTensorZeroOutputDimErrorMessage:w$,getSparseReshapeInputOutputMismatchErrorMessage:$$,getSparseReshapeInputOutputMultipleErrorMessage:y$,getSparseReshapeMultipleNegativeOneOutputDimErrorMessage:m$,getSparseReshapeNegativeOutputDimErrorMessage:b$,getSparseSegmentReductionIndicesOutOfRangeErrorMessage:v$,getSparseSegmentReductionNegativeSegmentIdsErrorMessage:E$,getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage:x$,getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage:k$,getUndoAxesPermutation:Sp,isIdentityPermutation:u$,log:Au,mergeRealAndImagArrays:Jy,prepareAndValidate:Il,prepareSplitSize:f$,segment_util:A$,shouldFuse:Kn,slice_util:Bl,splitRealAndImagArrays:Yy,stridesOrDilationsArePositive:ct,tupleValuesAreOne:Xt,upcastType:Fn,validateDefaultValueShape:By,validateInput:Un,validateUpdateShape:os,warn:We});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var M$=Object.freeze({__proto__:null,nonMaxSuppressionV3Impl:pl,nonMaxSuppressionV4Impl:gl,nonMaxSuppressionV5Impl:ml,whereImpl:ll});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */P1();var F$=Object.freeze({__proto__:null,Abs:Ys,Acos:Qs,Acosh:eo,AdadeltaOptimizer:ls,AdagradOptimizer:us,AdamOptimizer:hs,AdamaxOptimizer:fs,Add:_r,AddN:to,All:no,Any:ro,ArgMax:so,ArgMin:oo,Asin:ao,Asinh:io,Atan:co,Atan2:uo,Atanh:lo,AvgPool:ho,AvgPool3D:fo,AvgPool3DGrad:uu,AvgPoolGrad:lu,BatchMatMul:po,BatchToSpaceND:go,Bincount:mo,BitwiseAnd:bo,BroadcastArgs:wo,BroadcastTo:hu,Cast:Dr,Ceil:yo,ClipByValue:$o,Complex:Eo,ComplexAbs:xo,Concat:ko,Conv2D:vo,Conv2DBackpropFilter:So,Conv2DBackpropInput:Io,Conv3D:To,Conv3DBackpropFilterV2:fu,Conv3DBackpropInputV2:Ao,Cos:_o,Cosh:Do,CropAndResize:Fo,Cumprod:No,Cumsum:Mo,DataStorage:Ul,DenseBincount:Ro,DepthToSpace:Bo,DepthwiseConv2dNative:Co,DepthwiseConv2dNativeBackpropFilter:Po,DepthwiseConv2dNativeBackpropInput:Oo,Diag:Lo,Dilation2D:Wo,Dilation2DBackpropFilter:pu,Dilation2DBackpropInput:du,Draw:Nr,get ENV(){return Tr},Einsum:qo,Elu:Go,EluGrad:gu,Environment:Zs,Equal:Ko,Erf:zo,Exp:Vo,ExpandDims:Ho,Expm1:jo,FFT:Xo,Fill:Zo,FlipLeftRight:Jo,Floor:Yo,FloorDiv:Qo,FromPixels:Qn,FusedBatchNorm:ea,FusedConv2D:tr,FusedDepthwiseConv2D:nr,GatherNd:na,GatherV2:ta,Greater:ra,GreaterEqual:sa,IFFT:oa,Identity:Mr,Imag:aa,IsFinite:ia,IsInf:ca,IsNan:la,KernelBackend:Ls,LRN:ya,LRNGrad:yu,LeakyRelu:ua,Less:ha,LessEqual:fa,LinSpace:da,Log:pa,Log1p:ga,LogSoftmax:bu,LogicalAnd:ma,LogicalNot:ba,LogicalOr:wa,LogicalXor:mu,LowerBound:wu,MatrixBandPart:$u,Max:$a,MaxPool:xa,MaxPool3D:ka,MaxPool3DGrad:xu,MaxPoolGrad:Eu,MaxPoolWithArgmax:va,Maximum:Ea,Mean:Sa,Min:Ia,Minimum:Ta,MirrorPad:Aa,Mod:_a,MomentumOptimizer:ds,Multinomial:Da,Multiply:Na,Neg:Ma,NonMaxSuppressionV3:Ra,NonMaxSuppressionV4:Ba,NonMaxSuppressionV5:Ca,NotEqual:Fa,OP_SCOPE_SUFFIX:ic,OneHot:Oa,OnesLike:Pa,Optimizer:Je,OptimizerConstructors:Cl,Pack:La,PadV2:Wa,Pool:ku,Pow:Ua,Prelu:qa,Prod:Ga,RMSPropOptimizer:ps,RaggedGather:za,RaggedRange:Ka,RaggedTensorToTensor:Va,Range:Ha,get Rank(){return ar},Real:ja,RealDiv:Uo,Reciprocal:Xa,get Reduction(){return ie},Relu:Za,Relu6:ei,Reshape:Ja,ResizeBilinear:Qa,ResizeBilinearGrad:Su,ResizeNearestNeighbor:Ya,ResizeNearestNeighborGrad:vu,Reverse:ti,RotateWithOffset:Ui,Round:ni,Rsqrt:ri,SGDOptimizer:Vn,ScatterNd:si,SearchSorted:ai,Select:ii,Selu:ci,Sigmoid:di,Sign:fi,Sin:ui,Sinh:hi,Slice:li,Softmax:yi,Softplus:pi,SpaceToBatchND:bi,SparseFillEmptyRows:$i,SparseReshape:Ei,SparseSegmentMean:xi,SparseSegmentSum:ki,SparseToDense:vi,SplitV:wi,Sqrt:gi,Square:Iu,SquaredDifference:Si,StaticRegexReplace:Ii,Step:Wi,StridedSlice:Ti,StringNGrams:Ai,StringSplit:_i,StringToHashBucketFast:Di,Sub:Ni,Sum:mi,Tan:Mi,Tanh:Fi,Tensor:Q,TensorBuffer:vn,TensorScatterUpdate:oi,Tile:Fr,TopK:Ri,Transform:Bi,Transpose:pn,Unique:Ci,Unpack:Pi,UnsortedSegmentSum:Oi,UpperBound:Tu,Variable:Kt,ZerosLike:Li,_FusedMatMul:er,abs:me,acos:$f,acosh:xf,add:F,addN:vf,all:If,any:Af,argMax:Df,argMin:Mf,asin:Rf,asinh:Cf,atan:Of,atan2:Wf,atanh:qf,avgPool:Tc,avgPool3d:Yf,backend:uc,backend_util:N$,basicLSTMCell:od,batchNorm:Rn,batchNorm2d:ud,batchNorm3d:fd,batchNorm4d:pd,batchToSpaceND:Ac,bincount:_c,bitwiseAnd:bd,booleanMaskAsync:Ew,broadcastArgs:yd,broadcastTo:bn,broadcast_util:cp,browser:py,buffer:Re,cast:j,ceil:xd,clipByValue:vd,clone:st,complex:je,concat:de,concat1d:Id,concat2d:Ad,concat3d:Dd,concat4d:Md,conv1d:Bd,conv2d:Bn,conv2dTranspose:Od,conv3d:Wd,conv3dTranspose:zd,copyRegisteredKernels:Mu,cos:Vd,cosh:jd,cosineWindow:is,cumprod:Zd,cumsum:Yd,customGrad:Ne,denseBincount:ep,deprecationWarn:bh,depthToSpace:np,depthwiseConv2d:Wr,device_util:hh,diag:op,dilation2d:ip,disableDeprecationWarnings:mh,dispose:le,disposeVariables:wh,div:K,divNoNan:dp,dot:gp,dropout:Rw,einsum:$t,elu:Fc,enableDebugMode:gh,enableProdMode:ph,enclosingPowerOfTwo:hl,engine:yh,ensureShape:yp,env:B,equal:Mc,erf:Ep,euclideanNorm:Bp,exp:lt,expandDims:Le,expm1:Lp,eye:Cc,fft:ns,fill:ln,findBackend:Ih,findBackendFactory:Th,floor:Pc,floorDiv:kc,fused:Xw,gather:Oc,gatherND:Nw,gather_util:gy,getBackend:lc,getGradient:rr,getKernel:Gt,getKernelsForBackend:En,grad:ig,grads:cg,greater:Pn,greaterEqual:Lc,ifft:An,imag:On,image:A1,inTopKAsync:Cw,io:ty,irfft:sl,isFinite:jp,isInf:Zp,isNaN:Yp,keep:cc,kernel_impls:M$,leakyRelu:Wc,less:yr,lessEqual:Gr,linalg:_1,linspace:ng,localResponseNormalization:sg,log:Jt,log1p:Uc,logSigmoid:pg,logSoftmax:bg,logSumExp:zc,logicalAnd:Sn,logicalNot:Kc,logicalOr:Vc,logicalXor:kg,losses:D1,lowerBound:Sg,matMul:L,math:sy,max:Tt,maxPool:Hc,maxPool3d:Ag,maxPoolWithArgmax:Dg,maximum:jc,mean:In,memory:$h,meshgrid:Fg,min:wr,minimum:Tn,mirrorPad:Cg,mod:Og,moments:Wg,movingAverage:vw,mul:T,multiRNNCell:qg,multinomial:zg,neg:_e,nextFrame:_y,norm:Cn,notEqual:Xc,oneHot:$r,ones:rt,onesLike:jg,op:m,outerProduct:Zg,pad:hn,pad1d:Qg,pad2d:tm,pad3d:rm,pad4d:om,pool:um,pow:Zt,prelu:Jc,print:xc,prod:dm,profile:Eh,raggedGather:gm,raggedRange:bm,raggedTensorToTensor:ym,rand:Em,randomGamma:Jm,randomNormal:tl,randomStandardNormal:eb,randomUniform:ts,randomUniformInt:rb,range:Yt,ready:vh,real:Qt,reciprocal:ab,registerBackend:Ah,registerGradient:_u,registerKernel:qi,relu:Wn,relu6:nl,removeBackend:Sh,reshape:E,reverse:ut,reverse1d:hb,reverse2d:db,reverse3d:gb,reverse4d:bb,rfft:rs,round:rl,rsqrt:$b,scalar:q,scatterND:Iw,scatter_util:ow,searchSorted:zr,selu:xb,separableConv2d:vb,serialization:B1,setBackend:kh,setPlatform:_h,setdiff1dAsync:Ib,sigmoid:It,sign:Ab,signal:T1,sin:Db,sinh:Mb,slice:Z,slice1d:Rb,slice2d:Cb,slice3d:Ob,slice4d:Wb,slice_util:Bl,softmax:qb,softplus:Gc,spaceToBatchND:Zc,sparse:N1,sparseToDense:_w,spectral:I1,split:en,sqrt:Be,square:Se,squaredDifference:ol,squeeze:ss,stack:tn,step:al,stridedSlice:Qb,string:M1,sub:P,sum:z,sumOutType:nh,tan:tw,tanh:br,tensor:kt,tensor1d:xe,tensor2d:Wt,tensor3d:il,tensor4d:nw,tensor5d:rw,tensor6d:sw,tensorScatterUpdate:iw,tensor_util:oh,test_util:Hm,tidy:ee,tile:Lt,time:xh,topk:lw,train:Ty,transpose:_n,truncatedNormal:hw,unique:dw,unregisterGradient:Nu,unregisterKernel:Du,unsortedSegmentSum:gw,unstack:as,upcastType:Fn,upperBound:bw,util:Ku,valueAndGrad:lg,valueAndGrads:ug,variable:ww,variableGrads:qc,version_core:Iy,where:Ke,whereAsync:ul,zeros:Mt,zerosLike:be});export{ko as $,Ys as A,uu as B,lu as C,Yl as D,g as E,po as F,ky as G,Ey as H,Mr as I,Ft as J,xy as K,go as L,Oy as M,Ly as N,Wy as O,Uy as P,qy as Q,Ja as R,li as S,pn as T,mo as U,bo as V,wo as W,Dr as X,yo as Y,$o as Z,er as _,te as a,xa as a$,Dy as a0,Ny as a1,D$ as a2,vo as a3,Ic as a4,cn as a5,Io as a6,To as a7,Sc as a8,fu as a9,Qo as aA,ea as aB,tr as aC,nr as aD,na as aE,Il as aF,ta as aG,T$ as aH,ra as aI,sa as aJ,ia as aK,ca as aL,la as aM,ua as aN,ha as aO,fa as aP,da as aQ,pa as aR,ga as aS,ma as aT,ba as aU,wa as aV,mu as aW,ya as aX,yu as aY,$a as aZ,Ea as a_,Ao as aa,_o as ab,Do as ac,Fo as ad,No as ae,Sp as af,Mo as ag,Ro as ah,Bo as ai,Co as aj,Lo as ak,Wo as al,Gf as am,pu as an,du as ao,Go as ap,gu as aq,Ko as ar,zo as as,Vo as at,Ho as au,jo as av,Zo as aw,rn as ax,Jo as ay,Yo as az,Qs as b,k$ as b$,ka as b0,xu as b1,Eu as b2,va as b3,Pe as b4,Sa as b5,Ia as b6,Ta as b7,Aa as b8,yi as b9,Ui as bA,Py as bB,ni as bC,ri as bD,si as bE,cl as bF,ai as bG,ii as bH,ci as bI,di as bJ,fi as bK,ui as bL,hi as bM,pi as bN,bi as bO,$i as bP,g$ as bQ,p$ as bR,d$ as bS,Ei as bT,$$ as bU,y$ as bV,b$ as bW,m$ as bX,w$ as bY,E$ as bZ,v$ as b_,Da as ba,_a as bb,Na as bc,Ma as bd,Ra as be,Ba as bf,Ca as bg,Fa as bh,Oa as bi,Pa as bj,La as bk,ce as bl,Wa as bm,Ua as bn,qa as bo,Ga as bp,Ha as bq,Uo as br,Xa as bs,Za as bt,ei as bu,Qa as bv,Su as bw,Ya as bx,vu as by,ti as bz,eo as c,Vy as c$,x$ as c0,xi as c1,ki as c2,vi as c3,wi as c4,f$ as c5,gi as c6,Iu as c7,Si as c8,Wi as c9,yn as cA,bh as cB,zu as cC,Ah as cD,Gs as cE,Nc as cF,ru as cG,nu as cH,Mn as cI,Sr as cJ,Re as cK,qu as cL,Fn as cM,Dn as cN,vn as cO,wn as cP,Ce as cQ,eu as cR,Jy as cS,kn as cT,He as cU,zl as cV,qe as cW,on as cX,zy as cY,Gy as cZ,Ky as c_,Ti as ca,vy as cb,yy as cc,Ai as cd,_i as ce,Di as cf,Ni as cg,mi as ch,Mi as ci,Fi as cj,oi as ck,Fr as cl,Ri as cm,Bi as cn,Ci as co,Pi as cp,Li as cq,qi as cr,B as cs,Dm as ct,dt as cu,Fu as cv,Ls as cw,Ul as cx,yh as cy,zt as cz,_r as d,st as d$,Hy as d0,jy as d1,Xy as d2,Zy as d3,Hl as d4,Eo as d5,_$ as d6,nh as d7,by as d8,ja as d9,Wt as dA,j as dB,A1 as dC,hn as dD,Cg as dE,le as dF,ss as dG,E as dH,It as dI,hy as dJ,F as dK,dy as dL,xe as dM,uc as dN,P as dO,Se as dP,Tn as dQ,T as dR,Z as dS,K as dT,de as dU,lt as dV,vd as dW,q as dX,Df as dY,Uu as dZ,xt as d_,Mt as da,Ql as db,xo as dc,aa as dd,So as de,Po as df,Oo as dg,Nr as dh,qo as di,a$ as dj,c$ as dk,l$ as dl,i$ as dm,u$ as dn,Xo as dp,Qn as dq,oa as dr,pl as ds,ml as dt,Oi as du,I$ as dv,lc as dw,Le as dx,Q as dy,ee as dz,to as e,Xw as e$,ic as e0,me as e1,$f as e2,xf as e3,vf as e4,If as e5,Af as e6,Mf as e7,Rf as e8,Cf as e9,zd as eA,Vd as eB,jd as eC,is as eD,Zd as eE,Yd as eF,ep as eG,np as eH,Wr as eI,op as eJ,ip as eK,dp as eL,gp as eM,Rw as eN,$t as eO,Fc as eP,hl as eQ,yp as eR,Mc as eS,Ep as eT,Bp as eU,Lp as eV,Cc as eW,ns as eX,ln as eY,Pc as eZ,kc as e_,Of as ea,Wf as eb,qf as ec,Tc as ed,Yf as ee,od as ef,Rn as eg,ud as eh,fd as ei,pd as ej,Ac as ek,_c as el,bd as em,Ew as en,yd as eo,bn as ep,xd as eq,je as er,Id as es,Ad as et,Dd as eu,Md as ev,Bd as ew,Bn as ex,Od as ey,Wd as ez,Ip as f,Jm as f$,Oc as f0,Nw as f1,Pn as f2,Lc as f3,An as f4,On as f5,Cw as f6,sl as f7,jp as f8,Zp as f9,wr as fA,Og as fB,Wg as fC,vw as fD,qg as fE,zg as fF,_e as fG,Cn as fH,Xc as fI,$r as fJ,rt as fK,jg as fL,m as fM,Zg as fN,Qg as fO,tm as fP,rm as fQ,om as fR,um as fS,Zt as fT,Jc as fU,xc as fV,dm as fW,gm as fX,bm as fY,ym as fZ,Em as f_,Yp as fa,Wc as fb,yr as fc,Gr as fd,_1 as fe,ng as ff,sg as fg,Jt as fh,Uc as fi,pg as fj,bg as fk,zc as fl,Sn as fm,Kc as fn,Vc as fo,kg as fp,D1 as fq,Sg as fr,L as fs,Tt as ft,Hc as fu,Ag as fv,Dg as fw,jc as fx,In as fy,Fg as fz,vp as g,cc as g$,tl as g0,eb as g1,ts as g2,rb as g3,Yt as g4,Qt as g5,ab as g6,Wn as g7,nl as g8,ut as g9,en as gA,Be as gB,ol as gC,tn as gD,al as gE,Qb as gF,M1 as gG,z as gH,tw as gI,br as gJ,il as gK,nw as gL,rw as gM,sw as gN,iw as gO,Lt as gP,lw as gQ,_n as gR,hw as gS,dw as gT,gw as gU,as as gV,bw as gW,ww as gX,Ke as gY,ul as gZ,be as g_,hb as ga,db as gb,gb as gc,bb as gd,rs as ge,rl as gf,$b as gg,Iw as gh,zr as gi,xb as gj,vb as gk,Ib as gl,Ab as gm,T1 as gn,Db as go,Mb as gp,Rb as gq,Cb as gr,Ob as gs,Wb as gt,qb as gu,Gc as gv,Zc as gw,N1 as gx,_w as gy,I1 as gz,no as h,Nn as h0,ty as h1,Fh as h2,F$ as h3,kp as i,xp as j,un as k,ro as l,so as m,oo as n,ao as o,nn as p,io as q,co as r,W as s,kt as t,uo as u,lo as v,ho as w,vc as x,fo as y,zf as z};
