#!/bin/bash
# Automated NordVPN setup and routing script for Ubuntu
# Based on the full instructions in nordvpn.md
# Run as root or with sudo

set -e

# --- 1. Install NordVPN CLI ---
echo "[+] Installing NordVPN CLI..."
if ! command -v nordvpn >/dev/null 2>&1; then
  sh <(curl -sSf https://downloads.nordcdn.com/apps/linux/install.sh)
else
  echo "[+] NordVPN CLI already installed."
fi

# --- 2. Login (manual step required) ---
echo "[!] Please login to NordVPN in another terminal window:"
echo "    nordvpn login"
echo "Then return and press Enter to continue."
read -p "Press Enter to continue after login..."

# --- 3. Best Practice NordVPN Settings ---
echo "[+] Applying recommended NordVPN settings..."
nordvpn set technology nordlynx
nordvpn set firewall enabled
nordvpn set killswitch enabled
nordvpn set autoconnect on
nordvpn set meshnet off
nordvpn set notify off
nordvpn set analytics off
nordvpn set threatprotectionlite off
nordvpn set ipv6 off
# Set DNS to local resolver (edit as needed)
nordvpn set dns 192.168.1.2

# --- 4. Connect to VPN ---
echo "[+] Connecting to NordVPN..."
nordvpn connect

# --- 5. Enable IP Forwarding ---
echo "[+] Enabling IP forwarding..."
sysctl -w net.ipv4.ip_forward=1
grep -q '^net.ipv4.ip_forward=1' /etc/sysctl.conf || echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf

# --- 6. Routing Table ---
echo "[+] Setting up custom routes..."
ip route replace default via 10.5.0.1 dev nordlynx
ip route add 192.168.1.0/24 dev enp2s0 || true

# --- 7. NAT & MASQUERADE with iptables ---
echo "[+] Configuring iptables for NAT and LAN forwarding..."
iptables -t nat -F
iptables -F
iptables -t nat -A POSTROUTING -o nordlynx -j MASQUERADE
iptables -A FORWARD -i enp2s0 -o nordlynx -j ACCEPT
iptables -A FORWARD -i nordlynx -o enp2s0 -m state --state RELATED,ESTABLISHED -j ACCEPT

# --- 8. Local DNS Routing (if using Pi-hole/dnscrypt-proxy) ---
echo "[+] Ensuring local DNS is routed outside VPN tunnel..."
ip rule add to 192.168.1.2 table main || true

# --- 9. Allow DNS from LAN ---
echo "[+] Allowing DNS requests from LAN..."
iptables -A INPUT -p udp --dport 53 -s 192.168.1.0/24 -j ACCEPT
iptables -A INPUT -p tcp --dport 53 -s 192.168.1.0/24 -j ACCEPT

# --- 10. Persist iptables rules ---
echo "[+] Installing iptables-persistent and saving rules..."
apt-get update && apt-get install -y iptables-persistent
netfilter-persistent save

# --- 11. Enable auto-reconnect on boot ---
echo "[+] Adding nordvpn autoconnect to crontab..."
if ! crontab -l | grep -q 'nordvpn connect'; then
  (crontab -l 2>/dev/null; echo '@reboot nordvpn connect') | crontab -
fi

echo "[+] VPN setup complete! Use 'nordvpn status' to verify."
