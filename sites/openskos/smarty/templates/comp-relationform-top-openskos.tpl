<div id="searchform-top-accordion">
 
    <form id="openskos-relations" action="{$siteroot}" method="get">
    <input type="hidden" name="action" value="showrelations"/> 
    <input type="hidden" name="backend" value="{$selected_remote_backend}"/> 
    <input type="hidden" name="allrelations" value="{$relationsstring}"/>
    <input type="hidden" name="allschemata" value="{$schematastring}"/> 
    <input type="hidden" name="alldarkcolors" value="{$darkcolorstring}"/> 
    <input type="hidden" name="alllightcolors" value="{$lightcolorstring}"/>
    <div class="accordion-header" id="accordion-button">Show mode</div>
    <div class="concept-metadata-component metadata-component">
    <div class="form-row" id="concept-search-component">
    
   
    <div class="form-row searchlevel1">
       <div class="form-col1"></div>
       <div class="form-col2">
           <label for="relations">Presentation mode</label><br>
         {html_radios_nederlab label_ids=true id="openskos-relations-demo" name="demomode" options=$demomodes selected=$selected_demomode separator="<br>"}</div> 
    </div>
     <br>
    <div class="form-row searchlevel1"> 
    <div class="form-col1"></div>
    <div id="searchObjectSmall-openskos">
      <div class="form-col2">
      <input type="submit" class="extSearchSubmit" value="Search"/> 
      <input type="button" class="extSearchSubmit" onclick="location.href='/NederlabOpenskosFrontend/?action=torelations&backend={$selected_remote_backend}';" value="Reset all"/>     
    </div>
    </div>
    </div>
    </div>
    </div> 
    </form>
</div>   
    
