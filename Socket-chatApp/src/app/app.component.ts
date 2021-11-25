import { Component, Input, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import * as $ from 'jquery';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public socket: any;
  title = 'socket-chatApp';
  message: any;
  name: any;

  constructor() {
    this.socket = io(environment.SOCKET_ENDPOINT);
  }
  ngOnInit() {
    console.log('on init ', this.socket);
    this.getMessages();
    $('#messages').empty();
    this.socket.on('chat message', (data: any) => {
      console.log('on chat message in component ', data.message, data.name);
      if (data.message) {
        $('#messages').append(`<li style="background: #eee"><h4>${data.name}</h4><p>${data.message}</p></li>`);
      }
    });
  }
  
  sendMessage() {
    console.log('send message ', this.message);
    $.post('http://localhost:3000/messages', { message: this.message, name: this.socket.id });
    this.socket.emit('chat message', { message: this.message, name: this.socket.id });
    this.message = "";
    this.getMessages();
  }
    
  getMessages() {
    $.get(`http://localhost:3000/messages`, (data) => {
      $('#messages').empty();
      console.log('data in client ', data.length);
      data.forEach((msg: any) => {
        if (msg.message) {
          $(`#messages`).append(`<li><h4>${msg.name}</h4><p>${msg.message}</p></li>`);
        }
      });
    })
  }

}
