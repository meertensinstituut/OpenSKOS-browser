
<form id="refine-results-component-openskos"  class="metadata-component" xmlns="http://www.w3.org/1999/html">
   <p style="font-size: 14px; font-weight:700">Facet filters</p>
    
    <div>
    <div class="nederlab-checkboxes">
      <p>Status</p>
       {html_checkboxes_nederlab label_ids=true name="status" options=$status selected=$selected_status separator="<br>"}
    </div> 
    </div>
    
    <div>
    <div id="vis_schemata" class="nederlab-checkboxes">
      <p>Concept schemata</p>
     {html_checkboxes_nederlab label_ids=true name="schemata" options=$concept_schemata selected=$selected_concept_schemata separator="<br class=\"schemata_br\">"}
     <label id ="schemataListMoreBtn" class="facetListLabel">More...</label>
     <label id ="schemataListLessBtn" class="facetListLabel">Less...</label>
    </div>
    </div>
     <div>
    <div id="vis_collections" class="nederlab-checkboxes">
      <p>(SKOS) Collections</p>
     {html_checkboxes_nederlab label_ids=true name="skoscollections" options=$skoscollections selected=$selected_skoscollections separator="<br class=\"collections_br\">"}
     <label id ="collectionsListMoreBtn" class="facetListLabel">More...</label>
     <label id ="collectionsListLessBtn" class="facetListLabel">Less...</label>
    </div>
    </div>
      <div>
    <div class="nederlab-checkboxes">
      <p>Tenants</p>
     {html_checkboxes_nederlab label_ids=true name="tenants" options=$tenants selected=$selected_tenants separator="<br>"}
    </div>
      </div>
    <div>
      <div class="nederlab-checkboxes">
      <p>Sets (former tenant collections)</p>
     {html_checkboxes_nederlab label_ids=true name="sets" options=$sets selected=$selected_sets separator="<br>"}
    </div>
    </div>
    <br><br>
	</form>


