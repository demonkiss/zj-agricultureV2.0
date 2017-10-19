define(function () {

    function DkQuery(polygon) {
        ;
        require(["esri/tasks/query", "esri/tasks/QueryTask"], function (Query, QueryTask) {
            var url = "http://localhost:6080/arcgis/rest/services/bls_streets/MapServer/0";
            var queryTask = new QueryTask(url)
            var query = new Query();
            query.geometry = polygon;
            query.outFields = ["*"];
            query.returnGeometry = true;
            queryTask.on("complete", DkResults)
            queryTask.execute(query);
        });

    }
    function DkResults(results) {
        require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/graphic", "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol", "esri/Color"], function (Query, QueryTask, Graphic, SimpleLineSymbol, SimpleFillSymbol, Color) {
            var features = results.featureSet.features;
            for (var i = 0; i < features.length; i++) {
                var P_symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
        new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
                var attr = features[i].attributes;
              //  debugger
                var dk = {};
                dk.dkbm = features[i].attributes['DKBM'];
                dk.dkmc = features[i].attributes['DKMC'];
                var has_dkbm = hasDKBM(features[i].attributes['DKBM']);
                if (!has_dkbm) {
                    dkCode.push(dk);
                    var graphic = new Graphic(features[i].geometry, P_symbol);
                    map.graphics.add(graphic);
                }
              

            }
        });

    }

    function hasDKBM(dkbm) {
        debugger;
        if (dkCode.length) {
            for (var i = 0; i < dkCode.length; i++) {
                if (dkCode[i].dkbm == dkbm) {
                    return true;
                    break;                   
                }
            }

        } else {
            return false;
        }
    }
    return {
        DkQuery: DkQuery
    }
});