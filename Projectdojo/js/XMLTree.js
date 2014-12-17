/**
 * Created by Administrator on 2014/12/17.
 */
dojo.require("dojo.data.ItemFileReadStore");
dojo.require( "dijit.Tree" );
dojo.require("dojo/store/Memory");
dojo.require("dijit/tree/ObjectStoreModel");
dojo.require("dojo/json");
dojo.require("dijit/tree/ForestStoreModel");
function XML() {
    var store = new dojox.data.XmlStore({url: "City/ProvinceAndCity.xml", label: "name"});
    var treeModel = new dijit.tree.ForestStoreModel({
        store: store,
        query: {"type": "name"},
        rootId: "China",
        rootLabel: "China",
        childrenAttrs: ["Province","City","Area"]
    });

    var tree = new dijit.Tree({model: treeModel}).placeAt(dojo.byId("query")).startup();



    dojo.connect(tree, "onClick", function (item) {

        console.log(store.getValue(item, "name") + " " + store.getLabel(item));

    });





}
dojo.ready(XML);