import lifecycle from '/util/lifecycle';
import animModal from '/util/items';


Page({
  ...lifecycle,
  ...animModal.animOp,
  data: {
    ...animModal.data,
    pageName: 'ProjectM/index',
    pageInfo: {
      pageId: 0,
    },
    hidden: true,
    curIndex: 0,
    arr: {
      onItemTap: 'onGridItemTap',
      onChildItemTap: 'onChildItemTap',
      list: [
        {
          icon: '/image/view.png',
          title: '外贸应收',
          entitle: '外贸应收',
          subs: [
            {
              title: '全年外贸应收表',
              entitle: '财务报表/全年外贸应收表',
              page: 'FinanceReport/ExternalInCompanyYear/ExternalInCompanyYear',
            },
            {
              title: '当月外贸应收表',
              entitle: '财务报表/当月外贸应收表',
              page: 'FinanceReport/ExternalInCompany/ExternalInCompany',
            },
            {
              title: '外贸应收明细',
              entitle: '财务报表/外贸应收明细',
              page: 'FinanceReport/ExternalInBalance/ExternalInBalance',
            },
            /*{
              title: '外贸业务员分组月汇总',
              entitle: '财务报表/外贸业务员分组月汇总',
              page: 'FinanceReport/SellYearExternal/SellYearExternal',
            },
            {
              title: '销售同比外贸',
              entitle: '财务报表/销售同比外贸',
              page: 'FinanceReport/SellExternalCompare/SellExternalCompare',
            },
            {
              title: '业务排名内外',
              entitle: '财务报表/业务排名内外',
              page: 'FinanceReport/SellSort/SellSort',
            },*/
          ],
        }, {
          icon: '/image/basic.png',
          title: '外贸应付',
          entitle: '外贸应付',
          subs: [
            {
              title: '外贸应付汇总',
              entitle: '财务报表/外贸应付汇总',
              page: 'FinanceReport/ExternalOutCompanyYear/ExternalOutCompanyYear',
            },
            {
              title: '外贸应付当月汇总',
              entitle: '财务报表/外贸应付当月汇总',
              page: 'FinanceReport/ExternalOutCompany/ExternalOutCompany',
            },
            {
              title: '外贸应付账款对账单',
              entitle: '财务报表/外贸应付账款对账单',
              page: 'FinanceReport/ExternalOutBalance/ExternalOutBalance',
            },
          ],
        }, {
          icon: '/image/form.png',
          title: '内贸应收',
          entitle: '内贸应收',
          subs: [
            /*{
              title: '业务员分组分月汇总',
              entitle: '财务报表/业务员分组分月汇总',
              page: 'FinanceReport/SellYear/SellYear',
            },
            {
              title: '销售同比内贸',
              entitle: '财务报表/销售同比内贸',
              page: 'FinanceReport/SellCompare/SellCompare',
            },*/
            {
              title: '分组汇总',
              entitle: '财务报表/分组汇总',
              page: 'FinanceReport/InEmployee/InEmployee',
            },
            {
              title: '应收账款',
              entitle: '财务报表/应收账款',
              page: 'FinanceReport/InCompany/InCompany',
            },
            {
              title: '应收月度对账单',
              entitle: '财务报表/应收月度对账单',
              page: 'FinanceReport/InBalance/InBalance',
            },
          ],
        }, {
          icon: '/image/biz_errorview.png',
          title: '内贸应付',
          entitle: '内贸应付',
          subs: [
            {
              title: '应付账款',
              entitle: '财务报表/应付账款',
              page: 'FinanceReport/OutCompany/OutCompany',
            },
            {
              title: '应付月度对账单',
              entitle: '财务报表/应付月度对账单',
              page: 'FinanceReport/OutBalance/OutBalance',
            },
          ],
        }, {
          icon: '/image/icon_component_HL.png',
          title: '其他',
          entitle: '其他',
          subs: [
            {
              title: '综述',
              entitle: '财务报表/综述',
              page: 'FinanceReport/SumUp/SumUp',
            },
          ],
        },
      ],
    },
    login: {
      username: "",
      code_login: "",
      url: ""
    },
  },
  onLoad(e) {
    var t = this;
    //判定是否登录
    dd.getStorage({
      key: 'login',
      success: function (res) {
        t.setData({ login: res.data });
        //载入等待
        dd.showLoading({
          content: '加载中...',
          delay: '1000',
        });
        //载入列表
        dd.httpRequest({
          url: t.data.login.url,
          method: 'POST',
          data: {
            username: t.data.login.username,
            code_login: t.data.login.code_login,
            name_proj: "ZhengDaFinance",
            name_space: "Purview.MenuLeft.HideMenuDing"
          },
          dataType: 'json',
          success: (res2) => {
            var d_1 = res2.data.json_ar_0;
            var d_2 = t.data.arr.list;
            for (var i = d_2.length - 1; i > -1; i--) {
              for (var j = d_2[i].subs.length - 1; j > -1; j--) {
                for (var k = 0; k < d_1.length; k++) {
                  if (d_1[k].entitle == d_2[i].subs[j].entitle) {
                    d_2[i].subs.splice(j, 1);
                    break;
                  }
                }
              }
            }
            for (var i = d_2.length - 1; i > -1; i--) {
              if (d_2[i].subs.length == 0) d_2.splice(i, 1);
            }
            /*for (var i = 0; i < d_1.length; i++) {
              for (var j = 0; j < d_2.length; j++) {
                if (d_2[j].entitle == d_1[i].entitle) {
                  d_2.splice(j, 1);
                  break;
                }
              }
            }*/
            t.setData({ "arr.list": [] });
            t.setData({ "arr.list": d_2 });
          },
          fail: (res2) => {
            dd.alert({ content: "196" + JSON.stringify(res2) });
          },
          complete: (res2) => {
            dd.hideLoading();
          },
        });
      }
    });
  },
  onGridItemTap(e) {
    const curIndex = e.currentTarget.dataset.index;
    const childList = this.data.arr.list[curIndex];
    if (childList.subs) {
      this.setData({
        hidden: !this.data.hidden,
        curIndex,
      });
      this.createMaskShowAnim();
      this.createContentShowAnim();
    } else {
      this.onChildItemTap({
        currentTarget: {
          dataset: { page: childList.page },
        },
      });
    }
  },
  onChildItemTap(e) {
    const { page } = e.currentTarget.dataset;
    dd.navigateTo({
      url: `${page}`,
    });
  },
  onModalCloseTap() {
    this.createMaskHideAnim();
    this.createContentHideAnim();
    setTimeout(() => {
      this.setData({
        hidden: true,
      });
    }, 210);
  },
});
