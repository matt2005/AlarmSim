
//Menu object creation
oCMenu=new makeCM("oCMenu") //Making the menu object. Argument: menuname

//Menu properties   
oCMenu.pxBetween=20
oCMenu.fromLeft=10 
oCMenu.fromTop=120   
oCMenu.rows=0
oCMenu.menuPlacement=0

oCMenu.offlineRoot="" 
oCMenu.onlineRoot="" 
oCMenu.resizeCheck=1 
oCMenu.wait=1000 
oCMenu.fillImg=""
oCMenu.zIndex=0

//Background bar properties
oCMenu.useBar=1
oCMenu.barWidth="menu"
oCMenu.barHeight="menu" 
oCMenu.barClass="clBar"
oCMenu.barX="menu"
oCMenu.barY="menu"
oCMenu.barBorderX=0
oCMenu.barBorderY=0
oCMenu.barBorderClass=""

//Level properties - ALL properties have to be spesified in level 0
oCMenu.level[0]=new cm_makeLevel() //Add this for each new level
oCMenu.level[0].width=90
oCMenu.level[0].height=30
oCMenu.level[0].regClass="clLevel0"
oCMenu.level[0].overClass="clLevel0over"
oCMenu.level[0].borderX=0 
oCMenu.level[0].borderY=0
oCMenu.level[0].borderClass=0
oCMenu.level[0].offsetX=0 
oCMenu.level[0].offsetY=0
oCMenu.level[0].rows=0
oCMenu.level[0].align="right" 


//EXAMPLE SUB LEVEL[1] PROPERTIES - You have to spesify the properties you want different from LEVEL[0] - If you want all items to look the same just remove this
oCMenu.level[1]=new cm_makeLevel() //Add this for each new level (adding one to the number)
oCMenu.level[1].width=oCMenu.level[0].width-2
oCMenu.level[1].height=22
oCMenu.level[1].regClass="clLevel1"
oCMenu.level[1].overClass="clLevel1over"
oCMenu.level[1].style=""
oCMenu.level[1].align="right" 
oCMenu.level[1].offsetX=0
oCMenu.level[1].offsetY=0
oCMenu.level[1].borderClass="clLevel1border"
oCMenu.level[1].borderX=0 
oCMenu.level[1].borderY=0
oCMenu.level[1].rows=0
oCMenu.level[1].align="bottom" 

/******************************************
Menu item creation:
myCoolMenu.makeMenu(name, parent_name, text, link, target, width, height, regImage, overImage, regClass, overClass , align, rows, nolink, onclick, onmouseover, onmouseout) 
*************************************/

oCMenu.makeMenu('top1','','&nbsp;Home','http://www.hex.co.za/index.php ')

//oCMenu.makeMenu('top2','','&nbsp;Services','http://www.hex.co.za/services.html')

oCMenu.makeMenu('top2a','','&nbsp;<b><i><font color="#0000FF" face="Arial">VCDS SouthAfrica</font></i></b>','http://www.hexdiagnostics.co.za');
//	oCMenu.makeMenu('top2a1','top2a','Main page','http://www.hex.co.za/vag-com.html');
//	oCMenu.makeMenu('top2a2','top2a','News/Awards','http://www.hex.co.za/news.html');
//	oCMenu.makeMenu('top2a3','top2a','Functions','http://www.hex.co.za/functions.html');
//	oCMenu.makeMenu('top2a4','top2a','FAQ','http://www.hex.co.za/faq.html');
//	oCMenu.makeMenu('top2a5','top2a','Demo Manual','http://www.hex.co.za/manual.html');
//	oCMenu.makeMenu('top2a6','top2a','Download','http://www.hex.co.za/download.html');
//	oCMenu.makeMenu('top2a7','top2a','Interfaces','http://www.hex.co.za/interfaces.html');
//	oCMenu.makeMenu('top2a8','top2a','Order','http://www.hex.co.za/order.html');
//	oCMenu.makeMenu('top2a9','top2a','Contact Us','http://www.hex.co.za/contactus.html');
	

// oCMenu.makeMenu('top3','','&nbsp;Products','http://www.hex.co.za/products.html')
// oCMenu.makeMenu('top4','','&nbsp;Download','http://www.hex.co.za/download.html')
// oCMenu.makeMenu('top5','','&nbsp;Contact Us','http://www.hex.co.za/contactus.html')



//Leave this line - it constructs the menu
oCMenu.construct()		
