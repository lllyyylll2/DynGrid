Function.prototype.extend = function (parent, extraProperty) {//继承
	var f = function () { };
	f.prototype = parent.prototype;
	this.prototype = new f();
	this.prototype.constructor = this;
	for (var k in extraProperty) {
		this.prototype[k] = extraProperty[k];
	}
	return this;
};