/* Inspiratie voor Nederlab-javascript: http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html */
/*jslint browser: true, indent: 2, todo: true */
// deze mag niet naar de GitHUB!
var openskos = (function (openskos) {
  "use strict";
  openskos.config = {
    host: "localhost", 
    port: "80", 
    protocol: "http",
    basepath: "OpenSKOS-browser",  
    proxypath: "sites/openskos/html/proxy.php",
    success: "success",
    searchfieldsmap:  {
      "Labels" : "prefLabel altLabel hiddenLabel", 
      "Definition" : "definition", 
      "DefaultDocumentationFields" : "changeNote editorialNote example historyNote note scopeNote"
  },
    highlightablefields: ['prefLabel', 'altLabel', 'hiddenLabel', 'definition', 'notation', 'note', 'scopeNote', 'changeNote', 'editorialNote', 'historyNote', 'example'],
    itemsperpage: 10,
    maxitems: 100000,
    defaultLicense: 'Creative Commons Attribution (CC BY)',
    defaultLicenseReference: 'http://creativecommons.org/licenses/by/4.0/'
  };
   
  openskos.config.proxyurl = openskos.config.protocol + "://"+openskos.config.host+":"  + openskos.config.port + "/" + openskos.config.basepath + "/" +openskos.config.proxypath;
  openskos.config.workspaceurl = "//" + openskos.config.host+":"  + openskos.config.port + "/" + openskos.config.basepath;
  openskos.config.resourcepath = "sites/openskos/";
  openskos.config.webresourcespath = openskos.config.resourcepath + "html/";
  
  return openskos;

}(window.openskos || {}));