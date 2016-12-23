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
    $action = $searchhelper->getAction($request);
    $smarty->setAction($action);
    if (($action !== NULL & $action !== "" || $action !== "home") && array_key_exists('backend', $request)) {
      $backend = $request['backend'];
    } else {
      $backend = OPENSKOS_DEFAULT_BACKEND;
    }
    $smarty->setRemoteBackend($backend);
    $smarty->setDefaultStrings();
    $smarty->setDefaultValuesConceptSearch();
    $smarty->setDefaultValuesRelationSearch();
    $template = $smarty->getDefaultTemplate($action);
    $query = $searchhelper->handleQuery($request);
    $smarty_data = $searchhelper->getTemplateData();
    $smarty->assignQueryData($smarty_data);
    $smarty->setTemplate($template);
    
  }

}
