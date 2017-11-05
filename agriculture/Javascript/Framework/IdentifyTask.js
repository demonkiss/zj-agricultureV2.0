define(function (IdentifyResult) {
    return {
        DoIdentify: DoIdentify,
        queryBySearch: queryBySearch,
        DoQueryTask: DoQueryTask,
        getShowInfo:getShowInfo,
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
        tempLayer.on("graphic-add", function (e) {
            // console.log(e.graphic.attributes);


            var content = getShowInfo(e.graphic.attributes);
            map.infoWindow.setTitle("属性信息");
            map.infoWindow.setContent(content);
            map.infoWindow.show(mp);
        })
        setSymbol(IdentifyResult[0].feature.geometry, keys);
        //  showDetails(keys, screenP);
    }
}

//搜索框查询
function queryBySearch() {
    require(["esri/tasks/query", "esri/tasks/QueryTask"], function (Query, QueryTask) {
        //  debugger;
        map.graphics.clear();

        var furl = currenturl + "/" + visiableArray.toString();
        var queryTask = new QueryTask(furl)
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        var reg = /^[1-9]\d*$|^0$/;   // 注意：故意限制了 0321 这种格式，如不需要，直接reg=/^\d+$/;数字
        //if (reg.test(value) == true) {
        //    query.where = "DKBM LIKE'%" + value + "%'";
        //    inputType = 1;
        //} else {
        //    query.where = "DKMC LIKE'%" + value + "%'";
        //    inputType = 0;

        //}
        query.where = searchSql;
        queryTask.on("complete", queryByInputComplete)
        queryTask.execute(query);
    });

}
function queryByInputComplete(results) {
    //  $("#listbox").empty();
    var showInfo;
    var objid;
    var length = results.featureSet.features.length;
    if (results.featureSet.features.length == 0) {
        alert("无查询结果");
    } else {
        $("#searchList").show();
        $("#searchList ul").html("");
        console.log("杭州市上杨畈粮食生产功能区");
        var cp = results.featureSet.features[0].geometry.getExtent().getCenter();
        var lat = Number(cp.x);
        var lng = Number(cp.y);
        map.centerAndZoom([lat, lng], upLevel + 1);
        searchLayer.on("click", function (e) {
            console.log(e.graphic.attributes);
            var content = getShowInfo(e.graphic.attributes);
            map.infoWindow.setTitle("属性信息");
            map.infoWindow.setContent(content);
            map.infoWindow.show(cp); 
        })
     
        var graphic;
        for (var i = 0; i < results.featureSet.features.length; i++) {
            var attr = results.featureSet.features[i].attributes;
            var name = results.featureSet.features[i].attributes[searchField];
            var cp = results.featureSet.features[i].geometry.getExtent().getCenter();
            graphic = setSearchSymbol(results.featureSet.features[i].geometry, attr);
            var li = "<li index='" + i + "' x='" + cp.x + "' y= '" + cp.y + "'>" + name + "</li>";
            $("#searchList ul").append(li);
        }
    }
  


}
function setSearchSymbol(geo, attr) {
    var graphic;
    require(["esri/layers/GraphicsLayer", "esri/dijit/PopupTemplate", "esri/symbols/PictureMarkerSymbol", "esri/Color", "esri/graphic", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol"], function (GraphicsLayer,PopupTemplate, PictureMarkerSymbol, Color, Graphic, SimpleLineSymbol, SimpleFillSymbol) {
        // console.log(fieldInfos);
       
        var popupTemplate = new PopupTemplate({
            "title": "属性信息",
            "content": "聚集点信息",
            "fieldInfos": fieldInfos,
        });
        switch (geo.type) {
            case "point":
                var symbol = new PictureMarkerSymbol("img/location.png", 25, 25);
                var graphicP = new Graphic(geo, symbol, attr, popupTemplate);
                map.graphics.add(graphicP);
                break;
            case "polyline":
                var sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 3);
                var graphic = new Graphic(geo, sls, attr, popupTemplate);
                map.graphics.add(graphic);
                break;
            case "polygon":
                var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
                var graphic = new Graphic(geo, sfs, attr);
                mp = geo.getExtent().getCenter();
               
                searchLayer.add(graphic);
                //  console.log(graphic);

                break;
            default:
                alert("符号化失败！");
                break;
        }

    })
    return graphic;
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
    content += "<table class='houseinfo easyui-propertygrid' style='height:\"300px\"'>"
    var count = 0;
    var rows = [];
    require(["./Javascript/Framework/field_keys.js"], function (fk) {
        console.log(fk);
        var fid;
        for (key in keys) {
            var s_key = key.toLowerCase();
            if (fk[key] == confUrl.fKey || key == confUrl.fKey) {
                fid = keys[key];
            }

            if (s_key.indexOf("shape") > -1 || s_key.indexOf("object") > -1) {
                continue;
            }
            else {
                if (fk[key]) {
                    //  content += "<tr>"
                    //  content += "<td>" + fk[key] + "</td>" + "<td>" + keys[key] + "</td>"
                    //   "<tr>"
                    var obj = { "name": fk[key], "value": keys[key] }
                    rows.push(obj);
                    count++;
                } else {
                    //content += "<tr>"
                    //content += "<td>" + key + "</td>" + "<td>" + keys[key] + "</td>"
                    //"<tr>"
                    var obj = { "name": key, "value": keys[key] }
                    rows.push(obj);
                    count++;
                }

            }
        }
        content += "</table>";
        // content += " <a id=\"getRoomInfo\" onclick=\"getRoomInfo(this)\" value=\"" + fid + "\"  href=\"#\" class=\"easyui-linkbutton c4\" style=\"width:120px\">详细信息</a>"
        content += "<button  id=\"getRoomInfo\" type=\"button\" onclick=\"getRoomInfo(this)\" value=\"" + fid + "\" class=\"btn btn btn-info center-block\">查看楼层</button>"
    });


    infoWindow.setTitle("详细信息");
    var infocontdiv = document.createElement("div");
    infocontdiv.id = "infoContDiv";
    infocontdiv.innerHTML = content;
    infocontdiv.clientHeight = 350;
    infoWindow.setContent(infocontdiv);
    var data = {
        "total": count,
        "rows": rows
    }
    $('.houseinfo').propertygrid({
        height: 300,
        width: 260,
        //  fit: true,
        autoscroll: false,
        nowrap: false,
        autoRowHeight: true,
        // fitColumns: true,
        // scrollbarSize: 0,
        columns: [[
       { field: 'name', title: '属性名', width: 100, sortable: false },
       { field: 'value', title: '值', width: 160, resizable: true }
        ]]
    });


    $('.houseinfo').propertygrid("loadData", data);
    $('.houseinfo').propertygrid('resize');
    var html = $('.houseinfo');
    map.infoWindow.resize(500, 500);
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
            //layer.push(layerSet[i].text);
            url.push(layerSet[i].queryurl);
            layerIds.push(layerSet[i].queryarray);
            layerName.push(layerSet[i].querytite);
            //  displayName.push(layerSet[i].displayname)
        }
    }
    // queryPara.layer = layer;
    queryPara.url = url;
    queryPara.layerIds = layerIds;
    queryPara.layerName = layerName;
    // queryPara.displayName = displayName;
    return queryPara;
}
function DoQueryTask(geometry) {
    require(["esri/tasks/query", "esri/tasks/QueryTask"], function (Query, QueryTask) {
        map.graphics.clear();
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

    var layerName = "建筑物";
    var layer;
    //for (var i = 0; i < parainfo.url.length; i++) {
    // layer = parainfo.layer[i];
    //   var layerNameStr = parainfo.layerName[i].join("");
    //   var layerNameArray = layerNameStr.split(",");
    //var layerNameArray = parainfo.layerName;
    //for (var j = 0; j < parainfo.layerIds[i].length; j++) {

    //    var featureUrl = parainfo.url[i] + "/" + parainfo.layerIds[i][j];
    //    if (featureUrl == results.target.url) {

    //        if (results.featureSet.features.length > 0) {
    //         //   var field_alias = {};
    //            debugger;
    //field_alias.field_key = results.featureSet.fieldAliases;
    //    field_alias.field_layer = layerNameArray[j];
    //  f_keys.push(field_alias);
    //result = " <div class='panel panel-info result'>"
    //+ "<div class='panel-heading layerName'>" + layerName + "</div>"
    //   + "<a data-toggle='collapse' data-parent='#accordion' href='#" + layerName + "' class='collapse-box'>"
    //      + "<img src='img/collapse.png' />"
    //   + "</a>"
    //+ "<div class='' id='" + layerName + "'>"
    //  + "<ul class=\"easyui-datalist\"  lines=\"true\">";
    //  $('#datalist').datalist('getPanel').panel('clear')
    //  $("#datalist").datalist("loadData", []);

    for (var k = 0; k < results.featureSet.features.length; k++) {
        var geo = results.featureSet.features[k].geometry;
        var fname = results.featureSet.features[k].attributes[confUrl.showField] || "无楼栋名称";
        var attr = results.featureSet.features[k].attributes;
        var fields = results.featureSet.fields;
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].type == "esriFieldTypeDate") {
                var str = attr[fields[i].name];
                var myDate = new Date(str);
                value = myDate.getFullYear() + "/"; //获取完整的年份(4位,1970-????)
                value += (myDate.getMonth() + 1) + "/"; //获取当前月份(0-11,0代表1月)
                value += myDate.getDate(); //获取当前日(1-31)
                // value = date.toString();
                attr[fields[i].name] = value
            }
        }
        var objid = results.featureSet.features[k].attributes["OBJECTID"] || results.featureSet.features[k].attributes["FID"];
        setSymbol(geo, attr);
        if (fname.trim().length == 0) {
            fname = "无楼栋名称";
        }
        //   $('#datalist').datalist('appendRow', { text: fname, value: objid });
        //  result += ("<li class='menuli' alt='" + objid + "'>" + fname + "</li>");
        result += ("<li classs='list-group-item' alt='" + objid + "'>" + fname + "</li>");
    }
    //result += "</ul></div>";
    //result += "</div>";
    //        }


    //    }
    //}
    //}
    console.log(result);
    if (result != "") {
        $("#queryData ul").html(result);

        //var data = [{ "text": "123", "value": "1" }, { "text": "Epson WorkForce 845", "value": "2" }];
        //$("#datalist").datalist({
        //    lines: true,
        //    valueField: 'value',
        //    textField: 'text'
        //});
        //var datasource = { total: 2, rows: data };
        //$("#datalist").datalist("loadData", datasource);
        //$('#datalist').datalist('appendRow', { text: "11", value: "11" });

        //var data = [{ "text": "123", "value": "1" }, { "text": "Epson WorkForce 845", "value": "2" }];
        //$("#queryData").datalist({
        //    lines: true,
        //    valueField: 'value',
        //    textField: 'text'
        //});
        //var datasource = { total: 2, rows: data };
        //$("#queryData").datalist("loadData", datasource);
        //$('#queryData').datalist('appendRow', { text: "11", value: "11" });
        //  $.parser.parse($(".results ul").parent());
        //  $.parser.parse("#datalist");
        // $.parser.parse($('#datalist').parent());
        //  $.parser.parse("#queryData");

    }

    toolbar.deactivate();
    map.setMapCursor("default");
    infoList.css("display", "block");
}
function setSymbol(geo, attr) {
   // map.graphics.clear();
    tempLayer.clear();
    var graphic;
    require(["esri/dijit/PopupTemplate", "esri/symbols/PictureMarkerSymbol", "esri/Color", "esri/graphic", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol"], function (PopupTemplate, PictureMarkerSymbol, Color, Graphic, SimpleLineSymbol, SimpleFillSymbol) {
        console.log(fieldInfos);
        var popupTemplate = new PopupTemplate({
            "title": "属性信息",
            "content": "聚集点信息",
            "fieldInfos": fieldInfos,
        });
        switch (geo.type) {
            case "point":
                var symbol = new PictureMarkerSymbol("img/location.png", 25, 25);
                var graphicP = new Graphic(geo, symbol, attr, popupTemplate);
                map.graphics.add(graphicP);
                break;
            case "polyline":
                var sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 3);
                var graphic = new Graphic(geo, sls, attr, popupTemplate);
                map.graphics.add(graphic);
                break;
            case "polygon":
                var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([0, 0, 255]), 2), new Color([255, 255, 0, 0.25]));
                var graphic = new Graphic(geo, sfs, attr);
                mp = geo.getExtent().getCenter();
              
                tempLayer.add(graphic);
                //  console.log(graphic);

                break;
            default:
                alert("符号化失败！");
                break;
        }

    })
    return graphic;
}
function getShowInfo(attr) {
    let content = "";
    for (var k = 0; k < fieldInfos.length; k++) {
        content += fieldInfos[k].fieldName + " : " + attr[fieldInfos[k].fieldName] + "<br>"
    }
    console.log(content);
    return content;
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
    var currentGraphic;
    for (var i = 0; i < map.graphics.graphics.length; i++) {
        if (map.graphics.graphics[i].attributes["FID"] == index) {
            currentGraphic = map.graphics.graphics[index] || map.graphics.graphics[i];
        }
    }

    var geo = currentGraphic.geometry;
    var keys = currentGraphic.attributes;
    // debugger;
    var content = getInfoContent(keys, layerIndex);
    setHighSymbol(geo, content);
    var mp;
    if (geo.type === "point") {
        mp = geo;
    } else {
        var extent = geo.getExtent();
        mp = geo.getExtent().getCenter();
    }


    map.infoWindow.show(mp);

    //  infoWindow.setTitle("详细信息");
    // infoWindow.setContent(infoContent);
    // map.infoWindow.show(mp);
}
function getInfoContent(keys, layerIndex) {

    //var content = "<table class='keyValue'>";
    //require(["Javascript/Framework/field_keys.js"], function (fk) {
    //    console.log(fk);
    //    var fid;
    //    for (key in keys) {
    //        var s_key = key.toLowerCase();
    //        if (fk[key] == confUrl.fKey) {
    //            fid = keys[key];
    //        }

    //        if (s_key.indexOf("shape") > -1 || s_key.indexOf("object") > -1) {
    //            continue;
    //        }
    //        else {
    //            if (fk[key]) {
    //                content += "<tr>"
    //                content += "<td>" + fk[key] + "</td>" + "<td>" + keys[key] + "</td>"
    //                "<tr>"
    //            } else {
    //                content += "<tr>"
    //                content += "<td>" + key + "</td>" + "<td>" + keys[key] + "</td>"
    //                "<tr>"
    //            }

    //        }
    //    }
    //    content += "</table>";
    //    content += "<button  id=\"getRoomInfo\" type=\"button\" onclick=\"getRoomInfo(this)\" value=\"" + fid + "\" class=\"btn btn-primary\">详细信息</button>"
    //});
    var content = "<table class='houseinfo easyui-propertygrid' style='height:\"300px\"'>"
    var count = 0;
    var rows = [];
    require(["./Javascript/Framework/field_keys.js"], function (fk) {
        console.log(fk);
        var fid;
        for (key in keys) {
            var s_key = key.toLowerCase();
            if (fk[key] == confUrl.fKey || key == confUrl.fKey) {
                fid = keys[key];
            }

            if (s_key.indexOf("shape") > -1 || s_key.indexOf("object") > -1) {
                continue;
            }
            else {
                var value = keys[key];

                if (fk[key]) {
                    //  content += "<tr>"
                    //  content += "<td>" + fk[key] + "</td>" + "<td>" + keys[key] + "</td>"
                    //   "<tr>"

                    var obj = { "name": fk[key], "value": value }
                    rows.push(obj);
                    count++;
                } else {
                    //content += "<tr>"
                    //content += "<td>" + key + "</td>" + "<td>" + keys[key] + "</td>"
                    //"<tr>"
                    var obj = { "name": key, "value": value }
                    rows.push(obj);
                    count++;
                }

            }
        }
        content += "</table>";
        // content += " <a id=\"getRoomInfo\" onclick=\"getRoomInfo(this)\" value=\"" + fid + "\"  href=\"#\" class=\"easyui-linkbutton c4\" style=\"width:120px\">详细信息</a>"
        content += "<button  id=\"getRoomInfo\" type=\"button\" onclick=\"getRoomInfo(this)\" value=\"" + fid + "\" class=\"btn btn btn-info center-block\">查看楼层</button>"
    });
    infoWindow.setTitle("详细信息");
    var infocontdiv = document.createElement("div");
    infocontdiv.id = "infoContDiv";
    infocontdiv.innerHTML = content;
    infocontdiv.clientHeight = 350;
    infoWindow.setContent(infocontdiv);
    var data = {
        "total": count,
        "rows": rows
    }
    $('.houseinfo').propertygrid({
        height: 300,
        width: 260,
        //  fit: true,
        autoscroll: false,
        nowrap: false,
        autoRowHeight: true,
        // fitColumns: true,
        // scrollbarSize: 0,
        columns: [[
       { field: 'name', title: '属性名', width: 100, sortable: false },
       { field: 'value', title: '值', width: 160, resizable: true }
        ]]
    });


    $('.houseinfo').propertygrid("loadData", data);
    $('.houseinfo').propertygrid('resize');
    var html = $('.houseinfo');
    map.infoWindow.resize(500, 500);
    return content;
}