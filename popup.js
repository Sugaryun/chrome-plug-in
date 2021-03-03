function storeStorage(a, b) {
  chrome.extension.sendRequest(
    { type: "storeStorage", key: a, value: b },
    function (a) {}
  );
}
function loadStorage(a, b) {
  chrome.extension.sendRequest({ type: "loadStorage", key: a }, b);
}
function proxyPerform(a) {
  loadStorage("tips_popup", function (b) {
    "unshow" == b
      ? a()
      : ($(".div-background").show(),
        $(".tips-2").on("click", function () {
          $("#unshow").is(":checked") && storeStorage("tips_popup", "unshow");
          a();
          $(".div-background").hide();
        }));
  });
}
function gotoHomePage() {
  chrome.extension.sendRequest({ type: "global" }, function (a) {
    window.open(a.shop);
  });
}
$(".img_click").on("click", function () {
  proxyPerform(gotoHomePage);
});
$(".search").on("click", function () {
  proxyPerform(gotoSearchPage);
});
$(document).keyup(function (a) {
  13 == a.keyCode && proxyPerform(gotoSearchPage);
});
function gotoSearchPage() {
  chrome.extension.sendRequest({ type: "global" }, function (a) {
    window.open(a.shop + "/index.php?input=2&r=l&kw=" + $(".input").val());
  });
}
$("#unshow").on("click", function (a) {
  a.stopPropagation();
});
$(".div-background").on("click", function (a) {
  $(".div-background").hide();
});
chrome.extension.sendRequest({ type: "clearBadge" }, function (a) {});
