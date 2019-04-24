# *Interview Collection For FE/JavaScript*

## 1、事件代理（时间委托）
事件代理（Event Delegation），又称之实践委托。是JavaScript中常用绑定事件的常用技巧。顾名思义，"事件代理"即是把原本需要绑定在子元素的响应时间（click，keydown...）委托给父元素，让父元素担当时间监听的职务。事件代理的原理是DOM元素的事件冒泡。
举个通俗的例子，比如一个宿舍的同学快递同时到了，一种方法就是他们一个个去领取，还有一种方法就是把这件事情委托给宿舍长，让一个人出去拿所有快递。然后在根据收件人一一分发给每个宿舍同学。
在这里，取快递就是一个事件，每个同学指的是需要响应时间的DOM元素，而出去统一领取快递的宿舍长就是代理的元素，所以真正绑定事件的是这个元素，按照收件人分发快递的过程就是在事件执行中，需要判断当前响应的事件应该匹配到被代理元素中的哪一个或者哪几个。

### 事件冒泡
前面提到事件委托的原理是DOM元素的事件冒泡，那么事件冒泡是什么呢？一个事件触发后，会在子元素和父元素之间传播（propagation）。这种传播分为三个阶段
![Image text](https://img-blog.csdnimg.cn/2019011111581623.jpg)

如上图所示，事件传播分为三个阶段：
* 捕获阶段: 从window对象传导到目标节点（上层传到底层）称为"捕获阶段"（capture phase），捕获阶段不会响应任何事件
* 目标阶段: 在目标节点上触发，称为'目标阶段'
* 冒泡阶段: 从目标节点传导回window对象（从底层传回上层），称为“冒泡阶段”（bubbling phase）。事件代理即是利用事件冒泡的机制把里层所需要响应的事件绑定到外层。

### 事件委托的优点
1. 可以大量节省内存占用，减少事件注册，比如在ul上代理所有li的click事件就非常棒
如上面代码所示，如果给每个li列表项都绑定一个函数，那对内存的消耗是非常大的，因此较好的解决办法就是讲li元素的点击事件绑定到它的父元素ul上，执行事件的时候再去匹配判断目标元素。
2. 可以实现当新增子对象时无需再次对其绑定（动态绑定事件）。假设上述例子中列表项li就几个，我们给每个列表项都绑定了事件。在很多时候，我们需要通过AJAX或者用户操作动态的增加或删除列表项li元素，那么在每一次改变的时候都需要重新给新增的元素绑定事件，给即将删除的元素解绑事件。如果用了时间委托就没有这种麻烦了，因为事件绑定在父层，和目标元素的增减是没有关系，执行到目标元素是在真正响应执行事件函数的过程中去匹配的，所以使用事件在动态事件的情况下是可以减少很多重复工作。

### 基本实现
1. JavaScript原生实现事件委托
假若我们有这样一个html片段：按照传统的做法，需要像下面这样为它们添加3个事件处理程序

```
<ul id='myLinks'>
  <li id='goSomewhere'>goSomewhere</li>
  <li id='doSomething'>doSomething</li>
  <li id='sayHi'>say hi</li>
</ul>

var item1 = document.getElementById('goSomewhere');
var item2 = document.getElementById('doSomething');
var item3 = document.getElementById('sayHi');
item1.onclick = function(){
  location.href = 'http://www.baidu.com';
};
item2.onclick = function(){
  document.title = '时间委托';
};
item3.onclickk = function(){
  alert('hi');
}
```

如果在一个复杂的web应用程序中，对所有可单击的元素都采用这种方式，那么结果就会有数不清的代码用于添加事件处理程序。此时，可以利用事件委托技术解决这个问题。使用事件委托，只需在DOM树中尽量最高的层次上添加一个事件处理程序，如下面的例子所示。

```
var item1 = document.getElementById('goSomeWhere')
var item2 = document.getElementById('doSomething');
var item3 = document.getElementById('sayHi');
document.addEventListener('click', function(event){
  var target = event.target;
  switch (target.id){
    case 'doSomething':
      document.title = '事件委托';
      break;
    case 'goSomeWhere':
      location.href = 'http: //www.baidu.com';
      break;
    case 'sayHi':
      alert('hi');
      break;
  }
})
```

2. jQuery事件delegate()实现事件委托
delegate()方法为指定的元素（属于被选元素的子元素）添加一个或多个事件处理程序，并规定当这些事件发生时运行的函数。
格式: `$(selector).delegate(childSelector,event,data,function)`

参数|描述
----|----
childSelector|必需，规定要附加事件处理程序的一个或多个子元素
event|必需，规定附加到元素的一个或多个事件。由空格分隔多个事件值。必须是有效事件。
data|可选，规定传递到函数的额外数据。
function|必需，规定当事件发生时运行的函数。

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="http://lib.sinaapp.com/js/jquery/2.0.2/jquery-2.0.2.min.js"></script>
</head>
<body>
  <ul id="myLinks">
    <li id="goSomeWhere">Go someWhere</li>
    <li id="doSomething">Do something</li>
    <li id="sayHi">Say hi</li>
  </ul>
  <script type="text/javascript">
    $(document).ready(function(){
      $("#myLinks").delegate("#goSomeWhere", click, function(){
        location.href = "http://www.baidu.com";
      })
    })
  </script>
</body>
</html>
```

### 使用事件委托注意事项
使用“事件委托”时，并不是说把事件委托给的元素越靠近顶层就越好。事件冒泡的过程也需要耗时，越靠近顶层，事件的“事件传播链”越长，也就越耗时。如果DOM嵌套结构很深，事件冒泡通过大量祖先元素会导致性能损失。

## 2、面试题汇集
1. 题目一
    
    ```
    var a = 1;
    function foo(a){
      a = 2
      console.log('inner:', a) // 2
    }
    foo(a)
    console.log('out:', b) // 1
    ```

2. 题目二
    
    ```
    var a = 1;
    function func(a, b){
      console.log(arguments) // Arguments [1, callee: f, Symbol(Symbol.iterator): f]
      a = 2;
      arguments[0] = 3;
      arguments[1] = 4;
      var a;
      console.log(a, this.a, b) // 3  1  undefined
    }
    func(a)
    ```

3. 题目三

    ```
    // function  中 return this 是代表什么？
    // 如果return的是Object。这种情况下，不再返回this对象，而是返回return语句的返回值。

    String.prototype.self = function(){ return this }
    var a = 'str';
    var b = a.self();
    console.log(a); // 'str'
    
    console.log(b); String {'str'}
    
    // valueOf() 方法返回一个String对象的原始值(primitive value)，该值等同于String.prototype.toString()
    
    console.log(a === b, a.vulueOf() === b.valueOf(), typeof a, typeof b) 
    // false true 'string' 'object'

    console.log('str' === new String('str')) // false

    console.log('str' === ['s', 't', 'r'].join('').toString()) //true

    console.log(String('str') === 'str') // true

    console.log(String('str') === new String('str')) // false

    ```

4. 题目四
    
    ```
    function a(){
      console.log(1)
    }
    var foo = function(){
      return new Promise(function(resolve, reject){
        resolve(2)
        console.log(3)
      })
    }
    a()
    foo().then(function(data){
      console.log(data);
      console.log(4)
    })
    setTimeout(function(){
      console.log(5)
    }, 0)
    // 结果 :
    // 1
    // 3
    // 2
    // 4
    // 5
    ```

5. 题目五
    
    ```
    console.log(!'') // true
    console.log(!{}) // false
    console.log(![]) // false
    console.log(!0) // true
    console.log(!1) // false
    console.log(!null) // true
    console.log(!undefined) // true
    ```

6. 题目六

    ```
    const promise = new Promise((resolve, reject)=>{
      console.log(1)
      resolve()
      console.log(2)
    })
    promise.then(()=>{
      console.log(3)
    })
    console.log(4)
    // 结果：
    // 1
    // 2
    // 4
    // 3
    解释：Promise构造函数是同步执行的，promise.then中的函数是异步执行的。
    ```

7. 题目七
    
    ```
    const promise1 = new Promise((resolve, reject)=>{
      setTimeout(()=>{
        resolve('success')
      }, 1000)
    })
    const promise2 = promise1.then(()=>{
      throw new Error('error !!')
    })
    console.log('promise1',promise1)
    console.log('promise2',promise2)
    setTimeout(()=>{
      console.log('promise1',promise1)
      console.log('promise2',promise2)
    }, 2000)
    // 结果：
    // promise1 Promise {<pending>}
		// promise2 Promise {<pending>}
		// Uncaught (in promise) Error: error !!
		// promise1 Promise {<resolved>: "success"}
		// promise2 Promise {<rejected>: Error: error !!

    解释：promise有三种状态：pending、fulfilled、或rejected。
    状态改变只能是 pending->fulfilled 或者 pending->rejected，状态一旦改变则不能再变。
    上面 promise2 并不是 promise1，而是返回的一个新的 Promise 实例。
    ```
  
8. 题目八

    ```
    const promise = new Promise((resolve, reject)=>{
      resolve('success1')
      reject('error')
      resolve('success2')
    })
    promise.then((res)=>{
      console.log('then', res)
    })
    .catch((err)=>{
      console.log('catch:', err)
    })
    // 结果：
    // then: success1
    解释：构造函数中resolve或reject只有第一次执行有效，
    多次调用没有任何作用，即promise状态一旦改变则不能再变
    ```

9. 题目九

    ```
    Promise.resolve(1)
      .then((res) => {
        console.log(res)
        return 2
      })
      .catch((err) => {
        return 3
      })
      .then((res) => {
        console.log(res)
      })
    // 结果：
    // 1
    // 2
    解释：promise可以链式调用。提起链式调用我们通常会想到return this实现，不过Promise并不是这样实现的。
    promise每次调用.then或者.catch都会返回一个新的promise，从而实现了链式调用
    ```

10. 题目十

    ```
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('once')
        resolve('success')
      }, 1000)
    })
      
    const start = Date.now()
    console.log(start)
    promise.then((res) => {
      console.log(res, Date.now(), Date.now() - start)
    })
    promise.then((res) => {
      console.log(res, Date.now(), Date.now() - start)
    })
    // 结果:
    // 1555950300600
    // once
    // success 1555950301600 1000
    // success 1555950301601 1001
    解析：promise 的 .then 或者 .catch 可以被调用多次，但这里 Promise 构造函数只执行一次。
    或者说 promise 内部状态一经改变，并且有了一个值，那么后续每次调用 .then 或者 .catch 都会直接拿到该值。
    ```

11. 题目十一
    
    ```
    Promise.resolve()
      .then(() => {
        return new Error('error!!!')
      })
      .then((res) => {
        console.log('then: ', res)
      })
      .catch((err) => {
        console.log('catch: ', err)
    // 结果：
    // then: Error: error!!!
      at Promise.resolve.then (...)
      at ...
    解释：.then 或者 .catch 中 return 一个 error 对象并不会抛出错误，所以不会被后续的 .catch 捕获，需要改成其中一种：
    return Promise.reject(new Error('error!!!')) 或者
    throw new Error('error!!!')
    因为返回任意一个非 promise 的值都会被包裹成 promise 对象，
    即 return new Error('error!!!') 等价于 return Promise.resolve(new Error('error!!!'))
    ```

12. 题目十二

    ```
    const promise = Promise.resolve()
      .then(() => {
        return promise
      })
    promise.catch(console.error)
    // 结果：
    TypeError: Chaining cycle detected for promise #<Promise>
    at <anonymous>
    at process._tickCallback (internal/process/next_tick.js:188:7)
    at Function.Module.runMain (module.js:667:11)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:607:3
    解释：.then 或 .catch 返回的值不能是 promise 本身，否则会造成死循环。类似于：
    ```

13. 题目十三

    ```
    Promise.resolve(1)
      .then(2)
      .then(Promise.resolve(3))
      .then(console.log)
    // 结果：
    // 1
    解释：.then 或者 .catch 的参数期望是函数，传入非函数则会发生值穿透。
    ```

14. 题目十四

    ```
    Promise.resolve()
      .then(function success (res) {
        throw new Error('error')
      }, function fail1 (e) {
        console.error('fail1: ', e)
      })
      .catch(function fail2 (e) {
        console.error('fail2: ', e)
      })
    // 结果：
    // fail2: Error: error
    // at success (...)
    // at ...
    ```

    解释：.then 可以接收两个参数，第一个是处理成功的函数，第二个是处理错误的函数。
    .catch 是 .then 第二个参数的简便写法，但是它们用法上有一点需要注意：
    .then 的第二个处理错误的函数捕获不了第一个处理成功的函数抛出的错误，而后续的 .catch 可以捕获之前的错误。当然以下代码也可以：
    
    ```
    Promise.resolve()
      .then(function success1 (res) {
        throw new Error('error')
      }, function fail1 (e) {
        console.error('fail1: ', e)
      })
      .then(function success2 (res) {
      }, function fail2 (e) {
        console.error('fail2: ', e)
      })
    ```

15. 题目十五

    ```
    process.nextTick(() => {
      console.log('nextTick')
    })
    Promise.resolve()
      .then(() => {
        console.log('then')
      })
    setImmediate(() => {
      console.log('setImmediate')
    })
    console.log('end')
    // 结果：
    // end
    // nextTick
    // then
    // setImmediate
    ```

    解释：process.nextTick 和 promise.then 都属于 microtask，而 setImmediate 属于 macrotask，在事件循环的 check 阶段执行。
    事件循环的每个阶段（macrotask）之间都会执行 microtask，事件循环的开始会先执行一次 microtask。


## 3、面试题
https://www.jianshu.com/p/d50015adad69
1.  (a). 给出下面代码的输出结果
    ```
    function createFunctions(){
      var result = [];
      for(var i = 0; i < 10; i++){
        result[i] = function(){
          return i;
        }
      }
      return result;
    }
    var result = createFunctions();
    console.log(result[5]());
    // 结果 ： 10
    ```
    
    (b).上述输出结果是否达到预期结果，如果不是，有什么改进?
    
    ```
    // 改进（1）：
    function createFunctions(){
      var result = [];
      for(var i = 0; i < 10; i++){
        result[i] = (function(num){
          return num;
        })(i)
      }
      return result;
    }
    var result = createFunctions();
    console.log(result[5]) //输出结果：5
    /**
    解析：改进前的，i永远都是那个i(相当于一个指针)，存在result数组里面的值其实就是指针i，
    指向的那个具体的值也是同一个，随着循环不断在变化，循环完成，值固定了（等10），
    数组里装的值也就定下来了(全部是10)
    改进后：借用立即执行函数，(function(){})(i)，立即执行函数是把i作为参数传到函数里面。
    好处是：参数按值传递，这样函数获得的i就不是一个指针了，而是i的一个副本。
    那么，数组里面的各个值(函数执行后返回的值)就毫无瓜葛。
    */

    // 改进(2):
		function createFunctions(){
			var result = [];
			for(var i = 0; i < 10; i++){
				result[i] = (function(num){
					return function(){return num};
				})(i)
			}
			return result;
		}
		var result = createFunctions();
		console.log(result[5]()) //输出结果：5
    /**
    解析：改进(1)中，立即执行函数是return num，可直接得到数组中num值，
    后面的return function(){return num}, 返回的是一个函数，数组中的存的也是函数，
    获取值时候要调用数组中的函数以得到函数的值
    */
    ```

2. 请给出下面代码输出结果
    
    ```
    var b = 1;
    function outer(){
      var b = 2;
      function inner(){
        b++;
        console.log(b);
        var b = 3;
        console.log(b);
      }
      inner();
    }
    outer();
    // 结果：
    // NaN
    // 3
    ```

    上述inner()函数相当于

    ```
    function inner () {
    //变量提升
      var b; // b is undefined
      b++; // b is NaN
      console.log(b);
      b = 3; // b is 3
      console.log(b); // output "3"
    }
    ```

3. 请给出下面代码输出结果
  
    ```
    var name = 'name1';
    var object = {
      name: 'object name',
      getName: function(){
        return function(){
          return this.name;
        }
      }
    }
    console.log(object.getName()());
    // 结果：name1
    上述输出结果是否达到预期结果，如果不是，有什么改进方法
    ```

4. 请给出下面代码输出结果
    
    ```
    (function (){
      try {
        throw new Error();
      } catch (x){
        var x = 1, y = 2;
        console.log(x);
      }
      console.log(x);
      console.log(y);
    })()
    // 输出:
    // 1
    // undefined
    // 2
    ```
    
    解析：var语句被提升（没有它们的值初始化）到它所属的全局或函数作用域的顶部，
    即使它位于with或catch块内。但是，错误的标识符只在catch块内部可见。它相当于：
    
    ```
    (function(){
      var x, y; // outer and hoisted
      try {
        throw new Error();
      } catch (x){ // inner
        x = 1; // inner x, not the outer one
        y = 2; // there is only one y, which is in the outer scope
        console.log(x) //inner
      }
      console.log(x);
      console.log(y);
    })();
    ```

5. 请给出下面代码输出结果
    
    ```
    console.log(`0 || 1 = ${(0 || 1)}`); // 0 || 1 = 1
    console.log(`1 || 2 = ${(1 || 2)}`); // 1 || 2 = 1
    console.log(`0 && 1 = ${(0 && 1)}`); // 0 && 1 = 0
    console.log(`1 && 2 = ${(1 && 2)}`); // 1 && 2 = 2
    console.log(false == '0'); // true
    console.log(false === '0'); // false
    console.log(1 < 2 < 3); // true
    console.log(3 > 2 > 1); // true
    ```

6. 按照要求实现Person和Student对象
    * a. student继承Person
    * b. Person包含一个实例变量name，包含一个方法printName
    * c. Student包含一个实例变量score，包含一个实例方法printScore
    * d. 所有Person和Student对象之间共享一个方法
    
    ```
    function Person(name){
      this.name=name||'Person';
      this.printName = function(){
        document.write(name)
      };
    }
    Person.prototype.sayname=function () {
      alert(this.name);
    }
    function Student(name,score) {
      Person.call(this,name);
      this.score = score;
    }
    Student.prototype=new Person;
    Student.prototype.printScore=function () {
        document.write(this.score)
    }
    var xiaoMing=new Student("xiaoMing",23);
    xiaoMing.sayname();
    xiaoMing.printScore();
    ```


7. 整数数组，数组中连续的一个或者多个整数组成一个子数组，每个子数组都有一个和，求所有子数组的和的最大值，
例 [1,-2,3,10,-4,7,2,-5]，最大的子数组为[3,10,-4,7,2]，那么输出的该子数组的和是18，尽量考虑时间复杂度
    
    思路：
    * 遍历数组，遇到负的和则放弃之前的结果，重新积累，这期间保留最大值；
    * 用sum记录最终返回的最大和，用tempsum记录累计值；
    * 对于数组中的一个数array[i]，若其左边的累加和非负,那么加上array[i]；
    * 判断此时的tempsum是否大于sum，若大于此时的sum，则用sum记录下来。

    echoVic 链接：https://www.jianshu.com/p/9ed5fa86361e

    ```
    function FindGreatestSumOfSubArray(array) {
      if (array.length < 0) return 0;
      var sum = array[0],
        tempsum = array[0]; //注意初始值 不能设为0 防止只有负数        
      for (var i = 1; i < array.length; i++) {
        tempsum = (tempsum < 0) ? array[i] : tempsum + array[i];
        sum = (tempsum > sum) ? tempsum : sum;
      }
      return sum;
    }
    ```

## 3、集锦
1. 写出如下代码运行结果：
    ```
    function C1(name){
      if(name) this.name = name;
    }
    function C2(name){
      this.name = name;
    }
    function C3(name){
      this.name = name || 'John'
    }
    C1.prototype.name = 'Tom';
    C2.prototype.name = 'Tom';
    C3.prototype.name = 'Tom';
    alert(
      (new C1()).name + (new C2()).name + (new C3()).name
    )
    // 结果： TomundefinedJohn
    // 解析：C1,if不成立，new C1()中没有name属性，就访问到了原型上的name，输出tom
    C2,既然没有参数，也就是执行new C2(undefined)，所以name为undefined
    C3,new C3()的name值为john，所输出john
    ```
  
2. 写出如下代码运行结果
    
    ```
    window.number = 1;
    var obj = {
      'number': 4,
      'dbl': (function(){
        this.number *= 2;
        return function(){
          this.number *= 2;
        }
      })()
    }
    var dbl = obj.dbl;
    dbl();
    obj.dbl();
    console.log(window.number+obj.number)
    // 结果 ： 12
    // 解析：关键是this的指向问题，在 this 有所属对象时就指向所属对象，
    没有所属对象就指向全局对象。全局作用域 number 、 obj
    局部作用域 obj.nujber 、 obj.dbl。obj.dbl 为立即执行函数
    window.number = 1 * 2 = 2
    执行结果为一个匿名函数
    ```

3. 