define(function () {
    layerBoxEvent();
    return {
        setTreeEvent: setTreeEvent,
        changeOpacity: changeOpacity
    }
    function setTreeEvent() {
        $('#tree').on('nodeSelected', function (event, data) {
            // Your logic goes here  
            if (data.nodes == null && data.displayurl) {
                layerSet.push(data);
                addLayerToMap(data);
            }
            else {
                if (data.state.expanded == true) {
                    var nodeid = data.nodeId;
                    $('#tree').treeview('collapseNode', [nodeid]);


                }
                else {
                    var nodeid = data.nodeId;
                    $('#tree').treeview('expandNode', [nodeid]);

                }

            }

        });


        $('#tree').on('nodeUnselected', function (event, data) {
            // Your logic goes here

            if (data.nodes == null && data.displayurl) {
                debugger;
                mapRemove(data);
                removeFormLayerSet();
            }
            else {
                if (data.state.expanded == true) {
                    var nodeid = data.nodeId;
                    $('#tree').treeview('collapseNode', [nodeid]);
                
                    return;
                } else {
                    var nodeid = data.nodeId;
                    $('#tree').treeview('expandNode', [nodeid]);

                    return;

                }
            }
        });
   

    }
    /*改变图层透明度*/
    function changeOpacity() {
        // debugger;
        var value = this.title;

        var divNodes = [];
        var opacityVal = $(".opacity[title='" + value + "']").slider("value") / 100;
        divNodes = getDivId(value);
        divNodes.forEach(function (divNode) {
            $("#" + divNode).css("opacity", opacityVal)
        })
        layerSet.forEach(function (layer) {
            if (layer.text == value) {
                layer.transparent = opacityVal;
            }
        })

    }
    /*根据名称获取图层DIV的ID*/
    function getDivId(value) {
        var divNodes = [];
        layerSet.forEach(function (node) {
            if (node.text == value) {
                if (node.datatype == "DynamicLayer") {
                    node.queryarray.forEach(function (e) {
                        var layerId = node.text + e;
                        var divNode = "Main_Map_DIV_" + layerId;
                        divNodes.push(divNode);
                    })
                } else if (node.datatype == "Tiled") {
                    var layerId = "tiled" + node.text + node.nodeId;
                    var divNode = "Main_Map_DIV_" + layerId;
                    divNodes.push(divNode);
                }
                return;
            }
        });
        return divNodes;
    }
    /* mapServer图层显示*/
    function addlayer(url) {
        var tags_group = $('#tree').treeview('getSelected');
        if (map.layerIds.length > 1) {
            map.removeLayer(map.getLayer(map.layerIds[1]));
        }
        var dLayer = new esri.layers.ArcGISDynamicMapServiceLayer(url);
        //var dLayer = new DynamicLayer(url);
        map.addLayer(dLayer);

        var layer_name;
        var dynamicLayerinfo;
        dLayer.on("load", function (e) {
            var show_index = [];
            dynamicLayerinfo = e.target.createDynamicLayerInfosFromLayerInfos();
            for (var i = 0; i < dynamicLayerinfo.length ; i++) {
                layer_name = dynamicLayerinfo[i].name;
                for (var j = 0; j < tags_group.length; j++) {
                    for (var k = 0; k < tags_group[j].LayerName.length; k++)
                        if (tags_group[j].LayerName[k] == layer_name) {
                            show_index.push(i);
                            continue;
                        }
                }
            }

            dLayer.setVisibleLayers(show_index);
        });
    }
    /*添加图层*/
    function addLayerToMap(data) {
        var url = data.displayurl;

        if (data.scale !="") {
            var tip = data.text +"数据需在1:" + data.scale + "以上显示,请放大查看";
            $(".scale-tip").html(tip);
            $(".scale-tip").fadeIn();
            setTimeout(function () {
                $(".scale-tip").fadeOut();
            }, 5000);
        }
        if (data.datatype == "DynamicLayer") {
            mapAdd(data);

        }
        else if (data.datatype == "Tiled") {

            var tiledid = "tiled" + data.text + data.nodeId;
            var tiledlayer = new esri.layers.ArcGISTiledMapServiceLayer(url, {
                id: tiledid,
                opacity: data.transparent
            });
            map.addLayer(tiledlayer);

        }
        addToLayerbox(data.text, data.transparent);
    }
    /*添加专题图*/
    function mapAdd(data) {
        var url = data.displayurl;
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

    }
    /*移除专题图*/
    function mapRemove(data) {
        if (data.datatype == "Tiled") {
            var tiledid = "tiled" + data.text + data.nodeId;
            map.removeLayer(map.getLayer(tiledid));
            removeFromLayerbox(data.querytite);
        } else {
            if (data.queryarray) {
                data.queryarray.forEach(function (e) {
                    var layerId = data.text + e;
                    map.removeLayer(map.getLayer(layerId));
                })
                removeFromLayerbox(data.querytite);
            }
        }
           
    }
    /*移除图层Set*/
    function removeFormLayerSet(name) {
        var delIndex;//待删除索引
        for (var i = 0; i < layerSet.length; i++) {
            if (layerSet[i].text == name) {
                delIndex = i;
            }
        }
        layerSet.splice(delIndex, 1);
    }

    /*图层排序-添加*/
    function addToLayerbox(name, opacity) {
        // debugger;
        layerBox.push(name);
        var html = ''
        + '<div class="layerDiv" title="' + name + '">'
            + '<span>' + name + '</span>'
            + '<div class="control">'
                + '<div class="opacity" title="' + name + '"></div>'
                + "<div class='remove click-hover' title='移除图层' ></div>"
                + "<div class='hide click-hover' title='隐藏图层'></div>"
            + "</div>"
       + "</div>";
        $("#layerControl").prepend(html);
        $(".opacity[title='" + name + "']").slider({
            orientation: "horizontal", range: "min", max: 100, value: opacity * 100, slide: changeOpacity, change: changeOpacity
        });
    }
    function layerBoxEvent() {
        $("#layerControl").delegate(".hide", "click", function () {
            var divNodes = [];
            var name = this.parentNode.parentNode.title;
            debugger;
            divNodes = getDivId(name);
            if ($("#" + divNodes[0]).css("opacity") != "0") {
                divNodes.forEach(function (divNode) {
                    $("#" + divNode).css("opacity", "0");
                    $("#" + divNode).css("title", "显示图层");
                })
                $(".opacity[title='" + name + "']").slider('disable');
                $(this).css("background", "url(../img/eye.png) no-repeat");
            }
            else {
                divNodes.forEach(function (divNode) {
                    var silder_cur_val = $(".opacity[title='" + name + "']").slider("value") / 100;
                    $("#" + divNode).css("opacity", silder_cur_val);
                    $("#" + divNode).css("title", "隐藏图层");
                });
                $(".opacity[title='" + name + "']").slider('enable');
                $(this).css("background", "url(../img/eye-red.png) no-repeat");
            }
            return;
        })

        $("#layerControl").delegate(".remove", "click", function () {
            var divNodes = [];
            var name = this.parentNode.parentNode.title;
            $(this).parent().parent().remove();
            divNodes = getDivId(name);
            layerBox.remove(name);
            divNodes.forEach(function (divNode) {
                var layerId = divNode.replace("Main_Map_DIV_", "");
                var reLayer = map.getLayer(layerId);
                map.removeLayer(reLayer);
   //             var moveLayer = map.getLayer(layerId);

            });
           
            var selectedNode = $('#tree').treeview('getSelected');
            selectedNode.forEach(function (node) {
                if (node.text == name)
                    node.state.selected = false;
                $('#tree').treeview('clearSearch');
            });
           
            var delIndex;//待删除索引
            for (var i = 0; i < layerSet.length; i++) {
                if (layerSet[i].text == name) {
                    delIndex = i;
                }
            }
            layerSet.splice(delIndex, 1);
        })
    }
    function removeFromLayerbox(name) {
        layerBox.remove(name);
        $(".layerDiv[title='" + name + "']").remove();
    }

});
