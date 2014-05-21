/**
 * @fileoverview A standard data provider for stylesheet.css
 * @author lakenen
 */
Crocodoc.addDataProvider('stylesheet', function(scope) {
    'use strict';

    var ajax = scope.getUtility('ajax'),
        browser = scope.getUtility('browser'),
        config = scope.getConfig();

    /**
     * Process stylesheet text and return the embeddable result
     * @param   {string} text The original CSS text
     * @returns {string}      The processed CSS text
     * @private
     */
    function processStylesheetContent(text) {
        // @NOTE: There is a bug in IE that causes the text layer to
        // not render the font when loaded for a second time (i.e.,
        // destroy and recreate a viewer for the same document), so
        // namespace the font-family so there is no collision
        if (browser.ie) {
            text = text.replace(/font-family:[\s\"\']*([\w-]+)\b/g,
                '$0-' + config.id);
        }

        return text;
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        /**
         * Retrieve the stylesheet.css asset from the server
         *
         * @param {string} modelName The name of the requested model (stylesheet)
         * @returns {$.Promise}      A promise with an additional abort() method that will abort the XHR request.
         */
        get: function() {
            var cssPath = config.template.css,
                url = config.url + cssPath + config.queryString,
                $promise = ajax.fetch(url, Crocodoc.ASSET_REQUEST_RETRIES);

            // @NOTE: promise.then() creates a new promise, which does not copy
            // custom properties, so we need to create a futher promise and add
            // an object with the abort method as the new target
            return $promise.then(processStylesheetContent).promise({
                abort: $promise.abort
            });
        }
    };
});
