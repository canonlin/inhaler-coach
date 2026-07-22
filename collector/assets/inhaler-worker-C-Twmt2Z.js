/*!
 * ONNX Runtime Web v1.27.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var Ra=Object.defineProperty,Ig=Object.getOwnPropertyDescriptor,Eg=Object.getOwnPropertyNames,zg=Object.prototype.hasOwnProperty,Cg=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),P=(e,t)=>()=>(e&&(t=e(e=0)),t),Vt=(e,t)=>{for(var r in t)Ra(e,r,{get:t[r],enumerable:!0})},Ag=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Eg(t))!zg.call(e,a)&&a!==r&&Ra(e,a,{get:()=>t[a],enumerable:!(i=Ig(t,a))||i.enumerable});return e},dr=e=>Ag(Ra({},"__esModule",{value:!0}),e),Kt,ht,Pt,to,Md,Dd=P(()=>{Kt=new Map,ht=[],Pt=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=Kt.get(e);if(i===void 0)Kt.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let a=ht.indexOf(e);a!==-1&&ht.splice(a,1);for(let s=0;s<ht.length;s++)if(Kt.get(ht[s]).priority<=r){ht.splice(s,0,e);return}ht.push(e)}return}throw new TypeError("not a valid backend")},to=async e=>{let t=Kt.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},Md=async e=>{let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),i=r.length===0?ht:r,a,s=[],n=new Set;for(let l of i){let p=await to(l);typeof p=="string"?s.push({name:l,err:p}):(a||(a=p),a===p&&n.add(l))}if(!a)throw new Error(`no available backend found. ERR: ${s.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:p}of s)r.includes(l)&&console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${p}`);let u=t.filter(l=>n.has(typeof l=="string"?l:l.name));return[a,new Proxy(e,{get:(l,p)=>p==="executionProviders"?u:Reflect.get(l,p)})]}}),Og=P(()=>{Dd()}),Ud,Rg=P(()=>{Ud="1.27.0"}),$i,Ee,Pd=P(()=>{Rg(),$i="warning",Ee={wasm:{},webgl:{},webgpu:{},versions:{common:Ud},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);$i=e}},get logLevel(){return $i}},Object.defineProperty(Ee,"logLevel",{enumerable:!0})}),ye,Bg=P(()=>{Pd(),ye=Ee}),qd,Ld,Ng=P(()=>{qd=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let a,s;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],s=e.dims[3]):(a=e.dims[3],s=e.dims[2]);let n=t?.format!==void 0?t.format:"RGB",u=t?.norm,l,p;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?p=[0,0,0,0]:typeof u.bias=="number"?p=[u.bias,u.bias,u.bias,u.bias]:(p=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(p[3]=u.bias[3]));let f=s*a,h=0,g=f,y=f*2,_=-1;n==="RGBA"?(h=0,g=f,y=f*2,_=f*3):n==="RGB"?(h=0,g=f,y=f*2):n==="RBG"&&(h=0,y=f,g=f*2);for(let $=0;$<s;$++)for(let k=0;k<a;k++){let x=(e.data[h++]-p[0])*l[0],b=(e.data[g++]-p[1])*l[1],I=(e.data[y++]-p[2])*l[2],S=_===-1?255:(e.data[_++]-p[3])*l[3];i.fillStyle="rgba("+x+","+b+","+I+","+S+")",i.fillRect(k,$,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Ld=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let a,s,n;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],s=e.dims[1],n=e.dims[3]):(a=e.dims[3],s=e.dims[2],n=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t?.norm,p,f;l===void 0||l.mean===void 0?p=[255,255,255,255]:typeof l.mean=="number"?p=[l.mean,l.mean,l.mean,l.mean]:(p=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(p[3]=l.mean[3])),l===void 0||l.bias===void 0?f=[0,0,0,0]:typeof l.bias=="number"?f=[l.bias,l.bias,l.bias,l.bias]:(f=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(f[3]=l.bias[3]));let h=s*a;if(t!==void 0&&(t.format!==void 0&&n===4&&t.format!=="RGBA"||n===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let g=4,y=0,_=1,$=2,k=3,x=0,b=h,I=h*2,S=-1;u==="RGBA"?(x=0,b=h,I=h*2,S=h*3):u==="RGB"?(x=0,b=h,I=h*2):u==="RBG"&&(x=0,I=h,b=h*2),i=r.createImageData(a,s);for(let E=0;E<s*a;y+=g,_+=g,$+=g,k+=g,E++)i.data[y]=(e.data[x++]-f[0])*p[0],i.data[_]=(e.data[b++]-f[1])*p[1],i.data[$]=(e.data[I++]-f[2])*p[2],i.data[k]=S===-1?255:(e.data[S++]-f[3])*p[3]}else throw new Error("Can not access image data");return i}}),kr,Wd,Vd,Gd,Hd,Fd,Mg=P(()=>{Ba(),kr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,a=t.norm??{mean:255,bias:0},s,n;typeof a.mean=="number"?s=[a.mean,a.mean,a.mean,a.mean]:s=[a.mean[0],a.mean[1],a.mean[2],a.mean[3]??255],typeof a.bias=="number"?n=[a.bias,a.bias,a.bias,a.bias]:n=[a.bias[0],a.bias[1],a.bias[2],a.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",p=r*i,f=l==="RGBA"?new Float32Array(p*4):new Float32Array(p*3),h=4,g=0,y=1,_=2,$=3,k=0,x=p,b=p*2,I=-1;u==="RGB"&&(h=3,g=0,y=1,_=2,$=-1),l==="RGBA"?I=p*3:l==="RBG"?(k=0,b=p,x=p*2):l==="BGR"&&(b=0,x=p,k=p*2);for(let S=0;S<p;S++,g+=h,_+=h,y+=h,$+=h)f[k++]=(e[g]+n[0])/s[0],f[x++]=(e[y]+n[1])/s[1],f[b++]=(e[_]+n[2])/s[2],I!==-1&&$!==-1&&(f[I++]=(e[$]+n[3])/s[3]);return l==="RGBA"?new De("float32",f,[1,4,r,i]):new De("float32",f,[1,3,r,i])},Wd=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,a=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,s=typeof e=="string",n,u=t??{},l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},p=f=>typeof HTMLCanvasElement<"u"&&f instanceof HTMLCanvasElement||f instanceof OffscreenCanvas?f.getContext("2d"):null;if(r){let f=l();f.width=e.width,f.height=e.height;let h=p(f);if(h!=null){let g=e.height,y=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(g=t.resizedHeight,y=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=g,u.width=y}else u.tensorFormat="RGBA",u.height=g,u.width=y;h.drawImage(e,0,0),n=h.getImageData(0,0,y,g).data}else throw new Error("Can not access image data")}else if(i){let f,h;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(f=t.resizedHeight,h=t.resizedWidth):(f=e.height,h=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=f,u.width=h,t!==void 0){let g=l();g.width=h,g.height=f;let y=p(g);if(y!=null)y.putImageData(e,0,0),n=y.getImageData(0,0,h,f).data;else throw new Error("Can not access image data")}else n=e.data}else if(a){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let f=l();f.width=e.width,f.height=e.height;let h=p(f);if(h!=null){let g=e.height,y=e.width;return h.drawImage(e,0,0,y,g),n=h.getImageData(0,0,y,g).data,u.height=g,u.width=y,kr(n,u)}else throw new Error("Can not access image data")}else{if(s)return new Promise((f,h)=>{let g=l(),y=p(g);if(!e||!y)return h();let _=new Image;_.crossOrigin="Anonymous",_.src=e,_.onload=()=>{g.width=_.width,g.height=_.height,y.drawImage(_,0,0,g.width,g.height);let $=y.getImageData(0,0,g.width,g.height);u.height=g.height,u.width=g.width,f(kr($.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(n!==void 0)return kr(n,u);throw new Error("Input data provided is not supported - aborted tensor creation")},Vd=(e,t)=>{let{width:r,height:i,download:a,dispose:s}=t,n=[1,i,r,4];return new De({location:"texture",type:"float32",texture:e,dims:n,download:a,dispose:s})},Gd=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:s}=t;return new De({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:a,dispose:s})},Hd=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:s}=t;return new De({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:a,dispose:s})},Fd=(e,t,r)=>new De({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),Tt,ar,wi,jd,Dg=P(()=>{Tt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),ar=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),wi=!1,jd=()=>{if(!wi){wi=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(Tt.set("int64",BigInt64Array),ar.set(BigInt64Array,"int64")),t&&(Tt.set("uint64",BigUint64Array),ar.set(BigUint64Array,"uint64")),i?(Tt.set("float16",r),ar.set(r,"float16")):Tt.set("float16",Uint16Array)}}}),Kd,Zd,Ug=P(()=>{Ba(),Kd=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},Zd=(e,t)=>{switch(e.location){case"cpu":return new De(e.type,e.data,t);case"cpu-pinned":return new De({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new De({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new De({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new De({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),De,Ba=P(()=>{Ng(),Mg(),Dg(),Ug(),De=class{constructor(e,t,r){jd();let i,a;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,a=e.dims,e.location){case"cpu-pinned":{let n=Tt.get(i);if(!n)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof n))throw new TypeError(`buffer should be of type ${n.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let n,u;if(typeof e=="string")if(i=e,u=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");n=t}else{let l=Tt.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);e==="uint64"||e==="int64"?n=l.from(t,BigInt):n=l.from(t)}else if(t instanceof l)n=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")n=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&l!==Uint16Array)n=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${l}`)}else if(u=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")i="string",n=e;else if(l==="boolean")i="bool",n=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",n=Uint8Array.from(e);else{let l=ar.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=l,n=e}if(u===void 0)u=[n.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");a=u,this.cpuData=n,this.dataLocation="cpu"}let s=Kd(a);if(this.cpuData&&s!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(s/2)===this.cpuData.length))throw new Error(`Tensor's size(${s}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=a,this.size=s}static async fromImage(e,t){return Wd(e,t)}static fromTexture(e,t){return Vd(e,t)}static fromGpuBuffer(e,t){return Gd(e,t)}static fromMLTensor(e,t){return Hd(e,t)}static fromPinnedBuffer(e,t,r){return Fd(e,t,r)}toDataURL(e){return qd(this,e)}toImageData(e){return Ld(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return Zd(this,e)}}}),Ze,Xd=P(()=>{Ba(),Ze=De}),Lr,vi,rt,Xe,zt,Ct,Qd=P(()=>{Pd(),Lr=(e,t)=>{(typeof Ee.trace>"u"?!Ee.wasm.trace:!Ee.trace)||console.timeStamp(`${e}::ORT::${t}`)},vi=(e,t)=>{let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],i=!1;for(let a=0;a<r.length;a++){if(i&&!r[a].includes("TRACE_FUNC")){let s=`FUNC_${e}::${r[a].trim().split(" ")[1]}`;t&&(s+=`::${t}`),Lr("CPU",s);return}r[a].includes("TRACE_FUNC")&&(i=!0)}},rt=e=>{(typeof Ee.trace>"u"?!Ee.wasm.trace:!Ee.trace)||vi("BEGIN",e)},Xe=e=>{(typeof Ee.trace>"u"?!Ee.wasm.trace:!Ee.trace)||vi("END",e)},zt=e=>{(typeof Ee.trace>"u"?!Ee.wasm.trace:!Ee.trace)||console.time(`ORT::${e}`)},Ct=e=>{(typeof Ee.trace>"u"?!Ee.wasm.trace:!Ee.trace)||console.timeEnd(`ORT::${e}`)}}),Yd,Pg=P(()=>{Dd(),Xd(),Qd(),Yd=class Jd{constructor(t){this.handler=t}async run(t,r,i){rt(),zt("InferenceSession.run");let a={},s={};if(typeof t!="object"||t===null||t instanceof Ze||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let n=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof Ze)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");n=!1;for(let p of r){if(typeof p!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(p)===-1)throw new RangeError(`'fetches' contains invalid output name: ${p}.`);a[p]=null}if(typeof i=="object"&&i!==null)s=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let p=!1,f=Object.getOwnPropertyNames(r);for(let h of this.outputNames)if(f.indexOf(h)!==-1){let g=r[h];(g===null||g instanceof Ze)&&(p=!0,n=!1,a[h]=g)}if(p){if(typeof i=="object"&&i!==null)s=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else s=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let p of this.inputNames)if(typeof t[p]>"u")throw new Error(`input '${p}' is missing in 'feeds'.`);if(n)for(let p of this.outputNames)a[p]=null;let u=await this.handler.run(t,a,s),l={};for(let p in u)if(Object.hasOwnProperty.call(u,p)){let f=u[p];f instanceof Ze?l[p]=f:l[p]=new Ze(f.type,f.data,f.dims)}return Ct("InferenceSession.run"),Xe(),l}async release(){return this.handler.dispose()}static async create(t,r,i,a){rt(),zt("InferenceSession.create");let s,n={};if(typeof t=="string"){if(s=t,typeof r=="object"&&r!==null)n=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(s=t,typeof r=="object"&&r!==null)n=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let f=t,h=0,g=t.byteLength;if(typeof r=="object"&&r!==null)n=r;else if(typeof r=="number"){if(h=r,!Number.isSafeInteger(h))throw new RangeError("'byteOffset' must be an integer.");if(h<0||h>=f.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${f.byteLength}).`);if(g=t.byteLength-h,typeof i=="number"){if(g=i,!Number.isSafeInteger(g))throw new RangeError("'byteLength' must be an integer.");if(g<=0||h+g>f.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${f.byteLength-h}].`);if(typeof a=="object"&&a!==null)n=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");s=new Uint8Array(f,h,g)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,l]=await Md(n),p=await u.createInferenceSessionHandler(s,l);return Ct("InferenceSession.create"),Xe(),new Jd(p)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Na,qg=P(()=>{Pg(),Na=Yd}),Lg=P(()=>{}),Wg=P(()=>{}),Vg=P(()=>{}),Gg=P(()=>{}),Hg={};Vt(Hg,{InferenceSession:()=>Na,TRACE:()=>Lr,TRACE_EVENT_BEGIN:()=>zt,TRACE_EVENT_END:()=>Ct,TRACE_FUNC_BEGIN:()=>rt,TRACE_FUNC_END:()=>Xe,Tensor:()=>Ze,env:()=>ye,registerBackend:()=>Pt});var Le=P(()=>{Og(),Bg(),qg(),Xd(),Lg(),Wg(),Qd(),Vg(),Gg()}),Ma=P(()=>{}),ep={};Vt(ep,{default:()=>tp});var xi,Si,tp,Fg=P(()=>{of(),Bt(),Da(),xi="ort-wasm-proxy-worker",Si=globalThis.self?.name===xi,Si&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-wasm":Ua(r.wasm).then(()=>{tn(r).then(()=>{postMessage({type:t})},i=>{postMessage({type:t,err:i})})},i=>{postMessage({type:t,err:i})});break;case"init-ep":{let{epName:i,env:a}=r;rn(a,i).then(()=>{postMessage({type:t})},s=>{postMessage({type:t,err:s})});break}case"copy-from":{let{buffer:i}=r,a=Kr(i);postMessage({type:t,out:a});break}case"create":{let{model:i,options:a}=r;an(i,a).then(s=>{postMessage({type:t,out:s})},s=>{postMessage({type:t,err:s})});break}case"release":nn(r),postMessage({type:t});break;case"run":{let{sessionId:i,inputIndices:a,inputs:s,outputIndices:n,options:u}=r;sn(i,a,s,n,new Array(n.length).fill(null),u).then(l=>{l.some(p=>p[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:l},un([...s,...l]))},l=>{postMessage({type:t,err:l})});break}case"end-profiling":on(r),postMessage({type:t});break;default:}}catch(i){postMessage({type:t,err:i})}}),tp=Si?null:e=>new Worker(e??Me,{type:"module",name:xi})}),rp={};Vt(rp,{default:()=>ip});async function ro(e={}){var t=e,r=!!globalThis.window,i=!!globalThis.WorkerGlobalScope,a=i&&self.name?.startsWith("em-pthread");t.mountExternalData=(o,d)=>{o.startsWith("./")&&(o=o.substring(2)),(t.Xc||(t.Xc=new Map)).set(o,d)},t.unmountExternalData=()=>{delete t.Xc},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let s=o=>async(...d)=>{try{if(t.Yc)throw Error("Session already started");let m=t.Yc={Kd:d[0],errors:[]},c=await o(...d);if(t.Yc!==m)throw Error("Session mismatch");t.dd?.flush();let w=m.errors;if(0<w.length){let T=await Promise.all(w);if(T=T.filter(z=>z),0<T.length)throw Error(T.join(`
`))}return c}finally{t.Yc=null}};t.jsepInit=(o,d)=>{if(o==="webgpu"){[t.dd,t.Ad,t.Ed,t.ed,t.Dd,t.$b,t.Fd,t.Hd,t.Bd,t.Cd,t.Gd]=d;let m=t.dd;t.jsepRegisterBuffer=(c,w,T,z)=>m.registerBuffer(c,w,T,z),t.jsepGetBuffer=c=>m.getBuffer(c),t.jsepCreateDownloader=(c,w,T)=>m.createDownloader(c,w,T),t.jsepOnCreateSession=c=>{m.onCreateSession(c)},t.jsepOnReleaseSession=c=>{m.onReleaseSession(c)},t.jsepOnRunStart=c=>m.onRunStart(c),t.Id=(c,w)=>{m.upload(c,w)}}else if(o==="webnn"){let m=d[0];[t.Sd,t.sd,t.webnnEnsureTensor,t.td,t.webnnDownloadTensor,t.Rd,t.webnnEnableTraceEvent]=d.slice(1),t.webnnReleaseTensorId=t.sd,t.webnnUploadTensor=t.td,t.webnnRegisterMLContext=t.Rd,t.webnnOnRunStart=c=>m.onRunStart(c),t.webnnOnRunEnd=m.onRunEnd.bind(m),t.webnnOnReleaseSession=c=>{m.onReleaseSession(c)},t.webnnCreateMLTensorDownloader=(c,w)=>m.createMLTensorDownloader(c,w),t.webnnRegisterMLTensor=(c,w,T,z)=>m.registerMLTensor(c,w,T,z),t.webnnCreateMLContext=c=>m.createMLContext(c),t.webnnRegisterMLConstant=(c,w,T,z,B,L)=>m.registerMLConstant(c,w,T,z,B,t.Xc,L),t.webnnRegisterGraphInput=m.registerGraphInput.bind(m),t.webnnIsGraphInput=m.isGraphInput.bind(m),t.webnnRegisterGraphOutput=m.registerGraphOutput.bind(m),t.webnnIsGraphOutput=m.isGraphOutput.bind(m),t.webnnCreateTemporaryTensor=m.createTemporaryTensor.bind(m),t.webnnIsGraphInputOutputTypeSupported=m.isGraphInputOutputTypeSupported.bind(m)}};let n=()=>{let o=d=>(...m)=>{let c=Je;return m=d(...m),Je!=c?new Promise((w,T)=>{oi={resolve:w,reject:T}}):m};(()=>{for(let d of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])t[d]=o(t[d])})(),s!==void 0&&(t._OrtRun=s(t._OrtRun),t._OrtRunWithBinding=s(t._OrtRunWithBinding)),n=void 0};t.asyncInit=()=>{n?.()};var u,l,p=(o,d)=>{throw d},f=import.meta.url,h="";if(r||i){try{h=new URL(".",f).href}catch{}i&&(l=o=>{var d=new XMLHttpRequest;return d.open("GET",o,!1),d.responseType="arraybuffer",d.send(null),new Uint8Array(d.response)}),u=async o=>{if(C(o))return new Promise((m,c)=>{var w=new XMLHttpRequest;w.open("GET",o,!0),w.responseType="arraybuffer",w.onload=()=>{w.status==200||w.status==0&&w.response?m(w.response):c(w.status)},w.onerror=c,w.send(null)});var d=await fetch(o,{credentials:"same-origin"});if(d.ok)return d.arrayBuffer();throw Error(d.status+" : "+d.url)}}var g,y,_,$,k,x,b=console.log.bind(console),I=console.error.bind(console),S=b,E=I,A=!1,C=o=>o.startsWith("file://");function v(){lt.buffer!=q.buffer&&Y()}if(a){let o=function(d){try{var m=d.data,c=m.Sc;if(c==="load"){let w=[];self.onmessage=T=>w.push(T),x=()=>{postMessage({Sc:"loaded"});for(let T of w)o(T);self.onmessage=o};for(let T of m.xd)t[T]&&!t[T].proxy||(t[T]=(...z)=>{postMessage({Sc:"callHandler",wd:T,args:z})},T=="print"&&(S=t[T]),T=="printErr"&&(E=t[T]));lt=m.Od,Y(),y=m.Pd,Ce(),Sr()}else if(c==="run"){(function(w){var T=(v(),M)[w+52>>>2>>>0];w=(v(),M)[w+56>>>2>>>0],ps(T,T-w),oe(T)})(m.Rc),ci(m.Rc,0,0,1,0,0),cn(),ai(m.Rc),D||(ns(),D=!0);try{bf(m.Md,m.bd)}catch(w){if(w!="unwind")throw w}}else m.target!=="setimmediate"&&(c==="checkMailbox"?D&&yr():c&&(E(`worker: received unknown command ${c}`),E(m)))}catch(w){throw ss(),w}};var D=!1;self.onunhandledrejection=d=>{throw d.reason||d},self.onmessage=o}var q,Q,F,K,R,M,G,J,ee,re,ne,U=!1;function Y(){var o=lt.buffer;t.HEAP8=q=new Int8Array(o),F=new Int16Array(o),t.HEAPU8=Q=new Uint8Array(o),K=new Uint16Array(o),t.HEAP32=R=new Int32Array(o),t.HEAPU32=M=new Uint32Array(o),G=new Float32Array(o),J=new Float64Array(o),ee=new BigInt64Array(o),re=new BigUint64Array(o)}function X(){U=!0,a?x():at.sb()}function V(o){throw E(o="Aborted("+o+")"),A=!0,o=new WebAssembly.RuntimeError(o+". Build with -sASSERTIONS for more info."),k?.(o),o}function Te(){return{a:{ma:Wm,gb:Lm,g:$f,J:wf,f:vf,o:xf,h:Sf,ha:kf,b:Tf,T:If,Ha:_n,n:Ef,$:vn,Xa:xn,Da:Sn,Fa:kn,Ya:Tn,Va:In,Oa:En,Ua:zn,ka:Cn,Ea:An,Ba:On,Wa:Rn,Ca:Bn,bb:zf,ea:Cf,wa:Af,ua:Rf,da:Nf,O:Mf,H:Df,va:Uf,_:Hf,xa:Ff,Ra:jf,za:Zf,Ia:Xf,sa:Qf,fa:Yf,Qa:ai,_a:Jf,R:im,r:um,c:ri,hb:lm,y:dm,M:pm,D:cm,l:hm,s:Wn,ib:fm,I:mm,S:gm,j:ym,u:_m,q:bm,k:$m,La:wm,Ma:vm,Na:xm,Ja:Fn,Ka:jn,ta:Kn,db:km,ab:Im,v:Em,aa:zm,ga:Cm,$a:Tm,W:Am,Za:Om,Aa:Rm,F:Sm,U:Bm,la:vr,ya:Mm,fb:Nm,eb:Dm,Sa:Yn,Ta:Jn,Ga:Qr,V:es,ja:ts,Pa:rs,ia:is,kb:Sg,na:bg,lb:xg,oa:_g,G:lg,e:Fm,t:Gm,w:Vm,B:rg,mb:mg,K:sg,x:Zm,pa:gg,Y:$g,ba:fg,nb:hg,ob:cg,P:ig,qa:pg,pb:dg,N:og,Z:yg,d:Hm,A:Km,m:jm,jb:kg,p:Qm,z:Ym,C:Xm,E:Jm,L:ag,qb:ug,Q:wg,ca:ng,X:vg,rb:tg,ra:eg,i:Pm,a:lt,cb:Xr}}}async function Ce(){function o(c,w){var T=at=c.exports;c={};for(let[z,B]of Object.entries(T))typeof B=="function"?(T=em(B),c[z]=T):c[z]=B;return at=c,at=function(){var z=at,B=W=>se=>W(se)>>>0,L=W=>()=>W()>>>0;return(z=Object.assign({},z)).tb=B(z.tb),z.Xb=L(z.Xb),z.Zb=B(z.Zb),z.lc=B(z.lc),z.mc=L(z.mc),z.qc=B(z.qc),z}(),dn.push(at._b),as=(c=at).tb,ns=c.ub,t._OrtInit=c.vb,t._OrtGetLastError=c.wb,t._OrtCreateSessionOptions=c.xb,t._OrtAppendExecutionProvider=c.yb,t._OrtAddFreeDimensionOverride=c.zb,t._OrtAddSessionConfigEntry=c.Ab,t._OrtReleaseSessionOptions=c.Bb,t._OrtCreateSession=c.Cb,t._OrtReleaseSession=c.Db,t._OrtGetInputOutputCount=c.Eb,t._OrtGetInputOutputMetadata=c.Fb,t._OrtFree=c.Gb,t._OrtCreateTensor=c.Hb,t._OrtGetTensorData=c.Ib,t._OrtReleaseTensor=c.Jb,t._OrtCreateRunOptions=c.Kb,t._OrtAddRunConfigEntry=c.Lb,t._OrtReleaseRunOptions=c.Mb,t._OrtCreateBinding=c.Nb,t._OrtBindInput=c.Ob,t._OrtBindOutput=c.Pb,t._OrtClearBoundOutputs=c.Qb,t._OrtReleaseBinding=c.Rb,t._OrtRunWithBinding=c.Sb,t._OrtRun=c.Tb,t._OrtEndProfiling=c.Ub,t._JsepOutput=c.Vb,t._JsepGetNodeName=c.Wb,xr=c.Xb,et=t._free=c.Yb,Ft=t._malloc=c.Zb,ci=c.ac,ss=c.bc,os=c.cc,us=c.dc,hi=c.ec,ls=c.fc,ds=c.gc,le=c.hc,jt=c.ic,ps=c.jc,oe=c.kc,fi=c.lc,ue=c.mc,cs=c.nc,mi=c.oc,hs=c.pc,fs=c.qc,ms=c.rc,gi=c.sc,gs=c.tc,ys=c.uc,_s=c.vc,bs=c.wc,$s=c.xc,ws=c.yc,vs=c.zc,xs=c.Ac,Ss=c.Bc,ks=c.Cc,Ts=c.Dc,Is=c.Ec,Es=c.Fc,zs=c.Gc,Cs=c.Hc,As=c.Ic,Os=c.Jc,Rs=c.Kc,Bs=c.Lc,Ns=c.Mc,Ms=c.Nc,Ds=c.Pc,Us=c.Qc,Ps=c.$c,qs=c.ad,Ls=c.fd,Ws=c.jd,Vs=c.kd,Gs=c.ld,Hs=c.md,Fs=c.nd,js=c.od,Ks=c.pd,Zs=c.qd,Xs=c.vd,Qs=c.Td,Ys=c.Ud,Js=c.Vd,eo=c.Wd,y=w,at}var d,m=Te();return t.instantiateWasm?new Promise(c=>{t.instantiateWasm(m,(w,T)=>{c(o(w,T))})}):a?o(new WebAssembly.Instance(y,Te()),y):(ne??=t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.jsep.wasm",h):h+"ort-wasm-simd-threaded.jsep.wasm":new URL("/inhaler-coach/collector/assets/ort-wasm-simd-threaded.jsep-DC5y_g6C.wasm",import.meta.url).href,d=await async function(c){var w=ne;if(!g&&!C(w))try{var T=fetch(w,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(T,c)}catch(z){E(`wasm streaming compile failed: ${z}`),E("falling back to ArrayBuffer instantiation")}return async function(z,B){try{var L=await async function(W){if(!g)try{var se=await u(W);return new Uint8Array(se)}catch{}if(W==ne&&g)W=new Uint8Array(g);else{if(!l)throw"both async and sync fetching of the wasm failed";W=l(W)}return W}(z);return await WebAssembly.instantiate(L,B)}catch(W){E(`failed to asynchronously prepare wasm: ${W}`),V(W)}}(w,c)}(m),o(d.instance,d.module))}class we{name="ExitStatus";constructor(d){this.message=`Program terminated with exit(${d})`,this.status=d}}var Ae=o=>{o.terminate(),o.onmessage=()=>{}},me=[],$e=0,Be=null,cr=o=>{ut.length==0&&(fn(),hn(ut[0]));var d=ut.pop();if(!d)return 6;Gt.push(d),_t[o.Rc]=d,d.Rc=o.Rc;var m={Sc:"run",Md:o.Ld,bd:o.bd,Rc:o.Rc};return d.postMessage(m,o.rd),0},Qe=0,ve=(o,d,...m)=>{var c,w=16*m.length,T=ue(),z=fi(w),B=z>>>3;for(c of m)typeof c=="bigint"?((v(),ee)[B++>>>0]=1n,(v(),ee)[B++>>>0]=c):((v(),ee)[B++>>>0]=0n,(v(),J)[B++>>>0]=c);return o=os(o,0,w,z,d),oe(T),o};function Xr(o){if(a)return ve(0,1,o);if(_=o,!(0<Qe)){for(var d of Gt)Ae(d);for(d of ut)Ae(d);ut=[],Gt=[],_t={},A=!0}p(0,new we(o))}function ln(o){if(a)return ve(1,0,o);Qr(o)}var Qr=o=>{if(_=o,a)throw ln(o),"unwind";Xr(o)},ut=[],Gt=[],dn=[],_t={},pn=o=>{var d=o.Rc;delete _t[d],ut.push(o),Gt.splice(Gt.indexOf(o),1),o.Rc=0,us(d)};function cn(){dn.forEach(o=>o())}var hn=o=>new Promise(d=>{o.onmessage=w=>{var T=w.data;if(w=T.Sc,T.Zc&&T.Zc!=xr()){var z=_t[T.Zc];z?z.postMessage(T,T.rd):E(`Internal error! Worker sent a message "${w}" to target pthread ${T.Zc}, but that thread no longer exists!`)}else w==="checkMailbox"?yr():w==="spawnThread"?cr(T):w==="cleanupThread"?gr(()=>{pn(_t[T.Nd])}):w==="loaded"?(o.loaded=!0,d(o)):T.target==="setimmediate"?o.postMessage(T):w==="uncaughtException"?o.onerror(T.error):w==="callHandler"?t[T.wd](...T.args):w&&E(`worker sent an unknown command ${w}`)},o.onerror=w=>{throw E(`worker sent an error! ${w.filename}:${w.lineno}: ${w.message}`),w};var m,c=[];for(m of[])t.propertyIsEnumerable(m)&&c.push(m);o.postMessage({Sc:"load",xd:c,Od:lt,Pd:y})});function fn(){var o=new Worker((()=>{let d=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new d("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});ut.push(o)}var lt,bf=(o,d)=>{Qe=0,o=gi(o,d),0<Qe?_=o:hi(o)},hr=[],fr=0;function $f(o){var d=new Yr(o>>>=0);return(v(),q)[d.Tc+12>>>0]==0&&(mn(d,!0),fr--),gn(d,!1),hr.push(d),fs(o)}var Mt=0,wf=()=>{le(0,0);var o=hr.pop();cs(o.cd),Mt=0};function mn(o,d){d=d?1:0,(v(),q)[o.Tc+12>>>0]=d}function gn(o,d){d=d?1:0,(v(),q)[o.Tc+13>>>0]=d}class Yr{constructor(d){this.cd=d,this.Tc=d-24}}var Jr=o=>{var d=Mt;if(!d)return jt(0),0;var m=new Yr(d);(v(),M)[m.Tc+16>>>2>>>0]=d;var c=(v(),M)[m.Tc+4>>>2>>>0];if(!c)return jt(0),d;for(var w of o){if(w===0||w===c)break;if(hs(w,c,m.Tc+16))return jt(w),d}return jt(c),d};function vf(){return Jr([])}function xf(o){return Jr([o>>>0])}function Sf(o,d,m,c){return Jr([o>>>0,d>>>0,m>>>0,c>>>0])}var kf=()=>{var o=hr.pop();o||V("no exception to throw");var d=o.cd;throw(v(),q)[o.Tc+13>>>0]==0&&(hr.push(o),gn(o,!0),mn(o,!1),fr++),mi(d),Mt=d};function Tf(o,d,m){var c=new Yr(o>>>=0);throw d>>>=0,m>>>=0,(v(),M)[c.Tc+16>>>2>>>0]=0,(v(),M)[c.Tc+4>>>2>>>0]=d,(v(),M)[c.Tc+8>>>2>>>0]=m,mi(o),fr++,Mt=o}var If=()=>fr;function yn(o,d,m,c){return a?ve(2,1,o,d,m,c):_n(o,d,m,c)}function _n(o,d,m,c){if(o>>>=0,d>>>=0,m>>>=0,c>>>=0,!globalThis.SharedArrayBuffer)return 6;var w=[];return a&&w.length===0?yn(o,d,m,c):(o={Ld:m,Rc:o,bd:c,rd:w},a?(o.Sc="spawnThread",postMessage(o,w),0):cr(o))}function Ef(o){throw Mt||=o>>>0,Mt}var bn=globalThis.TextDecoder&&new TextDecoder,$n=(o,d,m,c)=>{if(m=d+m,c)return m;for(;o[d]&&!(d>=m);)++d;return d},wn=(o,d=0,m,c)=>{if(16<(m=$n(o,d>>>=0,m,c))-d&&o.buffer&&bn)return bn.decode(o.buffer instanceof ArrayBuffer?o.subarray(d,m):o.slice(d,m));for(c="";d<m;){var w=o[d++];if(128&w){var T=63&o[d++];if((224&w)==192)c+=String.fromCharCode((31&w)<<6|T);else{var z=63&o[d++];65536>(w=(240&w)==224?(15&w)<<12|T<<6|z:(7&w)<<18|T<<12|z<<6|63&o[d++])?c+=String.fromCharCode(w):(w-=65536,c+=String.fromCharCode(55296|w>>10,56320|1023&w))}}else c+=String.fromCharCode(w)}return c},ke=(o,d,m)=>(o>>>=0)?wn((v(),Q),o,d,m):"";function vn(o,d,m){return a?ve(3,1,o,d,m):0}function xn(o,d){if(a)return ve(4,1,o,d)}function Sn(o,d){if(a)return ve(5,1,o,d)}function kn(o,d,m){if(a)return ve(6,1,o,d,m)}function Tn(o,d,m){return a?ve(7,1,o,d,m):0}function In(o,d){if(a)return ve(8,1,o,d)}function En(o,d,m){if(a)return ve(9,1,o,d,m)}function zn(o,d,m,c){if(a)return ve(10,1,o,d,m,c)}function Cn(o,d,m,c){if(a)return ve(11,1,o,d,m,c)}function An(o,d,m,c){if(a)return ve(12,1,o,d,m,c)}function On(o){if(a)return ve(13,1,o)}function Rn(o,d){if(a)return ve(14,1,o,d)}function Bn(o,d,m){if(a)return ve(15,1,o,d,m)}var zf=()=>V(""),Ye=o=>{o>>>=0;for(var d="";;){var m=(v(),Q)[o++>>>0];if(!m)return d;d+=String.fromCharCode(m)}},ei={},ti={},Dt=class extends Error{constructor(o){super(o),this.name="BindingError"}};function it(o,d,m={}){return function(c,w,T={}){var z=w.name;if(!c)throw new Dt(`type "${z}" must have a positive integer typeid pointer`);if(ti.hasOwnProperty(c)){if(T.yd)return;throw new Dt(`Cannot register type '${z}' twice`)}ti[c]=w,ei.hasOwnProperty(c)&&(w=ei[c],delete ei[c],w.forEach(B=>B()))}(o,d,m)}var Nn=(o,d,m)=>{switch(d){case 1:return m?c=>(v(),q)[c>>>0]:c=>(v(),Q)[c>>>0];case 2:return m?c=>(v(),F)[c>>>1>>>0]:c=>(v(),K)[c>>>1>>>0];case 4:return m?c=>(v(),R)[c>>>2>>>0]:c=>(v(),M)[c>>>2>>>0];case 8:return m?c=>(v(),ee)[c>>>3>>>0]:c=>(v(),re)[c>>>3>>>0];default:throw new TypeError(`invalid integer width (${d}): ${o}`)}};function Cf(o,d,m,c,w){o>>>=0,m>>>=0,d=Ye(d>>>0);let T=z=>z;if(c=c===0n){let z=8*m;T=B=>BigInt.asUintN(z,B),w=T(w)}it(o,{name:d,Oc:T,Vc:(z,B)=>(typeof B=="number"&&(B=BigInt(B)),B),Uc:Nn(d,m,!c),Wc:null})}function Af(o,d,m,c){it(o>>>=0,{name:d=Ye(d>>>0),Oc:function(w){return!!w},Vc:function(w,T){return T?m:c},Uc:function(w){return this.Oc((v(),Q)[w>>>0])},Wc:null})}var Mn=[],bt=[0,1,,1,null,1,!0,1,!1,1];function ri(o){9<(o>>>=0)&&--bt[o+1]===0&&(bt[o]=void 0,Mn.push(o))}var Pe=o=>{if(!o)throw new Dt(`Cannot use deleted val. handle = ${o}`);return bt[o]},We=o=>{switch(o){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let d=Mn.pop()||bt.length;return bt[d]=o,bt[d+1]=1,d}};function ii(o){return this.Oc((v(),M)[o>>>2>>>0])}var Of={name:"emscripten::val",Oc:o=>{var d=Pe(o);return ri(o),d},Vc:(o,d)=>We(d),Uc:ii,Wc:null};function Rf(o){return it(o>>>0,Of)}var Bf=(o,d)=>{switch(d){case 4:return function(m){return this.Oc((v(),G)[m>>>2>>>0])};case 8:return function(m){return this.Oc((v(),J)[m>>>3>>>0])};default:throw new TypeError(`invalid float width (${d}): ${o}`)}};function Nf(o,d,m){m>>>=0,it(o>>>=0,{name:d=Ye(d>>>0),Oc:c=>c,Vc:(c,w)=>w,Uc:Bf(d,m),Wc:null})}function Mf(o,d,m,c,w){o>>>=0,m>>>=0,d=Ye(d>>>0);let T=B=>B;if(c===0){var z=32-8*m;T=B=>B<<z>>>z,w=T(w)}it(o,{name:d,Oc:T,Vc:(B,L)=>L,Uc:Nn(d,m,c!==0),Wc:null})}function Df(o,d,m){function c(T){var z=(v(),M)[T>>>2>>>0];return T=(v(),M)[T+4>>>2>>>0],new w((v(),q).buffer,T,z)}var w=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][d];it(o>>>=0,{name:m=Ye(m>>>0),Oc:c,Uc:c},{yd:!0})}var dt=(o,d,m)=>{var c=(v(),Q);if(d>>>=0,0<m){var w=d;m=d+m-1;for(var T=0;T<o.length;++T){var z=o.codePointAt(T);if(127>=z){if(d>=m)break;c[d++>>>0]=z}else if(2047>=z){if(d+1>=m)break;c[d++>>>0]=192|z>>6,c[d++>>>0]=128|63&z}else if(65535>=z){if(d+2>=m)break;c[d++>>>0]=224|z>>12,c[d++>>>0]=128|z>>6&63,c[d++>>>0]=128|63&z}else{if(d+3>=m)break;c[d++>>>0]=240|z>>18,c[d++>>>0]=128|z>>12&63,c[d++>>>0]=128|z>>6&63,c[d++>>>0]=128|63&z,T++}}c[d>>>0]=0,o=d-w}else o=0;return o},mr=o=>{for(var d=0,m=0;m<o.length;++m){var c=o.charCodeAt(m);127>=c?d++:2047>=c?d+=2:55296<=c&&57343>=c?(d+=4,++m):d+=3}return d};function Uf(o,d){it(o>>>=0,{name:d=Ye(d>>>0),Oc(m){var c=(v(),M)[m>>>2>>>0];return c=ke(m+4,c,!0),et(m),c},Vc(m,c){c instanceof ArrayBuffer&&(c=new Uint8Array(c));var w=typeof c=="string";if(!(w||ArrayBuffer.isView(c)&&c.BYTES_PER_ELEMENT==1))throw new Dt("Cannot pass non-string to std::string");var T=w?mr(c):c.length,z=Ft(4+T+1),B=z+4;return(v(),M)[z>>>2>>>0]=T,w?dt(c,B,T+1):(v(),Q).set(c,B>>>0),m!==null&&m.push(et,z),z},Uc:ii,Wc(m){et(m)}})}var Dn=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,Pf=(o,d,m)=>{if(o>>>=1,16<(d=$n((v(),K),o,d/2,m))-o&&Dn)return Dn.decode((v(),K).slice(o,d));for(m="";o<d;++o){var c=(v(),K)[o>>>0];m+=String.fromCharCode(c)}return m},qf=(o,d,m)=>{if(m??=2147483647,2>m)return 0;var c=d;m=(m-=2)<2*o.length?m/2:o.length;for(var w=0;w<m;++w){var T=o.charCodeAt(w);(v(),F)[d>>>1>>>0]=T,d+=2}return(v(),F)[d>>>1>>>0]=0,d-c},Lf=o=>2*o.length,Wf=(o,d,m)=>{var c="";o>>>=2;for(var w=0;!(w>=d/4);w++){var T=(v(),M)[o+w>>>0];if(!T&&!m)break;c+=String.fromCodePoint(T)}return c},Vf=(o,d,m)=>{if(d>>>=0,m??=2147483647,4>m)return 0;var c=d;m=c+m-4;for(var w=0;w<o.length;++w){var T=o.codePointAt(w);if(65535<T&&w++,(v(),R)[d>>>2>>>0]=T,(d+=4)+4>m)break}return(v(),R)[d>>>2>>>0]=0,d-c},Gf=o=>{for(var d=0,m=0;m<o.length;++m)65535<o.codePointAt(m)&&m++,d+=4;return d};function Hf(o,d,m){if(o>>>=0,d>>>=0,m=Ye(m>>>=0),d===2)var c=Pf,w=qf,T=Lf;else c=Wf,w=Vf,T=Gf;it(o,{name:m,Oc:z=>{var B=(v(),M)[z>>>2>>>0];return B=c(z+4,B*d,!0),et(z),B},Vc:(z,B)=>{if(typeof B!="string")throw new Dt(`Cannot pass non-string to C++ string type ${m}`);var L=T(B),W=Ft(4+L+d);return(v(),M)[W>>>2>>>0]=L/d,w(B,W+4,L+d),z!==null&&z.push(et,W),W},Uc:ii,Wc(z){et(z)}})}function Ff(o,d){it(o>>>=0,{zd:!0,name:d=Ye(d>>>0),Oc:()=>{},Vc:()=>{}})}function jf(o){ci(o>>>0,!i,1,!r,131072,!1),cn()}var gr=o=>{if(!A)try{if(o(),!(0<Qe))try{a?xr()&&hi(_):Qr(_)}catch(d){d instanceof we||d=="unwind"||p(0,d)}}catch(d){d instanceof we||d=="unwind"||p(0,d)}},Kf=!Atomics.waitAsync||globalThis.navigator?.userAgent&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function ai(o){o>>>=0,Kf||(Atomics.waitAsync((v(),R),o>>>2,o).value.then(yr),o+=128,Atomics.store((v(),R),o>>>2,1))}var yr=()=>gr(()=>{var o=xr();o&&(ai(o),ds())});function Zf(o,d){(o>>>=0)==d>>>0?setTimeout(yr):a?postMessage({Zc:o,Sc:"checkMailbox"}):(o=_t[o])&&o.postMessage({Sc:"checkMailbox"})}var ni=[];function Xf(o,d,m,c,w){for(d>>>=0,w>>>=0,ni.length=0,m=w>>>3,c=w+c>>>3;m<c;){var T;T=(v(),ee)[m++>>>0]?(v(),ee)[m++>>>0]:(v(),J)[m++>>>0],ni.push(T)}return(d?yi[d]:qm[o])(...ni)}var Qf=()=>{Qe=0};function Yf(o){o>>>=0,a?postMessage({Sc:"cleanupThread",Nd:o}):pn(_t[o])}function Jf(o){}var _r=o=>{try{o()}catch(d){V(d)}};function em(o){var d=(...m)=>{br.push(o);try{return o(...m)}finally{A||(br.pop(),Je&&pt===1&&br.length===0&&(pt=0,Qe+=1,_r(Ys),typeof Fibers<"u"&&Fibers.Zd()))}};return qn.set(o,d),d}var pt=0,Je=null,Un=0,br=[],si=new Map,Pn=new Map,qn=new Map,tm=0,oi=null,rm=[],Ln=o=>function(d){if(!A){if(pt===0){var m=!1,c=!1;d((w=0)=>{if(!A&&(Un=w,m=!0,c)){pt=2,_r(()=>Js(Je)),typeof MainLoop<"u"&&MainLoop.ud&&MainLoop.resume(),w=!1;try{var T=function(){var L=(v(),R)[Je+8>>>2>>>0];return L=Pn.get(L),L=qn.get(L),--Qe,L()}()}catch(L){T=L,w=!0}var z=!1;if(!Je){var B=oi;B&&(oi=null,(w?B.reject:B.resolve)(T),z=!0)}if(w&&!z)throw T}}),c=!0,m||(pt=1,Je=function(){var w=Ft(65548),T=w+12;if((v(),M)[w>>>2>>>0]=T,(v(),M)[w+4>>>2>>>0]=T+65536,T=br[0],!si.has(T)){var z=tm++;si.set(T,z),Pn.set(z,T)}return T=si.get(T),(v(),R)[w+8>>>2>>>0]=T,w}(),typeof MainLoop<"u"&&MainLoop.ud&&MainLoop.pause(),_r(()=>Qs(Je)))}else pt===2?(pt=0,_r(eo),et(Je),Je=null,rm.forEach(gr)):V(`invalid state: ${pt}`);return Un}}(d=>{o().then(d)});function im(o){return o>>>=0,Ln(async()=>{var d=await Pe(o);return We(d)})}var ui=[],am=o=>{var d=ui.length;return ui.push(o),d},nm=(o,d)=>{for(var m=Array(o),c=0;c<o;++c){var w=c,T=(v(),M)[d+4*c>>>2>>>0],z=ti[T];if(z===void 0)throw o=`parameter ${c}`,T=as(T),d=Ye(T),et(T),new Dt(`${o} has unknown type ${d}`);m[w]=z}return m},sm=(o,d,m)=>{var c=[];return o=o(c,m),c.length&&((v(),M)[d>>>2>>>0]=We(c)),o},om={},$r=o=>{var d=om[o];return d===void 0?Ye(o):d};function um(o,d,m){var[c,...w]=nm(o,d>>>0);d=c.Vc.bind(c);var T=w.map(L=>L.Uc.bind(L));o--;var z={toValue:Pe};switch(o=T.map((L,W)=>{var se=`argFromPtr${W}`;return z[se]=L,`${se}(args${W?"+"+8*W:""})`}),m){case 0:var B="toValue(handle)";break;case 2:B="new (toValue(handle))";break;case 3:B="";break;case 1:z.getStringOrSymbol=$r,B="toValue(handle)[getStringOrSymbol(methodName)]"}return B+=`(${o})`,c.zd||(z.toReturnWire=d,z.emval_returnValue=sm,B=`return emval_returnValue(toReturnWire, destructorsRef, ${B})`),B=`return function (handle, methodName, destructorsRef, args) {
  ${B}
  }`,m=new Function(Object.keys(z),B)(...Object.values(z)),B=`methodCaller<(${w.map(L=>L.name)}) => ${c.name}>`,am(Object.defineProperty(m,"name",{value:B}))}function lm(o,d){return d>>>=0,(o=Pe(o>>>0))==Pe(d)}function dm(o){return(o>>>=0)?(o=$r(o),We(globalThis[o])):We(globalThis)}function pm(o){return o=$r(o>>>0),We(t[o])}function cm(o,d){return d>>>=0,o=Pe(o>>>0),d=Pe(d),We(o[d])}function hm(o){9<(o>>>=0)&&(bt[o+1]+=1)}function Wn(o,d,m,c,w){return ui[o>>>0](d>>>0,m>>>0,c>>>0,w>>>0)}function fm(o,d,m,c,w){return Wn(o>>>0,d>>>0,m>>>0,c>>>0,w>>>0)}function mm(){return We([])}function gm(o){o=Pe(o>>>0);for(var d=Array(o.length),m=0;m<o.length;m++)d[m]=o[m];return We(d)}function ym(o){return We($r(o>>>0))}function _m(){return We({})}function bm(o){for(var d=Pe(o>>>=0);d.length;){var m=d.pop();d.pop()(m)}ri(o)}function $m(o,d,m){d>>>=0,m>>>=0,o=Pe(o>>>0),d=Pe(d),m=Pe(m),o[d]=m}function wm(o,d){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),d>>>=0,o=new Date(1e3*o),(v(),R)[d>>>2>>>0]=o.getUTCSeconds(),(v(),R)[d+4>>>2>>>0]=o.getUTCMinutes(),(v(),R)[d+8>>>2>>>0]=o.getUTCHours(),(v(),R)[d+12>>>2>>>0]=o.getUTCDate(),(v(),R)[d+16>>>2>>>0]=o.getUTCMonth(),(v(),R)[d+20>>>2>>>0]=o.getUTCFullYear()-1900,(v(),R)[d+24>>>2>>>0]=o.getUTCDay(),o=(o.getTime()-Date.UTC(o.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(v(),R)[d+28>>>2>>>0]=o}var Vn=o=>o%4==0&&(o%100!=0||o%400==0),Gn=[0,31,60,91,121,152,182,213,244,274,305,335],Hn=[0,31,59,90,120,151,181,212,243,273,304,334];function vm(o,d){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),d>>>=0,o=new Date(1e3*o),(v(),R)[d>>>2>>>0]=o.getSeconds(),(v(),R)[d+4>>>2>>>0]=o.getMinutes(),(v(),R)[d+8>>>2>>>0]=o.getHours(),(v(),R)[d+12>>>2>>>0]=o.getDate(),(v(),R)[d+16>>>2>>>0]=o.getMonth(),(v(),R)[d+20>>>2>>>0]=o.getFullYear()-1900,(v(),R)[d+24>>>2>>>0]=o.getDay();var m=(Vn(o.getFullYear())?Gn:Hn)[o.getMonth()]+o.getDate()-1|0;(v(),R)[d+28>>>2>>>0]=m,(v(),R)[d+36>>>2>>>0]=-60*o.getTimezoneOffset(),m=new Date(o.getFullYear(),6,1).getTimezoneOffset();var c=new Date(o.getFullYear(),0,1).getTimezoneOffset();o=0|(m!=c&&o.getTimezoneOffset()==Math.min(c,m)),(v(),R)[d+32>>>2>>>0]=o}function xm(o){o>>>=0;var d=new Date((v(),R)[o+20>>>2>>>0]+1900,(v(),R)[o+16>>>2>>>0],(v(),R)[o+12>>>2>>>0],(v(),R)[o+8>>>2>>>0],(v(),R)[o+4>>>2>>>0],(v(),R)[o>>>2>>>0],0),m=(v(),R)[o+32>>>2>>>0],c=d.getTimezoneOffset(),w=new Date(d.getFullYear(),6,1).getTimezoneOffset(),T=new Date(d.getFullYear(),0,1).getTimezoneOffset(),z=Math.min(T,w);return 0>m?(v(),R)[o+32>>>2>>>0]=+(w!=T&&z==c):0<m!=(z==c)&&(w=Math.max(T,w),d.setTime(d.getTime()+6e4*((0<m?z:w)-c))),(v(),R)[o+24>>>2>>>0]=d.getDay(),m=(Vn(d.getFullYear())?Gn:Hn)[d.getMonth()]+d.getDate()-1|0,(v(),R)[o+28>>>2>>>0]=m,(v(),R)[o>>>2>>>0]=d.getSeconds(),(v(),R)[o+4>>>2>>>0]=d.getMinutes(),(v(),R)[o+8>>>2>>>0]=d.getHours(),(v(),R)[o+12>>>2>>>0]=d.getDate(),(v(),R)[o+16>>>2>>>0]=d.getMonth(),(v(),R)[o+20>>>2>>>0]=d.getYear(),o=d.getTime(),BigInt(isNaN(o)?-1:o/1e3)}function Fn(o,d,m,c,w,T,z){return a?ve(16,1,o,d,m,c,w,T,z):-52}function jn(o,d,m,c,w,T){if(a)return ve(17,1,o,d,m,c,w,T)}var Ht={},Sm=()=>performance.timeOrigin+performance.now();function Kn(o,d){if(a)return ve(18,1,o,d);if(Ht[o]&&(clearTimeout(Ht[o].id),delete Ht[o]),!d)return 0;var m=setTimeout(()=>{delete Ht[o],gr(()=>ls(o,performance.timeOrigin+performance.now()))},d);return Ht[o]={id:m,Yd:d},0}function km(o,d,m,c){o>>>=0,d>>>=0,m>>>=0,c>>>=0;var w=new Date().getFullYear(),T=new Date(w,0,1).getTimezoneOffset();w=new Date(w,6,1).getTimezoneOffset();var z=Math.max(T,w);(v(),M)[o>>>2>>>0]=60*z,(v(),R)[d>>>2>>>0]=+(T!=w),o=(d=B=>{var L=Math.abs(B);return`UTC${0<=B?"-":"+"}${String(Math.floor(L/60)).padStart(2,"0")}${String(L%60).padStart(2,"0")}`})(T),d=d(w),w<T?(dt(o,m,17),dt(d,c,17)):(dt(o,c,17),dt(d,m,17))}var Tm=()=>Date.now();function Im(o,d,m){return m>>>=0,0<=o&&3>=o?(o===0?o=Date.now():o=performance.timeOrigin+performance.now(),o=Math.round(1e6*o),(v(),ee)[m>>>3>>>0]=BigInt(o),0):28}var li=[],Zn=(o,d)=>{li.length=0;for(var m;m=(v(),Q)[o++>>>0];){var c=m!=105;d+=(c&=m!=112)&&d%8?4:0,li.push(m==112?(v(),M)[d>>>2>>>0]:m==106?(v(),ee)[d>>>3>>>0]:m==105?(v(),R)[d>>>2>>>0]:(v(),J)[d>>>3>>>0]),d+=c?8:4}return li};function Em(o,d,m){return o>>>=0,d=Zn(d>>>0,m>>>0),yi[o](...d)}function zm(o,d,m){return o>>>=0,d=Zn(d>>>0,m>>>0),yi[o](...d)}var Cm=()=>{};function Am(o,d){return E(ke(o>>>0,d>>>0))}var Om=()=>{throw Qe+=1,"unwind"};function Rm(){return 4294901760}var Bm=()=>navigator.hardwareConcurrency,$t={},wr=o=>{var d;return(d=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(o))?+d[1]:(d=/:(\d+):\d+(?:\)|$)/.exec(o))?2147483648|+d[1]:0},Xn=o=>{for(var d of o)(o=wr(d))&&($t[o]=d)};function Nm(){var o=Error().stack.toString().split(`
`);return o[0]=="Error"&&o.shift(),Xn(o),$t.gd=wr(o[3]),$t.Jd=o,$t.gd}function vr(o){if(!(o=$t[o>>>0]))return 0;var d;if(d=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(o))o=d[1];else if(d=/^\s+at (.*) \(.*\)$/.exec(o))o=d[1];else{if(!(d=/^(.+?)@/.exec(o)))return 0;o=d[1]}et(vr.hd??0),d=mr(o)+1;var m=Ft(d);return m&&dt(o,m,d),vr.hd=m,vr.hd}function Mm(o){o>>>=0;var d=(v(),Q).length;if(o<=d||4294901760<o)return!1;for(var m=1;4>=m;m*=2){var c=d*(1+.2/m);c=Math.min(c,o+100663296);e:{c=(Math.min(4294901760,65536*Math.ceil(Math.max(o,c)/65536))-lt.buffer.byteLength+65535)/65536|0;try{lt.grow(c),Y();var w=1;break e}catch{}w=void 0}if(w)return!0}return!1}function Dm(o,d,m){if(o>>>=0,d>>>=0,$t.gd==o)var c=$t.Jd;else(c=Error().stack.toString().split(`
`))[0]=="Error"&&c.shift(),Xn(c);for(var w=3;c[w]&&wr(c[w])!=o;)++w;for(o=0;o<m&&c[o+w];++o)(v(),R)[d+4*o>>>2>>>0]=wr(c[o+w]);return o}var di,pi={},Qn=()=>{if(!di){var o,d={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(globalThis.navigator?.language??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(o in pi)pi[o]===void 0?delete d[o]:d[o]=pi[o];var m=[];for(o in d)m.push(`${o}=${d[o]}`);di=m}return di};function Yn(o,d){if(a)return ve(19,1,o,d);o>>>=0,d>>>=0;var m,c=0,w=0;for(m of Qn()){var T=d+c;(v(),M)[o+w>>>2>>>0]=T,c+=dt(m,T,1/0)+1,w+=4}return 0}function Jn(o,d){if(a)return ve(20,1,o,d);o>>>=0,d>>>=0;var m=Qn();for(var c of((v(),M)[o>>>2>>>0]=m.length,o=0,m))o+=mr(c)+1;return(v(),M)[d>>>2>>>0]=o,0}function es(o){return a?ve(21,1,o):52}function ts(o,d,m,c){return a?ve(22,1,o,d,m,c):52}function rs(o,d,m,c){return a?ve(23,1,o,d,m,c):70}var Um=[null,[],[]];function is(o,d,m,c){if(a)return ve(24,1,o,d,m,c);d>>>=0,m>>>=0,c>>>=0;for(var w=0,T=0;T<m;T++){var z=(v(),M)[d>>>2>>>0],B=(v(),M)[d+4>>>2>>>0];d+=8;for(var L=0;L<B;L++){var W=o,se=(v(),Q)[z+L>>>0],pe=Um[W];se===0||se===10?((W===1?S:E)(wn(pe)),pe.length=0):pe.push(se)}w+=B}return(v(),M)[c>>>2>>>0]=w,0}function Pm(o){return o>>>0}a||function(){for(var o=t.numThreads-1;o--;)fn();me.push(async()=>{var d=async function(){if(!a)return Promise.all(ut.map(hn))}();$e++,await d,--$e==0&&Be&&(d=Be,Be=null,d())})}(),a||(lt=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),Y()),t.wasmBinary&&(g=t.wasmBinary),t.stackSave=()=>ue(),t.stackRestore=o=>oe(o),t.stackAlloc=o=>fi(o),t.setValue=function(o,d,m="i8"){switch(m.endsWith("*")&&(m="*"),m){case"i1":case"i8":(v(),q)[o>>>0]=d;break;case"i16":(v(),F)[o>>>1>>>0]=d;break;case"i32":(v(),R)[o>>>2>>>0]=d;break;case"i64":(v(),ee)[o>>>3>>>0]=BigInt(d);break;case"float":(v(),G)[o>>>2>>>0]=d;break;case"double":(v(),J)[o>>>3>>>0]=d;break;case"*":(v(),M)[o>>>2>>>0]=d;break;default:V(`invalid type for setValue: ${m}`)}},t.getValue=function(o,d="i8"){switch(d.endsWith("*")&&(d="*"),d){case"i1":case"i8":return(v(),q)[o>>>0];case"i16":return(v(),F)[o>>>1>>>0];case"i32":return(v(),R)[o>>>2>>>0];case"i64":return(v(),ee)[o>>>3>>>0];case"float":return(v(),G)[o>>>2>>>0];case"double":return(v(),J)[o>>>3>>>0];case"*":return(v(),M)[o>>>2>>>0];default:V(`invalid type for getValue: ${d}`)}},t.UTF8ToString=ke,t.stringToUTF8=dt,t.lengthBytesUTF8=mr;var as,ns,xr,et,Ft,ci,ss,os,us,hi,ls,ds,le,jt,ps,oe,fi,ue,cs,mi,hs,fs,ms,gi,gs,ys,_s,bs,$s,ws,vs,xs,Ss,ks,Ts,Is,Es,zs,Cs,As,Os,Rs,Bs,Ns,Ms,Ds,Us,Ps,qs,Ls,Ws,Vs,Gs,Hs,Fs,js,Ks,Zs,Xs,Qs,Ys,Js,eo,at,qm=[Xr,ln,yn,vn,xn,Sn,kn,Tn,In,En,zn,Cn,An,On,Rn,Bn,Fn,jn,Kn,Yn,Jn,es,ts,rs,is],yi={1003524:(o,d,m,c,w)=>{if(t===void 0||!t.Xc)return 1;if((o=ke(Number(o>>>0))).startsWith("./")&&(o=o.substring(2)),!(o=t.Xc.get(o)))return 2;if(d=Number(d>>>0),m=Number(m>>>0),c=Number(c>>>0),d+m>o.byteLength)return 3;try{let T=o.subarray(d,d+m);switch(w){case 0:(v(),Q).set(T,c>>>0);break;case 1:t.Qd?t.Qd(c,T):t.Id(c,T);break;default:return 4}return 0}catch{return 4}},1004348:(o,d,m)=>{t.td(o,(v(),Q).subarray(d>>>0,d+m>>>0))},1004412:()=>t.Sd(),1004454:o=>{t.sd(o)},1004491:()=>{t.Bd()},1004522:()=>{t.Cd()},1004551:()=>{t.Gd()},1004576:o=>t.Ad(o),1004609:o=>t.Ed(o),1004641:(o,d,m)=>{t.ed(Number(o),Number(d),Number(m),!0)},1004704:(o,d,m)=>{t.ed(Number(o),Number(d),Number(m))},1004761:()=>typeof wasmOffsetConverter<"u",1004818:o=>{t.$b("Abs",o,void 0)},1004869:o=>{t.$b("Neg",o,void 0)},1004920:o=>{t.$b("Floor",o,void 0)},1004973:o=>{t.$b("Ceil",o,void 0)},1005025:o=>{t.$b("Reciprocal",o,void 0)},1005083:o=>{t.$b("Sqrt",o,void 0)},1005135:o=>{t.$b("Exp",o,void 0)},1005186:o=>{t.$b("Erf",o,void 0)},1005237:o=>{t.$b("Sigmoid",o,void 0)},1005292:(o,d,m)=>{t.$b("HardSigmoid",o,{alpha:d,beta:m})},1005371:o=>{t.$b("Log",o,void 0)},1005422:o=>{t.$b("Sin",o,void 0)},1005473:o=>{t.$b("Cos",o,void 0)},1005524:o=>{t.$b("Tan",o,void 0)},1005575:o=>{t.$b("Asin",o,void 0)},1005627:o=>{t.$b("Acos",o,void 0)},1005679:o=>{t.$b("Atan",o,void 0)},1005731:o=>{t.$b("Sinh",o,void 0)},1005783:o=>{t.$b("Cosh",o,void 0)},1005835:o=>{t.$b("Asinh",o,void 0)},1005888:o=>{t.$b("Acosh",o,void 0)},1005941:o=>{t.$b("Atanh",o,void 0)},1005994:o=>{t.$b("Tanh",o,void 0)},1006046:o=>{t.$b("Not",o,void 0)},1006097:(o,d,m)=>{t.$b("Clip",o,{min:d,max:m})},1006166:o=>{t.$b("Clip",o,void 0)},1006218:(o,d)=>{t.$b("Elu",o,{alpha:d})},1006276:o=>{t.$b("Gelu",o,void 0)},1006328:o=>{t.$b("Relu",o,void 0)},1006380:(o,d)=>{t.$b("LeakyRelu",o,{alpha:d})},1006444:(o,d)=>{t.$b("ThresholdedRelu",o,{alpha:d})},1006514:(o,d)=>{t.$b("Cast",o,{to:d})},1006572:o=>{t.$b("Add",o,void 0)},1006623:o=>{t.$b("Sub",o,void 0)},1006674:o=>{t.$b("Mul",o,void 0)},1006725:o=>{t.$b("Div",o,void 0)},1006776:o=>{t.$b("Pow",o,void 0)},1006827:o=>{t.$b("Equal",o,void 0)},1006880:o=>{t.$b("Greater",o,void 0)},1006935:o=>{t.$b("GreaterOrEqual",o,void 0)},1006997:o=>{t.$b("Less",o,void 0)},1007049:o=>{t.$b("LessOrEqual",o,void 0)},1007108:(o,d,m,c,w)=>{t.$b("ReduceMean",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),R).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1007283:(o,d,m,c,w)=>{t.$b("ReduceMax",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),R).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1007457:(o,d,m,c,w)=>{t.$b("ReduceMin",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),R).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1007631:(o,d,m,c,w)=>{t.$b("ReduceProd",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),R).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1007806:(o,d,m,c,w)=>{t.$b("ReduceSum",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),R).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1007980:(o,d,m,c,w)=>{t.$b("ReduceL1",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),R).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1008153:(o,d,m,c,w)=>{t.$b("ReduceL2",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),R).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1008326:(o,d,m,c,w)=>{t.$b("ReduceLogSum",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),R).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1008503:(o,d,m,c,w)=>{t.$b("ReduceSumSquare",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),R).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1008683:(o,d,m,c,w)=>{t.$b("ReduceLogSumExp",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),R).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1008863:o=>{t.$b("Where",o,void 0)},1008916:(o,d,m)=>{t.$b("Transpose",o,{perm:d?Array.from((v(),R).subarray(Number(d)>>>0,Number(m)>>>0)):[]})},1009040:(o,d,m,c)=>{t.$b("DepthToSpace",o,{blocksize:d,mode:ke(m),format:c?"NHWC":"NCHW"})},1009173:(o,d,m,c)=>{t.$b("DepthToSpace",o,{blocksize:d,mode:ke(m),format:c?"NHWC":"NCHW"})},1009306:(o,d,m,c,w,T,z,B,L,W,se,pe,ge,be,ct)=>{t.$b("ConvTranspose",o,{format:L?"NHWC":"NCHW",autoPad:d,dilations:[m],group:c,kernelShape:[w],pads:[T,z],strides:[B],wIsConst:()=>!!(v(),q)[W>>>0],outputPadding:se?Array.from((v(),R).subarray(Number(se)>>>0,Number(pe)>>>0)):[],outputShape:ge?Array.from((v(),R).subarray(Number(ge)>>>0,Number(be)>>>0)):[],activation:ke(ct)})},1009739:(o,d,m,c,w,T,z,B,L,W,se,pe,ge,be)=>{t.$b("ConvTranspose",o,{format:B?"NHWC":"NCHW",autoPad:d,dilations:Array.from((v(),R).subarray(Number(m)>>>0,(Number(m)>>>0)+2>>>0)),group:c,kernelShape:Array.from((v(),R).subarray(Number(w)>>>0,(Number(w)>>>0)+2>>>0)),pads:Array.from((v(),R).subarray(Number(T)>>>0,(Number(T)>>>0)+4>>>0)),strides:Array.from((v(),R).subarray(Number(z)>>>0,(Number(z)>>>0)+2>>>0)),wIsConst:()=>!!(v(),q)[L>>>0],outputPadding:W?Array.from((v(),R).subarray(Number(W)>>>0,Number(se)>>>0)):[],outputShape:pe?Array.from((v(),R).subarray(Number(pe)>>>0,Number(ge)>>>0)):[],activation:ke(be)})},1010400:(o,d,m,c,w,T,z,B,L,W,se,pe,ge,be,ct)=>{t.$b("ConvTranspose",o,{format:L?"NHWC":"NCHW",autoPad:d,dilations:[m],group:c,kernelShape:[w],pads:[T,z],strides:[B],wIsConst:()=>!!(v(),q)[W>>>0],outputPadding:se?Array.from((v(),R).subarray(Number(se)>>>0,Number(pe)>>>0)):[],outputShape:ge?Array.from((v(),R).subarray(Number(ge)>>>0,Number(be)>>>0)):[],activation:ke(ct)})},1010833:(o,d,m,c,w,T,z,B,L,W,se,pe,ge,be)=>{t.$b("ConvTranspose",o,{format:B?"NHWC":"NCHW",autoPad:d,dilations:Array.from((v(),R).subarray(Number(m)>>>0,(Number(m)>>>0)+2>>>0)),group:c,kernelShape:Array.from((v(),R).subarray(Number(w)>>>0,(Number(w)>>>0)+2>>>0)),pads:Array.from((v(),R).subarray(Number(T)>>>0,(Number(T)>>>0)+4>>>0)),strides:Array.from((v(),R).subarray(Number(z)>>>0,(Number(z)>>>0)+2>>>0)),wIsConst:()=>!!(v(),q)[L>>>0],outputPadding:W?Array.from((v(),R).subarray(Number(W)>>>0,Number(se)>>>0)):[],outputShape:pe?Array.from((v(),R).subarray(Number(pe)>>>0,Number(ge)>>>0)):[],activation:ke(be)})},1011494:(o,d)=>{t.$b("GlobalAveragePool",o,{format:d?"NHWC":"NCHW"})},1011585:(o,d,m,c,w,T,z,B,L,W,se,pe,ge,be)=>{t.$b("AveragePool",o,{format:be?"NHWC":"NCHW",auto_pad:d,ceil_mode:m,count_include_pad:c,storage_order:w,dilations:T?Array.from((v(),R).subarray(Number(T)>>>0,Number(z)>>>0)):[],kernel_shape:B?Array.from((v(),R).subarray(Number(B)>>>0,Number(L)>>>0)):[],pads:W?Array.from((v(),R).subarray(Number(W)>>>0,Number(se)>>>0)):[],strides:pe?Array.from((v(),R).subarray(Number(pe)>>>0,Number(ge)>>>0)):[]})},1012064:(o,d)=>{t.$b("GlobalAveragePool",o,{format:d?"NHWC":"NCHW"})},1012155:(o,d,m,c,w,T,z,B,L,W,se,pe,ge,be)=>{t.$b("AveragePool",o,{format:be?"NHWC":"NCHW",auto_pad:d,ceil_mode:m,count_include_pad:c,storage_order:w,dilations:T?Array.from((v(),R).subarray(Number(T)>>>0,Number(z)>>>0)):[],kernel_shape:B?Array.from((v(),R).subarray(Number(B)>>>0,Number(L)>>>0)):[],pads:W?Array.from((v(),R).subarray(Number(W)>>>0,Number(se)>>>0)):[],strides:pe?Array.from((v(),R).subarray(Number(pe)>>>0,Number(ge)>>>0)):[]})},1012634:(o,d)=>{t.$b("GlobalMaxPool",o,{format:d?"NHWC":"NCHW"})},1012721:(o,d,m,c,w,T,z,B,L,W,se,pe,ge,be)=>{t.$b("MaxPool",o,{format:be?"NHWC":"NCHW",auto_pad:d,ceil_mode:m,count_include_pad:c,storage_order:w,dilations:T?Array.from((v(),R).subarray(Number(T)>>>0,Number(z)>>>0)):[],kernel_shape:B?Array.from((v(),R).subarray(Number(B)>>>0,Number(L)>>>0)):[],pads:W?Array.from((v(),R).subarray(Number(W)>>>0,Number(se)>>>0)):[],strides:pe?Array.from((v(),R).subarray(Number(pe)>>>0,Number(ge)>>>0)):[]})},1013196:(o,d)=>{t.$b("GlobalMaxPool",o,{format:d?"NHWC":"NCHW"})},1013283:(o,d,m,c,w,T,z,B,L,W,se,pe,ge,be)=>{t.$b("MaxPool",o,{format:be?"NHWC":"NCHW",auto_pad:d,ceil_mode:m,count_include_pad:c,storage_order:w,dilations:T?Array.from((v(),R).subarray(Number(T)>>>0,Number(z)>>>0)):[],kernel_shape:B?Array.from((v(),R).subarray(Number(B)>>>0,Number(L)>>>0)):[],pads:W?Array.from((v(),R).subarray(Number(W)>>>0,Number(se)>>>0)):[],strides:pe?Array.from((v(),R).subarray(Number(pe)>>>0,Number(ge)>>>0)):[]})},1013758:(o,d,m,c,w)=>{t.$b("Gemm",o,{alpha:d,beta:m,transA:c,transB:w})},1013862:o=>{t.$b("MatMul",o,void 0)},1013916:(o,d,m,c)=>{t.$b("ArgMax",o,{keepDims:!!d,selectLastIndex:!!m,axis:c})},1014024:(o,d,m,c)=>{t.$b("ArgMin",o,{keepDims:!!d,selectLastIndex:!!m,axis:c})},1014132:(o,d)=>{t.$b("Softmax",o,{axis:d})},1014195:(o,d)=>{t.$b("Concat",o,{axis:d})},1014255:(o,d,m,c,w)=>{t.$b("Split",o,{axis:d,numOutputs:m,splitSizes:c?Array.from((v(),R).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1014411:o=>{t.$b("Expand",o,void 0)},1014465:(o,d)=>{t.$b("Gather",o,{axis:Number(d)})},1014536:(o,d)=>{t.$b("GatherElements",o,{axis:Number(d)})},1014615:(o,d)=>{t.$b("GatherND",o,{batch_dims:Number(d)})},1014694:(o,d,m,c,w,T,z,B,L,W,se)=>{t.$b("Resize",o,{antialias:d,axes:m?Array.from((v(),R).subarray(Number(m)>>>0,Number(c)>>>0)):[],coordinateTransformMode:ke(w),cubicCoeffA:T,excludeOutside:z,extrapolationValue:B,keepAspectRatioPolicy:ke(L),mode:ke(W),nearestMode:ke(se)})},1015056:(o,d,m,c,w,T,z)=>{t.$b("Slice",o,{starts:d?Array.from((v(),R).subarray(Number(d)>>>0,Number(m)>>>0)):[],ends:c?Array.from((v(),R).subarray(Number(c)>>>0,Number(w)>>>0)):[],axes:T?Array.from((v(),R).subarray(Number(T)>>>0,Number(z)>>>0)):[]})},1015320:o=>{t.$b("Tile",o,void 0)},1015372:(o,d,m)=>{t.$b("InstanceNormalization",o,{epsilon:d,format:m?"NHWC":"NCHW"})},1015486:(o,d,m)=>{t.$b("InstanceNormalization",o,{epsilon:d,format:m?"NHWC":"NCHW"})},1015600:o=>{t.$b("Range",o,void 0)},1015653:(o,d)=>{t.$b("Einsum",o,{equation:ke(d)})},1015734:(o,d,m,c,w)=>{t.$b("Pad",o,{mode:d,value:m,pads:c?Array.from((v(),R).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1015877:(o,d,m,c,w,T)=>{t.$b("BatchNormalization",o,{epsilon:d,momentum:m,spatial:!!w,trainingMode:!!c,format:T?"NHWC":"NCHW"})},1016046:(o,d,m,c,w,T)=>{t.$b("BatchNormalization",o,{epsilon:d,momentum:m,spatial:!!w,trainingMode:!!c,format:T?"NHWC":"NCHW"})},1016215:(o,d,m)=>{t.$b("CumSum",o,{exclusive:Number(d),reverse:Number(m)})},1016312:(o,d,m)=>{t.$b("DequantizeLinear",o,{axis:d,blockSize:m})},1016402:(o,d,m,c,w)=>{t.$b("GridSample",o,{align_corners:d,mode:ke(m),padding_mode:ke(c),format:w?"NHWC":"NCHW"})},1016572:(o,d,m,c,w)=>{t.$b("GridSample",o,{align_corners:d,mode:ke(m),padding_mode:ke(c),format:w?"NHWC":"NCHW"})},1016742:(o,d)=>{t.$b("ScatterND",o,{reduction:ke(d)})},1016827:(o,d,m,c,w,T,z,B,L)=>{t.$b("Attention",o,{numHeads:d,isUnidirectional:m,maskFilterValue:c,scale:w,doRotary:T,qkvHiddenSizes:z?Array.from((v(),R).subarray(Number(B)>>>0,Number(B)+z>>>0)):[],pastPresentShareBuffer:!!L})},1017099:o=>{t.$b("BiasAdd",o,void 0)},1017154:o=>{t.$b("BiasSplitGelu",o,void 0)},1017215:o=>{t.$b("FastGelu",o,void 0)},1017271:(o,d,m,c,w,T,z,B,L,W,se,pe,ge,be,ct,_i)=>{t.$b("Conv",o,{format:pe?"NHWC":"NCHW",auto_pad:d,dilations:m?Array.from((v(),R).subarray(Number(m)>>>0,Number(c)>>>0)):[],group:w,kernel_shape:T?Array.from((v(),R).subarray(Number(T)>>>0,Number(z)>>>0)):[],pads:B?Array.from((v(),R).subarray(Number(B)>>>0,Number(L)>>>0)):[],strides:W?Array.from((v(),R).subarray(Number(W)>>>0,Number(se)>>>0)):[],w_is_const:()=>!!(v(),q)[Number(ge)>>>0],activation:ke(be),activation_params:ct?Array.from((v(),G).subarray(Number(ct)>>>0,Number(_i)>>>0)):[]})},1017855:o=>{t.$b("Gelu",o,void 0)},1017907:(o,d,m,c,w,T,z,B,L)=>{t.$b("GroupQueryAttention",o,{numHeads:d,kvNumHeads:m,scale:c,softcap:w,doRotary:T,rotaryInterleaved:z,smoothSoftmax:B,localWindowSize:L})},1018124:(o,d,m,c)=>{t.$b("LayerNormalization",o,{axis:d,epsilon:m,simplified:!!c})},1018235:(o,d,m,c)=>{t.$b("LayerNormalization",o,{axis:d,epsilon:m,simplified:!!c})},1018346:(o,d,m,c,w,T)=>{t.$b("MatMulNBits",o,{k:d,n:m,accuracyLevel:c,bits:w,blockSize:T})},1018473:(o,d,m,c,w,T)=>{t.$b("MultiHeadAttention",o,{numHeads:d,isUnidirectional:m,maskFilterValue:c,scale:w,doRotary:T})},1018632:(o,d)=>{t.$b("QuickGelu",o,{alpha:d})},1018696:(o,d,m,c,w)=>{t.$b("RotaryEmbedding",o,{interleaved:!!d,numHeads:m,rotaryEmbeddingDim:c,scale:w})},1018835:(o,d,m)=>{t.$b("SkipLayerNormalization",o,{epsilon:d,simplified:!!m})},1018937:(o,d,m)=>{t.$b("SkipLayerNormalization",o,{epsilon:d,simplified:!!m})},1019039:(o,d,m,c)=>{t.$b("GatherBlockQuantized",o,{gatherAxis:d,quantizeAxis:m,blockSize:c})},1019160:o=>{t.Fd(o)},1019194:(o,d)=>t.Hd(Number(o),Number(d),t.Yc.Kd,t.Yc.errors)};function Lm(o,d,m){return Ln(async()=>{await t.Dd(Number(o),Number(d),Number(m))})}function Wm(){return typeof wasmOffsetConverter<"u"}function Vm(o,d,m,c){var w=ue();try{return xs(o,d,m,c)}catch(T){if(oe(w),T!==T+0)throw T;le(1,0)}}function Gm(o,d,m){var c=ue();try{return bs(o,d,m)}catch(w){if(oe(c),w!==w+0)throw w;le(1,0)}}function Hm(o){var d=ue();try{gs(o)}catch(m){if(oe(d),m!==m+0)throw m;le(1,0)}}function Fm(o,d){var m=ue();try{return gi(o,d)}catch(c){if(oe(m),c!==c+0)throw c;le(1,0)}}function jm(o,d,m){var c=ue();try{ms(o,d,m)}catch(w){if(oe(c),w!==w+0)throw w;le(1,0)}}function Km(o,d){var m=ue();try{Ss(o,d)}catch(c){if(oe(m),c!==c+0)throw c;le(1,0)}}function Zm(o,d,m,c,w,T,z){var B=ue();try{return ws(o,d,m,c,w,T,z)}catch(L){if(oe(B),L!==L+0)throw L;le(1,0)}}function Xm(o,d,m,c,w,T){var z=ue();try{ys(o,d,m,c,w,T)}catch(B){if(oe(z),B!==B+0)throw B;le(1,0)}}function Qm(o,d,m,c){var w=ue();try{vs(o,d,m,c)}catch(T){if(oe(w),T!==T+0)throw T;le(1,0)}}function Ym(o,d,m,c,w){var T=ue();try{_s(o,d,m,c,w)}catch(z){if(oe(T),z!==z+0)throw z;le(1,0)}}function Jm(o,d,m,c,w,T,z){var B=ue();try{Ts(o,d,m,c,w,T,z)}catch(L){if(oe(B),L!==L+0)throw L;le(1,0)}}function eg(o,d,m,c,w,T,z){var B=ue();try{Is(o,d,m,c,w,T,z)}catch(L){if(oe(B),L!==L+0)throw L;le(1,0)}}function tg(o,d,m,c,w,T,z,B){var L=ue();try{As(o,d,m,c,w,T,z,B)}catch(W){if(oe(L),W!==W+0)throw W;le(1,0)}}function rg(o,d,m,c,w){var T=ue();try{return ks(o,d,m,c,w)}catch(z){if(oe(T),z!==z+0)throw z;le(1,0)}}function ig(o,d,m){var c=ue();try{return Os(o,d,m)}catch(w){if(oe(c),w!==w+0)throw w;le(1,0)}}function ag(o,d,m,c,w,T,z,B){var L=ue();try{Rs(o,d,m,c,w,T,z,B)}catch(W){if(oe(L),W!==W+0)throw W;le(1,0)}}function ng(o,d,m,c,w,T,z,B,L,W,se,pe){var ge=ue();try{Es(o,d,m,c,w,T,z,B,L,W,se,pe)}catch(be){if(oe(ge),be!==be+0)throw be;le(1,0)}}function sg(o,d,m,c,w,T){var z=ue();try{return zs(o,d,m,c,w,T)}catch(B){if(oe(z),B!==B+0)throw B;le(1,0)}}function og(o,d,m){var c=ue();try{return Bs(o,d,m)}catch(w){if(oe(c),w!==w+0)throw w;return le(1,0),0n}}function ug(o,d,m,c,w,T,z,B,L){var W=ue();try{$s(o,d,m,c,w,T,z,B,L)}catch(se){if(oe(W),se!==se+0)throw se;le(1,0)}}function lg(o){var d=ue();try{return Ns(o)}catch(m){if(oe(d),m!==m+0)throw m;le(1,0)}}function dg(o,d){var m=ue();try{return Xs(o,d)}catch(c){if(oe(m),c!==c+0)throw c;return le(1,0),0n}}function pg(o){var d=ue();try{return Ms(o)}catch(m){if(oe(d),m!==m+0)throw m;return le(1,0),0n}}function cg(o,d,m,c){var w=ue();try{return Ws(o,d,m,c)}catch(T){if(oe(w),T!==T+0)throw T;le(1,0)}}function hg(o,d,m,c,w){var T=ue();try{return Vs(o,d,m,c,w)}catch(z){if(oe(T),z!==z+0)throw z;le(1,0)}}function fg(o,d,m,c,w,T){var z=ue();try{return Gs(o,d,m,c,w,T)}catch(B){if(oe(z),B!==B+0)throw B;le(1,0)}}function mg(o,d,m,c,w,T){var z=ue();try{return Hs(o,d,m,c,w,T)}catch(B){if(oe(z),B!==B+0)throw B;le(1,0)}}function gg(o,d,m,c,w,T,z,B){var L=ue();try{return Cs(o,d,m,c,w,T,z,B)}catch(W){if(oe(L),W!==W+0)throw W;le(1,0)}}function yg(o,d,m,c,w){var T=ue();try{return Fs(o,d,m,c,w)}catch(z){if(oe(T),z!==z+0)throw z;return le(1,0),0n}}function _g(o,d,m,c){var w=ue();try{return js(o,d,m,c)}catch(T){if(oe(w),T!==T+0)throw T;le(1,0)}}function bg(o,d,m,c){var w=ue();try{return Ks(o,d,m,c)}catch(T){if(oe(w),T!==T+0)throw T;le(1,0)}}function $g(o,d,m,c,w,T,z,B,L,W,se,pe){var ge=ue();try{return Zs(o,d,m,c,w,T,z,B,L,W,se,pe)}catch(be){if(oe(ge),be!==be+0)throw be;le(1,0)}}function wg(o,d,m,c,w,T,z,B,L,W,se){var pe=ue();try{qs(o,d,m,c,w,T,z,B,L,W,se)}catch(ge){if(oe(pe),ge!==ge+0)throw ge;le(1,0)}}function vg(o,d,m,c,w,T,z,B,L,W,se,pe,ge,be,ct,_i){var Tg=ue();try{Ls(o,d,m,c,w,T,z,B,L,W,se,pe,ge,be,ct,_i)}catch(bi){if(oe(Tg),bi!==bi+0)throw bi;le(1,0)}}function xg(o,d,m){var c=ue();try{return Ds(o,d,m)}catch(w){if(oe(c),w!==w+0)throw w;le(1,0)}}function Sg(o,d,m){var c=ue();try{return Us(o,d,m)}catch(w){if(oe(c),w!==w+0)throw w;le(1,0)}}function kg(o,d,m,c){var w=ue();try{Ps(o,d,m,c)}catch(T){if(oe(w),T!==T+0)throw T;le(1,0)}}function Sr(){if(0<$e)Be=Sr;else if(a)$?.(t),X();else{for(var o=me;0<o.length;)o.shift()(t);0<$e?Be=Sr:(t.calledRun=!0,A||(X(),$?.(t)))}}return a||(at=await Ce(),Sr()),t.PTR_SIZE=4,U?t:new Promise((o,d)=>{$=o,k=d})}var ip,io,jg=P(()=>{ip=ro,io=globalThis.self?.name?.startsWith("em-pthread"),io&&ro()}),ki,ga,ao,Me,ap,Tr,no,so,Ti,oo,Ii,np,Ei,sp,Da=P(()=>{Ma(),ki=typeof location>"u"?void 0:location.origin,ga=import.meta.url>"file:"&&import.meta.url<"file;",ao=()=>{{if(ga){let e=URL;return new URL(new e("ort.bundle.min.mjs",import.meta.url).href,ki).href}return import.meta.url}},Me=ao(),ap=()=>{if(Me&&!Me.startsWith("blob:"))return Me.substring(0,Me.lastIndexOf("/")+1)},Tr=(e,t)=>{try{let r=t??Me;return(r?new URL(e,r):new URL(e)).origin===ki}catch{return!1}},no=(e,t)=>{let r=t??Me;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},so=(e,t)=>`${t??"./"}${e}`,Ti=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},oo=async e=>(await import(e)).default,Ii=(Fg(),dr(ep)).default,np=async()=>{if(!Me)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Tr(Me))return[void 0,Ii()];let e=await Ti(Me);return[e,Ii(e)]},Ei=(jg(),dr(rp)).default,sp=async(e,t,r,i)=>{let a=Ei&&!(e||t);if(a)if(Me)a=Tr(Me)||i&&!r;else if(i&&!r)a=!0;else throw new Error("cannot determine the script source URL.");if(a)return[void 0,Ei];{let s="ort-wasm-simd-threaded.jsep.mjs",n=e??no(s,t),u=r&&n&&!Tr(n,t),l=u?await Ti(n):n??so(s,t);return[u?l:void 0,await oo(l)]}}}),zi,Ir,Zt,Ci,uo,lo,po,Ua,_e,Bt=P(()=>{Da(),Ir=!1,Zt=!1,Ci=!1,uo=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},lo=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},po=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},Ua=async e=>{if(Ir)return Promise.resolve();if(Zt)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Ci)throw new Error("previous call to 'initializeWebAssembly()' failed.");Zt=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!po())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!lo())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=uo();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let a=e.wasmPaths,s=typeof a=="string"?a:void 0,n=a?.mjs,u=n?.href??n,l=a?.wasm,p=l?.href??l,f=e.wasmBinary,[h,g]=await sp(u,s,r>1,!!f||!!p),y=!1,_=[];if(t>0&&_.push(new Promise($=>{setTimeout(()=>{y=!0,$()},t)})),_.push(new Promise(($,k)=>{let x={numThreads:r};if(f)x.wasmBinary=f,x.locateFile=b=>b;else if(p||s)x.locateFile=b=>p??s+b;else if(u&&u.indexOf("blob:")!==0)x.locateFile=b=>new URL(b,u).href;else if(h){let b=ap();b&&(x.locateFile=I=>b+I)}g(x).then(b=>{Zt=!1,Ir=!0,zi=b,$(),h&&URL.revokeObjectURL(h)},b=>{Zt=!1,Ci=!0,k(b)})})),await Promise.race(_),y)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},_e=()=>{if(Ir&&zi)return zi;throw new Error("WebAssembly is not initialized yet.")}}),Ke,Wr,fe,Pa=P(()=>{Bt(),Ke=(e,t)=>{let r=_e(),i=r.lengthBytesUTF8(e)+1,a=r._malloc(i);return r.stringToUTF8(e,a,i),t.push(a),a},Wr=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([a,s])=>{let n=t?t+a:a;if(typeof s=="object")Wr(s,n+".",r,i);else if(typeof s=="string"||typeof s=="number")i(n,s.toString());else if(typeof s=="boolean")i(n,s?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof s}`)})},fe=e=>{let t=_e(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetLastError(a,a+i);let s=Number(t.getValue(a,i===4?"i32":"i64")),n=t.getValue(a+i,"*"),u=n?t.UTF8ToString(n):"";throw new Error(`${e} ERROR_CODE: ${s}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}}),op,Kg=P(()=>{Bt(),Pa(),op=e=>{let t=_e(),r=0,i=[],a=e||{};try{if(e?.logSeverityLevel===void 0)a.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)a.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(a.terminate=!1);let s=0;return e?.tag!==void 0&&(s=Ke(e.tag,i)),r=t._OrtCreateRunOptions(a.logSeverityLevel,a.logVerbosityLevel,!!a.terminate,s),r===0&&fe("Can't create run options."),e?.extra!==void 0&&Wr(e.extra,"",new WeakSet,(n,u)=>{let l=Ke(n,i),p=Ke(u,i);t._OrtAddRunConfigEntry(r,l,p)!==0&&fe(`Can't set a run config entry: ${n} - ${u}.`)}),[r,i]}catch(s){throw r!==0&&t._OrtReleaseRunOptions(r),i.forEach(n=>t._free(n)),s}}}),co,ho,fo,wt,mo,up,Zg=P(()=>{Bt(),Pa(),co=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},ho=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},fo=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},wt=(e,t,r,i)=>{let a=Ke(t,i),s=Ke(r,i);_e()._OrtAddSessionConfigEntry(e,a,s)!==0&&fe(`Can't set a session config entry: ${t} - ${r}.`)},mo=async(e,t,r)=>{let i=t.executionProviders;for(let a of i){let s=typeof a=="string"?a:a.name,n=[];switch(s){case"webnn":if(s="WEBNN",wt(e,"session.disable_quant_qdq","1",r),wt(e,"session.disable_qdq_constant_folding","1",r),typeof a!="string"){let h=a?.deviceType;h&&wt(e,"deviceType",h,r)}break;case"webgpu":if(s="JS",typeof a!="string"){let h=a;if(h?.preferredLayout){if(h.preferredLayout!=="NCHW"&&h.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${h.preferredLayout}`);wt(e,"preferredLayout",h.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${s}`)}let u=Ke(s,r),l=n.length,p=0,f=0;if(l>0){p=_e()._malloc(l*_e().PTR_SIZE),r.push(p),f=_e()._malloc(l*_e().PTR_SIZE),r.push(f);for(let h=0;h<l;h++)_e().setValue(p+h*_e().PTR_SIZE,n[h][0],"*"),_e().setValue(f+h*_e().PTR_SIZE,n[h][1],"*")}await _e()._OrtAppendExecutionProvider(e,u,p,f,l)!==0&&fe(`Can't append execution provider: ${s}.`)}},up=async e=>{let t=_e(),r=0,i=[],a=e||{};fo(a);try{let s=co(a.graphOptimizationLevel??"all"),n=ho(a.executionMode??"sequential"),u=typeof a.logId=="string"?Ke(a.logId,i):0,l=a.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log severity level is not valid: ${l}`);let p=a.logVerbosityLevel??0;if(!Number.isInteger(p)||p<0||p>4)throw new Error(`log verbosity level is not valid: ${p}`);let f=typeof a.optimizedModelFilePath=="string"?Ke(a.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(s,!!a.enableCpuMemArena,!!a.enableMemPattern,n,!!a.enableProfiling,0,u,l,p,f),r===0&&fe("Can't create session options."),a.executionProviders&&await mo(r,a,i),a.enableGraphCapture!==void 0){if(typeof a.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${a.enableGraphCapture}`);wt(r,"enableGraphCapture",a.enableGraphCapture.toString(),i)}if(a.freeDimensionOverrides)for(let[h,g]of Object.entries(a.freeDimensionOverrides)){if(typeof h!="string")throw new Error(`free dimension override name must be a string: ${h}`);if(typeof g!="number"||!Number.isInteger(g)||g<0)throw new Error(`free dimension override value must be a non-negative integer: ${g}`);let y=Ke(h,i);t._OrtAddFreeDimensionOverride(r,y,g)!==0&&fe(`Can't set a free dimension override: ${h} - ${g}.`)}return a.extra!==void 0&&Wr(a.extra,"",new WeakSet,(h,g)=>{wt(r,h,g,i)}),[r,i]}catch(s){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&fe("Can't release session options."),i.forEach(n=>t._free(n)),s}}}),It,st,Et,Zr,Vr,qa,La,ya,te=P(()=>{It=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},st=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Et=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((a,s)=>a*s,1);return r>0?Math.ceil(i*r):void 0},Zr=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},Vr=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},qa=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",La=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",ya=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),Wa,lp=P(()=>{Ma(),Wa=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let a=t.body.getReader(),s;try{s=new ArrayBuffer(i)}catch(u){if(u instanceof RangeError){let l=Math.ceil(i/65536);s=new WebAssembly.Memory({initial:l,maximum:l}).buffer}else throw u}let n=0;for(;;){let{done:u,value:l}=await a.read();if(u)break;let p=l.byteLength;new Uint8Array(s,n,p).set(l),n+=p}return new Uint8Array(s,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),go,yo,_o,bo,Va,$o,de,ot=P(()=>{te(),go=["V","I","W","E","F"],yo=(e,t)=>{console.log(`[${go[e]},${new Date().toISOString()}]${t}`)},Va=(e,t)=>{_o=e,bo=t},$o=(e,t)=>{let r=Vr(e),i=Vr(_o);r>=i&&yo(r,typeof t=="function"?t():t)},de=(...e)=>{bo&&$o(...e)}}),wo,Lt,O,Gr,dp,pp,cp,ie=P(()=>{wo=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Lt=class{static calcShape(e,t,r=!1){let i=e.length,a=t.length;if(i===0)return t;if(a===0)return e;let s=Math.max(e.length,t.length),n=new Array(s);if(r){if(i<2||a<2)return;let u=wo.calcMatMulShape([e[i-2],e[i-1]],[t[a-2],t[a-1]]);if(u===void 0)return;[n[s-2],n[s-1]]=u}for(let u=r?3:1;u<=s;u++){let l=i-u<0?1:e[i-u],p=a-u<0?1:t[a-u];if(l!==p&&l>1&&p>1)return;let f=Math.max(l,p);if(l&&p)n[s-u]=Math.max(l,p);else{if(f>1)return;n[s-u]=0}}return n}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let a=1;a<=r;a++)if(e[r-a]!==1&&e[r-a]!==t[i-a])return!1;return!0}},O=class Ur{static size(t){return Ur.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let a=new Array(i),s=i-1;for(;s>=0;){if(t[s]%r===0){a[s]=t[s]/r;break}if(r%t[s]!==0)throw new Error("cannot convert shape");a[s]=1,r/=t[s],s--}for(s--;s>=0;s--)a[s]=t[s];return a}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Ur.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Ur.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let a=1;for(let s=r;s<i;s++){if(t[s]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");a*=Number(t[s])}return a}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let a=r-3;a>=0;--a)i[a]=i[a+1]*t[a+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((a,s)=>a+r[s]+r[s+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,a)=>i===r[a])}},Gr=class nr{static adjustPoolAttributes(t,r,i,a,s,n){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=i.length?i.push(r[u+2]):i[u]=r[u+2];for(let u=0;u<i.length;u++)if(u<a.length){if(a[u]<0)throw new Error("strides should be greater than or equal to 1")}else a.push(1);for(let u=0;u<i.length;u++)if(u<s.length){if(s[u]<0)throw new Error("dilations should be greater than or equal to 1")}else s.push(1);for(let u=0;u<i.length*2;u++)if(u<n.length){if(n[u]<0)throw new Error("pad should be greater than or equal to 1")}else n.push(0);for(let u=0;u<i.length;u++){if(i[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(n[u]>=i[u]||n[u+i.length]>=i[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,a,s,n,u){if(u){if(s.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(a.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)nr.adjustPadAndReturnShape(t[l+(n?1:2)],r[l],i[l],a[l],s,l,l+t.length-2,u)}}static computePoolOutputShape(t,r,i,a,s,n,u){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return nr.computeShapeHelper(t,r,l,i,a,s,n,u),l}static computeConvOutputShape(t,r,i,a,s,n,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],r[0]];return nr.computeShapeHelper(!1,t,l,i,a,s,n,u),l}static computeShapeHelper(t,r,i,a,s,n,u,l){if(t)for(let p=0;p<r.length-2;p++)i.push(1);else for(let p=0;p<r.length-2;p++)i.push(nr.adjustPadAndReturnShape(r[p+2],a[p],s[p],n[p],u,p,p+r.length-2,l))}static adjustPadAndReturnShape(t,r,i,a,s,n,u,l){let p=i*(a-1)+1;if(l&&l!=="NOTSET")switch(l){case"VALID":return s[n]=0,s[u]=0,Math.floor((t-p)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let f=((t+r-1)/r-1)*r+a-t;return s[n]=Math.floor(l==="SAME_LOWER"?(f+1)/2:f/2),s[u]=f-s[n],Math.floor((t+f-a)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+s[n]+s[u]-p)/r+1)}},dp=class{static getShapeOfGemmResult(e,t,r,i,a){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let s,n,u;t?(s=e[1],n=e[0]):(s=e[0],n=e[1]);let l=-1;if(i?(u=r[0],l=1):(u=r[1],l=0),r[l]!==n)throw new Error("dimension mismatch");if(s<=0||u<=0||n<=0)throw new Error("invalid shape specified");if(a&&!Lt.isValidBroadcast(a,[s,u]))throw new Error("gemm: invalid bias shape for broadcast");return[s,u,n]}},pp=-34028234663852886e22,cp=34028234663852886e22}),Ga,hp=P(()=>{te(),Ga=(e,t)=>new(Zr(t))(e)}),Ai,_a,Oi,vo,Ri,xo,Bi,Ni,Mi,So,fp,Xg=P(()=>{te(),ot(),Ai=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),_a=(e,t)=>{if(t==="int32")return e;let r=Ai.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let a=e.byteLength/i,s=new(Zr(t))(e.buffer,e.byteOffset,a);switch(t){case"int64":case"uint64":{let n=new Int32Array(a);for(let u=0;u<a;u++){let l=s[u];if(l>2147483647n||l<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");n[u]=Number(l)}return new Uint8Array(n.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&s.some(u=>u>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let n=Int32Array.from(s,Number);return new Uint8Array(n.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},Oi=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let a=BigInt64Array.from(i,BigInt);return new Uint8Array(a.buffer)}case"uint64":{if(i.some(s=>s<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let a=BigUint64Array.from(i,BigInt);return new Uint8Array(a.buffer)}case"int8":{if(i.some(s=>s<-128||s>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let a=Int8Array.from(i,Number);return new Uint8Array(a.buffer)}case"uint8":{if(i.some(a=>a<0||a>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(s=>s<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let a=Uint32Array.from(i,Number);return new Uint8Array(a.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},vo=1,Ri=()=>vo++,xo=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),Bi=(e,t)=>{let r=Ai.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,a)=>i*a)*r/8):0},Ni=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:a,shape:s,fallbackDataType:n}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=a,this.tensorShape=s,this.fallbackDataType=n}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return Bi(this.dataType,this.tensorShape)}destroy(){de("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=Oi(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return new Uint8Array(r).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,a)=>i===r[a])}setIsDataConverted(e){this.isDataConverted=e}},Mi=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let a=this.tensorManager.getMLContext(e),s=this.tensorManager.getMLOpSupportLimits(e),n;if(!s?.input.dataTypes.includes(t)){if(n=xo.get(t),!n||s?.input.dataTypes.includes(n))throw new Error(`WebNN backend does not support data type: ${t}`);de("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${n}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(a,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==Bi(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let u=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,u,!0,!0,n),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=_a(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else de("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.activeUpload){let t=this.wrapper?.isDataConverted?Oi(this.activeUpload,this.wrapper?.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t);return}else return t.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},So=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=Ri();return this.tensorTrackersById.set(e,new Mi(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,a){de("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${a}}`);let s=this.tensorTrackersById.get(t);if(!s)throw new Error("Tensor not found.");return s.ensureTensor(e,r,i,a)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){de("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let a=this.getMLContext(e),s=Ri(),n=new Ni({sessionId:e,context:a,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(s,new Mi(this,n)),this.externalTensors.add(n),s}async getCachedTensor(e,t,r,i,a,s,n){let u=this.getMLContext(e);for(let[p,f]of this.freeTensors.entries())if(f.canReuseTensor(u,t,r)){de("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${n?`fallbackDataType: ${n},`:""} shape: ${r}`);let h=this.freeTensors.splice(p,1)[0];return h.sessionId=e,h}de("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${n?`fallbackDataType: ${n},`:""} shape: ${r}}`);let l=await u.createTensor({dataType:n??t,shape:r,dimensions:r,usage:i,writable:a,readable:s});return new Ni({sessionId:e,context:u,tensor:l,dataType:t,shape:r,fallbackDataType:n})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},fp=(...e)=>new So(...e)}),Xt,ko,mp,Qg=P(()=>{te(),Bt(),hp(),Xg(),ot(),Xt=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),ko=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((a,s)=>a===i[s]&&e[a]===t[a])},mp=class{constructor(e){this.tensorManager=fp(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,Va(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){de("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){de("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)de("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>ko(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(a=>a.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){de("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,a){let s=Xt.get(r);if(!s)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,s,i,a)}async createTemporaryTensor(e,t,r){de("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=Xt.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let a=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,a,i,r,!1);let s=this.temporarySessionTensorIds.get(e);return s?s.push(a):this.temporarySessionTensorIds.set(e,[a]),a}uploadTensor(e,t){if(!_e().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");de("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return Ga(r,t)}}registerMLTensor(e,t,r,i){let a=Xt.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);let s=this.tensorManager.registerTensor(e,t,a,i);return de("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${a}, dimensions: ${i}} -> {tensorId: ${s}}`),s}registerMLConstant(e,t,r,i,a,s,n=!1){if(!s)throw new Error("External mounted files are not available.");let u=e;e.startsWith("./")&&(u=e.substring(2));let l=s.get(u);if(!l)throw new Error(`File with name ${u} not found in preloaded files.`);if(t+r>l.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let p=l.slice(t,t+r).buffer,f;switch(a.dataType){case"float32":f=new Float32Array(p);break;case"float16":f=typeof Float16Array<"u"?new Float16Array(p):new Uint16Array(p);break;case"int32":f=new Int32Array(p);break;case"uint32":f=new Uint32Array(p);break;case"int64":if(n){let h=_a(new Uint8Array(p),"int64");f=new Int32Array(h.buffer),a.dataType="int32"}else f=new BigInt64Array(p);break;case"uint64":f=new BigUint64Array(p);break;case"int8":f=new Int8Array(p);break;case"int4":case"uint4":case"uint8":f=new Uint8Array(p);break;default:throw new Error(`Unsupported data type: ${a.dataType} in creating WebNN Constant from external data.`)}return de("verbose",()=>`[WebNN] registerMLConstant {dataType: ${a.dataType}, shape: ${a.shape}}} ${n?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),i.constant(a,f)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=Xt.get(It(t)),a=this.mlOpSupportLimitsBySessionId.get(e);return typeof i>"u"?!1:r?!!a?.input.dataTypes.includes(i):!!a?.output.dataTypes.includes(i)}flush(){}}}),Ha=P(()=>{}),Di,Er,zr,To,Io,Ui,ba,Eo,gp,Yg=P(()=>{ot(),Ha(),Di=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Er=[],zr=e=>Math.ceil(Number(e)/16)*16,To=e=>{for(let t=0;t<Er.length;t++){let r=Er[t];if(e<=r)return r}return Math.ceil(e/16)*16},Io=1,Ui=()=>Io++,ba=async(e,t,r,i)=>{let a=zr(r),s=e.device.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let n=e.getCommandEncoder();e.endComputePass(),n.copyBufferToBuffer(t,0,s,0,a),e.flush(),await s.mapAsync(GPUMapMode.READ);let u=s.getMappedRange();if(i){let l=i();return l.set(new Uint8Array(u,0,r)),l}else return new Uint8Array(u.slice(0,r))}finally{s.destroy()}},Eo=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of Di)Er.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,a=t.byteLength,s=zr(a),n=this.storageCache.get(e);if(!n)throw new Error("gpu data for uploading does not exist");if(Number(n.originalSize)!==a)throw new Error(`inconsistent data size. gpu data size=${n.originalSize}, data size=${a}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:s,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),l=u.getMappedRange();new Uint8Array(l).set(new Uint8Array(r,i,a)),u.unmap();let p=this.backend.device.createCommandEncoder();p.copyBufferToBuffer(u,0,n.gpuData.buffer,0,s),this.backend.device.queue.submit([p.finish()]),u.destroy(),de("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let a=zr(r.originalSize),s=this.backend.getCommandEncoder();this.backend.endComputePass(),s.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,a)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return de("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=Ui();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),de("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),de("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=To(e),i,a=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,s=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(a||s){let u=(a?this.freeBuffers:this.freeUniformBuffers).get(r);u?u.length>0?i=u.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let n={id:Ui(),type:0,buffer:i};return this.storageCache.set(n.id,{gpuData:n,originalSize:Number(e)}),de("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${n.id}`),n}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return de("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await ba(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=Di.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(de("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},gp=(...e)=>new Eo(...e)}),zo,he,Se=P(()=>{zo=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},he=e=>new zo(e)}),Wt,Cr,Ie,Oe,Z,xe,$a,qt,gt,j,Qt,N,H,yp,Fa,Co,_p,ae=P(()=>{te(),ie(),Wt=64,Cr=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},Ie=(e,t=1)=>{let r=Cr(e,t);return typeof r=="string"?r:r[0]},Oe=(e,t=1)=>{let r=Cr(e,t);return typeof r=="string"?r:r[1]},Z=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:O.computeStrides(r)})}),t},xe=e=>e%4===0?4:e%2===0?2:1,$a=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,qt=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,gt=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,j=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,Qt=(e,t,r,i,a)=>{let s=typeof r=="number",n=s?r:r.length,u=[...new Array(n).keys()],l=n<2?"u32":n<=4?`vec${n}<u32>`:`array<u32, ${n}>`,p=Cr(t,a),f=typeof p=="string"?p:p[1],h=typeof p=="string"?p:p[0],g={indices:l,value:f,storage:h,tensor:t},y=U=>typeof U=="string"?U:`${U}u`,_={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},$=s?"uniforms.":"",k=`${$}${e}_shape`,x=`${$}${e}_strides`,b="";for(let U=0;U<n-1;U++)b+=`
    let dim${U} = current / ${j(x,U,n)};
    let rest${U} = current % ${j(x,U,n)};
    indices[${U}] = dim${U};
    current = rest${U};
    `;b+=`indices[${n-1}] = current;`;let I=n<2?"":`
  fn o2i_${e}(offset: u32) -> ${g.indices} {
    var indices: ${g.indices};
    var current = offset;
    ${b}
    return indices;
  }`,S=U=>(_.offsetToIndices=!0,n<2?U:`o2i_${e}(${U})`),E=[];if(n>=2)for(let U=n-1;U>=0;U--)E.push(`${j(x,U,n)} * (indices[${U}])`);let A=n<2?"":`
  fn i2o_${e}(indices: ${g.indices}) -> u32 {
    return ${E.join("+")};
  }`,C=U=>(_.indicesToOffset=!0,n<2?U:`i2o_${e}(${U})`),v=(...U)=>n===0?"0u":`${g.indices}(${U.map(y).join(",")})`,D=(U,Y)=>n<2?`${U}`:`${j(U,Y,n)}`,q=(U,Y,X)=>n<2?`${U}=${X};`:`${j(U,Y,n)}=${X};`,Q={},F=(U,Y)=>{_.broadcastedIndicesToOffset=!0;let X=`${Y.name}broadcastedIndicesTo${e}Offset`;if(X in Q)return`${X}(${U})`;let V=[];for(let Te=n-1;Te>=0;Te--){let Ce=Y.indicesGet("outputIndices",Te+Y.rank-n);V.push(`${D(x,Te)} * (${Ce} % ${D(k,Te)})`)}return Q[X]=`fn ${X}(outputIndices: ${Y.type.indices}) -> u32 {
             return ${V.length>0?V.join("+"):"0u"};
           }`,`${X}(${U})`},K=(U,Y)=>(()=>{if(g.storage===g.value)return`${e}[${U}]=${Y};`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`${e}[${U}]=vec2<u32>(u32(${Y}), select(0u, 0xFFFFFFFFu, ${Y} < 0));`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`${e}[${U}]=vec2<u32>(u32(${Y}), 0u);`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`${e}[${U}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${Y}));`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),R=U=>(()=>{if(g.storage===g.value)return`${e}[${U}]`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`i32(${e}[${U}].x)`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`u32(${e}[${U}].x)`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${U}] & 0xFFu), bool(${e}[${U}] & 0xFF00u), bool(${e}[${U}] & 0xFF0000u), bool(${e}[${U}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),M=n<2?"":`
  fn get_${e}ByIndices(indices: ${g.indices}) -> ${f} {
    return ${R(`i2o_${e}(indices)`)};
  }`,G=n<2?"":(()=>{let U=u.map(X=>`d${X}: u32`).join(", "),Y=u.map(X=>`d${X}`).join(", ");return`
  fn get_${e}(${U}) -> ${f} {
    return get_${e}ByIndices(${v(Y)});
  }`})(),J=(...U)=>{if(U.length!==n)throw new Error(`indices length must be ${n}`);let Y=U.map(y).join(",");return n===0?R("0u"):n===1?R(Y[0]):(_.get=!0,_.getByIndices=!0,_.indicesToOffset=!0,`get_${e}(${Y})`)},ee=U=>n<2?R(U):(_.getByIndices=!0,_.indicesToOffset=!0,`get_${e}ByIndices(${U})`),re=n<2?"":`
  fn set_${e}ByIndices(indices: ${g.indices}, value: ${f}) {
    ${K(`i2o_${e}(indices)`,"value")}
  }`,ne=n<2?"":(()=>{let U=u.map(X=>`d${X}: u32`).join(", "),Y=u.map(X=>`d${X}`).join(", ");return`
  fn set_${e}(${U}, value: ${f}) {
    set_${e}ByIndices(${v(Y)}, value);
  }`})();return{impl:()=>{let U=[],Y=!1;return _.offsetToIndices&&(U.push(I),Y=!0),_.indicesToOffset&&(U.push(A),Y=!0),_.broadcastedIndicesToOffset&&(Object.values(Q).forEach(X=>U.push(X)),Y=!0),_.set&&(U.push(ne),Y=!0),_.setByIndices&&(U.push(re),Y=!0),_.get&&(U.push(G),Y=!0),_.getByIndices&&(U.push(M),Y=!0),!s&&Y&&U.unshift(`const ${k} = ${g.indices}(${r.join(",")});`,`const ${x} = ${g.indices}(${O.computeStrides(r).join(",")});`),U.join(`
`)},type:g,offsetToIndices:S,indicesToOffset:C,broadcastedIndicesToOffset:F,indices:v,indicesGet:D,indicesSet:q,set:(...U)=>{if(U.length!==n+1)throw new Error(`indices length must be ${n}`);let Y=U[n];if(typeof Y!="string")throw new Error("value must be string");let X=U.slice(0,n).map(y).join(",");return n===0?K("0u",Y):n===1?K(X[0],Y):(_.set=!0,_.setByIndices=!0,_.indicesToOffset=!0,`set_${e}(${X}, ${Y})`)},setByOffset:K,setByIndices:(U,Y)=>n<2?K(U,Y):(_.setByIndices=!0,_.indicesToOffset=!0,`set_${e}ByIndices(${U}, ${Y});`),get:J,getByOffset:R,getByIndices:ee,usage:i,name:e,strides:x,shape:k,rank:n}},N=(e,t,r,i=1)=>Qt(e,t,r,"input",i),H=(e,t,r,i=1)=>Qt(e,t,r,"output",i),yp=(e,t,r)=>Qt(e,t,r,"atomicOutput",1),Fa=(e,t,r,i=1)=>Qt(e,t,r,"internal",i),Co=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Wt){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let a=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,s=a?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,n=a?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*i}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${i})
  fn main(${s}) {
    ${n}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",i=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${i}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:i}of this.uniforms)if(i&&i>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(i/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(i/4)}>`);else{let a=i==null||i===1?r:`vec${i}<${r}>`;e.push(`${t}:${a}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},_p=(e,t)=>new Co(e,t)}),Ao,Pi,Oo,Ro,Bo,No,Ue,bp,$p,yt=P(()=>{te(),ie(),Se(),ae(),Ao=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Pi=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),Oo=(e,t)=>O.sortBasedOnPerm(e,Pi(e.length,t)),Ro=(e,t,r,i)=>{let a=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let s=0;s<t;++s)a+=`a[${e[s]}]=i[${s}];`;return a+="return a;}"},Bo=(e,t)=>{let r=[],i=[];for(let a=0;a<e.length;++a)e[a]!==1&&r.push(e[a]),e[t[a]]!==1&&i.push(t[a]);return{newShape:r,newPerm:i}},No=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},Ue=(e,t)=>{let r=e.dataType,i=e.dims.length,a=Pi(i,t),s=Oo(e.dims,a),n=e.dims,u=s,l=i<2||No(a,e.dims),p;if(l)return p=_=>{let $=N("input",r,n,4),k=H("output",r,u,4);return`
  ${_.registerUniform("output_size","u32").declareVariables($,k)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let _=O.size(s);return{outputs:[{dims:s,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(_/64/4)},programUniforms:[{type:12,data:Math.ceil(_/4)}]}},getShaderSource:p};let{newShape:f,newPerm:h}=Bo(e.dims,a),g=O.areEqual(h,[2,3,1]),y=O.areEqual(h,[3,1,2]);if(f.length===2||g||y){n=g?[f[0],f[1]*f[2]]:y?[f[0]*f[1],f[2]]:f,u=[n[1],n[0]];let _=16;return p=$=>{let k=N("a",r,n.length),x=H("output",r,u.length);return`
  ${$.registerUniform("output_size","u32").declareVariables(k,x)}
  var<workgroup> tile : array<array<${x.type.value}, ${_+1}>, ${_}>;
  ${$.mainStart([_,_,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${_} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${_}u + local_id.x;
    let input_row = workgroup_id_x * ${_}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${k.getByIndices(`${k.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${_}u + local_id.x;
    let output_row = workgroup_id_y * ${_}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${x.setByIndices(`${x.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let $=O.size(s);return{outputs:[{dims:s,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/_),y:Math.ceil(u[0]/_)},programUniforms:[{type:12,data:$},...Z(n,u)]}},getShaderSource:p}}return p=_=>{let $=N("a",r,n.length),k=H("output",r,u.length);return`
  ${_.registerUniform("output_size","u32").declareVariables($,k)}

  ${Ro(a,i,$,k)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${k.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${k.setByOffset("global_idx",$.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let _=O.size(s);return{outputs:[{dims:s,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:[{type:12,data:_},...Z(n,u)]}},getShaderSource:p}},bp=(e,t)=>{Ao(e.inputs,t.perm),e.compute(Ue(e.inputs[0],t.perm))},$p=e=>he({perm:e.perm})}),Mo,Do,Uo,Po,qo,Lo,Wo,Vo,Go,Ho,Ve,wp,vp,xp,Sp,kp,Tp,Ip,Ep,zp,Cp,Jg=P(()=>{te(),ie(),ae(),ja(),yt(),Mo={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},Do={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},Uo={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Po={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},qo=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},Lo=(e,t)=>{let r=[],i=e.length;for(let s=0;s<i;s++)t.indexOf(s)===-1&&r.push(e[s]);let a=t.map(s=>e[s]);return[r,a]},Wo=(e,t)=>{let r=e.length+t.length,i=[],a=0;for(let s=0;s<r;s++)t.indexOf(s)===-1?i.push(e[a++]):i.push(1);return i},Vo=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},Go=(e,t)=>{let r=[];if(!Vo(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},Ho=(e,t,r,i,a,s,n)=>{let u=r[0].dims,l=O.size(s),p=O.size(n),f=N("_A",r[0].dataType,u),h=H("output",a,s),g=64;l===1&&(g=256);let y=`
          var<workgroup> aBestValues : array<f32, ${g}>;
       `,_=$=>`
        ${$.registerUniform("reduceSize","u32").declareVariables(f,h)}
        ${y}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${$.mainStart(g)}

          let outputIndex = global_idx / ${g};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Uo[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${g}) {
           let candidate = f32(${f.getByOffset("offset + k")});
           bestValue = ${Mo[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${g}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Do[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${h.setByOffset("outputIndex",`${i==="mean"?`${h.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${h.type.storage}(${Po[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${g}`,inputDependencies:["type"]},getShaderSource:_,getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:l},programUniforms:[{type:12,data:p}]})}},Ve=(e,t,r,i)=>{let a=e.inputs.length===1?r:wa(e.inputs,r),s=a.axes;s.length===0&&!a.noopWithEmptyAxes&&(s=e.inputs[0].dims.map((y,_)=>_));let n=O.normalizeAxes(s,e.inputs[0].dims.length),u=n,l=e.inputs[0],p=Go(u,e.inputs[0].dims.length);p.length>0&&(l=e.compute(Ue(e.inputs[0],p),{inputs:[0],outputs:[-1]})[0],u=qo(u.length,l.dims.length));let[f,h]=Lo(l.dims,u),g=f;a.keepDims&&(g=Wo(f,n)),e.compute(Ho(t,a.cacheKey,[l],i,e.inputs[0].dataType,g,h),{inputs:[l]})},wp=(e,t)=>{Ve(e,"ReduceMeanShared",t,"mean")},vp=(e,t)=>{Ve(e,"ReduceL1Shared",t,"l1")},xp=(e,t)=>{Ve(e,"ReduceL2Shared",t,"l2")},Sp=(e,t)=>{Ve(e,"ReduceLogSumExpShared",t,"logSumExp")},kp=(e,t)=>{Ve(e,"ReduceMaxShared",t,"max")},Tp=(e,t)=>{Ve(e,"ReduceMinShared",t,"min")},Ip=(e,t)=>{Ve(e,"ReduceProdShared",t,"prod")},Ep=(e,t)=>{Ve(e,"ReduceSumShared",t,"sum")},zp=(e,t)=>{Ve(e,"ReduceSumSquareShared",t,"sumSquare")},Cp=(e,t)=>{Ve(e,"ReduceLogSumShared",t,"logSum")}}),Ge,Fo,Hr,wa,He,jo,Ko,Zo,Xo,Qo,Yo,Jo,eu,tu,ru,Fe,Ap,Op,Rp,Bp,Np,Mp,Dp,Up,Pp,qp,ja=P(()=>{te(),ie(),Se(),ae(),Jg(),Ge=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Fo=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Hr=(e,t,r,i,a,s,n=!1,u=!1)=>{let l=[],p=r[0].dims,f=p.length,h=O.normalizeAxes(a,f),g=!u&&h.length===0;p.forEach(($,k)=>{g||h.indexOf(k)>=0?n&&l.push(1):l.push($)});let y=l.length,_=O.size(l);return{name:e,shaderCache:t,getShaderSource:$=>{let k=[],x=N("_A",r[0].dataType,f),b=H("output",s,y),I=i(x,b,h),S=I[2];for(let E=0,A=0;E<f;E++)g||h.indexOf(E)>=0?(n&&A++,S=`for(var j${E}: u32 = 0; j${E} < ${p[E]}; j${E}++) {
                  ${I[2].includes("last_index")?`let last_index = j${E};`:""}
                  ${x.indicesSet("input_indices",E,`j${E}`)}
                  ${S}
                }`):(k.push(`${x.indicesSet("input_indices",E,b.indicesGet("output_indices",A))};`),A++);return`

        ${$.registerUniform("output_size","u32").declareVariables(x,b)}

        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${x.type.indices};
          let output_indices = ${b.offsetToIndices("global_idx")};

          ${k.join(`
`)}
          ${I[0]}       // init ops for reduce max/min
          ${I[1]}
          ${S}
          ${I[3]}
          ${I.length===4?b.setByOffset("global_idx","value"):I.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:s}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:[{type:12,data:_},...Z(p,l)]})}},wa=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),he({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},He=(e,t,r,i)=>{let a=e.inputs,s=a.length===1?r:wa(a,r);e.compute(Hr(t,{hint:s.cacheKey,inputDependencies:["rank"]},[a[0]],s.noopWithEmptyAxes&&s.axes.length===0?Fo:i,s.axes,a[0].dataType,s.keepDims,s.noopWithEmptyAxes),{inputs:[0]})},jo=(e,t)=>{Ge(e.inputs),He(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},Ko=(e,t)=>{Ge(e.inputs),He(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},Zo=(e,t)=>{Ge(e.inputs),He(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Xo=(e,t)=>{Ge(e.inputs),He(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},Qo=(e,t)=>{Ge(e.inputs),He(e,"ReduceMax",t,(r,i,a)=>{let s=[];for(let n=0;n<r.rank;n++)(a.indexOf(n)>=0||a.length===0)&&s.push(r.indicesSet("input_indices",n,0));return[`${s.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},Yo=(e,t)=>{Ge(e.inputs),He(e,"ReduceMean",t,(r,i,a)=>{let s=1;for(let n=0;n<r.rank;n++)(a.indexOf(n)>=0||a.length===0)&&(s*=e.inputs[0].dims[n]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${s});`]})},Jo=(e,t)=>{Ge(e.inputs),He(e,"ReduceMin",t,(r,i,a)=>{let s=[];for(let n=0;n<r.rank;n++)(a.indexOf(n)>=0||a.length===0)&&s.push(`input_indices[${n}] = 0;`);return[`${s.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},eu=(e,t)=>{Ge(e.inputs),He(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},tu=(e,t)=>{Ge(e.inputs),He(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},ru=(e,t)=>{Ge(e.inputs),He(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},Fe=(e,t,r)=>{if(t.length===0)return r;let i=1,a=1;for(let s=0;s<t.length;s++)t.indexOf(s)===-1?i*=e[s]:a*=e[s];return a<32&&i>1024},Ap=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Yo(e,t):wp(e,t)},Op=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ko(e,t):vp(e,t)},Rp=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Zo(e,t):xp(e,t)},Bp=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Xo(e,t):Sp(e,t)},Np=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Qo(e,t):kp(e,t)},Mp=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Jo(e,t):Tp(e,t)},Dp=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?eu(e,t):Ip(e,t)},Up=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?tu(e,t):Ep(e,t)},Pp=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?ru(e,t):zp(e,t)},qp=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?jo(e,t):Cp(e,t)}}),qi,Lp,Wp,va,e0=P(()=>{te(),Se(),ja(),qi=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},Lp=(e,t)=>{qi(e.inputs);let r=(i,a,s)=>{let n=[];for(let u=0;u<i.rank;u++)(s.indexOf(u)>=0||s.length===0)&&n.push(`input_indices[${u}] = 0;`);return[`${n.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(Hr("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Wp=(e,t)=>{qi(e.inputs);let r=(i,a,s)=>{let n=[];for(let u=0;u<i.rank;u++)(s.indexOf(u)>=0||s.length===0)&&n.push(`input_indices[${u}] = 0;`);return[`${n.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(Hr("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},va=e=>he(e)}),iu,Ar,au,nu,su,pr,ou,Vp,Ka=P(()=>{te(),ie(),Ha(),ae(),iu=(e,t)=>{let r=e[0],i=e[1],a=e[2],s=e[3],n=e[4],u=e[5];if(n&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let l=r.dims[0],p=r.dims[1],f=r.dims[2];if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==f)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(a.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let h=a.dims[0]/3,g=h,y=g;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let I of t.qkvHiddenSizes)if(I%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");h=t.qkvHiddenSizes[0],g=t.qkvHiddenSizes[1],y=t.qkvHiddenSizes[2]}let _=p;if(h!==g)throw new Error("qkv_hidden_sizes first element should be same as the second");if(a.dims[0]!==h+g+y)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let $=0;if(n){if(g!==y)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(n.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(n.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(n.dims[1]!==l)throw new Error('Input "past" second dimension must be batch_size');if(n.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(n.dims[4]!==g/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||($=n.dims[3])}let k=_+$,x=-1,b=0;if(s)throw new Error("Mask not supported");if(n)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==l||u.dims[1]!==t.numHeads||u.dims[2]!==p||u.dims[3]!==k)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:p,pastSequenceLength:$,kvSequenceLength:_,totalSequenceLength:k,maxSequenceLength:x,inputHiddenSize:f,hiddenSize:h,vHiddenSize:y,headSize:Math.floor(h/t.numHeads),vHeadSize:Math.floor(y/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Ar=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,au=(e,t,r,i,a,s,n,u)=>{let l=xe(n?1:s),p=64,f=s/l;f<p&&(p=32);let h=Math.ceil(s/l/p),g=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:a},{type:12,data:f},{type:12,data:h}],y=Ie(e.dataType,l),_=Oe(1,l),$=["type"];n&&$.push("type"),u&&$.push("type");let k=x=>{let b=H("x",e.dataType,e.dims,l),I=[b],S=n?N("seq_lens",n.dataType,n.dims):void 0;S&&I.push(S);let E=u?N("total_sequence_length_input",u.dataType,u.dims):void 0;E&&I.push(E);let A=Oe(e.dataType),C=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${p}>;
  var<workgroup> thread_sum: array<f32, ${p}>;
  ${x.registerUniforms(C).declareVariables(...I)}
  ${x.mainStart([p,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Ar(S,E,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${p}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${n?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${_}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${_}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${p}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${_}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${_}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${p}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${b.type.value}(${A}(1.0) / ${A}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${_}(x[offset + i]);
        x[offset + i] = ${b.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${n?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${b.type.value}(${A}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${p};${y};${l}`,inputDependencies:$},getShaderSource:k,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:a,z:t*r},programUniforms:g})}},nu=(e,t,r,i,a,s,n,u,l)=>{let p=n+s.kvSequenceLength,f=[s.batchSize,s.numHeads,s.sequenceLength,p],h=e>1&&i,g=s.kvNumHeads?s.kvNumHeads:s.numHeads,y=h?[s.batchSize,g,p,s.headSize]:void 0,_=s.nReps?s.nReps:1,$=s.scale===0?1/Math.sqrt(s.headSize):s.scale,k=xe(s.headSize),x=s.headSize/k,b=12,I={x:Math.ceil(p/b),y:Math.ceil(s.sequenceLength/b),z:s.batchSize*s.numHeads},S=[{type:12,data:s.sequenceLength},{type:12,data:x},{type:12,data:p},{type:12,data:s.numHeads},{type:12,data:s.headSize},{type:1,data:$},{type:12,data:n},{type:12,data:s.kvSequenceLength},{type:12,data:_}],E=h&&i&&O.size(i.dims)>0,A=["type","type"];E&&A.push("type"),a&&A.push("type"),u&&A.push("type"),l&&A.push("type");let C=[{dims:f,dataType:t.dataType,gpuDataType:0}];h&&C.push({dims:y,dataType:t.dataType,gpuDataType:0});let v=D=>{let q=N("q",t.dataType,t.dims,k),Q=N("key",r.dataType,r.dims,k),F=[q,Q];if(E){let re=N("past_key",i.dataType,i.dims,k);F.push(re)}a&&F.push(N("attention_bias",a.dataType,a.dims));let K=u?N("seq_lens",u.dataType,u.dims):void 0;K&&F.push(K);let R=l?N("total_sequence_length_input",l.dataType,l.dims):void 0;R&&F.push(R);let M=H("output",t.dataType,f),G=[M];h&&G.push(H("present_key",t.dataType,y,k));let J=Oe(1,k),ee=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;

  var<workgroup> tileQ: array<${q.type.storage}, ${b*b}>;
  var<workgroup> tileK: array<${q.type.storage}, ${b*b}>;
  ${D.registerUniforms(ee).declareVariables(...F,...G)}
  ${D.mainStart([b,b,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${_===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${_===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Ar(K,R,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${E&&h?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${h?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${J}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${E&&h?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${h?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${J}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(k){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${k}`)}})()};
        output[outputIdx] = ${M.type.value} (sum * uniforms.alpha) + ${a?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${k};${a!==void 0};${i!==void 0};${e}`,inputDependencies:A},getRunData:()=>({outputs:C,dispatchGroup:I,programUniforms:S}),getShaderSource:v}},su=(e,t,r,i,a,s,n=void 0,u=void 0)=>{let l=s+a.kvSequenceLength,p=a.nReps?a.nReps:1,f=a.vHiddenSize*p,h=e>1&&i,g=a.kvNumHeads?a.kvNumHeads:a.numHeads,y=h?[a.batchSize,g,l,a.headSize]:void 0,_=[a.batchSize,a.sequenceLength,f],$=12,k={x:Math.ceil(a.vHeadSize/$),y:Math.ceil(a.sequenceLength/$),z:a.batchSize*a.numHeads},x=[{type:12,data:a.sequenceLength},{type:12,data:l},{type:12,data:a.vHeadSize},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:12,data:f},{type:12,data:s},{type:12,data:a.kvSequenceLength},{type:12,data:p}],b=h&&i&&O.size(i.dims)>0,I=["type","type"];b&&I.push("type"),n&&I.push("type"),u&&I.push("type");let S=[{dims:_,dataType:t.dataType,gpuDataType:0}];h&&S.push({dims:y,dataType:t.dataType,gpuDataType:0});let E=A=>{let C=N("probs",t.dataType,t.dims),v=N("v",r.dataType,r.dims),D=[C,v];b&&D.push(N("past_value",i.dataType,i.dims));let q=n?N("seq_lens",n.dataType,n.dims):void 0;n&&D.push(q);let Q=u?N("total_sequence_length_input",u.dataType,u.dims):void 0;u&&D.push(Q);let F=[H("output",t.dataType,_)];h&&F.push(H("present_value",t.dataType,y));let K=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${$}u;
  var<workgroup> tileQ: array<${C.type.value}, ${$*$}>;
  var<workgroup> tileV: array<${C.type.value}, ${$*$}>;
  ${A.registerUniforms(K).declareVariables(...D,...F)}
  ${A.mainStart([$,$,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${p===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${p===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Ar(q,Q,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${b&&h?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${h?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${C.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${b&&h?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${h?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:I},getRunData:()=>({outputs:S,dispatchGroup:k,programUniforms:x}),getShaderSource:E}},pr=(e,t,r,i,a,s,n,u,l,p,f=void 0,h=void 0)=>{let g=Math.min(e.outputCount,1+(n?1:0)+(u?1:0)),y=g>1?n:void 0,_=g>1?u:void 0,$=g>1?p.pastSequenceLength:0,k=$+p.kvSequenceLength,x=l&&O.size(l.dims)>0?l:void 0,b=[t,r];y&&O.size(y.dims)>0&&b.push(y),x&&b.push(x),f&&b.push(f),h&&b.push(h);let I=e.compute(nu(g,t,r,y,x,p,$,f,h),{inputs:b,outputs:g>1?[-1,1]:[-1]})[0];e.compute(au(I,p.batchSize,p.numHeads,$,p.sequenceLength,k,f,h),{inputs:f&&h?[I,f,h]:[I],outputs:[]});let S=[I,i];_&&O.size(_.dims)>0&&S.push(_),f&&S.push(f),h&&S.push(h),e.compute(su(g,I,i,_,p,$,f,h),{inputs:S,outputs:g>1?[0,2]:[0]})},ou=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,a=t.inputHiddenSize,s=t.headSize,n=12,u={x:Math.ceil(t.headSize/n),y:Math.ceil(t.sequenceLength/n),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],p=[{type:12,data:i},{type:12,data:a},{type:12,data:s},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],f=h=>{let g=H("output_q",l[0].dataType,r),y=H("output_k",l[0].dataType,r),_=H("output_v",l[0].dataType,r),$=N("input",l[0].dataType,l[0].dims),k=N("weight",l[1].dataType,l[1].dims),x=N("bias",l[2].dataType,l[2].dims),b=$.type.storage,I=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${n}u;
  var<workgroup> tileInput: array<${b}, ${n*n}>;
  var<workgroup> tileWeightQ: array<${b}, ${n*n}>;
  var<workgroup> tileWeightK: array<${b}, ${n*n}>;
  var<workgroup> tileWeightV: array<${b}, ${n*n}>;
  ${h.registerUniforms(I).declareVariables($,k,x,g,y,_)}
  ${h.mainStart([n,n,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${b}(0);
    var valueK = ${b}(0);
    var valueV = ${b}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:p}),getShaderSource:f},{inputs:l,outputs:[-1,-1,-1]})},Vp=(e,t)=>{let r=iu(e.inputs,t),[i,a,s]=ou(e,r);return pr(e,i,a,s,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),uu,lu,du,Gp,t0=P(()=>{Le(),te(),ie(),Se(),ae(),uu=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,a,s)=>{let n=a.length;if(n!==i.length)throw new Error(`${s}: num dimensions != ${n}`);a.forEach((u,l)=>{if(u!==i[l])throw new Error(`${s}: dim[${l}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},lu=(e,t)=>{let{epsilon:r,spatial:i,format:a}=t,s=e[0].dims,n=i?xe(s[s.length-1]):1,u=a==="NHWC"&&s.length>1?n:1,l=O.size(s)/n,p=i,f=p?s.length:s,h=N("x",e[0].dataType,e[0].dims,n),g=N("scale",e[1].dataType,e[1].dims,u),y=N("bias",e[2].dataType,e[2].dims,u),_=N("inputMean",e[3].dataType,e[3].dims,u),$=N("inputVar",e[4].dataType,e[4].dims,u),k=H("y",e[0].dataType,f,n),x=()=>{let I="";if(i)I=`let cOffset = ${s.length===1?"0u":a==="NHWC"?`outputIndices[${s.length-1}] / ${n}`:"outputIndices[1]"};`;else if(a==="NCHW")I=`
            ${k.indicesSet("outputIndices","0","0")}
            let cOffset = ${k.indicesToOffset("outputIndices")};`;else{I=`var cIndices = ${g.type.indices}(0);
                       cIndices[0] = outputIndices[${s.length-1}];`;for(let S=1;S<g.rank;S++)I+=`cIndices[${S}] = outputIndices[${S}];`;I+=`let cOffset = ${g.indicesToOffset("cIndices")};`}return I},b=I=>`
  const epsilon = ${r};
  ${I.registerUniform("outputSize","u32").declareVariables(h,g,y,_,$,k)}
  ${I.mainStart()}
  ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${k.offsetToIndices(`global_idx * ${n}`)};
    ${x()}
    let scale = ${g.getByOffset("cOffset")};
    let bias = ${y.getByOffset("cOffset")};
    let inputMean = ${_.getByOffset("cOffset")};
    let inputVar = ${$.getByOffset("cOffset")};
    let x = ${h.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${k.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${n}`,inputDependencies:p?["rank","type","type","type","type"]:void 0},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:p?[{type:12,data:l},...Z(s)]:[{type:12,data:l}]})}},du=e=>he(e),Gp=(e,t)=>{let{inputs:r,outputCount:i}=e,a=du({...t,outputCount:i});if(ye.webgpu.validateInputContent&&uu(r,a),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(lu(r,a))}}),pu,cu,Hp,r0=P(()=>{ie(),ae(),pu=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},cu=e=>{let t=e[0].dims,r=e[0].dims[2],i=O.size(t)/4,a=e[0].dataType,s=N("input",a,t,4),n=N("bias",a,[r],4),u=N("residual",a,t,4),l=H("output",a,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:p=>`
  const channels = ${r}u / 4;
  ${p.declareVariables(s,n,u,l)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${s.getByOffset("global_idx")}
      + ${n.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},Hp=e=>{pu(e.inputs),e.compute(cu(e.inputs))}}),hu,ce,Fp,jp,Kp,Zp,Xp,Qp,Yp,Jp,ec,fu,tc,rc,ic,ac,sr,nc,Pr,sc,oc,uc,lc,dc,pc,cc,hc,fc,mc,gc,yc,_c,bc,$c,wc,Li,vc,xa,Sa,xc,Sc,kc,mu,gu,Tc,Za=P(()=>{te(),ie(),Se(),ae(),hu=(e,t,r,i,a,s,n)=>{let u=Math.ceil(t/4),l="";typeof a=="string"?l=`${a}(a)`:l=a("a");let p=N("inputData",r,[u],4),f=H("outputData",i,[u],4),h=[{name:"vec_size",type:"u32"}];return n&&h.push(...n),`
      ${e.registerUniforms(h).declareVariables(p,f)}

  ${s??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${p.getByOffset("global_idx")};
    ${f.setByOffset("global_idx",l)}
  }`},ce=(e,t,r,i,a,s=e.dataType,n,u)=>{let l=[{type:12,data:Math.ceil(O.size(e.dims)/4)}];return n&&l.push(...n),{name:t,shaderCache:{hint:a,inputDependencies:["type"]},getShaderSource:p=>hu(p,O.size(e.dims),e.dataType,s,r,i,u),getRunData:p=>({outputs:[{dims:e.dims,dataType:s}],dispatchGroup:{x:Math.ceil(O.size(p[0].dims)/64/4)},programUniforms:l})}},Fp=e=>{e.compute(ce(e.inputs[0],"Abs","abs"))},jp=e=>{e.compute(ce(e.inputs[0],"Acos","acos"))},Kp=e=>{e.compute(ce(e.inputs[0],"Acosh","acosh"))},Zp=e=>{e.compute(ce(e.inputs[0],"Asin","asin"))},Xp=e=>{e.compute(ce(e.inputs[0],"Asinh","asinh"))},Qp=e=>{e.compute(ce(e.inputs[0],"Atan","atan"))},Yp=e=>{e.compute(ce(e.inputs[0],"Atanh","atanh"))},Jp=e=>he(e),ec=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(ce(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},fu=e=>{let t,r,i=e.length>=2&&e[1].data!==0,a=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=a?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=a?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return he({min:t,max:r})},tc=(e,t)=>{let r=t||fu(e.inputs),i=Oe(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Clip",a=>`clamp(${a}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},rc=e=>{e.compute(ce(e.inputs[0],"Ceil","ceil"))},ic=e=>{e.compute(ce(e.inputs[0],"Cos","cos"))},ac=e=>{e.compute(ce(e.inputs[0],"Cosh","cosh"))},sr=e=>he(e),nc=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Pr=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,sc=e=>{let t=Oe(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,Pr(t)))},oc=e=>{e.compute(ce(e.inputs[0],"Exp","exp"))},uc=e=>{e.compute(ce(e.inputs[0],"Floor","floor"))},lc=e=>{let t=Oe(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,Pr(t)))},dc=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},pc=e=>{e.compute(ce(e.inputs[0],"Not",t=>`!${t}`))},cc=e=>{e.compute(ce(e.inputs[0],"Neg",t=>`-${t}`))},hc=e=>{e.compute(ce(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},fc=e=>{let t=Oe(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},mc=e=>{e.compute(ce(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},gc=e=>he(e),yc=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},_c=e=>{e.compute(ce(e.inputs[0],"Sin","sin"))},bc=e=>{e.compute(ce(e.inputs[0],"Sinh","sinh"))},$c=e=>{e.compute(ce(e.inputs[0],"Sqrt","sqrt"))},wc=e=>{e.compute(ce(e.inputs[0],"Tan","tan"))},Li=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,vc=e=>{e.compute(ce(e.inputs[0],"Tanh",Li))},xa=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Li("v")};
}
`,Sa=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,xc=e=>{let t=Oe(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"FastGelu",Sa,xa(t),void 0,e.inputs[0].dataType))},Sc=(e,t)=>{let r=Oe(e.inputs[0].dataType);return e.compute(ce(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},kc=e=>{e.compute(ce(e.inputs[0],"Log","log"))},mu=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,gu=e=>`quick_gelu_impl(${e})`,Tc=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"QuickGelu",gu,mu(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),yu,_u,Ic,i0=P(()=>{ie(),ae(),Za(),yu=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},_u=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=N("input",e[0].dataType,e[0].dims,4),i=N("bias",e[0].dataType,[e[0].dims[2]],4),a=H("output",e[0].dataType,t,4),s=O.size(t)/4,n=Ie(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${u.declareVariables(r,i,a)}

  ${Pr(n)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(s)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${a.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},Ic=e=>{yu(e.inputs),e.compute(_u(e.inputs))}}),bu,$u,je,Ec,zc,Cc,Ac,Oc,Rc,Bc,Nc,Mc,Dc,a0=P(()=>{te(),ie(),ae(),bu=(e,t,r,i,a,s,n,u,l,p,f,h)=>{let g,y;typeof u=="string"?g=y=(b,I)=>`${u}((${b}),(${I}))`:typeof u=="function"?g=y=u:(g=u.scalar,y=u.vector);let _=H("outputData",f,i.length,4),$=N("aData",l,t.length,4),k=N("bData",p,r.length,4),x;if(a)if(s){let b=O.size(t)===1,I=O.size(r)===1,S=t.length>0&&t[t.length-1]%4===0,E=r.length>0&&r[r.length-1]%4===0;b||I?x=_.setByOffset("global_idx",y(b?`${$.type.value}(${$.getByOffset("0")}.x)`:$.getByOffset("global_idx"),I?`${k.type.value}(${k.getByOffset("0")}.x)`:k.getByOffset("global_idx"))):x=`
            let outputIndices = ${_.offsetToIndices("global_idx * 4u")};
            let offsetA = ${$.broadcastedIndicesToOffset("outputIndices",_)};
            let offsetB = ${k.broadcastedIndicesToOffset("outputIndices",_)};
            ${_.setByOffset("global_idx",y(n||S?$.getByOffset("offsetA / 4u"):`${$.type.value}(${$.getByOffset("offsetA / 4u")}[offsetA % 4u])`,n||E?k.getByOffset("offsetB / 4u"):`${k.type.value}(${k.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else x=_.setByOffset("global_idx",y($.getByOffset("global_idx"),k.getByOffset("global_idx")));else{if(!s)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let b=(I,S,E="")=>{let A=`aData[indexA${S}][componentA${S}]`,C=`bData[indexB${S}][componentB${S}]`;return`
            let outputIndices${S} = ${_.offsetToIndices(`global_idx * 4u + ${S}u`)};
            let offsetA${S} = ${$.broadcastedIndicesToOffset(`outputIndices${S}`,_)};
            let offsetB${S} = ${k.broadcastedIndicesToOffset(`outputIndices${S}`,_)};
            let indexA${S} = offsetA${S} / 4u;
            let indexB${S} = offsetB${S} / 4u;
            let componentA${S} = offsetA${S} % 4u;
            let componentB${S} = offsetB${S} % 4u;
            ${I}[${S}] = ${E}(${g(A,C)});
          `};f===9?x=`
            var data = vec4<u32>(0);
            ${b("data",0,"u32")}
            ${b("data",1,"u32")}
            ${b("data",2,"u32")}
            ${b("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:x=`
            ${b("outputData[global_idx]",0)}
            ${b("outputData[global_idx]",1)}
            ${b("outputData[global_idx]",2)}
            ${b("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables($,k,_)}

        ${h??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${x}
      }`},$u=(e,t,r,i,a,s,n=r.dataType)=>{let u=r.dims.map(Number),l=i.dims.map(Number),p=!O.areEqual(u,l),f=u,h=O.size(u),g=!1,y=!1,_=[p];if(p){let $=Lt.calcShape(u,l,!1);if(!$)throw new Error("Can't perform binary op on the given tensors");f=$.slice(),h=O.size(f);let k=O.size(u)===1,x=O.size(l)===1,b=u.length>0&&u[u.length-1]%4===0,I=l.length>0&&l[l.length-1]%4===0;_.push(k),_.push(x),_.push(b),_.push(I);let S=1;for(let E=1;E<f.length;E++){let A=u[u.length-E],C=l[l.length-E];if(A===C)S*=A;else break}S%4===0?(y=!0,g=!0):(k||x||b||I)&&(g=!0)}else g=!0;return _.push(g),{name:e,shaderCache:{hint:t+_.map($=>$.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:$=>bu($,u,l,f,g,p,y,a,r.dataType,i.dataType,n,s),getRunData:()=>({outputs:[{dims:f,dataType:n}],dispatchGroup:{x:Math.ceil(h/64/4)},programUniforms:[{type:12,data:Math.ceil(O.size(f)/4)},...Z(u,l,f)]})}},je=(e,t,r,i,a,s)=>{e.compute($u(t,a??"",e.inputs[0],e.inputs[1],r,i,s))},Ec=e=>{je(e,"Add",(t,r)=>`${t}+${r}`)},zc=e=>{je(e,"Div",(t,r)=>`${t}/${r}`)},Cc=e=>{je(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},Ac=e=>{je(e,"Mul",(t,r)=>`${t}*${r}`)},Oc=e=>{let t=N("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;je(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},Rc=e=>{je(e,"Sub",(t,r)=>`${t}-${r}`)},Bc=e=>{je(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},Nc=e=>{je(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},Mc=e=>{je(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},Dc=e=>{je(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),wu,vu,xu,Su,Uc,Pc,n0=P(()=>{te(),ie(),Se(),ae(),wu=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],a=i.dataType,s=i.dims.length;e.forEach((n,u)=>{if(u!==r){if(n.dataType!==a)throw new Error("input tensors should be one type");if(n.dims.length!==s)throw new Error("input tensors should have the same shape");n.dims.forEach((l,p)=>{if(p!==t&&l!==i.dims[p])throw new Error("non concat dimensions must match")})}})},vu=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,xu=(e,t)=>{let r=e.length,i=[];for(let a=0;a<r;++a){let s=t.setByOffset("global_idx",e[a].getByIndices("indices"));r===1?i.push(s):a===0?i.push(`if (inputIndex == ${a}u) { ${s} }`):a===r-1?i.push(`else { ${s} }`):i.push(`else if (inputIndex == ${a}) { ${s} }`)}return i.join(`
`)},Su=(e,t,r,i)=>{let a=O.size(r),s=new Array(e.length),n=new Array(e.length),u=0,l=[],p=[],f=[{type:12,data:a}];for(let $=0;$<e.length;++$)u+=e[$].dims[t],s[$]=u,p.push(e[$].dims.length),n[$]=N(`input${$}`,i,p[$]),l.push("rank"),f.push({type:12,data:s[$]});for(let $=0;$<e.length;++$)f.push(...Z(e[$].dims));f.push(...Z(r));let h=H("output",i,r.length),g=h.indicesGet("indices",t),y=Array.from(Array(s.length).keys()).map($=>`uniforms.sizeInConcatAxis${$}`).join(","),_=$=>`

  ${(()=>{$.registerUniform("outputSize","u32");for(let k=0;k<e.length;k++)$.registerUniform(`sizeInConcatAxis${k}`,"u32");return $.declareVariables(...n,h)})()}

  ${vu(s.length,y)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${h.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${g});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${s.length}u>(${y});
      ${g} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${xu(n,h)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:f}),getShaderSource:_}},Uc=(e,t)=>{let r=e.inputs,i=r[0].dims,a=O.normalizeAxis(t.axis,i.length);wu(r,a);let s=i.slice();s[a]=r.reduce((u,l)=>u+(l.dims.length>a?l.dims[a]:0),0);let n=r.filter(u=>O.size(u.dims)>0);e.compute(Su(n,a,s,r[0].dataType),{inputs:n})},Pc=e=>he({axis:e.axis})}),At,Ot,Rt,Xa,Nt=P(()=>{te(),ie(),At=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Ot=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Rt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Xa=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[r,i]=e?.activation_params||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=e?.activation_params||[pp,cp];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=e?.activation_params||[.01];return{activation:t,alpha:r}}return{activation:t}}}),ze,qc,Qa=P(()=>{ze=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},qc=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),Lc,s0=P(()=>{Lc=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),lr,Ya,Ja=P(()=>{te(),ie(),ae(),Nt(),lr=(e,t,r,i,a)=>{let s=i-r;return`
      ${Array.from({length:r}).map((n,u)=>`
      if (${j(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,j(a,u+s,i))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},Ya=(e,t,r,i,a=!1,s)=>{let n=e[0].dims,u=e[1].dims,l=n[n.length-2],p=u[u.length-1],f=n[n.length-1],h=xe(p),g=xe(f),y=xe(l),_=O.size(r)/h/y,$=e.length>2,k=i?i.slice(0,-2):r.slice(0,-2),x=[O.size(k),l,p],b=[{type:12,data:_},{type:12,data:l},{type:12,data:p},{type:12,data:f}];Ot(t,b),b.push(...Z(k,n,u)),$&&b.push(...Z(e[2].dims)),b.push(...Z(x));let I=S=>{let E=Fa("batch_dims",e[0].dataType,k.length),A=N("a",e[0].dataType,n.length,g),C=N("b",e[1].dataType,u.length,h),v=H("output",e[0].dataType,x.length,h),D=Ie(v.type.tensor),q=At(t,v.type.value,D),Q=[A,C],F="";if($){let M=a?h:1;Q.push(N("bias",e[2].dataType,e[2].dims.length,M)),F=`${a?`value += bias[col / ${M}];`:`value += ${v.type.value}(bias[row + i]);`}`}let K=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Rt(t,K);let R=()=>{let M=`var a_data: ${A.type.value};`;for(let G=0;G<g;G++)M+=`
              let b_data${G} = b[(b_offset + (k + ${G}) * uniforms.N + col) / ${h}];`;for(let G=0;G<y;G++){M+=`a_data = a[(a_offset + (row + ${G}) * uniforms.K + k) / ${g}];`;for(let J=0;J<g;J++)M+=`
            values[${G}] = fma(${C.type.value}(a_data${g===1?"":`[${J}]`}), b_data${J}, values[${G}]);
`}return M};return`
  ${S.registerUniforms(K).registerInternalVariables(E).declareVariables(...Q,v)}
  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${h})) * ${h};
    var index1 = global_idx / (uniforms.N / ${h});
    let stride1 = uniforms.M / ${y};
    let row = (index1 % stride1) * ${y};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${E.offsetToIndices("batch")};`}

    var a_indices: ${A.type.indices};
    ${lr("a_indices",A,A.rank-2,E.rank,"batch_indices")}
    ${A.indicesSet("a_indices",A.rank-2,0)}
    ${A.indicesSet("a_indices",A.rank-1,0)}
    let a_offset = ${A.indicesToOffset("a_indices")};

    var b_indices: ${C.type.indices};
    ${lr("b_indices",C,C.rank-2,E.rank,"batch_indices")}
    ${C.indicesSet("b_indices",C.rank-2,0)}
    ${C.indicesSet("b_indices",C.rank-1,0)}
    let b_offset = ${C.indicesToOffset("b_indices")};
    var values: array<${v.type.value}, ${y}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${g}) {
      ${R()}
    }
    for (var i = 0u; i < ${y}u; i++) {
      var value = values[i];
      ${F}
      ${q}
      let cur_indices = ${v.type.indices}(batch, row + i, col);
      let offset = ${v.indicesToOffset("cur_indices")};
      ${v.setByOffset(`offset / ${h}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${h};${g};${y};${a}`,inputDependencies:$?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:s?s(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:b}),getShaderSource:I}}}),ku,Tu,ka,Wi,Iu,Ta,Eu,Fr,en=P(()=>{te(),ie(),ae(),Nt(),Ja(),Qa(),ku=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Tu=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,ka=(e,t,r="f32",i,a=!1,s=32,n=!1,u=32)=>{let l=t[1]*e[1],p=t[0]*e[0],f=a?l:s,h=a?s:l,g=f/t[0],y=s/t[1];if(!((a&&g===4&&e[1]===4||!a&&(g===3||g===4))&&f%t[0]===0&&s%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${a} is true, innerElementSize ${g} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${g} must be 3 or 4.
  tileAWidth ${f} must be divisible by workgroupSize[0]${t[0]}. tileInner ${s} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${g}<${r}>, ${f/g}>, ${h}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${p/e[0]}>, ${s}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${g};
const tileInner = ${s};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${n?"0":"i32(globalId.z)"};
  ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${l};

  let num_tiles = ${n?`${Math.ceil(u/s)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${n?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${y};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${ku(a,i)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${y}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${i?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${g===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Tu(a,g)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Wi=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Iu=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Ta=(e,t,r="f32",i,a=!1,s=32,n=!1,u=32,l=!1)=>{let p=e[1]*t[1],f=e[0]*t[0],h=a?p:s,g=a?s:p;if(!(g%t[1]===0&&h%t[0]===0&&s%t[1]===0))throw new Error(`tileAHight ${g} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${h} must be divisible by workgroupSize[0]${t[0]}, tileInner ${s} must be divisible by workgroupSize[1]${t[1]}`);let y=g/t[1],_=h/t[0],$=s/t[1],k=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${p};
    let globalColStart = i32(workgroupId.x) * ${f};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${g}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${h}; inputCol = inputCol + ${t[0]}) {
          ${Wi(a,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${s}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${f}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${i?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${a?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${p};

let tileRowA = i32(localId.y) * ${y};
let tileColA = i32(localId.x) * ${_};
let tileRowB = i32(localId.y) * ${$};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${y}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${_}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Wi(a,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${$}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${i?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Iu(a)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${h}>, ${g}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${f}>, ${s}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${s};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${n?"0":"i32(globalId.z)"};
    ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${n?`${Math.ceil(u/s)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${n?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${k}
  }
`},Eu=(e,t,r,i,a=!1)=>{let[s,n,u,l]=i,p=Ie(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${s.type.indices}) -> ${ze(e,p)} {
      var value = ${ze(e,p)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${n.type.indices};
        ${lr("aIndices",n,n.rank-2,s.rank,"batchIndices")}
        ${n.indicesSet("aIndices",n.rank-2,"u32(row)")}
        ${n.indicesSet("aIndices",n.rank-1,"u32(colIn)")}
        value = ${n.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${s.type.indices}) -> ${ze(e,p)} {
      var value = ${ze(e,p)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${lr("bIndices",u,u.rank-2,s.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${ze(e,p)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${a?"bias[colIn]":`${ze(e,p)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Fr=(e,t,r,i,a=!1,s)=>{let n=e[0].dims,u=e[1].dims,l=n.slice(0,-2),p=u.slice(0,-2),f=i?i.slice(0,-2):r.slice(0,-2),h=O.size(f),g=n[n.length-2],y=n[n.length-1],_=u[u.length-1],$=y%4===0&&_%4===0,k=g<=8?[4,1,1]:[4,4,1],x=[8,8,1],b=[Math.ceil(_/x[0]/k[0]),Math.ceil(g/x[1]/k[1]),Math.ceil(h/x[2]/k[2])],I=$?4:1,S=[...l,g,y/I],E=S.length,A=[...p,y,_/I],C=A.length,v=[h,g,_/I],D=[{type:6,data:g},{type:6,data:_},{type:6,data:y}];Ot(t,D),D.push(...Z(f,S,A));let q=["rank","rank"],Q=e.length>2;Q&&(D.push(...Z(e[2].dims)),q.push("rank")),D.push(...Z(v));let F=K=>{let R=f.length,M=Fa("batchDims",e[0].dataType,R,1),G=Ie(e[0].dataType),J=N("a",e[0].dataType,E,I),ee=N("b",e[1].dataType,C,I),re=H("result",e[0].dataType,v.length,I),ne=[J,ee];if(Q){let Te=a?I:1;ne.push(N("bias",e[2].dataType,e[2].dims.length,Te))}let U=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Rt(t,U);let Y=Ie(re.type.tensor),X=At(t,re.type.value,Y),V=Eu(I,Q,X,[M,J,ee,re],a);return`
  ${K.registerUniforms(U).registerInternalVariables(M).declareVariables(...ne,re)}
  ${V}
  ${$?ka(k,x,G,M):Ta(k,x,G,M)}
                   `};return{name:"MatMul",shaderCache:{hint:`${k};${t.activation};${$};${a}`,inputDependencies:q},getRunData:()=>({outputs:[{dims:s?s(r):r,dataType:e[0].dataType}],dispatchGroup:{x:b[0],y:b[1],z:b[2]},programUniforms:D}),getShaderSource:F}}}),zu,Wc,o0=P(()=>{te(),ot(),ae(),Nt(),Qa(),s0(),en(),zu=(e,t,r,i,a=!1,s,n=4,u=4,l=4,p="f32")=>{let f=D=>{switch(D){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${p}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${D} is not supported.`)}},h=D=>{switch(D){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${D} is not supported.`)}},g=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,y=e?`
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
    `,_=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",$=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",k=e?"row":"col",x=e?"col":"row",b=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${k} / outWidth;
    let outCol = ${k} % outWidth;

    let WRow = ${x} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${x} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${x} % inChannels;
    var resData = ${ze(n,p)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${_} && xCol >= 0 && xCol < ${$}) {
      ${g}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${f(n)}
    }
    return resData;`,I=e?t&&i?`
    let col = colIn * ${n};
    ${b}`:`
    let col = colIn * ${n};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${b}
    }
    return ${ze(n,p)}(0.0);`:i&&r?`
    let col = colIn * ${n};
    ${b}`:`
    let col = colIn * ${n};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${b}
    }
    return ${ze(n,p)}(0.0);`,S=e?i&&r?h(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${h(u)}
    }
    return ${ze(u,p)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${h(u)}
    }
    return ${ze(u,p)}(0.0);`,E=ze(l,p),A=ze(e?n:u,p),C=ze(e?u:n,p),v=At(s,E,p);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${A} {
      ${e?I:S}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${C} {
      ${e?S:I}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${E}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${y}
      ${qc(a)}
      ${v}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Wc=(e,t,r,i,a,s,n,u,l)=>{let p=t.format==="NHWC",f=p?e[0].dims[3]:e[0].dims[1],h=r[0],g=p?r[2]:r[3],y=p?r[1]:r[2],_=p?r[3]:r[1],$=p&&(f%4===0||f%3===0)&&_%4===0,k=p?_:g*y,x=p?g*y:_,b=[8,8,1],I=i<=8?[4,1,1]:[4,4,1],S=[Math.ceil(k/b[0]/I[0]),Math.ceil(x/b[1]/I[1]),Math.ceil(h/b[2]/I[2])];de("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${S}`);let E=$?p&&f%4!==0?3:4:1,A=b[1]*I[1],C=b[0]*I[0],v=Math.max(b[0]*E,b[1]),D=i%A===0,q=a%C===0,Q=s%v===0,F=$?[E,4,4]:[1,1,1],K=[{type:6,data:i},{type:6,data:a},{type:6,data:s},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Ot(t,K),K.push(...Z(e[0].dims,e[1].dims));let R=["rank","rank"];n&&(K.push(...Z(e[2].dims)),R.push("rank")),K.push(...Z(r));let M=G=>{let J=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Rt(t,J);let ee=$?4:1,re=Ie(e[0].dataType),ne=`
      fn setOutputAtIndex(flatIndex : i32, value : ${$?`vec4<${re}>`:re}) {
        result[flatIndex] = ${$?`vec4<${re}>`:re}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${$?`vec4<${re}>`:re}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${$?"/ 4":""}, value);
      }`,U=N("x",e[0].dataType,e[0].dims.length,E===3?1:E),Y=N("w",e[1].dataType,e[1].dims.length,ee),X=[U,Y],V=H("result",e[0].dataType,r.length,ee);if(n){let Te=N("bias",e[2].dataType,e[2].dims.length,ee);X.push(Te),ne+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${$?`vec4<${re}>`:re} {
          return bias[coords.${p?"w":"y"}${$?"/ 4":""}];
        }`}return`
        ${Lc("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${G.registerUniforms(J).declareVariables(...X,V)}
        ${ne}
        ${zu(p,D,q,Q,n,t,F[0],F[1],F[2],re)}
        ${$?ka(I,b,re,void 0,!p,v):Ta(I,b,re,void 0,!p,v,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${E};${$};${D};${q};${Q};${A};${C};${v}`,inputDependencies:R},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:e[0].dataType}],dispatchGroup:{x:S[0],y:S[1],z:S[2]},programUniforms:K}),getShaderSource:M}}}),Cu,Vi,Yt,Au,Gi,Ou,Vc,Gc,u0=P(()=>{te(),ot(),ie(),ae(),Nt(),Qa(),Cu=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},Vi=e=>typeof e=="number"?[e,e,e]:e,Yt=(e,t)=>t<=1?e:e+(e-1)*(t-1),Au=(e,t,r,i=1)=>{let a=Yt(t,i);return Math.floor((e[0]*(r-1)-r+a)/2)},Gi=(e,t,r,i,a)=>{a==null&&(a=Au(e,t[0],i[0]));let s=[0,0,0,r];for(let n=0;n<3;n++)e[n]+2*a>=t[n]&&(s[n]=Math.trunc((e[n]-t[n]+2*a)/i[n]+1));return s},Ou=(e,t,r,i,a,s,n,u,l,p)=>{let f,h,g,y;if(e==="VALID"&&(e=0),typeof e=="number"){f={top:e,bottom:e,left:e,right:e,front:e,back:e};let _=Gi([t,r,i,1],[u,l,p],1,[a,s,n],e);h=_[0],g=_[1],y=_[2]}else if(Array.isArray(e)){if(!e.every(($,k,x)=>$===x[0]))throw Error(`Unsupported padding parameter: ${e}`);f={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let _=Gi([t,r,i,1],[u,l,p],1,[a,s,n],e[0]);h=_[0],g=_[1],y=_[2]}else if(e==="SAME_UPPER"){h=Math.ceil(t/a),g=Math.ceil(r/s),y=Math.ceil(i/n);let _=(h-1)*a+u-t,$=(g-1)*s+l-r,k=(y-1)*n+p-i,x=Math.floor(_/2),b=_-x,I=Math.floor($/2),S=$-I,E=Math.floor(k/2),A=k-E;f={top:I,bottom:S,left:E,right:A,front:x,back:b}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:f,outDepth:h,outHeight:g,outWidth:y}},Vc=(e,t,r,i,a,s=!1,n="channelsLast")=>{let u,l,p,f,h;if(n==="channelsLast")[u,l,p,f,h]=e;else if(n==="channelsFirst")[u,h,l,p,f]=e;else throw new Error(`Unknown dataFormat ${n}`);let[g,,y,_,$]=t,[k,x,b]=Vi(r),[I,S,E]=Vi(i),A=Yt(y,I),C=Yt(_,S),v=Yt($,E),{padInfo:D,outDepth:q,outHeight:Q,outWidth:F}=Ou(a,l,p,f,k,x,b,A,C,v),K=s?g*h:g,R=[0,0,0,0,0];return n==="channelsFirst"?R=[u,K,q,Q,F]:n==="channelsLast"&&(R=[u,q,Q,F,K]),{batchSize:u,dataFormat:n,inDepth:l,inHeight:p,inWidth:f,inChannels:h,outDepth:q,outHeight:Q,outWidth:F,outChannels:K,padInfo:D,strideDepth:k,strideHeight:x,strideWidth:b,filterDepth:y,filterHeight:_,filterWidth:$,effectiveFilterDepth:A,effectiveFilterHeight:C,effectiveFilterWidth:v,dilationDepth:I,dilationHeight:S,dilationWidth:E,inShape:e,outShape:R,filterShape:t}},Gc=(e,t,r,i,a,s)=>{let n=s==="channelsLast";n?e[0].dims[3]:e[0].dims[1];let u=[64,1,1],l={x:r.map((k,x)=>x)},p=[Math.ceil(Cu(l.x.map(k=>r[k]))/u[0]),1,1];de("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${p}`);let f=1,h=O.size(r),g=[{type:12,data:h},{type:12,data:i},{type:12,data:a},{type:12,data:t.strides},{type:12,data:t.dilations}];Ot(t,g),g.push(...Z(e[0].dims,e[1].dims));let y=["rank","rank"],_=e.length===3;_&&(g.push(...Z(e[2].dims)),y.push("rank")),g.push(...Z(r));let $=k=>{let x=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:a.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Rt(t,x);let b=1,I=Ie(e[0].dataType),S=N("x",e[0].dataType,e[0].dims.length,f),E=N("W",e[1].dataType,e[1].dims.length,b),A=[S,E],C=H("result",e[0].dataType,r.length,b),v="";if(_){let Q=N("bias",e[2].dataType,e[2].dims.length,b);A.push(Q),v+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${I} {
          return bias[${n?j("coords",4,5):j("coords",1,5)}];
        }`}let D=ze(f,I),q=At(t,D,I);return`
            ${v}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${S.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${E.getByIndices("aIndices")};
            }
          ${k.registerUniforms(x).declareVariables(...A,C)}
          ${k.mainStart()}
          ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${C.offsetToIndices("global_idx")};
              let batch = ${j("coords",0,S.rank)};
              let d2 = ${n?j("coords",S.rank-1,S.rank):j("coords",1,S.rank)};
              let xFRCCorner = vec3<u32>(${n?j("coords",1,S.rank):j("coords",2,S.rank)},
              ${n?j("coords",2,S.rank):j("coords",3,S.rank)},
              ${n?j("coords",3,S.rank):j("coords",4,S.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${n?j("uniforms.x_shape",1,S.rank):j("uniforms.x_shape",2,S.rank)};
              let xShapeZ = ${n?j("uniforms.x_shape",2,S.rank):j("uniforms.x_shape",3,S.rank)};
              let xShapeW = ${n?j("uniforms.x_shape",3,S.rank):j("uniforms.x_shape",4,S.rank)};
              let xShapeU = ${n?j("uniforms.x_shape",4,S.rank):j("uniforms.x_shape",1,S.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${n?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${n?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${n?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${n?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${_?"value = value + getBiasByOutputCoords(coords)":""};
              ${q}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${n};${f};${_}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:p[0],y:p[1],z:p[2]},programUniforms:g}),getShaderSource:$}}}),Hc,Fc,l0=P(()=>{te(),ie(),ae(),Nt(),Hc=(e,t,r,i)=>{let a=e.length>2,s=a?"value += b[output_channel];":"",n=e[0].dims,u=e[1].dims,l=t.format==="NHWC",p=l?r[3]:r[1],f=p/t.group,h=l&&f>=4?xe(p):1,g=O.size(r)/h,y=[{type:12,data:g},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:f}];Ot(t,y),y.push(...Z(n,[u[0],u[1],u[2],u[3]/h]));let _=a?["rank","rank","rank"]:["rank","rank"];y.push(...Z([r[0],r[1],r[2],r[3]/h]));let $=k=>{let x=H("output",e[0].dataType,r.length,h),b=Ie(x.type.tensor),I=At(t,x.type.value,b),S=N("x",e[0].dataType,n.length),E=N("w",e[1].dataType,u.length,h),A=[S,E];a&&A.push(N("b",e[2].dataType,e[2].dims,h));let C=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Rt(t,C);let v=l?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${S.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${E.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${S.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${E.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${k.registerUniforms(C).declareVariables(...A,x)}

  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${x.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${h} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${x.type.value} = ${x.type.value}(0);
    ${v}
    ${s}
    ${I}
    ${x.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${h}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:y}),getShaderSource:$}},Fc=(e,t,r,i)=>{let a=e.length>2,s=xe(r[3]),n=xe(r[2]),u=O.size(r)/s/n,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/s],p=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/s],f=[r[0],r[1],r[2],r[3]/s],h=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Ot(t,h),h.push(...Z(l,p,f));let g=(n-1)*t.strides[1]+p[1],y=_=>{let $=H("output",e[0].dataType,f.length,s),k=Ie($.type.tensor),x=At(t,$.type.value,k),b=N("x",e[0].dataType,l.length,s),I=N("w",e[1].dataType,p.length,s),S=[b,I];a&&S.push(N("b",e[2].dataType,e[2].dims,s));let E=a?"value += b[output_channel];":"",A=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Rt(t,A),`
  ${_.registerUniforms(A).declareVariables(...S,$)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${n}u;
    let col = (index1 % width1) * ${n}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${b.type.value}, ${g}>;
    var values: array<${$.type.value}, ${n}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${p[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${g}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${b.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${b.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${p[1]}; w_width++) {
          let w_val = ${I.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${n}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${n}u; i++) {
      var value = values[i];
      ${E}
      ${x}
      ${$.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${s};${n};${g};${p[0]};${p[1]}`,inputDependencies:a?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:h}),getShaderSource:y}}}),Ru,Or,Bu,Rr,Ia,Hi,Nu,Mu,Ea,d0=P(()=>{ie(),o0(),u0(),en(),l0(),Nt(),Ja(),yt(),Ru=(e,t,r,i,a,s)=>{let n=e[0],u=e.slice(s?1:2,s?3:4),l=u.length,p=t[0],f=t.slice(2).map((g,y)=>g+(g-1)*(r[y]-1)),h=u.map((g,y)=>g+i[y]+i[y+l]).map((g,y)=>Math.floor((g-f[y]+a[y])/a[y]));return h.splice(0,0,n),h.splice(s?3:1,0,p),h},Or=[2,3,1,0],Bu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Rr=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let s=2;s<t[1].dims.length;++s)r[s-2]===0&&(r[s-2]=t[1].dims[s]);let i=e.pads.slice();Gr.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let a=Object.assign({},e);return Object.assign(a,{kernelShape:r,pads:i}),a},Ia=e=>{let t=Xa(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],a=e.dilations,s=e.group,n=e.kernel_shape,u=e.pads,l=e.strides,p=e.w_is_const();return{autoPad:i,format:r,dilations:a,group:s,kernelShape:n,pads:u,strides:l,wIsConst:p,...t,cacheKey:`${e.format};${t.activation};`}},Hi=(e,t,r,i)=>{let a=r.format==="NHWC",s=Ru(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,a);if(r.group!==1){let A=[t[0]];if(a){let C=e.kernelCustomData.wT??e.compute(Ue(t[1],Or),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=C),A.push(C)}else A.push(t[1]);t.length===3&&A.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&a&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Fc(A,r,s,i),{inputs:A}):e.compute(Hc(A,r,s,i),{inputs:A});return}let n=t.length===3,u=t[0].dims[a?1:2],l=t[0].dims[a?2:3],p=t[0].dims[a?3:1],f=t[1].dims[2],h=t[1].dims[3],g=s[a?1:2],y=s[a?2:3],_=s[a?3:1],$=a&&f===u&&h===l&&r.pads[0]===0&&r.pads[1]===0;if($||f===1&&h===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let A=s[0],C,v,D,q=[];if(a){let K=e.kernelCustomData.wT??e.compute(Ue(t[1],Or),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=K),$){let R=u*l*p;C=t[0].reshape([1,A,R]),v=K.reshape([1,R,_]),D=[1,A,_]}else C=t[0].reshape([A,u*l,p]),v=K.reshape([1,p,_]),D=[A,g*y,_];q.push(C),q.push(v)}else C=t[0].reshape([A,p,u*l]),v=t[1].reshape([1,_,p]),D=[A,_,g*y],q.push(v),q.push(C);n&&q.push(t[2]);let Q=D[2],F=q[0].dims[q[0].dims.length-1];Q<8&&F<8?e.compute(Ya(q,r,s,D,a,i),{inputs:q}):e.compute(Fr(q,r,s,D,a,i),{inputs:q});return}let k=!0,x=e.kernelCustomData.wT??e.compute(Ue(t[1],Or),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=x);let b=[t[0],x];n&&b.push(t[2]);let I=a?g*y:_,S=a?_:g*y,E=f*h*p;e.compute(Wc(b,r,s,I,S,E,n,k,i),{inputs:b})},Nu=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=[0,t.pads[0],0,t.pads[1]],s=[1].concat(t.strides),n=[1].concat(t.dilations),u=[1].concat(t.kernelShape),l=Rr({...t,pads:a,strides:s,dilations:n,kernelShape:u},i);Hi(e,i,l,p=>r?[p[0],p[2],p[3]]:[p[0],p[1],p[3]])},Mu=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",a=Rr(r,t),s=r.autoPad==="NOTSET"?r.pads:r.autoPad,n=Vc(t[0].dims,t[1].dims,r.strides,r.dilations,s,!1,i);e.compute(Gc(t,a,n.outShape,[n.filterDepth,n.filterHeight,n.filterWidth],[n.padInfo.front,n.padInfo.top,n.padInfo.left],i))},Ea=(e,t)=>{if(Bu(e.inputs,t),e.inputs[0].dims.length===3)Nu(e,t);else if(e.inputs[0].dims.length===5)Mu(e,e.inputs,t);else{let r=Rr(t,e.inputs);Hi(e,e.inputs,r)}}}),jc,p0=P(()=>{te(),ot(),ie(),ae(),jc=(e,t,r)=>{let i=e.length>2,a=t.outputShape,s=t.format==="NHWC",n=t.group,u=e[1].dims,l=u[2]/n,p=u[3],f=s?xe(l):1,h=s&&p===1&&l>=4,g=h?Math.floor(l/4)*4:Math.floor(l/f)*f,y=l-g,_=s?xe(p):1,$=s?p===1?f:_:1,k=O.size(a)/_,x=[Math.ceil(k/64),1,1];de("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${x}`);let b=["rank","rank"],I=[t.strides[0],t.strides[1]],S=[t.kernelShape[s?1:2],t.kernelShape[s?2:3]],E=[t.dilations[0],t.dilations[1]],A=[S[0]+(t.dilations[0]<=1?0:(t.kernelShape[s?1:2]-1)*(t.dilations[0]-1)),S[1]+(t.dilations[1]<=1?0:(t.kernelShape[s?2:3]-1)*(t.dilations[1]-1))],C=[A[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),A[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],v=[{type:12,data:k},{type:12,data:I},{type:12,data:S},{type:12,data:E},{type:12,data:A},{type:6,data:C},{type:12,data:g},{type:12,data:l},{type:12,data:p},...Z(e[0].dims,e[1].dims)];i&&(v.push(...Z(e[2].dims)),b.push("rank")),v.push(...Z(a));let D=q=>{let Q=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:I.length},{name:"filter_dims",type:"u32",length:S.length},{name:"dilations",type:"u32",length:S.length},{name:"effective_filter_dims",type:"u32",length:A.length},{name:"pads",type:"i32",length:C.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],F=Ie(e[0].dataType),K=s?1:2,R=s?2:3,M=s?3:1,G=N("W",e[1].dataType,e[1].dims.length,$),J=N("Dy",e[0].dataType,e[0].dims.length,f),ee=[J,G];i&&ee.push(N("bias",e[2].dataType,[a[M]].length,_));let re=H("result",e[0].dataType,a.length,_),ne=()=>{let X="";if(h)f===4?X+=`
        let xValue = ${J.getByOffset("x_offset")};
        let wValue = ${G.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:f===2?X+=`
          dotProd = dotProd + dot(vec4<${F}>(${J.getByOffset("x_offset")}, ${J.getByOffset("x_offset + 1u")}), vec4<${F}>(${G.getByOffset("w_offset")}, ${G.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:f===1&&(X+=`
          dotProd = dotProd + dot(vec4<${F}>(${J.getByOffset("x_offset")}, ${J.getByOffset("x_offset + 1u")}, ${J.getByOffset("x_offset + 2u")}, ${J.getByOffset("x_offset + 3u")}), vec4<${F}>(${G.getByOffset("w_offset")}, ${G.getByOffset("w_offset + 1u")}, ${G.getByOffset("w_offset + 2u")}, ${G.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(X+=`
                  let xValue = ${s?J.getByOffset(`${J.indicesToOffset(`${J.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${f}`):J.get("batch","inputChannel","idyR","idyC")};
        `,f===1)X+=`
          let w_offset = ${G.indicesToOffset(`${G.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${G.getByOffset(`w_offset / ${$}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let V=0;V<f;V++)X+=`
            let wValue${V} = ${G.getByOffset(`${G.indicesToOffset(`${G.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${V}, wOutChannel)`)} / ${$}`)};
            dotProd = dotProd + xValue[${V}] * wValue${V};`;return X},U=()=>{if(y===0)return"";if(!h)throw new Error(`packInputAs4 ${h} is not true.`);let X="";if(f===1){X+="dotProd = dotProd";for(let V=0;V<y;V++)X+=`
            + ${J.getByOffset(`x_offset + ${V}`)} * ${G.getByOffset(`w_offset + ${V}`)}`;X+=";"}else if(f===2){if(y!==2)throw new Error(`Invalid inputChannelsRemainder ${y}.`);X+=`
          let xValue = ${J.getByOffset("x_offset")};
          let wValue = ${G.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return X},Y=`
            let outputIndices = ${re.offsetToIndices(`global_idx * ${_}`)};
            let batch = ${re.indicesGet("outputIndices",0)};
            let d1 = ${re.indicesGet("outputIndices",M)};
            let r = ${re.indicesGet("outputIndices",K)};
            let c = ${re.indicesGet("outputIndices",R)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${re.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${F}(dyRCorner) + ${F}(wR)) / ${F}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${F}(uniforms.Dy_shape[${K}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${F}(dyCCorner) + ${F}(wC)) / ${F}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${F}(uniforms.Dy_shape[${R}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${h?`
                var x_offset = ${J.indicesToOffset(`${J.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${f};
                var w_offset = ${G.indicesToOffset(`${G.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${$};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${h?4:f}) {
                  ${ne()}
                  inputChannel = inputChannel + ${h?4:f};
                }
                ${U()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${_}]`:""};
            ${re.setByOffset("global_idx","value")};
          `;return`
    ${q.registerUniforms(Q).declareVariables(...ee,re)}
      ${q.mainStart()}
      ${q.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${Y}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${f}${$}${_}${h}${y}`,inputDependencies:b},getRunData:()=>({dispatchGroup:{x:x[0],y:x[1],z:x[2]},outputs:[{dims:r?r(a):a,dataType:e[0].dataType}],programUniforms:v}),getShaderSource:D}}}),Du,Uu,Pu,Fi,Kc,qu,ji,Lu,Zc,c0=P(()=>{p0(),Nt(),yt(),Du=(e,t,r,i,a,s)=>(e-1)*t+r+(i-1)*a+1-s,Uu=(e,t,r,i,a)=>{let s=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=s,r[a]=e-s):t==="SAME_LOWER"&&(r[i]=e-s,r[a]=s)},Pu=(e,t,r,i,a,s,n,u,l,p)=>{let f=e.length-2,h=p.length===0;l.length<f&&l.push(...Array(f-l.length).fill(0));let g=e[0],y=t[u?3:1]*a;for(let _=0,$=e.length-f-(u?1:0);_<f;++_,++$){let k=e[$],x=h?k*n[_]:p[_],b=Du(k,n[_],s[_],t[$],r[_],x);Uu(b,i,s,_,_+f),h&&p.push(n[_]*(k-1)+l[_]+(t[$]-1)*r[_]+1-s[_]-s[_+f])}p.splice(0,0,g),p.splice(u?3:1,0,y)},Fi=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((h,g)=>h*g,1)===0){r.length=0;for(let h=2;h<t[1].dims.length;++h)r.push(t[1].dims[h])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let a=e.pads.slice(),s=e.outputShape.slice(),n=e.outputPadding.slice(),u=t[0].dims,l=e.dilations.slice();if(l.reduce((h,g)=>h+g,0)===0){let h=t[0].dims.length-2;l=new Array(h).fill(1)}let p=e.strides.slice();if(p.reduce((h,g)=>h+g,0)===0){let h=t[0].dims.length-2;p=new Array(h).fill(1)}Pu(u,r,l,e.autoPad,e.group,a,p,i,n,s);let f=Object.assign({},e);return Object.assign(f,{kernelShape:r,pads:a,outputPadding:n,outputShape:s,dilations:l,strides:p}),f},Kc=e=>{let t=Xa(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],a=e.dilations,s=e.group??1,n=e.kernelShape,u=e.pads,l=e.strides,p=e.wIsConst(),f=e.outputPadding,h=e.outputShape;return{autoPad:i,format:r,dilations:a,group:s,kernelShape:n,outputPadding:f,outputShape:h,pads:u,strides:l,wIsConst:p,...t,cacheKey:`${e.format};${t.activation};`}},qu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let a=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==a))throw new Error("invalid bias");let s=e[0].dims.length-2;if(t.dilations.reduce((n,u)=>n+u,0)>0&&t.dilations.length!==s)throw new Error(`dilations should be ${s}D`);if(t.strides.reduce((n,u)=>n+u,0)>0&&t.strides.length!==s)throw new Error(`strides should be ${s}D`);if(t.pads.reduce((n,u)=>n+u,0)>0&&t.pads.length!==s*2)throw new Error(`pads should be ${s*2}D`);if(t.outputPadding.length!==s&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${s}D`);if(t.kernelShape.reduce((n,u)=>n+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},ji=(e,t,r,i)=>{let a=e.kernelCustomData.wT??e.compute(Ue(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=a);let s=[t[0],a];t.length===3&&s.push(t[2]),e.compute(jc(s,r,i),{inputs:s})},Lu=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=t.kernelShape;(a.length===0||a[0]===0)&&(a=[e.inputs[1].dims[2]]);let s=t.dilations;(s.length===0||s[0]===0)&&(s=[1]);let n=t.strides;(n.length===0||n[0]===0)&&(n=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],n=[1].concat(n),s=[1].concat(s),a=[1].concat(a);let l=t.outputPadding;l=[0].concat(l);let p=Fi({...t,pads:u,strides:n,dilations:s,kernelShape:a,outputPadding:l},i);ji(e,i,p,f=>r?[f[0],f[2],f[3]]:[f[0],f[1],f[3]])},Zc=(e,t)=>{if(qu(e.inputs,t),e.inputs[0].dims.length===3)Lu(e,t);else{let r=Fi(t,e.inputs);ji(e,e.inputs,r)}}}),Wu,Xc,Qc,h0=P(()=>{te(),ie(),Se(),ae(),Wu=(e,t,r,i)=>{let a=O.size(t),s=t.length,n=N("input",e,s),u=H("output",e,s),l=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),p=O.normalizeAxis(l,s),f=h=>{let g=` i32(${n.indicesGet("inputIndices","uniforms.axis")}) `,y=j("uniforms.input_shape","uniforms.axis",s),_=i.reverse?g+(i.exclusive?" + 1":""):"0",$=i.reverse?y:g+(i.exclusive?"":" + 1");return`
                ${h.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(n,u)}
                ${h.mainStart()}
                  ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${_};
                  let last : i32 = ${$};
                  for (var i : i32 = first; i < last; i++) {
                    ${n.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${n.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},{type:12,data:p},...Z(t,t)]}),getShaderSource:f}},Xc=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,a=e.inputs[1];e.compute(Wu(i,r,a,t),{inputs:[0]})},Qc=e=>{let t=e.exclusive===1,r=e.reverse===1;return he({exclusive:t,reverse:r})}}),Vu,Gu,Hu,Yc,Jc,f0=P(()=>{te(),ie(),Se(),ae(),Vu=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},Gu=(e,t,r,i)=>{let a=[];a.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let s=0;s<t;++s)a.push(r.indicesSet("a",e[s],`i[${s}]`));return a.push("return a;}"),a.join(`
`)},Hu=(e,t)=>{let r,i,a,s,n,u,l=t.format==="NHWC",p=t.blocksize,f=t.mode==="DCR";l?([r,i,a,s]=e.dims,n=f?[r,i,a,p,p,s/p**2]:[r,i,a,s/p**2,p,p],u=f?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,a,s]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],n=f?[r,p,p,s/p**2,i,a]:[r,s/p**2,p,p,i,a],u=f?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let h=e.reshape(n),g=h.dims.length,y=e.dataType,_=N("a",y,g),$=H("output",y,g),k=x=>`
  ${x.registerUniform("output_size","u32").declareVariables(_,$)}

  ${Gu(u,g,_,$)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${$.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${$.setByOffset("global_idx",_.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:x=>{let b=l?[r,i*p,a*p,s/p**2]:[r,s/p**2,i*p,a*p],I=O.size(b),S=h.dims,E=O.sortBasedOnPerm(S,u);return{outputs:[{dims:b,dataType:x[0].dataType}],dispatchGroup:{x:Math.ceil(I/64)},programUniforms:[{type:12,data:I},...Z(S,E)]}},getShaderSource:k}},Yc=(e,t)=>{Vu(e.inputs),e.compute(Hu(e.inputs[0],t))},Jc=e=>he({blocksize:e.blocksize,mode:e.mode,format:e.format})}),Br,Jt,Ki,Fu,ju,Ku,Zu,Zi,Xu,eh,th,m0=P(()=>{te(),ie(),Se(),ae(),Br="[a-zA-Z]|\\.\\.\\.",Jt="("+Br+")+",Ki="^"+Jt+"$",Fu="("+Jt+",)*"+Jt,ju="^"+Fu+"$",Ku=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},Zu=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(ju)))throw new Error("Invalid LHS term");if(r.split(",").forEach((a,s)=>{let n=e[s].dims.slice();if(!a.match(RegExp(Ki)))throw new Error("Invalid LHS term");let u=this.processTerm(a,!0,n,s);this.lhs.push(u)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([a,s])=>s.count===1||a==="...").map(([a])=>a).join("");else if(!i.match(RegExp(Jt)))throw new Error("Invalid RHS");i.match(RegExp(Br,"g"))?.forEach(a=>{if(a==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let s=this.symbolToInfo.get(a);if(s===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(s.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let a=r.length,s=!1,n=[],u=0;if(!e.match(RegExp(Ki))&&!t&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(Br,"g")),p=new Ku(i);return l?.forEach((f,h)=>{if(f==="..."){if(s)throw new Error("Only one ellipsis is allowed per input term");s=!0;let g=a-l.length+1;if(g<0)throw new Error("Ellipsis out of bounds");if(n=r.slice(u,u+g),this.hasEllipsis){if(this.ellipsisDims.length!==n.length||this.ellipsisDims.toString()!==n.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=n;else throw new Error("Ellipsis must be specified in the LHS");for(let y=0;y<n.length;y++){let _=String.fromCharCode(48+y);p.addSymbol(_,h+y),this.addSymbol(_,r[u++],i)}}else p.addSymbol(f,h+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(f,r[u++],i)}),p}},Zi=e=>e+"_max",Xu=(e,t,r,i)=>{let a=e.map(p=>p.length).map((p,f)=>N(`input${f}`,t,p)),s=O.size(i),n=H("output",t,i.length),u=[...r.symbolToInfo.keys()].filter(p=>!r.rhs.symbolToIndices.has(p)),l=p=>{let f=[],h="var prod = 1.0;",g="var sum = 0.0;",y="sum += prod;",_=[],$=[],k=[],x=[],b=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((S,E)=>{if(r.rhs.symbolToIndices.has(E)){let A=r.rhs.symbolToIndices.get(E)?.[0];A!==void 0&&r.lhs.forEach((C,v)=>{if(S.inputIndices.includes(v)){let D=C.symbolToIndices.get(E);if(D===void 0)throw new Error("Invalid symbol error");D.forEach(q=>{f.push(`${a[v].indicesSet(`input${v}Indices`,q,n.indicesGet("outputIndices",A))}`)})}})}else r.lhs.forEach((A,C)=>{if(S.inputIndices.includes(C)){let v=A.symbolToIndices.get(E);if(v===void 0)throw new Error("Invalid symbol error");v.forEach(D=>{_.push(`${a[C].indicesSet(`input${C}Indices`,D,`${E}`)}`)}),x.push(`prod *= ${a[C].getByIndices(`input${C}Indices`)};`)}}),$.push(`for(var ${E}: u32 = 0; ${E} < uniforms.${Zi(E)}; ${E}++) {`),k.push("}")});let I=b?[...f,`let sum = ${a.map((S,E)=>S.getByIndices(`input${E}Indices`)).join(" * ")};`]:[...f,g,...$,..._,h,...x,y,...k];return`
            ${p.registerUniforms(u.map(S=>({name:`${Zi(S)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...a,n)}

            ${p.mainStart()}
            ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${n.offsetToIndices("global_idx")};
            ${a.map((S,E)=>`var input${E}Indices: ${a[E].type.indices};`).join(`
`)}
            ${I.join(`
`)};
            ${n.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let p=u.filter(h=>r.symbolToInfo.has(h)).map(h=>({type:12,data:r.symbolToInfo.get(h)?.dimValue||0}));p.push({type:12,data:s});let f=e.map((h,g)=>[...Z(h)]).reduce((h,g)=>h.concat(g),p);return f.push(...Z(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:f}},getShaderSource:l}},eh=(e,t)=>{let r=new Zu(e.inputs,t.equation),i=r.outputDims,a=e.inputs.map((s,n)=>s.dims);e.compute(Xu(a,e.inputs[0].dataType,r,i))},th=e=>{let t=e.equation.replace(/\s+/g,"");return he({equation:t})}}),Qu,Xi,Yu,Ju,rh,g0=P(()=>{te(),ie(),ae(),Qu=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,a=t.length<r.length?0:t.length-r.length;for(;i<r.length&&a<t.length;++i,++a)if(r[i]!==t[a]&&r[i]!==1&&t[a]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Xi=(e,t)=>{let r=e.length-t.length,i=[];for(let a=0;a<r;++a)i.push(e[a]);for(let a=0;a<t.length;++a)i.push(t[a]===1?e[a+r]:t[a]);return i},Yu=(e,t)=>e.length>t.length?Xi(e,t):Xi(t,e),Ju=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=Yu(t,r),a=e[0].dataType,s=a===9||O.size(t)===1,n=a===9||t.length>0&&t[t.length-1]%4===0?4:1,u=s||i.length>0&&i[i.length-1]%4===0?4:1,l=Math.ceil(O.size(i)/u),p=h=>{let g=N("input",a,t.length,n),y=H("output",a,i.length,u),_;if(a===9){let $=(k,x,b="")=>`
          let outputIndices${x} = ${y.offsetToIndices(`outputOffset + ${x}u`)};
          let offset${x} = ${g.broadcastedIndicesToOffset(`outputIndices${x}`,y)};
          let index${x} = offset${x} / 4u;
          let component${x} = offset${x} % 4u;
          ${k}[${x}] = ${b}(${g.getByOffset(`index${x}`)}[component${x}]);
        `;_=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${$("data",0,"u32")}
        ${$("data",1,"u32")}
        ${$("data",2,"u32")}
        ${$("data",3,"u32")}
        ${y.setByOffset("global_idx","data")}
      }`}else _=`
        let outputIndices = ${y.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${g.broadcastedIndicesToOffset("outputIndices",y)};
        let data = ${y.type.value}(${g.getByOffset(`inputOffset / ${n}`)});
        ${y.setByOffset("global_idx","data")}
      }`;return`
    ${h.registerUniform("vec_size","u32").declareVariables(g,y)}
    ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${_}`},f=[{type:12,data:l},...Z(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${n}${u}`,inputDependencies:["rank"]},getShaderSource:p,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:f})}},rh=e=>{Qu(e.inputs),e.compute(Ju(e.inputs),{inputs:[0]})}}),el,ih,y0=P(()=>{te(),ie(),ae(),Za(),el=e=>{let t=e[0].dataType,r=O.size(e[0].dims),i=O.size(e[1].dims),a=i%4===0,s=n=>{let u=N("x",t,[1],4),l=N("bias",t,[1],4),p=H("y",t,[1],4),f=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],h=y=>`
      let bias${y}_offset: u32 = (global_idx * 4 + ${y}) % uniforms.bias_size;
      let bias${y} = ${l.getByOffset(`bias${y}_offset / 4`)}[bias${y}_offset % 4];`,g=a?`
      let bias = ${l.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${h(0)}${h(1)}${h(2)}${h(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${n.registerUniforms(f).declareVariables(u,l,p)}

    ${xa(Oe(t))}

    ${n.mainStart(Wt)}
      ${n.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${g}
      let x_in = x + bias;
      ${p.setByOffset("global_idx",Sa("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${a}`,inputDependencies:["type","type"]},getShaderSource:s,getRunData:n=>({outputs:[{dims:n[0].dims,dataType:n[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/Wt/4)}})}},ih=e=>{e.inputs.length<2||O.size(e.inputs[1].dims)===0?xc(e):e.compute(el(e.inputs))}}),tl,rl,ah,nh,_0=P(()=>{te(),ie(),Se(),ae(),tl=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},rl=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,s=O.normalizeAxis(t.axis,a),n=r.slice(0);n.splice(s,1,...i);let u=r[s],l=e[0].dataType===9?4:1,p=Math.ceil(O.size(n)/l),f=[{type:12,data:p},{type:6,data:u},{type:12,data:s},...Z(e[0].dims,e[1].dims,n)],h=g=>{let y=N("data",e[0].dataType,e[0].dims.length,l),_=N("inputIndices",e[1].dataType,e[1].dims.length),$=H("output",e[0].dataType,n.length,l),k=b=>{let I=i.length,S=`var indicesIndices${b}  = ${_.type.indices}(0);`;for(let E=0;E<I;E++)S+=`${I>1?`indicesIndices${b}[${E}]`:`indicesIndices${b}`} = ${n.length>1?`outputIndices${b}[uniforms.axis + ${E}]`:`outputIndices${b}`};`;S+=`
          var idx${b} = ${_.getByIndices(`indicesIndices${b}`)};
          if (idx${b} < 0) {
            idx${b} = idx${b} + uniforms.axisDimLimit;
          }
          var dataIndices${b} : ${y.type.indices};
        `;for(let E=0,A=0;E<a;E++)E===s?(S+=`${a>1?`dataIndices${b}[${E}]`:`dataIndices${b}`} = u32(idx${b});`,A+=I):(S+=`${a>1?`dataIndices${b}[${E}]`:`dataIndices${b}`} = ${n.length>1?`outputIndices${b}[${A}]`:`outputIndices${b}`};`,A++);return S},x;if(e[0].dataType===9){let b=(I,S,E="")=>`
          let outputIndices${S} = ${$.offsetToIndices(`outputOffset + ${S}u`)};
          ${k(S)};
          let offset${S} = ${y.indicesToOffset(`dataIndices${S}`)};
          let index${S} = offset${S} / 4u;
          let component${S} = offset${S} % 4u;
          ${I}[${S}] = ${E}(${y.getByOffset(`index${S}`)}[component${S}]);
        `;x=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${b("value",0,"u32")}
        ${b("value",1,"u32")}
        ${b("value",2,"u32")}
        ${b("value",3,"u32")}
        ${$.setByOffset("global_idx","value")}
      `}else x=`
      let outputIndices = ${$.offsetToIndices("global_idx")};
      ${k("")};
      let value = ${y.getByIndices("dataIndices")};
      ${$.setByOffset("global_idx","value")};
      `;return`
      ${g.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(y,_,$)}
      ${g.mainStart()}
        ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${x}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:f}),getShaderSource:h}},ah=e=>he({axis:e.axis}),nh=(e,t)=>{let r=e.inputs;tl(r),e.compute(rl(e.inputs,t))}}),il,sh,oh,b0=P(()=>{te(),ie(),ae(),il=(e,t,r,i,a,s,n,u,l)=>{let p=[{type:12,data:s},{type:12,data:i},{type:12,data:a},{type:12,data:r},{type:12,data:n},{type:12,data:u},{type:12,data:l}],f=[s];p.push(...Z(t.dims,f));let h=g=>{let y=N("indices_data",t.dataType,t.dims.length),_=H("input_slice_offsets_data",12,1,1),$=[y,_],k=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:a.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${g.registerUniforms(k).declareVariables(...$)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${a.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${a.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:f,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:p}),getShaderSource:h},{inputs:[t],outputs:[-1]})[0]},sh=(e,t)=>{let r=e.inputs,i=r[0].dims,a=r[0].dataType,s=r[1].dims,n=s[s.length-1],u=O.sizeToDimension(s,s.length-1),l=O.sizeFromDimension(i,t.batchDims+n),p=O.sizeToDimension(i,t.batchDims),f=O.sizeFromDimension(i,t.batchDims),h=u/p,g=new Array(n),y=l;for(let S=0;S<n;++S)g[n-1-S]=y,y*=i[t.batchDims+n-1-S];let _=il(e,r[1],g,t.batchDims,i,u,h,f,n),$=t.batchDims+n;if($>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let k=s.slice(0,-1).concat(i.slice($)),x=O.size(k),b=[{type:12,data:x},{type:12,data:l},...Z(r[0].dims,_.dims,k)],I=S=>{let E=N("data",r[0].dataType,r[0].dims.length),A=N("slice_offsets",12,_.dims.length),C=H("output",r[0].dataType,k.length);return`
          ${S.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(E,A,C)}
            ${S.mainStart()}
            ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:k,dataType:a}],dispatchGroup:{x:Math.ceil(x/64)},programUniforms:b}),getShaderSource:I},{inputs:[r[0],_]})},oh=e=>({batchDims:e.batch_dims,cacheKey:""})}),al,nl,uh,lh,$0=P(()=>{te(),ie(),Se(),ae(),al=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=O.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,a=e[0],s=e[2],n=e.length===4?e[3]:void 0;if(s.dims.length!==a.dims.length||!a.dims.map((u,l)=>l===r?Math.ceil(u/i)===s.dims[l]:u===s.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(n){if(n.dataType!==a.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(n.dims.length!==s.dims.length||!n.dims.map((u,l)=>u===s.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},nl=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,s=O.normalizeAxis(t.gatherAxis,a),n=O.normalizeAxis(t.quantizeAxis,a),u=r.slice(0);u.splice(s,1,...i);let l=O.size(u),p=e[2].dataType,f=e[0].dataType===22,h=[{type:12,data:l},{type:12,data:n},{type:12,data:s},{type:12,data:t.blockSize},...Z(...e.map((y,_)=>y.dims),u)],g=y=>{let _=N("data",e[0].dataType,e[0].dims.length),$=N("inputIndices",e[1].dataType,e[1].dims.length),k=N("scales",e[2].dataType,e[2].dims.length),x=e.length>3?N("zeroPoint",e[3].dataType,e[3].dims.length):void 0,b=H("output",p,u.length),I=[_,$,k];x&&I.push(x);let S=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${y.registerUniforms(S).declareVariables(...I,b)}
        ${y.mainStart()}
        let output_indices = ${b.offsetToIndices("global_idx")};
        var indices_indices = ${$.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${b.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${$.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${b.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${_.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${b.indicesGet("output_indices","i")};
          ${_.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${$.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[s]};
        }
        ${_.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${b.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${_.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${_.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${_.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${f?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${k.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${k.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${k.getByIndices("scale_indices")};
        ${x?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${x.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${x.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${f?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Oe(p)}(quantized_data - zero_point) * scale;
        ${b.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((y,_)=>_!==1).map(y=>y.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(y,_)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:p}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:h}),getShaderSource:g}},uh=(e,t)=>{let r=e.inputs;al(r,t),e.compute(nl(e.inputs,t))},lh=e=>he({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),sl,ol,dh,ph,w0=P(()=>{te(),ie(),Se(),ae(),sl=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},ol=(e,t)=>{let r=e[0].dims,i=e[0].dataType,a=r.length,s=e[1].dims,n=e[1].dataType,u=O.normalizeAxis(t.axis,a),l=r[u],p=s.slice(0),f=O.size(p),h=N("input",i,a),g=N("indicesInput",n,s.length),y=H("output",i,p.length),_=[{type:12,data:f},{type:6,data:l},{type:12,data:u}];return _.push(...Z(r,s,p)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:p,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:_}),getShaderSource:$=>`
      ${$.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(h,g,y)}
      ${$.mainStart()}
      ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${y.offsetToIndices("global_idx")};

      var idx = ${g.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${h.type.indices}(outputIndices);
      ${h.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${h.getByIndices("inputIndices")};

      ${y.setByOffset("global_idx","value")};
  }`}},dh=e=>he({axis:e.axis}),ph=(e,t)=>{let r=e.inputs;sl(r),e.compute(ol(e.inputs,t))}}),ul,ll,ch,hh,v0=P(()=>{te(),ie(),ae(),ul=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},ll=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[a,s,n]=dp.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),u=[a,s];if(!u)throw new Error("Can't use gemm on the given tensors");let l=16,p=Math.ceil(s/l),f=Math.ceil(a/l),h=!0,g=O.size(u),y=[{type:12,data:h?p:g},{type:12,data:a},{type:12,data:s},{type:12,data:n},{type:1,data:t.alpha},{type:1,data:t.beta}],_=["type","type"];e.length===3&&(y.push(...Z(e[2].dims)),_.push("rank")),y.push(...Z(u));let $=x=>{let b="";t.transA&&t.transB?b="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?b="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?b="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(b="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let I=t.alpha===1?"":"value *= uniforms.alpha;",S=N("a",e[0].dataType,e[0].dims),E=N("b",e[1].dataType,e[1].dims),A=S.type.value,C=null,v=[S,E];e.length===3&&(C=N("c",e[2].dataType,e[2].dims.length),v.push(C));let D=H("output",e[0].dataType,u.length);v.push(D);let q=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${x.registerUniforms(q).declareVariables(...v)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${A}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${b}
    }

    ${I}
    ${C!=null?`let cOffset = ${C.broadcastedIndicesToOffset("vec2(m, n)",D)}; value += ${A}(uniforms.beta) * ${C.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},k=x=>{let b=N("a",e[0].dataType,e[0].dims),I=N("b",e[1].dataType,e[1].dims),S=null,E=[b,I];e.length===3&&(S=N("c",e[2].dataType,e[2].dims.length),E.push(S));let A=H("output",e[0].dataType,u.length);E.push(A);let C=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],v="",D="";t.transA&&t.transB?(D=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,v="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(D=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,v="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(D=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,v="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(D=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,v="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let q=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${x.registerUniforms(C).declareVariables(...E)}
  var<workgroup> tile_a: array<array<${b.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${I.type.storage}, ${l}>, ${l}>;
  ${x.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${A.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${D}
      k_start = k_start + ${l};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${l}; k++) {
        ${v}
      }
      workgroupBarrier();
    }

    ${q}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${S!=null?`let cOffset = ${S.broadcastedIndicesToOffset("vec2(m, n)",A)}; value += ${A.type.value}(uniforms.beta) * ${S.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return h?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:p*f},programUniforms:y}),getShaderSource:k}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:y}),getShaderSource:$}},ch=e=>{let t=e.transA,r=e.transB,i=e.alpha,a=e.beta;return{transA:t,transB:r,alpha:i,beta:a,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},hh=(e,t)=>{ul(e.inputs),e.compute(ll(e.inputs,t))}}),tt,nt,vt,xt,dl,pl,cl,hl,fl,ml,gl,yl,fh,mh,x0=P(()=>{te(),ie(),Se(),ae(),[tt,nt,vt,xt]=[0,1,2,3],dl=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},pl=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,cl=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,hl=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,fl=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,ml=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${tt}] = batch;
     indices[${nt}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${vt}] = u32(r);
            indices[${xt}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${vt}] = u32(clamp(r, 0, H - 1));
          indices[${xt}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${vt}] = gs_reflect(r, border[1], border[3]);
          indices[${xt}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,gl=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${tt}], indices[${nt}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${tt}], indices[${nt}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${tt}], indices[${nt}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${tt}], indices[${nt}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${tt}], indices[${nt}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${tt}], indices[${nt}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,yl=(e,t)=>{let r=N("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],a=N("grid",e[1].dataType,i.length,2),s=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(s=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[tt,nt,vt,xt]=[0,3,1,2]);let n=H("output",e[0].dataType,s.length),u=r.type.value,l=O.size(s),p=[{type:12,data:l},...Z(e[0].dims,i,s)],f=h=>`
  ${h.registerUniform("output_size","u32").declareVariables(r,a,n)}
  ${pl}
  ${cl(u)}
  ${hl(t)}
  ${fl(t)}
  ${ml(r,u,t)}

  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${vt}]);
      let W_in = i32(uniforms.x_shape[${xt}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${n.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${tt}], indices[${vt}], indices[${xt}]);
      let nxy = ${a.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${gl(n,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:h=>{let g=O.size(s);return{outputs:[{dims:s,dataType:h[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:p}},getShaderSource:f}},fh=(e,t)=>{dl(e.inputs),e.compute(yl(e.inputs,t))},mh=e=>he({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Ne,_l,gh,Qi,bl,or,yh,_h=P(()=>{te(),ie(),Se(),Ha(),Ka(),ae(),yt(),Ne=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,_l=(e,t)=>{let r=e[0],i=Ne(e,1),a=Ne(e,2),s=Ne(e,3),n=Ne(e,4),u=Ne(e,5),l=Ne(e,6),p=Ne(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let f=r.dims[0],h=r.dims[1],g=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],y=h,_=0,$=0,k=Math.floor(g/t.numHeads);if(l&&p&&O.size(l.dims)&&O.size(p.dims)){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims[0]!==f||l.dims[1]!==t.numHeads||l.dims[3]!==k)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(p.dims[0]!==f||p.dims[1]!==t.numHeads||p.dims[3]!==k)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[2]!==p.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(p.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');_=l.dims[2],$=l.dims[2]}else if(l&&O.size(l.dims)||p&&O.size(p.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let x;if(i&&O.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');x=2,y=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==k)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');x=5,y=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==k)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');x=0,y=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');x=3}if(s&&O.size(s.dims)>0){if(s.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let b=_+y,I=0;if(n&&O.size(n.dims)>0){I=8;let C=n.dims;throw C.length===1?C[0]===f?I=1:C[0]===3*f+2&&(I=3):C.length===2&&C[0]===f&&C[1]===b&&(I=5),I===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let S=!1,E=g;if(a&&O.size(a.dims)>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(y!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');E=a.dims[2]}else{if(y!==a.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');E=a.dims[1]*a.dims[3],S=!0}}let A=!1;if(n&&O.size(n.dims)>0)throw new Error("Key padding mask is not supported");if(u&&O.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==f||u.dims[1]!==t.numHeads||u.dims[2]!==h||u.dims[3]!==b)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:f,sequenceLength:h,pastSequenceLength:_,kvSequenceLength:y,totalSequenceLength:b,maxSequenceLength:$,inputHiddenSize:0,hiddenSize:g,vHiddenSize:E,headSize:k,vHeadSize:Math.floor(E/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:I,scale:t.scale,broadcastResPosBias:A,passPastInKv:S,qkvFormat:x}},gh=e=>he({...e}),Qi=he({perm:[0,2,1,3]}),bl=(e,t,r,i,a,s,n)=>{let u=[i,a,s],l=O.size(u),p=[{type:12,data:l},{type:12,data:n},{type:12,data:s}],f=h=>{let g=H("qkv_with_bias",t.dataType,u),y=N("qkv",t.dataType,u),_=N("bias",r.dataType,u),$=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${h.registerUniforms($).declareVariables(y,_,g)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:p}),getShaderSource:f},{inputs:[t,r],outputs:[-1]})[0]},or=(e,t,r,i,a,s,n,u)=>{let l=s;if(n&&O.size(n.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=bl(e,s,n,t,i,r*a,u),l=l.reshape([t,i,r,a]),r===1||i===1?l:e.compute(Ue(l,Qi.perm),{inputs:[l],outputs:[-1]})[0]}else return s.dims.length===3&&(l=s.reshape([t,i,r,a])),r===1||i===1?l:e.compute(Ue(l,Qi.perm),{inputs:[l],outputs:[-1]})[0]},yh=(e,t)=>{let r=_l(e.inputs,t),i=e.inputs[0],a=Ne(e.inputs,1),s=Ne(e.inputs,2),n=Ne(e.inputs,3),u=Ne(e.inputs,4),l=Ne(e.inputs,5),p=Ne(e.inputs,6),f=Ne(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if(a?.dims.length===5)throw new Error("Packed KV is not implemented");let h=a&&s&&a.dims.length===4&&s.dims.length===4,g=or(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,n,0);if(h)return pr(e,g,a,s,u,void 0,p,f,l,r);if(!a||!s)throw new Error("key and value must be provided");let y=or(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,a,n,r.hiddenSize),_=or(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,s,n,2*r.hiddenSize);pr(e,g,y,_,u,void 0,p,f,l,r)}}),$l,wl,vl,xl,za,bh,$h,wh=P(()=>{te(),ie(),Se(),ae(),$l=e=>{if(!e||e.length<1)throw new Error("too few inputs")},wl=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(a=>r.push(Number(a))),i=r.length),he({numOutputs:i,axis:t.axis,splitSizes:r})},vl=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${j("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,xl=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let a=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(a):i===0?r.push(`if (output_number == ${i}u) { ${a} }`):i===t-1?r.push(`else { ${a} }`):r.push(`else if (output_number == ${i}) { ${a} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},za=(e,t)=>{let r=e[0].dims,i=O.size(r),a=e[0].dataType,s=O.normalizeAxis(t.axis,r.length),n=new Array(t.numOutputs),u=N("input",a,r.length),l=new Array(t.numOutputs),p=[],f=[],h=0,g=[{type:12,data:i}];for(let _=0;_<t.numOutputs;_++){h+=t.splitSizes[_],l[_]=h;let $=r.slice();$[s]=t.splitSizes[_],f.push($),n[_]=H(`output${_}`,a,$.length),p.push({dims:f[_],dataType:e[0].dataType})}g.push({type:12,data:l},...Z(r,...f));let y=_=>`
  ${_.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(u,...n)}
  ${vl(l.length)}
  ${xl(n)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",s)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${j("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${u.indicesSet("indices",s,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:y,getRunData:()=>({outputs:p,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:g})}},bh=(e,t)=>{$l(e.inputs);let r=e.inputs.length===1?t:wl(e.inputs,t);e.compute(za(e.inputs,r),{inputs:[0]})},$h=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes length must be equal");return he({axis:t,numOutputs:i,splitSizes:r})}}),Sl,jr,vh,xh=P(()=>{te(),ie(),Se(),ae(),Sl=(e,t)=>{let[r,i,a,s]=e,{numHeads:n,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!O.areEqual(i.dims,[])&&!O.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(s.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${s.dims.length}`);if(!O.areEqual(a.dims,s.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&n===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],p=r.dims[r.dims.length-2],f=a.dims[0],h=O.sizeFromDimension(r.dims,1)/p,g=u===0?a.dims[1]*2:h/n;if(u>g)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(l!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(p!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(p>f)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");if(g/2!==a.dims[1]&&u/2!==a.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${a.dims[1]}`)},jr=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:a,scale:s}=t,n=e[0].dims[0],u=O.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],p=u/l,f=e[2].dims[1],h=a===0?f*2:p/i,g=new Array(n,l,p/h,h-f),y=O.computeStrides(g),_=[{type:1,data:s},{type:12,data:g},{type:12,data:y},...e[0].dims.length===3?new Array({type:12,data:[u,p,h,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,h,l*h,1]}):[],...Z(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],$=k=>{let x=N("input",e[0].dataType,e[0].dims.length),b=N("position_ids",e[1].dataType,e[1].dims.length),I=N("cos_cache",e[2].dataType,e[2].dims.length),S=N("sin_cache",e[3].dataType,e[3].dims.length),E=H("output",e[0].dataType,e[0].dims.length);return k.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:g.length},{name:"global_strides",type:"u32",length:y.length},{name:"input_output_strides",type:"u32",length:y.length}]),`
        ${k.declareVariables(x,b,I,S,E)}

        ${k.mainStart(Wt)}
          let half_rotary_emb_dim = uniforms.${I.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${k.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${b.broadcastedIndicesToOffset("bsnh.xy",H("",b.type.tensor,2))};
            let position_id =
                u32(${b.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${x.getByOffset("i")} * ${I.get("position_id","bsnh[3]")} -
                ${x.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${E.setByOffset("i","re")}
            let im = ${x.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} +
                ${x.getByOffset("j")} * ${I.get("position_id","bsnh[3]")};
            ${E.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${E.setByOffset("k",x.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:he({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(O.size(g)/Wt)},programUniforms:_})}},vh=(e,t)=>{Sl(e.inputs,t),e.compute(jr(e.inputs,t))}}),kl,Tl,Yi,Il,Sh,S0=P(()=>{Se(),te(),Ka(),_h(),wh(),yt(),xh(),ae(),kl=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],a=e[2],s=e[3],n=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,l=r.dims[0],p=r.dims[1],f=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],h=p,g=0,y=!i||i.dims.length===0,_=Math.floor(y?f/(t.numHeads+2*t.kvNumHeads):f/t.numHeads);y&&(f=_*t.numHeads);let $=s&&s.dims.length!==0,k=n&&n.dims.length!==0;if($&&s.dims.length===4&&s.dims[0]===l&&s.dims[1]!==t.kvNumHeads&&s.dims[2]===t.kvNumHeads&&s.dims[3]===_)throw new Error("BSNH pastKey/pastValue is not supported");if($&&k){if(s.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(n.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');g=s.dims[2]}else if($||k)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let x=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');h=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==_)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');h=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==_)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');h=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');x=3}let b=0,I=!1,S=t.kvNumHeads?_*t.kvNumHeads:f;if(a&&a.dims.length>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(h!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');S=a.dims[2]}else{if(h!==a.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');S=a.dims[1]*a.dims[3],I=!0}}let E=e.length>4?e[5]:void 0;if(E){if(E.dims.length===0)throw new Error("seqlens_k must be at least 1D, got scalar.");let A=E.dims.reduce((C,v)=>C*v,1);if(A!==l)throw new Error(`seqlens_k must have batch_size (${l}) elements, got ${A}.`);for(let C=0;C<E.dims.length;C++)if(E.dims[C]!==1&&E.dims[C]!==l)throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${l}), got dims[${C}] = ${E.dims[C]}.`)}return{batchSize:l,sequenceLength:p,pastSequenceLength:g,kvSequenceLength:h,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:f,vHiddenSize:S,headSize:_,vHeadSize:Math.floor(S/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:I,qkvFormat:x}},Tl=he({perm:[0,2,1,3]}),Yi=(e,t,r)=>{let i=t,a=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,a,r.headSize]),i=e.compute(Ue(i,Tl.perm),{inputs:[i],outputs:[-1]})[0]),i},Il=(e,t,r,i)=>{let a=7,s=["type","type"],n=[e*t],u=e*t,l=[{type:12,data:u},{type:12,data:t},{type:12,data:e}],p=f=>{let h=N("seq_lens",r.dataType,r.dims),g=N("total_seq_lens",i.dataType,i.dims),y=H("pos_ids",a,n),_=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${f.registerUniforms(_).declareVariables(h,g,y)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${g.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${h.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${y.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${y.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${y.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:s},getRunData:()=>({outputs:[{dims:n,dataType:a}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:p}},Sh=(e,t)=>{let r=kl(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],a=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,s=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,n=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,p=e.inputs.length>5?e.inputs[6]:void 0,f=r.kvNumHeads?r.kvNumHeads:r.numHeads,h=he({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,f*r.headSize,f*r.headSize]}),[g,y,_]=!a&&!s?e.compute(za([i],h),{inputs:[i],outputs:[-1,-1,-1]}):[i,a,s],$,k;if(t.doRotary){let S=e.compute(Il(r.batchSize,r.sequenceLength,l,p),{inputs:[l,p],outputs:[-1]})[0],E=e.inputs[7],A=e.inputs[8],C=he({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),v=[g,S,E,A],D=[-1];$=e.compute(jr(v,C),{inputs:v,outputs:D})[0],v.splice(0,1,y);let q=he({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});k=e.compute(jr(v,q),{inputs:v,outputs:D})[0]}let x=or(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?$:g,void 0,0),b=Yi(e,t.doRotary?k:y,r),I=Yi(e,_,r);pr(e,x,b,I,void 0,void 0,n,u,void 0,r,l,p)}}),Ji,El,zl,kh,k0=P(()=>{te(),ie(),yt(),ae(),Ji=(e,t,r,i,a,s,n,u)=>{let l=xe(s),p=l===1?"f32":`vec${l}f`,f=l===1?"vec2f":`mat2x${l}f`,h=a*n,g=64;h===1&&(g=256);let y=[a,n,s/l],_=[a,n,2],$=["rank","type","type"],k=[];k.push(...Z(y,_));let x=b=>{let I=N("x",t.dataType,3,l),S=N("scale",r.dataType,r.dims),E=N("bias",i.dataType,i.dims),A=H("output",1,3,2),C=[I,S,E,A];return`
  var<workgroup> workgroup_shared : array<${f}, ${g}>;
  const workgroup_size = ${g}u;
  ${b.declareVariables(...C)}
  ${b.mainStart(g)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${p}(0);
    var squared_sum = ${p}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${p}(${I.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${f}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${gt("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${gt("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${u};${g}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:_,dataType:1}],dispatchGroup:{x:h},programUniforms:k}),getShaderSource:x},{inputs:[t,r,i],outputs:[-1]})[0]},El=(e,t,r)=>{let i=t[0].dims,a=i,s=2,n=i[0],u=i[1],l=O.sizeFromDimension(i,s),p=xe(l),f=O.size(a)/p,h=Ji(e,t[0],t[1],t[2],n,l,u,r.epsilon),g=[n,u,l/p],y=[n,u],_=["type","none"],$=k=>{let x=N("x",t[0].dataType,g.length,p),b=N("scale_shift",1,y.length,2),I=H("output",t[0].dataType,g.length,p),S=[x,b,I];return`
  ${k.registerUniform("output_size","u32").declareVariables(...S)}
  ${k.mainStart()}
  ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${I.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${b.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${x.getByOffset("global_idx")} * ${I.type.value}(scale_shift.x) + ${I.type.value}(scale_shift.y);
      ${I.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${p}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},...Z(g,y,g)]}),getShaderSource:$},{inputs:[t[0],h]})},zl=(e,t,r)=>{let i=t[0].dims,a=i,s=i[0],n=i[i.length-1],u=O.sizeFromDimension(i,1)/n,l=xe(n),p=O.size(a)/l,f=[{type:12,data:u},{type:12,data:Math.floor(n/l)}],h=["type","type"],g=!1,y=[0,i.length-1];for(let x=0;x<i.length-2;x++)g=g||i[x+1]!==1,y.push(x+1);g=g&&i[i.length-1]!==1;let _=g?e.compute(Ue(e.inputs[0],y),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},(x,b)=>i[y[b]])),$=Ji(e,_,t[1],t[2],s,u,n,r.epsilon),k=x=>{let b=Ie(t[0].dataType),I=l===1?"vec2f":`mat${l}x2f`,S=C=>{let v=C===0?"x":"y",D=l===1?"f32":`vec${l}f`;switch(l){case 1:return`${b}(${D}(scale.${v}))`;case 2:return`vec2<${b}>(${D}(scale[0].${v}, scale[1].${v}))`;case 4:return`vec4<${b}>(${D}(scale[0].${v}, scale[1].${v}, scale[2].${v}, scale[3].${v}))`;default:throw new Error(`Not supported compoents ${l}`)}},E=N("input",t[0].dataType,t[0].dims,l),A=H("output",t[0].dataType,a,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${E.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${I}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${A.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${x.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${S(0)}, ${S(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:h},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:f}),getShaderSource:k},{inputs:[t[0],$]})},kh=(e,t)=>{t.format==="NHWC"?zl(e,e.inputs,t):El(e,e.inputs,t)}}),Cl,Al,Th,T0=P(()=>{te(),ie(),ae(),Cl=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},Al=(e,t,r)=>{let i=t.simplified,a=e[0].dims,s=e[1],n=!i&&e[2],u=a,l=O.normalizeAxis(t.axis,a.length),p=O.sizeToDimension(a,l),f=O.sizeFromDimension(a,l),h=O.size(s.dims),g=n?O.size(n.dims):0;if(h!==f||n&&g!==f)throw new Error(`Size of X.shape()[axis:] == ${f}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${h} and bias size of ${g}`);let y=[];for(let E=0;E<a.length;++E)E<l?y.push(a[E]):y.push(1);let _=xe(f),$=["type","type"],k=[{type:12,data:p},{type:1,data:f},{type:12,data:Math.floor(f/_)},{type:1,data:t.epsilon}];n&&$.push("type");let x=r>1,b=r>2,I=E=>{let A=Ie(e[0].dataType),C=[N("x",e[0].dataType,e[0].dims,_),N("scale",s.dataType,s.dims,_)];n&&C.push(N("bias",n.dataType,n.dims,_)),C.push(H("output",e[0].dataType,u,_)),x&&C.push(H("mean_data_output",1,y)),b&&C.push(H("inv_std_output",1,y));let v=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${E.registerUniforms(v).declareVariables(...C)}
  ${E.mainStart()}
    ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${$a("f32",_)};
    var mean_square_vector = ${$a("f32",_)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${qt(A,_,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${gt("mean_vector",_)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${gt("mean_square_vector",_)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${qt(A,_,"x[j + offset]")};
      let f32scale = ${qt(A,_,"scale[j]")};
      output[j + offset] = ${C[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${n?`+ ${qt(A,_,"bias[j]")}`:""}
      );
    }

    ${x?"mean_data_output[global_idx] = mean":""};
    ${b?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},S=[{dims:u,dataType:e[0].dataType}];return x&&S.push({dims:y,dataType:1}),b&&S.push({dims:y,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${_};${r};${i}`,inputDependencies:$},getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(p/64)},programUniforms:k}),getShaderSource:I}},Th=(e,t)=>{Cl(e.inputs),e.compute(Al(e.inputs,t,e.outputCount))}}),Ol,Ih,I0=P(()=>{ie(),Ja(),en(),Ol=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Ih=e=>{Ol(e.inputs);let t=Lt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(Ya(e.inputs,{activation:""},t));else{let a=t[t.length-2],s=O.size(e.inputs[0].dims.slice(0,-2)),n=O.size(e.inputs[1].dims.slice(0,-2));if(s!==1&&a===1&&n===1){let u=e.inputs[0].reshape([1,s,i]),l=e.inputs[1].reshape([1,i,r]),p=[1,s,r],f=[u,l];e.compute(Fr(f,{activation:""},t,p),{inputs:f})}else e.compute(Fr(e.inputs,{activation:""},t))}}}),Rl,Bl,Nl,Eh,zh,E0=P(()=>{te(),ie(),Se(),ae(),Rl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let a=Math.floor((t.k+t.blockSize-1)/t.blockSize),s=t.blockSize/8*t.bits,n=e[1];if(!O.areEqual(n.dims,[t.n,a,s]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(O.size(u)!==t.n*a)throw new Error("scales input size error.");if(e.length===4){let l=e[3].dims,p=t.n*(t.bits===8?a:Math.floor((a*t.bits+7)/8));if(O.size(l)!==p)throw new Error("zeroPoints input size error.")}},Bl=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],s=t.k,n=t.n,u=r.slice(0,i-2),l=O.size(u),p=e[1].dims[2]/4,f=e[0].dataType,h=xe(t.k),g=xe(p),y=xe(n),_=u.concat([a,n]),$=a>1&&n/y%2===0?2:1,k=O.size(_)/y/$,x=64,b=[],I=[l,a,s/h],S=O.convertShape(e[1].dims).slice();S.splice(-1,1,p/g),b.push(...Z(I)),b.push(...Z(S)),b.push(...Z(e[2].dims)),e.length===4&&b.push(...Z(O.convertShape(e[3].dims)));let E=[l,a,n/y];b.push(...Z(E));let A=C=>{let v=I.length,D=N("a",e[0].dataType,v,h),q=N("b",12,S.length,g),Q=N("scales",e[2].dataType,e[2].dims.length),F=[D,q,Q],K=e.length===4?N("zero_points",12,e[3].dims.length):void 0;K&&F.push(K);let R=E.length,M=H("output",e[0].dataType,R,y),G=Ie(e[0].dataType),J=(()=>{switch(h){case 1:return`array<${G}, 8>`;case 2:return`mat4x2<${G}>`;case 4:return`mat2x4<${G}>`;default:throw new Error(`${h}-component is not supported.`)}})(),ee=Math.floor(32/t.bits),re=Math.floor(ee/8),ne=()=>{let X="";for(let V=0;V<re;V++){let Te=V*t.bits*4,Ce=Te+t.bits;X+=`
          // reuse a data (pass ${V})
            var input_offset${V>0?V:""} = ${V===0?D.indicesToOffset(`${D.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${V>0?V:""}: ${J};
            for (var j${V>0?V:""}: u32 = 0; j${V>0?V:""} < ${8/h}; j${V>0?V:""}++) {
              a_data${V>0?V:""}[j${V>0?V:""}] = ${D.getByOffset(`input_offset${V>0?V:""}`)};
              input_offset${V>0?V:""}++;
            }
          `;for(let we=0;we<y*$;we++)X+=`
            b_value = ${g===1?`b${we}_data`:`b${we}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${V*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${Te}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${Ce}u) & b_mask);`}
            b_quantized_values = ${J}(${Array.from({length:4},(Ae,me)=>`${G}(b_value_lower[${me}]), ${G}(b_value_upper[${me}])`).join(", ")});
            b_dequantized_values = ${h===1?`${J}(${Array.from({length:8},(Ae,me)=>`(b_quantized_values[${me}] - ${K?`zero_point${we}`:"zero_point"}) * scale${we}`).join(", ")});`:`(b_quantized_values - ${J}(${Array(8).fill(`${K?`zero_point${we}`:"zero_point"}`).join(",")})) * scale${we};`};
            workgroup_shared[local_id.x * ${$} + ${Math.floor(we/y)}]${y>1?`[${we%y}]`:""} += ${Array.from({length:8/h},(Ae,me)=>`${h===1?`a_data${V>0?V:""}[${me}] * b_dequantized_values[${me}]`:`dot(a_data${V>0?V:""}[${me}], b_dequantized_values[${me}])`}`).join(" + ")};
          `}return X},U=()=>{let X=`
            var col_index = col * ${y};
            ${K?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${G}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            `;for(let V=0;V<y*$;V++)X+=`
            let scale${V} = ${Q.getByOffset("col_index * nBlocksPerCol + block")};
            ${K?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${K.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${V} = ${G}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return X},Y=()=>{let X=`col_index = col * ${y};`;for(let V=0;V<y*$;V++)X+=`
            let b${V}_data = ${q.getByIndices(`${q.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return X+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${J};
            var b_dequantized_values: ${J};`,X};return`
        var<workgroup> workgroup_shared: array<${M.type.value}, ${$*x}>;
        ${C.declareVariables(...F,M)}
        ${C.mainStart([x,1,1])}
          let output_indices = ${M.offsetToIndices(`(global_idx / ${x}) * ${$}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${x}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/h};
            ${U()}
            for (var word: u32 = 0; word < ${p}; word += ${g}) {
              ${Y()}
              for (var i: u32 = 0; i < ${g}; i++) {
                ${ne()}
                word_offset += ${ee/h};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${$}) {
            var output_value: ${M.type.value} = ${M.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${x}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${$};
            }
            ${M.setByIndices(`${M.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${h};${g};${y};${$};${x}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:f}],dispatchGroup:{x:k},programUniforms:b}),getShaderSource:A}},Nl=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],s=t.k,n=t.n,u=r.slice(0,i-2),l=O.size(u),p=e[1].dims[2]/4,f=e[0].dataType,h=xe(t.k),g=xe(p),y=u.concat([a,n]),_=128,$=n%8===0?8:n%4===0?4:1,k=_/$,x=Math.floor(32/t.bits),b=k*g*x,I=b/h,S=b/t.blockSize,E=O.size(y)/$,A=[],C=[l,a,s/h],v=O.convertShape(e[1].dims).slice();v.splice(-1,1,p/g),A.push(...Z(C)),A.push(...Z(v)),A.push(...Z(e[2].dims)),e.length===4&&A.push(...Z(O.convertShape(e[3].dims)));let D=[l,a,n];A.push(...Z(D));let q=Q=>{let F=C.length,K=N("a",e[0].dataType,F,h),R=N("b",12,v.length,g),M=N("scales",e[2].dataType,e[2].dims.length),G=[K,R,M],J=e.length===4?N("zero_points",12,e[3].dims.length):void 0;J&&G.push(J);let ee=D.length,re=H("output",e[0].dataType,ee),ne=Ie(e[0].dataType),U=()=>{switch(h){case 1:return`
          let a_data0 = vec4<${ne}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${ne}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${ne}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${ne}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${h}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${K.type.value}, ${I}>;
        var<workgroup> inter_results: array<array<${re.type.value}, ${k}>, ${$}>;
        ${Q.declareVariables(...G,re)}
        ${Q.mainStart([k,$,1])}
          let output_indices = ${re.offsetToIndices(`workgroup_index * ${$}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${S} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${I};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${I}; a_offset += ${_})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${K.getByIndices(`${K.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${K.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${S} + local_id.x;
            ${J?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${J.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${ne}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${ne}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            let scale = ${M.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${R.getByIndices(`${R.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/h};
            for (var i: u32 = 0; i < ${g}; i++) {
              let b_value = ${g===1?"b_data":"b_data[i]"};
              ${(()=>{let Y=Math.floor(x/8),X="";for(let V=0;V<Y;V++){let Te=V*t.bits*4,Ce=Te+t.bits;X+=`
              ${U()}
              {${t.bits===2?`
                let half_word = b_value >> ${V*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${Te}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${Ce}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${ne}>(${Array.from({length:4},(we,Ae)=>`${ne}(b_value_lower[${Ae}]), ${ne}(b_value_upper[${Ae}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${ne}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(we,Ae)=>`${`dot(a_data${Ae}, b_dequantized_values[${Ae}])`}`).join(" + ")};
              }
              word_offset += ${8/h};`}return X})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${$}) {
            var output_value: ${re.type.value} = ${re.type.value}(0);
            for (var b = 0u; b < ${k}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${re.setByIndices(`${re.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${h};${g};${k};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:y,dataType:f}],dispatchGroup:{x:E},programUniforms:A}),getShaderSource:q}},Eh=(e,t)=>{Rl(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(Nl(e.inputs,t)):e.compute(Bl(e.inputs,t))},zh=e=>he(e)}),Ml,Dl,Ul,Pl,ql,Ll,Wl,Vl,Ch,z0=P(()=>{te(),ie(),ae(),Ml=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Dl=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
            k = i32(${e.indicesGet("indices",a)}) - ${j("uniforms.pads",a,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${j("uniforms.x_shape",a,t)})) {
              break;
            }
            offset += k * i32(${j("uniforms.x_strides",a,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},Ul=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${j("uniforms.pads",a,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${j("uniforms.x_shape",a,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${j("uniforms.x_shape",a,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${j("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Pl=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${j("uniforms.pads",a,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${j("uniforms.x_shape",a,t)})) {
                  k = i32(${j("uniforms.x_shape",a,t)}) - 1;
                }
                offset += k * i32(${j("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},ql=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${j("uniforms.pads",a,r)};
                if (k < 0)  {
                  k += i32(${j("uniforms.x_shape",a,t)}]);
                }
                if (k >= i32(${j("uniforms.x_shape",a,t)})) {
                  k -= i32(${j("uniforms.x_shape",a,t)});
                }
                offset += k * i32(${j("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Ll=(e,t,r)=>{switch(r.mode){case 0:return Dl(e,t,r.pads.length);case 1:return Ul(e,t,r.pads.length);case 2:return Pl(e,t,r.pads.length);case 3:return ql(e,t,r.pads.length);default:throw new Error("Invalid mode")}},Wl=(e,t)=>{let r=O.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,a=O.size(r),s=[{type:12,data:a},{type:6,data:t.pads}],n=e.length>=3&&e[2].data;t.mode===0&&s.push({type:n?e[2].dataType:1,data:t.value}),s.push(...Z(e[0].dims,r));let u=["rank"],l=p=>{let f=H("output",e[0].dataType,r.length),h=N("x",e[0].dataType,i.length),g=h.type.value,y=Ll(f,i.length,t),_=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&_.push({name:"constant_value",type:n?g:"f32"}),`
            ${p.registerUniforms(_).declareVariables(h,f)}
            ${p.mainStart()}
            ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${f.offsetToIndices("global_idx")};

            var value = ${g}(0);
            ${y}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${n}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(O.size(r)/64)},programUniforms:s}),getShaderSource:l}},Vl=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,a=e[0].dims.length,s=new Int32Array(2*a).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let l=0;l<u.length;l++)s[Number(u[l])]=Number(r[l]),s[Number(u[l])+a]=Number(r[l+u.length])}else r.forEach((u,l)=>s[Number(l)]=Number(u));let n=[];return s.forEach(u=>n.push(u)),{mode:t.mode,value:i,pads:n}}else return t},Ch=(e,t)=>{Ml(e.inputs);let r=Vl(e.inputs,t);e.compute(Wl(e.inputs,r),{inputs:[0]})}}),er,ea,ta,ra,ia,Gl,Hl,aa,na,Ah,Oh,sa,Rh,Bh,oa,Nh,Mh,Dh,Uh,C0=P(()=>{Le(),te(),ie(),ae(),er=e=>{if(ye.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},ea=(e,t,r)=>{let i=t.format==="NHWC",a=e.dims.slice();i&&a.splice(1,0,a.pop());let s=Object.hasOwnProperty.call(t,"dilations"),n=t.kernelShape.slice(),u=t.strides.slice(),l=s?t.dilations.slice():[],p=t.pads.slice();Gr.adjustPoolAttributes(r,a,n,u,l,p);let f=Gr.computePoolOutputShape(r,a,u,l,n,p,t.autoPad),h=Object.assign({},t);s?Object.assign(h,{kernelShape:n,strides:u,pads:p,dilations:l,cacheKey:t.cacheKey}):Object.assign(h,{kernelShape:n,strides:u,pads:p,cacheKey:t.cacheKey});let g=f.slice();return g.push(g.splice(1,1)[0]),[h,i?g:f]},ta=(e,t)=>{let r=t.format==="NHWC",i=O.size(e),a=O.size(t.kernelShape),s=[{type:12,data:i},{type:12,data:a}],n=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],l=t.strides[t.strides.length-1],p=t.pads[t.pads.length/2-1],f=t.pads[t.pads.length-1],h=!!(p+f);s.push({type:12,data:u},{type:12,data:l},{type:12,data:p},{type:12,data:f}),n.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let g=!1;if(t.kernelShape.length===2){let y=t.kernelShape[t.kernelShape.length-2],_=t.strides[t.strides.length-2],$=t.pads[t.pads.length/2-2],k=t.pads[t.pads.length-2];g=!!($+k),s.push({type:12,data:y},{type:12,data:_},{type:12,data:$},{type:12,data:k}),n.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[s,n,!0,h,g]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=O.computeStrides(t.kernelShape);s.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),n.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let l=t.pads.reduce((p,f)=>p+f);return[s,n,!!l,!1,!1]}},ra=(e,t,r,i,a,s,n,u,l,p,f,h)=>{let g=a.format==="NHWC",y=t.type.value,_=H("output",t.type.tensor,i);if(a.kernelShape.length<=2){let $="",k="",x="",b=r-(g?2:1);if(f?$=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${b}] < 0 || xIndices[${b}]
                      >= uniforms.x_shape[${b}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${s}
                }`:$=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${s}
                }`,a.kernelShape.length===2){let I=r-(g?3:2);h?k=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${I}] < 0 || xIndices[${I}] >= uniforms.x_shape[${I}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:k=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sh - uniforms.phStart + j;
                `,x=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,_)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${_.offsetToIndices("global_idx")};
              var xIndices = ${_.offsetToIndices("global_idx")};

              var value = ${y}(${u});
              var pad = 0;
              ${k}
              ${$}
              ${x}
              ${n}

              output[global_idx] = value;
            }`}else{if(g)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let $=a.kernelShape.length,k=a.pads.length,x="";return p?x=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${s}
              }`:x=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${s}
            `,`
            ${e.registerUniforms(l).declareVariables(t,_)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${_.offsetToIndices("global_idx")};
              var xIndices = ${_.offsetToIndices("global_idx")};

              var offsets: array<u32, ${$}>;

              var value = ${y}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${$-1}u; j++) {
                  offsets[j] = offset / ${j("uniforms.kernelStrides","j",$)};
                  offset -= offsets[j] * ${j("uniforms.kernelStrides","j",$)};
                }
                offsets[${$-1}] = offset;

                isPad = false;
                for (var j = ${r-$}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${j("uniforms.strides",`j - ${r-$}u`,$)}
                    + offsets[j - ${r-$}u] - ${j("uniforms.pads","j - 2u",k)};
                  ${x}
              }
              ${n}

              output[global_idx] = value;
            }`}},ia=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Gl=e=>`${ia(e)};${e.countIncludePad}`,Hl=e=>`${ia(e)};${e.storageOrder};${e.dilations}`,aa=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),na=(e,t,r,i)=>{let[a,s]=ea(t,i,r),n=N("x",t.dataType,t.dims.length),u=n.type.value,l="value += x_val;",p="";a.countIncludePad?p+=`value /= ${u}(uniforms.kernelSize);`:p+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[f,h,g,y,_]=ta(s,a);f.push(...Z(t.dims,s));let $=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${g};${y};${_}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:s,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(O.size(s)/64)},programUniforms:f}),getShaderSource:k=>ra(k,n,t.dims.length,s.length,a,l,p,0,h,g,y,_)}},Ah=e=>{let t=e.count_include_pad!==0,r=aa(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:Gl(i)}},Oh=(e,t)=>{er(e.inputs),e.compute(na("AveragePool",e.inputs[0],!1,t))},sa={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Rh=e=>{let t=e.format;return{format:t,...sa,cacheKey:t}},Bh=(e,t)=>{er(e.inputs),e.compute(na("GlobalAveragePool",e.inputs[0],!0,t))},oa=(e,t,r,i)=>{let[a,s]=ea(t,i,r),n=`
      value = max(x_val, value);
    `,u="",l=N("x",t.dataType,t.dims.length),p=["rank"],[f,h,g,y,_]=ta(s,a);return f.push(...Z(t.dims,s)),{name:e,shaderCache:{hint:`${i.cacheKey};${g};${y};${_}`,inputDependencies:p},getRunData:()=>({outputs:[{dims:s,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(O.size(s)/64)},programUniforms:f}),getShaderSource:$=>ra($,l,t.dims.length,s.length,a,n,u,t.dataType===10?-65504:-1e5,h,g,y,_)}},Nh=(e,t)=>{er(e.inputs),e.compute(oa("MaxPool",e.inputs[0],!1,t))},Mh=e=>{let t=e.storage_order,r=e.dilations,i=aa(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let a={storageOrder:t,dilations:r,...i,cacheKey:""};return{...a,cacheKey:Hl(a)}},Dh=e=>{let t=e.format;return{format:t,...sa,cacheKey:t}},Uh=(e,t)=>{er(e.inputs),e.compute(oa("GlobalMaxPool",e.inputs[0],!0,t))}}),Fl,jl,Ph,qh,A0=P(()=>{te(),ie(),Se(),ae(),Fl=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((a,s)=>s===t.axis||a===e[0].dims[s]).reduce((a,s)=>a&&s,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},jl=(e,t)=>{let r=O.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,a=i===3,s=e[0].dims,n=e[1].dataType,u=O.size(s),l=i===3||i===2,p=l?[Math.ceil(O.size(e[0].dims)/4)]:e[0].dims,f=e[1].dims,h=e.length>2?e[2]:void 0,g=h?l?[Math.ceil(O.size(h.dims)/4)]:h.dims:void 0,y=f.length===0||f.length===1&&f[0]===1,_=y===!1&&f.length===1,$=xe(u),k=y&&(!l||$===4),x=k?$:1,b=k&&!l?$:1,I=N("input",l?12:i,p.length,b),S=N("scale",n,f.length),E=h?N("zero_point",l?12:i,g.length):void 0,A=H("output",n,s.length,x),C=[I,S];E&&C.push(E);let v=[p,f];h&&v.push(g);let D=[{type:12,data:u/x},{type:12,data:r},{type:12,data:t.blockSize},...Z(...v,s)],q=Q=>{let F=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${Q.registerUniforms(F).declareVariables(...C,A)}
      ${Q.mainStart()}
          ${Q.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${A.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${I.getByOffset("global_idx / 4")};
            let x_vec = ${a?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${x===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${I.getByOffset("global_idx")};`};

          // Set scale input
          ${y?`let scale_value= ${S.getByOffset("0")}`:_?`
            let scale_index = ${A.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${S.getByOffset("scale_index")};`:`
            var scale_indices: ${S.type.indices} = output_indices;
            let index = ${S.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${S.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${S.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${E?y?l?`
                let zero_point_input = ${E.getByOffset("0")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${E.getByOffset("0")}`:_?l?`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${E.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${E.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${S.indicesToOffset("scale_indices")};
                let zero_point_input = ${E.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${E.getByIndices("scale_indices")};`:`let zero_point_value = ${l?a?"i32":"u32":I.type.value}(0);`};
      // Compute and write output
      ${A.setByOffset("global_idx",`${A.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:E?["rank","rank","rank"]:["rank","rank"]},getShaderSource:q,getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(u/x/64),y:1,z:1},programUniforms:D})}},Ph=(e,t)=>{Fl(e.inputs,t),e.compute(jl(e.inputs,t))},qh=e=>he({axis:e.axis,blockSize:e.blockSize})}),Kl,Zl,Lh,O0=P(()=>{Le(),te(),ae(),Kl=(e,t,r)=>{let i=e===t,a=e<t&&r<0,s=e>t&&r>0;if(i||a||s)throw new Error("Range these inputs' contents are invalid.")},Zl=(e,t,r,i)=>{let a=Math.abs(Math.ceil((t-e)/r)),s=[a],n=a,u=[{type:12,data:n},{type:i,data:e},{type:i,data:r},...Z(s)],l=p=>{let f=H("output",i,s.length),h=f.type.value,g=[{name:"outputSize",type:"u32"},{name:"start",type:h},{name:"delta",type:h}];return`
        ${p.registerUniforms(g).declareVariables(f)}
        ${p.mainStart()}
        ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${h}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:s,dataType:i}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:u})}},Lh=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),ye.webgpu.validateInputContent&&Kl(t,r,i),e.compute(Zl(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),Xl,Ql,Wh,Vh,R0=P(()=>{te(),ie(),Se(),ae(),Xl=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let a=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,s=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return i==="i32"||i==="u32"?`atomicAdd(&${t}, bitcast<${i}>(${r}));`:`
              ${a}bitcast<${i}>(oldValue) + (${r})${s}`;case"max":return i==="i32"||i==="u32"?`atomicMax(&${t}, bitcast<${i}>(${r}));`:`
                ${a}max(bitcast<f32>(oldValue), (${r}))${s}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${a}min(bitcast<${i}>(oldValue), (${r}))${s}`;case"mul":return`${a}(bitcast<${i}>(oldValue) * (${r}))${s}`;default:throw new Error(`Reduction ${e} is not supported.`)}},Ql=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r,s=1,n=Math.ceil(O.sizeToDimension(i,i.length-1)/s),u=i[i.length-1],l=O.sizeFromDimension(r,u),p=[{type:12,data:n},{type:12,data:u},{type:12,data:l},...Z(e[1].dims,e[2].dims,a)],f=h=>{let g=N("indices",e[1].dataType,e[1].dims.length),y=N("updates",e[2].dataType,e[2].dims.length,s),_=t.reduction!=="none"&&t.reduction!==""?yp("output",e[0].dataType,a.length):H("output",e[0].dataType,a.length,s);return`
      ${h.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(g,y,_)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${Xl(t.reduction,"output[data_offset + i]","value",_.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:p}),getShaderSource:f}},Wh=e=>he({reduction:e.reduction}),Vh=(e,t)=>{e.compute(Ql(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),Yl,Jl,ed,ua,td,rd,id,ad,nd,sd,od,ud,la,ld,dd,pd,cd,hd,Gh,Hh,B0=P(()=>{te(),ie(),Se(),ae(),Yl=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},Jl=(e,t,r)=>{t.every(a=>a>=0&&a<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((a,s)=>i[a]=e[s]),i},ed=(e,t,r,i,a,s)=>{let[n,u,l]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],p=e[0].dims.length;if(n>0&&e.length>n&&e[n].dims.length>0)e[n].getFloat32Array().forEach(f=>s.push(f));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(f=>i.push(f)),i.length!==0&&i.length!==p&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");Yl(i,t),t.axes.length>0&&Jl(i,t.axes,p).forEach((f,h)=>i[h]=f)}if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(f=>a.push(Number(f))),a.length!==0&&a.length!==p&&r>=18&&a.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof a<"u"&&i.length>0&&a.length>p)throw new Error("Resize requires only of scales or sizes to be specified")},ua=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,td=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${ua("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${ua("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",rd=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",id=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),a=e.length===0?i:e.slice();return t.length>0?(t.forEach((s,n)=>{i[s]=a[n],i[n+r]=a[t.length+n]}),i):a},ad=(e,t,r,i)=>{let a=[];if(r.length>0)if(i.length>0){if(e.forEach(s=>a.push(s)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((s,n)=>a[s]=r[n])}else r.forEach(s=>a.push(s));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");a=e.map((s,n)=>Math.round(s*t[n]))}return a},nd=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(s=>t[s]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(s=>t[s]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let a=e.slice();return r.axes.length>0?(r.axes.forEach(s=>t[s]=i),r.axes.forEach(s=>a[s]=Math.round(e[s]*t[s]))):(t.fill(i,0,t.length),a.forEach((s,n)=>a[n]=Math.round(s*t[n]))),a},sd=(e,t,r,i,a)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${j("uniforms.scales","i",i)};
        var roi_low = ${j("uniforms.roi","i",a)};
        var roi_hi = ${j("uniforms.roi",`i + ${t.length}`,a)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${j("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${j("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,od=(e,t,r,i,a,s,n)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${j("uniforms.scales","i",a)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${j("uniforms.roi","i",s)};
          var roi_hi = ${j("uniforms.roi",`i + ${r.length}`,s)};
          var input_shape_i = ${j("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${j("uniforms.output_shape","i",i.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${n} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,ud=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${j("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,la=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",ld=(e,t,r,i,a)=>{let[s,n,u,l]=r.length===2?[-1,0,1,-1]:[0,2,3,1],p=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${p} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",n,`max(0, min(row, ${r[n]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${la(e,l,s,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${p} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${p} = originalIndices[${n}];
      var col:${p} = originalIndices[${u}];
      ${i?`if (row < 0 || row > (${r[n]} - 1) || col < 0 || col > (${r[u]} - 1)) {
        return ${a};
      }`:""};
      row = max(0, min(row, ${r[n]} - 1));
      col = max(0, min(col, ${r[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${s}])`:"0"};
      var x11: ${p} = getInputValue(batch, channel, row1, col1);
      var x12: ${p} = getInputValue(batch, channel, row1, col2);
      var x21: ${p} = getInputValue(batch, channel, row2, col1);
      var x22: ${p} = getInputValue(batch, channel, row2, col2);
      var dx1: ${p} = abs(row - ${p}(row1));
      var dx2: ${p} = abs(${p}(row2) - row);
      var dy1: ${p} = abs(col - ${p}(col1));
      var dy2: ${p} = abs(${p}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},dd=(e,t,r,i,a,s,n,u,l,p)=>{let f=r.length===2,[h,g]=f?[0,1]:[2,3],y=e.type.value,_=$=>{let k=$===h?"row":"col";return`
      fn ${k}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${y} {
        var output_index = ${t.indicesGet("output_indices",$)};
        var originalIdx: ${y} = getOriginalCoordinateFromResizedCoordinate(output_index, ${a[$]},
        ${i[$]}, ${r[$]}, ${s[$]}, ${s[$]} + ${r.length});
        var fractOriginalIdx: ${y} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[$]} - 1))) {
          return ${l};
        }
        var data: array<${y}, 4> = array<${y}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${k}: ${y} = originalIdx + ${y}(i);
          if (${k} < 0 || ${k} >= ${r[$]}) {
            ${p?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${l};`:`${k} = max(0, min(${k}, ${r[$]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",$,`u32(${k})`)};
          data[i + 1] = ${$===h?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${_(h)};
    ${_(g)};
  fn getCubicInterpolationCoefs(s: ${y}) -> array<${y}, 4> {
    var absS = abs(s);
    var coeffs: array<${y}, 4> = array<${y}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${y} = 1.0 - absS;
    var twoMinusAbsS: ${y} = 2.0 - absS;
    var onePlusAbsS: ${y} = 1.0 + absS;
    coeffs[0] = ((${n} * onePlusAbsS - 5 * ${n}) * onePlusAbsS + 8 * ${n}) * onePlusAbsS - 4 * ${n};
    coeffs[1] = ((${n} + 2) * absS - (${n} + 3)) * absS * absS + 1;
    coeffs[2] = ((${n} + 2) * oneMinusAbsS - (${n} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${n} * twoMinusAbsS - 5 * ${n}) * twoMinusAbsS + 8 * ${n}) * twoMinusAbsS - 4 * ${n};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${y}, 4>, coefs: array<${y}, 4>) -> ${y} {
    var coefsSum: ${y} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${y} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},pd=(e,t,r,i,a)=>{let[s,n,u,l,p]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],f=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${f} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",n,`max(0, min(depth, ${r[n]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(width, ${r[l]} - 1))`)};
      ${la(e,p,s,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${f} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${f} = originalIndices[${n}];
      var height:${f} = originalIndices[${u}];
      var width:${f} = originalIndices[${l}];
      ${i?`if (depth < 0 || depth > (${r[n]} - 1) || height < 0 || height > (${r[u]} - 1) || width < 0 || (width > ${r[l]} - 1)) {
      return ${a};
        }`:""};

    depth = max(0, min(depth, ${r[n]} - 1));
      height = max(0, min(height, ${r[u]} - 1));
      width = max(0, min(width, ${r[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${p}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${s}])`:"0"};

      var x111: ${f} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${f} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${f} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${f} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${f} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${f} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${f} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${f} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${f} = abs(depth - ${f}(depth1));
      var dx2: ${f} = abs(${f}(depth2) - depth);
      var dy1: ${f} = abs(height - ${f}(height1));
      var dy2: ${f} = abs(${f}(height2) - height);
      var dz1: ${f} = abs(width - ${f}(width1));
      var dz2: ${f} = abs(${f}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},cd=(e,t,r,i,a,s)=>{let n=e.dims,u=id(s,t.axes,n.length),l=ad(n,i,a,t.axes),p=i.slice();i.length===0&&(p=n.map((b,I)=>b===0?1:l[I]/b),t.keepAspectRatioPolicy!=="stretch"&&(l=nd(n,p,t)));let f=H("output",e.dataType,l.length),h=N("input",e.dataType,n.length),g=O.size(l),y=n.length===l.length&&n.every((b,I)=>b===l[I]),_=t.coordinateTransformMode==="tf_crop_and_resize",$=t.extrapolationValue,k=h.type.value,x=b=>`
      ${y?"":`
      ${td(t.coordinateTransformMode,k)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${ud(h,n)};
              ${rd(t.nearestMode,r,k)};
              ${od(h,f,n,l,p.length,u.length,_)};
              `;case"linear":return`
              ${sd(f,n,l,p.length,u.length)};
              ${(()=>{if(n.length===2||n.length===4)return`${ld(h,f,n,_,$)}`;if(n.length===3||n.length===5)return`${pd(h,f,n,_,$)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(n.length===2||n.length===4)return`${dd(h,f,n,l,p,u,t.cubicCoeffA,_,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${b.registerUniform("output_size","u32").registerUniform("scales","f32",p.length).registerUniform("roi","f32",u.length).declareVariables(h,f)}
      ${b.mainStart()}
        ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${y?"output[global_idx] = input[global_idx];":`
        let output_indices = ${f.offsetToIndices("global_idx")};
        var input_indices: ${h.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${h.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${n.length===2||n.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${p.length>0?t.mode==="cubic"?p:p.length:""}|${a.length>0?a:""}|${u.length>0?u:""}|${y}|${t.mode==="nearest"?n.length:n}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},{type:1,data:p},{type:1,data:u},...Z(n,l)]})}},hd=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},Gh=(e,t)=>{let r=[],i=[],a=[],s=hd(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");ed(e.inputs,t,s,r,i,a),e.compute(cd(e.inputs[0],t,s,r,i,a),{inputs:[0]})},Hh=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,a=e.cubicCoeffA,s=e.excludeOutside!==0,n=e.extrapolationValue,u=e.keepAspectRatioPolicy,l=e.mode,p=e.nearestMode===""?"simple":e.nearestMode;return he({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:a,excludeOutside:s,extrapolationValue:n,keepAspectRatioPolicy:u,mode:l,nearestMode:p})}}),fd,md,Fh,N0=P(()=>{te(),ie(),ae(),fd=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let a=t.dims[t.dims.length-1],s=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==a)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==s)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==a)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let n=e[3];if(n.dims.length!==1)throw new Error("Beta must be 1D");if(n.dims[n.dims.length-1]!==a)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let n=e[4];if(n.dims.length!==1)throw new Error("Bias must be 1D");if(n.dims[n.dims.length-1]!==a)throw new Error("Bias must have the same hidden size as input")}},md=(e,t,r,i)=>{let a=t.simplified,s=e[0].dims,n=O.size(s),u=s,l=n,p=s.slice(-1)[0],f=i?s.slice(0,-1).concat(1):[],h=!a&&e.length>3,g=e.length>4,y=i&&r>1,_=i&&r>2,$=r>3,k=64,x=xe(p),b=[{type:12,data:l},{type:12,data:x},{type:12,data:p},{type:1,data:t.epsilon}],I=E=>{let A=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],C=[N("x",e[0].dataType,e[0].dims,x),N("skip",e[1].dataType,e[1].dims,x),N("gamma",e[2].dataType,e[2].dims,x)];h&&C.push(N("beta",e[3].dataType,e[3].dims,x)),g&&C.push(N("bias",e[4].dataType,e[4].dims,x)),C.push(H("output",e[0].dataType,u,x)),y&&C.push(H("mean_output",1,f)),_&&C.push(H("inv_std_output",1,f)),$&&C.push(H("input_skip_bias_sum",e[0].dataType,u,x));let v=Ie(e[0].dataType),D=Ie(1,x);return`

      ${E.registerUniforms(A).declareVariables(...C)}
      var<workgroup> sum_shared : array<${D}, ${k}>;
      var<workgroup> sum_squared_shared : array<${D}, ${k}>;

      ${E.mainStart([k,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${k};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${k};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${k-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${g?"bias[offset1d + i]":v+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${$?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${qt(v,x,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${k};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${gt("sum",x)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${gt("square_sum",x)} / f32(uniforms.hidden_size) ${a?"":"- mean * mean"} + uniforms.epsilon);
        ${y?"mean_output[global_idx] = mean;":""}
        ${_?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${a?"":`- ${v}(mean)`}) *
            ${v}(inv_std_dev) * gamma[offset1d + i]
            ${h?"+ beta[offset1d + i]":""};
        }
      }`},S=[{dims:u,dataType:e[0].dataType}];return r>1&&S.push({dims:f,dataType:1}),r>2&&S.push({dims:f,dataType:1}),r>3&&S.push({dims:s,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${x};${y};${_};${$}`,inputDependencies:e.map((E,A)=>"type")},getShaderSource:I,getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(l/p)},programUniforms:b})}},Fh=(e,t)=>{fd(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(md(e.inputs,t,e.outputCount,!1),{outputs:r})}}),gd,tr,yd,da,_d,bd,jh,Kh,M0=P(()=>{te(),ie(),Se(),ae(),gd=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},tr=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},yd=(e,t)=>{if(e.length>1){let r=tr(e,1),i=tr(e,2),a=tr(e,3);return a.length===0&&(a=[...Array(e[0].dims.length).keys()]),he({starts:r,ends:i,axes:a})}else return t},da=(e,t,r,i,a)=>{let s=e;return e<0&&(s+=r[i[t]]),a[t]<0?Math.max(0,Math.min(s,r[i[t]]-1)):Math.max(0,Math.min(s,r[i[t]]))},_d=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length-1}; i >= 0; i--) {
            let input_shape_i = ${j("uniforms.input_shape","i",r.length)};
            let steps_i = ${j("uniforms.steps","i",r.length)};
            let signs_i = ${j("uniforms.signs","i",r.length)};
            let starts_i = ${j("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,bd=(e,t)=>{let r=e[0].dims,i=O.size(r),a=t.axes.length>0?O.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],s=tr(e,4);s.forEach(x=>x!==0||(()=>{throw new Error("step cannot be 0")})),s.length===0&&(s=Array(a.length).fill(1));let n=t.starts.map((x,b)=>da(x,b,r,a,s)),u=t.ends.map((x,b)=>da(x,b,r,a,s));if(a.length!==n.length||a.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(a.length!==r.length)for(let x=0;x<r.length;++x)a.includes(x)||(n.splice(x,0,0),u.splice(x,0,r[x]),s.splice(x,0,1));let l=s.map(x=>Math.sign(x));s.forEach((x,b,I)=>{if(x<0){let S=(u[b]-n[b])/x,E=n[b],A=E+S*s[b];n[b]=A,u[b]=E,I[b]=-x}});let p=r.slice(0);a.forEach((x,b)=>{p[x]=Math.ceil((u[x]-n[x])/s[x])});let f={dims:p,dataType:e[0].dataType},h=H("output",e[0].dataType,p.length),g=N("input",e[0].dataType,e[0].dims.length),y=O.size(p),_=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:n.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:s.length}],$=[{type:12,data:y},{type:12,data:n},{type:6,data:l},{type:12,data:s},...Z(e[0].dims,p)],k=x=>`
      ${x.registerUniforms(_).declareVariables(g,h)}
        ${_d(g,h,r)}
        ${x.mainStart()}
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${h.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${h.setByOffset("global_idx",g.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${n.length}_${s.length}`,inputDependencies:["rank"]},getShaderSource:k,getRunData:()=>({outputs:[f],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:$})}},jh=(e,t)=>{gd(e.inputs,t);let r=yd(e.inputs,t);e.compute(bd(e.inputs,r),{inputs:[0]})},Kh=e=>{let t=e.starts,r=e.ends,i=e.axes;return he({starts:t,ends:r,axes:i})}}),$d,wd,Zh,Xh,D0=P(()=>{te(),ie(),Se(),yt(),ae(),$d=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},wd=(e,t)=>{let r=e.inputs[0],i=r.dims,a=O.size(i),s=i.length,n=O.normalizeAxis(t.axis,s),u=n<i.length-1,l,p=[];u?(p=Array.from({length:s},(C,v)=>v),p[n]=s-1,p[s-1]=n,l=e.compute(Ue(r,p),{inputs:[r],outputs:[-1]})[0]):l=r;let f=l.dims,h=f[s-1],g=a/h,y=xe(h),_=h/y,$=64;g===1&&($=256);let k=(C,v)=>v===4?`max(max(${C}.x, ${C}.y), max(${C}.z, ${C}.w))`:v===2?`max(${C}.x, ${C}.y)`:v===3?`max(max(${C}.x, ${C}.y), ${C}.z)`:C,x=N("x",l.dataType,l.dims,y),b=H("result",l.dataType,l.dims,y),I=x.type.value,S=Ie(l.dataType)==="f32"?`var threadMax = ${I}(-3.4028234663852886e+38f);`:`var threadMax = ${I}(-65504.0h);`,E=C=>`
      var<workgroup> rowMaxShared : ${I};
      var<workgroup> rowSumShared : ${I};
      var<workgroup> threadShared : array<${I}, ${$}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${I} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${I}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${C.registerUniform("packedCols","i32").declareVariables(x,b)}
      ${C.mainStart($)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${$};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${S}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${I}(${k("threadShared[0]",y)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${I}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${I}(${gt("threadShared[0]",y)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${I}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,A=e.compute({name:"Softmax",shaderCache:{hint:`${y};${$}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:f,dataType:l.dataType}],dispatchGroup:{x:g},programUniforms:[{type:6,data:_}]}),getShaderSource:E},{inputs:[l],outputs:[u?-1:0]})[0];u&&e.compute(Ue(A,p),{inputs:[A]})},Zh=(e,t)=>{$d(e.inputs),wd(e,t)},Xh=e=>he({axis:e.axis})}),pa,vd,xd,Sd,Qh,U0=P(()=>{te(),ie(),ae(),pa=e=>Array.from(e.getBigInt64Array(),Number),vd=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(pa(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},xd=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},Sd=(e,t)=>{let r=e[0].dims,i=t??pa(e[1]),a=xd(r,i),s=O.size(a),n=e[0].dataType,u=N("input",n,r.length),l=H("output",n,a.length),p=f=>`
      const inputShape = ${u.indices(...r)};
      ${f.registerUniform("output_size","u32").declareVariables(u,l)}
      ${f.mainStart()}
      ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:[{type:12,data:s},...Z(e[0].dims,a)]}),getShaderSource:p}},Qh=e=>{vd(e.inputs),e.compute(Sd(e.inputs),{inputs:[0]})}}),kd,Td,Yh,P0=P(()=>{te(),ie(),ae(),kd=(e,t,r,i,a)=>{let s=H("output_data",a,r.length,4),n=N("a_data",t[1].dataType,t[1].dims.length,4),u=N("b_data",t[2].dataType,t[2].dims.length,4),l=N("c_data",t[0].dataType,t[0].dims.length,4),p,f=(h,g,y)=>`select(${g}, ${h}, ${y})`;if(!i)p=s.setByOffset("global_idx",f(n.getByOffset("global_idx"),u.getByOffset("global_idx"),l.getByOffset("global_idx")));else{let h=(g,y,_="")=>{let $=`a_data[index_a${y}][component_a${y}]`,k=`b_data[index_b${y}][component_b${y}]`,x=`bool(c_data[index_c${y}] & (0xffu << (component_c${y} * 8)))`;return`
            let output_indices${y} = ${s.offsetToIndices(`global_idx * 4u + ${y}u`)};
            let offset_a${y} = ${n.broadcastedIndicesToOffset(`output_indices${y}`,s)};
            let offset_b${y} = ${u.broadcastedIndicesToOffset(`output_indices${y}`,s)};
            let offset_c${y} = ${l.broadcastedIndicesToOffset(`output_indices${y}`,s)};
            let index_a${y} = offset_a${y} / 4u;
            let index_b${y} = offset_b${y} / 4u;
            let index_c${y} = offset_c${y} / 4u;
            let component_a${y} = offset_a${y} % 4u;
            let component_b${y} = offset_b${y} % 4u;
            let component_c${y} = offset_c${y} % 4u;
            ${g}[${y}] = ${_}(${f($,k,x)});
          `};a===9?p=`
            var data = vec4<u32>(0);
            ${h("data",0,"u32")}
            ${h("data",1,"u32")}
            ${h("data",2,"u32")}
            ${h("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:p=`
            ${h("output_data[global_idx]",0)}
            ${h("output_data[global_idx]",1)}
            ${h("output_data[global_idx]",2)}
            ${h("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,n,u,s)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${p}
      }`},Td=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,a=e[1].dataType,s=!(O.areEqual(t,r)&&O.areEqual(r,i)),n=t,u=O.size(t);if(s){let p=Lt.calcShape(Lt.calcShape(t,r,!1),i,!1);if(!p)throw new Error("Can't perform where op on the given tensors");n=p,u=O.size(n)}let l=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:p=>kd(p,e,n,s,a),getRunData:()=>({outputs:[{dims:n,dataType:a}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:l},...Z(i,t,r,n)]})}},Yh=e=>{e.compute(Td(e.inputs))}}),Jh,q0=P(()=>{e0(),Ka(),t0(),r0(),i0(),a0(),n0(),d0(),c0(),h0(),f0(),m0(),g0(),y0(),_0(),b0(),$0(),w0(),v0(),x0(),S0(),k0(),T0(),I0(),E0(),_h(),z0(),C0(),A0(),O0(),R0(),ja(),B0(),xh(),N0(),M0(),D0(),wh(),U0(),yt(),Za(),P0(),Jh=new Map([["Abs",[Fp]],["Acos",[jp]],["Acosh",[Kp]],["Add",[Ec]],["ArgMax",[Wp,va]],["ArgMin",[Lp,va]],["Asin",[Zp]],["Asinh",[Xp]],["Atan",[Qp]],["Atanh",[Yp]],["Attention",[Vp]],["AveragePool",[Oh,Ah]],["BatchNormalization",[Gp]],["BiasAdd",[Hp]],["BiasSplitGelu",[Ic]],["Cast",[ec,Jp]],["Ceil",[rc]],["Clip",[tc]],["Concat",[Uc,Pc]],["Conv",[Ea,Ia]],["ConvTranspose",[Zc,Kc]],["Cos",[ic]],["Cosh",[ac]],["CumSum",[Xc,Qc]],["DepthToSpace",[Yc,Jc]],["DequantizeLinear",[Ph,qh]],["Div",[zc]],["Einsum",[eh,th]],["Elu",[nc,sr]],["Equal",[Cc]],["Erf",[sc]],["Exp",[oc]],["Expand",[rh]],["FastGelu",[ih]],["Floor",[uc]],["FusedConv",[Ea,Ia]],["Gather",[nh,ah]],["GatherElements",[ph,dh]],["GatherBlockQuantized",[uh,lh]],["GatherND",[sh,oh]],["Gelu",[lc]],["Gemm",[hh,ch]],["GlobalAveragePool",[Bh,Rh]],["GlobalMaxPool",[Uh,Dh]],["Greater",[Bc]],["GreaterOrEqual",[Mc]],["GridSample",[fh,mh]],["GroupQueryAttention",[Sh]],["HardSigmoid",[yc,gc]],["InstanceNormalization",[kh]],["LayerNormalization",[Th]],["LeakyRelu",[dc,sr]],["Less",[Nc]],["LessOrEqual",[Dc]],["Log",[kc]],["MatMul",[Ih]],["MatMulNBits",[Eh,zh]],["MaxPool",[Nh,Mh]],["Mul",[Ac]],["MultiHeadAttention",[yh,gh]],["Neg",[cc]],["Not",[pc]],["Pad",[Ch]],["Pow",[Oc]],["QuickGelu",[Tc,sr]],["Range",[Lh]],["Reciprocal",[hc]],["ReduceMin",[Mp]],["ReduceMean",[Ap]],["ReduceMax",[Np]],["ReduceSum",[Up]],["ReduceProd",[Dp]],["ReduceL1",[Op]],["ReduceL2",[Rp]],["ReduceLogSum",[qp]],["ReduceLogSumExp",[Bp]],["ReduceSumSquare",[Pp]],["Relu",[fc]],["Resize",[Gh,Hh]],["RotaryEmbedding",[vh]],["ScatterND",[Vh,Wh]],["Sigmoid",[mc]],["Sin",[_c]],["Sinh",[bc]],["Slice",[jh,Kh]],["SkipLayerNormalization",[Fh]],["Split",[bh,$h]],["Sqrt",[$c]],["Softmax",[Zh,Xh]],["Sub",[Rc]],["Tan",[wc]],["Tanh",[vc]],["ThresholdedRelu",[Sc,sr]],["Tile",[Qh]],["Transpose",[bp,$p]],["Where",[Yh]]])}),ef,L0=P(()=>{Le(),ot(),ae(),ef=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,a){rt(e.programInfo.name);let s=this.backend.device,n=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let p of t)u.push({binding:u.length,resource:{buffer:p.buffer}});for(let p of r)u.push({binding:u.length,resource:{buffer:p.buffer}});a&&u.push({binding:u.length,resource:a});let l=s.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let p={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(p)}n.setPipeline(e.computePipeline),n.setBindGroup(0,l),n.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Xe(e.programInfo.name)}dispose(){}build(e,t){rt(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(p=>{r.features.has(p.feature)&&i.push(`enable ${p.extension};`)});let a=_p(t,this.backend.device.limits),s=e.getShaderSource(a),n=`${i.join(`
`)}
${a.additionalImplementations}
${s}`,u=r.createShaderModule({code:n,label:e.name});de("verbose",()=>`[WebGPU] ${e.name} shader code: ${n}`);let l=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return Xe(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:a.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,a=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=a&&r<=a&&i<=a)return[t,r,i];let s=t*r*i,n=Math.ceil(Math.sqrt(s));if(n>a){if(n=Math.ceil(Math.cbrt(s)),n>a)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[n,n,n]}else return[n,n,1]}}}),tf={};Vt(tf,{WebGpuBackend:()=>rf});var Id,Ed,zd,rf,W0=P(()=>{Le(),te(),ot(),hp(),Yg(),q0(),L0(),Id=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let a=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${a}`);break}case"rank":{let s=e[i].dims.length;r.push(`${a};${s}`);break}case"dims":{let s=e[i].dims.join(",");r.push(`${a};${s}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},Ed=(e,t,r)=>{let i=e.name;return e.shaderCache?.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${Id(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,i},zd=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},rf=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},a=u=>t.features.has(u)&&r.push(u)&&!0;a("chromium-experimental-timestamp-query-inside-passes")||a("timestamp-query"),a("shader-f16"),a("subgroups"),this.device=await t.requestDevice(i);let s=t,n=t.info??(typeof s.requestAdapterInfo=="function"?await s.requestAdapterInfo():void 0);this.adapterInfo=new zd(n),this.gpuDataManager=gp(this),this.programManager=new ef(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Va(e.logLevel,!!e.debug),this.device.onuncapturederror=u=>{u.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${u.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&this.env?.webgpu&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;rt(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let i=0;i<t.length/2;i++){let a=r[i],s=a.kernelId,n=this.kernels.get(s),u=n.kernelType,l=n.kernelName,p=a.programName,f=a.inputTensorViews,h=a.outputTensorViews,g=t[i*2],y=t[i*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=g);let _=Number(g-this.queryTimeBase),$=Number(y-this.queryTimeBase);if(!Number.isSafeInteger(_)||!Number.isSafeInteger($))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:f.map(k=>({dims:k.dims,dataType:st(k.dataType)})),outputsMetadata:h.map(k=>({dims:k.dims,dataType:st(k.dataType)})),kernelId:s,kernelType:u,kernelName:l,programName:p,startTime:_,endTime:$});else{let k="";f.forEach((b,I)=>{k+=`input[${I}]: [${b.dims}] | ${st(b.dataType)}, `});let x="";h.forEach((b,I)=>{x+=`output[${I}]: [${b.dims}] | ${st(b.dataType)}, `}),console.log(`[profiling] kernel "${s}|${u}|${l}|${p}" ${k}${x}start time: ${_} ns, execution time: ${$-_} ns`)}Lr("GPU",`${p}::${g}::${y}`)}e.unmap(),this.pendingQueries.delete(e)}),Xe()}run(e,t,r,i,a,s){rt(e.name);let n=[];for(let b=0;b<t.length;++b){let I=t[b].data;if(I===0)continue;let S=this.gpuDataManager.get(I);if(!S)throw new Error(`no GPU data for input: ${I}`);n.push(S)}let{outputs:u,dispatchGroup:l,programUniforms:p}=e.getRunData(t),f=r.length===0?u.map((b,I)=>I):r;if(f.length!==u.length)throw new Error(`Output size ${f.length} must be equal to ${u.length}.`);let h=[],g=[];for(let b=0;b<u.length;++b){if(!Number.isInteger(f[b])||f[b]<-3||f[b]>=s)throw new Error(`Invalid output index: ${f[b]}`);if(f[b]===-3)continue;let I=f[b]===-1,S=f[b]===-2,E=I||S?a(u[b].dataType,u[b].dims):i(f[b],u[b].dataType,u[b].dims);if(h.push(E),E.data===0)continue;let A=this.gpuDataManager.get(E.data);if(!A)throw new Error(`no GPU data for output: ${E.data}`);if(I&&this.temporaryData.push(A),S){let C=this.kernelPersistentData.get(this.currentKernelId);C||(C=[],this.kernelPersistentData.set(this.currentKernelId,C)),C.push(A)}g.push(A)}if(n.length!==t.length||g.length!==h.length){if(g.length===0)return Xe(e.name),h;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let y;if(p){let b=0,I=[];p.forEach(C=>{let v=typeof C.data=="number"?[C.data]:C.data;if(v.length===0)return;let D=C.type===10?2:4,q,Q;C.type===10?(Q=v.length>4?16:v.length>2?8:v.length*D,q=v.length>4?16:D*v.length):(Q=v.length<=2?v.length*D:16,q=16),b=Math.ceil(b/Q)*Q,I.push(b);let F=C.type===10?8:4;b+=v.length>4?Math.ceil(v.length/F)*q:v.length*D});let S=16;b=Math.ceil(b/S)*S;let E=new ArrayBuffer(b);p.forEach((C,v)=>{let D=I[v],q=typeof C.data=="number"?[C.data]:C.data;if(C.type===6)new Int32Array(E,D,q.length).set(q);else if(C.type===12)new Uint32Array(E,D,q.length).set(q);else if(C.type===10)new Uint16Array(E,D,q.length).set(q);else if(C.type===1)new Float32Array(E,D,q.length).set(q);else throw new Error(`Unsupported uniform type: ${st(C.type)}`)});let A=this.gpuDataManager.create(b,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(A.buffer,0,E,0,b),this.gpuDataManager.release(A.id),y={offset:0,size:b,buffer:A.buffer}}let _=this.programManager.normalizeDispatchGroupSize(l),$=_[1]===1&&_[2]===1,k=Ed(e,t,$),x=this.programManager.getArtifact(k);if(x||(x=this.programManager.build(e,_),this.programManager.setArtifact(k,x),de("info",()=>`[artifact] key: ${k}, programName: ${e.name}`)),p&&x.uniformVariablesInfo){if(p.length!==x.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${x.uniformVariablesInfo.length}, got ${p.length} in program "${x.programInfo.name}".`);for(let b=0;b<p.length;b++){let I=p[b],S=I.type,E=typeof I.data=="number"?1:I.data.length,[A,C]=x.uniformVariablesInfo[b];if(S!==A||E!==C)throw new Error(`Uniform variable ${b} mismatch: expect type ${A} with size ${C}, got type ${S} with size ${E} in program "${x.programInfo.name}".`)}}if(de("info",()=>`[ProgramManager] run "${e.name}" (key=${k}) with ${_[0]}x${_[1]}x${_[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let b={kernelId:this.currentKernelId,programName:x.programInfo.name,inputTensorViews:t,outputTensorViews:h};this.pendingKernels.push(b),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(b)}return this.programManager.run(x,n,g,_,y),Xe(e.name),h}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let a=Jh.get(e);if(!a)throw new Error(`kernel not implemented: ${e}`);let s={kernelType:e,kernelName:i,kernelEntry:a[0],attributes:[a[1],r]};this.kernels.set(t,s)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let a=i.kernelType,s=i.kernelName,n=i.kernelEntry,u=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${a}] ${s}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),de("info",()=>`[WebGPU] Start to run kernel "[${a}] ${s}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),n(t,u[1]),0}catch(p){return r.push(Promise.resolve(`[WebGPU] Kernel "[${a}] ${s}" failed. ${p}`)),1}finally{l&&r.push(this.device.popErrorScope().then(p=>p?`GPU validation error for kernel "[${a}] ${s}": ${p.message}`:null));for(let p of this.temporaryData)this.gpuDataManager.release(p.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let a=this.sessionExternalDataMapping.get(e);a||(a=new Map,this.sessionExternalDataMapping.set(e,a));let s=a.get(t),n=this.gpuDataManager.registerExternalBuffer(r,i,s);return a.set(t,[n,r]),n}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await ba(this,e,t);return Ga(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){de("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){de("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){de("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let a=this.getComputePassEncoder(),s=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),a.setPipeline(s.computePipeline),a.setBindGroup(0,s.bindGroup),a.dispatchWorkgroups(...s.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),af={};Vt(af,{init:()=>nf});var Nr,Cd,nf,V0=P(()=>{te(),ot(),ie(),Qg(),Nr=class sf{constructor(t,r,i,a){this.module=t,this.dataType=r,this.data=i,this.dims=a}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(O.size(t)!==O.size(this.dims))throw new Error("Invalid new shape");return new sf(this.module,this.dataType,this.data,t)}},Cd=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let i=e.PTR_SIZE,a=r/e.PTR_SIZE,s=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*a++,s));let n=Number(e.getValue(i*a++,s));this.outputCount=Number(e.getValue(i*a++,s)),this.customDataOffset=Number(e.getValue(i*a++,"*")),this.customDataSize=Number(e.getValue(i*a++,s));let u=[];for(let l=0;l<n;l++){let p=Number(e.getValue(i*a++,s)),f=Number(e.getValue(i*a++,"*")),h=Number(e.getValue(i*a++,s)),g=[];for(let y=0;y<h;y++)g.push(Number(e.getValue(i*a++,s)));u.push(new Nr(e,p,f,g))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let r=t?.inputs?.map(n=>typeof n=="number"?this.inputs[n]:n)??this.inputs,i=t?.outputs??[],a=(n,u,l)=>new Nr(this.module,u,this.output(n,l),l),s=(n,u)=>{let l=Et(n,u);if(!l)throw new Error(`Unsupported data type: ${n}`);let p=l>0?this.backend.gpuDataManager.create(l).id:0;return new Nr(this.module,n,p,u)};return this.backend.run(e,r,i,a,s,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,a=i===4?"i32":"i64",s=this.module.stackAlloc((1+t.length)*i);this.module.setValue(s,t.length,a);for(let n=0;n<t.length;n++)this.module.setValue(s+i*(n+1),t[n],a);return this.module._JsepOutput(this.opKernelContext,e,s)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},nf=async(e,t,r,i)=>{let a=t.jsepInit;if(!a)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let s=(W0(),dr(tf)).WebGpuBackend,n=new s;await n.initialize(r,i),a("webgpu",[n,u=>n.alloc(Number(u)),u=>n.free(u),(u,l,p,f=!1)=>{if(f)de("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(u)}, dst=${Number(l)}, size=${Number(p)}`),n.memcpy(Number(u),Number(l));else{de("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(u)}, gpuDataId=${Number(l)}, size=${Number(p)}`);let h=t.HEAPU8.subarray(Number(u>>>0),Number(u>>>0)+Number(p));n.upload(Number(l),h)}},async(u,l,p)=>{de("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${u}, dataOffset=${l}, size=${p}`),await n.download(Number(u),()=>t.HEAPU8.subarray(Number(l)>>>0,Number(l+p)>>>0))},(u,l,p)=>n.createKernel(u,Number(l),p,t.UTF8ToString(t._JsepGetNodeName(Number(l)))),u=>n.releaseKernel(u),(u,l,p,f)=>{de("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${p}, kernel=${u}, contextDataOffset=${l}`);let h=new Cd(t,n,Number(l));return n.computeKernel(Number(u),h,f)},()=>n.captureBegin(),()=>n.captureEnd(),()=>n.replay()])}else{let s=new mp(r);a("webnn",[s,()=>s.reserveTensorId(),n=>s.releaseTensorId(n),async(n,u,l,p,f)=>s.ensureTensor(n,u,l,p,f),(n,u)=>{s.uploadTensor(n,u)},async(n,u)=>s.downloadTensor(n,u),(n,u)=>s.registerMLContext(n,u),!!r.trace])}}}),Ad,tn,rn,ft,Od,ca,Kr,an,nn,ha,sn,on,un,of=P(()=>{Le(),Kg(),Zg(),te(),Bt(),Pa(),lp(),Ad=(e,t)=>{_e()._OrtInit(e,t)!==0&&fe("Can't initialize onnxruntime.")},tn=async e=>{Ad(e.wasm.numThreads,Vr(e.logLevel))},rn=async(e,t)=>{_e().asyncInit?.();let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let i=e.webgpu.powerPreference;if(i!==void 0&&i!=="low-power"&&i!=="high-performance")throw new Error(`Invalid powerPreference setting: "${i}"`);let a=e.webgpu.forceFallbackAdapter;if(a!==void 0&&typeof a!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${a}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:i,forceFallbackAdapter:a}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let i=(V0(),dr(af)).init;t==="webgpu"&&await i("webgpu",_e(),e,r),t==="webnn"&&await i("webnn",_e(),e)}},ft=new Map,Od=e=>{let t=_e(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,a,a+i)!==0&&fe("Can't get session input/output count.");let s=i===4?"i32":"i64";return[Number(t.getValue(a,s)),Number(t.getValue(a+i,s))]}finally{t.stackRestore(r)}},ca=(e,t)=>{let r=_e(),i=r.stackSave(),a=0;try{let s=r.PTR_SIZE,n=r.stackAlloc(2*s);r._OrtGetInputOutputMetadata(e,t,n,n+s)!==0&&fe("Can't get session input/output metadata.");let u=Number(r.getValue(n,"*"));a=Number(r.getValue(n+s,"*"));let l=r.HEAP32[a/4];if(l===0)return[u,0];let p=r.HEAPU32[a/4+1],f=[];for(let h=0;h<p;h++){let g=Number(r.getValue(a+8+h*s,"*"));f.push(g!==0?r.UTF8ToString(g):Number(r.getValue(a+8+(h+p)*s,"*")))}return[u,l,f]}finally{r.stackRestore(i),a!==0&&r._OrtFree(a)}},Kr=e=>{let t=_e(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},an=async(e,t)=>{let r,i,a=_e();Array.isArray(e)?[r,i]=e:e.buffer===a.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=Kr(e);let s=0,n=0,u=0,l=[],p=[],f=[];try{if([n,l]=await up(t),t?.externalData&&a.mountExternalData){let S=[];for(let E of t.externalData){let A=typeof E=="string"?E:E.path;S.push(Wa(typeof E=="string"?E:E.data).then(C=>{a.mountExternalData(A,C)}))}await Promise.all(S)}for(let S of t?.executionProviders??[])if((typeof S=="string"?S:S.name)==="webnn"){if(a.shouldTransferToMLTensor=!1,typeof S!="string"){let E=S,A=E?.context,C=E?.gpuDevice,v=E?.deviceType,D=E?.powerPreference;A?a.currentContext=A:C?a.currentContext=await a.webnnCreateMLContext(C):a.currentContext=await a.webnnCreateMLContext({deviceType:v,powerPreference:D})}else a.currentContext=await a.webnnCreateMLContext();break}s=await a._OrtCreateSession(r,i,n),a.webgpuOnCreateSession?.(s),s===0&&fe("Can't create a session."),a.jsepOnCreateSession?.(),a.currentContext&&(a.webnnRegisterMLContext(s,a.currentContext),a.currentContext=void 0,a.shouldTransferToMLTensor=!0);let[h,g]=Od(s),y=!!t?.enableGraphCapture,_=[],$=[],k=[],x=[],b=[];for(let S=0;S<h;S++){let[E,A,C]=ca(s,S);E===0&&fe("Can't get an input name."),p.push(E);let v=a.UTF8ToString(E);_.push(v),k.push(A===0?{name:v,isTensor:!1}:{name:v,isTensor:!0,type:st(A),shape:C})}for(let S=0;S<g;S++){let[E,A,C]=ca(s,S+h);E===0&&fe("Can't get an output name."),f.push(E);let v=a.UTF8ToString(E);$.push(v),x.push(A===0?{name:v,isTensor:!1}:{name:v,isTensor:!0,type:st(A),shape:C});{if(y&&t?.preferredOutputLocation===void 0){b.push("gpu-buffer");continue}let D=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[v]??"cpu",q=a.webnnIsGraphOutput;if(D==="cpu"&&q&&q(s,v)){b.push("ml-tensor-cpu-output");continue}if(D!=="cpu"&&D!=="cpu-pinned"&&D!=="gpu-buffer"&&D!=="ml-tensor")throw new Error(`Not supported preferred output location: ${D}.`);if(y&&D!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${D}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);b.push(D)}}let I=null;return b.some(S=>S==="gpu-buffer"||S==="ml-tensor"||S==="ml-tensor-cpu-output")&&(u=a._OrtCreateBinding(s),u===0&&fe("Can't create IO binding."),I={handle:u,outputPreferredLocations:b,outputPreferredLocationsEncoded:b.map(S=>S==="ml-tensor-cpu-output"?"ml-tensor":S).map(S=>ya(S))}),ft.set(s,[s,p,f,I,y,!1]),[s,_,$,k,x]}catch(h){throw p.forEach(g=>a._OrtFree(g)),f.forEach(g=>a._OrtFree(g)),u!==0&&a._OrtReleaseBinding(u)!==0&&fe("Can't release IO binding."),s!==0&&a._OrtReleaseSession(s)!==0&&fe("Can't release session."),h}finally{a._free(r),n!==0&&a._OrtReleaseSessionOptions(n)!==0&&fe("Can't release session options."),l.forEach(h=>a._free(h)),a.unmountExternalData?.()}},nn=e=>{let t=_e(),r=ft.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,a,s,n,u]=r;n&&(u&&t._OrtClearBoundOutputs(n.handle)!==0&&fe("Can't clear bound outputs."),t._OrtReleaseBinding(n.handle)!==0&&fe("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),a.forEach(l=>t._OrtFree(l)),s.forEach(l=>t._OrtFree(l)),t._OrtReleaseSession(i)!==0&&fe("Can't release session."),ft.delete(e)},ha=async(e,t,r,i,a,s,n=!1)=>{if(!e){t.push(0);return}let u=_e(),l=u.PTR_SIZE,p=e[0],f=e[1],h=e[3],g=h,y,_;if(p==="string"&&(h==="gpu-buffer"||h==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(n&&h!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${s} when enableGraphCapture is true.`);if(h==="gpu-buffer"){let x=e[2].gpuBuffer;_=Et(It(p),f);{let b=u.jsepRegisterBuffer;if(!b)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');y=b(i,s,x,_)}}else if(h==="ml-tensor"){let x=e[2].mlTensor;_=Et(It(p),f);let b=u.webnnRegisterMLTensor;if(!b)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');y=b(i,x,It(p),f)}else{let x=e[2];if(Array.isArray(x)){_=l*x.length,y=u._malloc(_),r.push(y);for(let b=0;b<x.length;b++){if(typeof x[b]!="string")throw new TypeError(`tensor data at index ${b} is not a string`);u.setValue(y+b*l,Ke(x[b],r),"*")}}else{let b=u.webnnIsGraphInput,I=u.webnnIsGraphOutput;if(p!=="string"&&b&&I){let S=u.UTF8ToString(a);if(b(i,S)||I(i,S)){let E=It(p);_=Et(E,f),g="ml-tensor";let A=u.webnnCreateTemporaryTensor,C=u.webnnUploadTensor;if(!A||!C)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let v=await A(i,E,f);C(v,new Uint8Array(x.buffer,x.byteOffset,x.byteLength)),y=v}else _=x.byteLength,y=u._malloc(_),r.push(y),u.HEAPU8.set(new Uint8Array(x.buffer,x.byteOffset,_),y)}else _=x.byteLength,y=u._malloc(_),r.push(y),u.HEAPU8.set(new Uint8Array(x.buffer,x.byteOffset,_),y)}}let $=u.stackSave(),k=u.stackAlloc(4*f.length);try{f.forEach((b,I)=>u.setValue(k+I*l,b,l===4?"i32":"i64"));let x=u._OrtCreateTensor(It(p),y,_,k,f.length,ya(g));x===0&&fe(`Can't create tensor for input/output. session=${i}, index=${s}.`),t.push(x)}finally{u.stackRestore($)}},sn=async(e,t,r,i,a,s)=>{let n=_e(),u=n.PTR_SIZE,l=ft.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let p=l[0],f=l[1],h=l[2],g=l[3],y=l[4],_=l[5],$=t.length,k=i.length,x=0,b=[],I=[],S=[],E=[],A=[],C=n.stackSave(),v=n.stackAlloc($*u),D=n.stackAlloc($*u),q=n.stackAlloc(k*u),Q=n.stackAlloc(k*u);try{[x,b]=op(s),zt("wasm prepareInputOutputTensor");for(let M=0;M<$;M++)await ha(r[M],I,E,e,f[t[M]],t[M],y);for(let M=0;M<k;M++)await ha(a[M],S,E,e,h[i[M]],$+i[M],y);Ct("wasm prepareInputOutputTensor");for(let M=0;M<$;M++)n.setValue(v+M*u,I[M],"*"),n.setValue(D+M*u,f[t[M]],"*");for(let M=0;M<k;M++)n.setValue(q+M*u,S[M],"*"),n.setValue(Q+M*u,h[i[M]],"*");if(g&&!_){let{handle:M,outputPreferredLocations:G,outputPreferredLocationsEncoded:J}=g;if(f.length!==$)throw new Error(`input count from feeds (${$}) is expected to be always equal to model's input count (${f.length}).`);zt("wasm bindInputsOutputs");for(let ee=0;ee<$;ee++){let re=t[ee];await n._OrtBindInput(M,f[re],I[ee])!==0&&fe(`Can't bind input[${ee}] for session=${e}.`)}for(let ee=0;ee<k;ee++){let re=i[ee];a[ee]?.[3]?(A.push(S[ee]),n._OrtBindOutput(M,h[re],S[ee],0)!==0&&fe(`Can't bind pre-allocated output[${ee}] for session=${e}.`)):n._OrtBindOutput(M,h[re],0,J[re])!==0&&fe(`Can't bind output[${ee}] to ${G[ee]} for session=${e}.`)}Ct("wasm bindInputsOutputs"),ft.set(e,[p,f,h,g,y,!0])}n.jsepOnRunStart?.(p),n.webnnOnRunStart?.(p);let F;g?F=await n._OrtRunWithBinding(p,g.handle,k,q,x):F=await n._OrtRun(p,D,v,$,Q,k,q,x),F!==0&&fe("failed to call OrtRun().");let K=[],R=[];zt("wasm ProcessOutputTensor");for(let M=0;M<k;M++){let G=Number(n.getValue(q+M*u,"*"));if(G===S[M]||A.includes(S[M])){K.push(a[M]),G!==S[M]&&n._OrtReleaseTensor(G)!==0&&fe("Can't release tensor.");continue}let J=n.stackSave(),ee=n.stackAlloc(4*u),re=!1,ne,U=0;try{n._OrtGetTensorData(G,ee,ee+u,ee+2*u,ee+3*u)!==0&&fe(`Can't access output tensor data on index ${M}.`);let Y=u===4?"i32":"i64",X=Number(n.getValue(ee,Y));U=n.getValue(ee+u,"*");let V=n.getValue(ee+u*2,"*"),Te=Number(n.getValue(ee+u*3,Y)),Ce=[];for(let me=0;me<Te;me++)Ce.push(Number(n.getValue(V+me*u,Y)));n._OrtFree(V)!==0&&fe("Can't free memory for tensor dims.");let we=Ce.reduce((me,$e)=>me*$e,1);ne=st(X);let Ae=g?.outputPreferredLocations[i[M]];if(ne==="string"){if(Ae==="gpu-buffer"||Ae==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let me=[];for(let $e=0;$e<we;$e++){let Be=n.getValue(U+$e*u,"*"),cr=n.getValue(U+($e+1)*u,"*"),Qe=$e===we-1?void 0:cr-Be;me.push(n.UTF8ToString(Be,Qe))}K.push([ne,Ce,me,"cpu"])}else if(Ae==="gpu-buffer"&&we>0){let me=n.jsepGetBuffer;if(!me)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let $e=me(U),Be=Et(X,we);if(Be===void 0||!qa(ne))throw new Error(`Unsupported data type: ${ne}`);re=!0,K.push([ne,Ce,{gpuBuffer:$e,download:n.jsepCreateDownloader($e,Be,ne),dispose:()=>{n._OrtReleaseTensor(G)!==0&&fe("Can't release tensor.")}},"gpu-buffer"])}else if(Ae==="ml-tensor"&&we>0){let me=n.webnnEnsureTensor,$e=n.webnnIsGraphInputOutputTypeSupported;if(!me||!$e)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Et(X,we)===void 0||!La(ne))throw new Error(`Unsupported data type: ${ne}`);if(!$e(e,ne,!1))throw new Error(`preferredLocation "ml-tensor" for ${ne} output is not supported by current WebNN Context.`);let Be=await me(e,U,X,Ce,!1);re=!0,K.push([ne,Ce,{mlTensor:Be,download:n.webnnCreateMLTensorDownloader(U,ne),dispose:()=>{n.webnnReleaseTensorId(U),n._OrtReleaseTensor(G)}},"ml-tensor"])}else if(Ae==="ml-tensor-cpu-output"&&we>0){let me=n.webnnCreateMLTensorDownloader(U,ne)(),$e=K.length;re=!0,R.push((async()=>{let Be=[$e,await me];return n.webnnReleaseTensorId(U),n._OrtReleaseTensor(G),Be})()),K.push([ne,Ce,[],"cpu"])}else{let me=Zr(ne),$e=new me(we);new Uint8Array($e.buffer,$e.byteOffset,$e.byteLength).set(n.HEAPU8.subarray(U,U+$e.byteLength)),K.push([ne,Ce,$e,"cpu"])}}finally{n.stackRestore(J),ne==="string"&&U&&n._free(U),re||n._OrtReleaseTensor(G)}}g&&!y&&(n._OrtClearBoundOutputs(g.handle)!==0&&fe("Can't clear bound outputs."),ft.set(e,[p,f,h,g,y,!1]));for(let[M,G]of await Promise.all(R))K[M][2]=G;return Ct("wasm ProcessOutputTensor"),K}finally{n.webnnOnRunEnd?.(p),n.stackRestore(C),I.forEach(F=>n._OrtReleaseTensor(F)),S.forEach(F=>n._OrtReleaseTensor(F)),E.forEach(F=>n._free(F)),x!==0&&n._OrtReleaseRunOptions(x),b.forEach(F=>n._free(F))}},on=e=>{let t=_e(),r=ft.get(e);if(!r)throw new Error("invalid session id");let i=r[0],a=t._OrtEndProfiling(i);a===0&&fe("Can't get an profile file name."),t._OrtFree(a)},un=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),mt,qe,Ut,rr,ir,Mr,fa,Dr,St,kt,Rd,uf,lf,df,pf,cf,hf,ff,mf=P(()=>{Le(),of(),Bt(),Da(),mt=()=>!!ye.wasm.proxy&&typeof document<"u",Ut=!1,rr=!1,ir=!1,Dr=new Map,St=(e,t)=>{let r=Dr.get(e);r?r.push(t):Dr.set(e,[t])},kt=()=>{if(Ut||!rr||ir||!qe)throw new Error("worker not ready")},Rd=e=>{switch(e.data.type){case"init-wasm":Ut=!1,e.data.err?(ir=!0,fa[1](e.data.err)):(rr=!0,fa[0]()),Mr&&(URL.revokeObjectURL(Mr),Mr=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Dr.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}}},uf=async()=>{if(!rr){if(Ut)throw new Error("multiple calls to 'initWasm()' detected.");if(ir)throw new Error("previous call to 'initWasm()' failed.");if(Ut=!0,mt())return new Promise((e,t)=>{qe?.terminate(),np().then(([r,i])=>{try{qe=i,qe.onerror=s=>t(s),qe.onmessage=Rd,fa=[e,t];let a={type:"init-wasm",in:ye};!a.in.wasm.wasmPaths&&(r||ga)&&(a.in.wasm.wasmPaths={wasm:new URL("/inhaler-coach/collector/assets/ort-wasm-simd-threaded.jsep-DC5y_g6C.wasm",import.meta.url).href}),qe.postMessage(a),Mr=r}catch(a){t(a)}},t)});try{await Ua(ye.wasm),await tn(ye),rr=!0}catch(e){throw ir=!0,e}finally{Ut=!1}}},lf=async e=>{if(mt())return kt(),new Promise((t,r)=>{St("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:ye}};qe.postMessage(i)});await rn(ye,e)},df=async e=>mt()?(kt(),new Promise((t,r)=>{St("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};qe.postMessage(i,[e.buffer])})):Kr(e),pf=async(e,t)=>{if(mt()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return kt(),new Promise((r,i)=>{St("create",[r,i]);let a={type:"create",in:{model:e,options:{...t}}},s=[];e instanceof Uint8Array&&s.push(e.buffer),qe.postMessage(a,s)})}else return an(e,t)},cf=async e=>{if(mt())return kt(),new Promise((t,r)=>{St("release",[t,r]);let i={type:"release",in:e};qe.postMessage(i)});nn(e)},hf=async(e,t,r,i,a,s)=>{if(mt()){if(r.some(n=>n[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(a.some(n=>n))throw new Error("pre-allocated output tensor is not supported for proxy.");return kt(),new Promise((n,u)=>{St("run",[n,u]);let l=r,p={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:s}};qe.postMessage(p,un(l))})}else return sn(e,t,r,i,a,s)},ff=async e=>{if(mt())return kt(),new Promise((t,r)=>{St("end-profiling",[t,r]);let i={type:"end-profiling",in:e};qe.postMessage(i)});on(e)}}),ma,Bd,gf,G0=P(()=>{Le(),mf(),te(),Ma(),lp(),ma=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},Bd=e=>{switch(e[3]){case"cpu":return new Ze(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!qa(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:a}=e[2];return Ze.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:a})}case"ml-tensor":{let t=e[0];if(!La(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:a}=e[2];return Ze.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:a})}default:throw new Error(`invalid data location: ${e[3]}`)}},gf=class{async fetchModelAndCopyToWasmMemory(e){return df(await Wa(e))}async loadModel(e,t){rt();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await pf(r,t),Xe()}async dispose(){return cf(this.sessionId)}async run(e,t,r){rt();let i=[],a=[];Object.entries(e).forEach(h=>{let g=h[0],y=h[1],_=this.inputNames.indexOf(g);if(_===-1)throw new Error(`invalid input '${g}'`);i.push(y),a.push(_)});let s=[],n=[];Object.entries(t).forEach(h=>{let g=h[0],y=h[1],_=this.outputNames.indexOf(g);if(_===-1)throw new Error(`invalid output '${g}'`);s.push(y),n.push(_)});let u=i.map((h,g)=>ma(h,()=>`input "${this.inputNames[a[g]]}"`)),l=s.map((h,g)=>h?ma(h,()=>`output "${this.outputNames[n[g]]}"`):null),p=await hf(this.sessionId,a,u,n,l,r),f={};for(let h=0;h<p.length;h++)f[this.outputNames[n[h]]]=s[h]??Bd(p[h]);return Xe(),f}startProfiling(){}endProfiling(){ff(this.sessionId)}}}),yf={};Vt(yf,{OnnxruntimeWebAssemblyBackend:()=>Aa,initializeFlags:()=>Ca,wasmBackend:()=>_f});var Ca,Aa,_f,H0=P(()=>{Le(),mf(),G0(),Ca=()=>{(typeof ye.wasm.initTimeout!="number"||ye.wasm.initTimeout<0)&&(ye.wasm.initTimeout=0);let e=ye.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),ye.wasm.simd=!1),typeof ye.wasm.proxy!="boolean"&&(ye.wasm.proxy=!1),typeof ye.wasm.trace!="boolean"&&(ye.wasm.trace=!1),typeof ye.wasm.numThreads!="number"||!Number.isInteger(ye.wasm.numThreads)||ye.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)ye.wasm.numThreads=1;else{let t=typeof navigator>"u"?Cg("node:os").cpus().length:navigator.hardwareConcurrency;ye.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},Aa=class{async init(e){Ca(),await uf(),await lf(e)}async createInferenceSessionHandler(e,t){let r=new gf;return await r.loadModel(e,t),r}},_f=new Aa});Le();Le();Le();var F0="1.27.0";{let e=(H0(),dr(yf)).wasmBackend;Pt("webgpu",e,5),Pt("webnn",e,5),Pt("cpu",e,10),Pt("wasm",e,10)}Object.defineProperty(ye.versions,"web",{value:F0,enumerable:!0});/**
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
*//**
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
 *//**
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
 */ye.wasm.wasmPaths="/inhaler-coach/collector/ort/";ye.wasm.numThreads=1;const j0="/inhaler-coach/collector/models/inhaler.onnx",Re=640;let Oa=null,Nd=null,ur=null;const qr=new Float32Array(3*Re*Re);async function K0(){Oa||(Nd=new OffscreenCanvas(Re,Re),ur=Nd.getContext("2d",{willReadFrequently:!0}),Oa=await Na.create(j0,{executionProviders:["wasm"],graphOptimizationLevel:"all"}),self.postMessage({ready:!0}))}const Z0={present:!1,score:0,center:null,box:null};function X0(e,t,r){const i=Math.min(Re/t,Re/r),a=Math.round(t*i),s=Math.round(r*i),n=Re-a>>1,u=Re-s>>1;ur.fillStyle="#000",ur.fillRect(0,0,Re,Re),ur.drawImage(e,0,0,t,r,n,u,a,s);const{data:l}=ur.getImageData(0,0,Re,Re),p=Re*Re;for(let f=0;f<p;f++){const h=f*4;qr[f]=l[h]/255,qr[p+f]=l[h+1]/255,qr[2*p+f]=l[h+2]/255}return{scale:i,padX:n,padY:u}}self.onmessage=async e=>{const{id:t,bitmap:r,srcW:i,srcH:a,conf:s}=e.data;try{await K0();const{scale:n,padX:u,padY:l}=X0(r,i,a);r.close();const p=new Ze("float32",qr,[1,3,Re,Re]),f=await Oa.run({images:p}),h=f.output0.data,g=f.output0.dims[1];let y=-1,_=s;for(let S=0;S<g;S++){const E=h[S*6+4];E>_&&(_=E,y=S)}if(y<0){self.postMessage({id:t,result:Z0});return}const $=y*6,k=(h[$]-u)/n,x=(h[$+1]-l)/n,b=(h[$+2]-u)/n,I=(h[$+3]-l)/n;self.postMessage({id:t,result:{present:!0,score:+_.toFixed(3),center:{x:(k+b)/2/i,y:(x+I)/2/a},box:{x:k/i,y:x/a,w:(b-k)/i,h:(I-x)/a}}})}catch(n){r&&r.close?.(),self.postMessage({id:t,error:String(n)})}};
