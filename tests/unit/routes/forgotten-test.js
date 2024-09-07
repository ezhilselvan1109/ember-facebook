import { module, test } from 'qunit';
import { setupTest } from 'facebook/tests/helpers';

module('Unit | Route | forgotten', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:forgotten');
    assert.ok(route);
  });
});
