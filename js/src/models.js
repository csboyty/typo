var models=angular.module("models",["ngResource","services"]);
models.factory("ChineseCharacter",["$rootScope","$resource","Config",
    function($rootScope,$resource,Config){
        return $resource(Config.ajaxUrls.baseUrl+Config.ajaxUrls.getAllTypo,{},{
                query:{method:"get",params:{limit:Config.perLoadCount.list,offset:0,choice:0,category:1}},
                getNewest:{method:"get",url:Config.ajaxUrls.baseUrl+Config.ajaxUrls.getAllTypo,
                    params:{limit:5,offset:0,choice:1,category:0}},
                get:{method:"get",url:Config.ajaxUrls.baseUrl+Config.ajaxUrls.getTypoDetail,
                    params:{id:0}}
            })
    }]);
models.factory("SpecialDesign",["$rootScope","$resource","Config",
    function($rootScope,$resource,Config){
        return $resource(Config.ajaxUrls.baseUrl+Config.ajaxUrls.getAllSpecialDesign,{},{
            query:{method:"get",params:{limit:Config.perLoadCount.list,offset:0,choice:0}},
            getNewest:{method:"get",url:Config.ajaxUrls.baseUrl+Config.ajaxUrls.getAllSpecialDesign,
                params:{limit:4,offset:0,choice:1}},
            getWorks:{method:"get",url:Config.ajaxUrls.getSpecialDesignWorks,
                params:{count:Config.perLoadCount.list,last_id:0}},
            getWorkDetail:{method:"get",url:Config.ajaxUrls.getSpecialDesignWorkDetail,
                params:{id:0}},
            get:{method:"get",url:Config.ajaxUrls.baseUrl+Config.ajaxUrls.getSpecialDesignDetail,
                params:{id:0}}
        })
    }]);

models.factory("Search",["$rootScope","$resource","Config",
    function($rootScope,$resource,Config){
        return $resource(Config.ajaxUrls.baseUrl+Config.ajaxUrls.search,{},{
            query:{method:"get",params:{limit:Config.perLoadCount.list,offset:0,searchKey:""}}
        })
    }]);