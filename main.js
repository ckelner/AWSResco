function e(){O=[],M=[],clearInterval(_),_=null}function n(n,s,r){if(null!=n&&null!=s){if(P=r,f(),e(),-1!=r.indexOf(K))for(var a=0;a<k.length;a++)o(k[a],n,s,!1),o(k[a],n,s,!0);else o(P,n,s,!1),o(P,n,s,!0);_=setInterval(t,1e3)}}function t(){-1!=P.indexOf(K)?O.length==k.length&&M.length==k.length&&(clearInterval(_),l(r(O,M))):O.length>0&&M.length>0&&(clearInterval(_),l(r(O,M)))}function s(e){for(var n=e.length,t=[],s=0;n>s;s++)Array.prototype.push.apply(t,e[s].data);return t}function r(e,n){for(var t=s(e),r=s(n),o=r.length,a=[],i=0,c={},u=[],l=0;o>l;l++){var d=JSON.parse(JSON.stringify(r[l])),f=d.type+d.az+d.windows+d.vpc;if(!u.contains(f)){void 0===c[f]&&(c[f]=i,u.push(f),a[i]=JSON.parse(JSON.stringify(d)),i++);for(var v=l+1;o>v;v++){var p=JSON.parse(JSON.stringify(r[v]));d.type===p.type&&d.az===p.az&&d.windows===p.windows&&d.vpc===p.vpc&&l!==v&&p!==d&&(a[c[f]].count+=p.count,Array.prototype.push.apply(a[c[f]].resIds,p.resIds))}}}for(var g=t.length,h=0;g>h;h++){for(var w=a.length,m=t[h],y=!1,I=0;w>I;I++){null==a[I].running&&(a[I].running=0,a[I].running_ids=[],a[I].running_names=[],a[I].diff=a[I].count);var b=a[I];if(m.type==b.type&&m.az==b.az&&m.windows==b.windows&&m.vpc==b.vpc){a[I].running+=1,a[I].diff-=1,a[I].running_ids.push(m.id),void 0!=m.name&&null!=m.name&&""!=m.name&&a[I].running_names.push(m.name),y=!0;break}}if(y===!1){var L={};L.running=1,L.running_ids=[m.id],L.running_names=[],void 0!=m.name&&null!=m.name&&""!=m.name&&L.running_names.push(m.name),L.diff=-1,L.resIds=[],L.type=m.type,L.count=0,L.az=m.az,L.cost=0,L.windows=m.windows,L.vpc=m.vpc,a.push(L)}}return a}function o(e,n,t,s){var r=new AWS.EC2({accessKeyId:n,secretAccessKey:t,region:e,maxRetries:5,sslEnabled:!0});if(s){var o={Filters:[{Name:"state",Values:["active"]}]};r.describeReservedInstances(o,function(n,t){a(n,t,e,s)})}else{var o={Filters:[{Name:"instance-state-name",Values:["running"]}],MaxResults:1e3};r.describeInstances(o,function(n,t){a(n,t,e,s)})}}function a(e,n,t,s){e?(console.log(e,e.stack),v("<b><font color='red'>The following error has occured: "+e+"; see the javascript console for more details.</font></b>")):i(n,t,s)}function i(e,n,t){t?M.push({region:n,data:c(e)}):O.push({region:n,data:u(e)})}function c(e){var n=[];if(!e||!e.ReservedInstances||0==e.ReservedInstances.length)return n;for(var t=e.ReservedInstances.length,s=0;t>s;s++)n[s]={},n[s].resIds=[e.ReservedInstances[s].ReservedInstancesId],n[s].type=e.ReservedInstances[s].InstanceType,n[s].count=e.ReservedInstances[s].InstanceCount,n[s].az=e.ReservedInstances[s].AvailabilityZone,e.ReservedInstances[s].RecurringCharges[0]&&(n[s].cost=e.ReservedInstances[s].RecurringCharges[0].Amount),-1!=e.ReservedInstances[s].ProductDescription.toLowerCase().indexOf("windows")?n[s].windows=!0:n[s].windows=!1,-1!=e.ReservedInstances[s].ProductDescription.toLowerCase().indexOf("vpc")?n[s].vpc=!0:n[s].vpc=!1;return n}function u(e){var n=[];if(!e||!e.Reservations||0==e.Reservations.length)return n;for(var t=e.Reservations.length,s=0,r=0;t>r;r++)for(var o=0;o<e.Reservations[r].Instances.length;o++){var a=e.Reservations[r].Instances[o].Tags,i="";if(a.length>1)for(var c=a.length,u=0;c>u;u++)try{if(null!=a[u].Key)a[u].Key.toLowerCase()=="aws:autoscaling:groupName".toLowerCase()&&""==i&&(i=a[u].Value),"name"==a[u].Key.toLowerCase()&&(i=a[u].Value);else try{console.log("Tags["+u+"] empty: "+a.toString())}catch(e){console.log("Exception Id 00x1")}}catch(e){console.log("Exception Id 00x3")}else if(1==a.length)i=a[0].Value;else try{console.log("No name tag found for instance with id: "+e.Reservations[r].Instances[o].InstanceId)}catch(e){console.log("Exception Id 00x2")}n[s]={},n[s].name=i,n[s].id=e.Reservations[r].Instances[o].InstanceId,n[s].type=e.Reservations[r].Instances[o].InstanceType,n[s].az=e.Reservations[r].Instances[o].Placement.AvailabilityZone;try{void 0!=e.Reservations[r].Instances[o].Platform&&null!=e.Reservations[r].Instances[0].Platform&&"windows"==e.Reservations[r].Instances[o].Platform.toLowerCase()?n[s].windows=!0:n[s].windows=!1}catch(e){console.log("Exception Id 00x4")}null!=e.Reservations[r].Instances[o].VpcId&&""!=e.Reservations[r].Instances[o].VpcId?n[s].vpc=!0:n[s].vpc=!1,s++}return n}function l(e){x().innerHTML="",x().innerHTML+=p(e),w().innerHTML="<b>Total Reservations: "+F+" --- Total Running Instances: "+J+"<br><hr>",new Tablesort(document.getElementById("resCoTable")),document.getElementById("differentialHeader").click(),I(),T()}function d(){for(var e="<form class='form-inline' id='zoneForm'>",n=0;n<D.length;n++)e+="<div class='checkbox'><label><input type='checkbox' name='"+D[n]+"'>"+D[n]+"</input></label></div>&nbsp;&nbsp;&nbsp;&nbsp;";return e+="<button id='zoneSelectButton' type='submit' class='btn btn-success'>Filter</button></form>"}function f(){B(),x().innerHTML="",w().innerHTML="",F=0,J=0}function v(e){x().innerHTML=e}function p(e){for(var n="",t=e.length,s=0;t>s;s++)n+="<tr><th scope='row'>"+e[s].count+"</th><td>"+e[s].running+"</th><td>"+e[s].diff+"</th><td>"+e[s].type+"</td><td>"+e[s].az+"</td><td>"+e[s].windows.toString()+"</td><td>"+e[s].vpc.toString()+"</td><td>"+e[s].running_ids.join(",<br/>")+"</td><td>"+e[s].running_names.join(",<br/>")+"</td></tr>",F+=e[s].count,J+=e[s].running,D.contains(e[s].az)||D.push(e[s].az);return n}function g(){V=setInterval(h,1e3)}function h(){-1==m().innerHTML.toLowerCase().indexOf("please wait.....")?m().innerHTML+=".":m().innerHTML="Please Wait"}function w(){return document.getElementById("totalData")}function m(){return document.getElementById("pleaseWait")}function y(){g(),m().style.display="block"}function I(){clearInterval(V),m().style.display="none"}function b(){return document.getElementById("errorAccessSecretKey")}function L(){I(),b().style.display="block"}function R(){b().style.display="none"}function x(){return document.getElementById("ec2DataTableBody")}function E(){return document.getElementById("awsQueryResults")}function T(){E().style.display="block"}function B(){E().style.display="none"}function C(){document.getElementById("awsQueryButton").addEventListener("click",function(){H()})}function A(e){return void 0==e||null==e||""==e?(L(),null):e}function S(){return A(document.getElementById("awsAccessKey").value)}function N(){return A(document.getElementById("awsSecretKey").value)}function z(){return document.getElementById("regionSelect").value}function H(){return y(),R(),n(S(),N(),z()),!1}var k=["us-east-1","us-west-1","us-west-2","eu-west-1","eu-central-1","ap-southeast-1","ap-southeast-2","ap-northeast-1","sa-east-1"],O=[],M=[],_=null,K="ALL",P="ALL",V=null,F=0,J=0,D=[];window.onload=function(){C()},Array.prototype.contains=function(e){for(var n=this.length;n--;)if(this[n]===e)return!0;return!1},!function(){function e(n,t){if(!(this instanceof e))return new e(n,t);if(!n||"TABLE"!==n.tagName)throw new Error("Element must be a table");this.init(n,t||{})}var n=[],t=function(e){var n;return window.CustomEvent&&"function"==typeof window.CustomEvent?n=new CustomEvent(e):(n=document.createEvent("CustomEvent"),n.initCustomEvent(e,!1,!1,void 0)),n},s=function(e){return e.getAttribute("data-sort")||e.textContent||e.innerText||""},r=function(e,n){return e=e.toLowerCase(),n=n.toLowerCase(),e===n?0:n>e?1:-1},o=function(e,n){return function(t,s){var r=e(t.td,s.td);return 0===r?n?s.index-t.index:t.index-s.index:r}};e.extend=function(e,t,s){if("function"!=typeof t||"function"!=typeof s)throw new Error("Pattern and sort must be a function");n.push({name:e,pattern:t,sort:s})},e.prototype={init:function(e,n){var t,s,r,o,a=this;if(a.table=e,a.thead=!1,a.options=n,e.rows&&e.rows.length>0&&(e.tHead&&e.tHead.rows.length>0?(t=e.tHead.rows[e.tHead.rows.length-1],a.thead=!0):t=e.rows[0]),t){var i=function(){a.current&&a.current!==this&&(a.current.classList.remove("sort-up"),a.current.classList.remove("sort-down")),a.current=this,a.sortTable(this)};for(r=0;r<t.cells.length;r++)o=t.cells[r],o.classList.contains("no-sort")||(o.classList.add("sort-header"),o.tabindex=0,o.addEventListener("click",i,!1),o.classList.contains("sort-default")&&(s=o));s&&(a.current=s,a.sortTable(s))}},sortTable:function(e,a){var i,c=this,u=e.cellIndex,l=r,d="",f=[],v=c.thead?0:1,p=e.getAttribute("data-sort-method"),g=e.getAttribute("data-sort-order");if(c.table.dispatchEvent(t("beforeSort")),a?i=e.classList.contains("sort-up")?"sort-up":"sort-down":(i=e.classList.contains("sort-up")?"sort-down":e.classList.contains("sort-down")?"sort-up":"asc"===g?"sort-down":"desc"===g?"sort-up":c.options.descending?"sort-up":"sort-down",e.classList.remove("sort-down"===i?"sort-up":"sort-down"),e.classList.add(i)),!(c.table.rows.length<2)){if(!p){for(;f.length<3&&v<c.table.tBodies[0].rows.length;)d=s(c.table.tBodies[0].rows[v].cells[u]),d=d.trim(),d.length>0&&f.push(d),v++;if(!f)return}for(v=0;v<n.length;v++)if(d=n[v],p){if(d.name===p){l=d.sort;break}}else if(f.every(d.pattern)){l=d.sort;break}c.col=u;var h,w=[],m={},y=0,I=0;for(v=0;v<c.table.tBodies.length;v++)for(h=0;h<c.table.tBodies[v].rows.length;h++)d=c.table.tBodies[v].rows[h],d.classList.contains("no-sort")?m[y]=d:w.push({tr:d,td:s(d.cells[c.col]),index:y}),y++;for("sort-down"===i?(w.sort(o(l,!0)),w.reverse()):w.sort(o(l,!1)),v=0;y>v;v++)m[v]?(d=m[v],I++):d=w[v-I].tr,c.table.tBodies[0].appendChild(d);c.table.dispatchEvent(t("afterSort"))}},refresh:function(){void 0!==this.current&&this.sortTable(this.current,!0)}},"undefined"!=typeof module&&module.exports?module.exports=e:window.Tablesort=e}(),function(){var e=function(e){return e.replace(/[^\-?0-9.]/g,"")},n=function(e,n){return e=parseFloat(e),n=parseFloat(n),e=isNaN(e)?0:e,n=isNaN(n)?0:n,e-n};Tablesort.extend("number",function(e){return e.match(/^-?[£\x24Û¢´€]?\d+\s*([,\.]\d{0,2})/)||e.match(/^-?\d+\s*([,\.]\d{0,2})?[£\x24Û¢´€]/)||e.match(/^-?(\d)*-?([,\.]){0,1}-?(\d)+([E,e][\-+][\d]+)?%?$/)},function(t,s){return t=e(t),s=e(s),n(s,t)})}();