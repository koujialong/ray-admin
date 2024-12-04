declare module "@ant-design/cssinjs" {
  export function createCache(): Cache;
  export function extractStyle(cache: any, isServer: boolean): string;
  export const StyleProvider: React.ComponentType<{
    cache: any;
    children: ReactNode;
  }>;
  export const darkAlgorithm: MappingAlgorithm;
}

declare module "@ant-design/cssinjs/es/Cache" {
  export default class Cache {
    // 根据实际需要定义 Cache 类的方法和属性
    constructor();
    // 示例方法
    add(key: string, value: string): void;
  }
}
