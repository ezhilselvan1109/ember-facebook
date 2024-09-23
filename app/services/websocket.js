import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class WebsocketService extends Service {
    socket = null;
    @tracked data = [];
    
    connect(user_id) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) return;
        this.socket = new WebSocket(`ws://localhost:8080/facebook/notification?userId=${user_id}`);
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = (event) => this.onMessage(event);
        this.socket.onclose = this.onClose;
    }

    close() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.close();
        }
    }

    onOpen() {
        console.log('WebSocket connection opened');
    }

    onMessage(event) {
        let arr = [JSON.parse(event.data)];
        this.data = [...this.data, ...arr];
    }

    onClose() {
        console.log('WebSocket connection closed');
    }
}
