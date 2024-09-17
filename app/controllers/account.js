import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AccountController extends Controller {
  @service userData;
  @service session;
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
        `http://localhost:8080/facebook/api/user/detail?username=${user}`,
        { method: 'GET', credentials: 'include' },
      );
      if (!userResponse.ok) {
        if (userResponse.status == 401) {
          this.session.route();
          return;
        }
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
        query = `http://localhost:8080/facebook/api/user/profile?id=${this.model}`;
      } else {
        query = `http://localhost:8080/facebook/api/user/profile?id=${this.model}&from=${this.user_id}`;
      }

      let [friendResponse, accountResponse, postsResponse] =
        await Promise.allSettled([
          fetch(
            `http://localhost:8080/facebook/api/friend/list?user_id=${this.model}`,
            { method: 'GET', credentials: 'include' },
          ),
          fetch(query, { method: 'GET', credentials: 'include' }),
          fetch(
            `http://localhost:8080/facebook/api/post/user?user_id=${this.model}&id=${this.user_id}`,
            { method: 'GET', credentials: 'include' },
          ),
        ]);
      if (friendResponse.status === 'fulfilled') {
        let friendData = await friendResponse.value.json();
        if (friendResponse.value.status == 401) {
          this.session.route();
          return;
        }
        if (friendResponse.value.ok) {
          this.friend = friendData.data;
        } else {
          this.friend = [];
        }
      } else {
        console.error('Friend request failed: ', friendResponse.reason);
      }

      if (accountResponse.status === 'fulfilled') {
        if (accountResponse.value.status == 401) {
          this.session.route();
          return;
        }
        let accountData = await accountResponse.value.json();
        this.accountUser = accountData.data[0];
        if (accountData.data[0].friend) {
          this.friends.isFriend = accountData.data[0].friend.isFriend;
          this.friends.requestStatus = accountData.data[0].friend.status;
        }
      } else {
        console.error('Account request failed: ', accountResponse.reason);
      }

      if (postsResponse.status === 'fulfilled') {
        if (postsResponse.value.status == 401) {
          this.session.route();
          return;
        }
        let postsData = await postsResponse.value.json();
        this.userPosts = postsData.data[0];
      } else {
        console.error('Posts request failed: ', postsResponse.reason);
      }
    } catch (error) {
      console.log('error: ', error);
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async loadFriend() {
    let friendResponse = await fetch(
      `http://localhost:8080/facebook/api/friend/list?user_id=${this.model}`,
      { method: 'GET', credentials: 'include' },
    );
    if (!friendResponse.ok) {
      if (friendResponse.status == 401) {
        this.session.route();
        return;
      }
      this.friend = [];
      let errorData = await friendResponse.json();
      throw new Error(errorData.data.join(', '));
    } else {
      let friendData = await friendResponse.json();
      this.friend = friendData.data;
    }
  }

  @action
  async logout() {
    let response = await fetch(
      `http://localhost:8080/facebook/api/auth/logout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );
    if (!response.ok) {
      let errorData = await response.json();
      throw new Error(errorData.data.join(', '));
    } else {
      localStorage.removeItem('user');
      this.session.route();
      let responseData = await response.json();
      console.log('responseData.data : ', responseData.data);
    }
  }
}
