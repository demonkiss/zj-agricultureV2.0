var map = null;
var flag1 = true, flag2 = true, flag3 = true, flag4 = true;//地图状态
var viewmap_1, viewmap_2, viewmap_3, viewmap_4;//四屏对比地图
var tree;
var basemap;//初始底图
var initextent;//初始范围
var fullextent;//全幅显示
var dgMapData;//规划展示地图数据
var dgState = 1;//模块状态:1,2,3分别为3个模块的状态
var exchange1, exchange2, exchange3, exchange4;//四图联动事件
var deEl;
var drawState = 0;//0:查询 1：测量 2:量化分析
var mapClick = "";//map点击事件
var toolbar;//地图绘制工具
var fullScreenState = false;
var base_map = [];//底图集合
var layerBox = [];//现有图层集合
var layerSet = []//加载图层集合
var dkLayerSet = [];
var pdfUrl = [];//pdf地址
var imgb = $("#dockeye img");
var mapFilterState = "normal";//底图状态 normal：正常 gray：灰色 sepia：旧照片
var mapChangeWithFilter = "";//地图滤镜事件
var infoWindow;//地图InfoWindow
var ny_layer;
var iQueryDk = "";//I查询
var iQuerySql = "";//I查询sql

var sj_layer;//动态服务临时图层
var currentLayerServiceUrl;//当前加载的图层序号
var currentLayerIndex = [];//当前加载的图层序号
function Main_Map_Start() {
    //自动改变布局
    $(window).resize(function () {
        $("#Main_Map_DIV").height($(window).height());
        $("#Main_Map_DIV").width($(window).width());
        $("#dockeye").css("left", $(window).width() / 2 - 250);
        $("#mask").width($(window).width());
        $("#mask").height($(window).height());
        $(".Four").width($(window).width());
        $(".Four").height($(window).height());
        $(".Two").width($(window).width());
        $(".Two").height($(window).height());
        //  initDg();
        if (dgState === 3) { showPop(); }

        $("#MulitMap").css("left", $(window).width() / 2);
        $("#Measure").css("left", $(window).width() / 2 - 110);
        $("#Spatial").css("left", $(window).width() / 2 - 50);
    });
    $("#Main_Map_DIV").height($(window).height());
    $("#Main_Map_DIV").width($(window).width());
    $("#dockeye").css("left", $("#Main_Map_DIV").width() / 2 - 240);
    $("#MulitMap").css("left", $(window).width() / 2);
    $("#Measure").css("left", $(window).width() / 2 - 110);
    $("#Spatial").css("left", $(window).width() / 2 - 50);
    //  initDg();//初始化进入页面
    // setTimeout("Main_Map_ShowMap();Main_Map_SetEvents();", 500); // 如不这样延时执行，经常出现ID未定义的bug，怀疑是dom没来得及初始化
    setTimeout("Main_Map_ShowMap();Main_Map_SetEvents();", 500);
}

