var dynColInt = function (field) {
	///	<summary>
	///	 整数列
	///	</summary>
	dynColTxt.apply(this, arguments);
};
dynColInt.extend(dynColTxt, {
	maxLength: 8,
	onCellCreated: function (ctr, idx, allowEdit) {
		dynColTxt.prototype.onCellCreated.apply(this, arguments);
		ctr.attr("maxlength", this.maxLength).css("text-align", "right");
		if (!$.fn.bindIntTypeValidation) {
			alert("请引入整数验证脚本!");
		} else {
			ctr.bindIntTypeValidation();
		}
	}
});