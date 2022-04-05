---
date: 2022.4.5
---

# DAY4 

## 10. 浏览器有哪几种缓存，区别是什么？

浏览器缓存主要有**http缓存**、**cookie**和**Web Storage**，其中Web Storage又分为**sessionStorage**和**locaStorage**。

**共同点**：都是保存在浏览器端、且同源的。

**区别**：

- **cookie数据始终在同源的http请求中携带（即使不需要）**,即cookie数据会在浏览器和服务器之间来回传递，而sessionStorage和localStorage则不会主动把数据发送给服务器，仅在本地进行存储。cookie数据还有路径（path）的概念，可以限制cookie只属于某个路径下
- **存储大小限制不同**，cookie数据不能超过4k，同时由于每次发起http请求都会携带cookie、所以cookie只适合保存很小的数据，如会话标识。sessionStorage和localStorage虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大
- **数据有效期不同**，sessionStorage：仅在当前浏览器窗口关闭之前有效；localStorage：始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据；cookie：只在设置的cookie过期时间之前有效，即使窗口关闭或浏览器关闭
- **作用域不同**，sessionStorage不在不同的浏览器窗口中共享，即使是同一个页面；localstorage和cookie在所有同源窗口中都是共享的。
- web Storage支持**事件通知机制**，可以将数据更新的通知发送给监听者
- web Storage的**api接口**使用更方便



## 11. 如何写一个会过期的localStorage，说说想法

有两种方案：**惰性删除**和**定时删除**

**惰性删除**

- 惰性删除是指某个键值过期以后不会被立刻删除，而是在下次被使用的时候才会检查是否过期，如果过期就删除。

- 惰性删除实现了可过期的localStorage缓存，但是也有比较明显的缺点：如果一个key一直未被使用，那么这个key即使过期了也会一直存在。为了弥补这样缺点，可以使用另一种清理过期缓存的策略，即**定时删除**。

**定时删除**

- 定时删除是指，每隔一段时间执行一次删除操作，并通过限制删除操作执行的次数和频率，来减少删除操作对CPU的长期占用。另一方面定时删除也有效的减少了因惰性删除带来的对localStorage空间的浪费。
- 具体实现时可以采取以下策略
  - 首先通过Object.keys(localStorage)来获取所有的key,然后遍历key用正则表达式匹配出可过期的key
  - 每隔一秒执行一次定时删除，操作如下：
    1. 随机测试20个设置了过期时间的key。
    2. 删除所有发现的已过期的key。
    3. 若删除的key超过5个则重复**步骤1**，直至重复500次。



**代码**

- 惰性删除

```js
var lsc = (function (self) {
  var prefix = 'one_more_lsc_'

  // 写入
  self.set = function (key, val, expires) {
    key = prefix + key
    val = JSON.stringify({
      val: val,
      expires: Date.now() + expires * 1000
    })
    localStorage.setItem(key, val)
  }

  // 读取
  self.get = function (key) {
    key = prefix + key
    let val = localStorage.getItem(key)
    if (!val) {
      return null
    }
    val = JSON.parse(val)
    if (val.expires < Date.now()) {
      localStorage.removeItem(key)
      return null
    }
    return val.val
  }

  return self
})(lsc || {})

```

- 定时删除

```js
var list = []
// 初始化list
self.init = function () {
    var keys = Object.keys(localStorage)
    var reg = new RegExp('^' + prefix)
    for (var i = 0; i < keys.length; i++) {
        if (reg.test(keys[i])) {
            list.push(keys[i])
        }
    }
}
self.init()

// 检查函数
self.check = function () {
    if (!list || list.length === 0) {
        return
    }
    var checkCount = 500
    while (checkCount--) {
        // 随机测试20个设置了过期时间的key
        var expiresCount
        for (var i = 0; i < 20; i++) {
            if (list.length === 0) break
            var index = Math.random() * list.length
            var key = list[index]
            var val = localStorage.getItem(key)
            if (!val) {
                list.splice(index, 1)
                expiresCount++
                continue
            }
            val = JSON.parse(val)
            if (val.expires < Date.now()) {
                localStorage.removeItem(key)
                list.splice(index, 1)
                expiresCount++
            }
        }

        if (expiresCount < 5 || list.length === 0) {
            break
        }
    }
}

// 每个一秒执行一次
window.setInterval(() => {
    self.check()
}, 1000)
```



## 12. localStorage 能跨域吗？

不能。

**解决方案**

- 通过postMessage实现跨域通信
- 通过创建一个公共的iframe并部署在某个域名下，作为共享域
- 将需要进行localStorage跨域通信的页面嵌入该iframe
- 接入对应的SDK（Software Development Kit ， 软件开发工具包）操作共享域，从而实现localStorage跨域通信