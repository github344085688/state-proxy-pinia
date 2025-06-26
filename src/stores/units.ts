// 环境状态访问器 - 根据不同平台设置状态信息

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
  _BASE_WIDTH: 750,
  FALLBACK_VALUES: {
    H5: {
      TOTAL_TOP_HEIGHT: '88',
      TOTAL_HEIGHT: 88,
      MENU_T: '24',
      MENU_R: '24',
      MENU_L: '24',
      MENU_H: '64.1711229946524',
      MENU_W: '0'
    },
    OTHER: {
      TOTAL_TOP_HEIGHT: '176',
      TOTAL_HEIGHT: 176,
      MENU_T: '24',
      MENU_R: '24',
      MENU_L: '24',
      MENU_H: '64.1711229946524',
      MENU_W: '0'
    }
  }
} as const;

export const accessEnvironmentalState = (state: EnvironmentalState) => {
    // 设置平台信息和环境变量
    setPlatformAndEnvironment(state);
    
    // 计算并设置布局高度信息
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
        case 'ios':
        case 'h5':
        case 'harmony':
        case 'app':
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
        
        const statusBarHeightPx = systemInfo.statusBarHeight || PLATFORM_CONFIG.DEFAULT_STATUS_BAR_HEIGHT;
        let navigationHeightPx:any = PLATFORM_CONFIG.DEFAULT_NAVIGATION_HEIGHT.DEFAULT;
        
        // H5平台特殊处理
        if (process.env.UNI_PLATFORM === 'h5') {
            setH5Layout(state);
            return;
        }
        
        // 微信小程序特殊处理
        if (process.env.UNI_PLATFORM === 'mp-weixin') {
            navigationHeightPx = handleWeChatMiniProgram(state, systemInfo, Ratio, statusBarHeightPx);
             
        } else {
            // 其他平台处理
            navigationHeightPx = handleOtherPlatforms(state, systemInfo, Ratio, statusBarHeightPx);
           
        }
        
        // 设置通用布局信息
         setCommonLayout(state, statusBarHeightPx, navigationHeightPx, Ratio);
      
        
    } catch (error) {
        // 异常情况下的回退值
        setFallbackLayout(state);
    }
}

// 设置通用布局信息
function setCommonLayout(
    state: EnvironmentalState, 
    statusBarHeightPx: number, 
    navigationHeightPx: number,
    Ratio: number
): void {
    const totalTopHeightPx = (statusBarHeightPx + navigationHeightPx)*Ratio; 
    state.BAR_HEIGHT = `${statusBarHeightPx*Ratio}`;
    state.NAVI_HEIGHT = `${navigationHeightPx*Ratio}`;
    state.TOTAL_TOP_HEIGHT = `${totalTopHeightPx}`;
    state.TOTAL_HEIGHT = totalTopHeightPx;
}


// 设置H5平台布局
function setH5Layout(state: EnvironmentalState): void {
    const config = PLATFORM_CONFIG.FALLBACK_VALUES.H5;
    Object.assign(state, config);
}

// 处理微信小程序
function handleWeChatMiniProgram(
    state: EnvironmentalState, 
    systemInfo: any, 
    Ratio: number, 
    statusBarHeightPx: number
): number {
    const menuButtonInfo = uni.getMenuButtonBoundingClientRect?.();
    
    if (menuButtonInfo) {
        // 设置菜单按钮信息
        state.MENU_T = `${menuButtonInfo.top * Ratio}`;
        state.MENU_R = `${menuButtonInfo.right * Ratio}`;
        state.MENU_L = `${menuButtonInfo.left * Ratio}`;
        state.MENU_H = `${menuButtonInfo.height * Ratio}`;
        state.MENU_W = `${menuButtonInfo.width * Ratio}`;
        
        // 扩展菜单按钮信息
        state.menuButtonInfo = {
            ...menuButtonInfo,
            Ratio,
            WINDOW_WIDTH: systemInfo.windowWidth,
            WINDOW_HEIGHT: systemInfo.windowHeight,
            LANGUAGE: systemInfo.language,
            wifiEnabled: systemInfo.wifiEnabled
        };
        
        // 计算导航栏高度
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
function handleOtherPlatforms(
    state: EnvironmentalState, 
    systemInfo: any, 
    Ratio: number, 
    statusBarHeightPx: number
): number {
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
function setDefaultMenuLayout(
    state: EnvironmentalState, 
    menuT: string = '24', 
    menuH: string = '64.1711229946524'
): void {
    state.MENU_T = menuT;
    state.MENU_R = '24';
    state.MENU_L = '24';
    state.MENU_H = menuH;
    state.MENU_W = '0';
}


// 设置回退布局
function setFallbackLayout(state: EnvironmentalState): void {
    const isH5 = process.env.UNI_PLATFORM === 'h5';
    const config = isH5 
        ? PLATFORM_CONFIG.FALLBACK_VALUES.H5 
        : PLATFORM_CONFIG.FALLBACK_VALUES.OTHER;
    
    Object.assign(state, config);
    
    if (!isH5) {
        state.BAR_HEIGHT = '20';
        state.NAVI_HEIGHT = '44';
        state.TOTAL_HEIGHT = 88; // 修正错误的回退值
    } else {
        state.BAR_HEIGHT = '20';
        state.NAVI_HEIGHT = '44';
    }
}