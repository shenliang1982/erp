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
    no_money_title_1: '',
    name_money_title_1: '抬头'
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
  select_title() {
    var t = this;
    t.select_item("FinanceReport.SellYearExternal.AlxpanelControl2name_money_title_1"
    , "no_money_title_1", "name_money_title_1");
  },
  newdate_1() {
    var t = this;
    dd.datePicker({
      format: 'yyyy',
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
    if(t.data.date_1 == ''){
      var now = new Date();
      t.setData({ "date_1": now.getFullYear() });
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
            date_start: t.data.date_1 + "-01-01",
            no_money_title_1: t.data.no_money_title_1,
            name_space: "FinanceReport.SellYearExternal.BindinggridControl1"
          },
          dataType: 'json',
          success: (res2) => {
            //dd.alert({content: "51" + JSON.stringify(res2.data)});
            var d_1 = res2.data.json_ar_0;
            var d_2 = [];
            for (var i = 0; i < d_1.length; i++) {
              var d = d_1[i];
              var title_1 = "";
              title_1 += "[名称]" + d.name_task;
              title_1 += "\n[截止]" + d.date_end;
              title_1 += "\n[地点]" + d.addr;
              var title_2 = "";
              if (d.name_task != "") title_2 += " [名称]" + d.name_task;
              if (d.date_end != "") title_2 += " [截止]" + d.date_end;
              if (d.addr != "") title_2 += " [地点]" + d.addr;
              if (d.name_task_flow != "") title_2 += " [流程]" + d.name_task_flow;
              if (d.name_project != "") title_2 += " [项目]" + d.name_project;
              if (d.qty_reward != "") title_2 += " [积分]" + d.qty_reward;
              if (d.remark_task != "") title_2 += " [备注]" + d.remark_task;

              var dd_2 = {
                title: title_1
                , thumb: "https://zos.alipayobjects.com/rmsportal/NTuILTPhmSpJdydEVwoO.png"
                //, extra: "查看详情"
                , textMode: "wrap"
                , no_ls: d.no_ls
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