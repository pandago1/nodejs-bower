(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['jquery', 'underscore', 'backbone', 'doT', 'models/logoff', 'models/cancelbetting', 'models/appendlotterybetting', 'models/changepwd', 'models/getMemberInfoByNameNew', 'models/gethavesigninfo', 'models/acceptornocontract', 'models/getJsamount', 'models/getSubBondLstByPeriod', 'models/balance', 'models/gaveOutBonus', 'models/getUpBonus', 'models/membertalkSend', 'models/membertalkMessages', 'models/membertalkRead', 'models/membertalkContacts', 'models/membertalkOnline', 'models/betcontent', 'models/systemmessages', 'collections/getSubBondLstByPeriod', 'collections/membertalkContacts', 'text!../../templates/_footer.tpl', 'text!../../templates/_fixedToolbar.tpl', 'text!../../templates/_modal.tpl', 'text!../../templates/modal_gameInfo.tpl', 'text!../../templates/modal_trackInfo.tpl', 'text!../../templates/modal_trackInfo_tzList.tpl', 'text!../../templates/_404.tpl', 'text!../../templates/_timeout.tpl', 'text!../../templates/_pageLoading.tpl', 'text!../../templates/_contentLoading.tpl', 'text!../../templates/subsets/userCenter_security_alert.tpl', 'text!../../templates/getDayMoney.tpl', 'text!../../templates/subsets/userCenter_contract_alert.tpl', 'text!../../templates/modal_conversation.tpl', 'text!../../templates/demoAlert.tpl', 'text!../../templates/modal_sendMsg.tpl', 'qrcode', 'views/_navbar'], function($, _, Backbone, doT, ModelLogOff, ModelCancelOrder, ModelAppendLotteryBetting, ModelChangepwd, ModelGetMemberiInfoByNameNew, ModelGethavesigninfo, ModelAcceptornocontract, ModelGetJsamount, ModelGetSubBondLstByPeriod, ModelBalance, ModelGaveOutBonus, ModelGetUpBonus, ModelMembertalkSend, ModelMembertalkMsgs, ModelMembertalkRead, ModelMembertalkContacts, ModelMembertalkOnline, ModelBetContent, Modelsystemmessages, CollectionGetSubBondLstByPeriod, CollectionsMembertalkContacts, TplFooter, TplFixedToolbar, TplModal, TplModalGameInfo, TplModalTrackInfo, TplModalTzList, Tpl404, TplTimeout, TplLoading, TplDotsLoading, TplUserCenter_Security_alert, TplGetDayMoney, TplContractAlert, TplConversation, TplDemoAlert, TplSendMsg) {
    "use strict";
    var View, WS;
    View = (function(superClass) {
      extend(View, superClass);

      function View() {
        this.showTimeout = bind(this.showTimeout, this);
        this.show404 = bind(this.show404, this);
        this.removeErrorPage = bind(this.removeErrorPage, this);
        this.showLoading = bind(this.showLoading, this);
        return View.__super__.constructor.apply(this, arguments);
      }

      View.prototype.tpls = {
        modal: doT.template(TplModal),
        footer: doT.template(TplFooter),
        modalGameInfo: doT.template(TplModalGameInfo),
        modalTrackInfo: doT.template(TplModalTrackInfo),
        modalTzList: doT.template(TplModalTzList),
        userCenterSecurityAlert: doT.template(TplUserCenter_Security_alert),
        getDayMoney: doT.template(TplGetDayMoney),
        contractAlert: doT.template(TplContractAlert),
        mConversation: doT.template(TplConversation),
        sendMsg: doT.template(TplSendMsg),
        demoAlert: doT.template(TplDemoAlert)
      };

      View.prototype.events = {
        'click .result [data-type="close"]': 'eventCloseResult',
        'click .toTop': 'eventToTop',
        'focus .paginate input': 'eventFocusPaginate',
        'keydown .paginate input': 'eventKeydownPaginate',
        'change .paginate input': 'eventChangePaginate',
        'click .filterInput': 'eventClickFilterInput',
        'keyup .filterInput input': 'eventKeyupFilterInput',
        'click a': 'eventAFilter'
      };

      View.prototype.initialize = function() {
        CSH.audios.winning = new CSH.utils.Audio('/audios/winning.mp3');
        CSH.audios.gotMsg = new CSH.utils.Audio('/audios/gotMsg.mp3');
        this.setIco();
        this.data = {};
        this.data.myId = +localStorage.getItem('userID');
        this.cChatlist = new CollectionsMembertalkContacts();
        this.initWS();
        this.render();
        this.initWindowScroll();
        this.getSalaryState();
        CSH.$els.balance = {};
        CSH.$els.balance.navbar = this.$el.find('.navbar .realTimeBalance');
		
        return this.refreshBalance();
      };

      View.prototype.setIco = function() {
        return CSH.$els.head.append("<link rel=\"shortcut icon\" href=\"images/x-" + CSH.fix + ".ico?_=1\" type=\"image/x-icon\" />");
      };

      View.prototype.fetchMembertalkContactsAsync = function(isAsync) {
		consol.log(1);
        if (isAsync == null) {
          isAsync = true;
        }
        return new ModelMembertalkContacts().setUrl().save({}, {
          async: isAsync,
          dataFilter: (function(_this) {
            return function(data) {
              var pId, pName, pm;
              data = data.toJSON();
              if (data.code !== 0) {
                return;
              }
              _this.data.hasFetchChatlist = true;
              _this.data.cleanChatList = data.data;
              pId = +localStorage.getItem('parentId');
              pName = localStorage.getItem('parentName');
              if (pId) {
                pm = {
                  userID: pId,
                  userName: pName
                };
                _this.data.cleanChatList.unshift(pm);
              }
              return _this.cChatlist.reset(_this.data.cleanChatList);
            };
          })(this)
        });
      };

      View.prototype.initNotice = function() {
        var msg;
        msg = localStorage.getItem('notice');
        if (!msg) {
          return false;
        }
        this.showImpMsg(msg.toJSON());
        localStorage.removeItem('notice');
        return true;
      };

      View.prototype.render = function() {
        var $TplFixedToolbar;
        CSH.$els.footer.html(this.tpls.footer());
        $TplFixedToolbar = $(TplFixedToolbar);
        if (+localStorage.getItem('isNormalUser') === 2 && +localStorage.getItem('userType') === 2) {
          $TplFixedToolbar.find(' a[target="service"]').css('display', 'none');
        }
        CSH.$els.body.append($TplFixedToolbar);
        this.els = {};
        this.els.fixedToolbar = CSH.$els.fixedToolbar = this.$el.find('> .fixedToolbar');
        this.els.toTop = this.els.fixedToolbar.find('.toTop');
        setTimeout(((function(_this) {
          return function() {
            return _this.els.fixedToolbar.addClass('enabled');
          };
        })(this)), 200);
        setTimeout((function(_this) {
          return function() {
            if (+localStorage.getItem('demo')) {
              return _this.demoAlert();
            }
            if (+localStorage.getItem('isInitPwd')) {
              _this.modifyInitPwd();
              return;
            }
            if (_this.initNotice()) {
              return;
            }
            _this.settlementContract();
            _this.getContract();
            return _this.appDownloadAlert();
          };
        })(this), 200);
        return this.generateQRCode();
      };

      View.prototype.getSalaryState = function() {
        var name;
        name = localStorage.getItem('username');
        return new ModelGetMemberiInfoByNameNew().setUrl(name).fetch({
          dataFilter: function(data) {
            var total;
            data = data.toJSON();
            if (data.code === 0) {
              localStorage.setItem('salaryState', data.data.salaryState);
              total = data.data.salarylist;
              localStorage.setItem('salary', total.length ? total[total.length - 1].ratio : 0);
            }
            return '{}';
          }
        });
      };

      View.prototype.demoAlert = function() {
        localStorage.removeItem('demo');
        return CSH.alert({
          content: this.tpls.demoAlert(),
          className: 'demoAlert',
          ok: {
            text: '马上试玩',
            callback: (function(_this) {
              return function() {
                return _this.getContract();
              };
            })(this)
          }
        });
      };

      View.prototype.initWindowScroll = function() {
        var body, menu, toTop, w;
        w = CSH.$els.window;
        body = CSH.$els.body;
        menu = CSH.$els.menu;
        toTop = this.els.toTop;
        w.on('scroll', function() {
          var isFixed;
          isFixed = menu.hasClass('fixed');
          if (w.scrollTop() > 130) {
            if (isFixed) {
              return;
            }
            menu.addClass('no-transition fixed');
            toTop.addClass('enabled');
            return setTimeout((function() {
              return menu.removeClass('no-transition');
            }), 200);
          } else {
            if (!isFixed) {
              return;
            }
            menu.addClass('no-transition').removeClass('fixed');
            toTop.removeClass('enabled');
            return setTimeout((function() {
              return menu.removeClass('no-transition');
            }), 200);
          }
        });
      };

      View.prototype.getContract = function() {
        return new ModelGethavesigninfo().setUrl().fetch({
          dataFilter: (function(_this) {
            return function(data) {
              var alertContract, iNew, iNow, id, t, time;
              data = data.toJSON();
              if (!data.data) {
                return '{}';
              }
              iNow = new Date();
              iNew = new Date(data.data.add_Time).getTime() + 604800 * 1000;
              t = Math.floor((iNew - iNow) / 1000);
              time = (Math.floor(t / 86400)) + "天" + (Math.floor(t % 86400 / 3600)) + "时" + (Math.floor(t % 86400 % 3600 / 60)) + "分";
              id = data.data.id;
              if (+data.data.state === 0) {
                CSH.alert({
                  title: ' ',
                  content: _this.tpls.contractAlert({
                    name: 'getContract',
                    time: time
                  }),
                  className: 'getContract',
                  ok: {
                    text: '打开此契约',
                    callback: function() {
                      return alertContract();
                    }
                  }
                });
              }
              if (+data.data.state === 4) {
                CSH.alert({
                  title: ' ',
                  content: _this.tpls.contractAlert({
                    name: 'change',
                    time: time
                  }),
                  className: 'change',
                  ok: {
                    text: '打开此契约',
                    callback: function() {
                      return alertContract();
                    }
                  }
                });
              }
              alertContract = function() {
                var els, look, modalBox;
                modalBox = CSH.alert({
                  title: '契约分红',
                  content: _this.tpls.contractAlert({
                    name: 'getContractText'
                  }),
                  className: 'getContractText publicRed',
                  ok: {
                    text: '我已阅读完毕，下一步（5）',
                    callback: function() {
                      var els, scrollHeight, signaContract;
                      modalBox = CSH.confirm({
                        title: '契约分红',
                        content: _this.tpls.contractAlert({
                          data: data.data,
                          name: 'getDetailed'
                        }),
                        className: 'getDetailed publicRed',
                        cancel: {
                          text: '拒绝签订',
                          callback: function() {
                            var els;
                            modalBox = CSH.alert({
                              title: '拒绝原因',
                              content: _this.tpls.contractAlert({
                                name: 'refuse'
                              }),
                              className: 'refuse publicRed',
                              ok: {
                                text: '确定',
                                autohide: false,
                                callback: function(event) {
                                  var el, leaveMsg;
                                  el = $(event.currentTarget);
                                  el.attr('disabled', false);
                                  leaveMsg = [];
                                  els.checked.each(function(index, event) {
                                    var val;
                                    el = $(event);
                                    if (el.prop('checked')) {
                                      if (index === els.checked.length - 1) {
                                        val = el.closest('label').find(' > input').val();
                                        if (!val) {
                                          return;
                                        }
                                        leaveMsg.push(el.closest('label').find(' > input').val());
                                        return;
                                      }
                                      return leaveMsg.push(el.closest('label').text());
                                    }
                                  });
                                  data.reject_Remark = leaveMsg.toString();
                                  data.state = 2;
                                  return signaContract.setUrl().save(data, {
                                    dataFilter: function(data) {
                                      data = data.toJSON();
                                      CSH.hint(data.message);
                                      modalBox.modal('hide');
                                      return location.href = location.origin + "/userCenter.html#contract";
                                    }
                                  });
                                }
                              }
                            });
                            els = {};
                            return els.checked = modalBox.find('button input');
                          }
                        },
                        ok: {
                          text: '同意签订',
                          autohide: false,
                          callback: function(event) {
                            var el;
                            el = $(event.currentTarget);
                            el.attr('disabled', true);
                            data.state = 1;
                            return signaContract.setUrl().save(data, {
                              dataFilter: function(data) {
                                data = data.toJSON();
                                return CSH.hint({
                                  msg: data.message,
                                  type: 'success',
                                  icon: 'icon icon-ok',
                                  callback: function() {
                                    modalBox.modal('hide');
                                    el.attr('disabled', false);
                                    return location.href = location.origin + "/userCenter.html#contract";
                                  }
                                });
                              }
                            });
                          }
                        }
                      });
                      els = {};
                      els.footer = modalBox.find('.modal-footer');
                      els.ok = els.footer.find('.btn-primary');
                      els.$window = $(window);
                      els.modalBody = modalBox.find('.modal-body ul');
                      els.footer.prepend(els.ok);
                      signaContract = new ModelAcceptornocontract();
                      data = {};
                      data.contractid = id;
                      scrollHeight = function() {
                        var modalBodyH, windowH;
                        windowH = els.$window.height() * 0.9;
                        modalBodyH = els.modalBody.height();
                        if (windowH - 278 < modalBodyH || modalBodyH < 520) {
                          windowH = windowH - 278 > 520 ? 520 : windowH - 278;
                          return els.modalBody.css({
                            height: windowH,
                            overflow: 'auto'
                          });
                        }
                      };
                      scrollHeight();
                      return els.$window.on('resize', scrollHeight);
                    }
                  }
                });
                els = {};
                els.btn = modalBox.find('.modal-footer button');
                els.btn.prop('disabled', true);
                time = 5;
                look = function() {
                  return setTimeout(function() {
                    time--;
                    if (time === 0) {
                      els.btn.prop('disabled', false);
                      els.btn.text("我已阅读完毕，下一步");
                      return;
                    }
                    els.btn.text("我已阅读完毕，下一步（" + time + "）");
                    return look();
                  }, 1000);
                };
                look();
                return '{}';
              };
              return '{}';
            };
          })(this)
        });
      };

      View.prototype.settlementContract = function() {
        return new ModelGetJsamount().setUrl().fetch({
          dataFilter: (function(_this) {
            return function(data) {
              var aBonus, els, modalBox, state, totalBonus, totalMoney;
              data = data.toJSON();
              if (+data.code !== 0) {
                return '{}';
              }
              state = data.data.state;
              totalMoney = data.data.gaveOutBonusTotal > 0;
              totalBonus = +data.data.totalBonus;
              aBonus = !(state === 5) || !totalBonus;
              if (!totalMoney && aBonus) {
                return;
              }
              modalBox = CSH.confirm({
                title: '契约分红',
                content: _this.tpls.contractAlert({
                  data: data.data,
                  name: 'settlementAlert'
                }),
                className: 'settlementAlert publicRed',
                ok: {
                  text: '发放分红',
                  autohide: false,
                  callback: function() {}
                },
                cancel: {
                  text: '未达标',
                  callback: function() {}
                }
              });
              els = {};
              els.footer = modalBox.find('.modal-footer');
              els.btnOk = els.footer.find('button[btn-type="ok"]');
              els.btnCancel = els.footer.find('button[btn-type="cancel"]');
              els.footer.prepend(els.btnOk);
              switch (state) {
                case 1:
                  els.btnCancel.addClass('btnGrey').text('上级未发放');
                  break;
                case 2:
                  els.btnCancel.addClass('btnGrey').text('已领取');
                  break;
                case 3:
                  els.btnCancel.addClass('btnGrey').text('未达标');
                  break;
                case 4:
                  els.btnCancel.addClass('btnGrey').text('未结算');
              }
              if (totalMoney) {
                els.btnOk.removeClass('btnGrey').addClass('btnOrange').on('click', function(event) {
                  var el, nowMoney, parameter;
                  el = $(event.currentTarget);
                  el.attr('disabled', true);
                  parameter = {};
                  parameter.periodName = data.data.periodName;
                  parameter.state = 1;
                  nowMoney = data.data.gaveOutBonusTotal;
                  return new ModelGetSubBondLstByPeriod().setUrl("99999/1").save(parameter, {
                    dataFilter: function(data) {
                      var C;
                      data = data.toJSON();
                      C = new CollectionGetSubBondLstByPeriod().reset(data);
                      data = C.toJSON();
                      if (+data.data.length) {
                        _this.bounsList(data, parameter.periodName, nowMoney, el);
                      } else {
                        CSH.hint('暂时没有用户达标');
                      }
                      return el.attr('disabled', false);
                    }
                  });
                });
              } else {
                els.btnOk.text('已发放').removeClass('btn-primary"').addClass('btnGrey').attr('disabled', true);
              }
              if (state === 5 && totalBonus) {
                return els.btnCancel.addClass('btnRed').text('领取分红').on('click', function(event) {
                  return new ModelGetUpBonus().setUrl(data.data.periodName).fetch({
                    dataFilter: function(data) {
                      data = data.toJSON();
                      if (data.code === 0) {
                        return CSH.hint({
                          msg: '领取成功',
                          type: 'success',
                          icon: 'icon icon-ok'
                        });
                      }
                    }
                  });
                });
              }
            };
          })(this)
        });
      };

      View.prototype.refreshBalance = function(event) {
        var el, pageName, visible;
        pageName = CSH.pageName;
        visible = +JSON.parse(localStorage.getItem('visibility-capital'));
        if (event) {
          el = $(event.currentTarget);
          if (pageName !== 'index') {
            el.find('i').addClass('icon-spin icon-fast');
          } else {
            el.prop('disabled', true);
            el.addClass('icon-spin icon-fast');
          }
        }
        return new ModelBalance().setUrl().fetch({
          dataFilter: (function(_this) {
            return function(data) {
              var balance, j, len1, money, money0, money1, obj, ref;
              balance = +data.toJSON().data;
              CSH.balance = balance.accurate(4);
              localStorage.setItem('balance', balance);
              money0 = balance;
              money1 = CSH.utils.formatMoney(money0);
              ref = _this.$el.find('.navbar .realTimeBalance');
              for (j = 0, len1 = ref.length; j < len1; j++) {
                obj = ref[j];
                obj = $(obj);
                money = +obj.attr('data-type') ? money1 : money0;
                money = money.accurate(4);
                obj.attr('data-value', money).text(visible ? '***' : money);
              }
              if (CSH.$els.balance[pageName]) {
                if (pageName === 'index') {
                  _this.indexRefreshBalance();
                } else {
                  money = +CSH.$els.balance[pageName].attr('data-type') ? money1 : money0;
                  CSH.$els.balance[pageName].text(visible ? '***' : money).attr('data-value', money);
                }
              }
              if (event) {
                if (pageName !== 'index') {
                  el.find('i').removeClass('icon-spin icon-fast');
                } else {
                  el.removeClass('icon-spin icon-fast');
                }
                return el.prop('disabled', false);
              }
            };
          })(this)
        });
      };

      View.prototype.indexRefreshBalance = function(balance) {
        var dEls, dQueue, decimal, el, els, i, invBool, j, k, l, len1, len2, len3, n, num, o, rEls, rStack, ref, results, round, temp;
        if (balance == null) {
          balance = CSH.balance;
        }
        els = CSH.$els.balance.index.find('.box span');
        rEls = els.filter('.round');
        dEls = els.filter('.decimal');
        temp = ("" + balance).split('.');
        round = temp[0].split('');
        decimal = temp[1] ? temp[1].split('') : '';
        invBool = +JSON.parse(localStorage.getItem('visibility-capital'));
        rStack = new Stack();
        for (j = 0, len1 = round.length; j < len1; j++) {
          n = round[j];
          rStack.push(n);
        }
        for (i = k = ref = rEls.length - 1; ref <= 0 ? k <= 0 : k >= 0; i = ref <= 0 ? ++k : --k) {
          el = $(rEls[i]);
          num = rStack.pop();
          if (num == null) {
            num = '';
          }
          el.attr({
            'data-value': num
          });
          el.html(invBool ? '*' : num);
        }
        dQueue = new Queue();
        for (l = 0, len2 = decimal.length; l < len2; l++) {
          n = decimal[l];
          dQueue.enqueue(n);
        }
        results = [];
        for (o = 0, len3 = dEls.length; o < len3; o++) {
          el = dEls[o];
          el = $(el);
          num = dQueue.dequeue();
          if (num == null) {
            num = '0';
          }
          el.attr({
            'data-value': num
          });
          results.push(el.html(invBool ? '*' : num));
        }
        return results;
      };

      View.prototype.refreshSafety = function(score) {
        var covered, level, name, text;
        level = this.els.safetyBox.find('.safetyLevel');
        covered = this.els.safetyBox.find('.rangeBar .covered');
        if (score < 50) {
          text = '低';
          name = 'safety-low';
        } else if ((50 <= score && score <= 70)) {
          text = '中';
          name = 'safety-medium';
        } else if (score > 70) {
          text = '高';
          name = 'safety-high';
        }
        this.els.safetyBox.addClass(name);
        covered.css({
          width: score + "%"
        });
        return level.text(text + "（" + score + "%）");
      };

      View.prototype.bounsList = function(data, periodName, nowMoney, btn) {
        var els, modalBox;
        modalBox = CSH.alert({
          title: '契约分红',
          content: this.tpls.contractAlert({
            name: 'payMoney',
            data: data.data
          }),
          className: 'payMoney publicRed',
          ok: {
            text: '确定分红',
            autohide: false,
            callback: (function(_this) {
              return function() {
                data = {};
                data.lstReciveUser = [];
                els.isTrue.each(function(index, event) {
                  var el;
                  el = $(event);
                  if (el.prop('checked')) {
                    return data.lstReciveUser.push(el.closest('li').attr('data-name'));
                  }
                });
                if (!data.lstReciveUser.length) {
                  CSH.hint({
                    msg: '请选择用户',
                    type: 'error',
                    icon: 'icon icon-close'
                  });
                } else if (els.balance.text().replace(/[^\d.]/g, '') - els.result.text() < 0) {
                  CSH.hint({
                    msg: '金额不足',
                    type: 'error',
                    icon: 'icon icon-close'
                  });
                } else {
                  data.periodName = periodName;
                  new ModelGaveOutBonus().setUrl().save(data, {
                    dataFilter: function(data) {
                      data = data.toJSON();
                      if (data.code === 0) {
                        return CSH.hint({
                          msg: '发放成功',
                          type: 'success',
                          icon: 'icon icon-ok'
                        });
                      } else {
                        return CSH.hint({
                          msg: data.message,
                          type: 'error',
                          icon: 'icon icon-close'
                        });
                      }
                    }
                  });
                }
                return modalBox.modal('hide');
              };
            })(this)
          }
        });
        els = {};
        els.allBtn = modalBox.find('.title button');
        els.lisBtn = modalBox.find('ul.list li button');
        els.isTrue = modalBox.find('ul.list li button input');
        els.result = modalBox.find('.total .result');
        els.balance = modalBox.find('.total .balance');
        new ModelBalance().setUrl().fetch({
          dataFilter: function(data) {
            data = data.toJSON();
            return els.balance.text('账户余额：' + data.data);
          }
        });
        els.allBtn.on('mousedown', function(event) {
          var allMoney, el;
          el = $(event.currentTarget);
          if (!el.find('input').prop('checked')) {
            els.lisBtn.addClass('checked');
            els.isTrue.prop('checked', true);
            allMoney = 0;
            els.lisBtn.each(function(index, event) {
              var moeny;
              el = $(event);
              moeny = el.closest('li').attr('data-money');
              return allMoney += +moeny;
            });
            return els.result.text(+allMoney.toFixed(4));
          } else {
            els.lisBtn.removeClass('checked');
            els.isTrue.prop('checked', false);
            return els.result.text(0);
          }
        });
        return modalBox.delegate('ul.list li button', 'mousedown', function(event) {
          var allMoney, el, isTrue, li, money;
          el = $(event.currentTarget);
          li = el.closest('li');
          isTrue = el.find('input').prop('checked');
          money = +li.attr('data-money');
          allMoney = +els.result.text();
          money = isTrue ? allMoney - money : allMoney + money;
          return els.result.text(+money.accurate(4));
        });
      };

      View.prototype.eventToTop = function() {
        return CSH.scrollToTop(200);
      };

      View.prototype.modifyInitPwd = function() {
        var inputs, intensity, intensityShow, modalBox, urlLogin;
        modalBox = CSH.alert({
          title: '修改登录密码',
          content: this.tpls.userCenterSecurityAlert({
            name: 'mvLogPass'
          }),
          className: 'isCredentials modal-initpwdmodify',
          ok: {
            text: '确认修改',
            autohide: false,
            callback: (function(_this) {
              return function(event) {
                var confirm, confirmVal, data, el, fade, pwd, pwdVal, temp, tempVal;
                el = $(event.currentTarget);
                temp = inputs.filter('[data-type="origin"]');
                pwd = inputs.filter('[data-type="pwd"]');
                confirm = inputs.filter('[data-type="confirm"]');
                tempVal = temp.val();
                pwdVal = pwd.val();
                confirmVal = confirm.val();
                if (tempVal.length < 6) {
                  _this.adderrorClass(temp);
                  return _this.errorHint('请输入完整的登录密码', el);
                }
                if (pwdVal.length < 6) {
                  _this.adderrorClass(pwd);
                  return _this.errorHint('新密码必须大于6位数', el);
                }
                if (confirmVal.length < 6) {
                  _this.adderrorClass(confirm);
                  return _this.errorHint('再次输入完整的密码', el);
                }
                if (tempVal === pwdVal) {
                  _this.adderrorClass(pwd);
                  return _this.errorHint('新密码不能与原密码相同', el);
                } else if (pwdVal !== confirmVal) {
                  _this.adderrorClass(pwd);
                  return _this.errorHint('两次输入密码不一致', el);
                }
                data = {};
                fade = $('.fade');
                el.attr('disabled', true);
                data.oldPwd = tempVal.md5();
                data.newPwd = pwdVal.md5();
                data.safeLevel = intensity;
                return new ModelChangepwd().setUrl().save(data, {
                  dataFilter: function(data) {
                    data = data.toJSON();
                    if (data.code === 0) {
                      return CSH.hint({
                        msg: '密码设置成功',
                        type: 'success',
                        icon: 'icon icon-ok',
                        callback: function() {
                          modalBox.modal('hide');
                          return location.href = location.origin + "/login.html";
                        }
                      });
                    } else {
                      return CSH.hint({
                        msg: data.message,
                        icon: 'error',
                        icon: 'icon icon-close',
                        callback: function() {
                          return el.attr('disabled', false);
                        }
                      });
                    }
                  }
                });
              };
            })(this)
          }
        });
        intensity = 1;
        inputs = modalBox.find('input');
        intensityShow = modalBox.find('.content .intensity');
        urlLogin = location.origin + "/login.html";
        inputs.filter('[data-type="pwd"]').on('keyup', (function(_this) {
          return function(event) {
            return intensity = _this.eventIntensity(event, intensityShow);
          };
        })(this));
        modalBox.on('keyup', function(event) {
          if (+event.keyCode === 27) {
            return modalBox.on('hidden', function() {
              return location.href = urlLogin;
            });
          }
        });
        return modalBox.find('.close').on('click', function() {
          return modalBox.on('hidden', function() {
            return location.href = urlLogin;
          });
        });
      };

      View.prototype.eventIntensity = function(event, intensityShow) {
        var el, enoughRegex, intensity, mediumRegex, strongRegex;
        el = $(event.currentTarget);
        strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        enoughRegex = new RegExp("(?=.{6,}).*", "g");
        intensityShow.css('opacity', 1);
        if (false === enoughRegex.test(el.val())) {
          intensity = 1;
          intensityShow.text('弱').css({
            'background': '#d74241',
            'color': 'rgba( 255, 255, 255, 1)'
          });
        } else if (strongRegex.test(el.val())) {
          intensity = 3;
          intensityShow.text('强').css({
            'background': '#8fc31f',
            'color': 'rgba( 255, 255, 255, 1)'
          });
        } else if (mediumRegex.test(el.val())) {
          intensity = 2;
          intensityShow.text('中').css({
            'background': '#f19a38',
            'color': 'rgba( 255, 255, 255, 1)'
          });
        } else {
          intensity = 1;
          intensityShow.text('弱').css({
            'background': '#d74241',
            'color': 'rgba( 255, 255, 255, 1)'
          });
        }
        return intensity;
      };

      View.prototype.errorHint = function(msg, el) {
        CSH.hint({
          msg: msg,
          type: 'error',
          icon: 'icon icon-close'
        });
        if (el) {
          return el.attr('disabled', false);
        }
      };

      View.prototype.adderrorClass = function(el) {
        return el.addClass('borderError').focus();
      };

      View.prototype.getDayMoney = function() {
        return new ModelGetCheckAgentSalary().setUrl().fetch({
          dataFilter: (function(_this) {
            return function(data) {
              var dataChild;
              data = data.toJSON();
              dataChild = data.data;
              if (data.data) {
                dataChild = data.data;
              } else {
                return;
              }
              if (dataChild.state === 0) {
                return setTimeout(function() {
                  _this.els.getDayMoney = $(_this.tpls.getDayMoney(data.data.amount));
                  _this.$el.append(_this.els.getDayMoney);
                  _this.els.shade = _this.els.getDayMoney.find('.shadow');
                  _this.els.getMoney = _this.els.getDayMoney.find('.getMoney');
                  return _this.startMove(_this.els.getMoney.get(0), '-35', function() {
                    var getDayMoneyTimer, num, one, startMove;
                    _this.els.getMoney.css({
                      transition: 'all 1s ease-out'
                    });
                    getDayMoneyTimer = null;
                    one = true;
                    num = 0;
                    startMove = function() {
                      getDayMoneyTimer = setInterval(function() {
                        if (one) {
                          num = -35;
                        } else {
                          num = -25;
                        }
                        one = !one;
                        _this.els.getMoney.css({
                          top: num
                        });
                      }, 1000);
                    };
                    startMove();
                    _this.els.getMoney.css({
                      top: -25
                    });
                    window.onblur = function() {
                      clearInterval(getDayMoneyTimer);
                    };
                    return window.onfocus = function() {
                      return startMove();
                    };
                  });
                }, 2000);
              }
            };
          })(this)
        });
      };

      View.prototype.startMove = function(obj, iTarget, callback) {
        var iSpeed, top;
        iSpeed = 0;
        top = obj.offsetTop;
        clearInterval(obj.timer);
        return obj.timer = setInterval(function() {
          iSpeed += (iTarget - top) / 5;
          iSpeed *= 0.7;
          if (Math.abs(iSpeed) < 1 && Math.abs(iTarget - top) < 1) {
            clearInterval(obj.timer);
            obj.style.top = iTarget + 'px';
            return callback && callback();
          } else {
            top += iSpeed;
            return obj.style.top = top + 'px';
          }
        }, 30);
      };

      View.prototype.eventDropBottom = function() {
        var speed;
        speed = 200;
        this.els.getMoneyAlert = this.els.getDayMoney.find('.getMoneyAlert');
        this.els.shade.show();
        return this.els.getMoneyAlert.show().animate({
          marginTop: 0,
          opacity: 1
        }, speed);
      };

      View.prototype.eventGetDayMoney = function(event) {
        var el, speed;
        el = $(event.currentTarget);
        speed = 200;
        el.attr('disabled', true);
        this.els.getMoneyAlert = this.els.getDayMoney.find('.getMoneyAlert');
        return new ModelGetMyDaySalary().setUrl().fetch({
          dataFilter: (function(_this) {
            return function(data) {
              data = data.toJSON();
              if (data.code === 0) {
                return CSH.hint({
                  msg: data.message,
                  type: 'success',
                  icon: 'icon icon-ok',
                  callback: function() {
                    _this.els.shade.hide();
                    return _this.els.getMoneyAlert.animate({
                      marginTop: -20,
                      opacity: 0
                    }, speed, function() {
                      _this.els.getMoneyAlert.hide();
                      clearInterval(_this.getDayMoneyTimer);
                      _this.els.getMoney.css({
                        'top': -140
                      });
                      return setTimeout(function() {
                        return _this.els.getDayMoney.remove();
                      }, 1000);
                    });
                  }
                });
              } else {
                return CSH.hint({
                  msg: data.message,
                  type: 'error',
                  icon: 'icon icon-close',
                  callback: function() {
                    return el.attr('disabled', false);
                  }
                });
              }
            };
          })(this)
        });
      };

      View.prototype.eventCloseResult = function(event) {
        var el, target;
        el = $(event.currentTarget);
        target = el.closest('.result');
        return target.hide().remove();
      };

      View.prototype.eventFocusPaginate = function(event) {
        var el;
        el = $(event.currentTarget);
        return el.setCursorPosition(0);
      };

      View.prototype.eventKeydownPaginate = function(event) {
        var code;
        code = event.keyCode;
        if (indexOf.call([8, 13, 37, 39].concat([48, 49, 50, 51, 52, 53, 54, 55, 56, 57].concat([96, 97, 98, 99, 100, 101, 102, 103, 104, 105])), code) < 0) {
          return false;
        }
      };

      View.prototype.eventChangePaginate = function(event) {
        var el, max, p;
        el = $(event.currentTarget);
        p = +el.val();
        max = +el.attr('data-max');
        if (!(p && p < max)) {
          return el.val(max);
        }
      };

      View.prototype.eventClickFilterInput = function(event) {
        var dd, el, input, root;
        el = $(event.target);
        dd = el.closest('.dropdown');
        root = el.closest('.filterInput');
        input = root.find('input');
        if (dd[0]) {
          el.addClass('selected').siblings('.selected').removeClass('selected');
          input.attr({
            'data-value': el.attr('data-value')
          }).val(el.text()).trigger('fi.change');
          root.removeClass('active');
        } else {
          root.addClass('active');
          CSH.$els.body.one('click', (function(_this) {
            return function() {
              return _this.__hideFilterInputDropdown(arguments[0], root);
            };
          })(this));
        }
        return input.setSelection(0);
      };

      View.prototype.eventKeyupFilterInput = function(event) {
        var ddItems, el, root, val;
        el = $(event.currentTarget);
        val = el.val();
        root = el.closest('.filterInput');
        ddItems = root.find('.dropdown > span');
        if (val.trim() === '') {
          val = 1;
          el.val(1).setCursorPosition(0);
        }
        el.attr({
          'data-value': val
        }).trigger('fi.change');
        ddItems.filter('.selected').removeClass('selected');
        ddItems.filter("[data-value=\"" + val + "\"]").addClass('selected');
      };

      View.prototype.__hideFilterInputDropdown = function(event, root) {
        var el;
        el = $(event.target);
        if (el.closest('.filterInput')[0]) {
          return;
        }
        return root.removeClass('active');
      };

      View.prototype.showLoading = function() {
        CSH.$els['content'].html(TplLoading);
      };

      View.prototype.removeErrorPage = function() {
        this.$('> .errortitle', CSH.$els['content']).remove();
      };

      View.prototype.show404 = function() {
        CSH.$els['content'].removeClass(CSH.router.oldRoute).html(Tpl404);
      };

      View.prototype.showTimeout = function() {
        CSH.$els['content'].removeClass(CSH.router.oldRoute).html(TplTimeout);
      };

      View.prototype.logOff = function() {
        return new ModelLogOff().setUrl().fetch({
          dataFilter: (function(_this) {
            return function(data) {
              if (data.toJSON().code === 0) {
                return CSH.hint({
                  msg: '登出成功',
                  duration: 1000,
                  callback: function() {
                    return location.href = location.origin + "/login.html";
                  }
                });
              }
            };
          })(this)
        });
      };

      View.prototype.showGameInfo = function(param) {
        var _el, processStr, str, target;
        _el = $(this.tpls.modalGameInfo(param.pageData)).appendTo('body');
        _el.on('hidden', function() {
          return _el.remove();
        }).on('click', '.cancelOrder', (function(_this) {
          return function() {
            var id;
            id = _el.attr('data-id');
            return new ModelCancelOrder().setUrl().save({
              orders: id
            }, {
              dataFilter: function(data) {
                switch (data.toJSON().code) {
                  case 0:
                    CSH.hint({
                      msg: '撤单成功',
                      duration: 500,
                      type: 'success',
                      callback: function() {
                        _el.modal('hide');
                        param.callback.apply(_el, arguments);
                        return _this.refreshBalance();
                      }
                    });
                    break;
                  case 5:
                  case 1:
                    CSH.hint({
                      msg: '操作失败，请重试',
                      duration: 1500,
                      type: 'error'
                    });
                    break;
                  case 4:
                    CSH.hint({
                      msg: '本期已经封盘,不能撤单',
                      duration: 2000
                    });
                    break;
                  case 2:
                    CSH.hint({
                      msg: '合买不能撤单',
                      duration: 1500
                    });
                    break;
                  case 3:
                    CSH.hint({
                      msg: '已经撤单',
                      duration: 1500
                    });
                    break;
                  default:
                    CSH.hint({
                      msg: data.toJSON().message,
                      duration: 1500
                    });
                }
              }
            });
          };
        })(this));
        str = param.pageData.code;
        target = _el.find('#myLottNum');
        processStr = function(str) {
          var dec, isDb, isInput, ref, temp;
          temp = '';
          dec = param.pageData.dypointdec;
          if (dec) {
            temp += "<p>" + (dec.split('').join(' ')) + "</p>";
          }
          isDb = (ref = +CSH.gType) === 1 || ref === 2 || ref === 5;
          isInput = /单式/.test(param.pageData.methodname);
          temp += '<div class="inner">';
          temp += str.replace(/\||&/g, function(chat) {
            switch (chat) {
              case '|':
                return '<i></i>';
              case '&':
                if (isInput) {
                  return ' ';
                } else {
                  if (isDb) {
                    return '';
                  } else {
                    return ' ';
                  }
                }
            }
          });
          temp += '</div>';
          return target.html(temp);
        };
        if (str) {
          _el.modal('show');
          processStr(str);
          return;
        }
        new ModelBetContent().setUrl(param.pageData.projectid).fetch({
          dataFilter: function(data) {
            data = data.toJSON();
            if (data.code) {
              console.log(data.message);
              target.html("<div class=\"no_lott_num_tip\">" + data.message + "</div>");
              return;
            }
            return processStr(data.data);
          }
        });
        return _el.modal('show');
      };

      View.prototype.showTrackInfo = function(param) {
        var _el, _subView, btnCancel, cancelIds, fetchGameInfoList, gameInfoList, setMethodNameAndNum, switchCancelBtnState, temp, totalLength;
        gameInfoList = void 0;
        cancelIds = [];
        totalLength = void 0;
        _el = $(this.tpls.modalTrackInfo(param)).appendTo('body');
        btnCancel = _el.find('button.cancelOrder');
        _subView = _el.find('.right_tzbox');
        temp = null;
        _el.on('hidden', function() {
          _el.remove();
        });
        _el.on('mouseenter', '.nums_detail, #num', function() {
          clearTimeout(temp);
          _el.find('#num').stop(true).slideDown("fast");
        });
        _el.on('mouseleave', '.nums_detail, #num', function() {
          temp = setTimeout(function() {
            return _el.find('#num').stop(true).slideUp("fast");
          }, 20);
        });
        _el.modal('show');
        fetchGameInfoList = (function(_this) {
          return function() {
            _subView.off().empty().html(doT.template(TplDotsLoading));
            return new ModelAppendLotteryBetting().setUrl(param.trackInfo.id).fetch({
              dataFilter: function(data) {
                var gameInfo;
                data = data.toJSON();
                gameInfoList = data.data;
                gameInfo = gameInfoList[0];
                setTimeout(function() {
                  return setMethodNameAndNum(gameInfo.methodname, gameInfo.code, gameInfo.lotteryid);
                }, 0);
                _subView.html(_this.tpls.modalTzList(gameInfoList));
                totalLength = $('.tbody button.checkbox').length - $('.tbody button.checkbox:disabled').length;
                if (totalLength === 0) {
                  _subView.find('span.t1').detach();
                  _subView.height(360).css({
                    'border-bottom': 0
                  });
                  _subView.find('.tbody').height(330);
                }
              }
            });
          };
        })(this);
        switchCancelBtnState = function() {
          return btnCancel.prop('disabled', !cancelIds.length);
        };
        fetchGameInfoList();
        _el.on('click', '.gameInfoBtn', (function(_this) {
          return function(event) {
            var index;
            index = $(event.currentTarget).attr('data-index');
            _this.showGameInfo({
              pageData: gameInfoList[index],
              callback: fetchGameInfoList
            });
          };
        })(this));
        _el.on('change', '.tbody input[type=checkbox]', function(event) {
          var allCheckboxEle, isSelectAll;
          allCheckboxEle = _subView.find('.thead button.checkbox');
          isSelectAll = function() {
            return cancelIds.length === totalLength;
          };
          if (this.checked) {
            cancelIds.push(this.value);
            if (isSelectAll()) {
              allCheckboxEle.addClass('checked');
              allCheckboxEle.children().prop('checked', true);
            } else {
              allCheckboxEle.removeClass('checked');
              allCheckboxEle.children().prop('checked', false);
            }
          } else {
            cancelIds.remove(this.value);
            allCheckboxEle.removeClass('checked');
            allCheckboxEle.children().prop('checked', false);
          }
          switchCancelBtnState();
        });
        _el.on('change', '.thead input[type=checkbox]', function(event) {
          var removeAll, selectAll, selectElements;
          selectElements = _subView.find('.tbody button.checkbox:not(:disabled)');
          selectAll = function() {
            return selectElements.each(function(index, element) {
              var el;
              el = $(element);
              el.addClass('checked');
              el.children().prop('checked', true);
              cancelIds.push(el.children().val());
            });
          };
          removeAll = function() {
            return selectElements.each(function(index, element) {
              var el;
              el = $(element);
              el.removeClass('checked');
              el.children().prop('checked', false);
              cancelIds = [];
            });
          };
          if (this.checked) {
            selectAll();
          } else {
            removeAll();
          }
          switchCancelBtnState();
        });
        _el.on('click', '.cancelOrder', (function(_this) {
          return function(event) {
            new ModelCancelOrder().setUrl().save({
              orders: cancelIds.join('|')
            }, {
              dataFilter: function(data) {
                switch (data.toJSON().code) {
                  case 0:
                    CSH.hint({
                      msg: '撤单成功',
                      duration: 500,
                      type: 'success',
                      callback: function() {
                        var ref;
                        _el.modal('hide');
                        if ((ref = param.callback) != null) {
                          ref.apply(_el, arguments);
                        }
                        return _this.refreshBalance();
                      }
                    });
                    break;
                  case 5:
                  case 1:
                    CSH.hint({
                      msg: '操作失败，请重试',
                      duration: 1500,
                      type: 'error'
                    });
                    break;
                  case 4:
                    CSH.hint({
                      msg: '本期已经封盘,不能撤单',
                      duration: 2000
                    });
                    break;
                  case 2:
                    CSH.hint({
                      msg: '合买不能撤单',
                      duration: 1500
                    });
                    break;
                  case 3:
                    CSH.hint({
                      msg: '已经撤单',
                      duration: 1500
                    });
                    break;
                  default:
                    CSH.hint({
                      msg: data.toJSON().message,
                      duration: 1500
                    });
                }
              }
            });
          };
        })(this));
        setMethodNameAndNum = function(name, num, gameId) {
          var f;
          f = +gameId.toString().charAt(0);
          if (f === 3 || f === 4) {
            num = num.replace(/&/g, ' ');
          } else {
            num = num.replace(/&/g, '');
          }
          _el.find('#methodName').html(name);
          _el.find('#num span#numSpan').html(num);
        };
      };

      View.prototype.sendMsg = function(ids, names, msg, success, error) {
        var process;
        process = CSH.hint({
          icon: 'loading',
          msg: '发送中...',
          duration: Infinity
        });
        return new ModelMembertalkSend().setUrl().save({
          sendTo: ids,
          message: msg
        }, {
          dataFilter: (function(_this) {
            return function(data) {
              process.animate({
                marginTop: '-32px',
                opacity: 0
              }, 1, function() {
                return process.remove();
              });
              data = data.toJSON();
              if (data.code === 0) {
                CSH.ws.send(JSON.stringify({
                  model: 3,
                  msgType: 4,
                  target: {
                    targetUserName: names
                  },
                  msg: JSON.stringify({
                    fromId: _this.data.myId,
                    fromName: localStorage.getItem('username'),
                    dictTalkId: data.data,
                    msg: msg
                  })
                }));
                return typeof success === "function" ? success() : void 0;
              } else {
                CSH.hint('发送失败');
                return typeof error === "function" ? error() : void 0;
              }
            };
          })(this)
        });
      };

      View.prototype.showSendMsgPanel = function(param) {
        var _data, _els, addAddr, freshChatList, initSelectOption, modalBox, removeAddr, switchAllCheckState, switchSendBtnState;
        _els = {};
        _data = {};
        _data.pId = +localStorage.getItem('parentId');
        _data.sendIds = [];
        _data.sendNames = [];
        this.cChatlist.reset(this.data.cleanChatList);
        modalBox = $(this.tpls.modal({
          className: 'modal-sendMsg modal-large',
          title: '发消息',
          content: this.tpls.sendMsg()
        })).on('hidden', (function(_this) {
          return function() {
            var ref;
            modalBox.off().remove();
            _this.freshPageMsg();
            return param != null ? (ref = param.callback) != null ? ref.apply(modalBox, arguments) : void 0 : void 0;
          };
        })(this)).appendTo(CSH.$els.body).modal('show');
        _els.chatListBox = modalBox.find('.chatList');
        _els.addrSelect = modalBox.find('.addr select');
        _els.allCheckBox = modalBox.find('.allSelect button.checkbox');
        _els.sendBtn = modalBox.find('.action button');
        _els.sendConArea = modalBox.find('.content textarea');
        _els.addrRenshu = modalBox.find('.renshu');
        switchAllCheckState = (function(_this) {
          return function() {
            if (_els.chatListBox.find('button:not(.checked)').length === 0 && _this.data.cleanChatList.length !== 0) {
              _els.allCheckBox.addClass('checked');
              return _els.allCheckBox.children().prop('checked', true);
            } else {
              _els.allCheckBox.removeClass('checked');
              return _els.allCheckBox.children().prop('checked', false);
            }
          };
        })(this);
        freshChatList = function(list) {
          var contact, j, len1, temp;
          temp = '';
          for (j = 0, len1 = list.length; j < len1; j++) {
            contact = list[j];
            temp += "<div" + (contact.userID === _data.pId ? ' class="text-red"' : '') + ">\n	<button class=\"checkbox icon" + (contact.checked ? ' checked' : '') + "\">\n		<input type=\"checkbox\" value=\"" + contact.userID + "\"" + (contact.checked ? ' checked="checked"' : '') + "></input>\n	</button>" + (contact.userID === _data.pId ? '上级' : contact.userName) + (contact.userType === 2 ? '代理' : '') + "\n</div>";
          }
          _els.chatListBox.html(temp);
          return switchAllCheckState();
        };
        initSelectOption = (function(_this) {
          return function() {
            var html, item, j, len1, ref;
            html = '';
            ref = _this.data.cleanChatList;
            for (j = 0, len1 = ref.length; j < len1; j++) {
              item = ref[j];
              html += "<option value=\"" + item.userID + "\">" + (item.userID === _data.pId ? '上级' : item.userName) + "</option>";
            }
            _els.addrSelect.html(html);
            return _els.addrSelect.select2({
              placeholder: '请添加您的收件人'
            });
          };
        })(this);
        _els.sendBtn.prop('disabled', !_data.sendIds.length);
        _els.allCheckBox.prop('disabled', true);
        _els.addrSelect.select2({
          placeholder: '请添加您的收件人'
        });
        this.fetchMembertalkContactsAsync(false);
        freshChatList(this.data.cleanChatList);
        initSelectOption();
        _els.allCheckBox.prop('disabled', false);
        switchSendBtnState = (function(_this) {
          return function() {
            return _els.sendBtn.prop('disabled', !_data.sendIds.length);
          };
        })(this);
        addAddr = (function(_this) {
          return function(id) {
            _data.sendIds.push(id);
            return _data.sendNames.push(_this.cChatlist.findWhere({
              userID: id
            }).get('userName'));
          };
        })(this);
        removeAddr = (function(_this) {
          return function(id) {
            _data.sendIds.remove(id);
            return _data.sendNames.remove(_this.cChatlist.findWhere({
              userID: id
            }).get('userName'));
          };
        })(this);
        modalBox.on('change', '.chatList input[type=checkbox]', (function(_this) {
          return function(event) {
            var el, id, len;
            el = event.currentTarget;
            id = +el.value;
            if (el.checked) {
              if (_data.sendIds.has(id)) {
                return;
              }
              addAddr(id);
            } else {
              if (!_data.sendIds.has(id)) {
                return;
              }
              removeAddr(id);
            }
            _els.addrSelect.val(_data.sendIds).trigger('change');
            _this.cChatlist.findWhere({
              userID: id
            }).set('checked', el.checked);
            switchSendBtnState();
            setTimeout(function() {
              return switchAllCheckState();
            }, 0);
            len = _data.sendIds.length;
            if (len > 0) {
              return _els.addrRenshu.html("（" + len + "/人）");
            } else {
              return _els.addrRenshu.html('');
            }
          };
        })(this));
        modalBox.on('change', '.allSelect input[type=checkbox]', (function(_this) {
          return function(event) {
            var el, tarEles, toCancel, toselect;
            el = event.currentTarget;
            toCancel = _els.chatListBox.find('button.checked');
            toselect = _els.chatListBox.find('button:not(.checked)');
            if (el.checked) {
              tarEles = toselect;
            } else {
              tarEles = toCancel;
            }
            tarEles.each(function(index, element) {
              var tar;
              tar = $(element);
              return tar.children().click();
            });
          };
        })(this));
        modalBox.on('select2:select', '.addr select', (function(_this) {
          return function(event) {
            var id, tar;
            id = +event.params.data.id;
            tar = _els.chatListBox.find("input[value=\"" + id + "\"]");
            if (tar.length > 0) {
              return tar.click();
            } else {
              _this.cChatlist.findWhere({
                userID: id
              }).set('checked', true);
              return addAddr(id);
            }
          };
        })(this));
        modalBox.on('select2:unselect', '.addr select', (function(_this) {
          return function(event) {
            var id, tar;
            id = +event.params.data.id;
            tar = _els.chatListBox.find("input[value=\"" + id + "\"]");
            if (tar.length > 0) {
              return tar.click();
            } else {
              _this.cChatlist.findWhere({
                userID: id
              }).set('checked', false);
              return removeAddr(id);
            }
          };
        })(this));
        modalBox.on('keyup', '.search input', (function(_this) {
          return function(event) {
            var el, filterArr, input;
            el = event.currentTarget;
            input = el.value;
            filterArr = _this.cChatlist.filter(function(contact) {
              var name;
              name = contact.get('userName');
              if (name.indexOf(input) !== -1) {
                return contact;
              }
            });
            filterArr = new CollectionsMembertalkContacts(filterArr).toJSON();
            return freshChatList(filterArr);
          };
        })(this));
        modalBox.on('click', '.action button', (function(_this) {
          return function(event) {
            var ids, msg, nms;
            ids = _data.sendIds.join(',');
            nms = _data.sendNames.join(',');
            msg = _els.sendConArea.val();
            if (!msg) {
              return CSH.hint('请输入内容');
            }
            if (!ids.length) {
              return CSH.hint('请输入联系人');
            }
            _els.sendBtn.prop('disabled', true);
            return _this.sendMsg(ids, nms, msg, function() {
              modalBox.modal('hide');
              _data.sendIds = [];
              return _data.sendNames = [];
            }, function() {
              return _els.sendBtn.prop('disabled', false);
            });
          };
        })(this));
        modalBox.on('keydown', '.content textarea', function(event) {
          var ref;
          if ((ref = event.keyCode) === 91 || ref === 93 || ref === 17) {
            CSH.cmdKey = 1;
          }
          if (event.keyCode === 13) {
            return false;
          }
        });
        modalBox.on('keyup', '.content textarea', function(event) {
          var el, ref;
          el = $(event.currentTarget);
          if ((ref = event.keyCode) === 91 || ref === 93 || ref === 17) {
            CSH.cmdKey = 0;
          }
          if (event.keyCode === 13) {
            if (CSH.cmdKey) {
              return el.val(el.val() + '\n');
            }
            return _els.sendBtn.click();
          }
        });
      };

      View.prototype.showConversation = function(userId, msgType) {
        var m, process;
        console.log(msgType);
        m = +msgType === 0 ? new ModelMembertalkMsgs() : new Modelsystemmessages();
        process = CSH.hint({
          icon: 'loading',
          msg: '加载中...',
          duration: Infinity
        });
        return m.setUrl().save({
          userId: userId,
          pageIndex: 1,
          pageSize: 10,
          messageId: 0
        }, {
          dataFilter: (function(_this) {
            return function(data) {
              var can, crollToBottom, isEmptyPanel, main, modalBox, onLine, sendBtn, tarUserInfo, toLoadMsg;
              process.animate({
                marginTop: '-32px',
                opacity: 0
              }, 1, function() {
                return process.remove();
              });
              toLoadMsg = true;
              data = data.toJSON().data;
              isEmptyPanel = false;
              if (!data.userInfos) {
                isEmptyPanel = true;
                data.userInfos = [];
                data.userInfos[0] = _this.cChatlist.findWhere({
                  userID: userId
                }).toJSON();
                data.messages = [];
              }
              tarUserInfo = data.userInfos[0];
              modalBox = $(_this.tpls.mConversation({
                type: msgType,
                data: data
              })).appendTo(CSH.$els.body);
              onLine = modalBox.find('#online');
              can = modalBox.find('.modal-body');
              main = modalBox.find('.main');
              sendBtn = modalBox.find('.modal-footer .sendBtn');
              new ModelMembertalkOnline().setUrl(userId).fetch({
                dataFilter: function(data) {
                  data = data.toJSON();
                  if (data.data) {
                    return onLine.removeClass().addClass('onLine');
                  } else {
                    return onLine.removeClass().addClass('offLine');
                  }
                }
              });
              crollToBottom = function() {
                return can.scrollTop(main.outerHeight() - can.height() + 30);
              };
              modalBox.on('hidden', function() {
                modalBox.off().remove();
                return _this.freshPageMsg();
              }).on('click', '.modal-footer .sendBtn', function(event) {
                var el, input, msg;
                el = $(event.currentTarget);
                input = el.prev();
                msg = input.val();
                if (!msg) {
                  return CSH.hint('请输入内容');
                }
                sendBtn.prop('disabled', true);
                return _this.sendMsg(tarUserInfo.userID, tarUserInfo.userName, msg, function() {
                  var temp;
                  input.val('');
                  temp = "<div class=\"msgLi right\">\n	<div class=\"tit\">\n		<span class=\"name\">我</span>\n		<span class=\"ext\">" + (new Date().getFormatDateAndTime().replace(/^\d{4}-/, '').replace(/-/, '月').replace(/\ /, '日 ')) + "</span>\n	</div>\n	<div class=\"info\"><pre>" + msg + "</pre></div>\n</div>";
                  main.append(temp);
                  crollToBottom();
                  return sendBtn.prop('disabled', false);
                }, function() {
                  return sendBtn.prop('disabled', false);
                });
              }).on('keydown', '.modal-footer textarea', function(event) {
                var ref;
                if ((ref = event.keyCode) === 91 || ref === 93 || ref === 17) {
                  CSH.cmdKey = 1;
                }
                if (event.keyCode === 13) {
                  return false;
                }
              }).on('keyup', '.modal-footer textarea', function(event) {
                var el, ref;
                el = $(event.currentTarget);
                if ((ref = event.keyCode) === 91 || ref === 93 || ref === 17) {
                  CSH.cmdKey = 0;
                }
                if (event.keyCode === 13) {
                  if (CSH.cmdKey) {
                    return el.val(el.val() + '\n');
                  }
                  return sendBtn.click();
                }
              });
              can.on('scroll', function(event) {
                var lastTop, msgId, temp;
                if (can.scrollTop() === 0 && toLoadMsg) {
                  temp = '<div class="tip"><span class="icon icon-loading icon-spin"></span>加载中...</div>';
                  main.prepend(temp);
                  lastTop = $(main.find('.msgLi')[0]);
                  msgId = lastTop.attr('data-msgId');
                  return new ModelMembertalkMsgs().setUrl().save({
                    userId: userId,
                    pageIndex: 1,
                    pageSize: 10,
                    messageId: +msgId
                  }, {
                    dataFilter: function(data) {
                      var item, j, len1, msgList;
                      data = data.toJSON();
                      if (data.code !== 0) {
                        return;
                      }
                      msgList = data.data.messages.reverse();
                      temp = '';
                      if (msgList.length < 10) {
                        temp += '<div class="tip">—— 无更多消息 ——</div>';
                        toLoadMsg = false;
                      }
                      for (j = 0, len1 = msgList.length; j < len1; j++) {
                        item = msgList[j];
                        temp += "<div class=\"msgLi" + (+item.sender === _this.data.myId ? ' right' : ' left') + "\" data-msgId=\"" + item.id + "\">\n	<div class=\"tit\">\n		<span class=\"name\">" + (+item.sender === _this.data.myId ? '我' : +item.sender === +localStorage.getItem('parentId') ? '上级' : data.data.userInfos[0].userName) + "</span>\n		<span class=\"ext\">" + (item.createOn.replace(/^\d{4}\//, '').replace(/\//, '月').replace(/\ /, '日 ')) + "</span>\n	</div>\n	<div class=\"info\">\n		<pre>" + item.message + "</pre>\n	</div>\n</div>";
                      }
                      main.find('.tip').replaceWith(temp);
                      return can.scrollTop(lastTop.position().top);
                    }
                  });
                }
              });
              crollToBottom();
              modalBox.modal('show');
              if (!isEmptyPanel) {
                return _this.reportReaded(data.talkID);
              }
            };
          })(this)
        });
      };

      View.prototype.reportReaded = function(ids, callback) {
        return new ModelMembertalkRead().setUrl().save({
          talkIds: ids
        }, {
          dataFilter: (function(_this) {
            return function(data) {
              return typeof callback === "function" ? callback() : void 0;
            };
          })(this)
        });
      };

      View.prototype.eventAFilter = function(event) {
        var el, href;
        el = $(event.currentTarget);
        href = el.attr('href');
        if (!href) {
          return;
        }
        if ('#xxx' === href) {
          CSH.hint('正在开发中，敬请期待...');
          return event.preventDefault();
        }
      };

      View.prototype.generateQRCode = function() {
        var targets;
        targets = CSH.$els.footer.find('.qrCodeBox div');
        return setTimeout(function() {
          var aT, iT;
          aT = targets.filter('[data-type="android"]');
          iT = targets.filter('[data-type="ios"]');
          return aT.qrcode({
            text: location.origin + "/download.html",
            render: 'div',
            ecLevel: 'H',
            size: 150,
            minVersion: 8,
            background: '#fff'
          });
        }, 250);
      };

      View.prototype.initWS = function() {
        return new WS(this);
      };

      View.prototype.showImpMsg = function(data) {
        var bodyInitHeight, els, modalBox, scrollHeight;
        modalBox = CSH.alert({
          title: '推送公告',
          className: 'modal-notice modal-large',
          content: "<h3>" + data.title + "</h3>" + (data.content.decodeHTML()),
          ok: {
            text: '我知道了',
            callback: (function(_this) {
              return function() {
                _this.getContract();
                return _this.settlementContract();
              };
            })(this)
          }
        });
        els = {};
        els.$window = $(window);
        els.modalBody = modalBox.find('.modal-body');
        bodyInitHeight = 0;
        scrollHeight = (function(_this) {
          return function() {
            var modalBodyH, windowH;
            windowH = els.$window.height() * 0.9 - 154;
            modalBodyH = els.modalBody.height();
            if (windowH < modalBodyH || bodyInitHeight > modalBodyH) {
              return els.modalBody.css({
                height: windowH
              });
            }
          };
        })(this);
        setTimeout(function() {
          bodyInitHeight = els.modalBody.height();
          if (els.modalBody.height() > els.$window.height() * 0.9 - 154) {
            scrollHeight();
            return els.$window.on('resize', scrollHeight);
          }
        }, 1000);
        return modalBox.find('button[btn-type="ok"]').removeClass('btn-primary');
      };

      View.prototype.freshPageMsg = function() {
        var ref, ref1;
        CSH.views['navbar'].initTopMessageBox();
        return (ref = CSH.$els.content.find('.rightBox .content.message')) != null ? (ref1 = ref.find('.tabTitle ul li[data-type=normal].active')) != null ? ref1.trigger('click') : void 0 : void 0;
      };

      View.prototype.soundAlert = function() {
        var alertBox, alertWrap;
        if (localStorage.getItem('alertedSound')) {
          return;
        }
        if (CSH.alertingSound) {
          return;
        }
        CSH.alertingSound = 1;
        alertWrap = $("<div class=\"promptWrap\">\n	<div class=\"promptBox promptAudio\">\n		<em class=\"arrow\"></em>\n		<i class=\"icon-wrong close2\"></i>\n		<div class=\"picTxt\">\n			<span class=\"audioImg\"></span>\n			<div class=\"txtBox\">\n				<h3>声音开关键</h3>\n				<p>不错过每个开奖机会</p>\n			</div>\n		</div>\n	</div>\n</div>");
        alertBox = alertWrap.find('> .promptBox');
        alertWrap.appendTo(CSH.$els.navbar.find('> .inner'));
        return setTimeout(function() {
          return alertBox.css({
            opacity: 1,
            visibility: 'visible'
          }).on('click', '.close2', function() {
            alertBox.css({
              opacity: 0,
              visibility: 'hidden'
            });
            setTimeout((function() {
              return alertWrap.remove();
            }), 200);
            localStorage.setItem('alertedSound', 1);
            return delete CSH.alertingSound;
          });
        }, 1600);
      };

      View.prototype.appDownloadAlert = function() {
        var alertBox, alertWrap;
        if (localStorage.getItem('alertedAppDownload')) {
          return;
        }
        if (CSH.alertingAppDownload) {
          return;
        }
        CSH.alertingAppDownload = 1;
        alertWrap = $("<div class=\"promptWrap\">\n	<div class=\"promptBox promptDownload\">\n		<em class=\"arrow\"></em>\n		<i class=\"icon-wrong close1\"></i>\n		<div class=\"picTxt\">\n			<span class=\"mobileImg\"></span>\n			<div class=\"txtBox\">\n				<h3>手机端下载</h3>\n				<p>随时随地玩游戏</p>\n			</div>\n		</div>\n	</div>\n</div>");
        alertBox = alertWrap.find('> .promptBox');
        alertWrap.appendTo(CSH.$els.navbar.find('> .inner'));
        return setTimeout(function() {
          return alertBox.css({
            opacity: 1,
            visibility: 'visible'
          }).on('click', '.close1', function() {
            alertBox.css({
              opacity: 0,
              visibility: 'hidden'
            });
            setTimeout((function() {
              return alertWrap.remove();
            }), 200);
            localStorage.setItem('alertedAppDownload', 1);
            return delete CSH.alertingSound;
          });
        }, 1600);
      };

      return View;

    })(Backbone.View);
    WS = (function() {
      function WS(view) {
        this.view = view;
        this.gotMsg = bind(this.gotMsg, this);
        this._close = bind(this._close, this);
        this._message = bind(this._message, this);
        this.abortedCount = 0;
        this._reset();
      }

      WS.prototype._reset = function() {
        var ws;
        if (this.abortedCount++ > 5) {
          return;
        }
        CSH.ws = this.ws = ws = new WebSocket(CSH.path.ws);
        ws.addEventListener('message', this._message);
        ws.addEventListener('error', this._error);
        ws.addEventListener('close', this._close);
        return ws;
      };

      WS.prototype._message = function(event) {
        var data, ws;
        data = event.data;
        ws = this.ws;
        if (data === 'Connect successful!') {
          ws.send(JSON.stringify({
            model: 1,
            msgType: 1,
            target: {
              targetUserName: localStorage.getItem('username'),
              targetCategory: +localStorage.getItem('userType'),
              stargetID: localStorage.getItem('stargetID')
            }
          }));
          setInterval((function() {
            return ws.send('{}');
          }), 30000);
          return;
        }
        data = data.toJSON();
        switch (data.msgType) {
          case 3:
            this.showWinningMsg(data.msg.toJSON());
            return this.refreshLotteryRecords();
          case 4:
            return this.gotMsg(data);
          case 5:
            return this.view.showImpMsg(data.msg.toJSON());
          case 6:
            return this.refreshLotteryRecords();
        }
      };

      WS.prototype._error = function() {
        return console.error('ws', arguments);
      };

      WS.prototype._close = function() {
        this._reset();
        return console.warn('ws', arguments);
      };

      WS.prototype.showWinningMsg = function(data) {
        var name;
        name = CSH.gameMap[data.gameID].text;
        CSH.audios.winning.play();
        CSH.notice({
          content: "<span class=\"icon\"></span>\n<p>恭喜中奖！您所购买的 " + name + " 中奖金额：<span class=\"text-red\">" + data.amount + "</span>元</p>",
          className: 'notice-vj',
          duration: 5000
        });
        switch (CSH.pageName) {
          case 'index':
          case 'lottery':
            return $('.balanceBox .refreshBalance').trigger('click');
          case 'userCenter':
            return $('.rightBox .moneyBottom .refresh').trigger('click');
        }
      };

      WS.prototype.refreshLotteryRecords = function() {
        var btn, content;
        content = CSH.$els.content;
        if (!content.hasClass('lottery')) {
          return;
        }
        btn = content.find('.listBox2 button.refresh');
        return btn.click();
      };

      WS.prototype.gotMsg = function(data) {
        var can, dicT, fromId, fromN, mPanel, main, msg, temp;
        CSH.audios.gotMsg.play();
        console.log('站内信', data);
        temp = data.msg.toJSON();
        fromId = temp.fromId;
        fromN = +localStorage.getItem('parentId') === +fromId ? '上级' : temp.fromName;
        dicT = temp.dictTalkId;
        msg = decodeURIComponent(temp.msg);
        mPanel = $(".modal.modal-conversation[data-id=" + fromId + "]");
        if (mPanel.length > 0) {
          can = mPanel.find;
          can = mPanel.find('.modal-body');
          main = mPanel.find('.main');
          temp = "<div class=\"msgLi left\">\n	<div class=\"tit\">\n		<span class=\"name\">" + fromN + "</span>\n		<span class=\"ext\">" + (new Date().getFormatDateAndTime().replace(/^\d{4}-/, '').replace(/-/, '月').replace(/\ /, '日 ')) + "</span>\n	</div>\n	<div class=\"info\"><pre>" + msg + "</pre></div>\n</div>";
          main.append(temp);
          can.scrollTop(main.outerHeight() - can.height() + 30);
          this.view.reportReaded(dicT[this.view.data.myId]);
          return;
        }
        return this.view.freshPageMsg();
      };

      return WS;

    })();
    return View;
  });

}).call(this);
 
