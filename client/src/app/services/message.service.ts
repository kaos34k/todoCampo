import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';

import { GLOBAL } from './global.service';
import { Follow } from '../models/follow';
import { Publication } from '../models/publication';
import { FollowService } from '../services/follow.service';


@Injectable()
export class MessageService{
    //url de mi api
    public url: string;
    private messages;
    private messageText;
    private socket: SocketIOClient.Socket;
    //header que voy a usar en mis peticiones ajax
    public headers;
    



    constructor(
            private _followService: FollowService
        ) {
        this.url = GLOBAL.url;
        this.socket = io("http://localhost:3899", {'forceNew':true});
    }

    //enviar mesages
    sendMessage(msg) {
        this.socket.emit('message',msg);
        this.messageText = '';
    }

    //escaneo nuevos mensajes
    getMessages(user, receiver, page) {
        return Observable.create((observer) => {
            this.socket.on('message', (user, receiver, page) => {
                observer.next();
            });
        });
    }
}