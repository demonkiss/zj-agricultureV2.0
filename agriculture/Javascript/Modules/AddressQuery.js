define(function () {
    return {
        GetAddressInfo: GetAddressInfo,
        PointLocation: PointLocation
    }
})
var xmlhttp;
var graphicTmp;
function GetAddressInfo(str) {
    $("#listbox").empty();
    if (map.graphics.graphics.length != 0) {
        map.graphics.clear();
    }
    var objs;
    var tt;
    var content = null;
    //alert(encodeURIComponent(str));
    if (str.length > 0) {
        var url = "http://21.15.121.121/e288eefda8363b238133b1eaf142d3add473e5c7/Geocoding/LiquidGIS/FindAddress.gis?key=" + encodeURIComponent(str) + "&FORMAT=json&SRID=4326";
        $.post(url,
         {},
         function (data) {
             tt = eval(data);
             for (var i = 0; i < tt.length; i++) {
                 var name = "<li class='list-group-item list-group-item-info'>" + tt[i].Name + "</li>";
                 $("#addressInfo").css("display", "block");
                 $("#listbox").append(name);
                 //绘制graphic
                 var point = esri.geometry.Point(tt[i].Envelope.MaxX, tt[i].Envelope.MaxY);
                 var symbol = new esri.symbol.PictureMarkerSymbol("img/location.png", 21, 34);
                 var attr = { "NAME": tt[i].Name };
                 var infoTemplate = new esri.InfoTemplate("${NAME}", "");
                 var graphic = new esri.Graphic(point, symbol, attr, infoTemplate);
                 map.graphics.add(graphic);
             }

         }, 'jsonp');

    }
}
function PointLocation(index) {
    if (graphicTmp != "" || graphicTmp != null) {
        map.graphics.remove(graphicTmp);
    }
    var graphiclist = map.graphics.graphics;
    //for (var i = 0; i < graphiclist.length; i++)
    //{
    //    if (name == graphiclist[i].attributes["NAME"]) {
         
    //        var symbol = new esri.symbol.PictureMarkerSymbol("img/locationhover.png", 21, 34);
    //        var attr = { "NAME": name };
    //        var infoTemplate = new esri.InfoTemplate("${NAME}", "");
    //        graphicTmp = new esri.Graphic(graphiclist[i].geometry, symbol, attr, infoTemplate);
    //        map.graphics.add(graphicTmp);
    //        map.centerAndZoom(graphiclist[i].geometry,8)
    //        break;
    //    }
    //}

    var symbol = new esri.symbol.PictureMarkerSymbol("img/locationhover.png", 21, 34);
    var attr = { "NAME": graphiclist[index].attributes["NAME"] };
        var infoTemplate = new esri.InfoTemplate("${NAME}", "");
           graphicTmp = new esri.Graphic(graphiclist[index].geometry, symbol, attr, infoTemplate);
        map.graphics.add(graphicTmp);
        map.centerAndZoom(graphiclist[index].geometry, 8);
}