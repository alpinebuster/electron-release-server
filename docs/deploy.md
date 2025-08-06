# Deployment

Electron Release Server can be easily be deployed to your own server.

## General Configuration:

Install dependencies using:

```
npm install
```

**Action Step:** You need to configure database ([database setup guide](database.md)) and must create a `config/local.js` file, which contains the configuration options required to run the server.

To assist this process, you can copy `config/local.template` and edit it using:
```bash
cp config/local.template config/local.js
vim config/local.js
```

Then start the application using:

```
npm start
```

Browse to `http://localhost:1337/`

## Using Nginx

If you want to use nginx as web-server:

```nginx
server {
    listen       80;
    server_name  download.yourdomain.com;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Nginx-Proxy true;

        proxy_pass http://127.0.0.1:1337/;
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

## Using certbot

### Configure basic nginx
```nginx
server {
    listen 80;
    server_name web01.alpinebuster.top;

    client_max_body_size 900M;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        proxy_http_version 1.1; # WebSocket requires the HTTP/1.1 protocol.
        proxy_set_header Upgrade $http_upgrade; # This is to upgrade the connection to WebSocket.
        proxy_set_header Connection "upgrade"; # Allows the connection upgrade (required).
    }
}
```

```sh
sudo ln -s /etc/nginx/sites-available/web01.conf /etc/nginx/sites-enabled/web01.conf
sudo nginx -t
sudo systemctl reload nginx
sudo journalctl -u nginx -n 50
```

### Configure certbot

```sh
# Install system dependencies
sudo apt update
sudo apt install python3 python3-dev python3-venv libaugeas-dev gcc
# Remove certbot-auto and any Certbot OS packages
# If you have any Certbot packages installed using an OS package manager like apt, dnf, or yum, you should remove them before installing the Certbot snap to ensure that when you run the command certbot the snap is used rather than the installation from your OS package manager. The exact command to do this depends on your OS, but common examples are sudo apt-get remove certbot, sudo dnf remove certbot, or sudo yum remove certbot.
sudo apt-get remove certbot

# Set up a Python virtual environment
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot certbot-nginx
sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot

# Configure nginx for `example.com` and `www.example.com` FIRST!!!
# Run this command to get a certificate and have Certbot edit your nginx configuration automatically to serve it, turning on HTTPS access in a single step.
sudo certbot --nginx -d example.com -d www.example.com
# Set up automatic renewal
# We recommend running the following line, which will add a cron job to the default crontab.
echo "0 0,12 * * * root /opt/certbot/bin/python -c 'import random; import time; time.sleep(random.random() * 3600)' && sudo certbot renew -q" | sudo tee -a /etc/crontab > /dev/null

# [Monthly] Upgrade certbot
# It's important to occasionally update Certbot to keep it up-to-date. To do this, run the following command on the command line on the machine.
sudo /opt/certbot/bin/pip install --upgrade certbot certbot-nginx

sudo journalctl -u frpc -n 50
sudo certbot certificates
# NOTE: Also delete the related conf in `/etc/nginx/sites-enabled/`
sudo certbot delete --cert-name web01.alpinebuster.top
```

Browse to `http://download.yourdomain.com/`

## Database setup
See the [database setup guide](database.md).

## Authentication
See the [authentication guide](authentication.md).

## Deployment
See the [Sails deployment documentation](http://sailsjs.org/documentation/concepts/deployment).

To start the server in deployment mode use:
```
npm start --prod
```

> Note: In production you should use a process manager such as [pm2](http://pm2.keymetrics.io/)
