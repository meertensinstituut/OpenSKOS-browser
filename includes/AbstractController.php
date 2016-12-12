<?php
/**
 * Created by PhpStorm.
 * User: JanPieterK
 * Date: 12-05-15
 * Time: 14:40
 */

namespace VLO;


abstract class AbstractController {

  abstract public function handleRequest($template, $searchHelper, $request);
}