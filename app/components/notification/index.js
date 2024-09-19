import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class NotificationIndex extends Component {
    @service websocket;
    @tracked isShow=false;

    @action
    handleIsShow(){
        this.isShow=!this.isShow;
    }
}
