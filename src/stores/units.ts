/**
 * UniApp 环境状态访问器
 * 功能：根据不同平台（H5、微信小程序、App等）自动设置状态信息
 * 特色：支持TabBar高度计算，在微信小程序和App平台的iOS设备上会自动适配主屏幕指示器高度
 */

/**
 * 环境状态接口定义
 * 用于存储不同平台的布局信息和设备参数
 */
interface EnvironmentalState {
  UNI_PLATFORM: string; // 当前运行平台（h5、mp-weixin、app等）
  VUE_APP_ENV: string; // 应用环境（development、production等）
  TOTAL_TOP_HEIGHT: number; // 顶部总高度（状态栏+导航栏）rpx
  TOTAL_HEIGHT: number; // 顶部总高度数值
  BAR_HEIGHT: number; // 状态栏高度 rpx
  NAVI_HEIGHT: number; // 导航栏高度 rpx
  MENU_T: number; // 菜单按钮距离顶部距离 rpx
  MENU_R: number; // 菜单按钮距离右边距离 rpx
  MENU_L: number; // 菜单按钮距离左边距离 rpx
  MENU_H: number; // 菜单按钮高度 rpx
  MENU_W: number; // 菜单按钮宽度 rpx
  SCREEN_WIDTH: number; // 屏幕宽度 px
  SCREEN_HEIGHT: number; // 屏幕高度 px
  SCREEN_WIDTH_RPX: number; // 屏幕宽度 rpx
  SCREEN_HEIGHT_RPX: number; // 屏幕高度 rpx
  TAB_BAR_HEIGHT: number; // TabBar高度 rpx
  TAB_BAR_HEIGHT_PX: number; // TabBar高度 px
  TAB_BAR_HEIGHT_WITH_INDICATOR?: number; // TabBar高度+主屏幕指示器 rpx
  TAB_BAR_ALL_HEIGHT?: number; // TabBar总高度（包含主屏幕指示器）rpx
  HAS_HOME_INDICATOR?: boolean; // 是否有主屏幕指示器（iPhone X及以上）
  menuButtonInfo?: any; // 微信小程序菜单按钮信息
  IOSHEIGHT?: number; // iOS导航栏高度
  xitType?: any; // 系统类型  
}

/**
 * 平台配置常量
 * 定义各平台的默认高度值和回退配置
 */
const PLATFORM_CONFIG = {
  DEFAULT_STATUS_BAR_HEIGHT: 20, // 默认状态栏高度 px
  // 各平台导航栏默认高度 px
  DEFAULT_NAVIGATION_HEIGHT: {
    IOS: 44, // iOS导航栏高度
    ANDROID: 48, // Android导航栏高度
    HARMONY: 48, // 鸿蒙系统导航栏高度
    DEFAULT: 44 // 默认导航栏高度
  },
  // 各平台TabBar默认高度 px
  DEFAULT_TAB_BAR_HEIGHT: {
    IOS: 50, // iOS TabBar高度
    ANDROID: 50, // Android TabBar高度
    HARMONY: 50, // 鸿蒙系统TabBar高度
    DEFAULT: 50 // 默认TabBar高度
  },
  HOME_INDICATOR_HEIGHT: 34, // 主屏幕指示器高度 px（iPhone X及以上）
  _BASE_WIDTH: 750, // rpx基准宽度
  // 异常情况下的回退配置值
  FALLBACK_VALUES: {
    // H5平台回退配置
    H5: {
      TOTAL_TOP_HEIGHT: 88, // 顶部总高度 rpx
      TOTAL_HEIGHT: 88, // 顶部总高度数值
      MENU_T: 24, // 菜单按钮顶部距离 rpx
      MENU_R: 24, // 菜单按钮右边距离 rpx
      MENU_L: 24, // 菜单按钮左边距离 rpx
      MENU_H: 4.1711229946524, // 菜单按钮高度 rpx
      MENU_W: 0, // 菜单按钮宽度 rpx
      SCREEN_WIDTH: 375, // 屏幕宽度 px
      SCREEN_HEIGHT: 667, // 屏幕高度 px
      SCREEN_WIDTH_RPX: 750, // 屏幕宽度 rpx
      SCREEN_HEIGHT_RPX: 1334 // 屏幕高度 rpx
    },
    // 其他平台回退配置
    OTHER: {
      TOTAL_TOP_HEIGHT: 176, // 顶部总高度 rpx
      TOTAL_HEIGHT: 176, // 顶部总高度数值
      MENU_T: 24, // 菜单按钮顶部距离 rpx
      MENU_R: 24, // 菜单按钮右边距离 rpx
      MENU_L: 24, // 菜单按钮左边距离 rpx
      MENU_H: 64.1711229946524, // 菜单按钮高度 rpx
      MENU_W: 0, // 菜单按钮宽度 rpx
      SCREEN_WIDTH: 375, // 屏幕宽度 px
      SCREEN_HEIGHT: 667, // 屏幕高度 px
      SCREEN_WIDTH_RPX: 750, // 屏幕宽度 rpx
      SCREEN_HEIGHT_RPX: 1334 // 屏幕高度 rpx
    }
  }
} as const;

