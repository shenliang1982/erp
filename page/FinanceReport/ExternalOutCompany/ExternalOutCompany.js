import list from '/page/biz/components/list';

Page({
  ...list,
  data: {
    listData: {
      onItemTap: 'handleListItemTap',
      //header: 'list1',
      data: []
    },
    login: {
      username: "",
      code_login: "",
      url: ""
    },
    date_1: '',
    no_money_title_1: '1-001',
    name_money_title_1: '英帛尔'
  },
  select_item(name_space, name_col_no, name_col_name) {
    var t = this;
    //载入列表
    dd.httpRequest({
      url: t.data.login.url + "ActBack.ashx",
      method: 'POST',
      data: {
        username: t.data.login.username,
        code_login: t.data.login.code_login,
        name_space: name_space
      },
      dataType: 'json',
      success: (res2) => {
        if (res2.data.error != "") dd.alert({ content: res2.data.error });
        var d_1 = res2.data.json_ar_0;
        var d_2 = [];
        for (var i = 0; i < d_1.length; i++) {
          var d = d_1[i];
          d_2.push(d[name_col_name]);
        }

        dd.showActionSheet({
          title: "选择",
          items: d_2,
          //cancelButtonText: '取消',
          success: (res) => {
            t.setData({ [name_col_no]: d_1[res.index].no_ls });
            t.setData({ [name_col_name]: d_1[res.index][name_col_name] });
            t.onLoad();
          },
        });
      },
      fail: (res2) => {
        dd.alert({ content: JSON.stringify(res2) });
      },
      complete: (res2) => {
        dd.hideLoading();
      },
    });
  },
  select_title() {
    var t = this;
    t.select_item("FinanceReport.ExternalOutCompany.AlxpanelControl2name_money_title_1"
      , "no_money_title_1", "name_money_title_1");
  },
  newdate_1() {
    var t = this;
    dd.datePicker({
      format: 'yyyy-MM',
      currentDate: t.data.date_1,
      startDate: '2020-1-1',
      endDate: '2030-1-1',
      success: (res) => {
        t.setData({ "date_1": res.date });
        t.onLoad();
      },
    });
  },
  handleListItemTap(e) {
    var t = this;
    var d = this.data.listData.data[e.currentTarget.dataset.index];
    dd.navigateTo({
      url: '../ExternalOutBalance/ExternalOutBalance?no_company=' + d.no_company 
      + "&name_company=" + d.name_company
      + "&no_money_title_1=" + t.data.no_money_title_1 
      + "&name_money_title_1=" + t.data.name_money_title_1 
      + "&date_1=" + t.data.date_1
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
  onLoad() {
    var t = this;
    if (t.data.date_1 == '') {
      var now = new Date();
      t.setData({ "date_1": now.getFullYear() + "-" + (now.getMonth() + 1) });
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
          url: t.data.login.url + "ActBack.ashx",
          method: 'POST',
          data: {
            username: t.data.login.username,
            code_login: t.data.login.code_login,
            date_start: t.data.date_1 + "-01",
            no_money_title_1: t.data.no_money_title_1,
            name_space: "FinanceReport.ExternalOutCompany.BindinggridControl1"
          },
          dataType: 'json',
          success: (res2) => {
            if (res2.data.error != "") dd.alert({ content: res2.data.error });
            var d_1 = res2.data.json_ar_0;
            var d_2 = [];
            for (var i = 0; i < d_1.length; i++) {
              var d = d_1[i];
              var title_1 = "";
              title_1 += "[客户]" + d.name_company;
              title_1 += "\n[上期]" + d.amount_left_old;
              title_1 += "\n[应付]" + d.amount_out_need;
              title_1 += "\n[付款]" + d.amount_out;
              title_1 += "\n[余额]" + d.amount_left_new;
              var title_2 = "";

              var dd_2 = {
                title: title_1
                , thumb: "https://zos.alipayobjects.com/rmsportal/NTuILTPhmSpJdydEVwoO.png"
                //, extra: "查看详情"
                , textMode: "wrap"
                , no_company: d.no_company
                , name_company: d.name_company
                , title_2: title_2
              };
              d_2.push(dd_2);
            }
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