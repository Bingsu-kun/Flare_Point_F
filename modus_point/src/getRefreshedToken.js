export default function (headers) {
  const refreshedApiToken = headers.get("Authorization")
  return refreshedApiToken
}