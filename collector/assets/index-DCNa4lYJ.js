import{_ as An,a as Ct,s as F,A as Us,b as js,c as qs,d as Xs,e as xn,I as Ks,t as Qs,T as Dn,p as rt,g as Yt,f as je,h as Nn,i as Se,j as Be,k as Te,l as Cn,m as Js,n as Ys,o as Zs,q as eu,r as tu,u as nu,v as au,w as Fn,x as st,y as ru,z as Ft,B as su,C as uu,R as ou,D as iu,E as ge,F as Rn,S as du,G as cu,H as pu,J as fe,K as lu,L as mu,M as En,N as Pn,O as On,P as fu,Q as hu,U as Wn,V as gu,W as bu,X as _u,Y as yu,Z as Bn,$ as Iu,a0 as wu,a1 as Ut,a2 as ku,a3 as Tn,a4 as Hn,a5 as ut,a6 as Ln,a7 as Vn,a8 as Zt,a9 as $n,aa as zn,ab as Su,ac as Mu,ad as Gn,ae as Un,af as jn,ag as qn,ah as vu,ai as Xn,aj as Kn,ak as Au,al as Qn,am as en,an as Jn,ao as Yn,ap as xu,aq as Zn,ar as Du,as as Nu,at as Cu,au as Fu,av as Ru,aw as Eu,ax as Pu,ay as ea,az as Ou,aA as Wu,aB as ta,aC as na,aD as aa,aE as ra,aF as Bu,aG as Tu,aH as Hu,aI as Lu,aJ as Vu,aK as $u,aL as zu,aM as Gu,aN as sa,aO as Uu,aP as ju,aQ as ua,aR as qu,aS as Xu,aT as Ku,aU as Qu,aV as Ju,aW as Yu,aX as oa,aY as ia,aZ as da,a_ as Zu,a$ as ca,b0 as eo,b1 as to,b2 as no,b3 as ao,b4 as ro,b5 as pa,b6 as la,b7 as so,b8 as ma,b9 as fa,ba as ha,bb as uo,bc as oo,bd as io,be as ga,bf as ba,bg as _a,bh as co,bi as ya,bj as po,bk as lo,bl as mo,bm as Ia,bn as fo,bo as wa,bp as ka,bq as ho,br as go,bs as bo,bt as _o,bu as yo,bv as Sa,bw as Ma,bx as va,by as Aa,bz as xa,bA as Da,bB as Io,bC as wo,bD as ko,bE as Na,bF as tn,bG as Ca,bH as So,bI as Mo,bJ as vo,bK as Ao,bL as xo,bM as Do,bN as No,bO as Co,bP as Fo,bQ as Ro,bR as Eo,bS as Po,bT as Fa,bU as Oo,bV as Wo,bW as Bo,bX as To,bY as Ho,bZ as yn,b_ as Lo,b$ as Vo,c0 as $o,c1 as zo,c2 as Go,c3 as Ra,c4 as Uo,c5 as jo,c6 as qo,c7 as Xo,c8 as Ko,c9 as Ea,ca as Pa,cb as Qo,cc as Jo,cd as Yo,ce as Zo,cf as ei,cg as ti,ch as Oa,ci as ni,cj as ai,ck as Wa,cl as Ba,cm as Ta,cn as Ha,co as ri,cp as si,cq as ui,cr as oi,cs as jt,ct as Oe,cu as In,cv as La,cw as ii,cx as di,cy as ci,cz as wn,cA as kn,cB as pi,cC as li,cD as mi}from"./index-sfChTQFZ.js";import{s as Sn,c as fi,r as hi,a as gi,b as bi,d as _i,u as yi}from"./Unique_impl-AWitNnsy.js";function Ii(r,n){return n.forEach(function(s){s&&typeof s!="string"&&!Array.isArray(s)&&Object.keys(s).forEach(function(o){if(o!=="default"&&!(o in r)){var a=Object.getOwnPropertyDescriptor(s,o);Object.defineProperty(r,o,a.get?a:{enumerable:!0,get:function(){return s[o]}})}})}),Object.freeze(r)}/**
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
 */var $;(function(r){r[r.float32=0]="float32",r[r.int32=1]="int32",r[r.bool=2]="bool",r[r.string=3]="string",r[r.complex64=4]="complex64"})($||($={}));var at;(function(r){r[r.linear=0]="linear",r[r.relu=1]="relu",r[r.relu6=2]="relu6",r[r.prelu=3]="prelu",r[r.leakyrelu=4]="leakyrelu",r[r.sigmoid=5]="sigmoid",r[r.elu=6]="elu"})(at||(at={}));/**
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
 */let Va;function wi(r){Va=r.wasm.cwrap(An,null,["number","array","number","number","array","number","number","number","number","number","number","number","number"])}function ki(r){const{inputs:n,backend:s,attrs:o}=r,{a,b:t,bias:i,preluActivationWeights:d}=n;if(a.dtype!=="float32"||t.dtype!=="float32")throw new Error("_FusedMatMul for non non-float32 tensors not yet supported.");const{transposeA:c,transposeB:u,activation:e,leakyreluAlpha:m}=o,b=s.dataIdMap.get(a.dataId).id,l=s.dataIdMap.get(t.dataId).id;let f=0;if(i!=null){const V=s.dataIdMap.get(i.dataId);if(V.shape.length!==1)throw new Error(`_FusedMatMul only supports rank-1 bias but got rank ${V.shape.length}.`);f=V.id}const g=d==null?0:s.dataIdMap.get(d.dataId).id,w=at[e];if(w==null)throw new Error(`${e} activation not yet supported for FusedConv2D in the wasm backend.`);const k=c?a.shape[2]:a.shape[1],y=u?t.shape[1]:t.shape[2],_=Ct(a.shape.slice(0,-2),t.shape.slice(0,-2)),v=s.makeOutput([..._,k,y],a.dtype),E=s.dataIdMap.get(v.dataId).id,R=new Uint8Array(new Int32Array(a.shape).buffer),B=new Uint8Array(new Int32Array(t.shape).buffer);return Va(b,R,a.shape.length,l,B,t.shape.length,c,u,w,f,g,m||0,E),v}const Si={kernelName:An,backendName:"wasm",setupFunc:wi,kernelFunc:ki};/**
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
 */function L(r,n){let s;function o(t){s=t.wasm.cwrap(r,null,["number","number","number"])}function a(t){const{backend:i,inputs:{x:d}}=t,c=i.dataIdMap.get(d.dataId).id,u=i.makeOutput(d.shape,n||d.dtype),e=i.dataIdMap.get(u.dataId).id;return F(u.shape)===0||s(c,$[d.dtype],e),u}return{kernelName:r,backendName:"wasm",setupFunc:o,kernelFunc:a}}/**
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
 */const Mi=L(Us);/**
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
 */const vi=L(js);/**
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
 */const Ai=L(qs);/**
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
 */function ee(r,n,s){let o;function a(i){o=i.wasm.cwrap(r,null,["number","array","number","number","array","number","number","number"])}function t(i){const{backend:d,inputs:c}=i,{a:u,b:e}=c,m=d.dataIdMap.get(u.dataId).id,b=d.dataIdMap.get(e.dataId).id,l=s??u.dtype,f=Ct(u.shape,e.shape),g=d.makeOutput(f,l);if(F(f)===0)return g;const w=new Uint8Array(new Int32Array(u.shape).buffer),k=new Uint8Array(new Int32Array(e.shape).buffer),y=d.dataIdMap.get(g.dataId).id;return o(m,w,u.shape.length,b,k,e.shape.length,$[u.dtype],y),g}return{kernelName:r,backendName:"wasm",setupFunc:a,kernelFunc:t}}/**
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
 */const xi=ee(Xs);/**
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
 */let $a;function Di(r){$a=r.wasm.cwrap(xn,null,["array","number","number","number"])}function Ni(r){const{inputs:n,backend:s}=r,o=s.makeOutput(n[0].shape,n[0].dtype);if(F(o.shape)===0)return o;const a=n.map(d=>s.dataIdMap.get(d.dataId).id),t=new Uint8Array(new Int32Array(a).buffer),i=s.dataIdMap.get(o.dataId).id;return $a(t,a.length,$[o.dtype],i),o}const Ci={kernelName:xn,backendName:"wasm",setupFunc:Di,kernelFunc:Ni};/**
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
 */function Rt(r){const{inputs:{x:n},backend:s}=r;if(n.dtype==="string")return Qs(s.readSync(n.dataId),n.shape,n.dtype);const o=s.makeOutput(n.shape,n.dtype),a=s.typedArrayFromHeap(n);return s.typedArrayFromHeap(o).set(a),o}const Fi={kernelName:Ks,backendName:"wasm",kernelFunc:Rt};/**
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
 */let za;function Ri(r){za=r.wasm.cwrap(Dn,null,["number","array","number","number","number","array","number"])}function Ae(r){const{inputs:n,backend:s,attrs:o}=r,[a,t]=Pi(n.x.shape,o.perm);let i=!0;for(let f=0;f<t.length;f++)t[f]!==f&&(i=!1);const d=Ei(n.x.shape,o.perm),c={dataId:n.x.dataId,shape:a,dtype:n.x.dtype};if(i){const f=Rt({inputs:n,backend:s});return f.shape=d,f}const u=s.makeOutput(d,c.dtype),e=s.dataIdMap.get(c.dataId).id,m=s.dataIdMap.get(u.dataId).id,b=new Uint8Array(new Int32Array(t).buffer),l=new Uint8Array(new Int32Array(c.shape).buffer);return za(e,l,c.shape.length,$[c.dtype],m,b,t.length),u}function Ei(r,n){const s=new Array(r.length);for(let o=0;o<s.length;o++)s[o]=r[n[o]];return s}function Pi(r,n){const s=[],o=[];for(let a=0;a<r.length;++a)r[a]!==1&&s.push(r[a]),r[n[a]]!==1&&o.push(n[a]);for(let a=0;a<o.length;++a){let t=-1;for(let i=0;i<o.length;++i)o[i]>=a&&(t===-1||o[t]>o[i])&&(t=i);o[t]=a}return[s,o]}const Oi={kernelName:Dn,backendName:"wasm",kernelFunc:Ae,setupFunc:Ri};/**
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
 */function xe(r,n,s){const o=r.shape,a=r.shape.length,t=rt(n,o);let i=t;const d=Yt(i,a);let c=null,u=!1;if(d!=null){const e=new Array(a);for(let l=0;l<e.length;l++)e[l]=o[d[l]];i=je(i.length,a),c=Ae({inputs:{x:r},attrs:{perm:d},backend:s});const m=s.dataIdMap.get(r.dataId).id;s.dataIdMap.get(c.dataId).id!==m&&(u=!0)}return{transposed:c,originalAxes:t,axes:i,inputWasTransposed:u}}/**
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
 */let Ga;function Wi(r){Ga=r.wasm.cwrap(Nn,null,["number, number, number"])}function Bi(r){const{backend:n,inputs:s,attrs:o}=r,{axis:a,keepDims:t}=o,{x:i}=s;let c=n.dataIdMap.get(i.dataId).id,u=i;const{transposed:e,axes:m,originalAxes:b,inputWasTransposed:l}=xe(i,a,n);if(l){const _=n.dataIdMap.get(e.dataId).id;u=e,c=_}const f=u.shape.length;Se("all",m,f);const[g,w]=Be(u.shape,m),k=F(w),y=n.makeOutput(g,i.dtype);if(F(u.shape)!==0){const _=n.dataIdMap.get(y.dataId).id;Ga(c,k,_)}if(l&&n.disposeData(e.dataId),t){const _=Te(y.shape,b);y.shape=_}return y}const Ti={kernelName:Nn,backendName:"wasm",setupFunc:Wi,kernelFunc:Bi};/**
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
 */let Ua;function Hi(r){Ua=r.wasm.cwrap(Cn,null,["number, number, number"])}function Li(r){const{backend:n,inputs:s,attrs:o}=r,{axis:a,keepDims:t}=o,{x:i}=s;let c=n.dataIdMap.get(i.dataId).id,u=i;const{transposed:e,axes:m,originalAxes:b,inputWasTransposed:l}=xe(i,a,n);if(l){const _=n.dataIdMap.get(e.dataId).id;u=e,c=_}const f=u.shape.length;Se("any",m,f);const[g,w]=Be(u.shape,m),k=F(w),y=n.makeOutput(g,i.dtype);if(F(u.shape)!==0){const _=n.dataIdMap.get(y.dataId).id;Ua(c,k,_)}if(l&&n.disposeData(e.dataId),t){const _=Te(y.shape,b);y.shape=_}return y}const Vi={kernelName:Cn,backendName:"wasm",setupFunc:Hi,kernelFunc:Li};/**
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
 */function ja(r){let n;function s(a){n=a.wasm.cwrap(r,null,["number","number","number","number","number"])}function o(a){const{backend:t,inputs:i,attrs:d}=a,{axis:c}=d,{x:u}=i,e=t.dataIdMap.get(u.dataId).id;let m=e,b=u;const{transposed:l,axes:f,inputWasTransposed:g}=xe(u,c,t);if(g){const E=t.dataIdMap.get(l.dataId).id;E!==e&&(b=l,m=E)}const w=b.shape.slice(0,-1),k=t.makeOutput(w,"int32"),y=t.dataIdMap.get(k.dataId).id,_=F(k.shape),v=b.shape[f[0]];return n(m,$[b.dtype],_,v,y),g&&t.disposeData(l.dataId),k}return{kernelName:r,backendName:"wasm",setupFunc:s,kernelFunc:o}}/**
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
 */const $i=ja(Js);/**
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
 */const zi=ja(Ys);/**
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
 */const Gi=L(Zs);/**
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
 */const Ui=L(eu);/**
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
 */const ji=L(tu);/**
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
 */const qi=ee(nu);/**
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
 */const Xi=L(au);/**
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
 */let qa;function Ki(r){qa=r.wasm.cwrap(Fn,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function Qi(r){const{inputs:n,attrs:s,backend:o}=r,a=n.x,t=o.dataIdMap.get(a.dataId).id,{filterSize:i,strides:d,pad:c,dimRoundingMode:u}=s,e=st(a.shape,i,d,1,c,u),m=e.filterHeight,b=e.filterWidth,l=e.padInfo.top,f=e.padInfo.right,g=e.padInfo.bottom,w=e.padInfo.left,k=e.strideHeight,y=e.strideWidth,_=e.inChannels;if(e.dataFormat!=="channelsLast")throw new Error(`wasm backend does not support dataFormat:'${e.dataFormat}'. Please use 'channelsLast'.`);if(e.dilationWidth!==1||e.dilationHeight!==1)throw new Error(`was backend only supports average pooling with dilation = [1, 1], got [${e.dilationHeight}, ${e.dilationWidth}].`);const v=o.makeOutput(e.outShape,"float32"),E=o.dataIdMap.get(v.dataId).id;return qa(t,a.shape[0],a.shape[1],a.shape[2],m,b,l,f,g,w,k,y,_,E),v}const Ji={kernelName:Fn,backendName:"wasm",setupFunc:Ki,kernelFunc:Qi};/**
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
 */let Xa;function Yi(r){Xa=r.wasm.cwrap("AvgPool3D",null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function Zi(r){const{inputs:n,backend:s,attrs:o}=r,{x:a}=n,{filterSize:t,strides:i,pad:d,dimRoundingMode:c,dataFormat:u}=o,e=Ft(a.shape,t,i,1,d,c,u),m=s.makeOutput(e.outShape,a.dtype);return Xa(s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(m.dataId).id,e.batchSize,e.inChannels,e.inDepth,e.inHeight,e.inWidth,e.outDepth,e.outHeight,e.outWidth,e.strideDepth,e.strideHeight,e.strideWidth,e.dilationDepth,e.dilationHeight,e.dilationWidth,e.effectiveFilterDepth,e.effectiveFilterHeight,e.effectiveFilterWidth,e.padInfo.front,e.padInfo.top,e.padInfo.left),m}const ed={kernelName:ru,backendName:"wasm",setupFunc:Yi,kernelFunc:Zi};/**
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
 */let Ka;function td(r){Ka=r.wasm.cwrap("AvgPool3DGrad",null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function nd(r){const{inputs:n,backend:s,attrs:o}=r,{dy:a,input:t}=n,{filterSize:i,strides:d,pad:c,dimRoundingMode:u}=o,e=Ft(t.shape,i,d,1,c,u),m=s.makeOutput(t.shape,t.dtype);return Ka(s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(m.dataId).id,e.batchSize,e.inChannels,e.inDepth,e.inHeight,e.inWidth,e.outDepth,e.outHeight,e.outWidth,e.strideDepth,e.strideHeight,e.strideWidth,e.dilationDepth,e.dilationHeight,e.dilationWidth,e.effectiveFilterDepth,e.effectiveFilterHeight,e.effectiveFilterWidth,e.padInfo.front,e.padInfo.top,e.padInfo.left,e.filterDepth,e.filterHeight,e.filterWidth),m}const ad={kernelName:su,backendName:"wasm",setupFunc:td,kernelFunc:nd};/**
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
 */let Qa;function rd(r){Qa=r.wasm.cwrap("AvgPoolGrad",null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function sd(r){const{inputs:n,backend:s,attrs:o}=r,{dy:a,input:t}=n,{filterSize:i,strides:d,pad:c}=o,u=st(t.shape,i,d,1,c),e=s.makeOutput(t.shape,t.dtype);return Qa(s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(e.dataId).id,u.batchSize,u.inChannels,u.inHeight,u.inWidth,u.outHeight,u.outWidth,u.strideHeight,u.strideWidth,u.dilationHeight,u.dilationWidth,u.effectiveFilterHeight,u.effectiveFilterWidth,u.padInfo.top,u.padInfo.left,u.filterHeight,u.filterWidth),e}const ud={kernelName:uu,backendName:"wasm",setupFunc:rd,kernelFunc:sd};/**
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
 */function oe(r){const{inputs:n,attrs:s}=r,{x:o}=n,{shape:a}=s,t=F(o.shape),i=iu(a,t);return ge(t===F(i),()=>`new shape: ${i}, old shape: ${o.shape}. New shape and old shape must have the same number of elements.`),r.backend.incRef(o.dataId),{dataId:o.dataId,shape:i,dtype:o.dtype}}const od={kernelName:ou,backendName:"wasm",kernelFunc:oe};/**
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
 */let Ja;function id(r){Ja=r.wasm.cwrap(Rn,null,["number","array","number","number","array","number","number","number","number"])}function dd(r){const{inputs:n,backend:s,attrs:o}=r,{a,b:t}=n,{transposeA:i,transposeB:d}=o;if(a.dtype!=="float32"||t.dtype!=="float32")throw new Error("BatchMatMul for non non-float32 tensors not yet supported.");const c=a.shape.length,u=t.shape.length,e=i?a.shape[c-2]:a.shape[c-1],m=d?t.shape[u-1]:t.shape[u-2],b=i?a.shape[c-1]:a.shape[c-2],l=d?t.shape[u-2]:t.shape[u-1],f=a.shape.slice(0,-2),g=t.shape.slice(0,-2),w=F(f),k=F(g),_=Ct(a.shape.slice(0,-2),t.shape.slice(0,-2)).concat([b,l]);ge(e===m,()=>`Error in matMul: inner shapes (${e}) and (${m}) of Tensors with shapes ${a.shape} and ${t.shape} and transposeA=${i} and transposeB=${d} must match.`);const v=i?[w,e,b]:[w,b,e],E=d?[k,l,m]:[k,m,l],R=oe({inputs:{x:a},backend:s,attrs:{shape:v}}),B=oe({inputs:{x:t},backend:s,attrs:{shape:E}}),V=s.dataIdMap.get(R.dataId).id,z=s.dataIdMap.get(B.dataId).id,H=i?R.shape[2]:R.shape[1],U=d?B.shape[1]:B.shape[2],q=Math.max(w,k),J=s.makeOutput([q,H,U],R.dtype),ue=s.dataIdMap.get(J.dataId).id,X=new Uint8Array(new Int32Array(R.shape).buffer),te=new Uint8Array(new Int32Array(B.shape).buffer);return Ja(V,X,R.shape.length,z,te,B.shape.length,i,d,ue),s.disposeData(R.dataId),s.disposeData(B.dataId),J.shape=_,J}const cd={kernelName:Rn,backendName:"wasm",setupFunc:id,kernelFunc:dd};/**
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
 */function We(r){const{inputs:{x:n},attrs:{begin:s,size:o},backend:a}=r,[t,i]=cu(n,s,o),d=pu(n.shape,t,i),c=a.readSync(n.dataId),u=a.makeOutput(i,n.dtype),e=fe(n.shape),m=a.dataIdMap.get(u.dataId);if(d){const f=lu(t,e);return n.dtype==="string"?m.stringBytes=c.slice(f,f+F(i)):a.typedArrayFromHeap(u).set(c.subarray(f,f+F(i))),u}if(n.dtype==="string"){const f=Sn(c,t,i,n.shape,n.dtype);return m.stringBytes=f,u}const b=a.typedArrayFromHeap(u),l=n.shape.length;if(l===2)pd(c,e[0],b,t,i);else if(l===3)ld(c,e[0],e[1],b,t,i);else if(l===4)md(c,e[0],e[1],e[2],b,t,i);else{const f=Sn(c,t,i,n.shape,n.dtype);b.set(f)}return u}function pd(r,n,s,o,a){let t=0;const i=o[0],d=o[1],c=i+a[0];for(let u=i;u<c;u++){const e=u*n+d;s.set(r.subarray(e,e+a[1]),t),t+=a[1]}}function ld(r,n,s,o,a,t){let i=0;const d=a[0],c=a[1],u=a[2],e=d+t[0],m=c+t[1];for(let b=d;b<e;b++)for(let l=c;l<m;l++){const f=b*n+l*s+u;o.set(r.subarray(f,f+t[2]),i),i+=t[2]}}function md(r,n,s,o,a,t,i){let d=0;const c=t[0],u=t[1],e=t[2],m=c+i[0],b=u+i[1],l=e+i[2],f=t[3];for(let g=c;g<m;g++)for(let w=u;w<b;w++)for(let k=e;k<l;k++){const y=g*n+w*s+k*o+f;a.set(r.subarray(y,y+i[3]),d),d+=i[3]}}const fd={kernelName:du,backendName:"wasm",kernelFunc:We};/**
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
 */function hd(r){const{inputs:n,backend:s,attrs:o}=r,{x:a}=n,{blockShape:t,crops:i}=o,d=t.reduce((k,y)=>k*y),c=En(a.shape,t,d),u=Pn(c.length,t.length),e=On(a.shape,t,d),m=fu(i,t.length),b=hu(e,i,t.length),l=oe({inputs:{x:a},backend:s,attrs:{shape:c}}),f=Ae({inputs:{x:l},backend:s,attrs:{perm:u}}),g=oe({inputs:{x:f},backend:s,attrs:{shape:e}}),w=We({inputs:{x:g},backend:s,attrs:{begin:m,size:b}});return s.disposeData(l.dataId),s.disposeData(f.dataId),s.disposeData(g.dataId),w}const gd={kernelName:mu,backendName:"wasm",kernelFunc:hd};/**
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
 */let Ya;function bd(r){Ya=r.wasm.cwrap(Wn,null,["number","number","boolean","number","number","number"])}function _d(r){const{backend:n,inputs:s,attrs:o}=r,{x:a,weights:t}=s,{size:i}=o,d=t.shape.reduce((m,b)=>m*b,1)!==0,c=a.shape.length===1?[i]:[a.shape[0],i],u=n.makeOutput(c,t.dtype);function e(m){return n.dataIdMap.get(m.dataId).id}return Ya(e(a),i,d,e(t),$[t.dtype],e(u)),u}const yd={kernelName:Wn,backendName:"wasm",setupFunc:bd,kernelFunc:_d};/**
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
 */const Id=ee(gu);/**
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
 */function wd(r){const{inputs:n,backend:s}=r,{s0:o,s1:a}=n,t=s.typedArrayFromHeap(o),i=s.typedArrayFromHeap(a),d=Ct(Array.from(t),Array.from(i));return s.makeOutput([d.length],"int32",void 0,new Int32Array(d))}const kd={kernelName:bu,backendName:"wasm",kernelFunc:wd};/**
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
 */function De(r){const{inputs:{x:n},attrs:{dtype:s},backend:o}=r,a=o.makeOutput(n.shape,s),t=o.typedArrayFromHeap(n);return o.typedArrayFromHeap(a).set(t),a}const Sd={kernelName:_u,backendName:"wasm",kernelFunc:De};/**
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
 */const Md=L(yu);/**
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
 */let Za;function vd(r){Za=r.wasm.cwrap(Bn,null,["number","number","number","number"])}function Ad(r){const{inputs:n,backend:s,attrs:o}=r,{x:a}=n,{clipValueMin:t,clipValueMax:i}=o,d=s.dataIdMap.get(a.dataId).id,c=s.makeOutput(a.shape,a.dtype),u=s.dataIdMap.get(c.dataId).id;return Za(d,t,i,u),c}const xd={kernelName:Bn,backendName:"wasm",setupFunc:vd,kernelFunc:Ad};/**
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
 */function er(r){const{inputs:n,backend:s}=r,o=rt(r.attrs.axis,n[0].shape)[0],a=n.map(l=>l.shape);wu(a,o);let t=Ut(n.map(l=>l.shape),o);const i=n.filter(l=>F(l.shape)>0);if(i.length===1)return Rt({inputs:{x:i[0]},backend:s});const d=s.makeOutput(t,n[0].dtype);if(F(t)===0)return d;if(i[0].dtype==="string"){const l=i.map(_=>{const E=[-1,F(_.shape.slice(o))];return oe({inputs:{x:_},backend:s,attrs:{shape:E}})}),f=l.map(_=>({vals:s.readSync(_.dataId),shape:_.shape}));t=Ut(l.map(_=>_.shape),1);const g=l[0].shape[0]===1,w=fi(f,t,n[0].dtype,g),k=Ut(i.map(_=>_.shape),o);d.shape=k;const y=s.dataIdMap.get(d.dataId);return y.stringBytes=ku(w),l.forEach(_=>s.disposeData(_.dataId)),d}const c=F(i[0].shape.slice(0,o));let u=0;const e=i.map(l=>{const f=F(l.shape.slice(o));return u+=f,f}),m=i.map(l=>s.typedArrayFromHeap(l)),b=s.typedArrayFromHeap(d);for(let l=0;l<c;l++){let f=l*u;for(let g=0;g<m.length;g++){const w=e[g],k=l*w,y=m[g].subarray(k,k+w);b.set(y,f),f+=w}}return d}const Dd={kernelName:Iu,backendName:"wasm",kernelFunc:er};/**
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
 */let tr;function Nd(r){tr=r.wasm.cwrap(Tn,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function Cd(r){const{inputs:n,attrs:s,backend:o}=r,{x:a,filter:t}=n,i=o.dataIdMap.get(a.dataId).id,d=o.dataIdMap.get(t.dataId).id,{strides:c,dilations:u,pad:e,dimRoundingMode:m,dataFormat:b}=s,l=Hn(b),f=ut(a.shape,t.shape,c,u,e,m,!1,l),g=f.filterHeight,w=f.filterWidth,k=f.padInfo.top,y=f.padInfo.right,_=f.padInfo.bottom,v=f.padInfo.left,E=f.dilationHeight,R=f.dilationWidth,B=f.strideHeight,V=f.strideWidth,z=f.inChannels,H=f.outChannels,U=f.padInfo.type==="SAME"?1:0;if(f.dataFormat!=="channelsLast")throw new Error(`wasm backend Conv2D does not support dataFormat:'${f.dataFormat}'. Please use 'channelsLast'.`);const q=o.makeOutput(f.outShape,"float32"),J=o.dataIdMap.get(q.dataId).id;return tr(i,a.shape[0],a.shape[1],a.shape[2],d,g,w,k,y,_,v,U,E,R,B,V,z,H,J),q}const Fd={kernelName:Tn,backendName:"wasm",setupFunc:Nd,kernelFunc:Cd};/**
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
 */let nr;function Rd(r){nr=r.wasm.cwrap(Ln,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function Ed(r){const{backend:n,inputs:s,attrs:o}=r,{dy:a,filter:t}=s,{strides:i,pad:d,dataFormat:c,dimRoundingMode:u,inputShape:e}=o,m=1,b=Hn(c),l=ut(e,t.shape,i,m,d,u,!1,b),{batchSize:f,filterHeight:g,filterWidth:w,inChannels:k,inHeight:y,inWidth:_,outChannels:v,outHeight:E,outWidth:R,strideHeight:B,strideWidth:V}=l,z=g-1-l.padInfo.top,H=w-1-l.padInfo.left,U=l.dataFormat==="channelsLast",q=fe(l.inShape),J=fe(a.shape),[ue,X,te]=fe(t.shape),pe=q[0],G=U?q[1]:q[2],he=U?q[2]:1,ie=U?1:q[1],de=J[0],_e=U?J[1]:J[2],ne=U?J[2]:1,He=U?1:J[1],Le=n.makeOutput(l.inShape,"float32"),qe=n.dataIdMap.get(Le.dataId).id,Xe=n.dataIdMap.get(a.dataId).id,Y=n.dataIdMap.get(t.dataId).id;return nr(Xe,Y,f,g,w,y,_,k,E,R,v,B,V,z,H,ue,X,te,pe,G,he,ie,de,_e,ne,He,qe),Le}const Pd={kernelName:Ln,backendName:"wasm",setupFunc:Rd,kernelFunc:Ed};/**
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
 */let ar;function Od(r){ar=r.wasm.cwrap(Vn,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function Wd(r){const{inputs:n,backend:s,attrs:o}=r,{x:a,filter:t}=n,{strides:i,pad:d,dilations:c}=o;if(a.dtype!=="float32")throw new Error(`Tensor x must have dtype float32, got ${a.dtype}`);if(t.dtype!=="float32")throw new Error(`Tensor filter must have dtype float32, got ${t.dtype}`);const u=Zt(a.shape,t.shape,i,c,d),e=s.makeOutput(u.outShape,a.dtype);return ar(s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(t.dataId).id,s.dataIdMap.get(e.dataId).id,u.batchSize,u.inDepth,u.inHeight,u.inWidth,u.inChannels,u.outDepth,u.outHeight,u.outWidth,u.outChannels,u.strideDepth,u.strideHeight,u.strideWidth,u.dilationDepth,u.dilationHeight,u.dilationWidth,u.filterDepth,u.filterHeight,u.filterWidth,u.padInfo.front,u.padInfo.top,u.padInfo.left),e}const Bd={kernelName:Vn,backendName:"wasm",setupFunc:Od,kernelFunc:Wd};/**
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
 */let rr;function Td(r){rr=r.wasm.cwrap($n,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function Hd(r){const{inputs:n,backend:s,attrs:o}=r,{x:a,dy:t}=n,{strides:i,pad:d,filterShape:c}=o;if(a.dtype!=="float32")throw new Error(`Tensor dy must have dtype float32, got ${a.dtype}`);if(t.dtype!=="float32")throw new Error(`Tensor filter must have dtype float32, got ${t.dtype}`);const u=Zt(a.shape,c,i,1,d),e=s.makeOutput(u.filterShape,t.dtype);return rr(s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(t.dataId).id,s.dataIdMap.get(e.dataId).id,u.batchSize,u.inDepth,u.inHeight,u.inWidth,u.inChannels,u.outDepth,u.outHeight,u.outWidth,u.outChannels,u.strideDepth,u.strideHeight,u.strideWidth,u.dilationDepth,u.dilationHeight,u.dilationWidth,u.filterDepth,u.filterHeight,u.filterWidth,u.padInfo.front,u.padInfo.top,u.padInfo.left),e}const Ld={kernelName:$n,backendName:"wasm",setupFunc:Td,kernelFunc:Hd};/**
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
 */let sr;function Vd(r){sr=r.wasm.cwrap(zn,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function $d(r){const{inputs:n,backend:s,attrs:o}=r,{dy:a,filter:t}=n,{pad:i,strides:d,inputShape:c}=o;if(a.dtype!=="float32")throw new Error(`Tensor dy must have dtype float32, got ${a.dtype}`);if(t.dtype!=="float32")throw new Error(`Tensor filter must have dtype float32, got ${t.dtype}`);const u=Zt(c,t.shape,d,1,i),e=s.makeOutput(u.inShape,a.dtype);return sr(s.dataIdMap.get(t.dataId).id,s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(e.dataId).id,u.batchSize,u.inDepth,u.inHeight,u.inWidth,u.inChannels,u.outDepth,u.outHeight,u.outWidth,u.outChannels,u.strideDepth,u.strideHeight,u.strideWidth,u.dilationDepth,u.dilationHeight,u.dilationWidth,u.filterDepth,u.filterHeight,u.filterWidth,u.padInfo.front,u.padInfo.top,u.padInfo.left),e}const zd={kernelName:zn,backendName:"wasm",setupFunc:Vd,kernelFunc:$d};/**
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
 */const Gd=L(Su);/**
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
 */const Ud=L(Mu);/**
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
 */var qt;(function(r){r[r.bilinear=0]="bilinear",r[r.nearest=1]="nearest"})(qt||(qt={}));let ur;function jd(r){ur=r.wasm.cwrap(Gn,null,["number","number","number","number","array","number","number","number","number","number"])}function qd(r){const{backend:n,inputs:s,attrs:o}=r,{method:a,extrapolationValue:t,cropSize:i}=o,{image:d,boxes:c,boxInd:u}=s,e=c.shape[0],[m,b]=i,l=[e,m,b,d.shape[3]];let f=n.dataIdMap.get(d.dataId),g;d.dtype!=="float32"&&(g=De({backend:n,inputs:{x:d},attrs:{dtype:"float32"}}),f=n.dataIdMap.get(g.dataId));const w=f.id,k=n.dataIdMap.get(c.dataId).id,y=n.dataIdMap.get(u.dataId).id,_=n.makeOutput(l,"float32"),v=n.dataIdMap.get(_.dataId).id,E=new Uint8Array(new Int32Array(d.shape).buffer);return ur(w,k,y,e,E,m,b,qt[a],t,v),g!=null&&n.disposeData(g.dataId),_}const Xd={kernelName:Gn,backendName:"wasm",setupFunc:jd,kernelFunc:qd};/**
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
 */let or;function Kd(r){or=r.wasm.cwrap(Un,null,["number","number","number","number","number","number"])}function Qd(r){const{inputs:n,backend:s,attrs:o}=r,{x:a}=n,{axis:t,exclusive:i,reverse:d}=o,c=a.shape.length;ge(a.dtype==="float32"||a.dtype==="int32",()=>`cumprod does not support ${a.dtype} tensors in the WASM backend`);const u=Yt([t],c);let e=a;u!==null&&(e=Ae({inputs:{x:a},attrs:{perm:u},backend:s}));const m=je(1,c)[0];Se("cumprod",[m],c);const b=s.makeOutput(e.shape,e.dtype),l=e.shape[m],f=s.dataIdMap.get(e.dataId).id,g=s.dataIdMap.get(b.dataId).id;or(f,i?1:0,d?1:0,l,g,$[a.dtype]);let w=b;if(u!==null){const k=jn(u);w=Ae({inputs:{x:b},attrs:{perm:k},backend:s}),s.disposeData(e.dataId),s.disposeData(b.dataId)}return w}const Jd={kernelName:Un,backendName:"wasm",setupFunc:Kd,kernelFunc:Qd};/**
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
 */let ir;function Yd(r){ir=r.wasm.cwrap(qn,null,["number","number","number","number","number","number"])}function Zd(r){const{inputs:n,backend:s,attrs:o}=r,{x:a}=n,{axis:t,exclusive:i,reverse:d}=o,c=a.shape.length;ge(a.dtype==="float32"||a.dtype==="int32",()=>`cumsum does not support ${a.dtype} tensors in the WASM backend`);const u=Yt([t],c);let e=a;u!==null&&(e=Ae({inputs:{x:a},attrs:{perm:u},backend:s}));const m=je(1,c)[0];Se("cumsum",[m],c);const b=s.makeOutput(e.shape,e.dtype),l=e.shape[m],f=s.dataIdMap.get(e.dataId).id,g=s.dataIdMap.get(b.dataId).id;ir(f,i?1:0,d?1:0,l,g,$[a.dtype]);let w=b;if(u!==null){const k=jn(u);w=Ae({inputs:{x:b},attrs:{perm:k},backend:s}),s.disposeData(e.dataId),s.disposeData(b.dataId)}return w}const ec={kernelName:qn,backendName:"wasm",setupFunc:Yd,kernelFunc:Zd};/**
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
 */let dr;function tc(r){dr=r.wasm.cwrap("DenseBincount",null,["number","array","number","number","boolean","number","number","boolean","number"])}function nc(r){const{backend:n,inputs:s,attrs:o}=r,{x:a,weights:t}=s,{size:i,binaryOutput:d}=o,c=t.shape.reduce((b,l)=>b*l,1)!==0,u=a.shape.length===1?[i]:[a.shape[0],i],e=n.makeOutput(u,t.dtype);function m(b){return n.dataIdMap.get(b.dataId).id}return dr(m(a),new Uint8Array(new Int32Array(a.shape).buffer),a.shape.length,i,c,m(t),$[t.dtype],d,m(e)),e}const ac={kernelName:vu,backendName:"wasm",setupFunc:tc,kernelFunc:nc};/**
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
 */let cr;function rc(r){cr=r.wasm.cwrap(Xn,null,["number","number","number","array","number","array","array","number","number"])}function sc(r){const{backend:n,inputs:s,attrs:o}=r,{x:a}=s,{blockSize:t,dataFormat:i}=o,d=a.shape[0],c=i==="NHWC"?a.shape[1]:a.shape[2],u=i==="NHWC"?a.shape[2]:a.shape[3],e=i==="NHWC"?a.shape[3]:a.shape[1],m=c*t,b=u*t,l=e/(t*t),f=i==="NHWC"?[d,m,b,l]:[d,l,m,b],g=n.makeOutput(f,"float32"),k=n.dataIdMap.get(a.dataId).id,y=new Uint8Array(new Int32Array(fe(a.shape)).buffer),_=new Uint8Array(new Int32Array(f).buffer),v=new Uint8Array(new Int32Array(fe(f)).buffer),E=n.dataIdMap.get(g.dataId).id;return cr(k,t,i==="NHWC"?1:0,y,a.shape.length-1,_,v,f.length,E),g}const uc={kernelName:Xn,backendName:"wasm",setupFunc:rc,kernelFunc:sc};/**
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
 */let pr;function oc(r){pr=r.wasm.cwrap(Kn,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function ic(r){const{inputs:n,attrs:s,backend:o}=r,{x:a,filter:t}=n,i=o.dataIdMap.get(a.dataId).id,d=o.dataIdMap.get(t.dataId).id,{strides:c,dilations:u,pad:e,dimRoundingMode:m}=s,b=u??[1,1],l=ut(a.shape,t.shape,c,b,e,m,!0),f=l.filterHeight,g=l.filterWidth,w=l.padInfo.top,k=l.padInfo.right,y=l.padInfo.bottom,_=l.padInfo.left,v=l.dilationHeight,E=l.dilationWidth,R=l.strideHeight,B=l.strideWidth,V=l.inChannels,z=l.outChannels,H=l.padInfo.type==="SAME"?1:0;if(l.dataFormat!=="channelsLast")throw new Error(`wasm backend DepthwiseConv2dNative does not support dataFormat:'${l.dataFormat}'. Please use 'channelsLast'.`);const U=o.makeOutput(l.outShape,"float32"),q=o.dataIdMap.get(U.dataId).id;return pr(i,a.shape[0],a.shape[1],a.shape[2],d,f,g,w,k,y,_,H,v,E,R,B,V,z,q),U}const dc={kernelName:Kn,backendName:"wasm",setupFunc:oc,kernelFunc:ic};/**
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
 */let lr;function cc(r){lr=r.wasm.cwrap("Diag",null,["number","number","number","number"])}function pc(r){const{inputs:n,backend:s}=r,{x:o}=n,a=F(o.shape),t=s.makeOutput([...o.shape,...o.shape],o.dtype);return lr(s.dataIdMap.get(o.dataId).id,$[o.dtype],a,s.dataIdMap.get(t.dataId).id),t}const lc={kernelName:Au,backendName:"wasm",setupFunc:cc,kernelFunc:pc};/**
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
 */let mr;function mc(r){mr=r.wasm.cwrap(Qn,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function fc(r){const{inputs:n,backend:s,attrs:o}=r,{x:a,filter:t}=n,{strides:i,pad:d,dilations:c}=o;if(a.dtype!==t.dtype)throw new Error(`Dilation2D error: x must have the same dtype as filter. Got ${a.dtype} and ${t.dtype}`);const u=en(a.shape,t.shape,i,d,"NHWC",c),e=s.makeOutput(u.outShape,a.dtype);return mr(s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(t.dataId).id,s.dataIdMap.get(e.dataId).id,$[a.dtype],u.batchSize,u.inChannels,u.inHeight,u.inWidth,u.outHeight,u.outWidth,u.strideHeight,u.strideWidth,u.dilationHeight,u.dilationWidth,u.filterHeight,u.filterWidth,u.padInfo.top,u.padInfo.left),e}const hc={kernelName:Qn,backendName:"wasm",setupFunc:mc,kernelFunc:fc};/**
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
 */let fr;function gc(r){fr=r.wasm.cwrap(Jn,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function bc(r){const{inputs:n,backend:s,attrs:o}=r,{x:a,filter:t,dy:i}=n,{strides:d,pad:c,dilations:u}=o;if(a.dtype!==t.dtype||a.dtype!==i.dtype)throw new Error(`Dilation2DBackpropFilter error: x must have the same dtype as filter and dy. Got ${a.dtype}, ${t.dtype}, and ${i.dtype}`);const e=en(a.shape,t.shape,d,c,"NHWC",u),m=s.makeOutput(t.shape,t.dtype);return fr(s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(t.dataId).id,s.dataIdMap.get(i.dataId).id,s.dataIdMap.get(m.dataId).id,$[a.dtype],e.batchSize,e.inChannels,e.inHeight,e.inWidth,e.outHeight,e.outWidth,e.strideHeight,e.strideWidth,e.dilationHeight,e.dilationWidth,e.filterHeight,e.filterWidth,e.padInfo.top,e.padInfo.left),m}const _c={kernelName:Jn,backendName:"wasm",setupFunc:gc,kernelFunc:bc};/**
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
 */let hr;function yc(r){hr=r.wasm.cwrap(Yn,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function Ic(r){const{inputs:n,backend:s,attrs:o}=r,{x:a,filter:t,dy:i}=n,{strides:d,pad:c,dilations:u}=o;if(a.dtype!==t.dtype||a.dtype!==i.dtype)throw new Error(`Dilation2DBackpropInput error: x must have the same dtype as filter and dy. Got ${a.dtype}, ${t.dtype}, and ${i.dtype}`);const e=en(a.shape,t.shape,d,c,"NHWC",u),m=s.makeOutput(a.shape,a.dtype);return hr(s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(t.dataId).id,s.dataIdMap.get(i.dataId).id,s.dataIdMap.get(m.dataId).id,$[a.dtype],e.batchSize,e.inChannels,e.inHeight,e.inWidth,e.outHeight,e.outWidth,e.strideHeight,e.strideWidth,e.dilationHeight,e.dilationWidth,e.filterHeight,e.filterWidth,e.padInfo.top,e.padInfo.left),m}const wc={kernelName:Yn,backendName:"wasm",setupFunc:yc,kernelFunc:Ic};/**
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
 */const kc=L(xu);/**
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
 */let gr;function Sc(r){gr=r.wasm.cwrap(Zn,null,["number","number","number"])}function Mc(r){const{inputs:n,backend:s}=r,{dy:o,y:a}=n,t=s.makeOutput(a.shape,"float32"),i=d=>s.dataIdMap.get(d.dataId).id;return gr(i(a),i(o),i(t)),t}const vc={kernelName:Zn,backendName:"wasm",setupFunc:Sc,kernelFunc:Mc};/**
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
 */const Ac=!1,xc=ee(Du,Ac,"bool");/**
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
 */const Dc=L(Nu);/**
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
 */const Nc=L(Cu,"float32");/**
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
 */function Xt(r){const{inputs:n,attrs:s,backend:o}=r,{input:a}=n,{dim:t}=s,i=a.shape.length,d=a.shape.slice();let c=t;return t<0&&(ge(-(i+1)<=t,()=>`Axis must be in the interval [${-(i+1)}, ${i}]`),c=i+t+1),d.splice(c,0,1),oe({inputs:{x:a},backend:o,attrs:{shape:d}})}const Cc={kernelName:Fu,backendName:"wasm",kernelFunc:Xt};/**
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
 */const Fc=L(Ru,"float32");/**
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
 */function br(r){const{attrs:{shape:n,value:s},backend:o}=r;let{attrs:{dtype:a}}=r;a=a||Pu(s);const t=o.makeOutput(n,a);return o.typedArrayFromHeap(t).fill(s),t}const Rc={kernelName:Eu,backendName:"wasm",kernelFunc:br};/**
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
 */let _r;function Ec(r){_r=r.wasm.cwrap(ea,null,["number","number","number","number","number","number"])}function Pc(r){const{inputs:n,backend:s}=r,{image:o}=n,a=s.makeOutput(o.shape,o.dtype),t=s.dataIdMap.get(o.dataId).id,i=s.dataIdMap.get(a.dataId).id,[d,c,u,e]=o.shape;return _r(t,d,c,u,e,i),a}const Oc={kernelName:ea,backendName:"wasm",kernelFunc:Pc,setupFunc:Ec};/**
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
 */const Wc=L(Ou);/**
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
 */const Bc=ee(Wu);/**
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
 */let yr;function Tc(r){yr=r.wasm.cwrap(ta,null,["number","number","number","number","number","number","number"])}function Hc(r){const{backend:n,inputs:s,attrs:o}=r,{varianceEpsilon:a}=o,{x:t,mean:i,variance:d,offset:c,scale:u}=s,e=n.dataIdMap.get(t.dataId).id,m=n.dataIdMap.get(i.dataId).id,b=n.dataIdMap.get(d.dataId).id,l=c!=null?n.dataIdMap.get(c.dataId).id:0,f=u!=null?n.dataIdMap.get(u.dataId).id:0,g=n.makeOutput(t.shape,t.dtype);if(F(t.shape)===0)return g;const w=n.dataIdMap.get(g.dataId).id;return yr(e,m,b,l,f,a,w),g}const Lc={kernelName:ta,backendName:"wasm",setupFunc:Tc,kernelFunc:Hc};/**
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
 */let Ir;function Vc(r){Ir=r.wasm.cwrap(na,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function $c(r){const{inputs:n,attrs:s,backend:o}=r,{x:a,filter:t,bias:i,preluActivationWeights:d}=n,{strides:c,pad:u,dilations:e,dataFormat:m,dimRoundingMode:b,activation:l,leakyreluAlpha:f}=s,g=ut(a.shape,t.shape,c,e,u,b),w=at[l];if(w==null)throw new Error(`${l} activation not yet supported for FusedConv2D in the wasm backend.`);const k=o.dataIdMap.get(a.dataId).id,y=o.dataIdMap.get(t.dataId).id,_=g.outChannels;let v=0;if(i!=null){const ne=o.dataIdMap.get(i.dataId);if(ne.shape.length!==1)throw new Error(`FusedConv2D only supports rank-1 bias but got rank ${ne.shape.length}.`);if(ne.shape[0]!==_)throw new Error(`FusedConv2D bias shape (${ne.shape}) does not match the number of output channels (${_})`);v=ne.id}const E=g.filterHeight,R=g.filterWidth,B=g.padInfo.top,V=g.padInfo.right,z=g.padInfo.bottom,H=g.padInfo.left,U=g.dilationHeight,q=g.dilationWidth,J=g.strideHeight,ue=g.strideWidth,X=g.inChannels,te=g.padInfo.type==="SAME"?1:0,pe=g.batchSize,G=g.inHeight,he=g.inWidth;if(m!=="NHWC")throw new Error(`wasm backend FusedConv2D does not support dataFormat:'${m}'. Please use 'NHWC'.`);const ie=o.makeOutput(g.outShape,"float32"),de=o.dataIdMap.get(ie.dataId).id,_e=d==null?0:o.dataIdMap.get(d.dataId).id;return Ir(k,pe,G,he,y,E,R,v,B,V,z,H,te,U,q,J,ue,X,_,w,_e,f||0,de),ie}const zc={kernelName:na,backendName:"wasm",setupFunc:Vc,kernelFunc:$c};/**
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
 */let wr;function Gc(r){wr=r.wasm.cwrap(aa,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function Uc(r){const{inputs:n,attrs:s,backend:o}=r,{x:a,filter:t,bias:i,preluActivationWeights:d}=n,{strides:c,pad:u,dilations:e,dataFormat:m,dimRoundingMode:b,activation:l,leakyreluAlpha:f}=s,g=ut(a.shape,t.shape,c,e,u,b,!0),w=at[l];if(w==null)throw new Error(`${l} activation not yet supported for FusedDepthwiseConv2D in the wasm backend.`);const k=o.dataIdMap.get(a.dataId).id,y=o.dataIdMap.get(t.dataId).id,_=g.outChannels;let v=0;if(i!=null){const ne=o.dataIdMap.get(i.dataId);if(ne.shape.length!==1)throw new Error(`FusedDepthwiseConv2D only supports rank-1 bias but got rank ${ne.shape.length}.`);if(ne.shape[0]!==_)throw new Error(`FusedDepthwiseConv2D bias shape (${ne.shape}) does not match the number of output channels (${_})`);v=ne.id}const E=g.filterHeight,R=g.filterWidth,B=g.padInfo.top,V=g.padInfo.right,z=g.padInfo.bottom,H=g.padInfo.left,U=g.dilationHeight,q=g.dilationWidth,J=g.strideHeight,ue=g.strideWidth,X=g.inChannels,te=g.padInfo.type==="SAME"?1:0,pe=g.batchSize,G=g.inHeight,he=g.inWidth;if(m!=="NHWC")throw new Error(`wasm backend FusedDepthwiseConv2D does not support dataFormat:'${m}'. Please use 'NHWC'.`);const ie=o.makeOutput(g.outShape,"float32"),de=o.dataIdMap.get(ie.dataId).id,_e=d==null?0:o.dataIdMap.get(d.dataId).id;return wr(k,pe,G,he,y,E,R,v,B,V,z,H,te,U,q,J,ue,X,_,w,_e,f||0,de),ie}const jc={kernelName:aa,backendName:"wasm",setupFunc:Gc,kernelFunc:Uc};/**
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
 */let kr;function qc(r){kr=r.wasm.cwrap(ra,null,["number","number","number","number","number","number","array","number"])}function Xc(r){const{backend:n,inputs:s}=r,{params:o,indices:a}=s,[t,i,d,c]=Bu(o,a),u=n.makeOutput(t,o.dtype);if(i===0)return u;const e=a.shape,m=e[e.length-1],l=n.dataIdMap.get(o.dataId).id,g=n.dataIdMap.get(a.dataId).id,w=new Uint8Array(new Int32Array(c).buffer),k=n.dataIdMap.get(u.dataId).id;return kr(l,$[o.dtype],g,i,m,d,w,k),u}const Kc={kernelName:ra,backendName:"wasm",setupFunc:qc,kernelFunc:Xc};/**
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
 */let Sr;function Qc(r){Sr=r.wasm.cwrap("Gather",null,["number","number","array","number","number","number","array","number"])}function Jc(r){const{backend:n,inputs:s,attrs:o}=r,{x:a,indices:t}=s,{axis:i,batchDims:d}=o,c=rt(i,a.shape)[0],u=n.readSync(t.dataId),e=a.shape[c];for(let z=0;z<u.length;++z){const H=u[z];ge(H<=e-1&&H>=0,()=>`GatherV2: the index value ${H} is not in [0, ${e-1}]`)}const m=Hu(a,t,c,d),b=oe({inputs:{x:a},attrs:{shape:[m.batchSize,m.outerSize,m.dimSize,m.sliceSize]},backend:n}),l=F(t.shape),f=oe({inputs:{x:t},attrs:{shape:[m.batchSize,l/m.batchSize]},backend:n}),g=[m.batchSize,m.outerSize,l/m.batchSize,m.sliceSize],w=n.makeOutput(g,a.dtype);if(F(a.shape)===0)return w;const k=b.shape.length-1,_=n.dataIdMap.get(b.dataId).id,E=n.dataIdMap.get(f.dataId).id,R=n.dataIdMap.get(w.dataId).id,B=new Uint8Array(new Int32Array(fe(b.shape)).buffer),V=new Uint8Array(new Int32Array(fe(g)).buffer);return Sr(_,$[a.dtype],B,k,E,m.batchSize,V,R),n.disposeData(b.dataId),n.disposeData(f.dataId),w.shape=m.outputShape,w}const Yc={kernelName:Tu,backendName:"wasm",setupFunc:Qc,kernelFunc:Jc};/**
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
 */const Zc=!1,ep=ee(Lu,Zc,"bool");/**
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
 */const tp=!1,np=ee(Vu,tp,"bool");/**
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
 */const ap=L($u,"bool");/**
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
 */const rp=L(zu,"bool");/**
 * @license
 * Copyright 2022 The TensorFlow Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const sp=L(Gu,"bool");/**
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
 */let Mr;function up(r){Mr=r.wasm.cwrap(sa,null,["number","number","number","number"])}function op(r){const{inputs:{x:n},attrs:{alpha:s},backend:o}=r,a=o.dataIdMap.get(n.dataId).id,t=o.makeOutput(n.shape,"float32");if(F(n.shape)!==0){const i=o.dataIdMap.get(t.dataId).id;Mr(a,$[n.dtype],s,i)}return t}const ip={kernelName:sa,backendName:"wasm",setupFunc:up,kernelFunc:op};/**
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
 */const dp=!1,cp=ee(Uu,dp,"bool");/**
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
 */const pp=!1,lp=ee(ju,pp,"bool");/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */let vr;function mp(r){vr=r.wasm.cwrap(ua,null,["number","number","number","number"])}function fp(r){const{attrs:n,backend:s}=r,{start:o,stop:a,num:t}=n,i=Math.floor(t),d=s.makeOutput([i],"float32");return vr(s.dataIdMap.get(d.dataId).id,o,a,i),d}const hp={kernelName:ua,backendName:"wasm",setupFunc:mp,kernelFunc:fp};/**
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
 */const gp=L(qu);/**
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
 */const bp=L(Xu);/**
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
 */const _p=!1,yp=ee(Ku,_p,"bool");/**
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
 */const Ip=L(Qu);/**
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
 */const wp=!1,kp=ee(Ju,wp,"bool");/**
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
 */const Sp=!1,Mp=ee(Yu,Sp,"bool");/**
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
 */let Ar;function vp(r){Ar=r.wasm.cwrap(oa,null,["number","number","number","number","number","number","number"])}function Ap(r){const{inputs:n,backend:s,attrs:o}=r,{x:a}=n,{depthRadius:t,bias:i,alpha:d,beta:c}=o;if(a.dtype!=="float32")throw new Error("LRN error: x must have dtype float32");const u=s.makeOutput(a.shape,a.dtype);return Ar(s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(u.dataId).id,a.shape[3],t,i,d,c),u}const xp={kernelName:oa,backendName:"wasm",setupFunc:vp,kernelFunc:Ap};/**
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
 */let xr;function Dp(r){xr=r.wasm.cwrap(ia,null,["number","number","number","number","number","number","number","number","number"])}function Np(r){const{inputs:n,backend:s,attrs:o}=r,{x:a,y:t,dy:i}=n,{depthRadius:d,bias:c,alpha:u,beta:e}=o;if(a.dtype!=="float32"||t.dtype!=="float32"||i.dtype!=="float32")throw new Error("LRNGrad error: x, y, and dy must have dtype float32");const m=s.makeOutput(a.shape,a.dtype);return xr(s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(t.dataId).id,s.dataIdMap.get(i.dataId).id,s.dataIdMap.get(m.dataId).id,i.shape[3],d,c,u,e),m}const Cp={kernelName:ia,backendName:"wasm",setupFunc:Dp,kernelFunc:Np};/**
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
 */let Dr;function Fp(r){Dr=r.wasm.cwrap(da,null,["number","number","number","number"])}function Rp(r){const{backend:n,inputs:s,attrs:o}=r,{reductionIndices:a,keepDims:t}=o,{x:i}=s;let c=n.dataIdMap.get(i.dataId).id,u=i;const{transposed:e,axes:m,originalAxes:b,inputWasTransposed:l}=xe(i,a,n);if(l){const _=n.dataIdMap.get(e.dataId).id;u=e,c=_}const f=u.shape.length;Se("max",m,f);const[g,w]=Be(u.shape,m),k=F(w),y=n.makeOutput(g,i.dtype);if(F(u.shape)!==0){const _=n.dataIdMap.get(y.dataId).id;Dr(c,$[i.dtype],k,_)}if(l&&n.disposeData(e.dataId),t){const _=Te(y.shape,b);y.shape=_}return y}const Ep={kernelName:da,backendName:"wasm",setupFunc:Fp,kernelFunc:Rp};/**
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
 */const Pp=ee(Zu);/**
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
 */let Nr;function Op(r){Nr=r.wasm.cwrap(ca,null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function Wp(r){const{inputs:n,attrs:s,backend:o}=r,a=n.x,t=o.dataIdMap.get(a.dataId).id;ge(a.dtype==="float32",()=>`Error in MaxPool: only float32 input is supported. Got ${a.dtype}.`);const{filterSize:i,strides:d,pad:c,dimRoundingMode:u}=s,e=st(a.shape,i,d,1,c,u),m=e.filterHeight,b=e.filterWidth,l=e.padInfo.top,f=e.padInfo.right,g=e.padInfo.bottom,w=e.padInfo.left,k=e.dilationHeight,y=e.dilationWidth,_=e.strideHeight,v=e.strideWidth,E=e.inChannels,R=e.outChannels;if(e.dataFormat!=="channelsLast")throw new Error(`wasm backend does not support dataFormat:'${e.dataFormat}'. Please use 'channelsLast'.`);const B=o.makeOutput(e.outShape,"float32"),V=o.dataIdMap.get(B.dataId).id;return Nr(t,a.shape[0],a.shape[1],a.shape[2],m,b,l,f,g,w,k,y,_,v,E,R,V),B}const Bp={kernelName:ca,backendName:"wasm",setupFunc:Op,kernelFunc:Wp};/**
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
 */let Cr;function Tp(r){Cr=r.wasm.cwrap("MaxPool3D",null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function Hp(r){const{inputs:n,backend:s,attrs:o}=r,{x:a}=n,{filterSize:t,strides:i,pad:d,dimRoundingMode:c,dataFormat:u}=o,e=Ft(a.shape,t,i,1,d,c,u),m=s.makeOutput(e.outShape,a.dtype);return Cr(s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(m.dataId).id,e.batchSize,e.inChannels,e.inDepth,e.inHeight,e.inWidth,e.outDepth,e.outHeight,e.outWidth,e.strideDepth,e.strideHeight,e.strideWidth,e.dilationDepth,e.dilationHeight,e.dilationWidth,e.effectiveFilterDepth,e.effectiveFilterHeight,e.effectiveFilterWidth,e.padInfo.front,e.padInfo.top,e.padInfo.left),m}const Lp={kernelName:eo,backendName:"wasm",setupFunc:Tp,kernelFunc:Hp};/**
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
 */let Fr;function Vp(r){Fr=r.wasm.cwrap("MaxPool3DGrad",null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function $p(r){const{inputs:n,backend:s,attrs:o}=r,{dy:a,input:t}=n,{filterSize:i,strides:d,pad:c,dimRoundingMode:u}=o,e=Ft(t.shape,i,d,1,c,u),m=s.makeOutput(t.shape,t.dtype);return Fr(s.dataIdMap.get(t.dataId).id,s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(m.dataId).id,e.batchSize,e.inChannels,e.inDepth,e.inHeight,e.inWidth,e.outDepth,e.outHeight,e.outWidth,e.strideDepth,e.strideHeight,e.strideWidth,e.dilationDepth,e.dilationHeight,e.dilationWidth,e.effectiveFilterDepth,e.effectiveFilterHeight,e.effectiveFilterWidth,e.padInfo.front,e.padInfo.top,e.padInfo.left),m}const zp={kernelName:to,backendName:"wasm",setupFunc:Vp,kernelFunc:$p};/**
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
 */let Rr;function Gp(r){Rr=r.wasm.cwrap("MaxPoolGrad",null,["number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function Up(r){const{inputs:n,backend:s,attrs:o}=r,{dy:a,input:t}=n,{filterSize:i,strides:d,pad:c,dimRoundingMode:u}=o,e=st(t.shape,i,d,1,c,u),m=s.makeOutput(t.shape,t.dtype);return Rr(s.dataIdMap.get(t.dataId).id,s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(m.dataId).id,e.batchSize,e.inChannels,e.inHeight,e.inWidth,e.outHeight,e.outWidth,e.strideHeight,e.strideWidth,e.dilationHeight,e.dilationWidth,e.effectiveFilterHeight,e.effectiveFilterWidth,e.padInfo.top,e.padInfo.left),m}const jp={kernelName:no,backendName:"wasm",setupFunc:Gp,kernelFunc:Up};/**
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
 */let Er;function qp(r){Er=r.wasm.cwrap("MaxPoolWithArgmax",null,["number","number","number","number","boolean","number","number","number","number","number","number","number","number","number","number","number","number","number","number"])}function Xp(r){const{inputs:n,backend:s,attrs:o}=r,{x:a}=n,{filterSize:t,strides:i,pad:d,includeBatchInIndex:c}=o;ge(a.shape.length===4,()=>`Error in maxPool: input must be rank 4 but got rank ${a.shape.length}.`);const u=[1,1];ge(ro(i,u),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${i} and dilations '${u}'`);const e=st(a.shape,t,i,[1,1],d),m=s.makeOutput(e.outShape,a.dtype),b=s.makeOutput(e.outShape,"int32");return Er(s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(m.dataId).id,s.dataIdMap.get(b.dataId).id,$[a.dtype],c,e.batchSize,e.inChannels,e.inHeight,e.inWidth,e.outHeight,e.outWidth,e.strideHeight,e.strideWidth,e.dilationHeight,e.dilationWidth,e.effectiveFilterHeight,e.effectiveFilterWidth,e.padInfo.top,e.padInfo.left),[m,b]}const Kp={kernelName:ao,backendName:"wasm",setupFunc:qp,kernelFunc:Xp};/**
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
 */let Pr;function Qp(r){Pr=r.wasm.cwrap(pa,null,["number, number, number"])}function Jp(r){const{backend:n,inputs:s,attrs:o}=r,{axis:a,keepDims:t}=o,{x:i}=s,d=n.dataIdMap.get(i.dataId).id;let c=d,u=i;const{transposed:e,axes:m,originalAxes:b,inputWasTransposed:l}=xe(i,a,n);let f=m;if(l){const v=n.dataIdMap.get(e.dataId).id;v!==d&&(u=e,c=v,f=je(f.length,u.shape.length))}Se("mean",f,u.shape.length);const[g,w]=Be(u.shape,f),k=F(w);let y=u;u.dtype!=="float32"&&(y=De({backend:n,inputs:{x:u},attrs:{dtype:"float32"}}),c=n.dataIdMap.get(y.dataId).id);const _=n.makeOutput(g,"float32");if(F(u.shape)!==0){const v=n.dataIdMap.get(_.dataId).id;Pr(c,k,v)}if(l&&n.disposeData(e.dataId),t){const v=Te(_.shape,b);_.shape=v}return u.dtype!=="float32"&&n.disposeData(y.dataId),_}const Yp={kernelName:pa,backendName:"wasm",setupFunc:Qp,kernelFunc:Jp};/**
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
 */let Or;function Zp(r){Or=r.wasm.cwrap(la,null,["number","number","number","number"])}function el(r){const{backend:n,inputs:s,attrs:o}=r,{axis:a,keepDims:t}=o,{x:i}=s,d=n.dataIdMap.get(i.dataId).id;let c=d,u=i;const{transposed:e,axes:m,originalAxes:b,inputWasTransposed:l}=xe(i,a,n);if(l){const _=n.dataIdMap.get(e.dataId).id;_!==d&&(u=e,c=_)}const f=u.shape.length;Se("min",m,f);const[g,w]=Be(u.shape,m),k=F(w),y=n.makeOutput(g,u.dtype);if(F(u.shape)!==0){const _=n.dataIdMap.get(y.dataId).id;Or(c,$[i.dtype],k,_)}if(l&&n.disposeData(e.dataId),t){const _=Te(y.shape,b);y.shape=_}return y}const tl={kernelName:la,backendName:"wasm",setupFunc:Zp,kernelFunc:el};/**
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
 */const nl=ee(so);/**
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
 */var Kt;(function(r){r[r.reflect=0]="reflect",r[r.symmetric=1]="symmetric"})(Kt||(Kt={}));let Wr;function al(r){Wr=r.wasm.cwrap(ma,null,["number","array","number","number","array","array","number","number"])}function rl(r){const{inputs:{x:n},backend:s,attrs:{paddings:o,mode:a}}=r,t=o.map((f,g)=>f[0]+n.shape[g]+f[1]),i=s.dataIdMap.get(n.dataId).id,d=s.makeOutput(t,n.dtype),c=s.dataIdMap.get(d.dataId).id,u=new Uint8Array(new Int32Array(n.shape).buffer),e=o.map(f=>f[0]),m=o.map(f=>f[1]),b=new Uint8Array(new Int32Array(e).buffer),l=new Uint8Array(new Int32Array(m).buffer);return Wr(i,u,n.shape.length,$[n.dtype],b,l,Kt[a],c),d}const sl={kernelName:ma,backendName:"wasm",kernelFunc:rl,setupFunc:al};/**
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
 */let Br;function ul(r){Br=r.wasm.cwrap(fa,null,["number","number","number","number"])}function Tr(r){const{backend:n,inputs:{logits:s},attrs:{dim:o}}=r,a=n.dataIdMap.get(s.dataId).id,t=n.makeOutput(s.shape,s.dtype),i=n.dataIdMap.get(t.dataId).id,d=s.shape[o],c=F(s.shape)/d;return F(t.shape)===0||Br(a,i,d,c),t}const ol={kernelName:fa,backendName:"wasm",setupFunc:ul,kernelFunc:Tr};/**
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
 */let Hr;function il(r){Hr=r.wasm.cwrap(ha,null,["number","number","number","number","number","number"])}function dl(r){const{inputs:n,backend:s,attrs:o}=r,{logits:a}=n,{numSamples:t,seed:i,normalized:d}=o;if(a.dtype!=="float32")throw new Error(`Tensor logits must have dtype float32, got ${a.dtype}`);const c=d?a:Tr({inputs:{logits:a},backend:s,attrs:{dim:a.shape.length-1}}),[u,e]=c.shape,m=s.makeOutput([u,t],"int32");return Hr(s.dataIdMap.get(c.dataId).id,u,e,t,i,s.dataIdMap.get(m.dataId).id),d||s.disposeData(c.dataId),m}const cl={kernelName:ha,backendName:"wasm",setupFunc:il,kernelFunc:dl};/**
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
 */const pl=ee(uo);/**
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
 */const ll=ee(oo);/**
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
 */const ml=L(io);/**
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
 */function nn(r,n){const s=new Int32Array(r.wasm.HEAPU8.buffer,n,4),o=s[0],a=s[1],t=s[2],i=s[3];return r.wasm._free(n),{pSelectedIndices:o,selectedSize:a,pSelectedScores:t,pValidOutputs:i}}/**
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
 */let Lr;function fl(r){Lr=r.wasm.cwrap(ga,"number",["number","number","number","number","number"])}function hl(r){const{backend:n,inputs:s,attrs:o}=r,{iouThreshold:a,maxOutputSize:t,scoreThreshold:i}=o,{boxes:d,scores:c}=s,u=n.dataIdMap.get(d.dataId).id,e=n.dataIdMap.get(c.dataId).id,m=Lr(u,e,t,a,i),{pSelectedIndices:b,selectedSize:l,pSelectedScores:f,pValidOutputs:g}=nn(n,m);return n.wasm._free(f),n.wasm._free(g),n.makeOutput([l],"int32",b)}const gl={kernelName:ga,backendName:"wasm",setupFunc:fl,kernelFunc:hl};/**
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
 */let Vr;function bl(r){Vr=r.wasm.cwrap(ba,"number",["number","number","number","number","number","bool"])}function _l(r){const{backend:n,inputs:s,attrs:o}=r,{iouThreshold:a,maxOutputSize:t,scoreThreshold:i,padToMaxOutputSize:d}=o,{boxes:c,scores:u}=s,e=n.dataIdMap.get(c.dataId).id,m=n.dataIdMap.get(u.dataId).id,b=Vr(e,m,t,a,i,d),{pSelectedIndices:l,selectedSize:f,pSelectedScores:g,pValidOutputs:w}=nn(n,b);n.wasm._free(g);const k=n.makeOutput([f],"int32",l),y=n.makeOutput([],"int32",w);return[k,y]}const yl={kernelName:ba,backendName:"wasm",setupFunc:bl,kernelFunc:_l};/**
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
 */let $r;function Il(r){$r=r.wasm.cwrap(_a,"number",["number","number","number","number","number","number"])}function wl(r){const{backend:n,inputs:s,attrs:o}=r,{iouThreshold:a,maxOutputSize:t,scoreThreshold:i,softNmsSigma:d}=o,{boxes:c,scores:u}=s,e=n.dataIdMap.get(c.dataId).id,m=n.dataIdMap.get(u.dataId).id,b=$r(e,m,t,a,i,d),{pSelectedIndices:l,selectedSize:f,pSelectedScores:g,pValidOutputs:w}=nn(n,b);n.wasm._free(w);const k=n.makeOutput([f],"int32",l),y=n.makeOutput([f],"float32",g);return[k,y]}const kl={kernelName:_a,backendName:"wasm",setupFunc:Il,kernelFunc:wl};/**
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
 */const Sl=!1,Ml=ee(co,Sl,"bool");/**
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
 */let zr;function vl(r){zr=r.wasm.cwrap(ya,null,["number","number","number","number","number"])}function Al(r){const{inputs:n,backend:s,attrs:o}=r,{indices:a}=n,{dtype:t,depth:i,onValue:d,offValue:c}=o,u=s.makeOutput([...a.shape,i],t),e=s.dataIdMap.get(u.dataId).id,b=s.dataIdMap.get(a.dataId).id;return zr(b,i,d,c,e),u}const xl={kernelName:ya,backendName:"wasm",setupFunc:vl,kernelFunc:Al};/**
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
 */function Dl(r){const{inputs:{x:n},backend:s}=r,o=s.makeOutput(n.shape,n.dtype);return s.typedArrayFromHeap(o).fill(1),o}const Nl={kernelName:po,backendName:"wasm",kernelFunc:Dl};/**
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
 */function Cl(r){const{inputs:n,backend:s,attrs:o}=r,{axis:a}=o;if(n.length===1)return Xt({inputs:{input:n[0]},backend:s,attrs:{dim:a}});const t=n[0].shape,i=n[0].dtype;n.forEach(e=>{mo(t,e.shape,"All tensors passed to stack must have matching shapes"),ge(i===e.dtype,()=>"All tensors passed to stack must have matching dtypes")});const d=[],c=n.map(e=>{const m=Xt({inputs:{input:e},backend:s,attrs:{dim:a}});return d.push(m),m}),u=er({inputs:c,backend:s,attrs:{axis:a}});return d.forEach(e=>s.disposeData(e.dataId)),u}const Fl={kernelName:lo,backendName:"wasm",kernelFunc:Cl};/**
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
 */let Gr;function Rl(r){Gr=r.wasm.cwrap(Ia,null,["number","array","number","number","array","array","number","number"])}function El(r){const{inputs:{x:n},backend:s,attrs:{paddings:o,constantValue:a}}=r,t=o.map((g,w)=>g[0]+n.shape[w]+g[1]);if(F(n.shape)===0)return br({backend:s,attrs:{shape:t,value:a,dtype:n.dtype}});const i=s.dataIdMap.get(n.dataId).id,d=s.makeOutput(t,n.dtype),u=s.dataIdMap.get(d.dataId).id,e=new Uint8Array(new Int32Array(n.shape).buffer),m=o.map(g=>g[0]),b=o.map(g=>g[1]),l=new Uint8Array(new Int32Array(m).buffer),f=new Uint8Array(new Int32Array(b).buffer);return Gr(i,e,n.shape.length,$[n.dtype],l,f,a,u),d}const Ur={kernelName:Ia,backendName:"wasm",kernelFunc:El,setupFunc:Rl};/**
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
 */const Pl=ee(fo);/**
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
 */let jr;function Ol(r){jr=r.wasm.cwrap(wa,null,["number","number","number"])}function Wl(r){const{inputs:n,backend:s}=r,{x:o,alpha:a}=n,t=s.dataIdMap.get(o.dataId).id,i=s.dataIdMap.get(a.dataId).id;let d=t;const c=o;let u=c;c.dtype!=="float32"&&(u=De({backend:s,inputs:{x:o},attrs:{dtype:"float32"}}),d=s.dataIdMap.get(u.dataId).id);const e=s.makeOutput(o.shape,"float32"),m=s.dataIdMap.get(e.dataId).id;return jr(d,i,m),c.dtype!=="float32"&&s.disposeData(u.dataId),e}const Bl={kernelName:wa,backendName:"wasm",setupFunc:Ol,kernelFunc:Wl};/**
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
 */let qr;function Tl(r){qr=r.wasm.cwrap(ka,null,["number","number","number","number"])}function Hl(r){const{backend:n,inputs:s,attrs:o}=r,{axis:a,keepDims:t}=o,{x:i}=s,d=n.dataIdMap.get(i.dataId).id;let c=d,u=i;const{transposed:e,axes:m,originalAxes:b,inputWasTransposed:l}=xe(i,a,n);let f=m;if(l){const _=n.dataIdMap.get(e.dataId).id;_!==d&&(u=e,c=_,f=je(f.length,u.shape.length))}Se("prod",f,u.shape.length);const[g,w]=Be(u.shape,f),k=F(w),y=n.makeOutput(g,u.dtype);if(F(u.shape)!==0){const _=n.dataIdMap.get(y.dataId).id;qr(c,k,$[y.dtype],_)}if(l&&n.disposeData(e.dataId),t){const _=Te(y.shape,b);y.shape=_}return y}const Ll={kernelName:ka,backendName:"wasm",setupFunc:Tl,kernelFunc:Hl};/**
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
 */const Vl=r=>{const{backend:n,attrs:s}=r,{start:o,stop:a,step:t,dtype:i}=s,d=hi(o,a,t,i),c=n.makeOutput([d.length],i);return n.typedArrayFromHeap(c).set(d),c},$l={kernelName:ho,backendName:"wasm",kernelFunc:Vl};/**
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
 */const zl=ee(go);/**
 * @license
 * Copyright 2022 The TensorFlow Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Gl=L(bo);/**
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
 */const Ul=L(_o);/**
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
 */const jl=L(yo);/**
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
 */let Xr;function ql(r){Xr=r.wasm.cwrap(Sa,null,["number","number","number","number","number","number","number","number","number","number"])}function Xl(r){const{backend:n,inputs:s,attrs:o}=r,{images:a}=s,{alignCorners:t,halfPixelCenters:i,size:d}=o,[c,u]=d,[e,m,b,l]=a.shape,f=[e,c,u,l];let g=n.dataIdMap.get(a.dataId),w;g.dtype!=="float32"&&(w=De({backend:n,inputs:{x:a},attrs:{dtype:"float32"}}),g=n.dataIdMap.get(w.dataId));const k=g.id,y=n.makeOutput(f,"float32");if(F(a.shape)===0)return y;const _=n.dataIdMap.get(y.dataId).id;return Xr(k,e,m,b,l,c,u,t?1:0,i?1:0,_),w!=null&&n.disposeData(w.dataId),y}const Kl={kernelName:Sa,backendName:"wasm",setupFunc:ql,kernelFunc:Xl};/**
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
 */let Kr;function Ql(r){Kr=r.wasm.cwrap(Ma,null,["number","number","number","array","array","boolean"])}function Jl(r){const{inputs:n,backend:s,attrs:o}=r,{images:a,dy:t}=n,{alignCorners:i}=o,d=s.makeOutput(a.shape,"float32");let c=s.dataIdMap.get(a.dataId),u;return c.dtype!=="float32"&&(u=De({backend:s,inputs:{x:a},attrs:{dtype:"float32"}}),c=s.dataIdMap.get(u.dataId)),Kr(s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(t.dataId).id,s.dataIdMap.get(d.dataId).id,new Uint8Array(new Int32Array(a.shape).buffer),new Uint8Array(new Int32Array(t.shape).buffer),i),u!=null&&s.disposeData(u.dataId),d}const Yl={kernelName:Ma,backendName:"wasm",setupFunc:Ql,kernelFunc:Jl};/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
 */let Qr;function Zl(r){Qr=r.wasm.cwrap(va,null,["number","number","number","number","number","number","number","number","number","number"])}function em(r){const{backend:n,inputs:s,attrs:o}=r,{images:a}=s,{alignCorners:t,halfPixelCenters:i,size:d}=o,[c,u]=d,[e,m,b,l]=a.shape,f=[e,c,u,l],g=n.makeOutput(f,"float32");if(F(a.shape)===0)return g;let w=n.dataIdMap.get(a.dataId),k;w.dtype!=="float32"&&(k=De({backend:n,inputs:{x:a},attrs:{dtype:"float32"}}),w=n.dataIdMap.get(k.dataId));const y=w.id,_=n.dataIdMap.get(g.dataId).id;return Qr(y,e,m,b,l,c,u,t?1:0,i?1:0,_),k!=null&&n.disposeData(k.dataId),g}const tm={kernelName:va,backendName:"wasm",setupFunc:Zl,kernelFunc:em};/**
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
 */let Jr;function nm(r){Jr=r.wasm.cwrap(Aa,null,["number","number","number","array","array","boolean"])}function am(r){const{inputs:n,backend:s,attrs:o}=r,{images:a,dy:t}=n,{alignCorners:i}=o,d=s.makeOutput(a.shape,"float32");let c=s.dataIdMap.get(a.dataId),u;return c.dtype!=="float32"&&(u=De({backend:s,inputs:{x:a},attrs:{dtype:"float32"}}),c=s.dataIdMap.get(u.dataId)),Jr(s.dataIdMap.get(a.dataId).id,s.dataIdMap.get(t.dataId).id,s.dataIdMap.get(d.dataId).id,new Uint8Array(new Int32Array(a.shape).buffer),new Uint8Array(new Int32Array(t.shape).buffer),i),u!=null&&s.disposeData(u.dataId),d}const rm={kernelName:Aa,backendName:"wasm",setupFunc:nm,kernelFunc:am};/**
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
 */let Yr;function sm(r){Yr=r.wasm.cwrap(xa,null,["number","array","number","array","number","number"])}function um(r){const{inputs:n,backend:s,attrs:o}=r,{x:a}=n,{dims:t}=o,i=rt(t,a.shape);if(a.shape.length===0)return Rt({inputs:{x:a},backend:s});const d=s.makeOutput(a.shape,a.dtype),c=s.dataIdMap.get(a.dataId).id,u=s.dataIdMap.get(d.dataId).id,e=new Uint8Array(new Int32Array(i).buffer),m=new Uint8Array(new Int32Array(a.shape).buffer);Yr(c,e,i.length,m,a.shape.length,u);const b=oe({inputs:{x:d},attrs:{shape:a.shape},backend:s});return s.disposeData(d.dataId),b}const om={kernelName:xa,backendName:"wasm",kernelFunc:um,setupFunc:sm};/**
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
 */let Zr;function im(r){Zr=r.wasm.cwrap(Da,null,["number","number","number","number","number","number","number","number","array","number","number"])}function dm(r){const{inputs:n,backend:s,attrs:o}=r,{image:a}=n,{radians:t,fillValue:i,center:d}=o,c=s.makeOutput(a.shape,a.dtype),u=s.dataIdMap.get(a.dataId).id,e=s.dataIdMap.get(c.dataId).id,[m,b,l,f]=a.shape,[g,w]=Io(d,b,l),k=i===0,y=255,_=typeof i=="number"?[i,i,i,k?0:y]:[...i,y],v=new Uint8Array(new Int32Array(_).buffer);return Zr(u,m,b,l,f,t,g,w,v,_.length,e),c}const cm={kernelName:Da,backendName:"wasm",kernelFunc:dm,setupFunc:im};/**
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
 */const pm=L(wo);/**
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
 */const lm=L(ko);/**
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
 */let es;function mm(r){es=r.wasm.cwrap(Na,null,["number","number","number","number","number","number","array","number","number"])}function fm(r){const{backend:n,inputs:s,attrs:o}=r,{indices:a,updates:t}=s,{shape:i}=o,d=n.makeOutput(i,t.dtype);if(F(i)===0)return d;const{sliceRank:c,numUpdates:u,sliceSize:e,strides:m,outputSize:b}=tn(t,a,i),f=n.dataIdMap.get(a.dataId).id,w=n.dataIdMap.get(t.dataId).id,k=new Uint8Array(new Int32Array(m).buffer),y=n.dataIdMap.get(d.dataId).id;return es(f,w,$[t.dtype],c,u,e,k,b,y),d}const hm={kernelName:Na,backendName:"wasm",setupFunc:mm,kernelFunc:fm};/**
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
 */let ts;function gm(r){ts=r.wasm.cwrap(Ca,null,["number","number","number","number","number","number","bool","number"])}function bm(r){const{inputs:n,backend:s,attrs:o}=r,{sortedSequence:a,values:t}=n,{side:i}=o;if(a.dtype!==t.dtype)throw new Error(`SearchSorted error: sorted_sequence must have the same dtype as values. Got ${a.dtype} and ${t.dtype}`);const d=s.makeOutput(t.shape,"int32");function c(u){return s.dataIdMap.get(u.dataId).id}return ts(c(a),c(t),a.shape[0],a.shape[1],t.shape[1],$[a.dtype],i==="left",c(d)),d}const _m={kernelName:Ca,backendName:"wasm",setupFunc:gm,kernelFunc:bm};/**
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
 */let ns;function ym(r){ns=r.wasm.cwrap("SelectV2",null,["number","number","number","number","number"])}function Im(r){const{inputs:n,backend:s}=r,{condition:o,t:a,e:t}=n,i=s.dataIdMap.get(o.dataId).id,d=s.dataIdMap.get(a.dataId).id,c=s.dataIdMap.get(t.dataId).id,u=s.makeOutput(a.shape,a.dtype),e=s.dataIdMap.get(u.dataId).id,m=o.shape.length,b=a.shape.length,l=m===0||m>1||b===1?1:F(a.shape.slice(1));return ns(i,d,c,l,e),u}const wm={kernelName:So,backendName:"wasm",kernelFunc:Im,setupFunc:ym};/**
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
 */const km=L(Mo);/**
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
 */let as;function Sm(r){as=r.wasm.cwrap(vo,null,["number","number"])}function Mm(r){const{backend:n,inputs:{x:s}}=r,o=n.dataIdMap.get(s.dataId).id,a=n.makeOutput(s.shape,s.dtype),t=n.dataIdMap.get(a.dataId).id;return F(a.shape)===0||as(o,t),a}const vm={kernelName:"Sigmoid",backendName:"wasm",setupFunc:Sm,kernelFunc:Mm};/**
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
 */const Am=L(Ao);/**
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
 */const xm=L(xo);/**
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
 */const Dm=L(Do);/**
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
 */const Nm=L(No);/**
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
 */function Cm(r){const{inputs:n,backend:s,attrs:o}=r,{x:a}=n,{blockShape:t,paddings:i}=o,d=F(t),c=[[0,0]];c.push(...i);for(let R=1+t.length;R<a.shape.length;++R)c.push([0,0]);const u=Ur.kernelFunc({inputs:{x:a},backend:s,attrs:{paddings:c,constantValue:0}}),e=En(u.shape,t,d,!1),m=Pn(e.length,t.length,!1),b=On(u.shape,t,d,!1),g=oe({inputs:{x:u},backend:s,attrs:{shape:e}}),y=Ae({inputs:{x:g},backend:s,attrs:{perm:m}}),E=oe({inputs:{x:y},backend:s,attrs:{shape:b}});return s.disposeData(u.dataId),s.disposeData(g.dataId),s.disposeData(y.dataId),E}const Fm={kernelName:Co,backendName:"wasm",kernelFunc:Cm};/**
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
 */let rs;function Rm(r){rs=r.wasm.cwrap("SparseFillEmptyRows","number",["number","number","number","number","number","number","number","number","number","number","number","number"])}function Em(r){const{backend:n,inputs:s}=r,{indices:o,values:a,denseShape:t,defaultValue:i}=s,d=o.shape[0],c=o.shape[1],u=n.readSync(t.dataId)[0],e=[d+u,c],m=n.dataIdMap.get(o.dataId).id,b=n.dataIdMap.get(a.dataId).id,l=n.dataIdMap.get(i.dataId).id,f=n.makeOutput(e,o.dtype),g=n.dataIdMap.get(f.dataId).id,w=n.makeOutput(e.slice(0,1),a.dtype),k=n.dataIdMap.get(w.dataId).id,y=n.makeOutput([u],"bool"),_=n.dataIdMap.get(y.dataId).id,v=n.makeOutput([d],o.dtype),E=n.dataIdMap.get(v.dataId).id,R=n.makeOutput([4],"int32"),B=n.dataIdMap.get(R.dataId).id,V=rs(m,b,$[a.dtype],d,u,c,l,g,k,_,E,B),z=n.readSync(R.dataId);let H;switch(z[0]){case 1:{H=Po(z[1]);break}case 2:{H=Eo(z[1],z[2]);break}case 3:H=Ro(z[1],z[2],z[3]);break;default:H=""}if(n.disposeData(R.dataId),H)throw n.disposeData(f.dataId),n.disposeData(w.dataId),n.disposeData(y.dataId),n.disposeData(v.dataId),new Error(H);let U=f,q=w;return V!==e[0]&&(U=We({inputs:{x:f},attrs:{begin:0,size:[V,c]},backend:n}),q=We({inputs:{x:w},attrs:{begin:0,size:V},backend:n}),n.disposeData(f.dataId),n.disposeData(w.dataId)),[U,q,y,v]}const Pm={kernelName:Fo,backendName:"wasm",setupFunc:Rm,kernelFunc:Em};/**
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
 */let ss;function Om(r){ss=r.wasm.cwrap(Fa,null,["number","number","number","number","number","number","number"])}function Wm(r){const{backend:n,inputs:s}=r,{inputIndices:o,inputShape:a,newShape:t}=s;if(o.shape.length!==2)throw new Error(`Input indices should be a matrix but received shape
        ${o.shape}`);if(a.shape.length!==1)throw new Error(`Input shape should be a vector but received shape
        ${a.shape}`);if(t.shape.length!==1)throw new Error(`Target shape should be a vector but received shape ${t.shape}`);const i=n.dataIdMap.get(o.dataId).id,d=n.dataIdMap.get(a.dataId).id,c=n.dataIdMap.get(t.dataId).id,u=o.shape[0],e=F(t.shape),m=n.makeOutput([u,e],o.dtype),b=n.dataIdMap.get(m.dataId).id,l=n.makeOutput([e],t.dtype),f=n.dataIdMap.get(l.dataId).id,g=n.makeOutput([3],"int32"),w=n.dataIdMap.get(g.dataId).id;ss(i,d,c,u,b,f,w);const k=n.readSync(g.dataId);let y;switch(k[0]){case 0:{y=To(k[1],k[2]);break}case 1:{y=Bo(k[1],k[2]);break}case 2:y=Ho();break;case 3:{const _=Array.from(n.readSync(a.dataId)),v=Array.from(n.readSync(l.dataId));y=Wo(_,v);break}case 4:{const _=Array.from(n.readSync(a.dataId)),v=Array.from(n.readSync(l.dataId));y=Oo(_,v);break}default:y=""}if(n.disposeData(g.dataId),y)throw n.disposeData(m.dataId),n.disposeData(l.dataId),new Error(y);return[m,l]}const Bm={kernelName:Fa,backendName:"wasm",setupFunc:Om,kernelFunc:Wm};/**
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
 */let us;function os(r){us=r.wasm.cwrap("SparseSegmentReduction",null,["number","number","number","number","number","number","number","number","number"])}function is(r,n){const{backend:s,inputs:o}=r,{data:a,indices:t,segmentIds:i}=o,d=t.shape[0],c=s.readSync(i.dataId,d-1,d)[0],e=d>0?c+1:0;if(e<0)throw new Error(yn());const m=a.shape.slice();m[0]=e;const b=s.dataIdMap.get(a.dataId).id,l=s.dataIdMap.get(t.dataId).id,f=s.dataIdMap.get(i.dataId).id,g=s.makeOutput(m,a.dtype),w=s.dataIdMap.get(g.dataId).id,k=s.makeOutput([4],"int32"),y=s.dataIdMap.get(k.dataId).id;us(b,$[a.dtype],a.shape[0],l,f,w,y,n,0);const _=s.readSync(k.dataId);let v;switch(_[0]){case 0:{v=yn();break}case 1:{v=$o();break}case 2:v=Vo(_[1],_[2]);break;case 3:v=Lo(_[1],_[2],_[3]);break;default:v=""}if(s.disposeData(k.dataId),v)throw s.disposeData(g.dataId),new Error(v);return g}/**
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
 */function Tm(r){return is(r,!0)}const Hm={kernelName:zo,backendName:"wasm",setupFunc:os,kernelFunc:Tm};/**
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
 */function Lm(r){return is(r,!1)}const Vm={kernelName:Go,backendName:"wasm",setupFunc:os,kernelFunc:Lm};/**
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
 */let ds;function $m(r){ds=r.wasm.cwrap(Ra,null,["number","number","number","number","number","number","number","number","array","number","number"])}function zm(r){const{backend:n,inputs:s,attrs:o}=r,{sparseIndices:a,sparseValues:t,defaultValue:i}=s,{outputShape:d}=o,c=n.makeOutput(d,i.dtype);if(F(d)===0)return c;const{sliceRank:u,numUpdates:e,sliceSize:m,strides:b,outputSize:l}=tn(t,a,d),f=n.dataIdMap.get(a.dataId).id,g=n.dataIdMap.get(t.dataId).id,w=n.dataIdMap.get(i.dataId).id,k=new Uint8Array(new Int32Array(b).buffer),y=n.dataIdMap.get(c.dataId).id;return ds(f,g,t.shape.length,w,$[i.dtype],u,e,m,k,l,y),c}const Gm={kernelName:Ra,backendName:"wasm",setupFunc:$m,kernelFunc:zm};/**
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
 */function Um(r){const{inputs:n,attrs:s,backend:o}=r,{x:a}=n,{numOrSizeSplits:t,axis:i}=s,d=rt(i,a.shape)[0],c=jo(a,t,d),u=new Array(a.shape.length).fill(0),e=a.shape.slice();return c.map(m=>{const b=[...e];b[d]=m;const l=We({inputs:{x:a},attrs:{begin:u,size:b},backend:o});return u[d]+=m,l})}const jm={kernelName:Uo,backendName:"wasm",kernelFunc:Um};/**
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
 */const qm=L(qo);/**
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
 */const Xm=L(Xo);/**
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
 */const Km=ee(Ko);/**
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
 */let cs;function Qm(r){cs=r.wasm.cwrap(Ea,null,["number","number","number","number"])}function Jm(r){const{backend:n,inputs:s,attrs:o}=r,{alpha:a}=o,{x:t}=s,i=n.dataIdMap.get(t.dataId).id,d=n.makeOutput(t.shape,t.dtype),c=n.dataIdMap.get(d.dataId).id;return cs(i,a,$[t.dtype],c),d}const Ym={kernelName:Ea,backendName:"wasm",setupFunc:Qm,kernelFunc:Jm};/**
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
 */let ps;function Zm(r){ps=r.wasm.cwrap(Pa,null,["number","array","number","array","array","array","array","array","number","number"])}function ef(r){const{backend:n,inputs:s,attrs:o}=r,{x:a}=s,{begin:t,end:i,strides:d,beginMask:c,endMask:u,ellipsisMask:e,newAxisMask:m,shrinkAxisMask:b}=o,{finalShapeSparse:l,finalShape:f,isIdentity:g,sliceDim0:w,isSimpleSlice:k,begin:y,end:_,strides:v}=Qo(a.shape,t,i,d,c,u,e,m,b);let E;if(g)E=oe({inputs:{x:a},backend:n,attrs:{shape:f}});else if(w||k){ge(a.shape.length>=1,()=>`Input must have rank at least 1, got: ${a.shape.length}`);const R=Jo(y,_,v),B=We({inputs:{x:a},backend:n,attrs:{begin:y,size:R}});E=oe({inputs:{x:B},backend:n,attrs:{shape:f}}),n.disposeData(B.dataId)}else{const R=n.makeOutput(l,"float32"),B=n.dataIdMap.get(a.dataId).id,V=new Uint8Array(new Int32Array(fe(a.shape)).buffer),z=new Uint8Array(new Int32Array(y).buffer),H=new Uint8Array(new Int32Array(_).buffer),U=new Uint8Array(new Int32Array(v).buffer),q=new Uint8Array(new Int32Array(l).buffer),J=new Uint8Array(new Int32Array(fe(l)).buffer),ue=n.dataIdMap.get(R.dataId).id;ps(B,V,a.shape.length,z,H,U,q,J,l.length,ue),E=oe({inputs:{x:R},backend:n,attrs:{shape:f}}),n.disposeData(R.dataId)}return E}const tf={kernelName:Pa,backendName:"wasm",setupFunc:Zm,kernelFunc:ef};/**
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
 */function nf(r){const{backend:n,inputs:s,attrs:o}=r,{data:a,dataSplits:t}=s,{separator:i,nGramWidths:d,leftPad:c,rightPad:u,padWidth:e,preserveShortSequences:m}=o,b=n.readSync(a.dataId),l=n.readSync(t.dataId),[f,g]=gi(b,l,i,d,c,u,e,m),w=n.makeOutput([f.length],"string"),k=n.dataIdMap.get(w.dataId);k.stringBytes=f;const y=n.makeOutput(t.shape,"int32");return n.typedArrayFromHeap(y).set(g),[w,y]}const af={kernelName:Yo,backendName:"wasm",kernelFunc:nf};/**
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
 */function rf(r){const{backend:n,inputs:s,attrs:o}=r,{input:a,delimiter:t}=s,{skipEmpty:i}=o,d=n.readSync(a.dataId),c=n.readSync(t.dataId),[u,e,m]=bi(d,c[0],i),b=e.length,l=n.makeOutput([b,2],"int32");n.typedArrayFromHeap(l).set(u);const g=n.makeOutput([b],"string"),w=n.dataIdMap.get(g.dataId);w.stringBytes=e;const k=n.makeOutput([2],"int32");return n.typedArrayFromHeap(k).set(m),[l,g,k]}const sf={kernelName:Zo,backendName:"wasm",kernelFunc:rf};/**
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
 */function uf(r){const{backend:n,inputs:s,attrs:o}=r,{input:a}=s,{numBuckets:t}=o,i=n.readSync(a.dataId),d=_i(i,t),c=n.makeOutput(a.shape,"int32");return n.typedArrayFromHeap(c).set(d),c}const of={kernelName:ei,backendName:"wasm",kernelFunc:uf};/**
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
 */const df=ee(ti);/**
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
 */let ls;function cf(r){ls=r.wasm.cwrap(Oa,null,["number","number","number","number"])}function pf(r){const{backend:n,inputs:s,attrs:o}=r,{axis:a,keepDims:t}=o,{x:i}=s,d=n.dataIdMap.get(i.dataId).id;let c=d,u=i;const{transposed:e,axes:m,originalAxes:b,inputWasTransposed:l}=xe(i,a,n);let f=m;if(l){const _=n.dataIdMap.get(e.dataId).id;_!==d&&(u=e,c=_,f=je(f.length,u.shape.length))}Se("sum",f,u.shape.length);const[g,w]=Be(u.shape,f),k=F(w),y=n.makeOutput(g,u.dtype);if(F(u.shape)!==0){const _=n.dataIdMap.get(y.dataId).id;ls(c,k,$[y.dtype],_)}if(l&&n.disposeData(e.dataId),t){const _=Te(y.shape,b);y.shape=_}return y}const lf={kernelName:Oa,backendName:"wasm",setupFunc:cf,kernelFunc:pf};/**
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
 */const mf=L(ni);/**
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
 */const ff=L(ai);/**
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
 */let ms;function hf(r){ms=r.wasm.cwrap(Wa,null,["number","number","number","number","number","number","array","number","number","number"])}function gf(r){const{backend:n,inputs:s,attrs:o}=r,{tensor:a,indices:t,updates:i}=s,d=n.makeOutput(a.shape,a.dtype);if(F(a.shape)===0)return d;const{sliceRank:c,numUpdates:u,sliceSize:e,strides:m,outputSize:b}=tn(i,t,a.shape),f=n.dataIdMap.get(t.dataId).id,w=n.dataIdMap.get(i.dataId).id,y=n.dataIdMap.get(a.dataId).id,_=new Uint8Array(new Int32Array(m).buffer),v=n.dataIdMap.get(d.dataId).id;return ms(f,w,$[i.dtype],c,u,e,_,b,v,y),d}const bf={kernelName:Wa,backendName:"wasm",setupFunc:hf,kernelFunc:gf};/**
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
 */let fs;function _f(r){fs=r.wasm.cwrap(Ba,null,["number","array","number","array","number","number"])}function yf(r){const{inputs:n,backend:s,attrs:o}=r,{x:a}=n,t=s.dataIdMap.get(a.dataId).id,{reps:i}=o,d=new Array(a.shape.length);for(let b=0;b<d.length;b++)d[b]=a.shape[b]*i[b];const c=new Uint8Array(new Int32Array(a.shape).buffer),u=new Uint8Array(new Int32Array(d).buffer),e=s.makeOutput(d,a.dtype),m=s.dataIdMap.get(e.dataId).id;return fs(t,c,a.shape.length,u,d.length,$[e.dtype],m),e}const If={kernelName:Ba,backendName:"wasm",setupFunc:_f,kernelFunc:yf};/**
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
 */let hs;function wf(r){hs=r.wasm.cwrap(Ta,null,["number","array","number","number","number","bool","number","number"])}const kf=({inputs:r,backend:n,attrs:s})=>{const{x:o}=r,{k:a,sorted:t}=s,i=n.dataIdMap.get(o.dataId).id,d=new Uint8Array(new Int32Array(o.shape).buffer),c=o.shape.slice();c[c.length-1]=a;const u=n.makeOutput(c,o.dtype),e=n.dataIdMap.get(u.dataId).id,m=n.makeOutput(c,"int32"),b=n.dataIdMap.get(m.dataId).id;return hs(i,d,o.shape.length,$[o.dtype],a,t,e,b),[u,m]},Sf={kernelName:Ta,backendName:"wasm",setupFunc:wf,kernelFunc:kf};/**
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
 */let gs;function Mf(r){gs=r.wasm.cwrap(Ha,null,["number","number","bool","number","number","number","number","number","number","array","number","array","number","number","number","number","number"])}function vf(r){const{backend:n,inputs:s,attrs:o}=r,{image:a,transforms:t}=s,{interpolation:i,fillMode:d,fillValue:c,outputShape:u}=o,[e,m,b,l]=a.shape,[f,g]=u??[m,b],w=[e,f,g,l],k=new Uint8Array(new Int32Array(fe(a.shape)).buffer),y=new Uint8Array(new Int32Array(fe(w)).buffer),_=n.makeOutput(w,a.dtype),v=n.dataIdMap.get(_.dataId).id,R=n.dataIdMap.get(a.dataId).id,V=n.dataIdMap.get(t.dataId).id,z=i==="nearest"?1:2;let H;switch(d){case"constant":H=1;break;case"reflect":H=2;break;case"wrap":H=3;break;case"nearest":H=4;break;default:H=1;break}return gs(R,V,t.shape[0]>1,e,f,g,l,b,m,k,a.shape.length-1,y,w.length-1,z,H,c,v),_}const Af={kernelName:Ha,backendName:"wasm",setupFunc:Mf,kernelFunc:vf};/**
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
 */function xf(r){const{inputs:n,attrs:s,backend:o}=r,{axis:a}=s,{x:t}=n,{outputValues:i,outputShape:d,indices:c}=yi(o.readSync(t.dataId),a,t.shape,t.dtype);return[o.makeOutput(d,t.dtype,void 0,i),o.makeOutput([c.length],"int32",void 0,c)]}const Df={kernelName:ri,backendName:"wasm",kernelFunc:xf};/**
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
 */function Nf(r){const{inputs:n,backend:s,attrs:o}=r,{value:a}=n;let{axis:t}=o;t<0&&(t+=a.shape.length);const i=a.shape[t],d=a.shape.length,c=new Array(d-1);let u=0;for(let l=0;l<d;l++)l!==t&&(c[u++]=a.shape[l]);const e=new Array(i),m=new Array(d).fill(0),b=a.shape.slice();b[t]=1;for(let l=0;l<e.length;l++)m[t]=l,e[l]=We({inputs:{x:a},attrs:{begin:m,size:b},backend:s});return e.map(({dataId:l,dtype:f})=>({dataId:l,dtype:f,shape:c}))}const Cf={kernelName:si,backendName:"wasm",kernelFunc:Nf};/**
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
 */function Ff(r){const{inputs:{x:n},backend:s}=r,o=s.makeOutput(n.shape,n.dtype);return s.typedArrayFromHeap(o).fill(0),o}const Rf={kernelName:ui,backendName:"wasm",kernelFunc:Ff};/**
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
 */const Ef=[Si,Mi,vi,Ai,xi,Ci,Ti,Vi,$i,zi,Gi,Ui,ji,qi,Xi,Ji,ud,ed,ad,cd,gd,yd,Id,kd,Sd,Md,xd,Dd,Fd,Pd,Bd,Ld,zd,Gd,Ud,Xd,Jd,ec,ac,uc,dc,lc,hc,_c,wc,kc,vc,xc,Dc,Nc,Cc,Fc,Rc,Oc,Wc,Bc,Lc,zc,jc,Kc,Yc,ep,np,Fi,ap,rp,sp,ip,cp,lp,hp,bp,gp,yp,Ip,kp,Mp,xp,Cp,Ep,Pp,Bp,Lp,zp,jp,Kp,Yp,tl,nl,sl,cl,pl,ll,ml,gl,yl,kl,Ml,xl,Nl,Fl,Ur,Pl,Bl,Ll,$l,zl,Gl,Ul,jl,od,Kl,Yl,tm,rm,om,cm,pm,lm,hm,_m,wm,km,vm,Am,xm,Dm,fd,ol,Nm,Fm,Pm,Bm,Hm,Vm,Gm,jm,qm,Xm,Km,Ym,tf,af,sf,of,df,lf,mf,ff,bf,If,Sf,Af,Oi,Df,Cf,Rf];for(const r of Ef)oi(r);/**
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
 */const Qt=jt();Qt.registerFlag("WASM_HAS_SIMD_SUPPORT",async()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,9,1,7,0,65,0,253,15,26,11]))}catch{return!1}});Qt.registerFlag("WASM_HAS_MULTITHREAD_SUPPORT",async()=>{if(Qt.get("IS_NODE"))return!1;try{return new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}});var bs={exports:{}};(function(r,n){var s=(()=>{var o=typeof document<"u"&&document.currentScript?document.currentScript.src:void 0;return typeof __filename<"u"&&(o=o||__filename),function(a){a=a||{};function t(){return G.buffer!=Y&&be(G.buffer),Me}function i(){return G.buffer!=Y&&be(G.buffer),ot}function d(){return G.buffer!=Y&&be(G.buffer),it}function c(){return G.buffer!=Y&&be(G.buffer),Ne}function u(){return G.buffer!=Y&&be(G.buffer),dt}var e=typeof a<"u"?a:{},m,b;e.ready=new Promise(function(p,h){m=p,b=h});var l;typeof process<"u"&&process.listeners&&(l={uncaughtException:process.listeners("uncaughtException"),unhandledRejection:process.listeners("unhandledRejection")});var f=Object.assign({},e),g=(p,h)=>{throw h},w=typeof window=="object",k=typeof importScripts=="function",y=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string",_=e.ENVIRONMENT_IS_PTHREAD||!1,v="";function E(p){return e.locateFile?e.locateFile(p,v):v+p}var R,B,V;function z(p){if(p instanceof Ie)return;X("exiting due to exception: "+p)}if(y){var H=Oe,U=Oe;k?v=U.dirname(v)+"/":v=__dirname+"/",R=(h,M)=>(h=$e(h)?new URL(h):U.normalize(h),H.readFileSync(h,M?void 0:"utf8")),V=h=>{var M=R(h,!0);return M.buffer||(M=new Uint8Array(M)),M},B=(h,M,C)=>{h=$e(h)?new URL(h):U.normalize(h),H.readFile(h,function(P,W){P?C(P):M(W.buffer)})},process.argv.length>1&&process.argv[1].replace(/\\/g,"/"),process.argv.slice(2),process.on("uncaughtException",function(h){if(!(h instanceof Ie))throw h}),process.on("unhandledRejection",function(h){throw h}),g=(h,M)=>{if(Ve())throw process.exitCode=h,M;z(M),process.exit(h)},e.inspect=function(){return"[Emscripten Module object]"};let p;try{p=Oe}catch(h){throw console.error('The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?'),h}In.Worker=p.Worker}else(w||k)&&(k?v=self.location.href:typeof document<"u"&&document.currentScript&&(v=document.currentScript.src),typeof o<"u"&&o&&(v=o),v.indexOf("blob:")!==0?v=v.substr(0,v.replace(/[?#].*/,"").lastIndexOf("/")+1):v="",y||(R=p=>{var h=new XMLHttpRequest;return h.open("GET",p,!1),h.send(null),h.responseText},k&&(V=p=>{var h=new XMLHttpRequest;return h.open("GET",p,!1),h.responseType="arraybuffer",h.send(null),new Uint8Array(h.response)}),B=(p,h,M)=>{var C=new XMLHttpRequest;C.open("GET",p,!0),C.responseType="arraybuffer",C.onload=()=>{if(C.status==200||C.status==0&&C.response){h(C.response);return}M()},C.onerror=M,C.send(null)}));y&&typeof performance>"u"&&(In.performance=Oe.performance);var q=console.log.bind(console),J=console.warn.bind(console);y&&(q=p=>H.writeSync(1,p+`
`),J=p=>H.writeSync(2,p+`
`));var ue=e.print||q,X=e.printErr||J;Object.assign(e,f),f=null,e.arguments&&e.arguments,e.thisProgram&&e.thisProgram,e.quit&&(g=e.quit);var te;e.wasmBinary&&(te=e.wasmBinary);var pe=e.noExitRuntime||!0;typeof WebAssembly!="object"&&Re("no native wasm support detected");var G,he,ie=!1,de;function _e(p,h){p||Re(h)}var ne=typeof TextDecoder<"u"?new TextDecoder("utf8"):void 0;function He(p,h,M){h>>>=0;for(var C=h+M,P=h;p[P]&&!(P>=C);)++P;if(P-h>16&&p.buffer&&ne)return ne.decode(p.buffer instanceof SharedArrayBuffer?p.slice(h,P):p.subarray(h,P));for(var W="";h<P;){var x=p[h++];if(!(x&128)){W+=String.fromCharCode(x);continue}var D=p[h++]&63;if((x&224)==192){W+=String.fromCharCode((x&31)<<6|D);continue}var Q=p[h++]&63;if((x&240)==224?x=(x&15)<<12|D<<6|Q:x=(x&7)<<18|D<<12|Q<<6|p[h++]&63,x<65536)W+=String.fromCharCode(x);else{var me=x-65536;W+=String.fromCharCode(55296|me>>10,56320|me&1023)}}return W}function Le(p,h){return p>>>=0,p?He(i(),p,h):""}function qe(p,h,M,C){if(M>>>=0,!(C>0))return 0;for(var P=M,W=M+C-1,x=0;x<p.length;++x){var D=p.charCodeAt(x);if(D>=55296&&D<=57343){var Q=p.charCodeAt(++x);D=65536+((D&1023)<<10)|Q&1023}if(D<=127){if(M>=W)break;h[M++>>>0]=D}else if(D<=2047){if(M+1>=W)break;h[M++>>>0]=192|D>>6,h[M++>>>0]=128|D&63}else if(D<=65535){if(M+2>=W)break;h[M++>>>0]=224|D>>12,h[M++>>>0]=128|D>>6&63,h[M++>>>0]=128|D&63}else{if(M+3>=W)break;h[M++>>>0]=240|D>>18,h[M++>>>0]=128|D>>12&63,h[M++>>>0]=128|D>>6&63,h[M++>>>0]=128|D&63}}return h[M>>>0]=0,M-P}function Xe(p,h,M){return qe(p,i(),h,M)}var Y,Me,ot,it,Ne,dt;_&&(Y=e.buffer);function be(p){Y=p,e.HEAP8=Me=new Int8Array(p),e.HEAP16=new Int16Array(p),e.HEAP32=it=new Int32Array(p),e.HEAPU8=ot=new Uint8Array(p),e.HEAPU16=new Uint16Array(p),e.HEAPU32=Ne=new Uint32Array(p),e.HEAPF32=new Float32Array(p),e.HEAPF64=dt=new Float64Array(p)}var Ce=e.INITIAL_MEMORY||16777216;if(_)G=e.wasmMemory,Y=e.buffer;else if(e.wasmMemory)G=e.wasmMemory;else if(G=new WebAssembly.Memory({initial:Ce/65536,maximum:65536,shared:!0}),!(G.buffer instanceof SharedArrayBuffer))throw X("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"),y&&X("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and/or recent version)"),Error("bad memory");G&&(Y=G.buffer),Ce=Y.byteLength,be(Y);var ae,Ke=[],ct=[],pt=[];function Ve(){return pe}function Qe(){if(e.preRun)for(typeof e.preRun=="function"&&(e.preRun=[e.preRun]);e.preRun.length;)Et(e.preRun.shift());j(Ke)}function lt(){_||j(ct)}function mt(){if(!_){if(e.postRun)for(typeof e.postRun=="function"&&(e.postRun=[e.postRun]);e.postRun.length;)Ot(e.postRun.shift());j(pt)}}function Et(p){Ke.unshift(p)}function Pt(p){ct.unshift(p)}function Ot(p){pt.unshift(p)}var ye=0,Fe=null;function Wt(p){ye++,e.monitorRunDependencies&&e.monitorRunDependencies(ye)}function Bt(p){if(ye--,e.monitorRunDependencies&&e.monitorRunDependencies(ye),ye==0&&Fe){var h=Fe;Fe=null,h()}}function Re(p){e.onAbort&&e.onAbort(p),p="Aborted("+p+")",X(p),ie=!0,de=1,p+=". Build with -sASSERTIONS for more info.";var h=new WebAssembly.RuntimeError(p);throw b(h),h}var Tt="data:application/octet-stream;base64,";function Je(p){return p.startsWith(Tt)}function $e(p){return p.startsWith("file://")}var se;se="tfjs-backend-wasm-threaded-simd.wasm",Je(se)||(se=E(se));function ft(p){try{if(p==se&&te)return new Uint8Array(te);if(V)return V(p);throw"both async and sync fetching of the wasm failed"}catch(h){Re(h)}}function ht(){if(!te&&(w||k)){if(typeof fetch=="function"&&!$e(se))return fetch(se,{credentials:"same-origin"}).then(function(p){if(!p.ok)throw"failed to load wasm binary file at '"+se+"'";return p.arrayBuffer()}).catch(function(){return ft(se)});if(B)return new Promise(function(p,h){B(se,function(M){p(new Uint8Array(M))},h)})}return Promise.resolve().then(function(){return ft(se)})}function gt(){var p={env:cn,wasi_snapshot_preview1:cn};function h(x,D){var Q=x.exports;if(e.asm=Q,we(e.asm._emscripten_tls_init),ae=e.asm.__indirect_function_table,Pt(e.asm.__wasm_call_ctors),he=D,!_){var me=A.unusedWorkers.length;A.unusedWorkers.forEach(function(ke){A.loadWasmModuleToWorker(ke,function(){--me||Bt()})})}}_||Wt();function M(x){h(x.instance,x.module)}function C(x){return ht().then(function(D){return WebAssembly.instantiate(D,p)}).then(function(D){return D}).then(x,function(D){X("failed to asynchronously prepare wasm: "+D),Re(D)})}function P(){return!te&&typeof WebAssembly.instantiateStreaming=="function"&&!Je(se)&&!$e(se)&&!y&&typeof fetch=="function"?fetch(se,{credentials:"same-origin"}).then(function(x){var D=WebAssembly.instantiateStreaming(x,p);return D.then(M,function(Q){return X("wasm streaming compile failed: "+Q),X("falling back to ArrayBuffer instantiation"),C(M)})}):C(M)}if(e.instantiateWasm)try{var W=e.instantiateWasm(p,h);return W}catch(x){X("Module.instantiateWasm callback failed with error: "+x),b(x)}return P().catch(b),{}}var bt={};function Ie(p){this.name="ExitStatus",this.message="Program terminated with exit("+p+")",this.status=p}function ze(p){var h=A.pthreads[p];delete A.pthreads[p],h.terminate(),$t(p),A.runningWorkers.splice(A.runningWorkers.indexOf(h),1),h.pthread_ptr=0}function _t(p){var h=A.pthreads[p];h.postMessage({cmd:"cancel"})}function Ee(p){var h=A.pthreads[p];_e(h),A.returnWorkerToPool(h)}function Pe(p){var h=A.getNewWorker();if(!h)return 6;A.runningWorkers.push(h),A.pthreads[p.pthread_ptr]=h,h.pthread_ptr=p.pthread_ptr;var M={cmd:"run",start_routine:p.startRoutine,arg:p.arg,pthread_ptr:p.pthread_ptr};return h.runPthread=()=>{y&&h.ref(),h.postMessage(M,p.transferList),delete h.runPthread},h.loaded&&h.runPthread(),0}function yt(p){if(_)return Ge(1,1,p);de=p,Ve()||(A.terminateAllThreads(),e.onExit&&e.onExit(p),ie=!0),g(p,new Ie(p))}function I(p,h){if(de=p,!h&&_)throw T(p),"unwind";yt(p)}var S=I;function N(p){if(p instanceof Ie||p=="unwind")return de;g(1,p)}var A={unusedWorkers:[],runningWorkers:[],tlsInitFunctions:[],pthreads:{},init:function(){_?A.initWorker():A.initMainThread()},initMainThread:function(){for(var p=8;p--;)A.allocateUnusedWorker()},initWorker:function(){pe=!1},setExitStatus:function(p){de=p},terminateAllThreads:function(){for(var p of Object.values(A.pthreads))A.returnWorkerToPool(p);for(var p of A.unusedWorkers)p.terminate();A.unusedWorkers=[]},returnWorkerToPool:function(p){var h=p.pthread_ptr;delete A.pthreads[h],A.unusedWorkers.push(p),A.runningWorkers.splice(A.runningWorkers.indexOf(p),1),p.pthread_ptr=0,y&&p.unref(),$t(h)},receiveObjectTransfer:function(p){},threadInitTLS:function(){A.tlsInitFunctions.forEach(p=>p())},loadWasmModuleToWorker:function(p,h){p.onmessage=W=>{var x=W.data,D=x.cmd;if(p.pthread_ptr&&(A.currentProxiedOperationCallerThread=p.pthread_ptr),x.targetThread&&x.targetThread!=St()){var Q=A.pthreads[x.targetThread];Q?Q.postMessage(x,x.transferList):X('Internal error! Worker sent a message "'+D+'" to target pthread '+x.targetThread+", but that thread no longer exists!"),A.currentProxiedOperationCallerThread=void 0;return}D==="processProxyingQueue"?Ht(x.queue):D==="spawnThread"?Pe(x):D==="cleanupThread"?Ee(x.thread):D==="killThread"?ze(x.thread):D==="cancelThread"?_t(x.thread):D==="loaded"?(p.loaded=!0,y&&p.unref(),h&&h(p),p.runPthread&&p.runPthread()):D==="print"?ue("Thread "+x.threadId+": "+x.text):D==="printErr"?X("Thread "+x.threadId+": "+x.text):D==="alert"?alert("Thread "+x.threadId+": "+x.text):x.target==="setimmediate"?p.postMessage(x):D==="callHandler"?e[x.handler](...x.args):D&&X("worker sent an unknown command "+D),A.currentProxiedOperationCallerThread=void 0},p.onerror=W=>{var x="worker sent an error!";throw X(x+" "+W.filename+":"+W.lineno+": "+W.message),W},y&&(p.on("message",function(W){p.onmessage({data:W})}),p.on("error",function(W){p.onerror(W)}),p.on("detachedExit",function(){}));var M=[],C=["onExit","onAbort","print","printErr"];for(var P of C)e.hasOwnProperty(P)&&M.push(P);p.postMessage({cmd:"load",handlers:M,urlOrBlob:e.mainScriptUrlOrBlob||o,wasmMemory:G,wasmModule:he})},allocateUnusedWorker:function(){var p,h=E("tfjs-backend-wasm-threaded-simd.worker.js");p=new Worker(h),A.unusedWorkers.push(p)},getNewWorker:function(){return A.unusedWorkers.length==0&&(A.allocateUnusedWorker(),A.loadWasmModuleToWorker(A.unusedWorkers[0])),A.unusedWorkers.pop()}};e.PThread=A;function j(p){for(;p.length>0;)p.shift()(e)}function K(){var p=St(),h=d()[p+52>>>2],M=d()[p+56>>>2],C=h-M;hn(h,C),Mt(h)}e.establishStackSpace=K;function T(p){if(_)return Ge(2,0,p);try{S(p)}catch(h){N(h)}}var O=[];function Z(p){var h=O[p];return h||(p>=O.length&&(O.length=p+1),O[p]=h=ae.get(p)),h}function le(p,h){var M=Z(p)(h);Ve()?A.setExitStatus(M):fn(M)}e.invokeEntryPoint=le;function we(p){A.tlsInitFunctions.push(p)}function It(p){pn(p,!k,1,!w),A.threadInitTLS()}function Ye(p){_?postMessage({cmd:"cleanupThread",thread:p}):Ee(p)}function wt(p,h,M,C){return _?Ge(3,1,p,h,M,C):re(p,h,M,C)}function re(p,h,M,C){if(typeof SharedArrayBuffer>"u")return X("Current environment does not support SharedArrayBuffer, pthreads are not available!"),6;var P=[],W=0;if(_&&(P.length===0||W))return wt(p,h,M,C);var x={startRoutine:M,pthread_ptr:p,arg:C,transferList:P};return _?(x.cmd="spawnThread",postMessage(x,P),0):Pe(x)}function ve(){return 65536}var kt=!0;function Ss(){return kt}function Ht(p){Atomics.store(d(),p>>2,1),St()&&mn(p),Atomics.compareExchange(d(),p>>2,1,0)}e.executeNotifiedProxyingQueue=Ht;function Ms(p,h,M,C){if(p==h)setTimeout(()=>Ht(C));else if(_)postMessage({targetThread:p,cmd:"processProxyingQueue",queue:C});else{var P=A.pthreads[p];if(!P)return;P.postMessage({cmd:"processProxyingQueue",queue:C})}return 1}function vs(p,h,M){return-1}function As(){Re("")}function Ze(p){Ze.shown||(Ze.shown={}),Ze.shown[p]||(Ze.shown[p]=1,y&&(p="warning: "+p),X(p))}function xs(){y||k||Ze("Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread")}function Ds(){return Date.now()}function rn(){return 4294901760}function Ns(){return rn()}var Lt;y?Lt=()=>{var p=process.hrtime();return p[0]*1e3+p[1]/1e6}:Lt=()=>performance.timeOrigin+performance.now();function Cs(p,h,M){i().copyWithin(p>>>0,h>>>0,h+M>>>0)}function Fs(){return y?Oe.cpus().length:navigator.hardwareConcurrency}function Rs(p){var h=zt(),M=p();return Mt(h),M}function Ge(p,h){var M=arguments.length-2,C=arguments;return Rs(()=>{for(var P=M,W=vt(P*8),x=W>>3,D=0;D<M;D++){var Q=C[2+D];u()[x+D>>>0]=Q}return ln(p,P,W,h)})}var Vt=[];function Es(p,h,M){Vt.length=h;for(var C=M>>3,P=0;P<h;P++)Vt[P]=u()[C+P>>>0];var W=p<0,x=W?bt[-p-1]:$s[p];return x.apply(null,Vt)}function Ps(p){try{return G.grow(p-Y.byteLength+65535>>>16),be(G.buffer),1}catch{}}function Os(p){var h=i().length;if(p=p>>>0,p<=h)return!1;var M=rn();if(p>M)return!1;let C=(Q,me)=>Q+(me-Q%me)%me;for(var P=1;P<=4;P*=2){var W=h*(1+.2/P);W=Math.min(W,p+100663296);var x=Math.min(M,C(Math.max(p,W),65536)),D=Ps(x);if(D)return!0}return!1}function Ws(){throw"unwind"}function sn(p){return _?Ge(4,1,p):52}function un(p,h,M,C,P){return _?Ge(5,1,p,h,M,C,P):70}var Bs=[null,[],[]];function Ts(p,h){var M=Bs[p];h===0||h===10?((p===1?ue:X)(He(M,0)),M.length=0):M.push(h)}function on(p,h,M,C){if(_)return Ge(6,1,p,h,M,C);for(var P=0,W=0;W<M;W++){var x=c()[h>>>2],D=c()[h+4>>>2];h+=8;for(var Q=0;Q<D;Q++)Ts(p,i()[x+Q>>>0]);P+=D}return c()[C>>>2]=P,0}function dn(p){var h=e["_"+p];return h}function Hs(p,h){t().set(p,h>>>0)}function Ls(p,h,M,C,P){var W={string:ce=>{var Ue=0;if(ce!=null&&ce!==0){var _n=(ce.length<<2)+1;Ue=vt(_n),Xe(ce,Ue,_n)}return Ue},array:ce=>{var Ue=vt(ce.length);return Hs(ce,Ue),Ue}};function x(ce){return h==="string"?Le(ce):h==="boolean"?!!ce:ce}var D=dn(p),Q=[],me=0;if(C)for(var ke=0;ke<C.length;ke++){var bn=W[M[ke]];bn?(me===0&&(me=zt()),Q[ke]=bn(C[ke])):Q[ke]=C[ke]}var Gt=D.apply(null,Q);function Gs(ce){return me!==0&&Mt(me),x(ce)}return Gt=Gs(Gt),Gt}function Vs(p,h,M,C){M=M||[];var P=M.every(x=>x==="number"||x==="boolean"),W=h!=="string";return W&&P&&!C?dn(p):function(){return Ls(p,h,M,arguments)}}A.init();var $s=[null,yt,T,wt,sn,un,on],cn={__emscripten_init_main_thread_js:It,__emscripten_thread_cleanup:Ye,__pthread_create_js:re,_emscripten_default_pthread_stack_size:ve,_emscripten_get_now_is_monotonic:Ss,_emscripten_notify_task_queue:Ms,_emscripten_set_offscreencanvas_size:vs,abort:As,emscripten_check_blocking_allowed:xs,emscripten_date_now:Ds,emscripten_get_heap_max:Ns,emscripten_get_now:Lt,emscripten_memcpy_big:Cs,emscripten_num_logical_cores:Fs,emscripten_receive_on_main_thread_js:Es,emscripten_resize_heap:Os,emscripten_unwind_to_js_event_loop:Ws,exit:S,fd_close:sn,fd_seek:un,fd_write:on,memory:G||e.wasmMemory};gt(),e.___wasm_call_ctors=function(){return(e.___wasm_call_ctors=e.asm.__wasm_call_ctors).apply(null,arguments)},e._init=function(){return(e._init=e.asm.init).apply(null,arguments)},e._init_with_threads_count=function(){return(e._init_with_threads_count=e.asm.init_with_threads_count).apply(null,arguments)},e._get_threads_count=function(){return(e._get_threads_count=e.asm.get_threads_count).apply(null,arguments)},e._register_tensor=function(){return(e._register_tensor=e.asm.register_tensor).apply(null,arguments)},e._dispose_data=function(){return(e._dispose_data=e.asm.dispose_data).apply(null,arguments)},e._dispose=function(){return(e._dispose=e.asm.dispose).apply(null,arguments)},e._Abs=function(){return(e._Abs=e.asm.Abs).apply(null,arguments)},e._Acos=function(){return(e._Acos=e.asm.Acos).apply(null,arguments)},e._Acosh=function(){return(e._Acosh=e.asm.Acosh).apply(null,arguments)},e._Add=function(){return(e._Add=e.asm.Add).apply(null,arguments)},e._AddN=function(){return(e._AddN=e.asm.AddN).apply(null,arguments)},e._All=function(){return(e._All=e.asm.All).apply(null,arguments)},e._Any=function(){return(e._Any=e.asm.Any).apply(null,arguments)},e._ArgMax=function(){return(e._ArgMax=e.asm.ArgMax).apply(null,arguments)},e._ArgMin=function(){return(e._ArgMin=e.asm.ArgMin).apply(null,arguments)},e._Asin=function(){return(e._Asin=e.asm.Asin).apply(null,arguments)},e._Asinh=function(){return(e._Asinh=e.asm.Asinh).apply(null,arguments)},e._Atan=function(){return(e._Atan=e.asm.Atan).apply(null,arguments)},e._Atan2=function(){return(e._Atan2=e.asm.Atan2).apply(null,arguments)},e._Atanh=function(){return(e._Atanh=e.asm.Atanh).apply(null,arguments)},e._AvgPool=function(){return(e._AvgPool=e.asm.AvgPool).apply(null,arguments)},e._AvgPool3D=function(){return(e._AvgPool3D=e.asm.AvgPool3D).apply(null,arguments)},e._AvgPool3DGrad=function(){return(e._AvgPool3DGrad=e.asm.AvgPool3DGrad).apply(null,arguments)},e._AvgPoolGrad=function(){return(e._AvgPoolGrad=e.asm.AvgPoolGrad).apply(null,arguments)},e._BatchMatMul=function(){return(e._BatchMatMul=e.asm.BatchMatMul).apply(null,arguments)},e._Bincount=function(){return(e._Bincount=e.asm.Bincount).apply(null,arguments)},e._BitwiseAnd=function(){return(e._BitwiseAnd=e.asm.BitwiseAnd).apply(null,arguments)},e._Ceil=function(){return(e._Ceil=e.asm.Ceil).apply(null,arguments)},e._ClipByValue=function(){return(e._ClipByValue=e.asm.ClipByValue).apply(null,arguments)},e._Conv2D=function(){return(e._Conv2D=e.asm.Conv2D).apply(null,arguments)},e._Conv2DBackpropInput=function(){return(e._Conv2DBackpropInput=e.asm.Conv2DBackpropInput).apply(null,arguments)},e._Conv3D=function(){return(e._Conv3D=e.asm.Conv3D).apply(null,arguments)},e._Conv3DBackpropFilterV2=function(){return(e._Conv3DBackpropFilterV2=e.asm.Conv3DBackpropFilterV2).apply(null,arguments)},e._Conv3DBackpropInputV2=function(){return(e._Conv3DBackpropInputV2=e.asm.Conv3DBackpropInputV2).apply(null,arguments)},e._Cos=function(){return(e._Cos=e.asm.Cos).apply(null,arguments)},e._Cosh=function(){return(e._Cosh=e.asm.Cosh).apply(null,arguments)},e._CropAndResize=function(){return(e._CropAndResize=e.asm.CropAndResize).apply(null,arguments)},e._Cumprod=function(){return(e._Cumprod=e.asm.Cumprod).apply(null,arguments)},e._Cumsum=function(){return(e._Cumsum=e.asm.Cumsum).apply(null,arguments)},e._DenseBincount=function(){return(e._DenseBincount=e.asm.DenseBincount).apply(null,arguments)},e._DepthToSpace=function(){return(e._DepthToSpace=e.asm.DepthToSpace).apply(null,arguments)},e._DepthwiseConv2dNative=function(){return(e._DepthwiseConv2dNative=e.asm.DepthwiseConv2dNative).apply(null,arguments)},e._Diag=function(){return(e._Diag=e.asm.Diag).apply(null,arguments)},e._Dilation2D=function(){return(e._Dilation2D=e.asm.Dilation2D).apply(null,arguments)},e._Dilation2DBackpropFilter=function(){return(e._Dilation2DBackpropFilter=e.asm.Dilation2DBackpropFilter).apply(null,arguments)},e._Dilation2DBackpropInput=function(){return(e._Dilation2DBackpropInput=e.asm.Dilation2DBackpropInput).apply(null,arguments)},e._Elu=function(){return(e._Elu=e.asm.Elu).apply(null,arguments)},e._EluGrad=function(){return(e._EluGrad=e.asm.EluGrad).apply(null,arguments)},e._Equal=function(){return(e._Equal=e.asm.Equal).apply(null,arguments)},e._Erf=function(){return(e._Erf=e.asm.Erf).apply(null,arguments)},e._Exp=function(){return(e._Exp=e.asm.Exp).apply(null,arguments)},e._Expm1=function(){return(e._Expm1=e.asm.Expm1).apply(null,arguments)},e._FlipLeftRight=function(){return(e._FlipLeftRight=e.asm.FlipLeftRight).apply(null,arguments)},e._Floor=function(){return(e._Floor=e.asm.Floor).apply(null,arguments)},e._FloorDiv=function(){return(e._FloorDiv=e.asm.FloorDiv).apply(null,arguments)},e._FusedBatchNorm=function(){return(e._FusedBatchNorm=e.asm.FusedBatchNorm).apply(null,arguments)},e._FusedConv2D=function(){return(e._FusedConv2D=e.asm.FusedConv2D).apply(null,arguments)},e._FusedDepthwiseConv2D=function(){return(e._FusedDepthwiseConv2D=e.asm.FusedDepthwiseConv2D).apply(null,arguments)},e._Gather=function(){return(e._Gather=e.asm.Gather).apply(null,arguments)},e._GatherNd=function(){return(e._GatherNd=e.asm.GatherNd).apply(null,arguments)},e._Greater=function(){return(e._Greater=e.asm.Greater).apply(null,arguments)},e._GreaterEqual=function(){return(e._GreaterEqual=e.asm.GreaterEqual).apply(null,arguments)},e._IsFinite=function(){return(e._IsFinite=e.asm.IsFinite).apply(null,arguments)},e._IsInf=function(){return(e._IsInf=e.asm.IsInf).apply(null,arguments)},e._IsNan=function(){return(e._IsNan=e.asm.IsNan).apply(null,arguments)},e._LRN=function(){return(e._LRN=e.asm.LRN).apply(null,arguments)},e._LRNGrad=function(){return(e._LRNGrad=e.asm.LRNGrad).apply(null,arguments)},e._LeakyRelu=function(){return(e._LeakyRelu=e.asm.LeakyRelu).apply(null,arguments)},e._Less=function(){return(e._Less=e.asm.Less).apply(null,arguments)},e._LessEqual=function(){return(e._LessEqual=e.asm.LessEqual).apply(null,arguments)},e._LinSpace=function(){return(e._LinSpace=e.asm.LinSpace).apply(null,arguments)},e._Log=function(){return(e._Log=e.asm.Log).apply(null,arguments)},e._Log1p=function(){return(e._Log1p=e.asm.Log1p).apply(null,arguments)},e._LogicalAnd=function(){return(e._LogicalAnd=e.asm.LogicalAnd).apply(null,arguments)},e._LogicalNot=function(){return(e._LogicalNot=e.asm.LogicalNot).apply(null,arguments)},e._LogicalOr=function(){return(e._LogicalOr=e.asm.LogicalOr).apply(null,arguments)},e._LogicalXor=function(){return(e._LogicalXor=e.asm.LogicalXor).apply(null,arguments)},e._Max=function(){return(e._Max=e.asm.Max).apply(null,arguments)},e._MaxPool=function(){return(e._MaxPool=e.asm.MaxPool).apply(null,arguments)},e._MaxPool3D=function(){return(e._MaxPool3D=e.asm.MaxPool3D).apply(null,arguments)},e._MaxPool3DGrad=function(){return(e._MaxPool3DGrad=e.asm.MaxPool3DGrad).apply(null,arguments)},e._MaxPoolGrad=function(){return(e._MaxPoolGrad=e.asm.MaxPoolGrad).apply(null,arguments)},e._MaxPoolWithArgmax=function(){return(e._MaxPoolWithArgmax=e.asm.MaxPoolWithArgmax).apply(null,arguments)},e._Maximum=function(){return(e._Maximum=e.asm.Maximum).apply(null,arguments)},e._Mean=function(){return(e._Mean=e.asm.Mean).apply(null,arguments)},e._Min=function(){return(e._Min=e.asm.Min).apply(null,arguments)},e._Minimum=function(){return(e._Minimum=e.asm.Minimum).apply(null,arguments)},e._MirrorPad=function(){return(e._MirrorPad=e.asm.MirrorPad).apply(null,arguments)},e._Mod=function(){return(e._Mod=e.asm.Mod).apply(null,arguments)},e._Multinomial=function(){return(e._Multinomial=e.asm.Multinomial).apply(null,arguments)},e._Multiply=function(){return(e._Multiply=e.asm.Multiply).apply(null,arguments)},e._Neg=function(){return(e._Neg=e.asm.Neg).apply(null,arguments)},e._NonMaxSuppressionV3=function(){return(e._NonMaxSuppressionV3=e.asm.NonMaxSuppressionV3).apply(null,arguments)},e._NonMaxSuppressionV4=function(){return(e._NonMaxSuppressionV4=e.asm.NonMaxSuppressionV4).apply(null,arguments)},e._NonMaxSuppressionV5=function(){return(e._NonMaxSuppressionV5=e.asm.NonMaxSuppressionV5).apply(null,arguments)},e._NotEqual=function(){return(e._NotEqual=e.asm.NotEqual).apply(null,arguments)},e._OneHot=function(){return(e._OneHot=e.asm.OneHot).apply(null,arguments)},e._PadV2=function(){return(e._PadV2=e.asm.PadV2).apply(null,arguments)},e._Pow=function(){return(e._Pow=e.asm.Pow).apply(null,arguments)},e._Prelu=function(){return(e._Prelu=e.asm.Prelu).apply(null,arguments)},e._Prod=function(){return(e._Prod=e.asm.Prod).apply(null,arguments)},e._RealDiv=function(){return(e._RealDiv=e.asm.RealDiv).apply(null,arguments)},e._Reciprocal=function(){return(e._Reciprocal=e.asm.Reciprocal).apply(null,arguments)},e._Relu=function(){return(e._Relu=e.asm.Relu).apply(null,arguments)},e._Relu6=function(){return(e._Relu6=e.asm.Relu6).apply(null,arguments)},e._ResizeBilinear=function(){return(e._ResizeBilinear=e.asm.ResizeBilinear).apply(null,arguments)},e._ResizeBilinearGrad=function(){return(e._ResizeBilinearGrad=e.asm.ResizeBilinearGrad).apply(null,arguments)},e._ResizeNearestNeighbor=function(){return(e._ResizeNearestNeighbor=e.asm.ResizeNearestNeighbor).apply(null,arguments)},e._ResizeNearestNeighborGrad=function(){return(e._ResizeNearestNeighborGrad=e.asm.ResizeNearestNeighborGrad).apply(null,arguments)},e._Reverse=function(){return(e._Reverse=e.asm.Reverse).apply(null,arguments)},e._RotateWithOffset=function(){return(e._RotateWithOffset=e.asm.RotateWithOffset).apply(null,arguments)},e._Round=function(){return(e._Round=e.asm.Round).apply(null,arguments)},e._Rsqrt=function(){return(e._Rsqrt=e.asm.Rsqrt).apply(null,arguments)},e._ScatterNd=function(){return(e._ScatterNd=e.asm.ScatterNd).apply(null,arguments)},e._SearchSorted=function(){return(e._SearchSorted=e.asm.SearchSorted).apply(null,arguments)},e._SelectV2=function(){return(e._SelectV2=e.asm.SelectV2).apply(null,arguments)},e._Selu=function(){return(e._Selu=e.asm.Selu).apply(null,arguments)},e._Sigmoid=function(){return(e._Sigmoid=e.asm.Sigmoid).apply(null,arguments)},e._Sign=function(){return(e._Sign=e.asm.Sign).apply(null,arguments)},e._Sin=function(){return(e._Sin=e.asm.Sin).apply(null,arguments)},e._Sinh=function(){return(e._Sinh=e.asm.Sinh).apply(null,arguments)},e._Softmax=function(){return(e._Softmax=e.asm.Softmax).apply(null,arguments)},e._Softplus=function(){return(e._Softplus=e.asm.Softplus).apply(null,arguments)},e._SparseFillEmptyRows=function(){return(e._SparseFillEmptyRows=e.asm.SparseFillEmptyRows).apply(null,arguments)},e._SparseReshape=function(){return(e._SparseReshape=e.asm.SparseReshape).apply(null,arguments)},e._SparseSegmentReduction=function(){return(e._SparseSegmentReduction=e.asm.SparseSegmentReduction).apply(null,arguments)},e._SparseToDense=function(){return(e._SparseToDense=e.asm.SparseToDense).apply(null,arguments)},e._Sqrt=function(){return(e._Sqrt=e.asm.Sqrt).apply(null,arguments)},e._Square=function(){return(e._Square=e.asm.Square).apply(null,arguments)},e._SquaredDifference=function(){return(e._SquaredDifference=e.asm.SquaredDifference).apply(null,arguments)},e._Step=function(){return(e._Step=e.asm.Step).apply(null,arguments)},e._StridedSlice=function(){return(e._StridedSlice=e.asm.StridedSlice).apply(null,arguments)},e._Sub=function(){return(e._Sub=e.asm.Sub).apply(null,arguments)},e._Sum=function(){return(e._Sum=e.asm.Sum).apply(null,arguments)},e._Tan=function(){return(e._Tan=e.asm.Tan).apply(null,arguments)},e._Tanh=function(){return(e._Tanh=e.asm.Tanh).apply(null,arguments)},e._TensorScatterUpdate=function(){return(e._TensorScatterUpdate=e.asm.TensorScatterUpdate).apply(null,arguments)},e._Tile=function(){return(e._Tile=e.asm.Tile).apply(null,arguments)},e._TopK=function(){return(e._TopK=e.asm.TopK).apply(null,arguments)},e._Transform=function(){return(e._Transform=e.asm.Transform).apply(null,arguments)},e._Transpose=function(){return(e._Transpose=e.asm.Transpose).apply(null,arguments)},e.__FusedMatMul=function(){return(e.__FusedMatMul=e.asm._FusedMatMul).apply(null,arguments)},e._malloc=function(){return(e._malloc=e.asm.malloc).apply(null,arguments)},e._free=function(){return(e._free=e.asm.free).apply(null,arguments)},e.__emscripten_tls_init=function(){return(e.__emscripten_tls_init=e.asm._emscripten_tls_init).apply(null,arguments)};var St=e._pthread_self=function(){return(St=e._pthread_self=e.asm.pthread_self).apply(null,arguments)};e.___errno_location=function(){return(e.___errno_location=e.asm.__errno_location).apply(null,arguments)};var pn=e.__emscripten_thread_init=function(){return(pn=e.__emscripten_thread_init=e.asm._emscripten_thread_init).apply(null,arguments)};e.__emscripten_thread_crashed=function(){return(e.__emscripten_thread_crashed=e.asm._emscripten_thread_crashed).apply(null,arguments)},e._emscripten_main_thread_process_queued_calls=function(){return(e._emscripten_main_thread_process_queued_calls=e.asm.emscripten_main_thread_process_queued_calls).apply(null,arguments)},e._emscripten_main_browser_thread_id=function(){return(e._emscripten_main_browser_thread_id=e.asm.emscripten_main_browser_thread_id).apply(null,arguments)};var ln=e._emscripten_run_in_main_runtime_thread_js=function(){return(ln=e._emscripten_run_in_main_runtime_thread_js=e.asm.emscripten_run_in_main_runtime_thread_js).apply(null,arguments)};e._emscripten_dispatch_to_thread_=function(){return(e._emscripten_dispatch_to_thread_=e.asm.emscripten_dispatch_to_thread_).apply(null,arguments)};var mn=e.__emscripten_proxy_execute_task_queue=function(){return(mn=e.__emscripten_proxy_execute_task_queue=e.asm._emscripten_proxy_execute_task_queue).apply(null,arguments)},$t=e.__emscripten_thread_free_data=function(){return($t=e.__emscripten_thread_free_data=e.asm._emscripten_thread_free_data).apply(null,arguments)},fn=e.__emscripten_thread_exit=function(){return(fn=e.__emscripten_thread_exit=e.asm._emscripten_thread_exit).apply(null,arguments)},hn=e._emscripten_stack_set_limits=function(){return(hn=e._emscripten_stack_set_limits=e.asm.emscripten_stack_set_limits).apply(null,arguments)},zt=e.stackSave=function(){return(zt=e.stackSave=e.asm.stackSave).apply(null,arguments)},Mt=e.stackRestore=function(){return(Mt=e.stackRestore=e.asm.stackRestore).apply(null,arguments)},vt=e.stackAlloc=function(){return(vt=e.stackAlloc=e.asm.stackAlloc).apply(null,arguments)};e.dynCall_iijjiiii=function(){return(e.dynCall_iijjiiii=e.asm.dynCall_iijjiiii).apply(null,arguments)},e.dynCall_jiji=function(){return(e.dynCall_jiji=e.asm.dynCall_jiji).apply(null,arguments)},e.keepRuntimeAlive=Ve,e.wasmMemory=G,e.cwrap=Vs,e.ExitStatus=Ie,e.PThread=A;var At;Fe=function p(){At||gn(),At||(Fe=p)};function gn(p){if(ye>0)return;if(_){m(e),lt(),startWorker(e);return}if(Qe(),ye>0)return;function h(){At||(At=!0,e.calledRun=!0,!ie&&(lt(),m(e),e.onRuntimeInitialized&&e.onRuntimeInitialized(),mt()))}e.setStatus?(e.setStatus("Running..."),setTimeout(function(){setTimeout(function(){e.setStatus("")},1),h()},1)):h()}if(e.preInit)for(typeof e.preInit=="function"&&(e.preInit=[e.preInit]);e.preInit.length>0;)e.preInit.pop()();gn();var xt;l&&(xt={uncaughtException:process.listeners("uncaughtException").filter(function(p){return!l.uncaughtException.indexOf(p)>-1}),unhandledRejection:process.listeners("unhandledRejection").filter(function(p){return!l.unhandledRejection.indexOf(p)>-1})});var Dt;if(typeof WasmBackendModule<"u")Dt=WasmBackendModule;else if(typeof a<"u")Dt=a;else throw new Error("Could not find wasm module in post.js");if(xt){var zs=Dt._dispose;Dt._dispose=function(){zs(),xt.uncaughtException.forEach(function(p){process.removeListener("uncaughtException",p)}),xt.unhandledRejection.forEach(function(p){process.removeListener("unhandledRejection",p)})}}return a.ready}})();r.exports=s})(bs);var _s=bs.exports,ys=La(_s),Pf=Ii({__proto__:null,default:ys},[_s]),Of=`"use strict";var Module={};var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";if(ENVIRONMENT_IS_NODE){var nodeWorkerThreads=require("worker_threads");var parentPort=nodeWorkerThreads.parentPort;parentPort.on("message",data=>onmessage({data:data}));var fs=require("fs");Object.assign(global,{self:global,require:require,Module:Module,location:{href:__filename},Worker:nodeWorkerThreads.Worker,importScripts:function(f){(0,eval)(fs.readFileSync(f,"utf8")+"//# sourceURL="+f)},postMessage:function(msg){parentPort.postMessage(msg)},performance:global.performance||{now:function(){return Date.now()}}})}var initializedJS=false;var pendingNotifiedProxyingQueues=[];function threadPrintErr(){var text=Array.prototype.slice.call(arguments).join(" ");if(ENVIRONMENT_IS_NODE){fs.writeSync(2,text+"
");return}console.error(text)}function threadAlert(){var text=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:text,threadId:Module["_pthread_self"]()})}var err=threadPrintErr;self.alert=threadAlert;Module["instantiateWasm"]=(info,receiveInstance)=>{var instance=new WebAssembly.Instance(Module["wasmModule"],info);receiveInstance(instance);Module["wasmModule"]=null;return instance.exports};self.onunhandledrejection=e=>{throw e.reason??e};self.startWorker=instance=>{Module=instance;postMessage({"cmd":"loaded"})};self.onmessage=e=>{try{if(e.data.cmd==="load"){Module["wasmModule"]=e.data.wasmModule;for(const handler of e.data.handlers){Module[handler]=function(){postMessage({cmd:"callHandler",handler:handler,args:[...arguments]})}}Module["wasmMemory"]=e.data.wasmMemory;Module["buffer"]=Module["wasmMemory"].buffer;Module["ENVIRONMENT_IS_PTHREAD"]=true;if(typeof e.data.urlOrBlob=="string"){importScripts(e.data.urlOrBlob)}else{var objectUrl=URL.createObjectURL(e.data.urlOrBlob);importScripts(objectUrl);URL.revokeObjectURL(objectUrl)}WasmBackendModuleThreadedSimd(Module)}else if(e.data.cmd==="run"){Module["__emscripten_thread_init"](e.data.pthread_ptr,0,0,1);Module["establishStackSpace"]();Module["PThread"].receiveObjectTransfer(e.data);Module["PThread"].threadInitTLS();if(!initializedJS){pendingNotifiedProxyingQueues.forEach(queue=>{Module["executeNotifiedProxyingQueue"](queue)});pendingNotifiedProxyingQueues=[];initializedJS=true}try{Module["invokeEntryPoint"](e.data.start_routine,e.data.arg)}catch(ex){if(ex!="unwind"){if(ex instanceof Module["ExitStatus"]){if(Module["keepRuntimeAlive"]()){}else{Module["__emscripten_thread_exit"](ex.status)}}else{throw ex}}}}else if(e.data.cmd==="cancel"){if(Module["_pthread_self"]()){Module["__emscripten_thread_exit"](-1)}}else if(e.data.target==="setimmediate"){}else if(e.data.cmd==="processProxyingQueue"){if(initializedJS){Module["executeNotifiedProxyingQueue"](e.data.queue)}else{pendingNotifiedProxyingQueues.push(e.data.queue)}}else if(e.data.cmd){err("worker.js received unknown command "+e.data.cmd);err(e.data)}}catch(ex){if(Module["__emscripten_thread_crashed"]){Module["__emscripten_thread_crashed"]()}throw ex}};`,Is={exports:{}};(function(r,n){var s=(()=>{var o=typeof document<"u"&&document.currentScript?document.currentScript.src:void 0;return typeof __filename<"u"&&(o=o||__filename),function(a){a=a||{};var t=typeof a<"u"?a:{},i,d;t.ready=new Promise(function(I,S){i=I,d=S});var c;typeof process<"u"&&process.listeners&&(c={uncaughtException:process.listeners("uncaughtException"),unhandledRejection:process.listeners("unhandledRejection")});var u=Object.assign({},t),e=typeof window=="object",m=typeof importScripts=="function",b=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string",l="";function f(I){return t.locateFile?t.locateFile(I,l):l+I}var g,w,k;if(b){var y=Oe,_=Oe;m?l=_.dirname(l)+"/":l=__dirname+"/",g=(I,S)=>(I=Ce(I)?new URL(I):_.normalize(I),y.readFileSync(I,S?void 0:"utf8")),k=I=>{var S=g(I,!0);return S.buffer||(S=new Uint8Array(S)),S},w=(I,S,N)=>{I=Ce(I)?new URL(I):_.normalize(I),y.readFile(I,function(A,j){A?N(A):S(j.buffer)})},process.argv.length>1&&process.argv[1].replace(/\\/g,"/"),process.argv.slice(2),process.on("uncaughtException",function(I){if(!(I instanceof Ve))throw I}),process.on("unhandledRejection",function(I){throw I}),t.inspect=function(){return"[Emscripten Module object]"}}else(e||m)&&(m?l=self.location.href:typeof document<"u"&&document.currentScript&&(l=document.currentScript.src),o&&(l=o),l.indexOf("blob:")!==0?l=l.substr(0,l.replace(/[?#].*/,"").lastIndexOf("/")+1):l="",g=I=>{var S=new XMLHttpRequest;return S.open("GET",I,!1),S.send(null),S.responseText},m&&(k=I=>{var S=new XMLHttpRequest;return S.open("GET",I,!1),S.responseType="arraybuffer",S.send(null),new Uint8Array(S.response)}),w=(I,S,N)=>{var A=new XMLHttpRequest;A.open("GET",I,!0),A.responseType="arraybuffer",A.onload=()=>{if(A.status==200||A.status==0&&A.response){S(A.response);return}N()},A.onerror=N,A.send(null)});var v=t.print||console.log.bind(console),E=t.printErr||console.warn.bind(console);Object.assign(t,u),u=null,t.arguments&&t.arguments,t.thisProgram&&t.thisProgram,t.quit&&t.quit;var R;t.wasmBinary&&(R=t.wasmBinary),t.noExitRuntime,typeof WebAssembly!="object"&&Ne("no native wasm support detected");var B,V=!1,z=typeof TextDecoder<"u"?new TextDecoder("utf8"):void 0;function H(I,S,N){S>>>=0;for(var A=S+N,j=S;I[j]&&!(j>=A);)++j;if(j-S>16&&I.buffer&&z)return z.decode(I.subarray(S,j));for(var K="";S<j;){var T=I[S++];if(!(T&128)){K+=String.fromCharCode(T);continue}var O=I[S++]&63;if((T&224)==192){K+=String.fromCharCode((T&31)<<6|O);continue}var Z=I[S++]&63;if((T&240)==224?T=(T&15)<<12|O<<6|Z:T=(T&7)<<18|O<<12|Z<<6|I[S++]&63,T<65536)K+=String.fromCharCode(T);else{var le=T-65536;K+=String.fromCharCode(55296|le>>10,56320|le&1023)}}return K}function U(I,S){return I>>>=0,I?H(te,I,S):""}function q(I,S,N,A){if(N>>>=0,!(A>0))return 0;for(var j=N,K=N+A-1,T=0;T<I.length;++T){var O=I.charCodeAt(T);if(O>=55296&&O<=57343){var Z=I.charCodeAt(++T);O=65536+((O&1023)<<10)|Z&1023}if(O<=127){if(N>=K)break;S[N++>>>0]=O}else if(O<=2047){if(N+1>=K)break;S[N++>>>0]=192|O>>6,S[N++>>>0]=128|O&63}else if(O<=65535){if(N+2>=K)break;S[N++>>>0]=224|O>>12,S[N++>>>0]=128|O>>6&63,S[N++>>>0]=128|O&63}else{if(N+3>=K)break;S[N++>>>0]=240|O>>18,S[N++>>>0]=128|O>>12&63,S[N++>>>0]=128|O>>6&63,S[N++>>>0]=128|O&63}}return S[N>>>0]=0,N-j}function J(I,S,N){return q(I,te,S,N)}var ue,X,te,pe;function G(I){ue=I,t.HEAP8=X=new Int8Array(I),t.HEAP16=new Int16Array(I),t.HEAP32=new Int32Array(I),t.HEAPU8=te=new Uint8Array(I),t.HEAPU16=new Uint16Array(I),t.HEAPU32=pe=new Uint32Array(I),t.HEAPF32=new Float32Array(I),t.HEAPF64=new Float64Array(I)}t.INITIAL_MEMORY;var he=[],ie=[],de=[];function _e(){if(t.preRun)for(typeof t.preRun=="function"&&(t.preRun=[t.preRun]);t.preRun.length;)Le(t.preRun.shift());Qe(he)}function ne(){Qe(ie)}function He(){if(t.postRun)for(typeof t.postRun=="function"&&(t.postRun=[t.postRun]);t.postRun.length;)Xe(t.postRun.shift());Qe(de)}function Le(I){he.unshift(I)}function qe(I){ie.unshift(I)}function Xe(I){de.unshift(I)}var Y=0,Me=null;function ot(I){Y++,t.monitorRunDependencies&&t.monitorRunDependencies(Y)}function it(I){if(Y--,t.monitorRunDependencies&&t.monitorRunDependencies(Y),Y==0&&Me){var S=Me;Me=null,S()}}function Ne(I){t.onAbort&&t.onAbort(I),I="Aborted("+I+")",E(I),V=!0,I+=". Build with -sASSERTIONS for more info.";var S=new WebAssembly.RuntimeError(I);throw d(S),S}var dt="data:application/octet-stream;base64,";function be(I){return I.startsWith(dt)}function Ce(I){return I.startsWith("file://")}var ae;ae="tfjs-backend-wasm.wasm",be(ae)||(ae=f(ae));function Ke(I){try{if(I==ae&&R)return new Uint8Array(R);if(k)return k(I);throw"both async and sync fetching of the wasm failed"}catch(S){Ne(S)}}function ct(){if(!R&&(e||m)){if(typeof fetch=="function"&&!Ce(ae))return fetch(ae,{credentials:"same-origin"}).then(function(I){if(!I.ok)throw"failed to load wasm binary file at '"+ae+"'";return I.arrayBuffer()}).catch(function(){return Ke(ae)});if(w)return new Promise(function(I,S){w(ae,function(N){I(new Uint8Array(N))},S)})}return Promise.resolve().then(function(){return Ke(ae)})}function pt(){var I={env:ht,wasi_snapshot_preview1:ht};function S(T,O){var Z=T.exports;t.asm=Z,B=t.asm.memory,G(B.buffer),t.asm.__indirect_function_table,qe(t.asm.__wasm_call_ctors),it()}ot();function N(T){S(T.instance)}function A(T){return ct().then(function(O){return WebAssembly.instantiate(O,I)}).then(function(O){return O}).then(T,function(O){E("failed to asynchronously prepare wasm: "+O),Ne(O)})}function j(){return!R&&typeof WebAssembly.instantiateStreaming=="function"&&!be(ae)&&!Ce(ae)&&!b&&typeof fetch=="function"?fetch(ae,{credentials:"same-origin"}).then(function(T){var O=WebAssembly.instantiateStreaming(T,I);return O.then(N,function(Z){return E("wasm streaming compile failed: "+Z),E("falling back to ArrayBuffer instantiation"),A(N)})}):A(N)}if(t.instantiateWasm)try{var K=t.instantiateWasm(I,S);return K}catch(T){E("Module.instantiateWasm callback failed with error: "+T),d(T)}return j().catch(d),{}}function Ve(I){this.name="ExitStatus",this.message="Program terminated with exit("+I+")",this.status=I}function Qe(I){for(;I.length>0;)I.shift()(t)}function lt(){Ne("")}function mt(){return 4294901760}function Et(){return mt()}function Pt(I,S,N){te.copyWithin(I>>>0,S>>>0,S+N>>>0)}function Ot(I){try{return B.grow(I-ue.byteLength+65535>>>16),G(B.buffer),1}catch{}}function ye(I){var S=te.length;I=I>>>0;var N=mt();if(I>N)return!1;let A=(Z,le)=>Z+(le-Z%le)%le;for(var j=1;j<=4;j*=2){var K=S*(1+.2/j);K=Math.min(K,I+100663296);var T=Math.min(N,A(Math.max(I,K),65536)),O=Ot(T);if(O)return!0}return!1}function Fe(I){return 52}function Wt(I,S,N,A,j){return 70}var Bt=[null,[],[]];function Re(I,S){var N=Bt[I];S===0||S===10?((I===1?v:E)(H(N,0)),N.length=0):N.push(S)}function Tt(I,S,N,A){for(var j=0,K=0;K<N;K++){var T=pe[S>>>2],O=pe[S+4>>>2];S+=8;for(var Z=0;Z<O;Z++)Re(I,te[T+Z>>>0]);j+=O}return pe[A>>>2]=j,0}function Je(I){var S=t["_"+I];return S}function $e(I,S){X.set(I,S>>>0)}function se(I,S,N,A,j){var K={string:re=>{var ve=0;if(re!=null&&re!==0){var kt=(re.length<<2)+1;ve=Ie(kt),J(re,ve,kt)}return ve},array:re=>{var ve=Ie(re.length);return $e(re,ve),ve}};function T(re){return S==="string"?U(re):S==="boolean"?!!re:re}var O=Je(I),Z=[],le=0;if(A)for(var we=0;we<A.length;we++){var It=K[N[we]];It?(le===0&&(le=gt()),Z[we]=It(A[we])):Z[we]=A[we]}var Ye=O.apply(null,Z);function wt(re){return le!==0&&bt(le),T(re)}return Ye=wt(Ye),Ye}function ft(I,S,N,A){N=N||[];var j=N.every(T=>T==="number"||T==="boolean"),K=S!=="string";return K&&j&&!A?Je(I):function(){return se(I,S,N,arguments)}}var ht={abort:lt,emscripten_get_heap_max:Et,emscripten_memcpy_big:Pt,emscripten_resize_heap:ye,fd_close:Fe,fd_seek:Wt,fd_write:Tt};pt(),t.___wasm_call_ctors=function(){return(t.___wasm_call_ctors=t.asm.__wasm_call_ctors).apply(null,arguments)},t._init=function(){return(t._init=t.asm.init).apply(null,arguments)},t._init_with_threads_count=function(){return(t._init_with_threads_count=t.asm.init_with_threads_count).apply(null,arguments)},t._get_threads_count=function(){return(t._get_threads_count=t.asm.get_threads_count).apply(null,arguments)},t._register_tensor=function(){return(t._register_tensor=t.asm.register_tensor).apply(null,arguments)},t._dispose_data=function(){return(t._dispose_data=t.asm.dispose_data).apply(null,arguments)},t._dispose=function(){return(t._dispose=t.asm.dispose).apply(null,arguments)},t._Abs=function(){return(t._Abs=t.asm.Abs).apply(null,arguments)},t._Acos=function(){return(t._Acos=t.asm.Acos).apply(null,arguments)},t._Acosh=function(){return(t._Acosh=t.asm.Acosh).apply(null,arguments)},t._Add=function(){return(t._Add=t.asm.Add).apply(null,arguments)},t._AddN=function(){return(t._AddN=t.asm.AddN).apply(null,arguments)},t._All=function(){return(t._All=t.asm.All).apply(null,arguments)},t._Any=function(){return(t._Any=t.asm.Any).apply(null,arguments)},t._ArgMax=function(){return(t._ArgMax=t.asm.ArgMax).apply(null,arguments)},t._ArgMin=function(){return(t._ArgMin=t.asm.ArgMin).apply(null,arguments)},t._Asin=function(){return(t._Asin=t.asm.Asin).apply(null,arguments)},t._Asinh=function(){return(t._Asinh=t.asm.Asinh).apply(null,arguments)},t._Atan=function(){return(t._Atan=t.asm.Atan).apply(null,arguments)},t._Atan2=function(){return(t._Atan2=t.asm.Atan2).apply(null,arguments)},t._Atanh=function(){return(t._Atanh=t.asm.Atanh).apply(null,arguments)},t._AvgPool=function(){return(t._AvgPool=t.asm.AvgPool).apply(null,arguments)},t._AvgPool3D=function(){return(t._AvgPool3D=t.asm.AvgPool3D).apply(null,arguments)},t._AvgPool3DGrad=function(){return(t._AvgPool3DGrad=t.asm.AvgPool3DGrad).apply(null,arguments)},t._AvgPoolGrad=function(){return(t._AvgPoolGrad=t.asm.AvgPoolGrad).apply(null,arguments)},t._BatchMatMul=function(){return(t._BatchMatMul=t.asm.BatchMatMul).apply(null,arguments)},t._Bincount=function(){return(t._Bincount=t.asm.Bincount).apply(null,arguments)},t._BitwiseAnd=function(){return(t._BitwiseAnd=t.asm.BitwiseAnd).apply(null,arguments)},t._Ceil=function(){return(t._Ceil=t.asm.Ceil).apply(null,arguments)},t._ClipByValue=function(){return(t._ClipByValue=t.asm.ClipByValue).apply(null,arguments)},t._Conv2D=function(){return(t._Conv2D=t.asm.Conv2D).apply(null,arguments)},t._Conv2DBackpropInput=function(){return(t._Conv2DBackpropInput=t.asm.Conv2DBackpropInput).apply(null,arguments)},t._Conv3D=function(){return(t._Conv3D=t.asm.Conv3D).apply(null,arguments)},t._Conv3DBackpropFilterV2=function(){return(t._Conv3DBackpropFilterV2=t.asm.Conv3DBackpropFilterV2).apply(null,arguments)},t._Conv3DBackpropInputV2=function(){return(t._Conv3DBackpropInputV2=t.asm.Conv3DBackpropInputV2).apply(null,arguments)},t._Cos=function(){return(t._Cos=t.asm.Cos).apply(null,arguments)},t._Cosh=function(){return(t._Cosh=t.asm.Cosh).apply(null,arguments)},t._CropAndResize=function(){return(t._CropAndResize=t.asm.CropAndResize).apply(null,arguments)},t._Cumprod=function(){return(t._Cumprod=t.asm.Cumprod).apply(null,arguments)},t._Cumsum=function(){return(t._Cumsum=t.asm.Cumsum).apply(null,arguments)},t._DenseBincount=function(){return(t._DenseBincount=t.asm.DenseBincount).apply(null,arguments)},t._DepthToSpace=function(){return(t._DepthToSpace=t.asm.DepthToSpace).apply(null,arguments)},t._DepthwiseConv2dNative=function(){return(t._DepthwiseConv2dNative=t.asm.DepthwiseConv2dNative).apply(null,arguments)},t._Diag=function(){return(t._Diag=t.asm.Diag).apply(null,arguments)},t._Dilation2D=function(){return(t._Dilation2D=t.asm.Dilation2D).apply(null,arguments)},t._Dilation2DBackpropFilter=function(){return(t._Dilation2DBackpropFilter=t.asm.Dilation2DBackpropFilter).apply(null,arguments)},t._Dilation2DBackpropInput=function(){return(t._Dilation2DBackpropInput=t.asm.Dilation2DBackpropInput).apply(null,arguments)},t._Elu=function(){return(t._Elu=t.asm.Elu).apply(null,arguments)},t._EluGrad=function(){return(t._EluGrad=t.asm.EluGrad).apply(null,arguments)},t._Equal=function(){return(t._Equal=t.asm.Equal).apply(null,arguments)},t._Erf=function(){return(t._Erf=t.asm.Erf).apply(null,arguments)},t._Exp=function(){return(t._Exp=t.asm.Exp).apply(null,arguments)},t._Expm1=function(){return(t._Expm1=t.asm.Expm1).apply(null,arguments)},t._FlipLeftRight=function(){return(t._FlipLeftRight=t.asm.FlipLeftRight).apply(null,arguments)},t._Floor=function(){return(t._Floor=t.asm.Floor).apply(null,arguments)},t._FloorDiv=function(){return(t._FloorDiv=t.asm.FloorDiv).apply(null,arguments)},t._FusedBatchNorm=function(){return(t._FusedBatchNorm=t.asm.FusedBatchNorm).apply(null,arguments)},t._FusedConv2D=function(){return(t._FusedConv2D=t.asm.FusedConv2D).apply(null,arguments)},t._FusedDepthwiseConv2D=function(){return(t._FusedDepthwiseConv2D=t.asm.FusedDepthwiseConv2D).apply(null,arguments)},t._Gather=function(){return(t._Gather=t.asm.Gather).apply(null,arguments)},t._GatherNd=function(){return(t._GatherNd=t.asm.GatherNd).apply(null,arguments)},t._Greater=function(){return(t._Greater=t.asm.Greater).apply(null,arguments)},t._GreaterEqual=function(){return(t._GreaterEqual=t.asm.GreaterEqual).apply(null,arguments)},t._IsFinite=function(){return(t._IsFinite=t.asm.IsFinite).apply(null,arguments)},t._IsInf=function(){return(t._IsInf=t.asm.IsInf).apply(null,arguments)},t._IsNan=function(){return(t._IsNan=t.asm.IsNan).apply(null,arguments)},t._LRN=function(){return(t._LRN=t.asm.LRN).apply(null,arguments)},t._LRNGrad=function(){return(t._LRNGrad=t.asm.LRNGrad).apply(null,arguments)},t._LeakyRelu=function(){return(t._LeakyRelu=t.asm.LeakyRelu).apply(null,arguments)},t._Less=function(){return(t._Less=t.asm.Less).apply(null,arguments)},t._LessEqual=function(){return(t._LessEqual=t.asm.LessEqual).apply(null,arguments)},t._LinSpace=function(){return(t._LinSpace=t.asm.LinSpace).apply(null,arguments)},t._Log=function(){return(t._Log=t.asm.Log).apply(null,arguments)},t._Log1p=function(){return(t._Log1p=t.asm.Log1p).apply(null,arguments)},t._LogicalAnd=function(){return(t._LogicalAnd=t.asm.LogicalAnd).apply(null,arguments)},t._LogicalNot=function(){return(t._LogicalNot=t.asm.LogicalNot).apply(null,arguments)},t._LogicalOr=function(){return(t._LogicalOr=t.asm.LogicalOr).apply(null,arguments)},t._LogicalXor=function(){return(t._LogicalXor=t.asm.LogicalXor).apply(null,arguments)},t._Max=function(){return(t._Max=t.asm.Max).apply(null,arguments)},t._MaxPool=function(){return(t._MaxPool=t.asm.MaxPool).apply(null,arguments)},t._MaxPool3D=function(){return(t._MaxPool3D=t.asm.MaxPool3D).apply(null,arguments)},t._MaxPool3DGrad=function(){return(t._MaxPool3DGrad=t.asm.MaxPool3DGrad).apply(null,arguments)},t._MaxPoolGrad=function(){return(t._MaxPoolGrad=t.asm.MaxPoolGrad).apply(null,arguments)},t._MaxPoolWithArgmax=function(){return(t._MaxPoolWithArgmax=t.asm.MaxPoolWithArgmax).apply(null,arguments)},t._Maximum=function(){return(t._Maximum=t.asm.Maximum).apply(null,arguments)},t._Mean=function(){return(t._Mean=t.asm.Mean).apply(null,arguments)},t._Min=function(){return(t._Min=t.asm.Min).apply(null,arguments)},t._Minimum=function(){return(t._Minimum=t.asm.Minimum).apply(null,arguments)},t._MirrorPad=function(){return(t._MirrorPad=t.asm.MirrorPad).apply(null,arguments)},t._Mod=function(){return(t._Mod=t.asm.Mod).apply(null,arguments)},t._Multinomial=function(){return(t._Multinomial=t.asm.Multinomial).apply(null,arguments)},t._Multiply=function(){return(t._Multiply=t.asm.Multiply).apply(null,arguments)},t._Neg=function(){return(t._Neg=t.asm.Neg).apply(null,arguments)},t._NonMaxSuppressionV3=function(){return(t._NonMaxSuppressionV3=t.asm.NonMaxSuppressionV3).apply(null,arguments)},t._NonMaxSuppressionV4=function(){return(t._NonMaxSuppressionV4=t.asm.NonMaxSuppressionV4).apply(null,arguments)},t._NonMaxSuppressionV5=function(){return(t._NonMaxSuppressionV5=t.asm.NonMaxSuppressionV5).apply(null,arguments)},t._NotEqual=function(){return(t._NotEqual=t.asm.NotEqual).apply(null,arguments)},t._OneHot=function(){return(t._OneHot=t.asm.OneHot).apply(null,arguments)},t._PadV2=function(){return(t._PadV2=t.asm.PadV2).apply(null,arguments)},t._Pow=function(){return(t._Pow=t.asm.Pow).apply(null,arguments)},t._Prelu=function(){return(t._Prelu=t.asm.Prelu).apply(null,arguments)},t._Prod=function(){return(t._Prod=t.asm.Prod).apply(null,arguments)},t._RealDiv=function(){return(t._RealDiv=t.asm.RealDiv).apply(null,arguments)},t._Reciprocal=function(){return(t._Reciprocal=t.asm.Reciprocal).apply(null,arguments)},t._Relu=function(){return(t._Relu=t.asm.Relu).apply(null,arguments)},t._Relu6=function(){return(t._Relu6=t.asm.Relu6).apply(null,arguments)},t._ResizeBilinear=function(){return(t._ResizeBilinear=t.asm.ResizeBilinear).apply(null,arguments)},t._ResizeBilinearGrad=function(){return(t._ResizeBilinearGrad=t.asm.ResizeBilinearGrad).apply(null,arguments)},t._ResizeNearestNeighbor=function(){return(t._ResizeNearestNeighbor=t.asm.ResizeNearestNeighbor).apply(null,arguments)},t._ResizeNearestNeighborGrad=function(){return(t._ResizeNearestNeighborGrad=t.asm.ResizeNearestNeighborGrad).apply(null,arguments)},t._Reverse=function(){return(t._Reverse=t.asm.Reverse).apply(null,arguments)},t._RotateWithOffset=function(){return(t._RotateWithOffset=t.asm.RotateWithOffset).apply(null,arguments)},t._Round=function(){return(t._Round=t.asm.Round).apply(null,arguments)},t._Rsqrt=function(){return(t._Rsqrt=t.asm.Rsqrt).apply(null,arguments)},t._ScatterNd=function(){return(t._ScatterNd=t.asm.ScatterNd).apply(null,arguments)},t._SearchSorted=function(){return(t._SearchSorted=t.asm.SearchSorted).apply(null,arguments)},t._SelectV2=function(){return(t._SelectV2=t.asm.SelectV2).apply(null,arguments)},t._Selu=function(){return(t._Selu=t.asm.Selu).apply(null,arguments)},t._Sigmoid=function(){return(t._Sigmoid=t.asm.Sigmoid).apply(null,arguments)},t._Sign=function(){return(t._Sign=t.asm.Sign).apply(null,arguments)},t._Sin=function(){return(t._Sin=t.asm.Sin).apply(null,arguments)},t._Sinh=function(){return(t._Sinh=t.asm.Sinh).apply(null,arguments)},t._Softmax=function(){return(t._Softmax=t.asm.Softmax).apply(null,arguments)},t._Softplus=function(){return(t._Softplus=t.asm.Softplus).apply(null,arguments)},t._SparseFillEmptyRows=function(){return(t._SparseFillEmptyRows=t.asm.SparseFillEmptyRows).apply(null,arguments)},t._SparseReshape=function(){return(t._SparseReshape=t.asm.SparseReshape).apply(null,arguments)},t._SparseSegmentReduction=function(){return(t._SparseSegmentReduction=t.asm.SparseSegmentReduction).apply(null,arguments)},t._SparseToDense=function(){return(t._SparseToDense=t.asm.SparseToDense).apply(null,arguments)},t._Sqrt=function(){return(t._Sqrt=t.asm.Sqrt).apply(null,arguments)},t._Square=function(){return(t._Square=t.asm.Square).apply(null,arguments)},t._SquaredDifference=function(){return(t._SquaredDifference=t.asm.SquaredDifference).apply(null,arguments)},t._Step=function(){return(t._Step=t.asm.Step).apply(null,arguments)},t._StridedSlice=function(){return(t._StridedSlice=t.asm.StridedSlice).apply(null,arguments)},t._Sub=function(){return(t._Sub=t.asm.Sub).apply(null,arguments)},t._Sum=function(){return(t._Sum=t.asm.Sum).apply(null,arguments)},t._Tan=function(){return(t._Tan=t.asm.Tan).apply(null,arguments)},t._Tanh=function(){return(t._Tanh=t.asm.Tanh).apply(null,arguments)},t._TensorScatterUpdate=function(){return(t._TensorScatterUpdate=t.asm.TensorScatterUpdate).apply(null,arguments)},t._Tile=function(){return(t._Tile=t.asm.Tile).apply(null,arguments)},t._TopK=function(){return(t._TopK=t.asm.TopK).apply(null,arguments)},t._Transform=function(){return(t._Transform=t.asm.Transform).apply(null,arguments)},t._Transpose=function(){return(t._Transpose=t.asm.Transpose).apply(null,arguments)},t.__FusedMatMul=function(){return(t.__FusedMatMul=t.asm._FusedMatMul).apply(null,arguments)},t._malloc=function(){return(t._malloc=t.asm.malloc).apply(null,arguments)},t._free=function(){return(t._free=t.asm.free).apply(null,arguments)},t.___errno_location=function(){return(t.___errno_location=t.asm.__errno_location).apply(null,arguments)};var gt=t.stackSave=function(){return(gt=t.stackSave=t.asm.stackSave).apply(null,arguments)},bt=t.stackRestore=function(){return(bt=t.stackRestore=t.asm.stackRestore).apply(null,arguments)},Ie=t.stackAlloc=function(){return(Ie=t.stackAlloc=t.asm.stackAlloc).apply(null,arguments)};t.dynCall_iijjiiii=function(){return(t.dynCall_iijjiiii=t.asm.dynCall_iijjiiii).apply(null,arguments)},t.dynCall_jiji=function(){return(t.dynCall_jiji=t.asm.dynCall_jiji).apply(null,arguments)},t.cwrap=ft;var ze;Me=function I(){ze||_t(),ze||(Me=I)};function _t(I){if(Y>0||(_e(),Y>0))return;function S(){ze||(ze=!0,t.calledRun=!0,!V&&(ne(),i(t),t.onRuntimeInitialized&&t.onRuntimeInitialized(),He()))}t.setStatus?(t.setStatus("Running..."),setTimeout(function(){setTimeout(function(){t.setStatus("")},1),S()},1)):S()}if(t.preInit)for(typeof t.preInit=="function"&&(t.preInit=[t.preInit]);t.preInit.length>0;)t.preInit.pop()();_t();var Ee;c&&(Ee={uncaughtException:process.listeners("uncaughtException").filter(function(I){return!c.uncaughtException.indexOf(I)>-1}),unhandledRejection:process.listeners("unhandledRejection").filter(function(I){return!c.unhandledRejection.indexOf(I)>-1})});var Pe;if(typeof a<"u")Pe=a;else if(typeof WasmBackendModuleThreadedSimd<"u")Pe=WasmBackendModuleThreadedSimd;else throw new Error("Could not find wasm module in post.js");if(Ee){var yt=Pe._dispose;Pe._dispose=function(){yt(),Ee.uncaughtException.forEach(function(I){process.removeListener("uncaughtException",I)}),Ee.unhandledRejection.forEach(function(I){process.removeListener("unhandledRejection",I)})}}return a.ready}})();r.exports=s})(Is);var Wf=Is.exports,ws=La(Wf),Bf=Object.freeze({__proto__:null,default:ws});/**
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
 */const Mn=ys||Pf,Tf=ws||Bf;class Hf extends ii{constructor(n){super(),this.wasm=n,this.dataIdNextNumber=1,this.wasm.tfjs.initWithThreadsCount(ks),Jt=this.wasm.tfjs.getThreadsCount(),this.dataIdMap=new di(this,ci())}write(n,s,o){const a={id:this.dataIdNextNumber++};return this.move(a,n,s,o,1),a}numDataIds(){return this.dataIdMap.numDataIds()}async time(n){const s=wn();return n(),{kernelMs:wn()-s}}move(n,s,o,a,t){const i=this.dataIdNextNumber++;if(a==="string"){const e=s;this.dataIdMap.set(n,{id:i,stringBytes:e,shape:o,dtype:a,memoryOffset:null,refCount:t});return}const d=F(o),c=d*kn(a),u=this.wasm._malloc(c)>>>0;this.dataIdMap.set(n,{id:i,memoryOffset:u,shape:o,dtype:a,refCount:t}),this.wasm.tfjs.registerTensor(i,d,u),s!=null&&this.wasm.HEAPU8.set(new Uint8Array(s.buffer,s.byteOffset,c),u)}async read(n){return this.readSync(n)}readSync(n,s,o){const{memoryOffset:a,dtype:t,shape:i,stringBytes:d}=this.dataIdMap.get(n);if(t==="string")return(s==null||s===0)&&(o==null||o>=d.length)?d:d.slice(s,o);s=s||0,o=o||F(i);const c=kn(t),u=this.wasm.HEAPU8.slice(a+s*c,a+o*c);return $f(u.buffer,t)}disposeData(n,s=!1){if(this.dataIdMap.has(n)){const o=this.dataIdMap.get(n);if(o.refCount--,!s&&o.refCount>0)return!1;this.wasm._free(o.memoryOffset),this.wasm.tfjs.disposeData(o.id),this.dataIdMap.delete(n)}return!0}refCount(n){return this.dataIdMap.has(n)?this.dataIdMap.get(n).refCount:0}incRef(n){const s=this.dataIdMap.get(n);s!=null&&s.refCount++}floatPrecision(){return 32}getMemoryOffset(n){return this.dataIdMap.get(n).memoryOffset}dispose(){this.wasm.tfjs.dispose(),"PThread"in this.wasm&&this.wasm.PThread.terminateAllThreads(),this.wasm=null}memory(){return{unreliable:!1}}makeOutput(n,s,o,a){let t;if(o==null)t=this.write(a??null,n,s);else{const i=this.dataIdNextNumber++;t={id:i},this.dataIdMap.set(t,{id:i,memoryOffset:o,shape:n,dtype:s,refCount:1});const d=F(n);this.wasm.tfjs.registerTensor(i,d,o)}return{dataId:t,shape:n,dtype:s}}typedArrayFromHeap({shape:n,dtype:s,dataId:o}){const a=this.wasm.HEAPU8.buffer,{memoryOffset:t}=this.dataIdMap.get(o),i=F(n);switch(s){case"float32":return new Float32Array(a,t,i);case"int32":return new Int32Array(a,t,i);case"bool":return new Uint8Array(a,t,i);default:throw new Error(`Unknown dtype ${s}`)}}}function Lf(r){return(n,s)=>(li(r,{credentials:"same-origin"}).then(o=>{o.ok||n.env.a(`failed to load wasm binary file at '${r}'`),o.arrayBuffer().then(a=>{WebAssembly.instantiate(a,n).then(t=>{s(t.instance,t.module)})})}),{})}function vn(r,n,s){if(Nt!=null)return Nt;let o="tfjs-backend-wasm.wasm";return r&&n?o="tfjs-backend-wasm-threaded-simd.wasm":r&&(o="tfjs-backend-wasm-simd.wasm"),tt!=null&&tt[o]!=null?tt[o]:s+o}async function Vf(){const[r,n]=await Promise.all([jt().getAsync("WASM_HAS_SIMD_SUPPORT"),jt().getAsync("WASM_HAS_MULTITHREAD_SUPPORT")]);return new Promise((s,o)=>{const a={};a.locateFile=(d,c)=>{if(d.endsWith(".worker.js")){const u=Of.replace(/\n/g,"\\n"),e=new Blob([u],{type:"application/javascript"});return URL.createObjectURL(e)}return d.endsWith(".wasm")?vn(r,n,et??c):c+d},an&&(a.instantiateWasm=Lf(vn(r,n,et??"")));let t=!1;a.onAbort=()=>{if(t||nt)return;nt=!0,o({message:"Make sure the server can serve the `.wasm` file relative to the bundled js file. For more details see https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-wasm/README.md#using-bundlers"})};let i;n&&r&&Nt==null?(a.mainScriptUrlOrBlob=new Blob(["var WasmBackendModuleThreadedSimd = "+Mn.toString()],{type:"text/javascript"}),i=Mn(a)):i=Tf(a),i.then(d=>{t=!0,nt=!1;const c=null;d.tfjs={init:d.cwrap("init",null,[]),initWithThreadsCount:d.cwrap("init_with_threads_count",null,["number"]),getThreadsCount:d.cwrap("get_threads_count","number",[]),registerTensor:d.cwrap("register_tensor",null,["number","number","number"]),disposeData:d.cwrap("dispose_data",c,["number"]),dispose:d.cwrap("dispose",c,[])},s({wasm:d})}).catch(o)})}function $f(r,n){switch(n){case"float32":return new Float32Array(r);case"int32":return new Int32Array(r);case"bool":return new Uint8Array(r);default:throw new Error(`Unknown dtype ${n}`)}}const zf=["tfjs-backend-wasm.wasm","tfjs-backend-wasm-simd.wasm","tfjs-backend-wasm-threaded-simd.wasm"];let Nt=null,et=null,tt={},nt=!1,an=!1;function qf(r,n=!1){if(pi("setWasmPath has been deprecated in favor of setWasmPaths and will be removed in a future release."),nt)throw new Error("The WASM backend was already initialized. Make sure you call `setWasmPath()` before you call `tf.setBackend()` or `tf.ready()`");Nt=r,an=n}function Xf(r,n=!1){if(nt)throw new Error("The WASM backend was already initialized. Make sure you call `setWasmPaths()` before you call `tf.setBackend()` or `tf.ready()`");if(typeof r=="string")et=r;else{tt=r;const s=zf.filter(o=>tt[o]==null);if(s.length>0)throw new Error(`There were no entries found for the following binaries: ${s.join(",")}. Please either call setWasmPaths with a map providing a path for each binary, or with a string indicating the directory where all the binaries can be found.`)}an=n}let ks=-1,Jt=-1;function Kf(r){ks=r}function Qf(){if(Jt===-1)throw new Error("WASM backend not initialized.");return Jt}/** @license See the LICENSE file. */const Jf="4.22.0";/**
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
 */const Gf=2;mi("wasm",async()=>{const{wasm:r}=await Vf();return new Hf(r)},Gf);export{Hf as BackendWasm,Qf as getThreadsCount,Kf as setThreadsCount,qf as setWasmPath,Xf as setWasmPaths,Jf as version_wasm};
