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
