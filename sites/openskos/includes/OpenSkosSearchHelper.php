<?php

namespace VLO\OpenSkos;
use VLO\AbstractSearchHelper;

class OpenSkosSearchHelper extends AbstractSearchHelper {

  private $_searched_data = 'metadata_content';
  private $_smarty_data = array();
  
  public static function TextEntered($formfields)
  {
  
    if (! isset($formfields['terms'])) {
      $formfields['terms'] = '';
    }

    $textentered = TRUE;
    if (trim($formfields['terms']) == ''){
      $textentered = FALSE;
    }
    return $textentered;
  }

  /**
   * indien geen ingelogde gebruiker, 'bekijkcorpusglobal' en 'bekijkcorpus'
   * vervangen door respectievelijk 'showtimedistribution' en 'showresults' en corpus_id verwijderen.
   */
  public function cleanURL()
  {
    
  }

  /**
   * @param $query  array
   * @param $user   NULL|string vooralsnog alleen niet NULL als een ingelogde user zijn/haar corpus bewerkt
   *
   * @throws \Exception
   * @return array
   */
  public function handleQuery($query) {
        $action = '';
        if (isset($query['action'])) {
            $action = $query['action'];
        }

        if ($action === 'showresults') {
            $this->_prefillFormShowResults($query);
        };

        if ($action === 'showrelations') {
            $this->_prefillFormShowRelations($query);
        };

        array_walk_recursive_referential($query, 'trim');

        // "true" en "false" in true en false veranderen
        $query = change_true_false_to_boolean($query);
        // komt in de <div id="hiddenquery"> terecht
        $this->_smarty_data['query'] = json_encode($query, JSON_HEX_TAG);
        return $query;
    }

    private function _prefillFormShowResults($query) {
        if (isset($query['terms'])) {
            $this->_smarty_data['searchterm'] = $query['terms'];
        } else {
            $this->_smarty_data['searchterm'] = "";
        }

        if (isset($query['sortfield'])) {
            $this->_smarty_data['sortfield'] = $query['sortfield'];
        } else {
            $this->_smarty_data['sortfield'] = OPENSKOS_DEFAULT_SORT_FIELD;
        }

        if (isset($query['sortorder'])) {
            $this->_smarty_data['selected_sort_order'] = $query['sortorder'];
        } else {
            $this->_smarty_data['selected_sort_order'] = OPENSKOS_DEFAULT_SORT_ORDER;
        }

        if (isset($query['searchtermsmode'])) {
            $this->_smarty_data['selected_mode'] = $query['searchtermsmode'];
        } else {
            $this->_smarty_data['selected_mode'] = OPENSKOS_DEFAULT_SEARCHMODE;
        }

        if (isset($query['fields'])) {
            $this->_smarty_data['selected_fields'] = $query['fields'];
        } else {
            $this->_smarty_data['selected_fields'] = array_keys(Strings::getSearchFields());
        }

        
        if (isset($query['matchingtype'])) {
            $this->_smarty_data['selected_matching_type'] = $query['matchingtype'];
        } else {
            $this->_smarty_data['selected_matching_type'] = OPENSKOS_DEFAULT_MATCHINGMODE;
        }

        if (isset($query['status'])) {
            $this->_smarty_data['selected_status'] = $query['status'];
        } 

        
        if (isset($query['schemata'])) {
            $this->_smarty_data['selected_concept_schemata'] = $query['schemata'];
        }

        if (isset($query['tenants'])) {
            $this->_smarty_data['selected_tenants'] = $query['tenants'];
        }

        if (isset($query['skoscollections'])) {
            $this->_smarty_data['selected_skoscollections'] = $query['skoscollections'];
        }

        if (isset($query['sets'])) {
            $this->_smarty_data['selected_sets'] = $query['sets'];
        }
        
        $query_without_sortorder = $query;
        unset($query_without_sortorder['sortorder']);
        $this->_smarty_data['linkquery'] = http_build_query($query_without_sortorder);
        //var_dump($this->_smarty_data['linkqery']);
        
        //save the query's pref-label-sort version
        $query_pref_label_sort = $query;
        $query_pref_label_sort['sortfield']='prefLabel';
        $this->_smarty_data['querypreflabelsort'] = http_build_query($query_pref_label_sort);
        
        // save the query's default-score version
        $query_score_sort = $query;
        $query_score_sort['sortfield']='score';
        $this->_smarty_data['queryscoresort'] = http_build_query($query_score_sort);
    }

    private function _prefillFormShowRelations($query) {
        if (isset($query['relations'])) {
            $this->_smarty_data['selected_relation'] = $query['relations'];
        }
        if (isset($query['demomode'])) {
            $this->_smarty_data['selected_demomode'] = $query['demomode'];
        }
        if (isset($query['sourceSchemata'])) {
            $this->_smarty_data['selected_source_schemata'] = $query['sourceSchemata'];
        }
        if (isset($query['targetSchemata'])) {
            $this->_smarty_data['selected_target_schemata'] = $query['targetSchemata'];
        }
    }

    /**
   * @return string
   */
  public function getSearchedData()
  {
    return $this->_searched_data;
  }

  

  /**
   * @return array
   */
  public function getTemplateData()
  {
    return $this->_smarty_data;
  }

  public function getAction($request) {
        if (isset($request['action'])) {
            $action = $request['action'];
        } else {
            $action = 'home';
        }
        return $action;
    }

 

}