/**
 * UniApp 环境状态访问器
 * 功能：根据不同平台（H5、微信小程序、App等）自动设置状态信息
 * 特色：支持TabBar高度计算，在微信小程序和App平台的iOS设备上会自动适配主屏幕指示器高度
 */

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
  TAB_BAR_ALL_HEIGHT?: string; // ✅ 新增字段：TabBar高度 + 主屏幕指示器（rpx）
  HAS_HOME_INDICATOR?: boolean;
  menuButtonInfo?: any;
  IOSHEIGHT?: any;
  xitType?: any;
}

const PLATFORM_CONFIG = {
  DEFAULT_STATUS_BAR_HEIGHT: 20,
  DEFAULT_NAVIGATION_HEIGHT: {
    IOS: 44,
    ANDROID: 48,
    HARMONY: 48, // 新增鸿蒙系统导航栏高度
    DEFAULT: 44
  },
  DEFAULT_TAB_BAR_HEIGHT: {
    IOS: 50,
    ANDROID: 50,
    HARMONY: 50, // 新增鸿蒙系统TabBar高度
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

function setCommonLayout(state: EnvironmentalState, statusBarHeightPx: number, navigationHeightPx: number, Ratio: number): void {
  const totalTopHeightPx = (statusBarHeightPx + navigationHeightPx) * Ratio;
  state.BAR_HEIGHT = `${statusBarHeightPx * Ratio}`;
  state.NAVI_HEIGHT = `${navigationHeightPx * Ratio}`;
  state.TOTAL_TOP_HEIGHT = `${totalTopHeightPx}`;
  state.TOTAL_HEIGHT = totalTopHeightPx;
}

function setH5Layout(state: EnvironmentalState): void {
  try {
    const systemInfo = uni.getSystemInfoSync();
    const Ratio = PLATFORM_CONFIG._BASE_WIDTH / systemInfo.windowWidth;
    state.SCREEN_WIDTH = systemInfo.screenWidth || systemInfo.windowWidth || 0;
    state.SCREEN_HEIGHT = systemInfo.screenHeight || systemInfo.windowHeight || 0;
    state.SCREEN_WIDTH_RPX = `${state.SCREEN_WIDTH * Ratio}`;
    state.SCREEN_HEIGHT_RPX = `${state.SCREEN_HEIGHT * Ratio}`;
    const statusBarHeightPx = 20;
    const navigationHeightPx = 44;
    const totalTopHeightPx = (statusBarHeightPx + navigationHeightPx) * Ratio;
    state.TOTAL_TOP_HEIGHT = `${totalTopHeightPx}`;
    state.TOTAL_HEIGHT = totalTopHeightPx;
    state.BAR_HEIGHT = `${statusBarHeightPx * Ratio}`;
    state.NAVI_HEIGHT = `${navigationHeightPx * Ratio}`;
    state.MENU_T = `${24 * Ratio}`;
    state.MENU_R = `${24 * Ratio}`;
    state.MENU_L = `${24 * Ratio}`;
    state.MENU_H = `${64.1711229946524 * Ratio}`;
    state.MENU_W = '0';
    state.TAB_BAR_HEIGHT_PX = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT;
    state.TAB_BAR_HEIGHT = `${PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT * Ratio}`;
    state.TAB_BAR_HEIGHT_WITH_INDICATOR = state.TAB_BAR_HEIGHT;
    state.TAB_BAR_ALL_HEIGHT = state.TAB_BAR_HEIGHT;
    state.HAS_HOME_INDICATOR = false;
  } catch {
    setFallbackLayout(state);
  }
}

function handleWeChatMiniProgram(state: EnvironmentalState, systemInfo: any, Ratio: number, statusBarHeightPx: number): number {
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect?.();
  if (menuButtonInfo) {
    state.MENU_T = `${menuButtonInfo.top * Ratio}`;
    state.MENU_R = `${menuButtonInfo.right * Ratio}`;
    state.MENU_L = `${menuButtonInfo.left * Ratio}`;
    state.MENU_H = `${menuButtonInfo.height * Ratio}`;
    state.MENU_W = `${menuButtonInfo.width * Ratio}`;
    state.menuButtonInfo = { ...menuButtonInfo, Ratio };
    state.xitType = systemInfo.osName;
    
    // 根据系统类型设置导航栏高度
    if (systemInfo.osName === 'ios') {
      state.IOSHEIGHT = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.IOS * Ratio;
    } else if (systemInfo.osName === 'android') {
      state.IOSHEIGHT = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.ANDROID * Ratio;
    } else if (systemInfo.osName === 'harmony') {
      state.IOSHEIGHT = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.HARMONY * Ratio;
    } else {
      state.IOSHEIGHT = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.DEFAULT * Ratio;
    }
    
    // 判断是否有主屏幕指示器
    const hasHomeIndicator = checkHasHomeIndicator(systemInfo);
    state.HAS_HOME_INDICATOR = hasHomeIndicator;
    
    // 计算TabBar相关高度
    let tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT;
    if (systemInfo.osName === 'ios') {
      tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.IOS;
    } else if (systemInfo.osName === 'android') {
      tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.ANDROID;
    } else if (systemInfo.osName === 'harmony') {
      tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.HARMONY;
    }
    
    state.TAB_BAR_HEIGHT_PX = tabBarHeightPx;
    
    // TAB_BAR_HEIGHT: 仅TabBar的高度
    state.TAB_BAR_HEIGHT = `${tabBarHeightPx * Ratio}`;
    
    // TAB_BAR_HEIGHT_WITH_INDICATOR: TabBar高度 + 主屏幕指示器高度（如果有）
    const tabBarWithIndicatorPx = hasHomeIndicator 
      ? tabBarHeightPx + PLATFORM_CONFIG.HOME_INDICATOR_HEIGHT 
      : tabBarHeightPx;
    state.TAB_BAR_HEIGHT_WITH_INDICATOR = `${tabBarWithIndicatorPx * Ratio}`;
    
    // TAB_BAR_ALL_HEIGHT: TabBar总高度（包含主屏幕指示器，如果有的话）
    state.TAB_BAR_ALL_HEIGHT = `${tabBarWithIndicatorPx * Ratio}`;
    
    if (menuButtonInfo.top && menuButtonInfo.height) {
      const gap = menuButtonInfo.top - statusBarHeightPx;
      return menuButtonInfo.height + gap * 2;
    }
  }
  return PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.DEFAULT;
}

function handleOtherPlatforms(state: EnvironmentalState, systemInfo: any, Ratio: number, statusBarHeightPx: number): number {
  const platform = systemInfo.osName;
  let navigationHeightPx: number;
  if (platform === 'ios') {
    navigationHeightPx = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.IOS;
    setDefaultMenuLayout(state, `${(statusBarHeightPx + navigationHeightPx) * Ratio}`, `${64.1711229946524 * Ratio}`);
    state.MENU_R = `${24 * Ratio}`;
    state.MENU_L = `${24 * Ratio}`;
  } else if (platform === 'android') {
    navigationHeightPx = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.ANDROID;
    setDefaultMenuLayout(state, `${(statusBarHeightPx + navigationHeightPx) * Ratio}`, `${88 * Ratio}`);
    state.MENU_R = `${24 * Ratio}`;
    state.MENU_L = `${24 * Ratio}`;
  } else {
    navigationHeightPx = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.DEFAULT;
    setDefaultMenuLayout(state, `${24 * Ratio}`, `${64.1711229946524 * Ratio}`);
    state.MENU_R = `${24 * Ratio}`;
    state.MENU_L = `${24 * Ratio}`;
  }
  return navigationHeightPx;
}

function setDefaultMenuLayout(state: EnvironmentalState, menuT: string = '24', menuH: string = '64.1711229946524'): void {
  state.MENU_T = menuT;
  state.MENU_R = '24';
  state.MENU_L = '24';
  state.MENU_H = menuH;
  state.MENU_W = '0';
}

// 修改主屏幕指示器检测逻辑
function checkHasHomeIndicator(systemInfo: any): boolean {
  console.log('systemInfo',systemInfo)
  const screenHeight = systemInfo.screenHeight || systemInfo.windowHeight;
  const statusBarHeight = systemInfo.statusBarHeight || 0;
  
  // 增强iOS设备检测
  if (systemInfo.osName === 'ios') {
    // 通过屏幕高宽比判断全面屏设备
    const isFullScreen = screenHeight / systemInfo.screenWidth > 1.9;
    return statusBarHeight >= 44 || isFullScreen;
  }

  // 增强鸿蒙设备检测
  if (systemInfo.osName === 'harmony') {
    return screenHeight >= 812 || statusBarHeight >= 44;
  }

  return false;
}

// 修正TabBar高度计算
function calculateTabBarHeight(state: EnvironmentalState, systemInfo: any, Ratio: number): void {
  const platform = process.env.UNI_PLATFORM;
  let tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT;
  let hasHomeIndicator = false;
  
  // 在 mp-weixin 和 app 平台中都需要区分系统类型
  if (platform === 'mp-weixin' || ['app', 'ios', 'android'].includes(platform)) {
    const systemPlatform = systemInfo.osName || systemInfo.osName;
    
    if (systemPlatform === 'ios') {
      hasHomeIndicator = checkHasHomeIndicator(systemInfo);
      tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.IOS;
    } else if (systemPlatform === 'android') {
      hasHomeIndicator = false; // Android 通常没有主屏幕指示器
      tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.ANDROID;
    } else if (systemPlatform === 'harmony' || systemInfo.osName === 'harmony') {
      // 鸿蒙系统处理
      hasHomeIndicator = checkHasHomeIndicator(systemInfo);
      tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.HARMONY;
    }
  }
  
  // 设置相关状态
  state.HAS_HOME_INDICATOR = hasHomeIndicator;
  state.TAB_BAR_HEIGHT_PX = tabBarHeightPx;
  
  // TabBar 基础高度（不包含主屏幕指示器）
  const tabBarOnlyPx = hasHomeIndicator 
    ? tabBarHeightPx 
    : tabBarHeightPx;
  
  // TAB_BAR_HEIGHT: 仅 TabBar 的高度
  state.TAB_BAR_HEIGHT = `${tabBarOnlyPx * Ratio}`;
  
  // TAB_BAR_HEIGHT_WITH_INDICATOR: TabBar 高度 + 主屏幕指示器高度（如果有）
  const tabBarWithIndicatorPx = hasHomeIndicator 
    ? tabBarHeightPx + PLATFORM_CONFIG.HOME_INDICATOR_HEIGHT
    : tabBarHeightPx;
    
  // 新增调试日志（发布时可移除）
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEBUG] Home Indicator状态:', {
      hasHomeIndicator,
      screenHeight: systemInfo.screenHeight,
      statusBarHeight: systemInfo.statusBarHeight,
      tabBarHeightPx,
      finalHeight: tabBarWithIndicatorPx * Ratio
    });
  }
}

