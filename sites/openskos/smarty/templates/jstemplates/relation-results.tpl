{* jsrender template *}
 
 <table>
     <thead id="relations-header">
      <tr id="tableheader-openskos"> 
      <td> Subject</td><td> Subject schema </td> <td> Property </td><td>  Object </td><td> Object schema </td></tr>
      <tr><td class="row-padding-openskos"></td><td class="row-padding-openskos"><td class="row-padding-openskos"></td></tr>
     </thead>
     <tbody  id="table-relations">
     </tbody>
 </table>
  <script id="relation-template" type="text/x-jsrender">
   [[if even]] 
   <tr class="concept-even-row-openskos">
   [[else]]
   <tr class="concept-row-openskos">
   [[/if]]
             <td> <a  href="{$siteroot}?action=conceptdetails&backend={$selected_remote_backend}&uuid=[[>subjectUuid]]"> [[>subjectLabel]] </a></td>
             <td> [[>subjectSchema]] </td>
             <td>  [[>property]]</td>
             <td> <a  href="{$siteroot}?action=conceptdetails&backend={$selected_remote_backend}&uuid=[[>objectUuid]]"> [[>objectLabel]] </a></td>
             <td> [[>objectSchema]] </td>
            </tr>
  <tr>
  <td class="row-padding-openskos"></td><td class="row-padding-openskos"><td class="row-padding-openskos"></td>
  </tr> 
  </script>