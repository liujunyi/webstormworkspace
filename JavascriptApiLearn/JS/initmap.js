dojo.require("esri.map");
dojo.require("esri/tasks/query");
dojo.require("esri/tasks/QueryTask");
dojo.require("esri/layers/GraphicsLayer");
dojo.require("esri/symbols/SimpleFillSymbol");
dojo.require("dojo.dom");
dojo.require("esri/tasks/FeatureSet");
dojo.require("esri/Color");
dojo.require("esri/geometry/Extent");
var myMap;
function init() {
     myMap = new esri.Map("mapDiv");
    var myTiledMapServiceLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://localhost:6080/arcgis/rest/services/ChinaMap/MapServer");
    myMap.addLayer(myTiledMapServiceLayer);
}
dojo.addOnLoad(init);

function SearchBtn(){

    var queryTask = new esri.tasks.QueryTask("http://localhost:6080/arcgis/rest/services/ChinaMap/MapServer/0");

    var query3 = new esri.tasks. Query();
    query3.returnGeometry =true;
    query3.outFields = ["*"];

    query3.text = document.getElementById("search").value;
    queryTask.execute(query3, showResults);
    function showResults (results)
    {
        var graphicsLayer = new esri.layers.GraphicsLayer();
        var polySymbolBlue = new esri.symbol.SimpleFillSymbol();
        polySymbolBlue.setOutline(new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([0,0,0,0.5]), 1));
        polySymbolBlue.setColor(new esri.Color([0,0,255,0.7]));
        var resultItems = [];
        var resultCount = results.features.length;
        for (var i = 0; i < resultCount; i++) {

            var graphic = results.features[i];
            graphic.setSymbol(polySymbolBlue);
            graphicsLayer.add(graphic);

        }
       myMap.setExtent(esri.graphicsExtent(results.features));
      myMap.addLayer(graphicsLayer);

    }
}