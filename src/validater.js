require('./style.css');
const _$ = require('./fun.js');
(function(){
	window.validater = function(selecter, setting){
		"use strict"
		var that = this;
		this.tipsList = [];
		//全局设置
		this.setting = _$.extend({
			tips        : true,//是否弹出提示气泡
			position    : 'right',//提示气泡位置
			translate   : [0, 0], //x,y偏移量
			addclass    : '',//提示气泡增加类名
			btnSubmit   : '.valid-submit',//表单提交按钮
			async       : false,//是否异步验证
			onInit      : null,//初始化后回调
			onSuccess   : null,//表单全部验证通过回调
			onError     : null,//表单验证未通过回调
			onVerifyEnd : null//单项验证后回调
		}, setting);

		//单个默认设置，可在每项中单独配置
		/*****************************************************************************
		<input type="text" valid-option="{
            type:'n>0',
            null:'请输入！',
            error:'输入有误！'
		}">
		******************************************************************************/
		this.option = _$.extend({
			type      : null,//验证规则 | 规则模板 | 正则 |  radio/checkbox/ @String
			tips      : that.setting.tips,//是否弹出提示气泡 @Boolean
			target    : '',//提示泡定位依据 默认是追加在<input>之后； @String id or className | #password | .password | parent | prev | next
			position  : that.setting.position,//提示气泡位置 @String
			translate : that.setting.translate, //偏移量 @Array  [10,10]
			addclass  : that.setting.addclass,//提示气泡增加类名 @String	
			pass      : '输入正确！',//@String
			null      : '不能为空！',//@String
			error     : '输入错误！',//@String
			same      : '',// @String id or className | #password .password
			errorSame : '两次密码输入不一致！',//@String for same
			less      : '',// @String id or className | #more .more
			errorLess : '输入值须小于最大数！',//@String  for less
			more      : '',// @String id or className | #less .less
			errorMore : '输入值须大于最小数！'//@String for more
		});

		//规则模板，可自行追加
		this.regExp = {
			"*"        : /[\w\W]+/,
			"*6-18"    : /^[\w\W]{6,18}$/,
			"zh"       : /^[\u0391-\uFFE5]+$/,
			"price"    : /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/,
			"float"    : /^(-?\d+)(\.\d+)?$/,
			"n"        : /^\d+$/,
			"n>0"      : /^[0-9]*[1-9][0-9]*$/,
			"n<0"      : /^-[0-9]*[1-9][0-9]*$/,
			"n<=0"     : /^((-\d+)|(0+))$/,
			"n6-16"    : /^\d{6,16}$/,
			"s"        : /^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]+$/,
			"s6-18"    : /^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{6,18}$/,
			"post"     : /^[0-9]{6}$/,
			"mobile"   : /^1[3|4|5|8]\d{9}$/,
			"email"    : /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
			"url"      : /^(\w+:\/\/)?\w+(\.\w+)+.*$/,
			"password" : /^\w+$/
		};

		this.events = {
			text     : 'focusout',
			password : 'focusout',
			search   : 'focusout',
			tel      : 'focusout',
			select   : 'change',
			checkbox : 'change',
			radio    : 'change',
			textarea : 'focusout',
			hidden   : 'change'//隐藏域需要前台改变值时调用$('#a').val(1).change()， 配合隐藏域可实现复杂的该插件未提供模板的验证
		};

		this.createTips = function(input, target, option, valided){
			target = target || input;
			var _next = _$.next(target, '.validater-tips');
			if(_next) {
				_$.remove(_next);
				_$.delArray(_next, that.tipsList);
			};
			var tips =  _$.elem('<div class="validater-tips validater-tips-'+valided+' validater-tips-'+option.position+' '+option.addclass+'">'+
							'<div class="validater-tips-bg">'+
								'<span class="validater-tips-info">'+option[valided]+'</span>'+
								'<s class="validater-tips-arrow"></s>'+
								'<s class="validater-tips-arrow-border"></s>'+
							'</div>'+
						'</div>');
			_$.after(tips, target);
			_$.addClass('validater-relative', target);
			var inputpos = {
				left:target.offsetLeft + (parseFloat(target.style.marginLeft)||0),
				top :target.offsetTop + (parseFloat(target.style.marginTop)||0)
			};
			_$.removeClass('validater-relative', target);
			var tipsSize = {
				width  : tips.clientWidth || tips.offsetWidth,
				height : tips.clientHeight || tips.offsetHeight
			};
			var targetSize = {
				width  : target.clientWidth || target.offsetWidth,
				height : target.clientHeight || target.offsetHeight
			};
			var pos = {};
			switch(option.position){
				case 'left' : 
					pos.left = inputpos.left - tipsSize.width;
					pos.top  = inputpos.top - (tipsSize.height - targetSize.height)*.5;
					break;
				case 'right' : 
					pos.left = inputpos.left + targetSize.width;
					pos.top  = inputpos.top - (tipsSize.height - targetSize.height)*.5;
					break;
				case 'top' : 
					pos.left = inputpos.left;
					pos.top  = inputpos.top - tipsSize.height;
					break;
				case 'bottom' : 
					pos.left = inputpos.left;
					pos.top  = inputpos.top + targetSize.height;
					break;
				default : 
					pos.left = inputpos.left + targetSize.width;
					pos.top  = inputpos.top - (tipsSize.height - targetSize.height)*.5;
					break;
			};
			pos.left +=  option.translate[0];
			pos.top  +=  option.translate[1];
			that.showTips(tips, pos);
		};

		this.showTips = function (tips, pos) {
			_$.css(tips, {
				left:pos.left+'px',
				top:pos.top+'px'
			});
			_$.addClass('validater-tips-show', tips);
			that.tipsList.push(tips);
		};

		this.hideTips = function (tips) {
			_$.removeClass('validater-tips-show', tips);
			setTimeout(function(){
				_$.remove(tips);
				_$.delArray(tips, that.tipsList);
			}, 300);
		};
		
		this.getType = function (input) {
			return input.getAttribute('type') || input.tagName.toLowerCase();
		};

		this.getOption = function (input) {
			var option = _$.extend(that.option, JSON.parse(_$.formatJSON(input.getAttribute('valid-option'))));
			if(typeof option.translate === 'string') option.translate =  JSON.parse(option.translate);
			if(typeof option.tips === 'string') option.tips =  JSON.parse(option.tips);
			return option;
		};

		this.getTarget = function(input, target){			
			if(target){
				if(target.indexOf('#') != -1 || target.indexOf('.') != -1){//id or class
					target = _$.getElement(target);
				}else if(target == 'parent'){
					target = input.parentNode;
				}else if(target == 'prev'){
					target = _$.hasClass('validater-tips', _$.prev(input)) ? _$.prev(_$.prev(input)) : _$.prev(input);
				}else if(target == 'next'){
					target = _$.hasClass('validater-tips', _$.next(input)) ? _$.next(_$.next(input)) : _$.next(input);
				}
			}else{
				target = input;
			};
			return (target || input);
		};

		this.valid = function(input, option){
			var resp;
			if(option.type == 'checked'){
				if(input.tagName == 'INPUT'){
					resp = input.checked ? 'pass' : 'null';
				}else{
					var inputs = _$.getElement('input', input);
					resp = 'null';
					inputs.forEach(function(elem){
						if(elem.checked == true){
							resp = 'pass';
							return false;
						}
					})
				}
			}else{
				var types = /^\/.*\/$/.test(option.type) ? [option.type] : option.type.split('|'),
				value = input.value,
				same  = _$.getElement(option.same, that.self).value,
				less  = parseInt(_$.getElement(option.less, that.self).value),
				more  = parseInt(_$.getElement(option.more, that.self).value);
				types.forEach(function(n,i){
					var reg = /^\/.*\/$/.test(n) ? new RegExp(eval(n)) : new RegExp(that.regExp[n]);
					resp =  value == ''               ? 'null' :
							!reg.exec(_$.trim(value)) ? 'error' :
							same && value != same     ? 'errorSame' :
							less && value >= less     ? 'errorLess' : 
							more && value <= more     ? 'errorMore' : 'pass';
					if(resp=='pass') return false;
				});
			};
			return resp;
		};

		this.verify = function(input, option, verifyForm){			
			option = _$.extend(  that.getOption(input), option  );
			var target   = that.getTarget(input, option.target);
			var valided  = that.valid(input, option);
			var response = {status:true, valided:valided, target:target, option:option};
			if(valided == 'pass'){
				var tipsbox = _$.next(target, '.validater-tips');
				tipsbox && that.hideTips(tipsbox);
			}else{
				that.setting.tips && option.tips && that.createTips(input, target, option, valided);
				response.status = false;
			};
			!verifyForm && that.setting.onVerifyEnd && that.setting.onVerifyEnd({el : that.self, items : [
				{
					obj    : input,
					target : target,
					type   : valided,
					tips   : option[valided]
				}
			]});
			return response;
		};

		this.verifyForm = function(){
			var status     = true;
			var response = {el : that.self, items : []};
			that.inputs.forEach(function(input) {
				var _check = that.verify(input, null, true);
				if(!_check.status){
					status = false;
					response.items.push({
						obj    : input,
						target : _check.target,
						type   : _check.valided,
						tips   : _check.option[_check.valided]
					});
					if(!that.setting.async) return false;
				}
			});
			if(status){
				that.setting.onSuccess && that.setting.onSuccess(response);
			}else{
				that.setting.onError && that.setting.onError(response);
			};
		};

		this.init = function(){
			that.self   = _$.getElement(selecter);
			that.inputs = _$.getElement('[valid-option]', that.self);
			that.submit = _$.getElement(that.setting.btnSubmit, that.self);
			that.inputs.forEach(function(input){
				var ev = that.events[that.getType(input)];
				if(ev){
					_$.removeEvent(input, ev+'.verify');
					_$.addEvent(input, ev+'.verify', function(){
						that.verify(input);
					});
				}else{
					var inputs = _$.getElement('input', input);
					inputs.forEach(function(elem){
						_$.removeEvent(elem, 'change.verify');
						_$.addEvent(elem, 'change.verify', function(){
							that.verify(input);
						});
					})
				}
			});
			_$.removeEvent(that.submit, 'click.verifyForm');
			_$.addEvent(that.submit, 'click.verifyForm', that.verifyForm);
		};

		this.reInit = function(){
			that.init();
		};
		
		this.append = function(input){
			if(input.getAttribute('valid-option-bak')){
				input.setAttribute('valid-option', input.getAttribute('valid-option-bak'));
				input.removeAttribute('valid-option-bak');
			};
			that.inputs = _$.getElement('[valid-option]', that.self);
			var ev = that.events[that.getType(input)];
			_$.removeEvent(input, ev+'.verify');
			_$.addEvent(input, ev+'.verify', function(){
				that.verify(input);
			});
		}
		
		this.remove = function(input){
			_$.delArray(input, that.inputs);
			var ev = that.events[that.getType(input)];
			_$.removeEvent(input, ev+'.verify');
			input.setAttribute('valid-option-bak', input.getAttribute('valid-option'));
			input.removeAttribute('valid-option');
		};

		this.clear = function(){
			_$.remove(that.tipsList);
			that.tipsList = [];
		};

		this.destroy = function(){
			that.inputs.forEach(function(input){
				var ev = that.events[that.getType(input)];				
				_$.removeEvent(input, ev+'.verify');
			});
			_$.removeEvent(that.submit, 'click.verifyForm');
		};

		this.init();

		setting.onInit && setting.onInit(this);
		
		return this;
	};
})();