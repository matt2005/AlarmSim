var myrules = {
  '.dropdownbox h2' : function( element ) {
    element.onclick = function() {
      baseclass = this.parentNode.className.match( /^(.*?) / )[1];
      
      re = new RegExp( 'show_' + baseclass );
      if( re.test( this.parentNode.className ) ) {
        this.parentNode.className = this.parentNode.className.replace(" show_" + baseclass, "");
      } else {
        this.parentNode.className += " show_" + baseclass;
      }
    }
  }
};

Behaviour.register(myrules);
