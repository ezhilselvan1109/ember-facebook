import { module, test } from 'qunit';
import { setupTest } from 'facebook/tests/helpers';

module('Unit | Controller | forgotten', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:forgotten');
    assert.ok(controller);
  });
});