function Main_Map_ShowMap() {
    require(["esri/map", "esri/layers/layer", "esri/layers/GraphicsLayer", "esri/layers/ImageParameters", "TDTLayer", "TDTLayer_Anno", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/dijit/Popup", "esri/toolbars/draw", "dojo/dom-construct", "esri/layers/FeatureLayer", "esri/SpatialReference", "esri/geometry/Extent", "dojo/on", "dojo/dom-class", "dojo/dom-style", "dojo/domReady!"],
        function (Map, Layer, GraphicLayer,ImageParameters, TDTLayer, TDTLayer_Anno,ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer, InfoWindow, Draw, domConstruct, FeatureLayer, SpatialReference, Extent, on, domClass, domStyle) {
            // initextent = new Extent(118.33968849655, 29.1885894750343, 120.75238251614, 30.6257261531396, new SpatialReference({ wkid: 4326 }));
            //  fullextent = new Extent(118.352429227, 29.09551322, 120.709258528, 30.690650616, new SpatialReference({ wkid: 4326 }));
            //清除arcgis/rest/info?=json问题
            esri.config.defaults.io.corsDetection = false;
            map = new Map("Main_Map_DIV", {
                logo: false,
                slider: false,
                center: [120, 30.3],
                zoom: 13,
             //   basemap: "topo",

            });
            var layer = new TDTLayer("img");//影像img 矢量 vec
          //  map.addLayer(layer, 0);
            var annolayer = new TDTLayer_Anno("cia");//影像cia 矢量cva
        //    map.addLayer(annolayer, 1);
            var basemap = "http://www.hangzhoumap.gov.cn/Tile/ArcGISFlex/HZTDTVECTORBLEND.gis";
            basemap = new esri.layers.ArcGISTiledMapServiceLayer(basemap, { id: "basemap" });
            map.addLayer(basemap, 2);

            var updateListener = map.on("update-end", function (err) {
                // do something
                alert();
                loadcluster();
                updateListener.remove();
            });

            //var glayer = new GraphicLayer();
          //  map.addLayer(glayer);
            // var chartLayer = new Layer({ opacity: 0.80, id: 'chartLayer' });
           //  map.addLayer(chartLayer);
            //map.on("layers-add-result", function () {
            //    alert();

            //})
           // layerSet.push(CustomLayers[0]);
       //   initLayerSelction();
            ////图层加载

           
            infoWindow = new InfoWindow(null, domConstruct.create("div", null, null, map.root));
            infoWindow.startup();
            map.setInfoWindow(infoWindow);
            map.on("mouse-move", function (e) {
                //  $(".location p").html(e.mapPoint.x + "," + e.mapPoint.y);
            })
            map.on("click", function (e) {
                console.log(e.mapPoint.x);
            })
            map.on("load", function () {
                alert();
                loadcluster();
            })
          //  loadcluster();
            /*地图绘制事件*/
            toolbar = new Draw(map);
            toolbar.on("draw-complete", GeometryQueryTask);
            //map.on("zoom-end", function (e) {
            //    // console.log(map.getScale());
            //    var scale = Math.round(map.getScale());
            //    $(".scale p").html("当前比例尺：1:" + scale);
            //    if (scale < BaseConfig.ScaleValue) {
            //        if (iQueryDk == "" && currentLayerServiceUrl && currentLayerIndex) {
            //            iQueryDk = map.on("click", function (e) {

            //                if (map.layerIds.length > 2) {

            //                    require(["Javascript/Modules/QueryTask.js"], function (QueryTask) {
            //                        QueryTask.queryByClick(e.mapPoint, currentLayerServiceUrl, currentLayerIndex, iQuerySql);
            //                    });
            //                }
            //            })
            //        }
            //    }
            //    else {

            //        if (iQueryDk != "") {
            //            iQueryDk.remove();
            //            iQueryDk = "";
            //        }

            //    }

            //});
            //数组方法的扩展
            Array.prototype.indexOf = function (val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] === val) return i;
                }
                return -1;
            };
            Array.prototype.remove = function (val) {
                var index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };

            var MapMenu = dojo.query(".MapMenu a");
            on(MapMenu[0], "click", function (e) {
                //  filterReset();
                domClass.remove(MapMenu[1], "Mapsatellite1");
                domClass.add(MapMenu[1], "Mapsatellite");
                domClass.add(MapMenu[0], "Mapmap1");
                showLayer("VECTOR");

            });
            on(MapMenu[1], "click", function (e) {
                //  filterReset();
                domClass.remove(MapMenu[0], "Mapmap1");
                domClass.add(MapMenu[0], "Mapmap");
                domClass.add(MapMenu[1], "Mapsatellite1");
                showLayer("RASTER");

            });
            /*初始化专题目录树*/
            $(document).ready(function () {
              //  getsubArea();
             //   getChartData();
                //  initZjBorder();
               
            });
        })

}
/*切换市县清除加载图层*/
function loadcluster() {
    
        $.ajax({
            url: "Json/20000json.json",
            type: "post",
            
            dataType: 'json',
            success: function (data) {
                var pdata = [];
                //  for (var i = 0; i < data.features.length;i++){
                for (var i = 0; i < 10000; i++) {
                    pdata.push(data.features[i]);
                }

                addClusters(pdata, "粮食生产功能区");


            }

        });
   
  
}
function addClusters(resp, type) {
    require([
      "dojo/parser", "dojo/ready", "dojo/_base/array", "esri/Color", "dojo/dom-style", "dojo/query", "esri/map", "esri/request", "esri/graphic", "esri/geometry/Extent",
      "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/PictureMarkerSymbol",
      "esri/renderers/ClassBreaksRenderer", "esri/layers/GraphicsLayer", "esri/SpatialReference", "esri/dijit/PopupTemplate", "esri/geometry/Point", "esri/geometry/webMercatorUtils",

      "dijit/layout/BorderContainer",
      "dijit/layout/ContentPane",
      "dojo/domReady!"
    ], function (
      parser, ready, arrayUtils, Color, domStyle, query,
      Map, esriRequest, Graphic, Extent,
      SimpleMarkerSymbol, SimpleFillSymbol, PictureMarkerSymbol, ClassBreaksRenderer,
      GraphicsLayer, SpatialReference, PopupTemplate, Point, webMercatorUtils

    ) {
        var clusterLayer;
        var popupOptions = {
            "markerSymbol": new SimpleMarkerSymbol("circle", 20, null, new Color([0, 0, 0, 0.25])),
            "marginLeft": "20",
            "marginTop": "20"
        };
        var photoInfo = {};
        var wgs = new SpatialReference({
            "wkid": 4326
        });
        var testp;
        var infoTemplate;
        photoInfo.data = arrayUtils.map(resp, function (p, i) {
            var latlng = new Point(parseFloat(p.geometry.x), parseFloat(p.geometry.y), wgs);
            testp = latlng;
            var graphic;
            var webMercator = webMercatorUtils.geographicToWebMercator(latlng);

            //   debugger;
            var attributes;

            if (p.dt != undefined) {
                attributes = {
                    "名称": p.name,
                    "数量": p.dt
                };
                infoTemplate = new esri.InfoTemplate("Attributes", "${名称}<br>办件数量：${数量}");
                infoTemplate.setTitle(type);
            } else {
                attributes = {
                    "名称": "test"
                };
                infoTemplate = new esri.InfoTemplate("Attributes", "${名称}");
                infoTemplate.setTitle(type);
            }

            return {
                //"x": latlng.x,
                //"y": latlng.y,
                "x": webMercator.x,
                "y": webMercator.y,

                "attributes": attributes
            };
        });

        // popupTemplate to work with attributes specific to this dataset
        var popupTemplate = new PopupTemplate({
            "title": type,
            "fieldInfos": [{
                "fieldName": "名称",
                visible: true
            }
            ]
        }
            );



        // cluster layer that uses OpenLayers style clustering
        require(["Javascript/js/ClusterLayer.js"], function (ClusterLayer) {
            // debugger;
            clusterLayer = new ClusterLayer({
                "data": photoInfo.data,
                "distance": 100,
                "id": type,
                "labelColor": "#000",
                "showSingles": false,
                "labelOffset": 10,
                "resolution": map.extent.getWidth() / map.width,
                "singleColor": "#888",
                "singleTemplate": infoTemplate,
              //  "spatialReference" :new SpatialReference({ "wkid": 4326 }),
                "maxSingles": 15000
            });
        })

        var defaultSym = new SimpleMarkerSymbol().setSize(4);
        var renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");

        var picBaseUrl = "img/";
        var blue = new PictureMarkerSymbol(picBaseUrl + "marker-blue.png", 28, 52).setOffset(0, 0);
        var green = new PictureMarkerSymbol(picBaseUrl + "marker-green.png", 28, 52).setOffset(0, 0);
        var red = new PictureMarkerSymbol(picBaseUrl + "marker-red.png", 28, 52).setOffset(0, 0);
        if (type == "粮食生产功能区") {
            renderer.addBreak(0, 5000, blue);
        }
        else if (type == "业务监测") {
            renderer.addBreak(0, 5000, green);
        }
        //var graphic = new esri.Graphic(testp, green);
       // map.graphics.add(graphic);
        // renderer.addBreak(2, 200, green);
        // renderer.addBreak(200, 5000, red);

        clusterLayer.setRenderer(renderer);
    
          //  layerCluster.push(clusterLayer);
      

        map.addLayer(clusterLayer);
        //  map.centerAndZoom([120.160361472, 30.2458220636], 6);
        // close the info window when the map is clicked
        map.on("click", cleanUp);
        // close the info window when esc is pressed
        map.on("key-down", function (e) {
            if (e.keyCode === 27) {
                cleanUp();
            }
        });
        function cleanUp() {
            map.infoWindow.hide();
            clusterLayer.clearSingles();
        }


    })
}
function ResetLayer() {
    // $(".classify").attr("disabled", true);
    var rmap = map.getLayer(map.layerIds[0]);
    var rmap_anno = map.getLayer(map.layerIds[1]);
    map.removeAllLayers();
    map.addLayer(rmap, 0);
    map.addLayer(rmap_anno, 1);
    currentLayerIndex = [];
    currentLayerServiceUrl = "";
    //if (toolbar) {
    //    toolbar.deactivate();
    //}
    $(".left_content input[type='checkbox']").attr("checked", false);
    // $(".classify").attr("checked", false);
    // $("./").removeAttr("checked");
}
/* 主图需要绑定的事件 */
function layerChangeEvt(e, value, index) {

    require(["esri/layers/ImageParameters", "esri/layers/ArcGISDynamicMapServiceLayer"],
        function (ImageParameters, ArcGISDynamicMapServiceLayer) {

            if (currentLayerServiceUrl != "") {
                //  var sql = CustomLayers[0].classify[index].classifyType[value];

                // console.log(e);
                if ($(e).attr('checked')) {
                    //var rmap = map.getLayer(layerName);
                    //if (rmap) {
                    //    map.removeLayer(rmap);
                    //    dkLayerSet.remove(layerName);
                    //}
                    //// layerSet.length = 0;
                    //iQuerySql = "";
                    $(e).attr('checked', false);
                    //if (!hasDK(e)) {
                    //    $(".classify").attr("disabled", false);                       
                    //}
                } else {
                    //iQuerySql = sql;
                    //var rmap = map.getLayer(layerName);
                    //if (!rmap) {
                    //    var opacityVal = $(".opacity").slider("value") / 100;
                    //    var qq_not = new ArcGISDynamicMapServiceLayer(currentLayerServiceUrl, { "imageParameters": imageParameters, "id": layerName, "opacity": 0.8 });
                    //    map.addLayer(qq_not, 3);
                    //    dkLayerSet.push(layerName);
                    $(e).attr('checked', true);
                    //if (hasDK(e)) {
                    //    $(".classify").attr("disabled", true);
                    //    $(e).parent().parent().attr('disabled', false);
                    //}
                    //}

                }
                var q_sql = querySQL();

                var layerName = value + index;
                var imageParameters = new ImageParameters();
                imageParameters.layerIds = currentLayerIndex;
                imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
                imageParameters.transparent = true;

                var layerDefs = [];
                layerDefs[currentLayerIndex] = q_sql;
                imageParameters.layerDefinitions = layerDefs;
                //  imageParameters.layerDefinitions = [q_sql];

                var rmap = map.getLayer("querysql");
                if (rmap) {
                    map.removeLayer(rmap);
                    // dkLayerSet.remove(layerName);
                    if ($("#Main_Map_DIV_querysql")) {
                        $("#Main_Map_DIV_querysql").remove();
                    }

                }
                if (q_sql != "") {
                    var qq_not = new ArcGISDynamicMapServiceLayer(currentLayerServiceUrl, { "imageParameters": imageParameters, "id": "querysql", "opacity": 0.6 });
                    map.addLayer(qq_not, 3);
                }


            } else {
                alert("请切换到县级");
                $(e).attr('checked', false);
            }
            // querySQL();
        })
}
function querySQL() {
    var num = 0;
    var sql = "";
    var sql1 = "DKLB IN";
    var sql2 = "TDYT IN";
    var sql_1 = [];
    var sql_2 = [];
    $(".classify input").each(function (i, obj) {
        console.log(i);
        console.log($(obj).attr('checked'));
        if ($(obj).attr('checked')) {
            if ($(obj).parent().parent().find("label").attr("value") == "DKLB") {
                sql_1.push("'" + $(obj).attr('value').toString() + "'");

            } else if ($(obj).parent().parent().find("label").attr("value") == "TDYT") {
                sql_2.push("'" + $(obj).attr('value').toString() + "'");
            }
        }
        num++;
    })
    if (sql_1.length && sql_2.length) {
        sql = sql1 + "(" + sql_1.join(",") + ") and " + sql2 + "(" + sql_2.toString() + ")";
    } else if (sql_1.length && !sql_2.length) {
        sql = sql1 + "(" + sql_1.join(",") + ")";

    }
    else if (!sql_1.length && sql_2.length) {
        sql = sql2 + "(" + sql_2.join(",") + ")";

    } else {
        sql = "";
    }

    console.log(sql);
    //  alert(num);
    return sql;
}
function hasDK(e) {
    var $checkbox = $(e).parent().parent().find("input[type='checkbox']");
    for (var i = 0; i < $checkbox.length; i++) {
        if ($($checkbox[i]).attr('checked')) {
            return true;
        }
    }
    return false;
}
function Main_Map_SetEvents() {
    //给label绑定点击选中事件
    $(".checks").find("label").each(function () {
        $(this).on("click", function () {
            if ($(this).attr("data-state") == "uncheck") {
                $(this).attr("data-state", "check");
                $(this).addClass("active")
            } else {
                $(this).attr("data-state", "uncheck");
                $(this).removeClass("active");
            }
            $(this).prev().trigger("click");
        })
    });
    //切换选择部分的js
    $(".btns").on("click", "li", function () {
        $(this).addClass("active").siblings().removeClass("active");
        var $index = $(this).index();
        $(".content .control").find("ul.second").eq($index).show().siblings("ul.second").hide();
        $(".control").find("ul.second").eq($index).find("li").eq(0).trigger("click");

    });
    $(".control").find(".second").each(function () {
        $(this).on("click", "li", function () {
            $(this).addClass("active").siblings().removeClass("active");
            var $clazz = $(this).attr("class");
            $clazz = $clazz.split(" ");
            $clazz.map(function (item) {
                if (item != "active") {
                    $(".checks").find("." + $clazz).show().siblings("ul").hide();
                }
            })
        })
    });
    $("#function").click(function () {
        $(".content").show();
        $(".content>img").click(function () {
            $(".content").hide();
        })
    })

    $("#Measure img").click(function (e) {
        var clickevt = e.currentTarget.alt;
        if (clickevt == "测量距离") {
            drawState = 1;
            toolbar.activate(esri.toolbars.Draw.POLYLINE);
            map.setMapCursor("crosshair");
        } else {
            drawState = 1;
            toolbar.activate(esri.toolbars.Draw.POLYGON);
            map.setMapCursor("crosshair");
        }



    })
    $("#Spatial img").click(function (e) {
        var clickevt = e.currentTarget.alt;
        if (clickevt == "规划辅助") {
            hidePanel();
            $("#Statistics").css("display", "block");
        } else if (clickevt == "量化分析") {
            hidePanel();
            $("#Total_sum").css("display", "block");
            toolbar.activate(esri.toolbars.Draw.POLYGON);
            map.setMapCursor("crosshair");
            drawState = 2;

        }
    })


    /*DIV可拖动事件*/
    $(".infoListTitle").mousedown(function (e) {
        $("#infoList").draggable();
        $('#infoList').draggable("enable");

        $("#Total_sum").draggable();
        $('#Total_sum').draggable("enable");
    })
    $(".infoListTitle").mouseup(function (e) {
        $('#infoList').draggable("disable");
        $('#Total_sum').draggable("disable");
    })
    $("#Title_sta").mousedown(function (e) {
        $("#Statistics").draggable();
        $('#Statistics').draggable("enable");
    })
    $("#Title_sta").mouseup(function (e) {
        $('#Statistics').draggable("disable");
    })
    //防止点到自身出现位置错误
    $("#infoSimple").click(function () {
        return false;
    })
    /*关闭panel*/
    $(".close-info").on("click", function (e) {
        $("#infoSimple").hide();
    })
    $(".close-panel").on("click", function (e) {
        $(this).parent().parent().css("display", "none");
        imgb.css("border", "none");
        if (map.graphics) {
            map.graphics.clear();
        };
        map.infoWindow.hide();
    })
    //空间分析工具事件
    var toorbarState = false;
    $("#toorbars").click(function (e) {
        $(".btn-group").toggle("slow");
        if (toorbarState) {
            $("#toorbars img").attr("src", "images/Ntool.png");
            toorbarState = false;
        } else {
            $("#toorbars img").attr("src", "images/Ntool2.png");
            toorbarState = true;
        }

    }
    )
    $("#Analyse-tools li").click(function (e) {
        var evt = e.currentTarget.childNodes[0].alt;
        $("#Analyse-tools span").css("color", "#000");
        $(this).children("span").css("color", "#0094ff");
        switch (evt) {

            case "框选查询":
                if (currentLayerServiceUrl != "") {
                    drawState = 0;
                    toolbar.activate(esri.toolbars.Draw.RECTANGLE);
                    map.setMapCursor("crosshair");
                } else {
                    alert("请切换到县级");
                    $(this).children("span").css("color", "#000");
                }
                break;
            case "测量距离":
                drawState = 1;
                if (iQueryDk) {
                    iQueryDk.remove();
                    iQueryDk = "";
                }

                toolbar.activate(esri.toolbars.Draw.POLYLINE);
                map.setMapCursor("crosshair");
                break;
            case "测量面积":
                drawState = 1;
                if (iQueryDk) {
                    iQueryDk.remove();
                    iQueryDk = "";
                }
                toolbar.activate(esri.toolbars.Draw.POLYGON);
                map.setMapCursor("crosshair");
                break;
            case "统计分析":
                if (toolbar) {
                    toolbar.deactivate();
                }
                addChartToMap();
                // $("#Spatial").css("display", "block");
                break;
            case "清除高亮":
                ClearMap();
                hidePanel();
                $("#Analyse-tools span").css("color", "#000");
                break;

        }

    })

    //搜索框事件
    $("#searchBtn").click(function () {
        if (currentLayerServiceUrl != "") {
            var info = $("#searchBox").val();
            require(["Javascript/Modules/QueryTask.js"], function (QueryTask) {
                QueryTask.queryByInput(info);
            })
        } else {
            alert("请切换到县级")
        }
        hidePanel();

    });

    //search-more事件
    $(".search-more").click(function () {
        if ($(".search-more-content").is(":hidden")) {
            $(this).css("background-image", "url(img/searchX.png)");
            $("#addressInfo").css("display", "none");
            $(".search-more-content").css("display", "block");
        }
        else {
            $(this).css("background-image", "url(img/searchMore.png)")
            $(".search-more-content").css("display", "none");
            $("#listbox").empty();
            $("#addressInfo").css("display", "none");
            if (map.graphics.graphics.length != 0) {
                map.graphics.clear();
            };
            map.infoWindow.hide();
        };

        //是否隐藏

    })
    $(".search-more-btn").click(function () {
        if (currentLayerServiceUrl != "") {
            var DKLB = $("#dkType select").val();
            var DKBM = $(".search-more-content input[key='DKBM']").val();
            var DKMC = $(".search-more-content input[key='DKMC']").val();
            var CBFDBXM = $(".search-more-content input[key='CBFDBXM']").val();
            var FBFMC = $(".search-more-content input[key='FBFMC']").val();
            //  console.log(DKBM, DKMC);
            var sql;
            if (DKLB) {
                sql = DKLB + " AND ";
            }

            if (DKBM) {
                sql += "DKBM LIKE '%" + DKBM + "%' AND ";
            } else {
                sql += " 1=1 AND ";
            }

            if (DKMC) {
                sql += "DKMC LIKE '%" + DKMC + "%' AND ";
            } else {
                sql += " 1=1 AND ";
            }
            if (CBFDBXM) {
                sql += "CBFDBXM LIKE '%" + CBFDBXM + "%' AND ";
            } else {
                sql += " 1=1 AND";
            }
            if (FBFMC) {
                sql += "FBFMC LIKE '%" + FBFMC + "%'";
            } else {
                sql += " 1=1";
            }
            //  console.log(sql);
            if (sql) {
                require(["Javascript/Modules/QueryTask.js"], function (QueryTask) {
                    QueryTask.queryByConditon(sql);
                })
            }
        } else {
            alert("请切换到县级");
        }


    })
    //隐藏左侧内容
    //var oBtn1 = document.getElementById("btn1");
    //var oLeft = document.getElementById("left");
    //oBtn1.onclick = function () {
    //    if (this.className == "out") {
    //        startMove(oLeft, { left: -250 },
    //                  function () {
    //                      oBtn1.src = "images/icon6.png";
    //                      oBtn1.className = "out2"
    //                  });
    //    } else {
    //        startMove(oLeft, { left: 19 },
    //                  function () {
    //                      oBtn1.src = "images/icon5.png";
    //                      oBtn1.className = "out"
    //                  });
    //    }
    //}
    //框选查询结果事件
    //$('.results').on('mouseover mouseout', ".menuli", function (event) {
    //    if (event.type == 'mouseover') {
    //        // do something on mouseover  
    //        $(this).css("background-color", "#e7e7e7");
    //    } else {
    //        // do something on mouseout  
    //        $(this).css("background-color", "#fff");
    //    }
    //});
    $(".results").on('click', ".menuli", function (e) {
        var li_list = $("#infoList li");
        li_list.css("background-color", "transparent");
        $(this).css("background-color", "#0094ff");

        var name = $(this).context.innerText;
        var objid = $(this).attr("alt");
        var index = $(this).index();

        var layerIndex = 0;
        require(["Javascript/Modules/QueryTask.js"], function (QueryTask) {
            if (objid != "0") {
                QueryTask.ShowDetailBox(index, layerIndex);
            }

        })
    })
    $("#listbox").on('click', "li", function (e) {
        var li_list = $("#listbox li");
        li_list.css("background-color", "transparent");
        $(this).css("background-color", "#0094ff");

        var name = $(this).context.innerText;
        var objid = $(this).attr("alt");
        var index = $(this).index();

        var layerIndex = 0;
        require(["Javascript/Modules/QueryTask.js"], function (QueryTask) {
            if (objid != "0") {
                QueryTask.ShowDetailBox(index, layerIndex);
            }

        })
    })
    //require(["../Javascript/Modules/SpatialAnaysis.js"], function (initTablePage) {
    //    initTablePage.initTablePage();

    //});
}
function initLayerSelction() {

    for (var i = 0; i < CustomLayers[0].classify.length; i++) {
        var layerHtml = "<div class='classify'>"
                     + "<label class='classify-title' value=" + CustomLayers[0].classify[i].classifyField + ">" + CustomLayers[0].classify[i].classifyName + "</label>";
        var keys = CustomLayers[0].classify[i].classifyType;
        for (key in keys) {
            layerHtml += " <label class='checkbox-inline layer-type'>"
              + "  <input type='checkbox' value='" + keys[key] + "' onclick=\"layerChangeEvt(this,\'" + key + "\'," + i + ")\"><span>" + key + "</span>"
            + " </label>";
        }
        layerHtml += "</div>";
        $(".left_content").append(layerHtml);
    }
}
//根据承包人获取旗下相关地块
function getCbrArea(e) {
    var name = $(e).attr("value");
    //  alert(name);
    require(["Javascript/Modules/QueryTask.js"], function (QueryTask) {
        QueryTask.queryByName(name);
    });
    // queryByName(name);
}
var map_chart;//监听图表随地图变化事件
var has_chart = false;//判断地图有没有统计图
var series;//统计图数据
function getChartData() {
    $.ajax({
        url: "Json/hz.json",
        dataType: 'json',
        async: true,
        data: {},
        success: function (data) {
            // alert("");
            series = data;
        }
    })
}
var mapMoveChart;
function getCityChart(cityName) {
    $.ajax({
        url: "Json/chart/" + cityName + ".json",
        dataType: 'json',
        async: true,
        data: {},
        success: function (data) {
            // alert("");
            var series = data;
            if ($(".chartDOM")) {
                $(".chartDOM").remove();
            }
            for (var i = 0; i < series.length; i++) {
                var screenPoint = geoCoord2Pixel(series[i].lat, series[i].lng);
                createChart(series[i], series[i].name, screenPoint[0], screenPoint[1]);
            }
            mapMoveChart = map.on("extent-change", function () {
                for (var i = 0; i < series.length; i++) {
                    var screenPoint = geoCoord2Pixel(series[i].lat, series[i].lng);
                    $("#" + series[i].name).css("left", screenPoint[0] - 75);
                    $("#" + series[i].name).css("top", screenPoint[1] - 75);
                }
            });

        }
    })

}
function initZjBorder() {
    require(["esri/geometry/Polygon", "esri/symbols/PictureMarkerSymbol", "esri/Color", "esri/graphic", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol"], function (Polygon, PictureMarkerSymbol, Color, Graphic, SimpleLineSymbol, SimpleFillSymbol) {
        $.ajax({
            url: "Json/zhejiang.json",
            dataType: 'json',
            async: true,
            data: {},
            success: function (data) {
                // alert("");
                console.log(data);
                for (var i = 0; i < data.features.length; i++) {

                    var polygonJson = {
                        "rings": data.features[i].geometry.coordinates,
                        "spatialReference": { "wkid": 4326 }
                    };
                    var polygon = new Polygon(polygonJson);
                    var attr = { "name": data.features[i].properties.name, "已确权": data.features[i].properties.confirm, "未确权": data.features[i].properties.noConfirm };
                    var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 255]), 4), new Color([221, 229, 241, 0.2]));
                    // console.log(pu);
                    var graphic = new Graphic(polygon, sfs, attr);
                    map.graphics.add(graphic);

                }
            }
        })
        //var graphicMoveOn = map.graphics.on("mouse-move", function (e) {
        //    //get the associated node info when the graphic is clicked
        //    var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        //   new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
        //  new Color([0, 0, 255]), 4), new Color([98, 194, 204, 0.8])
        // );

        //    e.graphic.setSymbol(symbol);
        //  //  var attr = e.graphic.attributes;
        // //   var html = "<span>"+attr.name + "</span><p><br/> 未确权:" + attr.未确权 + "<br/>已确权:" + attr.已确权+"</p>";
        // //   $("#cityInfo").html(html);
        // //   $("#cityInfo").css({ "display": "block", "top": $(window).height() / 2, "left": $(window).width() / 2 })

        //});
        //var graphicMoveOut = map.graphics.on("mouse-out", function (e) {
        //    //get the associated node info when the graphic is clicked
        //    var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        //   new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
        //  new Color([0, 0, 255]), 4), new Color([221, 229, 241, 0.2])
        // );
        //    e.graphic.setSymbol(symbol);
        //  //  $("#cityInfo").css("display", "none");

        //});
    });
}
//添加图表
function addChartToMap() {
    // 基于准备好的dom，初始化echarts图表

    if (!has_chart && series) {
        for (var i = 0; i < series.length; i++) {
            var screenPoint = geoCoord2Pixel(series[i].lat, series[i].lng);
            showBorder("330100", series[i].name);
            createChart(series[i], series[i].name, screenPoint[0], screenPoint[1]);
        }
        map_chart = map.on("extent-change", function () {
            for (var i = 0; i < series.length; i++) {
                var screenPoint = geoCoord2Pixel(series[i].lat, series[i].lng);
                $("#" + series[i].name).css("left", screenPoint[0] - 75);
                $("#" + series[i].name).css("top", screenPoint[1] - 75);
            }
        });
        has_chart = true;
    } else {
        for (var i = 0; i < series.length; i++) {
            removeChart(series[i].name);
        }
        $("#Analyse-tools span").css("color", "#000");
        map.graphics.clear();
        map_chart.remove();
        has_chart = false;
    }


}
//创建图表
function createChart(serie, divid, x, y) {
    var div = document.createElement('div');
    div.id = divid;
    div.className = "chartDOM";
    div.style.position = 'absolute';
    div.style.height = 150 + 'px';
    div.style.width = 150 + 'px';
    div.style.zIndex = 99;
    div.style.top = Number(y - 110);
    div.style.left = Number(x - 110);
    // console.log(x, y);
    // div.class = 'chart';
    document.getElementById('Main_Map_DIV_container').appendChild(div);
    //   document.getElementById('Main_Map_DIV_chartLayer').appendChild(div);
    //
    // document.body.appendChild(div);
    var myChart = echarts.init(document.getElementById(divid));
    window.onresize = myChart.resize;
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}:{c}({d}%)"
        },
        series: [serie]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    $("#" + divid).css("left", x - 75);
    $("#" + divid).css("top", y - 75);

}
//移除统计图
function removeChart(divid) {
    document.getElementById("Main_Map_DIV_container").removeChild(document.getElementById(divid));

}
// 经纬度转换为屏幕像素  
function geoCoord2Pixel(lat, lng) {
    var pos;
    require(["esri/geometry/Point"], function (Point) {
        var point = new Point(lat, lng);
        pos = map.toScreen(point);

    })
    return [pos.x, pos.y];
};
// 获取各地区
function getsubArea(i) {
    ResetLayer();
    var areaId = $("#areaId").val();

    if (map != undefined && areaId == "") {
        map.centerAndZoom([120.19, 30.26], 8);
    }

    if (areaId == "") {
        document.getElementById("areaName").innerHTML = "浙江省";
        document.getElementById("areaNum").innerHTML = "";
        var htm = "";
        $.ajax({//生成各县级
            url: 'Json/area.xml',
            dataType: 'xml',
            success: function (data) {

                $(data).find("root").find("sjzone").each(function (index, ele) {
                    var id = $(ele).attr("id");
                    var value = $(ele).attr("value");
                    var name = $(ele).attr("name");


                    htm += "<span onclick='clickSArea(" + id + ")' class='pt' id='std" + (index + 1) + "'>" + name + "(<em class  ='areaNum" + id + "'>" + value + "</em>)</span>";
                })
                $("#city").empty();
                $("#city").append(htm);

            }
        })


        //var htm = "";

        //htm += "<span onclick='clickSArea(3302);' class='pt' id='std" + 2 + "'>宁波市(<em id='areaNum3302'>0</em>)</span>";
        //htm += "<span onclick='clickSArea(3303);' class='pt' id='std" + 3 + "'>温州市(<em id='areaNum3303'>0</em>)</span>";
        //htm += "<span onclick='clickSArea(3304);' class='pt' id='std" + 4 + "'>嘉兴市(<em id='areaNum3304'>0</em>)</span>";
        //htm += "<span onclick='clickSArea(3305);' class='pt' id='std" + 5 + "'>湖州市(<em id='areaNum3305'>0</em>)</span>";
        //htm += "<span onclick='clickSArea(3306);' class='pt' id='std" + 6 + "'>绍兴市(<em id='areaNum3306'>0</em>)</span>";
        //htm += "<span onclick='clickSArea(3307);' class='pt' id='std" + 7 + "'>金华市(<em id='areaNum3307'>27179</em>)</span>";
        //htm += "<span onclick='clickSArea(3308);' class='pt' id='std" + 8 + "'>衢州市(<em id='areaNum3308'>0</em>)</span>";
        //htm += "<span onclick='clickSArea(3309);' class='pt' id='std" + 9 + "'>舟山市(<em id='areaNum3309'>0</em>)</span>";
        //htm += "<span onclick='clickSArea(3310);' class='pt' id='std" + 10 + "'>台州市(<em id='areaNum3310'>0</em>)</span>";
        //htm += "<span onclick='clickSArea(3311);' class='pt' id='std" + 11 + "'>丽水市(<em id='areaNum3311'>0</em>)</span>";


    } else {

        $.ajax({//生成各县级
            url: 'Json/area.xml',
            dataType: 'xml',
            success: function (data) {
                var html = "";
                $(data).find("root").find("sjzone").each(function (index, ele) {
                    var id = $(ele).attr("id");
                    //  var url = $(ele).attr("url");

                    if (areaId == id) {
                        document.getElementById("areaName").innerHTML = $(ele).attr("name");
                        document.getElementById("areaNum").innerHTML = "(共" + $(ele).attr("value") + "个)";
                        var lat = Number($(ele).attr("lat"));
                        var lng = Number($(ele).attr("lng"));
                        //  var hasSjvalue = $(ele).attr("value");
                        //var sjvalue = 0;
                        //if (hasSjvalue) {
                        //    sjvalue = hasSjvalue;
                        //}
                        if (map != undefined) {
                            map.centerAndZoom([lat, lng], 8);
                            //  if (map.getLayer("sjLayer")) {

                            //     map.removeLayer(map.getLayer("sjLayer"));
                            //    }

                            //sj_layer = new ArcGISDynamicMapServiceLayer(url, { "imageParameters": imageParameters, "id": "sjLayer ", "opacity": 0.8 });
                            //  map.addLayer(sj_layer, 3);                                         
                            //  sj_layer.setVisibleLayers([]);


                        }
                        $(ele).find("xjzone").each(function (indexx, elex) {
                            var xjid = $(elex).attr("id");
                            var xjName = $(elex).attr("name");
                            var xjLat = $(elex).attr("lat");
                            var xjLng = $(elex).attr("lng");
                            var hasXjvalue = $(elex).attr("value");
                            var url = $(elex).attr("url");
                            var layerindex;
                            if ($(elex).attr("layerindex") != "") {
                                layerindex = $(elex).attr("layerindex");
                            } else {
                                layerindex = 0;
                            }
                            var xjvalue = 0;
                            if (hasXjvalue) {
                                xjvalue = hasXjvalue;
                            }
                            html += "<span onclick='clickArea(" + xjid + ",\"" + xjName + "\"," + xjLat + "," + xjLng + "," + layerindex + ",\"" + url + "\");' class='pt' id='xjtd" + xjid + "'>" + xjName + "(<em id='areaNum" + xjid + "'>" + xjvalue + "</em>)</span>";
                        });
                    }
                });

                $("#city").empty();
                $("#city").append(html);
            }
        });
    }

    var sjname = $('#areaId option:selected').text();
    var sjid = $('#areaId option:selected').val() + "00";
    // showSjBorder(sjid, sjname);
    //   getCityChart(sjname);
    //计算数量
    //getNumsByAreaCode();
    //if (map != undefined) {
    //    loadGetPointData();
    //}
}
//显示市级边界
function showSjBorder(id, name) {
    if (map.graphics) {
        $.ajax({
            url: "Json/zj/" + name + ".json",
            dataType: 'json',
            async: true,
            data: {},
            success: function (data) {
                // console.log(data);
                if (!has_chart) {
                    map.graphics.clear();
                }
                for (var i = 0; i < data.features.length; i++) {
                    //  if (data.features[i].properties["name"] == name) {
                    require(["esri/geometry/Polygon", "esri/symbols/PictureMarkerSymbol", "esri/Color", "esri/graphic", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol"], function (Polygon, PictureMarkerSymbol, Color, Graphic, SimpleLineSymbol, SimpleFillSymbol) {
                        var polygonJson = {
                            "rings": data.features[i].geometry.coordinates,
                            "spatialReference": { "wkid": 4326 }
                        };
                        var polygon = new Polygon(polygonJson);
                        var pu = new Polygon(data.features[i].geometry.coordinates);
                        var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 255]), 4), new Color([221, 229, 241, 0.5]));
                        //  console.log(pu);
                        var graphic = new Graphic(polygon, sfs);
                        map.graphics.add(graphic);
                    });
                    //    break;
                    //}
                }
            }
        });
    }
}
function showXjBorder(id, name) {
    $.ajax({
        url: "Json/city/" + id + ".json",
        dataType: 'json',
        async: true,
        data: {},
        success: function (data) {
            for (var i = 0; i < data.features.length; i++) {
                if (data.features[i].properties['name'] == name) {
                    require(["esri/geometry/Polygon", "esri/symbols/PictureMarkerSymbol", "esri/Color", "esri/graphic", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol"], function (Polygon, PictureMarkerSymbol, Color, Graphic, SimpleLineSymbol, SimpleFillSymbol) {
                        var polygonJson = {
                            "rings": data.features[i].geometry.coordinates,
                            "spatialReference": { "wkid": 4326 }
                        };
                        var polygon = new Polygon(polygonJson);
                        var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 255]), 4), new Color([221, 229, 241, 0.5]));
                        var graphic = new Graphic(polygon, sfs);
                        map.graphics.add(graphic);
                    });
                    break;
                }
            }
        }
    })
}
//各区点击事件
function clickSArea(i) {

    $("#areaId").val(i);
    // ResetLayer();
    getsubArea(i);

}
//各县点击事件
function clickArea(xjid, xjname, lat, lng, layerindex, url) {
    ResetLayer();
    currentLayerServiceUrl = url;
    currentLayerIndex = [layerindex];

    if (map != undefined) {
        map.centerAndZoom([lat, lng], 11);
        //sj_layer.setVisibleLayers([layerindex]);
    }
    if (map.graphics.graphics.length) {
        map.graphics.clear();
    }
    //  $(".classify").attr("disabled", false);
    //如果按下的pt
    if ($("#xjtd" + xjid).attr("class") == "pt") {
        $(".ptdown").each(function (index, ele) {
            $(ele).removeClass();
            $(ele).addClass("pt");
        });
        $("#xjtd" + xjid).removeClass();
        $("#xjtd" + xjid).addClass("ptdown");
    } else {
        $("#xjtd" + xjid).removeClass();
        $("#xjtd" + xjid).addClass("pt");
    }
    var fileid = xjid.toString().substring(0, 4) + "00";
    //  showXjBorder(fileid, xjname);显示县级边界
    // loadGetPointData(xjid);
}
//开始移动 隐藏div
function startMove(obj, json, fn) {
    clearInterval(obj.timer)
    obj.timer = setInterval(function () {
        var flag = true
        for (var sdl in json) {
            if (sdl == "opacity") {
                var oStyle = Math.round(parseFloat(getStyle(obj, sdl)) * 100);
            } else {
                var oStyle = parseInt(getStyle(obj, sdl))
            }
            var speed = (json[sdl] - oStyle) / 8;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)
            if (json[sdl] != oStyle) {
                flag = false
            }
            else { }
            if (sdl == "opacity") {
                obj.style.filter = 'alpha(opacity:' + (oStyle + speed) + ')'
                obj.style.opacity = (oStyle + speed) / 100;
            }
            else {
                obj.style[sdl] = oStyle + speed + "px";
            }
        }
        if (flag) {
            clearInterval(obj.timer);
            if (fn) {
                fn();
            }
        }
    }, 30)
}
function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr];
    }

}

