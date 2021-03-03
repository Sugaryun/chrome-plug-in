chrome.extension.onRequest.addListener(function (a, d, b) {
  switch (a.type) {
    case "storeStorage": "tips_coupon" == a.key && (global.tips_coupon = a.value); localStorage.setItem(a.key, a.value); break;
    case "loadStorage": b(localStorage.getItem(a.key)); break;
    case "init": global.coupon_enabled = localStorage.getItem("coupon_enabled"); global.tips_coupon = localStorage.getItem("tips_coupon"); global.uuid = localStorage.getItem("uuid"); global.userId = a.userId ? a.userId : localStorage.getItem("userId"); global.userId = void 0 == global.userId ||
      null == global.userId ? 0 : global.userId; void 0 == global.baseurl || 0 == global.lastRequestTime || (new Date).getTime() - global.lastRequestTime >= global.expire ? requestDomain(b) : b(global); break;
    case "getCouponFrame": b(getFrameHtml()); break; case "getCouponContent": requestCoupon(a.param, b, !0); break; case "getCouponRecommend": requestRecommendList(a.param, b, !0); break;
    case "getCouponList": requestCouponList(a.param, b, !0); break; case "global": b(global); break;
    case "clearBadge": clearBadge()
  }
});
var global = { index: 2, template: 2, debug: !1, lastRequestTime: 0, shop: "https://www.bntyh.com", baseurl: "https://www.guangyaguang.com" }, intervalId = -1; function init() { -1 == intervalId && (intervalId = setInterval(function () { var a = localStorage.getItem("badge"); console.log(a); requestBadge() }, 6E5)) } init();
function requestBadge() { $.ajax({ url: global.baseurl + "/tool/badge.json", dataType: "json", async: !0, timeout: 5E3, type: "get", data: { index: global.index, uuid: global.uuid }, success: function (a) { if (a && a.data && 0 < a.data.date) { var d = localStorage.getItem("badge"); a.data.date != d && (showBadge(a.data.date), clearInterval(intervalId), intervalId = -1) } } }) } function showBadge(a) { localStorage.setItem("badge", a); chrome.browserAction.setBadgeText({ text: "new" }); chrome.browserAction.setBadgeBackgroundColor({ color: "#FFA10B" }) }
function clearBadge() { chrome.browserAction.setBadgeText({ text: "" }); chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] }); init() }
function requestDomain(a) { $.ajax({ url: "https://" + (global.debug ? "127.0.0.1" : "www.huitaoyouhui.com") + "/main.json", dataType: "json", async: !0, timeout: 5E3, type: "get", data: { index: global.index, userId: global.userId, uuid: global.uuid }, success: function (d) { d && (global.lastRequestTime = (new Date).getTime(), global.baseurl = d.data, global.salt = d.salt, global.expire = d.expire, global.shop = d.shop, global.uuid = d.uuid, localStorage.setItem("uuid", global.uuid)); a(global) } }) }
function requestCouponList(a, d, b) { var e = { ids: a.ids, userId: global.userId, index: global.index, uuid: global.uuid, keyword: a.keyword }; e.sign = makeSign(e, global.salt); $.ajax({ url: global.baseurl + "/coupon/list1.json", dataType: "json", async: !0, timeout: 5E3, type: "post", data: e, success: function (a) { d(a) }, error: function (c) { !c.status || 600 != c.status && 601 != c.status || 1 != b || retry(requestCouponList, a, d) } }) }
function requestCoupon(a, d, b) { var e = { id: a.id, keyWords: a.title, userId: global.userId, index: global.index, uuid: global.uuid }; e.sign = makeSign(e, global.salt); $.ajax({ url: global.baseurl + "/getCoupon6.json", dataType: "json", async: !0, timeout: 5E3, type: "post", data: e, success: function (c) { c = c.item || c.pdd ? getCouponHtml(c.item, c.pdd, a) : nothingHtml(); d(c) }, error: function (c) { !c.status || 600 != c.status && 601 != c.status || 1 != b ? d(nothingHtml()) : retry(requestCoupon, a, d) } }) }
function requestRecommendList(a, d, b) { var e = { id: a.id, keyWords: a.title, uuid: global.uuid }; e.sign = makeSign(e, global.salt); $.ajax({ url: global.baseurl + "/coupon/recommend.json", dataType: "json", async: !0, timeout: 5E3, type: "post", data: e, success: function (a) { a = a && a.data ? getRecommendHtml(a.data) : nothingRecommendHtml(); d(a) }, error: function (c) { !c.status || 600 != c.status && 601 != c.status || 1 != b || retry(requestRecommendList, a, d) } }) } function retry(a, d, b) { requestDomain(function () { a(d, b, !1) }) }
function nothingHtml() { return '<td colspan="3"><p style="color:rgba(126,125,124,1);font-size:14px;line-height:30px;">\u8fd9\u4e2a\u5546\u54c1\u6ca1\u6709\u4f18\u60e0\u5238\u3002</td>' } function nothingRecommendHtml() { return '<td colspan="3"><p style="color:rgba(126,125,124,1);font-size:14px;line-height:30px;">\u672a\u627e\u5230\u76f8\u4f3c\u7684\u4f18\u60e0\u5546\u54c1\u3002</p></td>' }
function getCouponHtml(a, d, b) {
  if (a) { chrome.extension.getURL("images/wechat.png"); var e = Number(a.coupon_info.split("\u5143\u51cf")[1].split("\u5143")[0]); e = '<tr class="b1m-tr hh-data"><td>\u6dd8\u5b9d\u5185\u90e8\u5238</td><td>' + a.coupon_info + "</td><td>" + (a.zk_final_price - e).toFixed(1) + '</td><td><a id="img_qrcode" style="cursor:pointer;" id="lingquan" style="color: cornflowerblue" class="lingquan_js_' + global.index + '" data-couponUrl="' + a.coupon_share_url + '" data-couponTitle="' + a.title + '">\u9886\u5238</a></td></tr>' } a =
    chrome.extension.getURL("images/pdd.png"); for (var c in d) {
      b = d[c]; var f = 0; "" != b.couponInfo ? f = Number(b.couponInfo.split("\u5143\u51cf")[1].split("\u5143")[0]) : b.couponInfo = "\u65e0\u4f18\u60e0\u5238"; e += '<tr class="b1m-tr hh-data"><td><img id="pdd_detail_' + c + '" class="pdd_detail" src="' + b.pictUrl + '" /><p class="pdd_text" data="pdd_detail_' + c + '"><span><img class="" width="25px" height="25px" src="' + a + '" /></span>' + b.label + "</p></td><td>" + b.couponInfo + "</td><td>" + (b.finalPrice - f).toFixed(1) + '\u5143</td><td><a style="cursor:pointer;" class="pdd_lingquan" data="' +
        c + '" style="color: cornflowerblue" target="_blank">\u626b\u7801\u8d2d\u4e70</a>&nbsp;&nbsp;&nbsp;<a href="' + b.itemUrl + '" target="_blank">\u67e5\u770b</a><div id="pdd_qrcode_' + c + '" align="center" class="qrcode" style="margin-left:-40px;display:none"><div class="qrcode_text">\u6253\u5f00\u5fae\u4fe1</p>\u626b\u63cf\u4e8c\u7ef4\u7801</div><div class="qrcode_image" data="' + b.itemUrl + '"></div></div></td></tr>'
    } return e
}
function getRecommendHtml(a) {
  for (var d = '<ul style="font-size:12px;">', b = 0; b < a.length; b++) {
    var e = a[b]; d += '<li align="left" style="padding-top:8px;padding-bottom:8px;margin-left:13px;" class="hh-recommend-item" ><a href="' + e.itemLink + '"><span style="display: table-cell;vertical-align: top"><img width="84px" height="84px" src="' + e.mainPic + '" /></span><span style="display: table-cell;width:401px; height:84px;padding-left:10px;"><div style="display:block;overflow: hidden;">' + e.title + '</div><div style="display:block;margin-top:22px;padding-left:10px;" class="hh-recommend-item-coupon hh-recommend-item-coupon-text">\u9886\u53d6' +
      Number(e.couponPrice).toFixed(1) + '\u5143\u4f18\u60e0\u5238</div><div style="display:block;margin-top:9px;" class="hh-recommend-item-price">\u5230\u624b\u4ef7\uff1a\uffe5' + (Number(e.originalPrice) - Number(e.couponPrice)).toFixed(1) + "</div></span></a></li>"
  } return d + "</ul>"
}
function getFrameHtml() {
  return '<div class="bam-div" id="hh_widget_id_' + global.index + '"><table class="b1m-table" style="width:500px;"><tbody><tr class="b1m-tr hd1m-tr"><th><b style="cursor:pointer">\u5546\u54c1</b></th><th><b style="cursor:pointer">\u4f18\u60e0\u5238</b></th><th>\u5238\u540e</th><th>\u9886\u53d6</th></tr><tr id="hh-value" class="b1m-tr"><td colspan="4">\u6b63\u5728\u8f7d\u5165\u4e2d</td></tr></tbody></table></div>'
}
function makeSign(a, d) { delete a.sign; var b = "", e = []; for (c in a) e.push(c); e.sort(); for (index in e) { var c = e[index]; b += c + "=" + (void 0 == a[c] || null == a[c] ? "" : a[c]) + "&" } b += d; a = $.md5(b); global.debug && (console.log("str:" + b), console.log("sign:" + a)); return a };