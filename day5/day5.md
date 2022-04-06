---
date: 2020.4.6
---

# DAY5

## 13. 为什么typeof null是Object?

因为在js中，各种对象是以二进制进行存储的，如果二进制的前三位都是0的话，系统就会判断是 `Object`类型，而null的二进制全是0，自然就判断为 `Object`。

这个bug是初版js遗留下来的，五种标识位有：

000: 对象

1： 整型

100： 字符串

110： 布尔值

010： 双精度



## 14. \==和===有什么区别?

`===`是严格相等，不仅要求值相等，还要求类型相等。`==`只要求类型转换后的值相等。

对于 `===`来说，会先判断类型是否相等，不相等结果直接为false。对于字符串，它比较的是字符串的编码，对于对象，比较的是对象的引用，只要引用相同就为true。

对于`==`来说，在比较时如果两侧类型不一样，会进行隐式类型转换，字符串或布尔值和数字比较会先把字符串或布尔值转为数字再比较，对象和原始类型比较会先转换为原始类型再比较。null 和 undefined比较特殊，它们不会发生类型转换，但是它们比较的结果为true.



## 15. 手写call、apply、bind？

**call**

```js
Function.prototype.my_call = function (context) {
  // 调用者不是函数，抛出错误
  if (typeof this !== 'function') {
    throw new Error('Not a function')
  }
  // context不传参时默认为window
  context = context || window
  // 为context设置fn方法
  context.fn = this
  // 将arguments伪数组转为真正的数组并截取第一个context参数后的参数
  let args = Array.from(arguments).slice(1)
  // 调用fn并传入参数
  let result = context.fn(...args)
  // 删除context上的fn方法
  delete context.fn
  // 返回执行结果
  return result
}
```

**apply**

```js
Function.prototype.my_apply = function (context) {
  // 调用者不是函数，抛出错误
  if (typeof this !== 'function') {
    throw new Error('Not a function')
  }

  let result

  // context不传参时默认为window
  context = context || window

  // 为context设置fn方法
  context.fn = this

  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }

  delete context.fn

  return result
}

```

**bind**

```js
Function.prototype.myBind = function (context) {
  // 判断是否是一个函数
  if (typeof this !== 'function') {
    throw new TypeError('Not a Function')
  }
  // 保存调用bind的函数
  const _this = this
  // 保存参数
  const args = Array.prototype.slice.call(arguments, 1)
  // 返回一个函数
  return function F() {
    // 判断是不是new出来的
    if (this instanceof F) {
      // 如果是new出来的
      // 返回一个空对象，且使创建出来的实例的__proto__指向_this的prototype，且完成函数柯里化
      return new _this(...args, ...arguments)
    } else {
      // 如果不是new出来的改变this指向，且完成函数柯里化
      return _this.apply(context, args.concat(...arguments))
    }
  }
}

```



## 16.字面量创建对象和new创建对象有什么区别?new内部都实现了什么，手写一个new

字面量

- 字面量创建对象更简单，方便阅读
- 不需要进行作用域解析，速度更快
- 字面量创建更高效一些，少了`__proto__`指向赋值和`this`

new 内部

- 创建一个新对象obj
- 使新对象obj的 `__proto__`指向构造函数的 `prototype`
- 改变this的指向，指向新的obj
- 执行该函数并将执行结果保存到result
- 判断result是否为对象，是的话返回result，否则返回obj

```js
// 手写一个new
function myNew(fn, ...args) {
    // 创建一个空对象
    let obj = {}
    // 使空对象的隐式原型指向原函数的显式原型
    obj.__proto__ = fn.prototype
    // this指向obj
    let result = fn.apply(obj, args)
    // 返回
    return result instanceof Object ? result : obj
}
```

**new Object()的过程**

```js
var obj = new Object(); // 创建一个空对象
obj.__proto__ = Object.prototype; // obj的__proto__指向构造函数Object的prototype
var result = Object.call(obj); // 把构造函数Object的this指向obj，并执行构造函数Object把结果赋值给result
if (typeof(result) === 'object') {
    objB = result; // 构造函数Object的执行结果是引用类型，就把这个引用类型的对象返回给objB
} else {
    objB = obj; // 构造函数Object的执行结果是值类型，就返回obj这个空对象给objB
}

```



## 17. 字面量new出来的对象和 Object.create(null)创建出来的对象有什么区别?

字面量和new创建出来的对象都会继承Object的属性和方法，它们的隐式原型指向Object的显式原型。

而 `Object.create(null)`创建出来的对象原型为null,作为原型链的最顶端，没有继承Object的方法和属性。

