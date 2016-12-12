<?php
/**
 * Created by PhpStorm.
 * User: JanPieterK
 * Date: 11-05-15
 * Time: 11:16
 */

namespace VLO;


abstract class AbstractTemplate extends \Smarty {

  public function __construct()
  {
    parent::__construct();
    $this->setTemplateDir(VLO_COMMON_DOCUMENTROOT . '/smarty/templates');
    $this->setCompileDir(VLO_COMMON_DOCUMENTROOT . '/smarty/templates_c');
    $this->setConfigDir(VLO_COMMON_DOCUMENTROOT . '/smarty/configs');
    $this->addPluginsDir(VLO_COMMON_DOCUMENTROOT . '/smarty/plugins');
    $this->assign('commonjavascripthome', VLO_COMMON_JAVASCRIPT_ROOT);
    $this->assign('siteroot', VLO_COMMON_HOME);
  }

  public function assignQueryData($data)
  {
    foreach($data as $varname => $value) {
      $this->assign($varname, $value);
    }
  }

  // functie moet public zijn anders werkt registerFilter niet
  public function getUsedTemplates($tpl_source, \Smarty_Internal_Template $smarty)
  {
    $templatefiles = array();
    foreach($smarty->properties['file_dependency'] as $dep) {
      $templatefiles[] = basename($dep[0]);
    }
    return $tpl_source . "\n"  . "<!--\n" . join("\n", $templatefiles) . "\n-->" ;
  }

  abstract public function setDefaultStrings();
  abstract public function setPageElements($searchhelper, $get, $message = null);
  //abstract public function getSearchFormtop();
  //abstract public function getSearchFormLeft();
  abstract public function getCss();
  abstract public function getDefaultTemplate($action);
  abstract public function setTemplate($template);
  abstract public function getTemplate();
}