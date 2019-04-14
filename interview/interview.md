# *Interview Collection For FE/JavaScript*

## 1、手写一个js的深克隆 （美团，爱奇艺）
```
function deepCopy(obj){
	// 判断是否是简单数据类型
	if(typeof obj == 'object'){
		// 复杂数据类型
		var result = obj.constructor == Array ? [] ： {};
		for (let i in obj){
			result[i] = typeof obj[i] == 'object' ? deepCopy(obj[i]) : obj[i];
		}	
	}else{
		// 简单数据类型 直接 == 赋值
		var  result = obj;
	}
	return result;
}
```

## 2、手写组合继承(美团，爱奇艺，搜狗)
```
// 定义一个动物类
function Animal (name){
	// 属性
	this.name = name || 'Animal';
	//实例方法
	this.sleep = function(){
		console.log(this.name + '正在睡觉! ');
	}
}
// 原型方法
Animal.prototype.eat = function(food){
	console.log(this.name + '正在吃：' + food);
}
// 组合继承
funciton Cat（name）{
	Animal.call(this);
	this.name = name || 'Tom';
}
Cat.prototype = new Animal();

手写一个Promise（爱奇艺，搜狐）
// promise是一个构造函数，下面是一个简单实例
var promise = new Promise((resolve,reject)=>{
	if(操作成功){
		resolve(value)
	}else{
		reject(error)
	}
})
promise.then(function (value){
	//success
},function(value){
	// failure
})
```

## 3、防抖和节流
scroll事件本身会触发页面的重新渲染，同时scroll事件的handler又会被高频度的触发，因此事件的handler内部不应该有复杂操作，例如DOM操作就不应该放在事件处理中
针对此类高频度触发事件的问题(例如页面scroll，屏幕resize, 监听用户输入等), 有两种常用的解决方法，防抖和节流
### （1）防抖(Debouncing)
防抖技术既是可以把多个顺序地调用合并成一次，也就是在一定时间内，规定事件会被触发的次数
通俗一点来说，先看下面这个简化的例子，这个简单的防抖的例子大概功能就是如果500ms 内没有连续触发两次scroll事件，那么才会触发按我们真正想在scroll事件中触发的函数
```
// 简单的防抖动函数
function debounce(func, wait, immediate){
	// 定时器变量
	var timeout;
	return function(){
		// 每次触发scroll handler 时先清除定时器
		clearTimeout(timeout);
		// 指定xx ms后触发真正想进行的操作 handler
		timeout = setTimeout(func, wait)
	}
}
// 实际想绑定在scroll事件上的handler
function realFunc(){
	console.log('success');
}
// 采用了防抖动
window.addEventListener('scroll', debounce(realFunc, 500));
// 没采用防抖动
window.addEventListener('scroll', realFunc)

// 完整的防抖动函数：
function debounce(func, wait, immediate){
	var timeout;
	return function(){
		var context = this, args = arguments;
		var later = function(){
			timeout = null;
			if(!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout)
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	}
}
var myEfficientFn = debounce(funcion(){
	// 滚动中的真正的操作
}, 250);
// 绑定监听
window.addEventListener('resize', myEfficientFn);
```
### （2）节流（Throttling）
防抖函数确实不错，但是也存在问题，譬如图片的懒加载，我希望在下滑过程中图片不断的被加载出来，而不是只有当我停止下滑时候，图片才被加载出来。又或者下滑时候的数据的ajax请求加载也是同理。
这个时候，我们希望即使页面在不断被滚动，但是滚动handler也可以以一定的频率被触发(譬如250ms触发一次), 这类场景，就要用到另一种技巧，称为节流函数(throttling)
节流函数，只允许一个函数在X毫秒内执行一次。与防抖相比，节流函数最主要的不同在于它保证在X毫秒内至少执行一次我们希望触发的时间handler。
与防抖相比，节流函数多一个mustRun属性，代表mustRun毫秒内，必然会触发一次handler。
同样是利用定时器，看看下面的简单示例，大概功能就是如果在一段时间内scroll触发的间隔一直短于500ms，那么能保证事件我们希望调用的handler至少在1000ms内会触发一次。
// 简单的节流函数
```
function throttle(func, wait, mustRun){
	var timeout,
		startTime = new Date();

	return function(){
		var context = this,
			args = arguments,
			curTime = new Date();

		clearTimeout(timeout);
		// 如果达到了规定的触发时间间隔，触发handler
		if(curTime - startTime >= mustRun){
			func.apply(context, args);
			startTime = curTime;
		// 没达到触发间隔，重新设定定时器
		}else{
			timeout = setTimeout(func, wait);
		}
	}
}
// 实际想绑定在scroll 事件上的handler
function realFunc(){
	console.log('Success');
}
// 采用了节流函数
window.addEventListener('scroll', throttle(realFunc, 500, 1000))
```

## 4、手写原生js实现事件代理，并要求兼容浏览器(腾讯)
```
// 简单的事件委托
function delegateEvent(interfaceEle, selector, type, fn){
	if(interfaceEle.addEventListener){
		interfaceEle.addEventListener(type, eventfn);
	}else{
		interfaceEle.attachEvent('on'+type, eventfn);
	}

	function eventfn(e){
		var e = e || window.event;
		var target = e.target || e.srcElement;
		if(matchSelector(target, selector)){
			if(fn){
				fn.call(target, e)
			}
		}
	}
}
function matchSelector(ele, selector){
	// if use id
	if(selector.charAt(0)==='#'){
		return ele.id === selector.slice(1);
	}
	// if use class
	if(selector.charAt(0) === '.'){
		return ('' + ele.className + '').indexof('' + selector.slice(1)+'')!= -1;
	}
	// if use tarName
	return ele.tagName.toLowerCase() === selector.toLowerCase();
}
// 调用
var odiv = document.getElementById('oDiv');
delegateEvent(odiv, 'a', click, function(){
	alert('1')
})
```

## 5、手写Function.bind 函数(腾讯, 爱奇艺)
```
if(!Function.prototype.bind){
	Function.prototype.bind = function(oThis){
		if(typeof this !== 'Function'){ // 如果不是函数抛出异常
			throw new TypeError('')
		}
		var aArgs = Array.prototype.slice.call(arguments, 1), // 此处的aArgs是除函数外的参数
				fToBind = this, // 要绑定的对象
				fNOP = function(){},
				fBound = function(){
					return fToBind.apply(
						this instanceof fNOP ? this : 
						oThis || this, aArgs.concat(Array.prototype.slice.call(arguments))
					)
				};
		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();
		return fBound;
	}
}
```

## 6、手写AJAX（腾讯）
* 创建XMLHttpRequest对象
* 指定响应函数
* 打开连接（指定请求）
* 发送请求
* 创建响应函数
```
var xmlhttp = null; // 声明一个变量，用来实例化XMLHttpRequest对象
if(window.XMLHttpRequest){
	xmlhttp = new XMLHttpRequest(); // 新版本的浏览器可以直接创建XMLHttpRequest对象
}else if(window.ActiveXObject){
	xmlhttp = new ActiveXObject('Microsoft.XMLHTTP'); //IE5或IE6没有XMLHttpRequest对象，而是用ActiveXObject对象
}
if(xmlhttp != null){
	xmlhttp.onreadystatechange = state_Change; // 指定响应函数为state_Change
	// 指定请求，这里要访问在/example/xdom路径下的note.xml 文件， true代表使用的是异步请求
	xmlhttp.open('GET','example/xdom/note.xml',true); 
	xmlhttp.send(null); // 发送请求
}else{
	alert('Your brower does not support XMLHTTP');
}
// 创建具体的响应函数 state_Change
function state_Change(){
	if(xmlhttp.readyState==4){
		if(xmlhttp.status == 200){
			// 这里写函数具体逻辑
		}else{
			alert('Problem retrieving XML data');
		}
	}
}
```

## 7、手写XMLHttpRequest
```
var xhr = new XMLHttpRequest();
xhr.open('GET', '/api', false);
xhr.onreadystatechange = function(){
	if(xhr.readyState == 4){
		if(xhr.status == 200){
			alert(xhr.responseText);
		}
	}
}
xhr.send(null)
```

## 8、网站资源的文件优化
1.  尽可能减少http请求次数，将css，js，图片各自合并
2.  文件开启GZip压缩
3.  浏览器缓存
4.  开启长连接(keep-alive)
5.  避免重定向
6.  指定字符集
7.  样式表css置顶，脚本js置底
8.  使用cdn托管
9.  使用ajax缓存，让网站内容分批加载，局部更新

## 9、JavaScript内置对象，原生对象，宿主对象关系
原生(本地)对象 : 需要new 例如 Object Function Array RegExp <br/>
内置对象 : 不要new 直接引用有 MATH, GLOBAL, 例如isNaN(), parseInt()这些都是GLOBAL对象的方法<br/>
宿主对象(BOM DOM & 自定义对象) 其实说白了ECMAScript官方未定义的对象都属于宿主对象，因为其未定义的对象大多数是自己通过ECMAScript程序创建的对象

## 10、TCP/IP 网络模型各层功能（美团酒旅）
1. 网络接口层：是物理接口的规划。比特流的传输。数据封装成帧
2. 互联网层：ip寻址或逻辑寻址
3. 传输层：提供端到端的可靠传输
4. 应用层：提供用户的接口

## 11、Redux流程（美团酒旅）
1. 用户发出Action <br/>
`store.dispatch(action)`
2. Store自动调用Reducer，并且传入两个参数：当前state和收到Action。然后Reducer会返回新的State <br/>
`let nextState = todoApp(previousState, action)`
3. State一旦有了变化，Store就会调用监听函数 <br/>
// 设置监听函数<br/>
`store.subscribe(listener)`
4. listener可以通过store.getState()得到当前状态。如果使用的是React，这时可以触发重新渲染View
```
function listener(){
	let newState = store.getState();
	component.setState(newState);
}
```

## 12、移动端适配（1px先画法）（美团酒旅）
```
.navTab{
	border-bottom：1px solid #eceef0;
	box-shadow: 0 1px 1px #fff;
}
```
一种实现方式：先设置一个1px粗的border-bottom，这个时候在大部分移动设备上会呈现出很粗的先，在使用白色css阴影，并且便宜1px来压住过粗的border-bottom线。

## 13.元素垂直水平居中
```
//已知宽高：
.parent{
	width: 100%;
	height: 200px;
	position: relative;
	border: 1px solid black;
}
.child{
	width:80%;
	height:100px;
	position:absolute;
	left：10%;
	top: 50%;
	margin-top: -50px;
	border: 1px solid black;
}
// 未知宽高：
.div{
	position: absolute;
	border: 1px solid #888;
	left: 50%;
	top: 50%;
	transform: translateY(-50%) translateX(-50%)
}
```

## 14、Css布局方式有哪些。每种方式有什么缺点
1. table布局 缺点：table 比其它 html 标记占更多的字节（造成下载时间延迟,占用服务器更多流量资源），
<br/>table 会阻挡浏览器渲染引擎的渲染顺序。(会延迟页面的生成速度,让用户等待更久的时间)
2. flex布局 
	* 盒模型
	* display/position
	* flexbox布局
3. float布局
	* 高度塌陷
	* 两栏布局
	* 三栏布局
4. 响应式布局
	* meta标签
	* 使用rem
	* media query

## 15、二叉树 前、中、后序遍历 ，如何用数组存储二叉树？
二叉树遍历分为三种: 前序，中序，后序。其中中序遍历最为重要（java很多树排序是基于中序）。A是根节点，B是左节点，C是右节点。
* 前序遍历顺序： A - B - C
* 中序遍历顺序： B - A - C
* 后序遍历顺序： B - C - A 

