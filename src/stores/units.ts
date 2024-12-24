//注释state.state

export const   accessEnvironmentalState = (state: any) => {
    if (process.env.UNI_PLATFORM === 'android') {
        state.UNI_PLATFORM = 'android';
        if (process.env.NODE_ENV === 'development') state.VUE_APP_ENV = 'development';
        else if (process.env.NODE_ENV === 'production') state.VUE_APP_ENV = 'production';
    } else if (process.env.UNI_PLATFORM === 'ios') {
        state.UNI_PLATFORM = 'ios';
        if (process.env.NODE_ENV === 'development') state.VUE_APP_ENV = 'develop';
        else if (process.env.NODE_ENV === 'production') state.VUE_APP_ENV = 'release';
    } else if (process.env.UNI_PLATFORM === 'h5') {
        state.UNI_PLATFORM = 'h5';
        if (process.env.NODE_ENV === 'development') state.VUE_APP_ENV = 'develop';
        else if (process.env.NODE_ENV === 'production') state.VUE_APP_ENV = 'release';
    } else if (process.env.UNI_PLATFORM === 'mp-weixin') {
        state.UNI_PLATFORM = 'mp-weixin';
        const accountInfo = uni.getAccountInfoSync();
        state.VUE_APP_ENV = accountInfo.miniProgram.envVersion;
    } else if (process.env.UNI_PLATFORM === 'harmony') { // 添加对鸿蒙的支持
        state.UNI_PLATFORM = 'harmony';
        if (process.env.NODE_ENV === 'development') state.VUE_APP_ENV = 'develop';
        else if (process.env.NODE_ENV === 'production') state.VUE_APP_ENV = 'release';
    }else if (process.env.UNI_PLATFORM === 'app') {
        state.UNI_PLATFORM = 'app';
        if (process.env.NODE_ENV === 'development') state.VUE_APP_ENV = 'develop';
        else if (process.env.NODE_ENV === 'production') state.VUE_APP_ENV = 'release';
    }
};