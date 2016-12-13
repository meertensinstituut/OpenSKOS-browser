
docker run -d -p 80:80 --name openskos2browser  openskos2browser /run.sh

echo "Started openskos2browser container"
echo "Visit the openskos2browser at: http://localhots:80/OpenSKOS-browser"
echo "Or attach to the openskos2browser container: docker exec -t -i openskos2browser /bin/bash -l"
