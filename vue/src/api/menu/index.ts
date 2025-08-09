import request from '/@/utils/request';

/**
 * 以下为模拟接口地址，gitee 的不通，就换自己的真实接口地址
 *
 * 菜单接口
 * 不再使用 gitee 提供的地址，替换为本地数据
 */

// 获取后端动态路由菜单(admin)
export function useMenuApi() {
	return request({
		url: '/menu/adminMenu.json',
		method: 'get',
	});
}

// 获取后端动态路由菜单(test)
export function useMenuTestApi() {
	return request({
		url: '/menu/testMenu.json',
		method: 'get',
	});
}
