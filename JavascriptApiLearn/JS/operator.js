/**
 * Created by liu on 2014/6/12.
 */
function  test() {
    var myTiledMapServiceLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://localhost:6080/arcgis/rest/services/ChinaMap/MapServer");
    myMap.addLayer(myTiledMapServiceLayer);
    alert("已经添加");
}