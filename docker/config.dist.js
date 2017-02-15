
// the file must be customized accroding to your server configuration and saved as config.js
var openskos = (function (openskos) {
  "use strict";

  openskos.config = {
    host: "frontendhost", 
    port: "frontendport", 
    protocol: "frontendprotocol",
    basepath: "OpenSKOS-browser",  
    proxypath: "sites/openskos/html/proxy.php",
    success: "success",
    searchfieldsmap:  {
      "Labels" : "prefLabel altLabel hiddenLabel", 
      "Definition" : "definition", 
      "DefaultDocumentationFields" : "changeNote definition editorialNote example historyNote note scopeNote"
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
