import { TreeDataProvider, Event, TreeItem, TreeItemCollapsibleState, ProviderResult, ThemeIcon, ThemeColor } from "vscode";
import { Store } from "../store";

class DataProvider implements TreeDataProvider<DataItem>{

    onDidChangeTreeData?: Event<DataItem | null | undefined> | undefined;
    data: DataItem[] = [];

    constructor() {
        this.initData()
    }

    initData() {
        const interFaceCat = Store.getStore().getInterFaceCat();
        interFaceCat.forEach((item: any) => {
            this.data.push(this.createrCatDataItem(item))
        });
    }

    // 创建分类节点
    createrCatDataItem(catData: any): DataItem {
        let interFaces: DataItem[] = []
        if (Array.isArray(catData.interFaces)) {
            catData.interFaces.forEach((item: any) => {
                interFaces.push(new DataItem(item, item.path, item.title))
            });
        }
        return new DataItem(catData, catData.name, undefined, interFaces)
    }

    getTreeItem(element: DataItem): TreeItem | Thenable<TreeItem> {
        return element;
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

    constructor(data: any, label: string, tooltip: string | undefined, children?: DataItem[] | undefined) {
        super(label, children === undefined ? TreeItemCollapsibleState.None : TreeItemCollapsibleState.Collapsed);
        this.children = children;
        this.tooltip = tooltip;
        this.contextValue = children === undefined ? "file" : 'folder'
        this.data = data
        this.iconPath = children === undefined ? new ThemeIcon("symbol-interface") : new ThemeIcon("debug-stackframe")
    }


}

export { DataProvider } 