// This script utilizes the Prototype JavaScript Framework
// and the Behaviour JavaScript library

var addBuddy = {
    // the keyword for which an HTTP request has been initiated
    httpRequestUsername: undefined,

    // The object containg the cache as an assoc array
    // with: queryString => HTML
    cache: undefined,

    // URL to the PHP page called for receiving suggestions for usernames
    fUrl: '../../../index.php',

    // time for last keystroke, is used to wait so that we
    // do not process HTTP request while the user is typing
    lastKS: undefined,

    // initializing the addBuddy features
    init: function()
    {
        addBuddy.cache = new Object();
        addBuddy.lookup_user();
        addBuddy.disable_autocomplete();
    },

    // function to look up usernames according to input
    lookup_user: function()
    {
        // if has there been less than 250ms since the
        // last keystroke, we return
        if(!( new Date().getTime() - addBuddy.lastKS > 250 )) {
            return;
        }

        var current_user = $F('bname');

        // return if there is no input
        if (current_user == undefined || current_user == "")
        {
            return;
        }

        // a HTTP request has been already been initiated
        // for this username
        if (addBuddy.httpRequestUsername == current_user) {
            return;
        }

        if (addBuddy.check_cache(current_user)) {
            addBuddy.showResponse(addBuddy.cache[current_user]);
            return;
        }

        // the parameters we want to send
        var pars = 'module=CS Buddies&func=autocomplete&username=' + current_user;

        // since the next thing we are doing is a HTTP request,
        // we now add the current username to the httpRequestUsername
        addBuddy.httpRequestUsername = current_user;

        // do a HTTP request for the username
        var myAjax = new Ajax.Request(
            addBuddy.fUrl,
            {
                method: 'get',
                parameters: pars,
                onComplete: addBuddy.ajaxResponse
            }
        );
    },

    ajaxResponse: function(originalRequest)
    {
        // add the response to the cache if it ain't there from before
        if (addBuddy.httpRequestUsername != undefined
            && !addBuddy.check_cache(addBuddy.httpRequestUsername)) {
            addBuddy.cache[addBuddy.httpRequestUsername] = originalRequest.responseText;
        }

        // show the response
        addBuddy.showResponse(originalRequest.responseText);
    },

    check_cache: function(username) {
        return addBuddy.cache[username] != undefined;
    },

    // handles the server's response containing the suggestions
    showResponse: function(responseText)
    {
        $('addBuddySuggest').innerHTML = responseText;
        Element.show('addBuddySuggest');

        // We must re-apply the CSS rules when we alter the DOM
        Behaviour.apply(addBuddyRules);
    },

    // add the selected username to the inputbox
    add: function(element)
    {
        $('bname').value = element.innerHTML;

        // hide the suggestbox when we have added a username
        Element.hide('addBuddySuggest');
    },

    // prevent browser from starting the autofill function
    // autocomplete="off" fails validation, so do it from here :-)
    disable_autocomplete: function()
    {
        var sf = $('bname');

        if (sf == undefined || sf == "")
        {
            return;
        }

        sf.setAttribute('autocomplete', 'off');
    },

    // we want an other backgroundcolor on the element the mouse is over
    addStyle: function(element)
    {
        var nodeList = $('buddyNodeList').getElementsByTagName('li');
        var nodes = $A(nodeList);

        // walk through the nodes and set the standard backgroundcolor
        nodes.each(function(node) {
            node.style.backgroundColor = "#ffffff";
        });

        // set the wanted hover backgroundcolor
        element.style.backgroundColor = "#cccccc";
    },

    // add a buddy to the table
    addToTable: function(originalRequest)
    {
        var xml = originalRequest.responseXML;

        // Fetch the buddy node
        var buddy = xml.lastChild.firstChild;

        // Fetch the attributes from the
        // returned XML document
        var userid = buddy.getAttribute("id");
        var username = buddy.getAttribute("username");

        if (buddy.getAttribute("online") == 0) {
            var onoff = "offline";
        } else {
            var onoff = "online";
        }

        var table = $('buddy_table');

        var td1html = '<a href="/index.php?name=PNphpBB2&amp;file=profile&amp;mode=viewprofile&amp;u=' + userid + '" title="' + username + ' is offline">' + username + '</a>';
        var td2html = '<a href="/index.php?name=PNphpBB2&amp;file=privmsg&amp;mode=post&amp;u=' + userid + '"><img src="/themes/FreakCyber/images/leftblock/fc_sendPM.gif" title="Write a new PM to ' + username + '" alt="PM"></a>';
        var td3html = '<img src="/themes/FreakCyber/images/leftblock/fc_useroffline.gif" title="' + username + ' is ' + onoff + '" alt="' + onoff + '">';

        // We build the childnode for the userinfo
        var newTr = document.createElement('tr');

        var td1 = document.createElement('td');
        td1.setAttribute("width", "100%");
        td1.innerHTML = td1html;
        newTr.appendChild(td1);

        var td2 = document.createElement('td');
        td2.setAttribute("class", "sendPM");
        td2.innerHTML = td2html;
        newTr.appendChild(td2);

        var td3 = document.createElement('td');
        td3.setAttribute("class", "onoff");
        td3.innerHTML = td3html;
        newTr.appendChild(td3);

        // Add the childnode to the table
        table.appendChild(newTr);

        // Remove the username, enable the form and
        // hide the buddyblock
        $('bname').value = "";
        $('addBuddyButton').removeAttribute("disabled");
        Element.hide('addBuddy');
    },

    // function for submitting the username, since we want to update
    // it on the page, and not refresh it
    submit: function()
    {
        // set the vurrent vars
        var current_vars = {
            bname: $F('bname'),
            userid: $F('own_userid'),
            bid: 0
        };

        var h = $H(current_vars);

        // the parameters we want to send
        var pars = 'module=CS Buddies&func=ajaxaddbuddy&' + h.toQueryString();

        // do a HTTP request on the username
        // we utilize 'post' here, since the request is
        // going to change info in the database
        var myAjax = new Ajax.Request(
            addBuddy.fUrl,
            {
                method: 'post',
                parameters: pars,
                onComplete: addBuddy.addToTable
            }
        );
    }
}

// the CSS-rules, since we don't want to show all this ugly
// javascript in the HTML
var addBuddyRules = {
    '#bname' : function( element ) {
        element.onkeyup = function() {
            // look up the user every time we have
            // changed the username-input

            // add time for last keystroke
            addBuddy.lastKS = new Date().getTime();

            // timeout, so that user can type more
            // if the user use more than 300ms to
            // type again, we will have a HTTP request
            setTimeout( addBuddy.lookup_user, 300 );
        }

        element.onblur = function() {
            // must use a small timeout for hiding the buddysuggest,
            // so that we can get the information out of it before it
            // closes
            setTimeout(function() {
                Element.hide('addBuddySuggest');
            } ,200);
        }
    },

    '#addBuddySuggest li' : function( element ) {
        element.onclick = function() {
            addBuddy.add(this);
        }

        element.onmouseover = function( element ) {
            addBuddy.addStyle(this);
        }
    }
}

// we must register the CSS-rules,
// and the onload function
Behaviour.register(addBuddyRules);
register_onload_function(addBuddy.init);