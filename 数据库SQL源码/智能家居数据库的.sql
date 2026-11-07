-- -----------------------------------------------------------------------------
-- 创建数据库
-- -----------------------------------------------------------------------------
CREATE SCHEMA `smarthome` DEFAULT CHARACTER SET utf8mb4 ;


use smarthome;

-- -----------------------------------------------------------------------------
-- 1、用户唯一ID与openid表
-- -----------------------------------------------------------------------------
drop table if exists user_unnid;
create table user_unnid (
  user_id 		    int(11) 	        not null auto_increment    comment '用户id',
  open_id 		    varchar(64) 	    unique  			       comment 'openid',
  session_key		varchar(64) 	    unique   			   	   comment '加密后的session_key',
  on_device         int(11)              	   		   			   comment '用户当前使用设备',  
  on_device_name    varchar(100)         			   			   comment '用户当前使用设备名称',  
  user_nickname     varchar(60)                                    comment '用户昵称',   
  user_head_url     varchar(2083)                                  comment '用户头像地址', 
  create_time 	    timestamp           default current_timestamp  comment '创建时间',
  primary key (user_id),
  unique key (open_id)
) engine=innodb auto_increment=1000 default charset=utf8           comment = '用户唯一ID表';


-- -----------------------------------------------------------------------------
-- 2、设备ID表
-- -----------------------------------------------------------------------------
drop table if exists device_unnid;
create table device_unnid(
  device_id 		    int(11) 	    not null auto_increment    comment '设备id',
  device_name 		    varchar(100) 	default 'ESP32'		       comment '设备名称',
  device_macid 		    varchar(64) 	not null			       comment '设备MacID',
  device_send_topic     varchar(100)    not null                   comment '设备发布的主题',
  device_receive_topic  varchar(100)    not null                   comment '设备接收的主题',
  create_time 	        timestamp       default current_timestamp  comment '创建时间',
  primary key (device_id)
) engine=innodb auto_increment=666 default charset=utf8          comment = 'ESP32设备一ID表';



-- -----------------------------------------------------------------------------
-- 3、设备ID与用户的关系  （多对多：一个用户有多个设备，一个设备可以被多人使用）
-- -----------------------------------------------------------------------------
drop table if exists device_and_user;
create table device_and_user (
  device_and_user_id    bigint(11) 		not null auto_increment    comment '设备与用户关系id',
  device_id 		int(11) 		    not null                   comment '设备id',
  user_id   	    int(11) 		    not null                   comment '用户id',
  user_key          varchar(20)         default "p000000000"       comment '用户对设备的控制权限',
  activation_time 	timestamp           default current_timestamp  comment '设备激活时间',
  primary key (device_and_user_id),
  foreign key(user_id) references user_unnid(user_id),
  foreign key(device_id) references device_unnid(device_id)
) engine=innodb auto_increment=1 default charset=utf8              comment = 'ESP32设备一ID表';


-- -----------------------------------------------------------------------------
-- 4、任务数据表
-- -----------------------------------------------------------------------------
drop table if exists task_manage;
create table task_manage (
  task_id           bigint(11) 		    not null auto_increment    comment '任务id',
  device_id 		int(11) 		    not null                   comment '设备id',
  task_name 		varchar(100) 	    default '任务'		       comment '任务描述',
  task_time 	    timestamp           not null  				   comment '任务执行时间',
  mqtt_topic        varchar(50)         not null                   comment 'mqtt主题',
  mqtt_message      varchar(1024)        not null                  comment 'mqtt消息',
  primary key (task_id),
  foreign key(device_id) references device_unnid(device_id)
) engine=innodb auto_increment=1 default charset=utf8              comment = '定时任务表';




-- -----------------------------------------------------------------------------
-- 5、用户开关控制器数据表
-- -----------------------------------------------------------------------------
drop table if exists switch_data;
create table switch_data (
  switch_id 		int(11) 		not null auto_increment    comment '开关控制器id',
  switch_device 	int(11) 		not null                   comment '开关控制器所属设备',
  switch_name 		varchar(30) 	default '' 				   comment '开关控制器名称',
  switch_state      tinyint         default '0'                comment '开关控制器状态/值',

  primary key (switch_id),
  foreign key(switch_device) references device_unnid(device_id)
) engine=innodb  default charset=utf8 comment = '用户开关控制器数据表';


