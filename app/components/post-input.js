import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class PostInput extends Component {
  @tracked description = '';
  @tracked file = null;
  @tracked isLoading = false;
  @service userData;
  @tracked isSubmited=false;
  @tracked errorMessage='';
  @action
  handleDescriptionChange(event) {
    this.description = event.target.value;
  }

  @action
  handleFileChange(event) {
    this.file = event.target.files[0];
  }

  @action
  async handleSubmit(event) {
    event.preventDefault();
    let formData = new FormData();
    if(this.file==null && this.description==''){
      this.errorMessage='file the form';
      return;
    }
    this.isLoading = true;
    this.isSubmited=false;
    
    formData.append('description', this.description);
    if (this.file) {
      formData.append('image', this.file);
    }
    formData.append('user_id', this.userData.user.id);

    try {
      let response = await fetch('http://localhost:8080/facebook/api/post/create',{method: 'POST',body: formData});
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }else{
        this.isSubmited=true;
        let result = await response.json();
        console.log('Success:', result);
      }
      this.description = '';
      this.file = null;
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
