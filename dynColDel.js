var dynColDel = function (field, delTxt) {
	///	<summary>
	///	 删除列
	///	</summary>
	dynCol.apply(this, arguments);
	if (delTxt) {
		this.ctr = "<a>" + delTxt + "</a>";
	}
};
dynColDel.extend(dynCol, {
	ctr: "<a>删除</a>",
	read: function (ctr, row) {
		row[this.name] = ctr.data("id");
	}, 
	write: function (ctr, row) {
		ctr.data("id", row[this.name] || 0);
	},
	onValidate: function (ctr, index, td, grid) {
		return true;
	},
	getCtr: function (td) {
		return td.find("a");
	},
	onCellCreated: function (ctr, idx, allowEdit) {
		ctr.css("cursor", "pointer").parent().css("text-align", "center");
	},
	getDisplayText: function (ctr, allowEdit) {
		var td = ctr.parent();
		allowEdit ? td.show() : td.hide();
		return null;
	}
});