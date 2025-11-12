import L from "leaflet";
import "./Leaflet.CustomLayer.js";
import AMapLoader from "@amap/amap-jsapi-loader";

/**
 * 高德地图内置样式
 */
const AMAP_STYLES = {
  /** 标准 */
  normal: "amap://styles/normal",
  /** 幻影黑 */
  dark: "amap://styles/dark",
  /** 月光银 */
  light: "amap://styles/light",
  /** 远山黛 */
  whitesmoke: "amap://styles/whitesmoke",
  /** 草色青 */
  fresh: "amap://styles/fresh",
  /** 雅士灰 */
  grey: "amap://styles/grey",
  /** 涂鸦 */
  graffiti: "amap://styles/graffiti",
  /** 马卡龙 */
  macaron: "amap://styles/macaron",
  /** 靛青蓝 */
  blue: "amap://styles/blue",
  /** 极夜蓝 */
  darkblue: "amap://styles/darkblue",
  /** 酱籽 */
  wine: "amap://styles/wine",
};

/**
 * 默认配置
 */
const DEFAULT_CONFIG = {
  minZoom: 3,
  maxZoom: 20,
  opacity: 1,
  visible: true,
  zIndex: 100,
  apiKey: "",
  securityConfig: {
    securityJsCode: "",
  },
  amapConfig: {
    zoomEnable: true,
    dragEnable: true,
    resizeEnable: false,
    animateEnable: false,
    jogEnable: false,
    mapStyle: "amap://styles/whitesmoke",
  },
};

/**
 * 高德地图图层类
 * 基于 Leaflet.CustomLayer 封装高德地图集成
 */
class AmapLayer {
  constructor(options = {}) {
    this.map = null;
    this.customLayer = null;
    this.amapInstance = null;
    this.amapContainer = null;
    this.isLoaded = false;
    this.resizeHandler = null;
    this.options = Object.assign({}, DEFAULT_CONFIG, options);
  }

  /**
   * 添加到地图
   * @param map Leaflet地图实例
   * @param center 地图中心点 [lat, lng]
   * @param zoom 初始缩放级别
   */
  async addTo(map, center, zoom) {
    if (this.isLoaded) {
      console.warn("AmapLayer is already loaded");
      return;
    }

    try {
      this.map = map;
      await this.loadAmapSDK();
      this.createAmapContainer();
      this.initCustomLayer();
      this.initAmap(center, zoom);
      this.setupEventListeners();
      this.isLoaded = true;
    } catch (error) {
      console.error("Failed to add AmapLayer:", error);
      throw error;
    }
  }

  /**
   * 加载高德地图SDK
   */
  async loadAmapSDK() {
    try {
      // 如果已经加载过，直接返回
      if (window.AMap) {
        return;
      }

      // 设置安全配置
      window._AMapSecurityConfig = this.options.securityConfig;

      // 使用 npm 包加载高德地图JS API
      await AMapLoader.load({
        key: this.options.apiKey,
        version: "2.0",
        plugins: [],
      });
    } catch (error) {
      console.error("高德地图 SDK 加载失败:", error);
      throw error;
    }
  }

  /**
   * 创建高德地图容器
   */
  createAmapContainer() {
    this.amapContainer = document.createElement("div");
    this.amapContainer.id = `amap-container-${Date.now()}`;

    // 获取 Leaflet 地图容器的实际尺寸
    const mapContainer = this.map?.getContainer();
    if (!mapContainer) {
      throw new Error("Map container not found");
    }

    const containerRect = mapContainer.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    // 设置容器样式，确保尺寸与 Leaflet 地图容器一致
    Object.assign(this.amapContainer.style, {
      position: "absolute",
      width: width + "px",
      height: height + "px",
      pointerEvents: "none",
      zIndex: "-1", // 确保在地图下层但可见
    });

    // 先添加到 body
    document.body.appendChild(this.amapContainer);

    // 创建窗口大小变化处理器
    this.resizeHandler = () => {
      if (this.amapContainer && this.map) {
        const mapContainer = this.map.getContainer();
        if (mapContainer) {
          const rect = mapContainer.getBoundingClientRect();

          // 更新容器位置和尺寸
          Object.assign(this.amapContainer.style, {
            width: rect.width + "px",
            height: rect.height + "px",
          });

          // 如果高德地图实例存在，重新调整大小
          if (this.amapInstance) {
            this.amapInstance.getSize();
            this.amapInstance.setFitView();
          }
        }
      }
    };

    // 监听窗口大小变化和地图移动
    window.addEventListener("resize", this.resizeHandler);

    // 确保容器有正确的尺寸
    setTimeout(() => {
      if (this.resizeHandler) {
        this.resizeHandler();
      }
    }, 0);
  }

