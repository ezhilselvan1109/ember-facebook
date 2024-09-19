import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class NotificationWebsocket extends Component {
  socket = null;

  constructor() {
    super(...arguments);
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.socket = new WebSocket('ws://localhost:8080/facebook/notification');
    
    this.socket.onopen = this.onOpen;
    this.socket.onmessage = this.onMessage;
    this.socket.onclose = this.onClose;
  }

  @action
  onOpen() {
    console.log("WebSocket connection opened");
  }

  @action
  onMessage(event) {
    console.log("Message from server: ", event.data);
  }

  @action
  onClose() {
    console.log("WebSocket connection closed");
  }

  @action
  sendMessage() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send("Hello from Ember!");
    }
  }
}
