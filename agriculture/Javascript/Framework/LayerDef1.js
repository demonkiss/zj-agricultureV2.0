var CustomLayers = [{
    layername: "白龙山街道新建",
    displaylayer: "DKMC",
    tiledurl: "",
    dynaurl: "http://localhost:6080/arcgis/rest/services/bls_streets/MapServer",
    // dynaurl: "http://192.168.6.102:8080/ArcGIS/rest/services/dk/MapServer",
    queryindex: [0],
    classify: [{
        "classifyName": "地块类别",
        "classifyType": {
            "承包地块": "dklb='10'",
            "逢留地": "dklb='21'",
            "机动地": "dklb='22'",
            "开荒地": "dklb='23'",
            "其他集体土地": "dklb='99'"
        }
    }, {
        "classifyName": "所有权性质",
        "classifyType": {
            "国有土地所有权": "syqxz='10'",
            "集体土地所有权": "syqxz='30'",
            "村民小组": "syqxz='32'",
            "村级集体经济组织": "syqxz='31'",
            "其他农民集体经济组织": "syqxz='34'"
        }
    },
    {
        "classifyName": "地力等级代码表",
        "classifyType": {
            "一等地": "dldj='01'",
            "二等地": "dldj='02'",
            "三等地": "dldj='03'",
            "四等地": "dldj='04'",
            "五等地": "dldj='05'",
            "六等地": "dldj='06'",
            "七等地": "dldj='07'",
            "八等地": "dldj='08'",
            "九等地": "dldj='09'",
            "十等地": "dldj='10'",
        }
    }, {
        "classifyName": "土地用途",
        "classifyType": {
            "种植业": "tdyt='1'",
            "林业": "tdyt='2'",
            "畜牧业": "tdyt='3'",
            "渔业": "tdyt='4'",
            "非农业用途": "tdyt='5'",

        },

    },
     {
         "classifyName": "是否代码表",
         "classifyType": {
             "是": "sfjbnt='1'",
             "否": "sfjbnt='2'"
         },

     }
    ]
}]