## 16、如何用数组存储二叉树？
```
// 示例：树形数据的结构
"type": "logic",
"content": "and",
"left": {
    "type": "leaf",
    "content": "=",
    "left": "ID",
    "right": "123"
},
"right": {
    "type": "leaf",
    "content": "~",
    "left": "Time",
    "right": "234~"
}
```
即每个节点都包含type, content, left,right四个属性，其中type, content包含该结点的数据，<br/>
left和right包含该借点的左右子树节点。而我们关心的数据始终都包含在叶子节点中。<br/>
父节点的type始终为logic，叶节点的type为leaf或者model，其中model始终有一个右子树节点，他的下面不会有其它节点。<br/>
将它解析为数组格式的话就要用到递归方法了：
```
// 声明一个变量用来存储结果
var res = [];
function treeToArr(t){
	if(t.type == 'logic'){ // 是父节点
		if(t.right.type == 'model'){
			res.push({
				relation: 'and',
				field: t.right.left,
				value: t.right.right.content,
				operation: t.right.content
			})
		}else{
			res.push({
				relation: 'and',
				field: t.right.left,
				value: t.right.right,
				operation: t.right.content
			})
		}
		// 递归左子树
		treeToArr(t.left)
	}else{ // 是叶子节点
		if(t.type == 'model'){
			res.push({
				relation: 'and',
				field: t.left,
				value: t.right.content,
				operation: t.content
			})
		}else{
			res.push({
				relation: 'and',
				field: t.left,
				value: t.right,
				operation: t.content
			})
		}
	}
}
```

## 16、冒泡排序（Bubble Sort）
作为最简单的排序算法之一<br/>
工作原理：它重复地走访过要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。<br/>
走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。
```
function bubbleSort(arr){
	var len = arr.length;
	for(var i=0; i<len; i++){
		for(var j=0; j<len-1-i; j++){
			if(arr[j]>arr[j+1]){ // 相邻元素两两对比
				var temp = arr[j+1]; // 元素交换
				arr[j+1] = arr[j];
				arr[j] = temp;
			}
		}
	}
	return arr;
}
```

## 17、选择排序（Selection Sort）
在时间复杂度上表现最稳定的排序算法之一，因为无论什么数据进去都是o(n²)的时间复杂度。<br/>
所以用到它的时候，数据规模越小越好。唯一的好处就是不占用额外的内存空间。<br/>
工作原理：首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，<br/>
然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。
```
function selectionSort(arr){
	var len = arr.length;
	var minIndex, temp;
	for(var i=0; i<len-1; i++){
		minIndex = i;
		for(var j=i+1; j<len; j++){
			if(arr[j] < arr[minIndex]){ // 寻找最小的树
				minIndex = j; // 将最小数的索引保存
			}
		}
		temp = arr[i];
		arr[i] = arr[minIndex];
		arr[minIndex] = temp;
	}
	return arr;
}
```

## 18、插入排序(Insertion Sort)
插入排序的代码实现虽然没有冒泡排序和选择排序那么简单粗暴，但是它的原理应该是最容易理解的了。<br/>
工作原理：通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。<br/>
插入排序在实现上，通常采用in-place排序(即只用到o(1)的额外空间的排序)，因而在从后向前扫描过程中，<br/>
需要反复把已排序元素逐步向后挪位，为最新元素提供插入空间
```
function insertSort(arr){
	var len = arr.length;
	for(i=1; i<len; i++){
		var key = arr[i];
		var j = i - 1;
		while(j>=0 && arr[j]>key){
			arr[j+1] = arr[j]
			j--;
		}
		arr[j+1] = key;
	}
	return arr;
}
```

## 19、希尔排序（shell sort）又名缩小增量排序
希尔排序是插入排序的一种更高效率的实现。它与插入排序的不同之处在于，它会优先比较距离较远的元素。<br/>
希尔排序的核心在于间隔序列的设定。即可以提前设定好间隔序列，也可以动态的定义间隔序列。
```
function shellSort(arr){
	var len = arr.length,
			temp,
			gap = 1;
	while(gap < len/3){ //动态定义间隔序列
		gap = gap*3+1;
	}
	for(gap; gap>0; gap = Math.floor(gap/3)){
		for(var i = gap; i<len; i++){
			temp = arr[i];
			for(var j=i-gap; j>0 && arr[j]>temp; j-=gap){
				arr[j+gap] = arr[j];
			}
			arr[j+gap] = temp;
		}
	}
	return arr;
}
```

## 20、归并排序(Merge Sort)
作为一种典型的分而治之思想的算法应用，归并排序的实现由两种方法：
1. 自上而下的递归（所有递归的方法都可以用迭代重写，所以就有了第2中方法）
2. 自下而上的迭代
归并排序是一种稳定的排序方法。将已有序的子序列合并，得到完全有序的序列，即先使每个子序列有序，再使子序列段间有序。<br/>
若将两个有序表合并成一个有序表，称为二路归并。
```
function mergeSort(arr){
	var len = arr.length;
	if(len<2){
		return arr
	}
	var middle = Math.floor(len/2);
	var left = arr.slice(0, middle)
	var right = arr.slice(middle)
	return merge(mergeSort(left), mergeSort(right));
}
function merge(left,right){
	var result = [];
	while(left.length && right.length){
		if(left[0] < right[0]){
			result.push(left.shift())
		}else{
			result.push(right.shift())
		}
	}
	while(left.length){
		result.push(left.shift())
	}
	while(right.length){
		result.push(right.shift())
	}
	return result
}
```

## 21、快速排序(Quick Sort)
快速排序是处理大数据集最快的排序算法之一。它是一种分而治之的算法，通过递归的方法将数据依次分解为包含较小元素和较大元素的不同子序列。<br/>
该算法不断重复这个步骤直到所有数据都是有序的。这个算法首先要在列表中选择一个元素作为基准值。<br/>
数据排序围绕基准值进行，将列表中小于基准值的元素移到数组的底部，将大于基准值的元素移到数组的顶部。
```
function qSort(arr){
	if(arr.length == 0){
		return []
	}
	var left = [];
	var right = [];
	var pivot = arr[0]
	for(var i=1; i<arr.length; i++){
		if(arr[i] < pivot){
			left.push(arr[i])
		}else{
			right.push(arr[i])
		}
	}
	return qSort(left).concat(pivot, qSort(right))
}
```

## 22、检索算法
在列表中查找数据有两种方式: 顺序查找和二分查找。顺序查找适合用于元素随机排序的列表。<br/>
二分查找适用于元素已排序的列表 二分查找效率更高，但是必须在进行查找之前花费额外时间将列表中的元素排序。<br/>
顺序查找（线性查找） ： 对于查找数据，最简单的方法就是从列表的第一个元素开始对列表元素逐个进行判断，直到找到了想要的结果。<br/>
或者直到列表结尾也没有找到。
```
function seqSearch(arr, data){
	for(var i=0; i<arr.length; i++){
		if(arr[i] == data){
			return i;
		}
	}
	return -1;
}
```
二分查找：也叫折半查找，是一种在有序数组中查找特定元素的搜索算法。<br/>
原理：
1. 从有序数组的中间的元素开始搜索，如果该元素正好是目标元素（既要查找的元素）则搜索过程结束，否则进行下一步
2. 如果目标元素大于或者小于中间元素，则在数组大于或者小于中间元素的那一半区域查找，然后重复第一步的操作。
```
function binSearch(arr,data){
	var low = 0;
	var high = arr.length - 1;
	while(low <= high){
		var middle = Math.floor((low+high)/2)
		if(arr[middle]<data){
			low = middle +1 
		}else if(arr[middle]>data){
			higt = middle - 1
		}else{
			return middle
		}
	}
	return -1
}
```

## 23、斐波那契数
斐波那契指的是这样一个数列：1、1、2、3、5、8、13、21、34......<br/>
在数学上，斐波纳契数列以如下被以递归的方法定义：F(1)=1，F(2)=1, F(n)=F(n-1)+F(n-2)（n>=2，n∈N*）;<br/>
随着数列项数的增加，前一项与后一项之比越来越逼近黄金分割的数值0.6180339887..…
```
// 方法1：递归
function fibonacci(n){
	if(n<=2){
		return 1;
	}else{
		return fibonacci(n-1) + fibonacci(n-2)
	}
}
// 注： 但是当参数n变大时，出现浏览器假死现象
```

```
// 方法2：尾调用优化
function fibonacci(n, res1 = 1, res2 = 2){
	if(n<=2){
		return res2;
	}else{
		return fibonacci(n-1, res2, res1 + res2)
	}
}
```

## 24、水仙花数
```
var a = 0, b =0 , c=0
for(var i=100; i<1000; i++){
	a = i%10;
	b=parseInt(((i/10)%10));
	c=parseInt(i/100);
	if(i === a*a*a +b*b*b+c*c*c){
		document.write('水仙花数：'+i+'<br/>');
	}
}
```

## 25、获取当前url，并分解出所有参数 （百度）
js获取url中的一些参数的意思
* location对象，含有当前url的信息，属性href整个url字符串
* protocol，含有url第一部分的字符串，如http：
* host，包含url中主机名，端口号部分字符串，如//www.cenpok.net/server/
* hostname，包含url中主机名的字符串 如http://www.cenpok.net
* port，包含url中可能存在的端口号字符串
* pathname，url中'/'以后的部分、如 list/index.html
* hash '#'号之后的字符串
* search '?'号之后的字符串
 
```
// 第一种：只适用于/User/vip_card_manager?useless=219
function urlSearch(){
	var name, value;
	var str=location.href; //取得整个地址栏
	var num=str.indexOf('?')
	str=str.substr(num+1); //取得所有参数
	var arr = str.split('&'); //各个参数放在数组中
	var result = {}
	for(var i=0; i<arr.length; i++){
		num = arr[i].indexOf('=');
		if(num>0){
			name = arr[i].substring(0,num);
			value=arr[i].substr(num+1);
			result[name]=value;
		}
	}
	return result
}
```

```
/**
（2）第二种：适应以下两种模式，来获取url参数值：
	/User/vip_card_manager/useless/219/id/18
	/User/vip_card_manager?useless=219&id=18
*/
function getQueryString(name){
	var reg = new RegExp('(^|&)' + name +'=([^&]*)(&|$)','i');
	var reg_rewrite = new RegExp('(^|/)' + name + '/([^/]*)(/|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	var q = window.location.pathname.substr(1).match(reg_rewrite);
	if(r != null){
		return unescape(r[2]);  // unescape()函数可以通过escape()编码的字符串进行解码
	}else if(q!= null){
		return unescape(q[2]);
	}else{
		return null;
	}
}
```

## 26、解释下原型继承的原理
以下代码展示了js引擎如何查找属性：
```
function getProperty(obj, prop){
	if (obj.hasOwnProperty(prop)) {
		return obj[prop];
	} else if (obj._proto_!=null) {
		return getProperty(obj._proto_, prop);
	} else {
		return undefined;
	}
}
```

## 27、js实现数组去重
* 创建一个新的临时数组来保存数组中已有的元素
```
var a = new Array(1,2,2,2,2,5,3,2,9,6,3);
Array.prototype.uniqueOne = function(){
	var n = []; // 一个新的临时数组
	for(var i=0; i<this.length; i++){
		// 如果把当前数组的第i项已经保存进了临时数组，那么跳过
		if(n.indexOf(this[i]) == -1){
			n.push(this[i]);
		}
	}
	return n;
}
console.log(`去重后的数组：${a.uniqueOne()}`)
```
* 使用哈希表存储已有的元素(该方法最快)
```
Array.prototype.uniqueTwo = function(){
	var hash = {},
		n = []; //hash 作为hash表，n为临时数组
	for(var i=0; i<this.length; i++>){
		if(!hash[this[i]]){ // 如果hash表中没有当前项
			hash[this[i]] = true; //存入hash表
			n.push(this[i]); // 当前元素push到临时数组中
		}
	}
	return n;
}
```
* 使用indexOf判断数组元素第一次出现的位置是否为当前位置
```
Array.prototype.uniqueThree = function(){
	var n = [this[0]];
	for(var i=0; i<this.length; i++>){ //从第二项开始遍历
		// 如果当前数组元素在数组中出现的第一次位置不是i,说明是重复元素
		if(this.indexOf(this[i]) == i){
			n.push(this[i])
		}
	}
}
```
* 先排序再去重
```
Array.prototype.uniqueFour = function(){
	this.sort(function(a,b){
		return a-b
	})
	var n = [this[0]];
	for(var i=1; i<this.length; i++){
		if(this[i] != this[i-1]){
			n.push(this[i])
		}
	}
	return n;
}
```

