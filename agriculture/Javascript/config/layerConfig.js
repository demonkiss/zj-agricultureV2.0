var layerConfig = {
    "粮食生产功能区": {
       
        "功能区级别": {
            "url": "http://localhost:6080/arcgis/rest/services/lsService/MapServer",
            "array":[0],
            "imgurl": {
                "省级": "images/province.png",
                "市级": "images/city.png",
                "县级": "images/county.png"
            },
            "jsondata": "Json/粮食生产功能区.json",
        },
        "建设状态": {
            "url": "http://localhost:6080/arcgis/rest/services/lsService/MapServer",
            "array": [1],
            "imgurl": {
                "已建": "",
                "在建": "",
                "拟建": ""
            },
            "jsondata": "Json/粮食生产功能区.json",
        }, "建设面积": {
            "url": "http://localhost:6080/arcgis/rest/services/ls_2000/MapServer",
            "array": [0],
            "imgurl": {
                "大于1000亩": "",
                "500~1000亩": "",
                "200~500亩": "",
                "小于200亩": ""
            },
            "jsondata": "Json/粮食生产功能区.json",
        },
        "建设年份": {
            "url": "http://localhost:6080/arcgis/rest/services/ls_2000/MapServer",
            "array": [0],
            "imgurl": {
                "2017": "",
                "2016": "",
                "2015": "",
                "2014": "",
                "2013": "",
                "2012": "",
                "2011": "",
                "2010": ""
            },
            "jsondata": "Json/粮食生产功能区.json",
        }
    },
    "现代农业园区": {
        
        "现代农业综合区": {
            "url": "http://localhost:6080/arcgis/rest/services/ls_2000/MapServer",
            "array": [0],
            "imgurl": {
                "创建点": "",
                "已认证": ""
             
            },
            "jsondata": "Json/粮食生产功能区.json",
        },
        "主导产业示范区": {
            "url": "http://localhost:6080/arcgis/rest/services/xdny/MapServer",
            "array": [0],
            "imgurl": {
                "畜牧类": "",
                "蔬菜瓜果": "",
                "食用菌类": ""
            },
            "jsondata": "Json/主导产业示范区.json",
        }, "特色农业精品区": {
            "url": "http://localhost:6080/arcgis/rest/services/xdny/MapServer",
            "array": [1],
            "imgurl": {
                "畜牧类": "",
                "蔬菜瓜果": "",
                "食用菌类": ""
            },
            "jsondata": "Json/特色农业精品区.json",
        }
    },
    "标准农田": {
     
        "千万亩工程项目": {
            "url": "http://localhost:6080/arcgis/rest/services/nt/MapServer",
            "array": [0],
            "sql":" 区块面积>1000",
            "imgurl": {
                "一等田": "",
                "二等田": "",
                "三等田": ""
                
            },
            "jsondata": "Json/千万亩工程项目.json",
        },
        "标准农田建设区": {
            "url": "http://localhost:6080/arcgis/rest/services/nt/MapServer",
            "array": [0],
            "sql":" 项目名称 like '%农田%' ",
            "imgurl": {
                "建设分布图": ""
              
            },
            "jsondata": "Json/标准农田建设区.json",
        }, "储备项目": {
            "url": "http://localhost:6080/arcgis/rest/services/nt/MapServer",
            "array": [0],
            "imgurl": {
                "一等田": "",
                "二等田": "",
                "三等田": ""
            },
            "jsondata": "Json/标准农田.json",
        }, "提升工程": {
            "url": "http://localhost:6080/arcgis/rest/services/nt/MapServer",
            "array": [0],
            "imgurl": {
                "2017": "",
                "2016": "",
                "2015": "",
                "2014": "",
                "2013": "",
                "2012": "",
                "2011": "",
                "2010": "",
                "2009": ""
            },
            "jsondata": "Json/标准农田.json",
        }
    }
}