/**
 * Created by liu on 2014/12/14.
 */
var Map;
var xmlStore;
var graphicsLayer = new esri.layers.GraphicsLayer();
require([
    "dojo/ready",
    "esri/map",
    "dijit/form/ComboBox",
    "dojox/data/XmlStore",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/toolbars/navigation",
    "dojo/parser",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "dijit/registry"
], function (  ready) {
    ready(function(){


        Map = new esri.Map("map",{logo:false});
        var tiledlayer=new esri.layers.ArcGISTiledMapServiceLayer("http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer");
        var dynamiclayer=new esri.layers.ArcGISDynamicMapServiceLayer("http://localhost:6080/arcgis/rest/services/JsMap/MapServer");
        Map.addLayer(tiledlayer);
        Map.addLayer(dynamiclayer);
        var initialExtent = new esri.geometry.Extent({"xmin":73.29004742486129,"ymin": 25.515667135002822,"xmax":169.5392451106961,"ymax":71.79618369840176,"spatialReference":{"wkid":4326}});
        Map.extent=initialExtent;
        graphicsLayer = new esri.layers.GraphicsLayer();
        Map.addLayer(graphicsLayer);



    });
});