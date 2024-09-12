import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class Post extends Component {
  @service userData;
  @tracked isLoading=false;
  @tracked isLiked=this.args.isLiked;
  @tracked totalLikes=this.args.like;
  @tracked likeds=this.args.isLiked?this.args.like-1:this.args.like;
  @action
  async likePost() {
    this.isLoading=true;
    try {
      let response = await fetch(`http://localhost:8080/facebook/api/post/like?user_id=${this.userData.user.id}&post_id=${this.args.post_id}`,{method: 'POST'});
      if (!response.ok) {
        this.isLiked=false;
        throw new Error(`Error: ${response.status}`);
      }else{
        this.isLiked=true;
        this.likeds=totalLikes-1;
        let result = await response.json();
        console.log('Success:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }finally{
      this.isLoading=false;
    }
  }

  @action
  async unlikePost() {
    this.isLoading=true;
    try {
      let response = await fetch(`http://localhost:8080/facebook/api/post/unlike?user_id=${this.userData.user.id}&post_id=${this.args.post_id}`,{method: 'DELETE'});
      if (!response.ok) {
        this.isLiked=true;
        throw new Error(`Error: ${response.status}`);
      }else{
        this.isLiked=false;
        let result = await response.json();
        console.log('Success:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }finally{
      this.isLoading=false;
    }
  }
}
