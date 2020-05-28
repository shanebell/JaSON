import { DELETE, GET, HEAD, isRequestBodyAllowed, OPTIONS, PATCH, POST, PUT } from "./HttpMethod";

test("HttpMethod defines whether a request body is allowed", () => {
  expect(DELETE.bodyAllowed).toBe(false);
  expect(GET.bodyAllowed).toBe(false);
  expect(HEAD.bodyAllowed).toBe(false);
  expect(OPTIONS.bodyAllowed).toBe(false);
  expect(PATCH.bodyAllowed).toBe(true);
  expect(POST.bodyAllowed).toBe(true);
  expect(PUT.bodyAllowed).toBe(true);

  expect(isRequestBodyAllowed("DELETE")).toBe(false);
  expect(isRequestBodyAllowed("GET")).toBe(false);
  expect(isRequestBodyAllowed("HEAD")).toBe(false);
  expect(isRequestBodyAllowed("OPTIONS")).toBe(false);
  expect(isRequestBodyAllowed("PATCH")).toBe(true);
  expect(isRequestBodyAllowed("POST")).toBe(true);
  expect(isRequestBodyAllowed("PUT")).toBe(true);
});
