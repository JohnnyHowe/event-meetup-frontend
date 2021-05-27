import Vue from 'vue'

/**
 * Fires if the user clicks outside of the component
 * Like v-on:click, but opposite
 * 
 * To use first import
 *    "import clickOutside from '...'"
 * Then refernce it in component
 *    "directives: {clickOutside: clickOutside}"
 * Place in template
 *    "<div v-click-outside='someFunc'>OOOO</div>
 *  
 * <div v-click-outside="hideMenu">AAAAAAAAA</div">
 */
export default Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});