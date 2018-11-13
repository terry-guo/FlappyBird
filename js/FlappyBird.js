//  总游戏对象
class Game{
        constructor(option){
            option = option || {};
            // 0.备份this
            var self = this;
            // 1.fps
            this.fps = option.fps || 60;
            // 2.实例化帧工具类
            this.frameUtil = new FrameUtil();
            // 3.获取画布和上下文
            this.canvas = document.getElementById(option.canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.canvas.height = window.innerHeight;
            this.canvas.width = window.innerWidth;
            
            // 4.实例化本地数据工具类
            this.staticSourceUtil = new StaticSourceUtil();
            // 5.保存加载好的数据
            this.allImageObj = {};
            // 5.加载数据
            // 所有的图片dom对象,图片的个数,已经加载好图片的个数
            this.staticSourceUtil.loadIamge(function (allImageObj,imageCount,loadImageCount) {
                
                if(imageCount == loadImageCount){ // 图片加载完毕
                    // 保存所有的图片数据
                    self.allImageObj = allImageObj;
                    console.log(self.allImageObj);
            // 创建开始按钮
        //     var gameBeginX = (game.canvas.width - 626) * 0.5;
        //     var gameBeginY = (game.canvas.height - 144) * 0.5;
        //   let beginBtn =  game.ctx.drawImage(game.allImageObj['gamebegin'],gameBeginX,gameBeginY);
                    
                    // 运行游戏
                    self.runBG();
                  
                }
            });

            // 6.记录游戏运行的状态
            this.isRun = true;
        }

         // 开始游戏
        Start(){
            var self = this;
            this.timer = setInterval(function () {
                self.runLoop();
            },1000/self.fps); // 每一帧需要的时间  FPS:50 1s/50 (s)  -->1000/50
         };

        // 创建背景
        runBG (){
            // 创建房子
             this.fangzi = new Background({
                image: this.allImageObj['fangzi'],
                width:300,
                height:256,
                y : this.canvas.height - 256 - 100,
                speed:2
            });
            // 创建树
            this.shu = new Background({
                image: this.allImageObj['shu'],
                width : 300,
                height : 216,
                y : this.canvas.height - 216 - 48,
                speed:3
            });
            // 创建地板
            this.diban = new Background({
                image: this.allImageObj['diban'],
                width : 48,
                height : 48,
                y : this.canvas.height - 48,
                speed:4
            });
             // 创建管道数组
             this.pipeArr = [new Pipe()];
             // 创建鸟
            this.bird = new Bird();

             // 2.更新和渲染房子
             this.fangzi.update();
             this.fangzi.render();
             // 3.更新和渲染树
             this.shu.update();
             this.shu.render();
             // 4.更新和渲染地板
             this.diban.update();
             this.diban.render();
        }

        // 游戏进行的每一帧都要调用
        runLoop(){
            
              // 0.清屏
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

            this.frameUtil.countFps();
             // 1.绘制FPS /FNO
            this.ctx.fillText('FPS/'+this.frameUtil.realFps,15,15);
            this.ctx.fillText('FNO/'+this.frameUtil.currentFrame,15,30);

            // 2.更新和渲染房子
            this.fangzi.update();
            this.fangzi.render();
            // 3.更新和渲染树
            this.shu.update();
            this.shu.render();
            // 4.更新和渲染地板
            this.diban.update();
            this.diban.render();

              // 5.每隔100帧创建一个管道
            if(this.frameUtil.currentFrame % 100 == 0 && this.isRun){
                this.pipeArr.push(new Pipe());
                
            }

            // 6.更新和渲染管道
            // 先更新
            for (var i = 0; i < this.pipeArr.length; i++) {
                this.pipeArr[i].update();
            }
            // 后绘制
            for (var i = 0; i < this.pipeArr.length; i++) {
                this.pipeArr[i].render();
            }

             // 7.更新和渲染小鸟
             this.bird.update();
             this.bird.render();

        };

        // 暂停游戏
        pause(){
            clearInterval(this.timer);
        }

        // 游戏结束
        gameOver  () {
            // 游戏结束,改变游戏的状态
            this.isRun = false;
            // 暂停背景
            this.fangzi.pause();
            this.shu.pause();
            this.diban.pause();
            // 暂停管道
            for (var i = 0; i < this.pipeArr.length; i++) {
                this.pipeArr[i].pause();
            }

            // 发出小鸟死亡的通知
            game.bird.die = true;
            var startagain = document.getElementById("again")
            startagain.style.display = 'block';
            startagain.onclick = function(){
                game.gameagain()
            }
        };

        gameagain(){
            console.log('再来一次');
            // 游戏结束,改变游戏的状态
            // this.isRun = true;
            // // 暂停背景
            // this.Start()
        }

    }


  
  
