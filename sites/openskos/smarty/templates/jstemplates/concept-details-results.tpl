{* jsrender template *}
<div>
<input type="button" class="backButton-openskos" onclick="window.history.back();" value="back"/>  
</div>
<table id="concept-details"></table>
 <script id="concept-details-template" type="text/x-jsrender">
   [[if even]] 
   <tr class="detail-row-openskos-even">
   [[else]]
   <tr class="detail-row-openskos">
   [[/if]]
             <td class="detail-field-openskos"> [[>field]]</td>
             [[if hl]]
                     <td class="detail-value-openskos-hl">[[>fvalue]]</td>
             [[else]]
             [[if ref]]
                     <td class="detail-value-openskos">
                       <a href="{$siteroot}?action=conceptdetails&uri=[[>fvalue]]">[[>fvalue]]</a>
                     </td>
             [[else]]
                     <td class="detail-value-openskos">[[>fvalue]]</td>
             [[/if]]
             [[/if]]
  </tr>
  <tr>
  <td class="row-padding-openskos"></td><td class="row-padding-openskos"><td class="row-padding-openskos"></td>
  </tr> 
 </script>
