{extends file="generic-openskos.tpl"}

{block name="content"}
   <form id="vis_remotebackends" class="nederlab-checkboxes">
      <p>Remote Backends (to do: redesigne this page)</p>
     {html_radios_nederlab label_ids=true name="backend" options=$remotebackends selected=$selected_remote_backend separator="<br>"}
   </form> 
{/block}

