import bar from './bar';
import Vue from 'vue';
import AV from 'leancloud-storage';

var APP_ID = 'YI97SvtN1qNqVFe4qY5tej7Y-gzGzoHsz';
var APP_KEY = 'TT2opR7g7WllSsbD6hQrlOEn';


AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});


var app = new Vue({
    el: '#app',
    data: {
        actionType: "signUp",
        formData:{
            username:"",
            password:""
        },
        newTodo: '',
        todoList: [],
        currentUser:null
    },
    created:function(){
        window.onbeforeunload = () =>{
            let dataString = JSON.stringify(this.todoList);
            window.localStorage.setItem("myTodos",dataString); 
        };
        let oldData = JSON.parse(window.localStorage.getItem("myTodos"));
        this.todoList = oldData || [];
        this.currentUser = this.isLogged();
        
    },  
    methods: {
        addTodo: function(){
        this.todoList.push({
            title: this.newTodo,
            createdAt: new Date().getFullYear()+"-"+new Date().getMonth()+"-"+new Date().getDate()+"  "+new Date().getHours()+"时"+new Date().getMinutes()+"分",
            done:false
        });
        this.newTodo='';
        },
        removeTodo:function(todo){
            let idnex = this.todoList.indexOf(todo);
            this.todoList.splice(idnex,1);
        },
        signUp: function () {
            let user = new AV.User();
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then((loginedUser) => {
                this.currentUser = this.getCurrentUser();
            }, function (error) {
                alert("注册失败");
            });
        },
        logIn: function(){
            AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
                this.currentUser = this.getCurrentUser();
            }, function (error) {
                alert("登录失败");
            });
        },
        getCurrentUser: function () {
            let {id, createdAt, attributes: {username}} = AV.User.current();
            return {id, username, createdAt};
       },
       isLogged:function () {
            let current = AV.User.current();
            if (current) {
                let {id, createdAt, attributes: {username}} = current;
                return {id, username, createdAt};
            } else {
                return null;
            }
       },
        logOut: function () {
            AV.User.logOut();
            this.currentUser = null;
            window.location.reload();
        }
    }
});
