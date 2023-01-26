class UserValidator {
    /**
     * 
     * @param {string} inputId 
     * @param {Function} validFn 
     */
    constructor(inputId, validFn) {
        this.input = $('#' + inputId);
        this.p = this.input.nextElementSibling;
        this.validFn = validFn;
        // this.input.addEventListener('blur', function() {
        //     this.runValidFn();                             //为啥这样写就不行呢？系统会说this.runrunValidFn()不是一个函数。因为这里的this是普通函数内的this，它指向调用这个函数的对象。
        // });                                                          
        this.input.addEventListener('blur', () => {
            this.runValidFn(); //为啥这样写就可以呢？因为，箭头函数没人调用，它内部也没有this的概念。这里的还是外层的this，指向要被构造的对象。
        }); //为啥构造函数里面可以写这种逻辑代码呀？不是应该只写属性赋值语句吗？我觉得构造函数也是一个函数，里面写啥代码都行。下面的new语句一调用，就把这个函数内的语句执行了。
    }
    async runValidFn() { //这里是个监听函数。
        const err = await this.validFn(this.input.value); //在这里执行回调函数，如果有返回值，那就说明出错了。
        if (err) {
            this.p.innerText = err;
            return false;
        } else {
            this.p.innerText = '';
            return true;
        }
    }

    static async runValidFn(...lostParams) {
        const validArr = lostParams.map(item => item.runValidFn()); //这里我之前调用的是validFn(),这是验证器的一个属性，也是从传过来的一个函数。事实是不能调用它，得调用runValidFn()。
        const results = await Promise.all(validArr);
        return results.every(r => r);
    }
}


// var x = new UserValidator('txtLoginId', function(inputValue) {
//     if (!inputValue) {
//         console.log('没输入');
//     }
// });