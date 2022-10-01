import Bridges from "./bridges/index.js";
import Provinces from "./provinces/index.js";
import Ways from "./ways/index.js";
import Cities from "./cities/index.js";
import * as Icon from "./icons/index.js";
require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
], function (esriConfig, Map, MapView, Graphic, GraphicsLayer) {
  const map = new Map({
    basemap: "topo-vector",
  });
  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 8,
    center: [106.10183715820308, 10.583671721437], // longitude, latitude 10.8811081,106.7976408
  });
  const graphicsLayer = new GraphicsLayer();

  const withProvince = (data) => {
    return new Graphic({
      geometry: { type: "polygon", rings: data.rings },
      symbol: { type: "simple-fill", color: data.color },
      attributes: data,
      popupTemplate: {
        title: "{title}",
        content: "<a>Dân số: {population} <br> Diện tích: {area}</a>",
      },
    });
  };

  const widthBridge = (data) => {
    return new Graphic({
      symbol: {
        type: "picture-marker",
        url: Icon.bridgeIcon,
        width: "48px",
        height: "48px",
      },
      geometry: { type: "point", ...data },
      attributes: data,
      popupTemplate: {
        title: "Cầu {title}",
        content: "<a>Toạ độ: {longitude}, {latitude}</a>",
      },
    });
  };

  const withWay = (data) => {
    return new Graphic({
      symbol: { type: "simple-line", color: data.color, width: 3 },
      attributes: { description: data.description },
      popupTemplate: { title: "{description}" },
      geometry: { type: "polyline", paths: data.paths },
    });
  };

  const withCity = (data) => {
    return new Graphic({
      symbol: {
        type: "picture-marker",
        url: Icon.cityIcon,
        width: "30px",
        height: "30px",
      },
      geometry: { type: "point", ...data },
      attributes: data,
      popupTemplate: {
        title: "Thành Phố {title}",
        content: "<a>Toạ độ: {longitude}, {latitude}</a>",
      },
    });
  };

  // tỉnh
  Provinces.forEach((province) => {
    graphicsLayer.add(withProvince(province));
  });

  // cầu
  Bridges.forEach((bridge) => {
    graphicsLayer.add(widthBridge(bridge));
  });

  // đường
  Ways.forEach((way) => {
    graphicsLayer.add(withWay(way));
  });

  // thành phố
  Cities.forEach((city) => {
    graphicsLayer.add(withCity(city));
  });

  map.add(graphicsLayer);
});
