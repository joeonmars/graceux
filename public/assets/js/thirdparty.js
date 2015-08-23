/*

 JS Signals <http://millermedeiros.github.com/js-signals/>
 Released under the MIT license
 Author: Miller Medeiros
 Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
*/
(function(i){function h(a,b,c,d,e){this._listener=b;this._isOnce=c;this.context=d;this._signal=a;this._priority=e||0}function g(a,b){if(typeof a!=="function")throw Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}",b));}function e(){this._bindings=[];this._prevParams=null;var a=this;this.dispatch=function(){e.prototype.dispatch.apply(a,arguments)}}h.prototype={active:!0,params:null,execute:function(a){var b;this.active&&this._listener&&(a=this.params?this.params.concat(a):
a,b=this._listener.apply(this.context,a),this._isOnce&&this.detach());return b},detach:function(){return this.isBound()?this._signal.remove(this._listener,this.context):null},isBound:function(){return!!this._signal&&!!this._listener},isOnce:function(){return this._isOnce},getListener:function(){return this._listener},getSignal:function(){return this._signal},_destroy:function(){delete this._signal;delete this._listener;delete this.context},toString:function(){return"[SignalBinding isOnce:"+this._isOnce+
", isBound:"+this.isBound()+", active:"+this.active+"]"}};e.prototype={VERSION:"1.0.0",memorize:!1,_shouldPropagate:!0,active:!0,_registerListener:function(a,b,c,d){var e=this._indexOfListener(a,c);if(e!==-1){if(a=this._bindings[e],a.isOnce()!==b)throw Error("You cannot add"+(b?"":"Once")+"() then add"+(!b?"":"Once")+"() the same listener without removing the relationship first.");}else a=new h(this,a,b,c,d),this._addBinding(a);this.memorize&&this._prevParams&&a.execute(this._prevParams);return a},
_addBinding:function(a){var b=this._bindings.length;do--b;while(this._bindings[b]&&a._priority<=this._bindings[b]._priority);this._bindings.splice(b+1,0,a)},_indexOfListener:function(a,b){for(var c=this._bindings.length,d;c--;)if(d=this._bindings[c],d._listener===a&&d.context===b)return c;return-1},has:function(a,b){return this._indexOfListener(a,b)!==-1},add:function(a,b,c){g(a,"add");return this._registerListener(a,!1,b,c)},addOnce:function(a,b,c){g(a,"addOnce");return this._registerListener(a,
!0,b,c)},remove:function(a,b){g(a,"remove");var c=this._indexOfListener(a,b);c!==-1&&(this._bindings[c]._destroy(),this._bindings.splice(c,1));return a},removeAll:function(){for(var a=this._bindings.length;a--;)this._bindings[a]._destroy();this._bindings.length=0},getNumListeners:function(){return this._bindings.length},halt:function(){this._shouldPropagate=!1},dispatch:function(a){if(this.active){var b=Array.prototype.slice.call(arguments),c=this._bindings.length,d;if(this.memorize)this._prevParams=
b;if(c){d=this._bindings.slice();this._shouldPropagate=!0;do c--;while(d[c]&&this._shouldPropagate&&d[c].execute(b)!==!1)}}},forget:function(){this._prevParams=null},dispose:function(){this.removeAll();delete this._bindings;delete this._prevParams},toString:function(){return"[Signal active:"+this.active+" numListeners:"+this.getNumListeners()+"]"}};var f=e;f.Signal=e;typeof define==="function"&&define.amd?define(function(){return f}):typeof module!=="undefined"&&module.exports?module.exports=f:i.signals=
f})(this);

/** @license
 * crossroads <http://millermedeiros.github.com/crossroads.js/>
 * Author: Miller Medeiros | MIT License
 * v0.12.0 (2013/01/21 13:47)
 */
