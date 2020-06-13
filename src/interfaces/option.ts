export interface IWechatHelperModuleOptions {
  appid: string;
  appsecret: string;
  token: string;
  path: string;
  encodingAESKey?: string;
  checkSignature?: string;
  isGlobal?: boolean;
}

export interface IWechatHelperModuleAsyncOptions {
  isGlobal?: boolean;
  imports?: [any];
  injects?: [any];
  useFactory?: () => IWechatHelperModuleOptions;
}
