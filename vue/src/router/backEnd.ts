import { RouteRecordRaw } from 'vue-router';
import { defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import pinia from '/@/stores/index';
import { useUserInfo } from '/@/stores/userInfo';
import { useRequestOldRoutes } from '/@/stores/requestOldRoutes';
import { Session } from '/@/utils/storage';
import { NextLoading } from '/@/utils/loading';
import { dynamicRoutes, notFoundAndNoPower } from '/@/router/route';
import { formatTwoStageRoutes, formatFlatteningRoutes, router } from '/@/router/index';
import { useRoutesList } from '/@/stores/routesList';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useMenuApi } from '/@/api/menu/index';

// 后端控制路由

/**
 * 初始化方法
 */
export async function initBackEndControlRoutes() {
	// 界面 loading 动画开始执行
	if (window.nextLoading === undefined) NextLoading.start();
	// 无 token 停止执行下一步
	if (!Session.get('token')) return false;
	// 触发初始化用户信息 pinia
	await useUserInfo().setUserInfos();
	// 获取路由菜单数据
	const res = await getBackEndControlRoutes();
	// 无登录权限时，添加判断
	if (res.data.length <= 0) return Promise.resolve(true);
	// 处理路由（树结构）
	const { backRoute, frontRoute } = await asyncRoutesBuild(res.data);
	// 添加动态路由
	await setAddRoute(backRoute);
	// 设置递归过滤有权限的路由到 pinia routesList 中（已处理成多级嵌套路由）
	setFilterMenuAndCacheTagsViewRoutes(backRoute);
	// 获取有权限的路由，并处理成一维数组（防止旧路由等）
	const dynamicRoutesData = await handleAsyncRoutes(dynamicRoutes);
	// 添加到 pinia routesList 中
	const storesRoutesList = useRoutesList();
	const { routesList } = storeToRefs(storesRoutesList);
	routesList.value = backRoute.concat(dynamicRoutesData);
}

/**
 * 设置路由到 pinia routesList 中（已处理成多级嵌套路由）
 * @param routes 处理后的路由
 */
export async function setFilterMenuAndCacheTagsViewRoutes(routes: any) {
	// 添加到 pinia routesList 中
	const storesRoutesList = useRoutesList();
	const { routesList } = storeToRefs(storesRoutesList);
	routesList.value = routes;
	// 添加到 pinia tagsViewRoutes 中
	const storesTagsViewRoutes = useTagsViewRoutes();
	const { tagsViewRoutes } = storeToRefs(storesTagsViewRoutes);
	let tags = [];
	routes.forEach((route: any) => {
		if (route.children) {
			route.children.forEach((r: any) => {
				tags.push(r);
			});
		} else {
			tags.push(route);
		}
	});
	tagsViewRoutes.value = tags;
}

/**
 * 处理路由格式
 * @param routes 接口返回的路由表
 * @returns 返回处理后的路由
 */
export function handleAsyncRoutes(routes: any) {
	if (routes.length <= 0) return Promise.resolve([]);
	return new Promise((resolve) => {
		const newRouteList: any = [];
		routes.forEach((route: any) => {
			if (route.component) {
				route.component = dynamicImport(route.component as string);
			}
			if (route.children) {
				route.children.forEach((item: any) => {
					if (item.component) {
						item.component = dynamicImport(item.component as string);
					}
					if (item.children) {
						item.children.forEach((itemTwo: any) => {
							if (itemTwo.component) {
								itemTwo.component = dynamicImport(itemTwo.component as string);
							}
						});
					}
				});
			}
			newRouteList.push(route);
		});
		resolve(newRouteList);
	});
}

/**
 * 动态导入组件
 * @param url 路由地址
 * @returns 返回路由地址
 */
export function dynamicImport(url: string) {
	const view = url;
	const viewPath = view.split('/views/')[1];
	return defineAsyncComponent(() => import(`/@/views/${viewPath}`));
}

/**
 * 获取路由菜单数据
 */
export function getBackEndControlRoutes() {
	return useMenuApi();
}

/**
 * 后端路由 component 转换函数
 * @param routes 后端返回的路由表
 * @returns 返回处理后的路由
 */
export function backEndComponent(routes: any) {
	if (!routes) return;
	return routes.map((item: any) => {
		if (item.component) item.component = dynamicImport(item.component as string);
		if (item.children) item.children = backEndComponent(item.children);
		return item;
	});
}

/**
 * 后端控制路由：处理路由与菜单
 * @param routes 接口返回的路由表
 * @returns 返回路由和菜单
 */
export function asyncRoutesBuild(routes: any) {
	return new Promise((resolve) => {
		const { useUserInfo } = await import('/@/stores/userInfo');
		const storesUserInfo = useUserInfo(pinia);
		const { userInfos } = storeToRefs(storesUserInfo);
		const filterRoute = formatFlatteningRoutes(routes);
		const routeMaps = backEndComponent(filterRoute);
		const nowRoutes = setFilterRouteEnd(routeMaps);
		resolve({ backRoute: nowRoutes, frontRoute: [] });
	});
}

/**
 * 获取有当前用户权限标识的路由数组，进行对原路由的替换
 * @param routes 后端返回的路由
 * @returns 返回替换后的路由
 */
export function setFilterRouteEnd(routes: any) {
	const filterRouteEnd = formatTwoStageRoutes(routes);
	filterRouteEnd[0].children = [...filterRouteEnd[0].children, ...notFoundAndNoPower];
	return filterRouteEnd;
}

/**
 * 添加动态路由
 * @param routes 当前路由
 */
export async function setAddRoute(routes: any) {
	await routes.forEach((route: RouteRecordRaw) => {
		router.addRoute(route);
	});
}

/**
 * 删除/重置路由
 */
export function resetRoute() {
	const routes = router.getRoutes();
	routes.forEach((route) => {
		const { name } = route;
		if (name) router.hasRoute(name) && router.removeRoute(name);
	});
}
