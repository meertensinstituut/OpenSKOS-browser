{extends file="generic-openskos.tpl"}


{block name="cssblock"}
  <link rel="stylesheet" href="{$openskoshome}css/pagination.css">
{/block}

{block name="jsblock"}
<script src="{$commonjavascripthome}extlibs/jquery.paging.min.js"></script>
{/block}



{block name=content}
  <div class="contentwrapper-openskos" id="twocolumn">
    <div class="querycolumn-openskos">
      <div class="innertube">
        <!-- we define our query form block -->
        {block name="twoColumn-left"}abstract left content{/block}
      </div>
    </div>
    <div class="resultcolumn-openskos">
      <div class="innertube">
        <!-- we define our response block -->
        {block name="twoColumn-right"}abstract right content{/block}
      </div>
      <div id="error-message"></div>
    </div>
  </div>
{/block}

