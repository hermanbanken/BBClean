function log(){ if(console) console.log.apply(console, arguments); };
$.fn.fc = function(){
	return $(this.get(0).contentDocument);
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
	logo.find("a").attr("target", "_blank");
	
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
	/* Remove unnecessary bars */
	contentFrame.find("#paneTabs, #actionbar").remove();
	contentFrame.find(".locationPane").find("> .paneTabs").remove();
	contentFrame.find("#content > .container");
	
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
		}
	}
	texts.remove();
});

jQuery(document).ready(function(){
	log("Blackboard was succesfully cleaned by your favorite Blackboard cleanup plugin BBClean. Thanks for watching!");
	log("You can fork and contribute at https://github.com/hermanbanken/BBClean");
});