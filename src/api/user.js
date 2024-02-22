import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { isEmpty } from "lodash";
import moment from "moment";
import { stateCodes } from "../constants/form";
import { REST_CODE } from "./constants";
import { firestoreDb } from "./firebase";

const generateNumber = (num) => {
  const currentNum = 1000000 + num;
  return currentNum;
};

export const getUsers = async ({
  search = null,
  pageSize = 10,
  pageIndex = 0,
  sortBy = { name: null, direction: "desc" },
}) => {
  const skip = pageIndex * pageSize;

  const coll = collection(firestoreDb, "ahli");
  const snapshot = await getCountFromServer(coll);
  const count = snapshot.data().count;

  let customQuery = query(
    coll,
    orderBy("updated_at", "desc"),
    startAfter(skip),
    limit(pageSize)
  );

  if (sortBy?.name) {
    customQuery = query(
      coll,
      orderBy(sortBy?.name, sortBy?.direction),
      startAfter(skip),
      limit(pageSize)
    );
  }

  if (search) {
    customQuery = query(
      coll,
      where("name", "in", [search]),
      orderBy(sortBy?.name, sortBy?.direction),
      startAfter(skip),
      limit(pageSize)
    );
  }

  const queryDocs = query(coll, customQuery);

  const querySnapshot = await getDocs(queryDocs);
  const docsData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    users: docsData,
    total: count,
  };
};

const updateLatestCardInfo = async (number) => {
  const cardInfoRef = doc(firestoreDb, "info", "card");
  return updateDoc(
    cardInfoRef,
    { latest_card_number: number },
    { merge: true }
  );
};

export const approveUser = async ({ id, state }) => {
  let defaultNum = 1000000;
  const docRef = doc(firestoreDb, "info", "card");
  const userRef = doc(firestoreDb, "ahli", id);
  const docSnap = await getDoc(docRef);
  const userSnap = await getDoc(userRef);
  const latestCardNumber = docSnap.data()?.latest_card_number;

  const memberIdExist = !isEmpty(userSnap.data().no_ahli);

  if (latestCardNumber) {
    defaultNum = latestCardNumber;
  }

  const newNumber = generateNumber(defaultNum - 1000000 + 1);
  const newNumberStr = newNumber.toString().substring(1);

  const negeri = userSnap.data().negeri || state;
  const stateCode = stateCodes[negeri];

  const newId = memberIdExist
    ? userSnap.data().no_ahli
    : `${stateCode}${newNumberStr}`;

  await updateLatestCardInfo(newNumber);
  await updateDoc(
    userRef,
    { no_ahli: newId, status: "approved", updated_at: moment().format() },
    { merge: true }
  );

  if (memberIdExist) {
    return {
      status: REST_CODE.MEMBER_ID_EXISTS,
      message: `Berjaya - No. ahli ${userSnap.data().no_ahli}`,
    };
  }
  return {
    status: REST_CODE.SUCCESS,
    message: "Berjaya",
  };
};

// export const updateStatusMulti = ({ ids, status }) => {
//   runTransaction(firestoreDb, async (transaction) => {
//     const sfDoc = await transaction.get(sfDocRef);
//     if (!sfDoc.exists()) {
//       throw "Document does not exist!";
//     }

//     const newPopulation = sfDoc.data().population + 1;
//     transaction.update(sfDocRef, { population: newPopulation });
//   });
// };

export const rejectUser = (id) => {
  const userRef = doc(firestoreDb, "ahli", id);
  return updateDoc(userRef, { status: "rejected" }, { merge: true });
};

const getAllNumbers = () => {
  let nums = [];
  for (let i = 0; i < 9; i += 1) {
    nums.push(1000000 + i)?.toString();
  }
  return nums;
};

export const updatedAvailableIdNumbers = async () => {
  const cardInfoRef = doc(firestoreDb, "info", "card");
  const allNumbers = getAllNumbers();

  // return setDoc(
  //   cardInfoRef,
  //   {
  //     available_numbers: allNumbers,
  //   },
  //   { merge: true }
  // );
};

const getRandomState = () => {};

export const createSampleUser = () => {
  const body = {
    negeri: "",
    nama: "",
    no_kp: "",
    alamat: "",
    tel: "",
    emel: "",
    pendidikan: "",
    pekerjaan: "",
    image: {
      profil: null,
      kad_lama: null,
    },
    jenis_kad: [],
    no_ahli: null,
    no_ahli_lama: null,
    created_at: moment().format(),
    updated_at: moment().format(),
  };

  const collectionRef = collection(firestoreDb, "ahli");
  return addDoc(collectionRef, body);
};
