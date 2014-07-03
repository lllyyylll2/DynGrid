///<reference path="jquery-1.4.1-vsdoc.js" />
///<reference path="json.js" />
//动态表格类(需要JQuery和JSON)
//	使用说明：列模板默认自动创建文本框，最后一列为删除链接
//	若需自定义模板，可先调用createColumns()方法
//	再为columns数据中元素制定事件处理函数
//  事件支持：onRowAdded，onCellDataBound
//  创建列：createColumns(array) array参数，数据源列名称
var dynGrid = function (_tb, _addBtn, _saveField) {
	this.tb = $(_tb); 				//数据表选择符
	this.btnAdd = $(_addBtn); 		//添加按钮选择符
	this.saveField = $(_saveField); //数据保存控件选择符
	this.columns = null; 			//列模板
	this.trCssClass = "GridViewRowStyle"; 		//行css类名
	this.requirDataOnSave = false; //保存时至少需要一行数据
	this.editable = true; 			//是否允许编辑
	this.deleteText = "移除"; 		//删除文本
	this.confirmWhenDel = false;	//删除前是否确认
	this.confirmDelMsg = "确定要" + this.deleteText + "该项吗？";
	this.idField = null; 			//主键字段名称

	var $this = this;
	this.btnAdd.click(function () {
		$this.addRow();
	});
};
dynGrid.prototype = {
	setEditable: function (allowEdit) {//设置编辑状态
		var len = this.columns.length;
		var me = this;
		this.tb.find("tr." + this.trCssClass).each(function (j, tr) {
			$(tr).find("td").each(function (i, td) {
				var colDefine = me.columns[i];
				var ctr = colDefine.getCtr($(td));
				me.doSetEditable(colDefine, ctr, allowEdit);
			});
		});
		this.editable = allowEdit;
		this.updateAddBtnSate();
	},
	updateAddBtnSate: function () {
		var ctrs = this.tb.find("tr:first th:eq(" + this.delColIdx + ")").add(this.btnAdd);
		this.editable ? ctrs.show() : ctrs.hide();
	},
	doSetEditable: function (colDefine, ctr, allowEdit) {
		var txt = colDefine.getDisplayText(ctr, allowEdit);
		if (txt === null) return;

		if (allowEdit) {
			ctr.show();
			ctr.next("span.spRead").hide();
		} else {
			ctr.hide();
			var sp = ctr.next("span.spRead");
			if (!sp.size()) {
				sp = $("<span class='spRead'></span>").insertAfter(ctr);
			}
			sp.text(txt).show();
		}
	},
	bindData: function (dataArray) {//绑定数据
		if (!this.ensureJson()) {
			return;
		}
		dataArray = dataArray || JSON.parse(this.saveField.val() || "[]");
		this.updateAddBtnSate();
		if ($.isArray(dataArray)) {
			this.tb.trigger("onDataBinding", [dataArray]);
			for (var i = 0; i < dataArray.length; i++) {
				var row = dataArray[i];
				var tr = this.addRow();
				for (var j = 0; j < this.columns.length; j++) {
					var colDefine = this.columns[j];
					var idx = this.getDataRowCount() - 1;
					var td = tr.find("td:eq(" + j + ")");
					var ctr = colDefine.getCtr(td);
					colDefine.write(ctr, row, idx);
					this.doSetEditable(colDefine, ctr, this.editable);
					if ($.isFunction(colDefine.onCellDataBound)) {
						colDefine.onCellDataBound(ctr, row);
					}
				}
				this.tb.trigger("onRowDataBound", [tr]);
			}
			this.tb.trigger("onDataBound");
		}
	},
	setColumnNames: function (arrColName) {//设置列名称，用于数据绑定和保存时列识别
		if ($.isArray(arrColName)) {
			if (!this.columns) this.createColumns();
			$.each(this.columns, function (i, col) {
				col.name = arrColName[i] || ("col" + i);
			});
		}
	},
	createColumns: function (columns) {//创建列模板
		if (!$.isArray(columns)) {
			return;
		}
		var col = [];
		var colDel = null;
		for (var i = 0; i < columns.length; i++) {
			var colDefine = columns[i];
			if (typeof (colDefine) === "string") {
				colDefine = new dynColTxt(colDefine);
			}
			col[i] = colDefine;
			if (colDefine instanceof dynColDel) {
				colDel = col[i];
				this.delColIdx = i;
			}
		}
		var me = this;
		if (colDel == null) {
			var d = new dynColDel(this.idField, this.deleteText);
			col[i] = colDel = d;
			me.delColIdx = i;
		}
		colDel.bind("click", function () {
			if (!me.confirmWhenDel || confirm("操作确认：\n\n" + me.confirmDelMsg)) {
				me.delRow(this);
			}
		});
		this.columns = col;
	},
	getColumnCaption: function (i) {//获取每列的标题
		return $.trim(this.tb.find("th").eq(i).text());
	},
	addRow: function () {//添加行
		if (!this.columns) this.createColumns();
		var tr = $("<tr></tr>").addClass(this.trCssClass);
		var rowIdx = this.getDataRowCount();
		for (var i = 0; i < this.columns.length; i++) {
			var colDefine = this.columns[i];
			var ctr = colDefine.create();
			var td = $("<td></td>").append(ctr).appendTo(tr);
			if (colDefine.onCellCreated) {
				colDefine.onCellCreated(ctr, rowIdx);
			}
		}
		var p = this.tb.find("tbody");
		if (p.size() == 0) {
			p = this.tb;
		}
		p.append(tr);
		this.keyNavigation.bind(tr);
		this.tb.trigger("onRowAdded", [tr]);
		return tr;
	},
	onDataBinding: function (fn) {//将要绑定数据时触发
		this.tb.bind("onDataBinding", fn);
	},
	onDataBound: function (fn) {
		this.tb.bind("onDataBound", fn);
	},
	onRowAdded: function (fn) {//添加行之后触发的事件
		this.tb.bind("onRowAdded", fn);
	},
	onRowDataBound: function (fn) {//行数据绑定之后触发的事件
		this.tb.bind("onRowDataBound", fn);
	},
	onValidate: function (index, fn) {//单元格验证时触发的事件
		if (index >= 0 && index <= this.columns.length) {
			this.columns[index].onValidate = fn;
		}
	},
	onRowDeleted: function (fn) {//删除行之后触发的事件
		this.tb.bind("onRowDeleted", fn);
	},
	afterValidate: function (fn) {//在验证完成后触发的事件
		this.tb.data("afterValidate", fn);
	},
	clear: function () {//删除所有行
		this.tb.find("tr." + this.trCssClass).remove();
		this.tb.trigger("onRowDeleted", []);
	},
	delRow: function (o) {//删除行
		var tr;
		if (o) {
			tr = $(o).parent().parent();
		} else {
			tr = this.tb.find("tr." + this.trCssClass + ":last");
		}
		tr.remove();
		this.tb.trigger("onRowDeleted", [tr]);
	},
	getDataRowCount: function () {//返回数据行数
		return this.tb.find("tr." + this.trCssClass).size();
	},
	getDataRow: function (idx) {
		return this.tb.find("tr." + this.trCssClass).eq(idx);
	},
	save: function (fnOnDataSaved) {//保存界面数据，返回JSON字符串
		var arrData = [];
		var $this = this;
		var isValid = true; //验证状态
		this.tb.find("tr." + this.trCssClass).each(function () {
			var tr = $(this);
			var rowData = {};
			tr.find("td").each(function (i) {
				var td = $(this);
				var colDefine = $this.columns[i];
				var ctr = colDefine.getCtr(td);
				if (!colDefine.onValidate(ctr, i, td, $this)) {//触发验证函数
					isValid = false;
					return false; //验证未通过，终止验证执行
				} else {//验证通过，保存数据
					colDefine.read(ctr, rowData);
				}
			});
			if (!isValid) return false; //已验证失败，则终止循环
			else arrData.push(rowData);
		});

		if (!isValid) {
			return false;
		} else if (this.tb.data("afterValidate") && !this.tb.data("afterValidate")()) {//触发整体验证事件
			return false;
		} else if (this.requirDataOnSave && arrData.length == 0) {
			alert("没有输入任何项...");
			return false;
		} else {
			if (!this.ensureJson()) {
				return false;
			}
			if ($.isFunction(fnOnDataSaved)) fnOnDataSaved(arrData);
			$this.saveField.val(JSON.stringify(arrData));
			return true;
		}
	},
	ensureJson: function () {
		var J = window.JSON || {};
		if (!J.stringify || !J.parse) {
			alert('本功能需要引入JSON.js文件...');
			return false;
		};
		return true;
	},
	keyNavigation: {//键盘按键导航，上下左右+回车
		_ctrSelector: "input:visible",
		bind: function (tr) {
			var me = this;
			tr.find(this._ctrSelector).each(function (i) {
				$(this).attr("idx", i);
			}).keydown(function (evt) {
				var c = evt.which;
				if (c == 13 || c >= 37 && c <= 40) {
					evt.stopPropagation();
					if (me.handler(this, c)) {
						return false;
					}
				}
			});
		},
		handler: function (el, keyCode) {
			var tr = $(el);
			while (tr.size() != 0 && !tr.is("tr")) {
				tr = tr.parent();
			}
			var idx = parseInt($(el).attr("idx")) || 0;
			return this[keyCode](tr, idx, el);
		},
		"13": function (tr, idx) {//enter			
			var ctrs = tr.find(this._ctrSelector);
			if (idx + 1 == ctrs.size()) {
				tr.next().find(this._ctrSelector).first().focus();
			} else {
				ctrs.eq(idx + 1).focus();
			}
		},
		"38": function (tr, idx) {//up
			tr.prev().find(this._ctrSelector).eq(idx).focus();
		},
		"40": function (tr, idx) {//down
			tr.next().find(this._ctrSelector).eq(idx).focus();
		},
		"37": function (tr, idx, el) {//left
			if (this._getCursorPos(el) == 0) { //光标在左端
				if (idx == 0) {
					tr.prev().find(this._ctrSelector).last().focus();
				} else {
					tr.find(this._ctrSelector).eq(idx - 1).focus();
				}
			} else {
				return false;
			}
		},
		"39": function (tr, idx, el) {//right
			if (this._getCursorPos(el) == el.value.length) {
				this["13"](tr, idx);
			} else {
				return false;
			}
		},
		_getCursorPos: function (el) {//获取光标所在位置
			if (typeof (el.selectionStart) != 'undefined') {
				return el.selectionStart;
			} else if (document.selection) {
				el.focus();
				var r = document.selection.createRange();
				if (!r) return 0;
				var re = el.createTextRange(), rc = re.duplicate();
				re.moveToBookmark(r.getBookmark());
				rc.setEndPoint('EndToStart', re);
				return rc.text.length;
			}
			return 0;
		}
	}
};