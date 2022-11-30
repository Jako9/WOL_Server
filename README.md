### WOL_Server

This is a serverside sript intendet to be used in connection with the open-source Android-App [Wake On Lan Client](https://play.google.com/store/apps/details?id=wol.wol).
Using this sript, it will be possible to wake any LAN device and request its online status in a local network from everywhere on the earth.

This sript was designed to be used with linux.

## Setup

It is highly recommended to use a ddns-service for your device in order to reliably talk to it via the app. Even though the communication also works over IPs, those are bound to change.
Thats why I recommend using a service like [no-ip](https://www.noip.com/) for IPv4, or [Dynv6](https://dynv6.com/) for IPv6. They are both free.

1. Use your local device that runs 24/7 on your local network and clone into this repository 
```sh
git clone https://github.com/Jako9/WOL_Server.git
```
2. Open a port on your local network on which the service will run and forward it to your current device.
3. Generate or choose a key _(String)_ to secure the communication between the app and the server. **Don't share this key and if it is leaked, please generate and use a new one!**
```sh
echo $RANDOM | md5sum | head -c 20; echo;
```
4. Edit your crontab so that the sript runs on reboot
```sh
crontab -e
@reboot node PATHTOSCRIPT/wol.js -port PORT -key KEY
```
Where you substitude your open port for _Port_, you generated key for _key_ and the path to your script for _PATHTOSCRIP_
5. After this step, you can close your crontab and reboot your device
```sh
reboot
```

## Andoid-App

When installing the Android-App, on first launch, you will be asked to enter some basic information.

1. The Default IP-Address is the Address of your ddns-service, or the IP of the device which runs the script
2. The port is the one you ran the script with
3. The key is the key you generated

You can use one app to controll many different local networks. For this, just edit the device of the different network and assign a custom IP-Address, port and key.

## Error

If your script is not running properly you can always try to run it manually via the terminal and see the error-messages
```sh
node wol.js -port PORT -key KEY
```
The most common type of errors are:
1. The port is already in use
In this case, just assign another port and try again
2. The imports fail
Just try reinstall the requirenments and save them to your local folder
```sh
npm install requirenments.txt --save
```

## Issues/Questions

If you encounter any bugs or any problems while setting up the script, don't hesitate to open an issue in this repository and I will fix it as soon as possible.
