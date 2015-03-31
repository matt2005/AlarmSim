/*=============================================================================*\
|| ########################################################################### ||
|| # Product: Tab and Link Manager v4.3.0                                    # ||
|| # ----------------------------------------------------------------------- # ||
|| # Copyright ©2009 Mosh Shigdar, Wolfshead Solutions. All Rights Reserved. # ||
|| # This file may not be redistributed in whole or significant part.        # ||
|| # ------------ TAB AND LINK MANAGER IS NOT FREE SOFTWARE ---------------- # ||
|| #                 http://www.wolfshead-solutions.com                      # ||
|| ########################################################################### ||
\*=============================================================================*/
function wsLinks(){if(!document.getElementsByTagName)return;var anchors=document.getElementsByTagName("a");for(var i=0;i<anchors.length;i++){var anchor=anchors[i];if(anchor.getAttribute("href")&&(anchor.getAttribute("rel")=="wsBlank"||anchor.getAttribute("rel")=="wsBlank nofollow")){anchor.target="_blank"}if(anchor.getAttribute("href")&&(anchor.getAttribute("rel")=="wsSelf"||anchor.getAttribute("rel")=="wsSelf nofollow")){anchor.target="_self"}if(anchor.getAttribute("href")&&(anchor.getAttribute("rel")=="wsParent"||anchor.getAttribute("rel")=="wsParent nofollow")){anchor.target="_parent"}if(anchor.getAttribute("href")&&(anchor.getAttribute("rel")=="wsTop"||anchor.getAttribute("rel")=="wsTop nofollow")){anchor.target="_top"}}}window.onload=wsLinks;
/*============================================================================*\
|| ########################################################################## ||
|| # Tab and Link Manager 4.3.0 - $Rev: 26 $
|| # $Date: 2011-04-07 22:49:29 +1000 (Thu, 07 Apr 2011) $
|| ########################################################################## ||
\*============================================================================*/