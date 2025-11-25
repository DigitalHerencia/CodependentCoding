declare module 'path' {
  const path: {
    resolve: (...paths: string[]) => string;
    dirname: (path: string) => string;
    join: (...paths: string[]) => string;
  } & Record<string, any>;
  export default path;
}

declare module 'fs/promises' {
  const readFile: (...args: any[]) => Promise<any>;
  const writeFile: (...args: any[]) => Promise<any>;
  const access: (...args: any[]) => Promise<any>;
  const mkdir: (...args: any[]) => Promise<any>;
  const copyFile: (...args: any[]) => Promise<any>;
  export { readFile, writeFile, access, mkdir, copyFile };
}

declare module 'url' {
  function fileURLToPath(url: string | URL): string;
  export { fileURLToPath };
}

interface ImportMeta {
  url: string;
}
