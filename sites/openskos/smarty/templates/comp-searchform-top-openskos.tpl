<div id="searchform-top-accordion">
     
    
    {* search in concepts *}
     
   <form id="openskos-complexsearch" action="{$siteroot}" method="get">
    <input type="hidden" name="action" value="showresults"/> 
    <input type="hidden" name="backend" value="{$selected_remote_backend}"/> 
    <div class="accordion-header" id="accordion-button">Refine search</div>
    <div class="concept-metadata-component metadata-component">
    <div class="form-row" id="concept-search-component">
    <div class="form-table">    
    <div class="form-row searchlevel1" >
    <div class="form-col1"></div>
    <div class="form-col2">
                <label for="searchterm-openskos">Type one or more space-separated search terms</label><br>
		<input id="searchterm-openskos" class="searchterm-openskos" style="width:500px;" type="text" name="terms" value="{$searchterm|escape:"html"}" />           
    </div>
     </div>
    </div>
     <div class="form-table">
    <div class="form-row searchlevel2">
     <div class="form-left"></div>
     <div class="form-col3 form-left">
         <label for="searchtermsmode-openskos">Search terms mode</label><br>
         {html_radios_nederlab label_ids=true id="searchtermsmode-openskos" name="searchtermsmode" options=$modes selected=$selected_mode separator="<br>"}
     </div>
    <!--</div>-->
    
         
     <!--<div class="form-row searchlevel1">-->
     <!--<div class="form-col1"></div>-->
     <div class="form-col3">
         <label for="matchingtype-openskos">Search terms mode</label><br>
         {html_radios_nederlab label_ids=true id="matchingtype-openskos" name="matchingtype" options=$matchingtype selected=$selected_matching_type separator="<br>"}</div> 
    <!--</div>
    
      <!--<div class="form-row searchlevel1">-->
      <!--<div class="form-col1"></div>-->
       <div class="form-col4"><label for="fields-openskos">Search field filters</label><br>
     {html_checkboxes_nederlab label_ids=true id="fields-openskos" name="fields" options=$fields selected=$selected_fields separator="<br>"}</div> 
    </div>
     </div>
    <div class="form-row searchlevel1"> 
    <div class="form-col1"></div>
    <div id="searchObjectSmall-openskos">
      <div class="form-col2">
      <input type="submit" class="extSearchSubmit" value="Search"/> 
      <input type="button" class="extSearchSubmit" onclick="location.href='/OpenSKOS-browser/?action=tovocabularies&backend={$selected_remote_backend}';" value="Reset all"/>     
    </div>
    </div>
    </div>
    </div>
    </div>
   </form>   
</div>   
    
