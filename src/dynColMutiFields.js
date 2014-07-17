var dynColMutiFields = function (arrFields) {
	var arr = [], me = this;
	me.arrFields = arrFields || [];
	me.size = arrFields.length;
	$.map(me.arrFields, function (v, i) {
		arr.push(i == me.size - 1 ? "<span></span>" : ("<input type='hidden' name='" + v + "' />"));
	});
	me.ctr = arr.join("");
};
dynColMutiFields.extend(dynColSpan, {
	size: 0,
	arrFields: [],
	ctr: "<input type='hidden' /><span></span>",
	getCtr: function (td) {
		return td;
	},
	read: function (ctr, row) {
		var me = this;
		$.each(me.arrFields, function (i, v) {
			if (i != me.size - 1) {
				row[v] = parseInt(ctr.find("input").eq(i).val()) || null;
			} else {
				row[v] = $.trim(ctr.find("span").text());
			}
		});
	},
	write: function (ctr, row) {
		var me = this;
		$.each(me.arrFields, function (i, v) {
			if (i != me.size - 1) {
				ctr.find("input").eq(i).val(row[v]);
			} else {
				var val = me.getNullSafeVal(row, v);
				ctr.find("span").text(val);
			}
		});
	}
});