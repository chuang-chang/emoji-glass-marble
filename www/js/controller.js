angular.module('starter.controllers', [])
.controller('welcomCtrl',['$scope','Emoji',function(scope,Emoji){
	var vm = this;
	vm.vars = {
		loademoji:[
			"../imgs/faces/50.png",
			"../imgs/faces/705.png",
			"../imgs/faces/727.png",
			"../imgs/animals/379.png",
			"../imgs/animals/408.png",
			"../imgs/stars/55.png",
			"../imgs/stars/56.png",
			"../imgs/sun/198.png",
			"../imgs/others/101.png",
			"../imgs/others/161.png",
			"../imgs/faces/755.png",
			"../imgs/animals/770.png",
			"../imgs/stars/60.png",
			"../imgs/faces/718.png",
		]
	}

	scope.vm = vm;
}])
.controller('indexCtrl',['$scope',function(scope,Emoji){

}])