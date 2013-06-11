// 添加格式化日期方法
(function () {
	if (typeof Date.prototype.getTidyDate === 'function') return;
	Date.prototype.getTidyDate = function () {
		return this.getMonth() + 1 + '/' + this.getDate() + '/' + this.getFullYear();
	};
})();