{extends file="layout-twocolumn-openskos.tpl"} 

{block name="extendedSearchBar"}
{include file="comp-relationform-top-openskos.tpl"} 
{/block}

{block name=content}
  <div class="contentwrapper-openskos" id="twocolumn">
    <div class="querycolumn-openskos">
      <div class="innertube">
        <!-- we define our query form block -->
        {block name="twoColumn-left"}
{include file="comp-left-relations-openskos.tpl"} 
{/block}
      </div>
    </div>
    <div class="resultcolumn-openskos">
      <div class="innertube">
        <!-- we define our response block -->
        {block name="twoColumn-right"} {/block}
      </div>
      <div id="error-message"></div>
    </div>
  </div>
{/block}