  /**
   * 初始化自定义图层
   */
  initCustomLayer() {
    if (!this.amapContainer || !L.customLayer) {
      throw new Error("Custom layer not available or container not created");
    }

    this.customLayer = L.customLayer({
      container: this.amapContainer,
      minZoom: this.options.minZoom,
      maxZoom: this.options.maxZoom,
      opacity: this.options.opacity,
      visible: this.options.visible,
      zIndex: this.options.zIndex,
    });

    this.setupCustomLayerEvents();
  }

  /**
   * 设置自定义图层事件
   */
  setupCustomLayerEvents() {
    if (!this.customLayer) return;

    this.customLayer.on("layer-render", (e) => {
      if (this.amapInstance && e.target._zoom && e.target._center) {
        const zoom = e.target._zoom;
        const center = [e.target._center.lng, e.target._center.lat];
        this.amapInstance.setZoomAndCenter(zoom, center, true);
      }
    });

    this.customLayer.on("layer-mounted", () => {
      // console.log('AmapLayer mounted')
    });

    this.customLayer.on("layer-destroyed", () => {
      // console.log('AmapLayer destroyed')
    });
  }

  /**
   * 初始化高德地图实例
   */
  initAmap(center, zoom) {
    if (!window.AMap || !this.amapContainer) {
      throw new Error("AMap SDK not loaded or container not available");
    }

    this.options.amapConfig = Object.assign(
      {},
      DEFAULT_CONFIG.amapConfig,
      this.options.amapConfig
    );
    // 设置地图样式
    if (this.options.amapConfig?.mapStyle) {
      this.options.amapConfig.mapStyle = this.convertMapStyleName(
        this.options.amapConfig.mapStyle
      );
    }
    this.amapInstance = new window.AMap.Map(this.amapContainer.id, {
      ...this.options.amapConfig,
      resizeEnable: false,
      viewMode: "2D",
    });

    // 设置地图中心点和缩放级别
    const position = new window.AMap.LngLat(center[1], center[0]);
    this.amapInstance.setCenter(position);
    this.amapInstance.setZoom(zoom);

    // 添加自定义图层到地图
    this.customLayer.addTo(this.map);
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 可以在这里添加其他事件监听器
  }

  /**
   * 设置图层可见性
   */
  setVisible(visible) {
    if (this.customLayer) {
      if (visible) {
        this.customLayer.show();
      } else {
        this.customLayer.hide();
      }
    }
  }

  /**
   * 设置图层透明度
   */
  setOpacity(opacity) {
    if (this.customLayer) {
      this.customLayer.setOpacity(opacity);
    }
  }

  convertMapStyleName(style) {
    return style in AMAP_STYLES ? AMAP_STYLES[style] : style;
  }

  /**
   * 设置高德地图样式
   * @param style 地图样式，可以是内置样式名或自定义样式URL
   */
  setMapStyle(style) {
    if (this.amapInstance) {
      // 检查是否为内置样式名称
      const styleUrl = this.convertMapStyleName(style);

      if (styleUrl) {
        this.amapInstance.setMapStyle(styleUrl);
        // 同时更新配置中的样式
        if (this.options.amapConfig) {
          this.options.amapConfig.mapStyle = style;
        }
      }
    }
  }

  /**
   * 获取当前地图样式
   */
  getMapStyle() {
    return this.options.amapConfig?.mapStyle;
  }

  /**
   * 获取所有可用的内置样式
   */
  getAvailableStyles() {
    return AMAP_STYLES;
  }

  /**
   * 设置图层z-index
   */
  setZIndex(zIndex) {
    if (this.customLayer) {
      this.customLayer.setZIndex(zIndex);
    }
  }

  /**
   * 获取高德地图实例
   */
  getAmapInstance() {
    return this.amapInstance;
  }

  /**
   * 获取自定义图层实例
   */
  getCustomLayer() {
    return this.customLayer;
  }

  /**
   * 销毁图层
   */
  destroy() {
    if (this.customLayer) {
      this.customLayer.remove();
      this.customLayer = null;
    }

    if (this.amapInstance) {
      this.amapInstance.destroy();
      this.amapInstance = null;
    }

    // 移除事件监听器
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);

      // 移除地图事件监听器
      if (this.map) {
        this.map.off("move", this.resizeHandler);
        this.map.off("zoom", this.resizeHandler);
      }

      this.resizeHandler = null;
    }

    if (this.amapContainer && this.amapContainer.parentNode) {
      this.amapContainer.parentNode.removeChild(this.amapContainer);
      this.amapContainer = null;
    }

    this.map = null;
    this.isLoaded = false;
  }

  /**
   * 检查图层是否已加载
   */
  isLayerLoaded() {
    return this.isLoaded;
  }
}

/**
 * 创建高德地图图层的工厂函数
 */
function createAmapLayer(options) {
  return new AmapLayer(options);
}

export { AmapLayer, createAmapLayer, AMAP_STYLES };
