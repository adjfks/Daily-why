var lsc = (function (self) {
  var prefix = 'one_more_lsc_'

  var list = []

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
    var val = localStorage.getItem(key)
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

  return self
})(lsc || {})
