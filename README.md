# Leaflet-Amap-Layer

A lightweight plugin for integrating AMap (Gaode Maps) into Leaflet-based web map applications.

## Features

- Seamless integration of AMap into Leaflet
- Support for 11 built-in map styles
- Custom map style support
- Control layer opacity, visibility, and z-index
- Full lifecycle event listening
- Access to native AMap instance for extended operations

## Installation

### Method 1: NPM Installation (Recommended)

**Important:** This package uses peer dependencies. You need to install the required dependencies manually:

```bash
# Install the main package
npm install leaflet-amap-layer

# Install required peer dependencies
npm install leaflet@^1.9.4 @amap/amap-jsapi-loader@^1.0.1
```

### Method 2: Direct HTML Inclusion

```html
<!-- 1. Include dependencies -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/@amap/amap-jsapi-loader@1.0.1/dist/index.js"></script>

<!-- 2. Include the packaged file -->
<script src="https://unpkg.com/leaflet-amap-layer/dist/leaflet-amap-layer.umd.js"></script>
```

## Usage

### NPM Environment

#### Basic Usage

```javascript
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { createAmapLayer } from 'leaflet-amap-layer';

// Create a Leaflet map
const map = L.map('map').setView([39.90960, 116.39722], 10);

// Create AMap layer
const amapLayer = createAmapLayer({
  apiKey: 'your-amap-api-key',
  securityConfig: {
    securityJsCode: 'your-security-js-code'
  },
  amapConfig: {
    mapStyle: 'whitesmoke' // or 'amap://styles/whitesmoke'
  }
});

// Add to map
amapLayer.addTo(map, [39.90960, 116.39722], 10);
```

#### With Built-in Styles

```javascript
import { createAmapLayer, AMAP_STYLES } from 'leaflet-amap-layer';

const amapLayer = createAmapLayer({
  apiKey: 'your-amap-api-key',
  securityConfig: {
    securityJsCode: 'your-security-js-code'
  },
  amapConfig: {
    mapStyle: 'dark' // Use built-in dark style
  }
});

// Dynamically switch styles
amapLayer.setMapStyle('fresh'); // Switch to fresh style

// View all available styles
console.log('Available styles:', AMAP_STYLES);
```

#### Custom Styles

```javascript
const amapLayer = createAmapLayer({
  apiKey: 'your-amap-api-key',
  securityConfig: {
    securityJsCode: 'your-security-js-code'
  },
  amapConfig: {
    mapStyle: 'your-custom-style-url' // Use custom style URL
  }
});
```

### Direct HTML Inclusion

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
</head>
<body>
    <div id="map" style="height: 600px;"></div>

    <!-- 1. Include dependencies -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/@amap/amap-jsapi-loader@1.0.1/dist/index.js"></script>

    <!-- 2. Include the packaged file -->
    <script src="https://unpkg.com/leaflet-amap-layer/dist/leaflet-amap-layer.umd.js"></script>

    <script>
        // 3. Use global variable LeafletAmapLayer
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

Factory function to create an AMap layer instance.

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | `''` | AMap API key (required) |
| `securityConfig` | `object` | `{}` | AMap security configuration |
| `securityConfig.securityJsCode` | `string` | `''` | Security JS code for AMap (optional) |
| `amapConfig` | `object` | `{}` | AMap configuration options |
| `amapConfig.mapStyle` | `string` | `'whitesmoke'` | Map style (built-in or custom URL) |
| `amapConfig.zoomEnable` | `boolean` | `true` | Enable zoom functionality |
| `amapConfig.dragEnable` | `boolean` | `true` | Enable drag functionality |
| `amapConfig.resizeEnable` | `boolean` | `false` | Enable container auto-resize |
| `amapConfig.animateEnable` | `boolean` | `false` | Enable animations |
| `amapConfig.jogEnable` | `boolean` | `false` | Enable jog gesture |
| `minZoom` | `number` | `3` | Minimum zoom level |
| `maxZoom` | `number` | `20` | Maximum zoom level |
| `opacity` | `number` | `1` | Layer opacity (0-1) |
| `visible` | `boolean` | `true` | Layer visibility |
| `zIndex` | `number` | `100` | Layer z-index |

### AmapLayer Instance Methods

#### addTo(map, center, zoom)
Add layer to Leaflet map

**Parameters:**
- `map` (`L.Map`): Leaflet map instance
- `center` (`[number, number]`): Map center `[latitude, longitude]`
- `zoom` (`number`): Initial zoom level

**Returns:** `Promise<void>`

```javascript
await amapLayer.addTo(map, [39.90960, 116.39722], 10);

// Error handling
try {
  await amapLayer.addTo(map, [39.90960, 116.39722], 10);
  console.log('Layer added successfully');
} catch (error) {
  console.error('Failed to add layer:', error);
}
```

#### setVisible(visible)
Set layer visibility

**Parameters:**
- `visible` (`boolean`): Whether to show the layer

```javascript
amapLayer.setVisible(true);  // Show layer
amapLayer.setVisible(false); // Hide layer

// Toggle visibility
const currentState = amapLayer.isLayerLoaded();
amapLayer.setVisible(!currentState);
```

#### setOpacity(opacity)
Set layer opacity

**Parameters:**
- `opacity` (`number`): Opacity value (0-1)

```javascript
amapLayer.setOpacity(0.5);  // Semi-transparent
amapLayer.setOpacity(1);    // Fully opaque
amapLayer.setOpacity(0);    // Fully transparent
```

#### setMapStyle(style)
Set map style

**Parameters:**
- `style` (`string`): Map style name or URL

