export interface IDataNode {
    id: number;
    parent_id: number;
    name: string; 
    email: string;
    contact: string;
    username: string;
    children: Array<IDataNode>;
}

export class OrgChartNode implements IDataNode {
    id: number;
    parent_id: number;
    name: string;
    contact: string;
    username: string;
    email: string;
    children: Array<IDataNode>;

    constructor(id: number, name: string, username: string, contact:string, email:string, children?: Array<IDataNode>) {
        this.id = id;
        this.parent_id = id;
        this.name = name;
        this.contact = contact;
        this.email = email;
        this.username = username;
        this.children = children || [];
    }

    addNode(node: IDataNode): void {
        this.children.push(node);
    }
}

