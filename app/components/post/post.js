import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class PostPost extends Component {
  @service userData;
  @service session;
  @service websocket;
  @tracked isLoading = false;
  @tracked isLike=this.args.isLiked;
  @tracked isLiked = this.args.isLiked;
  @tracked totalLikes = this.args.like??0;
  @tracked likeds = this.args.isLiked ? this.args.like - 1 : this.args.like;
  @tracked comment = '';
  @tracked taged_id = [];
  @tracked taged_user = [];
  @tracked isTag = false;
  @tracked post_id = this.args.post_id;
  @tracked isShow = false;
  @tracked postComment = [];
  @tracked commentLoading = false;

  @action
  handleIsTag() {
    this.isTag = !this.isTag;
  }

  @action
  async handleIsShow() {
    this.isShow = !this.isShow;
    if (!this.isShow) {
      return;
    }
    this.commentLoading = true;
    try {
      let response = await fetch(
        `http://localhost:8080/facebook/api/comment/list?id=${this.args.post_id}`,
        {
          method: 'GET',
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
        let result = await response.json();
        this.postComment = [...result.data];
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.commentLoading = false;
    }
  }

  @action
  handleRemoveTag(idx) {
    this.taged_id = this.taged_id.filter((_, i) => i !== idx);
    this.taged_user = this.taged_user.filter((_, i) => i !== idx);
  }

  @action
  updateComment(event) {
    this.comment = event.target.value;
  }

  @action
  handleTags(user) {
    if (this.taged_id.includes(user.id)) {
      return;
    }
    this.taged_user = [...this.taged_user, user];
    this.taged_id = [...this.taged_id, user.id];
  }

  @action
  async likePost() {
    this.isLoading = true;
    try {
      let response = await fetch(
        `http://localhost:8080/facebook/api/post/like?post_id=${this.args.post_id}`,
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
        this.likeds = this.isLike ?(this.totalLikes===0?0:this.totalLikes - 1):this.totalLikes;
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
        `http://localhost:8080/facebook/api/post/unlike?post_id=${this.args.post_id}`,
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
    if (this.comment.length == 0 && this.taged_id.length == 0) return;
    this.isLoading = true;
    const data = {
      post_id: this.args.post_id,
      comment: this.comment,
      taged_id: this.taged_id,
    };

    const comment = {
      user: this.userData.user,
      comment: this.comment,
      tag: this.taged_user,
    };

    try {
      let response = await fetch(
        `http://localhost:8080/facebook/api/comment/create`,
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
        this.comment = '';
        this.taged_id = [];
        this.taged_user = [];
        this.postComment = [...this.postComment, comment];
      }
    } catch (error) {
      console.log('Error : ' + error);
    } finally {
      this.isLoading = false;
    }
  }
}
