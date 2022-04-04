---
date: 2022.4.4
---



# DAY3

[TOC]



## 4. 未知高度元素垂直居中、垂直居中的实现方式有哪些？

### (1)绝对定位+transform

**核心代码**

```css
.wrap {
    position: relative;
}

.child {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
}
```

### （2）**css3 的flex布局**

**核心代码**

```css
.wrap {
    display: flex;
    justify-content: center;
}

.child{
    align-self: center;
}
```

### (3) table布局

**html结构**

```html
<div class="wrap">
    <div class="child">
      <div>12344565</div>
    </div>
  </div>
```

**css样式**

```css
.wrap {
    display: table;
    width: 500px;
    height: 500px;
    background-color: red;
}

.child {
    display: table-cell;
    background-color: green;
    vertical-align: middle;
}

.child div {
    width: 100px;
    height: 100px;
    background-color: pink;
    margin: 0 auto;
}
```

**解释**

- 外层元素设置display: table
- 里层设置display: table-cell成为单元格，再设置verticle-align: middle，这样再里层的div元素就是中线对齐垂直居中了
- 里层div设置margin: 0 auto；实现水平居中。



## 5. 实现图片垂直居中

### (1)使用绝对定位

- 父级元素设置position: relative;
- 给图片添加绝对定位，并设置top: 50%;
- 给图片设置margin-top: -自身高度的一半;或者使用transform: translateY(-50%);
- 这种方法推荐，兼容性比较好。

### (2)使用flex布局

- 给父级元素设置display: flex;align-items: center;
- 这种方法对于IE8/9不支持

### (3)使用table

- 最外层元素设置table布局
- img的父元素设置verticle-align: middle;
- 水平居中可以给最外层设置：text-align: center;



## 6. 清除浮动

清除浮动的实质其实是闭合浮动，把浮动的元素圈起来，让父元素闭合入口和出口从而不让浮动来影响外面的元素。

清除浮动用到css中的clear属性，它有三个值分别是left,right和both,分别表示清除左浮动，右浮动和左右两侧的浮动的影响。

常用的清除浮动方法有：**额外标签法**、**BFC**和**伪元素法**

- 额外标签法

  - 在浮动元素的末尾添加一个空标签，并且设置clear属性值为both,这是W3C推荐的做法，虽然比较简单，但是添加了一个无意义的空标签，结构化比较差，所以一般不用。

- 给浮动元素的父级元素添加overflow样式

  - 比如overflow: auto|hidden|scroll等都可以
  - 这是通过触发BFC的方式来实现隔离浮动元素对其他外界元素的影响
  - 但是overflow的本质是移除隐藏，所以如果当内容增多时不会自动换行会导致内容被隐藏，无法显示要溢出的元素。

- 伪元素法

  - after伪元素

    - 添加一个.clearfix的类，并未该类设置after伪元素

    - 伪元素的样式设置content: '.'值尽量不要为空，可以写一个'.'然后设置display: block；转换为块级元素，设置visibility: hidden;来将content的内容隐藏，设置clear: both用于清除两侧浮动的影响。

    - 为了兼容IE6/7可以给该类添加一个属性 `*zoom: 1;`触发hasLayout来清除浮动

    - 代表网站有百度、淘宝、网易

      ```css
      .clearfix:after{
          content:".";  /*尽量不要为空，一般写一个点*/
          height:0;     /*盒子高度为0，看不见*/
          display:block;    /*插入伪元素是行内元素，要转化为块级元素*/
          visibility:hidden;      /*content有内容，将元素隐藏*/
          clear:both;  
      }
      
      .clearfix {
          *zoom: 1;   /*  *只有IE6,7识别 */
      }
      ```

      

  - 双伪元素

    - 给.clearfix伪元素设置display: table,after伪元素设置clear: both

      ```css
      .clearfix:before, .clearfix:after {
          content: ""; 
          display: table;
      }
      .clearfix:after {
          clear: both;
      }
      .clearfix {
          *zoom: 1;
      }
      ```

      