## 28、不借助临时变量，进行两个整数的交换
假如 输入a=2,b=4, 需要输入a=4,b=2
这种问题非常巧妙，需要大家跳出惯有思维，利用a,b进行置换
主要是利用+-去进行运算，类似a=a+(b-a)实际上等同于最后的a=b
```
function swap(a, b){
	b = b - a;
	a = a + b;
	b = a - b;
	return [a, b]
}
```

## 29、获取数组中最大或最小值
```
// 该方法适合一维或多维数组求最大最小值得情况
function maxAndMin(arr){
	return {
		max: Math.max.apply(null, arr.join(',').split(',')),
		min: Math.min.apply(null, arr.join(',').split(','))
	}
}
```
## 30、找出数组中只出现一次的元素
```
function num(arr){
	var str = arr.join('');
	var res = [];	
	for(var i=0; i<str.length; i++){
		var num = (str.split(str[i])).length-1);
		if(num===1){
			res.push(str[i]);
		}
	}
}
```
## 31、将数组按层次展开
```
var list = [1,2,[3,4],[5,6,[7,8],9],10,11]
var res = [];
function flatten(list,depth){
		if(deptn == 0){
			for(var i=0; i<list.length; i++){
				res.push(list[i]);
			}
			return;
		}
		for(var i=0; i<list.length; i++){
			if(list[i] instanceof Array){
				flatten(list[i], depth - 1);
			}else{
				res.push(list[i]);
			}
		}
		return res;
}
console.log(flatten(list, 1));
res = [];
console.log(flatten(list, 2))
```

## 32、 区分splice(), slice(), split()
### slice
* (数组) 用法：`array.slice(start, end)`<br/>
解释：该方法是对数组进行部分截取，并返回一个数组副本，参数start是截取的开始数组索引，end参数等于你要取得最后一个字符的位置加1（可选）
```
// (1)如果不传入参数2，那么将从参数1的索引位置开始截取，一直到数组尾
var a = [1,2,3,4,5,6];
var b = a.slice(0,3); // [1,2,3]
var c = a.slice(3);  // [4,5,6]

// (2)如果两个参数中的任意一个是负数，array.length会和它们相加，试图让它们成为非负数.
// 举例：当只传入一个参数，且是负数时，length会与参数相加，然后再截取
var a = [1,2,3,4,5,6];
var b = a.slice(-1); // [6]

// (3)当只传入一个参数，是负数时，并且参数的绝对值大于数组length时，会截取整个数组
var a = [1,2,3,4,5,6];
var b = a.slice(2,-3); // [3]

// (4)当传入一个参数，大于length，将返回一个空数组
var a = [1,2,3,4,5,6];
var b = a.slice(6); // []
```
* (字符串) 用法: `string.slice(start, end)`<br/>
解释： slice方法复制string的一部分来构造一个新的字符串，用法与参数均和数组的slice方法一样，end参数等于你要取的最后一个字符的位置值加上1
```
	var a = 'i am a boy';
	var b = a.slice(0,6); // 'i am a'
```
### splice
* （数组）用法：`array.splice(start, deleteCount, item...)`<br/>
解释：splice方法从array这种移除一个或多个数组，并用新的item替换它们。参数start是从数组array中移除元素的开始位置，参数deleteCount是要移除的元素的个数<br/>
如果有额外的参数，那么item会插入到被移除元素的位置上。它返回一个包含被移除元素的数组。
```
var a = ['a', 'b', 'c'];
var b = a.splice(1, 1, 'e', 'f'); // a=['a', 'e', 'f', 'c'] ,b=['b']
```
### split
* (字符串) 用法：`string.split(separator, limit)`<br/>
解释：split方法把这个string分割成片端来创造一个字符串数组。可选参数limit可以限制被分割的片段数量。separator参数可以是一个字符串或是一个正则表达式。如果separator是一个空字符，会返回一个单字符的数组。
```
var a = '0123456';
var b = a.split('', 3); // b = ['0', '1', '2']
```
## 33、 实现阶乘（递归）
```
function factorialize(num){
	if(num < 0){
		return -1;
	}else if(num === 0 || num === 1){
		return 1
	}else{
		return ( num * factorialize(num - 1))
	}
}
```

## 34、string里的每个单词首字母大写
```
function titleCase(str){
	return str.toLowerCase().split(' ').map((item)=>{
		return item.replace(item.charAt(0),item[0].toUpperCase())
	}).join(' ')
}
titleCase("I'm a little tea pot");
```

## 35、返回数组中最大的数
注：其实还有一种就是for循环
```
function largestOfFour(arr){
	var new_arr = [];
	for(var i=0; i<arr.length; i++){
		arr[i].sort(function(a,b){
			return b - a;
		})
		new_arr.push(arr[i][0]);
	}
	return new_arr;
}
largestOfFour([[4, 5, 1, 3], [13, 27, 18, 26], [32, 35, 37, 39], [1000, 1001, 857, 1]])
```

## 36、使用promise对setTimeout进行封装，从而支持链式的调用
```
const delay = (func, millisec, options) =>{
	let timer = 0
	let reject = null
	const promise = new Promise((resolve, _reject)=>{
		reject = _reject
		timer = setTimeout(()=>{
			resolve(func(options))
		},millisec)
	})
	return {
		get promise(){
			return promise
		},
		cancel(){
			if(timer){
				clearTimeout(timer)
				timer = 0
				reject(new Error('timer is cancelled'))
				reject = null
			}
		}
	}
}

// 使用
const d = delay(({a, b})=>{
	console.log(a, b)
	return a + b
}, 2000, {a: 1, b: 3})

d.promise.then((result)=>{
	console.log('result', result)
}).catch((err)=>{
	console.log(err)
})
// cancel
// setTimeout(()=>{
//	d.cancel()
// },1000)
```
url: http://daief.github.io/2018-08-21/encapsulate-setTimeout-with-promise.html

## 37、页面布局
题目：假设高度已知，请写出三栏布局，其中左右栏宽300px，中间自适应<br/>
1.  浮动解决方案
```
.left{
	float: left;
	width: 300px;
	background-color: red;
}
.right{
	float: right;
	width: 300px;
	background-color: yellow;
}
.center{
	background-color: blue;
}
```
2. 绝对定位解决方案
```
.left{
	left: 0;
	width: 300px;
	background-color: red;
}
.center{
	left: 300px;
	right: 300px;
	background-color：yellow;
}
.right{
	right: 0;
	width: 300px;
	background-color: blue;
}
```
3. flexbox解决方案
```
// 容器设为flex
.box{
	display: flex;
}
.left{
	width: 300px;
	background-color: red;
}
.center{
	flex: 1;
	background-color: yellow;
}
.right{
	width: 300px;
	background-color: blue;
}
```
4. 表格布局解决方案
```
.box{
	// 容器设置为table
	display: table;
}
.left{
	display: table-cell;
	width: 300px;
	background-color: red;
}
.center{
	display: table-cell;
	background-color: yellow;
}
.right{
	display: table-cell;
	width: 300px;
	background-color: blue;
}
```
5. 网格布局
```
.box{ // 容器设置
	display: grid;
	grid-template-row: 100px;
	grid-template-columns: 300px auto 300px;
}
.left{
	background-color: red;
}
.center{
	background-color: yellow;
}
.right{
	background-color: blue;
}
```
优缺点分析：
* 浮动布局：脱离文档流但兼容性好
* 绝对定位：脱离文档流导致子元素也脱离文档流但快捷
* flex布局：较完美，但ie8不能兼容
* 表格布局：兼容性好

## 38、边距重叠解决方案（BFC）
BFC，Block Formatting Context 直译为‘块级格式化上下文’<br/>
#### BFC原理：
1. 内部的box会在垂直方向，一个接一个的放置
2. 每个元素的margin box的左边，与包含块border box的左边相接触（对于从左往右的格式化，否则相反）
3. box垂直方向的距离由margin决定，属于同一个bfc的两个相邻box的margin会发生重叠
4. bfc的区域不会与浮动区域的box重叠
5. bfc是一个页面上独立的容器，外面的元素不会影响bfc里面的元素，反过来，里面的元素也不会影响外面的元素
6. 计算bfc高度的时候，浮动元素也会参与计算<br/>
#### 怎么创建bfc
1. float属性不为none（脱离文档流）
2. position为absolute或fixed
3. display为inline-block，table-cell，table-caption，flex，inline-flex
4. overflow不为visible
5. 根元素
#### 应用场景
1. 自适应两栏布局
2. 清除内部浮动
3. 防止垂直margin重叠

## 39、介绍下npm模块安装机制，为啥输入npm install就可以自动安装对应模块？
1. npm模块安装机制：
	* 发出npm install 命令
	* 查询node_modules目录之中是否已经存在指定模块
		* 若存在，不再重新安装
		* 若不存在
			* npm 向registry查询模块压缩包的网址
			* 下载压缩包，存放在根目录下的.npm目录里
			* 解压压缩包到当前项目的node_modules目录
2. npm 实现原理<br/>
输入npm install 命令并桥下回车后，会经历如下几个阶段（以npm 5.5.1为例）：
	1. 执行工程自身preinstall <br/>
当前npm 工程如果定义了preinstall钩子此时会被执行
	2. 确定首层依赖模块 <br/>
首先需要做的是确认工程中的首层依赖，也就是dependencies和devDependencies属性中直接指定的模块（假设此时没有添加npm install 参数）。
工程本身是整棵依赖树的根节点，每个首层依赖模块都是根节点下面的一颗子树，npm会开启多进程从每个首层依赖模块开始逐步寻找更深层级的节点。
	3. 获取模块
获取模块是一个递归的过程，分为以下几步：
    	* 获取模块信息。在下载一个模块之前，首先要确定其版本，这是因为package.json中往往是semantic version(semver, 语义化版本)。此时如果版本描述文件(npm-shrinkwrap.json或package-lock.json)中有该模块信息直接拿即可，如果没有则从仓库获取。如果package.json中某个包的版本是^1.1.0, npm就会去仓库中获取符合1.x.x形式的最新版本。
		* 获取模块实体。上一步会获取到模块的压缩包地址（resolved字段），npm会用此地址检查本地缓存，缓存中有就直接拿，如果没有则从仓库下载。
		* 查找该模块依赖，如果有依赖则回到第一步，如果没有则停止。
	4. 模块扁平化（dedupe）
	上一步获取到的是一颗完整的依赖树，其中可能包含大量重复模块。比如A模块依赖于loadsh，B模块同样依赖于lodash。在npm3以前会严格按照依赖树的结构进行安装，因此会造成模块冗余。
	从npm3开始默认加入了一个dedupe的过程。它会遍历所有的节点，逐个将模块放在根节点下面，也就是node-modules的第一层。当发现有重复模块时，则将其丢弃。
	这里需要对重复模块进行一个定义，它指的是模块名相同且semver兼容。每个semver都对应一段版本允许范围，如果两个模块的版本允许范围存在交集，那么就可以得到一个兼容版本，而不必版本号完全一致，这可以使更多冗余模块在dedupe过程中被去掉。
	5. 安装模块
	这一步将会更新工程中的node_modules,并执行模块中的生命周期函数（按照preinstall，install，postinstall的顺序）
	6. 执行工程自身生命周期
	当前npm工程如果定义了钩子此时会被执行（按照install、postinstall、prepublish、prepare的顺序）。
	最后一步是生成或更新版本描述文件，npm install 过程完成。

