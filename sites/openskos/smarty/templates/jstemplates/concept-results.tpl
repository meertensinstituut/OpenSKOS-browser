{* jsrender template *}
 
 <table>
     <thead id="concepts-header">
      <tr id="tableheader-openskos"> 
      <td> <a href="?{$querypreflabelsort}">Preferred label</a></td>   
      <td> definition </td><td>  status </td></tr>
      <tr><td class="row-padding-openskos"></td><td class="row-padding-openskos"><td class="row-padding-openskos"></td></tr>
     </thead>
     <tbody  id="table-concepts">
     </tbody>
 </table>
  <script id="concept-template" type="text/x-jsrender">
   [[if even]] 
   <tr class="concept-even-row-openskos">
   [[else]]
   <tr class="concept-row-openskos">
   [[/if]]
             <td class="prefLabel"> <a  href="{$siteroot}?action=conceptdetails&backend={$selected_remote_backend}&uuid=[[>uuid]]&terms=[[>terms]]">[[>prefLabel]]</a> </td>
             <td class="definition">  [[>definition]]</td>
             <td>[[>status]]</td>
  </tr>
  <tr>
  <td class="row-padding-openskos"></td><td class="row-padding-openskos"><td class="row-padding-openskos"></td>
  </tr> 
  </script>