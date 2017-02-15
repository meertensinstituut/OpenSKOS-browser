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
        buildQueryString: function (query) {
          var terms = query.word.split(" "), i, binopStr, retval = "", matching="";
          if (query.matchingtype==='partofword') {
            matching="*";
          }
          if (terms.length === 1) {
            return matching+terms[0].trim()+matching;
          }
          if (query.orand === "and") {
            binopStr = " AND ";
          } else {
            binopStr = " OR ";
          }
          for (i = 0; i < terms.length - 1; i++) {
            retval += matching+terms[i].trim() + matching+ binopStr;
          }
          retval += matching+terms[terms.length - 1].trim()+matching;
          return retval;
        },
        getConceptsAPI: function (queryString, begin, rows, query) {
          var sorting = query.sortingfield + " " + query.sortingorder, mainjqxhr, obj_scheme, obj_coll,
            obj_tenant, obj_set, obj_status, obj_matching, obj_label, obj_properties, properties_str;
          var params = {csurl: query.backend + '/concept', q: queryString, sorts: sorting, format: "json", start: begin, rows: rows};
          if (query.conceptScheme !== undefined) {
            obj_scheme = {scheme: query.conceptScheme.join(" ")};
            jQuery.extend(params, obj_scheme);
          }
          if (query.skosCollections !== undefined) {
            obj_coll = {skosCollection: query.skosCollections.join(" ")};
            jQuery.extend(params, obj_coll);
          }
          if (query.tenants !== undefined) {
            obj_tenant = {tenantUri: query.tenants.join(" ")};
            jQuery.extend(params, obj_tenant);
          }
          if (query.sets !== undefined) {
            obj_set = {set: query.sets.join(" ")};
            jQuery.extend(params, obj_set);
          }
          if (query.status !== undefined) {
            obj_status = {status: query.status.join(" ")};
            jQuery.extend(params, obj_status);
          }

          if (query.matchingtype !== undefined) {
            var val = false;
            if (query.matchingtype === 'wholeword') {
              val = true;
            }
            obj_matching = {wholeword: val};
            jQuery.extend(params, obj_matching);
          }

          if (query.selectedFieldFacets !== null) {
            if (query.selectedFieldFacets.indexOf('Labels') > -1) {
              obj_label = {label: config.searchfieldsmap['Labels']};
              jQuery.extend(params, obj_label);
            }

            if (query.selectedFieldFacets.indexOf('DefaultDocumentationFields') > -1) {
              properties_str = config.searchfieldsmap['DefaultDocumentationFields'];
              if (query.selectedFieldFacets.indexOf('Definition') > -1) {
                properties_str += " " + config.searchfieldsmap['Definition'];
              }
              obj_properties = {properties: properties_str};
              jQuery.extend(params, obj_properties);
            } else {
              if (query.selectedFieldFacets.indexOf('Definition') > -1) {
                obj_properties = {properties: config.searchfieldsmap['Definition']};
                jQuery.extend(params, obj_properties);
              }
            }
          }
          
          console.log(params);
          
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
          console.log(retval);
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
          var apiquery = private_methods.buildQueryString(query);
          var start = (query.page - 1) * config.itemsperpage;
          var rows = config.itemsperpage;
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
