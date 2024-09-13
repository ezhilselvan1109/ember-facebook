import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class NavAboutBasicInfo extends Component {
    @tracked gender='Male';
    @tracked dateOfBirth='11-09-2001';

    
}
