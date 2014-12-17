dojo.require("esri.map");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.dijit.PopupTemplate");
dojo.require("dojo.number");
dojo.require("esri/graphic");
dojo.require("esri/Graphic");
dojo.require("esri/tasks/FeatureSet");
dojo.require("esri/geometry/jsonUtils");
var map;

var graphicsLayer = new esri.layers.GraphicsLayer();


var myData = [
    ['黑龙江', '1/1 12:00am', 71.72, 'Up', 0.02, 0.03, '9/1 12:00am'],
    ['内蒙古', '1/1 12:00am', 29.01, 'Up', 0.42, 1.47, '9/1 12:00am'],
    ['辽宁', '1/1 12:00am', 83.81, 'Up', 0.28, 0.34, '9/1 12:00am'],
    ['吉林', '1/1 12:00am', 52.55, 'Up', 0.01, 0.02, '9/1 12:00am'],
    ['北京', '1/1 12:00am', 64.13, 'Up', 0.31, 0.49, '9/1 12:00am']
];
var store = Ext.create('Ext.data.ArrayStore', {
    fields: [
        {
            name: 'company'
        },
        {
            name: 'firstChange',
            type: 'date',
            dateFormat: 'n/j h:ia'
        },
        {
            name: 'price',
            type: 'float'
        },
        {
            name: 'stock'
        },
        {
            name: 'change',
            type: 'float'
        },
        {
            name: 'pctChange',
            type: 'float'
        },
        {
            name: 'lastChange',
            type: 'date',
            dateFormat: 'n/j h:ia'
        }
    ],
    data: myData
});
function init() {
    var viewport = new Ext.Viewport({
        layout: "fit",
        title: "EXT JS Layout",
        items: [
            {
                layout: "border",
                items: [
                    {
                        region: "center",

                        title: "地图展示",
                        html: "<div id='map' style='height:100%; width:100%;z-index=: 1000;'></div>"
                    },
                    {
                        region: "north",
                        height: 80,
                        collapsible: false,
                        contentEl: "header"
                    },
                    {

                        title: "数据信息",
                        id:"MyCitydata",
                        region: "south",
                        height: 200,
                        contentEl: "footer", // this gets the content from the div named "footer"
                        collapsible: true,
                        collapsed: true,
                        xtype: 'gridpanel',
                        frame: true,

                        columns: [
                            {
                                id: 'company',
                                header: "城市名称",
                                width: 160,
                                sortable: true,
                                dataIndex: 'NAME'
                            },
                            {

                                header: "GDP",
                                width: 100,
                                sortable: true,
                                dataIndex: 'GDP'
                            },
                            {
                                header: "人口",
                                width: 75,
                                sortable: true,
                                dataIndex: 'Popu'
                            },
                            {
                                header: "男性人口",
                                width: 75,
                                sortable: true,
                                dataIndex: 'popu_1'
                            },
                            {
                                header: "农业产值",
                                width: 75,
                                sortable: true,
                                dataIndex: 'gg'
                            }
                        ],
                        listeners: {
                            collapse: resizeMap,
                            expand: resizeMap
                        }
                    },
                    {
                        region: "west",
                        title: "功能面板",
                        width: 250,
                        split: true,
                        layout: 'accordion',
                        collapsible: true,
                        items: [
                            {
                                title: '查询功能面板',
                                id: 'newpanel',
                                xtype: 'panel',
                                border: true,
                                iconCls: 'settings',
                                items: [
                                    {
                                        id: 'Search',
                                        xtype: 'textfield',
                                        name: 'Search',
                                        fieldLabel: '查询'
                                    },
                                    {
                                        xtype: 'button',
                                        text: '定位',
                                        handler: function () {
                                            var queryTask = new esri.tasks.QueryTask("http://localhost:6080/arcgis/rest/services/China/MapServer/0");

                                            var query3 = new esri.tasks.Query();
                                            query3.returnGeometry = true;
                                            query3.outFields = ["*"];

                                            query3.text = Ext.getCmp("Search").getValue();

                                            queryTask.execute(query3, showResults);
                                            function showResults(results) {
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
                                                map.setExtent(esri.graphicsExtent(results.features));
                                                map.addLayer(graphicsLayer);
                                            }

                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'test',
                                        handler: function () {
                                            var queryTask = new esri.tasks.QueryTask("http://localhost:6080/arcgis/rest/services/China/MapServer/0");

                                            var query3 = new esri.tasks.Query();
                                            query3.returnGeometry = true;
                                            query3.outFields = ["*"];

                                          query3.where="OBJECTID<3";

                                            queryTask.execute(query3, showResults);
                                            function showResults(results) {
                                                var featureJSON = dojo.toJson(results.toJson());
                                                var polySymbolBlue = new esri.symbol.SimpleFillSymbol();
                                                polySymbolBlue.setOutline(new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([0, 0, 0, 0.5]), 1));
                                                polySymbolBlue.setColor(new esri.Color([0, 0, 255, 0.7]));
                                                var obj = JSON.parse(featureJSON);
                                                var FT=new esri.tasks.FeatureSet(obj);

                                                var resultCount = FT.features.length;
                                                for (var i = 0; i < resultCount; i++) {

                                                    var graphic = FT.features[i];
                                                    graphic.setSymbol(polySymbolBlue);
                                                    graphicsLayer.add(graphic);

                                                }
                                                map.setExtent(esri.graphicsExtent(FT.features));
                                                map.addLayer(graphicsLayer);



                                            }

                                        }
                                    },
                                    {

                                        xtype: 'button',
                                        text: '清除',
                                        handler: function () {

                                            graphicsLayer.clear();

                                        }

                                    }
                                ]
                            },
                            {
                                title: '统计功能面板',
                                id: 'countpanel',
                                xtype: 'panel',
                                border: false,
                                iconCls: 'nav',
                                items: [
                                    {
                                        xtype: 'combobox',
                                        fieldLabel: '选择统计省份',
                                        maxWidth: 100,
                                        displayField: 'company',
                                        store: store,
                                        listeners: {
                                            select: function () {


                                                var Pro = this.value;

                                                var queryTask = new esri.tasks.QueryTask("http://localhost:6080/arcgis/rest/services/China/MapServer/0");

                                                var query3 = new esri.tasks.Query();
                                                query3.returnGeometry = true;
                                                query3.outFields = ["NAME","GDP","Popu","popu_1","gg"];
                                                query3.where = "所属省= '" + Pro + "'";

                                                //获取统计只方案
                                                /*      var statisticDefinition = new esri.tasks.StatisticDefinition();
                                                 statisticDefinition.statisticType = "sum";
                                                 statisticDefinition.onStatisticField = "Popu";
                                                 statisticDefinition.outStatisticFieldName = "TotalPopu";

                                                 query3.outStatistics = [statisticDefinition];*/
                                                queryTask.execute(query3, showResults);
                                                function showResults(results) {

                                                    alert(sumPopulation(results.features));
                                                }


                                            }

                                        }
                                    },
                                    {



                                    }
                                ]
                            },
                            {
                                title: '分析功能面板',
                                id: 'analysispanel',
                                xtype: 'panel',
                                iconCls: 'info',
                                border: false,
                                items: [
                                    {

                                    },
                                    {



                                    }
                                ]
                            }


                        ],
                        listeners: {
                            collapse: resizeMap,
                            expand: resizeMap
                        }
                    },
                    {
                        region: "east",
                        width: 200,
                        collapsible: true,
                        xtype: 'tabpanel',
                        title: "图表面板",
                        activeTab: 0, // index or id
                        items: [
                            {
                                title: 'Tab 1',
                                html: 'This is tab 1 content.'
                            },
                            {
                                title: 'Tab 2',
                                html: 'This is tab 2 content.'
                            },
                            {
                                title: 'Tab 3',
                                html: 'This is tab 3 content.'
                            }
                        ],
                        listeners: {
                            collapse: resizeMap,
                            expand: resizeMap
                        }
                    }
                ]
            }
        ]
    });

    map = new esri.Map("map");

    var template = new esri.dijit.PopupTemplate({
        title: "Geologic Outcrop",
        description: "{lithology_type} with the following metamorphic facies: {metamorphic_facies}"
    });
    var myTiledMapServiceLayer = new esri.layers.ArcGISTiledMapServiceLayer("http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer");
    var myDynamicLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://localhost:6080/arcgis/rest/services/China/MapServer");
    map.addLayer(myTiledMapServiceLayer);
    map.addLayer(myDynamicLayer);

    var initExtent = new esri.geometry.Extent(
        {
            'xmin': 8176604,
            'ymin': 2056696,
            'xmax': 15025401.085,
            'ymax': 7081897,
            'spatialReference': { 'wkid': 102100}
        });
    map.setExtent(initExtent);
}
function sumPopulation(features) {
    var popTotal = 0;
    for (var x = 0; x < features.length; x++) {
        popTotal = popTotal + features[x].attributes["Popu"];
    }
    return popTotal;
}
function resizeMap() {
    map.resize();
}
dojo.ready(init);