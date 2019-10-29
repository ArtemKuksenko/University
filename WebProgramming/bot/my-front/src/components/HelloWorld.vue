<template>
    <div class="bigWindow">
        <div id = window>
            <div class="chat" v-for="mes in chat" v-bind:key="mes.mess" >
                <template v-if="mes.a" >
                    <div class="chatA">
                        {{mes.mess}}
                    </div>
                </template>
                <template v-else>
                    <div class="chatB">
                        {{mes.mess}}
                    </div>
                </template>
            </div>
        </div>
        <form v-on:submit.prevent="addMess(inputValue,false)">
            <input type="text" class="chatInput" v-model="inputValue">
            <button class="send-button">/></button>
        </form>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'HelloWorld',
        data: function(){
            return{
                chat:[],
                inputValue: "",
                ws: null,
            }
        },
        updated: function(){
            let container = this.$el.querySelector("#window");
            container.scrollTop = container.scrollHeight;
        },
        created () {
            if (localStorage.token === undefined){
                axios
                    .get('http://localhost:4000/reg')
                    .then(response => {
                            localStorage.token = response.data.token;
                        }
                    )
                    // .catch((e) =>{ console.log(e)});
            }
            this.ws = new WebSocket('ws://localhost:8034')

            this.ws.onopen = () => {
                // console.log('send');
                this.ws.send(JSON.stringify({token: localStorage.token}));
            };
            this.ws.onmessage = ({data}) => {
                this.addMess(data,true)
            }


        },
        methods: {
            addMess( m,user ) {
                if (m.length > 0)
                    this.chat.push({
                        a:user,
                        mess: m
                    });
                this.inputValue = "";
                if (!user)
                    this.sendMess(m);
            },
            sendMess(text){
                this.ws.send(JSON.stringify({'text': text, 'token': localStorage.token }));
            }
        }

    }
</script>

<style scoped>

    .bigWindow{
        padding: 10px;
        background: black;
        width: 370px;
        height: 600px;
        border-radius: 10px;

    }
    #window{
        overflow: auto;
        width: 100%;
        height: 550px;
    }
    .chatA{
        display: inline-block;
        float: left;
        position: relative;
        background: #77152F;
        margin: 5px;
        padding: 10px;
        /*padding-left: 0px;*/
        min-width: 40%;
        text-align: left;
        border-bottom-right-radius: 15px;
        border-top-right-radius: 10px;
        border-top-left-radius: 15px;
        border: black;
        color: antiquewhite;
    }
    .chatB{
        display: inline-block;
        position: relative;
        background: #171C3B;
        color: antiquewhite;
        margin: 5px;

        padding: 10px;
        padding-right: 10px;
        min-width: 40%;
        float: right;
        text-align: right;
        border-bottom-left-radius: 15px;
        border-top-right-radius: 15px;
        border-top-left-radius: 10px;
    }
    .chatInput{
        border-radius: 10px;
        /*position: center;*/
        /*position: relative;*/
        display: inline-block;
        color: antiquewhite;
        width: 310px;
        min-height: 30px;
        background: #171C3B;
        margin: 5px;
        padding: 5px;
        margin-left: 0px;
        border-width: 0px;
    }
    .send-button{
        display: inline-block;
        width: 40px;
        height: 40px;
        margin: 5px;
        margin-right: 0px;
        padding: 5px;
        border-width: 0px;
        border-radius: 100px;
        background: #D5B89E;
        color:rgba(23, 28, 59, 0.78) 60%;
        font-weight: bold;
        /*height: 100%;*/
    }
    .chat{
        width: 100%;
        display: inline-block;
    }
    ::-webkit-scrollbar {
        width: 12px;
    }

    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
