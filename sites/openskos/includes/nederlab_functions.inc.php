<?php
/**
 * Created by JetBrains PhpStorm.
 * User: JanPieterK
 * Date: 23-08-13
 * Time: 14:56
 * To change this template use File | Settings | File Templates.
 */

// bron: http://www.php.net/manual/en/function.array-walk-recursive.php#99639
/**
 * This function acts exactly like array_walk_recursive, except that it pretends that the function
 * it's calling replaces the value with its result.
 *
 * @param $array array The first value of the array will be passed into $function as the primary argument
 * @param $function string The function to be called on each element in the array, recursively
 * @param $parameters array An optional array of the additional parameters to be appeneded to the function
 *
 * Example usage to alter $array to get the second, third and fourth character from each value
 *     array_walk_recursive_referential($array, "substr", array("1","3"));
 */
function array_walk_recursive_referential(&$array, $function, $parameters = array()) {
  $reference_function = function(&$value, $key, $userdata) {
    $parameters = array_merge(array($value), $userdata[1]);
    $value = call_user_func_array($userdata[0], $parameters);
  };
  array_walk_recursive($array, $reference_function, array($function, $parameters));
}

// http://stackoverflow.com/a/12022809
function change_true_false_to_boolean(array $data){
  // Note the order of arguments and the & in front of $value
  function converter(&$value, $key){
    if($value === "true") {
      $value = TRUE;
    } elseif ($value === "false") {
      $value = FALSE;
    }
    if ($key === "not") {
      if ($value === "1") {
        $value = TRUE;
      }
      if ($value === "0") {
        $value = FALSE;
      }
    }
  }
  array_walk_recursive($data, 'converter');
  return $data;
}


/**
 * Smarty plugin
 *
 * @package Smarty
 * @subpackage PluginsFunction
 */


function smarty_function_html_radios_nederlab($params, $template){
    require_once(SMARTY_PLUGINS_DIR . 'function.html_radios.php');
    return smarty_function_html_radios($params, $template);
}


/**
 * Smarty {html_checkboxes} function plugin
 *
 * File:       function.html_checkboxes.php<br>
 * Type:       function<br>
 * Name:       html_checkboxes<br>
 * Date:       24.Feb.2003<br>
 * Purpose:    Prints out a list of checkbox input types<br>
 * Examples:
 * <pre>
 * {html_checkboxes values=$ids output=$names}
 * {html_checkboxes values=$ids name='box' separator='<br>' output=$names}
 * {html_checkboxes values=$ids checked=$checked separator='<br>' output=$names}
 * </pre>
 * Params:
 * <pre>
 * - name       (optional) - string default "checkbox"
 * - values     (required) - array
 * - options    (optional) - associative array
 * - checked    (optional) - array default not set
 * - separator  (optional) - ie <br> or &nbsp;
 * - output     (optional) - the output next to each checkbox
 * - assign     (optional) - assign the output as an array to this variable
 * - escape     (optional) - escape the content (not value), defaults to true
 * </pre>
 *
 * @link http://www.smarty.net/manual/en/language.function.html.checkboxes.php {html_checkboxes}
 *      (Smarty online manual)
 * @author     Christopher Kvarme <christopher.kvarme@flashjab.com>
 * @author credits to Monte Ohrt <monte at ohrt dot com>
 * @version    1.0
 * @param array $params parameters
 * @param object $template template object
 * @return string
 * @uses smarty_function_escape_special_chars()
 */
