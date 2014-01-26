function MM_swapImage(){var i,j=0,x,a=MM_swapImage.arguments, d=document; 
d.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3) { if 
((x=MM_findObj(a[i]))!=null) { d.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; 
x.src=a[i+2];}}}

function MM_findObj(n,d){ var p,i,x; if(!d){ d=document; } 
if((p=n.indexOf("?"))>0&&parent.frames.length) { d=parent.frames[n.substring(p+
1)].document; n=n.substring(0, p);} if(!(x=d[n])&&d.all){ x=d.all[n]; } 
for(i=0;!x&&i<d.forms.length;i++){x=d.forms[i][n];}
for(i=0;!x&&d.layers&&i<d.layers.length;i++){ 
x=MM_findObj(n,d.layers[i].document);} if(!x&&d.getElementById){ 
x=d.getElementById(n); } return x;}

function MM_swapImgRestore(){ var i,x,a=document.MM_sr; 
for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) { x.src=x.oSrc; } }

function toggleVisibility( id, simg ) {
  if(Element.visible(id)) {
    MM_swapImage(simg,'','themes/FreakCyber/images/toggle_off.gif',1);
    Element.hide(id);
  } 
  else 
  {
    MM_swapImage(simg,'','themes/FreakCyber/images/toggle_on.gif',1);
    Element.show(id);
  }
}

function toggle(obj) 
{
	Element.toggle(obj);
}

function register_onload_function( func ) {
  if( !window.onload_functions ) {
    window.onload_functions = new Array();
  }
  window.onload_functions.push( func );
}

function process_onload_functions() {
  for( var i = 0; i < window.onload_functions.length; i++ ) {
    window.onload_functions[i]();
  }
}

window.onload = process_onload_functions;