  // 一、声明一个背景
  class Background{
    constructor(options) {
       let option = options || {};
            // 1.图片对象
            this.image = option.image;
            // 2.坐标
            this.x = 0;
            this.y = option.y || 0;
            // 3.宽高
            this.width = option.width || 0;
            this.height = option.height || 0;
            // 4.绘制的总个数
            this.count = parseInt(game.canvas.width / this.width) + 1;
            // 5.速度
            this.speed = option.speed || 2;

            // console.log(game);
            
    }

   // 绘制
        render () {
            for (var i = 0; i < 2 * this.count; i++) {
                game.ctx.drawImage(this.image,this.x + i * this.width,this.y,this.width,this.height);
            }
        }

        // 更新
        update  () {
            // 向左运动
            this.x -= this.speed;
            // 还原位置
            if (this.x <= -this.count*this.width){
                this.x = 0;
            }
        }

        // 暂停
        pause () {
            this.speed = 0;
        }
}


// 二、静态资源
class StaticSourceUtil{
    constructor () {

        // 保存所有图片对象
        this.allImageObj = {};
    };

     // 加载游戏的资源
        // 需要返回:所有的图片dom对象,图片的个数,已经加载好图片的个数
    loadIamge (callback){
        var self = this;
        var loadImageCount = 0;

        var dataArray = [
            {name : "fangzi" , src : "images/bg1.png"},
            {name : "shu" , src : "images/bg2.png"},
            {name : "diban" , src : "images/bg3.png"},
            {name : "bird" , src : "images/bird.png"},
            {name : "blood" , src : "images/blood.png"},
            {name : "die" , src : "images/die.png"},
            {name : "gamebegin" , src : "images/gamebegin.png"},
            {name : "gameover" , src : "images/gameover.png"},
            {name : "number" , src : "images/number.png"},
            {name : "pipe0" , src : "images/pipe0.png"},
            {name : "pipe1" , src : "images/pipe1.png"}
        ];
        // 5.遍历数组
        for (var i = 0; i < dataArray.length; i++) {
            // 创建图片对象
            var image = new Image();
            image.src = dataArray[i].src;
            image.index = i;

            // 等到图片加载完毕后才返回
            image.onload = function () {
                // 累加已经加载好的图片个数
                loadImageCount ++;
                var key = dataArray[this.index].name;
                // 保存所有的图片对象
                
                self.allImageObj[key] = this; // this-->image
                    // console.log(self.allImageObj);
                    
                // 返回需要的数据
                callback(self.allImageObj,dataArray.length,loadImageCount);
            }
        }
    }
}


// 帧工具类:计算每秒的传输的帧数和当前的总帧数
class FrameUtil{
    constructor () {
            // 1.开始的时间
            this.sTime = new Date();
            // 2.开始的帧数
            this.sFrame = 0;
            // 3.当前的总帧数
            this.currentFrame = 0;
            // 4.真实的fps
            this.realFps = 0;
        }

        // 计算真实的fps
        countFps () {
            // 1.累加当前的帧数
            this.currentFrame ++;
            // 2.当前的时间
            var currentTime = new Date();

            // 2.判断是否走过了1秒
            if(currentTime - this.sTime >= 1000){ // 走过了1秒
                // 计算真实的fps
                this.realFps = this.currentFrame - this.sFrame;
                // 更新开始的时间
                this.sTime = currentTime;
                // 更新开始的帧数
                this.sFrame = this.currentFrame;
            }
        }
    }


    // 创建小鸟类
class Bird{
    constructor(){
         // 1.宽高
         this.width = 85;
         this.height = 60;
         // 2.坐标
         this.x = (game.canvas.width - this.width) * 0.5;
         this.y = 100;
         // 3.翅膀的状态
         // 合法值 : 0 ,1, 2
         this.wing = 0;
         // 4.下落的增量
         this.dy = 0;
         // 5.下落时的帧数
         this.dropFrame = game.frameUtil.currentFrame;
         // 6.下落的角度
         this.rotateAngle = 0;
         // 7.小鸟的状态 0:下落 1 : 上升
         this.state = 0;
         // 8.绑定事件
         this.bindClick();
         // 9.空气的阻力
         this.deleteY = 1;
         // 10.小鸟是否死亡
         this.die = false;
         // 11.动画的索引
         this.dieAnimationIndex = 0;
    }

