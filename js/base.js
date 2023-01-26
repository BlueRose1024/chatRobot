const API = (function() {
    const BASE_URL = 'https://study.duyiedu.com';
    const TOKEN_KEY = 'token';

    async function get(path) {
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE_URL + path, {
            headers
        });
    }

    async function post(path, bodyObj) {
        const headers = {
            'Content-Type': 'application/json',
        };
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE_URL + path, {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyObj)
        })
    }



    async function register(userInfo) {
        const respObj = await post('/api/user/reg', userInfo)
        return respObj.json();
    }


    async function login(userInfo) {
        const respObj = await post('/api/user/login', userInfo)
        const finalData = await respObj.json();
        if (finalData.msg === '') {
            localStorage.setItem(TOKEN_KEY, respObj.headers.get('authorization')); //如果登录成功了，我就把令牌存到localStorage里去。
        }
        return finalData;
    }



    //查看当前登录消息    //同时页是作为主页墙的存在。
    async function self() {
        const respObj = await get('/api/user/profile');
        return await respObj.json();
    }
    //查看是否账号是否存在
    async function checkExit(loginId) {
        const respObj = await get('/api/user/exists?loginId=' + loginId);
        return await respObj.json();
    }
    //发送聊天消息
    async function chat(chatContent) {
        const respObj = await post('/api/chat', chatContent);
        return await respObj.json();
    }
    async function history() {
        const respObj = await get('/api/chat/history');
        return await respObj.json();
    }

    //注销登录
    function logOut() {
        localStorage.removeItem(TOKEN_KEY);
    }

    return {
        register,
        login,
        self,
        checkExit,
        chat,
        history,
        logOut
    }
})()