export default interface HttpMethod {
  name: string;
  value: string;
  bodyAllowed: boolean;
}

const GET = {
  name: "GET",
  value: "GET",
  bodyAllowed: false,
};

const POST = {
  name: "POST",
  value: "POST",
  bodyAllowed: true,
};

const PUT = {
  name: "PUT",
  value: "PUT",
  bodyAllowed: true,
};

const PATCH = {
  name: "PATCH",
  value: "PATCH",
  bodyAllowed: true,
};

const DELETE = {
  name: "DELETE",
  value: "DELETE",
  bodyAllowed: false,
};

const HEAD = {
  name: "HEAD",
  value: "HEAD",
  bodyAllowed: false,
};

const OPTIONS = {
  name: "OPTIONS",
  value: "OPTIONS",
  bodyAllowed: false,
};

export { GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS };
