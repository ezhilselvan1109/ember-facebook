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
  @tracked user_id;

  @tracked friends={
    isFriend:undefined,
    requestStatus:undefined
  }
  
  @action
  async loadData() {
    this.userPosts = [];
    this.userData.errorMessage = '';
    this.isLoading = true;
    let user = localStorage.getItem('user');
    try {
      let userResponse = await fetch(`http://localhost:8080/facebook/api/user/${user}`, { method: 'GET' });
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
      if (this.model == this.user_id)
        query = `http://localhost:8080/facebook/api/user/profile/${this.model}`;
      else
        query = `http://localhost:8080/facebook/api/user/profile/${this.model}?from=${this.user_id}`;

      let accountResponse = await fetch(query, { method: 'GET' });
      if (!accountResponse.ok) {
        let errorData = await accountResponse.json();
        throw new Error(errorData.data.join(', '));
      } else {
        let accountData = await accountResponse.json();
        console.log('accountResponse : ', accountData);
        this.accountUser = accountData.data[0];
        if (undefined !== accountData.data[0].friend) {
          if (undefined !== accountData.data[0].friend.isFriend)
            this.friends.isFriend = accountData.data[0].friend.isFriend
          if (undefined !== accountData.data[0].friend.status)
            this.friends.requestStatus = accountData.data[0].friend.status
        }
      }
      console.log("this.friends : ", this.friends)
      let postsResponse = await fetch(`http://localhost:8080/facebook/api/post/user/${this.model}/${this.user_id}`, { method: 'GET' });
      if (!postsResponse.ok) {
        let errorData = await postsResponse.json();
        this.userPosts = [];
        throw new Error(errorData.data.join(', '));
      } else {
        let postsData = await postsResponse.json();
        this.userPosts = postsData.data[0];
      }

    } catch (error) {
      console.log("error : ",error)
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