/*改变图层透明度*/
function changeOpacity() {
    var divNodes = [];
    var opacityVal;

    if (layerSet) {
        layerSet.forEach(function (layer) {
            opacityVal = layer.transparent;
            if (layer.datatype == "DynamicLayer") {
                layer.queryarray.forEach(function (e) {
                    var layerId = layer.text + e;
                    var divNode = "Main_Map_DIV_" + layerId;
                    divNodes.push(divNode);
                })
            } else if (layer.datatype == "Tiled") {
                var layerId = "tiled" + layer.nodeId;
                var divNode = "Main_Map_DIV_" + layerId;
                divNodes.push(divNode);
            }

        })
    }
    divNodes.forEach(function (divNode) {
        $("#" + divNode).css("opacity", opacityVal)
    })
    // $("#" + divNode).css("opacity", opacityVal)


}
/*规划成果--初始化地图*/
function initZtMap() {

    $("#dockeye").fadeIn(500);


    /*工具栏事件*/
    $("#dockeye").delegate("img", "click", function (e) {

        var clickevt = e.currentTarget.alt;
        var imgb = $("#dockeye img");
        imgb.css("border", "none");
        var cur = $(this).css("border", "3px  solid #0094ff");
        toolbarEvent(clickevt);
    });
    deEl = document.getElementById('dockeye').getElementsByTagName('img');
    deW = deEl[0].naturalWidth * 1.5;
    mmove(999);
    document.onmousemove = mmove;
    document.getElementById("dockeye").style.height = deW * 0.5 + "px";
    document.getElementById("dockeye").style.width = 550 + "px";

    $("#listbox").delegate("li", "click", (function (e) {
        $("#listbox li").removeClass("ba_color");
        $(this).addClass("ba_color");
        var name = $(this).context.innerText;
        var index = $(this).index();
        require(["Javascript/Modules/AddressQuery.js"], function (AddressQuery) {
            AddressQuery.PointLocation(index);
        })
    }));
    /*结果列表点击事件*/
    $(".results").delegate("li", "click", (function (e) {
        var layerName = $(this).parent().parent().attr("id");
        var layerIndex;
        if (field_keys) {
            field_keys.forEach(function (field, i) {
                if (field.field_layer == layerName) {
                    layerIndex = i;
                }
            })
        }


        var name = $(this).context.innerText;
        var objid = $(this).attr("alt");
        var li_list = $("#infoList li");
        li_list.css("background-color", "transparent");
        $(this).css("background-color", "#e7e7e7");
        var index;
        for (var i = 0; i < li_list.length; i++) {
            if (li_list[i].attributes["alt"].value === objid) {
                index = i;
                break;
            }

        }
        require(["Javascript/Modules/IdentifyTask.js"], function (IdentifyTask) {
            if (objid != "0") {
                IdentifyTask.ShowDetailBox(index, layerIndex);
            }

        })

    }));
    $("#searchBox").keyup(function () {
        $("#clearList").css("display", "block");
    })
    $("#clearList").on("click", function (e) {
        map.infoWindow.hide();
        $("#searchBox").val("");
        if (map.graphics.graphics.length != 0) {
            map.graphics.clear();
        }
        $("#listbox").empty();
        $(this).hide();
    })
    /*地图filter*/
    mapFliterEvents();

    /*关闭panel*/
    $(".close-panel").on("click", function (e) {
        $(this).parent().parent().css("display", "none");
        imgb.css("border", "none");
        if (map.graphics) {
            map.graphics.clear();
        };
        map.infoWindow.hide();
    })
    $(".close-info").on("click", function (e) {
        $("#infoSimple").hide();
    })
}
/*远程获取json*/
function getJson(url) {
    var data;
    $.ajax({
        url: url,
        dataType: 'text',
        async: false,
        data: {},
        success: function (json) {
            data = eval("(" + json + ")");
        }
    });
    return data;
}

