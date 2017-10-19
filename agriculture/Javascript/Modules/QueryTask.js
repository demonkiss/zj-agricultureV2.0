define(function () {
    return {
        queryByClick: queryByClick,//单击查询
        queryBySelect: queryBySelect,//框选查询
        ShowDetailBox: ShowDetailBox,
        queryByInput: queryByInput,
        queryByConditon: queryByConditon,
        queryByName: queryByName
    }
});
function queryByClick(mapPoint, url, layerId, where) {
    //require(["esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters"], function (IdentifyTask, IdentifyParameters) {
    //    map.graphics.clear();
    //    var identifyTask = new IdentifyTask(url);
    //    //IdentifyTask参数设置
    //    var identifyParameters = new IdentifyParameters();
    //    //冗余范围
    //    identifyParameters.tolerance = 3;
    //    //返回地理元素
    //    identifyParameters.returnGeometry = true;
    //    //进行Identify的图层为全部
    //    identifyParameters.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
    //    //待查询的图层ID
    //    identifyParameters.layerIds = layerId;
    //    //  identifyParameters.layerDefinition = where;
    //    identifyParameters.layerDefinitions[layerId] = where;
    //    //属性点
    //    identifyParameters.geometry = mapPoint;
    //    //curMapPoint = mapPoint;
    //   // screenP = map.toScreen(mapPoint);
    //    //当前地图范围
    //    identifyParameters.mapExtent = map.extent;
    //    identifyParameters.width = map.width;
    //    identifyParameters.height = map.height;
    //    //执行数据查询
    //    identifyTask.execute(identifyParameters, queryByClickResult);
    //})
    require(["esri/tasks/query", "esri/tasks/QueryTask"], function (Query, QueryTask) {
        map.graphics.clear();
        //  debugger;
        var furl = url + "/" + layerId;
        var queryTask = new QueryTask(furl)
        var query = new Query();
        query.geometry = mapPoint;
        query.outFields = ["*"];
        query.where = where;
        query.returnGeometry = true;
        queryTask.on("complete", queryByClickResult)
        queryTask.execute(query);


    });
}
function queryByClickResult(results) {
    //  debugger;
    //  if (attr)
    var attr = results.featureSet.features[0].attributes;
    setSymbol(results.featureSet.features[0].geometry, attr);
    var infoContent = getInfoContent(attr);
    var mp = results.featureSet.features[0].geometry.getExtent().getCenter();
    infoWindow.setTitle("详细信息");
    infoWindow.setContent(infoContent);
    map.infoWindow.show(mp);
}
var inputType;
var graphicTmp;//临时高亮graphic
//查询
function queryBySelect(geometry, where) {
    require(["esri/tasks/query", "esri/tasks/QueryTask"], function (Query, QueryTask) {
        map.graphics.clear();
        //   for (var i = 0; i < layerSet.length; i++) {
        //  var furl = layerSet[i].dynaurl + "/" + layerSet[i].queryindex;
        var furl = currentLayerServiceUrl + "/" + currentLayerIndex.toString();
        var queryTask = new QueryTask(furl)
        var query = new Query();
        query.geometry = geometry;
        query.where = where;
        query.outFields = ["*"];
        query.returnGeometry = true;
        queryTask.on("complete", query_complete)
        queryTask.execute(query);

        //   }
    });
}
//查询完成
function query_complete(results) {
    // debugger;
    if (results.featureSet.features.length == 0) {
        alert("无查询结果");

    } else {
        var result = "<ul>";
        for (var i = 0; i < results.featureSet.features.length; i++) {

            var objid = results.featureSet.features[i].attributes['OBJECTID'];
            var fname = results.featureSet.features[i].attributes['DKMC'];
            var attr = results.featureSet.features[i].attributes;
            setSymbol(results.featureSet.features[i].geometry, attr);
            result += ("<li class='menuli' alt='" + objid + "'>" + fname + "</li>");
        }
        result += "</ul>";
        if (result != "")
        { $(".results").append(result); }
        $("#infoList").css("display", "block");
    }
}
//符号化
function setSymbol(geo, info) {
    require(["esri/symbols/PictureMarkerSymbol", "esri/Color", "esri/graphic", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol"], function (PictureMarkerSymbol, Color, Graphic, SimpleLineSymbol, SimpleFillSymbol) {
        var symbol;
        switch (geo.type) {
            case "point":
                symbol = new PictureMarkerSymbol("img/location.png", 25, 25);
                break;
            case "polyline":
                symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 3);
                break;
            case "polygon":
                symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
                break;
            default:
                alert("符号化失败！");
                break;
        }
        var graphic = new Graphic(geo, symbol, info);
        map.graphics.add(graphic);
    })
}
//高亮选中的
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
//显示属性
function ShowDetailBox(index, layerIndex) {
    var currentGraphic = map.graphics.graphics[index];
    var geo = currentGraphic.geometry;
    var keys = currentGraphic.attributes;
    var extent = geo.getExtent();
    var infoContent = getInfoContent(keys);
    setHighSymbol(geo, infoContent);
    var mp;
    if (geo.type === "point") {
        mp = geo;
    } else {
        mp = geo.getExtent().getCenter();
    }
    infoWindow.setTitle("详细信息");
    infoWindow.setContent(infoContent);
    map.infoWindow.show(mp);
    //  debugger;
    map.centerAndZoom([mp.x, mp.y], 16);
}
//属性的展示
function getInfoContent(keys) {
    var content = "";

    var cbrmc = "";//承包人名称
    content += "<table class='keyValue'>";


    for (key in keys) {
        var s_key = key.toLowerCase();
        if (key == "CBFDBXM") {
            cbrmc = keys[key];
        }

        if (hasToHide(key) || hasToHide(field_keys[key])) {
            continue;
        }

        if (s_key.indexOf("shape") > -1 || s_key.indexOf("object") > -1) {
            continue;
        }
        else if (field_keys[key]) {


            if (codeConvert[key]) {
                // debugger;
                var value = codeConvert[key][keys[key]];
                if (!value || value == "null" || value == null) {
                    value = "";
                }
                content += "<tr>"
                content += "<td>" + field_keys[key] + "</td>" + "<td>" + value + "</td>"
                "<tr>"
            } else {
                var mValue;

                //if (field_keys[key] == "实测面积") {
                //  //  mValue = keys[key] +"平方米";
                //} else
                if (keys[key] == null || keys[key] == "null") {
                    mValue = "";
                } else {

                    mValue = keys[key];
                }
                content += "<tr>"
                content += "<td>" + field_keys[key] + "</td>" + "<td>" + mValue + "</td>"
                "<tr>"
            }

        } else {
            var value = keys[key];
            if (!value || value == "null" || value == null) {
                value = "";
            }
            content += "<tr>"
            content += "<td>" + key + "</td>" + "<td>" + value + "</td>"
            "<tr>"
        }
    }
    content += "</table>";
    content += "<button  id=\"query_dk\" type=\"button\" onclick=\"getCbrArea(this)\" value=\"" + cbrmc + "\" class=\"btn btn-primary\">获取承包人地块</button>"
    return content;
}
function hasToHide(key) {

    for (var i = 0; i < hideField.length; i++) {
        if (key == hideField[i])
            return true;
    }
    return false;
}

