/* eslint-disable no-var */
import type { AxiosInstance } from 'axios';
import type dayJsPackage from 'dayjs';

declare global {
  var axios: AxiosInstance;
  var dayjs: typeof dayJsPackage;
}
