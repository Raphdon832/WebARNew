import { db, FieldValue } from "../lib/firebase.js";

const usersCollection = db.collection("users");

const serialize = (doc) => {
  const data = doc.data();
  if (!data) return null;
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt
  };
};

export const findUserByEmail = async (email) => {
  const snapshot = await usersCollection.where("email", "==", email).limit(1).get();
  if (snapshot.empty) return null;
  return serialize(snapshot.docs[0]);
};

export const createUser = async ({ email, passwordHash }) => {
  const docRef = usersCollection.doc();
  const payload = {
    email,
    passwordHash,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  };
  await docRef.set(payload);
  const saved = await docRef.get();
  return serialize(saved);
};