//根据名字查询
function queryByName(value) {
    require(["esri/tasks/query", "esri/tasks/QueryTask"], function (Query, QueryTask) {
        // debugger;
        map.graphics.clear();
        inputType = 0;
        //  for (var i = 0; i < layerSet.length; i++) {
        //  var furl = layerSet[i].dynaurl + "/" + layerSet[i].queryindex;
        var furl = currentLayerServiceUrl + "/" + currentLayerIndex.toString();
        var queryTask = new QueryTask(furl)
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.where = "CBFDBXM LIKE'%" + value + "%'";
        queryTask.on("complete", queryByInputComplete)
        queryTask.execute(query);

        //  }
    });

}
//搜索框查询
function queryByInput(value) {
    require(["esri/tasks/query", "esri/tasks/QueryTask"], function (Query, QueryTask) {
        //  debugger;
        map.graphics.clear();
        //  for (var i = 0; i < layerSet.length; i++) {
        //  var furl = layerSet[i].dynaurl + "/" + layerSet[i].queryindex;
        var furl = currentLayerServiceUrl + "/" + currentLayerIndex.toString();
        var queryTask = new QueryTask(furl)
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        var reg = /^[1-9]\d*$|^0$/;   // 注意：故意限制了 0321 这种格式，如不需要，直接reg=/^\d+$/;数字
        if (reg.test(value) == true) {
            query.where = "DKBM LIKE'%" + value + "%'";
            inputType = 1;
        } else {
            query.where = "DKMC LIKE'%" + value + "%'";
            inputType = 0;

        }
        queryTask.on("complete", queryByInputComplete)
        queryTask.execute(query);

        // }
    });

}
function queryByInputComplete(results) {
    $("#listbox").empty();
    var showInfo;
    var objid;
    if (results.featureSet.features.length == 0) {
        alert("无查询结果");
    }
    for (var i = 0; i < results.featureSet.features.length; i++) {
        if (inputType == "1") {
            showInfo = results.featureSet.features[i].attributes["DKBM"];
        } else if (inputType == "0") {
            showInfo = results.featureSet.features[i].attributes["DKMC"];
        }
        var attr = results.featureSet.features[i].attributes;
        setSymbol(results.featureSet.features[i].geometry, attr);
        objid = results.featureSet.features[i].attributes["OBJECTID"];
        var name_html = "<li class='list-group-item list-group-item-info' alt=" + objid + ">" + showInfo + "</li>";
        $("#addressInfo").css("display", "block");
        $("#listbox").append(name_html);

        if ($('.search-more-content').is(':hidden')) {
            $("#addressInfo").css("top", "150px");
        }
        else {
            $("#addressInfo").css("top", "380px");
        }

      //  $("#addressInfo").css("top", "380px");
    }
}

//多条件查询
function queryByConditon(where) {
    require(["esri/tasks/query", "esri/tasks/QueryTask"], function (Query, QueryTask) {
        //  debugger;
        map.graphics.clear();
        //  for (var i = 0; i < layerSet.length; i++) {
        //   var furl = layerSet[i].dynaurl + "/" + layerSet[i].queryindex;
        var furl = currentLayerServiceUrl + "/" + currentLayerIndex.toString();
        var queryTask = new QueryTask(furl)
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.where = where;
        queryTask.on("complete", queryByConditonComplete)
        queryTask.execute(query);

        //   }
    });
}
function queryByConditonComplete(results) {
    $("#listbox").empty();
    var showInfo;
    var objid;
    if (results.featureSet.features.length == 0) {
        alert("无查询结果");

    } else {
        for (var i = 0; i < results.featureSet.features.length; i++) {
            showInfo = results.featureSet.features[i].attributes["DKMC"];
            var attr = results.featureSet.features[i].attributes;
            setSymbol(results.featureSet.features[i].geometry, attr);
            objid = results.featureSet.features[i].attributes["OBJECTID"];
            var name_html = "<li class='list-group-item list-group-item-info' alt=" + objid + ">" + showInfo + "</li>";
            $("#listbox").append(name_html);
        }
        $("#addressInfo").css("display", "block");
        $("#addressInfo").css("top", "380px");
    }

}
