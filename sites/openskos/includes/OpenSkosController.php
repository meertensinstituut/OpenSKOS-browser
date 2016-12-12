<?php
/**
 * Created by PhpStorm.
 * User: JanPieterK
 * Date: 12-05-15
 * Time: 14:41
 */

namespace VLO\OpenSkos;

use VLO\AbstractController;

class OpenSkosController extends AbstractController
{

  /**
   * @param      $smarty       OpenSkosTemplate
   * @param      $searchhelper OpenSkosSearchHelper
   * @param      $request
   * @param null $user
   *
   * @throws \Exception
   */
  public function handleRequest($smarty, $searchhelper, $request) {
    //var_dump($_SERVER['REQUEST_TIME']);
    //$time_1 = time();
    
    $action = $searchhelper->getAction($request);
    $smarty->setAction($action);
    //$time_2 =time();
    //echo('getAction(): ' . ($time_2 - $time_1) .'<br>');
    
    if (array_key_exists('backend', $request)) {
      $backend = $request['backend'];
    } else {
      $backend = OPENSKOS_DEFAULT_BACKEND;
    }
    
    //$time_3 =time();
    //echo('assign backend: ' . ($time_3 - $time_2) .'<br>');
    
    $smarty->setRemoteBackend($backend);
    
    //$time_4 =time();
    //echo('setRemoteBackend(): ' . ($time_4 - $time_3) .'<br>');
    
    $smarty->setDefaultStrings();
    
    //$time_5 =time();
    //echo('setDefaultStrings(): ' . ($time_5 - $time_4) .'<br>');
    $smarty->setDefaultValuesConceptSearch();
    
    //$time_6 =time();
    //echo('setDefaultValuesConceptSearch(): ' . ($time_6 - $time_5) .'<br>');
    
    $smarty->setDefaultValuesRelationSearch();
    
    //$time_7 =time();
    //echo('setDefaultValuesRelatonSearch(): ' . ($time_7 - $time_6) .'<br>');
    
    $template = $smarty->getDefaultTemplate($action);
    
    //$time_8 =time();
    //echo('getDefaultTemplate(): ' . ($time_8 - $time_7) .'<br>');
    
    $query = $searchhelper->handleQuery($request);
    
    //$time_9 =time();
    //echo('handleQuery(): ' . ($time_9 - $time_8) .'<br>');
    
    $smarty_data = $searchhelper->getTemplateData();
    
   //$time_10 =time();
    //echo('getTemplateData(): ' . ($time_10 - $time_9) .'<br>');
    
    $smarty->assignQueryData($smarty_data);
    
    //$time_11 =time();
    //echo('assignQueryData(): ' . ($time_11 - $time_10) .'<br>');
    
    $smarty->setTemplate($template);
    
    //$time_12 =time();
    //echo('setTemplate(): ' . ($time_12 - $time_11) .'<br>');
    
  }

}
