define([], function () {

    var map_config = {
        logo: false,
        center: [120.16, 30.246],
        zoom: 12,
        slider: false
    }
    var minZoom = 7;
    var maxZoom = 11;
  //  var map_v_i = "http://www.hangzhoumap.gov.cn/Tile/ArcGISFlex/HZTDTVECTORBLEND.gis";
 //  var map_r_i = "http://www.hangzhoumap.gov.cn/Tile/ArcGISFlex/HZTDTRASTERBLEND.gis";
    var map_r_i = "http://21.15.121.121/a67db68dbfb2752f9b913dff9ece867117c87e95/Tile/ArcGISREST/HZSYRASTER2014wkid.gis";
      var map_v_i = "http://21.15.121.121/a67db68dbfb2752f9b913dff9ece867117c87e95/Tile/ArcGISREST/HZSYVECTOR201512wkid.gis";
    var spatial_config = [{
        sName: "地名地址查询",
        url: "http://www.hangzhoumap.gov.cn/5d5fd744d39a415adb375bf3c2b235bae729eed1/Geocoding/LiquidGIS/FindAddress.gis",
        query:false
        
    }
    //, {
    //    sName: "经办机构",
    //    url: "http://172.16.83.19:7005/hzjy/map/mapInterface/mapInterface",
    //     categoryCode: '50001',
    //type: 'accessMapsShow',
    //model: '1',
    //query: true
    //}
    ]
    var grid_symbol = {
        showgrid: 12,
        linewidth: 3,
        linecolor: "#0094ff",
        backcolor: [0, 148, 255, 0.1],
        textcolor: "#000",
        fontsize: "16px",
        fontfamily: "Microsoft Yahei"
    }
    return {
        minZoom: minZoom,
        maxZoom:maxZoom,
        map_config: map_config,
        spatial_config:spatial_config,
        map_r_i: map_r_i,
        map_v_i: map_v_i,
        grid_symbol: grid_symbol
    }

})

