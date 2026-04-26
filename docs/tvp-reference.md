do# TVP Reference Card

## Domain
| | |
|---|---|
| Registrar | Cloudflare |
| Domain | `aglots.com` |
| Subdomain | `tvp.aglots.com` |
| DNS Record | A → `137.184.236.9` |

---

## VPS
| | |
|---|---|
| Provider | DigitalOcean |
| IP | `137.184.236.9` |
| OS | Ubuntu |
| SSH | `ssh root@137.184.236.9` |

---

## nginx
| | |
|---|---|
| Config file | `/etc/nginx/sites-available/default` |
| Enabled via | `/etc/nginx/sites-enabled/` |
| Reload | `systemctl reload nginx` |
| Test config | `nginx -t` |
| Port 80 | Redirects to HTTPS |
| Port 443 | Serves static files + proxies `/api/ejf/` |

---

## SSL
| | |
|---|---|
| Provider | Let's Encrypt (Certbot) |
| Cert path | `/etc/letsencrypt/live/tvp.aglots.com/` |
| Auto-renew | Yes (Certbot cron) |

---

## Static Site
| | |
|---|---|
| Root on VPS | `/var/www/vapor-place` |
| Local path | `OneDrive/vapor-place` |
| GitHub repo | `vincentimpellitteri-coder/vapor-place` |
| Branch | `master` |

---

## E-Juice Finder API
| | |
|---|---|
| Process name (PM2) | `ejf-api` |
| Server file | `/var/www/vapor-place/ejf-server.js` |
| Port | `3002` |
| Data file | `/var/www/vapor-place/ejf-data.json` |
| nginx proxy | `location /api/ejf/` → `localhost:3002` |

### API Endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/ejf/products` | Fetch all products |
| PUT | `/api/ejf/products` | Save all products |
| GET | `/api/ejf/shop` | Fetch shop info |
| PUT | `/api/ejf/shop` | Save shop info |
| POST | `/api/ejf/auth` | Verify admin password |
| PUT | `/api/ejf/password` | Change admin password |

---

## PM2 Commands
```bash
pm2 status                  # see all running processes
pm2 restart ejf-api         # restart the API
pm2 logs ejf-api            # tail logs
pm2 save                    # persist process list across reboots
```

---

## Deploy Workflow
```bash
# 1. Edit locally
#    OneDrive/vapor-place/...

# 2. Push to GitHub
git add <files>
git commit -m "message"
git push

# 3. Pull on VPS
ssh root@137.184.236.9
cd /var/www/vapor-place && git pull origin master
```

---

## Key URLs
| | |
|---|---|
| Live site | `https://tvp.aglots.com` |
| E-Juice Finder | `https://tvp.aglots.com/ejuicefinder.html` |
| GitHub repo | `https://github.com/vincentimpellitteri-coder/vapor-place` |
