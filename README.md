# This repo is archived

# MRIIDS

## Site URL 
http://mriids.org/

## General Tech Stack/Framework
The MRIIDS front end is build using React 16.5.2

## Dependencies
  - [d3-fetch](https://github.com/d3/d3-fetch)
  - [immer](https://github.com/mweststrate/immer)
  - [jquery](https://jquery.com/)
  - [mapbox-gl](https://www.mapbox.com/mapbox-gl-js/api/)
  - [moment](https://momentjs.com/)
  - [moment-range](https://github.com/rotaready/moment-range)
  - [node-sass](https://www.npmjs.com/package/node-sass)
  - [rc-slider](https://www.npmjs.com/package/rc-slider)
  - [react](https://reactjs.org/)
  - [react-bootstrap](https://react-bootstrap.github.io/)
  - [react-google-charts](https://react-google-charts.com/)
  - [react-map-gl](https://uber.github.io/react-map-gl/#/)
  - [react-toggle](http://aaronshaf.github.io/react-toggle/)
  - [styled-components](https://www.styled-components.com/)

  ## Get Started
  1. Clone this repo: 
      ```
      https://github.com/healthmap/mriids.git
      ```

  2. Change into the directory 
      ```
      cd mriids
      ```

  3. Delete the `node-modules` directory (`rm -rf node_modules`) and the `package-lock.json` file.

  4. Install dependencies
      ```
      npm install
      ```

  5. While working on the app, you can serve it locally to  http://localhost:3000 by running:

      ```
      npm start
      ```

  ## Deployment
1. Login to the MRIIDS server
    ```
    Instructions here: http://websvc4:8090/display/FIT/Logging+into+MRIIDS+server
    ```
2. On home directory (cd ~), clone the latest code from GitHub
    ```
    sudo git clone https://github.com/healthmap/mriids.git <NAME YOU WANT FOR THE DIRECTORY>
    ```
3. Make a directory in /var/www/html/
    ```
    sudo mkdir <NAME OF DIRECTORY>
    ```
4. Copy this directory into /var/www/html/<NAME OF DIRECTORY>
    ```
    sudo cp -a <NAME OF DIRECTORY>/. /var/www/html/<NAME OF DIRECTORY>
    ```
5. Change into the directory
    ```
    cd <NAME OF DIRECTORY>
    ```
6. Install dependencies
    ```
    sudo npm install --unsafe-perm=true --allow-root
    ```
7. Create the build/ folder
    ```
    sudo npm run build
    ```
8. Change the root of the app: 
    ```
    sudo vim /etc/nginx/conf.d/default.conf
    ```
9. Restart nginx
    ```
    sudo nginx -s reload
    ```
