const index3 = (async function() {
    //登录验证
    const selfRespObj = await API.self();
    if (!selfRespObj.data) {
        alert('未登录或登录已过期，请重新登录');
        location.href = './login.html';
        return;
    }
    const doms = {
        main: {
            'chat-container': $('.chat-container'),
            'msg-container': $('.msg-container'),
            // msgInput: this["msg-container"].children  //这个问题得解决
            msgInput: $('#txtMsg')
        },
        aside: {
            nickname: $('#nickname'),
            loginId: $('#loginId')
        },
        close: $('.close')
    }


    //设置用户信息
    function setUserMessage() {
        doms.aside.loginId.innerText = selfRespObj.data.loginId;
        doms.aside.nickname.innerText = selfRespObj.data.nickname;
    }

    setUserMessage();
    //加载历史记录
    async function loadHistory() {
        const historyArr = await API.history();
        for (const item of historyArr.data) {
            drawMessage(item);
        }
        scrollToBottom();
    }
    loadHistory();


    //工具函数：翻译时间戳
    function toolDate(xString) {
        const date = new Date(xString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const secound = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${secound}`;
    }

    //工具函数：渲染一条消息
    function drawMessage(mObj) {
        const div = $$$('div');
        div.classList.add('chat-item');
        doms.main["chat-container"].appendChild(div);
        const img = $$$('img');
        img.className = 'chat-avatar';
        div.appendChild(img);
        const chatDiv = $$$('div');
        chatDiv.className = 'chat-content';
        chatDiv.innerText = mObj.content;
        div.appendChild(chatDiv);
        const timeDiv = $$$('div');
        timeDiv.className = 'chat-date';
        timeDiv.innerText = toolDate(mObj.createdAt);
        div.appendChild(timeDiv);
        if (mObj.from) {
            div.classList.add('me');
            img.src = './asset/avatar.png';
        } else {
            img.src = "./asset/robot-avatar.jpg"
        }
    }

    //工具函数：聊天框滚动条拉到底
    function scrollToBottom() {
        doms.main["chat-container"].scrollTop = doms.main["chat-container"].scrollHeight;
    }


    //发送消息
    async function sendChat(inputContent) {
        if (!inputContent) {
            return;
        }
        const heroObj = {
            content: inputContent,
            createdAt: Date.now(),
            from: selfRespObj.data.loginId,
            to: null
        }
        drawMessage(heroObj);
        doms.main.msgInput.value = '';
        scrollToBottom();
        const respObj = await API.chat({ content: inputContent });
        const nullObj = {
            content: respObj.data.content,
            createdAt: toolDate(respObj.data.createdAt),
            from: null,
            to: selfRespObj.data.loginId
        }
        drawMessage(nullObj);
        scrollToBottom();
    }

    doms.main["msg-container"].addEventListener('submit', async function(e) {
        e.preventDefault();
        sendChat(doms.main.msgInput.value);
    });


    //注销登录
    doms.close.addEventListener('click', function() {
        API.logOut();
        location.href = './login.html';
    })
})()