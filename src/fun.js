var _$ = {};
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( callback ){
				window.setTimeout(callback, 1000 / 60);//定义每秒执行60次动画
			};
})();
window.cancelAnimationFrame = window.cancelAnimationFrame
		|| window.webkitCancelAnimationFrame
		|| window.webkitCancelRequestAnimationFrame
		|| window.mozCancelRequestAnimationFrame
		|| window.oCancelRequestAnimationFrame
		|| window.msCancelRequestAnimationFrame
		|| clearTimeout;
_$.extend = function(){
	var extend,_extend,_isObject;
	_isObject = function(o){ return Object.prototype.toString.call(o) === '[object Object]';}
	_extend = function self(destination, source) { 
		var property;
		for (property in destination) {
			if (destination.hasOwnProperty(property)) {
				// 若destination[property]和sourc[property]都是对象，则递归 
				if (_isObject(destination[property]) && _isObject(source[property])) {
					self(destination[property], source[property]);
				}; 
				// 若sourc[property]已存在，则跳过 
				if (source.hasOwnProperty(property)) {
					continue;
				} else {
					source[property] = destination[property];
				}
			}
		}
	}
	var arr = arguments,result = {},i; if (!arr.length) return {}; 
	for (i = arr.length - 1; i >= 0; i--) {
		if (_isObject(arr[i])) {
			_extend(arr[i], result);
		};
	}
	arr[0] = result; return result;
};

//加载图片
_$.loadImage = function(src, callback, progress){
	var img, counter  = 0, srcArr=src; 
	if(typeof src === "string" && src!=''){srcArr=[];srcArr.push(src);};
	var len = srcArr.length;
	function check(s){
		counter++;
		var pro = 100/len*counter >100 ? 100 :100/len*counter;
		progress && progress(pro);
		if(counter >= len){callback(counter)};
	};

	for(var i=0; i<srcArr.length; i++){
		img = new Image(); //创建一个Image对象，实现图片的预下载
		(function(k){
			img.src=typeof srcArr[k] === "string" ? srcArr[k] : srcArr[k].src;
			if (img.complete) {
				check(srcArr[k]);
			} else {
				img.onload = function () {
					check(srcArr[k]);
				};
				img.onerror = function () {
					check(srcArr[k]);
				};
			};
		})(i);
	};//end for
};
_$.trim = function(str){
	return str.replace(/(^\s*)|(\s*$)/g, '');
};
_$.isArray = function(array){
	return Object.prototype.toString.call(array)=='[object Array]';
};
_$.inArray = function(current ,array){
	for(var i=0;i<array.length;i++){
		if(_$.isArray(current)){
			var res = true;
			for(var k=0;k<current.length;k++){
				if(!_$.inArray(current[k], array)){
					res = false;
				};
			};
			return res
		}else{
			if(array[i] == current.replace(/(^\s*)|(\s*$)/g,'')){				
				return true;
			};
		};
	};
	return false;
};
_$.delArray = function(val, arr){
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (elt /*, from*/) {
			var len = this.length >>> 0;
			var from = Number(arguments[1]) || 0;
			from = (from < 0) ? Math.ceil(from) : Math.floor(from);
			if (from < 0)
				from += len;
			for (; from < len; from++) {
				if (from in this &&
					this[from] === elt)
					return from;
			}
			return -1;
		};
	};
	var index = arr.indexOf(val);
	if (index > -1) {
		arr.splice(index, 1);
	}
};

_$.getElement = function(selecter, parent){
	if(!selecter) return false;
	parent = parent || document.body;
	if(selecter.indexOf('#') !=-1){
		return [document.getElementById(selecter.replace('#',''))];
	};
	if(selecter.toLowerCase()=='html'){
		return document.getElementsByTagName('html');
	};
	var res = [];
	if(_$.isArray(parent)){
		for(var i=0;i<parent.length;i++){
			var _sub = _$.getElement(selecter, parent[i]);
			res = res.concat( _sub );
		}
	}else{
		var arr = parent.childNodes;
		for(var i=0;i<arr.length;i++){
			if(selecter.indexOf('.') !=-1){
				if(arr[i].className!=undefined && _$.inArray(selecter.replace('.',''), arr[i].className.split(' '))){
					res.push(arr[i]);
				};
			}else if(selecter.indexOf('[') !=-1){
				if(arr[i].className!=undefined && arr[i].getAttribute(selecter.replace(/\[|\]/g, '')) ){
					res.push(arr[i]);
				};
			}else{
				if(arr[i].tagName && selecter.toLowerCase() == arr[i].tagName.toLowerCase()){
					res.push(arr[i]);
				};
			}
			if(arr[i].childNodes.length > 0){
				var _sub = _$.getElement(selecter, arr[i]);
				res = res.concat( _sub );
			}
		};
	};
	return res;
};
_$.elem = function(html){
	var a = document.createElement('div');
	a.innerHTML = html;
	return _$.children(a);
};

