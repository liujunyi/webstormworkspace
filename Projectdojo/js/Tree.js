/**
 * Created by Administrator on 2014/12/15.
 */
dojo.require("esri.map");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.dijit.PopupTemplate");
dojo.require("dojo.number");
dojo.require("esri/graphic");
/*dojo.require("esri/Graphic");*/
dojo.require("esri/tasks/FeatureSet");
dojo.require("esri/geometry/jsonUtils");

var tree;
require([
    "dojo/aspect", "dojo/ready", "dojo/_base/window", "dojo/store/Memory", "dojo/store/Observable",
    "dijit/Tree", "dijit/tree/ObjectStoreModel", "dijit/tree/dndSource"
], function(aspect, ready, win, Memory, Observable, Tree, ObjectStoreModel, dndSource){

    // Create test store, adding the getChildren() method required by ObjectStoreModel,
    // and making put(child, {parent: parent}) work
    var memoryStore = new Memory({
        data: [
            { id: 'world', name:'The earth', type:'planet', population: '6 billion'},
            { id: 'AF', name:'Africa', type:'continent', population:'900 million', area: '30,221,532 sq km',
                timezone: '-1 UTC to +4 UTC', parent: 'world'},
            { id: 'EG', name:'黑龙江', type:'country', parent: 'AF' },
            { id: 'KE', name:'Kenya', type:'country', parent: 'AF' },
            { id: 'Nairobi', name:'Nairobi', type:'city', parent: 'KE' },
            { id: 'Mombasa', name:'Mombasa', type:'city', parent: 'KE' },
            { id: 'SD', name:'Sudan', type:'country', parent: 'AF' },
            { id: 'Khartoum', name:'Khartoum', type:'city', parent: 'SD' },
            { id: 'AS', name:'Asia', type:'continent', parent: 'world' },
            { id: 'CN', name:'China', type:'country', parent: 'AS' },
            { id: 'IN', name:'India', type:'country', parent: 'AS' },
            { id: 'RU', name:'Russia', type:'country', parent: 'AS' },
            { id: 'MN', name:'Mongolia', type:'country', parent: 'AS' },
            { id: 'OC', name:'Oceania', type:'continent', population:'21 million', parent: 'world'},
            { id: 'AU', name:'Australia', type:'country', population:'21 million', parent: 'OC'},
            { id: 'EU', name:'Europe', type:'continent', parent: 'world' },
            { id: 'DE', name:'Germany', type:'country', parent: 'EU' },
            { id: 'FR', name:'France', type:'country', parent: 'EU' },
            { id: 'ES', name:'Spain', type:'country', parent: 'EU' },
            { id: 'IT', name:'Italy', type:'country', parent: 'EU' },
            { id: 'NA', name:'North America', type:'continent', parent: 'world' },
            { id: 'MX', name:'Mexico', type:'country',  population:'108 million', area:'1,972,550 sq km',
                parent: 'NA' },
            { id: 'Mexico City', name:'Mexico City', type:'city', population:'19 million', timezone:'-6 UTC', parent: 'MX'},
            { id: 'Guadalajara', name:'Guadalajara', type:'city', population:'4 million', timezone:'-6 UTC', parent: 'MX' },
            { id: 'CA', name:'Canada', type:'country',  population:'33 million', area:'9,984,670 sq km', parent: 'NA' },
            { id: 'Ottawa', name:'Ottawa', type:'city', population:'0.9 million', timezone:'-5 UTC', parent: 'CA'},
            { id: 'Toronto', name:'Toronto', type:'city', population:'2.5 million', timezone:'-5 UTC', parent: 'CA' },
            { id: 'US', name:'United States of America', type:'country', parent: 'NA' },
            { id: 'SA', name:'South America', type:'continent', parent: 'world' },
            { id: 'BR', name:'Brazil', type:'country', population:'186 million', parent: 'SA' },
            { id: 'AR', name:'Argentina', type:'country', population:'40 million', parent: 'SA' }
        ],
        getChildren: function(object){
            return this.query({parent: object.id});
        }
    });
    aspect.around(memoryStore, "put", function(originalPut){
        // To support DnD, the store must support put(child, {parent: parent}).
        // Since memory store doesn't, we hack it.
        // Since our store is relational, that just amounts to setting child.parent
        // to the parent's id.
        return function(obj, options){
            if(options && options.parent){
                obj.parent = options.parent.id;
            }
            return originalPut.call(memoryStore, obj, options);
        }
    });

    // Wrap the store in Observable so that updates to the store are reflected to the Tree
    var observableStore = new Observable(memoryStore);

    // Create the model
    var myModel = new ObjectStoreModel({
        store: observableStore,
        query: {id: 'world'}
    });

    // After DOM is loaded and dijit infrastructure has finished initializing, create Tree
    ready(function(){
        (tree=new Tree({

            model: myModel,
            dndController: dndSource
        })).placeAt(dojo.byId("locate")).startup();

        tree.connect(tree, 'onClick', clickTreeNode);
    });
    function clickTreeNode(item/*点中节点对应的数据项*/, node/*点中的对象，这里node.item就是的第一个参数*/,evt/*事件*/)
    {

      //  console.log(item);
      //  console.log(node);
        LocalCity(item.name);
        //console.log(evt);
    }

    function LocalCity(cityname) {

        if (cityname != "") {

            var queryTask = new esri.tasks.QueryTask("http://localhost:6080/arcgis/rest/services/JsMap/MapServer/9");

            var query3 = new esri.tasks.Query();
            query3.returnGeometry = true;
            query3.outFields = ["*"];
            query3.where="NAME like  '"+cityname+"'";
            query3.text = cityname;

            queryTask.execute(query3, showResults);
            function showResults(results)
            {
                graphicsLayer.clear();

                var polySymbolBlue = new esri.symbol.SimpleFillSymbol();
                polySymbolBlue.setOutline(new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([0, 0, 0, 0.5]), 1));
                polySymbolBlue.setColor(new esri.Color([0, 0, 255, 0.7]));
                var resultItems = [];
                var resultCount = results.features.length;
                for (var i = 0; i < resultCount; i++) {

                    var graphic = results.features[i];
                    graphic.setSymbol(polySymbolBlue);
                    graphicsLayer.add(graphic);

                }
                Map.setExtent(esri.graphicsExtent(results.features));
                Map.addLayer(graphicsLayer);
            }
        }


    }
});