/**
 * 主入口函数：访问环境状态
 * @param state 环境状态对象
 */
export const accessEnvironmentalState = (state: EnvironmentalState) => {
  setPlatformAndEnvironment(state); // 设置平台和环境信息
  calculateLayoutHeights(state); // 计算布局高度
};

/**
 * 设置平台和环境信息
 * @param state 环境状态对象
 */
function setPlatformAndEnvironment(state: EnvironmentalState): void {
  const platform = process.env.UNI_PLATFORM; // 获取当前平台
  const nodeEnv = process.env.NODE_ENV; // 获取Node环境
  state.UNI_PLATFORM = platform || 'h5'; // 设置平台，默认为h5
  state.VUE_APP_ENV = ''; // 初始化应用环境
  
  // 根据不同平台设置环境变量
  switch (platform) {
    case 'android':
      // Android平台：根据NODE_ENV设置环境
      state.VUE_APP_ENV = nodeEnv === 'development' ? 'development' : 'production';
      break;
    case 'mp-weixin':
      // 微信小程序：获取小程序环境版本
      try {
        const accountInfo = uni.getAccountInfoSync();
        state.VUE_APP_ENV = accountInfo.miniProgram.envVersion;
      } catch {
        state.VUE_APP_ENV = 'develop'; // 异常时设为开发环境
      }
      break;
    default:
      // 其他平台：根据NODE_ENV设置环境
      state.VUE_APP_ENV = nodeEnv === 'development' ? 'develop' : 'release';
      break;
  }
}

/**
 * 计算布局高度
 * 根据不同平台和设备信息计算各种布局参数
 * @param state 环境状态对象
 */
function calculateLayoutHeights(state: EnvironmentalState): void {
  try {
    const systemInfo = uni.getSystemInfoSync(); // 获取系统信息
    const Ratio = PLATFORM_CONFIG._BASE_WIDTH / systemInfo.windowWidth; // 计算rpx转换比例
    
    // 设置屏幕尺寸信息
    state.SCREEN_WIDTH = systemInfo.screenWidth || systemInfo.windowWidth || 0;
    state.SCREEN_HEIGHT = systemInfo.screenHeight || systemInfo.windowHeight || 0;
    state.SCREEN_WIDTH_RPX = state.SCREEN_WIDTH * Ratio;
    state.SCREEN_HEIGHT_RPX = state.SCREEN_HEIGHT * Ratio;
    
    // 获取状态栏高度
    const statusBarHeightPx = systemInfo.statusBarHeight || PLATFORM_CONFIG.DEFAULT_STATUS_BAR_HEIGHT;
    let navigationHeightPx: any = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.DEFAULT;

    // H5平台特殊处理
    if (process.env.UNI_PLATFORM === 'h5') {
      setH5Layout(state);
      return;
    }

    // 根据平台类型处理布局
    if (process.env.UNI_PLATFORM === 'mp-weixin') {
      // 微信小程序平台
      navigationHeightPx = handleWeChatMiniProgram(state, systemInfo, Ratio, statusBarHeightPx);
    } else {
      // 其他平台（App等）
      navigationHeightPx = handleOtherPlatforms(state, systemInfo, Ratio, statusBarHeightPx);
    }

    // 设置通用布局参数
    setCommonLayout(state, statusBarHeightPx, navigationHeightPx, Ratio);
    // 计算TabBar高度
    calculateTabBarHeight(state, systemInfo, Ratio);
  } catch {
    // 异常时使用回退配置
    setFallbackLayout(state);
  }
}