```javascript
// Use built-in styles
amapLayer.setMapStyle('dark');    // Phantom Black
amapLayer.setMapStyle('light');   // Moonlight Silver
amapLayer.setMapStyle('fresh');   // Grass Green
amapLayer.setMapStyle('whitesmoke'); // Distant Mountains

// Use full style URL
amapLayer.setMapStyle('amap://styles/normal');
amapLayer.setMapStyle('https://your-custom-style-url');
```

#### getMapStyle()
Get current map style

**Returns:** `string`

```javascript
const currentStyle = amapLayer.getMapStyle();
console.log('Current style:', currentStyle);
```

#### getAvailableStyles()
Get all available built-in styles

**Returns:** `object`

```javascript
const styles = amapLayer.getAvailableStyles();
console.log('Available styles:', styles);
// Output: { normal: "amap://styles/normal", dark: "amap://styles/dark", ... }
```

#### setZIndex(zIndex)
Set layer z-index

**Parameters:**
- `zIndex` (`number`): Z-index value

```javascript
amapLayer.setZIndex(100);  // Normal level
amapLayer.setZIndex(1000); // High level (show on top)
amapLayer.setZIndex(1);    // Low level (show at bottom)
```

#### getAmapInstance()
Get native AMap instance

**Returns:** `AMap.Map`

```javascript
const amap = amapLayer.getAmapInstance();

// Use native AMap API
amap.setCenter([116.39722, 39.90960]);
amap.setZoom(12);

// Add native AMap controls
amap.addControl(new AMap.Scale());
amap.addControl(new AMap.ToolBar());
```

#### getCustomLayer()
Get custom layer instance

**Returns:** `L.CustomLayer`

```javascript
const customLayer = amapLayer.getCustomLayer();

// Listen to layer events
customLayer.on('layer-render', (event) => {
  console.log('Layer render completed', event);
});

customLayer.on('layer-mounted', () => {
  console.log('Layer mounted');
});

customLayer.on('layer-destroyed', () => {
  console.log('Layer destroyed');
});
```

#### isLayerLoaded()
Check if layer is loaded

**Returns:** `boolean`

```javascript
if (amapLayer.isLayerLoaded()) {
  console.log('Layer is loaded');
  // Perform operations that require the layer
} else {
  console.log('Layer is not loaded');
}
```

#### destroy()
Destroy layer and clean up resources

```javascript
// Destroy layer
amapLayer.destroy();

// Need to recreate instance after destroy
amapLayer = createAmapLayer(options);
```

### Event Listening

The layer supports full event lifecycle:

```javascript
const amapInstance = amapLayer.getAmapInstance();
const customLayer = amapLayer.getCustomLayer();

// Listen to AMap events
amapInstance.on('complete', () => {
  console.log('Map initialized');
});

amapInstance.on('click', (e) => {
  console.log('Click position:', e.lnglat);
});

// Listen to custom layer events
customLayer.on('layer-render', (e) => {
  const { zoom, center } = e.target;
  console.log(`Render completed: zoom=${zoom}, center=${center}`);
});
```

### Complete Example

```javascript
import { createAmapLayer } from 'leaflet-amap-layer';

// Create map
const map = L.map('map').setView([39.90960, 116.39722], 10);

// Create AMap layer
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
  // Add layer
  await amapLayer.addTo(map, [39.90960, 116.39722], 10);

  // Listen to events
  const amap = amapLayer.getAmapInstance();
  amap.on('click', (e) => {
    console.log('Click coordinates:', e.lnglat);
  });

  // Dynamic controls
  setTimeout(() => {
    amapLayer.setMapStyle('dark');
    amapLayer.setOpacity(0.7);
  }, 3000);

} catch (error) {
  console.error('Initialization failed:', error);
}
```

## Available Built-in Styles

| Style Name | Style ID | English Name | Description |
|------------|----------|--------------|-------------|
| `normal` | `amap://styles/normal` | Standard | Standard map style |
| `dark` | `amap://styles/dark` | Phantom Black | Dark theme, suitable for night use |
| `light` | `amap://styles/light` | Moonlight Silver | Light theme, clean and bright |
| `whitesmoke` | `amap://styles/whitesmoke` | Distant Mountains | Elegant style with reduced visual interference |
| `fresh` | `amap://styles/fresh` | Grass Green | Fresh and natural style |
| `grey` | `amap://styles/grey` | Elegant Grey | Grey tone, business style |
| `graffiti` | `amap://styles/graffiti` | Graffiti | Artistic graffiti style |
| `macaron` | `amap://styles/macaron` | Macaron | Soft color palette |
| `blue` | `amap://styles/blue` | Indigo Blue | Blue theme |
| `darkblue` | `amap://styles/darkblue` | Midnight Blue | Dark blue theme |
| `wine` | `amap://styles/wine` | Wine | Wine color theme |

## Build Files

The `dist` directory contains three formats:

- **`leaflet-amap-layer.js`**: CommonJS format, for Node.js environments
- **`leaflet-amap-layer.esm.js`**: ES Module format, for modern build tools
- **`leaflet-amap-layer.umd.js`**: UMD format, can be used directly in browsers

For detailed usage instructions, see [USAGE.md](./USAGE.md).

## Requirements

- Leaflet v1.9.0 or higher
- AMap API Key and Security JS Code

## Quick Start

1. **Get AMap API Key**: Apply at [AMap Open Platform](https://lbs.amap.com/)

2. **Create map**:
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

3. **View example**: See `example.html` file

## Chinese Documentation

For Chinese documentation, please see [README.zh.md](./README.zh.md).

## License

MIT