define(function () {
    return {
        setTreeEvent: setTreeEvent

    }
    function setTreeEvent() {
        $('.tree').on('nodeSelected ', function (event, data) {
            debugger;
            // Your logic goes here          
            if (data.nodes == null) {
                var viewmapid = this.parentNode.id;
                var tmpmap;
                switch (viewmapid) {
                    case 'viewmap_1':
                        tmpmap = viewmap_1;
                        break;
                    case 'viewmap_2':
                        tmpmap = viewmap_2;
                        break;
                    case 'viewmap_3':
                        tmpmap = viewmap_3;
                        break;
                    case 'viewmap_4':
                        tmpmap = viewmap_4;
                        break;
                    case 'viewmap_5':
                        tmpmap = viewmap_5;
                        break;
                    case 'viewmap_6':
                        tmpmap = viewmap_6;
                        break;
                    default:
                        break;

                }
         
                var url = data.displayurl;
                if (url) {
                    if (data.datatype == "DynamicLayer") {
                        mapAdd(data, tmpmap);

                    }
                    else if (data.datatype == "Tiled") {

                        var tiledid = "tiled" + data.nodeId;
                        var tiledlayer = new esri.layers.ArcGISTiledMapServiceLayer(url, {
                            id: tiledid,
                            opacity: data.transparent
                        });
                        tmpmap.addLayer(tiledlayer);
                    }
                } else {
                    alert("暂无地理数据");
                }
            }
            else {
                if (data.state.expanded == true) {
                    var nodeid = data.nodeId;
                    $(this).treeview('collapseNode', [nodeid]);
                }
                else {
                    var nodeid = data.nodeId;
                    $(this).treeview('expandNode', [nodeid]);

                }

            }

        });
        $('.tree').on('nodeUnselected ', function (event, data) {
            // Your logic goes here

            if (data.nodes == null) {
                var viewmapid = this.parentNode.id;
                var tmpmap;
                switch (viewmapid) {
                    case 'viewmap_1':
                        tmpmap = viewmap_1;
                        break;
                    case 'viewmap_2':
                        tmpmap = viewmap_2;
                        break;
                    case 'viewmap_3':
                        tmpmap = viewmap_3;
                        break;
                    case 'viewmap_4':
                        tmpmap = viewmap_4;
                        break;
                    case 'viewmap_5':
                        tmpmap = viewmap_5;
                        break;
                    case 'viewmap_6':
                        tmpmap = viewmap_6;
                        break;
                    default:
                        break;

                }
                var url = data.displayurl;
                if (url != "") {
                    if (data.datatype == "DynamicLayer") {
                        mapRemove(data, tmpmap);
                    }
                    else if (data.datatype == "Tiled") {
                        var layerId = "tiled" + data.nodeId;
                        tmpmap.removeLayer(tmpmap.getLayer(layerId));
                    }
                }
            }
            else {
                if (data.state.expanded == true) {
                    var nodeid = data.nodeId;
                    $(this).treeview('collapseNode', [nodeid]);

                } else {
                    var nodeid = data.nodeId;
                    $(this).treeview('expandNode', [nodeid]);
                }
            }
        });
    }
    /*添加专题图*/
    function mapAdd(data, viewmap) {
        var url = data.displayurl
        data.queryarray.forEach(function (e) {
            var layerId = data.text + e;
            var layerName;
            layerName = new esri.layers.ArcGISDynamicMapServiceLayer(url, {
                id: layerId,
                opacity: data.transparent
            });
            layerName.setVisibleLayers([e]);
            viewmap.addLayer(layerName);
        })

    }
    /*移除专题图*/
    function mapRemove(data, viewmap) {
        data.queryarray.forEach(function (e) {
            var layerId = data.text + e;
            viewmap.removeLayer(viewmap.getLayer(layerId));
        })

    }

})