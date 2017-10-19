if (!this["LiquidGIS"]) { LiquidGIS = {}; }
if (!this["LiquidGIS.Application"]) { LiquidGIS.Application = {}; }
if (!this["LiquidGIS.Planning"]) { LiquidGIS.Planning = {}; }
if (!this["LiquidGIS.Events"]) { LiquidGIS.Planning.Events = {}; }
if (!this["LiquidGIS.Planning.Page"]) { LiquidGIS.Planning.Page = {}; } // 页面顶级命名空间


// 定义全局时间
LiquidGIS.Events = { PageResize: "PageResize", MapSwitchToolClick: "MapSwitchToolClick" };

/*
初始化应用程序，装载框架脚本，并自动执行主页面 Application_Start 函数;
*/
//alert(window.location)
RequireJS.config({
    baseUrl: "Javascript",
    paths: {
        "Framework": "Framework",
        "RequireDomReady": "RequireJS/domReady",
        "RequireText": "RequireJS/text",
        "js": "js"
    },
    waitSeconds: 20
});
dojoConfig = {
    baseUrl: "Javascript/ArcGISAPI/3.16/dojo"
}

/* 装载所有脚本 */
RequireJS(["Noty/noty", "Framework/Application", "Framework/LayerDef", "Framework/Config", "Framework/code2info",
    "Framework/hideField", "Framework/confUrl", "Framework/field_keys",
    "JQuery/jquery.json", "js/bootstrap", "js/bootstrap-table",
    "js/bootstrap-treeview", "js/jquery-ui", "js/grayscale", "Modules/initTable",
     // ArcGIS JS API
    "ArcGISAPI/3.16/init" ],
   
    function () {
        RequireJS(["Noty/layouts/bottomRight", "Noty/layouts/topCenter", "Noty/themes/default"], function () { Application_Start(); }); // 先载入noty 避免崩溃现象      
        LiquidGIS.Application.LoadCSS("Javascript/ArcGISAPI/3.16/dijit/themes/tundra/tundra.css");
        LiquidGIS.Application.LoadCSS("Javascript/ArcGISAPI/3.16/esri/css/esri.css");
        //LiquidGIS.Application.LoadCSS("css/layout.css");
        LiquidGIS.Application.LoadCSS("css/base.css");
        //LiquidGIS.Application.LoadCSS("style/index.css");
        LiquidGIS.Application.LoadCSS("style/Main_Map.css");
        //LiquidGIS.Application.LoadCSS("style/bootstrap.css");
        //LiquidGIS.Application.LoadCSS("style/jquery-ui.css");

        //LiquidGIS.Application.LoadCSS("style/MultiMap.css");
        //LiquidGIS.Application.LoadCSS("style/bootstrap-table.css");
        if (!$.support.leadingWhitespace /* iE 6-8*/)
            RequireJS(["docs-assets/js/html5shiv", "docs-assets/js/respond.min"]);
        // 加载页面对应的模板脚本,并执行 Application_Start 函数；
    }
  );

/* 应用程序启动 首先进行布局初始化 ,然后初始化事件*/
function Application_Start() {
    //自动改变布局
    $(window).resize(function () {
        $("#_Index_Body_DIV").width($(window).width());
        $("#_Index_Body_DIV").height($(window).height());
        $("#_Index_Center_DIV").width($(window).width())
        $("#_Index_Center_DIV").height($(window).height());
        $("#_Index_Center_Map_DIV").width($(window).width());
        $("#_Index_Center_Map_DIV").height($(window).height());

    });
    $("#_Index_Center_DIV").height($(window).height());
    $("#_Index_Center_Map_DIV").width($(window).width());
    $("#_Index_Center_Map_DIV").height($(window).height());

   
      //  var myurl = GetQueryString("key");
       // if (myurl != null && myurl.toString().length > 1&&myurl=="admin123") {
            LiquidGIS.Application.LoadModule(new LiquidGIS.Application.Module("Main_Map", "Main_Map.htm",function () {},$("#_Index_Center_Map_DIV"), true));
     //   } else {
     //       window.location.href = 'login.html';
     //   }
 
   


}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}