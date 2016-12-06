plugin.materialdesignAllDone = plugin.allDone;
plugin.allDone = function() {
    plugin.materialdesignAllDone.call(this);
    $.each(["diskspace","quotaspace","cpuload"], function(ndx,name) {
        var plg = thePlugins.get(name);
        if(plg && plg.enabled) {
            plg.prgStartColor = new RGBackground("#8BC34A");
            plg.prgEndColor = new RGBackground("#E53935");
        }
    });
}

plugin.oldTableCreate = dxSTable.prototype.create;
dxSTable.prototype.create = function(ele, styles, aName) {
    plugin.oldTableCreate.call(this, ele, styles, aName);
    this.prgStartColor = new RGBackground("#E53935");
    this.prgEndColor = new RGBackground("#8BC34A");
}

theWebUI.showPanel = function(pnl,enable) {
    var cont = $('#'+pnl.id+"_cont");
    cont.toggle(enable);
    pnl.classList.toggle('open', enable);
    theWebUI.settings["webui.closed_panels"][pnl.id] = !enable;
}

dxSTable.prototype.Sort = function(e) {
	if(this.cancelSort) 
		return(true);
	this.isSorting = true;
	var col = null;
	var rev = true;
	if(e == null) 
	{
		if(this.sIndex ==- 1) 
		{
		        this.calcSize().resizeHack();
			return(true);
		}
		rev = false;
		col = this.tHead.tb.rows[0].cells[this.sIndex];
	}
	else 
	{
		if(e.which==3)
			return(true);
		col = (e.target) ? e.target : e.srcElement;
	}
	if(col.tagName == "DIV") 
	{
		col = col.parentNode;
	}
	var ind = parseInt(col.getAttribute("index"));
	if(e && e.shiftKey && (this.sIndex >- 1))
	{
		if(this.secIndex == ind) 
			this.secRev = 1 - this.secRev;
		else 
			this.secRev = 0;
		this.secIndex = ind;
		ind = this.sIndex;
		rev = false;
		col = this.tHead.tb.rows[0].cells[this.sIndex];
	}
	if(rev) 
	        this.reverse = (this.sIndex == ind) ? 1 - this.reverse : 0;
	if(this.sIndex >= 0) 
	{
		var td = this.tHead.tb.rows[0].cells[this.sIndex];
        td.classList = '';
	}
    col.classList.add((this.reverse ? "asc" : "desc"));

	this.sIndex = ind;
	var d = this.getCache(ind);
	var u = d.slice(0);
	var self = this;
	switch(this.colsdata[ind].type) 
	{
		case TYPE_STRING : 
			d.sort(function(x, y) { return self.sortAlphaNumeric(x, y); });
      			break;
      		case TYPE_PROGRESS :
      		case TYPE_NUMBER : 
      			d.sort(function(x, y) { return self.sortNumeric(x, y); });
      			break;
      		default : 
      			d.sort();
      			break;
      	}
   	if(this.reverse) 
		d.reverse();
	this.rowIDs = [];
	var c = 0, i = 0;
	while(i < this.rows) 
	{
		this.rowdata[d[i].key] = d[i].e;
		this.rowIDs.push(d[i].key);
      		i++;
	}
	this.clearCache(d);
	this.clearCache(u);
	this.isSorting = false;
	if(!this.isScrolling) 
		this.refreshRows();
	this.calcSize().resizeHack();
	if($type(this.onsort) == "function") 
		this.onsort();
	return(false);
}

theWebUI.resize = function() {
    var ww = $(window).width();
    var wh = $(window).height();
        var w = Math.floor(ww * (1 - theWebUI.settings["webui.hsplit"])) - 5;
        var th = ($("#t").is(":visible") ? $("#t").height() : -1)+$("#StatusBar").height()+12;
    $("#StatusBar").width(ww);
    if(theWebUI.settings["webui.show_cats"])
    {
        theWebUI.resizeLeft( w, wh-th);
        w = ww - w;
    }
    else
    {
        $("#VDivider").width( ww-10 );
        w = ww;
    }
    w-=4;
    theWebUI.resizeTop( w, Math.floor(wh * (theWebUI.settings["webui.show_dets"] ? theWebUI.settings["webui.vsplit"] : 1))-th);
    if(theWebUI.settings["webui.show_dets"])
        theWebUI.resizeBottom( w, Math.floor(wh * (1 - theWebUI.settings["webui.vsplit"])) - 9);
    $("#HDivider").height( wh-th );
}

theWebUI.resizeTop = function( w, h ) {
    this.getTable("trt").resize(w,(h ? h + 7 : h)); 
}

plugin.oldResizeBottom = theWebUI.resizeBottom;
theWebUI.resizeBottom = function( w, h ) {
    if ( h !== null )
        h -= 1;
    plugin.oldResizeBottom.call(this, w, h);
}
