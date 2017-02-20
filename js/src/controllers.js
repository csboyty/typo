/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-24
 * Time: 下午3:12
 * To change this template use File | Settings | File Templates.
 */
var controllers=angular.module("controllers",["services","models"]);

controllers.controller("home",['$scope',"ChineseCharacter","SpecialDesign",
    function($scope,ChineseCharacter,SpecialDesign){
        Storage.currentScrollType="";
        ChineseCharacter.getNewest(function(response){
            $scope.items=response.aaData;
        });
        SpecialDesign.getNewest(function(response){
            $scope.roll.items=response.aaData;
            $scope.roll.info=$scope.roll.items[0];
            if(response.aaData.length>1){
                $scope.roll.showNext=true;
            }
        });

        $scope.prev=function(){
            $scope.roll.currentNumber=$scope.roll.currentNumber-1;
            $scope.roll.rollLeft="left:"+"-"+$scope.roll.currentNumber*100+"%";
            if($scope.roll.currentNumber==0){
                $scope.roll.showPrev=false;
            }
            $scope.roll.info=$scope.roll.items[$scope.roll.currentNumber];
            $scope.roll.showNext=true;
        };
        $scope.next=function(){
            $scope.roll.currentNumber=$scope.roll.currentNumber+1;
            $scope.roll.rollLeft="left:"+"-"+$scope.roll.currentNumber*100+"%";
            if($scope.roll.currentNumber==$scope.roll.items.length-1){
                $scope.roll.showNext=false;
            }

            $scope.roll.info=$scope.roll.items[$scope.roll.currentNumber];

            $scope.roll.showPrev=true;
        };

        $scope.roll={
            currentNumber:0,
            rollLeft:"left:0",
            showNext:false,
            showPrev:false,
            items:[],
            info:{
                title:"",
                teacher:"",
                createTime:"",
                abstract_:""
            }
        };
}]);
controllers.controller("typo",['$scope',"ChineseCharacter","Config","Storage",
    function($scope,ChineseCharacter,Config,Storage){
        Storage.lastLoadCount=0;

        ChineseCharacter.query({category:Storage.currentScrollType.substr(-1,1)},function(response){
            $scope.results=response.aaData;

            if(response.aaData.length<Config.perLoadCount.list){
                Storage.lastLoadCount=Config.hasNoMoreFlag;
            }else{
                Storage.lastLoadCount+=Config.perLoadCount.list;
            }
        });
    }]);
controllers.controller("typoDetail",['$scope',"ChineseCharacter","Config","Storage",
    function($scope,ChineseCharacter,Config,Storage){

        ChineseCharacter.get({id:Storage.currentDetailId},function(response){
            $scope.info=response.object;
        });
    }]);
controllers.controller("specialDesign",['$scope',"SpecialDesign","Config","Storage",
    function($scope,SpecialDesign,Config,Storage){
        Storage.currentScrollType=Config.scrollTypes.courseDesignWork;
        Storage.lastLoadCount=0;

        SpecialDesign.query(function(response){
            $scope.results=response.aaData;

            if(response.aaData.length<Config.perLoadCount.list){
                Storage.lastLoadCount=Config.hasNoMoreFlag;
            }else{
                Storage.lastLoadCount+=Config.perLoadCount.list;
            }
        });
    }]);
controllers.controller("specialDesignDetail",['$scope',"SpecialDesign","Config","Storage",
    function($scope,SpecialDesign,Config,Storage){
        Storage.currentScrollType=Config.scrollTypes.specialDesignWork;
        Storage.lastLoadCount=0;

        $scope.info={
            title:Storage.currentDetailId[2],
            author:"指导老师",
            createTime:"2016-09-09",
            abstract_:"这里是描述"
        };

        /*SpecialDesign.get({id:Storage.currentDetailId[0]},function(response){
            $scope.info=response.object;
        });*/

        SpecialDesign.getWorks({id:Storage.currentDetailId[1]},function(response){
            $scope.artifacts=response.artifacts;

            if(response.artifacts.length<Config.perLoadCount.list){
                Storage.lastLoadCount=Config.hasNoMoreFlag;
            }else{
                Storage.lastLoadCount=response.artifacts[response.artifacts.length-1].artifact.id;
            }
        });
    }]);

controllers.controller("workDetail",['$scope',"SpecialDesign","Config","Storage",
    function($scope,SpecialDesign,Config,Storage){

        SpecialDesign.getWorkDetail({id:Storage.currentWorkDetailId},function(response){
            $scope.info=response;
        });
    }]);
controllers.controller("searchResult",['$scope',"Search","Config","CFunctions",
    function($scope,Search,Config,CFunctions){
        $scope.tags=$scope.mainVars.searchTags;
        $scope.mainVars.searchTags=[];
        $scope.total=0;

        function search(){
            Search.query({searchKey:$scope.tags.join(",")},function(response){
                $scope.result=response.object;
            })
        }
        search();

        $scope.remove=function(tag){
            var index=$scope.tags.indexOf(tag);
            $scope.tags.splice(index,1);
            search();
        };

        $scope.removeAll=function(){
            $scope.tags=[];
            $scope.result={
                ChineseCharacter:[],
                SpecialDesign:[]
            };
        };



        $scope.addSearchTags=function(tag){
            if(CFunctions.trim(tag)&&$scope.tags.indexOf(tag)==-1){
                $scope.tags.push(tag);
                $scope.searchTag="";

                //重新搜索
                search();
            }

        }
    }]);





