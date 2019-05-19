"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * Glide.js v3.3.0
 * (c) 2013-2019 Jędrzej Chałubek <jedrzej.chalubek@gmail.com> (http://jedrzejchalubek.com/)
 * Released under the MIT License.
 */
!function (t, e) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.Glide = e();
}(void 0, function () {
  "use strict";

  var i = {
    type: "slider",
    startAt: 0,
    perView: 1,
    focusAt: 0,
    gap: 10,
    autoplay: !1,
    hoverpause: !0,
    keyboard: !0,
    bound: !1,
    swipeThreshold: 80,
    dragThreshold: 120,
    perTouch: !1,
    touchRatio: .5,
    touchAngle: 45,
    animationDuration: 400,
    rewind: !0,
    rewindDuration: 800,
    animationTimingFunc: "cubic-bezier(.165, .840, .440, 1)",
    throttle: 10,
    direction: "ltr",
    peek: 0,
    breakpoints: {},
    classes: {
      direction: {
        ltr: "glide--ltr",
        rtl: "glide--rtl"
      },
      slider: "glide--slider",
      carousel: "glide--carousel",
      swipeable: "glide--swipeable",
      dragging: "glide--dragging",
      cloneSlide: "glide__slide--clone",
      activeNav: "glide__bullet--active",
      activeSlide: "glide__slide--active",
      disabledArrow: "glide__arrow--disabled"
    }
  };

  var n = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
    return _typeof(t);
  } : function (t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
  },
      r = function r(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
  },
      o = function () {
    function i(t, e) {
      for (var n = 0; n < e.length; n++) {
        var i = e[n];
        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
      }
    }

    return function (t, e, n) {
      return e && i(t.prototype, e), n && i(t, n), t;
    };
  }(),
      a = Object.assign || function (t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];

      for (var i in n) {
        Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
      }
    }

    return t;
  },
      s = function s(t, e) {
    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !e || "object" != _typeof(e) && "function" != typeof e ? t : e;
  };

  function y(t) {
    return parseInt(t);
  }

  function u(t) {
    return "string" == typeof t;
  }

  function c(t) {
    var e = void 0 === t ? "undefined" : n(t);
    return "function" === e || "object" === e && !!t;
  }

  function l(t) {
    return "function" == typeof t;
  }

  function f(t) {
    return void 0 === t;
  }

  function d(t) {
    return t.constructor === Array;
  }

  function p(t, e, n) {
    Object.defineProperty(t, e, n);
  }

  function h(t, e) {
    var n = a({}, t, e);
    return e.hasOwnProperty("classes") && (n.classes = a({}, t.classes, e.classes), e.classes.hasOwnProperty("direction") && (n.classes.direction = a({}, t.classes.direction, e.classes.direction))), e.hasOwnProperty("breakpoints") && (n.breakpoints = a({}, t.breakpoints, e.breakpoints)), n;
  }

  var v = function () {
    function e() {
      var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
      r(this, e), this.events = t, this.hop = t.hasOwnProperty;
    }

    return o(e, [{
      key: "on",
      value: function value(t, e) {
        if (d(t)) for (var n = 0; n < t.length; n++) {
          this.on(t[n], e);
        }
        this.hop.call(this.events, t) || (this.events[t] = []);
        var i = this.events[t].push(e) - 1;
        return {
          remove: function remove() {
            delete this.events[t][i];
          }
        };
      }
    }, {
      key: "emit",
      value: function value(t, e) {
        if (d(t)) for (var n = 0; n < t.length; n++) {
          this.emit(t[n], e);
        }
        this.hop.call(this.events, t) && this.events[t].forEach(function (t) {
          t(e || {});
        });
      }
    }]), e;
  }(),
      m = function () {
    function n(t) {
      var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
      r(this, n), this._c = {}, this._t = [], this._e = new v(), this.disabled = !1, this.selector = t, this.settings = h(i, e), this.index = this.settings.startAt;
    }

    return o(n, [{
      key: "mount",
      value: function value() {
        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
        return this._e.emit("mount.before"), c(t) && (this._c = function (t, e, n) {
          var i = {};

          for (var r in e) {
            l(e[r]) && (i[r] = e[r](t, i, n));
          }

          for (var o in i) {
            l(i[o].mount) && i[o].mount();
          }

          return i;
        }(this, t, this._e)), this._e.emit("mount.after"), this;
      }
    }, {
      key: "mutate",
      value: function value() {
        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : [];
        return d(t) && (this._t = t), this;
      }
    }, {
      key: "update",
      value: function value() {
        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
        return this.settings = h(this.settings, t), t.hasOwnProperty("startAt") && (this.index = t.startAt), this._e.emit("update"), this;
      }
    }, {
      key: "go",
      value: function value(t) {
        return this._c.Run.make(t), this;
      }
    }, {
      key: "move",
      value: function value(t) {
        return this._c.Transition.disable(), this._c.Move.make(t), this;
      }
    }, {
      key: "destroy",
      value: function value() {
        return this._e.emit("destroy"), this;
      }
    }, {
      key: "play",
      value: function value() {
        var t = 0 < arguments.length && void 0 !== arguments[0] && arguments[0];
        return t && (this.settings.autoplay = t), this._e.emit("play"), this;
      }
    }, {
      key: "pause",
      value: function value() {
        return this._e.emit("pause"), this;
      }
    }, {
      key: "disable",
      value: function value() {
        return this.disabled = !0, this;
      }
    }, {
      key: "enable",
      value: function value() {
        return this.disabled = !1, this;
      }
    }, {
      key: "on",
      value: function value(t, e) {
        return this._e.on(t, e), this;
      }
    }, {
      key: "isType",
      value: function value(t) {
        return this.settings.type === t;
      }
    }, {
      key: "settings",
      get: function get() {
        return this._o;
      },
      set: function set(t) {
        c(t) && (this._o = t);
      }
    }, {
      key: "index",
      get: function get() {
        return this._i;
      },
      set: function set(t) {
        this._i = y(t);
      }
    }, {
      key: "type",
      get: function get() {
        return this.settings.type;
      }
    }, {
      key: "disabled",
      get: function get() {
        return this._d;
      },
      set: function set(t) {
        this._d = !!t;
      }
    }]), n;
  }();

  function g() {
    return new Date().getTime();
  }

  function b(n, i, r) {
    var o = void 0,
        s = void 0,
        u = void 0,
        a = void 0,
        c = 0;
    r || (r = {});

    var l = function l() {
      c = !1 === r.leading ? 0 : g(), o = null, a = n.apply(s, u), o || (s = u = null);
    },
        t = function t() {
      var t = g();
      c || !1 !== r.leading || (c = t);
      var e = i - (t - c);
      return s = this, u = arguments, e <= 0 || i < e ? (o && (clearTimeout(o), o = null), c = t, a = n.apply(s, u), o || (s = u = null)) : o || !1 === r.trailing || (o = setTimeout(l, e)), a;
    };

    return t.cancel = function () {
      clearTimeout(o), c = 0, o = s = u = null;
    }, t;
  }

  var w = {
    ltr: ["marginLeft", "marginRight"],
    rtl: ["marginRight", "marginLeft"]
  };

  function _(t) {
    if (t && t.parentNode) {
      for (var e = t.parentNode.firstChild, n = []; e; e = e.nextSibling) {
        1 === e.nodeType && e !== t && n.push(e);
      }

      return n;
    }

    return [];
  }

  function k(t) {
    return !!(t && t instanceof window.HTMLElement);
  }

  var S = '[data-glide-el="track"]';

  var H = function () {
    function e() {
      var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
      r(this, e), this.listeners = t;
    }

    return o(e, [{
      key: "on",
      value: function value(t, e, n) {
        var i = 3 < arguments.length && void 0 !== arguments[3] && arguments[3];
        u(t) && (t = [t]);

        for (var r = 0; r < t.length; r++) {
          this.listeners[t[r]] = n, e.addEventListener(t[r], this.listeners[t[r]], i);
        }
      }
    }, {
      key: "off",
      value: function value(t, e) {
        var n = 2 < arguments.length && void 0 !== arguments[2] && arguments[2];
        u(t) && (t = [t]);

        for (var i = 0; i < t.length; i++) {
          e.removeEventListener(t[i], this.listeners[t[i]], n);
        }
      }
    }, {
      key: "destroy",
      value: function value() {
        delete this.listeners;
      }
    }]), e;
  }();

  var T = ["ltr", "rtl"],
      x = {
    ">": "<",
    "<": ">",
    "=": "="
  };

  function t(t, e) {
    return {
      modify: function modify(t) {
        return e.Direction.is("rtl") ? -t : t;
      }
    };
  }

  function O(i, r, o) {
    var s = [function (e, n) {
      return {
        modify: function modify(t) {
          return t + n.Gaps.value * e.index;
        }
      };
    }, function (t, e) {
      return {
        modify: function modify(t) {
          return t + e.Clones.grow / 2;
        }
      };
    }, function (n, i) {
      return {
        modify: function modify(t) {
          if (0 <= n.settings.focusAt) {
            var e = i.Peek.value;
            return c(e) ? t - e.before : t - e;
          }

          return t;
        }
      };
    }, function (o, s) {
      return {
        modify: function modify(t) {
          var e = s.Gaps.value,
              n = s.Sizes.width,
              i = o.settings.focusAt,
              r = s.Sizes.slideWidth;
          return "center" === i ? t - (n / 2 - r / 2) : t - r * i - e * i;
        }
      };
    }].concat(i._t, [t]);
    return {
      mutate: function mutate(t) {
        for (var e = 0; e < s.length; e++) {
          var n = s[e];
          l(n) && l(n().modify) && (t = n(i, r, o).modify(t));
        }

        return t;
      }
    };
  }

  var e = !1;

  try {
    var A = Object.defineProperty({}, "passive", {
      get: function get() {
        e = !0;
      }
    });
    window.addEventListener("testPassive", null, A), window.removeEventListener("testPassive", null, A);
  } catch (t) {}

  var M = e,
      C = ["touchstart", "mousedown"],
      P = ["touchmove", "mousemove"],
      L = ["touchend", "touchcancel", "mouseup", "mouseleave"],
      z = ["mousedown", "mousemove", "mouseup", "mouseleave"];
  var j = '[data-glide-el="controls[nav]"]',
      D = '[data-glide-el^="controls"]';

  function E(t) {
    return c(t) ? (n = t, Object.keys(n).sort().reduce(function (t, e) {
      return t[e] = n[e], t[e], t;
    }, {})) : {};
    var n;
  }

  var R = {
    Html: function Html(e, t) {
      var n = {
        mount: function mount() {
          this.root = e.selector, this.track = this.root.querySelector(S), this.slides = Array.prototype.slice.call(this.wrapper.children).filter(function (t) {
            return !t.classList.contains(e.settings.classes.cloneSlide);
          });
        }
      };
      return p(n, "root", {
        get: function get() {
          return n._r;
        },
        set: function set(t) {
          u(t) && (t = document.querySelector(t)), k(t) && (n._r = t);
        }
      }), p(n, "track", {
        get: function get() {
          return n._t;
        },
        set: function set(t) {
          k(t) && (n._t = t);
        }
      }), p(n, "wrapper", {
        get: function get() {
          return n.track.children[0];
        }
      }), n;
    },
    Translate: function Translate(r, o, s) {
      var u = {
        set: function set(t) {
          var e = O(r, o).mutate(t);
          o.Html.wrapper.style.transform = "translate3d(" + -1 * e + "px, 0px, 0px)";
        },
        remove: function remove() {
          o.Html.wrapper.style.transform = "";
        }
      };
      return s.on("move", function (t) {
        var e = o.Gaps.value,
            n = o.Sizes.length,
            i = o.Sizes.slideWidth;
        return r.isType("carousel") && o.Run.isOffset("<") ? (o.Transition.after(function () {
          s.emit("translate.jump"), u.set(i * (n - 1));
        }), u.set(-i - e * n)) : r.isType("carousel") && o.Run.isOffset(">") ? (o.Transition.after(function () {
          s.emit("translate.jump"), u.set(0);
        }), u.set(i * n + e * n)) : u.set(t.movement);
      }), s.on("destroy", function () {
        u.remove();
      }), u;
    },
    Transition: function Transition(n, e, t) {
      var i = !1,
          r = {
        compose: function compose(t) {
          var e = n.settings;
          return i ? t + " 0ms " + e.animationTimingFunc : t + " " + this.duration + "ms " + e.animationTimingFunc;
        },
        set: function set() {
          var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "transform";
          e.Html.wrapper.style.transition = this.compose(t);
        },
        remove: function remove() {
          e.Html.wrapper.style.transition = "";
        },
        after: function after(t) {
          setTimeout(function () {
            t();
          }, this.duration);
        },
        enable: function enable() {
          i = !1, this.set();
        },
        disable: function disable() {
          i = !0, this.set();
        }
      };
      return p(r, "duration", {
        get: function get() {
          var t = n.settings;
          return n.isType("slider") && e.Run.offset ? t.rewindDuration : t.animationDuration;
        }
      }), t.on("move", function () {
        r.set();
      }), t.on(["build.before", "resize", "translate.jump"], function () {
        r.disable();
      }), t.on("run", function () {
        r.enable();
      }), t.on("destroy", function () {
        r.remove();
      }), r;
    },
    Direction: function Direction(t, e, n) {
      var i = {
        mount: function mount() {
          this.value = t.settings.direction;
        },
        resolve: function resolve(t) {
          var e = t.slice(0, 1);
          return this.is("rtl") ? t.split(e).join(x[e]) : t;
        },
        is: function is(t) {
          return this.value === t;
        },
        addClass: function addClass() {
          e.Html.root.classList.add(t.settings.classes.direction[this.value]);
        },
        removeClass: function removeClass() {
          e.Html.root.classList.remove(t.settings.classes.direction[this.value]);
        }
      };
      return p(i, "value", {
        get: function get() {
          return i._v;
        },
        set: function set(t) {
          -1 < T.indexOf(t) && (i._v = t);
        }
      }), n.on(["destroy", "update"], function () {
        i.removeClass();
      }), n.on("update", function () {
        i.mount();
      }), n.on(["build.before", "update"], function () {
        i.addClass();
      }), i;
    },
    Peek: function Peek(n, t, e) {
      var i = {
        mount: function mount() {
          this.value = n.settings.peek;
        }
      };
      return p(i, "value", {
        get: function get() {
          return i._v;
        },
        set: function set(t) {
          c(t) ? (t.before = y(t.before), t.after = y(t.after)) : t = y(t), i._v = t;
        }
      }), p(i, "reductor", {
        get: function get() {
          var t = i.value,
              e = n.settings.perView;
          return c(t) ? t.before / e + t.after / e : 2 * t / e;
        }
      }), e.on(["resize", "update"], function () {
        i.mount();
      }), i;
    },
    Sizes: function Sizes(t, i, e) {
      var n = {
        setupSlides: function setupSlides() {
          for (var t = this.slideWidth + "px", e = i.Html.slides, n = 0; n < e.length; n++) {
            e[n].style.width = t;
          }
        },
        setupWrapper: function setupWrapper(t) {
          i.Html.wrapper.style.width = this.wrapperSize + "px";
        },
        remove: function remove() {
          for (var t = i.Html.slides, e = 0; e < t.length; e++) {
            t[e].style.width = "";
          }

          i.Html.wrapper.style.width = "";
        }
      };
      return p(n, "length", {
        get: function get() {
          return i.Html.slides.length;
        }
      }), p(n, "width", {
        get: function get() {
          return i.Html.root.offsetWidth;
        }
      }), p(n, "wrapperSize", {
        get: function get() {
          return n.slideWidth * n.length + i.Gaps.grow + i.Clones.grow;
        }
      }), p(n, "slideWidth", {
        get: function get() {
          return n.width / t.settings.perView - i.Peek.reductor - i.Gaps.reductor;
        }
      }), e.on(["build.before", "resize", "update"], function () {
        n.setupSlides(), n.setupWrapper();
      }), e.on("destroy", function () {
        n.remove();
      }), n;
    },
    Gaps: function Gaps(e, o, t) {
      var n = {
        apply: function apply(t) {
          for (var e = 0, n = t.length; e < n; e++) {
            var i = t[e].style,
                r = o.Direction.value;
            i[w[r][0]] = 0 !== e ? this.value / 2 + "px" : "", e !== t.length - 1 ? i[w[r][1]] = this.value / 2 + "px" : i[w[r][1]] = "";
          }
        },
        remove: function remove(t) {
          for (var e = 0, n = t.length; e < n; e++) {
            var i = t[e].style;
            i.marginLeft = "", i.marginRight = "";
          }
        }
      };
      return p(n, "value", {
        get: function get() {
          return y(e.settings.gap);
        }
      }), p(n, "grow", {
        get: function get() {
          return n.value * (o.Sizes.length - 1);
        }
      }), p(n, "reductor", {
        get: function get() {
          var t = e.settings.perView;
          return n.value * (t - 1) / t;
        }
      }), t.on(["build.after", "update"], b(function () {
        n.apply(o.Html.wrapper.children);
      }, 30)), t.on("destroy", function () {
        n.remove(o.Html.wrapper.children);
      }), n;
    },
    Move: function Move(t, n, i) {
      var e = {
        mount: function mount() {
          this._o = 0;
        },
        make: function make() {
          var t = this,
              e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0;
          this.offset = e, i.emit("move", {
            movement: this.value
          }), n.Transition.after(function () {
            i.emit("move.after", {
              movement: t.value
            });
          });
        }
      };
      return p(e, "offset", {
        get: function get() {
          return e._o;
        },
        set: function set(t) {
          e._o = f(t) ? 0 : y(t);
        }
      }), p(e, "translate", {
        get: function get() {
          return n.Sizes.slideWidth * t.index;
        }
      }), p(e, "value", {
        get: function get() {
          var t = this.offset,
              e = this.translate;
          return n.Direction.is("rtl") ? e + t : e - t;
        }
      }), i.on(["build.before", "run"], function () {
        e.make();
      }), e;
    },
    Clones: function Clones(h, v, t) {
      var e = {
        mount: function mount() {
          this.items = [], h.isType("carousel") && (this.items = this.collect());
        },
        collect: function collect() {
          for (var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : [], e = v.Html.slides, n = h.settings, i = n.perView, r = n.classes, o = i + +!!h.settings.peek, s = e.slice(0, o), u = e.slice(-o), a = 0; a < Math.max(1, Math.floor(i / e.length)); a++) {
            for (var c = 0; c < s.length; c++) {
              var l = s[c].cloneNode(!0);
              l.classList.add(r.cloneSlide), t.push(l);
            }

            for (var f = 0; f < u.length; f++) {
              var d = u[f].cloneNode(!0);
              d.classList.add(r.cloneSlide), t.unshift(d);
            }
          }

          return t;
        },
        append: function append() {
          for (var t = this.items, e = v.Html, n = e.wrapper, i = e.slides, r = Math.floor(t.length / 2), o = t.slice(0, r).reverse(), s = t.slice(r, t.length), u = v.Sizes.slideWidth + "px", a = 0; a < s.length; a++) {
            n.appendChild(s[a]);
          }

          for (var c = 0; c < o.length; c++) {
            n.insertBefore(o[c], i[0]);
          }

          for (var l = 0; l < t.length; l++) {
            t[l].style.width = u;
          }
        },
        remove: function remove() {
          for (var t = this.items, e = 0; e < t.length; e++) {
            v.Html.wrapper.removeChild(t[e]);
          }
        }
      };
      return p(e, "grow", {
        get: function get() {
          return (v.Sizes.slideWidth + v.Gaps.value) * e.items.length;
        }
      }), t.on("update", function () {
        e.remove(), e.mount(), e.append();
      }), t.on("build.before", function () {
        h.isType("carousel") && e.append();
      }), t.on("destroy", function () {
        e.remove();
      }), e;
    },
    Resize: function Resize(t, e, n) {
      var i = new H(),
          r = {
        mount: function mount() {
          this.bind();
        },
        bind: function bind() {
          i.on("resize", window, b(function () {
            n.emit("resize");
          }, t.settings.throttle));
        },
        unbind: function unbind() {
          i.off("resize", window);
        }
      };
      return n.on("destroy", function () {
        r.unbind(), i.destroy();
      }), r;
    },
    Build: function Build(n, i, t) {
      var e = {
        mount: function mount() {
          t.emit("build.before"), this.typeClass(), this.activeClass(), t.emit("build.after");
        },
        typeClass: function typeClass() {
          i.Html.root.classList.add(n.settings.classes[n.settings.type]);
        },
        activeClass: function activeClass() {
          var e = n.settings.classes,
              t = i.Html.slides[n.index];
          t && (t.classList.add(e.activeSlide), _(t).forEach(function (t) {
            t.classList.remove(e.activeSlide);
          }));
        },
        removeClasses: function removeClasses() {
          var e = n.settings.classes;
          i.Html.root.classList.remove(e[n.settings.type]), i.Html.slides.forEach(function (t) {
            t.classList.remove(e.activeSlide);
          });
        }
      };
      return t.on(["destroy", "update"], function () {
        e.removeClasses();
      }), t.on(["resize", "update"], function () {
        e.mount();
      }), t.on("move.after", function () {
        e.activeClass();
      }), e;
    },
    Run: function Run(o, n, i) {
      var t = {
        mount: function mount() {
          this._o = !1;
        },
        make: function make(t) {
          var e = this;
          o.disabled || (o.disable(), this.move = t, i.emit("run.before", this.move), this.calculate(), i.emit("run", this.move), n.Transition.after(function () {
            e.isStart() && i.emit("run.start", e.move), e.isEnd() && i.emit("run.end", e.move), (e.isOffset("<") || e.isOffset(">")) && (e._o = !1, i.emit("run.offset", e.move)), i.emit("run.after", e.move), o.enable();
          }));
        },
        calculate: function calculate() {
          var t = this.move,
              e = this.length,
              n = t.steps,
              i = t.direction,
              r = "number" == typeof y(n) && 0 !== y(n);

          switch (i) {
            case ">":
              ">" === n ? o.index = e : this.isEnd() ? o.isType("slider") && !o.settings.rewind || (this._o = !0, o.index = 0) : r ? o.index += Math.min(e - o.index, -y(n)) : o.index++;
              break;

            case "<":
              "<" === n ? o.index = 0 : this.isStart() ? o.isType("slider") && !o.settings.rewind || (this._o = !0, o.index = e) : r ? o.index -= Math.min(o.index, y(n)) : o.index--;
              break;

            case "=":
              o.index = n;
          }
        },
        isStart: function isStart() {
          return 0 === o.index;
        },
        isEnd: function isEnd() {
          return o.index === this.length;
        },
        isOffset: function isOffset(t) {
          return this._o && this.move.direction === t;
        }
      };
      return p(t, "move", {
        get: function get() {
          return this._m;
        },
        set: function set(t) {
          var e = t.substr(1);
          this._m = {
            direction: t.substr(0, 1),
            steps: e ? y(e) ? y(e) : e : 0
          };
        }
      }), p(t, "length", {
        get: function get() {
          var t = o.settings,
              e = n.Html.slides.length;
          return o.isType("slider") && "center" !== t.focusAt && t.bound ? e - 1 - (y(t.perView) - 1) + y(t.focusAt) : e - 1;
        }
      }), p(t, "offset", {
        get: function get() {
          return this._o;
        }
      }), t;
    },
    Swipe: function Swipe(d, h, v) {
      var n = new H(),
          p = 0,
          m = 0,
          g = 0,
          i = !1,
          r = !!M && {
        passive: !0
      },
          t = {
        mount: function mount() {
          this.bindSwipeStart();
        },
        start: function start(t) {
          if (!i && !d.disabled) {
            this.disable();
            var e = this.touches(t);
            p = null, m = y(e.pageX), g = y(e.pageY), this.bindSwipeMove(), this.bindSwipeEnd(), v.emit("swipe.start");
          }
        },
        move: function move(t) {
          if (!d.disabled) {
            var e = d.settings,
                n = e.touchAngle,
                i = e.touchRatio,
                r = e.classes,
                o = this.touches(t),
                s = y(o.pageX) - m,
                u = y(o.pageY) - g,
                a = Math.abs(s << 2),
                c = Math.abs(u << 2),
                l = Math.sqrt(a + c),
                f = Math.sqrt(c);
            if (!(180 * (p = Math.asin(f / l)) / Math.PI < n)) return !1;
            t.stopPropagation(), h.Move.make(s * parseFloat(i)), h.Html.root.classList.add(r.dragging), v.emit("swipe.move");
          }
        },
        end: function end(t) {
          if (!d.disabled) {
            var e = d.settings,
                n = this.touches(t),
                i = this.threshold(t),
                r = n.pageX - m,
                o = 180 * p / Math.PI,
                s = Math.round(r / h.Sizes.slideWidth);
            this.enable(), i < r && o < e.touchAngle ? (e.perTouch && (s = Math.min(s, y(e.perTouch))), h.Direction.is("rtl") && (s = -s), h.Run.make(h.Direction.resolve("<" + s))) : r < -i && o < e.touchAngle ? (e.perTouch && (s = Math.max(s, -y(e.perTouch))), h.Direction.is("rtl") && (s = -s), h.Run.make(h.Direction.resolve(">" + s))) : h.Move.make(), h.Html.root.classList.remove(e.classes.dragging), this.unbindSwipeMove(), this.unbindSwipeEnd(), v.emit("swipe.end");
          }
        },
        bindSwipeStart: function bindSwipeStart() {
          var e = this,
              t = d.settings;
          t.swipeThreshold && n.on(C[0], h.Html.wrapper, function (t) {
            e.start(t);
          }, r), t.dragThreshold && n.on(C[1], h.Html.wrapper, function (t) {
            e.start(t);
          }, r);
        },
        unbindSwipeStart: function unbindSwipeStart() {
          n.off(C[0], h.Html.wrapper, r), n.off(C[1], h.Html.wrapper, r);
        },
        bindSwipeMove: function bindSwipeMove() {
          var e = this;
          n.on(P, h.Html.wrapper, b(function (t) {
            e.move(t);
          }, d.settings.throttle), r);
        },
        unbindSwipeMove: function unbindSwipeMove() {
          n.off(P, h.Html.wrapper, r);
        },
        bindSwipeEnd: function bindSwipeEnd() {
          var e = this;
          n.on(L, h.Html.wrapper, function (t) {
            e.end(t);
          });
        },
        unbindSwipeEnd: function unbindSwipeEnd() {
          n.off(L, h.Html.wrapper);
        },
        touches: function touches(t) {
          return -1 < z.indexOf(t.type) ? t : t.touches[0] || t.changedTouches[0];
        },
        threshold: function threshold(t) {
          var e = d.settings;
          return -1 < z.indexOf(t.type) ? e.dragThreshold : e.swipeThreshold;
        },
        enable: function enable() {
          return i = !1, h.Transition.enable(), this;
        },
        disable: function disable() {
          return i = !0, h.Transition.disable(), this;
        }
      };
      return v.on("build.after", function () {
        h.Html.root.classList.add(d.settings.classes.swipeable);
      }), v.on("destroy", function () {
        t.unbindSwipeStart(), t.unbindSwipeMove(), t.unbindSwipeEnd(), n.destroy();
      }), t;
    },
    Images: function Images(t, e, n) {
      var i = new H(),
          r = {
        mount: function mount() {
          this.bind();
        },
        bind: function bind() {
          i.on("dragstart", e.Html.wrapper, this.dragstart);
        },
        unbind: function unbind() {
          i.off("dragstart", e.Html.wrapper);
        },
        dragstart: function dragstart(t) {
          t.preventDefault();
        }
      };
      return n.on("destroy", function () {
        r.unbind(), i.destroy();
      }), r;
    },
    Anchors: function Anchors(t, e, n) {
      var i = new H(),
          r = !1,
          o = !1,
          s = {
        mount: function mount() {
          this._a = e.Html.wrapper.querySelectorAll("a"), this.bind();
        },
        bind: function bind() {
          i.on("click", e.Html.wrapper, this.click);
        },
        unbind: function unbind() {
          i.off("click", e.Html.wrapper);
        },
        click: function click(t) {
          o && (t.stopPropagation(), t.preventDefault());
        },
        detach: function detach() {
          if (o = !0, !r) {
            for (var t = 0; t < this.items.length; t++) {
              this.items[t].draggable = !1, this.items[t].setAttribute("data-href", this.items[t].getAttribute("href")), this.items[t].removeAttribute("href");
            }

            r = !0;
          }

          return this;
        },
        attach: function attach() {
          if (o = !1, r) {
            for (var t = 0; t < this.items.length; t++) {
              this.items[t].draggable = !0, this.items[t].setAttribute("href", this.items[t].getAttribute("data-href"));
            }

            r = !1;
          }

          return this;
        }
      };
      return p(s, "items", {
        get: function get() {
          return s._a;
        }
      }), n.on("swipe.move", function () {
        s.detach();
      }), n.on("swipe.end", function () {
        e.Transition.after(function () {
          s.attach();
        });
      }), n.on("destroy", function () {
        s.attach(), s.unbind(), i.destroy();
      }), s;
    },
    Controls: function Controls(i, e, t) {
      var n = new H(),
          r = !!M && {
        passive: !0
      },
          o = {
        mount: function mount() {
          this._n = e.Html.root.querySelectorAll(j), this._c = e.Html.root.querySelectorAll(D), this.addBindings();
        },
        setActive: function setActive() {
          for (var t = 0; t < this._n.length; t++) {
            this.addClass(this._n[t].children);
          }
        },
        removeActive: function removeActive() {
          for (var t = 0; t < this._n.length; t++) {
            this.removeClass(this._n[t].children);
          }
        },
        addClass: function addClass(t) {
          var e = i.settings,
              n = t[i.index];
          n && (n.classList.add(e.classes.activeNav), _(n).forEach(function (t) {
            t.classList.remove(e.classes.activeNav);
          }));
        },
        removeClass: function removeClass(t) {
          var e = t[i.index];
          e && e.classList.remove(i.settings.classes.activeNav);
        },
        addBindings: function addBindings() {
          for (var t = 0; t < this._c.length; t++) {
            this.bind(this._c[t].children);
          }
        },
        removeBindings: function removeBindings() {
          for (var t = 0; t < this._c.length; t++) {
            this.unbind(this._c[t].children);
          }
        },
        bind: function bind(t) {
          for (var e = 0; e < t.length; e++) {
            n.on("click", t[e], this.click), n.on("touchstart", t[e], this.click, r);
          }
        },
        unbind: function unbind(t) {
          for (var e = 0; e < t.length; e++) {
            n.off(["click", "touchstart"], t[e]);
          }
        },
        click: function click(t) {
          t.preventDefault(), e.Run.make(e.Direction.resolve(t.currentTarget.getAttribute("data-glide-dir")));
        }
      };
      return p(o, "items", {
        get: function get() {
          return o._c;
        }
      }), t.on(["mount.after", "move.after"], function () {
        o.setActive();
      }), t.on("destroy", function () {
        o.removeBindings(), o.removeActive(), n.destroy();
      }), o;
    },
    Keyboard: function Keyboard(t, e, n) {
      var i = new H(),
          r = {
        mount: function mount() {
          t.settings.keyboard && this.bind();
        },
        bind: function bind() {
          i.on("keyup", document, this.press);
        },
        unbind: function unbind() {
          i.off("keyup", document);
        },
        press: function press(t) {
          39 === t.keyCode && e.Run.make(e.Direction.resolve(">")), 37 === t.keyCode && e.Run.make(e.Direction.resolve("<"));
        }
      };
      return n.on(["destroy", "update"], function () {
        r.unbind();
      }), n.on("update", function () {
        r.mount();
      }), n.on("destroy", function () {
        i.destroy();
      }), r;
    },
    Autoplay: function Autoplay(e, n, t) {
      var i = new H(),
          r = {
        mount: function mount() {
          this.start(), e.settings.hoverpause && this.bind();
        },
        start: function start() {
          var t = this;
          e.settings.autoplay && f(this._i) && (this._i = setInterval(function () {
            t.stop(), n.Run.make(">"), t.start();
          }, this.time));
        },
        stop: function stop() {
          this._i = clearInterval(this._i);
        },
        bind: function bind() {
          var t = this;
          i.on("mouseover", n.Html.root, function () {
            t.stop();
          }), i.on("mouseout", n.Html.root, function () {
            t.start();
          });
        },
        unbind: function unbind() {
          i.off(["mouseover", "mouseout"], n.Html.root);
        }
      };
      return p(r, "time", {
        get: function get() {
          var t = n.Html.slides[e.index].getAttribute("data-glide-autoplay");
          return y(t || e.settings.autoplay);
        }
      }), t.on(["destroy", "update"], function () {
        r.unbind();
      }), t.on(["run.before", "pause", "destroy", "swipe.start", "update"], function () {
        r.stop();
      }), t.on(["run.after", "play", "swipe.end"], function () {
        r.start();
      }), t.on("update", function () {
        r.mount();
      }), t.on("destroy", function () {
        i.destroy();
      }), r;
    },
    Breakpoints: function Breakpoints(t, e, n) {
      var i = new H(),
          r = t.settings,
          o = E(r.breakpoints),
          s = a({}, r),
          u = {
        match: function match(t) {
          if (void 0 !== window.matchMedia) for (var e in t) {
            if (t.hasOwnProperty(e) && window.matchMedia("(max-width: " + e + "px)").matches) return t[e];
          }
          return s;
        }
      };
      return a(r, u.match(o)), i.on("resize", window, b(function () {
        t.settings = h(r, u.match(o));
      }, t.settings.throttle)), n.on("update", function () {
        o = E(o), s = a({}, r);
      }), n.on("destroy", function () {
        i.off("resize", window);
      }), u;
    }
  };
  return function (t) {
    function e() {
      return r(this, e), s(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
    }

    return function (t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + _typeof(e));
      t.prototype = Object.create(e && e.prototype, {
        constructor: {
          value: t,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }(e, m), o(e, [{
      key: "mount",
      value: function value() {
        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
        return function t(e, n, i) {
          null === e && (e = Function.prototype);
          var r = Object.getOwnPropertyDescriptor(e, n);

          if (void 0 === r) {
            var o = Object.getPrototypeOf(e);
            return null === o ? void 0 : t(o, n, i);
          }

          if ("value" in r) return r.value;
          var s = r.get;
          return void 0 !== s ? s.call(i) : void 0;
        }(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "mount", this).call(this, a({}, R, t));
      }
    }]), e;
  }();
});