import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class PostPost extends Component {
  @service userData;
  @service session;
  @tracked isLoading = false;
  @tracked isLiked = this.args.isLiked;
  @tracked totalLikes = this.args.like;
  @tracked likeds = this.args.isLiked ? this.args.like - 1 : this.args.like;
  @tracked comment = '';
  @tracked taged_ids = [];
  @tracked taged_users = [];
  @tracked isTag=false;
  @tracked post_id=this.args.post_id;
  @tracked isShow=false;

  @action
  handleIsTag() {
    this.isTag = !this.isTag;
  }

  @action
  handleIsShow() {
    this.isShow = !this.isShow;
  }

  @action
  handleRemoveTag(idx){
    this.taged_ids=[...this.taged_ids.filter((index)=>idx!=index)];
    this.taged_users = this.taged_users.filter((_, i) => i !== idx);
  }

  @action
  updateComment(event) {
    this.comment = event.target.value;
  }

  @action
  handleTags(user) {
    if(this.taged_ids.includes(user.id)){
      return;
    }
    this.taged_users=[...this.taged_users, user.first_name+" "+user.last_name]; 
    this.taged_ids=[...this.taged_ids, user.id];
  }

  @action
  async likePost() {
    this.isLoading = true;
    try {
      let response = await fetch(
        `http://localhost:8080/facebook/api/post/like?user_id=${this.userData.user.id}&post_id=${this.args.post_id}`,
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
        this.isLiked = false;
        throw new Error(`Error: ${response.status}`);
      } else {
        this.isLiked = true;
        this.likeds = totalLikes - 1;
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
  async unlikePost() {
    this.isLoading = true;
    try {
      let response = await fetch(
        `http://localhost:8080/facebook/api/post/unlike?user_id=${this.userData.user.id}&post_id=${this.args.post_id}`,
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
        this.isLiked = true;
        throw new Error(`Error: ${response.status}`);
      } else {
        this.isLiked = false;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async handleComment(event) {
    event.preventDefault();
    this.isLoading = true;
    const data = {
      post_id: this.args.post_id,
      id: this.userData.user.id,
      comment: this.comment,
      taged_ids: this.taged_ids,
    };
    try {
      console.log('data : ', data);
      let response = await fetch(
        `http://localhost:8080/facebook/api/comment/post`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        this.errorMessage = errorData.data.join(', ');
      } else {
      }
    } catch (error) {
      console.log('Error : ' + error);
    } finally {
      this.isLoading = false;
    }
  }
}
