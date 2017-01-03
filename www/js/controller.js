angular.module('starter.controllers', [])
.service('dataHandler', ['Emoji',function(Emoji) { //transdata
		function dataHandler() {
			this.data = {};
		}
		function getOnerandom(){
			var arr = arguments[0];
			return [arr[Math.floor(Math.random()*arr.length)]];
		}
		function getMultirandom(){
			var arr = arguments[0],count = arguments[1];
			var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
			while (i-- > min) {
				index = Math.floor((i + 1) * Math.random());
				temp = shuffled[index];
				shuffled[index] = shuffled[i];
				shuffled[i] = temp;
			}
			return shuffled.slice(min);
		}
		dataHandler.prototype.getRandom = function(){//随机取球
			var arg = arguments[0];//类型
			var returnData = {
				urls:{type:arg,group:[]},
				type:arg,
			}
			var count = 1;
			if(arg==="sysProps"){
				count = 2;
			}else if(arg ==="propers"){
				count = 3;
			}
			returnData.urls.group = count>1?getMultirandom(Emoji[arg],count):getOnerandom(Emoji[arg],count);
			return returnData;
		}
		dataHandler.prototype.chn = function(url){//获取球的类型
			var chn = {
				"faces":{name:"普通球",belong:"marbles"},//belong:marbles:作战球
				"animals":{name:"生肖球",belong:"marbles"},
				"stars":{name:"星座球",belong:"marbles"},
				"others":{name:"道具球",belong:"propers"},//道具球
			}
			var data = null;
			for(var i =0;i<url.split("/").length;i++){
				if(chn[url.split("/")[i]]){
					data = chn[url.split("/")[i]];
					break;
				}
			}
			return data;
		}
		dataHandler.prototype.getOneMarble = function(key) {//获取球的属性
			var hashArr = [];
			for(var e in Emoji){
				hashArr.concat(Emoji[e]);
			}
			var one = null;
			for(var i = 0;i<hashArr.length;i++){
				if(hashArr[i].id==key){
					if(!hashArr[i].speed)hashArr[i].speed=1;
					if(!hashArr[i].weight)hashArr[i].weight=1;
					one = hashArr[i];
					break;
				}
			}
			return one;
		}
		return dataHandler;
}])
.controller('welcomCtrl',['$scope','Emoji','$state',function(scope,Emoji,$state){
	var vm = this;
	vm.vars = {
		loademoji:[
			"imgs/faces/50.png",
			"imgs/faces/705.png",
			"imgs/faces/727.png",
			"imgs/animals/379.png",
			"imgs/animals/408.png",
			"imgs/stars/55.png",
			"imgs/stars/56.png",
			"imgs/sun/198.png",
			"imgs/others/101.png",
			"imgs/others/161.png",
			"imgs/faces/755.png",
			"imgs/animals/770.png",
			"imgs/stars/60.png",
			"imgs/faces/718.png",
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
.controller('indexCtrl',['$scope','Emoji','$state','dataHandler',function(scope,Emoji,$state,dataHandler){
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