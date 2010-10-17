this.extensions = {} unless extensions?
this.extensions.aerotheme = {} unless extensions.aerotheme?

`const Cc = Components.classes`
`const Ci = Components.interfaces`

ioService = Cc['@mozilla.org/network/io-service;1'].getService Ci.nsIIOService

readContents = (uri) ->
  try
    channel = ioService.newChannel uri, null, null
    input   = channel.open()
    stream  = Cc['@mozilla.org/scriptableinputstream;1'].createInstance Ci.nsIScriptableInputStream
    stream.init input
    contents = stream.read input.available()
  finally
    stream.close() if stream
    input.close()  if input
  return contents


this.extensions.aerotheme.Style = class Style

  @top: null

  constructor: (@name) ->
    return new Style arguments... if this not instanceof Style
    Style.top = this unless Style.top
    @reload()

  reload: ->
    unless window.less
      loader = Cc['@mozilla.org/moz/jssubscript-loader;1'].getService Ci.mozIJSSubScriptLoader
      loader.loadSubScript 'chrome://aerotheme/content/scripts/less-1.0.36.js'
    href = "chrome://aerotheme/skin/#{@name}.less"
    try
      parser = new less.Parser optimization: 0
      parser.parse readContents(href), (error, root) =>
        throw error if error
        @inject root
    catch error
      throw error

  inject: (node) ->
    for child in document.childNodes when child.nodeType is Node.PROCESSING_INSTRUCTION_NODE and child.nodeValue.indexOf('aerotheme') > 0
      child.nodeValue = 'discard="discard"'
      document.removeChild child
      break
    pi = document.createProcessingInstruction 'xml-stylesheet', """
      data-author="aerotheme"
      href="data:text/css,#{ encodeURIComponent node.toCSS().replace /images\//g, 'chrome://aerotheme/skin/images/' }"
      type="text/css"
    """
    document.insertBefore pi, document.firstChild


Style 'default'
