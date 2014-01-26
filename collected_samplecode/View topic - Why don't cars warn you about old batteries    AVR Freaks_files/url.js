var URL = {
  input: new Array(),

  getVariables: function()
  {
    // is there a ? in the url
    var is_input = document.URL.indexOf('?');

    if (is_input < 0) {
      return;
    }

    return (document.URL.substring(is_input+1, document.URL.length)).toQueryParams();
  }
}