## 40、介绍下观察者模式 与 订阅-发布模式的区别，各适用什么场景
![Image text](https://user-images.githubusercontent.com/18718461/53536375-228ba180-3b41-11e9-9737-d71f85040cfc.png)
* 观察者模式中主体和观察者是互相感知的，发布-订阅模式是借助第三方来实现调度的，发布者和订阅者之间互不感知。
* 发布-订阅模式就好像报社， 邮局和个人的关系，报纸的订阅和分发是由邮局来完成的。报社只负责将报纸发送给邮局。
* 观察者模式就好像 个体奶农和个人的关系。奶农负责统计有多少人订了产品，所以个人都会有一个相同拿牛奶的方法。奶农有新奶了就负责调用这个方法。

## 41、聊聊Redux和Vuex的设计思想
url：https://zhuanlan.zhihu.com/p/53599723

## 42、改造下面代码，使之输出0-9，写出你能想到的所有解法
```
for(var i=0; i<10; i++){
	setTimeout(()=>{
		console.log(i)
	},1000)
}
```
* 方法一<br/>
	原理： 
	* 利用setTimeout函数的第三个参数，会作为回调函数的第一个参数传入
	* 利用bind函数部分执行的特性<br/>
```
//代码1：
for(var i=0; i<10; i++){
	setTimeout(i => {
		console.log(i);
	},1000,i)
}
//代码2：
for(var i=0; i<10; i++){
	setTimeout(
		console.log, 1000, i
	)
}
//代码3：
for(var i=0; i<10; i++){
	setTimeout(console.log.bind(Object.create(null),i),1000)
}
```
* 方法二<br/>
	原理：
	* 利用let变量的特性---在每一次for循环的过程中，let声明的变量会在当前的块级作用域里面（for循环的body体，也即两个花括号之间的内容区域）创建一个文法环境（Lexical Environment），该环境里面包括了当前for循环过程中的i
```
//代码1：
for (let i=0; i<10, i++){
	setTimeout(()=>{
		console.log(i)
	},1000)
}
//等价于
for(let i=0; i<10; i++){
	let _i = i ; //const _i = i;
	setTimeout(()=>{
		console.log(_i);
	},1000)
}
```
* 方法三<br/>
	原理：
	* 利用函数自执行的方式，把当前for循环过程中的i传递过去，构建出块级作用域。IIFE其实并不属于闭包的范畴。
	* 利用其它方式构建出块级作用域
```
//代码1：
for(var i=0; i<10; i++){
	(i=>{
		setTimeout(()=>{
			console.log(i);
		},1000)
	})(i)
}
//代码2：
for(var i=0; i<10; i++){
	try {
		throw new Error(i);
	}catch({
		message: i
	}){
		setTimeout(()=>{
			console.log(i)
		},1000)
	}
}
```
* 方法四<br/>
	原理：
	* 很多其它的方案只是把console.log(i)放在一个函数里面，因为setTimeout函数的第一个参数只接受函数以及字符串，如果是js语句的话，js引擎应该会自动在该语句外面包裹一层函数
```
	//代码1：
	for(var i=0; i<10; i++){
		setTimeout(console.log(i), 1000)
	}
	//代码2：
	for(var i=0; i<10; i++){
		setTimeout((()=>{
			console,log(i)
		})(),1000)
	}
	//代码3：
	for(var i=0; i<10; i++){
		setTimeout((i=>{
			console.log(i);
		})(i),1000)
	}
	//代码4：
	for(var i=0; i<10; i++){
		setTimeout((i=>{
			console.log(i)
		}).call(Object.create(null),i),1000)
	}
	//代码5:
	for(var i=0;i<10;i++){
		setTimeout((i)=>{
			console.log(i)
		}).apply(Object.create(null),[i]), 1000)
	}
	//代码6:
	for(var i=0; i<10; i++){
		setTimeout((i=>{
			console.log(i)
		}).apply(Object.create(null), {length:1, '0':i}),1000)
	}
```
* 方法五<br/>
	原理：
	* 利用eval或者new Function执行字符串，然后执行过程同方法四代码1：
```
//代码1：
for(var i=0; i<10; i++){
	setTimeout(eval('console.log(i)'),1000)
}
//代码2：
for(var i=0; i<10; i++){
	setTimeout(new Function('i','console.log(i)')(i),1000)
}
//代码3：
for(var i=0; i<10; i++){
	setTimeout(new Function('console.log(i)')(),1000)
}
```

## 43、Vue的响应式原理中Object.defineProperty有什么缺陷？为什么在Vue3.0采用了Proxy，抛弃了Object.defineProperty?
1. Object.defineProperty无法监控到数组下标的变化，导致通过数组下标添加元素，不能实时响应。
2. Object.defineProperty只能劫持对象的属性，从而需要对每个对象，每个属性进行好好遍历，如果，属性值是对象，还需要深度遍历。Proxy可以劫持整个对象，并返回一个新的对象。
3. Proxy不仅可以代理对象，还可以代理数组。还可以代理动态增加的属性。

## 44、为什么通常在发送数据埋点请求的时候使用的是1x1像素的透明gig图片？
英文术语叫: image beacon<br/>
主要应用于只需要向服务器发送数据(日志数据)的场合，且无需服务器有消息体回应。比如收集访问者的统计信息。
一般做法是服务器用一个1x1的gif图片来作为响应，当然这有点浪费服务器资源。因此用header来响应比较合适，目前比较合适的做法是服务器发送"204 No Content"，即“服务器成功处理了请求，但不需要返回任何实体内容”。
另外该脚本的位置一般放在页面最后以免阻塞页面渲染,并且一般情况下也不需要append到DOM中。通过它的onerror和onload事件来检测发送状态。
```
<script type="text/javascript">
	var thisPage = location.href;
	var referringPage = (document.referrer) ? document.referrer : "none";
	var beacon = new Image();
	beacon.src = "http://www.example.com/logger/beacon.gif?page=" + encodeURI(thisPage) 
	+ "&ref=" + encodeURI(referringPage);
</script>
```
原因：
1. 没有跨域问题，一般这种上报数据，代码要写通用的（img天然支持跨域）
2. 不会阻塞页面加载，影响用户体验，只要new Image对象就好了; (排除JS/css文件资源上报)
3. 在所有图片中，体积最小（相对于PNG/JPG）
4. 能够完成整个HTTP请求+响应（尽管不需要相应内容）
5. 触发GET请求之后不需要获取和处理数据，服务器也不需要发送数据,并且一般客户端也不需要做出响应,只关心数据是否发送到服务器
6. 相比XMLHttpRequest对象发送GET请求，性能上更好
7. GIF的最低合法体积最小（最小的BMP文件需要74字节，PNG需要67字节，GIF只需要43字节）
8. 图片请求不占用Ajax请求限额

## 45、JS异步解决方案的发展历程以及优缺点
1. 回调函数（callback）
	```
	setTimeout(()=>{
		// callback 函数体
	},1000)
	```
	* 优点：解决了同步的问题(只要有一个任务耗时很长，后面的任务都必须排队等候，会拖延整个程序的执行)<br/>
	* 缺点：回调地狱，不能用try catch捕获错误，不能return<br/>
	回调地狱的问题在于：
		* 缺乏顺序性： 回调地狱导致的调试困难，和大脑的思维方式不符
		* 嵌套函数存在耦合性，一旦有所改动，就会牵一发而动全身，即(控制反转)
		* 嵌套函数过多的话，很难处理错误
	```
	ajax('xxx',()=>{
		// callback函数体
		ajax('xxx2',()=>{
			// callback函数体
			ajax('xxx3',()=>{
				// callback 函数体
			})
		})
	})
	```

2. Promise<br/>
Promise就是为了解决callback的问题而产生的。
Promise实现了链式调用，也就是说每次then后返回的都是一个全新的Promise，如果我们在then中return，return的结果会被Promise.resolve()包装
	* 优点：解决了回调地狱的问题
	```
	ajax('xxx1')
		.then(res => {
			// 操作逻辑
			return ajax('xxx2')
		}).then(res => {
			// 操作逻辑
			return ajax('xxx3')
		}).then(res => {
			// 操作逻辑
		})
	```
	* 缺点：无法取消promise，错误需要通过回调函数来捕获

3. Generator<br/>
	特点：可以控制函数的执行，可以配合co函数库使用
	```
	function *fetch(){
		yield ajax('xxx1', () => {})
		yield ajax('xxx2', () => {})
		yield ajax('xxx3', () => {})
	}
	let it = fetch()
	let result1 = it.next()
	let result2 = it.next()
	let result3 = it.next()
	```

4. Async/await<br/>
	async，await是异步的终极解决方案
	* 优点：代码清晰，不用像Promise写一大堆then链，处理了回调地狱的问题
	* 缺点：await将异步代码改造成同步代码，如果多个异步操作没有依赖性而使用await会导致性能上的降低
	```
	async function test(){
		// 以下代码没有依赖性的话，完全可以使用Promise.all的方式
		// 如果有依赖性的话，其实就是解决回调地狱的例子
		await fetch('xxx1')
		await fetch('xxx2')
		await fetch('xxx3')
	}
	```
	下面来看一个使用await的例子
	```
	let a = 0
	let b = async () => {
		a = a + await 10
		console.log('2',a) // -> '2' 10
	}
	b()
	a++
	console.log('1', a) // -> '1' 1
	```
	对于以上代码可能会心存疑惑，解释下原因
	* 首先函数b先执行，在执行到await 10之前变量a还是0，因为await内部实现了generator，generator会保留堆栈中东西，所以这时候a = 0被保存下来
	* 因为await是异步操作，后来的表达式不返回Promise的话，就会包装成Promise.resolve(返回值)，然后会去执行函数外的同步代码
	* 同步代码执行完毕后开始执行异步代码，将保存下来的值拿出来使用，这时候a=0+10<br/>

	上述解释中提到了await内部实现了generator，其实await就是generator加上Promise的语法糖，且内部实现了自动执行generator。如果熟悉co的话，其实自己就可以实现这样的语法糖。

## 46、为什么 0.1 + 0.2 != 0.3
因为JS采用了IEEE 754双精度版本(64位)，并且只要采用IEEE 754的语言都有该问题。我们都知道计算机表示十进制是采用二进制表示的，所以0.1在二进制表示为
```
// (0011) 表示循环
0.1 = 2^-4 * 1.10011(0011)
```
小数算二进制和整数不同。乘法计算时，只计算小数位，整数位用作每一位的二进制，并且得到的第一位为最高位。所以我们得出0.1 = 2^-4 * 1.10011(0011), 那么0.2的演算也基本如上所示，只需要去掉第一步乘法，所以得出0.2 = 2^-3 * 1.10011(0011)。
回来继续说IEEE 754双精度。六十四位中符号位占一位，整数位占十一位，其余五十二位都为小数位。因为0.1和0.2都是无限循环的二进制了，所以在小数位末尾处需要判断是否进位(就和十进制的四舍五入一样)
所以2^-4*1.10011...001进位后就变成了2^-4 * 1.10011(0011 * 12次)010。那么把这两个二进制加起来会得出2^-2 * 1.0011(0011 * 11次)0100， 这个值算成十进制就是 0.30000000000000004
下面说一下原生解决办法，如下代码所示：
`parseFloat((0.1 + 0.2).toFixed(10))`

## 47、正则表达式
#### 元字符
| 元字符 | 作用 |
|:-----:|:------|
|.|匹配任意字符除了换行符和回车符|
|[ ]|匹配方括号内的任意字符。比如[0-9]就可以用来匹配任意数字|
|^|^9，这样使用代表匹配以9开头。[^9]，这样使用代表不匹配方括号内除了9的字符|
|{1,2}|匹配1到2位字符|
|(xh)|只匹配和xh相同字符串|
| \| | 匹配 \| 前后任意字符 |  
| \ | 转义 |
|*|只匹配出现0次及以上 * 前的字符|
|+|只匹配出现1次及以上 + 前的字符|
|？|？之前字符可选|

#### 修饰语
修饰语|作用
-------- | --------
i|忽略大小写
g|全局搜索匹配
m|多行

#### 字符缩写
简写|作用
-------- | --------
\w|匹配字母数字或下划线。等价于“[A-Za-z0-9_]”。
\W|匹配任何非单词字符。等价于“[^A-Za-z0-9_]”。
\s|匹配任意的空白字符。包括空格、制表符、换页符等等。等价于[ \f\n\r\t\v]。
\S|匹配任何非空白字符。等价于[^ \f\n\r\t\v]。
\d|匹配数字字符。等价于[0-9]。
\D|和上面相反。匹配一个非数字字符。等价于[^0-9]。
\b|匹配单词的开始或结束。匹配一个单词边界，也就是指单词和空格间的位置。例如，“er\b”可以匹配“never”中的“er”，但不能匹配“verb”中的“er”。
\B|和上面相反。匹配非单词边界。“er\B”能匹配“verb”中的“er”，但不能匹配“never”中的“er”。

#### 常用正则表达式
使用场景|对应正则表达式
-------- | --------
用户名|/^[a-z0-9_-]{3,16}$/
密码|/^[a-z0-9_-]{6,18}$/
十六进制值|/^#?[a-f0-9]{6}|[a-f0-9]{3})$/
电子邮箱|/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/  或者  /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/
URL|/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/
删除代码\\\注释|(?\<\!http:\|\S)//.*$

## 48、Proxy
Proxy是ES6中新增的功能，可以用来自定义对象中的操作
```
let p = new Proxy(target, handler);
// `target`代表需要添加代理的对象
// `handler` 用来自定义对象中的操作
```
可以很方便的使用Proxy来实现一个数据绑定和监听
```
let onWatch = (obj, setBind, getLogger){
	let handler = {
		get(target, property, receiver){
			getLogger(target, property)
			return Reflect.get(target,property,receiver);
		},
		set(target, property, value, receiver){
			setBind(value);
			return Reflect.set(target, property, value);
		}
	}
	return new Proxy(obj, handler);
};

let obj = { a : 1 }
let value
let p = onWatch(obj, (v)=>{
	value = v
}, (target, property)=>{
	console.log(`Get '${property}' = ${target[property]}`)
})
p.a = 2 // bind `value` to `2`
p.a // -> Get 'a' = 2
```

## 49、闭包
闭包的定义很简单: 函数A返回一个函数B, 并且函数B中使用了函数A的变量，函数B就被称为闭包。
```
function A(){
	let a = 1
	function B(){
		console.log(a)
	}
	return B
}
```
你是否会疑惑，为什么函数A已经弹出调用栈了，为什么函数B还能引用到函数A中的变量。因为函数A中的变量这个时候是存储在堆上的。现在的JS引擎可以通过逃逸分析辨别出哪些变量需要存储在堆上，哪些需要存储在栈上。

## 50、如何实现浏览器内多个标签页之间的通信(阿里)
* WebSocket 
* ShareWorker
* 调用localStorage，cookies等本地存储方式
	localStorage另一个浏览上下文里被添加，修改或删除时，它都会触发一个事件，通过监听事件，控制它的值进行页面信息通信
	Safari在无痕浏览模式下设置localStorage值会抛出Quota ExceededError

## 51、WebSocket
* H5提供了一种在单个TCP连接上进行全双工通信的协议，使客户端和服务器之间数据交换变得简单，允许服务器主动向客户端推送数据。浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性连接，并进行双向数据传输。<br/>
* 目前，多数网站为了实现推送技术，所用技术都是Ajax轮询<br/>
* 轮询：在特定时间间隔，由浏览器对服务器发送http请求，然后由服务器返回最近的数据给客户端浏览器。<br/>
* 明显缺陷：浏览器需要不断向服务器发出请求，然而http请求可能包含较长的头部，其中真正有效的数据可可能只是很少的一部分，会浪费带宽
* H5-WebSocket协议，可以更好节省服务器资源和带宽。能够更加实时的进行通讯。用Send()f方法向服务器发送数据，通过onmessage事件来接受服务器返回的数据
* 创建WebSocket对象 `var socket = new WebSocket(url,[protocol])`
* readyState 
	* 0 --表示连接尚未建立
	* 1 --表示连接已建立，可以进行通信
	* 2 --表示连接正在进行关闭
	* 3 --表示连接已经关闭或连接不能打开
* 事件 
	* onOpen --连接建立时触发
	* onMessage --客户端接受服务器端数据时触发
	* onError -- 通信发生错误时触发
	* onClose -- 连接关闭时触发

## 52、Web 存储
cookie，localStorage，sessionStorage，indexDB
|特性|cookie|localStorage|sessionStorage|indexDB|
|--|--|--|--|--|
|数据生命周期|一般由服务器生成，可以设置过期时间|除非被清理，否则一直存在|页面关闭就清理|除非被清理，否则一直存在|
|数据存储大小|4K|5M|5M|无限|
|与服务端通信|每次都会携带在header中，对于请求性能影响|不参与|不参与|不参与|
从上表可以看到，cookie已经不建议用于存储。如果没有大量数据存储要求的话，可以使用localStorage和sessionStorage。对于不怎么改变的数据尽量使用localStorage存储，否则可以用sessionStorage存储<br/>
对于cookies，我们需要注意安全性。
属性|作用
--|--
value|如果用于保存用户登录态，应该将该值加密，不能使用明文的用户标识
http-only|不能通过JS访问Cookie，减少XSS攻击
secure|只能在协议为HTTPS的请求中携带
same-site|规定浏览器不能再跨域请求中携带Cookie，减少CSRF攻击
* Service Worker
Service Worker本质上充当Web应用程序与浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。它们旨在(除其他之外)使得能够创建有效的离线体验，拦截网络请求并基于网络是否可用以及更新的资源是否驻留在服务器上来采取适当的动作。他们还允许访问推送通知和后台同步API。<br/>

目前该技术通常用来做缓存文件，提高首屏速度，可以试着来实现这个功能
```
// index.js
if(navigator.serviceWorker){
	navigator.serviceWorker.register('sw.js').then(function(registration){
		console.log('service worker 注册成功')
	})
	.catch(function(err){
		console.log('service worker 注册失败')
	})
}
// sw.js
// 监听 'install'事件，回调中缓存所需文件
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll(['./index.html', './index.js'])
    })
  )
})
// 拦截所有请求事件
// 如果缓存中已经有请求的数据就直接用缓存，否则去请求数据
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        return response
      }
      console.log('fetch source')
    })
  )
})
```
打开页面，可以在开发者工具中的 Application 看到 Service Worker 已经启动了
![Image text](https://user-gold-cdn.xitu.io/2018/3/28/1626b1e8eba68e1c?w=1770&h=722&f=png&s=192277)
在 Cache 中也可以发现我们所需的文件已被缓存
![Image text](https://user-gold-cdn.xitu.io/2018/3/28/1626b20dfc4fcd26?w=1118&h=728&f=png&s=85610)
当我们重新刷新页面可以发现我们缓存的数据是从 Service Worker 中读取的
![Image text](https://user-gold-cdn.xitu.io/2018/3/28/1626b20e4f8f3257?w=2818&h=298&f=png&s=74833)

## 53、Nginx
Nginx是一个高性能的HTTP和反向代理服务器，同时也是一个IMAP/POP3/SMTP代理服务器。
常见场景有：
* 静态资源服务器
* 动态匹配
* 反向代理
* Gzip压缩
* 负载均衡

先来看一下默认的Nginx配置，我将以此为基础依次介绍Nginx的用法
* Nginx安装目录下的nginx.conf就是Nginx全局的配置文件，我们主要修改这里的内容。nginx.config.default作为配置文件的备份。

https://juejin.im/post/5cae9de95188251ae2324ec3?utm_source=gold_browser_extension

## 54、typeof运算符和instanceof运算符以及isPrototypeOf()方法的区别
typeof是一个运算符，用于检测数据的类型，比如基本数据类型null、undefined、string

## 55、Vue组件中的data为什么必须是一个函数
为什么组件中data必须是一个函数而不是对象，我们首先来看一下第一个声明式渲染的的demo中data 我们只在当前页面的挂载的div#app这个点上使用，但是对于组件有一个很明显的特性就是在于它可以被复用。现在以一个全局注册一个组件来分析<br/>
我们先假设将data作为一个对象：<br/>
因为组件是可以被复用的，那么注册了一个组件本质上就是创建了一个组件构造器的引用，而真正当我们使用组件的时候才会去将组件实例化
```
// 创建一个组件
var Component = function(){

}
Component.prototype.data = {
	a: 1,
	b: 2
}
// 使用组件
var component1 = new Component()
var component2 = new Component()
component1.data.b = 3
component2.data.b  // 3
```
可以发现当使用组件的时候, 虽然data是在构造器的原型链上被创建的，但是实例化的component1和component2确是共享同样的data对象，当你修改一个属性的时候，data也会发生改变，这明显不是我们想要的效果。
```
var Component = function(){
}
Component.prototype.data = function(){
	return {
		a: 1,
		b: 2
	}
}
// 使用组件
var component1 = new Component()
var component2 = new Component()
component1.data.b = 3
component2.data.b // 2
```
当data是一个函数时，每一个实例的data属性都是独立的，不会互相影响。这都是因为js本身的特性带来的。js本身的面向对象编程也是基于原型链和构造函数，应该会注意原型链上添加一般都是一个函数方法而不会去添加一个对象

## 56、Vue集锦
1. vuex有哪几种属性？
	* 5种。分别是State，Getter，Mutation，Action，Module
2. vuex的state特性是？
	* vuex就是一个仓库，仓库里面放了很多对象。其中state就是数据源存放的地方，对应于一般vue对象里面的data
	* state里面存放的数据是响应式的，vue组件从store中读取数据，若是store中的数据发生改变，依赖这个数据的组件也会发生更新
	* 它通过mapState把全局的state和getters映射到当前组件的computed计算属性中
3. vuex的Getter特性是？
	* getters可以对state进行计算操作，它就是store的计算属性
	* 虽然在组件内也可以做计算属性，但是getters可以在多组件之间复用
	* 如果一个状态只在一个组件内使用，是可以不用getters
4. vuex的Mutation特性是？
	* Action类似于mutation，不同在于:
	* （1）Action提交的是mutation，而不是直接变更状态
	* （2）Action可以包含任意异步操作
5. vue.js中ajax请求代码应该写在组件的methods中还是vuex的actions中？
	* 如果请求来的数据时不时要被其他组件公用，仅仅在请求的组件内使用，就不需要放入vuex的state里。
	* 如果被其他地方复用，这个很大几率上是需要的，如果需要，请将需求放入action里，方便复用，并包装成promise返回，在调用处用async await 处理返回的数据，如果不需要复用这个请求，那么直接写在vue文件里比较方便。
6. vue的优点是什么？
	* 低耦合。视图（view）可以独立于Model变化和修改，一个ViewModel可以绑定到不同的'view'上，当view变化的时候Model可以不变，当model变化的时候view也可以不变。
	* 可重用性。 可以把一些视图逻辑放在一个viewModel里面，让很多view重用这段视图逻辑。
	* 独立开发。开发人员可以专注于业务逻辑和数据的开发（viewModel），设计人员可以专注于页面设计
	* 可测试。界面素来是比价难于测试的，而现在测试可以针对ViewModel来写。
7. 什么是MVVM？
	* MVVM是Model-View-ViewModel的缩写。MVVM是一种设计思想。Model层代表数据模型，也可以在Model中定义数据修改和操作的业务逻辑，View代表UI组件，它负责将数据模型转化成UI展现出来，ViewModel是一个同步View和Model的对象。
	* 在MVVM架构下，View和Model之间并没有直接的联系，而是通过ViewModel进行交互，Model和ViewModel之间的交互是双向的，因此View数据的变化会同步到Model中，而Model数据的变化也会立即反映到view上。
	* ViewModel通过双向数据绑定把View层和Model层连接起来，而View和Model之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需手动操作DOM，不需要关注数据状态的同步问题，复杂的数据状态维护完全由MVVM来统一管理。
8. `<keep-alive>\</keep-alive>`的作用是什么？
	* `<keep-alive>\</keep-alive>`包裹动态组件时，会缓存不活动的组件实例，主要用于保留组件状态或避免重新渲染。
	* 在vue 2.1.0版本之后，keep-alive新加入两个属性，include（包含的组件缓存）与exclude（排除的组件不缓存，优先级大于include）。
	```
	<keep-alive include="include_components" exclude="exclude_components">
		<component>
			<!-- 该组件是否缓存取决于include和exclude属性 -->
		</component>
	</keep-alive>
	```

	参数解释
	* include - 字符串货正则表达式，只有名称匹配的组件会被缓存
	* exclude - 字符串或正则表达式，任何名称匹配的组件都不会被缓存
	* include和exclude的属性允许组件有条件的缓存。二者都可以用','分隔字符串，正则表达式，数组。当使用正则或数组时，要记得使用v-bind。 即
	
	```
	<!-- 逗号分隔字符串，只有组件a与b被缓存。 -->
	<keep-alive include="a,b">
		<component></component>
	</keep-alive>
	// 正则表达式(需要使用v-bind，符合匹配规则的都会被缓存)
	<keep-alive :include="/a|b/">
		<component></component>
	</keep-alive>
	// Array(需要使用v-bind，被包含的都会被缓存)
	<keep-alive :include="['a','b']">
		<component></component>
	</keep-alive>
	```
9. vue常用的修饰符？
	* .prevent 提交事件不在重载页面。调用event.preventDefault()
	* .stop 阻止单击事件冒泡。调用event.stopPropagation()
	* .self 当事件发生在该元素本身而不是子元素的时候触发回调
	* .capture 事件侦听，事件发生时候调用。
	* .native 监听组件根元素的原生事件
	* .once 只触发一次回调
	* .left （2.2.0）只当点击鼠标左键时触发
	* .right （2.2.0）只当点击鼠标右键时触发
	* .middle （2.2.0）只当点击鼠标中键时触发
	* .passive （2.3.0）以{passive: true} 模式添加侦听器
10. vue中key值的作用？
	* 当vue.js用v-for正在更新已渲染过的元素列表是，它默认用'就地复用'策略。如果数据项的顺序被改变，vue将不会移动DOM元素来匹配数据项的顺序，而是简单复用此处的每个元素。并且确保它在特定索引下显示已被渲染过的每个元素。key的作用主要是为了高效的更新虚拟DOM。
11. 什么是vue的计算属性？
	* 在模板中放入太多的逻辑会让模板过重难以维护，在需要对数据进行复杂处理，且可能多次使用的情况下，尽量采取计算属性的方式。好处:
	1. 使得数据处理结构清晰
	2. 依赖于数据，数据更新，处理结果自动更新。
	3. 计算属性内部this指向vm实例。
	4. 在template调用时，直接写计算属性名即可
	5. 常用的是getter方法，获取数据，也可以使用set方法改变数据
	6. 相较于methods，不管依赖的数据变不变，methods都会重新计算，但是依赖数据不变的时候computed从缓存中获取，不会重新计算。
12. vue等单页面应用及其优缺点
	* 优点：vue的目标是通过尽可能简单的api实现响应的数据绑定和组合的视图组件，核心是一个响应的数据绑定系统。MVVM，数据驱动，组件化，轻量，简洁，高效，快速，模块友好。
	* 缺点：不支持低版本浏览器，最低只支持IE9，不利于SEO优化（如果要支持SEO，建议通过服务端来进行渲染组件）第一次加载首页耗时相对长一些，不可以使用浏览器的导航按钮需要自行实现前进后退。
13. vue的路由实现：hash模式和history模式
	* hash模式: 在浏览器中符号'#',#以及#以后的字符称之为hash，用window.location.hash读取。特点：hash虽然在url中，但不被包括在http请求中，用来指导浏览器动作，对服务端安全无用，，hash不会重加载页面。
	* history模式：history采用html5的新特性，且提供了两个新方法：pushState()， replaceState()可以对浏览器历史记录栈进行修改，以及popState事件的监听到状态变更。

##  57、理解web安全吗？都有哪几种，介绍以及如何预防
1. XSS，即跨站脚本注入
	攻击方法：
	* 手动攻击：编写注入脚本，比如`<script>alert(document.cookie())</script>`。手动测试目标网站上有的input，textarea等所有可能输入文本信息的区域
	* 自动攻击：利用工具扫描目标网站所有的网页并自动测试写好的注入脚本，比如：Burpsuite等
	* 防御方法：
		* 将cookie等敏感信息设置为httponly，禁止JavaScript通过document.cookie获得
		* 对所有的输入做严格的校验尤其是在服务器端，过滤掉任何非法输入，比如手机号必须是数字，通常可采用正则表达式
		* 净化和过滤掉不必要的html标签。比如：iframe，alt， script等
		* 净化和过滤掉不必要的JavaScript的事件标签，比如：onclick， onfocus等
		* 转义单引号，双引号，尖括号等特殊字符，可以采用htmlencode编码，或者过滤掉这些特殊字符
		* 设置浏览器的安全设置来防范典型的XSS注入
2. SQL注入
	攻击方法：
	* 编写恶意字符串，比如'or 1==1--'等
	* 手动测试目标网站上所有涉及数据库操作的地方
	* 防御方法：
		* 禁止目标网站利用动态拼接字符串的方式访问数据库
		* 减少不必要的数据库抛出的错误信息
		* 对数据库的操作赋予严格的权限控制
		* 净化和过滤掉不必要的SQL保留字，比如：where，or，exec等
		* 转义单引号，双引号，尖括号等特殊字符。可以采用htmlencode编码，过滤掉这些特殊字符
3. CSRF，也就是跨站请求伪造
	即攻击者冒用用户名义，向目标站点发送请求，
	* 防范方法
		* 在客户端进行cookie的hashing，并在服务端进行hash认证，
		* 提交请求是需要填写验证码
		* 使用one-time tokens为不同的表单创建不同的伪随机值

## 58、JS继承方式
JS不是传统的面向对象语言，那么是如何实现继承的呢？由于JS是基于原型链实现的面向对象，所以JS主要是通过原型链查找来实现继承，主要有两大类实现方式，分为基于构造函数的继承，以及非构造函数的继承。
```
// 现在有两个类既构造函数，一个是动物类
function Animal() {
	this.species = '动物';
}
// 一个是猫类
function Cat(name, color){
	this.name = name;
	this.color = color;
}
```
怎么才能使‘猫’继承‘动物’的特性呢？<br/>
#### 一、构造函数绑定
这种方法是最简单的方法，使用call或apply方法，将父对象的构造函数绑定在子对象上，即在子对象构造函数中加一行：
```
function Cat (name, color){
	Animal.apply(this, arguments);
	this.name = name;
	this.color = color;
}
var cat1 = new Cat('大毛', '黄色');
alert(cat1.species) // 动物
```
#### 二、prototype模式
该方法更常见，使用prototype属性。
如果'猫'的prototype对象，指向一个Animal的实例，那么所有'猫'的实例，就能继承Animal了。
```
Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
var cat1 = new Cat('大毛', '黄色');
alert(cat1.species); // 动物
```
第一行，我们将cat的prototype对象指向一个Animal的实例。它相当于完全删除了prototype对象原先的值，然后赋予一个新值。第二行，任何一个prototype对象都有一个constructor属性，指向它的构造函数，如果没有'Cat.prototype = new Animal()' 这一行，Cat.prototype.constructor是指向Cat的，加上这一行以后，指向Animal。更重要的是，每一个实例也有一个constructor属性，默认调用prototype对象的constructor属性。因此，在运行'Cat.prototype = new Animal()'这一行之后，cat1.constructor也指向Animal。这显然会导致继承链的紊乱(cat1明明是用构造函数Cat生成的)，因此我们必须手动纠正，将Cat.prototype对象的constructor值改为Cat。这是第二行的作用。如果替换了prototype对象，那么，下一步必然是为新的prototype对象加上constructor属性，并将这个属性指回原来的构造函数。
#### 三、直接继承prototype
第三种方法是对第二种方法的改进。由于Animal对象中，不变的属性都可以直接写入Animal.prototype。所以，我们也可以让Cat()跳过Animal()，直接继承Animal.prototype。现在我们将Animal对象改写。
```
function Animal(){
	Animal.prototype.species = '动物';
}
```
然后，将Cat的prototype对象，然后指向Animal的prototype对象，这样就完成了继承。
```
Cat.prototype = Animal.prototype;
Cat.prototype.constructor = Cat;
var cat1 = new Cat('大毛','黄色');
alert(cat1.species); // 动物
```
与前一种方法相比，这样做的优点是效率比较高（不用执行和建立Animal的实例了），比较省内存。缺点是 Cat.prototype和Animal.prototype现在指向了同一个对象，那么任何对Cat.prototype的修改，都会反映到Animal.prototype。
所以，上面这一段代码其实是有问题的。请看第二行
```
Cat.prototype.constructor = Cat;
// 这一句实际上把Animal.prototype对象的constructor属性也改掉了！
alert(Animal.prototype.constructor); // Cat
```
#### 四、利用空对象作为中介
由于"直接继承prototype"存在上述的缺点，所以就有第四种方法，利用一个空对象作为中介。
```
var F = function() {};　　
F.prototype = Animal.prototype;　　
Cat.prototype = new F();　　
Cat.prototype.constructor = Cat;
```
F是空对象，所以几乎不占内存。这时，修改Cat的prototype对象，就不会影响到Animal的prototype对象。
```
alert(Animal.prototype.constructor); // Animal
```
我们将上面的方法，封装成一个函数，便于使用。
```
function extend(Child, Parent) {
    var F = function() {};　　　　
    F.prototype = Parent.prototype;　　　　
    Child.prototype = new F();　　　　
    Child.prototype.constructor = Child;　　　　
    Child.uber = Parent.prototype;　　
}
```
使用的时候，方法如下
```
extend(Cat, Animal);　　
var cat1 = new Cat("大毛", "黄色");　　
alert(cat1.species); // 动物
```
这个extend函数，就是YUI库如何实现继承的方法。
另外，说明一点，函数体最后一行
```
Child.uber = Parent.prototype;
```
意思是为子对象设一个uber属性，这个属性直接指向父对象的prototype属性。（uber是一个德语词，意思是"向上"、"上一层"。）这等于在子对象上打开一条通道，可以直接调用父对象的方法。这一行放在这里，只是为了实现继承的完备性，纯属备用性质。
#### 五、拷贝继承
上面是采用prototype对象，实现继承。我们也可以换一种思路，纯粹采用"拷贝"方法实现继承。简单说，如果把父对象的所有属性和方法，拷贝进子对象，不也能够实现继承吗？这样我们就有了第五种方法。<br/>
首先，还是把Animal的所有不变属性，都放到它的prototype对象上。
```
function Animal() {}　　
Animal.prototype.species = "动物";
```
然后，再写一个函数，实现属性拷贝的目的。
```
function extend2(Child, Parent) {　　　　
    var p = Parent.prototype;　　　　
    var c = Child.prototype;　　　　
    for(var i in p) {　　　　　　
        c[i] = p[i];　　　　　　
    }　　　　
    c.uber = p;　　
}
```
这个函数的作用，就是将父对象的prototype对象中的属性，一一拷贝给Child对象的prototype对象。
使用的时候，这样写：
```
extend2(Cat, Animal);　　
var cat1 = new Cat("大毛", "黄色");　　
alert(cat1.species); // 动物
```

### 下面是非构造函数的继承模式
#### 六、Object()方法
json格式的发明人，提出了一个object()函数，可以做到这一点。
```
function object(o){
	function F(){}
	F.prototype = o;
	return new F();
}
```
#### 七、浅拷贝
除了使用‘prototype链’以外，还有另一种思路：把父对象的属性，全部拷贝给子对象，也能实现继承。
```
function extendCopy(p){
	var c = {};
	for(var i in p){
		c[i] = p[i];
	}
	c.uber = p;
	return c;
}
```
#### 八、深拷贝
所谓'深拷贝'，就是能够实现真正意义上的数组和对象的拷贝。它的实现并不难，只要递归调用'浅拷贝'就可以了。
```
function deepCopy(p, c){
	var c = c || {};
	for(var i in p){
		if(typeof p[i] === 'object'){
			c[i] = (p[i].constructor === Array) ? [] : {};
			deepCopy(p[i], c[i]);
		}else{
			c[i] = p[i]
		}
	}
	return c;
}
```

## 59、NodeJS常见问题
1. 什么是错误优先的回调函数？
	* 错误优先的回调函数用于传递错误和数据。第一个参数始终应该是一个错误对象，用于检查程序是否发生了错误。其余的参数用于传递数据。例如：
	```
		fs.readFile(filePath, 
			function(err, data){
				if (err){
					// handle the error
				}	 // use the data object
			}
		)
	```

2. 如何避免回调地狱
	* 模块化：将回调函数分割为独立的函数
	* 使用promises
	* 使用yield

3. Promise的resolve方法能传递几个参数给then方法的参数？
	* 1个

4. 为什么要用node?
	* 总结起来node有以下几个特点：简单强大，轻量可扩展。简单体现在node使用的是JavaScript，json来进行编码，学习成本低。强大体现在非阻塞IO，可以适应分块传递数据，较慢的网络环境，尤其擅长高并发访问，轻量体现在node本身即是代码，又是服务器，前后端使用统一语言，可扩展体现在可以轻松应对多实例，多服务器架构，同时有海量的第三方应用组件。

5. node有哪些核心模块?
	* EventEmitter 
	* stream 
	* fs 
	* net
	* 全局对象（process，console，Buffer，exports）

6. node的架构是什么样子？
	* 主要分为三层，应用app > V8及node内置架构 > 操作系统 .
	* V8是node运行的环境，可以理解为node虚拟机。
	* node内置架构又可分为三层： 核心模块（js实现） > c++绑定 > libuv + CAes + http

7. node中的Buffer如何应用？
	* buffer是用来处理二进制数据的，比如图片，mp3，数据库文件等。
	* buffer支持各种编码解码，二进制字符互转

8. EventEmitter
	* 1、什么是EventEmitter?
	* 参考答案: EventEmitter是node中一个实现观察者模式的类，主要功能是监听和发射消息，用于处理多模块交互问题.
	* 2、如何实现一个EventEmitter?
	* 参考答案: 主要分三步：定义一个子类，调用构造函数，继承EventEmitter
	```
	var util = require('util');
	var EventEmitter = require('events').EventEmitter;
	function MyEmitter() {
			EventEmitter.call(this);
	} // 构造函数
	util.inherits(MyEmitter, EventEmitter); // 继承
	var em = new MyEmitter();
	em.on('hello', function(data) {
			console.log('收到事件hello的数据:', data);
	}); // 接收事件，并打印到控制台
	em.emit('hello', 'EventEmitter传递消息真方便!');
	```

	* 3、EventEmitter有哪些典型应用?
	* 参考答案: 1) 模块间传递消息 2) 回调函数内外传递消息 3) 处理流数据，因为流是在EventEmitter基础上实现的. 4) 观察者模式发射触发机制相关应用
	*	4、怎么捕获EventEmitter的错误事件?
	* 参考答案: 监听error事件即可．如果有多个EventEmitter,也可以用domain来统一处理错误事件.
		```
		//代码演示
			var domain = require('domain');
			var myDomain = domain.create();
			myDomain.on('error', function(err){
					console.log('domain接收到的错误事件:', err);
			}); // 接收事件并打印
			myDomain.run(function(){
					var emitter1 = new MyEmitter();
					emitter1.emit('error', '错误事件来自emitter1');
					emitter2 = new MyEmitter();
					emitter2.emit('error', '错误事件来自emitter2');
			});
		```

	* 5、EventEmitter中的newListenser事件有什么用处?
	* 参考答案: newListener可以用来做事件机制的反射，特殊应用，事件管理等．当任何on事件添加到EventEmitter时，就会触发newListener事件，基于这种模式，我们可以做很多自定义处理.

		```
		//代码演示
		var emitter3 = new MyEmitter();
		emitter3.on('newListener', function(name, listener) {
				console.log("新事件的名字:", name);
				console.log("新事件的代码:", listener);
				setTimeout(function(){ console.log("我是自定义延时处理机制"); }, 1000);
		});
		emitter3.on('hello', function(){
				console.log('hello　node');
		});
		```

