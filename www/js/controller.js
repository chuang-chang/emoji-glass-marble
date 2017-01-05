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
.service('Balls',['Emoji','dataHandler',function(Emoji,dataHandler){
	var dh = new dataHandler();
	var getFlag=function(id) {
	  return document.getElementById(id);   //获取元素引用
	}
	var extend=function(des, src) {
	   for (p in src) {
	     des[p]=src[p];
	  }
	  return des;
	}
	var Ball=function (diameter,index) {
	    var ball=document.createElement("div");
	    ball.className="marble";
	    if(index==0){
	    	ball.className+=" myBall";
	    	ball.id = JSON.parse(localStorage.getItem("fightMarble")).urls.group[0].url.split("/").pop().split(".")[0];
	    	ball.innerHTML="<img src='"+JSON.parse(localStorage.getItem("fightMarble")).urls.group[0].url+"'><i></i>";
	    }else{
	    	var ba = dh.getRandom("marbles");
	    	ball.id = ba.urls.group[0].url.split("/").pop().split(".")[0];
	    	ball.innerHTML="<img src='"+ba.urls.group[0].url+"'><i></i>";
	    }
	    with(ball.style) {
	      width=height=diameter+'px';position='absolute';
	    }
	    return ball;
	}
	var Screen=function (cid,config) {
	    //先创建类的属性
	    var self=this;
	    console.log(cid)
	    if (!(self instanceof Screen)) {
	        return new Screen(cid,config)
	    }
	    config=extend(Screen.Config, config)    //configj是extend类的实例    self.container=getFlag(cid);            //窗口对象
	    self.container=document.getElementById(cid);
	    console.log(self.container)
	    self.ballsnum=config.ballsnum;
	    self.diameter=50;                       //球的直径
	    self.radius=self.diameter/2;
	    self.spring=config.spring;              //球相碰后的反弹力
	    self.bounce=config.bounce;              //球碰到窗口边界后的反弹力
	    self.gravity=config.gravity;            //球的重力
	    self.balls=[];                          //把创建的球置于该数组变量
	    self.timer=null;                       //调用函数产生的时间id
	    self.L_bound=0;                       //container的边界
	    self.R_bound=self.container.clientWidth;  //document.documentElement.clientWidth || document.body.clientWidth 兼容性
	    self.T_bound=0;
	    self.B_bound=self.container.clientHeight;
	    self.overflows = {};//已被打出去的球
	    console.log(self.R_bound,self.B_bound);
	};
	Screen.Config={                         //为属性赋初值
	    ballsnum:2,
	    spring:0.8,
	    bounce:-0.9,
	    gravity:0.05
	};
	Screen.prototype={
	    initialize:function () {
	        var self=this;
	        self.createBalls();
	        // self.hitBalls();
	        // self.timer=setInterval(function (){self.hitBalls()}, 50)
	    },
	    createBalls:function () {
	        var self=this, 
	            num=self.ballsnum;
	        var frag=document.createDocumentFragment();    //创建文档碎片，避免多次刷新       
	        for (i=0;i<num;i++) {
	            var ball=new Ball(self.diameter,i);
	            //var ball=new Ball(self.diameter,clss[ Math.floor(Math.random()* num )]);//这里是随机的10个小球的碰撞效果
	            ball.diameter=self.diameter;
	            ball.radius=self.radius;
	            ball.style.left=(Math.random()*self.R_bound)+'px';  //球的初始位置，
	            ball.style.top=(Math.random()*self.B_bound)+'px';
	            ball.vx=Math.random() * 6 -3;
	            ball.vy=Math.random() * 6 -3;
	            console.log(ball.vx,ball.vy)
	            frag.appendChild(ball);
	            self.balls[i]=ball;
	        }
	        self.container.appendChild(frag);
	    },
	    hitBalls:function () {
	        var self=this, 
	            num=self.ballsnum,
	            balls=self.balls;
	        for (i=0;i<num-1;i++) {
	           var ball1=self.balls[i];
	           ball1.x=ball1.offsetLeft+ball1.radius;      //小球圆心坐标
	           ball1.y=ball1.offsetTop+ball1.radius;
	           for (j=i+1;j<num;j++) {
	               var ball2=self.balls[j];
	               ball2.x=ball2.offsetLeft+ball2.radius;
	               ball2.y=ball2.offsetTop+ball2.radius;
	               dx=ball2.x-ball1.x;                      //两小球圆心距对应的两条直角边
	               dy=ball2.y-ball1.y;
	               var dist=Math.sqrt(dx*dx + dy*dy);       //两直角边求圆心距
	               var misDist=ball1.radius+ball2.radius;   //圆心距最小值
	              if(dist < misDist) {                    
	                   //假设碰撞后球会按原方向继续做一定的运动，将其定义为运动A   
	                   var angle=Math.atan2(dy,dx);
	                  //当刚好相碰，即dist=misDist时，tx=ballb.x, ty=ballb.y
	                   tx=ball1.x+Math.cos(angle) * misDist; 
	                   ty=ball1.y+Math.sin(angle) * misDist;
	                  //产生运动A后，tx > ballb.x, ty > ballb.y,所以用ax、ay记录的是运动A的值
	                   ax=(tx-ball2.x) * self.spring;  
	                   ay=(ty-ball2.y) * self.spring;
	                  //一个球减去ax、ay，另一个加上它，则实现反弹
	                   ball1.vx-=ax;                         
	                   ball1.vy-=ay;
	                   ball2.vx+=ax;
	                   ball2.vy+=ay;
	              }
	           }
	        }
	        for (i=0;i<num;i++) {
	            self.moveBalls(balls[i]);
	        }
	        // for(var i =0;i<balls.length;i++){
	        // 	if(JSON.parse(localStorage.getItem("fightMarble")).urls.group[0].url.split("/").pop().split(".")[0]==balls[i].id){
	        // 		self.moveBalls(balls[i]);
	        // 		break;
	        // 	}
	        // }
	        
	    },
	    moveBalls:function (ball) {
	        var self=this;
	        ball.vy+=self.gravity;
	        ball.style.left=(ball.offsetLeft+ball.vx)+'px';
	        ball.style.top=(ball.offsetTop+ball.vy)+'px';
	        //判断球与窗口边界相碰，把变量名简化一下
	        var L=self.L_bound, R=self.R_bound, T=self.T_bound, B=self.B_bound, BC=self.bounce; 
	        var id = (ball.children[0].src.split("/").pop()).split(".")[0];
	        var src = ball.children[0].src;
	        if (ball.offsetLeft < L) {
	            ball.style.left=L;
	            ball.vx*=BC;
	        }
	        if (ball.offsetTop < T) {
	            ball.style.top=T;
	            ball.vy*=BC;
	        }
	        if (ball.offsetLeft > (R-ball.diameter)) {
	            ball.style.left=(R-ball.diameter)+'px';
	            ball.vx = ball.vx/BC;
	        }
	        if ((ball.offsetTop) > (B-ball.diameter)) {
	            ball.style.top=(B-ball.diameter)+'px';
	            ball.vy= ball.vy/BC;
	        }
	    }
	}
	return Screen;
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
.controller('indexCtrl',['$scope','$rootScope','$timeout','Emoji','$state','dataHandler','Balls',function(scope,root,$timeout,Emoji,$state,dataHandler,Balls){
	var vm = this;
	var dh = new dataHandler();

	if(!localStorage.getItem("fightMarble")){
		var fightMarble = dh.getRandom("marbles");
		localStorage.setItem("fightMarble",JSON.stringify(fightMarble));
	}
	
	vm.vars = {
		tooltip:false,
		fightMarble:JSON.parse(localStorage.getItem("fightMarble")),
		propersMarbles:dh.getRandom("propers"),
	}
	var Rotate = function(Source,Angle)//Angle为正时逆时针转动, 单位为弧度
	{
	    var A,R;
	    A = Math.atan2(Source.Y,Source.X)//atan2自带坐标系识别, 注意X,Y的顺序
	    A += Angle//旋转
	    R = Math.sqrt(Source.X * Source.X + Source.Y * Source.Y)//半径
	    return {
	        X : Math.cos(A) * R,
	        Y : Math.sin(A) * R
	    }
	}
	vm.fn = {
		init:function(){
			console.log(vm.vars);
			vm.fn.getFightballType();
		},
		//获取球的类型
		getMarbleType:function(url){
			return dh.chn(url);
		},
		/**
		 * 更换球
		 * @return {[type]} [description]
		 */
		changeMarble:function(){
			var fightMarble = dh.getRandom("marbles");
			vm.vars.fightMarble = fightMarble;
			localStorage.setItem("fightMarble",JSON.stringify(fightMarble));
		},
		/**
		 * 获取作战球类型
		 * @return {[type]} [description]
		 */
		getFightballType:function(){
			return vm.fn.getMarbleType(vm.vars.fightMarble.urls.group[0].url)
		},
		/**
		 * 选择类型并开始游戏
		 * @return {[type]} [description]
		 */
		startGame:function(){
			vm.vars.start = true;
			$timeout(function(){
				vm.vars.balls = new Balls('startGame',{ballsnum:10, spring:0.1, bounce:-0.9, gravity:0.05});
        		vm.vars.balls.initialize();
			},100);
			
		},
		hit:function(){
			vm.vars.startFit = !vm.vars.startFit;
			if(vm.vars.startFit){
				vm.vars.balls.timer=setInterval(function (){vm.vars.balls.hitBalls()}, 40)
			}else{
				clearTimeout(vm.vars.balls.timer);
			}
			
		},
		readyOrigin:function(e){
			vm.vars.dragOriginX = e.target.offsetLeft;
			vm.vars.dragOriginY = e.target.offsetTop;
		},
		/**
		 * 调整角度
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		adjustPosition:function(e){
			console.log(e);
			//获取横坐标的位置
			vm.vars.dragX = vm.vars.dragOriginX+e.gesture.deltaX+15;
			//获取角度
			var angleOfLine = Math.atan2(e.target.offsetTop, vm.vars.dragX) * 180 / Math.PI;
			
			vm.vars.dragY = Rotate({X:vm.vars.dragX,Y:32},Math.PI/180*angleOfLine).Y;

			// 
			// if(vm.vars.dragX>100)vm.vars.dragX=100;
			// if(vm.vars.dragX<0)vm.vars.dragX=0;
			
		},
		/**
		 * 按住开始计时
		 * @return {[type]} [description]
		 */
		startTimer:function(){
			vm.vars.powerVal = 0;
			function startT(){
				vm.vars.powerTimer = $timeout(function(){
					if(vm.vars.powerVal<10){
						vm.vars.powerVal++;
					}
					$timeout.cancel(vm.vars.powerTimer);
					startT();
				},100);
			}
			startT();
		},
		/**
		 * 松开
		 * @return {[type]} [description]
		 */
		endTimer:function(){
			vm.vars.powerVal = 0;
			$timeout.cancel(vm.vars.powerTimer);
		},
		getPOS:function(e){
			console.log(e);
		}
	}

	vm.fn.init();

	scope.vm = vm;
}])