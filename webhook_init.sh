#!/bin/bash
apt install webhook
cd ~
mkdir -p webhook
cd webhook
touch webhook.yaml
echo "
- id: zigger
  execute-command: $HOME/zigger/git_pull.sh
  command-working-directory: $HOME/zigger
  response-message: \"Zigger webhook executed successfully\"
" >> webhook.yaml
touch /etc/systemd/system/webhook.service
echo "
[Unit]
Description=Webhook service
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
User=$USER
ExecStart=/usr/bin/webhook --hooks $HOME/webhook/webhook.yaml --port 9000 -verbose

[Install]
WantedBy=multi-user.target
" > /etc/systemd/system/webhook.service
systemctl daemon-reload
systemctl enable webhook
systemctl start webhook
system status webhook