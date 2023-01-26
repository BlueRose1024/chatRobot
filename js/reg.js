const loginValid = new UserValidator('txtLoginId', async function(inputValue) {
    if (!inputValue) {
        return '请输入账号';
    }
    const asyncData = await API.checkExit(inputValue);
    if (asyncData.data) {
        return '账号已经存在';
    }
});


const nickNameValid = new UserValidator('txtNickname', function(inputValue) {
    if (!inputValue) {
        return '请输入昵称';
    }
})

const loginPwdValid = new UserValidator('txtLoginPwd', function(inputValue) {
    if (!inputValue) {
        return '请输入密码';
    }
})

const LoginPwdConfirm = new UserValidator('txtLoginPwdConfirm', function(inputValue) {
    if (!inputValue) {
        return '请再次输入密码';
    }
    if (inputValue !== loginPwdValid.input.value) {
        return '两次密码输入不一致';
    }
})


$('.user-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const r = await UserValidator.runValidFn(
        loginValid,
        nickNameValid,
        loginPwdValid,
        LoginPwdConfirm
    );
    if (!r) {
        return; //全部都是false，验证未通过。
    }
    //方案1    自己从form表单里把数据包装成一个对象
    // const dataObj = {
    //     loginId: loginValid.input.value,
    //     nickname: nickNameValid.input.value,
    //     loginPwd: loginPwdValid.input.value
    // }
    //方案2    用FormData从form表单里把数据包装成一个对象。
    const fd = new FormData($('.user-form'));
    const xObj = fd.entries(); //这个entries方法返回的是一个叫迭代器的东西。
    const dataObj = Object.fromEntries(xObj); //Object的这个fromEntries可以把迭代器还原成一个对象。  

    const respObj = await API.register(dataObj);
    if (respObj.code === 0) {
        alert('注册成功,点击确定，跳转到登录页');
        location.href = './login.html';
    }
})