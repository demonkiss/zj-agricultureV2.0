var layerConfig = {
    "粮食生产功能区": {

        "功能区级别": {
            "url": "http://localhost:6080/arcgis/rest/services/lsService/MapServer",
            "searchField": "认定名称",
            "array": [0],
            "fieldInfos": [{
                "fieldName": "认定编号",
                "label": "认定编号",
                visible: true
            }, {
                "fieldName": "认定名称",
                "label": "认定名称",
                visible: true
            }, {
                "fieldName": "规划名称",
                //  "label": "By",
                visible: true
            }, {
                "fieldName": "规划编号",
                visible: true
            },
          {
              "fieldName": "建设状态",
              visible: true
          }, {
              "fieldName": "建设等级",

              visible: true
          }, {
              "fieldName": "建设认定年",

              visible: true
          },
         {
             "fieldName": "地市名称",
             visible: true
         }, {
             "fieldName": "县市区名称",

             visible: true
         }],
            "imgurl": {
                "省级": "images/province.png",
                "市级": "images/city.png",
                "县级": "images/county.png"
            },
            "jsondata": "Json/粮食生产功能区.json",
        },
        "建设状态": {
            "url": "http://localhost:6080/arcgis/rest/services/lsService/MapServer",
            "searchField": "认定名称",
            "array": [1],
            "fieldInfos": [{
                "fieldName": "认定编号",
                "label": "认定编号",
                visible: true
            }, {
                "fieldName": "认定名称",
                "label": "认定名称",
                visible: true
            }, {
                "fieldName": "规划名称",
                //  "label": "By",
                visible: true
            }, {
                "fieldName": "县市区名称",

                visible: true
            }],
            "imgurl": {
                "已建": "",
                "在建": "",
                "拟建": ""
            },
            "jsondata": "Json/粮食生产功能区.json",
        }, "建设面积": {
            "url": "http://localhost:6080/arcgis/rest/services/ls_2000/MapServer",
            "array": [0],
            "searchField": "认定名称",
            "fieldInfos": [{
                "fieldName": "认定编号",
                "label": "认定编号",
                visible: true
            }, {
                "fieldName": "认定名称",
                "label": "认定名称",
                visible: true
            }, {
                "fieldName": "认定面积",
                "label": "认定面积",
                visible: true
            }, {
                "fieldName": "县市区名称",

                visible: true
            }],
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
            "searchField": "认定名称",
            "fieldInfos": [{
                "fieldName": "认定编号",
                "label": "认定编号",
                visible: true
            }, {
                "fieldName": "认定名称",
                "label": "认定名称",
                visible: true
            }, {
                "fieldName": "建设认定年",
                "label": "建设认定年",
                visible: true
            }, {
                "fieldName": "县市区名称",

                visible: true
            }],
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
            "searchField": "认定名称",
            "fieldInfos": [{
                "fieldName": "认定编号",
                "label": "认定编号",
                visible: true
            }, {
                "fieldName": "认定名称",
                "label": "认定名称",
                visible: true
            }],
            "imgurl": {
                "创建点": "",
                "已认证": ""

            },
            "jsondata": "Json/粮食生产功能区.json",
        },
        "主导产业示范区": {
            "url": "http://localhost:6080/arcgis/rest/services/xdny/MapServer",
            "array": [0],
            "searchField": "名称",
            "fieldInfos": [{
                "fieldName": "名称",
                "label": "名称",
                visible: true
            }, {
                "fieldName": "产业类型",
                "label": "产业类型",
                visible: true
            }, {
                "fieldName": "建设等级",
                "label": "建设等级",
                visible: true
            }, {
                "fieldName": "建设主体",
                "label": "建设主体",
                visible: true
            }],
            "imgurl": {
                "畜牧类": "",
                "蔬菜瓜果": "",
                "食用菌类": ""
            },
            "jsondata": "Json/主导产业示范区.json",
        }, "特色农业精品区": {
            "url": "http://localhost:6080/arcgis/rest/services/xdny/MapServer",
            "array": [1],
            "searchField": "名称",
            "fieldInfos": [{
                "fieldName": "名称",
                "label": "名称",
                visible: true
            }, {
                "fieldName": "产业类型",
                "label": "产业类型",
                visible: true
            }, {
                "fieldName": "建设等级",
                "label": "建设等级",
                visible: true
            }, {
                "fieldName": "建设主体",
                "label": "建设主体",
                visible: true
            }],
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
            "url": "http://localhost:6080/arcgis/rest/services/bznt/MapServer",
            // "url": "http://192.168.6.132:8080/ArcGIS/rest/services/BZNT/MapServer",
            "searchField": "项目名称",
            "array": [0],
            "fieldInfos": [{
                "fieldName": "项目名称",
                "label": "项目名称",
                visible: true
            }, {
                "fieldName": "县市区名称",
                "label": "县市区名称",
                visible: true
            }, {
                "fieldName": "面积",
                "label": "面积",
                visible: true
            }],
            "imgurl": {
                "一等田": "",
                "二等田": "",
                "三等田": ""

            },
            "jsondata": "Json/千万亩工程项目.json",
        },
        "标准农田建设区": {
            "url": "http://localhost:6080/arcgis/rest/services/bznt/MapServer",
            "array": [1],
            "searchField": "项目名称",
            "fieldInfos": [{
                "fieldName": "项目名称",
                "label": "项目名称",
                visible: true
            }, {
                "fieldName": "县市区名称",
                "label": "县市区名称",
                visible: true
            }, {
                "fieldName": "面积",
                "label": "面积",
                visible: true
            }],
            "imgurl": {
                "建设分布图": ""

            },
            "jsondata": "Json/标准农田建设区.json",
        }, "储备项目": {
            "url": "http://localhost:6080/arcgis/rest/services/bznt/MapServer",
            "array": [2],
            "searchField": "项目名称",
            "fieldInfos": [{
                "fieldName": "项目名称",
                "label": "项目名称",
                visible: true
            }, {
                "fieldName": "县市区名称",
                "label": "县市区名称",
                visible: true
            }, {
                "fieldName": "面积",
                "label": "面积",
                visible: true
            }],
            "imgurl": {
                "一等田": "",
                "二等田": "",
                "三等田": ""
            },
            "jsondata": "Json/标准农田.json",
        }, "提升工程": {
            "url": "http://localhost:6080/arcgis/rest/services/nt/MapServer",
            "array": [0],
            "searchField": "项目名称",
            "fieldInfos": [{
                "fieldName": "项目名称",
                "label": "项目名称",
                visible: true
            }, {
                "fieldName": "县市区名称",
                "label": "县市区名称",
                visible: true
            }, {
                "fieldName": "面积",
                "label": "面积",
                visible: true
            }],
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