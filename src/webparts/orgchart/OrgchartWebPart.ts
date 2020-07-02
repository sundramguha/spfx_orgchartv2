import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'OrgchartWebPartStrings';
import Orgchart from './components/Orgchart';
import { IOrgchartProps } from './components/IOrgchartProps';
import { IOrgChartViewerProps } from './components/IOrgChartViewerProps';

export interface IOrgchartWebPartProps {
  listname: string;
}

export default class OrgchartWebPart extends BaseClientSideWebPart <IOrgchartWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IOrgChartViewerProps> = React.createElement(
      Orgchart,
      {
        listName: this.properties.listname,
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('lisname', {
                  label: strings.ListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
