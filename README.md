# float-block

It makes block stick to top of the page. To use it, block must corresponds CSS rules:
 - `position: static` 
 - `margin: 0`
 - `display: block`
 - `width: auto`

##Options

Options list:
<table>
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Type</th>
      <th>Default Value</th>
    </tr>
    <tr>
      <td>classActive</td>
      <td>Indicates class name that is added to block when it sticks.</td>
      <td><code>string</code></td>
      <td>'' (empty string)</td>
    </tr>
    <tr>
      <td>relative</td>
      <td>Indicates class name of parent block. By default block sticks to viewport top and bottom edges.</td>
      <td><code>string</code></td>
      <td>'' (empty string)</td>
    </tr>
    <tr>
      <td>top</td>
      <td>Indicates distance between viewport top edge and block top edge.</td>
      <td><code>number</code></td>
      <td>0</td>
    </tr>
    <tr>
      <td>bottom</td>
      <td>Indicates distance between viewport bottom edge and block bottom edge.</td>
      <td><code>number</code></td>
      <td>0</td>
    </tr>
    <tr>
      <td>indent</td>
      <td>Indicates distance between block bottom edge and parent block bottom edge.</td>
      <td><code>number</code></td>
      <td>0</td>
    </tr>
</table>

##Browser Support
All modern browsers and IE9+

##Examples
[Demo1](https://041616.github.io/float-block/example/demo01.html) - without any parameters.

[Demo2](https://041616.github.io/float-block/example/demo02.html) - `classActive` parameter is setted.

[Demo3](https://041616.github.io/float-block/example/demo03.html) - `top` parameter is setted.

[Demo4](https://041616.github.io/float-block/example/demo04.html) - `relative` parameter is setted.

[Demo5](https://041616.github.io/float-block/example/demo05.html) - `bottom` parameter is setted.
