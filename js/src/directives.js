/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-24
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */
var directives=angular.module("directives",["services","models"]);
directives.directive("windowScroll", ["$timeout","Config","Storage","ChineseCharacter","SpecialDesign",
    function ($timeout,Config,Storage,ChineseCharacter,SpecialDesign) {
        return {
            link: function(scope, element, attrs) {
                var targetEl=attrs.windowScroll?element[0]:element[0].parentElement,
                    allHeight=0,
                    clientHeight=0,
                    scrollTop=0;

                if(Storage.scrollTimer){
                    $timeout.cancel(Storage.scrollTimer);
                    Storage.scrollTimer=null;
                }
                Storage.scrollTimer=$timeout(function(){
                    angular.element(targetEl).bind("scroll",function(){
                        scrollTop=targetEl.scrollTop;
                        allHeight=targetEl.scrollHeight;
                        clientHeight=targetEl.clientHeight;

                        if(Storage.currentScrollType&&scrollTop+clientHeight>=allHeight&&
                            Storage.lastLoadCount!=Config.hasNoMoreFlag){
                            switch(Storage.currentScrollType){
                                case Config.scrollTypes.specialDesign:
                                    SpecialDesign.query({offset:Storage.lastLoadCount},function(response){
                                        scope.designs=scope.designs.concat(response.aaData);

                                        if(response.aaData.length<Config.perLoadCount.list){
                                            Storage.lastLoadCount=Config.hasNoMoreFlag;
                                        }else{
                                            Storage.lastLoadCount+=Config.perLoadCount.list;
                                        }
                                    });
                                    break;
                                case Config.scrollTypes.specialDesignWork:
                                    SpecialDesign.getWorks({id:Storage.currentDetailId[1],
                                        last_id:Storage.lastLoadCount},function(response){

                                        scope.artifacts=scope.artifacts.concat(response.artifacts);

                                        if(response.artifacts.length<Config.perLoadCount.list){
                                            Storage.lastLoadCount=Config.hasNoMoreFlag;
                                        }else{
                                            Storage.lastLoadCount=response.artifacts[response.artifacts.length-1].
                                                artifact.id;
                                        }
                                    });
                                    break;
                                default:
                                    ChineseCharacter.query({category:Storage.currentScrollType.substr(-1,1)},function(response){
                                        scope.results=scope.results.concat(response.aaData);

                                        if(response.aaData.length<Config.perLoadCount.list){
                                            Storage.lastLoadCount=Config.hasNoMoreFlag;
                                        }else{
                                            Storage.lastLoadCount+=Config.perLoadCount.list;
                                        }
                                    });
                                    break;
                            }
                        }
                    });
                },200);

                //释放内存
                scope.$on("$destroy",function( event ) {
                    $timeout.cancel(Storage.scrollTimer);
                    angular.element(targetEl).unbind("scroll");
                });
            }
        }
    }]);