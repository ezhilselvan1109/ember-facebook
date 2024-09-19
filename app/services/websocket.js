import Service from '@ember/service';

export default class WebsocketService extends Service {
    socket = null;
    connect() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) return;
        this.socket = new WebSocket('ws://localhost:8080/facebook/notification');
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = this.onMessage;
        this.socket.onclose = this.onClose;
    }

    onOpen() {
        console.log('WebSocket connection opened');
    }

    onMessage(event) {
        console.log('Message from server: ', event.data);
    }

    onClose() {
        console.log('WebSocket connection closed');
    }
}