/**
 * 设置通用布局参数
 * @param state 环境状态对象
 * @param statusBarHeightPx 状态栏高度 px
 * @param navigationHeightPx 导航栏高度 px
 * @param Ratio rpx转换比例
 */
function setCommonLayout(state: EnvironmentalState, statusBarHeightPx: number, navigationHeightPx: number, Ratio: number): void {
  const totalTopHeightPx = (statusBarHeightPx + navigationHeightPx) * Ratio; // 计算顶部总高度
  state.BAR_HEIGHT = statusBarHeightPx * Ratio ; // 状态栏高度 rpx
  state.NAVI_HEIGHT = navigationHeightPx * Ratio; // 导航栏高度 rpx
  state.TOTAL_TOP_HEIGHT = totalTopHeightPx; // 顶部总高度 rpx
  state.TOTAL_HEIGHT = totalTopHeightPx; // 顶部总高度数值
}

/**
 * 设置H5平台布局
 * H5平台没有原生导航栏和菜单按钮，使用固定值
 * @param state 环境状态对象
 */
function setH5Layout(state: EnvironmentalState): void {
  try {
    const systemInfo = uni.getSystemInfoSync(); // 获取系统信息
    const Ratio = PLATFORM_CONFIG._BASE_WIDTH / systemInfo.windowWidth; // 计算rpx转换比例
    
    // 设置屏幕尺寸
    state.SCREEN_WIDTH = systemInfo.screenWidth || systemInfo.windowWidth || 0;
    state.SCREEN_HEIGHT = systemInfo.screenHeight || systemInfo.windowHeight || 0;
    state.SCREEN_WIDTH_RPX = state.SCREEN_WIDTH * Ratio;
    state.SCREEN_HEIGHT_RPX = state.SCREEN_HEIGHT * Ratio;
    
    // H5平台固定高度值
    const statusBarHeightPx = 20; // H5状态栏高度
    const navigationHeightPx = 44; // H5导航栏高度
    const totalTopHeightPx = (statusBarHeightPx + navigationHeightPx) * Ratio;
    
    // 设置布局参数（H5使用固定值100）
    state.TOTAL_TOP_HEIGHT = 100;
    state.TOTAL_HEIGHT = 100;
    state.BAR_HEIGHT = 80;
    state.NAVI_HEIGHT = 100;
    
    // H5平台菜单按钮参数（全部设为0，因为H5没有原生菜单按钮）
    state.MENU_T =  0; // 菜单按钮距离顶部的距离（rpx）
    state.MENU_R = 0; // 菜单按钮距离右边的距离（rpx）
    state.MENU_L = 0; // 菜单按钮距离左边的距离（rpx），H5平台下设为0
    state.MENU_H = 0; // 菜单按钮的高度（rpx）
    state.MENU_W = 0; // 菜单按钮的宽度（rpx）
    
    // H5平台TabBar参数
    state.TAB_BAR_HEIGHT_PX = 100; // TabBar高度 px
    state.TAB_BAR_HEIGHT =100 ; // TabBar高度 rpx
    state.TAB_BAR_HEIGHT_WITH_INDICATOR = 100; // TabBar高度+指示器 rpx
    state.TAB_BAR_ALL_HEIGHT = state.TAB_BAR_HEIGHT; // TabBar总高度 rpx
    state.HAS_HOME_INDICATOR = false; // H5没有主屏幕指示器
  } catch {
    // 异常时使用回退配置
    setFallbackLayout(state);
  }
}

