---
title: Hexo教程-5.13
categories: 
    - 技术
    - Hexo
tags: 
    - ai
    - Hexo
    - js
    - css
    - html
description: 
    Hexo搭建网站常见问题解答与技巧
    ![](https://files.catbox.moe/xnjetr.png)
date: 2023-05-22 15:56:45
---
## gptの总结：
> 本次对话总结：
> 
> 1. 如何在 Hexo 中使用 toc 侧边栏目录？
可以使用 hexo-toc 插件自动生成 toc，然后通过自定义 CSS 样式实现在侧边栏中显示，并使用 JS 实现点击导航到相应目录位置。
> 2. 如何使用 JS 和 Canvas 实现有缓慢动效的背景？
可以使用 Canvas 绘制背景，并使用 requestAnimationFrame 方法实现动态效果。
> 3. 如何设置 HTML 背景不随页面滚动？
可以使用 CSS 样式属性 background-attachment: fixed 实现。
> 4. 如何使用 SVG 图片设置背景？
可以在 CSS 样式中使用 background-image: url("xxx.svg")，并设置 background-repeat 和 background-size 属性。
> 5. 如何设置 SVG 不继承父元素属性？
可以在 SVG 标签中添加 xmlns 属性，并在 CSS 样式中使用 !important 关键字。
> 6. 如何在 Hexo 中使用 EJS partials？
可以使用 <%- partial("filename") %> 语法引入 partials，filename 表示 partial 文件的路径。
> 7. 如何避免变量作用域错误？
需要注意变量的作用域，避免把局部变量当成全局变量。
> 8. 代码中的错误原因及解决方法。
a. 定义未知变量
原因：没有声明变量或者使用局部变量时误以为是全局变量。
解决方法：声明变量或者注意作用域。
>    
>    b. 文件路径错误
原因：路径错误或者没有在 Hexo 配置文件中设置正确的路径。
解决方法：检查路径是否正确，并在配置文件中设置正确的路径。
>    
>    c. CSS 样式错误
原因：CSS 样式写法错误或者属性值错误。
解决方法：检查 CSS 样式是否正确，确保属性值正确。
>    
>    d. 模板语法错误
原因：模板语法使用错误。
解决方法：检查模板语法是否正确。
