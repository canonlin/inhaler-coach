import{l as Ve,P as mo}from"./graph_model-BJw7JDCk.js";import{a as xe,J as pe,s as M,cE as ze,cF as yt,cG as ni,cH as Wt,cI as go,cJ as ai,cK as ne,cL as xo,j as kt,cM as Ue,cN as ui,cO as yo,cP as Je,cs as q,cQ as Ke,E as G,cw as wo,cx as Co,cy as Be,cR as Nt,cS as ds,cT as Qt,cU as cs,cV as bo,cW as So,cX as vo,cD as ko,cY as Io,cZ as Po,c_ as Ro,c$ as $o,d0 as Do,d1 as No,d2 as zo,d3 as Ao,aw as Fo,ax as Mo,R as To,D as Lo,_ as Eo,d4 as hs,I as _o,d5 as Bo,d6 as ps,A as Oo,b as Wo,c as Vo,d as Uo,e as Go,T as Ho,p as Ae,g as ht,f as pt,i as Zt,k as Xo,d7 as Ko,h as qo,l as Yo,m as jo,n as Qo,o as Zo,q as Jo,r as er,u as tr,v as sr,aZ as ir,b5 as or,w as rr,x as ft,y as nr,z as It,B as ar,C as ur,F as lr,S as dr,G as cr,d8 as hr,L as pr,M as li,N as di,O as ci,P as fr,Q as mr,U as gr,W as xr,bh as yr,d9 as wr,X as Cr,da as hi,db as br,Y as Sr,Z as vr,dc as kr,a1 as nt,dd as Ir,$ as Pr,a0 as Rr,a3 as $r,a4 as mt,a5 as ve,de as Dr,a6 as Nr,a7 as zr,a8 as Jt,a9 as Ar,aa as Fr,ab as Mr,ac as Tr,ad as Lr,af as pi,ae as Er,ag as _r,ah as Br,ai as Or,aj as Wr,df as Vr,dg as Ur,ak as Gr,al as Hr,am as es,an as Xr,ao as Kr,dh as qr,bc as Yr,ch as jr,di as Qr,dj as Zr,dk as Jr,dl as en,dm as tn,dn as sn,ap as on,aq as rn,ar as nn,as as an,at as un,au as ln,av as dn,dp as cn,ay as hn,az as pn,aA as fn,dq as mn,aB as gn,aC as xn,aD as yn,b4 as fi,aE as wn,aF as Cn,aG as bn,aH as Sn,aI as vn,aJ as kn,dr as In,aK as Pn,aL as Rn,aM as $n,aN as Dn,aO as Nn,aP as zn,aQ as An,aR as Fn,aS as Mn,aT as Tn,aU as Ln,aV as En,aX as _n,aY as Bn,a_ as On,a$ as Wn,b0 as Vn,b1 as Un,b2 as Gn,b3 as Hn,b6 as Xn,b7 as Kn,b8 as qn,bb as Yn,b9 as jn,ba as Qn,bd as Zn,be as Jn,ds as ea,bg as ta,dt as sa,bi as ia,cq as oa,bj as ra,bk as na,bl as aa,bm as ua,bn as la,bo as da,bp as ca,bq as ha,br as pa,bs as fa,bt as ma,bu as ga,bv as xa,bw as ya,bx as wa,by as Ca,bz as ba,bA as Sa,bB as va,bC as ka,bD as Ia,bE as Pa,bF as ts,bG as Ra,bH as $a,bI as Da,bJ as Na,bK as za,bL as Aa,bM as Fa,bN as Ma,bO as Ta,c1 as La,c2 as Ea,cl as _a,c3 as Ba,c4 as Oa,c5 as Wa,c6 as Va,c7 as Ua,c8 as Ga,c9 as Ha,ca as Xa,cb as Ka,cc as qa,cd as Ya,cg as ja,ci as Qa,cj as Za,ck as Ja,cm as eu,cn as tu,cp as su,du as iu,dv as ou,cr as ru,dw as wt,dx as at,dy as qe,dz as Q,dA as $e,dB as Ge,dC as Oe,dD as Vt,dE as nu,dF as ee,dG as X,dH as be,dI as ss,dJ as is,dK as te,dL as mi,dM as tt,dN as ut,dO as We,dP as au,dQ as uu,dR as Y,dS as oe,dT as re,dU as Ut,dV as fs,dW as lu,dX as ot,dY as du}from"./index-sfChTQFZ.js";import{c as cu,r as hu,s as pu,a as fu,b as mu,d as gu,u as xu}from"./Unique_impl-AWitNnsy.js";/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */function yu(s){const e=new Float32Array(s.length);for(let t=0;t<s.length;++t)e[t]=Math.abs(s[t]);return e}/**
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
 */function de(s){return(e,t,o,i,r)=>{const n=xe(e,t),a=n.length,u=pe(n),l=M(n),d=ze(r,l),c=e.length,h=t.length,p=pe(e),f=pe(t),m=yt(e,n),g=yt(t,n);if(m.length+g.length===0)for(let x=0;x<d.length;++x)d[x]=s(o[x%o.length],i[x%i.length]);else for(let x=0;x<d.length;++x){const y=ni(x,a,u),w=y.slice(-c);m.forEach(v=>w[v]=0);const C=Wt(w,c,p),b=y.slice(-h);g.forEach(v=>b[v]=0);const S=Wt(b,h,f);d[x]=s(o[C],i[S])}return[d,n]}}/**
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
 */function wu(s,e,t,o){if(o==="int32"){const i=Int32Array.from(s);return[e,"int32",i]}if(o==="bool"){const i=go([0],t),[r,n]=de((a,u)=>a!==u?1:0)(e,[],s,i,"bool");return[n,"bool",r]}throw new Error(`Error in Cast: failed to cast ${t} to ${o}`)}/**
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
 */const Cu=de((s,e)=>s+e);/**
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
 */function Ye(s){return(e,t,o)=>{const i=ai(t,e.length);for(let r=0;r<e.length;++r)i[r]=s(e[r],o);return i}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */const bu=Ye(s=>Math.ceil(s));/**
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
 */const Su=de((s,e)=>s===e?1:0);/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */const vu=Ye(s=>Math.exp(s));/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */const ku=Ye(s=>Math.expm1(s));/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */const Iu=Ye(s=>Math.floor(s));/**
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
 */const Pu=de((s,e)=>Math.floor(s/e));/**
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
 */function Ru(s,e,t,o,i,r,n,a,u){const l=ne([o,r],t);for(let d=0;d<o;d++){const c=[];let h=0;for(let p=0;p<i;p++){const f=s[d*i+p];h+=f*n[p],c.push(f)}if(h<0||h>=u/r)throw new Error(`Invalid indices: ${c} does not index into ${a}`);for(let p=0;p<r;p++)l.values[d*r+p]=e.get(...e.indexToLoc(h*r+p))}return l}/**
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
 */function $u(s,e,t){const o=ne(t,s.dtype);for(let i=0;i<o.size;++i){const n=o.indexToLoc(i).slice(),a=n[0],u=n[2],l=e.locToIndex([a,u]);n[2]=e.values[l];const d=s.locToIndex(n);0<=d&&d<s.values.length&&(o.values[i]=s.values[d])}return o}/**
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
 */const Du=de((s,e)=>s>e?1:0);/**
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
 */const Nu=de((s,e)=>s>=e?1:0);/**
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
 */const zu=de((s,e)=>s<e?1:0);/**
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
 */const Au=de((s,e)=>s<=e?1:0);/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */const Fu=Ye(s=>Math.log(s));/**
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
 */function Mu(s,e,t,o){const i=ze(o,M(t));for(let r=0;r<i.length;++r){const n=r*e;let a=s[n];for(let u=0;u<e;++u){const l=s[n+u];(Number.isNaN(l)||l>a)&&(a=l)}i[r]=a}return i}/**
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
 */const Tu=de((s,e)=>Math.max(s,e));/**
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
 */const Lu=de((s,e)=>Math.min(s,e));/**
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
 */const gi=de((s,e)=>s*e);/**
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
 */function Eu(s,e,t){const o=xo(-1,t);return gi([],e,o,s,t)}/**
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
 */const _u=de((s,e)=>s!==e?1:0);/**
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
 */function Bu(s,e,t,o,i){const r=e.length,n=M(e),a=pe(e),u=pe(i),l=ze(t,M(i));for(let d=0;d<n;++d){const c=ni(d,r,a),h=new Array(c.length);for(let f=0;f<h.length;f++)h[f]=c[o[f]];const p=Wt(h,r,u);l[p]=s[d]}return l}/**
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
 */function Ou(s,e,t,o){const[i,r]=kt(s,o),n=Ue(e,"int32"),a=ui(M(i),n),u=M(r);for(let l=0;l<a.length;++l){const d=l*u;let c=1;for(let h=0;h<u;++h)c*=t[d+h];a[l]=c}return{outVals:a,outShape:i,outDtype:n}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 */const Wu=Ye(s=>1/Math.sqrt(s));/**
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
 */function Vu(s,e,t,o,i,r,n,a,u,l){const d=[o/i,i],c=s.values,h=e.values;if(o===0)return ne(t,e.dtype);const p=u instanceof yo?u:ne(d,e.dtype);typeof u=="string"||typeof u=="number"?p.values.fill(u):typeof u=="boolean"&&p.values.fill(+u);for(let f=0;f<r;f++){const m=[];let g=0;for(let x=0;x<n;x++){const y=c[f*n+x];m.push(y),g+=y*a[x]}if(g<0||g>=o/i)throw new Error(`Invalid indices: ${m} does not index into ${t}`);for(let x=0;x<i;x++)p.values[g*i+x]=e.rank===0?h[0]:h[f*i+x]}return p}/**
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
 */function Uu(s,e,t,o){const i=ne(s,e.dtype);for(let r=0;r<i.size;r++){const n=i.indexToLoc(r),a=new Array(n.length);for(let u=0;u<a.length;u++)a[u]=n[u]*t[u]+o[u];i.set(e.get(...a),...n)}return i}/**
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
 */const Gu=de((s,e)=>s-e);/**
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
 */function Hu(s,e){const t=new Array(s.rank);for(let i=0;i<t.length;i++)t[i]=s.shape[i]*e[i];const o=ne(t,s.dtype);for(let i=0;i<o.values.length;++i){const r=o.indexToLoc(i),n=new Array(s.rank);for(let u=0;u<n.length;u++)n[u]=r[u]%s.shape[u];const a=s.locToIndex(n);o.values[i]=s.values[a]}return o}/**
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
 */const st=(s,e)=>{const t=e.value-s.value;return t===0?s.index-e.index:t};function xi(s,e,t=0,o=s.length-1){for(;o>t;){if(o-t>600){const a=o-t+1,u=e-t+1,l=Math.log(a),d=.5*Math.exp(2*l/3),c=.5*Math.sqrt(l*d*(a-d)/a)*Math.sign(u-a/2),h=Math.max(t,Math.floor(e-u*d/a+c)),p=Math.min(o,Math.floor(e+(a-u)*d/a+c));xi(s,e,h,p)}const i=s[e];let r=t,n=o;for(Je(s,t,e),st(s[o],i)>0&&Je(s,t,o);r<n;){for(Je(s,r,n),r++,n--;st(s[r],i)<0;)r=r+1;for(;st(s[n],i)>0;)n=n-1}st(s[t],i)===0?Je(s,t,n):(n=n+1,Je(s,n,o)),n<=e&&(t=n+1),e<=n&&(o=n-1)}}function Xu(s,e,t,o,i){const r=e[e.length-1],[n,a]=[s.length/r,r],u=ze(t,n*o),l=ze("int32",n*o);for(let c=0;c<n;c++){const h=c*a,p=s.subarray(h,h+a);let f=new Array(p.length);p.forEach((y,w)=>f[w]={value:y,index:w}),o<f.length&&(xi(f,o),f=f.slice(0,o)),i&&f.sort(st);const m=c*o,g=u.subarray(m,m+o),x=l.subarray(m,m+o);for(let y=0;y<o;y++)g[y]=f[y].value,x[y]=f[y].index}const d=e.slice();return d[d.length-1]=o,[ne(d,t,u),ne(d,"int32",l)]}/**
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
 */var Ku=Object.freeze({__proto__:null,addImpl:Cu,castImpl:wu,ceilImpl:bu,concatImpl:cu,equalImpl:Su,expImpl:vu,expm1Impl:ku,floorDivImpl:Pu,floorImpl:Iu,gatherNdImpl:Ru,gatherV2Impl:$u,greaterEqualImpl:Nu,greaterImpl:Du,lessEqualImpl:Au,lessImpl:zu,logImpl:Fu,maxImpl:Mu,maximumImpl:Tu,minimumImpl:Lu,multiplyImpl:gi,negImpl:Eu,notEqualImpl:_u,prodImpl:Ou,rangeImpl:hu,rsqrtImpl:Wu,scatterImpl:Vu,simpleAbsImpl:yu,sliceImpl:pu,stridedSliceImpl:Uu,stringNGramsImpl:fu,stringSplitImpl:mu,stringToHashBucketFastImpl:gu,subImpl:Gu,tileImpl:Hu,topKImpl:Xu,transposeImpl:Bu,uniqueImpl:xu});/**
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
 */const ce=q();ce.registerFlag("WEBGPU_DEFERRED_SUBMIT_BATCH_SIZE",()=>15);ce.registerFlag("WEBGPU_CPU_FORWARD",()=>!0);ce.registerFlag("WEBGPU_MATMUL_PROGRAM_TYPE",()=>-1);ce.registerFlag("WEBGPU_USE_NAIVE_CONV2D_TRANSPOSE",()=>!0);ce.registerFlag("WEBGPU_USE_LOW_POWER_GPU",()=>!1);ce.registerFlag("WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD",()=>1e3);ce.registerFlag("WEBGPU_USE_PROFILE_TOOL",()=>!1);ce.registerFlag("WEBGPU_IMPORT_EXTERNAL_TEXTURE",()=>!0);ce.registerFlag("WEBGPU_USE_NAIVE_CONV2D_DEBUG",()=>!1);ce.registerFlag("WEBGPU_THRESHOLD_TO_INCREASE_WORKGROUPS_FOR_MATMUL",()=>-1);ce.registerFlag("WEBGPU_CONV_SEPARATE_IM2COL_SHADER",()=>!1);ce.registerFlag("WEBGPU_PRINT_SHADER",()=>"");ce.registerFlag("WEBGPU_ENGINE_COMPILE_ONLY",()=>!1);/**
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
 */class qu{constructor(e){e&&(this.vendor=e.vendor,this.architecture=e.architecture,this.intelGPUGeneration=this.getIntelGPUGeneration())}getIntelGPUGeneration(){if(this.isIntel()){if(this.architecture.startsWith("gen"))return Number(this.architecture.match(/\d+/));if(this.architecture.startsWith("xe"))return 12}return 0}isIntel(){return this.vendor==="intel"}}/**
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
 */class Yu{constructor(e){this.device=e,this.numUsedBuffers=0,this.numFreeBuffers=0,this.freeBuffers=new Map,this.usedBuffers=new Map,this.numBytesUsed=0,this.numBytesAllocated=0}acquireBuffer(e,t,o=!1,i=!0){let r;const n=ms(e,t);return i?(this.freeBuffers.has(n)||this.freeBuffers.set(n,[]),this.freeBuffers.get(n).length>0?(r=this.freeBuffers.get(n).pop(),this.numFreeBuffers--):(r=this.device.createBuffer({size:e,usage:t,mappedAtCreation:o}),this.numBytesAllocated+=e)):(r=this.device.createBuffer({size:e,usage:t,mappedAtCreation:o}),this.numBytesAllocated+=e),this.usedBuffers.has(n)||this.usedBuffers.set(n,[]),this.usedBuffers.get(n).push(r),this.numUsedBuffers++,this.numBytesUsed+=e,r}releaseBuffer(e,t=!0){if(this.freeBuffers.size===0)return;const o=e.size,i=e.usage,r=ms(o,i),n=this.usedBuffers.get(r),a=n.indexOf(e);if(a<0)throw new Error("Cannot find the buffer in buffer manager");n[a]=n[n.length-1],n.pop(),this.numUsedBuffers--,this.numBytesUsed-=o,t?(this.freeBuffers.get(r).push(e),this.numFreeBuffers++):(e.destroy(),this.numBytesAllocated-=o)}getNumUsedBuffers(){return this.numUsedBuffers}getNumFreeBuffers(){return this.numFreeBuffers}dispose(){this.freeBuffers.forEach((e,t)=>{e.forEach(o=>{o.destroy()})}),this.usedBuffers.forEach((e,t)=>{e.forEach(o=>{o.destroy()})}),this.freeBuffers=new Map,this.usedBuffers=new Map,this.numUsedBuffers=0,this.numFreeBuffers=0,this.numBytesUsed=0,this.numBytesAllocated=0}}function ms(s,e){return`${s}_${e}`}/**
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
 */class ju{constructor(e){this.device=e,this.numUsedTextures=0,this.numFreeTextures=0,this.freeTextures=new Map,this.usedTextures=new Map,this.numBytesUsed=0,this.numBytesAllocated=0}acquireTexture(e,t,o,i){const r=xs(o),n=e*t*r,a=gs(e,t,o,i);if(this.freeTextures.has(a)||this.freeTextures.set(a,[]),this.usedTextures.has(a)||this.usedTextures.set(a,[]),this.numBytesUsed+=n,this.numUsedTextures++,this.freeTextures.get(a).length>0){this.numFreeTextures--;const l=this.freeTextures.get(a).shift();return this.usedTextures.get(a).push(l),l}this.numBytesAllocated+=n;const u=this.device.createTexture({size:[e,t],format:o,usage:i});return this.usedTextures.get(a).push(u),u}releaseTexture(e){if(this.freeTextures.size===0)return;const t=e.width,o=e.height,i=e.format,r=e.usage,n=gs(t,o,i,r);this.freeTextures.has(n)||this.freeTextures.set(n,[]),this.freeTextures.get(n).push(e),this.numFreeTextures++,this.numUsedTextures--;const a=this.usedTextures.get(n),u=a.indexOf(e);if(u<0)throw new Error("Cannot release a texture that was never provided by this texture manager");a.splice(u,1);const l=xs(i),d=t*o*l;this.numBytesUsed-=d}getNumUsedTextures(){return this.numUsedTextures}getNumFreeTextures(){return this.numFreeTextures}dispose(){this.freeTextures.forEach((e,t)=>{e.forEach(o=>{o.destroy()})}),this.usedTextures.forEach((e,t)=>{e.forEach(o=>{o.destroy()})}),this.freeTextures=new Map,this.usedTextures=new Map,this.numUsedTextures=0,this.numFreeTextures=0,this.numBytesUsed=0,this.numBytesAllocated=0}}function gs(s,e,t,o){return`${s}_${e}_${t}_${o}`}function xs(s){if(s==="rgba8unorm")return 16;throw new Error(`${s} is not supported!`)}/**
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
 */function Qu(s,e){if(Math.max(...s)>5)throw new Error("Cannot symbolically compute strides for rank > 6 tensor.");const t=s.length,o="xyzwuv",i=s.map(n=>`${e}.${o[n]}`),r=new Array(t-1);r[t-2]=i[t-1];for(let n=t-3;n>=0;--n)r[n]=`(${r[n+1]} * ${i[n+1]})`;return r}const ke=(s,e,t)=>t==="int32"?`atomicAdd(${s}, bitcast<i32>(${e}));`:`
          {
            var oldValue = 0;
            loop {
              let newValueF32 = bitcast<f32>(oldValue) + (${e});
              let newValue = bitcast<i32>(newValueF32);
              let res = atomicCompareExchangeWeak(${s}, oldValue, newValue);
              if res.exchanged {
                break;
              }
              oldValue = res.old_value;
            }
          }`;/**
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
 */var He;(function(s){s[s.FROM_PIXELS=0]="FROM_PIXELS",s[s.DRAW=1]="DRAW"})(He||(He={}));const Zu=(s,e,t,o,i)=>{const r={dtype:o.dtype,shape:o.shape},n=el(t,r,e),a=s.createShaderModule({code:n,label:e.constructor.name});let u=q().get("WEBGPU_PRINT_SHADER");if(u!==""){u=u.toLowerCase();const l=u.split(",");(u==="all"||l.some(d=>e.shaderKey.toLowerCase().includes(d)))&&(console.group(e.shaderKey),console.debug(n),console.groupEnd())}return i?s.createComputePipelineAsync({compute:{module:a,entryPoint:"_start"},label:e.constructor.name,layout:"auto"}):s.createComputePipeline({compute:{module:a,entryPoint:"_start"},label:e.constructor.name,layout:"auto"})},_=(s,e="f32")=>{switch(s){case 1:return`${e}`;case 2:return`vec2<${e}>`;case 3:return`vec3<${e}>`;case 4:return`vec4<${e}>`;default:throw new Error(`${s}-component ${e} is not supported.`)}};function K(s){if(s<=1)return"i32";if(s===2)return"vec2<i32>";if(s===3)return"vec3<i32>";if(s===4)return"vec4<i32>";if(s===5)return"vec5";if(s===6)return"vec6";throw Error(`GPU for rank ${s} is not yet supported`)}function ye(s){if(s===0)return"x";if(s===1)return"y";if(s===2)return"z";if(s===3)return"w";if(s===4)return"u";if(s===5)return"v";throw Error(`Index ${s} is not yet supported`)}function R(...s){let e;switch(s.length){case 0:e=`
        fn main()
      `;break;case 1:e=`
        fn main(${s[0]} : i32)
      `;break;default:throw Error("Unreachable")}return e}function ys(s,e){let t;return t=`
     ${Ju(e)}
      fn _start(@builtin(local_invocation_id) LocalId : vec3<u32>,
                @builtin(global_invocation_id) GlobalId : vec3<u32>,
                @builtin(local_invocation_index) LocalIndex: u32,
                @builtin(workgroup_id) WorkgroupId : vec3<u32>,
                @builtin(num_workgroups) NumWorkgroups : vec3<u32>) {
        localId = LocalId;
        localIndex = LocalIndex;
        globalId = GlobalId;
        numWorkgroups = NumWorkgroups;
        workgroupId = WorkgroupId;
        ${s?"main(getGlobalIndex());":"main();"};
      }
    `,t}function Ju(s){return`
  @compute @workgroup_size(${s.workgroupSize[0]}, ${s.workgroupSize[1]}, ${s.workgroupSize[2]})
`}function el(s,e,t){const o=[],i=t.workgroupSize[0]*t.workgroupSize[1]*t.workgroupSize[2];if(t.outputComponent=t.outputComponent?t.outputComponent:1,o.push(`

      var<private> localId: vec3<u32>;
      var<private> localIndex: u32;
      var<private> globalId: vec3<u32>;
      var<private> numWorkgroups: vec3<u32>;
      var<private> workgroupId: vec3<u32>;

      // Only used when the y/z dimension of workgroup size is 1.
      fn getGlobalIndex() -> i32 {
        ${yi(t)?"  return i32(globalId.x);":`  return i32((workgroupId.z * numWorkgroups.x * numWorkgroups.y +
                workgroupId.y * numWorkgroups.x + workgroupId.x) * ${i}u +
                localIndex);
        `}
      }
    `),t.pixelsOpType!=null){const f=t.pixelsOpType===He.FROM_PIXELS?`@group(0) @binding(0) var<storage, read_write> result: array<${Pe(e.dtype,t.outputComponent)}>;`:`@group(0) @binding(1) var<storage, read> inBuf : array<${Pe(s[0].dtype,t.outputComponent)}>;`,m=e.shape.length===3?"vec2<i32>":"i32";o.push(`
        struct Uniform {
          outShapeStrides : ${m},
          size            : i32,
          numChannels     : i32,
          alpha           : f32,
        };

        ${f}
        @group(0) @binding(2) var<uniform> uniforms: Uniform;
      `);const g=Cs(t);return[ws,o.join(`
`),xt(e.shape),t.getUserCode(),ys(g,t)].join(`
`)}let r,n,a="struct Uniforms { NAN : f32, INFINITY : f32, ";t.variableNames.forEach((f,m)=>{const g=K(s[m].shape.length);a+=`${f.charAt(0).toLowerCase()+f.slice(1)}Shape : ${g}, `,r=s[m].shape.length-1,n=K(r),a+=`${f.charAt(0).toLowerCase()+f.slice(1)}ShapeStrides: ${n}, `});const u=K(e.shape.length);a+=`outShape : ${u}, `,r=e.shape.length-1,n=K(r),a+=`
         outShapeStrides: ${n}, `,t.size&&(a+="size : i32, "),t.uniforms&&(a+=t.uniforms),a+="};",a=ll(a),o.push(a),t.atomic?o.push(`
      @group(0) @binding(0) var<storage, read_write> result: array<atomic<i32>>;
    `):o.push(`
      @group(0) @binding(0) var<storage, read_write> result: array<${Pe(e.dtype,t.outputComponent)}>;
    `),t.variableNames.forEach((f,m)=>{o.push(`
      @group(0) @binding(${1+m}) var<storage, read> ${f}: array<${t.variableComponents?Pe(s[m].dtype,t.variableComponents[m]):Pe(s[m].dtype,t.outputComponent)}>;
        `)}),a!==""&&o.push(`
      @group(0) @binding(${1+t.variableNames.length}) var<uniform> uniforms: Uniforms;
      `);const l=nl(e.shape,t.dispatchLayout),d=[ws,o.join(`
`)+sl,xt(e.shape),l,al(e.shape.length)];t.atomic||d.push(ul(e.shape,e.dtype,t.outputComponent)),t.variableNames.forEach((f,m)=>{d.push(`${xt(s[m].shape,f)}`)});const c=s.map((f,m)=>rl(f,e.shape,t.variableComponents?t.variableComponents[m]:t.outputComponent,t.dispatchLayout.x.length===e.shape.length)).join(`
`);d.push(c),d.push(t.getUserCode());const h=Cs(t);return d.push(ys(h,t)),d.join(`
`)}function tl(s,e,t){let o=s.shaderKey;if(s.pixelsOpType!=null)return o;const i=[],r=[];e.forEach(d=>{i.push(d.shape),r.push(d.dtype)}),i.push(t.shape),r.push(t.dtype);const n=e.map(d=>yt(d.shape,t.shape)),a=e.map(d=>Ke(d.shape,t.shape)).join("_"),u=n.map(d=>d.join("_")).join(";"),l=yi(s)?"flatDispatch":"";return o+="_"+(s.workgroupSize?s.workgroupSize.join(","):"")+i.map(d=>d.length).join(",")+r.join(",")+s.variableNames.join(",")+u+a+l,o}const ws=`
  struct vec5 {x: i32, y: i32, z: i32, w: i32, u: i32};
  struct vec6 {x: i32, y: i32, z: i32, w: i32, u: i32, v: i32};

  // Checks whether coordinates lie within the bounds of the shape.
  fn coordsInBounds2D(coord : vec2<i32>, shape : vec2<i32>) -> bool {
    return all(coord >= vec2<i32>(0)) && all(coord < shape);
  }
  fn coordsInBounds3D(coord : vec3<i32>, shape : vec3<i32>) -> bool {
    return all(coord >= vec3<i32>(0)) && all(coord < shape);
  }
  fn coordsInBounds4D(coord : vec4<i32>, shape : vec4<i32>) -> bool {
    return all(coord >= vec4<i32>(0)) && all(coord < shape);
  }

  fn getIndexFromCoords1D(coord : i32, shape : i32) -> i32 {
    return coord;
  }
  fn getIndexFromCoords2D(coords : vec2<i32>, shape : vec2<i32>) -> i32 {
    return dot(coords, vec2<i32>(shape.y, 1));
  }
  fn getIndexFromCoords3D(coords : vec3<i32>, shape : vec3<i32>) -> i32 {
    return dot(coords, vec3<i32>(shape.y * shape.z, shape.z, 1));
  }
  fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
    return dot(coords, vec4<i32>(
        shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
  }
  fn getIndexFromCoords5D(coords : vec5, shape : vec5) -> i32 {
    let shapeStrides: vec5 = vec5(shape.y * shape.z * shape.w * shape.u, shape.z * shape.w * shape.u, shape.w * shape.u, shape.u, 1);
    return coords.x*shapeStrides.x + coords.y*shapeStrides.y + coords.z*shapeStrides.z + coords.w*shapeStrides.w + coords.u*shapeStrides.u;
  }
  fn getIndexFromCoords6D(coords : vec6, shape : vec6) -> i32 {
    let shapeStrides: vec6 = vec6(shape.y * shape.z * shape.w * shape.u * shape.v, shape.z * shape.w * shape.u * shape.v, shape.w * shape.u * shape.v, shape.u * shape.v, shape.v, 1);
    return coords.x*shapeStrides.x + coords.y*shapeStrides.y + coords.z*shapeStrides.z + coords.w*shapeStrides.w + coords.u*shapeStrides.u + coords.v*shapeStrides.v;
  }

  // NaN defination in IEEE 754-1985 is :
  //   - sign = either 0 or 1.
  //   - biased exponent = all 1 bits.
  //   - fraction = anything except all 0 bits (since all 0 bits represents infinity).
  // https://en.wikipedia.org/wiki/IEEE_754-1985#Representation_of_non-numbers
  fn isnan(val: f32) -> bool {
    let floatToUint: u32 = bitcast<u32>(val);
    return (floatToUint & 0x7fffffffu) > 0x7f800000u;
  }
  fn isnanVec4(val : vec4<f32>) -> vec4<bool> {
    let floatToUint: vec4<u32> = bitcast<vec4<u32>>(val);
    return (floatToUint & vec4<u32>(0x7fffffffu)) > vec4<u32>(0x7f800000u);
  }
`,sl=`
  fn isinf(val: f32) -> bool {
    return abs(val) == uniforms.INFINITY;
  }
`;function xt(s,e=""){const t=s.length,o=e!==""?`get${e.charAt(0).toUpperCase()+e.slice(1)}CoordsFromIndex`:"getCoordsFromIndex",i=e!==""?`${e.charAt(0).toLowerCase()+e.slice(1)}ShapeStrides`:"outShapeStrides";if(t<=1)return`fn ${o}(index : i32) -> i32 { return index; }`;const r=pe(s),n=K(t),a=[];for(let l=0;l<t;l++)a.push(`d${l}`);if(r.length===1)return`    fn ${o}(index : i32) -> vec2<i32> {
      let d0 = index / uniforms.${i}; let d1 = index - d0 * uniforms.${i};
      return vec2<i32>(d0, d1);
    }`;let u;return u="var index2 = index;"+r.map((l,d)=>{const c=`let ${a[d]} = index2 / uniforms.${i}.${ye(d)}`,h=d===r.length-1?`let ${a[d+1]} = index2 - ${a[d]} * uniforms.${i}.${ye(d)}`:`index2 = index2 - ${a[d]} * uniforms.${i}.${ye(d)}`;return`${c}; ${h};`}).join(""),`
    fn ${o}(index : i32) -> ${n} {
      ${u}
      return ${n}(${a.join(",")});
    }
  `}function il(s,e){const t=s.name,o=s.shape.length,i=K(o),r="get"+t.charAt(0).toUpperCase()+t.slice(1),n=["d0","d1","d2","d3","d4","d5"].slice(0,o),a=n.map(d=>`${d} : i32`).join(", ");if(o<1)return`
      fn ${r}() -> ${_(e)} {
        return ${_(e)}(${t}[0]);
      }
    `;const u=`uniforms.${t.charAt(0).toLowerCase()+t.slice(1)}Shape`;let l=`${o}D`;return o===0&&(l="1D"),`
    fn ${r}(${a}) -> ${_(e)} {
      return ${_(e)}(${t}[getIndexFromCoords${l}(${i}(${n.join(",")}),
        ${u})${e===1?"":` / ${e}`}]);
    }
   `}function ol(s,e,t,o){const i=s.name,r=i.charAt(0).toUpperCase()+i.slice(1),n="get"+r+"ByOutput",a=s.shape.length,u=e.length,l=K(u);if(Ke(s.shape,e)&&o)return`
    fn ${n}Index(globalIndex : i32) -> ${_(t)} {
      return ${_(t)}(${i}[globalIndex]);
    }

    fn ${n}Coords(coords : ${l}) -> ${_(t)} {
      return ${_(t)}(${i}[${u>1?"getOutputIndexFromCoords(coords)":"coords"}${t===1?"":` / ${t}`}]);
    }
    `;const d=yt(s.shape,e),c=u-a;let h="";if(a===0)return`
    fn ${n}Index(globalIndex : i32) -> ${_(t)}{
      return get${r}();
    }

    fn ${n}Coords(coords : ${l}) -> ${_(t)}{
      return get${r}();
    }
  `;u<2&&d.length>=1?h="coords = 0;":h=d.map(g=>`coords.${ye(g+c)} = 0;`).join(`
`);let p="";if(u<2&&a>0)p="coords";else if(u>1){const g=K(a),x=s.shape.map((y,w)=>`coords.${ye(w+c)}`).join(", ");p=`${g}(${x})`}else p="coords";const f=`uniforms.${i.charAt(0).toLowerCase()+i.slice(1)}Shape`,m=`${a}D`;return`
  fn ${n}Index(globalIndex : i32) -> ${_(t)} {
    var coords = getCoordsFromIndex(globalIndex);
    ${h}
    return ${_(t)}(${i}[getIndexFromCoords${m}(${p}, ${f})${t===1?"":` / ${t}`}]);
  }

  fn ${n}Coords(coordsIn : ${l}) -> ${_(t)} {
    var coords = coordsIn;
    ${h}
    return ${_(t)}(${i}[getIndexFromCoords${m}(${p}, ${f})${t===1?"":` / ${t}`}]);
  }
`}function rl(s,e,t,o){let i=il(s,t);return s.shape.length<=e.length&&(i+=ol(s,e,t,o)),i}function nl(s,e){const{x:t,y:o=[],z:i=[]}=e,r=s.length,n=t.length+o.length+i.length;if(n!==r)return"";if(t.length===r)return`fn getOutputCoords() -> ${K(r)}{
    let globalIndex = getGlobalIndex();
    return getCoordsFromIndex(globalIndex);
  }
  `;let a="";const u=[t,o,i];for(let h=0;h<u.length;h++){const p=u[h];if(p.length!==0)if(p.length===1)a+=`let d${p[0]} = i32(globalId[${h}]);`;else{const f=Qu(p,"uniforms.outShape");a+=`var index${h} = i32(globalId[${h}]);`;for(let m=0;m<f.length;m++)a+=`let d${p[m]} = index${h} / ${f[m]};`,m===f.length-1?a+=`let d${p[m+1]} = index${h} - d${p[m]} * ${f[m]};`:a+=`index${h} = index${h} - d${p[m]} * ${f[m]};`}}const l=[];for(let h=0;h<n;h++)l.push(`d${h}`);const d=K(n);let c=`fn getOutputCoords() -> ${d} {
  ${a}
`;return l.length===0?c+=`return ${d}(0); }`:c+=`return ${d}(${l.join(",")}); }`,c}function al(s){let e="";switch(s){case 0:case 1:e+=`
        fn getOutputIndexFromCoords(coords : i32) -> i32 {
          return coords;
        }
        `;break;case 2:e+=`
        fn getOutputIndexFromCoords(coords : vec2<i32>) -> i32 {
          return dot(coords, vec2<i32>(uniforms.outShapeStrides, 1));
        }
        `;break;case 3:e+=`
        fn getOutputIndexFromCoords(coords : vec3<i32>) -> i32 {
          return dot(coords, vec3<i32>(uniforms.outShapeStrides.x, uniforms.outShapeStrides.y, 1));
        }
        `;break;case 4:e+=`
        fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
          return dot(coords, vec4<i32>(
            uniforms.outShapeStrides.x, uniforms.outShapeStrides.y, uniforms.outShapeStrides.z, 1));
        }
        `;break;case 5:e+=`
        fn getOutputIndexFromCoords(coords : vec5) -> i32 {
          return coords.x * uniforms.outShapeStrides.x +
              coords.y * uniforms.outShapeStrides.y +
              coords.z * uniforms.outShapeStrides.z +
              coords.w * uniforms.outShapeStrides.w +
              coords.u;
        }
        `;break;case 6:e+=`
        fn getOutputIndexFromCoords(coords : vec6) -> i32 {
          return coords.x * uniforms.outShapeStrides.x +
              coords.y * uniforms.outShapeStrides.y +
              coords.z * uniforms.outShapeStrides.z +
              coords.w * uniforms.outShapeStrides.w +
              coords.u * uniforms.outShapeStrides.u +
              coords.v;
        }
        `;break;default:G(!1,()=>`Unsupported ${s}D shape`);break}return e}function yi(s){return s.dispatch[1]===1&&s.dispatch[2]===1}function Pe(s,e=1){if(s==="float32")return _(e,"f32");if(s==="int32"||s==="bool")return _(e,"i32");throw new Error(`type ${s} is not supported.`)}function ul(s,e,t){const o=s.length,i=Pe(e,t);let r=`fn setOutputAtIndex(flatIndex : i32, value : ${_(t)}) {
      result[flatIndex] = ${i}(value);
    }

    fn setOutputAtIndexI32(flatIndex : i32, value : ${_(t,"i32")}) {
      result[flatIndex] = ${i}(value);
    }
    `;if(o>=2){const n=["d0","d1","d2","d3","d4","d5"].slice(0,o),a=K(o);r+=`
      fn setOutputAtCoords(${n.map(u=>`${u} : i32`).join(", ")}, value : ${_(t)}) {
        let flatIndex = getOutputIndexFromCoords(${a}(${n.join(", ")}));
        setOutputAtIndex(flatIndex${t===1?"":` / ${t}`}, value);
      }
      fn setOutputAtCoordsI32(${n.map(u=>`${u} : i32`).join(", ")}, value : ${_(t,"i32")}) {
        let flatIndex = getOutputIndexFromCoords(${a}(${n.join(", ")}));
        setOutputAtIndexI32(flatIndex${t===1?"":` / ${t}`}, value);
      }
    `}return r}function ll(s){const e=/(\w+)\s*:\s*vec(5|6)/g;s=s.replace(e,o=>"@align(16) "+o);const t=/vec(5|6)\s*,\s*(\w+)/g;return s=s.replace(t,(o,i,r)=>`vec${i}, @align(16) ${r}`),s}function Cs(s){return!(s.dispatchLayout.hasOwnProperty("y")&&s.dispatchLayout.y.length!==0||s.dispatchLayout.hasOwnProperty("z")&&s.dispatchLayout.z.length!==0)}/**
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
 */const De=s=>{let e=1;for(let t=0;t<s.length;t++)e*=s[t];return e};function $(s,e,t=[1,1,1],o=[1,1,1]){const[i,r,n]=[Math.ceil(De(s.x.map(a=>e[a]))/(t[0]*o[0])),s.y?Math.ceil(De(s.y.map(a=>e[a]))/(t[1]*o[1])):1,s.z?Math.ceil(De(s.z.map(a=>e[a]))/(t[2]*o[2])):1];return[i,r,n]}function dl(s,e,t,o=!1){const i=[8,8,1],r=[4,4,1];return o||(s<=8&&(r[1]=1),e<=16&&t<=16&&(i[0]=4)),{workgroupSize:i,elementsPerThread:r}}function wi(s,e,t=!1){if(t)return[8,8,1];const o=De(s.x.map(r=>e[r])),i=De(s.y.map(r=>e[r]));return o<=4?[4,16,1]:i<=4?[16,4,1]:[16,16,1]}function Ci(s,e,t=!1){if(t)return[4,4,1];const o=De(s.x.map(r=>e[r])),i=De(s.y.map(r=>e[r]));return o<=4?[1,2,1]:i<=4?[2,1,1]:[2,2,1]}function D(s){return{x:s.map((e,t)=>t)}}function bs(s){if(s==="float32"||s==="int32"||s==="bool"||s==="string")return 4;if(s==="complex64")return 8;throw new Error(`Unknown dtype ${s}`)}function bi(){return!!(typeof globalThis<"u"&&globalThis.navigator&&globalThis.navigator.gpu)}function Si(s,e){Array.isArray(s)||(s=[s]),s.forEach(t=>{t!=null&&G(t.dtype!=="complex64",()=>`${e} does not support complex64 tensors in the WebGPU backend.`)})}var he;(function(s){s[s.MatMulReduceProgram=0]="MatMulReduceProgram",s[s.MatMulSplitKProgram=1]="MatMulSplitKProgram",s[s.MatMulSmallOutputSizeProgram=2]="MatMulSmallOutputSizeProgram",s[s.MatMulPackedProgram=3]="MatMulPackedProgram",s[s.MatMulMax=4]="MatMulMax"})(he||(he={}));/**
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
 */const cl=q().getNumber("WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD"),hl=(s,e)=>{const t=s.limits.maxComputeWorkgroupsPerDimension,o=e.dispatchLayout,i=e.dispatch;if(i.every(n=>n<=t))return i;G(i[0]>t&&o.y===void 0&&o.z===void 0,()=>"Dispatch size exceeds WebGPU limits in Y or Z dimension.");let r=Math.ceil(Math.sqrt(i[0]));return r>t?(r=Math.ceil(Math.cbrt(i[0])),G(r<=t,()=>"Total dispatch size exceeds WebGPU maximum."),[r,r,r]):[r,r,1]};class je extends wo{nextDataId(){return je.nextDataId++}constructor(e,t){if(super(),this.commandQueueOwnedIds=new WeakSet,this.dispatchCountInPass=0,this.disposed=!1,this.downloadWaitMs=0,this.tensorDataPendingDisposal=[],this.queryResolveBuffer=null,this.querySet=null,this.querySetCount=2,this.stagingPendingDisposal=[],this.uniformPendingDisposal=[],this.uploadWaitMs=0,this.hasReadSyncWarned=!1,this.hasTimestampQueryWarned=!1,!bi())throw new Error("WebGPU is not supported on this device");this.pipelineCache={},this.device=e,this.queue=e.queue,this.commandEncoder=null,this.computePassEncoder=null,this.adapterInfo=new qu(t),this.supportTimestampQuery=this.device.features.has("timestamp-query"),this.thresholdToIncreaseWorkgroups=this.adapterInfo.intelGPUGeneration>=12?16:8,this.bufferManager=new Yu(this.device),this.textureManager=new ju(this.device),this.tensorMap=new Co(this,Be()),q().getBool("WEBGPU_USE_PROFILE_TOOL")&&(this.dummyCanvas=document.createElement("canvas"),this.dummyCanvas.width=1,this.dummyCanvas.height=1,this.dummyContext=this.dummyCanvas.getContext("webgpu"),this.dummyContext.configure({device:e,format:"bgra8unorm"}),document.body.appendChild(this.dummyCanvas))}floatPrecision(){return 32}disposeData(e,t=!1){if(!this.tensorMap.has(e))return!0;const o=this.tensorMap.get(e);return t?o.refCount=0:o.refCount--,o.refCount>0?!1:(o.complexTensorInfos!=null&&(this.disposeData(o.complexTensorInfos.real.dataId),this.disposeData(o.complexTensorInfos.imag.dataId)),this.commandQueueOwnedIds.has(e)?(this.tensorDataPendingDisposal.push(e),!0):(this.releaseResource(e),this.tensorMap.delete(e),!0))}memory(){return{numBytesInGPU:this.bufferManager.numBytesUsed,numBytesAllocatedInGPU:this.bufferManager.numBytesAllocated,unreliable:!1}}releaseResource(e){const t=this.tensorMap.get(e);if(!(!t||!t.resource)){if(t.external){t.resource=null;return}t.resource instanceof GPUBuffer?this.bufferManager.releaseBuffer(t.resource):t.resource instanceof GPUTexture&&this.textureManager.releaseTexture(t.resource),t.resource=null}}refCount(e){return this.tensorMap.has(e)?this.tensorMap.get(e).refCount:0}incRef(e){const t=this.tensorMap.get(e);t.refCount++}decRef(e){if(this.tensorMap.has(e)){const t=this.tensorMap.get(e);t.refCount--}}write(e,t,o){if(o==="complex64"&&e!=null)throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");const i={id:this.nextDataId()};return this.tensorMap.set(i,{dtype:o,shape:t,values:e,refCount:1}),i}move(e,t,o,i,r){if(i==="complex64")throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");this.tensorMap.set(e,{dtype:i,shape:o,values:t,refCount:r})}submitQueue(){this.queue.submit([this.commandEncoder.finish()]),this.commandEncoder=null,this.dispatchCountInPass=0,this.commandQueueOwnedIds=new WeakSet,this.tensorDataPendingDisposal.forEach(e=>{this.releaseResource(e),this.tensorMap.delete(e)}),this.uniformPendingDisposal.forEach(e=>this.bufferManager.releaseBuffer(e)),this.stagingPendingDisposal.forEach(e=>this.bufferManager.releaseBuffer(e,!1)),this.tensorDataPendingDisposal=[],this.uniformPendingDisposal=[],this.stagingPendingDisposal=[]}ensureCommandEncoderReady(){this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder())}endComputePassEncoder(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}async checkCompileCompletionAsync(){let e;try{e=await Promise.all(Object.values(this.pipelineCache))}catch(t){throw new Error(t.message)}Object.keys(this.pipelineCache).map((t,o)=>{this.pipelineCache[t]=e[o]})}async getBufferData(e){if(q().getBool("WEBGPU_ENGINE_COMPILE_ONLY"))return console.warn("The data may be invalid since WEBGPU_ENGINE_COMPILE_ONLY is true, this can only be called when WEBGPU_ENGINE_COMPILE_ONLY is false"),null;const t=e.size,o=this.bufferManager.acquireBuffer(t,GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ);this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(e,0,o,0,t),this.submitQueue(),await o.mapAsync(GPUMapMode.READ);const i=o.getMappedRange().slice(0);return o.unmap(),o!=null&&this.bufferManager.releaseBuffer(o),q().getBool("WEBGPU_USE_PROFILE_TOOL")&&(G(this.dummyContext!==void 0,()=>"Fail to get context for profiling tool"),this.dummyContext.getCurrentTexture()),i}convertAndCacheOnCPU(e,t){const o=this.tensorMap.get(e);return o.values=t,o.values}readSync(e){const t=this.tensorMap.get(e),{values:o,complexTensorInfos:i}=t;if(o!=null||t.dtype==="string")return o;if(t.dtype==="complex64"){const m=this.readSync(i.real.dataId),g=this.readSync(i.imag.dataId),x=Nt(ds(m,g).buffer,"float32");return this.convertAndCacheOnCPU(e,x),x}this.hasReadSyncWarned||(this.hasReadSyncWarned=!0,console.warn("The performance of synchronously reading data from GPU to CPU is poor on the webgpu backend, please use asynchronous APIs instead."));const r=["opaque","premultiplied"],n=t.resource,a=n.size;G(a%4===0,()=>"Because there is 4 bytes for one pixel, buffer size must be multiple of 4.");const u=a/4,l=new ArrayBuffer(a),d=256,c=256,h=r.map(m=>new OffscreenCanvas(d,c)),p=new OffscreenCanvas(d,c);this.endComputePassEncoder(),h.map((m,g)=>{const x=m.getContext("webgpu");return x.configure({device:this.device,format:"bgra8unorm",usage:GPUTextureUsage.COPY_DST,alphaMode:r[g]}),x.getCurrentTexture()}).map((m,g)=>{const x=d*4,y=(I,k,N)=>{this.ensureCommandEncoderReady(),this.commandEncoder.copyBufferToTexture({buffer:n,bytesPerRow:x,offset:N},{texture:m},{width:I,height:k}),this.submitQueue();const A=p.getContext("2d",{willReadFrequently:!0});A.clearRect(0,0,I,k),A.drawImage(h[g],0,0);const L=A.getImageData(0,0,I,k).data,F=r[g],E=new Uint8ClampedArray(l,N,I*k*4);for(let B=0;B<E.length;B+=4)if(F==="premultiplied")E[B+3]=L[B+3];else{const V=L[B];E[B]=L[B+2],E[B+1]=L[B+1],E[B+2]=V}},w=Math.floor(u/(d*c));let C=d,b=c,S=0;for(let I=0;I<w;I++)y(C,b,S),S+=d*c*4;const v=u%(d*c);b=Math.floor(v/d),b>0&&(y(C,b,S),S+=b*(d*4)),C=v%d,C>0&&y(C,1,S)});const f=Nt(l,t.dtype);return this.convertAndCacheOnCPU(e,f),f}async read(e){if(!this.tensorMap.has(e))throw new Error(`Tensor ${e} was not registered!`);const t=this.tensorMap.get(e),{values:o}=t;if(o!=null)return o;let i;if(t.dtype==="complex64"){const r=await Promise.all([this.read(t.complexTensorInfos.real.dataId),this.read(t.complexTensorInfos.imag.dataId)]),n=r[0],a=r[1];i=ds(n,a)}else{const r=await this.getBufferData(t.resource);i=Nt(r,t.dtype)}return this.convertAndCacheOnCPU(e,i),i}copyBuffer(e){const t=e.size,o=e.usage,i=this.bufferManager.acquireBuffer(t,o);return this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(e,0,i,0,t),this.submitQueue(),i}createTensorFromGPUData(e,t,o){let i=e.buffer;if(o==="complex64")throw new Error("Cannot write to a complex64 dtype. ");const r={id:this.nextDataId()};this.tensorMap.set(r,{dtype:o,shape:t,values:null,refCount:1,external:e.zeroCopy});const n=this.tensorMap.get(r),a=bs(n.dtype)*M(n.shape);if(e.buffer.size<a)throw new Error(`GPUBuffer size(${e.buffer.size}) is smaller than tensor size(${a})!`);if((e.buffer.usage&(GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC))!==(GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC))throw new Error("GPUBuffer.usage should include GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC!");return e.zeroCopy!==!0&&(i=this.copyBuffer(i)),n.resource=i,Be().makeTensorFromDataId(r,t,o,this)}readToGPU(e){const t=this.tensorMap.get(e),{values:o,dtype:i,shape:r,resource:n}=t;if(i==="complex64")throw new Error("Does not support reading buffer for complex64 dtype.");if(n==null)throw o!=null?new Error("Data is not on GPU but on CPU."):new Error("There is no data on GPU or CPU.");const a=n,u=a.size,l=a.usage,d=this.bufferManager.acquireBuffer(u,l);this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(n,0,d,0,u),this.submitQueue();const c=this.makeTensorInfo(r,i),h=Be().makeTensorFromTensorInfo(c),p=this.tensorMap.get(c.dataId);return p.resource=d,{tensorRef:h,buffer:d}}bufferSync(e){const t=this.readSync(e.dataId);if(e.dtype==="string")try{const o=t.map(i=>Qt(i));return ne(e.shape,e.dtype,o)}catch{throw new Error("Failed to decode encoded string bytes into utf-8")}return ne(e.shape,e.dtype,t)}async time(e){!this.supportTimestampQuery&&!this.hasTimestampQueryWarned&&(console.warn("This device doesn't support timestamp-query extension. Start Chrome browser with flag --enable-dawn-features=allow_unsafe_apis to try it again. Otherwise, zero will be shown for the kernel time when profiling mode is enabled."),this.hasTimestampQueryWarned=!0);const t=this.activeTimers,o=[];let i=!1;this.programTimersStack==null?(this.programTimersStack=o,i=!0):this.activeTimers.push(o),this.activeTimers=o,e();const r=cs(this.activeTimers.map(l=>l.query)).filter(l=>l!=null),n=cs(this.activeTimers.map(l=>l.name)).filter(l=>l!=null);this.activeTimers=t,i&&(this.programTimersStack=null);const a={uploadWaitMs:this.uploadWaitMs,downloadWaitMs:this.downloadWaitMs,kernelMs:null,wallMs:null},u=await Promise.all(r);return a.kernelMs=bo(u),a.getExtraProfileInfo=()=>u.map((l,d)=>({name:n[d],ms:l})).map(l=>`${l.name}: ${l.ms}`).join(", "),this.uploadWaitMs=0,this.downloadWaitMs=0,a}makeTensorInfo(e,t,o){return t==="string"&&o!=null&&o.length>0&&So(o[0])&&(o=o.map(r=>vo(r))),{dataId:this.write(o,e,t),shape:e,dtype:t}}tensorToBinding(e){if(!e)return null;const o=this.tensorMap.get(e.dataId).resource;return o instanceof GPUBuffer?{buffer:o}:o instanceof GPUTexture?o.createView():o}uploadToGPU(e){const t=this.tensorMap.get(e);if(t.resource!=null)return;const o=bs(t.dtype)*M(t.shape);let i;const r=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(t.values){if(i=this.bufferManager.acquireBuffer(o,r,!0),i.mapState==="unmapped"){const n=this.bufferManager.acquireBuffer(o,GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC,!0,!1),a=n.getMappedRange();t.dtype==="int32"||t.dtype==="bool"?new Int32Array(a).set(t.values):new Float32Array(a).set(t.values),n.unmap(),this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(n,0,i,0,o),this.stagingPendingDisposal.push(n)}else{const n=i.getMappedRange();t.dtype==="int32"||t.dtype==="bool"?new Int32Array(n).set(t.values):new Float32Array(n).set(t.values),i.unmap()}t.values=null}else i=this.bufferManager.acquireBuffer(o,r);t.resource=i}makeUniforms(e){let t=0,o=0;const i=[];let r=1;e.forEach(u=>{u.data.length===0&&(u.data=[1]);let l;switch(u.data.length){case 1:l=4;break;case 2:l=8;break;case 3:l=16;break;case 4:l=16;break;case 5:l=16;break;case 6:l=16;break;default:G(!1,()=>`Unsupported ${u.data.length}D shape`)}(o===5||o===6)&&(l=16),l>r&&(r=l),t=Math.ceil(t/l)*l,o=u.data.length,i.push(t),t+=u.data.length*4}),t=Math.ceil(t/r)*r;const n=new ArrayBuffer(t);e.forEach((u,l)=>{const d=i[l];u.type==="int32"?new Int32Array(n,d,u.data.length).set(u.data):u.type==="uint32"?new Uint32Array(n,d,u.data.length).set(u.data):new Float32Array(n,d,u.data.length).set(u.data)});const a=this.bufferManager.acquireBuffer(t,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);return this.queue.writeBuffer(a,0,n,0,t),this.uniformPendingDisposal.push(a),{offset:0,size:t,buffer:a}}runWebGPUProgram(e,t,o,i,r){if(r||(r=this.makeTensorInfo(e.outputShape,o)),M(r.shape)===0)return this.tensorMap.get(r.dataId).values=ze(r.dtype,0),r;this.uploadToGPU(r.dataId),e.dispatch=hl(this.device,e);const n=t.map((u,l)=>{if(u.dtype==="complex64")throw new Error("GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.");return this.uploadToGPU(u.dataId),{dtype:this.tensorMap.get(u.dataId).dtype,shape:u.shape,name:e.variableNames[l]}});e.shaderKey=tl(e,n,r);const a=q().getBool("WEBGPU_ENGINE_COMPILE_ONLY");return e.shaderKey in this.pipelineCache||(this.pipelineCache[e.shaderKey]=Zu(this.device,e,n,r,a)),e.pipeline=this.pipelineCache[e.shaderKey],a||this.recordAndSubmit(e,r,t,i),r}recordAndSubmit(e,t,o,i){if(e.pipeline instanceof Promise)throw new Error("Please call checkCompileCompletionAsync to ensure parallel compilation is done!");let r=[],n=[];const a="int32";if(e.pixelsOpType==null){r.push({type:"float32",data:[NaN]},{type:"float32",data:[1/0]}),n=o.concat(t).map(p=>p.shape);const h="int32";n.map(p=>{r.push({type:h,data:p});const f=pe(p);r.push({type:h,data:f})})}else{const h=pe(t.shape);r.push({type:a,data:h})}if(e.size){const h=M(e.outputShape);r.push({type:a,data:[e.outputComponent?h/e.outputComponent:h]})}i&&(r=[...r,...i]);const u=[this.tensorToBinding(t),...o.map(h=>this.tensorToBinding(h)),this.makeUniforms(r)];o.forEach(h=>{this.commandQueueOwnedIds.add(h.dataId)}),this.commandQueueOwnedIds.add(t.dataId);const l=this.device.createBindGroup({layout:e.pipeline.getBindGroupLayout(0),entries:u.map((h,p)=>({binding:p,resource:h}))}),d=this.activeTimers!=null;this.ensureCommandEncoderReady();const c={};d&&this.supportTimestampQuery?(this.endComputePassEncoder(),this.querySet==null&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.querySetCount})),c.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1},this.computePassEncoder=this.commandEncoder.beginComputePass(c)):this.computePassEncoder||(this.computePassEncoder=this.commandEncoder.beginComputePass(c)),this.computePassEncoder.setPipeline(e.pipeline),this.computePassEncoder.setBindGroup(0,l),this.computePassEncoder.dispatchWorkgroups(e.dispatch[0],e.dispatch[1],e.dispatch[2]),this.dispatchCountInPass++,(d||q().get("WEBGPU_DEFERRED_SUBMIT_BATCH_SIZE")<=this.dispatchCountInPass||e.pixelsOpType===He.DRAW)&&(this.endComputePassEncoder(),d?this.activeTimers.push({name:e.constructor.name,query:this.getQueryTime()}):this.submitQueue())}async getQueryTime(){if(!this.supportTimestampQuery)return 0;this.queryResolveBuffer==null&&(this.queryResolveBuffer=this.bufferManager.acquireBuffer(this.querySetCount*8,GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST|GPUBufferUsage.QUERY_RESOLVE)),this.commandEncoder.resolveQuerySet(this.querySet,0,this.querySetCount,this.queryResolveBuffer,0);const e=this.bufferManager.acquireBuffer(this.querySetCount*8,GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST);this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.querySetCount*8),this.submitQueue(),await e.mapAsync(GPUMapMode.READ);const t=new BigUint64Array(e.getMappedRange()),o=Number(t[1]-t[0])/1e6;return e.unmap(),this.bufferManager.releaseBuffer(e),o}shouldExecuteOnCPU(e,t=cl){return q().getBool("WEBGPU_CPU_FORWARD")&&e.every(o=>this.tensorMap.get(o.dataId).resource==null&&M(o.shape)<t)}numDataIds(){return this.tensorMap.numDataIds()-this.tensorDataPendingDisposal.length}dispose(){this.disposed||(this.querySet!=null&&this.querySet.destroy(),this.bufferManager.dispose(),this.textureManager.dispose(),this.disposed=!0)}}je.nextDataId=0;/**
 * @license
 * Copyright 2022 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */bi()&&ko("webgpu",async()=>{const s={powerPreference:q().get("WEBGPU_USE_LOW_POWER_GPU")?"low-power":"high-performance"},e=await navigator.gpu.requestAdapter(s),t={},o=[];e.features.has("timestamp-query")&&o.push("timestamp-query"),e.features.has("bgra8unorm-storage")&&o.push(["bgra8unorm-storage"]),t.requiredFeatures=o;const i=e.limits;t.requiredLimits={maxComputeWorkgroupStorageSize:i.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:i.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:i.maxStorageBufferBindingSize,maxBufferSize:i.maxBufferSize,maxComputeWorkgroupSizeX:i.maxComputeWorkgroupSizeX,maxComputeInvocationsPerWorkgroup:i.maxComputeInvocationsPerWorkgroup};const r=await e.requestDevice(t),n="info"in e?e.info:"requestAdapterInfo"in e?await e.requestAdapterInfo():void 0;return new je(r,n)},3);/**
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
 */var T;(function(s){s[s.ADD=0]="ADD",s[s.ATAN2=1]="ATAN2",s[s.COMPLEX_MULTIPLY_IMAG=2]="COMPLEX_MULTIPLY_IMAG",s[s.COMPLEX_MULTIPLY_REAL=3]="COMPLEX_MULTIPLY_REAL",s[s.DIV=4]="DIV",s[s.ELU_DER=5]="ELU_DER",s[s.EQUAL=6]="EQUAL",s[s.FLOOR_DIV=7]="FLOOR_DIV",s[s.GREATER=8]="GREATER",s[s.GREATER_EQUAL=9]="GREATER_EQUAL",s[s.LESS=10]="LESS",s[s.LESS_EQUAL=11]="LESS_EQUAL",s[s.LOGICAL_AND=12]="LOGICAL_AND",s[s.LOGICAL_OR=13]="LOGICAL_OR",s[s.MAX=14]="MAX",s[s.MIN=15]="MIN",s[s.MOD=16]="MOD",s[s.MUL=17]="MUL",s[s.NOT_EQUAL=18]="NOT_EQUAL",s[s.POW=19]="POW",s[s.PRELU=20]="PRELU",s[s.SQUARED_DIFFERENCE=21]="SQUARED_DIFFERENCE",s[s.SUB=22]="SUB"})(T||(T={}));const pl="let resultTemp = a + b;",fl="let resultTemp = atan2(a, b);",ml="let resultTemp = areal * breal - aimag * bimag;",gl="let resultTemp = areal * bimag + aimag * breal;",xl="let resultTemp = a / b;",yl="let resultTemp = select(a * (b + 1.0), a, b >= b - b);",wl=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a == b);
`,Cl=`
  let remainder =
      select(a % b, round(a % b), (round(a) == a) & (round(b) == b));
  let quotient = (a - remainder) / b;
  let resultTemp =
      round(select(quotient, quotient - 1, sign(remainder) == -sign(b)));
`,bl=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a > b);
`,Sl=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a >= b);
`,vl=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a < b);
`,kl=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a <= b);
`,Il="return f32(a >= 1.0 && b >= 1.0);",Pl=`return (vec4<f32>(a >= vec4<f32>(1.0)) *
  vec4<f32>(b >= vec4<f32>(1.0)));`,Rl="return f32(a >= 1.0 || b >= 1.0);",$l=`return min(vec4<f32>(a >= vec4<f32>(1.0)) +
  vec4<f32>(b >= vec4<f32>(1.0)), vec4<f32>(1.0));`,Dl="let resultTemp = max(a, b);",Nl="let resultTemp = min(a, b);",zl=`
  let isNaN = b == 0.;
  var resultTemp = a % b;
  resultTemp = select((resultTemp + b) % b, resultTemp,
      (a < 0. && b < 0.) || (a >= 0. && b > 0.));
`,Al=`
  let isNaN = !vec4<bool>(b);
  var resultTemp = vec4<f32>(a % b);
  if (!((a[0] < 0. && b[0] < 0.) || (a[0] >= 0. && b[0] > 0.))) {
    resultTemp[0] = (resultTemp[0] + b[0]) % b[0];
  }
  if (!((a[1] < 0. && b[1] < 0.) || (a[1] >= 0. && b[1] > 0.))) {
    resultTemp[1] = (resultTemp[1] + b[1]) % b[1];
  }
  if (!((a[2] < 0. && b[2] < 0.) || (a[2] >= 0. && b[2] > 0.))) {
    resultTemp[2] = (resultTemp[2] + b[2]) % b[2];
  }
  if (!((a[3] < 0. && b[3] < 0.) || (a[3] >= 0. && b[3] > 0.))) {
    resultTemp[3] = (resultTemp[3] + b[3]) % b[3];
  }
`,Fl="let resultTemp = a * b;",Ml=`
  var resultTemp = f32(a != b);
  let valueForNaN = 1.0;
`,Tl=`
  var resultTemp = vec4<f32>(a != b);
  let valueForNaN = 1.0;
`,Ll=`
  let isNaN = a < 0.0 && floor(b) < b;
  if (b == 0.0) {
    return 1.0;
  }
  var resultTemp = select(sign(a) * pow(abs(a), b), pow(abs(a), b),
      round(abs(b) % 2.0) != 1.0);
`,El=`
  let isModRound1Bool = vec4<i32>(round(abs(b) % vec4<f32>(2.0))) == vec4<i32>(1);
  let isModRound1 = vec4<f32>(isModRound1Bool);
  let multiplier = sign(a) * isModRound1 + (vec4<f32>(1.0) - isModRound1);
  var resultTemp = multiplier * pow(abs(a), b);

  // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS
  let isExpZero = b == vec4<f32>(0.0);
  if (isExpZero.r) {
    resultTemp.r = 1.0;
  }
  if (isExpZero.g) {
    resultTemp.g = 1.0;
  }
  if (isExpZero.b) {
    resultTemp.b = 1.0;
  }
  if (isExpZero.a) {
    resultTemp.a = 1.0;
  }
  let isNaN = (a < vec4<f32>(0.0)) & (floor(b) < b);
`,_l="if (a < 0.0) { return b * a; }  return a;",Bl=`
  let aLessThanZero = vec4<f32>(a < vec4<f32>(0.0));
  return (aLessThanZero * (b * a)) + ((vec4<f32>(1.0) - aLessThanZero) * a);
`,Ol="let resultTemp = (a - b) * (a - b);",Wl="let resultTemp = a - b;";function os(s,e){let t;do{switch(s){case T.ATAN2:t=fl;break;case T.MAX:t=Dl;break;case T.MIN:t=Nl;break;case T.MOD:t=e?Al:zl;break;case T.NOT_EQUAL:t=e?Tl:Ml;break;case T.POW:t=e?El:Ll;break;default:continue}let o,i,r;return e?(o="isnanVec4",i="vec4<f32>",r="vec4<bool>"):(o="isnan",i="f32",r="bool"),`
      let aIsNaN = ${o}(a);
      let aPostLegalization = select(a, ${i}(42), aIsNaN);
      let bIsNaN = ${o}(b);
      let bPostLegalization = select(b, ${i}(42), bIsNaN);
      let isNaN = false;
      let valueForNaN = uniforms.NAN;
      {
        let a = aPostLegalization;
        let b = bPostLegalization;
        ${t}
        return select(
            resultTemp, ${i}(valueForNaN),
            ${r}(isNaN) | aIsNaN | bIsNaN);
      }
    `}while(!1);switch(s){case T.ADD:t=pl;break;case T.COMPLEX_MULTIPLY_IMAG:t=gl;break;case T.COMPLEX_MULTIPLY_REAL:t=ml;break;case T.DIV:t=xl;break;case T.ELU_DER:t=yl;break;case T.EQUAL:t=wl;break;case T.FLOOR_DIV:t=Cl;break;case T.GREATER:t=bl;break;case T.GREATER_EQUAL:t=Sl;break;case T.LESS:t=vl;break;case T.LESS_EQUAL:t=kl;break;case T.LOGICAL_AND:return e?Pl:Il;case T.LOGICAL_OR:return e?$l:Rl;case T.MUL:t=Fl;break;case T.PRELU:return e?Bl:_l;case T.SQUARED_DIFFERENCE:t=Ol;break;case T.SUB:t=Wl;break}return`
    ${t}
    return resultTemp;
  `}/**
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
 */var P;(function(s){s[s.ABS=0]="ABS",s[s.ACOS=1]="ACOS",s[s.ACOSH=2]="ACOSH",s[s.ASIN=3]="ASIN",s[s.ASINH=4]="ASINH",s[s.ATAN=5]="ATAN",s[s.ATANH=6]="ATANH",s[s.CEIL=7]="CEIL",s[s.COS=8]="COS",s[s.COSH=9]="COSH",s[s.ELU=10]="ELU",s[s.ERF=11]="ERF",s[s.EXP=12]="EXP",s[s.EXPM1=13]="EXPM1",s[s.FLOOR=14]="FLOOR",s[s.IS_FINITE=15]="IS_FINITE",s[s.IS_INF=16]="IS_INF",s[s.IS_NAN=17]="IS_NAN",s[s.LINEAR=18]="LINEAR",s[s.LOG=19]="LOG",s[s.LOG1P=20]="LOG1P",s[s.LOGICAL_NOT=21]="LOGICAL_NOT",s[s.NEG=22]="NEG",s[s.RELU=23]="RELU",s[s.RELU6=24]="RELU6",s[s.LEAKYRELU=25]="LEAKYRELU",s[s.RECIPROCAL=26]="RECIPROCAL",s[s.ROUND=27]="ROUND",s[s.RSQRT=28]="RSQRT",s[s.SELU=29]="SELU",s[s.SIGMOID=30]="SIGMOID",s[s.SIGN=31]="SIGN",s[s.SIN=32]="SIN",s[s.SINH=33]="SINH",s[s.SOFTPLUS=34]="SOFTPLUS",s[s.SQRT=35]="SQRT",s[s.SQUARE=36]="SQUARE",s[s.STEP=37]="STEP",s[s.TAN=38]="TAN",s[s.TANH=39]="TANH",s[s.TO_INT=40]="TO_INT"})(P||(P={}));const Vl="return abs(a);",Ul=`
  if (abs(a) > 1.) {
    return uniforms.NAN;
  }
  return acos(a);
`,Gl=`
  if (a < 1.) {
    return uniforms.NAN;
  }
  return acosh(a);
`,Hl=`
  if (abs(a) > 1.) {
    return uniforms.NAN;
  }
  return asin(a);
`,Xl="return asinh(a);",Kl=`
  if (isnan(a)) {
    return uniforms.NAN;
  }
  return atan(a);
`,ql=`
  if (abs(a) > 1.) {
    return uniforms.NAN;
  }
  if (a == 1.) {
    return uniforms.INFINITY;
  }
  if (a == -1.) {
    return -uniforms.INFINITY;
  }
  return atanh(a);
`,Yl="return ceil(a);",jl="return cos(a);",Ql=`
  let e2x = exp(-a);
  return (e2x + 1.0 / e2x) / 2.0;
`,Zl="return exp(a) - 1.0;",Jl="if (a >= 0.0) { return a; }  return (exp(a) - 1.0);",ed=`
  var resFloat = exp(a) - vec4<f32>(1.0);
  if (a.r >= 0.0) {
    resFloat.r = a.r;
  }
  if (a.g >= 0.0) {
    resFloat.g = a.g;
  }
  if (a.b >= 0.0) {
    resFloat.b = a.b;
  }
  if (a.a >= 0.0) {
    resFloat.a = a.a;
  }
  return resFloat;
`,td=`
  // Error function is calculated approximately with elementary function.
  // See "Handbook of Mathematical Functions with Formulas,
  // Graphs, and Mathematical Tables", Abramowitz and Stegun.
  let p = ${Ro};
  let a1 = ${$o};
  let a2 = ${Do};
  let a3 = ${No};
  let a4 = ${zo};
  let a5 = ${Ao};

  let sign = sign(a);
  let absA = abs(a);
  let t = 1.0 / (1.0 + p * absA);
  return sign * (1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * exp(-absA * absA));
`,sd="return exp(a);",id="return floor(a);",od="return f32(!isnan(a) && !isinf(a));",rd="return f32(isinf(a));",nd="return f32(isnan(a));",ad="return a;",ud=`if (a < 0.0) { return uniforms.NAN; }
  return log(a);`,ld=`
  if (isnan(a)) { return a; }
  return log(1.0 + a);
`,dd="return f32(!(a >= 1.0));",cd="return -a;",hd="if (a < 0.0) { return uniforms.alpha * a; } return a;",pd=`
  let aLessThanZero = vec4<f32>(a < vec4<f32>(0.0));
  return (aLessThanZero * (uniforms.alpha * a)) + ((vec4<f32>(1.0) - aLessThanZero) * a);
`,fd="return 1.0 / a;",md="return select(a, 0.0, a < 0.0);",gd="return clamp(a, 0.0, 6.0);",xd="return clamp(a, vec4<f32>(0.0, 0.0, 0.0, 0.0), vec4<f32>(6.0, 6.0, 6.0, 6.0));",yd=`
  return select(a, vec4<f32>(0.0), a < vec4<f32>(0.0));
`,wd="return round(a);",Cd="return inverseSqrt(a);",bd=`
  if (a >= 0.0) {
    return ${Io} * a;
  } else {
    return ${Po} * (exp(a) - 1.0);
  }
`,Sd="return 1.0 / (1.0 + exp(-1.0 * a));",vd="return sign(a);",kd="return sin(a);",Id=`
  let e2x = exp(a);
  return (e2x - 1.0 / e2x) / 2.0;
`,Pd=`
  let epsilon = 1.1920928955078125e-7;
  let threshold = log(epsilon) + 2.0;

  let too_large = a > -threshold;
  let too_small = a < threshold;
  let exp_a = exp(a);

  if (too_large) {
    return a;
  } else if (too_small) {
    return exp_a;
  } else {
    return log(exp_a + 1.0);
  }
`,Rd="return sqrt(a);",$d="return a * a;",Dd=`
  if (isnan(a)) {
    return a;
  }

  return select(uniforms.stepAlpha, 1.0, a > 0.0);
`,Nd="return tan(a);",zd=`
  let e2x = exp(-2.0 * abs(a));
  return sign(a) * (1.0 - e2x) / (1.0 + e2x);
`,Ad="return f32(i32((a)));";function Ie(s,e){switch(s){case P.ABS:return Vl;case P.ACOS:return Ul;case P.ACOSH:return Gl;case P.ASIN:return Hl;case P.ASINH:return Xl;case P.ATAN:return Kl;case P.ATANH:return ql;case P.COS:return jl;case P.COSH:return Ql;case P.CEIL:return Yl;case P.ELU:return e?ed:Jl;case P.ERF:return td;case P.EXP:return sd;case P.EXPM1:return Zl;case P.FLOOR:return id;case P.IS_FINITE:return od;case P.IS_INF:return rd;case P.IS_NAN:return nd;case P.LINEAR:return ad;case P.LOG:return ud;case P.LOG1P:return ld;case P.LOGICAL_NOT:return dd;case P.NEG:return cd;case P.LEAKYRELU:return e?pd:hd;case P.RECIPROCAL:return fd;case P.RELU:return e?yd:md;case P.RELU6:return e?xd:gd;case P.ROUND:return wd;case P.RSQRT:return Cd;case P.SELU:return bd;case P.SIGMOID:return Sd;case P.SIGN:return vd;case P.SIN:return kd;case P.SINH:return Id;case P.SOFTPLUS:return Pd;case P.SQRT:return Rd;case P.SQUARE:return $d;case P.STEP:return Dd;case P.TAN:return Nd;case P.TANH:return zd;case P.TO_INT:return Ad;default:throw new Error(`BinaryType ${s} is not implemented!`)}}/**
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
 */function we(s,e=!1,t=!1,o=3){if(s===null)return"";let i="";if(s==="linear")i=Ie(P.LINEAR);else if(s==="relu")i=Ie(P.RELU,t);else if(s==="elu")i=Ie(P.ELU,t);else if(s==="relu6")i=Ie(P.RELU6,t);else if(s==="prelu")i=os(T.PRELU,t);else if(s==="sigmoid")i=Ie(P.SIGMOID,t);else if(s==="leakyrelu")i=Ie(P.LEAKYRELU,t);else throw new Error(`Activation ${s} has not been implemented for the WebGPU backend.`);const n=_(t?4:1);let a="";return e?a=`
      fn activation(a : ${n}, coords : vec${o}<i32>) -> ${n} {
        let b = getPreluActivationWeightsByOutputCoords(coords);
        ${i}
      }`:a=`
      fn activation(a : ${n}, coords : vec${o}<i32>) -> ${n} {
        ${i}
      }`,a}function Fe(s,e){return`
      ${s?"value = value + getBiasByOutputCoords(coords);":""}
      ${e?"value = activation(value, coords);":""}
      `}/**
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
 */function vi(s,e,t=!1,o=!1,i=!1,r=1){G(s&&r===1||!s,()=>`transposeA ${s} is not compatible with component size ${r}`);const n=`
      ${s?"value = getA(batch, col, row);":"value = getA(batch, row, col);"}

    `,a=e?"value = getB(batch, col, row);":"value = getB(batch, row, col);";return`
  fn mm_readA(batch: i32, row: i32, col: i32) -> ${_(r)} {
    var value = ${_(r)}(0.0);
    ${t&&i?n:`
    ${s?"if(row < uniforms.dimAOuter && col < uniforms.dimInner)":"if(row < uniforms.aShape[1] && col < uniforms.aShape[2])"}
    {
      ${n}
    }
    `}
    return value;
  }

  fn mm_readB(batch: i32, row: i32, col: i32) -> ${_(r)} {
    var value = ${_(r)}(0.0);
    ${a}
    return value;
  }
  `}function rs(s,e,t,o,i=!1,r=!1,n=!1,a=1){return`
  ${vi(t,o,i,r,n,a)}
  fn mm_write(batch: i32, row: i32, col: i32, valueIn: ${_(a)}) {
    ${i&&r?"":"if (row < uniforms.dimAOuter && col < uniforms.dimBOuter)"}
    {
      var value = valueIn;
      let coords = vec3<i32>(batch, row, col);
      ${Fe(s,e)}
      setOutputAtCoords(coords[0], coords[1], coords[2], value);
    }
  }
  `}const Fd=(s,e)=>s?`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          kStart + inputRow,
          globalRowStart + inputCol * ${e});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          globalRow + innerRow,
          kStart + inputCol * ${e});
        `,Md=(s,e,t,o)=>{if(s)return`
      for (var k = 0; k < ${o}; k++) {
        let BCached0 = mm_Bsub[k][tileCol];
        let ACached0 = mm_Asub[k][localRow];
        for (var i = 0; i < ${t}; i++) {
          acc[i] = fma(BCached0, vec4<f32>(ACached0[i]), acc[i]);
        }
      }`;{let i="",r="";for(let n=0;n<e;n++)i+=`let BCached${n} = mm_Bsub[k * ${e} + ${n}][tileCol];`,r+=`acc[i] = fma(BCached${n}, vec4<f32>(ACached[${n}]), acc[i]);`;return`
      for (var k = 0; k < ${o/e}; k++) {
        ${i}
        for (var i = 0; i < ${t}; i++) {
          let ACached = mm_Asub[tileRow + i][k];
          ${r}
        }
      }`}};function Pt(s,e,t=!1,o=32,i=!1,r=32,n=!1){const a=e[1]*s[1],u=e[0]*s[0],l=t?a:o,d=t?o:a,c=l/e[0],h=o/e[1],p=s[1],f=s[0];return G((t&&c===4&&s[1]===4||!t&&(c===3||c===4))&&l%e[0]===0&&o%e[1]===0&&s[0]===4,()=>`If transposeA ${t} is true, innerElementSize ${c} and workPerThread[1] ${s[1]} must be 4.
          Otherwise, innerElementSize ${c} must be 3 or 4.
      tileAWidth ${l} must be divisible by workgroupSize[0]${e[0]}. tileInner ${o} must be divisible by workgroupSize[1] ${e[1]}. colPerThread ${s[0]} must be 4.`),`
  var<workgroup> mm_Asub : array<array<vec${c}<f32>, ${l/c}>, ${d}>;
  var<workgroup> mm_Bsub : array<array<vec4<f32>, ${u/s[0]}>, ${o}>;

  ${R()} {
    let localRow = i32(localId.y);
    let tileRow = localRow * ${p};
    let tileCol = i32(localId.x);

    let globalRow = i32(globalId.y) * ${p};
    let globalCol = i32(globalId.x) * ${f};
    let batch = ${i?"0":"i32(globalId.z)"};
    let batchA = ${i||!n?"batch":"batch % uniforms.aShape[0]"};
    let batchB = ${i||!n?"batch":"batch % uniforms.bShape[0]"};
    let globalRowStart = i32(workgroupId.y) * ${a};

    let numTiles = ${i?`${Math.ceil(r/o)}`:`(uniforms.dimInner - 1) / ${o} + 1`};
    var kStart = ${i?`i32(globalId.z) * ${r}`:"0"};

    var acc: array<vec4<f32>, ${p}>;

    // Loop over shared dimension.
    let tileRowB = localRow * ${h};
    for (var t = 0; t < numTiles; t++) {
        // Load one tile of A into local memory.
        for (var innerRow = 0; innerRow < ${p}; innerRow++) {
            let inputRow = tileRow + innerRow;
            let inputCol = tileCol;
            ${Fd(t,c)}
        }

        // Load one tile of B into local memory.
        for (var innerRow = 0; innerRow < ${h}; innerRow++) {
            let inputRow = tileRowB + innerRow;
            let inputCol = tileCol;
            mm_Bsub[inputRow][inputCol] = mm_readB(batchB, kStart + inputRow, globalCol);
        }
        kStart = kStart + ${o};
        workgroupBarrier();

        // Compute acc values for a single thread.
        ${Md(t,c,p,o)}
        workgroupBarrier();
    }

    for (var innerRow = 0; innerRow < ${p}; innerRow++) {
        mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
    }
  }`}const Ss=s=>s?`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          kStart + inputRow,
          globalRowStart + inputCol);
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          globalRowStart + inputRow,
          kStart + inputCol);
        `,Td=s=>s?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];";function Rt(s,e,t=!1,o=32,i=!1,r=32,n=!1,a=!1){const u=s[1]*e[1],l=s[0]*e[0],d=t?u:o,c=t?o:u;G(c%e[1]===0&&d%e[0]===0&&o%e[1]===0,()=>`tileAHight ${c} must be divisible by workgroupSize[1]${e[1]}, tileAWidth ${d} must be divisible by workgroupSize[0]${e[0]}, tileInner ${o} must be divisible by workgroupSize[1]${e[1]}`);const h=c/e[1],p=d/e[0],f=o/e[1],m=s[1],g=s[0],x=n?`
      let localRow = i32(localId.y);
      let localCol = i32(localId.x);
      let globalRowStart = i32(workgroupId.y) * ${u};
      let globalColStart = i32(workgroupId.x) * ${l};

      // Loop over shared dimension.
      for (var t = 0; t < numTiles; t++) {
        // Load one tile of A into local memory.
        for (var inputRow = localRow; inputRow < ${c}; inputRow = inputRow + ${e[1]}) {
          for (var inputCol = localCol; inputCol < ${d}; inputCol = inputCol + ${e[0]}) {
            ${Ss(t)}
          }
        }
        // Load one tile of B into local memory.
        for (var inputRow = localRow; inputRow < ${o}; inputRow = inputRow + ${e[1]}) {
              for (var inputCol = localCol; inputCol < ${l}; inputCol = inputCol + ${e[0]}) {
            mm_Bsub[inputRow][inputCol] = mm_readB(batchB,
              kStart + inputRow,
              globalColStart + inputCol);
          }
        }
        kStart = kStart + ${o};
        workgroupBarrier();

        // Compute acc values for a single thread.
        var BCached : array<f32, ${g}>;
        for (var k = 0; k < ${o}; k++) {
          for (var inner = 0; inner < ${g}; inner++) {
            BCached[inner] = mm_Bsub[k][localCol + inner * ${e[0]}];
          }
          for (var innerRow = 0; innerRow < ${m}; innerRow++) {
            let ACached = ${t?`mm_Asub[k][localRow + innerRow * ${e[1]}];`:`mm_Asub[localRow + innerRow * ${e[1]}][k];`}
            for (var innerCol = 0; innerCol < ${g}; innerCol++) {
              acc[innerRow][innerCol] =
                  fma(ACached, BCached[innerCol], acc[innerRow][innerCol]);
            }
          }
        }
        workgroupBarrier();
      }
      for (var innerRow = 0; innerRow < ${m}; innerRow++) {
        let gRow = globalRowStart + localRow + innerRow * ${e[1]};
        for (var innerCol = 0; innerCol < ${g}; innerCol++) {
          let gCol = globalColStart + localCol + innerCol * ${e[0]};
          mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
        }
      }
      `:`
  let tileRow = i32(localId.y) * ${m};
  let tileCol = i32(localId.x) * ${g};

  let globalRow = i32(globalId.y) * ${m};
  let globalCol = i32(globalId.x) * ${g};
  let globalRowStart = i32(workgroupId.y) * ${u};

  let tileRowA = i32(localId.y) * ${h};
  let tileColA = i32(localId.x) * ${p};
  let tileRowB = i32(localId.y) * ${f};
  // Loop over shared dimension.
  for (var t = 0; t < numTiles; t++) {
    // Load one tile of A into local memory.
    for (var innerRow = 0; innerRow < ${h}; innerRow++) {
      for (var innerCol = 0; innerCol < ${p}; innerCol++) {
        let inputRow = tileRowA + innerRow;
        let inputCol = tileColA + innerCol;
        ${Ss(t)}
      }
    }

    // Load one tile of B into local memory.
    for (var innerRow = 0; innerRow < ${f}; innerRow++) {
      for (var innerCol = 0; innerCol < ${g}; innerCol++) {
        let inputRow = tileRowB + innerRow;
        let inputCol = tileCol + innerCol;
        mm_Bsub[inputRow][inputCol] = mm_readB(batchB,
          kStart + inputRow,
          globalCol + innerCol);
      }
    }
    kStart = kStart + ${o};
    workgroupBarrier();

    // Compute acc values for a single thread.
    var BCached : array<f32, ${g}>;
    for (var k = 0; k < ${o}; k++) {
      for (var inner = 0; inner < ${g}; inner++) {
        BCached[inner] = mm_Bsub[k][tileCol + inner];
      }

      for (var innerRow = 0; innerRow < ${m}; innerRow++) {
        ${Td(t)}
        for (var innerCol = 0; innerCol < ${g}; innerCol++) {
          acc[innerRow][innerCol] =
              fma(ACached, BCached[innerCol], acc[innerRow][innerCol]);
        }
      }
    }

    workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < ${m}; innerRow++) {
    for (var innerCol = 0; innerCol < ${g}; innerCol++) {
      mm_write(batch, globalRow + innerRow, globalCol + innerCol,
          acc[innerRow][innerCol]);
    }
  }
  `;return`
    var<workgroup> mm_Asub : array<array<f32, ${d}>, ${c}>;
    var<workgroup> mm_Bsub : array<array<f32, ${l}>, ${o}>;

    ${R()} {
      let batch = ${i?"0":"i32(globalId.z)"};
      let batchA = ${i||!a?"batch":"batch % uniforms.aShape[0]"};
      let batchB = ${i||!a?"batch":"batch % uniforms.bShape[0]"};
      let numTiles = ${i?`${Math.ceil(r/o)}`:`(uniforms.dimInner - 1) / ${o} + 1`};
      var kStart = ${i?`i32(globalId.z) * ${r}`:"0"};

      var acc : array<array<f32, ${g}>, ${m}>;

      // Without this initialization strange values show up in acc.
      for (var innerRow = 0; innerRow < ${m}; innerRow++) {
        for (var innerCol = 0; innerCol < ${g}; innerCol++) {
          acc[innerRow][innerCol] = 0.0;
        }
      }
      ${x}
    }
  `}const Ld=s=>s?`
      mm_readA(batchA, colA, globalRow),
      mm_readA(batchA, colA + 1, globalRow),
      mm_readA(batchA, colA + 2, globalRow),
      mm_readA(batchA, colA + 3, globalRow)
  `:`
      mm_readA(batchA, globalRow, colA),
      mm_readA(batchA, globalRow, colA + 1),
      mm_readA(batchA, globalRow, colA + 2),
      mm_readA(batchA, globalRow, colA + 3)
  `;function Ed(s,e=!1){G(s[1]===1&&s[2]===1,()=>`A linear work group size is required. But got ${s}.`);const t=s[0]*4;return`
    var<workgroup> mm_Asub : array<vec4<f32>, ${s[0]}>;

    ${R()} {
      let tileCol = i32(localId.x);
      let globalCol = i32(globalId.x);
      let globalRow = i32(globalId.y);

      let numTiles = (uniforms.dimInner - 1) / ${t} + 1;
      let batch = i32(globalId.z);
      let batchA = batch % uniforms.aShape[0];
      let batchB = batch % uniforms.bShape[0];
      // Without this initialization strange values show up in acc.
      var acc = 0.0;

      // Loop over shared dimension.
      for (var t = 0; t < numTiles; t++) {
        // Load one tile of A into local memory.
        let colA = t * ${t} + tileCol * 4;
        mm_Asub[tileCol] = vec4<f32>(${Ld(e)});
        workgroupBarrier();

        // Compute acc values for a single thread.
        for (var k = 0; k < ${t/4}; k++) {
          let rowB = t * ${t} + k * 4;
          let BCached = vec4<f32>(mm_readB(batchB, rowB, globalCol),
                              mm_readB(batchB, rowB + 1, globalCol),
                              mm_readB(batchB, rowB + 2, globalCol),
                              mm_readB(batchB, rowB + 3, globalCol));

          let ACached = mm_Asub[k];
          acc = acc + dot(ACached, BCached);
        }

        workgroupBarrier();
      }

      mm_write(batch, globalRow, globalCol, acc);
    }
  `}class _d{constructor(e,t,o=!1,i=!1,r=null,n=null,a=null,u=!1){this.variableNames=["A","B"],this.uniforms="dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.outputShape=t,this.dispatchLayout={x:[2],y:[1],z:[0]};const l=o?e[1]:e[2];if(this.isVec4=(l%4===0&&!o||t[1]%4===0&&o)&&t[2]%4===0&&!i,this.outputComponent=this.isVec4?4:1,this.isVectorA=t[1]===1&&!o,!this.isVec4&&this.isVectorA)this.elementsPerThread=[1,1,1],this.workgroupSize=[32,1,1];else{const h=dl(t[1],l,t[2],o);this.workgroupSize=h.workgroupSize,this.elementsPerThread=h.elementsPerThread}this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize,this.elementsPerThread);const d=r!=null,c=a!=null;d&&this.variableNames.push("bias"),c&&this.variableNames.push("preluActivationWeights"),this.sequentialAccessByThreads=u,this.transposeA=o,this.transposeB=i,this.addBias=d,this.activation=n,this.hasPreluActivationWeights=c,[this.fitAOuter,this.fitBOuter,this.fitInner]=this.getShapeFit(t[1],t[2],l),this.shaderKey=`matMulPacked_${this.elementsPerThread}_${o}_${i}_${this.activation}_${this.fitAOuter}_${this.fitBOuter}_${this.fitInner}_${this.isVec4}_${this.isVectorA}_${this.sequentialAccessByThreads}`}getShapeFit(e,t,o){const i=this.workgroupSize[1]*this.elementsPerThread[1],r=this.workgroupSize[0]*this.elementsPerThread[0];!this.isVec4&&this.isVectorA?this.tileInner=this.workgroupSize[0]*4:this.tileInner=r;const n=e%i===0,a=t%r===0,u=o%this.tileInner===0;return[n,a,u]}getUserCode(){return`
      ${we(this.activation,this.hasPreluActivationWeights,this.isVec4)}
      ${rs(this.addBias,this.activation,!1,this.transposeB,this.fitAOuter,this.fitBOuter,this.fitInner,this.isVec4?4:1)}
      ${this.isVec4?Pt(this.elementsPerThread,this.workgroupSize,this.transposeA,this.tileInner,!1,null,!0):this.isVectorA?Ed(this.workgroupSize,this.transposeA):Rt(this.elementsPerThread,this.workgroupSize,this.transposeA,this.tileInner,!1,null,this.sequentialAccessByThreads,!0)}
    `}}/**
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
 */function Bd(s){return`
    var<workgroup> sumValues : array<f32, ${s}>;
    ${R()} {
      let coords = getOutputCoords();
      let batch = coords[0];
      let batchA = batch % uniforms.aShape[0];
      let batchB = batch % uniforms.bShape[0];
      let row = coords[1];
      let col = coords[2];
      var sum = 0.0;
      let Length = uniforms.dimInner;
      for (var k = i32(localId.x); k < Length; k = k + ${s}) {
        let dataA = mm_readA(batchA, row, k);
        let dataB = mm_readB(batchB, k, col);
        sum = sum + dataA * dataB;
      }
      sumValues[localId.x] = sum;
      workgroupBarrier();

      for(var currentSize = ${s/2}u; currentSize > 1u;
          currentSize = currentSize / 2u) {
        if (localId.x < currentSize)
        {
          sumValues[localId.x] = sumValues[localId.x] + sumValues[localId.x + currentSize];
        }
        workgroupBarrier();
      }

      if (localId.x == 0u) {
        sum = sumValues[0] + sumValues[1];
        mm_write(batch, row, col, sum);
      }
    }
  `}class Od{constructor(e,t=!1,o=!1,i=null,r=null,n=null){this.variableNames=["A","B"],this.uniforms="dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.workgroupSize=[256,1,1],this.outputShape=e,this.dispatchLayout={x:[],y:[1,2],z:[0]},this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize);const a=i!=null,u=n!=null;a&&this.variableNames.push("bias"),u&&this.variableNames.push("preluActivationWeights"),this.transposeA=t,this.transposeB=o,this.addBias=a,this.activation=r,this.hasPreluActivationWeights=u,this.shaderKey=`matMulReduce_${this.activation}_${t}_${o}`}getUserCode(){return`
      ${we(this.activation,this.hasPreluActivationWeights)}
      ${rs(this.addBias,this.activation,this.transposeA,this.transposeB)}
      ${Bd(this.workgroupSize[0])}
    `}}/**
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
 */function Wd(s){const e=s[1],t=s[0],o=e>t?e:t;return`
  var<workgroup> mm_Asub : array<array<f32, ${o}>, ${e}>;
  var<workgroup> mm_Bsub : array<array<f32, ${t}>, ${o}>;

  // If the output size is small for matrix multiplication, avoid to use vec4
  // and handle some elements per thread to optimally utilize the ALU.
  // Read data from global memory to registers firstly, then store them into
  // shared memory, so it is instruction-Level parallelism for arithmetic
  // operations and others handle IO operations between barrier api, makes ALU
  // and load/store units work simultaneously, could improves the performance.
  ${R()} {
    let tileRow = i32(localId.y);
    let tileCol = i32(localId.x);
    let globalRow = i32(globalId.y);
    let globalCol = i32(globalId.x);
    let batch = i32(globalId.z);
    let batchA = batch % uniforms.aShape[0];
    let batchB = batch % uniforms.bShape[0];

    // uniforms.dimInner should be greater than 0.
    let numTiles = (uniforms.dimInner - 1) / ${o} + 1;
    var acc = 0.0;

    var globalColA = tileCol;
    var globalRowB = 0;
    var regA = mm_readA(batchA, globalRow, globalColA);
    var regB0 = mm_readB(batchB, globalRowB + 2 * tileRow, globalCol);
    var regB1 = mm_readB(batchB, globalRowB + 2 * tileRow + 1, globalCol);
    globalColA = globalColA + ${o};
    globalRowB = globalRowB + ${o};

    for (var t = 0; t < numTiles; t = t + 1) {
      mm_Asub[tileRow][tileCol] = regA;
      mm_Bsub[2 * tileRow][tileCol] = regB0;
      mm_Bsub[2 * tileRow + 1][tileCol] = regB1;

      workgroupBarrier();

      regA = mm_readA(batchA, globalRow, globalColA);
      regB0 = mm_readB(batchB, globalRowB + 2 * tileRow, globalCol);
      regB1 = mm_readB(batchB, globalRowB + 2 * tileRow + 1, globalCol);
      globalColA = globalColA + ${o};
      globalRowB = globalRowB + ${o};

      for (var k = 0; k < ${o}; k = k + 1) {
        acc = acc + mm_Asub[tileRow][k] * mm_Bsub[k][tileCol];
      }
      workgroupBarrier();
    }

    mm_write(batch, globalRow, globalCol, acc);
  }
  `}class Vd{constructor(e,t,o,i=!1,r=!1,n=null,a=null,u=null){this.variableNames=["A","B"],this.uniforms="dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.workgroupSize=[16,8,1],this.outputShape=o,this.dispatchLayout={x:[2],y:[1],z:[0]},this.dispatch=[Math.ceil(o[2]/this.workgroupSize[0]),Math.ceil(o[1]/this.workgroupSize[1]),o[0]];const l=n!=null;l&&this.variableNames.push("bias");const d=u!=null;d&&this.variableNames.push("preluActivationWeights"),this.transposeA=i,this.transposeB=r,this.addBias=l,this.activation=a,this.hasPreluActivationWeights=d,this.shaderKey=`matMulSmallOutputSize_${this.activation}_${i}_${r}`}getUserCode(){return`
      ${we(this.activation,this.hasPreluActivationWeights)}
      ${rs(this.addBias,this.activation,this.transposeA,this.transposeB)}
      ${Wd(this.workgroupSize)}
    `}}/**
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
 */class Ud{constructor(e,t,o=!1,i=!1){this.variableNames=["A","B"],this.uniforms="dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.workgroupSize=[8,8,1],this.atomic=!0,this.splitedDimInner=128,G(e[0]===1,()=>"MatMulSplitKProgram only supports batch = 1."),this.outputShape=e,this.dispatchLayout={x:[2],y:[1],z:[0,3]};const r=(o&&this.outputShape[1]%4===0||!o&&t%4===0)&&this.outputShape[2]%4===0;this.elementsPerThread=[4,4,this.splitedDimInner],this.outputComponent=r?4:1,r||(this.outputShape[1]<16&&(this.elementsPerThread[1]=1),this.outputShape[2]<16&&(this.elementsPerThread[0]=1)),this.dispatch=$(this.dispatchLayout,[this.outputShape[0],this.outputShape[1],this.outputShape[2],t],this.workgroupSize,this.elementsPerThread),this.transposeA=o,this.transposeB=i,this.shaderKey=`matMulSplitK_${o}_${i}_${this.elementsPerThread}_${this.outputComponent}`}getUserCode(){const e=this.outputComponent;return`
      ${vi(!1,this.transposeB,!1,!1,!1,e)}
      fn mm_write(batch: i32, row : i32, col : i32, value : ${_(e)}) {
        if (row < uniforms.dimAOuter && col < uniforms.dimBOuter) {
          let coords = vec3<i32>(batch, row, col);
          let flatIndex = getOutputIndexFromCoords(coords);
          // The problem is that we should initialize output to zero before using.
          // Otherwise, the original value will be added to the result.
          for (var i = 0; i < ${e}; i = i + 1) {
            ${ke("&result[flatIndex + i]",`${e>1?"value[i]":"value"}`,"float32")}
          }
        }
      }
      ${e===4?Pt(this.elementsPerThread,this.workgroupSize,this.transposeA,32,!0,this.splitedDimInner):Rt(this.elementsPerThread,this.workgroupSize,this.transposeA,32,!0,this.splitedDimInner)}
    `}}class Gd{constructor(e,t=null,o=null,i=null){this.uniforms="",this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.addBias=t!=null,this.hasPreluActivationWeights=i!=null,this.activation=o,this.addBias&&this.variableNames.push("bias"),this.hasPreluActivationWeights&&this.variableNames.push("preluActivationWeights"),this.shaderKey=`biasActivation_${o}`}getUserCode(){return`
    ${we(this.activation,this.hasPreluActivationWeights)}
    ${R("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        var value = getXByOutputIndex(index);
        ${Fe(this.addBias,this.activation)}
        setOutputAtIndex(index, value);
      }
    }
    `}}/**
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
 */class Hd{constructor(e){this.variableNames=[],this.outputShape=[],this.uniforms="value : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="fill"}getUserCode(){return`
    ${R("index")} {
      if (index < uniforms.size) {
        setOutputAtIndex(index, uniforms.value);
      }
    }
  `}}/**
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
 */function ie(s){const{backend:e,attrs:t}=s,{shape:o,value:i}=t;let{dtype:r}=t;if(r=r||Mo(i),r==="string"){const n=ai(r,M(o));return n.fill(i),e.makeTensorInfo(o,r,n)}else{const n=new Hd(o),a=[{type:"float32",data:[i]}];return e.runWebGPUProgram(n,[],r,a)}}const Xd={kernelName:Fo,backendName:"webgpu",kernelFunc:ie};/**
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
 */function z(s){const{inputs:e,attrs:t}=s,{x:o}=e,{shape:i}=t,r=M(o.shape),n=Lo(i,r),a=M(n);return G(r===a,()=>`The new shape (${n}) has ${a} elements and the old shape (${o.shape}) has ${r} elements. The new shape and old shape must have the same number of elements.`),s.backend.incRef(o.dataId),{dataId:o.dataId,shape:n,dtype:o.dtype}}const Kd={kernelName:To,backendName:"webgpu",kernelFunc:z};/**
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
 */function $t({a:s,b:e,transposeA:t,transposeB:o,backend:i,bias:r=null,preluActivationWeights:n=null,leakyreluAlpha:a=0,activation:u=null}){const l=s.shape.length,d=e.shape.length,c=t?s.shape[l-2]:s.shape[l-1],h=o?e.shape[d-1]:e.shape[d-2],p=t?s.shape[l-1]:s.shape[l-2],f=o?e.shape[d-2]:e.shape[d-1],m=s.shape.slice(0,-2),g=e.shape.slice(0,-2),x=M(m),y=M(g),C=xe(s.shape.slice(0,-2),e.shape.slice(0,-2)).concat([p,f]);G(c===h,()=>`Error in matMul: inner shapes (${c}) and (${h}) of Tensors with shapes ${s.shape} and ${e.shape} and transposeA=${t} and transposeB=${o} must match.`);const b=t?[x,c,p]:[x,p,c],S=o?[y,f,h]:[y,h,f],v=z({inputs:{x:s},backend:i,attrs:{shape:b}}),I=z({inputs:{x:e},backend:i,attrs:{shape:S}}),k=[v,I],N=Math.max(x,y),A=[v,I],L=[{type:"int32",data:[p]},{type:"int32",data:[f]},{type:"int32",data:[c]}];let F,E;const B=[N,p,f];let V=q().get("WEBGPU_MATMUL_PROGRAM_TYPE");if(V<0){const ue=q().getNumber("WEBGPU_THRESHOLD_TO_INCREASE_WORKGROUPS_FOR_MATMUL"),le=ue>0?ue:i.thresholdToIncreaseWorkgroups,Ce=N*Math.ceil(p/32)*Math.ceil(f/32);Ce<=le||p<=8&&Ce<=le*2?N*p*f<=128?V=he.MatMulReduceProgram:N===1&&h>=2e3?V=he.MatMulSplitKProgram:V=he.MatMulSmallOutputSizeProgram:V=he.MatMulPackedProgram}switch(V){case he.MatMulReduceProgram:F=new Od(B,t,o,r,u,n);break;case he.MatMulSplitKProgram:{if(E=ie({backend:i,attrs:{shape:B,value:0,dtype:s.dtype}}),F=new Ud(B,h,t,o),r||u){E=i.runWebGPUProgram(F,A,s.dtype,L,E);const le=new Gd(E.shape,r,u,n);let Ce=null;const ge=[E];r&&ge.push(r),n&&ge.push(n),u==="leakyrelu"&&(Ce=[{type:"float32",data:[a]}],le.uniforms+=" alpha : f32,");const ls=i.runWebGPUProgram(le,ge,E.dtype,Ce);k.push(E);const po=z({inputs:{x:ls},backend:i,attrs:{shape:C}});k.push(ls);for(const fo of k)i.disposeData(fo.dataId);return po}break}case he.MatMulSmallOutputSizeProgram:F=new Vd(b,S,B,t,o,r,u,n);break;case he.MatMulPackedProgram:const ue=i.adapterInfo.isIntel();F=new _d(b,B,t,o,r,u,n,ue);break;default:throw new Error(`Unsupported MatMulProgramType ${V}.`)}r&&A.push(r),n&&A.push(n),u==="leakyrelu"&&(L.push({type:"float32",data:[a]}),F.uniforms+=" alpha : f32,"),E=i.runWebGPUProgram(F,A,s.dtype,L,E);const J=z({inputs:{x:E},backend:i,attrs:{shape:C}});k.push(E);for(const ue of k)i.disposeData(ue.dataId);return J}/**
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
 */function qd(s){const{inputs:e,backend:t,attrs:o}=s,{a:i,b:r,bias:n,preluActivationWeights:a}=e,{transposeA:u,transposeB:l,activation:d,leakyreluAlpha:c}=o;return $t({a:i,b:r,transposeA:u,transposeB:l,backend:t,bias:n,preluActivationWeights:a,leakyreluAlpha:c,activation:d})}const Yd={kernelName:Eo,backendName:"webgpu",kernelFunc:qd};/**
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
 */class vs{constructor(e,t,o){this.variableNames=["AReal","AImag","BReal","BImag"],this.workgroupSize=[128,1,1],this.size=!0,this.outputShape=xe(t,o),this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`binaryOpComplex_${e}`,this.op=e}getUserCode(){return`
      fn binaryOpComplex(
          areal : f32, aimag : f32, breal : f32, bimag : f32) -> f32 {
        ${os(this.op,!1)}
      }

      ${R("index")} {
        if(index < uniforms.size) {
          let areal = getARealByOutputIndex(index);
          let aimag = getAImagByOutputIndex(index);
          let breal = getBRealByOutputIndex(index);
          let bimag = getBImagByOutputIndex(index);
          setOutputAtIndex(index, binaryOpComplex(areal, aimag, breal, bimag));
        }
      }
    `}}/**
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
 */class Ct{constructor(e,t,o){if(this.size=!0,this.variableNames=["A","B"],this.outputShape=xe(t,o),this.dispatchLayout=D(this.outputShape),this.op=e,this.useSharedMemoryWithA=t.length<=1&&o.length>1&&t[0]<128,this.useSharedMemoryWithB=o.length<=1&&t.length>1&&o[0]<128,this.useSharedMemoryWithA||this.useSharedMemoryWithB)this.outputComponent=1,this.variableComponents=[1,1],this.lastDimensionSize=this.useSharedMemoryWithB?o[0]:t[0],this.shaderKey=`binary_${e}_${this.lastDimensionSize}`,this.type="shared",this.workgroupSize=[256,1,1];else{const i=t.length>0&&t[t.length-1]%4===0,r=o.length>0&&o[o.length-1]%4===0;i&&r?(this.outputComponent=4,this.variableComponents=[4,4]):i&&(hs(o)||o[o.length-1]===1)||r&&(hs(t)||t[t.length-1]===1)?(this.outputComponent=4,this.variableComponents=i?[4,1]:[1,4]):(this.outputComponent=1,this.variableComponents=[1,1]),this.type="nonshared",this.shaderKey=`binary_${e}_${this.variableComponents}`,this.workgroupSize=[128,1,1]}this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.outputComponent,1,1])}getUserCode(){let e;const t=this.outputComponent===4?"vec4<f32>":"f32",o=`
    fn binaryOperation(a : ${t}, b : ${t}) -> ${t} {
      ${os(this.op,this.outputComponent===4)}
    };
    `;if(this.type==="shared"){const i=this.lastDimensionSize>1?`coords[${this.outputShape.length-1}]`:"0",r=this.useSharedMemoryWithB?`let a = getAByOutputIndex(index);
          let b = sharedBuf[${i}];`:`let a = sharedBuf[${i}];
          let b = getBByOutputIndex(index);`;e=`
        ${o}
        var<workgroup> sharedBuf : array<f32, ${this.lastDimensionSize}>;
        ${R("index")} {
          // Fill in the shared memory buffer.
          let localIndex = i32(localId.x);
          if(localIndex < ${this.lastDimensionSize}) {
            sharedBuf[localIndex] = f32(${this.useSharedMemoryWithB?"B":"A"}[localIndex]);
          }
          workgroupBarrier();

          if(index < uniforms.size) {
            let coords = getCoordsFromIndex(index);
            ${r}
            setOutputAtIndex(index, binaryOperation(a, b));
          }
        }
        `}else e=`
       ${o}
       ${R("index")} {
         if (index < uniforms.size) {
           let coords = getCoordsFromIndex(index * ${this.outputComponent});
           let a = ${t}(getAByOutputCoords(coords));
           let b = ${t}(getBByOutputCoords(coords));
           setOutputAtIndex(index, binaryOperation(a, b));
         }
       }
       `;return e}}/**
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
 */function ae(s){const{inputs:e}=s,{x:t}=e;return s.backend.incRef(t.dataId),{dataId:t.dataId,shape:t.shape,dtype:t.dtype}}const jd={kernelName:_o,backendName:"webgpu",kernelFunc:ae};/**
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
 */function Me(s){const{inputs:e,backend:t}=s,{real:o,imag:i}=e,r=t.makeTensorInfo(o.shape,"complex64"),n=t.tensorMap.get(r.dataId),a=ae({inputs:{x:o},backend:t}),u=ae({inputs:{x:i},backend:t});return n.complexTensorInfos={real:a,imag:u},r}const Qd={kernelName:Bo,backendName:"webgpu",kernelFunc:Me};/**
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
 */class Qe{constructor(e,t,o=""){this.variableNames=["A"],this.size=!0;const i=128;this.workgroupSize=[i,1,1],this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.op=t,o!==""&&(this.uniforms=o),this.shaderKey=`unary_${t}`}getUserCode(){return`
      fn unaryOperation(a : f32) -> f32 {
        ${Ie(this.op,!1)}
      }
      ${R("index")} {
        if (index < uniforms.size) {
          let a = getAByOutputIndex(index);
          setOutputAtIndex(index, unaryOperation(a));
        }
      }
      `}}/**
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
 */function U({opType:s,cpuKernelImpl:e,dtype:t}){return({inputs:o,backend:i})=>{const{x:r}=o,n=i,a=t||r.dtype;if(n.shouldExecuteOnCPU([r])&&e!=null){const l=n.tensorMap.get(r.dataId),d=e(l.values,a);return n.makeTensorInfo(r.shape,a,d)}const u=new Qe(r.shape,s);return n.runWebGPUProgram(u,[r],a)}}function j({opType:s,cpuKernelImpl:e,supportsComplex:t=!1,dtype:o}){return({inputs:i,backend:r})=>{const{a:n,b:a}=i,u=r;if(t&&n.dtype==="complex64"){const c=u.tensorMap.get(n.dataId),h=u.tensorMap.get(a.dataId);let p,f;if(s!==T.MUL)[p,f]=[[c.complexTensorInfos.real,h.complexTensorInfos.real],[c.complexTensorInfos.imag,h.complexTensorInfos.imag]].map(g=>{const[x,y]=g,w={dataId:x.dataId,dtype:x.dtype,shape:n.shape},C={dataId:y.dataId,dtype:y.dtype,shape:a.shape},b=new Ct(s,n.shape,a.shape);return u.runWebGPUProgram(b,[w,C],Ue(x.dtype,y.dtype))});else{const g=new vs(T.COMPLEX_MULTIPLY_REAL,n.shape,a.shape),x=new vs(T.COMPLEX_MULTIPLY_IMAG,n.shape,a.shape),y=[{dataId:c.complexTensorInfos.real.dataId,dtype:c.complexTensorInfos.real.dtype,shape:n.shape},{dataId:c.complexTensorInfos.imag.dataId,dtype:c.complexTensorInfos.imag.dtype,shape:n.shape},{dataId:h.complexTensorInfos.real.dataId,dtype:h.complexTensorInfos.real.dtype,shape:a.shape},{dataId:h.complexTensorInfos.imag.dataId,dtype:h.complexTensorInfos.imag.dtype,shape:a.shape}];p=u.runWebGPUProgram(g,y,"float32"),f=u.runWebGPUProgram(x,y,"float32")}const m=Me({inputs:{real:p,imag:f},backend:u});return u.disposeData(p.dataId),u.disposeData(f.dataId),m}const l=o||Ue(n.dtype,a.dtype);if((n.dtype==="string"||a.dtype==="string"||u.shouldExecuteOnCPU([n,a]))&&e!=null){const c=u.tensorMap.get(n.dataId).values,h=u.tensorMap.get(a.dataId).values,p=n.dtype==="string"?ps(c):c,f=n.dtype==="string"?ps(h):h,[m,g]=e(n.shape,a.shape,p,f,l);return u.makeTensorInfo(g,l,m)}const d=new Ct(s,n.shape,a.shape);return u.runWebGPUProgram(d,[n,a],l)}}/**
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
 */const{addImpl:Zd,castImpl:Jd,ceilImpl:ec,concatImpl:tc,equalImpl:sc,expImpl:ic,expm1Impl:oc,floorImpl:rc,floorDivImpl:nc,gatherNdImpl:ac,gatherV2Impl:uc,greaterEqualImpl:lc,greaterImpl:dc,lessEqualImpl:cc,lessImpl:hc,logImpl:pc,maxImpl:fc,maximumImpl:mc,minimumImpl:gc,multiplyImpl:xc,negImpl:yc,notEqualImpl:wc,prodImpl:Cc,rangeImpl:bc,rsqrtImpl:Sc,scatterImpl:vc,simpleAbsImpl:kc,sliceImpl:Ic,stridedSliceImpl:Pc,stringNGramsImpl:Rc,subImpl:$c,tileImpl:Dc,topKImpl:Nc,transposeImpl:zc}=Ku;/**
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
 */const Ac=U({opType:P.ABS,cpuKernelImpl:kc}),Fc={kernelName:Oo,backendName:"webgpu",kernelFunc:Ac};/**
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
 */const Mc=U({opType:P.ACOS}),Tc={kernelName:Wo,backendName:"webgpu",kernelFunc:Mc};/**
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
 */const Lc=U({opType:P.ACOSH}),Ec={kernelName:Vo,backendName:"webgpu",kernelFunc:Lc};/**
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
 */const _c=j({opType:T.ADD,cpuKernelImpl:Zd,supportsComplex:!0}),Bc={kernelName:Uo,backendName:"webgpu",kernelFunc:_c};/**
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
 */class Oc{constructor(e){this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e[0],this.variableNames=e.map((t,o)=>`T${o}`),this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.shaderKey="addN"}getUserCode(){const e=[];this.variableNames.forEach(i=>{e.push(`let v${i} = get${i}ByOutputCoords(coords);`)});const t=this.variableNames.map(i=>`v${i}`).join(" + ");return`
      ${R("index")} {
        for (var i = 0; i < ${this.workPerThread}; i = i + 1) {
          let flatIndex = index * ${this.workPerThread} + i;
          if (flatIndex < uniforms.size) {
            let coords = getCoordsFromIndex(flatIndex);
            ${e.join(`
        `)}
            setOutputAtIndex(flatIndex, ${t});
          }
        }
      }
    `}}/**
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
 */function Wc(s){const{inputs:e,backend:t}=s,o=e;if(o.length===1)return ae({inputs:{x:o[0]},backend:t});const i=o.map(a=>a.dtype).reduce((a,u)=>Ue(a,u)),r=o.map(a=>a.shape),n=new Oc(r);return t.runWebGPUProgram(n,o,i)}const Vc={kernelName:Go,backendName:"webgpu",kernelFunc:Wc};/**
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
 */class Uc{constructor(e,t){this.variableNames=["A"],this.workgroupSize=[16,16,1];const o=new Array(e.length);for(let i=0;i<o.length;i++)o[i]=e[t[i]];this.outputShape=o,this.dispatchLayout={x:[0],y:[1]},this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize,[1,1,1]),this.shaderKey="transposeShared"}getUserCode(){G(this.workgroupSize[0]===this.workgroupSize[1],()=>`Must be a square tile, current tile shape is ${this.workgroupSize[0]} x ${this.workgroupSize[1]}`);const e=this.workgroupSize[0];return`
      var<workgroup> tile : array<array<f32, ${this.workgroupSize[0]+1}>, ${this.workgroupSize[0]}>;
      ${R()} {
        var x = i32(workgroupId.x) * ${e} + i32(localId.x);
        var y = i32(workgroupId.y) * ${e} + i32(localId.y);
        let width = uniforms.outShape[0];
        let height = uniforms.outShape[1];
        if (x < width && y < height) {
          tile[localId.y][localId.x] = f32(A[y * width + x]);
        }
        workgroupBarrier();

        x = i32(workgroupId.y) * ${e} + i32(localId.x);
        y = i32(workgroupId.x) * ${e} + i32(localId.y);
        if (x < height && y < width) {
          setOutputAtIndex((y * height + x), tile[localId.x]
            [localId.y]);
        }
      }
    `}}/**
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
 */class Gc{constructor(e,t){this.variableNames=["A"],this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0;const o=new Array(e.length);for(let i=0;i<o.length;i++)o[i]=e[t[i]];this.outputShape=o,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.newDim=t,this.shaderKey=`transpose_${t}`}getUserCode(){const e=K(this.outputShape.length),t=ki(this.newDim);return`
      ${R("index")} {
        for(var i = 0; i < ${this.workPerThread}; i = i + 1) {
          let flatIndex = index * ${this.workPerThread} + i;
          if(flatIndex < uniforms.size) {
            let coords = getCoordsFromIndex(flatIndex);
            setOutputAtIndex(flatIndex, A[getIndexFromCoords${this.outputShape.length}D(
              ${e}(${t}), uniforms.aShape)]);
          }
        }
      }
    `}}function ki(s){const e=s.length;if(e>6)throw Error(`Transpose for rank ${e} is not yet supported`);const t=new Array(e);for(let o=0;o<s.length;o++)t[s[o]]=`coords.${ye(o)}`;return t.join()}/**
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
 */function fe(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{perm:r}=o,n=t,a=i.shape.length,u=new Array(a);for(let d=0;d<u.length;d++)u[d]=i.shape[r[d]];if(t.shouldExecuteOnCPU([i])){const c=n.tensorMap.get(i.dataId).values,h=zc(c,i.shape,i.dtype,r,u);return t.makeTensorInfo(u,i.dtype,h)}if(i.shape.length===2&&Ke(r,[1,0])){const d=new Uc(i.shape,r);return n.runWebGPUProgram(d,[i],i.dtype)}const l=new Gc(i.shape,r);return n.runWebGPUProgram(l,[i],i.dtype)}const Hc={kernelName:Ho,backendName:"webgpu",kernelFunc:fe};/**
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
 */class Xc{constructor(e,t,o){this.variableNames=["x"],this.uniforms="reduceSize : i32,",this.size=!0,this.inputShape=[e.batchSize,e.inSize];const[i]=kt(this.inputShape,[1]);this.outputShape=i.length===0?[1]:i,e.inSize>=32768&&o>=512?this.workgroupSize=[512,1,1]:e.inSize>=4096?this.workgroupSize=[256,1,1]:this.workgroupSize=[64,1,1],this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,[1,1,1]),this.reduceType=t,this.shaderKey=`reduce_${t}`}getUserCode(){let e="",t="0.0";const o=this.workgroupSize[0];this.reduceType==="min"||this.reduceType==="max"?(e=`
         if (isnan(candidate)) {
          bestValue = uniforms.NAN;
         } else if (!isnan(bestValue) && candidate ${this.reduceType==="min"?"<":">"} bestValue)
           {  bestValue = candidate; }`,t="f32(x[offset])"):this.reduceType==="sum"||this.reduceType==="mean"?e=" bestValue = bestValue + candidate; ":this.reduceType==="prod"?(e=" bestValue = bestValue * candidate; ",t="1.0"):this.reduceType==="all"?(e=" bestValue = f32(bestValue >= 1.0 && candidate >= 1.0); ",t="1.0"):this.reduceType==="any"&&(e=" bestValue = f32(bestValue >= 1.0 || candidate >= 1.0); ",t="0.0");const i=this.reduceType==="mean"?"setOutputAtIndex(outputIndex, bestValue / f32(uniforms.reduceSize));":"setOutputAtIndex(outputIndex, bestValue);";return`
       fn DIV_CEIL(a : u32, b : u32) -> u32 {
        return ((a - 1u) / b + 1u);
       }

       ${`
         var<workgroup> xBestValues : array<f32, ${o}>;
       `}
       fn getOffset(outputIndex : i32) -> i32 {
         let outputCoords = getCoordsFromIndex(outputIndex);
         let offset = ${this.outputShape.length===1?"outputCoords":"outputCoords[0]"} * uniforms.reduceSize;
          return offset;
       }
       ${R("index")} {
         let outputIndex = index / ${o};
         let offset = getOffset(outputIndex);
         var bestValue = ${t};
         let Length = uniforms.reduceSize;
         let WorkPerThread = DIV_CEIL(u32(Length), ${o}u);
         for (var k = i32(localId.x); k < Length && outputIndex < uniforms.size;
             k = k + ${o}) {
           let candidate = f32(x[offset + k]);
           ${e}
         }
         xBestValues[localId.x] = bestValue;
         workgroupBarrier();

         var reduceSize = min(u32(Length), ${o}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (localId.x < currentSize) {
            let candidate = xBestValues[localId.x + interval];
            ${e}
            xBestValues[localId.x] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (localId.x == 0u && outputIndex < uniforms.size) {
          ${i}
        }
       }
     `}}/**
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
 */const Kc={mean:"float32",all:"bool",any:"bool"};function Te(s,e,t,o,i){const r=s.shape.length,n=[],a=Ae(e,s.shape);let u=a;const l=ht(u,r);let d=s;l!=null&&(d=fe({inputs:{x:s},attrs:{perm:l},backend:i}),u=pt(u.length,r),n.push(d)),Zt(o,u,r);const[c,h]=kt(d.shape,u);let p=c;t&&(p=Xo(c,a));let f;if((o==="max"||o==="prod")&&i.shouldExecuteOnCPU([d])){const m=i.tensorMap.get(d.dataId).values;switch(o){case"max":const g=fc(m,M(h),p,s.dtype);f=i.makeTensorInfo(p,s.dtype,g);break;case"prod":const{outVals:x,outShape:y,outDtype:w}=Cc(d.shape,d.dtype,m,u);f=i.makeTensorInfo(y,w,x);break;default:throw new Error(`${o} CPU implementation is not yet supported.`)}}else{const m=M(h),x=M(d.shape)/m,y={windowSize:m,inSize:m,batchSize:x,outSize:1},w=Kc[o]||Ko(s.dtype),C=[{type:"int32",data:[m]}],b=new Xc(y,o,i.device.limits.maxComputeWorkgroupSizeX),S=i.runWebGPUProgram(b,[d],w,C);n.push(S),f=z({inputs:{x:S},attrs:{shape:p},backend:i})}return n.forEach(m=>i.disposeData(m.dataId)),f}/**
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
 */function qc(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{keepDims:r,axis:n}=o;return Te(i,n,r,"all",t)}const Yc={kernelName:qo,backendName:"webgpu",kernelFunc:qc};/**
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
 */function jc(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{keepDims:r,axis:n}=o;return Te(i,n,r,"any",t)}const Qc={kernelName:Yo,backendName:"webgpu",kernelFunc:jc};/**
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
 */class Ii{constructor(e,t,o){this.workgroupSize=[64,1,1],this.variableNames=["x"],this.uniforms="infinityValue : f32,",this.size=!0;const i=[t];this.op=o==="min"?"<":">";const[r,n]=kt(e,i);this.outputShape=r.length===0?[1]:r,this.dispatchLayout=D(this.outputShape),M(n)<32?(this.type="plain",this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize)):(this.type="shared",this.dispatch=$(this.dispatchLayout,this.outputShape,[1,1,1])),this.inputShape=e,this.shaderKey=`argMinMax_${this.op}_${this.type}`}getUserCode(){const e=this.workgroupSize[0],t=()=>this.inputShape.length===1?"uniforms.xShape":`uniforms.xShape.${ye(this.inputShape.length-1)}`,o=()=>{let i="";if(this.outputShape.length===1)this.inputShape.length!==1&&(i+="outputCoords,");else for(let r=0;r<this.outputShape.length;r++)i+=`outputCoords.${ye(r)},`;return i};return this.type==="shared"?`
      fn DIV_CEIL(a : u32, b : u32) -> u32 {
        return ((a - 1u) / b + 1u);
      }

      ${`
      var<workgroup> xBestIndices : array<i32, ${e}>;
      var<workgroup> xBestValues : array<f32, ${e}>;
    `}

      ${R("index")} {
        let outputIndex = index / ${e};
        let reduceLength = ${t()};

        var bestIndex = i32(localId.x);
        var bestValue = uniforms.infinityValue;
        let outputCoords = getCoordsFromIndex(outputIndex);
        for (var k = i32(localId.x); k < reduceLength && outputIndex < uniforms.size;
            k = k + ${e}) {
          let candidate = getX(${o()} k);
          if (!isnan(candidate) && candidate ${this.op} bestValue) {
            bestValue = candidate;
            bestIndex = k;
          }
        }
        xBestValues[localId.x] = bestValue;
        xBestIndices[localId.x] = bestIndex;
        workgroupBarrier();

        var reduceSize = min(u32(reduceLength), ${e}u);
        for (var currentSize = reduceSize / 2u; reduceSize > 1u;
            currentSize = reduceSize / 2u) {
          let interval = DIV_CEIL(reduceSize, 2u);
          if (localId.x < currentSize) {
            let candidate = xBestValues[localId.x + interval];
            if (candidate ${this.op} bestValue) {
              bestValue = candidate;
              xBestValues[localId.x] = bestValue;
              xBestIndices[localId.x] = xBestIndices[localId.x + interval];
            }
          }
          reduceSize = interval;
          workgroupBarrier();
        }

        if (localId.x == 0u && outputIndex < uniforms.size) {
          setOutputAtIndexI32(outputIndex, xBestIndices[localId.x]);
        }
      }
    `:`
      ${R("index")} {
        if (index < uniforms.size) {
          let outputCoords = getCoordsFromIndex(index);
          var bestIndex = 0;
          var bestValue = getX(${o()} 0);
          let reduceLength = ${t()};
          for (var i = 1; i < reduceLength; i++) {
            let candidate = getX(${o()} i);
            if (candidate ${this.op} bestValue) {
              bestValue = candidate;
              bestIndex = i;
            }
          }
          setOutputAtIndexI32(index, bestIndex);
        }
      }
      `}}/**
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
 */function Zc(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{axis:r}=o;let n=Ae(r,i.shape);const a=ht(n,i.shape.length);let u=i;const l=[];a!=null&&(u=fe({inputs:{x:i},backend:t,attrs:{perm:a}}),l.push(u),n=pt(n.length,u.shape.length)),Zt("argMax",[n[0]],u.shape.length);const d=new Ii(u.shape,n[0],"max"),c=[{type:"float32",data:[Number.NEGATIVE_INFINITY]}],h=t.runWebGPUProgram(d,[u],"int32",c);return l.forEach(p=>t.disposeData(p.dataId)),h}const Jc={kernelName:jo,backendName:"webgpu",kernelFunc:Zc};/**
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
 */function eh(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{axis:r}=o;let n=Ae(r,i.shape);const a=ht(n,i.shape.length);let u=i;const l=[];a!=null&&(u=fe({inputs:{x:i},backend:t,attrs:{perm:a}}),l.push(u),n=pt(n.length,u.shape.length)),Zt("argMin",[n[0]],u.shape.length);const d=new Ii(u.shape,n[0],"min"),c=[{type:"float32",data:[Number.POSITIVE_INFINITY]}],h=t.runWebGPUProgram(d,[u],"int32",c);return l.forEach(p=>t.disposeData(p.dataId)),h}const th={kernelName:Qo,backendName:"webgpu",kernelFunc:eh};/**
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
 */const sh=U({opType:P.ASIN}),ih={kernelName:Zo,backendName:"webgpu",kernelFunc:sh};/**
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
 */const oh=U({opType:P.ASINH}),rh={kernelName:Jo,backendName:"webgpu",kernelFunc:oh};/**
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
 */const nh=U({opType:P.ATAN}),ah={kernelName:er,backendName:"webgpu",kernelFunc:nh};/**
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
 */const uh=j({opType:T.ATAN2}),lh={kernelName:tr,backendName:"webgpu",kernelFunc:uh};/**
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
 */const dh=U({opType:P.ATANH}),ch={kernelName:sr,backendName:"webgpu",kernelFunc:dh};/**
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
 */class hh{constructor(e){this.variableNames=["x"],this.uniforms="strides : vec2<i32>,",this.workgroupSize=[256,1,1],this.size=!0,this.outputShape=e.outShape,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="poolWithFilterSizeEqualsOne"}getUserCode(){return`
      ${R("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let batch = coords[0];
          let d = coords[3];

          let xRCCorner = coords.yz * uniforms.strides;
          let xRCorner = xRCCorner.x;
          let xCCorner = xRCCorner.y;

          let value = getX(batch, xRCorner, xCCorner, d);
          setOutputAtIndex(index, value);
        }
      }
    `}}/**
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
 */class lt{constructor(e,t,o=!1,i=!1,r=!1){if(this.variableNames=["x"],this.uniforms="strides : vec2<i32>, pads : vec2<i32>, dilations : vec2<i32>, convDims : vec2<i32>, filterDims : vec2<i32>,",this.workgroupSize=[128,1,1],this.size=!0,t==="avg"&&o)throw new Error("Cannot compute positions for average pool.");this.outputShape=e.outShape,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.poolType=t,this.computePositions=o,this.flattenPositions=i,this.includeBatchIndex=r,this.shaderKey=`pool2D_${t}_${o}_${i}_${r}`}getUserCode(){let e;this.poolType==="avg"?e="resultValue = resultValue + value; count = count + 1.0;":this.computePositions?e=`let currMaxValue = mix(value, maxValue, maxValueFound);
      if (value >= currMaxValue) {
        maxValue = value;
        maxValueFound = 1.0;
        maxPosition = ${this.flattenPositions?this.includeBatchIndex?"((batch * uniforms.xShape[1] + xR) * uniforms.xShape[2] + xC) * uniforms.xShape[3] + d":"(xR * uniforms.xShape[2] + xC) * uniforms.xShape[3] + d":"wR * uniforms.filterDims.y + wC"};
      }`:e="resultValue = max(value, resultValue);";let t="resultValue";return this.poolType==="avg"&&(t="resultValue / max(count, 1.0)"),`
      ${R("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
          let batch = coords[0];
          let d = coords[3];
          let xRCCorner = vec2<i32>(coords.yz) * uniforms.strides - uniforms.pads;
          let xRCorner = xRCCorner.x;
          let xCCorner = xRCCorner.y;

          ${this.computePositions?`var maxValue = 0.0;
            var maxValueFound = 0.0;
            var maxPosition = 0;`:`var resultValue = ${this.poolType==="avg"?"0.0":"-1.0 / pow(10.0, -20.0)"};`}

          var count = 0.0;
          for (var wR = 0; wR < uniforms.filterDims.x; wR = wR + uniforms.dilations.x) {
            let xR = xRCorner + wR;

            if (xR < 0 || xR >= uniforms.convDims.x) {
              continue;
            }

            for (var wC = 0; wC < uniforms.filterDims.y; wC = wC + uniforms.dilations.y) {
              let xC = xCCorner + wC;
              if (xC < 0 || xC >= uniforms.convDims.y) {
                continue;
              }

              let value = getX(batch, xR, xC, d);
              ${e}
            }
          }

          ${this.computePositions?"setOutputAtIndexI32(index, maxPosition);":`setOutputAtIndex(index, ${t});`}
        }
      }
    `}}class ns{constructor(e,t,o=!1,i=!1,r=!1){if(this.variableNames=["x"],this.uniforms="strides : vec3<i32>, pads : vec3<i32>, convDims : vec3<i32>, filterDims : vec3<i32>,",this.workgroupSize=[128,1,1],this.size=!0,t==="avg"&&o)throw new Error("Cannot compute positions for average pool.");this.outputShape=e.outShape,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.poolType=t,this.computePositions=o,this.flattenPositions=i,this.includeBatchIndex=r,this.shaderKey=`pool3D_${t}_${o}_${i}_${r}`}getUserCode(){let e;this.poolType==="avg"?e="resultValue += value; count += 1.0;":this.computePositions?e=`let currMaxValue = mix(value, maxValue, maxValueFound);
      if (value >= currMaxValue) {
        maxValue = value;
        maxValueFound = 1.0;
        maxPosition = ${this.flattenPositions?this.includeBatchIndex?"(((batch * uniforms.xShape.y + xD) * uniforms.xShape.z + xR) * uniforms.xShape.w + xC) * uniforms.xShape.u + ch":"((xD * uniforms.xShape.z + xR) * uniforms.xShape.w + xC) * uniforms.xShape.u + ch":"wD * uniforms.filterDims.y * uniforms.filterDims.y + wR * uniforms.filterDims.z + wC"};
      }`:e="resultValue = max(value, resultValue);";let t="resultValue";return this.poolType==="avg"&&(t="resultValue / max(count, 1.0)"),`
      ${R("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let batch = coords.x;
          let ch = coords.u;

          let xCorner = vec3<i32>(coords.y, coords.z, coords.w) * uniforms.strides - uniforms.pads;
          let xDCorner = xCorner.x;
          let xRCorner = xCorner.y;
          let xCCorner = xCorner.z;

          ${this.computePositions?`var maxValue = 0.0;
            var maxValueFound = 0.0;
            var maxPosition = 0;`:`var resultValue = ${this.poolType==="avg"?"0.0":"-1.0 / pow(10.0, -20.0)"};`}

          var count = 0.0;
          for (var wD = 0; wD < uniforms.filterDims.x; wD++) {
            let xD = xDCorner + wD;
            if (xD < 0 || xD >= uniforms.convDims.x) {
              continue;
            }

            for (var wR = 0; wR < uniforms.filterDims.y; wR++) {
              let xR = xRCorner + wR;
              if (xR < 0 || xR >= uniforms.convDims.y) {
                continue;
              }

              for (var wC = 0; wC < uniforms.filterDims.z; wC++) {
                let xC = xCCorner + wC;
                if (xC < 0 || xC >= uniforms.convDims.z) {
                  continue;
                }

                let value = getX(batch, xD, xR, xC, ch);
                ${e}
              }
            }
          }

          ${this.computePositions?"setOutputAtIndexI32(index, maxPosition);":`setOutputAtIndex(index, ${t});`}
        }
      }
    `}}/**
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
 */function Pi(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{reductionIndices:r,keepDims:n}=o;return Te(i,r,n,"max",t)}const ph={kernelName:ir,backendName:"webgpu",kernelFunc:Pi};/**
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
 */function Ri(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{keepDims:r,axis:n}=o;return Te(i,n,r,"mean",t)}const fh={kernelName:or,backendName:"webgpu",kernelFunc:Ri};/**
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
 */function $i(s,e,t,o){if(e.filterWidth===1&&e.filterHeight===1&&Ke(e.inShape,e.outShape))return ae({inputs:{x:s},backend:o});if(e.filterWidth===e.inWidth&&e.filterHeight===e.inHeight&&e.batchSize===1&&e.padInfo.type==="VALID"){const n=s.shape.length,a=z({inputs:{x:s},backend:o,attrs:{shape:[s.shape[n-3]*s.shape[n-2],s.shape[n-1]]}});let u;t==="avg"?u=Ri({inputs:{x:a},backend:o,attrs:{axis:0,keepDims:!1}}):(G(t==="max",()=>`Invalid pool type ${t}`),u=Pi({inputs:{x:a},backend:o,attrs:{reductionIndices:0,keepDims:!1}}));const l=z({inputs:{x:u},backend:o,attrs:{shape:e.outShape}});return o.disposeData(a.dataId),o.disposeData(u.dataId),l}let i;const r=[{type:"int32",data:[e.strideHeight,e.strideWidth]}];return e.filterHeight===1&&e.filterWidth===1?i=new hh(e):(t==="avg"?i=new lt(e,"avg"):(G(t==="max",()=>`Invalid pool type ${t}`),i=new lt(e,"max")),r.push({type:"int32",data:[e.padInfo.top,e.padInfo.left]},{type:"int32",data:[e.dilationHeight,e.dilationWidth]},{type:"int32",data:[e.inHeight,e.inWidth]},{type:"int32",data:[e.effectiveFilterHeight,e.effectiveFilterWidth]})),o.runWebGPUProgram(i,[s],s.dtype,r)}/**
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
 */function mh(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{filterSize:r,strides:n,pad:a,dimRoundingMode:u}=o,d=ft(i.shape,r,n,1,a,u);return $i(i,d,"avg",t)}const gh={kernelName:rr,backendName:"webgpu",kernelFunc:mh};/**
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
 */function xh(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{filterSize:r,strides:n,pad:a,dataFormat:u,dimRoundingMode:l}=o,d=[1,1,1],c=It(i.shape,r,n,d,a,l,u),h=new ns(c,"avg"),p=[{type:"int32",data:[c.strideDepth,c.strideHeight,c.strideWidth]},{type:"int32",data:[c.padInfo.front,c.padInfo.top,c.padInfo.left]},{type:"int32",data:[c.inDepth,c.inHeight,c.inWidth]},{type:"int32",data:[c.effectiveFilterDepth,c.effectiveFilterHeight,c.effectiveFilterWidth]}];return t.runWebGPUProgram(h,[i],i.dtype,p)}const yh={kernelName:nr,backendName:"webgpu",kernelFunc:xh};/**
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
 */class wh{constructor(e){this.variableNames=["dy"],this.uniforms=`strides : vec2<i32>, pads : vec2<i32>, dilations : vec2<i32>, filterDims : vec2<i32>,
       outHeight : i32, outWidth : i32, avgMultiplier : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.inShape,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="avgPool2DBackprop"}getUserCode(){return`
      ${R("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords[0];
        let d = coords[3];

        let dyRCCorner = vec2<i32>(coords.yz) - uniforms.pads;
        let dyRCorner = dyRCCorner.x;
        let dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        for (var wR = 0; wR < uniforms.filterDims[0]; wR = wR + uniforms.dilations[0]) {
          let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[0]);

          if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
            continue;
          }
          let idyR = i32(dyR);

          for (var wC = 0; wC < uniforms.filterDims[1]; wC = wC + uniforms.dilations[1]) {
            let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[1]);

            if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
              continue;
            }
            let idyC = i32(dyC);

            let dyValue = getDy(batch, idyR, idyC, d);

            dotProd = dotProd + dyValue * uniforms.avgMultiplier;
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
    `}}class Ch{constructor(e){this.variableNames=["dy"],this.uniforms=`strides : vec3<i32>, pads : vec3<i32>, filterDims : vec3<i32>,
       outDepth : i32, outHeight : i32, outWidth : i32, avgMultiplier : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.inShape,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="avgPool3DBackprop"}getUserCode(){return`
      ${R("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords.x;
        let ch = coords.u;

        let dyCorner = vec3<i32>(coords.y, coords.z, coords.w) - uniforms.pads;
        let dyDCorner = dyCorner.x;
        let dyRCorner = dyCorner.y;
        let dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        for (var wD = 0; wD < uniforms.filterDims[0]; wD++) {
          let dyD = f32(dyDCorner + wD) / f32(uniforms.strides[0]);

          if (dyD < 0.0 || dyD >= f32(uniforms.outDepth) || fract(dyD) > 0.0) {
            continue;
          }
          let idyD = i32(dyD);

          for (var wR = 0; wR < uniforms.filterDims[1]; wR++) {
            let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[1]);

            if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
              continue;
            }
            let idyR = i32(dyR);

            for (var wC = 0; wC < uniforms.filterDims[2]; wC++) {
              let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[2]);

              if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
                continue;
              }
              let idyC = i32(dyC);

              let dyValue = getDy(batch, idyD, idyR, idyC, ch);
              dotProd += dyValue * uniforms.avgMultiplier;
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
    `}}/**
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
 */function bh(s){const{inputs:e,backend:t,attrs:o}=s,{dy:i,input:r}=e,n=r,{filterSize:a,strides:u,pad:l,dimRoundingMode:d}=o,c=It(n.shape,a,u,1,l,d),h=new Ch(c),p=1/(c.filterDepth*c.filterHeight*c.filterWidth),f=[{type:"int32",data:[c.strideDepth,c.strideHeight,c.strideWidth]},{type:"int32",data:[c.effectiveFilterDepth-1-c.padInfo.front,c.effectiveFilterHeight-1-c.padInfo.top,c.effectiveFilterWidth-1-c.padInfo.left]},{type:"int32",data:[c.effectiveFilterDepth,c.effectiveFilterHeight,c.effectiveFilterWidth]},{type:"int32",data:[c.outDepth]},{type:"int32",data:[c.outHeight]},{type:"int32",data:[c.outWidth]},{type:"float32",data:[p]}];return t.runWebGPUProgram(h,[i],n.dtype,f)}const Sh={kernelName:ar,backendName:"webgpu",kernelFunc:bh};/**
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
 */function vh(s){const{inputs:e,backend:t,attrs:o}=s,{dy:i,input:r}=e,n=r;Si([i,r],"avgPoolGrad");const{filterSize:a,strides:u,pad:l}=o,d=ft(n.shape,a,u,1,l),c=new wh(d),h=1/(d.filterHeight*d.filterWidth),p=[{type:"int32",data:[d.strideHeight,d.strideWidth]},{type:"int32",data:[d.effectiveFilterHeight-1-d.padInfo.top,d.effectiveFilterWidth-1-d.padInfo.left]},{type:"int32",data:[d.dilationHeight,d.dilationWidth]},{type:"int32",data:[d.effectiveFilterHeight,d.effectiveFilterWidth]},{type:"int32",data:[d.outHeight]},{type:"int32",data:[d.outWidth]},{type:"float32",data:[h]}];return t.runWebGPUProgram(c,[i],n.dtype,p)}const kh={kernelName:ur,backendName:"webgpu",kernelFunc:vh};/**
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
 */function Ih(s){const{inputs:e,backend:t,attrs:o}=s,{a:i,b:r}=e,{transposeA:n,transposeB:a}=o;return $t({a:i,b:r,transposeA:n,transposeB:a,backend:t})}const Ph={kernelName:lr,backendName:"webgpu",kernelFunc:Ih};/**
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
 */class Rh{constructor(e,t){this.variableNames=["source"],this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.rank=t.length,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.start=e,this.uniforms=`start : ${K(e.length)}, `,this.shaderKey="slice"}getUserCode(){const e=K(this.rank),t=$h(this.rank);let o;return this.start.length===1?o=this.outputShape.map((r,n)=>"sourceLoc = uniforms.start + coords;"):o=this.outputShape.map((r,n)=>`sourceLoc.${Gt[n]} = uniforms.start.${ye(n)} + coords.${Gt[n]};`),`
      ${R("index")} {
        if (index < uniforms.size) {
          var sourceLoc : ${e};
          let coords = getCoordsFromIndex(index);
          ${o.join(`
`)}
          setOutputAtIndex(index, getSource(${t}));
        }
      }
    `}}const Gt=["x","y","z","w","u","v"];function $h(s){if(s===1)return"sourceLoc";if(s<=6)return Gt.slice(0,s).map(e=>`sourceLoc.${e}`).join(",");throw Error(`Slicing for rank ${s} is not yet supported`)}/**
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
 */function Ze(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{begin:r,size:n}=o,[a,u]=cr(i,r,n);if(hr(i,a,u),t.shouldExecuteOnCPU([i])||i.dtype==="string"){const c=t.tensorMap.get(i.dataId),h=Ic(c.values,a,u,i.shape,i.dtype);return t.makeTensorInfo(u,i.dtype,h)}if(M(u)===0)return t.makeTensorInfo(u,i.dtype,[]);const l=new Rh(a,u),d=[{type:"int32",data:a}];return t.runWebGPUProgram(l,[i],i.dtype,d)}const Dh={kernelName:dr,backendName:"webgpu",kernelFunc:Ze};/**
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
 */const Nh=s=>{const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{blockShape:r,crops:n}=o;G(i.shape.length<=4,()=>"batchToSpaceND for rank > 4 with a WebGPU backend not implemented yet");const a=r.reduce((y,w)=>y*w),u=li(i.shape,r,a),l=di(u.length,r.length),d=ci(i.shape,r,a),c=fr(n,r.length),h=mr(d,n,r.length),p=[],f=z({inputs:{x:i},backend:t,attrs:{shape:u}}),m=fe({inputs:{x:f},backend:t,attrs:{perm:l}}),g=z({inputs:{x:m},backend:t,attrs:{shape:d}}),x=Ze({inputs:{x:g},backend:t,attrs:{begin:c,size:h}});return p.push(f),p.push(m),p.push(g),p.forEach(y=>t.disposeData(y.dataId)),x},zh={kernelName:pr,backendName:"webgpu",kernelFunc:Nh};/**
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
 */const Ah=`
  fn bincount_write(index: i32, value: f32) {
    ${ke("&result[index]","value","float32")}
  }
`,Fh=`
  fn bincount_write(index: i32, value: f32) {
    atomicStore(&result[index], bitcast<i32>(value));
  }
`;class Di{constructor(e,t,o=!1){this.outputShape=[],this.variableNames=["x"],this.uniforms="binCountSize : i32,",this.workgroupSize=[64,1,1],this.atomic=!0,this.hasWeights=!0,this.binaryOutput=!1,this.outputShape=e,this.rank=e.length,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.binaryOutput=o,o&&(this.atomic=!1),this.hasWeights=t,this.hasWeights&&this.variableNames.push("w"),this.shaderKey=`bincount_${this.hasWeights}_${this.binaryOutput}_${this.rank}`}getUserCode(){return`
    ${this.binaryOutput?Fh:Ah}
  ${R("index")} {
    ${this.rank===1?`if (index < uniforms.xShape) {
      let indexVal = i32(getX(index));
      if (indexVal < uniforms.binCountSize) {
        let value = ${this.binaryOutput?1:this.hasWeights?"getW(index)":"1."};
        bincount_write(indexVal, value);
      }
    }`:`let coord = getCoordsFromIndex(index);
    if (coordsInBounds2D(coord, uniforms.xShape)) {
      let indexVal = i32(getX(coord[0], coord[1]));
      if (indexVal < uniforms.binCountSize) {
        let value = ${this.binaryOutput?1:this.hasWeights?"getW(coord[0], coord[1])":"1."};
        bincount_write(coord.x * uniforms.binCountSize + indexVal, value);
      }
    }`}
  }
  `}}/**
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
 */function Mh(s){const{inputs:e,backend:t,attrs:o}=s,{x:i,weights:r}=e,{size:n}=o,a=M(i.shape),l=M(r.shape)>0,d=[n],c=r.dtype,h=ie({backend:t,attrs:{shape:d,value:0,dtype:c}}),p=new Di([a],l),f=[{type:"int32",data:[n]}],m=l?[i,r]:[i];return t.runWebGPUProgram(p,m,c,f,h)}const Th={kernelName:gr,backendName:"webgpu",kernelFunc:Mh};/**
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
 */class Lh{constructor(e){this.outputShape=[],this.variableNames=["s0","s1"],this.uniforms="s0Size : i32, s1Size : i32, ",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[e],this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="broadcastArgs"}getUserCode(){return`
  ${R("index")} {
    if (index < uniforms.size) {
      var s0 = 1.0;
      var s1 = 1.0;
      let indexS0 = index - uniforms.size + uniforms.s0Size;
      let indexS1 = index - uniforms.size + uniforms.s1Size;
      if (indexS0 >= 0) {
        s0 = getS0(indexS0);
      }
      if (indexS1 >= 0) {
        s1 = getS1(indexS1);
      }

      if (s0 == 1.0) {
        setOutputAtIndex(index, s1);
      } else if (s1 == 1.0) {
        setOutputAtIndex(index, s0);
      } else if (s0 != s1) {
        setOutputAtIndex(index, uniforms.NAN);
      } else {
        setOutputAtIndex(index, s0);
      }
    }
  }
  `}}/**
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
 */function Eh(s){const{inputs:e,backend:t}=s,{s0:o,s1:i}=e;if(t.shouldExecuteOnCPU([o,i])){const d=t.tensorMap.get(o.dataId),c=t.tensorMap.get(i.dataId),h=d.values,p=c.values,f=xe(Array.from(h),Array.from(p));return t.makeTensorInfo([f.length],"int32",Int32Array.from(f))}const r=M(o.shape),n=M(i.shape),a=Math.max(r,n),u=new Lh(a),l=[{type:"int32",data:[r]},{type:"int32",data:[n]}];return t.runWebGPUProgram(u,[o,i],"int32",l)}const _h={kernelName:xr,backendName:"webgpu",kernelFunc:Eh};/**
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
 */const Ni=j({opType:T.NOT_EQUAL,dtype:"bool",cpuKernelImpl:wc}),Bh={kernelName:yr,backendName:"webgpu",kernelFunc:Ni};/**
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
 */function gt(s){const{inputs:e,backend:t}=s,{input:o}=e,i=t.tensorMap.get(o.dataId);return ae({inputs:{x:i.complexTensorInfos.real},backend:t})}const Oh={kernelName:wr,backendName:"webgpu",kernelFunc:gt};/**
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
 */function Wh(s,e){const t=new Qe(s.shape,P.TO_INT),o=e.runWebGPUProgram(t,[s],"int32");return{dataId:o.dataId,shape:o.shape,dtype:o.dtype}}/**
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
 */function Ht(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{dtype:r}=o;if(r==="complex64"){if(i.dtype==="complex64")return ae({inputs:{x:i},backend:t});const n=hi(i.shape),a=Ht({inputs:{x:i},backend:t,attrs:{dtype:"float32"}}),u=Me({inputs:{real:a,imag:n},backend:t});return n.dispose(),t.disposeData(a.dataId),u}if(i.dtype==="complex64"){const n=gt({inputs:{input:i},backend:t}),a=Ht({inputs:{x:n},backend:t,attrs:{dtype:r}});return t.disposeData(n.dataId),a}if(!br(i.dtype,r)){const n=ae({inputs:{x:i},backend:t});return{dataId:n.dataId,shape:n.shape,dtype:r}}if(t.shouldExecuteOnCPU([i])){const n=t.tensorMap.get(i.dataId).values,[a,u,l]=Jd(n,i.shape,i.dtype,r);return t.makeTensorInfo(a,u,l)}if(r==="int32")return Wh(i,t);if(r==="bool"){const n=t.makeTensorInfo([],"bool",ze("bool",1)),u=Ni({inputs:{a:i,b:n},backend:t});return t.disposeData(n.dataId),u}throw new Error(`Error in Cast: failed to cast ${i.dtype} to ${r}`)}const Vh={kernelName:Cr,backendName:"webgpu",kernelFunc:Ht};/**
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
 */const Uh=U({opType:P.CEIL,cpuKernelImpl:ec}),Gh={kernelName:Sr,backendName:"webgpu",kernelFunc:Uh};/**
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
 */class Hh{constructor(e){this.variableNames=["A"],this.uniforms="minVal : f32, maxVal : f32,",this.workPerThread=4,this.workgroupSize=[64,1,1],this.outputComponent=4,this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.shaderKey="clipVec4"}getUserCode(){return`
      ${R("index")} {
        if(index < uniforms.size) {
          let value = getAByOutputIndex(index);
          var clampedValue = clamp(
              value, vec4<f32>(uniforms.minVal), vec4<f32>(uniforms.maxVal));
          clampedValue = select(clampedValue, value, isnanVec4(value));
          setOutputAtIndex(index, clampedValue);
        }
      }
    `}}/**
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
 */class Xh{constructor(e){this.variableNames=["A"],this.uniforms="minVal : f32, maxVal : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="clip"}getUserCode(){return`
      ${R("index")} {
        if(index < uniforms.size) {
          let value = getAByOutputIndex(index);
          if (isnan(value)) {
            setOutputAtIndex(index, value);
            return;
          }
          setOutputAtIndex(index, clamp(value, uniforms.minVal, uniforms.maxVal));
        }
      }
    `}}/**
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
 */function Kh(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{clipValueMin:r,clipValueMax:n}=o;let a;const u=[{type:"float32",data:[r]},{type:"float32",data:[n]}];return M(i.shape)%4===0?a=new Hh(i.shape):a=new Xh(i.shape),t.runWebGPUProgram(a,[i],i.dtype,u)}const qh={kernelName:vr,backendName:"webgpu",kernelFunc:Kh};/**
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
 */class Yh{constructor(e){this.outputShape=[],this.variableNames=["real","imag"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="complexAbs"}getUserCode(){return`
    ${R("index")} {
      if (index < uniforms.size) {
        let re = abs(getRealByOutputIndex(index));
        let im = abs(getImagByOutputIndex(index));
        let mx = max(re, im);

        // The length function in wgsl may be not underflow-safe on some GPUs.
        // So the safe solution is to ensure underflow-safety in all cases.
        setOutputAtIndex(index, select(mx * length(vec2<f32>(1, min(re, im)/mx)), 0.0, mx == 0.0));
      }
    }
  `}}/**
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
 */function ks(s,e){return{dataId:e.dataId,dtype:e.dtype,shape:s.shape}}function jh(s){const{inputs:e,backend:t}=s,{x:o}=e,i=t.tensorMap.get(o.dataId),r=new Yh(o.shape),n=[ks(o,i.complexTensorInfos.real),ks(o,i.complexTensorInfos.imag)];return t.runWebGPUProgram(r,n,n[0].dtype)}const Qh={kernelName:kr,backendName:"webgpu",kernelFunc:jh};/**
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
 */class Zh{constructor(e){this.uniforms="",this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=nt(e,1),this.variableNames=e.map((t,o)=>`T${o}`),this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.offsetLength=e.length-1;for(let t=0;t<this.offsetLength;t++)this.uniforms+=`offset${t} : i32,`;this.shaderKey="concat"}getUserCode(){const e=[];if(this.offsetLength>0){e.push("if (yC < uniforms.offset0){ setOutputAtCoords(coords.x, coords.y, getT0(yR, yC)); }");for(let r=1;r<this.offsetLength;r++)e.push(`else if (yC < uniforms.offset${[r]}){ setOutputAtCoords(coords.x, coords.y, getT${r}(yR, yC - uniforms.offset${r-1})); }`);const o=this.offsetLength,i=this.offsetLength-1;e.push(`else { setOutputAtCoords(coords.x, coords.y, getT${o}(yR, yC - uniforms.offset${i})); }`)}else e.push("setOutputAtCoords(coords.x, coords.y, getT0(yR, yC));");return`
      ${R("index")} {
        for(var i = 0; i < ${this.workPerThread}; i = i + 1) {
          let flatIndex = index * ${this.workPerThread} + i;
          if(flatIndex < uniforms.size) {
            let coords = getCoordsFromIndex(flatIndex);
            let yR = coords.x;
            let yC = coords.y;

            ${e.join(`
        `)}
          }
        }
      }
    `}}/**
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
 */function Dt(s){const{inputs:e,backend:t}=s,{input:o}=e,i=t.tensorMap.get(o.dataId);return ae({inputs:{x:i.complexTensorInfos.imag},backend:t})}const Jh={kernelName:Ir,backendName:"webgpu",kernelFunc:Dt};/**
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
 */function it(s,e,t){const o=s[0].dtype;if(o==="complex64"){const f=s.map(w=>gt({inputs:{input:w},backend:t})),m=s.map(w=>Dt({inputs:{input:w},backend:t})),g=it(f,e,t),x=it(m,e,t),y=Me({inputs:{real:g,imag:x},backend:t});return f.forEach(w=>t.disposeData(w.dataId)),m.forEach(w=>t.disposeData(w.dataId)),t.disposeData(g.dataId),t.disposeData(x.dataId),y}let i=t.shouldExecuteOnCPU(s);if(o==="string"&&(i=!0),i){const f=s.map(b=>{const v=[-1,M(b.shape.slice(e))];return z({inputs:{x:b},backend:t,attrs:{shape:v}})}),m=f.map(b=>({vals:t.readSync(b.dataId),shape:b.shape})),g=nt(f.map(b=>b.shape),1),x=f[0].shape[0]===1,y=tc(m,g,o,x),w=nt(s.map(b=>b.shape),e),C=t.makeTensorInfo(w,o,y);return f.forEach(b=>t.disposeData(b.dataId)),C}const r=t.device.limits.maxStorageBuffersPerShaderStage-1;if(s.length>r){const f=[];for(let g=0;g<s.length;g+=r){const x=s.slice(g,g+r);f.push(it(x,e,t))}const m=it(f,e,t);for(const g of f)t.disposeData(g.dataId);return m}const{tensors2D:n,outShape:a}=ep(s,e,t),u=n.map(f=>f.shape),l=new Zh(u),d=[],c=new Array(u.length-1);if(c.length>0){c[0]=u[0][1],d.push({type:"int32",data:[c[0]]});for(let f=1;f<c.length;f++)c[f]=c[f-1]+u[f][1],d.push({type:"int32",data:[c[f]]})}const h=t.runWebGPUProgram(l,n,n[0].dtype,d);n.forEach(f=>t.disposeData(f.dataId));const p=z({inputs:{x:h},backend:t,attrs:{shape:a}});return t.disposeData(h.dataId),p}function ep(s,e,t){const o=nt(s.map(r=>r.shape),e);return{tensors2D:s.map(r=>z({inputs:{x:r},backend:t,attrs:{shape:[M(r.shape.slice(0,e)),M(r.shape.slice(e))]}})),outShape:o}}/**
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
 */function zi(s){const{inputs:e,backend:t,attrs:o}=s,{axis:i}=o,r=Ae(i,e[0].shape)[0],n=e.map(l=>l.shape);Rr(n,r);const a=nt(e.map(l=>l.shape),r);if(M(a)===0)return t.makeTensorInfo(a,e[0].dtype,[]);const u=e.filter(l=>M(l.shape)>0);return u.length===1?ae({inputs:{x:u[0]},backend:t}):it(u,r,t)}const tp={kernelName:Pr,backendName:"webgpu",kernelFunc:zi};/**
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
 */function sp(s,e,t,o,i=!1,r=null,n=!1,a=4,u=4,l=4){const d=k=>{switch(k){case 1:return"resData = f32(x[xIndex]);";case 3:return"resData = vec3<f32>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);";case 4:return"resData = vec4<f32>(x[xIndex / 4]);";default:throw new Error(`innerElementSize ${k} is not supported.`)}},c=k=>{switch(k){case 1:return"return f32(W[row * uniforms.wShape[3] + col]);";case 4:return"return vec4<f32>(W[(row * uniforms.wShape[3] + col) / 4]);";default:throw new Error(`innerElementSize ${k} is not supported.`)}},h=s?`
      let coord = vec4<i32>(batch, xRow, xCol, xCh);
      `:`
      let coord = vec4<i32>(batch, xCh, xRow, xCol);
      `,p=s?`
      let coords = vec4<i32>(
        batch,
        row / outWidth,
        row % outWidth,
        col);
      `:`
      let coords = vec4<i32>(
        batch,
        row,
        col / outWidth,
        col % outWidth);
      `,f=s?"uniforms.xShape[1]":"uniforms.xShape[2]",m=s?"uniforms.xShape[2]":"uniforms.xShape[3]",g=s?"row":"col",x=s?"col":"row",y=`
      let inChannels = uniforms.wShape[2];
      let outWidth = ${s?"uniforms.outShape[2]":"uniforms.outShape[3]"};
      let outRow = ${g} / outWidth;
      let outCol = ${g} % outWidth;

      let WRow = ${x} / (uniforms.filterDims[1] * inChannels);
      let WCol = ${x} / inChannels % uniforms.filterDims[1];
      let xRow = outRow * uniforms.strides[0] + uniforms.dilations[0] * WRow - uniforms.pads[0];
      let xCol = outCol * uniforms.strides[1] + uniforms.dilations[1] * WCol - uniforms.pads[1];
      let xCh = ${x} % inChannels;
      var resData = ${_(a)}(0.0);
      // The bounds checking is always needed since we use it to pad zero for
      // the 'same' padding type.
      if (xRow >= 0 && xRow < ${f} && xCol >= 0 && xCol < ${m}) {
        ${h}
        let xIndex = getIndexFromCoords4D(coord, uniforms.xShape);
        ${d(a)}
      }
      return resData;`,w=s?e&&o?`
      ${y}`:`
      if (row < uniforms.dimAOuter && col < uniforms.dimInner) {
        ${y}
      }
      return ${_(a)}(0.0);`:o&&t?`
      ${y}`:`
      if (row < uniforms.dimInner && col < uniforms.dimBOuter) {
        ${y}
      }
      return ${_(a)}(0.0);`,C=`${c(u)}`,b=_(l),S=_(s?a:u),v=_(s?u:a);return`
      ${we(r,n,l===4,4)}
      fn mm_readA(batch: i32, row : i32, col : i32) -> ${S} {
        ${s?w:C}
      }

      fn mm_readB(batch: i32, row : i32, col : i32) -> ${v} {
        ${s?C:w}
      }

      fn mm_write(batch: i32, row : i32, col : i32, valueIn : ${b}) {
        if (row < uniforms.dimAOuter && col < uniforms.dimBOuter)
        {
        var value = valueIn;
        let outWidth = ${s?"uniforms.outShape[2]":"uniforms.outShape[3]"};
        ${p}
        ${Fe(i,r)}
        setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
        }
      }`}class ip{constructor(e,t,o,i,r=!1,n=null,a=!1,u=!1){this.variableNames=["x","W"],this.uniforms="filterDims : vec2<i32>, pads : vec2<i32>, strides : vec2<i32>, dilations : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.outputShape=e.outShape,this.isChannelsLast=e.dataFormat==="channelsLast",this.isVec4=((e.inChannels%4===0||e.inChannels%3===0)&&this.isChannelsLast||e.outWidth%4===0&&!this.isChannelsLast)&&e.outChannels%4===0,this.dispatchLayout=this.isChannelsLast?{x:[3],y:[1,2],z:[0]}:{x:[2,3],y:[1],z:[0]},this.workgroupSize=wi(this.dispatchLayout,this.outputShape,this.isVec4),this.elementsPerThread=Ci(this.dispatchLayout,this.outputShape,this.isVec4),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize,this.elementsPerThread),this.isVec4?(this.outputComponent=4,this.isChannelsLast&&e.inChannels%4!==0?(this.innerElementSize=3,this.variableComponents=[1,4]):(this.innerElementSize=4,this.variableComponents=[4,4]),r&&(this.variableNames.push("bias"),this.variableComponents.push(4)),a&&(this.variableNames.push("preluActivationWeights"),this.variableComponents.push(4))):(this.innerElementSize=this.elementsPerThread[0],r&&this.variableNames.push("bias"),a&&this.variableNames.push("preluActivationWeights")),this.sequentialAccessByThreads=u,this.addBias=r,this.activation=n,this.hasPreluActivationWeights=a,this.tileAOuter=this.workgroupSize[1]*this.elementsPerThread[1],this.tileBOuter=this.workgroupSize[0]*this.elementsPerThread[0],this.tileInner=Math.max(this.workgroupSize[0]*this.innerElementSize,this.workgroupSize[1]),this.fitAOuter=t%this.tileAOuter===0,this.fitBOuter=o%this.tileBOuter===0,this.fitInner=i%this.tileInner===0,this.shaderKey=`conv2DMM_${this.elementsPerThread}_${this.activation}}_${this.fitAOuter}_${this.fitBOuter}_${this.fitInner}_${this.isVec4}_${this.innerElementSize}_${this.isChannelsLast}_${this.sequentialAccessByThreads}`}getUserCode(){const e=this.isVec4?Pt(this.elementsPerThread,this.workgroupSize,!this.isChannelsLast,this.tileInner):Rt(this.elementsPerThread,this.workgroupSize,!this.isChannelsLast,this.tileInner,!1,null,this.sequentialAccessByThreads),t=this.isVec4?[this.innerElementSize,4,4]:[1,1,1];return`
    ${sp(this.isChannelsLast,this.fitAOuter,this.fitBOuter,this.fitInner,this.addBias,this.activation,this.hasPreluActivationWeights,t[0],t[1],t[2])}
    ${e}
  `}}/**
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
 */class op{constructor(e,t=!1,o=null,i=!1){this.variableNames=["x","W"],this.uniforms="filterDims: vec2<i32>, pads: vec2<i32>, strides: vec2<i32>, dilations: vec2<i32>,",this.workgroupSize=[4,4,8],this.outputShape=e.outShape,this.isChannelsLast=e.dataFormat==="channelsLast",this.dispatchLayout=this.isChannelsLast?{x:[2],y:[1],z:[0,3]}:{x:[3],y:[2],z:[0,1]},this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.addBias=t,this.activation=o,this.hasPreluActivationWeights=i,t&&this.variableNames.push("bias"),i&&this.variableNames.push("preluActivationWeights"),this.shaderKey=`conv2dnaive_${this.activation}_${this.isChannelsLast}`}getUserCode(){return`
       ${we(this.activation,this.hasPreluActivationWeights,!1,4)}
       fn readInp(batch : i32, row : i32, col : i32, chan : i32) -> f32{
         let coords = vec4<i32>(batch, row, col, chan);
         if (coordsInBounds4D(coords, uniforms.xShape)) {
           return  getX(batch, row, col, chan);
         } else {
          return 0.0;
         }
       }
       fn readFilt(row : i32, col : i32, xChannel : i32, outChannel : i32) -> f32{
         let coords = vec4<i32>(row, col, xChannel, outChannel);
         if(coordsInBounds4D(coords, uniforms.wShape)) {
           return getW(row, col, xChannel, outChannel);
          } else {
            return 0.0;
          }
       }
       fn writeResult(batch : i32, row : i32, col : i32, chan : i32, valueIn : f32) {
         let coords = ${this.isChannelsLast?"vec4<i32>(batch, row, col, chan);":"vec4<i32>(batch, chan, row, col);"}
         if (coordsInBounds4D(coords, uniforms.outShape)) {
           var value = valueIn;
           ${Fe(this.addBias,this.activation)}
           setOutputAtCoords(coords.x, coords.y, coords.z, coords.w, value);
         }
       }
       ${R("index")} {
         let coords = getOutputCoords();
         let batch = coords[0];
         let outChannel = ${this.isChannelsLast?"coords[3];":"coords[1];"}
         let outRow = ${this.isChannelsLast?"coords[1];":"coords[2];"}
         let outCol = ${this.isChannelsLast?"coords[2];":"coords[3];"}
         var acc : f32 = 0.0;
         for (var row = 0; row < uniforms.filterDims[0]; row = row + 1) {
           for (var col = 0; col < uniforms.filterDims[1]; col = col + 1) {
             let xRow = outRow * uniforms.strides[0] + uniforms.dilations[0] * row - uniforms.pads[0];
             let xCol = outCol * uniforms.strides[1] + uniforms.dilations[1] * col - uniforms.pads[1];
             for (var xChannel = 0; xChannel < ${this.isChannelsLast?"uniforms.xShape[3];":"uniforms.xShape[1];"} xChannel = xChannel + 1) {
               ${this.isChannelsLast?"let v = readInp(batch, xRow, xCol, xChannel);":"let v = readInp(batch, xChannel, xRow, xCol);"}
               let f = readFilt(row, col, xChannel, outChannel);
               acc = acc + v * f;
             }
           }
         }
         writeResult(batch, outRow, outCol, outChannel, acc);
       }
     `}}/**
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
 */class rp{constructor(e,t){this.variableNames=["x"],this.uniforms=`pads : vec2<i32>, strides : vec2<i32>, dilations : vec2<i32>, outWidth : i32, itemsPerBlockRow : i32,
       inChannels : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.isChannelsLast=t,this.shaderKey=`im2col_${this.isChannelsLast}`}getUserCode(){const e=this.isChannelsLast?1:2,t=this.isChannelsLast?2:3,o=this.isChannelsLast?"coords[1]":"coords[2]",i=this.isChannelsLast?"coords[2]":"coords[1]",r=this.isChannelsLast?"getX(batch, xRow, xCol, ch)":"getX(batch, ch, xRow, xCol)";return`
    ${R("index")} {
      let coords = getCoordsFromIndex(index);
      if(index < uniforms.size) {
        let batch = coords[0];
        let row = ${o};
        let col = ${i};
        let offsetY = (row / uniforms.outWidth) * uniforms.strides[0] - uniforms.pads[0];
        let xRow = offsetY + uniforms.dilations[0] * (col / uniforms.itemsPerBlockRow);
        var value = 0.0;
        if(xRow < uniforms.xShape[${e}] && xRow >= 0) {
          let offsetX = (row % uniforms.outWidth) * uniforms.strides[1] -
              uniforms.pads[1];
          let xCol = offsetX + uniforms.dilations[1] * ((col %
              uniforms.itemsPerBlockRow) / uniforms.inChannels);
          let ch = col % uniforms.inChannels;
          if(xCol < uniforms.xShape[${t}] && xCol >= 0) {
            value = ${r};
          }
        }
        setOutputAtIndex(index, value);
      }
    }
   `}}/**
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
 */function bt(s,e){const t=s.length;return t>=3?e?[...s.slice(0,-3),s[t-3]*s[t-2],s[t-1]]:[...s.slice(0,-3),s[t-3],s[t-2]*s[t-1]]:!e&&t===1&&s[0]>1?[s[0],1]:null}function np({x:s,filter:e,convInfo:t,backend:o,bias:i=null,preluActivationWeights:r=null,leakyreluAlpha:n=0,activation:a=null}){const u=t.dataFormat==="channelsLast",l=!u,d=!1,c=u&&t.filterHeight===t.inHeight&&t.filterWidth===t.inWidth&&t.padInfo.type==="VALID",h=[];let p,f;if(c){const x=t.inHeight*t.inWidth*t.inChannels;p=z({inputs:{x:s},backend:o,attrs:{shape:[1,t.batchSize,x]}}),f=z({inputs:{x:e},backend:o,attrs:{shape:[1,x,t.outChannels]}})}else p=z({inputs:{x:s},backend:o,attrs:{shape:u?[t.batchSize,t.inHeight*t.inWidth,t.inChannels]:[t.batchSize,t.inChannels,t.inHeight*t.inWidth]}}),f=z({inputs:{x:e},backend:o,attrs:{shape:[1,t.inChannels,t.outChannels]}});if(h.push(p),h.push(f),r!=null){const x=bt(r.shape,u);x!=null&&(r=z({inputs:{x:r},backend:o,attrs:{shape:x}}),h.push(r))}if(i!=null){const x=bt(i.shape,u);x!=null&&(i=z({inputs:{x:i},backend:o,attrs:{shape:x}}),h.push(i))}const m=$t({a:u?p:f,b:u?f:p,transposeA:l,transposeB:d,backend:o,bias:i,activation:a,preluActivationWeights:r,leakyreluAlpha:n}),g=z({inputs:{x:m},backend:o,attrs:{shape:t.outShape}});h.push(m);for(const x of h)o.disposeData(x.dataId);return g}function ap({x:s,filter:e,convInfo:t,backend:o,bias:i=null,preluActivationWeights:r=null,leakyreluAlpha:n=0,activation:a=null}){const{filterWidth:u,filterHeight:l,inChannels:d,strideWidth:c,strideHeight:h,padInfo:p,outWidth:f,outHeight:m,dilationWidth:g,dilationHeight:x,dataFormat:y}=t,w=y==="channelsLast",C=u*l*d,b=m*f,S=w?[t.batchSize,b,C]:[t.batchSize,C,b],v=new rp(S,w),I=[{type:"int32",data:[p.top,p.left]},{type:"int32",data:[h,c]},{type:"int32",data:[x,g]},{type:"int32",data:[f]},{type:"int32",data:[d*u]},{type:"int32",data:[d]}],k=o.runWebGPUProgram(v,[s],s.dtype,I),N=[];N.push(k);const A=z({inputs:{x:e},backend:o,attrs:{shape:[1,C,-1]}});if(N.push(A),r!=null){const V=bt(r.shape,w);V!=null&&(r=z({inputs:{x:r},backend:o,attrs:{shape:V}}),N.push(r))}if(i!=null){const V=bt(i.shape,w);V!=null&&(i=z({inputs:{x:i},backend:o,attrs:{shape:V}}),N.push(i))}const E=$t({a:w?k:A,b:w?A:k,transposeA:!w,transposeB:!1,backend:o,bias:i,activation:a,preluActivationWeights:r,leakyreluAlpha:n}),B=z({inputs:{x:E},backend:o,attrs:{shape:t.outShape}});N.push(E);for(const V of N)o.disposeData(V.dataId);return B}function Ai({x:s,filter:e,convInfo:t,backend:o,bias:i=null,preluActivationWeights:r=null,leakyreluAlpha:n=0,activation:a=null}){const u=i!=null,l=r!=null,d=t.dataFormat==="channelsLast",c=d&&t.filterHeight===t.inHeight&&t.filterWidth===t.inWidth&&t.padInfo.type==="VALID",h=q().getBool("WEBGPU_USE_NAIVE_CONV2D_DEBUG");if(!h&&(c||t.filterHeight===1&&t.filterWidth===1&&t.dilationHeight===1&&t.dilationWidth===1&&t.strideHeight===1&&t.strideWidth===1&&(t.padInfo.type==="SAME"||t.padInfo.type==="VALID")))return np({x:s,filter:e,convInfo:t,backend:o,bias:i,activation:a,preluActivationWeights:r,leakyreluAlpha:n});const p=q().getNumber("WEBGPU_THRESHOLD_TO_INCREASE_WORKGROUPS_FOR_MATMUL"),f=p>-1?p:o.thresholdToIncreaseWorkgroups,m=t.batchSize*Math.ceil(t.outHeight*t.outWidth/32)*Math.ceil(t.outChannels/32);if(q().getBool("WEBGPU_CONV_SEPARATE_IM2COL_SHADER")||m<=f)return ap({x:s,filter:e,convInfo:t,backend:o,bias:i,preluActivationWeights:r,leakyreluAlpha:n,activation:a});let g;const x=[t.padInfo.top,t.padInfo.left],y=[{type:"int32",data:[t.filterHeight,t.filterWidth]},{type:"int32",data:[...x]},{type:"int32",data:[t.strideHeight,t.strideWidth]},{type:"int32",data:[t.dilationHeight,t.dilationWidth]}];if(h)g=new op(t,u,a,l);else{const S=d?t.outHeight*t.outWidth:t.outChannels,v=d?t.outChannels:t.outHeight*t.outWidth,I=t.filterHeight*t.filterWidth*t.inChannels;y.push({type:"int32",data:[S]},{type:"int32",data:[v]},{type:"int32",data:[I]});const k=o.adapterInfo.isIntel();g=new ip(t,S,v,I,u,a,l,k)}const w=[],C=[s,e];u&&(!d&&i.shape.length===1&&(i=z({inputs:{x:i},backend:o,attrs:{shape:[i.shape[0],1,1]}}),w.push(i)),C.push(i)),l&&(!d&&r.shape.length===1&&(r=z({inputs:{x:r},backend:o,attrs:{shape:[r.shape[0],1,1]}}),w.push(r)),C.push(r)),a==="leakyrelu"&&(y.push({type:"float32",data:[n]}),g.uniforms+=" alpha : f32,");const b=o.runWebGPUProgram(g,C,s.dtype,y);for(const S of w)o.disposeData(S.dataId);return b}/**
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
 */function up(s){const{inputs:e,attrs:t,backend:o}=s,{x:i,filter:r}=e,{strides:n,pad:a,dataFormat:u,dilations:l,dimRoundingMode:d}=t,c=mt(u),h=ve(i.shape,r.shape,n,l,a,d,!1,c);return Ai({x:i,filter:r,convInfo:h,backend:o})}const lp={kernelName:$r,backendName:"webgpu",kernelFunc:up};/**
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
 */class dp{constructor(e){this.variableNames=["dy","W"],this.uniforms="filterDims : vec2<i32>, pads : vec2<i32>, strides : vec2<i32>, outBackprop : vec4<i32>,",this.workgroupSize=[64,1,1],this.size=!1,this.isVec4=!1,this.workPerThread=1,this.outputShape=e.inShape,this.isChannelsLast=e.dataFormat==="channelsLast",this.isVec4=this.isChannelsLast&&e.outChannels%4===0&&e.inChannels%4===0,this.isVec4?(this.workPerThread=2,this.outputComponent=4,this.workgroupSize=[4,4,4],this.dispatchLayout={x:[3],y:[2],z:[0,1]},this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize,[4,this.workPerThread,1])):(this.size=!0,this.workPerThread=1,this.workgroupSize=[64,1,1],this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize)),this.shaderKey=`conv2DDerInput_${this.isChannelsLast}_${this.isVec4}_${this.workPerThread}`}getUserCode(){const e=this.isChannelsLast?1:2,t=this.isChannelsLast?2:3,o=this.isChannelsLast?3:1,i=`
    ${R()} {
      let batch = i32(globalId.z) / uniforms.outShape[1];
      let r = i32(globalId.z) % uniforms.outShape[1];
      let c = i32(globalId.y) * ${this.workPerThread};
      let d1 = i32(globalId.x) * 4;

      let dyCorner = vec2<i32>(r, c) - uniforms.pads;

      // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
      // ? = to be determined. : = across all values in that axis.
      var dotProd: array<vec4<f32>, ${this.workPerThread}>;
      for (var i = 0; i < ${this.workPerThread}; i++) {
        dotProd[i] = vec4<f32>(0.0);
      }
      for (var wR = 0; wR < uniforms.filterDims.x; wR = wR + 1) {
        let dyR = f32(dyCorner.x + wR) / f32(uniforms.strides.x);
        let wRPerm = uniforms.filterDims.x - 1 - wR;
        if (dyR < 0.0 || dyR >= f32(uniforms.outBackprop[1]) ||
            fract(dyR) > 0.0) {
          continue;
        }
        let idyR = i32(dyR);

        for (var wC = 0; wC < uniforms.filterDims.y; wC = wC + 1) {
          let dyC = f32(dyCorner.y + wC) / f32(uniforms.strides.y);
          let dyC2 = f32(dyCorner.y + 1 + wC) / f32(uniforms.strides.y);
          let wCPerm = uniforms.filterDims.y - 1 - wC;
          var bDyCVal = true;
          var bDyCVal2 = true;
          if (dyC < 0.0 || dyC >= f32(uniforms.outBackprop[2]) ||
              fract(dyC) > 0.0) {
            bDyCVal = false;
          }
          if (dyC2 < 0.0 || dyC2 >= f32(uniforms.outBackprop[2]) ||
              fract(dyC2) > 0.0) {
            bDyCVal2 = false;
          }

          let idyC = i32(dyC);
          let idyC2 = i32(dyC2);
          if (bDyCVal && bDyCVal2) {
            let d2Length = uniforms.outBackprop[3];
            for (var d2 = 0; d2 < d2Length; d2 = d2 + 4) {
              let wValue0 = getW(wRPerm, wCPerm, d1, d2);
              let wValue1 = getW(wRPerm, wCPerm, d1 + 1, d2);
              let wValue2 = getW(wRPerm, wCPerm, d1 + 2, d2);
              let wValue3 = getW(wRPerm, wCPerm, d1 + 3, d2);
              var xValue =  getDy(batch, idyR, idyC, d2);
              let tmpval = vec4<f32>(dot(xValue, wValue0),
                                     dot(xValue, wValue1),
                                     dot(xValue, wValue2),
                                     dot(xValue, wValue3));
              dotProd[0] = dotProd[0] + tmpval;
              xValue = getDy(batch, idyR, idyC2, d2);
              dotProd[1] = dotProd[1] + vec4<f32>(dot(xValue, wValue0),
                                                  dot(xValue, wValue1),
                                                  dot(xValue, wValue2),
                                                  dot(xValue, wValue3));
            }
          } else if (bDyCVal) {
            let d2Length = uniforms.outBackprop[3];
            for (var d2 = 0; d2 < d2Length; d2 = d2 + 4) {
              let wValue0 = getW(wRPerm, wCPerm, d1, d2);
              let wValue1 = getW(wRPerm, wCPerm, d1 + 1, d2);
              let wValue2 = getW(wRPerm, wCPerm, d1 + 2, d2);
              let wValue3 = getW(wRPerm, wCPerm, d1 + 3, d2);
              var xValue =  getDy(batch, idyR, idyC, d2);
              let tmpval = vec4<f32>(dot(xValue, wValue0),
                                     dot(xValue, wValue1),
                                     dot(xValue, wValue2),
                                     dot(xValue, wValue3));
              dotProd[0] = dotProd[0] + tmpval;
            }
          } else if (bDyCVal2) {
            let d2Length = uniforms.outBackprop[3];
            for (var d2 = 0; d2 < d2Length; d2 = d2 + 4) {
              let wValue0 = getW(wRPerm, wCPerm, d1, d2);
              let wValue1 = getW(wRPerm, wCPerm, d1 + 1, d2);
              let wValue2 = getW(wRPerm, wCPerm, d1 + 2, d2);
              let wValue3 = getW(wRPerm, wCPerm, d1 + 3, d2);
              var xValue =  getDy(batch, idyR, idyC2, d2);
              let tmpval = vec4<f32>(dot(xValue, wValue0),
                                     dot(xValue, wValue1),
                                     dot(xValue, wValue2),
                                     dot(xValue, wValue3));
              dotProd[1] = dotProd[1] + tmpval;
            }
          }
        }
      }

      for (var i = 0; i < ${this.workPerThread}; i = i + 1) {
        let coords = vec4<i32>(batch, r, c + i, d1);
        if (coordsInBounds4D(coords, uniforms.outShape)) {
          setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], dotProd[i]);
        }
      }
    }
    `;return this.isVec4?`
    ${i}
    `:`
    ${R("index")} {
      if(index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords[0];
        let d1 = coords[${o}];

        let dyCorner = vec2<i32>(coords[${e}], coords[${t}]) - uniforms.pads;
        let dyRCorner = dyCorner.x;
        let dyCCorner = dyCorner.y;

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        for (var wR = 0; wR < uniforms.filterDims.x; wR = wR + 1) {
          let dyR = (f32(dyRCorner) + f32(wR)) / f32(uniforms.strides.x);
          let wRPerm = uniforms.filterDims.x - 1 - wR;
          if (dyR < 0.0 || dyR >= f32(uniforms.outBackprop[1]) || fract(dyR) > 0.0 ||
              wRPerm < 0) {
            continue;
          }
          let idyR = i32(dyR);

          for (var wC = 0; wC < uniforms.filterDims.y; wC = wC + 1) {
            let dyC = (f32(dyCCorner) + f32(wC)) / f32(uniforms.strides.y);
            let wCPerm = uniforms.filterDims.y - 1 - wC;
            if (dyC < 0.0 || dyC >= f32(uniforms.outBackprop[2]) ||
                fract(dyC) > 0.0 || wCPerm < 0) {
              continue;
            }
            let idyC = i32(dyC);

            for (var d2 = 0; d2 < uniforms.outBackprop[3]; d2 = d2 + 1) {
              let xValue = ${this.isChannelsLast?"getDy(batch, idyR, idyC, d2)":"getDy(batch, d2, idyR, idyC)"};
              let wValue = getW(wRPerm, wCPerm, d1, d2);
              dotProd = dotProd + xValue * wValue;
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
  `}}class cp{constructor(e){this.variableNames=["x","dy"],this.uniforms="pads : vec2<i32>, strides : vec2<i32>, batchSize : i32, outHeight : i32, outWidth : i32, inHeight : i32, inWidth : i32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.filterShape,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.isChannelsLast=e.dataFormat==="channelsLast",this.shaderKey=`conv2DDerFilter_${this.isChannelsLast}`}getUserCode(){return`
    ${R("index")} {
      if(index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let wR = coords[0];
        let wC = coords[1];
        let d1 = coords[2];
        let d2 = coords[3];

        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        for (var b = 0; b < uniforms.batchSize; b = b + 1) {
          for (var yR = 0; yR < uniforms.outHeight; yR = yR + 1) {
            let xR = wR + yR * uniforms.strides[0] - uniforms.pads[0];
            if (xR < 0 || xR >= uniforms.inHeight) {
              continue;
            }

            for (var yC = 0; yC < uniforms.outWidth; yC = yC + 1) {
              let xC = wC + yC * uniforms.strides[1] - uniforms.pads[1];

              if (xC < 0 || xC >= uniforms.inWidth) {
                continue;
              }

              if (${this.isChannelsLast}) {
                let dyValue = getDy(b, yR, yC, d2);
                let xValue = getX(b, xR, xC, d1);
                dotProd = dotProd + xValue * dyValue;
              } else {
                let dyValue = getDy(b, d2, yR, yC);
                let xValue = getX(b, d1, xR, xC);
                dotProd = dotProd + xValue * dyValue;
              }
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
  `}}class hp{constructor(e){this.variableNames=["x","dy"],this.uniforms=`pads : vec3<i32>, strides : vec3<i32>, batchSize : i32, outDepth : i32,
       outHeight : i32, outWidth : i32, inDepth : i32, inHeight : i32, inWidth : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.filterShape,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="conv3DDerFilter"}getUserCode(){return`
    ${R("index")} {
      if(index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let wF = coords.x;
        let wR = coords.y;
        let wC = coords.z;
        let d1 = coords.w;
        let d2 = coords.u;

        var dotProd = 0.0;
        for (var b = 0; b < uniforms.batchSize; b++) {
          for (var yF = 0; yF < uniforms.outDepth; yF++) {
            let xF = wF + yF * uniforms.strides[0] - uniforms.pads[0];
            if (xF < 0 || xF >= uniforms.inDepth) {
              continue;
            }

            for (var yR = 0; yR < uniforms.outHeight; yR++) {
              let xR = wR + yR * uniforms.strides[1] - uniforms.pads[1];
              if (xR < 0 || xR >= uniforms.inHeight) {
                continue;
              }

              for (var yC = 0; yC < uniforms.outWidth; yC++) {
                let xC = wC + yC * uniforms.strides[2] - uniforms.pads[2];
                if (xC < 0 || xC >= uniforms.inWidth) {
                  continue;
                }

                let dyValue = getDy(b, yF, yR, yC, d2);
                let xValue = getX(b, xF, xR, xC, d1);
                dotProd += xValue * dyValue;
              }
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
  `}}class pp{constructor(e){this.variableNames=["dy","W"],this.uniforms=`filterDims : vec3<i32>, pads : vec3<i32>, strides : vec3<i32>,
      outDepth : i32, outHeight : i32, outWidth : i32, outChannels : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.inShape,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="conv3DDerInput"}getUserCode(){return`
    ${R("index")} {
      if(index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords.x;
        let d1 = coords.u;

        let dyCorner = vec3<i32>(coords.y, coords.z, coords.w) - uniforms.pads;
        let dyFCorner = dyCorner.x;
        let dyRCorner = dyCorner.y;
        let dyCCorner = dyCorner.z;

        var dotProd = 0.0;
        for (var wF = 0; wF < uniforms.filterDims[0]; wF++) {
          let dyF = f32(dyFCorner + wF) / f32(uniforms.strides[0]);
          if (dyF < 0.0 || dyF >= f32(uniforms.outDepth) || fract(dyF) > 0.0) {
            continue;
          }
          let idyF = i32(dyF);

          let wFPerm = uniforms.filterDims[0] - 1 - wF;

          for (var wR = 0; wR < uniforms.filterDims[1]; wR++) {
            let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[1]);

            if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
              continue;
            }
            let idyR = i32(dyR);

            let wRPerm = uniforms.filterDims[1] - 1 - wR;

            for (var wC = 0; wC < uniforms.filterDims[2]; wC++) {
              let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[2]);

              if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
                continue;
              }
              let idyC = i32(dyC);

              let wCPerm = uniforms.filterDims[2] - 1 - wC;

              for (var d2 = 0; d2 < uniforms.outChannels; d2++) {
                let xValue = getDy(batch, idyF, idyR, idyC, d2);
                let wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
  `}}/**
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
 */function fp(s){const{inputs:e,backend:t,attrs:o}=s,{x:i,dy:r}=e,{strides:n,pad:a,dataFormat:u,dimRoundingMode:l,filterShape:d}=o,c=mt(u),h=ve(i.shape,d,n,1,a,l,!1,c),p=new cp(h),f=[{type:"int32",data:[h.padInfo.top,h.padInfo.left]},{type:"int32",data:[h.strideHeight,h.strideWidth]},{type:"int32",data:[h.batchSize]},{type:"int32",data:[h.outHeight]},{type:"int32",data:[h.outWidth]},{type:"int32",data:[h.inHeight]},{type:"int32",data:[h.inWidth]}];return t.runWebGPUProgram(p,[i,r],i.dtype,f)}const mp={kernelName:Dr,backendName:"webgpu",kernelFunc:fp};/**
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
 */function gp(s=4){const e=r=>{switch(r){case 1:return"return W[getIndexFromCoords4D(coord, uniforms.wShape)];";case 4:return`
            let coord1 = vec4<i32>(coordX, coordY, col + 1, rowInner);
            let coord2 = vec4<i32>(coordX, coordY, col + 2, rowInner);
            let coord3 = vec4<i32>(coordX, coordY, col + 3, rowInner);
            let v0 = W[getIndexFromCoords4D(coord, uniforms.wShape)];
            let v1 = W[getIndexFromCoords4D(coord1, uniforms.wShape)];
            let v2 = W[getIndexFromCoords4D(coord2, uniforms.wShape)];
            let v3 = W[getIndexFromCoords4D(coord3, uniforms.wShape)];
            return vec4<f32>(v0, v1, v2, v3);
            `;default:throw new Error(`innerElementSize ${r} is not supported.`)}},o=`if (row < uniforms.dimAOuter && col < uniforms.dimInner) {
        ${`
      let outRow = row / uniforms.outShape[2];
      let outCol = row % uniforms.outShape[2];

      let WRow = col / (uniforms.filterDims[1] * uniforms.outBackprop[3]);
      let WCol = col / uniforms.outBackprop[3] % uniforms.filterDims[1];
      let xR = f32(outRow - uniforms.pads[0] + WRow) / f32(uniforms.strides[0]);
      let xC = f32(outCol - uniforms.pads[1] + WCol) / f32(uniforms.strides[1]);
      if (xR < 0.0 || xR >= f32(uniforms.outBackprop[1]) || fract(xR) > 0.0) {
        return ${_(s)}(0.0);
      }
      if (xC < 0.0 || xC >= f32(uniforms.outBackprop[2]) || fract(xC) > 0.0) {
        return ${_(s)}(0.0);
      }
      let coord = vec4<i32>(
          batch,
          i32(xR),
          i32(xC),
          col % uniforms.outBackprop[3]);
      return x[getIndexFromCoords4D(coord, uniforms.xShape)/${s}];`}
      }
      return ${_(s)}(0.0);`;return`
  fn mm_readA(batch: i32, row : i32, col : i32) -> ${_(s)} {
    ${o}
  }

  fn mm_readB(batch: i32, row : i32, col : i32) -> ${_(s)} {
    let coordX = uniforms.filterDims.x - 1 -
        row / (uniforms.filterDims[1] * uniforms.outBackprop[3]);
    let coordY = uniforms.filterDims.y - 1 -
        (row / uniforms.outBackprop[3]) % uniforms.filterDims[1];
    if (row < uniforms.dimInner && col < uniforms.dimBOuter &&
        coordX >= 0 && coordY >= 0) {
      let rowInner = row % uniforms.outBackprop[3];
      let coord = vec4<i32>(coordX, coordY, col, rowInner);
      ${e(s)}
    }
    return ${_(s)}(0.0);
  }

  fn mm_write(batch: i32, row : i32, col : i32, valueInput : ${_(s)}) {
    if (row < uniforms.dimAOuter && col < uniforms.dimBOuter) {
      var value = valueInput;
      let outCoord = vec4<i32>(
          batch,
          row / uniforms.outShape[2],
          row % uniforms.outShape[2],
          col);
      result[getIndexFromCoords4D(outCoord, uniforms.outShape)/${s}] = value;
    }
  }`}class xp{constructor(e){this.variableNames=["x","W"],this.uniforms="filterDims : vec2<i32>, pads : vec2<i32>, strides : vec2<i32>, outBackprop : vec4<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.outputShape=e.inShape,G(e.dataFormat==="channelsLast",()=>"TODO: NCHW is unimplemented"),this.isVec4=e.inChannels%4===0&&e.outChannels%4===0,this.dispatchLayout={x:[3],y:[1,2],z:[0]},this.workgroupSize=wi(this.dispatchLayout,this.outputShape,this.isVec4),this.elementsPerThread=Ci(this.dispatchLayout,this.outputShape,this.isVec4),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize,this.elementsPerThread),this.isVec4&&(this.outputComponent=4,this.variableComponents=[4,1]),this.shaderKey=`conv2DDerInputMM_${this.isVec4}_${this.elementsPerThread}`}getUserCode(){const e=this.isVec4?Pt(this.elementsPerThread,this.workgroupSize):Rt(this.elementsPerThread,this.workgroupSize);return`
    ${gp(this.isVec4?4:1)}
    ${e}
    `}}/**
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
 */function yp(s){const{inputs:e,backend:t,attrs:o}=s,{dy:i,filter:r}=e,{inputShape:n,strides:a,pad:u,dataFormat:l,dimRoundingMode:d}=o,c=mt(l),h=ve(n,r.shape,a,1,u,d,!1,c),p=[{type:"int32",data:[h.filterHeight,h.filterWidth]},{type:"int32",data:[h.filterHeight-1-h.padInfo.top,h.filterWidth-1-h.padInfo.left]},{type:"int32",data:[h.strideHeight,h.strideWidth]},{type:"int32",data:[h.batchSize,h.outHeight,h.outWidth,h.outChannels]}];let f;if(q().getBool("WEBGPU_USE_NAIVE_CONV2D_TRANSPOSE")||h.dataFormat!=="channelsLast")f=new dp(h);else{f=new xp(h);const m=h.inHeight*h.inWidth,g=h.inChannels,x=h.filterHeight*h.filterWidth*h.outChannels;p.push({type:"uint32",data:[m]},{type:"uint32",data:[g]},{type:"uint32",data:[x]})}return t.runWebGPUProgram(f,[i,r],"float32",p)}const wp={kernelName:Nr,backendName:"webgpu",kernelFunc:yp};/**
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
 */class Cp{constructor(e){this.variableNames=["x","W"],this.uniforms="filterDims: vec3<i32>, pads: vec3<i32>, strides: vec3<i32>, dilations: vec3<i32>,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.outShape,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="conv3dnaive"}getUserCode(){return`
    ${R("index")} {
      if (index < uniforms.size) {
        let coords = getOutputCoords();
        let batch = coords.x;
        let d2 = coords.u;

        let xFRCCorner = vec3<i32>(coords.y, coords.z, coords.w) * uniforms.strides - uniforms.pads;
        let xFCorner = xFRCCorner.x;
        let xRCorner = xFRCCorner.y;
        let xCCorner = xFRCCorner.z;

        let inputDepthNearestVec4 = (uniforms.xShape.u / 4) * 4;
        let inputDepthVec4Remainder = uniforms.xShape.u % 4;

        var dotProd = 0.0;
        for (var wF = 0; wF < uniforms.filterDims[0]; wF++) {
          let xF = xFCorner + wF * uniforms.dilations[0];
          if (xF < 0 || xF >= uniforms.xShape.y) {
            continue;
          }

          for (var wR = 0; wR < uniforms.filterDims[1]; wR++) {
            let xR = xRCorner + wR * uniforms.dilations[1];
            if (xR < 0 || xR >= uniforms.xShape.z) {
              continue;
            }

            for (var wC = 0; wC < uniforms.filterDims[2]; wC++) {
              let xC = xCCorner + wC * uniforms.dilations[2];
              if (xC < 0 || xC >= uniforms.xShape.w) {
                continue;
              }

              for (var d1 = 0; d1 < inputDepthNearestVec4; d1 += 4) {
                let xValues = vec4<f32>(
                  getX(batch, xF, xR, xC, d1),
                  getX(batch, xF, xR, xC, d1 + 1),
                  getX(batch, xF, xR, xC, d1 + 2),
                  getX(batch, xF, xR, xC, d1 + 3)
                );
                let wValues = vec4<f32>(
                  getW(wF, wR, wC, d1, d2),
                  getW(wF, wR, wC, d1 + 1, d2),
                  getW(wF, wR, wC, d1 + 2, d2),
                  getW(wF, wR, wC, d1 + 3, d2)
                );

                dotProd += dot(xValues, wValues);
              }

              if (inputDepthVec4Remainder == 1) {
                dotProd += getX(batch, xF, xR, xC, inputDepthNearestVec4) *
                  getW(wF, wR, wC, inputDepthNearestVec4, d2);
              } else if (inputDepthVec4Remainder == 2) {
                let xValues = vec2<f32>(
                  getX(batch, xF, xR, xC, inputDepthNearestVec4),
                  getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1)
                );
                let wValues = vec2<f32>(
                  getW(wF, wR, wC, inputDepthNearestVec4, d2),
                  getW(wF, wR, wC, inputDepthNearestVec4 + 1, d2)
                );
                dotProd += dot(xValues, wValues);
              } else if (inputDepthVec4Remainder == 3) {
                let xValues = vec3<f32>(
                  getX(batch, xF, xR, xC, inputDepthNearestVec4),
                  getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                  getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2)
                );
                let wValues = vec3<f32>(
                  getW(wF, wR, wC, inputDepthNearestVec4, d2),
                  getW(wF, wR, wC, inputDepthNearestVec4 + 1, d2),
                  getW(wF, wR, wC, inputDepthNearestVec4 + 2, d2)
                );
                dotProd += dot(xValues, wValues);
              }
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }`}}/**
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
 */function bp(s){const{inputs:e,backend:t,attrs:o}=s,{x:i,filter:r}=e,{strides:n,pad:a,dilations:u}=o,l=Jt(i.shape,r.shape,n,u,a),d=[l.padInfo.front,l.padInfo.top,l.padInfo.left],c=[{type:"int32",data:[l.filterDepth,l.filterHeight,l.filterWidth]},{type:"int32",data:[...d]},{type:"int32",data:[l.strideDepth,l.strideHeight,l.strideWidth]},{type:"int32",data:[l.dilationDepth,l.dilationHeight,l.dilationWidth]}],h=new Cp(l),p=Ue(i.dtype,r.dtype);return t.runWebGPUProgram(h,[i,r],p,c)}const Sp={kernelName:zr,backendName:"webgpu",kernelFunc:bp};/**
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
 */function vp(s){const{inputs:e,backend:t,attrs:o}=s,{x:i,dy:r}=e,{strides:n,pad:a,filterShape:u}=o,l=Jt(i.shape,u,n,1,a),d=new hp(l),c=[{type:"int32",data:[l.padInfo.front,l.padInfo.top,l.padInfo.left]},{type:"int32",data:[l.strideDepth,l.strideHeight,l.strideWidth]},{type:"int32",data:[l.batchSize]},{type:"int32",data:[l.outDepth]},{type:"int32",data:[l.outHeight]},{type:"int32",data:[l.outWidth]},{type:"int32",data:[l.inDepth]},{type:"int32",data:[l.inHeight]},{type:"int32",data:[l.inWidth]}];return t.runWebGPUProgram(d,[i,r],r.dtype,c)}const kp={kernelName:Ar,backendName:"webgpu",kernelFunc:vp};/**
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
 */function Ip(s){const{inputs:e,backend:t,attrs:o}=s,{dy:i,filter:r}=e,{strides:n,pad:a,inputShape:u}=o,l=Jt(u,r.shape,n,1,a),d=new pp(l),c=[{type:"int32",data:[l.filterDepth,l.filterHeight,l.filterWidth]},{type:"int32",data:[l.filterDepth-1-l.padInfo.front,l.filterHeight-1-l.padInfo.top,l.filterWidth-1-l.padInfo.left]},{type:"int32",data:[l.strideDepth,l.strideHeight,l.strideWidth]},{type:"int32",data:[l.outDepth]},{type:"int32",data:[l.outHeight]},{type:"int32",data:[l.outWidth]},{type:"int32",data:[l.outChannels]}];return t.runWebGPUProgram(d,[i,r],i.dtype,c)}const Pp={kernelName:Fr,backendName:"webgpu",kernelFunc:Ip};/**
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
 */const Rp=U({opType:P.COS}),$p={kernelName:Mr,backendName:"webgpu",kernelFunc:Rp};/**
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
 */const Dp=U({opType:P.COSH}),Np={kernelName:Tr,backendName:"webgpu",kernelFunc:Dp};/**
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
 */class zp{constructor(e,t,o,i){this.variableNames=["Image","Boxes","BoxInd"],this.uniforms="extrapolationValue : f32,",this.workgroupSize=[64,1,1],this.size=!0;const[r]=t;this.outputShape=[r,o[0],o[1],e],this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.methodId=i==="bilinear"?1:0,this.cropHeightBiggerThan1=this.outputShape[1]>1,this.cropWidthBiggerThan1=this.outputShape[2]>1,this.shaderKey=`cropAndResize_${this.methodId}_${this.cropHeightBiggerThan1}_${this.cropWidthBiggerThan1}`}getUserCode(){const[e,t]=["f32(uniforms.imageShape[1] - 1)","f32(uniforms.imageShape[2] - 1)"],[o,i,r]=this.cropHeightBiggerThan1?[`(${e} / f32(uniforms.outShape[1] - 1))`,"(y2-y1) * height_ratio",`y1*${e} + f32(y)*(height_scale)`]:["0.0","0.0",`0.5 * (y1+y2) * ${e}`],[n,a,u]=this.cropWidthBiggerThan1?[`(${t} / f32(uniforms.outShape[2] - 1))`,"(x2-x1) * width_ratio",`x1*${t} + f32(x)*(width_scale)`]:["0.0","0.0",`0.5 * (x1+x2) * ${t}`];return`
    ${R("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let height_ratio = f32(${o});
        let width_ratio = f32(${n});
        let b = coords[0];
        let y = coords[1];
        let x = coords[2];
        let d = coords[3];
        // get box vals
        let y1 = getBoxes(b, 0);
        let x1 = getBoxes(b, 1);
        let y2 = getBoxes(b, 2);
        let x2 = getBoxes(b, 3);
        // get image in batch index
        let bInd = i32(round(getBoxInd(b)));
        if(bInd < 0 || bInd >= uniforms.outShape[0]) {
          return;
        }
        let height_scale = ${i};
        let width_scale = ${a};
        let in_y = ${r};
        if( in_y < 0.0 || in_y > ${e} ) {
          setOutputAtIndex(index, uniforms.extrapolationValue);
          return;
        }
        let in_x = ${u};
        if( in_x < 0.0 || in_x > ${t} ) {
          setOutputAtIndex(index, uniforms.extrapolationValue);
          return;
        }
        let sourceFracIndexCR = vec2<f32>(in_x,in_y);
        if(${this.methodId} == 1) {
          // Compute the four integer indices.
          let sourceFloorCR = vec2<i32>(sourceFracIndexCR);
          let sourceCeilCR = vec2<i32>(ceil(sourceFracIndexCR));
          let topLeft = getImage(bInd, sourceFloorCR.y, sourceFloorCR.x, d);
          let bottomLeft = getImage(bInd, sourceCeilCR.y, sourceFloorCR.x, d);
          let topRight = getImage(bInd, sourceFloorCR.y, sourceCeilCR.x, d);
          let bottomRight = getImage(bInd, sourceCeilCR.y, sourceCeilCR.x, d);
          let fracCR = sourceFracIndexCR - vec2<f32>(sourceFloorCR);
          let top = topLeft + (topRight - topLeft) * fracCR.x;
          let bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;
          let newValue = top + (bottom - top) * fracCR.y;
          setOutputAtIndex(index, newValue);
        } else {
          // Compute the coordinators of nearest neighbor point.
          let sourceNearestCR = vec2<i32>(floor(
            sourceFracIndexCR + vec2<f32>(0.5,0.5)));
          let newValue = getImage(
            bInd, sourceNearestCR.y, sourceNearestCR.x, d);
          setOutputAtIndex(index, newValue);
        }
      }
    }
    `}}/**
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
 */const Ap=s=>{const{inputs:e,backend:t,attrs:o}=s,{image:i,boxes:r,boxInd:n}=e,{cropSize:a,method:u,extrapolationValue:l}=o,d=new zp(i.shape[3],r.shape,a,u),c=[{type:"float32",data:[l]}];return t.runWebGPUProgram(d,[i,r,n],"float32",c)},Fp={kernelName:Lr,backendName:"webgpu",kernelFunc:Ap};/**
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
 */var dt;(function(s){s.Prod="*",s.Sum="+"})(dt||(dt={}));class Is{constructor(e,t,o,i){this.variableNames=["x"],this.uniforms="index : f32,",this.size=!0,this.workgroupSize=[128,1,1],this.outputShape=t,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.exclusive=o,this.reverse=i,this.op=e,this.shaderKey=`cum_${this.op}_${this.exclusive}_${this.reverse}`}getUserCode(){const e=this.outputShape.length,t=this.op===dt.Prod?"1.0":"0.0",o=this.exclusive?t:`getX(${Ps(e,"coords",this.op)})`,i=this.outputShape[this.outputShape.length-1];let r="",n="";return this.exclusive?(r=this.reverse?`end != ${i-1}`:"end != 0",n=this.reverse?"end + 1":"end - 1"):(r=this.reverse?`end + pow2 < ${i}`:"end >= pow2",n=this.reverse?"end + pow2":"end - pow2"),`
      ${R("index")} {
       if (index < uniforms.size) {
         var coords = getCoordsFromIndex(index);

         let end = ${Rs(e,"coords",this.op)};
         var val = ${o};
         let pow2 = i32(pow(2.0, uniforms.index));
         if (${r}) {
           let idx = ${n};
           ${Rs(e,"coords",this.op)} = idx;
           val ${this.op}= getX(${Ps(e,"coords",this.op)});
         }
         setOutputAtIndex(index, val);
       }
      }
    `}}function Ps(s,e,t){if(s===1)return`${e}`;if(s===2)return`${e}.x, ${e}.y`;if(s===3)return`${e}.x, ${e}.y, ${e}.z`;if(s===4)return`${e}.x, ${e}.y, ${e}.z, ${e}.w`;throw Error(`Cumulative ${t} for rank ${s} is not yet supported`)}function Rs(s,e,t){if(s===1)return`${e}`;if(s===2)return`${e}.y`;if(s===3)return`${e}.z`;if(s===4)return`${e}.w`;throw Error(`Cumulative ${t} for rank ${s} is not yet supported`)}/**
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
 */function Fi(s,e,t,o,i,r){const n=e.shape.length,a=ht([o],n);let u=e;a!=null&&(u=fe({inputs:{x:e},backend:t,attrs:{perm:a}}));const l=pt(1,n)[0];if(l!==n-1)throw new Error(`WebGPU cumprod shader expects an inner-most axis=${e.shape.length-1} but got axis=${o}`);const d=u.shape[l];let c=ae({inputs:{x:u},backend:t});for(let h=0;h<=Math.ceil(Math.log2(d))-1;h++){const p=new Is(s,u.shape,!1,r),f=c,m=[{type:"float32",data:[h]}];c=t.runWebGPUProgram(p,[c],c.dtype,m),t.disposeData(f.dataId)}if(i){const h=new Is(s,u.shape,i,r),p=c,f=[{type:"float32",data:[0]}];c=t.runWebGPUProgram(h,[c],c.dtype,f),t.disposeData(p.dataId)}if(a!=null){const h=pi(a),p=fe({inputs:{x:c},backend:t,attrs:{perm:h}});return t.disposeData(c.dataId),t.disposeData(u.dataId),p}return c}/**
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
 */function Mp(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{axis:r,exclusive:n,reverse:a}=o;return Fi(dt.Prod,i,t,r,n,a)}const Tp={kernelName:Er,backendName:"webgpu",kernelFunc:Mp};/**
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
 */function Lp(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{axis:r,exclusive:n,reverse:a}=o;return Fi(dt.Sum,i,t,r,n,a)}const Ep={kernelName:_r,backendName:"webgpu",kernelFunc:Lp};/**
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
 */function _p(s){const{inputs:e,backend:t,attrs:o}=s,{x:i,weights:r}=e,{size:n,binaryOutput:a}=o,u=i.shape.length===1,d=M(r.shape)>0,c=r.dtype,h=u?[i.shape[0]]:[i.shape[0],i.shape[1]],p=u?[n]:[i.shape[0],n],f=ie({backend:t,attrs:{shape:p,value:0,dtype:c}}),m=new Di(h,d,a),g=[{type:"int32",data:[n]}],x=d?[i,r]:[i];return t.runWebGPUProgram(m,x,c,g,f)}const Bp={kernelName:Br,backendName:"webgpu",kernelFunc:_p};/**
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
 */class Op{constructor(e,t){this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.uniforms="blockSize : i32,",this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`depthToSpace_${t}`,this.dataFormat=t}getUserCode(){return`
      ${R("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let b = coords[0];
          let h = ${this.getHeightCoordString()};
          let w = ${this.getWidthCoordString()};
          let d = ${this.getDepthCoordString()};

          let in_h = h / uniforms.blockSize;
          let offset_h = h % uniforms.blockSize;
          let in_w = w / uniforms.blockSize;
          let offset_w = w % uniforms.blockSize;
          let offset_d = (offset_h * uniforms.blockSize + offset_w) *
            ${this.getOutputDepthSize()};
          let in_d = d + offset_d;

          let rlt = ${this.getInputSamplingString()};
          setOutputAtIndex(index, rlt);
        }
      }`}getHeightCoordString(){return this.dataFormat==="NHWC"?"coords[1]":"coords[2]"}getWidthCoordString(){return this.dataFormat==="NHWC"?"coords[2]":"coords[3]"}getDepthCoordString(){return this.dataFormat==="NHWC"?"coords[3]":"coords[1]"}getOutputDepthSize(){return this.dataFormat==="NHWC"?"uniforms.outShape[3]":"uniforms.outShape[1]"}getInputSamplingString(){return this.dataFormat==="NHWC"?"getX(b, in_h, in_w, in_d)":"getX(b, in_d, in_h, in_w)"}}/**
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
 */function Wp(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{blockSize:r,dataFormat:n}=o,a=i.shape[0],u=n==="NHWC"?i.shape[1]:i.shape[2],l=n==="NHWC"?i.shape[2]:i.shape[3],d=n==="NHWC"?i.shape[3]:i.shape[1],c=u*r,h=l*r,p=d/(r*r),f=n==="NHWC"?[a,c,h,p]:[a,p,c,h],m=[{type:"int32",data:[r]}],g=new Op(f,n);return t.runWebGPUProgram(g,[i],i.dtype,m)}const Vp={kernelName:Or,backendName:"webgpu",kernelFunc:Wp};/**
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
 */class Up{constructor(e,t,o,i=!1,r=null,n=!1){this.variableNames=["x","W"],this.uniforms="pads : vec2<i32>, inDims : vec2<i32>,",this.workgroupSize=[16,16,1],this.outputShape=e,this.dispatchLayout={x:[3],y:[2],z:[0,1]},this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),i&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),this.addBias=i,this.activation=r,this.hasPreluActivation=n,this.filterHeight=t,this.filterWidth=o,this.shaderKey=`depthwiseNCHW_${this.activation}_${this.filterHeight}_${this.filterWidth}`}getUserCode(){const e=this.filterWidth*this.filterHeight,t=this.workgroupSize[0]*this.workgroupSize[1]*this.workgroupSize[2],o=this.workgroupSize[1]+this.filterHeight-1,i=this.workgroupSize[0]+this.filterWidth-1;return`
      ${we(this.activation,this.hasPreluActivation,!1,4)}

      var<workgroup> mm_Asub : array<array<f32, ${i}>, ${o}>;
      var<workgroup> mm_Bsub : array<array<f32, ${this.filterWidth}>, ${this.filterHeight}>;
      fn readX(batch : i32, channel : i32, row : i32, col : i32) -> f32 {
        var value = 0.0;
        if (row >=0 && row < uniforms.inDims[0] && col >=0 && col < uniforms.inDims[1])
        {
          value = getX(batch, channel, row, col);
        }
        return value;
      }

      ${R()} {
        let coords = getOutputCoords();
        let batch = coords[0];
        let xRCCorner = vec2<i32>(coords.zw) - uniforms.pads;
        let channelMul = uniforms.wShape[3];
        let d1 = coords[1] / channelMul;
        let q = coords[1] % channelMul;

        let inputRowStart = xRCCorner.x;
        let inputColStart = xRCCorner.y;

        let localRow = i32(localId.y);
        let localCol = i32(localId.x);

        // Load one tile of X into local memory.
        for (var inputRow = localRow; inputRow < ${o}; inputRow = inputRow + ${this.workgroupSize[1]}) {
          for (var inputCol = localCol; inputCol < ${i}; inputCol = inputCol + ${this.workgroupSize[0]}) {
            let rowOffset = inputRow - localRow;
            let colOffset = inputCol - localCol;
            mm_Asub[inputRow][inputCol] = readX(batch, d1, inputRowStart + rowOffset, inputColStart + colOffset);
          }
        }

        // Load one tile of W into local memory.
        var wIndex = i32(localIndex);
        ${e<t?`if (wIndex < ${e})`:`for(; wIndex < ${e}; wIndex = wIndex + ${t})`}

        {
          let wRow = wIndex / ${this.filterWidth};
          let wCol = wIndex % ${this.filterWidth};
          mm_Bsub[wRow][wCol] = getW(wRow, wCol, d1, q);
        }

        workgroupBarrier();

        var value = 0.0;
        for (var wR = 0; wR < ${this.filterHeight}; wR = wR + 1) {
          for (var wC = 0; wC < ${this.filterWidth}; wC = wC + 1) {
            let xVal = mm_Asub[localRow + wR][localCol + wC];
            let wVal = mm_Bsub[wR][wC];
            value = fma(xVal, wVal, value);
          }
        }
        ${Fe(this.addBias,this.activation)}
        if (coordsInBounds4D(coords, uniforms.outShape)) {
          setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
        }
      }
    `}}/**
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
 */class Mi{constructor(e,t=!1,o=null,i=!1){this.variableNames=["x","W"],this.uniforms="pads : vec2<i32>, inDims : vec2<i32>, virtualWidth : i32,",this.workgroupSize=[64,1,1],this.workPerThread=4,this.outputComponent=4,this.outputShape=e.outShape,this.virtualWidth=Math.ceil(this.outputShape[2]/this.workPerThread)*this.workPerThread;const r=[this.outputShape[0],this.outputShape[1],this.virtualWidth,this.outputShape[3]];this.dispatchLayout=D(r),this.dispatch=$(this.dispatchLayout,r,this.workgroupSize,[this.outputComponent*this.workPerThread,1,1]),G(e.dataFormat==="channelsLast",()=>"TODO: NCHW is unimplemented"),t&&this.variableNames.push("bias"),i&&this.variableNames.push("preluActivationWeights"),this.convInfo=e,this.addBias=t,this.activation=o,this.hasPreluActivation=i,this.shaderKey=`depthwiseVec4_${o}_${this.convInfo.filterHeight}_${this.convInfo.filterWidth}_${this.convInfo.strideHeight}_${this.convInfo.strideWidth}_${this.workPerThread}`}getUserCode(){const e=(this.workPerThread-1)*this.convInfo.strideWidth+this.convInfo.filterWidth,t=this.convInfo.strideHeight,o=this.convInfo.strideWidth;return`
      ${we(this.activation,this.hasPreluActivation,!0,4)}
      fn readX(batch : i32, row : i32, col : i32, channel : i32) -> vec4<f32> {
        var value = vec4<f32>(0.0);
        if (col >=0 && col < uniforms.inDims[1]) {
          value = getX(batch, row, col, channel);
        }
        return value;
      }

      ${R("index")} {
        let width0 = uniforms.outShape[3] / ${this.outputComponent};
        let d1 = (index % width0) * ${this.outputComponent};
        var index1 = index / width0;
        let width1 = uniforms.virtualWidth / ${this.workPerThread};
        let c = (index1 % width1) * ${this.workPerThread};
        index1 = index1 / width1;
        let r = index1 % uniforms.outShape[1];
        let batch = index1 / uniforms.outShape[1];

        let xRCCorner = vec2<i32>(r, c) * vec2<i32>(${t}, ${o}) - uniforms.pads;

        let xRCorner = xRCCorner.x;
        let xCCorner = xRCCorner.y;
        var xVals : array<vec4<f32>, ${e}>;
        var dotProd : array<vec4<f32>, ${this.workPerThread}>;
        for (var i = 0; i < ${this.workPerThread}; i++) {
          dotProd[i] = vec4<f32>(0.0);
        }

        // Use constant instead of uniform can give better performance.
        for (var wR = 0; wR < ${this.convInfo.filterHeight}; wR = wR + 1) {
          let xR = xRCorner + wR;
          if (xR >=0 && xR < uniforms.inDims[0]) {
            for (var i = 0; i < ${e}; i++) {
              xVals[i] = readX(batch, xR, xCCorner + i, d1);
            }
            for (var wC = 0; wC < ${this.convInfo.filterWidth}; wC = wC + 1) {
              let wValue = getW(wR, wC, d1, 0);
              for (var i = 0; i < ${this.workPerThread}; i++) {
                dotProd[i] = fma(xVals[i * ${o} + wC], wValue, dotProd[i]);
              }
            }
          }
        }

        for (var i = 0; i < ${this.workPerThread}; i = i + 1) {
          let coords = vec4<i32>(batch, r, c + i, d1);
          if (coordsInBounds4D(coords, uniforms.outShape)) {
            var value = dotProd[i];
            ${Fe(this.addBias,this.activation)}
            setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
          }
        }
      }
    `}}/**
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
 */class Ti{constructor(e,t=!1,o=null,i=!1){this.variableNames=["x","W"],this.uniforms=`pads : vec2<i32>, inDims : vec2<i32>, filterHeight : i32,
      filterWidth : i32, strides : vec2<i32>, dilations : vec2<i32>,`,this.workgroupSize=[256,1,1],this.size=!0,this.outputShape=e.outShape,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.isChannelsLast=e.dataFormat==="channelsLast",t&&this.variableNames.push("bias"),i&&this.variableNames.push("preluActivationWeights"),this.convInfo=e,this.addBias=t,this.activation=o,this.hasPreluActivation=i,this.shaderKey=`depthwise_${this.activation}_${this.isChannelsLast}`}getUserCode(){const e=this.isChannelsLast?"getX(batch, xR, xC, d1);":"getX(batch, d1, xR, xC);";return`
      ${we(this.activation,this.hasPreluActivation,!1,4)}

      ${R("index")} {
        if (index < uniforms.size) {
          let coords = getOutputCoords();
          let batch = coords[0];
          let xRCCorner = vec2<i32>(coords.${this.isChannelsLast?"yz":"zw"}) * uniforms.strides - uniforms.pads;
          let d2 = coords[${this.isChannelsLast?3:1}];
          let channelMul = uniforms.wShape[3];
          let d1 = d2 / channelMul;
          let q = d2 % channelMul;

          let inputRowStart = xRCCorner.x;
          let inputColStart = xRCCorner.y;
          let inputRowEnd = inputRowStart + uniforms.filterHeight *
              uniforms.dilations[0];
          let inputColEnd = inputColStart + uniforms.filterWidth *
              uniforms.dilations[1];

          // Convolve x(?, ?, d1)|x(d1, ?, ?) with w(:, :, d1, q) to get
          // y(yR, yC, d2)|y(d2, yR, yC). ? = to be determined. : = across all
          // values in that axis. x(?, ?, d1) and y(yR, yC, d2) is for NHWC.
          // x(d1, ?, ?) and y(d2, yR, yC) is for NCHW.
          var value = 0.0;

          // Extract if checking out of for loop for performance.
          if (inputRowStart >= 0 && inputColStart >= 0 &&
            inputRowEnd < uniforms.inDims[0] &&
                inputColEnd < uniforms.inDims[1]) {
              for (var wR = 0; wR < uniforms.filterHeight; wR = wR + 1) {
                let xR = inputRowStart + wR * uniforms.dilations[0];

                for (var wC = 0; wC < uniforms.filterWidth; wC = wC + 1) {
                  let xC = inputColStart + wC * uniforms.dilations[1];

                  let xVal = ${e};
                  let wVal = getW(wR, wC, d1, q);
                  value = value + xVal * wVal;
                }
              }
            } else {
              for (var wR = 0; wR < uniforms.filterHeight; wR = wR + 1) {
                let xR = inputRowStart + wR * uniforms.dilations[0];

                if (xR < 0 || xR >= uniforms.inDims[0]) {
                  continue;
                }

                for (var wC = 0; wC < uniforms.filterWidth; wC = wC + 1) {
                  let xC = inputColStart + wC * uniforms.dilations[1];

                  if (xC < 0 || xC >= uniforms.inDims[1]) {
                    continue;
                  }

                  let xVal = ${e};
                  let wVal = getW(wR, wC, d1, q);
                  value = value + xVal * wVal;
                }
              }
            }
            ${Fe(this.addBias,this.activation)}
          setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
        }
      }
    `}}/**
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
 */function Gp(s){const{inputs:e,backend:t,attrs:o}=s,{x:i,filter:r}=e,{strides:n,pad:a,dataFormat:u,dilations:l,dimRoundingMode:d}=o,c=mt(u);let h=l;h==null&&(h=[1,1]);const p=ve(i.shape,r.shape,n,h,a,d,!0,c),f=[{type:"int32",data:[p.padInfo.top,p.padInfo.left]},{type:"int32",data:[p.inHeight,p.inWidth]}],m=p.dataFormat==="channelsLast";let g;return!m&&p.inHeight>16&&p.inWidth>16&&p.strideHeight===1&&p.strideWidth===1&&p.dilationWidth===1&&p.dilationHeight===1&&p.inChannels===p.outChannels?g=new Up(p.outShape,p.filterHeight,p.filterWidth):m&&p.outHeight>4&&p.outWidth>4&&p.strideWidth<=2&&p.inChannels===p.outChannels&&p.dilationHeight===1&&p.dilationWidth===1&&p.inChannels%4===0?(g=new Mi(p),f.push({type:"int32",data:[g.virtualWidth]})):(g=new Ti(p),f.push({type:"int32",data:[p.filterHeight]},{type:"int32",data:[p.filterWidth]},{type:"int32",data:[p.strideHeight,p.strideWidth]},{type:"int32",data:[p.dilationHeight,p.dilationWidth]})),t.runWebGPUProgram(g,[i,r],i.dtype,f)}const Hp={kernelName:Wr,backendName:"webgpu",kernelFunc:Gp};/**
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
 */class Xp{constructor(e){this.variableNames=["x","dy"],this.uniforms=`strides : vec2<i32>, pads : vec2<i32>, filterDims : vec2<i32>, outHeight : i32,
      outWidth : i32, inHeight : i32, inWidth : i32, batchSize : i32, channelMul : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.filterShape,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="depthwise_conv2d_backprop_filter"}getUserCode(){return`
      ${R("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let wR = coords[0];
        let wC = coords[1];
        let d1 = coords[2];
        let dm = coords[3];
        let d2 = d1 * uniforms.channelMul + dm;

        var dotProd = 0.0;
        for (var b = 0; b < uniforms.batchSize; b++) {
          for (var yR = 0; yR < uniforms.outHeight; yR++) {
            let xR = wR + yR * uniforms.strides[0] - uniforms.pads[0];

            if (xR < 0 || xR >= uniforms.inHeight) {
              continue;
            }

            for (var yC = 0; yC < uniforms.outWidth; yC++) {
              let xC = wC + yC * uniforms.strides[1] - uniforms.pads[1];

              if (xC < 0 || xC >= uniforms.inWidth) {
                continue;
              }

              let dyValue = getDy(b, yR, yC, d2);
              let xValue = getX(b, xR, xC, d1);
              dotProd += xValue * dyValue;
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
    `}}class Kp{constructor(e){this.variableNames=["dy","W"],this.uniforms=`strides : vec2<i32>, pads : vec2<i32>, filterDims : vec2<i32>,
       outHeight : i32, outWidth : i32, channelMul : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.inShape,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="depthwise_conv2d_backprop_input"}getUserCode(){return`
      ${R("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords[0];
        let d1 = coords[3];
        let dyCorner = coords.yz - uniforms.pads;
        let dyRCorner = dyCorner.x;
        let dyCCorner = dyCorner.y;

        var dotProd = 0.0;
        for (var wR = 0; wR < uniforms.filterDims[0]; wR++) {
          let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[0]);

          if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
            continue;
          }

          let idyR = i32(dyR);
          let wRPerm = uniforms.filterDims[0] - 1 - wR;

          for (var wC = 0; wC < uniforms.filterDims[1]; wC++) {
            let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[1]);

            if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
              continue;
            }

            let idyC = i32(dyC);
            let wCPerm = uniforms.filterDims[1] - 1 - wC;

            for (var dm = 0; dm < uniforms.channelMul; dm++) {
              let d2 = d1 * uniforms.channelMul + dm;
              let xValue = getDy(batch, idyR, idyC, d2);
              let wValue = getW(wRPerm, wCPerm, d1, dm);
              dotProd += xValue * wValue;
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
    `}}/**
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
 */function qp(s){const{inputs:e,backend:t,attrs:o}=s,{x:i,dy:r}=e,{strides:n,dilations:a,pad:u,dimRoundingMode:l,filterShape:d}=o,c=ve(i.shape,d,n,a,u,l,!0),h=new Xp(c),p=[{type:"int32",data:[c.strideHeight,c.strideWidth]},{type:"int32",data:[c.padInfo.top,c.padInfo.left]},{type:"int32",data:[c.filterHeight,c.filterWidth]},{type:"int32",data:[c.outHeight]},{type:"int32",data:[c.outWidth]},{type:"int32",data:[c.inHeight]},{type:"int32",data:[c.inWidth]},{type:"int32",data:[c.batchSize]},{type:"int32",data:[c.outChannels/c.inChannels]}];return t.runWebGPUProgram(h,[i,r],"float32",p)}const Yp={kernelName:Vr,backendName:"webgpu",kernelFunc:qp};/**
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
 */function jp(s){const{inputs:e,backend:t,attrs:o}=s,{dy:i,filter:r}=e,{strides:n,dilations:a,pad:u,dimRoundingMode:l,inputShape:d}=o,c=ve(d,r.shape,n,a,u,l,!0),h=new Kp(c),p=[{type:"int32",data:[c.strideHeight,c.strideWidth]},{type:"int32",data:[c.filterHeight-1-c.padInfo.top,c.filterWidth-1-c.padInfo.left]},{type:"int32",data:[c.filterHeight,c.filterWidth]},{type:"int32",data:[c.outHeight]},{type:"int32",data:[c.outWidth]},{type:"int32",data:[c.outChannels/c.inChannels]}];return t.runWebGPUProgram(h,[i,r],i.dtype,p)}const Qp={kernelName:Ur,backendName:"webgpu",kernelFunc:jp};/**
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
 */class Zp{constructor(e){this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[e,e],this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="diag"}getUserCode(){return`
      ${R("index")} {
        if (index < uniforms.size) {
          let coords = getOutputCoords();
          let value = select(0.0, getX(coords[0]), coords[0] == coords[1]);
          setOutputAtIndex(index, value);
        }
      }
    `}}/**
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
 */function Jp(s){const{inputs:e,backend:t}=s,{x:o}=e,i=[...o.shape,...o.shape],r=M(o.shape),n=z({inputs:{x:o},backend:t,attrs:{shape:[r]}}),a=new Zp(r),u=t.runWebGPUProgram(a,[n],n.dtype),l=z({inputs:{x:u},backend:t,attrs:{shape:i}});return t.disposeData(n.dataId),t.disposeData(u.dataId),l}const ef={kernelName:Gr,backendName:"webgpu",kernelFunc:Jp};/**
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
 */class tf{constructor(e){this.variableNames=["x","w"],this.uniforms="filterDims: vec2<i32>, pads: vec2<i32>, strides: vec2<i32>, dilations: vec2<i32>",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.outShape,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="dilation2d"}getUserCode(){return`
       ${R("index")} {
         if (index < uniforms.size) {
           let neg_infinity = -3.4e38;
           let coords = getOutputCoords();
           let batch = coords.x;
           let d1 = coords.w;
           let outTopLeftCorner = coords.yz * uniforms.strides - uniforms.pads;
           let hBeg = outTopLeftCorner.x;
           let wBeg = outTopLeftCorner.y;

           var curVal = neg_infinity;
           for (var h = 0; h < uniforms.filterDims[0]; h = h + 1) {
             let hIn = hBeg + h * uniforms.dilations[0];

             if (hIn >= 0 && hIn < uniforms.xShape[1]) {
               for (var w = 0; w < uniforms.filterDims[1]; w = w + 1) {
                 let wIn = wBeg + w * uniforms.dilations[1];

                 if (wIn >= 0 && wIn < uniforms.xShape[2]) {
                   let val = getX(batch, hIn, wIn, d1) + getW(h, w, d1);
                   if (val > curVal) {
                     curVal = val;
                   }
                 }
               }
             }
           }

           setOutputAtIndex(index, curVal);
         }
       }
     `}}/**
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
 */function sf(s){const{inputs:e,backend:t,attrs:o}=s,{x:i,filter:r}=e,{strides:n,pad:a,dilations:u}=o,l=es(i.shape,r.shape,n,a,"NHWC",u),d=[l.padInfo.top,l.padInfo.left],c=[{type:"int32",data:[l.filterHeight,l.filterWidth]},{type:"int32",data:[...d]},{type:"int32",data:[l.strideHeight,l.strideWidth]},{type:"int32",data:[l.dilationHeight,l.dilationWidth]}],h=new tf(l);return t.runWebGPUProgram(h,[i,r],i.dtype,c)}const of={kernelName:Hr,backendName:"webgpu",kernelFunc:sf};/**
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
 */class rf{constructor(e,t){if(this.variableNames=["x","w","dy"],this.uniforms="filterDims: vec2<i32>, pads: vec2<i32>, strides: vec2<i32>, dilations: vec2<i32>, dySize: i32,",this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=e.inShape,this.dispatchLayout=D(e.outShape),this.dispatch=$(this.dispatchLayout,e.outShape,this.workgroupSize),t!=="float32"&&t!=="int32")throw new Error(`Dilation2DBackpropInput only supports float32 and int32
          types, does not support ${t} type.`);this.type=t,this.shaderKey="dilation2DBackpropInput"}getUserCode(){return`
       ${R("index")} {
         if (index < uniforms.dySize) {
           let coords = getDyCoordsFromIndex(index);
           let b = coords[0];
           let r = coords[1];
           let c = coords[2];
           let d = coords[3];

           let dyCorner = vec2<i32>(r, c) * uniforms.strides - uniforms.pads;
           var curVal = -3.4e38;  // neg_infinity
           var xRMax = 0;
           var xCMax = 0;

           // In the case of multiple argmax branches, we only back-propagate
           // along the last branch, i.e., the one with largest value of
           // 'wR * uniforms.filterDims[1] + wC', similarly to the max-pooling
           // backward routines.
           for (var wR = 0; wR < uniforms.filterDims[0]; wR++) {
             let xR = dyCorner.x + wR * uniforms.dilations[0];

             if (xR >= 0 && xR < uniforms.xShape[1]) {
               for (var wC = 0; wC < uniforms.filterDims[1]; wC++) {
                 let xC = dyCorner.y + wC * uniforms.dilations[1];

                 if (xC >= 0 && xC < uniforms.xShape[2]) {
                   let val = getX(b, xR, xC, d) + getW(wR, wC, d);
                   if (val > curVal) {
                     curVal = val;
                     xRMax = xR;
                     xCMax = xC;
                   }
                 }
               }
             }
           }

           let flatIndexIn = d + uniforms.xShape[3] *
               (xCMax + uniforms.xShape[2] * (xRMax + uniforms.xShape[1] * b));
           let value = getDy(b, r, c, d);
           ${ke("&result[flatIndexIn]","value",this.type)}
         }
       }
     `}}class nf{constructor(e,t,o){if(this.variableNames=["x","w","dy"],this.uniforms="filterDims: vec2<i32>, pads: vec2<i32>, strides: vec2<i32>, dilations: vec2<i32>, dySize: i32,",this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=e.filterShape,this.dispatchLayout=D(e.outShape),this.dispatch=$(this.dispatchLayout,e.outShape,this.workgroupSize),o!=="float32"&&o!=="int32")throw new Error(`Dilation2DBackpropFilter only supports float32 and int32
          types, does not support ${o} type.`);this.type=o,this.shaderKey="dilation2DBackpropFilter"}getUserCode(){return`
       ${R("index")} {
         if (index < uniforms.dySize) {
           let coords = getDyCoordsFromIndex(index);
           let b = coords[0];
           let r = coords[1];
           let c = coords[2];
           let d = coords[3];

           let dyCorner = vec2<i32>(r, c) * uniforms.strides - uniforms.pads;
           var curVal = -3.4e38;  // neg_infinity
           var wRMax = 0;
           var wCMax = 0;

           // In the case of multiple argmax branches, we only back-propagate
           // along the last branch, i.e., the one with largest value of
           // 'wR * uniforms.filterDims[1] + wC', similarly to the max-pooling
           // backward routines.
           for (var wR = 0; wR < uniforms.filterDims[0]; wR++) {
             let xR = dyCorner.x + wR * uniforms.dilations[0];

             if (xR >= 0 && xR < uniforms.xShape[1]) {
               for (var wC = 0; wC < uniforms.filterDims[1]; wC++) {
                 let xC = dyCorner.y + wC * uniforms.dilations[1];

                 if (xC >= 0 && xC < uniforms.xShape[2]) {
                   let val = getX(b, xR, xC, d) + getW(wR, wC, d);
                   if (val > curVal) {
                     curVal = val;
                     wRMax = wR;
                     wCMax = wC;
                   }
                 }
               }
             }
           }

           let flatIndexIn = d + uniforms.wShape[2] * (wCMax + wRMax * uniforms.wShape[1]);
           let value = getDy(b, r, c, d);
           ${ke("&result[flatIndexIn]","value",this.type)}
         }
       }
     `}}/**
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
 */function af(s){const{inputs:e,backend:t,attrs:o}=s,{x:i,filter:r,dy:n}=e,{strides:a,pad:u,dilations:l}=o,d=es(i.shape,r.shape,a,u,"NHWC",l),c=r.dtype,h=new nf(d,r.shape,c),p=[{type:"int32",data:[d.filterHeight,d.filterWidth]},{type:"int32",data:[d.padInfo.top,d.padInfo.left]},{type:"int32",data:[d.strideHeight,d.strideWidth]},{type:"int32",data:[d.dilationHeight,d.dilationWidth]},{type:"int32",data:[M(d.outShape)]}],f=ie({backend:t,attrs:{shape:r.shape,value:0,dtype:c}});return t.runWebGPUProgram(h,[i,r,n],c,p,f)}const uf={kernelName:Xr,backendName:"webgpu",kernelFunc:af};/**
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
 */function lf(s){const{inputs:e,backend:t,attrs:o}=s,{x:i,filter:r,dy:n}=e,{strides:a,pad:u,dilations:l}=o,d=es(i.shape,r.shape,a,u,"NHWC",l),c=i.dtype,h=new rf(d,c),p=[{type:"int32",data:[d.filterHeight,d.filterWidth]},{type:"int32",data:[d.padInfo.top,d.padInfo.left]},{type:"int32",data:[d.strideHeight,d.strideWidth]},{type:"int32",data:[d.dilationHeight,d.dilationWidth]},{type:"int32",data:[M(d.outShape)]}],f=ie({backend:t,attrs:{shape:d.inShape,value:0,dtype:c}});return t.runWebGPUProgram(h,[i,r,n],c,p,f)}const df={kernelName:Kr,backendName:"webgpu",kernelFunc:lf};/**
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
 */class cf{constructor(e,t,o){this.variableNames=["Image"],this.uniforms="alpha: f32,",this.workgroupSize=[64,1,1],this.pixelsOpType=He.DRAW,this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.type=t,this.textureFormat=o,this.shaderKey=`draw_${t}_${o}`}getUserCode(){let e;const t=this.type==="float32"?"value":"value / 255.0";return e=`
      if (uniforms.numChannels == 1) {
        rgba[0] = ${t};
        rgba[1] = ${t};
        rgba[2] = ${t};
      } else {
        rgba[d] = ${t};
      }`,`
       @group(0) @binding(0) var outImage : texture_storage_2d<${this.textureFormat}, write>;
       ${R("index")} {
         if (index < uniforms.size) {
           var rgba = vec4<f32>(0.0, 0.0, 0.0, uniforms.alpha);
           for (var d = 0; d < uniforms.numChannels; d = d + 1) {
             let value = f32(inBuf[index * uniforms.numChannels + d]);
             ${e}
           }
           rgba.x = rgba.x * rgba.w;
           rgba.y = rgba.y * rgba.w;
           rgba.z = rgba.z * rgba.w;
           let coords = getCoordsFromIndex(index);
           textureStore(outImage, vec2<i32>(coords.yx), rgba);
         }
       }
      `}}/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use backend file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hf(s){const{inputs:e,backend:t,attrs:o}=s,{image:i}=e,{canvas:r,options:n}=o,[a,u]=i.shape.slice(0,2),{imageOptions:l}=n||{},d=l?.alpha||1,c=t.device.features.has("bgra8unorm-storage")?"bgra8unorm":"rgba8unorm",h=[a,u],p=new cf(h,i.dtype,c);r.width=u,r.height=a;const f="webgpu";let m=r.getContext(f),g;m||(g=new OffscreenCanvas(u,a),m=g.getContext(f));const x=i.shape.length===3?i.shape[2]:1;m.configure({device:t.device,format:c,usage:GPUTextureUsage.STORAGE_BINDING,alphaMode:"premultiplied"});const y="int32",w=t.makeTensorInfo(h,y),C=t.tensorMap.get(w.dataId);C.resource=m.getCurrentTexture(),C.external=!0;const b=[{type:"uint32",data:[x]},{type:"float32",data:[d]}];if(t.runWebGPUProgram(p,[i],y,b,w),g){const S=r.getContext("2d");if(!S)throw new Error("Please make sure this canvas has only been used for 2d or webgpu context!");S.drawImage(g,0,0)}return t.disposeData(w.dataId),i}const pf={kernelName:qr,backendName:"webgpu",kernelFunc:hf};/**
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
 */const Li=j({opType:T.MUL,cpuKernelImpl:xc,supportsComplex:!0}),ff={kernelName:Yr,backendName:"webgpu",kernelFunc:Li};/**
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
 */function Ei(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{axis:r,keepDims:n}=o;return Te(i,r,n,"sum",t)}const mf={kernelName:jr,backendName:"webgpu",kernelFunc:Ei};/**
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
 */function gf(s){const{inputs:e,backend:t,attrs:o}=s,{equation:i}=o,r=e,{allDims:n,summedDims:a,idDims:u}=Zr(i,r.length);Jr(n.length,u,r);const{path:l,steps:d}=en(a,u),c=d.length;let h=null,p=n.length;const f=[];for(let m=0;m<c;++m){for(const g of d[m]){const{permutationIndices:x,expandDims:y}=tn(p,u[g]);let w;sn(x)?w=r[g]:(w=fe({inputs:{x:r[g]},backend:t,attrs:{perm:x}}),f.push(w));const C=w.shape.slice();for(let b=0;b<y.length;++b)C.splice(y[b],0,1);Ke(w.shape,C)||(w=z({inputs:{x:w},backend:t,attrs:{shape:C}}),f.push(w)),h===null?h=w:(h=Li({inputs:{a:w,b:h},backend:t}),f.push(h))}m<c-1&&(l[m]>=0&&(h=Ei({inputs:{x:h},backend:t,attrs:{axis:l[m]-(n.length-p),keepDims:!1}}),f.push(h)),p--)}for(const m of f)m!==h&&t.disposeData(m.dataId);return h}const xf={kernelName:Qr,backendName:"webgpu",kernelFunc:gf};/**
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
 */const yf=U({opType:P.ELU}),wf={kernelName:on,backendName:"webgpu",kernelFunc:yf};/**
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
 */const Cf=s=>{const{inputs:e,backend:t}=s,{dy:o,y:i}=e,r=new Ct(T.ELU_DER,o.shape,i.shape);return t.runWebGPUProgram(r,[o,i],o.dtype)},bf={kernelName:rn,backendName:"webgpu",kernelFunc:Cf};/**
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
 */const Sf=j({opType:T.EQUAL,dtype:"bool",cpuKernelImpl:sc}),vf={kernelName:nn,backendName:"webgpu",kernelFunc:Sf};/**
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
 */const kf=U({opType:P.ERF}),If={kernelName:an,backendName:"webgpu",kernelFunc:kf};/**
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
 */const Pf=U({opType:P.EXP,cpuKernelImpl:ic,dtype:"float32"}),Rf={kernelName:un,backendName:"webgpu",kernelFunc:Pf};/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
 */function Xt(s){const{inputs:e,attrs:t,backend:o}=s,{dim:i}=t,{input:r}=e,n=r.shape.length,a=r.shape.slice();let u=i;return i<0&&(G(-(n+1)<=i,()=>`Axis must be in the interval [${-(n+1)}, ${n}]`),u=n+i+1),a.splice(u,0,1),z({inputs:{x:r},backend:o,attrs:{shape:a}})}const $f={kernelName:ln,backendName:"webgpu",kernelFunc:Xt};/**
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
 */const Df=U({opType:P.EXPM1,cpuKernelImpl:oc}),Nf={kernelName:dn,backendName:"webgpu",kernelFunc:Df};/**
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
 */class $s{constructor(e,t){this.variableNames=["real","imag"],this.outputShape=[],this.uniforms="exponentMultiplier : f32, denominator: f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.component=e,this.shaderKey=`fft_${e}`}getUserCode(){return`
    fn unaryOpComplex(real: f32, expR: f32, imag: f32, expI: f32) -> f32 {
      ${this.component==="real"?"return real * expR - imag * expI;":"return real * expI + imag * expR;"}
    }

    fn mulMatDFT(batch: i32, index: i32) -> f32 {
      let indexRatio = f32(index) / f32(uniforms.realShape[1]);
      let exponentMultiplierTimesIndexRatio =
          uniforms.exponentMultiplier * indexRatio;

      var result = 0.0;

      for (var i = 0; i < uniforms.realShape[1]; i = i + 1) {
        // x = (-2|2 * PI / N) * index * i;
        let x = exponentMultiplierTimesIndexRatio * f32(i);
        let expR = cos(x);
        let expI = sin(x);
        let real = getReal(batch, i);
        let imag = getImag(batch, i);

        result = result +
            unaryOpComplex(real, expR, imag, expI) / uniforms.denominator;
      }

      return result;
    }

    ${R("index")} {
      if (index < uniforms.size) {
        let coords = getOutputCoords();
        setOutputAtIndex(index, mulMatDFT(coords[0], coords[1]));
      }
    }
  `}}/**
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
 */function _i(s,e,t){const o=t.tensorMap.get(s.dataId),i=M(s.shape),r=s.shape[s.shape.length-1],n=i/r,a=[],u=z({inputs:{x:s},backend:t,attrs:{shape:[n,r]}});a.push(u);const l=u.shape,d=new $s("real",l),c=new $s("imag",l),h=[{dataId:o.complexTensorInfos.real.dataId,dtype:o.complexTensorInfos.real.dtype,shape:l},{dataId:o.complexTensorInfos.imag.dataId,dtype:o.complexTensorInfos.imag.dtype,shape:l}],p=e?2*Math.PI:-2*Math.PI,f=e?l[1]:1,m=[{type:"float32",data:[p]},{type:"float32",data:[f]}],g=t.runWebGPUProgram(d,h,"float32",m);a.push(g);const x=t.runWebGPUProgram(c,h,"float32",m);a.push(x);const y=Me({inputs:{real:g,imag:x},backend:t});a.push(y);const w=z({inputs:{x:y},backend:t,attrs:{shape:s.shape}});return a.forEach(C=>t.disposeData(C.dataId)),w}/**
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
 */function zf(s){const{inputs:e,backend:t}=s,{input:o}=e;return _i(o,!1,t)}const Af={kernelName:cn,backendName:"webgpu",kernelFunc:zf};/**
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
 */class Ff{constructor(e){this.outputShape=[],this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="flipLeftRight"}getUserCode(){return`
      ${R("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let coordX = uniforms.xShape[2] - coords[2] - 1;
          let outputValue = getX(coords[0], coords[1], coordX, coords[3]);
          setOutputAtIndex(index, outputValue);
        }
      }
    `}}/**
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
 */const Mf={kernelName:hn,backendName:"webgpu",kernelFunc:({inputs:s,backend:e})=>{const{image:t}=s,o=e,i=new Ff(t.shape);return o.runWebGPUProgram(i,[t],t.dtype)}};/**
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
 */const Tf=U({opType:P.FLOOR,cpuKernelImpl:rc}),Lf={kernelName:pn,backendName:"webgpu",kernelFunc:Tf};/**
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
 */const Ef=j({opType:T.FLOOR_DIV,cpuKernelImpl:nc,dtype:"int32"}),_f={kernelName:fn,backendName:"webgpu",kernelFunc:Ef};/**
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
 */class Bf{constructor(e,t,o=!1){this.pixelsOpType=He.FROM_PIXELS,this.outputShape=[0],this.variableNames=[],this.workgroupSize=[256,1,1],this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize,[t,1,1]),this.importVideo=o,this.shaderKey=`fromPixels_${this.importVideo}`}getUserCode(){const e=this.importVideo?"textureLoad(src, vec2<i32>(coords.yx));":"textureLoad(src, vec2<i32>(coords.yx), 0)";return`
      @binding(1) @group(0) var src: ${this.importVideo?"texture_external":"texture_2d<f32>"};
      ${R("index")} {
        let flatIndex = index * uniforms.numChannels;
        if (flatIndex < uniforms.size) {
          let coords = getCoordsFromIndex(flatIndex);
          let values = ${e};
          for (var i = 0; i < uniforms.numChannels; i = i + 1) {
            result[flatIndex + i] = i32(floor(255.0 * values[i]));
          }
        }
      }
  `}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use backend file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Of={kernelName:mn,backendName:"webgpu",kernelFunc:Wf};let Le,zt=q().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");function Wf(s){const{inputs:e,backend:t,attrs:o}=s;let{pixels:i}=e;const{numChannels:r}=o;if(i==null)throw new Error("pixels passed to tf.browser.fromPixels() can not be null");const n=typeof HTMLVideoElement<"u"&&i instanceof HTMLVideoElement,a=typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement,u=typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof OffscreenCanvas<"u"&&i instanceof OffscreenCanvas,l=typeof ImageBitmap<"u"&&i instanceof ImageBitmap,[d,c]=n?[i.videoWidth,i.videoHeight]:[i.width,i.height],h=[c,d,r],p=q().getBool("WEBGPU_IMPORT_EXTERNAL_TEXTURE")&&n,f=n||a;if(l||u||f){let y;if(p)y=t.device.importExternalTexture({source:i});else{if(f){const F=q().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");(Le==null||F!==zt)&&(zt=F,Le=document.createElement("canvas").getContext("2d",{willReadFrequently:zt})),Le.canvas.width=d,Le.canvas.height=c,Le.drawImage(i,0,0,d,c),i=Le.canvas}const N=GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING,L=t.textureManager.acquireTexture(h[1],h[0],"rgba8unorm",N);t.queue.copyExternalImageToTexture({source:i},{texture:L},[h[1],h[0]]),y=L}const w=M(h),C=pe(h),b=new Bf(h,r,p),S=[{type:"uint32",data:[w]},{type:"uint32",data:[r]},{type:"uint32",data:[...C]}],v=t.makeTensorInfo([c,d],"int32"),I=t.tensorMap.get(v.dataId);I.resource=y;const k=t.runWebGPUProgram(b,[v],"int32",S);return t.disposeData(v.dataId),k}const m=i.data;let g=m;if(r!=null&&r!==4){g=new Uint8Array(i.width*i.height*r);const y=m.length;let w=0;for(let C=0;C<y;C++)C%4<r&&(g[w++]=m[C])}const x=t.makeTensorInfo(h,"int32",new Int32Array(g));return t.uploadToGPU(x.dataId),x}/**
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
 */class Vf{constructor(e,t,o,i,r){this.uniforms="varianceEpsilon : f32,",this.workgroupSize=[128,1,1],this.size=!0,this.variableNames=["x","mean","variance"],xe(e,t),xe(e,o),this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),i!=null&&(xe(e,i),this.variableNames.push("offset")),r!=null&&(xe(e,r),this.variableNames.push("scale")),this.offsetShape=i,this.scaleShape=r,this.shaderKey="batchNorm"}getUserCode(){let e="0.0";this.offsetShape!=null&&(e="getOffsetByOutputIndex(index)");let t="1.0";return this.scaleShape!=null&&(t="getScaleByOutputIndex(index)"),`
      ${R("index")} {
        if (index < uniforms.size)
        {
          let xValue = getXByOutputIndex(index);
          let meanValue = getMeanByOutputIndex(index);
          let varianValue = getVarianceByOutputIndex(index);
          let offsetValue = ${e};
          let scaleValue = ${t};
          let inv = scaleValue * inverseSqrt(varianValue + f32(uniforms.varianceEpsilon));
          setOutputAtIndex(index,dot(vec3<f32>(xValue, -meanValue, offsetValue), vec3<f32>(inv, inv, 1.0)));
        }
      }
  `}}/**
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
 */const Uf={kernelName:gn,backendName:"webgpu",kernelFunc:({inputs:s,attrs:e,backend:t})=>{const{x:o,scale:i,offset:r,mean:n,variance:a}=s,{varianceEpsilon:u}=e,l=t,d=[o,n,a];let c=null;r!=null&&(c=r.shape,d.push(r));let h=null;i!=null&&(h=i.shape,d.push(i));const p=new Vf(o.shape,n.shape,a.shape,c,h),f=[{type:"float32",data:[u]}];return l.runWebGPUProgram(p,d,o.dtype,f)}};/**
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
 */function Gf(s){const{inputs:e,backend:t,attrs:o}=s,{x:i,filter:r,bias:n,preluActivationWeights:a}=e,{strides:u,pad:l,dataFormat:d,dilations:c,dimRoundingMode:h,activation:p,leakyreluAlpha:f}=o,m=mt(d),g=ve(i.shape,r.shape,u,c,l,h,!1,m);return Ai({x:i,filter:r,convInfo:g,backend:t,bias:n,preluActivationWeights:a,leakyreluAlpha:f,activation:p})}const Hf={kernelName:xn,backendName:"webgpu",kernelFunc:Gf};/**
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
 */function Xf(s){const{inputs:e,backend:t,attrs:o}=s,{x:i,filter:r,bias:n,preluActivationWeights:a}=e,{strides:u,pad:l,dilations:d,dimRoundingMode:c,activation:h,leakyreluAlpha:p}=o;let f=d;f==null&&(f=[1,1]),G(fi(u,f),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${u} and dilations '${f}'`);const m=ve(i.shape,r.shape,u,f,l,c,!0),g=[i,r],x=n!=null,y=a!=null;x&&g.push(n),y&&g.push(a);const w=[{type:"int32",data:[m.padInfo.top,m.padInfo.left]},{type:"int32",data:[m.inHeight,m.inWidth]}];let C;return m.outHeight>4&&m.outWidth>4&&m.strideWidth<=2&&m.inChannels===m.outChannels&&m.dilationHeight===1&&m.dilationWidth===1&&m.inChannels%4===0?(C=new Mi(m,x,h,y),w.push({type:"int32",data:[C.virtualWidth]})):(C=new Ti(m,x,h,y),w.push({type:"int32",data:[m.filterHeight]},{type:"int32",data:[m.filterWidth]},{type:"int32",data:[m.strideHeight,m.strideWidth]},{type:"int32",data:[m.dilationHeight,m.dilationWidth]})),h==="leakyrelu"&&(w.push({type:"float32",data:[p]}),C.uniforms+=" alpha : f32,"),t.runWebGPUProgram(C,g,"float32",w)}const Kf={kernelName:yn,backendName:"webgpu",kernelFunc:Xf};/**
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
 */class qf{constructor(e,t){this.variableNames=["A","indices"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`gathernd_${e}`,this.sliceDim=e,this.uniforms=`sliceDim : i32, strides : ${K(e)},`}getUserCode(){let e;return this.sliceDim>1?e="uniforms.strides[j]":e="uniforms.strides",`
      ${R("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          var flattenIndex = 0;
          for (var j = 0; j < uniforms.sliceDim; j = j + 1) {
            let indexTemp = i32(round(getIndices(coords[0], j)));
            let strideNum = ${e};
            flattenIndex = flattenIndex + indexTemp * strideNum;
          }

          setOutputAtIndex(index, getA(flattenIndex, coords[1]));
        }
      }
      `}}/**
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
 */function Yf(s){const{inputs:e,backend:t}=s,{params:o,indices:i}=e,r=i.shape,n=r[r.length-1],a=M(o.shape),[u,l,d,c]=Cn(o,i),h=z({inputs:{x:i},backend:t,attrs:{shape:[l,n]}}),p=z({inputs:{x:o},backend:t,attrs:{shape:[M(o.shape)/d,d]}});if(t.shouldExecuteOnCPU([o,i])||o.dtype==="string"){const y=t.readSync(i.dataId),w=t.bufferSync(o),C=ac(y,w,o.dtype,l,n,d,c,o.shape,a);return t.makeTensorInfo(u,o.dtype,C.values)}const f=new qf(n,[l,d]),m=[{type:"int32",data:[n]},{type:"int32",data:c}],g=t.runWebGPUProgram(f,[p,h],p.dtype,m),x=z({inputs:{x:g},backend:t,attrs:{shape:u}});return t.disposeData(h.dataId),t.disposeData(p.dataId),t.disposeData(g.dataId),x}const jf={kernelName:wn,backendName:"webgpu",kernelFunc:Yf};/**
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
 */class Qf{constructor(e,t){this.variableNames=["A","indices"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.slice(),this.aShape=e,this.outputShape=t,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="gather"}getUserCode(){const e=Zf(this.aShape);return`
      ${R("index")} {
        if (index < uniforms.size) {
          let resRC = getCoordsFromIndex(index);
          let indexZ = i32(getIndices(resRC.x, resRC.z));
          let inBounds = select(0.0, 1.0, indexZ >= 0 && indexZ < uniforms.aShape[2]);
          setOutputAtIndex(index, inBounds * getA(${e}));
        }
      }
    `}}function Zf(s){const e=["resRC.x","resRC.y","resRC.z","resRC.w"],t=[];for(let o=0;o<s.length;o++)o===2?t.push("indexZ"):t.push(`${e[o]}`);return t.join()}/**
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
 */function Bi(s){const{inputs:e,backend:t,attrs:o}=s,{x:i,indices:r}=e,{axis:n,batchDims:a}=o,u=Ae(n,i.shape)[0],l=Sn(i,r,u,a),d=M(r.shape),c=[],h=z({inputs:{x:i},backend:t,attrs:{shape:[l.batchSize,l.outerSize,l.dimSize,l.sliceSize]}}),p=z({inputs:{x:r},backend:t,attrs:{shape:[l.batchSize,d/l.batchSize]}});c.push(h),c.push(p);const f=[l.batchSize,l.outerSize,d/l.batchSize,l.sliceSize];if(t.shouldExecuteOnCPU([i,r])){const w=t.tensorMap.get(p.dataId).values,C=ne(p.shape,p.dtype,w),S=t.tensorMap.get(h.dataId).values,v=ne(h.shape,h.dtype,S),I=uc(v,C,f);return c.forEach(k=>t.disposeData(k.dataId)),t.makeTensorInfo(l.outputShape,I.dtype,I.values)}const m=new Qf(h.shape,f),g=t.runWebGPUProgram(m,[h,p],h.dtype);c.push(g);const x=z({inputs:{x:g},backend:t,attrs:{shape:l.outputShape}});return c.forEach(y=>t.disposeData(y.dataId)),x}const Jf={kernelName:bn,backendName:"webgpu",kernelFunc:Bi};/**
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
 */const em=j({opType:T.GREATER,cpuKernelImpl:dc,dtype:"bool"}),tm={kernelName:vn,backendName:"webgpu",kernelFunc:em};/**
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
 */const sm=j({opType:T.GREATER_EQUAL,dtype:"bool",cpuKernelImpl:lc}),im={kernelName:kn,backendName:"webgpu",kernelFunc:sm};/**
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
 */function om(s){const{inputs:e,backend:t}=s,{input:o}=e;return _i(o,!0,t)}const rm={kernelName:In,backendName:"webgpu",kernelFunc:om};/**
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
 */const nm=U({opType:P.IS_FINITE,dtype:"bool"}),am={kernelName:Pn,backendName:"webgpu",kernelFunc:nm};/**
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
 */const um=U({opType:P.IS_INF,dtype:"bool"}),lm={kernelName:Rn,backendName:"webgpu",kernelFunc:um};/**
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
 */const dm=U({opType:P.IS_NAN,dtype:"bool"}),cm={kernelName:$n,backendName:"webgpu",kernelFunc:dm};/**
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
 */function hm(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{alpha:r}=o,n=[{type:"float32",data:[r]}],a=new Qe(i.shape,P.LEAKYRELU,"alpha : f32,");return t.runWebGPUProgram(a,[i],"float32",n)}const pm={kernelName:Dn,backendName:"webgpu",kernelFunc:hm};/**
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
 */const fm=j({opType:T.LESS,dtype:"bool",cpuKernelImpl:hc}),mm={kernelName:Nn,backendName:"webgpu",kernelFunc:fm};/**
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
 */const gm=j({opType:T.LESS_EQUAL,dtype:"bool",cpuKernelImpl:cc}),xm={kernelName:zn,backendName:"webgpu",kernelFunc:gm};/**
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
 */class ym{constructor(e){this.variableNames=[],this.outputShape=[],this.uniforms="start : f32, step : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[e],this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="linSpace"}getUserCode(){return`
      ${R("index")} {
        if (index < uniforms.size) {
          setOutputAtIndex(index, uniforms.start + f32(index) * uniforms.step);
        }
      }
    `}}/**
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
 */function wm(s){const{backend:e,attrs:t}=s,{start:o,stop:i,num:r}=t,n=(i-o)/(r-1),a=new ym(r),u=[{type:"float32",data:[o]},{type:"float32",data:[n]}];return e.runWebGPUProgram(a,[],"float32",u)}const Cm={kernelName:An,backendName:"webgpu",kernelFunc:wm};/**
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
 */const bm=U({opType:P.LOG,cpuKernelImpl:pc}),Sm={kernelName:Fn,backendName:"webgpu",kernelFunc:bm};/**
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
 */const vm=U({opType:P.LOG1P}),km={kernelName:Mn,backendName:"webgpu",kernelFunc:vm};/**
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
 */const Im=j({opType:T.LOGICAL_AND,dtype:"bool"}),Pm={kernelName:Tn,backendName:"webgpu",kernelFunc:Im};/**
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
 */const Rm=U({opType:P.LOGICAL_NOT}),$m={kernelName:Ln,backendName:"webgpu",kernelFunc:Rm};/**
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
 */const Dm=j({opType:T.LOGICAL_OR}),Nm={kernelName:En,backendName:"webgpu",kernelFunc:Dm};/**
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
 */const Oi=`
  var powValue = 0.0;
  let basis = uniforms.bias + uniforms.alpha * sum;
  if (uniforms.beta == 0.5) {
    powValue = inverseSqrt(basis);
  } else if (uniforms.beta == 1.0) {
    powValue = 1.0 / basis;
  } else {
    powValue = exp(log(basis) * (-uniforms.beta));
  }
`;class zm{constructor(e){this.outputShape=[],this.variableNames=["x"],this.uniforms="radius : i32, bias : f32, alpha : f32, beta : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="lrn"}getUserCode(){return`
    ${R("index")} {
      if (index < uniforms.size) {
        let coords = getOutputCoords();
        let b = coords[0];
        let r = coords[1];
        let c = coords[2];
        let d = coords[3];

        let x = getX(b, r, c, d);
        var sum = 0.0;
        for (var i = -uniforms.radius; i <= uniforms.radius; i = i + 1) {
          let idx = d + i;
          if (idx >= 0 && idx < uniforms.xShape[3]) {
            let z = getX(b, r, c, idx);
            sum = sum + z * z;
          }
        }
        ${Oi}

        setOutputAtIndex(index, x * powValue);
      }
    }
  `}}class Am{constructor(e,t){this.outputShape=[],this.variableNames=["x"],this.uniforms="radius : i32, bias : f32, alpha : f32, beta : f32,",this.workgroupSize=[256,1,1],this.maxAllowRadius=16,G(t<=this.maxAllowRadius,()=>`Radius must be less than or equal to ${this.maxAllowRadius}, current radius is ${t}`),this.outputShape=e,this.elementsPerWorkgroup=this.workgroupSize[0]-2*this.maxAllowRadius,this.dispatchLayout={x:[3],y:[2],z:[0,1]},this.dispatch=$(this.dispatchLayout,this.outputShape,[this.elementsPerWorkgroup,this.workgroupSize[1],this.workgroupSize[2]]),this.shaderKey="lrn_shared"}getUserCode(){return`
    var <workgroup>lrnSub: array<f32, ${this.workgroupSize[0]}>;
    const elementsPerWorkgroup = ${this.elementsPerWorkgroup};
    const maxAllowRadius = ${this.maxAllowRadius};

    ${R()} {
      let localDepth = i32(localId.x);
      let workgroupDepth = i32(workgroupId.x) * elementsPerWorkgroup;
      let xDepth = workgroupDepth + localDepth - maxAllowRadius;
      let b = i32(globalId.z) / uniforms.xShape[1];
      let r = i32(globalId.z) - b * uniforms.xShape[1];
      let c = i32(globalId.y);
      let d = workgroupDepth + localDepth;

      var x = 0.0;
      if (xDepth >= 0 && xDepth < uniforms.xShape[3]) {
        x = getX(b, r, c, xDepth);
      }
      lrnSub[localDepth] = x;
      workgroupBarrier();

      if (localDepth < elementsPerWorkgroup && d < uniforms.outShape[3]) {
        var sum = 0.0;
        let index = localDepth + maxAllowRadius;
        for (var i = -uniforms.radius; i <= uniforms.radius; i = i + 1) {
          let z = lrnSub[index + i];
          sum = sum + z * z;
        }
        ${Oi}

        setOutputAtCoords(b, r, c, d, lrnSub[index] * powValue);
      }
    } `}}/**
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
 */function Fm(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{depthRadius:r,bias:n,alpha:a,beta:u}=o;let l;r>16?l=new zm(i.shape):l=new Am(i.shape,r);const d=[{type:"int32",data:[r]},{type:"float32",data:[n]},{type:"float32",data:[a]},{type:"float32",data:[u]}];return t.runWebGPUProgram(l,[i],i.dtype,d)}const Mm={kernelName:_n,backendName:"webgpu",kernelFunc:Fm};/**
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
 */class Tm{constructor(e){this.outputShape=[],this.variableNames=["inputImage","outputImage","dy"],this.uniforms="depthRadius : i32, bias : f32, alpha : f32, beta : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="lrn_grad"}getUserCode(){return`
    ${R("index")} {
      if (index < uniforms.size) {
        let coords = getOutputCoords();
        let b = coords[0];
        let r = coords[1];
        let c = coords[2];

        let MIN_DEPTH_BEGIN = 0;
        let MAX_DEPTH_END = uniforms.outShape[3];
        var result = 0.0;
        for (var d = MIN_DEPTH_BEGIN; d < MAX_DEPTH_END; d++) {
          let depthBegin = max(MIN_DEPTH_BEGIN, d - uniforms.depthRadius);
          let depthEnd = min(MAX_DEPTH_END, d + uniforms.depthRadius + 1);

          var norm = 0.0;
          for (var k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; k++) {
            if (k < depthBegin) {
              continue;
            } else if (k >= depthBegin && k < depthEnd) {
              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);
            } else {
              break;
            }
          }

          norm = uniforms.alpha * norm + uniforms.bias;

          for (var k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; k++) {
            if (k < depthBegin) {
              continue;
            } else if (k >= depthBegin && k < depthEnd) {
              var dyi = -2.0 * uniforms.alpha * uniforms.beta
                * getInputImage(b, r, c, k) * getOutputImage(b, r, c, d) / norm;
              if (k == d) {
                dyi += pow(norm, -1.0 * uniforms.beta);
              }
              if (k == coords[3]) {
                dyi *= getDy(b, r, c, d);
                result += dyi;
              }
            } else {
              break;
            }
          }
        }

        setOutputAtIndex(index, result);
      }
    }
  `}}/**
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
 */function Lm(s){const{inputs:e,backend:t,attrs:o}=s,{x:i,y:r,dy:n}=e,{depthRadius:a,bias:u,alpha:l,beta:d}=o,c=new Tm(i.shape),h=[{type:"int32",data:[a]},{type:"float32",data:[u]},{type:"float32",data:[l]},{type:"float32",data:[d]}];return t.runWebGPUProgram(c,[i,r,n],i.dtype,h)}const Em={kernelName:Bn,backendName:"webgpu",kernelFunc:Lm};/**
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
 */const _m=j({opType:T.MAX,cpuKernelImpl:mc}),Bm={kernelName:On,backendName:"webgpu",kernelFunc:_m};/**
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
 */function Om(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{filterSize:r,strides:n,pad:a,dimRoundingMode:u}=o,d=ft(i.shape,r,n,1,a,u);return $i(i,d,"max",t)}const Wm={kernelName:Wn,backendName:"webgpu",kernelFunc:Om};/**
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
 */function Vm(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{filterSize:r,strides:n,pad:a,dataFormat:u,dimRoundingMode:l}=o,d=[1,1,1],c=It(i.shape,r,n,d,a,l,u),h=new ns(c,"max"),p=[{type:"int32",data:[c.strideDepth,c.strideHeight,c.strideWidth]},{type:"int32",data:[c.padInfo.front,c.padInfo.top,c.padInfo.left]},{type:"int32",data:[c.inDepth,c.inHeight,c.inWidth]},{type:"int32",data:[c.effectiveFilterDepth,c.effectiveFilterHeight,c.effectiveFilterWidth]}];return t.runWebGPUProgram(h,[i],i.dtype,p)}const Um={kernelName:Vn,backendName:"webgpu",kernelFunc:Vm};/**
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
 */class Gm{constructor(e){this.variableNames=["dy","maxPos"],this.uniforms=`strides : vec2<i32>, pads : vec2<i32>, dilations : vec2<i32>, filterDims : vec2<i32>,
       outHeight : i32, outWidth : i32`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.inShape,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="maxPool2DBackprop"}getUserCode(){return`
      ${R("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords[0];
        let d = coords[3];

        let dyRCCorner = vec2<i32>(coords.yz) - uniforms.pads;
        let dyRCorner = dyRCCorner.x;
        let dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        let lastIndex = uniforms.filterDims[0] * uniforms.filterDims[1] - 1;
        for (var wR = 0; wR < uniforms.filterDims[0]; wR += uniforms.dilations[0]) {
          let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[0]);

          if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
            continue;
          }
          let idyR = i32(dyR);

          for (var wC = 0; wC < uniforms.filterDims[1]; wC += uniforms.dilations[1]) {
            let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[1]);

            if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
              continue;
            }
            let idyC = i32(dyC);

            let dyValue = getDy(batch, idyR, idyC, d);
            let maxPosValue = lastIndex - i32(getMaxPos(batch, idyR, idyC, d));

            // Get the current value, check it against the value from the
            // position matrix.
            let curPosValue = wR * uniforms.filterDims[1] + wC;
            let mask = select(0.0, 1.0, maxPosValue == curPosValue);
            dotProd += dyValue * mask;
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
    `}}class Hm{constructor(e){this.variableNames=["dy","maxPos"],this.uniforms=`strides : vec3<i32>, pads : vec3<i32>, filterDims : vec3<i32>,
      outDepth : i32, outHeight : i32, outWidth : i32`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.inShape,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="maxPool3DBackprop"}getUserCode(){return`
      ${R("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords.x;
        let ch = coords.u;

        let dyCorner = vec3<i32>(coords.y, coords.z, coords.w) - uniforms.pads;
        let dyDCorner = dyCorner.x;
        let dyRCorner = dyCorner.y;
        let dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, ch) with pos mask(:, :, :, d) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        let lastIndex = uniforms.filterDims[0] * uniforms.filterDims[1] * uniforms.filterDims[2] - 1;

        for (var wD = 0; wD < uniforms.filterDims[0]; wD++) {
          let dyD = f32(dyDCorner + wD) / f32(uniforms.strides[0]);

          if (dyD < 0.0 || dyD >= f32(uniforms.outDepth) || fract(dyD) > 0.0) {
            continue;
          }
          let idyD = i32(dyD);

          for (var wR = 0; wR < uniforms.filterDims[1]; wR++) {
            let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[1]);

            if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
              continue;
            }
            let idyR = i32(dyR);

            for (var wC = 0; wC < uniforms.filterDims[2]; wC++) {
              let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[2]);

              if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
                continue;
              }
              let idyC = i32(dyC);

              let dyValue = getDy(batch, idyD, idyR, idyC, ch);
              let maxPosValue = lastIndex - i32(getMaxPos(batch, idyD, idyR, idyC, ch));

              // Get the current value, check it against the value from the
              // position matrix.
              let curPosValue = wD * uniforms.filterDims[1] * uniforms.filterDims[2] + wR * uniforms.filterDims[2] + wC;
              let mask = select(0.0, 1.0, maxPosValue == curPosValue);
              dotProd += dyValue * mask;
            }
          }
        }

        setOutputAtIndex(index, dotProd);
      }
    }
    `}}/**
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
 */function Xm(s){const{inputs:e,backend:t,attrs:o}=s,{dy:i,input:r}=e,n=r,{filterSize:a,strides:u,pad:l,dimRoundingMode:d}=o,c=[1,1,1],h=It(n.shape,a,u,c,l,d),p=new ns(h,"max",!0);let f=[{type:"int32",data:[h.strideDepth,h.strideHeight,h.strideWidth]},{type:"int32",data:[h.padInfo.front,h.padInfo.top,h.padInfo.left]},{type:"int32",data:[h.inDepth,h.inHeight,h.inWidth]},{type:"int32",data:[h.effectiveFilterDepth,h.effectiveFilterHeight,h.effectiveFilterWidth]}];const m=t.runWebGPUProgram(p,[n],"int32",f),g=new Hm(h);f=[{type:"int32",data:[h.strideDepth,h.strideHeight,h.strideWidth]},{type:"int32",data:[h.effectiveFilterDepth-1-h.padInfo.front,h.effectiveFilterHeight-1-h.padInfo.top,h.effectiveFilterWidth-1-h.padInfo.left]},{type:"int32",data:[h.effectiveFilterDepth,h.effectiveFilterHeight,h.effectiveFilterWidth]},{type:"int32",data:[h.outDepth]},{type:"int32",data:[h.outHeight]},{type:"int32",data:[h.outWidth]}];const x=t.runWebGPUProgram(g,[i,m],n.dtype,f);return t.disposeData(m.dataId),x}const Km={kernelName:Un,backendName:"webgpu",kernelFunc:Xm};/**
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
 */function qm(s){const{inputs:e,backend:t,attrs:o}=s,{dy:i,input:r,output:n}=e,a=r;Si([r,n],"maxPoolGrad");const{filterSize:u,strides:l,pad:d,dimRoundingMode:c}=o,h=ft(a.shape,u,l,1,d,c),p=new lt(h,"max",!0);let f=[{type:"int32",data:[h.strideHeight,h.strideWidth]},{type:"int32",data:[h.padInfo.top,h.padInfo.left]},{type:"int32",data:[h.dilationHeight,h.dilationWidth]},{type:"int32",data:[h.inHeight,h.inWidth]},{type:"int32",data:[h.effectiveFilterHeight,h.effectiveFilterWidth]}];const m=t.runWebGPUProgram(p,[a],"int32",f),g=new Gm(h);f=[{type:"int32",data:[h.strideHeight,h.strideWidth]},{type:"int32",data:[h.effectiveFilterHeight-1-h.padInfo.top,h.effectiveFilterWidth-1-h.padInfo.left]},{type:"int32",data:[h.dilationHeight,h.dilationWidth]},{type:"int32",data:[h.effectiveFilterHeight,h.effectiveFilterWidth]},{type:"int32",data:[h.outHeight]},{type:"int32",data:[h.outWidth]}];const x=t.runWebGPUProgram(g,[i,m],a.dtype,f);return t.disposeData(m.dataId),x}const Ym={kernelName:Gn,backendName:"webgpu",kernelFunc:qm};/**
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
 */function jm(s){const{inputs:e,backend:t,attrs:o}=s,{filterSize:i,strides:r,pad:n,includeBatchInIndex:a}=o,{x:u}=e;G(u.shape.length===4,()=>`Error in maxPool: input must be rank 4 but got rank ${u.shape.length}.`);const l=[1,1];G(fi(r,l),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${r} and dilations '${l}'`);const d=ft(u.shape,i,r,l,n),c=[{type:"int32",data:[d.strideHeight,d.strideWidth]},{type:"int32",data:[d.padInfo.top,d.padInfo.left]},{type:"int32",data:[d.dilationHeight,d.dilationWidth]},{type:"int32",data:[d.inHeight,d.inWidth]},{type:"int32",data:[d.effectiveFilterHeight,d.effectiveFilterWidth]}];let h=new lt(d,"max",!1);const p=t.runWebGPUProgram(h,[u],u.dtype,c);h=new lt(d,"max",!0,!0,a);const f=t.runWebGPUProgram(h,[u],"int32",c);return[p,f]}const Qm={kernelName:Hn,backendName:"webgpu",kernelFunc:jm};/**
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
 */function Zm(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{axis:r,keepDims:n}=o;return Te(i,r,n,"min",t)}const Jm={kernelName:Xn,backendName:"webgpu",kernelFunc:Zm};/**
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
 */const eg=j({opType:T.MIN,cpuKernelImpl:gc}),tg={kernelName:Kn,backendName:"webgpu",kernelFunc:eg};/**
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
 */class sg{constructor(e,t,o){this.uniforms="",this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.map((i,r)=>i[0]+e[r]+i[1]),this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.xShape=e,t.map((i,r)=>{this.uniforms+=` pad${r} : vec2<i32>,`}),this.offset=o==="reflect"?0:1,this.shaderKey=`mirrorPad_${o}`}getUserCode(){const e=this.xShape.length,t=this.xShape.map((l,d)=>`uniforms.pad${d}[0]`).join(","),o=this.xShape.map((l,d)=>`uniforms.pad${d}[0] + uniforms.xShape${e>1?`[${d}]`:""}`).join(","),i=e===1?"start":"start[i]",r=e===1?"end":"end[i]",n=e===1?"outC":"outC[i]",a=K(e),u=e>1?["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,e):"coords";return`
      ${R("index")} {
        if (index < uniforms.size) {
          let start = ${a}(${t});
          let end = ${a}(${o});
          var outC = getCoordsFromIndex(index);
          for (var i = 0; i < ${e}; i = i + 1) {
            if (${n} < ${i}) {
              ${n} = ${i} * 2 - ${n} - ${this.offset};
            } else if(${n} >= ${r}) {
              ${n} = (${r} - 1) * 2 - ${n} + ${this.offset};
            }
          }
          let coords = outC - start;
          setOutputAtIndex(index, getX(${u}));
        }
      }
    `}}/**
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
 */const ig={kernelName:qn,backendName:"webgpu",kernelFunc:({inputs:s,attrs:e,backend:t})=>{const{x:o}=s,{paddings:i,mode:r}=e,n=t,a=i.map(d=>({type:"int32",data:[d[0],d[1]]})),u=new sg(o.shape,i,r);return n.runWebGPUProgram(u,[o],o.dtype,a)}};/**
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
 */const og=j({opType:T.MOD}),rg={kernelName:Yn,backendName:"webgpu",kernelFunc:og};/**
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
 */class ng{constructor(e,t){this.variableNames=["probs"],this.outputShape=[],this.uniforms="seed : f32, numOutcomes: i32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[e,t],this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="multinomial"}getUserCode(){return`
    //Based on the work of Dave Hoskins
    //https://www.shadertoy.com/view/4djSRW
    fn random (seed : f32, resultUV : vec2<f32>) -> f32 {
      let HASHSCALE1 = 443.8975;
      let p = resultUV * seed;
      var p3  = fract(vec3<f32>(p.xyx) * HASHSCALE1);
      p3 = p3 + dot(p3, p3.yzx + 19.19);
      return fract((p3.x + p3.y) * p3.z);
    }

    ${R("index")} {
      if (index < uniforms.size) {
        let coords = getOutputCoords();
        let batch = coords[0];

        let resUV = vec2<f32>(f32(coords[1]) / f32(uniforms.outShape[1]),
            f32(coords[0]) / f32(uniforms.outShape[0]));
        let r = random(uniforms.seed, resUV);
        var cdf = 0.0;
        for (var i = 0; i < uniforms.numOutcomes - 1; i = i + 1) {
          cdf = cdf + getProbs(batch, i);

          if (r < cdf) {
            setOutputAtIndexI32(index, i);
            return;
          }
        }

        // If no other event happened, last event happened.
        setOutputAtIndexI32(index, uniforms.numOutcomes - 1);
      }
    }
  `}}/**
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
 */class ag{constructor(e){this.variableNames=["logits"],this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=[this.outputShape[0],1,1],this.outputShape[1]>=4096?this.workgroupSize=[256,1,1]:this.workgroupSize=[64,1,1],this.shaderKey="softmax"}getUserCode(){return`
    var<workgroup> buf : array<f32, ${this.workgroupSize[0]}>;
    var<workgroup> rowMaxShared : f32;
    var<workgroup> rowSumShared : f32;
    const blockSize = ${this.workgroupSize[0]};
    ${R("index")} {
      let row = index / blockSize;
      let tid = i32(localId.x);
      let cols = uniforms.outShape[1];

      var threadMax = -3.402823e+38f;
      for (var col = tid; col < cols; col += blockSize) {
        let value = getLogits(row, col);
        threadMax = max(threadMax, value);
      }
      if (tid < cols) {
        buf[tid] = threadMax;
      }
      workgroupBarrier();

      var reduceSize = min(cols, blockSize);
      for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
        reduceSize = currSize + (reduceSize & 1);
        if (tid < currSize) {
          buf[tid] = max(buf[tid], buf[tid + reduceSize]);
        }
        workgroupBarrier();
      }

      if (tid == 0) {
        rowMaxShared = buf[0];
      }
      workgroupBarrier();

      var threadSum = 0.0;
      for (var col = tid; col < cols; col += blockSize) {
        let subExp = exp(getLogits(row, col) - rowMaxShared);
        threadSum += subExp;
      }
      buf[tid] = threadSum;
      workgroupBarrier();

      for (var currSize = blockSize >> 1;  currSize > 0; currSize = currSize >> 1) {
        if (tid < currSize) {
          buf[tid] = buf[tid] + buf[tid + currSize];
        }
        workgroupBarrier();
      }

      if (tid == 0) {
        rowSumShared = buf[0];
      }
      workgroupBarrier();

      for (var col = tid; col < cols; col += blockSize) {
        let value = exp(getLogits(row, col) - rowMaxShared) / rowSumShared;
        setOutputAtCoords(row, col, value);
      }
  }
    `}}/**
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
 */function Wi(s){const{inputs:e,backend:t,attrs:o}=s,{logits:i}=e,{dim:r}=o,n=z({inputs:{x:i},backend:t,attrs:{shape:[M(i.shape)/i.shape[r],i.shape[r]]}}),a=new ag(n.shape),u=t.runWebGPUProgram(a,[n],i.dtype),l=z({inputs:{x:u},backend:t,attrs:{shape:i.shape}});return t.disposeData(n.dataId),t.disposeData(u.dataId),l}const ug={kernelName:jn,backendName:"webgpu",kernelFunc:Wi};/**
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
 */function lg(s){const{inputs:e,backend:t,attrs:o}=s,{logits:i}=e,{numSamples:r,seed:n,normalized:a}=o,u=a?i:Wi({inputs:{logits:i},backend:t,attrs:{dim:i.shape.length-1}}),l=u.shape[0],d=u.shape[1],c=new ng(l,r),h=[{type:"float32",data:[n]},{type:"int32",data:[d]}],p=t.runWebGPUProgram(c,[u],"int32",h);return a||t.disposeData(u.dataId),p}const dg={kernelName:Qn,backendName:"webgpu",kernelFunc:lg};/**
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
 */function cg(s){const{inputs:e,backend:t}=s,{x:o}=e;if(t.shouldExecuteOnCPU([o])){const r=t.tensorMap.get(o.dataId),[n,a]=yc(r.values,o.shape,o.dtype);return t.makeTensorInfo(a,o.dtype,n)}const i=new Qe(o.shape,P.NEG);return t.runWebGPUProgram(i,[o],o.dtype)}const hg={kernelName:Zn,backendName:"webgpu",kernelFunc:cg};/**
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
 */function pg(s){console.warn("tf.nonMaxSuppression() in webgpu locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");const{inputs:e,backend:t,attrs:o}=s,{boxes:i,scores:r}=e,{maxOutputSize:n,iouThreshold:a,scoreThreshold:u}=o,l=t.readSync(i.dataId),d=t.readSync(r.dataId),{selectedIndices:c}=ea(l,d,n,a,u);return t.makeTensorInfo([c.length],"int32",new Int32Array(c))}const fg={kernelName:Jn,backendName:"webgpu",kernelFunc:pg};/**
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
 */function mg(s){console.warn("tf.nonMaxSuppression() in webgpu locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");const{inputs:e,backend:t,attrs:o}=s,{boxes:i,scores:r}=e,{maxOutputSize:n,iouThreshold:a,scoreThreshold:u,softNmsSigma:l}=o,d=t.readSync(i.dataId),c=t.readSync(r.dataId),h=n,p=a,f=u,m=l,{selectedIndices:g,selectedScores:x}=sa(d,c,h,p,f,m);return[t.makeTensorInfo([g.length],"int32",new Int32Array(g)),t.makeTensorInfo([x.length],"float32",new Float32Array(x))]}const gg={kernelName:ta,backendName:"webgpu",kernelFunc:mg};/**
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
 */class xg{constructor(e,t){this.variableNames=["x"],this.uniforms="onValue : f32, offValue : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[e,t],this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="onehot"}getUserCode(){return`
      ${R("index")} {
        if(index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          setOutputAtIndex(index, mix(uniforms.offValue, uniforms.onValue,
                                      f32(i32(round(getX(coords.x))) == coords.y)));
        }
      }
    `}}/**
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
 */function yg(s){const{inputs:e,backend:t,attrs:o}=s,{indices:i}=e,{dtype:r,depth:n,onValue:a,offValue:u}=o,l=M(i.shape),d=new xg(l,n),c=z({inputs:{x:i},backend:t,attrs:{shape:[l]}}),h=[{type:"float32",data:[a]},{type:"float32",data:[u]}],p=t.runWebGPUProgram(d,[c],r,h);t.disposeData(c.dataId);const f=[...i.shape,n],m=z({inputs:{x:p},backend:t,attrs:{shape:f}});return t.disposeData(p.dataId),m}const wg={kernelName:ia,backendName:"webgpu",kernelFunc:yg};/**
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
 */function St(s){const{inputs:e,backend:t}=s,{x:o}=e;if(o.dtype==="complex64"){const i=gt({inputs:{input:o},backend:t}),r=St({inputs:{x:i},backend:t}),n=Dt({inputs:{input:o},backend:t}),a=St({inputs:{x:n},backend:t}),u=Me({inputs:{real:r,imag:a},backend:t});return t.disposeData(i.dataId),t.disposeData(r.dataId),t.disposeData(n.dataId),t.disposeData(a.dataId),u}else return ie({attrs:{shape:o.shape,dtype:o.dtype,value:o.dtype==="string"?"":0},backend:t})}const Cg={kernelName:oa,backendName:"webgpu",kernelFunc:St};/**
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
 */function Vi(s){const{inputs:e,backend:t}=s,{x:o}=e;if(o.dtype==="string")throw new Error("onesLike is not supported under string dtype");if(o.dtype==="complex64"){const i=gt({inputs:{input:o},backend:t}),r=Vi({inputs:{x:i},backend:t}),n=Dt({inputs:{input:o},backend:t}),a=St({inputs:{x:n},backend:t}),u=Me({inputs:{real:r,imag:a},backend:t});return t.disposeData(i.dataId),t.disposeData(r.dataId),t.disposeData(n.dataId),t.disposeData(a.dataId),u}else return ie({attrs:{shape:o.shape,dtype:o.dtype,value:1},backend:t})}const bg={kernelName:ra,backendName:"webgpu",kernelFunc:Vi};/**
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
 */function Sg(s){const{inputs:e,backend:t,attrs:o}=s,{axis:i}=o;if(e.length===1)return Xt({inputs:{input:e[0]},backend:t,attrs:{dim:i}});const r=e[0].shape,n=e[0].dtype;e.forEach(d=>{aa(r,d.shape,"All tensors passed to stack must have matching shapes"),G(n===d.dtype,()=>"All tensors passed to stack must have matching dtypes")});const a=[],u=e.map(d=>{const c=Xt({inputs:{input:d},backend:t,attrs:{dim:i}});return a.push(c),c}),l=zi({inputs:u,backend:t,attrs:{axis:i}});return a.forEach(d=>t.disposeData(d.dataId)),l}const vg={kernelName:na,backendName:"webgpu",kernelFunc:Sg};/**
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
 */function Ui(s,e=!1){const t=s.length,o=K(t),i=s.map((c,h)=>`uniforms.pad${h}[0]`).join(","),r=s.map((c,h)=>`uniforms.pad${h}[0] + uniforms.xShape${t>1?`[${h}]`:""}`).join(","),n=t>1?`${o}(${i})`:`${i}`,a=t>1?`${o}(${r})`:`${r}`,u=t>1?"any(paddedCoords < start)":"paddedCoords < start",l=t>1?"any(paddedCoords >= end)":"paddedCoords >= end",d=t>1?["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,t):"coords";return`
        let start = ${n};
        let end = ${a};
        if (${u} || ${l}) {
          setOutputAtIndex(index, ${e?0:"uniforms.constantValue"});
        } else {
          let coords = paddedCoords - start;
          setOutputAtIndex(index, getX(${d}));
        }
  `}class kg{constructor(e,t){this.variableNames=["x"],this.uniforms="constantValue : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.map((o,i)=>o[0]+e[i]+o[1]),this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),t.map((o,i)=>{this.uniforms+=` pad${i} : vec2<i32>,`}),this.xShape=e,this.shaderKey="pad"}getUserCode(){return`
      ${R("index")} {
        if (index < uniforms.size) {
          let paddedCoords = getCoordsFromIndex(index);
          ${Ui(this.xShape)}
        }
      }
    `}}/**
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
 */const Ig=s=>{const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{paddings:r,constantValue:n}=o;if(r.every(l=>Ke(l,[0,0])))return ae({inputs:{x:i},backend:t});if(M(i.shape)===0){const l=r.map((d,c)=>d[0]+i.shape[c]+d[1]);return ie({backend:t,attrs:{shape:l,value:n,dtype:i.dtype}})}const a=[{type:"float32",data:[n]}];r.map(l=>a.push({type:"int32",data:[l[0],l[1]]}));const u=new kg(i.shape,r);return t.runWebGPUProgram(u,[i],i.dtype,a)},Pg={kernelName:ua,backendName:"webgpu",kernelFunc:Ig};/**
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
 */const Rg=j({opType:T.POW}),$g={kernelName:la,backendName:"webgpu",kernelFunc:Rg};/**
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
 */function Dg(s){const{inputs:e,backend:t}=s,{x:o,alpha:i}=e,r=new Ct(T.PRELU,o.shape,i.shape);return t.runWebGPUProgram(r,[o,i],"float32")}const Ng={kernelName:da,backendName:"webgpu",kernelFunc:Dg};/**
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
 */function zg(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{axis:r,keepDims:n}=o;return Te(i,r,n,"prod",t)}const Ag={kernelName:ca,backendName:"webgpu",kernelFunc:zg};/**
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
 */const Fg=s=>{const{backend:e,attrs:t}=s,{start:o,stop:i,step:r,dtype:n}=t,a=bc(o,i,r,n);return e.makeTensorInfo([a.length],n,a)},Mg={kernelName:ha,backendName:"webgpu",kernelFunc:Fg};/**
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
 */const Tg=j({opType:T.DIV}),Lg={kernelName:pa,backendName:"webgpu",kernelFunc:Tg};/**
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
 */const Eg=U({opType:P.RECIPROCAL}),_g={kernelName:fa,backendName:"webgpu",kernelFunc:Eg};/**
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
 */const Bg=U({opType:P.RELU}),Og={kernelName:ma,backendName:"webgpu",kernelFunc:Bg};/**
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
 */const Wg=U({opType:P.RELU6}),Vg={kernelName:ga,backendName:"webgpu",kernelFunc:Wg};/**
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
 */class Ug{constructor(e,t,o){this.variableNames=["x"],this.uniforms="adjustHeightWidth : vec2<f32>, halfPixelCenters : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[e[0],t,o,e[3]],this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="resizeBilinear"}getUserCode(){return`
      ${R("index")} {
        if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
          let b = coords[0];
          let d = coords[3];
          let rc = coords.yz;

          let effectiveInSize = vec2<f32>(
            f32(uniforms.xShape.y) - uniforms.adjustHeightWidth[0],
            f32(uniforms.xShape.z) - uniforms.adjustHeightWidth[1]);

          let effectiveOutSize = vec2<f32>(
            f32(uniforms.outShape.y) - uniforms.adjustHeightWidth[0],
            f32(uniforms.outShape.z) - uniforms.adjustHeightWidth[1]);

          let effectiveInputOverOutputRatioRC =
              effectiveInSize / effectiveOutSize;

          // Fractional source index
          let sourceFracIndexRC =
            (vec2<f32>(rc) + vec2<f32>(uniforms.halfPixelCenters)) *
            effectiveInputOverOutputRatioRC - vec2<f32>(uniforms.halfPixelCenters);

          // Compute the four integer indices.
          let sourceFloorRC = vec2<i32>(sourceFracIndexRC);
          let sourceCeilRC = vec2<i32>(
            min(vec2<f32>(uniforms.xShape.yz) - vec2<f32>(1.0), ceil(sourceFracIndexRC)));

          let topLeft = getX(b, sourceFloorRC.x, sourceFloorRC.y, d);
          let bottomLeft = getX(b, sourceCeilRC.x, sourceFloorRC.y, d);
          let topRight = getX(b, sourceFloorRC.x, sourceCeilRC.y, d);
          let bottomRight = getX(b, sourceCeilRC.x, sourceCeilRC.y, d);

          let fracRC = sourceFracIndexRC - vec2<f32>(sourceFloorRC);

          let top = topLeft + (topRight - topLeft) * fracRC.y;
          let bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;
          let newValue = top + (bottom - top) * fracRC.x;

          setOutputAtIndex(index, newValue);
        }
      }
    `}}/**
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
 */function Gg(s){const{inputs:e,backend:t,attrs:o}=s,{images:i}=e,{alignCorners:r,size:n,halfPixelCenters:a}=o,[u,l]=n,d=r&&u>1?1:0,c=r&&l>1?1:0,p=[{type:"float32",data:[d,c]},{type:"float32",data:[a?.5:0]}],f=new Ug(i.shape,u,l);return t.runWebGPUProgram(f,[i],"float32",p)}const Hg={kernelName:xa,backendName:"webgpu",kernelFunc:Gg};/**
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
 */class Xg{constructor(e,t){this.variableNames=["dy"],this.uniforms=`effectiveXSize : vec2<i32>, effectiveYSize : vec2<i32>, heightScale : f32, widthScale : f32,
       invHeightScale : f32, invWidthScale : f32, winHeight : i32, winWidth : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.alignCorners=t,this.shaderKey=`resizeBilinearBackprop_${t}`}getUserCode(){return`
      ${R("index")} {
        if (index < uniforms.size) {
          let coords = getOutputCoords();
          let b = coords[0];
          let d = coords[3];
          let r = coords[1];
          let c = coords[2];

          var accumulator = 0.0;

          // Compute bounds for where in dy we will look
          let startRLerp = floor(f32(r) * uniforms.invHeightScale);
          let startDyR = i32(startRLerp - f32(uniforms.winHeight / 2));

          let startCLerp = floor(f32(c) * uniforms.invWidthScale);
          let startDyC = i32(startCLerp - f32(uniforms.winWidth / 2));

          // Loop over dy
          for (var dyROffset = 0; dyROffset < uniforms.winHeight; dyROffset++) {
            let dyR = startDyR + dyROffset;

            // Guard against the window exceeding the bounds of dy
            if (dyR < 0 || dyR >= uniforms.dyShape[1]) {
              continue;
            }

            for (var dyCOffset = 0; dyCOffset < uniforms.winWidth; dyCOffset++) {
              let dyC = startDyC + dyCOffset;

              // Guard against the window exceeding the bounds of dy
              if (dyC < 0 || dyC >= uniforms.dyShape[2]) {
                continue;
              }

              let dxR = f32(dyR) * uniforms.heightScale;
              let topDxRIndex = i32(floor(dxR));
              let bottomDxRIndex = i32(min(ceil(dxR), f32(uniforms.outShape[1] - 1)));
              let dxRLerp = dxR - f32(topDxRIndex);
              let inverseDxRLerp = 1.0 - dxRLerp;

              let dxC = f32(dyC) * uniforms.widthScale;
              let leftDxCIndex = i32(floor(dxC));
              let rightDxCIndex = i32(min(ceil(dxC), f32(uniforms.outShape[2] - 1)));
              let dxCLerp = dxC - f32(leftDxCIndex);
              let inverseDxCLerp = 1.0 - dxCLerp;

              if (r == topDxRIndex && c == leftDxCIndex) {
                // topLeft
                accumulator +=
                  getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;
              }

              if (r == topDxRIndex && c == rightDxCIndex) {
                // topRight
                accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;
              }

              if (r == bottomDxRIndex && c == leftDxCIndex) {
                // bottomLeft
                accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;
              }

              if (r == bottomDxRIndex && c == rightDxCIndex) {
                // bottomRight
                accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;
              }
            }
          }
          // End loop over dy

          setOutputAtIndex(index, accumulator);
        }
      }
    `}}/**
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
 */function Kg(s){const{inputs:e,backend:t,attrs:o}=s,{images:i,dy:r}=e,{alignCorners:n}=o,[,a,u]=i.shape,[,l,d]=r.shape,c=[n&&l>1?a-1:a,n&&d>1?u-1:u],h=[n&&l>1?l-1:l,n&&d>1?d-1:d],p=c[0]/h[0],f=c[1]/h[1],m=1/p,g=1/f,x=Math.ceil(m)*2+2,y=Math.ceil(g)*2+2,w=new Xg(i.shape,n),C=[{type:"int32",data:c},{type:"int32",data:h},{type:"float32",data:[p]},{type:"float32",data:[f]},{type:"float32",data:[m]},{type:"float32",data:[g]},{type:"int32",data:[x]},{type:"int32",data:[y]}];return t.runWebGPUProgram(w,[r],r.dtype,C)}const qg={kernelName:ya,backendName:"webgpu",kernelFunc:Kg};/**
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
 */class Yg{constructor(e,t,o,i){this.variableNames=["x"],this.uniforms="adjustHeightWidth : vec2<f32>, roundBase : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[e[0],t,o,e[3]],this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.halfPixelCenters=i,this.shaderKey=`resizeNearest_${i}`}getUserCode(){let e;return this.halfPixelCenters?e="max((vec2<f32>(rc) + vec2<f32>(0.5)) * effectiveInputOverOutputRatioRC, vec2<f32>(0.0))":e="vec2<f32>(rc) * effectiveInputOverOutputRatioRC",`
      ${R("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let b = coords[0];
          let d = coords[3];
          let rc = coords.yz;

          let effectiveInSize = vec2<f32>(
            f32(uniforms.xShape.y) - uniforms.adjustHeightWidth[0],
            f32(uniforms.xShape.z) - uniforms.adjustHeightWidth[1]);

          let effectiveOutSize = vec2<f32>(
            f32(uniforms.outShape.y) - uniforms.adjustHeightWidth[0],
            f32(uniforms.outShape.z) - uniforms.adjustHeightWidth[1]);

          let effectiveInputOverOutputRatioRC =
              effectiveInSize / effectiveOutSize;

          // Fractional source index
          let sourceFracIndexRC = ${e};

          // Compute the coordinators of nearest neighbor point.
          let inputShapeRC = vec2<f32>(f32(uniforms.xShape.y), f32(uniforms.xShape.z));
          let sourceNearestRC = vec2<i32>(
            min(inputShapeRC - 1.0, floor(sourceFracIndexRC + uniforms.roundBase)));
          let newValue = getX(b, sourceNearestRC.x, sourceNearestRC.y, d);

          setOutputAtIndex(index, newValue);
        }
      }
    `}}/**
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
 */function jg(s){const{inputs:e,backend:t,attrs:o}=s,{images:i}=e,{alignCorners:r,halfPixelCenters:n,size:a}=o,[u,l]=a,d=r&&u>1?1:0,c=r&&l>1?1:0,p=[{type:"float32",data:[d,c]},{type:"float32",data:[r?.5:0]}],f=new Yg(i.shape,u,l,n);return t.runWebGPUProgram(f,[i],i.dtype,p)}const Qg={kernelName:wa,backendName:"webgpu",kernelFunc:jg};/**
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
 */class Zg{constructor(e,t){this.variableNames=["dy"],this.uniforms=`effectiveXSize : vec2<i32>, effectiveYSize : vec2<i32>, invHeightScale : f32, invWidthScale : f32,
       winHeight : i32, winWidth : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.alignCorners=t,this.shaderKey=`resizeNearestNeigborBackprop_${t}`}getUserCode(){return`
      ${R("index")} {
        if (index < uniforms.size) {
          let coords = getOutputCoords();
          let b = coords[0];
          let d = coords[3];
          let r = coords[1];
          let c = coords[2];

          var accumulator = 0.0;

          // Compute bounds for where in dy we will look
          let startRLerp = floor(f32(r) * uniforms.invHeightScale);
          let startDyR = i32(floor(startRLerp - f32(uniforms.winHeight / 2)));

          let startCLerp = floor(f32(c) * uniforms.invWidthScale);
          let startDyC = i32(floor(startCLerp - f32(uniforms.winWidth / 2)));

          // Loop over dy
          for (var dyROffset = 0; dyROffset < uniforms.winHeight; dyROffset++) {
            let dyR = startDyR + dyROffset;

            // Guard against the window exceeding the bounds of dy
            if (dyR < 0 || dyR >= uniforms.dyShape[1]) {
              continue;
            }

            for (var dyCOffset = 0; dyCOffset < uniforms.winWidth; dyCOffset++) {
              let dyC = startDyC + dyCOffset;

              // Guard against the window exceeding the bounds of dy
              if (dyC < 0 || dyC >= uniforms.dyShape[2]) {
                continue;
              }

              let sourceFracRow = f32(uniforms.effectiveXSize[0]) *
                  (f32(dyR) / f32(uniforms.effectiveYSize[0]));

              let sourceFracCol = f32(uniforms.effectiveXSize[1]) *
                  (f32(dyC) / f32(uniforms.effectiveYSize[1]));

              let sourceNearestRow =
                  i32(min(f32(uniforms.outShape[1] - 1),
                  ${this.alignCorners?"floor(sourceFracRow + 0.5)":"floor(sourceFracRow)"}));

              let sourceNearestCol =
                  i32(min(f32(uniforms.outShape[2] - 1),
                  ${this.alignCorners?"floor(sourceFracCol + 0.5)":"floor(sourceFracCol)"}));

              if (r == sourceNearestRow && c == sourceNearestCol) {
                accumulator += getDy(b, dyR, dyC, d);
              }
            }
          }
          // End loop over dy

          setOutputAtIndex(index, accumulator);
        }
      }
    `}}/**
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
 */function Jg(s){const{inputs:e,backend:t,attrs:o}=s,{images:i,dy:r}=e,{alignCorners:n}=o,[,a,u]=i.shape,[,l,d]=r.shape,c=[n&&l>1?a-1:a,n&&d>1?u-1:u],h=[n&&l>1?l-1:l,n&&d>1?d-1:d],p=c[0]/h[0],f=c[1]/h[1],m=1/p,g=1/f,x=Math.ceil(m)*2+2,y=Math.ceil(g)*2+2,w=new Zg(i.shape,n),C=[{type:"int32",data:c},{type:"int32",data:h},{type:"float32",data:[m]},{type:"float32",data:[g]},{type:"int32",data:[x]},{type:"int32",data:[y]}];return t.runWebGPUProgram(w,[r],r.dtype,C)}const ex={kernelName:Ca,backendName:"webgpu",kernelFunc:Jg};/**
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
 */class tx{constructor(e){this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.uniforms=" axis : vec4<i32>,",this.shaderKey="reverse"}getUserCode(){return`
      
      // Using uniform variables as judging conditions, so the function has
      // coherent execution within all threads.
      fn getReverseCoords(coords : vec4<i32>) -> vec4<i32> {
        var reverseCoords = coords;
        if (uniforms.axis[0] == 1) {
          reverseCoords[0] = uniforms.xShape[0] - coords[0] - 1;
        }
        if (uniforms.axis[1] == 1) {
          reverseCoords[1] = uniforms.xShape[1] - coords[1] - 1;
        }
        if (uniforms.axis[2] == 1) {
          reverseCoords[2] = uniforms.xShape[2] - coords[2] - 1;
        }
        if (uniforms.axis[3] == 1) {
          reverseCoords[3] = uniforms.xShape[3] - coords[3] - 1;
        }

        return reverseCoords;
      }
    
      ${R("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let reverseCoords = getReverseCoords(coords);
          setOutputAtIndex(index, getX(reverseCoords[0],
              reverseCoords[1], reverseCoords[2], reverseCoords[3]));
        }
      }
    `}}/**
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
 */function sx(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{dims:r}=o,n=i.shape.length;if(n===0)return ae({inputs:{x:i},backend:t});const a=i.shape,u=[1,1,1,1];a.forEach((g,x)=>{const y=x+4-n;u[y]=g});const l=Ae(r,i.shape),d=[0,0,0,0];l.forEach(g=>{const x=g+4-n;d[x]=1});const c=[{type:"int32",data:d}],h=z({inputs:{x:i},backend:t,attrs:{shape:u}}),p=new tx(u),f=t.runWebGPUProgram(p,[h],h.dtype,c);t.disposeData(h.dataId);const m=z({inputs:{x:f},backend:t,attrs:{shape:a}});return t.disposeData(f.dataId),m}const ix={kernelName:ba,backendName:"webgpu",kernelFunc:sx};/**
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
 */class ox{constructor(e,t){this.outputShape=[],this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.uniforms=`centerX : f32, centerY : f32, sinRadians : f32,
          cosRadians : f32,`,this.shaderKey="rotate",this.outputShape=e,typeof t=="number"?(this.uniforms+=" fillValue : f32,",this.fillSnippet="var outputValue = uniforms.fillValue;",this.shaderKey+="_float"):(this.uniforms+=" fillValue : vec3<f32>,",this.fillSnippet="var outputValue = uniforms.fillValue[coords[3]];",this.shaderKey+="_vec3")}getUserCode(){return`
        ${R("index")} {
          if (index < uniforms.size) {
            let coords = getCoordsFromIndex(index);
            let coordXFloat = (f32(coords[2]) - uniforms.centerX) *
                uniforms.cosRadians - (f32(coords[1]) - uniforms.centerY) *
                uniforms.sinRadians;
            let coordYFloat = (f32(coords[2]) - uniforms.centerX) *
                uniforms.sinRadians + (f32(coords[1]) - uniforms.centerY) *
                uniforms.cosRadians;
            let coordX = i32(round(coordXFloat + uniforms.centerX));
            let coordY = i32(round(coordYFloat + uniforms.centerY));
            ${this.fillSnippet}
            if(coordX >= 0 && coordX < uniforms.xShape[2] && coordY >= 0 &&
                coordY < uniforms.xShape[1]) {
              outputValue = getX(coords[0], coordY, coordX, coords[3]);
            }
            setOutputAtIndex(index, outputValue);
          }
        }
      `}}/**
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
 */const rx={kernelName:Sa,backendName:"webgpu",kernelFunc:({inputs:s,attrs:e,backend:t})=>{const{image:o}=s,{radians:i,fillValue:r,center:n}=e,a=t,u=new ox(o.shape,r),[l,d]=va(n,o.shape[1],o.shape[2]),c=[{type:"float32",data:[l]},{type:"float32",data:[d]},{type:"float32",data:[Math.sin(i)]},{type:"float32",data:[Math.cos(i)]}];return typeof r=="number"?c.push({type:"float32",data:[Number.parseFloat(r.toFixed(2))]}):c.push({type:"float32",data:r}),a.runWebGPUProgram(u,[o],o.dtype,c)}};/**
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
 */const nx=U({opType:P.ROUND}),ax={kernelName:ka,backendName:"webgpu",kernelFunc:nx};/**
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
 */const ux=U({opType:P.RSQRT,cpuKernelImpl:Sc}),lx={kernelName:Ia,backendName:"webgpu",kernelFunc:ux};/**
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
 */class rt{constructor(e,t,o,i,r,n,a,u=!0){this.variableNames=["updates","indices"],this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=n,this.type=a,this.sumDupeIndices=u,this.dispatchLayout=D(e),this.dispatch=$(this.dispatchLayout,e,this.workgroupSize),this.sliceDimGreaterThanOne=t>1,this.shaderKey=`scatter_${o}_${i}_${this.sliceDimGreaterThanOne}_${a}_${u}_${r.length}`;const l=K(r.length);this.uniforms=`sliceDim : i32, strides: ${l}, updatesSize: i32,`,this.updatesRank=i,this.indicesRank=o}getUserCode(){let e="";this.indicesRank===1?e="coords[0]":this.indicesRank===2&&(e="coords[0], j");const t=`getIndices(${e})`,o=this.sliceDimGreaterThanOne?"uniforms.strides[j]":"uniforms.strides";let i="",r="";this.dispatchLayout.x.length===1?(i="flattenedIndex",r=`
      fn getUpdatesCoordsFromFlatIndex(index : i32) -> i32 {
        return index;
      }
      `):this.dispatchLayout.x.length===2&&(i="vec2<i32>(flattenedIndex, coords[1])",r=`
      fn getUpdatesCoordsFromFlatIndex(index : i32) -> vec2<i32> {
        // N.B. |updates| could be a scalar tensor, conceptually representing a
        // 2D tensor with all values equal to that. By design, its size must be
        // the same as |outShape[1]| in one dimension, and |indicesShape[0]|
        // gives the other.
        let sliceSize = uniforms.outShape[1];
        let d0 = index / sliceSize;
        let d1 = index - d0 * sliceSize;
        return vec2<i32>(d0, d1);
      }
      `);const a=`getUpdates(${Array.from({length:this.updatesRank},(l,d)=>`coords[${d}]`).join(", ")})`;return`
    ${r}
      ${R("index")} {
        if (index < uniforms.updatesSize) {
          let coords = getUpdatesCoordsFromFlatIndex(index);
          var flattenedIndex = 0;
          for (var j = 0; j < uniforms.sliceDim; j = j + 1) {
            let indexInside = i32(round(${t}));
            flattenedIndex = flattenedIndex + indexInside * ${o};
          }
          let updateValue =
              ${Pe(this.type)}(${a});
          let flatIndex = getOutputIndexFromCoords(${i});

          ${this.sumDupeIndices?ke("&result[flatIndex]","updateValue",this.type):"atomicStore(&result[flatIndex], bitcast<i32>(updateValue));"}
        }
      }`}}/**
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
 */function dx(s){const{inputs:e,backend:t,attrs:o}=s,{indices:i,updates:r}=e,{shape:n}=o,{sliceRank:a,numUpdates:u,sliceSize:l,strides:d,outputSize:c}=ts(r,i,n),h=[c/l,l];if(c===0)return t.makeTensorInfo(n,i.dtype);const p=z({inputs:{x:i},backend:t,attrs:{shape:[u,a]}}),f=z({inputs:{x:r},backend:t,attrs:{shape:[u,l]}}),m=f.dtype,g=ie({backend:t,attrs:{shape:h,value:0,dtype:m}}),x=M(f.shape),y=[{type:"int32",data:[a]},{type:"int32",data:d},{type:"int32",data:[x]}],w=new rt(f.shape,a,p.shape.length,f.shape.length,d,h,m),C=t.runWebGPUProgram(w,[f,p],m,y,g),b=z({inputs:{x:C},backend:t,attrs:{shape:n}});return t.disposeData(p.dataId),t.disposeData(f.dataId),t.disposeData(C.dataId),b}const cx={kernelName:Pa,backendName:"webgpu",kernelFunc:dx};/**
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
 */class hx{constructor(e,t){this.outputShape=[],this.variableNames=["sortedSequence","values"],this.uniforms="numInputs : i32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.side=t,this.shaderKey=`search_sorted_${t}`}getUserCode(){return`
      fn findBound(batch: i32, value: f32) -> i32 {
        var left = i32(0);
        var right = uniforms.numInputs;
        while (left < right) {
          var mid = (left + right) / 2;
          if (getSortedSequence(batch, mid) ${this.side==="left"?"<":"<="} value) {
            left = mid + 1;
          } else {
            right = mid;
          }
        }
        return right;
      }

      ${R("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let value = getValuesByOutputIndex(index);
          setOutputAtIndexI32(index, findBound(coords[0], value));
        }
      }
    `}}/**
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
 */function px(s){const{inputs:e,backend:t,attrs:o}=s,{sortedSequence:i,values:r}=e,{side:n}=o,a=new hx([r.shape[0],r.shape[1]],n),u=[{type:"int32",data:[i.shape[1]]}];return t.runWebGPUProgram(a,[i,r],"int32",u)}const fx={kernelName:Ra,backendName:"webgpu",kernelFunc:px};/**
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
 */class mx{constructor(e,t,o){this.variableNames=["c","a","b"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.cRank=e,this.rank=o,this.shaderKey="select"}getUserCode(){let e,t;if(this.rank>4)throw Error(`Where for rank ${this.rank} is not yet supported`);if(this.rank===1)t="resRC",e="resRC";else{const i=["resRC.x","resRC.y","resRC.z","resRC.w"],r=[],n=[];for(let a=0;a<this.outputShape.length;a++)n.push(`${i[a]}`),a<this.cRank&&r.push(`${i[a]}`);e=r.join(),t=n.join()}return`
      ${R("index")} {
        if (index < uniforms.size) {
          let resRC = getCoordsFromIndex(index);
          let cVal = getC(${e});
          if (cVal >= 1.0) {
            setOutputAtIndex(index, getA(${t}));
          } else {
            setOutputAtIndex(index, getB(${t}));
          }
        }
      }
    `}}/**
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
 */function gx(s){const{inputs:e,backend:t}=s,{condition:o,t:i,e:r}=e,n=new mx(o.shape.length,i.shape,i.shape.length);return t.runWebGPUProgram(n,[o,i,r],Ue(i.dtype,r.dtype))}const xx={kernelName:$a,backendName:"webgpu",kernelFunc:gx};/**
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
 */const yx=U({opType:P.SELU}),wx={kernelName:Da,backendName:"webgpu",kernelFunc:yx};/**
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
 */const Cx=U({opType:P.SIGMOID}),bx={kernelName:Na,backendName:"webgpu",kernelFunc:Cx};/**
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
 */const Sx=U({opType:P.SIGN}),vx={kernelName:za,backendName:"webgpu",kernelFunc:Sx};/**
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
 */const kx=U({opType:P.SIN}),Ix={kernelName:Aa,backendName:"webgpu",kernelFunc:kx};/**
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
 */const Px=U({opType:P.SINH}),Rx={kernelName:Fa,backendName:"webgpu",kernelFunc:Px};/**
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
 */const $x=U({opType:P.SOFTPLUS}),Dx={kernelName:Ma,backendName:"webgpu",kernelFunc:$x};/**
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
 */class Nx{constructor(e,t,o,i,r,n){this.variableNames=["x"],this.outputShape=[],this.uniforms="",this.workgroupSize=[64,1,1],this.size=!0;const a=new Array(i.length);for(let u=0;u<a.length;u++)a[u]=i[r[u]];this.outputShape=a,this.newDim=r,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.xShape=e,this.paddedXShape=t,this.uniforms+=`reshapedPaddedXShape : ${K(i.length)}, paddedXShapeStrides : ${K(n)}, `,o.map((u,l)=>{this.uniforms+=` pad${l} : vec2<i32>,`}),this.shaderKey=`spaceToBatchND_${r}`}getUserCode(){const e=K(this.outputShape.length),t=ki(this.newDim);return`
      ${xt(this.paddedXShape,"PaddedX")}
      ${R("index")} {
        if(index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let switchedIndex = getIndexFromCoords${this.outputShape.length}D(${e}(${t}), uniforms.reshapedPaddedXShape);
          let paddedCoords = getPaddedXCoordsFromIndex(switchedIndex);
          ${Ui(this.xShape,!0)}
        }
      }
    `}}/**
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
 */const zx=s=>{const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{blockShape:r,paddings:n}=o;G(i.shape.length<=4,()=>"spaceToBatchND for rank > 4 with a WebGPU backend not implemented yet");const a=r.reduce((y,w)=>y*w),u=[[0,0]];u.push(...n);for(let y=1+r.length;y<i.shape.length;++y)u.push([0,0]);const l=u.map((y,w)=>y[0]+i.shape[w]+y[1]),d=li(l,r,a,!1),c=di(d.length,r.length,!1),h=ci(l,r,a,!1),p=pe(l),f=new Nx(i.shape,l,u,d,c,p.length),m=[{type:"int32",data:d},{type:"int32",data:p}];u.map(y=>m.push({type:"int32",data:[y[0],y[1]]}));const g=t.runWebGPUProgram(f,[i],i.dtype,m),x=z({inputs:{x:g},backend:t,attrs:{shape:h}});return t.disposeData(g.dataId),x},Ax={kernelName:Ta,backendName:"webgpu",kernelFunc:zx};/**
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
 */class Fx{constructor(e,t,o){this.variableNames=["input","indices","segmentIds"],this.outputShape=[],this.uniforms="segmentSize : i32, sparseSize : i32,",this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=e,this.type=o,this.dispatchLayout=D([t]),this.dispatch=$(this.dispatchLayout,[t],this.workgroupSize),this.shaderKey="sparseSegmentSum"}getUserCode(){return`
    ${R("index")} {
      if (index < uniforms.sparseSize) {
        let indexInSegmentIds = index / uniforms.segmentSize;
        let indexInSegment = index % uniforms.segmentSize;
        let indexInInput = indices[indexInSegmentIds];
        let segmentId = segmentIds[indexInSegmentIds];

        let value = input[indexInInput * uniforms.segmentSize + indexInSegment];
        let outIndex = segmentId * uniforms.segmentSize + indexInSegment;
        ${ke("&result[outIndex]","value",this.type)}
      }
    }
  `}}class Mx{constructor(e,t){this.variableNames=["segmentIds"],this.outputShape=[],this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=[e],this.dispatchLayout=D(t),this.dispatch=$(this.dispatchLayout,t,this.workgroupSize),this.shaderKey="sparseSegmentIdCountProgram"}getUserCode(){return`
    ${R("index")} {
      if (index < uniforms.segmentIdsShape) {
        let segmentId = segmentIds[index];
        ${ke("&result[segmentId]","1","int32")}
      }
    }
  `}}class Tx{constructor(e,t){this.variableNames=["segmentSum","sameSegmentIdCount"],this.outputShape=[],this.uniforms="segmentSize : i32",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.type=t,this.dispatchLayout=D(e),this.dispatch=$(this.dispatchLayout,e,this.workgroupSize),this.shaderKey="sparseSegmentMean"}getUserCode(){return`
    ${R("index")} {
      if (index < uniforms.size) {
        let segmentId = index / uniforms.segmentSize;
        let count = sameSegmentIdCount[segmentId];
        if (count != 0) {
          ${this.type==="float32"?"setOutputAtIndex(index, segmentSum[index] / f32(count));":"setOutputAtIndexI32(index, segmentSum[index] / count);"}
        }
      }
    }
  `}}/**
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
 */function Gi(s,e,t,o=!1,i){const n=M(s.shape)/s.shape[0],a=s.dtype,u=M(e.shape),l=i.readSync(t.dataId),c=u>0?l[u-1]+1:0;let h;const p=s.shape.slice();p[0]=c;const f=u*n,m=ie({backend:i,attrs:{shape:p,value:0,dtype:a}});h=new Fx(p,f,a);let g=[{type:"int32",data:[n]},{type:"int32",data:[f]}];const x=i.runWebGPUProgram(h,[s,e,t],a,g,m);if(o)return x;const y=ie({backend:i,attrs:{shape:[c],value:0,dtype:"int32"}});h=new Mx(c,t.shape);const w=i.runWebGPUProgram(h,[t],"int32",null,y),C=ie({backend:i,attrs:{shape:p,value:0,dtype:a}});h=new Tx(p,a),g=[{type:"int32",data:[n]}];const b=i.runWebGPUProgram(h,[x,w],a,g,C);return i.disposeData(x.dataId),i.disposeData(w.dataId),b}/**
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
 */function Lx(s){const{inputs:e,backend:t}=s,{data:o,indices:i,segmentIds:r}=e;return Gi(o,i,r,!1,t)}const Ex={kernelName:La,backendName:"webgpu",kernelFunc:Lx};/**
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
 */function _x(s){const{inputs:e,backend:t}=s,{data:o,indices:i,segmentIds:r}=e;return Gi(o,i,r,!0,t)}const Bx={kernelName:Ea,backendName:"webgpu",kernelFunc:_x};/**
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
 */class Ox{constructor(e,t){this.variableNames=["A"],this.workgroupSize=[64,1,1],this.size=!0;const o=new Array(e.length);for(let i=0;i<o.length;i++)o[i]=e[i]*t[i];this.outputShape=o,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.rank=this.outputShape.length,this.shaderKey="tile"}getUserCode(){const e=Wx(this.rank,"uniforms.");return`
      ${R("index")} {
        if (index < uniforms.size) {
          let resRC = getCoordsFromIndex(index);
          setOutputAtIndex(index, getA(${e}));
        }
      }
    `}}function Wx(s,e=""){if(s>=5)throw Error(`Tile for rank ${s} is not yet supported`);if(s===1)return`(resRC % ${e}aShape)`;const t=["resRC.x","resRC.y","resRC.z","resRC.w"],o=[];for(let i=0;i<s;i++)o.push(`(${t[i]} % ${e}aShape[${i}])`);return o.join()}/**
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
 */function as(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{reps:r}=o;if(t.shouldExecuteOnCPU([i])||i.dtype==="string"||i.shape.length>=5){const u=t.readSync(i.dataId),l=i.dtype==="string"?u.map(h=>Qt(h)):u,d=ne(i.shape,i.dtype,l),c=Dc(d,r);return t.makeTensorInfo(c.shape,c.dtype,c.values)}const n=new Ox(i.shape,r);return t.runWebGPUProgram(n,[i],i.dtype)}const Vx={kernelName:_a,backendName:"webgpu",kernelFunc:as};/**
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
 */function Ux(s){const{inputs:e,backend:t,attrs:o}=s,{sparseIndices:i,sparseValues:r,defaultValue:n}=e,{outputShape:a}=o,{sliceRank:u,numUpdates:l,sliceSize:d,strides:c,outputSize:h}=ts(r,i,a),p=!1;if(r.dtype==="string"){const I=t.bufferSync(i),k=t.bufferSync(r),N=Qt(t.readSync(n.dataId)[0]),A=vc(I,k,a,h,d,l,u,c,N,p);return t.makeTensorInfo(a,A.dtype,A.values)}const f=[h/d,d],m=z({inputs:{x:i},backend:t,attrs:{shape:[l,u]}}),g=r.shape.length?z({inputs:{x:r},backend:t,attrs:{shape:[l,d]}}):ae({inputs:{x:r},backend:t}),x=g.dtype,y=t.makeTensorInfo([],x,ui(1,x)),w=z({inputs:{x:n},backend:t,attrs:{shape:Array(f.length).fill(1)}}),C=as({inputs:{x:w},backend:t,attrs:{reps:f}}),b=M([l,d]),S=[{type:"int32",data:[u]},{type:"int32",data:c},{type:"int32",data:[b]}];switch(l){case 0:break;case 1:{const I=new rt([l,d],u,m.shape.length,g.shape.length,c,f,x,p);t.runWebGPUProgram(I,[g,m],x,S,C)}break;default:{const I=new rt([l,d],u,m.shape.length,y.shape.length,c,f,x,p);t.runWebGPUProgram(I,[y,m],x,S,C)}{const I=new rt([l,d],u,m.shape.length,g.shape.length,c,f,x);t.runWebGPUProgram(I,[g,m],x,S,C)}}const v=z({inputs:{x:C},backend:t,attrs:{shape:a}});return t.disposeData(m.dataId),t.disposeData(g.dataId),t.disposeData(w.dataId),t.disposeData(y.dataId),t.disposeData(C.dataId),v}const Gx={kernelName:Ba,backendName:"webgpu",kernelFunc:Ux};/**
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
 */function Hx(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{numOrSizeSplits:r,axis:n}=o,a=Ae(n,i.shape)[0],u=Wa(i,r,a),l=i.shape.length,d=new Array(l).fill(0),c=i.shape.slice();return u.map(h=>{const p=[...c];p[a]=h;const f=Ze({inputs:{x:i},backend:t,attrs:{begin:d,size:p}});return d[a]+=h,f})}const Xx={kernelName:Oa,backendName:"webgpu",kernelFunc:Hx};/**
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
 */const Kx=U({opType:P.SQRT}),qx={kernelName:Va,backendName:"webgpu",kernelFunc:Kx};/**
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
 */const Yx={kernelName:Ua,backendName:"webgpu",kernelFunc:({inputs:s,backend:e})=>{const{x:t}=s,o=e,i=new Qe(t.shape,P.SQUARE);return o.runWebGPUProgram(i,[t],t.dtype)}};/**
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
 */const jx=j({opType:T.SQUARED_DIFFERENCE}),Qx={kernelName:Ga,backendName:"webgpu",kernelFunc:jx};/**
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
 */function Zx({inputs:s,attrs:e,backend:t}){const{x:o}=s,i=new Qe(o.shape,P.STEP,"stepAlpha : f32,"),r=[{type:"float32",data:[e.alpha]}];return t.runWebGPUProgram(i,[o],o.dtype,r)}const Jx={kernelName:Ha,backendName:"webgpu",kernelFunc:Zx};/**
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
 */class ey{constructor(e){this.variableNames=["x"],this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]);const t=K(this.outputShape.length);this.uniforms=`begin : ${t},  strides : ${t}, `,this.shaderKey="stridedSlice"}getUserCode(){const e=this.outputShape.length;let t="";if(e===1)t="coords * uniforms.strides + uniforms.begin";else{let i=0;t=this.outputShape.map((r,n)=>(i++,this.outputShape.length===1?`coords * uniforms.strides[${n}] + uniforms.begin[${n}]`:`coords[${i-1}] * uniforms.strides[${n}] + uniforms.begin[${n}]`)).join(",")}return`
       ${R("index")} {
         if (index < uniforms.size) {
           let coords = getCoordsFromIndex(index);
           setOutputAtIndex(index, getX(${t}));
         }
       }
     `}}/**
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
 */function ty(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{begin:r,end:n,strides:a,beginMask:u,endMask:l,ellipsisMask:d,newAxisMask:c,shrinkAxisMask:h}=o,{finalShapeSparse:p,finalShape:f,isIdentity:m,sliceDim0:g,isSimpleSlice:x,begin:y,end:w,strides:C}=Ka(i.shape,r,n,a,u,l,d,c,h);let b;if(m)b=z({inputs:{x:i},backend:t,attrs:{shape:f}});else if(g||x){G(i.shape.length>=1,()=>`Input must have rank at least 1, got: ${i.shape.length}`);const S=qa(y,w,C),v=Ze({inputs:{x:i},backend:t,attrs:{begin:y,size:S}});b=z({inputs:{x:v},backend:t,attrs:{shape:f}}),t.disposeData(v.dataId)}else if(t.shouldExecuteOnCPU([i])){const v=t.readSync(i.dataId),I=ne(i.shape,i.dtype,v),k=Pc(p,I,C,y);b=t.makeTensorInfo(f,i.dtype,k.values)}else{const v=new ey(p),I=[{type:"int32",data:y},{type:"int32",data:C}],k=t.runWebGPUProgram(v,[i],i.dtype,I);b=z({inputs:{x:k},backend:t,attrs:{shape:f}}),t.disposeData(k.dataId)}return b}const sy={kernelName:Xa,backendName:"webgpu",kernelFunc:ty};/**
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
 */function iy(s){const{inputs:e,backend:t,attrs:o}=s,{separator:i,nGramWidths:r,leftPad:n,rightPad:a,padWidth:u,preserveShortSequences:l}=o,{data:d,dataSplits:c}=e,h=t.readSync(d.dataId),p=t.readSync(c.dataId),[f,m]=Rc(h,p,i,r,n,a,u,l);return[t.makeTensorInfo([f.length],"string",f),t.makeTensorInfo(c.shape,"int32",m)]}const oy={kernelName:Ya,backendName:"webgpu",kernelFunc:iy};/**
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
 */const ry=j({opType:T.SUB,cpuKernelImpl:$c,supportsComplex:!0}),ny={kernelName:ja,backendName:"webgpu",kernelFunc:ry};/**
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
 */const ay=U({opType:P.TAN}),uy={kernelName:Qa,backendName:"webgpu",kernelFunc:ay};/**
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
 */const ly=U({opType:P.TANH}),dy={kernelName:Za,backendName:"webgpu",kernelFunc:ly};/**
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
 */function cy(s){const{inputs:e,backend:t,attrs:o}=s,{tensor:i,indices:r,updates:n}=e,{sliceRank:a,numUpdates:u,sliceSize:l,strides:d,outputSize:c}=ts(n,r,i.shape),h=[c/l,l];if(c===0)return t.makeTensorInfo(i.shape,r.dtype);const p=[],f=z({inputs:{x:r},backend:t,attrs:{shape:[u,a]}});p.push(f);const m=z({inputs:{x:n},backend:t,attrs:{shape:[u,l]}});p.push(m);const g=z({inputs:{x:i},backend:t,attrs:{shape:h}});p.push(g);const x=as({inputs:{x:g},backend:t,attrs:{reps:Array(h.length).fill(1)}}),y=new rt([u,l],a,f.shape.length,m.shape.length,d,h,i.dtype,!1),w=M([u,l]),C=[{type:"int32",data:[a]},{type:"int32",data:d},{type:"int32",data:[w]}],b=t.runWebGPUProgram(y,[m,f],g.dtype,C,x);p.push(b);const S=z({inputs:{x:b},backend:t,attrs:{shape:i.shape}});return p.forEach(v=>t.disposeData(v.dataId)),S}const hy={kernelName:Ja,backendName:"webgpu",kernelFunc:cy};/**
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
 */class py{constructor(e){this.variableNames=["x","indices"],this.workgroupSize=[256,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.uniforms=`inputSize : i32, firstPass : i32, negativeInf : f32,
        dir : i32, inc : i32,`,this.shaderKey="swap"}getUserCode(){return`
        ${R("index")} {
          if (index < uniforms.size) {
            let outC = getCoordsFromIndex(index);
            let batch = outC[0];
            let elemIdx = outC[1];
            // We compare elements pair-wise within a group of size 2 * inc.
            // The comparing rule for each group alternates between ascending
            // and descending. Within each group, we compare each pair at
            // positions i and i+inc. To decide whether an element at position i
            // is x0 or x1, we mod it by 2 * inc, if the result is smaller than
            // inc, it is in the first half of the group, we denote it as x0,
            // otherwise we denote it as x1.
            // For example, as shown in the Bitonic top K paper referenced
            // above, Figure5(a) shows that element[1] is in the second half of
            // the group when group size is 2, but it is in the first half of
            // the group when group size is 4.
            let isFirstInPair = elemIdx % (2 * uniforms.inc) < uniforms.inc;
            var i = 0;
            if (isFirstInPair) {
              i = elemIdx;
            } else {
              i = elemIdx - uniforms.inc;
            }

            var i0 = 0;
            if (uniforms.firstPass == 1) {
              i0 = i;
            } else {
              i0 = i32(getIndices(batch, i));
            }

            var i1 = 0;
            if (uniforms.firstPass == 1) {
              i1 = i + uniforms.inc;
            } else {
              i1 = i32(getIndices(batch, i + uniforms.inc));
            }

            var x0 = f32(0.0);
            var x1 = f32(0.0);
            if (i0 < uniforms.inputSize) {
              x0 = getX(batch, i0);
            } else {
              x0 = uniforms.negativeInf;
            }
            if (i1 < uniforms.inputSize) {
              x1 = getX(batch, i1);
            } else {
              x1 = uniforms.negativeInf;
            }

            let reverse = elemIdx % (2 * uniforms.dir) >= uniforms.dir;
            let isGreater = x0 > x1 || (x0 == x1 && i1 > i0);
            if (reverse == isGreater) {
              // Elements in opposite order of direction
              let iTemp = i0;
              i0 = i1;
              i1 = iTemp;
            }
            if (isFirstInPair) {
              setOutputAtIndex(index, f32(i0));
            } else {
              setOutputAtIndex(index, f32(i1));
            }
          }
        }
      `}}class fy{constructor(e){this.variableNames=["x","indices"],this.workgroupSize=[256,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.uniforms="inputSize : i32, firstPass : i32, k : i32,",this.shaderKey="merge"}getUserCode(){return`
        ${R("index")} {
          if (index < uniforms.size) {
            let outC = getCoordsFromIndex(index);
            let batch = outC[0];
            let elemIdx = outC[1];
            // The output size is half of the previous size.
            // If the previous sequence is | | | | _ _ _ _  | | | |  _ _ _ _
            // (k=4), we only need to output the indices at positions |, the
            // indices at positions _ can be thrown away, see Figure5(b) After
            // Phase 2 (Merge phase) in the Bitonic Top K paper referenced
            // above.
            // For example, the paper shows we only need to output the orange
            // bars. The output sequence should look like this | | | | | | | |.
            // Because the sequence is halved, to map the output index back to
            // the previous sequence to find the corresponding value, we need
            // to double the index. When we double the index, we basically
            // interpolate a position, so 2i looks like
            // | _ | _ | _ | _ | _ | _ | _. We move the | to the first k
            // position of each 2k positions by - elemIdx % k. E.g. for output
            // at index 4,5,6,7, we want to get the corresponding element at
            // original index 8,9,10,11, for output at index 8,9,10,11,
            // we want to get the corresponding element at original index
            // 16,17,18,19, so on and so forth.

            var i = 0;
            if (elemIdx < uniforms.k) {
              i = elemIdx;
            } else {
              i = elemIdx * 2 - elemIdx % uniforms.k;
            }
            var i0 = 0;
            if (uniforms.firstPass == 1) {
              i0 = i;
            } else {
              i0 = i32(getIndices(batch, i));
            }
            var i1 = 0;
            if (uniforms.firstPass == 1) {
              i1 = i + uniforms.k;
            } else {
              i1 = i32(getIndices(batch, i + uniforms.k));
            }

            let x0 = getX(batch, i0);
            var x1 = f32(0.0);
            if (i1 < uniforms.inputSize) {
              x1 = getX(batch, i1);
            } else {
              x1 = x0;
            }

            if (x0 >= x1) {
              setOutputAtIndex(index, f32(i0));
            } else {
              setOutputAtIndex(index, f32(i1));
            }
          }
        }
      `}}/**
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
 */function Ee(s,e){e!==null&&s.disposeData(e.dataId)}function Ds(s){let e=1;for(;e<s;)e*=2;return e}function my(s){const{inputs:e,backend:t,attrs:o}=s,{x:i}=e,{k:r,sorted:n}=o,a=i.shape,u=a[a.length-1];if(t.shouldExecuteOnCPU([i])){const b=t.readSync(i.dataId),[S,v]=Nc(b,a,i.dtype,r,n);return[t.makeTensorInfo(S.shape,S.dtype,S.values),t.makeTensorInfo(v.shape,v.dtype,v.values)]}if(r===0)return a[a.length-1]=0,[t.makeTensorInfo(a,i.dtype,[]),t.makeTensorInfo(a,"int32",[])];if(u===1)return[i,ie({attrs:{shape:a,dtype:"int32",value:0},backend:t})];const d=M(a)/u,c=z({inputs:{x:i},attrs:{shape:[d,u]},backend:t}),h=Ds(r),p=Ds(u);let f=null;const m=()=>f===null?[c,c]:[c,f],g=(b,S,v)=>{const I=m(),k=new py(v),A=[{type:"int32",data:[u]},{type:"int32",data:[f===null?1:0]},{type:"float32",data:[Number.NEGATIVE_INFINITY]},{type:"int32",data:[b]},{type:"int32",data:[S]}],L=f;f=t.runWebGPUProgram(k,I,"int32",A),Ee(t,L)};for(let b=1;b<h;b*=2){const S=b*2;for(let v=b;v>=1;v/=2)g(S,v,[d,p])}for(let b=p;b>h;b/=2){const S=m(),v=new fy([d,b/2]),k=[{type:"int32",data:[u]},{type:"int32",data:[f===null?1:0]},{type:"int32",data:[h]}],N=f;f=t.runWebGPUProgram(v,S,"int32",k),Ee(t,N);const A=h/2,L=A*2;for(let F=A;F>=1;F/=2)g(L,F,f.shape)}let x=f;f=Ze({inputs:{x:f},backend:t,attrs:{begin:0,size:[d,r]}}),Ee(t,x);let y=Bi({inputs:{x:c,indices:f},backend:t,attrs:{axis:1,batchDims:1}});Ee(t,c);const w=a.slice(0,-1);w.push(r),x=f,f=z({inputs:{x:f},attrs:{shape:w},backend:t}),Ee(t,x);const C=y;return y=z({inputs:{x:y},attrs:{shape:w},backend:t}),Ee(t,C),[y,f]}const gy={kernelName:eu,backendName:"webgpu",kernelFunc:my};/**
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
 */class xy{constructor(e){this.variableNames=["Image","Transforms"],this.uniforms="interpolationModeId : i32, fillModeId : i32, fillValue : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="transform"}getUserCode(){return`
          fn mapCoord(outCoord : f32, len : f32) -> f32{
            var inCoord = outCoord;
            if(uniforms.fillModeId == 2) {
              if (inCoord < 0.0) {
                if (len <= 1.0) {
                  inCoord = 0.0;
                } else {
                  let sz2 = 2.0 * len;
                  if (inCoord < sz2) {
                    inCoord = sz2 * f32(i32(f32(-inCoord / sz2))) +
                    inCoord;
                  }
                  if (inCoord < -len) {
                    inCoord = inCoord + sz2;
                  } else {
                    inCoord = -inCoord - 1.0;
                  }
                }
              } else if (inCoord > len - 1.0) {
                if (len <= 1.0) {
                  inCoord = 0.0;
                } else {
                  let sz2 = 2.0 * len;
                  inCoord = inCoord - sz2 * f32(i32(f32(inCoord / sz2)));
                  if (inCoord >= len) {
                    inCoord = sz2 - inCoord - 1.0;
                  }
                }
              }
              return clamp(inCoord, 0.0, len - 1.0);
            } else if (uniforms.fillModeId == 3) {
              if (inCoord < 0.0) {
                if (len <= 1.0) {
                  inCoord = 0.0;
                } else {
                  let sz = len - 1.0;
                  inCoord = inCoord + len * (f32(i32(f32(-inCoord / sz))) + 1.0);
                }
              } else if (inCoord > len - 1.0) {
                if (len <= 1.0) {
                  inCoord = 0.0;
                } else {
                  let sz = len - 1.0;
                  inCoord = inCoord - len * f32(i32(f32(inCoord / sz)));
                }
              }
              return clamp(inCoord, 0.0, len - 1.0);
            } else if (uniforms.fillModeId == 4) {
              return clamp(outCoord, 0.0, len - 1.0);
            }
            return outCoord;
          }
          fn readWithFillValue(batch : i32, coordY : i32, coordX : i32,
            channel : i32) -> f32 {
            var outputValue : f32;
            if (0 <= coordY && coordY < uniforms.imageShape[1] && 0 <= coordX && coordX < uniforms.imageShape[2]) {
                outputValue = getImage(batch, coordY, coordX, channel);
            } else {
              outputValue = uniforms.fillValue;
            }
            return outputValue;
          }

          ${R("index")} {
            if (index < uniforms.size) {
              let coords = getCoordsFromIndex(index);
              var outputValue : f32;
              let batch = coords[0];
              let x = coords[2];
              let y = coords[1];
              let channel = coords[3];
              let xf = f32(x);
              let yf = f32(y);
              let a1 = getTransforms(batch, 0);
              let a2 = getTransforms(batch, 1);
              let a3 = getTransforms(batch, 2);
              let b1 = getTransforms(batch, 3);
              let b2 = getTransforms(batch, 4);
              let b3 = getTransforms(batch, 5);
              let c1 = getTransforms(batch, 6);
              let c2 = getTransforms(batch, 7);
              let projection = c1 * xf + c2 * yf + 1.0;
              if (projection == 0.0) {
                outputValue = uniforms.fillValue;
              } else {
                let inX = (a1 * xf + a2 * yf + a3) / projection;
                let inY = (b1 * xf + b2 * yf + b3) / projection;
                let mapX = mapCoord(inX, f32(uniforms.imageShape[2]));
                let mapY = mapCoord(inY, f32(uniforms.imageShape[1]));

                if (uniforms.interpolationModeId == 1) {
                  let coordY = i32(round(mapY));
                  let coordX = i32(round(mapX));
                  outputValue = readWithFillValue(batch, coordY, coordX,
                    channel);
                } else {
                  let yFloor = floor(mapY);
                  let xFloor = floor(mapX);
                  let yCeil = yFloor + 1.0;
                  let xCeil = xFloor + 1.0;
                  let valueYFloor = (xCeil - mapX) *
                  readWithFillValue(batch, i32(yFloor), i32(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, i32(yFloor), i32(xCeil), channel);
                  let valueYCeil = (xCeil - mapX) *
                  readWithFillValue(batch, i32(yCeil), i32(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, i32(yCeil), i32(xCeil), channel);
                  outputValue = (yCeil - mapY) * valueYFloor +
                  (mapY - yFloor) * valueYCeil;
                }
              }
              setOutputAtIndex(index, outputValue);
            }
          }
        `}}/**
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
 */function yy(s){const{inputs:e,backend:t,attrs:o}=s,{image:i,transforms:r}=e,{interpolation:n,fillMode:a,fillValue:u,outputShape:l}=o,[d,c,h,p]=i.shape,[f,m]=l??[c,h],g=[d,f,m,p],x=new xy(g),y=n==="nearest"?1:2;let w;switch(a){case"constant":w=1;break;case"reflect":w=2;break;case"wrap":w=3;break;case"nearest":w=4;break;default:w=1;break}const C=[{type:"int32",data:[y]},{type:"int32",data:[w]},{type:"float32",data:[u]}];return t.runWebGPUProgram(x,[i,r],"float32",C)}const wy={kernelName:tu,backendName:"webgpu",kernelFunc:yy};/**
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
 */function Cy(s){const{inputs:e,backend:t,attrs:o}=s,{value:i}=e;let{axis:r}=o;r<0&&(r+=i.shape.length);const n=i,a=n.shape.length,u=i.shape[r],l=new Array(a-1);let d=0;for(let m=0;m<a;m++)m!==r&&(l[d++]=n.shape[m]);const c=[],h=new Array(a).fill(0),p=n.shape.slice();p[r]=1;const f=new Array(u);for(let m=0;m<f.length;m++){h[r]=m;const g=Ze({inputs:{x:n},backend:t,attrs:{begin:h,size:p}}),x=z({inputs:{x:g},backend:t,attrs:{shape:l}});f[m]=x,c.push(g)}return c.forEach(m=>t.disposeData(m.dataId)),f}const by={kernelName:su,backendName:"webgpu",kernelFunc:Cy};/**
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
 */class Sy{constructor(e,t,o){if(this.outputShape=[],this.variableNames=["x","segmentIds"],this.uniforms="numSegments : i32, xSize: i32,",this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=t,this.dispatchLayout=D(e),this.dispatch=$(this.dispatchLayout,e,this.workgroupSize),o!=="float32"&&o!=="int32")throw new Error(`UnsortedSegmentSum only supports float32 and int32
              types, does not support ${o} type.`);this.type=o,this.shaderKey="unsortedSegmentSum"}getUserCode(){return`
    ${R("index")} {
      if (index < uniforms.xSize) {
        let coords = getXCoordsFromIndex(index);
        let b = coords[0];
        let inCol = coords[1];

        let segmentId = i32(getSegmentIds(inCol));
        if (segmentId >= 0) {
          let flatIndex = b * uniforms.numSegments + segmentId % uniforms.numSegments;
          let value = getX(b, inCol);

          ${ke("&result[flatIndex]","value",this.type)}
        }
      }
    }
  `}}/**
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
 */function vy(s){const{inputs:e,backend:t,attrs:o}=s,{x:i,segmentIds:r}=e,{numSegments:n}=o,a=i.shape.length,u=[];let l=0;const d=ht([l],a);let c=i;d!=null&&(c=fe({inputs:{x:i},backend:t,attrs:{perm:d}}),u.push(c),l=pt(1,a)[0]);const h=ou(c.shape,l,n),p=M([c.shape[l]]),f=z({inputs:{x:c},backend:t,attrs:{shape:[-1,p]}});u.push(f);const m=i.dtype,g=[f.shape[0],n],x=ie({backend:t,attrs:{shape:g,value:0,dtype:m}}),y=new Sy(f.shape,g,m),w=[{type:"int32",data:[n]},{type:"int32",data:[M(f.shape)]}],C=t.runWebGPUProgram(y,[f,r],m,w,x),b=z({inputs:{x:C},backend:t,attrs:{shape:h}});u.push(C);let S=b;if(d!=null){u.push(b);const v=pi(d);S=fe({inputs:{x:S},backend:t,attrs:{perm:v}})}return u.forEach(v=>t.disposeData(v.dataId)),S}const ky={kernelName:iu,backendName:"webgpu",kernelFunc:vy};/**
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
 */const Iy=[Yd,Fc,Tc,Ec,Bc,Vc,Yc,Qc,Jc,th,ih,rh,ah,lh,ch,gh,yh,Sh,kh,Ph,zh,Th,_h,Vh,Gh,qh,Qd,Qh,tp,lp,mp,wp,Sp,kp,Pp,$p,Np,Fp,Tp,Ep,Bp,Vp,Yp,Qp,Hp,ef,of,uf,df,pf,xf,wf,bf,vf,If,Rf,$f,Nf,Af,Xd,Mf,Of,Lf,_f,Uf,Hf,Kf,jf,Jf,tm,im,jd,rm,Jh,am,lm,cm,pm,mm,xm,Cm,km,Sm,Pm,$m,Nm,Mm,Em,ph,Bm,Wm,Ym,Um,Km,Qm,fh,Jm,tg,ig,rg,dg,ff,hg,fg,gg,Bh,wg,bg,vg,Pg,$g,Ng,Ag,Mg,Oh,Lg,_g,Og,Vg,Kd,Hg,qg,Qg,ex,ix,rx,ax,lx,cx,fx,xx,wx,bx,vx,Ix,Rx,Dh,Jx,sy,oy,ug,Dx,Ax,Ex,Bx,Gx,Xx,qx,Yx,Qx,ny,mf,uy,dy,hy,Vx,gy,wy,Hc,by,ky,Cg];for(const s of Iy)ru(s);/**
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
    */var Hi=function(s,e){return(Hi=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,o){t.__proto__=o}||function(t,o){for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(t[i]=o[i])})(s,e)};function Xi(s,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function t(){this.constructor=s}Hi(s,e),s.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}var H=function(){return(H=Object.assign||function(s){for(var e,t=1,o=arguments.length;t<o;t++)for(var i in e=arguments[t])Object.prototype.hasOwnProperty.call(e,i)&&(s[i]=e[i]);return s}).apply(this,arguments)};function O(s,e,t,o){return new(t||(t=Promise))(function(i,r){function n(l){try{u(o.next(l))}catch(d){r(d)}}function a(l){try{u(o.throw(l))}catch(d){r(d)}}function u(l){var d;l.done?i(l.value):(d=l.value,d instanceof t?d:new t(function(c){c(d)})).then(n,a)}u((o=o.apply(s,[])).next())})}function W(s,e){var t,o,i,r,n={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return r={next:a(0),throw:a(1),return:a(2)},typeof Symbol=="function"&&(r[Symbol.iterator]=function(){return this}),r;function a(u){return function(l){return function(d){if(t)throw new TypeError("Generator is already executing.");for(;n;)try{if(t=1,o&&(i=2&d[0]?o.return:d[0]?o.throw||((i=o.return)&&i.call(o),0):o.next)&&!(i=i.call(o,d[1])).done)return i;switch(o=0,i&&(d=[2&d[0],i.value]),d[0]){case 0:case 1:i=d;break;case 4:return n.label++,{value:d[1],done:!1};case 5:n.label++,o=d[1],d=[0];continue;case 7:d=n.ops.pop(),n.trys.pop();continue;default:if(i=n.trys,!((i=i.length>0&&i[i.length-1])||d[0]!==6&&d[0]!==2)){n=0;continue}if(d[0]===3&&(!i||d[1]>i[0]&&d[1]<i[3])){n.label=d[1];break}if(d[0]===6&&n.label<i[1]){n.label=i[1],i=d;break}if(i&&n.label<i[2]){n.label=i[2],n.ops.push(d);break}i[2]&&n.ops.pop(),n.trys.pop();continue}d=e.call(s,n)}catch(c){d=[6,c],o=0}finally{t=i=0}if(5&d[0])throw d[1];return{value:d[0]?d[1]:void 0,done:!0}}([u,l])}}}function Re(s,e,t){if(t||arguments.length===2)for(var o,i=0,r=e.length;i<r;i++)!o&&i in e||(o||(o=Array.prototype.slice.call(e,0,i)),o[i]=e[i]);return s.concat(o||Array.prototype.slice.call(e))}var me=["nose","left_eye","right_eye","left_ear","right_ear","left_shoulder","right_shoulder","left_elbow","right_elbow","left_wrist","right_wrist","left_hip","right_hip","left_knee","right_knee","left_ankle","right_ankle"],ct=["nose","left_eye_inner","left_eye","left_eye_outer","right_eye_inner","right_eye","right_eye_outer","left_ear","right_ear","mouth_left","mouth_right","left_shoulder","right_shoulder","left_elbow","right_elbow","left_wrist","right_wrist","left_pinky","right_pinky","left_index","right_index","left_thumb","right_thumb","left_hip","right_hip","left_knee","right_knee","left_ankle","right_ankle","left_heel","right_heel","left_foot_index","right_foot_index"],Py={left:[1,2,3,7,9,11,13,15,17,19,21,23,25,27,29,31],right:[4,5,6,8,10,12,14,16,18,20,22,24,26,28,30,32],middle:[0]},Ry={left:[1,3,5,7,9,11,13,15],right:[2,4,6,8,10,12,14,16],middle:[0]},$y=[[0,1],[0,2],[1,3],[2,4],[5,6],[5,7],[5,11],[6,8],[6,12],[7,9],[8,10],[11,12],[11,13],[12,14],[13,15],[14,16]],Dy=[[0,1],[0,4],[1,2],[2,3],[3,7],[4,5],[5,6],[6,8],[9,10],[11,12],[11,13],[11,23],[12,14],[14,16],[12,24],[13,15],[15,17],[16,18],[16,20],[15,17],[15,19],[15,21],[16,22],[17,19],[18,20],[23,25],[23,24],[24,26],[25,27],[26,28],[27,29],[28,30],[27,31],[28,32],[29,31],[30,32]];function vt(s){return s instanceof SVGAnimatedLength?s.baseVal.value:s}function Ki(s){return O(this,void 0,void 0,function(){var e,t;return W(this,function(o){switch(o.label){case 0:return e=document.createElement("canvas"),s instanceof qe?[4,is(s,e)]:[3,2];case 1:return o.sent(),[3,3];case 2:e.width=vt(s.width),e.height=vt(s.height),t=e.getContext("2d"),s instanceof ImageData?t.putImageData(s,0,0):t.drawImage(s,0,0),o.label=3;case 3:return[2,e]}})})}function qi(s){return O(this,void 0,void 0,function(){var e,t,o,i,r,n;return W(this,function(a){switch(a.label){case 0:return s instanceof qe?(e=s.shape.slice(0,2),t=e[0],o=e[1],i=ImageData.bind,[4,is(s)]):[3,2];case 1:return[2,new(i.apply(ImageData,[void 0,a.sent(),o,t]))];case 2:return r=document.createElement("canvas"),n=r.getContext("2d"),r.width=vt(s.width),r.height=vt(s.height),n.drawImage(s,0,0),[2,n.getImageData(0,0,r.width,r.height)]}})})}function Ny(s){return O(this,void 0,void 0,function(){var e,t;return W(this,function(o){switch(o.label){case 0:return s instanceof SVGImageElement||s instanceof OffscreenCanvas?[4,Ki(s)]:[3,2];case 1:return t=o.sent(),[3,3];case 2:t=s,o.label=3;case 3:return e=t,[2,mi(e,4)]}})})}function Yi(s){if(s<0||s>=256)throw new Error("Mask value must be in range [0, 255] but got ".concat(s));if(!Number.isInteger(s))throw new Error("Mask value must be an integer but got ".concat(s))}var et={runtime:"mediapipe",enableSmoothing:!0,enableSegmentation:!1,smoothSegmentation:!0,modelType:"full"},zy=function(){function s(e){this.mask=e}return s.prototype.toCanvasImageSource=function(){return O(this,void 0,void 0,function(){return W(this,function(e){return[2,this.mask]})})},s.prototype.toImageData=function(){return O(this,void 0,void 0,function(){return W(this,function(e){return[2,qi(this.mask)]})})},s.prototype.toTensor=function(){return O(this,void 0,void 0,function(){return W(this,function(e){return[2,Ny(this.mask)]})})},s.prototype.getUnderlyingType=function(){return"canvasimagesource"},s}();function Ay(s){return Yi(s),"person"}var Fy=function(){function s(e){var t,o=this;switch(this.width=0,this.height=0,this.selfieMode=!1,this.poseSolution=new mo({locateFile:function(i,r){if(e.solutionPath){var n=e.solutionPath.replace(/\/+$/,"");return"".concat(n,"/").concat(i)}return"".concat(r,"/").concat(i)}}),e.modelType){case"lite":t=0;break;case"heavy":t=2;break;case"full":default:t=1}this.poseSolution.setOptions({modelComplexity:t,smoothLandmarks:e.enableSmoothing,enableSegmentation:e.enableSegmentation,smoothSegmentation:e.smoothSegmentation,selfieMode:this.selfieMode}),this.poseSolution.onResults(function(i){if(o.height=i.image.height,o.width=i.image.width,i.poseLandmarks==null)o.poses=[];else{var r=o.translateOutput(i.poseLandmarks,i.poseWorldLandmarks);i.segmentationMask&&(r.segmentation={maskValueToLabel:Ay,mask:new zy(i.segmentationMask)}),o.poses=[r]}})}return s.prototype.translateOutput=function(e,t){var o=this,i={keypoints:e.map(function(r,n){return{x:r.x*o.width,y:r.y*o.height,z:r.z,score:r.visibility,name:ct[n]}})};return t!=null&&(i.keypoints3D=t.map(function(r,n){return{x:r.x,y:r.y,z:r.z,score:r.visibility,name:ct[n]}})),i},s.prototype.estimatePoses=function(e,t,o){return O(this,void 0,void 0,function(){var i,r;return W(this,function(n){switch(n.label){case 0:return t&&t.flipHorizontal&&t.flipHorizontal!==this.selfieMode&&(this.selfieMode=t.flipHorizontal,this.poseSolution.setOptions({selfieMode:this.selfieMode})),e instanceof qe?(r=ImageData.bind,[4,is(e)]):[3,2];case 1:return i=new(r.apply(ImageData,[void 0,n.sent(),e.shape[1],e.shape[0]])),[3,3];case 2:i=e,n.label=3;case 3:return e=i,[4,this.poseSolution.send({image:e},o)];case 4:return n.sent(),[2,this.poses]}})})},s.prototype.dispose=function(){this.poseSolution.close()},s.prototype.reset=function(){this.poseSolution.reset()},s.prototype.initialize=function(){return this.poseSolution.initialize()},s}();function My(s){return O(this,void 0,void 0,function(){var e,t;return W(this,function(o){switch(o.label){case 0:return e=function(i){if(i==null)return H({},et);var r=H({},i);return r.runtime="mediapipe",r.enableSegmentation==null&&(r.enableSegmentation=et.enableSegmentation),r.enableSmoothing==null&&(r.enableSmoothing=et.enableSmoothing),r.smoothSegmentation==null&&(r.smoothSegmentation=et.smoothSegmentation),r.modelType==null&&(r.modelType=et.modelType),r}(s),[4,(t=new Fy(e)).initialize()];case 1:return o.sent(),[2,t]}})})}function Xe(s){return s instanceof qe?{height:s.shape[0],width:s.shape[1]}:{height:s.height,width:s.width}}function ji(s){return s-2*Math.PI*Math.floor((s+Math.PI)/(2*Math.PI))}function us(s){return s instanceof qe?s:mi(s)}function Qi(s,e,t){return Kt(t,"inputResolution"),[1/t.width*s[0][0]*e.width,1/t.height*s[0][1]*e.width,s[0][3]*e.width,1/t.width*s[1][0]*e.height,1/t.height*s[1][1]*e.height,s[1][3]*e.height,0,0]}function Kt(s,e){G(s.width!==0,function(){return"".concat(e," width cannot be 0.")}),G(s.height!==0,function(){return"".concat(e," height cannot be 0.")})}function At(s,e,t){var o=t.rotationVectorStartKeypointIndex,i=t.rotationVectorEndKeypointIndex,r=s.locationData,n=r.relativeKeypoints[o].x*e.width,a=r.relativeKeypoints[o].y*e.height,u=r.relativeKeypoints[i].x*e.width,l=r.relativeKeypoints[i].y*e.height,d=2*Math.sqrt((u-n)*(u-n)+(l-a)*(l-a)),c=function(h,p,f){var m,g=h.locationData,x=f.rotationVectorStartKeypointIndex,y=f.rotationVectorEndKeypointIndex;m=f.rotationVectorTargetAngle?f.rotationVectorTargetAngle:Math.PI*f.rotationVectorTargetAngleDegree/180;var w=g.relativeKeypoints[x].x*p.width,C=g.relativeKeypoints[x].y*p.height,b=g.relativeKeypoints[y].x*p.width,S=g.relativeKeypoints[y].y*p.height;return ji(m-Math.atan2(-(S-C),b-w))}(s,e,t);return{xCenter:n/e.width,yCenter:a/e.height,width:d/e.width,height:d/e.height,rotation:c}}function Zi(s){if(s.length!==16)throw new Error("Array length must be 16 but got ".concat(s.length));return[[s[0],s[1],s[2],s[3]],[s[4],s[5],s[6],s[7]],[s[8],s[9],s[10],s[11]],[s[12],s[13],s[14],s[15]]]}function Ft(s,e,t,o,i,r,n){return s[e][i]*(s[t][r]*s[o][n]-s[t][n]*s[o][r])}function Z(s,e,t){var o=(e+1)%4,i=(e+2)%4,r=(e+3)%4,n=(t+1)%4,a=(t+2)%4,u=(t+3)%4;return Ft(s,o,i,r,n,a,u)+Ft(s,i,r,o,n,a,u)+Ft(s,r,o,i,n,a,u)}function Ns(s,e,t){t===void 0&&(t={ignoreRotation:!1});for(var o=[],i=0,r=s;i<r.length;i++){var n=r[i],a=n.x-.5,u=n.y-.5,l=t.ignoreRotation?0:e.rotation,d=Math.cos(l)*a-Math.sin(l)*u,c=Math.sin(l)*a+Math.cos(l)*u;d=d*e.width+e.xCenter,c=c*e.height+e.yCenter;var h=n.z*e.width,p=H({},n);p.x=d,p.y=c,p.z=h,o.push(p)}return o}function Ji(s,e){var t=function(o,i,r,n){var a=i-o,u=n-r,l=u/a;return{scale:l,offset:r-o*l}}(0,255,e[0],e[1]);return Q(function(){return te(Y(s,t.scale),t.offset)})}function qt(s,e,t){var o,i,r,n,a,u,l,d,c,h,p,f,m,g,x=e.outputTensorSize,y=e.keepAspectRatio,w=e.borderMode,C=e.outputTensorFloatRange,b=Xe(s),S=function(k,N){return N?{xCenter:N.xCenter*k.width,yCenter:N.yCenter*k.height,width:N.width*k.width,height:N.height*k.height,rotation:N.rotation}:{xCenter:.5*k.width,yCenter:.5*k.height,width:k.width,height:k.height,rotation:0}}(b,t),v=function(k,N,A){if(A===void 0&&(A=!1),!A)return{top:0,left:0,right:0,bottom:0};var L=N.height,F=N.width;Kt(N,"targetSize"),Kt(k,"roi");var E,B,V=L/F,J=k.height/k.width,ue=0,le=0;return V>J?(E=k.width,B=k.width*V,le=(1-J/V)/2):(E=k.height/V,B=k.height,ue=(1-V/J)/2),k.width=E,k.height=B,{top:le,left:ue,right:ue,bottom:le}}(S,x,y),I=(o=S,i=b.width,r=b.height,n=!1,a=o.width,u=o.height,l=n?-1:1,d=Math.cos(o.rotation),c=Math.sin(o.rotation),h=o.xCenter,p=o.yCenter,f=1/i,m=1/r,(g=new Array(16))[0]=a*d*l*f,g[1]=-u*c*f,g[2]=0,g[3]=(-.5*a*d*l+.5*u*c+h)*f,g[4]=a*c*l*m,g[5]=u*d*m,g[6]=0,g[7]=(-.5*u*d-.5*a*c*l+p)*m,g[8]=0,g[9]=0,g[10]=a*f,g[11]=0,g[12]=0,g[13]=0,g[14]=0,g[15]=1,Zi(g));return{imageTensor:Q(function(){var k=us(s),N=$e(Qi(I,b,x),[1,8]),A=w==="zero"?"constant":"nearest",L=Oe.transform(at(Ge(k,"float32")),N,"bilinear",A,0,[x.height,x.width]);return C!=null?Ji(L,C):L}),padding:v,transformationMatrix:I}}function zs(s,e,t,o){return o===1?.5*(s+e):s+(e-s)*t/(o-1)}function Ty(s){return Q(function(){var e=function(i){return Q(function(){return[oe(i,[0,0,0],[1,-1,1]),oe(i,[0,0,1],[1,-1,-1])]})}(s),t=e[0],o=e[1];return{boxes:X(o),logits:X(t)}})}function eo(s){return s!=null&&s.currentTime!=null}function As(s){for(var e={locationData:{relativeKeypoints:[]}},t=Number.MAX_SAFE_INTEGER,o=Number.MIN_SAFE_INTEGER,i=Number.MAX_SAFE_INTEGER,r=Number.MIN_SAFE_INTEGER,n=0;n<s.length;++n){var a=s[n];t=Math.min(t,a.x),o=Math.max(o,a.x),i=Math.min(i,a.y),r=Math.max(r,a.y),e.locationData.relativeKeypoints.push({x:a.x,y:a.y})}return e.locationData.relativeBoundingBox={xMin:t,yMin:i,xMax:o,yMax:r,width:o-t,height:r-i},e}function Ly(s,e,t,o){return O(this,void 0,void 0,function(){var i,r,n,a,u;return W(this,function(l){switch(l.label){case 0:return s.sort(function(d,c){return Math.max.apply(Math,c.score)-Math.max.apply(Math,d.score)}),i=$e(s.map(function(d){return[d.locationData.relativeBoundingBox.yMin,d.locationData.relativeBoundingBox.xMin,d.locationData.relativeBoundingBox.yMax,d.locationData.relativeBoundingBox.xMax]})),r=tt(s.map(function(d){return d.score[0]})),[4,Oe.nonMaxSuppressionAsync(i,r,e,t)];case 1:return[4,(n=l.sent()).array()];case 2:return a=l.sent(),u=s.filter(function(d,c){return a.indexOf(c)>-1}),ee([i,r,n]),[2,u]}})})}function to(s,e){return s.map(function(t){var o=H(H({},t),{x:t.x*e.width,y:t.y*e.height});return t.z!=null&&(o.z=t.z*e.width),o})}function Ey(s,e,t){return O(this,void 0,void 0,function(){var o,i,r,n,a,u,l,d,c,h,p,f,m,g,x,y,w,C,b,S,v,I,k,N;return W(this,function(A){switch(A.label){case 0:if(o=X(e,[0]),i=o.shape,r=i[0],n=i[1],a=i[2],s.length!==a)throw new Error("Expected heatmap to have same number of channels as the number of landmarks. But got landmarks length: "+"".concat(s.length,", heatmap length: ").concat(a));return u=[],[4,o.buffer()];case 1:for(l=A.sent(),d=0;d<s.length;d++)if(c=s[d],h=H({},c),u.push(h),p=Math.trunc(h.x*n),f=Math.trunc(h.y*r),!(p<0||p>=n||f<0||p>=r)){for(m=Math.trunc((t.kernelSize-1)/2),g=Math.max(0,p-m),x=Math.min(n,p+m+1),y=Math.max(0,f-m),w=Math.min(r,f+m+1),C=0,b=0,S=0,v=0,I=y;I<w;++I)for(k=g;k<x;++k)N=l.get(I,k,d),C+=N,v=Math.max(v,N),b+=k*N,S+=I*N;v>=t.minConfidenceToRefine&&C>0&&(h.x=b/n/C,h.y=S/r/C)}return o.dispose(),[2,u]}})})}function Fs(s,e){var t=e.left,o=e.top,i=e.left+e.right,r=e.top+e.bottom;return s.map(function(n){return H(H({},n),{x:(n.x-t)/(1-i),y:(n.y-o)/(1-r),z:n.z/(1-i)})})}function _y(s,e,t){return wt()==="webgl"?function(o,i,r){var n=r.combineWithPreviousRatio.toFixed(2),a={variableNames:["prevMask","newMask"],outputShape:o.shape,userCode:`
  void main() {
      ivec2 coords = getOutputCoords();
      int height = coords[0];
      int width = coords[1];

      float prevMaskValue = getPrevMask(height, width);
      float newMaskValue = getNewMask(height, width);

      /*
      * Assume p := newMaskValue
      * H(p) := 1 + (p * log(p) + (1-p) * log(1-p)) / log(2)
      * uncertainty alpha(p) =
      *   Clamp(1 - (1 - H(p)) * (1 - H(p)), 0, 1) [squaring the
      * uncertainty]
      *
      * The following polynomial approximates uncertainty alpha as a
      * function of (p + 0.5):
      */
      const float c1 = 5.68842;
      const float c2 = -0.748699;
      const float c3 = -57.8051;
      const float c4 = 291.309;
      const float c5 = -624.717;
      float t = newMaskValue - 0.5;
      float x = t * t;

      float uncertainty =
        1.0 - min(1.0, x * (c1 + x * (c2 + x * (c3 + x * (c4 + x * c5)))));

      float outputValue = newMaskValue + (prevMaskValue - newMaskValue) *
                             (uncertainty * `.concat(n,`);

      setOutput(outputValue);
    }
`)},u=ut();return Q(function(){var l=u.compileAndRun(a,[o,i]);return Be().makeTensorFromDataId(l.dataId,l.shape,l.dtype)})}(s,e,t):Q(function(){var o=We(e,.5),i=au(o),r=We(1,uu(1,Y(i,te(5.68842,Y(i,te(-.748699,Y(i,te(-57.8051,Y(i,te(291.309,Y(i,-624.717)))))))))));return te(e,Y(We(s,e),Y(r,t.combineWithPreviousRatio)))})}function By(s,e,t){return O(this,void 0,void 0,function(){var o,i,r,n,a;return W(this,function(u){switch(u.label){case 0:return o=s[0],i=s[1],r=function(l,d,c){return Q(function(){var h,p,f,m;c.reverseOutputOrder?(p=X(oe(l,[0,c.boxCoordOffset+0],[-1,1])),h=X(oe(l,[0,c.boxCoordOffset+1],[-1,1])),m=X(oe(l,[0,c.boxCoordOffset+2],[-1,1])),f=X(oe(l,[0,c.boxCoordOffset+3],[-1,1]))):(h=X(oe(l,[0,c.boxCoordOffset+0],[-1,1])),p=X(oe(l,[0,c.boxCoordOffset+1],[-1,1])),f=X(oe(l,[0,c.boxCoordOffset+2],[-1,1])),m=X(oe(l,[0,c.boxCoordOffset+3],[-1,1]))),p=te(Y(re(p,c.xScale),d.w),d.x),h=te(Y(re(h,c.yScale),d.h),d.y),c.applyExponentialOnBoxSize?(f=Y(fs(re(f,c.hScale)),d.h),m=Y(fs(re(m,c.wScale)),d.w)):(f=Y(re(f,c.hScale),d.h),m=Y(re(m,c.wScale),d.h));var g=We(h,re(f,2)),x=We(p,re(m,2)),y=te(h,re(f,2)),w=te(p,re(m,2)),C=Ut([be(g,[c.numBoxes,1]),be(x,[c.numBoxes,1]),be(y,[c.numBoxes,1]),be(w,[c.numBoxes,1])],1);if(c.numKeypoints)for(var b=0;b<c.numKeypoints;++b){var S=c.keypointCoordOffset+b*c.numValuesPerKeypoint,v=void 0,I=void 0;c.reverseOutputOrder?(v=X(oe(l,[0,S],[-1,1])),I=X(oe(l,[0,S+1],[-1,1]))):(I=X(oe(l,[0,S],[-1,1])),v=X(oe(l,[0,S+1],[-1,1])));var k=te(Y(re(v,c.xScale),d.w),d.x),N=te(Y(re(I,c.yScale),d.h),d.y);C=Ut([C,be(k,[c.numBoxes,1]),be(N,[c.numBoxes,1])],1)}return C})}(i,e,t),n=Q(function(){var l=o;return t.sigmoidScore?(t.scoreClippingThresh!=null&&(l=lu(o,-t.scoreClippingThresh,t.scoreClippingThresh)),l=ss(l)):l}),[4,Oy(r,n,t)];case 1:return a=u.sent(),ee([r,n]),[2,a]}})})}function Oy(s,e,t){return O(this,void 0,void 0,function(){var o,i,r,n,a,u,l,d,c,h,p,f;return W(this,function(m){switch(m.label){case 0:return o=[],[4,s.data()];case 1:return i=m.sent(),[4,e.data()];case 2:for(r=m.sent(),n=0;n<t.numBoxes;++n)if(!(t.minScoreThresh!=null&&r[n]<t.minScoreThresh||(a=n*t.numCoords,u=Wy(i[a+0],i[a+1],i[a+2],i[a+3],r[n],t.flipVertically,n),(l=u.locationData.relativeBoundingBox).width<0||l.height<0))){if(t.numKeypoints>0)for((d=u.locationData).relativeKeypoints=[],c=t.numKeypoints*t.numValuesPerKeypoint,h=0;h<c;h+=t.numValuesPerKeypoint)p=a+t.keypointCoordOffset+h,f={x:i[p+0],y:t.flipVertically?1-i[p+1]:i[p+1]},d.relativeKeypoints.push(f);o.push(u)}return[2,o]}})})}function Wy(s,e,t,o,i,r,n){return{score:[i],ind:n,locationData:{relativeBoundingBox:{xMin:e,yMin:r?1-t:s,xMax:o,yMax:r?1-s:t,width:o-e,height:t-s}}}}function Vy(s,e){return s==="none"?e:function(t){return 1/(1+Math.exp(-t))}(e)}function Ms(s,e,t,o){return O(this,void 0,void 0,function(){var i,r,n,a,u,l,d,c;return W(this,function(h){switch(h.label){case 0:return t=t||e.flipHorizontally||!1,o=o||e.flipVertically||!1,i=s.size,r=i/e.numLandmarks,[4,s.data()];case 1:for(n=h.sent(),a=[],u=0;u<e.numLandmarks;++u)l=u*r,(c={x:0,y:0}).x=t?e.inputImageWidth-n[l]:n[l],r>1&&(c.y=o?e.inputImageHeight-n[l+1]:n[l+1]),r>2&&(c.z=n[l+2]),r>3&&(c.score=Vy(e.visibilityActivation,n[l+3])),a.push(c);for(d=0;d<a.length;++d)(c=a[d]).x=c.x/e.inputImageWidth,c.y=c.y/e.inputImageHeight,c.z=c.z/e.inputImageWidth/(e.normalizeZ||1);return[2,a]}})})}function Ts(s,e,t){var o=s.width,i=s.height,r=s.rotation;if(t.rotation==null&&t.rotationDegree==null||(r=function(l,d){return d.rotation!=null?l+=d.rotation:d.rotationDegree!=null&&(l+=Math.PI*d.rotationDegree/180),ji(l)}(r,t)),r===0)s.xCenter=s.xCenter+o*t.shiftX,s.yCenter=s.yCenter+i*t.shiftY;else{var n=(e.width*o*t.shiftX*Math.cos(r)-e.height*i*t.shiftY*Math.sin(r))/e.width,a=(e.width*o*t.shiftX*Math.sin(r)+e.height*i*t.shiftY*Math.cos(r))/e.height;s.xCenter=s.xCenter+n,s.yCenter=s.yCenter+a}{var u=Math.max(o*e.width,i*e.height);o=u/e.width,i=u/e.height}return s.width=o*t.scaleX,s.height=i*t.scaleY,s}function so(s,e){return s.map(function(t){var o=H(H({},t),{x:t.x/e.width,y:t.y/e.height});return t.z!=null&&(t.z=t.z/e.width),o})}var Se=function(){function s(e){this.alpha=e,this.initialized=!1}return s.prototype.apply=function(e,t){var o;return this.initialized?o=t==null?this.storedValue+this.alpha*(e-this.storedValue):this.storedValue+this.alpha*t*Math.asinh((e-this.storedValue)/t):(o=e,this.initialized=!0),this.rawValue=e,this.storedValue=o,o},s.prototype.applyWithAlpha=function(e,t,o){return this.alpha=t,this.apply(e,o)},s.prototype.hasLastRawValue=function(){return this.initialized},s.prototype.lastRawValue=function(){return this.rawValue},s.prototype.reset=function(){this.initialized=!1},s}(),Mt=function(){function s(e){this.frequency=e.frequency,this.minCutOff=e.minCutOff,this.beta=e.beta,this.thresholdCutOff=e.thresholdCutOff,this.thresholdBeta=e.thresholdBeta,this.derivateCutOff=e.derivateCutOff,this.x=new Se(this.getAlpha(this.minCutOff)),this.dx=new Se(this.getAlpha(this.derivateCutOff)),this.lastTimestamp=0}return s.prototype.apply=function(e,t,o){if(e==null)return e;var i=Math.trunc(t);if(this.lastTimestamp>=i)return e;this.lastTimestamp!==0&&i!==0&&(this.frequency=1/(1e-6*(i-this.lastTimestamp))),this.lastTimestamp=i;var r=this.x.hasLastRawValue()?(e-this.x.lastRawValue())*o*this.frequency:0,n=this.dx.applyWithAlpha(r,this.getAlpha(this.derivateCutOff)),a=this.minCutOff+this.beta*Math.abs(n),u=this.thresholdCutOff!=null?this.thresholdCutOff+this.thresholdBeta*Math.abs(n):null;return this.x.applyWithAlpha(e,this.getAlpha(a),u)},s.prototype.getAlpha=function(e){return 1/(1+this.frequency/(2*Math.PI*e))},s}(),Yt=function(){function s(e){this.config=e}return s.prototype.apply=function(e,t,o){var i=this;if(e==null)return this.reset(),null;this.initializeFiltersIfEmpty(e);var r=1;if(!this.config.disableValueScaling){if(o<this.config.minAllowedObjectScale)return Re([],e,!0);r=1/o}return e.map(function(n,a){var u=H(H({},n),{x:i.xFilters[a].apply(n.x,t,r),y:i.yFilters[a].apply(n.y,t,r)});return n.z!=null&&(u.z=i.zFilters[a].apply(n.z,t,r)),u})},s.prototype.reset=function(){this.xFilters=null,this.yFilters=null,this.zFilters=null},s.prototype.initializeFiltersIfEmpty=function(e){var t=this;this.xFilters!=null&&this.xFilters.length===e.length||(this.xFilters=e.map(function(o){return new Mt(t.config)}),this.yFilters=e.map(function(o){return new Mt(t.config)}),this.zFilters=e.map(function(o){return new Mt(t.config)}))},s}(),Tt=function(){function s(e){this.config=e,this.window=[],this.lowPassFilter=new Se(1),this.lastValue=0,this.lastValueScale=1,this.lastTimestamp=-1}return s.prototype.apply=function(e,t,o){if(e==null)return e;var i,r=Math.trunc(t);if(this.lastTimestamp>=r)return e;if(this.lastTimestamp===-1)i=1;else{for(var n=e*o-this.lastValue*this.lastValueScale,a=r-this.lastTimestamp,u=n,l=a,d=(1+this.window.length)*(1e6/30),c=0,h=this.window;c<h.length;c++){var p=h[c];if(l+p.duration>d)break;u+=p.distance,l+=p.duration}var f=u/(1e-6*l);i=1-1/(1+this.config.velocityScale*Math.abs(f)),this.window.unshift({distance:n,duration:a}),this.window.length>this.config.windowSize&&this.window.pop()}return this.lastValue=e,this.lastValueScale=o,this.lastTimestamp=r,this.lowPassFilter.applyWithAlpha(e,i)},s}(),Uy=function(){function s(e){this.config=e}return s.prototype.apply=function(e,t,o){var i=this;if(e==null)return this.reset(),null;var r=1;if(!this.config.disableValueScaling){if(o<this.config.minAllowedObjectScale)return Re([],e,!0);r=1/o}return this.initializeFiltersIfEmpty(e),e.map(function(n,a){var u=H(H({},n),{x:i.xFilters[a].apply(n.x,t,r),y:i.yFilters[a].apply(n.y,t,r)});return n.z!=null&&(u.z=i.zFilters[a].apply(n.z,t,r)),u})},s.prototype.reset=function(){this.xFilters=null,this.yFilters=null,this.zFilters=null},s.prototype.initializeFiltersIfEmpty=function(e){var t=this;this.xFilters!=null&&this.xFilters.length===e.length||(this.xFilters=e.map(function(o){return new Tt(t.config)}),this.yFilters=e.map(function(o){return new Tt(t.config)}),this.zFilters=e.map(function(o){return new Tt(t.config)}))},s}(),Lt=function(){function s(e){if(e.velocityFilter!=null)this.keypointsFilter=new Uy(e.velocityFilter);else{if(e.oneEuroFilter==null)throw new Error("Either configure velocityFilter or oneEuroFilter, but got "+"".concat(e,"."));this.keypointsFilter=new Yt(e.oneEuroFilter)}}return s.prototype.apply=function(e,t,o,i,r){if(i===void 0&&(i=!1),e==null)return this.keypointsFilter.reset(),null;var n=r!=null?function(l,d){return(l.width*d.width+l.height*d.height)/2}(r,o):1,a=i?to(e,o):e,u=this.keypointsFilter.apply(a,t,n);return i?so(u,o):u},s}(),Ls=function(){function s(e){this.alpha=e.alpha}return s.prototype.apply=function(e){var t=this;if(e==null)return this.visibilityFilters=null,null;this.visibilityFilters!=null&&this.visibilityFilters.length===e.length||(this.visibilityFilters=e.map(function(a){return new Se(t.alpha)}));for(var o=[],i=0;i<e.length;++i){var r=e[i],n=H({},r);n.score=this.visibilityFilters[i].apply(r.score),o.push(n)}return o},s}(),Gy={interpolatedScaleAspectRatio:1,featureMapHeight:[],featureMapWidth:[],numLayers:5,minScale:.1484375,maxScale:.75,inputSizeHeight:224,inputSizeWidth:224,anchorOffsetX:.5,anchorOffsetY:.5,strides:[8,16,32,32,32],aspectRatios:[1],fixedAnchorSize:!0},_e={runtime:"tfjs",modelType:"full",enableSmoothing:!0,enableSegmentation:!1,smoothSegmentation:!0,detectorModelUrl:"https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/detector/1",landmarkModelUrl:"https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/full/2"},Hy={maxPoses:1,flipHorizontal:!1},Xy={applyExponentialOnBoxSize:!1,flipVertically:!1,numBoxes:2254,numCoords:12,boxCoordOffset:0,keypointCoordOffset:4,numKeypoints:4,numValuesPerKeypoint:2,sigmoidScore:!0,scoreClippingThresh:100,reverseOutputOrder:!0,xScale:224,yScale:224,hScale:224,wScale:224,minScoreThresh:.5},Ky=.3,Es={shiftX:0,shiftY:0,scaleX:1.25,scaleY:1.25},qy={outputTensorSize:{width:224,height:224},keepAspectRatio:!0,outputTensorFloatRange:[-1,1],borderMode:"zero"},Yy={outputTensorSize:{width:256,height:256},keepAspectRatio:!0,outputTensorFloatRange:[0,1],borderMode:"zero"},jy={numLandmarks:39,inputImageWidth:256,inputImageHeight:256,visibilityActivation:"sigmoid",flipHorizontally:!1,flipVertically:!1},Qy={numLandmarks:39,inputImageWidth:1,inputImageHeight:1,visibilityActivation:"sigmoid",flipHorizontally:!1,flipVertically:!1},Zy={kernelSize:7,minConfidenceToRefine:.5},_s={alpha:.1},Jy={oneEuroFilter:{frequency:30,minCutOff:.05,beta:80,derivateCutOff:1,minAllowedObjectScale:1e-6}},e2={oneEuroFilter:{frequency:30,minCutOff:.01,beta:10,derivateCutOff:1,minAllowedObjectScale:1e-6}},t2={oneEuroFilter:{frequency:30,minCutOff:.1,beta:40,derivateCutOff:1,minAllowedObjectScale:1e-6,disableValueScaling:!0}},s2={activation:"none"},i2={combineWithPreviousRatio:.7},o2=function(){function s(e){this.mask=e}return s.prototype.toCanvasImageSource=function(){return O(this,void 0,void 0,function(){return W(this,function(e){return[2,Ki(this.mask)]})})},s.prototype.toImageData=function(){return O(this,void 0,void 0,function(){return W(this,function(e){return[2,qi(this.mask)]})})},s.prototype.toTensor=function(){return O(this,void 0,void 0,function(){return W(this,function(e){return[2,this.mask]})})},s.prototype.getUnderlyingType=function(){return"tensor"},s}();function r2(s){return Yi(s),"person"}var n2=function(){function s(e,t,o,i,r,n){this.detectorModel=e,this.landmarkModel=t,this.enableSmoothing=o,this.enableSegmentation=i,this.smoothSegmentation=r,this.modelType=n,this.regionOfInterest=null,this.prevFilteredSegmentationMask=null,this.anchors=function(c){c.reduceBoxesInLowestLayer==null&&(c.reduceBoxesInLowestLayer=!1),c.interpolatedScaleAspectRatio==null&&(c.interpolatedScaleAspectRatio=1),c.fixedAnchorSize==null&&(c.fixedAnchorSize=!1);for(var h=[],p=0;p<c.numLayers;){for(var f=[],m=[],g=[],x=[],y=p;y<c.strides.length&&c.strides[y]===c.strides[p];){var w=zs(c.minScale,c.maxScale,y,c.strides.length);if(y===0&&c.reduceBoxesInLowestLayer)g.push(1),g.push(2),g.push(.5),x.push(.1),x.push(w),x.push(w);else{for(var C=0;C<c.aspectRatios.length;++C)g.push(c.aspectRatios[C]),x.push(w);if(c.interpolatedScaleAspectRatio>0){var b=y===c.strides.length-1?1:zs(c.minScale,c.maxScale,y+1,c.strides.length);x.push(Math.sqrt(w*b)),g.push(c.interpolatedScaleAspectRatio)}}y++}for(var S=0;S<g.length;++S){var v=Math.sqrt(g[S]);f.push(x[S]/v),m.push(x[S]*v)}var I=0,k=0;if(c.featureMapHeight.length>0)I=c.featureMapHeight[p],k=c.featureMapWidth[p];else{var N=c.strides[p];I=Math.ceil(c.inputSizeHeight/N),k=Math.ceil(c.inputSizeWidth/N)}for(var A=0;A<I;++A)for(var L=0;L<k;++L)for(var F=0;F<f.length;++F){var E={xCenter:(L+c.anchorOffsetX)/k,yCenter:(A+c.anchorOffsetY)/I,width:0,height:0};c.fixedAnchorSize?(E.width=1,E.height=1):(E.width=m[F],E.height=f[F]),h.push(E)}p=y}return h}(Gy);var a=tt(this.anchors.map(function(c){return c.width})),u=tt(this.anchors.map(function(c){return c.height})),l=tt(this.anchors.map(function(c){return c.xCenter})),d=tt(this.anchors.map(function(c){return c.yCenter}));this.anchorTensor={x:l,y:d,w:a,h:u},this.prevFilteredSegmentationMask=this.enableSegmentation?$e([],[0,0]):null}return s.prototype.estimatePoses=function(e,t,o){return O(this,void 0,void 0,function(){var i,r,n,a,u,l,d,c,h,p,f,m,g,x,y,w,C,b,S,v,I,k,N;return W(this,function(A){switch(A.label){case 0:return i=function(L){var F;if((F=L==null?Hy:H({},L)).maxPoses==null&&(F.maxPoses=1),F.maxPoses<=0)throw new Error("Invalid maxPoses ".concat(F.maxPoses,". Should be > 0."));if(F.maxPoses>1)throw new Error("Multi-pose detection is not implemented yet. Please set maxPoses to 1.");return F}(t),e==null?(this.reset(),[2,[]]):(this.maxPoses=i.maxPoses,this.timestamp=o!=null?1e3*o:eo(e)?1e6*e.currentTime:null,r=Xe(e),n=Q(function(){return Ge(us(e),"float32")}),(a=this.regionOfInterest)!=null?[3,2]:[4,this.detectPose(n)]);case 1:if((u=A.sent()).length===0)return this.reset(),n.dispose(),[2,[]];l=u[0],a=this.poseDetectionToRoi(l,r),A.label=2;case 2:return[4,this.poseLandmarksByRoi(a,n)];case 3:return d=A.sent(),n.dispose(),d==null?(this.reset(),[2,[]]):(c=d.landmarks,h=d.auxiliaryLandmarks,p=d.poseScore,f=d.worldLandmarks,m=d.segmentationMask,g=this.poseLandmarkFiltering(c,h,f,r),x=g.actualLandmarksFiltered,y=g.auxiliaryLandmarksFiltered,w=g.actualWorldLandmarksFiltered,C=this.poseLandmarksToRoi(y,r),this.regionOfInterest=C,b=this.smoothSegmentation&&m!=null?this.poseSegmentationFiltering(m):m,(S=x!=null?to(x,r):null)!=null&&S.forEach(function(L,F){L.name=ct[F]}),(v=w)!=null&&v.forEach(function(L,F){L.name=ct[F]}),I={score:p,keypoints:S,keypoints3D:v},b!==null&&(k=Q(function(){var L=at(b,2),F=Vt(L,[[0,0],[0,0],[0,1]]);return nu(F,[[0,0],[0,0],[0,2]],"symmetric")}),this.smoothSegmentation||ee(b),N={maskValueToLabel:r2,mask:new o2(k)},I.segmentation=N),[2,[I]])}})})},s.prototype.poseSegmentationFiltering=function(e){var t=this.prevFilteredSegmentationMask;return t.size===0?this.prevFilteredSegmentationMask=e:(this.prevFilteredSegmentationMask=_y(t,e,i2),ee(e)),ee(t),this.prevFilteredSegmentationMask},s.prototype.dispose=function(){this.detectorModel.dispose(),this.landmarkModel.dispose(),ee([this.anchorTensor.x,this.anchorTensor.y,this.anchorTensor.w,this.anchorTensor.h,this.prevFilteredSegmentationMask])},s.prototype.reset=function(){this.regionOfInterest=null,this.enableSegmentation&&(ee(this.prevFilteredSegmentationMask),this.prevFilteredSegmentationMask=$e([],[0,0])),this.visibilitySmoothingFilterActual=null,this.visibilitySmoothingFilterAuxiliary=null,this.landmarksSmoothingFilterActual=null,this.landmarksSmoothingFilterAuxiliary=null},s.prototype.detectPose=function(e){return O(this,void 0,void 0,function(){var t,o,i,r,n,a,u,l,d,c;return W(this,function(h){switch(h.label){case 0:return t=qt(e,qy),o=t.imageTensor,i=t.padding,r=this.detectorModel.predict(o),n=Ty(r),a=n.boxes,[4,By([u=n.logits,a],this.anchorTensor,Xy)];case 1:return(l=h.sent()).length===0?(ee([o,r,u,a]),[2,l]):[4,Ly(l,this.maxPoses,Ky)];case 2:return d=h.sent(),c=function(p,f){p===void 0&&(p=[]);for(var m=f.left,g=f.top,x=f.left+f.right,y=f.top+f.bottom,w=0;w<p.length;w++){var C=p[w],b=C.locationData.relativeBoundingBox,S=(b.xMin-m)/(1-x),v=(b.yMin-g)/(1-y),I=b.width/(1-x),k=b.height/(1-y);b.xMin=S,b.yMin=v,b.width=I,b.height=k,b.xMax=S+I,b.yMax=v+k;var N=C.locationData.relativeKeypoints;N&&N.forEach(function(A){var L=(A.x-m)/(1-x),F=(A.y-g)/(1-y);A.x=L,A.y=F})}return p}(d,i),ee([o,r,u,a]),[2,c]}})})},s.prototype.poseDetectionToRoi=function(e,t){return Ts(At(e,t,{rotationVectorEndKeypointIndex:1,rotationVectorStartKeypointIndex:0,rotationVectorTargetAngleDegree:90}),t,Es)},s.prototype.poseLandmarksByRoi=function(e,t){return O(this,void 0,void 0,function(){var o,i,r,n,a,u,l,d,c,h,p,f,m,g;return W(this,function(x){switch(x.label){case 0:if(o=Xe(t),i=qt(t,Yy,e),r=i.imageTensor,n=i.padding,a=i.transformationMatrix,this.modelType!=="lite"&&this.modelType!=="full"&&this.modelType!=="heavy")throw new Error("Model type must be one of lite, full or heavy,"+"but got ".concat(this.modelType));return u=["ld_3d","output_poseflag","activation_heatmap","world_3d"],this.enableSegmentation&&u.push("activation_segmentation"),l=this.landmarkModel.execute(r,u),[4,this.tensorsToPoseLandmarksAndSegmentation(l)];case 1:return(d=x.sent())==null?(ee(l),ee(r),[2,null]):(c=d.landmarks,h=d.auxiliaryLandmarks,p=d.poseScore,f=d.worldLandmarks,m=d.segmentationMask,[4,this.poseLandmarksAndSegmentationInverseProjection(o,e,n,a,c,h,f,m)]);case 2:return g=x.sent(),ee(l),ee(r),[2,H({poseScore:p},g)]}})})},s.prototype.poseLandmarksAndSegmentationInverseProjection=function(e,t,o,i,r,n,a,u){return O(this,void 0,void 0,function(){var l,d,c,h,p,f;return W(this,function(m){return l=Fs(r,o),d=Fs(n,o),c=Ns(l,t),h=Ns(d,t),p=function(g,x){for(var y=[],w=0,C=g;w<C.length;w++){var b=C[w],S=b.x,v=b.y,I=x.rotation,k=Math.cos(I)*S-Math.sin(I)*v,N=Math.sin(I)*S+Math.cos(I)*v,A=H({},b);A.x=k,A.y=N,y.push(A)}return y}(a,t),f=null,this.enableSegmentation&&(f=Q(function(){var g=u.shape,x=g[0],y=g[1],w=function(S){var v=Zi(new Array(16).fill(0));v[0][0]=Z(S,0,0),v[1][0]=-Z(S,0,1),v[2][0]=Z(S,0,2),v[3][0]=-Z(S,0,3),v[0][2]=Z(S,2,0),v[1][2]=-Z(S,2,1),v[2][2]=Z(S,2,2),v[3][2]=-Z(S,2,3),v[0][1]=-Z(S,1,0),v[1][1]=Z(S,1,1),v[2][1]=-Z(S,1,2),v[3][1]=Z(S,1,3),v[0][3]=-Z(S,3,0),v[1][3]=Z(S,3,1),v[2][3]=-Z(S,3,2),v[3][3]=Z(S,3,3);for(var I=S[0][0]*v[0][0]+S[1][0]*v[0][1]+S[2][0]*v[0][2]+S[3][0]*v[0][3],k=0;k<v.length;k++)for(var N=0;N<v.length;N++)v[k][N]/=I;return v}(i),C=$e(Qi(w,{width:y,height:x},e),[1,8]),b=[1,x,y,1];return X(Oe.transform(be(u,b),C,"bilinear","constant",0,[e.height,e.width]),[0,3])}),ee(u)),[2,{landmarks:c,auxiliaryLandmarks:h,worldLandmarks:p,segmentationMask:f}]})})},s.prototype.tensorsToPoseLandmarksAndSegmentation=function(e){return O(this,void 0,void 0,function(){var t,o,i,r,n,a,u,l,d,c,h,p,f;return W(this,function(m){switch(m.label){case 0:return t=e[0],o=e[1],i=e[2],r=e[3],n=this.enableSegmentation?e[4]:null,[4,o.data()];case 1:return(a=m.sent()[0])<.5?[2,null]:[4,Ms(t,jy)];case 2:return[4,Ey(m.sent(),i,Zy)];case 3:return u=m.sent(),l=u.slice(0,33),d=u.slice(33,35),[4,Ms(r,Qy)];case 4:return c=m.sent(),h=c.slice(0,33),p=function(g,x,y){for(var w=[],C=0;C<g.length;C++){var b=H({},x[C]);b.score=g[C].score,w.push(b)}return w}(l,h),f=this.enableSegmentation?function(g,x,y){return Q(function(){var w=X(g,[0]),C=w.shape[2];if(C===1){var b=w;switch(x.activation){case"none":break;case"sigmoid":b=ss(b);break;case"softmax":throw new Error("Softmax activation requires two channels.");default:throw new Error("Activation not supported (".concat(x.activation,")"))}var S=b;return X(S,[2])}throw new Error("Unsupported number of tensor channels ".concat(C))})}(n,s2):null,[2,{landmarks:l,auxiliaryLandmarks:d,poseScore:a,worldLandmarks:p,segmentationMask:f}]}})})},s.prototype.poseLandmarksToRoi=function(e,t){return Ts(At(As(e),t,{rotationVectorStartKeypointIndex:0,rotationVectorEndKeypointIndex:1,rotationVectorTargetAngleDegree:90}),t,Es)},s.prototype.poseLandmarkFiltering=function(e,t,o,i){var r,n,a;if(this.timestamp!=null&&this.enableSmoothing){var u=At(As(t),i,{rotationVectorEndKeypointIndex:0,rotationVectorStartKeypointIndex:1,rotationVectorTargetAngleDegree:90});this.visibilitySmoothingFilterActual==null&&(this.visibilitySmoothingFilterActual=new Ls(_s)),r=this.visibilitySmoothingFilterActual.apply(e),this.visibilitySmoothingFilterAuxiliary==null&&(this.visibilitySmoothingFilterAuxiliary=new Ls(_s)),n=this.visibilitySmoothingFilterAuxiliary.apply(t),a=this.visibilitySmoothingFilterActual.apply(o),this.landmarksSmoothingFilterActual==null&&(this.landmarksSmoothingFilterActual=new Lt(Jy)),r=this.landmarksSmoothingFilterActual.apply(r,this.timestamp,i,!0,u),this.landmarksSmoothingFilterAuxiliary==null&&(this.landmarksSmoothingFilterAuxiliary=new Lt(e2)),n=this.landmarksSmoothingFilterAuxiliary.apply(n,this.timestamp,i,!0,u),this.worldLandmarksSmoothingFilterActual==null&&(this.worldLandmarksSmoothingFilterActual=new Lt(t2)),a=this.worldLandmarksSmoothingFilterActual.apply(o,this.timestamp)}else r=e,n=t,a=o;return{actualLandmarksFiltered:r,auxiliaryLandmarksFiltered:n,actualWorldLandmarksFiltered:a}},s}();function a2(s){return O(this,void 0,void 0,function(){var e,t,o,i,r,n;return W(this,function(a){switch(a.label){case 0:return e=function(u){var l=H({},u??_e);if(l.enableSmoothing==null&&(l.enableSmoothing=_e.enableSmoothing),l.enableSegmentation==null&&(l.enableSegmentation=_e.enableSegmentation),l.smoothSegmentation==null&&(l.smoothSegmentation=_e.smoothSegmentation),l.modelType==null&&(l.modelType=_e.modelType),l.detectorModelUrl==null&&(l.detectorModelUrl=_e.detectorModelUrl),l.landmarkModelUrl==null)switch(l.modelType){case"lite":l.landmarkModelUrl="https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/lite/2";break;case"heavy":l.landmarkModelUrl="https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/heavy/2";break;case"full":default:l.landmarkModelUrl="https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/full/2"}return l}(s),t=typeof e.detectorModelUrl=="string"&&e.detectorModelUrl.indexOf("https://tfhub.dev")>-1,o=typeof e.landmarkModelUrl=="string"&&e.landmarkModelUrl.indexOf("https://tfhub.dev")>-1,[4,Promise.all([Ve(e.detectorModelUrl,{fromTFHub:t}),Ve(e.landmarkModelUrl,{fromTFHub:o})])];case 1:return i=a.sent(),r=i[0],n=i[1],[2,new n2(r,n,e.enableSmoothing,e.enableSegmentation,e.smoothSegmentation,e.modelType)]}})})}var Ne,se,io=function(){function s(e){(function(t){if(t.maxTracks<1)throw new Error("Must specify 'maxTracks' to be at least 1, but "+"encountered ".concat(t.maxTracks));if(t.maxAge<=0)throw new Error("Must specify 'maxAge' to be positive, but "+"encountered ".concat(t.maxAge));if(t.keypointTrackerParams!==void 0){if(t.keypointTrackerParams.keypointConfidenceThreshold<0||t.keypointTrackerParams.keypointConfidenceThreshold>1)throw new Error("Must specify 'keypointConfidenceThreshold' to be in the range [0, 1], but encountered "+"".concat(t.keypointTrackerParams.keypointConfidenceThreshold));if(t.keypointTrackerParams.minNumberOfKeypoints<1)throw new Error("Must specify 'minNumberOfKeypoints' to be at least 1, but "+"encountered ".concat(t.keypointTrackerParams.minNumberOfKeypoints));for(var o=0,i=t.keypointTrackerParams.keypointFalloff;o<i.length;o++){var r=i[o];if(r<=0)throw new Error("Must specify each keypoint falloff parameterto be positive "+"but encountered ".concat(r))}}})(e),this.tracks=[],this.maxTracks=e.maxTracks,this.maxAge=1e3*e.maxAge,this.minSimilarity=e.minSimilarity,this.nextID=1}return s.prototype.apply=function(e,t){this.filterOldTracks(t);var o=this.computeSimilarity(e);return this.assignTracks(e,o,t),this.updateTracks(t),e},s.prototype.getTracks=function(){return this.tracks.slice()},s.prototype.getTrackIDs=function(){return new Set(this.tracks.map(function(e){return e.id}))},s.prototype.filterOldTracks=function(e){var t=this;this.tracks=this.tracks.filter(function(o){return e-o.lastTimestamp<=t.maxAge})},s.prototype.assignTracks=function(e,t,o){for(var i=Array.from(Array(t[0].length).keys()),r=[],n=0,a=Array.from(Array(e.length).keys());n<a.length;n++){var u=a[n];if(i.length!==0){for(var l=-1,d=-1,c=0,h=i;c<h.length;c++){var p=h[c],f=t[u][p];f>=this.minSimilarity&&f>d&&(l=p,d=f)}if(l>=0){var m=this.tracks[l];m=Object.assign(m,this.createTrack(e[u],o,m.id)),e[u].id=m.id;var g=i.indexOf(l);i.splice(g,1)}else r.push(u)}else r.push(u)}for(var x=0,y=r;x<y.length;x++){u=y[x];var w=this.createTrack(e[u],o);this.tracks.push(w),e[u].id=w.id}},s.prototype.updateTracks=function(e){this.tracks.sort(function(t,o){return o.lastTimestamp-t.lastTimestamp}),this.tracks=this.tracks.slice(0,this.maxTracks)},s.prototype.createTrack=function(e,t,o){var i={id:o||this.nextTrackID(),lastTimestamp:t,keypoints:Re([],e.keypoints,!0).map(function(r){return H({},r)})};return e.box!==void 0&&(i.box=H({},e.box)),i},s.prototype.nextTrackID=function(){var e=this.nextID;return this.nextID+=1,e},s.prototype.remove=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.tracks=this.tracks.filter(function(o){return!e.includes(o.id)})},s.prototype.reset=function(){this.tracks=[]},s}(),u2=function(s){function e(t){return s.call(this,t)||this}return Xi(e,s),e.prototype.computeSimilarity=function(t){var o=this;return t.length===0||this.tracks.length===0?[[]]:t.map(function(i){return o.tracks.map(function(r){return o.iou(i,r)})})},e.prototype.iou=function(t,o){var i=Math.max(t.box.xMin,o.box.xMin),r=Math.max(t.box.yMin,o.box.yMin),n=Math.min(t.box.xMax,o.box.xMax),a=Math.min(t.box.yMax,o.box.yMax);if(i>=n||r>=a)return 0;var u=(n-i)*(a-r);return u/(t.box.width*t.box.height+o.box.width*o.box.height-u)},e}(io),l2=function(s){function e(t){var o=s.call(this,t)||this;return o.keypointThreshold=t.keypointTrackerParams.keypointConfidenceThreshold,o.keypointFalloff=t.keypointTrackerParams.keypointFalloff,o.minNumKeyoints=t.keypointTrackerParams.minNumberOfKeypoints,o}return Xi(e,s),e.prototype.computeSimilarity=function(t){if(t.length===0||this.tracks.length===0)return[[]];for(var o=[],i=0,r=t;i<r.length;i++){for(var n=r[i],a=[],u=0,l=this.tracks;u<l.length;u++){var d=l[u];a.push(this.oks(n,d))}o.push(a)}return o},e.prototype.oks=function(t,o){for(var i=this.area(o.keypoints)+1e-6,r=0,n=0,a=0;a<t.keypoints.length;++a){var u=t.keypoints[a],l=o.keypoints[a];if(!(u.score<this.keypointThreshold||l.score<this.keypointThreshold)){n+=1;var d=Math.pow(u.x-l.x,2)+Math.pow(u.y-l.y,2),c=2*this.keypointFalloff[a];r+=Math.exp(-1*d/(2*i*Math.pow(c,2)))}}return n<this.minNumKeyoints?0:r/n},e.prototype.area=function(t){var o=this,i=t.filter(function(u){return u.score>o.keypointThreshold}),r=Math.min.apply(Math,Re([1],i.map(function(u){return u.x}),!1)),n=Math.max.apply(Math,Re([0],i.map(function(u){return u.x}),!1)),a=Math.min.apply(Math,Re([1],i.map(function(u){return u.y}),!1));return(n-r)*(Math.max.apply(Math,Re([0],i.map(function(u){return u.y}),!1))-a)},e}(io);function oo(s){switch(s){case se.BlazePose:return ct.reduce(function(e,t,o){return e[t]=o,e},{});case se.PoseNet:case se.MoveNet:return me.reduce(function(e,t,o){return e[t]=o,e},{});default:throw new Error("Model ".concat(s," is not supported."))}}(function(s){s.Keypoint="keypoint",s.BoundingBox="boundingBox"})(Ne||(Ne={})),function(s){s.MoveNet="MoveNet",s.BlazePose="BlazePose",s.PoseNet="PoseNet"}(se||(se={}));var T2=Object.freeze({__proto__:null,getKeypointIndexBySide:function(s){switch(s){case se.BlazePose:return Py;case se.PoseNet:case se.MoveNet:return Ry;default:throw new Error("Model ".concat(s," is not supported."))}},getAdjacentPairs:function(s){switch(s){case se.BlazePose:return Dy;case se.PoseNet:case se.MoveNet:return $y;default:throw new Error("Model ".concat(s," is not supported."))}},getKeypointIndexByName:oo}),Bs=["SinglePose.Lightning","SinglePose.Thunder","MultiPose.Lightning"],ro={modelType:"SinglePose.Lightning",enableSmoothing:!0},Os={},Ws={frequency:30,minCutOff:2.5,beta:300,derivateCutOff:2.5,thresholdCutOff:.5,thresholdBeta:5,disableValueScaling:!0},Et={maxTracks:18,maxAge:1e3,minSimilarity:.2,keypointTrackerParams:{keypointConfidenceThreshold:.3,keypointFalloff:[.026,.025,.025,.035,.035,.079,.079,.072,.072,.062,.062,.107,.107,.087,.087,.089,.089],minNumberOfKeypoints:4}},Vs={maxTracks:18,maxAge:1e3,minSimilarity:.15,trackerParams:{}};function d2(s,e,t,o){for(var i={},r=0,n=me;r<n.length;r++){var a=n[r];i[a]=[e[t[a]].y*o.height,e[t[a]].x*o.width]}if(function(y,w){return(y[w.left_hip].score>.2||y[w.right_hip].score>.2)&&(y[w.left_shoulder].score>.2||y[w.right_shoulder].score>.2)}(e,t)){var u=(i.left_hip[0]+i.right_hip[0])/2,l=(i.left_hip[1]+i.right_hip[1])/2,d=function(y,w,C,b,S){for(var v=["left_shoulder","right_shoulder","left_hip","right_hip"],I=0,k=0,N=0;N<v.length;N++)(B=Math.abs(b-C[v[N]][0]))>I&&(I=B),(V=Math.abs(S-C[v[N]][1]))>k&&(k=V);for(var A=0,L=0,F=0,E=Object.keys(C);F<E.length;F++){var B,V,J=E[F];y[w[J]].score<.2||((B=Math.abs(b-C[J][0]))>A&&(A=B),(V=Math.abs(S-C[J][1]))>L&&(L=V))}return[I,k,A,L]}(e,t,i,u,l),c=d[0],h=d[1],p=d[2],f=d[3],m=Math.max(1.9*h,1.9*c,1.2*p,1.2*f),g=[u-(m=Math.min(m,Math.max(l,o.width-l,u,o.height-u))),l-m];if(m>Math.max(o.width,o.height)/2)return jt(s==null,o);var x=2*m;return{yMin:g[0]/o.height,xMin:g[1]/o.width,yMax:(g[0]+x)/o.height,xMax:(g[1]+x)/o.width,height:(g[0]+x)/o.height-g[0]/o.height,width:(g[1]+x)/o.width-g[1]/o.width}}return jt(s==null,o)}function jt(s,e){var t,o,i,r;return s?e.width>e.height?(t=1,o=e.height/e.width,i=0,r=(e.width/2-e.height/2)/e.width):(t=e.width/e.height,o=1,i=(e.height/2-e.width/2)/e.height,r=0):e.width>e.height?(t=e.width/e.height,o=1,i=(e.height/2-e.width/2)/e.height,r=0):(t=1,o=e.height/e.width,i=0,r=(e.width/2-e.height/2)/e.width),{yMin:i,xMin:r,yMax:i+t,xMax:r+o,height:t,width:o}}function c2(s){var e,t=s==null?ro:H({},s);if(t.modelType==null)t.modelType="SinglePose.Lightning";else if(Bs.indexOf(t.modelType)<0)throw new Error("Invalid architecture ".concat(t.modelType,". ")+"Should be one of ".concat(Bs));if(t.enableSmoothing==null&&(t.enableSmoothing=!0),t.minPoseScore!=null&&(t.minPoseScore<0||t.minPoseScore>1))throw new Error("minPoseScore should be between 0.0 and 1.0");if(t.multiPoseMaxDimension!=null&&(t.multiPoseMaxDimension%32!=0||t.multiPoseMaxDimension<32))throw new Error("multiPoseMaxDimension must be a multiple of 32 and higher than 0");if(t.modelType==="MultiPose.Lightning"&&t.enableTracking==null&&(t.enableTracking=!0),t.modelType==="MultiPose.Lightning"&&t.enableTracking===!0)if(t.trackerType==null&&(t.trackerType=Ne.BoundingBox),t.trackerType===Ne.Keypoint)t.trackerConfig!=null?t.trackerConfig=function(o){var i=Us(Et,o);return i.keypointTrackerParams=H({},Et.keypointTrackerParams),o.keypointTrackerParams!=null&&(o.keypointTrackerParams.keypointConfidenceThreshold!=null&&(i.keypointTrackerParams.keypointConfidenceThreshold=o.keypointTrackerParams.keypointConfidenceThreshold),o.keypointTrackerParams.keypointFalloff!=null&&(i.keypointTrackerParams.keypointFalloff=o.keypointTrackerParams.keypointFalloff),o.keypointTrackerParams.minNumberOfKeypoints!=null&&(i.keypointTrackerParams.minNumberOfKeypoints=o.keypointTrackerParams.minNumberOfKeypoints)),i}(t.trackerConfig):t.trackerConfig=Et;else{if(t.trackerType!==Ne.BoundingBox)throw new Error("Tracker type not supported by MoveNet");t.trackerConfig!=null?t.trackerConfig=(e=t.trackerConfig,Us(Vs,e)):t.trackerConfig=Vs}return t}function Us(s,e){var t={maxTracks:s.maxTracks,maxAge:s.maxAge,minSimilarity:s.minSimilarity};return e.maxTracks!=null&&(t.maxTracks=e.maxTracks),e.maxAge!=null&&(t.maxAge=e.maxAge),e.minSimilarity!=null&&(t.minSimilarity=e.minSimilarity),t}var h2=function(){function s(e,t){this.moveNetModel=e,this.modelInputResolution={height:0,width:0},this.keypointIndexByName=oo(se.MoveNet),t.modelType==="SinglePose.Lightning"?(this.modelInputResolution.width=192,this.modelInputResolution.height=192):t.modelType==="SinglePose.Thunder"&&(this.modelInputResolution.width=256,this.modelInputResolution.height=256),this.multiPoseModel=t.modelType==="MultiPose.Lightning",this.multiPoseModel||(this.keypointFilter=new Yt(Ws),this.cropRegionFilterYMin=new Se(.9),this.cropRegionFilterXMin=new Se(.9),this.cropRegionFilterYMax=new Se(.9),this.cropRegionFilterXMax=new Se(.9)),this.enableSmoothing=t.enableSmoothing,t.minPoseScore?this.minPoseScore=t.minPoseScore:this.minPoseScore=.25,t.multiPoseMaxDimension?this.multiPoseMaxDimension=t.multiPoseMaxDimension:this.multiPoseMaxDimension=256,this.enableTracking=t.enableTracking,this.multiPoseModel&&this.enableTracking&&(t.trackerType===Ne.Keypoint?this.tracker=new l2(t.trackerConfig):t.trackerType===Ne.BoundingBox&&(this.tracker=new u2(t.trackerConfig)),this.enableSmoothing&&(this.keypointFilterMap=new Map))}return s.prototype.runSinglePersonPoseModel=function(e){return O(this,void 0,void 0,function(){var t,o,i,r,n;return W(this,function(a){switch(a.label){case 0:if((t=this.moveNetModel.execute(e)).shape.length!==4||t.shape[0]!==1||t.shape[1]!==1||t.shape[2]!==17||t.shape[3]!==3)throw t.dispose(),new Error("Unexpected output shape from model: [".concat(t.shape,"]"));return wt()==="webgpu"?[3,1]:(o=t.dataSync(),[3,3]);case 1:return[4,t.data()];case 2:o=a.sent(),a.label=3;case 3:for(t.dispose(),i={keypoints:[],score:0},r=0,n=0;n<17;++n)i.keypoints[n]={y:o[3*n],x:o[3*n+1],score:o[3*n+2]},i.keypoints[n].score>.2&&(++r,i.score+=i.keypoints[n].score);return r>0&&(i.score/=r),[2,i]}})})},s.prototype.runMultiPersonPoseModel=function(e){return O(this,void 0,void 0,function(){var t,o,i,r,n,a,u,l;return W(this,function(d){switch(d.label){case 0:if((t=this.moveNetModel.execute(e)).shape.length!==3||t.shape[0]!==1||t.shape[2]!==56)throw t.dispose(),new Error("Unexpected output shape from model: [".concat(t.shape,"]"));return wt()==="webgpu"?[3,1]:(o=t.dataSync(),[3,3]);case 1:return[4,t.data()];case 2:o=d.sent(),d.label=3;case 3:for(t.dispose(),i=[],r=o.length/56,n=0;n<r;++n)for(i[n]={keypoints:[]},a=56*n+51,i[n].box={yMin:o[a],xMin:o[a+1],yMax:o[a+2],xMax:o[a+3],width:o[a+3]-o[a+1],height:o[a+2]-o[a]},u=56*n+55,i[n].score=o[u],i[n].keypoints=[],l=0;l<17;++l)i[n].keypoints[l]={y:o[56*n+3*l],x:o[56*n+3*l+1],score:o[56*n+3*l+2]};return[2,i]}})})},s.prototype.estimatePoses=function(e,t,o){return t===void 0&&(t=Os),O(this,void 0,void 0,function(){var i,r,n,a,u,l;return W(this,function(d){switch(d.label){case 0:return t=function(c){return c==null?Os:H({},c)}(t),e==null?(this.reset(),[2,[]]):(o==null?eo(e)&&(o=1e6*e.currentTime):o*=1e3,i=us(e),r=Xe(i),n=at(i,0),e instanceof qe||i.dispose(),a=[],this.multiPoseModel?[3,2]:[4,this.estimateSinglePose(n,r,o)]);case 1:return a=d.sent(),[3,4];case 2:return[4,this.estimateMultiplePoses(n,r,o)];case 3:a=d.sent(),d.label=4;case 4:for(u=0;u<a.length;++u)for(l=0;l<a[u].keypoints.length;++l)a[u].keypoints[l].name=me[l],a[u].keypoints[l].y*=r.height,a[u].keypoints[l].x*=r.width;return[2,a]}})})},s.prototype.estimateSinglePose=function(e,t,o){return O(this,void 0,void 0,function(){var i,r,n,a,u=this;return W(this,function(l){switch(l.label){case 0:return this.cropRegion||(this.cropRegion=jt(this.cropRegion==null,t)),i=Q(function(){var d=$e([[u.cropRegion.yMin,u.cropRegion.xMin,u.cropRegion.yMax,u.cropRegion.xMax]]),c=hi([1],"int32"),h=[u.modelInputResolution.height,u.modelInputResolution.width];return Ge(Oe.cropAndResize(e,d,c,h,"bilinear",0),"int32")}),e.dispose(),[4,this.runSinglePersonPoseModel(i)];case 1:if(r=l.sent(),i.dispose(),r.score<this.minPoseScore)return this.reset(),[2,[]];for(n=0;n<r.keypoints.length;++n)r.keypoints[n].y=this.cropRegion.yMin+r.keypoints[n].y*this.cropRegion.height,r.keypoints[n].x=this.cropRegion.xMin+r.keypoints[n].x*this.cropRegion.width;return o!=null&&this.enableSmoothing&&(r.keypoints=this.keypointFilter.apply(r.keypoints,o,1)),a=d2(this.cropRegion,r.keypoints,this.keypointIndexByName,t),this.cropRegion=this.filterCropRegion(a),[2,[r]]}})})},s.prototype.estimateMultiplePoses=function(e,t,o){return O(this,void 0,void 0,function(){var i,r,n,a,u,l,d,c,h,p,f,m=this;return W(this,function(g){switch(g.label){case 0:return t.width>t.height?(r=this.multiPoseMaxDimension,n=Math.round(this.multiPoseMaxDimension*t.height/t.width),i=Oe.resizeBilinear(e,[n,r]),u=r,l=32*Math.ceil(n/32),a=Vt(i,[[0,0],[0,l-n],[0,0],[0,0]])):(r=Math.round(this.multiPoseMaxDimension*t.width/t.height),n=this.multiPoseMaxDimension,i=Oe.resizeBilinear(e,[n,r]),u=32*Math.ceil(r/32),l=n,a=Vt(i,[[0,0],[0,0],[0,u-r],[0,0]])),i.dispose(),e.dispose(),d=Ge(a,"int32"),a.dispose(),[4,this.runMultiPersonPoseModel(d)];case 1:for(c=g.sent(),d.dispose(),c=c.filter(function(x){return x.score>=m.minPoseScore}),p=0;p<c.length;++p)for(h=0;h<c[p].keypoints.length;++h)c[p].keypoints[h].y*=l/n,c[p].keypoints[h].x*=u/r;if(this.enableTracking&&(this.tracker.apply(c,o),this.enableSmoothing)){for(p=0;p<c.length;++p)this.keypointFilterMap.has(c[p].id)||this.keypointFilterMap.set(c[p].id,new Yt(Ws)),c[p].keypoints=this.keypointFilterMap.get(c[p].id).apply(c[p].keypoints,o,1);f=this.tracker.getTrackIDs(),this.keypointFilterMap.forEach(function(x,y){f.has(y)||m.keypointFilterMap.delete(y)})}return[2,c]}})})},s.prototype.filterCropRegion=function(e){if(e){var t=this.cropRegionFilterYMin.apply(e.yMin),o=this.cropRegionFilterXMin.apply(e.xMin),i=this.cropRegionFilterYMax.apply(e.yMax),r=this.cropRegionFilterXMax.apply(e.xMax);return{yMin:t,xMin:o,yMax:i,xMax:r,height:i-t,width:r-o}}return this.cropRegionFilterYMin.reset(),this.cropRegionFilterXMin.reset(),this.cropRegionFilterYMax.reset(),this.cropRegionFilterXMax.reset(),null},s.prototype.dispose=function(){this.moveNetModel.dispose()},s.prototype.reset=function(){this.cropRegion=null,this.resetFilters()},s.prototype.resetFilters=function(){this.keypointFilter.reset(),this.cropRegionFilterYMin.reset(),this.cropRegionFilterXMin.reset(),this.cropRegionFilterYMax.reset(),this.cropRegionFilterXMax.reset()},s}();function p2(s){return s===void 0&&(s=ro),O(this,void 0,void 0,function(){var e,t,o,i;return W(this,function(r){switch(r.label){case 0:return e=c2(s),o=!0,e.modelUrl?(o=typeof e.modelUrl=="string"&&e.modelUrl.indexOf("https://tfhub.dev")>-1,[4,Ve(e.modelUrl,{fromTFHub:o})]):[3,2];case 1:return t=r.sent(),[3,4];case 2:return i=void 0,e.modelType==="SinglePose.Lightning"?i="https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4":e.modelType==="SinglePose.Thunder"?i="https://tfhub.dev/google/tfjs-model/movenet/singlepose/thunder/4":e.modelType==="MultiPose.Lightning"&&(i="https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1"),[4,Ve(i,{fromTFHub:o})];case 3:t=r.sent(),r.label=4;case 4:return wt()==="webgl"&&q().set("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD",0),[2,new h2(t,e)]}})})}var Gs={architecture:"MobileNetV1",outputStride:16,multiplier:.75,inputResolution:{height:257,width:257}},Hs=["MobileNetV1","ResNet50"],Xs={MobileNetV1:[8,16],ResNet50:[16]},f2=[8,16,32],Ks={MobileNetV1:[.5,.75,1],ResNet50:[1]},qs=[1,2,4],Ys={maxPoses:1,flipHorizontal:!1},m2={maxPoses:5,flipHorizontal:!1,scoreThreshold:.5,nmsRadius:20},g2=[-123.15,-115.9,-103.06];function _t(s){return Math.floor(s/2)}var x2=function(){function s(e,t){this.priorityQueue=new Array(e),this.numberOfElements=-1,this.getElementValue=t}return s.prototype.enqueue=function(e){this.priorityQueue[++this.numberOfElements]=e,this.swim(this.numberOfElements)},s.prototype.dequeue=function(){var e=this.priorityQueue[0];return this.exchange(0,this.numberOfElements--),this.sink(0),this.priorityQueue[this.numberOfElements+1]=null,e},s.prototype.empty=function(){return this.numberOfElements===-1},s.prototype.size=function(){return this.numberOfElements+1},s.prototype.all=function(){return this.priorityQueue.slice(0,this.numberOfElements+1)},s.prototype.max=function(){return this.priorityQueue[0]},s.prototype.swim=function(e){for(;e>0&&this.less(_t(e),e);)this.exchange(e,_t(e)),e=_t(e)},s.prototype.sink=function(e){for(;2*e<=this.numberOfElements;){var t=2*e;if(t<this.numberOfElements&&this.less(t,t+1)&&t++,!this.less(e,t))break;this.exchange(e,t),e=t}},s.prototype.getValueAt=function(e){return this.getElementValue(this.priorityQueue[e])},s.prototype.less=function(e,t){return this.getValueAt(e)<this.getValueAt(t)},s.prototype.exchange=function(e,t){var o=this.priorityQueue[e];this.priorityQueue[e]=this.priorityQueue[t],this.priorityQueue[t]=o},s}();function y2(s,e,t,o,i,r){for(var n=r.shape,a=n[0],u=n[1],l=!0,d=Math.max(t-i,0),c=Math.min(t+i+1,a),h=d;h<c;++h){for(var p=Math.max(o-i,0),f=Math.min(o+i+1,u),m=p;m<f;++m)if(r.get(h,m,s)>e){l=!1;break}if(!l)break}return l}function w2(s){return O(this,void 0,void 0,function(){return W(this,function(e){return[2,Promise.all(s.map(function(t){return t.buffer()}))]})})}function no(s,e,t,o){return{y:o.get(s,e,t),x:o.get(s,e,t+17)}}function ao(s,e,t){var o=no(s.heatmapY,s.heatmapX,s.id,t),i=o.y,r=o.x;return{x:s.heatmapX*e+r,y:s.heatmapY*e+i}}function uo(s,e,t,o){var i=t.x,r=t.y;return s.some(function(n){var a,u,l,d,c,h,p=n.keypoints;return a=r,u=i,l=p[o].y,d=p[o].x,(c=l-a)*c+(h=d-u)*h<=e})}var js=me.reduce(function(s,e,t){return s[e]=t,s},{}),lo=[["nose","left_eye"],["left_eye","left_ear"],["nose","right_eye"],["right_eye","right_ear"],["nose","left_shoulder"],["left_shoulder","left_elbow"],["left_elbow","left_wrist"],["left_shoulder","left_hip"],["left_hip","left_knee"],["left_knee","left_ankle"],["nose","right_shoulder"],["right_shoulder","right_elbow"],["right_elbow","right_wrist"],["right_shoulder","right_hip"],["right_hip","right_knee"],["right_knee","right_ankle"]].map(function(s){var e=s[0],t=s[1];return[js[e],js[t]]}),Bt=lo.map(function(s){return s[1]}),Qs=lo.map(function(s){return s[0]});function Zs(s,e,t){return s<e?e:s>t?t:s}function Ot(s,e,t,o){return{y:Zs(Math.round(s.y/e),0,t-1),x:Zs(Math.round(s.x/e),0,o-1)}}function Js(s,e){return{x:s.x+e.x,y:s.y+e.y}}function ei(s,e,t,o,i,r,n,a){a===void 0&&(a=2);for(var u=o.shape,l=u[0],d=u[1],c={y:e.y,x:e.x},h=Js(c,function(y,w,C){var b=C.shape[2]/2;return{y:C.get(w.y,w.x,y),x:C.get(w.y,w.x,b+y)}}(s,Ot(c,r,l,d),n)),p=0;p<a;p++){var f=Ot(h,r,l,d),m=no(f.y,f.x,t,i);h=Js({x:f.x*r,y:f.y*r},{x:m.x,y:m.y})}var g=Ot(h,r,l,d),x=o.get(g.y,g.x,t);return{y:h.y,x:h.x,name:me[t],score:x}}function C2(s,e,t,o,i,r){var n=e.shape[2],a=Bt.length,u=new Array(n),l=s.part,d=s.score,c=ao(l,o,t);u[l.id]={score:d,name:me[l.id],y:c.y,x:c.x};for(var h=a-1;h>=0;--h){var p=Bt[h],f=Qs[h];u[p]&&!u[f]&&(u[f]=ei(h,u[p],f,e,t,o,r))}for(h=0;h<a;++h)p=Qs[h],f=Bt[h],u[p]&&!u[f]&&(u[f]=ei(h,u[p],f,e,t,o,i));return u}function b2(s,e,t){return t.reduce(function(o,i,r){var n=i.y,a=i.x,u=i.score;return uo(s,e,{y:n,x:a},r)||(o+=u),o},0)/t.length}function S2(s,e,t,o,i,r,n,a){return n===void 0&&(n=.5),a===void 0&&(a=20),O(this,void 0,void 0,function(){var u,l,d,c,h,p,f,m,g,x,y,w;return W(this,function(C){switch(C.label){case 0:return[4,w2([s,e,t,o])];case 1:for(u=C.sent(),l=u[0],d=u[1],c=u[2],h=u[3],p=[],f=function(b,S,v){for(var I=v.shape,k=I[0],N=I[1],A=I[2],L=new x2(k*N*A,function(J){return J.score}),F=0;F<k;++F)for(var E=0;E<N;++E)for(var B=0;B<A;++B){var V=v.get(F,E,B);V<b||y2(B,V,F,E,S,v)&&L.enqueue({score:V,part:{heatmapY:F,heatmapX:E,id:B}})}return L}(n,1,l),m=a*a;p.length<r&&!f.empty();)g=f.dequeue(),x=ao(g.part,i,d),uo(p,m,x,g.part.id)||(y=C2(g,l,d,i,c,h),w=b2(p,m,y),p.push({keypoints:y,score:w}));return[2,p]}})})}function co(){for(var s,e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];switch(e.length){case 0:s="fn main() ";break;case 1:s="fn main(".concat(e[0]," : i32)");break;default:throw Error("Unreachable")}return s}var v2=function(){function s(e){this.variableNames=["A","B"],this.size=!0,this.workgroupSize=[32,1,1],this.outputShape=[e[0],1],this.dispatchLayout=D(this.outputShape),this.dispatch=$(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="getpointsConfidenceOp"}return s.prototype.getUserCode=function(){return`
        `.concat(co("index"),` {
          if (index < uniforms.size) {
            let y = B[index * 2];
            let x = B[index * 2 + 1];
            let outIndex = y * uniforms.aShape.x * uniforms.aShape.z + x * uniforms.aShape.z + index;
            result[index] = A[outIndex];
          }
        }
        `)},s}();function k2(s,e){if(ut()instanceof je)return function(t,o){var i=ut(),r=new v2(o.shape),n=i.runWebGPUProgram(r,[t,o],"float32");return Be().makeTensorFromTensorInfo(n)}(s,e);throw new Error("getPointsConfidenceWebGPU is not supported in this backend!")}var I2=function(){function s(e){if(this.variableNames=["A","B"],this.size=!0,this.supportedLastDimension=2,e.length!==2||e[1]!==this.supportedLastDimension)throw new Error("GetOffsetVectorsProgram only supports shape of [x, ".concat(this.supportedLastDimension,"], but current shape is ").concat(e));this.workgroupSize=[32,1,1],this.outputShape=e;var t=[e[0],1];this.dispatchLayout=D(t),this.dispatch=$(this.dispatchLayout,t,this.workgroupSize),this.shaderKey="GetOffsetVectors"}return s.prototype.getUserCode=function(){return`
    fn getOffsetPoint(y: i32, x: i32, index: i32) -> vec2<i32> {
      let outIndexY = y * uniforms.bShape.x * uniforms.bShape.y + x * uniforms.bShape.y + index;
      let outIndexX = outIndexY + uniforms.bShape.z;
      let outY = i32(B[outIndexY]);
      let outX = i32(B[outIndexX]);
      return vec2<i32>(outY, outX);
    }

    `.concat(co("index"),` {
      if (index < uniforms.size) {
        let indexY = index * `).concat(this.supportedLastDimension,`;
        let indexX = indexY + 1;
        let heatmapY = A[indexY];
        let heatmapX = A[indexX];
        let out = getOffsetPoint(i32(heatmapY), i32(heatmapX), index);
        result[indexY] = f32(out[0]);
        result[indexX] = f32(out[1]);
      }
    }
    `)},s}();function P2(s,e){if(ut()instanceof je)return function(t,o){var i=ut(),r=new I2(t.shape),n=i.runWebGPUProgram(r,[t,o],"float32");return Be().makeTensorFromTensorInfo(n)}(s,e);throw new Error("getOffsetVectorsGPU is not supported in this backend!")}function ho(s){var e=s.shape,t=e[0],o=e[1],i=e[2];return Q(function(){var r,n,a=be(s,[t*o,i]),u=du(a,0),l=at(re(u,ot(o,"int32")),1),d=at((r=u,n=o,Q(function(){var c=re(r,ot(n,"int32"));return We(r,Y(c,ot(n,"int32")))})),1);return Ut([l,d],1)})}function R2(s,e,t){return Q(function(){var o=function(i,r){for(var n=[],a=0;a<me.length;a++){var u=i.get(a,0).valueOf(),l=i.get(a,1).valueOf(),d=$2(u,l,a,r),c=d.x,h=d.y;n.push(h),n.push(c)}return $e(n,[me.length,2])}(s,t);return te(Ge(Y(s.toTensor(),ot(e,"int32")),"float32"),o)})}function $2(s,e,t,o){return{y:o.get(s,e,t),x:o.get(s,e,t+me.length)}}function D2(s,e,t){return O(this,void 0,void 0,function(){var o,i,r,n,a,u,l,d,c,h;return W(this,function(p){switch(p.label){case 0:return o=0,i=ho(s),[4,Promise.all([s.buffer(),e.buffer(),i.buffer()])];case 1:return r=p.sent(),n=r[0],a=r[1],u=r[2],[4,(l=R2(u,t,a)).buffer()];case 2:return d=p.sent(),c=Array.from(function(f,m){for(var g=m.shape[0],x=new Float32Array(g),y=0;y<g;y++){var w=m.get(y,0),C=m.get(y,1);x[y]=f.get(w,C,y)}return x}(n,u)),h=c.map(function(f,m){return o+=f,{y:d.get(m,0),x:d.get(m,1),score:f,name:me[m]}}),i.dispose(),l.dispose(),[2,{keypoints:h,score:o/h.length}]}})})}function N2(s,e,t){return O(this,void 0,void 0,function(){var o,i,r;return W(this,function(n){return o=ho(s),i=function(a,u,l){return Q(function(){var d=P2(a,l);return te(Ge(Y(a,ot(u,"int32")),"float32"),d)})}(o,t,e),r=k2(s,o),[2,[i,r]]})})}function ti(s,e){return(s-1)%e==0}var si="https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/",ii="https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/";function oi(s,e){return function(t,o){return(t-1)%o==0}(s,e)?s:Math.floor(s/e)*e+1}var ri=function(){function s(e,t){this.posenetModel=e;var o=this.posenetModel.inputs[0].shape;G(o[1]===-1&&o[2]===-1,function(){return"Input shape [".concat(o[1],", ").concat(o[2],"] ")+"must both be equal to or -1"});var i,r,n=(i=t.inputResolution,r=t.outputStride,{height:oi(i.height,r),width:oi(i.width,r)});(function(a){G(f2.indexOf(a)>=0,function(){return"outputStride of ".concat(a," is invalid. ")+"It must be either 8 or 16."})})(t.outputStride),function(a,u){G(ti(a.height,u),function(){return"height of ".concat(a.height," is invalid for output stride ")+"".concat(u,".")}),G(ti(a.width,u),function(){return"width of ".concat(a.width," is invalid for output stride ")+"".concat(u,".")})}(n,t.outputStride),this.inputResolution=n,this.outputStride=t.outputStride,this.architecture=t.architecture}return s.prototype.estimatePoses=function(e,t){return t===void 0&&(t=Ys),O(this,void 0,void 0,function(){return W(this,function(o){return[2,this.estimatePosesGPU(e,t,!1)]})})},s.prototype.estimatePosesGPU=function(e,t,o){return t===void 0&&(t=Ys),o===void 0&&(o=!1),O(this,void 0,void 0,function(){var i,r,n,a,u,l,d,c,h,p,f,m,g,x,y,w,C,b;return W(this,function(S){switch(S.label){case 0:return i=function(v){var I=v;if(I.maxPoses==null&&(I.maxPoses=1),I.maxPoses<=0)throw new Error("Invalid maxPoses ".concat(I.maxPoses,". Should be > 0."));if(I.maxPoses>1){if((I=H(H({},m2),I)).scoreThreshold<0||I.scoreThreshold>1)throw new Error("Invalid scoreThreshold ".concat(I.scoreThreshold,". ")+"Should be in range [0.0, 1.0]");if(I.nmsRadius<=0)throw new Error("Invalid nmsRadius ".concat(I.nmsRadius,"."))}return I}(t),e==null?[2,o?[[],[]]:[]]:(this.maxPoses=i.maxPoses,r=qt(e,{outputTensorSize:this.inputResolution,keepAspectRatio:!0,borderMode:"replicate"}),n=r.imageTensor,a=r.padding,u=this.architecture==="ResNet50"?te(n,g2):Ji(n,[-1,1]),l=this.posenetModel.predict(u),this.architecture==="ResNet50"?(d=X(l[2],[0]),c=X(l[3],[0]),h=X(l[0],[0]),p=X(l[1],[0])):(d=X(l[0],[0]),c=X(l[1],[0]),h=X(l[2],[0]),p=X(l[3],[0])),f=ss(c),this.maxPoses!==1?[3,5]:o?[4,N2(f,d,this.outputStride)]:[3,2]);case 1:return g=S.sent(),y=g[0],x=g[1],m=[y,x],[3,4];case 2:return[4,D2(f,d,this.outputStride)];case 3:y=S.sent(),m=[y],S.label=4;case 4:return[3,7];case 5:if(o)throw new Error("GPU renderer only supports single pose!");return[4,S2(f,d,h,p,this.outputStride,this.maxPoses,i.scoreThreshold,i.nmsRadius)];case 6:m=S.sent(),S.label=7;case 7:if(o){if(i.flipHorizontal===!0)throw new Error("flipHorizontal is not supported!");w=this.getCanvasInfo(Xe(e),this.inputResolution,a)}else b=Xe(e),C=function(v,I,k,N){var A=I.height,L=I.width,F=A/(k.height*(1-N.top-N.bottom)),E=L/(k.width*(1-N.left-N.right)),B=-N.top*k.height,V=-N.left*k.width;if(E===1&&F===1&&B===0&&V===0)return v;for(var J=0,ue=v;J<ue.length;J++)for(var le=0,Ce=ue[J].keypoints;le<Ce.length;le++){var ge=Ce[le];ge.x=(ge.x+V)*E,ge.y=(ge.y+B)*F}return v}(m,b,this.inputResolution,a),i.flipHorizontal&&(C=function(v,I){for(var k=0,N=v;k<N.length;k++)for(var A=0,L=N[k].keypoints;A<L.length;A++){var F=L[A];F.x=I.width-1-F.x}return v}(C,b));return n.dispose(),u.dispose(),ee(l),d.dispose(),c.dispose(),h.dispose(),p.dispose(),f.dispose(),[2,o?[m,w]:C]}})})},s.prototype.getCanvasInfo=function(e,t,o){var i=e.height,r=e.width,n=i/(t.height*(1-o.top-o.bottom)),a=r/(t.width*(1-o.left-o.right)),u=-o.top*t.height;return[-o.left*t.width,u,a,n,e.width,e.height]},s.prototype.dispose=function(){this.posenetModel.dispose()},s.prototype.reset=function(){},s}();function z2(s){return s===void 0&&(s=Gs),O(this,void 0,void 0,function(){var e,t,o,i,r;return W(this,function(n){switch(n.label){case 0:return(e=function(d){var c=d||Gs;if(c.architecture==null&&(c.architecture="MobileNetV1"),Hs.indexOf(c.architecture)<0)throw new Error("Invalid architecture ".concat(c.architecture,". ")+"Should be one of ".concat(Hs));if(c.inputResolution==null&&(c.inputResolution={height:257,width:257}),c.outputStride==null&&(c.outputStride=16),Xs[c.architecture].indexOf(c.outputStride)<0)throw new Error("Invalid outputStride ".concat(c.outputStride,". ")+"Should be one of ".concat(Xs[c.architecture]," ")+"for architecture ".concat(c.architecture,"."));if(c.multiplier==null&&(c.multiplier=1),Ks[c.architecture].indexOf(c.multiplier)<0)throw new Error("Invalid multiplier ".concat(c.multiplier,". ")+"Should be one of ".concat(Ks[c.architecture]," ")+"for architecture ".concat(c.architecture,"."));if(c.quantBytes==null&&(c.quantBytes=4),qs.indexOf(c.quantBytes)<0)throw new Error("Invalid quantBytes ".concat(c.quantBytes,". ")+"Should be one of ".concat(qs," ")+"for architecture ".concat(c.architecture,"."));if(c.architecture==="MobileNetV1"&&c.outputStride===32&&c.multiplier!==1)throw new Error("When using an output stride of 32, you must select 1 as the multiplier.");return c}(s)).architecture!=="ResNet50"?[3,2]:(a=e.outputStride,u=e.quantBytes,l="model-stride".concat(a,".json"),t=u===4?ii+"float/"+l:ii+"quant".concat(u,"/")+l,[4,Ve(e.modelUrl||t)]);case 1:return o=n.sent(),[2,new ri(o,e)];case 2:return i=function(d,c,h){var p={1:"100",.75:"075",.5:"050"},f="model-stride".concat(d,".json");return h===4?si+"float/".concat(p[c],"/")+f:si+"quant".concat(h,"/").concat(p[c],"/")+f}(e.outputStride,e.multiplier,e.quantBytes),[4,Ve(e.modelUrl||i)];case 3:return r=n.sent(),[2,new ri(r,e)]}var a,u,l})})}function L2(s,e){return O(this,void 0,void 0,function(){var t,o;return W(this,function(i){switch(s){case se.PoseNet:return[2,z2(e)];case se.BlazePose:if(o=void 0,(t=e)!=null){if(t.runtime==="tfjs")return[2,a2(e)];if(t.runtime==="mediapipe")return[2,My(e)];o=t.runtime}throw new Error("Expect modelConfig.runtime to be either 'tfjs' "+"or 'mediapipe', but got ".concat(o));case se.MoveNet:return[2,p2(e)];default:throw new Error("".concat(s," is not a supported model name."))}})})}var E2={keypointsToNormalizedKeypoints:so},_2={modelType:{SINGLEPOSE_LIGHTNING:"SinglePose.Lightning",SINGLEPOSE_THUNDER:"SinglePose.Thunder",MULTIPOSE_LIGHTNING:"MultiPose.Lightning"}};export{se as SupportedModels,Ne as TrackerType,E2 as calculators,L2 as createDetector,_2 as movenet,T2 as util};
