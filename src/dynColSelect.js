var dynColSelect = function (field, fnCreatOpts, dftOpts) {
	///	<summary>
	///	 下拉框列
	///	</summary>
	dynCol.apply(this, arguments);
	this.fnCreatOpts = fnCreatOpts;
	if (dftOpts) {
		this.ctr = "<select>" + dftOpts + "</select>";
	}
};
dynColSelect.extend(dynCol, {
	ctr: "<select></select>",
	fnCreatOpts: null,
	write: function (ctr, row) {
		ctr.val(row[this.name]);
		ctr.change();
	},
	getCtr: function (td) {
		return td.find("select");
	},
	onCellCreated: function (ctr, idx) {
		var fn = this.fnCreatOpts;
		if (fn && $.isFunction(fn)) {
			fn(ctr);
		}
	},
	getDisplayText: function (ctr) {
		return ctr.val() ? ctr.find("option:selected").text() : "";
	}
});