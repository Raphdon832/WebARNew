import { db, FieldValue } from "../lib/firebase.js";

const projectsCollection = db.collection("projects");

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

export const createProjectDoc = async ({ owner, name, slug, config }) => {
  const docRef = projectsCollection.doc();
  const payload = {
    owner,
    name,
    slug,
    config,
    viewCount: 0,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  };
  await docRef.set(payload);
  const saved = await docRef.get();
  return serialize(saved);
};

export const listProjectsByOwner = async (owner) => {
  const snapshot = await projectsCollection.where("owner", "==", owner).get();

  return snapshot.docs
    .map(serialize)
    .sort((a, b) => {
      const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
};

export const findProjectBySlug = async (slug) => {
  const snapshot = await projectsCollection.where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) return null;
  return serialize(snapshot.docs[0]);
};

export const incrementProjectView = async (projectId) => {
  const docRef = projectsCollection.doc(projectId);
  await docRef.update({
    viewCount: FieldValue.increment(1),
    updatedAt: FieldValue.serverTimestamp()
  });
};
