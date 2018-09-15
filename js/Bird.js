function Bird(imgArr, x, y) {
	this.imgArr = imgArr;
	// 定义图片索引,随机出现
	this.idx = parseInt(Math.random()*imgArr.length);
	// 相当于随机获取一张小鸟图片
	this.img = this.imgArr[this.idx];
	// 用于平移坐标
	this.x = x;
	this.y = y;
	// 定义鸟的状态
	this.state = "D";//down
	this.speed = 0;

}

Bird.prototype.fly = function() {
	this.idx++;
	if(this.idx >= this.imgArr.length) {
		this.idx = 0;
	}
	this.img = this.imgArr[this.idx];
}
Bird.prototype.fallDown = function() {
	if(this.state === "D") {
		this.speed ++;
		this.y += Math.sqrt(this.speed);
	} else {
		this.speed--;
		if(this.speed === 0) {
			this.state = "D";
			return;
		}
		this.y -= Math.sqrt(this.speed);
	}
	
}



Bird.prototype.goUp = function() {
	this.state = "U";
	this.speed = 20;
}