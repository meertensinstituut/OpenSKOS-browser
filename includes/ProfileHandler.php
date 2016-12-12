<?php
/**
 * Created by PhpStorm.
 * User: JanPieterK
 * Date: 12-05-15
 * Time: 10:14
 */
namespace VLO;

class ProfileHandler
{
  private $_site = null;
  private $_defaultprofile = 'openskos';
  /** @var AbstractTemplate */
  private $_templateobject;
  /** @var AbstractSearchHelper */
  private $_searchhelper;
  /** @var AbstractController */
  private $_controller;
  private $_message = null;

  public function __construct($request)
  {
    if (isset($request['site'])) {
      $this->_site = $request['site'];
    } else {
      $this->_site = $this->_defaultprofile;
    }
    $this->_setObjects();
  }

  public function getTemplateObject()
  {
      return $this->_templateobject;
  }

  public function getSearchHelper()
  {
      return $this->_searchhelper;
  }

  public function getController()
  {
    return $this->_controller;
  }

  public function getMessage()
  {
    return $this->_message;
  }

  private function _setObjects()
  {
    switch ($this->_site) {
    case 'openskos':
      require(VLO_COMMON_DOCUMENTROOT . '/sites/openskos/config/config.inc.php');
      OpenSkos\Locale::setLocale();
      $this->_templateobject = new OpenSkos\OpenSkosTemplate();
      $this->_templateobject->registerPlugin('function', 'html_checkboxes_nederlab', 'smarty_function_html_checkboxes_nederlab');
      $this->_templateobject->registerPlugin('function', 'html_radios_nederlab', 'smarty_function_html_radios_nederlab');
      $this->_templateobject->registerPlugin('function', 'html_checkboxes_relations', 'smarty_function_html_checkboxes_relations');
      
      $this->_searchhelper = new OpenSkos\OpenSkosSearchHelper();
      $this->_searchhelper->cleanURL();
      $this->_controller = new OpenSkos\OpenSkosController();
      break;
    default:
      require(VLO_COMMON_DOCUMENTROOT . '/sites/default/config/config.inc.php');
      $this->_templateobject = new DefaultTemplate();
      $this->_searchhelper = new DefaultSearchHelper();
      $this->_controller = new DefaultController();
      $this->_message = 'Unknown profile';
      break;
    }
  }

}