/**
 * 处理微信小程序平台布局
 * 获取菜单按钮信息并计算相关布局参数
 * @param state 环境状态对象
 * @param systemInfo 系统信息
 * @param Ratio rpx转换比例
 * @param statusBarHeightPx 状态栏高度 px
 * @returns 导航栏高度 px
 */
function handleWeChatMiniProgram(state: EnvironmentalState, systemInfo: any, Ratio: number, statusBarHeightPx: number): number {
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect?.(); // 获取菜单按钮边界信息
  
  if (menuButtonInfo) {
    // 设置菜单按钮位置和尺寸信息（转换为rpx）
    state.MENU_T = menuButtonInfo.top * Ratio; // 菜单按钮顶部距离
    state.MENU_R = menuButtonInfo.right * Ratio; // 菜单按钮右边距离
    state.MENU_L = menuButtonInfo.left * Ratio; // 菜单按钮左边距离
    state.MENU_H = menuButtonInfo.height * Ratio; // 菜单按钮高度
    state.MENU_W = menuButtonInfo.width * Ratio; // 菜单按钮宽度
    state.menuButtonInfo = { ...menuButtonInfo, Ratio }; // 保存完整菜单按钮信息
    state.xitType = systemInfo.osName; // 系统类型
    
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
    
    // 判断是否有主屏幕指示器（iPhone X及以上设备）
    const hasHomeIndicator = checkHasHomeIndicator(systemInfo);
    state.HAS_HOME_INDICATOR = hasHomeIndicator;
    
    // 根据系统类型计算TabBar相关高度
    let tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT;
    if (systemInfo.osName === 'ios') {
      tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.IOS;
    } else if (systemInfo.osName === 'android') {
      tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.ANDROID;
    } else if (systemInfo.osName === 'harmony') {
      tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.HARMONY;
    }
    
    state.TAB_BAR_HEIGHT_PX = tabBarHeightPx; // TabBar高度 p0703
    
    // TAB_BAR_HEIGHT: 仅TabBar的高度（rpx）
    state.TAB_BAR_HEIGHT = tabBarHeightPx * Ratio;
    
    // TAB_BAR_HEIGHT_WITH_INDICATOR: TabBar高度 + 主屏幕指示器高度（如果有）
    const tabBarWithIndicatorPx = hasHomeIndicator 
      ? tabBarHeightPx + PLATFORM_CONFIG.HOME_INDICATOR_HEIGHT 
      : tabBarHeightPx;
    state.TAB_BAR_HEIGHT_WITH_INDICATOR = tabBarWithIndicatorPx * Ratio;
    
    // TAB_BAR_ALL_HEIGHT: TabBar总高度（包含主屏幕指示器，如果有的话）
    state.TAB_BAR_ALL_HEIGHT = tabBarWithIndicatorPx * Ratio;
    
    // 计算导航栏高度：基于菜单按钮位置计算
    if (menuButtonInfo.top && menuButtonInfo.height) {
      const gap = menuButtonInfo.top - statusBarHeightPx; // 菜单按钮与状态栏的间距
      return menuButtonInfo.height + gap * 2; // 导航栏高度 = 按钮高度 + 上下间距
    }
  }
  
  // 如果无法获取菜单按钮信息，返回默认导航栏高度
  return PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.DEFAULT;
}

/**
 * 处理其他平台（App等）布局
 * 根据系统类型设置不同的导航栏和菜单布局参数
 * @param state 环境状态对象
 * @param systemInfo 系统信息
 * @param Ratio rpx转换比例
 * @param statusBarHeightPx 状态栏高度 px
 * @returns 导航栏高度 px
 */
