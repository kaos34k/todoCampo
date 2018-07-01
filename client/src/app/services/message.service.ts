import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { GLOBAL } from './global.service';
import { Follow } from '../models/follow';
import { Publication } from '../models/publication';
import * as io from 'socket.io-client';

@Injectable()
export class MessageService{
    //url de mi api
    public url: string;
    private messages;
    private messageText;
    private socket: SocketIOClient.Socket;
    //header que voy a usar en mis peticiones ajax
    public headers;
    



    constructor() {
        this.url = GLOBAL.url;
        this.socket = io("http://localhost:3899", {'forceNew':true});
    }

    //enviar mesages
    sendMessage(msg) {
        this.socket.emit('message', "hola mundo");
        this.messageText = '';
    }

    //escaneo nuevos mensajes
    getMessages() {
        return Observable.create((observer) => {
            this.socket.on('message', (message) => {
                console.info(message);
                observer.next(message);
            });
        });
    }
}