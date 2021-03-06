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
          if (rels.lenght < 1) {
            return {nodes: [], links: []};
          }
          var i;
          var links = [];
          var uuid_buffer = [];
          var nodes = [];
          var current_source, index_s;
          var current_target, index_t;
          var current_link;
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
              throw "The relation " + p + " in not in the list of admissible relations for this browser";
            }


            index_s = uuid_buffer.indexOf(s.uuid);
            if (index_s === -1) {
              uuid_buffer.push(s.uuid);
              current_source = {prefLabel: s.prefLabel, uuid: s.uuid, color: indexSSchema};
              nodes.push(current_source);
            } else {
              current_source = nodes[index_s];
            }

            index_t = uuid_buffer.indexOf(o.uuid);
            if (index_t === -1) {
              uuid_buffer.push(o.uuid);
              current_target = {prefLabel: o.prefLabel, uuid: o.uuid, color: indexOSchema};
              nodes.push(current_target);
            } else {
              current_target = nodes[index_t];
            }
            current_link = {source: current_source, target: current_target, typeIndex: pIndex};
            links.push(current_link);
          }
          var r = Math.min(2048 / nodes.length, 16);

          return {nodes: nodes, links: links, r: r};
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
        displayConcepts: function (result, hits, terms, searchfields, matchingtype) {
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
              if (searchfields.indexOf('Labels') > -1) {
                $('.prefLabel').each(function (index) {
                  private_methods.filteredHighlight($(this), value, filter);
                });
              }
              if (searchfields.indexOf('Definition') > -1) {
                $('.definition').each(function (index) {
                  private_methods.filteredHighlight($(this), value, filter);
                });
              }
            } else {
              if (searchfields.indexOf('Labels') > -1) {
                $('.prefLabel').each(function (index) {
                  $(this).highlight(value);
                });
              }
              if (searchfields.indexOf('Definition') > -1) {
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

          var announce = $("#foundItems");
          var htmlAnnounce = "Found " + rels.length + " relations";
          announce.html(htmlAnnounce);
          var graphArea = $("#relation-graph");
          var width = graphArea.width(), height = graphArea.height();

          var zoom = openskos.d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", zoomed);

          var margin = {top: 0, left: 0, bottom: 0, right: 0}
          var svg = openskos.d3.select("#relation-graph").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + [margin.left, margin.top] + ")")
            .call(zoom);

          var data = private_methods.mapRelationDataToLinks(rels);


          var simulation = openskos.d3.forceSimulation()
            .force("link", openskos.d3.forceLink().id(function (d) {
              return d.index;
            }))
            .force("collide", openskos.d3.forceCollide(function (d) {
              return data.r * 2 + 8;
            }).iterations(16))
            .force("charge", openskos.d3.forceManyBody())
            .force("center", openskos.d3.forceCenter(width / 2, height / 2))
            .force("y", openskos.d3.forceY(0))
            .force("x", openskos.d3.forceX(0));

          var refy = 1;
          if (data.r < 16) {
            refy = 2;
          }

          svg.append("defs").selectAll("marker")
            .data(openskos.allrelations)
            .enter().append("marker")
            .attr("id", "Arrow")
            .attr("refX", data.r + 9)
            .attr("refY", refy)
            .attr("markerWidth", 16)
            .attr("markerHeight", 16)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,0L0,6L9,3")
            .attr("transform", "rotate(-10 9 1)");



          var rel = svg.append("g")
            .selectAll("path")
            .data(data.links)
            .enter().append("path")
            .attr("fill", "transparent")
            .attr("stroke", function (d) {
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
            
          var labelledNode =  svg.selectAll("g.labelled-node")
            .data(data.nodes)
            .enter()
            .append("g")
            .attr("class", "labelled-node")
            .attr("transform", transform)
            .call(openskos.d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));
            

          var node = labelledNode.append("circle")
            .style("fill", function (d) {
              return openskos.alllightcolors[d.color];
            })
            .attr("r", data.r)
            


          var text = labelledNode.append("text")
            .attr("x", function (d) {
              return d.x;
            })
            .attr("y", function (d) {
              return d.y;
            })
            .text(function (d) {
              return d.prefLabel;
            })
            .style("font-size", function (d) {
              return Math.max(data.r, 10) + "px";
            });

          function linkArc(d) {
            var dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y;
            var ort_x = 100, ort_y = (-dx * ort_x / dy);//(dx * ort_x + dy * ort_y=0
            var norm = Math.sqrt(ort_x * ort_x + ort_y * ort_y);
            var norm_x = ort_x * 32 / norm, norm_y = ort_y * 20 / norm;
            var middle_x = (d.target.x + d.source.x) / 2,
              middle_y = (d.target.y + d.source.y) / 2;
            var control_x = middle_x + norm_x, control_y = middle_y + norm_y;
            if (dy < 0) {
              control_x = middle_x - norm_x, control_y = middle_y - norm_y;
            }
            return "M" + d.source.x + " " + d.source.y + " Q " + control_x + " " + control_y + " " + d.target.x + " " + d.target.y;
          }



          function transform(d) {
            return "translate(" + d.x + "," + d.y + ")";
          }
          
          function zoomed() {
            
            var trans = openskos.d3.event.transform;
            labelledNode.attr("transform", trans);
            rel.attr("transform", trans);
          }



          var ticked = function () {
            rel.attr("d", linkArc);
            node.attr("cx", function (d) {
              return d.x;
            })
              .attr("cy", function (d) {
                return d.y;
              });
            text.attr("transform", transform);
          };


          simulation
            .nodes(data.nodes)
            .on("tick", ticked);

          simulation.force("link")
            .links(data.links);



          function dragstarted(d) {
            if (!openskos.d3.event.active)
              simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          }

          function dragged(d) {
            d.fx = openskos.d3.event.x;
            d.fy = openskos.d3.event.y;
          }

          function dragended(d) {
            if (!openskos.d3.event.active)
              simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }

        },
      };
    };

    $.each(view($, openskos.config), function (k, v) {
      openskos.view[k] = v;
    });

    return openskos;

  }(jQuery, window.openskos || {}));  