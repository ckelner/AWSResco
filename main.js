function e(){H=[],N=[],clearInterval(V),V=null}function t(t,r){if(null!=t&&null!=r){d(),e();for(var s=0;s<B.length;s++)o(B[s],t,r,!1),o(B[s],t,r,!0);V=setInterval(n,1e3)}}function n(){H.length==B.length&&N.length==B.length&&(clearInterval(V),l(s(H,N)))}function r(e){for(var t=e.length,n=[],r=0;t>r;r++)Array.prototype.push.apply(n,e[r].data);return n}function s(e,t){e=r(e),t=r(t);for(var n=t.length,s=[],o=0,a={},i=0;n>i;i++){var u=t[i],c=u.type+u.az+u.windows+u.vpc;null==s[c]&&(a[c]=o,s[o]=u,o++);for(var l=0;n>l;l++){var d=t[l];u.type==d.type&&u.az==d.az&&u.windows==d.windows&&u.vpc==d.vpc&&i!=l&&(s[a[c]].count+=d.count,Array.prototype.push.apply(s[a[c]].resIds,d.resIds))}}for(var f=e.length,p=0;f>p;p++){for(var v=s.length,g=e[p],h=!1,y=0;v>y;y++){var m=s[y];if(null==s[y].running&&(s[y].running=0,s[y].running_ids=[],s[y].running_names=[],s[y].diff=0-s[y].count),g.type==m.type&&g.az==m.az&&g.windows==m.windows&&g.vpc==m.vpc){s[y].running+=1,s[y].diff=s[y].count-s[y].running,s[y].running_ids.push(g.id),void 0!=g.name&&null!=g.name&&""!=g.name&&s[y].running_names.push(g.name),h=!0;break}}if(h===!1){var w={};w.running=1,w.running_ids=[g.id],w.running_names=[],void 0!=g.name&&null!=g.name&&""!=g.name&&w.running_names.push(g.name),w.diff=-1,w.resIds=[],w.type=g.type,w.count=0,w.az=g.az,w.cost=0,w.windows=g.windows,w.vpc=g.vpc,s.push(w)}}return s}function o(e,t,n,r){var s=new AWS.EC2({accessKeyId:t,secretAccessKey:n,region:e,maxRetries:5,sslEnabled:!0});if(r){var o={Filters:[{Name:"state",Values:["active"]}]};s.describeReservedInstances(o,function(t,n){a(t,n,e,r)})}else{var o={Filters:[{Name:"instance-state-name",Values:["running"]}],MaxResults:1e3};s.describeInstances(o,function(t,n){a(t,n,e,r)})}}function a(e,t,n,r){e?(console.log(e,e.stack),f("<b><font color='red'>The following error has occured: "+e+"; see the javascript console for more details.</font></b>")):i(t,n,r)}function i(e,t,n){n?N.push({region:t,data:u(e)}):H.push({region:t,data:c(e)})}function u(e){var t=[];if(!e||!e.ReservedInstances||0==e.ReservedInstances.length)return t;for(var n=e.ReservedInstances.length,r=0;n>r;r++)t[r]={},t[r].resIds=[e.ReservedInstances[r].ReservedInstancesId],t[r].type=e.ReservedInstances[r].InstanceType,t[r].count=e.ReservedInstances[r].InstanceCount,t[r].az=e.ReservedInstances[r].AvailabilityZone,t[r].cost=e.ReservedInstances[r].RecurringCharges[0].Amount,-1!=e.ReservedInstances[r].ProductDescription.toLowerCase().indexOf("windows")?t[r].windows=!0:t[r].windows=!1,-1!=e.ReservedInstances[r].ProductDescription.toLowerCase().indexOf("vpc")?t[r].vpc=!0:t[r].vpc=!1;return t}function c(e){var t=[];if(!e||!e.Reservations||0==e.Reservations.length)return t;for(var n=e.Reservations.length,r=0;n>r;r++){var s=e.Reservations[r].Instances[0].Tags,o="";if(s.length>1)for(var a=s.length,i=0;a>i;i++)try{if(null!=s[i].Key)s[i].Key.toLowerCase()=="aws:autoscaling:groupName".toLowerCase()&&""==o&&(o=s[i].Value),"name"==s[i].Key.toLowerCase()&&(o=s[i].Value);else try{console.log("Tags["+i+"] empty: "+s.toString())}catch(e){console.log("Exception Id 00x1")}}catch(e){console.log("Exception Id 00x3")}else if(1==s.length)o=s[0].Value;else try{console.log("No name tag found for instance with id: "+e.Reservations[r].Instances[0].InstanceId)}catch(e){console.log("Exception Id 00x2")}t[r]={},t[r].name=o,t[r].id=e.Reservations[r].Instances[0].InstanceId,t[r].type=e.Reservations[r].Instances[0].InstanceType,t[r].az=e.Reservations[r].Instances[0].Placement.AvailabilityZone;try{void 0!=e.Reservations[r].Instances[0].Platform&&null!=e.Reservations[r].Instances[0].Platform&&"windows"==e.Reservations[r].Instances[0].Platform.toLowerCase()?t[r].windows=!0:t[r].windows=!1}catch(e){console.log("Exception Id 00x4")}null!=e.Reservations[r].Instances[0].VpcId&&""!=e.Reservations[r].Instances[0].VpcId?t[r].vpc=!0:t[r].vpc=!1}return t}function l(e){R().innerHTML="",R().innerHTML+=p(e),Sortable.init(),m(),T()}function d(){E(),R().innerHTML=""}function f(e){R().innerHTML=e}function p(e){for(var t="",n=e.length,r=0;n>r;r++)t+="<tr><th scope='row'>"+e[r].count+"</th><td>"+e[r].running+"</th><td>"+e[r].diff+"</th><td>"+e[r].type+"</td><td>"+e[r].az+"</td><td>"+e[r].windows.toString()+"</td><td>"+e[r].vpc.toString()+"</td><td>"+e[r].running_ids.join(",<br/>")+"</td><td>"+e[r].running_names.join(",<br/>")+"</td></tr>";return t}function v(){k=setInterval(g,1e3)}function g(){-1==h().innerHTML.toLowerCase().indexOf("please wait.....")?h().innerHTML+=".":h().innerHTML="Please Wait"}function h(){return document.getElementById("pleaseWait")}function y(){v(),h().style.display="block"}function m(){clearInterval(k),h().style.display="none"}function w(){return document.getElementById("errorAccessSecretKey")}function I(){m(),w().style.display="block"}function b(){w().style.display="none"}function R(){return document.getElementById("ec2DataTableBody")}function A(){return document.getElementById("awsQueryResults")}function T(){A().style.display="block"}function E(){A().style.display="none"}function C(){document.getElementById("awsQueryButton").addEventListener("click",function(){z()})}function x(e){return void 0==e||null==e||""==e?(I(),null):e}function L(){return x(document.getElementById("awsAccessKey").value)}function S(){return x(document.getElementById("awsSecretKey").value)}function z(){return y(),b(),t(L(),S()),!1}var B=["us-east-1","us-west-1","us-west-2","eu-west-1","eu-central-1","ap-southeast-1","ap-southeast-2","ap-northeast-1","sa-east-1"],H=[],N=[],V=null,k=null;window.onload=function(){C()},function(){var e,t,n,r,s,o,a;e="table[data-sortable]",r=/^-?[£$¤]?[\d,.]+%?$/,a=/^\s+|\s+$/g,n=["click"],o="ontouchstart"in document.documentElement,o&&n.push("touchstart"),t=function(e,t,n){return null!=e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)},s={init:function(t){var n,r,o,a,i;for(null==t&&(t={}),null==t.selector&&(t.selector=e),r=document.querySelectorAll(t.selector),i=[],o=0,a=r.length;a>o;o++)n=r[o],i.push(s.initTable(n));return i},initTable:function(e){var t,n,r,o,a,i;if(1===(null!=(i=e.tHead)?i.rows.length:void 0)&&"true"!==e.getAttribute("data-sortable-initialized")){for(e.setAttribute("data-sortable-initialized","true"),r=e.querySelectorAll("th"),t=o=0,a=r.length;a>o;t=++o)n=r[t],"false"!==n.getAttribute("data-sortable")&&s.setupClickableTH(e,n,t);return e}},setupClickableTH:function(e,r,o){var a,i,u,c,l,d;for(u=s.getColumnType(e,o),i=function(t){var n,a,i,c,l,d,f,p,v,g,h,y,m,w,I,b,R,A,T,E,C,x,L,S;if(t.handled===!0)return!1;for(t.handled=!0,f="true"===this.getAttribute("data-sorted"),p=this.getAttribute("data-sorted-direction"),i=f?"ascending"===p?"descending":"ascending":u.defaultSortDirection,g=this.parentNode.querySelectorAll("th"),m=0,R=g.length;R>m;m++)r=g[m],r.setAttribute("data-sorted","false"),r.removeAttribute("data-sorted-direction");if(this.setAttribute("data-sorted","true"),this.setAttribute("data-sorted-direction",i),v=e.tBodies[0],d=[],f){for(S=v.rows,b=0,E=S.length;E>b;b++)a=S[b],d.push(a);for(d.reverse(),x=0,C=d.length;C>x;x++)l=d[x],v.appendChild(l)}else{for(y=null!=u.compare?u.compare:function(e,t){return t-e},n=function(e,t){return e[0]===t[0]?e[2]-t[2]:u.reverse?y(t[0],e[0]):y(e[0],t[0])},L=v.rows,c=w=0,A=L.length;A>w;c=++w)l=L[c],h=s.getNodeValue(l.cells[o]),null!=u.comparator&&(h=u.comparator(h)),d.push([h,l,c]);for(d.sort(n),I=0,T=d.length;T>I;I++)l=d[I],v.appendChild(l[1])}return"function"==typeof window.CustomEvent&&"function"==typeof e.dispatchEvent?e.dispatchEvent(new CustomEvent("Sortable.sorted",{bubbles:!0})):void 0},d=[],c=0,l=n.length;l>c;c++)a=n[c],d.push(t(r,a,i));return d},getColumnType:function(e,t){var n,r,o,a,i,u,c,l,d,f,p;if(r=null!=(d=e.querySelectorAll("th")[t])?d.getAttribute("data-sortable-type"):void 0,null!=r)return s.typesObject[r];for(f=e.tBodies[0].rows,i=0,c=f.length;c>i;i++)for(n=f[i],o=s.getNodeValue(n.cells[t]),p=s.types,u=0,l=p.length;l>u;u++)if(a=p[u],a.match(o))return a;return s.typesObject.alpha},getNodeValue:function(e){var t;return e?(t=e.getAttribute("data-value"),null!==t?t:"undefined"!=typeof e.innerText?e.innerText.replace(a,""):e.textContent.replace(a,"")):""},setupTypes:function(e){var t,n,r,o;for(s.types=e,s.typesObject={},o=[],n=0,r=e.length;r>n;n++)t=e[n],o.push(s.typesObject[t.name]=t);return o}},s.setupTypes([{name:"numeric",defaultSortDirection:"descending",match:function(e){return e.match(r)},comparator:function(e){return parseFloat(e.replace(/[^0-9.-]/g,""),10)||0}},{name:"date",defaultSortDirection:"ascending",reverse:!0,match:function(e){return!isNaN(Date.parse(e))},comparator:function(e){return Date.parse(e)||0}},{name:"alpha",defaultSortDirection:"ascending",match:function(){return!0},compare:function(e,t){return e.localeCompare(t)}}]),setTimeout(s.init,0),"function"==typeof define&&define.amd?define(function(){return s}):"undefined"!=typeof exports?module.exports=s:window.Sortable=s}.call(this);