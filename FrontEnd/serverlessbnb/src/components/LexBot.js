import React from 'react';

function LexBot(props) {
    (function(d, m){
        var kommunicateSettings = 
            {"appId":"1e75f6ddc0bf5f7912692afd044465e7b","popupWidget":true,"automaticChatOpenOnNavigation":true};
        var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        window.kommunicate = m; m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
    return(
        <div></div>
    )
/* NOTE : Use web server to view HTML files as real-time update will not work if you directly open the HTML file in the browser. */
}
export default LexBot;