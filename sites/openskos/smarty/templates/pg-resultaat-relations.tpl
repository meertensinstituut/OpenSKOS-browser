{extends file="layout-twocolumn-openskos.tpl"} 

    
{block name="extendedSearchBar"}
{include file="comp-relationform-top-openskos.tpl"} 
{/block}

{block name="twoColumn-left"}
{include file="comp-left-relations-openskos.tpl"} 
{/block}

{block name="twoColumn-right"} 
{block name="resultOrganizer"}
<div id="foundItems"></div>
{/block}
<div id="load-openskos">
<img id="loading" src="{$pathname}images/loading.gif">
</div>
{if $selected_demomode == "table"}
      {include file="jstemplates/relation-results.tpl"} 
 {else}
      {include file="jstemplates/relation-results-graph.tpl"} 
 {/if}
{/block}

