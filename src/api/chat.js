import http from "./request";

export function getList(data) {
  return http.post(`/anon/v1/support/list`, data, {
    custom: { auth: false, toast: true },
  });
}
export function apiMsgRead (data) {
  return http.post(`/anon/v1/support/read`, data, {
    custom: { auth: false, toast: true },
  });
}