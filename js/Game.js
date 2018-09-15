function Game(ctx, bird, pipe, land, mountain) {
	this.ctx = ctx;
	this.bird = bird;
	// 因为管子多根，所以存放到数组当中
	this.pipeArr = [pipe];
	this.land = land;
	this.mountain = mountain;
	this.timer = null;
	this.iframe = 0;
	this.init();
}
Game.prototype.init = function() {
	this.start();
	this.bindEvent();
}


// 渲染mountain
Game.prototype.renderMountain = function() {
	var img = this.mountain.img;
	this.mountain.x -= this.mountain.step;

	 if(this.mountain.x < -img.width) {
	 	this.mountain.x = 0;
	 }
	 this.ctx.drawImage(img, this.mountain.x, this.mountain.y);
	 this.ctx.drawImage(img, this.mountain.x + img.width, this.mountain.y);
	 this.ctx.drawImage(img, this.mountain.x + img.width*2, this.mountain.y);

}

// 渲染地面
Game.prototype.renderLand = function() {
	var img = this.land.img;
	this.land.x -= this.land.step;
	if(this.land.x < -img.width) {
		this.land.x = 0;
	}
	this.ctx.drawImage(img, this.land.x, this.land.y);
	this.ctx.drawImage(img, this.land.x + img.width, this.land.y);
	this.ctx.drawImage(img, this.land.x + img.width*2, this.land.y);
}

// 游戏开始
Game.prototype.start = function() {
	var me = this;
	this.timer = setInterval(function() {

		me.iframe++;
		me.clear();
		me.renderMountain();
		me.renderLand();
		me.renderBird();
		if(!(me.iframe % 10)) {
			me.bird.fly();
		}
		me.bird.fallDown();

		if(!(me.iframe % 80)) {
			me.createPipe();
		}
		me.movePipe();
		me.clearPipe();
		me.renderPipe();
		me.renderPoints();
		me.renderPipepoints();
		me.Crash();
	}, 20)

}

// 清屏方法
Game.prototype.clear = function() {
	this.ctx.clearRect(0, 0, 360, 512);
}

// 渲染鸟
Game.prototype.renderBird = function() {
	var img = this.bird.img;
	this.ctx.save();
	this.ctx.translate(this.bird.x, this.bird.y);
	this.ctx.strokeRect(-this.bird.img.width / 2 + 6, -this.bird.img.height / 2 + 12, this.bird.img.width - 13, this.bird.img.height - 22);
	var deg = this.bird.state === "D"? this.bird.speed*Math.PI /180 : -this.bird.speed*Math.PI /180;
	this.ctx.rotate(deg);
	this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
	this.ctx.restore();

}

// 添加点击事件
Game.prototype.bindEvent = function() {
	// 缓存this
	var me = this;
	this.ctx.canvas.onclick = function() {
		me.bird.goUp();
	}
}

// 
Game.prototype.renderPipe = function() {
	var me = this;
	this.pipeArr.forEach(function(value, index) {
		/*循环每一根管子*/
		/*上管子*/ 
		var img_up = value.pipe_up;
		var img_x = 0;
		var img_y = img_up.height - value.up_height;
		var img_w = img_up.width;
		var img_h = value.up_height;
		var canvas_x = me.ctx.canvas.width - value.step * value.count;
		var canvas_y = 0;
		var canvas_w = img_up.width;
		var canvas_h = img_h;
		me.ctx.drawImage(img_up, img_x, img_y, img_w, img_h, canvas_x, canvas_y, canvas_w, canvas_h);


		var down_img = value.pipe_down;
		var down_img_x = 0;
		var down_img_y = 0;
		var down_img_w = down_img.width;
		var down_img_h = 250 - value.up_height;
		var down_canvas_x = me.ctx.canvas.width - value.step * value.count;
		var down_canvas_y = img_h + 150;
		var down_canvas_w = img_w;
		var down_canvas_h = 250 - img_h;
		me.ctx.drawImage(down_img, down_img_x, down_img_y, down_img_w, down_img_h, down_canvas_x, down_canvas_y, down_canvas_w, down_canvas_h);

	})
}

// 管子移动方法
Game.prototype.movePipe = function() {
	this.pipeArr.forEach(function(value, index) {
		value.count++;
	})
}

// 创建多根管子
Game.prototype.createPipe = function() {
	// 创建管子，并放入数组当中
	var pipe = this.pipeArr[0].createPipe();
	this.pipeArr.push(pipe);		
}

Game.prototype.clearPipe = function() {
	for(var i = 0; i < this.pipeArr.length; i++) {
		var pipe = this.pipeArr[i];
		if(pipe.x - pipe.step*pipe.count < -pipe.pipe_up.width) {
			this.pipeArr.splice(i, 1);
			return;
		}
	}
}


