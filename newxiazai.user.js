// ==UserScript==
// @name        newxiazai
// @namespace   lee.LixianExporter
// @description 为了修复原先和noscript插件不兼容
// @include     http://lixian.qq.com/main.html*
// @include     http://dynamic.cloud.vip.xunlei.com/user_task?*
// @include     http://61.147.76.6/iplay.html?*
// @include     http://222.141.53.5/iplay.html?*
// @include     http://fenxiang.qq.com/x/*
// @version     0.1
// ==/UserScript==
if (location.host == "fenxiang.qq.com") {
  //script.src = "https://raw.github.com/chztv/QQFXExporter/master/QQFXExporter.js";
  //保存按钮
$('.setting_button').live("click",function(){		    
	//获取选择的列表
	TLE.setConfig("QQ_aria2_jsonrpc", $("#QQ_aria2_jsonrpc").val());
	XF.widget.msgbox.show("设置成功!"+TLE.getConfig("QQ_aria2_jsonrpc"),2,2000);
} );

var TLE = TLE || {};

(function(TLE,exports) {

  function init() {
  	//$(".com_down").html('<dl><dt><a id="btn_normal" class="btn_normal" hidefocus="true" href="javascript:;"></a></dt><dd><a id="btn_normal2" class="btn_normal2" hidefocus="true" href="javascript:;">使用Aria2下载</a></dd></dl>');
  	$(".high_down").html('<dl><dt><a id="btn_aria2" class="btn_aria2" hidefocus="true" href="javascript:;"></a></dt><dd style="color:red"><a href="https://github.com/chztv/QQFXExporter" target="_blank">Aria2高速下载</a></dd></dl>');
  	$(".down_xf").html('<a id="btn_aria2" class="btn_aria2" hidefocus="true" href="javascript:;"></a>');
    //css
    $("head").append('<style>'
          +'.btn_aria2 {background:url("https://raw.github.com/chztv/QQFXExporter/master/images/aria2_btn.png") no-repeat left top; width:112px; height: 34px;display: block;float: left;}'
          +'.TLE_getbtn {position: absolute; top:24px; left:0; border:1px #6FB2F3 solid; background:#fff; width:115px;-moz-border-radius:3px;-webkit-border-radius:3px;border-radius:3px;-moz-box-shadow:2px 2px 3px #ddd;-webkit-box-shadow:2px 2px 3px #ddd;}'
          +'.TLE_getbtn a {display:block; height:22px; line-height:22px; padding-left:18px}'
          +'.TLE_getbtn a:hover {background:#E4EFF9 url(http://cloud.vip.xunlei.com/190/img/ic_dianbo.png) no-repeat 8px 8px; *background-position:8px 6px ; text-decoration:none}'
          +'.TLE_get_btnbox .TLE_getlink {width:98px; height:22px; float:left; line-height:21px;*line-height:24px;display:block;color:#000000; margin-right:5px; overflow:hidden;background:url(http://cloud.vip.xunlei.com/190/img/bg_btnall.png?197) no-repeat  0 -390px}'
          +'.TLE_get_btnbox .TLE_link_gettxt {float:left; display: inline ; width:53px; text-align:center; padding-left:24px; color:#000}'
          +'.TLE_get_btnbox .TLE_link_gettxt:hover {text-decoration:none}'
          +'.rwbox .rwset .TLE_link_getic {float:left; display:block; width:20px;height:22px;}'
          +'.TLE_hiden {display: none; }'
          +'.TLE_down_btn {background: url(http://cloud.vip.xunlei.com/190/img/lx/bg_rpx.png) no-repeat 0 999em; display: block; float: left; margin: 0 1px; overflow: hidden; color: white; height: 28px; padding-left: 8px; background-position: 0 -60px; text-decoration: none; }'
          +'.TLE_down_btn span {background: url(http://cloud.vip.xunlei.com/190/img/lx/bg_rpx.png) no-repeat 0 999em; display: block; float: left; height: 28px; line-height: 27px; cursor: pointer; padding-right: 8px; background-position:100% -60px; }'
          +'.TLE_down_btn:active {background-position:0 -28px; }'
          +'.TLE_down_btn:active span {background-position:right -28px;}'
          +'.TLE_icdwlocal { padding-left: 20px; display: inline-block; background: url(http://cloud.vip.xunlei.com/190/img/lx/bg_menu.png) no-repeat 0 999em; background-position: 0 -108px; }'

          +'.rwbtn.ic_redownloca { display: none !important; }'
          +'.menu { width: 700px !important; }'
        +'</style>');

    //setting
    TLE.getConfig = function(key) {
      if (window.localStorage) {
        return window.localStorage.getItem(key) || "";
      } else {
        return getCookie(key);
      }
    };
    TLE.setConfig = function(key, value) {
      if (window.localStorage) {
        window.localStorage.setItem(key, value);
      } else {
        setGdCookie(key, value, 86400*365);
      }
    };
    //set default config
    if(TLE.getConfig("QQ_aria2_jsonrpc")){
		var jsonrpc_path = TLE.getConfig("QQ_aria2_jsonrpc");
	} else {
		var jsonrpc_path = "http://192.168.1.8:6800/jsonrpc";
	};
    //jsonrpc设置span
    $("label.check_all_text").after('<span style="height:35px;line-height:35px;padding-left:10px;">jsonrpc-Path:<input type="text" id="QQ_aria2_jsonrpc" style="width: 200px" value="'+jsonrpc_path+'"/>  <a href="javascript:;" hidefocus="true" class="setting_button" id="setting_button" title="保存设置" style="color:#666">保存</a></span>');

	//普通下载按钮
	$('.btn_aria2').live("click",function(){		    
	//获取选择的列表
	    var checked_list=$(".file_list_checkbox:checked");
		if(checked_list.size()>0){
			checked_list.each(function(){
		      //var filename=checked_list.eq(0).parent().next().find("a").attr("title");
		      //var filehash=checked_list.eq(0).parent().next().find("a").attr("filehash");
		      var filename=$(this).parent().next().find("a").attr("title");
		      var filehash=$(this).parent().next().find("a").attr("filehash");
		      //开始统计
			  stat("NORMAL_DOWN\t" + filehash);
			  start_normal_down_paul(filename,filehash);
			});
		}else{
		    XF.widget.msgbox.show("您还没选择文件呢!",2,2000);
		}
	} );
	//QQ旋风下载链接获取并转推至aria2-jsonrpc
	function start_normal_down_paul(filename,filehash){
	$.ajax({
			type: "POST",
			url:API_URL.handler_url+"/getComUrl",
			cache: false,
			data:{"filename":filename,"filehash":filehash},
			timeout:3000,
			dataType: "json",
			success:function(data){
			  if(data&&data.ret==0){
				 $.cookie('FTN5K',data.data.com_cookie,{path:"/",domain:"qq.com"});
				 //window.location=data.data.com_url;
				 //显示Aria2c下载命令
				 //alert( "aria2c -c -s10 -x10 --out "+filename+" --header 'Cookie: FTN5K="+data.data.com_cookie+";' '"+data.data.com_url+"'\n");				
					if (jsonrpc_path) {
					  alert("添加中...到YAAW界面查看是否添加成功");
					  $.getScript("https://raw.github.com/gist/3116833/aria2jsonrpc.js", function() {
					  	jsonrpc_path = $("#QQ_aria2_jsonrpc").val();
						var aria2 = new ARIA2(jsonrpc_path);
						aria2.addUri(data.data.com_url, {out: filename, header: 'Cookie: FTN5K='+data.data.com_cookie});
					  });

					} else {
					  alert("尚未设置Aria2 JSONRPC地址");
					};
			  }
			 },
			error:function(){
				  XF.widget.msgbox.show("获取普通下载链失败,请重试!",2,2000);
				 }
	});
	}	
		
    //close menu binding
    $(document.body).bind("click",function(){
      $("div.TLE_p_getbtn, #TLE_batch_getbtn, #TLE_bt_getbtn").hide();
    });
    $("div.rw_list").click(function(e){
      $("div.TLE_p_getbtn, #TLE_batch_getbtn, #TLE_bt_getbtn").hide();
    });
    $("div.TLE_get_btnbox").click(function(e){e.stopPropagation();});
  };
  init();
  exports.TLE=TLE;
})(TLE,window);
} else if (location.host == "lixian.qq.com") {
	console.log('dddd')
 function contentEval(source) {
    // Check for function input.
    if ('function' == typeof source) {
        // Execute this function with no arguments, by adding parentheses.
        // One set around the function, required for valid syntax, and a
        // second empty set calls the surrounded function.
        source = '(' + source + ')();'
    }

    // Create a script node holding this  source code.
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = source;

    // Insert the script node into the page, so it will run, and immediately
    // remove it to clean up.
    document.body.appendChild(script);
    document.body.removeChild(script);
}

contentEval(function () {
    jQuery("#share_opt").html('<progress id="re-pro" value=0></progress>');
    jQuery("#down_box").remove();
    jQuery(".mod_copyright").remove();
    jQuery(".top").remove();
    jQuery(".search_box").remove();

    jQuery("#task_dl_local em").html("Aria2导出");
    jQuery("#task_share_multi em").html('一键RPC');
});
contentEval(function () {
    EF = {};
    var task_info = [];
    var mode = 1;
    var t_count = 0;
    EF.get_url = function (code) {
        jQuery.ajax({
            type: "post",
            url: "/handler/lixian/get_http_url.php",
            data: code,
            cache: false,
            timeout: 10000,
            dataType: "json",
            async: true, //TvT
            success: function (data) {
                if (data && data.ret == 0) {
                    var url = data["data"];
                    var temp_json = { "name": code.filename, "url": url.com_url, "cookie": url.com_cookie };
                    task_info.push(temp_json);
                    EF.task_check();
                }
                else {
                    XF.widget.msgbox.show("请求url失败", 2, 2000);
                    t_count--;
                    EF.task_check();
                }
            },
            error: function () {
                XF.widget.msgbox.show("请求url失败", 2, 2000);
                t_count--;
                EF.task_check();
            }
        });
    }
    EF.task_check =  function(){
        var count = task_info.length;
        jQuery('#re-pro').attr('max',t_count).attr('value',count);
        if(count == t_count){
            if(mode === 1){
                EF.init_pop();
            }else if(mode === 2){
                EF.rpc();
            }
            t_count = 0; //re
            jQuery('#re-pro').attr('value',0);
        }else{
            return false;
        }
    }
    EF.rpc = function (data) {
        var data = task_info;
        var url = jQuery("#rpc-url").val();
        if(url == undefined){
            url = localStorage.rpc;
        }else{
            localStorage.rpc = url;
        }
        var count = data.length;
        for (var i=0;i<count;i++) {
            var tmp = data[i];
            var uri = { 'jsonrpc': '2.0', 'id': (new Date()).getTime().toString(), 'method': 'aria2.addUri', 'params': [[tmp.url, ], { 'out': tmp.name, 'header': 'Cookie: FTN5K=' + tmp.cookie}] }; /*,'split':'10','continue':'true','max-conection-per-server':'5','parameterized-uri':'true'}]};*/
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url + "?tm=" + (new Date()).getTime().toString(), true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            xhr.send(JSON.stringify(uri));
        }
        XF.widget.msgbox.hide();
        XF.widget.msgbox.show("任务已经添加至aria2-rpc,请自行查看", 0, 1000, false)
    }
    EF.get_rpc = function(){
        if(localStorage.rpc)
            return localStorage.rpc;
        else
            return 'http://localhost:6800/jsonrpc';
    }
    EF.init_pop = function () {
        var html = '<div class="choose_start" style="height:150px;">'+
        '<p>运行<code>aria2c -c -s10 -x10 -i file</code>使用下载文件</p>'+
        '<div>'+
        '<select id="choose" style="background:rgba(255,255,255,0.5);"><option value=1>aria2文件</option><option value=2>aria2命令</option><option value=3>wget命令</option></select>'+
        '---><a id="save-as" style="color:red" href="data:text/html;charset=utf-8,' + encodeURIComponent(EF.create_data('1')) + '" target="_blank" title="右键另存为" download="test"><span><em>导出(另存为或者点击)</span></em></a>'+
        '</div>'+
        '<div style="margin-top: 20px;">'+
        '<p>后台运行<code>aria2c -c -s10 -x10 --enable-rpc</code>即可直接使用RPC按钮增加任务</p>'+
        '<div><input id="rpc-url" type="text" style="width:200px;background:rgba(0,0,0,0);" value="'+EF.get_rpc()+'"></input></div><div id="rpc" class="com_opt_btn"><span><em>RPC</em></span></div>'+
        '</div>'+
        '</div>';
        jQuery("#choose_files_table").html(html);
        window.choose_download_files = new xfDialog("choose_download_files");
        XF.widget.msgbox.hide();
        choose_download_files.show();
        jQuery(".com_win_head_wrap em").html("导出");
        jQuery(".opt").hide();

        jQuery("#rpc").bind("click", function () {
            EF.rpc();
        });
        var choose = jQuery("#choose");
        choose.bind("change", function () {
            var data = EF.create_data(choose.val());
            var href = "data:text/html;charset=utf-8," + encodeURIComponent(data);
            jQuery("#save-as").attr("href", href);
        });
        jQuery("#choose_download_files .close_win").bind("click", function () {
            jQuery(".com_win_head_wrap em").html("下载任务");
            jQuery(".opt").show();
        });
    }

    EF.create_data = function (value) {
        var url = task_info;
        var html = '';
        var count = url.length;
        for (var i=0;i<count;i++) {
            var data = url[i];
            var cookie = data.cookie;
            var http = data.url;
            var name = data.name;
            switch (value) {
                case '1':
                    html += http + "\n  header=Cookie: FTN5K=" + cookie + "\n"+
                    "  out=" + name + "\n" +
                    "  continue=true\n";
                    //html += "  parameterized-uri=true\n";
                    //html += "  max-conection-per-server=5\n";
                    //html += "  split=10\n"; //谁能告诉我为什么这个设置了完全无效？？？？
                    break;
                case '2':
                    html += "aria2c -c -s10 -x10 -o '" + name + "' --header 'Cookie: FTN5K=" + cookie + "' " + http + "\n";
                    break;
                case '3':
                    html += "wget -c -O " + name + "--header Cookie:FTN5K=" + cookie + " " + http + "\n";
                    break;
                defalut:
                    break;
            }
        }
        return html
    }
    EF.get_choice = function(){
        var dl_tasks = [];
        var tmp_taskid_str = '';
        var tasks_count = 0;
        for (var task_id in g_task_op.last_task_info) {
            var tmp_obj = g_task_op.last_task_info[task_id];

            if (check_failed_task(task_id)) continue;
            var checkbox_elem = $('task_sel_' + task_id);
            if (checkbox_elem && !checkbox_elem.checked) continue;
            if (tmp_obj == null || tmp_obj.file_size != tmp_obj.comp_size) continue;
            if (tmp_obj.dl_status != TASK_STATUS['ST_UL_OK']) continue;

            var json_temp = { "filename": tmp_obj.file_name, "hash": tmp_obj.code, "browser": "other" };
            dl_tasks.push(json_temp);
            tmp_taskid_str = task_id;
            tasks_count++;
        }
        if(tasks_count == 0){
            return false;
        }else{
            return dl_tasks;
        }
    }
    EF.hander_tasks = function(){
        task_info = [];
        var data = EF.get_choice();
        console.log(data);
        t_count = data.length;
        for (var i=0;i<t_count;i++) {
            EF.get_url(data[i]);
        }
    }
    EventHandler.task_batch2local = function (e) {
        var disabled = jQuery(e).hasClass("disabled_btn");
        if (disabled) {
            return false;
        }
        XF.widget.msgbox.show("后台开始请求下载连接...", 0, 1000, false);
        EF.hander_tasks();
        mode = 1;
    }
    EventHandler.task_share = function(e){
        var disabled = jQuery(e).hasClass("disabled_btn");
        if (disabled) {
            return false;
        }
        XF.widget.msgbox.show('后台添加任务中', 0, 1000, false);
        EF.hander_tasks();
        mode = 2;
    }
});
} else if (location.host == "dynamic.cloud.vip.xunlei.com") {

var TLE = TLE || {};

TLE.exporter = {
  '复制链接': function(todown) {
    //console.log(todown);
    var str = '<ul style="max-height: 300px; overflow-y: scroll; overflow-x: hidden;">';
    $.each(todown.tasklist, function(n, task) {
      $.each(task.filelist, function(l, file) {
        if (file.downurl) str += '<li><a href="'+TLE.url_rewrite(file.downurl, file.title)+'" target="_blank">'+file.title+'</a></li>';
      });
    });
    str += "</ul>";
    $("#TLE_text_pop").tpl("TLE_text_tpl", {'title': '复制选中的链接', 'content': str}).show().pop({
      onHide: function() { $(document.body).click(); },
    });
  },
  'Aria2': function(todown) {
    //console.log(todown);
    var str = "";
    $.each(todown.tasklist, function(n, task) {
      $.each(task.filelist, function(l, file) {
        if (file.downurl) str += "aria2c -c -s10 -x10 --out "+TLE.escape_command(file.title)+" --header 'Cookie: gdriveid="+todown.gdriveid+";' '"+file.downurl+"'\n"; 
      });
    });
    TLE.text_pop("aria2 download command", str);
  },
  'wget': function(todown) {
    //console.log(todown);
    var str = "";
    $.each(todown.tasklist, function(n, task) {
      $.each(task.filelist, function(l, file) {
        if (file.downurl) str += "wget -c -O "+TLE.escape_command(file.title)+" --header 'Cookie: gdriveid="+todown.gdriveid+";' '"+file.downurl+"'\n";
      });
    });
    TLE.text_pop("wget download command", str);
  },
  "YAAW": function(todown) {
    if (TLE.getConfig("TLE_aria2_jsonrpc")) {
      show_tip("添加中...到YAAW界面查看是否添加成功");
      var aria2 = new ARIA2(TLE.getConfig("TLE_aria2_jsonrpc"));
      $.each(todown.tasklist, function(n, task) {
        $.each(task.filelist, function(l, file) {
          aria2.addUri(file.downurl, {out: file.title, header: 'Cookie: gdriveid='+todown.gdriveid});
        });
      });
      hide_tip();
    } else {
      show_tip("尚未设置Aria2 JSONRPC地址");
      hide_tip();
    };
  },
  'Aria2导出': function(todown) {
    //console.log(todown);
    var str = "";
    $.each(todown.tasklist, function(n, task) {
      $.each(task.filelist, function(l, file) {
        if (!file.downurl) return;
        str += file.downurl+'\r\n  out='+file.title+'\r\n  header=Cookie: gdriveid='+todown.gdriveid+'\r\n  continue=true\r\n  max-connection-per-server=5\r\n  split=10\r\n  parameterized-uri=true\r\n\r\n';
      });
    });
    TLE.file_pop("Aria2导出文件下载", str, "aria2.down");
  },
  'IDM导出': function(todown) {
    //console.log(todown);
    var str = "";
    $.each(todown.tasklist, function(n, task) {
      $.each(task.filelist, function(l, file) {
        if (!file.downurl) return;
        str += '<\r\n'+TLE.url_rewrite(file.downurl, file.title)+'\r\ncookie: gdriveid='+todown.gdriveid+'\r\n>\r\n'
      });
    });
    TLE.file_pop("IDM导出文件下载", str, "idm.ef2");
  },
  'Orbit导出': function(todown) {
    //console.log(todown);
    var str = "";
    $.each(todown.tasklist, function(n, task) {
      $.each(task.filelist, function(l, file) {
        if (!file.downurl) return;
        str += file.downurl+'|'+file.title.replace("|", "_")+'||gdriveid='+todown.gdriveid+'\r\n'
      });
    });
    TLE.file_pop("Orbit导出文件下载", str, "orbit.olt");
  },
};

(function(TLE,exports) {
  function get_taskinfo(p) {
    var taskid = p.attr("taskid");
    var info = {};
    p.find("input").each(function(n, e) {
      var key = e.getAttribute("id").replace(taskid, "");
      info[key] = e.getAttribute("value");
    });
    return info;
  };

  function build_normal_taskinfo(info) {
    var taskinfo = {
      'taskname': info.taskname,
      'f_url': info.f_url,
      'cid': info.dcid,
      'size': parseInt(info.ysfilesize),
      'tasktype': info.d_tasktype,
      'status': info.d_status,
    };
    var filelist = [];
    filelist.push({
      'title': safe_title(info.taskname),
      'f_url': info.f_url,
      'downurl': info.dl_url,
      'cid': info.dcid,
      'gcid': "",
      'size': parseInt(info.ysfilesize),
    });
    taskinfo['filelist'] = filelist;

    return taskinfo;
  };
  function build_bt_taskinfo(info, rdata) {
    var taskinfo = {
      'taskname': info.taskname,
      'f_url': info.f_url,
      'cid': info.dcid,
      'size': parseInt(info.ysfilesize),
      'tasktype': info.d_tasktype,
      'status': info.d_status,
    };
    var filelist = [];
    $.each(rdata, function(n, e) {
      filelist.push({
        'title': safe_title(e.title),
        'f_url': e.url,
        'downurl': e.downurl,
        'cid': e.cid,
        'gcid': e.gcid,
        'size': parseInt(e.filesize),
      });
    });
    taskinfo['filelist'] = filelist;
    return taskinfo;
  };

  function safe_title(title) {
  return title.replace(/[\\\|\:\*\"\?\<\>]/g,"_");
  };

  TLE.down = function(_this, _do) {
    var p = $(_this).parents(".rw_list");
    var info = get_taskinfo(p);

    if (info.d_tasktype == "0") { //bt task
      show_tip("载入中...");
      $.getJSON(INTERFACE_URL+"/fill_bt_list?tid="+info.input+"&g_net="+G_section+"&uid="+G_USERID+"&callback=?", function(data) {
        hide_tip();
        var todown = {};
        todown.gdriveid = getCookie("gdriveid");
        todown.tasklist = {};
        todown.tasklist[info.input] = build_bt_taskinfo(info, data['Result'][info.input]);
        _do(todown);
      });
    } else {
      var todown = {}
      todown.gdriveid = getCookie("gdriveid");
      todown.tasklist = {};
      todown.tasklist[info.input] = build_normal_taskinfo(info);
      _do(todown);
    };
  };

  TLE.batch_down = function(_this, _do) {
    var ck = document.getElementsByName("ck");
    var bt_task_list = [];
    var normal_task_list = [];
    $.each(ck, function(n, e) {
      if (e.checked == false) return;

      var taskid = e.value;
      var d_status = $("#d_status"+taskid).val();
      var d_tasktype = $("#d_tasktype"+taskid).val();
      var d_flag = $("#dflag"+taskid).val();
      if (d_flag != 4 && d_status == 2) {
        if (d_tasktype == 0) {
          bt_task_list.push(taskid);
        } else {
          normal_task_list.push(taskid);
        };
      };
    });

    if (bt_task_list.length) {
      show_tip("载入中...");
      $.getJSON(INTERFACE_URL+"/fill_bt_list?tid="+bt_task_list.join(",")+"&g_net="+G_section+"&uid="+G_USERID+"&callback=?", function(data) {
        hide_tip();
        var todown = {};
        todown.gdriveid = getCookie("gdriveid");
        todown.tasklist = {};
        $.each(data['Result'], function(n, e) {
          var info = get_taskinfo($("#tr_c"+n));
          todown.tasklist[n] = build_bt_taskinfo(info, e);
        });
        $.each(normal_task_list, function(n, e) {
          var info = get_taskinfo($("#tr_c"+e));
          todown.tasklist[e] = build_normal_taskinfo(info);
        });
        _do(todown);
      });
    } else {
      var todown = {};
      todown.gdriveid = getCookie("gdriveid");
      todown.tasklist = {};
      $.each(normal_task_list, function(n, e) {
        var info = get_taskinfo($("#tr_c"+e));
        todown.tasklist[e] = build_normal_taskinfo(info);
      });
      _do(todown);
    };
  };

  TLE.bt_down = function(_this, _do) {
    var ck = document.getElementsByName("bt_list_ck");
    var files = [];
    $.each(ck, function(n, e) {
      if (e.checked == false) return;
      var fid = e.getAttribute("_i");
      var file = {
        'title': safe_title($("#bt_taskname"+fid).val()),
        'url': $("#bturl"+fid).val(),
        'downurl': $("#btdownurl"+fid).val(),
        'cid': $("#btcid"+fid).val(),
        'gcid': $("#btgcid"+fid).val(),
        'filesize': $("#bt_filesize"+fid).val(),
      };
      files.push(file);
    });
    var taskid = $("#view_bt_taskid").val();
    var info = get_taskinfo($("#tr_c"+taskid));

    var todown = {};
    todown.gdriveid = getCookie("gdriveid");
    todown.tasklist = {};
    todown.tasklist[taskid] = build_bt_taskinfo(info, files);
    //console.log(todown);

    _do(todown);

    //console.log("bt_down");
  };

  TLE.bt_down_one = function(_this, _do) {
    var files = []
    var fid = $(_this).parents(".rw_list").attr("i");
    var file = {
      'title': safe_title($("#bt_taskname"+fid).val()),
      'url': $("#bturl"+fid).val(),
      'downurl': $("#btdownurl"+fid).val(),
      'cid': $("#btcid"+fid).val(),
      'gcid': $("#btgcid"+fid).val(),
      'filesize': $("#bt_filesize"+fid).val(),
    };
    files.push(file);
    var taskid = $("#view_bt_taskid").val();
    var info = get_taskinfo($("#tr_c"+taskid));

    var todown = {};
    todown.gdriveid = getCookie("gdriveid");
    todown.tasklist = {};
    todown.tasklist[taskid] = build_bt_taskinfo(info, files);
    //console.log(todown);

    _do(todown);

    //console.log("bt_down");
  };

  TLE.getbtn = function(_this) {
    $(_this).parents(".TLE_get_btnbox").find(".TLE_p_getbtn").toggle();
    close_rightmenu_layer();
    return false;
  };

  TLE.text_pop = function(title, content) {
    content = $('<div></div>').text(content).html()
    content = '<textarea style="width: 100%; height: 260px;">'+content+'</textarea>'
    $("#TLE_text_pop").tpl("TLE_text_tpl", {'title': title, 'content': content}).show().pop({
      onHide: function() { $(document.body).click(); },
    });
  };
  TLE.file_pop = function(title, content, filename) {
    var url = "data:text/html;charset=utf-8,"+encodeURIComponent(content);
    var content = '<div style="width: 100%; height: 100px;">'
                    +'<div style="padding: 30px 0 0 30%;">'
                      +'<a href="'+url+'" target="_blank" title="右键另存为" class="TLE_down_btn" download="'+filename+'"><span><em class="TLE_icdwlocal">导出文件</em></span></a>'
                      +(isChrome ? '' : '(右键另存为'+filename+')')
                    +'</div>'
                 +'</div>'
    $("#TLE_text_pop").tpl("TLE_text_tpl", {'title': title, 'content': content}).show().pop({
      onHide: function() { $(document.body).click(); },
    });
  };
  TLE.window_pop = function(title, content) {
    $("#TLE_text_pop").tpl("TLE_text_tpl", {'title': title, 'content': content}).show().pop({
      onHide: function() { $(document.body).click(); },
    });
  };

  TLE.multiple_server_fix = function(url) {
    return "'"+url.replace("gdl", "'{gdl,dl.{f,g,h,i,twin}}'")+"'";
  }
  
  function encode_utf8(s) {
    return unescape( encodeURIComponent( s ) );
  };
  function to_hex(num) {
    var s = num.toString(16);
    if (s.length == 1)
      return '0'+s;
    else
      return s;
  };
  var thunder_filename_mask = [0x61, 0x31, 0xe4, 0x5f, 0x00, 0x00, 0x00, 0x00];
  function thunder_filename_encode(filename) {
    var result = ["01", ];
    $.each(encode_utf8(filename), function(i, n) {
      result.push(to_hex(n.charCodeAt(0)^thunder_filename_mask[i%8]).toUpperCase())
    });
    while (result.length % 8 != 1) {
      result.push(to_hex(thunder_filename_mask[(result.length-1)%8]).toUpperCase());
    }
    return result.join("");
  };

  TLE.url_rewrite = function(url, filename) {
    url = url.replace(/&n=\w+/, "&n="+thunder_filename_encode(filename));
    return url;
  };

  var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  TLE.escape_command = function(str) {
    var result = "";
    for (var i = 0; i < str.length; i++) {
      if (alpha.indexOf(str[i]) == -1)
        result += "\\"+str[i];
      else
        result += str[i];
    }
    return result;
  };

  function init() {

    //css
    $("head").append('<style>'
          +'.TLE_get_btnbox {position:relative; float:left; z-index:11}'
          +'.TLE_getbtn {position: absolute; top:24px; left:0; border:1px #6FB2F3 solid; background:#fff; width:115px;-moz-border-radius:3px;-webkit-border-radius:3px;border-radius:3px;-moz-box-shadow:2px 2px 3px #ddd;-webkit-box-shadow:2px 2px 3px #ddd;}'
          +'.TLE_getbtn a {display:block; height:22px; line-height:22px; padding-left:18px}'
          +'.TLE_getbtn a:hover {background:#E4EFF9 url(http://cloud.vip.xunlei.com/190/img/ic_dianbo.png) no-repeat 8px 8px; *background-position:8px 6px ; text-decoration:none}'
          +'.TLE_get_btnbox .TLE_getlink {width:98px; height:22px; float:left; line-height:21px;*line-height:24px;display:block;color:#000000; margin-right:5px; overflow:hidden;background:url(http://cloud.vip.xunlei.com/190/img/bg_btnall.png?197) no-repeat  0 -390px}'
          +'.TLE_get_btnbox .TLE_link_gettxt {float:left; display: inline ; width:53px; text-align:center; padding-left:24px; color:#000}'
          +'.TLE_get_btnbox .TLE_link_gettxt:hover {text-decoration:none}'
          +'.rwbox .rwset .TLE_link_getic {float:left; display:block; width:20px;height:22px;}'
          +'.TLE_hiden {display: none; }'
          +'.TLE_down_btn {background: url(http://cloud.vip.xunlei.com/190/img/lx/bg_rpx.png) no-repeat 0 999em; display: block; float: left; margin: 0 1px; overflow: hidden; color: white; height: 28px; padding-left: 8px; background-position: 0 -60px; text-decoration: none; }'
          +'.TLE_down_btn span {background: url(http://cloud.vip.xunlei.com/190/img/lx/bg_rpx.png) no-repeat 0 999em; display: block; float: left; height: 28px; line-height: 27px; cursor: pointer; padding-right: 8px; background-position:100% -60px; }'
          +'.TLE_down_btn:active {background-position:0 -28px; }'
          +'.TLE_down_btn:active span {background-position:right -28px;}'
          +'.TLE_icdwlocal { padding-left: 20px; display: inline-block; background: url(http://cloud.vip.xunlei.com/190/img/lx/bg_menu.png) no-repeat 0 999em; background-position: 0 -108px; }'

          +'.rwbtn.ic_redownloca { display: none !important; }'
          +'.menu { width: 700px !important; }'
          // for thunder css
          +'.rwset {width:530px;}'
        +'</style>');
    //pop
    $("body").append('<div id="TLE_text_pop" class="pop_rwbox" style="display: none;margin: 0;"></div>');
    $("body").append('<textarea id="TLE_text_tpl" style="display: none;"></textarea>');
    $("#TLE_text_tpl").text('<div class="p_rw_pop">'
                            +'<div class="tt_box onlytitle">'
                              +'<h3>$[title]</h3>'
                            +'</div>'
                            +'<div class="psc_info">'
                              +'$[content]'
                            +'</div>'
                            +'<a href="#" class="close" title="关闭">关闭</a>'
                          +'</div>');
    //setting
    TLE.getConfig = function(key) {
      if (window.localStorage) {
        return window.localStorage.getItem(key) || "";
      } else {
        return getCookie(key);
      }
    };
    TLE.setConfig = function(key, value) {
      if (window.localStorage) {
        window.localStorage.setItem(key, value);
      } else {
        setGdCookie(key, value, 86400*365);
      }
    };
    //set default config
    if (TLE.getConfig("TLE_exporter") == "") {
      var exporters = [];
      for (var key in TLE.exporter) {
        exporters.push(key);
      };
      TLE.setConfig("TLE_exporter", exporters.join("|"));
    };
    $("#setting_main_tpl").text($("#setting_main_tpl").text().replace(/(<\/div>\s+<div class="btnin">)/,
          '<div class="doline mag01"></div>'
            +'<h3 style="background-position: 0 -180px;">Thunder Lixian Exporter 设定</h3>'
            +'<ul>'
              +'<li><b>启用以下导出器</b></li>'
              +'<li>'+(function(){
                var enabled_exporter = TLE.getConfig("TLE_exporter").split("|");
                var str = '';
                for (var name in TLE.exporter) {
                  str += '<span class="rw_col"><input type="checkbox" class="TLE_setting_ck" name="TLE_ck_'+name+'" '+(enabled_exporter.indexOf(name) == -1 ? "" : "checked")+' />'+name+'</span>';
                }
                return str;
              })()+'</li>'
              +'<li><b>Aria2 JSON-RPC Path</b></li>'
              +'<li>Path: <input type="text" id="TLE_aria2_jsonrpc" style="width: 350px" value="'+TLE.getConfig("TLE_aria2_jsonrpc")+'"/></li>'
            +'</ul>'
          +'$1'));
    var _set_notice_submit = set_notice_submit;
    set_notice_submit = function(f) {
      _set_notice_submit(f);
      var enabled_exporter = [];
      $(".TLE_setting_ck").each(function(n, e) {
        if (e.checked) enabled_exporter.push(e.name.replace(/^TLE_ck_/, ""));
      });
      var config_str = (enabled_exporter.length == 0) ? "_" : enabled_exporter.join("|");
      var jsonrpc_path = $("#TLE_aria2_jsonrpc").val();
      if (TLE.getConfig("TLE_exporter") != config_str || TLE.getConfig("TLE_aria2_jsonrpc") != jsonrpc_path) {
        TLE.setConfig("TLE_exporter", config_str);
        TLE.setConfig("TLE_aria2_jsonrpc", jsonrpc_path);
        TS2.show('设置已生效',1);
        setTimeout(function(){
          setting.hide();
          location.reload(true);
        }, 1*1000);
      }
    };

    function exporter_anchors(type) {
      var enabled_exporter = TLE.getConfig("TLE_exporter").split("|");
      var str = '';
      $.each(TLE.exporter, function(n, f) {
        if (enabled_exporter.indexOf(n) == -1) return;
        str+=('<a href="#" title="'+n+'" onmouseover="this.className=\'sel_on\'" onmouseout="this.className=\'\'" onclick="'+type+'(this, TLE.exporter[\''+n+'\'])">'+n+'</a>');
      });
      return str;
    }
    //down
    $(".rwbtn.ic_redownloca").each(function(n, e) {
      $(e).after('<div class="TLE_get_btnbox">'
                  + '<span class="TLE_getlink">'
                    + '<a href="#" class="TLE_link_gettxt TLE-down-text" style="padding-left: 20px; width: 57px;" onclick='+e.getAttribute("onclick")+'>取回本地</a>'
                    + '<a href="#" class="TLE_link_getic TLE-down-btn" onclick="return TLE.getbtn(this);"></a>'
                  + '</span>'
                  + '<div class="TLE_p_getbtn TLE_getbtn" style="display: none;">'
                    + exporter_anchors("TLE.down")
                  + '</div>'
                + '</div>');
    });

    //batch_down
    $("#li_task_down").after('<a href="#" id="TLE_batch_down" title="批量导出" class="btn_m noit"><span><em class="icdwlocal">批量导出</em></span></a>')
                      .parents(".main_link").append(
                            '<div id="TLE_batch_getbtn" class="TLE_getbtn" style="top: 30px; display:none;">'
                            + exporter_anchors("TLE.batch_down")
                          + '</div>');
    var _task_check_click = task_check_click;
    task_check_click = function() {
      _task_check_click();
      if ($("#li_task_down").hasClass("noit")) {
        $("#TLE_batch_down").addClass("noit").unbind("click");
      } else {
        $("#TLE_batch_down").removeClass("noit").unbind("click").click(function() {
          $("#TLE_batch_getbtn").css("left", $("#TLE_batch_down").position().left);
          $("#TLE_batch_getbtn").toggle();
          return false;
        });
      };
      //console.log("task_check_click called");
    };
    $('input[name=ck]').click(task_check_click);

    //bt_down
    $("#view_bt_list_nav_tpl").text($("#view_bt_list_nav_tpl").text().replace('取回本地</em></span></a>',
          '取回本地</em></span></a>'
          +'<a href="#" class="btn_m noit" title="批量导出" id="TLE_bt_down"><span><em class="icdwlocal">批量导出</em></span></a>'
          +'<div id="TLE_bt_getbtn" class="TLE_getbtn" style="top: 30px; display:none;">'
            + exporter_anchors("TLE.bt_down")
          + '</div>'));
    $("#view_bt_list_tpl").text($("#view_bt_list_tpl").text().replace('ic_redownloca" title="">取回本地</a>',
        'ic_redownloca" title="">取回本地</a>'
        +'<div class="TLE_get_btnbox">'
          + '<span class="TLE_getlink">'
            + '<a href="#" class="TLE_link_gettxt TLE-down-text" style="padding-left: 20px; width: 57px;" onclick="thunder_download($[p.i],1);return false;">取回本地</a>'
            + '<a href="#" class="TLE_link_getic TLE-down-btn" onclick="return TLE.getbtn(this);"></a>'
          + '</span>'
          + '<div class="TLE_p_getbtn TLE_getbtn" style="display: none;">'
            + exporter_anchors("TLE.bt_down_one")
          + '</div>'
        + '</div>'));
    var _bt_view_nav = bt_view_nav;
    bt_view_nav = function() {
      _bt_view_nav();
      if ($("#view_bt_list_nav_down").hasClass("noit")) {
        $("#TLE_bt_down").addClass("noit").unbind("click");
      } else {
        $("#TLE_bt_down").removeClass("noit").unbind("click").click(function() {
          $("#TLE_bt_getbtn").css("left", $("#TLE_bt_down").position().left);
          $("#TLE_bt_getbtn").toggle();
          return false;
        });
      };
      $("#TLE_bt_getbtn").hide();
      //console.log("bt_view_nav called");
    };

    //close menu binding
    $(document.body).bind("click",function(){
      $("div.TLE_p_getbtn, #TLE_batch_getbtn, #TLE_bt_getbtn").hide();
    });
    $("div.rw_list").click(function(e){
      $("div.TLE_p_getbtn, #TLE_batch_getbtn, #TLE_bt_getbtn").hide();
    });
    $("div.TLE_get_btnbox").click(function(e){e.stopPropagation();});
  };
  init();
  exports.TLE=TLE;
})(TLE,window);

var ARIA2 = (function() {
  var jsonrpc_version = '2.0';

  function get_auth(url) {
    return url.match(/^(?:(?![^:@]+:[^:@\/]*@)[^:\/?#.]+:)?(?:\/\/)?(?:([^:@]*(?::[^:@]*)?)?@)?/)[1];
  };

  function request(jsonrpc_path, method, params) {
    var request_obj = {
      jsonrpc: jsonrpc_version,
      method: method,
      id: (new Date()).getTime().toString(),
    };
    if (params) request_obj['params'] = params;

    var xhr = new XMLHttpRequest();
    var auth = get_auth(jsonrpc_path);
    xhr.open("POST", jsonrpc_path+"?tm="+(new Date()).getTime().toString(), true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    if (auth) xhr.setRequestHeader("Authorization", "Basic "+btoa(auth));
    xhr.send(JSON.stringify(request_obj));
  };

  return function(jsonrpc_path) {
    this.jsonrpc_path = jsonrpc_path;
    this.addUri = function (uri, options) {
      request(this.jsonrpc_path, 'aria2.addUri', [[uri, ], options]);
    };
    return this;
  }
})();
} else {
 $("#list_nav_parent").after('<a id="TLE_html5_player" class="page_list" href="#" title="HTML5播放">'
                              +'<span>HTML5播放器</span>'
                              +'<span class="p_r"></span>'
                            +'</a>');
$("#TLE_html5_player").click(function() {
  document.cookie = "html5_player=1";
  html5player();
});

function html5player() {
  function play(url) {
    url = url.replace(/&n=\w+/, "&n=08586C0FD0F6390000").replace(/&p=\d+/, "")+"&p=1&xplaybackid=0";
    $("#xl_vod_fx_flash_box").attr("src", url);
    $("#original_url").html('mplayer播放:'+'<input value="'+play_with_mplayer(url)+'" />');
    $("#original_url input").attr("style", "background:#777;border:0;width:400px;");
  }

  $.getJSON('http://i.vod.xunlei.com/req_get_method_vod?jsonp=?', {
    url: XL_CLOUD_FX_INSTANCE.curUrl,
    video_name: XL_CLOUD_FX_INSTANCE.curName,
    platform: 1,
    vip: 1,
    userid: XL_CLOUD_FX_INSTANCE.user.u,
    sessionid: XL_CLOUD_FX_INSTANCE.user.s,
    from: 'vlist',
  }, function(data) {
      var list = data.resp.vodinfo_list
      $("#XL_CLOUD_VOD_PLAYER").empty();
      if (list.length == 0) {
        $("#XL_CLOUD_VOD_PLAYER").append('<img src="http://vod.xunlei.com/img/play_bg.jpg" width="100%" height="100%"><div style="position:absolute;left:0;top:46%;text-align:center;font-size:14px;color:#FFF;margin: 0;width:100%;height:22px;">云点播尚未转码完成。</div>');
        return ;
      };
      $("#mycopyer").hide();
      $("#XL_CLOUD_VOD_PLAYER").append('<video id="xl_vod_fx_flash_box" width="100%" height="94%" style="z-index: 100;" controls="controls" autoplay="true"></video>'
                  +'<div id="xl_button_box" style="width: 100%; height: 6%; line-height: 22px; text-align: right; ">'
                  +'</div>');
      list.forEach(function(n, i) {
        console.log(n);
        var str = "";
        switch(n.spec_id) {
          case 225536:
          case 226048:
            str = "360P";
            break;
          case 282880:
          case 283392:
            str = "480P";
            break;
          case 356608:
          case 357120:
            str = "720P";
            break;
          default:
            str = "不知什么清";
            break;
        };
        $('<button style="margin-right:5px;">'+str+'</button>').appendTo("#xl_button_box").click(function() {
          $("#xl_button_box button").each(function(n, e) {
            e = $(e);
            e.text(e.text().replace("• ", ""));
          });
          var _this = $(this);
          _this.text("• "+_this.text());
          play(n.vod_url); 
        });
      });
  
      var tmp = $("#xl_button_box button:last");
      tmp.text("• "+tmp.text());
      play(list[list.length-1].vod_url);
  })
};

function play_with_mplayer(url) {
  var ismac = (navigator.platform.indexOf("Mac") == 0);
  var userid = url.match(/&ui=(\d+)/)[1];
  if (ismac) {
    return "open -a 'MPlayerX.app' --args -ExtraOptions --http-header-fields 'cookie: user="+userid+"' -url '"+url+"'";
  } else {
    return "mplayer -http-header-fields 'cookie: userid="+userid+"' '"+url+"'\n";
  }
};
}