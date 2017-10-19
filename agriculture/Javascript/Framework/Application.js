/**
 * @name LiquidGIS
 * @namespace LiquidGIS 顶级命名空间.
 *
 */
if(typeof(window["LiquidGIS"]) === "undefined"){window["LiquidGIS"] = {};	}

/**
 * 注册命名空间。
 * @param {String} namespace  命名空间名称，使用 点. 分割；
 * @returns {Object} 返回
 * @constructor
 */
LiquidGIS.RegisterNamespace = function (namespace) {
    var nsparts = namespace.split(".");
    var parent=window;
    for (var i = 0; i < nsparts.length; i++) {
        var partname = nsparts[i];
        if (typeof parent[partname] === "undefined") {
            parent[partname] = {};
            parent[partname].merge=function()
            {
                // 默认给每个NS一个默认的函数：merge
                var ownNS = parent[partname];
                return function(target)
                {
                    for(var p in target)
                        if(target.hasOwnProperty( p )) ownNS[p] = target[p];
                    return ownNS;
                }
            }();
        }
        parent = parent[partname];
    }
    return parent;
};

LiquidGIS.RegisterNamespace("LiquidGIS.Application");
LiquidGIS.RegisterNamespace("LiquidGIS.Modules.Portal.Page");
LiquidGIS.RegisterNamespace("LiquidGIS.Logger");
LiquidGIS.RegisterNamespace("LiquidGIS.Template");

LiquidGIS.Logger.Minlevel= 1; // Information=1  ;   Alert=4 ;   Warning=8  ; Error=16 ; None=99;
LiquidGIS.Logger.HideTimeout = 10000;// 延时关闭时间；
LiquidGIS.Application.InitializeCompleteModules = {};// 已经初始化完毕的模块
LiquidGIS.Application.ContextData = null;
LiquidGIS.Application.EventData = null;
LiquidGIS.Application.GlobalIndex = 1;

/**
 * 装载CSS样式表到页面中。
 * @param {String} cssFile 需要装载的CSS文件路径。
 */
LiquidGIS.Application.LoadCSS = function (cssFile)
{
		  $('<link  rel="stylesheet" type="text/css" />')
		    .appendTo($('head').get(0))
		    .attr('href', cssFile);
};

/**
 * 装载JS到页面中,此函数一般用于脚本强制刷新，普通情况建议使用 RequireJS。
 * @param {String} jsFile 需要装载的js文件路径。
 */
LiquidGIS.Application.LoadJavascript = function (jsFile)
{
    // 装载页面和背景
    $("<script>")
        .attr({ language: "javascript",
            type: "application/javascript",
            src: jsFile
        }).appendTo("head");
};

/* 装载HTML到知道元素中 */
LiquidGIS._LOADHTMLCACHE={};
LiquidGIS.LoadHtml = function(url,container,callback)
{
	if(LiquidGIS.IsEmpty( LiquidGIS._LOADHTMLCACHE[url] ))
	{
	  $.get(url, null, function (html, textStatus){
	  			LiquidGIS._LOADHTMLCACHE[url] = html;	
				if(typeof(container) == "string") $("#"+container).html(LiquidGIS._LOADHTMLCACHE[url]);
				else  container.html(LiquidGIS.Template._HTMLCACHE[url]);
				if(!LiquidGIS.IsEmpty(callback) && typeof(callback)=="function") callback();
                },"html"
            );
	}
	else
	{
		if(typeof(container) == "string") $("#"+container).html(LiquidGIS._LOADHTMLCACHE[url]);
		else  container.html(LiquidGIS._LOADHTMLCACHE[url]);
		if(!LiquidGIS.IsEmpty(callback) && typeof(callback)=="function") callback();
	}
}

/*
 * 装载模块的主页面中。
 * @param {String} module 模块配置信息。
 */
