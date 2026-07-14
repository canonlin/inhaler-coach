import{cJ as I,s as G,d6 as T,cN as v,H as A,J as b,K as z,cK as P,a2 as W,cX as N,dZ as y,p as B,cO as E}from"./index-sfChTQFZ.js";/**
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
 */function $(s,i,t,o){const a=I(t,G(i));if(o&&t!=="string"){let e=0;s.forEach(n=>{const h=G(n.shape);a.set(n.vals,e),e+=h})}else{let e=0;s.forEach(n=>{const h=t==="string"?T(n.vals):n.vals;let r=0;for(let c=0;c<n.shape[0];++c){const f=c*i[1]+e;for(let l=0;l<n.shape[1];++l)a[f+l]=h[r++]}e+=n.shape[1]})}return a}/**
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
 */function k(s,i,t,o){const a=s===i,e=s<i&&t<0,n=i<s&&t>1;if(a||e||n)return v(0,o);const h=Math.abs(Math.ceil((i-s)/t)),r=v(h,o);i<s&&t===1&&(t=-1),r[0]=s;for(let c=1;c<r.length;c++)r[c]=r[c-1]+t;return r}/**
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
 */function D(s,i,t,o,a){const e=A(o,i,t),n=G(t),h=b(o);if(e){const l=z(i,h);return a==="string"?s.slice(l,l+n):s.subarray(l,l+n)}const r=a==="string"?T(s):s,c=P(o,a,r),f=P(t,a);for(let l=0;l<f.size;++l){const g=f.indexToLoc(l),S=g.map((u,p)=>u+i[p]);f.set(c.get(...S),...g)}return a==="string"?W(f.values):f.values}/**
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
 */class M{constructor(i,t,o,a,e,n){this.separator=N(i),this.nGramWidths=t,this.leftPad=N(o),this.rightPad=N(a),this.padWidth=e,this.preserveShort=n}getPadWidth(i){return Math.min(this.padWidth<0?i-1:this.padWidth,i-1)}getNumNGrams(i,t){const o=this.getPadWidth(t);return Math.max(0,i+2*o-t+1)}createNGrams(i,t,o,a,e,n){for(let h=0;h<e;++h){const r=this.getPadWidth(n),c=Math.max(0,r-h),f=Math.max(0,r-(e-(h+1))),l=n-(c+f),g=t+(c>0?0:h-r);let S=0;S+=c*this.leftPad.length;for(let m=0;m<l;++m)S+=i[g+m].length;S+=f*this.rightPad.length;const u=c+f+l-1;S+=u*this.separator.length,o[a+h]=new Uint8Array(S);const p=o[a+h];let x=0;const d=m=>m.forEach(w=>p[x++]=w);for(let m=0;m<c;++m)d(this.leftPad),d(this.separator);for(let m=0;m<l-1;++m)d(i[g+m]),d(this.separator);if(l>0){d(i[g+l-1]);for(let m=0;m<f;++m)d(this.separator),d(this.rightPad)}else{for(let m=0;m<f-1;++m)d(this.rightPad),d(this.separator);d(this.rightPad)}}}compute(i,t){const o=i.length,a=t.length;if(a>0){let r=t[0];if(r!==0)throw new Error(`First split value must be 0, got ${r}`);for(let c=1;c<a;++c){let f=t[c]>=r;if(f=f&&t[c]<=o,!f)throw new Error(`Invalid split value ${t[c]}, must be in [${r}, ${o}]`);r=t[c]}if(r!==o)throw new Error(`Last split value must be data size. Expected ${o}, got ${r}`)}const e=a-1,n=I("int32",a);if(o===0||a===0){const r=new Array(o);for(let c=0;c<=e;++c)n[c]=0;return[r,n]}n[0]=0;for(let r=1;r<=e;++r){const c=t[r]-t[r-1];let f=0;this.nGramWidths.forEach(l=>{f+=this.getNumNGrams(c,l)}),this.preserveShort&&c>0&&f===0&&(f=1),n[r]=n[r-1]+f}const h=new Array(n[e]);for(let r=0;r<e;++r){const c=t[r];let f=n[r];if(this.nGramWidths.forEach(l=>{const g=t[r+1]-t[r],S=this.getNumNGrams(g,l);this.createNGrams(i,c,h,f,S,l),f+=S}),this.preserveShort&&f===n[r]){const l=t[r+1]-t[r];if(l===0)continue;const g=l+2*this.padWidth;this.createNGrams(i,c,h,f,1,g)}}return[h,n]}}function F(s,i,t,o,a,e,n,h){return new M(t,o,a,e,n,h).compute(s,i)}/**
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
 */function O(s,i,t,o){if(!s.length)return;if(i.length===0){for(let e=0;e<s.length;++e)o.push(s.subarray(e,e+1));return}if(i.length===1){const e=i[0];let n=s.indexOf(e);for(;n!==-1;){const h=s.subarray(0,n);(!t||h.length!==0)&&o.push(h),s=s.subarray(n+1),n=s.indexOf(e)}(!t||s.length!==0)&&o.push(s);return}let a=0;for(let e=0;e<s.length+1;e++)if(e===s.length||i.indexOf(s[e])!==-1){const n=s.subarray(a,e);(!t||n.length!==0)&&o.push(n),a=e+1}}function q(s,i,t){const o=s.length,a=[];let e=0,n=0;const h=new Array(o);for(let g=0;g<o;++g){const S=a.length;O(s[g],i,t,a);const u=a.length-S;h[g]=u,e+=u,n=Math.max(n,u)}const r=I("int32",e*2),c=new Array(e),f=[o,n];let l=0;for(let g=0;g<o;++g)for(let S=0;S<h[g];++S)r[l*2]=g,r[l*2+1]=S,c[l]=a[l],++l;return[r,c,f]}/**
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
 */function U(s,i){const t=I("int32",s.length);for(let o=0;o<s.length;++o)t[o]=y(s[o]).modulo(i).getLowBitsUnsigned();return t}/**
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
 */function V(s,i,t,o){const a=B(i,t)[0],e=[1,t[0],1];for(let u=0;u<a;u++)e[0]*=t[u];e[1]=t[a];for(let u=a+1;u<t.length;u++)e[2]*=t[u];const n=new Map,h=new Int32Array(t[a]),r=new E(e,o,s),c=[],f=e[0]===1&&e[2]===1;for(let u=0;u<t[a];u++){let p;if(f)p=s[u].toString();else{const d=[];for(let m=0;m<e[0];m++)for(let w=0;w<e[2];w++)d.push(r.get(m,u,w));p=d.join(",")}const x=n.get(p);if(x!=null)h[u]=x;else{const d=n.size;n.set(p,d),h[u]=d,c.push(u)}}const l=e.slice();l[1]=n.size;const g=new E(l,o);c.forEach((u,p)=>{for(let x=0;x<e[0];x++)for(let d=0;d<e[2];d++)g.set(r.get(x,u,d),x,p,d)});const S=t.slice();return S[a]=l[1],{outputValues:g.values,outputShape:S,indices:h}}export{F as a,q as b,$ as c,U as d,k as r,D as s,V as u};
