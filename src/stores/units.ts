// 环境状态访问器 - 根据不同平台设置状态信息
// 支持TabBar高度计算，在微信小程序和App平台的iOS设备上会自动适配主屏幕指示器高度

// 定义状态接口
interface EnvironmentalState {
  UNI_PLATFORM: string;
  VUE_APP_ENV: string;
  TOTAL_TOP_HEIGHT: string;
  TOTAL_HEIGHT: number;
  BAR_HEIGHT: string;
  NAVI_HEIGHT: string;
  MENU_T: string;
  MENU_R: string;
  MENU_L: string;
  MENU_H: string;
  MENU_W: string;
  SCREEN_WIDTH: number;
  SCREEN_HEIGHT: number;
  SCREEN_WIDTH_RPX: string;
  SCREEN_HEIGHT_RPX: string;
  TAB_BAR_HEIGHT: string;
  TAB_BAR_HEIGHT_PX: number;
  TAB_BAR_HEIGHT_WITH_INDICATOR?: string;
  HAS_HOME_INDICATOR?: boolean;
  menuButtonInfo?: any;
}

// 平台配置常量
const PLATFORM_CONFIG = {
  DEFAULT_STATUS_BAR_HEIGHT: 20,
  DEFAULT_NAVIGATION_HEIGHT: {
    IOS: 44,
    ANDROID: 48,
    DEFAULT: 44
  },
  DEFAULT_TAB_BAR_HEIGHT: {
    IOS: 50,
    ANDROID: 50,
    DEFAULT: 50
  },
  HOME_INDICATOR_HEIGHT: 34,
  _BASE_WIDTH: 750,
  FALLBACK_VALUES: {
    H5: {
      TOTAL_TOP_HEIGHT: '88',
      TOTAL_HEIGHT: 88,
      MENU_T: '24',
      MENU_R: '24',
      MENU_L: '24',
      MENU_H: '64.1711229946524',
      MENU_W: '0',
      SCREEN_WIDTH: 375,
      SCREEN_HEIGHT: 667,
      SCREEN_WIDTH_RPX: '750',
      SCREEN_HEIGHT_RPX: '1334'
    },
    OTHER: {
      TOTAL_TOP_HEIGHT: '176',
      TOTAL_HEIGHT: 176,
      MENU_T: '24',
      MENU_R: '24',
      MENU_L: '24',
      MENU_H: '64.1711229946524',
      MENU_W: '0',
      SCREEN_WIDTH: 375,
      SCREEN_HEIGHT: 667,
      SCREEN_WIDTH_RPX: '750',
      SCREEN_HEIGHT_RPX: '1334'
    }
  }
} as const;

export const accessEnvironmentalState = (state: EnvironmentalState) => {
  setPlatformAndEnvironment(state);
  calculateLayoutHeights(state);
};

// 设置平台信息和环境变量
function setPlatformAndEnvironment(state: EnvironmentalState): void {
  const platform = process.env.UNI_PLATFORM;
  const nodeEnv = process.env.NODE_ENV;

  state.UNI_PLATFORM = platform || 'h5';
  state.VUE_APP_ENV = '';
  switch (platform) {
    case 'android':
      state.VUE_APP_ENV = nodeEnv === 'development' ? 'development' : 'production';
      break;
    case 'mp-weixin':
      try {
        const accountInfo = uni.getAccountInfoSync();
        state.VUE_APP_ENV = accountInfo.miniProgram.envVersion;
      } catch {
        state.VUE_APP_ENV = 'develop';
      }
      break;
    default:
      state.VUE_APP_ENV = nodeEnv === 'development' ? 'develop' : 'release';
      break;
  }
}

