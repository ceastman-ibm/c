import '../../utils/es6-weak-map-global'; // For PhantomJS
import '../../../consumables/js/polyfills/custom-event';
import '../../../consumables/js/polyfills/element-matches';
import '../../../consumables/js/polyfills/object-assign';
import mixin from '../../../consumables/js/misc/mixin';
import initComponentBySearch from '../../../consumables/js/mixins/init-component-by-search';

describe('Test init component by search', function () {
  let container;
  const spyCreate = sinon.spy();
  const options = { foo: 'Foo' };
  const Class = class extends mixin(initComponentBySearch) {
    static options = {
      selectorInit: '[data-my-component]',
    };
    static create = spyCreate;
    static components = new WeakMap();
  };

  it(`Should throw if given element is neither a DOM element or a document`, function () {
    expect(() => {
      Class.init(document.createTextNode(''));
    }).to.throw(Error);
  });

  it(`Should search from document if root element is not given`, function () {
    container = document.createElement('div');
    container.dataset.myComponent = '';
    document.body.appendChild(container);
    Class.init();
    expect(spyCreate, 'Call count of create()').to.be.calledOnce;
    expect(spyCreate.firstCall.args, 'Arguments of create()').to.deep.equal([
      container,
      {},
    ]);
  });

  it(`Should search from document if document node is given`, function () {
    container = document.createElement('div');
    container.dataset.myComponent = '';
    document.body.appendChild(container);
    Class.init(container.ownerDocument, options);
    expect(spyCreate, 'Call count of create()').to.be.calledOnce;
    expect(spyCreate.firstCall.args, 'Arguments of create()').to.deep.equal([
      container,
      options,
    ]);
  });

  it(`Should create an instance if the given element is of the widget`, function () {
    container = document.createElement('div');
    container.dataset.myComponent = '';
    Class.init(container, options);
    expect(spyCreate, 'Call count of create()').to.be.calledOnce;
    expect(spyCreate.firstCall.args, 'Arguments of create()').to.deep.equal([
      container,
      options,
    ]);
  });

  afterEach(function () {
    spyCreate.reset();
    if (container) {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
      container = null;
    }
  });
});
