;(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define([ "jquery"], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function ($) {
    var defaults ={
       insertType:1,//1=>直接存html字符串
       dataStr:'',
       scrollY:0,
       appendTo:'#list',
       name:'detail2list',
       extraData:{},
       dataStrName:'dataStr',
       scrollYName:'scrollY',
       extraDataName:'extraData',
       currentTimeStampName:'currentTimeStamp',
       currentTimeStamp:(new Date()).getTime(),
       expire:10*60*1000//过期时间,单位毫秒，默认10分钟
    };
    function detail2list(options){
        this.settings=$.extend({},defaults,options || {});
        this.init();
    }
    detail2list.prototype={
        init:function(){
            if(!('localStorage' in window)&&!(window['localStorage'] !== null)){
                console.error("您的浏览器不支持h5的window.localStorage本地存储，请使用其他现代浏览器");
                return;
            }
            this.isExpire();
            this.windowBind();
            this.setLocalStorage(0);
        },
        isExpire:function(){
            var current=(new Date).getTime();
            if(this.existLocalStorageName()){
                var storage=this.getLocalStorage();
                var localCurrent=storage[this.settings.currentTimeStampName]+this.settings.expire;
                if(current>localCurrent){
                    this.removeLocalStorage();
                    console.log("expire");
                }
            }
        },
        insertHtmlStr:function(str,extraData){
            this.setLocalStorage(1,str,extraData);
        },
        setLocalStorage:function(type,str,extraData){
            //type=0=>refresh or back，type=1=>scrolling
            var storage;
            if(this.existLocalStorageName()){
                //exist
                storage=this.getLocalStorage();
                if(type==0){
                    $(this.settings.appendTo).html(storage[this.settings.dataStrName]);
                    this.scroll2Y(storage[this.settings.scrollYName]);
                    storage[this.settings.extraDataName]=storage[this.settings.extraDataName];
                }
                else if(type==1&&extraData!==undefined){
                    storage[this.settings.extraDataName]=extraData;
                }
                storage[this.settings.scrollYName]=this.settings.scrollY;
                storage[this.settings.dataStrName]=str===undefined?storage[this.settings.dataStrName]:str;;
                window.localStorage.setItem(this.settings.name,this.string2json(storage));
            }
            else{
                //not existc
                storage={};
                storage[this.settings.currentTimeStampName]=this.settings.currentTimeStamp;
                storage[this.settings.extraDataName]=this.settings.extraData;
                storage[this.settings.scrollYName]=this.settings.scrollY;
                storage[this.settings.dataStrName]=this.settings.dataStr;
                window.localStorage.setItem(this.settings.name,this.string2json(storage));
            }
        },
        getLocalStorage:function(){
            return this.json2string(window.localStorage.getItem(this.settings.name));
        },
        removeLocalStorage:function(){
            window.localStorage.removeItem(this.settings.name);
        },
        string2json:function(json){
            return JSON.stringify(json);
        },
        json2string:function(str){
            return JSON.parse(str);
        },
        existLocalStorageName:function(){
            return window.localStorage.getItem(this.settings.name)===null?false:true;
        },
        windowBind:function(){
            $(window).scroll($.proxy(function(){
                var scroll_top=$(window).scrollTop();
                this.settings.scrollY=scroll_top;
                this.setLocalStorage(1);
            },this));
        },
        scroll2Y:function(scrolly){
            $("html,body").scrollTop(scrolly);
        },

    }
    window.h5Detail2list=detail2list;
}));