var dynColDate = function (field, dateFmt) {
	///	<summary>
	///	 日期列
	///	</summary>
	dynColTxt.apply(this, arguments);
	if (dateFmt) {
		this.dateFmt = dateFmt;
	}
};

dynColDate.extend(dynColTxt, {
	dateFmt: "yyyy-MM-dd",
	ctr: "<input type='text' class='date-picker' />",
	onCellCreated: function (ctr, idx, allowEdit) {
		dynColTxt.prototype.onCellCreated.apply(this, arguments);
		ctr.css("text-align", "center");
		if (window.WdatePicker && $.isFunction(WdatePicker)) {
			var fmt = this.dateFmt;
			ctr.focus(function () {
				WdatePicker({ firstDayOfWeek: 1, dateFmt: fmt });
			});
		} else {
			alert("需要引入日期插件My97DatePicker(WdatePicker.js)以支持日期列!");
		}
	}
});