;(function(){var a=function(a){function e(a,b){if(a.indexOf)return a.indexOf(b);var c=a.length;while(c--)if(a[c]===b)return c;return-1}function f(a,b){var c=e(a,b);c!==-1&&a.splice(c,1)}function g(a,b){return"[object "+b+"]"===Object.prototype.toString.call(a)}function h(a){return g(a,"RegExp")}function i(a){return g(a,"Array")}function j(a){return typeof a=="function"}function k(a){var b;return a===null||a==="null"?b=null:a==="true"?b=!0:a==="false"?b=!1:a===d||a==="undefined"?b=d:a===""||isNaN(a)?b=a:b=parseFloat(a),b}function l(a){var b=a.length,c=[];while(b--)c[b]=k(a[b]);return c}function m(a,b){var c=(a||"").replace("?","").split("&"),d=c.length,e={},f,g;while(d--)f=c[d].split("="),g=b?k(f[1]):f[1],e[f[0]]=typeof g=="string"?decodeURIComponent(g):g;return e}function n(){this.bypassed=new a.Signal,this.routed=new a.Signal,this._routes=[],this._prevRoutes=[],this._piped=[],this.resetState()}function o(b,c,d,e){var f=h(b),g=e.patternLexer;this._router=e,this._pattern=b,this._paramsIds=f?null:g.getParamIds(b),this._optionalParamsIds=f?null:g.getOptionalParamsIds(b),this._matchRegexp=f?b:g.compilePattern(b,e.ignoreCase),this.matched=new a.Signal,this.switched=new a.Signal,c&&this.matched.add(c),this._priority=d||0}var b,c,d;return c=/t(.+)?/.exec("t")[1]==="",n.prototype={greedy:!1,greedyEnabled:!0,ignoreCase:!0,ignoreState:!1,shouldTypecast:!1,normalizeFn:null,resetState:function(){this._prevRoutes.length=0,this._prevMatchedRequest=null,this._prevBypassedRequest=null},create:function(){return new n},addRoute:function(a,b,c){var d=new o(a,b,c,this);return this._sortedInsert(d),d},removeRoute:function(a){f(this._routes,a),a._destroy()},removeAllRoutes:function(){var a=this.getNumRoutes();while(a--)this._routes[a]._destroy();this._routes.length=0},parse:function(a,b){a=a||"",b=b||[];if(!this.ignoreState&&(a===this._prevMatchedRequest||a===this._prevBypassedRequest))return;var c=this._getMatchedRoutes(a),d=0,e=c.length,f;if(e){this._prevMatchedRequest=a,this._notifyPrevRoutes(c,a),this._prevRoutes=c;while(d<e)f=c[d],f.route.matched.dispatch.apply(f.route.matched,b.concat(f.params)),f.isFirst=!d,this.routed.dispatch.apply(this.routed,b.concat([a,f])),d+=1}else this._prevBypassedRequest=a,this.bypassed.dispatch.apply(this.bypassed,b.concat([a]));this._pipeParse(a,b)},_notifyPrevRoutes:function(a,b){var c=0,d;while(d=this._prevRoutes[c++])d.route.switched&&this._didSwitch(d.route,a)&&d.route.switched.dispatch(b)},_didSwitch:function(a,b){var c,d=0;while(c=b[d++])if(c.route===a)return!1;return!0},_pipeParse:function(a,b){var c=0,d;while(d=this._piped[c++])d.parse(a,b)},getNumRoutes:function(){return this._routes.length},_sortedInsert:function(a){var b=this._routes,c=b.length;do--c;while(b[c]&&a._priority<=b[c]._priority);b.splice(c+1,0,a)},_getMatchedRoutes:function(a){var b=[],c=this._routes,d=c.length,e;while(e=c[--d]){(!b.length||this.greedy||e.greedy)&&e.match(a)&&b.push({route:e,params:e._getParamsArray(a)});if(!this.greedyEnabled&&b.length)break}return b},pipe:function(a){this._piped.push(a)},unpipe:function(a){f(this._piped,a)},toString:function(){return"[crossroads numRoutes:"+this.getNumRoutes()+"]"}},b=new n,b.VERSION="0.12.0",b.NORM_AS_ARRAY=function(a,b){return[b.vals_]},b.NORM_AS_OBJECT=function(a,b){return[b]},o.prototype={greedy:!1,rules:void 0,match:function(a){return a=a||"",this._matchRegexp.test(a)&&this._validateParams(a)},_validateParams:function(a){var b=this.rules,c=this._getParamsObject(a),d;for(d in b)if(d!=="normalize_"&&b.hasOwnProperty(d)&&!this._isValidParam(a,d,c))return!1;return!0},_isValidParam:function(a,b,c){var d=this.rules[b],f=c[b],g=!1,k=b.indexOf("?")===0;return f==null&&this._optionalParamsIds&&e(this._optionalParamsIds,b)!==-1?g=!0:h(d)?(k&&(f=c[b+"_"]),g=d.test(f)):i(d)?(k&&(f=c[b+"_"]),g=this._isValidArrayRule(d,f)):j(d)&&(g=d(f,a,c)),g},_isValidArrayRule:function(a,b){if(!this._router.ignoreCase)return e(a,b)!==-1;typeof b=="string"&&(b=b.toLowerCase());var c=a.length,d,f;while(c--){d=a[c],f=typeof d=="string"?d.toLowerCase():d;if(f===b)return!0}return!1},_getParamsObject:function(a){var b=this._router.shouldTypecast,d=this._router.patternLexer.getParamValues(a,this._matchRegexp,b),f={},g=d.length,h,i;while(g--)i=d[g],this._paramsIds&&(h=this._paramsIds[g],h.indexOf("?")===0&&i&&(f[h+"_"]=i,i=m(i,b),d[g]=i),c&&i===""&&e(this._optionalParamsIds,h)!==-1&&(i=void 0,d[g]=i),f[h]=i),f[g]=i;return f.request_=b?k(a):a,f.vals_=d,f},_getParamsArray:function(a){var b=this.rules?this.rules.normalize_:null,c;return b=b||this._router.normalizeFn,b&&j(b)?c=b(a,this._getParamsObject(a)):c=this._getParamsObject(a).vals_,c},interpolate:function(a){var b=this._router.patternLexer.interpolate(this._pattern,a);if(!this._validateParams(b))throw new Error("Generated string doesn't validate against `Route.rules`.");return b},dispose:function(){this._router.removeRoute(this)},_destroy:function(){this.matched.dispose(),this.switched.dispose(),this.matched=this.switched=this._pattern=this._matchRegexp=null},toString:function(){return'[Route pattern:"'+this._pattern+'", numListeners:'+this.matched.getNumListeners()+"]"}},n.prototype.patternLexer=function(){function j(){var a,b;for(a in e)e.hasOwnProperty(a)&&(b=e[a],b.id="__CR_"+a+"__",b.save="save"in b?b.save.replace("{{id}}",b.id):b.id,b.rRestore=new RegExp(b.id,"g"))}function k(a,b){var c=[],d;a.lastIndex=0;while(d=a.exec(b))c.push(d[1]);return c}function m(a){return k(d,a)}function n(a){return k(e.OP.rgx,a)}function o(d,e){return d=d||"",d&&(i===f?d=d.replace(b,""):i===h&&(d=d.replace(c,"")),d=p(d,"rgx","save"),d=d.replace(a,"\\$&"),d=p(d,"rRestore","res"),i===f&&(d="\\/?"+d)),i!==g&&(d+="\\/?"),new RegExp("^"+d+"$",e?"i":"")}function p(a,b,c){var d,f;for(f in e)e.hasOwnProperty(f)&&(d=e[f],a=a.replace(d[b],d[c]));return a}function q(a,b,c){var d=b.exec(a);return d&&(d.shift(),c&&(d=l(d))),d}function r(a,b){if(typeof a!="string")throw new Error("Route pattern should be a string.");var c=function(a,c){var d;c=c.substr(0,1)==="?"?c.substr(1):c;if(b[c]!=null){if(typeof b[c]=="object"){var e=[];for(var f in b[c])e.push(encodeURI(f+"="+b[c][f]));d="?"+e.join("&")}else d=String(b[c]);if(a.indexOf("*")===-1&&d.indexOf("/")!==-1)throw new Error('Invalid value "'+d+'" for segment "'+a+'".')}else{if(a.indexOf("{")!==-1)throw new Error("The segment "+a+" is required.");d=""}return d};return e.OS.trail||(e.OS.trail=new RegExp("(?:"+e.OS.id+")+$")),a.replace(e.OS.rgx,e.OS.save).replace(d,c).replace(e.OS.trail,"").replace(e.OS.rRestore,"/")}var a=/[\\.+*?\^$\[\](){}\/'#]/g,b=/^\/|\/$/g,c=/\/$/g,d=/(?:\{|:)([^}:]+)(?:\}|:)/g,e={OS:{rgx:/([:}]|\w(?=\/))\/?(:|(?:\{\?))/g,save:"$1{{id}}$2",res:"\\/?"},RS:{rgx:/([:}])\/?(\{)/g,save:"$1{{id}}$2",res:"\\/"},RQ:{rgx:/\{\?([^}]+)\}/g,res:"\\?([^#]+)"},OQ:{rgx:/:\?([^:]+):/g,res:"(?:\\?([^#]*))?"},OR:{rgx:/:([^:]+)\*:/g,res:"(.*)?"},RR:{rgx:/\{([^}]+)\*\}/g,res:"(.+)"},RP:{rgx:/\{([^}]+)\}/g,res:"([^\\/?]+)"},OP:{rgx:/:([^:]+):/g,res:"([^\\/?]+)?/?"}},f=1,g=2,h=3,i=f;return j(),{strict:function(){i=g},loose:function(){i=f},legacy:function(){i=h},getParamIds:m,getOptionalParamsIds:n,getParamValues:q,compilePattern:o,interpolate:r}}(),b};typeof define=="function"&&define.amd?define(["signals"],a):typeof module!="undefined"&&module.exports?module.exports=a(require("signals")):window.crossroads=a(window.signals)})();
(function(){var d=this,q=d._,n={},k=Array.prototype,g=Object.prototype,b=k.push,c=k.slice,h=k.concat,p=g.toString,a=g.hasOwnProperty,m=k.forEach,z=k.map,t=k.reduce,v=k.reduceRight,D=k.filter,f=k.every,r=k.some,u=k.indexOf,B=k.lastIndexOf,g=Array.isArray,x=Object.keys,A=Function.prototype.bind,e=function(j){if(j instanceof e)return j;if(!(this instanceof e))return new e(j);this._wrapped=j};"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(exports=module.exports=e),exports._=
e):d._=e;e.VERSION="1.5.1";var y=e.each=e.forEach=function(j,a,c){if(null!=j)if(m&&j.forEach===m)j.forEach(a,c);else if(j.length===+j.length)for(var b=0,l=j.length;b<l&&a.call(c,j[b],b,j)!==n;b++);else for(b in j)if(e.has(j,b)&&a.call(c,j[b],b,j)===n)break};e.map=e.collect=function(j,a,c){var b=[];if(null==j)return b;if(z&&j.map===z)return j.map(a,c);y(j,function(j,l,e){b.push(a.call(c,j,l,e))});return b};e.reduce=e.foldl=e.inject=function(j,a,c,b){var l=2<arguments.length;null==j&&(j=[]);if(t&&j.reduce===
t)return b&&(a=e.bind(a,b)),l?j.reduce(a,c):j.reduce(a);y(j,function(j,e,s){l?c=a.call(b,c,j,e,s):(c=j,l=!0)});if(!l)throw new TypeError("Reduce of empty array with no initial value");return c};e.reduceRight=e.foldr=function(j,a,c,b){var l=2<arguments.length;null==j&&(j=[]);if(v&&j.reduceRight===v)return b&&(a=e.bind(a,b)),l?j.reduceRight(a,c):j.reduceRight(a);var s=j.length;if(s!==+s)var f=e.keys(j),s=f.length;y(j,function(e,w,m){w=f?f[--s]:--s;l?c=a.call(b,c,j[w],w,m):(c=j[w],l=!0)});if(!l)throw new TypeError("Reduce of empty array with no initial value");
return c};e.find=e.detect=function(j,a,c){var b;E(j,function(j,l,e){if(a.call(c,j,l,e))return b=j,!0});return b};e.filter=e.select=function(j,a,c){var b=[];if(null==j)return b;if(D&&j.filter===D)return j.filter(a,c);y(j,function(j,l,e){a.call(c,j,l,e)&&b.push(j)});return b};e.reject=function(j,a,c){return e.filter(j,function(j,b,l){return!a.call(c,j,b,l)},c)};e.every=e.all=function(j,a,c){a||(a=e.identity);var b=!0;if(null==j)return b;if(f&&j.every===f)return j.every(a,c);y(j,function(j,l,e){if(!(b=
b&&a.call(c,j,l,e)))return n});return!!b};var E=e.some=e.any=function(j,a,c){a||(a=e.identity);var b=!1;if(null==j)return b;if(r&&j.some===r)return j.some(a,c);y(j,function(j,l,e){if(b||(b=a.call(c,j,l,e)))return n});return!!b};e.contains=e.include=function(j,a){return null==j?!1:u&&j.indexOf===u?-1!=j.indexOf(a):E(j,function(j){return j===a})};e.invoke=function(j,a){var b=c.call(arguments,2),l=e.isFunction(a);return e.map(j,function(j){return(l?a:j[a]).apply(j,b)})};e.pluck=function(j,a){return e.map(j,
function(j){return j[a]})};e.where=function(j,a,b){return e.isEmpty(a)?b?void 0:[]:e[b?"find":"filter"](j,function(j){for(var b in a)if(a[b]!==j[b])return!1;return!0})};e.findWhere=function(j,a){return e.where(j,a,!0)};e.max=function(j,a,b){if(!a&&e.isArray(j)&&j[0]===+j[0]&&65535>j.length)return Math.max.apply(Math,j);if(!a&&e.isEmpty(j))return-Infinity;var c={computed:-Infinity,value:-Infinity};y(j,function(j,l,e){l=a?a.call(b,j,l,e):j;l>c.computed&&(c={value:j,computed:l})});return c.value};e.min=
function(j,a,b){if(!a&&e.isArray(j)&&j[0]===+j[0]&&65535>j.length)return Math.min.apply(Math,j);if(!a&&e.isEmpty(j))return Infinity;var c={computed:Infinity,value:Infinity};y(j,function(j,l,e){l=a?a.call(b,j,l,e):j;l<c.computed&&(c={value:j,computed:l})});return c.value};e.shuffle=function(j){var a,b=0,c=[];y(j,function(j){a=e.random(b++);c[b-1]=c[a];c[a]=j});return c};var C=function(j){return e.isFunction(j)?j:function(a){return a[j]}};e.sortBy=function(j,a,b){var c=C(a);return e.pluck(e.map(j,function(j,
a,l){return{value:j,index:a,criteria:c.call(b,j,a,l)}}).sort(function(j,a){var b=j.criteria,c=a.criteria;if(b!==c){if(b>c||void 0===b)return 1;if(b<c||void 0===c)return-1}return j.index<a.index?-1:1}),"value")};var l=function(j,a,b,c){var l={},s=C(null==a?e.identity:a);y(j,function(a,e){var K=s.call(b,a,e,j);c(l,K,a)});return l};e.groupBy=function(j,a,b){return l(j,a,b,function(j,a,b){(e.has(j,a)?j[a]:j[a]=[]).push(b)})};e.countBy=function(j,a,b){return l(j,a,b,function(j,a){e.has(j,a)||(j[a]=0);
j[a]++})};e.sortedIndex=function(j,a,b,c){b=null==b?e.identity:C(b);a=b.call(c,a);for(var l=0,s=j.length;l<s;){var f=l+s>>>1;b.call(c,j[f])<a?l=f+1:s=f}return l};e.toArray=function(j){return!j?[]:e.isArray(j)?c.call(j):j.length===+j.length?e.map(j,e.identity):e.values(j)};e.size=function(j){return null==j?0:j.length===+j.length?j.length:e.keys(j).length};e.first=e.head=e.take=function(j,a,b){return null==j?void 0:null!=a&&!b?c.call(j,0,a):j[0]};e.initial=function(j,a,b){return c.call(j,0,j.length-
(null==a||b?1:a))};e.last=function(j,a,b){return null==j?void 0:null!=a&&!b?c.call(j,Math.max(j.length-a,0)):j[j.length-1]};e.rest=e.tail=e.drop=function(j,a,b){return c.call(j,null==a||b?1:a)};e.compact=function(j){return e.filter(j,e.identity)};var s=function(j,a,c){if(a&&e.every(j,e.isArray))return h.apply(c,j);y(j,function(j){e.isArray(j)||e.isArguments(j)?a?b.apply(c,j):s(j,a,c):c.push(j)});return c};e.flatten=function(j,a){return s(j,a,[])};e.without=function(j){return e.difference(j,c.call(arguments,
1))};e.uniq=e.unique=function(j,a,b,c){e.isFunction(a)&&(c=b,b=a,a=!1);b=b?e.map(j,b,c):j;var l=[],s=[];y(b,function(b,c){if(a?!c||s[s.length-1]!==b:!e.contains(s,b))s.push(b),l.push(j[c])});return l};e.union=function(){return e.uniq(e.flatten(arguments,!0))};e.intersection=function(j){var a=c.call(arguments,1);return e.filter(e.uniq(j),function(j){return e.every(a,function(a){return 0<=e.indexOf(a,j)})})};e.difference=function(j){var a=h.apply(k,c.call(arguments,1));return e.filter(j,function(j){return!e.contains(a,
j)})};e.zip=function(){for(var j=e.max(e.pluck(arguments,"length").concat(0)),a=Array(j),b=0;b<j;b++)a[b]=e.pluck(arguments,""+b);return a};e.object=function(a,b){if(null==a)return{};for(var c={},l=0,e=a.length;l<e;l++)b?c[a[l]]=b[l]:c[a[l][0]]=a[l][1];return c};e.indexOf=function(a,b,c){if(null==a)return-1;var l=0,s=a.length;if(c)if("number"==typeof c)l=0>c?Math.max(0,s+c):c;else return l=e.sortedIndex(a,b),a[l]===b?l:-1;if(u&&a.indexOf===u)return a.indexOf(b,c);for(;l<s;l++)if(a[l]===b)return l;
return-1};e.lastIndexOf=function(a,b,c){if(null==a)return-1;var l=null!=c;if(B&&a.lastIndexOf===B)return l?a.lastIndexOf(b,c):a.lastIndexOf(b);for(c=l?c:a.length;c--;)if(a[c]===b)return c;return-1};e.range=function(a,b,c){1>=arguments.length&&(b=a||0,a=0);c=arguments[2]||1;for(var l=Math.max(Math.ceil((b-a)/c),0),e=0,s=Array(l);e<l;)s[e++]=a,a+=c;return s};var w=function(){};e.bind=function(a,b){var l,s;if(A&&a.bind===A)return A.apply(a,c.call(arguments,1));if(!e.isFunction(a))throw new TypeError;
l=c.call(arguments,2);return s=function(){if(!(this instanceof s))return a.apply(b,l.concat(c.call(arguments)));w.prototype=a.prototype;var e=new w;w.prototype=null;var f=a.apply(e,l.concat(c.call(arguments)));return Object(f)===f?f:e}};e.partial=function(a){var b=c.call(arguments,1);return function(){return a.apply(this,b.concat(c.call(arguments)))}};e.bindAll=function(a){var b=c.call(arguments,1);if(0===b.length)throw Error("bindAll must be passed function names");y(b,function(b){a[b]=e.bind(a[b],
a)});return a};e.memoize=function(a,b){var c={};b||(b=e.identity);return function(){var l=b.apply(this,arguments);return e.has(c,l)?c[l]:c[l]=a.apply(this,arguments)}};e.delay=function(a,b){var l=c.call(arguments,2);return setTimeout(function(){return a.apply(null,l)},b)};e.defer=function(a){return e.delay.apply(e,[a,1].concat(c.call(arguments,1)))};e.throttle=function(a,b,c){var l,e,s,f=null,w=0;c||(c={});var m=function(){w=!1===c.leading?0:new Date;f=null;s=a.apply(l,e)};return function(){var h=
new Date;!w&&!1===c.leading&&(w=h);var p=b-(h-w);l=this;e=arguments;0>=p?(clearTimeout(f),f=null,w=h,s=a.apply(l,e)):!f&&!1!==c.trailing&&(f=setTimeout(m,p));return s}};e.debounce=function(a,b,c){var l,e=null;return function(){var s=this,f=arguments,w=c&&!e;clearTimeout(e);e=setTimeout(function(){e=null;c||(l=a.apply(s,f))},b);w&&(l=a.apply(s,f));return l}};e.once=function(a){var b=!1,c;return function(){if(b)return c;b=!0;c=a.apply(this,arguments);a=null;return c}};e.wrap=function(a,c){return function(){var l=
[a];b.apply(l,arguments);return c.apply(this,l)}};e.compose=function(){var a=arguments;return function(){for(var b=arguments,c=a.length-1;0<=c;c--)b=[a[c].apply(this,b)];return b[0]}};e.after=function(a,b){return function(){if(1>--a)return b.apply(this,arguments)}};e.keys=x||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[],c;for(c in a)e.has(a,c)&&b.push(c);return b};e.values=function(a){var b=[],c;for(c in a)e.has(a,c)&&b.push(a[c]);return b};e.pairs=function(a){var b=
[],c;for(c in a)e.has(a,c)&&b.push([c,a[c]]);return b};e.invert=function(a){var b={},c;for(c in a)e.has(a,c)&&(b[a[c]]=c);return b};e.functions=e.methods=function(a){var b=[],c;for(c in a)e.isFunction(a[c])&&b.push(c);return b.sort()};e.extend=function(a){y(c.call(arguments,1),function(b){if(b)for(var c in b)a[c]=b[c]});return a};e.pick=function(a){var b={},l=h.apply(k,c.call(arguments,1));y(l,function(c){c in a&&(b[c]=a[c])});return b};e.omit=function(a){var b={},l=h.apply(k,c.call(arguments,1)),
s;for(s in a)e.contains(l,s)||(b[s]=a[s]);return b};e.defaults=function(a){y(c.call(arguments,1),function(b){if(b)for(var c in b)void 0===a[c]&&(a[c]=b[c])});return a};e.clone=function(a){return!e.isObject(a)?a:e.isArray(a)?a.slice():e.extend({},a)};e.tap=function(a,b){b(a);return a};var G=function(a,b,c,l){if(a===b)return 0!==a||1/a==1/b;if(null==a||null==b)return a===b;a instanceof e&&(a=a._wrapped);b instanceof e&&(b=b._wrapped);var s=p.call(a);if(s!=p.call(b))return!1;switch(s){case "[object String]":return a==
String(b);case "[object Number]":return a!=+a?b!=+b:0==a?1/a==1/b:a==+b;case "[object Date]":case "[object Boolean]":return+a==+b;case "[object RegExp]":return a.source==b.source&&a.global==b.global&&a.multiline==b.multiline&&a.ignoreCase==b.ignoreCase}if("object"!=typeof a||"object"!=typeof b)return!1;for(var f=c.length;f--;)if(c[f]==a)return l[f]==b;var f=a.constructor,w=b.constructor;if(f!==w&&(!e.isFunction(f)||!(f instanceof f&&e.isFunction(w)&&w instanceof w)))return!1;c.push(a);l.push(b);f=
0;w=!0;if("[object Array]"==s){if(f=a.length,w=f==b.length)for(;f--&&(w=G(a[f],b[f],c,l)););}else{for(var m in a)if(e.has(a,m)&&(f++,!(w=e.has(b,m)&&G(a[m],b[m],c,l))))break;if(w){for(m in b)if(e.has(b,m)&&!f--)break;w=!f}}c.pop();l.pop();return w};e.isEqual=function(a,b){return G(a,b,[],[])};e.isEmpty=function(a){if(null==a)return!0;if(e.isArray(a)||e.isString(a))return 0===a.length;for(var b in a)if(e.has(a,b))return!1;return!0};e.isElement=function(a){return!!(a&&1===a.nodeType)};e.isArray=g||
function(a){return"[object Array]"==p.call(a)};e.isObject=function(a){return a===Object(a)};y("Arguments Function String Number Date RegExp".split(" "),function(a){e["is"+a]=function(b){return p.call(b)=="[object "+a+"]"}});e.isArguments(arguments)||(e.isArguments=function(a){return!(!a||!e.has(a,"callee"))});"function"!==typeof/./&&(e.isFunction=function(a){return"function"===typeof a});e.isFinite=function(a){return isFinite(a)&&!isNaN(parseFloat(a))};e.isNaN=function(a){return e.isNumber(a)&&a!=
+a};e.isBoolean=function(a){return!0===a||!1===a||"[object Boolean]"==p.call(a)};e.isNull=function(a){return null===a};e.isUndefined=function(a){return void 0===a};e.has=function(b,c){return a.call(b,c)};e.noConflict=function(){d._=q;return this};e.identity=function(a){return a};e.times=function(a,b,c){for(var l=Array(Math.max(0,a)),e=0;e<a;e++)l[e]=b.call(c,e);return l};e.random=function(a,b){null==b&&(b=a,a=0);return a+Math.floor(Math.random()*(b-a+1))};var F={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",
'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};F.unescape=e.invert(F.escape);var H={escape:RegExp("["+e.keys(F.escape).join("")+"]","g"),unescape:RegExp("("+e.keys(F.unescape).join("|")+")","g")};e.each(["escape","unescape"],function(a){e[a]=function(b){return null==b?"":(""+b).replace(H[a],function(b){return F[a][b]})}});e.result=function(a,b){if(null!=a){var c=a[b];return e.isFunction(c)?c.call(a):c}};e.mixin=function(a){y(e.functions(a),function(c){var l=e[c]=a[c];e.prototype[c]=function(){var a=[this._wrapped];
b.apply(a,arguments);a=l.apply(e,a);return this._chain?e(a).chain():a}})};var I=0;e.uniqueId=function(a){var b=++I+"";return a?a+b:b};e.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var J=/(.)^/,L={"'":"'","\\":"\\","\r":"r","\n":"n","\t":"t","\u2028":"u2028","\u2029":"u2029"},M=/\\|'|\r|\n|\t|\u2028|\u2029/g;e.template=function(a,b,c){var l;c=e.defaults({},c,e.templateSettings);var s=RegExp([(c.escape||J).source,(c.interpolate||J).source,(c.evaluate||
J).source].join("|")+"|$","g"),f=0,w="__p+='";a.replace(s,function(b,c,l,e,s){w+=a.slice(f,s).replace(M,function(a){return"\\"+L[a]});c&&(w+="'+\n((__t=("+c+"))==null?'':_.escape(__t))+\n'");l&&(w+="'+\n((__t=("+l+"))==null?'':__t)+\n'");e&&(w+="';\n"+e+"\n__p+='");f=s+b.length;return b});w+="';\n";c.variable||(w="with(obj||{}){\n"+w+"}\n");w="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+w+"return __p;\n";try{l=new Function(c.variable||"obj","_",w)}catch(m){throw m.source=
w,m;}if(b)return l(b,e);b=function(a){return l.call(this,a,e)};b.source="function("+(c.variable||"obj")+"){\n"+w+"}";return b};e.chain=function(a){return e(a).chain()};e.mixin(e);y("pop push reverse shift sort splice unshift".split(" "),function(a){var b=k[a];e.prototype[a]=function(){var c=this._wrapped;b.apply(c,arguments);("shift"==a||"splice"==a)&&0===c.length&&delete c[0];return this._chain?e(c).chain():c}});y(["concat","join","slice"],function(a){var b=k[a];e.prototype[a]=function(){var a=b.apply(this._wrapped,
arguments);return this._chain?e(a).chain():a}});e.extend(e.prototype,{chain:function(){this._chain=!0;return this},value:function(){return this._wrapped}})}).call(this);var Backbone=Backbone||{};
(function(){var d=[].slice,q=function(d,g,b){var c;d=-1;var h=g.length;switch(b.length){case 0:for(;++d<h;)(c=g[d]).callback.call(c.ctx);break;case 1:for(;++d<h;)(c=g[d]).callback.call(c.ctx,b[0]);break;case 2:for(;++d<h;)(c=g[d]).callback.call(c.ctx,b[0],b[1]);break;case 3:for(;++d<h;)(c=g[d]).callback.call(c.ctx,b[0],b[1],b[2]);break;default:for(;++d<h;)(c=g[d]).callback.apply(c.ctx,b)}},n=Backbone.Events={on:function(d,g,b){this._events||(this._events={});(this._events[d]||(this._events[d]=[])).push({callback:g,
context:b,ctx:b||this});return this},once:function(d,g,b){var c=this,h=_.once(function(){c.off(d,h);g.apply(this,arguments)});h._callback=g;this.on(d,h,b);return this},off:function(d,g,b){var c,h,p,a,m,z,t,v;if(!this._events)return this;if(!d&&!g&&!b)return this._events={},this;a=d?[d]:_.keys(this._events);m=0;for(z=a.length;m<z;m++)if(d=a[m],c=this._events[d]){p=[];if(g||b){t=0;for(v=c.length;t<v;t++)h=c[t],(g&&g!==(h.callback._callback||h.callback)||b&&b!==h.context)&&p.push(h)}this._events[d]=
p}return this},trigger:function(n){if(!this._events)return this;var g=d.call(arguments,1),b=this._events[n],c=this._events.all;b&&q(this,b,g);c&&q(this,c,arguments);return this},listenTo:function(d,g,b){var c=this._listeners||(this._listeners={}),h=d._listenerId||(d._listenerId=_.uniqueId("l"));c[h]=d;d.on(g,b||this,this);return this},stopListening:function(d,g,b){var c=this._listeners;if(c){if(d)d.off(g,b,this),!g&&!b&&delete c[d._listenerId];else{for(var h in c)c[h].off(null,null,this);this._listeners=
{}}return this}}};n.bind=n.on;n.unbind=n.off;"undefined"!==typeof exports&&("undefined"!==typeof module&&module.exports&&(exports=module.exports=n),exports.Backbone=exports.Backbone||Backbone)})();(function(){function d(b){var c=(new Date).getTime(),d=Math.max(0,16-(c-n)),p=q.setTimeout(function(){b(c+d)},d);n=c+d;return p}var q=this,n=0,k=["ms","moz","webkit","o"];if("undefined"!==typeof exports)"undefined"!==typeof module&&module.exports&&(exports=module.exports=d),exports.requestAnimationFrame=d;else{for(var g=0;g<k.length&&!q.requestAnimationFrame;++g)q.requestAnimationFrame=q[k[g]+"RequestAnimationFrame"],q.cancelAnimationFrame=q[k[g]+"CancelAnimationFrame"]||q[k[g]+"CancelRequestAnimationFrame"];
q.requestAnimationFrame||(q.requestAnimationFrame=d);q.cancelAnimationFrame||(q.cancelAnimationFrame=function(b){clearTimeout(b)})}})();(function(){function d(){var a=document.body.getBoundingClientRect(),b=this.width=a.width,a=this.height=a.height;this.renderer.setSize(b,a,this.ratio);this.trigger(f.Events.resize,b,a)}var q=this,n=q.Two||{},k=Math.sin,g=Math.cos,b=Math.atan2,c=Math.sqrt,h=Math.PI,p=2*h,a=h/2,m=Math.pow,z=Math.min,t=Math.max,v=0,D={hasEventListeners:_.isFunction(q.addEventListener),bind:function(a,b,c,e){this.hasEventListeners?a.addEventListener(b,c,!!e):a.attachEvent("on"+b,c);return this},unbind:function(a,b,c,
e){this.hasEventListeners?a.removeEventListeners(b,c,!!e):a.detachEvent("on"+b,c);return this}},f=q.Two=function(a){a=_.defaults(a||{},{fullscreen:!1,width:640,height:480,type:f.Types.svg,autostart:!1});_.each(a,function(a,b){"fullscreen"===b||("width"===b||"height"===b||"autostart"===b)||(this[b]=a)},this);_.isElement(a.domElement)&&(this.type=f.Types[a.domElement.tagName.toLowerCase()]);this.renderer=new f[this.type](this);f.Utils.setPlaying.call(this,a.autostart);this.frameCount=0;a.fullscreen?
(a=_.bind(d,this),_.extend(document.body.style,{overflow:"hidden",margin:0,padding:0,top:0,left:0,right:0,bottom:0,position:"fixed"}),_.extend(this.renderer.domElement.style,{display:"block",top:0,left:0,right:0,bottom:0,position:"fixed"}),D.bind(q,"resize",a),a()):_.isElement(a.domElement)||(this.renderer.setSize(a.width,a.height,this.ratio),this.width=a.width,this.height=a.height);this.scene=this.renderer.scene;f.Instances.push(this)};_.extend(f,{Array:q.Float32Array||Array,Types:{webgl:"WebGLRenderer",
svg:"SVGRenderer",canvas:"CanvasRenderer"},Version:"v0.4.0",Identifier:"two_",Properties:{hierarchy:"hierarchy",demotion:"demotion"},Events:{play:"play",pause:"pause",update:"update",render:"render",resize:"resize",change:"change",remove:"remove",insert:"insert"},Commands:{move:"M",line:"L",curve:"C",close:"Z"},Resolution:8,Instances:[],noConflict:function(){q.Two=n;return this},uniqueId:function(){var a=v;v++;return a},Utils:{release:function(a){_.isObject(a)&&(_.isFunction(a.unbind)&&a.unbind(),
a.vertices&&(_.isFunction(a.vertices.unbind)&&a.vertices.unbind(),_.each(a.vertices,function(a){_.isFunction(a.unbind)&&a.unbind()})),a.children&&_.each(a.children,function(a){f.Utils.release(a)}))},Curve:{CollinearityEpsilon:m(10,-30),RecursionLimit:16,CuspLimit:0,Tolerance:{distance:0.25,angle:0,epsilon:0.01},abscissas:[[0.5773502691896257],[0,0.7745966692414834],[0.33998104358485626,0.8611363115940526],[0,0.5384693101056831,0.906179845938664],[0.2386191860831969,0.6612093864662645,0.932469514203152],
[0,0.4058451513773972,0.7415311855993945,0.9491079123427585],[0.1834346424956498,0.525532409916329,0.7966664774136267,0.9602898564975363],[0,0.3242534234038089,0.6133714327005904,0.8360311073266358,0.9681602395076261],[0.14887433898163122,0.4333953941292472,0.6794095682990244,0.8650633666889845,0.9739065285171717],[0,0.26954315595234496,0.5190961292068118,0.7301520055740494,0.8870625997680953,0.978228658146057],[0.1252334085114689,0.3678314989981802,0.5873179542866175,0.7699026741943047,0.9041172563704749,
0.9815606342467192],[0,0.2304583159551348,0.44849275103644687,0.6423493394403402,0.8015780907333099,0.9175983992229779,0.9841830547185881],[0.10805494870734367,0.31911236892788974,0.5152486363581541,0.6872929048116855,0.827201315069765,0.9284348836635735,0.9862838086968123],[0,0.20119409399743451,0.3941513470775634,0.5709721726085388,0.7244177313601701,0.8482065834104272,0.937273392400706,0.9879925180204854],[0.09501250983763744,0.2816035507792589,0.45801677765722737,0.6178762444026438,0.755404408355003,
0.8656312023878318,0.9445750230732326,0.9894009349916499]],weights:[[1],[0.8888888888888888,0.5555555555555556],[0.6521451548625461,0.34785484513745385],[0.5688888888888889,0.47862867049936647,0.23692688505618908],[0.46791393457269104,0.3607615730481386,0.17132449237917036],[0.4179591836734694,0.3818300505051189,0.27970539148927664,0.1294849661688697],[0.362683783378362,0.31370664587788727,0.22238103445337448,0.10122853629037626],[0.3302393550012598,0.31234707704000286,0.26061069640293544,0.1806481606948574,
0.08127438836157441],[0.29552422471475287,0.26926671930999635,0.21908636251598204,0.1494513491505806,0.06667134430868814],[0.2729250867779006,0.26280454451024665,0.23319376459199048,0.18629021092773426,0.1255803694649046,0.05566856711617366],[0.24914704581340277,0.2334925365383548,0.20316742672306592,0.16007832854334622,0.10693932599531843,0.04717533638651183],[0.2325515532308739,0.22628318026289723,0.2078160475368885,0.17814598076194574,0.13887351021978725,0.09212149983772845,0.04048400476531588],
[0.2152638534631578,0.2051984637212956,0.18553839747793782,0.15720316715819355,0.12151857068790319,0.08015808715976021,0.03511946033175186],[0.2025782419255613,0.19843148532711158,0.1861610000155622,0.16626920581699392,0.13957067792615432,0.10715922046717194,0.07036604748810812,0.03075324199611727],[0.1894506104550685,0.18260341504492358,0.16915651939500254,0.14959598881657674,0.12462897125553388,0.09515851168249279,0.062253523938647894,0.027152459411754096]]},devicePixelRatio:q.devicePixelRatio||
1,getBackingStoreRatio:function(a){return a.webkitBackingStorePixelRatio||a.mozBackingStorePixelRatio||a.msBackingStorePixelRatio||a.oBackingStorePixelRatio||a.backingStorePixelRatio||1},getRatio:function(a){return f.Utils.devicePixelRatio/e(a)},setPlaying:function(a){this.playing=!!a;return this},getComputedMatrix:function(a,b){b=b&&b.identity()||new f.Matrix;for(var c=a,e=[];c&&c._matrix;)e.push(c._matrix),c=c.parent;e.reverse();_.each(e,function(a){a=a.elements;b.multiply(a[0],a[1],a[2],a[3],a[4],
a[5],a[6],a[7],a[8],a[9])});return b},deltaTransformPoint:function(a,b,c){return new f.Vector(b*a.a+c*a.c+0,b*a.b+c*a.d+0)},decomposeMatrix:function(a){var b=f.Utils.deltaTransformPoint(a,0,1),c=f.Utils.deltaTransformPoint(a,1,0),b=180/Math.PI*Math.atan2(b.y,b.x)-90,c=180/Math.PI*Math.atan2(c.y,c.x);return{translateX:a.e,translateY:a.f,scaleX:Math.sqrt(a.a*a.a+a.b*a.b),scaleY:Math.sqrt(a.c*a.c+a.d*a.d),skewX:b,skewY:c,rotation:b}},applySvgAttributes:function(a,b){var c={},e={},d,m,h;if(getComputedStyle){var p=
getComputedStyle(a);for(d=p.length;d--;)m=p[d],h=p[m],void 0!==h&&(e[m]=h)}for(d=a.attributes.length;d--;)h=a.attributes[d],c[h.nodeName]=h.value;_.isUndefined(e.opacity)||(e["stroke-opacity"]=e.opacity,e["fill-opacity"]=e.opacity);_.extend(e,c);e.visible=!(_.isUndefined(e.display)&&"none"===e.display)||_.isUndefined(e.visibility)&&"hidden"===e.visibility;for(m in e)switch(h=e[m],m){case "transform":if("none"===h)break;if(null===a.getCTM())break;c=f.Utils.decomposeMatrix(a.getCTM());b.translation.set(c.translateX,
c.translateY);b.rotation=c.rotation;b.scale=c.scaleX;e.x&&(b.translation.x=e.x);e.y&&(b.translation.y=e.y);break;case "visible":b.visible=h;break;case "stroke-linecap":b.cap=h;break;case "stroke-linejoin":b.join=h;break;case "stroke-miterlimit":b.miter=h;break;case "stroke-width":b.linewidth=parseFloat(h);break;case "stroke-opacity":case "fill-opacity":case "opacity":b.opacity=parseFloat(h);break;case "fill":case "stroke":b[m]="none"===h?"transparent":h;break;case "id":b.id=h;break;case "class":b.classList=
h.split(" ")}return b},read:{svg:function(){return f.Utils.read.g.apply(this,arguments)},g:function(a){var b=new f.Group;f.Utils.applySvgAttributes(a,b);for(var c=0,e=a.childNodes.length;c<e;c++){var d=a.childNodes[c],m=d.nodeName;if(!m)return;m=m.replace(/svg\:/ig,"").toLowerCase();m in f.Utils.read&&(d=f.Utils.read[m].call(this,d),b.add(d))}return b},polygon:function(a,b){var c=[];a.getAttribute("points").replace(/(-?[\d\.?]+),(-?[\d\.?]+)/g,function(a,b,e){c.push(new f.Anchor(parseFloat(b),parseFloat(e)))});
var e=(new f.Polygon(c,!b)).noStroke();e.fill="black";return f.Utils.applySvgAttributes(a,e)},polyline:function(a){return f.Utils.read.polygon(a,!0)},path:function(a){var b=a.getAttribute("d"),c=new f.Anchor,e,d,h=!1,p=!1,g=b.match(/[a-df-z][^a-df-z]*/ig),z=g.length-1;_.each(g.slice(0),function(a,b){var c=a[0],e=c.toLowerCase(),l=a.slice(1).trim().split(/[\s,]+|(?=\s?[+\-])/),f=[],d;0>=b&&(g=[]);switch(e){case "h":case "v":1<l.length&&(d=1);break;case "m":case "l":case "t":2<l.length&&(d=2);break;
case "s":case "q":4<l.length&&(d=4);break;case "c":6<l.length&&(d=6)}if(d){for(var e=0,m=l.length,h=0;e<m;e+=d){var s=c;if(0<h)switch(c){case "m":s="l";break;case "M":s="L"}f.push([s].concat(l.slice(e,e+d)).join(" "));h++}g=Array.prototype.concat.apply(g,f)}else g.push(a)});b=_.flatten(_.map(g,function(a,b){var l,s,g=a[0],t=g.toLowerCase();d=a.slice(1).trim();d=d.replace(/(-?\d+(?:\.\d*)?)[eE]([+\-]?\d+)/g,function(a,b,c){return parseFloat(b)*m(10,c)});d=d.split(/[\s,]+|(?=\s?[+\-])/);p=g===t;var v,
n,r,D;switch(t){case "z":b>=z?h=!0:(s=c.x,l=c.y,l=new f.Anchor(s,l,void 0,void 0,void 0,void 0,f.Commands.close));break;case "m":case "l":s=parseFloat(d[0]);l=parseFloat(d[1]);l=new f.Anchor(s,l,void 0,void 0,void 0,void 0,"m"===t?f.Commands.move:f.Commands.line);p&&l.addSelf(c);c=l;break;case "h":case "v":s="h"===t?"x":"y";g="x"===s?"y":"x";l=new f.Anchor(void 0,void 0,void 0,void 0,void 0,void 0,f.Commands.line);l[s]=parseFloat(d[0]);l[g]=c[g];p&&(l[s]+=c[s]);c=l;break;case "c":case "s":l=c.x;g=
c.y;e||(e=new f.Vector);"c"===t?(v=parseFloat(d[0]),s=parseFloat(d[1]),t=parseFloat(d[2]),n=parseFloat(d[3]),r=parseFloat(d[4]),D=parseFloat(d[5])):(n=C(c,e,p),v=n.x,s=n.y,t=parseFloat(d[0]),n=parseFloat(d[1]),r=parseFloat(d[2]),D=parseFloat(d[3]));p&&(v+=l,s+=g,t+=l,n+=g,r+=l,D+=g);_.isObject(c.controls)||f.Anchor.AppendCurveProperties(c);c.controls.right.set(v-c.x,s-c.y);c=l=new f.Anchor(r,D,t-r,n-D,void 0,void 0,f.Commands.curve);e=l.controls.left;break;case "t":case "q":l=c.x;g=c.y;e||(e=new f.Vector);
e.isZero()?(v=l,s=g):(v=e.x,g=e.y);"q"===t?(t=parseFloat(d[0]),n=parseFloat(d[1]),r=parseFloat(d[1]),D=parseFloat(d[2])):(n=C(c,e,p),t=n.x,n=n.y,r=parseFloat(d[0]),D=parseFloat(d[1]));p&&(v+=l,s+=g,t+=l,n+=g,r+=l,D+=g);_.isObject(c.controls)||f.Anchor.AppendCurveProperties(c);c.controls.right.set(v-c.x,s-c.y);c=l=new f.Anchor(r,D,t-r,n-D,void 0,void 0,f.Commands.curve);e=l.controls.left;break;case "a":throw new f.Utils.Error("not yet able to interpret Elliptical Arcs.");}return l}));if(!(1>=b.length))return b=
_.compact(b),b=(new f.Polygon(b,h,void 0,!0)).noStroke(),b.fill="black",f.Utils.applySvgAttributes(a,b)},circle:function(a){var b=parseFloat(a.getAttribute("cx")),c=parseFloat(a.getAttribute("cy")),e=parseFloat(a.getAttribute("r")),d=f.Resolution,m=_.map(_.range(d),function(a){var b=a/d*p;a=e*g(b);b=e*k(b);return new f.Anchor(a,b)},this),m=(new f.Polygon(m,!0,!0)).noStroke();m.translation.set(b,c);m.fill="black";return f.Utils.applySvgAttributes(a,m)},ellipse:function(a){var b=parseFloat(a.getAttribute("cx")),
c=parseFloat(a.getAttribute("cy")),e=parseFloat(a.getAttribute("rx")),d=parseFloat(a.getAttribute("ry")),m=f.Resolution,h=_.map(_.range(m),function(a){var b=a/m*p;a=e*g(b);b=d*k(b);return new f.Anchor(a,b)},this),h=(new f.Polygon(h,!0,!0)).noStroke();h.translation.set(b,c);h.fill="black";return f.Utils.applySvgAttributes(a,h)},rect:function(a){var b=parseFloat(a.getAttribute("x")),c=parseFloat(a.getAttribute("y")),e=parseFloat(a.getAttribute("width")),d=parseFloat(a.getAttribute("height")),e=e/2,
d=d/2,m=[new f.Anchor(e,d),new f.Anchor(-e,d),new f.Anchor(-e,-d),new f.Anchor(e,-d)],m=(new f.Polygon(m,!0)).noStroke();m.translation.set(b+e,c+d);m.fill="black";return f.Utils.applySvgAttributes(a,m)},line:function(a){var b=parseFloat(a.getAttribute("x1")),c=parseFloat(a.getAttribute("y1")),e=parseFloat(a.getAttribute("x2")),d=parseFloat(a.getAttribute("y2")),e=(e-b)/2,d=(d-c)/2,m=[new f.Anchor(-e,-d),new f.Anchor(e,d)],m=(new f.Polygon(m)).noFill();m.translation.set(b+e,c+d);return f.Utils.applySvgAttributes(a,
m)}},subdivide:function(a,b,c,e,d,m,h,p,g){g=g||f.Utils.Curve.RecursionLimit;var t=g+1;return a===h&&b===p?[new f.Anchor(h,p)]:_.map(_.range(0,t),function(j){var g=j/t;j=y(g,a,c,d,h);g=y(g,b,e,m,p);return new f.Anchor(j,g)})},getPointOnCubicBezier:function(a,b,c,e,d){var f=1-a;return f*f*f*b+3*f*f*a*c+3*f*a*a*e+a*a*a*d},getCurveLength:function(a,b,e,d,m,h,p,g,t){if(a===e&&b===d&&m===p&&h===g)return a=p-a,b=g-b,c(a*a+b*b);var z=9*(e-m)+3*(p-a),j=6*(a+m)-12*e,v=3*(e-a),n=9*(d-h)+3*(g-b),r=6*(b+h)-12*
d,D=3*(d-b);return E(function(a){var b=(z*a+j)*a+v;a=(n*a+r)*a+D;return c(b*b+a*a)},0,1,t||f.Utils.Curve.RecursionLimit)},integrate:function(a,b,c,e){var d=f.Utils.Curve.abscissas[e-2],m=f.Utils.Curve.weights[e-2];c=0.5*(c-b);b=c+b;var h=0,p=e+1>>1;for(e=e&1?m[h++]*a(b):0;h<p;){var g=c*d[h];e+=m[h++]*(a(b+g)+a(b-g))}return c*e},getCurveFromPoints:function(a,b){for(var c=a.length,e=c-1,d=0;d<c;d++){var m=a[d];_.isObject(m.controls)||f.Anchor.AppendCurveProperties(m);var h=b?A(d-1,c):t(d-1,0),g=b?A(d+
1,c):z(d+1,e);x(a[h],m,a[g]);m._command=0===d?f.Commands.move:f.Commands.curve;m.controls.left.x=_.isNumber(m.controls.left.x)?m.controls.left.x:m.x;m.controls.left.y=_.isNumber(m.controls.left.y)?m.controls.left.y:m.y;m.controls.right.x=_.isNumber(m.controls.right.x)?m.controls.right.x:m.x;m.controls.right.y=_.isNumber(m.controls.right.y)?m.controls.right.y:m.y}},getControlPoints:function(b,c,e){var d=B(b,c),m=B(e,c);b=r(b,c);e=r(e,c);var p=(d+m)/2;c.u=_.isObject(c.controls.left)?c.controls.left:
new f.Vector(0,0);c.v=_.isObject(c.controls.right)?c.controls.right:new f.Vector(0,0);if(1E-4>b||1E-4>e)return c._relative||(c.controls.left.copy(c),c.controls.right.copy(c)),c;b*=0.33;e*=0.33;p=m<d?p+a:p-a;c.controls.left.x=g(p)*b;c.controls.left.y=k(p)*b;p-=h;c.controls.right.x=g(p)*e;c.controls.right.y=k(p)*e;c._relative||(c.controls.left.x+=c.x,c.controls.left.y+=c.y,c.controls.right.x+=c.x,c.controls.right.y+=c.y);return c},getReflection:function(a,b,c){return new f.Vector(2*a.x-(b.x+a.x)-(c?
a.x:0),2*a.y-(b.y+a.y)-(c?a.y:0))},angleBetween:function(a,c){var e,d;if(4<=arguments.length)return e=arguments[0]-arguments[2],d=arguments[1]-arguments[3],b(d,e);e=a.x-c.x;d=a.y-c.y;return b(d,e)},distanceBetweenSquared:function(a,b){var c=a.x-b.x,e=a.y-b.y;return c*c+e*e},distanceBetween:function(a,b){return c(u(a,b))},toFixed:function(a){return Math.floor(1E3*a)/1E3},mod:function(a,b){for(;0>a;)a+=b;return a%b},Collection:function(){Array.call(this);1<arguments.length?Array.prototype.push.apply(this,
arguments):arguments[0]&&Array.isArray(arguments[0])&&Array.prototype.push.apply(this,arguments[0])},Error:function(a){this.name="two.js";this.message=a}}});f.Utils.Error.prototype=Error();f.Utils.Error.prototype.constructor=f.Utils.Error;f.Utils.Collection.prototype=[];f.Utils.Collection.constructor=f.Utils.Collection;_.extend(f.Utils.Collection.prototype,Backbone.Events,{pop:function(){var a=Array.prototype.pop.apply(this,arguments);this.trigger(f.Events.remove,[a]);return a},shift:function(){var a=
Array.prototype.shift.apply(this,arguments);this.trigger(f.Events.remove,[a]);return a},push:function(){var a=Array.prototype.push.apply(this,arguments);this.trigger(f.Events.insert,arguments);return a},unshift:function(){var a=Array.prototype.unshift.apply(this,arguments);this.trigger(f.Events.insert,arguments);return a},splice:function(){var a=Array.prototype.splice.apply(this,arguments),b;this.trigger(f.Events.remove,a);2<arguments.length&&(b=this.slice(arguments[0],arguments.length-2),this.trigger(f.Events.insert,
b));return a}});var r=f.Utils.distanceBetween,u=f.Utils.distanceBetweenSquared,B=f.Utils.angleBetween,x=f.Utils.getControlPoints,A=f.Utils.mod,e=f.Utils.getBackingStoreRatio,y=f.Utils.getPointOnCubicBezier,E=f.Utils.integrate,C=f.Utils.getReflection;_.extend(f.prototype,Backbone.Events,{appendTo:function(a){a.appendChild(this.renderer.domElement);return this},play:function(){f.Utils.setPlaying.call(this,!0);return this.trigger(f.Events.play)},pause:function(){this.playing=!1;return this.trigger(f.Events.pause)},
update:function(){var a=!!this._lastFrame,b=(q.performance&&q.performance.now?q.performance:Date).now();this.frameCount++;a&&(this.timeDelta=parseFloat((b-this._lastFrame).toFixed(3)));this._lastFrame=b;var a=this.width,b=this.height,c=this.renderer;(a!==c.width||b!==c.height)&&c.setSize(a,b,this.ratio);this.trigger(f.Events.update,this.frameCount,this.timeDelta);return this.render()},render:function(){this.renderer.render();return this.trigger(f.Events.render,this.frameCount)},add:function(a){var b=
a;_.isArray(a)||(b=_.toArray(arguments));this.scene.add(b);return this},remove:function(a){var b=a;_.isArray(a)||(b=_.toArray(arguments));this.scene.remove(b);return this},clear:function(){this.scene.remove(_.toArray(this.scene.children));return this},makeLine:function(a,b,c,e){c=(c-a)/2;e=(e-b)/2;var d=[new f.Anchor(-c,-e),new f.Anchor(c,e)],d=(new f.Polygon(d)).noFill();d.translation.set(a+c,b+e);this.scene.add(d);return d},makeRectangle:function(a,b,c,e){c/=2;e/=2;e=[new f.Anchor(-c,-e),new f.Anchor(c,
-e),new f.Anchor(c,e),new f.Anchor(-c,e)];e=new f.Polygon(e,!0);e.translation.set(a,b);this.scene.add(e);return e},makeCircle:function(a,b,c){return this.makeEllipse(a,b,c,c)},makeEllipse:function(a,b,c,e){var d=f.Resolution,m=_.map(_.range(d),function(a){var b=a/d*p;a=c*g(b);b=e*k(b);return new f.Anchor(a,b)},this),m=new f.Polygon(m,!0,!0);m.translation.set(a,b);this.scene.add(m);return m},makeCurve:function(a){var b=arguments.length,c=a;if(!_.isArray(a))for(var c=[],e=0;e<b;e+=2){var d=arguments[e];
if(!_.isNumber(d))break;c.push(new f.Anchor(d,arguments[e+1]))}var b=arguments[b-1],c=new f.Polygon(c,!(_.isBoolean(b)&&b),!0),b=c.getBoundingClientRect(),m=b.left+b.width/2,h=b.top+b.height/2;_.each(c.vertices,function(a){a.x-=m;a.y-=h});c.translation.set(m,h);this.scene.add(c);return c},makePolygon:function(a){var b=arguments.length,c=a;if(!_.isArray(a))for(var c=[],e=0;e<b;e+=2){var d=arguments[e];if(!_.isNumber(d))break;c.push(new f.Anchor(d,arguments[e+1]))}b=arguments[b-1];c=new f.Polygon(c,
!(_.isBoolean(b)&&b));b=c.getBoundingClientRect();c.center().translation.set(b.left+b.width/2,b.top+b.height/2);this.scene.add(c);return c},makeGroup:function(a){var b=a;_.isArray(a)||(b=_.toArray(arguments));var c=new f.Group;this.scene.add(c);c.add(b);return c},interpret:function(a,b){var c=a.tagName.toLowerCase();if(!(c in f.Utils.read))return null;c=f.Utils.read[c].call(this,a);b&&c instanceof f.Group?this.add(_.values(c.children)):this.add(c);return c}});(function(){requestAnimationFrame(arguments.callee);
f.Instances.forEach(function(a){a.playing&&a.update()})})();"function"===typeof define&&define.amd?define(function(){return f}):"undefined"!=typeof module&&module.exports&&(module.exports=f)})();(function(d){var q=d.Vector=function(b,c){this.x=b||0;this.y=c||0};_.extend(q,{zero:new d.Vector});_.extend(q.prototype,Backbone.Events,{set:function(b,c){this.x=b;this.y=c;return this},copy:function(b){this.x=b.x;this.y=b.y;return this},clear:function(){this.y=this.x=0;return this},clone:function(){return new q(this.x,this.y)},add:function(b,c){this.x=b.x+c.x;this.y=b.y+c.y;return this},addSelf:function(b){this.x+=b.x;this.y+=b.y;return this},sub:function(b,c){this.x=b.x-c.x;this.y=b.y-c.y;return this},
subSelf:function(b){this.x-=b.x;this.y-=b.y;return this},multiplySelf:function(b){this.x*=b.x;this.y*=b.y;return this},multiplyScalar:function(b){this.x*=b;this.y*=b;return this},divideScalar:function(b){b?(this.x/=b,this.y/=b):this.set(0,0);return this},negate:function(){return this.multiplyScalar(-1)},dot:function(b){return this.x*b.x+this.y*b.y},lengthSquared:function(){return this.x*this.x+this.y*this.y},length:function(){return Math.sqrt(this.lengthSquared())},normalize:function(){return this.divideScalar(this.length())},
distanceTo:function(b){return Math.sqrt(this.distanceToSquared(b))},distanceToSquared:function(b){var c=this.x-b.x;b=this.y-b.y;return c*c+b*b},setLength:function(b){return this.normalize().multiplyScalar(b)},equals:function(b){return 1E-4>this.distanceTo(b)},lerp:function(b,c){return this.set((b.x-this.x)*c+this.x,(b.y-this.y)*c+this.y)},isZero:function(){return 1E-4>this.length()},toString:function(){return this.x+","+this.y},toObject:function(){return{x:this.x,y:this.y}}});var n={set:function(b,
c){this._x=b;this._y=c;return this.trigger(d.Events.change)},copy:function(b){this._x=b.x;this._y=b.y;return this.trigger(d.Events.change)},clear:function(){this._y=this._x=0;return this.trigger(d.Events.change)},clone:function(){return new q(this._x,this._y)},add:function(b,c){this._x=b.x+c.x;this._y=b.y+c.y;return this.trigger(d.Events.change)},addSelf:function(b){this._x+=b.x;this._y+=b.y;return this.trigger(d.Events.change)},sub:function(b,c){this._x=b.x-c.x;this._y=b.y-c.y;return this.trigger(d.Events.change)},
subSelf:function(b){this._x-=b.x;this._y-=b.y;return this.trigger(d.Events.change)},multiplySelf:function(b){this._x*=b.x;this._y*=b.y;return this.trigger(d.Events.change)},multiplyScalar:function(b){this._x*=b;this._y*=b;return this.trigger(d.Events.change)},divideScalar:function(b){return b?(this._x/=b,this._y/=b,this.trigger(d.Events.change)):this.clear()},negate:function(){return this.multiplyScalar(-1)},dot:function(b){return this._x*b.x+this._y*b.y},lengthSquared:function(){return this._x*this._x+
this._y*this._y},length:function(){return Math.sqrt(this.lengthSquared())},normalize:function(){return this.divideScalar(this.length())},distanceTo:function(b){return Math.sqrt(this.distanceToSquared(b))},distanceToSquared:function(b){var c=this._x-b.x;b=this._y-b.y;return c*c+b*b},setLength:function(b){return this.normalize().multiplyScalar(b)},equals:function(b){return 1E-4>this.distanceTo(b)},lerp:function(b,c){return this.set((b.x-this._x)*c+this._x,(b.y-this._y)*c+this._y)},isZero:function(){return 1E-4>
this.length()},toString:function(){return this._x+","+this._y},toObject:function(){return{x:this._x,y:this._y}}},k={get:function(){return this._x},set:function(b){this._x=b;this.trigger(d.Events.change,"x")}},g={get:function(){return this._y},set:function(b){this._y=b;this.trigger(d.Events.change,"y")}};d.Vector.prototype.bind=d.Vector.prototype.on=function(){this._bound||(this._x=this.x,this._y=this.y,Object.defineProperty(this,"x",k),Object.defineProperty(this,"y",g),_.extend(this,n),this._bound=
!0);Backbone.Events.bind.apply(this,arguments);return this}})(Two);(function(d){var q=d.Commands,n=d.Anchor=function(g,b,c,h,p,a,m){d.Vector.call(this,g,b);this._broadcast=_.bind(function(){this.trigger(d.Events.change)},this);this._command=m||q.move;this._relative=!0;if(!m)return this;n.AppendCurveProperties(this);_.isNumber(c)&&(this.controls.left.x=c);_.isNumber(h)&&(this.controls.left.y=h);_.isNumber(p)&&(this.controls.right.x=p);_.isNumber(a)&&(this.controls.right.y=a)};_.extend(n,{AppendCurveProperties:function(g){g.controls={left:new d.Vector(0,0),right:new d.Vector(0,
0)}}});var k={listen:function(){_.isObject(this.controls)||n.AppendCurveProperties(this);this.controls.left.bind(d.Events.change,this._broadcast);this.controls.right.bind(d.Events.change,this._broadcast);return this},ignore:function(){this.controls.left.unbind(d.Events.change,this._broadcast);this.controls.right.unbind(d.Events.change,this._broadcast);return this},clone:function(){var g=this.controls,g=new d.Anchor(this.x,this.y,g&&g.left.x,g&&g.left.y,g&&g.right.x,g&&g.right.y,this.command);g.relative=
this._relative;return g},toObject:function(){var d={x:this.x,y:this.y};this._command&&(d.command=this._command);this._relative&&(d.relative=this._relative);this.controls&&(d.controls={left:this.controls.left.toObject(),right:this.controls.right.toObject()});return d}};Object.defineProperty(n.prototype,"command",{get:function(){return this._command},set:function(g){this._command=g;this._command===q.curve&&!_.isObject(this.controls)&&n.AppendCurveProperties(this);return this.trigger(d.Events.change)}});
Object.defineProperty(n.prototype,"relative",{get:function(){return this._relative},set:function(g){if(this._relative==g)return this;this._relative=!!g;return this.trigger(d.Events.change)}});_.extend(n.prototype,d.Vector.prototype,k);d.Anchor.prototype.bind=d.Anchor.prototype.on=function(){d.Vector.prototype.bind.apply(this,arguments);_.extend(this,k)};d.Anchor.prototype.unbind=d.Anchor.prototype.off=function(){d.Vector.prototype.unbind.apply(this,arguments);_.extend(this,k)}})(Two);(function(d){var q=Math.cos,n=Math.sin,k=Math.tan,g=d.Matrix=function(b,c,h,p,a,m){this.elements=new d.Array(9);var g=b;_.isArray(g)||(g=_.toArray(arguments));this.identity().set(g)};_.extend(g,{Identity:[1,0,0,0,1,0,0,0,1],Multiply:function(b,c,h){if(3>=c.length){h=c[0]||0;var p=c[1]||0;c=c[2]||0;return{x:b[0]*h+b[1]*p+b[2]*c,y:b[3]*h+b[4]*p+b[5]*c,z:b[6]*h+b[7]*p+b[8]*c}}var p=b[0],a=b[1],m=b[2],g=b[3],t=b[4],v=b[5],n=b[6],f=b[7];b=b[8];var r=c[0],u=c[1],k=c[2],q=c[3],A=c[4],e=c[5],y=c[6],E=c[7];
c=c[8];h=h||new d.Array(9);h[0]=p*r+a*q+m*y;h[1]=p*u+a*A+m*E;h[2]=p*k+a*e+m*c;h[3]=g*r+t*q+v*y;h[4]=g*u+t*A+v*E;h[5]=g*k+t*e+v*c;h[6]=n*r+f*q+b*y;h[7]=n*u+f*A+b*E;h[8]=n*k+f*e+b*c;return h}});_.extend(g.prototype,Backbone.Events,{set:function(b){var c=b;_.isArray(c)||(c=_.toArray(arguments));_.extend(this.elements,c);return this.trigger(d.Events.change)},identity:function(){this.set(g.Identity);return this},multiply:function(b,c,h,p,a,m,g,t,v){var n=arguments,f=n.length;if(1>=f)return _.each(this.elements,
function(a,c){this.elements[c]=a*b},this),this.trigger(d.Events.change);if(3>=f)return b=b||0,c=c||0,h=h||0,a=this.elements,{x:a[0]*b+a[1]*c+a[2]*h,y:a[3]*b+a[4]*c+a[5]*h,z:a[6]*b+a[7]*c+a[8]*h};var r=this.elements,u=n,n=r[0],f=r[1],k=r[2],q=r[3],A=r[4],e=r[5],y=r[6],E=r[7],r=r[8],C=u[0],l=u[1],s=u[2],w=u[3],G=u[4],F=u[5],H=u[6],I=u[7],u=u[8];this.elements[0]=n*C+f*w+k*H;this.elements[1]=n*l+f*G+k*I;this.elements[2]=n*s+f*F+k*u;this.elements[3]=q*C+A*w+e*H;this.elements[4]=q*l+A*G+e*I;this.elements[5]=
q*s+A*F+e*u;this.elements[6]=y*C+E*w+r*H;this.elements[7]=y*l+E*G+r*I;this.elements[8]=y*s+E*F+r*u;return this.trigger(d.Events.change)},inverse:function(b){var c=this.elements;b=b||new d.Matrix;var h=c[0],p=c[1],a=c[2],m=c[3],g=c[4],t=c[5],v=c[6],n=c[7],c=c[8],f=c*g-t*n,r=-c*m+t*v,k=n*m-g*v,q=h*f+p*r+a*k;if(!q)return null;q=1/q;b.elements[0]=f*q;b.elements[1]=(-c*p+a*n)*q;b.elements[2]=(t*p-a*g)*q;b.elements[3]=r*q;b.elements[4]=(c*h-a*v)*q;b.elements[5]=(-t*h+a*m)*q;b.elements[6]=k*q;b.elements[7]=
(-n*h+p*v)*q;b.elements[8]=(g*h-p*m)*q;return b},scale:function(b,c){1>=arguments.length&&(c=b);return this.multiply(b,0,0,0,c,0,0,0,1)},rotate:function(b){var c=q(b);b=n(b);return this.multiply(c,-b,0,b,c,0,0,0,1)},translate:function(b,c){return this.multiply(1,0,b,0,1,c,0,0,1)},skewX:function(b){b=k(b);return this.multiply(1,b,0,0,1,0,0,0,1)},skewY:function(b){b=k(b);return this.multiply(1,0,0,b,1,0,0,0,1)},toString:function(b){var c=[];this.toArray(b,c);return c.join(" ")},toArray:function(b,c){var d=
this.elements,g=!!c,a=parseFloat(d[0].toFixed(3)),m=parseFloat(d[1].toFixed(3)),n=parseFloat(d[2].toFixed(3)),t=parseFloat(d[3].toFixed(3)),v=parseFloat(d[4].toFixed(3)),k=parseFloat(d[5].toFixed(3));if(b){var f=parseFloat(d[6].toFixed(3)),r=parseFloat(d[7].toFixed(3)),d=parseFloat(d[8].toFixed(3));if(g){c[0]=a;c[1]=t;c[2]=f;c[3]=m;c[4]=v;c[5]=r;c[6]=n;c[7]=k;c[8]=d;return}return[a,t,f,m,v,r,n,k,d]}if(g)c[0]=a,c[1]=t,c[2]=m,c[3]=v,c[4]=n,c[5]=k;else return[a,t,m,v,n,k]},clone:function(){return new d.Matrix(this.elements[0],
this.elements[1],this.elements[2],this.elements[3],this.elements[4],this.elements[5],this.elements[6],this.elements[7],this.elements[8])}})})(Two);(function(d){var q=d.Utils.mod,n=d.Utils.toFixed,k={version:1.1,ns:"http://www.w3.org/2000/svg",xlink:"http://www.w3.org/1999/xlink",createElement:function(b,c){var d=document.createElementNS(this.ns,b);"svg"===b&&(c=_.defaults(c||{},{version:this.version}));_.isObject(c)&&k.setAttributes(d,c);return d},setAttributes:function(b,c){for(var d in c)b.setAttribute(d,c[d]);return this},removeAttributes:function(b,c){for(var d in c)b.removeAttribute(d);return this},toString:function(b,c){for(var g=b.length,
p=g-1,a,m="",z=0;z<g;z++){var t=b[z],v,k=c?q(z-1,g):Math.max(z-1,0),f=c?q(z+1,g):Math.min(z+1,p);v=b[k];var r=b[f],u,B,x,k=n(t._x),r=n(t._y);switch(t._command){case d.Commands.close:v=d.Commands.close;break;case d.Commands.curve:u=v.controls&&v.controls.right||v;x=t.controls&&t.controls.left||t;v._relative?(f=n(u.x+v.x),u=n(u.y+v.y)):(f=n(u.x),u=n(u.y));t._relative?(B=n(x.x+t.x),x=n(x.y+t.y)):(B=n(x.x),x=n(x.y));v=(0===z?d.Commands.move:d.Commands.curve)+" "+f+" "+u+" "+B+" "+x+" "+k+" "+r;break;
case d.Commands.move:a=t;v=d.Commands.move+" "+k+" "+r;break;default:v=t._command+" "+k+" "+r}z>=p&&c&&(t._command===d.Commands.curve&&(r=a,u=t.controls&&t.controls.right||t,k=r.controls&&r.controls.left||r,t._relative?(f=n(u.x+t.x),u=n(u.y+t.y)):(f=n(u.x),u=n(u.y)),r._relative?(B=n(k.x+r.x),x=n(k.y+r.y)):(B=n(k.x),x=n(k.y)),k=n(r.x),r=n(r.y),v+=" C "+f+" "+u+" "+B+" "+x+" "+k+" "+r),v+=" Z");m+=v+" "}return m},getClip:function(b){clip=b._renderer.clip;if(!clip){for(root=b;root.parent;)root=root.parent;
clip=b._renderer.clip=k.createElement("clipPath");root.defs.appendChild(clip)}return clip},group:{appendChild:function(b){if(b=this.domElement.querySelector("#"+b)){var c=b.nodeName;c&&(c=c.replace(/svg\:/ig,"").toLowerCase(),/clippath/.test(c)||this.elem.appendChild(b))}},removeChild:function(b){if(b=this.domElement.querySelector("#"+b)){var c=b.nodeName;c&&(c=c.replace(/svg\:/ig,"").toLowerCase(),/clippath/.test(c)||this.elem.removeChild(b))}},renderChild:function(b){k[b._renderer.type].render.call(b,
this)},render:function(b){this._update();if(0===this._opacity&&!this._flagOpacity)return this;this._renderer.elem||(this._renderer.elem=k.createElement("g",{id:this.id}),b.appendChild(this._renderer.elem));var c={domElement:b,elem:this._renderer.elem};(this._matrix.manual||this._flagMatrix)&&this._renderer.elem.setAttribute("transform","matrix("+this._matrix.toString()+")");for(var d in this.children){var g=this.children[d];k[g._renderer.type].render.call(g,b)}this._flagOpacity&&this._renderer.elem.setAttribute("opacity",
this._opacity);this._flagAdditions&&_.each(this.additions,k.group.appendChild,c);this._flagSubtractions&&_.each(this.subtractions,k.group.removeChild,c);this._flagMask&&(this._mask?this._renderer.elem.setAttribute("clip-path","url(#"+this._mask.id+")"):this._renderer.elem.removeAttribute("clip-path"));return this.flagReset()}},polygon:{render:function(b){this._update();if(0===this._opacity&&!this._flagOpacity)return this;var c={};if(this._matrix.manual||this._flagMatrix)c.transform="matrix("+this._matrix.toString()+
")";if(this._flagVertices){var d=k.toString(this._vertices,this._closed);c.d=d}this._flagFill&&(c.fill=this._fill);this._flagStroke&&(c.stroke=this._stroke);this._flagLinewidth&&(c["stroke-width"]=this._linewidth);this._flagOpacity&&(c["stroke-opacity"]=this._opacity,c["fill-opacity"]=this._opacity);this._flagVisible&&(c.visibility=this._visible?"visible":"hidden");this._flagCap&&(c["stroke-linecap"]=this._cap);this._flagJoin&&(c["stroke-linejoin"]=this._join);this._flagMiter&&(c["stroke-miterlimit"]=
this.miter);this._renderer.elem?k.setAttributes(this._renderer.elem,c):(c.id=this.id,this._renderer.elem=k.createElement("path",c),b.appendChild(this._renderer.elem));this._flagClip&&(clip=k.getClip(this),elem=this._renderer.elem,this._clip?(elem.removeAttribute("id"),clip.setAttribute("id",this.id),clip.appendChild(elem)):(clip.removeAttribute("id"),elem.setAttribute("id",this.id),this.parent._renderer.elem.appendChild(elem)));return this.flagReset()}}},g=d[d.Types.svg]=function(b){this.domElement=
b.domElement||k.createElement("svg");this.scene=new d.Group;this.scene.parent=this;this.defs=k.createElement("defs");this.domElement.appendChild(this.defs)};_.extend(g,{Utils:k});_.extend(g.prototype,Backbone.Events,{setSize:function(b,c){this.width=b;this.height=c;k.setAttributes(this.domElement,{width:b,height:c});return this},render:function(){k.group.render.call(this.scene,this.domElement);return this}})})(Two);(function(d){var q=d.Utils.mod,n=d.Utils.toFixed,k=d.Utils.getRatio,g={group:{renderChild:function(b){g[b._renderer.type].render.call(b,this.ctx,!0,this.clip)},render:function(b){this._update();var d=this._matrix.elements,p=this.parent;this._renderer.opacity=this._opacity*(p&&p._renderer?p._renderer.opacity:1);p=this._mask;this._renderer.context||(this._renderer.context={});this._renderer.context.ctx=b;b.save();b.transform(d[0],d[3],d[1],d[4],d[2],d[5]);p&&g[p._renderer.type].render.call(p,b,!0);
_.each(this.children,g.group.renderChild,this._renderer.context);b.restore();return this.flagReset()}},polygon:{render:function(b,g,p){var a,m,z,t,v,k,f,r,u,B,x,A,e,y,E,C,l,s,w,G,F,H,I,J,L,M,j,K,N;this._update();a=this._matrix.elements;m=this._stroke;z=this._linewidth;t=this._fill;v=this._opacity*this.parent._renderer.opacity;k=this._visible;f=this._cap;r=this._join;u=this._miter;B=this._closed;x=this._vertices;A=x.length;e=A-1;N=this._clip;if(!g&&(!k||N))return this;b.save();a&&b.transform(a[0],
a[3],a[1],a[4],a[2],a[5]);t&&(b.fillStyle=t);m&&(b.strokeStyle=m);z&&(b.lineWidth=z);u&&(b.miterLimit=u);r&&(b.lineJoin=r);f&&(b.lineCap=f);_.isNumber(v)&&(b.globalAlpha=v);b.beginPath();x.forEach(function(a,m){j=n(a.x);K=n(a.y);switch(a._command){case d.Commands.close:b.closePath();break;case d.Commands.curve:E=B?q(m-1,A):Math.max(m-1,0);y=B?q(m+1,A):Math.min(m+1,e);C=x[E];l=x[y];I=C.controls&&C.controls.right||C;J=a.controls&&a.controls.left||a;C._relative?(F=I.x+n(C.x),H=I.y+n(C.y)):(F=n(I.x),
H=n(I.y));a._relative?(w=J.x+n(a.x),G=J.y+n(a.y)):(w=n(J.x),G=n(J.y));b.bezierCurveTo(F,H,w,G,j,K);m>=e&&B&&(l=s,L=a.controls&&a.controls.right||a,M=l.controls&&l.controls.left||l,a._relative?(F=L.x+n(a.x),H=L.y+n(a.y)):(F=n(L.x),H=n(L.y)),l._relative?(w=M.x+n(l.x),G=M.y+n(l.y)):(w=n(M.x),G=n(M.y)),j=n(l.x),K=n(l.y),b.bezierCurveTo(F,H,w,G,j,K));break;case d.Commands.line:b.lineTo(j,K);break;case d.Commands.move:s=a,b.moveTo(j,K)}});B&&b.closePath();!N&&!p&&(b.fill(),b.stroke());b.restore();N&&!p&&
b.clip();return this.flagReset()}}},b=d[d.Types.canvas]=function(b){this.domElement=b.domElement||document.createElement("canvas");this.ctx=this.domElement.getContext("2d");this.overdraw=b.overdraw||!1;this.scene=new d.Group;this.scene.parent=this};_.extend(b,{Utils:g});_.extend(b.prototype,Backbone.Events,{setSize:function(b,d,g){this.width=b;this.height=d;this.ratio=_.isUndefined(g)?k(this.ctx):g;this.domElement.width=b*this.ratio;this.domElement.height=d*this.ratio;_.extend(this.domElement.style,
{width:b+"px",height:d+"px"});return this},render:function(){var b=1===this.ratio;b||(this.ctx.save(),this.ctx.scale(this.ratio,this.ratio));this.overdraw||this.ctx.clearRect(0,0,this.width,this.height);g.group.render.call(this.scene,this.ctx);b||this.ctx.restore();return this}})})(Two);(function(d){var q=d.Matrix.Multiply,n=d.Utils.mod,k=[1,0,0,0,1,0,0,0,1],g=new d.Array(9),b=d.Utils.getRatio,c=d.Utils.toFixed,h={canvas:document.createElement("canvas"),uv:new d.Array([0,0,1,0,0,1,0,1,1,0,1,1]),group:{renderChild:function(a){h[a._renderer.type].render.call(a,this.gl,this.program)},render:function(a,b){this._update();var c=this.parent,p=c._matrix&&c._matrix.manual||c._flagMatrix,v=this._matrix.manual||this._flagMatrix;if(p||v)this._renderer.matrix||(this._renderer.matrix=new d.Array(9)),
this._matrix.toArray(!0,g),q(g,c._renderer.matrix,this._renderer.matrix),this._renderer.scale=this._scale*c._renderer.scale,p&&(this._flagMatrix=!0);this._mask&&(a.enable(a.STENCIL_TEST),a.stencilFunc(a.ALWAYS,1,1),a.colorMask(!1,!1,!1,!0),a.stencilOp(a.KEEP,a.KEEP,a.INCR),h[this._mask._renderer.type].render.call(this._mask,a,b,this),a.colorMask(!0,!0,!0,!0),a.stencilFunc(a.NOTEQUAL,0,1),a.stencilOp(a.KEEP,a.KEEP,a.KEEP));this._flagOpacity=c._flagOpacity||this._flagOpacity;this._renderer.opacity=
this._opacity*(c&&c._renderer?c._renderer.opacity:1);_.each(this.children,h.group.renderChild,{gl:a,program:b});this._mask&&(a.colorMask(!1,!1,!1,!1),a.stencilOp(a.KEEP,a.KEEP,a.DECR),h[this._mask._renderer.type].render.call(this._mask,a,b,this),a.colorMask(!0,!0,!0,!0),a.stencilFunc(a.NOTEQUAL,0,1),a.stencilOp(a.KEEP,a.KEEP,a.KEEP),a.disable(a.STENCIL_TEST));return this.flagReset()}},polygon:{render:function(a,b,c){if(!this._visible||!this._opacity)return this;var p=this.parent,v=p._matrix.manual||
p._flagMatrix,n=this._matrix.manual||this._flagMatrix,f=this._flagVertices||this._flagFill||this._flagStroke||this._flagLinewidth||this._flagOpacity||p._flagOpacity||this._flagVisible||this._flagCap||this._flagJoin||this._flagMiter||this._flagScale;this._update();if(v||n)this._renderer.matrix||(this._renderer.matrix=new d.Array(9)),this._matrix.toArray(!0,g),q(g,p._renderer.matrix,this._renderer.matrix),this._renderer.scale=this._scale*p._renderer.scale;f&&(this._renderer.rect||(this._renderer.rect=
{}),this._renderer.triangles||(this._renderer.triangles=new d.Array(12)),this._renderer.opacity=this._opacity*p._renderer.opacity,h.getBoundingClientRect(this._vertices,this._linewidth,this._renderer.rect),h.getTriangles(this._renderer.rect,this._renderer.triangles),h.updateBuffer(a,this,b),h.updateTexture(a,this));if(!this._clip||c)return a.bindBuffer(a.ARRAY_BUFFER,this._renderer.textureCoordsBuffer),a.vertexAttribPointer(b.textureCoords,2,a.FLOAT,!1,0,0),a.bindTexture(a.TEXTURE_2D,this._renderer.texture),
a.uniformMatrix3fv(b.matrix,!1,this._renderer.matrix),a.bindBuffer(a.ARRAY_BUFFER,this._renderer.buffer),a.vertexAttribPointer(b.position,2,a.FLOAT,!1,0,0),a.drawArrays(a.TRIANGLES,0,6),this.flagReset()}},getBoundingClientRect:function(a,b,c){var d=Infinity,g=-Infinity,p=Infinity,f=-Infinity;a.forEach(function(a){var b=a.x,c=a.y,m=a.controls,h,e;p=Math.min(c,p);d=Math.min(b,d);g=Math.max(b,g);f=Math.max(c,f);a.controls&&(h=m.left,e=m.right,h&&e&&(m=a._relative?h.x+b:h.x,h=a._relative?h.y+c:h.y,b=
a._relative?e.x+b:e.x,a=a._relative?e.y+c:e.y,m&&(h&&b&&a)&&(p=Math.min(h,a,p),d=Math.min(m,b,d),g=Math.max(m,b,g),f=Math.max(h,a,f))))});_.isNumber(b)&&(p-=b,d-=b,g+=b,f+=b);c.top=p;c.left=d;c.right=g;c.bottom=f;c.width=g-d;c.height=f-p;c.centroid||(c.centroid={});c.centroid.x=-d;c.centroid.y=-p},getTriangles:function(a,b){var c=a.top,d=a.left,g=a.right,p=a.bottom;b[0]=d;b[1]=c;b[2]=g;b[3]=c;b[4]=d;b[5]=p;b[6]=d;b[7]=p;b[8]=g;b[9]=c;b[10]=g;b[11]=p},updateCanvas:function(a){var b=a._vertices,g=this.canvas,
p=this.ctx,h=a._renderer.scale,k=a._stroke,f=a._linewidth*h,r=a._fill,q=a._renderer.opacity||a._opacity,B=a._cap,x=a._join,A=a._miter,e=a._closed,y=b.length,E=y-1;g.width=Math.max(Math.ceil(a._renderer.rect.width*h),1);g.height=Math.max(Math.ceil(a._renderer.rect.height*h),1);a=a._renderer.rect.centroid;var C=a.x*h,l=a.y*h;p.clearRect(0,0,g.width,g.height);r&&(p.fillStyle=r);k&&(p.strokeStyle=k);f&&(p.lineWidth=f);A&&(p.miterLimit=A);x&&(p.lineJoin=x);B&&(p.lineCap=B);_.isNumber(q)&&(p.globalAlpha=
q);var s;p.beginPath();b.forEach(function(a,f){var g,k,r,z,q,u;u=c(a.x*h+C);r=c(a.y*h+l);switch(a._command){case d.Commands.close:p.closePath();break;case d.Commands.curve:g=e?n(f-1,y):Math.max(f-1,0);e?n(f+1,y):Math.min(f+1,E);k=b[g];q=k.controls&&k.controls.right||k;z=a.controls&&a.controls.left||a;k._relative?(g=c((q.x+k.x)*h+C),q=c((q.y+k.y)*h+l)):(g=c(q.x*h+C),q=c(q.y*h+l));a._relative?(k=c((z.x+a.x)*h+C),z=c((z.y+a.y)*h+l)):(k=c(z.x*h+C),z=c(z.y*h+l));p.bezierCurveTo(g,q,k,z,u,r);f>=E&&e&&(r=
s,k=a.controls&&a.controls.right||a,u=r.controls&&r.controls.left||r,a._relative?(g=c((k.x+a.x)*h+C),q=c((k.y+a.y)*h+l)):(g=c(k.x*h+C),q=c(k.y*h+l)),r._relative?(k=c((u.x+r.x)*h+C),z=c((u.y+r.y)*h+l)):(k=c(u.x*h+C),z=c(u.y*h+l)),u=c(r.x*h+C),r=c(r.y*h+l),p.bezierCurveTo(g,q,k,z,u,r));break;case d.Commands.line:p.lineTo(u,r);break;case d.Commands.move:s=a,p.moveTo(u,r)}});e&&p.closePath();p.fill();p.stroke()},updateTexture:function(a,b){this.updateCanvas(b);b._renderer.texture&&a.deleteTexture(b._renderer.texture);
a.bindBuffer(a.ARRAY_BUFFER,b._renderer.textureCoordsBuffer);b._renderer.texture=a.createTexture();a.bindTexture(a.TEXTURE_2D,b._renderer.texture);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR);0>=this.canvas.width||0>=this.canvas.height||a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,this.canvas)},updateBuffer:function(a,b,c){_.isObject(b._renderer.buffer)&&
a.deleteBuffer(b._renderer.buffer);b._renderer.buffer=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,b._renderer.buffer);a.enableVertexAttribArray(c.position);a.bufferData(a.ARRAY_BUFFER,b._renderer.triangles,a.STATIC_DRAW);_.isObject(b._renderer.textureCoordsBuffer)&&a.deleteBuffer(b._renderer.textureCoordsBuffer);b._renderer.textureCoordsBuffer=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,b._renderer.textureCoordsBuffer);a.enableVertexAttribArray(c.textureCoords);a.bufferData(a.ARRAY_BUFFER,this.uv,
a.STATIC_DRAW)},program:{create:function(a,b){var c,g;c=a.createProgram();_.each(b,function(b){a.attachShader(c,b)});a.linkProgram(c);if(!a.getProgramParameter(c,a.LINK_STATUS))throw g=a.getProgramInfoLog(c),a.deleteProgram(c),new d.Utils.Error("unable to link program: "+g);return c}},shaders:{create:function(a,b,c){c=a.createShader(a[c]);a.shaderSource(c,b);a.compileShader(c);if(!a.getShaderParameter(c,a.COMPILE_STATUS))throw b=a.getShaderInfoLog(c),a.deleteShader(c),new d.Utils.Error("unable to compile shader "+
c+": "+b);return c},types:{vertex:"VERTEX_SHADER",fragment:"FRAGMENT_SHADER"},vertex:"attribute vec2 a_position;\nattribute vec2 a_textureCoords;\n\nuniform mat3 u_matrix;\nuniform vec2 u_resolution;\n\nvarying vec2 v_textureCoords;\n\nvoid main() {\n   vec2 projected = (u_matrix * vec3(a_position, 1.0)).xy;\n   vec2 normal = projected / u_resolution;\n   vec2 clipspace = (normal * 2.0) - 1.0;\n\n   gl_Position = vec4(clipspace * vec2(1.0, -1.0), 0.0, 1.0);\n   v_textureCoords = a_textureCoords;\n}",
fragment:"precision mediump float;\n\nuniform sampler2D u_image;\nvarying vec2 v_textureCoords;\n\nvoid main() {\n  gl_FragColor = texture2D(u_image, v_textureCoords);\n}"}};h.ctx=h.canvas.getContext("2d");var p=d[d.Types.webgl]=function(a){var b,c;this.domElement=a.domElement||document.createElement("canvas");this.scene=new d.Group;this.scene.parent=this;this._renderer={matrix:new d.Array(k),scale:1,opacity:1};this._flagMatrix=!0;a=_.defaults(a||{},{antialias:!1,alpha:!0,premultipliedAlpha:!0,stencil:!0,
preserveDrawingBuffer:!0,overdraw:!1});this.overdraw=a.overdraw;a=this.ctx=this.domElement.getContext("webgl",a)||this.domElement.getContext("experimental-webgl",a);if(!this.ctx)throw new d.Utils.Error("unable to create a webgl context. Try using another renderer.");b=h.shaders.create(a,h.shaders.vertex,h.shaders.types.vertex);c=h.shaders.create(a,h.shaders.fragment,h.shaders.types.fragment);this.program=h.program.create(a,[b,c]);a.useProgram(this.program);this.program.position=a.getAttribLocation(this.program,
"a_position");this.program.matrix=a.getUniformLocation(this.program,"u_matrix");this.program.textureCoords=a.getAttribLocation(this.program,"a_textureCoords");a.disable(a.DEPTH_TEST);a.enable(a.BLEND);a.blendEquationSeparate(a.FUNC_ADD,a.FUNC_ADD);a.blendFuncSeparate(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA)};_.extend(p.prototype,Backbone.Events,{setSize:function(a,c,d){this.width=a;this.height=c;this.ratio=_.isUndefined(d)?b(this.ctx):d;this.domElement.width=a*this.ratio;this.domElement.height=
c*this.ratio;_.extend(this.domElement.style,{width:a+"px",height:c+"px"});a*=this.ratio;c*=this.ratio;this._renderer.matrix[0]=this._renderer.matrix[4]=this._renderer.scale=this.ratio;this._flagMatrix=!0;this.ctx.viewport(0,0,a,c);d=this.ctx.getUniformLocation(this.program,"u_resolution");this.ctx.uniform2f(d,a,c);return this},render:function(){var a=this.ctx;this.overdraw||a.clear(a.COLOR_BUFFER_BIT|a.DEPTH_BUFFER_BIT);h.group.render.call(this.scene,a,this.program);this._flagMatrix=!1;return this}})})(Two);(function(d){var q=d.Shape=function(){this._renderer={};this.id=d.Identifier+d.uniqueId();this.classList=[];this._matrix=new d.Matrix;this.translation=new d.Vector;this.translation.bind(d.Events.change,_.bind(q.FlagMatrix,this));this.rotation=0;this.scale=1};_.extend(q,Backbone.Events,{FlagMatrix:function(){this._flagMatrix=!0},MakeObservable:function(d){Object.defineProperty(d,"rotation",{get:function(){return this._rotation},set:function(d){this._rotation=d;this._flagMatrix=!0}});Object.defineProperty(d,
"scale",{get:function(){return this._scale},set:function(d){this._scale=d;this._flagScale=this._flagMatrix=!0}})}});_.extend(q.prototype,{_flagMatrix:!0,_rotation:0,_scale:1,addTo:function(d){d.add(this);return this},clone:function(){var d=new q;d.translation.copy(this.translation);d.rotation=this.rotation;d.scale=this.scale;_.each(q.Properties,function(k){d[k]=this[k]},this);return d._update()},replaceParent:function(d){var k=this.id,g;this.parent&&(delete this.parent.children[k],g=_.indexOf(parent.additions,
k),0<=g&&this.parent.additions.splice(g,1),this.parent.subtractions.push(k),this._flagSubtractions=!0);d?(d.children[k]=this,this.parent=d,d.additions.push(k),d._flagAdditions=!0):delete this.parent;return this},_update:function(d){!this._matrix.manual&&this._flagMatrix&&this._matrix.identity().translate(this.translation.x,this.translation.y).scale(this.scale).rotate(this.rotation);d&&this.parent&&this.parent._update&&this.parent._update();return this},flagReset:function(){this._flagMatrix=this._flagScale=
!1;return this}});q.MakeObservable(q.prototype)})(Two);(function(d){function q(b,a,c){var g,h,k,n,f,r,q,B,x=a.controls&&a.controls.right,A=b.controls&&b.controls.left;g=a.x;f=a.y;h=(x||a).x;r=(x||a).y;k=(A||b).x;q=(A||b).y;n=b.x;B=b.y;x&&a._relative&&(h+=a.x,r+=a.y);A&&b._relative&&(k+=b.x,q+=b.y);return d.Utils.getCurveLength(g,f,h,r,k,q,n,B,c)}function n(b,a,c){var g,h,k,n,f,r,q,B,x=a.controls&&a.controls.right,A=b.controls&&b.controls.left;g=a.x;f=a.y;h=(x||a).x;r=(x||a).y;k=(A||b).x;q=(A||b).y;n=b.x;B=b.y;x&&a._relative&&(h+=a.x,r+=a.y);A&&b._relative&&
(k+=b.x,q+=b.y);return d.Utils.subdivide(g,f,h,r,k,q,n,B,c)}var k=Math.min,g=Math.max,b=Math.round,c=d.Utils.getComputedMatrix;_.each(d.Commands,function(){});var h=d.Polygon=function(b,a,c,g){d.Shape.call(this);this._renderer.type="polygon";this._closed=!!a;this._curved=!!c;this.beginning=0;this.ending=1;this.fill="#fff";this.stroke="#000";this.opacity=this.linewidth=1;this.visible=!0;this.cap="butt";this.join="miter";this.miter=4;this._vertices=[];this.vertices=b;this.automatic=!g};_.extend(h,{Properties:"fill stroke linewidth opacity visible cap join miter closed curved automatic beginning ending".split(" "),
FlagVertices:function(){this._flagLength=this._flagVertices=!0},MakeObservable:function(b){d.Shape.MakeObservable(b);_.each(h.Properties.slice(0,8),function(a){var c="_"+a,d="_flag"+a.charAt(0).toUpperCase()+a.slice(1);Object.defineProperty(b,a,{get:function(){return this[c]},set:function(a){this[c]=a;this[d]=!0}})});Object.defineProperty(b,"length",{get:function(){this._flagLength&&this._updateLength();return this._length}});Object.defineProperty(b,"closed",{get:function(){return this._closed},set:function(a){this._closed=
!!a;this._flagVertices=!0}});Object.defineProperty(b,"curved",{get:function(){return this._curved},set:function(a){this._curved=!!a;this._flagVertices=!0}});Object.defineProperty(b,"automatic",{get:function(){return this._automatic},set:function(a){if(a!==this._automatic){var b=(this._automatic=!!a)?"ignore":"listen";_.each(this.vertices,function(a){a[b]()})}}});Object.defineProperty(b,"beginning",{get:function(){return this._beginning},set:function(a){this._beginning=k(g(a,0),this._ending);this._flagVertices=
!0}});Object.defineProperty(b,"ending",{get:function(){return this._ending},set:function(a){this._ending=k(g(a,this._beginning),1);this._flagVertices=!0}});Object.defineProperty(b,"vertices",{get:function(){return this._collection},set:function(a){var b=_.bind(h.FlagVertices,this),c=_.bind(function(a){for(var c=a.length;c--;)a[c].bind(d.Events.change,b);b()},this),g=_.bind(function(a){_.each(a,function(a){a.unbind(d.Events.change,b)},this);b()},this);this._collection&&this._collection.unbind();this._collection=
new d.Utils.Collection(a.slice(0));this._collection.bind(d.Events.insert,c);this._collection.bind(d.Events.remove,g);c(this._collection)}});Object.defineProperty(b,"clip",{get:function(){return this._clip},set:function(a){this._clip=a;this._flagClip=!0}})}});_.extend(h.prototype,d.Shape.prototype,{_flagVertices:!0,_flagLength:!0,_flagFill:!0,_flagStroke:!0,_flagLinewidth:!0,_flagOpacity:!0,_flagVisible:!0,_flagCap:!0,_flagJoin:!0,_flagMiter:!0,_flagClip:!1,_length:0,_fill:"#fff",_stroke:"#000",_linewidth:1,
_opacity:1,_visible:!0,_cap:"round",_join:"round",_miter:4,_closed:!0,_curved:!1,_automatic:!0,_beginning:0,_ending:1,_clip:!1,clone:function(b){b=b||this.parent;var a=_.map(this.vertices,function(a){return a.clone()}),c=new h(a,this.closed,this.curved,!this.automatic);_.each(d.Shape.Properties,function(a){c[a]=this[a]},this);c.translation.copy(this.translation);c.rotation=this.rotation;c.scale=this.scale;b.add(c);return c},toObject:function(){var b={vertices:_.map(this.vertices,function(a){return a.toObject()})};
_.each(d.Shape.Properties,function(a){b[a]=this[a]},this);b.translation=this.translation.toObject;b.rotation=this.rotation;b.scale=this.scale;return b},noFill:function(){this.fill="transparent";return this},noStroke:function(){this.stroke="transparent";return this},corner:function(){var b=this.getBoundingClientRect(!0);b.centroid={x:b.left+b.width/2,y:b.top+b.height/2};_.each(this.vertices,function(a){a.addSelf(b.centroid)});return this},center:function(){var b=this.getBoundingClientRect(!0);b.centroid=
{x:b.left+b.width/2,y:b.top+b.height/2};_.each(this.vertices,function(a){a.subSelf(b.centroid)});return this},remove:function(){if(!this.parent)return this;this.parent.remove(this);return this},getBoundingClientRect:function(b){this._update(!0);var a=b?this._matrix:c(this),d=this.linewidth/2,h,n,q=Infinity,D=-Infinity,f=Infinity,r=-Infinity;_.each(this._vertices,function(b){h=b.x;n=b.y;b=a.multiply(h,n,1);f=k(b.y-d,f);q=k(b.x-d,q);D=g(b.x+d,D);r=g(b.y+d,r)});return{top:f,left:q,right:D,bottom:r,width:D-
q,height:r-f}},getPointAt:function(b,a){var c,g,h,k,n,f,q,u,B,x,A,e;q=this.length*Math.min(Math.max(b,0),1);u=this.vertices.length;B=u-1;f=c=null;x=0;g=this._lengths.length;for(h=0;x<g;x++){if(h+this._lengths[x]>q){c=this.vertices[this.closed?d.Utils.mod(x,u):x];f=this.vertices[Math.min(Math.max(x-1,0),B)];q-=h;b=q/this._lengths[x];break}h+=this._lengths[x]}if(_.isNull(c)||_.isNull(f))return null;e=f.controls&&f.controls.right;A=c.controls&&c.controls.left;g=f.x;q=f.y;h=(e||f).x;u=(e||f).y;k=(A||
c).x;B=(A||c).y;n=c.x;x=c.y;e&&f._relative&&(h+=f.x,u+=f.y);A&&c._relative&&(k+=c.x,B+=c.y);c=d.Utils.getPointOnCubicBezier(b,g,h,k,n);f=d.Utils.getPointOnCubicBezier(b,q,u,B,x);return _.isObject(a)?(a.x=c,a.y=f,a):new d.Vector(c,f)},plot:function(){if(this.curved)return d.Utils.getCurveFromPoints(this._vertices,this.closed),this;for(var b=0;b<this._vertices.length;b++)this._vertices[b]._command=0===b?d.Commands.move:d.Commands.line;return this},subdivide:function(b){this._update();var a=this.vertices.length-
1,c=this.vertices[a],g=this._closed||this.vertices[a]._command===d.Commands.close,h=[];_.each(this.vertices,function(k,q){if(!(0>=q)||g)if(k.command===d.Commands.move)h.push(new d.Anchor(c.x,c.y)),0<q&&(h[h.length-1].command=d.Commands.line);else{var f=n(k,c,b);h=h.concat(f);_.each(f,function(a,b){a.command=0>=b&&c.command===d.Commands.move?d.Commands.move:d.Commands.line});q>=a&&(this._closed&&this._automatic?(c=k,f=n(k,c,b),h=h.concat(f),_.each(f,function(a,b){a.command=0>=b&&c.command===d.Commands.move?
d.Commands.move:d.Commands.line})):g&&h.push(new d.Anchor(k.x,k.y)),h[h.length-1].command=g?d.Commands.close:d.Commands.line)}c=k},this);this._curved=this._automatic=!1;this.vertices=h;return this},_updateLength:function(b){this._update();var a=this.vertices.length-1,c=this.vertices[a],g=this._closed||this.vertices[a]._command===d.Commands.close,h=0;_.isUndefined(this._lengths)&&(this._lengths=[]);_.each(this.vertices,function(k,n){0>=n&&!g||k.command===d.Commands.move?(c=k,this._lengths[n]=0):(this._lengths[n]=
q(k,c,b),h+=this._lengths[n],n>=a&&g&&(c=k,this._lengths[n+1]=q(k,c,b),h+=this._lengths[n+1]),c=k)},this);this._length=h;return this},_update:function(){if(this._flagVertices){var c=this.vertices.length-1,a;a=b(this._beginning*c);c=b(this._ending*c);this._vertices.length=0;for(var g=a;g<c+1;g++)a=this.vertices[g],this._vertices.push(a);this._automatic&&this.plot()}d.Shape.prototype._update.call(this);return this},flagReset:function(){this._flagVertices=this._flagFill=this._flagStroke=this._flagLinewidth=
this._flagOpacity=this._flagVisible=this._flagCap=this._flagJoin=this._flagMiter=this._flagClip=!1;d.Shape.prototype.flagReset.call(this);return this}});h.MakeObservable(h.prototype)})(Two);(function(d){var q=Math.min,n=Math.max,k=d.Group=function(){d.Shape.call(this,!0);this._renderer.type="group";this.additions=[];this.subtractions=[];this.children={}};_.extend(k,{MakeObservable:function(g){var b=d.Polygon.Properties.slice(0),c=_.indexOf(b,"opacity");0<=c&&(b.splice(c,1),Object.defineProperty(g,"opacity",{get:function(){return this._opacity},set:function(b){this._opacity=b;this._flagOpacity=!0}}));d.Shape.MakeObservable(g);k.MakeGetterSetters(g,b);Object.defineProperty(g,"mask",{get:function(){return this._mask},
set:function(b){this._mask=b;this._flagMask=!0;b.clip||(b.clip=!0)}})},MakeGetterSetters:function(d,b){_.isArray(b)||(b=[b]);_.each(b,function(b){k.MakeGetterSetter(d,b)})},MakeGetterSetter:function(d,b){var c="_"+b;Object.defineProperty(d,b,{get:function(){return this[c]},set:function(d){this[c]=d;_.each(this.children,function(c){c[b]=d})}})}});_.extend(k.prototype,d.Shape.prototype,{_flagAdditions:!1,_flagSubtractions:!1,_flagOpacity:!0,_flagMask:!1,_fill:"#fff",_stroke:"#000",_linewidth:1,_opacity:1,
_visible:!0,_cap:"round",_join:"round",_miter:4,_closed:!0,_curved:!1,_automatic:!0,_beginning:0,_ending:1,_mask:null,clone:function(d){d=d||this.parent;var b=new k;d.add(b);_.map(this.children,function(c){return c.clone(b)});b.translation.copy(this.translation);b.rotation=this.rotation;b.scale=this.scale;return b},toObject:function(){var d={children:{},translation:this.translation.toObject(),rotation:this.rotation,scale:this.scale};_.each(this.children,function(b,c){d.children[c]=b.toObject()},this);
return d},corner:function(){var d=this.getBoundingClientRect(!0),b={x:d.left,y:d.top};_.each(this.children,function(c){c.translation.subSelf(b)});return this},center:function(){var d=this.getBoundingClientRect(!0);d.centroid={x:d.left+d.width/2,y:d.top+d.height/2};_.each(this.children,function(b){b.translation.subSelf(d.centroid)});return this},getById:function(d){var b=function(c,d){if(c.id===d)return c;for(var g in c.children){var a=b(c.children[g],d);if(a)return a}};return b(this,d)||null},getByClassName:function(d){var b=
[],c=function(d,g){-1!=d.classList.indexOf(g)&&b.push(d);for(var a in d.children)c(d.children[a],g);return b};return c(this,d)},getByType:function(g){var b=[],c=function(g,k){for(var a in g.children)g.children[a]instanceof k?b.push(g.children[a]):g.children[a]instanceof d.Group&&c(g.children[a],k);return b};return c(this,g)},add:function(d){var b=this.children,c=this.additions,h,k,a;_.isArray(d)||(d=_.toArray(arguments));_.each(d,function(d){d&&(h=d.id,k=d.parent,_.isUndefined(b[h])&&(k&&(delete k.children[h],
a=_.indexOf(k.additions,h),0<=a&&k.additions.splice(a,1)),b[h]=d,d.parent=this,c.push(h),this._flagAdditions=!0))},this);return this},remove:function(d){var b=this.children,c=this.parent,h=this.subtractions,k,a,m;if(0>=arguments.length&&c)return c.remove(this),this;_.isArray(d)||(d=_.toArray(arguments));_.each(d,function(c){k=c.id;a=c.parent;k in b&&(delete b[k],delete c.parent,m=_.indexOf(a.additions,k),0<=m&&a.additions.splice(m,1),h.push(k),this._flagSubtractions=!0)},this);return this},getBoundingClientRect:function(){var d;
this._update(!0);var b=Infinity,c=-Infinity,h=Infinity,k=-Infinity;_.each(this.children,function(a){d=a.getBoundingClientRect();_.isNumber(d.top)&&(_.isNumber(d.left)&&_.isNumber(d.right)&&_.isNumber(d.bottom))&&(h=q(d.top,h),b=q(d.left,b),c=n(d.right,c),k=n(d.bottom,k))},this);return{top:h,left:b,right:c,bottom:k,width:c-b,height:k-h}},noFill:function(){_.each(this.children,function(d){d.noFill()});return this},noStroke:function(){_.each(this.children,function(d){d.noStroke()});return this},subdivide:function(){var d=
arguments;_.each(this.children,function(b){b.subdivide.apply(b,d)});return this},flagReset:function(){this._flagAdditions&&(this.additions.length=0,this._flagAdditions=!1);this._flagSubtractions&&(this.subtractions.length=0,this._flagSubtractions=!1);this._flagMask=this._flagOpacity=!1;d.Shape.prototype.flagReset.call(this);return this}});k.MakeObservable(k.prototype)})(Two);

