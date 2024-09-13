import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  @service userData;
  @tracked isLoading = false;
  @tracked postsData;
  @tracked user_id;
  async loadData() {
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
        let responseData = await userResponse.json();
        this.userData.user = responseData.data[0];
        this.user_id = responseData.data[0].id;
      }

      let postsResponse = await fetch(
        `http://localhost:8080/facebook/api/post/all/${this.user_id}`,
        { method: 'GET' },
      );
      if (!postsResponse.ok) {
        let errorData = await postsResponse.json();
        throw new Error(errorData.data.join(', '));
      } else {
        let responseData = await postsResponse.json();
        this.postsData = responseData.data;
        console.log('responseData.data : ', responseData.data);
      }
    } catch (error) {
      console.log('error : ', error);
    } finally {
      this.isLoading = false;
    }
  }
}
