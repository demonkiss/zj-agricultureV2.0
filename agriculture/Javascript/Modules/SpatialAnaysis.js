define(function () {
    // initTablePage();
    /*空间分析*/
    function GetSpatialParams() {
        var param = new Object();
        var queryPara = new Object();
        var rk_url = "http://21.15.121.30/ArcGIS/rest/services/JJ_RK/MapServer/0";
        var jz_url = "http://21.15.121.129/ArcGIS/rest/services/DGRH/MapServer/23";
        var url = [];
        url.push(rk_url);
        url.push(jz_url);
        param.layer_url = url;
        return param;
    }
    var SpatialAnalysis = function SpatialAnalysis(polygon) {
        $("#Total_sum").css("display", "block");
        map.graphics.clear();

        require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/graphic", "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol", "esri/Color"], function (Query, QueryTask, Graphic, SimpleLineSymbol, SimpleFillSymbol, Color) {

            var P_symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
    new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
            var draw_polygon = new Graphic(polygon, P_symbol);
            map.graphics.add(draw_polygon);
            Draw_PolygonArea(polygon);


            var params = GetSpatialParams();
            for (var i = 0; i < params.layer_url.length; i++) {
                var url = params.layer_url[i];
                var queryTask = new QueryTask(url)
                var query = new Query();
                query.geometry = polygon;
                query.outFields = ["*"];
                query.returnGeometry = true;
                queryTask.on("complete", SpatialResults)
                queryTask.execute(query);
            }
        });


    }
    function SpatialResults(results) {
        var features = results.featureSet.features;
        if (results.target.url == "http://21.15.121.30/ArcGIS/rest/services/JJ_RK/MapServer/0") {
            var pop_sum = features.length;
            var men = 0;
            var women = 0;
            var cz_rk = 0;
            var zz_rk = 0;
            for (var i = 0; i < features.length; i++) {
                var sex = features[i].attributes["XB"];
                var rk_type = features[i].attributes["TYPE_"];
                if (sex == "男") {
                    men++;
                } else if (sex == "女") {
                    women++;
                }
                if (rk_type == "暂住人口") {
                    zz_rk++;

                } else if (rk_type == "常住人口") {
                    cz_rk++;
                }
            }
            $(".pop_sum").html(pop_sum + "人");
            $(".men_sum").html(men + "人");
            $(".women_sum").html(women + "人");
            $(".cz_sum").html(cz_rk + "人");
            $(".zz_sum").html(zz_rk + "人");
        }
        else if (results.target.url == "http://21.15.121.129/ArcGIS/rest/services/DGRH/MapServer/23") {
            var arc_area = 0.0;
            var arc_sum = features.length;
            var arc_landarea = 0;
            for (var i = 0; i < features.length; i++) {
                var area = features[i].attributes["BUILDAREA"];
                var landarea = features[i].attributes["LANDAREA"];
                arc_area = arc_area + area;
                arc_landarea = arc_landarea + landarea;
            }
            arc_area = arc_area.toFixed(2);
            arc_landarea = arc_landarea.toFixed(2);
            $(".arc_landarea").html(arc_landarea + "平方米");
            $(".arc_area").html(arc_area + "平方米");
            $(".arc_sum").html(arc_sum + "个");
        }



    }
    function Draw_PolygonArea(geometry) {
        require(["esri/tasks/AreasAndLengthsParameters", "esri/tasks/GeometryService"], function (AreasAndLengthsParameters, GeometryService) {
            var gsvc = new GeometryService("http://21.15.246.229:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer");
            // var gsvc = new GeometryService("http://21.15.121.129/arcgis/rest/services/Utilities/Geometry/GeometryServer");
            var areasAndLengthParams = new AreasAndLengthsParameters();
            areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
            areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_METERS;
            gsvc.simplify([geometry], function (simplifiedGeometries) {
                areasAndLengthParams.polygons = simplifiedGeometries;
                gsvc.areasAndLengths(areasAndLengthParams);
            });
            gsvc.on("areas-and-lengths-complete", outputAreaAndLength);
            function outputAreaAndLength(evtObj) {
                var result = evtObj.result;
                var content = result.areas[0].toFixed(2) + "平方米";
                $(".draw_area").html(content);
            };
        });
    }
    var hasf = 0;
    /*初始化统计表格页面*/
    var initTablePage = function initTablePage() {

        //1.初始化Table
        // var oTable = new TableInit($("#Table_data"));
        //  oTable.Init();
        $("#Query_layer").on("click", function () {

            var layerName = $("#Layer_Select select").val();
            var districtVal = $("#District_Select select").val();
            var typeVal = $("#Type_Select select").val();
            var areaVal = $("#Area_Select input").val();
            if (areaVal) {
                require(["esri/layers/FeatureLayer", "esri/tasks/query", "esri/tasks/QueryTask"], function (FeatureLayer, Query, QueryTask) {


                    var furl = "http://21.15.121.129/ArcGIS/rest/services/DGRH/MapServer/34";//控规总图
                    var select_feature = new FeatureLayer(furl, {
                         //mode: FeatureLayer.MODE_SELECTION,
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFileds: ["*"],
                        id: "flayer"
                    });
                    select_feature.setDefinitionExpression("ZYDXZ LIKE'" + typeVal + "%'and QY='" + districtVal + "'and JCMJ>" + areaVal);
                    
                    //debugger;
                    var queryTask = new QueryTask(furl);
                    var query = new Query();
                    query.where = "ZYDXZ LIKE'" + typeVal + "%' and QY='" + districtVal + "'and JCMJ>" + areaVal;
                    query.outFields = ["DKBH,YDXZ,LDL,RJL,JZMD,JZXG,JCMJ"];
                    query.returnGeometry = true;
                    queryTask.on("complete", Results_SqlTable)
                    queryTask.execute(query);
                    select_feature.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (sel) {
                    //    debugger;
                        console.log(sel);
                        });
                 
                    var flayer = map.getLayer("flayer");
                    if (flayer) {
              
                        map.removeLayer(flayer);
                        map.addLayer(select_feature);
                        
                    } else {
                     
                        map.addLayer(select_feature);
                    }
                    
                }
            );
            } else {
                alert("请输入最小面积！");
            }

        })
    }

    function Results_SqlTable(result) {
        console.log(result);
        var fields = result.featureSet.fields;
        var features = result.featureSet.features;
        var json = "[";
        for (var i = 0; i < fields.length; i++) {
            json += "{field:\"" + fields[i].name + "\",title:\"" + fields[i].alias + "\"";
            if (i < fields.length - 1) {
                json += "},"
            } else {
                json += "}]"
            }
        }
        var data = [];
        var head = eval("(" + json + ")");
        for (var i = 0; i < features.length; i++) {
            data.push(features[i].attributes);
            //  setSymbol(features[i].geometry);
        }
        //var data = [];

        var oTable = new TableInit($("#Table_data"), head, data);
        oTable.Init();
        oTable.load();
    }
    function setSymbol(geo) {
        require(["esri/symbols/PictureMarkerSymbol", "esri/Color", "esri/graphic", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol"], function (PictureMarkerSymbol, Color, Graphic, SimpleLineSymbol, SimpleFillSymbol) {

            switch (geo.type) {
                case "point":
                    var symbol = new PictureMarkerSymbol("img/location.png", 25, 25);
                    var graphicP = new Graphic(geo, symbol, attr);
                    map.graphics.add(graphicP);
                    break;
                case "polyline":
                    var sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 3);
                    var graphic = new Graphic(geo, sls, attr);
                    map.graphics.add(graphic);
                    break;
                case "polygon":
                    var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
                    var graphic = new Graphic(geo, sfs, attr);
                    map.graphics.add(graphic);
                    break;
                default:
                    alert("符号化失败！");
                    break;
            }

        })
    }

    return {
        SpatialAnalysis: SpatialAnalysis,
        initTablePage: initTablePage

    }
});

