window.messageObjs = {
    's_1001': {
        url: '', //上级url //工商联资讯
        code: 1001,
        title: '工商联要闻'
    },
    's_1002': {
        url: '',
        code: 1002,
        title: '经济服务'
    },
    's_1003': {
        url: '',
        code: 1003,
        title: '会员风采'
    },
    's_1004': {
        url: '',
        code: 1004,
        title: '商会活动'
    },

    's_1101': {
        url: '',
        code: 1101,
        title: '商务要闻'
    },
    's_1102': {
        url: '',
        code: 1102,
        title: '经济时讯'
    },
    's_1103': {
        url: '',
        code: 1103,
        title: '重要通知'
    },
    's_1104': {
        url: '',
        code: 1104,
        title: '部门动态'
    },
    's_1105': {
        url: '',
        code: 1105,
        title: '双招双引'
    },

    's_1201': {
        url: '',
        code: 1201,
        title: '走进自贸区'
    },
    's_1202': {
        url: '',
        code: 1202,
        title: '政务公开'
    },
    's_1203': {
        url: '',
        code: 1203,
        title: '中介招商'
    },
    's_1204': {
        url: '',
        code: 1204,
        title: '政策法规'
    },
    's_1205': {
        url: '',
        code: 1205,
        title: '企业风采'
    },

    's_1500': {
        url: '',
        code: 1500,
        title: '产品'
    },

    's_1701': {
        url: '',
        code: 1701,
        title: '商会服务'
    },

    's_1801': {
        url: '',
        code: 1801,
        title: '协会服务'
    },
    's_1802': {
        url: '',
        code: 1802,
        title: '协会服务'
    },
    's_2001': {
        url: '',
        code: 2001,
        title: '本会动态'
    },
    's_2002': {
        url: '',
        code: 2002,
        title: '办事指南'
    },
    's_2003': {
        url: '',
        code: 2003,
        title: '仲裁园地'
    },

};

/**
 *
 * @param type
 * @returns {string|*}
 */
window.getLocatMessage = function(type) {
    var key = 's_' + type;
    if ('undefined' !== typeof window.messageObjs[key]) {
        var tempObj = window.messageObjs[key];
        return tempObj['title'];
    } else {
        return '其它资讯';
    }
}