LiquidGIS.Application.LoadModule = function(module)
{
   
    if(typeof(module)=="string") // 如果传入为 string ，则表示将尝试从缓存中加载模块到对应的容器中。
    {
        if(!LiquidGIS.IsEmpty(LiquidGIS.Application.InitializeCompleteModules[module]))
        {
            var cModule =  LiquidGIS.Application.InitializeCompleteModules[module];
            // 如果已经有模块被加载 需要隐藏
            var containerAppName = cModule.Container.data("_AppName");
            if( (!LiquidGIS.IsEmpty(containerAppName)) &&  (!LiquidGIS.IsEmpty(LiquidGIS.Application.InitializeCompleteModules[containerAppName])) )
            {
                LiquidGIS.Application.InitializeCompleteModules[containerAppName].Visibility = false;
                LiquidGIS.Application.InitializeCompleteModules[containerAppName].JqueryObject.css("display","none");
            }

            cModule.Container.data("_AppName",module);
            //cModule.Container.append(cModule.JqueryObject);
            cModule.JqueryObject.css("display","");
            cModule.Container.css({ opacity: .1 });
            cModule.Container.animate({ opacity: 1}, 300);
            cModule.Visibility = true;
        }
        return;
    }

    var container =  module.Container;
    if (LiquidGIS.IsEmpty(container))
        container = $("#_BodyDIV");
    var containerAppName = container.data("_AppName"); // 当前应用模块包含的应用名称
    module.Container = container;

    // 第一次加载模块(或者模块名称为空) 需要装载HTML模板
    if(LiquidGIS.IsEmpty(module.Name) ||  LiquidGIS.IsEmpty(LiquidGIS.Application.InitializeCompleteModules[module.Name]))
    {
        if(LiquidGIS.IsEmpty(module.Element)) // 如果设置了Element，表示模块为动态创建的 无需人工加载
        {
            $.get(module.Url, null, function (html, textStatus){
                    // 如果容器中已有模块存在 需要保存状态 并缓存到不可见区域
                    if( (!LiquidGIS.IsEmpty(containerAppName)) &&  (!LiquidGIS.IsEmpty(LiquidGIS.Application.InitializeCompleteModules[containerAppName])) )
                    {
                        LiquidGIS.Application.InitializeCompleteModules[containerAppName].Visibility = false;
                        LiquidGIS.Application.InitializeCompleteModules[containerAppName].JqueryObject.css("display","none");
                    }
                    // 加载完毕后需要创建一个 DIV 来包含模板HTML为一个整体
                    var ele = $("<div align='center'></div>");
                    ele.append($(html));
                    container.append(ele);
                    module.JqueryObject = ele;
                    if(!LiquidGIS.IsEmpty(module.Name))
                        LiquidGIS.Application.InitializeCompleteModules[module.Name] = module;
                    container.data("_AppName",module.Name);
                    module.LoadCompleted = true;
                    module.Container.css({ opacity: .1 });
                    module.Container.animate({ opacity: 1}, 300);
                    module.Visibility = true;
                    if($.isFunction(module.Callback) ) module.Callback(module);
                    module.EventData.PublishEvent("onShow",module);                    
                    if(module.HasJsFild)
                    {                       
			            var jsPath = module.Url.substring(0,module.Url.lastIndexOf('.')) + ".js";
			            RequireJS([jsPath],function (){
			                try
			                {
			                  window.eval(""+module.Name+"_Start('"+module.Name+"')");
			                }
			                catch(e)
			                {
			                    LiquidGIS.Logger.Info(e);
			                }
			            });
			        }
	        

                },"html"
            );
        }
        else // 按给定对象构造模块
        {
            if( (!LiquidGIS.IsEmpty(containerAppName)) &&  (!LiquidGIS.IsEmpty(LiquidGIS.Application.InitializeCompleteModules[containerAppName])) )
            {
                LiquidGIS.Application.InitializeCompleteModules[containerAppName].Visibility = false;
                LiquidGIS.Application.InitializeCompleteModules[containerAppName].JqueryObject.css("display","none");
            }
            var ele = $("<div align='center'></div>");
            ele.append(module.Element);
            container.append(ele);
            module.JqueryObject = ele;
            if(!LiquidGIS.IsEmpty(module.Name))
                LiquidGIS.Application.InitializeCompleteModules[module.Name] = module;
            container.data("_AppName",module.Name);
            module.LoadCompleted = true;
            module.Container.css({ opacity: .1 });
            module.Container.animate({ opacity: 1}, 300);
            module.Visibility = true;
            // 装载完毕执行回调
            if($.isFunction(module.Callback) ) module.Callback(module);
            module.EventData.PublishEvent("onShow",module);
           
            if(module.HasJsFild)
	        {
	            var jsPath = module.Url.substring(0,module.Url.lastIndexOf('.')) + ".js";
	            RequireJS([jsPath],function (){
	                try
	                {
	                  window.eval(""+module.Name+"_Start('"+module.Name+"')");
	                }
	                catch(e)
	                {
	                    LiquidGIS.Logger.Info(e);
	                }
	            });
	        }
        
        }
    }
    else// 后续装载从缓存追加,如果模块同名将忽略。
    {
        if(containerAppName == module.Name ) return;

        if( (!LiquidGIS.IsEmpty(containerAppName)) &&  (!LiquidGIS.IsEmpty(LiquidGIS.Application.InitializeCompleteModules[containerAppName])) )
        {
            LiquidGIS.Application.InitializeCompleteModules[containerAppName].Visibility = false;
            var cObject = LiquidGIS.Application.InitializeCompleteModules[containerAppName].JqueryObject;
            cObject.css("display","none");
            cObject[0].style.display = "none";
        }
        //LiquidGIS.Logger.Error("!!");
        var module = LiquidGIS.Application.InitializeCompleteModules[module.Name];
        container.data("_AppName",module.Name);
        module.Container.css({ opacity: .1});
        module.Container.animate({ opacity: 1   }, 500);
        module.Visibility = true;
        module.JqueryObject.css("display","");
        module.EventData.PublishEvent("onShow",module);

    }

};


