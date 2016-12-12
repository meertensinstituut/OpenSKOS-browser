
<form id="refine-relations-results-component-openskos"  class="metadata-component" xmlns="http://www.w3.org/1999/html">
    <p style="font-size: 14px; font-weight:700">Filters</p>
   <div>
    <div class="relations-checkboxes">
      <p>Relations</p>
       {html_checkboxes_relations label_ids=true id="relations" name="relations" options=$relations selected=$selected_relation separator="<br>"}
    </div> 
    </div>
    <div>
    <div class="relations-checkboxes white-checkboxes">
      <p>Source schemata</p>
       {html_checkboxes_schemata label_ids=true id="skos-source-schema" name="sourceSchemata" options=$concept_schemata selected=$selected_source_schemata separator="<br>"}
    </div> 
    </div>
     <div>
    <div class="relations-checkboxes">
      <p>Target schemata</p>
       {html_checkboxes_schemata label_ids=true id="skos-target-schema" name="targetSchemata" options=$concept_schemata selected=$selected_target_schemata separator="<br>"}
    </div> 
    </div>
</form>


