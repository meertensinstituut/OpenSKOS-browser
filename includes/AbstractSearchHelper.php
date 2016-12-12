<?php
/**
 * Created by PhpStorm.
 * User: JanPieterK
 * Date: 12-05-15
 * Time: 13:46
 */

namespace VLO;


abstract class AbstractSearchHelper
{
  abstract public function handleQuery($query);

  abstract public function getTemplateData();

  abstract public function getAction($query);

  public function cleanURL()
  {
  }
}