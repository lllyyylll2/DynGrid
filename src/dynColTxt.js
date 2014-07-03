var dynColTxt = function (field) {
	///	<summary>
	///	 文本框列
	///	</summary>
	dynCol.apply(this, arguments);
	this.className = "TEXTBOX";
};
dynColTxt.extend(dynCol, {
	onCellCreated: function (ctr, idx, allowEdit) {
		ctr.addClass(this.className);
	}
});