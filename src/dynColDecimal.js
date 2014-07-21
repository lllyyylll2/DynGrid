var dynColDecimal = function (field) {
	///	<summary>
	///	 浮点数列
	///	</summary>
	dynColTxt.apply(this, arguments);
};
dynColDecimal.extend(dynColTxt, {
	maxLength: 11,
	onCellCreated: function (ctr, idx, allowEdit) {
		dynColTxt.prototype.onCellCreated.apply(this, arguments);
		ctr.attr("maxlength", this.maxLength).css("text-align", "right");
		if (!$.fn.bindDecimalTypeValidation) {
			alert("请引入浮点数验证脚本!");
		} else {
			ctr.bindDecimalTypeValidation();
		}
	}
});