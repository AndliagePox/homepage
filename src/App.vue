<template>
    <div id="app">
        <div id="logo">
            <div v-for="(engine, i) in engines" :key="i" class="logo-text"
                 @touchstart="logoTouchStart" @touchend="logoTouchEnd" @touchmove="touchMove"
                 :style="{color: engine.color}">{{ textList[i] }}</div>
        </div>
        <form action="javascript:void(0)" id="input-form" @submit="completeInput">
            <label for="input"></label>
            <input id="input" v-model="searchText" autocomplete="off"
                   @focus="focus" @input.stop="input" @click.stop="">
        </form>
        <div id="extra" v-if="extra">
            <div class="extra-item" v-for="(t, i) in extraList" :key="i"
                 @touchstart.stop="eiTouchStart(t)"
                 @touchend.stop="eiTouchEnd(t)"
                 @touchmove="touchMove">{{ t }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'App',

        data() {
            return {
                textList: ['And', 'li', 'age'],
                engines: [
                    {color: '#ffb700', url: 'https://m.sm.cn/s?q='},
                    {color: '#00a5f5', url: 'https://www.baidu.com/s?wd='},
                    {color: '#ff3e00', url: 'https://www.google.com/search?q='},
                ],
                searchText: '',

                /* 扩展菜单是否显示 */
                extra: false,

                /* 扩展菜单内容列表(历史记录/搜索推荐) */
                extraList: [],

                /* 长按计时器 */
                timer: null,

                /* 当前扩展列表显示的是历史记录还搜索建议，true表示历史记录 */
                hi: true
            }
        },

        created() {
            this.loadHistory()

            // 搜索建议回调函数
            window.sug = (data) => {
                // 当请求建议的字符串和当前搜索框内容一致时再更新建议列表
                // 解决网速跟不上手速时导致的列表混乱bug
                if (data.q === this.searchText) {
                    this.extraList = data.s
                    this.hi = false
                    this.$forceUpdate()
                }
            }

            // 全局点击事件，实现点击空白处隐藏扩展菜单
            window.addEventListener("click", () => {this.extra = false});
        },

        methods: {
            logoTouchStart() {
                let i = this
                this.timer = setTimeout(function () {
                    if (confirm("清空历史记录？")) {
                        localStorage.setItem("andliage-hp-history", "[]")
                        console.log(i.hi)
                        if (i.hi) {
                            i.loadHistory()
                        }
                    }
                }, 700)
            },

            logoTouchEnd() {
                clearTimeout(this.timer)
                if (this.timer !== null) {
                    this.logoClick()
                }
                this.timer = null
            },

            eiTouchStart(t) {
                let i = this
                this.timer = setTimeout(function () {
                    let x = i
                    if (i.hi && confirm("删除搜索历史：\"" + t + "\"？")) {
                        let hl = []
                        let s = localStorage.getItem("andliage-hp-history")
                        if (s != null && s !== '') {
                            hl = JSON.parse(s)
                        }
                        let i = hl.indexOf(t)
                        if (i !== -1) {
                            hl.splice(i,1)
                        }
                        localStorage.setItem("andliage-hp-history", JSON.stringify(hl))
                        // 好家伙，你们前端也太tm神奇了
                        console.log(x.hi)
                        x.loadHistory()
                    }
                }, 700)
            },

            eiTouchEnd(t) {
                clearTimeout(this.timer)
                if (this.timer !== null) {
                    this.eiClick(t)
                }
                this.timer = null
            },

            touchMove() {
                clearTimeout(this.timer)
                this.timer = null
            },

            logoClick() {
                let x = this.engines[0]
                let i = 1
                for (; i < this.engines.length; i++) {
                    this.engines[i - 1] = this.engines[i]
                }
                this.engines[i - 1] = x
                this.$forceUpdate()
            },

            focus() {
                this.input()
                this.extra = true
            },

            eiClick(t) {
                this.goSearch(t)
            },

            completeInput() {
                this.goSearch(this.searchText)
            },

            goSearch(t) {
                if (this.isUrl(t)) {
                    let r = /^((https?|ftp|news):\/\/)+(.*)/
                    if (!r.test(t)) {
                        t = 'http://' + t
                    }
                    window.location.href = t
                } else {
                    this.addHistory(t)
                    window.location.href = this.engines[0].url + t
                }
            },

            input() {
                if (this.searchText === '') {
                    this.loadHistory()
                } else {
                    if (!this.isUrl(this.searchText)) {
                        this.loadSuggestion()
                    }
                }
            },

            loadHistory() {
                let s = localStorage.getItem("andliage-hp-history")
                if (s != null && s !== '') {
                    this.extraList = JSON.parse(s)
                    this.hi = true
                }
                this.$forceUpdate()
            },

            loadSuggestion() {
                let url = 'http://suggestion.baidu.com/su?wd=' + this.searchText
                this.$jsonp(url, {cb: "sug"}).catch(function () {})
            },

            addHistory(t) {
                let hl = []
                let s = localStorage.getItem("andliage-hp-history")
                if (s != null && s !== '') {
                    hl = JSON.parse(s)
                }
                let i = hl.indexOf(t)
                if (i !== -1) {
                    hl.splice(i,1)
                }
                hl.unshift(t)
                if (hl.length > 10) {
                    hl.pop()
                }
                localStorage.setItem("andliage-hp-history", JSON.stringify(hl))
            },

            isUrl(t) {
                let r = /^((https?|ftp|news):\/\/)?(([a-z0-9-]*[.])+([a-z0-9]+)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-.~]+)*(\/([a-z0-9_\-.]*)(\?[a-z0-9+_\-.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/i
                return r.test(t)
            }
        }
    }
</script>

<style>
    #app {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }

    #logo {
        width: 100%;
        margin: 55% auto 5% auto;
        text-align: center;
        font-size: 3.5rem;
        font-weight: bold;
    }

    .logo-text {
        display: inline-block;
    }

    #input-form {
        margin: 8px auto 0 auto;
        width: 90%;
        height: 2rem;
    }

    #input {
        height: 100%;
        width: 90%;
        border: 1px solid gray;
        outline:none;
        border-radius: 20px;
        padding: .5rem 5%;
        font-size: 16px;
    }

    #extra {
        width: 81%;
        height: 150px;
        margin: 18px auto;
        border: 1px solid gray;
        overflow: auto;
        font-size: 16px;
    }

    .extra-item {
        padding: 4px;
    }
</style>
