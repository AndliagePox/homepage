<template>
    <div id="app">
        <div id="logo">
            <div v-for="(engine, i) in engines" :key="i" class="logo-text" @click="logoClick"
                 :style="{color: engine.color}">{{ textList[i] }}</div>
        </div>
        <form action="javascript:void(0)" id="input-form" @submit="completeInput">
            <input id="input" v-model="searchText" autocomplete="off"
                   @focus="focus" @blur="extra = false" @input="input">
        </form>
        <transition name="fade">
            <div id="extra" v-if="extra">
                <div class="extra-item" v-for="(t, i) in extraList" :key="i" @click="eiClick(t)">{{ t }}</div>
            </div>
        </transition>
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
                extra: false,
                extraList: []
            }
        },

        created() {
            this.loadHistory()
        },

        methods: {
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
                this.loadHistory()
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
                console.log(this.searchText)
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
                }
                this.$forceUpdate()
            },

            loadSuggestion() {

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
                let r = /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9-]*[.])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-.~]+)*(\/([a-z0-9_\-.]*)(\?[a-z0-9+_\-.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/i
                return r.test(t)
            }
        }
    }
</script>

<style>
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

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>
