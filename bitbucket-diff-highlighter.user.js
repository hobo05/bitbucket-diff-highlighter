// ==UserScript==
// @name         Bitbucket Diff Highlighter
// @namespace    http://chengsoft.com/
// @version      0.1
// @description  Highlight Bitbucket pull-requests
// @author       Tim Cheng <tim.cheng09@gmail.com>
// @match        https://bitbucket.org/*/diff
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @resource     sourceCodeProFont https://fonts.googleapis.com/css?family=Source+Code+Pro=
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(GM_getResourceText("sourceCodeProFont"));

    $.getScript('https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js');
    GM_log('Got prettify');

    /*jshint multistr: true */

    var themeStarkCss = "\
pre.theme-stark {\
background-color: #2E2C2B;\
padding: 2em;\
font-size: 1em;\
color: #DEDEDE;\
}\
pre.theme-stark code {\
background: #2E2C2B;  /* This overrides the stupid gray background from bitbucket*/\
border: none; /* remove the border */\
font-family: 'Source Code Pro', Monaco, Consolas, 'Lucida Console', monospace;\
}\
pre.theme-stark .pln {\
color: #DEDEDE;\
}\
pre.theme-stark .str {\
color: #FFBB29;\
}\
pre.theme-stark .kwd {\
color: #FFBB29;\
}\
pre.theme-stark .com {\
color: #615953;\
}\
pre.theme-stark .typ {\
color: #62A741;\
}\
pre.theme-stark .lit {\
color: #F98A37;\
}\
pre.theme-stark .pun,\
pre.theme-stark .opn,\
pre.theme-stark .clo {\
color: #DEDEDE;\
}\
pre.theme-stark .tag {\
color: #FFBB29;\
}\
pre.theme-stark .atn {\
color: #F03113;\
}\
pre.theme-stark .atv {\
color: #F03113;\
}\
pre.theme-stark .dec,\
pre.theme-stark .var {\
color: #FFBB29;\
}\
pre.theme-stark .fun {\
color: #FFBB29;\
}\
";

    var solarizedDark = "\
.prettyprint code {\
color: #839496;\
background-color: #002b36;\
background: #002b36;\
border: none; /* remove the border */\
font-family: 'Source Code Pro', Monaco, Consolas, 'Lucida Console', monospace;\
}\
\
.prettyprint .pln {\
color: inherit;\
}\
\
.prettyprint .str,\
.prettyprint .lit,\
.prettyprint .atv {\
color: #2aa198;\
}\
\
.prettyprint .kwd {\
color: #268bd2;\
}\
\
.prettyprint .com,\
.prettyprint .dec {\
color: #586e75;\
font-style: italic;\
}\
\
.prettyprint .typ {\
color: #b58900;\
}\
\
.prettyprint .pun {\
color: inherit;\
}\
\
.prettyprint .opn {\
color: inherit;\
}\
\
.prettyprint .clo {\
color: inherit;\
}\
\
.prettyprint .tag {\
color: #268bd2;\
font-weight: bold;\
}\
\
.prettyprint .atn {\
color: inherit;\
}\
";

    GM_addStyle(themeStarkCss);
//    GM_addStyle(solarizedDark);

    GM_log('Wait for source code diffs to load...');
    waitForKeyElements('.refract-content-container', function actionFunction (container) {
        GM_log('Found diff to act on');
        GM_log($(container));

        var sourceCode = "";
        var finalSourceCode = "";
        $(container).find(".source").each(function(index, value) {
            var line = $(value).text();
            sourceCode = sourceCode += "\n" + line;

            // If the line does not start with a "-"
            if (!/^-.*/.test(line)) {
                // replace the "+" if it exists
                if (/^\+.*/.test(line)) {
                    GM_log('before: ' + line);
                    line = line.replace("+", " ");
                    GM_log('after: ' + line);
                }
                finalSourceCode = finalSourceCode += "\n" + line;
            }
        });

        //        GM_log(sourceCode);
        //        GM_log(finalSourceCode);

        //$(container).empty();
        $(container).append($("<pre>", {class:"prettyprint theme-stark"}).append($("<code>", {text:finalSourceCode})));

        // call pretty print in case it didn't run
        PR.prettyPrint();
    });
})();