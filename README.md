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
                <input type="text" value="" valid-option="{
                    type:'/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/',                
                    nullMsg:'请输入,价格！',
                    errorMsg:'输入,有误！',
                    translate :'[100,0]'
                }"> ￥/位
            </div>
        </td>
    </tr>
    <tr>
        <th>email</th>
        <td>
        <input type="text" valid-option="{
            type:'email',                
            nullMsg:'请输入email！',
            errorMsg:'输入有误！'            
        }">
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
|key |value|
|:--:|-----|
|type|验证规则  / 规则模板 支持正则 / 正则 / mail / mobile / @String
|tips|是否弹出提示气泡 @Boolean
|target|提示泡定位依据 默认是追加在<input>之后； @String id or className | #password | .password | parent | prev | next
|position|提示气泡位置 @String
|translate|偏移量 @Array  [10,10]
|addclass|提示气泡增加类名 @String	
|passMsg|验证通过提示文字  @String
|nullMsg|验证为空提示文字  @String
|errorMsg|验证不通过提示文字  @String
|same| 与另一选项对比是否一致，如重复密码@String id or className | #password .password
|errorSame|same 对应的提示文字  @String 如 ‘两次密码输入不一致’
|less|与另一选项对比是否小于另一选项  @String
|errorLess|less 对应的提示文字  @String 如 ‘输入值须小于最大数！’
|more|与另一选项对比是否大于另一选项  @String
|errorMore|less 对应的提示文字  @String 如 ‘输入值须大于最小数！’
|onVerifyEnd|单项验证后回调  @function

## script
### 1. use javascript
```javascript
var myValidater = new validater('.testform', {
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
});
```  


##### Object function
|Name |Description|
|:--:|-----|
|`reInit`|重新实例化|
|`verify`|验证单项 @param (input, option)|
|`append`|追加单项 @param (input)|
|`remove`|删除单项 @param (input)|
|`clear`|清除全部提示弹层|
|`destroy`|销毁实例|

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
