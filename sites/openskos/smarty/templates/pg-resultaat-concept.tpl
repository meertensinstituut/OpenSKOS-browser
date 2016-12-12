{extends file="layout-twocolumn-openskos.tpl"} 

{block name="extendedSearchBar"}
{include file="comp-searchform-top-openskos.tpl"} 
{/block}

{block name="twoColumn-left"}
{include file="comp-left-search-openskos.tpl"} 
{/block}

{block name="twoColumn-right"} 
{block name="resultOrganizer"}
<div id="foundItems"></div>
<div>
<a href="?{$queryscoresort}"> to default sort (score)</a></td> 
</div>
<br>
<div id="resultOrganizer-openskos">
    <div class="resultnavigation-openskos">
         <div class="sort-openskos">
          {foreach name="sortdata" from=$sortorders key=direction item=directionpicture}
            <div class="sortorder-openskos">
              <a {if $direction != $selected_sort_order}class="inactive" {/if}href="?{$linkquery}&amp;sortorder={$direction}">{$directionpicture}</a>
            </div>
          {/foreach}
         </div>
        <div class="pagination"></div>
    </div>
 <div class="clearfix"></div> 
</div>
{/block}
<div id="load-openskos">
<img id="loading" src="{$pathname}images/loading.gif">
</div>
 {include file="jstemplates/concept-results.tpl"} 
{/block}

