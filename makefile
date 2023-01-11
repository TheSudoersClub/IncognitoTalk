main: chat-server home-server socket-server other-files

chat-server:
	pkg src/server/chat/chat-server.js && mv chat-server-* IncognitoTalk/server/chat/ && pkg src/server/chat/forward-chat-server.js && mv forward-chat-server-* IncognitoTalk/server/chat/

home-server:
	pkg src/server/home/home-server.js && mv home-server-* IncognitoTalk/server/home/ 

socket-server:
	pkg src/server/socket/socket-server.js && mv socket-server-* IncognitoTalk/server/socket/ && pkg src/server/socket/forward-socket-server.js && mv forward-socket-server-* IncognitoTalk/server/socket/

other-files: 
	cp -rf src/home/ IncognitoTalk/ && cp -rf src/main/ IncognitoTalk/