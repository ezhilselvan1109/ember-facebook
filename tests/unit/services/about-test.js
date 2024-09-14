import { module, test } from 'qunit';
import { setupTest } from 'facebook/tests/helpers';

module('Unit | Service | about', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:about');
    assert.ok(service);
  });
});
