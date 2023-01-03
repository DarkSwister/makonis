FROM debian:buster
RUN echo 'deb http://deb.debian.org/debian buster-backports main' > /etc/apt/sources.list.d/backports.list
RUN apt-get update &&  apt-get install -y \
curl \
python \
wget \
supervisor \
gnupg \
apt-transport-https \
apt-utils

COPY script/alpr.sh .
RUN ./alpr.sh
RUN curl --silent --location https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get update &&  apt-get install -y nodejs
VOLUME /etc/openalpr/
WORKDIR /code
RUN npm install -g nodemon
COPY package.json /code/package.json
RUN npm install && npm ls
RUN mv /code/node_modules /node_modules
COPY . /code
EXPOSE 9091 9091
CMD ["/usr/bin/supervisord"]
EXPOSE 27017
EXPOSE 9091
