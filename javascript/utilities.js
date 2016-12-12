//noinspection JSUnusedGlobalSymbols
/*globals nederlab: true, jQuery */
/*jslint browser: true, indent: 2, bitwise: true, plusplus: true, nomen: true, vars: true, sloppy: true, regexp: true, eqeq: true, white: true, todo: true */

/**
 * Crockford, Javascript: the good parts, p. 22
 */
if (typeof Object.create !== 'function') {
  Object.create = function(o) {
    var F = function () {};
    F.prototype = o;
    return new F();
  }
}

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/
var Base64 = {

  // private property
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode: function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
      this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
      this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
  },

  // public method for decoding
  decode: function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }

    }

    output = Base64._utf8_decode(output);

    return output;

  },

  // private method for UTF-8 encoding
  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "", n;

    for (n = 0; n < string.length; n++) {

      //noinspection JSLint
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode: function (utftext) {
    var string = "";
    var i = 0;
    var c = 0, c2 = 0, c3 = 0;

    while (i < utftext.length) {

      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }
      else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }
      else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }

    }

    return string;
  }

};

if (!window.btoa) {
  window.btoa = function (str) {
    return Base64.encode(str);
  };
}

if (!window.atob) {
  window.atob = function (str) {
    return Base64.decode(str);
  };
}

if (!Date.prototype.toISOString) {
  ( function () {

    function pad(number) {
      var r = String(number);
      if (r.length === 1) {
        r = '0' + r;
      }
      return r;
    }

    Date.prototype.toISOString = function () {
      return this.getUTCFullYear()
          + '-' + pad(this.getUTCMonth() + 1)
          + '-' + pad(this.getUTCDate())
          + 'T' + pad(this.getUTCHours())
          + ':' + pad(this.getUTCMinutes())
          + ':' + pad(this.getUTCSeconds())
          + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
          + 'Z';
    };
  }());
}

