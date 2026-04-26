# How to Build tvp.aglots.com — Step by Step

A plain-English guide covering everything from buying the domain to a live website.

---

## Step 1 — Buy a Domain

1. Go to [cloudflare.com](https://cloudflare.com) and create a free account
2. Click **Domain Registration → Register a Domain**
3. Search for your domain (e.g. `aglots.com`) and purchase it
4. Cloudflare will automatically manage your DNS — no separate DNS provider needed

---

## Step 2 — Rent a Server (VPS)

1. Go to [digitalocean.com](https://digitalocean.com) and create an account
2. Click **Create → Droplet**
3. Choose:
   - **Image**: Ubuntu (latest LTS)
   - **Plan**: Basic shared CPU (smallest is fine to start)
   - **Region**: pick the closest to your customers
   - **Authentication**: SSH Key (more secure) or Password
4. Click **Create Droplet**
5. Note your server's IP address (e.g. `137.184.236.9`) — you'll need it throughout

---

## Step 3 — Point Your Domain to the Server

1. In Cloudflare, go to your domain → **DNS → Records**
2. Click **Add Record**
   - **Type**: A
   - **Name**: `tvp` (this creates `tvp.aglots.com`)
   - **IPv4 address**: your server IP (e.g. `137.184.236.9`)
   - **Proxy status**: DNS only (grey cloud) to start
3. Click **Save**
4. DNS can take a few minutes to an hour to propagate

---

## Step 4 — Connect to Your Server

Open Terminal and run:

```bash
ssh root@137.184.236.9
```

You are now inside your server. All following steps run here unless noted.

---

## Step 5 — Install Required Software

```bash
# Update the server
apt update && apt upgrade -y

# Install nginx (web server)
apt install nginx -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install nodejs -y

# Install PM2 (keeps Node apps running)
npm install -g pm2

# Install Certbot (free SSL certificates)
apt install certbot python3-certbot-nginx -y

# Install git
apt install git -y
```

---

## Step 6 — Create a Folder for Your Website

```bash
mkdir -p /var/www/vapor-place
```

---

## Step 7 — Set Up GitHub and Deploy Your Code

### On your local computer:
1. Go to [github.com](https://github.com) and create a free account
2. Create a new repository (e.g. `vapor-place`)
3. In your project folder on your computer, run:

```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/YOUR-USERNAME/vapor-place.git
git push -u origin master
```

### On the server:
```bash
cd /var/www/vapor-place
git init
git remote add origin https://github.com/YOUR-USERNAME/vapor-place.git
git pull origin master
```

---

## Step 8 — Configure nginx

1. Open the nginx config file:

```bash
nano /etc/nginx/sites-available/default
```

2. Find the `server` block and update it to look like this:

```nginx
server {
    listen 80;
    server_name tvp.aglots.com;
    root /var/www/vapor-place;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

3. Save the file (`Ctrl+X` → `Y` → Enter)
4. Test and reload nginx:

```bash
nginx -t
systemctl reload nginx
```

5. Visit `http://tvp.aglots.com` — your site should load over HTTP

---

## Step 9 — Add Free SSL (HTTPS)

```bash
certbot --nginx -d tvp.aglots.com
```

- Follow the prompts, enter your email, agree to terms
- Certbot automatically updates your nginx config and enables HTTPS
- Visit `https://tvp.aglots.com` — your site is now secure 🔒
- SSL renews automatically — nothing to maintain

---

## Step 10 — Add a Node.js API (optional, for dynamic data)

If your site needs a backend (like the E-Juice Finder):

1. Create your server file (e.g. `ejf-server.js`) in `/var/www/vapor-place`
2. Install dependencies:

```bash
cd /var/www/vapor-place
npm install express
```

3. Start the app with PM2:

```bash
pm2 start ejf-server.js --name ejf-api
pm2 save
pm2 startup
```

4. Add a proxy in your nginx config so the API is accessible from the web:

```nginx
location /api/ejf/ {
    proxy_pass http://localhost:3002;
    proxy_set_header Host $host;
}
```

5. Reload nginx:

```bash
nginx -t && systemctl reload nginx
```

---

## Step 11 — Deploy Updates

Every time you make changes to your site:

### On your local computer:
```bash
git add .
git commit -m "describe your change"
git push
```

### On the server:
```bash
ssh root@137.184.236.9
cd /var/www/vapor-place && git pull origin master
```

Your changes are live immediately.

---

## Quick Reference

| What | Where |
|---|---|
| Domain registrar | Cloudflare |
| Server provider | DigitalOcean |
| Server IP | `137.184.236.9` |
| Website files | `/var/www/vapor-place` |
| nginx config | `/etc/nginx/sites-available/default` |
| SSL certificates | `/etc/letsencrypt/live/tvp.aglots.com/` |
| API process | `pm2 status` |
| Code repository | github.com/vincentimpellitteri-coder/vapor-place |
| Live site | https://tvp.aglots.com |