/**
 * 删除模块。
 * @param {String} name 需要删除的模块名称。
 */
LiquidGIS.Application.UnLoadModule = function(name)
{

    if(LiquidGIS.IsEmpty(LiquidGIS.Application.InitializeCompleteModules[name]))
    {
        // 无模块
    }
    else
    {
        // 设置模块为空 并删除
        LiquidGIS.Application.InitializeCompleteModules[name].JqueryObject.remove();
        LiquidGIS.Application.InitializeCompleteModules[name].JqueryObject == null;
        delete LiquidGIS.Application.InitializeCompleteModules[name].JqueryObject;
    }

    LiquidGIS.Application.InitializeCompleteModules[name] = null;
    delete LiquidGIS.Application.InitializeCompleteModules[name];

};


/*
 *  获取当前程序应用模块名称。
 */
LiquidGIS.Application.GetApplicationActivatedModule = function(){
    var containerAppName = $("#_BodyDIV").data("_AppName"); // 当前应用模块包含的应用名称
    if(LiquidGIS.IsEmpty(containerAppName)) return null;
    return LiquidGIS.Application.InitializeCompleteModules[containerAppName];
};

/*
 * 由模块名称获取模块对象。
 * param {String} name 模块名称。
 */
LiquidGIS.Application.GetModule = function(name){
    if( (!LiquidGIS.IsEmpty(name)) &&  (!LiquidGIS.IsEmpty(LiquidGIS.Application.InitializeCompleteModules[name])) )
    return LiquidGIS.Application.InitializeCompleteModules[name];
};

/*
 * 模块对象定义。
 * @param {String} name 模块名称。
 * @param {String} url :模块Url网址；
 * @param {Function} callback 载入成功时回调函数。
 * @param {Object} container :模块装载的容器，默认为主页容器。
 * @param {Boolean} hasJsFild :模块是否包含默认的脚本文件（脚本文件盒HTML文件同名）。
 */
