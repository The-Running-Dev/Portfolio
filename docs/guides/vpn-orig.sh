#!/bin/bash
set -e

### === CONFIGURATION ===
LAN_IFACE=$(ip route | awk '/default/ {print $5}' | head -n1)
LAN_SUBNET="192.168.1.0/24"
VPN_IFACE="nordlynx"
PIHOLE_DNS_IP="127.0.0.1"
WATCHDOG_SCRIPT="/usr/local/bin/nordvpn-watchdog.sh"
CRON_EXPR="*/5 * * * * $WATCHDOG_SCRIPT"

echo "[+] Ensuring NordVPN CLI is installed..."
command -v nordvpn >/dev/null || sh <(curl -sSf https://downloads.nordcdn.com/apps/linux/install.sh)

echo "[+] Logging in to NordVPN (interactive)..."
nordvpn account || nordvpn login

echo "[+] Configuring NordVPN settings..."
[[ "$(nordvpn settings | grep -i 'technology')" == *"NordLynx"* ]] || nordvpn set technology nordlynx
[[ "$(nordvpn settings | grep -i 'killswitch')" == *"enabled"* ]] || nordvpn set killswitch on
[[ "$(nordvpn settings | grep -i 'autoconnect')" == *"enabled"* ]] || nordvpn set autoconnect on
nordvpn set notify off || true

echo "[+] Whitelisting LAN subnet $LAN_SUBNET..."
#nordvpn whitelist list | grep -q "$LAN_SUBNET" || nordvpn whitelist add subnet "$LAN_SUBNET"

echo "[+] Connecting to NordVPN..."
nordvpn status | grep -q 'Connected' || nordvpn connect

echo "[+] Enabling IP forwarding..."
grep -q "net.ipv4.ip_forward=1" ca || echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

echo "[+] Checking and applying iptables rules..."

# Check before adding FORWARD rules
iptables -C FORWARD -i "$LAN_IFACE" -o "$VPN_IFACE" -j ACCEPT 2>/dev/null || sudo iptables -A FORWARD -i "$LAN_IFACE" -o "$VPN_IFACE" -j ACCEPT
iptables -C FORWARD -o "$LAN_IFACE" -i "$VPN_IFACE" -m state --state RELATED,ESTABLISHED -j ACCEPT 2>/dev/null || \
  sudo iptables -A FORWARD -o "$LAN_IFACE" -i "$VPN_IFACE" -m state --state RELATED,ESTABLISHED -j ACCEPT

# Check before adding MASQUERADE rule
iptables -t nat -C POSTROUTING -o "$VPN_IFACE" -j MASQUERADE 2>/dev/null || \
  sudo iptables -t nat -A POSTROUTING -o "$VPN_IFACE" -j MASQUERADE

echo "[+] Installing iptables-persistent if not present..."
dpkg -l | grep -q iptables-persistent || sudo apt-get install -y iptables-persistent
sudo netfilter-persistent save

echo "[+] Ensuring DNS is set to Pi-hole..."
sudo chattr -i /etc/resolv.conf || true
grep -q "$PIHOLE_DNS_IP" /etc/resolv.conf || echo "nameserver $PIHOLE_DNS_IP" | sudo tee /etc/resolv.conf > /dev/null
sudo chattr +i /etc/resolv.conf

echo "[+] Creating VPN watchdog script..."
if [[ ! -f "$WATCHDOG_SCRIPT" ]]; then
  sudo tee "$WATCHDOG_SCRIPT" > /dev/null <<EOF
#!/bin/bash
if ! nordvpn status | grep -q "Status: Connected"; then
    echo "[Watchdog] VPN disconnected. Reconnecting..."
    nordvpn connect
fi
EOF
  chmod +x "$WATCHDOG_SCRIPT"
fi

echo "[+] Installing cron job for VPN watchdog..."
crontab -l 2>/dev/null | grep -qF "$WATCHDOG_SCRIPT" || \
  (crontab -l 2>/dev/null; echo "$CRON_EXPR") | crontab -

echo "[✔] Complete. Host, LAN, and containers are routed through NordVPN."
echo "    → Gateway: $(ip -4 addr show "$LAN_IFACE" | grep -oP '(?<=inet\s)\d+(\.\d+){3}')"
echo "    → DNS:     $PIHOLE_DNS_IP"
