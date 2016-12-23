{extends file="generic-openskos.tpl"}
 {block name="menubar"}{include file="comp-home-menubar-openskos.tpl"} {/block}
{block name="content"}
<div id="home_content">
        <h2>OpenSkos</h2>
        <p id="home_text">OpenSKOS was originally developed in the <a href="http://www.catchplus.nl/index.html%3Fp=1109.html">CatchPlus project</a> as an environment for managing and disseminating thesaurus information. As such it has since been successfully deployed by organizations, such as <a href="http://www.beeldengeluid.nl/en">Sound&Vision</a> and the <a href="http://culturalheritageagency.nl/en">Cultural Heritage Agency of the Netherlands</a>.<br>&nbsp;<br> In a follow up version the OpenSKOS functionality was further extended to support the <a href="www.clarin.eu">CLARIN</a> requirements for a concept registry (<a href="https://www.clarin.eu/ccr">CCR</a>) and a vocabulary service (CLAVAS). <br>&nbsp;<br>The current version of OpenSKOS reflects a joint collaboration between various stake holders to provide a widely supported common platform for <a href="https://www.w3.org/2004/02/skos/">SKOS</a> (Simple Knowledge Organization System) based knowledge sources.</p>
        
   <form id="vis_remotebackends" class="dropdown">
   <p>Choose database</p>
   <div class="vis_remotebackends-content">
    {html_radios_nederlab label_ids=true name="backend" options=$remotebackends selected=$selected_remote_backend separator="<br>"}
   </div>
   </form> 
</div>
{/block}

