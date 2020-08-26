import {
  Module,
  DynamicModule,
  MiddlewareConsumer,
  Inject,
} from '@nestjs/common';
import { WechatOAuthService, WechatAPIService } from './services';
import { WechatMiddleware } from './middlewares';
import {
  IWechatHelperModuleOptions,
  IWechatHelperModuleAsyncOptions,
} from './interfaces';

/**
 * Injection tokens
 */
export const WECHAT_HELPER_MODULE_OPTIONS_TOKEN = Symbol(
  'WECHAT_HELPER_MODULE_OPTIONS_TOKEN',
);

@Module({})
export class WechatHelperModule {
  constructor(
    @Inject(WECHAT_HELPER_MODULE_OPTIONS_TOKEN)
    private readonly options: IWechatHelperModuleOptions,
  ) {}

  static Register(options: IWechatHelperModuleOptions): DynamicModule {
    return {
      global: options.isGlobal,
      module: WechatHelperModule,
      providers: [
        {
          provide: WECHAT_HELPER_MODULE_OPTIONS_TOKEN,
          useValue: options,
        },
        {
          provide: WechatOAuthService,
          useFactory(config) {
            return new WechatOAuthService(config.appid, config.appsecret);
          },
          inject: [WECHAT_HELPER_MODULE_OPTIONS_TOKEN],
        },
        {
          provide: WechatAPIService,
          useFactory(config) {
            return new WechatAPIService(config.appid, config.appsecret);
          },
          inject: [WECHAT_HELPER_MODULE_OPTIONS_TOKEN],
        },
      ],
      exports: [WechatOAuthService, WechatAPIService],
    };
  }

  static RegisterAsync(
    options: IWechatHelperModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: WechatHelperModule,
      global: options.isGlobal,
      imports: options.imports || [],
      providers: [
        {
          provide: WECHAT_HELPER_MODULE_OPTIONS_TOKEN,
          useFactory: options.useFactory,
          inject: options.injects || [],
        },
        {
          provide: WechatOAuthService,
          useFactory(config) {
            return new WechatOAuthService(config.appid, config.appsecret);
          },
          inject: [WECHAT_HELPER_MODULE_OPTIONS_TOKEN],
        },
        {
          provide: WechatAPIService,
          useFactory(config) {
            return new WechatAPIService(config.appid, config.appsecret);
          },
          inject: [WECHAT_HELPER_MODULE_OPTIONS_TOKEN],
        },
      ],
      exports: [WechatOAuthService, WechatAPIService],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    if (this.options.path) {
      consumer
        .apply(
          WechatMiddleware(
            this.options,
            (request: any, response: any, next: any) => {
              next();
            },
          ),
        )
        .forRoutes(this.options.path);
    }
  }
}
