import { SPHttpClient } from '@microsoft/sp-http';

export interface IOrgChartViewerProps {
  listName: string;
  spHttpClient: SPHttpClient;
  siteUrl: string;
}
