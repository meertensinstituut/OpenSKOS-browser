<?php

namespace VLO\OpenSkos;

use VLO\AbstractTemplate;

class OpenSkosTemplate extends AbstractTemplate {

  private $_template;
  private $requestPath = "";
  private $action = "";

  public function __construct() {
    parent::__construct();
    $this->error_reporting = OPENSKOS_SMARTY_ERROR_REPORTING;
    if (OPENSKOS_DEBUG) {
      $this->registerFilter('output', array($this, 'getUsedTemplates'));
    }
    $this->addTemplateDir(OPENSKOS_DOCUMENTROOT . '/smarty/templates');
    $this->setCacheDir(OPENSKOS_DOCUMENTROOT . '/smarty/cache');
  }

  public function setDefaultStrings() {
    $this->assign('title', Strings::getTitle());
    $this->assign('openskoshome', OPENSKOS_CLIENT_PATH);
    $this->assign('openskosjavascripthome', OPENSKOS_JAVASCRIPT_HOME);
    $this->assign('openskoswebsite', OPENSKOS_WEBSITE);
    $this->assign('openskossafehome', 'https://' . OPENSKOS_CLIENT_HOSTNAME . OPENSKOS_WEBRESOURCES_PATH);
    $this->assign('servername', OPENSKOS_CLIENT_HOSTNAME);
    $this->assign('pathname', OPENSKOS_CLIENT_PATH);
    if ($this->action === 'home' || $this->action === "") {
      $this->assign('remotebackends', Strings::getRemoteBackends());
    }
    if ($this->action === 'tovocabularies' || $this->action === "showresults" || $this->action === 'conceptdetails') {
      
      $filters = Strings::getFilters($this->requestPath);
      $this->assign('concept_schemata', $filters["http://www.w3.org/2004/02/skos/core#ConceptScheme"]);
      $this->assign('sets', $filters["http://purl.org/dc/dcmitype#Dataset"]);
      $this->assign('skoscollections', $filters['http://www.w3.org/2004/02/skos/core#Collection']);
      $this->assign('tenants', $filters['http://www.w3.org/ns/org#FormalOrganization']);
      $this->assign('status', $filters['http://openskos.org/xmlns#status']);
      
      $this->assign('sortorders', Strings::getSortOrders());
      $this->assign('fields', Strings::getSearchFields());
      $this->assign('modes', Strings::getSearchTermModes());
      $this->assign('matchingtype', Strings::getMatchingTypes());
      
    }
    
    if ($this->action === 'torelations' || $this->action === "showrelations") {
      $filters = Strings::getFilters($this->requestPath, true);
      $schemata = $filters["http://www.w3.org/2004/02/skos/core#ConceptScheme"];
      $rels =  $filters["http://www.w3.org/2002/07/owl#objectProperty"];
      $this->assign('concept_schemata', $schemata);
      $this->assign('relations', $rels);
      $this->assign('relationsstring', implode(",", array_keys($rels)));
      $this->assign('schematastring', implode(",", array_keys($schemata)));
      $this->assign('demomodes', Strings::getRelationDemoModes());
    }

    $this->assign('darkcolorstring', implode(",", smarty_function_dark_color_array()));
    $this->assign('lightcolorstring', implode(",", smarty_function_light_color_array()));
  }

  public function setRemoteBackend($backend) {
    $this->requestPath = $backend;
    $this->assign('selected_remote_backend', $backend);
  }

  public function setAction($action) {
    $this->action = $action;
  }

  public function setDefaultValuesConceptSearch() {
    $this->assign('selected_sort_order', OPENSKOS_DEFAULT_SORT_ORDER);
    $this->assign('sortfield', OPENSKOS_DEFAULT_SORT_FIELD);
    $this->assign('searchterm', "");
    $this->assign('selected_fields', array_keys(Strings::getSearchFields()));
    $this->assign('selected_mode', OPENSKOS_DEFAULT_SEARCHMODE);
    $this->assign('selected_matching_type', OPENSKOS_DEFAULT_MATCHINGMODE);
  }

  public function setDefaultValuesRelationSearch() {
    $this->assign('selected_relation', OPENSKOS_DEFAULT_RELATION);
    $this->assign('selected_demomode', OPENSKOS_DEFAULT_RELATION_DEMOMODE);
    $this->assign('selected_source_schemata', "");
    $this->assign('selected_target_schemata', "");
  }

  /**
   * @param $searchhelper OpenSkosSearchHelper
   * @param $user
   * @param $visible_user
   * @param $get
   * @param $message
   */
  public function setPageElements($searchhelper, $get, $message = null) {
    $action = $searchhelper->getAction($get);
    $this->assign('action', $action);

    $this->assign('message_content', isset($message['content']) ? $message['content'] : '');
    $this->assign('message_class', isset($message['class']) ? $message['class'] : '');
    $this->assign('message_duration', isset($message['duration']) ? $message['duration'] : '');
  }

  public function getCss() {
    return array('css/openskos.css', 'css/pagination.css', 'css/jquery-ui-nederlab.css');
  }

  public function getDefaultTemplate($action) {
    switch ($action) {
      case 'home':
        $template = 'pg-home.tpl';
        break;
      case 'tovocabularies':
        $template = 'pg-search-in-vocabularies.tpl';
        break;
      case 'torelations':
        $template = 'pg-show-relations.tpl';
        break;
      case 'showresults':
        $template = "pg-resultaat-concept.tpl";
        break;
      case 'showrelations':
        $template = "pg-resultaat-relations.tpl";
        break;
      case 'conceptdetails':
        $template = "pg-resultaat-concept-details.tpl";
        break;
      case 'test':
        $template = 'test.tpl';
        break;
      default:
        var_dump('Not yet implemented action ');
        var_dump($action);
        $template = 'pg-home.tpl';
    }
    return $template;
  }

  public function setTemplate($template) {
    $this->_template = $template;
  }

  public function getTemplate() {
    return $this->_template;
  }

}
