/**
 * Created by liu on 2014/7/28.
 */

dojo.require("dojo/parser");
var map;

function init() {
   alert("1");
    var parser=new
    parser.parse();

    map = new esri.Map("map", {
        basemap: "topo",
        center: [-116.093, 34.218],
        zoom: 7
    });


    var scalebar = new esri.dijit.Scalebar({
        map: map,
        // "dual" displays both miles and kilmometers
        // "english" is the default, which displays miles
        // use "metric" for kilometers
        scalebarUnit: "dual"
    });
}

dojo.ready(init);