-- -----------------------------------------------------------------------------
-- 6、用户传感器数据表
-- -----------------------------------------------------------------------------
drop table if exists sensor_data;
create table sensor_data (
  sensor_id 		int(11) 		not null auto_increment    comment '传感器id',
  sensor_device 	int(11) 		not null                   comment '传感器所属设备',
  sensor_name 		varchar(30) 	default '' 				   comment '传感器名称',
  sensor_value      smallint        default 0                  comment '传感器的值',

  primary key (sensor_id),
  foreign key(sensor_device) references device_unnid(device_id)
) engine=innodb  default charset=utf8 comment = '用户传感器数据表';

-- -----------------------------------------------------------------------------
-- 7、气体检测传感器数据表
-- -----------------------------------------------------------------------------
drop table if exists mq_data;
create table mq_data (
  mq_id 		   int(11) 		    not null auto_increment    comment '气体传感器id',
  mq_device 	   int(11) 		    not null                   comment '气体传感器所属设备',
  mq_name 		   varchar(30) 	    default '' 				   comment '气体传感器名称',
  mq_value         smallint         default 0                  comment '传感器的值',
  primary key (mq_id),
  foreign key(mq_device) references device_unnid(device_id)
) engine=innodb  default charset=utf8 comment = '气体检测传感器数据表';

-- -----------------------------------------------------------------------------
-- 8、温度湿度传感器数据表
-- -----------------------------------------------------------------------------
drop table if exists ht_data;
create table ht_data (
  ht_id 		    int(11) 		 not null auto_increment   comment '温度湿度传感器id',
  ht_device 	    int(11) 	     not null                  comment '温度湿度传感器所属设备',
  ht_name 		    varchar(30)      default '' 	           comment '温度湿度传感器名称',
  temperature_value smallint         default 0                 comment '温度湿度传感器的值',
  humidity_value    smallint         default 0                 comment '温度湿度传感器的值',
  primary key (ht_id),
  foreign key(ht_device) references device_unnid(device_id)
) engine=innodb  default charset=utf8 comment = '温度湿度检测传感器数据表';

-- -----------------------------------------------------------------------------
-- 9、遥控器数据表
-- -----------------------------------------------------------------------------
drop table if exists ir_data;
create table ir_data (
  ir_id 		    int(11) 		 not null auto_increment   comment '红外按键id',
  ir_device 	    int(11) 	     not null                  comment '红外按键所属设备',
  ir_name 		    varchar(30)      default '' 	           comment '红外按键名称',
  ir_code           varchar(30)      default '' 			   comment '红外按键编码',
  primary key (ir_id),
  foreign key(ir_device) references device_unnid(device_id)
) engine=innodb  default charset=utf8 comment = '遥控器数据表数据表';



-- -----------------------------------------------------------------------------
-- 10、拖动控制器数据表
-- -----------------------------------------------------------------------------
drop table if exists slider_data;
create table slider_data (
  slider_id 		int(11) 		 not null auto_increment   comment '控制器id',
  slider_device 	int(11) 		 not null                  comment '控制器所属设备',
  slider_name 		varchar(30) 	 default '' 			   comment '控制器名称',
  slider_value      smallint         default 0                 comment '控制器的值',
  primary key (slider_id),
  foreign key(slider_device) references device_unnid(device_id)
) engine=innodb  default charset=utf8 comment = '拖动控制器数据表';


-- 设备数据代码生成 key
INSERT INTO `smarthome`.`device_unnid` (`device_name`, `device_macid`,`device_send_topic`, `device_receive_topic`) VALUES ('ESP-1', 'nXoqPtlSjdjje d','ESP32-00000-publish','ESP32-00000-receive');
INSERT INTO `smarthome`.`device_unnid` (`device_name`, `device_macid`,`device_send_topic`, `device_receive_topic`) VALUES ('ESP-2', 'SDkzCrkjsjeeRq','ESP32-00001-publish','ESP32-00001-receive');
INSERT INTO `smarthome`.`device_unnid` (`device_name`, `device_macid`,`device_send_topic`, `device_receive_topic`) VALUES ('ESP-3', 'FOLWxnskkkeecm','ESP32-00002-publish','ESP32-00002-receive');
INSERT INTO `smarthome`.`device_unnid` (`device_name`, `device_macid`,`device_send_topic`, `device_receive_topic`) VALUES ('ESP-4', 'WJezYg3skkkeX','ESP32-00003-publish','ESP32-00003-receive');
INSERT INTO `smarthome`.`device_unnid` (`device_name`, `device_macid`,`device_send_topic`, `device_receive_topic`) VALUES ('ESP-5', 'EbUjyCRskkkeeG','ESP32-00004-publish','ESP32-00004-receive');
INSERT INTO `smarthome`.`device_unnid` (`device_name`, `device_macid`,`device_send_topic`, `device_receive_topic`) VALUES ('ESP-6', 'QWsjjjeeGkrewa','ESP32-00005-publish','ESP32-00005-receive');
INSERT INTO `smarthome`.`device_unnid` (`device_name`, `device_macid`,`device_send_topic`, `device_receive_topic`) VALUES ('ESP-7', 'wfk5ekksNHDorg','ESP32-00006-publish','ESP32-00006-receive');
INSERT INTO `smarthome`.`device_unnid` (`device_name`, `device_macid`,`device_send_topic`, `device_receive_topic`) VALUES ('ESP-8', 'mKyJDJensTCyOk','ESP32-00007-publish','ESP32-00007-receive');
INSERT INTO `smarthome`.`device_unnid` (`device_name`, `device_macid`,`device_send_topic`, `device_receive_topic`) VALUES ('ESP-9', 'L6HXKDKens9ocq','ESP32-00008-publish','ESP32-00008-receive');
INSERT INTO `smarthome`.`device_unnid` (`device_name`, `device_macid`,`device_send_topic`, `device_receive_topic`) VALUES ('ESP-10', 'ClNIEIDNDyCijV','ESP32-00009-publish','ESP32-00009-receive');


