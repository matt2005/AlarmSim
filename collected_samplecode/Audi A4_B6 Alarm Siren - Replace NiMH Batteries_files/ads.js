
if (navigator.userAgent.match(/iPhone|iPod|iPad|Silk|Android|IEMobile|Windows Phone/i) &&
    typeof(Storage) !== "undefined" &&
    typeof(app_ads_refferer) !== "undefined" && app_ads_refferer &&
    typeof(app_ads_url) !== "undefined" && app_ads_url && (
    (typeof(app_board_url) !== "undefined" && app_board_url) || 
    (typeof(app_forum_code) !== "undefined" && app_forum_code)))
    
{
    current_timestamp = Math.round(+new Date()/1000);
    hide_until = typeof(localStorage.hide_until) === "undefined" ? 0 : localStorage.hide_until;
    
    if (current_timestamp > hide_until)
    {
        // don't show it again in 30 days
        localStorage.hide_until = current_timestamp+(86400*30);
        
        // redirect to ads page with referer
        window.location.href=app_ads_url+'?referer='+app_ads_refferer+'&code='+app_forum_code+'&board_url='+app_board_url;
    }
}
