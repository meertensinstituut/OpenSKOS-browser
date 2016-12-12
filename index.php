<?php
// /Applications/MAMP/htdocs/NederlabOpenskosFrontend/index.php
namespace VLO;

//$time_1 = time();
require(dirname(__FILE__) . '/config/common.inc.php');
//$time_2 =time();
//echo 'Require: ' . ($time_2 - $time_1), "<br>";


$message = array();
$sitehandler = new ProfileHandler($_REQUEST);
//$time_3 =time();
//echo 'profileHandler: ' . ($time_3 - $time_2) . '<br>';

$smarty = $sitehandler->getTemplateObject();
//$time_4 =time();
//echo('getTemplateObject: ' . ($time_4 - $time_3) .'<br>');

$searchhelper = $sitehandler->getSearchHelper();
//$time_5 =time();
//echo(' getSearchHelper(): ' . ($time_5 - $time_4) ."<br>");

$controller = $sitehandler->getController();
//$smarty->setDefaultStrings();this is set below in handleRequest
//$time_6 =time();
//echo('getController(): ' . ($time_6 - $time_5) .'<br>');

$controller->handleRequest($smarty, $searchhelper, $_REQUEST);
//$time_7 =time();
//echo('handleRequest(): ' . ($time_7 - $time_6) .'<br>');

$template = $smarty->getTemplate();
//$time_8 =time();
//echo('getTemplate(): ' . ($time_8 - $time_7) .'<br>');

$smarty->setPageElements($searchhelper, $_REQUEST, $sitehandler->getMessage());
//$time_9 =time();
//echo('setPageElements:' . ($time_9 - $time_8) .'<br>');

$smarty->display($template);
//$time_10 =time();
//echo('display: ' . ($time_10 - $time_9) .'<br>');