/*规划成果--工具条*/
function mmove(evt) {
    var posi = new Object();

    if (!evt) { posi.x = window.event.clientX; posi.y = window.event.clientY; } // IE
    else if (evt === 999) { posi.x = 1; posi.y = 1; }
    else { posi.x = evt.pageX + document.body.scrollLeft; posi.y = evt.pageY + document.body.scrollTop; } // Firefox
    for (var i = 0; i < deEl.length; i++) {
        var pow_value = Math.pow(Math.round(Math.sqrt(Math.pow((posi.x - (deEl[i].offsetLeft + document.getElementById('dockeye').offsetLeft) - deEl[i].offsetWidth / 2), 2) + Math.pow((posi.y - (deEl[i].offsetTop + document.getElementById('dockeye').offsetTop) - deEl[i].offsetHeight / 2), 2))), 2);
        var c = deW - 35 - pow_value / (deW * 4);
        deEl[i].style.width = ((c < (deW / 2)) ? (deW / 2) : c) + 'px';
        deEl[i].style.marginTop = deW - deEl[i].offsetHeight - 60 + 'px';
        deEl[i].style.visibility = 'visible';
    }
}
function toolbarEvent(evt) {
    if (mapClick == null || mapClick === "" || typeof mapClick === "undefined") {
    }
    else { mapClick.remove(); }
    hidePanel();
    switch (evt) {
        case "I查询":
            mapClick = map.on("click", IdentifyGeometry);
            break;
        case "框查询":
            drawState = 0;
            toolbar.activate(esri.toolbars.Draw.RECTANGLE);
            map.setMapCursor("crosshair");
            break;
        case "测量":
            $("#Measure").css("display", "block");
            break;
        case "测量距离":
            drawState = 1;
            toolbar.activate(esri.toolbars.Draw.POLYLINE);
            map.setMapCursor("crosshair");
            break;
        case "测量面积":
            drawState = 1;
            toolbar.activate(esri.toolbars.Draw.POLYGON);
            map.setMapCursor("crosshair");
            break;
        case "统计":
            $("#Spatial").css("display", "block");

            break;
        case "多图对比":
            $("#MulitMap").css("display", "block");

            break;
        case "删除数据":
            var selectedNode = $('#tree').treeview('getSelected');
            selectedNode.forEach(function (node) {
                node.state.selected = false;
            })
            // layerSet.length = 0;
            ClearMap();
            $('#tree').treeview('collapseAll', { silent: false });
            var rmap = map.getLayer(map.layerIds[0]);
            map.removeAllLayers();
            var $svg = $("#Main_Map_DIV_gc");
            $("#Main_Map_DIV_layers").empty();
            $("#Main_Map_DIV_layers").append($svg);
            // if ($("#layerControl").is(":empty")) {
            if ($("#layerControl").has("span").length) {
                $("#layerControl").empty();
            }
            map.addLayer(rmap, 0);
            imgb.css("border", "none");
            break;
        case "删除图标":
            if (map.graphics) {
                if (map.graphics.graphics.length != 0) {
                    map.graphics.clear();
                }
            }
            imgb.css("border", "none");
            break;
        case "图层控制":
            $("#sortable").css("display", "block");
            $("#layerControl").sortable({ stop: mapSort });
            $("#layerControl").disableSelection();
            break;
        case "全屏":
            if (fullScreenState) {
                // exitFullScreen();
                exitFullscreen();
                fullScreenState = false;
            }
            else {
                launchFullScreen(document.documentElement);
                fullScreenState = true;
            }

            break;
        case "帮助":
            alert("正在建设中...");
            imgb.css("border", "none");
            break;
        default: break;
    }
}


