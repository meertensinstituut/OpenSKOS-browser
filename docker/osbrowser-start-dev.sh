
docker run -d -p 80:80 --name openskos2browser -t -v /Applications/MAMP/htdocs/OpenSKOS-browser:/app/OpenSKOS-browser openskos2browser /run.sh

echo "Started openskos2browser container"
echo "Visit the openskos2browser at: http://yourhost:yourport/OpenSKOS-browser"
echo "Or attach to the openskos2browser container: docker exec -t -i openskos2browser /bin/bash -l"
