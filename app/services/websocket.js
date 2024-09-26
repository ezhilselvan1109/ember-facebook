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

  async onMessage(event) {
    let arr = [JSON.parse(event.data)];
    this.data = [...this.data, ...arr];
    let tag = ''
    if (arr[0].tag) {
      const size = arr[0].tag.length;
      arr[0].tag.forEach((user, index) => {
        tag += user.first_name + " " + user.last_name
        if (index !== size - 1) {
          tag += ', '
        } else if (arr[0].comment) {
          tag += ' '
        }
      });
    }
    const notification = {
      title: arr[0].user[0].first_name + " " + arr[0].user[0].last_name,
      body: arr[0].message + (arr[0].comment || tag ? ": " : '') + tag + (arr[0].comment ? tag ? 'comment: ' + arr[0].comment : arr[0].comment : '')
    }
    let permission = Notification.permission;
    if (permission === "granted") {
      this.showNotification(notification);
    } else if (permission === "default") {
      await this.requestAndShowPermission(notification);
    }
  }

  async requestAndShowPermission(notification) {
    let permission = await Notification.requestPermission();
    if (permission === "granted") {
      this.showNotification(notification);
    }
  }

  showNotification(notification) {
    let title = notification.title;
    let icon = '/assets/images/facebook-logo.png';
    let body = notification.body;
    try {
      new Notification(title, { body, icon });
    } catch (err) {
      console.error('Notification error:', err);
    }
  }

  onClose() {
    console.log('WebSocket connection closed');
  }
}
