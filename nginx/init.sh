mkdir temp
mkdir logs

cd conf
openssl req -nodes -new -x509 -keyout nginx.key -out nginx.cert
