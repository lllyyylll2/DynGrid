var dynColChkbox = function (field, checked) {
	///	<summary>
	///	 复选框列
	///	</summary>
	dynCol.apply(this, arguments);
	if (checked) {
		this.ctr = "<input type='checkbox' checked />";
	}
};
dynColChkbox.extend(dynCol, {
	ctr: "<input type='checkbox' />",
	getVal: function (ctr) {
		return $.prop ? ctr.prop("checked") : ctr.attr("checked");
	},
	setVal: function (ctr, v) {
		$.prop ? ctr.prop("checked", v) : ctr.attr("checked", v);
	},
	read: function (ctr, row) {
		row[this.name] = this.getVal(ctr);
	},
	write: function (ctr, row) {
		this.setVal(ctr, row[this.name]);
	},
	onValidate: function (ctr, index, td, grid) {
		return true;
	},
	onCellCreated: function (ctr, idx, allowEdit) {
		ctr.parent().css("text-align", "center");
	},
	getDisplayText: function (ctr) {
		return this.getVal(ctr) ? "是" : "否";
	}
});