function handleOtherPlatforms(state: EnvironmentalState, systemInfo: any, Ratio: number, statusBarHeightPx: number): number {
  const platform = systemInfo.osName; // 获取系统平台
  let navigationHeightPx: number;
  
  if (platform === 'ios') {
    // iOS平台配置
    navigationHeightPx = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.IOS;
    setDefaultMenuLayout(state, (statusBarHeightPx + navigationHeightPx) * Ratio, 64.1711229946524 * Ratio);
    state.MENU_R = 24 * Ratio; // iOS菜单按钮右边距
    state.MENU_L = 24 * Ratio; // iOS菜单按钮左边距
  } else if (platform === 'android') {
    // Android平台配置
    navigationHeightPx = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.ANDROID;
    setDefaultMenuLayout(state, (statusBarHeightPx + navigationHeightPx) * Ratio, 88 * Ratio);
    state.MENU_R = 24 * Ratio; // Android菜单按钮右边距
    state.MENU_L = 24 * Ratio; // Android菜单按钮左边距
  } else {
    // 其他平台默认配置
    navigationHeightPx = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.DEFAULT;
    setDefaultMenuLayout(state, 24 * Ratio, 64.1711229946524 * Ratio);
    state.MENU_R = 24 * Ratio; // 默认菜单按钮右边距
    state.MENU_L = 24 * Ratio; // 默认菜单按钮左边距
  }
  return navigationHeightPx;
}

/**
 * 设置默认菜单布局参数
 * @param state 环境状态对象
 * @param menuT 菜单按钮顶部距离，默认'24'
 * @param menuH 菜单按钮高度，默认'64.1711229946524'
 */
function setDefaultMenuLayout(state: EnvironmentalState, menuT: number = 24, menuH: number = 64.1711229946524): void {
  state.MENU_T = menuT; // 菜单按钮顶部距离
  state.MENU_R = 24; // 菜单按钮右边距（固定值）
  state.MENU_L = 24; // 菜单按钮左边距（固定值）
  state.MENU_H = menuH; // 菜单按钮高度
  state.MENU_W = 0; // 菜单按钮宽度（固定为0）
}

/**
 * 检测设备是否有主屏幕指示器（Home Indicator）
 * 主要用于判断iPhone X及以上设备和部分鸿蒙设备
 * @param systemInfo 系统信息对象
 * @returns 是否有主屏幕指示器
 */
function checkHasHomeIndicator(systemInfo: any): boolean {
  console.log('systemInfo',systemInfo) // 调试日志
  const screenHeight = systemInfo.screenHeight || systemInfo.windowHeight; // 屏幕高度
  const statusBarHeight = systemInfo.statusBarHeight || 0; // 状态栏高度
  
  // iOS设备检测逻辑
  if (systemInfo.osName === 'ios') {
    // 通过屏幕高宽比判断全面屏设备（iPhone X及以上）
    const isFullScreen = screenHeight / systemInfo.screenWidth > 1.9;
    return statusBarHeight >= 44 || isFullScreen; // 状态栏高度>=44px或全面屏比例
  }

  // 鸿蒙设备检测逻辑
  if (systemInfo.osName === 'harmony') {
    return screenHeight >= 812 || statusBarHeight >= 44; // 屏幕高度>=812px或状态栏高度>=44px
  }

  return false; // 其他设备默认没有主屏幕指示器
}

/**
 * 计算TabBar高度
 * 根据不同平台和系统类型计算TabBar相关高度参数
 * @param state 环境状态对象
 * @param systemInfo 系统信息
 * @param Ratio rpx转换比例
 */
