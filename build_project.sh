CURRENT_DIR=$(pwd)

ng build --configuration=production

sudo cp .htaccess $CURRENT_DIR/dist/Geonovis/browser/

sudo cp -r $CURRENT_DIR/dist/Geonovis/* /var/www/Geonovis/