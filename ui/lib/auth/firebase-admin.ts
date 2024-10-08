import admin from "firebase-admin";
import { cookies } from 'next/headers';
import cache from '@/lib/cache';
import { decrypt } from "../cookie";

import serviceAccount from "./serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key
    })
  });
}

export default admin;

export const getUserByToken = async (token?: string) => {
  let idToken: string | undefined = token;
  if (!idToken) {
    const cookieStore = cookies();
    idToken = cookieStore.get('firebaseToken')?.value;

    if (!idToken) {
      const anonymousToken = cookieStore.get('anonymousToken')?.value;
      if (anonymousToken) {
        return { uid: decrypt(anonymousToken) };
      }
    }
  }

  if (!idToken) {
    return {};
  }

  const sessionCookie = decrypt(idToken);

  try {
    if (cache.has(`user:${sessionCookie}`)) {
      return cache.get(`user:${sessionCookie}`) as any;
    }
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    cache.set(`user:${sessionCookie}`, decodedClaims)
    return decodedClaims;
  } catch (error) {
    return {};
  }
}