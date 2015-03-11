// Override Ajax.Request :-)
function replace(){
    if(typeof Ajax != 'undefined')
    (function(old){
        Ajax.Request = function(url, options){
            var key = url+"|"+options.parameters,
                cache = localStorage.getItem(key),
                success = options.onSuccess;

            if(cache && cache != "[object Object]"){
                options.onSuccess({
                    // Only responseXML is needed
                    responseXML: (new DOMParser()).parseFromString(cache, "text/xml")
                });
                // console.log("From cache", (new DOMParser()).parseFromString(cache, "text/xml"));
                return;
            } else {
                options.onSuccess = function(res){
                    console.log("Stored in cache");
                    var ret = success.apply(this, arguments);
                    // Storing the responseXML fails silently
                    localStorage.setItem(key, res.responseText);
                    return ret;
                }
            }
            
            // console.log("Intercepted Ajax.Request", arguments);
            return old.apply(this, arguments);
        }
        Ajax.Request.prototype = old.prototype;
        Ajax.Request.Events = old.Events;
    })(Ajax.Request);
    else console.warn("Ajax.Request not defined");
}

/* Inject RIGHT AFTER the Prototype.js script is loaded, but before the body's script tags execute. */
var counter = 0;
function afterHEAD(e){
    if(e.target.tagName === "HEAD"){
        var lastHeadScript = Array.prototype.slice.call(document.head.getElementsByTagName("script"), -1)[0];
        if(lastHeadScript && lastHeadScript.src.indexOf("branding") >= 0){
            var js = document.createElement("script");
            /* For some reason the function will not be found. toString is necessary to get it in there */
            js.innerHTML = (replace.toString())+"; replace();";
            lastHeadScript.parentNode.appendChild(js);
            document.removeEventListener("DOMSubtreeModified", afterHEAD);
        }
    }
}
document.addEventListener("DOMSubtreeModified", afterHEAD);