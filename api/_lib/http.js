export const sendJson = (response, status, body) => {
  response.status(status).json(body);
};

export const requireMethod = (request, response, method) => {
  if (request.method === method) return true;
  response.setHeader('Allow', method);
  sendJson(response, 405, { success: false, message: `Use ${method} for this endpoint.` });
  return false;
};

export const parseBody = (request) => {
  if (!request.body) return {};
  if (typeof request.body === 'string') return JSON.parse(request.body);
  return request.body;
};

export const safeErrorMessage = (error, fallback) => {
  if (error?.code === 'OUT_OF_STOCK') return error.message;
  if (error?.code === 'PRODUCT_UNAVAILABLE') return error.message;
  return fallback;
};
