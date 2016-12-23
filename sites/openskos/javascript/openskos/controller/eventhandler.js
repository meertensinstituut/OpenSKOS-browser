/*globals jQuery, commonEventhandler, nederlab: true */
/*jslint browser: true, indent: 2, todo: true, unparam: true, devel: true */
var openskos = (function ($, openskos) {
    "use strict";

    // Zie Javascript: The good parts, p. 52
    openskos.controller.eventhandler = Object.create(commonEventhandler);

    var eventhandler = function ($, config) {
        var private_methods = {
          
            handleHomeFormSubmit: function () {
                var searchform = $("#vis_remotebackends");
                searchform.on("submit", function (e) {
                    e.preventDefault();
                    var getstring = $(this).serialize() ;
                    /**
                     * FINAL FORM SUBMIT
                     */
                    window.location.href = config.workspaceurl + "?action=tovocabularies&" + getstring;
                });

            },
          
            handleFormSubmitOpenskos: function () {
                var searchform = $("#openskos-complexsearch");
                searchform.on("submit", function (e) {
                    e.preventDefault();
                    var getstring = $(this).serialize() + "&" + $("#refine-results-component-openskos").serialize();
                    /**
                     * FINAL FORM SUBMIT
                     */
                    window.location.href = config.workspaceurl + "?" + getstring;
                });
               
            },
            
            handleRelationFormSubmitOpenskos: function () {
                var searchform = $("#openskos-relations");
                searchform.on("submit", function (e) {
                    e.preventDefault();
                    var getstring = $(this).serialize() + "&" + $("#refine-relations-results-component-openskos").serialize();
                    /**
                     * FINAL FORM SUBMIT
                     */
                    window.location.href = config.workspaceurl + "?" + getstring;
                });

            },
            
            handleFormulierelementenOpenskos: function () {
                
                $("#searchform-top-accordion").accordion(
                        {
                            header: "div.accordion-header",
                            collapsible: true,
                            active: false,
                            heightStyle: "content"
                        }
                );
                
                private_methods.addVerfijningEventhandlersOpenskos();
                private_methods.addRelationsVerfijningEventhandlersOpenskos();
            },
            /**
             * Dit is de "verfijnbalk" links van de zoekresultaten
             */
            addVerfijningEventhandlersOpenskos: function () {
                var refineresultscomponent = $("#refine-results-component-openskos");
                $("input[name=schemata\\[\\]]", refineresultscomponent).click(function () {
                    $("#openskos-complexsearch").submit();
                });
                
                $("input[name=status\\[\\]]", refineresultscomponent).click(function () {
                    $("#openskos-complexsearch").submit();
                });
                $("input[name=skoscollections\\[\\]]", refineresultscomponent).click(function () {
                    $("#openskos-complexsearch").submit();
                });
                $("input[name=tenants\\[\\]]", refineresultscomponent).click(function () {
                    $("#openskos-complexsearch").submit();
                });
                $("input[name=sets\\[\\]]", refineresultscomponent).click(function () {
                    $("#openskos-complexsearch").submit();
                });
            },
            
             addRelationsVerfijningEventhandlersOpenskos: function () {
                var refineresultscomponent = $("#refine-relations-results-component-openskos");
                $("input[name=relations\\[\\]]", refineresultscomponent).click(function () {
                    $("#openskos-relations").submit();
                });
                $("input[name=sourceSchemata\\[\\]]", refineresultscomponent).click(function () {
                    $("#openskos-relations").submit();
                });
                $("input[name=targetSchemata\\[\\]]", refineresultscomponent).click(function () {
                    $("#openskos-relations").submit();
                });
            }
        };

        return {
            addEventHandlers: function (formquery) {
                /**
                 * http://wiki.apache.org/httpd/NameBasedSSLVHostsWithSNI
                 * IE op Windows XP ondersteunt geen SNI (Server Name Indication) en certificaat voor nederlab.nl werkt
                 * op die manier (maakt gebruik van certificaat van meertens.knaw.nl)
                 * http://stackoverflow.com/questions/20181138/is-there-any-way-to-test-if-a-user-is-on-windows-xp
                 * waarschuwing 1 maal tonen onder Windows XP
                 */
                //console.log(formquery);
                $("#xp-close").click(function () {
                    $("#xp-warning").hide();
                    $.cookie('xp_warning', 'true', {expires: 1, path: '/'});
                });
                $("#error-message").click(function () {
                    $(this).hide();
                });
                
                $("input[name=backend]").click(function () {
                    $(this).submit();
                });
                
                private_methods.handleHomeFormSubmit();
                private_methods.handleFormulierelementenOpenskos();
                private_methods.handleFormSubmitOpenskos();
                private_methods.handleRelationFormSubmitOpenskos();
                
            }
        };
    };

    $.each(eventhandler($, openskos.config), function (k, v) {
        openskos.controller.eventhandler[k] = v;
    });

    return openskos;
}(jQuery, window.openskos || {}));  // window.nederlab: zie http://stackoverflow.com/questions/21507964/jslint-out-of-scope