-- 开关数据
-- 设备1
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关1',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关2',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关3',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关4',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关5',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关6',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关7',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关8',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关9',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关10',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关11',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关12',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关13',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关14',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关15',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关16',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关17',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关18',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关19',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关20',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关21',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关22',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关23',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关24',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关25',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关26',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关27',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关28',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关29',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关30',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关31',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关32',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关33',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关34',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关35',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关36',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关37',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关38',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关39',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '666', '开关40',  '0');
-- 设备2
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关1',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关2',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关3',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关4',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关5',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关6',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关7',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关8',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关9',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关10',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关11',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关12',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关13',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关14',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关15',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关16',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关17',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关18',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关19',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关20',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关21',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关22',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关23',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关24',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关25',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关26',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关27',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关28',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关29',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关30',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关31',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关32',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关33',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关34',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关35',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关36',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关37',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关38',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关39',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '667', '开关40',  '0');
-- 设备3
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关1',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关2',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关3',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关4',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关5',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关6',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关7',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关8',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关9',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关10',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关11',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关12',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关13',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关14',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关15',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关16',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关17',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关18',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关19',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关20',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关21',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关22',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关23',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关24',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关25',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关26',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关27',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关28',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关29',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关30',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关31',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关32',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关33',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关34',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关35',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关36',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关37',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关38',  '0');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关39',  '1');
INSERT INTO `smarthome`.`switch_data` (`switch_device`, `switch_name`, `switch_state`) VALUES ( '668', '开关40',  '0');



-- MQ空气检测
-- 设备1
INSERT INTO `smarthome`.`mq_data` (`mq_device`, `mq_name`,  `mq_value`) VALUES ('666', '烟雾传感器',  '600');
INSERT INTO `smarthome`.`mq_data` (`mq_device`, `mq_name`,  `mq_value`) VALUES ('666', '空气检测',  '800');
-- 设备2
INSERT INTO `smarthome`.`mq_data` (`mq_device`, `mq_name`,  `mq_value`) VALUES ('667', '烟雾传感器',  '600');
INSERT INTO `smarthome`.`mq_data` (`mq_device`, `mq_name`,  `mq_value`) VALUES ('667', '空气检测',  '800');
-- 设备3
INSERT INTO `smarthome`.`mq_data` (`mq_device`, `mq_name`,  `mq_value`) VALUES ('668', '烟雾传感器',  '900');
INSERT INTO `smarthome`.`mq_data` (`mq_device`, `mq_name`,  `mq_value`) VALUES ('668', '空气检测',  '80');


-- 温度湿度
-- 设备1
INSERT INTO `smarthome`.`ht_data` (`ht_device`, `ht_name`, `temperature_value`, `humidity_value`) VALUES ('666', '客厅温度湿度',  '37', '80');
INSERT INTO `smarthome`.`ht_data` (`ht_device`, `ht_name`, `temperature_value`, `humidity_value`) VALUES ('666', '厨房温度湿度',  '20', '95');
-- 设备2
INSERT INTO `smarthome`.`ht_data` (`ht_device`, `ht_name`, `temperature_value`, `humidity_value`) VALUES ('667', '客厅温度湿度',  '37', '80');
INSERT INTO `smarthome`.`ht_data` (`ht_device`, `ht_name`, `temperature_value`, `humidity_value`) VALUES ('667', '厨房温度湿度',  '20', '95');
-- 设备3
INSERT INTO `smarthome`.`ht_data` (`ht_device`, `ht_name`, `temperature_value`, `humidity_value`) VALUES ('668', '客厅温度湿度',  '27', '80');
INSERT INTO `smarthome`.`ht_data` (`ht_device`, `ht_name`, `temperature_value`, `humidity_value`) VALUES ('668', '厨房温度湿度',  '30', '75');


