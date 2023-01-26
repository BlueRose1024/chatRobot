const loginIdValid = new UserValidator('txtLoginId', function(inputValue) {
    if (!inputValue) {
        return '请输入账号';
    }
});

const loginPwd = new UserValidator('txtLoginPwd', function(inputValue) {
    if (!inputValue) {
        return '请输入密码';
    }
})

$('.user-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const result = UserValidator.runValidFn(
        loginIdValid,
        loginPwd
    )
    if (!result) {
        return; //验证未通过
    }
    const fd = new FormData($('.user-form'));
    const xObj = fd.entries();
    const dataObj = Object.fromEntries(xObj);
    const respObj = await API.login(dataObj);
    if (respObj.code === 0) {
        alert('登录成功,点击确定，跳转到主页');
        location.href = './index.html';
    }
})