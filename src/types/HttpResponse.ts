export default interface HttpResponse {
  startTime: number;
  endTime: number;
  status: number;
  contentType: string;
  headers: any;
  data?: any;
  responseText?: string;
}