     // 绘制
     render () {
        // 判断小鸟死亡,洒热血
        if(this.die == true){
            //  裁剪的宽高(热血图片的1/5)
            var sWidth = 325,sHeight = 138;
            // 总列数
            var maxCol = 5;
            // 计算行号和列号
            var row = parseInt(this.dieAnimationIndex / maxCol);
            var col =  this.dieAnimationIndex % maxCol;
            // 绘制热血
            game.ctx.drawImage(game.allImageObj['blood'],col * sWidth,row * sHeight,sWidth,sHeight,this.x - 100,this.y,sWidth,sHeight);

            // 绘制游戏结束
            var gameOverX = (game.canvas.width - 626) * 0.5;
            var gameOverY = (game.canvas.height - 144) * 0.5;
            game.ctx.drawImage(game.allImageObj['gameover'],gameOverX,gameOverY);
            return;
        }
        // 保存状态
        game.ctx.save();
        // 位移到鸟的中心点
        game.ctx.translate(this.x + this.width * 0.5,this.y + this.height * 0.5);
        // 旋转
        game.ctx.rotate(this.rotateAngle * Math.PI / 180);

        // 还原坐标系(复位)
        game.ctx.translate(-(this.x + this.width * 0.5),-(this.y + this.height * 0.5));
        // 绘制
        game.ctx.drawImage(game.allImageObj['bird'],this.wing * this.width,0,this.width,this.height,this.x,this.y,this.width,this.height);
        // 还原状态
        game.ctx.restore();
    };

     // 更新
     update () {
        // 更新死亡动画索引
        if(this.die == true){

            this.dieAnimationIndex++;
            if(this.dieAnimationIndex >= 30){
                // 暂停游戏
                game.pause();
            }
            return;
        }
        // 1.每隔5帧挥动一次翅膀
        if(game.frameUtil.currentFrame % 5 == 0){
            this.wing ++;
            if(this.wing > 2){
                this.wing = 0;
            }
        }
        // 2.根据小鸟的状态判断小鸟是下落还是上升
        if(this.state == 0){ // 下落
            // 自由落体
            // h = 1/2*g*t^2 Math.pow(2,3) 2^3
            this.dy = 0.01 * Math.pow(game.frameUtil.currentFrame - this.dropFrame,2);
            
            // 更新下落的角度
            this.rotateAngle += 1;

        } else if(this.state == 1){ // 上升
            this.deleteY++;
            // 默认向上冲14
            this.dy = -15 + this.deleteY;

            if(this.dy >= 0){ // 小鸟下落
                // 更新小鸟的状态
                this.state = 0;
                // 更新下落的帧数
                this.dropFrame = game.frameUtil.currentFrame;
            }
        }
        // 更新位置
        this.y += this.dy;
        // 封锁上空
        if(this.y <= 0){
            this.y = 0;
        }
        // 碰到地板,游戏结束
        if(this.y >= game.canvas.height - this.height - 48){
            // 游戏结束
            game.gameOver();
        }
    };

      // 绑定事件
      bindClick () {
        // 备份this
        var self = this;
        //onmousedown
        // ontouchstart
        var ua = window.navigator.userAgent;
       
        let Isphone = /iphone|ipad|ipod/i.test(ua) || /android/i.test(ua);
        console.log(  game.ctx);
        if(Isphone){
            game.canvas.ontouchstart = function () {
                // 更新小鸟的状态
                self.state = 1;
                //  添加仰角
                self.rotateAngle = -25;
                // 复位空气的阻力
                self.deleteY = 1;
            }
        }else{
            game.canvas.onmousedown = function () {
                // 更新小鸟的状态
                self.state = 1;
                //  添加仰角
                self.rotateAngle = -25;
                // 复位空气的阻力
                self.deleteY = 1;
            }
        }
     
    }
}


// 创建管道的类
class Pipe{
    constructor () {
        // 1.方向 0 : 向下 1:向上
        this.dir = _.random(0,1);
        // 2.宽高
        this.width = 148;
        this.height = _.random(100,(game.canvas.height-48)*0.5);
        // 3.坐标
        this.x = game.canvas.width;
        this.y = this.dir == 0 ? 0 : game.canvas.height- this.height - 48;
        // 4.速度
        this.speed = 4;
    //    console.log(this.x);
       
    };

        // 绘制
        render () {
            // 判断管道的方向
            if(this.dir == 0){ // 向下 1664表示图片高
                game.ctx.drawImage(game.allImageObj['pipe1'],0,1664-this.height,this.width,this.height,this.x,this.y,this.width,this.height);
            } else if (this.dir == 1){ // 向上
                game.ctx.drawImage(game.allImageObj['pipe0'],0,0,this.width,this.height,this.x,this.y,this.width,this.height);
            }
        };

          // 更新
          update () {
            this.x -= this.speed;
            // 销毁离开屏幕的管道(性能优化)
            if(this.x <= -this.width){
                game.pipeArr = _.without(game.pipeArr,this);
                
            }

            // 检测小鸟和管道是否碰撞(碰撞检测)
            // 判断小鸟是否进入管道区域
            if(game.bird.x + game.bird.width > this.x && game.bird.x < this.x + this.width){            // 鸟已经进入管道区域,比较危险
                if(this.dir == 0 && game.bird.y < this.height){ // 向下
                    // 游戏结束
                    game.gameOver();

                } else if(this.dir == 1 && game.bird.y + game.bird.height > this.y){ // 向上
                    // 游戏结束
                    game.gameOver();
                }

            }
        };

        // 暂停
        pause () {
            this.speed = 0;
        }
}