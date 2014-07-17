var dynColIdx = function () {
	///	<summary>
	///	 序号列
	///	</summary>
	dynColSpan.apply(this, arguments);
};
dynColIdx.extend(dynColSpan, {
	read: function () { },
	write: function () { },	
	onCellCreated: function (ctr, idx, allowEdit) {
		ctr.text(idx + 1);
	}
});