import React from 'react';
function LexBotCommon(props) {

    (function(d, m){
        var kommunicateSettings = 
            {"appId":"31a88016359e24ba98715e23199cf6e87","popupWidget":true,"automaticChatOpenOnNavigation":true, };
        var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        window.kommunicate = m; m._globals = kommunicateSettings;
    })(document, window.kommunicate || {}); 
    return ( 
        <div></div>
    )
}

export default LexBotCommon;
