`const Cc = Components.classes`
`const Ci = Components.interfaces`

helpers =
  first: (list) -> list[0]

onLoad = ->
  box = helpers.first document.getAnonymousNodes document.getElementById 'right_toolbox_tabs'
  if (box and box.localName) is 'box' and (box.childNodes and box.childNodes.length) is 4
    [childTitle, childSpace, childSidebar] = box.childNodes...
    # Ensure we are working with the correct nodes, these might change between builds
    if childTitle.className.indexOf('tab-text') >= 0 and 'spacer' is childSpace.localName and childSidebar.className.indexOf('sidebar-buttons') >= 0
      box.insertBefore childSidebar, childTitle
      box.insertBefore childSpace, childTitle
      # Reverse the order of tab-select and tab-close so the latter becomes the left-most element
      if childSidebar.childNodes.length is 2 and childSidebar.childNodes[0].className.indexOf('tabs-select-button') >= 0
        childSidebar.insertBefore childSidebar.childNodes[1], childSidebar.childNodes[0]
        box.className += ' sidebar-buttons-reversed'
      box.className += ' children-reversed'

observerService = Cc['@mozilla.org/observer-service;1'].getService Ci.nsIObserverService
observer =
	observe: (subject, topic, data) ->
		observerService.removeObserver observer, 'komodo-ui-started'
		onLoad()
observerService.addObserver observer, 'komodo-ui-started', false
