  /*globals jQuery, commonView, nederlab: true */
  /*jslint browser: true, indent: 2, plusplus: true, unparam: true, todo: true, regexp: true, devel: true */
  var openskos = (function ($, openskos) {
    "use strict";

    // Zie Javascript: The good parts, p. 52
    openskos.view = Object.create(commonView);
    openskos.d3 = Object.create(d3);
    var view = function ($, config) {
      var private_methods = {
        filteredHighlight: function (elem, word, filter) {
          var matches = elem.text().match(filter);
          if (matches !== null) {
            elem.html(elem.text().replace(filter, '<span class=highlight>' + matches[0] + '</span>'));
          }
        },
        mapConceptData: function (value, hits, terms) {
          var keys = Object.keys(value);
          //console.log(Object.keys(value));
          var retval = [];
          //console.log(value);
          retval.push({
            uuid: openskos.utilities.getValueByKey(value, "uuid"),
            even: false,
            prefLabel: openskos.utilities.getMultiValueByKeyPrefix(value, 'prefLabel', ',', keys),
            definition: openskos.utilities.getMultiValueByKeyPrefix(value, "definition", ',', keys),
            status: openskos.utilities.getValueByKey(value, "status"),
            modified: openskos.utilities.getValueByKey(value, "modified_timestamp"),
            terms: terms
          });
          return retval;
        },
        mapConceptDetailsData: function (val) {
          var retval = [];
          retval.push({
            even: false,
            hl: val.hl,
            ref: val.ref,
            field: val.field,
            fvalue: val.value
          });
          return retval;
        },
        mapRelationData: function (value) {
          var retval = [];
          var subject = openskos.utilities.getValueByKey(value, "s");
          var object = openskos.utilities.getValueByKey(value, "o");
          //console.log(value);
          retval.push({
            even: false,
            subjectLabel: openskos.utilities.getValueByKey(subject, "prefLabel"),
            subjectUuid: openskos.utilities.getValueByKey(subject, "uuid"),
            subjectSchema: openskos.utilities.getValueByKey(subject, "schema_title"),
            property: openskos.utilities.getValueByKey(value, "p"),
            objectLabel: openskos.utilities.getValueByKey(object, "prefLabel"),
            objectUuid: openskos.utilities.getValueByKey(object, "uuid"),
            objectSchema: openskos.utilities.getValueByKey(object, "schema_title"),
          });
          return retval;
        },
        // used for graph mode 
        mapRelationDataToLinks: function (rels) {
          var i;
          var links = [];
          var nodes_helper = [];
          var nodes = [];
          for (i = 0; i < rels.length; i++) {
            var s = rels[i].s;
            var p = rels[i].p;
            var o = rels[i].o;
            var indexSSchema = openskos.allschemata.indexOf(s.schema_uri);
            //console.log(openskos.allschemata);
            if (indexSSchema < 0) {
              throw "The schema " + s.schema_uri + " (referred as a source schema) in not in the list of admissible schemata";
            }
            var indexOSchema = openskos.allschemata.indexOf(o.schema_uri);
            if (indexSSchema < 0) {
              throw "The schema " + o.schema_uri + " (referred as a target schema) in not in the list of admissible schemata";
            }


            var pIndex = openskos.allrelations.indexOf(p);
            if (pIndex < 0) {
              throw "The relation " + p + " in not in the list of admissible relations for this javascript";
            }

            var link = {source: s.uuid + ":" + indexSSchema, target: o.uuid + ":" + indexOSchema, typeIndex: pIndex, sourcePrefLabel: s.prefLabel, targetPrefLabel: o.prefLabel, sourceSchema: indexSSchema, targetSchema: indexOSchema, sourceUUID: s.uuid, targetUUID: o.uuid};
            links.push(link);
            if (nodes_helper.indexOf(link.source) === -1) {
              nodes_helper.push(link.source);
              nodes.push({name: link.source, uuid: link.sourceUUID, color: link.sourceSchema, label: link.sourcePrefLabel});
            }
            if (nodes_helper.indexOf(link.target) === -1) {
              nodes_helper.push(link.target);
              nodes.push({name: link.target, uuid: link.targetUUID, color: link.targetSchema, label: link.targetPrefLabel});
            }
          }
          ;
          var equivalences = private_methods.findEquivalences(nodes);
          return links.concat(equivalences);
        },
        findEquivalences: function (nodes) {
          var retVal = [];
          for (var i = 0; i < nodes.length; i++) {
            for (var j = i + 1; j < nodes.length; j++) {
              if (nodes[i].uuid === nodes[j].uuid) {
                var bro = {source: nodes[i].name, target: nodes[j].name, typeIndex: -1, sourcePrefLabel: nodes[i].label, targetPrefLabel: nodes[j].label, sourceSchema: nodes[i].color, targetSchema: nodes[j].color};
                retVal.push(bro);
                var bro_2 = {source: bro.target, target: bro.source, typeIndex: -1, sourcePrefLabel: bro.targetPrefLabel, targetPrefLabel: bro.sourcePrefLabel, sourceSchema: bro.targetSchema, targetSchema: bro.sourceSchema};
                retVal.push(bro_2);
                break; // use transitivity of equivalence to avoid too much equivalence-arcs on the graph
              }
            }

          }
          return retVal;
        }

      };



      return {
        displayMessage: function (options) {
          var jsonobj, message;
          if (options.element !== undefined) {
            message = options.string;
            if (options.xhr !== undefined) {
              jsonobj = openskos.utilities.isJsonString(options.xhr.responseText);
              if (jsonobj !== false) {
                message = message + ": " + jsonobj.error;
              } else {
                message = message + ": " + options.xhr.responseText;
              }
            }
            if (message !== "") {
              options.element.html(message);
              options.element.addClass("message " + options.klasse);
              if (options.duration !== undefined && options.duration !== "") {
                options.element.fadeIn(400);
                options.element.delay(options.duration).fadeOut(400);
              } else {
                options.element.show();
              }
            }
          }
        },
        displayConcepts: function (result, hits, terms, searchfileds, matchingtype) {
          var announce = $("#foundItems"),
            htmlAnnounce = "Found " + result.numFound + " concepts",
            conceptresultlist = $("#table-concepts"),
            template = $.templates("#concept-template"),
            htmlOutput = '',
            i = 1,
            concepts = result.concepts,
            filter = "";
          announce.html(htmlAnnounce);

          $.each(concepts,
            function (key, value) {
              var templateinput = private_methods.mapConceptData(value, hits, terms);
              if (i % 2 === 0) {
                templateinput[0].even = true;
              }
              htmlOutput += template.render(templateinput);
              i++;
            });

          conceptresultlist.html(htmlOutput);
          $.each(hits, function (key, value) {
            if (matchingtype === 'wholeword') {
              filter = new RegExp('\\b' + value + '\\b', 'gi');
              if (searchfileds.indexOf('Labels') > -1) {
                $('.prefLabel').each(function (index) {
                  private_methods.filteredHighlight($(this), value, filter);
                });
              }
              if (searchfileds.indexOf('Definition') > -1) {
                $('.definition').each(function (index) {
                  private_methods.filteredHighlight($(this), value, filter);
                });
              }
            } else {
              if (searchfileds.indexOf('Labels') > -1) {
                $('.prefLabel').each(function (index) {
                  $(this).highlight(value);
                });
              }
              if (searchfileds.indexOf('Definition') > -1) {
                $('.definition').each(function (index) {
                  $(this).highlight(value);
                });
              }
            }
          });
        },
        displayConceptDetails: function (conceptdata, hits) {
          var conceptdetails = $("#concept-details");
          var htmlOutput = '<tr id="tableheader-openskos"><td> Field </td> <td class="detail-value-openskos"> Value </td></tr>';
          htmlOutput += '<tr> <td class="row-padding-openskos"></td><td class="row-padding-openskos"><td class="row-padding-openskos"></td></tr>';

          var i = 1;
          $.each(conceptdata,
            function (key, value) {
              var template = $.templates("#concept-details-template");
              var templateinput = private_methods.mapConceptDetailsData(value);
              if (i % 2 === 0) {
                templateinput[0].even = true;
              }
              htmlOutput += template.render(templateinput);
              i++;
            });

          conceptdetails.html(htmlOutput);
          if (hits !== null) {
            $.each(hits, function (key, value) {
              $(".detail-value-openskos-hl").highlight(value);
            });
          }
        },
        displayRelations: function (result) {
          //console.log(result[0]);
          // announcing # found concepts
          var announce = $("#foundItems");
          var htmlAnnounce = "Found " + result.length + " relations";
          announce.html(htmlAnnounce);
          var relationslist = $("#table-relations"); //picks up the body of the table
          var htmlOutput = '';
          // listing concepts
          var i = 1;
          var rels = result;
          $.each(rels,
            function (key, value) {
              //console.log("Current-value " + JSON.stringify(value));
              var template = $.templates("#relation-template");
              //console.log(template);
              var templateinput = private_methods.mapRelationData(value);
              //console.log(templateinput[0]);
              if (i % 2 === 0) {
                templateinput[0].even = true;
              }
              htmlOutput += template.render(templateinput);
              //console.log(htmlOutput);
              i++;
            });

          relationslist.html(htmlOutput);
        },
        displayRelationsAsGraph: function (rels) {
          //console.log(openskos.allrelations);
          var announce = $("#foundItems");
          var htmlAnnounce = "Found " + rels.length + " relations";
          announce.html(htmlAnnounce);
          var graphArea = $("#relation-graph");
          var width = graphArea.width(), height = width;

          var links = private_methods.mapRelationDataToLinks(rels);
          var nodes = [];

          //console.log(links);
// Compute the distinct nodes from the links.
          links.forEach(function (link) {
            link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, prefLabel: link.sourcePrefLabel, schema: link.sourceSchema});
            link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, prefLabel: link.targetPrefLabel, schema: link.targetSchema});
          });

          var force = openskos.d3.layout.force()
            .nodes(openskos.d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(60)
            .charge(-300)
            .on("tick", tick)
            .start();

          var svg = openskos.d3.select("#relation-graph").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(-" + width / 2 + ", -" + height / 2 + ")scale(" + 1.5 + ")");


// Per-type markers, as they don't inherit styles.
          svg.append("defs").selectAll("marker")
            .data(openskos.allrelations)
            .enter().append("marker")
            .attr("id", "Arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 27)
            .attr("refY", -2.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");

          svg.append("defs").selectAll("marker")
            .data(openskos.allrelations)
            .enter().append("marker")
            .attr("id", "Empty")
            .attr("viewBox", "0 0 0 0")
            .attr("refX", 0)
            .attr("refY", 0)
            .attr("markerWidth", 0)
            .attr("markerHeight", 0)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");

          var path = svg.append("g").selectAll("path")
            .data(force.links())
            .enter().append("path")
            .style("fill", "none")
            .style("stroke", function (d) {
              if (d.typeIndex === -1) {
                return '#000000';
              }
              return openskos.alldarkcolors[d.typeIndex];
            })
            .attr("marker-end", function (d) {
              if (d.typeIndex !== -1) {
                return "url(#Arrow)";
              } else {
                return "url(#Empty)";
              }
            });

          var circle = svg.append("g").selectAll("circle")
            .data(force.nodes())
            .enter().append("circle")
            .attr("r", 6)
            .style("fill", function (d) {
              return openskos.alllightcolors[d.schema];
            })
            .call(force.drag);

          var text = svg.append("g").selectAll("text")
            .data(force.nodes())
            .enter().append("text")
            .attr("x", 8)
            .attr("y", ".31em")
            .text(function (d) {
              return d.prefLabel;
            });

// Use elliptical arc path segments to doubly-encode directionality.
          function tick() {
            path.attr("d", linkArc);
            circle.attr("transform", transform);
            text.attr("transform", transform);
          }

          function linkArc(d) {
            var dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
              dr = 250;
            if (d.typeIndex !== -1) { // equivalence relation 
              dr = Math.sqrt(dx * dx + dy * dy);
            }
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
          }

          function transform(d) {
            return "translate(" + d.x + "," + d.y + ")";
          }

          //Fisheye directives
          var fisheye = openskos.d3.fisheye.circular().radius(32);
          svg.on("mousemove", function () {
            fisheye.focus(openskos.d3.mouse(this));
            for (var key in nodes) {
              nodes[key].fisheye = fisheye(nodes[key]);
            }
            ;

            openskos.d3.selectAll("circle")
              .attr("cx", function (d) {
                return d.fisheye.x - d.x;
              })
              .attr("cy", function (d) {
                return d.fisheye.y - d.y;
              })
              .attr("r", function (d) {
                return d.fisheye.z * 10;
              });

            openskos.d3.selectAll("text")
              .attr("dx", function (d) {
                return d.fisheye.x - d.x;
              })
              .attr("dy", function (d) {
                return d.fisheye.y - d.y;
              });

            openskos.d3.selectAll(".link")
              .attr("d", function (d) {
                var d0 = fisheye(d[0]);
                var d1 = fisheye(d[1]);
                var d2 = fisheye(d[2]);
                return "M" + d0.x + "," + d0.y
                  + "S" + d1.x + "," + d1.y
                  + " " + d2.x + "," + d2.y;
              });



          });
        }



      };
    };

    $.each(view($, openskos.config), function (k, v) {
      openskos.view[k] = v;
    });

    return openskos;

  }(jQuery, window.openskos || {}));  