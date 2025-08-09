import { RouteRecordRaw } from 'vue-router';
import { storeToRefs } from 'pinia';
import pinia from '/@/stores/index';
import { useUserInfo } from '/@/stores/userInfo';
import { useRequestOldRoutes } from '/@/stores/requestOldRoutes';
import { Session } from '/@/utils/storage';
import { formatTwoStageRoutes, formatFlatteningRoutes, router } from '/@/router/index';
import { dynamicRoutes, notFoundAndNoPower } from '/@/router/route';
import { useRoutesList } from '/@/stores/routesList';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';

// 前端控制路由

/**
 * 获取当前用户权限标识去比对路由表（未处理成多级嵌套路由）
 * @description 这里主要用于动态路由的添加，router.addRoute
 * @param routes 当前路由表
 * @returns 返回有当前用户权限标识的路由表
 */
export function setFilterRoute(routes: any) {
	const storesRoutesList = useRoutesList(pinia);
	const { routesList } = storeToRefs(storesRoutesList);
	const storesUserInfo = useUserInfo(pinia);
	const { userInfos } = storeToRefs(storesUserInfo);
	const filterRoute: any = [];
	routes.forEach((route: any) => {
		route.meta.roles = route.meta.roles || ['admin'];
		// 已登录用户与路由角色权限判断
		if (route.meta.roles.includes(userInfos.value.role)) filterRoute.push({ ...route });
	});
	routesList.value = filterRoute;
	return filterRoute;
}

/**
 * 获取有当前用户权限标识的路由数组，进行对原路由的替换
 * @description 替换 dynamicRoutes（/@/router/route）第一个顶级 children 的路由
 * @returns 返回替换后的路由数组
 */
export function setFilterRouteEnd() {
	let filterRouteEnd: any = formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes));
	// notFoundAndNoPower 防止 404、401 不在 layout 布局中，不设置的话，404、401 界面将全屏显示
	// 关联问题 No match found for location with path 'xxx'
	filterRouteEnd[0].children = [...setFilterRoute(filterRouteEnd[0].children), ...notFoundAndNoPower];
	return filterRouteEnd;
}

/**
 * 添加动态路由
 * @method router.addRoute
 * @description 此处循环为 dynamicRoutes（/@/router/route）第一个顶级 children 的路由一维数组，非多级嵌套
 * @link 参考：https://next.router.vuejs.org/zh/api/#addroute
 */
export async function setAddRoute() {
	await setFilterRouteEnd().forEach((route: RouteRecordRaw) => {
		router.addRoute(route);
	});
}

/**
 * 删除/重置路由
 * @method router.removeRoute
 * @description 此处循环为 dynamicRoutes（/@/router/route）第一个顶级 children 的路由一维数组，非多级嵌套
 * @link 参考：https://next.router.vuejs.org/zh/api/#push
 */
export async function resetRoute() {
	await setRouteChange();
}

/**
 * 前端控制路由：初始化方法，防止刷新时路由丢失
 */
export function initFrontEndControlRoutes() {
	// 无 token 停止执行下一步
	if (!Session.get('token')) return false;
	// 添加动态路由
	const storesRequestOldRoutes = useRequestOldRoutes(pinia);
	const { requestOldRoutes } = storeToRefs(storesRequestOldRoutes);
	// 处理路由与navMenu 非静态路由
	const asyncRoutes = setFilterRouteEnd();
	asyncRoutes.forEach((route: RouteRecordRaw) => {
		router.addRoute(route);
	});
	// 添加到 pinia routesList 中
	const storesRoutesList = useRoutesList(pinia);
	const { routesList } = storeToRefs(storesRoutesList);
	routesList.value = asyncRoutes[0].children;
	// 添加到 pinia tagsViewRoutes 中
	const storesTagsViewRoutes = useTagsViewRoutes(pinia);
	const { tagsViewRoutes } = storeToRefs(storesTagsViewRoutes);
	const nowTagsViewRoutes = setTagsViewHighlight(routesList.value);
	// 添加到 pinia tagsViewRoutes 中
	tagsViewRoutes.value = nowTagsViewRoutes;
	return requestOldRoutes.value = JSON.parse(JSON.stringify(nowTagsViewRoutes));
}

/**
 * 路由更新时，设置高亮标签页
 * @param routes 路由数据
 * @returns 返回处理后的路由数据
 */
export function setTagsViewHighlight(routes: any) {
	const tagsViewRoutes: any = [];
	routes.forEach((route: any) => {
		if (route.meta.isHide) return;
		tagsViewRoutes.push({ ...route });
	});
	return tagsViewRoutes;
}

/**
 * 设置递归过滤有权限的路由到 pinia routesList
 * 防止在未进行后端控制路由情况下进行刷新时，请求未完成，展示空白页
 * @param routes 路由数据
 */
export async function setFilterMenuAndCacheTagsViewRoutes(routes: any) {
	const storesRoutesList = useRoutesList(pinia);
	const { routesList } = storeToRefs(storesRoutesList);
	routesList.value = routes;
}

/**
 * 清空 routesList 中的数据
 * @returns 值，用于赋值
 */
export function setRouteChange() {
	const storesRoutesList = useRoutesList(pinia);
	const { routesList } = storeToRefs(storesRoutesList);
	return (routesList.value = []);
}
