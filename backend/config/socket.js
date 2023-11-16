import Puppeteer from 'config/puppeteer-new';
import { addUser, removeUser, getAllUsers } from 'app/http/controllers/CurrentUsersController';

const socket = (io) => {
    io.on('connection', (socket) => {
        socket.on('joinRoom', (data, fn) => {
            fn({
                url: 'https://www.yell.com//biz/pearl-chartered-accountants-london-901367979/',
                img: 'data:image/png;base64,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',
                date: Date.now(),
                timeout: 60,
            });
        });

        socket.on('send_captcha_status_to_update', (data) => {
            io.emit('receive_captcha_status_to_update', data);
        });

        socket.on('send_captcha_to_remove', (data) => {
            io.emit('receive_captcha_to_remove', data);
        });

        //** COLLECT CURRENT USERS **//
        socket.on('send_current_user', async (data) => {
            let temp = {
                ...data,
                sid: socket.id,
            };

            addUser(temp);

            // console.log('user', data);
            const normalUsers = getAllUsers().filter((u) => u.role === 'normal');
            if (normalUsers) {
                const userIds = normalUsers.map((u) => u._id);
                const puppeteer = new Puppeteer();
                const browsers = puppeteer.get('browsers');
                if (browsers) {
                    const browserObj = browsers.filter((b) => !userIds.includes(b.userId));
                    if (browserObj) {
                        for (let bObj of browserObj) {
                            console.log(`browser [${bObj.browserId}] closed for user [${bObj.userId}]`);
                            await puppeteer.browserClose(bObj.browser);
                        }
                    }
                }
            }
        });

        //** AT CURRENT USER LOGOUT REMOVE**//
        socket.on('send_current_user_logout', (userId) => {
            removeUser(userId, null);
        });

        //** AT USER DISCONNECT **//
        socket.on('disconnect', () => {
            removeUser(null, socket.id);
        });

        socket.on('browserDisconnect', (browserId) => {
            socket.on('disconnect', async () => {
                const puppeteer = new Puppeteer();
                const browsers = puppeteer.get('browsers');

                if (!!browsers && browsers.length !== 0) {
                    const data = browsers.filter((b) => b.browserId === browserId)[0];

                    data && (await puppeteer.browserClose(data.browser));
                    // console.log(`Browser Proccess Id[${browserId}] disconnected.`);
                }
            });
        });
    });
};

export default socket;
