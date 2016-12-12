<?php

error_reporting(E_ALL);

define('OPENSKOS_SERVICE_PROTOCOL', 'http');
define('OPENSKOS_SERVICE_HOSTNAME', $_SERVER['HTTP_HOST']);
define('OPENSKOS_DISPLAY_ERRORS', TRUE);
define('OPENSKOS_DEBUG', TRUE);

ini_set('display_errors', OPENSKOS_DISPLAY_ERRORS);

define('OPENSKOS_CLIENT_PROTOCOL', OPENSKOS_SERVICE_PROTOCOL);
define('OPENSKOS_CLIENT_HOSTNAME', OPENSKOS_SERVICE_HOSTNAME);
define('OPENSKOS_CLIENT_PATH', '/' . basename(dirname(dirname(dirname(dirname(__FILE__))))) . '/sites/openskos/');
define('OPENSKOS_WEBRESOURCES_PATH', OPENSKOS_CLIENT_PATH . 'html/');
define('OPENSKOS_JAVASCRIPT_HOME', OPENSKOS_CLIENT_PATH . 'javascript/');
define('OPENSKOS_WEBSITE', OPENSKOS_SERVICE_PROTOCOL . '://' . OPENSKOS_SERVICE_HOSTNAME);

define('OPENSKOS_DOCUMENTROOT', realpath(dirname(dirname(__FILE__))));
define('OPENSKOS_SMARTY_ERROR_REPORTING', E_ALL & ~E_NOTICE);


define('OPENSKOS_REMOTE_API',"{??,??,...,??}"); // each '??' must be replaced with a remote-backend uri string e.g. 'https://openskos.meertens.knaw.nl/ccr/api'
define('OPENSKOS_REMOTE_MYSQL_HOSTS', '??'); // the '??' is a string
define('OPENSKOS_REMOTE_MYSQL_USERNAMES', '??'); // the '??' is a string
define('OPENSKOS_REMOTE_MYSQL_PASSWORDS', '??');//the '??' is a string
define('OPENSKOS_REMOTE_MYSQL_DBNAMES', '??'); // /the '??' is a string


// defaults
define('OPENSKOS_DEFAULT_BACKEND', '??'); // a string, must be the same as in <..>/sites/openskos/javascript/config.js
define('OPENSKOS_DEFAULT_SEARCHMODE', 'or');
define('OPENSKOS_DEFAULT_MATCHINGMODE', 'partofword');
define('OPENSKOS_DEFAULT_SORT_FIELD', 'score');
define('OPENSKOS_DEFAULT_SORT_ORDER', 'desc');
define('OPENSKOS_DEFAULT_RELATION', 'broader');
define('OPENSKOS_DEFAULT_RELATION_DEMOMODE', 'table');

require(VLO_COMMON_DOCUMENTROOT . '/sites/openskos/includes/nederlab_functions.inc.php');
require(VLO_COMMON_DOCUMENTROOT . '/sites/openskos/config/Locale.php');

spl_autoload_register(
  function ($class) {
    // namespace er af halen
    $parts = explode('\\', $class);
    /** @noinspection PhpIncludeInspection */
    if (file_exists(VLO_COMMON_DOCUMENTROOT . '/sites/openskos/includes/' . end($parts) . '.php')) {
      /** @noinspection PhpIncludeInspection */
      require(VLO_COMMON_DOCUMENTROOT . '/sites/openskos/includes/' . end($parts) . '.php');
    }
  }
);