function smarty_function_html_checkboxes_nederlab($params, $template)
{
  require_once(SMARTY_PLUGINS_DIR . 'shared.escape_special_chars.php');

  $name = 'checkbox';
  $values = null;
  $options = null;
  $selected = array();
  $separator = '';
  $escape = true;
  $labels = true;
  $label_ids = false;
  $output = null;

  $extra = '';

  foreach($params as $_key => $_val) {
    switch($_key) {
    case 'name':
    case 'separator':
      $$_key = (string) $_val;
      break;

    case 'escape':
    case 'labels':
    case 'label_ids':
      $$_key = (bool) $_val;
      break;

    case 'options':
      $$_key = (array) $_val;
      break;

    case 'values':
    case 'output':
      $$_key = array_values((array) $_val);
      break;

    case 'checked':
    case 'selected':
      if (is_array($_val)) {
        $selected = array();
        foreach ($_val as $_sel) {
          if (is_object($_sel)) {
            if (method_exists($_sel, "__toString")) {
              $_sel = smarty_function_escape_special_chars((string) $_sel->__toString());
            } else {
              trigger_error("html_checkboxes: selected attribute contains an object of class '". get_class($_sel) ."' without __toString() method", E_USER_NOTICE);
              continue;
            }
          } else {
            $_sel = smarty_function_escape_special_chars((string) $_sel);
          }
          $selected[$_sel] = true;
        }
      } elseif (is_object($_val)) {
        if (method_exists($_val, "__toString")) {
          $selected = smarty_function_escape_special_chars((string) $_val->__toString());
        } else {
          trigger_error("html_checkboxes: selected attribute is an object of class '". get_class($_val) ."' without __toString() method", E_USER_NOTICE);
        }
      } else {
        $selected = smarty_function_escape_special_chars((string) $_val);
      }
      break;

    case 'checkboxes':
      trigger_error('html_checkboxes: the use of the "checkboxes" attribute is deprecated, use "options" instead', E_USER_WARNING);
      $options = (array) $_val;
      break;

    case 'assign':
      break;

    case 'strict': break;

    case 'disabled':
    case 'readonly':
      if (!empty($params['strict'])) {
        if (!is_scalar($_val)) {
          trigger_error("html_options: $_key attribute must be a scalar, only boolean true or string '$_key' will actually add the attribute", E_USER_NOTICE);
        }

        if ($_val === true || $_val === $_key) {
          $extra .= ' ' . $_key . '="' . smarty_function_escape_special_chars($_key) . '"';
        }

        break;
      }
      // omit break; to fall through!

    default:
      if(!is_array($_val)) {
        $extra .= ' '.$_key.'="'.smarty_function_escape_special_chars($_val).'"';
      } else {
        trigger_error("html_checkboxes: extra attribute '$_key' cannot be an array", E_USER_NOTICE);
      }
      break;
    }
  }

  if (!isset($options) && !isset($values))
    return ''; /* raise error here? */

  $_html_result = array();

  if (isset($options)) {
    foreach ($options as $_key=>$_val) {
      $_html_result[] = smarty_function_html_checkboxes_nederlab_output($name, $_key, $_val, $selected, $extra, $separator, $labels, $label_ids, $escape);
    }
  } else {
    foreach ($values as $_i=>$_key) {
      $_val = isset($output[$_i]) ? $output[$_i] : '';
      $_html_result[] = smarty_function_html_checkboxes_nederlab_output($name, $_key, $_val, $selected, $extra, $separator, $labels, $label_ids, $escape);
    }
  }

  if(!empty($params['assign'])) {
    $template->assign($params['assign'], $_html_result);
  } else {
    return implode("\n", $_html_result);
  }

}

function smarty_function_html_checkboxes_nederlab_output($name, $value, $output, $selected, $extra, $separator, $labels, $label_ids, $escape=true) {
  $_output = '';

  if (is_object($value)) {
    if (method_exists($value, "__toString")) {
      $value = (string) $value->__toString();
    } else {
      trigger_error("html_options: value is an object of class '". get_class($value) ."' without __toString() method", E_USER_NOTICE);
      return '';
    }
  } else {
    $value = (string) $value;
  }

  if (is_object($output)) {
    if (method_exists($output, "__toString")) {
      $output = (string) $output->__toString();
    } else {
      trigger_error("html_options: output is an object of class '". get_class($output) ."' without __toString() method", E_USER_NOTICE);
      return '';
    }
  } else {
    $output = (string) $output;
  }

  if ($labels && $label_ids) {
    $_id = smarty_function_escape_special_chars(
      preg_replace('![^\w\-\.]!' . Smarty::$_UTF8_MODIFIER, '_', $name . '_' . $value)
    );
  }

  $name = smarty_function_escape_special_chars($name);
  $value = smarty_function_escape_special_chars($value);
  if ($escape) {
    $output = smarty_function_escape_special_chars($output);
  }

  $_output .= '<input type="checkbox" name="' . $name . '[]" value="' . $value . '"';

  if ($labels && $label_ids) {
    $_output .= ' id="' . $_id . '"';
  }

  if (is_array($selected)) {
    if (isset($selected[$value])) {
      $_output .= ' checked="checked"';
    }
  } elseif ($value === $selected) {
    $_output .= ' checked="checked"';
  }

  $_output .= $extra . ' />';


  if ($labels) {
    if ($label_ids) {
      $_output .= '<label for="' . $_id . '">';
    } else {
      $_output .= '<label>';
    }
    $_output .= $output;
  }

  if ($labels) {
    $_output .= '</label>';
  }

  $_output .=  $separator;
  return $_output;
}

