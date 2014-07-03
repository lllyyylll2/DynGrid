DynGrid
=======

DynGrid is a Dynamic Grid for batch editing table data. 
You can Use it like Asp.net GridView.
Column templates are defined in some separted js file with which you can bind Field on it.


How to Use:
=======

Html table Header:
----

    <table id="tb_plan" class="GridViewStyle" style=" width:100%;">
  		<tr class="GridViewHeaderStyle">
  			<th style="width:3em;">序号</th>
  			<th style="width:13em;">计划工作量</th>
  			<th>备注</th>
  			<th style=" width:4em;"><a id="btnAdd" style=" cursor:pointer;">[添加]</a></th>
  		</tr>
  	</table>
  	
Initialize JS:
----

    var grid = new dynGrid("#tb_plan", "#btnAdd", "#_hideJSON");
    grid.deleteText = "移除";
    grid.trCssClass = "GridViewRowStyle";
    grid.idField = "ID";
    grid.createColumns([
    	new dynColIdx(),
    	new dynColTxt("WL_A"),
    	new dynColTxt("REMARKS")
    ]);
    grid.columns[1].onCellCreated = function (ctr, idx, allowEdit) {
    	dynColTxt.prototype.onCellCreated.apply(this, arguments);
    	ctr.bindDecimalTypeValidation().attr("maxlength", 10).css("text-align", "center");
    };
    grid.columns[1].attr("maxlength", 8).css({ "text-align": "center" });
    grid.bindData();
