<!DOCTYPE html> <!-- everythinng is almost as in nederlab-generic but scripts and content menu are diferent -->
<html lang="{$lang}">
<head>
  <meta charset="utf-8">
  {* we define the meta description block *}
  <meta name="description" content="{block name="metad"}{/block}">

  {* we define the meta keywords block *}
  <meta name="keywords" content="{block name="meta"}{/block}">

  {* we define our title block *}
  <title>{$title}</title>

  {* HTML 5 elementen in IE < 9 *}
  <!--[if lt IE 9]>
  <!--suppress HtmlUnknownTarget -->
  <script type="text/javascript" src="{$commonjavascripthome}/extlibs/html5shiv.js"></script>
  <!--[endif]-->

  <link rel="stylesheet" href="{$commonjavascripthome}extlibs/jquery-ui/jquery-ui.min.css">
  <link rel="stylesheet" href="{$commonjavascripthome}extlibs/multiple-select/multiple-select.css">
  {foreach from=$smarty.template_object->getCss() item=css}
    <link rel="stylesheet" href="{$openskoshome}{$css}?v=2015-09-03">
  {/foreach}
  {* we need to define an extra block for css needed by specific page or template file *}
  {block name="cssblock"}{/block}

  <script src="{$commonjavascripthome}extlibs/jquery-1.10.2.js"></script>
  <script src="{$commonjavascripthome}extlibs/jquery-ui/jquery-ui.min.js"></script>
  <script src="{$commonjavascripthome}extlibs/jsrender.js"></script>
  <script src="{$commonjavascripthome}extlibs/readmore/readmore.min.js"></script>
  <script src="{$commonjavascripthome}extlibs/jquery.cookie.js"></script>
  <script src="{$commonjavascripthome}extlibs/multiple-select/jquery.multiple.select.js"></script>
  <script src="{$commonjavascripthome}extlibs/jquery.highlight-4.js"></script>
  <script src="{$commonjavascripthome}extlibs/d3.v3.min.js"></script>
  <script src="{$commonjavascripthome}extlibs/fisheye.js"></script>
  
  <script src="{$commonjavascripthome}utilities.js"></script>
  <script src="{$commonjavascripthome}controller/controller.js"></script>
  <script src="{$commonjavascripthome}controller/eventhandler.js"></script>
  <script src="{$commonjavascripthome}model/broker.js"></script>
  <script src="{$commonjavascripthome}view/view.js"></script>
 

  {* we need to define an extra block for javascript needed by specific page or template file *}
  {block name="jsblock"}{/block}


  
    <script src="{$openskosjavascripthome}openskos/config.js"></script>
    <script src="{$openskosjavascripthome}openskos/utilities.js"></script>
    <script src="{$openskosjavascripthome}openskos/model/broker.js"></script>
    <script src="{$openskosjavascripthome}openskos/view/view.js"></script>
    <script src="{$openskosjavascripthome}openskos/controller/controller.js"></script>
    <script src="{$openskosjavascripthome}openskos/controller/eventhandler.js"></script>
      <script src="{$openskosjavascripthome}openskos/facet_lists.js"></script>
  
  <script type="text/javascript">
    $(document).ready(function () {
      "use strict";
      init_list();
      openskos.controller.init();
      
    });
  </script>
   
</head>
<body>
<div id="maincontainer"> 

  {block name="topHeader"}
    {include file="comp-topheader.tpl"}
  {/block}
  
   <div id="topsection">
    {block name="menubar"}
      {include file="comp-menubar-openskos.tpl"} 
    {/block}
  </div>

  <div id="contentheader"> 
    <div id="hiddenquery" class="hidden">{$query}</div> 

    <div id="message" data-content="{$message_content}" data-class="{$message_class}" data-duration="{$message_duration}"></div>
    <noscript>
      <p class="message error">{_('Om het Clarin Component Registry  te gebruiken is Javascript noodzakelijk. Uw browser ondersteunt geen Javascript of het is uitgeschakeld.')}</p>
    </noscript>
  </div>
 
 {block name="menuAndTitleBar"}{/block} 
 {block name="extendedSearchBar"}{/block}
 {block name="content"}generic content{/block}
  
  <!-- footer section -->
  <footer><br>&nbsp;<br>Powered by: <img src="{$openskoshome}images/logo_footer.png"></footer>
</div>
</body>
</html>