////// relations ///////



function smarty_function_html_checkboxes_schemata($params, $template)
{
  return smarty_function_html_checkboxes_menu($params, $template, 'schemata');
}

function smarty_function_html_checkboxes_relations($params, $template)
{
  return smarty_function_html_checkboxes_menu($params, $template, 'relations');
}

function smarty_function_html_checkboxes_menu($params, $template, $menufor) {
    require_once(SMARTY_PLUGINS_DIR . 'shared.escape_special_chars.php');

    $name = 'checkbox';
    $values = null;
    $options = null;
    $selected = array();
    $separator = '';
    $escape = true;
    $labels = true;
    $label_ids = false;
    $output = null;

    $extra = '';

    foreach ($params as $_key => $_val) {
        switch ($_key) {
            case 'name':
            case 'separator':
                $$_key = (string) $_val;
                break;

            case 'escape':
            case 'labels':
            case 'label_ids':
                $$_key = (bool) $_val;
                break;

            case 'options':
                $$_key = (array) $_val;
                break;

            case 'values':
            case 'output':
                $$_key = array_values((array) $_val);
                break;

            case 'checked':
            case 'selected':
                if (is_array($_val)) {
                    $selected = array();
                    foreach ($_val as $_sel) {
                        if (is_object($_sel)) {
                            if (method_exists($_sel, "__toString")) {
                                $_sel = smarty_function_escape_special_chars((string) $_sel->__toString());
                            } else {
                                trigger_error("html_checkboxes: selected attribute contains an object of class '" . get_class($_sel) . "' without __toString() method", E_USER_NOTICE);
                                continue;
                            }
                        } else {
                            $_sel = smarty_function_escape_special_chars((string) $_sel);
                        }
                        $selected[$_sel] = true;
                    }
                } elseif (is_object($_val)) {
                    if (method_exists($_val, "__toString")) {
                        $selected = smarty_function_escape_special_chars((string) $_val->__toString());
                    } else {
                        trigger_error("html_checkboxes: selected attribute is an object of class '" . get_class($_val) . "' without __toString() method", E_USER_NOTICE);
                    }
                } else {
                    $selected = smarty_function_escape_special_chars((string) $_val);
                }
                break;

            case 'checkboxes':
                trigger_error('html_checkboxes: the use of the "checkboxes" attribute is deprecated, use "options" instead', E_USER_WARNING);
                $options = (array) $_val;
                break;

            case 'assign':
                break;

            case 'strict': break;

            case 'disabled':
            case 'readonly':
                if (!empty($params['strict'])) {
                    if (!is_scalar($_val)) {
                        trigger_error("html_options: $_key attribute must be a scalar, only boolean true or string '$_key' will actually add the attribute", E_USER_NOTICE);
                    }

                    if ($_val === true || $_val === $_key) {
                        $extra .= ' ' . $_key . '="' . smarty_function_escape_special_chars($_key) . '"';
                    }

                    break;
                }
            // omit break; to fall through!

            default:
                if (!is_array($_val)) {
                    $extra .= ' ' . $_key . '="' . smarty_function_escape_special_chars($_val) . '"';
                } else {
                    trigger_error("html_checkboxes: extra attribute '$_key' cannot be an array", E_USER_NOTICE);
                }
                break;
        }
    }

    if (!isset($options) && !isset($values))
        return ''; /* raise error here? */

    $_html_result = array();
    $_dark_colors = array('#7b490c', '#292986',  '#ad6291', '#154eb4', '#556b2f','#451075', '#987373', '#275c5c', '#8a9696', '#306da9', '#009a09', '#990000', '#5f9ea0', '#7b990c', '#299086',  '#ad0291', '#159eb4', '#559b2f','#459075', '#980373', '#270c5c', '#8a0696', '#300da9', '#000a09', '#999000', '#5f0ea0');
    $_light_colors = array('#467300', '#ad0057', '#008b8b', '#7f4f10', '#0a6969', '#990000', '#987373', '#8a9696', '#9f880c', '#107190', '#bc0722', '#557189');

    $i = 0;
    switch ($menufor) {
        case 'relations': '';
            
                if (isset($options)) {
                    foreach ($options as $_key => $_val) {
                        $_html_result[$i] = smarty_function_html_checkboxes_colors_output($name, $_key, $_val, $selected, $extra, $separator, $labels, $label_ids, $escape, $_dark_colors[$i], 'color');
                        $i++;
                    }
                } else {
                    foreach ($values as $_i => $_key) {
                        $_val = isset($output[$_i]) ? $output[$_i] : '';
                        $_html_result[$i] = smarty_function_html_checkboxes_colors_output($name, $_key, $_val, $selected, $extra, $separator, $labels, $label_ids, $escape, $_dark_colors[$i], 'color');
                        $i++;
                    }
                }
                break;
            
        case 'schemata' : 
                if (isset($options)) {
                    foreach ($options as $_key => $_val) {
                        $_html_result[$i] = smarty_function_html_checkboxes_colors_output($name, $_key, $_val, $selected, $extra, $separator, $labels, $label_ids, $escape, $_light_colors[$i], 'background-color');
                        $i++;
                    }
                } else {
                    foreach ($values as $_i => $_key) {
                        $_val = isset($output[$_i]) ? $output[$_i] : '';
                        $_html_result[$i] = smarty_function_html_checkboxes_colors_output($name, $_key, $_val, $selected, $extra, $separator, $labels, $label_ids, $escape, $_light_colors[$i], 'background-color');
                        $i++;
                    }
                }
                break;
            
        default: 
               break; 
            
    }
            if (!empty($params['assign'])) {
                $template->assign($params['assign'], $_html_result);
            } else {
                return implode("\n", $_html_result);
           }
    }





