<?php

namespace VLO\OpenSkos;

class Strings
{

    public static function getTitle()
    {
        return 'OpenSKOS Concept Registries';
    }

    public static function getRemoteBackends()
    {
        $backends = explode(",", OPENSKOS_REMOTE_API);
        $retVal = [];
        for ($i = 0; $i < count($backends); $i++) {
            $pair = explode("--", $backends[$i]);
            $retVal[trim($pair[0])] = trim($pair[1]);
        }

        return $retVal;
    }

    public static function getSortOrders()
    {
        return array(
            'asc' => _('&#9650;'),
            'desc' => _('&#9660;')
        );
    }

    public static function getSearchFields()
    {
        $retval = array("Labels" => "Labels", "Definition" => "Definition", "DefaultDocumentationFields" => "Default documentation fields");
        return $retval;
    }

    public static function getSearchTermModes()
    {
        return array(OPENSKOS_DEFAULT_SEARCHMODE => 'Or (default)', 'and' => 'And');
    }

    public static function getMatchingTypes()
    {
        return array(OPENSKOS_DEFAULT_MATCHINGMODE => 'Part of word (default)', 'wholeword' => 'Whole word');
    }

    public static function getRelationDemoModes()
    {
        return array('table' => 'table', 'graph' => 'graph');
    }

    public static function getFilters($requestPath, $rel = false)
    {
        if ($rel) {
            $response = self::curlToServer($requestPath . '/filter?format=json&relations=true');
        } else {
            $response = self::curlToServer($requestPath . '/filter?format=json');
        }
        $result = array();
        foreach ($response as $key => $value) {
            $result[$key] = [];
            if ($key !== 'http://openskos.org/xmlns#status') {
                if ($key !== 'http://www.w3.org/ns/org#FormalOrganization') {
                    foreach ($value as $descr) {
                        $result[$key][$descr->uri] = $descr->title;
                    }
                } else {
                    foreach ($value as $descr) {
                        $result[$key][$descr->code] = $descr->title;
                    }
                }
            } else {
                foreach ($value as $status) {
                    $result[$key][$status] = $status;
                }
            }
        }
        return $result;
    }

    private static function curlToServer($request_url)
    {
        $ch = curl_init($request_url);
        $request_headers = array(
            'Content-Type: application/json',
            'Accept: application/json'
        );
        curl_setopt($ch, CURLOPT_HTTPHEADER, $request_headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        if (!$result) {
            trigger_error(curl_error($ch));
        }
        $response = curl_exec($ch);
        $retVal = json_decode($response);
        curl_close($ch);
        return $retVal;
    }

}