_$.children = function(parent, filter){
	var res = [];
	if(_$.isArray(parent)){
		for(var i=0;i<parent.length;i++){
			var _sub = _$.children(parent[i], filter);
			res = res.concat( _sub );
		}
	}else{
		var arr = parent.childNodes;
		for(var i=0;i<arr.length;i++){
			if(arr[i].className!=undefined){
				if(filter){
					if(filter.indexOf('.') !=-1){
						if(_$.inArray(filter.replace('.',''), arr[i].className.split(' '))){
							res.push(arr[i]);
						};
					}else if(filter.indexOf('[') !=-1){
						if(arr[i].getAttribute(filter.replace(/\[|\]/g, '')) ){
							res.push(arr[i]);
						};
					}else{
						if(filter.toLowerCase() == arr[i].tagName.toLowerCase()){
							res.push(arr[i]);
						};
					}
				}else{
					res.push(arr[i]);
				}
				
			};
		};
	};
	return res;
};
_$.prev = function(element, classname){
	if(!element) return false;
	var prev = element.previousSibling;
	if(prev && prev.className!=undefined){
		if(classname){
			classname = classname.replace(/\./g, '');
			prev = _$.hasClass(classname, prev) ?  prev : _$.prev(prev, classname);
		}else{
			prev = prev;
		}
	}else{
		prev = _$.prev(prev, classname);
	}
	return prev;
};
_$.next = function(element, classname){
	if(!element) return false;
	var next = element.nextSibling;
	if(next && next.className!=undefined){
		if(classname){
			classname = classname.replace(/\./g, '');
			next = _$.hasClass(classname, next) ?  next : _$.next(next, classname);
		}else{
			next = next;
		}
	}else{
		next = _$.next(next, classname);
	}
	return next;
};
_$.formatClass = function(classname){
	if(typeof classname === 'string')
		return (classname.replace(/(^\s*)|(\s*$)/g,'').replace(/\s+/g, ' '));
};
_$.clone = function(element, flag){
	var res=[];
	if(_$.isArray(element)){
		for(var i=0;i<element.length;i++){
			res.push(element[i].cloneNode(flag));
		};
	}else{
		res = element.cloneNode(flag);
	}
	return res;
};
_$.prepend = function (newChild, parent){
	if(parent.firstChild){
		if(_$.isArray(newChild)){
			for(var i=newChild.length-1;i>=0;i--){
				parent.insertBefore(newChild[i],parent.firstChild);
			};
		}else{
			parent.insertBefore(newChild,parent.firstChild);
		};
	} else {
		if(_$.isArray(newChild)){
			for(var i=0;i<newChild.length;i++){
				parent.appendChild(newChild[i]);
			};
		}else{
			parent.appendChild(newChild);
		};
	}
	return parent;
};
_$.append = function (newChild, parent){
	if(_$.isArray(newChild)){
		for(var i=0;i<newChild.length;i++){
			parent.appendChild(newChild[i]);
		};
	}else{
		parent.appendChild(newChild);
	};
	return parent;
};
_$.before = function (before, element){
	if(!element) return false;
	if(_$.isArray(element)){
		for(var i=0;i<element.length;i++){
			_$.before(before, element[i]);
		};
	}else{
		element.parentNode.insertBefore(before, element);
	};
};
_$.after = function (after, element){
	if(!element) return false;
	if(_$.isArray(element)){
		for(var i=0;i<element.length;i++){
			_$.after(after, element[i]);
		};
	}else{
		if(element.nextSibling){
			element.parentNode.insertBefore(after, element.nextSibling);
		}else{
			element.parentNode.appendChild(after);
		};
	};
};
_$.remove = function (element){
	if(!element) return false;
	if(_$.isArray(element)){
		for(var i=0;i<element.length;i++){
			_$.remove(element[i]);
		};
	}else{
		element.parentNode.removeChild(element);
	};
};
_$.hasClass = function(classname, element){
	var classnameArr = _$.formatClass(classname).split(' ');
	var elementClsArr;
	var elementClsArr = element.className ? _$.formatClass(element.className).split(' ') : [];
	return _$.inArray(classnameArr, elementClsArr);
};
_$.addClass = function(classname, element){
	var classnameArr = _$.formatClass(classname).split(' ');
	if(_$.isArray(element)){
		for(var i=0;i<element.length;i++){
			_$.addClass(classname, element[i]);
		};
	}else{
		var elementClsArr = element.className ? _$.formatClass(element.className).split(' ') : [];
		if(!_$.inArray(classnameArr, elementClsArr)){
			element.className = elementClsArr.join(' ')+' '+classnameArr.join(' ');
		};
	}
};
_$.removeClass = function(classname, element){
	var classnameArr = _$.formatClass(classname).split(' ');
	if(_$.isArray(element)){
		for(var i=0;i<element.length;i++){
			_$.removeClass(classname, element[i]);
		};
	}else{
		var elementClsArr;
		if(element.className){
			elementClsArr = _$.formatClass(element.className).split(' ');
			var newclass = [];
			for(var i=0; i<elementClsArr.length;i++){
				if(!_$.inArray(elementClsArr[i], classnameArr)){
					newclass.push(elementClsArr[i]);
				};
			};
			element.className = newclass.join(' ');
		};
	}
};
_$.toggleClass = function(classname, element){
	if(_$.hasClass(classname, element)){
		_$.removeClass(classname, element)
	}else{
		_$.addClass(classname, element)
	}
};
_$.css = function(element, style){
	if(_$.isArray(element)){
		for(var i=0;i<element.length;i++){
			_$.css(element[i], style);
		};
	}else{
		for(var key in style){
			element.style[key] = style[key];
		}
	}
};
_$.animate = function(element, option, speed, callback){
	var direction = {};
	for(var key in option){
		direction[key] = element[key]>option[key]?-1:1;
	};
	function setStyle(t){
		element.AnimFrame = requestAnimFrame(setStyle);
		for(var key in option){
			if(element[key]*direction[key] >= option[key]*direction[key]){
				cancelAnimationFrame(element.AnimFrame);
				callback && callback();
				break;
			}else{
				element[key] = element[key] + speed*direction[key];
			};
		};
	};
	setStyle();
};
_$.stop = function(element){
	cancelAnimationFrame(element.AnimFrame);
};
_$.addEvent = function (element, ev, fn, param){    //element为要绑定事件的元素，ev为要绑定的事件，fn为绑定事件的函数
	if(_$.isArray(element)){
		for(var i = 0; i<element.length; i++){
			_$.addEvent(element[i], ev, fn, param);
		}
	}else{
		var evs = _$.formatClass(ev).split(' ');
		if(evs.length > 1){
			for(var i=0; i<evs.length; i++){
				_$.addEvent(element, evs[i], fn);
			}
		}else{
			var ekey = ev.split('.');
			var key = ekey.length > 1 ? ekey[1] :'#'+ev;
			element[key] = function(){
				param ? fn.call(this, param, event) : fn.call(this, event);
			};
			if(element.attachEvent){
				element.attachEvent("on" + ekey[0], element[key]);
			}else{
				element.addEventListener(ekey[0], element[key],false);
			}
		}
	}
};
_$.target = function(e){
	e = e || window.event;
	return e.target || e.srcElement;
};
_$.removeEvent = function (element,ev){
	if(_$.isArray(element)){
		for(var i = 0; i<element.length; i++){
			_$.removeEvent(element[i], ev);
		}
	}else{
		var evs = _$.formatClass(ev).split(' ');
		if(evs.length > 1){
			for(var i=0; i<evs.length; i++){
				_$.addEvent(element,evs[i]);
			}
		}else{
			var ekey = ev.split('.');
			var key = ekey.length > 1 ? ekey[1] :'#'+ev;
			if(element.attachEvent){
				element[key] && element.detachEvent("on" + ekey[0], element[key]);
			}else{
				element[key] && element.removeEventListener(ekey[0], element[key],false);
			}
		};
	}
};
_$.dragDisabled = function (element){    //禁止图片拖拽
	if(_$.isArray(element)){
		for(var i = 0; i<element.length; i++){
			_$.addEvent(element[i], 'dragstart', function(e){e.preventDefault();});
		}
	}else{
		_$.addEvent(element, 'dragstart', function(){e.preventDefault();});
	};
};
_$.formatJSON = function(str){
	str   =  str.replace(/\s/g, '')
				.replace(/\n/g, '')
				.replace(/^\{(.*)\}$/, '\{"$1"\}');
				
	var temp = str.match(/:"(.*?)",|:"(.*?)"|:'(.*?)',|:'(.*?)'/g);			
	str   =  str.replace(/:"(.*?)",|:"(.*?)"|:'(.*?)',|:'(.*?)'/g, '@@@@');
	for(i=0; i<temp.length; i++){
		var v =  temp[i].replace(':', '#first#')
						.replace(/,$/, '#last#')
						.replace(/^'*|'*$/, '#single#')
						.replace(/^"*|"*$/, '#double#')
						.replace(/,/g, '#D#')
						.replace(/:/g, '#M#')
						.replace('#first#', ':')
						.replace('#last#', ',')
						.replace('#single#', "'")
						.replace('#double#', '"')
		str   =  str.replace('@@@@',v);
	};
	str =str.replace('{""', '{"')
			.replace('{"\'', '{"')
			.replace('""}', '"}')
			.replace('\'"}', '"}')
			
			.replace(/:/g, '":"')					
			.replace(/'":/g, '":')
			.replace(/"":/g, '":')
			.replace(/:"'/g, ':"')
			.replace(/:""/g, ':"')
			
			.replace(/,/g, '","')
			.replace(/'",/g, '",')
			.replace(/"",/g, '",')
			.replace(/,"'/g, ',"')
			.replace(/,""/g, ',"')
			.replace(/#D#/g, ',')
			.replace(/#M#/g, ':')
			.replace(/\\/g, '\\\\');
	return str;
};

module.exports = _$; 