// 计算布局高度信息
function calculateLayoutHeights(state: EnvironmentalState): void {
  try {
    const systemInfo = uni.getSystemInfoSync();
    const Ratio = PLATFORM_CONFIG._BASE_WIDTH / systemInfo.windowWidth;

    state.SCREEN_WIDTH = systemInfo.screenWidth || systemInfo.windowWidth || 0;
    state.SCREEN_HEIGHT = systemInfo.screenHeight || systemInfo.windowHeight || 0;
    state.SCREEN_WIDTH_RPX = `${state.SCREEN_WIDTH * Ratio}`;
    state.SCREEN_HEIGHT_RPX = `${state.SCREEN_HEIGHT * Ratio}`;

    const statusBarHeightPx = systemInfo.statusBarHeight || PLATFORM_CONFIG.DEFAULT_STATUS_BAR_HEIGHT;
    let navigationHeightPx: any = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.DEFAULT;

    if (process.env.UNI_PLATFORM === 'h5') {
      setH5Layout(state);
      return;
    }

    if (process.env.UNI_PLATFORM === 'mp-weixin') {
      navigationHeightPx = handleWeChatMiniProgram(state, systemInfo, Ratio, statusBarHeightPx);
    } else {
      navigationHeightPx = handleOtherPlatforms(state, systemInfo, Ratio, statusBarHeightPx);
    }

    setCommonLayout(state, statusBarHeightPx, navigationHeightPx, Ratio);
    calculateTabBarHeight(state, systemInfo, Ratio);
  } catch {
    setFallbackLayout(state);
  }
}

// 设置通用布局信息
function setCommonLayout(state: EnvironmentalState, statusBarHeightPx: number, navigationHeightPx: number, Ratio: number): void {
  const totalTopHeightPx = (statusBarHeightPx + navigationHeightPx) * Ratio;
  state.BAR_HEIGHT = `${statusBarHeightPx * Ratio}`;
  state.NAVI_HEIGHT = `${navigationHeightPx * Ratio}`;
  state.TOTAL_TOP_HEIGHT = `${totalTopHeightPx}`;
  state.TOTAL_HEIGHT = totalTopHeightPx;
}

// H5布局
function setH5Layout(state: EnvironmentalState): void {
  try {
    const systemInfo = uni.getSystemInfoSync();
    const Ratio = PLATFORM_CONFIG._BASE_WIDTH / systemInfo.windowWidth;

    state.SCREEN_WIDTH = systemInfo.screenWidth || systemInfo.windowWidth || 0;
    state.SCREEN_HEIGHT = systemInfo.screenHeight || systemInfo.windowHeight || 0;
    state.SCREEN_WIDTH_RPX = `${state.SCREEN_WIDTH * Ratio}`;
    state.SCREEN_HEIGHT_RPX = `${state.SCREEN_HEIGHT * Ratio}`;

    const config = PLATFORM_CONFIG.FALLBACK_VALUES.H5;
    state.TOTAL_TOP_HEIGHT = config.TOTAL_TOP_HEIGHT;
    state.TOTAL_HEIGHT = config.TOTAL_HEIGHT;
    state.BAR_HEIGHT = '20';
    state.NAVI_HEIGHT = '44';
    state.MENU_T = config.MENU_T;
    state.MENU_R = config.MENU_R;
    state.MENU_L = config.MENU_L;
    state.MENU_H = config.MENU_H;
    state.MENU_W = config.MENU_W;

    state.TAB_BAR_HEIGHT_PX = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT;
    state.TAB_BAR_HEIGHT = `${PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT * Ratio}`;
    state.TAB_BAR_HEIGHT_WITH_INDICATOR = state.TAB_BAR_HEIGHT;
    state.HAS_HOME_INDICATOR = false;
  } catch {
    const config = PLATFORM_CONFIG.FALLBACK_VALUES.H5;
    Object.assign(state, config);
    state.BAR_HEIGHT = '20';
    state.NAVI_HEIGHT = '44';
    state.TAB_BAR_HEIGHT_PX = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT;
    state.TAB_BAR_HEIGHT = `${PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT * 2}`;
    state.TAB_BAR_HEIGHT_WITH_INDICATOR = state.TAB_BAR_HEIGHT;
    state.HAS_HOME_INDICATOR = false;
  }
}

