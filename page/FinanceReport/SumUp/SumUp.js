import list from '/page/biz/components/list';

Page({
  ...list,
  data: {
    listData: {
      //onItemTap: 'handleListItemTap',
      //header: 'list1',
      data: []
    },
    login: {
      username: "",
      code_login: "",
      url: ""
    },
    date_1: '',
    date_2: '',
  },
  newdate_1() {
    var t = this;
    dd.datePicker({
      currentDate: t.data.date_1,
      startDate: '2020-1-1',
      endDate: '2030-1-1',
      success: (res) => {
        t.setData({ "date_1": res.date });
        t.onLoad();
      },
    });
  },
  newdate_2() {
    var t = this;
    dd.datePicker({
      currentDate: t.data.date_2,
      startDate: '2020-1-1',
      endDate: '2030-1-1',
      success: (res) => {
        t.setData({ "date_2": res.date });
        t.onLoad();
      },
    });
  },
  onShow() {
    var t = this;
    dd.getStorage({
      key: 'is_on_show_refresh',
      success: function (res) {
        if (res.data) {
          dd.setStorage({ key: 'is_on_show_refresh', data: false });
          t.onLoad();
        }
      }
    });
  },
  addList(d_2, caption, qty) {
    var title_1 = '[' + caption + ']' + qty;
    var dd_2 = {
      title: title_1
      , thumb: "https://zos.alipayobjects.com/rmsportal/NTuILTPhmSpJdydEVwoO.png"
      //, extra: "查看详情"
      , textMode: "wrap"
      , no_ls: caption
      , title_2: title_1
    };
    d_2.push(dd_2);
  },
  onLoad() {
    var t = this;
    if (t.data.date_1 == '') {
      var now = new Date();
      t.setData({ "date_1": now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + (now.getDate()) });
      t.setData({ "date_2": t.data.date_1 });
    }
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
            date_start: t.data.date_1,
            date_end: t.data.date_2 + " 23:59:59",
            name_space: "FinanceReport.SumUp.BindinggroupControl2"
          },
          dataType: 'json',
          success: (res2) => {
            //dd.alert({content: "51" + JSON.stringify(res2.data)});
            var d_1 = res2.data.json_ar_0;
            var d_2 = [];
            var d = d_1[0];
            t.addList(d_2, "外贸应收单数", d.qty_external_invoice_in);
            t.addList(d_2, "外贸应收金额", d.amount_external_invoice_in);
            t.addList(d_2, "外贸收款单数", d.qty_external_in);
            t.addList(d_2, "外贸收款金额", d.amount_external_in);

            t.addList(d_2, "外贸应付单数", d.qty_external_invoice_out);
            t.addList(d_2, "外贸应付金额", d.amount_external_invoice_out);
            t.addList(d_2, "外贸付款单数", d.qty_external_out);
            t.addList(d_2, "外贸付款金额", d.amount_external_out);

            t.addList(d_2, "内贸应收单数", d.qty_in_need);
            t.addList(d_2, "内贸应收金额", d.amount_in_need);
            t.addList(d_2, "收款发票单数", d.qty_invoice_in);
            t.addList(d_2, "收款发票金额", d.amount_invoice_in);
            t.addList(d_2, "内贸收款单数", d.qty_in);
            t.addList(d_2, "内贸收款金额", d.amount_in);

            t.addList(d_2, "内贸应付单数", d.qty_invoice_out);
            t.addList(d_2, "内贸应付金额", d.amount_invoice_out);
            t.addList(d_2, "内贸应付单数", d.qty_out);
            t.addList(d_2, "内贸应付金额", d.amount_out);

            t.setData({ "listData.data": d_2 });
          },
          fail: (res2) => {
            dd.alert({ content: JSON.stringify(res2) });
          },
          complete: (res2) => {
            dd.hideLoading();
          },
        });
      }
    });
  }
})