function calculateTabBarHeight(state: EnvironmentalState, systemInfo: any, Ratio: number): void {
  const platform = process.env.UNI_PLATFORM; // 获取当前平台
  let tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT; // 默认TabBar高度
  let hasHomeIndicator = false; // 是否有主屏幕指示器
  
  // 在微信小程序和App平台中都需要区分系统类型
  if (platform === 'mp-weixin' || ['app', 'ios', 'android'].includes(platform)) {
    const systemPlatform = systemInfo.osName || systemInfo.osName; // 获取系统平台
    
    if (systemPlatform === 'ios') {
      // iOS系统：检测主屏幕指示器并设置TabBar高度
      hasHomeIndicator = checkHasHomeIndicator(systemInfo);
      tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.IOS;
    } else if (systemPlatform === 'android') {
      // Android系统：通常没有主屏幕指示器
      hasHomeIndicator = false;
      tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.ANDROID;
    } else if (systemPlatform === 'harmony' || systemInfo.osName === 'harmony') {
      // 鸿蒙系统：检测主屏幕指示器并设置TabBar高度
      hasHomeIndicator = checkHasHomeIndicator(systemInfo);
      tabBarHeightPx = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.HARMONY;
    }
  }
  
  // 设置相关状态
  state.HAS_HOME_INDICATOR = hasHomeIndicator; // 是否有主屏幕指示器
  state.TAB_BAR_HEIGHT_PX = tabBarHeightPx; // TabBar高度 px
  
  // TabBar基础高度（不包含主屏幕指示器）
  const tabBarOnlyPx = hasHomeIndicator 
    ? tabBarHeightPx 
    : tabBarHeightPx;
  
  // TAB_BAR_HEIGHT: 仅TabBar的高度（rpx）
  state.TAB_BAR_HEIGHT = tabBarOnlyPx * Ratio;
  
  // TAB_BAR_HEIGHT_WITH_INDICATOR: TabBar高度 + 主屏幕指示器高度（如果有）
  const tabBarWithIndicatorPx = hasHomeIndicator 
    ? tabBarHeightPx + PLATFORM_CONFIG.HOME_INDICATOR_HEIGHT
    : tabBarHeightPx;
    
  // 开发环境调试日志（发布时可移除）
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEBUG] Home Indicator状态:', {
      hasHomeIndicator, // 是否有主屏幕指示器
      screenHeight: systemInfo.screenHeight, // 屏幕高度
      statusBarHeight: systemInfo.statusBarHeight, // 状态栏高度
      tabBarHeightPx, // TabBar高度 px
      finalHeight: tabBarWithIndicatorPx * Ratio // 最终高度 rpx
    });
  }
}

/**
 * 设置回退布局配置
 * 当获取系统信息失败时使用的默认配置
 * @param state 环境状态对象
 */
function setFallbackLayout(state: EnvironmentalState): void {
  const isH5 = process.env.UNI_PLATFORM === 'h5'; // 判断是否为H5平台
  // 根据平台选择对应的回退配置
  const config = isH5 ? PLATFORM_CONFIG.FALLBACK_VALUES.H5 : PLATFORM_CONFIG.FALLBACK_VALUES.OTHER;
  Object.assign(state, config); // 应用回退配置
  
  const defaultRatio = 2; // 默认rpx转换比例
  
  // 设置状态栏和导航栏高度
  state.BAR_HEIGHT = 20 * defaultRatio; // 状态栏高度 rpx
  state.NAVI_HEIGHT = 44 * defaultRatio; // 导航栏高度 rpx
  state.TOTAL_HEIGHT = (20 + 44) * defaultRatio; // 顶部总高度数值
  state.TOTAL_TOP_HEIGHT = (20 + 44) * defaultRatio; // 顶部总高度 rpx
  
  // 设置菜单按钮参数
  state.MENU_T = 24 * defaultRatio; // 菜单按钮顶部距离 rpx
  state.MENU_R = 24 * defaultRatio; // 菜单按钮右边距离 rpx
  state.MENU_L = 24 * defaultRatio; // 菜单按钮左边距离 rpx
  state.MENU_H = 64.1711229946524 * defaultRatio; // 菜单按钮高度 rpx
  
  // 设置TabBar参数
  state.TAB_BAR_HEIGHT_PX = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT; // TabBar高度 px
  state.TAB_BAR_HEIGHT = PLATFORM_CONFIG.DEFAULT_TAB_BAR_HEIGHT.DEFAULT * defaultRatio; // TabBar高度 rpx
  state.TAB_BAR_HEIGHT_WITH_INDICATOR = state.TAB_BAR_HEIGHT; // TabBar高度+指示器 rpx
  state.TAB_BAR_ALL_HEIGHT = state.TAB_BAR_HEIGHT; // TabBar总高度 rpx
  state.HAS_HOME_INDICATOR = false; // 回退配置下默认没有主屏幕指示器
}
