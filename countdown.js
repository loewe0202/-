class fnCountDown {
    constructor(opt) {
        let def = {
            targetTime: 0, //倒计时时间
            micro: true, // 是否需要毫秒数
            refreshTime: 10,// 刷新一次的时间
            decimals: 2,// 保留两位毫秒数
            onUpdate: function () { }, // 更新时回调函数
            onComplete: function () { } // 完成时回调函数
        }
        this.opt = Object.assign(def, opt); //assign传入配置参数
        this.interval = null;//计时器对象
        this.init();
    }

    // 初始化
    init() {
        this.clear();
        if (this.opt.targetTime > 0) {
            // 开始倒计时
            this.interval = setInterval(() => {
                this.updateTimer();
            }, this.opt.refreshTime);
        } else {
            // 倒计时结束
            this.opt.onComplete({
                errMsg: "complete",
                time: this.format_data()
            });
        }
    }

    // 更新时间
    updateTimer() {
        // 减去刷新时间
        this.opt.targetTime -= this.opt.refreshTime;
        if (this.opt.targetTime >= this.opt.refreshTime) {
            this.opt.onUpdate({
                errMsg: "update",
                time: this.format_data()
            })
        } else {
            // 倒计时结束
            this.opt.onComplete({
                errMsg: "complete",
                time: this.format_data()
            });
            this.clear();
        }
    }

    // 校准时间
    calibration(time) {
        this.opt.targetTime = time;
        this.init();
    }

    // 清除定时器
    clear() {
        clearInterval(this.interval);
    }
    
    format_data(){
        return data_format(this.opt.targetTime, this.opt.decimals, this.opt.micro);
    }

}

//倒计时时间格式化
function data_format(targetTime, decimals, micro) {
    // 秒数
    var second = Math.floor(targetTime / 1000);
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位
    var sec = fill_zero_prefix((second - hr * 3600 - min * 60));
    if (decimals == 1) {
        var micro_sec = Math.floor((targetTime % 1000) / 100);
    } else {
        // 保留2位
        var micro_sec = fill_zero_prefix(((targetTime % 1000) / 10));
    }
    if (!micro) {
        return hr + ":" + min + ":" + sec;
    }

    return hr + ":" + min + ":" + sec + " " + micro_sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
    return num < 10 ? "0" + num : num
}

export default fnCountDown;