(function() {
  var helpers, observer, observerService, onLoad;
  const Cc = Components.classes;
  const Ci = Components.interfaces;
  helpers = {
    first: function(list) {
      return list[0];
    }
  };
  onLoad = function() {
    var _a, box, childSidebar, childSpace, childTitle;
    box = helpers.first(document.getAnonymousNodes(document.getElementById('right_toolbox_tabs')));
    if ((box && box.localName) === 'box' && (box.childNodes && box.childNodes.length) === 4) {
      _a = box.childNodes;
      childTitle = _a[0];
      childSpace = _a[1];
      childSidebar = _a[2];
      if ((childTitle.className.indexOf('tab-text') >= 0) && 'spacer' === childSpace.localName && (childSidebar.className.indexOf('sidebar-buttons') >= 0)) {
        box.insertBefore(childSidebar, childTitle);
        box.insertBefore(childSpace, childTitle);
        if (childSidebar.childNodes.length === 2 && (childSidebar.childNodes[0].className.indexOf('tabs-select-button') >= 0)) {
          childSidebar.insertBefore(childSidebar.childNodes[1], childSidebar.childNodes[0]);
          box.className += ' sidebar-buttons-reversed';
        }
        return box.className += ' children-reversed';
      }
    }
  };
  observerService = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);
  observer = {
    observe: function(subject, topic, data) {
      observerService.removeObserver(observer, 'komodo-ui-started');
      return onLoad();
    }
  };
  observerService.addObserver(observer, 'komodo-ui-started', false);
})();
