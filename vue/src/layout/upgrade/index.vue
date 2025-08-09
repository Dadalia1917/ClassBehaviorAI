<template>
	<div class="upgrade-component">
		<div class="upgrade-component-n">
			<div class="head">
				<i class="iconfont icon-dingyue"></i>
				<div class="title font16 mt5">{{ $t('message.upgradeComponent.title') }}</div>
				<div class="txt mt10">{{ $t('message.upgradeComponent.msg') }}</div>
				<div class="operation mt10">
					<el-button icon="ele-DocumentAdd" size="small" @click="onUpgradeFun">
						{{ $t('message.upgradeComponent.btnText') }}
					</el-button>
					<div class="mt15">
						<el-button size="small" icon="ele-Close" @click="onChangeSamll">{{ $t('message.upgradeComponent.close') }}</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup name="upgrade">
import { ref } from 'vue';

// 随机数，防止 gitee 压缩 svg 图标过大
const randomNum = ref<number>(Math.floor(Math.random() * 9999 + 1));

// 更新事件
const onUpgradeFun = () => {
	window.open(`https://github.com/your-username/classroom-behavior-system`);
};
// 变小事件
const onChangeSamll = () => {
	const cssEl = document.documentElement as HTMLElement;
	cssEl.style.setProperty('--upgrade-small', '1');
};
</script>

<style scoped lang="scss">
.upgrade-dialog {
	:deep(.el-dialog) {
		padding: 0 !important;
		.el-dialog__body {
			padding: 0 !important;
		}
		.el-dialog__header {
			display: none !important;
		}
		.upgrade-title {
			text-align: center;
			height: 130px;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			&::after {
				content: '';
				position: absolute;
				background-color: var(--el-color-primary-light-1);
				width: 130%;
				height: 130px;
				border-bottom-left-radius: 100%;
				border-bottom-right-radius: 100%;
			}
			.upgrade-title-warp {
				z-index: 1;
				position: relative;
				.upgrade-title-warp-txt {
					color: var(--next-color-white);
					font-size: 22px;
					letter-spacing: 3px;
				}
				.upgrade-title-warp-version {
					color: var(--next-color-white);
					background-color: var(--el-color-primary-light-4);
					font-size: 12px;
					position: absolute;
					display: flex;
					top: -2px;
					right: -50px;
					padding: 2px 4px;
					border-radius: 2px;
				}
			}
		}
		.upgrade-content {
			padding: 20px;
			line-height: 22px;
			.upgrade-content-desc {
				color: var(--el-color-info-light-5);
				font-size: 12px;
			}
		}
		.upgrade-btn {
			border-top: 1px solid var(--el-border-color-lighter, #ebeef5);
			display: flex;
			justify-content: space-around;
			padding: 15px 20px;
			.el-button {
				width: 100%;
			}
		}
	}
}
</style>
