# OpenSKOS-browser
1. Run OpenSKOS browser within MAMP
===============================================================================

1.1 Get the sources
-------------------------------------------------------------------------------
E.g. git-clone this repository to htdocs directory withing your /Applications/MAMP directory. 

1.2  Make two customized configuration files: config.inc.php and config.js
-------------------------------------------------------------------------------
Copy config.inc.dist.php, which is located in <..>/sites/openskos/config, and place the copy into the same directory.
Rename it to config.inc.php, exclude from commits (ignore) and edit. Editing is replacing questionmarks with your settings, 
such as remote uris and a password. When editing follow short instructions given in the comments in the rows to edit.

Do the same with config.dist.js located in <..>/sites/openskos/javascript/openskos. It must be renamed to config.js and 
placed in the same directory.

1.3 Run composer
-------------------------------------------------------------------------------
Run "php composer.php install" in the project's main directory.

1.4 Development
-------------------------------------------------------------------------------
Make a new project from existing sources in your IDE by using the obtained (cloned) source directory.



2. Run OpenSKOS browser within Docker (to do)
===============================================================================
