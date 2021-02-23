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
          title: '采购流程',
          entitle: '采购流程/采购订单',
          page: 'Purchase/PurchaseList/PurchaseList',
          /*subs: [
            {
              title: '采购订单',
              entitle: '采购流程/采购订单',
              page: 'Purchase/PurchaseList/PurchaseList',
            },
          ],*/
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
          url: t.data.login.url + "ActBack.ashx",
          method: 'POST',
          data: {
            username: t.data.login.username,
            code_login: t.data.login.code_login,
            name_proj: "KnyErp",
            name_space: "Purview.MenuLeft.HideMenuDing"
          },
          dataType: 'json',
          success: (res2) => {
            if (res2.data.error != "") dd.alert({ content: res2.data.error });
            var d_1 = res2.data.json_ar_0;
            var d_2 = t.data.arr.list;
            //操作按钮
            for (var i = 0; i < d_1.length; i++) {
              for (var j = 0; j < d_2.length; j++) {
                if (d_2[j].entitle == d_1[i].entitle) {
                  d_2.splice(j, 1);
                  break;
                }
              }
            }
            //菜单按钮
            for (var i = d_2.length - 1; i > -1; i--) {
              if (d_2[i].entitle.indexOf("/") < 0 && d_2[i].subs.length > 0) {
                for (var j = d_2[i].subs.length - 1; j > -1; j--) {
                  for (var k = 0; k < d_1.length; k++) {
                    if (d_1[k].entitle == d_2[i].subs[j].entitle) {
                      d_2[i].subs.splice(j, 1);
                      break;
                    }
                  }
                }
              }
            }
            //没有子按钮的菜单去掉
            for (var i = d_2.length - 1; i > -1; i--) {
              if (d_2[i].entitle.indexOf("/") < 0 && d_2[i].subs.length == 0) d_2.splice(i, 1);
            }
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
