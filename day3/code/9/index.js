let arr = ['a', 'b', 'c']
let str = 'abc'
let obj = {
  k1: 'v1',
  k2: 'v2',
  k3: 'v3'
}
let num = 10
let set = new Set(['a', 'b', 'c'])
let map = new Map([
  ['k1', 'v1'],
  ['k2', 'v2'],
  ['k3', 'v3']
])

/* 遍历数组 */
console.log('/* 遍历数组 */')
for (let i in arr) {
  console.log(i)
}
console.log('---------')
for (let i of arr) {
  console.log(i)
}

/* 遍历字符串 */
console.log('/* 遍历字符串 */')
for (let i in str) {
  console.log(i)
}
console.log('---------')
for (let i of str) {
  console.log(i)
}

/* 遍历对象 */
console.log('/* 遍历对象 */')
for (let i in obj) {
  console.log(i)
}
console.log('---------')
// for (let i of obj) {
//   console.log(i)
// }

/* 遍历数字 */
console.log('/* 遍历数字 */')
for (let i in num) {
  console.log(i)
}
console.log('---------')
/* for (let i of num) {
  console.log(i)
} */

/* 遍历Set */
console.log('/* 遍历Set */')
for (let i in set) {
  console.log(i)
}
console.log('---------')
for (let i of set) {
  console.log(i)
}

/* 遍历Map */
console.log('/* 遍历Map */')
for (let i in map) {
  console.log(i)
}
console.log('---------')
for (let i of map) {
  console.log(i)
}
