var dynColLink = function (field, text, href) {
	///	<summary>
	///	 超链接列
	///	</summary>
	dynCol.apply(this, arguments);
	this.text = text;
	this.href = href;
};
dynColLink.extend(dynCol, {
	text: null,
	href: null,
	ctr: "<a href='#'>链接</a>",
	read: function (ctr, row) {
		var v = ctr.data("val");
		row[this.name] = v;
		return v;
	},
	write: function (ctr, row, idx) {
		var val = row ? row[this.name] : null;
		ctr.data("val", val);
		this.update(ctr, val, row, idx);
	},
	getCtr: function (td) {
		return td.find("a");
	},
	onValidate: function (ctr, index, td, grid) {
		return true;
	},
	setValue: function (ctr, val, idx) {
		ctr.data("val", val);
		this.update(ctr, val, null, idx);
	},
	onCellCreated: function (ctr, idx, allowEdit) {
		this.update(ctr, null, null, idx);
	},
	update: function (ctr, val, row, idx) {
		var t = this.evalPrara(this.text, val, row, idx, "链接", ctr);
		var h = this.evalPrara(this.href, val, row, idx, "#", ctr);
		ctr.html(t);
		ctr.attr("href", h);
	},
	evalPrara: function (prara, val, row, idx, dftVal, ctr) {
		dftVal = dftVal || "";
		return $.isFunction(prara) ? prara(val, row, idx, ctr) : (prara || dftVal);
	},
	getDisplayText: function (ctr) {
		return null;
	}
});