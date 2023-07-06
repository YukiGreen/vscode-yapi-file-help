import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as handlebars from 'handlebars';
import { compile } from 'json-schema-to-typescript';
var template = require('lodash/template');

// 创建请求路径
export function generateUrl(intfaceItem: any) {
  let str_arr = [
    intfaceItem.method,
    ...intfaceItem.path.split('/').filter((item: any) => item.length > 0),
  ];
  let _str_arr = str_arr.map((item, index) => {
    if (index === 0) {item = item.toLocaleLowerCase();}
    let _item = item.replace(/[\{\}]/g, '').split('');
    if (index != 0) {_item[0] = _item[0].toUpperCase();}
    return _item.join('');
  });
  return _str_arr.join('');
}

// 获取目标路径
export function getFolderPath(agrs: any) {
  // 右键文件或者文件夹拿到文件项目信息agrs，fs.lstatSync(agrs.fsPath)获取文件或目录的状态信息，判断是否是文件夹，如果是就返回这个路径，如果不是就使用path.dirname(agrs.fsPath)获取一个路径的目录名部分。
  return fs.lstatSync(agrs.fsPath).isDirectory()
    ? agrs.fsPath
    : path.dirname(agrs.fsPath);
}

// 处理json-schema
export function handleJsonSchema(jsonSchema: any, title: string) {
  if (jsonSchema.properties) {
    for (const key in jsonSchema.properties) {
      if (jsonSchema.properties[key].type == 'array') {
        Object.assign(jsonSchema.properties[key].items, {
          $ref: '#',
          title: `${title}${key}Item`,
        });
      }
    }
  }
  return jsonSchema;
}

// 解析接口数据
export async function resolveinIntfaceData(serverData: any) {
  if (!serverData.path || !serverData.method) {return;}
  // ts模板字符串
  let tsTmp = '';
  // 文件名称
  const fileName = generateUrl(serverData);
  // 接口名称
  let resInterfaceName = '';
  let reqInterfaceName = '';
  // 处理服务器响应参数
  if (serverData.res_body_is_json_schema && serverData.res_body) {
    resInterfaceName = fileName + 'Res';
    let jsonSchema = await resolveinJsonSchema(
      serverData.res_body,
      resInterfaceName
    );
    tsTmp =
      tsTmp +
      (await compile(jsonSchema, resInterfaceName, {
        bannerComment: getBannerComment(serverData),
      }));
  }
  // 处理客户端请求参数
  if (serverData.req_body_is_json_schema && serverData.req_body_other) {
    reqInterfaceName = fileName + 'Req';
    let jsonSchema = await resolveinJsonSchema(
      serverData.req_body_other,
      reqInterfaceName
    );
    tsTmp =
      tsTmp +
      (await compile(jsonSchema, reqInterfaceName, {
        bannerComment: getBannerComment(serverData),
      }));
  }
  return { fileName, tsTmp, resInterfaceName, reqInterfaceName };
}

// 解析API数据
export async function resolveinApiData(
  serverData: any[],
  isPrefix: boolean = true
) {
  let _serverData: any[] = [];
  if (Array.isArray(serverData)) {
    serverData.forEach(item => {
      _serverData.push({
        desc: item.title,
        key: generateUrl(item),
        value: item.path,
      });
    });
  }
  if (_serverData.length == 0) {return;}
  const tmpStr = fs.readFileSync(
    path.resolve(__dirname, `../../templates/api.ts.tmpl`),
    'utf-8'
  );
  const template = handlebars.compile(tmpStr);
  let templateFullStr = template({
    interfaceArray: _serverData,
    isPrefix,
  });
  return templateFullStr;
}

// 处理json_schema
export async function resolveinJsonSchema(data: string, interfaceName: string) {
  let jsonSchema = JSON.parse(data);
  if (Object.keys(jsonSchema).length == 0) {return;}
  delete jsonSchema.title;
  handleJsonSchema(jsonSchema, interfaceName);
  return jsonSchema;
}

// 获取文件的头部注释
export function getBannerComment(data: any) {
  return `/**\n* 作者:${data.username}\n*/`;
}

/**
 * 获取某个扩展文件相对于webview需要的一种特殊路径格式
 * 形如：vscode-resource:/Users/toonces/projects/vscode-cat-coding/media/cat.gif
 * @param context 上下文
 * @param relativePath 扩展中某个文件相对于根目录的路径，如 images/test.jpg
 */
export function getExtensionFileVscodeResource(
  context: vscode.ExtensionContext,
  relativePath: string
) {
  const diskPath = vscode.Uri.file(
    path.join(context.extensionPath, relativePath)
  );
  return diskPath.with({ scheme: 'vscode-resource' }).toString();
}

/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} context 上下文
 * @param {*} templatePath 相对于插件根目录的html文件相对路径
 */
export function getWebViewContent(
  context: vscode.ExtensionContext,
  templatePath: string
) {
  const resourcePath = path.join(context.extensionPath, templatePath);
  const dirPath = path.dirname(resourcePath);
  let html = fs.readFileSync(resourcePath, 'utf-8');
  // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
  // /(<link.+?href=(?!http)|<script.+?src=(?!http)|<img.+?src="(?!http)|url\("(?!http))(.+?)[\s|>]/g
  html = html.replace(/(<link.+?href=(?!http))(.+?)\s/g, (m, $1, $2) => {
    return (
      $1 +
      '"' +
      vscode.Uri.file(path.resolve(dirPath, $2))
        .with({ scheme: 'vscode-resource' })
        .toString() +
      '" '
    );
  });
  html = html.replace(/(<script.+?src=(?!http))(.+?)>/g, (m, $1, $2) => {
    return (
      $1 +
      '"' +
      vscode.Uri.file(path.resolve(dirPath, $2))
        .with({ scheme: 'vscode-resource' })
        .toString() +
      '"> '
    );
  });
  html = html.replace(
    /(<img.+?src="(?!http)|url\("(?!http))(.+?)"/g,
    (m, $1, $2) => {
      return (
        $1 +
        vscode.Uri.file(path.resolve(dirPath, $2))
          .with({ scheme: 'vscode-resource' })
          .toString() +
        '"'
      );
    }
  );
  return html;
}

/**
 * 模板解析函数
 * @param context 上下文环境
 * @param templatePath 模板的相对路径
 * @param compiledObj 注入体
 */
export function resolveinTmp(
  context: vscode.ExtensionContext,
  templatePath: string,
  compiledObj: any
) {
  const resourcePath = path.join(context.extensionPath, templatePath);
  let html = fs.readFileSync(resourcePath, 'utf-8');
  var compiled = template(html);
  return compiled(compiledObj);
}
