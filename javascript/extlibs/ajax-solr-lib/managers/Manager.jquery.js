// $Id$

/**
 * @see http://wiki.apache.org/solr/SolJSON#JSON_specific_parameters
 * @class Manager
 * @augments AjaxSolr.AbstractManager
 */
AjaxSolr.Manager = AjaxSolr.AbstractManager.extend(
  /** @lends AjaxSolr.Manager.prototype */
  {
  executeRequest: function (servlet) {
    var self = this;
    if (this.proxyUrl) {
      //jQuery.post(this.proxyUrl, { query: this.store.string() }, function (data) { self.handleResponse(data); }, 'json');
			$.ajax({
					url: this.proxyUrl,
					data: { query: this.store.string() },
					type : 'post',
					dataType: 'json',
					crossDomain: true,
					success: function (data) {
						self.handleResponse(data);
					},
					error: function(request, exception) {
						//window.location.replace("");
						//alert(exception);
						$("#result").html("<p><strong>An error occurred. The server may be down due to maintenance. Please try again later.</strong></p>");
					}
			});

    }
    else {
      jQuery.getJSON(this.solrUrl + servlet + '?' + this.store.string() + '&wt=json&json.wrf=?', {}, function (data) { self.handleResponse(data); });
    }
  }
});