9. Stream
	*	1、什么是Stream?
	* 参考答案: stream是基于事件EventEmitter的数据管理模式．由各种不同的抽象接口组成，主要包括可写，可读，可读写，可转换等几种类型．
	* 2、Stream有什么好处?
	*	参考答案: 非阻塞式数据处理提升效率，片断处理节省内存，管道处理方便可扩展等.
	*	3、Stream有哪些典型应用?
	* 参考答案: 文件，网络，数据转换，音频视频等.
	*	4、怎么捕获Stream的错误事件?
	*	参考答案: 监听error事件，方法同EventEmitter.
	* 5、有哪些常用Stream,分别什么时候使用?
	* 参考答案: Readable为可被读流，在作为输入数据源时使用；Writable为可被写流,在作为输出源时使用；Duplex为可读写流,它作为输出源接受被写入，同时又作为输入源被后面的流读出．Transform机制和Duplex一样，都是双向流，区别时Transfrom只需要实现一个函数_transfrom(chunk, encoding, callback);而Duplex需要分别实现_read(size)函数和_write(chunk, encoding, callback)函数.
	*	6、实现一个Writable Stream?
	* 参考答案: 三步走:1)构造函数call Writable 2)　继承Writable 3) 实现_write(chunk, encoding, callback)函数
		
		```
		//代码演示
		var Writable = require('stream').Writable;
		var util = require('util');
		function MyWritable(options) {
				Writable.call(this, options);
		} // 构造函数
		util.inherits(MyWritable, Writable); // 继承自Writable
		MyWritable.prototype._write = function(chunk, encoding, callback) {
				console.log("被写入的数据是:", chunk.toString()); // 此处可对写入的数据进行处理
				callback();
		};
		process.stdin.pipe(new MyWritable()); // stdin作为输入源，MyWritable作为输出源 
		```
		
