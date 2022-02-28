"use strict";(self.webpackChunkspace_budz=self.webpackChunkspace_budz||[]).push([[212],{22226:function(e,t){var r={PROJECT_ID:"mainnet3eI2HGY9oDPZkQveItihr5lIP94sWWtF"};t.Z=r},14101:function(e,t,r){r.r(t),r.d(t,{default:function(){return E}});var n=r(67294),a=r(35414),s=r(46953),i=r(28174),c=r(65865),l=r(75517),o=r(15861),u=r(87757),f=r.n(u),d=r(48083),m=(r(66795),r(22226)),p=r(89677);r(45476);function h(e){for(var t="",r=0;r<e.length&&"00"!==e.substr(r,2);r+=2)t+=String.fromCharCode(parseInt(e.substr(r,2),16));return t}var v=function(e){var t=[];if(t.push({unit:"lovelace",quantity:e.coin().to_str()}),e.multiasset())for(var r=e.multiasset().keys(),n=0;n<r.len();n++)for(var a=r.get(n),s=e.multiasset().get(a),i=s.keys(),c=0;c<i.len();c++){var l=i.get(c),o=s.get(l),u=Buffer.from(a.to_bytes(),"hex").toString("hex")+Buffer.from(l.name(),"hex").toString("hex");t.push({unit:u,quantity:o.to_str()})}return t},b=function(e){for(var t=[],r=e.filtered.length-1,a=0;a<=r;a++){var s=e.filtered[a];s&&s.id&&t.push(n.createElement(d.Z,{world:s,key:a}))}return t},_=function(e){var t=e.spacebudz,r=n.useState(""),a=r[0],s=r[1],i=n.useState({owned:[],bids:[],offers:[]}),u=i[0],d=i[1],_=n.useState(!0),E=_[0],w=_[1],g=(0,c.useStoreState)((function(e){return e.connection.connected})),k=n.useRef(!1),y=n.useRef(!0),N=function(){var e=(0,o.Z)(f().mark((function e(r){var n,a,s,i,c,l,o,u,b;return f().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(w(!0),d(null),n={owned:[],bids:[],offers:[]},!g){e.next=9;break}return e.next=6,window.cardano.selectedWallet.getUsedAddresses();case 6:e.t0=e.sent.map((function(e){return p.Z.Cardano.Address.from_bytes(Buffer.from(e,"hex")).to_bech32()})),e.next=10;break;case 9:e.t0=[];case 10:if(s=e.t0,i=function(e){return s.length>0&&s.some((function(t){return t===e}))},g!==r){e.next=25;break}return e.next=15,p.Z.load();case 15:return e.t1=p.Z.Cardano.Value,e.t2=Buffer,e.next=19,window.cardano.selectedWallet.getBalance();case 19:e.t3=e.sent,e.t4=e.t2.from.call(e.t2,e.t3,"hex"),c=e.t1.from_bytes.call(e.t1,e.t4),a=v(c),e.next=28;break;case 25:return e.next=27,fetch("https://cardano-mainnet.blockfrost.io/api/v0/addresses/"+r,{headers:{project_id:m.Z.PROJECT_ID}}).then((function(e){return e.json()})).then((function(e){return e.amount}));case 27:a=e.sent;case 28:return e.next=30,fetch("https://spacebudz.io/api/offers/",{headers:{project_id:m.Z.PROJECT_ID}}).then((function(e){return e.json()}));case 30:return l=e.sent,e.next=33,fetch("https://spacebudz.io/api/bids",{headers:{project_id:m.Z.PROJECT_ID}}).then((function(e){return e.json()}));case 33:o=e.sent,n.offers=l.offers.filter((function(e){return e.offer.owner==r||g===r&&i(e.offer.owner)})).map((function(e){var r=o.bids.find((function(t){return t.budId==e.budId}));return Object.assign({},t[e.budId],{listingPrice:e.offer.amount,bidPrice:r?r.bid.amount:void 0})})),n.bids=o.bids.filter((function(e){return e.bid.owner==r||g===r&&i(e.bid.owner)})).map((function(e){var r=l.offers.find((function(t){return t.budId==e.budId}));return Object.assign({},t[e.budId],{bidPrice:e.bid.amount,listingPrice:r?r.offer.amount:void 0})}));try{u=a.filter((function(e){return e.unit.startsWith("3c2cfd4f1ad33678039cfd0347cca8df363c710067d739624218abc0")})).map((function(e){return parseInt(h(e.unit.slice(56)).split("SpaceBud")[1])})),b=u.map((function(e){var r=o.bids.find((function(t){return t.budId==e}));return Object.assign({},t[e],{bidPrice:r?r.bid.amount:void 0})})),n.owned=b}catch(f){}d(n),w(!1);case 39:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),x=function(){var e=(0,o.Z)(f().mark((function e(){var t;return f().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t="undefined"!=typeof window&&new URL(window.location.href).searchParams.get("address"),s(t),N(t);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return n.useEffect((function(){var e=document.createElement("script");e.src="/js/app.js",document.body.appendChild(e)}),[]),n.useEffect((function(){k.current?g&&!y.current?window.history.pushState({},null,"/profile?address="+g):y.current=!1:k.current=!0,window.scrollTo(0,0),x()}),[g]),n.useEffect((function(){var e=window.location.href,t=setInterval((function(){var t=window.location.href;e!==t&&(e=t,x())}));return function(){return clearInterval(t)}}),[]),n.createElement(c.StoreProvider,{store:l.Z},n.createElement("div",{className:"outer__inner"},n.createElement("div",{className:"profile"},n.createElement("div",{className:"profile__head js-profile-head",style:{backgroundImage:"url('/img/content/bg-profile.jpg')"}},n.createElement("div",{className:"profile__center center"},n.createElement("div",{className:"profile__file"},n.createElement("input",{type:"file"}),n.createElement("div",{className:"profile__wrap"},n.createElement("svg",{className:"icon icon-upload-file"},n.createElement("use",{xlinkHref:"#icon-upload-file"})),n.createElement("div",{className:"profile__info"},"Drag and drop your photo here"),n.createElement("div",{className:"profile__text"},"or click to browse")),n.createElement("button",{className:"button-small profile__button js-profile-save"},"Save photo")))),n.createElement("div",{className:"profile__body"},n.createElement("div",{className:"profile__center center"},n.createElement("div",{className:"user"},n.createElement("div",{className:"user__avatar"},n.createElement("img",{src:"/img/icon-owner.png",alt:"Avatar"})),n.createElement("div",{className:"user__code"},n.createElement("div",{className:"user__number",onClick:function(){return window.open("https://cardanoscan.io/address/"+a)},style:{cursor:"pointer"}},a),n.createElement("button",{className:"user__copy"},n.createElement("svg",{className:"icon icon-copy"},n.createElement("use",{xlinkHref:"#icon-copy"}))))),n.createElement("div",{className:"profile__wrapper js-tabs"},n.createElement("div",{className:"profile__nav"},n.createElement("a",{className:"profile__link js-tabs-link active",href:"#"},"Open Bids (",E?"...":u.bids.length,")"),n.createElement("a",{className:"profile__link js-tabs-link",href:"#"},"Listed (",E?"...":u.offers.length,")"),n.createElement("a",{className:"profile__link js-tabs-link",href:"#"},"Owned (",E?"...":u.owned.length+u.offers.length,")")),n.createElement("div",{className:"profile__container"},n.createElement("div",{className:"profile__item js-tabs-item",style:{display:"block"}},n.createElement("div",{className:"profile__list"},E?n.createElement("img",{src:"/img/loader.gif",alt:"Loader"}):n.createElement(b,{filtered:u.bids}))),n.createElement("div",{className:"profile__item js-tabs-item"},n.createElement("div",{className:"profile__list"},E?n.createElement("img",{src:"/img/loader.gif",alt:"Loader"}):n.createElement(b,{filtered:u.offers}))),n.createElement("div",{className:"profile__item js-tabs-item"},n.createElement("div",{className:"profile__list"},E?n.createElement("img",{src:"/img/loader.gif",alt:"Loader"}):n.createElement(b,{filtered:u.owned}))))))))))},E=function(e){var t=e.pageContext.spacebudz;return n.createElement(c.StoreProvider,{store:l.Z},n.createElement(a.q,null,n.createElement("title",null,"Worlds Within Marketplace"),n.createElement("link",{rel:"preconnect",href:"https://fonts.gstatic.com"}),n.createElement("link",{href:"https://fonts.googleapis.com/css2?family=DM+Sans:wght@700&family=Poppins:wght@400;500;600;700&display=swap",rel:"stylesheet"}),n.createElement("link",{rel:"stylesheet",media:"all",href:"/css/app.min.css"}),n.createElement("link",{rel:"stylesheet",media:"all",href:"/css/overrides.css"}),n.createElement("script",null,"var viewportmeta = document.querySelector('meta[name=\"viewport\"]');\n\t\t\t  if (viewportmeta) {\n\t\t\t\tif (screen.width < 375) {\n\t\t\t\t  var newScale = screen.width / 375;\n\t\t\t\t  viewportmeta.content = 'width=375, minimum-scale=' + newScale + ', maximum-scale=1.0, user-scalable=no, initial-scale=' + newScale + '';\n\t\t\t\t} else {\n\t\t\t\t  viewportmeta.content = 'width=device-width, maximum-scale=1.0, initial-scale=1.0';\n\t\t\t\t}\n\t\t\t  }")),n.createElement(s.Z,null),n.createElement(_,{spacebudz:t}),n.createElement(i.Z,null))}}}]);
//# sourceMappingURL=component---src-templates-profile-js-f2e2491f0dbacba635ad.js.map