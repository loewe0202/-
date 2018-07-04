/**
 * 倒计时
 */

class fnCountDown {
    constructor(opt) {
        let def = {
            targetTimes: [], //倒计时时间
            style: "hh:mm:ss", // 展示格式  :s  hh:mm:ss  hh:mm:ss.S
            refreshTime: 1000, // 刷新一次的时间
            decimals: 2, // 保留两位毫秒数
            onUpdate: function() {}, // 更新时回调函数
            onComplete: function() {} // 完成时回调函数
        }
        if (opt.style == 'hh:mm:ss.S') { // 刷新一次的时间
            opt.refreshTime = 10
        }
        this.opt = Object.assign(def, opt); //assign传入配置参数
        this.interval = null; //计时器对象
        this.init();
    }

    // 初始化
    init() {
        this.clear();
        this.initTimes();
        let overNumber = 0; // 倒计时结束个数
        this.opt.targetTimes.forEach(item => {
            if (item <= 0) {
                overNumber++;
            }
        })
        if (overNumber == this.opt.targetTimes.length) {
            // 倒计时结束
            this.opt.onComplete({
                errMsg: "complete",
                time: this.format_data()
            });
        } else {
            // 开始倒计时
            this.interval = setInterval(() => {
                this.updateTimer();
            }, this.opt.refreshTime);
        }
    }

    // 更新时间
    updateTimer() {
        let overNumber = 0; // 倒计时结束个数
        let timeArray = [];
        this.opt.targetTimes.forEach(item => {
            // 减去刷新时间
            item -= this.opt.refreshTime;
            if (item <= 0) {
                overNumber++;
                item = 0; // 时间置零
            }
            timeArray.push(item);
        })
        this.opt.targetTimes = timeArray;
        if (overNumber < this.opt.targetTimes.length) {
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
    calibration(opt) {
        opt = opt || {};
        this.opt.targetTimes = opt.targetTimes;
        this.init();
    }

    // 清除定时器
    clear() {
        clearInterval(this.interval);
    }

    // 格式化时间为毫秒数
    initTimes() {
        if (this.opt.targetTimes.length > 0) {
            if (typeof this.opt.targetTimes[0] != "number") {
                let tempArray = [];
                this.opt.targetTimes.forEach(item => {
                    let time = changTimeStyle(item.endTime) - changTimeStyle(item.startTime);
                    if (time < 0) {
                        time = 0;
                    }
                    tempArray.push(time);
                })
                this.opt.targetTimes = tempArray;
            }
        } else {
            this.opt.targetTimes = [0];
        }
    }

    // 格式化时间
    format_data() {
        let tempArray = [];
        this.opt.targetTimes.forEach(item => {
            let time = data_format(item, this.opt.decimals, this.opt.style);
            tempArray.push(time);
        })
        return tempArray;
    }
};

//统一时间格式为毫米格式
function changTimeStyle(time) {
    time = time.replace(/-/g, '/');
    return new Date(time).getTime();
};

//倒计时时间格式化
function data_format(targetTimes, decimals, style) {
    // 秒数
    var second = Math.floor(targetTimes / 1000);
    if (style == "s") { // 只显示秒
        return second;
    }
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位
    var sec = fill_zero_prefix((second - hr * 3600 - min * 60));
    // 毫秒位
    if (decimals == 1) {
        // 保留一位
        var micro_sec = Math.floor((targetTimes % 1000) / 100);
    } else {
        // 保留2位
        var micro_sec = fill_zero_prefix(((targetTimes % 1000) / 10));
    }
    if (style == "hh:mm:ss") { // 时分秒
        return hr + ":" + min + ":" + sec;
    }
    if (style == "hh:mm:ss.S") { // 时分秒毫秒
        return hr + ":" + min + ":" + sec + " " + micro_sec;
    }
};

// 位数不足补零
function fill_zero_prefix(num) {
    return num < 10 ? "0" + num : num
};

export default {
    fnCountDown,
    changTimeStyle
};
