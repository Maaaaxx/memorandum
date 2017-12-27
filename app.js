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
        currentUser:null,
        currentName:''
    },
    created:function(){
        this.currentUser = this.getCurrentUser();
        this.fetchTodos();
    },  
    methods: {
        //获取用户的数据
        fetchTodos: function(){ 
            if(this.currentUser){
                var query = new AV.Query('AllTodos');
                console.log(query);
                query.find()
                .then((todos) => {    
                    console.log(todos[0]);
                    let avAllTodos = todos[0];
                    let id = avAllTodos.id;
                    this.todoList = JSON.parse(avAllTodos.attributes.content); 
                    this.todoList.id = id;
                }, function(error){
                    console.error(error);
                });
            }
        },
        updateTodos: function(){
            let dataString = JSON.stringify(this.todoList);
            let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id);
            avTodos.set('content', dataString);
            avTodos.save().then(()=>{
                console.log('更新成功');
            });
        },
        saveData:function(){         
            let dataString = JSON.stringify(this.todoList);
            var AllTodos = AV.Object.extend('AllTodos');
            var avTodos = new AllTodos();
            var acl = new AV.ACL();
            acl.setReadAccess(AV.User.current(),true);
            acl.setWriteAccess(AV.User.current(),true);
            avTodos.set('content', dataString);
            avTodos.setACL(acl);
            avTodos.save().then((todo) =>{
            this.todoList.id = todo.id;
                console.log('保存成功');
            }, function (error) {
                console.error('保存失败');
            });
        },
        saveOrUpdateTodos: function(){
            if(this.todoList.id){
                this.updateTodos();
            }else{
                this.saveData();
            }
        },
        addTodo: function(){
            
        this.todoList.push({
            title: this.newTodo,
            createdAt: new Date().getFullYear()+"-"+new Date().getMonth()+"-"+new Date().getDate()+"  "+new Date().getHours()+"时"+new Date().getMinutes()+"分",
            done:false
        });
        this.newTodo='';
        this.saveOrUpdateTodos();
        },
        removeTodo:function(todo){
            let idnex = this.todoList.indexOf(todo);
            this.todoList.splice(idnex,1);
            this.saveOrUpdateTodos();
        },
        signUp: function () {
            let user = new AV.User();
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then((loginedUser) => {
                this.currentUser = this.getCurrentUser();
            }, function (error) {
                console.log("注册失败");
            });
        },
        logIn: function(){
            AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
                this.currentUser = this.getCurrentUser();
                this.fetchTodos();
            }, function (error) {
                console.log("登录失败");
            });
        },
        getCurrentUser:function () {
            let current = AV.User.current();
            if (current) {
                let {id, createdAt, attributes: {username}} = current;
                this.currentName = username;
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
