---
date: 2022.4.4
---

# DAY2 

## 1. 实现三栏布局？

### (1)圣杯布局

**css样式**

```css
//习惯性的CSS reset
body,html{
    height:100%;
    padding: 0;
    margin: 0
}
//父元素body空出左右栏位
body {
    padding-left: 100px;
    padding-right: 200px;
}
//左边元素更改
.left {
    background: red;
    width: 100px;
    float: left;
    margin-left: -100%;
    position: relative;
    left: -100px;
    height: 100%;
}
//中间部分
.main {
    background: blue;
    width: 100%;
    height: 100%;
    float: left;
}
//右边元素定义
.right {
    background: red;
    width: 200px;
    height: 100%;
    float: left;
    margin-left: -200px;
    position: relative;
    right: -200px;
}
```

**解释**

- 首先给body一个左右padding，空出位置给左右两栏
- 中间一栏设置width: 100%占满body内容宽度
- 三者都左浮动，注意标签顺序是中间栏在前，然后才是左栏和右栏
- 由于中间占满宽度，所以左右两栏被挤下来
- 给左栏和右栏负的左margin，由于窗口宽度不够maring所以两者都上去并压住了中间栏的右边，
- 左右两栏给相对定位，左栏left: -100%，右栏right: -200px;



### （2）双飞翼布局

**html结构**

```html
<div class="mian">
    <div class="inner"></div>
</div>
<div class="left"></div>
<div class="right"></div>
```

**css样式**

```css
html,
    body {
      margin: 0;
      padding: 0;
      height: 100%;
    }

    .main {
      float: left;
      height: 100%;
      width: 100%;
      background-color: rgb(209, 247, 209);
    }

    .left {
      float: left;
      height: 100%;
      background-color: pink;
      width: 100px;
      margin-left: -100%;
    }

    .right {
      float: left;
      height: 100%;
      background-color: skyblue;
      width: 200px;
      margin-left: -200px;
    }

    .inner {
      padding-left: 100px;
      padding-right: 200px;
    }
```

**解释**

- 双飞翼布局是在圣杯布局的基础上在.main里增加了一层.inner，给inner一个左右padding,然后左右两栏就不用使用相对定位了。



### （3）绝对定位法

**html结构**

```html
<div class="main"></div>
<div class="left">left</div>
<div class="right">right</div>
```

**css样式**

```css
html,
body {
    margin: 0;
    padding: 0;
    height: 100%;
}

.main {
    position: relative;
    padding-left: 100px;
    padding-right: 200px;
    background-color: rgb(200, 246, 200);
    height: 100%;
}

.left,
.right {
    position: absolute;
    top: 0;
    background-color: skyblue;
    height: 100%;
}

.left {
    width: 100px;
    left: 0;
}

.right {
    width: 200px;
    right: 0;
}
```

**解释**

- 绝对定位法的明显缺点就是当中间栏含有 有宽度的内部元素时，在浏览器窗口小到一定程度会有层重叠的情况



### （4）浮动

**html结构**

```html
<div class="left"></div>
<div class="right"></div>
<div class="main"></div>
```

**css样式**

```css
html,
body {
    padding: 0;
    margin: 0;
    height: 100%;
}

.left {
    float: left;
    width: 100px;
    height: 100%;
    background-color: skyblue;
}

.right {
    float: right;
    width: 200px;
    height: 100%;
    background-color: skyblue;
}

.main {
    margin: 0 200px 0 100px;
    height: 100%;
    background-color: rgb(246, 246, 147);
}
```

**解释**

- 这种方法很好理解也很简单



### （5）flex布局

**html结构**

```html
<div class="left">Left</div>
<div class="main">Main</div>
<div class="right">Right</div>
```

**css样式**

```css
html,
body {
    margin: 0;
    padding: 0;
    height: 100%;
}

body {
    display: flex;
}

.left {
    width: 100px;
    background-color: skyblue;
}

.main {
    flex: 1;
    background-color: rgb(179, 246, 179);
}

.right {
    width: 200px;
    background-color: skyblue;
}
```

**解释**

- 简单高效

### (6）grid布局

**html结构**

```html
<div class="left">Left</div>
<div class="main">Main</div>
<div class="right">Right</div>
```

**css样式**

```css
html,
body {
    padding: 0;
    margin: 0;
    height: 100%;
}

body {
    display: grid;
    grid-template-columns: 100px 1fr 200px;
}

.left,
.right {
    height: 100%;
    background-color: skyblue;
}

.main {
    height: 100%;
    background-color: pink;
}
```

**解释**

- 

