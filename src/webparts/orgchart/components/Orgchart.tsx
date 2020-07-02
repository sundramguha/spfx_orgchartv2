import * as React from 'react';
import styles from './Orgchart.module.scss';
import { IOrgChartViewerProps } from './IOrgChartViewerProps';
import { IOrgChartViewerState } from './IOrgChartViewerState';
import { IOrgChartItem, ChartItem } from './IOrgChartItem';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import OrgChart from 'react-orgchart';
import 'jquery';
require('bootstrap');
require('./custom.css');

export default class Orgchart extends React.Component<IOrgChartViewerProps, IOrgChartViewerState> {
  constructor(props: IOrgChartViewerProps, state: IOrgChartViewerState) {
    super(props);

    this.state = {
      orgChartItems: []
    };

    this.processOrgChartItems();
  }

  public render(): React.ReactElement<IOrgChartViewerProps> {
    // let cssURL = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
    // SPComponentLoader.loadCss(cssURL);
    return (
      <div className={styles.orgchart}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>

              <OrgChart tree={this.state.orgChartItems} NodeComponent={this.MyNodeComponent} />

            </div>
          </div>
        </div>
      </div>
    );
  }

  private MyNodeComponent = ({ node }) => {
    if (node.url) {
      return (

        <div className={styles.card}>

          <img src={node.profileImg} className="rounded-circle mr-3" height="50px" width="50px" alt="avatar" />
          <div>
            <h3> {node.userName}</h3>
            <p>{node.contact}</p>
            <p>{node.email}</p>
            <p>{node.title}</p>
          </div>

        </div>
      );
    }
    else {
      return (
        <div className={styles.card}>
          <img src={node.profileImg} className="rounded-circle mr-3" height="50px" width="50px" alt="avatar" />
          <div>
            <h3>{node.userName}</h3>
            <p>{node.contact}</p>
            <p>{node.email}</p>
            <p>{node.title}</p>
          </div>

        </div>
      );
    }
  }

  private readOrgChartItems(): Promise<IOrgChartItem[]> {
    return new Promise<IOrgChartItem[]>((resolve: (itemId: IOrgChartItem[]) => void, reject: (error: any) => void): void => {
      //this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('OrgChartNew')/items?$select=Title,Id,Url,Contact,UserName,Email,Parent/Id,Parent/Title&$expand=Parent/Id&$orderby=Parent/Id asc`,
      //YASHINC
      //this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('orgchartNew')/items?$select=Title,Id,Url,Parent/Id,Parent/Title,PersonDetails/Title,PersonDetails/MobilePhone,PersonDetails/EMail&$expand=Parent/Id,PersonDetails/ID&$orderby=Parent/Id asc`,
      //YTPL
      this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('OrgChart')/items?$select=Title,Id,Url,Parent/Id,Parent/Title,PersonDetails/Title,PersonDetails/WorkPhone,PersonDetails/EMail&$expand=Parent/Id,PersonDetails/ID&$orderby=Parent/Id asc`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'odata-version': ''
          }
        })
        .then((response: SPHttpClientResponse): Promise<{ value: IOrgChartItem[] }> => {
          return response.json();
        })
        .then((response: { value: IOrgChartItem[] }): void => {
          resolve(response.value);
        }, (error: any): void => {
          reject(error);
        });
    });
  }

  private processOrgChartItems(): void {
    this.readOrgChartItems()
      .then((orgChartItems: IOrgChartItem[]): void => {

        let orgChartNodes: Array<ChartItem> = [];
        var count: number;
        for (count = 0; count < orgChartItems.length; count++) {
          orgChartNodes.push(new ChartItem(
            orgChartItems[count].Id,
            orgChartItems[count].Title,
            orgChartItems[count].Url,
            orgChartItems[count].PersonDetails.WorkPhone ? orgChartItems[count].PersonDetails.WorkPhone : "NA",
            orgChartItems[count].PersonDetails.Title ? orgChartItems[count].PersonDetails.Title : undefined,
            orgChartItems[count].PersonDetails.EMail ? orgChartItems[count].PersonDetails.EMail : undefined,
            orgChartItems[count].PersonDetails ? `/_layouts/15/userphoto.aspx?size=L&username=${orgChartItems[count].PersonDetails.EMail}` : undefined,
            orgChartItems[count].Parent ? orgChartItems[count].Parent.Id : undefined
            //orgChartItems[count].ProfileImg
          ));
        }

        var arrayToTree: any = require('array-to-tree');
        var orgChartHierarchyNodes: any = arrayToTree(orgChartNodes);
        var output: any = JSON.stringify(orgChartHierarchyNodes[0]);

        this.setState({
          orgChartItems: JSON.parse(output)
        });
      });
  }
}