-- 传感器
-- 设备1
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('666', '传感器1',  '1000');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('666', '传感器2',  '600');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('666', '传感器3',  '200');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('666', '传感器4',  '300');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('666', '传感器5',  '400');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('666', '传感器6',  '500');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('666', '传感器7',  '7000');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('666', '传感器8',  '800');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('666', '传感器9',  '7000');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('666', '传感器10',  '800');
-- 设备2
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('667', '传感器1',  '1000');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('667', '传感器2',  '600');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('667', '传感器3',  '200');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('667', '传感器4',  '300');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('667', '传感器5',  '400');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('667', '传感器6',  '500');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('667', '传感器7',  '7000');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('667', '传感器8',  '800');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('667', '传感器9',  '7000');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('667', '传感器10',  '800');
-- 设备3
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('668', '传感器1',  '100');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('668', '传感器2',  '500');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('668', '传感器3',  '100');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('668', '传感器4',  '150');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('668', '传感器5',  '400');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('668', '传感器6',  '650');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('668', '传感器7',  '100');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('668', '传感器8',  '50');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('668', '烟雾传感器',  '100');
INSERT INTO `smarthome`.`sensor_data` (`sensor_device`, `sensor_name`,  `sensor_value`) VALUES ('668', '空气传感器',  '50');


-- 遥控器
-- 设备1
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('666', '按键1',  '0x33B87986');
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('666', '按键2',  '0x33B8A15E');
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('666', '按键3',  '0x33B8F906');
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('666', '按键3',  '0x33B8619E');
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('666', '按键4',  '0x33B8EEEE');
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('666', '按键5',  '0x33B8619A');
-- 设备2
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('667', '按键1',  '0x33B87986');
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('667', '按键2',  '0x33B8A15E');
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('667', '按键3',  '0x33B8F906');
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('667', '按键3',  '0x33B8619E');
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('667', '按键4',  '0x33B8EEEE');
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('667', '按键5',  '0x33B8619A');
-- 设备3
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('668', '按键1',  '0x33B87986');
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('668', '按键2',  '0x33B8A15E');
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('668', '按键3',  '0x33B8F906');
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('668', '按键3',  '0x33B8619E');
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('668', '按键4',  '0x33B8EEEE');
INSERT INTO `smarthome`.`ir_data` (`ir_device`, `ir_name`,  `ir_code`) VALUES ('668', '按键5',  '0x33B8619A');



-- 滑块
-- 设备1
INSERT INTO `smarthome`.`slider_data` (`slider_device`, `slider_name`,  `slider_value`) VALUES ('666', '客厅灯',  '0');
INSERT INTO `smarthome`.`slider_data` (`slider_device`, `slider_name`,  `slider_value`) VALUES ('666', '卧室灯亮度',  '0');
INSERT INTO `smarthome`.`slider_data` (`slider_device`, `slider_name`,  `slider_value`) VALUES ('666', '电风扇',  '0');
INSERT INTO `smarthome`.`slider_data` (`slider_device`, `slider_name`,  `slider_value`) VALUES ('666', '抽水机',  '0');

-- 设备2
INSERT INTO `smarthome`.`slider_data` (`slider_device`, `slider_name`,  `slider_value`) VALUES ('667', '客厅灯',  '0');
INSERT INTO `smarthome`.`slider_data` (`slider_device`, `slider_name`,  `slider_value`) VALUES ('667', '卧室灯亮度',  '0');
INSERT INTO `smarthome`.`slider_data` (`slider_device`, `slider_name`,  `slider_value`) VALUES ('667', '电风扇',  '0');
INSERT INTO `smarthome`.`slider_data` (`slider_device`, `slider_name`,  `slider_value`) VALUES ('667', '抽水机',  '0');

-- 设备3
INSERT INTO `smarthome`.`slider_data` (`slider_device`, `slider_name`,  `slider_value`) VALUES ('668', '客厅灯',  '0');
INSERT INTO `smarthome`.`slider_data` (`slider_device`, `slider_name`,  `slider_value`) VALUES ('668', '卧室灯亮度',  '0');
INSERT INTO `smarthome`.`slider_data` (`slider_device`, `slider_name`,  `slider_value`) VALUES ('668', '客厅灯',  '0');
INSERT INTO `smarthome`.`slider_data` (`slider_device`, `slider_name`,  `slider_value`) VALUES ('668', '卧室灯亮度',  '0');




