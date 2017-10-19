// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.16/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/metadata/types/arcgis/content/templates/CoverageDescription.html":'\x3cdiv data-dojo-attach-point\x3d"containerNode"\x3e\r\n  \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/OpenElement"\r\n    data-dojo-props\x3d"target:\'CovDesc\',minOccurs:0,showHeader:false,label:\'${i18nArcGIS.contInfo.CovDesc.caption}\'"\x3e\r\n    \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Tabs"\x3e\r\n    \r\n      \x3c!-- description --\x3e\r\n      \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Section"\r\n        data-dojo-props\x3d"showHeader:false,label:\'${i18nArcGIS.contInfo.CovDesc.section.description}\'"\x3e\r\n      \r\n        \x3c!-- attribute description --\x3e\r\n        \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Element"\r\n          data-dojo-props\x3d"target:\'attDesc\',minOccurs:1,label:\'${i18nArcGIS.contInfo.attDesc}\'"\x3e\r\n        \x3c/div\x3e\r\n        \r\n        \x3c!-- content type --\x3e\r\n        \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Element"\r\n          data-dojo-props\x3d"target:\'contentTyp\',minOccurs:1,label:\'${i18nArcGIS.codelist.MD_CoverageContentTypeCode}\'"\x3e\r\n          \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/types/arcgis/content/ContentTypCd"\x3e\x3c/div\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \r\n      \x3c!-- range/band --\x3e\r\n      \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Section"\r\n        data-dojo-props\x3d"showHeader:false,label:\'${i18nArcGIS.contInfo.CovDesc.section.rangesAndBands}\'"\x3e\r\n        \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Element"\r\n          data-dojo-props\x3d"target:\'covDim\',minOccurs:0,maxOccurs:\'unbounded\',label:\'${i18nArcGIS.contInfo.covDim.caption}\'"\x3e\r\n          \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/ElementChoice"\x3e\r\n            \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/types/arcgis/content/RangeDimension"\r\n              data-dojo-props\x3d"label:\'${i18nArcGIS.contInfo.RangeDim.caption}\'"\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/types/arcgis/content/Band"\r\n              data-dojo-props\x3d"label:\'${i18nArcGIS.contInfo.Band.caption}\'"\x3e\r\n            \x3c/div\x3e\r\n          \x3c/div\x3e    \r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e'}});
define("esri/dijit/metadata/types/arcgis/content/CoverageDescription","dojo/_base/declare dojo/_base/lang dojo/has ../../../../../kernel ../../../base/Descriptor dojo/text!./templates/CoverageDescription.html ./ContentTypCd ./Band ./RangeDimension".split(" "),function(a,b,c,d,e,f){a=a(e,{templateString:f});c("extend-esri")&&b.setObject("dijit.metadata.types.arcgis.content.CoverageDescription",a,d);return a});