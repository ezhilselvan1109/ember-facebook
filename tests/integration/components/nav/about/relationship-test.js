import { module, test } from 'qunit';
import { setupRenderingTest } from 'facebook/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | nav/about/relationship', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Nav::About::Relationship />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <Nav::About::Relationship>
        template block text
      </Nav::About::Relationship>
    `);

    assert.dom().hasText('template block text');
  });
});
