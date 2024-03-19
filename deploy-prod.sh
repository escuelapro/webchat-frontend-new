REST_API=https://escuela-chat-test.web.app/ \
WS_URI=albertincx-telechat-1.glitch.me \
npm run build
cp ./start.js ./dist/
cp ./dist/index.html ./dist/assets/
firebase deploy --only hosting:escuela-chat-test

