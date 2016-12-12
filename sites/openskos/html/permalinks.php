<?php
/**
 * Created by PhpStorm.
 * User: JanPieterK
 * Date: 21-09-15
 * Time: 11:12
 */

require(dirname(dirname(dirname(dirname(__FILE__)))) . '/config/common.inc.php');
require(VLO_COMMON_DOCUMENTROOT . '/sites/openskos/config/config.inc.php');
$request_uri = strtolower($_SERVER['REQUEST_URI']);
// bron: http://stackoverflow.com/a/14166194
if (preg_match(
  '/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/', $request_uri, $matches
)) {
  $uuid = strtolower($matches[0]);
  if (strpos($request_uri, 'nltitle') !== FALSE || strpos($request_uri, 'nldependenttitle') !== FALSE || strpos($request_uri, 'nlseriestitle') !== FALSE) {
    $url = OPENSKOS_WEBSITE . VLO_COMMON_HOME . '?action=brondetail&bron_id=' . $uuid;
  } else if (strpos($request_uri, 'nlauthor') !== FALSE) {
    $url = OPENSKOS_WEBSITE . VLO_COMMON_HOME . '?action=auteurdetail&auteur_id=' . $uuid;
  }
  header('Location: ' . $url);
}