import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class NotificationIndex extends Component {
    socket = null;
    @service websocket;
    constructor() {
        super(...arguments);
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.websocket.connect();
    }
}
