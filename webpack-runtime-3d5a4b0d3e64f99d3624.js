!function(){"use strict";var e,t,n,r,o,c,f,i,a,u,s,d,l,p={},b={};function m(e){var t=b[e];if(void 0!==t)return t.exports;var n=b[e]={id:e,loaded:!1,exports:{}};return p[e].call(n.exports,n,n.exports,m),n.loaded=!0,n.exports}m.m=p,e="function"==typeof Symbol?Symbol("webpack then"):"__webpack_then__",t="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",n="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",r=function(e){e&&(e.forEach((function(e){e.r--})),e.forEach((function(e){e.r--?e.r++:e()})))},o=function(e){!--e.r&&e()},c=function(e,t){e?e.push(t):o(t)},m.a=function(f,i,a){var u,s,d,l=a&&[],p=f.exports,b=!0,m=!1,h=function(t,n,r){m||(m=!0,n.r+=t.length,t.map((function(t,o){t[e](n,r)})),m=!1)},y=new Promise((function(e,t){d=t,s=function(){e(p),r(l),l=0}}));y[t]=p,y[e]=function(e,t){if(b)return o(e);u&&h(u,e,t),c(l,e),y.catch(t)},f.exports=y,i((function(f){var i;u=function(f){return f.map((function(f){if(null!==f&&"object"==typeof f){if(f[e])return f;if(f.then){var i=[];f.then((function(e){a[t]=e,r(i),i=0}),(function(e){a[n]=e,r(i),i=0}));var a={};return a[e]=function(e,t){c(i,e),f.catch(t)},a}}var u={};return u[e]=function(e){o(e)},u[t]=f,u}))}(f);var a=function(){return u.map((function(e){if(e[n])throw e[n];return e[t]}))},s=new Promise((function(e,t){(i=function(){e(a)}).r=0,h(u,i,t)}));return i.r?s:a()}),(function(e){e&&d(y[n]=e),s()})),b=!1},f=[],m.O=function(e,t,n,r){if(!t){var o=1/0;for(u=0;u<f.length;u++){t=f[u][0],n=f[u][1],r=f[u][2];for(var c=!0,i=0;i<t.length;i++)(!1&r||o>=r)&&Object.keys(m.O).every((function(e){return m.O[e](t[i])}))?t.splice(i--,1):(c=!1,r<o&&(o=r));if(c){f.splice(u--,1);var a=n();void 0!==a&&(e=a)}}return e}r=r||0;for(var u=f.length;u>0&&f[u-1][2]>r;u--)f[u]=f[u-1];f[u]=[t,n,r]},m.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return m.d(t,{a:t}),t},a=Object.getPrototypeOf?function(e){return Object.getPrototypeOf(e)}:function(e){return e.__proto__},m.t=function(e,t){if(1&t&&(e=this(e)),8&t)return e;if("object"==typeof e&&e){if(4&t&&e.__esModule)return e;if(16&t&&"function"==typeof e.then)return e}var n=Object.create(null);m.r(n);var r={};i=i||[null,a({}),a([]),a(a)];for(var o=2&t&&e;"object"==typeof o&&!~i.indexOf(o);o=a(o))Object.getOwnPropertyNames(o).forEach((function(t){r[t]=function(){return e[t]}}));return r.default=function(){return e},m.d(n,r),n},m.d=function(e,t){for(var n in t)m.o(t,n)&&!m.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},m.f={},m.e=function(e){return Promise.all(Object.keys(m.f).reduce((function(t,n){return m.f[n](e,t),t}),[]))},m.u=function(e){return({25:"3c3646358c23db928ba512a9d9348303a7f263ba",29:"57352d49",98:"component---src-pages-opening-js",140:"d2dcc32e22db05f3b791707ecb9cf862d3c535f1",172:"component---src-pages-tutorial-js",212:"component---src-templates-profile-js",287:"component---src-templates-world-js",329:"component---src-pages-faq-js",334:"125b0409",406:"9962e03f55edf9ccd065a3f5c0adf343281b9ea8",443:"8148e57b6dc59bb85c608e4245e34cdcea2c45f2",532:"styles",641:"7827f2087ec2e1f64c1917dcb48ea7bf75f833fd",682:"component---src-pages-about-js",702:"b2e984c5",713:"component---src-pages-privacy-policy-js",883:"component---src-pages-404-js",922:"component---src-templates-crypter-js",956:"component---src-templates-explore-crypter-js",973:"3c6fe6bb"}[e]||e)+"-"+{25:"06f376304a2716ad0855",29:"9653277d5608d3ed40b9",98:"97872c97644320ecda73",140:"96ae8e9a05a942373f27",172:"f259db1207630ab9887e",212:"8880b48f01d8dda562de",287:"a94970f76d53fb0023d8",329:"0ba28d6a20d52a435eee",334:"fe038f2d58a1bae72410",406:"f380773a1e98e3f94eb0",443:"3ff5ea6db1d22f2893b0",532:"8ed58b22402bf6f00e43",641:"d2d1b570fbc7767a54de",682:"39fc6b3dd1ae2e0d36e0",702:"91a4fc17576ce3696ebf",713:"3be840ae182036fb7376",883:"37abb34b4c463a37b039",886:"4edd08cef94931761e6c",922:"0e6cb526bf515a73d366",939:"c49358ee677a389cfb01",956:"80c9e999355276d64b05",973:"af76d629566ea307871e"}[e]+".js"},m.miniCssF=function(e){return"styles.15d2e29bb357d8d744b7.css"},m.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),m.hmd=function(e){return(e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:function(){throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e},m.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u={},s="space-budz:",m.l=function(e,t,n,r){if(u[e])u[e].push(t);else{var o,c;if(void 0!==n)for(var f=document.getElementsByTagName("script"),i=0;i<f.length;i++){var a=f[i];if(a.getAttribute("src")==e||a.getAttribute("data-webpack")==s+n){o=a;break}}o||(c=!0,(o=document.createElement("script")).charset="utf-8",o.timeout=120,m.nc&&o.setAttribute("nonce",m.nc),o.setAttribute("data-webpack",s+n),o.src=e),u[e]=[t];var d=function(t,n){o.onerror=o.onload=null,clearTimeout(l);var r=u[e];if(delete u[e],o.parentNode&&o.parentNode.removeChild(o),r&&r.forEach((function(e){return e(n)})),t)return t(n)},l=setTimeout(d.bind(null,void 0,{type:"timeout",target:o}),12e4);o.onerror=d.bind(null,o.onerror),o.onload=d.bind(null,o.onload),c&&document.head.appendChild(o)}},m.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},m.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e},m.v=function(e,t,n,r){var o=fetch(m.p+""+n+".module.wasm");return"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(o,r).then((function(t){return Object.assign(e,t.instance.exports)})):o.then((function(e){return e.arrayBuffer()})).then((function(e){return WebAssembly.instantiate(e,r)})).then((function(t){return Object.assign(e,t.instance.exports)}))},m.p="/",d=function(e){return new Promise((function(t,n){var r=m.miniCssF(e),o=m.p+r;if(function(e,t){for(var n=document.getElementsByTagName("link"),r=0;r<n.length;r++){var o=(f=n[r]).getAttribute("data-href")||f.getAttribute("href");if("stylesheet"===f.rel&&(o===e||o===t))return f}var c=document.getElementsByTagName("style");for(r=0;r<c.length;r++){var f;if((o=(f=c[r]).getAttribute("data-href"))===e||o===t)return f}}(r,o))return t();!function(e,t,n,r){var o=document.createElement("link");o.rel="stylesheet",o.type="text/css",o.onerror=o.onload=function(c){if(o.onerror=o.onload=null,"load"===c.type)n();else{var f=c&&("load"===c.type?"missing":c.type),i=c&&c.target&&c.target.href||t,a=new Error("Loading CSS chunk "+e+" failed.\n("+i+")");a.code="CSS_CHUNK_LOAD_FAILED",a.type=f,a.request=i,o.parentNode.removeChild(o),r(a)}},o.href=t,document.head.appendChild(o)}(e,o,t,n)}))},l={658:0},m.f.miniCss=function(e,t){l[e]?t.push(l[e]):0!==l[e]&&{532:1}[e]&&t.push(l[e]=d(e).then((function(){l[e]=0}),(function(t){throw delete l[e],t})))},function(){var e={658:0,532:0};m.f.j=function(t,n){var r=m.o(e,t)?e[t]:void 0;if(0!==r)if(r)n.push(r[2]);else if(/^(532|658)$/.test(t))e[t]=0;else{var o=new Promise((function(n,o){r=e[t]=[n,o]}));n.push(r[2]=o);var c=m.p+m.u(t),f=new Error;m.l(c,(function(n){if(m.o(e,t)&&(0!==(r=e[t])&&(e[t]=void 0),r)){var o=n&&("load"===n.type?"missing":n.type),c=n&&n.target&&n.target.src;f.message="Loading chunk "+t+" failed.\n("+o+": "+c+")",f.name="ChunkLoadError",f.type=o,f.request=c,r[1](f)}}),"chunk-"+t,t)}},m.O.j=function(t){return 0===e[t]};var t=function(t,n){var r,o,c=n[0],f=n[1],i=n[2],a=0;if(c.some((function(t){return 0!==e[t]}))){for(r in f)m.o(f,r)&&(m.m[r]=f[r]);if(i)var u=i(m)}for(t&&t(n);a<c.length;a++)o=c[a],m.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return m.O(u)},n=self.webpackChunkspace_budz=self.webpackChunkspace_budz||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}()}();
//# sourceMappingURL=webpack-runtime-3d5a4b0d3e64f99d3624.js.map