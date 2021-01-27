/**
 * @Author: Sun Rising 
 * @Date: 2020-12-31 11:03:28 
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2020-12-31 13:44:34
 * @Description: 单例模式 视图窗口
 */
import { TreeDataProvider, Event, TreeItem, TreeItemCollapsibleState, ProviderResult, ThemeIcon, EventEmitter } from "vscode";
import { YapiService } from "../services/YapiService";
import { GlobalStore } from "../store/GlobalStore";

export class YapiMenuView implements TreeDataProvider<DataItem>{

    private static yapiMenuView: YapiMenuView

    private refreshEvent: EventEmitter<DataItem | null> = new EventEmitter<DataItem | null>();
    readonly onDidChangeTreeData?: Event<DataItem | null | undefined> | undefined = this.refreshEvent.event

    data: DataItem[] = [];
    isAllCollapsible: boolean = false

    private constructor() { }

    // 刷新树视图状态 耗性能
    refresh(isChangCollapsible = true): YapiMenuView {
        // 获取新的展开状态
        if (isChangCollapsible) {
            this.isAllCollapsible = GlobalStore.getStore().getGlobalContextValue("button.expandAll") as boolean
            // 置空树列表数据之后再初始化 解决展开状态无法更新的问题
            this.data = []
            this.refreshEvent.fire(null);
        }
        setTimeout(() => {
            this.initData()
            this.refreshEvent.fire(null);
        }, 200)
        return YapiMenuView.yapiMenuView
    }

    // 单例模式获取树视图提供者
    static getYapiMenuView() {
        if (!YapiMenuView.yapiMenuView) {
            YapiMenuView.yapiMenuView = new YapiMenuView()
            YapiMenuView.yapiMenuView.refresh()
        }
        return YapiMenuView.yapiMenuView
    }

    // 初始化数据
    initData() {
        this.data = []
        YapiService.getYapiService().getInterFaceCat().forEach((item: any) => {
            this.data.push(this.createrCatDataItem(item))
        });
    }

    // 创建分类节点
    createrCatDataItem(catData: any): DataItem {
        let interFaces: DataItem[] = []
        if (Array.isArray(catData.interFaces)) {
            catData.interFaces.forEach((item: any) => {
                // 显示的节点
                if (!item.isHide)
                    if (GlobalStore.getStore().getGlobalContextValue("button.showApiTitle"))
                        interFaces.push(new DataItem(item, item.title, item.path, undefined, this.isAllCollapsible))
                    else
                        interFaces.push(new DataItem(item, item.path, item.title, undefined, this.isAllCollapsible))
            });
        }
        return new DataItem(catData, catData.name, undefined, interFaces, this.isAllCollapsible)
    }

    getTreeItem(element: DataItem): TreeItem | Thenable<TreeItem> {
        return element
    }

    getChildren(element?: DataItem | undefined): ProviderResult<DataItem[]> {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }

}
class DataItem extends TreeItem {

    public children: DataItem[] | undefined;
    // 完整的节点数据
    public data: any | undefined;

    constructor(data: any, label: string, tooltip: string | undefined, children?: DataItem[] | undefined, isAllCollapsible = false) {
        super(label, children != undefined ? isAllCollapsible ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None);
        this.children = children;
        this.tooltip = tooltip;
        this.contextValue = children === undefined ? "file" : 'folder'
        this.data = data
        this.iconPath = children === undefined ? new ThemeIcon("source-control") : new ThemeIcon("tag")
    }

}