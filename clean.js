function log(){ if(console) console.log.apply(console, arguments); };
$.fn.fc = function(){
	return $(this.get(0).contentDocument.body);
}
$.fn.fw = function(){
	return this.get(0).contentWindow;
}

var contentFrame = $("#contentFrame").css("height", "+=42").fc(),
		navFrame = $("#navFrame").css("height", "-=42").fc();

navFrame.ready(function(){
	/* Move logo */
	var firstMenuItem = $("#appTabList tr td", navFrame).first();
	var logo = navFrame.find("#topTabs .brandingImgWrap");
	navFrame.find("#topTabs").css("height", "47px");
	logo.wrap("<td id='logo'></td>").parent().insertBefore(firstMenuItem);

	/* Make logo a _blank link */
	logo.find("a").attr("href", "https://blackboard.tudelft.nl/webapps/portal/frameset.jsp?tab_tab_group_id=_9_1");
	logo.find("a").attr("target", "_top");
	if(window.devicePixelRatio > 1)
		logo.find("img").attr("src", chrome.extension.getURL("tudelft_logo.png"));

	/* Remove MyContent */
	navFrame.find("[id='My Content']").remove();

	/* Remove MyStudentInfo */
	navFrame.find("#MyStudentInfo").remove();

	/* Remove MyCampusLife, Add Collegerama */
	navFrame.find("[id='My Campus Life']")
		.attr("id","Collegerama").insertBefore(navFrame.find("#Organizations"))
		.find("a").attr("href", "http://collegeramacolleges.tudelft.nl/online/faculteiten/").attr("target", "_blank")
		.find("span:not(.hideoff)").text("Collegerama");
});

contentFrame.ready(function(){
	/* The bodies seem to be swapped, re-get the contentDocument */
	var contentFrame = $("#contentFrame").fc(),
		navFrame = $("#navFrame").fc();

	/* Remove unnecessary bars */
	contentFrame.find("#paneTabs, #actionbar").remove();
	contentFrame.find(".locationPane").find("> .paneTabs").remove();
	contentFrame.find("[id='module:_2914_1']").remove(); //Blackboard IM module
	contentFrame.find("[id='module:_2674_1']").remove(); //Mobile learning module
	
	/* Move ugly bulletin messages */
	var texts = contentFrame.find(".vtbegenerated:not(.portlet *)");
	if(texts.size()){
		var h = "", a = texts.map(function(){ return this && $(this).html(); });
		for(var i = 0; i < a.length; a++){
			var c = a[i].replace(/\<script[\s\S]*\<\/script\>/ig, "");
			if($(c).text().trim() != "")
				h += c;
		}

		if(h){
			var asDOM = $(h);
			asDOM.removeAttr("style").find("[style]").removeAttr("style");
			h = asDOM.html();
			$("<td id='VBMessages'><div class='vbmessages'></div></td>").insertAfter(navFrame.find("#topTabs #Help"));
			navFrame.find("#VBMessages .vbmessages").append(h);
			texts.remove();
		}
	}
});

jQuery(document).ready(function(){
	log("Blackboard was succesfully cleaned by your favorite Blackboard cleanup plugin BBClean. Thanks for watching!");
	log("You can fork and contribute at https://github.com/hermanbanken/BBClean");
});