10. 文件系统
	* 1、内置的fs模块架构是什么样子的?
	* 参考答案: fs模块主要由下面几部分组成: 1) POSIX文件Wrapper,对应于操作系统的原生文件操作 2) 文件流 fs.createReadStream和fs.createWriteStream 3) 同步文件读写,fs.readFileSync和fs.writeFileSync 4) 异步文件读写, fs.readFile和fs.writeFile
	* 2、读写一个文件有多少种方法?
	* 参考答案: 总体来说有四种: 1) POSIX式低层读写 2) 流式读写 3) 同步文件读写 4) 异步文件读写
	* 3、怎么读取json配置文件?
	* 参考答案: 主要有两种方式，第一种是利用node内置的require('data.json')机制，直接得到js对象; 第二种是读入文件入内容，然后用JSON.parse(content)转换成js对象．二者的区别是require机制情况下，如果多个模块都加载了同一个json文件，那么其中一个改变了js对象，其它跟着改变，这是由node模块的缓存机制造成的，只有一个js模块对象; 第二种方式则可以随意改变加载后的js变量，而且各模块互不影响，因为他们都是独立的，是多个js对象.
	* 4、fs.watch和fs.watchFile有什么区别，怎么应用?
	* 参考答案: 二者主要用来监听文件变动．fs.watch利用操作系统原生机制来监听，可能不适用网络文件系统; fs.watchFile则是定期检查文件状态变更，适用于网络文件系统，但是相比fs.watch有些慢，因为不是实时机制．
