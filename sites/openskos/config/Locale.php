<?php

namespace VLO\OpenSkos;

class Locale
{
  private static $_interface_language = 'nl_NL';
  private static $_html_lang = 'nl';
  private static $_gettext_domain = 'messages';

  public static function setLocale()
  {
    if (isset($_GET['lang'])) {
      switch ($_GET['lang']) {
      case 'en':
        self::$_interface_language = 'en_GB';
        self::$_html_lang = 'en';
        break;
      default:
        self::$_interface_language = 'nl_NL';
        self::$_html_lang = 'nl';
        break;
      }
      setcookie('lang', self::$_interface_language);
    } elseif (isset($_COOKIE['lang'])) {
      self::$_interface_language = $_COOKIE['lang'];
      self::$_html_lang = substr($_COOKIE['lang'], 0, 2);
    }

    putenv('LANG=' . self::$_interface_language);
    setlocale(LC_ALL, self::$_interface_language);
    bindtextdomain(self::$_gettext_domain, OPENSKOS_DOCUMENTROOT . '/i18n/locale');
    if (function_exists('bind_textdomain_codeset')) {
      bind_textdomain_codeset(self::$_gettext_domain, 'UTF-8');
    }
    textdomain(self::$_gettext_domain);
  }

  public static function getHtmlLLang()
  {
    return self::$_html_lang;
  }
}
