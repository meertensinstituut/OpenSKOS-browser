  /*globals jQuery, commonController, nederlab: true, console, $ */
  /*jslint browser: true, indent: 2, plusplus: true, regexp: true, todo: true, unparam: true */
  var openskos = (function ($, openskos) {
    "use strict";

    // Zie Javascript: The good parts, p. 52
    openskos.controller = Object.create(commonController);
    var hits, terms;
    var controller = function ($, config) {
      var private_methods = {
        doSearch: function (formquery, page) {
          var result;
          //console.log(formquery["fields"]);
          var selectedFields = formquery["fields"];
          if (selectedFields === undefined) {
            selectedFields = Object.keys(openskos.config.searchfieldsmap);
          }

          if (formquery["sortfield"] === undefined) {
            formquery["sortfield"] = 'score';
          }
          if (formquery["sortorder"] === undefined) {
            formquery["sortorder"] = 'desc';
          }
          var query = {
            backend: formquery["backend"],
            word: formquery["terms"],
            selectedFieldFacets: selectedFields,
            orand: formquery["searchtermsmode"],
            matchingtype: formquery["matchingtype"],
            status: formquery["status"],
            conceptScheme: formquery["schemata"],
            skosCollections: formquery["skoscollections"],
            tenants: formquery["tenants"],
            sets: formquery["sets"],
            sortingfield: formquery["sortfield"],
            sortingorder: formquery["sortorder"],
            page: page
          };
          result = openskos.model.broker.retrieveConcepts(query);
          return result;
        },
        doRelationSearch: function (formquery, page) {
          var result;
          var query = {
            backend: formquery["backend"],
            relation: formquery["relations"],
            sourceSchemata: formquery["sourceSchemata"],
            targetSchemata: formquery["targetSchemata"],
            allrelations: formquery["allrelations"],
            page: page
          };
          //console.log(query.allrelations);
          result = openskos.model.broker.retrieveRelations(query);
          return result;
        },
        handleShowResults: function (formquery, page) {
          $("#table-concepts").empty();
          $("#error-message").empty();
          $("#concepts-header").hide();
          $("#loading").show();
          terms = formquery["terms"];
          hits = terms.split(" ");
          var result = private_methods.doSearch(formquery, page);
          if (result.status === config.success) {
            openskos.view.displayConcepts(result, hits, terms, formquery.fields, formquery.matchingtype);
            $('.pagination').data("executeOnSelect", false);
            private_methods.addPagination(result.numFound);
            private_methods.handleHashChange();
          } else {
            openskos.view.displayMessage(result);
          }
        },
        handleShowConceptDetails: function (formquery) {
          //console.log(formquery);
          terms = formquery["terms"];
          hits = null;
          if (terms !== null && terms !== undefined) {
            hits = terms.split(" ");
          }
          var result = null;
          var uuid = formquery["uuid"];
          if (uuid !== null && uuid !== undefined) {
            result = openskos.model.broker.retrieveConceptDetailsViaUUID(uuid, formquery["backend"]);
          } else {
            var uri = formquery["uri"];
            if (uri !== null && uri !== undefined) {
              result = openskos.model.broker.retrieveConceptDetailsViaUri(uri, formquery["backend"]);
            } else {
              result = {
                element: $("#error-message"),
                status: "noID",
                xhr: {},
                string: "Error from broker service: no uuid or uri of a concept is given",
                klasse: "error"
              };
            }
          }
          //console.log(result);
          if (result.status === config.success) {
            openskos.view.displayConceptDetails(result.concept, hits);
          } else {
            openskos.view.displayMessage(result);
          }
        },
        handleShowRelations: function (formquery, page) {
          $("#table-relations").empty();
          $("#error-message").empty();
          $("#relations-header").hide();
          $("#loading").show();
          openskos.alldarkcolors = formquery["alldarkcolors"].split(",");
          openskos.alllightcolors = formquery["alllightcolors"].split(",");
          var result = private_methods.doRelationSearch(formquery, page);
          if (result.status === config.success) {
            if (formquery["demomode"] === "table") {
              openskos.view.displayRelations(result.data);
              //$('.pagination').data("executeOnSelect", false);
              //private_methods.addPagination(result.numFound);
              //private_methods.handleHashChange();
            } else {
              openskos.view.displayRelationsAsGraph(result.data);
            }
          } else {
            openskos.view.displayMessage(result);
          }
        },
        ////  ???
        doPageReload: function (query) {
          var url = openskos.utilities.cloneObject(config.workspaceurl), savedaction = $("#hiddenaction").text();
          url += "?" + openskos.utilities.http_build_query(query);
          url = openskos.utilities.updateQueryString("action", savedaction, url);
          window.location.href = url;
        },
        // must be used in pagination
        handleHashChange: function () {
          // om back button in zoekresultaten te laten werken
          $(window).bind("hashchange", function () {
            var currentpage = private_methods.getCurrentPage(), paginationpage = $("div.pagination a.current").data("page");
            if (parseInt(currentpage, 10) !== parseInt(paginationpage, 10)) {
              window.location.reload(true);
            }
          });
        },
        getCurrentPage: function () {
          var startpage = window.location.hash, page;
          if (startpage.match(/page/)) {
            page = startpage.substr(5); // stukje na #page
          } else {
            page = 1;
          }
          return page;
        },
        /**
         * pagination plugin: https://github.com/infusion/jQuery-paging
         * @param type
         * @param numberofhits
         */
        addPagination: function (numberofhits) {
          //noinspection JSUnusedGlobalSymbols
          $(".pagination").paging(numberofhits, {
            format: '[ < nnncnnnnn > ]',
            perpage: 10,
            page: private_methods.getCurrentPage(),
            onSelect: function (page) {
              var paginationelem = $(".pagination"), formquery;
              // deze code moet alleen uitgevoerd worden als er daadwerkelijk op een paging-link geklikt is
              // anders wordt direct na laden de zoekopdracht nog een keer uitgevoerd
              // na laden van een pagina uit een zoekopdracht in het formulier staat executeOnSelect op false
              // en wordt onderstaande code dus niet uitgevoerd
              if (paginationelem.data("executeOnSelect")) {
                formquery = JSON.parse($("#hiddenquery").text());
                $("#table-concepts").empty();
                $("#error-message").empty();
                $("#concepts-header").hide();
                $("#loading").show();
                var result = private_methods.doSearch(formquery, page);
                //console.log(JSON.stringify(result));
                if (result.status === config.success) {
                  openskos.view.displayConcepts(result, hits, terms, formquery.fields, formquery.matchingtype);
                  window.location.hash = "#page" + page;
                  // Return code indicates if the link of the clicked format element should be followed (otherwise only the click-event is used)
                  return false;
                } else {
                  openskos.view.displayMessage(result);
                }
              }
              // na eerste keer laden werken de paging-links pas
              // onderstaande code wordt alleen direct na  na laden van een pagina
              // uit een zoekopdracht in het formulier uitgevoerd
              // zodat daarna de paging-links werken
              paginationelem.data("executeOnSelect", true);
            },
            onFormat: function (type) {
              switch (type) {
                case 'block': // n and c
                  // huidige pagina
                  if (this.page === this.value) {
                    return '<a class="current">' + this.value + '</a>';
                  }
                  return '<a class="paging-page">' + this.value + '</a>';
                case 'next': // >
                  return '<a class="paging-next">&gt;</a>';
                case 'prev': // <
                  return '<a class="paging-prev">&lt;</a>';
                case 'first': // [
                  return '<a class="paging-first">&lt;&lt;</a>';
                case 'last': // ]
                  return '<a class="paging-last">&gt;&gt;</a>';
              }
            }
          });
        },
        handleAjaxErrors: function () {
          $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
            openskos.utilities.handleAjaxErrors(event, jqxhr, settings, thrownError);
          });
        }
      };

      return {
        doPageReload: function (query) {
          private_methods.doPageReload(query);
        },
        init: function () {
          var formquery,
            queryparams = openskos.utilities.getQueryParams({}),
            action;
          $.views.settings.delimiters("[[", "]]");
          if (openskos.utilities.checkForXP()) {
            $("#xp-warning").show();
          }
          formquery = $("#hiddenquery").text();
          if (formquery.length > 0) {
            formquery = JSON.parse(formquery);
            //console.log(JSON.stringify(formquery));
          }
          if (!openskos.utilities.isGiven(formquery["sortorder"])) {
            formquery["sortorder"] = "desc";
          }
          private_methods.handleAjaxErrors();
          action = (queryparams !== undefined && queryparams.action !== undefined) ? queryparams.action : "";
          openskos.allrelations = (queryparams !== undefined && queryparams.allrelations !== undefined) ? queryparams.allrelations.split(",") : [];
          openskos.allschemata = (queryparams !== undefined && queryparams.allschemata !== undefined) ? queryparams.allschemata.split(",") : [];
          openskos.controller.eventhandler.addEventHandlers(formquery);
          switch (action) {
            case "":
              //console.log('Action: '+action);
              //console.log("Controller: I'm in empty action now: " + $("#hiddenquery").text());
              break;

            case "showresults":
              var defaultStartPage = 1;
              private_methods.handleShowResults(formquery, defaultStartPage);
              break;

            case "conceptdetails":
              private_methods.handleShowConceptDetails(formquery);
              break;

            case "showrelations":
              var defaultStartPage = 1;
              //console.log(formquery);
              private_methods.handleShowRelations(formquery, defaultStartPage);
              break;
            default:
              break;
          }

        }
      };
    };

    $.each(controller($, openskos.config), function (k, v) {
      openskos.controller[k] = v;
    });

    return openskos;

  }(jQuery, window.openskos || {})); // window.nederlab: zie http://stackoverflow.com/questions/21507964/jslint-out-of-scope