LiquidGIS.Application.Module = function (name,url,callback,container,hasJsFild )
{
    this.Name = name;// 模快名称
    this.JqueryObject=null;// 模块包含的jquery页面对象
    this.ContextData = new LiquidGIS.ContextData();
    this.Url = url;
    /*直接添加到模块中的页面对象，设置此值将忽略Url的参数配置。*/
    this.Element = null;
    this.Callback = callback;
    this.Container = container;
    this.Visibility = true;// 元素是否可见
    this.Enable = true;
    this.HasJsFild= hasJsFild;
    this.LoadCompleted = false;
    this.EventData = new LiquidGIS.EventData();
    // 是否容许缓存DOM
    //this.CanCache = true;
    //this.SaveToCache
};

/*
    判断数据内容为否为空。
 */
LiquidGIS.IsEmpty = function(value)
{
    if(typeof(value) == "undefined") return true;
    if(value == null) return true;
    if(value == "") return true;
    return false;
};

/*
 判断数据内容为否为空。
 */
LiquidGIS.GetString = function(value)
{
    if(typeof(value) == "undefined") return "";
    if(value == null) return "";
    if(value == "") return "";
    return value.toString();
};

/*
 获取URL参数信息。
 */
LiquidGIS.Application.GetQuery = function (name,defaultValue) 
{  
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
    var r = location.search.substr(1).match(reg);  
    if (r != null) return unescape(decodeURI(r[2])); 
    return defaultValue;  
} 


/*
  定义空函数
 */
var EmptyFun = function(){};
LiquidGIS.Logger.Info = function(message,layout)
{
    LiquidGIS.Logger.NotyInfo("information",1,message,layout);
}
LiquidGIS.Logger.Alert = function(message,layout)
{
    LiquidGIS.Logger.NotyInfo("alert",4,message,layout);
}
LiquidGIS.Logger.Warning = function(message,layout)
{
    LiquidGIS.Logger.NotyInfo("warning",8,message,layout);
}
LiquidGIS.Logger.Error = function(message,layout)
{

    LiquidGIS.Logger.NotyInfo("error",16,message,layout);
}
LiquidGIS.Logger.NotyInfo = function(type,level,message,layout)
{
    if(level<LiquidGIS.Logger.Minlevel) return;// 日志级别小于设定级别不输出

    if(LiquidGIS.IsEmpty(layout)) layout = "bottomRight";
    if(message == null ) return;
    if(typeof(message.number)!="undefined" &&typeof(message.description)!="undefined" )
    {
        //debugger
        message = message.name + ";"+message.number + ";"+message.description + ";"+message.message + ";"+message.stack + ";";
    }
    else message = message.toString();
    if(noty)noty({text: message,type: type,layout: layout}).setTimeout(LiquidGIS.Logger.HideTimeout);
    else alert("NotyInfo --> "+message);
}


/* 上下文数据对象 */
LiquidGIS.ContextData = function()
{

    this.saveObjects = {};
    this.changeActions = {};


    this.SetObject = function(name, save)
    {
        this.saveObjects[name]=save;
        FireObjectChange(name);
    }


    this.GetObject = function (name)
    {
        if (typeof(this.saveObjects[name] != "undefined")) return this.saveObjects[name];
        else return null;
    }


    this.Remove = function(name)
    {
         if (typeof(this.saveObjects[name] != "undefined"))
        {
            this.saveObjects[name] = null;
            delete  this.saveObjects[name];
            FireObjectChange(name);// 删除需要触发改变事件
            return true;
        }
        return false;
    }




    /// <summary>
    /// 删除所有对象。
    /// </summary>
    /// <param name="name"></param>
    this.RemoveAll = function()
    {
        saveObjects = {};
    }

}
LiquidGIS.Application.ContextData = new LiquidGIS.ContextData();



