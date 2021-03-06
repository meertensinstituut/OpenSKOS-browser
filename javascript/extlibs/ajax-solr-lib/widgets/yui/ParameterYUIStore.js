// $Id$

/**
 * A parameter store that stores the values of exposed parameters using the YUI
 * History Manager to maintain the application's state. Don't forget to add the
 * following inside your <tt>head</tt> tag:
 *
 * <pre>
 * <script src="http://yui.yahooapis.com/2.9.0/build/yahoo/yahoo-min.js"></script>
 * <script src="http://yui.yahooapis.com/2.9.0/build/event/event-min.js"></script>
 * <script src="http://yui.yahooapis.com/2.9.0/build/history/history-min.js"></script>
 * </pre>
 *
 * And the following inside your <tt>body</tt> tag:
 *
 * <pre>
 * <iframe id="yui-history-iframe" src="path-to-existing-asset" style="position:absolute;top:0;left:0;width:1px;height:1px;visibility:hidden"></iframe>
 * <input id="yui-history-field" type="hidden">
 * </pre>
 *
 * @see http://developer.yahoo.com/yui/history/
 * @class ParameterYUIStore
 * @augments AjaxSolr.ParameterStore
 */
AjaxSolr.ParameterYUIStore = AjaxSolr.ParameterStore.extend(
  /** @lends AjaxSolr.ParameterYUIStore.prototype */
  {

  /**
   * The name of the YUI History Manager module to use for the parameter store.
   *
   * @field
   * @public
   * @type String
   * @default 'q'
   */
  module: 'q',

  /**
   * Whether the YUI History Manager is initialized.
   *
   * @field
   * @private
   * @type Boolean
   * @default false
   */
  initialized: false,

  /**
   * Initializes the YUI History Manager.
   */
  init: function () {
    if (this.exposed.length) {
      var self = this;
      YAHOO.util.History.register(this.module, YAHOO.util.History.getBookmarkedState(this.module) || this.exposedString(), function () {
        self.load();
        self.manager.doRequest();
      });
      YAHOO.util.History.onReady(function () {
        self.initialized = true;
        self.load();
        self.manager.doRequest();
      });
      YAHOO.util.History.initialize('yui-history-field', 'yui-history-iframe');
    }
  },

  /**
   * Stores the values of the exposed parameters in the YUI History Manager.
   */
  save: function () {
    YAHOO.util.History.navigate(this.module, this.exposedString());
  },

  /**
   * @see ParameterStore#storedString()
   */
  storedString: function () {
    return this.initialized ? YAHOO.util.History.getCurrentState(this.module) : this.exposedString();
  }
});
