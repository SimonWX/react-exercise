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
delegate()方法


