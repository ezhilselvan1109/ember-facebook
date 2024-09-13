import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class Friend extends Component {
  @tracked isLoading = false;
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
        `http://localhost:8080/facebook/api/friend/request?from=${this.args.user_id}&to=${this.args.id}`,
        { method: 'POST' },
      );
      if (!response.ok) {
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
        `http://localhost:8080/facebook/api/friend/accept?from=${this.args.user_id}&to=${this.args.id}`,
        { method: 'PUT' },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      } else {
        this.isFriend = true;
        this.status = true;
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
        `http://localhost:8080/facebook/api/friend/reject?from=${this.args.user_id}&to=${this.args.id}`,
        { method: 'DELETE' },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      } else {
        this.isFriend = undefined;
        this.status = undefined;
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
