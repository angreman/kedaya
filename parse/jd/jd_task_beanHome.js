const Template = require('../../template');

class Main extends Template {
    constructor() {
        super()
        this.title = "京东领京豆"
        this.cron = "19 3,19 * * *"
        this.help = 2
        this.task = 'local'
        // this.thread = 3
        this.import = ['jdAlgo']
    }

    async prepare() {
        this.algo = new this.modules['jdAlgo']()
        let feeds = await this.algo.curl({
                'url': `https://api.m.jd.com/client.action?functionId=homeFeedsList&body={"page":1,"appid":"fd4bb","needSecurity":true,"bizId":"active","pageId":"JingDou_SceneHome"}&appid=signed_wh5&client=apple&clientVersion=11.8.2&networkType=wifi&osVersion=11.4&screen=320*504&uuid=434e858e755c9b1ec6e6d6abc0348d9b6d985300&openudid=434e858e755c9b1ec6e6d6abc0348d9b6d985300&d_model=iPhone8,4`,
                algo: {
                    appId: "fd4bb",
                    type: 'main',
                    version: "3.1"
                }
            }
        )
        this.feeds = []
        if (this.haskey(feeds, 'data.feedsList')) {
            this.feeds = (this.column(feeds.data.feedsList, 'skuId'))
        }
    }

