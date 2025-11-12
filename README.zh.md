# Leaflet-Amap-Layer

一个轻量级的插件，用于将高德地图（AMap）集成到基于 Leaflet 的 Web 地图应用中。

## 特性

- AMap 与 Leaflet 的无缝集成
- 支持 11 种内置地图样式
- 自定义地图样式支持
- 控制图层透明度、可见性和 z-index
- 完整的生命周期事件监听
- 访问原生 AMap 实例以进行扩展操作

## 安装

### 方式一：NPM 安装（推荐）

**重要提示：** 本包使用对等依赖（peer dependencies），您需要手动安装所需的依赖：

```bash
# 安装主包
npm install leaflet-amap-layer

# 安装必需的对等依赖
npm install leaflet@^1.9.4 @amap/amap-jsapi-loader@^1.0.1
```

### 方式二：HTML 直接引用

```html
<!-- 1. 引入依赖 -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/@amap/amap-jsapi-loader@1.0.1/dist/index.js"></script>

<!-- 2. 引入打包文件 -->
<script src="https://unpkg.com/leaflet-amap-layer/dist/leaflet-amap-layer.umd.js"></script>
```

## 使用方法

### NPM 环境

#### 基础使用

```javascript
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { createAmapLayer } from 'leaflet-amap-layer';

// 创建 Leaflet 地图
const map = L.map('map').setView([39.90960, 116.39722], 10);

// 创建 AMap 图层
const amapLayer = createAmapLayer({
  apiKey: 'your-amap-api-key',
  securityConfig: {
    securityJsCode: 'your-security-js-code'
  },
  amapConfig: {
    mapStyle: 'whitesmoke' // 或者 'amap://styles/whitesmoke'
  }
});

// 添加到地图
amapLayer.addTo(map, [39.90960, 116.39722], 10);
```

#### 使用内置样式

```javascript
import { createAmapLayer, AMAP_STYLES } from 'leaflet-amap-layer';

const amapLayer = createAmapLayer({
  apiKey: 'your-amap-api-key',
  securityConfig: {
    securityJsCode: 'your-security-js-code'
  },
  amapConfig: {
    mapStyle: 'dark' // 使用内置深色样式
  }
});

// 动态切换样式
amapLayer.setMapStyle('fresh'); // 切换到草色青样式

// 查看所有可用样式
console.log('可用样式:', AMAP_STYLES);
```

#### 使用自定义样式

```javascript
const amapLayer = createAmapLayer({
  apiKey: 'your-amap-api-key',
  securityConfig: {
    securityJsCode: 'your-security-js-code'
  },
  amapConfig: {
    mapStyle: 'your-custom-style-url' // 使用自定义样式 URL
  }
});
```

### HTML 直接引用

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
</head>
<body>
    <div id="map" style="height: 600px;"></div>

    <!-- 1. 引入依赖 -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/@amap/amap-jsapi-loader@1.0.1/dist/index.js"></script>

    <!-- 2. 引入打包文件 -->
    <script src="https://unpkg.com/leaflet-amap-layer/dist/leaflet-amap-layer.umd.js"></script>

    <script>
        // 3. 使用全局变量 LeafletAmapLayer
        const map = L.map('map').setView([39.90960, 116.39722], 10);

        const amapLayer = new LeafletAmapLayer.AmapLayer({
            apiKey: 'your-amap-api-key',
            securityConfig: {
                securityJsCode: 'your-security-js-code'
            },
            amapConfig: {
                mapStyle: 'whitesmoke'
            }
        });

        amapLayer.addTo(map, [39.90960, 116.39722], 10);
    </script>
