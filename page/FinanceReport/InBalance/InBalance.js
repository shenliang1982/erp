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
    no_company: '',
    name_company: '客户'
  },
  select_item(name_space, name_col_no, name_col_name) {
    var t = this;
    //载入列表
    dd.httpRequest({
      url: t.data.login.url,
      method: 'POST',
      data: {
        username: t.data.login.username,
        code_login: t.data.login.code_login,
        name_space: name_space
      },
      dataType: 'json',
      success: (res2) => {
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
  select_company() {
    var t = this;
    t.select_item("FinanceReport.InBalance.AlxpanelControl2name_company"
    , "no_company", "name_company");
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
    dd.showActionSheet({
      title: d.title_2,
      items: ['完成', '达成', '放弃', '搁置'],
      //cancelButtonText: '取消',
      success: (res) => {
        if (res.index == 0) {
          //提交
          dd.httpRequest({
            url: t.data.login.url,
            method: 'POST',
            data: {
              username: t.data.login.username,
              code_login: t.data.login.code_login,
              no_ls: d.no_ls,
              name_space: "ProjectLinkUse.TaskListAct.FastYes"
            },
            dataType: 'json',
            success: (res2) => {
              t.onLoad();
            },
            fail: (res2) => {
              dd.alert({content: JSON.stringify(res2)});
            },
            complete: (res2) => {
              dd.hideLoading();
            },
          });
        }
        else if (res.index == 1) {
          dd.navigateTo({
            url: '../TaskAnswerYes/TaskAnswerYes?no_ls=' + d.no_ls
          });
        }
        else if (res.index == 2) {
          dd.navigateTo({
            url: '../TaskAnswerYes/TaskAnswerNo?no_ls=' + d.no_ls
          });
        }
        else if (res.index == 3) {
          dd.navigateTo({
            url: '../TaskAnswerYes/TaskAnswerNext?no_ls=' + d.no_ls
          });
        }
      },
    });
  },
  onShow() {
    var t = this;
    dd.getStorage({
      key: 'is_on_show_refresh',
      success: function(res) {
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
      if (e == null || e.date_1 == null) {
        var now = new Date();
        t.setData({ "date_1": now.getFullYear() + "-" + (now.getMonth() + 1) });
      }
      else {
        t.setData({ "date_1": e.date_1 });
        t.setData({ "no_company": e.no_company });
        t.setData({ "name_company": e.name_company });
      }
    }
    //判定是否登录
    dd.getStorage({
      key: 'login',
      success: function(res) {
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
            date_start: t.data.date_1 + "-01",
            no_company: t.data.no_company,
            name_space: "FinanceReport.InBalance.BindinggridControl1"
          },
          dataType: 'json',
          success: (res2) => {
            //dd.alert({content: "51" + JSON.stringify(res2.data)});
            var d_1 = res2.data.json_ar_0;
            var d_2 = [];
            for (var i = 0; i < d_1.length; i++) {
              var d = d_1[i];
              var title_1 = "";
              title_1 += "[日期]" + d.date_act;
              title_1 += "\n[应收]" + d.amount_in_need;
              title_1 += "\n[收款]" + d.amount_in;
              title_1 += "\n[余额]" + d.amount_left;
              var title_2 = "";

              var dd_2 = {
                title: title_1
                , thumb: "https://zos.alipayobjects.com/rmsportal/NTuILTPhmSpJdydEVwoO.png"
                //, extra: "查看详情"
                , textMode: "wrap"
                , title_2: title_2
              };
              d_2.push(dd_2);
            }
            t.setData({ "listData.data": d_2 });
          },
          fail: (res2) => {
            dd.alert({content: JSON.stringify(res2)});
          },
          complete: (res2) => {
            dd.hideLoading();
          },
        });
      }
    });
  }
})