function setFallbackLayout(state: EnvironmentalState): void {
  const isH5 = process.env.UNI_PLATFORM === 'h5';
  const config = isH5 ? PLATFORM_CONFIG.FALLBACK_VALUES.H5 : PLATFORM_CONFIG.FALLBACK_VALUES.OTHER;
  Object.assign(state, config);
  const defaultRatio = 2;
  state.BAR_HEIGHT = `${20 * defaultRatio}`;
  state.NAVI_HEIGHT = `${44 * defaultRatio}`;
  state.TOTAL_HEIGHT = (20 + 44) * defaultRatio;
  state.TOTAL_TOP_HEIGHT = `${(20 + 44) * defaultRatio}`;
  state.MENU_T = `${24 * defaultRatio}`;
  state.MENU_R = `${24 * defaultRatio}`;
  state.MENU_L = `${24 * defaultRatio}`;
  state.MENU_H = `${64.1711229946524 * defaultRatio}`;
  state.TAB_BAR_HEIGHT_PX = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT;
  state.TAB_BAR_HEIGHT = `${PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT * defaultRatio}`;
  state.TAB_BAR_HEIGHT_WITH_INDICATOR = state.TAB_BAR_HEIGHT;
  state.TAB_BAR_ALL_HEIGHT = state.TAB_BAR_HEIGHT;
  state.HAS_HOME_INDICATOR = false;
}