var commonUtilities = {

  isJsonString: function (str) {
    var retval;
    if (str === undefined) {
      return false;
    }
    try {
      retval = JSON.parse(str);
    } catch (e) {
      return false;
    }
    return retval;
  },

  // http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
  capitaliseFirstLetter: function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  // http://stackoverflow.com/a/11654596
  updateQueryString: function (key, value, url) {
    var retval, re;
    if (!url) {
      url = window.location.href;
    }
    re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");

    if (re.test(url)) {
      if (value !== undefined && value !== null) {
        retval = url.replace(re, '$1' + key + "=" + value + '$2$3');
      } else {
        retval = url.replace(re, '$1$3').replace(/(&|\?)$/, '');
      }
    } else {
      if (value !== undefined && value !== null) {
        var separator = url.indexOf('?') !== -1 ? '&' : '?',
            hash = url.split('#');
        url = hash[0] + separator + key + '=' + value;
        if (hash[1]) {
          url += '#' + hash[1];
        }
        retval = url;
      } else {
        retval = url;
      }
    }
    return retval;
  },

  //noinspection JSUnusedGlobalSymbols
  urlencode: function (str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: AJ
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: travc
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Lars Fischer
    // +      input by: Ratheous
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Joris
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // %          note 1: This reflects PHP 5.3/6.0+ behavior
    // %        note 2: Please be aware that this function expects to encode into UTF-8 encoded strings, as found on
    // %        note 2: pages served as UTF-8
    // *     example 1: urlencode('Kevin van Zonneveld!');
    // *     returns 1: 'Kevin+van+Zonneveld%21'
    // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
    // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
    // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
    // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
    //noinspection JSLint
    str = (str + '').toString();

    // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
    // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
        replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
  },


  /*ignore jslint start */
  http_build_query: function (formdata, numeric_prefix, arg_separator) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Legaev Andrey
    // +   improved by: Michael White (http://getsprink.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +    revised by: stag019
    // +   input by: Dreamer
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: MIO_KODUKI (http://mio-koduki.blogspot.com/)
    // %        note 1: If the value is null, key and value is skipped in http_build_query of PHP. But, phpjs is not.
    // -    depends on: urlencode
    // *     example 1: http_build_query({foo: 'bar', php: 'hypertext processor', baz: 'boom', cow: 'milk'}, '', '&amp;');
    // *     returns 1: 'foo=bar&amp;php=hypertext+processor&amp;baz=boom&amp;cow=milk'
    // *     example 2: http_build_query({'php': 'hypertext processor', 0: 'foo', 1: 'bar', 2: 'baz', 3: 'boom', 'cow': 'milk'}, 'myvar_');
    // *     returns 2: 'php=hypertext+processor&myvar_0=foo&myvar_1=bar&myvar_2=baz&myvar_3=boom&cow=milk'
    var value, key, tmp = [],
        that = this;

    var _http_build_query_helper = function (key, val, arg_separator) {
      var k, temp = [];
      if (val === true) {
        val = "true";
      } else if (val === false) {
        val = "false";
      }
      //noinspection JSLint
      if (val != null) {
        //noinspection JSLint
        if (typeof val === "object") {
          //noinspection JSLint
          for (k in val) {
            //noinspection JSUnfilteredForInLoop
            if (val[k] != null) {
              //noinspection JSUnfilteredForInLoop
              temp.push(_http_build_query_helper(key + "[" + k + "]", val[k], arg_separator));
            }
          }
          //noinspection JSLint
          return temp.join(arg_separator);
        } else { //noinspection JSLint
          if (typeof val !== "function") {
            //noinspection JSLint
            return that.urlencode(key) + "=" + that.urlencode(val);
          } else {
            throw new Error('There was an error processing for http_build_query().');
          }
        }
      } else {
        return '';
      }
    };

    if (!arg_separator) {
      arg_separator = "&";
    }
    //noinspection JSLint
    for (key in formdata) {
      //noinspection JSUnfilteredForInLoop
      value = formdata[key];
      //noinspection JSUnfilteredForInLoop
      if (numeric_prefix && !isNaN(key)) {
        //noinspection JSUnfilteredForInLoop
        key = String(numeric_prefix) + key;
      }
      //noinspection JSUnfilteredForInLoop,JSLint
      var query = _http_build_query_helper(key, value, arg_separator);
      if (query !== '') {
        tmp.push(query);
      }
    }

    return tmp.join(arg_separator);
  },
  /*ignore jslint end */


  nl2br: function (str, is_xhtml) {
    //  discuss at: http://phpjs.org/functions/nl2br/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Philip Peterson
    // improved by: Onno Marsman
    // improved by: Atli Þór
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Maximusya
    // bugfixed by: Onno Marsman
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Brett Zamir (http://brett-zamir.me)
    //   example 1: nl2br('Kevin\nvan\nZonneveld');
    //   returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
    //   example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
    //   returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
    //   example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
    //   returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'

    //noinspection JSLint
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

    //noinspection JSLint
    return (str + '')
        .replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  },

  cloneObject: function (obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  /**
   * http://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
   * @param value
   * @returns {string}
   */
  htmlEncode: function (value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },

  htmlDecode: function (value) {
    return String(value).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  },

  getQueryParams: function (options) {
    var querystring, queryparams = {}, aItKey, nKeyId, aCouples;
    if (options !== undefined && options.url !== undefined) {
      querystring = options.url.split("#")[0]; // hash er af
    } else {
      querystring = window.location.search; // zit hash niet meer in
    }
    if (querystring.length > 0) {
      // https://developer.mozilla.org/en-US/docs/Web/API/window.location#Example_.237.3A_Nest_the_variables_obtained_through_the_window.location.search_string_in_an_object_named_oGetVars.3A
      // uitgangspunt dat code van Mozilla de meest robuuste manier is om dit voor elkaar te krijgen,
      // eigen maaksel hierdoor vervangen
      for (nKeyId = 0, aCouples = querystring.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
        aItKey = aCouples[nKeyId].split("=");
        queryparams[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
      }
    }
    return queryparams;
  },

  getValueByKey: function (obj, key) {
    return (obj[key] === undefined ? "" : obj[key]);
  },

  getMultiValueByKey: function (obj, key, sep) {
    return (obj[key] === undefined ? "" : obj[key].join(sep));
  },
  /**
   * http://wiki.apache.org/httpd/NameBasedSSLVHostsWithSNI
   * IE op Windows XP ondersteunt geen SNI (Server Name Indication) en certificaat voor nederlab.nl werkt
   * op die manier (maakt gebruik van certificaat van meertens.knaw.nl)
   * http://stackoverflow.com/questions/20181138/is-there-any-way-to-test-if-a-user-is-on-windows-xp
   *
   * @returns {boolean}
   */
  checkForXP: function () {
    var retval = false;
    if (navigator.userAgent.toLowerCase().indexOf('windows nt 5.1') !== -1) {
      if ($.cookie('xp_warning') === undefined) {
        retval = true;
      }
    }
    return retval;
  },
  /**
   * http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/
   * @param str
   * @returns {string}
   */
  escapeHtml: function (str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
};