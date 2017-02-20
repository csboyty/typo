/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-17
 * Time: 下午4:12
 * To change this template use File | Settings | File Templates.
 */
var app=angular.module("app",
    ['ngAnimate',"controllers","directives","filters","ngTouch","ngSanitize"]);

app.config(["$locationProvider","$httpProvider","App",
    function($locationProvider,$httpProvider,App){


        //ajax的一些默认配置，全局启用loading
        $httpProvider.defaults.transformRequest.push(function (data,headers) {
            App.showLoading();

            return data;
        });

        $httpProvider.defaults.transformResponse.push(function (data) {
            App.hideLoading();

            return data;
        });

        //对返回的数据进行拦截，直接全局处理出错信息
        $httpProvider.interceptors.push(function ($q) {
            return {
                request:function(config){

                    //消除服务端缓存的影响
                    /*if(config.method=='GET'&&config.url.indexOf("views")==-1){
                        var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                        config.url = config.url+separator+'noCache=' + new Date().getTime();
                    }*/

                    return config||$q.reject(config);
                },
                response: function (res) {
                    //console.log(res);
                    if((typeof res.data.success!="undefined"&&res.data.success==false)||
                        (typeof res.data.resultCode!="undefined"&&res.data.resultCode!=200)){

                        App.ajaxReturnErrorHandler(res.data.message);
                        return $q.reject(res.data);
                    }else{
                        return res;
                    }
                },
                responseError: function (res) {
                    App.ajaxErrorHandler();
                    return $q.reject(res);
                }
            };
        });

    }]);

//在run中做一些扩展,扩展App模块，从而可以在config中使用
app.run(["$rootScope","$templateCache","App","AjaxErrorHandler",
    function($rootScope,$templateCache,App,AjaxErrorHandler){
    $rootScope.rootFlags={
        showLoading:false
    };
    angular.extend(App,AjaxErrorHandler);

    App.showLoading=function(){
        $rootScope.rootFlags.showLoading=true;
    };
    App.hideLoading=function(){
        $rootScope.rootFlags.showLoading=false;
    };

}]);

app.controller("super",["$scope","Config","CFunctions","Storage",
    function($scope,Config,CFunctions,Storage){

        //使用对象，子scope可以直接覆盖（对象地址）
        $scope.mainVars={
            contentTemplate:Config.viewUrls.home,
            showSearchPanel:false,
            searchTags:[],
            currentMenu:"home",
            showSlideMenu:false,
            detailTemplate:"",
            workDetailTemplate:""
        };
        $scope.slideMenuIcon="icon-bar-short";

        $scope.toPage=function(pageName,category){
            $scope.mainVars.contentTemplate=Config.viewUrls[pageName]+"?"+new Date().getTime();
            $scope.mainVars.currentMenu=pageName;
            if(category){
                $scope.mainVars.currentMenu+=category;
                Storage.currentScrollType=$scope.mainVars.currentMenu;
            }

            $scope.mainVars.showSearchPanel=false;
        };

        $scope.toggleSearch=function(){
            $scope.mainVars.showSearchPanel=!$scope.mainVars.showSearchPanel;
        };
        $scope.toSearchResult=function(content){
            if(CFunctions.trim(content)){
                $scope.mainVars.searchTags.push(content);
                $scope.mainVars.showSearchPanel=false;
                $scope.mainVars.detailTemplate=Config.viewUrls.searchResult;
            }
        };

        $scope.showSlideMenu=function(){
            $scope.mainVars.showSlideMenu=!$scope.mainVars.showSlideMenu;
            if($scope.mainVars.showSlideMenu){
                $scope.slideMenuIcon="icon-bar";
            }else{
                $scope.slideMenuIcon="icon-bar-short";
            }
        };

        $scope.showSpecialDesignDetail=function(id,detailId,title){
            $scope.mainVars.detailTemplate=Config.viewUrls.specialDesignDetail;
            Storage.currentDetailId=[id,detailId,title];
        };
        $scope.showTypoDetail=function(id){
            $scope.mainVars.detailTemplate=Config.viewUrls.typoDetail;
            Storage.currentDetailId=id;
        };
        $scope.showWorkDetail=function(id){
            $scope.mainVars.workDetailTemplate=Config.viewUrls.workDetail;
            Storage.currentWorkDetailId=id;
        };
        $scope.hideDetail=function(){
            $scope.mainVars.detailTemplate="";
        };
        $scope.hideWorkDetail=function(){
            $scope.mainVars.workDetailTemplate="";
        }

    }]);
