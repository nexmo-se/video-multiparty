// @flow
import LM from 'opentok-layout-js';

class LayoutManager {
  constructor(container, manager) {
    this.container = container;
    this.manager = manager;
  }

  init() {
    const element = document.getElementById(this.container);
    if (element)
      this.manager = LM(element, {
        fixedRatio: false,
        alignItems: 'center',
        bigPercentage: 0.8,
        bigFixedRatio: false,
        bigAlignItems: 'center',
        smallAlignItems: 'center',
        maxWidth: Infinity,
        maxHeight: Infinity,
        smallMaxWidth: Infinity,
        smallMaxHeight: Infinity,
        bigMaxWidth: Infinity,
        bigMaxHeight: Infinity,
        bigMaxRatio: 3 / 2,
        bigMinRatio: 9 / 16,
        bigFirst: true,
      });
    else throw new Error('Cannot find container');
  }

  layout() {
    if (!this.manager) this.init();
    this.manager.layout();
  }
}
export default LayoutManager;