</body>
</html>
```

## API

### createAmapLayer(options)

工厂函数，创建 AMap 图层实例。

#### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|--------|------|--------|-------------|
| `apiKey` | `string` | `''` | 高德地图 API Key（必需） |
| `securityConfig` | `object` | `{}` | 高德地图安全配置 |
| `securityConfig.securityJsCode` | `string` | `''` | 高德地图安全密钥（可选） |
| `amapConfig` | `object` | `{}` | 高德地图配置选项 |
| `amapConfig.mapStyle` | `string` | `'whitesmoke'` | 地图样式（内置或自定义 URL） |
| `amapConfig.zoomEnable` | `boolean` | `true` | 是否启用缩放功能 |
| `amapConfig.dragEnable` | `boolean` | `true` | 是否启用拖拽功能 |
| `amapConfig.resizeEnable` | `boolean` | `false` | 是否启用容器自适应 |
| `amapConfig.animateEnable` | `boolean` | `false` | 是否启用动画 |
| `amapConfig.jogEnable` | `boolean` | `false` | 是否启用 jog 手势 |
| `minZoom` | `number` | `3` | 最小缩放级别 |
| `maxZoom` | `number` | `20` | 最大缩放级别 |
| `opacity` | `number` | `1` | 图层透明度（0-1） |
| `visible` | `boolean` | `true` | 图层是否可见 |
| `zIndex` | `number` | `100` | 图层层级 |

### AmapLayer 实例方法

#### addTo(map, center, zoom)
将图层添加到 Leaflet 地图

**参数：**
- `map` (`L.Map`): Leaflet 地图实例
- `center` (`[number, number]`): 地图中心 `[纬度, 经度]`
- `zoom` (`number`): 初始缩放级别

**返回：** `Promise<void>`

```javascript
await amapLayer.addTo(map, [39.90960, 116.39722], 10);

// 异常处理
try {
  await amapLayer.addTo(map, [39.90960, 116.39722], 10);
  console.log('图层添加成功');
} catch (error) {
  console.error('图层添加失败:', error);
}
```

#### setVisible(visible)
设置图层可见性

**参数：**
- `visible` (`boolean`): 是否显示图层

```javascript
amapLayer.setVisible(true);  // 显示图层
amapLayer.setVisible(false); // 隐藏图层

// 切换显示状态
const currentState = amapLayer.isLayerLoaded();
amapLayer.setVisible(!currentState);
```

#### setOpacity(opacity)
设置图层透明度

**参数：**
- `opacity` (`number`): 透明度值（0-1）

```javascript
amapLayer.setOpacity(0.5);  // 设置为半透明
amapLayer.setOpacity(1);    // 完全不透明
amapLayer.setOpacity(0);    // 完全透明
```

#### setMapStyle(style)
设置地图样式

**参数：**
- `style` (`string`): 地图样式名称或 URL

```javascript
// 使用内置样式
amapLayer.setMapStyle('dark');    // 幻影黑
amapLayer.setMapStyle('light');   // 月光银
amapLayer.setMapStyle('fresh');   // 草色青
amapLayer.setMapStyle('whitesmoke'); // 远山黛

// 使用完整样式 URL
amapLayer.setMapStyle('amap://styles/normal');
amapLayer.setMapStyle('https://your-custom-style-url');
```

#### getMapStyle()
获取当前地图样式

**返回：** `string`

```javascript
const currentStyle = amapLayer.getMapStyle();
console.log('当前样式:', currentStyle);
```

#### getAvailableStyles()
获取所有可用的内置样式

**返回：** `object`

```javascript
const styles = amapLayer.getAvailableStyles();
console.log('可用样式:', styles);
// 输出: { normal: "amap://styles/normal", dark: "amap://styles/dark", ... }
```

#### setZIndex(zIndex)
设置图层层级

**参数：**
- `zIndex` (`number`): 层级值

```javascript
amapLayer.setZIndex(100);  // 普通层级
amapLayer.setZIndex(1000); // 高层级（显示在顶部）
amapLayer.setZIndex(1);    // 低层级（显示在底部）
```

#### getAmapInstance()
获取原生 AMap 实例

**返回：** `AMap.Map`

```javascript
const amap = amapLayer.getAmapInstance();

// 使用高德地图原生 API
amap.setCenter([116.39722, 39.90960]);
amap.setZoom(12);

// 添加高德地图原生控件
amap.addControl(new AMap.Scale());
amap.addControl(new AMap.ToolBar());
```

#### getCustomLayer()
获取自定义图层实例

**返回：** `L.CustomLayer`

```javascript
const customLayer = amapLayer.getCustomLayer();

// 监听图层事件
customLayer.on('layer-render', (event) => {
  console.log('图层渲染完成', event);
});

customLayer.on('layer-mounted', () => {
  console.log('图层挂载完成');
});

customLayer.on('layer-destroyed', () => {
  console.log('图层销毁完成');
});
```

#### isLayerLoaded()
检查图层是否已加载

**返回：** `boolean`

```javascript
if (amapLayer.isLayerLoaded()) {
  console.log('图层已加载');
  // 执行需要图层的操作
} else {
  console.log('图层未加载');
}
```

#### destroy()
销毁图层并清理资源

```javascript
// 销毁图层
amapLayer.destroy();

