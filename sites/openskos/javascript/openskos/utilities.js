  var openskos = (function ($, openskos) {
    "use strict";

    if (openskos.utilities === undefined) {
      // d.w.z.: openskos.utilities heeft nu commonUtilies als prototype
      openskos.utilities = Object.create(commonUtilities);
    }
    ;

    openskos.utilities.isGiven = function (arrayParameter) {
      if (arrayParameter !== null) {
        if (arrayParameter !== undefined) {
          if (arrayParameter !== []) {
            return arrayParameter.length > 0;
          }
          ;
        }
        ;
      }
      ;
      return false;
    };

    openskos.utilities.getQueryParams = function (options) {
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
    };


    openskos.utilities.getBackLink = function () {
      var queryparams = openskos.utilities.getQueryParams(), bl;
      if (queryparams.backlink !== undefined) {
        bl = encodeURIComponent(queryparams.backlink);
      } else {
        bl = encodeURIComponent(window.location.search + window.location.hash);
      }

      return bl;
    };

    openskos.utilities.getValueByKey = function (obj, key) {
      return (obj[key] === undefined ? "" : obj[key]);
    };

    openskos.utilities.getMultiValueByKey = function (obj, key, sep) {
      return (obj[key] === undefined ? "" : obj[key].join(sep));
    };

    openskos.utilities.getMultiValueByKeyPrefix = function (obj, keyPrefix, sep, keys) {
      var values = [];
      for (var i = 0; i < keys.length; i++) {
        //console.log(keys[i]);
        if (keys[i].startsWith(keyPrefix)) {
          values.push(obj[keys[i]]);
        }
      }
      return (values.length > 0 ? values.join(sep) : "");
    };
    /**
     * http://wiki.apache.org/httpd/NameBasedSSLVHostsWithSNI
     * IE op Windows XP ondersteunt geen SNI (Server Name Indication) en certificaat voor openskos.nl werkt
     * op die manier (maakt gebruik van certificaat van meertens.knaw.nl)
     * http://stackoverflow.com/questions/20181138/is-there-any-way-to-test-if-a-user-is-on-windows-xp
     *
     * @returns {boolean}
     */
    openskos.utilities.checkForXP = function () {
      var retval = false;
      if (navigator.userAgent.toLowerCase().indexOf('windows nt 5.1') !== -1) {
        if ($.cookie('xp_warning') === undefined) {
          retval = true;
        }
      }
      return retval;
    };

    /*ignore jslint start */
    openskos.utilities.array_unique = function (inputArr) {
      //  discuss at: http://phpjs.org/functions/array_unique/
      // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
      //    input by: duncan
      //    input by: Brett Zamir (http://brett-zamir.me)
      // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // bugfixed by: Nate
      // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // bugfixed by: Brett Zamir (http://brett-zamir.me)
      // improved by: Michael Grier
      //        note: The second argument, sort_flags is not implemented;
      //        note: also should be sorted (asort?) first according to docs
      //   example 1: array_unique(['Kevin','Kevin','van','Zonneveld','Kevin']);
      //   returns 1: {0: 'Kevin', 2: 'van', 3: 'Zonneveld'}
      //   example 2: array_unique({'a': 'green', 0: 'red', 'b': 'green', 1: 'blue', 2: 'red'});
      //   returns 2: {a: 'green', 0: 'red', 1: 'blue'}

      //noinspection JSUnusedAssignment
      var key = '',
        tmp_arr2 = {},
        val = '';

      var __array_search = function (needle, haystack) {
        //noinspection JSUnusedAssignment
        var fkey = '';
        for (fkey in haystack) {
          if (haystack.hasOwnProperty(fkey)) {
            //noinspection JSLint
            if ((haystack[fkey] + '') === (needle + '')) {
              return fkey;
            }
          }
        }
        return false;
      };

      for (key in inputArr) {
        if (inputArr.hasOwnProperty(key)) {
          val = inputArr[key];
          if (false === __array_search(val, tmp_arr2)) {
            tmp_arr2[key] = val;
          }
        }
      }

      return tmp_arr2;
    };
    /*ignore jslint end */

    openskos.utilities.handleAjaxErrors = function (event, jqxhr, settings, thrownError) {
      var errorstring, errorheader,
        cql_syntax_error_string = "org.apache.solr.search.SyntaxError",
        cql_syntax_error_pos = -1,
        jan_odijk_string = "JAN-ODIJK-EXCEPTION",
        jan_odijk_pos = -1,
        no_valid_json_string = "No valid json from",
        no_valid_json_pos = -1,
        solr_error_string = "Solr error response",
        solr_error_pos = -1,
        messageoptions = {
          element: $("#error-message")
        };
     
      if (jqxhr.responseText !== undefined) {
        cql_syntax_error_pos = jqxhr.responseText.indexOf(cql_syntax_error_string);
        jan_odijk_pos = jqxhr.responseText.indexOf(jan_odijk_string);
        solr_error_pos = jqxhr.responseText.indexOf(solr_error_string);
        no_valid_json_pos = jqxhr.responseText.indexOf(no_valid_json_string);
      }
      if (settings.append) {
        messageoptions.append = settings.append;
      }
     
      if (jan_odijk_pos > -1) {
        errorstring = JSON.parse(JSON.parse(jqxhr.responseText).error).error;
        messageoptions.string = "Query levert te veel resultaten op:<br><br>" + errorstring.substring(errorstring.indexOf(jan_odijk_string) + jan_odijk_string.length + 2);
        messageoptions.klasse = "warning";
        openskos.view.displayMessage(messageoptions);
        $("#loading").hide();
        return;
      }
      if (cql_syntax_error_pos > -1) {
        errorstring = JSON.parse(JSON.parse(jqxhr.responseText).error).error;
        messageoptions.string = "Syntactische fout in CQL-query. Foutbericht van server was:<br><br>" + errorstring.substring(errorstring.indexOf(cql_syntax_error_string) + cql_syntax_error_string.length + 2);
        messageoptions.klasse = "error";
        openskos.view.displayMessage(messageoptions);
        $("#loading").hide();
        return;
      }
      if (no_valid_json_pos > -1) {
        messageoptions.string = "Serverfout. Waarschijnlijke oorzaak: te zware query.";
        messageoptions.klasse = "error";
        openskos.view.displayMessage(messageoptions);
        $("#loading").hide();
        return;
      }
      if (solr_error_pos > -1) {
        errorstring = JSON.parse(JSON.parse(jqxhr.responseText).error).error;
        messageoptions.string = "Serverfout met onbekende oorzaak. Foutbericht van server was:<br><br>" + errorstring.substring(errorstring.indexOf(solr_error_string) + solr_error_string.length + 2);
        messageoptions.klasse = "error";
        openskos.view.displayMessage(messageoptions);
        $("#loading").hide();
        return;
      }

      errorheader = jqxhr.getResponseHeader('X-Error-Msg');
      if (errorheader === null || errorheader === undefined) {
        errorheader ='';
      }
      if (jqxhr.status !== undefined && jqxhr.status !== null) {
        messageoptions.string = "Server response status: " + jqxhr.status + '<br>';
        if (errorheader.trim() !== "") {
          messageoptions.string += "Server error message: " + errorheader;
        }
        if (jqxhr.status === 0 && errorheader.trim() === "") {
          messageoptions.string += "Possible reason: broken connection";
        }
      } else {
        if (errorheader.trim() === "") {
          messageoptions.string = "Server fault due to an uknown reason, response status is unknown.";
        } else {
          messageoptions.string = "Response status is unknown, the server response is <br>" + errorheader;
        }
      }
       openskos.view.displayMessage(messageoptions);
       $("#loading").hide();
    };

    return openskos;

  }(jQuery, window.openskos || {}));