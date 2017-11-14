validater  表单验证插件
============

|Author|evan.fu|
|---|---
|E-mail|153668770@qq.com

---

## HTML
```html
<table class="testform">
    <tr>
        <th>价格</th>
        <td>
            <div>                
                <input type="text" id="summary-price" class="" autocomplete="off" name="price" placeholder="数字，例如：20" value="" valid-option="{
                    type:'/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/',                
                    null:'请输入,价格！',
                    error:'输入,有误！',
                    translate :'[100,0]'
                }"> ￥/位
            </div>
        </td>
    </tr>
    <tr>
        <th colspan="2">
            <button class="valid-submit">确定</button>
        </th>
    </tr>
</table>
```
### valid-option
|key|value|
|---|---
|type|验证规则 支持正则  @String
|tips|是否弹出提示气泡 @Boolean
|target|提示泡定位依据 默认是追加在<input>之后； @String id or className | #password | .password | parent | prev | next
|position|提示气泡位置 @String
|translate|偏移量 @Array  [10,10]
|addclass|提示气泡增加类名 @String	
|pass|验证通过提示文字  @String
|null|验证为空提示文字  @String
|error|验证不通过提示文字  @String
|same| 与另一选项对比是否一致，如重复密码@String id or className | #password .password
|errorSame|same 对应的提示文字  @String 如 ‘两次密码输入不一致’
|less|与另一选项对比是否小于另一选项  @String
|errorLess|less 对应的提示文字  @String 如 ‘输入值须小于最大数！’
|more|与另一选项对比是否大于另一选项  @String
|errorMore|less 对应的提示文字  @String 如 ‘输入值须大于最小数！’

## script
### 1. use javascript
```javascript
var myValidater = new validater('.testform', {
    btnSubmit:'.valid-submit',
    position:'right', 
    async : true,
    onSuccess : function(data){
        console.log(data);
    },
    onError: function(data){
        console.log(data);
    },
    onVerifyEnd: function(data){
        console.log(data);
    }
});

this.setting = {
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
};
```  


##### Object function
`reInit`  
`verify`  
`append`  
`remove`  
`clear`  
`destroy`

```javascript
myValidater.verify(element, valid_option);
```

```javascript
var input = document.getElementById('username');
myValidater.append(input);
```

```javascript
var input = document.getElementById('username');
myValidater.remove(input);
```

```javascript
myValidater.clear();
```


## Example
1. [Demo](https://awin8516.github.io/validater/docs/)  