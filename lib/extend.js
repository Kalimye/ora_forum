/**
 * 注册新用户和用户登陆时验证的策略对象
*/
let registerStrategies = App.extend.registerStrategies = {
  isNonEmpty (value, errorMsg) {  // 验证 value 是否为空
	  if (Object.is(value, '')) { return errorMsg; }
	},
	minLength (value, length, errorMsg) {  // 验证 value 是否小于最小长度
	  if (value.length < length) { return errorMsg; }
	},
	maxLength (value, length, errorMsg) {  // 验证 value 是否大于最大成都
	  if (value.length > length) { return errorMsg; }
	},
	emailFormat (value, errorMsg) {  // 验证邮箱格式
	  let pattern = /!([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/g;
		if (!pattern.test(value)) { return errorMsg; }
	}
};
