import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  @service userData;
  @service session;
  @tracked isLoading = false;
  @tracked postsData;
  @tracked user_id;

  async loadData() {
    this.userData.errorMessage = '';
    this.isLoading = true;

    try {
      let [userResult, postsResult] = await Promise.allSettled([
        fetch(`http://localhost:8080/facebook/api/user/detail`, {
          method: 'GET',
          credentials: 'include',
        }),
        fetch(`http://localhost:8080/facebook/api/post/all`, {
          method: 'GET',
          credentials: 'include',
        }),
      ]);

      if (userResult.status === 'fulfilled') {
        let userResponse = userResult.value;
        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            this.session.route();
            return;
          }
          let errorData = await userResponse.json();
          throw new Error(errorData.data.join(', '));
        } else {
          let responseData = await userResponse.json();
          this.userData.user = responseData.data[0];
          this.user_id = responseData.data[0].id;
        }
      } else {
        console.log('Failed to fetch user details: ', userResult.reason);
      }

      if (postsResult.status === 'fulfilled') {
        let postsResponse = postsResult.value;
        if (!postsResponse.ok) {
          if (postsResponse.status === 401) {
            this.session.route();
            return;
          }
          let errorData = await postsResponse.json();
          throw new Error(errorData.data.join(', '));
        } else {
          let responseData = await postsResponse.json();
          this.postsData = responseData.data;
        }
      } else {
        console.log('Failed to fetch posts: ', postsResult.reason);
      }

    } catch (error) {
      console.log('error: ', error);
    } finally {
      this.isLoading = false;
    }
  }
}
