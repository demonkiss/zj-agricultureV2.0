define(function (IdentifyResult) {
    return {
        DoIdentify: DoIdentify,
        DoQueryTask: DoQueryTask,
        ShowDetailBox: ShowDetailBox
    }
});
/*查询要素*/
var screenP;
var hasFeature = false;

var parainfo;
var graphicTmp;
var infoMoveEvent;//info框随地图变化移动事件
function DoIdentify(mapPoint, url, layerArray) {
    require(["esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters"], function (IdentifyTask, IdentifyParameters) {
        map.graphics.clear();

        var identifyTask = new IdentifyTask(url);
        //IdentifyTask参数设置
        var identifyParameters = new IdentifyParameters();
        //冗余范围
        identifyParameters.tolerance = 6;
        //返回地理元素
        identifyParameters.returnGeometry = true;
        //进行Identify的图层为全部
        identifyParameters.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
        //待查询的图层ID
        identifyParameters.layerIds = layerArray;
        //属性点
        identifyParameters.geometry = mapPoint;
        //curMapPoint = mapPoint;
        screenP = map.toScreen(mapPoint);
        //当前地图范围
        identifyParameters.mapExtent = map.extent;
        identifyParameters.width = map.width;
        identifyParameters.height = map.height;
        //执行数据查询
        identifyTask.execute(identifyParameters, IdentifyResultManager, ResultFailed);
    })
}
/*要素查询回调函数*/
function ResultFailed(result) {
    alert("查询失败");
}
function IdentifyResultManager(IdentifyResult) {
    if (IdentifyResult.length > 0) {
        for (var i = 0; i < IdentifyResult.length; i++) {
            var layerName = IdentifyResult[i].layerName;
            var myFeature = IdentifyResult[i].feature;
        }
        var keys = IdentifyResult[0].feature.attributes;

        setSymbol(IdentifyResult[0].feature.geometry);
        showDetails(keys, screenP);
    }
}
function showDetails(keys, mapPoint) {
    var key;
    var content = "";
    var locationX;
    var locationY;
    if (mapPoint.spatialReference) {

        locationX = $(window).width() / 2;
        locationY = $(window).height() / 2;
    }
    else {
        // debugger;
        var offsetX = mapPoint.x + 250 - $(window).width();
        if (offsetX > 0) {
            // debugger;
            var p = map.toMap(mapPoint);
            map.centerAt(p);
            locationX = $(window).width() / 2;
            locationY = $(window).height() / 2;

        }
        else {
            locationX = mapPoint.x;
            locationY = mapPoint.y;
        }

        mapPoint = map.toMap(mapPoint);


    }

    content += "<table class='keyValue'>"
    for (key in keys) {
        var s_key = key.toLowerCase();

        if (s_key.indexOf("shape") > -1 || s_key.indexOf("object") > -1) {
            continue;
        }
        else {
            content += "<tr>"
            content += "<td>" + key + "</td>" + "<td>" + keys[key] + "</td>"
            "<tr>"
        }
        "</table>"
    }
    infoWindow.setTitle("详细信息");
    infoWindow.setContent(content);
    map.infoWindow.show(mapPoint);

}
function getLayerSetPara() {
    var queryPara = new Object();
    var layer = [];
    var url = [];
    var layerIds = [];
    var layerName = [];
    var displayName = [];
 
    for (var i = 0; i < layerSet.length; i++) {
        if (layerSet[i].queryurl != "") {
            layer.push(layerSet[i].text);
            url.push(layerSet[i].queryurl);
            layerIds.push(layerSet[i].queryarray);
            layerName.push(layerSet[i].querytite);
            displayName.push(layerSet[i].displayname)
        }
    }
    queryPara.layer = layer;
    queryPara.url = url;
    queryPara.layerIds = layerIds;
    queryPara.layerName = layerName;
    queryPara.displayName = displayName;
    return queryPara;
}
function DoQueryTask(geometry) {
    require(["esri/tasks/query", "esri/tasks/QueryTask"], function (Query, QueryTask) {
        map.graphics.clear();
        field_keys.length = 0;
        parainfo = getLayerSetPara();
        for (var i = 0; i < parainfo.url.length; i++) {
            for (var j = 0; j < parainfo.layerIds[i].length; j++) {
                var furl = parainfo.url[i] + "/" + parainfo.layerIds[i][j];
                var queryTask = new QueryTask(furl)
                var query = new Query();
                query.geometry = geometry;
                query.outFields = ["*"];
                query.returnGeometry = true;
                queryTask.on("complete", queryResults)
                queryTask.execute(query);
            }
        }
    });
}
function queryResults(results) {
    var infoList = $("#infoList");                 
    var result = "";

    var layerName;
    var layer;
    for (var i = 0; i < parainfo.url.length; i++) {
        layer = parainfo.layer[i];
        var layerNameStr = parainfo.layerName[i].join("");
        var layerNameArray = layerNameStr.split(",");
        for (var j = 0; j < parainfo.layerIds[i].length; j++) {
            
            var featureUrl = parainfo.url[i] + "/" + parainfo.layerIds[i][j];
            if (featureUrl == results.target.url) {
                
                if (results.featureSet.features.length > 0) {
                    var field_alias = {};
                    debugger;
                    field_alias.field_key = results.featureSet.fieldAliases;
                    field_alias.field_layer = layerNameArray[j];
                    field_keys.push(field_alias);
                    result = " <div class='panel panel-info result'>"
                                + "<div class='panel-heading layerName'>" + layerNameArray[j] + "</div>"
                                   + "<a data-toggle='collapse' data-parent='#accordion' href='#" + layerNameArray[j] + "' class='collapse-box'>"
                                      + "<img src='img/collapse.png' />"
                                   + "</a>"
                                + "<div class='panel-body features paanel-collapse collapse in' id='" + layerNameArray[j] + "'>"
                                  + "<ul>";
                    for (var k = 0; k < results.featureSet.features.length; k++) {
                        var geo = results.featureSet.features[k].geometry;
                        var fname = results.featureSet.features[k].attributes[parainfo.displayName[i]];
                        var attr = results.featureSet.features[k].attributes;                    
                        var objid = results.featureSet.features[k].attributes["OBJECTID"];
                        setSymbol(geo, attr);
                        result += ("<li class='menuli' alt='" + objid + "'>" + fname + "</li>");
                    }
                    result += "</ul></div></div>";
                }


            }
        }
    }

    if (result != "")
    { $(".results").append(result); }
    infoList.css("display", "block");
    toolbar.deactivate();
    map.setMapCursor("default");

}
function setSymbol(geo, attr) {

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

function setHighSymbol(geo, info) {
    require(["esri/symbols/PictureMarkerSymbol", "esri/InfoTemplate", "esri/Color", "esri/graphic", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol"], function (PictureMarkerSymbol, InfoTemplate, Color, Graphic, SimpleLineSymbol, SimpleFillSymbol) {
        if (graphicTmp != "" || graphicTmp != null) {
            map.graphics.remove(graphicTmp);
        }


        var infoTem = new InfoTemplate();
        infoTem.setTitle("详细信息");
        infoTem.setContent(info);
        var attr = {};
        switch (geo.type) {
            case "point":
                var symbol = new PictureMarkerSymbol("img/locationhover.png", 25, 25);
                var graphicP = new Graphic(geo, symbol, attr, infoTem);
                graphicTmp = graphicP;
                map.graphics.add(graphicP);
                break;
            case "polyline":
                var sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 255]), 4);
                var graphic = new Graphic(geo, sls, attr, infoTem);
                graphicTmp = graphic;
                map.graphics.add(graphic);
                break;
            case "polygon":
                var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 255]), 2), new Color([255, 255, 0, 0.25]));
                var graphic = new Graphic(geo, sfs, attr, infoTem);
                graphicTmp = graphic;
                map.graphics.add(graphic);
                break;
            default:
                alert("符号化失败！");
                break;
        }

    })
}
function ShowDetailBox(index, layerIndex) {
    var currentGraphic = map.graphics.graphics[index];
    var geo = currentGraphic.geometry;
    var keys = currentGraphic.attributes;
   // debugger;
    var infoContent = getInfoContent(keys, layerIndex);
    setHighSymbol(geo, infoContent);
    var mp;
    if (geo.type === "point") {
        mp = geo;
    } else {
        var extent = geo.getExtent();
        mp = geo.getExtent().getCenter();
    }


    infoWindow.setTitle("详细信息");
    infoWindow.setContent(infoContent);
    map.infoWindow.show(mp);
}
function getInfoContent(keys, layerIndex) {
    var content = "";
    content += "<table class='keyValue'>"
    for (key in keys) {
        var s_key = key.toLowerCase();

        if (s_key.indexOf("shape") > -1 || s_key.indexOf("object") > -1) {
            continue;
        }
        else {
            content += "<tr>"
            content += "<td>" + field_keys[layerIndex].field_key[key] + "</td>" + "<td>" + keys[key] + "</td>"
            "<tr>"
        }
        "</table>"
    }
    return content;
}