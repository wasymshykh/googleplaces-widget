"use strict";

function GrwRemoveWidget(widget_div) {
  var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  // removing widget with message
  widget_div.textContent = message;
}

function GrwRenderResponse(widget, response) {
  if (response.code !== undefined && response.code === 200) {
    widget.innerHTML = response.message;
  } else {
    GrwRemoveWidget(widget, "Unable to get widget");
  }
}

function GrwSendRequest(widget, link) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var response = JSON.parse(this.responseText);
        GrwRenderResponse(widget, response);
      } else {
        // remove div
        GrwRemoveWidget(widget, "Unable to load widget");
      }
    }
  };

  xhttp.open("GET", link, true);
  xhttp.send();
} // return with link


function GrwExtractAttributeValue(widget, attribute) {
  var v = widget.getAttribute(attribute);

  if (v === null) {
    return false;
  }

  return v.trim();
}

function GrwWidgetHtmlDataLink(widget) {
  var uuid = GrwExtractAttributeValue(widget, 'data-uuid');
  var template = GrwExtractAttributeValue(widget, 'data-template');
  var lang = GrwExtractAttributeValue(widget, 'data-lang');
  var theme = GrwExtractAttributeValue(widget, 'data-theme');
  var link = "";

  if (uuid === false) {
    GrwRemoveWidget(widget, "Provide 'data-uuid' in widget attribute");
    return false;
  } else {
    link += "uuid=" + uuid;
  }

  if (template === false) {
    GrwRemoveWidget(widget, "Provide 'data-template' in widget attribute");
    return false;
  } else {
    if (link !== "") {
      link += "&";
    }

    link += "template=" + template;
  }

  if (lang !== false) {
    if (link !== "") {
      link += "&";
    }

    link += "lang=" + lang;
  }

  if (theme !== false) {
    if (link !== "") {
      link += "&";
    }

    link += "theme=" + theme;
  }

  link = "https://grwapi.net/api/get_widget.php?" + link;
  GrwSendRequest(widget, link);
}

function GrwWidgetLoader() {
  var grw_widgets = document.getElementsByClassName('review-widget_net');

  if (grw_widgets.length > 0) {
    for (var i = 0; i < grw_widgets.length; i++) {
      GrwWidgetHtmlDataLink(grw_widgets[i]);
    }
  } else {
    console.error('Review-Widget.net Error: Add widget div in html');
  }
}

document.addEventListener('DOMContentLoaded', function (event) {
  GrwWidgetLoader();
});