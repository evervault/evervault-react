!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e(require("react"));else if("function"==typeof define&&define.amd)define(["react"],e);else{var r="object"==typeof exports?e(require("react")):e(t.react);for(var n in r)("object"==typeof exports?exports:t)[n]=r[n]}}(window,(function(t){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=3)}([function(e,r){e.exports=t},function(t,e,r){t.exports=r(4)()},function(t,e,r){const n=r(6),o=r(12);t.exports={keyStore:new class{constructor(){let t=void 0;this.subtle=n.getSubtleCrypto(),this.encryptString=e=>{const r=n.dataToBuffer(e),i=window.crypto.getRandomValues(new Uint8Array(12));return this.subtle.encrypt({name:"AES-GCM",iv:i},t,r).then(t=>n.buildEvervaultString(i,t)).catch(t=>{throw new o.EncryptionError("evervault.encrypt",{str:e,thrownError:t})})},this.decryptString=e=>{if(n.isEvervaultString(e)){const r=n.parseEvervaultString(e),i=n.b64ToBuffer(r.browserData),a=n.b64ToBuffer(r.iv);return this.subtle.decrypt({name:"AES-GCM",iv:a},t,i).then(t=>n.bufferToString(t)).catch(t=>{throw new o.DecryptionError("evervault.decrypt",{str:e,thrownError:t})})}return e},this.updateKey=async e=>{if(!t){const r=await n.getEncryptionKey(e||localStorage.getItem("evervault-privateKey"));t=r}}}},urls:{auth:"https://auth.evervault.com",api:"https://api.evervault.com"},init:function(t,e){if(!t)throw new o.EvervaultError("No appId provided to the evervault sdk");if(this.appId=t,e){const t=/^(http){1}(s)?(:\/{2}){1}/;let r={};Object.keys(e).forEach(n=>{const i=e[n];if(t.test(i))r[n]=i;else if(i)throw new o.EvervaultError(`Invalid URL received in evervault sdk for ${n} url (value: ${i})`)}),Object.assign(this.urls,r)}},set:async function(t){return t=await this.encrypt(t,{preserveObjectShape:!0}),this.fetch(`${this.urls.api}/data/${this.appId}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({data:t})}).then(e=>{if(!e.ok)throw o.mapStatusToError(e.status,"evervault.set",{data:t});return e.json()}).then(t=>t)},get:async function(t=""){return this.fetch(`${this.urls.api}/data/${this.appId}/${t}`,{method:"GET",headers:{"Content-Type":"application/json"}}).then(e=>{if(!e.ok)throw o.mapStatusToError(e.status,"evervault.get",{requested:t});return e.json()}).then(t=>this.decrypt(t))},getValidAccessToken:async function(){if(n.checkAccessToken(localStorage.getItem("evervault-accessToken")))return localStorage.getItem("evervault-accessToken");return(await this.refreshAccessToken(localStorage.getItem("evervault-accessToken"),localStorage.getItem("evervault-refreshToken"))).accessToken},encrypt:function(t,e={preserveObjectShape:!0}){const r=(t,e)=>{if(t){return(async(t,e)=>{let r=Object.assign({},t);for(let t=0;t<e.length;t++){let o=e[t];r[o]&&(r[o]=await this.keyStore.encryptString(n.ensureString(r[o])))}return r})(t,e)}};if("object"==typeof t&&t&&"Array"!==t.constructor.name&&e.preserveObjectShape){const n=e.fieldsToEncrypt||Object.keys(t);return this.keyStore.updateKey(e.privateKey).then(()=>r(t,n)).catch(e=>{throw new o.EncryptionError("evervault.encrypt",{data:t,thrownError:e.message})})}if(void 0!==t&&"symbol"!=typeof t)return this.keyStore.updateKey(e.privateKey).then(()=>this.keyStore.encryptString(n.ensureString(t))).catch(e=>{throw new o.EncryptionError("evervault.encrypt",{data:t,thrownError:e.message})})},decrypt:function(t,e){const r=t=>(async e=>{let r=new Array(e.length);for(let o=0;o<t.length;o++)r[o]=await this.keyStore.decryptString(n.ensureString(e[o]));return r})(t),o=(t,e)=>{if(t){return(async(t,e)=>{let r=Object.assign({},t);for(let t=0;t<e.length;t++){let o=e[t];r[o]&&(r[o]=await this.keyStore.decryptString(n.ensureString(r[o])))}return r})(t,e)}};return"object"==typeof t?"Array"===t.constructor.name?this.keyStore.updateKey(e).then(()=>r(t)):this.keyStore.updateKey(e).then(()=>o(t,Object.keys(t))):void 0!==t&&"symbol"!=typeof t?this.keyStore.updateKey(e).then(()=>this.keyStore.decryptString(n.ensureString(t))):t},logout:function(t){localStorage.removeItem("evervault-privateKey"),localStorage.removeItem("evervault-accessToken"),localStorage.removeItem("evervault-refreshToken"),localStorage.removeItem("evervault-haiku"),t?window.location.replace(t):n.handleRedirect(`${this.urls.auth}/${this.appId}`)},refreshAccessToken:function(t,e){const r={accessToken:t||localStorage.getItem("evervault-accessToken"),refreshToken:e||localStorage.getItem("evervault-refreshToken"),appId:this.appId};return window.fetch(`${this.urls.api}/token/refresh`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}).then(t=>401===t.status?this.logout():t.json()).then(t=>{if(!t||!t.accessToken)return;const{accessToken:e,refreshToken:r}=t;return localStorage.setItem("evervault-accessToken",e),this.accessToken=e,localStorage.setItem("evervault-refreshToken",r),this.refreshToken=r,t}).catch(t=>{throw new o.EvervaultError("Unable to retrieve refresh token",t)})},checkAuth:function(t){t&&this.init(t);const e=window.location.hash.substring(2);if(e&&n.areHashValuesFromAuth(e))if("pushState"in history){const{pathname:t,search:e}=window.location,r=t+(e||"");history.replaceState("",document.title,r)}else window.location.hash="/";const r=localStorage.getItem("evervault-privateKey"),o=localStorage.getItem("evervault-accessToken"),i=localStorage.getItem("evervault-refreshToken"),a=Boolean(o&&i&&r);if(a||e){if(e){const{accessToken:t,refreshToken:r,haiku:o}=n.setUserKeysInStorage(e);return this.accessToken=t,this.refreshToken=r,this.haiku=o,this.keyStore.updateKey().then(()=>!0)}!a||this.accessToken||this.refreshToken||this.haiku||(this.accessToken=o,this.refreshToken=i,this.haiku=localStorage.getItem("evervault-haiku"))}else n.handleRedirect(`${this.urls.auth}/${this.appId}`);return a},auth:e=>t.exports.checkAuth(e),fetch:function(t,e={}){const r=(t,e)=>{const r={authorization:`Bearer ${this.accessToken}`},n=Object.assign(r,e.headers),o=Object.assign(e,{headers:n});return window.fetch(t,o)};return r(t,e).then(n=>n.ok||401!==n.status?n:this.refreshAccessToken(this.accessToken,this.refreshToken).then(()=>r(t,e)))},errors:{...o}}},function(t,e,r){"use strict";r.r(e),r.d(e,"EvervaultContext",(function(){return S})),r.d(e,"EvervaultProvider",(function(){return T})),r.d(e,"EvervaultConsumer",(function(){return A})),r.d(e,"useEvervault",(function(){return _})),r.d(e,"withEvervault",(function(){return k})),r.d(e,"Decrypt",(function(){return P})),r.d(e,"withEvervaultDecrypt",(function(){return O})),r.d(e,"EvervaultForm",(function(){return B}));var n=r(0),o=r.n(n),i=r(1),a=r.n(i),u=r(2),s=r.n(u);function c(t){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function f(t,e,r,n,o,i,a){try{var u=t[i](a),s=u.value}catch(t){return void r(t)}u.done?e(s):Promise.resolve(s).then(n,o)}function h(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function l(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?h(Object(r),!0).forEach((function(e){p(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):h(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function p(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function y(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var r=[],n=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(n=(a=u.next()).done)&&(r.push(a.value),!e||r.length!==e);n=!0);}catch(t){o=!0,i=t}finally{try{n||null==u.return||u.return()}finally{if(o)throw i}}return r}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function g(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function d(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function v(t,e,r){return e&&d(t.prototype,e),r&&d(t,r),t}function w(t,e){return!e||"object"!==c(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function b(t){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function m(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&E(t,e)}function E(t,e){return(E=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var S=o.a.createContext(void 0),T=S.Provider,A=S.Consumer;function _(){var t=o.a.useContext(S);if(!t)throw new Error("No context found for evervault");if("function"!=typeof n.useContext)throw new Error("You must use React >= 16.8 in order to use useEvervault()");return t}function k(t,e){var r=e.appId,n=e.authUrl,i=e.apiUrl,a=e.useEvervaultContext;return(function(e){function u(t){var e;return g(this,u),e=w(this,b(u).call(this,t)),s.a.init(r,{auth:n,api:i}),s.a.checkAuth(),e.state={evervault:s.a},e}return m(u,e),v(u,[{key:"render",value:function(){return a?o.a.createElement(T,{value:this.state.evervault},o.a.createElement(t,null)):o.a.createElement(t,{evervault:this.state.evervault})}}]),u}(o.a.Component))}function R(t){var e=t.data,r=y(o.a.useState(void 0),2),n=r[0],i=r[1];return o.a.useEffect((function(){var t=!1;return s.a.decrypt(e).then((function(e){t||i(e)})),function(){t=!0}}),[e]),o.a.createElement(o.a.Fragment,null,n)}function P(t){var e=t.children,r=t.data;if(!Boolean(e)&&Boolean(r))return o.a.createElement(R,{data:r});var n=y(o.a.useState({loading:!0,decrypted:void 0,error:void 0}),2),i=n[0],a=n[1];return o.a.useEffect((function(){var t=!1;return s.a.decrypt(r).then((function(e){t||a({loading:!1,decrypted:e,error:void 0})})).catch((function(e){t||a({loading:!1,decrypted:void 0,error:"An error occurred while decrypting your data"})})),function(){t=!0}}),[]),e(l({},i))}function O(t,e){return function(r){function n(t){var e;return g(this,n),(e=w(this,b(n).call(this,t))).state={loading:!0,decrypted:void 0,error:void 0},e}return m(n,r),v(n,[{key:"componentDidMount",value:function(){var t=this;s.a.decrypt(e).then((function(e){t.setState({loading:!1,decrypted:e,error:void 0})})).catch((function(e){t.setState({loading:!1,decrypted:void 0,error:"An error occurred while decrypting your data"})}))}},{key:"render",value:function(){return o.a.createElement(t,this.state)}}]),n}(o.a.Component)}function B(t){var e=t.children,r=t.initialValues,n=t.handleSubmit,i=t.fieldsToEncrypt,a=y(o.a.useState(r),2),u=a[0],c=a[1],h=function(){var t,e=(t=regeneratorRuntime.mark((function t(e){var r,o,a;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.preventDefault(),r=i,Boolean(r)||(r=Object.keys(u)),r.length<1&&n(u),o=Object.assign({},u),a=0;case 6:if(!(a<r.length)){t.next=14;break}if(!u[r[a]]){t.next=11;break}return t.next=10,s.a.encrypt(u[r[a]]);case 10:o[r[a]]=t.sent;case 11:a++,t.next=6;break;case 14:return t.abrupt("return",n(o));case 15:case"end":return t.stop()}}),t)})),function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){f(i,n,o,a,u,"next",t)}function u(t){f(i,n,o,a,u,"throw",t)}a(void 0)}))});return function(t){return e.apply(this,arguments)}}();return o.a.createElement("form",{onSubmit:h},e({values:l({},u),handleChange:function(t){c(l({},u,p({},t.target.name,t.target.value)))}}))}P.propTypes={children:a.a.func,data:a.a.oneOfType([a.a.string,a.a.object]).isRequired},B.propTypes={handleSubmit:a.a.func.isRequired,fieldsToEncrypt:a.a.array,initialValues:a.a.object}},function(t,e,r){"use strict";var n=r(5);function o(){}function i(){}i.resetWarningCache=o,t.exports=function(){function t(t,e,r,o,i,a){if(a!==n){var u=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw u.name="Invariant Violation",u}}function e(){return t}t.isRequired=t;var r={array:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:e,element:t,elementType:t,instanceOf:e,node:t,objectOf:e,oneOf:e,oneOfType:e,shape:e,exact:e,checkPropTypes:i,resetWarningCache:o};return r.PropTypes=r,r}},function(t,e,r){"use strict";t.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(t,e,r){(function(e){t.exports=class t{static getEncryptionKey(t){const e=this.b64ToBuffer(t);return this.getSubtleCrypto().importKey("raw",e,{name:"AES-GCM"},!1,["encrypt","decrypt"])}static padString(t){let r=t.length,n=r%4;if(!n)return t;let o=r,i=4-n,a=r+i,u=e.alloc(a);for(u.write(t);i--;)u.write("=",o++);return u.toString()}static b64ToBuffer(t){const e=this.padString(t).replace(/\-/g,"+").replace(/_/g,"/"),r=window.atob(e);for(var n=new ArrayBuffer(r.length),o=new Uint8Array(n),i=0;i<r.length;i++)o[i]=r.charCodeAt(i);return o}static ensureString(t){return(t=>"string"==typeof t?t:["bigint","function"].includes(typeof t)?t.toString():JSON.stringify(t))(t).trim()}static bufToStr(t){const e=new Uint8Array(t);let r,n=0,o="",i=8*n;for(;i+8<e.length;)r=e.subarray(i,i+8),o+=String.fromCharCode.apply(null,r),n++,i=8*n;return o+=String.fromCharCode.apply(null,e.subarray(i)),o}static bufferToB64(t){return window.btoa(this.bufToStr(t))}static dataToBuffer(t){return(new TextEncoder).encode(t)}static checkAccessToken(t){return JSON.parse(this.bufToStr(this.b64ToBuffer(t.split(".")[1]))).exp>Math.floor(Date.now()/1e3)}static parseEvervaultString(t){const e=t.split(":");if(e.length<4)throw new Error("String does not match expected structure");return{prefix:e[0],version:e[1],iv:e[2],browserData:e[3]}}static isEvervaultString(t){return/^enc:v\d:(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?:(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/s.test(t)}static bufferToString(t){const e=new Uint8Array(t);let r,n=0,o="",i=8*n,a=new TextDecoder("utf-8");for(;i+8<e.length;)r=e.subarray(i,i+8),o+=a.decode(r),n++,i=8*n;return o+=a.decode(e.subarray(i)),o}static buildEvervaultString(t,e){return`enc:v1:${this.bufferToB64(t)}:${this.bufferToB64(e)}`}static setUserKeysInStorage(t){const[e,r,n]=t.split(":");localStorage.setItem("evervault-privateKey",e),localStorage.setItem("evervault-accessToken",r),localStorage.setItem("evervault-refreshToken",n);const o=JSON.parse(window.atob(r.split(".")[1])).haiku;return localStorage.setItem("evervault-haiku",o),{haiku:o,accessToken:r,refreshToken:n}}static handleRedirect(e){const r=t.getParams(),n=["redirectUrl","state","nonce"],o=Object.keys(r).filter(t=>n.includes(t)).map(t=>`${t}=${encodeURI(r[t])}`).join("&");window.location.replace(`${e}${o&&o.length>0?"?"+o:o}`)}static getParams(){let t={};return window.location.search.substr(1).split("&").forEach(e=>{const[r,n]=e.split("=");t[r]=decodeURIComponent(n)}),t}static areHashValuesFromAuth(t){return/^([A-Za-z0-9-_])+:((eyJ){1}[A-Za-z0-9-_]+\.(eyJ){1}[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+\/=]*){1}:([a-z]+-[a-z]+-[0-9]{6,8}.[a-f0-9]{8}-[a-f0-9]{3,4}-[a-f0-9]{3,4}-[a-f0-9]{3,4}-[a-f0-9]{12}){1}$/.test(t)}static getSubtleCrypto(){return!window.crypto.subtle&&window.crypto.webkitSubtle?window.crypto.webkitSubtle:window.crypto.subtle}}}).call(this,r(7).Buffer)},function(t,e,r){"use strict";(function(t){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
var n=r(9),o=r(10),i=r(11);function a(){return s.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function u(t,e){if(a()<e)throw new RangeError("Invalid typed array length");return s.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(e)).__proto__=s.prototype:(null===t&&(t=new s(e)),t.length=e),t}function s(t,e,r){if(!(s.TYPED_ARRAY_SUPPORT||this instanceof s))return new s(t,e,r);if("number"==typeof t){if("string"==typeof e)throw new Error("If encoding is specified then the first argument must be a string");return h(this,t)}return c(this,t,e,r)}function c(t,e,r,n){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer?function(t,e,r,n){if(e.byteLength,r<0||e.byteLength<r)throw new RangeError("'offset' is out of bounds");if(e.byteLength<r+(n||0))throw new RangeError("'length' is out of bounds");e=void 0===r&&void 0===n?new Uint8Array(e):void 0===n?new Uint8Array(e,r):new Uint8Array(e,r,n);s.TYPED_ARRAY_SUPPORT?(t=e).__proto__=s.prototype:t=l(t,e);return t}(t,e,r,n):"string"==typeof e?function(t,e,r){"string"==typeof r&&""!==r||(r="utf8");if(!s.isEncoding(r))throw new TypeError('"encoding" must be a valid string encoding');var n=0|y(e,r),o=(t=u(t,n)).write(e,r);o!==n&&(t=t.slice(0,o));return t}(t,e,r):function(t,e){if(s.isBuffer(e)){var r=0|p(e.length);return 0===(t=u(t,r)).length?t:(e.copy(t,0,0,r),t)}if(e){if("undefined"!=typeof ArrayBuffer&&e.buffer instanceof ArrayBuffer||"length"in e)return"number"!=typeof e.length||(n=e.length)!=n?u(t,0):l(t,e);if("Buffer"===e.type&&i(e.data))return l(t,e.data)}var n;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(t,e)}function f(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number');if(t<0)throw new RangeError('"size" argument must not be negative')}function h(t,e){if(f(e),t=u(t,e<0?0:0|p(e)),!s.TYPED_ARRAY_SUPPORT)for(var r=0;r<e;++r)t[r]=0;return t}function l(t,e){var r=e.length<0?0:0|p(e.length);t=u(t,r);for(var n=0;n<r;n+=1)t[n]=255&e[n];return t}function p(t){if(t>=a())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+a().toString(16)+" bytes");return 0|t}function y(t,e){if(s.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var r=t.length;if(0===r)return 0;for(var n=!1;;)switch(e){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":case void 0:return N(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return $(t).length;default:if(n)return N(t).length;e=(""+e).toLowerCase(),n=!0}}function g(t,e,r){var n=!1;if((void 0===e||e<0)&&(e=0),e>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if((r>>>=0)<=(e>>>=0))return"";for(t||(t="utf8");;)switch(t){case"hex":return O(this,e,r);case"utf8":case"utf-8":return k(this,e,r);case"ascii":return R(this,e,r);case"latin1":case"binary":return P(this,e,r);case"base64":return _(this,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return B(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=!0}}function d(t,e,r){var n=t[e];t[e]=t[r],t[r]=n}function v(t,e,r,n,o){if(0===t.length)return-1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,isNaN(r)&&(r=o?0:t.length-1),r<0&&(r=t.length+r),r>=t.length){if(o)return-1;r=t.length-1}else if(r<0){if(!o)return-1;r=0}if("string"==typeof e&&(e=s.from(e,n)),s.isBuffer(e))return 0===e.length?-1:w(t,e,r,n,o);if("number"==typeof e)return e&=255,s.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?o?Uint8Array.prototype.indexOf.call(t,e,r):Uint8Array.prototype.lastIndexOf.call(t,e,r):w(t,[e],r,n,o);throw new TypeError("val must be string, number or Buffer")}function w(t,e,r,n,o){var i,a=1,u=t.length,s=e.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return-1;a=2,u/=2,s/=2,r/=2}function c(t,e){return 1===a?t[e]:t.readUInt16BE(e*a)}if(o){var f=-1;for(i=r;i<u;i++)if(c(t,i)===c(e,-1===f?0:i-f)){if(-1===f&&(f=i),i-f+1===s)return f*a}else-1!==f&&(i-=i-f),f=-1}else for(r+s>u&&(r=u-s),i=r;i>=0;i--){for(var h=!0,l=0;l<s;l++)if(c(t,i+l)!==c(e,l)){h=!1;break}if(h)return i}return-1}function b(t,e,r,n){r=Number(r)||0;var o=t.length-r;n?(n=Number(n))>o&&(n=o):n=o;var i=e.length;if(i%2!=0)throw new TypeError("Invalid hex string");n>i/2&&(n=i/2);for(var a=0;a<n;++a){var u=parseInt(e.substr(2*a,2),16);if(isNaN(u))return a;t[r+a]=u}return a}function m(t,e,r,n){return z(N(e,t.length-r),t,r,n)}function E(t,e,r,n){return z(function(t){for(var e=[],r=0;r<t.length;++r)e.push(255&t.charCodeAt(r));return e}(e),t,r,n)}function S(t,e,r,n){return E(t,e,r,n)}function T(t,e,r,n){return z($(e),t,r,n)}function A(t,e,r,n){return z(function(t,e){for(var r,n,o,i=[],a=0;a<t.length&&!((e-=2)<0);++a)r=t.charCodeAt(a),n=r>>8,o=r%256,i.push(o),i.push(n);return i}(e,t.length-r),t,r,n)}function _(t,e,r){return 0===e&&r===t.length?n.fromByteArray(t):n.fromByteArray(t.slice(e,r))}function k(t,e,r){r=Math.min(t.length,r);for(var n=[],o=e;o<r;){var i,a,u,s,c=t[o],f=null,h=c>239?4:c>223?3:c>191?2:1;if(o+h<=r)switch(h){case 1:c<128&&(f=c);break;case 2:128==(192&(i=t[o+1]))&&(s=(31&c)<<6|63&i)>127&&(f=s);break;case 3:i=t[o+1],a=t[o+2],128==(192&i)&&128==(192&a)&&(s=(15&c)<<12|(63&i)<<6|63&a)>2047&&(s<55296||s>57343)&&(f=s);break;case 4:i=t[o+1],a=t[o+2],u=t[o+3],128==(192&i)&&128==(192&a)&&128==(192&u)&&(s=(15&c)<<18|(63&i)<<12|(63&a)<<6|63&u)>65535&&s<1114112&&(f=s)}null===f?(f=65533,h=1):f>65535&&(f-=65536,n.push(f>>>10&1023|55296),f=56320|1023&f),n.push(f),o+=h}return function(t){var e=t.length;if(e<=4096)return String.fromCharCode.apply(String,t);var r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=4096));return r}(n)}e.Buffer=s,e.SlowBuffer=function(t){+t!=t&&(t=0);return s.alloc(+t)},e.INSPECT_MAX_BYTES=50,s.TYPED_ARRAY_SUPPORT=void 0!==t.TYPED_ARRAY_SUPPORT?t.TYPED_ARRAY_SUPPORT:function(){try{var t=new Uint8Array(1);return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(t){return!1}}(),e.kMaxLength=a(),s.poolSize=8192,s._augment=function(t){return t.__proto__=s.prototype,t},s.from=function(t,e,r){return c(null,t,e,r)},s.TYPED_ARRAY_SUPPORT&&(s.prototype.__proto__=Uint8Array.prototype,s.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&s[Symbol.species]===s&&Object.defineProperty(s,Symbol.species,{value:null,configurable:!0})),s.alloc=function(t,e,r){return function(t,e,r,n){return f(e),e<=0?u(t,e):void 0!==r?"string"==typeof n?u(t,e).fill(r,n):u(t,e).fill(r):u(t,e)}(null,t,e,r)},s.allocUnsafe=function(t){return h(null,t)},s.allocUnsafeSlow=function(t){return h(null,t)},s.isBuffer=function(t){return!(null==t||!t._isBuffer)},s.compare=function(t,e){if(!s.isBuffer(t)||!s.isBuffer(e))throw new TypeError("Arguments must be Buffers");if(t===e)return 0;for(var r=t.length,n=e.length,o=0,i=Math.min(r,n);o<i;++o)if(t[o]!==e[o]){r=t[o],n=e[o];break}return r<n?-1:n<r?1:0},s.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},s.concat=function(t,e){if(!i(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return s.alloc(0);var r;if(void 0===e)for(e=0,r=0;r<t.length;++r)e+=t[r].length;var n=s.allocUnsafe(e),o=0;for(r=0;r<t.length;++r){var a=t[r];if(!s.isBuffer(a))throw new TypeError('"list" argument must be an Array of Buffers');a.copy(n,o),o+=a.length}return n},s.byteLength=y,s.prototype._isBuffer=!0,s.prototype.swap16=function(){var t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var e=0;e<t;e+=2)d(this,e,e+1);return this},s.prototype.swap32=function(){var t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var e=0;e<t;e+=4)d(this,e,e+3),d(this,e+1,e+2);return this},s.prototype.swap64=function(){var t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var e=0;e<t;e+=8)d(this,e,e+7),d(this,e+1,e+6),d(this,e+2,e+5),d(this,e+3,e+4);return this},s.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?k(this,0,t):g.apply(this,arguments)},s.prototype.equals=function(t){if(!s.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===s.compare(this,t)},s.prototype.inspect=function(){var t="",r=e.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,r).match(/.{2}/g).join(" "),this.length>r&&(t+=" ... ")),"<Buffer "+t+">"},s.prototype.compare=function(t,e,r,n,o){if(!s.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===o&&(o=this.length),e<0||r>t.length||n<0||o>this.length)throw new RangeError("out of range index");if(n>=o&&e>=r)return 0;if(n>=o)return-1;if(e>=r)return 1;if(this===t)return 0;for(var i=(o>>>=0)-(n>>>=0),a=(r>>>=0)-(e>>>=0),u=Math.min(i,a),c=this.slice(n,o),f=t.slice(e,r),h=0;h<u;++h)if(c[h]!==f[h]){i=c[h],a=f[h];break}return i<a?-1:a<i?1:0},s.prototype.includes=function(t,e,r){return-1!==this.indexOf(t,e,r)},s.prototype.indexOf=function(t,e,r){return v(this,t,e,r,!0)},s.prototype.lastIndexOf=function(t,e,r){return v(this,t,e,r,!1)},s.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else{if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e|=0,isFinite(r)?(r|=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}var o=this.length-e;if((void 0===r||r>o)&&(r=o),t.length>0&&(r<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var i=!1;;)switch(n){case"hex":return b(this,t,e,r);case"utf8":case"utf-8":return m(this,t,e,r);case"ascii":return E(this,t,e,r);case"latin1":case"binary":return S(this,t,e,r);case"base64":return T(this,t,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return A(this,t,e,r);default:if(i)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),i=!0}},s.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function R(t,e,r){var n="";r=Math.min(t.length,r);for(var o=e;o<r;++o)n+=String.fromCharCode(127&t[o]);return n}function P(t,e,r){var n="";r=Math.min(t.length,r);for(var o=e;o<r;++o)n+=String.fromCharCode(t[o]);return n}function O(t,e,r){var n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n);for(var o="",i=e;i<r;++i)o+=L(t[i]);return o}function B(t,e,r){for(var n=t.slice(e,r),o="",i=0;i<n.length;i+=2)o+=String.fromCharCode(n[i]+256*n[i+1]);return o}function I(t,e,r){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function U(t,e,r,n,o,i){if(!s.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>o||e<i)throw new RangeError('"value" argument is out of bounds');if(r+n>t.length)throw new RangeError("Index out of range")}function x(t,e,r,n){e<0&&(e=65535+e+1);for(var o=0,i=Math.min(t.length-r,2);o<i;++o)t[r+o]=(e&255<<8*(n?o:1-o))>>>8*(n?o:1-o)}function j(t,e,r,n){e<0&&(e=4294967295+e+1);for(var o=0,i=Math.min(t.length-r,4);o<i;++o)t[r+o]=e>>>8*(n?o:3-o)&255}function C(t,e,r,n,o,i){if(r+n>t.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function Y(t,e,r,n,i){return i||C(t,0,r,4),o.write(t,e,r,n,23,4),r+4}function D(t,e,r,n,i){return i||C(t,0,r,8),o.write(t,e,r,n,52,8),r+8}s.prototype.slice=function(t,e){var r,n=this.length;if((t=~~t)<0?(t+=n)<0&&(t=0):t>n&&(t=n),(e=void 0===e?n:~~e)<0?(e+=n)<0&&(e=0):e>n&&(e=n),e<t&&(e=t),s.TYPED_ARRAY_SUPPORT)(r=this.subarray(t,e)).__proto__=s.prototype;else{var o=e-t;r=new s(o,void 0);for(var i=0;i<o;++i)r[i]=this[i+t]}return r},s.prototype.readUIntLE=function(t,e,r){t|=0,e|=0,r||I(t,e,this.length);for(var n=this[t],o=1,i=0;++i<e&&(o*=256);)n+=this[t+i]*o;return n},s.prototype.readUIntBE=function(t,e,r){t|=0,e|=0,r||I(t,e,this.length);for(var n=this[t+--e],o=1;e>0&&(o*=256);)n+=this[t+--e]*o;return n},s.prototype.readUInt8=function(t,e){return e||I(t,1,this.length),this[t]},s.prototype.readUInt16LE=function(t,e){return e||I(t,2,this.length),this[t]|this[t+1]<<8},s.prototype.readUInt16BE=function(t,e){return e||I(t,2,this.length),this[t]<<8|this[t+1]},s.prototype.readUInt32LE=function(t,e){return e||I(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},s.prototype.readUInt32BE=function(t,e){return e||I(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},s.prototype.readIntLE=function(t,e,r){t|=0,e|=0,r||I(t,e,this.length);for(var n=this[t],o=1,i=0;++i<e&&(o*=256);)n+=this[t+i]*o;return n>=(o*=128)&&(n-=Math.pow(2,8*e)),n},s.prototype.readIntBE=function(t,e,r){t|=0,e|=0,r||I(t,e,this.length);for(var n=e,o=1,i=this[t+--n];n>0&&(o*=256);)i+=this[t+--n]*o;return i>=(o*=128)&&(i-=Math.pow(2,8*e)),i},s.prototype.readInt8=function(t,e){return e||I(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},s.prototype.readInt16LE=function(t,e){e||I(t,2,this.length);var r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},s.prototype.readInt16BE=function(t,e){e||I(t,2,this.length);var r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},s.prototype.readInt32LE=function(t,e){return e||I(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},s.prototype.readInt32BE=function(t,e){return e||I(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},s.prototype.readFloatLE=function(t,e){return e||I(t,4,this.length),o.read(this,t,!0,23,4)},s.prototype.readFloatBE=function(t,e){return e||I(t,4,this.length),o.read(this,t,!1,23,4)},s.prototype.readDoubleLE=function(t,e){return e||I(t,8,this.length),o.read(this,t,!0,52,8)},s.prototype.readDoubleBE=function(t,e){return e||I(t,8,this.length),o.read(this,t,!1,52,8)},s.prototype.writeUIntLE=function(t,e,r,n){(t=+t,e|=0,r|=0,n)||U(this,t,e,r,Math.pow(2,8*r)-1,0);var o=1,i=0;for(this[e]=255&t;++i<r&&(o*=256);)this[e+i]=t/o&255;return e+r},s.prototype.writeUIntBE=function(t,e,r,n){(t=+t,e|=0,r|=0,n)||U(this,t,e,r,Math.pow(2,8*r)-1,0);var o=r-1,i=1;for(this[e+o]=255&t;--o>=0&&(i*=256);)this[e+o]=t/i&255;return e+r},s.prototype.writeUInt8=function(t,e,r){return t=+t,e|=0,r||U(this,t,e,1,255,0),s.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[e]=255&t,e+1},s.prototype.writeUInt16LE=function(t,e,r){return t=+t,e|=0,r||U(this,t,e,2,65535,0),s.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):x(this,t,e,!0),e+2},s.prototype.writeUInt16BE=function(t,e,r){return t=+t,e|=0,r||U(this,t,e,2,65535,0),s.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):x(this,t,e,!1),e+2},s.prototype.writeUInt32LE=function(t,e,r){return t=+t,e|=0,r||U(this,t,e,4,4294967295,0),s.TYPED_ARRAY_SUPPORT?(this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t):j(this,t,e,!0),e+4},s.prototype.writeUInt32BE=function(t,e,r){return t=+t,e|=0,r||U(this,t,e,4,4294967295,0),s.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):j(this,t,e,!1),e+4},s.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e|=0,!n){var o=Math.pow(2,8*r-1);U(this,t,e,r,o-1,-o)}var i=0,a=1,u=0;for(this[e]=255&t;++i<r&&(a*=256);)t<0&&0===u&&0!==this[e+i-1]&&(u=1),this[e+i]=(t/a>>0)-u&255;return e+r},s.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e|=0,!n){var o=Math.pow(2,8*r-1);U(this,t,e,r,o-1,-o)}var i=r-1,a=1,u=0;for(this[e+i]=255&t;--i>=0&&(a*=256);)t<0&&0===u&&0!==this[e+i+1]&&(u=1),this[e+i]=(t/a>>0)-u&255;return e+r},s.prototype.writeInt8=function(t,e,r){return t=+t,e|=0,r||U(this,t,e,1,127,-128),s.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),t<0&&(t=255+t+1),this[e]=255&t,e+1},s.prototype.writeInt16LE=function(t,e,r){return t=+t,e|=0,r||U(this,t,e,2,32767,-32768),s.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):x(this,t,e,!0),e+2},s.prototype.writeInt16BE=function(t,e,r){return t=+t,e|=0,r||U(this,t,e,2,32767,-32768),s.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):x(this,t,e,!1),e+2},s.prototype.writeInt32LE=function(t,e,r){return t=+t,e|=0,r||U(this,t,e,4,2147483647,-2147483648),s.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24):j(this,t,e,!0),e+4},s.prototype.writeInt32BE=function(t,e,r){return t=+t,e|=0,r||U(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),s.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):j(this,t,e,!1),e+4},s.prototype.writeFloatLE=function(t,e,r){return Y(this,t,e,!0,r)},s.prototype.writeFloatBE=function(t,e,r){return Y(this,t,e,!1,r)},s.prototype.writeDoubleLE=function(t,e,r){return D(this,t,e,!0,r)},s.prototype.writeDoubleBE=function(t,e,r){return D(this,t,e,!1,r)},s.prototype.copy=function(t,e,r,n){if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);var o,i=n-r;if(this===t&&r<e&&e<n)for(o=i-1;o>=0;--o)t[o+e]=this[o+r];else if(i<1e3||!s.TYPED_ARRAY_SUPPORT)for(o=0;o<i;++o)t[o+e]=this[o+r];else Uint8Array.prototype.set.call(t,this.subarray(r,r+i),e);return i},s.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),1===t.length){var o=t.charCodeAt(0);o<256&&(t=o)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!s.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof t&&(t&=255);if(e<0||this.length<e||this.length<r)throw new RangeError("Out of range index");if(r<=e)return this;var i;if(e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0),"number"==typeof t)for(i=e;i<r;++i)this[i]=t;else{var a=s.isBuffer(t)?t:N(new s(t,n).toString()),u=a.length;for(i=0;i<r-e;++i)this[i+e]=a[i%u]}return this};var M=/[^+\/0-9A-Za-z-_]/g;function L(t){return t<16?"0"+t.toString(16):t.toString(16)}function N(t,e){var r;e=e||1/0;for(var n=t.length,o=null,i=[],a=0;a<n;++a){if((r=t.charCodeAt(a))>55295&&r<57344){if(!o){if(r>56319){(e-=3)>-1&&i.push(239,191,189);continue}if(a+1===n){(e-=3)>-1&&i.push(239,191,189);continue}o=r;continue}if(r<56320){(e-=3)>-1&&i.push(239,191,189),o=r;continue}r=65536+(o-55296<<10|r-56320)}else o&&(e-=3)>-1&&i.push(239,191,189);if(o=null,r<128){if((e-=1)<0)break;i.push(r)}else if(r<2048){if((e-=2)<0)break;i.push(r>>6|192,63&r|128)}else if(r<65536){if((e-=3)<0)break;i.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;i.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return i}function $(t){return n.toByteArray(function(t){if((t=function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}(t).replace(M,"")).length<2)return"";for(;t.length%4!=0;)t+="=";return t}(t))}function z(t,e,r,n){for(var o=0;o<n&&!(o+r>=e.length||o>=t.length);++o)e[o+r]=t[o];return o}}).call(this,r(8))},function(t,e){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(t){"object"==typeof window&&(r=window)}t.exports=r},function(t,e,r){"use strict";e.byteLength=function(t){var e=c(t),r=e[0],n=e[1];return 3*(r+n)/4-n},e.toByteArray=function(t){var e,r,n=c(t),a=n[0],u=n[1],s=new i(function(t,e,r){return 3*(e+r)/4-r}(0,a,u)),f=0,h=u>0?a-4:a;for(r=0;r<h;r+=4)e=o[t.charCodeAt(r)]<<18|o[t.charCodeAt(r+1)]<<12|o[t.charCodeAt(r+2)]<<6|o[t.charCodeAt(r+3)],s[f++]=e>>16&255,s[f++]=e>>8&255,s[f++]=255&e;2===u&&(e=o[t.charCodeAt(r)]<<2|o[t.charCodeAt(r+1)]>>4,s[f++]=255&e);1===u&&(e=o[t.charCodeAt(r)]<<10|o[t.charCodeAt(r+1)]<<4|o[t.charCodeAt(r+2)]>>2,s[f++]=e>>8&255,s[f++]=255&e);return s},e.fromByteArray=function(t){for(var e,r=t.length,o=r%3,i=[],a=0,u=r-o;a<u;a+=16383)i.push(f(t,a,a+16383>u?u:a+16383));1===o?(e=t[r-1],i.push(n[e>>2]+n[e<<4&63]+"==")):2===o&&(e=(t[r-2]<<8)+t[r-1],i.push(n[e>>10]+n[e>>4&63]+n[e<<2&63]+"="));return i.join("")};for(var n=[],o=[],i="undefined"!=typeof Uint8Array?Uint8Array:Array,a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",u=0,s=a.length;u<s;++u)n[u]=a[u],o[a.charCodeAt(u)]=u;function c(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return-1===r&&(r=e),[r,r===e?0:4-r%4]}function f(t,e,r){for(var o,i,a=[],u=e;u<r;u+=3)o=(t[u]<<16&16711680)+(t[u+1]<<8&65280)+(255&t[u+2]),a.push(n[(i=o)>>18&63]+n[i>>12&63]+n[i>>6&63]+n[63&i]);return a.join("")}o["-".charCodeAt(0)]=62,o["_".charCodeAt(0)]=63},function(t,e){e.read=function(t,e,r,n,o){var i,a,u=8*o-n-1,s=(1<<u)-1,c=s>>1,f=-7,h=r?o-1:0,l=r?-1:1,p=t[e+h];for(h+=l,i=p&(1<<-f)-1,p>>=-f,f+=u;f>0;i=256*i+t[e+h],h+=l,f-=8);for(a=i&(1<<-f)-1,i>>=-f,f+=n;f>0;a=256*a+t[e+h],h+=l,f-=8);if(0===i)i=1-c;else{if(i===s)return a?NaN:1/0*(p?-1:1);a+=Math.pow(2,n),i-=c}return(p?-1:1)*a*Math.pow(2,i-n)},e.write=function(t,e,r,n,o,i){var a,u,s,c=8*i-o-1,f=(1<<c)-1,h=f>>1,l=23===o?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:i-1,y=n?1:-1,g=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(u=isNaN(e)?1:0,a=f):(a=Math.floor(Math.log(e)/Math.LN2),e*(s=Math.pow(2,-a))<1&&(a--,s*=2),(e+=a+h>=1?l/s:l*Math.pow(2,1-h))*s>=2&&(a++,s/=2),a+h>=f?(u=0,a=f):a+h>=1?(u=(e*s-1)*Math.pow(2,o),a+=h):(u=e*Math.pow(2,h-1)*Math.pow(2,o),a=0));o>=8;t[r+p]=255&u,p+=y,u/=256,o-=8);for(a=a<<o|u,c+=o;c>0;t[r+p]=255&a,p+=y,a/=256,c-=8);t[r+p-y]|=128*g}},function(t,e){var r={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==r.call(t)}},function(t,e){class r extends Error{constructor(t,e,r){super(`[${e}] ${t} ${JSON.stringify(r)}`),this.data=r}}class n extends r{constructor(t,e){super("The requested data could not be found",t,e)}}class o extends r{constructor(t,e){super("Bad request",t,e)}}class i extends r{constructor(t,e){super("You are not authorized to perform this action",t,e)}}t.exports={EvervaultError:r,DataNotFound:n,BadRequest:o,Unauthorized:i,EncryptionError:class extends r{constructor(t,e){super("An error occurred while attempting an encryption operation",t,e)}},DecryptionError:class extends r{constructor(t,e){super("An error occurred while attempting a decryption operation",t,e)}},mapStatusToError:function(t,e,a){switch(t){case 400:return new o(e,a);case 401:return new i(e,a);case 404:return new n(e,a);default:return new r("An unexpected error occurred",e,a)}}}}])}));