;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());

/*! Hammer.JS - v2.0.4 - 2014-09-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge]
 * @returns {Object} dest
 */
function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
function merge(dest, src) {
    return extend(dest, src, true);
}

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        extend(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument;
    return (doc.defaultView || doc.parentWindow);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = last.deltaX - input.deltaX;
        var deltaY = last.deltaY - input.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y > 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.allow = true; // used by Input.TouchMouse to disable mouse events
    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down, and mouse events are allowed (see the TouchMouse input)
        if (!this.pressed || !this.allow) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */
function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        // when we're in a touch event, so  block all upcoming mouse events
        // most mobile browser also emit mouseevents, right after touchstart
        if (isTouch) {
            this.mouse.allow = false;
        } else if (isMouse && !this.mouse.allow) {
            return;
        }

        // reset the allowMouse when we're done
        if (inputEvent & (INPUT_END | INPUT_CANCEL)) {
            this.mouse.allow = true;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        // not needed with native support for the touchAction property
        if (NATIVE_TOUCH_ACTION) {
            return;
        }

        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE);
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // pan-x and pan-y can be combined
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_PAN_X + ' ' + TOUCH_ACTION_PAN_Y;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.id = uniqueId();

    this.manager = null;
    this.options = merge(options || {}, this.defaults);

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        extend(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(withState) {
            self.manager.emit(self.options.event + (withState ? stateStr(state) : ''), input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(true);
        }

        emit(); // simple 'eventName' events

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(true);
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = extend({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {
        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        this._super.emit.call(this, input);
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            this.manager.emit(this.options.event + inOut, input);
        }
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 500, // minimal time of the pointer to be pressed
        threshold: 5 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.65,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.velocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.velocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.velocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.direction &&
            input.distance > this.options.threshold &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.direction);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 2, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED ) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create an manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.4';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, { enable: false }],
        [PinchRecognizer, { enable: false }, ['rotate']],
        [SwipeRecognizer,{ direction: DIRECTION_HORIZONTAL }],
        [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    options = options || {};

    this.options = merge(options, Hammer.defaults);
    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        extend(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        var recognizers = this.recognizers;
        recognizer = this.get(recognizer);
        recognizers.splice(inArray(recognizers, recognizer), 1);

        this.touchAction.update();
        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    each(manager.options.cssProps, function(value, name) {
        element.style[prefixed(element.style, name)] = add ? value : '';
    });
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

extend(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

if (typeof define == TYPE_FUNCTION && define.amd) {
    define(function() {
        return Hammer;
    });
} else if (typeof module != 'undefined' && module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');

/*!
 * VERSION: 1.15.0
 * DATE: 2014-12-03
 * UPDATES AND DOCS AT: http://www.greensock.com
 * 
 * Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, EasePack, CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";_gsScope._gsDefine("TweenMax",["core.Animation","core.SimpleTimeline","TweenLite"],function(t,e,i){var s=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i},r=function(t,e,s){i.call(this,t,e,s),this._cycle=0,this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._dirty=!0,this.render=r.prototype.render},n=1e-10,a=i._internals,o=a.isSelector,h=a.isArray,l=r.prototype=i.to({},.1,{}),_=[];r.version="1.15.0",l.constructor=r,l.kill()._gc=!1,r.killTweensOf=r.killDelayedCallsTo=i.killTweensOf,r.getTweensOf=i.getTweensOf,r.lagSmoothing=i.lagSmoothing,r.ticker=i.ticker,r.render=i.render,l.invalidate=function(){return this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._uncache(!0),i.prototype.invalidate.call(this)},l.updateTo=function(t,e){var s,r=this.ratio,n=this.vars.immediateRender||t.immediateRender;e&&this._startTime<this._timeline._time&&(this._startTime=this._timeline._time,this._uncache(!1),this._gc?this._enabled(!0,!1):this._timeline.insert(this,this._startTime-this._delay));for(s in t)this.vars[s]=t[s];if(this._initted||n)if(e)this._initted=!1,n&&this.render(0,!0,!0);else if(this._gc&&this._enabled(!0,!1),this._notifyPluginsOfEnabled&&this._firstPT&&i._onPluginEvent("_onDisable",this),this._time/this._duration>.998){var a=this._time;this.render(0,!0,!1),this._initted=!1,this.render(a,!0,!1)}else if(this._time>0||n){this._initted=!1,this._init();for(var o,h=1/(1-r),l=this._firstPT;l;)o=l.s+l.c,l.c*=h,l.s=o-l.c,l=l._next}return this},l.render=function(t,e,i){this._initted||0===this._duration&&this.vars.repeat&&this.invalidate();var s,r,o,h,l,u,p,c,f=this._dirty?this.totalDuration():this._totalDuration,m=this._time,d=this._totalTime,g=this._cycle,v=this._duration,y=this._rawPrevTime;if(t>=f?(this._totalTime=f,this._cycle=this._repeat,this._yoyo&&0!==(1&this._cycle)?(this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0):(this._time=v,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1),this._reversed||(s=!0,r="onComplete"),0===v&&(this._initted||!this.vars.lazy||i)&&(this._startTime===this._timeline._duration&&(t=0),(0===t||0>y||y===n)&&y!==t&&(i=!0,y>n&&(r="onReverseComplete")),this._rawPrevTime=c=!e||t||y===t?t:n)):1e-7>t?(this._totalTime=this._time=this._cycle=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==d||0===v&&y>0&&y!==n)&&(r="onReverseComplete",s=this._reversed),0>t&&(this._active=!1,0===v&&(this._initted||!this.vars.lazy||i)&&(y>=0&&(i=!0),this._rawPrevTime=c=!e||t||y===t?t:n)),this._initted||(i=!0)):(this._totalTime=this._time=t,0!==this._repeat&&(h=v+this._repeatDelay,this._cycle=this._totalTime/h>>0,0!==this._cycle&&this._cycle===this._totalTime/h&&this._cycle--,this._time=this._totalTime-this._cycle*h,this._yoyo&&0!==(1&this._cycle)&&(this._time=v-this._time),this._time>v?this._time=v:0>this._time&&(this._time=0)),this._easeType?(l=this._time/v,u=this._easeType,p=this._easePower,(1===u||3===u&&l>=.5)&&(l=1-l),3===u&&(l*=2),1===p?l*=l:2===p?l*=l*l:3===p?l*=l*l*l:4===p&&(l*=l*l*l*l),this.ratio=1===u?1-l:2===u?l:.5>this._time/v?l/2:1-l/2):this.ratio=this._ease.getRatio(this._time/v)),m===this._time&&!i&&g===this._cycle)return d!==this._totalTime&&this._onUpdate&&(e||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||_)),void 0;if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration))return this._time=m,this._totalTime=d,this._rawPrevTime=y,this._cycle=g,a.lazyTweens.push(this),this._lazy=[t,e],void 0;this._time&&!s?this.ratio=this._ease.getRatio(this._time/v):s&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(this._lazy!==!1&&(this._lazy=!1),this._active||!this._paused&&this._time!==m&&t>=0&&(this._active=!0),0===d&&(2===this._initted&&t>0&&this._init(),this._startAt&&(t>=0?this._startAt.render(t,e,i):r||(r="_dummyGS")),this.vars.onStart&&(0!==this._totalTime||0===v)&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||_))),o=this._firstPT;o;)o.f?o.t[o.p](o.c*this.ratio+o.s):o.t[o.p]=o.c*this.ratio+o.s,o=o._next;this._onUpdate&&(0>t&&this._startAt&&this._startTime&&this._startAt.render(t,e,i),e||(this._totalTime!==d||s)&&this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||_)),this._cycle!==g&&(e||this._gc||this.vars.onRepeat&&this.vars.onRepeat.apply(this.vars.onRepeatScope||this,this.vars.onRepeatParams||_)),r&&(!this._gc||i)&&(0>t&&this._startAt&&!this._onUpdate&&this._startTime&&this._startAt.render(t,e,i),s&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[r]&&this.vars[r].apply(this.vars[r+"Scope"]||this,this.vars[r+"Params"]||_),0===v&&this._rawPrevTime===n&&c!==n&&(this._rawPrevTime=0))},r.to=function(t,e,i){return new r(t,e,i)},r.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new r(t,e,i)},r.fromTo=function(t,e,i,s){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,new r(t,e,s)},r.staggerTo=r.allTo=function(t,e,n,a,l,u,p){a=a||0;var c,f,m,d,g=n.delay||0,v=[],y=function(){n.onComplete&&n.onComplete.apply(n.onCompleteScope||this,arguments),l.apply(p||this,u||_)};for(h(t)||("string"==typeof t&&(t=i.selector(t)||t),o(t)&&(t=s(t))),t=t||[],0>a&&(t=s(t),t.reverse(),a*=-1),c=t.length-1,m=0;c>=m;m++){f={};for(d in n)f[d]=n[d];f.delay=g,m===c&&l&&(f.onComplete=y),v[m]=new r(t[m],e,f),g+=a}return v},r.staggerFrom=r.allFrom=function(t,e,i,s,n,a,o){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,r.staggerTo(t,e,i,s,n,a,o)},r.staggerFromTo=r.allFromTo=function(t,e,i,s,n,a,o,h){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,r.staggerTo(t,e,s,n,a,o,h)},r.delayedCall=function(t,e,i,s,n){return new r(e,0,{delay:t,onComplete:e,onCompleteParams:i,onCompleteScope:s,onReverseComplete:e,onReverseCompleteParams:i,onReverseCompleteScope:s,immediateRender:!1,useFrames:n,overwrite:0})},r.set=function(t,e){return new r(t,0,e)},r.isTweening=function(t){return i.getTweensOf(t,!0).length>0};var u=function(t,e){for(var s=[],r=0,n=t._first;n;)n instanceof i?s[r++]=n:(e&&(s[r++]=n),s=s.concat(u(n,e)),r=s.length),n=n._next;return s},p=r.getAllTweens=function(e){return u(t._rootTimeline,e).concat(u(t._rootFramesTimeline,e))};r.killAll=function(t,i,s,r){null==i&&(i=!0),null==s&&(s=!0);var n,a,o,h=p(0!=r),l=h.length,_=i&&s&&r;for(o=0;l>o;o++)a=h[o],(_||a instanceof e||(n=a.target===a.vars.onComplete)&&s||i&&!n)&&(t?a.totalTime(a._reversed?0:a.totalDuration()):a._enabled(!1,!1))},r.killChildTweensOf=function(t,e){if(null!=t){var n,l,_,u,p,c=a.tweenLookup;if("string"==typeof t&&(t=i.selector(t)||t),o(t)&&(t=s(t)),h(t))for(u=t.length;--u>-1;)r.killChildTweensOf(t[u],e);else{n=[];for(_ in c)for(l=c[_].target.parentNode;l;)l===t&&(n=n.concat(c[_].tweens)),l=l.parentNode;for(p=n.length,u=0;p>u;u++)e&&n[u].totalTime(n[u].totalDuration()),n[u]._enabled(!1,!1)}}};var c=function(t,i,s,r){i=i!==!1,s=s!==!1,r=r!==!1;for(var n,a,o=p(r),h=i&&s&&r,l=o.length;--l>-1;)a=o[l],(h||a instanceof e||(n=a.target===a.vars.onComplete)&&s||i&&!n)&&a.paused(t)};return r.pauseAll=function(t,e,i){c(!0,t,e,i)},r.resumeAll=function(t,e,i){c(!1,t,e,i)},r.globalTimeScale=function(e){var s=t._rootTimeline,r=i.ticker.time;return arguments.length?(e=e||n,s._startTime=r-(r-s._startTime)*s._timeScale/e,s=t._rootFramesTimeline,r=i.ticker.frame,s._startTime=r-(r-s._startTime)*s._timeScale/e,s._timeScale=t._rootTimeline._timeScale=e,e):s._timeScale},l.progress=function(t){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!==(1&this._cycle)?1-t:t)+this._cycle*(this._duration+this._repeatDelay),!1):this._time/this.duration()},l.totalProgress=function(t){return arguments.length?this.totalTime(this.totalDuration()*t,!1):this._totalTime/this.totalDuration()},l.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),t>this._duration&&(t=this._duration),this._yoyo&&0!==(1&this._cycle)?t=this._duration-t+this._cycle*(this._duration+this._repeatDelay):0!==this._repeat&&(t+=this._cycle*(this._duration+this._repeatDelay)),this.totalTime(t,e)):this._time},l.duration=function(e){return arguments.length?t.prototype.duration.call(this,e):this._duration},l.totalDuration=function(t){return arguments.length?-1===this._repeat?this:this.duration((t-this._repeat*this._repeatDelay)/(this._repeat+1)):(this._dirty&&(this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat,this._dirty=!1),this._totalDuration)},l.repeat=function(t){return arguments.length?(this._repeat=t,this._uncache(!0)):this._repeat},l.repeatDelay=function(t){return arguments.length?(this._repeatDelay=t,this._uncache(!0)):this._repeatDelay},l.yoyo=function(t){return arguments.length?(this._yoyo=t,this):this._yoyo},r},!0),_gsScope._gsDefine("TimelineLite",["core.Animation","core.SimpleTimeline","TweenLite"],function(t,e,i){var s=function(t){e.call(this,t),this._labels={},this.autoRemoveChildren=this.vars.autoRemoveChildren===!0,this.smoothChildTiming=this.vars.smoothChildTiming===!0,this._sortChildren=!0,this._onUpdate=this.vars.onUpdate;var i,s,r=this.vars;for(s in r)i=r[s],o(i)&&-1!==i.join("").indexOf("{self}")&&(r[s]=this._swapSelfInParams(i));o(r.tweens)&&this.add(r.tweens,0,r.align,r.stagger)},r=1e-10,n=i._internals,a=n.isSelector,o=n.isArray,h=n.lazyTweens,l=n.lazyRender,_=[],u=_gsScope._gsDefine.globals,p=function(t){var e,i={};for(e in t)i[e]=t[e];return i},c=function(t,e,i,s){var r=t._timeline,n=r._totalTime;!e&&this._forcingPlayhead||r._rawPrevTime===t._startTime||(r.pause(t._startTime),e&&e.apply(s||r,i||_),this._forcingPlayhead&&r.seek(n))},f=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i},m=s.prototype=new e;return s.version="1.15.0",m.constructor=s,m.kill()._gc=m._forcingPlayhead=!1,m.to=function(t,e,s,r){var n=s.repeat&&u.TweenMax||i;return e?this.add(new n(t,e,s),r):this.set(t,s,r)},m.from=function(t,e,s,r){return this.add((s.repeat&&u.TweenMax||i).from(t,e,s),r)},m.fromTo=function(t,e,s,r,n){var a=r.repeat&&u.TweenMax||i;return e?this.add(a.fromTo(t,e,s,r),n):this.set(t,r,n)},m.staggerTo=function(t,e,r,n,o,h,l,_){var u,c=new s({onComplete:h,onCompleteParams:l,onCompleteScope:_,smoothChildTiming:this.smoothChildTiming});for("string"==typeof t&&(t=i.selector(t)||t),t=t||[],a(t)&&(t=f(t)),n=n||0,0>n&&(t=f(t),t.reverse(),n*=-1),u=0;t.length>u;u++)r.startAt&&(r.startAt=p(r.startAt)),c.to(t[u],e,p(r),u*n);return this.add(c,o)},m.staggerFrom=function(t,e,i,s,r,n,a,o){return i.immediateRender=0!=i.immediateRender,i.runBackwards=!0,this.staggerTo(t,e,i,s,r,n,a,o)},m.staggerFromTo=function(t,e,i,s,r,n,a,o,h){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,this.staggerTo(t,e,s,r,n,a,o,h)},m.call=function(t,e,s,r){return this.add(i.delayedCall(0,t,e,s),r)},m.set=function(t,e,s){return s=this._parseTimeOrLabel(s,0,!0),null==e.immediateRender&&(e.immediateRender=s===this._time&&!this._paused),this.add(new i(t,0,e),s)},s.exportRoot=function(t,e){t=t||{},null==t.smoothChildTiming&&(t.smoothChildTiming=!0);var r,n,a=new s(t),o=a._timeline;for(null==e&&(e=!0),o._remove(a,!0),a._startTime=0,a._rawPrevTime=a._time=a._totalTime=o._time,r=o._first;r;)n=r._next,e&&r instanceof i&&r.target===r.vars.onComplete||a.add(r,r._startTime-r._delay),r=n;return o.add(a,0),a},m.add=function(r,n,a,h){var l,_,u,p,c,f;if("number"!=typeof n&&(n=this._parseTimeOrLabel(n,0,!0,r)),!(r instanceof t)){if(r instanceof Array||r&&r.push&&o(r)){for(a=a||"normal",h=h||0,l=n,_=r.length,u=0;_>u;u++)o(p=r[u])&&(p=new s({tweens:p})),this.add(p,l),"string"!=typeof p&&"function"!=typeof p&&("sequence"===a?l=p._startTime+p.totalDuration()/p._timeScale:"start"===a&&(p._startTime-=p.delay())),l+=h;return this._uncache(!0)}if("string"==typeof r)return this.addLabel(r,n);if("function"!=typeof r)throw"Cannot add "+r+" into the timeline; it is not a tween, timeline, function, or string.";r=i.delayedCall(0,r)}if(e.prototype.add.call(this,r,n),(this._gc||this._time===this._duration)&&!this._paused&&this._duration<this.duration())for(c=this,f=c.rawTime()>r._startTime;c._timeline;)f&&c._timeline.smoothChildTiming?c.totalTime(c._totalTime,!0):c._gc&&c._enabled(!0,!1),c=c._timeline;return this},m.remove=function(e){if(e instanceof t)return this._remove(e,!1);if(e instanceof Array||e&&e.push&&o(e)){for(var i=e.length;--i>-1;)this.remove(e[i]);return this}return"string"==typeof e?this.removeLabel(e):this.kill(null,e)},m._remove=function(t,i){e.prototype._remove.call(this,t,i);var s=this._last;return s?this._time>s._startTime+s._totalDuration/s._timeScale&&(this._time=this.duration(),this._totalTime=this._totalDuration):this._time=this._totalTime=this._duration=this._totalDuration=0,this},m.append=function(t,e){return this.add(t,this._parseTimeOrLabel(null,e,!0,t))},m.insert=m.insertMultiple=function(t,e,i,s){return this.add(t,e||0,i,s)},m.appendMultiple=function(t,e,i,s){return this.add(t,this._parseTimeOrLabel(null,e,!0,t),i,s)},m.addLabel=function(t,e){return this._labels[t]=this._parseTimeOrLabel(e),this},m.addPause=function(t,e,s,r){var n=i.delayedCall(0,c,["{self}",e,s,r],this);return n.data="isPause",this.add(n,t)},m.removeLabel=function(t){return delete this._labels[t],this},m.getLabelTime=function(t){return null!=this._labels[t]?this._labels[t]:-1},m._parseTimeOrLabel=function(e,i,s,r){var n;if(r instanceof t&&r.timeline===this)this.remove(r);else if(r&&(r instanceof Array||r.push&&o(r)))for(n=r.length;--n>-1;)r[n]instanceof t&&r[n].timeline===this&&this.remove(r[n]);if("string"==typeof i)return this._parseTimeOrLabel(i,s&&"number"==typeof e&&null==this._labels[i]?e-this.duration():0,s);if(i=i||0,"string"!=typeof e||!isNaN(e)&&null==this._labels[e])null==e&&(e=this.duration());else{if(n=e.indexOf("="),-1===n)return null==this._labels[e]?s?this._labels[e]=this.duration()+i:i:this._labels[e]+i;i=parseInt(e.charAt(n-1)+"1",10)*Number(e.substr(n+1)),e=n>1?this._parseTimeOrLabel(e.substr(0,n-1),0,s):this.duration()}return Number(e)+i},m.seek=function(t,e){return this.totalTime("number"==typeof t?t:this._parseTimeOrLabel(t),e!==!1)},m.stop=function(){return this.paused(!0)},m.gotoAndPlay=function(t,e){return this.play(t,e)},m.gotoAndStop=function(t,e){return this.pause(t,e)},m.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,n,a,o,u,p=this._dirty?this.totalDuration():this._totalDuration,c=this._time,f=this._startTime,m=this._timeScale,d=this._paused;if(t>=p?(this._totalTime=this._time=p,this._reversed||this._hasPausedChild()||(n=!0,o="onComplete",0===this._duration&&(0===t||0>this._rawPrevTime||this._rawPrevTime===r)&&this._rawPrevTime!==t&&this._first&&(u=!0,this._rawPrevTime>r&&(o="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,t=p+1e-4):1e-7>t?(this._totalTime=this._time=0,(0!==c||0===this._duration&&this._rawPrevTime!==r&&(this._rawPrevTime>0||0>t&&this._rawPrevTime>=0))&&(o="onReverseComplete",n=this._reversed),0>t?(this._active=!1,this._rawPrevTime>=0&&this._first&&(u=!0),this._rawPrevTime=t):(this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,t=0,this._initted||(u=!0))):this._totalTime=this._time=this._rawPrevTime=t,this._time!==c&&this._first||i||u){if(this._initted||(this._initted=!0),this._active||!this._paused&&this._time!==c&&t>0&&(this._active=!0),0===c&&this.vars.onStart&&0!==this._time&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||_)),this._time>=c)for(s=this._first;s&&(a=s._next,!this._paused||d);)(s._active||s._startTime<=this._time&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;else for(s=this._last;s&&(a=s._prev,!this._paused||d);)(s._active||c>=s._startTime&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;this._onUpdate&&(e||(h.length&&l(),this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||_))),o&&(this._gc||(f===this._startTime||m!==this._timeScale)&&(0===this._time||p>=this.totalDuration())&&(n&&(h.length&&l(),this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[o]&&this.vars[o].apply(this.vars[o+"Scope"]||this,this.vars[o+"Params"]||_)))}},m._hasPausedChild=function(){for(var t=this._first;t;){if(t._paused||t instanceof s&&t._hasPausedChild())return!0;t=t._next}return!1},m.getChildren=function(t,e,s,r){r=r||-9999999999;for(var n=[],a=this._first,o=0;a;)r>a._startTime||(a instanceof i?e!==!1&&(n[o++]=a):(s!==!1&&(n[o++]=a),t!==!1&&(n=n.concat(a.getChildren(!0,e,s)),o=n.length))),a=a._next;return n},m.getTweensOf=function(t,e){var s,r,n=this._gc,a=[],o=0;for(n&&this._enabled(!0,!0),s=i.getTweensOf(t),r=s.length;--r>-1;)(s[r].timeline===this||e&&this._contains(s[r]))&&(a[o++]=s[r]);return n&&this._enabled(!1,!0),a},m.recent=function(){return this._recent},m._contains=function(t){for(var e=t.timeline;e;){if(e===this)return!0;e=e.timeline}return!1},m.shiftChildren=function(t,e,i){i=i||0;for(var s,r=this._first,n=this._labels;r;)r._startTime>=i&&(r._startTime+=t),r=r._next;if(e)for(s in n)n[s]>=i&&(n[s]+=t);return this._uncache(!0)},m._kill=function(t,e){if(!t&&!e)return this._enabled(!1,!1);for(var i=e?this.getTweensOf(e):this.getChildren(!0,!0,!1),s=i.length,r=!1;--s>-1;)i[s]._kill(t,e)&&(r=!0);return r},m.clear=function(t){var e=this.getChildren(!1,!0,!0),i=e.length;for(this._time=this._totalTime=0;--i>-1;)e[i]._enabled(!1,!1);return t!==!1&&(this._labels={}),this._uncache(!0)},m.invalidate=function(){for(var e=this._first;e;)e.invalidate(),e=e._next;return t.prototype.invalidate.call(this)},m._enabled=function(t,i){if(t===this._gc)for(var s=this._first;s;)s._enabled(t,!0),s=s._next;return e.prototype._enabled.call(this,t,i)},m.totalTime=function(){this._forcingPlayhead=!0;var e=t.prototype.totalTime.apply(this,arguments);return this._forcingPlayhead=!1,e},m.duration=function(t){return arguments.length?(0!==this.duration()&&0!==t&&this.timeScale(this._duration/t),this):(this._dirty&&this.totalDuration(),this._duration)},m.totalDuration=function(t){if(!arguments.length){if(this._dirty){for(var e,i,s=0,r=this._last,n=999999999999;r;)e=r._prev,r._dirty&&r.totalDuration(),r._startTime>n&&this._sortChildren&&!r._paused?this.add(r,r._startTime-r._delay):n=r._startTime,0>r._startTime&&!r._paused&&(s-=r._startTime,this._timeline.smoothChildTiming&&(this._startTime+=r._startTime/this._timeScale),this.shiftChildren(-r._startTime,!1,-9999999999),n=0),i=r._startTime+r._totalDuration/r._timeScale,i>s&&(s=i),r=e;this._duration=this._totalDuration=s,this._dirty=!1}return this._totalDuration}return 0!==this.totalDuration()&&0!==t&&this.timeScale(this._totalDuration/t),this},m.usesFrames=function(){for(var e=this._timeline;e._timeline;)e=e._timeline;return e===t._rootFramesTimeline},m.rawTime=function(){return this._paused?this._totalTime:(this._timeline.rawTime()-this._startTime)*this._timeScale},s},!0),_gsScope._gsDefine("TimelineMax",["TimelineLite","TweenLite","easing.Ease"],function(t,e,i){var s=function(e){t.call(this,e),this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._cycle=0,this._yoyo=this.vars.yoyo===!0,this._dirty=!0},r=1e-10,n=[],a=e._internals,o=a.lazyTweens,h=a.lazyRender,l=new i(null,null,1,0),_=s.prototype=new t;return _.constructor=s,_.kill()._gc=!1,s.version="1.15.0",_.invalidate=function(){return this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._uncache(!0),t.prototype.invalidate.call(this)},_.addCallback=function(t,i,s,r){return this.add(e.delayedCall(0,t,s,r),i)},_.removeCallback=function(t,e){if(t)if(null==e)this._kill(null,t);else for(var i=this.getTweensOf(t,!1),s=i.length,r=this._parseTimeOrLabel(e);--s>-1;)i[s]._startTime===r&&i[s]._enabled(!1,!1);return this},_.tweenTo=function(t,i){i=i||{};var s,r,a,o={ease:l,overwrite:i.delay?2:1,useFrames:this.usesFrames(),immediateRender:!1};for(r in i)o[r]=i[r];return o.time=this._parseTimeOrLabel(t),s=Math.abs(Number(o.time)-this._time)/this._timeScale||.001,a=new e(this,s,o),o.onStart=function(){a.target.paused(!0),a.vars.time!==a.target.time()&&s===a.duration()&&a.duration(Math.abs(a.vars.time-a.target.time())/a.target._timeScale),i.onStart&&i.onStart.apply(i.onStartScope||a,i.onStartParams||n)},a},_.tweenFromTo=function(t,e,i){i=i||{},t=this._parseTimeOrLabel(t),i.startAt={onComplete:this.seek,onCompleteParams:[t],onCompleteScope:this},i.immediateRender=i.immediateRender!==!1;var s=this.tweenTo(e,i);return s.duration(Math.abs(s.vars.time-t)/this._timeScale||.001)},_.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,a,l,_,u,p,c=this._dirty?this.totalDuration():this._totalDuration,f=this._duration,m=this._time,d=this._totalTime,g=this._startTime,v=this._timeScale,y=this._rawPrevTime,T=this._paused,w=this._cycle;if(t>=c?(this._locked||(this._totalTime=c,this._cycle=this._repeat),this._reversed||this._hasPausedChild()||(a=!0,_="onComplete",0===this._duration&&(0===t||0>y||y===r)&&y!==t&&this._first&&(u=!0,y>r&&(_="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,this._yoyo&&0!==(1&this._cycle)?this._time=t=0:(this._time=f,t=f+1e-4)):1e-7>t?(this._locked||(this._totalTime=this._cycle=0),this._time=0,(0!==m||0===f&&y!==r&&(y>0||0>t&&y>=0)&&!this._locked)&&(_="onReverseComplete",a=this._reversed),0>t?(this._active=!1,y>=0&&this._first&&(u=!0),this._rawPrevTime=t):(this._rawPrevTime=f||!e||t||this._rawPrevTime===t?t:r,t=0,this._initted||(u=!0))):(0===f&&0>y&&(u=!0),this._time=this._rawPrevTime=t,this._locked||(this._totalTime=t,0!==this._repeat&&(p=f+this._repeatDelay,this._cycle=this._totalTime/p>>0,0!==this._cycle&&this._cycle===this._totalTime/p&&this._cycle--,this._time=this._totalTime-this._cycle*p,this._yoyo&&0!==(1&this._cycle)&&(this._time=f-this._time),this._time>f?(this._time=f,t=f+1e-4):0>this._time?this._time=t=0:t=this._time))),this._cycle!==w&&!this._locked){var x=this._yoyo&&0!==(1&w),b=x===(this._yoyo&&0!==(1&this._cycle)),P=this._totalTime,S=this._cycle,k=this._rawPrevTime,R=this._time;if(this._totalTime=w*f,w>this._cycle?x=!x:this._totalTime+=f,this._time=m,this._rawPrevTime=0===f?y-1e-4:y,this._cycle=w,this._locked=!0,m=x?0:f,this.render(m,e,0===f),e||this._gc||this.vars.onRepeat&&this.vars.onRepeat.apply(this.vars.onRepeatScope||this,this.vars.onRepeatParams||n),b&&(m=x?f+1e-4:-1e-4,this.render(m,!0,!1)),this._locked=!1,this._paused&&!T)return;this._time=R,this._totalTime=P,this._cycle=S,this._rawPrevTime=k}if(!(this._time!==m&&this._first||i||u))return d!==this._totalTime&&this._onUpdate&&(e||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||n)),void 0;if(this._initted||(this._initted=!0),this._active||!this._paused&&this._totalTime!==d&&t>0&&(this._active=!0),0===d&&this.vars.onStart&&0!==this._totalTime&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||n)),this._time>=m)for(s=this._first;s&&(l=s._next,!this._paused||T);)(s._active||s._startTime<=this._time&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=l;else for(s=this._last;s&&(l=s._prev,!this._paused||T);)(s._active||m>=s._startTime&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=l;this._onUpdate&&(e||(o.length&&h(),this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||n))),_&&(this._locked||this._gc||(g===this._startTime||v!==this._timeScale)&&(0===this._time||c>=this.totalDuration())&&(a&&(o.length&&h(),this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[_]&&this.vars[_].apply(this.vars[_+"Scope"]||this,this.vars[_+"Params"]||n)))},_.getActive=function(t,e,i){null==t&&(t=!0),null==e&&(e=!0),null==i&&(i=!1);var s,r,n=[],a=this.getChildren(t,e,i),o=0,h=a.length;for(s=0;h>s;s++)r=a[s],r.isActive()&&(n[o++]=r);return n},_.getLabelAfter=function(t){t||0!==t&&(t=this._time);var e,i=this.getLabelsArray(),s=i.length;for(e=0;s>e;e++)if(i[e].time>t)return i[e].name;return null},_.getLabelBefore=function(t){null==t&&(t=this._time);for(var e=this.getLabelsArray(),i=e.length;--i>-1;)if(t>e[i].time)return e[i].name;return null},_.getLabelsArray=function(){var t,e=[],i=0;for(t in this._labels)e[i++]={time:this._labels[t],name:t};return e.sort(function(t,e){return t.time-e.time}),e},_.progress=function(t,e){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!==(1&this._cycle)?1-t:t)+this._cycle*(this._duration+this._repeatDelay),e):this._time/this.duration()},_.totalProgress=function(t,e){return arguments.length?this.totalTime(this.totalDuration()*t,e):this._totalTime/this.totalDuration()},_.totalDuration=function(e){return arguments.length?-1===this._repeat?this:this.duration((e-this._repeat*this._repeatDelay)/(this._repeat+1)):(this._dirty&&(t.prototype.totalDuration.call(this),this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat),this._totalDuration)},_.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),t>this._duration&&(t=this._duration),this._yoyo&&0!==(1&this._cycle)?t=this._duration-t+this._cycle*(this._duration+this._repeatDelay):0!==this._repeat&&(t+=this._cycle*(this._duration+this._repeatDelay)),this.totalTime(t,e)):this._time},_.repeat=function(t){return arguments.length?(this._repeat=t,this._uncache(!0)):this._repeat},_.repeatDelay=function(t){return arguments.length?(this._repeatDelay=t,this._uncache(!0)):this._repeatDelay},_.yoyo=function(t){return arguments.length?(this._yoyo=t,this):this._yoyo},_.currentLabel=function(t){return arguments.length?this.seek(t,!0):this.getLabelBefore(this._time+1e-8)},s},!0),function(){var t=180/Math.PI,e=[],i=[],s=[],r={},n=_gsScope._gsDefine.globals,a=function(t,e,i,s){this.a=t,this.b=e,this.c=i,this.d=s,this.da=s-t,this.ca=i-t,this.ba=e-t},o=",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",h=function(t,e,i,s){var r={a:t},n={},a={},o={c:s},h=(t+e)/2,l=(e+i)/2,_=(i+s)/2,u=(h+l)/2,p=(l+_)/2,c=(p-u)/8;return r.b=h+(t-h)/4,n.b=u+c,r.c=n.a=(r.b+n.b)/2,n.c=a.a=(u+p)/2,a.b=p-c,o.b=_+(s-_)/4,a.c=o.a=(a.b+o.b)/2,[r,n,a,o]},l=function(t,r,n,a,o){var l,_,u,p,c,f,m,d,g,v,y,T,w,x=t.length-1,b=0,P=t[0].a;for(l=0;x>l;l++)c=t[b],_=c.a,u=c.d,p=t[b+1].d,o?(y=e[l],T=i[l],w=.25*(T+y)*r/(a?.5:s[l]||.5),f=u-(u-_)*(a?.5*r:0!==y?w/y:0),m=u+(p-u)*(a?.5*r:0!==T?w/T:0),d=u-(f+((m-f)*(3*y/(y+T)+.5)/4||0))):(f=u-.5*(u-_)*r,m=u+.5*(p-u)*r,d=u-(f+m)/2),f+=d,m+=d,c.c=g=f,c.b=0!==l?P:P=c.a+.6*(c.c-c.a),c.da=u-_,c.ca=g-_,c.ba=P-_,n?(v=h(_,P,g,u),t.splice(b,1,v[0],v[1],v[2],v[3]),b+=4):b++,P=m;c=t[b],c.b=P,c.c=P+.4*(c.d-P),c.da=c.d-c.a,c.ca=c.c-c.a,c.ba=P-c.a,n&&(v=h(c.a,P,c.c,c.d),t.splice(b,1,v[0],v[1],v[2],v[3]))},_=function(t,s,r,n){var o,h,l,_,u,p,c=[];if(n)for(t=[n].concat(t),h=t.length;--h>-1;)"string"==typeof(p=t[h][s])&&"="===p.charAt(1)&&(t[h][s]=n[s]+Number(p.charAt(0)+p.substr(2)));if(o=t.length-2,0>o)return c[0]=new a(t[0][s],0,0,t[-1>o?0:1][s]),c;for(h=0;o>h;h++)l=t[h][s],_=t[h+1][s],c[h]=new a(l,0,0,_),r&&(u=t[h+2][s],e[h]=(e[h]||0)+(_-l)*(_-l),i[h]=(i[h]||0)+(u-_)*(u-_));return c[h]=new a(t[h][s],0,0,t[h+1][s]),c},u=function(t,n,a,h,u,p){var c,f,m,d,g,v,y,T,w={},x=[],b=p||t[0];u="string"==typeof u?","+u+",":o,null==n&&(n=1);for(f in t[0])x.push(f);if(t.length>1){for(T=t[t.length-1],y=!0,c=x.length;--c>-1;)if(f=x[c],Math.abs(b[f]-T[f])>.05){y=!1;break}y&&(t=t.concat(),p&&t.unshift(p),t.push(t[1]),p=t[t.length-3])}for(e.length=i.length=s.length=0,c=x.length;--c>-1;)f=x[c],r[f]=-1!==u.indexOf(","+f+","),w[f]=_(t,f,r[f],p);for(c=e.length;--c>-1;)e[c]=Math.sqrt(e[c]),i[c]=Math.sqrt(i[c]);if(!h){for(c=x.length;--c>-1;)if(r[f])for(m=w[x[c]],v=m.length-1,d=0;v>d;d++)g=m[d+1].da/i[d]+m[d].da/e[d],s[d]=(s[d]||0)+g*g;for(c=s.length;--c>-1;)s[c]=Math.sqrt(s[c])}for(c=x.length,d=a?4:1;--c>-1;)f=x[c],m=w[f],l(m,n,a,h,r[f]),y&&(m.splice(0,d),m.splice(m.length-d,d));return w},p=function(t,e,i){e=e||"soft";var s,r,n,o,h,l,_,u,p,c,f,m={},d="cubic"===e?3:2,g="soft"===e,v=[];if(g&&i&&(t=[i].concat(t)),null==t||d+1>t.length)throw"invalid Bezier data";for(p in t[0])v.push(p);for(l=v.length;--l>-1;){for(p=v[l],m[p]=h=[],c=0,u=t.length,_=0;u>_;_++)s=null==i?t[_][p]:"string"==typeof(f=t[_][p])&&"="===f.charAt(1)?i[p]+Number(f.charAt(0)+f.substr(2)):Number(f),g&&_>1&&u-1>_&&(h[c++]=(s+h[c-2])/2),h[c++]=s;for(u=c-d+1,c=0,_=0;u>_;_+=d)s=h[_],r=h[_+1],n=h[_+2],o=2===d?0:h[_+3],h[c++]=f=3===d?new a(s,r,n,o):new a(s,(2*r+s)/3,(2*r+n)/3,n);h.length=c}return m},c=function(t,e,i){for(var s,r,n,a,o,h,l,_,u,p,c,f=1/i,m=t.length;--m>-1;)for(p=t[m],n=p.a,a=p.d-n,o=p.c-n,h=p.b-n,s=r=0,_=1;i>=_;_++)l=f*_,u=1-l,s=r-(r=(l*l*a+3*u*(l*o+u*h))*l),c=m*i+_-1,e[c]=(e[c]||0)+s*s},f=function(t,e){e=e>>0||6;var i,s,r,n,a=[],o=[],h=0,l=0,_=e-1,u=[],p=[];for(i in t)c(t[i],a,e);for(r=a.length,s=0;r>s;s++)h+=Math.sqrt(a[s]),n=s%e,p[n]=h,n===_&&(l+=h,n=s/e>>0,u[n]=p,o[n]=l,h=0,p=[]);return{length:l,lengths:o,segments:u}},m=_gsScope._gsDefine.plugin({propName:"bezier",priority:-1,version:"1.3.4",API:2,global:!0,init:function(t,e,i){this._target=t,e instanceof Array&&(e={values:e}),this._func={},this._round={},this._props=[],this._timeRes=null==e.timeResolution?6:parseInt(e.timeResolution,10);var s,r,n,a,o,h=e.values||[],l={},_=h[0],c=e.autoRotate||i.vars.orientToBezier;this._autoRotate=c?c instanceof Array?c:[["x","y","rotation",c===!0?0:Number(c)||0]]:null;for(s in _)this._props.push(s);for(n=this._props.length;--n>-1;)s=this._props[n],this._overwriteProps.push(s),r=this._func[s]="function"==typeof t[s],l[s]=r?t[s.indexOf("set")||"function"!=typeof t["get"+s.substr(3)]?s:"get"+s.substr(3)]():parseFloat(t[s]),o||l[s]!==h[0][s]&&(o=l);if(this._beziers="cubic"!==e.type&&"quadratic"!==e.type&&"soft"!==e.type?u(h,isNaN(e.curviness)?1:e.curviness,!1,"thruBasic"===e.type,e.correlate,o):p(h,e.type,l),this._segCount=this._beziers[s].length,this._timeRes){var m=f(this._beziers,this._timeRes);this._length=m.length,this._lengths=m.lengths,this._segments=m.segments,this._l1=this._li=this._s1=this._si=0,this._l2=this._lengths[0],this._curSeg=this._segments[0],this._s2=this._curSeg[0],this._prec=1/this._curSeg.length}if(c=this._autoRotate)for(this._initialRotations=[],c[0]instanceof Array||(this._autoRotate=c=[c]),n=c.length;--n>-1;){for(a=0;3>a;a++)s=c[n][a],this._func[s]="function"==typeof t[s]?t[s.indexOf("set")||"function"!=typeof t["get"+s.substr(3)]?s:"get"+s.substr(3)]:!1;s=c[n][2],this._initialRotations[n]=this._func[s]?this._func[s].call(this._target):this._target[s]}return this._startRatio=i.vars.runBackwards?1:0,!0},set:function(e){var i,s,r,n,a,o,h,l,_,u,p=this._segCount,c=this._func,f=this._target,m=e!==this._startRatio;if(this._timeRes){if(_=this._lengths,u=this._curSeg,e*=this._length,r=this._li,e>this._l2&&p-1>r){for(l=p-1;l>r&&e>=(this._l2=_[++r]););this._l1=_[r-1],this._li=r,this._curSeg=u=this._segments[r],this._s2=u[this._s1=this._si=0]}else if(this._l1>e&&r>0){for(;r>0&&(this._l1=_[--r])>=e;);0===r&&this._l1>e?this._l1=0:r++,this._l2=_[r],this._li=r,this._curSeg=u=this._segments[r],this._s1=u[(this._si=u.length-1)-1]||0,this._s2=u[this._si]}if(i=r,e-=this._l1,r=this._si,e>this._s2&&u.length-1>r){for(l=u.length-1;l>r&&e>=(this._s2=u[++r]););this._s1=u[r-1],this._si=r
}else if(this._s1>e&&r>0){for(;r>0&&(this._s1=u[--r])>=e;);0===r&&this._s1>e?this._s1=0:r++,this._s2=u[r],this._si=r}o=(r+(e-this._s1)/(this._s2-this._s1))*this._prec}else i=0>e?0:e>=1?p-1:p*e>>0,o=(e-i*(1/p))*p;for(s=1-o,r=this._props.length;--r>-1;)n=this._props[r],a=this._beziers[n][i],h=(o*o*a.da+3*s*(o*a.ca+s*a.ba))*o+a.a,this._round[n]&&(h=Math.round(h)),c[n]?f[n](h):f[n]=h;if(this._autoRotate){var d,g,v,y,T,w,x,b=this._autoRotate;for(r=b.length;--r>-1;)n=b[r][2],w=b[r][3]||0,x=b[r][4]===!0?1:t,a=this._beziers[b[r][0]],d=this._beziers[b[r][1]],a&&d&&(a=a[i],d=d[i],g=a.a+(a.b-a.a)*o,y=a.b+(a.c-a.b)*o,g+=(y-g)*o,y+=(a.c+(a.d-a.c)*o-y)*o,v=d.a+(d.b-d.a)*o,T=d.b+(d.c-d.b)*o,v+=(T-v)*o,T+=(d.c+(d.d-d.c)*o-T)*o,h=m?Math.atan2(T-v,y-g)*x+w:this._initialRotations[r],c[n]?f[n](h):f[n]=h)}}}),d=m.prototype;m.bezierThrough=u,m.cubicToQuadratic=h,m._autoCSS=!0,m.quadraticToCubic=function(t,e,i){return new a(t,(2*e+t)/3,(2*e+i)/3,i)},m._cssRegister=function(){var t=n.CSSPlugin;if(t){var e=t._internals,i=e._parseToProxy,s=e._setPluginRatio,r=e.CSSPropTween;e._registerComplexSpecialProp("bezier",{parser:function(t,e,n,a,o,h){e instanceof Array&&(e={values:e}),h=new m;var l,_,u,p=e.values,c=p.length-1,f=[],d={};if(0>c)return o;for(l=0;c>=l;l++)u=i(t,p[l],a,o,h,c!==l),f[l]=u.end;for(_ in e)d[_]=e[_];return d.values=f,o=new r(t,"bezier",0,0,u.pt,2),o.data=u,o.plugin=h,o.setRatio=s,0===d.autoRotate&&(d.autoRotate=!0),!d.autoRotate||d.autoRotate instanceof Array||(l=d.autoRotate===!0?0:Number(d.autoRotate),d.autoRotate=null!=u.end.left?[["left","top","rotation",l,!1]]:null!=u.end.x?[["x","y","rotation",l,!1]]:!1),d.autoRotate&&(a._transform||a._enableTransforms(!1),u.autoRotate=a._target._gsTransform),h._onInitTween(u.proxy,d,a._tween),o}})}},d._roundProps=function(t,e){for(var i=this._overwriteProps,s=i.length;--s>-1;)(t[i[s]]||t.bezier||t.bezierThrough)&&(this._round[i[s]]=e)},d._kill=function(t){var e,i,s=this._props;for(e in this._beziers)if(e in t)for(delete this._beziers[e],delete this._func[e],i=s.length;--i>-1;)s[i]===e&&s.splice(i,1);return this._super._kill.call(this,t)}}(),_gsScope._gsDefine("plugins.CSSPlugin",["plugins.TweenPlugin","TweenLite"],function(t,e){var i,s,r,n,a=function(){t.call(this,"css"),this._overwriteProps.length=0,this.setRatio=a.prototype.setRatio},o=_gsScope._gsDefine.globals,h={},l=a.prototype=new t("css");l.constructor=a,a.version="1.15.0",a.API=2,a.defaultTransformPerspective=0,a.defaultSkewType="compensated",l="px",a.suffixMap={top:l,right:l,bottom:l,left:l,width:l,height:l,fontSize:l,padding:l,margin:l,perspective:l,lineHeight:""};var _,u,p,c,f,m,d=/(?:\d|\-\d|\.\d|\-\.\d)+/g,g=/(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,v=/(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,y=/(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,T=/(?:\d|\-|\+|=|#|\.)*/g,w=/opacity *= *([^)]*)/i,x=/opacity:([^;]*)/i,b=/alpha\(opacity *=.+?\)/i,P=/^(rgb|hsl)/,S=/([A-Z])/g,k=/-([a-z])/gi,R=/(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,A=function(t,e){return e.toUpperCase()},C=/(?:Left|Right|Width)/i,O=/(M11|M12|M21|M22)=[\d\-\.e]+/gi,D=/progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,M=/,(?=[^\)]*(?:\(|$))/gi,z=Math.PI/180,I=180/Math.PI,E={},F=document,N=function(t){return F.createElementNS?F.createElementNS("http://www.w3.org/1999/xhtml",t):F.createElement(t)},L=N("div"),X=N("img"),U=a._internals={_specialProps:h},Y=navigator.userAgent,B=function(){var t=Y.indexOf("Android"),e=N("a");return p=-1!==Y.indexOf("Safari")&&-1===Y.indexOf("Chrome")&&(-1===t||Number(Y.substr(t+8,1))>3),f=p&&6>Number(Y.substr(Y.indexOf("Version/")+8,1)),c=-1!==Y.indexOf("Firefox"),(/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(Y)||/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(Y))&&(m=parseFloat(RegExp.$1)),e?(e.style.cssText="top:1px;opacity:.55;",/^0.55/.test(e.style.opacity)):!1}(),j=function(t){return w.test("string"==typeof t?t:(t.currentStyle?t.currentStyle.filter:t.style.filter)||"")?parseFloat(RegExp.$1)/100:1},q=function(t){window.console&&console.log(t)},V="",G="",W=function(t,e){e=e||L;var i,s,r=e.style;if(void 0!==r[t])return t;for(t=t.charAt(0).toUpperCase()+t.substr(1),i=["O","Moz","ms","Ms","Webkit"],s=5;--s>-1&&void 0===r[i[s]+t];);return s>=0?(G=3===s?"ms":i[s],V="-"+G.toLowerCase()+"-",G+t):null},Z=F.defaultView?F.defaultView.getComputedStyle:function(){},Q=a.getStyle=function(t,e,i,s,r){var n;return B||"opacity"!==e?(!s&&t.style[e]?n=t.style[e]:(i=i||Z(t))?n=i[e]||i.getPropertyValue(e)||i.getPropertyValue(e.replace(S,"-$1").toLowerCase()):t.currentStyle&&(n=t.currentStyle[e]),null==r||n&&"none"!==n&&"auto"!==n&&"auto auto"!==n?n:r):j(t)},$=U.convertToPixels=function(t,i,s,r,n){if("px"===r||!r)return s;if("auto"===r||!s)return 0;var o,h,l,_=C.test(i),u=t,p=L.style,c=0>s;if(c&&(s=-s),"%"===r&&-1!==i.indexOf("border"))o=s/100*(_?t.clientWidth:t.clientHeight);else{if(p.cssText="border:0 solid red;position:"+Q(t,"position")+";line-height:0;","%"!==r&&u.appendChild)p[_?"borderLeftWidth":"borderTopWidth"]=s+r;else{if(u=t.parentNode||F.body,h=u._gsCache,l=e.ticker.frame,h&&_&&h.time===l)return h.width*s/100;p[_?"width":"height"]=s+r}u.appendChild(L),o=parseFloat(L[_?"offsetWidth":"offsetHeight"]),u.removeChild(L),_&&"%"===r&&a.cacheWidths!==!1&&(h=u._gsCache=u._gsCache||{},h.time=l,h.width=100*(o/s)),0!==o||n||(o=$(t,i,s,r,!0))}return c?-o:o},H=U.calculateOffset=function(t,e,i){if("absolute"!==Q(t,"position",i))return 0;var s="left"===e?"Left":"Top",r=Q(t,"margin"+s,i);return t["offset"+s]-($(t,e,parseFloat(r),r.replace(T,""))||0)},K=function(t,e){var i,s,r={};if(e=e||Z(t,null))if(i=e.length)for(;--i>-1;)r[e[i].replace(k,A)]=e.getPropertyValue(e[i]);else for(i in e)r[i]=e[i];else if(e=t.currentStyle||t.style)for(i in e)"string"==typeof i&&void 0===r[i]&&(r[i.replace(k,A)]=e[i]);return B||(r.opacity=j(t)),s=Me(t,e,!1),r.rotation=s.rotation,r.skewX=s.skewX,r.scaleX=s.scaleX,r.scaleY=s.scaleY,r.x=s.x,r.y=s.y,Se&&(r.z=s.z,r.rotationX=s.rotationX,r.rotationY=s.rotationY,r.scaleZ=s.scaleZ),r.filters&&delete r.filters,r},J=function(t,e,i,s,r){var n,a,o,h={},l=t.style;for(a in i)"cssText"!==a&&"length"!==a&&isNaN(a)&&(e[a]!==(n=i[a])||r&&r[a])&&-1===a.indexOf("Origin")&&("number"==typeof n||"string"==typeof n)&&(h[a]="auto"!==n||"left"!==a&&"top"!==a?""!==n&&"auto"!==n&&"none"!==n||"string"!=typeof e[a]||""===e[a].replace(y,"")?n:0:H(t,a),void 0!==l[a]&&(o=new ce(l,a,l[a],o)));if(s)for(a in s)"className"!==a&&(h[a]=s[a]);return{difs:h,firstMPT:o}},te={width:["Left","Right"],height:["Top","Bottom"]},ee=["marginLeft","marginRight","marginTop","marginBottom"],ie=function(t,e,i){var s=parseFloat("width"===e?t.offsetWidth:t.offsetHeight),r=te[e],n=r.length;for(i=i||Z(t,null);--n>-1;)s-=parseFloat(Q(t,"padding"+r[n],i,!0))||0,s-=parseFloat(Q(t,"border"+r[n]+"Width",i,!0))||0;return s},se=function(t,e){(null==t||""===t||"auto"===t||"auto auto"===t)&&(t="0 0");var i=t.split(" "),s=-1!==t.indexOf("left")?"0%":-1!==t.indexOf("right")?"100%":i[0],r=-1!==t.indexOf("top")?"0%":-1!==t.indexOf("bottom")?"100%":i[1];return null==r?r="0":"center"===r&&(r="50%"),("center"===s||isNaN(parseFloat(s))&&-1===(s+"").indexOf("="))&&(s="50%"),e&&(e.oxp=-1!==s.indexOf("%"),e.oyp=-1!==r.indexOf("%"),e.oxr="="===s.charAt(1),e.oyr="="===r.charAt(1),e.ox=parseFloat(s.replace(y,"")),e.oy=parseFloat(r.replace(y,""))),s+" "+r+(i.length>2?" "+i[2]:"")},re=function(t,e){return"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2)):parseFloat(t)-parseFloat(e)},ne=function(t,e){return null==t?e:"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2))+e:parseFloat(t)},ae=function(t,e,i,s){var r,n,a,o,h=1e-6;return null==t?o=e:"number"==typeof t?o=t:(r=360,n=t.split("_"),a=Number(n[0].replace(y,""))*(-1===t.indexOf("rad")?1:I)-("="===t.charAt(1)?0:e),n.length&&(s&&(s[i]=e+a),-1!==t.indexOf("short")&&(a%=r,a!==a%(r/2)&&(a=0>a?a+r:a-r)),-1!==t.indexOf("_cw")&&0>a?a=(a+9999999999*r)%r-(0|a/r)*r:-1!==t.indexOf("ccw")&&a>0&&(a=(a-9999999999*r)%r-(0|a/r)*r)),o=e+a),h>o&&o>-h&&(o=0),o},oe={aqua:[0,255,255],lime:[0,255,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,255],navy:[0,0,128],white:[255,255,255],fuchsia:[255,0,255],olive:[128,128,0],yellow:[255,255,0],orange:[255,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[255,0,0],pink:[255,192,203],cyan:[0,255,255],transparent:[255,255,255,0]},he=function(t,e,i){return t=0>t?t+1:t>1?t-1:t,0|255*(1>6*t?e+6*(i-e)*t:.5>t?i:2>3*t?e+6*(i-e)*(2/3-t):e)+.5},le=a.parseColor=function(t){var e,i,s,r,n,a;return t&&""!==t?"number"==typeof t?[t>>16,255&t>>8,255&t]:(","===t.charAt(t.length-1)&&(t=t.substr(0,t.length-1)),oe[t]?oe[t]:"#"===t.charAt(0)?(4===t.length&&(e=t.charAt(1),i=t.charAt(2),s=t.charAt(3),t="#"+e+e+i+i+s+s),t=parseInt(t.substr(1),16),[t>>16,255&t>>8,255&t]):"hsl"===t.substr(0,3)?(t=t.match(d),r=Number(t[0])%360/360,n=Number(t[1])/100,a=Number(t[2])/100,i=.5>=a?a*(n+1):a+n-a*n,e=2*a-i,t.length>3&&(t[3]=Number(t[3])),t[0]=he(r+1/3,e,i),t[1]=he(r,e,i),t[2]=he(r-1/3,e,i),t):(t=t.match(d)||oe.transparent,t[0]=Number(t[0]),t[1]=Number(t[1]),t[2]=Number(t[2]),t.length>3&&(t[3]=Number(t[3])),t)):oe.black},_e="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";for(l in oe)_e+="|"+l+"\\b";_e=RegExp(_e+")","gi");var ue=function(t,e,i,s){if(null==t)return function(t){return t};var r,n=e?(t.match(_e)||[""])[0]:"",a=t.split(n).join("").match(v)||[],o=t.substr(0,t.indexOf(a[0])),h=")"===t.charAt(t.length-1)?")":"",l=-1!==t.indexOf(" ")?" ":",",_=a.length,u=_>0?a[0].replace(d,""):"";return _?r=e?function(t){var e,p,c,f;if("number"==typeof t)t+=u;else if(s&&M.test(t)){for(f=t.replace(M,"|").split("|"),c=0;f.length>c;c++)f[c]=r(f[c]);return f.join(",")}if(e=(t.match(_e)||[n])[0],p=t.split(e).join("").match(v)||[],c=p.length,_>c--)for(;_>++c;)p[c]=i?p[0|(c-1)/2]:a[c];return o+p.join(l)+l+e+h+(-1!==t.indexOf("inset")?" inset":"")}:function(t){var e,n,p;if("number"==typeof t)t+=u;else if(s&&M.test(t)){for(n=t.replace(M,"|").split("|"),p=0;n.length>p;p++)n[p]=r(n[p]);return n.join(",")}if(e=t.match(v)||[],p=e.length,_>p--)for(;_>++p;)e[p]=i?e[0|(p-1)/2]:a[p];return o+e.join(l)+h}:function(t){return t}},pe=function(t){return t=t.split(","),function(e,i,s,r,n,a,o){var h,l=(i+"").split(" ");for(o={},h=0;4>h;h++)o[t[h]]=l[h]=l[h]||l[(h-1)/2>>0];return r.parse(e,o,n,a)}},ce=(U._setPluginRatio=function(t){this.plugin.setRatio(t);for(var e,i,s,r,n=this.data,a=n.proxy,o=n.firstMPT,h=1e-6;o;)e=a[o.v],o.r?e=Math.round(e):h>e&&e>-h&&(e=0),o.t[o.p]=e,o=o._next;if(n.autoRotate&&(n.autoRotate.rotation=a.rotation),1===t)for(o=n.firstMPT;o;){if(i=o.t,i.type){if(1===i.type){for(r=i.xs0+i.s+i.xs1,s=1;i.l>s;s++)r+=i["xn"+s]+i["xs"+(s+1)];i.e=r}}else i.e=i.s+i.xs0;o=o._next}},function(t,e,i,s,r){this.t=t,this.p=e,this.v=i,this.r=r,s&&(s._prev=this,this._next=s)}),fe=(U._parseToProxy=function(t,e,i,s,r,n){var a,o,h,l,_,u=s,p={},c={},f=i._transform,m=E;for(i._transform=null,E=e,s=_=i.parse(t,e,s,r),E=m,n&&(i._transform=f,u&&(u._prev=null,u._prev&&(u._prev._next=null)));s&&s!==u;){if(1>=s.type&&(o=s.p,c[o]=s.s+s.c,p[o]=s.s,n||(l=new ce(s,"s",o,l,s.r),s.c=0),1===s.type))for(a=s.l;--a>0;)h="xn"+a,o=s.p+"_"+h,c[o]=s.data[h],p[o]=s[h],n||(l=new ce(s,h,o,l,s.rxp[h]));s=s._next}return{proxy:p,end:c,firstMPT:l,pt:_}},U.CSSPropTween=function(t,e,s,r,a,o,h,l,_,u,p){this.t=t,this.p=e,this.s=s,this.c=r,this.n=h||e,t instanceof fe||n.push(this.n),this.r=l,this.type=o||0,_&&(this.pr=_,i=!0),this.b=void 0===u?s:u,this.e=void 0===p?s+r:p,a&&(this._next=a,a._prev=this)}),me=a.parseComplex=function(t,e,i,s,r,n,a,o,h,l){i=i||n||"",a=new fe(t,e,0,0,a,l?2:1,null,!1,o,i,s),s+="";var u,p,c,f,m,v,y,T,w,x,b,S,k=i.split(", ").join(",").split(" "),R=s.split(", ").join(",").split(" "),A=k.length,C=_!==!1;for((-1!==s.indexOf(",")||-1!==i.indexOf(","))&&(k=k.join(" ").replace(M,", ").split(" "),R=R.join(" ").replace(M,", ").split(" "),A=k.length),A!==R.length&&(k=(n||"").split(" "),A=k.length),a.plugin=h,a.setRatio=l,u=0;A>u;u++)if(f=k[u],m=R[u],T=parseFloat(f),T||0===T)a.appendXtra("",T,re(m,T),m.replace(g,""),C&&-1!==m.indexOf("px"),!0);else if(r&&("#"===f.charAt(0)||oe[f]||P.test(f)))S=","===m.charAt(m.length-1)?"),":")",f=le(f),m=le(m),w=f.length+m.length>6,w&&!B&&0===m[3]?(a["xs"+a.l]+=a.l?" transparent":"transparent",a.e=a.e.split(R[u]).join("transparent")):(B||(w=!1),a.appendXtra(w?"rgba(":"rgb(",f[0],m[0]-f[0],",",!0,!0).appendXtra("",f[1],m[1]-f[1],",",!0).appendXtra("",f[2],m[2]-f[2],w?",":S,!0),w&&(f=4>f.length?1:f[3],a.appendXtra("",f,(4>m.length?1:m[3])-f,S,!1)));else if(v=f.match(d)){if(y=m.match(g),!y||y.length!==v.length)return a;for(c=0,p=0;v.length>p;p++)b=v[p],x=f.indexOf(b,c),a.appendXtra(f.substr(c,x-c),Number(b),re(y[p],b),"",C&&"px"===f.substr(x+b.length,2),0===p),c=x+b.length;a["xs"+a.l]+=f.substr(c)}else a["xs"+a.l]+=a.l?" "+f:f;if(-1!==s.indexOf("=")&&a.data){for(S=a.xs0+a.data.s,u=1;a.l>u;u++)S+=a["xs"+u]+a.data["xn"+u];a.e=S+a["xs"+u]}return a.l||(a.type=-1,a.xs0=a.e),a.xfirst||a},de=9;for(l=fe.prototype,l.l=l.pr=0;--de>0;)l["xn"+de]=0,l["xs"+de]="";l.xs0="",l._next=l._prev=l.xfirst=l.data=l.plugin=l.setRatio=l.rxp=null,l.appendXtra=function(t,e,i,s,r,n){var a=this,o=a.l;return a["xs"+o]+=n&&o?" "+t:t||"",i||0===o||a.plugin?(a.l++,a.type=a.setRatio?2:1,a["xs"+a.l]=s||"",o>0?(a.data["xn"+o]=e+i,a.rxp["xn"+o]=r,a["xn"+o]=e,a.plugin||(a.xfirst=new fe(a,"xn"+o,e,i,a.xfirst||a,0,a.n,r,a.pr),a.xfirst.xs0=0),a):(a.data={s:e+i},a.rxp={},a.s=e,a.c=i,a.r=r,a)):(a["xs"+o]+=e+(s||""),a)};var ge=function(t,e){e=e||{},this.p=e.prefix?W(t)||t:t,h[t]=h[this.p]=this,this.format=e.formatter||ue(e.defaultValue,e.color,e.collapsible,e.multi),e.parser&&(this.parse=e.parser),this.clrs=e.color,this.multi=e.multi,this.keyword=e.keyword,this.dflt=e.defaultValue,this.pr=e.priority||0},ve=U._registerComplexSpecialProp=function(t,e,i){"object"!=typeof e&&(e={parser:i});var s,r,n=t.split(","),a=e.defaultValue;for(i=i||[a],s=0;n.length>s;s++)e.prefix=0===s&&e.prefix,e.defaultValue=i[s]||a,r=new ge(n[s],e)},ye=function(t){if(!h[t]){var e=t.charAt(0).toUpperCase()+t.substr(1)+"Plugin";ve(t,{parser:function(t,i,s,r,n,a,l){var _=o.com.greensock.plugins[e];return _?(_._cssRegister(),h[s].parse(t,i,s,r,n,a,l)):(q("Error: "+e+" js file not loaded."),n)}})}};l=ge.prototype,l.parseComplex=function(t,e,i,s,r,n){var a,o,h,l,_,u,p=this.keyword;if(this.multi&&(M.test(i)||M.test(e)?(o=e.replace(M,"|").split("|"),h=i.replace(M,"|").split("|")):p&&(o=[e],h=[i])),h){for(l=h.length>o.length?h.length:o.length,a=0;l>a;a++)e=o[a]=o[a]||this.dflt,i=h[a]=h[a]||this.dflt,p&&(_=e.indexOf(p),u=i.indexOf(p),_!==u&&(i=-1===u?h:o,i[a]+=" "+p));e=o.join(", "),i=h.join(", ")}return me(t,this.p,e,i,this.clrs,this.dflt,s,this.pr,r,n)},l.parse=function(t,e,i,s,n,a){return this.parseComplex(t.style,this.format(Q(t,this.p,r,!1,this.dflt)),this.format(e),n,a)},a.registerSpecialProp=function(t,e,i){ve(t,{parser:function(t,s,r,n,a,o){var h=new fe(t,r,0,0,a,2,r,!1,i);return h.plugin=o,h.setRatio=e(t,s,n._tween,r),h},priority:i})};var Te,we="scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),xe=W("transform"),be=V+"transform",Pe=W("transformOrigin"),Se=null!==W("perspective"),ke=U.Transform=function(){this.perspective=parseFloat(a.defaultTransformPerspective)||0,this.force3D=a.defaultForce3D!==!1&&Se?a.defaultForce3D||"auto":!1},Re=window.SVGElement,Ae=function(t,e,i){var s,r=F.createElementNS("http://www.w3.org/2000/svg",t),n=/([a-z])([A-Z])/g;for(s in i)r.setAttributeNS(null,s.replace(n,"$1-$2").toLowerCase(),i[s]);return e.appendChild(r),r},Ce=document.documentElement,Oe=function(){var t,e,i,s=m||/Android/i.test(Y)&&!window.chrome;return F.createElementNS&&!s&&(t=Ae("svg",Ce),e=Ae("rect",t,{width:100,height:50,x:100}),i=e.getBoundingClientRect().width,e.style[Pe]="50% 50%",e.style[xe]="scaleX(0.5)",s=i===e.getBoundingClientRect().width,Ce.removeChild(t)),s}(),De=function(t,e,i){var s=t.getBBox();e=se(e).split(" "),i.xOrigin=(-1!==e[0].indexOf("%")?parseFloat(e[0])/100*s.width:parseFloat(e[0]))+s.x,i.yOrigin=(-1!==e[1].indexOf("%")?parseFloat(e[1])/100*s.height:parseFloat(e[1]))+s.y},Me=U.getTransform=function(t,e,i,s){if(t._gsTransform&&i&&!s)return t._gsTransform;var n,o,h,l,_,u,p,c,f,m,d=i?t._gsTransform||new ke:new ke,g=0>d.scaleX,v=2e-5,y=1e5,T=Se?parseFloat(Q(t,Pe,e,!1,"0 0 0").split(" ")[2])||d.zOrigin||0:0,w=parseFloat(a.defaultTransformPerspective)||0;if(xe?o=Q(t,be,e,!0):t.currentStyle&&(o=t.currentStyle.filter.match(O),o=o&&4===o.length?[o[0].substr(4),Number(o[2].substr(4)),Number(o[1].substr(4)),o[3].substr(4),d.x||0,d.y||0].join(","):""),n=!o||"none"===o||"matrix(1, 0, 0, 1, 0, 0)"===o,d.svg=!!(Re&&"function"==typeof t.getBBox&&t.getCTM&&(!t.parentNode||t.parentNode.getBBox&&t.parentNode.getCTM)),d.svg&&(De(t,Q(t,Pe,r,!1,"50% 50%")+"",d),Te=a.useSVGTransformAttr||Oe,h=t.getAttribute("transform"),n&&h&&-1!==h.indexOf("matrix")&&(o=h,n=0)),!n){for(h=(o||"").match(/(?:\-|\b)[\d\-\.e]+\b/gi)||[],l=h.length;--l>-1;)_=Number(h[l]),h[l]=(u=_-(_|=0))?(0|u*y+(0>u?-.5:.5))/y+_:_;if(16===h.length){var x=h[8],b=h[9],P=h[10],S=h[12],k=h[13],R=h[14];d.zOrigin&&(R=-d.zOrigin,S=x*R-h[12],k=b*R-h[13],R=P*R+d.zOrigin-h[14]);var A,C,D,M,z,E=h[0],F=h[1],N=h[2],L=h[3],X=h[4],U=h[5],Y=h[6],B=h[7],j=h[11],q=Math.atan2(F,U);d.rotation=q*I,q&&(M=Math.cos(-q),z=Math.sin(-q),E=E*M+X*z,C=F*M+U*z,U=F*-z+U*M,Y=N*-z+Y*M,F=C),q=Math.atan2(x,E),d.rotationY=q*I,q&&(M=Math.cos(-q),z=Math.sin(-q),A=E*M-x*z,C=F*M-b*z,D=N*M-P*z,b=F*z+b*M,P=N*z+P*M,j=L*z+j*M,E=A,F=C,N=D),q=Math.atan2(Y,P),d.rotationX=q*I,q&&(M=Math.cos(-q),z=Math.sin(-q),A=X*M+x*z,C=U*M+b*z,D=Y*M+P*z,x=X*-z+x*M,b=U*-z+b*M,P=Y*-z+P*M,j=B*-z+j*M,X=A,U=C,Y=D),d.scaleX=(0|Math.sqrt(E*E+F*F)*y+.5)/y,d.scaleY=(0|Math.sqrt(U*U+b*b)*y+.5)/y,d.scaleZ=(0|Math.sqrt(Y*Y+P*P)*y+.5)/y,d.skewX=0,d.perspective=j?1/(0>j?-j:j):0,d.x=S,d.y=k,d.z=R}else if(!(Se&&!s&&h.length&&d.x===h[4]&&d.y===h[5]&&(d.rotationX||d.rotationY)||void 0!==d.x&&"none"===Q(t,"display",e))){var V=h.length>=6,G=V?h[0]:1,W=h[1]||0,Z=h[2]||0,$=V?h[3]:1;d.x=h[4]||0,d.y=h[5]||0,p=Math.sqrt(G*G+W*W),c=Math.sqrt($*$+Z*Z),f=G||W?Math.atan2(W,G)*I:d.rotation||0,m=Z||$?Math.atan2(Z,$)*I+f:d.skewX||0,Math.abs(m)>90&&270>Math.abs(m)&&(g?(p*=-1,m+=0>=f?180:-180,f+=0>=f?180:-180):(c*=-1,m+=0>=m?180:-180)),d.scaleX=p,d.scaleY=c,d.rotation=f,d.skewX=m,Se&&(d.rotationX=d.rotationY=d.z=0,d.perspective=w,d.scaleZ=1)}d.zOrigin=T;for(l in d)v>d[l]&&d[l]>-v&&(d[l]=0)}return i&&(t._gsTransform=d),d},ze=function(t){var e,i,s=this.data,r=-s.rotation*z,n=r+s.skewX*z,a=1e5,o=(0|Math.cos(r)*s.scaleX*a)/a,h=(0|Math.sin(r)*s.scaleX*a)/a,l=(0|Math.sin(n)*-s.scaleY*a)/a,_=(0|Math.cos(n)*s.scaleY*a)/a,u=this.t.style,p=this.t.currentStyle;if(p){i=h,h=-l,l=-i,e=p.filter,u.filter="";var c,f,d=this.t.offsetWidth,g=this.t.offsetHeight,v="absolute"!==p.position,y="progid:DXImageTransform.Microsoft.Matrix(M11="+o+", M12="+h+", M21="+l+", M22="+_,x=s.x+d*s.xPercent/100,b=s.y+g*s.yPercent/100;if(null!=s.ox&&(c=(s.oxp?.01*d*s.ox:s.ox)-d/2,f=(s.oyp?.01*g*s.oy:s.oy)-g/2,x+=c-(c*o+f*h),b+=f-(c*l+f*_)),v?(c=d/2,f=g/2,y+=", Dx="+(c-(c*o+f*h)+x)+", Dy="+(f-(c*l+f*_)+b)+")"):y+=", sizingMethod='auto expand')",u.filter=-1!==e.indexOf("DXImageTransform.Microsoft.Matrix(")?e.replace(D,y):y+" "+e,(0===t||1===t)&&1===o&&0===h&&0===l&&1===_&&(v&&-1===y.indexOf("Dx=0, Dy=0")||w.test(e)&&100!==parseFloat(RegExp.$1)||-1===e.indexOf("gradient("&&e.indexOf("Alpha"))&&u.removeAttribute("filter")),!v){var P,S,k,R=8>m?1:-1;for(c=s.ieOffsetX||0,f=s.ieOffsetY||0,s.ieOffsetX=Math.round((d-((0>o?-o:o)*d+(0>h?-h:h)*g))/2+x),s.ieOffsetY=Math.round((g-((0>_?-_:_)*g+(0>l?-l:l)*d))/2+b),de=0;4>de;de++)S=ee[de],P=p[S],i=-1!==P.indexOf("px")?parseFloat(P):$(this.t,S,parseFloat(P),P.replace(T,""))||0,k=i!==s[S]?2>de?-s.ieOffsetX:-s.ieOffsetY:2>de?c-s.ieOffsetX:f-s.ieOffsetY,u[S]=(s[S]=Math.round(i-k*(0===de||2===de?1:R)))+"px"}}},Ie=U.set3DTransformRatio=function(t){var e,i,s,r,n,a,o,h,l,_,u,p,f,m,d,g,v,y,T,w,x,b,P,S,k,R=this.data,A=this.t.style,C=R.rotation*z,O=R.scaleX,D=R.scaleY,M=R.scaleZ,I=R.x,E=R.y,F=R.z,N=R.perspective;if(!(1!==t&&0!==t||"auto"!==R.force3D||R.rotationY||R.rotationX||1!==M||N||F))return Ee.call(this,t),void 0;if(c){var L=1e-4;L>O&&O>-L&&(O=M=2e-5),L>D&&D>-L&&(D=M=2e-5),!N||R.z||R.rotationX||R.rotationY||(N=0)}if(C||R.skewX)y=Math.cos(C),T=Math.sin(C),e=y,n=T,R.skewX&&(C-=R.skewX*z,y=Math.cos(C),T=Math.sin(C),"simple"===R.skewType&&(w=Math.tan(R.skewX*z),w=Math.sqrt(1+w*w),y*=w,T*=w)),i=-T,a=y;else{if(!(R.rotationY||R.rotationX||1!==M||N||R.svg))return A[xe]=(R.xPercent||R.yPercent?"translate("+R.xPercent+"%,"+R.yPercent+"%) translate3d(":"translate3d(")+I+"px,"+E+"px,"+F+"px)"+(1!==O||1!==D?" scale("+O+","+D+")":""),void 0;e=a=1,i=n=0}u=1,s=r=o=h=l=_=p=f=m=0,d=N?-1/N:0,g=R.zOrigin,v=1e5,k=",",C=R.rotationY*z,C&&(y=Math.cos(C),T=Math.sin(C),l=u*-T,f=d*-T,s=e*T,o=n*T,u*=y,d*=y,e*=y,n*=y),C=R.rotationX*z,C&&(y=Math.cos(C),T=Math.sin(C),w=i*y+s*T,x=a*y+o*T,b=_*y+u*T,P=m*y+d*T,s=i*-T+s*y,o=a*-T+o*y,u=_*-T+u*y,d=m*-T+d*y,i=w,a=x,_=b,m=P),1!==M&&(s*=M,o*=M,u*=M,d*=M),1!==D&&(i*=D,a*=D,_*=D,m*=D),1!==O&&(e*=O,n*=O,l*=O,f*=O),g&&(p-=g,r=s*p,h=o*p,p=u*p+g),R.svg&&(r+=R.xOrigin-(R.xOrigin*e+R.yOrigin*i),h+=R.yOrigin-(R.xOrigin*n+R.yOrigin*a)),r=(w=(r+=I)-(r|=0))?(0|w*v+(0>w?-.5:.5))/v+r:r,h=(w=(h+=E)-(h|=0))?(0|w*v+(0>w?-.5:.5))/v+h:h,p=(w=(p+=F)-(p|=0))?(0|w*v+(0>w?-.5:.5))/v+p:p,S=R.xPercent||R.yPercent?"translate("+R.xPercent+"%,"+R.yPercent+"%) matrix3d(":"matrix3d(",S+=(0|e*v)/v+k+(0|n*v)/v+k+(0|l*v)/v,S+=k+(0|f*v)/v+k+(0|i*v)/v+k+(0|a*v)/v,S+=k+(0|_*v)/v+k+(0|m*v)/v+k+(0|s*v)/v,S+=k+(0|o*v)/v+k+(0|u*v)/v+k+(0|d*v)/v,S+=k+r+k+h+k+p+k+(N?1+-p/N:1)+")",A[xe]=S},Ee=U.set2DTransformRatio=function(t){var e,i,s,r,n,a,o,h,l,_,u,p=this.data,c=this.t,f=c.style,m=p.x,d=p.y;return!(p.rotationX||p.rotationY||p.z||p.force3D===!0||"auto"===p.force3D&&1!==t&&0!==t)||p.svg&&Te||!Se?(r=p.scaleX,n=p.scaleY,p.rotation||p.skewX||p.svg?(e=p.rotation*z,i=e-p.skewX*z,s=1e5,a=Math.cos(e)*r,o=Math.sin(e)*r,h=Math.sin(i)*-n,l=Math.cos(i)*n,p.svg&&(m+=p.xOrigin-(p.xOrigin*a+p.yOrigin*h),d+=p.yOrigin-(p.xOrigin*o+p.yOrigin*l),u=1e-6,u>m&&m>-u&&(m=0),u>d&&d>-u&&(d=0)),_=(0|a*s)/s+","+(0|o*s)/s+","+(0|h*s)/s+","+(0|l*s)/s+","+m+","+d+")",p.svg&&Te?c.setAttribute("transform","matrix("+_):f[xe]=(p.xPercent||p.yPercent?"translate("+p.xPercent+"%,"+p.yPercent+"%) matrix(":"matrix(")+_):f[xe]=(p.xPercent||p.yPercent?"translate("+p.xPercent+"%,"+p.yPercent+"%) matrix(":"matrix(")+r+",0,0,"+n+","+m+","+d+")",void 0):(this.setRatio=Ie,Ie.call(this,t),void 0)};l=ke.prototype,l.x=l.y=l.z=l.skewX=l.skewY=l.rotation=l.rotationX=l.rotationY=l.zOrigin=l.xPercent=l.yPercent=0,l.scaleX=l.scaleY=l.scaleZ=1,ve("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent",{parser:function(t,e,i,s,n,o,h){if(s._lastParsedTransform===h)return n;s._lastParsedTransform=h;var l,_,u,p,c,f,m,d=s._transform=Me(t,r,!0,h.parseTransform),g=t.style,v=1e-6,y=we.length,T=h,w={};if("string"==typeof T.transform&&xe)u=L.style,u[xe]=T.transform,u.display="block",u.position="absolute",F.body.appendChild(L),l=Me(L,null,!1),F.body.removeChild(L);else if("object"==typeof T){if(l={scaleX:ne(null!=T.scaleX?T.scaleX:T.scale,d.scaleX),scaleY:ne(null!=T.scaleY?T.scaleY:T.scale,d.scaleY),scaleZ:ne(T.scaleZ,d.scaleZ),x:ne(T.x,d.x),y:ne(T.y,d.y),z:ne(T.z,d.z),xPercent:ne(T.xPercent,d.xPercent),yPercent:ne(T.yPercent,d.yPercent),perspective:ne(T.transformPerspective,d.perspective)},m=T.directionalRotation,null!=m)if("object"==typeof m)for(u in m)T[u]=m[u];else T.rotation=m;"string"==typeof T.x&&-1!==T.x.indexOf("%")&&(l.x=0,l.xPercent=ne(T.x,d.xPercent)),"string"==typeof T.y&&-1!==T.y.indexOf("%")&&(l.y=0,l.yPercent=ne(T.y,d.yPercent)),l.rotation=ae("rotation"in T?T.rotation:"shortRotation"in T?T.shortRotation+"_short":"rotationZ"in T?T.rotationZ:d.rotation,d.rotation,"rotation",w),Se&&(l.rotationX=ae("rotationX"in T?T.rotationX:"shortRotationX"in T?T.shortRotationX+"_short":d.rotationX||0,d.rotationX,"rotationX",w),l.rotationY=ae("rotationY"in T?T.rotationY:"shortRotationY"in T?T.shortRotationY+"_short":d.rotationY||0,d.rotationY,"rotationY",w)),l.skewX=null==T.skewX?d.skewX:ae(T.skewX,d.skewX),l.skewY=null==T.skewY?d.skewY:ae(T.skewY,d.skewY),(_=l.skewY-d.skewY)&&(l.skewX+=_,l.rotation+=_)}for(Se&&null!=T.force3D&&(d.force3D=T.force3D,f=!0),d.skewType=T.skewType||d.skewType||a.defaultSkewType,c=d.force3D||d.z||d.rotationX||d.rotationY||l.z||l.rotationX||l.rotationY||l.perspective,c||null==T.scale||(l.scaleZ=1);--y>-1;)i=we[y],p=l[i]-d[i],(p>v||-v>p||null!=T[i]||null!=E[i])&&(f=!0,n=new fe(d,i,d[i],p,n),i in w&&(n.e=w[i]),n.xs0=0,n.plugin=o,s._overwriteProps.push(n.n));return p=T.transformOrigin,p&&d.svg&&(De(t,p,l),n=new fe(d,"xOrigin",d.xOrigin,l.xOrigin-d.xOrigin,n,-1,"transformOrigin"),n.b=d.xOrigin,n.e=n.xs0=l.xOrigin,n=new fe(d,"yOrigin",d.yOrigin,l.yOrigin-d.yOrigin,n,-1,"transformOrigin"),n.b=d.yOrigin,n.e=n.xs0=l.yOrigin,p="0px 0px"),(p||Se&&c&&d.zOrigin)&&(xe?(f=!0,i=Pe,p=(p||Q(t,i,r,!1,"50% 50%"))+"",n=new fe(g,i,0,0,n,-1,"transformOrigin"),n.b=g[i],n.plugin=o,Se?(u=d.zOrigin,p=p.split(" "),d.zOrigin=(p.length>2&&(0===u||"0px"!==p[2])?parseFloat(p[2]):u)||0,n.xs0=n.e=p[0]+" "+(p[1]||"50%")+" 0px",n=new fe(d,"zOrigin",0,0,n,-1,n.n),n.b=u,n.xs0=n.e=d.zOrigin):n.xs0=n.e=p):se(p+"",d)),f&&(s._transformType=d.svg&&Te||!c&&3!==this._transformType?2:3),n},prefix:!0}),ve("boxShadow",{defaultValue:"0px 0px 0px 0px #999",prefix:!0,color:!0,multi:!0,keyword:"inset"}),ve("borderRadius",{defaultValue:"0px",parser:function(t,e,i,n,a){e=this.format(e);var o,h,l,_,u,p,c,f,m,d,g,v,y,T,w,x,b=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],P=t.style;for(m=parseFloat(t.offsetWidth),d=parseFloat(t.offsetHeight),o=e.split(" "),h=0;b.length>h;h++)this.p.indexOf("border")&&(b[h]=W(b[h])),u=_=Q(t,b[h],r,!1,"0px"),-1!==u.indexOf(" ")&&(_=u.split(" "),u=_[0],_=_[1]),p=l=o[h],c=parseFloat(u),v=u.substr((c+"").length),y="="===p.charAt(1),y?(f=parseInt(p.charAt(0)+"1",10),p=p.substr(2),f*=parseFloat(p),g=p.substr((f+"").length-(0>f?1:0))||""):(f=parseFloat(p),g=p.substr((f+"").length)),""===g&&(g=s[i]||v),g!==v&&(T=$(t,"borderLeft",c,v),w=$(t,"borderTop",c,v),"%"===g?(u=100*(T/m)+"%",_=100*(w/d)+"%"):"em"===g?(x=$(t,"borderLeft",1,"em"),u=T/x+"em",_=w/x+"em"):(u=T+"px",_=w+"px"),y&&(p=parseFloat(u)+f+g,l=parseFloat(_)+f+g)),a=me(P,b[h],u+" "+_,p+" "+l,!1,"0px",a);return a},prefix:!0,formatter:ue("0px 0px 0px 0px",!1,!0)}),ve("backgroundPosition",{defaultValue:"0 0",parser:function(t,e,i,s,n,a){var o,h,l,_,u,p,c="background-position",f=r||Z(t,null),d=this.format((f?m?f.getPropertyValue(c+"-x")+" "+f.getPropertyValue(c+"-y"):f.getPropertyValue(c):t.currentStyle.backgroundPositionX+" "+t.currentStyle.backgroundPositionY)||"0 0"),g=this.format(e);if(-1!==d.indexOf("%")!=(-1!==g.indexOf("%"))&&(p=Q(t,"backgroundImage").replace(R,""),p&&"none"!==p)){for(o=d.split(" "),h=g.split(" "),X.setAttribute("src",p),l=2;--l>-1;)d=o[l],_=-1!==d.indexOf("%"),_!==(-1!==h[l].indexOf("%"))&&(u=0===l?t.offsetWidth-X.width:t.offsetHeight-X.height,o[l]=_?parseFloat(d)/100*u+"px":100*(parseFloat(d)/u)+"%");d=o.join(" ")}return this.parseComplex(t.style,d,g,n,a)},formatter:se}),ve("backgroundSize",{defaultValue:"0 0",formatter:se}),ve("perspective",{defaultValue:"0px",prefix:!0}),ve("perspectiveOrigin",{defaultValue:"50% 50%",prefix:!0}),ve("transformStyle",{prefix:!0}),ve("backfaceVisibility",{prefix:!0}),ve("userSelect",{prefix:!0}),ve("margin",{parser:pe("marginTop,marginRight,marginBottom,marginLeft")}),ve("padding",{parser:pe("paddingTop,paddingRight,paddingBottom,paddingLeft")}),ve("clip",{defaultValue:"rect(0px,0px,0px,0px)",parser:function(t,e,i,s,n,a){var o,h,l;return 9>m?(h=t.currentStyle,l=8>m?" ":",",o="rect("+h.clipTop+l+h.clipRight+l+h.clipBottom+l+h.clipLeft+")",e=this.format(e).split(",").join(l)):(o=this.format(Q(t,this.p,r,!1,this.dflt)),e=this.format(e)),this.parseComplex(t.style,o,e,n,a)}}),ve("textShadow",{defaultValue:"0px 0px 0px #999",color:!0,multi:!0}),ve("autoRound,strictUnits",{parser:function(t,e,i,s,r){return r}}),ve("border",{defaultValue:"0px solid #000",parser:function(t,e,i,s,n,a){return this.parseComplex(t.style,this.format(Q(t,"borderTopWidth",r,!1,"0px")+" "+Q(t,"borderTopStyle",r,!1,"solid")+" "+Q(t,"borderTopColor",r,!1,"#000")),this.format(e),n,a)},color:!0,formatter:function(t){var e=t.split(" ");return e[0]+" "+(e[1]||"solid")+" "+(t.match(_e)||["#000"])[0]}}),ve("borderWidth",{parser:pe("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}),ve("float,cssFloat,styleFloat",{parser:function(t,e,i,s,r){var n=t.style,a="cssFloat"in n?"cssFloat":"styleFloat";return new fe(n,a,0,0,r,-1,i,!1,0,n[a],e)}});var Fe=function(t){var e,i=this.t,s=i.filter||Q(this.data,"filter")||"",r=0|this.s+this.c*t;100===r&&(-1===s.indexOf("atrix(")&&-1===s.indexOf("radient(")&&-1===s.indexOf("oader(")?(i.removeAttribute("filter"),e=!Q(this.data,"filter")):(i.filter=s.replace(b,""),e=!0)),e||(this.xn1&&(i.filter=s=s||"alpha(opacity="+r+")"),-1===s.indexOf("pacity")?0===r&&this.xn1||(i.filter=s+" alpha(opacity="+r+")"):i.filter=s.replace(w,"opacity="+r))};ve("opacity,alpha,autoAlpha",{defaultValue:"1",parser:function(t,e,i,s,n,a){var o=parseFloat(Q(t,"opacity",r,!1,"1")),h=t.style,l="autoAlpha"===i;return"string"==typeof e&&"="===e.charAt(1)&&(e=("-"===e.charAt(0)?-1:1)*parseFloat(e.substr(2))+o),l&&1===o&&"hidden"===Q(t,"visibility",r)&&0!==e&&(o=0),B?n=new fe(h,"opacity",o,e-o,n):(n=new fe(h,"opacity",100*o,100*(e-o),n),n.xn1=l?1:0,h.zoom=1,n.type=2,n.b="alpha(opacity="+n.s+")",n.e="alpha(opacity="+(n.s+n.c)+")",n.data=t,n.plugin=a,n.setRatio=Fe),l&&(n=new fe(h,"visibility",0,0,n,-1,null,!1,0,0!==o?"inherit":"hidden",0===e?"hidden":"inherit"),n.xs0="inherit",s._overwriteProps.push(n.n),s._overwriteProps.push(i)),n}});var Ne=function(t,e){e&&(t.removeProperty?("ms"===e.substr(0,2)&&(e="M"+e.substr(1)),t.removeProperty(e.replace(S,"-$1").toLowerCase())):t.removeAttribute(e))},Le=function(t){if(this.t._gsClassPT=this,1===t||0===t){this.t.setAttribute("class",0===t?this.b:this.e);for(var e=this.data,i=this.t.style;e;)e.v?i[e.p]=e.v:Ne(i,e.p),e=e._next;1===t&&this.t._gsClassPT===this&&(this.t._gsClassPT=null)}else this.t.getAttribute("class")!==this.e&&this.t.setAttribute("class",this.e)};ve("className",{parser:function(t,e,s,n,a,o,h){var l,_,u,p,c,f=t.getAttribute("class")||"",m=t.style.cssText;if(a=n._classNamePT=new fe(t,s,0,0,a,2),a.setRatio=Le,a.pr=-11,i=!0,a.b=f,_=K(t,r),u=t._gsClassPT){for(p={},c=u.data;c;)p[c.p]=1,c=c._next;u.setRatio(1)}return t._gsClassPT=a,a.e="="!==e.charAt(1)?e:f.replace(RegExp("\\s*\\b"+e.substr(2)+"\\b"),"")+("+"===e.charAt(0)?" "+e.substr(2):""),n._tween._duration&&(t.setAttribute("class",a.e),l=J(t,_,K(t),h,p),t.setAttribute("class",f),a.data=l.firstMPT,t.style.cssText=m,a=a.xfirst=n.parse(t,l.difs,a,o)),a}});var Xe=function(t){if((1===t||0===t)&&this.data._totalTime===this.data._totalDuration&&"isFromStart"!==this.data.data){var e,i,s,r,n=this.t.style,a=h.transform.parse;if("all"===this.e)n.cssText="",r=!0;else for(e=this.e.split(" ").join("").split(","),s=e.length;--s>-1;)i=e[s],h[i]&&(h[i].parse===a?r=!0:i="transformOrigin"===i?Pe:h[i].p),Ne(n,i);r&&(Ne(n,xe),this.t._gsTransform&&delete this.t._gsTransform)}};for(ve("clearProps",{parser:function(t,e,s,r,n){return n=new fe(t,s,0,0,n,2),n.setRatio=Xe,n.e=e,n.pr=-10,n.data=r._tween,i=!0,n}}),l="bezier,throwProps,physicsProps,physics2D".split(","),de=l.length;de--;)ye(l[de]);l=a.prototype,l._firstPT=l._lastParsedTransform=l._transform=null,l._onInitTween=function(t,e,o){if(!t.nodeType)return!1;this._target=t,this._tween=o,this._vars=e,_=e.autoRound,i=!1,s=e.suffixMap||a.suffixMap,r=Z(t,""),n=this._overwriteProps;var h,l,c,m,d,g,v,y,T,w=t.style;if(u&&""===w.zIndex&&(h=Q(t,"zIndex",r),("auto"===h||""===h)&&this._addLazySet(w,"zIndex",0)),"string"==typeof e&&(m=w.cssText,h=K(t,r),w.cssText=m+";"+e,h=J(t,h,K(t)).difs,!B&&x.test(e)&&(h.opacity=parseFloat(RegExp.$1)),e=h,w.cssText=m),this._firstPT=l=this.parse(t,e,null),this._transformType){for(T=3===this._transformType,xe?p&&(u=!0,""===w.zIndex&&(v=Q(t,"zIndex",r),("auto"===v||""===v)&&this._addLazySet(w,"zIndex",0)),f&&this._addLazySet(w,"WebkitBackfaceVisibility",this._vars.WebkitBackfaceVisibility||(T?"visible":"hidden"))):w.zoom=1,c=l;c&&c._next;)c=c._next;
y=new fe(t,"transform",0,0,null,2),this._linkCSSP(y,null,c),y.setRatio=T&&Se?Ie:xe?Ee:ze,y.data=this._transform||Me(t,r,!0),n.pop()}if(i){for(;l;){for(g=l._next,c=m;c&&c.pr>l.pr;)c=c._next;(l._prev=c?c._prev:d)?l._prev._next=l:m=l,(l._next=c)?c._prev=l:d=l,l=g}this._firstPT=m}return!0},l.parse=function(t,e,i,n){var a,o,l,u,p,c,f,m,d,g,v=t.style;for(a in e)c=e[a],o=h[a],o?i=o.parse(t,c,a,this,i,n,e):(p=Q(t,a,r)+"",d="string"==typeof c,"color"===a||"fill"===a||"stroke"===a||-1!==a.indexOf("Color")||d&&P.test(c)?(d||(c=le(c),c=(c.length>3?"rgba(":"rgb(")+c.join(",")+")"),i=me(v,a,p,c,!0,"transparent",i,0,n)):!d||-1===c.indexOf(" ")&&-1===c.indexOf(",")?(l=parseFloat(p),f=l||0===l?p.substr((l+"").length):"",(""===p||"auto"===p)&&("width"===a||"height"===a?(l=ie(t,a,r),f="px"):"left"===a||"top"===a?(l=H(t,a,r),f="px"):(l="opacity"!==a?0:1,f="")),g=d&&"="===c.charAt(1),g?(u=parseInt(c.charAt(0)+"1",10),c=c.substr(2),u*=parseFloat(c),m=c.replace(T,"")):(u=parseFloat(c),m=d?c.substr((u+"").length)||"":""),""===m&&(m=a in s?s[a]:f),c=u||0===u?(g?u+l:u)+m:e[a],f!==m&&""!==m&&(u||0===u)&&l&&(l=$(t,a,l,f),"%"===m?(l/=$(t,a,100,"%")/100,e.strictUnits!==!0&&(p=l+"%")):"em"===m?l/=$(t,a,1,"em"):"px"!==m&&(u=$(t,a,u,m),m="px"),g&&(u||0===u)&&(c=u+l+m)),g&&(u+=l),!l&&0!==l||!u&&0!==u?void 0!==v[a]&&(c||"NaN"!=c+""&&null!=c)?(i=new fe(v,a,u||l||0,0,i,-1,a,!1,0,p,c),i.xs0="none"!==c||"display"!==a&&-1===a.indexOf("Style")?c:p):q("invalid "+a+" tween value: "+e[a]):(i=new fe(v,a,l,u-l,i,0,a,_!==!1&&("px"===m||"zIndex"===a),0,p,c),i.xs0=m)):i=me(v,a,p,c,!0,null,i,0,n)),n&&i&&!i.plugin&&(i.plugin=n);return i},l.setRatio=function(t){var e,i,s,r=this._firstPT,n=1e-6;if(1!==t||this._tween._time!==this._tween._duration&&0!==this._tween._time)if(t||this._tween._time!==this._tween._duration&&0!==this._tween._time||this._tween._rawPrevTime===-1e-6)for(;r;){if(e=r.c*t+r.s,r.r?e=Math.round(e):n>e&&e>-n&&(e=0),r.type)if(1===r.type)if(s=r.l,2===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2;else if(3===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3;else if(4===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3+r.xn3+r.xs4;else if(5===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3+r.xn3+r.xs4+r.xn4+r.xs5;else{for(i=r.xs0+e+r.xs1,s=1;r.l>s;s++)i+=r["xn"+s]+r["xs"+(s+1)];r.t[r.p]=i}else-1===r.type?r.t[r.p]=r.xs0:r.setRatio&&r.setRatio(t);else r.t[r.p]=e+r.xs0;r=r._next}else for(;r;)2!==r.type?r.t[r.p]=r.b:r.setRatio(t),r=r._next;else for(;r;)2!==r.type?r.t[r.p]=r.e:r.setRatio(t),r=r._next},l._enableTransforms=function(t){this._transform=this._transform||Me(this._target,r,!0),this._transformType=this._transform.svg&&Te||!t&&3!==this._transformType?2:3};var Ue=function(){this.t[this.p]=this.e,this.data._linkCSSP(this,this._next,null,!0)};l._addLazySet=function(t,e,i){var s=this._firstPT=new fe(t,e,0,0,this._firstPT,2);s.e=i,s.setRatio=Ue,s.data=this},l._linkCSSP=function(t,e,i,s){return t&&(e&&(e._prev=t),t._next&&(t._next._prev=t._prev),t._prev?t._prev._next=t._next:this._firstPT===t&&(this._firstPT=t._next,s=!0),i?i._next=t:s||null!==this._firstPT||(this._firstPT=t),t._next=e,t._prev=i),t},l._kill=function(e){var i,s,r,n=e;if(e.autoAlpha||e.alpha){n={};for(s in e)n[s]=e[s];n.opacity=1,n.autoAlpha&&(n.visibility=1)}return e.className&&(i=this._classNamePT)&&(r=i.xfirst,r&&r._prev?this._linkCSSP(r._prev,i._next,r._prev._prev):r===this._firstPT&&(this._firstPT=i._next),i._next&&this._linkCSSP(i._next,i._next._next,r._prev),this._classNamePT=null),t.prototype._kill.call(this,n)};var Ye=function(t,e,i){var s,r,n,a;if(t.slice)for(r=t.length;--r>-1;)Ye(t[r],e,i);else for(s=t.childNodes,r=s.length;--r>-1;)n=s[r],a=n.type,n.style&&(e.push(K(n)),i&&i.push(n)),1!==a&&9!==a&&11!==a||!n.childNodes.length||Ye(n,e,i)};return a.cascadeTo=function(t,i,s){var r,n,a,o=e.to(t,i,s),h=[o],l=[],_=[],u=[],p=e._internals.reservedProps;for(t=o._targets||o.target,Ye(t,l,u),o.render(i,!0),Ye(t,_),o.render(0,!0),o._enabled(!0),r=u.length;--r>-1;)if(n=J(u[r],l[r],_[r]),n.firstMPT){n=n.difs;for(a in s)p[a]&&(n[a]=s[a]);h.push(e.to(u[r],i,n))}return h},t.activate([a]),a},!0),function(){var t=_gsScope._gsDefine.plugin({propName:"roundProps",priority:-1,API:2,init:function(t,e,i){return this._tween=i,!0}}),e=t.prototype;e._onInitAllProps=function(){for(var t,e,i,s=this._tween,r=s.vars.roundProps instanceof Array?s.vars.roundProps:s.vars.roundProps.split(","),n=r.length,a={},o=s._propLookup.roundProps;--n>-1;)a[r[n]]=1;for(n=r.length;--n>-1;)for(t=r[n],e=s._firstPT;e;)i=e._next,e.pg?e.t._roundProps(a,!0):e.n===t&&(this._add(e.t,t,e.s,e.c),i&&(i._prev=e._prev),e._prev?e._prev._next=i:s._firstPT===e&&(s._firstPT=i),e._next=e._prev=null,s._propLookup[t]=o),e=i;return!1},e._add=function(t,e,i,s){this._addTween(t,e,i,i+s,e,!0),this._overwriteProps.push(e)}}(),_gsScope._gsDefine.plugin({propName:"attr",API:2,version:"0.3.3",init:function(t,e){var i,s,r;if("function"!=typeof t.setAttribute)return!1;this._target=t,this._proxy={},this._start={},this._end={};for(i in e)this._start[i]=this._proxy[i]=s=t.getAttribute(i),r=this._addTween(this._proxy,i,parseFloat(s),e[i],i),this._end[i]=r?r.s+r.c:e[i],this._overwriteProps.push(i);return!0},set:function(t){this._super.setRatio.call(this,t);for(var e,i=this._overwriteProps,s=i.length,r=1===t?this._end:t?this._proxy:this._start;--s>-1;)e=i[s],this._target.setAttribute(e,r[e]+"")}}),_gsScope._gsDefine.plugin({propName:"directionalRotation",version:"0.2.1",API:2,init:function(t,e){"object"!=typeof e&&(e={rotation:e}),this.finals={};var i,s,r,n,a,o,h=e.useRadians===!0?2*Math.PI:360,l=1e-6;for(i in e)"useRadians"!==i&&(o=(e[i]+"").split("_"),s=o[0],r=parseFloat("function"!=typeof t[i]?t[i]:t[i.indexOf("set")||"function"!=typeof t["get"+i.substr(3)]?i:"get"+i.substr(3)]()),n=this.finals[i]="string"==typeof s&&"="===s.charAt(1)?r+parseInt(s.charAt(0)+"1",10)*Number(s.substr(2)):Number(s)||0,a=n-r,o.length&&(s=o.join("_"),-1!==s.indexOf("short")&&(a%=h,a!==a%(h/2)&&(a=0>a?a+h:a-h)),-1!==s.indexOf("_cw")&&0>a?a=(a+9999999999*h)%h-(0|a/h)*h:-1!==s.indexOf("ccw")&&a>0&&(a=(a-9999999999*h)%h-(0|a/h)*h)),(a>l||-l>a)&&(this._addTween(t,i,r,r+a,i),this._overwriteProps.push(i)));return!0},set:function(t){var e;if(1!==t)this._super.setRatio.call(this,t);else for(e=this._firstPT;e;)e.f?e.t[e.p](this.finals[e.p]):e.t[e.p]=this.finals[e.p],e=e._next}})._autoCSS=!0,_gsScope._gsDefine("easing.Back",["easing.Ease"],function(t){var e,i,s,r=_gsScope.GreenSockGlobals||_gsScope,n=r.com.greensock,a=2*Math.PI,o=Math.PI/2,h=n._class,l=function(e,i){var s=h("easing."+e,function(){},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,s},_=t.register||function(){},u=function(t,e,i,s){var r=h("easing."+t,{easeOut:new e,easeIn:new i,easeInOut:new s},!0);return _(r,t),r},p=function(t,e,i){this.t=t,this.v=e,i&&(this.next=i,i.prev=this,this.c=i.v-e,this.gap=i.t-t)},c=function(e,i){var s=h("easing."+e,function(t){this._p1=t||0===t?t:1.70158,this._p2=1.525*this._p1},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,r.config=function(t){return new s(t)},s},f=u("Back",c("BackOut",function(t){return(t-=1)*t*((this._p1+1)*t+this._p1)+1}),c("BackIn",function(t){return t*t*((this._p1+1)*t-this._p1)}),c("BackInOut",function(t){return 1>(t*=2)?.5*t*t*((this._p2+1)*t-this._p2):.5*((t-=2)*t*((this._p2+1)*t+this._p2)+2)})),m=h("easing.SlowMo",function(t,e,i){e=e||0===e?e:.7,null==t?t=.7:t>1&&(t=1),this._p=1!==t?e:0,this._p1=(1-t)/2,this._p2=t,this._p3=this._p1+this._p2,this._calcEnd=i===!0},!0),d=m.prototype=new t;return d.constructor=m,d.getRatio=function(t){var e=t+(.5-t)*this._p;return this._p1>t?this._calcEnd?1-(t=1-t/this._p1)*t:e-(t=1-t/this._p1)*t*t*t*e:t>this._p3?this._calcEnd?1-(t=(t-this._p3)/this._p1)*t:e+(t-e)*(t=(t-this._p3)/this._p1)*t*t*t:this._calcEnd?1:e},m.ease=new m(.7,.7),d.config=m.config=function(t,e,i){return new m(t,e,i)},e=h("easing.SteppedEase",function(t){t=t||1,this._p1=1/t,this._p2=t+1},!0),d=e.prototype=new t,d.constructor=e,d.getRatio=function(t){return 0>t?t=0:t>=1&&(t=.999999999),(this._p2*t>>0)*this._p1},d.config=e.config=function(t){return new e(t)},i=h("easing.RoughEase",function(e){e=e||{};for(var i,s,r,n,a,o,h=e.taper||"none",l=[],_=0,u=0|(e.points||20),c=u,f=e.randomize!==!1,m=e.clamp===!0,d=e.template instanceof t?e.template:null,g="number"==typeof e.strength?.4*e.strength:.4;--c>-1;)i=f?Math.random():1/u*c,s=d?d.getRatio(i):i,"none"===h?r=g:"out"===h?(n=1-i,r=n*n*g):"in"===h?r=i*i*g:.5>i?(n=2*i,r=.5*n*n*g):(n=2*(1-i),r=.5*n*n*g),f?s+=Math.random()*r-.5*r:c%2?s+=.5*r:s-=.5*r,m&&(s>1?s=1:0>s&&(s=0)),l[_++]={x:i,y:s};for(l.sort(function(t,e){return t.x-e.x}),o=new p(1,1,null),c=u;--c>-1;)a=l[c],o=new p(a.x,a.y,o);this._prev=new p(0,0,0!==o.t?o:o.next)},!0),d=i.prototype=new t,d.constructor=i,d.getRatio=function(t){var e=this._prev;if(t>e.t){for(;e.next&&t>=e.t;)e=e.next;e=e.prev}else for(;e.prev&&e.t>=t;)e=e.prev;return this._prev=e,e.v+(t-e.t)/e.gap*e.c},d.config=function(t){return new i(t)},i.ease=new i,u("Bounce",l("BounceOut",function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}),l("BounceIn",function(t){return 1/2.75>(t=1-t)?1-7.5625*t*t:2/2.75>t?1-(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?1-(7.5625*(t-=2.25/2.75)*t+.9375):1-(7.5625*(t-=2.625/2.75)*t+.984375)}),l("BounceInOut",function(t){var e=.5>t;return t=e?1-2*t:2*t-1,t=1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375,e?.5*(1-t):.5*t+.5})),u("Circ",l("CircOut",function(t){return Math.sqrt(1-(t-=1)*t)}),l("CircIn",function(t){return-(Math.sqrt(1-t*t)-1)}),l("CircInOut",function(t){return 1>(t*=2)?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)})),s=function(e,i,s){var r=h("easing."+e,function(t,e){this._p1=t||1,this._p2=e||s,this._p3=this._p2/a*(Math.asin(1/this._p1)||0)},!0),n=r.prototype=new t;return n.constructor=r,n.getRatio=i,n.config=function(t,e){return new r(t,e)},r},u("Elastic",s("ElasticOut",function(t){return this._p1*Math.pow(2,-10*t)*Math.sin((t-this._p3)*a/this._p2)+1},.3),s("ElasticIn",function(t){return-(this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2))},.3),s("ElasticInOut",function(t){return 1>(t*=2)?-.5*this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2):.5*this._p1*Math.pow(2,-10*(t-=1))*Math.sin((t-this._p3)*a/this._p2)+1},.45)),u("Expo",l("ExpoOut",function(t){return 1-Math.pow(2,-10*t)}),l("ExpoIn",function(t){return Math.pow(2,10*(t-1))-.001}),l("ExpoInOut",function(t){return 1>(t*=2)?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*(t-1)))})),u("Sine",l("SineOut",function(t){return Math.sin(t*o)}),l("SineIn",function(t){return-Math.cos(t*o)+1}),l("SineInOut",function(t){return-.5*(Math.cos(Math.PI*t)-1)})),h("easing.EaseLookup",{find:function(e){return t.map[e]}},!0),_(r.SlowMo,"SlowMo","ease,"),_(i,"RoughEase","ease,"),_(e,"SteppedEase","ease,"),f},!0)}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()(),function(t,e){"use strict";var i=t.GreenSockGlobals=t.GreenSockGlobals||t;if(!i.TweenLite){var s,r,n,a,o,h=function(t){var e,s=t.split("."),r=i;for(e=0;s.length>e;e++)r[s[e]]=r=r[s[e]]||{};return r},l=h("com.greensock"),_=1e-10,u=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i},p=function(){},c=function(){var t=Object.prototype.toString,e=t.call([]);return function(i){return null!=i&&(i instanceof Array||"object"==typeof i&&!!i.push&&t.call(i)===e)}}(),f={},m=function(s,r,n,a){this.sc=f[s]?f[s].sc:[],f[s]=this,this.gsClass=null,this.func=n;var o=[];this.check=function(l){for(var _,u,p,c,d=r.length,g=d;--d>-1;)(_=f[r[d]]||new m(r[d],[])).gsClass?(o[d]=_.gsClass,g--):l&&_.sc.push(this);if(0===g&&n)for(u=("com.greensock."+s).split("."),p=u.pop(),c=h(u.join("."))[p]=this.gsClass=n.apply(n,o),a&&(i[p]=c,"function"==typeof define&&define.amd?define((t.GreenSockAMDPath?t.GreenSockAMDPath+"/":"")+s.split(".").pop(),[],function(){return c}):s===e&&"undefined"!=typeof module&&module.exports&&(module.exports=c)),d=0;this.sc.length>d;d++)this.sc[d].check()},this.check(!0)},d=t._gsDefine=function(t,e,i,s){return new m(t,e,i,s)},g=l._class=function(t,e,i){return e=e||function(){},d(t,[],function(){return e},i),e};d.globals=i;var v=[0,0,1,1],y=[],T=g("easing.Ease",function(t,e,i,s){this._func=t,this._type=i||0,this._power=s||0,this._params=e?v.concat(e):v},!0),w=T.map={},x=T.register=function(t,e,i,s){for(var r,n,a,o,h=e.split(","),_=h.length,u=(i||"easeIn,easeOut,easeInOut").split(",");--_>-1;)for(n=h[_],r=s?g("easing."+n,null,!0):l.easing[n]||{},a=u.length;--a>-1;)o=u[a],w[n+"."+o]=w[o+n]=r[o]=t.getRatio?t:t[o]||new t};for(n=T.prototype,n._calcEnd=!1,n.getRatio=function(t){if(this._func)return this._params[0]=t,this._func.apply(null,this._params);var e=this._type,i=this._power,s=1===e?1-t:2===e?t:.5>t?2*t:2*(1-t);return 1===i?s*=s:2===i?s*=s*s:3===i?s*=s*s*s:4===i&&(s*=s*s*s*s),1===e?1-s:2===e?s:.5>t?s/2:1-s/2},s=["Linear","Quad","Cubic","Quart","Quint,Strong"],r=s.length;--r>-1;)n=s[r]+",Power"+r,x(new T(null,null,1,r),n,"easeOut",!0),x(new T(null,null,2,r),n,"easeIn"+(0===r?",easeNone":"")),x(new T(null,null,3,r),n,"easeInOut");w.linear=l.easing.Linear.easeIn,w.swing=l.easing.Quad.easeInOut;var b=g("events.EventDispatcher",function(t){this._listeners={},this._eventTarget=t||this});n=b.prototype,n.addEventListener=function(t,e,i,s,r){r=r||0;var n,h,l=this._listeners[t],_=0;for(null==l&&(this._listeners[t]=l=[]),h=l.length;--h>-1;)n=l[h],n.c===e&&n.s===i?l.splice(h,1):0===_&&r>n.pr&&(_=h+1);l.splice(_,0,{c:e,s:i,up:s,pr:r}),this!==a||o||a.wake()},n.removeEventListener=function(t,e){var i,s=this._listeners[t];if(s)for(i=s.length;--i>-1;)if(s[i].c===e)return s.splice(i,1),void 0},n.dispatchEvent=function(t){var e,i,s,r=this._listeners[t];if(r)for(e=r.length,i=this._eventTarget;--e>-1;)s=r[e],s&&(s.up?s.c.call(s.s||i,{type:t,target:i}):s.c.call(s.s||i))};var P=t.requestAnimationFrame,S=t.cancelAnimationFrame,k=Date.now||function(){return(new Date).getTime()},R=k();for(s=["ms","moz","webkit","o"],r=s.length;--r>-1&&!P;)P=t[s[r]+"RequestAnimationFrame"],S=t[s[r]+"CancelAnimationFrame"]||t[s[r]+"CancelRequestAnimationFrame"];g("Ticker",function(t,e){var i,s,r,n,h,l=this,u=k(),c=e!==!1&&P,f=500,m=33,d="tick",g=function(t){var e,a,o=k()-R;o>f&&(u+=o-m),R+=o,l.time=(R-u)/1e3,e=l.time-h,(!i||e>0||t===!0)&&(l.frame++,h+=e+(e>=n?.004:n-e),a=!0),t!==!0&&(r=s(g)),a&&l.dispatchEvent(d)};b.call(l),l.time=l.frame=0,l.tick=function(){g(!0)},l.lagSmoothing=function(t,e){f=t||1/_,m=Math.min(e,f,0)},l.sleep=function(){null!=r&&(c&&S?S(r):clearTimeout(r),s=p,r=null,l===a&&(o=!1))},l.wake=function(){null!==r?l.sleep():l.frame>10&&(R=k()-f+5),s=0===i?p:c&&P?P:function(t){return setTimeout(t,0|1e3*(h-l.time)+1)},l===a&&(o=!0),g(2)},l.fps=function(t){return arguments.length?(i=t,n=1/(i||60),h=this.time+n,l.wake(),void 0):i},l.useRAF=function(t){return arguments.length?(l.sleep(),c=t,l.fps(i),void 0):c},l.fps(t),setTimeout(function(){c&&(!r||5>l.frame)&&l.useRAF(!1)},1500)}),n=l.Ticker.prototype=new l.events.EventDispatcher,n.constructor=l.Ticker;var A=g("core.Animation",function(t,e){if(this.vars=e=e||{},this._duration=this._totalDuration=t||0,this._delay=Number(e.delay)||0,this._timeScale=1,this._active=e.immediateRender===!0,this.data=e.data,this._reversed=e.reversed===!0,j){o||a.wake();var i=this.vars.useFrames?B:j;i.add(this,i._time),this.vars.paused&&this.paused(!0)}});a=A.ticker=new l.Ticker,n=A.prototype,n._dirty=n._gc=n._initted=n._paused=!1,n._totalTime=n._time=0,n._rawPrevTime=-1,n._next=n._last=n._onUpdate=n._timeline=n.timeline=null,n._paused=!1;var C=function(){o&&k()-R>2e3&&a.wake(),setTimeout(C,2e3)};C(),n.play=function(t,e){return null!=t&&this.seek(t,e),this.reversed(!1).paused(!1)},n.pause=function(t,e){return null!=t&&this.seek(t,e),this.paused(!0)},n.resume=function(t,e){return null!=t&&this.seek(t,e),this.paused(!1)},n.seek=function(t,e){return this.totalTime(Number(t),e!==!1)},n.restart=function(t,e){return this.reversed(!1).paused(!1).totalTime(t?-this._delay:0,e!==!1,!0)},n.reverse=function(t,e){return null!=t&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},n.render=function(){},n.invalidate=function(){return this._time=this._totalTime=0,this._initted=this._gc=!1,this._rawPrevTime=-1,(this._gc||!this.timeline)&&this._enabled(!0),this},n.isActive=function(){var t,e=this._timeline,i=this._startTime;return!e||!this._gc&&!this._paused&&e.isActive()&&(t=e.rawTime())>=i&&i+this.totalDuration()/this._timeScale>t},n._enabled=function(t,e){return o||a.wake(),this._gc=!t,this._active=this.isActive(),e!==!0&&(t&&!this.timeline?this._timeline.add(this,this._startTime-this._delay):!t&&this.timeline&&this._timeline._remove(this,!0)),!1},n._kill=function(){return this._enabled(!1,!1)},n.kill=function(t,e){return this._kill(t,e),this},n._uncache=function(t){for(var e=t?this:this.timeline;e;)e._dirty=!0,e=e.timeline;return this},n._swapSelfInParams=function(t){for(var e=t.length,i=t.concat();--e>-1;)"{self}"===t[e]&&(i[e]=this);return i},n.eventCallback=function(t,e,i,s){if("on"===(t||"").substr(0,2)){var r=this.vars;if(1===arguments.length)return r[t];null==e?delete r[t]:(r[t]=e,r[t+"Params"]=c(i)&&-1!==i.join("").indexOf("{self}")?this._swapSelfInParams(i):i,r[t+"Scope"]=s),"onUpdate"===t&&(this._onUpdate=e)}return this},n.delay=function(t){return arguments.length?(this._timeline.smoothChildTiming&&this.startTime(this._startTime+t-this._delay),this._delay=t,this):this._delay},n.duration=function(t){return arguments.length?(this._duration=this._totalDuration=t,this._uncache(!0),this._timeline.smoothChildTiming&&this._time>0&&this._time<this._duration&&0!==t&&this.totalTime(this._totalTime*(t/this._duration),!0),this):(this._dirty=!1,this._duration)},n.totalDuration=function(t){return this._dirty=!1,arguments.length?this.duration(t):this._totalDuration},n.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),this.totalTime(t>this._duration?this._duration:t,e)):this._time},n.totalTime=function(t,e,i){if(o||a.wake(),!arguments.length)return this._totalTime;if(this._timeline){if(0>t&&!i&&(t+=this.totalDuration()),this._timeline.smoothChildTiming){this._dirty&&this.totalDuration();var s=this._totalDuration,r=this._timeline;if(t>s&&!i&&(t=s),this._startTime=(this._paused?this._pauseTime:r._time)-(this._reversed?s-t:t)/this._timeScale,r._dirty||this._uncache(!1),r._timeline)for(;r._timeline;)r._timeline._time!==(r._startTime+r._totalTime)/r._timeScale&&r.totalTime(r._totalTime,!0),r=r._timeline}this._gc&&this._enabled(!0,!1),(this._totalTime!==t||0===this._duration)&&(this.render(t,e,!1),I.length&&q())}return this},n.progress=n.totalProgress=function(t,e){return arguments.length?this.totalTime(this.duration()*t,e):this._time/this.duration()},n.startTime=function(t){return arguments.length?(t!==this._startTime&&(this._startTime=t,this.timeline&&this.timeline._sortChildren&&this.timeline.add(this,t-this._delay)),this):this._startTime},n.endTime=function(t){return this._startTime+(0!=t?this.totalDuration():this.duration())/this._timeScale},n.timeScale=function(t){if(!arguments.length)return this._timeScale;if(t=t||_,this._timeline&&this._timeline.smoothChildTiming){var e=this._pauseTime,i=e||0===e?e:this._timeline.totalTime();this._startTime=i-(i-this._startTime)*this._timeScale/t}return this._timeScale=t,this._uncache(!1)},n.reversed=function(t){return arguments.length?(t!=this._reversed&&(this._reversed=t,this.totalTime(this._timeline&&!this._timeline.smoothChildTiming?this.totalDuration()-this._totalTime:this._totalTime,!0)),this):this._reversed},n.paused=function(t){if(!arguments.length)return this._paused;if(t!=this._paused&&this._timeline){o||t||a.wake();var e=this._timeline,i=e.rawTime(),s=i-this._pauseTime;!t&&e.smoothChildTiming&&(this._startTime+=s,this._uncache(!1)),this._pauseTime=t?i:null,this._paused=t,this._active=this.isActive(),!t&&0!==s&&this._initted&&this.duration()&&this.render(e.smoothChildTiming?this._totalTime:(i-this._startTime)/this._timeScale,!0,!0)}return this._gc&&!t&&this._enabled(!0,!1),this};var O=g("core.SimpleTimeline",function(t){A.call(this,0,t),this.autoRemoveChildren=this.smoothChildTiming=!0});n=O.prototype=new A,n.constructor=O,n.kill()._gc=!1,n._first=n._last=n._recent=null,n._sortChildren=!1,n.add=n.insert=function(t,e){var i,s;if(t._startTime=Number(e||0)+t._delay,t._paused&&this!==t._timeline&&(t._pauseTime=t._startTime+(this.rawTime()-t._startTime)/t._timeScale),t.timeline&&t.timeline._remove(t,!0),t.timeline=t._timeline=this,t._gc&&t._enabled(!0,!0),i=this._last,this._sortChildren)for(s=t._startTime;i&&i._startTime>s;)i=i._prev;return i?(t._next=i._next,i._next=t):(t._next=this._first,this._first=t),t._next?t._next._prev=t:this._last=t,t._prev=i,this._recent=t,this._timeline&&this._uncache(!0),this},n._remove=function(t,e){return t.timeline===this&&(e||t._enabled(!1,!0),t._prev?t._prev._next=t._next:this._first===t&&(this._first=t._next),t._next?t._next._prev=t._prev:this._last===t&&(this._last=t._prev),t._next=t._prev=t.timeline=null,t===this._recent&&(this._recent=this._last),this._timeline&&this._uncache(!0)),this},n.render=function(t,e,i){var s,r=this._first;for(this._totalTime=this._time=this._rawPrevTime=t;r;)s=r._next,(r._active||t>=r._startTime&&!r._paused)&&(r._reversed?r.render((r._dirty?r.totalDuration():r._totalDuration)-(t-r._startTime)*r._timeScale,e,i):r.render((t-r._startTime)*r._timeScale,e,i)),r=s},n.rawTime=function(){return o||a.wake(),this._totalTime};var D=g("TweenLite",function(e,i,s){if(A.call(this,i,s),this.render=D.prototype.render,null==e)throw"Cannot tween a null target.";this.target=e="string"!=typeof e?e:D.selector(e)||e;var r,n,a,o=e.jquery||e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType),h=this.vars.overwrite;if(this._overwrite=h=null==h?Y[D.defaultOverwrite]:"number"==typeof h?h>>0:Y[h],(o||e instanceof Array||e.push&&c(e))&&"number"!=typeof e[0])for(this._targets=a=u(e),this._propLookup=[],this._siblings=[],r=0;a.length>r;r++)n=a[r],n?"string"!=typeof n?n.length&&n!==t&&n[0]&&(n[0]===t||n[0].nodeType&&n[0].style&&!n.nodeType)?(a.splice(r--,1),this._targets=a=a.concat(u(n))):(this._siblings[r]=V(n,this,!1),1===h&&this._siblings[r].length>1&&W(n,this,null,1,this._siblings[r])):(n=a[r--]=D.selector(n),"string"==typeof n&&a.splice(r+1,1)):a.splice(r--,1);else this._propLookup={},this._siblings=V(e,this,!1),1===h&&this._siblings.length>1&&W(e,this,null,1,this._siblings);(this.vars.immediateRender||0===i&&0===this._delay&&this.vars.immediateRender!==!1)&&(this._time=-_,this.render(-this._delay))},!0),M=function(e){return e&&e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType)},z=function(t,e){var i,s={};for(i in t)U[i]||i in e&&"transform"!==i&&"x"!==i&&"y"!==i&&"width"!==i&&"height"!==i&&"className"!==i&&"border"!==i||!(!N[i]||N[i]&&N[i]._autoCSS)||(s[i]=t[i],delete t[i]);t.css=s};n=D.prototype=new A,n.constructor=D,n.kill()._gc=!1,n.ratio=0,n._firstPT=n._targets=n._overwrittenProps=n._startAt=null,n._notifyPluginsOfEnabled=n._lazy=!1,D.version="1.15.0",D.defaultEase=n._ease=new T(null,null,1,1),D.defaultOverwrite="auto",D.ticker=a,D.autoSleep=!0,D.lagSmoothing=function(t,e){a.lagSmoothing(t,e)},D.selector=t.$||t.jQuery||function(e){var i=t.$||t.jQuery;return i?(D.selector=i,i(e)):"undefined"==typeof document?e:document.querySelectorAll?document.querySelectorAll(e):document.getElementById("#"===e.charAt(0)?e.substr(1):e)};var I=[],E={},F=D._internals={isArray:c,isSelector:M,lazyTweens:I},N=D._plugins={},L=F.tweenLookup={},X=0,U=F.reservedProps={ease:1,delay:1,overwrite:1,onComplete:1,onCompleteParams:1,onCompleteScope:1,useFrames:1,runBackwards:1,startAt:1,onUpdate:1,onUpdateParams:1,onUpdateScope:1,onStart:1,onStartParams:1,onStartScope:1,onReverseComplete:1,onReverseCompleteParams:1,onReverseCompleteScope:1,onRepeat:1,onRepeatParams:1,onRepeatScope:1,easeParams:1,yoyo:1,immediateRender:1,repeat:1,repeatDelay:1,data:1,paused:1,reversed:1,autoCSS:1,lazy:1,onOverwrite:1},Y={none:0,all:1,auto:2,concurrent:3,allOnStart:4,preexisting:5,"true":1,"false":0},B=A._rootFramesTimeline=new O,j=A._rootTimeline=new O,q=F.lazyRender=function(){var t,e=I.length;for(E={};--e>-1;)t=I[e],t&&t._lazy!==!1&&(t.render(t._lazy[0],t._lazy[1],!0),t._lazy=!1);I.length=0};j._startTime=a.time,B._startTime=a.frame,j._active=B._active=!0,setTimeout(q,1),A._updateRoot=D.render=function(){var t,e,i;if(I.length&&q(),j.render((a.time-j._startTime)*j._timeScale,!1,!1),B.render((a.frame-B._startTime)*B._timeScale,!1,!1),I.length&&q(),!(a.frame%120)){for(i in L){for(e=L[i].tweens,t=e.length;--t>-1;)e[t]._gc&&e.splice(t,1);0===e.length&&delete L[i]}if(i=j._first,(!i||i._paused)&&D.autoSleep&&!B._first&&1===a._listeners.tick.length){for(;i&&i._paused;)i=i._next;i||a.sleep()}}},a.addEventListener("tick",A._updateRoot);var V=function(t,e,i){var s,r,n=t._gsTweenID;if(L[n||(t._gsTweenID=n="t"+X++)]||(L[n]={target:t,tweens:[]}),e&&(s=L[n].tweens,s[r=s.length]=e,i))for(;--r>-1;)s[r]===e&&s.splice(r,1);return L[n].tweens},G=function(t,e,i,s){var r,n,a=t.vars.onOverwrite;return a&&(r=a(t,e,i,s)),a=D.onOverwrite,a&&(n=a(t,e,i,s)),r!==!1&&n!==!1},W=function(t,e,i,s,r){var n,a,o,h;if(1===s||s>=4){for(h=r.length,n=0;h>n;n++)if((o=r[n])!==e)o._gc||G(o,e)&&o._enabled(!1,!1)&&(a=!0);else if(5===s)break;return a}var l,u=e._startTime+_,p=[],c=0,f=0===e._duration;for(n=r.length;--n>-1;)(o=r[n])===e||o._gc||o._paused||(o._timeline!==e._timeline?(l=l||Z(e,0,f),0===Z(o,l,f)&&(p[c++]=o)):u>=o._startTime&&o._startTime+o.totalDuration()/o._timeScale>u&&((f||!o._initted)&&2e-10>=u-o._startTime||(p[c++]=o)));for(n=c;--n>-1;)if(o=p[n],2===s&&o._kill(i,t,e)&&(a=!0),2!==s||!o._firstPT&&o._initted){if(2!==s&&!G(o,e))continue;o._enabled(!1,!1)&&(a=!0)}return a},Z=function(t,e,i){for(var s=t._timeline,r=s._timeScale,n=t._startTime;s._timeline;){if(n+=s._startTime,r*=s._timeScale,s._paused)return-100;s=s._timeline}return n/=r,n>e?n-e:i&&n===e||!t._initted&&2*_>n-e?_:(n+=t.totalDuration()/t._timeScale/r)>e+_?0:n-e-_};n._init=function(){var t,e,i,s,r,n=this.vars,a=this._overwrittenProps,o=this._duration,h=!!n.immediateRender,l=n.ease;if(n.startAt){this._startAt&&(this._startAt.render(-1,!0),this._startAt.kill()),r={};for(s in n.startAt)r[s]=n.startAt[s];if(r.overwrite=!1,r.immediateRender=!0,r.lazy=h&&n.lazy!==!1,r.startAt=r.delay=null,this._startAt=D.to(this.target,0,r),h)if(this._time>0)this._startAt=null;else if(0!==o)return}else if(n.runBackwards&&0!==o)if(this._startAt)this._startAt.render(-1,!0),this._startAt.kill(),this._startAt=null;else{0!==this._time&&(h=!1),i={};for(s in n)U[s]&&"autoCSS"!==s||(i[s]=n[s]);if(i.overwrite=0,i.data="isFromStart",i.lazy=h&&n.lazy!==!1,i.immediateRender=h,this._startAt=D.to(this.target,0,i),h){if(0===this._time)return}else this._startAt._init(),this._startAt._enabled(!1),this.vars.immediateRender&&(this._startAt=null)}if(this._ease=l=l?l instanceof T?l:"function"==typeof l?new T(l,n.easeParams):w[l]||D.defaultEase:D.defaultEase,n.easeParams instanceof Array&&l.config&&(this._ease=l.config.apply(l,n.easeParams)),this._easeType=this._ease._type,this._easePower=this._ease._power,this._firstPT=null,this._targets)for(t=this._targets.length;--t>-1;)this._initProps(this._targets[t],this._propLookup[t]={},this._siblings[t],a?a[t]:null)&&(e=!0);else e=this._initProps(this.target,this._propLookup,this._siblings,a);if(e&&D._onPluginEvent("_onInitAllProps",this),a&&(this._firstPT||"function"!=typeof this.target&&this._enabled(!1,!1)),n.runBackwards)for(i=this._firstPT;i;)i.s+=i.c,i.c=-i.c,i=i._next;this._onUpdate=n.onUpdate,this._initted=!0},n._initProps=function(e,i,s,r){var n,a,o,h,l,_;if(null==e)return!1;E[e._gsTweenID]&&q(),this.vars.css||e.style&&e!==t&&e.nodeType&&N.css&&this.vars.autoCSS!==!1&&z(this.vars,e);for(n in this.vars){if(_=this.vars[n],U[n])_&&(_ instanceof Array||_.push&&c(_))&&-1!==_.join("").indexOf("{self}")&&(this.vars[n]=_=this._swapSelfInParams(_,this));else if(N[n]&&(h=new N[n])._onInitTween(e,this.vars[n],this)){for(this._firstPT=l={_next:this._firstPT,t:h,p:"setRatio",s:0,c:1,f:!0,n:n,pg:!0,pr:h._priority},a=h._overwriteProps.length;--a>-1;)i[h._overwriteProps[a]]=this._firstPT;(h._priority||h._onInitAllProps)&&(o=!0),(h._onDisable||h._onEnable)&&(this._notifyPluginsOfEnabled=!0)}else this._firstPT=i[n]=l={_next:this._firstPT,t:e,p:n,f:"function"==typeof e[n],n:n,pg:!1,pr:0},l.s=l.f?e[n.indexOf("set")||"function"!=typeof e["get"+n.substr(3)]?n:"get"+n.substr(3)]():parseFloat(e[n]),l.c="string"==typeof _&&"="===_.charAt(1)?parseInt(_.charAt(0)+"1",10)*Number(_.substr(2)):Number(_)-l.s||0;l&&l._next&&(l._next._prev=l)}return r&&this._kill(r,e)?this._initProps(e,i,s,r):this._overwrite>1&&this._firstPT&&s.length>1&&W(e,this,i,this._overwrite,s)?(this._kill(i,e),this._initProps(e,i,s,r)):(this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration)&&(E[e._gsTweenID]=!0),o)},n.render=function(t,e,i){var s,r,n,a,o=this._time,h=this._duration,l=this._rawPrevTime;if(t>=h)this._totalTime=this._time=h,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1,this._reversed||(s=!0,r="onComplete"),0===h&&(this._initted||!this.vars.lazy||i)&&(this._startTime===this._timeline._duration&&(t=0),(0===t||0>l||l===_&&"isPause"!==this.data)&&l!==t&&(i=!0,l>_&&(r="onReverseComplete")),this._rawPrevTime=a=!e||t||l===t?t:_);else if(1e-7>t)this._totalTime=this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==o||0===h&&l>0&&l!==_)&&(r="onReverseComplete",s=this._reversed),0>t&&(this._active=!1,0===h&&(this._initted||!this.vars.lazy||i)&&(l>=0&&(l!==_||"isPause"!==this.data)&&(i=!0),this._rawPrevTime=a=!e||t||l===t?t:_)),this._initted||(i=!0);else if(this._totalTime=this._time=t,this._easeType){var u=t/h,p=this._easeType,c=this._easePower;(1===p||3===p&&u>=.5)&&(u=1-u),3===p&&(u*=2),1===c?u*=u:2===c?u*=u*u:3===c?u*=u*u*u:4===c&&(u*=u*u*u*u),this.ratio=1===p?1-u:2===p?u:.5>t/h?u/2:1-u/2}else this.ratio=this._ease.getRatio(t/h);if(this._time!==o||i){if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration))return this._time=this._totalTime=o,this._rawPrevTime=l,I.push(this),this._lazy=[t,e],void 0;this._time&&!s?this.ratio=this._ease.getRatio(this._time/h):s&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(this._lazy!==!1&&(this._lazy=!1),this._active||!this._paused&&this._time!==o&&t>=0&&(this._active=!0),0===o&&(this._startAt&&(t>=0?this._startAt.render(t,e,i):r||(r="_dummyGS")),this.vars.onStart&&(0!==this._time||0===h)&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||y))),n=this._firstPT;n;)n.f?n.t[n.p](n.c*this.ratio+n.s):n.t[n.p]=n.c*this.ratio+n.s,n=n._next;this._onUpdate&&(0>t&&this._startAt&&t!==-1e-4&&this._startAt.render(t,e,i),e||(this._time!==o||s)&&this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||y)),r&&(!this._gc||i)&&(0>t&&this._startAt&&!this._onUpdate&&t!==-1e-4&&this._startAt.render(t,e,i),s&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[r]&&this.vars[r].apply(this.vars[r+"Scope"]||this,this.vars[r+"Params"]||y),0===h&&this._rawPrevTime===_&&a!==_&&(this._rawPrevTime=0))}},n._kill=function(t,e,i){if("all"===t&&(t=null),null==t&&(null==e||e===this.target))return this._lazy=!1,this._enabled(!1,!1);e="string"!=typeof e?e||this._targets||this.target:D.selector(e)||e;var s,r,n,a,o,h,l,_,u;if((c(e)||M(e))&&"number"!=typeof e[0])for(s=e.length;--s>-1;)this._kill(t,e[s])&&(h=!0);else{if(this._targets){for(s=this._targets.length;--s>-1;)if(e===this._targets[s]){o=this._propLookup[s]||{},this._overwrittenProps=this._overwrittenProps||[],r=this._overwrittenProps[s]=t?this._overwrittenProps[s]||{}:"all";break}}else{if(e!==this.target)return!1;o=this._propLookup,r=this._overwrittenProps=t?this._overwrittenProps||{}:"all"}if(o){if(l=t||o,_=t!==r&&"all"!==r&&t!==o&&("object"!=typeof t||!t._tempKill),i&&(D.onOverwrite||this.vars.onOverwrite)){for(n in l)o[n]&&(u||(u=[]),u.push(n));
if(!G(this,i,e,u))return!1}for(n in l)(a=o[n])&&(a.pg&&a.t._kill(l)&&(h=!0),a.pg&&0!==a.t._overwriteProps.length||(a._prev?a._prev._next=a._next:a===this._firstPT&&(this._firstPT=a._next),a._next&&(a._next._prev=a._prev),a._next=a._prev=null),delete o[n]),_&&(r[n]=1);!this._firstPT&&this._initted&&this._enabled(!1,!1)}}return h},n.invalidate=function(){return this._notifyPluginsOfEnabled&&D._onPluginEvent("_onDisable",this),this._firstPT=this._overwrittenProps=this._startAt=this._onUpdate=null,this._notifyPluginsOfEnabled=this._active=this._lazy=!1,this._propLookup=this._targets?{}:[],A.prototype.invalidate.call(this),this.vars.immediateRender&&(this._time=-_,this.render(-this._delay)),this},n._enabled=function(t,e){if(o||a.wake(),t&&this._gc){var i,s=this._targets;if(s)for(i=s.length;--i>-1;)this._siblings[i]=V(s[i],this,!0);else this._siblings=V(this.target,this,!0)}return A.prototype._enabled.call(this,t,e),this._notifyPluginsOfEnabled&&this._firstPT?D._onPluginEvent(t?"_onEnable":"_onDisable",this):!1},D.to=function(t,e,i){return new D(t,e,i)},D.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new D(t,e,i)},D.fromTo=function(t,e,i,s){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,new D(t,e,s)},D.delayedCall=function(t,e,i,s,r){return new D(e,0,{delay:t,onComplete:e,onCompleteParams:i,onCompleteScope:s,onReverseComplete:e,onReverseCompleteParams:i,onReverseCompleteScope:s,immediateRender:!1,lazy:!1,useFrames:r,overwrite:0})},D.set=function(t,e){return new D(t,0,e)},D.getTweensOf=function(t,e){if(null==t)return[];t="string"!=typeof t?t:D.selector(t)||t;var i,s,r,n;if((c(t)||M(t))&&"number"!=typeof t[0]){for(i=t.length,s=[];--i>-1;)s=s.concat(D.getTweensOf(t[i],e));for(i=s.length;--i>-1;)for(n=s[i],r=i;--r>-1;)n===s[r]&&s.splice(i,1)}else for(s=V(t).concat(),i=s.length;--i>-1;)(s[i]._gc||e&&!s[i].isActive())&&s.splice(i,1);return s},D.killTweensOf=D.killDelayedCallsTo=function(t,e,i){"object"==typeof e&&(i=e,e=!1);for(var s=D.getTweensOf(t,e),r=s.length;--r>-1;)s[r]._kill(i,t)};var Q=g("plugins.TweenPlugin",function(t,e){this._overwriteProps=(t||"").split(","),this._propName=this._overwriteProps[0],this._priority=e||0,this._super=Q.prototype},!0);if(n=Q.prototype,Q.version="1.10.1",Q.API=2,n._firstPT=null,n._addTween=function(t,e,i,s,r,n){var a,o;return null!=s&&(a="number"==typeof s||"="!==s.charAt(1)?Number(s)-i:parseInt(s.charAt(0)+"1",10)*Number(s.substr(2)))?(this._firstPT=o={_next:this._firstPT,t:t,p:e,s:i,c:a,f:"function"==typeof t[e],n:r||e,r:n},o._next&&(o._next._prev=o),o):void 0},n.setRatio=function(t){for(var e,i=this._firstPT,s=1e-6;i;)e=i.c*t+i.s,i.r?e=Math.round(e):s>e&&e>-s&&(e=0),i.f?i.t[i.p](e):i.t[i.p]=e,i=i._next},n._kill=function(t){var e,i=this._overwriteProps,s=this._firstPT;if(null!=t[this._propName])this._overwriteProps=[];else for(e=i.length;--e>-1;)null!=t[i[e]]&&i.splice(e,1);for(;s;)null!=t[s.n]&&(s._next&&(s._next._prev=s._prev),s._prev?(s._prev._next=s._next,s._prev=null):this._firstPT===s&&(this._firstPT=s._next)),s=s._next;return!1},n._roundProps=function(t,e){for(var i=this._firstPT;i;)(t[this._propName]||null!=i.n&&t[i.n.split(this._propName+"_").join("")])&&(i.r=e),i=i._next},D._onPluginEvent=function(t,e){var i,s,r,n,a,o=e._firstPT;if("_onInitAllProps"===t){for(;o;){for(a=o._next,s=r;s&&s.pr>o.pr;)s=s._next;(o._prev=s?s._prev:n)?o._prev._next=o:r=o,(o._next=s)?s._prev=o:n=o,o=a}o=e._firstPT=r}for(;o;)o.pg&&"function"==typeof o.t[t]&&o.t[t]()&&(i=!0),o=o._next;return i},Q.activate=function(t){for(var e=t.length;--e>-1;)t[e].API===Q.API&&(N[(new t[e])._propName]=t[e]);return!0},d.plugin=function(t){if(!(t&&t.propName&&t.init&&t.API))throw"illegal plugin definition.";var e,i=t.propName,s=t.priority||0,r=t.overwriteProps,n={init:"_onInitTween",set:"setRatio",kill:"_kill",round:"_roundProps",initAll:"_onInitAllProps"},a=g("plugins."+i.charAt(0).toUpperCase()+i.substr(1)+"Plugin",function(){Q.call(this,i,s),this._overwriteProps=r||[]},t.global===!0),o=a.prototype=new Q(i);o.constructor=a,a.API=t.API;for(e in n)"function"==typeof t[e]&&(o[n[e]]=t[e]);return a.version=t.version,Q.activate([a]),a},s=t._gsQueue){for(r=0;s.length>r;r++)s[r]();for(n in f)f[n].func||t.console.log("GSAP encountered missing dependency: com.greensock."+n)}o=!1}}("undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window,"TweenMax");
/*!
 * VERSION: 1.7.4
 * DATE: 2014-07-17
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";var t=document.documentElement,e=window,i=function(i,r){var s="x"===r?"Width":"Height",n="scroll"+s,o="client"+s,a=document.body;return i===e||i===t||i===a?Math.max(t[n],a[n])-(e["inner"+s]||Math.max(t[o],a[o])):i[n]-i["offset"+s]},r=_gsScope._gsDefine.plugin({propName:"scrollTo",API:2,version:"1.7.4",init:function(t,r,s){return this._wdw=t===e,this._target=t,this._tween=s,"object"!=typeof r&&(r={y:r}),this.vars=r,this._autoKill=r.autoKill!==!1,this.x=this.xPrev=this.getX(),this.y=this.yPrev=this.getY(),null!=r.x?(this._addTween(this,"x",this.x,"max"===r.x?i(t,"x"):r.x,"scrollTo_x",!0),this._overwriteProps.push("scrollTo_x")):this.skipX=!0,null!=r.y?(this._addTween(this,"y",this.y,"max"===r.y?i(t,"y"):r.y,"scrollTo_y",!0),this._overwriteProps.push("scrollTo_y")):this.skipY=!0,!0},set:function(t){this._super.setRatio.call(this,t);var r=this._wdw||!this.skipX?this.getX():this.xPrev,s=this._wdw||!this.skipY?this.getY():this.yPrev,n=s-this.yPrev,o=r-this.xPrev;this._autoKill&&(!this.skipX&&(o>7||-7>o)&&i(this._target,"x")>r&&(this.skipX=!0),!this.skipY&&(n>7||-7>n)&&i(this._target,"y")>s&&(this.skipY=!0),this.skipX&&this.skipY&&(this._tween.kill(),this.vars.onAutoKill&&this.vars.onAutoKill.apply(this.vars.onAutoKillScope||this._tween,this.vars.onAutoKillParams||[]))),this._wdw?e.scrollTo(this.skipX?r:this.x,this.skipY?s:this.y):(this.skipY||(this._target.scrollTop=this.y),this.skipX||(this._target.scrollLeft=this.x)),this.xPrev=this.x,this.yPrev=this.y}}),s=r.prototype;r.max=i,s.getX=function(){return this._wdw?null!=e.pageXOffset?e.pageXOffset:null!=t.scrollLeft?t.scrollLeft:document.body.scrollLeft:this._target.scrollLeft},s.getY=function(){return this._wdw?null!=e.pageYOffset?e.pageYOffset:null!=t.scrollTop?t.scrollTop:document.body.scrollTop:this._target.scrollTop},s._kill=function(t){return t.scrollTo_x&&(this.skipX=!0),t.scrollTo_y&&(this.skipY=!0),this._super._kill.call(this,t)}}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()();
/*!
 * VERSION: 0.9.5
 * DATE: 2014-04-16
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * ThrowPropsPlugin is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit http://www.greensock.com/club/ to sign up or get more details.
 * This work is subject to the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";window._gsDefine("plugins.ThrowPropsPlugin",["plugins.TweenPlugin","TweenLite","easing.Ease","utils.VelocityTracker"],function(a,b,c,d){var t,u,v,w,e=function(){a.call(this,"throwProps"),this._overwriteProps.length=0},f=999999999999999,g=1e-10,h=!1,i={x:1,y:1,z:2,scale:1,scaleX:1,scaleY:1,rotation:1,rotationZ:1,rotationX:2,rotationY:2,skewX:1,skewY:1},j=String.fromCharCode(103,114,101,101,110,115,111,99,107,46,99,111,109),k=String.fromCharCode(47,114,101,113,117,105,114,101,115,45,109,101,109,98,101,114,115,104,105,112,47),l=function(a){for(var b=[j,String.fromCharCode(99,111,100,101,112,101,110,46,105,111),String.fromCharCode(99,100,112,110,46,105,111),String.fromCharCode(103,97,110,110,111,110,46,116,118),String.fromCharCode(99,111,100,101,99,97,110,121,111,110,46,110,101,116),String.fromCharCode(116,104,101,109,101,102,111,114,101,115,116,46,110,101,116),String.fromCharCode(99,101,114,101,98,114,97,120,46,99,111,46,117,107)],c=b.length;--c>-1;)if(-1!==a.indexOf(b[c]))return!0;return-1!==(j).indexOf(String.fromCharCode(103,114,101,101,110,115,111,99,107))&&-1!==a.indexOf(String.fromCharCode(108,111,99,97,108,104,111,115,116))}(j),m=function(a,b,c,d){for(var i,j,e=b.length,g=0,h=f;--e>-1;)i=b[e],j=i-a,0>j&&(j=-j),h>j&&i>=d&&c>=i&&(g=e,h=j);return b[g]},n=function(a,b,c,d){if("auto"===a.end)return a;c=isNaN(c)?f:c,d=isNaN(d)?-f:d;var e="function"==typeof a.end?a.end(b):a.end instanceof Array?m(b,a.end,c,d):Number(a.end);return e>c?e=c:d>e&&(e=d),{max:e,min:e,unitFactor:a.unitFactor}},o=function(a,b,c){for(var d in b)void 0===a[d]&&d!==c&&(a[d]=b[d]);return a},p=e.calculateChange=function(a,d,e,f){null==f&&(f=.05);var g=d instanceof c?d:d?new c(d):b.defaultEase;return e*f*a/g.getRatio(f)},q=e.calculateDuration=function(a,d,e,f,g){g=g||.05;var h=f instanceof c?f:f?new c(f):b.defaultEase;return Math.abs((d-a)*h.getRatio(g)/e/g)},r=e.calculateTweenDuration=function(a,f,i,j,k,l){if("string"==typeof a&&(a=b.selector(a)),!a)return 0;null==i&&(i=10),null==j&&(j=.2),null==k&&(k=1),a.length&&(a=a[0]||a);var w,x,y,z,A,B,C,D,E,F,m=0,r=9999999999,s=f.throwProps||f,t=f.ease instanceof c?f.ease:f.ease?new c(f.ease):b.defaultEase,u=isNaN(s.checkpoint)?.05:Number(s.checkpoint),v=isNaN(s.resistance)?e.defaultResistance:Number(s.resistance);for(w in s)"resistance"!==w&&"checkpoint"!==w&&"preventOvershoot"!==w&&(x=s[w],"object"!=typeof x&&(E=E||d.getByTarget(a),E&&E.isTrackingProp(w)?x="number"==typeof x?{velocity:x}:{velocity:E.getVelocity(w)}:(z=Number(x)||0,y=z*v>0?z/v:z/-v)),"object"==typeof x&&(void 0!==x.velocity&&"number"==typeof x.velocity?z=Number(x.velocity)||0:(E=E||d.getByTarget(a),z=E&&E.isTrackingProp(w)?E.getVelocity(w):0),A=isNaN(x.resistance)?v:Number(x.resistance),y=z*A>0?z/A:z/-A,B="function"==typeof a[w]?a[w.indexOf("set")||"function"!=typeof a["get"+w.substr(3)]?w:"get"+w.substr(3)]():a[w]||0,C=B+p(z,t,y,u),void 0!==x.end&&(x=n(x,C,x.max,x.min),(l||h)&&(s[w]=o(x,s[w],"end"))),void 0!==x.max&&C>Number(x.max)+g?(F=x.unitFactor||e.defaultUnitFactors[w]||1,D=B>x.max&&x.min!==x.max||z*F>-15&&45>z*F?j+.1*(i-j):q(B,x.max,z,t,u),r>D+k&&(r=D+k)):void 0!==x.min&&C<Number(x.min)-g&&(F=x.unitFactor||e.defaultUnitFactors[w]||1,D=B<x.min&&x.min!==x.max||z*F>-45&&15>z*F?j+.1*(i-j):q(B,x.min,z,t,u),r>D+k&&(r=D+k)),D>m&&(m=D)),y>m&&(m=y));return m>r&&(m=r),m>i?i:j>m?j:m},s=e.prototype=new a("throwProps");return s.constructor=e,e.version="0.9.5",e.API=2,e._autoCSS=!0,e.defaultResistance=100,e.defaultUnitFactors={time:1e3,totalTime:1e3},e.track=function(a,b,c){return d.track(a,b,c)},e.untrack=function(a,b){d.untrack(a,b)},e.isTracking=function(a,b){return d.isTracking(a,b)},e.getVelocity=function(a,b){var c=d.getByTarget(a);return c?c.getVelocity(b):0/0},e._cssRegister=function(){var a=(window.GreenSockGlobals||window).com.greensock.plugins.CSSPlugin;if(a){var b=a._internals,c=b._parseToProxy,f=b._setPluginRatio,g=b.CSSPropTween;b._registerComplexSpecialProp("throwProps",{parser:function(a,b,h,j,k,l){l=new e;var s,v,w,x,y,m={},n={},o={},p={},q={},r={};u={};for(w in b)"resistance"!==w&&"preventOvershoot"!==w&&(v=b[w],"object"==typeof v?(void 0!==v.velocity&&"number"==typeof v.velocity?m[w]=Number(v.velocity)||0:(y=y||d.getByTarget(a),m[w]=y&&y.isTrackingProp(w)?y.getVelocity(w):0),void 0!==v.end&&(p[w]=v.end),void 0!==v.min&&(n[w]=v.min),void 0!==v.max&&(o[w]=v.max),v.preventOvershoot&&(r[w]=!0),void 0!==v.resistance&&(s=!0,q[w]=v.resistance)):"number"==typeof v?m[w]=v:(y=y||d.getByTarget(a),m[w]=y&&y.isTrackingProp(w)?y.getVelocity(w):v||0),i[w]&&j._enableTransforms(2===i[w]));x=c(a,m,j,k,l),t=x.proxy,m=x.end;for(w in t)u[w]={velocity:m[w],min:n[w],max:o[w],end:p[w],resistance:q[w],preventOvershoot:r[w]};return null!=b.resistance&&(u.resistance=b.resistance),b.preventOvershoot&&(u.preventOvershoot=!0),k=new g(a,"throwProps",0,0,x.pt,2),k.plugin=l,k.setRatio=f,k.data=x,l._onInitTween(t,u,j._tween),k}})}},e.to=function(a,c,d,e,f){c.throwProps||(c={throwProps:c}),0===f&&(c.throwProps.preventOvershoot=!0),h=!0;var g=new b(a,1,c);return g.render(0,!0,!0),g.vars.css?(g.duration(r(t,{throwProps:u,ease:c.ease},d,e,f)),g._delay&&!g.vars.immediateRender?g.invalidate():v._onInitTween(t,w,g),h=!1,g):(g.kill(),g=new b(a,r(a,c,d,e,f),c),h=!1,g)},s._onInitTween=function(a,b,c){if(this.target=a,this._props=[],!l)return window.location.href="http://"+j+k+"?plugin="+this._propName,!1;v=this,w=b;var q,r,s,t,u,x,y,z,A,e=c._ease,f=isNaN(b.checkpoint)?.05:Number(b.checkpoint),g=c._duration,i=b.preventOvershoot,m=0;for(q in b)if("resistance"!==q&&"checkpoint"!==q&&"preventOvershoot"!==q){if(r=b[q],"number"==typeof r)u=Number(r)||0;else if("object"!=typeof r||isNaN(r.velocity)){if(A=A||d.getByTarget(a),!A||!A.isTrackingProp(q))throw"ERROR: No velocity was defined in the throwProps tween of "+a+" property: "+q;u=A.getVelocity(q)}else u=Number(r.velocity);x=p(u,e,g,f),z=0,t="function"==typeof a[q],s=t?a[q.indexOf("set")||"function"!=typeof a["get"+q.substr(3)]?q:"get"+q.substr(3)]():a[q],"object"==typeof r&&(y=s+x,void 0!==r.end&&(r=n(r,y,r.max,r.min),h&&(b[q]=o(r,b[q],"end"))),void 0!==r.max&&Number(r.max)<y?i||r.preventOvershoot?x=r.max-s:z=r.max-s-x:void 0!==r.min&&Number(r.min)>y&&(i||r.preventOvershoot?x=r.min-s:z=r.min-s-x)),this._props[m++]={p:q,s:s,c1:x,c2:z,f:t,r:!1},this._overwriteProps[m]=q}return l},s._kill=function(b){for(var c=this._props.length;--c>-1;)null!=b[this._props[c].p]&&this._props.splice(c,1);return a.prototype._kill.call(this,b)},s._roundProps=function(a,b){for(var c=this._props,d=c.length;--d>-1;)(a[c[d]]||a.throwProps)&&(c[d].r=b)},s.setRatio=function(a){for(var c,d,b=this._props.length;--b>-1;)c=this._props[b],d=c.s+c.c1*a+c.c2*a*a,c.r&&(d=Math.round(d)),c.f?this.target[c.p](d):this.target[c.p]=d},a.activate([e]),e},!0),window._gsDefine("utils.VelocityTracker",["TweenLite"],function(a){var b,c,d,e,f=/([A-Z])/g,g={},h={x:1,y:1,z:2,scale:1,scaleX:1,scaleY:1,rotation:1,rotationZ:1,rotationX:2,rotationY:2,skewX:1,skewY:1},i=document.defaultView?document.defaultView.getComputedStyle:function(){},j=String.fromCharCode(103,114,101,101,110,115,111,99,107,46,99,111,109),k=String.fromCharCode(47,114,101,113,117,105,114,101,115,45,109,101,109,98,101,114,115,104,105,112,47),l=function(a){for(var b=[j,String.fromCharCode(99,111,100,101,112,101,110,46,105,111),String.fromCharCode(99,100,112,110,46,105,111),String.fromCharCode(103,97,110,110,111,110,46,116,118),String.fromCharCode(99,111,100,101,99,97,110,121,111,110,46,110,101,116),String.fromCharCode(116,104,101,109,101,102,111,114,101,115,116,46,110,101,116),String.fromCharCode(99,101,114,101,98,114,97,120,46,99,111,46,117,107)],c=b.length;--c>-1;)if(-1!==a.indexOf(b[c]))return!0;return-1!==(j).indexOf(String.fromCharCode(103,114,101,101,110,115,111,99,107))&&-1!==a.indexOf(String.fromCharCode(108,111,99,97,108,104,111,115,116))}(j),m=function(a,b,c){var d=(a._gsTransform||g)[b];return d||0===d?d:(a.style[b]?d=a.style[b]:(c=c||i(a,null))?(a=c.getPropertyValue(b.replace(f,"-$1").toLowerCase()),d=a||c.length?a:c[b]):a.currentStyle&&(c=a.currentStyle,d=c[b]),parseFloat(d)||0)},n=a.ticker,o=function(a,b,c){this.p=a,this.f=b,this.v1=this.v2=0,this.t1=this.t2=n.time,this.css=!1,this.type="",this._prev=null,c&&(this._next=c,c._prev=this)},p=function(){var f,g,a=b,c=n.time;if(c-d>=.03)for(e=d,d=c;a;){for(g=a._firstVP;g;)f=g.css?m(a.target,g.p):g.f?a.target[g.p]():a.target[g.p],(f!==g.v1||c-g.t1>.15)&&(g.v2=g.v1,g.v1=f,g.t2=g.t1,g.t1=c),g=g._next;a=a._next}},q=function(a){this._lookup={},this.target=a,this.elem=a.style&&a.nodeType?!0:!1,c||(n.addEventListener("tick",p,null,!1,-100),d=e=n.time,c=!0),b&&(this._next=b,b._prev=this),b=this},r=q.getByTarget=function(a){for(var c=b;c;){if(c.target===a)return c;c=c._next}},s=q.prototype;return s.addProp=function(b,c){if(!this._lookup[b]){var d=this.target,e="function"==typeof d[b],f=e?this._altProp(b):b,g=this._firstVP;this._firstVP=this._lookup[b]=this._lookup[f]=g=new o(f!==b&&0===b.indexOf("set")?f:b,e,g),g.css=this.elem&&(void 0!==this.target.style[g.p]||h[g.p]),g.css&&h[g.p]&&!d._gsTransform&&a.set(d,{x:"+=0"}),g.type=c||g.css&&0===b.indexOf("rotation")?"deg":"",g.v1=g.v2=g.css?m(d,g.p):e?d[g.p]():d[g.p]}},s.removeProp=function(a){var b=this._lookup[a];b&&(b._prev?b._prev._next=b._next:b===this._firstVP&&(this._firstVP=b._next),b._next&&(b._next._prev=b._prev),this._lookup[a]=0,b.f&&(this._lookup[this._altProp(a)]=0))},s.isTrackingProp=function(a){return this._lookup[a]instanceof o},s.getVelocity=function(a){var d,e,f,b=this._lookup[a],c=this.target;if(!b)throw"The velocity of "+a+" is not being tracked.";return d=b.css?m(c,b.p):b.f?c[b.p]():c[b.p],e=d-b.v2,("rad"===b.type||"deg"===b.type)&&(f="rad"===b.type?2*Math.PI:360,e%=f,e!==e%(f/2)&&(e=0>e?e+f:e-f)),e/(n.time-b.t2)},s._altProp=function(a){var b=a.substr(0,3),c=("get"===b?"set":"set"===b?"get":b)+a.substr(3);return"function"==typeof this.target[c]?c:a},q.getByTarget=function(c){var d=b;for("string"==typeof c&&(c=a.selector(c)),c.length&&c!==window&&c[0]&&c[0].style&&!c.nodeType&&(c=c[0]);d;){if(d.target===c)return d;d=d._next}},q.track=function(a,b,c){var d=r(a),e=b.split(","),f=e.length;for(c=(c||"").split(","),d||(d=new q(a));--f>-1;)d.addProp(e[f],c[f]||c[0]);return d},q.untrack=function(a,c){var d=r(a),e=(c||"").split(","),f=e.length;if(d){for(;--f>-1;)d.removeProp(e[f]);d._firstVP&&c||(d._prev?d._prev._next=d._next:d===b&&(b=d._next),d._next&&(d._next._prev=d._prev))}},q.isTracking=function(a,b){var c=r(a);return c?!b&&c._firstVP?!0:c.isTrackingProp(b):!1},l?q:(window.location.href="http://"+j+k+"?plugin=VelocityTracker",!1)},!0)}),window._gsDefine&&window._gsQueue.pop()();
/*!
 * VERSION: 0.10.8
 * DATE: 2014-11-14
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * Requires TweenLite and CSSPlugin version 1.11.0 or later (TweenMax contains both TweenLite and CSSPlugin). ThrowPropsPlugin is required for momentum-based continuation of movement after the mouse/touch is released (ThrowPropsPlugin is a membership benefit of Club GreenSock - http://www.greensock.com/club/).
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";_gsScope._gsDefine("utils.Draggable",["events.EventDispatcher","TweenLite"],function(t,e){var i,s,r,n,a,o={css:{}},h={css:{}},l={css:{}},u={css:{}},_=_gsScope._gsDefine.globals,c={},f=document,p=f.documentElement||{},d=[],m=function(){return!1},g=180/Math.PI,v=999999999999999,y=Date.now||function(){return(new Date).getTime()},T=!f.addEventListener&&f.all,w=[],x={},b=0,P=/^(?:a|input|textarea|button|select)$/i,S=0,C=0,k=function(t){if("string"==typeof t&&(t=e.selector(t)),!t||t.nodeType)return[t];var i,s=[],r=t.length;for(i=0;i!==r;s.push(t[i++]));return s},R=function(){for(var t=w.length;--t>-1;)w[t]()},A=function(t){w.push(t),1===w.length&&e.ticker.addEventListener("tick",R,this,!1,1)},D=function(t){for(var i=w.length;--i>-1;)w[i]===t&&w.splice(i,1);e.to(O,0,{overwrite:"all",delay:15,onComplete:O})},O=function(){w.length||e.ticker.removeEventListener("tick",R)},M=function(t,e){var i;for(i in e)void 0===t[i]&&(t[i]=e[i]);return t},L=function(){return null!=window.pageYOffset?window.pageYOffset:null!=f.scrollTop?f.scrollTop:p.scrollTop||f.body.scrollTop||0},N=function(){return null!=window.pageXOffset?window.pageXOffset:null!=f.scrollLeft?f.scrollLeft:p.scrollLeft||f.body.scrollLeft||0},E=function(t,e){return t=t||window.event,c.pageX=t.clientX+f.body.scrollLeft+p.scrollLeft,c.pageY=t.clientY+f.body.scrollTop+p.scrollTop,e&&(t.returnValue=!1),c},I=function(t){return t?("string"==typeof t&&(t=e.selector(t)),t.length&&t!==window&&t[0]&&t[0].style&&!t.nodeType&&(t=t[0]),t===window||t.nodeType&&t.style?t:null):t},z=function(t,e){var s,r,n,a=t.style;if(void 0===a[e]){for(n=["O","Moz","ms","Ms","Webkit"],r=5,s=e.charAt(0).toUpperCase()+e.substr(1);--r>-1&&void 0===a[n[r]+s];);if(0>r)return"";i=3===r?"ms":n[r],e=i+s}return e},F=function(t,e,i){var s=t.style;s&&(void 0===s[e]&&(e=z(t,e)),null==i?s.removeProperty?s.removeProperty(e.replace(/([A-Z])/g,"-$1").toLowerCase()):s.removeAttribute(e):void 0!==s[e]&&(s[e]=i))},X=f.defaultView?f.defaultView.getComputedStyle:m,U=/(?:Left|Right|Width)/i,Y=/(?:\d|\-|\+|=|#|\.)*/g,B=function(t,e,i,s,r){if("px"===s||!s)return i;if("auto"===s||!i)return 0;var n,a=U.test(e),o=t,h=H.style,l=0>i;return l&&(i=-i),"%"===s&&-1!==e.indexOf("border")?n=i/100*(a?t.clientWidth:t.clientHeight):(h.cssText="border:0 solid red;position:"+W(t,"position",!0)+";line-height:0;","%"!==s&&o.appendChild?h[a?"borderLeftWidth":"borderTopWidth"]=i+s:(o=t.parentNode||f.body,h[a?"width":"height"]=i+s),o.appendChild(H),n=parseFloat(H[a?"offsetWidth":"offsetHeight"]),o.removeChild(H),0!==n||r||(n=B(t,e,i,s,!0))),l?-n:n},j=function(t,e){if("absolute"!==W(t,"position",!0))return 0;var i="left"===e?"Left":"Top",s=W(t,"margin"+i,!0);return t["offset"+i]-(B(t,e,parseFloat(s),s.replace(Y,""))||0)},W=function(t,e,i){var s,r=(t._gsTransform||{})[e];return r||0===r?r:(t.style[e]?r=t.style[e]:(s=X(t))?(r=s.getPropertyValue(e.replace(/([A-Z])/g,"-$1").toLowerCase()),r=r||s.length?r:s[e]):t.currentStyle&&(r=t.currentStyle[e]),"auto"!==r||"top"!==e&&"left"!==e||(r=j(t,e)),i?r:parseFloat(r)||0)},q=function(t,e,i){var s=t.vars,r=s[i],n=t._listeners[e];"function"==typeof r&&r.apply(s[i+"Scope"]||t,s[i+"Params"]||[t.pointerEvent]),n&&t.dispatchEvent(e)},V=function(t,e){var i,s,r,n=I(t);return n?oe(n,e):void 0!==t.left?(r=ie(e),{left:t.left-r.x,top:t.top-r.y,width:t.width,height:t.height}):(s=t.min||t.minX||t.minRotation||0,i=t.min||t.minY||0,{left:s,top:i,width:(t.max||t.maxX||t.maxRotation||0)-s,height:(t.max||t.maxY||0)-i})},H=f.createElement("div"),G=""!==z(H,"perspective"),Q=z(H,"transformOrigin").replace(/^ms/g,"Ms").replace(/([A-Z])/g,"-$1").toLowerCase(),Z=z(H,"transform"),$=Z.replace(/^ms/g,"Ms").replace(/([A-Z])/g,"-$1").toLowerCase(),K={},J={},te=function(){if(!T){var t="http://www.w3.org/2000/svg",e=f.createElementNS(t,"svg"),i=f.createElementNS(t,"rect");return i.setAttributeNS(null,"width","10"),i.setAttributeNS(null,"height","10"),e.appendChild(i),e}}(),ee=function(t){if(!t.getBoundingClientRect||!t.parentNode)return{offsetTop:0,offsetLeft:0,offsetParent:p};for(var e,i,s,r=t,n=t.style.cssText;!r.offsetParent&&r.parentNode;)r=r.parentNode;return t.parentNode.insertBefore(te,t),t.parentNode.removeChild(t),te.style.cssText=n,te.style[Z]="none",te.setAttribute("class",t.getAttribute("class")),e=te.getBoundingClientRect(),s=r.offsetParent,s?(s===f.body&&p&&(s=p),i=s.getBoundingClientRect()):i={top:-L(),left:-N()},te.parentNode.insertBefore(t,te),t.parentNode.removeChild(te),{offsetLeft:e.left-i.left,offsetTop:e.top-i.top,offsetParent:r.offsetParent||p}},ie=function(t,e){if(e=e||{},!t||t===p||!t.parentNode)return{x:0,y:0};var i=X(t),s=Q&&i?i.getPropertyValue(Q):"50% 50%",r=s.split(" "),n=-1!==s.indexOf("left")?"0%":-1!==s.indexOf("right")?"100%":r[0],a=-1!==s.indexOf("top")?"0%":-1!==s.indexOf("bottom")?"100%":r[1];return("center"===a||null==a)&&(a="50%"),("center"===n||isNaN(parseFloat(n)))&&(n="50%"),e.x=-1!==n.indexOf("%")?t.offsetWidth*parseFloat(n)/100:parseFloat(n),e.y=-1!==a.indexOf("%")?t.offsetHeight*parseFloat(a)/100:parseFloat(a),e},se=function(t,e,i){var s,r,a,o,h,l;return t!==window&&t&&t.parentNode?(s=X(t),r=s?s.getPropertyValue($):t.currentStyle?t.currentStyle[Z]:"1,0,0,1,0,0",r=(r+"").match(/(?:\-|\b)[\d\-\.e]+\b/g)||[1,0,0,1,0,0],r.length>6&&(r=[r[0],r[1],r[4],r[5],r[12],r[13]]),e&&(a=t.parentNode,l=void 0===t.offsetLeft&&"svg"===t.nodeName.toLowerCase()?ee(t):t,o=l.offsetParent,h=a===p||a===f.body,void 0===n&&f.body&&Z&&(n=function(){var t,e,i=f.createElement("div"),s=f.createElement("div");return s.style.position="absolute",f.body.appendChild(i),i.appendChild(s),t=s.offsetParent,i.style[Z]="rotate(1deg)",e=s.offsetParent===t,f.body.removeChild(i),e}()),r[4]=Number(r[4])+e.x+(l.offsetLeft||0)-i.x-(h?0:a.scrollLeft)+(o?parseInt(W(o,"borderLeftWidth"),10)||0:0),r[5]=Number(r[5])+e.y+(l.offsetTop||0)-i.y-(h?0:a.scrollTop)+(o?parseInt(W(o,"borderTopWidth"),10)||0:0),!a||a.offsetParent!==o||n&&"100100"!==se(a).join("")||(r[4]-=a.offsetLeft||0,r[5]-=a.offsetTop||0),a&&"fixed"===W(t,"position",!0)&&(r[4]+=N(),r[5]+=L())),r):[1,0,0,1,0,0]},re=function(t,e){if(!t||t===window||!t.parentNode)return[1,0,0,1,0,0];for(var i,s,r,n,a,o,h,l,u=ie(t,K),_=ie(t.parentNode,J),c=se(t,u,_);(t=t.parentNode)&&t.parentNode&&t!==p;)u=_,_=ie(t.parentNode,u===K?J:K),h=se(t,u,_),i=c[0],s=c[1],r=c[2],n=c[3],a=c[4],o=c[5],c[0]=i*h[0]+s*h[2],c[1]=i*h[1]+s*h[3],c[2]=r*h[0]+n*h[2],c[3]=r*h[1]+n*h[3],c[4]=a*h[0]+o*h[2]+h[4],c[5]=a*h[1]+o*h[3]+h[5];return e&&(i=c[0],s=c[1],r=c[2],n=c[3],a=c[4],o=c[5],l=i*n-s*r,c[0]=n/l,c[1]=-s/l,c[2]=-r/l,c[3]=i/l,c[4]=(r*o-n*a)/l,c[5]=-(i*o-s*a)/l),c},ne=function(t,e,i){var s=re(t),r=e.x,n=e.y;return i=i===!0?e:i||{},i.x=r*s[0]+n*s[2]+s[4],i.y=r*s[1]+n*s[3]+s[5],i},ae=function(t,e,i){var s=t.x*e[0]+t.y*e[2]+e[4],r=t.x*e[1]+t.y*e[3]+e[5];return t.x=s*i[0]+r*i[2]+i[4],t.y=s*i[1]+r*i[3]+i[5],t},oe=function(t,e){var i,s,r,n,a,o,h,l,u,_,c;return t===window?(n=L(),s=N(),r=s+(p.clientWidth||t.innerWidth||f.body.clientWidth||0),a=n+((t.innerHeight||0)-20<p.clientHeight?p.clientHeight:t.innerHeight||f.body.clientHeight||0)):(i=ie(t),s=-i.x,r=s+t.offsetWidth,n=-i.y,a=n+t.offsetHeight),t===e?{left:s,top:n,width:r-s,height:a-n}:(o=re(t),h=re(e,!0),l=ae({x:s,y:n},o,h),u=ae({x:r,y:n},o,h),_=ae({x:r,y:a},o,h),c=ae({x:s,y:a},o,h),s=Math.min(l.x,u.x,_.x,c.x),n=Math.min(l.y,u.y,_.y,c.y),{left:s,top:n,width:Math.max(l.x,u.x,_.x,c.x)-s,height:Math.max(l.y,u.y,_.y,c.y)-n})},he=function(t){return t.length&&t[0]&&(t[0].nodeType&&t[0].style&&!t.nodeType||t[0].length&&t[0][0])?!0:!1},le=function(t){var e,i,s,r=[],n=t.length;for(e=0;n>e;e++)if(i=t[e],he(i))for(s=i.length,s=0;i.length>s;s++)r.push(i[s]);else r.push(i);return r},ue="ontouchstart"in p&&"orientation"in window,_e=function(t){for(var e=t.split(","),i=(void 0!==H.onpointerdown?"pointerdown,pointermove,pointerup,pointercancel":void 0!==H.onmspointerdown?"MSPointerDown,MSPointerMove,MSPointerUp,MSPointerCancel":t).split(","),s={},r=8;--r>-1;)s[e[r]]=i[r],s[i[r]]=e[r];return s}("touchstart,touchmove,touchend,touchcancel"),ce=function(t,e,i){t.addEventListener?t.addEventListener(_e[e]||e,i,!1):t.attachEvent&&t.attachEvent("on"+e,i)},fe=function(t,e,i){t.removeEventListener?t.removeEventListener(_e[e]||e,i):t.detachEvent&&t.detachEvent("on"+e,i)},pe=function(t){s=t.touches&&t.touches.length>S,fe(t.target,"touchend",pe)},de=function(t){s=t.touches&&t.touches.length>S,ce(t.target,"touchend",pe)},me=function(t,e,i,s,r,n){var a,o,h,l={};if(e)if(1!==r&&e instanceof Array)for(l.end=a=[],h=e.length,o=0;h>o;o++)a[o]=e[o]*r;else l.end="function"==typeof e?function(i){return e.call(t,i)*r}:e;return(i||0===i)&&(l.max=i),(s||0===s)&&(l.min=s),n&&(l.velocity=0),l},ge=function(t){var e;return t&&t.getAttribute&&"BODY"!==t.nodeName?"true"===(e=t.getAttribute("data-clickable"))||"false"!==e&&(t.onclick||P.test(t.nodeName+""))?!0:ge(t.parentNode):!1},ve=function(){var t,e=f.createElement("div"),i=f.createElement("div"),s=i.style,r=f.body||H;return s.display="inline-block",s.position="relative",e.style.cssText=i.innerHTML="width:90px; height:40px; padding:10px; overflow:auto; visibility: hidden",e.appendChild(i),r.appendChild(e),a=i.offsetHeight+18>e.scrollHeight,s.width="100%",Z||(s.paddingRight="500px",t=e.scrollLeft=e.scrollWidth-e.clientWidth,s.left="-90px",t=t!==e.scrollLeft),r.removeChild(e),t}(),ye=function(t,i){t=I(t),i=i||{};var s,r,n,o,h,l,u=f.createElement("div"),_=u.style,c=t.firstChild,p=0,d=0,m=t.scrollTop,g=t.scrollLeft,v=t.scrollWidth,y=t.scrollHeight,w=0,x=0,b=0;G&&i.force3D!==!1?(h="translate3d(",l="px,0px)"):Z&&(h="translate(",l="px)"),this.scrollTop=function(t,e){return arguments.length?(this.top(-t,e),void 0):-this.top()},this.scrollLeft=function(t,e){return arguments.length?(this.left(-t,e),void 0):-this.left()},this.left=function(s,r){if(!arguments.length)return-(t.scrollLeft+d);var n=t.scrollLeft-g,a=d;return(n>2||-2>n)&&!r?(g=t.scrollLeft,e.killTweensOf(this,!0,{left:1,scrollLeft:1}),this.left(-g),i.onKill&&i.onKill(),void 0):(s=-s,0>s?(d=0|s-.5,s=0):s>x?(d=0|s-x,s=x):d=0,(d||a)&&(h?this._suspendTransforms||(_[Z]=h+-d+"px,"+-p+l):_.left=-d+"px",ve&&d+w>=0&&(_.paddingRight=d+w+"px")),t.scrollLeft=0|s,g=t.scrollLeft,void 0)},this.top=function(s,r){if(!arguments.length)return-(t.scrollTop+p);var n=t.scrollTop-m,a=p;return(n>2||-2>n)&&!r?(m=t.scrollTop,e.killTweensOf(this,!0,{top:1,scrollTop:1}),this.top(-m),i.onKill&&i.onKill(),void 0):(s=-s,0>s?(p=0|s-.5,s=0):s>b?(p=0|s-b,s=b):p=0,(p||a)&&(h?this._suspendTransforms||(_[Z]=h+-d+"px,"+-p+l):_.top=-p+"px"),t.scrollTop=0|s,m=t.scrollTop,void 0)},this.maxScrollTop=function(){return b},this.maxScrollLeft=function(){return x},this.disable=function(){for(c=u.firstChild;c;)o=c.nextSibling,t.appendChild(c),c=o;t===u.parentNode&&t.removeChild(u)},this.enable=function(){if(c=t.firstChild,c!==u){for(;c;)o=c.nextSibling,u.appendChild(c),c=o;t.appendChild(u),this.calibrate()}},this.calibrate=function(e){var i,o,h=t.clientWidth===s;m=t.scrollTop,g=t.scrollLeft,(!h||t.clientHeight!==r||u.offsetHeight!==n||v!==t.scrollWidth||y!==t.scrollHeight||e)&&((p||d)&&(i=this.left(),o=this.top(),this.left(-t.scrollLeft),this.top(-t.scrollTop)),(!h||e)&&(_.display="block",_.width="auto",_.paddingRight="0px",w=Math.max(0,t.scrollWidth-t.clientWidth),w&&(w+=W(t,"paddingLeft")+(a?W(t,"paddingRight"):0))),_.display="inline-block",_.position="relative",_.overflow="visible",_.width="100%",_.paddingRight=w+"px",a&&(_.paddingBottom=W(t,"paddingBottom",!0)),T&&(_.zoom="1"),s=t.clientWidth,r=t.clientHeight,v=t.scrollWidth,y=t.scrollHeight,x=t.scrollWidth-s,b=t.scrollHeight-r,n=u.offsetHeight,(i||o)&&(this.left(i),this.top(o)))},this.content=u,this.element=t,this._suspendTransforms=!1,this.enable()},Te=function(i,n){t.call(this,i),i=I(i),r||(r=_.com.greensock.plugins.ThrowPropsPlugin),this.vars=n=n||{},this.target=i,this.x=this.y=this.rotation=0,this.dragResistance=parseFloat(n.dragResistance)||0,this.edgeResistance=isNaN(n.edgeResistance)?1:parseFloat(n.edgeResistance)||0,this.lockAxis=n.lockAxis;var a,c,p,w,P,R,O,L,N,z,X,U,Y,B,j,H,G,Q,Z,$,K,J,te,ee,ie,se,ae=(n.type||(T?"top,left":"x,y")).toLowerCase(),oe=-1!==ae.indexOf("x")||-1!==ae.indexOf("y"),he=-1!==ae.indexOf("rotation"),le=oe?"x":"left",pe=oe?"y":"top",ve=-1!==ae.indexOf("x")||-1!==ae.indexOf("left")||"scroll"===ae,we=-1!==ae.indexOf("y")||-1!==ae.indexOf("top")||"scroll"===ae,xe=this,be=k(n.trigger||n.handle||i),Pe={},Se=0,Ce=function(t){if(Q){var s=xe.x,r=xe.y,n=1e-6;n>s&&s>-n&&(s=0),n>r&&r>-n&&(r=0),he?(B.rotation=xe.rotation=xe.x,e.set(i,Y)):c?(we&&c.top(r),ve&&c.left(s)):oe?(we&&(B.y=r),ve&&(B.x=s),e.set(i,Y)):(we&&(i.style.top=r+"px"),ve&&(i.style.left=s+"px")),L&&!t&&q(xe,"drag","onDrag")}Q=!1},ke=function(t,s){var r;oe?(i._gsTransform||e.set(i,{x:"+=0"}),xe.y=i._gsTransform.y,xe.x=i._gsTransform.x):he?(i._gsTransform||e.set(i,{x:"+=0"}),xe.x=xe.rotation=i._gsTransform.rotation):c?(xe.y=c.top(),xe.x=c.left()):(xe.y=parseInt(i.style.top,10)||0,xe.x=parseInt(i.style.left,10)||0),!$&&!K||s||($&&(r=$(xe.x),r!==xe.x&&(xe.x=r,he&&(xe.rotation=r),Q=!0)),K&&(r=K(xe.y),r!==xe.y&&(xe.y=r,Q=!0)),Q&&Ce(!0)),n.onThrowUpdate&&!t&&n.onThrowUpdate.apply(n.onThrowUpdateScope||xe,n.onThrowUpdateParams||d)},Re=function(){var t,e,s,r;O=!1,c?(c.calibrate(),xe.minX=z=-c.maxScrollLeft(),xe.minY=U=-c.maxScrollTop(),xe.maxX=N=xe.maxY=X=0,O=!0):n.bounds&&(t=V(n.bounds,i.parentNode),he?(xe.minX=z=t.left,xe.maxX=N=t.left+t.width,xe.minY=U=xe.maxY=X=0):void 0!==n.bounds.maxX||void 0!==n.bounds.maxY?(t=n.bounds,xe.minX=z=t.minX,xe.minY=U=t.minY,xe.maxX=N=t.maxX,xe.maxY=X=t.maxY):(e=V(i,i.parentNode),xe.minX=z=W(i,le)+t.left-e.left,xe.minY=U=W(i,pe)+t.top-e.top,xe.maxX=N=z+(t.width-e.width),xe.maxY=X=U+(t.height-e.height)),z>N&&(xe.minX=N,xe.maxX=N=z,z=xe.minX),U>X&&(xe.minY=X,xe.maxY=X=U,U=xe.minY),he&&(xe.minRotation=z,xe.maxRotation=N),O=!0),n.liveSnap&&(s=n.liveSnap===!0?n.snap||{}:n.liveSnap,r=s instanceof Array||"function"==typeof s,he?($=Le(r?s:s.rotation,z,N,1),K=null):(ve&&($=Le(r?s:s.x||s.left||s.scrollLeft,z,N,c?-1:1)),we&&(K=Le(r?s:s.y||s.top||s.scrollTop,U,X,c?-1:1))))},Ae=function(t,e){var s,a,o;t&&r?(t===!0&&(s=n.snap||{},a=s instanceof Array||"function"==typeof s,t={resistance:(n.throwResistance||n.resistance||1e3)/(he?10:1)},he?t.rotation=me(xe,a?s:s.rotation,N,z,1,e):(ve&&(t[le]=me(xe,a?s:s.x||s.left||s.scrollLeft,N,z,c?-1:1,e||xe.lockAxis&&"x"===ee)),we&&(t[pe]=me(xe,a?s:s.y||s.top||s.scrollTop,X,U,c?-1:1,e||xe.lockAxis&&"y"===ee)))),xe.tween=o=r.to(c||i,{throwProps:t,ease:n.ease||_.Power3.easeOut,onComplete:n.onThrowComplete,onCompleteParams:n.onThrowCompleteParams,onCompleteScope:n.onThrowCompleteScope||xe,onUpdate:n.fastMode?n.onThrowUpdate:ke,onUpdateParams:n.fastMode?n.onThrowUpdateParams:null,onUpdateScope:n.onThrowUpdateScope||xe},isNaN(n.maxDuration)?2:n.maxDuration,isNaN(n.minDuration)?.5:n.minDuration,isNaN(n.overshootTolerance)?1-xe.edgeResistance+.2:n.overshootTolerance),n.fastMode||(c&&(c._suspendTransforms=!0),o.render(o.duration(),!0,!0),ke(!0,!0),xe.endX=xe.x,xe.endY=xe.y,he&&(xe.endRotation=xe.x),o.play(0),ke(!0,!0),c&&(c._suspendTransforms=!1))):O&&xe.applyBounds()},De=function(){ie=re(i.parentNode,!0),ie[1]||ie[2]||1!=ie[0]||1!=ie[3]||0!=ie[4]||0!=ie[5]||(ie=null)},Oe=function(){var t=1-xe.edgeResistance;De(),c?(Re(),R=c.top(),P=c.left()):(Me()?(ke(!0,!0),Re()):xe.applyBounds(),he?(G=ne(i,{x:0,y:0}),ke(!0,!0),P=xe.x,R=xe.y=Math.atan2(G.y-w,p-G.x)*g):(R=W(i,pe),P=W(i,le))),O&&t&&(P>N?P=N+(P-N)/t:z>P&&(P=z-(z-P)/t),he||(R>X?R=X+(R-X)/t:U>R&&(R=U-(U-R)/t)))},Me=function(){return xe.tween&&xe.tween.isActive()},Le=function(t,e,i,s){return"function"==typeof t?function(r){var n=xe.isPressed?1-xe.edgeResistance:1;return t.call(xe,r>i?i+(r-i)*n:e>r?e+(r-e)*n:r)*s}:t instanceof Array?function(s){for(var r,n,a=t.length,o=0,h=v;--a>-1;)r=t[a],n=r-s,0>n&&(n=-n),h>n&&r>=e&&i>=r&&(o=a,h=n);return t[o]}:isNaN(t)?function(t){return t}:function(){return t*s}},Ne=function(t){var s,r;if(a&&!xe.isPressed&&t){if(se=Me(),xe.pointerEvent=t,_e[t.type]?(te=-1!==t.type.indexOf("touch")?t.currentTarget:f,ce(te,"touchend",Ie),ce(te,"touchmove",Ee),ce(te,"touchcancel",Ie),ce(f,"touchstart",de)):(te=null,ce(f,"mousemove",Ee)),ce(f,"mouseup",Ie),J=ge(t.target)&&!n.dragClickables)return ce(t.target,"change",Ie),void 0;if(T?t=E(t,!0):!c||t.touches&&t.touches.length>S+1||(t.preventDefault(),t.preventManipulation&&t.preventManipulation()),t.changedTouches?(t=j=t.changedTouches[0],H=t.identifier):t.pointerId?H=t.pointerId:j=null,S++,A(Ce),w=xe.pointerY=t.pageY,p=xe.pointerX=t.pageX,Oe(),ie&&(s=p*ie[0]+w*ie[2]+ie[4],w=p*ie[1]+w*ie[3]+ie[5],p=s),xe.tween&&xe.tween.kill(),e.killTweensOf(c||i,!0,Pe),c&&e.killTweensOf(i,!0,{scrollTo:1}),xe.tween=ee=null,(n.zIndexBoost||!he&&!c&&n.zIndexBoost!==!1)&&(i.style.zIndex=Te.zIndex++),xe.isPressed=!0,L=!(!n.onDrag&&!xe._listeners.drag),!he)for(r=be.length;--r>-1;)F(be[r],"cursor",n.cursor||"move");q(xe,"press","onPress")}},Ee=function(t){if(a&&!s&&xe.isPressed){T?t=E(t,!0):(t.preventDefault(),t.preventManipulation&&t.preventManipulation()),xe.pointerEvent=t;var e,i,r,n,o,h,l,u,_,c=t.changedTouches,f=1-xe.dragResistance,d=1-xe.edgeResistance;if(c){if(t=c[0],t!==j&&t.identifier!==H){for(o=c.length;--o>-1&&(t=c[o]).identifier!==H;);if(0>o)return}}else if(t.pointerId&&H&&t.pointerId!==H)return;l=xe.pointerX=t.pageX,u=xe.pointerY=t.pageY,he?(n=Math.atan2(G.y-t.pageY,t.pageX-G.x)*g,h=xe.y-n,xe.y=n,h>180?R-=360:-180>h&&(R+=360),r=P+(R-n)*f):(ie&&(_=l*ie[0]+u*ie[2]+ie[4],u=l*ie[1]+u*ie[3]+ie[5],l=_),i=u-w,e=l-p,2>i&&i>-2&&(i=0),2>e&&e>-2&&(e=0),xe.lockAxis&&(e||i)&&("y"===ee||!ee&&Math.abs(e)>Math.abs(i)&&ve?(i=0,ee="y"):we&&(e=0,ee="x")),r=P+e*f,n=R+i*f),$||K?($&&(r=$(r)),K&&(n=K(n))):O&&(r>N?r=N+(r-N)*d:z>r&&(r=z+(r-z)*d),he||(n>X?n=X+(n-X)*d:U>n&&(n=U+(n-U)*d))),he||(r=Math.round(r),n=Math.round(n)),(xe.x!==r||xe.y!==n&&!he)&&(xe.x=xe.endX=r,he?xe.endRotation=r:xe.y=xe.endY=n,Q=!0,xe.isDragging||(xe.isDragging=!0,q(xe,"dragstart","onDragStart")))}},Ie=function(t,e){if(!(!a||t&&H&&!e&&t.pointerId&&t.pointerId!==H)){xe.isPressed=!1;var i,s,r=t,o=xe.isDragging;if(te?(fe(te,"touchend",Ie),fe(te,"touchmove",Ee),fe(te,"touchcancel",Ie),fe(f,"touchstart",de)):fe(f,"mousemove",Ee),fe(f,"mouseup",Ie),Q=!1,J)return t&&fe(t.target,"change",Ie),q(xe,"release","onRelease"),q(xe,"click","onClick"),J=!1,void 0;if(D(Ce),!he)for(s=be.length;--s>-1;)F(be[s],"cursor",n.cursor||"move");if(o&&(Se=C=y(),xe.isDragging=!1),S--,t){if(T&&(t=E(t,!1)),i=t.changedTouches,i&&(t=i[0],t!==j&&t.identifier!==H)){for(s=i.length;--s>-1&&(t=i[s]).identifier!==H;);if(0>s)return}xe.pointerEvent=r,xe.pointerX=t.pageX,xe.pointerY=t.pageY}return r&&!o?(se&&(n.snap||n.bounds)&&Ae(n.throwProps),q(xe,"release","onRelease"),q(xe,"click","onClick")):(Ae(n.throwProps),T||!r||!n.dragClickables&&ge(r.target)||!o||(r.preventDefault(),r.preventManipulation&&r.preventManipulation()),q(xe,"release","onRelease")),o&&q(xe,"dragend","onDragEnd"),!0}},ze=function(t){(xe.isPressed||20>y()-Se)&&(t.preventDefault?t.preventDefault():t.returnValue=!1,t.preventManipulation&&t.preventManipulation())};Z=Te.get(this.target),Z&&Z.kill(),this.startDrag=function(t){Ne(t),xe.isDragging||(xe.isDragging=!0,q(xe,"dragstart","onDragStart"))},this.drag=Ee,this.endDrag=function(t){Ie(t,!0)},this.timeSinceDrag=function(){return xe.isDragging?0:(y()-Se)/1e3},this.hitTest=function(t,e){return Te.hitTest(xe.target,t,e)},this.applyBounds=function(t){var e,i;return t&&n.bounds!==t?(n.bounds=t,xe.update(!0)):(ke(!0),Re(),O&&(e=xe.x,i=xe.y,O&&(e>N?e=N:z>e&&(e=z),i>X?i=X:U>i&&(i=U)),(xe.x!==e||xe.y!==i)&&(xe.x=xe.endX=e,he?xe.endRotation=e:xe.y=xe.endY=i,Q=!0,Ce())),xe)},this.update=function(t){var e=xe.x,i=xe.y;return De(),t?xe.applyBounds():ke(!0),xe.isPressed&&(Math.abs(e-xe.x)>.01||Math.abs(i-xe.y)>.01&&!he)&&Oe(),xe},this.enable=function(t){var s,o,h;if("soft"!==t)for(o=be.length;--o>-1;)h=be[o],ce(h,"mousedown",Ne),ce(h,"touchstart",Ne),ce(h,"click",ze),he||F(h,"cursor",n.cursor||"move"),h.ondragstart=h.onselectstart=m,F(h,"userSelect","none"),F(h,"touchCallout","none"),F(h,"touchAction","none");return a=!0,r&&"soft"!==t&&r.track(c||i,oe?"x,y":he?"rotation":"top,left"),c&&c.enable(),i._gsDragID=s="d"+b++,x[s]=this,c&&(c.element._gsDragID=s),e.set(i,{x:"+=0"}),this.update(!0),xe},this.disable=function(t){var e,s,n=this.isDragging;if(!he)for(e=be.length;--e>-1;)F(be[e],"cursor",null);if("soft"!==t){for(e=be.length;--e>-1;)s=be[e],s.ondragstart=s.onselectstart=null,F(s,"userSelect","text"),F(s,"touchCallout","default"),F(s,"MSTouchAction","auto"),fe(s,"mousedown",Ne),fe(s,"touchstart",Ne),fe(s,"click",ze);te&&(fe(te,"touchcancel",Ie),fe(te,"touchend",Ie),fe(te,"touchmove",Ee)),fe(f,"mouseup",Ie),fe(f,"mousemove",Ee)}return a=!1,r&&"soft"!==t&&r.untrack(c||i,oe?"x,y":he?"rotation":"top,left"),c&&c.disable(),D(Ce),this.isDragging=this.isPressed=J=!1,n&&q(this,"dragend","onDragEnd"),xe},this.enabled=function(t,e){return arguments.length?t?this.enable(e):this.disable(e):a},this.kill=function(){return e.killTweensOf(c||i,!0,Pe),xe.disable(),delete x[i._gsDragID],xe},-1!==ae.indexOf("scroll")&&(c=this.scrollProxy=new ye(i,M({onKill:function(){xe.isPressed&&Ie(null)}},n)),i.style.overflowY=we&&!ue?"auto":"hidden",i.style.overflowX=ve&&!ue?"auto":"hidden",i=c.content),n.force3D!==!1&&e.set(i,{force3D:!0}),he?Pe.rotation=1:(ve&&(Pe[le]=1),we&&(Pe[pe]=1)),he?(Y=u,B=Y.css,Y.overwrite=!1):oe&&(Y=ve&&we?o:ve?h:l,B=Y.css,Y.overwrite=!1),this.enable()},we=Te.prototype=new t;we.constructor=Te,we.pointerX=we.pointerY=0,we.isDragging=we.isPressed=!1,Te.version="0.10.8",Te.zIndex=1e3,ce(f,"touchcancel",function(){}),ce(f,"contextmenu",function(){var t;for(t in x)x[t].isPressed&&x[t].endDrag()}),Te.create=function(t,i){"string"==typeof t&&(t=e.selector(t));for(var s=he(t)?le(t):[t],r=s.length;--r>-1;)s[r]=new Te(s[r],i);return s},Te.get=function(t){return x[(I(t)||{})._gsDragID]},Te.timeSinceDrag=function(){return(y()-C)/1e3};var xe=function(t,e){var i=t.pageX!==e?{left:t.pageX,top:t.pageY,right:t.pageX+1,bottom:t.pageY+1}:t.nodeType||t.left===e||t.top===e?I(t).getBoundingClientRect():t;return i.right===e&&i.width!==e?(i.right=i.left+i.width,i.bottom=i.top+i.height):i.width===e&&(i={width:i.right-i.left,height:i.bottom-i.top,right:i.right,left:i.left,bottom:i.bottom,top:i.top}),i};return Te.hitTest=function(t,e,i){if(t===e)return!1;var s,r,n,a=xe(t),o=xe(e),h=o.left>a.right||o.right<a.left||o.top>a.bottom||o.bottom<a.top;return h||!i?!h:(n=-1!==(i+"").indexOf("%"),i=parseFloat(i)||0,s={left:Math.max(a.left,o.left),top:Math.max(a.top,o.top)},s.width=Math.min(a.right,o.right)-s.left,s.height=Math.min(a.bottom,o.bottom)-s.top,0>s.width||0>s.height?!1:n?(i*=.01,r=s.width*s.height,r>=a.width*a.height*i||r>=o.width*o.height*i):s.width>i&&s.height>i)},Te},!0)}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()(),function(t){"use strict";var e=function(){return(_gsScope.GreenSockGlobals||_gsScope)[t]};"function"==typeof define&&define.amd?define(["TweenLite"],e):"undefined"!=typeof module&&module.exports&&(require("../TweenLite.js"),require("../plugins/CSSPlugin.js"),module.exports=e())}("Draggable");