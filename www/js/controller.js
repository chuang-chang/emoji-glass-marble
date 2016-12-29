angular.module('starter.controllers', [])
.controller('welcomCtrl',['$scope','Emoji','$state',function(scope,Emoji,$state){
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
		],
		slidePage:0
	}
	vm.fn = {
		init:function(){
			this.slideScroll();
		},
		slideScroll:function(){
			function timeStart(){
				vm.vars.timer = setTimeout(function(){
					if(vm.vars.slidePage<2){
						vm.vars.slidePage++;
					}else{
						vm.vars.slidePage = 0;
					}
					scope.$apply();
					clearTimeout(vm.vars.timer);
					timeStart();
				},3000);
			}
			timeStart();
		},
		swipeLeft:function(){
			clearTimeout(vm.vars.timer);
			if(vm.vars.slidePage<2){
				vm.vars.slidePage++;
			}else{
				vm.vars.slidePage = 0;
			}
		},
		swipeRight:function(){
			clearTimeout(vm.vars.timer);
			if(vm.vars.slidePage>0){
				vm.vars.slidePage--;
			}else{
				vm.vars.slidePage = 2;
			}
		},
		wechatLogin:function(){
			//微信登录，这里暂时使用路由跳转
			$state.go("index");
		}
	}
	vm.fn.init();
	scope.vm = vm;
}])
.controller('indexCtrl',['$scope','Emoji','$state',function(scope,Emoji,$state){
	var vm = this;
	vm.vars = {
		tooltip:false,
	}
	vm.fn = {
		init:function(){

		}
	}

	vm.fn.init();

	scope.vm = vm;
}])