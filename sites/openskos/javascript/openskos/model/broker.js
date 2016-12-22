  /*globals jQuery, commonBroker, nederlab: true, console, $ */
  /*jslint browser: true, indent: 2, unparam: true, todo: true */

  var openskos = (function ($, openskos) {
    "use strict";

    if (openskos.model === undefined) {
      openskos.model = {};
    }

    // Zie Javascript: The good parts, p. 52
    openskos.model.broker = Object.create(commonBroker);
    //var d = new Date();
    //console.log("Created broker at " + d.getUTCHours() + ":"+d.getUTCMinutes()+":"+ d.getUTCSeconds());
    var broker = function ($, config) {

      var private_methods = {
        getSelectedFieldsByFacets: function (selectedFieldFacets, facetFieldMap) {
          var retval = [];
          var i;
          for (i = 0; i < selectedFieldFacets.length; i++) {
            var nextArray = facetFieldMap[selectedFieldFacets[i]].split(",");
            retval = retval.concat(nextArray);
          }

          return retval;
        },
        makeWordList: function (terms) {
          var retval = [];
          var help = terms.split(" ");
          var i;
          for (i = 0; i < help.length; i++) {
            //console.log(help[i],trim());
            var nextTerm = help[i].trim();
            retval.push(nextTerm);
          }

          return retval;
        },
        // begin of query is not empty only for a SOLR query, when API is bypassed
        buildQueryString: function (query, beginOfQuery) {
          var retVal;

          // given space-separated string of terms, returns a list of the initial terms, which surronded by stars if query.matchingtype='partofword'
          var terms = private_methods.makeWordList(query.word);
          // make this list of search fields from query's selected facets
          var facetFieldMap = openskos.config.searchfieldsmap;
          var selectedFields = private_methods.getSelectedFieldsByFacets(query.selectedFieldFacets, facetFieldMap);
          //for each term "terms[i]" make the string with possible pairs "feildname:terms[i]"
          // termInFields is the list of all such strings
          var i;
          var termInFields = [];
          for (i = 0; i < terms.length; i++) {
            termInFields.push(private_methods.buildBinopQueryFieldPart(selectedFields, "or", terms[i], query.matchingtype));
          }
          // if the search mode is OR then the strings-element of the list termInfields must be concatenated with Or, otherwise with AND
          var termClause = private_methods.buildBinopQueryStrWithPrefix(termInFields, query.orand, "");

          // beginOfQuery is "class:Concept" with the list of admissible schemata, collections and tenants for SOLR query
          if (termClause !== "") {
            retVal = beginOfQuery + termClause;
          }
          ;
          if (query.status !== undefined) {
            var l = query.status.length;
            if (l > 0) {
              retVal = retVal + " AND (";
              var j;
              for (j = 0; j < l - 1; j++) {
                retVal = retVal + 'status:' + query.status[j] + ' OR ';
              }
              retVal = retVal + 'status:' + query.status[l - 1] + ')';
            }
          }
          return retVal;
        },
        buildBinopQueryStrWithPrefix: function (atoms, binop, prefix) {
          if (atoms.length > 0) {
            var retval = "(";
            var binopStr;
            if (binop === "and") {
              binopStr = " AND ";
            } else {
              binopStr = " OR ";
            }
            ;
            var prefixStr;
            if (prefix === "") {
              prefixStr = "";
            } else {
              prefixStr = prefix + ":";
            }
            ;
            var i;
            for (i = 0; i < atoms.length - 1; i++) {
              var repl = atoms[i].replace("http\:", "http\\:");
              retval = retval + prefixStr + repl + binopStr; // replace : with \:
            }
            ;
            retval = retval + prefixStr + atoms[atoms.length - 1].replace("http\:", "http\\:") + ")";
            //console.log(retval);
            return retval;
          } else {
            return "";
          }
        },
        buildBinopQueryFieldPart: function (prefices, binop, term, matchingtype) {
          var termStr = term.replace("http\:", "http\\:");
          if (prefices.length > 0) {
            var retval = "(";
            var binopStr;
            if (binop === "and") {
              binopStr = " AND ";
            } else {
              binopStr = " OR ";
            }
            ;
            var i;
            var prefixStr;
            //console.log(prefices);
            //console.log(matchingtype);
            if (matchingtype === "wholeword") { // search for token
              for (i = 0; i < prefices.length - 1; i++) {
                if (prefices[i] === "") {
                  prefixStr = "";
                } else {
                  prefixStr = "t_" + prefices[i] + ":";
                }
                retval = retval + prefixStr + termStr + binopStr; // replace : with \:
                //console.log(retval);
              }
              if (prefices[prefices.length - 1] === "") {
                prefixStr = "";
              } else {
                prefixStr = "t_" + prefices[prefices.length - 1] + ":";
              }
              retval = retval + prefixStr + termStr + ")";
            } else { 
              for (i = 0; i < prefices.length - 1; i++) {
                var prefixStr;
                if (prefices[i] === "") {
                  prefixStr = "*";
                } else {
                  prefixStr = prefices[i] + ":*";
                }
                if (termStr === "") {
                  retval = retval + prefixStr + binopStr;
                } else {
                  retval = retval + prefixStr + termStr + "*" + binopStr;
                }
              }
              if (prefices[prefices.length - 1] === "") {
                prefixStr = "*";
              } else {
                prefixStr = prefices[prefices.length - 1] + ":*";
              }
              if (termStr === "") {
                retval = retval + prefixStr + ")";
              } else {
                retval = retval + prefixStr + termStr + "*)";
              }

            }
            //console.log("Build for Term:");
            //console.log(retval);
            return retval;
          } else {
            return "";
          }
        },
        getConceptsAPI: function (queryString, begin, rows, query) {
          var sorting = query.sortingfield + " " + query.sortingorder, mainjqxhr;
          var params = {csurl: query.backend + '/concept', q: queryString, sorts: sorting, format: "json", start: begin, rows: rows};
          if (query.conceptScheme !== undefined) {
            var obj = {conceptScheme: query.conceptScheme.join(" ")};
            jQuery.extend(params, obj);
          }
          if (query.skosCollections !== undefined) {
            var obj = {skosCollection: query.skosCollections.join(" ")};
            jQuery.extend(params, obj);
          }
          if (query.tenants !== undefined) {
            var obj = {tenantUri: query.tenants.join(" ")};
            jQuery.extend(params, obj);
          }
          if (query.sets !== undefined) {
            var obj = {sets: query.sets.join(" ")};
            jQuery.extend(params, obj);
          }
          if (query.status !== undefined) {
            var obj = {status: query.status.join(" ")};
            jQuery.extend(params, obj);
          }
          //console.log(params.status);
          //console.log(params.q);
          var retval = {}, ajaxoptions = {
            method: 'GET',
            url: config.proxyurl,
            async: false,
            data: params,
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            success: function (data, xhr) {
              retval = {
                xhr: xhr,
                data: data,
                status: config.success
              };
              $("#loading").hide();
              $("#concepts-header").show();
              $("#error-message").hide();
            },
            error: function (jqxhr, textStatus, errorThrown) {
             $("#loading").hide();
             $("#concepts-header").hide();
            }
          };
          
            mainjqxhr = $.ajax(ajaxoptions);
              
            return retval;
        },
        getConceptDetails: function (params) {

          var retval = {}, ajaxoptions = {
            method: 'GET',
            url: config.proxyurl,
            async: false,
            data: params,
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            success: function (data, xhr) {
              retval = {
                xhr: xhr,
                data: data,
                status: config.success
              };
              //console.log("In Broker +success+: status: "+retval.status);
              //console.log("In Broker +success+: data: "+JSON.stringify(retval.data));
              //console.log("In Broker +success+: xhr: "+retval.xhr);
              $("#error-message").hide();
            },
            error: function (xhr) {
              //console.log(":( xhr: status text " + xhr.statusText);
              //console.log(":( xhr: status " + xhr.status);
              $("#loading").hide();
            }
          };
          $.ajax(ajaxoptions);
          //console.log("In Broker +retval+: status: " + retval.status);
          //console.log("In Broker  ajax returns data: " + JSON.stringify(retval.data));
          return retval;
        },
        getRelations: function (query) {
          var relList;
          if (query.relation === undefined) {
            relList = query.allrelations;
          } else {
            relList = query.relation.join(",");
          }
          ;
          var params = {csurl: query.backend + '/relation', id: relList, members: 'true'};
          console.log(params.csurl);
          if (query.sourceSchemata !== undefined) {
            if (query.sourceSchemata.length > 0) {
              var obj = {sourceSchemata: query.sourceSchemata.join(",")};
              jQuery.extend(params, obj);
            }
          }

          if (query.targetSchemata !== undefined) {
            if (query.targetSchemata.length > 0) {
              var obj = {targetSchemata: query.targetSchemata.join(",")};
              jQuery.extend(params, obj);
            }
          }

          var retval = {}, ajaxoptions = {
            method: 'GET',
            url: config.proxyurl,
            async: false,
            data: params,
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            success: function (data, xhr) {
              retval = {
                xhr: xhr,
                data: data,
                status: config.success
              };
              //console.log("In Broker +success+: status: "+retval.status);
              //console.log("In Broker +success+: data: "+JSON.stringify(retval.data));
              //console.log("In Broker +success+: xhr: "+retval.xhr);
              $("#loading").hide();
              $("#relations-header").show();
              $("#error-message").hide();
            },
            error: function (xhr) {
              $("#loading").hide();
              $("#relations-header").hide();
            }
          };
          $.ajax(ajaxoptions);
          //console.log("In Broker +retval+: status: " + retval.status);
          //console.log("In Broker  ajax returns data: " + JSON.stringify(retval.data));
          return retval;
        },
        //getConceptsForPage: function (response, word, page, itemsperpage) {
        getConceptsForPage: function (response, word) {
          var allConcepts = response["docs"];
          var numFound = response["numFound"];
          //var start = (page - 1) * itemsperpage;
          //var endNotIncl = start + itemsperpage;
          //var retConcepts = allConcepts.slice(start, endNotIncl);
          var retConcepts = allConcepts;
          var retVal = {
            concepts: retConcepts,
            terms: word,
            numFound: numFound,
            status: config.success
          };
          return retVal;
        },
        prepareConceptDetailsData: function (value, licens, licenseRef) {
          var keys = Object.keys(value);
          var data = [];
          var i;
          for (i = 0; i < keys.length; i++) {
            var vl = openskos.utilities.getValueByKey(value, keys[i]);
            var fl = keys[i];
            var hl = private_methods.isFieldHighlighted(fl);
            var ref = private_methods.isReferenceToRelatedConcept(fl);
            if (vl instanceof Array) {
              var j;
              for (j = 0; j < vl.length; j++) {
                var struct = private_methods.prepareField(fl, vl[j], hl, ref);
                data.push(struct);
              }
            } else {
              var struct = private_methods.prepareField(fl, vl, hl, ref);
              data.push(struct);
            }
          }
          data.push({field: "license", hl: false, value: licens});
          data.push({field: "licenseRef", hl: false, value: licenseRef});
          var retval = {
            concept: data,
            status: config.success
          };
          return retval;
        },
        isFieldHighlighted: function (fl) {
          var j;
          for (j = 0; j < config.highlightablefields.length; j++) {
            if (fl.startsWith(config.highlightablefields[j])) {
              return true;
            }
          }
          return false;
        },
        isReferenceToRelatedConcept: function (fl) {
          var j;
          for (j = 0; j < openskos.allrelations.length; j++) {
            if (fl.startsWith(openskos.allrelations[j])) {
              return true;
            }
          }
          return false;
        },
        prepareField: function (fl, vl, hl, ref) {
          if (typeof vl["uri"] !== 'undefined') {
            vl = vl["uri"];
          }
          ;
          var struct = {
            field: fl,
            hl: hl,
            ref: ref,
            value: vl
          };
          return struct;
        }
      };

      return {
        retrieveConcepts: function (query) {
          var apiquery = private_methods.buildQueryString(query, "");
          var start = (query.page -1)*config.itemsperpage;
          var rows = config.itemsperpage;
          //var response = private_methods.getConceptsAPI(apiquery, 0, config.maxitems, query);
          var response = private_methods.getConceptsAPI(apiquery, start, rows, query);
          var retVal;
          if (response.status === config.success) {
            retVal = private_methods.getConceptsForPage(response.data["response"], query.word);
            //retVal = private_methods.getConceptsForPage(response.data["response"], query.word, query.page, config.itemsperpage);
          } else {
            retVal = response;
          }
          return retVal;
        },
        retrieveConceptDetailsViaUUID: function (uuid, backend) {
          var params = {csurl: backend + '/concept/' + uuid + ".json"};
          var response = private_methods.getConceptDetails(params);
          var license = this.retrieveConceptLicenseViaUUID(uuid);
          var retVal;
          if (response.status === config.success) {
            var result = response.data;
            retVal = private_methods.prepareConceptDetailsData(result, license.name, license.ref);
          } else {
            retVal = response;
          }
          return retVal;
        },
        retrieveConceptDetailsViaUri: function (uri, backend) {
          var params = {csurl: backend + '/concept/', id: uri, format: "json"};
          var response = private_methods.getConceptDetails(params);
          var license = this.retrieveConceptLicenseViaUUID(uri);
          var retVal;
          if (response.status === config.success) {
            var result = response.data["response"]["docs"][0];
            retVal = private_methods.prepareConceptDetailsData(result, license.name, license.ref);
          } else {
            retVal = response;
          }
          return retVal;
        },
        retrieveConceptLicenseViaUUID: function (uuid) {
          ;
          var retval = {
            name: config.defaultLicense,
            ref: config.defaultLicenseReference
          };
          return retval;
        },
        retrieveConceptLicenseViaURI: function (uri) {
          ;
          var retval = {
            name: config.defaultLicense,
            ref: config.defaultLicenseReference
          };
          return retval;
        },
        retrieveRelations: function (query) {
          var retVal = private_methods.getRelations(query);
          return retVal;
        }
      };
    };

    $.each(broker($, openskos.config), function (k, v) {
      openskos.model.broker[k] = v;
    });

    return openskos;

  }(jQuery, window.openskos || {})); // window.nederlab: zie http://stackoverflow.com/questions/21507964/jslint-out-of-scope
