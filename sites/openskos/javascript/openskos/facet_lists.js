/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function init_list() {
    //alert($.cookie('schemaList'));
    if ($.cookie('schemaList') === undefined || $.cookie('schemaList') === 'short')
    {
        $("#vis_schemata .schemata_br").addClass("hide_facet");
        $("#vis_schemata label").addClass("hide_facet");   
        $("#schemataListMoreBtn").removeClass("hide_facet");
        for (i=1; i<7;i++)
        {
            $("#vis_schemata .schemata_br:nth-of-type(" + i + ")").removeClass("hide_facet");
            $("#vis_schemata label:nth-of-type(" + i + ")").removeClass("hide_facet");
        }
    }
    else
    {
        $("#schemataListMoreBtn").addClass("hide_facet");
    }
    
    
    if ($.cookie('collectionList') === undefined || $.cookie('collectionList') === 'short')
    {
        $("#vis_collections .collections_br").addClass("hide_facet");
        $("#vis_collections label").addClass("hide_facet");   
        $("#collectionsListMoreBtn").removeClass("hide_facet");
        for (i=1; i<7;i++)
        {
            $("#vis_collections .collections_br:nth-of-type(" + i + ")").removeClass("hide_facet");
            $("#vis_collections label:nth-of-type(" + i + ")").removeClass("hide_facet");
        }
    }
    else
    {
        $("#collectionsListMoreBtn").addClass("hide_facet");
    }

    
$("#schemataListMoreBtn").click(function() {
    $("#vis_schemata .schemata_br").removeClass("hide_facet");
    $("#vis_schemata label").removeClass("hide_facet");
    $("#schemataListMoreBtn").addClass("hide_facet");
    $.cookie('schemaList', 'long');
});

$("#schemataListLessBtn").click(function() {
    $("#vis_schemata .schemata_br").addClass("hide_facet");
    $("#vis_schemata label").addClass("hide_facet");
    $("#schemataListMoreBtn").removeClass("hide_facet");
    for (i=1; i<7;i++)
    {
        $("#vis_schemata .schemata_br:nth-of-type(" + i + ")").removeClass("hide_facet");
        $("#vis_schemata label:nth-of-type(" + i + ")").removeClass("hide_facet");
    }
    $.cookie('schemaList', 'short');
});

$("#collectionsListMoreBtn").click(function() {
    $("#vis_collections .collections_br").removeClass("hide_facet");
    $("#vis_collections label").removeClass("hide_facet");
    $("#collectionsListMoreBtn").addClass("hide_facet");
    $.cookie('collectionList', 'long');
});

$("#collectionsListLessBtn").click(function() {
    $("#vis_collections .collections_br").addClass("hide_facet");
    $("#vis_collections label").addClass("hide_facet");
    $("#collectionsListMoreBtn").removeClass("hide_facet");
    for (i=1; i<7;i++)
    {
        $("#vis_collections .collections_br:nth-of-type(" + i + ")").removeClass("hide_facet");
        $("#vis_collections label:nth-of-type(" + i + ")").removeClass("hide_facet");
    }
    $.cookie('collectionList', 'short');
});

};