/* 事件触发中心。 */
LiquidGIS.EventData = function()
{

    this.nameDictionary = {};


    /*
     * 发布一个事件。
     * @param {String} name 事件名称。
     * @param {Object} eventDataArgs 事件参数。
     */
    this.PublishEvent = function ( name, eventDataArgs)
    {
        if (LiquidGIS.IsEmpty(this.nameDictionary[name]))
        {
            this.nameDictionary[name] = [] ;
        }

        if (this.nameDictionary[name].length > 0)
        {
            for (var i=0;i<this.nameDictionary[name].length;i++)
            {
                try
                {
                    this.nameDictionary[name][i](eventDataArgs);
                }
                catch (ex)
                {
                    LiquidGIS.Logger.Error("PublishEvent error[" + name + "]" +  ex.toString());
                    LiquidGIS.Logger.Error(ex);
                }
            }

        }
    }



    /*
     * 判断当前是否有已经注册的事件。
     * @param {String} name 事件名称。
     */
    this.HasEvent = function(name)
    {
        if(LiquidGIS.IsEmpty(this.nameDictionary[name])) return false;
        if(this.nameDictionary[name].length == 0) return false;
        return true;
    }


    /*
     * 订阅事件。
     * @param {String} name 事件名称。
     * @param {function} command 事件触发后执行的命令。
     */
    this.Subscribe = function(name, command)
    {
        if (LiquidGIS.IsEmpty(this.nameDictionary[name]))
        {
            this.nameDictionary[name] = [] ;
        }
        this.nameDictionary[name].push(command);
    }

    /*
       * 取消订阅事件。
       * @param {String} name 事件名称。
       * @param {function} command 事件触发后执行的命令。
     */
    this.UnSubscribe = function( name, command)
    {
        if (LiquidGIS.IsEmpty(this.nameDictionary[name]))
        {
            this.nameDictionary[name] = [] ;
        }
        this.nameDictionary[name].Remove(command);
    }
}

LiquidGIS.Application.EventData = new LiquidGIS.EventData();




/*  模板函数 */

/**
 *
 * @param template
 * @param data
 * @returns {String}
 * @constructor
 */
LiquidGIS.Template.Replace = function(template, data)
{
    return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
        var keys = key.split("."), v = data[keys.shift()];
        for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
        return (typeof v !== "undefined" && v !== null) ? v : "";
    });
}

LiquidGIS.Template._HTMLCACHE={};// 缓存远程模板 避免重复请求
LiquidGIS.Template.RenderWithHtml = function(templateHtmlString,data,container,callback)
{
	var html = $.templates(templateHtmlString).render(data);
	if(LiquidGIS.IsEmpty(container)) 
	{
		if(!LiquidGIS.IsEmpty(callback) && typeof(callback)=="function") callback();
		return html;
	}
	if(typeof(container) == "string")
	{
		$("#"+container).html(html);
		if(!LiquidGIS.IsEmpty(callback)&& typeof(callback)=="function") callback();
	}
	else 
	{
		container.html(html);
		if(!LiquidGIS.IsEmpty(callback)&& typeof(callback)=="function") callback();
	}
	
}



LiquidGIS.Template.RenderWithUrl = function(url,data, container,callback)
{
	if(LiquidGIS.IsEmpty( LiquidGIS.Template._HTMLCACHE[url] ))
	{
	  $.get(url, null, function (html, textStatus){
	  			LiquidGIS.Template._HTMLCACHE[url] = html;	
                LiquidGIS.Template.RenderWithHtml(html,data, container,callback);  
                },"html"
            );
	}
	else
		LiquidGIS.Template.RenderWithHtml(LiquidGIS.Template._HTMLCACHE[url],data,container,callback);
}

LiquidGIS.Template.RenderWithName = function(name,data,container)
{
	var html = $.render[name](data);
	if(typeof(container) == "string") $("#"+container).html(html);
	else container.html(html);
}

LiquidGIS.Template.CompiledTemplate = function(templateHtmlString)
{
	return $.templates(templateHtmlString);
}

LiquidGIS.Template.RegisterTemplate = function(name,templateHtmlString)
{
	return $.templates(name,templateHtmlString);
}