/*规划成果--Draw-Complete事件*/
function GeometryQueryTask(e) {

    if (map.graphics.graphics.length != 0) {
        map.graphics.clear();
    };

    require(["Javascript/Modules/QueryTask.js", "Javascript/Modules/MeasureTask.js", "Javascript/Modules/SpatialAnaysis.js"], function (QueryTask, MeasureTask, SpatialAnaysis) {
        ClearMap();
        if (drawState === 0) {
            QueryTask.queryBySelect(e.geometry, iQuerySql);
            // IdentifyTask.DoQueryTask(e.geometry);

        }
        else if (drawState === 1) {
            hidePanel();
            MeasureTask.MeasureMethod(e.geometry);
        }
        else if (drawState === 2) {
            SpatialAnaysis.SpatialAnalysis(e.geometry);
            return;
        }
    })

}
/*规划成果--地图滤镜*/
function mapFliterEvents() {
    $("#gray").on("click", function () {
        // filterchange("gray");
        var url = "";
        if (map.layerIds.length > 0)
            var rmap = map.getLayer(map.layerIds[0]);
        if (rmap.url.indexOf("VECTOR") != -1 || rmap.url.indexOf("vector") != -1) {
            for (i = 0; i < base_map.length; i++) {
                if (base_map[i].name === "VECTOR") {
                    url = base_map[i].url;
                }
            }
        }
        if (rmap.url.indexOf("RASTER") != -1 || rmap.url.indexOf("raster") != -1) {
            for (i = 0; i < base_map.length; i++) {
                if (base_map[i].name === "RASTER") {
                    url = base_map[i].url;
                }
            }
        }
        var baseUrl = url.replace(".gis", "/(GRAY).gis");
        var basemap = new esri.layers.ArcGISTiledMapServiceLayer(baseUrl, { id: "basemap" });

        map.removeLayer(rmap);
        map.addLayer(basemap, 0);
    })
    $("#normal").on("click", function () {
        //filterchange("normal");
        var baseUrl = "";
        if (map.layerIds.length > 0)
            var rmap = map.getLayer(map.layerIds[0]);
        if (rmap.url.indexOf("VECTOR") != -1 || rmap.url.indexOf("vector") != -1) {
            for (i = 0; i < base_map.length; i++) {
                if (base_map[i].name === "VECTOR") {
                    baseUrl = base_map[i].url;
                }
            }
        }
        if (rmap.url.indexOf("RASTER") != -1 || rmap.url.indexOf("raster") != -1) {
            for (i = 0; i < base_map.length; i++) {
                if (base_map[i].name === "RASTER") {
                    baseUrl = base_map[i].url;
                }
            }
        }
        var basemap = new esri.layers.ArcGISTiledMapServiceLayer(baseUrl, { id: "basemap" });
        if (map.layerIds.length > 0)
            var rmap = map.getLayer(map.layerIds[0]);
        map.removeLayer(rmap);
        map.addLayer(basemap, 0);

    })
    $("#sepia").on("click", function () {
        // filterchange("sepia");
        if (map.layerIds.length > 0)
            var rmap = map.getLayer(map.layerIds[0]);
        var url = rmap.url;
        //var baseUrl = url.replace(".gis", "/(HSL_40_55_22).gis");
        var baseUrl = url.replace(".gis", "/(SEPIA).gis");
        var basemap = new esri.layers.ArcGISTiledMapServiceLayer(baseUrl, { id: "basemap" });

        map.removeLayer(rmap);
        map.addLayer(basemap, 0);
    })
}
function filterchange(type) {
    var isIE = !!window.ActiveXObject || "ActiveXObject" in window;
    var grayimg = document.getElementById('Main_Map_DIV_basemap').getElementsByTagName('img');
    var JQimg = $("#Main_Map_DIV_basemap img");
    switch (type) {
        case "normal":
            if (isIE) {
                grayscale.reset(grayimg);
            }
            else {
                switch (mapFilterState) {
                    case "gray":
                        mapChangeWithFilter.remove();
                        $("#Main_Map_DIV_basemap img").removeClass("gray");
                        break;
                    case "sepia":
                        mapChangeWithFilter.remove();
                        $("#Main_Map_DIV_basemap img").removeClass("sepia");
                        break;
                    default:
                        break;
                }
            }
            mapFilterState = "normal";
            break;
        case "gray":

            if (isIE) {
                //  var grayimg = document.getElementById('aa').getElementsByTagName('img');
                var JQimg = $("#aa img");
                grayscale(grayimg);
            }
            else {
                if (mapFilterState != "normal") {
                    $("#Main_Map_DIV_basemap img").removeClass(mapFilterState);
                }
                $("#Main_Map_DIV_basemap img").addClass(type);
                if (mapChangeWithFilter != "") {
                    mapChangeWithFilter.remove();
                }
                mapChangeWithFilter = map.on("extent-change", function () {
                    $("#Main_Map_DIV_basemap img").addClass(type);
                });
            }
            mapFilterState = "gray";
            break;
        case "sepia":
            if (isIE) {
                grayscale(grayimg);
            }
            else {
                if (mapFilterState != "normal") {
                    $("#Main_Map_DIV_basemap img").removeClass(mapFilterState);
                }
                $("#Main_Map_DIV_basemap img").addClass(type);
                if (mapChangeWithFilter != "") {
                    mapChangeWithFilter.remove();
                }
                mapChangeWithFilter = map.on("extent-change", function () {
                    $("#Main_Map_DIV_basemap img").addClass(type);
                });
            }
            mapFilterState = "sepia";
            break;
        default:
            break

    }


}
function filterReset() {
    if (mapChangeWithFilter != "") {
        mapChangeWithFilter.remove();
    }
    mapFilterState = "normal";
}
/*规划成果--I查询事件*/
function IdentifyGeometry(e) {
    if (map.layerIds.length > 1) {

        require(["Javascript/Modules/IdentifyTask.js"], function (idenT) {
            if (layerSet.length === 0) {
                alert("未加载图层");
            }
            else {
                var topindex = layerBox.length;
                var queryLayerName = layerBox[topindex - 1];
                var para;
                for (var i = 0; i < layerSet.length; i++) {
                    if (layerSet[i].text === queryLayerName) {
                        para = layerSet[i];
                    }
                }
                IdenTask = idenT;
                if (para.queryurl != "") {
                    IdenTask.DoIdentify(e.mapPoint, para.queryurl, para.queryarray);
                }

            }

        });
    }
}
/*规划成果--切换基础底图*/
function showLayer(maptype) {
    require(["TDTLayer", "TDTLayer_Anno"], function (TDTLayer, TDTLayer_Anno) {
        if (maptype == "VECTOR") {
            if (map.layerIds.length > 0) {
                var rmap = map.getLayer(map.layerIds[0]);
                var rmap_anno = map.getLayer(map.layerIds[1]);
                map.removeLayer(rmap);
                map.removeLayer(rmap_anno);
            }
            var layer = new TDTLayer("vec");//影像img 矢量 vec
            map.addLayer(layer, 0);
            var annolayer = new TDTLayer_Anno("cva");//影像cia 矢量cva
            map.addLayer(annolayer, 1);
        }
        else {
            if (map.layerIds.length > 0) {
                var rmap = map.getLayer(map.layerIds[0]);
                var rmap_anno = map.getLayer(map.layerIds[1]);
                map.removeLayer(rmap);
                map.removeLayer(rmap_anno);
            }
            var layer = new TDTLayer("img");//影像img 矢量 vec
            map.addLayer(layer, 0);
            var annolayer = new TDTLayer_Anno("cia");//影像cia 矢量cva
            map.addLayer(annolayer, 1);
        }
    })
}
/*规划成果--图层控制*/
function mapSort() {
    layerBox = [];
    $(".layerDiv").each(function () {
        var name = this.attributes['title'].value;
        layerBox.push(name);
    });
    layerBox.reverse();
    var rmap = map.getLayer(map.layerIds[0]);
    map.removeAllLayers();
    map.addLayer(rmap);

    layerBox.forEach(function (value) {
        for (var i = 0; i < layerSet.length; i++) {
            if (layerSet[i].text === value) {
                addLayerToMap(layerSet[i]);
            }
        }
    })
}
/*规划成果--添加图层数据*/
function addLayerToMap(data) {
    var url = data.displayurl;
    if (data.datatype === "DynamicLayer") {
        data.queryarray.forEach(function (e) {
            var layerId = data.text + e;
            var layerName;
            layerName = new esri.layers.ArcGISDynamicMapServiceLayer(url, {
                id: layerId,
                opacity: data.transparent
            });
            layerName.setVisibleLayers([e]);
            map.addLayer(layerName);
        })
    } else if (data.datatype === "Tiled") {
        var tiledid = "tiled" + data.text + data.nodeId;
        var tiledlayer = new esri.layers.ArcGISTiledMapServiceLayer(url, {
            id: tiledid,
            opacity: data.transparent
        });
        map.addLayer(tiledlayer);
    }
}
/*规划成果--全屏事件*/
function launchFullScreen(element) {
    // 判断各种浏览器，找到正确的方法
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}
function exitFullscreen() {
    if (document.exitFullscreen) { document.exitFullscreen(); }
    else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
    else if (document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
    else if (document.msExitFullscreen) { document.msExitFullscreen(); }
    else {
        alert("请使用ESC键退出")
    }
    var imgb = $("#dockeye img");
    imgb.css("border", "none");
}

/*数据对比--初始化地图*/
function initMultiMap() {
    showPop();

    $("#MulitMap img").click(function (e) {
        showPop();
        $("#mask").fadeIn();

        $(".data_title").fadeIn();
        var clickevt = e.currentTarget.alt;
        if (clickevt == "双屏对比") {
            $(".Two").fadeIn();
            setTimeout(function () { viewmap_5.setExtent(initextent); }, 600);
            setTimeout(function () { viewmap_6.setExtent(initextent); }, 600);

        } else if (clickevt == "四屏对比") {
            $(".Four").fadeIn();
        }
    })


    $(".data_title").click(function () {
        $(".Two").fadeOut();
        $(".Four").fadeOut();
        $("#mask").fadeOut();
        $(".data_title").fadeOut();
    })
    add_viewMap();
    if ($(".esriControlsBR") != null) {
        $(".esriControlsBR").remove();
    }//去除WebGIS Logo
    addtreedata();
}
/*数据对比--两屏比对*/
/*数据对比--四屏比对*/
function showPop() {
    var maskoj = $("#mask");
    maskoj.height($(window).height());
    maskoj.width($(window).width());

    var four_map = $(".Four");
    four_map.height($(window).height());
    four_map.width($(window).width());

    var two_map = $(".Two");
    two_map.height($(window).height());
    two_map.width($(window).width());

    var viewobj = $(".Four .view");
    viewobj.height($(window).height() / 2 - 70);
    viewobj.width($(window).width() / 2 - 40);

    var viewobjTwo = $(".Two .view");
    viewobjTwo.height($(window).height() - 85);
    viewobjTwo.width($(window).width() / 2 - 40);

    var titleobj = $(".data_title");
    titleobj.height(50);
    titleobj.width($(window).width() - 2);


}
function addtreedata() {
    $('.tree').treeview({ data: tree, multiSelect: true });
    $('.tree').treeview('collapseAll', { silent: true });
    /* 绑定tree事件*/
    require(["../Javascript/Modules/iframeAddLayer.js"], function (value) {
        value.setTreeEvent();
    });
    return;




}
function add_viewMap() {
    /* 初始化瓦片数据*/
    var base_url = "";
    for (i = 0; i < base_map.length; i++) {
        if (base_map[i].name === "VECTOR") {
            base_url = base_map[i].url;
        }
    }

    //初始化地图集合
    for (var i = 1; i < 7; i++) {
        var tem = "";
        tem = new esri.Map("viewmap_" + i, {
            logo: false,
            slider: false,
            extent: fullextent


        })
        var basemaptmp = "";
        basemaptmp = new esri.layers.ArcGISTiledMapServiceLayer(base_url, { id: "basemap" });
        tem.addLayer(basemaptmp);
        switch (i) {
            case 1:
                viewmap_1 = tem;
                break;
            case 2:
                viewmap_2 = tem;
                break;
            case 3:
                viewmap_3 = tem;
                break;
            case 4:
                viewmap_4 = tem;
                break;
            case 5:
                viewmap_5 = tem;

                break;
            case 6:

                viewmap_6 = tem;
                break;
        }
    }
    //初始化map监听
    viewMap_extent1 = viewmap_1.on("extent-change", viewExtent);
    viewMap_extent2 = viewmap_2.on("extent-change", viewExtent);
    viewMap_extent3 = viewmap_3.on("extent-change", viewExtent);
    viewMap_extent4 = viewmap_4.on("extent-change", viewExtent);


    var flag_5 = true, flag_6 = true;
    viewmap_5.on("extent-change", function () {
        if (flag_5) {
            var extent_5 = viewmap_5.extent;
            viewmap_6.setExtent(extent_5);
            flag_6 = false;
        } else if (!flag_5) {
            flag_5 = true;
        }
    });
    viewmap_6.on("extent-change", function () {
        if (flag_6) {
            var extent_6 = viewmap_6.extent;
            viewmap_5.setExtent(extent_6);
            flag_5 = false;
        } else if (!flag_6) {
            flag_6 = true;
        }
    })

}
/*数据对比--四图联动*/
function viewExtent(e) {
    var viewMapId = e.target.id;
    var extent;
    switch (viewMapId) {
        case 'viewmap_1':
            if (flag1) {
                extent = viewmap_1.extent;
                viewmap_2.setExtent(extent);
                viewmap_3.setExtent(extent);
                viewmap_4.setExtent(extent);
                flag2 = false; flag3 = false; flag4 = false;
            }
            else if (!flag1) {
                flag1 = true;
            }
            break;
        case 'viewmap_2':
            if (flag2) {
                extent = viewmap_2.extent;
                viewmap_1.setExtent(extent);
                viewmap_3.setExtent(extent);
                viewmap_4.setExtent(extent);
                flag1 = false; flag3 = false; flag4 = false;
            }
            else if (!flag2) {
                flag2 = true;
            }
            break;
        case 'viewmap_3':
            if (flag3) {
                extent = viewmap_3.extent;
                viewmap_1.setExtent(extent);
                viewmap_2.setExtent(extent);
                viewmap_4.setExtent(extent);
                flag1 = false; flag2 = false; flag4 = false;
            }
            else if (!flag3) {
                flag3 = true;
            }

            break;
        case 'viewmap_4':
            if (flag4) {
                extent = viewmap_4.extent;
                viewmap_1.setExtent(extent);
                viewmap_2.setExtent(extent);
                viewmap_3.setExtent(extent);
                flag1 = false; flag2 = false; flag3 = false;
            }
            else if (!flag4) {
                flag4 = true;
            }
            break;
        default:
            break;
    }
}
/*隐藏信息框*/
function hidePanel() {
    //var imgb = $("#dockeye img");
    //imgb.css("border", "none");
    $("#tools").css("display", "none");
    $("#infoSimple").css("display", "none");
    $("#infoList").css("display", "none");
    $("#sortable").css("display", "none");
    $("#addressInfo").css("display", "none");
    if (toolbar) {
        toolbar.deactivate();
    }
    $("#Statistics").css("display", "none");
    $("#Total_sum").css("display", "none");
    $("#Spatial").css("display", "none");
    $("#Measure").css("display", "none");
    $("#MulitMap").css("display", "none");
    map.setMapCursor("default");
    $(".results").empty();
    map.infoWindow.hide();
}
/*清除事件*/
function ClearMap() {
    if (map.graphics.graphics.length != 0) {
        map.graphics.clear();
    };
    if (mapMoveChart) {
        mapMoveChart.remove();
    }
    $(".chartDOM").remove();
    map.infoWindow.hide();
    $(".results").empty();
    $("#addressInfo").css("display", "none");
    $(".bootstrap-table").remove();
    $(".input-group input").val("");
}