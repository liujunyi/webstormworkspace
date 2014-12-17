define(
[],
function() {
  var config = {
    bingMapsKey:"",   
    helperServices: {
       geometry:{
        url: location.protocol + "//esrisy.arcgiscloud.com:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer"
       },
       printTask: {
        url: location.protocol + "//esrisy.arcgiscloud.com:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
       },
       geocode: [{
        url: location.protocol + "//192.168.1.141:6080/arcgis/rest/services/ChineseAddress/GeocodeServer"
       }]
    }
};
  
  // could use a has() test to optionally populate some global
  // property so that the stuff defined is in some global identifier
  //
  // instead, just populate a global, will need to remove the next line when
  // when we remove support for loading modules with dojo.require
  // which will be when we move to Dojo 2.0
  commonConfig = config;
  // instead of using a global, this should probably be added to some namespace...
  // do the templates have a common namespace that they use?

  return config;  
});
