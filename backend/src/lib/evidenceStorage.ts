import { createHash, createHmac } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export type EvidenceStorageProvider = "local" | "s3";

export type StoredEvidenceObject = {
  body: Buffer;
  contentType: string;
};

function provider(env: NodeJS.ProcessEnv = process.env): EvidenceStorageProvider {
  return env.EVIDENCE_STORAGE_PROVIDER === "s3" ? "s3" : "local";
}

function localRoot(env: NodeJS.ProcessEnv = process.env) {
  return path.resolve(env.EVIDENCE_LOCAL_ROOT || path.join(process.cwd(), "data", "private-evidence"));
}

function localPath(objectKey: string, env: NodeJS.ProcessEnv = process.env) {
  const root = localRoot(env);
  const target = path.resolve(root, ...objectKey.split("/"));
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    throw new Error("Unsafe evidence object key.");
  }
  return target;
}

function sha256Hex(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

function hmac(key: Buffer | string, value: string) {
  return createHmac("sha256", key).update(value).digest();
}

function awsEncode(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function s3Url(objectKey: string, env: NodeJS.ProcessEnv) {
  const bucket = env.EVIDENCE_S3_BUCKET?.trim();
  const region = env.AWS_REGION?.trim();
  if (!bucket || !region) throw new Error("S3 evidence storage is not configured.");
  const encodedKey = objectKey.split("/").map(awsEncode).join("/");
  return new URL(`https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`);
}

function awsSigningHeaders(
  method: "GET" | "PUT" | "DELETE",
  url: URL,
  payload: Buffer,
  env: NodeJS.ProcessEnv
) {
  const accessKey = env.AWS_ACCESS_KEY_ID?.trim();
  const secretKey = env.AWS_SECRET_ACCESS_KEY?.trim();
  const region = env.AWS_REGION?.trim();
  if (!accessKey || !secretKey || !region) {
    throw new Error("AWS credentials for evidence storage are not configured.");
  }

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256Hex(payload);
  const signedHeaderMap: Record<string, string> = {
    host: url.host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  const sessionToken = env.AWS_SESSION_TOKEN?.trim();
  if (sessionToken) signedHeaderMap["x-amz-security-token"] = sessionToken;

  const signedHeaderNames = Object.keys(signedHeaderMap).sort();
  const canonicalHeaders = signedHeaderNames
    .map((name) => `${name}:${signedHeaderMap[name].trim()}\n`)
    .join("");
  const signedHeaders = signedHeaderNames.join(";");
  const canonicalRequest = [
    method,
    url.pathname,
    url.searchParams.toString(),
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");
  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");
  const kDate = hmac(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, "s3");
  const kSigning = hmac(kService, "aws4_request");
  const signature = createHmac("sha256", kSigning).update(stringToSign).digest("hex");

  return {
    ...signedHeaderMap,
    Authorization:
      `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

async function s3Request(
  method: "GET" | "PUT" | "DELETE",
  objectKey: string,
  body: Buffer,
  contentType: string | undefined,
  env: NodeJS.ProcessEnv
) {
  const url = s3Url(objectKey, env);
  const headers: Record<string, string> = awsSigningHeaders(method, url, body, env);
  if (contentType) headers["content-type"] = contentType;
  const response = await fetch(url, {
    method,
    headers,
    body: method === "GET" || method === "DELETE" ? undefined : body,
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`S3 evidence request failed (${response.status}): ${detail}`);
  }
  return response;
}

export async function putEvidenceObject(
  objectKey: string,
  body: Buffer,
  contentType: string,
  env: NodeJS.ProcessEnv = process.env
) {
  if (provider(env) === "s3") {
    await s3Request("PUT", objectKey, body, contentType, env);
    return;
  }

  const target = localPath(objectKey, env);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, body, { mode: 0o600 });
}

export async function getEvidenceObject(
  objectKey: string,
  contentType: string,
  env: NodeJS.ProcessEnv = process.env
): Promise<StoredEvidenceObject> {
  if (provider(env) === "s3") {
    const response = await s3Request("GET", objectKey, Buffer.alloc(0), undefined, env);
    return {
      body: Buffer.from(await response.arrayBuffer()),
      contentType: response.headers.get("content-type") || contentType,
    };
  }

  return {
    body: await fs.readFile(localPath(objectKey, env)),
    contentType,
  };
}

export async function deleteEvidenceObject(
  objectKey: string,
  env: NodeJS.ProcessEnv = process.env
) {
  if (provider(env) === "s3") {
    await s3Request("DELETE", objectKey, Buffer.alloc(0), undefined, env);
    return;
  }
  await fs.rm(localPath(objectKey, env), { force: true });
}

export function evidenceStorageProvider(env: NodeJS.ProcessEnv = process.env) {
  return provider(env);
}
