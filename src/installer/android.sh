#! /data/data/com.termux/files/usr/bin/bash

ALL_SET=0

STARTSERVER() {
    # .IncognitoTalk/server/home/home-server-linux &
    cd .IncognitoTalk && node run.js &
    sleep 10 && LINK=$(cat .IncognitoTalk/src/server/chat/link.txt)
    echo "Invite link: http://$LINK" && echo
    echo "N: Do not close the appliction unless you want to terminate the server"
    read
}

clear

if [[ -d ".IncognitoTalk" && $(which bore) != ' ' && $(which python) != ' ' ]]; then
    ALL_SET=1
else
    clear
    echo "IncognitoTalk needs you to install necessary packages;"
    read -p "Continue [Y/n] : " CHOICE && echo
    CHOICE=$(echo $CHOICE | tr '[:lower:]' '[:upper:]')

    if [[ $CHOICE == 'Y' ]]; then
        pkg install bore -y
        pkg install python -y
        pkg install nodejs-lts -y
        npm install ws --global
        pip install gdown && clear

        mkdir ".IncognitoTalk" && cd ".IncognitoTalk" && gdown https://drive.google.com/uc?id=1758nd2esX2Zv2DXOQ1jhU8osqFezmZr8
        unzip "IncognitoTalk_Android.zip" && rm IncognitoTalk_Android.zip && cd ..
        chmod +x ".IncognitoTalk" -R
        ALL_SET=1
        clear
    else
        exit 1
    fi
fi

if [[ $ALL_SET ]]; then
    STARTSERVER
fi