/*在原始坐标系中绘制鸟的矩形*/
Game.prototype.renderPoints = function() {

	// this.ctx.strokeRect(-this.bird.img.width / 2 + 6, -this.bird.img.height / 2 + 12, this.bird.img.width - 13, this.bird.img.height - 22);
	var birdA = {
		x: -this.bird.img.width / 2 + 6 + this.bird.x,
		y: -this.bird.img.height / 2 + 12 + this.bird.y
	}
	var birdB = {
		x: -this.bird.img.width / 2 + 6 + this.bird.img.width - 13+ this.bird.x,
		y: -this.bird.img.height / 2 + 12+ this.bird.y
	}
	var birdC = {
		x: -this.bird.img.width / 2 + 6+ this.bird.x,
		y: -this.bird.img.height / 2 + 12 + this.bird.img.height - 22+ this.bird.y
	}
	var birdD = {
		x: -this.bird.img.width / 2 + 6 + this.bird.img.width - 13 + this.bird.x,
		y: -this.bird.img.height / 2 + 12 + this.bird.img.height - 22 + this.bird.y
	}
	this.ctx.beginPath();
	this.ctx.moveTo(birdA.x, birdA.y);
	this.ctx.lineTo(birdB.x, birdB.y);
	this.ctx.lineTo(birdD.x, birdD.y);
	this.ctx.lineTo(birdC.x, birdC.y);
	this.ctx.closePath();
	this.ctx.strokeStyle = "red";
	this.ctx.stroke();
}

Game.prototype.renderPipepoints = function() {
	for(var i = 0; i < this.pipeArr.length; i ++) {
		var pipe = this.pipeArr[i];

		/*var img_x = 0;
		var img_y = img_up.height - value.up_height;
		var img_w = img_up.width;
		var img_h = value.up_height;
		var canvas_x = me.ctx.canvas.width - value.step * value.count;
		var canvas_y = 0;
		var canvas_w = img_up.width;
		var canvas_h = img_h;*/
		/*上管子四个顶点的坐标*/
		var pipeA = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: 0
		}
		var pipeB = {
			x:  this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: 0
		}
		var pipeC = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: pipe.up_height
		}
		var pipeD = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: pipe.up_height
		}
		this.ctx.beginPath();
		this.ctx.moveTo(pipeA.x, pipeA.y);
		this.ctx.lineTo(pipeB.x, pipeB.y);
		this.ctx.lineTo(pipeD.x, pipeD.y);
		this.ctx.lineTo(pipeC.x, pipeC.y);
		this.ctx.closePath();
		this.ctx.strokeStyle = "blue";
		this.ctx.stroke();

		// 下管子
		var pipedownA = {
			x: pipeA.x,
			y: pipe.up_height + 150
		}
		var pipedownB = {
			x:  pipeB.x,
			y:  pipe.up_height + 150
		}
		var pipedownC = {
			x: pipeA.x,
			y: 400
		}
		var pipedownD = {
			x: pipedownB.x,
			y: 400
		}
		this.ctx.beginPath();
		this.ctx.moveTo(pipedownA.x, pipedownA.y);
		this.ctx.lineTo(pipedownB.x, pipedownB.y);
		this.ctx.lineTo(pipedownD.x, pipedownD.y);
		this.ctx.lineTo(pipedownC.x, pipedownC.y);
		this.ctx.closePath();
		this.ctx.strokeStyle = "blue";
		this.ctx.stroke();

	}
}

// 检测鸟与管子的碰撞
Game.prototype.Crash = function() {
	/*鸟的*/
	var birdA = {
		x: -this.bird.img.width / 2 + 6 + this.bird.x,
		y: -this.bird.img.height / 2 + 12 + this.bird.y
	}
	var birdB = {
		x: -this.bird.img.width / 2 + 6 + this.bird.img.width - 13+ this.bird.x,
		y: -this.bird.img.height / 2 + 12+ this.bird.y
	}
	var birdC = {
		x: -this.bird.img.width / 2 + 6+ this.bird.x,
		y: -this.bird.img.height / 2 + 12 + this.bird.img.height - 22+ this.bird.y
	}
	var birdD = {
		x: -this.bird.img.width / 2 + 6 + this.bird.img.width - 13 + this.bird.x,
		y: -this.bird.img.height / 2 + 12 + this.bird.img.height - 22 + this.bird.y
	}

	// 上管子
	for(var i = 0; i < this.pipeArr.length; i ++) {
		var pipe = this.pipeArr[i];
	var pipeA = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: 0
		}
		var pipeB = {
			x:  this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: 0
		}
		var pipeC = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: pipe.up_height
		}
		var pipeD = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: pipe.up_height
		}

		// 下管子
		var pipedownA = {
			x: pipeA.x,
			y: pipe.up_height + 150
		}
		var pipedownB = {
			x:  pipeB.x,
			y:  pipe.up_height + 150
		}
		var pipedownC = {
			x: pipeA.x,
			y: 400
		}
		var pipedownD = {
			x: pipedownB.x,
			y: 400
		}
		/*鸟与上管子碰撞检测*/
		// 鸟B与上管子C比较
		if (birdB.x >= pipeC.x && birdB.y <= pipeC.y && birdA.x <= pipeB.x) {
			alert("哎呦，好痛哦");
			this.gameover();
			return;
		}
		// 鸟的D点与下管子A
		if(birdD.x >= pipedownA.x && birdD.y >= pipedownA.y && birdC.x <= pipedownB.x) {
			alert("撞到下管子");
			this.gameover();
			return;
		}
}

// 游戏结束
Game.prototype.gameover = function() {
	clearInterval(this.timer);
}
}