// 处理微信小程序
function handleWeChatMiniProgram(state: EnvironmentalState, systemInfo: any, Ratio: number, statusBarHeightPx: number): number {
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect?.();

  if (menuButtonInfo) {
    state.MENU_T = `${menuButtonInfo.top * Ratio}`;
    state.MENU_R = `${menuButtonInfo.right * Ratio}`;
    state.MENU_L = `${menuButtonInfo.left * Ratio}`;
    state.MENU_H = `${menuButtonInfo.height * Ratio}`;
    state.MENU_W = `${menuButtonInfo.width * Ratio}`;
    state.menuButtonInfo = { ...menuButtonInfo, Ratio };

    if (menuButtonInfo.top && menuButtonInfo.height) {
      const gap = menuButtonInfo.top - statusBarHeightPx;
      return menuButtonInfo.height + gap * 2;
    }
  }

  return systemInfo.platform === 'ios'
    ? PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.IOS
    : PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.ANDROID;
}

// 处理其他平台
function handleOtherPlatforms(state: EnvironmentalState, systemInfo: any, Ratio: number, statusBarHeightPx: number): number {
  const platform = systemInfo.platform;
  let navigationHeightPx: number;

  if (platform === 'ios') {
    navigationHeightPx = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.IOS;
    setDefaultMenuLayout(state, `${(statusBarHeightPx + navigationHeightPx) * Ratio}`);
  } else if (platform === 'android') {
    navigationHeightPx = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.ANDROID;
    setDefaultMenuLayout(state, `${(statusBarHeightPx + navigationHeightPx) * Ratio}`, '88');
  } else {
    navigationHeightPx = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.DEFAULT;
    setDefaultMenuLayout(state);
  }

  return navigationHeightPx;
}

// 设置默认菜单布局
function setDefaultMenuLayout(state: EnvironmentalState, menuT: string = '24', menuH: string = '64.1711229946524'): void {
  state.MENU_T = menuT;
  state.MENU_R = '24';
  state.MENU_L = '24';
  state.MENU_H = menuH;
  state.MENU_W = '0';
}

// 检查是否为全面屏 iPhone
function checkHasHomeIndicator(systemInfo: any): boolean {
  const screenHeight = systemInfo.screenHeight || systemInfo.windowHeight;
  const statusBarHeight = systemInfo.statusBarHeight || 0;

  if (systemInfo.platform === 'ios') {
    if (statusBarHeight >= 44 || screenHeight >= 812) return true;

    const model = systemInfo.model || '';
    return ['iPhone X', 'iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15'].some(m => model.includes(m));
  }

  return false;
}

// 设置TabBar高度（含底部横条处理）
function calculateTabBarHeight(state: EnvironmentalState, systemInfo: any, Ratio: number): void {
  const platform = process.env.UNI_PLATFORM;
  let tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT;
  let hasHomeIndicator = false;

  if (platform === 'mp-weixin' || ['app', 'ios', 'android'].includes(platform)) {
    if (systemInfo.platform === 'ios') {
      hasHomeIndicator = checkHasHomeIndicator(systemInfo);
      tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.IOS + (hasHomeIndicator ? PLATFORM_CONFIG.HOME_INDICATOR_HEIGHT : 0);
    } else if (systemInfo.platform === 'android') {
      tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.ANDROID;
    }
  }

  state.HAS_HOME_INDICATOR = hasHomeIndicator;
  state.TAB_BAR_HEIGHT_PX = tabBarHeightPx;
  state.TAB_BAR_HEIGHT = `${(tabBarHeightPx - (hasHomeIndicator ? PLATFORM_CONFIG.HOME_INDICATOR_HEIGHT : 0)) * Ratio}`;
  state.TAB_BAR_HEIGHT_WITH_INDICATOR = `${tabBarHeightPx * Ratio}`;
}

// 回退逻辑
function setFallbackLayout(state: EnvironmentalState): void {
  const isH5 = process.env.UNI_PLATFORM === 'h5';
  const config = isH5 ? PLATFORM_CONFIG.FALLBACK_VALUES.H5 : PLATFORM_CONFIG.FALLBACK_VALUES.OTHER;

  Object.assign(state, config);

  state.BAR_HEIGHT = '20';
  state.NAVI_HEIGHT = '44';
  state.TOTAL_HEIGHT = 88;

  state.TAB_BAR_HEIGHT_PX = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT;
  state.TAB_BAR_HEIGHT = `${PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT * 2}`;
  state.TAB_BAR_HEIGHT_WITH_INDICATOR = state.TAB_BAR_HEIGHT;
  state.HAS_HOME_INDICATOR = false;
}
