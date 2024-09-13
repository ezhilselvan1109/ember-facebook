import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AccountController extends Controller {
  @service userData;
  @service router;
  @tracked isLoading = false;
  @tracked user = [];
  @tracked userPosts = [];
  @tracked accountUser = [];
  @tracked friend = [];
  @tracked user_id;

  @tracked friends = {
    isFriend: undefined,
    requestStatus: undefined,
  };

  @action
  async loadData() {
    this.userPosts = [];
    this.userData.errorMessage = '';
    this.isLoading = true;
    let user = localStorage.getItem('user');

    try {
      let userResponse = await fetch(
        `http://localhost:8080/facebook/api/user/${user}`,
        { method: 'GET' },
      );
      if (!userResponse.ok) {
        let errorData = await userResponse.json();
        throw new Error(errorData.data.join(', '));
      } else {
        let usersData = await userResponse.json();
        this.user_id = String(usersData.data[0].id);
        this.userData.user = usersData.data[0];
        this.user = usersData.data[0];
      }

      let query;
      if (this.model == this.user_id) {
        query = `http://localhost:8080/facebook/api/user/profile/${this.model}`;
      } else {
        query = `http://localhost:8080/facebook/api/user/profile/${this.model}?from=${this.user_id}`;
      }

      let [friendResponse, accountResponse, postsResponse] =
        await Promise.allSettled([
          fetch(
            `http://localhost:8080/facebook/api/friend/list?user_id=${this.model}`,
            { method: 'GET' },
          ),
          fetch(query, { method: 'GET' }),
          fetch(
            `http://localhost:8080/facebook/api/post/user/${this.model}/${this.user_id}`,
            { method: 'GET' },
          ),
        ]);
      console.log('friendResponse : ', friendResponse);
      if (friendResponse.status === 'fulfilled') {
        let friendData = await friendResponse.value.json();
        if (friendResponse.value.ok) {
          this.friend = friendData.data;
        } else {
          this.friend = [];
        }
        console.log('Friend Data: ', friendData);
      } else {
        console.error('Friend request failed: ', friendResponse.reason);
      }

      if (accountResponse.status === 'fulfilled') {
        let accountData = await accountResponse.value.json();
        console.log('Account Data: ', accountData);
        this.accountUser = accountData.data[0];
        if (accountData.data[0].friend) {
          this.friends.isFriend = accountData.data[0].friend.isFriend;
          this.friends.requestStatus = accountData.data[0].friend.status;
        }
      } else {
        console.error('Account request failed: ', accountResponse.reason);
      }

      if (postsResponse.status === 'fulfilled') {
        let postsData = await postsResponse.value.json();
        this.userPosts = postsData.data[0];
      } else {
        console.error('Posts request failed: ', postsResponse.reason);
      }

      console.log('this.friends: ', this.friends);
    } catch (error) {
      console.log('error: ', error);
    } finally {
      this.isLoading = false;
    }
  }

  @action
  logout() {
    localStorage.removeItem('user');
    this.router.transitionTo('login');
  }
}
