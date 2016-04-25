// ==UserScript==
// @name         Bitbucket Diff Highlighter
// @namespace    http://chengsoft.com/
// @version      0.3
// @description  Highlight Bitbucket pull-requests
// @author       Tim Cheng <tim.cheng09@gmail.com>
// @match        https://bitbucket.org/*/diff
// @match        https://bitbucket.org/*/commits/*
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @resource     sourceCodeProFont https://fonts.googleapis.com/css?family=Source+Code+Pro=
// ==/UserScript==

(function() {
    'use strict';

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

    GM_addStyle(GM_getResourceText("sourceCodeProFont"));
    GM_addStyle(themeStarkCss);
    //    GM_addStyle(solarizedDark);

    $.getScript('https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js', function( data, textStatus, jqxhr ) {
        GM_log('Got prettify');
        GM_log('Wait for source code diffs to load...');
        waitForKeyElements('.refract-content-container', function actionFunction (container) {
            GM_log('Found diff to act on');
            GM_log($(container));

            var sectionSourceCode = "";
            $(container).children().each(function(index, value) {
                // Collect all the source code lines
                if ($(value).hasClass('udiff-line')) {
                    // GM_log('child: ' + $(value).attr('class'));

                    var line = $(value).find(".source").text();
                    // If the line does not start with a "-"
                    if (!/^-.*/.test(line)) {
                        // replace the "+" if it exists
                        if (/^\+.*/.test(line)) {
                            //GM_log('before: ' + line);
                            line = line.replace("+", " ");
                            //GM_log('after: ' + line);
                        }
                        sectionSourceCode = sectionSourceCode += "\n" + line;
                    }
                // When a skipped-container is encountered, we collected all the source code for this section
                // Simply output the source code and reset the variable to an empty string
                } else if ($(value).hasClass('skipped-container')) {
                    // GM_log('skipped container');
                    $(container).append($("<pre>", {class:"prettyprint theme-stark"}).append($("<code>", {text:sectionSourceCode})));
                    sectionSourceCode = "";
                }

            });

            // If we finished collecting the source code for the section and it hasn't been printed yet, do so
            if (!sectionSourceCode) {
                $(container).append($("<pre>", {class:"prettyprint theme-stark"}).append($("<code>", {text:sectionSourceCode})));
            }

            // call pretty print in case it didn't run
            PR.prettyPrint();
        });
    });
})();