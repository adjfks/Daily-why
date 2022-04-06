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
