FROM mongo:latest
COPY init.json /init.json
CMD mongoimport --host mongo --db nrspoe --collection users --drop --file /init.json --jsonArray
