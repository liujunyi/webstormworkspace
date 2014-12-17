/**
 * Created by liu on 2014/12/13.
 */
dojo.require("esri/toolbars/navigation");
var navToolbar = new esri.toolbars.Navigation(Map);
function InitExtent() {
    var initialExtent = new esri.geometry.Extent({"xmin": 73.29004742486129, "ymin": 25.515667135002822,
        "xmax": 169.5392451106961, "ymax": 71.79618369840176, "spatialReference": {"wkid": 4326}});
    Map.setExtent(initialExtent);

}
function ZoomIn() {
    var extent = Map.extent;
    Map.setExtent(extent.expand(0.5));

}
function ZoomOut() {
    var extent = Map.extent;
    Map.setExtent(extent.expand(2));

}
function Length() {


}