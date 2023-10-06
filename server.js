const express = require('express');
const app = express();
const port = 4300;
// 加载dist目录下的index.html文件
app.use(express.static('dist'));
// 启动服务器
app.listen(port, () => console.log(`Listening on port ${port}`));
