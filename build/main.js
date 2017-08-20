/*!create by yaopan 2017-08-20*/

(function(){var t=function(t,e){return function(){return t.apply(e,arguments)}},e=function(t,e){function o(){this.constructor=t}for(var a in e)n.call(e,a)&&(t[a]=e[a]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty,o=[].indexOf||function(t){for(var e=0,n=this.length;e<n;e++)if(e in this&&this[e]===t)return e;return-1};define(["jquery","underscore","backbone","doT","models/logoff","models/cancelbetting","models/appendlotterybetting","models/changepwd","models/getMemberInfoByNameNew","models/gethavesigninfo","models/acceptornocontract","models/getJsamount","models/getSubBondLstByPeriod","models/balance","models/gaveOutBonus","models/getUpBonus","models/membertalkSend","models/membertalkMessages","models/membertalkRead","models/membertalkContacts","models/membertalkOnline","models/betcontent","models/systemmessages","collections/getSubBondLstByPeriod","collections/membertalkContacts","text!../../templates/_footer.tpl","text!../../templates/_fixedToolbar.tpl","text!../../templates/_modal.tpl","text!../../templates/modal_gameInfo.tpl","text!../../templates/modal_trackInfo.tpl","text!../../templates/modal_trackInfo_tzList.tpl","text!../../templates/_404.tpl","text!../../templates/_timeout.tpl","text!../../templates/_pageLoading.tpl","text!../../templates/_contentLoading.tpl","text!../../templates/subsets/userCenter_security_alert.tpl","text!../../templates/getDayMoney.tpl","text!../../templates/subsets/userCenter_contract_alert.tpl","text!../../templates/modal_conversation.tpl","text!../../templates/demoAlert.tpl","text!../../templates/modal_sendMsg.tpl","qrcode","views/_navbar"],function(n,a,r,i,s,l,c,d,u,p,f,h,m,g,v,y,C,b,S,k,w,x,I,H,T,N,B,M,D,O,_,A,L,J,$,F,U,R,P,W,z){"use strict";var G,E;return G=function(a){function r(){return this.showTimeout=t(this.showTimeout,this),this.show404=t(this.show404,this),this.removeErrorPage=t(this.removeErrorPage,this),this.showLoading=t(this.showLoading,this),r.__super__.constructor.apply(this,arguments)}return e(r,a),r.prototype.tpls={modal:i.template(M),footer:i.template(N),modalGameInfo:i.template(D),modalTrackInfo:i.template(O),modalTzList:i.template(_),userCenterSecurityAlert:i.template(F),getDayMoney:i.template(U),contractAlert:i.template(R),mConversation:i.template(P),sendMsg:i.template(z),demoAlert:i.template(W)},r.prototype.events={'click .result [data-type="close"]':"eventCloseResult","click .toTop":"eventToTop","focus .paginate input":"eventFocusPaginate","keydown .paginate input":"eventKeydownPaginate","change .paginate input":"eventChangePaginate","click .filterInput":"eventClickFilterInput","keyup .filterInput input":"eventKeyupFilterInput","click a":"eventAFilter"},r.prototype.initialize=function(){return CSH.audios.winning=new CSH.utils.Audio("/audios/winning.mp3"),CSH.audios.gotMsg=new CSH.utils.Audio("/audios/gotMsg.mp3"),this.setIco(),this.data={},this.data.myId=+localStorage.getItem("userID"),this.cChatlist=new T,this.initWS(),this.render(),this.initWindowScroll(),this.getSalaryState(),CSH.$els.balance={},CSH.$els.balance.navbar=this.$el.find(".navbar .realTimeBalance"),this.refreshBalance()},r.prototype.setIco=function(){return CSH.$els.head.append('<link rel="shortcut icon" href="images/x-'+CSH.fix+'.ico?_=1" type="image/x-icon" />')},r.prototype.fetchMembertalkContactsAsync=function(t){return consol.log(1),null==t&&(t=!0),(new k).setUrl().save({},{async:t,dataFilter:function(t){return function(e){var n,o,a;if(0===(e=e.toJSON()).code)return t.data.hasFetchChatlist=!0,t.data.cleanChatList=e.data,n=+localStorage.getItem("parentId"),o=localStorage.getItem("parentName"),n&&(a={userID:n,userName:o},t.data.cleanChatList.unshift(a)),t.cChatlist.reset(t.data.cleanChatList)}}(this)})},r.prototype.initNotice=function(){var t;return!!(t=localStorage.getItem("notice"))&&(this.showImpMsg(t.toJSON()),localStorage.removeItem("notice"),!0)},r.prototype.render=function(){var t;return CSH.$els.footer.html(this.tpls.footer()),t=n(B),2==+localStorage.getItem("isNormalUser")&&2==+localStorage.getItem("userType")&&t.find(' a[target="service"]').css("display","none"),CSH.$els.body.append(t),this.els={},this.els.fixedToolbar=CSH.$els.fixedToolbar=this.$el.find("> .fixedToolbar"),this.els.toTop=this.els.fixedToolbar.find(".toTop"),setTimeout(function(t){return function(){return t.els.fixedToolbar.addClass("enabled")}}(this),200),setTimeout(function(t){return function(){if(+localStorage.getItem("demo"))return t.demoAlert();if(+localStorage.getItem("isInitPwd"))t.modifyInitPwd();else if(!t.initNotice())return t.settlementContract(),t.getContract(),t.appDownloadAlert()}}(this),200),this.generateQRCode()},r.prototype.getSalaryState=function(){var t;return t=localStorage.getItem("username"),(new u).setUrl(t).fetch({dataFilter:function(t){var e;return 0===(t=t.toJSON()).code&&(localStorage.setItem("salaryState",t.data.salaryState),e=t.data.salarylist,localStorage.setItem("salary",e.length?e[e.length-1].ratio:0)),"{}"}})},r.prototype.demoAlert=function(){return localStorage.removeItem("demo"),CSH.alert({content:this.tpls.demoAlert(),className:"demoAlert",ok:{text:"马上试玩",callback:function(t){return function(){return t.getContract()}}(this)}})},r.prototype.initWindowScroll=function(){var t,e,n;n=CSH.$els.window,CSH.$els.body,t=CSH.$els.menu,e=this.els.toTop,n.on("scroll",function(){var o;if(o=t.hasClass("fixed"),n.scrollTop()>130){if(o)return;return t.addClass("no-transition fixed"),e.addClass("enabled"),setTimeout(function(){return t.removeClass("no-transition")},200)}if(o)return t.addClass("no-transition").removeClass("fixed"),e.removeClass("enabled"),setTimeout(function(){return t.removeClass("no-transition")},200)})},r.prototype.getContract=function(){return(new p).setUrl().fetch({dataFilter:function(t){return function(e){var o,a,r,i,s,l;return(e=e.toJSON()).data?(r=new Date,a=new Date(e.data.add_Time).getTime()+6048e5,s=Math.floor((a-r)/1e3),l=Math.floor(s/86400)+"天"+Math.floor(s%86400/3600)+"时"+Math.floor(s%86400%3600/60)+"分",i=e.data.id,0==+e.data.state&&CSH.alert({title:" ",content:t.tpls.contractAlert({name:"getContract",time:l}),className:"getContract",ok:{text:"打开此契约",callback:function(){return o()}}}),4==+e.data.state&&CSH.alert({title:" ",content:t.tpls.contractAlert({name:"change",time:l}),className:"change",ok:{text:"打开此契约",callback:function(){return o()}}}),o=function(){var o,a,r;return r=CSH.alert({title:"契约分红",content:t.tpls.contractAlert({name:"getContractText"}),className:"getContractText publicRed",ok:{text:"我已阅读完毕，下一步（5）",callback:function(){var o,a,s;return r=CSH.confirm({title:"契约分红",content:t.tpls.contractAlert({data:e.data,name:"getDetailed"}),className:"getDetailed publicRed",cancel:{text:"拒绝签订",callback:function(){var o;return r=CSH.alert({title:"拒绝原因",content:t.tpls.contractAlert({name:"refuse"}),className:"refuse publicRed",ok:{text:"确定",autohide:!1,callback:function(t){var a,i;return(a=n(t.currentTarget)).attr("disabled",!1),i=[],o.checked.each(function(t,e){if((a=n(e)).prop("checked")){if(t===o.checked.length-1){if(!a.closest("label").find(" > input").val())return;return void i.push(a.closest("label").find(" > input").val())}return i.push(a.closest("label").text())}}),e.reject_Remark=i.toString(),e.state=2,s.setUrl().save(e,{dataFilter:function(t){return t=t.toJSON(),CSH.hint(t.message),r.modal("hide"),location.href=location.origin+"/userCenter.html#contract"}})}}}),o={},o.checked=r.find("button input")}},ok:{text:"同意签订",autohide:!1,callback:function(t){var o;return(o=n(t.currentTarget)).attr("disabled",!0),e.state=1,s.setUrl().save(e,{dataFilter:function(t){return t=t.toJSON(),CSH.hint({msg:t.message,type:"success",icon:"icon icon-ok",callback:function(){return r.modal("hide"),o.attr("disabled",!1),location.href=location.origin+"/userCenter.html#contract"}})}})}}}),o={},o.footer=r.find(".modal-footer"),o.ok=o.footer.find(".btn-primary"),o.$window=n(window),o.modalBody=r.find(".modal-body ul"),o.footer.prepend(o.ok),s=new f,e={},e.contractid=i,(a=function(){var t,e;if(e=.9*o.$window.height(),t=o.modalBody.height(),e-278<t||t<520)return e=e-278>520?520:e-278,o.modalBody.css({height:e,overflow:"auto"})})(),o.$window.on("resize",a)}}}),o={},o.btn=r.find(".modal-footer button"),o.btn.prop("disabled",!0),l=5,(a=function(){return setTimeout(function(){return 0==--l?(o.btn.prop("disabled",!1),void o.btn.text("我已阅读完毕，下一步")):(o.btn.text("我已阅读完毕，下一步（"+l+"）"),a())},1e3)})(),"{}"},"{}"):"{}"}}(this)})},r.prototype.settlementContract=function(){return(new h).setUrl().fetch({dataFilter:function(t){return function(e){var o,a,r,i,s,l;if(0!=+(e=e.toJSON()).code)return"{}";if(i=e.data.state,l=e.data.gaveOutBonusTotal>0,s=+e.data.totalBonus,o=!(5===i&&s),l||!o){switch(r=CSH.confirm({title:"契约分红",content:t.tpls.contractAlert({data:e.data,name:"settlementAlert"}),className:"settlementAlert publicRed",ok:{text:"发放分红",autohide:!1,callback:function(){}},cancel:{text:"未达标",callback:function(){}}}),a={},a.footer=r.find(".modal-footer"),a.btnOk=a.footer.find('button[btn-type="ok"]'),a.btnCancel=a.footer.find('button[btn-type="cancel"]'),a.footer.prepend(a.btnOk),i){case 1:a.btnCancel.addClass("btnGrey").text("上级未发放");break;case 2:a.btnCancel.addClass("btnGrey").text("已领取");break;case 3:a.btnCancel.addClass("btnGrey").text("未达标");break;case 4:a.btnCancel.addClass("btnGrey").text("未结算")}return l?a.btnOk.removeClass("btnGrey").addClass("btnOrange").on("click",function(o){var a,r,i;return(a=n(o.currentTarget)).attr("disabled",!0),i={},i.periodName=e.data.periodName,i.state=1,r=e.data.gaveOutBonusTotal,(new m).setUrl("99999/1").save(i,{dataFilter:function(e){var n;return e=e.toJSON(),n=(new H).reset(e),+(e=n.toJSON()).data.length?t.bounsList(e,i.periodName,r,a):CSH.hint("暂时没有用户达标"),a.attr("disabled",!1)}})}):a.btnOk.text("已发放").removeClass('btn-primary"').addClass("btnGrey").attr("disabled",!0),5===i&&s?a.btnCancel.addClass("btnRed").text("领取分红").on("click",function(t){return(new y).setUrl(e.data.periodName).fetch({dataFilter:function(t){if(0===(t=t.toJSON()).code)return CSH.hint({msg:"领取成功",type:"success",icon:"icon icon-ok"})}})}):void 0}}}(this)})},r.prototype.refreshBalance=function(t){var e,o,a;return o=CSH.pageName,a=+JSON.parse(localStorage.getItem("visibility-capital")),t&&(e=n(t.currentTarget),"index"!==o?e.find("i").addClass("icon-spin icon-fast"):(e.prop("disabled",!0),e.addClass("icon-spin icon-fast"))),(new g).setUrl().fetch({dataFilter:function(r){return function(i){var s,l,c,d,u,p,f,h;for(s=+i.toJSON().data,CSH.balance=s.accurate(4),localStorage.setItem("balance",s),u=s,p=CSH.utils.formatMoney(u),l=0,c=(h=r.$el.find(".navbar .realTimeBalance")).length;l<c;l++)f=h[l],d=(d=+(f=n(f)).attr("data-type")?p:u).accurate(4),f.attr("data-value",d).text(a?"***":d);if(CSH.$els.balance[o]&&("index"===o?r.indexRefreshBalance():(d=+CSH.$els.balance[o].attr("data-type")?p:u,CSH.$els.balance[o].text(a?"***":d).attr("data-value",d))),t)return"index"!==o?e.find("i").removeClass("icon-spin icon-fast"):e.removeClass("icon-spin icon-fast"),e.prop("disabled",!1)}}(this)})},r.prototype.indexRefreshBalance=function(t){var e,o,a,r,i,s,l,c,d,u,p,f,h,m,g,v,y,C,b,S,k,w;for(null==t&&(t=CSH.balance),y=(i=CSH.$els.balance.index.find(".box span")).filter(".round"),e=i.filter(".decimal"),k=(w=(""+t).split("."))[0].split(""),a=w[1]?w[1].split(""):"",l=+JSON.parse(localStorage.getItem("visibility-capital")),C=new Stack,c=0,p=k.length;c<p;c++)m=k[c],C.push(m);for(s=d=b=y.length-1;b<=0?d<=0:d>=0;s=b<=0?++d:--d)r=n(y[s]),null==(g=C.pop())&&(g=""),r.attr({"data-value":g}),r.html(l?"*":g);for(o=new Queue,u=0,f=a.length;u<f;u++)m=a[u],o.enqueue(m);for(S=[],v=0,h=e.length;v<h;v++)r=e[v],r=n(r),null==(g=o.dequeue())&&(g="0"),r.attr({"data-value":g}),S.push(r.html(l?"*":g));return S},r.prototype.refreshSafety=function(t){var e,n,o,a;return n=this.els.safetyBox.find(".safetyLevel"),e=this.els.safetyBox.find(".rangeBar .covered"),t<50?(a="低",o="safety-low"):50<=t&&t<=70?(a="中",o="safety-medium"):t>70&&(a="高",o="safety-high"),this.els.safetyBox.addClass(o),e.css({width:t+"%"}),n.text(a+"（"+t+"%）")},r.prototype.bounsList=function(t,e,o,a){var r,i;return i=CSH.alert({title:"契约分红",content:this.tpls.contractAlert({name:"payMoney",data:t.data}),className:"payMoney publicRed",ok:{text:"确定分红",autohide:!1,callback:function(){return t={},t.lstReciveUser=[],r.isTrue.each(function(e,o){var a;if((a=n(o)).prop("checked"))return t.lstReciveUser.push(a.closest("li").attr("data-name"))}),t.lstReciveUser.length?r.balance.text().replace(/[^\d.]/g,"")-r.result.text()<0?CSH.hint({msg:"金额不足",type:"error",icon:"icon icon-close"}):(t.periodName=e,(new v).setUrl().save(t,{dataFilter:function(t){return 0===(t=t.toJSON()).code?CSH.hint({msg:"发放成功",type:"success",icon:"icon icon-ok"}):CSH.hint({msg:t.message,type:"error",icon:"icon icon-close"})}})):CSH.hint({msg:"请选择用户",type:"error",icon:"icon icon-close"}),i.modal("hide")}}}),r={},r.allBtn=i.find(".title button"),r.lisBtn=i.find("ul.list li button"),r.isTrue=i.find("ul.list li button input"),r.result=i.find(".total .result"),r.balance=i.find(".total .balance"),(new g).setUrl().fetch({dataFilter:function(t){return t=t.toJSON(),r.balance.text("账户余额："+t.data)}}),r.allBtn.on("mousedown",function(t){var e,o;return(o=n(t.currentTarget)).find("input").prop("checked")?(r.lisBtn.removeClass("checked"),r.isTrue.prop("checked",!1),r.result.text(0)):(r.lisBtn.addClass("checked"),r.isTrue.prop("checked",!0),e=0,r.lisBtn.each(function(t,a){var r;return o=n(a),r=o.closest("li").attr("data-money"),e+=+r}),r.result.text(+e.toFixed(4)))}),i.delegate("ul.list li button","mousedown",function(t){var e,o,a,i,s;return o=n(t.currentTarget),i=o.closest("li"),a=o.find("input").prop("checked"),s=+i.attr("data-money"),e=+r.result.text(),s=a?e-s:e+s,r.result.text(+s.accurate(4))})},r.prototype.eventToTop=function(){return CSH.scrollToTop(200)},r.prototype.modifyInitPwd=function(){var t,e,o,a,r;return a=CSH.alert({title:"修改登录密码",content:this.tpls.userCenterSecurityAlert({name:"mvLogPass"}),className:"isCredentials modal-initpwdmodify",ok:{text:"确认修改",autohide:!1,callback:function(o){return function(r){var i,s,l,c,u,p,f,h;return c=n(r.currentTarget),f=t.filter('[data-type="origin"]'),u=t.filter('[data-type="pwd"]'),i=t.filter('[data-type="confirm"]'),h=f.val(),p=u.val(),s=i.val(),h.length<6?(o.adderrorClass(f),o.errorHint("请输入完整的登录密码",c)):p.length<6?(o.adderrorClass(u),o.errorHint("新密码必须大于6位数",c)):s.length<6?(o.adderrorClass(i),o.errorHint("再次输入完整的密码",c)):h===p?(o.adderrorClass(u),o.errorHint("新密码不能与原密码相同",c)):p!==s?(o.adderrorClass(u),o.errorHint("两次输入密码不一致",c)):(l={},n(".fade"),c.attr("disabled",!0),l.oldPwd=h.md5(),l.newPwd=p.md5(),l.safeLevel=e,(new d).setUrl().save(l,{dataFilter:function(t){return 0===(t=t.toJSON()).code?CSH.hint({msg:"密码设置成功",type:"success",icon:"icon icon-ok",callback:function(){return a.modal("hide"),location.href=location.origin+"/login.html"}}):CSH.hint({msg:t.message,icon:"error",icon:"icon icon-close",callback:function(){return c.attr("disabled",!1)}})}}))}}(this)}}),e=1,t=a.find("input"),o=a.find(".content .intensity"),r=location.origin+"/login.html",t.filter('[data-type="pwd"]').on("keyup",function(t){return function(n){return e=t.eventIntensity(n,o)}}(this)),a.on("keyup",function(t){if(27==+t.keyCode)return a.on("hidden",function(){return location.href=r})}),a.find(".close").on("click",function(){return a.on("hidden",function(){return location.href=r})})},r.prototype.eventIntensity=function(t,e){var o,a,r,i,s;return o=n(t.currentTarget),s=new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$","g"),i=new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$","g"),a=new RegExp("(?=.{6,}).*","g"),e.css("opacity",1),!1===a.test(o.val())?(r=1,e.text("弱").css({background:"#d74241",color:"rgba( 255, 255, 255, 1)"})):s.test(o.val())?(r=3,e.text("强").css({background:"#8fc31f",color:"rgba( 255, 255, 255, 1)"})):i.test(o.val())?(r=2,e.text("中").css({background:"#f19a38",color:"rgba( 255, 255, 255, 1)"})):(r=1,e.text("弱").css({background:"#d74241",color:"rgba( 255, 255, 255, 1)"})),r},r.prototype.errorHint=function(t,e){if(CSH.hint({msg:t,type:"error",icon:"icon icon-close"}),e)return e.attr("disabled",!1)},r.prototype.adderrorClass=function(t){return t.addClass("borderError").focus()},r.prototype.getDayMoney=function(){return(new ModelGetCheckAgentSalary).setUrl().fetch({dataFilter:function(t){return function(e){if(e=e.toJSON(),e.data,e.data)return 0===e.data.state?setTimeout(function(){return t.els.getDayMoney=n(t.tpls.getDayMoney(e.data.amount)),t.$el.append(t.els.getDayMoney),t.els.shade=t.els.getDayMoney.find(".shadow"),t.els.getMoney=t.els.getDayMoney.find(".getMoney"),t.startMove(t.els.getMoney.get(0),"-35",function(){var e,n,o,a;return t.els.getMoney.css({transition:"all 1s ease-out"}),e=null,o=!0,n=0,(a=function(){e=setInterval(function(){n=o?-35:-25,o=!o,t.els.getMoney.css({top:n})},1e3)})(),t.els.getMoney.css({top:-25}),window.onblur=function(){clearInterval(e)},window.onfocus=function(){return a()}})},2e3):void 0}}(this)})},r.prototype.startMove=function(t,e,n){var o,a;return o=0,a=t.offsetTop,clearInterval(t.timer),t.timer=setInterval(function(){return o+=(e-a)/5,o*=.7,Math.abs(o)<1&&Math.abs(e-a)<1?(clearInterval(t.timer),t.style.top=e+"px",n&&n()):(a+=o,t.style.top=a+"px")},30)},r.prototype.eventDropBottom=function(){return 200,this.els.getMoneyAlert=this.els.getDayMoney.find(".getMoneyAlert"),this.els.shade.show(),this.els.getMoneyAlert.show().animate({marginTop:0,opacity:1},200)},r.prototype.eventGetDayMoney=function(t){var e;return e=n(t.currentTarget),200,e.attr("disabled",!0),this.els.getMoneyAlert=this.els.getDayMoney.find(".getMoneyAlert"),(new ModelGetMyDaySalary).setUrl().fetch({dataFilter:function(t){return function(n){return 0===(n=n.toJSON()).code?CSH.hint({msg:n.message,type:"success",icon:"icon icon-ok",callback:function(){return t.els.shade.hide(),t.els.getMoneyAlert.animate({marginTop:-20,opacity:0},200,function(){return t.els.getMoneyAlert.hide(),clearInterval(t.getDayMoneyTimer),t.els.getMoney.css({top:-140}),setTimeout(function(){return t.els.getDayMoney.remove()},1e3)})}}):CSH.hint({msg:n.message,type:"error",icon:"icon icon-close",callback:function(){return e.attr("disabled",!1)}})}}(this)})},r.prototype.eventCloseResult=function(t){var e;return e=n(t.currentTarget),e.closest(".result").hide().remove()},r.prototype.eventFocusPaginate=function(t){return n(t.currentTarget).setCursorPosition(0)},r.prototype.eventKeydownPaginate=function(t){var e;if(e=t.keyCode,o.call([8,13,37,39].concat([48,49,50,51,52,53,54,55,56,57].concat([96,97,98,99,100,101,102,103,104,105])),e)<0)return!1},r.prototype.eventChangePaginate=function(t){var e,o,a;if(e=n(t.currentTarget),a=+e.val(),o=+e.attr("data-max"),!(a&&a<o))return e.val(o)},r.prototype.eventClickFilterInput=function(t){var e,o,a,r;return o=n(t.target),e=o.closest(".dropdown"),r=o.closest(".filterInput"),a=r.find("input"),e[0]?(o.addClass("selected").siblings(".selected").removeClass("selected"),a.attr({"data-value":o.attr("data-value")}).val(o.text()).trigger("fi.change"),r.removeClass("active")):(r.addClass("active"),CSH.$els.body.one("click",function(t){return function(){return t.__hideFilterInputDropdown(arguments[0],r)}}(this))),a.setSelection(0)},r.prototype.eventKeyupFilterInput=function(t){var e,o,a;a=(o=n(t.currentTarget)).val(),e=o.closest(".filterInput").find(".dropdown > span"),""===a.trim()&&(a=1,o.val(1).setCursorPosition(0)),o.attr({"data-value":a}).trigger("fi.change"),e.filter(".selected").removeClass("selected"),e.filter('[data-value="'+a+'"]').addClass("selected")},r.prototype.__hideFilterInputDropdown=function(t,e){if(!n(t.target).closest(".filterInput")[0])return e.removeClass("active")},r.prototype.showLoading=function(){CSH.$els.content.html(J)},r.prototype.removeErrorPage=function(){this.$("> .errortitle",CSH.$els.content).remove()},r.prototype.show404=function(){CSH.$els.content.removeClass(CSH.router.oldRoute).html(A)},r.prototype.showTimeout=function(){CSH.$els.content.removeClass(CSH.router.oldRoute).html(L)},r.prototype.logOff=function(){return(new s).setUrl().fetch({dataFilter:function(t){if(0===t.toJSON().code)return CSH.hint({msg:"登出成功",duration:1e3,callback:function(){return location.href=location.origin+"/login.html"}})}})},r.prototype.showGameInfo=function(t){var e,o,a,r;return(e=n(this.tpls.modalGameInfo(t.pageData)).appendTo("body")).on("hidden",function(){return e.remove()}).on("click",".cancelOrder",function(n){return function(){var o;return o=e.attr("data-id"),(new l).setUrl().save({orders:o},{dataFilter:function(o){switch(o.toJSON().code){case 0:CSH.hint({msg:"撤单成功",duration:500,type:"success",callback:function(){return e.modal("hide"),t.callback.apply(e,arguments),n.refreshBalance()}});break;case 5:case 1:CSH.hint({msg:"操作失败，请重试",duration:1500,type:"error"});break;case 4:CSH.hint({msg:"本期已经封盘,不能撤单",duration:2e3});break;case 2:CSH.hint({msg:"合买不能撤单",duration:1500});break;case 3:CSH.hint({msg:"已经撤单",duration:1500});break;default:CSH.hint({msg:o.toJSON().message,duration:1500})}}})}}(this)),a=t.pageData.code,r=e.find("#myLottNum"),o=function(e){var n,o,a,i,s;return s="",(n=t.pageData.dypointdec)&&(s+="<p>"+n.split("").join(" ")+"</p>"),o=1==(i=+CSH.gType)||2===i||5===i,a=/单式/.test(t.pageData.methodname),s+='<div class="inner">',s+=e.replace(/\||&/g,function(t){switch(t){case"|":return"<i></i>";case"&":return a?" ":o?"":" "}}),s+="</div>",r.html(s)},a?(e.modal("show"),void o(a)):((new x).setUrl(t.pageData.projectid).fetch({dataFilter:function(t){return(t=t.toJSON()).code?(console.log(t.message),void r.html('<div class="no_lott_num_tip">'+t.message+"</div>")):o(t.data)}}),e.modal("show"))},r.prototype.showTrackInfo=function(t){var e,o,a,r,s,d,u,p,f,h;d=void 0,r=[],h=void 0,e=n(this.tpls.modalTrackInfo(t)).appendTo("body"),a=e.find("button.cancelOrder"),o=e.find(".right_tzbox"),f=null,e.on("hidden",function(){e.remove()}),e.on("mouseenter",".nums_detail, #num",function(){clearTimeout(f),e.find("#num").stop(!0).slideDown("fast")}),e.on("mouseleave",".nums_detail, #num",function(){f=setTimeout(function(){return e.find("#num").stop(!0).slideUp("fast")},20)}),e.modal("show"),s=function(e){return function(){return o.off().empty().html(i.template($)),(new c).setUrl(t.trackInfo.id).fetch({dataFilter:function(t){var a;t=t.toJSON(),d=t.data,a=d[0],setTimeout(function(){return u(a.methodname,a.code,a.lotteryid)},0),o.html(e.tpls.modalTzList(d)),0===(h=n(".tbody button.checkbox").length-n(".tbody button.checkbox:disabled").length)&&(o.find("span.t1").detach(),o.height(360).css({"border-bottom":0}),o.find(".tbody").height(330))}})}}(this),p=function(){return a.prop("disabled",!r.length)},s(),e.on("click",".gameInfoBtn",function(t){return function(e){var o;o=n(e.currentTarget).attr("data-index"),t.showGameInfo({pageData:d[o],callback:s})}}(this)),e.on("change",".tbody input[type=checkbox]",function(t){var e,n;e=o.find(".thead button.checkbox"),n=function(){return r.length===h},this.checked?(r.push(this.value),n()?(e.addClass("checked"),e.children().prop("checked",!0)):(e.removeClass("checked"),e.children().prop("checked",!1))):(r.remove(this.value),e.removeClass("checked"),e.children().prop("checked",!1)),p()}),e.on("change",".thead input[type=checkbox]",function(t){var e,a,i;i=o.find(".tbody button.checkbox:not(:disabled)"),a=function(){return i.each(function(t,e){var o;(o=n(e)).addClass("checked"),o.children().prop("checked",!0),r.push(o.children().val())})},e=function(){return i.each(function(t,e){var o;(o=n(e)).removeClass("checked"),o.children().prop("checked",!1),r=[]})},this.checked?a():e(),p()}),e.on("click",".cancelOrder",function(n){return function(o){(new l).setUrl().save({orders:r.join("|")},{dataFilter:function(o){switch(o.toJSON().code){case 0:CSH.hint({msg:"撤单成功",duration:500,type:"success",callback:function(){var o;return e.modal("hide"),null!=(o=t.callback)&&o.apply(e,arguments),n.refreshBalance()}});break;case 5:case 1:CSH.hint({msg:"操作失败，请重试",duration:1500,type:"error"});break;case 4:CSH.hint({msg:"本期已经封盘,不能撤单",duration:2e3});break;case 2:CSH.hint({msg:"合买不能撤单",duration:1500});break;case 3:CSH.hint({msg:"已经撤单",duration:1500});break;default:CSH.hint({msg:o.toJSON().message,duration:1500})}}})}}(this)),u=function(t,n,o){var a;n=3===(a=+o.toString().charAt(0))||4===a?n.replace(/&/g," "):n.replace(/&/g,""),e.find("#methodName").html(t),e.find("#num span#numSpan").html(n)}},r.prototype.sendMsg=function(t,e,n,o,a){var r;return r=CSH.hint({icon:"loading",msg:"发送中...",duration:1/0}),(new C).setUrl().save({sendTo:t,message:n},{dataFilter:function(t){return function(i){return r.animate({marginTop:"-32px",opacity:0},1,function(){return r.remove()}),0===(i=i.toJSON()).code?(CSH.ws.send(JSON.stringify({model:3,msgType:4,target:{targetUserName:e},msg:JSON.stringify({fromId:t.data.myId,fromName:localStorage.getItem("username"),dictTalkId:i.data,msg:n})})),"function"==typeof o?o():void 0):(CSH.hint("发送失败"),"function"==typeof a?a():void 0)}}(this)})},r.prototype.showSendMsgPanel=function(t){var e,o,a,r,i,s,l,c,d;o={},(e={}).pId=+localStorage.getItem("parentId"),e.sendIds=[],e.sendNames=[],this.cChatlist.reset(this.data.cleanChatList),s=n(this.tpls.modal({className:"modal-sendMsg modal-large",title:"发消息",content:this.tpls.sendMsg()})).on("hidden",function(e){return function(){var n;return s.off().remove(),e.freshPageMsg(),null!=t&&null!=(n=t.callback)?n.apply(s,arguments):void 0}}(this)).appendTo(CSH.$els.body).modal("show"),o.chatListBox=s.find(".chatList"),o.addrSelect=s.find(".addr select"),o.allCheckBox=s.find(".allSelect button.checkbox"),o.sendBtn=s.find(".action button"),o.sendConArea=s.find(".content textarea"),o.addrRenshu=s.find(".renshu"),c=function(t){return function(){return 0===o.chatListBox.find("button:not(.checked)").length&&0!==t.data.cleanChatList.length?(o.allCheckBox.addClass("checked"),o.allCheckBox.children().prop("checked",!0)):(o.allCheckBox.removeClass("checked"),o.allCheckBox.children().prop("checked",!1))}}(this),r=function(t){var n,a,r,i;for(i="",a=0,r=t.length;a<r;a++)i+="<div"+((n=t[a]).userID===e.pId?' class="text-red"':"")+'>\n\t<button class="checkbox icon'+(n.checked?" checked":"")+'">\n\t\t<input type="checkbox" value="'+n.userID+'"'+(n.checked?' checked="checked"':"")+"></input>\n\t</button>"+(n.userID===e.pId?"上级":n.userName)+(2===n.userType?"代理":"")+"\n</div>";return o.chatListBox.html(i),c()},i=function(t){return function(){var n,a,r,i,s;for(n="",r=0,i=(s=t.data.cleanChatList).length;r<i;r++)n+='<option value="'+(a=s[r]).userID+'">'+(a.userID===e.pId?"上级":a.userName)+"</option>";return o.addrSelect.html(n),o.addrSelect.select2({placeholder:"请添加您的收件人"})}}(this),o.sendBtn.prop("disabled",!e.sendIds.length),o.allCheckBox.prop("disabled",!0),o.addrSelect.select2({placeholder:"请添加您的收件人"}),this.fetchMembertalkContactsAsync(!1),r(this.data.cleanChatList),i(),o.allCheckBox.prop("disabled",!1),d=function(){return o.sendBtn.prop("disabled",!e.sendIds.length)},a=function(t){return function(n){return e.sendIds.push(n),e.sendNames.push(t.cChatlist.findWhere({userID:n}).get("userName"))}}(this),l=function(t){return function(n){return e.sendIds.remove(n),e.sendNames.remove(t.cChatlist.findWhere({userID:n}).get("userName"))}}(this),s.on("change",".chatList input[type=checkbox]",function(t){return function(n){var r,i,s;if(r=n.currentTarget,i=+r.value,r.checked){if(e.sendIds.has(i))return;a(i)}else{if(!e.sendIds.has(i))return;l(i)}return o.addrSelect.val(e.sendIds).trigger("change"),t.cChatlist.findWhere({userID:i}).set("checked",r.checked),d(),setTimeout(function(){return c()},0),(s=e.sendIds.length)>0?o.addrRenshu.html("（"+s+"/人）"):o.addrRenshu.html("")}}(this)),s.on("change",".allSelect input[type=checkbox]",function(t){var e,a,r;e=t.currentTarget,a=o.chatListBox.find("button.checked"),r=o.chatListBox.find("button:not(.checked)"),(e.checked?r:a).each(function(t,e){return n(e).children().click()})}),s.on("select2:select",".addr select",function(t){return function(e){var n,r;return n=+e.params.data.id,(r=o.chatListBox.find('input[value="'+n+'"]')).length>0?r.click():(t.cChatlist.findWhere({userID:n}).set("checked",!0),a(n))}}(this)),s.on("select2:unselect",".addr select",function(t){return function(e){var n,a;return n=+e.params.data.id,(a=o.chatListBox.find('input[value="'+n+'"]')).length>0?a.click():(t.cChatlist.findWhere({userID:n}).set("checked",!1),l(n))}}(this)),s.on("keyup",".search input",function(t){return function(e){var n,o,a;return n=e.currentTarget,a=n.value,o=t.cChatlist.filter(function(t){if(-1!==t.get("userName").indexOf(a))return t}),o=new T(o).toJSON(),r(o)}}(this)),s.on("click",".action button",function(t){return function(n){var a,r,i;return a=e.sendIds.join(","),i=e.sendNames.join(","),(r=o.sendConArea.val())?a.length?(o.sendBtn.prop("disabled",!0),t.sendMsg(a,i,r,function(){return s.modal("hide"),e.sendIds=[],e.sendNames=[]},function(){return o.sendBtn.prop("disabled",!1)})):CSH.hint("请输入联系人"):CSH.hint("请输入内容")}}(this)),s.on("keydown",".content textarea",function(t){var e;if(91!==(e=t.keyCode)&&93!==e&&17!==e||(CSH.cmdKey=1),13===t.keyCode)return!1}),s.on("keyup",".content textarea",function(t){var e,a;if(e=n(t.currentTarget),91!==(a=t.keyCode)&&93!==a&&17!==a||(CSH.cmdKey=0),13===t.keyCode)return CSH.cmdKey?e.val(e.val()+"\n"):o.sendBtn.click()})},r.prototype.showConversation=function(t,e){var o,a;return console.log(e),o=0==+e?new b:new I,a=CSH.hint({icon:"loading",msg:"加载中...",duration:1/0}),o.setUrl().save({userId:t,pageIndex:1,pageSize:10,messageId:0},{dataFilter:function(o){return function(r){var i,s,l,c,d,u,p,f,h;if(a.animate({marginTop:"-32px",opacity:0},1,function(){return a.remove()}),h=!0,r=r.toJSON().data,l=!1,r.userInfos||(l=!0,r.userInfos=[],r.userInfos[0]=o.cChatlist.findWhere({userID:t}).toJSON(),r.messages=[]),f=r.userInfos[0],d=n(o.tpls.mConversation({type:e,data:r})).appendTo(CSH.$els.body),u=d.find("#online"),i=d.find(".modal-body"),c=d.find(".main"),p=d.find(".modal-footer .sendBtn"),(new w).setUrl(t).fetch({dataFilter:function(t){return(t=t.toJSON()).data?u.removeClass().addClass("onLine"):u.removeClass().addClass("offLine")}}),s=function(){return i.scrollTop(c.outerHeight()-i.height()+30)},d.on("hidden",function(){return d.off().remove(),o.freshPageMsg()}).on("click",".modal-footer .sendBtn",function(t){var e,a,r;return e=n(t.currentTarget),a=e.prev(),(r=a.val())?(p.prop("disabled",!0),o.sendMsg(f.userID,f.userName,r,function(){var t;return a.val(""),t='<div class="msgLi right">\n\t<div class="tit">\n\t\t<span class="name">我</span>\n\t\t<span class="ext">'+(new Date).getFormatDateAndTime().replace(/^\d{4}-/,"").replace(/-/,"月").replace(/\ /,"日 ")+'</span>\n\t</div>\n\t<div class="info"><pre>'+r+"</pre></div>\n</div>",c.append(t),s(),p.prop("disabled",!1)},function(){return p.prop("disabled",!1)})):CSH.hint("请输入内容")}).on("keydown",".modal-footer textarea",function(t){var e;if(91!==(e=t.keyCode)&&93!==e&&17!==e||(CSH.cmdKey=1),13===t.keyCode)return!1}).on("keyup",".modal-footer textarea",function(t){var e,o;if(e=n(t.currentTarget),91!==(o=t.keyCode)&&93!==o&&17!==o||(CSH.cmdKey=0),13===t.keyCode)return CSH.cmdKey?e.val(e.val()+"\n"):p.click()}),i.on("scroll",function(e){var a,r,s;if(0===i.scrollTop()&&h)return s='<div class="tip"><span class="icon icon-loading icon-spin"></span>加载中...</div>',c.prepend(s),a=n(c.find(".msgLi")[0]),r=a.attr("data-msgId"),(new b).setUrl().save({userId:t,pageIndex:1,pageSize:10,messageId:+r},{dataFilter:function(t){var e,n,r,l;if(0===(t=t.toJSON()).code){for(l=t.data.messages.reverse(),s="",l.length<10&&(s+='<div class="tip">—— 无更多消息 ——</div>',h=!1),n=0,r=l.length;n<r;n++)e=l[n],s+='<div class="msgLi'+(+e.sender===o.data.myId?" right":" left")+'" data-msgId="'+e.id+'">\n\t<div class="tit">\n\t\t<span class="name">'+(+e.sender===o.data.myId?"我":+e.sender==+localStorage.getItem("parentId")?"上级":t.data.userInfos[0].userName)+'</span>\n\t\t<span class="ext">'+e.createOn.replace(/^\d{4}\//,"").replace(/\//,"月").replace(/\ /,"日 ")+'</span>\n\t</div>\n\t<div class="info">\n\t\t<pre>'+e.message+"</pre>\n\t</div>\n</div>";return c.find(".tip").replaceWith(s),i.scrollTop(a.position().top)}}})}),s(),d.modal("show"),!l)return o.reportReaded(r.talkID)}}(this)})},r.prototype.reportReaded=function(t,e){return(new S).setUrl().save({talkIds:t},{dataFilter:function(t){return"function"==typeof e?e():void 0}})},r.prototype.eventAFilter=function(t){var e,o;if(e=n(t.currentTarget),o=e.attr("href"))return"#xxx"===o?(CSH.hint("正在开发中，敬请期待..."),t.preventDefault()):void 0},r.prototype.generateQRCode=function(){var t;return t=CSH.$els.footer.find(".qrCodeBox div"),setTimeout(function(){var e;return e=t.filter('[data-type="android"]'),t.filter('[data-type="ios"]'),e.qrcode({text:location.origin+"/download.html",render:"div",ecLevel:"H",size:150,minVersion:8,background:"#fff"})},250)},r.prototype.initWS=function(){return new E(this)},r.prototype.showImpMsg=function(t){var e,o,a,r;return a=CSH.alert({title:"推送公告",className:"modal-notice modal-large",content:"<h3>"+t.title+"</h3>"+t.content.decodeHTML(),ok:{text:"我知道了",callback:function(t){return function(){return t.getContract(),t.settlementContract()}}(this)}}),o={},o.$window=n(window),o.modalBody=a.find(".modal-body"),e=0,r=function(){var t,n;if(n=.9*o.$window.height()-154,t=o.modalBody.height(),n<t||e>t)return o.modalBody.css({height:n})},setTimeout(function(){if(e=o.modalBody.height(),o.modalBody.height()>.9*o.$window.height()-154)return r(),o.$window.on("resize",r)},1e3),a.find('button[btn-type="ok"]').removeClass("btn-primary")},r.prototype.freshPageMsg=function(){var t,e;return CSH.views.navbar.initTopMessageBox(),null!=(t=CSH.$els.content.find(".rightBox .content.message"))&&null!=(e=t.find(".tabTitle ul li[data-type=normal].active"))?e.trigger("click"):void 0},r.prototype.soundAlert=function(){var t,e;if(!localStorage.getItem("alertedSound")&&!CSH.alertingSound)return CSH.alertingSound=1,e=n('<div class="promptWrap">\n\t<div class="promptBox promptAudio">\n\t\t<em class="arrow"></em>\n\t\t<i class="icon-wrong close2"></i>\n\t\t<div class="picTxt">\n\t\t\t<span class="audioImg"></span>\n\t\t\t<div class="txtBox">\n\t\t\t\t<h3>声音开关键</h3>\n\t\t\t\t<p>不错过每个开奖机会</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>'),t=e.find("> .promptBox"),e.appendTo(CSH.$els.navbar.find("> .inner")),setTimeout(function(){return t.css({opacity:1,visibility:"visible"}).on("click",".close2",function(){return t.css({opacity:0,visibility:"hidden"}),setTimeout(function(){return e.remove()},200),localStorage.setItem("alertedSound",1),delete CSH.alertingSound})},1600)},r.prototype.appDownloadAlert=function(){var t,e;if(!localStorage.getItem("alertedAppDownload")&&!CSH.alertingAppDownload)return CSH.alertingAppDownload=1,e=n('<div class="promptWrap">\n\t<div class="promptBox promptDownload">\n\t\t<em class="arrow"></em>\n\t\t<i class="icon-wrong close1"></i>\n\t\t<div class="picTxt">\n\t\t\t<span class="mobileImg"></span>\n\t\t\t<div class="txtBox">\n\t\t\t\t<h3>手机端下载</h3>\n\t\t\t\t<p>随时随地玩游戏</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>'),t=e.find("> .promptBox"),e.appendTo(CSH.$els.navbar.find("> .inner")),setTimeout(function(){return t.css({opacity:1,visibility:"visible"}).on("click",".close1",function(){return t.css({opacity:0,visibility:"hidden"}),setTimeout(function(){return e.remove()},200),localStorage.setItem("alertedAppDownload",1),delete CSH.alertingSound})},1600)},r}(r.View),E=function(){function e(e){this.view=e,this.gotMsg=t(this.gotMsg,this),this._close=t(this._close,this),this._message=t(this._message,this),this.abortedCount=0,this._reset()}return e.prototype._reset=function(){var t;if(!(this.abortedCount++>5))return CSH.ws=this.ws=t=new WebSocket(CSH.path.ws),t.addEventListener("message",this._message),t.addEventListener("error",this._error),t.addEventListener("close",this._close),t},e.prototype._message=function(t){var e,n;if(e=t.data,n=this.ws,"Connect successful!"===e)return n.send(JSON.stringify({model:1,msgType:1,target:{targetUserName:localStorage.getItem("username"),targetCategory:+localStorage.getItem("userType"),stargetID:localStorage.getItem("stargetID")}})),void setInterval(function(){return n.send("{}")},3e4);switch((e=e.toJSON()).msgType){case 3:return this.showWinningMsg(e.msg.toJSON()),this.refreshLotteryRecords();case 4:return this.gotMsg(e);case 5:return this.view.showImpMsg(e.msg.toJSON());case 6:return this.refreshLotteryRecords()}},e.prototype._error=function(){return console.error("ws",arguments)},e.prototype._close=function(){return this._reset(),console.warn("ws",arguments)},e.prototype.showWinningMsg=function(t){var e;switch(e=CSH.gameMap[t.gameID].text,CSH.audios.winning.play(),CSH.notice({content:'<span class="icon"></span>\n<p>恭喜中奖！您所购买的 '+e+' 中奖金额：<span class="text-red">'+t.amount+"</span>元</p>",className:"notice-vj",duration:5e3}),CSH.pageName){case"index":case"lottery":return n(".balanceBox .refreshBalance").trigger("click");case"userCenter":return n(".rightBox .moneyBottom .refresh").trigger("click")}},e.prototype.refreshLotteryRecords=function(){var t;if((t=CSH.$els.content).hasClass("lottery"))return t.find(".listBox2 button.refresh").click()},e.prototype.gotMsg=function(t){var e,o,a,r,i,s,l,c;return CSH.audios.gotMsg.play(),console.log("站内信",t),c=t.msg.toJSON(),a=c.fromId,r=+localStorage.getItem("parentId")==+a?"上级":c.fromName,o=c.dictTalkId,l=decodeURIComponent(c.msg),(i=n(".modal.modal-conversation[data-id="+a+"]")).length>0?(e=i.find,e=i.find(".modal-body"),s=i.find(".main"),c='<div class="msgLi left">\n\t<div class="tit">\n\t\t<span class="name">'+r+'</span>\n\t\t<span class="ext">'+(new Date).getFormatDateAndTime().replace(/^\d{4}-/,"").replace(/-/,"月").replace(/\ /,"日 ")+'</span>\n\t</div>\n\t<div class="info"><pre>'+l+"</pre></div>\n</div>",s.append(c),e.scrollTop(s.outerHeight()-e.height()+30),void this.view.reportReaded(o[this.view.data.myId])):this.view.freshPageMsg()},e}(),G})}).call(this);