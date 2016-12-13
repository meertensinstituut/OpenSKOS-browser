FROM lamp:latest

RUN apt-get update &&\
apt-get -y install php5-curl curl wget unzip

# example of using argument 

ARG REMOTEBACKENDS="http://somehost/ccr/public/api--ccr cloud,uri2-name2"
ARG DEFAULTBACKEND=http://somehost/ccr/public/api
ARG FRONTENDHOST=somehost
ARG FRONTENDPORT=xx
ARG FRONTENDPROTOCOL=yyy

# install composer:
RUN mkdir -p /tmp/composer &&\
cd /tmp/composer &&\
curl -sS https://getcomposer.org/installer | php &&\
mv composer.phar composer
ENV COMPOSER_HOME=/tmp/composer

# install OpenSKOS-2 browser:
RUN rm -rf /app &&\
cd / &&\

git clone -b master https://github.com/meertensinstituut/OpenSKOS-browser.git /app/OpenSKOS-browser &&\
mkdir -p /app/OpenSKOS-browser/smarty/cache &&\
mkdir -p /app/OpenSKOS-browser/smarty/configs &&\
mkdir -p /app/OpenSKOS-browser/smarty/plugins &&\
mkdir -p /app/OpenSKOS-browser/smarty/templates &&\
mkdir -p /app/OpenSKOS-browser/smarty/templates_c &&\
chmod -R ugo+rw /app/OpenSKOS-browser/smarty/templates_c &&\
chmod -R ugo+rw /app/OpenSKOS-browser/smarty/cache &&\
cd /app/OpenSKOS-browser &&\
/tmp/composer/composer install
ADD config.inc.dist.php /app/OpenSKOS-browser/sites/openskos/config/config.inc.php
ADD config.dist.js /app/OpenSKOS-browser/sites/openskos/javascript/openskos/config.js
RUN sed -i "s|remotebackenduris|${REMOTEBACKENDS}|g" /app/OpenSKOS-browser/sites/openskos/config/config.inc.php
RUN sed -i "s|defaultbackendnuri|${DEFAULTBACKEND}|g" /app/OpenSKOS-browser/sites/openskos/config/config.inc.php
RUN sed -i "s|frontendhost|${FRONTENDHOST}|g" /app/OpenSKOS-browser/sites/openskos/javascript/openskos/config.js
RUN sed -i "s|frontendport|${FRONTENDPORT}|g" /app/OpenSKOS-browser/sites/openskos/javascript/openskos/config.js
RUN sed -i "s|frontendprotocol|${FRONTENDPROTOCOL}|g" /app/OpenSKOS-browser/sites/openskos/javascript/openskos/config.js

# cleanup:
RUN rm -rf /tmp/*
CMD ["/run.sh"]


