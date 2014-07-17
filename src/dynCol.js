var dynCol = function (field) {
	///	<summary>
	///	 列基类
	///	</summary>
	this.name = field;
};
dynCol.prototype = {
	ctr: "<input type='text' />",
	read: function (ctr, row) {
		row[this.name] = ctr.val();
	},
	write: function (ctr, row) {
		ctr.val(this.getNullSafeVal(row));
	},
	getNullSafeVal: function (row) {
		var v = row[this.name];
		if (v === undefined || v === null) v = "";
		return unescape(v);
	},
	onValidate: function (ctr, index, td, grid) {
		if (!ctr.attr("disabled") && !$.trim(ctr.val())) {
			ctr.focus();
			alert("请填写“" + grid.getColumnCaption(index) + "”...");
			return false;
		} else return true;
	},
	getCtr: function (td) {
		return td.find("input");
	},
	onCellCreated: function (ctr, idx, allowEdit) {

	},
	onCellDataBound: function (ctr, row) {
		
	},
	getDisplayText: function (ctr) {
		return ctr.val();
	},
	bind: function (evtName, evtFn) {
		if (!this.evts) this.evts = {};
		var arr = this.evts[evtName];
		if (!arr) {
			this.evts[evtName] = arr = [];
		}
		arr.push(evtFn);
		return this;
	},
	attr: function (key, val) {
		if (!this.attrs) this.attrs = {};
		this.attrs[key] = val;
		return this;
	},
	css: function (key, val) {
		if (!this.styles) this.styles = {};
		this.styles[key] = val;
		return this;
	},
	create: function () {
		var el = $(this.ctr);
		if (this.attrs) {
			el.attr(this.attrs);
		}
		if (this.styles) {
			el.css(this.styles);
		}
		if (this.evts) {
			$.each(this.evts, function (k, v) {
				$.each(v, function (i, f) {
					el.bind(k, f);
				});
			});
		}
		return el;
	}
};