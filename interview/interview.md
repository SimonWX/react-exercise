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

-----
## **美团酒旅 一面**
## 10、TCP/IP 网络模型各层功能（美团酒旅）
1. )网络接口层：是物理接口的规划。比特流的传输。数据封装成帧
2. )互联网层：ip寻址或逻辑寻址
3. )传输层：提供端到端的可靠传输
4. )应用层：提供用户的接口

## 11、Redux流程（美团酒旅）
1. )用户发出Action <br/>
`store.dispatch(action)`
2. )Store自动调用Reducer，并且传入两个参数：当前state和收到Action。然后Reducer会返回新的State <br/>
`let nextState = todoApp(previousState, action)`
3. )State一旦有了变化，Store就会调用监听函数 <br/>
// 设置监听函数<br/>
`store.subscribe(listener)`
4. )listener可以通过store.getState()得到当前状态。如果使用的是React，这时可以触发重新渲染View
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

-----
## *美团酒旅---二面*
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
1. 创建一个新的临时数组来保存数组中已有的元素
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
2. 使用哈希表存储已有的元素(该方法最快)
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
3. 使用indexOf判断数组元素第一次出现的位置是否为当前位置
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
4. 先排序再去重
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
* 注：其实还有一种就是for循环
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