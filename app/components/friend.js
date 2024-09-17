import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class Friend extends Component {
  @tracked isLoading = false;
  @service session;
  @tracked isFriend =
    this.args.friends.isFriend !== undefined
      ? this.args.friends.isFriend
      : undefined;
  @tracked status =
    this.args.friends.requestStatus !== undefined
      ? this.args.friends.requestStatus
      : undefined;
  @action
  async request() {
    this.isLoading = true;
    try {
      let response = await fetch(
        `http://localhost:8080/facebook/api/friend/request?id=${this.args.id}`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );
      if (!response.ok) {
        if (response.status == 401) {
          this.session.route();
          return;
        }
        throw new Error(`Error: ${response.status}`);
      } else {
        this.isFriend = false;
        this.status = false;
        let result = await response.json();
        console.log('Success:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async accept() {
    this.isLoading = true;
    try {
      let response = await fetch(
        `http://localhost:8080/facebook/api/friend/accept?id=${this.args.id}`,
        {
          method: 'PUT',
          credentials: 'include',
        },
      );
      if (!response.ok) {
        if (response.status == 401) {
          this.session.route();
          return;
        }
        throw new Error(`Error: ${response.status}`);
      } else {
        this.isFriend = true;
        this.status = true;
        this.args.loadFriend();
        let result = await response.json();
        console.log('Success:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async reject() {
    this.isLoading = true;
    try {
      let response = await fetch(
        `http://localhost:8080/facebook/api/friend/reject?id=${this.args.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );
      if (!response.ok) {
        if (response.status == 401) {
          this.session.route();
          return;
        }
        throw new Error(`Error: ${response.status}`);
      } else {
        this.isFriend = undefined;
        this.status = undefined;
        this.args.loadFriend();
        let result = await response.json();
        console.log('Success:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