## 7. css实现等腰、等边三角形

```css
body {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.isosceles {
    width: 0;
    height: 0;
    border-left: 100px solid transparent;
    border-right: 100px solid transparent;
    border-bottom: 50px solid pink;
}

.equalateral {
    width: 0;
    height: 0;
    border-left: 100px solid transparent;
    border-right: 100px solid transparent;
    border-bottom: 173.20508px solid pink;
}
```

左右边框宽度用于控制左右方向边的长度，底部边框宽度用于控制高。



## 8. 绘制任意角度扇形

**实现原理**

- 外层一个大容器设置为圆形，里层两个一样大的子圆形
- 给里层两个圆形设置clip属性 `clip: rect(0 圆半径 圆直径 0)`表示用一个矩形区域来隐藏区域外的部分，rect四个属性表示 矩形的上右下左四个边界在元素上的位置。如rect(50px  0 0 0)表示上边界在元素从上往下50px处
- clip属性只能设置给绝对定位的元素，不过它不是一个标准属性，不推荐使用。

**html结构**

```html
<div class="shanxing shanxing1">
    <div class="sx1"></div>
    <div class="sx2"></div>
</div>
```

**css属性**

```css
.shanxing {
    position: relative;
    width: 200px;
    height: 200px;
    border-radius: 100px;
    background-color: rgb(176, 229, 176);
    background-color: pink;
}

.sx1 {
    position: absolute;
    width: 200px;
    height: 200px;
    transform: rotate(0deg);
    clip: rect(0px, 100px, 200px, 0px);
    /*这个clip属性用来绘制半圆，在clip的rect范围内的内容显示出来，使用clip属性，元素必须是absolute的 */
    border-radius: 100px;
    background-color: red;

}

.sx2 {
    position: absolute;
    width: 200px;
    height: 200px;
    transform: rotate(0);
    border-radius: 50%;
    clip: rect(0px 100px 200px 0);
}
```



## 9. for in 与 for of 的区别

**for in**

- 首先，for in 就是用来遍历对象属性用的，遍历数组等最好不要使用，它的效率比较低

- for in 遍历对象属性是会进行原型链搜索，因此继承的属性也会被遍历到，如果不想遍历继承的属性和方法可以使用 `hasOwnProperty()`方法判断该属性是否该对象的实例属性。

- for in 执行过程

  - 判断in后的表达式结果

    - undefined或null则报错或跳过
    - 数字、字符串或布尔值转换为包装对象

  - 运行in前面的表达式，从后面的对象取属性赋值给该结果（左值）

  - 执行循环体

  - 重复前面2个步骤

    ```js
    // 利用这个特性，可以将对象属性拷贝到数组
    let obj = {
      name: 'zs',
      age: 20
    }
    let a = []
    let i = 0
    for (a[i++] in obj);
    console.log(a)
    // [ 'name', 'age' ]
    ```
    

- for in 遍历数组得到的是数组各项的索引，是字符串类型的

**for of**

- 这是ES6新增的，它遍历数组内的元素，不包括原型和索引
- 可以遍历数/数组对象/字符串/map/set等拥有迭代器对象（iterator）的集合，但是**不能遍历对象，因为对象不含迭代器对象。**

**总结**

|  类型  |       for in       |      for of       |
| :----: | :----------------: | :---------------: |
|  数组  | 索引（字符串类型） |        值         |
| 字符串 | 索引（字符串类型） |        值         |
|  对象  | 属性（字符串类型） |       报错        |
|  数字  |  不报错但拿不到值  |       报错        |
|  Set   |  不报错但拿不到值  |        值         |
|  Map   |  不报错但拿不到值  | 各项['key','val'] |

- for of 不能遍历对象和数字，其他都能拿到值，其中Map拿到的是数组

- for in 都可以遍历，但只有数组、字符串和对象能拿到属性（索引）