11. 网络
	*	1、node的网络模块架构是什么样子的?
	* 参考答案: node全面支持各种网络服务器和客户端，包括tcp, http/https, tcp, udp, dns, tls/ssl等.
	* 2、node是怎样支持https,tls的?
	* 参考答案: 主要实现以下几个步骤即可: 1) openssl生成公钥私钥 2) 服务器或客户端使用https替代http 3) 服务器或客户端加载公钥私钥证书
	* 3、实现一个简单的http服务器?
	* 参考答案: 经典又很没毛意义的一个题目．思路是加载http模块，创建服务器，监听端口.
		
		```
		var http = require('http'); // 加载http模块
    http.createServer(function(req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'}); // 200代表状态成功, 文档类型是给浏览器识别用的
        res.write(); // 返回给客户端的html数据
        res.end(); // 结束输出流
    }).listen(3000); // 绑定3ooo, 查看效果请访问 http://localhost:3000
		```
		
12. node高级话题(异步，部署，性能调优，异常调试等)
	*	1、node中的异步和同步怎么理解
	*	参考答案: node是单线程的，异步是通过一次次的循环事件队列来实现的．同步则是说阻塞式的IO,这在高并发环境会是一个很大的性能问题，所以同步一般只在基础框架的启动时使用，用来加载配置文件，初始化程序什么的．
	*	2、有哪些方法可以进行异步流程的控制?
	*	参考答案: 1) 多层嵌套回调 2)　为每一个回调写单独的函数，函数里边再回调 3) 用第三方框架比方async, q, promise等
	* 3、怎样绑定node程序到80端口?
	* 参考答案: 多种方式 1) sudo 2) apache/nginx代理 3) 用操作系统的firewall iptables进行端口重定向
	*	4、有哪些方法可以让node程序遇到错误后自动重启?
	*	参考答案: 1) runit 2) forever 3) nohup npm start &
	*	5、怎样充分利用多个CPU?
	* 参考答案: 一个CPU运行一个node实例
	* 6、怎样调节node执行单元的内存大小?
	* 参考答案: 用--max-old-space-size 和 --max-new-space-size 来设置 v8 使用内存的上限
	* 7、程序总是崩溃，怎样找出问题在哪里?
	*	参考答案: 1) node --prof 查看哪些函数调用次数多 2) memwatch和heapdump获得内存快照进行对比，查找内存溢出
	* 8、有哪些常用方法可以防止程序崩溃?
	*	参考答案: 1) try-catch-finally 2) EventEmitter/Stream error事件处理 3) domain统一控制 4) jshint静态检查 5) jasmine/mocha进行单元测试
	* 9、怎样调试node程序?
	* 参考答案: node --debug app.js 和node-inspector
