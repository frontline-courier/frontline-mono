import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class FirebaseFirestoreService {

  constructor(private db: AngularFirestore) { }

  // TODO: add failure condition

  // create
  async createDocument(doc: string, data: any) {
    return this.db.collection(doc).add(data);
  }

  // read
  getDocument(doc: string, limit) {

    let count = 0;

    this.db.collection('meta').doc(doc).valueChanges()
      .subscribe((data: any) => count = data.count );

    return this.db.collection(doc, ref => ref.orderBy('id', 'desc').limit(limit))
      .snapshotChanges()
        .pipe(
          map((actions) => actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id,...data, count };
          }))
        );
  }

  getNextDocument(doc: string, docId: string, limit) {

    let count = 0;

    this.db.collection('meta').doc(doc).valueChanges()
      .subscribe((data: any) => count = data.count );

    return this.db.collection(doc, ref => ref.orderBy('id', 'desc').startAfter(docId).limit(limit))
      .snapshotChanges()
        .pipe(
          map((actions) => actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data, count };
          }))
        );
  }

  getPrevDocument(doc: string, docId: string, limit) {

    let count = 0;

    this.db.collection('meta').doc(doc).valueChanges()
      .subscribe((data: any) => count = data.count );

    return this.db.collection(doc, ref => ref.orderBy('id', 'desc').endBefore(docId).limitToLast(limit))
      .snapshotChanges()
        .pipe(
          map((actions) => actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data, count };
          }))
        );
  }

  // update
  deleteDocument(doc: string, docId: string) {
    return this.db.collection(doc).doc(docId).delete();
  }

  // delete
  updateDocument(doc: string, docId: string, data: any) {
    return this.db.collection(doc).doc(docId).update(data);
  }

  updateDocumentArray(doc: string, docId: string, data: any) {
    const ref = this.db.collection(doc).doc(docId.toString());

    const arrUnion = ref.update({
      delivery: firestore.FieldValue.arrayUnion(data)
    });
  }

}
