(function() {
  var Style, ioService, readContents;
  var __bind = function(func, context) {
    return function() { return func.apply(context, arguments); };
  };
  if (!(typeof extensions !== "undefined" && extensions !== null)) {
    this.extensions = {};
  }
  if (!(extensions.aerotheme != null)) {
    this.extensions.aerotheme = {};
  }
  const Cc = Components.classes;
  const Ci = Components.interfaces;
  ioService = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);
  readContents = function(uri) {
    var channel, contents, input, stream;
    try {
      channel = ioService.newChannel(uri, null, null);
      input = channel.open();
      stream = Cc['@mozilla.org/scriptableinputstream;1'].createInstance(Ci.nsIScriptableInputStream);
      stream.init(input);
      contents = stream.read(input.available());
    } finally {
      if (stream) {
        stream.close();
      }
      if (input) {
        input.close();
      }
    }
    return contents;
  };
  this.extensions.aerotheme.Style = (function() {
    Style = (function() {
      function Style(_arg) {
        this.name = _arg;
        if (!(this instanceof Style)) {
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor, result = func.apply(child, args);
            return typeof result === "object" ? result : child;
          })(Style, arguments, function() {});
        }
        if (!Style.top) {
          Style.top = this;
        }
        this.reload();
        return this;
      };
      return Style;
    })();
    Style.top = null;
    Style.prototype.reload = function() {
      var href, loader, parser;
      if (!window.less) {
        loader = Cc['@mozilla.org/moz/jssubscript-loader;1'].getService(Ci.mozIJSSubScriptLoader);
        loader.loadSubScript('chrome://aerotheme/content/scripts/less-1.0.36.js');
      }
      href = ("chrome://aerotheme/skin/" + (this.name) + ".less");
      try {
        parser = new less.Parser({
          optimization: 0
        });
        return parser.parse(readContents(href), __bind(function(error, root) {
          if (error) {
            throw error;
          }
          return this.inject(root);
        }, this));
      } catch (error) {
        throw error;
      }
    };
    Style.prototype.inject = function(node) {
      var _i, _len, _ref, child, pi;
      for (_i = 0, _len = (_ref = document.childNodes).length; _i < _len; _i++) {
        child = _ref[_i];
        if (child.nodeType === Node.PROCESSING_INSTRUCTION_NODE && child.nodeValue.indexOf('aerotheme') > 0) {
          child.nodeValue = 'discard="discard"';
          document.removeChild(child);
          break;
        }
      }
      pi = document.createProcessingInstruction('xml-stylesheet', "data-author=\"aerotheme\"\nhref=\"data:text/css," + (encodeURIComponent(node.toCSS().replace(/images\//g, 'chrome://aerotheme/skin/images/'))) + "\"\ntype=\"text/css\"");
      return document.insertBefore(pi, document.firstChild);
    };
    return Style;
  }).call(this);
  Style('default');
}).call(this);