13. child-process
	*	1、为什么需要child-process?
	*	参考答案: node是异步非阻塞的，这对高并发非常有效．可是我们还有其它一些常用需求，比如和操作系统shell命令交互，调用可执行文件，创建子进程进行阻塞式访问或高CPU计算等，child-process就是为满足这些需求而生的．child-process顾名思义，就是把node阻塞的工作交给子进程去做．
	*	2、exec,execFile,spawn和fork都是做什么用的?
	*	参考答案: exec可以用操作系统原生的方式执行各种命令，如管道 cat ab.txt | grep hello; execFile是执行一个文件; spawn是流式和操作系统进行交互; fork是两个node程序(javascript)之间时行交互.
	*	3、实现一个简单的命令行交互程序?
	* 参考答案: 那就用spawn吧.
		
		```
		//代码演示
		var cp = require('child_process');
		var child = cp.spawn('echo', ['你好', "钩子"]); // 执行命令
		child.stdout.pipe(process.stdout); // child.stdout是输入流，process.stdout是输出流
		// 这句的意思是将子进程的输出作为当前程序的输入流，然后重定向到当前程序的标准输出，即控制台
		```

	* 4、两个node程序之间怎样交互?
	*	参考答案: 用fork嘛，上面讲过了．原理是子程序用process.on, process.send，父程序里用child.on,child.send进行交互.
		
		```
		// 代码演示
		// 1) fork-parent.js
		var cp = require('child_process');
		var child = cp.fork('./fork-child.js');
		child.on('message', function(msg){
				console.log('老爸从儿子接受到数据:', msg);
		});
		child.send('我是你爸爸，送关怀来了!');
		// 2) fork-child.js
		process.on('message', function(msg){
				console.log("儿子从老爸接收到的数据:", msg);
				process.send("我不要关怀，我要银民币！");
		});
		```	

 	* 5、怎样让一个js文件变得像linux命令一样可执行?
	* 参考答案: 1) 在myCommand.js文件头部加入 #!/usr/bin/env node 2) chmod命令把js文件改为可执行即可 3) 进入文件目录，命令行输入myComand就是相当于node myComand.js了
	* 6、child-process和process的stdin,stdout,stderror是一样的吗?
	* 参考答案: 概念都是一样的，输入，输出，错误，都是流．区别是在父程序眼里，子程序的stdout是输入流，stdin是输出流．
14. 常用知名第三方类库(Async, Express等)
	*	1、async都有哪些常用方法，分别是怎么用?
	* 参考答案: async是一个js类库，它的目的是解决js中异常流程难以控制的问题．async不仅适用在node.js里，浏览器中也可以使用． 1) async.parallel并行执行完多个函数后，调用结束函数
		
		```
		async.parallel([
				function(){ ... },
				function(){ ... }
		], callback);
		```	

	*	2、async.series串行执行完多个函数后，调用结束函数
		
		```
		async.series([
			function(){ ... },
			function(){ ... }
		]);
		```

	* 3、async.waterfall依次执行多个函数，后一个函数以前面函数的结果作为输入参数
		
		```
		async.waterfall([
				function(callback) {
						callback(null, 'one', 'two');
				},
				function(arg1, arg2, callback) {
					// arg1 now equals 'one' and arg2 now equals 'two' 
						callback(null, 'three');
				},
				function(arg1, callback) {
						// arg1 now equals 'three' 
						callback(null, 'done');
				}
		], function (err, result) {
				// result now equals 'done' 
		});
		```

	*	4、async.map异步执行多个数组，返回结果数组
		
		```
		async.map(['file1','file2','file3'], fs.stat, function(err, results){
				// results is now an array of stats for each file 
		});
		```

	*	5、async.filter异步过滤多个数组，返回结果数组
		
		```
		async.filter(['file1','file2','file3'], fs.exists, function(results){
				// results now equals an array of the existing files 
		});
		```

	*	6、express项目的目录大致是什么样子的
	* 参考答案: app.js, package.json, bin/www, public, routes, views.
	*	7、express常用函数
	* 参考答案: express.Router路由组件,app.get路由定向，app.configure配置，app.set设定参数,app.use使用中间件
	* 8、express中如何获取路由的参数
	* 参考答案: /users/:name使用req.params.name来获取; req.body.username则是获得表单传入参数username; express路由支持常用通配符 ?, +, *, and ()
	*	9、express response有哪些常用方法
	* 参考答案: 
		* res.download() 弹出文件下载
		* res.end() 结束response
		* res.json() 返回json
		* res.jsonp() 返回jsonp
		* res.redirect() 重定向请求
		* res.render() 渲染模板
		* res.send() 返回多种形式数据
		* res.sendFile 返回文件
		* res.sendStatus() 返回状态
## 60、React集锦
1. redux中间件
	* 中间件提供第三方插件的模式，自定义拦截 action -> reducer 的过程。变为 action -> middlewares -> reducer 。这种机制可以让我们改变数据流，实现如异步 action ，action 过滤，日志输出，异常报告等功能。
	*	常见的中间件：
		* redux-logger：提供日志输出
		* redux-thunk：处理异步操作
		* redux-promise：处理异步操作，actionCreator的返回值是promise
2. 说说redux是什么，redux有什么缺点？
	* redux 是一个应用数据流框架，主要是解决了组件间状态共享的问题，原理是集中式管理，主要有三个核心方法，action，store，reducer，工作流程是 view 调用 store 的 dispatch 接收 action 传入 store，reducer 进行 state 操作，view 通过 store 提供的 getState 获取最新的数据，flux 也是用来进行数据操作的，有四个组成部分 action，dispatch，view，store，工作流程是 view 发出一个 action，派发器接收 action，让 store 进行数据更新，更新完成以后 store 发出 change，view 接受 change 更新视图。Redux 和 Flux 很像。主要区别在于 Flux 有多个可以改变应用状态的 store，在 Flux 中 dispatcher 被用来传递数据到注册的回调事件，但是在 redux 中只能定义一个可更新状态的 store，redux 把 store 和 Dispatcher 合并,结构更加简单清晰
	*	新增 state,对状态的管理更加明确，通过 redux，流程更加规范了，减少手动编码量，提高了编码效率，同时缺点时当数据更新时有时候组件不需要，但是也要重新绘制，有些影响效率。一般情况下，我们在构建多交互，多数据流的复杂项目应用时才会使用它们<br/>
	缺点：
	* 一个组件所需要的数据，必须由父组件传过来，而不能像flux中直接从store取。
	* 当一个组件相关数据更新时，即使父组件不需要用到这个组件，父组件还是会重新render，可能会有效率影响，或者需要写复杂的shouldComponentUpdate进行判断。
3. react生命周期函数
	* 一、初始化阶段：
		* getDefaultProps:获取实例的默认属性
		* getInitialState:获取每个实例的初始化状态
 		*	componentWillMount：组件即将被装载、渲染到页面上
		* render:组件在这里生成虚拟的DOM节点
		*	componentDidMount:组件真正在被装载之后
	*	二、运行中状态：
		*	componentWillReceiveProps:组件将要接收到属性的时候调用
		*	shouldComponentUpdate:组件接受到新属性或者新状态的时候（可以返回false，接收数据后不更新，阻止render调用，后面的函数不会被继续执行了）
		*	componentWillUpdate:组件即将更新不能修改属性和状态
		*	render:组件重新描绘
		*	componentDidUpdate:组件已经更新
	*	三、销毁阶段：
		*	componentWillUnmount:组件即将销毁
4. react性能优化是哪个周期函数？
	*	shouldComponentUpdate 这个方法用来判断是否需要调用render方法重新描绘dom。<br/>因为dom的描绘非常消耗性能，如果我们能在shouldComponentUpdate方法中能够写出更优化的dom diff算法，可以极大的提高性能。
5. diff算法?
	*	把树形结构按照层级分解，只比较同级元素。
	* 给列表结构的每个单元添加唯一的key属性，方便比较。
	* React 只会匹配相同 class 的 component（这里面的class指的是组件的名字）
	* 合并操作，调用 component 的 setState 方法的时候, React 将其标记为 dirty.到每一个事件循环结束, React 检查所有标记 dirty 的 component 重新绘制.
	*	选择性子树渲染。开发人员可以重写shouldComponentUpdate提高diff的性能。
6. react性能优化方案
	* 重写shouldComponentUpdate来避免不必要的dom操作。
	*	使用 production 版本的react.js。
	* 使用key来帮助React识别列表中所有子组件的最小变化。
7. 简述flux思想
	* Flux 的最大特点，就是数据的"单向流动"。
		* 1.用户访问 View
		* 2.View 发出用户的 Action
		* 3.Dispatcher 收到 Action，要求 Store 进行相应的更新
		* 4.Store 更新后，发出一个"change"事件
		* 5.View 收到"change"事件后，更新页面
8. 调用 setState 之后发生了什么？
	*	在代码中调用 setState 函数之后，React 会将传入的参数对象与组件当前的状态合并，然后触发所谓的调和过程（Reconciliation）。经过调和过程，React 会以相对高效的方式根据新的状态构建 React 元素树并且着手重新渲染整个 UI 界面。在 React 得到元素树之后，React 会自动计算出新的树与老树的节点差异，然后根据差异对界面进行最小化重渲染。在差异计算算法中，React 能够相对精确地知道哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。
9. 为什么建议传递给 setState 的参数是一个 callback 而不是一个对象
	*	因为 this.props 和 this.state 的更新可能是异步的，不能依赖它们的值去计算下一个 state。
10. (在构造函数中)调用 super(props) 的目的是什么?
	*	在 super() 被调用之前，子类是不能使用 this 的，在 ES2015 中，子类必须在 constructor 中调用 super()。传递 props 给 super() 的原因则是便于(在子类中)能在 constructor 访问 this.props。
11. 应该在 React 组件的何处发起 Ajax 请求
	* 在 React 组件中，应该在 componentDidMount 中发起网络请求。这个方法会在组件第一次“挂载”(被添加到 DOM)时执行，在组件的生命周期中仅会执行一次。更重要的是，你不能保证在组件挂载之前 Ajax 请求已经完成，如果是这样，也就意味着你将尝试在一个未挂载的组件上调用 setState，这将不起作用。在 componentDidMount 中发起网络请求将保证这有一个组件可以更新了。
12. React 中 refs 的作用是什么？<br/>
	Refs 是 React 提供给我们的安全访问 DOM 元素或者某个组件实例的句柄。我们可以为元素添加 ref 属性然后在回调函数中接受该元素在 DOM 树中的句柄，该值会作为回调函数的第一个参数返回：
	
	```
	class CustomForm extends Component {
		handleSubmit = () => {
			console.log("Input Value: ", this.input.value)
		}
		render () {
			return (
				<form onSubmit={this.handleSubmit}>
					<input
						type='text'
						ref={(input) => this.input = input} />
					<button type='submit'>Submit</button>
				</form>
			)
		}
	}
	```

	上述代码中的 input 域包含了一个 ref 属性，该属性声明的回调函数会接收 input 对应的 DOM 元素，我们将其绑定到 this 指针以便在其他的类函数中使用。另外值得一提的是，refs 并不是类组件的专属，函数式组件同样能够利用闭包暂存其值：
	
	```
	function CustomForm ({handleSubmit}) {
		let inputElement
		return (
			<form onSubmit={() => handleSubmit(inputElement.value)}>
				<input
					type='text'
					ref={(input) => inputElement = input} />
				<button type='submit'>Submit</button>
			</form>
		)
	}
	```

13. 使用箭头函数(arrow functions)的优点是什么
	1. 作用域安全：在箭头函数之前，每一个新创建的函数都有定义自身的 this 值(在构造函数中是新对象；在严格模式下，函数调用中的 this 是未定义的；如果函数被称为“对象方法”，则为基础对象等)，但箭头函数不会，它会使用封闭执行上下文的 this 值。
	2. 简单：箭头函数易于阅读和书写
	3. 清晰：当一切都是一个箭头函数，任何常规函数都可以立即用于定义作用域。开发者总是可以查找 next-higher 函数语句，以查看 this 的值






















	
