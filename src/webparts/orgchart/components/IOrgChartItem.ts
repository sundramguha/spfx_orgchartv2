export interface IOrgChartItem {
    Title: string;
    Id: number;
    parent_id: number;
    Url?: string;
    Parent: any;
    Contact?: string;
    UserName?: string;
    Email?: string;
    ProfileImg?: string;
    PersonDetails: any;
}

export class ChartItem {
    id: number;
    title: string;
    url: string;
    parent_id?: number;
    contact: string;
    userName: string;
    email: string;
    profileImg : string;

    constructor(id: number, title: string, url: string, contact: string, userName: string, email: string, profileImg:string, parent_id?: number) {    
        this.id = id;
        this.title = title;
        this.parent_id = parent_id;
        this.url = url;
        this.contact = contact;
        this.userName = userName;
        this.email = email;
        this.profileImg = profileImg;
    }
}

