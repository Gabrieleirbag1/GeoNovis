CURRENT_DIR=$(pwd)

ng build --configuration=production

sudo cp .htaccess $CURRENT_DIR/dist/GeoNovis/browser/

sudo cp -r $CURRENT_DIR/dist/GeoNovis/* /var/www/GeoNovis/