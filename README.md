# OpenSKOS-browser
1. Run OpenSKOS browser within MAMP
===============================================================================

1.1 Get the sources
-------------------------------------------------------------------------------
E.g. git-clone this repository to htdocs directory withing your /Applications/MAMP directory. 

1.2  Make two customized configuration files: config.inc.php and config.js
-------------------------------------------------------------------------------
Copy config.inc.dist.php, which is located in <..>/docker, and place the copy into <..>/sites/openskos/config directory.
Rename it to config.inc.php, exclude from commits (ignore) and edit. Editing is replacing dummy parameters with your settings, 
such as remote uris and a password. When editing follow short instructions given in the comments in the rows to edit.

Do the same with config.dist.js located in <..>/docker. It must be renamed to config.js and 
placed in the directory <..>/sites/openskos/javascript/openskos.

1.3 Run composer
-------------------------------------------------------------------------------
Run "php composer.php install" in the project's main directory.

1.4 Development
-------------------------------------------------------------------------------
Make a new project from existing sources in your IDE by using the obtained (cloned) source directory.



2. Run OpenSKOS browser within Docker
===============================================================================

2.1. Download Dockerfile 
-------------------------------------------------------------------------------------------
Download https://github.com/meertensinstituut/OpenSKOS-browser/blob/master/docker/Dockerfile

2.2. Build  image with parameters
---------------------------------------------------------------------------------------------
Example of the build command:
docker build --build-arg DEFAULTBACKEND="http://someadress/clavas/public/api" --build-arg FRONTENDPORT=87 --build-arg FRONTENDHOST=somehost --build-arg FRONTENDPROTOCOL=http --build-arg REMOTEBACKENDS="http://someadress/ccr/public/api--ccr example,http://somehost/clavas/public/api-- clavas example" -t openskos2browser .


2.3. Start docker 
---------------------------------------------------------------------------------------------
Use script https://github.com/meertensinstituut/OpenSKOS-browser/blob/master/docker/osbrowser-start.sh
If necessary, you will need adjust settings "-p 80:80" with the pair of outside-port:inner-container-port of your instance.

2.4. Docker for development
---------------------------------------------------------------------------------------------
Set up config.js and config.inc.php manually, as described in the instructions for MAMP.

Set "chmod 777 smarty" within the project's directory and "chmod 777 templates" "chmod 777 cache" within smarty.

Rename docker/Dockerfile_dev file into docker/Dockerfile and use it. Copy config.dist.js and config.inc.dist.php to the directory, where Dockerfile is, do not rename them.

Use script https://github.com/meertensinstituut/OpenSKOS-browser/blob/master/docker/osbrowser-start-dev.sh
If necessary, you will need adjust settings "-p 80:80" with the pair of outside-port:inner-container-port of your instance.

