var dynColSpan = function (field) {
	///	<summary>
	///	 标签列
	///	</summary>
	dynCol.apply(this, arguments);
};
dynColSpan.extend(dynCol, {
	ctr: "<span></span>",
	getCtr: function (td) {
		return td.find("span");
	},
	read: function (ctr, row) {
		row[this.name] = $.trim(ctr.text());
	},
	write: function (ctr, row) {
		ctr.val(this.getNullSafeVal(row));
	},
	onValidate: function () {
		return true;
	}
});