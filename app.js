import bar from './bar';
import Vue from 'vue';
    var app = new Vue({
        el: '#app',
        data: {
            newTodo: '',
            todoList: []
        },
        created:function(){
            window.onbeforeunload = () =>{
                let dataString = JSON.stringify(this.todoList);
                window.localStorage.setItem("myTodos",dataString); 
            };
            let oldData = JSON.parse(window.localStorage.getItem("myTodos"));
            this.todoList = oldData || [];
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
            }
        }
    });
