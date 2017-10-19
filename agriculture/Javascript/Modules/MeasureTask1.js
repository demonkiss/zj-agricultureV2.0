define(function () {
    return{
        MeasureMethod: MeasureMethod
    }
});
function MeasureMethod(geometry) {
    require(["esri/geometry/geodesicUtils", "esri/units", "esri/tasks/LengthsParameters", "esri/tasks/AreasAndLengthsParameters", "esri/tasks/GeometryService", "esri/graphic", "esri/geometry/Point", "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/SpatialReference"], function (geodesicUtils, Units,LengthsParameters, AreasAndLengthsParameters, GeometryService, Graphic, Point, SimpleLineSymbol, SimpleFillSymbol, Color, SpatialReference) {
            var showPt = null;
            var gsvc = new GeometryService(BaseConfig.GeometryServerUrl);
            var extent = geometry.getExtent();
            var x = (extent.xmin + extent.xmax) / 2;
            var y = (extent.ymin + extent.ymax) / 2;
            var showPt = new Point(x, y, new SpatialReference({ wkid: 4326 }));
            debugger;
            
        switch (geometry.type) {
            case "polyline":
                var lengths = geodesicUtils.geodesicLengths([geometry], Units.KILOMETERS);
                var length = geometry.paths[0].length;

                showPt = new Point(geometry.paths[0][length - 1], map.spatialReference);
                var lengthParams = new LengthsParameters();
                lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_KILOMETER;
                lengthParams.polylines = [geometry];
                gsvc.lengths(lengthParams);

                break;
            case "polygon":
                var areas = geodesicUtils.geodesicAreas([geometry], Units.SQUARE_KILOMETERS);
                showPt = new Point(geometry.rings[0][0], map.spatialReference);
                var areasAndLengthParams = new AreasAndLengthsParameters();
                areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_KILOMETER;
                areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_KILOMETERS;
                gsvc.simplify([geometry], function (simplifiedGeometries) {
                    areasAndLengthParams.polygons = simplifiedGeometries;
                    gsvc.areasAndLengths(areasAndLengthParams);
                });
                break;
            default: break;
        }
        var graphic = new Graphic(geometry, getGeometrySymbol(geometry.type));
        map.graphics.add(graphic);

        //根据geometry的类型，增加GeometryService的lengths-complete或者areas-and-lengths-complete事件：
        gsvc.on("lengths-complete", outputLength);
        function outputLength(evtObj) {
         //   debugger;
            var result = evtObj.result;
            measureInfo(showPt, result.lengths[0].toFixed(3), "千米");
        };
        gsvc.on("areas-and-lengths-complete", outputAreaAndLength);
        function outputAreaAndLength(evtObj) {
            var result = evtObj.result;
            measureInfo(showPt, result.areas[0].toFixed(3), "平方千米");
        };
       //符号化图形
        function getGeometrySymbol(type) {
            var symbol;
            if (type == "polyline") {
                symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 3);
            }
            else if (type == "polygon") {
                symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25])
);
            }
            return symbol;
        }
            //测量结果
        function measureInfo(showPnt, data, unit) {
            var screenP = map.toScreen(showPnt);
            var content = data + unit;
            
            $(".relate-geo").css("display", "none");
            var info = $("#infoSimple");
            info.css("position", "absolute");
            info.css("left", screenP.x + "px");
            info.css("top", screenP.y + "px");

            info.css("z-index", "999");
            info.css("display", "block");
            $(".infocontent").html(content);
        }
    })



}