function smarty_function_html_checkboxes_colors_output($name, $value, $output, $selected, $extra, $separator, $labels, $label_ids, $escape=true, $color, $styleelement) {
  $_output = '';

  if (is_object($value)) {
    if (method_exists($value, "__toString")) {
      $value = (string) $value->__toString();
    } else {
      trigger_error("html_options: value is an object of class '". get_class($value) ."' without __toString() method", E_USER_NOTICE);
      return '';
    }
  } else {
    $value = (string) $value;
  }

  if (is_object($output)) {
    if (method_exists($output, "__toString")) {
      $output = (string) $output->__toString();
    } else {
      trigger_error("html_options: output is an object of class '". get_class($output) ."' without __toString() method", E_USER_NOTICE);
      return '';
    }
  } else {
    $output = (string) $output;
  }

  if ($labels && $label_ids) {
    $_id = smarty_function_escape_special_chars(
      preg_replace('![^\w\-\.]!' . Smarty::$_UTF8_MODIFIER, '_', $name . '_' . $value)
    );
  }

  $name = smarty_function_escape_special_chars($name);
  $value = smarty_function_escape_special_chars($value);
  if ($escape) {
    $output = smarty_function_escape_special_chars($output);
  }

  $_output .= '<input type="checkbox" name="' . $name . '[]" value="' . $value . '"';

  if ($labels && $label_ids) {
    $_output .= ' id="' . $_id . '"';
  }

  $color_checked="";
  if (is_array($selected)) {
    if (isset($selected[$value])) {
      $_output .= ' checked="checked"';
      $color_checked= 'style="'.$styleelement. ': ' . $color . '"';
    }
  } elseif ($value === $selected) {
    $_output .= ' checked="checked"';
    $color_checked= 'style="'.$styleelement. ': ' . $color . '"';
  }

  $_output .= $extra . ' />';


  if ($labels) {
    if ($label_ids) {
      $_output .= '<label for="' . $_id . '" ' . $color_checked . '>';
    } else {
      $_output .= '<label '.  $color_checked . '>';
    }
    $_output .= $output;
  }

  if ($labels) {
    $_output .= '</label>';
  }

  $_output .=  $separator;
  return $_output;
}

function smarty_function_dark_color_array(){
    return  array('#7b490c', '#292986',  '#ad6291', '#154eb4', '#556b2f','#451075', '#987373', '#275c5c', '#8a9696', '#306da9', '#009a09', '#990000', '#5f9ea0', '#7b990c', '#299086',  '#ad0291', '#159eb4', '#559b2f','#459075', '#980373', '#270c5c', '#8a0696', '#300da9', '#000a09', '#999000', '#5f0ea0');
}

function smarty_function_light_color_array(){
return array('#467300', '#ad0057', '#008b8b', '#7f4f10', '#0a6969', '#990000', '#987373', '#8a9696', '#9f880c', '#107190', '#bc0722', '#557189');
}   

?>