// 销毁后需要重新创建实例才能使用
amapLayer = createAmapLayer(options);
```

### 事件监听

图层支持完整的事件生命周期：

```javascript
const amapInstance = amapLayer.getAmapInstance();
const customLayer = amapLayer.getCustomLayer();

// 监听高德地图事件
amapInstance.on('complete', () => {
  console.log('地图初始化完成');
});

amapInstance.on('click', (e) => {
  console.log('点击位置:', e.lnglat);
});

// 监听自定义图层事件
customLayer.on('layer-render', (e) => {
  const { zoom, center } = e.target;
  console.log(`渲染完成: 缩放级别=${zoom}, 中心点=${center}`);
});
```

### 完整示例

```javascript
import { createAmapLayer } from 'leaflet-amap-layer';

// 创建地图
const map = L.map('map').setView([39.90960, 116.39722], 10);

// 创建 AMap 图层
const amapLayer = createAmapLayer({
  apiKey: 'your-api-key',
  securityConfig: {
    securityJsCode: 'your-security-code'
  },
  minZoom: 5,
  maxZoom: 18,
  opacity: 0.8,
  zIndex: 100,
  amapConfig: {
    mapStyle: 'whitesmoke',
    zoomEnable: true,
    dragEnable: true
  }
});

try {
  // 添加图层
  await amapLayer.addTo(map, [39.90960, 116.39722], 10);

  // 监听事件
  const amap = amapLayer.getAmapInstance();
  amap.on('click', (e) => {
    console.log('点击坐标:', e.lnglat);
  });

  // 动态控制
  setTimeout(() => {
    amapLayer.setMapStyle('dark');
    amapLayer.setOpacity(0.7);
  }, 3000);

} catch (error) {
  console.error('初始化失败:', error);
}
```

## 内置地图样式

| 样式名称 | 样式标识 | 中文名称 | 描述 |
|----------|----------|----------|------|
| `normal` | `amap://styles/normal` | 标准 | 标准地图样式 |
| `dark` | `amap://styles/dark` | 幻影黑 | 深色主题，适合夜间使用 |
| `light` | `amap://styles/light` | 月光银 | 浅色主题，简洁明亮 |
| `whitesmoke` | `amap://styles/whitesmoke` | 远山黛 | 淡雅风格，减少视觉干扰 |
| `fresh` | `amap://styles/fresh` | 草色青 | 清新自然风格 |
| `grey` | `amap://styles/grey` | 雅士灰 | 灰色调，商务风格 |
| `graffiti` | `amap://styles/graffiti` | 涂鸦 | 艺术涂鸦风格 |
| `macaron` | `amap://styles/macaron` | 马卡龙 | 柔和色彩风格 |
| `blue` | `amap://styles/blue` | 靛青蓝 | 蓝色主题 |
| `darkblue` | `amap://styles/darkblue` | 午夜蓝 | 深蓝色主题 |
| `wine` | `amap://styles/wine` | 酱籽 | 红酒色调主题 |

## 构建文件

`dist` 目录包含三种格式：

- **`leaflet-amap-layer.js`**: CommonJS 格式，用于 Node.js 环境
- **`leaflet-amap-layer.esm.js`**: ES Module 格式，用于现代构建工具
- **`leaflet-amap-layer.umd.js`**: UMD 格式，可直接在浏览器中使用

详细使用说明请参考 [USAGE.md](./USAGE.md)。

## 环境要求

- Leaflet v1.9.0 或更高版本
- 高德地图 API Key 和 Security JS Code

## 快速开始

1. **获取高德地图 API Key**: 访问 [高德开放平台](https://lbs.amap.com/) 申请

2. **创建地图**:
   ```html
   <div id="map" style="height: 400px;"></div>

   <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
   <script src="https://unpkg.com/@amap/amap-jsapi-loader@1.0.1/dist/index.js"></script>
   <script src="https://unpkg.com/leaflet-amap-layer/dist/leaflet-amap-layer.umd.js"></script>

   <script>
   const map = L.map('map').setView([39.90960, 116.39722], 10);
   const amapLayer = new LeafletAmapLayer.AmapLayer({
     apiKey: 'your-api-key'
   });
   amapLayer.addTo(map, [39.90960, 116.39722], 10);
   </script>
   ```

3. **查看示例**: 参考 `example.html` 文件

## 许可证

MIT