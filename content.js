$(document).ready(function () {
  function p(a, c) {
    chrome.extension.sendRequest(
      { type: "storeStorage", key: a, value: c },
      function (a) {}
    );
  }
  function x(a, c) {
    chrome.extension.sendRequest({ type: "loadStorage", key: a }, c);
  }
  function v(a) {
    var c = {
      getTaobaoId: function () {
        var a = document.cookie.split(";"),
          c;
        for (c in a) {
          var b = a[c].split("=");
          if (2 == b.length && "unb" == b[0].trim()) {
            var e = b[1];
            break;
          }
        }
        if (!e || "" == e) {
          a = document.getElementsByTagName("script");
          for (c in a) if ((str = a[c].getAttribute("exparams"))) break;
          if (str)
            for (c in ((a = str.split("&")), a))
              if ("userid" == a[c].trim().substring(0, 6)) {
                e = a[c].trim().substring(7);
                break;
              }
        }
        e && "" != e ? p("userId", e) : ((e = d.userId) && "" != e) || (e = 0);
        console.log(e);
        return e;
      },
      checkLogin: function (a) {
        if ("s.taobao.com" == this.host || "item.taobao.com" == this.host) {
          if (
            0 >= a.userId ||
            (0 < $(".site-nav-sign").length &&
              "none" != $(".site-nav-sign").css("display"))
          )
            return (
              (window.location.href = $(".site-nav-sign > .h").attr("href")), !1
            );
        } else if (0 >= a.userId || 0 < $(".sn-login").length)
          return (window.location.href = $(".sn-login").attr("href")), !1;
        return !0;
      },
    };
    $.extend(c, a);
    return c;
  }
  function q(a) {
    var c = v({
      type: "list",
      keySearch: "#q",
      keyInjectPoint: ".tb-main-title",
      keyListIds: "#J_ItemList .product",
      keyListIdAttr: "data-id",
      keyList: ".productImg-wrap",
      parsePage: function () {
        for (
          var a = $(this.keySearch).val(),
            c = $(this.keyListIds),
            b = [],
            e = {},
            m = 0;
          m < c.length;
          m++
        )
          if (
            "s.taobao.com" != this.host ||
            "msrp_auction" == c[m].getAttribute("trace")
          ) {
            var f = c[m].getAttribute(this.keyListIdAttr);
            b.push(f);
            e[f] = m;
          }
        d.idIndex = e;
        return { keyword: a, ids: "[" + b.toString() + "]" };
      },
      injectPage: function (a, c) {
        if (a) {
          var g = $(this.keyList),
            e = chrome.extension.getURL("images/list_quan.png");
          for (k in d.idIndex)
            if (a[k]) {
              var l = g[d.idIndex[k]],
                f = document.createElement("span"),
                n = Number(
                  a[k].coupon_info.split("\u5143\u51cf")[1].split("\u5143")[0]
                );
              f.innerHTML =
                "<img style='width:20px;height:20px;vertical-align:middle' src=" +
                e +
                ">\u70b9\u6b64\u9886\u53d6&nbsp;&nbsp;&nbsp;&nbsp;" +
                n +
                "\u5143\u4f18\u60e0\u5238";
              f.setAttribute("href", a[k].url);
              f.setAttribute("target", "_blank");
              f.setAttribute("data-couponUrl", a[k].url);
              f.setAttribute("class", "list_lingquan_js_" + d.index);
              f.setAttribute(
                "style",
                "cursor: pointer;position:absolute;z-index:999;top:0px;right:0px;border:1px solid #FF2929; background-color:rgba(255,255,255,100);color:#FF2929;font-size:14px;padding:2px"
              );
              l.append(f);
            }
        }
        if (c) {
          a = $(this.keySearch).val();
          g = chrome.extension.getURL("images/pdd.png");
          var k = chrome.extension.getURL("images/close.png");
          l = document.createElement("div");
          l.setAttribute("id", "hh_widget_id_" + d.index);
          l.setAttribute(
            "style",
            "position: fixed;bottom:0px;right:0px;z-index:100001;padding-right:3px;"
          );
          f =
            '<table id="products" style="border-spacing:0px;display:none;border:1px solid #ff0000;background:rgba(255,255,255,255);">';
          for (index in c.list)
            (e = c.list[index]),
              0 == index % 3 && (f += "<tr>"),
              (n = 0),
              "" != e.couponInfo &&
                (n = Number(
                  e.couponInfo.split("\u5143\u51cf")[1].split("\u5143")[0]
                )),
              (f +=
                '<td width="99px" height="110px" style="padding:3px;" align="center"><a href="' +
                e.itemUrl +
                '" target="_blank" ><img width="70px" height="70px" src="' +
                e.pictUrl +
                '"><div style="max-height: 35px;overflow: hidden;">' +
                e.title +
                '</div><div style="font-size:5px;"><p style="color:#FA4900;float:left;">' +
                (e.finalPrice - n).toFixed(1) +
                '\u5143</p><p style="float:right;color:#4F4F4F;text-decoration:line-through;">' +
                e.finalPrice +
                "\u5143</p></div></a></td>"),
              0 == (index + 1) % 3 && (f += "</tr>");
          f +=
            '</table><table cellspacing="0" cellpadding="0" style="background:rgba(229,83,71,1);color:rgba(255,255,255,1);"><tr><td id="td1"><div style="height:48px;"><img id="open" width="48px" height="48px" src="' +
            g +
            '" style="font-size:14px"/></div><td id="td2" width="151px">\u5728\u62fc\u591a\u591a\u627e\u5230 ' +
            c.total +
            ' \u4e2a\u5185\u90e8\u4f18\u60e0\u5546\u54c1</td><td id="td3" width="70px" align="center" style="background:rgba(250,73,0,1);"><a style="color:#fff;" target="_blank" href="' +
            c.url +
            "&keyword=" +
            encodeURI(a) +
            '">\u7acb\u5373\u67e5\u770b</a></td><td id="td4" height="48px" style="padding:0px;background:rgba(244,244,244,1);"><img id="close" width="48px" height="48px" src="' +
            k +
            '" /></td></tr></table>';
          l.innerHTML = f;
          document.body.append(l);
          $(b.root).on("click", "#close", function () {
            $("#td2", b.root).hide();
            $("#td3", b.root).hide();
            $("#td4", b.root).hide();
          });
          $(b.root).on("click", "#open", function () {
            $("#td2", b.root).show();
            $("#td3", b.root).show();
            $("#td4", b.root).show();
          });
          $("#td2,#products", b.root).mouseout(function (a) {
            $("#products", b.root).hide();
          });
        }
      },
    });
    $.extend(c, a);
    return c;
  }
  function r(a) {
    var c = v({
      type: "detail",
      keyTitle: ".tb-detail-hd h1",
      keyInjectPoint: "#J_RSPostageCont.tm-delivery-panel",
      keyPrice: ".tm-promo-price .tm-price",
      parsePage: function () {
        var a = $(this.keyTitle).text().trim(),
          c = window.location.search,
          b = "-1";
        if ("item.jd.com" != this.host) {
          try {
            b = c.split("&id=")[1].split("&")[0];
          } catch (m) {
            b = c.split("?id=")[1].split("&")[0];
          }
          var d =
            ".tb-rmb-num" == this.keyPrice
              ? 0 < $("#J_PromoPriceNum").length
                ? parseFloat($("#J_PromoPriceNum").text().split("-")[0].trim())
                : parseFloat($(this.keyPrice).text().split("-")[0].trim())
              : parseFloat($(this.keyPrice).text().trim());
        }
        return { id: b.trim(), title: a, price: d };
      },
      injectPage: function (a) {
        $(this.keyInjectPoint).after(a);
      },
    });
    $.extend(c, a);
    "item.jd.com" != c.host && (c.taobaoId = c.getTaobaoId());
    return c;
  }
  function y() {
    z("content.css", "css");
    "detail" == b.type
      ? chrome.extension.sendRequest({ type: "getCouponFrame" }, function (a) {
          a &&
            (b.injectPage(a),
            A(),
            "item.jd.com" == b.host
              ? w(
                  '<td colspan="4"><p style="border: 1px solid rgb(255, 64, 47);color:red;font-size:14px;line-height:30px;">\u9886\u53d6\u4eac\u4e1c\u5185\u90e8\u4f18\u60e0\u5238\uff0c\u4e0b\u5355\u540e\u8fd8\u6709\u8d2d\u7269\u8fd4\u73b0&nbsp;&nbsp;<a style="color:red;text-decoration:underline;" href="' +
                    (d.baseurl +
                      '/jd/help.html" target="_blank">\u70b9\u51fb\u8fd9\u91cc</a></p></td>')
                )
              : ((d.param = b.parsePage()),
                void 0 == d.param.price || "" == d.param.price
                  ? setTimeout(function () {
                      t(d.param);
                    }, 500)
                  : t(d.param)));
        })
      : "list" == b.type &&
        ((d.param = b.parsePage()),
        $("body").on("click", ".list_lingquan_js_" + d.index, function (a) {
          gotoURL = $(a.target).attr("data-couponUrl");
          u(gotoURL, "\u6dd8\u5b9d\u4f18\u60e0\u5238", "list_coupon", -1);
          a.stopPropagation();
        }),
        B(d.param));
  }
  function t(a) {
    chrome.extension.sendRequest(
      {
        type: "getCouponContent",
        param: a,
      },
      function (c) {
        c && w(c);
        C(a);
      }
    );
  }
  function C(a) {
    chrome.extension.sendRequest(
      { type: "getCouponRecommend", param: a },
      function (a) {
        a && $("#recommendContent", b.root).html(a);
      }
    );
  }
  function B(a) {
    chrome.extension.sendRequest(
      { type: "getCouponList", param: a },
      function (a) {
        a && (a.data || a.pdd) && b.injectPage(a.data, a.pdd);
      }
    );
  }
  function z(a, c) {
    if ("js" == c) {
      var b = document.createElement("script");
      b.setAttribute("type", "text/javascript");
      b.setAttribute("src", chrome.extension.getURL(a));
    } else "css" == c && ((b = document.createElement("link")), b.setAttribute("rel", "stylesheet"), b.setAttribute("type", "text/css"), b.setAttribute("href", chrome.extension.getURL(a)));
    "undefined" != typeof b &&
      document.getElementsByTagName("head")[0].appendChild(b);
  }
  function w(a) {
    $(".hh-data", b.root).remove();
    $("#hh-value", b.root).after(a);
    $("#hh-value", b.root).hide();
    0 < $("#recommend_link", b.root).length &&
      $("#recommend_link", b.root).click(function () {
        $("#recommendContent", b.root).show();
      });
    a = $(".qrcode_image", b.root).toArray();
    for (var c = 0; c < a.length; c++) {
      var d = a[c];
      new QRCode(d, { text: d.getAttribute("data"), width: 140, height: 140 });
    }
    $(".pdd_lingquan", b.root).mouseover(function (a) {
      $("#pdd_qrcode_" + a.target.getAttribute("data"), b.root).show();
    });
    $(".pdd_lingquan", b.root).mouseout(function (a) {
      $("#pdd_qrcode_" + a.target.getAttribute("data"), b.root).hide();
    });
    $(".pdd_text", b.root).mouseover(function (a) {
      $("#" + a.target.getAttribute("data")).show();
    });
    $(".pdd_text", b.root).mouseout(function (a) {
      $("#" + a.target.getAttribute("data")).hide();
    });
  }
  function u(a, b, g) {
    g = g + "_" + d.index;
    var c = "tips_" + g,
      h = ".tips_" + g;
    b =
      '<div class="' +
      c +
      ' tips"><span class="tips-1">\u5f53\u524d\u70b9\u51fb\u5c06\u8df3\u8f6c\u81f3' +
      b +
      '\u94fe\u63a5\uff0c\u6211\u4eec\u627f\u8bfa\u8be5\u8df3\u8f6c\u5bf9\u8d2d\u7269\u6ca1\u6709\u4efb\u4f55\u5f71\u54cd\u3002\u60a8\u662f\u5426\u540c\u610f\uff1f</span><span class="tips-2">\u540c\u610f\u8df3\u8f6c</span><span class="tips-3"><input id="coupon_unshow_' +
      g +
      '" name="unshow" type="checkbox" checked="checked" /><label>\u4e0b\u6b21\u4e0d\u8981\u63d0\u793a</label></span></div>';
    $("body").append(b);
    $("body").on("click", function () {
      $(h).remove();
    });
    x(c, function (b) {
      "unshow" == b
        ? ($(h).remove(), window.open(a))
        : (window.scrollTo(0, 260),
          $(h).show(),
          $(".tips-2", h).on("click", function () {
            $("#coupon_unshow_" + g).is(":checked") && p(c, "unshow");
            $(h).remove();
            window.open(a);
          }),
          $(h).on("click", function () {
            $(h).remove();
          }),
          $(h + " input").on("click", function () {
            event.stopPropagation();
          }));
    });
  }
  function D() {
    if (!(0 >= $(".tips_coupon_" + d.index).length)) {
      var a = $("#coupon_unshow_coupon_" + d.index).is(":checked")
        ? "unshow"
        : void 0;
      d.tips_coupon = a;
      p("tips_coupon", a, function (a) {});
      t(d.param);
    }
  }
  function A() {
    $(b.root).on("click", "#searchButton", function () {
      u(d.shop, "\u60e0\u6dd8\u4f18\u60e0", "ht");
      event.stopPropagation();
    });
    $("#recommendContent", b.root).mouseover(function () {
      $("#recommendContent", b.root).show();
    });
    $("#recommendContent", b.root).mouseleave(function () {
      $("#recommendContent", b.root).hide();
    });
    $("#recommendButton", b.root).mouseover(function (a) {
      $("#recommendContent", b.root).show();
      a.stopPropagation();
    });
    $("#recommendButton", b.root).mouseleave(function (a) {
      $("#recommendContent", b.root).hide();
    });
    $("#phoneButton", b.root).mouseover(function () {
      $("#weixinView", b.root).show();
    });
    $("#phoneButton", b.root).mouseleave(function () {
      $("#weixinView", b.root).hide();
    });
    $("body").on("click", ".lingquan_js_" + d.index, function (a) {
      b.checkLogin(d.param) &&
        ((gotoURL =
          d.baseurl +
          "/search/coupon.html?callbackUrl=" +
          encodeURIComponent(
            $(".lingquan_js_" + d.index).attr("data-couponUrl")
          ) +
          "&title=" +
          encodeURIComponent(
            $(".lingquan_js_" + d.index).attr("data-couponTitle")
          )),
        u(gotoURL, "\u6dd8\u5b9d\u4f18\u60e0\u5238", "coupon"),
        a.stopPropagation());
    });
    window.addEventListener(
      "message",
      function (a) {
        "ht.coupou.request" == a.data &&
          (D(), $(".tips_coupon_" + d.index).remove());
      },
      !1
    );
  }
  var d = { shop: "https://www.bntyh.com" },
    b = (function () {
      var a = window.location.host;
      if ("list.tmall.com" == a) var b = q({ host: a, keySearch: "#mq" });
      else if ("s.taobao.com" == a)
        b = q({
          host: a,
          keySearch: "#q",
          keyListIds: ".pic-link.J_ClickStat.J_ItemPicA",
          keyListIdAttr: "data-nid",
          keyList: ".J_PicBox",
        });
      else if ("item.taobao.com" == a)
        b = r({
          host: a,
          keyTitle: ".tb-main-title",
          keyInjectPoint: "#J_logistic",
          keyPrice: ".tb-rmb-num",
        });
      else if (
        "detail.tmall.com" == a ||
        "chaoshi.detail.tmall.com" == a ||
        "detail.tmall.hk" == a ||
        "detail.liangxinyao.com" == a ||
        "detail.yao.95095.com" == a
      )
        b = r({ host: a, keyTitle: ".tb-detail-hd h1 " });
      else if ("item.jd.com" == a)
        b = r({
          host: a,
          keyTitle: ".sku-name",
          keyInjectPoint: "#summary-supply",
        });
      else if ("search.jd.com" == a) b = q({ host: a, keySearch: "#key" });
      else return b;
      b.host = a;
      return b;
    })();
  chrome.extension.sendRequest(
    {
      type: "init",
      userId: b.taobaoId,
    },
    function (a) {
      !a ||
        (a && "false" == a.coupon_enabled) ||
        ($.extend(d, a), (b.root = "#hh_widget_id_" + d.index), y());
    }
  );
});
