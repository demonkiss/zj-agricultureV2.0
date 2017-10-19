var CustomLayers = [{
    layername: "浦江县",
    displaylayer: "DKMC",
    tiledurl: "",
    dynaurl: "http://localhost:6080/arcgis/rest/services/bls_streets/MapServer",
    // dynaurl: "http://192.168.6.102:8080/ArcGIS/rest/services/dk/MapServer",
    queryindex: [0],
    classify: [{
        "classifyName": "地块类别",
        "classifyField": "DKLB",
        "classifyType": {
            "承包地块": "10",
            "逢留地": "21",
            "机动地": "22",
            "开荒地": "23",
            "其他集体土地": "99"
        }
    }, {
        "classifyName": "土地用途",
        "classifyField": "TDYT",
        "classifyType": {
            "种植业": "1",
            "林业": "2",
            "畜牧业": "3",
            "渔业": "4",
            "非农业用途": "5",

        },

    }
    ]
}]