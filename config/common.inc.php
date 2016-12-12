<?php
/**
 * Created by PhpStorm.
 * User: JanPieterK
 * Date: 13-05-15
 * Time: 10:28
 */

define('VLO_COMMON_DOCUMENTROOT', realpath(dirname(dirname(__FILE__))));
define('VLO_COMMON_HOME', '/' . basename(dirname(dirname(__FILE__))));
define('VLO_COMMON_JAVASCRIPT_ROOT', '/' . basename(dirname(dirname(__FILE__))) . '/javascript/');

// Smarty bij alle profielen
if (file_exists(VLO_COMMON_DOCUMENTROOT . '/includes/extlibs/Smarty/Smarty.class.php')) {
  require(VLO_COMMON_DOCUMENTROOT . '/includes/extlibs/Smarty/Smarty.class.php');
} else {
  require('Smarty3/Smarty.class.php');
}

// zo dat ProfileHandler.php gevonden wordt
spl_autoload_register(function ($class) {
  // namespace er af halen
  $parts = explode('\\', $class);
  /** @noinspection PhpIncludeInspection */
  if (file_exists(VLO_COMMON_DOCUMENTROOT . '/includes/' . end($parts) . '.php')) {
    /** @noinspection PhpIncludeInspection */
    require(VLO_COMMON_DOCUMENTROOT . '/includes/' . end($parts) . '.php');
  }
});