    async main(p) {
        let cookie = p.cookie;
        let dict = {
            A: 'K',
            B: 'L',
            C: 'M',
            D: 'N',
            E: 'O',
            F: 'P',
            G: 'Q',
            H: 'R',
            I: 'S',
            J: 'T',
            K: 'A',
            L: 'B',
            M: 'C',
            N: 'D',
            O: 'E',
            P: 'F',
            Q: 'G',
            R: 'H',
            S: 'I',
            T: 'J',
            e: 'o',
            f: 'p',
            g: 'q',
            h: 'r',
            i: 's',
            j: 't',
            k: 'u',
            l: 'v',
            m: 'w',
            n: 'x',
            o: 'e',
            p: 'f',
            q: 'g',
            r: 'h',
            s: 'i',
            t: 'j',
            u: 'k',
            v: 'l',
            w: 'm',
            x: 'n'
        }
        let uuid = this.sha1(this.uuid(40))
        uuid = '0721076da75ec3ea8e5f481e6d68bb4b7420c38d'
        let encrypt = {
            "ciphertype": 5,
            "cipher": {
                "ud": new Buffer.from(uuid).toString('base64').split("").map(d => dict[d] || d).join(""),
                "sv": "CJUkCI4n",
                "iad": ""
            },
            "ts": this.timestamp,
            "hdid": "JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw=",
            "version": "1.0.3",
            "appname": "com.360buy.jdmobile",
            "ridx": -1
        }
        let ua = `jdapp;iPhone;12.0.8;;;M/5.0;appBuild/168782;jdSupportDarkMode/0;ef/1;ep/${encodeURIComponent(this.dumps(encrypt))};Mozilla/5.0 (iPhone; CPU iPhone OS 15_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
        this.options.headers['user-agent'] = ua
        let gifts = []
        for (let i = 0; i<10; i++) {
            console.log(`正在浏览任务`)
            // this.feeds[i] || this.rand(10000000, 20000000).toString()
            let task = await this.curl({
                    url: `https://api.m.jd.com/client.action?functionId=beanHomeTask&body={"skuId":"${this.feeds[i]}","awardFlag":false,"type":"1","source":"feeds","scanTime":${new Date().getTime()}}&appid=ld&client=apple&clientVersion=12.0.8&networkType=wifi&osVersion=15.1.1&loginType=2&screen=390*753&uuid=${uuid}&openudid=${uuid}&d_model=iPhone13,3&jsonp=jsonp_1691746000054_62149`,
                    cookie
                }
            )
            console.log(task)
            if (!this.haskey(task, 'data')) {
                console.log("浏览任务可能已完成")
                break
            }
            if (this.haskey(task, 'data.taskProgress') == this.haskey(task, 'data.taskThreshold')) {
                console.log(`浏览任务完成,正在抽奖`)
                let reward = await this.curl({
                        'url': `https://api.m.jd.com/client.action?functionId=beanHomeTask&body=${this.dumps({
                            "awardFlag": true,
                            "source": "feeds"
                        })}&appid=ld&client=apple&clientVersion=12.0.8&networkType=wifi&osVersion=15.1.1&loginType=2&screen=390*753&uuid=${uuid}&openudid=${uuid}&d_model=iPhone13,3&jsonp=jsonp_1691746000054_62149`,
                        cookie
                    }
                )
                if (this.haskey(reward, 'data.beanNum')) {
                    console.log('获得京豆:', reward.data.beanNum)
                    gifts.push(reward.data.beanNum)
                }
                break
            }
            await this.wait(2000)
        }
        let taskList = await this.curl({
                'url': `https://api.m.jd.com/client.action?functionId=findBeanScene&body=${this.dumps({
                    "source": "AppHome",
                    "viewChannel": "AppHome",
                    "rnVersion": "3.9",
                    "rnClient": "1",
                    "appid": "ea6f2",
                    "needSecurity": true,
                    "bizId": "active"
                })}&appid=ld&client=apple&build=167283&clientVersion=9.1.0&uuid=${uuid}&openudid=${uuid}&d_model=iPhone13,3&area=0_0_0_0&jsonp=jsonp_1691742966852_76927`,
                // 'form':``,
                cookie
            }
        )
        await this.wait(2000)
        for (let i of this.haskey(taskList, 'data.floorList')) {
            switch (i.floorName) {
                case '种豆得豆定制化场景':
                    if (!i.viewed) {
                        console.log(`执行任务:`, i.mainTitle)
                        let doing = await this.curl({
                                'url': `https://api.m.jd.com/client.action?functionId=beanHomeTask&body=${this.dumps({
                                    "awardFlag": false,
                                    "itemId": "zddd",
                                    "source": "home",
                                    "type": "3"
                                })}&appid=ld&client=apple&build=167283&clientVersion=9.1.0&uuid=${uuid}&openudid=${uuid}&d_model=iPhone13,3&area=0_0_0_0&jsonp=jsonp_1691742966852_76927`,
                                // 'form':``,
                                cookie
                            }
                        )
                        console.log(doing)
                        await this.wait(2000)
                    }
                    else {
                        console.log(`任务完成:`, i.mainTitle)
                    }
                    break
                case '赚京豆':
                    for (let j of this.haskey(i, 'stageList')) {
                        if (!j.viewed) {
                            console.log(`执行任务:`, j.mainTitle)
                            let doing = await this.curl({
                                    'url': `https://api.m.jd.com/client.action?functionId=beanHomeTask&body=${this.dumps({
                                        "awardFlag": false,
                                        "itemId": j.stageId,
                                        "source": "home",
                                        "type": `4_${j.stageId}`
                                    })}&appid=ld&client=apple&build=167283&clientVersion=9.1.0&uuid=${uuid}&openudid=${uuid}&d_model=iPhone13,3&area=0_0_0_0&jsonp=jsonp_1691742966852_76927`,
                                    // 'form':``,
                                    cookie
                                }
                            )
                            console.log(doing)
                            await this.wait(2000)
                        }
                        else {
                            console.log(`任务完成:`, j.mainTitle)
                        }
                    }
                    break
            }
        }
        let reward = await this.curl({
                'url': `https://api.m.jd.com/client.action?functionId=beanHomeTask&body=${this.dumps({
                    "awardFlag": true,
                    "source": "home"
                })}&appid=ld&client=apple&build=167283&clientVersion=9.1.0&uuid=${uuid}&openudid=${uuid}&d_model=iPhone13,3&area=0_0_0_0&jsonp=jsonp_1691742966852_76927`,
                cookie
            }
        )
        if (this.haskey(reward, 'data.beanNum')) {
            console.log('获得京豆:', reward.data.beanNum)
            gifts.push(reward.data.beanNum)
        }
        for (let n = 0; n<5; n++) {
            let unlock = 1
            let beanTaskList = await this.curl({
                    'url': `https://api.m.jd.com/client.action?functionId=beanTaskList&body={"viewChannel":"AppHome","beanVersion":1,"imei":"${uuid}","prstate":"0","aid":"","idfa":"","op_type":1,"app_info":"390*753^iPhone13,3^apple^12.0.8^wifi","location_info":"0-0-0"}&appid=ld&client=apple&clientVersion=12.0.8&networkType=wifi&osVersion=15.1.1&loginType=2&screen=390*753&uuid=${uuid}&openudid=${uuid}&d_model=iPhone13,3&area=0_0_0_0&jsonp=jsonp_1691742966852_76927`,
                    cookie
                }
            )
            if (this.haskey(beanTaskList, 'data.viewAppHome') && n == 0) {
                if (!beanTaskList.data.viewAppHome.takenTask) {
                    console.log(`执行任务: ${beanTaskList.data.viewAppHome.mainTitle}`)
                    let iconTask = await this.curl({
                        'url': `https://api.m.jd.com/client.action?functionId=beanHomeIconDoTask&body=${this.dumps({
                            "flag": "0",
                            "viewChannel": "AppHome"
                        })}&appid=ld&client=apple&build=167283&clientVersion=9.1.0&uuid=${uuid}&openudid=${uuid}&d_model=iPhone13,3&area=0_0_0_0&jsonp=jsonp_1691742966852_76927`,
                        cookie
                    })
                }
                await this.wait(2000)
                if (!beanTaskList.data.viewAppHome.doneTask) {
                    console.log(`领取奖励: ${beanTaskList.data.viewAppHome.mainTitle}`)
                    let beanHomeIconDoTask = await this.curl({
                        'url': `https://api.m.jd.com/client.action?functionId=beanHomeIconDoTask&body=${this.dumps({
                            "flag": "1",
                            "viewChannel": "AppHome"
                        })}&appid=ld&client=apple&build=167283&clientVersion=9.1.0&uuid=${uuid}&openudid=${uuid}&d_model=iPhone13,3&area=0_0_0_0&jsonp=jsonp_1691742966852_76927`,
                        cookie
                    })
                    if (this.haskey(beanHomeIconDoTask, 'data.growthResult.sceneLevelConfig.beanNum')) {
                        console.log(`获得京豆:`, beanHomeIconDoTask.data.growthResult.sceneLevelConfig.beanNum)
                        gifts.push(beanHomeIconDoTask.data.growthResult.sceneLevelConfig.beanNum)
                    }
                }
                else {
                    console.log("任务已经完成:", beanTaskList.data.viewAppHome.mainTitle)
                }
            }
            for (let i of this.haskey(beanTaskList, 'data.taskInfos')) {
                if (i.status != 2) {
                    unlock = 0
                    let doTask = await this.curl({
                            'url': `https://api.m.jd.com/client.action?functionId=beanDoTask&body={"actionType":1,"taskToken":"${i.subTaskVOS[0].taskToken}"}&appid=ld&client=apple&clientVersion=12.0.8&networkType=wifi&osVersion=15.1.1&loginType=2&screen=390*753&uuid=${uuid}&openudid=${uuid}&d_model=iPhone13,3&jsonp=jsonp_1691745591235_71237`,
                            cookie
                        }
                    )
                    if (i.waitDuration) {
                        await this.wait(i.waitDuration * 1000)
                        doTask = await this.curl({
                                'url': `https://api.m.jd.com/client.action?functionId=beanDoTask&body={"actionType":0,"taskToken":"${i.subTaskVOS[0].taskToken}"}&appid=ld&client=apple&clientVersion=12.0.8&networkType=wifi&osVersion=15.1.1&loginType=2&screen=390*753&uuid=${uuid}&openudid=${uuid}&d_model=iPhone13,3&jsonp=jsonp_1691745591235_71237`,
                                cookie
                            }
                        )
                    }
                    if (this.haskey(doTask, 'data.bizMsg')) {
                        console.log(doTask.data.bizMsg)
                    }
                    await this.wait(2000)
                }
                else {
                    if (n == 0) {
                        console.log(`任务完成:`, i.taskName)
                    }
                }
            }
            if (unlock) {
                break
            }
        }
        if (new Date().getHours()<8) {
            let lottery = await this.curl({
                    'url': `https://api.m.jd.com/client.action?functionId=babelGetLottery`,
                    'form': `body=%7B%22enAwardK%22%3A%22ltvTJ%2FWYFPZcuWIWHCAjRxq62H%2FboqujJ6iQ3hAUobokmc5JPMT5JcYfG1BjIXSwG8gLnspAJLUu%5CnCrrKTE6JOw42Fn998W5DLgq6ykxOiTsuzhkfo9ETrolylhHJUDzk3CgtFRkgvjwEkgyVMwbzej%2BG%5CnTG5ptdaite8cEq7Jxtcu%2Bkwm15WkyicToEyS%2FPVZI2GoMSvYfq%2B4tMsnnkKGTgykmQsJkE%2Fvu7UO%5Cncj56bpuYOeWewI7KO93u73iZzWUs%2FyNWR16kSJiEHxA9PloMwZ2WuEqSHfiqGf6MuJxQmMIL9MHS%5Cnjbs%2BQhEKOhJAQs2PaHvanKkkE8TU7ESujM2a18EuQglPvG631lmsI%2FE7VHO0O1bPsTPtW5l2et5A%5CneQ0y_babel%22%2C%22awardSource%22%3A%221%22%2C%22srv%22%3A%22%7B%5C%22bord%5C%22%3A%5C%220%5C%22%2C%5C%22fno%5C%22%3A%5C%220-0-2%5C%22%2C%5C%22mid%5C%22%3A%5C%2270952802%5C%22%2C%5C%22bi2%5C%22%3A%5C%222%5C%22%2C%5C%22bid%5C%22%3A%5C%220%5C%22%2C%5C%22aid%5C%22%3A%5C%2201155413%5C%22%7D%22%2C%22encryptProjectId":"3u4fVy1c75fAdDN6XRYDzAbkXz1E","encryptAssignmentId":"2x5WEhFsDhmf8JohWQJFYfURTh9w","authType":"2","homeCityLng":"","homeCityLat":"","focus":"","innerAnchor":"","cv":"2.0"}&screen=1170*2259&client=wh5&clientVersion=1.0.0&sid=&uuid=&ext={"prstate":"0"}`,
                    cookie
                }
            )
            if (this.haskey(lottery, 'prizeName')) {
                console.log(`抽京豆获得: ${lottery.prizeName}`)
            }
            let morning = await this.curl({
                    'url': `https://api.m.jd.com/client.action?functionId=morningGetBean&body={"fp":"-1","shshshfp":"-1","shshshfpa":"-1","referUrl":"-1","userAgent":"-1","jda":"-1","rnVersion":"3.9"}&appid=ld&client=apple&clientVersion=10.0.8&networkType=wifi&osVersion=13.7&jsonp=jsonp_1627231444901_3492`,
                    // 'form':``,
                    cookie
                }
            )
            if (this.haskey(morning, 'data.beanNum')) {
                console.log('获得京豆:', morning.data.beanNum)
                gifts.push(morning.data.beanNum)
            }
        }
        else {
            let jx = await this.algo.curl({
                    'url': `https://wq.jd.com/jxjdsignin/SignedInfo?_stk=_t&_=1652057484805&sceneval=2&g_login_type=1&g_ty=ajax&appCode=msc588d6d5`,
                    // 'form':``,
                    cookie, algo: {
                        'appId': '0f6ed',
                        'type': 'pingou',
                        verify: 1,
                    }
                }
            )
            if (this.haskey(jx, 'data')) {
                if (!jx.data.jx_sign_status) {
                    await this.algo.curl({
                            'url': `https://m.jingxi.com/fanxiantask/signhb/query?type=1&signhb_source=5&smp=bd67efc3be1c59bcab4f8b90e3a0f708&ispp=0&tk=&_stk=ispp%2Csignhb_source%2Csmp%2Ctk%2Ctype&_ste=1`,
                            // 'form':``,
                            cookie, algo: {
                                'appId': '0f6ed',
                                'type': 'pingou',
                                verify: 1,
                            }
                        }
                    )
                }
                if (jx.data.jd_sign_status) {
                    let reward = await this.algo.curl({
                            'url': `https://wq.jd.com/jxjdsignin/IssueReward?_t=1652057204813&_stk=_t&sceneval=2&g_login_type=1&g_ty=ajax&appCode=msc588d6d5`,
                            // 'form':``,
                            cookie
                        }
                    )
                }
            }
        }
        let signBeanAct = await this.curl({
                'url': `https://api.m.jd.com/client.action?functionId=signBeanAct&body={"fp":"-1","shshshfp":"-1","shshshfpa":"-1","referUrl":"-1","userAgent":"-1","jda":"-1","rnVersion":"3.9"}&appid=ld&client=apple&clientVersion=12.0.8&networkType=wifi&osVersion=15.1.1&loginType=2&screen=390*753&uuid=0721076da75ec3ea8e5f481e6d68bb4b7420c38d&openudid=0721076da75ec3ea8e5f481e6d68bb4b7420c38d&d_model=iPhone13,3&jsonp=jsonp_1691799935388_50967`,
                // 'form':``,
                cookie
            }
        )
        if (this.haskey(signBeanAct, 'data.dailyAward.beanAward.beanCount')) {
            console.log(`领京豆: ${this.haskey(signBeanAct, 'data.dailyAward.beanAward.beanCount')}`)
            gifts.push(this.haskey(signBeanAct, 'data.dailyAward.beanAward.beanCount'))
        }
        else if (this.haskey(signBeanAct, 'data.continuityAward.beanAward.beanCount')) {
            console.log(`领京豆: ${this.haskey(signBeanAct, 'data.continuityAward.beanAward.beanCount')}`)
            gifts.push(this.haskey(signBeanAct, 'data.continuityAward.beanAward.beanCount'))
        }
        if (gifts.length>0) {
            let sum = this.sum(gifts)
            console.log(`共获得京豆:`, sum)
            this.notices(`获得京豆: ${sum}`, p.user)
        }
    }
}

module.exports = Main;
