/*倒计时*/
$(function () {
    !function ($) {
        $.fn.manhuaCountDown = function (options) {

            var opt = $.extend({}, $.fn.manhuaCountDown.defaults, options);

            return this.each(function () {

                if (opt.isMin === undefined)
                    opt.isMin = true;
                if (opt.isSec === undefined)
                    opt.isSec = true;

                var $this = $(this);
                var day, hour, minute, second;

                if ($this.data('mytimer')) {
                    clearInterval($this.data('mytimer'));
                }
                $this.text('- -');

                $this.data('mytimer', setInterval(function () {
                    opt.sys_second -= 1;

                    if (opt.sys_second >= 0) {
                        day = Math.floor((opt.sys_second / 3600) / 24);
                        hour = Math.floor((opt.sys_second / 3600) % 24);
                        minute = Math.floor((opt.sys_second / 60) % 60);
                        second = Math.floor(opt.sys_second % 60);
                        if (opt.isDay) {
                            day = day + "天 ";//计算天
                        } else {
                            day = "";
                        }
                        if (opt.isHour) {
                            hour = (hour < 10 ? "0" + hour : hour) + "时 ";//计算小时
                        } else {
                            hour = '';
                        }
                        if (opt.isMin) {
                            minute = (minute < 10 ? "0" + minute : minute) + "分 ";//计算分
                        } else {
                            minute = '';
                        }
                        if (opt.isSec) {
                            second = (second < 10 ? "0" + second : second) + "秒";// 计算秒
                        } else {
                            second = '';
                        }
                        $this.text(day + hour + minute + second);
                    } else {
                        if (opt.isCallback && opt.callback !== '' && opt.callback !== undefined) { /*回调*/
                            opt.callback(opt.callbackOption, $this);
                        } else {
                            $this.text(opt.timeOutTip);
                        }
                        clearInterval($this.data('mytimer'));
                    }
                }, 1000));


            });
        };

        $.fn.manhuaCountDown.defaults = {
            sys_second: 0, isDay: false, isHour: false, isMin: true, isSec: true, isCallback: false, callback: '', callbackOption: {}, timeOutTip: '时间已经结束'
        };

    }(jQuery);
});