### 安装
npm init -y    
npm i webpack webpack-cli --save-dev

设置 src/index.js, dist/index.html, 

npm run build 建立文件

### 管理资源
#### 加载 CSS
npm i --save-dev style-loader css-loader

webpack.config.js添加:
```angularjs
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: [
+           'style-loader',
+           'css-loader'
+         ]
+       }
+     ]
+   }
```

index.js `import './style.css';`即可

#### 加载图片
npm install --save-dev file-loader

webpack.config.js添加：
```angularjs
+       {
+         test: /\.(png|svg|jpg|gif)$/,
+         use: [
+           'file-loader'
+         ]
+       }
```

src/index.js `import Icon from './icon.png';`
```angularjs
+   // 将图像添加到我们现有的 div。
+   var myIcon = new Image();
+   myIcon.src = Icon;
```

这时css也可使用图片：
```angularjs
.hello {
    color: red;
+   background: url('./icon.png');
  }
```

#### 加载字体
webpack.config.js
```angularjs
+       {
+         test: /\.(woff|woff2|eot|ttf|otf)$/,
+         use: [
+           'file-loader'
+         ]
+       }
```

src/style.css就可以使用字体
```angularjs
+ @font-face {
+   font-family: 'MyFont';
+   src:  url('./my-font.woff2') format('woff2'),
+         url('./my-font.woff') format('woff');
+   font-weight: 600;
+   font-style: normal;
+ }

  .hello {
    color: red;
+   font-family: 'MyFont';
    background: url('./icon.png');
  }
```

#### 加载数据 
导入 CSV、TSV 和 XML，你可以使用 csv-loader 和 xml-loader。
npm install --save-dev csv-loader xml-loader

webpack.config.js

```angularjs
+       {
+         test: /\.(csv|tsv)$/,
+         use: [
+           'csv-loader'
+         ]
+       },
+       {
+         test: /\.xml$/,
+         use: [
+           'xml-loader'
+         ]
+       }
```

在src/index.js
```angularjs
+ import Data from './data.xml';
+   console.log(Data);
```

#### 管理输出
import 其他文件

src/print.js
```angularjs
export default function printMe() {
  console.log('I get called from print.js!');
}
```
`+ import printMe from './print.js';`

设置多入口
```angularjs
-   entry: './src/index.js',
+   entry: {
+     app: './src/index.js',
+     print: './src/print.js'
+   },
    output: {
-     filename: 'bundle.js',
+     filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
```

设定 HtmlWebpackPlugin
npm install --save-dev html-webpack-plugin
```angularjs
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

+   plugins: [
+     new HtmlWebpackPlugin({
+       title: 'Output Management'
+     })
+   ],
```

清理 /dist 文件夹
npm install clean-webpack-plugin --save-dev

```angularjs
+ const CleanWebpackPlugin = require('clean-webpack-plugin');
plugins: [
+     new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Output Management'
      })
    ],
```

